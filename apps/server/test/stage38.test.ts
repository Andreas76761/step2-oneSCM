import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { selectChanges, toGray } from '../src/domain/frames.js';
import { parseSubtitles, subtitlesToMarkdown, timeLabel } from '../src/domain/subtitles.js';
import { commandArgs } from '../src/services/mediaTools.js';
import { renderPdf } from '../src/services/render.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const VTT = `WEBVTT

Kapitel-1
00:00:00.000 --> 00:00:04.000
Vertrag anlegen

00:00:01.000 --> 00:00:05.000
<v Sprecher>Öffnen Sie <i>Contract Management</i>.</v>

00:00:05.500 --> 00:00:09.000
Klicken Sie auf Neu &amp; wählen Sie den Händler.

Kapitel-2
00:01:30.000 --> 00:01:34.000
Vertrag kündigen

00:01:31.000 --> 00:01:36.000
Kündigen Sie den Vertrag über Beenden.
`;
const SRT = '1\r\n00:00:02,000 --> 00:00:06,000\r\nDie Preisliste öffnen Sie über Produkte.\r\n\r\n2\r\n00:02:10,500 --> 00:02:14,000\r\n{\\an8}Preise ändern Sie über Bearbeiten.\r\n';

/** einfarbiges Bild, optional mit dunklem Rechteck (Änderung) */
function frame(rect?: [number, number, number, number]) {
  const c = createCanvas(320, 180);
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 320, 180);
  if (rect) {
    g.fillStyle = '#202020';
    g.fillRect(...rect);
  }
  return c;
}
const gray = (c: ReturnType<typeof frame>) => toGray(c.getContext('2d').getImageData(0, 0, c.width, c.height).data, c.width, c.height);

describe('Etappe 38', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string, mediaTools?: object) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', ...(mediaTools ? { mediaTools: { transcribeCmd: null, ocrCmd: null, ffmpeg: null, timeoutMs: 30_000, ...mediaTools } } : {}) } as any));

  it('[T-270] Untertitel (WebVTT, SRT): Formatierung entfernt, Kapitelmarken als Abschnitte, Zeitmarke je Absatz, Standbilder an ihrer Zeit (Einheit)', () => {
    const { cues, chapters } = parseSubtitles(VTT);
    expect(chapters.map((c) => [c.start, c.text])).toEqual([[0, 'Vertrag anlegen'], [90, 'Vertrag kündigen']]);
    expect(cues.map((c) => c.text)).toEqual(['Öffnen Sie Contract Management.', 'Klicken Sie auf Neu & wählen Sie den Händler.', 'Kündigen Sie den Vertrag über Beenden.']);
    const res = subtitlesToMarkdown(VTT, 'Schulung Verträge', [{ time: 4, sha: 'a'.repeat(64), alt: 'Standbild bei 00:04' }]);
    const md = res.markdown;
    expect(md).toMatch(/^# Schulung Verträge\n\n## Vertrag anlegen\n\nÖffnen Sie Contract Management\. Klicken Sie auf Neu & wählen Sie den Händler\.\n\n!\[Standbild bei 00:04\]\(media:a{64}\)\n\n## Vertrag kündigen\n\nKündigen Sie den Vertrag über Beenden\.\n/);
    const lines = md.split('\n');
    const at = (t: string) => res.locators.filter((l) => l.line <= lines.findIndex((x) => x.includes(t)) + 1).at(-1)?.locator;
    expect(at('Öffnen Sie')).toEqual({ time: '00:01' });
    expect(at('Kündigen Sie')).toEqual({ time: '01:31' });
    // SRT ohne Kapitel: Blöcke zu 2 Minuten
    const srt = subtitlesToMarkdown(SRT, 'Preise');
    expect(srt.markdown).toContain('## 00:00–02:00\n\nDie Preisliste öffnen Sie über Produkte.');
    expect(srt.markdown).toContain('## 02:00–02:14\n\nPreise ändern Sie über Bearbeiten.');
    expect(subtitlesToMarkdown('WEBVTT\n\n', 'leer').skip).toMatch(/ohne Text/);
    expect(timeLabel(3725.9)).toBe('1:02:05');
  });

  it('[T-271] Standbilder nur bei sichtbarer Änderung mit Bereich, Befehlsvorlage ohne Shell (Einheit)', () => {
    const frames = [frame(), frame(), frame([200, 120, 60, 40]), frame([200, 120, 60, 40]), frame([0, 0, 320, 180])].map(gray);
    const picks = selectChanges(frames);
    expect(picks.map((p) => p.index)).toEqual([0, 2, 4]);
    const box = picks[1].box!;
    expect(box.x).toBeCloseTo(200 / 320, 2);
    expect(box.y).toBeCloseTo(120 / 180, 2);
    expect(box.w).toBeCloseTo(60 / 320, 2);
    expect(picks[2].box).toBeNull(); // Szenenwechsel: kein Rahmen
    expect(commandArgs('whisper-cli -m "/models/ggml base.bin" -of {output} -f {input}; rm -rf /', { input: '/tmp/a b.mp4', output: '/tmp/t' }))
      .toEqual(['whisper-cli', '-m', '/models/ggml base.bin', '-of', '/tmp/t', '-f', '/tmp/a b.mp4;', 'rm', '-rf', '/']);
  });

  it('[T-272] Video mit Untertiteln daneben, einzelne Untertitel, Video ohne Werkzeug übersprungen; Fundstelle Zeitmarke, Formatfilter, Werkzeugstatus', async () => {
    const built = await build('video');
    const call = client(built);
    try {
      expect((await call('GET', '/metadata/media-tools', undefined, 'u-leser')).json).toEqual({ transcribe: false, ocr: false, stills: false, redact: false });
      const z = new JSZip();
      z.file('schulung/vertraege.mp4', Buffer.from('kein echtes Video'));
      z.file('schulung/vertraege.vtt', VTT);
      z.file('schulung/preise.srt', SRT);
      z.file('schulung/ohne.mp4', Buffer.from('noch ein Video'));
      const up = await importFile(built, 'v.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const imp = (await call('GET', `/imports/${up.id}`)).json;
      const items = Object.fromEntries(imp.items.map((i: any) => [i.path, i]));
      expect(items['schulung/vertraege.mp4']).toMatchObject({ status: 'imported' });
      expect(items['schulung/vertraege.mp4'].message).toContain('Text aus vertraege.vtt');
      expect(items['schulung/vertraege.vtt']).toMatchObject({ status: 'skipped', message: 'Untertitel zum Video vertraege.mp4 – mit dem Video eingelesen' });
      expect(items['schulung/preise.srt']).toMatchObject({ status: 'imported' });
      expect(items['schulung/ohne.mp4']).toMatchObject({ status: 'skipped', message: 'Video ohne Untertitel – Transkription nicht eingerichtet (TRANSCRIBE_CMD), übersprungen' });

      const chunks = (await call('GET', '/metadata/chunks?limit=200', undefined, 'u-leser')).json.items;
      const find = (t: string) => chunks.find((c: any) => c.text.includes(t));
      expect(find('Kündigen Sie den Vertrag über Beenden')).toMatchObject({ format: 'mp4', locator: { time: '01:31' } });
      expect(find('Preise ändern Sie über Bearbeiten')).toMatchObject({ format: 'subtitles', locator: { time: '02:10' } });
      const subs = (await call('GET', '/metadata/chunks?format=subtitles&limit=50', undefined, 'u-leser')).json.items;
      expect(subs.length).toBeGreaterThan(0);
      expect(subs.every((c: any) => c.format === 'subtitles')).toBe(true);
      const src = (await call('GET', '/sources')).json.find((s: any) => s.path === 'schulung/vertraege.mp4');
      const orig = await call('GET', `/source-revisions/${src.revisions[0].id}/original`, undefined, 'u-leser');
      expect(orig.headers['content-type']).toContain('video/mp4');
      expect((await call('GET', '/settings')).json.import.allowedExtensions).toEqual(expect.arrayContaining(['.mp4', '.vtt', '.srt']));
      // Fragen mit Belegen: Fundstelle Zeitmarke
      const a = (await call('POST', '/metadata/ask', { question: 'Wie kündige ich den Vertrag?', filters: { format: 'mp4' } }, 'u-leser')).json;
      expect(a.sources[0]).toMatchObject({ path: 'schulung/vertraege.mp4', locator: { time: '01:31' } });
    } finally {
      await built.app.close();
    }
  });

  it('[T-273] Lokale Werkzeuge: Transkription, Standbilder mit rotem Rahmen (F-26), Texterkennung gescannter PDF-Seiten', async () => {
    const tools = path.join(dataDir, 'werkzeuge');
    fs.mkdirSync(tools, { recursive: true });
    // Bilder für die Ersatz-ffmpeg: Bild 3 mit Änderung unten rechts
    const pngs = [frame(), frame(), frame([200, 120, 60, 40])];
    pngs.forEach((c, i) => fs.writeFileSync(path.join(tools, `bild${i}.png`), c.toBuffer('image/png')));
    fs.writeFileSync(path.join(tools, 'transcribe.mjs'), `import fs from 'node:fs';\nconst [input, output] = process.argv.slice(2);\nif (!fs.readFileSync(input, 'utf8').includes('Video')) process.exit(2);\nfs.writeFileSync(output + '.vtt', 'WEBVTT\\n\\n00:00:03.000 --> 00:00:07.000\\nReifen bestellen Sie über den Warenkorb.\\n');\n`);
    const ffmpeg = path.join(tools, 'ffmpeg');
    fs.writeFileSync(ffmpeg, `#!${process.execPath}\nconst fs = require('node:fs');\nconst path = require('node:path');\nconst out = process.argv.at(-1);\nfor (let i = 0; i < 3; i++) fs.copyFileSync(path.join(${JSON.stringify(tools)}, 'bild' + i + '.png'), out.replace('%05d', String(i + 1).padStart(5, '0')));\n`);
    fs.chmodSync(ffmpeg, 0o755);
    fs.writeFileSync(path.join(tools, 'ocr.mjs'), `import fs from 'node:fs';\nconst [input] = process.argv.slice(2);\nif (fs.statSync(input).size < 100) process.exit(3);\nconsole.log('Gescannte Anleitung\\n\\nDen Liefertermin ändern Sie in der Auftragsansicht.');\n`);
    const node = JSON.stringify(process.execPath);
    const built = await build('werkzeuge', {
      transcribeCmd: `${node} "${path.join(tools, 'transcribe.mjs')}" {input} {output}`,
      ocrCmd: `${node} "${path.join(tools, 'ocr.mjs')}" {input}`,
      ffmpeg,
    });
    const call = client(built);
    try {
      expect((await call('GET', '/metadata/media-tools', undefined, 'u-leser')).json).toEqual({ transcribe: true, ocr: true, stills: true, redact: false });
      const scan = await renderPdf({ content: [{ image: frame([20, 20, 100, 40]).toDataURL('image/png'), width: 300 }] });
      const z = new JSZip();
      z.file('schulung/reifen.mp4', Buffer.from('Video Reifen'));
      z.file('handbuch/scan.pdf', scan);
      const up = await importFile(built, 'w.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const items = Object.fromEntries((await call('GET', `/imports/${up.id}`)).json.items.map((i: any) => [i.path, i]));
      expect(items['schulung/reifen.mp4'].status).toBe('imported');
      expect(items['schulung/reifen.mp4'].message).toContain('Text per Transkription erstellt (bitte prüfen)');
      expect(items['schulung/reifen.mp4'].message).toContain('2 Standbilder');
      expect(items['handbuch/scan.pdf'].status).toBe('imported');
      expect(items['handbuch/scan.pdf'].message).toContain('Seite per Texterkennung gelesen (bitte prüfen): 1');

      const chunks = (await call('GET', '/metadata/chunks?limit=200', undefined, 'u-leser')).json.items;
      expect(chunks.find((c: any) => c.text.includes('Reifen bestellen Sie'))).toMatchObject({ format: 'mp4', locator: { time: '00:03' } });
      expect(chunks.find((c: any) => c.text.includes('Liefertermin ändern Sie'))).toMatchObject({ format: 'pdf', locator: { page: 1 } });
      // Standbild bei 00:04 mit rotem Rahmen um den geänderten Bereich
      const src = (await call('GET', '/sources')).json.find((s: any) => s.path === 'schulung/reifen.mp4');
      const raw = (await call('GET', `/source-revisions/${src.revisions[0].id}/raw`, undefined, 'u-leser')).body;
      const shas = [...raw.matchAll(/!\[([^\]]*)\]\(media:([0-9a-f]{64})\)/g)];
      expect(shas.map((m) => m[1])).toEqual(['Standbild bei 00:00', 'Standbild bei 00:04 – Änderung rot markiert']);
      const img = await call('GET', `/media/${shas[1][2]}`, undefined, 'u-leser');
      expect(img.status).toBe(200);
      const { loadImage } = await import('@napi-rs/canvas');
      const pic = await loadImage(img.raw);
      const c = createCanvas(pic.width, pic.height);
      const g = c.getContext('2d');
      g.drawImage(pic, 0, 0);
      const red = [...g.getImageData(0, 0, pic.width, pic.height).data].reduce((n, v, i, a) => (i % 4 === 0 && v > 200 && a[i + 1] < 60 && a[i + 2] < 60 ? n + 1 : n), 0);
      expect(red).toBeGreaterThan(100);
    } finally {
      await built.app.close();
    }
  });
});
