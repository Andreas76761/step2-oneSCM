// Vektorindex für die semantische Suche (ADR-024).
//   exact     Vektoren des Projekts im Speicher, vollständiger Durchlauf (bis ca. 50 000 Abschnitte im Millisekundenbereich)
//   hnsw      zusätzlich HNSW-Graph im Speicher, im Hintergrund aufgebaut (große Bestände)
//   pgvector  PostgreSQL mit Erweiterung pgvector und HNSW-Index in der Datenbank (mehrere Instanzen, kein Speicherbedarf je Instanz)
// Auswahl über VECTOR_INDEX (auto | exact | hnsw | pgvector). auto: pgvector, wenn verfügbar, sonst hnsw ab
// `semantic.annThreshold` Abschnitten, sonst exact. Die Tabelle `snippet_embeddings` bleibt die maßgebliche Quelle.
import type { EngineSetting } from '../config.js';
import type { Ctx } from '../context.js';
import { getSettings } from '../context.js';
import type { Db } from '../db.js';
import { Hnsw, VectorStore, type Neighbor } from '../domain/hnsw.js';

export type { EngineSetting };
import { decodeVector } from '../embeddings.js';

export type Engine = 'exact' | 'hnsw' | 'pgvector';

/** Aktuelle, nicht ausgeschlossene Abschnitte des Projekts mit gültigem Vektor (Textstand passt) */
const CURRENT_EMBEDDED = `FROM snippet_embeddings e JOIN text_snippets s ON s.id = e.snippet_id AND e.text_hash = s.text_hash
  JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
  WHERE d.project_id = ? AND r.is_current = 1 AND s.excluded_reason IS NULL AND s.kind <> 'code' AND e.model = ?`;

/**
 * Günstiger Änderungsschlüssel über Indizes: neue Vektoren, neue Revisionen (is_current wechselt nur beim Import)
 * und Befundentscheidungen (Ausschluss von Abschnitten). Unverändert → Signatur und Fehlstellen nicht neu prüfen.
 */
export async function changeKey(ctx: Ctx) {
  const e = await ctx.db.get<{ m: string | null }>('SELECT MAX(created_at) AS m FROM snippet_embeddings WHERE model = ?', ctx.embeddings.model);
  const r = await ctx.db.get<{ m: string | null; n: number }>(
    'SELECT MAX(r.imported_at) AS m, COUNT(*) AS n FROM source_revisions r JOIN source_documents d ON d.id = r.document_id WHERE d.project_id = ?', ctx.projectId,
  );
  const f = await ctx.db.get<{ m: string | null }>('SELECT MAX(decided_at) AS m FROM quality_findings WHERE project_id = ?', ctx.projectId);
  return `${e?.m ?? ''}|${r?.m ?? ''}|${r?.n ?? 0}|${f?.m ?? ''}`;
}

const lastSignature = new WeakMap<Db, Map<string, { change: string; sig: { count: number; key: string } }>>();

/** Signatur nur neu berechnen, wenn sich der Änderungsschlüssel geändert hat */
async function cachedSignature(ctx: Ctx, change?: string) {
  let m = lastSignature.get(ctx.db);
  if (!m) lastSignature.set(ctx.db, (m = new Map()));
  const key = `${ctx.projectId}|${ctx.embeddings.model}`;
  const hit = m.get(key);
  if (change && hit?.change === change) return hit.sig;
  const sig = await signature(ctx);
  if (change) m.set(key, { change, sig });
  return sig;
}

async function signature(ctx: Ctx) {
  const r = await ctx.db.get<{ n: number; m: string | null; q: number | null }>(
    `SELECT COUNT(*) AS n, MAX(e.created_at) AS m, SUM(s.seq) AS q ${CURRENT_EMBEDDED}`, ctx.projectId, ctx.embeddings.model,
  );
  return { count: Number(r?.n ?? 0), key: `${r?.n ?? 0}|${r?.m ?? ''}|${r?.q ?? 0}` };
}

// ------------------------------------------------------------------ Speicherindex (exact/hnsw)

