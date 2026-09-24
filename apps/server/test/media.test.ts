import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { deflateSync } from 'node:zlib';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { imagesWithoutAlt, imageRefs, preserveImages, resolveRelative, rewriteImages, sniffImage } from '../src/domain/media.js';
import { markdownToHtml, markdownToPdf } from '../src/services/render.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const CRC = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (b: Buffer) => {
  let c = 0xffffffff;
  for (const x of b) c = CRC[(c ^ x) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
/** Gültiges PNG (RGB) in der gewünschten Größe und Farbe */
export function png(w: number, h: number, rgb: [number, number, number] = [29, 99, 216]) {
  const chunk = (type: string, data: Buffer) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'latin1'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(td));
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array.from({ length: w }, () => rgb).flat())]);
  const raw = Buffer.concat(Array.from({ length: h }, () => row));
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

/** Word-Datei mit eingebettetem Bild (Alternativtext im docPr/descr) */
async function docxWithImage(image: Buffer, alt: string) {
  const z = new JSZip();
  z.file('[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  z.file('_rels/.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  z.file('word/_rels/document.xml.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.png"/></Relationships>');
  z.file('word/media/image1.png', image);
  const drawing = `<w:drawing><wp:inline><wp:extent cx="952500" cy="952500"/><wp:docPr id="1" name="Bild 1" descr="${alt}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="image1.png"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId5"/></pic:blipFill><pic:spPr/></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing>`;
  z.file('word/document.xml', `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>
<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>7. Berichte</w:t></w:r></w:p>
<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:t>7.1 Zweck</w:t></w:r></w:p>
<w:p><w:r><w:t>Die Berichtsübersicht zeigt alle Auswertungen.</w:t></w:r></w:p>
<w:p><w:r>${drawing}</w:r></w:p></w:body></w:document>`);
  return z.generateAsync({ type: 'nodebuffer' });
}

describe('Bilder & Medien (ADR-029)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string, extra: Record<string, unknown> = {}) =>
    freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', integrations: { allowInsecure: true }, ...extra }));

  it('[T-157] Formaterkennung, Verweise, Umschreiben relativer Pfade (Einheit)', () => {
    expect(sniffImage(png(40, 20))).toEqual({ mime: 'image/png', width: 40, height: 20 });
    expect(sniffImage(Buffer.from('GIF89a\x0a\x00\x05\x00', 'latin1'))).toEqual({ mime: 'image/gif', width: 10, height: 5 });
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xc0, 0x00, 0x11, 0x08, 0x00, 0x30, 0x00, 0x50, 0x03, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(sniffImage(jpeg)).toEqual({ mime: 'image/jpeg', width: 80, height: 48 });
    expect(sniffImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>'))).toBeNull(); // kein SVG
    expect(sniffImage(Buffer.from([0x89, 0x50]))).toBeNull();

    expect(resolveRelative('kap/1.md', 'bilder/a%20b.png')).toBe('kap/bilder/a b.png');
    expect(resolveRelative('kap/1.md', '../bilder/a.png')).toBe('bilder/a.png');
    expect(resolveRelative('1.md', '../../etc/passwd')).toBeNull();

    const md = '# T\n\n![Maske](bilder/a.png) und ![](fehlt.png)\n\n```\n![Code](bilder/a.png)\n```\n\n![Extern](https://example.org/x.png)';
    const res = rewriteImages(md, (t) => (t === 'bilder/a.png' ? 'a'.repeat(64) : null));
    expect(res.changed).toBe(true);
    expect(res.missing).toEqual(['fehlt.png']);
    expect(res.markdown).toContain(`![Maske](media:${'a'.repeat(64)})`);
    expect(res.markdown).toContain('```\n![Code](bilder/a.png)\n```'); // Codeblöcke unverändert
    expect(res.markdown.split('\n').length).toBe(md.split('\n').length); // Zeilennummern (Nachweise) bleiben gültig
    expect(imageRefs(res.markdown).map((r) => r.sha)).toEqual(['a'.repeat(64), null, null]);
    expect(imagesWithoutAlt(res.markdown)).toHaveLength(1);
    expect(imagesWithoutAlt('![Alt \\[mit\\] Klammern](media:x)')).toHaveLength(0);

    // Darstellung: nur eigene Medien, externe Bilder nur als Alternativtext, Alternativtext escaped
    const sha = 'b'.repeat(64);
    const html = markdownToHtml(`![Maske "<x>"](media:${sha}) ![Fremd](https://evil.example/x.png)`, (s) => (s === sha ? 'bilder/b.png' : null));
    expect(html).toContain('<img src="bilder/b.png" alt="Maske &quot;&lt;x&gt;&quot;" loading="lazy">');
    expect(html).not.toContain('evil.example');
    expect(markdownToHtml(`![Maske](media:${sha})`)).not.toContain('<img');
    const pdf = markdownToPdf(`Vorher ![Maske](media:${sha}) nachher`, new Map([[sha, { mime: 'image/png', data: png(800, 100), width: 800, height: 100 }]]));
    expect(pdf).toHaveLength(3);
    expect(pdf[1]).toMatchObject({ image: expect.stringMatching(/^data:image\/png;base64,/), width: 499 });
    // Maschinelle Übersetzung verliert kein Bild
    expect(preserveImages(`Text ![Maske](media:${sha})`, 'Text')).toBe(`Text\n\n![Maske](media:${sha})`);
    expect(preserveImages(`Text ![Maske](media:${sha})`, `Texte ![Masque](media:${sha})`)).toBe(`Texte ![Masque](media:${sha})`);
  });

  it('[T-158] ZIP-Import mit Bildern: Ablage je Projekt, Verweise umgeschrieben, Auslieferung geschützt, Hochladen', async () => {
    const built = await build('zip');
    const call = client(built);
    try {
      const maske = png(64, 32);
      const z = new JSZip();
      z.file('handbuch/1-anmeldung.md', `${FM}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldemaske öffnet oneSCM.\n\n![Anmeldemaske mit Kennung und Passwort](../bilder/maske.png)\n\n![Fehlt](bilder/weg.png)\n`);
      z.file('bilder/maske.png', maske);
      z.file('bilder/kaputt.png', Buffer.from([0x89, 0x50, 0x4e]));
      const imp = await importFile(built, 'handbuch.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const done = (await call('GET', `/imports/${imp.id}`)).json;
      expect(done.status).toBe('completed');
      expect(done.stats).toMatchObject({ media: 1, imported: 1, skipped: 1, failed: 0 });
      const byPath = Object.fromEntries(done.items.map((i: any) => [i.path, i]));
      expect(byPath['bilder/maske.png']).toMatchObject({ status: 'media', message: 'Bild image/png, 64×32' });
      expect(byPath['bilder/kaputt.png'].status).toBe('skipped');
      expect(byPath['handbuch/1-anmeldung.md'].message).toContain('Bild nicht gefunden: bilder/weg.png');

      const { sha256 } = await import('../src/domain/similarity.js');
      const sha = sha256(maske);
      const rev = (await call('GET', '/sources')).json.find((s: any) => s.path === 'handbuch/1-anmeldung.md').revisions[0];
      const raw = (await call('GET', `/source-revisions/${rev.id}/raw`)).body;
      expect(raw).toContain(`![Anmeldemaske mit Kennung und Passwort](media:${sha})`);
      expect(raw).toContain('![Fehlt](bilder/weg.png)'); // nicht auflösbar → unverändert, Warnung

      const list = (await call('GET', '/media', undefined, 'u-leser')).json;
      expect(list).toEqual([expect.objectContaining({ sha256: sha, mime: 'image/png', width: 64, height: 32, originalName: 'maske.png', importId: imp.id })]);
      const got = await call('GET', `/media/${sha}`, undefined, 'u-leser');
      expect(got.status).toBe(200);
      expect(got.headers['content-type']).toBe('image/png');
      expect(got.headers['x-content-type-options']).toBe('nosniff');
      expect(got.headers['cache-control']).toContain('immutable');
      expect(Buffer.compare(got.raw, maske)).toBe(0);
      expect((await call('GET', '/media/nicht-hex')).status).toBe(404);
      // Projekttrennung: dasselbe Bild ist in einem anderen Projekt nicht abrufbar
      const other = (await call('POST', '/projects', { key: 'ANDERS', name: 'Anderes Projekt' })).json;
      expect((await call('GET', `/media/${sha}`, undefined, 'u-admin', other.id)).status).toBe(404);
      expect((await call('GET', `/media/${sha}`)).status).toBe(200);

      // Hochladen (Werkstatt): Bearbeitungsrecht, nur Rasterbilder
      const upload = async (name: string, data: Buffer, user = 'u-redaktion') => {
        const boundary = '----m' + Math.random().toString(16).slice(2);
        const payload = Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${name}"\r\nContent-Type: application/octet-stream\r\n\r\n`), data, Buffer.from(`\r\n--${boundary}--\r\n`)]);
        const res = await built.app.inject({ method: 'POST', url: '/api/v1/media', payload, headers: { 'content-type': `multipart/form-data; boundary=${boundary}`, 'x-user-id': user } });
        return { status: res.statusCode, json: res.json() };
      };
      expect((await upload('x.png', png(2, 2), 'u-leser')).status).toBe(403);
      expect((await upload('x.svg', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'))).status).toBe(400);
      const up = await upload('neu.png', png(3, 3, [200, 0, 0]));
      expect(up.status).toBe(201);
      expect(up.json).toMatchObject({ mime: 'image/png', width: 3, height: 3, markdown: `![Alternativtext](media:${up.json.sha256})` });
    } finally {
      await built.app.close();
    }
  });

  it('[T-159] Alternativtext ist Pflicht (Gate image_alt); Bilder in HTML-, Markdown-, PDF-Export, Online-Hilfe und Backup', async () => {
    const built = await build('export');
    const call = client(built);
    try {
      const bild = png(120, 60);
      const z = new JSZip();
      z.file('2-auftraege.md', `${FM}# 2. Aufträge\n\n## 2.1 Zweck\n\nAufträge legen Sie im Menü Verkauf an.\n\n![](bilder/liste.png)\n`);
      z.file('bilder/liste.png', bild);
      await importFile(built, 'auftraege.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const { sha256 } = await import('../src/domain/similarity.js');
      const sha = sha256(bild);
      const ch = (await call('GET', '/chapters')).json.find((c: any) => c.title === '2. Aufträge');
      const v = (await call('POST', `/chapters/${ch.id}/generate`, {}, 'u-redaktion')).json;
      for (const b of v.sections.flatMap((s: any) => s.blocks)) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
      const gate = (await call('GET', `/chapter-versions/${v.id}/gate`)).json;
      const alt = gate.checks.find((c: any) => c.code === 'image_alt');
      expect(alt).toMatchObject({ passed: false, details: [expect.stringContaining('1 Bild ohne Alternativtext')] });
      expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(409);
      // Alternativtext ergänzen → Gate besteht
      const imgBlock = v.sections.flatMap((s: any) => s.blocks).find((b: any) => b.text.includes('media:'));
      expect(imgBlock.text).toBe(`![](media:${sha})`);
      const patched = await call('PATCH', `/content-blocks/${imgBlock.id}`, { text: `![Auftragsliste im Menü Verkauf](media:${sha})`, expectedVersionNo: imgBlock.versionNo }, 'u-redaktion');
      expect(patched.status).toBe(200);
      expect((await call('GET', `/chapter-versions/${v.id}/gate`)).json.checks.find((c: any) => c.code === 'image_alt').passed).toBe(true);
      await call('PATCH', `/content-blocks/${imgBlock.id}`, { justification: 'Bildschirmfoto aus der Quelle' }, 'u-redaktion');
      expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);

      const exp = async (format: string) => {
        const e = (await call('POST', '/exports', { chapterIds: [ch.id], format })).json;
        return (await call('GET', `/exports/${e.id}/download`));
      };
      const html = (await exp('html')).body;
      expect(html).toContain(`<img src="data:image/png;base64,${bild.toString('base64')}" alt="Auftragsliste im Menü Verkauf"`);
      expect(html).toContain("img-src data:");
      const md = (await exp('md')).body;
      expect(md).toContain(`![Auftragsliste im Menü Verkauf](data:image/png;base64,${bild.toString('base64')})`);
      const pdf = (await exp('pdf')).raw.toString('latin1');
      expect(pdf).toMatch(/\/Subtype\s*\/Image/);

      // Online-Hilfe: Bild als Datei unter bilder/, eigene CSP erlaubt nur eigene Bilder
      const rel = (await call('POST', '/releases', { version: '2026.3' }, 'u-freigabe')).json;
      const site = await built.app.inject({ method: 'GET', url: `/api/v1/releases/${rel.id}/download?format=site`, headers: { 'x-user-id': 'u-leser' } });
      const zip = await JSZip.loadAsync(site.rawPayload);
      expect(Object.keys(zip.files)).toContain(`bilder/${sha}.png`);
      expect(Buffer.compare(await zip.file(`bilder/${sha}.png`)!.async('nodebuffer'), bild)).toBe(0);
      const k1 = await zip.file('kapitel-01.html')!.async('string');
      expect(k1).toContain(`<img src="bilder/${sha}.png" alt="Auftragsliste im Menü Verkauf" loading="lazy">`);
      expect(k1).toContain("img-src 'self' data:");
      expect((await call('GET', `/releases/${rel.id}/download?format=md`)).body).toContain('](data:image/png;base64,');

      const { createBackup } = await import('../src/services/backup.js');
      const { data, manifest } = await createBackup(built.ctx.db, built.ctx.store, '0.10.0');
      expect(manifest.missingObjects).toEqual([]);
      expect(manifest.tables.media_assets).toBe(1);
      expect(Object.keys((await JSZip.loadAsync(data)).files)).toContain(`objects/media/${sha}`);
    } finally {
      await built.app.close();
    }
  });

  it('[T-160] Bilder aus Word, eingebettetem HTML und Confluence-Anhängen', async () => {
    const bild = png(16, 16, [0, 150, 0]);
    const anhang = png(24, 12, [150, 0, 0]);
    const conf = await new Promise<{ url: string; close: () => Promise<void> }>((resolve) => {
      const s = http.createServer((req, res) => {
        const u = new URL(req.url!, 'http://x');
        if (u.pathname === '/wiki/rest/api/content') {
          return void res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ results: [
            { id: '301', title: '8. Lager', version: { number: 1 }, body: { storage: { value: '<h1>Zweck</h1><p>Das Lager zeigt Bestände.</p><p><ac:image ac:alt="Lagerübersicht"><ri:attachment ri:filename="lager.png" /></ac:image></p><p><ac:image><ri:url ri:value="https://evil.example/x.png" /></ac:image></p>' } } },
          ] }));
        }
        if (u.pathname === '/wiki/rest/api/content/301/child/attachment') {
          return void res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({ results: [
            { title: 'lager.png', version: { number: 2 }, extensions: { fileSize: anhang.length }, _links: { download: '/download/attachments/301/lager.png?version=2' } },
          ] }));
        }
        if (u.pathname === '/wiki/download/attachments/301/lager.png') return void res.writeHead(200, { 'content-type': 'image/png' }).end(anhang);
        res.writeHead(404).end();
      });
      s.listen(0, '127.0.0.1', () => resolve({ url: `http://127.0.0.1:${(s.address() as AddressInfo).port}`, close: () => new Promise<void>((r) => s.close(() => r())) }));
    });
    const built = await build('sources');
    const call = client(built);
    const { sha256 } = await import('../src/domain/similarity.js');
    const rawOf = async (p: string) => {
      const rev = (await call('GET', '/sources')).json.find((s: any) => s.path === p).revisions[0];
      return (await call('GET', `/source-revisions/${rev.id}/raw`)).body as string;
    };
    try {
      // Word: eingebettetes Bild mit Alternativtext
      await importFile(built, '7-berichte.docx', await docxWithImage(bild, 'Berichtsübersicht'));
      expect(await rawOf('7-berichte.docx')).toContain(`![Berichtsübersicht](media:${sha256(bild)})`);
      // HTML mit data:-URI und nicht unterstütztem SVG
      const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>').toString('base64');
      await importFile(built, '9-hilfe.html', `<html><head><title>9. Hilfe</title></head><body><p>Die Hilfe öffnen Sie über F1.</p><img src="data:image/png;base64,${bild.toString('base64')}" alt="Hilfefenster"><img src="data:image/svg+xml;base64,${svg}" alt="Symbol"></body></html>`);
      const h = await rawOf('9-hilfe.html');
      expect(h).toContain(`![Hilfefenster](media:${sha256(bild)})`);
      expect(h).toContain('[Bild: Symbol]');
      expect(h).not.toContain('base64');

      // Confluence Cloud: Bildanhänge werden geladen; externe Bild-URLs nicht
      const conn = (await call('POST', '/source-connections', { kind: 'confluence', name: 'Lager', url: `${conf.url}/wiki`, spaceKey: 'LG' })).json;
      await built.ctx.jobs.idle();
      const c = (await call('GET', `/source-connections/${conn.id}`)).json;
      expect(c).toMatchObject({ status: 'idle', lastError: null });
      const imp = (await call('GET', `/imports/${c.lastImportId}`)).json;
      expect(Object.fromEntries(imp.items.map((i: any) => [i.path, i.status]))).toEqual({ 'LG/8-lager-301.html': 'imported', 'LG/attachments/301/lager.png': 'media' });
      const lager = await rawOf('LG/8-lager-301.html');
      expect(lager).toContain(`![Lagerübersicht](media:${sha256(anhang)})`);
      expect(lager).not.toContain('evil.example');
      expect((await call('GET', '/media')).json.map((m: any) => m.sha256).sort()).toEqual([sha256(anhang), sha256(bild)].sort());
    } finally {
      await built.app.close();
      await conf.close();
    }
  });

  it('[T-161] Absätze mit Bildern werden nicht KI-umformuliert', async () => {
    const built = await build('rewrite', { llm: { provider: 'demo', model: 'demo-extractive' } });
    const call = client(built);
    try {
      const z = new JSZip();
      z.file('3.md', `${FM}# 3. Lieferungen\n\n## 3.1 Zweck\n\nLieferungen sehen Sie in der Übersicht.\n\n![Lieferübersicht](b.png)\n`);
      z.file('b.png', png(4, 4));
      await importFile(built, 'l.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const ch = (await call('GET', '/chapters')).json.find((x: any) => x.title === '3. Lieferungen');
      const draft = (await call('POST', `/chapters/${ch.id}/generate`, {}, 'u-redaktion')).json;
      const img = draft.sections.flatMap((s: any) => s.blocks).find((b: any) => b.text.includes('media:'));
      const res = await call('POST', `/content-blocks/${img.id}/rewrite-proposals`, {}, 'u-redaktion');
      expect(res.status).toBe(422);
      expect(res.json.detail).toContain('Bildern');
    } finally {
      await built.app.close();
    }
  });
});
