// Expertenbefragung zu Wissenslücken (ADR-092, F-16): Fragen ohne Aussage in den Quellen – aus einem Fragenkatalog,
// einem Prüflauf der Antwortqualität oder von Hand – an Fachleute geben. Antwort per Option und/oder Freitext, in der App
// oder per Excel-Datei; übernommen wird sie als Frage & Antwort mit dem Label „Prüfen“ (ohne Quellenbeleg).
import path from 'node:path';
import ExcelJS from 'exceljs';
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson } from '../db.js';
import { mapHeader } from '../domain/tabular.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { createQa } from './metadata.js';
import { readTable } from './masterDataImport.js';

export const DEFAULT_OPTIONS = ['Ja', 'Nein', 'Teilweise', 'Weiß nicht'];
const MAX_ITEMS = 500;
const TO_CHECK = 'quality.to-check';

function cleanOptions(v: unknown, fallback: string[] | null): string[] | null {
  if (v === undefined || v === null) return fallback;
  if (!Array.isArray(v)) throw badRequest('options muss eine Liste sein.');
  const list = [...new Set(v.map((x) => String(x).trim()).filter(Boolean))].map((x) => x.slice(0, 120));
  if (list.length > 10) throw badRequest('Höchstens 10 Antwortoptionen.');
  return list;
}

const itemDto = (r: any, defaults: string[]) => ({
  id: r.id, position: Number(r.position), question: r.question, context: r.context ?? null, options: parseJson<string[] | null>(r.options, null) ?? defaults,
  choice: r.choice ?? null, answerText: r.answer_text ?? null, answeredBy: r.answered_by ?? null, answeredAt: r.answered_at ?? null, qaId: r.qa_id ?? null,
  status: r.qa_id ? 'adopted' : r.answered_at ? 'answered' : 'open',
});

