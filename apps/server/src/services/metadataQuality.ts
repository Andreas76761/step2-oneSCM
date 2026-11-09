// Antwortqualität (ADR-091, Etappe 39 / M7): Testfragensätze mit erwarteten Quellen, Prüfläufe über „Frage an alle
// Quellen“ mit Kennzahlen, Vergleich mit dem vorigen Lauf und Export. Prüfläufe schreiben nichts ins Frageprotokoll.
import path from 'node:path';
import ExcelJS from 'exceljs';
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson } from '../db.js';
import { SOURCES_PROMPT_VERSION } from '../domain/assistant.js';
import { aggregate, itemsFromJson, itemsFromTable, MAX_ITEMS, normalizeItem, scoreItem, type EvalItem, type Metrics } from '../domain/evaluation.js';
import { badRequest, notFound, Problem } from '../problem.js';
import { listQa } from './metadata.js';
import { askSources, CANDIDATES, DEFAULT_METHOD, MIN_KEYWORDS, MIN_SIMILARITY, PASSAGES, type RetrievalMethod } from './metadataAsk.js';
import { MIN_COVERAGE, MMR_LAMBDA, RRF_K } from '../domain/retrieval.js';
import { readTable } from './masterDataImport.js';

const itemDto = (r: any) => ({
  id: r.id, position: Number(r.position), question: r.question, expected: parseJson(r.expected, []), keywords: parseJson<string[]>(r.keywords, []),
  expectNoAnswer: !!Number(r.expect_no_answer), note: r.note ?? null, qaId: r.qa_id ?? null,
});
const runDto = (r: any) => ({ id: r.id, setId: r.set_id, createdBy: r.created_by, createdAt: r.created_at, durationMs: Number(r.duration_ms), config: parseJson(r.config, {}), metrics: parseJson<Metrics>(r.metrics, {} as Metrics) });

