// Lasttest semantische Suche (ADR-024): importiert N Textabschnitte über die normale Pipeline, berechnet die Vektoren
// und misst Aufbau, Antwortzeit und Trefferquote der Suchverfahren exact, hnsw und pgvector (nur PostgreSQL mit pgvector).
//   npm run perf:semantic -w apps/server -- 50000
// Datenbank über DATABASE_URL (sonst temporäre SQLite-Datei).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import JSZip from 'jszip';
import { buildApp } from '../src/app.js';
import { createImport } from '../src/services/imports.js';
import { runIndexJob, semanticSearch } from '../src/services/semantic.js';
import { Hnsw, VectorStore } from '../src/domain/hnsw.js';
import { awaitHnsw, pgvectorAvailable } from '../src/services/vectorIndex.js';

const N = Number(process.argv[2] ?? 50_000);
const PER_FILE = 25;
const WORDS = ('Auftrag Vertrag Fahrzeug Kunde Rechnung Freigabe Werkstatt Ersatzteil Lieferung Bestellung Preis Rabatt Garantie Termin Händler Markt ' +
  'Zulassung Leasing Finanzierung Angebot Stammdaten Benutzer Rolle Sparte Release Status Prüfung Export Import Bericht Lager Menge Kasse Beleg Storno ' +
  'Mahnung Konto Buchung Steuer Zahlung Inventur Etikett Versand Retoure Reklamation Kulanz Wartung Inspektion Reifen Batterie Probefahrt').split(' ');
// mulberry32: ganzzahlig, lange Periode (ein Gleitkomma-LCG liefert hier nur wenige tausend verschiedene Texte)
let seed = 42;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const rnd = (n: number) => Math.floor(rand() * n);
const sentence = () => `${Array.from({ length: 8 + rnd(12) }, () => WORDS[rnd(WORDS.length)]).join(' ').toLowerCase().replace(/^./, (c) => c.toUpperCase())}.`;

const zip = new JSZip();
const files = Math.ceil(N / PER_FILE);
for (let f = 0; f < files; f++) {
  const c = f % 100;
  const paras = Array.from({ length: Math.min(PER_FILE, N - f * PER_FILE) }, (_, i) => `## ${c + 1}.${i + 1} Abschnitt ${i + 1}\n\n${sentence()} ${sentence()} (${f}-${i})\n`);
  zip.file(`kapitel-${c + 1}/datei-${f}.md`, `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n# ${c + 1}. Kapitel ${c + 1}\n\n${paras.join('\n')}`);
}
const data = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'onescm-perf-sem-'));
const { app, ctx } = await buildApp({ dataDir, logger: false, webDist: null, authMode: 'demo', vectorIndex: 'exact' });
const secs = (t0: number) => ((performance.now() - t0) / 1000).toFixed(1);
const lines: string[] = [];
const log = (s: string) => (console.log(s), lines.push(s));
log(`# Lasttest semantische Suche – ${N} Textabschnitte, Datenbank ${ctx.db.dialect}, Modell ${ctx.embeddings.model}`);
log('');

