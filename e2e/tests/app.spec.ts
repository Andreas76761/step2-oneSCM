import fs from 'node:fs';
import { crc32, deflateSync } from 'node:zlib';
import { expect, test } from '@playwright/test';

const NAV = ['Dashboard', 'Quellen', 'Textcluster', 'Widersprüche', 'Dopplungen', 'Kapitelgenerator', 'Kapitelwerkstatt', 'Rollenansichten', 'Spartenansichten', 'Optimierungen', 'Terminologie', 'Evidenz', 'Freigabe', 'Export', 'Traceability', 'Einstellungen'];

test('[T-201] Navigation, Import einer MD-Datei und Quellenliste', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Start');
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  // Selteneres liegt unter „Weitere“ (ADR-053)
  await nav.getByRole('button', { name: 'Weitere' }).click();
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
  await page.getByLabel('Suche', { exact: true }).fill('E2E-Test');
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
  const versions = page.locator('.card', { hasText: 'Kapitelversionen' });
  await versions.locator('tr', { hasText: '5. MO-Check' }).click();
  await page.getByLabel('Hinweis an die Freigabe (optional)').fill('Bitte fachlich prüfen');
  await page.getByRole('button', { name: 'Zur Freigabe einreichen' }).click();
  await expect(page.getByRole('status')).toContainText('Zur Freigabe eingereicht');
  await expect(versions.locator('tr', { hasText: '5. MO-Check' })).toContainText('eingereicht');
  await page.getByLabel('Kommentar (Pflicht)').fill('Fachlich geprüft');
  await page.getByRole('button', { name: 'Freigeben', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('freigegeben');
  await expect(versions.locator('tr', { hasText: '5. MO-Check' })).toContainText('freigegeben');

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

test('[T-206] Projekte: anlegen, wechseln, Daten getrennt, Mitglied hinzufügen', async ({ page }) => {
  await page.goto('/projekte');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Projekte');
  await page.getByLabel('Projektname').fill('E2E-Werkstatthandbuch');
  await page.getByRole('button', { name: 'Anlegen' }).click();
  await expect(page.getByText('Projekt „E2E-Werkstatthandbuch“ angelegt.')).toBeVisible();
  const row = page.getByRole('row', { name: /E2E-Werkstatthandbuch/ });
  await row.getByRole('button', { name: 'Mitglieder' }).click();
  await page.getByLabel('Benutzerkennung').fill('u-leser');
  await page.getByRole('checkbox', { name: 'bearbeiten' }).check();
  await page.getByRole('button', { name: 'Speichern' }).click();
  await expect(page.getByRole('cell', { name: /u-leser/ })).toBeVisible();

  // Wechsel über die Projektauswahl: neues Projekt ist leer
  await page.getByLabel('Projekt', { exact: true }).selectOption({ label: 'E2E-Werkstatthandbuch' });
  await page.waitForURL((u) => u.pathname === '/');
  await expect(page.getByLabel('Projekt', { exact: true })).not.toHaveValue('p_default');
  await page.goto('/quellen');
  await expect(page.getByText('Noch keine Importe.')).toBeVisible();
  // zurück ins Standardprojekt
  await page.getByLabel('Projekt', { exact: true }).selectOption('p_default');
  await page.waitForURL((u) => u.pathname === '/');
  await page.goto('/werkstatt');
  await expect(page.getByRole('button', { name: '4. Vertragsbearbeitung' })).toBeVisible();
});

test('[T-207] Ganzes Kapitel umformulieren: Fortschritt, Sammelprüfung, alle gültigen übernehmen; Nutzung in den Einstellungen', async ({ page, request }) => {
  const h = { 'X-User-Id': 'u-admin' };
  const ch = (await (await request.get('/api/v1/chapters', { headers: h })).json()).find((c: any) => c.title === '3. Benutzerverwaltung');
  await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: h });

  await page.goto(`/werkstatt/${ch.id}`);
  await page.getByRole('button', { name: '✨ Kapitel umformulieren' }).click();
  const panel = page.getByRole('region', { name: 'KI-Umformulierung des Kapitels' });
  await panel.getByRole('button', { name: 'Vorschläge für alle Absätze anfordern' }).click();
  await expect(panel.getByRole('heading', { name: /Sammelprüfung: \d+ offene Vorschläge/ })).toBeVisible();
  await expect(panel).toContainText('abgeschlossen');
  await panel.getByRole('button', { name: /Alle gültigen übernehmen/ }).click();
  await expect(page.getByText(/\d+ Vorschläge übernommen/)).toBeVisible();
  await expect(page.locator('.tag.st-ai_rewritten').first()).toBeVisible();

  await page.goto('/einstellungen');
  await expect(page.getByRole('cell', { name: 'demo/demo-extractive' })).toBeVisible();
});

test('[T-210] Semantische Suche auf der Quellenseite', async ({ page }) => {
  await page.goto('/quellen');
  const search = page.getByRole('search', { name: 'Semantische Suche' });
  await search.getByLabel('Semantische Suchanfrage').fill('Vertrag zur Prüfung senden');
  await search.getByRole('button', { name: 'Suchen' }).click();
  await expect(page.getByText(/\d+ Treffer · Modell local-hash-384 \(lokal\)/)).toBeVisible();
  const first = page.locator('.semantic-hits li').first();
  await expect(first).toContainText('Ähnlichkeit');
  await first.getByRole('button').click();
  await expect(page.getByRole('dialog')).toBeVisible();

  // Verfahren der Analyse wird gespeichert (und wieder zurückgesetzt)
  await page.goto('/einstellungen');
  await page.getByLabel('Verfahren (ADR-017)').selectOption('hybrid');
  await page.getByRole('button', { name: 'Speichern', exact: true }).click();
  await expect(page.getByText('Einstellungen gespeichert.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Verfahren (ADR-017)')).toHaveValue('hybrid');
  await page.getByLabel('Verfahren (ADR-017)').selectOption('tfidf');
  await page.getByRole('button', { name: 'Speichern', exact: true }).click();
  await expect(page.getByText('Einstellungen gespeichert.')).toBeVisible();
});

test('[T-211] Handbuch-Version veröffentlichen, Änderungen ansehen, Online-Hilfe herunterladen', async ({ page }) => {
  await page.goto('/veroeffentlichung');
  await page.getByLabel('Versionsnummer').fill('2026.9');
  await page.getByRole('button', { name: 'Veröffentlichen' }).click();
  await expect(page.getByText(/Version 2026\.9 veröffentlicht \(\d+ Kapitel\)/)).toBeVisible();
  await expect(page.getByRole('table').getByText('neu').first()).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Online-Hilfe (ZIP)' }).first().click();
  expect((await download).suggestedFilename()).toBe('onescm-handbuch-2026.9-online-hilfe.zip');
});

test('[T-212] Diskussion am Absatz: Erwähnung und Aufgabe, Hinweise und Aufgaben der erwähnten Person', async ({ page, request }) => {
  const h = { 'X-User-Id': 'u-admin' };
  const ch = (await (await request.get('/api/v1/chapters', { headers: h })).json()).find((c: any) => c.title === '3. Benutzerverwaltung');
  await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: h });
  await page.goto(`/werkstatt/${ch.id}`);
  await page.getByRole('article').first().locator('.block-meta').first().click();
  await page.getByRole('tab', { name: 'Diskussion' }).click();
  await page.getByLabel('Kommentartext').fill('Bitte Formulierung prüfen @u-redaktion');
  await page.getByRole('button', { name: 'Senden' }).click();
  await expect(page.getByText('Kommentar gespeichert.')).toBeVisible();
  await page.getByLabel('Kommentartext').fill('Screenshot ergänzen');
  await page.getByLabel('Art des Eintrags').selectOption('task');
  await page.getByLabel('Zuständige Person').selectOption('u-redaktion');
  await page.getByRole('button', { name: 'Aufgabe anlegen' }).click();
  await expect(page.locator('.discussion').getByText('Aufgabe offen')).toBeVisible();

  // als Redaktion: Zähler, Hinweise, Aufgabe erledigen
  await page.getByLabel('Demo-Benutzer').selectOption('u-redaktion');
  await expect(page.getByRole('link', { name: /Aufgaben & Hinweise/ }).locator('.count')).toHaveText('2');
  await page.getByRole('link', { name: /Aufgaben & Hinweise/ }).click();
  await expect(page.getByText(/hat Sie erwähnt/)).toBeVisible();
  await expect(page.locator('.card', { hasText: 'Meine offenen Aufgaben' }).getByText('Screenshot ergänzen')).toBeVisible();
  await page.getByRole('button', { name: 'Alle als gelesen markieren' }).click();
  await expect(page.getByRole('link', { name: /Aufgaben & Hinweise/ }).locator('.count')).toHaveCount(0);
});

test('[T-213] Übersetzung: Zielsprache festlegen, KI-Übersetzung mit Prüfung, Freigabe und Export', async ({ page, request }) => {
  const h = { 'X-User-Id': 'u-admin' };
  expect((await request.patch('/api/v1/projects/p_default', { headers: h, data: { languages: ['en'] } })).ok()).toBe(true);
  await page.goto('/uebersetzungen');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Übersetzungen');
  await page.getByRole('button', { name: '+ Englisch' }).click();
  await expect(page.getByText('Übersetzung Englisch angelegt.')).toBeVisible();
  await page.getByRole('button', { name: '✨ Unübersetzte Absätze mit KI übersetzen' }).click();
  await expect(page.getByLabel('Übersetzter Kapiteltitel')).toHaveValue(/\[EN\]/);
  await expect(page.getByText(/\d+ Sätze der Quelle zugeordnet/).first()).toBeVisible();
  await page.getByLabel('Kommentar zur Freigabe der Übersetzung').fill('Sprachlich geprüft');
  await page.getByRole('button', { name: 'Übersetzung freigeben' }).click();
  await expect(page.getByText('Übersetzung Englisch freigegeben.')).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export Markdown' }).click();
  expect((await download).suggestedFilename()).toMatch(/^onescm-en-.*\.md$/);
});

test('[T-214] Import aus Fremdsystemen: HTML-Datei hochladen, Git-Repository verbinden und abgleichen', async ({ page }) => {
  const { execFileSync } = await import('node:child_process');
  const fs = await import('node:fs');
  const os = await import('node:os');
  const path = await import('node:path');
  await page.goto('/quellen');
  await page.getByTestId('file-input').setInputFiles({
    name: 'confluence-seite.html',
    mimeType: 'text/html',
    buffer: Buffer.from('<html><head><title>Handbuch : 12. Kasse</title></head><body><div id="main-content"><h1>Zweck</h1><p>Die Kasse bucht Zahlungen aus Confluence.</p></div></body></html>'),
  });
  await expect(page.getByRole('status')).toContainText('Import abgeschlossen');
  await page.getByLabel('Suche', { exact: true }).fill('aus Confluence');
  await expect(page.getByRole('cell', { name: /Die Kasse bucht Zahlungen aus Confluence/ })).toBeVisible();

  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'onescm-e2e-git-'));
  const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=E2E', '-c', 'user.email=e2e@example.org', ...args], { cwd: repo });
  git('init', '-q', '-b', 'main');
  fs.writeFileSync(path.join(repo, 'lager.md'), '# 13. Lager\n\n## 13.1 Zweck\n\nDas Lager kommt aus dem Git-Repository.\n');
  git('add', '-A');
  git('commit', '-q', '-m', 'init');
  await page.getByRole('button', { name: 'Verbindung anlegen' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Name').fill('Handbuch-Repo');
  await dialog.getByLabel('Repository-URL (https)').fill(repo);
  await dialog.getByRole('button', { name: 'Anlegen und abgleichen' }).click();
  // Push-Webhook: URL und Geheimnis werden einmalig angezeigt
  const hook = page.getByRole('dialog', { name: 'Push-Webhook einrichten' });
  await expect(hook.getByLabel('Geheimnis')).toHaveValue(/^whsec_/);
  await expect(hook.getByLabel('Payload-URL')).toHaveValue(/\/api\/v1\/hooks\/source-connections\/conn_/);
  await hook.getByRole('button', { name: 'Eingetragen' }).click();
  await expect(page.getByRole('status')).toContainText('Abgleich „Handbuch-Repo“ abgeschlossen');
  await expect(page.locator('tr', { hasText: 'Handbuch-Repo' }).getByText('aktuell')).toBeVisible();
  await page.getByLabel('Suche', { exact: true }).fill('Git-Repository');
  await expect(page.getByRole('cell', { name: /Das Lager kommt aus dem Git-Repository/ })).toBeVisible();
  fs.rmSync(repo, { recursive: true, force: true });
});

test('[T-215] Analytik: Kennzahlen, Diagramme, Projektbericht und BI-Export', async ({ page }) => {
  await page.goto('/analytik');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Analytik');
  await expect(page.getByText('Nachweisabdeckung').first()).toBeVisible();
  await expect(page.getByRole('img', { name: /Befunde und Freigaben/ })).toBeVisible();
  let download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Projektbericht (PDF)' }).click();
  expect((await download).suggestedFilename()).toMatch(/^projektbericht-\d{4}-\d{2}-\d{2}\.pdf$/);
  download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Kapitelstatus als CSV' }).click();
  expect((await download).suggestedFilename()).toBe('chapters.csv');
  await page.getByLabel('Zeitraum').selectOption('30');
  await expect(page.getByRole('img', { name: /Qualität in Prozent/ })).toBeVisible();
});

