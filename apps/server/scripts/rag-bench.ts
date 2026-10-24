// Messung der RAG-Komponente „Frage an alle Quellen“ (ADR-099) am fiktiven Messbestand (scripts/fixtures/rag-benchmark.ts):
// Trefferquote@1/3/6, MRR, nDCG@6, Recall@6, Beleg richtig, Stichworte, richtige Enthaltung bei Lückenfragen, Dubletten
// unter den Belegen, Laufzeit – je Verfahren (v1 = bisherige Gewichtung, v2 = neue Pipeline) und je Fragentyp.
//   npx tsx scripts/rag-bench.ts [v1,v2] [--md Datei]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import JSZip from 'jszip';
import { buildApp } from '../src/app.js';
import { matches } from '../src/domain/evaluation.js';
import { createImport } from '../src/services/imports.js';
import { askSources } from '../src/services/metadataAsk.js';
import { BENCH_ABBREVIATIONS, BENCH_DOCS, BENCH_HOLDOUT, BENCH_QUESTIONS, BENCH_TERMS, type BenchKind } from './fixtures/rag-benchmark.js';

const methods = (process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'v1,v2').split(',') as ('v1' | 'v2')[];
const mdIdx = process.argv.indexOf('--md');
const mdFile = mdIdx > 0 ? process.argv[mdIdx + 1] : null;
// --holdout: zurückgehaltener Prüfsatz statt der Abstimmungsfragen
const holdout = process.argv.includes('--holdout');
const QUESTIONS = holdout ? BENCH_HOLDOUT : BENCH_QUESTIONS;

const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'onescm-rag-bench-'));
const { app, ctx } = await buildApp({ dataDir, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'none' } as any, vectorIndex: 'exact' });
const user = { id: 'u-admin', name: 'Admin', permissions: ['read', 'edit', 'admin'] } as any;
const inject = async (method: 'POST' | 'PATCH', url: string, payload: unknown) => {
  const r = await app.inject({ method, url: `/api/v1${url}`, payload: payload as any, headers: { 'x-user-id': 'u-admin' } });
  if (r.statusCode >= 300) throw new Error(`${method} ${url}: ${r.statusCode} ${r.body}`);
};
await inject('PATCH', '/projects/p_default', { languages: ['en'] });
for (const t of BENCH_TERMS) {
  await inject('POST', '/terminology', { preferred: t.preferred, avoid: t.avoid, translations: Object.fromEntries(Object.entries(t.translations ?? {}).map(([l, term]) => [l, { term }])) });
}
for (const a of BENCH_ABBREVIATIONS) await inject('POST', '/abbreviations', a);
const zip = new JSZip();
for (const d of BENCH_DOCS) zip.file(d.name, d.text);
await createImport(ctx, 'rag-bench.zip', await zip.generateAsync({ type: 'nodebuffer' }), 'u-admin');
await ctx.jobs.idle(120_000);

const KINDS: BenchKind[] = ['direkt', 'umschreibung', 'synonym', 'kompositum', 'abkuerzung', 'kennung', 'englisch', 'luecke'];
const round = (n: number) => Math.round(n * 1000) / 1000;
const lines: string[] = [];
const log = (s = '') => (console.log(s), lines.push(s));
log(`# Messung RAG – ${BENCH_DOCS.length} Dokumente, ${QUESTIONS.length} Fragen (${holdout ? 'Prüfsatz' : 'Abstimmungssatz'}), Datenbank ${ctx.db.dialect}, Embeddings ${ctx.embeddings.model}`);

