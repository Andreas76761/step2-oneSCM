import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import ExcelJS from 'exceljs';
import { client, importFile } from './api-helpers.js';
import { sanitizeSvg } from '../src/domain/svg.js';
import { parseCsv } from '../src/domain/tabular.js';
import { remindOverduePlans } from '../src/services/outlines.js';
import { freshDatabase, tempDir } from './helpers.js';

type Built = Awaited<ReturnType<typeof buildApp>>;
async function upload(built: Built, url: string, name: string, content: string | Buffer, user = 'u-admin') {
  const boundary = '----onescm' + Math.random().toString(16).slice(2);
  const payload = Buffer.concat([
    Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${name}"\r\nContent-Type: application/octet-stream\r\n\r\n`),
    Buffer.isBuffer(content) ? content : Buffer.from(content), Buffer.from(`\r\n--${boundary}--\r\n`),
  ]);
  const res = await built.app.inject({ method: 'POST', url: `/api/v1${url}`, payload, headers: { 'content-type': `multipart/form-data; boundary=${boundary}`, 'x-user-id': user } });
  await built.ctx.jobs.idle();
  return { status: res.statusCode, json: res.json() };
}
async function zipOf(files: Record<string, string | Buffer>) {
  const z = new JSZip();
  for (const [k, v] of Object.entries(files)) z.file(k, v);
  return z.generateAsync({ type: 'nodebuffer' });
}

const fm = (extra = '') => `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n${extra}---\n`;

