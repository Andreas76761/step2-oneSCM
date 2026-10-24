// Fragen über alle Quellen (ADR-089, M5): hybride Suche über Chunks und ihre Teilstücke (Begriffe + Vektor),
// Top 20 → Neugewichtung → Top 6 als Belege; Antwort nur aus diesen Belegen, jeder Satz mit Beleg [n]
// (KI-Antwort mit Satzprüfung, sonst extraktiv). Speichern, erneut fragen mit Vergleich, Export.
import ExcelJS from 'exceljs';
import { audit, getSettings, privacyNames, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson } from '../db.js';
import { buildSourcesPrompt, extractiveAnswer, keywordScore, parseAssistantResponse, SOURCES_PROMPT_VERSION, type Passage } from '../domain/assistant.js';
import { chunkParts } from '../domain/chunking.js';
import { NO_CHAPTER_TITLE } from '../domain/markdown.js';
import { detectPrivacy } from '../domain/privacy.js';
import { analyzeQuery, answerSentences, bm25, buildIndex, rank as rankV2, type Index, type Lexicon } from '../domain/retrieval.js';
import { checkSentences } from '../domain/rewrite.js';
import { sha256, tokenize } from '../domain/similarity.js';
import { wordDiff } from '../domain/sectionDupes.js';
import { dot } from '../embeddings.js';
import { badRequest, notFound, unprocessable } from '../problem.js';
import { embedTexts } from './assistant.js';
import { CHUNK_FROM, formatOf, listQa } from './metadata.js';

export const CANDIDATES = 20;
export const PASSAGES = 6;
/** Mindestrelevanz eines Belegs: Anteil der Inhaltswörter der Frage bzw. deutliche Bedeutungsähnlichkeit */
export const MIN_KEYWORDS = 0.3;
export const MIN_SIMILARITY = 0.6;
const MAX_UNITS = 20000;
const FORMATS = ['markdown', 'html', 'docx', 'pptx', 'pdf', 'mp4', 'subtitles', 'jira'];

export interface AskFilters { format?: string; documentId?: string; heading?: string; labelIds?: string[] }

function cleanFilters(f: any): AskFilters {
  const out: AskFilters = {};
  if (f?.format) {
    if (!FORMATS.includes(String(f.format))) throw badRequest(`format muss eines von ${FORMATS.join(', ')} sein.`);
    out.format = String(f.format);
  }
  if (f?.documentId) out.documentId = String(f.documentId);
  if (f?.heading && String(f.heading).trim()) out.heading = String(f.heading).trim().slice(0, 200);
  if (f?.labelIds !== undefined) {
    if (!Array.isArray(f.labelIds)) throw badRequest('labelIds muss eine Liste sein.');
    out.labelIds = [...new Set(f.labelIds.map(String))].slice(0, 10) as string[];
  }
  return out;
}

/** Such-Einheiten: Chunks der aktuellen Revisionen, lange Chunks als Teilstücke (ADR-087) */
async function units(ctx: Ctx, f: AskFilters) {
  const where = ['d.project_id = ?', 'r.is_current = 1', 'd.removed_at IS NULL'];
  const params: unknown[] = [ctx.projectId];
  if (f.documentId) (where.push('d.id = ?'), params.push(f.documentId));
  for (const id of f.labelIds ?? []) {
    if (!(await ctx.db.get('SELECT 1 FROM metadata_labels WHERE id = ? AND project_id = ?', id, ctx.projectId))) throw badRequest(`Label ${id} existiert in diesem Projekt nicht.`);
    where.push('EXISTS (SELECT 1 FROM metadata_chunk_labels x WHERE x.snippet_id = s.id AND x.label_id = ?)');
    params.push(id);
  }
  const rows = await ctx.db.all(
    `SELECT s.id, s.seq, s.text, s.kind, s.heading_path, s.locator, s.line_start, s.line_end, d.id AS document_id, d.path, r.source_format, c.title AS chapter_title, sc.title AS subchapter_title
     ${CHUNK_FROM} WHERE ${where.join(' AND ')} ORDER BY d.path, s.position LIMIT ${MAX_UNITS}`, ...params,
  );
  const heading = f.heading?.toLowerCase();
  const out: { snippetId: string; seq: number; part: number | null; parts: number; text: string; context: string | null; documentId: string; path: string; format: string; headingPath: string[]; locator: unknown; lineStart: number; lineEnd: number }[] = [];
  for (const r of rows) {
    const format = formatOf(r.source_format, r.path);
    if (f.format && format !== f.format) continue;
    const headingPath = [r.chapter_title, r.subchapter_title, ...parseJson<string[]>(r.heading_path, [])].filter((x) => x && x !== NO_CHAPTER_TITLE) as string[];
    if (heading && !headingPath.some((h) => h.toLowerCase().includes(heading))) continue;
    const base = { snippetId: r.id, seq: Number(r.seq), documentId: r.document_id, path: r.path, format, headingPath, locator: parseJson(r.locator, null), lineStart: Number(r.line_start), lineEnd: Number(r.line_end) };
    const parts = chunkParts(r.text, r.kind);
    if (!parts.length) out.push({ ...base, part: null, parts: 0, text: r.text, context: null });
    else for (const p of parts) out.push({ ...base, part: p.no, parts: parts.length, text: p.text, context: p.overlap });
  }
  return out;
}

