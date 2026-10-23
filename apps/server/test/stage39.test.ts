import fs from 'node:fs';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { aggregate, itemsFromJson, itemsFromTable, matches, scoreItem } from '../src/domain/evaluation.js';
import { parseCsv } from '../src/domain/tabular.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const CSV = [
  'Frage;Erwartete Quelle;Stichworte;Keine Antwort',
  'Wie kündige ich einen Vertrag?;handbuch/vertraege.md › Vertrag kündigen;Beenden|Monatsende;',
  'Wie lege ich ein Reifenpaket an?;reifen.md;Produkte;',
  'Wie verlängere ich einen Vertrag?;schulung/reifen.md;;',
  'Welche Zollvorschriften gelten in Brasilien?;;;ja',
].join('\r\n');

describe('Etappe 39', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-275] Bewertung je Testfrage und Kennzahlen: Treffer@k, MRR, Beleg, Stichworte, Lückenfragen; Einlesen aus Tabelle und JSON (Einheit)', () => {
    const found = { path: 'Handbuch/Verträge.md', headingPath: ['Verträge verwalten', 'Vertrag kündigen'] };
    expect(matches(found, { path: 'handbuch/vertrage.md' })).toBe(true); // Groß-/Kleinschreibung und Umlaute egal
    expect(matches(found, { path: 'verträge', heading: 'kündigen' })).toBe(true);
    expect(matches(found, { path: 'verträge', heading: 'verlängern' })).toBe(false);
    expect(matches(found, {})).toBe(false);

    const other = { path: 'schulung/reifen.md', headingPath: ['Reifen'] };
    const item = { question: 'Wie kündige ich?', expected: [{ path: 'verträge' }], keywords: ['Beenden', 'Monatsende'], expectNoAnswer: false };
    const a = scoreItem(item, { retrieved: [other, found], sources: [found], answerText: 'Klicken Sie auf Beenden.', answered: true });
    expect(a).toEqual({ rank: 2, cited: true, answered: true, keywordHits: 1, keywordTotal: 2, passed: true });
    const b = scoreItem(item, { retrieved: [other], sources: [other], answerText: 'Beenden zum Monatsende.', answered: true });
    expect(b).toMatchObject({ rank: null, cited: false, passed: false });
    const gap = { question: 'Zoll in Brasilien?', expected: [], keywords: [], expectNoAnswer: true };
    const c = scoreItem(gap, { retrieved: [], sources: [], answerText: '', answered: false });
    expect(c.passed).toBe(true);
    const m = aggregate([{ item, score: a, ms: 10 }, { item, score: b, ms: 30 }, { item: gap, score: c, ms: 20 }]);
    expect(m).toMatchObject({ questions: 3, passed: 2, passRate: 0.667, withSources: 2, hitAt1: 0, hitAt3: 0.5, hitAt6: 0.5, mrr: 0.25, citedRate: 0.5, keywordCoverage: 0.75, noAnswerItems: 1, noAnswerAccuracy: 1, avgMs: 20 });

    const items = itemsFromTable(parseCsv(CSV));
    expect(items).toHaveLength(4);
    expect(items[0]).toEqual({ question: 'Wie kündige ich einen Vertrag?', expected: [{ path: 'handbuch/vertraege.md', heading: 'Vertrag kündigen' }], keywords: ['Beenden', 'Monatsende'], expectNoAnswer: false, note: null });
    expect(items[3]).toMatchObject({ expected: [], expectNoAnswer: true });
    expect(() => itemsFromTable([['Antwort'], ['x']])).toThrow('Spalte „Frage“ fehlt.');
    expect(itemsFromJson(JSON.stringify({ items: [{ frage: 'Wie lege ich ein Reifenpaket an?', quellen: ['reifen.md'], stichworte: 'Produkte' }, { question: 'x' }] })))
      .toEqual([{ question: 'Wie lege ich ein Reifenpaket an?', expected: [{ path: 'reifen.md' }], keywords: ['Produkte'], expectNoAnswer: false, note: null }]);
  });

  it('[T-276] Testfragensatz aus CSV, Prüflauf mit Kennzahlen, Korrektur, zweiter Lauf mit Vergleich, Export; kein Eintrag im Frageprotokoll', async () => {
    const built = await build('qualitaet');
    const call = client(built);
    try {
      const z = new JSZip();
      z.file('handbuch/vertraege.md', `${FM}# Verträge verwalten\n\n## Vertrag kündigen\n\nUm einen Vertrag zu kündigen, klicken Sie in der Vertragsdetailansicht auf Beenden. Die Kündigung wird zum Monatsende wirksam.\n\n## Vertrag verlängern\n\nEinen Vertrag verlängern Sie über Verlängern in der Vertragsdetailansicht.\n`);
      z.file('schulung/reifen.md', `${FM}# Reifen\n\n## Reifenpaket anlegen\n\nEin Reifenpaket legen Sie unter Produkte › Reifen an.\n`);
      await importFile(built, 'q.zip', await z.generateAsync({ type: 'nodebuffer' }));

      const boundary = '----e' + Math.random().toString(16).slice(2);
      const payload = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="wissens-check.csv"\r\nContent-Type: text/csv\r\n\r\n${CSV}\r\n--${boundary}--\r\n`);
      const upload = (user: string) => built.app.inject({ method: 'POST', url: '/api/v1/metadata/eval-sets', payload, headers: { 'content-type': `multipart/form-data; boundary=${boundary}`, 'x-user-id': user } });
      expect((await upload('u-leser')).statusCode).toBe(403);
      const up = await upload('u-redaktion');
      expect(up.statusCode).toBe(201);
      const set = up.json();
      expect(set).toMatchObject({ name: 'wissens-check', origin: 'file', runs: [] });
      expect(set.items.map((i: any) => i.position)).toEqual([1, 2, 3, 4]);

      const log = async () => Number((await built.ctx.db.get('SELECT COUNT(*) AS n FROM metadata_ask_log'))!.n);
      const before = await log();
      expect((await call('POST', `/metadata/eval-sets/${set.id}/runs`, {}, 'u-leser')).status).toBe(403);
      const run1 = (await call('POST', `/metadata/eval-sets/${set.id}/runs`, {}, 'u-redaktion')).json;
      expect(run1.metrics).toMatchObject({ questions: 4, passed: 3, passRate: 0.75, withSources: 3, hitAt1: 0.667, hitAt6: 0.667, citedRate: 0.667, noAnswerItems: 1, noAnswerAccuracy: 1 });
      expect(run1.config).toMatchObject({ candidates: 20, passages: 6, minKeywords: 0.3, embeddings: { provider: 'local' }, llm: { provider: 'demo' } });
      expect(run1.compare).toBeNull();
      const r = Object.fromEntries(run1.results.map((x: any) => [x.position, x]));
      expect(r[1]).toMatchObject({ rank: 1, cited: true, keywordHits: 2, keywordTotal: 2, passed: true });
      expect(r[3]).toMatchObject({ rank: null, cited: false, answered: true, passed: false });
      expect(r[3].retrieved[0]).toMatchObject({ rank: 1, path: 'handbuch/vertraege.md' });
      expect(r[4]).toMatchObject({ answered: false, passed: true });
      expect(await log()).toBe(before); // Prüfläufe nicht im Frageprotokoll

      // erwartete Quelle korrigieren, Testfrage ergänzen, erneut prüfen
      const item3 = set.items.find((i: any) => i.position === 3);
      expect((await call('PATCH', `/metadata/eval-items/${item3.id}`, { expected: ['handbuch/vertraege.md › verlängern'] }, 'u-redaktion')).json)
        .toMatchObject({ expected: [{ path: 'handbuch/vertraege.md', heading: 'verlängern' }] });
      expect((await call('POST', `/metadata/eval-sets/${set.id}/items`, { question: 'x' }, 'u-redaktion')).status).toBe(400);
      const added = (await call('POST', `/metadata/eval-sets/${set.id}/items`, { question: 'Wo lege ich ein Reifenpaket an?', expected: ['reifen.md'], keywords: ['Reifen'] }, 'u-redaktion')).json;
      expect(added.items).toHaveLength(5);
      const run2 = (await call('POST', `/metadata/eval-sets/${set.id}/runs`, {}, 'u-redaktion')).json;
      expect(run2.metrics).toMatchObject({ questions: 5, passed: 5, passRate: 1, hitAt6: 1 });
      expect(run2.compare).toMatchObject({ previousRunId: run1.id, delta: { passRate: 0.25, hitAt6: 0.333 }, improved: [item3.id], regressed: [] });

      const full = (await call('GET', `/metadata/eval-sets/${set.id}`, undefined, 'u-leser')).json;
      expect(full.runs.map((x: any) => x.id)).toEqual([run2.id, run1.id]);
      expect((await call('GET', '/metadata/eval-sets', undefined, 'u-leser')).json[0]).toMatchObject({ questions: 5, runs: 2, lastRun: { id: run2.id } });

      const csv = await call('GET', `/metadata/eval-runs/${run1.id}/export?format=csv`, undefined, 'u-leser');
      expect(csv.headers['content-type']).toContain('text/csv');
      expect(csv.body.startsWith('﻿Nr.;Frage;Bestanden')).toBe(true);
      expect(csv.body).toContain('"Wie verlängere ich einen Vertrag?";"nein";"–"');
      const xlsx = await call('GET', `/metadata/eval-runs/${run2.id}/export?format=xlsx`, undefined, 'u-leser');
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(xlsx.raw as any);
      expect(wb.worksheets.map((w) => w.name)).toEqual(['Kennzahlen', 'Ergebnisse']);
      expect(wb.getWorksheet('Ergebnisse')!.rowCount).toBe(6);
      expect((await call('GET', `/metadata/eval-runs/${run2.id}/export?format=pdf`, undefined, 'u-leser')).status).toBe(400);

      // Löschen entfernt Läufe und Ergebnisse
      expect((await call('DELETE', `/metadata/eval-sets/${set.id}`, undefined, 'u-redaktion')).status).toBe(204);
      expect((await call('GET', `/metadata/eval-runs/${run1.id}`, undefined, 'u-leser')).status).toBe(404);
      expect(Number((await built.ctx.db.get('SELECT COUNT(*) AS n FROM metadata_eval_results'))!.n)).toBe(0);
    } finally {
      await built.app.close();
    }
  });

  it('[T-277] Testfragen aus gespeicherten Fragen & Antworten: erwartete Quelle aus den Belegen; leerer Satz und JSON-Fehler', async () => {
    const built = await build('aus-qa');
    const call = client(built);
    try {
      await importFile(built, 'k.md', `${FM}# Verträge verwalten\n\n## Vertrag kündigen\n\nUm einen Vertrag zu kündigen, klicken Sie in der Vertragsdetailansicht auf Beenden.\n`);
      expect((await call('POST', '/metadata/eval-sets', { name: 'leer', fromQa: {} }, 'u-redaktion')).status).toBe(400);
      const a = (await call('POST', '/metadata/ask', { question: 'Wie kündige ich einen Vertrag?' }, 'u-leser')).json;
      await call('POST', '/metadata/qa', { question: a.question, answer: a.answerText, snippetIds: a.sources.map((s: any) => s.snippetId) }, 'u-redaktion');
      const set = (await call('POST', '/metadata/eval-sets', { name: 'Aus F&A', fromQa: {} }, 'u-redaktion')).json;
      expect(set).toMatchObject({ origin: 'qa', items: [{ question: 'Wie kündige ich einen Vertrag?', expected: [{ path: 'k.md' }], note: 'Aus Fragen & Antworten' }] });
      expect(set.items[0].qaId).toBeTruthy();
      const run = (await call('POST', `/metadata/eval-sets/${set.id}/runs`, {}, 'u-redaktion')).json;
      expect(run.metrics).toMatchObject({ questions: 1, passed: 1, hitAt1: 1, mrr: 1 });

      const empty = (await call('POST', '/metadata/eval-sets', { name: 'Neu' }, 'u-redaktion')).json;
      expect(empty).toMatchObject({ origin: 'manual', items: [] });
      expect((await call('POST', `/metadata/eval-sets/${empty.id}/runs`, {}, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/metadata/eval-sets', {}, 'u-redaktion')).status).toBe(400);
      const boundary = '----j' + Math.random().toString(16).slice(2);
      const payload = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="t.json"\r\nContent-Type: application/json\r\n\r\n{kaputt\r\n--${boundary}--\r\n`);
      const bad = await built.app.inject({ method: 'POST', url: '/api/v1/metadata/eval-sets', payload, headers: { 'content-type': `multipart/form-data; boundary=${boundary}`, 'x-user-id': 'u-redaktion' } });
      expect(bad.statusCode).toBe(400);
      expect(bad.json().detail).toBe('Kein gültiges JSON.');
    } finally {
      await built.app.close();
    }
  });
});