test('[T-216] Mehrstufige Freigabe: Workflow festlegen, Zustimmung je Stufe, offene Entscheidungen', async ({ page, request }) => {
  const h = { 'X-User-Id': 'u-admin' };
  const ch = (await (await request.get('/api/v1/chapters', { headers: h })).json()).find((c: any) => c.title === '3. Benutzerverwaltung');
  const v = await (await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: { 'X-User-Id': 'u-redaktion' } })).json();
  for (const b of v.sections.flatMap((s: any) => s.blocks)) if (b.kind === 'gap') await request.delete(`/api/v1/content-blocks/${b.id}?reason=entfällt`, { headers: { 'X-User-Id': 'u-redaktion' } });
  await page.goto('/freigabe');
  // Workflow in der UI: zwei Stufen, Stufe 1 nur u-freigabe
  const editor = page.locator('.card', { hasText: 'Freigabeworkflow des Projekts' });
  await editor.getByRole('button', { name: '+ Stufe' }).click();
  await editor.getByLabel('Name der Stufe 1').fill('Fachprüfung');
  await editor.getByLabel('Zuständige der Stufe 1').selectOption(['u-freigabe']);
  await editor.getByRole('button', { name: '+ Stufe' }).click();
  await editor.getByLabel('Name der Stufe 2').fill('Compliance');
  await editor.getByRole('button', { name: 'Workflow speichern' }).click();
  await expect(page.getByText('Freigabeworkflow gespeichert – gilt für neue Einreichungen.')).toBeVisible();
  const submitted = await request.post(`/api/v1/chapter-versions/${v.id}/submit`, { headers: { 'X-User-Id': 'u-redaktion' }, data: {} });
  expect(submitted.ok()).toBe(true);

  // Stufe 1 als Freigabe
  await page.getByLabel('Demo-Benutzer').selectOption('u-freigabe');
  await page.goto('/freigabe');
  const mine = page.locator('.card', { hasText: 'Meine offenen Entscheidungen' });
  await mine.getByRole('row', { name: /Benutzerverwaltung/ }).click();
  await expect(page.getByText('Fachprüfung – aktuell')).toBeVisible();
  await page.getByLabel('Kommentar (Pflicht)').fill('Fachlich geprüft');
  await page.getByRole('button', { name: 'Zustimmen (Fachprüfung)' }).click();
  await expect(page.getByText('Zustimmung gespeichert.')).toBeVisible();
  await expect(page.getByText('Compliance – aktuell')).toBeVisible();

  // Stufe 2 als Administration
  await page.getByLabel('Demo-Benutzer').selectOption('u-admin');
  await page.goto('/freigabe');
  await page.locator('.card', { hasText: 'Meine offenen Entscheidungen' }).getByRole('row', { name: /Benutzerverwaltung/ }).click();
  await page.getByLabel('Kommentar (Pflicht)').fill('Compliance ok');
  await page.getByRole('button', { name: 'Zustimmen (Compliance)' }).click();
  await expect(page.getByText('Zustimmung gespeichert.')).toBeVisible();
  await expect(page.getByText('Fachprüfung – abgeschlossen')).toBeVisible();
  await expect(page.getByText('Compliance – abgeschlossen')).toBeVisible();
  // wieder einstufig für die übrigen Tests
  expect((await request.put('/api/v1/approval-workflow', { headers: h, data: { stages: [] } })).ok()).toBe(true);
});

test('[T-217] Handbuch-Assistent: Frage mit Quellenangabe, Bewertung, Wissenslücken', async ({ page }) => {
  await page.goto('/assistent');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Assistent');
  await page.getByLabel('Ihre Frage').fill('Ist eine Zurückweisung ohne Kommentar möglich?');
  await page.getByRole('button', { name: 'Fragen' }).click();
  const answer = page.locator('.card', { hasText: 'Antwort' });
  await expect(answer.getByText(/Zurückweisung ohne Kommentar ist nicht möglich/).first()).toBeVisible();
  await expect(answer.getByRole('link', { name: 'Quelle 1' })).toBeVisible();
  await expect(answer.locator('ol.sources')).toContainText('5. MO-Check');
  await answer.getByRole('button', { name: '👎 Nein' }).click();
  await expect(page.getByText('Danke für die Bewertung.')).toBeVisible();
  // Frage ohne Aussage im Handbuch → Wissenslücke
  await page.getByLabel('Ihre Frage').fill('Wie konfiguriere ich den Quantencomputer?');
  await page.getByRole('button', { name: 'Fragen' }).click();
  await expect(page.getByText('Das freigegebene Handbuch enthält dazu keine Aussage.')).toBeVisible();
  const gaps = page.locator('.card', { hasText: 'Wissenslücken' });
  await expect(gaps.getByRole('cell', { name: 'Wie konfiguriere ich den Quantencomputer?' })).toBeVisible();
  await expect(gaps.getByRole('cell', { name: /Zurückweisung ohne Kommentar/ })).toBeVisible();
});

test('[T-218] Integrationen: API-Token erstellen und verwenden, Webhook anlegen und testen', async ({ page, request }) => {
  await page.goto('/integrationen');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Integrationen');
  const tokens = page.locator('.card', { hasText: 'API-Tokens' });
  await tokens.getByLabel('Name').fill('E2E-Bot');
  await tokens.getByRole('button', { name: 'Token erstellen' }).click();
  const secret = page.getByRole('dialog', { name: 'API-Token „E2E-Bot“' });
  const token = (await secret.getByLabel('API-Token „E2E-Bot“').textContent())!.trim();
  expect(token).toMatch(/^oscm_/);
  await secret.getByRole('button', { name: 'Gespeichert' }).click();
  await expect(tokens.getByRole('cell', { name: 'E2E-Bot', exact: true })).toBeVisible();
  // Token funktioniert ohne Benutzerkopf
  const res = await request.get('/api/v1/chapters', { headers: { authorization: `Bearer ${token}` } });
  expect(res.ok()).toBe(true);

  await page.getByRole('button', { name: 'Webhook anlegen' }).click();
  const dlg = page.getByRole('dialog', { name: 'Webhook anlegen' });
  await dlg.getByLabel('Ziel-URL (https)').fill('http://127.0.0.1:9/hook');
  await dlg.getByLabel('import.finished').check();
  await dlg.getByRole('button', { name: 'Anlegen' }).click();
  await expect(page.getByRole('dialog', { name: 'Webhook-Geheimnis' }).getByLabel('Webhook-Geheimnis')).toContainText('whsec_');
  await page.getByRole('button', { name: 'Gespeichert' }).click();
  await page.getByRole('button', { name: 'Testen' }).click();
  await expect(page.getByText('Testereignis gesendet.')).toBeVisible();
  await expect(page.locator('.webhook').getByRole('cell', { name: 'ping' })).toBeVisible();
  // Widerruf
  page.once('dialog', (d) => void d.accept());
  await tokens.getByRole('button', { name: 'Token E2E-Bot widerrufen' }).click();
  await expect(tokens.getByText('widerrufen', { exact: true })).toBeVisible();
  expect((await request.get('/api/v1/chapters', { headers: { authorization: `Bearer ${token}` } })).status()).toBe(401);
});

/** Kleines gültiges PNG (einfarbig) */
function png(w: number, h: number, rgb: [number, number, number]) {
  const chunk = (type: string, data: Buffer) => {
    const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
    const out = Buffer.alloc(12 + data.length);
    out.writeUInt32BE(data.length, 0);
    td.copy(out, 4);
    out.writeUInt32BE(crc32(td), 8 + data.length);
    return out;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array.from({ length: w }, () => rgb).flat())]);
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(Buffer.concat(Array.from({ length: h }, () => row)))), chunk('IEND', Buffer.alloc(0))]);
}

test('[T-219] Bilder: Anzeige in der Kapitelwerkstatt, Bild mit Pflicht-Alternativtext einfügen', async ({ page, request }) => {
  const h = { 'X-User-Id': 'u-admin' };
  const up = await request.post('/api/v1/media', { headers: h, multipart: { file: { name: 'maske.png', mimeType: 'image/png', buffer: png(40, 20, [29, 99, 216]) } } });
  expect(up.status()).toBe(201);
  const { sha256 } = await up.json();
  const md = `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n# 11. E2E-Bilder\n\n## 11.1 Zweck\n\nDie Bildschirmmaske zeigt die Anmeldung.\n\n![Anmeldemaske im Browser](media:${sha256})\n`;
  expect((await request.post('/api/v1/imports', { headers: h, multipart: { file: { name: 'e2e_bilder.md', mimeType: 'text/markdown', buffer: Buffer.from(md) } } })).status()).toBe(202);
  let ch: any;
  await expect.poll(async () => (ch = (await (await request.get('/api/v1/chapters', { headers: h })).json()).find((c: any) => c.title === '11. E2E-Bilder'))).toBeTruthy();
  expect((await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: h })).ok()).toBe(true);

  await page.goto(`/werkstatt/${ch.id}`);
  const img = page.getByRole('img', { name: 'Anmeldemaske im Browser' });
  await expect(img).toBeVisible();
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBe(40);

  // Bild in einen Absatz einfügen: Einfügen erst mit Alternativtext möglich
  const block = page.getByRole('article').filter({ hasText: 'Die Bildschirmmaske zeigt die Anmeldung.' });
  await block.getByRole('button', { name: 'Bearbeiten' }).click();
  await block.getByRole('button', { name: '🖼️ Bild einfügen' }).click();
  await block.getByLabel(/^Bilddatei/).setInputFiles({ name: 'knopf.png', mimeType: 'image/png', buffer: png(12, 6, [200, 30, 30]) });
  const insert = block.getByRole('button', { name: 'Einfügen' });
  await expect(insert).toBeDisabled();
  await block.getByLabel('Alternativtext (Pflicht)').fill('Knopf „Anmelden“');
  await insert.click();
  await expect(block.getByLabel('Text bearbeiten')).toHaveValue(/!\[Knopf „Anmelden“\]\(media:[a-f0-9]{64}\)$/);
  await block.getByRole('button', { name: 'Speichern' }).click();
  await expect(page.getByRole('img', { name: 'Knopf „Anmelden“' })).toBeVisible();
});

test('[T-220] Kontexthilfe: Front-Matter-Zuordnung, Freischaltung, Deep-Link, Hilfe-Widget in oneSCM mit Assistent', async ({ page, request }) => {
  const admin = { 'X-User-Id': 'u-admin' };
  const project = await (await request.post('/api/v1/projects', { headers: admin, data: { name: 'E2E-Kontexthilfe', visibility: 'open' } })).json();
  const as = (user: string) => ({ 'X-User-Id': user, 'X-Project-Id': project.id });
  const md = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\nhelp_context: order.create\n---\n# 12. Aufträge anlegen\n\n## 12.1 Zweck\n\nAufträge legen Sie im Menü Verkauf an.\n';
  expect((await request.post('/api/v1/imports', { headers: as('u-admin'), multipart: { file: { name: 'auftraege.md', mimeType: 'text/markdown', buffer: Buffer.from(md) } } })).status()).toBe(202);
  let ch: any;
  await expect.poll(async () => (ch = (await (await request.get('/api/v1/chapters', { headers: as('u-admin') })).json()).find((c: any) => c.title === '12. Aufträge anlegen'))).toBeTruthy();
  const gen = await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: as('u-redaktion') });
  const v = await gen.json();
  expect(gen.ok(), JSON.stringify(v)).toBe(true);
  for (const b of v.sections.flatMap((s: any) => s.blocks)) if (b.kind === 'gap') await request.delete(`/api/v1/content-blocks/${b.id}?reason=entfällt`, { headers: as('u-redaktion') });
  expect((await request.post(`/api/v1/chapter-versions/${v.id}/submit`, { headers: as('u-redaktion'), data: {} })).ok()).toBe(true);
  expect((await request.post(`/api/v1/chapter-versions/${v.id}/approve`, { headers: as('u-freigabe'), data: { comment: 'ok' } })).ok()).toBe(true);
  expect((await request.post('/api/v1/releases', { headers: as('u-freigabe'), data: { version: 'e2e-hilfe' } })).status()).toBe(201);

  // Verwaltung im Projekt
  await page.goto('/');
  await page.evaluate((id) => localStorage.setItem('onescm.project', id), project.id);
  await page.goto('/kontexthilfe');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kontexthilfe');
  const row = page.getByRole('row', { name: /order\.create/ });
  await expect(row).toContainText('Front-Matter');
  await page.getByRole('button', { name: 'Freischalten' }).click();
  await expect(page.getByText('Öffentliche Einbettung freigeschaltet.')).toBeVisible();
  await expect(page.getByLabel('Einbettungscode')).toContainText(`data-project="${project.id}"`);
  // Deep-Link
  await row.getByRole('link', { name: 'Ansehen' }).click();
  await expect(page).toHaveURL(/\/hilfe\/order\.create$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('12. Aufträge anlegen');
  await expect(page.getByText('Aufträge legen Sie im Menü Verkauf an.')).toBeVisible();
  await page.getByLabel('Rolle').selectOption({ index: 1 });
  await expect(page).toHaveURL(/\/hilfe\/order\.create\?role=/);

  // Hilfe-Widget auf einer (nachgebildeten) oneSCM-Seite; Einbettung per HELP_EMBED_ORIGINS erlaubt
  const base = new URL(page.url()).origin;
  await page.route((u) => u.origin === base && u.pathname.startsWith('/onescm/'), (route) => route.fulfill({
    contentType: 'text/html',
    body: `<!doctype html><html lang="de"><head><title>oneSCM</title></head><body><h1>Auftrag anlegen</h1><form data-onescm-help="order.create"><label>Kunde <input id="kunde"></label></form>
<button type="button" data-onescm-help="order.create">Hilfe</button><script src="${base}/help/widget.js" data-project="${project.id}" data-role="hq"></script></body></html>`,
  }));
  await page.goto(`${base}/onescm/auftrag`);
  await expect.poll(() => page.evaluate(() => typeof (window as any).OneScmHelp)).toBe('object');
  await page.getByRole('button', { name: 'Hilfe' }).click();
  const panel = page.getByRole('dialog', { name: 'oneSCM-Hilfe' });
  await expect(panel).toBeVisible();
  await expect(panel.getByRole('button', { name: 'Hilfe schließen' })).toBeFocused();
  const frame = page.frameLocator('#onescm-help-panel iframe');
  await expect(frame.getByRole('heading', { level: 1 })).toHaveText('12. Aufträge anlegen');
  await expect(frame.getByText('Version e2e-hilfe')).toBeVisible();
  await frame.getByLabel('Frage an den Handbuch-Assistenten').fill('Wo lege ich Aufträge an?');
  await frame.getByRole('button', { name: 'Fragen' }).click();
  await expect(frame.getByRole('status')).toContainText('Menü Verkauf');
  await panel.getByRole('button', { name: 'Hilfe schließen' }).click();
  await expect(panel).toBeHidden();
  await expect(page.getByRole('button', { name: 'Hilfe' })).toBeFocused();
  // F1 im Formularbereich öffnet die Hilfe zur Stelle
  await page.getByLabel('Kunde').focus();
  await page.keyboard.press('F1');
  await expect(panel).toBeVisible();

  // zurück ins Standardprojekt (für folgende Tests)
  await page.goto(`${base}/`);
  await page.evaluate(() => localStorage.setItem('onescm.project', 'p_default'));
});

