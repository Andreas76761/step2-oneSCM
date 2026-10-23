import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { cleanRegion, findRegions, parseOcrTsv } from '../src/domain/imageRedaction.js';
import { sha256 } from '../src/domain/similarity.js';
import { loadMedia } from '../src/services/media.js';
import { ocrBoxesCommand } from '../src/services/mediaTools.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

// Wörter wie Tesseract-TSV (level page block par line word left top width height conf text) auf einem 800×400-Bild
const WORDS: [number, number, number, number, number, string][] = [
  [1, 40, 40, 110, 20, 'Bearbeiter:'], [1, 160, 40, 50, 20, 'Max'], [1, 220, 40, 130, 20, 'Mustermann'],
  [2, 40, 100, 90, 20, 'User-ID:'], [2, 140, 100, 100, 20, 'D4711XY'],
  [3, 40, 160, 40, 20, 'FIN'], [3, 90, 160, 220, 20, 'WDD2050421F123456'],
  [4, 40, 220, 130, 20, 'Hauptstraße'], [4, 180, 220, 30, 20, '12,'], [4, 220, 220, 60, 20, '70173'], [4, 290, 220, 110, 20, 'Stuttgart'],
  [5, 40, 300, 90, 20, 'Vertrag'], [5, 140, 300, 90, 20, 'anlegen'],
];
const TSV = ['level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext',
  '1\t1\t0\t0\t0\t0\t0\t0\t800\t400\t-1\t',
  ...WORDS.map(([line, x, y, w, h, t], i) => `5\t1\t1\t1\t${line}\t${i + 1}\t${x}\t${y}\t${w}\t${h}\t95.5\t${t}`)].join('\n');

/** Screenshot mit Streifen (damit das Verpixeln sichtbar wird) */
function screenshot(seed = 0) {
  const c = createCanvas(800, 400);
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 800, 400);
  for (let x = 0; x < 800; x += 4) {
    g.fillStyle = (x / 4 + seed) % 2 ? '#000000' : '#ffffff';
    g.fillRect(x, 0, 2, 280);
  }
  return c.toBuffer('image/png');
}
const pixel = async (buf: Buffer, x: number, y: number) => {
  const img = await loadImage(buf);
  const c = createCanvas(img.width, img.height);
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  return [...g.getImageData(x, y, 1, 1).data];
};

