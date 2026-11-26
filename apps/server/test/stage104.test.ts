// Etappe 104: Code-Review der Korrekturen aus den Etappen 92–94
import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { sha256 } from '../src/domain/similarity.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const WORDS: [number, number, number, number, number, string][] = [
  [1, 40, 40, 110, 20, 'Bearbeiter:'], [1, 160, 40, 50, 20, 'Max'], [1, 220, 40, 130, 20, 'Mustermann'],
  [2, 40, 100, 90, 20, 'User-ID:'], [2, 140, 100, 100, 20, 'D4711XY'],
];
const TSV = ['level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext',
  ...WORDS.map(([line, x, y, w, h, t], i) => `5\t1\t1\t1\t${line}\t${i + 1}\t${x}\t${y}\t${w}\t${h}\t95.5\t${t}`)].join('\n');

describe('Etappe 104', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const fake = path.join(dataDir, 'fake-ocr.mjs');
  fs.writeFileSync(fake, `process.stdout.write(${JSON.stringify(TSV)});\n`);

  it('[T-440] Bilder: erneute Erkennung ohne verfügbare oder mit gescheiterter Texterkennung behält die unkenntlich gemachten Stellen', async () => {
    const built = await freshDatabase(dataDir, 'e104a').then((database) => buildApp({
      dataDir, database, logger: false, webDist: null, authMode: 'demo',
      mediaTools: { transcribeCmd: null, ocrCmd: null, ocrBoxesCmd: `"${process.execPath}" "${fake}" {input}`, ffmpeg: null, timeoutMs: 30_000 },
    } as any));
    const call = client(built);
    try {
      const c = createCanvas(800, 400);
      c.getContext('2d').fillRect(0, 0, 800, 400);
      const shot = c.toBuffer('image/png');
      const z = new JSZip();
      z.file('bilder/vertrag.png', shot);
      await importFile(built, 'b.zip', await z.generateAsync({ type: 'nodebuffer' }));
      await built.ctx.jobs.idle();
      const sha = sha256(shot);
      const first = (await call('GET', `/image-archive/${sha}/redaction`)).json;
      expect(first).toMatchObject({ status: 'done', active: 2 });
      // Werkzeug fehlt (z. B. nach einem Update): Stellen bleiben, Status sagt es
      (built.ctx.config.mediaTools as any).ocrBoxesCmd = null;
      const missing = (await call('POST', `/image-archive/${sha}/redaction/detect`, {}, 'u-redaktion')).json;
      expect(missing).toMatchObject({ status: 'unavailable', active: 2 });
      // Werkzeug scheitert: ebenso
      (built.ctx.config.mediaTools as any).ocrBoxesCmd = `"${process.execPath}" -e "process.exit(3)" {input}`;
      const failed = (await call('POST', `/image-archive/${sha}/redaction/detect`, {}, 'u-redaktion')).json;
      expect(failed).toMatchObject({ status: 'failed', active: 2 });
    } finally {
      await built.app.close();
    }
  });

  it('[T-441] Transaktion: wirft eine Nach-Commit-Funktion, gilt die festgeschriebene Transaktion trotzdem als gelungen, und die übrigen laufen', async () => {
    const built = await freshDatabase(dataDir, 'e104b').then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));
    try {
      const ran: string[] = [];
      const err = console.error;
      console.error = () => undefined;
      const result = await built.ctx.db.tx(async () => {
        built.ctx.db.afterCommit(() => { throw new Error('Hook kaputt'); });
        built.ctx.db.afterCommit(() => ran.push('zweiter'));
        return 'ok';
      }).finally(() => { console.error = err; });
      expect(result).toBe('ok');
      expect(ran).toEqual(['zweiter']);
    } finally {
      await built.app.close();
    }
  });
});