interface MemIndex {
  signature: string;
  store: VectorStore | null;
  ids: string[];
  pos: Map<string, number>;
  alive: Uint8Array;
  aliveCount: number;
  hnsw: Hnsw | null;
  building: Promise<void> | null;
  buildMs: number | null;
}
const memIndexes = new WeakMap<Db, Map<string, MemIndex>>();

function emptyIndex(): MemIndex {
  return { signature: '', store: null, ids: [], pos: new Map(), alive: new Uint8Array(1024), aliveCount: 0, hnsw: null, building: null, buildMs: null };
}

async function refreshMem(ctx: Ctx, sig?: { count: number; key: string }): Promise<MemIndex> {
  let byKey = memIndexes.get(ctx.db);
  if (!byKey) memIndexes.set(ctx.db, (byKey = new Map()));
  const key = `${ctx.projectId}|${ctx.embeddings.model}`;
  let idx = byKey.get(key) ?? emptyIndex();
  sig ??= await signature(ctx);
  if (idx.signature === sig.key) return idx;
  // Viele gelöschte Einträge: neu aufbauen statt Grabsteine mitzuschleppen
  if (idx.store && idx.store.count > 1000 && idx.aliveCount < idx.store.count * 0.7) idx = emptyIndex();
  const live = new Set((await ctx.db.all<{ id: string }>(`SELECT e.snippet_id AS id ${CURRENT_EMBEDDED}`, ctx.projectId, ctx.embeddings.model)).map((r) => r.id));
  for (const [id, p] of idx.pos) {
    if (!live.has(id) && idx.alive[p]) {
      idx.alive[p] = 0;
      idx.aliveCount--;
    }
  }
  const added = [...live].filter((id) => !idx.pos.has(id) || !idx.alive[idx.pos.get(id)!]);
  for (let i = 0; i < added.length; i += 500) {
    const part = added.slice(i, i + 500);
    const rows = await ctx.db.all<{ snippet_id: string; vector: string }>(
      `SELECT snippet_id, vector FROM snippet_embeddings WHERE model = ? AND snippet_id IN (${part.map(() => '?').join(',')})`, ctx.embeddings.model, ...part,
    );
    for (const r of rows) {
      const v = decodeVector(r.vector);
      idx.store ??= new VectorStore(v.length, Math.max(1024, live.size));
      if (v.length !== idx.store.dims) continue; // Modellwechsel ohne Neuberechnung
      const p = idx.store.push(v);
      idx.ids[p] = r.snippet_id;
      idx.pos.set(r.snippet_id, p);
      if (idx.alive.length <= p) {
        const grown = new Uint8Array(Math.max(idx.alive.length * 2, p + 1));
        grown.set(idx.alive);
        idx.alive = grown;
      }
      idx.alive[p] = 1;
      idx.aliveCount++;
    }
  }
  idx.signature = sig.key;
  byKey.set(key, idx);
  return idx;
}

/** HNSW im Hintergrund aufbauen bzw. neue Vektoren nachtragen; blockiert die Ereignisschleife nur in kurzen Abschnitten */
function ensureHnsw(idx: MemIndex) {
  if (!idx.store || idx.building) return;
  const store = idx.store;
  const t0 = performance.now();
  idx.hnsw ??= new Hnsw(store);
  const hnsw = idx.hnsw;
  if (hnsw.size >= store.count) return;
  const fresh = hnsw.size === 0;
  idx.building = (async () => {
    while (hnsw.size < store.count) {
      const until = performance.now() + 25;
      while (hnsw.size < store.count && performance.now() < until) hnsw.insertNext();
      await new Promise((r) => setImmediate(r));
    }
    if (fresh) idx.buildMs = Math.round(performance.now() - t0);
  })().finally(() => {
    idx.building = null;
  });
}