async function surveyRow(ctx: Ctx, id: string) {
  const s = await ctx.db.get('SELECT * FROM metadata_surveys WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!s) throw notFound(`Befragung ${id}`);
  return s;
}

export async function listSurveys(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT s.*, (SELECT COUNT(*) FROM metadata_survey_items i WHERE i.survey_id = s.id) AS n,
       (SELECT COUNT(*) FROM metadata_survey_items i WHERE i.survey_id = s.id AND i.answered_at IS NOT NULL) AS answered,
       (SELECT COUNT(*) FROM metadata_survey_items i WHERE i.survey_id = s.id AND i.qa_id IS NOT NULL) AS adopted
     FROM metadata_surveys s WHERE s.project_id = ? ORDER BY s.created_at DESC`, ctx.projectId,
  );
  return rows.map((s) => ({ id: s.id, title: s.title, audience: s.audience ?? null, origin: s.origin, status: s.status, questions: Number(s.n), answered: Number(s.answered), adopted: Number(s.adopted), createdAt: s.created_at }));
}

export async function getSurvey(ctx: Ctx, id: string) {
  const s = await surveyRow(ctx, id);
  const defaults = parseJson<string[]>(s.options, DEFAULT_OPTIONS);
  const items = (await ctx.db.all('SELECT * FROM metadata_survey_items WHERE survey_id = ? ORDER BY position', id)).map((r) => itemDto(r, defaults));
  return {
    id: s.id, title: s.title, audience: s.audience ?? null, options: defaults, origin: s.origin, originId: s.origin_id ?? null, status: s.status,
    createdBy: s.created_by, createdAt: s.created_at, closedAt: s.closed_at ?? null, items,
    summary: { questions: items.length, open: items.filter((i) => i.status === 'open').length, answered: items.filter((i) => i.status !== 'open').length, adopted: items.filter((i) => i.qaId).length },
  };
}

/**
 * Neue Befragung: Fragen von Hand (`items`), aus einem Fragenkatalog (`from: { catalogId }` – Fragen ohne Aussage bzw.
 * nicht gefragt) oder aus einem Prüflauf (`from: { evalRunId }` – Testfragen ohne Antwort, also auch Lückenfragen).
 */
export async function createSurvey(ctx: Ctx, input: any, user: User) {
  const title = String(input?.title ?? '').trim().slice(0, 200);
  if (!title) throw badRequest('title ist Pflicht.');
  const audience = input?.audience ? String(input.audience).trim().slice(0, 200) || null : null;
  const options = cleanOptions(input?.options, DEFAULT_OPTIONS)!;
  let origin = 'manual';
  let originId: string | null = null;
  let items: { question: string; context: string | null; options: string[] | null }[] = [];
  if (input?.from?.catalogId) {
    origin = 'catalog';
    originId = String(input.from.catalogId);
    const set = await ctx.db.get('SELECT id FROM metadata_question_sets WHERE id = ? AND project_id = ?', originId, ctx.projectId);
    if (!set) throw notFound(`Fragenkatalog ${originId}`);
    items = (await ctx.db.all("SELECT * FROM metadata_question_items WHERE set_id = ? AND status IN ('no_answer', 'blocked') ORDER BY position", originId))
      .map((r) => ({ question: r.question, context: [r.chapter, r.notice ?? 'Keine Aussage in den Quellen.'].filter(Boolean).join(' – '), options: null }));
  } else if (input?.from?.evalRunId) {
    origin = 'eval';
    originId = String(input.from.evalRunId);
    const run = await ctx.db.get('SELECT id FROM metadata_eval_runs WHERE id = ? AND project_id = ?', originId, ctx.projectId);
    if (!run) throw notFound(`Prüflauf ${originId}`);
    items = (await ctx.db.all('SELECT * FROM metadata_eval_results WHERE run_id = ? AND answered = 0 ORDER BY position', originId))
      .map((r) => ({ question: r.question, context: r.notice ?? 'Keine Aussage in den Quellen.', options: null }));
  } else if (Array.isArray(input?.items)) {
    items = input.items.map((x: any) => ({ question: String(x?.question ?? '').replace(/\s+/g, ' ').trim(), context: x?.context ? String(x.context).slice(0, 1000) : null, options: cleanOptions(x?.options, null) }));
  }
  items = items.filter((x) => x.question.length >= 3).map((x) => ({ ...x, question: x.question.slice(0, 500) })).slice(0, MAX_ITEMS);
  if (origin !== 'manual' && !items.length) throw badRequest('Keine offenen Wissenslücken – alle Fragen sind aus den Quellen beantwortet.');
  const id = newId('svy');
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO metadata_surveys (id, project_id, title, audience, options, origin, origin_id, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, ctx.projectId, title, audience, json(options), origin, originId, 'open', user.id, now());
    for (const [i, x] of items.entries()) {
      await ctx.db.run('INSERT INTO metadata_survey_items (id, survey_id, position, question, context, options) VALUES (?, ?, ?, ?, ?, ?)', newId('svi'), id, i + 1, x.question, x.context, x.options ? json(x.options) : null);
    }
    await audit(ctx, user.id, 'metadata.survey.created', 'metadata_survey', id, { origin, originId, questions: items.length });
  });
  return getSurvey(ctx, id);
}

export async function addSurveyItem(ctx: Ctx, surveyId: string, input: any, user: User) {
  const s = await surveyRow(ctx, surveyId);
  if (s.status !== 'open') throw conflict('Die Befragung ist abgeschlossen.');
  const question = String(input?.question ?? '').replace(/\s+/g, ' ').trim();
  if (question.length < 3 || question.length > 500) throw badRequest('question mit 3 bis 500 Zeichen ist Pflicht.');
  const n = Number((await ctx.db.get('SELECT COUNT(*) AS n FROM metadata_survey_items WHERE survey_id = ?', surveyId))!.n);
  if (n >= MAX_ITEMS) throw badRequest(`Höchstens ${MAX_ITEMS} Fragen je Befragung.`);
  const max = Number((await ctx.db.get('SELECT COALESCE(MAX(position), 0) AS m FROM metadata_survey_items WHERE survey_id = ?', surveyId))!.m);
  await ctx.db.run('INSERT INTO metadata_survey_items (id, survey_id, position, question, context, options) VALUES (?, ?, ?, ?, ?, ?)',
    newId('svi'), surveyId, max + 1, question, input?.context ? String(input.context).slice(0, 1000) : null, input?.options ? json(cleanOptions(input.options, null)) : null);
  await audit(ctx, user.id, 'metadata.survey.item_added', 'metadata_survey', surveyId, { question });
  return getSurvey(ctx, surveyId);
}

async function itemRow(ctx: Ctx, itemId: string) {
  const r = await ctx.db.get('SELECT i.*, s.status AS survey_status, s.options AS survey_options, s.title, s.audience FROM metadata_survey_items i JOIN metadata_surveys s ON s.id = i.survey_id WHERE i.id = ? AND s.project_id = ?', itemId, ctx.projectId);
  if (!r) throw notFound(`Frage ${itemId}`);
  return r;
}

function cleanAnswer(r: any, input: any) {
  const options = parseJson<string[] | null>(r.options, null) ?? parseJson<string[]>(r.survey_options, DEFAULT_OPTIONS);
  const choice = input?.choice === undefined || input?.choice === null || input?.choice === '' ? null : String(input.choice).trim();
  if (choice && !options.includes(choice)) throw badRequest(`choice muss eine der Optionen sein: ${options.join(', ')}.`);
  const text = input?.text === undefined || input?.text === null ? null : String(input.text).trim().slice(0, 5000) || null;
  return { choice, text };
}

/** Antwort einer Fachperson: Option und/oder Freitext (Recht „Lesen“ genügt – Fachleute brauchen keine Bearbeitungsrechte) */
export async function answerSurveyItem(ctx: Ctx, itemId: string, input: any, user: User) {
  const r = await itemRow(ctx, itemId);
  if (r.survey_status !== 'open') throw conflict('Die Befragung ist abgeschlossen.');
  if (r.qa_id) throw conflict('Die Antwort ist bereits als Frage & Antwort übernommen.');
  const { choice, text } = cleanAnswer(r, input);
  const clear = !choice && !text;
  await ctx.db.run('UPDATE metadata_survey_items SET choice = ?, answer_text = ?, answered_by = ?, answered_at = ? WHERE id = ?', choice, text, clear ? null : user.id, clear ? null : now(), itemId);
  await audit(ctx, user.id, clear ? 'metadata.survey.answer_cleared' : 'metadata.survey.answered', 'metadata_survey', r.survey_id, { itemId });
  return itemDto(await itemRow(ctx, itemId), parseJson<string[]>(r.survey_options, DEFAULT_OPTIONS));
}

/** Antwort als Frage & Antwort übernehmen – immer mit Label „Prüfen“, denn sie ist (noch) durch keine Quelle belegt */
export async function adoptSurveyItem(ctx: Ctx, itemId: string, input: any, user: User) {
  const r = await itemRow(ctx, itemId);
  if (!r.answered_at) throw badRequest('Nur beantwortete Fragen lassen sich übernehmen.');
  if (r.qa_id) throw conflict('Bereits als Frage & Antwort übernommen.');
  const label = await ctx.db.get('SELECT id FROM metadata_labels WHERE project_id = ? AND code = ?', ctx.projectId, TO_CHECK);
  const extra = Array.isArray(input?.labelIds) ? input.labelIds.map(String) : [];
  const answer = [r.choice ? `${r.choice}.` : null, r.answer_text].filter(Boolean).join(' ');
  const qa = await createQa(ctx, {
    question: r.question, answer, labelIds: [...new Set([...(label ? [label.id] : []), ...extra])], snippetIds: [],
    note: `Expertenantwort aus Befragung „${r.title}“${r.audience ? ` (${r.audience})` : ''} – ohne Quellenbeleg, bitte prüfen`,
  }, user);
  await ctx.db.run('UPDATE metadata_survey_items SET qa_id = ? WHERE id = ?', qa.id, itemId);
  return qa;
}

export async function setSurveyStatus(ctx: Ctx, id: string, status: unknown, user: User) {
  if (status !== 'open' && status !== 'closed') throw badRequest('status muss open oder closed sein.');
  await surveyRow(ctx, id);
  await ctx.db.run('UPDATE metadata_surveys SET status = ?, closed_at = ? WHERE id = ?', status, status === 'closed' ? now() : null, id);
  await audit(ctx, user.id, `metadata.survey.${status === 'closed' ? 'closed' : 'reopened'}`, 'metadata_survey', id, {});
  return getSurvey(ctx, id);
}

export async function deleteSurvey(ctx: Ctx, id: string, user: User) {
  await surveyRow(ctx, id);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM metadata_survey_items WHERE survey_id = ?', id);
    await ctx.db.run('DELETE FROM metadata_surveys WHERE id = ?', id);
    await audit(ctx, user.id, 'metadata.survey.deleted', 'metadata_survey', id, {});
  });
}

const HEADER = ['ID', 'Nr.', 'Frage', 'Hintergrund', 'Optionen', 'Auswahl', 'Freitext'];

/** Befragung als Excel/CSV für Fachleute ohne Zugang zur App – ausgefüllt wieder einlesbar */
export async function exportSurvey(ctx: Ctx, id: string, format: string) {
  if (!['xlsx', 'csv'].includes(format)) throw badRequest('format muss xlsx oder csv sein.');
  const s = await getSurvey(ctx, id);
  const base = s.title.replace(/[^\p{L}\p{N}._-]+/gu, '-').slice(0, 60) || 'befragung';
  const rows = s.items.map((i) => [i.id, String(i.position), i.question, i.context ?? '', i.options.join(' | '), i.choice ?? '', i.answerText ?? '']);
  if (format === 'csv') {
    const esc = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
    return { fileName: `${base}.csv`, contentType: 'text/csv; charset=utf-8', data: Buffer.from(`﻿${[HEADER.join(';'), ...rows.map((r) => r.map(esc).join(';'))].join('\r\n')}`, 'utf8') };
  }
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Befragung');
  ws.addRow(HEADER).font = { bold: true };
  for (const [n, r] of rows.entries()) {
    ws.addRow(r);
    // Auswahl als Liste der Optionen
    const opts = s.items[n].options;
    if (opts.length) ws.getCell(n + 2, 6).dataValidation = { type: 'list', allowBlank: true, formulae: [`"${opts.map((o) => o.replace(/"/g, '')).join(',')}"`] };
  }
  ws.columns.forEach((c, i) => (c.width = [24, 6, 60, 40, 30, 16, 60][i]));
  ws.getColumn(1).hidden = true;
  return { fileName: `${base}.xlsx`, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', data: Buffer.from(await wb.xlsx.writeBuffer()) };
}

