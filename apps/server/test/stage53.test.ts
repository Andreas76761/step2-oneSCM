import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { clickpathBpmn } from '../src/domain/bpmn.js';
import { selectTransients, type Gray } from '../src/domain/frames.js';
import { pptxToMarkdown } from '../src/domain/pptx.js';
import { markdownParagraphs, paginate, renderPptx } from '../src/domain/pptxWriter.js';
import { sha256 } from '../src/domain/similarity.js';
import { extractStills } from '../src/services/mediaTools.js';
import { client, FM, importFile, uploadFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const png = (rgb: string, w = 800, h = 450, box?: [number, number, number, number]) => {
  const c = createCanvas(w, h);
  const g = c.getContext('2d');
  g.fillStyle = rgb;
  g.fillRect(0, 0, w, h);
  if (box) {
    g.fillStyle = '#111111';
    g.fillRect(...box);
  }
  return c.toBuffer('image/png');
};
/** Graustufenbild 8×4 mit Wert v und optional hellem Block (Menü) */
const gray = (v: number, menu = false): Gray => {
  const data = new Uint8Array(32).fill(v);
  if (menu) for (const i of [0, 1, 8, 9]) data[i] = 250;
  return { width: 8, height: 4, data };
};

describe('Etappe 53', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-336] Zwischenbilder, BPMN der Klickstrecke, PowerPoint-Folien (Einheit)', async () => {
    // A A [Menü] A A … dauerhaft B … [Menü 2 Bilder] B → zwei Zwischenbilder; der dauerhafte Wechsel ist keines
    const frames = [gray(40), gray(40), gray(40, true), gray(40), gray(40), gray(200), gray(200), gray(200), gray(200), gray(200), gray(200), gray(200, true), gray(200, true), gray(200)];
    const t = selectTransients(frames);
    expect(t.map((x) => [x.index, x.length])).toEqual([[2, 1], [11, 2]]);
    expect(t[0].box).toEqual({ x: 0, y: 0, w: 0.25, h: 0.5 });
    // länger als 4 Bilder offen: kein Zwischenbild
    expect(selectTransients([gray(40), ...Array.from({ length: 6 }, () => gray(40, true)), gray(40)])).toEqual([]);

    const xml = clickpathBpmn('Vertrag & Anlage', [
      { alternatives: [{ sha: 'a'.repeat(64), caption: 'Startseite' }] },
      { alternatives: [{ sha: 'b'.repeat(64), caption: 'Neu' }, { sha: 'c'.repeat(64), caption: 'Kopieren' }] },
      { alternatives: [{ sha: 'd'.repeat(64), caption: 'Speichern' }] },
    ], 'clk_1');
    expect(xml).toContain('<bpmn:process id="Process_clk_1" name="Vertrag &amp; Anlage" isExecutable="false">');
    expect([...xml.matchAll(/<bpmn:userTask id="([^"]+)" name="([^"]+)"/g)].map((m) => m[2])).toEqual(['1 Startseite', '2a Neu', '2b Kopieren', '3 Speichern']);
    expect(xml.match(/<bpmn:exclusiveGateway /g)).toHaveLength(2);
    const flows = [...xml.matchAll(/<bpmn:sequenceFlow id="([^"]+)" sourceRef="([^"]+)" targetRef="([^"]+)"/g)].map((m) => [m[2], m[3]]);
    expect(flows).toEqual([
      ['Start', 'Task_1'], ['Task_1', 'Gateway_2_auswahl'], ['Gateway_2_auswahl', 'Task_2a'], ['Gateway_2_auswahl', 'Task_2b'],
      ['Task_2a', 'Gateway_2_weiter'], ['Task_2b', 'Gateway_2_weiter'], ['Gateway_2_weiter', 'Task_3'], ['Task_3', 'Ende'],
    ]);
    // jeder Knoten und jeder Fluss hat eine Darstellung im Diagramm
    for (const id of ['Start', 'Task_1', 'Gateway_2_auswahl', 'Task_2a', 'Task_2b', 'Gateway_2_weiter', 'Task_3', 'Ende']) expect(xml).toContain(`bpmnElement="${id}"`);
    expect(xml.match(/<bpmndi:BPMNEdge /g)).toHaveLength(flows.length);

    expect(markdownParagraphs('1. Öffnen Sie **Verträge**.\n  - Unterpunkt\n\nText | mit Tabelle\n| --- |')).toEqual([
      { text: 'Öffnen Sie **Verträge**.', bullet: 'num', level: 0 }, { text: 'Unterpunkt', bullet: 'char', level: 1 }, { text: 'Text · mit Tabelle' },
    ]);
    expect(paginate(Array.from({ length: 19 }, (_, i) => ({ text: `Punkt ${i}` }))).map((p) => p.length)).toEqual([8, 8, 3]);
    const deck = await renderPptx([
      { kind: 'title', title: 'Handbuch <A&B>', subtitle: 'Stand heute' },
      { kind: 'content', title: 'Vertrag anlegen', paragraphs: markdownParagraphs('1. Öffnen Sie **Verträge**.\n2. Klicken Sie auf **Neu**.') },
      { kind: 'image', title: 'Maske', image: { data: png('#1d4ed8', 320, 180), mime: 'image/png', width: 320, height: 180, alt: 'Maske Verträge' } },
    ], { title: 'Handbuch <A&B>' });
    const zip = await JSZip.loadAsync(deck);
    expect(Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))).toHaveLength(3);
    expect(await zip.file('[Content_Types].xml')!.async('string')).toContain('Extension="png"');
    const back = await pptxToMarkdown(deck, 'x', 5e7, async () => 'e'.repeat(64));
    expect(back.markdown).toContain('# Handbuch <A&B>');
    expect(back.markdown).toContain('## Vertrag anlegen\n\n1. Öffnen Sie Verträge.\n2. Klicken Sie auf Neu.');
    expect(back.markdown).toContain(`![Maske Verträge](media:${'e'.repeat(64)})`);
  });

  it('[T-337] PowerPoint-Export freigegebener Kapitel, Klickstrecke als BPMN', async () => {
    const built = await build('pptx');
    const call = client(built);
    try {
      const img = png('#15803d', 640, 360);
      const z = new JSZip();
      z.file('handbuch/vertrag.md', `${FM}# Vertrag anlegen\n\n## Vertrag anlegen\n\nMit dieser Anleitung legen Sie einen Vertrag an.\n\n1. Öffnen Sie **Verträge**.\n2. Klicken Sie auf **Neu**.\n3. Bestätigen Sie mit **Speichern**.\n\n![Maske Verträge](bilder/maske.png)\n\nDer Vertrag ist gespeichert.\n`);
      z.file('handbuch/bilder/maske.png', img);
      z.file('handbuch/bilder/neu.png', png('#b45309'));
      await importFile(built, 'h.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const chapterId = (await call('GET', '/chapters')).json.find((c: any) => c.title === 'Vertrag anlegen').id;
      const v = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
      for (const b of v.sections.flatMap((s: any) => s.blocks)) {
        if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
        else if (b.scopeStatus === 'unconfirmed') await call('PATCH', `/content-blocks/${b.id}`, { scopeStatus: 'general', reason: 'allgemein' }, 'u-redaktion');
      }
      expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);

      const e = (await call('POST', '/exports', { format: 'pptx', chapterIds: [chapterId], reading: true }, 'u-leser')).json;
      expect(e).toMatchObject({ format: 'pptx', preview: null });
      expect(e.fileName).toMatch(/\.pptx$/);
      const f = await call('GET', e.downloadUrl.replace('/api/v1', ''), undefined, 'u-leser');
      expect(f.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.presentationml.presentation');
      const zip = await JSZip.loadAsync(f.raw as Buffer);
      expect(Object.keys(zip.files).some((n) => n.startsWith('ppt/media/'))).toBe(true);
      const md = (await pptxToMarkdown(f.raw as Buffer, 'x', 5e7, async (data) => sha256(data))).markdown;
      expect(md).toContain('## Vertrag anlegen');
      expect(md).toContain('Mit dieser Anleitung legen Sie einen Vertrag an.');
      expect(md).toMatch(/1\. Öffnen Sie Verträge\.\n2\. Klicken Sie auf Neu\./);
      expect(md).toContain(`![Maske Verträge](media:${sha256(img)})`);

      // Klickstrecke als BPMN
      const steps = [{ alternatives: [{ sha: sha256(img), caption: 'Verträge öffnen' }] }, { alternatives: [{ sha: sha256(png('#b45309')), caption: 'Neu' }] }];
      const cp = (await call('POST', '/image-clickpaths', { title: 'Vertrag anlegen', steps }, 'u-redaktion')).json;
      const bpmn = await call('GET', `/image-clickpaths/${cp.id}/bpmn`, undefined, 'u-leser');
      expect(bpmn.status).toBe(200);
      expect(bpmn.headers['content-disposition']).toContain('klickstrecke-vertrag-anlegen.bpmn');
      expect(bpmn.body).toContain('name="1 Verträge öffnen"');
      expect(bpmn.body).toContain('<bpmndi:BPMNDiagram');
      expect((await call('GET', '/image-clickpaths/clk_unbekannt/bpmn', undefined, 'u-leser')).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });

  it('[T-338] Vorher/Nachher-Belege: Fassungen gegenüberstellen, Anlass/Änderung/Wirkung, Gegenüberstellung im Archiv', async () => {
    const built = await build('vorher');
    const call = client(built);
    try {
      const v1 = png('#cbd5e1', 800, 450);
      const v2 = png('#cbd5e1', 800, 450, [600, 20, 160, 40]);
      const up = await uploadFile(built, '/media', 'maske.png', v1, 'u-redaktion');
      expect(up.status).toBe(201);
      const base = up.json.sha256;
      expect((await uploadFile(built, `/image-archive/${base}/versions`, 'maske-neu.png', v2, 'u-redaktion')).status).toBeLessThan(300);
      const after = sha256(v2);

      expect((await call('POST', '/image-comparisons', { beforeSha: base, afterSha: after }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/image-comparisons', { beforeSha: base, afterSha: base }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/image-comparisons', { beforeSha: base, afterSha: 'f'.repeat(64) }, 'u-redaktion')).status).toBe(404);
      const c = await call('POST', '/image-comparisons', { beforeSha: base, afterSha: after, title: 'Vertragsmaske', reason: 'Release 2026.3', change: 'Schaltfläche „Export“ oben rechts', effect: 'Verträge lassen sich direkt exportieren', ticket: 'ABC-42' }, 'u-redaktion');
      expect(c.status).toBe(201);
      expect(c.json).toMatchObject({ baseSha: base, before: { versionNo: 1 }, after: { versionNo: 2 }, reason: 'Release 2026.3', renderedSha: null });
      expect(c.json.before.url).toBe(`/api/v1/media/${base}?original=1`);
      expect((await call('GET', `/image-comparisons?sha=${after}`, undefined, 'u-leser')).json.map((x: any) => x.id)).toEqual([c.json.id]);

      const r = (await call('POST', `/image-comparisons/${c.json.id}/render`, {}, 'u-redaktion')).json;
      expect(r.renderedSha).toMatch(/^[a-f0-9]{64}$/);
      expect(r.markdown).toBe(`![Vorher/Nachher: Vertragsmaske](media:${r.renderedSha})`);
      const pic = await loadImage((await call('GET', `/media/${r.renderedSha}`, undefined, 'u-leser')).raw);
      expect(pic.width).toBe(28 * 3 + 640 * 2);
      // Änderung des Belegs → neue Fassung derselben Gegenüberstellung
      await call('PATCH', `/image-comparisons/${c.json.id}`, { effect: 'Export ohne Umweg über das Menü' }, 'u-redaktion');
      const again = (await call('POST', `/image-comparisons/${c.json.id}/render`, {}, 'u-redaktion')).json;
      expect(again.renderedSha).toBe(r.renderedSha);
      const item = (await call('GET', '/image-archive', undefined, 'u-leser')).json.items.find((i: any) => i.sha === r.renderedSha || i.baseSha === r.renderedSha);
      expect(item.title).toBe('Vorher/Nachher: Vertragsmaske');
      expect(item.versions.length).toBe(2);
      expect((await call('DELETE', `/image-comparisons/${c.json.id}`, undefined, 'u-redaktion')).status).toBe(204);
      expect((await call('GET', `/image-comparisons/${c.json.id}`, undefined, 'u-leser')).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });

  it('[T-339] Zwischenbilder aus dem Video: kurz geöffnetes Menü zusätzlich zu den Standbildern', async () => {
    const tools = path.join(dataDir, 'ffmpeg-fein');
    fs.mkdirSync(tools, { recursive: true });
    const base = png('#e2e8f0', 320, 180);
    const menu = png('#e2e8f0', 320, 180, [10, 10, 80, 120]);
    const next = png('#94a3b8', 320, 180);
    fs.writeFileSync(path.join(tools, 'a.png'), base);
    fs.writeFileSync(path.join(tools, 'm.png'), menu);
    fs.writeFileSync(path.join(tools, 'n.png'), next);
    // Ersatz-ffmpeg: alle 2 s → a a n; alle 0,5 s → a a m a a a n n (Menü 0,5 s offen)
    const ffmpeg = path.join(tools, 'ffmpeg');
    fs.writeFileSync(ffmpeg, `#!${process.execPath}\nconst fs = require('node:fs');\nconst path = require('node:path');\nconst out = process.argv.at(-1);\nconst fine = process.argv.some((a) => a.includes('fps=1/0.5'));\nconst seq = fine ? 'aamaaann' : 'aan';\n[...seq].forEach((c, i) => fs.copyFileSync(path.join(${JSON.stringify(tools)}, c + '.png'), out.replace('%05d', String(i + 1).padStart(5, '0'))));\n`);
    fs.chmodSync(ffmpeg, 0o755);
    const stored: string[] = [];
    const store = async (data: Buffer, name: string) => (stored.push(name), sha256(data));
    const stills = await extractStills({ transcribeCmd: null, ocrCmd: null, ocrBoxesCmd: null, ffmpeg, timeoutMs: 30_000 }, Buffer.from('Video'), store);
    expect(stills.map((s) => [s.time, s.kind ?? 'still'])).toEqual([[0, 'still'], [1, 'transient'], [4, 'still']]);
    expect(stills[1].alt).toBe('Zwischenbild bei 00:01 – kurz sichtbar (Menü oder Dialog), rot markiert');
    expect(stored).toContain('zwischenbild-00-01.png');
    // abgeschaltet: nur Standbilder
    const off = await extractStills({ transcribeCmd: null, ocrCmd: null, ocrBoxesCmd: null, ffmpeg, timeoutMs: 30_000, transientStills: false }, Buffer.from('Video'), store);
    expect(off.map((s) => s.time)).toEqual([0, 4]);
  });
});
