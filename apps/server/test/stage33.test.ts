import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { shapeChapters, type ExportChapter } from '../src/services/exports.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';
import { png } from './png.js';

function upload(built: any, url: string, name: string, data: Buffer, note?: string, user = 'u-redaktion') {
  const boundary = '----s33' + Math.random().toString(16).slice(2);
  const parts = [Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${name}"\r\nContent-Type: application/octet-stream\r\n\r\n`), data, Buffer.from('\r\n')];
  if (note) parts.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="note"\r\n\r\n${note}\r\n`));
  parts.push(Buffer.from(`--${boundary}--\r\n`));
  return built.app.inject({ method: 'POST', url: `/api/v1${url}`, payload: Buffer.concat(parts), headers: { 'content-type': `multipart/form-data; boundary=${boundary}`, 'x-user-id': user } });
}

const block = (text: string, extra: Record<string, unknown> = {}) => ({ kind: 'paragraph', text, roles: [], divisions: [], market: null, release: null, ...extra });

describe('Etappe 33', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));

  it('[T-248] Bildarchiv: feste Bildnummer, Merkmale, Prüfregeln; neue Fassung ersetzt das Bild überall, Original bleibt abrufbar (ETag/304); Platzhalter mit reservierter Nummer', async () => {
    const built = await build('bildarchiv');
    const call = client(built);
    try {
      const klein = png(320, 200);
      const z = new JSZip();
      z.file('1-anmeldung.md', `${FM}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldung öffnet oneSCM.\n\n## 1.2 Schritte\n\n1. Öffnen Sie die Anmeldemaske.\n\n![Anmeldemaske](bilder/maske.png)\n`);
      z.file('bilder/maske.png', klein);
      await importFile(built, 'anmeldung.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const { sha256 } = await import('../src/domain/similarity.js');
      const sha = sha256(klein);

      const list = (await call('GET', '/image-archive', undefined, 'u-leser')).json;
      expect(list.summary).toMatchObject({ images: 1, placeholders: 0 });
      const it0 = list.items[0];
      expect(it0).toMatchObject({ sha, imageNo: 'B-0001', currentSha: sha, width: 320, placeholder: false, sourceUses: 1 });
      expect(it0.checks.map((c: any) => c.rule).sort()).toEqual(['caption_missing', 'language_missing', 'low_resolution', 'scope_missing']);

      // Merkmale: nur Bearbeitung, Werte geprüft
      expect((await call('PATCH', `/image-archive/${sha}`, { language: 'de' }, 'u-leser')).status).toBe(403);
      expect((await call('PATCH', `/image-archive/${sha}`, { divisions: ['truck'] }, 'u-redaktion')).status).toBe(400);
      expect((await call('PATCH', `/image-archive/${sha}`, { language: 'deutsch' }, 'u-redaktion')).status).toBe(400);
      const meta = (await call('PATCH', `/image-archive/${sha}`, { title: 'Anmeldemaske von oneSCM', language: 'de', roles: ['dealer'], divisions: ['car', 'van'], markets: ['DE'], release: '2026.3' }, 'u-redaktion')).json;
      expect(meta).toMatchObject({ title: 'Anmeldemaske von oneSCM', language: 'de', roles: ['dealer'], divisions: ['car', 'van'], markets: ['DE'], release: '2026.3' });
      expect(meta.checks.map((c: any) => c.rule)).toEqual(['low_resolution']);

      // Neue Fassung ersetzt das Bild überall
      const gross = png(1280, 720, [10, 120, 200]);
      const up = await upload(built, `/image-archive/${sha}/versions`, 'maske-neu.png', gross, 'Release 2026.3');
      expect(up.statusCode).toBe(201);
      const v2 = up.json();
      expect(v2).toMatchObject({ imageNo: 'B-0001', currentSha: sha256(gross), width: 1280, checks: [] });
      expect(v2.versions.map((v: any) => [v.versionNo, v.note])).toEqual([[1, null], [2, 'Release 2026.3']]);
      expect((await upload(built, `/image-archive/${sha}/versions`, 'gleich.png', gross)).statusCode).toBe(409);
      expect((await upload(built, `/image-archive/${sha}/versions`, 'x.png', png(700, 400), undefined, 'u-leser')).statusCode).toBe(403);

      const cur = await built.app.inject({ method: 'GET', url: `/api/v1/media/${sha}`, headers: { 'x-user-id': 'u-leser' } });
      expect(Buffer.compare(cur.rawPayload, gross)).toBe(0);
      expect(cur.headers.etag).toBe(`"${sha256(gross)}"`);
      const cached = await built.app.inject({ method: 'GET', url: `/api/v1/media/${sha}`, headers: { 'x-user-id': 'u-leser', 'if-none-match': `"${sha256(gross)}"` } });
      expect(cached.statusCode).toBe(304);
      const stale = await built.app.inject({ method: 'GET', url: `/api/v1/media/${sha}`, headers: { 'x-user-id': 'u-leser', 'if-none-match': `"${sha}"` } });
      expect(stale.statusCode).toBe(200); // Browser mit alter Fassung bekommt die neue
      const orig = await built.app.inject({ method: 'GET', url: `/api/v1/media/${sha}?original=1`, headers: { 'x-user-id': 'u-leser' } });
      expect(Buffer.compare(orig.rawPayload, klein)).toBe(0);

      // Platzhalter: reserviert B-0002, im freigegebenen Kapitel ein Fehler
      expect((await call('POST', '/image-archive/placeholders', { title: 'x' }, 'u-redaktion')).status).toBe(400);
      const ph = await call('POST', '/image-archive/placeholders', { title: 'Vertragsliste mit Filter', divisions: ['car'] }, 'u-redaktion');
      expect(ph.status).toBe(201);
      expect(ph.json).toMatchObject({ imageNo: 'B-0002', placeholder: true, title: 'Vertragsliste mit Filter', divisions: ['car'], markdown: `![Vertragsliste mit Filter](media:${ph.json.sha})` });
      expect(ph.json.checks.map((c: any) => c.rule)).toContain('unused');
      const svg = (await call('GET', `/media/${ph.json.sha}`)).body;
      expect(svg).toContain('B-0002 · Platzhalter');

      const ch = (await call('GET', '/chapters')).json.find((c: any) => c.title === '1. Anmeldung');
      const v = (await call('POST', `/chapters/${ch.id}/generate`, {}, 'u-redaktion')).json;
      const created = await call('POST', `/chapter-versions/${v.id}/content-blocks`, { section: 'steps', text: `2. Wählen Sie den Vertrag.\n\n${ph.json.markdown}`, justification: 'Platzhalter bis zum Release' }, 'u-redaktion');
      expect(created.status).toBe(201);
      let p = (await call('GET', '/image-archive?q=B-0002')).json;
      expect(p.items).toHaveLength(1);
      expect(p.items[0].checks.map((c: any) => c.rule)).toContain('placeholder_used');

      const cov = (await call('GET', '/image-archive/coverage', undefined, 'u-leser')).json;
      const row = cov.items.find((i: any) => i.chapterId === ch.id);
      expect(row).toMatchObject({ images: 2, placeholders: 1, missingAlt: 0 });
      expect(row.stepBlocks).toBeGreaterThanOrEqual(1);
      expect(row.coverage).toBeGreaterThan(0);
      expect(cov.summary.withPlaceholders).toBe(1);

      // echte Fassung hochladen → kein Platzhalter mehr
      const echt = await upload(built, `/image-archive/${ph.json.sha}/versions`, 'vertragsliste.png', png(1200, 700, [0, 90, 0]));
      expect(echt.statusCode).toBe(201);
      expect(echt.json()).toMatchObject({ imageNo: 'B-0002', placeholder: false });
      p = (await call('GET', '/image-archive')).json;
      expect(p.summary).toMatchObject({ images: 2, placeholders: 0, versioned: 2 });
    } finally {
      await built.app.close();
    }
  });

  it('[T-249] Ausgabeprofile Quick Guide und One Pager, Lesefassung ohne Badges, Versionszeile und Quellenstatus (Einheit)', () => {
    const chapters = [{
      chapterId: 'c1', title: 'Vertrag anlegen', versionNo: 3, approvedAt: '2026-10-01T00:00:00Z',
      sections: [
        { code: 'purpose', title: 'Zweck', blocks: [block('Sie legen einen Vertrag an. Der Vertrag gilt ab Unterschrift. Er endet automatisch.')] },
        { code: 'prerequisites', title: 'Voraussetzungen', blocks: [block('Sie haben die Rolle Dealer.')] },
        { code: 'steps', title: 'Schrittweise Durchführung', blocks: [block('1. Öffnen Sie **Verträge**.', { roles: ['dealer'], divisions: ['car'] })] },
        { code: 'result', title: 'Ergebnis und Systemstatus', blocks: [block('Der Vertrag ist angelegt.')] },
        { code: 'hints', title: 'Hinweise, Tipps und Warnungen', blocks: [block('ACHTUNG Datenverlust', { kind: 'warning' }), block('Tipp', { kind: 'tip' })] },
        { code: 'status', title: 'Quellen- und Freigabestatus', blocks: [block('Quelle: handbuch.md, Zeile 4')] },
      ],
    }, { chapterId: 'c2', title: 'Glossar', versionNo: 1, approvedAt: null, sections: [{ code: 'purpose', title: 'Zweck', blocks: [block('Begriffe.')] }] }] as unknown as ExportChapter[];

    const qg = shapeChapters(chapters, {}, { profile: 'quickguide' });
    expect(qg.map((c) => c.title)).toEqual(['Vertrag anlegen']); // Kapitel ohne Schritte entfallen
    expect(qg[0].sections.map((s) => s.title)).toEqual(['Voraussetzungen', 'Schrittweise Durchführung', 'Ergebnis und Systemstatus', 'Wichtige Hinweise']);
    expect(qg[0].sections[3].blocks.map((b: any) => b.kind)).toEqual(['warning']);

    const op = shapeChapters(chapters, {}, { profile: 'onepager' });
    expect(op[0].sections.map((s) => s.code)).toEqual(['purpose', 'steps', 'hints']);
    expect(op[0].sections[0].blocks[0].text).toBe('Sie legen einen Vertrag an. Der Vertrag gilt ab Unterschrift.');

    const read = shapeChapters(chapters, {}, { reading: true });
    expect(read[0].sections.map((s) => s.code)).not.toContain('status');
    expect(read[0].sections.find((s) => s.code === 'steps')!.blocks[0]).toMatchObject({ roles: [], divisions: [] });
    expect((read[0] as any).hideVersion).toBe(true);

    // Übergang nur im vollständigen Handbuch, am Ende des letzten Abschnitts
    const next = new Map([['c1', { title: 'Glossar', text: 'Dort finden Sie alle Begriffe.' }]]);
    const full = shapeChapters(chapters, {}, { next });
    const last = full[0].sections[full[0].sections.length - 1];
    expect(last.blocks[last.blocks.length - 1]).toMatchObject({ kind: 'xref', text: 'Weiter mit „Glossar“ – Dort finden Sie alle Begriffe.' });
    expect(JSON.stringify(shapeChapters(chapters, {}, { profile: 'quickguide', next }))).not.toContain('Weiter mit');
  });

  it('[T-250] „Weiter zu Kapitel …“: Übergang pflegen, Standard = nächstes Kapitel, im Export; Profile und Lesefassung im Export', async () => {
    const built = await build('uebergang');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${FM}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldung öffnet oneSCM. Sie gilt für alle Rollen.\n\n## 1.2 Schritte\n\n1. Öffnen Sie oneSCM.\n`);
      await importFile(built, 'b.md', `${FM}# 2. Verträge\n\n## 2.1 Zweck\n\nVerträge verwalten Sie im Contract Management.\n\n## 2.2 Schritte\n\n1. Öffnen Sie **Contract Management**.\n`);
      const chs = (await call('GET', '/chapters')).json;
      const a = chs.find((c: any) => c.title === '1. Anmeldung');
      const b = chs.find((c: any) => c.title === '2. Verträge');
      await approveChapter(call, a.id);
      await approveChapter(call, b.id);

      const def = (await call('GET', `/chapter-transitions/${a.id}`, undefined, 'u-leser')).json;
      expect(def).toMatchObject({ explicit: false, text: null, next: { chapterId: b.id, title: '2. Verträge' } });
      expect((await call('PUT', `/chapter-transitions/${a.id}`, { text: 'x' }, 'u-leser')).status).toBe(403);
      expect((await call('PUT', `/chapter-transitions/${a.id}`, { nextChapterId: a.id }, 'u-redaktion')).status).toBe(400);
      expect((await call('PUT', `/chapter-transitions/${a.id}`, { nextChapterId: 'ch-gibtsnicht' }, 'u-redaktion')).status).toBe(400);
      const set = (await call('PUT', `/chapter-transitions/${a.id}`, { text: '  Nach der Anmeldung   legen Sie Verträge an. ' }, 'u-redaktion')).json;
      expect(set).toMatchObject({ explicit: true, text: 'Nach der Anmeldung legen Sie Verträge an.', next: { chapterId: b.id } });
      expect((await call('GET', '/chapter-transitions')).json).toHaveLength(1);

      const exp = async (body: any) => {
        const e = (await call('POST', '/exports', { chapterIds: [a.id, b.id], format: 'md', ...body })).json;
        return { e, md: (await call('GET', `/exports/${e.id}/download`)).body as string };
      };
      const full = await exp({});
      expect(full.md).toContain('↗️ Weiter mit „2. Verträge“ – Nach der Anmeldung legen Sie Verträge an.');
      expect(full.md).toContain('Freigegebene Version 1');
      expect((await exp({ transitions: false })).md).not.toContain('Weiter mit');

      const qg = await exp({ profile: 'quickguide', reading: true });
      expect(qg.e.fileName).toMatch(/^onescm-handbuch-quickguide-lesefassung-\d{4}-\d{2}-\d{2}\.md$/);
      expect(qg.md).toMatch(/^# oneSCM Benutzerhandbuch – Quick Guide/);
      expect(qg.md).not.toContain('Weiter mit');
      expect(qg.md).not.toContain('Freigegebene Version');
      expect(qg.md).not.toContain('### Zweck');
      expect((await call('POST', '/exports', { chapterIds: [a.id], profile: 'poster' })).status).toBe(400);
      for (const format of ['html', 'pdf', 'docx']) expect((await call('POST', '/exports', { chapterIds: [a.id, b.id], format, profile: 'onepager', reading: true })).status).toBe(201);

      // Übergang entfernen → wieder Standard; Standard-Export ohne gepflegten Eintrag ohne Übergang, mit transitions: true automatisch
      expect((await call('DELETE', `/chapter-transitions/${a.id}`, undefined, 'u-redaktion')).json).toMatchObject({ explicit: false });
      expect((await exp({})).md).not.toContain('Weiter mit');
      expect((await exp({ transitions: true })).md).toContain('↗️ Weiter mit „2. Verträge“');
    } finally {
      await built.app.close();
    }
  });
});
