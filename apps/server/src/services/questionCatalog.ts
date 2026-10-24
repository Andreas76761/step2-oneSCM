// Fragenkatalog (ADR-089, Etappe 37): Rückfragen aus einer Datei einlesen, alle mit Belegen aus den Quellen
// beantworten (Frage an alle Quellen), einzeln als Frage & Antwort übernehmen, exportieren.
import ExcelJS from 'exceljs';
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson } from '../db.js';
import { parseQuestionCatalog } from '../domain/questionCatalog.js';
import { badRequest, notFound, Problem } from '../problem.js';
import { createQa } from './metadata.js';
import { askSources } from './metadataAsk.js';

export async function importCatalog(ctx: Ctx, input: { name?: string; fileName?: string; data: string }, user: User) {
  const fileName = (input.fileName ?? 'fragen.txt').slice(0, 200);
  let items;
  try {
    items = parseQuestionCatalog(fileName, input.data);
  } catch (e) {
    throw badRequest((e as Error).message);
  }
  if (!items.length) throw badRequest('Keine Fragen gefunden – erwartet werden Sätze mit Fragezeichen (HTML, CSV mit Spalte „Frage“, JSON oder Text).');
  const id = newId('qset');
  const name = (input.name?.trim() || fileName.replace(/\.[^.]+$/, '')).slice(0, 200);
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO metadata_question_sets (id, project_id, name, file_name, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)', id, ctx.projectId, name, fileName, user.id, now());
    for (const [i, q] of items.entries()) {
      await ctx.db.run('INSERT INTO metadata_question_items (id, set_id, position, chapter, question) VALUES (?, ?, ?, ?, ?)', newId('qitem'), id, i + 1, q.chapter, q.question);
    }
    await audit(ctx, user.id, 'metadata.question_set.imported', 'metadata_question_set', id, { fileName, questions: items.length });
  });
  return getCatalog(ctx, id);
}