const summary: Record<string, any> = {};
for (const method of methods) {
  const rows: any[] = [];
  for (const b of QUESTIONS) {
    const t0 = performance.now();
    const res = await askSources(ctx, { question: b.q, language: b.language ?? 'de' }, user, { log: false, method });
    const ms = performance.now() - t0;
    const exp = b.path || b.heading ? [{ path: b.path, heading: b.heading }] : [];
    const rel = (f: any) => exp.some((e) => matches(f, e));
    const retrieved = res.retrieved as any[];
    const idx = retrieved.findIndex(rel);
    const rank = idx >= 0 ? idx + 1 : null;
    // nDCG@6 mit binärer Relevanz; ideal: so viele relevante Stellen wie es gibt (höchstens 6)
    const gains: number[] = retrieved.slice(0, 6).map((f) => (rel(f) ? 1 : 0));
    const relevantTotal = Math.max(1, gains.filter(Boolean).length);
    const dcg = gains.reduce((s, g, i) => s + g / Math.log2(i + 2), 0);
    const idcg = Array.from({ length: relevantTotal }, (_, i) => 1 / Math.log2(i + 2)).reduce((a, b) => a + b, 0);
    const texts = retrieved.map((f) => f.snippetId);
    const dup = (res as any).sources.length - new Set((res as any).sources.map((s: any) => s.text)).size;
    const answered = res.answer.length > 0;
    const text = res.answerText.toLowerCase();
    const kw = b.keywords ?? [];
    const kwHits = answered ? kw.filter((k) => text.includes(k.toLowerCase())).length : 0;
    const cited = (res as any).sources.some(rel);
    const passed = b.kind === 'luecke' ? !answered : answered && cited && (!kw.length || kwHits / kw.length >= 0.5);
    rows.push({ b, rank, ndcg: rank ? dcg / idcg : 0, answered, cited, kwHits, kw: kw.length, dup, passed, ms, top: retrieved[0]?.path, n: texts.length });
  }
  const pos = rows.filter((r) => r.b.kind !== 'luecke');
  const neg = rows.filter((r) => r.b.kind === 'luecke');
  const at = (k: number) => round(pos.filter((r) => r.rank && r.rank <= k).length / pos.length);
  const m = {
    passRate: round(rows.filter((r) => r.passed).length / rows.length),
    hitAt1: at(1), hitAt3: at(3), hitAt6: at(6),
    mrr: round(pos.reduce((s, r) => s + (r.rank ? 1 / r.rank : 0), 0) / pos.length),
    ndcg6: round(pos.reduce((s, r) => s + r.ndcg, 0) / pos.length),
    citedRate: round(pos.filter((r) => r.cited).length / pos.length),
    keywordCoverage: round(pos.reduce((s, r) => s + (r.kw ? r.kwHits / r.kw : 1), 0) / pos.length),
    abstention: round(neg.filter((r) => !r.answered).length / neg.length),
    duplicateSources: rows.reduce((s, r) => s + r.dup, 0),
    avgMs: round(rows.reduce((s, r) => s + r.ms, 0) / rows.length),
  };
  summary[method] = m;
  log();
  log(`## Verfahren ${method}`);
  log();
  log('| Kennzahl | Wert |');
  log('|---|---|');
  for (const [k, v] of Object.entries(m)) log(`| ${k} | ${v} |`);
  log();
  log('| Fragentyp | Fragen | bestanden | Treffer@1 | Treffer@6 |');
  log('|---|---|---|---|---|');
  for (const kind of KINDS) {
    const of = rows.filter((r) => r.b.kind === kind);
    log(`| ${kind} | ${of.length} | ${of.filter((r) => r.passed).length} | ${kind === 'luecke' ? '–' : of.filter((r) => r.rank === 1).length} | ${kind === 'luecke' ? '–' : of.filter((r) => r.rank && r.rank <= 6).length} |`);
  }
  log();
  log('Nicht bestanden:');
  for (const r of rows.filter((x) => !x.passed)) log(`- [${r.b.kind}] ${r.b.q} → Rang ${r.rank ?? '–'}, beantwortet ${r.answered ? 'ja' : 'nein'}, Beleg ${r.cited ? 'ja' : 'nein'}, Stichworte ${r.kwHits}/${r.kw}, erster Treffer ${r.top ?? '–'}`);
}
if (mdFile) fs.writeFileSync(mdFile, `${lines.join('\n')}\n`);
console.log(JSON.stringify(summary));
await app.close();
fs.rmSync(dataDir, { recursive: true, force: true });
