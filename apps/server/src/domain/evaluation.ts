// Antwortqualität (ADR-091, Etappe 39 / M7): Testfragen mit erwarteten Quellen und Stichworten bewerten und zu
// Kennzahlen zusammenfassen – Trefferquote (Treffer@1/3/6), mittlerer reziproker Rang (MRR), Antwort mit richtigem
// Beleg, Stichwort-Abdeckung und richtige Nicht-Antworten bei Lückenfragen.
import { mapHeader } from './tabular.js';

export interface Expectation { path?: string; heading?: string }
export interface EvalItem { question: string; expected: Expectation[]; keywords: string[]; expectNoAnswer: boolean; note?: string | null }
export interface Found { path: string; headingPath: string[] }
export interface ItemScore { rank: number | null; cited: boolean; answered: boolean; keywordHits: number; keywordTotal: number; passed: boolean; ndcg: number }

export const MAX_ITEMS = 500;
/** Stichworte gelten als abgedeckt ab diesem Anteil */
export const KEYWORD_PASS = 0.5;

const fold = (s: string) => s.toLocaleLowerCase('de').normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/\\/g, '/').replace(/\s+/g, ' ').trim();

/** Stelle passt zu einer Erwartung: Pfad enthält den erwarteten Pfad(-teil), Überschriftenpfad enthält die Überschrift */
export function matches(found: Found, e: Expectation): boolean {
  if (!e.path && !e.heading) return false;
  if (e.path && !fold(found.path).includes(fold(e.path))) return false;
  if (e.heading && !found.headingPath.some((h) => fold(h).includes(fold(e.heading!)))) return false;
  return true;
}

export function scoreItem(item: EvalItem, res: { retrieved: Found[]; sources: Found[]; answerText: string; answered: boolean }): ItemScore {
  const hit = (f: Found) => item.expected.some((e) => matches(f, e));
  const idx = res.retrieved.findIndex(hit);
  const rank = idx >= 0 ? idx + 1 : null;
  // nDCG@6 (binäre Relevanz, ADR-099): wie weit oben die passenden Stellen stehen – ideal: alle gefundenen passenden ganz oben
  const gains = res.retrieved.slice(0, 6).map((f) => (hit(f) ? 1 : 0));
  const dcg = gains.reduce((s: number, g, i) => s + g / Math.log2(i + 2), 0);
  const idcg = Array.from({ length: gains.filter(Boolean).length }, (_, i) => 1 / Math.log2(i + 2)).reduce((a, b) => a + b, 0);
  const ndcg = idcg ? Math.round((dcg / idcg) * 1000) / 1000 : 0;
  const cited = res.sources.some(hit);
  const text = fold(res.answerText);
  const keywordHits = res.answered ? item.keywords.filter((k) => text.includes(fold(k))).length : 0;
  const keywordTotal = item.keywords.length;
  let passed: boolean;
  if (item.expectNoAnswer) passed = !res.answered;
  else {
    passed = res.answered;
    if (item.expected.length) passed &&= cited;
    if (keywordTotal) passed &&= keywordHits / keywordTotal >= KEYWORD_PASS;
  }
  return { rank, cited, answered: res.answered, keywordHits, keywordTotal, passed, ndcg };
}

export interface Metrics {
  questions: number; passed: number; passRate: number;
  withSources: number; hitAt1: number; hitAt3: number; hitAt6: number; mrr: number; ndcg6: number; citedRate: number;
  answerable: number; answeredRate: number;
  withKeywords: number; keywordCoverage: number;
  noAnswerItems: number; noAnswerAccuracy: number;
  avgMs: number;
}

const ratio = (n: number, d: number) => (d ? Math.round((n / d) * 1000) / 1000 : 0);

export function aggregate(rows: { item: EvalItem; score: ItemScore; ms: number }[]): Metrics {
  const src = rows.filter((r) => !r.item.expectNoAnswer && r.item.expected.length);
  const pos = rows.filter((r) => !r.item.expectNoAnswer);
  const kw = rows.filter((r) => !r.item.expectNoAnswer && r.score.keywordTotal);
  const neg = rows.filter((r) => r.item.expectNoAnswer);
  const at = (k: number) => ratio(src.filter((r) => r.score.rank !== null && r.score.rank <= k).length, src.length);
  return {
    questions: rows.length, passed: rows.filter((r) => r.score.passed).length, passRate: ratio(rows.filter((r) => r.score.passed).length, rows.length),
    withSources: src.length, hitAt1: at(1), hitAt3: at(3), hitAt6: at(6),
    mrr: src.length ? Math.round((src.reduce((s, r) => s + (r.score.rank ? 1 / r.score.rank : 0), 0) / src.length) * 1000) / 1000 : 0,
    ndcg6: src.length ? Math.round((src.reduce((s, r) => s + (r.score.ndcg ?? 0), 0) / src.length) * 1000) / 1000 : 0,
    citedRate: ratio(src.filter((r) => r.score.cited).length, src.length),
    answerable: pos.length, answeredRate: ratio(pos.filter((r) => r.score.answered).length, pos.length),
    withKeywords: kw.length, keywordCoverage: kw.length ? Math.round((kw.reduce((s, r) => s + r.score.keywordHits / r.score.keywordTotal, 0) / kw.length) * 1000) / 1000 : 0,
    noAnswerItems: neg.length, noAnswerAccuracy: ratio(neg.filter((r) => !r.score.answered).length, neg.length),
    avgMs: rows.length ? Math.round(rows.reduce((s, r) => s + r.ms, 0) / rows.length) : 0,
  };
}