async function setRow(ctx: Ctx, id: string) {
  const s = await ctx.db.get('SELECT * FROM metadata_question_sets WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!s) throw notFound(`Fragenkatalog ${id}`);
  return s;
}

const itemDto = (r: any) => ({
  id: r.id, position: Number(r.position), chapter: r.chapter ?? null, question: r.question, status: r.status, mode: r.mode ?? null,
  answer: parseJson(r.answer, []), answerText: r.answer_text ?? null, sources: parseJson(r.sources, []), notice: r.notice ?? null, qaId: r.qa_id ?? null, askedAt: r.asked_at ?? null,
});

export async function listCatalogs(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT s.*, (SELECT COUNT(*) FROM metadata_question_items i WHERE i.set_id = s.id) AS n,
       (SELECT COUNT(*) FROM metadata_question_items i WHERE i.set_id = s.id AND i.status = 'answered') AS answered
     FROM metadata_question_sets s WHERE s.project_id = ? ORDER BY s.created_at DESC`, ctx.projectId,
  );
  return rows.map((s) => ({ id: s.id, name: s.name, fileName: s.file_name, questions: Number(s.n), answered: Number(s.answered), createdBy: s.created_by, createdAt: s.created_at, answeredAt: s.answered_at ?? null }));
}

export async function getCatalog(ctx: Ctx, id: string) {
  const s = await setRow(ctx, id);
  const items = (await ctx.db.all('SELECT * FROM metadata_question_items WHERE set_id = ? ORDER BY position', id)).map(itemDto);
  const count = (st: string) => items.filter((i) => i.status === st).length;
  return {
    id: s.id, name: s.name, fileName: s.file_name, createdBy: s.created_by, createdAt: s.created_at, answeredAt: s.answered_at ?? null, items,
    summary: { questions: items.length, open: count('open'), answered: count('answered'), noAnswer: count('no_answer'), blocked: count('blocked'), chapters: new Set(items.map((i) => i.chapter ?? '')).size },
  };
}

/** Alle (bzw. nur offene) Fragen mit Belegen beantworten – nacheinander, jede Frage wie eine einzelne Frage an alle Quellen */
export async function answerCatalog(ctx: Ctx, id: string, input: { onlyOpen?: boolean; filters?: unknown }, user: User) {
  await setRow(ctx, id);
  const items = await ctx.db.all(`SELECT * FROM metadata_question_items WHERE set_id = ? ${input.onlyOpen ? "AND status = 'open'" : ''} ORDER BY position`, id);
  for (const it of items) {
    let status = 'no_answer';
    let res: any = null;
    let notice: string | null = null;
    try {
      res = await askSources(ctx, { question: it.question, filters: input.filters ?? {} }, user);
      status = res.answer.length ? 'answered' : 'no_answer';
      notice = res.notice;
    } catch (e) {
      // z. B. personenbezogene Daten in der Frage bei externem Dienst: Frage bleibt unbeantwortet, mit Hinweis
      if (!(e instanceof Problem)) throw e;
      status = 'blocked';
      notice = e.detail ?? e.message;
    }
    await ctx.db.run(
      'UPDATE metadata_question_items SET status = ?, mode = ?, answer = ?, answer_text = ?, sources = ?, notice = ?, ask_id = ?, asked_at = ? WHERE id = ?',
      status, res?.mode ?? null, json(res?.answer ?? []), res?.answerText ?? null, json(res?.sources ?? []), notice, res?.id ?? null, now(), it.id,
    );
  }
  await ctx.db.run('UPDATE metadata_question_sets SET answered_at = ? WHERE id = ?', now(), id);
  await audit(ctx, user.id, 'metadata.question_set.answered', 'metadata_question_set', id, { questions: items.length });
  return getCatalog(ctx, id);
}

/** Beantwortete Frage als gespeicherte Frage & Antwort übernehmen (mit Belegen) */
export async function itemToQa(ctx: Ctx, itemId: string, input: { labelIds?: unknown }, user: User) {
  const it = await ctx.db.get('SELECT i.*, s.project_id, s.name FROM metadata_question_items i JOIN metadata_question_sets s ON s.id = i.set_id WHERE i.id = ?', itemId);
  if (!it || it.project_id !== ctx.projectId) throw notFound(`Frage ${itemId}`);
  if (it.status !== 'answered' || !it.answer_text) throw badRequest('Nur beantwortete Fragen lassen sich übernehmen.');
  const qa = await createQa(ctx, {
    question: it.question, answer: it.answer_text, snippetIds: parseJson<any[]>(it.sources, []).map((s) => s.snippetId), labelIds: input.labelIds,
    note: `Aus Fragenkatalog „${it.name}“${it.chapter ? `, ${it.chapter}` : ''}`, filters: {}, askId: it.ask_id ?? undefined,
  }, user);
  await ctx.db.run('UPDATE metadata_question_items SET qa_id = ? WHERE id = ?', qa.id, itemId);
  return qa;
}

export async function deleteCatalog(ctx: Ctx, id: string, user: User) {
  await setRow(ctx, id);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM metadata_question_items WHERE set_id = ?', id);
    await ctx.db.run('DELETE FROM metadata_question_sets WHERE id = ?', id);
    await audit(ctx, user.id, 'metadata.question_set.deleted', 'metadata_question_set', id, {});
  });
}

const STATUS: Record<string, string> = { open: 'offen', answered: 'beantwortet', no_answer: 'keine Aussage in den Quellen', blocked: 'nicht gefragt' };
const where = (s: any) => `${s.path}${s.locator?.page ? `, S. ${s.locator.page}` : s.locator?.slide ? `, Folie ${s.locator.slide}` : s.locator?.time ? `, bei ${s.locator.time}` : `, Z. ${s.lineStart}`}`;

export async function exportCatalog(ctx: Ctx, id: string, format: string) {
  if (!['csv', 'xlsx', 'json'].includes(format)) throw badRequest('format muss csv, xlsx oder json sein.');
  const c = await getCatalog(ctx, id);
  const base = c.name.replace(/[^\p{L}\p{N}._-]+/gu, '-').slice(0, 60) || 'fragenkatalog';
  if (format === 'json') return { fileName: `${base}-antworten.json`, contentType: 'application/json; charset=utf-8', data: Buffer.from(JSON.stringify(c, null, 2), 'utf8') };
  const header = ['Nr.', 'Kapitel', 'Frage', 'Status', 'Antwort', 'Belege'] as const;
  const rows = c.items.map((i) => [String(i.position), i.chapter ?? '', i.question, STATUS[i.status] ?? i.status, i.answerText ?? i.notice ?? '', i.sources.map((s: any) => `[${s.n}] ${where(s)}`).join('; ')]);
  if (format === 'csv') {
    const cell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
    return { fileName: `${base}-antworten.csv`, contentType: 'text/csv; charset=utf-8', data: Buffer.from(`﻿${[header.join(';'), ...rows.map((r) => r.map(cell).join(';'))].join('\r\n')}`, 'utf8') };
  }
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Rückfragen');
  ws.addRow([...header]).font = { bold: true };
  for (const r of rows) ws.addRow(r);
  ws.columns.forEach((col, i) => (col.width = [6, 30, 60, 22, 90, 60][i]));
  return { fileName: `${base}-antworten.xlsx`, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', data: Buffer.from(await wb.xlsx.writeBuffer()) };
}