function memSearch(idx: MemIndex, q: Float32Array, k: number, engine: 'exact' | 'hnsw', accept: (id: string) => boolean, ef: number): { hits: Neighbor[]; engine: Engine } {
  if (!idx.store || !idx.aliveCount) return { hits: [], engine: 'exact' };
  const ok = (p: number) => idx.alive[p] === 1 && accept(idx.ids[p]);
  // HNSW nur, wenn der Graph (nahezu) vollständig ist; fehlende Knoten werden sonst übersehen
  if (engine === 'hnsw' && idx.hnsw && !idx.building && idx.hnsw.size === idx.store.count) {
    const hits = idx.hnsw.search(q, k, Math.max(ef, k * 4), ok);
    if (hits.length >= Math.min(k, idx.aliveCount)) return { hits, engine: 'hnsw' };
  }
  return { hits: idx.store.exact(q, k, ok), engine: 'exact' };
}

// ------------------------------------------------------------------ pgvector

const pgState = new WeakMap<Db, Promise<boolean>>();
const pgSynced = new WeakMap<Db, Map<string, string>>();
const pgIndexes = new WeakMap<Db, Set<number>>();

/** pgvector verfügbar? Legt Erweiterung und Tabelle an, soweit die Rechte reichen (sonst Rückfall auf Speicherindex). */
export function pgvectorAvailable(db: Db): Promise<boolean> {
  if (db.dialect !== 'postgres') return Promise.resolve(false);
  let p = pgState.get(db);
  if (!p) {
    p = (async () => {
      try {
        if (!(await db.get("SELECT 1 AS ok FROM pg_extension WHERE extname = 'vector'"))) await db.run('CREATE EXTENSION IF NOT EXISTS vector');
        // abgeleitete Daten: nicht Teil von Migrationen und Backup, jederzeit aus snippet_embeddings wiederherstellbar
        await db.run(`CREATE TABLE IF NOT EXISTS snippet_vectors (
          snippet_id TEXT NOT NULL, model TEXT NOT NULL, project_id TEXT NOT NULL, dims INTEGER NOT NULL, embedding vector NOT NULL,
          PRIMARY KEY (snippet_id, model))`);
        return true;
      } catch {
        return false;
      }
    })();
    pgState.set(db, p);
  }
  return p;
}

const pgVector = (v: Float32Array) => `[${Array.from(v, (x) => (Number.isFinite(x) ? x : 0)).join(',')}]`;

async function syncPg(ctx: Ctx, sig: string) {
  let synced = pgSynced.get(ctx.db);
  if (!synced) pgSynced.set(ctx.db, (synced = new Map()));
  const key = `${ctx.projectId}|${ctx.embeddings.model}`;
  if (synced.get(key) === sig) return;
  // fehlende Vektoren einmal ermitteln, dann in Portionen mit mehrzeiligen INSERTs übertragen
  const missing = (await ctx.db.all<{ id: string }>(
    `SELECT e.snippet_id AS id ${CURRENT_EMBEDDED} AND NOT EXISTS (SELECT 1 FROM snippet_vectors v WHERE v.snippet_id = e.snippet_id AND v.model = e.model)`,
    ctx.projectId, ctx.embeddings.model,
  )).map((r) => r.id);
  for (let i = 0; i < missing.length; i += 500) {
    const part = missing.slice(i, i + 500);
    const rows = await ctx.db.all<{ snippet_id: string; vector: string }>(
      `SELECT snippet_id, vector FROM snippet_embeddings WHERE model = ? AND snippet_id IN (${part.map(() => '?').join(',')})`, ctx.embeddings.model, ...part,
    );
    if (!rows.length) continue;
    const params: unknown[] = [];
    for (const r of rows) {
      const v = decodeVector(r.vector);
      params.push(r.snippet_id, ctx.embeddings.model, ctx.projectId, v.length, pgVector(v));
    }
    await ctx.db.run(
      `INSERT INTO snippet_vectors (snippet_id, model, project_id, dims, embedding) VALUES ${rows.map(() => '(?, ?, ?, ?, ?::vector)').join(', ')}
       ON CONFLICT (snippet_id, model) DO UPDATE SET embedding = excluded.embedding, dims = excluded.dims`,
      ...params,
    );
  }
  synced.set(key, sig);
}

