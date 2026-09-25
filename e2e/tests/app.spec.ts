import { crc32, deflateSync } from 'node:zlib';
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
  await expect(nav.getByText('Dashboard', { exact: true })).toBeHidden();
  await expect(nav.getByRole('link', { name: 'Dashboard' })).toBeVisible();
  await page.reload();
  await page.getByRole('button', { name: 'Navigation ausklappen' }).click();
  await expect(nav.getByText('Dashboard', { exact: true })).toBeVisible();

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
  await page.getByRole('button', { name: 'Alle Korrekturen im Satz' }).click();
  await expect(page.getByRole('textbox', { name: 'Satz' })).toHaveValue('Die Daten werden gespeichert.');
  await page.getByRole('button', { name: 'Übernehmen', exact: true }).click();
  await expect(page.locator('.style-sentence.warn')).toHaveCount(1);
  // ins Präsens umwandeln (Demo-KI) und Vorschlag übernehmen
  await page.getByRole('button', { name: 'In Präsens umwandeln' }).click();
  await expect(page.getByRole('heading', { name: 'Nachher' })).toBeVisible();
  await page.getByRole('button', { name: 'Vorschlag übernehmen' }).click();
  await expect(page.getByRole('textbox', { name: 'Text' })).toHaveValue('Die Daten werden gespeichert. Klicken Sie auf Speichern. Die Liste wird angezeigt.');
  await expect(page.locator('.style-sentence.warn')).toHaveCount(0);
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