const list = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : String(v ?? '').split(/\r?\n|\|/)).map((x) => x.trim()).filter(Boolean);
const yes = (v: unknown) => v === true || /^(1|ja|yes|true|x|lücke|luecke|gap)$/i.test(String(v ?? '').trim());

/** Erwartungen aus Pfaden („handbuch/vertraege.md“) bzw. „Pfad > Überschrift“ oder „Pfad#Überschrift“ */
function expectations(paths: string[], headings: string[]): Expectation[] {
  const out: Expectation[] = paths.map((p) => {
    const m = /^(.*?)\s*(?:#|>|›)\s*(.+)$/.exec(p);
    return m && m[1] ? { path: m[1].trim(), heading: m[2].trim() } : { path: p };
  });
  // Überschriften ohne Pfad: eigene Erwartung, mit genau einem Pfad: zusammen
  if (headings.length && out.length === 1 && !out[0].heading) return headings.map((h) => ({ ...out[0], heading: h }));
  return [...out, ...headings.map((heading) => ({ heading }))];
}

export function normalizeItem(raw: any): EvalItem | null {
  const question = String(raw?.question ?? '').replace(/\s+/g, ' ').trim();
  if (question.length < 3 || question.length > 500) return null;
  const expected = Array.isArray(raw?.expected)
    ? raw.expected.map((e: any) => (typeof e === 'string' ? expectations([e], [])[0] : { path: e?.path ? String(e.path).trim().slice(0, 300) || undefined : undefined, heading: e?.heading ? String(e.heading).trim().slice(0, 200) || undefined : undefined }))
      .filter((e: Expectation) => e.path || e.heading)
    : [];
  return {
    question, expected: expected.slice(0, 20), keywords: list(raw?.keywords).map((k) => k.slice(0, 100)).slice(0, 20), expectNoAnswer: yes(raw?.expectNoAnswer),
    note: raw?.note ? String(raw.note).slice(0, 1000) : null,
  };
}

const FIELDS = {
  question: ['Frage', 'Testfrage', 'Question'],
  source: ['Erwartete Quelle', 'Erwartete Quellen', 'Quelle', 'Quellen', 'Datei', 'Expected source', 'Expected sources', 'Source', 'Sources'],
  heading: ['Erwartete Überschrift', 'Überschrift', 'Kapitel', 'Expected heading', 'Heading'],
  keywords: ['Stichworte', 'Stichwörter', 'Erwartete Begriffe', 'Begriffe', 'Keywords'],
  noAnswer: ['Keine Antwort', 'Keine Antwort erwartet', 'Lücke', 'Lückenfrage', 'No answer', 'Gap'],
  note: ['Notiz', 'Bemerkung', 'Note'],
};

/** Testfragen aus Tabelle (erste Zeile Spaltennamen); Listen in einer Zelle mit „|“ oder Zeilenumbruch, Stichworte auch mit „,“ */
export function itemsFromTable(rows: string[][]): EvalItem[] {
  if (!rows.length) return [];
  const h = mapHeader(rows[0], FIELDS);
  if (h.question === undefined) throw new Error('Spalte „Frage“ fehlt.');
  const out: EvalItem[] = [];
  for (const r of rows.slice(1)) {
    const cell = (k: keyof typeof FIELDS) => (h[k] === undefined ? '' : r[h[k]] ?? '');
    const item = normalizeItem({
      question: cell('question'), expected: expectations(list(cell('source')), list(cell('heading'))),
      keywords: list(cell('keywords')).flatMap((k) => k.split(/[,;]/)), expectNoAnswer: cell('noAnswer'), note: cell('note'),
    });
    if (item) out.push(item);
    if (out.length >= MAX_ITEMS) break;
  }
  return out;
}

/** Testfragen aus JSON: Liste bzw. { items: [...] } mit question/frage, expected/quellen, keywords/stichworte, expectNoAnswer/keineAntwort */
export function itemsFromJson(text: string): EvalItem[] {
  let data: any;
  try {
    data = JSON.parse(text.replace(/^﻿/, ''));
  } catch {
    throw new Error('Kein gültiges JSON.');
  }
  const arr = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : null;
  if (!arr) throw new Error('Erwartet wird eine Liste von Testfragen.');
  return arr.slice(0, MAX_ITEMS).map((x: any) => normalizeItem({
    question: x?.question ?? x?.frage, expected: x?.expected ?? x?.quellen ?? x?.sources ?? [], keywords: x?.keywords ?? x?.stichworte ?? [],
    expectNoAnswer: x?.expectNoAnswer ?? x?.keineAntwort ?? x?.luecke, note: x?.note ?? x?.notiz,
  })).filter(Boolean) as EvalItem[];
}
