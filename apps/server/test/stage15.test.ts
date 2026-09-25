import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { normalizeOptions, parseStructure, renderDiagrams } from '../src/domain/diagrams.js';
import { approveChapter, client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';
import { png } from './png.js';

const fm = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';

describe('Etappe 15', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
  } as any));

  it('[T-178] Bilder: Darstellungsoptionen, Vorlagen, PNG-Fassung für Word, Bild im Kapitel und Word-Export', async () => {
    // Einheit: Optionen
    expect(normalizeOptions({ color: 'rot', shape: 'kreis', perRow: 9 }, '#1d63d8')).toEqual({ color: '#1d63d8', shape: 'rounded', textSize: 'normal', perRow: 6 });
    const s = parseStructure('1. Menü öffnen\n2. Auftrag wählen\n3. Speichern');
    const [sq] = renderDiagrams(s, ['process'], { color: '#0F766E', shape: 'square', textSize: 'large' });
    expect(sq.svg).toContain('#0f766e');
    expect(sq.svg).toMatch(/<rect [^>]*height="\d+" rx="0"/);
    expect(sq.svg).toContain('font-size="16.1"');
    const [pill] = renderDiagrams(s, ['clickpath'], { shape: 'pill', perRow: 2 });
    expect(pill.svg).toContain('rx="35"');
    // zwei Stationen je Zeile → drei Stationen brauchen zwei Zeilen
    expect(Number(/height="(\d+)"/.exec(pill.svg)![1])).toBeGreaterThan(Number(/height="(\d+)"/.exec(renderDiagrams(s, ['clickpath'], {})[0].svg)![1]));

    const built = await build('images');
    const call = client(built);
    try {
      const text = 'Öffnen Sie **Verkauf > Aufträge**.\nKlicken Sie auf **Speichern**.';
      const g = (await call('POST', '/diagrams/generate', { text, kinds: ['process'], options: { color: '#0f766e', shape: 'pill' } }, 'u-leser')).json;
      expect(g.options).toEqual({ color: '#0f766e', shape: 'pill', textSize: 'normal', perRow: 4 });
      expect(g.images[0].svg).toContain('#0f766e');

      // Vorlagen
      const tpl = { name: 'Auftragsablauf', kinds: ['process', 'clickpath'], structure: g.structure, options: g.options };
      expect((await call('POST', '/diagram-templates', tpl, 'u-leser')).status).toBe(403);
      const created = await call('POST', '/diagram-templates', tpl);
      expect(created.status).toBe(201);
      expect(created.json).toMatchObject({ name: 'Auftragsablauf', kinds: ['process', 'clickpath'], options: { shape: 'pill' } });
      expect((await call('POST', '/diagram-templates', tpl)).status).toBe(409);
      expect((await call('POST', '/diagram-templates', { ...tpl, name: 'Leer', structure: {} })).status).toBe(400);
      expect((await call('GET', '/diagram-templates', undefined, 'u-leser')).json.map((t: any) => t.name)).toEqual(['Auftragsablauf']);
      const again = (await call('POST', '/diagrams/generate', { structure: created.json.structure, options: created.json.options, kinds: created.json.kinds })).json;
      expect(again.images.map((i: any) => i.kind)).toEqual(['process', 'clickpath']);
      expect((await call('DELETE', `/diagram-templates/${created.json.id}`, undefined, 'u-leser')).status).toBe(403);
      expect((await call('DELETE', `/diagram-templates/${created.json.id}`)).status).toBe(204);
      expect((await call('DELETE', `/diagram-templates/${created.json.id}`)).status).toBe(404);

      // Speichern + PNG-Fassung (im Browser gerastert)
      const sv = (await call('POST', '/diagrams/save', { svg: g.images[0].svg, kind: 'process', title: 'Prozess Auftrag', alt: 'Ablauf Auftrag' })).json;
      const b64 = png(40, 20).toString('base64');
      expect((await call('PUT', `/media/${sv.sha256}/rendition`, { png: b64 }, 'u-leser')).status).toBe(403);
      expect((await call('PUT', `/media/${sv.sha256}/rendition`, { png: Buffer.from('kein Bild').toString('base64') })).status).toBe(400);
      const rd = (await call('PUT', `/media/${sv.sha256}/rendition`, { png: `data:image/png;base64,${b64}` })).json;
      expect(rd).toMatchObject({ sha256: sv.sha256, pngSha: expect.stringMatching(/^[a-f0-9]{64}$/), width: 40, height: 20 });
      expect((await call('PUT', `/media/${rd.pngSha}/rendition`, { png: b64 })).status).toBe(400);
      expect((await call('PUT', `/media/${'0'.repeat(64)}/rendition`, { png: b64 })).status).toBe(404);

      // Bild in einen Absatz einfügen (Werkstatt) und als Word exportieren: SVG mit PNG-Ersatz
      await importFile(built, 'a.md', `${fm}# 1. Aufträge\n\nAufträge werden im Menü Verkauf angelegt.\n`);
      const ch = (await call('GET', '/chapters')).json.find((c: any) => c.title === '1. Aufträge');
      const v = (await call('POST', `/chapters/${ch.id}/generate`, {}, 'u-redaktion')).json;
      const b = v.sections.flatMap((x: any) => x.blocks).find((x: any) => x.kind !== 'gap');
      expect((await call('PATCH', `/content-blocks/${b.id}`, { text: `${b.text}\n\n${sv.markdown}`, expectedVersionNo: b.versionNo }, 'u-redaktion')).status).toBe(200);
      const idx = (await call('GET', '/image-index')).json;
      expect(idx.find((i: any) => i.sha256 === sv.sha256)).toMatchObject({ pngSha: rd.pngSha, number: 1 });
      expect(idx.some((i: any) => i.sha256 === rd.pngSha)).toBe(false);
      await approveChapter(call, ch.id); // übernimmt den manuell geänderten Absatz in die freigegebene Version
      const exp = (await call('POST', '/exports', { format: 'docx' })).json;
      const raw = (await call('GET', `/exports/${exp.id}/download`)).raw;
      if (process.env.DOCX_OUT) fs.writeFileSync(process.env.DOCX_OUT, raw);
      const zip = await JSZip.loadAsync(raw);
      const doc = await zip.file('word/document.xml')!.async('string');
      expect(doc).toContain('svgBlip');
      expect(doc).not.toContain('[Bild: Ablauf Auftrag]');
      const files = Object.keys(zip.files);
      expect(files.some((f) => /^word\/media\/.+\.svg$/.test(f))).toBe(true);
      expect(files.some((f) => /^word\/media\/.+\.png$/.test(f))).toBe(true);
    } finally {
      await built.app.close();
    }
  });

  it('[T-179] Schreibstil in der Werkstatt: Stilwert je Kapitel, Stapelkorrektur mit Vorschau, Versionsprüfung, gesperrte Absätze', async () => {
    const built = await build('style-ws');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${fm}# 1. Anmeldung\n\nDie Anmeldung wurde eigentlich geprüft.\n\nDas Passwort wurde gespeichert.\n\nKlicken Sie auf **Anmelden**.\n`);
      await importFile(built, 'b.md', `${fm}# 2. Abmeldung\n\nKlicken Sie auf **Abmelden**.\n`);
      const chapters = (await call('GET', '/chapters')).json;
      const c1 = chapters.find((c: any) => c.title === '1. Anmeldung');
      const c2 = chapters.find((c: any) => c.title === '2. Abmeldung');
      const v1 = (await call('POST', `/chapters/${c1.id}/generate`, {}, 'u-redaktion')).json;
      await call('POST', `/chapters/${c2.id}/generate`, {}, 'u-redaktion');

      // Stilwert je Kapitel, schlechtestes zuerst
      const sum = (await call('GET', '/style/chapters', undefined, 'u-leser')).json;
      expect(sum.chapters.map((c: any) => c.title)).toEqual(['1. Anmeldung', '2. Abmeldung']);
      expect(sum.chapters[0]).toMatchObject({ chapterId: c1.id, versionId: v1.id, status: 'draft', problemSentences: 2 });
      expect(sum.chapters[0].score).toBeLessThan(sum.chapters[1].score);
      expect(sum.chapters[1].score).toBe(100);
      expect(sum.average).toBeGreaterThan(0);

      // Vorschau (Leserecht)
      const pv = (await call('POST', `/style/chapter-versions/${v1.id}/autofix`, {}, 'u-leser')).json;
      expect(pv.version).toMatchObject({ id: v1.id, editable: true });
      expect(pv.blocks.map((b: any) => b.after).sort()).toEqual(['Das Passwort wird gespeichert.', 'Die Anmeldung wird geprüft.']);
      const [first, second] = pv.blocks;
      // Übernehmen nur mit Bearbeitungsrecht; veraltete Version und gesperrter Absatz werden übersprungen
      expect((await call('POST', `/style/chapter-versions/${v1.id}/autofix`, { apply: true, blocks: [first] }, 'u-leser')).status).toBe(403);
      expect((await call('PATCH', `/content-blocks/${second.id}`, { mode: 'locked' }, 'u-redaktion')).status).toBe(200);
      const res = (await call('POST', `/style/chapter-versions/${v1.id}/autofix`, {
        apply: true, blocks: [{ id: first.id, versionNo: first.versionNo }, { id: second.id, versionNo: second.versionNo + 1 }, { id: 'cb_fremd', versionNo: 1 }],
      }, 'u-redaktion')).json;
      expect(res.saved).toEqual([first.id]);
      expect(res.skipped).toEqual(expect.arrayContaining([{ id: second.id, reason: 'gesperrt' }, { id: 'cb_fremd', reason: expect.stringContaining('keine Korrektur') }]));
      const after = (await call('GET', `/chapter-versions/${v1.id}`)).json.sections.flatMap((s: any) => s.blocks).find((b: any) => b.id === first.id);
      expect(after).toMatchObject({ text: first.after, versionNo: first.versionNo + 1, mode: 'manually_edited' });
      expect(await built.ctx.db.get("SELECT 1 FROM audit_events WHERE action = 'style.batch_fixed'")).toBeTruthy();
      // veraltete Version eines nicht gesperrten Absatzes
      expect((await call('PATCH', `/content-blocks/${second.id}`, { mode: 'manually_edited' }, 'u-redaktion')).status).toBe(200);
      const cur = (await call('POST', `/style/chapter-versions/${v1.id}/autofix`, {})).json.blocks[0];
      const stale = (await call('POST', `/style/chapter-versions/${v1.id}/autofix`, { apply: true, blocks: [{ id: cur.id, versionNo: cur.versionNo - 1 }] }, 'u-redaktion')).json;
      expect(stale).toMatchObject({ saved: [], skipped: [{ id: cur.id, reason: expect.stringContaining('zwischenzeitlich geändert') }] });
      expect((await call('POST', `/style/chapter-versions/${v1.id}/autofix`, { apply: true, blocks: [] }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/style/chapter-versions/cv_fremd/autofix', {})).status).toBeGreaterThanOrEqual(400);
    } finally {
      await built.app.close();
    }
  });
});
