import { expect, test } from '@playwright/test';

const NAV = ['Dashboard', 'Quellen', 'Textcluster', 'Widersprüche', 'Dopplungen', 'Kapitelgenerator', 'Kapitelwerkstatt', 'Rollenansichten', 'Spartenansichten', 'Optimierungen', 'Freigabe', 'Export', 'Traceability', 'Einstellungen'];

test('[T-201] Navigation, Import einer MD-Datei und Quellenliste', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  for (const item of NAV) {
    await nav.getByRole('link', { name: item }).click();
    await expect(page.getByRole('heading', { level: 1 }).first()).toHaveText(item);
  }
  await nav.getByRole('link', { name: 'Quellen' }).click();
  await page.getByTestId('file-input').setInputFiles({
    name: 'e2e_hinweis.md',
    mimeType: 'text/markdown',
    buffer: Buffer.from('# 9. E2E-Kapitel\n\n## 9.1 Test\n\nDieser Text wurde im E2E-Test für alle Sparten importiert.\n'),
  });
  await expect(page.getByRole('status')).toContainText('Import abgeschlossen');
  await expect(page.getByRole('cell', { name: 'e2e_hinweis.md' })).toBeVisible();
  await page.getByLabel('Suche').fill('E2E-Test');
  await expect(page.getByRole('cell', { name: /im E2E-Test für alle Sparten/ })).toBeVisible();
  // Sparten-Icon + Label werden gemeinsam dargestellt (US-010)
  await expect(page.locator('tr', { hasText: 'im E2E-Test' }).locator('.badge', { hasText: 'Alle' })).toContainText('🔄');
  expect(errors).toEqual([]);
});

test('[T-202] Widerspruch entscheiden, Kapitel generieren, Icons in der Kapitelwerkstatt', async ({ page, request }) => {
  await page.goto('/widersprueche');
  const row = page.locator('tr', { hasText: 'Pflicht vs. Optional' });
  await row.getByRole('button', { name: 'Texte vergleichen' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByText('Aussage A · #')).toBeVisible();
  await dialog.getByLabel('Entscheidung').selectOption('take_a');
  await dialog.getByLabel('Begründung').fill('Pflicht laut aktueller Prozessbeschreibung');
  await dialog.getByRole('button', { name: 'Entscheidung speichern' }).click();
  await expect(page.getByRole('status')).toContainText('protokolliert');

  // Übrige Blocker über die API klären
  const h = { 'X-User-Id': 'u-fachpruefung' };
  const open = await (await request.get('/api/v1/quality/findings?type=contradiction&status=open', { headers: h })).json();
  for (const f of open) {
    const outdated = /_alt|_v2/.test(f.a.path) ? 'a' : 'b';
    const res = await request.post(`/api/v1/quality/findings/${f.id}/decision`, { headers: h, data: { decision: 'outdated_source', outdated, reason: 'Veraltete Quelle' } });
    expect(res.ok()).toBeTruthy();
  }

  await page.getByRole('link', { name: 'Kapitelgenerator' }).click();
  const chapterRow = page.locator('tr', { hasText: '3. Benutzerverwaltung' });
  await chapterRow.getByRole('button', { name: 'Generieren' }).click();
  await expect(chapterRow.locator('.alert.ok')).toContainText('Version 1 erzeugt');
  await chapterRow.getByRole('button', { name: 'Werkstatt' }).click();

  await expect(page.getByRole('heading', { name: '1. Zweck' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '10. Quellen- und Freigabestatus' })).toBeVisible();
  const block = page.locator('article.block', { hasText: 'Ein Administrator muss den Benutzer freigeben' });
  await expect(block.locator('.badge', { hasText: 'HQ' })).toContainText('🏢');
  await block.getByRole('button', { name: 'Bearbeiten' }).click();
  await block.getByLabel('Text bearbeiten').fill('Ein Administrator muss den Benutzer freigeben, bevor dieser oneSCM nutzt.');
  await block.getByRole('button', { name: 'Speichern' }).click();
  await expect(page.locator('article.block', { hasText: 'bevor dieser oneSCM nutzt' }).getByText('manuell bearbeitet')).toBeVisible();
  await page.locator('article.block', { hasText: 'bevor dieser oneSCM nutzt' }).click();
  await page.getByRole('tab', { name: 'Historie' }).click();
  await expect(page.getByText('v2 edited')).toBeVisible();
  await page.getByRole('tab', { name: 'Quellen' }).click();
  await expect(page.locator('.ws-right')).toContainText('benutzerverwaltung/user_management.md');
});