describe('Etappe 12: Handbuch-Varianten aus dem Draft Manual (ADR-034)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' }));

  it('[T-170] Draft Manual → Kapitel der Variante, Entwürfe, Freigabe, Veröffentlichung je Variante; Quellenkapitel bleiben getrennt', async () => {
    const built = await build('variant');
    const call = client(built);
    try {
      await importFile(built, 'anmeldung.md', `${fm()}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldung öffnet oneSCM für alle Nutzer.\n\n## 1.2 Schritte\n\nDer Nutzer meldet sich mit seinem DMS-Konto an.\n`);
      await importFile(built, 'markt.md', `${fm('market: FR\n')}# 1. Anmeldung\n\n## 1.1 Zweck\n\nIn Frankreich gilt zusätzlich die lokale Anmeldung.\n`);
      const sourceChapters = (await call('GET', '/chapters')).json;
      expect(sourceChapters.map((c: any) => c.title)).toEqual(['1. Anmeldung']);

      const outline = (await call('POST', '/outlines', { name: 'Händlerhandbuch Blueprint', roles: ['dealer'], content: '# Anmeldung\n## Zweck\n## Schritte\n# Aufträge\n', format: 'markdown' })).json;
      expect((await call('POST', `/outlines/${outline.id}/auto-assign`, {})).json).toMatchObject({ assigned: 3 });

      // Kapitel der Variante: je Kapitel der Gliederung, nur mit Bearbeitungsrecht
      expect((await call('POST', `/outlines/${outline.id}/materialize`, {}, 'u-leser')).status).toBe(403);
      const mat = (await call('POST', `/outlines/${outline.id}/materialize`, {}, 'u-redaktion')).json;
      expect(mat.chapters.map((c: any) => [c.title, c.snippetCount])).toEqual([['1. Anmeldung', 3], ['2. Aufträge', 0]]);
      // Quellenkapitel und Variantenkapitel getrennt
      expect((await call('GET', '/chapters')).json.map((c: any) => c.id)).toEqual(sourceChapters.map((c: any) => c.id));
      expect((await call('GET', `/chapters?outline=${outline.familyId}`)).json.map((c: any) => c.title)).toEqual(['1. Anmeldung', '2. Aufträge']);

      // Entwürfe: Kapitel ohne Inhalte werden übersprungen
      const gen = (await call('POST', `/outlines/${outline.id}/generate`, {}, 'u-redaktion')).json;
      expect(gen.results.map((r: any) => [r.title, r.status])).toEqual([['1. Anmeldung', 'generated'], ['2. Aufträge', 'skipped']]);
      const chapterId = gen.results[0].chapterId;
      const v = (await call('GET', `/chapters/${chapterId}`)).json.latestVersion ?? (await call('GET', `/chapters/${chapterId}/versions`)).json[0];
      const version = (await call('GET', `/chapter-versions/${v.id}`)).json;
      // Inhalte aus den zugeordneten Schnipseln (Kapitelvorlage mit festen Abschnitten)
      const texts = version.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text)).join('\n');
      expect(texts).toContain('Die Anmeldung öffnet oneSCM für alle Nutzer.');
      expect(texts).toContain('In Frankreich gilt zusätzlich die lokale Anmeldung.');

      // Freigabe über den normalen Workflow
      for (const b of version.sections.flatMap((s: any) => s.blocks)) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
      expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      expect((await call('GET', `/outlines/${outline.id}/chapters`)).json.chapters[0].versions[0]).toMatchObject({ versionNo: 1, status: 'approved' });

      // Verzeichnisse: Abkürzung und veröffentlichte FAQ der Rolle
      await call('POST', '/abbreviations', { abbreviation: 'DMS', expansion: 'Dealer-Management-System' });
      await call('POST', '/faq', { question: 'Wer meldet sich an?', answer: 'Jeder Händler.', roles: ['dealer'], status: 'published' });
      await call('POST', '/faq', { question: 'Nur für HQ?', answer: 'Ja.', roles: ['hq'], status: 'published' });

      // Quellen-Release: keine freigegebenen Quellenkapitel → nichts zu veröffentlichen
      expect((await call('POST', '/releases', { version: '1.0' }, 'u-freigabe')).status).toBe(422);
      // Varianten-Release: Blueprint ohne marktspezifische Inhalte, Verzeichnisse als eigene Seite
      const rel = await call('POST', '/releases', { version: 'haendler-1.0', outlineId: outline.id }, 'u-freigabe');
      expect(rel.status).toBe(201);
      expect(rel.json).toMatchObject({ title: 'Händlerhandbuch Blueprint', outlineId: outline.id, outlineFamilyId: outline.familyId });
      expect(rel.json.changes.map((c: any) => c.change)).toEqual(['new']);
      const zip = await JSZip.loadAsync((await call('GET', `/releases/${rel.json.id}/download?format=site`)).raw);
      expect(Object.keys(zip.files).sort()).toEqual(['aenderungen.html', 'index.html', 'kapitel-01.html', 'verzeichnisse.html']);
      const chapterHtml = await zip.file('kapitel-01.html')!.async('string');
      expect(chapterHtml).toContain('Die Anmeldung öffnet oneSCM');
      expect(chapterHtml).not.toContain('In Frankreich');
      const lists = await zip.file('verzeichnisse.html')!.async('string');
      expect(lists).toContain('Dealer-Management-System');
      expect(lists).toContain('Wer meldet sich an?');
      expect(lists).not.toContain('Nur für HQ?');
      expect(await zip.file('index.html')!.async('string')).toContain('verzeichnisse.html#abkuerzungen');
      const md = (await call('GET', `/releases/${rel.json.id}/download?format=md`)).body;
      expect(md).toMatch(/^# Händlerhandbuch Blueprint – Version haendler-1\.0/);
      expect(md).toContain('## Abkürzungsverzeichnis');

      // Varianten-Export (Markdown, JSON) mit Titel und Verzeichnissen
      const exp = (await call('POST', '/exports', { format: 'md', outlineId: outline.id })).json;
      const expMd = (await call('GET', `/exports/${exp.id}/download`)).body;
      expect(expMd).toMatch(/^# Händlerhandbuch Blueprint/);
      expect(expMd).toContain('Blueprint (ohne marktspezifische Inhalte)');
      expect(expMd).not.toContain('In Frankreich');
      expect(expMd).toContain('## Häufige Fragen (FAQ)');
      const noLists = (await call('POST', '/exports', { format: 'md', outlineId: outline.id, appendices: false })).json;
      expect((await call('GET', `/exports/${noLists.id}/download`)).body).not.toContain('Abkürzungsverzeichnis');
      const json = JSON.parse((await call('GET', `/exports/${(await call('POST', '/exports', { format: 'json', outlineId: outline.id })).json.id}/download`)).body);
      expect(json.appendices.abbreviations.map((a: any) => a.abbreviation)).toEqual(['DMS']);
      expect((await call('POST', '/exports', { format: 'pdf', outlineId: outline.id })).status).toBe(201);
      expect((await call('POST', '/exports', { format: 'html', outlineId: 'ol_fremd' })).status).toBe(404);

      // Neue Gliederungsversion führt dieselben Kapitel fort (stabile Eintragskennung)
      const v2 = (await call('POST', `/outlines/${outline.id}/versions`, {})).json;
      const again = (await call('POST', `/outlines/${v2.id}/materialize`, {})).json;
      expect(again.chapters.map((c: any) => c.id)).toEqual(mat.chapters.map((c: any) => c.id));
      // Folge-Release derselben Variante vergleicht mit dem Vorgänger der Variante
      const rel2 = (await call('POST', '/releases', { version: 'haendler-1.1', outlineId: v2.id }, 'u-freigabe')).json;
      expect(rel2.previousReleaseId).toBe(rel.json.id);
      expect(rel2.changes.map((c: any) => c.change)).toEqual(['unchanged']);
      expect((await built.ctx.db.get("SELECT COUNT(*) AS n FROM audit_events WHERE action = 'outline.variant_materialized'"))!.n).toBeGreaterThanOrEqual(2);
    } finally {
      await built.app.close();
    }
  });

  it('[T-171] Bedienkomfort: Drag & Drop für Schnipsel und Gliederung, Vergleich von Gliederungsversionen, globale Suche', async () => {
    const built = await build('comfort');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${fm()}# 1. Anmeldung\n\n## 1.1 Zweck\n\nErster Absatz zur Anmeldung.\n\nZweiter Absatz zur Anmeldung.\n\nDritter Absatz mit 100% Rabatt_Code.\n`);
      const o = (await call('POST', '/outlines', { name: 'Händler', content: '# Anmeldung\n## Zweck\n# Aufträge\n# Abrechnung\n', format: 'markdown' })).json;
      await call('POST', `/outlines/${o.id}/auto-assign`, {});
      const node = (x: any, t: string) => x.nodes.find((n: any) => n.title === t);
      const zweck = () => call('GET', `/outlines/${o.id}/draft`).then((r) => node(r.json, 'Zweck').snippets.map((s: any) => s.text));
      const draft = (await call('GET', `/outlines/${o.id}/draft`)).json;
      const [s1, s2, s3] = node(draft, 'Zweck').snippets;
      // Schnipsel vor einem anderen ablegen (Drag & Drop), auch aus einem anderen Eintrag
      await call('POST', `/outlines/${o.id}/assignments`, { nodeId: node(draft, 'Zweck').id, snippetIds: [s3.id], beforeSnippetId: s1.id });
      expect(await zweck()).toEqual(['Dritter Absatz mit 100% Rabatt_Code.', 'Erster Absatz zur Anmeldung.', 'Zweiter Absatz zur Anmeldung.']);
      await call('POST', `/outlines/${o.id}/assignments`, { nodeId: node(draft, 'Aufträge').id, snippetIds: [s2.id] });
      await call('POST', `/outlines/${o.id}/assignments`, { nodeId: node(draft, 'Zweck').id, snippetIds: [s2.id], beforeSnippetId: s3.id });
      expect((await zweck())[0]).toBe('Zweiter Absatz zur Anmeldung.');
      expect((await call('POST', `/outlines/${o.id}/assignments`, { nodeId: node(draft, 'Zweck').id, snippetIds: [s2.id], beforeSnippetId: s2.id })).status).toBe(400);
      expect((await call('POST', `/outlines/${o.id}/assignments`, { nodeId: node(draft, 'Aufträge').id, snippetIds: [s1.id], beforeSnippetId: s3.id })).status).toBe(400);

      // Gliederung: Eintrag vor einem anderen einordnen (übernimmt dessen Ebene)
      let x = (await call('PATCH', `/outline-nodes/${node(o, 'Abrechnung').id}`, { beforeId: node(o, 'Anmeldung').id })).json;
      expect(x.nodes.map((n: any) => `${n.number} ${n.title}`)).toEqual(['1 Abrechnung', '2 Anmeldung', '2.1 Zweck', '3 Aufträge']);
      x = (await call('PATCH', `/outline-nodes/${node(x, 'Aufträge').id}`, { beforeId: node(x, 'Zweck').id })).json;
      expect(x.nodes.map((n: any) => `${n.number} ${n.title}`)).toEqual(['1 Abrechnung', '2 Anmeldung', '2.1 Aufträge', '2.2 Zweck']);
      expect((await call('PATCH', `/outline-nodes/${node(x, 'Anmeldung').id}`, { beforeId: node(x, 'Zweck').id })).status).toBe(400); // hat Unterkapitel
      expect((await call('PATCH', `/outline-nodes/${node(x, 'Anmeldung').id}`, { beforeId: 42 })).status).toBe(400);
      x = (await call('PATCH', `/outline-nodes/${node(x, 'Aufträge').id}`, { beforeId: null, parentId: null })).json;
      expect(x.nodes.map((n: any) => `${n.number} ${n.title}`)).toEqual(['1 Abrechnung', '2 Anmeldung', '2.1 Zweck', '3 Aufträge']);

      // Versionsvergleich über stabile Eintragskennungen
      const v2 = (await call('POST', `/outlines/${o.id}/versions`, {})).json;
      await call('PATCH', `/outlines/${v2.id}`, { name: 'Händler Pkw', divisions: ['car'] });
      await call('PATCH', `/outline-nodes/${node(v2, 'Abrechnung').id}`, { title: 'Rechnungen' });
      await call('PATCH', `/outline-nodes/${node(v2, 'Aufträge').id}`, { beforeId: node(v2, 'Abrechnung').id });
      await call('DELETE', `/outline-nodes/${node(v2, 'Zweck').id}`);
      await call('POST', `/outlines/${v2.id}/nodes`, { title: 'Reklamationen' });
      const cmp = (await call('GET', `/outlines/${v2.id}/compare?with=${o.id}`, undefined, 'u-leser')).json;
      expect(cmp.summary).toEqual({ added: 1, removed: 1, changed: 3, unchanged: 0 });
      const e = (t: string) => cmp.entries.find((y: any) => (y.to ?? y.from).title === t);
      expect(e('Rechnungen').details).toEqual(['umbenannt (vorher „Abrechnung“)', 'verschoben (vorher 1)']);
      expect(e('Zweck')).toMatchObject({ change: 'removed', snippetsRemoved: 3 });
      expect(e('Reklamationen')).toMatchObject({ change: 'added', to: { number: '4' } });
      expect(cmp.variant).toEqual(['Name: „Händler“ → „Händler Pkw“', 'Sparten: – → car']);
      const other = (await call('POST', '/outlines', { name: 'Andere', nodes: [{ title: 'A' }] })).json;
      expect((await call('GET', `/outlines/${v2.id}/compare?with=${other.id}`)).status).toBe(400);
      expect((await call('GET', `/outlines/${v2.id}/compare`)).status).toBe(400);

      // Globale Suche: gruppiert, mit Sprungziel; Platzhalter % und _ werden wörtlich gesucht
      await call('POST', '/abbreviations', { abbreviation: 'DMS', expansion: 'Dealer-Management-System für die Anmeldung' });
      await call('POST', '/faq', { question: 'Wie funktioniert die Anmeldung?', answer: 'Mit dem DMS-Konto.' });
      const r = (await call('GET', '/search?q=anmeldung', undefined, 'u-leser')).json;
      expect(r.groups.map((g: any) => g.type)).toEqual(['chapter', 'snippet', 'outline', 'abbreviation', 'faq']);
      expect((await call('GET', '/search?q=a.md')).json.groups.find((g: any) => g.type === 'source').hits[0]).toMatchObject({ title: 'a.md', link: '/quellen?q=a.md' });
      expect(r.groups[0].hits[0]).toMatchObject({ title: '1. Anmeldung', link: expect.stringMatching(/^\/werkstatt\//) });
      expect(r.groups.find((g: any) => g.type === 'outline').hits.map((h: any) => h.title)).toEqual(['Händler Pkw – V2']);
      expect((await call('GET', '/search?q=100%25')).json.groups.find((g: any) => g.type === 'snippet').hits[0].excerpt).toContain('100% Rabatt_Code');
      expect((await call('GET', '/search?q=%25%25')).json.total).toBe(0);
      expect((await call('GET', '/search?q=_')).status).toBe(400);
      expect((await call('GET', '/search?q=Anmeldung', undefined, 'u-admin', 'p_fremd')).status).toBeGreaterThanOrEqual(400);
    } finally {
      await built.app.close();
    }
  });

  it('[T-172] Betrieb & Pflege: entfernte Quelldateien, bereinigter SVG-Import, Stammdaten aus CSV/Excel, Erinnerung an überfällige Planung', async () => {
    // Einheit: SVG-Bereinigung und CSV
    const clean = sanitizeSvg('<?xml version="1.0"?><svg width="80" height="20" onload="x()"><script>alert(1)</script><a href="javascript:x()"><text>Hi</text></a><rect fill="url(http://e/x)" style="fill:red;behavior:url(x)"/><foreignObject><p>x</p></foreignObject></svg>');
    expect(clean).toEqual({ svg: '<svg width="80" height="20" xmlns="http://www.w3.org/2000/svg"><text>Hi</text><rect style="fill:red"/></svg>', width: 80, height: 20 });
    expect(() => sanitizeSvg('<!DOCTYPE svg [<!ENTITY a "b">]><svg>&a;</svg>')).toThrow(/Entities/);
    expect(parseCsv('﻿Abkürzung;Bedeutung\n"A;B";"mit ""Zitat"""\r\nX;Y\n\n')).toEqual([['Abkürzung', 'Bedeutung'], ['A;B', 'mit "Zitat"'], ['X', 'Y']]);

    const built = await build('care');
    const call = client(built);
    try {
      // Vollständiger Stand: fehlende Dateien derselben Herkunft werden als entfernt markiert, einzelne Uploads bleiben unberührt
      const md = (t: string) => `${fm()}# 1. ${t}\n\nText zu ${t}.\n`;
      await upload(built, '/imports?snapshot=true', 'stand1.zip', await zipOf({ 'a.md': md('Anmeldung'), 'b.md': md('Aufträge') }));
      await importFile(built, 'einzeln.md', md('Einzeln'));
      const imp2 = (await upload(built, '/imports?snapshot=true', 'stand2.zip', await zipOf({ 'a.md': md('Anmeldung') }))).json;
      const done = (await call('GET', `/imports/${imp2.id}`)).json;
      expect(done.stats).toMatchObject({ removed: 1 });
      expect(done.items.find((i: any) => i.status === 'removed')).toMatchObject({ path: 'b.md' });
      let sources = (await call('GET', '/sources')).json;
      const b = sources.find((d: any) => d.path === 'b.md');
      expect(b).toMatchObject({ removedAt: expect.any(String), removedInImport: imp2.id });
      expect(b.revisions.every((r: any) => !r.isCurrent)).toBe(true);
      expect(sources.find((d: any) => d.path === 'einzeln.md').removedAt).toBeNull();
      expect((await call('GET', '/search?q=Text zu Aufträge')).json.groups.find((g: any) => g.type === 'snippet')).toBeUndefined();
      // Wiederherstellen (nur mit Bearbeitungsrecht), erneut auftauchende Datei hebt die Markierung ebenfalls auf
      expect((await call('POST', `/source-documents/${b.id}/restore`, {}, 'u-leser')).status).toBe(403);
      expect((await call('POST', `/source-documents/${b.id}/restore`, {})).json).toMatchObject({ removedAt: null });
      expect((await call('POST', `/source-documents/${b.id}/restore`, {})).status).toBe(409);
      await upload(built, '/imports?snapshot=true', 'stand3.zip', await zipOf({ 'a.md': md('Anmeldung') }));
      await upload(built, '/imports?snapshot=true', 'stand4.zip', await zipOf({ 'a.md': md('Anmeldung'), 'b.md': md('Aufträge') }));
      sources = (await call('GET', '/sources')).json;
      expect(sources.find((d: any) => d.path === 'b.md')).toMatchObject({ removedAt: null });
      expect(sources.find((d: any) => d.path === 'b.md').revisions[0].isCurrent).toBe(true);
      // Stand ohne Dokumente entfernt nichts
      await upload(built, '/imports?snapshot=true', 'leer.zip', await zipOf({ 'bild.png': Buffer.from('kein bild') }));
      expect((await call('GET', '/sources')).json.filter((d: any) => d.removedAt)).toEqual([]);

      // SVG: Upload wird bereinigt gespeichert und mit Sandbox-CSP ausgeliefert; ungültiges SVG wird abgelehnt
      const svgUp = await upload(built, '/media', 'logo.svg', '<svg viewBox="0 0 100 50"><script>alert(1)</script><rect width="10" height="10" onclick="x()"/></svg>');
      expect(svgUp.status).toBe(201);
      expect(svgUp.json).toMatchObject({ mime: 'image/svg+xml', width: 100, height: 50 });
      const media = await built.app.inject({ method: 'GET', url: `/api/v1/media/${svgUp.json.sha256}`, headers: { 'x-user-id': 'u-leser' } });
      expect(media.headers['content-type']).toBe('image/svg+xml');
      expect(media.headers['content-security-policy']).toContain('sandbox');
      expect(media.body).toBe('<svg viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>');
      expect((await upload(built, '/media', 'x.svg', '<!DOCTYPE svg><svg/>')).status).toBe(400);
      // SVG im ZIP-Import, im Text referenziert, im PDF als Vektorgrafik
      const zipImp = (await upload(built, '/imports', 'bilder.zip', await zipOf({ 'c.md': `${fm()}# 3. Bilder\n\n![Ablauf](img/ablauf.svg)\n`, 'img/ablauf.svg': '<svg width="40" height="20"><circle cx="5" cy="5" r="4"/></svg>', 'img/kaputt.svg': '<svg><g></svg>' }))).json;
      const items = (await call('GET', `/imports/${zipImp.id}`)).json.items;
      expect(items.find((i: any) => i.path === 'img/ablauf.svg')).toMatchObject({ status: 'media' });
      expect(items.find((i: any) => i.path === 'img/kaputt.svg')).toMatchObject({ status: 'skipped', message: expect.stringContaining('Nicht passendes Ende-Tag') });
      const { renderPdfExport } = await import('../src/services/exports.js');
      const { loadMedia } = await import('../src/services/media.js');
      const svgMd = (await call('GET', '/snippets?q=Ablauf')).json.items[0].text;
      expect(svgMd).toMatch(/!\[Ablauf\]\(media:[0-9a-f]{64}\)/);
      const pdf = await renderPdfExport([{ title: 'Bilder', versionNo: 1, approvedAt: null, sections: [{ code: 'x', title: 'X', blocks: [{ kind: 'text', text: svgMd, roles: [], divisions: [], market: null, release: null }] }] }], {}, await loadMedia(built.ctx, [svgMd]));
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');

      // Stammdaten aus CSV (Vorschau, Übernahme) und Excel
      await call('POST', '/abbreviations', { abbreviation: 'DMS', expansion: 'Dealer-Management-System' });
      const csv = 'Abkürzung;Bedeutung;Beschreibung\nDMS;Dealer-Management-System;\nVIN;Fahrzeug-Identifizierungsnummer;17 Zeichen\nSAP;;\nVIN;doppelt;\n';
      expect((await upload(built, '/master-data/import?kind=abbreviations', 'abk.csv', csv, 'u-leser')).status).toBe(403);
      const preview = (await upload(built, '/master-data/import?kind=abbreviations', 'abk.csv', csv)).json;
      expect(preview.summary).toEqual({ rows: 4, create: 1, update: 0, unchanged: 1, error: 2 });
      expect(preview.rows.map((r: any) => r.action)).toEqual(['unchanged', 'create', 'error', 'error']);
      expect((await call('GET', '/abbreviations')).json).toHaveLength(1);
      const applied = (await upload(built, '/master-data/import?kind=abbreviations&apply=true', 'abk.csv', csv)).json;
      expect(applied).toMatchObject({ applied: true, summary: { create: 1, error: 2 } });
      expect((await call('GET', '/abbreviations')).json.map((a: any) => a.abbreviation)).toEqual(['DMS', 'VIN']);
      expect((await upload(built, '/master-data/import?kind=abbreviations', 'x.csv', 'Name;Wert\nA;B\n')).status).toBe(400);
      expect((await upload(built, '/master-data/import?kind=abbreviations', 'x.pdf', 'x')).status).toBe(415);
      expect((await upload(built, '/master-data/import?kind=unbekannt', 'x.csv', 'a\nb')).status).toBe(400);

      const wb = new ExcelJS.Workbook();
      const ws = wb.addWorksheet('FAQ');
      ws.addRow(['Frage', 'Antwort', 'Rollen', 'Status']);
      ws.addRow(['Wie melde ich mich an?', 'Mit dem DMS-Konto.', 'dealer, hq', 'veröffentlicht']);
      ws.addRow(['Wo?', 'Im Portal.', 'kunde', '']);
      const xlsx = Buffer.from(await wb.xlsx.writeBuffer());
      const faq = (await upload(built, '/master-data/import?kind=faq&apply=true', 'faq.xlsx', xlsx)).json;
      expect(faq.summary).toMatchObject({ create: 1, error: 1 });
      expect(faq.rows[1].message).toMatch(/Unbekannte Rollen/);
      expect((await call('GET', '/faq')).json[0]).toMatchObject({ question: 'Wie melde ich mich an?', roles: ['dealer', 'hq'], status: 'published' });
      const gl = (await upload(built, '/master-data/import?kind=glossary&apply=true', 'glossar.csv', 'Begriff,Definition,Vermeiden\nAuftrag,Bestellung eines Händlers,"Order, Bestellung"\n')).json;
      expect(gl.summary).toMatchObject({ create: 1, error: 0 });
      expect((await call('GET', '/terminology')).json.find((t: any) => t.preferred === 'Auftrag')).toMatchObject({ definition: 'Bestellung eines Händlers', avoid: ['Order', 'Bestellung'] });

      // Erinnerung an überfällige Planung: einmal je Termin an die verantwortliche Person, sonst an Administratoren
      const o = (await call('POST', '/outlines', { name: 'Plan', nodes: [{ title: 'A' }, { title: 'B' }, { title: 'C' }] })).json;
      const [na, nb, nc] = o.nodes;
      await call('PUT', `/outline-nodes/${na.id}/plan`, { assignee: 'u-redaktion', dueDate: '2026-01-10', status: 'in_progress' });
      await call('PUT', `/outline-nodes/${nb.id}/plan`, { assignee: 'Jemand Extern', dueDate: '2026-01-10' });
      await call('PUT', `/outline-nodes/${nc.id}/plan`, { assignee: 'u-redaktion', dueDate: '2026-01-10', status: 'done' });
      const forProject = (id: string) => ({ ...built.ctx, projectId: id });
      expect(await remindOverduePlans(built.ctx, forProject as any, '2026-01-11')).toBe(2);
      expect(await remindOverduePlans(built.ctx, forProject as any, '2026-01-12')).toBe(0);
      const inbox = (await call('GET', '/notifications', undefined, 'u-redaktion')).json.items;
      expect(inbox.map((n: any) => [n.type, n.link])).toContainEqual(['plan_overdue', `/stammdaten/planung?outline=${o.id}`]);
      expect(inbox.find((n: any) => n.type === 'plan_overdue').text).toContain('„A“ in „Plan“ war fällig am 10.1.2026');
      expect((await call('GET', '/notifications', undefined, 'u-admin')).json.items.some((n: any) => n.text.includes('„B“'))).toBe(true);
      // neuer Termin → erneute Erinnerung möglich
      await call('PUT', `/outline-nodes/${na.id}/plan`, { dueDate: '2026-01-20' });
      expect(await remindOverduePlans(built.ctx, forProject as any, '2026-01-21')).toBe(1);
    } finally {
      await built.app.close();
    }
  });
});
