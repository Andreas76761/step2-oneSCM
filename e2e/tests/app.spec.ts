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
  await page.getByRole('button', { name: 'Speichern' }).click();
  await expect(page.getByText('Einstellungen gespeichert.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Verfahren (ADR-017)')).toHaveValue('hybrid');
  await page.getByLabel('Verfahren (ADR-017)').selectOption('tfidf');
  await page.getByRole('button', { name: 'Speichern' }).click();
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
