import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { matchNodes } from '../src/domain/outline.js';
import JSZip from 'jszip';
import { approveChapter, client, importFile } from './api-helpers.js';
import { png } from './png.js';
import { contrastToWhite, styleIds } from '../src/services/layout.js';
import { freshDatabase, tempDir } from './helpers.js';

type Built = Awaited<ReturnType<typeof buildApp>>;
async function upload(built: Built, url: string, name: string, content: string | Buffer, user = 'u-admin') {
  const boundary = '----onescm' + Math.random().toString(16).slice(2);
  const payload = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${name}"\r\nContent-Type: application/octet-stream\r\n\r\n`),
    Buffer.isBuffer(content) ? content : Buffer.from(content), Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);
  const res = await built.app.inject({ method: 'POST', url: `/api/v1${url}`, payload, headers: { 'content-type': `multipart/form-data; boundary=${boundary}`, 'x-user-id': user } });
  return { status: res.statusCode, json: res.json() };
}

const fm = (extra = '') => `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n${extra}---\n`;

describe('Etappe 13', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' }));

  it('[T-173] Varianten synchronisieren: Vergleich Blueprint → Markt-Variante, Schnipsel und fehlende Einträge übernehmen, Variantenprüfung', async () => {
    // Einheit: Zuordnung über Titel (Nummern egal, Unterkapitel nur unter zugeordnetem Kapitel, mehrdeutig → keine) bzw. Kennung
    const n = (id: string, title: string, parentId: string | null = null, nodeKey = id) => ({ id, title, parentId, level: parentId ? 2 : 1, nodeKey });
    const m = matchNodes([n('a', '1. Anmeldung'), n('a1', 'Zweck', 'a'), n('b', 'Hilfe'), n('b2', 'Hilfe')], [n('x', 'anmeldung'), n('x1', '1.1 Zweck', 'x'), n('y', 'Hilfe')], false);
    expect([...m]).toEqual([['a', 'x'], ['a1', 'x1']]);
    expect([...matchNodes([n('a', 'A', null, 'k1')], [n('z', 'B', null, 'k1')], true)]).toEqual([['a', 'z']]);

    const built = await build('sync');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${fm()}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldung öffnet oneSCM.\n\n## 1.2 Schritte\n\nBenutzername und Passwort eingeben.\n\n# 2. Aufträge\n\nAufträge werden im DMS angelegt.\n`);
      await importFile(built, 'fr.md', `${fm('market: FR\n')}# 1. Anmeldung\n\n## 1.1 Zweck\n\nIn Frankreich gilt die lokale Anmeldung.\n`);
      await importFile(built, 'it.md', `${fm('market: IT\n')}# 1. Anmeldung\n\n## 1.1 Zweck\n\nIn Italien gilt die SPID-Anmeldung.\n`);
      const blueprint = (await call('POST', '/outlines', { name: 'Blueprint', content: '# Anmeldung\n## Zweck\n## Schritte\n# Aufträge\n', format: 'markdown' })).json;
      await call('POST', `/outlines/${blueprint.id}/auto-assign`, {});
      const fr = (await call('POST', '/outlines', { name: 'Markt FR', marketScope: 'markets', markets: ['FR'], content: '# 1. Anmeldung\n## 1.1 Zweck\n# 2. Lokales\n', format: 'markdown' })).json;
      const frZweck = fr.nodes.find((x: any) => x.title === 'Zweck');
      const frSnippet = (await call('GET', `/outlines/${fr.id}/candidates?q=Frankreich`)).json.items[0];
      await call('POST', `/outlines/${fr.id}/assignments`, { nodeId: frZweck.id, snippetIds: [frSnippet.id] });

      expect((await call('GET', `/outlines/${fr.id}/sync`)).status).toBe(400);
      expect((await call('GET', `/outlines/${fr.id}/sync?from=${fr.id}`)).status).toBe(400);
      const pv = (await call('GET', `/outlines/${fr.id}/sync?from=${blueprint.id}`, undefined, 'u-leser')).json;
      const entry = (t: string) => pv.entries.find((e: any) => e.title === t);
      expect(entry('Zweck').target).toMatchObject({ number: '1.1', title: 'Zweck' });
      // Zweck: allgemein (passt), IT (passt nicht zur FR-Variante); FR ist schon zugeordnet → gemeinsam
      expect(entry('Zweck').onlySource.map((x: any) => [x.text, x.fits])).toEqual([['Die Anmeldung öffnet oneSCM.', true], ['In Italien gilt die SPID-Anmeldung.', false]]);
      expect(entry('Zweck').onlySource[1].problems).toEqual(['Markt IT gehört nicht zur Variante']);
      expect(entry('Zweck').common).toBe(1);
      expect(entry('Schritte').target).toBeNull();
      expect(entry('Aufträge').target).toBeNull();
      expect(pv.summary).toMatchObject({ matched: 2, missing: 2, offered: 4, fitting: 3 });

      // Übernehmen: passende Schnipsel in Zweck, Unterkapitel „Schritte“ und Kapitel „Aufträge“ neu
      expect((await call('POST', `/outlines/${fr.id}/sync`, { from: blueprint.id, add: [{ sourceNodeId: entry('Zweck').sourceNodeId, snippetIds: [entry('Zweck').onlySource[0].id] }] }, 'u-leser')).status).toBe(403);
      expect((await call('POST', `/outlines/${fr.id}/sync`, { from: blueprint.id, add: [{ sourceNodeId: entry('Zweck').sourceNodeId, snippetIds: ['sn_fremd'] }] })).status).toBe(400);
      expect((await call('POST', `/outlines/${fr.id}/sync`, { from: blueprint.id, add: [{ sourceNodeId: entry('Schritte').sourceNodeId }] })).status).toBe(400);
      expect((await call('POST', `/outlines/${fr.id}/sync`, { from: blueprint.id })).status).toBe(400);
      const res = (await call('POST', `/outlines/${fr.id}/sync`, {
        from: blueprint.id,
        add: [{ sourceNodeId: entry('Zweck').sourceNodeId, snippetIds: [entry('Zweck').onlySource[0].id] }],
        create: [{ sourceNodeId: entry('Schritte').sourceNodeId }, { sourceNodeId: entry('Aufträge').sourceNodeId }],
      }, 'u-redaktion')).json;
      expect(res).toMatchObject({ added: 3, created: 2 });
      expect(res.preview.summary).toMatchObject({ matched: 4, missing: 0, offered: 1, fitting: 0 });
      const after = (await call('GET', `/outlines/${fr.id}`)).json;
      expect(after.nodes.map((x: any) => `${x.number} ${x.title}`)).toEqual(['1 Anmeldung', '1.1 Zweck', '1.2 Schritte', '2 Lokales', '3 Aufträge']);
      const draft = (await call('GET', `/outlines/${fr.id}/draft`)).json;
      expect(draft.nodes.find((x: any) => x.title === 'Zweck').snippets.map((s: any) => s.text)).toEqual(['In Frankreich gilt die lokale Anmeldung.', 'Die Anmeldung öffnet oneSCM.']);
      expect(draft.nodes.find((x: any) => x.title === 'Lokales').flags).toEqual([{ type: 'gap', label: 'keine Textschnipsel zugeordnet' }]);
      // Unterkapitel ohne Kapitel im Ziel wird abgewiesen
      const empty = (await call('POST', '/outlines', { name: 'Leer', nodes: [{ title: 'Anderes' }] })).json;
      expect((await call('POST', `/outlines/${empty.id}/sync`, { from: blueprint.id, create: [{ sourceNodeId: entry('Schritte').sourceNodeId }] })).status).toBe(400);
      expect((await built.ctx.db.get("SELECT details FROM audit_events WHERE action = 'outline.synced'"))!.details).toContain('"created":2');
    } finally {
      await built.app.close();
    }
  });

  it('[T-174] Firmen-Layout (Titelseite, Logo, Hausfarbe, Kopf-/Fußzeile) für PDF, HTML, Online-Hilfe; Word-Export mit Formatvorlagen und Firmenvorlage', async () => {
    expect(contrastToWhite('#1d63d8')).toBeGreaterThan(4.5);
    expect(contrastToWhite('#ffcc00')).toBeLessThan(4.5);
    expect(styleIds('<w:styles><w:style w:type="paragraph" w:styleId="berschrift1"><w:name w:val="heading 1"/></w:style><w:style w:type="paragraph" w:styleId="Titel"><w:name w:val="Title"/></w:style></w:styles>'))
      .toEqual({ title: 'Titel', heading1: 'berschrift1', heading2: null, heading3: null });

    const built = await build('layout');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${fm()}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie **Anmeldung** öffnet oneSCM.\n\n- Schritt eins\n- Schritt zwei\n\n| Feld | Wert |\n| --- | --- |\n| Name | Pflicht |\n\n![Anmeldemaske](bild.png)\n`);
      const chapter = (await call('GET', '/chapters')).json.find((c: any) => c.title === '1. Anmeldung');
      await approveChapter(call, chapter.id);

      expect((await call('GET', '/layout', undefined, 'u-leser')).json).toMatchObject({ primaryColor: '#1d63d8', cover: false, docxTemplate: null });
      expect((await call('PUT', '/layout', { companyName: 'X' }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/layout', { primaryColor: '#ffcc00' })).status).toBe(400);
      expect((await call('PUT', '/layout', { primaryColor: 'blau' })).status).toBe(400);
      expect((await call('PUT', '/layout', { logoSha: 'f'.repeat(64) })).status).toBe(400);
      const logo = (await upload(built, '/media', 'logo.png', png(60, 20, [11, 83, 148]))).json;
      const svgLogo = (await upload(built, '/media', 'logo.svg', '<svg width="10" height="10"/>')).json;
      expect((await call('PUT', '/layout', { logoSha: svgLogo.sha256 })).status).toBe(400);
      const layout = (await call('PUT', '/layout', {
        companyName: 'Muster AG', primaryColor: '#0B5394', logoSha: logo.sha256, cover: true, coverSubtitle: 'Händlerhandbuch', headerText: 'Muster AG · intern', footerText: 'Nur für den internen Gebrauch', confidentiality: 'VERTRAULICH',
      })).json;
      expect(layout).toMatchObject({ primaryColor: '#0b5394', cover: true, logoSha: logo.sha256 });

      // HTML: Titelseite, Hausfarbe, Kopf-/Fußzeile
      const html = (await call('GET', `/exports/${(await call('POST', '/exports', { format: 'html' })).json.id}/download`)).body;
      expect(html).toContain('class="cover"');
      expect(html).toContain('Muster AG');
      expect(html).toContain('#0b5394');
      expect(html).toContain('VERTRAULICH');
      expect(html).toContain('Nur für den internen Gebrauch');
      // PDF mit Titelseite
      const pdf = await call('POST', '/exports', { format: 'pdf' });
      expect(pdf.status).toBe(201);

      // Word ohne Vorlage: Titel, Inhaltsverzeichnisfeld, Überschriften, Liste, Tabelle, Kopf-/Fußzeile mit Seitenzahl, Logo
      const docx = await call('POST', '/exports', { format: 'docx' });
      expect(docx.json).toMatchObject({ format: 'docx', fileName: expect.stringMatching(/\.docx$/), preview: null });
      const dl = await call('GET', `/exports/${docx.json.id}/download`);
      expect(dl.headers['content-type']).toContain('wordprocessingml');
      if (process.env.DOCX_OUT) fs.writeFileSync(process.env.DOCX_OUT, dl.raw);
      const zip = await JSZip.loadAsync(dl.raw);
      const doc = await zip.file('word/document.xml')!.async('string');
      expect(doc).toMatch(/TOC \\h \\o &quot;1-2&quot;/);
      expect(doc).toContain('w:val="Heading1"');
      expect(doc).toContain('1. Anmeldung');
      expect(doc).toContain('Muster AG');
      expect(doc).toContain('VERTRAULICH');
      expect(doc).toMatch(/<w:tbl>/);
      expect(doc).toContain('<w:numPr>');
      expect(Object.keys(zip.files).some((f) => /^word\/media\/.+\.png$/.test(f))).toBe(true);
      const headers = await Promise.all(Object.keys(zip.files).filter((f) => /word\/(header|footer)\d*\.xml$/.test(f)).map((f) => zip.file(f)!.async('string')));
      expect(headers.join('')).toContain('Muster AG · intern');
      expect(headers.join('')).toContain('PAGE');
      expect(await zip.file('word/settings.xml')!.async('string')).toContain('updateFields');

      // Firmenvorlage: nur Formatvorlagen, lokalisierte IDs werden verwendet
      const tpl = new JSZip();
      tpl.file('word/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:style w:type="paragraph" w:styleId="Titel"><w:name w:val="Title"/><w:rPr><w:sz w:val="60"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="berschrift1"><w:name w:val="heading 1"/></w:style><w:style w:type="paragraph" w:styleId="berschrift2"><w:name w:val="heading 2"/></w:style></w:styles>');
      const tplBuf = await tpl.generateAsync({ type: 'nodebuffer' });
      expect((await upload(built, '/layout/docx-template', 'vorlage.dotx', tplBuf, 'u-redaktion')).status).toBe(403);
      expect((await upload(built, '/layout/docx-template', 'vorlage.txt', tplBuf)).status).toBe(400);
      expect((await upload(built, '/layout/docx-template', 'leer.docx', await new JSZip().generateAsync({ type: 'nodebuffer' }))).status).toBe(400);
      const up = (await upload(built, '/layout/docx-template', 'vorlage.dotx', tplBuf)).json;
      expect(up.docxTemplate).toMatchObject({ name: 'vorlage.dotx', styles: { title: 'Titel', heading1: 'berschrift1', heading2: 'berschrift2', heading3: null } });
      const z2 = await JSZip.loadAsync((await call('GET', `/exports/${(await call('POST', '/exports', { format: 'docx' })).json.id}/download`)).raw);
      const doc2 = await z2.file('word/document.xml')!.async('string');
      expect(doc2).toContain('w:val="berschrift1"');
      expect(doc2).toContain('w:val="Titel"');
      expect(await z2.file('word/styles.xml')!.async('string')).toContain('berschrift1');

      // Online-Hilfe mit Logo, Firmenname und Hausfarbe
      const rel = (await call('POST', '/releases', { version: '1.0' }, 'u-freigabe')).json;
      const site = await JSZip.loadAsync((await call('GET', `/releases/${rel.id}/download?format=site`)).raw);
      expect(site.file('bilder/logo.png')).toBeTruthy();
      const index = await site.file('index.html')!.async('string');
      expect(index).toContain('Muster AG');
      expect(index).toContain('header{background:#0b5394}');

      // Backup enthält die Vorlage; Vorlage entfernen
      const { createBackup } = await import('../src/services/backup.js');
      const backup = await JSZip.loadAsync((await createBackup(built.ctx.db, built.ctx.store, '0.13.0')).data);
      expect(Object.keys(backup.files).some((f) => f.endsWith(up.docxTemplate.key))).toBe(true);
      expect((await call('DELETE', '/layout/docx-template')).json.docxTemplate).toBeNull();
      expect((await call('DELETE', '/layout/docx-template')).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });
});