/** Neugewichtung der Kandidaten: Überschriften-Treffer und gemeinsame Wortpaare zählen zusätzlich */
function rerank(question: string, c: { score: number; text: string; headingPath: string[] }) {
  const q = tokenize(question);
  const head = keywordScore(question, c.headingPath.join(' '));
  const pairs = new Set(q.slice(1).map((t, i) => `${q[i]} ${t}`));
  const t = tokenize(c.text);
  const tp = new Set(t.slice(1).map((x, i) => `${t[i]} ${x}`));
  const bigram = pairs.size ? [...pairs].filter((p) => tp.has(p)).length / pairs.size : 0;
  return 0.6 * c.score + 0.25 * head + 0.15 * bigram;
}

/** Retrieval-Verfahren (ADR-099): v2 = Morphologie, Abfrageerweiterung, BM25 + Vektor per RRF, Relevanzschwelle, MMR; v1 = bisher */
export type RetrievalMethod = 'v1' | 'v2';
export const DEFAULT_METHOD: RetrievalMethod = 'v2';

/** Synonyme, Übersetzungen und Abkürzungen des Projekts für die Abfrageerweiterung */
async function lexicon(ctx: Ctx): Promise<Lexicon> {
  const groups: string[][] = [];
  for (const r of await ctx.db.all("SELECT preferred, avoid, translations FROM terminology_terms WHERE project_id = ? AND status = 'active'", ctx.projectId)) {
    const tr = Object.values(parseJson<Record<string, { term?: string }>>(r.translations, {})).map((t) => t?.term?.trim()).filter(Boolean) as string[];
    groups.push([String(r.preferred), ...parseJson<string[]>(r.avoid, []), ...tr]);
  }
  for (const r of await ctx.db.all('SELECT abbreviation, expansion FROM abbreviations WHERE project_id = ?', ctx.projectId)) groups.push([String(r.abbreviation), String(r.expansion)]);
  return { groups: groups.map((g) => [...new Set(g.map((x) => x.trim()).filter(Boolean))]).filter((g) => g.length > 1) };
}

// Index je Bestand und Rahmen zwischenspeichern: neue Revisionen ergeben neue Chunk-IDs und damit einen neuen Schlüssel
const INDEX_CACHE_MAX = 6;
const indexCache = new Map<string, Index>();
function indexFor(projectId: string, all: { snippetId: string; part: number | null; text: string; headingPath: string[]; path: string }[]) {
  const key = sha256(`${projectId}|${all.map((u) => `${u.snippetId}:${u.part ?? ''}:${u.text.length}`).join(',')}`);
  let idx = indexCache.get(key);
  if (idx) {
    indexCache.delete(key);
    indexCache.set(key, idx);
    return idx;
  }
  idx = buildIndex(all.map((u) => ({ text: u.text, header: `${u.path.replace(/\.[^.]+$/, '').replace(/[/_-]+/g, ' ')} ${u.headingPath.join(' ')}` })));
  indexCache.set(key, idx);
  if (indexCache.size > INDEX_CACHE_MAX) indexCache.delete(indexCache.keys().next().value!);
  return idx;
}

