import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { carryInactive, type RedactionRegion } from '../src/domain/imageRedaction.js';
import { sha256 } from '../src/domain/similarity.js';
import { detectDetail, detectLanguage, type TriageInput } from '../src/domain/triage.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const TSV = ['level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext',
  '5\t1\t1\t1\t1\t1\t40\t40\t110\t20\t95.5\tBearbeiter:', '5\t1\t1\t1\t1\t2\t160\t40\t50\t20\t95.5\tMax', '5\t1\t1\t1\t1\t3\t220\t40\t130\t20\t95.5\tMustermann'].join('\n');
const t = (text: string): TriageInput => ({ text, kind: 'paragraph', headingPath: [], path: 'x.md', sourceFormat: 'md', evidenceStatus: 'source_confirmed', marketCode: null, releaseCode: null, roles: [], divisions: [], jiraStatus: null });
const region = (x: number, active: boolean, kind: RedactionRegion['kind'] = 'name'): RedactionRegion => ({ id: 'r', x, y: 0.1, w: 0.2, h: 0.05, kind, label: 'M…', source: 'ocr', active });

describe('Etappe 94', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const fake = path.join(dataDir, 'fake-ocr.mjs');
  fs.writeFileSync(fake, `process.stdout.write(${JSON.stringify(TSV)});\n`);

  it('[T-416] Wortgrenzen mit Umlauten in der Triage; ausgeschaltete Stellen bleiben bei erneuter Erkennung aus (Einheit)', () => {
    // „öffnen Sie“ mitten im Satz und am Satzanfang (vorher nie erkannt)
    expect(detectDetail(t('Bitte öffnen Sie das Menü Verträge.')).codes).toEqual(['happy-path']);
    expect(detectDetail(t('Wählen Sie dann den Vertrag.')).codes).toEqual(['happy-path']);
    expect(detectLanguage('Ano, že je to pro nás nebo jako také dobré.').codes).toEqual(['cs']);
    // englische Texte bleiben englisch
    expect(detectLanguage('The contract is created and the dealer saves it for the customer.').codes).toEqual(['en']);

    // dieselbe Stelle (Überdeckung ab 50 %, gleiche Art) bleibt aus; andere Stellen bleiben an
    const prev = [region(0.2, false), region(0.6, true)];
    const found = [region(0.21, true), region(0.6, true), region(0.21, true, 'user_id'), region(0.9, true)];
    expect(carryInactive(found, prev).map((r) => r.active)).toEqual([false, true, true, true]);
    // manuelle Stellen spielen keine Rolle
    expect(carryInactive([region(0.2, true)], [{ ...region(0.2, false), source: 'manual' }])[0].active).toBe(true);
  });

  it('[T-417] Inhalts-Dashboard ohne ausgeschlossene Chunks, GOAL-Anteil „freigegeben“ höchstens 100 %, erneute Erkennung behält ausgeschaltete Stellen', async () => {
    const database = await freshDatabase(dataDir, 'e94');
    const built = await buildApp({
      dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
      mediaTools: { transcribeCmd: null, ocrCmd: null, ocrBoxesCmd: `"${process.execPath}" "${fake}" {input}`, ffmpeg: null, timeoutMs: 30_000 },
    } as any);
    const call = client(built);
    const db = built.ctx.db;
    try {
      await importFile(built, 'a.md', `${FM}# 3. Vertragsverwaltung\n\n## 3.1 Vertrag anlegen\n\n1. Öffnen Sie Contracts.\n2. Klicken Sie auf Neu.\n\n## 3.2 Vertrag kündigen\n\nWenn die Frist abgelaufen ist, ist eine Kündigung nicht möglich.\n`);
      await importFile(built, 'b.md', `${FM}# 4. Abrechnung\n\n## 4.1 Rechnung prüfen\n\nSie prüfen die Rechnung im Menü Abrechnung.\n`);
      // Dashboard: Gesamtzahlen der Labels nur über die gezählten Chunks
      const before = (await call('GET', '/triage/dashboard')).json.totals;
      const one = (await db.get<any>("SELECT id FROM text_snippets WHERE text LIKE '%Rechnung im Menü%'"))!;
      const labelsOfOne = Number((await db.get<any>('SELECT COUNT(*) AS n FROM metadata_chunk_labels WHERE snippet_id = ?', one.id))!.n);
      expect(labelsOfOne).toBeGreaterThan(0);
      await db.run("UPDATE text_snippets SET excluded_reason = 'Test' WHERE id = ?", one.id);
      const after = (await call('GET', '/triage/dashboard')).json.totals;
      expect(after.chunks).toBe(before.chunks - 1);
      expect(after.labelAssignments).toBe(before.labelAssignments - labelsOfOne);
      await db.run('UPDATE text_snippets SET excluded_reason = NULL WHERE id = ?', one.id);

      // GOAL: freigegebenes Kapitel, das danach abgelöst wurde, zählt nicht für den Anteil
      const chapters = (await call('GET', '/chapters')).json;
      const vertrag = chapters.find((c: any) => c.title === '3. Vertragsverwaltung').id;
      await approveChapter(call, vertrag);
      await db.run('UPDATE chapters SET history_at = ? WHERE id = ?', new Date().toISOString(), vertrag);
      const run = (await call('POST', '/agents/goal/runs', {}, 'u-redaktion')).json;
      const approved = run.results.find((r: any) => r.code === 'approved');
      expect(approved.value).toBeLessThanOrEqual(1);
      expect(approved.value).toBe(0);

      // erneute Erkennung: von Hand ausgeschaltete Stelle bleibt aus
      const c = createCanvas(800, 400);
      c.getContext('2d').fillRect(0, 0, 10, 10);
      const shot = c.toBuffer('image/png');
      const z = new JSZip();
      z.file('bilder/maske.png', shot);
      await importFile(built, 'bilder.zip', await z.generateAsync({ type: 'nodebuffer' }));
      await built.ctx.jobs.idle();
      const sha = sha256(shot);
      const red = (await call('GET', `/image-archive/${sha}/redaction`)).json;
      expect(red.regions.length).toBeGreaterThan(0);
      const off = red.regions[0];
      expect((await call('PATCH', `/image-archive/${sha}/redaction`, { regions: [{ id: off.id, active: false }] }, 'u-redaktion')).status).toBe(200);
      const again = (await call('POST', `/image-archive/${sha}/redaction/detect`, {}, 'u-redaktion')).json;
      const same = again.regions.find((r: any) => r.source === 'ocr' && r.kind === off.kind && Math.abs(r.x - off.x) < 0.01);
      expect(same).toMatchObject({ active: false });
    } finally {
      await built.app.close();
    }
  });
});
