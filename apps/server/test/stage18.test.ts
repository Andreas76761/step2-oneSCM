import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { analyzeGuidance, isAction } from '../src/domain/guidance.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const fm = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';

describe('Etappe 18', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
  } as any));

  it('[T-186] Stilregel-Bibliotheken: anlegen (Liste/CSV/aus Projekt), abonnieren, Vorrang der Projektregeln, Prüfung nutzt Bibliothek', async () => {
    const built = await build('libs');
    const call = client(built);
    try {
      expect((await call('POST', '/style-libraries', { name: 'Konzern' }, 'u-redaktion')).status).toBe(403);
      const lib = (await call('POST', '/style-libraries', { name: 'Konzern', description: 'Für alle Handbücher', phrases: [{ avoid: 'Kunde', use: 'Kundin oder Kunde' }, { avoid: 'Popup', use: 'Dialogfenster' }] })).json;
      expect(lib).toMatchObject({ name: 'Konzern', projects: 0 });
      expect((await call('POST', '/style-libraries', { name: 'konzern' })).status).toBe(409);
      const csvLib = (await call('POST', '/style-libraries', { name: 'Technik', csv: 'vermeiden;aktion;ersetzen durch\nPopup;ersetzen;Fenster\nButton;ersetzen;Schaltfläche\n' })).json;
      expect(csvLib.phrases).toHaveLength(2);
      // Leser sehen die Liste (Auswahl im Projekt), API-Tokens nicht
      expect((await call('GET', '/style-libraries', undefined, 'u-leser')).json).toHaveLength(2);
      // globale Berechtigungen für die Oberfläche (Pflege nur mit globalem „admin“)
      expect((await call('GET', '/me')).json.globalPermissions).toContain('admin');
      expect((await call('GET', '/me', undefined, 'u-redaktion')).json.globalPermissions).not.toContain('admin');
      // Abonnieren: nur Projekt-Administration; Reihenfolge = Vorrang
      expect((await call('PUT', '/style/libraries', { libraryIds: [lib.id] }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/style/libraries', { libraryIds: ['sl-gibtsnicht'] })).status).toBe(404);
      expect((await call('PUT', '/style/libraries', { libraryIds: [csvLib.id, lib.id] })).json.subscribed).toEqual([csvLib.id, lib.id]);
      await call('PUT', '/style/rules', { phrases: [{ avoid: 'Button', use: 'Knopf' }] });
      const eff = (await call('GET', '/style/rules/effective', undefined, 'u-leser')).json;
      expect(eff.phrases.map((p: any) => [p.avoid, p.use, p.source.type])).toEqual([['Button', 'Knopf', 'project'], ['Popup', 'Fenster', 'library'], ['Kunde', 'Kundin oder Kunde', 'library']]);
      expect(eff.shadowed.map((s: any) => [s.avoid, s.libraryName])).toEqual([['Button', 'Technik'], ['Popup', 'Konzern']]);
      // Prüfung nutzt die Bibliothek
      const chk = (await call('POST', '/style/check', { text: 'Das Popup zeigt den Kunde.' })).json;
      expect(chk.sentences[0].issues.filter((i: any) => i.rule === 'custom').map((i: any) => i.fix?.replacement)).toEqual(['Fenster', 'Kundin oder Kunde']);
      // Bibliothek ändern wirkt sofort; CSV zusammenführen
      await call('PATCH', `/style-libraries/${lib.id}`, { csv: 'vermeiden;aktion\nAnwender;hinweis\n', mode: 'merge' });
      expect((await call('GET', `/style-libraries/${lib.id}`)).json.phrases.map((p: any) => p.avoid)).toEqual(['Kunde', 'Popup', 'Anwender']);
      const csv = await built.app.inject({ method: 'GET', url: `/api/v1/style-libraries/${lib.id}/export`, headers: { 'x-demo-user': 'u-admin' } });
      expect(csv.headers['content-disposition']).toContain('stilregeln-konzern.csv');
      expect(csv.body).toContain('Anwender;hinweis');
      // aus Projektregeln anlegen
      const fromProject = (await call('POST', '/style-libraries', { name: 'Aus Projekt', fromProjectId: 'p_default' })).json;
      expect(fromProject.phrases.map((p: any) => p.avoid)).toEqual(['Button']);
      // Löschen nur ohne Abonnements
      expect((await call('DELETE', `/style-libraries/${lib.id}`)).status).toBe(409);
      await call('PUT', '/style/libraries', { libraryIds: [csvLib.id] });
      expect((await call('DELETE', `/style-libraries/${lib.id}`)).status).toBe(204);
      expect(await built.ctx.db.get("SELECT 1 FROM audit_events WHERE action = 'style.libraries_changed'")).toBeTruthy();
    } finally {
      await built.app.close();
    }
  });

  it('[T-187] Anleitungs-Check: Aufbau und Form der Schritte, Korrekturen übernehmen, Übersicht je Kapitel', async () => {
    // Fachlogik
    expect(isAction('Klicken Sie auf **Speichern**.')).toBe(true);
    expect(isAction('Dann wählen Sie den Lieferanten.')).toBe(true);
    expect(isAction('Klicke auf Speichern.')).toBe(true);
    expect(isAction('Auf **Speichern** klicken.')).toBe(true);
    expect(isAction('Können Sie den Auftrag ändern?')).toBe(false);
    expect(isAction('Der Auftrag wird gespeichert.')).toBe(false);
    const a = analyzeGuidance([
      { id: 'b1', section: 'steps', kind: 'paragraph', text: 'So legen Sie einen Auftrag an. Öffnen Sie Einkauf > Aufträge. Klicken Sie auf Neu und wählen Sie den Lieferanten.', versionNo: 1 },
      { id: 'b2', section: 'hints', kind: 'paragraph', text: 'Die MOQ gilt je Artikel (Mindestbestellmenge laut EK).', versionNo: 1 },
    ], { knownAcronyms: new Set(['EK']) });
    const byCode = Object.fromEntries(a.checks.map((c) => [c.code, c]));
    expect(byCode.purpose.status).toBe('warning');
    expect(byCode.purpose.addSection?.section).toBe('purpose');
    expect(byCode.result.status).toBe('info');
    expect(byCode.numbered.items[0].fix).toMatchObject({ kind: 'list', text: 'So legen Sie einen Auftrag an.\n\n1. Öffnen Sie Einkauf > Aufträge.\n2. Klicken Sie auf Neu.\n3. Wählen Sie den Lieferanten.' });
    expect(byCode.menu_bold.items[0]).toMatchObject({ excerpt: 'Einkauf > Aufträge' });
    expect(byCode.menu_bold.items[0].fix?.text).toContain('**Einkauf > Aufträge**');
    expect(byCode.abbreviations.items.map((i) => i.excerpt)).toEqual(['MOQ']);
    expect(analyzeGuidance([{ id: 'm', section: 'steps', kind: 'paragraph', text: 'Öffnen Sie Produkte › Preislisten.', versionNo: 1 }]).checks.find((c) => c.code === 'menu_bold')!.items[0].fix?.text).toBe('Öffnen Sie **Produkte › Preislisten**.');
    expect(a.score).toBeLessThan(80);
    // ein Absatz im Abschnitt „Schritte“ ohne Handlung zählt nicht als Anleitung
    const noAction = analyzeGuidance([{ id: 's', section: 'steps', kind: 'paragraph', text: 'Der Auftrag wird gespeichert.', versionNo: 1 }]);
    expect(noAction.checks.find((c) => c.code === 'steps')).toMatchObject({ status: 'warning', addSection: { section: 'steps' } });

    const built = await build('guidance');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${fm}# 1. Auftrag anlegen\n\nÖffnen Sie Einkauf > Aufträge. Klicken Sie auf **Neu**. Geben Sie die Menge ein.\n`);
      const ch = (await call('GET', '/chapters')).json.find((c: any) => c.title === '1. Auftrag anlegen');
      const v = (await call('POST', `/chapters/${ch.id}/generate`, {}, 'u-redaktion')).json;
      const g = (await call('GET', `/guidance/chapter-versions/${v.id}`, undefined, 'u-leser')).json;
      expect(g).toMatchObject({ editable: true, total: 11 });
      const numbered = g.checks.find((c: any) => c.code === 'numbered');
      expect(numbered.status).toBe('warning');
      expect(numbered.items[0].section).toBeTruthy();
      // Korrektur übernehmen: nur mit Bearbeitungsrecht; danach als Liste gespeichert
      const fix = numbered.items[0].fix;
      expect((await call('POST', `/guidance/chapter-versions/${v.id}/apply`, { fixes: [fix] }, 'u-leser')).status).toBe(403);
      const r = (await call('POST', `/guidance/chapter-versions/${v.id}/apply`, { fixes: [fix] }, 'u-redaktion')).json;
      expect(r.saved).toEqual([fix.blockId]);
      expect(r.guidance.checks.find((c: any) => c.code === 'numbered').status).toBe('ok');
      const block = (await call('GET', `/chapter-versions/${v.id}`)).json.sections.flatMap((s: any) => s.blocks).find((b: any) => b.id === fix.blockId);
      expect(block).toMatchObject({ kind: 'list' });
      expect(block.text).toMatch(/^1\. /m);
      // veraltete Korrektur wird übersprungen
      expect((await call('POST', `/guidance/chapter-versions/${v.id}/apply`, { fixes: [fix] }, 'u-redaktion')).json.skipped[0].reason).toContain('zwischenzeitlich');
      // Übersicht
      const sum = (await call('GET', '/guidance')).json;
      expect(sum.chapters.find((c: any) => c.chapterId === ch.id)).toMatchObject({ versionId: v.id, total: 11 });
      expect(sum.average).toBeGreaterThan(0);
      expect((await call('GET', '/guidance/chapter-versions/cv_fremd')).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });

  it('[T-188] Kapitel-Assistent: Vorschläge aus Quellen, Kapitel im Standardaufbau mit Quellenbezug anlegen', async () => {
    const built = await build('assistant');
    const call = client(built);
    try {
      await importFile(built, 'wa.md', `${fm}# 3. Wareneingang\n\nVoraussetzung: Die Bestellung muss bereits angelegt sein.\n\nÖffnen Sie **Lager > Wareneingang**. Wählen Sie die Bestellung zum Wareneingang aus. Klicken Sie auf **Buchen**.\n\nDer Wareneingang wird gebucht und im Bestand angezeigt.\n\nHinweis: Teillieferungen beim Wareneingang buchen Sie einzeln.\n`);
      const s = (await call('GET', `/chapter-assistant/suggestions?topic=${encodeURIComponent('Wareneingang buchen')}`, undefined, 'u-leser')).json;
      expect(s.terms).toEqual(['wareneingang', 'buchen']);
      expect(s.suggestions.steps.map((x: any) => x.text)).toEqual(expect.arrayContaining(['Wählen Sie die Bestellung zum Wareneingang aus.', 'Klicken Sie auf **Buchen**.']));
      expect(s.suggestions.prerequisites[0].text).toContain('Bestellung muss bereits angelegt');
      expect(s.suggestions.result[0].text).toContain('wird gebucht');
      expect(s.suggestions.hints[0].text).toContain('Teillieferungen');
      const step = s.suggestions.steps.find((x: any) => x.text.startsWith('Wählen'));
      // Anlegen: Bearbeitungsrecht, Pflichtfelder
      expect((await call('POST', '/chapter-assistant', { title: 'X', purpose: 'Y', steps: ['Z'] }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/chapter-assistant', { title: 'Wareneingang buchen', purpose: 'Zweck', steps: [] }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/chapter-assistant', { title: 'W', purpose: 'Zweck', steps: [{ text: 'Klicken', snippetId: 'sn_fremd' }] }, 'u-redaktion')).status).toBe(400);
      const created = await call('POST', '/chapter-assistant', {
        title: 'Wareneingang buchen', purpose: 'Mit dieser Anleitung buchen Sie eine Lieferung in den Bestand.',
        prerequisites: ['Die Bestellung ist angelegt'], steps: ['Öffnen Sie **Lager > Wareneingang**', { text: step.text, snippetId: step.snippetId }, 'Klicken Sie auf **Buchen**'],
        result: 'Der Wareneingang ist gebucht und im Bestand sichtbar.', hints: ['Teillieferungen buchen Sie einzeln'],
      }, 'u-redaktion');
      expect(created.status).toBe(201);
      const { chapterId, versionId, guidance } = created.json;
      expect(guidance.checks.filter((c: any) => c.status !== 'ok').map((c: any) => c.code)).toEqual([]);
      expect(guidance.score).toBe(100);
      const v = (await call('GET', `/chapter-versions/${versionId}`)).json;
      expect(v).toMatchObject({ status: 'draft', versionNo: 1, title: 'Wareneingang buchen' });
      const steps = v.sections.find((x: any) => x.code === 'steps').blocks[0];
      expect(steps.text).toBe('1. Öffnen Sie **Lager > Wareneingang**.\n2. Wählen Sie die Bestellung zum Wareneingang aus.\n3. Klicken Sie auf **Buchen**.');
      expect(steps.sources.map((x: any) => x.snippetId)).toEqual([step.snippetId]);
      expect(v.sections.find((x: any) => x.code === 'hints').blocks[0]).toMatchObject({ kind: 'tip', text: 'Teillieferungen buchen Sie einzeln.' });
      expect((await call('GET', '/chapters')).json.some((c: any) => c.id === chapterId)).toBe(true);
      expect((await call('POST', '/chapter-assistant', { title: 'wareneingang buchen', purpose: 'Z', steps: ['A'] }, 'u-redaktion')).status).toBe(400);
    } finally {
      await built.app.close();
    }
  });
});