async function setRow(ctx: Ctx, id: string) {
  const s = await ctx.db.get('SELECT * FROM metadata_eval_sets WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!s) throw notFound(`Testfragensatz ${id}`);
  return s;
}

async function insertItems(ctx: Ctx, setId: string, items: (EvalItem & { qaId?: string })[], start = 0) {
  for (const [i, it] of items.entries()) {
    await ctx.db.run(
      'INSERT INTO metadata_eval_items (id, set_id, position, question, expected, keywords, expect_no_answer, note, qa_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      newId('evi'), setId, start + i + 1, it.question, json(it.expected), json(it.keywords), it.expectNoAnswer ? 1 : 0, it.note ?? null, it.qaId ?? null,
    );
  }
}

export async function listEvalSets(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT s.*, (SELECT COUNT(*) FROM metadata_eval_items i WHERE i.set_id = s.id) AS n,
       (SELECT COUNT(*) FROM metadata_eval_runs r WHERE r.set_id = s.id) AS runs
     FROM metadata_eval_sets s WHERE s.project_id = ? ORDER BY s.created_at DESC`, ctx.projectId,
  );
  const out = [];
  for (const s of rows) {
    const last = await ctx.db.get('SELECT * FROM metadata_eval_runs WHERE set_id = ? ORDER BY created_at DESC, id DESC LIMIT 1', s.id);
    out.push({ id: s.id, name: s.name, origin: s.origin, fileName: s.file_name ?? null, questions: Number(s.n), runs: Number(s.runs), lastRun: last ? runDto(last) : null, createdAt: s.created_at });
  }
  return out;
}

export async function getEvalSet(ctx: Ctx, id: string) {
  const s = await setRow(ctx, id);
  const items = (await ctx.db.all('SELECT * FROM metadata_eval_items WHERE set_id = ? ORDER BY position', id)).map(itemDto);
  const runs = (await ctx.db.all('SELECT * FROM metadata_eval_runs WHERE set_id = ? ORDER BY created_at DESC, id DESC LIMIT 50', id)).map(runDto);
  return { id: s.id, name: s.name, origin: s.origin, fileName: s.file_name ?? null, createdBy: s.created_by, createdAt: s.created_at, updatedAt: s.updated_at, items, runs };
}

/**
 * Neuer Testfragensatz: leer bzw. mit Fragen (`items`) oder aus gespeicherten Fragen & Antworten (`fromQa`, optional nach
 * Labels) – erwartete Quelle sind dann die Dateien der gespeicherten Belege.
 */
export async function createEvalSet(ctx: Ctx, input: any, user: User) {
  const name = String(input?.name ?? '').trim().slice(0, 200);
  if (!name) throw badRequest('name ist Pflicht.');
  let items: (EvalItem & { qaId?: string })[] = [];
  let origin = 'manual';
  if (input?.fromQa) {
    origin = 'qa';
    const qa = await listQa(ctx, { labelIds: Array.isArray(input.fromQa?.labelIds) ? input.fromQa.labelIds.map(String) : undefined });
    items = qa.slice(0, MAX_ITEMS).map((q) => ({
      ...normalizeItem({ question: q.question, expected: [...new Set(q.sources.map((s) => s.path))].map((p) => ({ path: p })), note: 'Aus Fragen & Antworten' })!, qaId: q.id,
    })).filter((x) => x.question);
    if (!items.length) throw badRequest('Keine gespeicherten Fragen & Antworten im gewählten Rahmen.');
  } else if (Array.isArray(input?.items)) {
    items = input.items.slice(0, MAX_ITEMS).map(normalizeItem).filter(Boolean);
  }
  const id = newId('evs');
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO metadata_eval_sets (id, project_id, name, origin, file_name, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', id, ctx.projectId, name, origin, null, user.id, now(), now());
    await insertItems(ctx, id, items);
    await audit(ctx, user.id, 'metadata.eval_set.created', 'metadata_eval_set', id, { origin, questions: items.length });
  });
  return getEvalSet(ctx, id);
}

/** Testfragen aus Datei: CSV/Excel mit Spalten Frage, Erwartete Quelle, Erwartete Überschrift, Stichworte, Keine Antwort – oder JSON */
export async function importEvalSet(ctx: Ctx, input: { fileName: string; data: Buffer; name?: string }, user: User) {
  const ext = path.extname(input.fileName).toLowerCase();
  let items: EvalItem[];
  try {
    items = ext === '.json' ? itemsFromJson(input.data.toString('utf8')) : itemsFromTable(await readTable(input.fileName, input.data));
  } catch (e) {
    if (e instanceof Problem) throw e;
    throw badRequest((e as Error).message);
  }
  if (!items.length) throw badRequest('Keine Testfragen gefunden.');
  const id = newId('evs');
  const name = (input.name?.trim() || path.basename(input.fileName, ext)).slice(0, 200);
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO metadata_eval_sets (id, project_id, name, origin, file_name, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', id, ctx.projectId, name, 'file', input.fileName.slice(0, 200), user.id, now(), now());
    await insertItems(ctx, id, items);
    await audit(ctx, user.id, 'metadata.eval_set.imported', 'metadata_eval_set', id, { fileName: input.fileName, questions: items.length });
  });
  return getEvalSet(ctx, id);
}

export async function addEvalItem(ctx: Ctx, setId: string, input: any, user: User) {
  await setRow(ctx, setId);
  const item = normalizeItem(input);
  if (!item) throw badRequest('question mit 3 bis 500 Zeichen ist Pflicht.');
  const n = Number((await ctx.db.get('SELECT COUNT(*) AS n FROM metadata_eval_items WHERE set_id = ?', setId))!.n);
  if (n >= MAX_ITEMS) throw badRequest(`Höchstens ${MAX_ITEMS} Testfragen je Satz.`);
  const max = Number((await ctx.db.get('SELECT COALESCE(MAX(position), 0) AS m FROM metadata_eval_items WHERE set_id = ?', setId))!.m);
  await insertItems(ctx, setId, [item], max);
  await ctx.db.run('UPDATE metadata_eval_sets SET updated_at = ? WHERE id = ?', now(), setId);
  await audit(ctx, user.id, 'metadata.eval_item.created', 'metadata_eval_set', setId, { question: item.question });
  return getEvalSet(ctx, setId);
}

async function itemRow(ctx: Ctx, itemId: string) {
  const r = await ctx.db.get('SELECT i.* FROM metadata_eval_items i JOIN metadata_eval_sets s ON s.id = i.set_id WHERE i.id = ? AND s.project_id = ?', itemId, ctx.projectId);
  if (!r) throw notFound(`Testfrage ${itemId}`);
  return r;
}

export async function updateEvalItem(ctx: Ctx, itemId: string, input: any, user: User) {
  const r = await itemRow(ctx, itemId);
  const cur = itemDto(r);
  const item = normalizeItem({ ...cur, ...input });
  if (!item) throw badRequest('question mit 3 bis 500 Zeichen ist Pflicht.');
  await ctx.db.run('UPDATE metadata_eval_items SET question = ?, expected = ?, keywords = ?, expect_no_answer = ?, note = ? WHERE id = ?',
    item.question, json(item.expected), json(item.keywords), item.expectNoAnswer ? 1 : 0, item.note ?? null, itemId);
  await ctx.db.run('UPDATE metadata_eval_sets SET updated_at = ? WHERE id = ?', now(), r.set_id);
  await audit(ctx, user.id, 'metadata.eval_item.updated', 'metadata_eval_item', itemId, {});
  return itemDto(await itemRow(ctx, itemId));
}

export async function deleteEvalItem(ctx: Ctx, itemId: string, user: User) {
  const r = await itemRow(ctx, itemId);
  await ctx.db.run('DELETE FROM metadata_eval_items WHERE id = ?', itemId);
  await audit(ctx, user.id, 'metadata.eval_item.deleted', 'metadata_eval_set', r.set_id, { question: r.question });
}

export async function deleteEvalSet(ctx: Ctx, id: string, user: User) {
  await setRow(ctx, id);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM metadata_eval_results WHERE run_id IN (SELECT id FROM metadata_eval_runs WHERE set_id = ?)', id);
    await ctx.db.run('DELETE FROM metadata_eval_runs WHERE set_id = ?', id);
    await ctx.db.run('DELETE FROM metadata_eval_items WHERE set_id = ?', id);
    await ctx.db.run('DELETE FROM metadata_eval_sets WHERE id = ?', id);
    await audit(ctx, user.id, 'metadata.eval_set.deleted', 'metadata_eval_set', id, {});
  });
}

/** Prüflauf: jede Testfrage wie eine Frage an alle Quellen stellen, bewerten, Kennzahlen speichern */
export async function runEval(ctx: Ctx, setId: string, user: User, opts: { method?: unknown } = {}) {
  await setRow(ctx, setId);
  // Verfahren wählbar (ADR-099): v2 Standard, v1 zum Vergleich am eigenen Bestand
  if (opts.method !== undefined && opts.method !== 'v1' && opts.method !== 'v2') throw badRequest('method muss v1 oder v2 sein.');
  const method = (opts.method ?? DEFAULT_METHOD) as RetrievalMethod;
  const items = (await ctx.db.all('SELECT * FROM metadata_eval_items WHERE set_id = ? ORDER BY position', setId)).map(itemDto);
  if (!items.length) throw badRequest('Der Testfragensatz enthält keine Fragen.');
  const started = Date.now();
  const rows: { item: (typeof items)[number]; score: ReturnType<typeof scoreItem>; ms: number; res: any; notice: string | null }[] = [];
  let searched = 0;
  for (const item of items) {
    const t0 = Date.now();
    let res: any = null;
    let notice: string | null = null;
    try {
      res = await askSources(ctx, { question: item.question }, user, { log: false, method });
      notice = res.notice;
      searched = res.searched;
    } catch (e) {
      // z. B. personenbezogene Daten bei externem Dienst: zählt als nicht beantwortet
      if (!(e instanceof Problem)) throw e;
      notice = e.detail ?? e.message;
    }
    const score = scoreItem(item, { retrieved: res?.retrieved ?? [], sources: res?.sources ?? [], answerText: res?.answerText ?? '', answered: !!res?.answer?.length });
    rows.push({ item, score, ms: Date.now() - t0, res, notice });
  }
  const metrics = aggregate(rows);
  const config = {
    method, ...(method === 'v2' ? { rrfK: RRF_K, minCoverage: MIN_COVERAGE, mmrLambda: MMR_LAMBDA } : {}),
    candidates: CANDIDATES, passages: PASSAGES, minKeywords: MIN_KEYWORDS, minSimilarity: MIN_SIMILARITY, promptVersion: SOURCES_PROMPT_VERSION,
    embeddings: { provider: ctx.embeddings.id, model: ctx.embeddings.model }, llm: ctx.llm ? { provider: ctx.llm.id, model: ctx.llm.model, external: ctx.llm.external } : null, units: searched,
  };
  const id = newId('evr');
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO metadata_eval_runs (id, set_id, project_id, created_by, created_at, duration_ms, config, metrics) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      id, setId, ctx.projectId, user.id, now(), Date.now() - started, json(config), json(metrics));
    for (const r of rows) {
      await ctx.db.run(
        `INSERT INTO metadata_eval_results (id, run_id, item_id, position, question, rank, cited, answered, keyword_hits, keyword_total, passed, mode, answer_text, notice, retrieved, ms)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        newId('evx'), id, r.item.id, r.item.position, r.item.question, r.score.rank, r.score.cited ? 1 : 0, r.score.answered ? 1 : 0, r.score.keywordHits, r.score.keywordTotal,
        r.score.passed ? 1 : 0, r.res?.mode ?? null, r.res?.answerText || null, r.notice, json((r.res?.retrieved ?? []).map((x: any) => ({ rank: x.rank, path: x.path, headingPath: x.headingPath, locator: x.locator, lineStart: x.lineStart, score: x.score }))), r.ms,
      );
    }
    await audit(ctx, user.id, 'metadata.eval_run.finished', 'metadata_eval_set', setId, { runId: id, questions: rows.length, passRate: metrics.passRate, hitAt6: metrics.hitAt6, llm: config.llm });
  });
  return getEvalRun(ctx, id);
}

