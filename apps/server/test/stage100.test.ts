import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { classifySnippet } from '../src/domain/classify.js';
import { evaluateGate } from '../src/domain/gate.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const CHAPTER = `${FM}# 4. Verträge\n\n## 4.1 Zweck\n\nSie erfassen Verträge im Menü Verträge.\n\n## 4.2 Schritte\n\n1. Öffnen Sie **Verträge**.\n2. Klicken Sie auf **Neu**.\n\n## 4.3 Ausblick\n\nIm nächsten Release kommt die Sammelfreigabe für Verträge.\n`;

describe('Etappe 100', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (database: any) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any);
  const blocksOf = (v: any) => v.sections.flatMap((s: any) => s.blocks);

  it('[T-429] Sparten nur PKW und VAN, ohne Angabe beide; bisherige Bus-/Truck-Zuordnungen werden zu PKW und VAN (unbestätigt)', async () => {
    const none = classifySnippet({ text: 'Allgemeiner Text.', headings: [], path: 'x.md', frontMatter: {} });
    expect(none.divisions.map((d) => [d.code, d.evidenceStatus])).toEqual([['car', 'unconfirmed'], ['van', 'unconfirmed']]);
    expect(classifySnippet({ text: 'Für Busse und LKW.', headings: [], path: 'bus/truck.md', frontMatter: {} }).divisions.map((d) => d.code)).toEqual(['car', 'van']);

    const database = await freshDatabase(dataDir, 'e100a');
    let built = await build(database);
    let call = client(built);
    expect((await call('GET', '/reference')).json.divisions.map((d: any) => d.code)).toEqual(['car', 'van', 'all', 'unconfirmed']);
    await importFile(built, 'v.md', CHAPTER);
    const sn = (await call('GET', '/snippets?q=erfassen')).json.items[0];
    expect((await call('PATCH', `/snippets/${sn.id}`, { divisions: ['truck'] }, 'u-redaktion')).status).toBe(400);
    // Altbestand wie vor dem Wechsel: Sparten Truck und Bus mit Zuordnungen, auch in Listen (FAQ)
    const db = built.ctx.db;
    await db.run("INSERT INTO divisions (code, label, icon, color) VALUES ('truck', 'Truck', 'truck', '#b91c1c'), ('bus', 'Bus', 'bus', '#a16207')");
    await db.run('DELETE FROM snippet_divisions WHERE snippet_id = ?', sn.id);
    await db.run("INSERT INTO snippet_divisions VALUES (?, 'truck', 1, 'front-matter', 'rules-1.0', 'source_confirmed', 'Front-Matter'), (?, 'car', 1, 'front-matter', 'rules-1.0', 'source_confirmed', 'Front-Matter')", sn.id, sn.id);
    const faq = (await call('POST', '/faq', { question: 'Wer pflegt Busverträge?', answer: 'Die Zentrale.', divisions: ['car'], status: 'published' }, 'u-redaktion')).json;
    expect((await call('POST', '/faq', { question: 'Wer?', answer: 'Die Zentrale.', divisions: ['bus'] }, 'u-redaktion')).status).toBe(400);
    await db.run('UPDATE faq_entries SET divisions = ? WHERE id = ?', '["bus","car"]', faq.id);
    await built.app.close();

    // Neustart: Umstellung läuft einmal
    built = await build(database);
    call = client(built);
    try {
      const after = (await call('GET', `/snippets/${sn.id}`)).json.divisions;
      expect(after.map((d: any) => [d.code, d.evidenceStatus])).toEqual([['car', 'source_confirmed'], ['van', 'unconfirmed']]);
      expect((await call('GET', '/faq')).json.find((f: any) => f.id === faq.id).divisions).toEqual(['car', 'van']);
      expect(await built.ctx.db.get("SELECT code FROM divisions WHERE code IN ('truck', 'bus')")).toBeUndefined();
    } finally {
      await built.app.close();
    }
  });

  it('[T-430] Regelwerk: Regeln allgemein und je Kapitel, als Befund in der Analyse, Blocker-Regel sperrt die Freigabe', async () => {
    const built = await build(await freshDatabase(dataDir, 'e100b'));
    const call = client(built);
    try {
      await importFile(built, 'v.md', CHAPTER);
      await importFile(built, 'w.md', `${FM}# 5. Wartung\n\n## 5.1 Zweck\n\nSie planen die Wartung im Menü Werkstatt.\n`);
      const chapters = (await call('GET', '/chapters')).json;
      const ch4 = chapters.find((c: any) => c.title === '4. Verträge').id;
      // Pflege nur mit Bearbeitungsrecht; Art, Schweregrad und Muster geprüft
      expect((await call('POST', '/rulebook/rules', { kind: 'forbidden', term: 'Sammelfreigabe' }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/rulebook/rules', { kind: 'verboten', term: 'x' }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/rulebook/rules', { kind: 'pattern', term: '(a+)+$' }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/rulebook/rules', { kind: 'forbidden', term: 'x', severity: 'kritisch' }, 'u-redaktion')).status).toBe(400);
      // allgemein: verbotener Begriff; je Kapitel: Pflichtbegriff „Vertragsnummer“ nur für Kapitel 4
      const forbidden = (await call('POST', '/rulebook/rules', { kind: 'forbidden', term: 'Sammelfreigabe', message: 'Funktion noch nicht freigegeben', severity: 'high' }, 'u-redaktion')).json;
      const required = (await call('POST', '/rulebook/rules', { kind: 'required', term: 'Vertragsnummer', chapterId: ch4, severity: 'medium' }, 'u-redaktion')).json;
      expect((await call('GET', '/rulebook/rules')).json.rules.map((r: any) => [r.kind, r.chapterTitle])).toEqual([['forbidden', null], ['required', '4. Verträge']]);
      expect(required.chapterTitle).toBe('4. Verträge');

      // Gate nennt Blocker-Befunde mit deutschem Typ (nicht „rule“)
      const g = evaluateGate([], [{ id: 'f1', seq: 7, type: 'rule', severity: 'blocker', status: 'open', reason: 'Regelwerk (…)' }], { purpose: 'approve' });
      expect(g.checks.find((c) => c.code === 'no_open_blockers')!.details).toEqual(['#7 Regelwerk: Regelwerk (…)']);
      expect((await call('POST', '/quality/analysis', {}, 'u-redaktion')).status).toBe(202);
      await built.ctx.jobs.idle();
      const rules = (await call('GET', '/quality/findings?type=rule')).json;
      expect(rules.map((f: any) => [f.subtype, f.chapterId, f.severity]).sort()).toEqual([['forbidden', ch4, 'high'], ['required', ch4, 'medium']]);
      expect(rules.find((f: any) => f.subtype === 'forbidden').reason).toContain('„Sammelfreigabe“ ist nicht erlaubt – Funktion noch nicht freigegeben');
      // Kapitel 5 hat den Pflichtbegriff nicht – die Regel gilt dort aber nicht
      expect(rules.some((f: any) => f.chapterId !== ch4)).toBe(false);

      // Blocker-Regel: sperrt die Freigabe der Version, bis der Begriff weg ist bzw. die Regel aus ist
      await call('PATCH', `/rulebook/rules/${required.id}`, { active: false }, 'u-redaktion');
      await call('PATCH', `/rulebook/rules/${forbidden.id}`, { severity: 'blocker' }, 'u-redaktion');
      const v = (await call('POST', `/chapters/${ch4}/generate`, {}, 'u-redaktion'));
      expect(v.status).toBe(201);
      for (const b of blocksOf(v.json)) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
      // schon das Einreichen ist gesperrt
      const blocked = await call('POST', `/chapter-versions/${v.json.id}/submit`, {}, 'u-redaktion');
      expect(blocked.status).toBe(409);
      expect(JSON.stringify(blocked.json)).toContain('Regelwerk');
      await call('PATCH', `/rulebook/rules/${forbidden.id}`, { active: false }, 'u-redaktion');
      expect((await call('POST', `/chapter-versions/${v.json.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
      // Regel vor der Freigabe wieder aktiv: Freigabe gesperrt
      await call('PATCH', `/rulebook/rules/${forbidden.id}`, { active: true }, 'u-redaktion');
      const denied = await call('POST', `/chapter-versions/${v.json.id}/approve`, { comment: 'ok' }, 'u-freigabe');
      expect(denied.status).toBe(409);
      expect(JSON.stringify(denied.json)).toContain('Regelwerk');
      await call('PATCH', `/rulebook/rules/${forbidden.id}`, { active: false }, 'u-redaktion');
      expect((await call('POST', `/chapter-versions/${v.json.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      expect((await call('DELETE', `/rulebook/rules/${forbidden.id}`, undefined, 'u-redaktion')).status).toBe(204);
    } finally {
      await built.app.close();
    }
  });

  it('[T-431] Kapitel „Intern“ und „In Planung“: Abschnitte vormerken, im Entwurf sofort weg, nach erneutem Import weiter vorgemerkt, zurück ins Handbuch', async () => {
    const built = await build(await freshDatabase(dataDir, 'e100c'));
    const call = client(built);
    try {
      await importFile(built, 'v.md', CHAPTER);
      const ch4 = (await call('GET', '/chapters')).json.find((c: any) => c.title === '4. Verträge').id;
      const draft = (await call('POST', `/chapters/${ch4}/generate`, {}, 'u-redaktion')).json;
      const outlook = blocksOf(draft).find((b: any) => b.text.includes('Sammelfreigabe'));
      expect(outlook).toBeTruthy();
      // Absatz für „In Planung“ vormerken: im Entwurf sofort weg
      expect((await call('POST', `/content-blocks/${outlook.id}/park`, { target: 'planning' }, 'u-leser')).status).toBe(403);
      expect((await call('POST', `/content-blocks/${outlook.id}/park`, { target: 'archiv' }, 'u-redaktion')).status).toBe(400);
      const parked = (await call('POST', `/content-blocks/${outlook.id}/park`, { target: 'planning', note: 'kommt mit PI 14' }, 'u-redaktion')).json;
      expect(parked).toMatchObject({ parked: 1, removedBlocks: 1 });
      expect(blocksOf((await call('GET', `/chapter-versions/${draft.id}`)).json).some((b: any) => b.text.includes('Sammelfreigabe'))).toBe(false);
      const list = (await call('GET', '/parked')).json;
      expect(list.map((p: any) => [p.target, p.fromChapter, p.note])).toEqual([['planning', '4. Verträge', 'kommt mit PI 14']]);
      // nicht im Handbuch: Kapitelliste, Neuerzeugung, Analyse
      expect((await call('GET', '/chapters')).json.some((c: any) => c.title === 'In Planung')).toBe(false);
      const next = (await call('POST', `/chapters/${ch4}/generate`, {}, 'u-redaktion')).json;
      expect(blocksOf(next).some((b: any) => b.text.includes('Sammelfreigabe'))).toBe(false);
      const reserved = (await built.ctx.db.get<any>("SELECT id FROM chapters WHERE key = '__planung__'"))!.id;
      expect((await call('POST', `/chapters/${reserved}/generate`, {}, 'u-redaktion')).status).toBe(409);

      // Datei geändert und neu eingelesen: der vorgemerkte Text bleibt vorgemerkt
      await importFile(built, 'v.md', CHAPTER.replace('Klicken Sie auf **Neu**.', 'Klicken Sie auf **Neu anlegen**.'));
      const again = (await call('GET', '/parked?target=planning')).json;
      expect(again).toHaveLength(1);
      expect(again[0].fromChapter).toBe('4. Verträge');
      // Wechsel nach „Intern“ und zurück ins Handbuch
      expect((await call('POST', `/snippets/${again[0].id}/park`, { target: 'intern' }, 'u-redaktion')).json.target).toBe('intern');
      expect((await call('GET', '/parked?target=intern')).json.map((p: any) => p.fromChapter)).toEqual(['4. Verträge']);
      expect((await call('DELETE', `/snippets/${again[0].id}/park`, undefined, 'u-redaktion')).json.chapterId).toBe(ch4);
      expect((await call('GET', '/parked')).json).toEqual([]);
      const back = (await call('POST', `/chapters/${ch4}/generate`, {}, 'u-redaktion')).json;
      expect(blocksOf(back).some((b: any) => b.text.includes('Sammelfreigabe'))).toBe(true);
      expect((await call('DELETE', `/snippets/${again[0].id}/park`, undefined, 'u-redaktion')).status).toBe(409);
    } finally {
      await built.app.close();
    }
  });
});