/** Ausgefüllte Datei einlesen: Zeilen über ID bzw. Nr. zuordnen; leere Zeilen und übernommene Fragen bleiben unverändert */
export async function importSurveyAnswers(ctx: Ctx, id: string, file: { fileName: string; data: Buffer }, user: User) {
  const s = await surveyRow(ctx, id);
  if (s.status !== 'open') throw conflict('Die Befragung ist abgeschlossen.');
  if (!['.xlsx', '.csv'].includes(path.extname(file.fileName).toLowerCase())) throw badRequest('Erlaubt sind Excel (.xlsx) und CSV (.csv).');
  const table = await readTable(file.fileName, file.data);
  if (!table.length) throw badRequest('Die Datei ist leer.');
  const h = mapHeader(table[0], { id: ['ID'], no: ['Nr.', 'Nr', 'Nummer'], choice: ['Auswahl', 'Antwort (Auswahl)', 'Option'], text: ['Freitext', 'Antwort', 'Kommentar'] });
  if (h.id === undefined && h.no === undefined) throw badRequest('Spalte „ID“ oder „Nr.“ fehlt.');
  const rows = await ctx.db.all('SELECT i.*, ? AS survey_options FROM metadata_survey_items i WHERE i.survey_id = ?', s.options, id);
  const byId = new Map(rows.map((r) => [r.id, r]));
  const byNo = new Map(rows.map((r) => [String(r.position), r]));
  const result = { updated: 0, skipped: 0, errors: [] as { row: number; message: string }[] };
  for (const [n, line] of table.slice(1).entries()) {
    const r = (h.id !== undefined && byId.get(String(line[h.id] ?? '').trim())) || (h.no !== undefined ? byNo.get(String(line[h.no] ?? '').trim()) : undefined);
    const raw = { choice: h.choice !== undefined ? line[h.choice] : undefined, text: h.text !== undefined ? line[h.text] : undefined };
    if (!r) {
      result.errors.push({ row: n + 2, message: 'Frage nicht gefunden (ID bzw. Nr.).' });
      continue;
    }
    if (r.qa_id || (!String(raw.choice ?? '').trim() && !String(raw.text ?? '').trim())) {
      result.skipped++;
      continue;
    }
    try {
      const { choice, text } = cleanAnswer(r, raw);
      if (choice === (r.choice ?? null) && text === (r.answer_text ?? null)) {
        result.skipped++;
        continue;
      }
      await ctx.db.run('UPDATE metadata_survey_items SET choice = ?, answer_text = ?, answered_by = ?, answered_at = ? WHERE id = ?', choice, text, `${user.id} (Datei)`, now(), r.id);
      result.updated++;
    } catch (e) {
      result.errors.push({ row: n + 2, message: (e as Error).message });
    }
  }
  await audit(ctx, user.id, 'metadata.survey.imported', 'metadata_survey', id, { fileName: file.fileName, updated: result.updated, errors: result.errors.length });
  return { ...result, survey: await getSurvey(ctx, id) };
}