async function ensurePgIndex(db: Db, dims: number) {
  let done = pgIndexes.get(db);
  if (!done) pgIndexes.set(db, (done = new Set()));
  if (done.has(dims)) return;
  const d = Math.trunc(dims);
  // HNSW braucht eine feste Dimension: Ausdrucksindex je Dimension (Modelle unterschiedlicher Größe nebeneinander)
  await db.run(`CREATE INDEX IF NOT EXISTS idx_snippet_vectors_hnsw_${d} ON snippet_vectors USING hnsw ((embedding::vector(${d})) vector_ip_ops) WHERE dims = ${d}`);
  done.add(d);
}

async function pgSearch(ctx: Ctx, q: Float32Array, k: number, opts: { chapterId?: string; blocked: Set<string>; ef: number; approximate: boolean }): Promise<VectorHit[]> {
  const d = Math.trunc(q.length);
  const qv = pgVector(q);
  const chapter = opts.chapterId ? [opts.chapterId] : [];
  const filter = `JOIN text_snippets s ON s.id = c.snippet_id JOIN source_revisions r ON r.id = s.revision_id
    WHERE r.is_current = 1 AND s.excluded_reason IS NULL AND s.kind <> 'code' ${opts.chapterId ? 'AND s.chapter_id = ?' : ''}`;
  const want = k + opts.blocked.size;
  type R = { snippet_id: string; score: number };
  // Näherung über den HNSW-Index; Filter (Projekt, aktueller Stand) greifen auf die überabgefragten Kandidaten
  const ann = () => ctx.db.tx(async () => {
    const overfetch = Math.min(Math.max(want * 10, opts.ef), 1000); // pgvector: ef_search höchstens 1000
    await ctx.db.run(`SET LOCAL hnsw.ef_search = ${overfetch}`);
    return ctx.db.all<R>(
      `SELECT c.snippet_id, c.score FROM (
         SELECT v.snippet_id, -((v.embedding::vector(${d})) <#> ?::vector(${d})) AS score FROM snippet_vectors v
         WHERE v.dims = ${d} AND v.model = ? AND v.project_id = ? ORDER BY (v.embedding::vector(${d})) <#> ?::vector(${d}) LIMIT ${overfetch}
       ) c ${filter} ORDER BY c.score DESC LIMIT ${want}`,
      qv, ctx.embeddings.model, ctx.projectId, qv, ...chapter,
    );
  });
  // exakt (ohne Index): für Kapitelfilter und falls die Näherung zu wenige Treffer des Projekts liefert
  const exact = () => ctx.db.all<R>(
    `SELECT c.snippet_id, c.score FROM (SELECT v.snippet_id, -(v.embedding <#> ?::vector) AS score FROM snippet_vectors v WHERE v.dims = ${d} AND v.model = ? AND v.project_id = ?) c
     ${filter} ORDER BY c.score DESC LIMIT ${want}`,
    qv, ctx.embeddings.model, ctx.projectId, ...chapter,
  );
  const useIndex = opts.approximate && !opts.chapterId;
  let rows = useIndex ? await ann() : await exact();
  if (useIndex && rows.length < want) rows = await exact();
  return rows.filter((r) => !opts.blocked.has(r.snippet_id)).slice(0, k).map((r) => ({ snippetId: r.snippet_id, score: Number(r.score) }));
}

// ------------------------------------------------------------------ Schnittstelle

export interface VectorHit {
  snippetId: string;
  score: number;
}

/**
 * Verfahren wählen. Näherungsweise gesucht wird nur ab `annThreshold` Abschnitten – darunter ist die exakte Suche im
 * Speicher schnell genug, und Graphindizes übersehen in kleinen Beständen einzelne Ausreißer (pgvector 0.8, Test T-147).
 * `auto` nähert zudem nur bei einem semantischen (externen) Modell: Die lokalen Hash-Vektoren sind nahezu gleichverteilt.
 * Ohne Näherung sucht der Speicherindex (exakt in pgvector ohne Index war im Lasttest 6-mal langsamer).
 */