let t0 = performance.now();
await createImport(ctx, 'perf.zip', data, 'u-admin');
await ctx.jobs.idle(3_600_000);
const snippets = Number((await ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM text_snippets'))!.n);
log(`- Import (${files} Dateien, ZIP ${(data.length / 1024 / 1024).toFixed(1)} MB): ${secs(t0)} s, ${snippets} Textabschnitte`);
t0 = performance.now();
await runIndexJob(ctx);
log(`- Vektoren berechnen und speichern: ${secs(t0)} s`);

const queries = Array.from({ length: 50 }, () => sentence());
type Setting = 'exact' | 'hnsw' | 'pgvector' | 'auto';
async function measure(label: string, setting: Setting, expect: string) {
  ctx.config.vectorIndex = setting;
  let t = performance.now();
  const first = await semanticSearch(ctx, { q: queries[0], limit: 10 });
  const firstMs = performance.now() - t;
  let prepare = '';
  if (setting === 'hnsw') {
    t = performance.now();
    await awaitHnsw(ctx);
    prepare = `HNSW-Aufbau ${secs(t)} s`;
  }
  const times: number[] = [];
  const hits: string[][] = [];
  for (const q of queries) {
    t = performance.now();
    const r = await semanticSearch(ctx, { q, limit: 10, minScore: -1 });
    times.push(performance.now() - t);
    if (`${r.engine}${r.approximate ? '' : ' exakt'}` !== expect) throw new Error(`erwartet ${expect}, verwendet ${r.engine}/${r.approximate}`);
    hits.push(r.hits.map((h) => `${h.score.toFixed(3)}`));
  }
  times.sort((a, b) => a - b);
  const p = (q: number) => times[Math.min(times.length - 1, Math.floor(times.length * q))].toFixed(1);
  return { label, firstMs: firstMs.toFixed(0), prepare, p50: p(0.5), p95: p(0.95), hits, indexed: first.indexed };
}

const results = [await measure('exakt (Speicher)', 'exact', 'exact exakt'), await measure('HNSW (Speicher)', 'hnsw', 'hnsw')];
if (await pgvectorAvailable(ctx.db)) {
  results.push(await measure('pgvector HNSW-Index', 'pgvector', 'pgvector'));
}
// Trefferquote: Anteil der Treffer, deren Ähnlichkeit mindestens die zehntbeste der exakten Suche erreicht (Gleichstände zählen)
const exact = results[0].hits;
log('');
log('**Suche über die API-Schicht** (lokales Hash-Modell, 50 Anfragen, je 10 Treffer)');
log('');
log('| Verfahren | erste Suche (inkl. Laden/Synchronisieren) | Vorbereitung | Antwortzeit p50 | p95 | Recall@10 |');
log('|---|---|---|---|---|---|');
for (const r of results) {
  const recall = r.hits.reduce((n, h, i) => n + h.filter((s) => Number(s) >= Number(exact[i][9] ?? -1) - 0.0005).length / 10, 0) / r.hits.length;
  log(`| ${r.label} | ${r.firstMs} ms | ${r.prepare || '–'} | ${r.p50} ms | ${r.p95} ms | ${recall.toFixed(3)} |`);
}

// Gruppierte Vektoren wie bei semantischen Embedding-Modellen (Themen bilden Häufungen) – reiner Indexvergleich
{
  const g = () => Math.sqrt(-2 * Math.log(rand() + 1e-12)) * Math.cos(2 * Math.PI * rand());
  const D = 384;
  const norm = (x: Float32Array) => {
    let n = 0;
    for (const y of x) n += y * y;
    n = Math.sqrt(n);
    return x.map((y) => y / n);
  };
  const centers = Array.from({ length: 1000 }, () => norm(Float32Array.from({ length: D }, g)));
  const near = (c: Float32Array) => norm(c.map((x) => x + 0.04 * g()));
  const store = new VectorStore(D, N);
  for (let i = 0; i < N; i++) store.push(near(centers[i % centers.length]));
  let t = performance.now();
  const h = new Hnsw(store);
  while (h.size < store.count) h.insertNext();
  const build = secs(t);
  const qs = Array.from({ length: 100 }, (_, i) => near(centers[(i * 37) % centers.length]));
  t = performance.now();
  const ex = qs.map((q) => store.exact(q, 10));
  const exMs = ((performance.now() - t) / qs.length).toFixed(1);
  log('');
  log(`**Reiner Indexvergleich mit gruppierten Vektoren** (${N} Vektoren, 384 Dimensionen, 1000 Themen – Verteilung wie bei semantischen Modellen; 100 Anfragen)`);
  log('');
  log('| Verfahren | Aufbau | Antwortzeit je Anfrage | Recall@10 |');
  log('|---|---|---|---|');
  log(`| exakt | – | ${exMs} ms | 1.000 |`);
  for (const ef of [100, 400, 800]) {
    t = performance.now();
    let rec = 0;
    qs.forEach((q, i) => {
      const kth = ex[i][9].score - 1e-6;
      rec += h.search(q, 10, ef).filter((a) => a.score >= kth).length / 10;
    });
    log(`| HNSW (M=12, efConstruction=64, ef=${ef}) | ${build} s | ${((performance.now() - t) / qs.length).toFixed(2)} ms | ${(rec / qs.length).toFixed(3)} |`);
  }
}
log('');
log(`Speicher (RSS) ${(process.memoryUsage().rss / 1024 / 1024).toFixed(0)} MB`);
if (process.env.PERF_REPORT) fs.writeFileSync(process.env.PERF_REPORT, `${lines.join('\n')}\n`);
await app.close();
fs.rmSync(dataDir, { recursive: true, force: true });