describe('Etappe 42', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const fake = path.join(dataDir, 'fake-ocr.mjs');
  fs.writeFileSync(fake, `process.stdout.write(${JSON.stringify(TSV)});\n`);
  const tools = (ocrBoxesCmd: string | null) => ({ transcribeCmd: null, ocrCmd: null, ocrBoxesCmd, ffmpeg: null, timeoutMs: 30_000 });
  const build = (name: string, ocr = true) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
    mediaTools: tools(ocr ? `"${process.execPath}" "${fake}" {input}` : null),
  } as any));

  it('[T-288] Wortpositionen aus der Texterkennung → Stellen mit Name, User-ID, FIN und Adresse; Feldbezeichnung bleibt lesbar (Einheit)', () => {
    const words = parseOcrTsv(TSV);
    expect(words).toHaveLength(WORDS.length);
    const regions = findRegions(words, 800, 400);
    expect(regions.map((r) => r.kind)).toEqual(['name', 'user_id', 'vin', 'address']);
    expect(regions.every((r) => r.active && r.source === 'ocr')).toBe(true);
    // Name: nur „Max Mustermann“, nicht „Bearbeiter:“ (x ab 160 px minus Rand)
    const name = regions[0];
    expect(name.x * 800).toBeGreaterThan(150);
    expect(name.x * 800).toBeLessThan(160);
    expect((name.x + name.w) * 800).toBeGreaterThanOrEqual(350);
    // Klartext steht nie in der Stelle
    expect(JSON.stringify(regions)).not.toMatch(/Mustermann|D4711XY|WDD2050421F123456|Hauptstraße/);
    expect(regions[2].label).toBe('WD…56');
    // Namensliste aus den Einstellungen
    expect(findRegions(parseOcrTsv('5\t1\t1\t1\t1\t1\t10\t10\t80\t20\t90\tAnna\n5\t1\t1\t1\t1\t2\t100\t10\t80\t20\t90\tBeispiel'), 400, 100, { names: ['Anna Beispiel'] })[0].kind).toBe('name');
    expect(cleanRegion({ x: 0.9, y: 0.9, w: 0.5, h: 0.5 })).toEqual({ x: 0.9, y: 0.9, w: 0.1, h: 0.1 });
    expect(cleanRegion({ x: 0.1, y: 0.1, w: 0.001, h: 0.2 })).toBeNull();
    // Befehl aus Tesseract ableiten
    expect(ocrBoxesCommand(tools(null) as any)).toBeNull();
    expect(ocrBoxesCommand({ ...tools(null), ocrCmd: 'tesseract {input} stdout -l deu+eng' } as any)).toBe('tesseract {input} stdout -l deu+eng tsv');
  });

  it('[T-289] Screenshot einlesen → automatisch unkenntlich; ausschalten zeigt das Original, einzelne und manuelle Stellen; Original nur mit Bearbeitungsrecht', async () => {
    const built = await build('unkenntlich');
    const call = client(built);
    try {
      const shot = screenshot();
      const z = new JSZip();
      z.file('bilder/vertrag.png', shot);
      await importFile(built, 'b.zip', await z.generateAsync({ type: 'nodebuffer' }));
      await built.ctx.jobs.idle();
      const sha = sha256(shot);
      expect((await call('GET', '/metadata/media-tools', undefined, 'u-leser')).json.redact).toBe(true);
      let red = (await call('GET', `/image-archive/${sha}/redaction`, undefined, 'u-leser')).json;
      expect(red).toMatchObject({ available: true, status: 'done', enabled: true, active: 4 });
      expect(red.redactedSha).toMatch(/^[a-f0-9]{64}$/);

      // ausgeliefert wird die verpixelte Kopie, außerhalb der Stellen unverändert
      const served = (await call('GET', `/media/${sha}`, undefined, 'u-leser')).raw;
      expect(sha256(served)).toBe(red.redactedSha);
      expect(await pixel(served, 600, 350)).toEqual(await pixel(shot, 600, 350));
      const inName = [[170, 45], [171, 45], [172, 45], [173, 45]];
      const changed = await Promise.all(inName.map(async ([x, y]) => (await pixel(served, x, y)).join() !== (await pixel(shot, x, y)).join()));
      expect(changed.some(Boolean)).toBe(true);
      // auch genau diese Fassung (?original=1) ist unkenntlich; das Original nur mit Bearbeitungsrecht
      expect(sha256((await call('GET', `/media/${sha}?original=1`, undefined, 'u-leser')).raw)).toBe(red.redactedSha);
      expect((await call('GET', `/media/${sha}?original=1&unredacted=1`, undefined, 'u-leser')).status).toBe(403);
      expect(sha256((await call('GET', `/media/${sha}?original=1&unredacted=1`, undefined, 'u-redaktion')).raw)).toBe(sha);
      // die Kopie ist kein eigenes Bild im Archiv
      let arch = (await call('GET', '/image-archive')).json;
      expect(arch.items).toHaveLength(1);
      expect(arch.items[0].redaction).toMatchObject({ enabled: true, active: 4 });
      expect(arch.items[0].checks.map((c: any) => c.rule)).toContain('privacy_redacted');

      // Leserecht darf nicht ändern
      expect((await call('PATCH', `/image-archive/${sha}/redaction`, { enabled: false }, 'u-leser')).status).toBe(403);
      // rückgängig: Original wird ausgeliefert, Prüfregel warnt
      red = (await call('PATCH', `/image-archive/${sha}/redaction`, { enabled: false }, 'u-redaktion')).json;
      expect(red).toMatchObject({ enabled: false, redactedSha: null, active: 4 });
      expect(sha256((await call('GET', `/media/${sha}`, undefined, 'u-leser')).raw)).toBe(sha);
      arch = (await call('GET', '/image-archive')).json;
      expect(arch.items[0].checks.find((c: any) => c.rule === 'privacy_visible').severity).toBe('warning');

      // wieder an, eine Stelle aus, eine manuelle Stelle dazu
      red = (await call('PATCH', `/image-archive/${sha}/redaction`, { enabled: true, regions: [{ id: 'r4', active: false }], add: [{ x: 0.75, y: 0.55, w: 0.2, h: 0.1 }] }, 'u-redaktion')).json;
      expect(red.regions.map((r: any) => [r.id, r.kind, r.active])).toEqual([['r1', 'name', true], ['r2', 'user_id', true], ['r3', 'vin', true], ['r4', 'address', false], ['r5', 'manual', true]]);
      const again = (await call('GET', `/media/${sha}`, undefined, 'u-leser')).raw;
      expect((await pixel(again, 701, 240)).join()).not.toBe((await pixel(shot, 701, 240)).join()); // manuelle Stelle (grau gemittelt)
      expect(await pixel(again, 240, 225)).toEqual(await pixel(shot, 240, 225)); // Adresse ausgeschaltet
      expect((await call('PATCH', `/image-archive/${sha}/redaction`, { remove: ['r1'] }, 'u-redaktion')).status).toBe(400); // erkannte Stelle nur ausschalten
      expect((await call('PATCH', `/image-archive/${sha}/redaction`, { add: [{ x: 0.1, y: 0.1, w: 0, h: 0.1 }] }, 'u-redaktion')).status).toBe(400);
      // erneut erkennen: manuelle Stelle bleibt, Schalter bleibt
      red = (await call('POST', `/image-archive/${sha}/redaction/detect`, {}, 'u-redaktion')).json;
      expect(red.regions.filter((r: any) => r.source === 'manual')).toHaveLength(1);
      expect(red).toMatchObject({ enabled: true, active: 5 });

      // Export enthält die unkenntliche Fassung
      await importFile(built, 'k.md', `${FM}# 1. Vertrag\n\nÖffnen Sie die Liste.\n\n![Vertragsliste](bilder/vertrag.png)\n`);
      await built.ctx.jobs.idle();
      const embedded = await loadMedia(built.ctx, [`![Vertragsliste](media:${sha})`]);
      expect(sha256(embedded.get(sha)!.data)).toBe(red.redactedSha);
      // neue Fassung: manuelle Stellen und Schalter werden übernommen, Erkennung läuft für die neue Fassung
      const v2 = screenshot(1);
      const boundary = '----t42';
      const body = Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="v2.png"\r\nContent-Type: image/png\r\n\r\n`), v2, Buffer.from(`\r\n--${boundary}--\r\n`)]);
      const up = await built.app.inject({ method: 'POST', url: `/api/v1/image-archive/${sha}/versions`, payload: body, headers: { 'content-type': `multipart/form-data; boundary=${boundary}`, 'x-user-id': 'u-redaktion' } });
      expect(up.statusCode).toBe(201);
      await built.ctx.jobs.idle();
      const red2 = (await call('GET', `/image-archive/${sha256(v2)}/redaction`)).json;
      expect(red2).toMatchObject({ status: 'done', enabled: true, active: 5 });
      expect(sha256((await call('GET', `/media/${sha}`, undefined, 'u-leser')).raw)).toBe(red2.redactedSha);
      // SVG: nicht möglich
      const svgs = (await call('GET', '/media')).json.filter((m: any) => m.mime === 'image/svg+xml');
      expect(svgs).toHaveLength(0);
      expect((await call('GET', '/media')).json.some((m: any) => m.sha256 === red2.redactedSha)).toBe(false);
    } finally {
      await built.app.close();
    }
  });

  it('[T-290] Mehrere Labels (Domäne, Rolle, Gliederung) und Kapitel je Bild, Filter, Deckungsmatrix je Gliederungspunkt; ohne Texterkennung nur manuell', async () => {
    const built = await build('labels', false);
    const call = client(built);
    try {
      const shot = screenshot();
      const z = new JSZip();
      z.file('bilder/a.png', shot);
      await importFile(built, 'b.zip', await z.generateAsync({ type: 'nodebuffer' }));
      await importFile(built, 'k.md', `${FM}# 1. Vertrag anlegen\n\nText.\n\n# 2. Vertrag kündigen\n\nText.\n`);
      await built.ctx.jobs.idle();
      const sha = sha256(shot);
      const labels = (await call('GET', '/metadata/labels')).json.items ?? (await call('GET', '/metadata/labels')).json;
      const pick = (group: string) => labels.filter((l: any) => (l.group ?? l.labelGroup) === group);
      const [o1, o2] = pick('outline');
      const role = pick('role')[0];
      let domain = pick('domain')[0];
      if (!domain) domain = (await call('POST', '/metadata/labels', { group: 'domain', code: 'domain.contracts', nameDe: 'Verträge', nameEn: 'Contracts' })).json;
      expect(o1 && o2 && role && domain).toBeTruthy();
      const chapters = (await call('GET', '/chapters')).json;
      const list = Array.isArray(chapters) ? chapters : chapters.items;
      const [c1, c2] = list;

      expect((await call('PATCH', `/image-archive/${sha}`, { labelIds: ['lbl_gibtsnicht'] }, 'u-redaktion')).status).toBe(400);
      expect((await call('PATCH', `/image-archive/${sha}`, { chapterIds: ['chp_gibtsnicht'] }, 'u-redaktion')).status).toBe(400);
      let it = (await call('PATCH', `/image-archive/${sha}`, { labelIds: [domain.id, role.id, o1.id, o2.id], chapterIds: [c1.id, c2.id], language: 'de' }, 'u-redaktion')).json;
      expect(it.labels.map((l: any) => l.id).sort()).toEqual([domain.id, role.id, o1.id, o2.id].sort());
      expect(it.chapters.map((c: any) => c.id)).toEqual([c1.id, c2.id]);
      expect(it.outline.id).toBe(o1.id); // erster Gliederungspunkt wird mitgeführt
      // bisherige Schnittstelle: outlineLabelId = null entfernt den Gliederungspunkt auch aus den Labels
      it = (await call('PATCH', `/image-archive/${sha}`, { outlineLabelId: null }, 'u-redaktion')).json;
      expect(it.outline).toBeNull();
      expect(it.labels.map((l: any) => l.id)).not.toContain(o1.id);
      it = (await call('PATCH', `/image-archive/${sha}`, { outlineLabelId: o1.id }, 'u-redaktion')).json;
      expect(it.labels.map((l: any) => l.id)).toContain(o1.id);

      expect((await call('GET', `/image-archive?labelId=${domain.id}`)).json.items).toHaveLength(1);
      expect((await call('GET', `/image-archive?chapterId=${c2.id}`)).json.items).toHaveLength(1);
      expect((await call('GET', `/image-archive?labelId=${pick('outline')[3]?.id ?? 'x'}`)).json.items).toHaveLength(0);
      const byOutline = (await call('GET', '/image-archive/coverage-matrix?rows=outline&dims=language')).json;
      expect(byOutline.rowsBy).toBe('outline');
      expect(byOutline.rows.map((r: any) => r.key).sort()).toEqual([o1.id, o2.id].sort());
      const byChapter = (await call('GET', '/image-archive/coverage-matrix?rows=chapter&dims=language')).json;
      expect(byChapter.rows.map((r: any) => r.key).sort()).toEqual([c1.id, c2.id].sort());

      // ohne Texterkennung: keine Erkennung, aber manuelle Stellen
      let red = (await call('GET', `/image-archive/${sha}/redaction`)).json;
      expect(red).toMatchObject({ available: false, status: 'none', regions: [] });
      red = (await call('POST', `/image-archive/${sha}/redaction/detect`, {}, 'u-redaktion')).json;
      expect(red.status).toBe('unavailable');
      red = (await call('PATCH', `/image-archive/${sha}/redaction`, { add: [{ x: 0.2, y: 0.1, w: 0.3, h: 0.1 }] }, 'u-redaktion')).json;
      expect(red).toMatchObject({ enabled: true, active: 1 });
      expect(sha256((await call('GET', `/media/${sha}`)).raw)).toBe(red.redactedSha);
    } finally {
      await built.app.close();
    }
  });
});
