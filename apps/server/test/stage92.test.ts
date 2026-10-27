import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { openDb } from '../src/db.js';
import { xliffLanguageFits } from '../src/domain/translate.js';
import { cachedOverview, touchMetadata } from '../src/services/metadataCache.js';
import { client, FM, importFile, uploadFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const paragraphWith = (xml: string, text: string) => {
  const m = new RegExp(`<w:p>(?:(?!<w:p>)[\\s\\S])*?${escapeRe(text)}[\\s\\S]*?</w:p>`).exec(xml);
  if (!m) throw new Error(`Absatz „${text}“ nicht gefunden`);
  return m[0];
};

describe('Etappe 92', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-412] Übersicht nach dem COMMIT verworfen, keine Berechnung aus der Zeit eines Schreibzugriffs gespeichert; XLIFF mit Gebietsschema (Einheit)', async () => {
    const db = await openDb(await freshDatabase(dataDir, 'e92u'));
    try {
      // afterCommit: in der Transaktion erst nach dem COMMIT, nach einem ROLLBACK nie, ohne Transaktion sofort
      const seen: string[] = [];
      await db.tx(async () => {
        db.afterCommit(() => seen.push('commit'));
        expect(seen).toEqual([]);
      });
      expect(seen).toEqual(['commit']);
      await expect(db.tx(async () => {
        db.afterCommit(() => seen.push('rollback'));
        throw new Error('x');
      })).rejects.toThrow('x');
      db.afterCommit(() => seen.push('direkt'));
      expect(seen).toEqual(['commit', 'direkt']);

      // eine Anfrage während der Transaktion liest den alten Stand – nach dem COMMIT wird er nicht mehr geliefert
      let n = 0;
      const compute = async () => ++n;
      await db.tx(async () => {
        touchMetadata({ db, projectId: 'p9' });
        expect(await cachedOverview('p9', compute)).toBe(1);
      });
      expect(await cachedOverview('p9', compute)).toBe(2);
      // Schreibzugriff während der Berechnung: das Ergebnis wird nicht gespeichert
      let release!: () => void;
      const slow = cachedOverview('p10', async () => (await new Promise<void>((r) => (release = r)), 100));
      await new Promise((r) => setImmediate(r));
      touchMetadata({ db, projectId: 'p10' });
      release();
      expect(await slow).toBe(100);
      expect(await cachedOverview('p10', compute)).toBe(3);
    } finally {
      await db.close();
    }

    expect(xliffLanguageFits('fr-fr', 'fr')).toBe(true);
    expect(xliffLanguageFits('en_GB', 'en')).toBe(true);
    expect(xliffLanguageFits('ko-KR', 'ko')).toBe(true);
    expect(xliffLanguageFits('fr', 'fr')).toBe(true);
    expect(xliffLanguageFits('de-CH', 'de-ch')).toBe(true);
    expect(xliffLanguageFits('fr-FR', 'fr-ch')).toBe(false);
    expect(xliffLanguageFits('fr', 'en')).toBe(false);
  });

  it('[T-413] Neue Absätze aus Word in der Reihenfolge der Datei; Fehlerliste nur im eigenen Projekt; nur ein Triage-Lauf zugleich', async () => {
    const built = await build('e92');
    const call = client(built);
    try {
      const md = `${FM}# Kündigung\n\n## Vertrag kündigen\n\nVerträge kündigen Sie im Menü Verträge mit der Schaltfläche Kündigen. Die Kündigungsfrist beträgt 30 Tage.\n\nNach der Kündigung erhält der Händler eine Bestätigung per E-Mail.\n`;
      await importFile(built, 'kuendigung.md', md);
      const chapterId = (await call('GET', '/chapters')).json.find((c: any) => c.title === 'Kündigung').id;
      const v = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
      for (const b of v.sections.flatMap((s: any) => s.blocks)) {
        if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
        else if (b.scopeStatus === 'unconfirmed') await call('PATCH', `/content-blocks/${b.id}`, { scopeStatus: 'general', reason: 'allgemein' }, 'u-redaktion');
      }
      expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      const exp = (await call('POST', '/exports', { format: 'docx', chapterIds: [chapterId], reviewCopy: true }, 'u-leser')).json;
      const zip = await JSZip.loadAsync((await call('GET', exp.downloadUrl.replace('/api/v1', ''), undefined, 'u-leser')).raw as Buffer);
      let xml = await zip.file('word/document.xml')!.async('string');
      // in Word drei neue Absätze hinter demselben Absatz
      const anchor = 'Nach der Kündigung erhält der Händler eine Bestätigung per E-Mail.';
      const p = paragraphWith(xml, anchor);
      const added = ['Erster neuer Absatz zur Kündigung.', 'Zweiter neuer Absatz zur Kündigung.', 'Dritter neuer Absatz zur Kündigung.'];
      xml = xml.replace(p, p + added.map((t) => p.replace(anchor, t)).join(''));
      zip.file('word/document.xml', xml);
      const batch = (await uploadFile(built, '/revisions/word', 'pruefung.docx', await zip.generateAsync({ type: 'nodebuffer' }), 'u-redaktion')).json;
      const props = batch.chapters[0].proposals.filter((x: any) => x.change === 'added');
      expect(props.map((x: any) => x.proposed)).toEqual(added);
      // einzeln in anderer Reihenfolge übernehmen: dritter, erster, zweiter
      let draftId = '';
      for (const k of [2, 0, 1]) draftId = (await call('POST', `/revision-proposals/${props[k].id}/decision`, { decision: 'accept' }, 'u-redaktion')).json.appliedVersionId;
      const texts = (await call('GET', `/chapter-versions/${draftId}`)).json.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text));
      const at = texts.indexOf(anchor);
      expect(texts.slice(at, at + 4)).toEqual([anchor, ...added]);
      expect(v.id).not.toBe(draftId);

      // Fehlerliste: Kennung einer Kapitelversion aus einem anderen Projekt
      const other = (await call('POST', '/projects', { name: 'Anderes Projekt' })).json;
      expect((await call('POST', '/language-errors/collect', { versionId: v.id }, 'u-admin', other.id)).status).toBe(404);
      expect((await call('GET', '/language-errors', undefined, 'u-admin', other.id)).json.items ?? []).toEqual([]);
      expect((await call('POST', '/language-errors/collect', { versionId: v.id }, 'u-redaktion')).status).toBe(200);

      // Triage: solange ein Lauf läuft, startet kein zweiter; ein alter „running“-Lauf gilt als abgebrochen
      const projectId = (await call('GET', '/projects')).json.find((x: any) => x.id !== other.id).id;
      await built.ctx.db.run("INSERT INTO triage_runs (id, project_id, scope, status, stats, started_by, started_at) VALUES ('trg_t', ?, 'all', 'running', '{}', 'u-admin', ?)", projectId, new Date().toISOString());
      const busy = await call('POST', '/triage/runs', { scope: 'all' }, 'u-redaktion');
      expect(busy.status).toBe(409);
      expect(busy.json.detail).toContain('läuft bereits');
      await built.ctx.db.run("UPDATE triage_runs SET started_at = ? WHERE id = 'trg_t'", new Date(Date.now() - 3 * 3600_000).toISOString());
      expect((await call('POST', '/triage/runs', { scope: 'all' }, 'u-redaktion')).json.status).toBe('finished');
      expect((await built.ctx.db.get("SELECT status FROM triage_runs WHERE id = 'trg_t'"))?.status).toBe('failed');
    } finally {
      await built.app.close();
    }
  });
});