async function chooseEngine(ctx: Ctx, count: number): Promise<{ engine: Engine; approximate: boolean }> {
  const setting = ctx.config.vectorIndex;
  const exact = { engine: 'exact' as Engine, approximate: false };
  if (setting === 'exact') return exact;
  const big = count >= (await getSettings(ctx.db)).semantic.annThreshold;
  if (!big || (setting === 'auto' && !ctx.embeddings.external)) return exact;
  if (setting === 'hnsw') return { engine: 'hnsw', approximate: true };
  if (await pgvectorAvailable(ctx.db)) return { engine: 'pgvector', approximate: true };
  if (setting === 'pgvector') ctx.log?.('pgvector nicht verfügbar – Rückfall auf HNSW im Speicher');
  return { engine: 'hnsw', approximate: true };
}

/** k ähnlichste aktuelle Abschnitte des Projekts */
export async function searchVectors(ctx: Ctx, q: Float32Array, k: number, opts: { chapterIds?: Set<string>; chapterId?: string; blocked?: Set<string>; change?: string } = {}) {
  const blocked = opts.blocked ?? new Set<string>();
  const sig = await cachedSignature(ctx, opts.change);
  const { engine, approximate } = await chooseEngine(ctx, sig.count);
  // Suchliste: bei gleichmäßig verteilten Vektoren braucht die Graphsuche eine große Liste für hohe Trefferquote (Lasttest)
  const ef = (await getSettings(ctx.db)).semantic.annEfSearch;
  if (engine === 'pgvector') {
    await syncPg(ctx, sig.key);
    await ensurePgIndex(ctx.db, q.length);
    return { engine, approximate, indexed: sig.count, hits: await pgSearch(ctx, q, k, { chapterId: opts.chapterId, blocked, ef, approximate }) };
  }
  const idx = await refreshMem(ctx, sig);
  if (engine === 'hnsw') ensureHnsw(idx);
  const allowed = opts.chapterIds;
  const { hits, engine: used } = memSearch(idx, q, k, allowed ? 'exact' : engine, (id) => !blocked.has(id) && (!allowed || allowed.has(id)), ef);
  return { engine: used, approximate: used === 'hnsw', indexed: idx.aliveCount, hits: hits.map((h): VectorHit => ({ snippetId: idx.ids[h.id], score: h.score })) };
}

/** Zustand für Oberfläche und Betrieb */
export async function vectorIndexStatus(ctx: Ctx) {
  const sig = await signature(ctx);
  const { engine, approximate } = await chooseEngine(ctx, sig.count);
  const idx = memIndexes.get(ctx.db)?.get(`${ctx.projectId}|${ctx.embeddings.model}`);
  return {
    setting: ctx.config.vectorIndex, engine, approximate, vectors: sig.count,
    annThreshold: (await getSettings(ctx.db)).semantic.annThreshold,
    memory: idx ? { loaded: idx.aliveCount, hnswNodes: idx.hnsw?.size ?? 0, building: !!idx.building, buildMs: idx.buildMs } : null,
  };
}

/** Für Tests und Lasttest: HNSW-Aufbau abwarten */
export async function awaitHnsw(ctx: Ctx) {
  const idx = await refreshMem(ctx);
  ensureHnsw(idx);
  await idx.building;
  return idx.hnsw?.size ?? 0;
}

/** k nächste Nachbarn je Abschnitt (hybride Analyse großer Bestände ohne n²-Vergleich) */
export function knnPairs(vectors: Float32Array[], k: number, threshold: number) {
  if (!vectors.length) return [];
  const store = new VectorStore(vectors[0].length, vectors.length);
  for (const v of vectors) store.push(v);
  const hnsw = new Hnsw(store);
  while (hnsw.size < store.count) hnsw.insertNext();
  const pairs = new Map<string, [number, number, number]>();
  for (let i = 0; i < vectors.length; i++) {
    for (const n of hnsw.search(vectors[i], k + 1)) {
      if (n.id === i || n.score < threshold) continue;
      const [a, b] = n.id < i ? [n.id, i] : [i, n.id];
      pairs.set(`${a}|${b}`, [a, b, n.score]);
    }
  }
  return [...pairs.values()];
}