/** `log: false` für Prüfläufe (ADR-091): keine Einträge im Frageprotokoll, der Lauf selbst wird protokolliert */
export async function askSources(ctx: Ctx, input: any, user: User, opts: { log?: boolean; method?: 'v1' | 'v2' } = {}) {
  const question = String(input?.question ?? '').trim();
  if (question.length < 3 || question.length > 500) throw badRequest('Frage mit 3 bis 500 Zeichen erforderlich.');
  const language = input?.language === 'en' ? 'en' : 'de';
  const filters = cleanFilters(input?.filters ?? {});
  const names = await privacyNames(ctx.db);
  if ((ctx.embeddings.external || ctx.llm?.external) && detectPrivacy(question, { names }).length) {
    throw unprocessable('Die Frage enthält mögliche personenbezogene Daten und wird nicht an externe Dienste übertragen.');
  }
  const sensitive = (text: string) => detectPrivacy(text, { names }).length > 0;
  const all = (await units(ctx, filters)).filter((u) => !(ctx.embeddings.external && sensitive(u.text)));

  // 1. hybride Suche: Begriffe (Stämme) für alle Einheiten, Vektor nur für die besten 200 nach Begriffen und alle ohne Treffer
  // aus kleinen Beständen – so bleibt die Zahl der Embeddings begrenzt
  const method: RetrievalMethod = opts.method ?? (input?.method === 'v1' ? 'v1' : DEFAULT_METHOD);
  let ranked: (typeof all[number] & { score: number; kw: number })[] = [];
  let retrieval: { method: RetrievalMethod; expansions: string[]; unknownTerms: string[]; bestCoverage: number | null } = { method, expansions: [], unknownTerms: [], bestCoverage: null };
  let query: ReturnType<typeof analyzeQuery> | null = null;
  let index: Index | null = null;
  if (all.length && method === 'v2') {
    index = indexFor(ctx.projectId, all);
    query = analyzeQuery(question, index, await lexicon(ctx), { language });
    // Vektor für die besten 200 nach BM25 bzw. für alle Einheiten kleiner Bestände (Kontextkopf vor dem Text)
    const lexOrder = all.map((_, i) => ({ i, s: bm25(index!, query!, i) })).sort((a, b) => b.s - a.s);
    const pool = all.length <= 400 ? lexOrder.map((x) => x.i) : lexOrder.slice(0, 200).map((x) => x.i);
    const [qv, ...pv] = await embedTexts(ctx, [query.text, ...pool.map((i) => `${all[i].headingPath.join(' – ')}: ${all[i].context ? `${all[i].context} ` : ''}${all[i].text}`)]);
    const sims: (number | null)[] = all.map(() => null);
    pool.forEach((i, k) => (sims[i] = Math.max(0, dot(qv, pv[k]))));
    const r = rankV2(index, query, sims, { candidates: CANDIDATES, passages: PASSAGES });
    ranked = r.ranked.map((x) => ({ ...all[x.i], score: x.score, kw: x.coverage }));
    retrieval = { method, expansions: query.expansions, unknownTerms: query.concepts.filter((c) => !c.known).map((c) => c.word), bestCoverage: Math.round(r.best * 100) / 100 };
  } else if (all.length) {
    const kwAll = all.map((u) => keywordScore(question, `${u.headingPath.join(' ')} ${u.text}`));
    const order = all.map((_, i) => i).sort((a, b) => kwAll[b] - kwAll[a]);
    const pool = (all.length <= 400 ? order : order.slice(0, 200)).map((i) => ({ ...all[i], kw: kwAll[i] }));
    const [qv, ...pv] = await embedTexts(ctx, [question, ...pool.map((u) => `${u.headingPath.join(' – ')}: ${u.context ? `${u.context} ` : ''}${u.text}`)]);
    // ein einzelnes gemeinsames Wort („gelten“) ist noch kein Beleg: Mindestanteil der Fragewörter oder deutliche Ähnlichkeit
    const scored = pool.map((u, i) => ({ ...u, sim: Math.max(0, dot(qv, pv[i])) })).map((u) => ({ ...u, score: 0.5 * u.sim + 0.5 * u.kw }))
      .filter((u) => u.kw >= MIN_KEYWORDS || u.sim >= MIN_SIMILARITY).sort((a, b) => b.score - a.score).slice(0, CANDIDATES);
    // 2. Neugewichtung der Top 20 → Top 6
    ranked = scored.map((u) => ({ ...u, score: rerank(question, u) })).sort((a, b) => b.score - a.score).slice(0, PASSAGES);
  }
  const passages: (Passage & { file: string })[] = ranked.map((u, i) => ({ label: `P${i + 1}`, text: u.text, chapter: u.headingPath.join(' › ') || u.path, section: '', file: u.path }));

  // 3. Antwort nur aus den Belegen
  let mode: 'llm' | 'extractive' | 'none' = 'none';
  let sentences: { text: string; sources: string[] }[] = [];
  let dropped = 0;
  let notice: string | null = null;
  const forLlm = ctx.llm?.external ? passages.filter((p) => !sensitive(p.text)) : passages;
  if (forLlm.length && ctx.llm) {
    try {
      // Begriffe aus der Abfrageerweiterung mitgeben (Händler → Dealer), damit die KI die Belege der Frage zuordnet
      const llmQuestion = retrieval.expansions.length ? `${question}\n(In den Quellen auch: ${retrieval.expansions.join(', ')})` : question;
      const res = await ctx.llm.complete(buildSourcesPrompt(llmQuestion, forLlm, language));
      const parsed = parseAssistantResponse(res.text);
      const checked = checkSentences(parsed, forLlm.map((p) => ({ label: p.label, snippetId: p.label, seq: 0, text: p.text })), { minSupport: (await getSettings(ctx.db)).rewrite.minSupport });
      sentences = checked.filter((c) => !c.issues.length).map((c) => ({ text: c.text, sources: c.sourceLabels }));
      dropped = checked.length - sentences.length;
      mode = 'llm';
      if (!parsed.length) notice = 'Die Quellen enthalten dazu keine eindeutige Aussage.';
      else if (!sentences.length) notice = 'Die KI-Antwort war nicht durch die Quellen belegt – es folgen die passenden Stellen.';
    } catch (e) {
      notice = `KI-Dienst nicht verfügbar (${(e as Error).message}) – es folgen die passenden Stellen.`;
    }
  }
  if (passages.length && !sentences.length && !(mode === 'llm' && notice?.startsWith('Die Quellen'))) {
    sentences = query ? answerSentences(query, index, passages.map((p, i) => ({ ...p, header: ranked[i].headingPath.join(' ') })), 3, question) : extractiveAnswer(question, passages);
    mode = sentences.length ? 'extractive' : 'none';
  }
  if (!sentences.length) notice ??= all.length ? 'Die Quellen enthalten dazu keine Aussage.' : 'Keine Quellen im gewählten Rahmen.';

  const cited = [...new Set(sentences.flatMap((s) => s.sources))];
  const sources = cited.map((label, i) => {
    const u = ranked[passages.findIndex((p) => p.label === label)];
    return {
      n: i + 1, snippetId: u.snippetId, seq: u.seq, part: u.part, parts: u.parts, documentId: u.documentId, path: u.path, format: u.format,
      headingPath: u.headingPath, locator: u.locator, lineStart: u.lineStart, lineEnd: u.lineEnd, text: u.text, score: Math.round(u.score * 100) / 100,
    };
  });
  const number = new Map(cited.map((l, i) => [l, i + 1]));
  const answer = sentences.map((s) => ({ text: s.text, sources: s.sources.map((l) => number.get(l)!).filter(Boolean) }));
  const id = newId('mask');
  if (opts.log !== false) await ctx.db.tx(async () => {
    await ctx.db.run(
      'INSERT INTO metadata_ask_log (id, project_id, user_id, question, filters, mode, answer, sources, provider, model, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, ctx.projectId, user.id, question, json(filters), mode, json(answer), json(sources), mode === 'llm' ? ctx.llm!.id : null, mode === 'llm' ? ctx.llm!.model : null, now(),
    );
    if (mode === 'llm') await audit(ctx, user.id, 'metadata.asked', 'metadata_ask', id, { provider: ctx.llm!.id, model: ctx.llm!.model, promptVersion: SOURCES_PROMPT_VERSION, passages: ranked.map((u) => u.snippetId), external: ctx.llm!.external });
  });
  return {
    id, question, language, filters, mode, answer, sources, notice, dropped, candidates: ranked.length, searched: all.length, retrieval,
    // alle gefundenen Stellen in Rangfolge (auch nicht zitierte) – für die Trefferquote (ADR-091)
    retrieved: ranked.map((u, i) => ({ rank: i + 1, snippetId: u.snippetId, documentId: u.documentId, path: u.path, format: u.format, headingPath: u.headingPath, locator: u.locator, lineStart: u.lineStart, score: Math.round(u.score * 100) / 100 })),
    // Antworttext mit Belegnummern, z. B. zum Speichern als Frage & Antwort
    answerText: answer.map((s) => `${s.text}${s.sources.length ? ` [${s.sources.join(', ')}]` : ''}`).join(' '),
  };
}