test('[T-221] Navigation einklappbar, Stammdaten: Inhaltsverzeichnis anlegen, Draft Manual mit Kennzeichnung, Abkürzungen, FAQ, Planung', async ({ page }) => {
  await page.goto('/');
  // Navigation einklappen: nur Symbole, Zustand bleibt nach Neuladen
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  await page.getByRole('button', { name: 'Navigation einklappen' }).click();
  await expect(nav.getByText('Quellen', { exact: true })).toBeHidden();
  await expect(nav.getByRole('link', { name: 'Quellen' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Navigation ausklappen' }).click();
  await expect(nav.getByText('Quellen', { exact: true })).toBeVisible();

  // Stammdaten-Untermenü unten, darunter Einstellungen
  const group = nav.getByRole('button', { name: 'Stammdaten' });
  await expect(group).toHaveAttribute('aria-expanded', 'false');
  await group.click();
  for (const item of ['Inhaltsverzeichnis', 'Abkürzungen', 'Glossar', 'Bildverzeichnis', 'FAQ', 'Planung']) await expect(nav.getByRole('link', { name: item, exact: true })).toBeVisible();
  await expect(nav.getByRole('link', { name: 'Einstellungen' })).toBeVisible();

  // Inhaltsverzeichnis: Gliederung aus der Kapitelstruktur, Variante Dealer/PKW/Blueprint
  await nav.getByRole('link', { name: 'Inhaltsverzeichnis', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Inhaltsverzeichnis');
  await page.getByRole('button', { name: 'Gliederung anlegen' }).click();
  const dlg = page.getByRole('dialog', { name: 'Gliederung anlegen' });
  await dlg.getByLabel('Name').fill('E2E Händler Pkw');
  await dlg.getByRole('checkbox', { name: /Dealer/ }).check();
  await dlg.getByRole('checkbox', { name: /PKW/ }).check();
  await dlg.getByRole('button', { name: 'Anlegen' }).click();
  await expect(page.getByText(/Gliederung „E2E Händler Pkw“ angelegt/)).toBeVisible();
  const tree = page.getByRole('list', { name: 'Gliederung' });
  await expect(tree.getByText('Vertragsbearbeitung')).toBeVisible();
  await page.getByLabel('Neues Kapitel').fill('E2E-Anhang');
  await page.getByRole('button', { name: 'Hinzufügen', exact: true }).click();
  await expect(tree.getByText('E2E-Anhang')).toBeVisible();
  await page.getByRole('button', { name: 'Als neue Version speichern' }).click();
  await expect(page.getByRole('heading', { name: 'E2E Händler Pkw – Version 2' })).toBeVisible();

  // Draft Manual: automatisch zuordnen, Kennzeichnungen sichtbar
  await page.getByRole('link', { name: 'Im Draft Manual öffnen' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Draft Manual');
  await page.getByRole('button', { name: 'Automatisch zuordnen' }).click();
  await expect(page.getByText(/Schnipsel automatisch zugeordnet/)).toBeVisible();
  const anhang = page.locator('.draft-node', { has: page.getByRole('heading', { name: /E2E-Anhang/ }) });
  await expect(anhang).toHaveClass(/gap/);
  await expect(anhang).toContainText('keine Textschnipsel zugeordnet');
  await expect(page.locator('.draft-snippet .flag').first()).toBeVisible();
  const legend = page.getByLabel('Legende');
  for (const l of ['Widerspruch', 'Dopplung', 'Warnung', 'Lücke']) await expect(legend).toContainText(l);
  // manuell zuordnen aus der Seitenleiste
  const side = page.locator('.draft-side');
  // „Ohne Kapitel“ gehört zu keiner Gliederung und bleibt nach der automatischen Zuordnung übrig
  const target = await side.getByLabel('Ziel').locator('option', { hasText: 'E2E-Anhang' }).getAttribute('value');
  await side.getByLabel('Ziel').selectOption(target!);
  await side.locator('.draft-snippet input[type=checkbox]').first().check();
  await side.getByRole('button', { name: /Zuordnen/ }).click();
  await expect(page.getByRole('status').filter({ hasText: '1 Schnipsel zugeordnet.' })).toBeVisible();
  await expect(anhang.locator('.draft-snippet')).toHaveCount(1);
  await expect(anhang).not.toHaveClass(/gap/);

  // Abkürzungen
  await nav.getByRole('link', { name: 'Abkürzungen', exact: true }).click();
  await page.getByLabel('Abkürzung', { exact: true }).fill('E2EX');
  await page.getByLabel('Bedeutung', { exact: true }).fill('Ende-zu-Ende-Test');
  await page.getByRole('button', { name: 'Hinzufügen', exact: true }).click();
  await expect(page.getByRole('cell', { name: 'Ende-zu-Ende-Test' })).toBeVisible();

  // FAQ
  await nav.getByRole('link', { name: 'FAQ', exact: true }).click();
  await page.getByRole('button', { name: 'Frage hinzufügen' }).click();
  await page.getByLabel('Frage', { exact: true }).fill('Wo finde ich meine Verträge?');
  await page.getByLabel('Antwort (Markdown)').fill('Unter **Vertragsbearbeitung**.');
  await page.getByRole('button', { name: 'Speichern' }).click();
  await page.getByText('Wo finde ich meine Verträge?').click();
  await expect(page.locator('.faq-entry strong', { hasText: 'Vertragsbearbeitung' })).toBeVisible();

  // Planung
  await nav.getByRole('link', { name: 'Planung', exact: true }).click();
  await page.getByLabel('Gliederung').selectOption({ label: 'E2E Händler Pkw – V2' });
  await page.getByLabel('Status von 1', { exact: true }).selectOption('done');
  await page.getByRole('row', { name: /^1 / }).getByRole('button', { name: 'Speichern' }).click();
  await expect(page.getByText('Planung für 1 gespeichert.')).toBeVisible();
  await expect(page.getByRole('progressbar', { name: 'Fortschritt in Prozent' })).not.toHaveAttribute('value', '0');
});

test('[T-222] Varianten-Handbuch aus dem Draft Manual, Varianten-Export, Suche, Darstellung, Gliederungsvergleich, Drag & Drop, Stammdaten-Import', async ({ page }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });

  // Draft Manual → Kapitel der Variante erzeugen, in der Werkstatt als eigene Gruppe
  await page.goto('/draft-manual');
  await page.getByLabel('Gliederung').selectOption({ label: 'E2E Händler Pkw – V2' });
  await page.getByRole('button', { name: 'Kapitel für Freigabe erzeugen' }).click();
  await expect(page.getByText(/Kapitelentwürfe erzeugt/)).toBeVisible();
  const variantTable = page.getByRole('table', { name: 'Kapitel der Variante' });
  await expect(variantTable.getByRole('cell', { name: /E2E-Anhang/ })).toBeVisible();
  await expect(variantTable.getByText('Entwurf erzeugt').first()).toBeVisible();
  expect(await axe()).toEqual([]);
  await variantTable.getByRole('link', { name: 'Werkstatt' }).first().click();
  await expect(page.getByRole('heading', { name: 'Variante: E2E Händler Pkw' })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Kapitel der Quellen' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Quellen', exact: true })).toBeVisible();

  // Export: Handbuch der Variante mit Verzeichnissen wählbar
  await nav.getByRole('link', { name: 'Export' }).click();
  await page.getByLabel('Handbuch').selectOption({ label: 'Variante: E2E Händler Pkw – V2' });
  await expect(page.getByLabel(/Verzeichnisse anhängen/)).toBeChecked();

  // Globale Suche mit Tastenkürzel „/“
  await page.locator('main').click();
  await page.keyboard.press('/');
  await expect(page.getByRole('searchbox', { name: 'Suche im Projekt' })).toBeFocused();
  await page.keyboard.type('Vertrag');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Suche');
  await expect(page.getByRole('status').filter({ hasText: /nach Relevanz sortiert/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Vertragsbearbeitung/ }).first()).toBeVisible();
  await expect(page.locator('.search-hits mark').first()).toBeVisible();
  expect(await axe()).toEqual([]);

  // Darstellung: Dunkel bleibt nach Neuladen
  await page.getByLabel('Darstellung').selectOption('dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await axe()).toEqual([]);
  await page.getByLabel('Darstellung').selectOption('system');
  await expect(page.locator('html')).not.toHaveAttribute('data-theme', /./);

  // Gliederung: Versionsvergleich und Drag & Drop
  await nav.getByRole('button', { name: 'Stammdaten' }).click();
  await nav.getByRole('link', { name: 'Inhaltsverzeichnis', exact: true }).click();
  await page.getByRole('link', { name: /E2E Händler Pkw/ }).first().click();
  await expect(page.getByRole('heading', { name: 'E2E Händler Pkw – Version 2' })).toBeVisible();
  await page.getByLabel('Vergleichen mit').selectOption({ label: 'V1' });
  const cmp = page.getByRole('region', { name: 'Versionsvergleich' });
  await expect(cmp.getByRole('heading', { name: 'V1 → V2' })).toBeVisible();
  // E2E-Anhang entstand in V1, in V2 kamen Zuordnungen hinzu (automatisch/manuell im Draft Manual)
  await expect(cmp.getByRole('row', { name: /E2E-Anhang/ })).toContainText('geändert');
  await expect(cmp.getByRole('row', { name: /E2E-Anhang/ })).toContainText('Zuordnungen: +1');
  expect(await axe()).toEqual([]);
  const tree = page.getByRole('list', { name: 'Gliederung' });
  const items = tree.locator(':scope > li');
  await page.getByRole('button', { name: 'Vergleich schließen' }).click();
  const moved = page.waitForResponse((r) => r.request().method() === 'PATCH' && r.url().includes('/outline-nodes/'));
  // HTML5-Drag & Drop mit gemeinsamem DataTransfer (dragTo scrollt bei langen Listen zwischen Start und Ziel)
  const dt = await page.evaluateHandle(() => new DataTransfer());
  await items.filter({ hasText: 'E2E-Anhang' }).dispatchEvent('dragstart', { dataTransfer: dt });
  await items.first().dispatchEvent('dragover', { dataTransfer: dt });
  await items.first().dispatchEvent('drop', { dataTransfer: dt });
  expect((await moved).status()).toBe(200);
  await expect(page.getByText('Verschoben.', { exact: true })).toBeVisible();
  await expect(items.first()).toContainText('E2E-Anhang');
  await expect(items.first().locator('.num')).toHaveText('1');

  // Stammdaten-Import aus CSV mit Vorschau
  await nav.getByRole('link', { name: 'Abkürzungen', exact: true }).click();
  await page.getByRole('button', { name: 'Aus CSV/Excel importieren' }).click();
  const imp = page.locator('.card').filter({ has: page.getByText('Import aus CSV oder Excel', { exact: true }) });
  await imp.getByLabel('Datei').setInputFiles({ name: 'abk.csv', mimeType: 'text/csv', buffer: Buffer.from('Abkürzung;Bedeutung\nE2EI;Import aus CSV\nE2EX;Ende-zu-Ende-Test\n;ohne Kürzel\n') });
  await imp.getByRole('button', { name: 'Vorschau' }).click();
  await expect(imp.getByRole('status').filter({ hasText: /Vorschau: 3 Zeilen · 1 neu · 0 aktualisieren · 1 unverändert · 1 Fehler/ })).toBeVisible();
  expect(await axe()).toEqual([]);
  await imp.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(page.getByText(/Import übernommen: 1 neu/)).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Import aus CSV' })).toBeVisible();

  // Quellen: vollständiger Stand als Option beim Import
  await nav.getByRole('link', { name: 'Quellen' }).click();
  await expect(page.getByLabel(/vollständige Stand/)).not.toBeChecked();
});

test('[T-223] Varianten abgleichen, Firmen-Layout mit Kontrastprüfung, Word-Export, Volltextsuche mit Filter', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const h = { 'X-User-Id': 'u-admin' };
  // Markt-Variante mit einem Kapitel der Blueprint-Gliederung, noch ohne Inhalte
  const fr = await (await request.post('/api/v1/outlines', { headers: h, data: { name: 'E2E Markt FR', marketScope: 'markets', markets: ['FR'], nodes: [{ title: 'Vertragsbearbeitung' }] } })).json();

  // Varianten abgleichen: übernehmbare Schnipsel und fehlende Einträge aus der Blueprint-Gliederung
  await page.goto(`/draft-manual/${fr.id}`);
  await page.getByRole('button', { name: 'Mit anderer Gliederung abgleichen' }).click();
  await page.getByLabel('Übernehmen aus').selectOption({ label: 'E2E Händler Pkw – V2' });
  await expect(page.getByRole('status').filter({ hasText: /fehlen im Ziel/ })).toBeVisible();
  await expect(page.getByText('fehlt im Ziel – anlegen').first()).toBeVisible();
  expect(await axe()).toEqual([]);
  await page.getByRole('button', { name: /Auswahl übernehmen/ }).click();
  await expect(page.getByText(/Schnipsel übernommen, \d+ Einträge angelegt/)).toBeVisible();
  await expect(page.getByRole('heading', { name: /E2E-Anhang/ }).first()).toBeVisible();

  // Firmen-Layout: zu helle Hausfarbe wird abgelehnt, gültige gespeichert
  await page.goto('/einstellungen');
  await page.getByLabel('Firmenname', { exact: true }).fill('E2E Muster AG');
  await page.getByLabel('Hausfarbe als Farbwert').fill('#ffdd00');
  await expect(page.getByRole('status').filter({ hasText: /zu hell/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Layout speichern' })).toBeDisabled();
  await page.getByLabel('Hausfarbe als Farbwert').fill('#0b5394');
  await page.getByLabel(/Titelseite mit Logo/).check();
  await page.getByRole('textbox', { name: 'Vertraulichkeitshinweis' }).fill('VERTRAULICH');
  expect(await axe()).toEqual([]);
  await page.getByRole('button', { name: 'Layout speichern' }).click();
  await expect(page.getByText('Layout gespeichert.')).toBeVisible();

  // Word-Export
  await page.goto('/export');
  await page.getByLabel('Format').selectOption('docx');
  await page.getByRole('button', { name: 'Export erstellen' }).click();
  await expect(page.getByText(/Word-Dokument erstellt/)).toBeVisible();
  await expect(page.getByRole('button', { name: /\.docx herunterladen/ })).toBeVisible();

  // Volltextsuche: Wortanfang, Filter nach Bereich
  await page.goto('/suche?q=Vertragsbearb');
  await expect(page.getByRole('status').filter({ hasText: /nach Relevanz sortiert/ })).toBeVisible();
  await page.getByRole('group', { name: 'Bereich filtern' }).getByRole('button', { name: /^Kapitel \(/ }).click();
  await expect(page.getByRole('group', { name: 'Bereich filtern' }).getByRole('button', { name: /^Kapitel \(/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.search-hits li .tag').first()).toHaveText('Kapitel');
  expect(await axe()).toEqual([]);
});

test('[T-224] Schreibstil: gelb markierte Sätze bearbeiten, korrigieren, Präsens; Bilder aus Text erzeugen, auswählen und speichern', async ({ page }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });

  // Schreibstil: freies Textfeld
  await page.goto('/');
  await nav.getByRole('link', { name: 'Schreibstil' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Schreibstil');
  await page.getByRole('textbox', { name: 'Text' }).fill('Die Daten wurden eigentlich gespeichert. Klicken Sie auf Speichern. Die Liste wird angezeigt werden.');
  await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(page.locator('.style-sentence.warn')).toHaveCount(2);
  await expect(page.locator('.style-sentence.warn').first()).toHaveCSS('background-color', 'rgb(255, 243, 176)');
  expect(await axe()).toEqual([]);
  // gelb markierten Satz anklicken und einzeln korrigieren
  await page.locator('.style-sentence.warn').first().click();
  // Einzelkorrekturen sammeln sich im Entwurf (auch nach manueller Änderung)
  await page.getByRole('button', { name: '„werden“ (Präsens)' }).click();
  await page.getByRole('textbox', { name: 'Satz' }).fill('Die Daten werden eigentlich sicher gespeichert.');
  await page.getByRole('button', { name: 'streichen' }).click();
  await expect(page.getByRole('textbox', { name: 'Satz' })).toHaveValue('Die Daten werden sicher gespeichert.');
  await page.getByRole('textbox', { name: 'Satz' }).fill('Die Daten werden gespeichert.');
  await page.getByRole('button', { name: 'Übernehmen', exact: true }).click();
  await expect(page.locator('.style-sentence.warn')).toHaveCount(1);
  // ins Präsens umwandeln (Demo-KI) und Vorschlag übernehmen
  await page.getByRole('button', { name: 'In Präsens umwandeln' }).click();
  await expect(page.getByRole('heading', { name: 'Nachher' })).toBeVisible();
  await page.getByRole('button', { name: 'Vorschlag übernehmen' }).click();
  await expect(page.getByRole('textbox', { name: 'Text' })).toHaveValue('Die Daten werden gespeichert. Klicken Sie auf Speichern. Die Liste wird angezeigt.');
  await expect(page.locator('.style-sentence.warn')).toHaveCount(0);
  // Automatisch korrigieren wiederholt, bis nichts mehr greift (Tippfehler → Füllwort → gestrichen)
  await page.getByRole('textbox', { name: 'Text' }).fill('Die Liste wurde eigendlich angezeigt.');
  await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await page.getByRole('button', { name: /Automatisch korrigieren/ }).click();
  await expect(page.getByRole('textbox', { name: 'Text' })).toHaveValue('Die Liste wird angezeigt.');
  await expect(page.getByRole('button', { name: /Automatisch korrigieren/ })).toBeDisabled();
  // Textschnipsel der Quellen (nur prüfen)
  await page.getByRole('tab', { name: 'Textschnipsel' }).click();
  await page.getByLabel('Kapitel der Quellen').selectOption({ index: 1 });
  await expect(page.getByRole('status').filter({ hasText: /Textschnipseln mit Hinweisen/ })).toBeVisible();
  expect(await axe()).toEqual([]);

  // Bilder aus Text
  await nav.getByRole('link', { name: 'Bilder' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Bilder');
  await page.getByRole('button', { name: 'Beispiel einfügen' }).click();
  await page.getByRole('button', { name: 'Bilder erzeugen' }).click();
  await expect(page.getByRole('status').filter({ hasText: '4 Bild(er) erzeugt' })).toBeVisible();
  await expect(page.locator('.diagram-card img')).toHaveCount(4);
  await expect(page.locator('.diagram-card').first().getByText('ASCII-Text')).toBeVisible();
  expect(await axe()).toEqual([]);
  // Struktur bearbeiten und neu zeichnen
  await page.getByText(/Erkannte Struktur bearbeiten/).click();
  await page.getByRole('textbox', { name: 'Titel', exact: true }).fill('Auftrag erfassen');
  await page.getByRole('button', { name: 'Neu zeichnen' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'manuell bearbeitet' })).toBeVisible();
  await expect(page.locator('.diagram-card img').first()).toHaveAttribute('alt', /Auftrag erfassen/);
  // Prozessbild und Klickstrecke auswählen und speichern
  await page.getByRole('checkbox', { name: 'Prozessbild auswählen' }).check();
  await page.getByRole('checkbox', { name: 'Klickstrecke auswählen' }).check();
  await page.getByRole('button', { name: 'Ausgewählte speichern (2)' }).click();
  await expect(page.getByText('2 Bild(er) gespeichert.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Gespeicherte Bilder' })).toBeVisible();
  await expect(page.locator('code', { hasText: /^!\[Prozessbild: Auftrag erfassen\]\(media:[a-f0-9]{64}\)$/ })).toBeVisible();
  await page.goto('/stammdaten/bildverzeichnis');
  await expect(page.getByText('Prozessbild: Auftrag erfassen').or(page.locator('input[value="Prozessbild: Auftrag erfassen"]')).first()).toBeVisible();
});

test('[T-225] Werkstatt: Stil anzeigen und korrigieren, Stapelkorrektur, Bild aus Absatz mit PNG für Word; Diagramm nachbearbeiten, Vorlage, Screenshot markieren', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const h = { 'X-User-Id': 'u-admin' };
  const md = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n# 12. E2E-Stil\n\n## 12.1 Zweck\n\nDie Auftragsdaten wurden eigentlich gespeichert.\n\nDie Liste war leer.\n\nÖffnen Sie **Verkauf > Aufträge**. Klicken Sie auf **Speichern**.\n';
  expect((await request.post('/api/v1/imports', { headers: h, multipart: { file: { name: 'e2e_stil.md', mimeType: 'text/markdown', buffer: Buffer.from(md) } } })).status()).toBe(202);
  let ch: any;
  await expect.poll(async () => (ch = (await (await request.get('/api/v1/chapters', { headers: h })).json()).find((c: any) => c.title === '12. E2E-Stil'))).toBeTruthy();
  expect((await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: h })).ok()).toBe(true);

  // Dashboard: Stilwert je Kapitel
  await page.goto('/dashboard');
  const styleCard = page.locator('.card', { has: page.getByRole('heading', { name: 'Schreibstil je Kapitel' }) });
  await expect(styleCard.getByRole('row', { name: /12\. E2E-Stil/ })).toBeVisible();
  expect(await axe()).toEqual([]);

  // Werkstatt: Stil anzeigen, gelben Satz direkt korrigieren
  await page.goto(`/werkstatt/${ch.id}`);
  await page.getByRole('button', { name: '🖋️ Stil anzeigen' }).click();
  await expect(page.getByRole('status').filter({ hasText: /Schreibstil: \d+ von \d+ Absätzen mit Problemen/ })).toBeVisible();
  const first = page.getByRole('article').filter({ hasText: 'Die Auftragsdaten wurden eigentlich gespeichert.' });
  await first.locator('.style-sentence.warn').click();
  await first.getByRole('button', { name: 'Alle Korrekturen im Satz' }).click();
  expect(await axe()).toEqual([]);
  await first.getByRole('button', { name: 'Übernehmen', exact: true }).click();
  await expect(page.getByText('Satz korrigiert.')).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Die Auftragsdaten werden gespeichert.' })).toBeVisible();

  // Stapelkorrektur mit Vorschau
  await page.getByRole('button', { name: '🖋️ Stil korrigieren' }).click();
  const dlg = page.getByRole('dialog', { name: 'Schreibstil: Kapitel automatisch korrigieren' });
  await expect(dlg.getByRole('status')).toContainText('1 Absätze mit automatischen Korrekturen');
  expect(await axe()).toEqual([]);
  await dlg.getByRole('button', { name: 'Auswahl übernehmen (1)' }).click();
  await expect(page.getByText('1 Absatz/Absätze korrigiert.')).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Die Liste ist leer.' })).toBeVisible();

  // Bild aus diesem Absatz: Klickstrecke erzeugen, speichern, einfügen; PNG-Fassung für Word
  const clickBlock = page.getByRole('article').filter({ hasText: 'Klicken Sie auf Speichern' });
  await clickBlock.getByRole('button', { name: '🎨 Bild erzeugen' }).click();
  const imgDlg = page.getByRole('dialog', { name: 'Bild aus diesem Absatz erzeugen' });
  await expect(imgDlg.getByRole('textbox', { name: 'Textstelle' })).toHaveValue(/Öffnen Sie \*\*Verkauf > Aufträge\*\*/);
  await imgDlg.getByRole('button', { name: 'Bilder erzeugen' }).click();
  await imgDlg.getByRole('checkbox', { name: 'Klickstrecke auswählen' }).check();
  expect(await axe()).toEqual([]);
  await imgDlg.getByRole('button', { name: 'Ausgewählte speichern (1)' }).click();
  await expect(page.getByText('1 Bild(er) in den Absatz eingefügt.')).toBeVisible();
  await expect(page.getByRole('img', { name: /^Klickstrecke: / })).toBeVisible();
  // im Stilmodus: Bild genau einmal, kein Bild-Markdown als Text
  await expect(page.getByRole('img', { name: /^Klickstrecke: / })).toHaveCount(1);
  await expect(page.getByRole('article').filter({ hasText: 'Klicken Sie auf Speichern' })).not.toContainText('](media:');
  const idx = await (await request.get('/api/v1/image-index', { headers: h })).json();
  const svgItem = idx.find((i: any) => i.title?.startsWith('Klickstrecke: ') && i.usedIn.chapters.some((c: any) => c.chapterId === ch.id));
  expect(svgItem).toMatchObject({ mime: 'image/svg+xml', pngSha: expect.stringMatching(/^[a-f0-9]{64}$/) });

  // Bilder: Diagramm nachbearbeiten (Reihenfolge, Form), als Vorlage speichern und laden
  await page.goto('/bilder');
  await page.getByRole('button', { name: 'Beispiel einfügen' }).click();
  await page.getByRole('button', { name: 'Bilder erzeugen' }).click();
  await page.getByText(/Erkannte Struktur bearbeiten/).click();
  await expect(page.getByRole('textbox', { name: 'Schritt 1', exact: true })).toHaveValue(/^Öffnen Sie/);
  await page.getByRole('button', { name: 'Schritt 1 nach unten' }).click();
  await expect(page.getByRole('textbox', { name: 'Schritt 2', exact: true })).toHaveValue(/^Öffnen Sie/);
  await page.getByRole('combobox', { name: 'Form', exact: true }).selectOption('square');
  await page.getByRole('button', { name: 'Neu zeichnen' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'manuell bearbeitet' })).toBeVisible();
  await expect.poll(async () => decodeURIComponent((await page.locator('.diagram-card img').nth(2).getAttribute('src')) ?? '')).toContain('rx="0"');
  await page.getByRole('textbox', { name: 'Name der Vorlage' }).fill('E2E Vorlage');
  await page.getByRole('button', { name: 'Als Vorlage speichern' }).click();
  await expect(page.getByText('Vorlage „E2E Vorlage“ gespeichert.')).toBeVisible();
  await page.getByRole('combobox', { name: 'Vorlage', exact: true }).selectOption({ label: 'E2E Vorlage' });
  await page.getByRole('button', { name: 'Vorlage laden' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'manuell bearbeitet' })).toBeVisible();
  expect(await axe()).toEqual([]);

  // Screenshot markieren: Nummern setzen, Rahmen ziehen, Legende, speichern
  await page.getByRole('tab', { name: 'Screenshot markieren' }).click();
  await page.getByTestId('screenshot-input').setInputFiles({ name: 'maske.png', mimeType: 'image/png', buffer: png(400, 200, [240, 240, 240]) });
  const canvas = page.getByTestId('screenshot-canvas');
  await expect(canvas).toBeVisible();
  await canvas.click({ position: { x: 40, y: 30 } });
  await canvas.click({ position: { x: 120, y: 60 } });
  await page.getByRole('button', { name: '▭ Rahmen ziehen' }).click();
  const box = (await canvas.boundingBox())!;
  await page.mouse.move(box.x + 150, box.y + 20);
  await page.mouse.down();
  await page.mouse.move(box.x + 250, box.y + 80, { steps: 4 });
  await page.mouse.up();
  await expect(canvas).toHaveAttribute('aria-label', 'Screenshot mit 2 Nummern und 1 Rahmen');
  await page.getByLabel('Nummer 1 Beschreibung').fill('Menü Verkauf öffnen');
  await page.getByRole('button', { name: '+ Nummer in Bildmitte' }).click();
  await expect(page.getByLabel('Nummer 3 X in Prozent')).toHaveValue('50');
  await page.getByLabel('Alternativtext (Pflicht)').fill('Maske mit markierten Klickpunkten');
  expect(await axe()).toEqual([]);
  await page.getByRole('button', { name: 'Screenshot speichern' }).click();
  await expect(page.getByText('Screenshot gespeichert.')).toBeVisible();
  await expect(page.locator('code', { hasText: /^!\[Maske mit markierten Klickpunkten\]\(media:[a-f0-9]{64}\)$/ })).toBeVisible();
});

test('[T-226] Eigene Stilregeln, Benutzerverwaltung, KI-Stapelumformulierung, Screenshot mit Pfeil/Text/Unschärfe, Suche Kapitel zuerst', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const h = { 'X-User-Id': 'u-admin' };
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });

  // Eigene Stilregeln: Formulierung mit Ersatz, Füllwörter aus
  await page.goto('/schreibstil');
  await page.getByRole('tab', { name: 'Regeln' }).click();
  await page.getByRole('button', { name: '+ Formulierung' }).click();
  await page.getByLabel('Regel 1 vermeiden').fill('zu diesem Zeitpunkt');
  await page.getByLabel('Regel 1 ersetzen durch').fill('jetzt');
  await page.getByRole('checkbox', { name: 'Füllwörter' }).uncheck();
  expect(await axe()).toEqual([]);
  await page.getByRole('button', { name: 'Stilregeln speichern' }).click();
  await expect(page.getByText('Stilregeln gespeichert.')).toBeVisible();
  await page.getByRole('tab', { name: 'Textfeld' }).click();
  await page.getByRole('textbox', { name: 'Text' }).fill('Das Feld ist zu diesem Zeitpunkt eigentlich leer.');
  await page.getByRole('button', { name: 'Prüfen', exact: true }).click();
  await expect(page.locator('.style-sentence.warn')).toHaveAttribute('title', /„jetzt“ statt „zu diesem Zeitpunkt“/);
  await expect(page.locator('.style-sentence.warn')).not.toHaveAttribute('title', /Füllwort/);
  await page.getByRole('button', { name: /Automatisch korrigieren/ }).click();
  await expect(page.getByRole('textbox', { name: 'Text' })).toHaveValue('Das Feld ist jetzt eigentlich leer.');
  // Regeln zurücksetzen (andere Tests nutzen Füllwörter)
  await request.put('/api/v1/style/rules', { headers: h, data: { disabled: [], phrases: [] } });

  // Benutzerverwaltung (unter „Weitere“)
  const more = nav.getByRole('button', { name: 'Weitere' });
  if ((await more.getAttribute('aria-expanded')) === 'false') await more.click();
  await nav.getByRole('link', { name: 'Benutzer' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Benutzer');
  await page.getByLabel('Kennung').fill('u-e2e');
  await page.getByLabel('Name', { exact: true }).last().fill('E2E Nutzerin');
  await page.getByRole('checkbox', { name: 'Bearbeiten' }).last().check();
  await page.getByRole('button', { name: 'Benutzer anlegen' }).click();
  await expect(page.getByText('Benutzer „E2E Nutzerin“ angelegt.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'E2E Nutzerin (u-e2e)' })).toBeVisible();
  await expect(page.locator('#user-select option[value="u-e2e"]')).toHaveCount(1);
  expect(await axe()).toEqual([]);
  await page.getByRole('button', { name: 'Sperren' }).click();
  await expect(page.getByText('Benutzer gesperrt.')).toBeVisible();
  await expect(page.getByRole('row', { name: /E2E Nutzerin/ }).getByText('gesperrt')).toBeVisible();
  await expect(page.locator('#user-select option[value="u-e2e"]')).toHaveCount(0);
  await page.getByRole('button', { name: 'Entsperren' }).click();
  await expect(page.getByText('Benutzer entsperrt.')).toBeVisible();

  // KI-Stapelumformulierung in der Werkstatt (Demo-KI: ins Präsens)
  const md = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n# 13. E2E-KI-Stapel\n\n## 13.1 Zweck\n\nDie Maske war leer.\n\nKlicken Sie auf **Speichern**.\n';
  expect((await request.post('/api/v1/imports', { headers: h, multipart: { file: { name: 'e2e_ki_stapel.md', mimeType: 'text/markdown', buffer: Buffer.from(md) } } })).status()).toBe(202);
  let ch: any;
  await expect.poll(async () => (ch = (await (await request.get('/api/v1/chapters', { headers: h })).json()).find((c: any) => c.title === '13. E2E-KI-Stapel'))).toBeTruthy();
  expect((await request.post(`/api/v1/chapters/${ch.id}/generate`, { headers: h })).ok()).toBe(true);
  await page.goto(`/werkstatt/${ch.id}`);
  await page.getByRole('button', { name: '🖋️ Stil korrigieren' }).click();
  const dlg = page.getByRole('dialog', { name: 'Schreibstil: Kapitel automatisch korrigieren' });
  await dlg.getByRole('button', { name: '✨ KI: ins Präsens' }).click();
  await expect(dlg.getByRole('status').filter({ hasText: /Absätze mit Vorschlägen/ })).toBeVisible();
  expect(await axe()).toEqual([]);
  await dlg.getByRole('button', { name: /^Auswahl übernehmen/ }).click();
  await expect(page.getByText(/Absatz\/Absätze umformuliert/)).toBeVisible();
  await expect(page.getByRole('article').filter({ hasText: 'Die Maske ist leer.' })).toBeVisible();

  // Screenshot: Pfeil, Textfeld, Unschärfe
  await page.goto('/bilder');
  await page.getByRole('tab', { name: 'Screenshot markieren' }).click();
  await page.getByTestId('screenshot-input').setInputFiles({ name: 'kunde.png', mimeType: 'image/png', buffer: png(400, 200, [30, 30, 30]) });
  const canvas = page.getByTestId('screenshot-canvas');
  await expect(canvas).toBeVisible();
  const box = (await canvas.boundingBox())!;
  const drag = async (x1: number, y1: number, x2: number, y2: number) => {
    await page.mouse.move(box.x + x1, box.y + y1);
    await page.mouse.down();
    await page.mouse.move(box.x + x2, box.y + y2, { steps: 4 });
    await page.mouse.up();
  };
  await page.getByRole('button', { name: '➜ Pfeil ziehen' }).click();
  await drag(20, 20, 120, 80);
  await page.getByRole('button', { name: 'T Textfeld setzen' }).click();
  await page.getByLabel('Beschriftung').fill('Pflichtfeld');
  await canvas.click({ position: { x: 150, y: 40 } });
  await expect(page.getByLabel('Textfeld 1', { exact: true })).toHaveValue('Pflichtfeld');
  await page.getByRole('button', { name: '▦ Unkenntlich machen' }).click();
  await drag(200, 100, 300, 160);
  await expect(canvas).toHaveAttribute('aria-label', 'Screenshot mit 0 Nummern und 0 Rahmen, 1 Pfeilen, 1 Textfeldern, 1 unkenntlichen Bereichen');
  await expect(page.getByText('▦ 1 Bereich(e) werden im gespeicherten Bild verpixelt.')).toBeVisible();
  await page.getByRole('button', { name: 'Rückgängig' }).click();
  await expect(canvas).toHaveAttribute('aria-label', 'Screenshot mit 0 Nummern und 0 Rahmen, 1 Pfeilen, 1 Textfeldern');
  // Entfernen über die Liste verschiebt Rückgängig nicht: Text B, dann Text A entfernen → Rückgängig nimmt Text B, nicht den Pfeil
  await page.getByRole('button', { name: 'T Textfeld setzen' }).click();
  await page.getByLabel('Beschriftung').fill('B');
  await canvas.click({ position: { x: 60, y: 150 } });
  await page.getByRole('button', { name: 'Textfeld 1 entfernen' }).click();
  await page.getByRole('button', { name: 'Rückgängig' }).click();
  await expect(canvas).toHaveAttribute('aria-label', 'Screenshot mit 0 Nummern und 0 Rahmen, 1 Pfeilen');
  expect(await axe()).toEqual([]);

  // Suche: Kapitel vor Treffern im Quellpfad
  await page.goto('/suche?q=vertrag');
  await expect(page.locator('.search-hits li .tag').first()).toHaveText('Kapitel');
});

test('[T-227] Rollenvorlagen, Stilregeln-Export/-Import, Stilwert-Verlauf im Dashboard, Screenshot zuschneiden, Lupe und verschieben', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const h = { 'X-User-Id': 'u-admin' };

  // Rollenvorlage anlegen und einem neuen Benutzer zuweisen
  await page.goto('/benutzer');
  await page.getByLabel('Name der Vorlage').fill('E2E Leitung');
  await page.getByRole('checkbox', { name: 'Freigeben' }).last().check();
  await page.getByRole('button', { name: 'Vorlage anlegen' }).click();
  await expect(page.getByText('Rollenvorlage angelegt.')).toBeVisible();
  await expect(page.getByRole('region', { name: 'Rollenvorlagen' }).getByText('E2E Leitung')).toBeVisible();
  await page.getByLabel('Kennung').fill('u-leitung');
  await page.getByLabel('Name', { exact: true }).last().fill('Leitung E2E');
  await page.getByRole('combobox', { name: 'Rollenvorlage', exact: true }).last().selectOption({ label: 'E2E Leitung (Lesen, Bearbeiten, Freigeben)' });
  await page.getByRole('button', { name: 'Benutzer anlegen' }).click();
  await expect(page.getByRole('region', { name: 'Benutzer', exact: true }).getByRole('row', { name: /Leitung E2E/ })).toContainText('E2E Leitung');
  expect(await axe()).toEqual([]);

  // Stilregeln: CSV-Import und -Export
  await page.goto('/schreibstil');
  await page.getByRole('tab', { name: 'Regeln' }).click();
  await page.getByTestId('rules-import').setInputFiles({ name: 'regeln.csv', mimeType: 'text/csv', buffer: Buffer.from('vermeiden;aktion;ersetzen durch;hinweis\nzu diesem Zeitpunkt;ersetzen;jetzt;\nKunde;hinweis;;Geschäftspartner schreiben\n') });
  await expect(page.getByText('Import: 2 neu, 0 aktualisiert, 2 Formulierungen.')).toBeVisible();
  await expect(page.getByLabel('Regel 2 vermeiden')).toHaveValue('Kunde');
  const dl = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Als CSV exportieren' }).click();
  const file = await (await dl).path();
  expect((await import('node:fs')).readFileSync(file!, 'utf8')).toContain('zu diesem Zeitpunkt;ersetzen;jetzt;');
  expect(await axe()).toEqual([]);
  await request.put('/api/v1/style/rules', { headers: h, data: { phrases: [] } });

  // Dashboard: Stilwert je Kapitel mit Veränderung, Verlauf (Hinweis bis zum zweiten Tag)
  const vch = (await (await request.get('/api/v1/chapters', { headers: h })).json()).find((c: any) => c.title === '4. Vertragsbearbeitung');
  if (!vch.versions.length) await request.post(`/api/v1/chapters/${vch.id}/generate`, { headers: h });
  await page.goto('/dashboard');
  const styleCard = page.locator('.card', { has: page.getByRole('heading', { name: 'Schreibstil je Kapitel' }) });
  await expect(styleCard.getByText('Veränderung (90 Tage)')).toBeVisible();
  await expect(styleCard.getByText(/Der Verlauf erscheint, sobald/)).toBeVisible();
  await expect(styleCard.getByText(/Verlauf der letzten 90 Tage/)).toBeVisible();
  expect(await axe()).toEqual([]);

  // Screenshot: Lupe, Zuschneiden, Verschieben, gespeichert nur der Ausschnitt
  await page.goto('/bilder');
  await page.getByRole('tab', { name: 'Screenshot markieren' }).click();
  await page.getByTestId('screenshot-input').setInputFiles({ name: 'maske3.png', mimeType: 'image/png', buffer: png(400, 200, [240, 240, 240]) });
  const canvas = page.getByTestId('screenshot-canvas');
  await expect(canvas).toBeVisible();
  const sx = (await canvas.boundingBox())!.width / 400;
  // Position je Zug neu bestimmen: Werkzeugoptionen können die Zeichenfläche verschieben
  const drag = async (x1: number, y1: number, x2: number, y2: number) => {
    const box = (await canvas.boundingBox())!;
    await page.mouse.move(box.x + x1 * sx, box.y + y1 * sx);
    await page.mouse.down();
    await page.mouse.move(box.x + x2 * sx, box.y + y2 * sx, { steps: 4 });
    await page.mouse.up();
  };
  await canvas.click({ position: { x: 40 * sx, y: 40 * sx } });
  await expect(page.getByLabel('Nummer 1 X in Prozent')).toHaveValue('10');
  await page.getByRole('button', { name: '🔍 Lupe' }).click();
  await drag(20, 20, 60, 60);
  await expect(canvas).toHaveAttribute('aria-label', /1 Lupen/);
  // Nummer verschieben
  await page.getByRole('button', { name: '✥ Verschieben' }).click();
  await drag(40, 40, 120, 40);
  await expect(page.getByLabel('Nummer 1 X in Prozent')).toHaveValue('30');
  await page.getByRole('button', { name: '✂ Zuschneiden' }).click();
  await drag(2, 2, 302, 152);
  await expect(page.getByText(/✂ Zuschnitt 75 % × 75 % des Bildes/)).toBeVisible();
  await expect(canvas).toHaveAttribute('aria-label', /zugeschnitten/);
  expect(await axe()).toEqual([]);
  await page.getByLabel('Titel (Bildverzeichnis)').fill('E2E Zuschnitt');
  await page.getByLabel('Alternativtext (Pflicht)').fill('Zugeschnittene Maske');
  await page.getByRole('button', { name: 'Screenshot speichern' }).click();
  await expect(page.getByText('Screenshot gespeichert.')).toBeVisible();
  const idx = await (await request.get('/api/v1/image-index', { headers: h })).json();
  expect(idx.find((i: any) => i.title === 'E2E Zuschnitt')).toMatchObject({ width: 300, height: 150 });
});

test('[T-228] Startseite, Menü nach Ablauf, Kapitel-Assistent, Anleitungs-Check mit Korrektur, Stilregel-Bibliothek', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const h = { 'X-User-Id': 'u-admin' };

  // Start: Hauptaufgaben, Fortschritt, Menü gruppiert nach Arbeitsablauf
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Start');
  const tasks = page.getByRole('navigation', { name: 'Hauptaufgaben' });
  await expect(tasks.getByRole('link')).toHaveCount(5);
  await expect(page.getByText('Ihr Weg zum fertigen Handbuch')).toBeVisible();
  await expect(page.locator('.progress-list li')).toHaveCount(6);
  const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
  await expect(nav.getByRole('group', { name: '2 Schreiben' }).getByRole('link', { name: 'Kapitel-Assistent' })).toBeVisible();
  await expect(nav.getByRole('button', { name: 'Weitere' })).toHaveAttribute('aria-expanded', 'false');
  expect(await axe()).toEqual([]);

  // Kapitel-Assistent: vier Schritte, Vorschau, anlegen
  await tasks.getByRole('link', { name: /Neues Kapitel schreiben/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Kapitel-Assistent');
  await expect(page.getByRole('button', { name: 'Weiter →' })).toBeDisabled();
  await page.getByLabel('Name der Aufgabe').fill('E2E Lieferung anlegen');
  await page.getByLabel('Wozu dient die Anleitung?').fill('Mit dieser Anleitung legen Sie eine Lieferung an.');
  await page.getByRole('button', { name: 'Weiter →' }).click();
  await expect(page.locator('.stepper li.current')).toContainText('Voraussetzungen');
  await page.getByLabel('Neuer Eintrag').fill('Sie haben die Berechtigung Einkauf');
  await page.getByLabel('Neuer Eintrag').press('Enter');
  await expect(page.getByLabel('Voraussetzung 1', { exact: true })).toHaveValue('Sie haben die Berechtigung Einkauf');
  await page.getByRole('button', { name: 'Weiter →' }).click();
  for (const s of ['Öffnen Sie **Einkauf > Lieferungen**', 'Klicken Sie auf **Neu**', 'Klicken Sie auf **Speichern**']) {
    await page.getByLabel('Neuer Eintrag').fill(s);
    await page.getByRole('button', { name: 'Hinzufügen' }).click();
  }
  await page.getByRole('button', { name: 'Schritt 3 nach oben' }).click();
  await expect(page.getByLabel('Schritt 2', { exact: true })).toHaveValue('Klicken Sie auf **Speichern**');
  await page.getByRole('button', { name: 'Schritt 2 nach unten' }).click();
  const preview = page.locator('.preview');
  await expect(preview.getByRole('listitem').nth(1)).toHaveText('Öffnen Sie Einkauf > Lieferungen.');
  expect(await axe()).toEqual([]);
  await page.getByRole('button', { name: 'Weiter →' }).click();
  await page.getByLabel(/Ergebnis: Was zeigt das System/).fill('Die Lieferung ist gespeichert und erscheint in der Liste.');
  await page.getByRole('button', { name: 'Kapitel anlegen' }).click();
  await expect(page.getByRole('heading', { name: '„E2E Lieferung anlegen“ ist angelegt' })).toBeVisible();
  await expect(page.getByText(/Leserfreundlichkeit: 100 von 100/)).toBeVisible();
  await page.getByRole('link', { name: 'Anleitungs-Check ansehen' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Anleitungs-Check');
  await expect(page.locator('.guide-icon.ok')).toHaveCount(11);

  // Anleitungs-Check: Schritte als Fließtext → per Klick nummerieren
  const chapters = await (await request.get('/api/v1/guidance', { headers: h })).json();
  const mine = chapters.chapters.find((c: any) => c.title === 'E2E Lieferung anlegen');
  const v = await (await request.get(`/api/v1/chapter-versions/${mine.versionId}`, { headers: h })).json();
  const stepsBlock = v.sections.find((s: any) => s.code === 'steps').blocks[0];
  expect((await request.patch(`/api/v1/content-blocks/${stepsBlock.id}`, { headers: h, data: { text: 'Öffnen Sie Einkauf > Lieferungen. Klicken Sie auf **Neu** und wählen Sie den Lieferanten.', kind: 'paragraph', expectedVersionNo: stepsBlock.versionNo } })).ok()).toBe(true);
  await page.goto('/anleitungs-check');
  const row = page.getByRole('row', { name: /E2E Lieferung anlegen/ });
  await expect(row).toContainText('Schritte nicht nummeriert');
  expect(await axe()).toEqual([]);
  await row.getByRole('link', { name: 'E2E Lieferung anlegen prüfen' }).click();
  const numbered = page.locator('.guide-item', { hasText: 'Schritte nummeriert' });
  await numbered.getByRole('button', { name: 'So geht’s' }).click();
  expect(await axe()).toEqual([]);
  await expect(numbered.getByRole('button', { name: 'Als nummerierte Schritte schreiben' })).toBeVisible();
  // zwei Korrekturen am selben Absatz (nummerieren, Menüpfad fett) – „Alle“ übernimmt beide nacheinander
  await page.getByRole('button', { name: 'Alle Korrekturen übernehmen (2)' }).click();
  await expect(page.getByText('2 Korrekturen übernommen.')).toBeVisible();
  await expect(page.locator('.guide-icon.ok')).toHaveCount(11);
  const after = await (await request.get(`/api/v1/chapter-versions/${mine.versionId}`, { headers: h })).json();
  expect(after.sections.find((s: any) => s.code === 'steps').blocks[0]).toMatchObject({ kind: 'list', text: '1. Öffnen Sie **Einkauf > Lieferungen**.\n2. Klicken Sie auf **Neu**.\n3. Wählen Sie den Lieferanten.' });
  // aus der Werkstatt erreichbar
  await page.getByRole('link', { name: 'In der Werkstatt öffnen' }).click();
  await expect(page.getByRole('link', { name: '🔍 Anleitungs-Check' })).toBeVisible();

  // Stilregel-Bibliothek anlegen und abonnieren
  await request.put('/api/v1/style/rules', { headers: h, data: { phrases: [{ avoid: 'Popup', use: 'Dialogfenster' }] } });
  await page.goto('/schreibstil');
  await page.getByRole('tab', { name: 'Regeln' }).click();
  await page.getByLabel('Name der neuen Bibliothek').fill('E2E Konzernsprache');
  await page.getByRole('button', { name: 'Aus Regeln dieses Projekts anlegen' }).click();
  await expect(page.getByText('Bibliothek aus den Projektregeln angelegt.')).toBeVisible();
  await page.getByRole('button', { name: '+ E2E Konzernsprache (1)' }).click();
  await page.getByRole('button', { name: 'Auswahl speichern' }).click();
  await expect(page.getByText('Bibliotheken gespeichert.')).toBeVisible();
  await expect(page.getByText(/Überdeckt: „Popup“ aus E2E Konzernsprache/)).toBeVisible();
  expect(await axe()).toEqual([]);
  // aufräumen
  await request.put('/api/v1/style/libraries', { headers: h, data: { libraryIds: [] } });
  await request.put('/api/v1/style/rules', { headers: h, data: { phrases: [] } });
});

test('[T-229] Einführung, Leseransicht mit Schritten und Rückmeldung, Vorlagen im Assistenten, Anleitungs-Check vor der Freigabe', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const h = { 'X-User-Id': 'u-admin' };

  // Einführung: über „Einführung“ starten, blättern, mit Esc schließen
  await page.goto('/quellen');
  await page.getByRole('button', { name: 'Einführung' }).click();
  const tour = page.getByRole('dialog', { name: 'Was möchten Sie tun?' });
  await expect(tour).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Start');
  expect(await axe()).toEqual([]);
  await tour.getByRole('button', { name: 'Weiter →' }).click();
  await expect(page.getByRole('dialog', { name: 'Menü nach Arbeitsablauf' })).toBeVisible();
  await expect(page.locator('.tour-target')).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('onescm.tour.done'))).toBe('1');

  // Kapitel-Assistent mit Vorlage: Felder vorbelegt, Platzhalter-Hinweis
  await page.goto('/kapitel-assistent');
  await page.getByRole('radio', { name: /Prüfen und genehmigen/ }).check();
  await expect(page.getByLabel('Wozu dient die Anleitung?')).toHaveValue(/prüfen Sie …/);
  await page.getByLabel('Name der Aufgabe').fill('E2E Rechnung prüfen');
  await page.getByLabel('Wozu dient die Anleitung?').fill('Mit dieser Anleitung prüfen Sie eine Rechnung und genehmigen sie.');
  expect(await axe()).toEqual([]);
  await page.getByRole('button', { name: 'Weiter →' }).click();
  await expect(page.getByLabel('Voraussetzung 1', { exact: true })).toHaveValue('Sie haben die Berechtigung „…“');
  await expect(page.getByText(/Platzhalter „…“ – bitte durch konkrete Begriffe ersetzen/)).toBeVisible();

  // Leseransicht: freigegebenes Kapitel über die API anlegen und freigeben
  const created = await (await request.post('/api/v1/chapter-assistant', { headers: { 'X-User-Id': 'u-redaktion' }, data: {
    title: 'E2E Lesen', purpose: 'Mit dieser Anleitung legen Sie eine Notiz an.', steps: ['Öffnen Sie **Notizen › Neu**', 'Klicken Sie auf **Speichern**'], result: 'Die Notiz ist gespeichert.', hints: ['Notizen sehen nur Sie'],
  } })).json();
  expect((await request.post(`/api/v1/chapter-versions/${created.versionId}/submit`, { headers: { 'X-User-Id': 'u-redaktion' }, data: {} })).ok()).toBe(true);
  expect((await request.post(`/api/v1/chapter-versions/${created.versionId}/approve`, { headers: { 'X-User-Id': 'u-freigabe' }, data: { comment: 'ok' } })).ok()).toBe(true);
  await page.goto('/lesen');
  const toc = page.getByRole('navigation', { name: 'Inhaltsverzeichnis' });
  await toc.getByRole('link', { name: 'E2E Lesen' }).click();
  const article = page.getByRole('article', { name: 'E2E Lesen' });
  await expect(article.getByRole('heading', { name: 'Schrittweise Durchführung' })).toBeVisible();
  await article.getByRole('checkbox', { name: /Öffnen Sie Notizen › Neu/ }).check();
  await expect(article.getByText('1 von 2 Schritten erledigt')).toBeVisible();
  await expect(article.getByText('Tipp:')).toBeVisible();
  expect(await axe()).toEqual([]);
  // Rückmeldung als Leser
  await page.evaluate(() => localStorage.setItem('onescm.user', 'u-leser'));
  await page.reload();
  const art2 = page.getByRole('article', { name: 'E2E Lesen' });
  await art2.getByRole('button', { name: '👎 Nein' }).click();
  await art2.getByLabel(/Was hat gefehlt/).fill('Wo finde ich Notizen anderer?');
  await art2.getByRole('button', { name: 'Rückmeldung senden' }).click();
  await expect(art2.getByRole('status')).toContainText('Danke für Ihre Rückmeldung');
  await page.evaluate(() => localStorage.setItem('onescm.user', 'u-admin'));

  // Redaktion: Rückmeldung im Anleitungs-Check, erledigen; Mindestwert für die Freigabe
  await page.goto('/anleitungs-check');
  await expect(page.getByRole('row', { name: /E2E Lesen/ })).toContainText('👎 1');
  const fbCard = page.locator('.card', { has: page.getByRole('heading', { name: /Rückmeldungen von Leserinnen und Lesern/ }) });
  await expect(fbCard).toContainText('Wo finde ich Notizen anderer?');
  expect(await axe()).toEqual([]);
  await fbCard.getByRole('button', { name: 'Rückmeldung zu E2E Lesen erledigt' }).click();
  await expect(page.getByText('Als erledigt markiert.')).toBeVisible();
  await page.getByLabel('Mindestwert für Einreichen und Freigabe').selectOption('90');
  await expect(page.getByText('Freigabe ab 90 von 100.')).toBeVisible();
  // Freigabe zeigt den Check; schwaches Kapitel liegt unter dem Mindestwert
  const weak = await (await request.post('/api/v1/chapter-assistant', { headers: { 'X-User-Id': 'u-redaktion' }, data: { title: 'E2E Schwach', purpose: 'Zweck …', steps: ['Öffnen Sie …'] } })).json();
  const gate = await (await request.get(`/api/v1/chapter-versions/${weak.versionId}/gate`, { headers: h })).json();
  expect(gate.checks.find((c: any) => c.code === 'guidance_min_score').passed).toBe(false);
  await page.goto('/freigabe');
  await page.getByRole('row', { name: /E2E Schwach/ }).click();
  await expect(page.getByRole('note')).toContainText('Unter dem Mindestwert');
  expect(await axe()).toEqual([]);
  await request.put('/api/v1/guidance/settings', { headers: h, data: { minScore: null } });
});

test('[T-230] Rückmeldungen auswerten mit Aufgabe, eigene Kapitelvorlage aus der Werkstatt, Druckansicht', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const red = { 'X-User-Id': 'u-redaktion' };
  const c = await (await request.post('/api/v1/chapter-assistant', { headers: red, data: {
    title: 'E2E Rückmeldung', purpose: 'Mit dieser Anleitung erfassen Sie eine Reklamation.', prerequisites: ['Sie haben die Berechtigung Service'],
    steps: ['Öffnen Sie **Service › Reklamationen**', 'Klicken Sie auf **Neu**'], result: 'Die Reklamation ist gespeichert.', hints: ['Fotos helfen bei der Prüfung'],
  } })).json();
  for (const [u, comment] of [['u-leser', 'Wo finde ich die Reklamationsnummer?'], ['u-freigabe', 'Reklamationsnummer fehlt']]) {
    await request.post(`/api/v1/chapters/${c.chapterId}/feedback`, { headers: { 'X-User-Id': u }, data: { helpful: false, versionId: c.versionId, comment } });
  }

  // Auswertung: Kapitel oben, häufiger Begriff, Aufgabe aus Rückmeldung
  await page.goto('/rueckmeldungen');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Rückmeldungen');
  await expect(page.getByRole('table', { name: 'Anteil nicht hilfreich je Kapitel' })).toContainText('E2E Rückmeldung');
  await expect(page.locator('.word-list')).toContainText('reklamationsnummer');
  expect(await axe()).toEqual([]);
  const item = page.locator('.feedback-list li', { hasText: 'Reklamationsnummer fehlt' });
  await item.getByRole('button', { name: 'Aufgabe erstellen' }).click();
  await item.getByLabel('Zuständig').selectOption({ label: 'Redaktion (Demo)' });
  await item.getByRole('button', { name: 'Erstellen' }).click();
  await expect(page.getByText('Aufgabe erstellt – die Rückmeldung ist erledigt.')).toBeVisible();
  await expect(page.locator('.feedback-list li', { hasText: 'Reklamationsnummer fehlt' })).toContainText('erledigt');

  // Eigene Vorlage aus der Werkstatt, im Assistenten wählbar, umbenennen, löschen
  await page.goto(`/werkstatt/${c.chapterId}`);
  await page.getByRole('button', { name: '💾 Als Vorlage' }).click();
  const dlg = page.getByRole('dialog', { name: 'Als Vorlage speichern' });
  await expect(dlg.getByLabel('Name der Vorlage')).toHaveValue('E2E Rückmeldung');
  await dlg.getByLabel('Name der Vorlage').fill('E2E Reklamation');
  await dlg.getByRole('button', { name: 'Speichern' }).click();
  await expect(page.getByText('Vorlage „E2E Reklamation“ gespeichert – im Kapitel-Assistenten wählbar.')).toBeVisible();
  await page.goto('/kapitel-assistent');
  await page.getByRole('radio', { name: /E2E Reklamation/ }).check();
  await expect(page.getByLabel('Wozu dient die Anleitung?')).toHaveValue('Mit dieser Anleitung erfassen Sie eine Reklamation.');
  const own = page.locator('.card', { has: page.getByRole('heading', { name: 'Eigene Vorlagen' }) });
  await own.getByRole('button', { name: 'Vorlage „E2E Reklamation“ bearbeiten' }).click();
  await page.getByRole('dialog').getByLabel('Name').fill('E2E Reklamation erfassen');
  await page.getByRole('dialog').getByRole('button', { name: 'Speichern' }).click();
  await expect(page.getByText('Vorlage „E2E Reklamation erfassen“ gespeichert.')).toBeVisible();
  await expect(page.getByRole('radio', { name: /E2E Reklamation erfassen/ })).toBeVisible();
  expect(await axe()).toEqual([]);
  await own.getByRole('button', { name: 'Vorlage „E2E Reklamation erfassen“ löschen' }).click();
  await expect(page.getByRole('radio', { name: /E2E Reklamation/ })).toHaveCount(0);

  // Druckansicht: alle Kapitel mit Inhaltsverzeichnis; im Druck ohne Navigation und Schaltflächen
  await page.goto('/lesen/druck?entwuerfe=1');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Handbuch drucken');
  const toc = page.getByRole('navigation', { name: 'Inhaltsverzeichnis des Handbuchs' });
  await expect(toc.getByRole('link', { name: 'E2E Rückmeldung' })).toBeVisible();
  await expect(page.getByRole('article', { name: 'E2E Rückmeldung' }).getByRole('checkbox')).toHaveCount(2);
  expect(await axe()).toEqual([]);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.sidebar')).toBeHidden();
  await expect(page.getByRole('button', { name: /Drucken \/ als PDF speichern/ })).toBeHidden();
  await expect(page.getByRole('article', { name: 'E2E Rückmeldung' })).toBeVisible();
  await page.emulateMedia({ media: 'screen' });
});

test('[T-231] Vorlage vollständig bearbeiten, Druck mit Deckblatt und Seitenzahlen, wöchentliche Übersicht', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const red = { 'X-User-Id': 'u-redaktion' };
  const t = await request.post('/api/v1/chapter-templates', { headers: red, data: {
    name: 'E2E Lieferschein', purpose: 'Lieferschein drucken', steps: ['Öffnen Sie **Lager › Lieferscheine**'], result: 'Der Lieferschein ist gedruckt.',
  } });
  expect(t.status()).toBe(201);

  // Vorlage im Dialog bearbeiten: alle Teile, Listen eine Zeile je Eintrag
  await page.goto('/kapitel-assistent');
  const own = page.locator('.card', { has: page.getByRole('heading', { name: 'Eigene Vorlagen' }) });
  await own.getByRole('button', { name: 'Vorlage „E2E Lieferschein“ bearbeiten' }).click();
  const dlg = page.getByRole('dialog', { name: 'Vorlage bearbeiten: E2E Lieferschein' });
  await dlg.getByLabel('Kurzbeschreibung').fill('Für Lagerteams');
  await dlg.getByLabel('Titelvorschlag').fill('Lieferschein drucken');
  await dlg.getByLabel(/^Voraussetzungen/).fill('Sie haben die Berechtigung Lager');
  await dlg.getByLabel(/^Schritte/).fill('');
  await expect(dlg.getByRole('alert')).toHaveText('Eine Vorlage braucht mindestens einen Schritt.');
  await expect(dlg.getByRole('button', { name: 'Speichern' })).toBeDisabled();
  await dlg.getByLabel(/^Schritte/).fill('Öffnen Sie **Lager › Lieferscheine**\nWählen Sie den Auftrag\nKlicken Sie auf **Drucken**');
  await expect(dlg).toContainText('3 erkannt');
  await dlg.getByLabel(/^Tipps/).fill('Mehrere Aufträge gleichzeitig markieren');
  expect(await axe()).toEqual([]);
  await dlg.getByRole('button', { name: 'Speichern' }).click();
  await expect(page.getByText('Vorlage „E2E Lieferschein“ gespeichert.')).toBeVisible();
  await expect(own).toContainText('3 Schritte · Für Lagerteams');
  await page.getByRole('radio', { name: /E2E Lieferschein/ }).check();
  await expect(page.getByLabel('Wozu dient die Anleitung?')).toHaveValue('Lieferschein drucken');

  // Druck: Deckblatt mit Projekt, Arbeitsstand, Kapitelzahl; nummeriertes Inhaltsverzeichnis; Kopf-/Fußzeile per @page
  await page.goto('/lesen/druck?entwuerfe=1');
  const cover = page.getByRole('region', { name: 'Deckblatt' });
  await expect(cover).toContainText('Benutzerhandbuch');
  await expect(cover).toContainText('Arbeitsstand');
  await expect(cover).toContainText('enthält nicht freigegebene Entwürfe');
  // jedes Kapitel nummeriert; schon nummerierte Titel („4. Vertragsbearbeitung“) ohne zweite Nummer
  const tocLinks = await page.getByRole('navigation', { name: 'Inhaltsverzeichnis des Handbuchs' }).getByRole('link').allTextContents();
  expect(tocLinks.filter((t) => t !== 'Glossar').every((t) => /^\d+\. \S/.test(t) && !/^\d+\. \d+\./.test(t))).toBe(true);
  expect(await page.locator('style[data-print-header]').textContent()).toContain('Arbeitsstand');
  expect(await axe()).toEqual([]);
  await page.emulateMedia({ media: 'print' });
  await expect(cover).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toBeHidden();
  await page.emulateMedia({ media: 'screen' });

  // Wöchentliche Übersicht: Vorschau, Wochentag (Administration), jetzt senden
  const [chapter] = await (await request.get('/api/v1/chapters', { headers: red })).json();
  expect((await request.post('/api/v1/comments', { headers: { 'X-User-Id': 'u-fachpruefung' }, data: { entityType: 'chapter', entityId: chapter.id, kind: 'task', body: 'E2E Wochenaufgabe', assignee: 'u-admin' } })).ok()).toBe(true);
  await page.goto('/rueckmeldungen');
  const digest = page.locator('.card', { has: page.getByRole('heading', { name: 'Wöchentliche Übersicht' }) });
  await expect(digest.getByRole('heading', { name: /^Ihre Übersicht für \d{4}-W\d{2}$/ })).toBeVisible();
  await expect(digest.getByRole('link', { name: /offene Aufgabe/ })).toBeVisible();
  await digest.getByLabel('Senden am').selectOption({ label: 'Freitag' });
  await expect(page.getByText('Übersicht kommt jetzt jeden Freitag.')).toBeVisible();
  expect(await axe()).toEqual([]);
  await digest.getByRole('button', { name: '📨 Jetzt senden' }).click();
  await expect(page.getByText(/^Übersicht an \d+ Person/)).toBeVisible();
  await expect(digest).toContainText('Zuletzt gesendet: ');
  await digest.getByLabel('Senden am').selectOption({ label: 'Montag' });
});

test('[T-232] Leseransicht: Suche mit Hervorhebung, Glossar-Erklärungen; Druck je Rolle im Firmen-Layout mit Glossar; Vorlagen kopieren, exportieren, importieren', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const red = { 'X-User-Id': 'u-redaktion' };
  const c = await (await request.post('/api/v1/chapter-assistant', { headers: red, data: {
    title: 'E2E Lieferschein', purpose: 'Mit dieser Anleitung drucken Sie einen Lieferschein.', steps: ['Öffnen Sie **Lager › Lieferscheine**', 'Klicken Sie auf **Drucken**'],
    result: 'Der Lieferschein ist gedruckt.', hints: ['Den Druckerschacht stellen Sie im DMS ein.'],
  } })).json();
  expect((await request.post(`/api/v1/chapter-versions/${c.versionId}/submit`, { headers: red, data: {} })).ok()).toBe(true);
  expect((await request.post(`/api/v1/chapter-versions/${c.versionId}/approve`, { headers: { 'X-User-Id': 'u-freigabe' }, data: { comment: 'ok' } })).ok()).toBe(true);
  const adm = { 'X-User-Id': 'u-admin' };
  const term0 = await request.post('/api/v1/terminology', { headers: adm, data: { preferred: 'Lieferschein', definition: 'Beleg, der eine Warensendung begleitet.' } });
  expect(term0.status(), await term0.text()).toBe(201);
  expect((await request.post('/api/v1/abbreviations', { headers: red, data: { abbreviation: 'DMS', expansion: 'Dealer-Management-System' } })).status()).toBe(201);

  // Suche: Treffer mit Ausschnitt, Kapitel öffnet mit markierten Wörtern
  await page.goto('/lesen');
  await page.getByRole('searchbox', { name: 'Im Handbuch suchen' }).fill('Druckerschacht');
  const results = page.getByRole('list', { name: 'Suchergebnisse' });
  await expect(results.getByRole('link', { name: 'E2E Lieferschein' })).toBeVisible();
  await expect(results.locator('mark').first()).toHaveText(/Druckerschacht/i);
  await expect(page.locator('#reader-q-status')).toHaveText('1 Kapitel gefunden');
  await results.getByRole('link', { name: 'E2E Lieferschein' }).click();
  await expect(page).toHaveURL(/\?q=Druckerschacht/);
  const article = page.getByRole('article', { name: 'E2E Lieferschein' });
  await expect(article.getByRole('status')).toHaveText(/1 Treffer für „Druckerschacht“ markiert\./);
  expect(await page.evaluate(() => (CSS as any).highlights?.has('reader-search'))).toBe(true);
  expect(await axe()).toEqual([]);
  await article.getByRole('button', { name: 'Markierung entfernen' }).click();
  await expect(page).not.toHaveURL(/\?q=/);

  // Glossar: Begriff und Abkürzung erklären sich per Klick, Esc schließt; Schritt-Kästchen behalten ihren Namen
  const term = article.getByRole('button', { name: 'Lieferschein', exact: true }).first();
  await term.click();
  await expect(page.getByRole('tooltip')).toHaveText('Lieferschein: Beleg, der eine Warensendung begleitet.');
  await expect(term).toHaveAttribute('aria-expanded', 'true');
  expect(await axe()).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await article.getByRole('button', { name: 'DMS', exact: true }).hover();
  await expect(page.getByRole('tooltip')).toHaveText('DMS = Dealer-Management-System');
  await expect(article.getByRole('checkbox', { name: /Öffnen Sie Lager › Lieferscheine/ })).toBeVisible();

  // Druck für eine Rolle im Firmen-Layout: Deckblatt mit Firma und Vertraulichkeit, Glossar-Anhang
  expect((await request.put('/api/v1/layout', { headers: adm, data: { companyName: 'Muster AG', confidentiality: 'VERTRAULICH', footerText: 'Nur intern' } })).ok()).toBe(true);
  await page.goto('/lesen/druck');
  await page.getByLabel('Für Rolle').selectOption({ label: 'Dealer' });
  await expect(page).toHaveURL(/rolle=dealer/);
  const cover = page.getByRole('region', { name: 'Deckblatt' });
  await expect(cover).toContainText('Muster AG · Benutzerhandbuch');
  await expect(cover).toContainText('für Dealer');
  await expect(cover).toContainText('VERTRAULICH');
  await expect(page.getByRole('group', { name: 'Was drucken?' }).getByRole('combobox').first()).toHaveValue('');
  const glossary = page.getByRole('region', { name: 'Glossar' });
  await expect(glossary).toContainText('Beleg, der eine Warensendung begleitet.');
  await expect(glossary).toContainText('Dealer-Management-System');
  // Kopf-/Fußzeile schreibt ein Effekt nach dem Rendern – daher warten statt einmal lesen
  const header = () => page.locator('style[data-print-header]').textContent();
  await expect.poll(header).toContain('für Dealer');
  await expect.poll(header).toContain('Nur intern');
  expect(await axe()).toEqual([]);
  await request.put('/api/v1/layout', { headers: adm, data: { companyName: null, confidentiality: null, footerText: null } });

  // Vorlagen: mitgelieferte kopieren, duplizieren, exportieren, wieder importieren
  await page.goto('/kapitel-assistent');
  const own = page.locator('.card', { has: page.getByRole('heading', { name: 'Eigene Vorlagen' }) });
  const copied = 'Suchen und filtern';
  await own.getByLabel('Vorlage kopieren').selectOption({ label: copied });
  await own.getByRole('button', { name: 'Als eigene Vorlage kopieren' }).click();
  await expect(page.getByText(new RegExp(`^Kopie „${copied} \\(Kopie\\)( \\(\\d+\\))?“ angelegt – jetzt anpassen\\.$`))).toBeVisible();
  const name = (await own.locator('.own-templates li strong').filter({ hasText: copied }).first().textContent())!;
  await own.getByRole('button', { name: `Vorlage „${name}“ duplizieren` }).click();
  await expect(own.locator('.own-templates li strong').getByText(`${name} (Kopie)`, { exact: true })).toBeVisible();
  expect(await axe()).toEqual([]);
  const dl = page.waitForEvent('download');
  await own.getByRole('button', { name: `Vorlage „${name} (Kopie)“ exportieren` }).click();
  const file = await (await dl).path();
  const fs = await import('node:fs');
  const data = JSON.parse(fs.readFileSync(file!, 'utf8'));
  expect(data).toMatchObject({ format: 'onescm-chapter-templates', templates: [{ name: `${name} (Kopie)` }] });
  await own.locator('input[type=file]').setInputFiles({ name: 'vorlage.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)) });
  await expect(page.getByText('1 Vorlage importiert (1 umbenannt, da der Name schon vergeben war).')).toBeVisible();
  await expect(own.locator('.own-templates li strong').getByText(`${name} (Kopie) (2)`, { exact: true })).toBeVisible();
  await own.locator('input[type=file]').setInputFiles({ name: 'kaputt.json', mimeType: 'application/json', buffer: Buffer.from('kein json') });
  await expect(page.getByText('Die Datei ist kein gültiges JSON – bitte eine exportierte Vorlagendatei wählen.')).toBeVisible();
});

test('[T-233] Siehe auch und häufige Fragen unter dem Kapitel, Verweise pflegen, FAQ-Seite; Lesezeichen, zuletzt gelesen, neue und geänderte Kapitel', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const red = { 'X-User-Id': 'u-redaktion' };
  const mk = async (title: string, purpose: string, steps: string[]) => {
    const c = await (await request.post('/api/v1/chapter-assistant', { headers: red, data: { title, purpose, steps, result: 'Erledigt.' } })).json();
    expect((await request.post(`/api/v1/chapter-versions/${c.versionId}/submit`, { headers: red, data: {} })).ok()).toBe(true);
    expect((await request.post(`/api/v1/chapter-versions/${c.versionId}/approve`, { headers: { 'X-User-Id': 'u-freigabe' }, data: { comment: 'ok' } })).ok()).toBe(true);
    return c;
  };
  const a = await mk('E2E Rechnung drucken', 'Mit dieser Anleitung drucken Sie eine Rechnung für einen Kundenauftrag.', ['Öffnen Sie **Buchhaltung › Rechnungen**', 'Wählen Sie die Rechnung', 'Klicken Sie auf **Rechnung drucken**']);
  await mk('E2E Rechnung stornieren', 'Mit dieser Anleitung stornieren Sie eine falsche Rechnung eines Kundenauftrags.', ['Öffnen Sie **Buchhaltung › Rechnungen**', 'Wählen Sie die Rechnung', 'Klicken Sie auf **Stornieren**']);
  await request.post('/api/v1/faq', { headers: red, data: { question: 'Wie drucke ich eine Rechnung erneut?', answer: 'Öffnen Sie die Rechnung in der Buchhaltung und drucken Sie sie erneut.', status: 'published' } });

  // Siehe auch (automatisch) und passende FAQ
  await page.goto(`/lesen/${a.chapterId}`);
  const article = page.getByRole('article', { name: 'E2E Rechnung drucken' });
  const related = article.getByRole('region', { name: 'Siehe auch' });
  await expect(related.getByRole('link', { name: 'E2E Rechnung stornieren' })).toBeVisible();
  await article.getByText('Wie drucke ich eine Rechnung erneut?').click();
  await expect(article.getByText('Öffnen Sie die Rechnung in der Buchhaltung')).toBeVisible();
  expect(await axe()).toEqual([]);
  // Verweise pflegen: Vorschlag ausblenden, Kapitel manuell verweisen
  await related.getByRole('button', { name: 'Verweise bearbeiten' }).click();
  await related.getByRole('button', { name: 'Vorschlag „E2E Rechnung stornieren“ ausblenden' }).click();
  await expect(page.getByText('Vorschlag ausgeblendet.')).toBeVisible();
  await expect(related.getByRole('link', { name: 'E2E Rechnung stornieren' })).toHaveCount(0);
  await related.getByLabel('Kapitel verweisen').selectOption({ label: 'E2E Rechnung stornieren' });
  await related.getByRole('button', { name: 'Hinzufügen' }).click();
  await expect(page.getByText('Verweis hinzugefügt.')).toBeVisible();
  await expect(related.getByRole('link', { name: 'E2E Rechnung stornieren' })).toBeVisible();
  expect(await axe()).toEqual([]);
  await related.getByRole('button', { name: 'Fertig' }).click();

  // Lesezeichen und zuletzt gelesen
  await article.getByRole('button', { name: '☆ Merken' }).click();
  await expect(article.getByRole('button', { name: '★ Gemerkt' })).toHaveAttribute('aria-pressed', 'true');
  const toc = page.getByRole('navigation', { name: 'Inhaltsverzeichnis' });
  await expect(toc.getByRole('heading', { name: '★ Lesezeichen' })).toBeVisible();
  await expect(toc.getByRole('link', { name: 'E2E Rechnung drucken' }).first()).toBeVisible();
  await expect(toc.getByRole('heading', { name: 'Zuletzt gelesen' })).toBeVisible();

  // neues Kapitel seit dem letzten Besuch
  await mk('E2E Rechnung korrigieren', 'Mit dieser Anleitung korrigieren Sie eine Rechnung.', ['Öffnen Sie **Buchhaltung › Rechnungen**', 'Klicken Sie auf **Korrigieren**']);
  await page.reload();
  await expect(page.getByRole('note')).toContainText(/neu für Sie oder wurden? seit Ihrem letzten Lesen geändert/);
  await expect(toc.locator('li', { hasText: 'E2E Rechnung korrigieren' }).getByText('Neu')).toBeVisible();
  expect(await axe()).toEqual([]);
  // das neue Kapitel öffnen: Hinweis nennt es, Markierung im Inhalt entfällt, keine weiteren gezählt
  await toc.getByRole('link', { name: 'E2E Rechnung korrigieren' }).click();
  // (andere Tests der Suite legen weitere Kapitel an, die hier ebenfalls „neu“ sein können – daher nur der Kapitelteil)
  await expect(page.getByRole('note')).toContainText('Dieses Kapitel ist neu für Sie.');
  await expect(toc.locator('li', { hasText: 'E2E Rechnung korrigieren' }).getByText('Neu')).toHaveCount(0);
  await toc.getByRole('link', { name: 'E2E Rechnung drucken' }).last().click();
  await expect(page.getByRole('article', { name: 'E2E Rechnung drucken' })).toBeVisible();
  await expect(page.getByText(/^Dieses Kapitel (ist neu für Sie|wurde seit)/)).toHaveCount(0);
  await page.getByRole('article', { name: 'E2E Rechnung drucken' }).getByRole('button', { name: '★ Gemerkt' }).click();
  await expect(toc.getByRole('heading', { name: '★ Lesezeichen' })).toHaveCount(0);

  // FAQ-Seite
  await page.goto('/lesen/faq');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Häufige Fragen');
  await page.getByLabel('Fragen filtern').fill('Rechnung');
  await page.getByText('Wie drucke ich eine Rechnung erneut?').click();
  await expect(page.getByText('Öffnen Sie die Rechnung in der Buchhaltung')).toBeVisible();
  expect(await axe()).toEqual([]);
});

test('[T-234] Lesen in Englisch mit Rückfall-Hinweis und übersetztem Glossar; Siehe auch und FAQ im Druck und in der Online-Hilfe; Lesezeichen mit Notizen', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const red = { 'X-User-Id': 'u-redaktion' };
  const adm = { 'X-User-Id': 'u-admin' };
  expect((await request.patch('/api/v1/projects/p_default', { headers: adm, data: { languages: ['en'] } })).ok()).toBe(true);
  const mk = async (title: string, purpose: string, steps: string[]) => {
    const c = await (await request.post('/api/v1/chapter-assistant', { headers: red, data: { title, purpose, steps, result: 'Erledigt.' } })).json();
    expect((await request.post(`/api/v1/chapter-versions/${c.versionId}/submit`, { headers: red, data: {} })).ok()).toBe(true);
    expect((await request.post(`/api/v1/chapter-versions/${c.versionId}/approve`, { headers: { 'X-User-Id': 'u-freigabe' }, data: { comment: 'ok' } })).ok()).toBe(true);
    return c;
  };
  const a = await mk('E2E Packliste drucken', 'Mit dieser Anleitung drucken Sie die Packliste einer Sendung.', ['Öffnen Sie **Versand › Sendungen**', 'Klicken Sie auf **Packliste drucken**']);
  const b = await mk('E2E Packliste ändern', 'Mit dieser Anleitung ändern Sie die Packliste einer Sendung.', ['Öffnen Sie **Versand › Sendungen**', 'Klicken Sie auf **Packliste ändern**']);
  await request.post('/api/v1/faq', { headers: red, data: { question: 'Wo finde ich die Packliste einer Sendung?', answer: 'Unter Versand › Sendungen.', status: 'published' } });
  // Kapitel a vollständig ins Englische übersetzen und freigeben; b bleibt deutsch
  const tr = await (await request.post('/api/v1/translations', { headers: red, data: { chapterId: a.chapterId, language: 'en' } })).json();
  const d = await (await request.get(`/api/v1/translations/${tr.id}`, { headers: red })).json();
  for (const blk of d.sections.flatMap((s: any) => s.blocks)) {
    const text = blk.sourceText.startsWith('Mit dieser') ? 'With this guide you print the packing list of a shipment.'
      : blk.sourceText.includes('Versand') ? '1. Open **Shipping › Shipments**\n2. Click **Print packing list**' : `EN ${blk.sourceText}`;
    expect((await request.patch(`/api/v1/translation-blocks/${blk.id}`, { headers: red, data: { text } })).ok()).toBe(true);
  }
  await request.patch(`/api/v1/translations/${tr.id}`, { headers: red, data: { title: 'E2E Print packing list' } });
  expect((await request.post(`/api/v1/translations/${tr.id}/approve`, { headers: { 'X-User-Id': 'u-freigabe' }, data: { comment: 'ok' } })).ok()).toBe(true);

  // Terminologie: Übersetzung für das Glossar pflegen
  expect((await request.post('/api/v1/terminology', { headers: adm, data: { preferred: 'Packliste', definition: 'Liste aller Teile einer Sendung.' } })).status()).toBe(201);
  await page.goto('/terminologie');
  await page.getByRole('row', { name: /Packliste/ }).getByRole('button', { name: 'Bearbeiten' }).click();
  await page.getByLabel('Englisch: Begriff').fill('Packing list');
  await page.locator('.term-lang').getByLabel('Definition').fill('List of all parts in a shipment.');
  await page.getByRole('button', { name: 'Speichern' }).click();
  await expect(page.getByText('Begriff gespeichert.')).toBeVisible();
  await expect(page.getByRole('row', { name: /Packliste/ }).getByText('EN', { exact: true })).toBeVisible();

  // Leseransicht auf Englisch: übersetzter Titel und Text, englisches Glossar
  await page.goto(`/lesen/${a.chapterId}`);
  await page.getByLabel('Sprache').selectOption('en');
  const article = page.getByRole('article', { name: 'E2E Print packing list' });
  await expect(article.getByText('Shipping › Shipments')).toBeVisible();
  await expect(article).toHaveAttribute('lang', 'en');
  await article.getByRole('button', { name: 'packing list' }).first().click();
  await expect(page.getByRole('tooltip')).toContainText('List of all parts in a shipment.');
  await page.keyboard.press('Escape');
  // Beschriftungen der Leseransicht folgen der Sprache (ADR-074)
  const toc = page.getByRole('navigation', { name: 'Table of contents' });
  await expect(toc.getByRole('heading', { name: 'Contents' })).toBeVisible();
  await expect(toc.getByRole('link', { name: 'E2E Print packing list' }).first()).toBeVisible();
  expect(await axe()).toEqual([]);
  // nicht übersetztes Kapitel: deutsch mit Hinweis
  await toc.getByRole('link', { name: 'E2E Packliste ändern' }).first().click();
  await expect(page.getByRole('article', { name: 'E2E Packliste ändern' }).getByText('This chapter has not been translated into English yet – you are reading the German version.')).toBeVisible();
  // Sprache bleibt gemerkt
  await page.reload();
  await expect(page.getByLabel('Language')).toHaveValue('en');
  expect(await axe()).toEqual([]);

  // Lesezeichen mit Notiz
  await page.getByRole('article', { name: 'E2E Packliste ändern' }).getByRole('button', { name: '☆ Bookmark' }).click();
  await toc.getByRole('link', { name: 'All bookmarks and notes' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lesezeichen');
  await page.getByLabel('Lesezeichen filtern').fill('Packliste ändern');
  await page.getByRole('textbox', { name: 'Notiz zu „E2E Packliste ändern“' }).fill('Vor der Inventur prüfen');
  await page.getByRole('button', { name: 'Notiz zu „E2E Packliste ändern“ speichern' }).click();
  await expect(page.getByText('Notiz gespeichert.')).toBeVisible();
  await page.getByLabel('Lesezeichen filtern').fill('Inventur');
  await expect(page.getByRole('link', { name: 'E2E Packliste ändern' })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '📤 Als CSV speichern' }).click();
  const csv = fs.readFileSync(await (await download).path(), 'utf8');
  expect(csv).toContain('"E2E Packliste ändern";"Vor der Inventur prüfen"');
  expect(await axe()).toEqual([]);
  await page.getByRole('link', { name: 'E2E Packliste ändern' }).click();
  await expect(page.getByText('📝 Vor der Inventur prüfen')).toBeVisible();
  await page.goto('/lesen/lesezeichen');
  await page.getByRole('button', { name: 'Lesezeichen „E2E Packliste ändern“ entfernen' }).click();
  await expect(page.getByText('Lesezeichen „E2E Packliste ändern“ entfernt.')).toBeVisible();

  // Druck auf Englisch: Siehe auch mit Kapitelnummer, FAQ-Anhang, Rückfall-Hinweis
  await page.goto('/lesen/druck?sprache=en');
  await expect(page.getByLabel('Sprache')).toHaveValue('en');
  const printed = page.getByRole('article', { name: 'E2E Print packing list' });
  await expect(printed.locator('.print-see')).toContainText(/See also: Chapter \d+ “E2E Packliste ändern”/);
  await expect(page.getByRole('article', { name: 'E2E Packliste ändern' }).getByText('(not translated yet – German version)')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Frequently asked questions' })).toBeVisible();
  await expect(page.locator('#faq').getByText('Wo finde ich die Packliste einer Sendung?')).toBeVisible();
  await expect(page.getByRole('button', { name: '🖨️ Drucken / als PDF speichern' })).toBeEnabled();

  // Online-Hilfe: Siehe auch als Links auf die Hilfe der anderen Kapitel, passende FAQ
  expect((await request.post('/api/v1/help-contexts', { headers: red, data: { key: 'e2e.pack.print', chapterId: a.chapterId } })).ok()).toBe(true);
  expect((await request.post('/api/v1/help-contexts', { headers: red, data: { key: 'e2e.pack.edit', chapterId: b.chapterId } })).ok()).toBe(true);
  const help = await (await request.get('/api/v1/context-help/e2e.pack.print', { headers: red })).json();
  expect(help.related).toContainEqual({ chapterId: b.chapterId, title: 'E2E Packliste ändern', contextKey: 'e2e.pack.edit' });
  expect(help.faq.map((f: any) => f.question)).toContain('Wo finde ich die Packliste einer Sendung?');
});

test('[T-235] Leseransicht auf Französisch mit Übersetzung anfordern, Notiz direkt im Kapitel, gewünschte Übersetzungen für die Redaktion, Druck mit französischen Beschriftungen', async ({ page, request }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  const axe = async () => (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()).violations
    .map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 2).map((n) => n.target.join(' ')).join(' | ')}`);
  const red = { 'X-User-Id': 'u-redaktion' };
  expect((await request.patch('/api/v1/projects/p_default', { headers: { 'X-User-Id': 'u-admin' }, data: { languages: ['en', 'fr'] } })).ok()).toBe(true);
  const c = await (await request.post('/api/v1/chapter-assistant', { headers: red, data: {
    title: 'E2E Retoure buchen', purpose: 'Mit dieser Anleitung buchen Sie eine Retoure.', steps: ['Öffnen Sie **Lager › Retouren**', 'Klicken Sie auf **Buchen**'], hints: ['Retouren ohne Lieferschein prüfen.'], result: 'Erledigt.',
  } })).json();
  expect((await request.post(`/api/v1/chapter-versions/${c.versionId}/submit`, { headers: red, data: {} })).ok()).toBe(true);
  expect((await request.post(`/api/v1/chapter-versions/${c.versionId}/approve`, { headers: { 'X-User-Id': 'u-freigabe' }, data: { comment: 'ok' } })).ok()).toBe(true);

  // Leseransicht auf Französisch: Beschriftungen französisch, Kapiteltext deutsch mit Hinweis
  await page.goto(`/lesen/${c.chapterId}?lang=fr`);
  const toc = page.getByRole('navigation', { name: 'Table des matières' });
  await expect(toc.getByRole('heading', { name: 'Sommaire' })).toBeVisible();
  await expect(page.getByLabel('Langue')).toHaveValue('fr');
  const article = page.getByRole('article', { name: 'E2E Retoure buchen' });
  await expect(article.getByText('Ce chapitre n’est pas encore traduit en français – vous lisez la version allemande.')).toBeVisible();
  await expect(article.getByText('0 étapes sur 2 terminées')).toBeVisible();
  await expect(article.getByRole('heading', { name: 'Ce chapitre vous a-t-il été utile ?' })).toBeVisible();
  // Hinweise im Kapiteltext in dessen Sprache (deutsche Fassung → „Tipp“)
  await expect(article.getByText('Tipp:')).toBeVisible();
  // Übersetzung anfordern
  await article.getByRole('button', { name: 'Demander une traduction' }).click();
  await expect(article.getByText('✓ Traduction demandée – la rédaction a été informée.')).toBeVisible();
  expect(await axe()).toEqual([]);

  // Notiz direkt im Kapitel: anlegen (merkt das Kapitel), ändern, löschen
  await article.getByRole('button', { name: '📝 Ajouter une note' }).click();
  await article.getByRole('textbox', { name: 'Votre note sur ce chapitre' }).fill('Avec le chef d’équipe');
  expect(await axe()).toEqual([]);
  await article.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(page.getByText('Note enregistrée.')).toBeVisible();
  await expect(article.getByText('📝 Avec le chef d’équipe')).toBeVisible();
  await expect(article.getByRole('button', { name: '★ Signet ajouté' })).toHaveAttribute('aria-pressed', 'true');
  await article.getByRole('button', { name: 'Modifier la note' }).click();
  await article.getByRole('textbox', { name: 'Votre note sur ce chapitre' }).fill('Avec le chef d’équipe, le lundi');
  await article.getByRole('button', { name: 'Enregistrer' }).click();
  await expect(article.getByText('📝 Avec le chef d’équipe, le lundi')).toBeVisible();
  await article.getByRole('button', { name: 'Modifier la note' }).click();
  await article.getByRole('button', { name: 'Supprimer la note' }).click();
  await expect(page.getByText('Note supprimée.')).toBeVisible();
  await expect(article.getByRole('button', { name: '📝 Ajouter une note' })).toBeVisible();

  // Redaktion: gewünschte Übersetzungen, direkt anlegen
  await page.goto('/uebersetzungen');
  const wishes = page.locator('.card', { hasText: 'Gewünschte Übersetzungen' });
  const row = wishes.getByRole('row', { name: /E2E Retoure buchen/ });
  await expect(row).toContainText('Französisch');
  await expect(row).toContainText('fehlt');
  expect(await axe()).toEqual([]);
  await row.getByRole('button', { name: '„E2E Retoure buchen“ übersetzen (Französisch)' }).click();
  await expect(page.getByText('Übersetzung Französisch angelegt.')).toBeVisible();
  await expect(row).toContainText('in Arbeit');

  // Druck auf Französisch: Deckblatt, Inhaltsverzeichnis und Seitenzahlen französisch
  await page.goto('/lesen/druck?sprache=fr');
  await expect(page.getByRole('region', { name: 'Page de garde' })).toContainText('Manuel utilisateur');
  await expect(page.getByRole('navigation', { name: 'Table des matières du manuel' }).getByRole('heading', { name: 'Sommaire' })).toBeVisible();
  await expect(page.getByRole('article', { name: 'E2E Retoure buchen' }).getByText('(pas encore traduit – version allemande)')).toBeVisible();
  await expect.poll(() => page.locator('style[data-print-header]').textContent()).toContain('"Page " counter(page) " sur " counter(pages)');
  expect(await axe()).toEqual([]);
});
