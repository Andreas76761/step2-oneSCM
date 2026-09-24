import { expect, test } from '@playwright/test';

const NAV = ['Dashboard', 'Quellen', 'Textcluster', 'Widersprüche', 'Dopplungen', 'Kapitelgenerator', 'Kapitelwerkstatt', 'Rollenansichten', 'Spartenansichten', 'Optimierungen', 'Terminologie', 'Evidenz', 'Freigabe', 'Export', 'Traceability', 'Einstellungen'];

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

test('[T-203] Freigabeworkflow in der UI: einreichen, freigeben; Terminologie pflegen; PDF-Export', async ({ page, request }) => {
  const h = { 'X-User-Id': 'u-admin' };
  const chapters = await (await request.get('/api/v1/chapters', { headers: h })).json();
  const ch = chapters.find((c: any) => c.title === '5. MO-Check');
  // Kapitel generieren und Lücken per API entfernen (Qualitätsgate)
  const v = await (await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: h })).json();
  for (const s of v.sections) {
    for (const b of s.blocks) {
      if (b.kind === 'gap') await request.delete(`/api/v1/content-blocks/${b.id}?reason=entfällt`, { headers: h });
      else if (b.scopeStatus === 'unconfirmed') await request.patch(`/api/v1/content-blocks/${b.id}`, { headers: h, data: { scopeStatus: 'confirmed' } });
    }
  }

  await page.goto('/freigabe');
  await page.locator('tr', { hasText: '5. MO-Check' }).click();
  await page.getByLabel('Hinweis an die Freigabe (optional)').fill('Bitte fachlich prüfen');
  await page.getByRole('button', { name: 'Zur Freigabe einreichen' }).click();
  await expect(page.getByRole('status')).toContainText('Zur Freigabe eingereicht');
  await expect(page.locator('tr', { hasText: '5. MO-Check' })).toContainText('eingereicht');
  await page.getByLabel('Kommentar (Pflicht)').fill('Fachlich geprüft');
  await page.getByRole('button', { name: 'Freigeben', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('freigegeben');
  await expect(page.locator('tr', { hasText: '5. MO-Check' })).toContainText('freigegeben');

  // Evidenzansicht der freigegebenen Version
  await page.getByRole('link', { name: 'Evidenz je Absatz ansehen →' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Evidenz');
  await expect(page.locator('.tile', { hasText: 'Nachweisquote' })).toContainText('100 %');

  // Terminologie pflegen
  await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Terminologie' }).click();
  await page.getByLabel('Bevorzugter Begriff').fill('Arbeitsliste');
  await page.getByLabel('Zu vermeidende Begriffe').fill('Aufgabenliste, To-do-Liste');
  await page.getByRole('button', { name: 'Anlegen' }).click();
  await expect(page.locator('tr', { hasText: 'Arbeitsliste' })).toContainText('To-do-Liste');

  // PDF-Export der freigegebenen Kapitel
  await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Export' }).click();
  await page.getByLabel('Format').selectOption('pdf');
  await page.getByRole('button', { name: 'Export erstellen' }).click();
  await expect(page.getByText(/PDF erstellt \(\d+ KB\)/)).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /herunterladen/ }).click();
  expect((await download).suggestedFilename()).toMatch(/\.pdf$/);
});

test('[T-204] Versionsvergleich in der UI: Unterschiede zwischen zwei Kapitelversionen', async ({ page, request }) => {
  const h = { 'X-User-Id': 'u-admin' };
  const ch = (await (await request.get('/api/v1/chapters', { headers: h })).json()).find((c: any) => c.title === '4. Vertragsbearbeitung');
  await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: h });
  const v2 = await (await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: h })).json();
  const block = v2.sections.find((s: any) => s.code === 'purpose').blocks[0];
  await request.patch(`/api/v1/content-blocks/${block.id}`, { headers: h, data: { text: 'Das Autohaus erfasst in der Vertragsbearbeitung Serviceverträge.' } });

  await page.goto(`/werkstatt/${ch.id}`);
  await page.getByRole('link', { name: 'Versionen vergleichen' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Versionsvergleich');
  await expect(page.locator('.tile', { hasText: '✎ geändert' })).toContainText('1');
  const changed = page.getByRole('article', { name: /geändert: Zweck/ });
  await expect(changed.locator('.ddel')).toContainText('Serviceverträge für Fahrzeuge');
  await expect(changed.locator('.dadd')).toContainText('erfasst in der Vertragsbearbeitung Serviceverträge.');
  await page.getByLabel('unveränderte Absätze anzeigen').check();
  await expect(page.getByRole('article', { name: /unverändert/ }).first()).toBeVisible();
});

test('[T-205] KI-Vorschlag in der Kapitelwerkstatt: Satz-Evidenz prüfen und übernehmen', async ({ page, request }) => {
  const h = { 'X-User-Id': 'u-admin' };
  expect(await (await request.get('/api/v1/llm/status', { headers: h })).json()).toMatchObject({ enabled: true, provider: 'demo' });
  const ch = (await (await request.get('/api/v1/chapters', { headers: h })).json()).find((c: any) => c.title === '4. Vertragsbearbeitung');
  await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: h });

  await page.goto(`/werkstatt/${ch.id}`);
  const purpose = page.locator('.ws-section', { has: page.getByRole('heading', { name: '1. Zweck' }) }).getByRole('article').first();
  await purpose.getByRole('button', { name: '✨ KI-Vorschlag' }).click();
  const proposal = purpose.locator('.rewrite');
  await expect(proposal).toContainText('jeder Satz belegt');
  await expect(proposal.locator('.rewrite-sentences li').first()).toContainText('Abdeckung');
  await proposal.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(page.getByText(/KI-Vorschlag übernommen/)).toBeVisible();
  await expect(purpose.locator('.tag.st-ai_rewritten')).toHaveText('✨ KI-umformuliert');
  await purpose.locator('.block-meta').first().click();
  await expect(page.getByRole('heading', { name: 'Satz-Evidenz (KI-umformuliert)' })).toBeVisible();
});
