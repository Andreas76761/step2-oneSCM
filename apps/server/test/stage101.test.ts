// Etappe 101: Code-Review von Etappe 100 (Regelwerk, Vormerkungen, Sparten)
import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const CHAPTER = `${FM}# 4. Verträge\n\n## 4.1 Zweck\n\nSie erfassen Verträge im Menü Verträge.\n\n## 4.2 Schritte\n\n1. Öffnen Sie **Verträge**.\n2. Klicken Sie auf **Neu**.\n\n## 4.3 Ausblick\n\nIm nächsten Release kommt die Sammelfreigabe für Verträge.\n`;

describe('Etappe 101', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (database: any) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any);
  const blocksOf = (v: any) => v.sections.flatMap((s: any) => s.blocks);
  const gateCheck = async (call: ReturnType<typeof client>, versionId: string, code: string) => (await call('GET', `/chapter-versions/${versionId}/gate`)).json.checks.find((c: any) => c.code === code);

  it('[T-433] Regelwerk: Blocker-Regel sperrt nur Einreichen und Freigabe am Text der Version – nicht Generieren; Übersichtsabsätze und „Ohne Kapitel“ wie in der Analyse', async () => {
    const built = await build(await freshDatabase(dataDir, 'e101a'));
    const call = client(built);
    try {
      await importFile(built, 'v.md', CHAPTER);
      const ch4 = (await call('GET', '/chapters')).json.find((c: any) => c.title === '4. Verträge').id;
      await call('POST', '/rulebook/rules', { kind: 'forbidden', term: 'Sammelfreigabe', severity: 'blocker' }, 'u-redaktion');
      expect((await call('POST', '/quality/analysis', {}, 'u-redaktion')).status).toBe(202);
      await built.ctx.jobs.idle();
      expect((await call('GET', '/quality/findings?type=rule')).json.map((f: any) => f.severity)).toEqual(['blocker']);
      // Generieren bleibt möglich, obwohl die Quelle den Begriff enthält
      const gen = await call('POST', `/chapters/${ch4}/generate`, {}, 'u-redaktion');
      expect(gen.status).toBe(201);
      expect((await gateCheck(call, gen.json.id, 'rulebook')).passed).toBe(false);
      expect((await gateCheck(call, gen.json.id, 'no_open_blockers')).passed).toBe(true);
      // Korrektur im Entwurf genügt – der Befund an der Quelle bleibt offen, sperrt aber nicht mehr
      const outlook = blocksOf(gen.json).find((b: any) => b.text.includes('Sammelfreigabe'));
      expect((await call('PATCH', `/content-blocks/${outlook.id}`, { text: 'Im nächsten Release kommen weitere Funktionen für Verträge.' }, 'u-redaktion')).status).toBe(200);
      expect((await gateCheck(call, gen.json.id, 'rulebook')).passed).toBe(true);

      // Pflichtbegriff nur in der generierten Übersicht („Quellen: …“ / „Freigabestatus“) zählt nicht als erfüllt
      const req = (await call('POST', '/rulebook/rules', { kind: 'required', term: 'Freigabestatus', severity: 'blocker' }, 'u-redaktion')).json;
      expect(blocksOf((await call('GET', `/chapter-versions/${gen.json.id}`)).json).some((b: any) => b.summary && b.text.includes('Freigabestatus'))).toBe(true);
      const g = await gateCheck(call, gen.json.id, 'rulebook');
      expect(g.passed).toBe(false);
      expect(g.details.join(' ')).toContain('„Freigabestatus“ fehlt im Kapitel');
      // „Ohne Kapitel“: allgemeiner Pflichtbegriff gilt dort nicht (wie in der Analyse)
      await importFile(built, 'lose.md', `${FM}Ein Text ohne Kapitelüberschrift für Verträge.\n`);
      const none = (await built.ctx.db.get<any>("SELECT id FROM chapters WHERE key = '__none__'"))!.id;
      const loose = await call('POST', `/chapters/${none}/generate`, {}, 'u-redaktion');
      expect(loose.status).toBe(201);
      expect((await gateCheck(call, loose.json.id, 'rulebook')).passed).toBe(true);
      expect((await call('DELETE', `/rulebook/rules/${req.id}`, undefined, 'u-redaktion')).status).toBe(204);
    } finally {
      await built.app.close();
    }
  });

  it('[T-434] Vormerken: nicht für Rollen- und Quellenübersicht, alle Quellen eines Absatzes oder keine; zurück ins Handbuch ohne fremdes Unterkapitel', async () => {
    const built = await build(await freshDatabase(dataDir, 'e101b'));
    const call = client(built);
    try {
      await importFile(built, 'v.md', CHAPTER);
      const ch4 = (await call('GET', '/chapters')).json.find((c: any) => c.title === '4. Verträge').id;
      const draft = (await call('POST', `/chapters/${ch4}/generate`, {}, 'u-redaktion')).json;
      const summary = blocksOf(draft).find((b: any) => b.section === 'status');
      expect(summary.summary).toBe(true);
      expect(summary.sources.length).toBeGreaterThan(1);
      const refused = await call('POST', `/content-blocks/${summary.id}/park`, { target: 'planning' }, 'u-redaktion');
      expect(refused.status).toBe(400);
      expect((await call('GET', '/parked')).json).toEqual([]);

      // Absatz mit zwei Quellen, eine davon aus einer abgelösten Revision: nichts wird vorgemerkt
      const content = blocksOf(draft).find((b: any) => b.text.includes('Sammelfreigabe'));
      expect(content.summary).toBe(false);
      // zweite Quelle aus einer anderen Datei, deren Revision inzwischen abgelöst ist
      await importFile(built, 'lose.md', `${FM}Ein Text ohne Kapitelüberschrift für Verträge.\n`);
      const other = (await call('GET', '/snippets?q=Kapitelüberschrift')).json.items[0];
      const otherRev = (await built.ctx.db.get<any>('SELECT revision_id AS r FROM text_snippets WHERE id = ?', other.id))!.r;
      await built.ctx.db.run('INSERT INTO content_block_sources VALUES (?, ?)', content.id, other.id);
      await built.ctx.db.run('UPDATE source_revisions SET is_current = 0 WHERE id = ?', otherRev);
      expect((await call('POST', `/content-blocks/${content.id}/park`, { target: 'intern' }, 'u-redaktion')).status).toBe(409);
      expect((await call('GET', '/parked')).json).toEqual([]);
      const after = (await call('GET', `/chapter-versions/${draft.id}`)).json;
      expect(blocksOf(after).find((b: any) => b.id === content.id).sources).toHaveLength(2);
      await built.ctx.db.run('UPDATE source_revisions SET is_current = 1 WHERE id = ?', otherRev);
      await built.ctx.db.run('DELETE FROM content_block_sources WHERE block_id = ? AND snippet_id = ?', content.id, other.id);

      // Herkunftskapitel entfällt: zurück nach „Ohne Kapitel“, aber ohne das Unterkapitel des alten Kapitels
      const snippetId = content.sources[0].snippetId;
      expect((await call('POST', `/snippets/${snippetId}/park`, { target: 'planning' }, 'u-redaktion')).status).toBe(200);
      const sub = (await built.ctx.db.get<any>('SELECT parked_from_subchapter_id AS s FROM text_snippets WHERE id = ?', snippetId))!.s;
      expect(sub).toBeTruthy();
      await built.ctx.db.run("UPDATE text_snippets SET parked_from_chapter_id = 'ch_gone' WHERE id = ?", snippetId);
      const back = (await call('DELETE', `/snippets/${snippetId}/park`, undefined, 'u-redaktion')).json;
      const none = (await built.ctx.db.get<any>("SELECT id FROM chapters WHERE key = '__none__'"))?.id;
      expect(none).toBeTruthy();
      expect(back.chapterId).toBe(none);
      expect((await built.ctx.db.get<any>('SELECT subchapter_id AS s FROM text_snippets WHERE id = ?', snippetId))!.s).toBeNull();
    } finally {
      await built.app.close();
    }
  });

  it('[T-435] Absatzversion aus der Zeit vor dem Spartenwechsel wiederherstellen: Truck/Bus werden PKW und VAN', async () => {
    const built = await build(await freshDatabase(dataDir, 'e101c'));
    const call = client(built);
    try {
      await importFile(built, 'v.md', CHAPTER);
      const ch4 = (await call('GET', '/chapters')).json.find((c: any) => c.title === '4. Verträge').id;
      const draft = (await call('POST', `/chapters/${ch4}/generate`, {}, 'u-redaktion')).json;
      const block = blocksOf(draft).find((b: any) => b.text.includes('erfassen'));
      // Fassung 1 stammt aus der Zeit vor dem Wechsel: Sparte Truck im Snapshot
      const v1 = (await built.ctx.db.get<any>('SELECT snapshot FROM content_block_versions WHERE block_id = ? AND version_no = 1', block.id))!;
      const snap = JSON.parse(v1.snapshot);
      await built.ctx.db.run('UPDATE content_block_versions SET snapshot = ? WHERE block_id = ? AND version_no = 1', JSON.stringify({ ...snap, divisions: ['truck', 'car'] }), block.id);
      expect((await call('PATCH', `/content-blocks/${block.id}`, { text: 'Sie erfassen Verträge.' }, 'u-redaktion')).status).toBe(200);
      const restored = await call('POST', `/content-blocks/${block.id}/restore`, { versionNo: 1 }, 'u-redaktion');
      expect(restored.status).toBe(200);
      const now = blocksOf((await call('GET', `/chapter-versions/${draft.id}`)).json).find((b: any) => b.id === block.id);
      expect(now.divisions).toEqual(['car', 'van']);
    } finally {
      await built.app.close();
    }
  });
});