const resultDto = (r: any) => ({
  itemId: r.item_id, position: Number(r.position), question: r.question, rank: r.rank === null || r.rank === undefined ? null : Number(r.rank), cited: !!Number(r.cited), answered: !!Number(r.answered),
  keywordHits: Number(r.keyword_hits), keywordTotal: Number(r.keyword_total), passed: !!Number(r.passed), mode: r.mode ?? null, answerText: r.answer_text ?? null, notice: r.notice ?? null,
  retrieved: parseJson(r.retrieved, []), ms: Number(r.ms),
});

/** Lauf mit Ergebnissen je Frage und Vergleich mit dem vorigen Lauf desselben Satzes */
export async function getEvalRun(ctx: Ctx, runId: string) {
  const r = await ctx.db.get('SELECT * FROM metadata_eval_runs WHERE id = ? AND project_id = ?', runId, ctx.projectId);
  if (!r) throw notFound(`Prüflauf ${runId}`);
  const run = runDto(r);
  const results = (await ctx.db.all('SELECT * FROM metadata_eval_results WHERE run_id = ? ORDER BY position', runId)).map(resultDto);
  const prev = await ctx.db.get('SELECT * FROM metadata_eval_runs WHERE set_id = ? AND (created_at < ? OR (created_at = ? AND id < ?)) ORDER BY created_at DESC, id DESC LIMIT 1', r.set_id, r.created_at, r.created_at, r.id);
  let compare = null;
  if (prev) {
    const before = new Map((await ctx.db.all('SELECT item_id, passed FROM metadata_eval_results WHERE run_id = ?', prev.id)).map((x) => [x.item_id, !!Number(x.passed)]));
    const pm = parseJson<Metrics>(prev.metrics, {} as Metrics);
    const keys = ['passRate', 'hitAt1', 'hitAt3', 'hitAt6', 'mrr', 'ndcg6', 'citedRate', 'answeredRate', 'keywordCoverage', 'noAnswerAccuracy'] as const;
    compare = {
      previousRunId: prev.id, previousAt: prev.created_at,
      delta: Object.fromEntries(keys.map((k) => [k, Math.round(((run.metrics[k] ?? 0) - (pm[k] ?? 0)) * 1000) / 1000])),
      improved: results.filter((x) => x.passed && before.get(x.itemId) === false).map((x) => x.itemId),
      regressed: results.filter((x) => !x.passed && before.get(x.itemId) === true).map((x) => x.itemId),
    };
  }
  return { ...run, results, compare };
}