/**
 * Gespeicherte Frage erneut stellen (gleicher Rahmen) und mit dem gespeicherten Stand vergleichen:
 * Belege neu, entfallen, gleich; Antwort wortweise.
 */
export async function reaskQa(ctx: Ctx, qaId: string, user: User) {
  const r = await ctx.db.get('SELECT * FROM metadata_qa WHERE id = ? AND project_id = ?', qaId, ctx.projectId);
  if (!r) throw notFound(`Frage ${qaId}`);
  const current = await askSources(ctx, { question: r.question, language: r.language, filters: parseJson(r.filters, {}) }, user);
  const before = new Set(parseJson<{ snippetId: string }[]>(r.sources, []).map((s) => s.snippetId));
  const after = new Set(current.sources.map((s) => s.snippetId));
  const plain = (t: string) => t.replace(/\s*\[\d+(?:,\s*\d+)*\]/g, '').trim();
  return {
    qaId, saved: { answer: r.answer, sources: parseJson(r.sources, []), savedAt: r.updated_at }, current,
    changes: {
      sourcesAdded: [...after].filter((x) => !before.has(x)), sourcesRemoved: [...before].filter((x) => !after.has(x)), sourcesKept: [...after].filter((x) => before.has(x)),
      answerChanged: plain(r.answer) !== plain(current.answerText), diff: wordDiff(plain(r.answer), plain(current.answerText)),
    },
  };
}

