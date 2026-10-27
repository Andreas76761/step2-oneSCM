import fs from 'node:fs';
import path from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { newId } from '../src/db.js';
import { sha256 } from '../src/domain/similarity.js';
import { isLocalUrl } from '../src/llm.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

// Texterkennung (Tesseract-TSV) mit einem Namen auf einem 800×400-Bild
const TSV = ['level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext',
  '5\t1\t1\t1\t1\t1\t40\t40\t110\t20\t95.5\tBearbeiter:', '5\t1\t1\t1\t1\t2\t160\t40\t50\t20\t95.5\tMax', '5\t1\t1\t1\t1\t3\t220\t40\t130\t20\t95.5\tMustermann'].join('\n');
const HEAD = 'Summary,Issue key,Issue Type,Status,Component/s,Created,Custom field (Stream),Custom field (Production Date),Description';

describe('Etappe 93', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const fake = path.join(dataDir, 'fake-ocr.mjs');
  fs.writeFileSync(fake, `process.stdout.write(${JSON.stringify(TSV)});\n`);

  it('[T-414] Lokale Adressen: private Bereiche nur als echte IPv4-Adresse (Einheit)', () => {
    for (const u of ['http://localhost:8081', 'http://127.0.0.1:11434', 'http://10.0.0.5', 'http://192.168.1.20:8010', 'http://172.20.1.1', 'http://[::1]:8081', 'http://lt.local', 'http://app.localhost'])
      expect(isLocalUrl(u), u).toBe(true);
    for (const u of ['https://10.llm-proxy.example.com', 'http://127.attacker.net', 'http://192.168.foo.com', 'http://172.16.evil.org', 'https://api.example.com', 'http://172.32.0.1', 'nicht-url'])
      expect(isLocalUrl(u), u).toBe(false);
  });

  it('[T-415] Triage-Entscheidung bei großen Läufen, gelöschte Triage-Labels bleiben weg, Entscheidung nur für frühere Vorschläge, gemerkte Zuordnung, Backlog → produktiv, Bild ohne Maße', async () => {
    const database = await freshDatabase(dataDir, 'e93');
    const built = await buildApp({
      dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
      mediaTools: { transcribeCmd: null, ocrCmd: null, ocrBoxesCmd: `"${process.execPath}" "${fake}" {input}`, ffmpeg: null, timeoutMs: 30_000 },
    } as any);
    const call = client(built);
    const db = built.ctx.db;
    try {
      await importFile(built, 'gliederung.md', `${FM}# 3. Vertragsverwaltung\n\n## 3.1 Vertrag anlegen\n\nÖffnen Sie Contracts und klicken Sie auf Neu (ab PI 12).\n\n# 4. Abrechnung\n\n## 4.1 Rechnung prüfen\n\nSie prüfen die Rechnung im Menü Abrechnung.\n`);
      const projectId = (await call('GET', '/projects')).json[0].id;
      const snippet = (await db.get<any>("SELECT id, chapter_id, norm_hash FROM text_snippets WHERE text LIKE '%Contracts und klicken%'"))!;
      const chapters = await db.all("SELECT id, title FROM chapters WHERE project_id = ? AND title IN ('3. Vertragsverwaltung', '4. Abrechnung')", projectId);
      const other = chapters.find((c: any) => c.id !== snippet.chapter_id)!.id;

      // Entscheidung in einem Lauf mit mehr als 500 Ergebnissen: Antwort ist das entschiedene Ergebnis
      const runId = newId('trg');
      await db.run("INSERT INTO triage_runs (id, project_id, scope, status, stats, started_by, started_at) VALUES (?, ?, 'all', 'finished', '{}', 'u-admin', ?)", runId, projectId, new Date().toISOString());
      const insert = (id: string, at: string, status = 'proposed', chapterId: string | null = other) => db.run(
        `INSERT INTO triage_results (id, run_id, project_id, snippet_id, labels, chapter_before, chapter_id, placement, confidence, review, reasons, status, created_at)
         VALUES (?, ?, ?, ?, '[]', ?, ?, 'move', 0.9, 0, '[]', ?, ?)`, id, runId, projectId, snippet.id, snippet.chapter_id, chapterId, status, at);
      await insert('trr_target', '2026-01-01T00:00:00.000Z');
      for (let i = 0; i < 520; i++) await insert(`trr_x${i}`, '2026-01-02T00:00:00.000Z', 'superseded');
      const dec = await call('POST', '/triage/results/trr_target/decision', { decision: 'reject' }, 'u-redaktion');
      expect(dec.status).toBe(200);
      expect(dec.json).toMatchObject({ id: 'trr_target', status: 'rejected' });
      await db.run("DELETE FROM triage_results WHERE run_id = ? AND id LIKE 'trr_x%'", runId);

      // Entscheidung „verwerfen“ gilt nur für Vorschläge, die es bei der Entscheidung schon gab
      await insert('trr_before', '2026-03-01T00:00:00.000Z');
      await insert('trr_after', '2026-03-03T00:00:00.000Z');
      await db.run(
        `INSERT INTO agent_decisions (id, project_id, agent, question, options, status, decision, decision_key, created_by, created_at, decided_by, decided_at)
         VALUES ('agd_t', ?, 'orchestrator', '2 Vorschläge übernehmen?', '[]', 'decided', 'verwerfen', 'triage:proposals', 'orchestrator', '2026-03-01T12:00:00.000Z', 'u-fachpruefung', '2026-03-02T00:00:00.000Z')`, projectId,
      );
      expect((await call('POST', '/agents/orchestrator/plan', {}, 'u-redaktion')).status).toBe(200);
      const st = async (id: string) => (await db.get('SELECT status FROM triage_results WHERE id = ?', id))?.status;
      expect(await st('trr_before')).toBe('rejected');
      expect(await st('trr_after')).toBe('proposed');
      await db.run("UPDATE triage_results SET status = 'rejected' WHERE id = 'trr_after'");

      // gemerkte Zuordnung: übernommen nach „4. Abrechnung“, von Hand zurück verschoben → kein neuer Vorschlag
      await insert('trr_acc', '2026-03-04T00:00:00.000Z', 'accepted');
      await db.run("UPDATE triage_results SET decided_at = '2026-03-04T00:00:00.000Z' WHERE id = 'trr_acc'");
      const run = (await call('POST', '/triage/runs', { scope: 'all' }, 'u-redaktion')).json;
      const proposals = (await call('GET', `/triage/results?runId=${run.id}`)).json.items.filter((r: any) => r.snippetId === snippet.id && r.status === 'proposed');
      expect(proposals.filter((r: any) => r.target.chapterId === other)).toEqual([]);

      // gelöschtes Triage-Label legt der nächste Lauf nicht wieder an; von Hand angelegt gibt es es wieder
      const lbl = (await db.get<any>("SELECT id, code, label_group FROM metadata_labels WHERE project_id = ? AND origin = 'triage' AND code LIKE 'version.%' ORDER BY code LIMIT 1", projectId))!;
      expect(lbl).toBeTruthy();
      expect((await call('DELETE', `/metadata/labels/${lbl.id}`)).status).toBe(200);
      await call('POST', '/triage/runs', { scope: 'all' }, 'u-redaktion');
      expect((await db.all("SELECT origin FROM metadata_labels WHERE project_id = ? AND code = ?", projectId, lbl.code)).map((r: any) => r.origin)).toEqual(['deleted']);
      expect(Number((await db.get('SELECT COUNT(*) AS n FROM metadata_chunk_labels WHERE label_id = ?', lbl.id))?.n)).toBe(0);
      const again = await call('POST', '/metadata/labels', { code: lbl.code, group: lbl.label_group, nameDe: 'Wieder da', nameEn: 'Back' });
      expect(again.status).toBe(201);
      expect(again.json).toMatchObject({ code: lbl.code, nameDe: 'Wieder da' });

      // Backlog-Ticket geht zwischen zwei Abgleichen direkt produktiv → Pipeline, bereit
      await importFile(built, 'jira.csv', Buffer.from([HEAD, 'Vertrag anlegen mit Vorlage,ONESCM-2,Story,PI Backlog,Contracts,02.10.2026,Stream B,,Idee'].join('\n')));
      await call('POST', '/work-areas/sync-jira', {}, 'u-redaktion');
      await importFile(built, 'jira.csv', Buffer.from([HEAD, 'Vertrag anlegen mit Vorlage,ONESCM-2,Story,Fertig,Contracts,02.10.2026,Stream B,01.02.2026,Idee'].join('\n')));
      await call('POST', '/work-areas/sync-jira', {}, 'u-redaktion');
      expect(await db.get("SELECT area, state FROM work_items WHERE jira_key = 'ONESCM-2'")).toMatchObject({ area: 'pipeline', state: 'ready' });

      // Bild, dessen Maße beim Hochladen nicht erkannt wurden: Stellen trotzdem mit gültigen Koordinaten
      const c = createCanvas(800, 400);
      c.getContext('2d').fillRect(0, 0, 10, 10);
      const shot = c.toBuffer('image/png');
      const z = new JSZip();
      z.file('bilder/maske.png', shot);
      await importFile(built, 'b.zip', await z.generateAsync({ type: 'nodebuffer' }));
      await built.ctx.jobs.idle();
      const sha = sha256(shot);
      await db.run('UPDATE media_assets SET width = NULL, height = NULL WHERE sha256 = ?', sha);
      const red = (await call('POST', `/image-archive/${sha}/redaction/detect`, {}, 'u-redaktion')).json;
      expect(red.regions.length).toBeGreaterThan(0);
      for (const r of red.regions) for (const k of ['x', 'y', 'w', 'h']) expect(Number.isFinite(r[k]), `${k}=${r[k]}`).toBe(true);

      // Orchestrator: auch Kapitel nach den ersten 50 bekommen eine Aufgabe, wenn Standardablauf oder Ausnahmen fehlen
      const full = (n: number) => `# ${n}. Thema ${n}\n\n## ${n}.1 Ablauf ${n}\n\n1. Öffnen Sie Bereich ${n}.\n2. Klicken Sie auf Speichern.\n\nWenn die Frist abgelaufen ist, ist eine Änderung nicht möglich (Thema ${n}).\n`;
      const thin = (n: number) => `# ${n}. Thema ${n}\n\n## ${n}.1 Begriff ${n}\n\nEin Begriff ${n} beschreibt den Gegenstand ${n} im System.\n`;
      await importFile(built, 'viele.md', `${FM}${Array.from({ length: 50 }, (_, i) => full(i + 10)).join('\n')}\n${[60, 61, 62].map(thin).join('\n')}`);
      const plan = (await call('POST', '/agents/orchestrator/plan', {}, 'u-redaktion')).json;
      const titles = plan.plan.filter((p: any) => p.key.startsWith('chapter:detail:')).map((p: any) => p.title);
      for (const n of [60, 61, 62]) expect(titles.some((t: string) => t.startsWith(`${n}. Thema ${n}:`)), `Kapitel ${n}`).toBe(true);
    } finally {
      await built.app.close();
    }
  });
});
