import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// WCAG 2.2 AA (ADR-016): automatische Prüfung der Hauptseiten
const PAGES = ['/', '/quellen', '/cluster', '/widersprueche', '/dopplungen', '/generator', '/werkstatt', '/rollen', '/sparten', '/optimierungen',
  '/terminologie', '/evidenz', '/freigabe', '/export', '/traceability', '/projekte', '/einstellungen', '/veroeffentlichung', '/aufgaben', '/uebersetzungen', '/analytik', '/assistent', '/integrationen', '/kontexthilfe', '/draft-manual', '/stammdaten/inhaltsverzeichnis', '/stammdaten/abkuerzungen', '/stammdaten/glossar', '/stammdaten/bildverzeichnis', '/stammdaten/faq', '/stammdaten/planung'];

for (const path of PAGES) {
  test(`[T-208] WCAG 2.2 AA ohne Verstöße: ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.waitForLoadState('networkidle');
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const summary = result.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}× – ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
    expect(summary).toEqual([]);
  });
}

async function axe(page: import('@playwright/test').Page) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  return result.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length}× – ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
}

test('[T-208] WCAG 2.2 AA in Interaktionszuständen: Werkstatt mit Auswahl und KI-Vorschlag, Dialog, Vergleich, Dark Mode', async ({ page, request }) => {
  const h = { 'X-User-Id': 'u-admin' };
  const ch = (await (await request.get('/api/v1/chapters', { headers: h })).json()).find((c: any) => c.title === '4. Vertragsbearbeitung');
  await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: h });
  await page.goto(`/werkstatt/${ch.id}`);
  const block = page.locator('.ws-section', { has: page.getByRole('heading', { name: '1. Zweck' }) }).getByRole('article').first();
  await block.locator('.block-meta').first().click();
  await block.getByRole('button', { name: '✨ KI-Vorschlag' }).click();
  await expect(block.locator('.rewrite')).toBeVisible();
  expect(await axe(page)).toEqual([]);
  await page.getByRole('button', { name: 'Quelle öffnen' }).first().click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(await axe(page)).toEqual([]);
  await page.keyboard.press('Escape');
  await page.goto(`/vergleich/${ch.id}`);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Versionsvergleich');
  expect(await axe(page)).toEqual([]);

  await page.emulateMedia({ colorScheme: 'dark' });
  for (const path of ['/', '/quellen', `/werkstatt/${ch.id}`, '/projekte', '/einstellungen']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.waitForLoadState('networkidle');
    expect(await axe(page), `Dark Mode ${path}`).toEqual([]);
  }
});

test('[T-209] Tastatur: Sprunglink, Absatz per Tastatur auswählen, Fokus im Dialog; schmaler Bildschirm ohne Querscrollen', async ({ page }) => {
  await page.goto('/quellen');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Zum Inhalt springen' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  expect(await page.title()).toBe('Quellen – oneSCM Handbook Studio');

  // Zeile per Tastatur öffnen → Dialog; Fokus bleibt im Dialog und kehrt beim Schließen zurück
  const row = page.locator('tr.clickable').first();
  await row.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator(':focus')).toHaveCount(1);
  for (let i = 0; i < 15; i++) await page.keyboard.press('Tab');
  await expect(dialog.locator(':focus')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(row).toBeFocused();

  // Seitenwechsel setzt den Fokus auf die Überschrift
  await page.getByRole('link', { name: /Kapitelwerkstatt/ }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Kapitelwerkstatt' })).toBeFocused();
  // Absatz per Tastatur auswählen → Quellen erscheinen rechts
  const block = page.getByRole('article').first();
  await block.focus();
  await page.keyboard.press('Enter');
  await expect(block).toHaveAttribute('aria-current', 'true');
  await expect(page.getByRole('button', { name: 'Quelle öffnen' }).first()).toBeVisible();

  // Smartphone-Breite: Menü per Schalter, kein horizontales Scrollen
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/quellen', '/werkstatt', '/projekte', '/einstellungen', '/freigabe']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await page.waitForLoadState('networkidle');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `horizontaler Überlauf auf ${path}`).toBeLessThanOrEqual(0);
  }
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  await expect(nav).toBeHidden();
  await page.getByRole('button', { name: '☰ Menü' }).click();
  await expect(nav).toBeVisible();
  await nav.getByRole('link', { name: /Quellen/ }).click();
  await expect(nav).toBeHidden();
});