/** Export der gespeicherten Fragen und Antworten (Filter wie in der Liste) */
export async function exportQa(ctx: Ctx, format: string, opts: Parameters<typeof listQa>[1]) {
  if (!['csv', 'xlsx', 'json'].includes(format)) throw badRequest('format muss csv, xlsx oder json sein.');
  const items = await listQa(ctx, opts);
  const date = now().slice(0, 10);
  if (format === 'json') return { fileName: `fragen-antworten-${date}.json`, contentType: 'application/json; charset=utf-8', data: Buffer.from(JSON.stringify(items, null, 2), 'utf8') };
  const rows = items.map((q) => ({
    Frage: q.question, Antwort: q.answer, Sprache: q.language, Labels: q.labels.map((l) => l.nameDe).join('; '),
    Quellen: q.sources.map((s: any) => `${s.path}${s.locator?.page ? ` S. ${s.locator.page}` : s.locator?.slide ? ` Folie ${s.locator.slide}` : s.locator?.time ? ` bei ${s.locator.time}` : ` Z. ${s.lineStart}`}`).join('; '),
    Notiz: q.note ?? '', 'Erstellt von': q.createdBy, 'Erstellt am': q.createdAt, 'Geändert am': q.updatedAt,
  }));
  const header = ['Frage', 'Antwort', 'Sprache', 'Labels', 'Quellen', 'Notiz', 'Erstellt von', 'Erstellt am', 'Geändert am'] as const;
  if (format === 'csv') {
    // Formeln entschärfen (CSV-Injection), Semikolon für deutsches Excel, BOM für Umlaute
    const cell = (v: string) => `"${(/^[=+\-@\t\r]/.test(v) ? `'${v}` : v).replace(/"/g, '""')}"`;
    const csv = [header.join(';'), ...rows.map((r) => header.map((h) => cell(String(r[h] ?? ''))).join(';'))].join('\r\n');
    return { fileName: `fragen-antworten-${date}.csv`, contentType: 'text/csv; charset=utf-8', data: Buffer.from(`﻿${csv}`, 'utf8') };
  }
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Fragen & Antworten');
  ws.addRow([...header]).font = { bold: true };
  for (const r of rows) ws.addRow(header.map((h) => r[h]));
  ws.columns.forEach((c, i) => (c.width = [50, 80, 8, 30, 50, 30, 14, 22, 22][i]));
  return { fileName: `fragen-antworten-${date}.xlsx`, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', data: Buffer.from(await wb.xlsx.writeBuffer()) };
}