export async function exportEvalRun(ctx: Ctx, runId: string, format: string) {
  if (!['csv', 'xlsx', 'json'].includes(format)) throw badRequest('format muss csv, xlsx oder json sein.');
  const run = await getEvalRun(ctx, runId);
  const date = run.createdAt.slice(0, 10);
  if (format === 'json') return { fileName: `antwortqualitaet-${date}.json`, contentType: 'application/json; charset=utf-8', data: Buffer.from(JSON.stringify(run, null, 2), 'utf8') };
  const header = ['Nr.', 'Frage', 'Bestanden', 'Rang erwartete Quelle', 'Beleg richtig', 'Beantwortet', 'Stichworte', 'Antwort', 'Gefundene Stellen'] as const;
  const rows = run.results.map((x) => [
    String(x.position), x.question, x.passed ? 'ja' : 'nein', x.rank === null ? '–' : String(x.rank), x.cited ? 'ja' : 'nein', x.answered ? 'ja' : 'nein',
    x.keywordTotal ? `${x.keywordHits}/${x.keywordTotal}` : '–', x.answerText ?? x.notice ?? '', x.retrieved.map((s: any) => `${s.rank}. ${s.path}`).join('; '),
  ]);
  if (format === 'csv') {
    const cell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
    return { fileName: `antwortqualitaet-${date}.csv`, contentType: 'text/csv; charset=utf-8', data: Buffer.from(`﻿${[header.join(';'), ...rows.map((r) => r.map(cell).join(';'))].join('\r\n')}`, 'utf8') };
  }
  const wb = new ExcelJS.Workbook();
  const ks = wb.addWorksheet('Kennzahlen');
  ks.addRow(['Kennzahl', 'Wert']).font = { bold: true };
  for (const [k, v] of Object.entries(run.metrics)) ks.addRow([k, v]);
  ks.columns.forEach((c, i) => (c.width = [24, 14][i]));
  const ws = wb.addWorksheet('Ergebnisse');
  ws.addRow([...header]).font = { bold: true };
  for (const r of rows) ws.addRow(r);
  ws.columns.forEach((c, i) => (c.width = [6, 60, 10, 12, 12, 12, 12, 80, 60][i]));
  return { fileName: `antwortqualitaet-${date}.xlsx`, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', data: Buffer.from(await wb.xlsx.writeBuffer()) };
}
