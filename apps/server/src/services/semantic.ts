// Semantische Suche und Embedding-Index je Projekt (ADR-017).
import { audit, getSettings, type Ctx } from '../context.js';
import { newId, now, type Row } from '../db.js';
import { detectPrivacy } from '../domain/privacy.js';
import { sha256, tokenize, type SimilarityPair } from '../domain/similarity.js';
import { decodeVector, dot, encodeVector } from '../embeddings.js';
import { LlmError } from '../llm.js';
import { badRequest, Problem } from '../problem.js';
import type { Db } from '../db.js';
import { changeKey, knnPairs, searchVectors, vectorIndexStatus } from './vectorIndex.js';

/** Letzter Änderungsschlüssel ohne fehlende Vektoren je Projekt und Modell */
const complete = new WeakMap<Db, Map<string, string>>();

/** Obergrenze für die Berechnung fehlender Vektoren während einer Suche; darüber übernimmt der Index-Job */
const SYNC_EMBED_LIMIT = 2000;

/** Aktuelle Abschnitte ohne (passenden) Vektor des Modells */
async function missingEmbeddings(ctx: Ctx, limit: number) {
  return ctx.db.all<{ id: string; text: string }>(
    `SELECT s.id, s.text FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     LEFT JOIN snippet_embeddings e ON e.snippet_id = s.id AND e.model = ?
     WHERE d.project_id = ? AND r.is_current = 1 AND s.excluded_reason IS NULL AND s.kind <> 'code' AND (e.snippet_id IS NULL OR e.text_hash <> s.text_hash)
     ORDER BY s.seq LIMIT ${Math.trunc(limit)}`,
    ctx.embeddings.model, ctx.projectId,
  );
}

/** Abschnitte mit offenem Datenschutzbefund (externer Dienst): nie als Treffer liefern */
async function openPrivacyFindings(ctx: Ctx) {
  if (!ctx.embeddings.external) return new Set<string>();
  return new Set((await ctx.db.all<{ id: string }>(
    "SELECT snippet_a_id AS id FROM quality_findings WHERE project_id = ? AND type = 'privacy' AND snippet_a_id IS NOT NULL AND status IN ('open','deferred')", ctx.projectId,
  )).map((r) => r.id));
}

interface SnippetRow {
  id: string;
  seq: number;
  text: string;
  chapter_id: string | null;
  chapter_title: string | null;
  path: string;
  evidence_status: string;
}

async function currentSnippets(ctx: Ctx, chapterId?: string): Promise<SnippetRow[]> {
  return ctx.db.all<SnippetRow>(
    `SELECT s.id, s.seq, s.text, s.chapter_id, c.title AS chapter_title, d.path, s.evidence_status
     FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     LEFT JOIN chapters c ON c.id = s.chapter_id
     WHERE d.project_id = ? AND r.is_current = 1 AND s.excluded_reason IS NULL AND s.kind <> 'code' ${chapterId ? 'AND s.chapter_id = ?' : ''}
     ORDER BY s.seq`,
    ...(chapterId ? [ctx.projectId, chapterId] : [ctx.projectId]),
  );
}

/**
 * Nie an einen externen Embedding-Dienst: Abschnitte mit offenem Datenschutzbefund und Abschnitte, deren Text
 * personenbezogene Muster enthält – außer ein Datenschutzbefund dazu wurde bewusst entschieden (z. B. Fehlalarm).
 */
async function privacyBlocked(ctx: Ctx, snippets?: { id: string; text: string }[]): Promise<Set<string>> {
  if (!ctx.embeddings.external) return new Set();
  const findings = await ctx.db.all(
    "SELECT snippet_a_id AS id, status FROM quality_findings WHERE project_id = ? AND type = 'privacy' AND snippet_a_id IS NOT NULL",
    ctx.projectId,
  );
  const blocked = new Set(findings.filter((f) => f.status === 'open' || f.status === 'deferred').map((f) => f.id as string));
  const cleared = new Set(findings.filter((f) => f.status === 'resolved' || f.status === 'ignored').map((f) => f.id as string));
  for (const s of snippets ?? (await currentSnippets(ctx))) if (!cleared.has(s.id) && detectPrivacy(s.text).length) blocked.add(s.id);
  return blocked;
}

/** Fehlende oder veraltete Vektoren berechnen und speichern; liefert die Vektoren aller geeigneten Abschnitte. */
export async function ensureEmbeddings(ctx: Ctx, snippets: { id: string; text: string }[]) {
  const model = ctx.embeddings.model;
  const blocked = await privacyBlocked(ctx, snippets);
  const usable = snippets.filter((s) => !blocked.has(s.id));
  const stored = new Map<string, Row>();
  // in Portionen lesen (Parametergrenzen der Datenbanken)
  for (let i = 0; i < usable.length; i += 500) {
    const part = usable.slice(i, i + 500);
    for (const r of await ctx.db.all(`SELECT snippet_id, vector, text_hash FROM snippet_embeddings WHERE model = ? AND snippet_id IN (${part.map(() => '?').join(',')})`, model, ...part.map((s) => s.id))) {
      stored.set(r.snippet_id, r);
    }
  }
  const vectors = new Map<string, Float32Array>();
  const missing: { id: string; text: string; hash: string }[] = [];
  for (const s of usable) {
    const hash = sha256(s.text);
    const r = stored.get(s.id);
    if (r && r.text_hash === hash) vectors.set(s.id, decodeVector(r.vector));
    else missing.push({ id: s.id, text: s.text, hash });
  }
  if (missing.length) {
    let computed: Float32Array[];
    try {
      computed = await ctx.embeddings.embed(missing.map((m) => m.text));
    } catch (e) {
      if (e instanceof LlmError) throw new Problem(502, 'Bad Gateway', e.message);
      throw e;
    }
    await ctx.db.tx(async () => {
      for (const [i, m] of missing.entries()) {
        const v = computed[i];
        vectors.set(m.id, v);
        await ctx.db.run(
          `INSERT INTO snippet_embeddings (snippet_id, model, dims, vector, text_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT (snippet_id, model) DO UPDATE SET dims = excluded.dims, vector = excluded.vector, text_hash = excluded.text_hash, created_at = excluded.created_at`,
          m.id, model, v.length, encodeVector(v), m.hash, now(),
        );
      }
    });
  }
  return { vectors, computed: missing.length, excluded: blocked.size ? snippets.filter((s) => blocked.has(s.id)).length : 0 };
}

export async function semanticSearch(ctx: Ctx, input: { q?: string; limit?: number; chapterId?: string; minScore?: number }) {
  const q = input.q?.trim();
  if (!q) throw badRequest('Suchtext (q) fehlt.');
  if (q.length > 1000) throw badRequest('Suchtext ist zu lang (max. 1000 Zeichen).');
  const rawLimit = Number(input.limit ?? 20);
  if (!Number.isFinite(rawLimit)) throw badRequest('limit muss eine Zahl sein.');
  const limit = Math.min(Math.max(Math.trunc(rawLimit), 1), 100);
  if (input.minScore !== undefined && !Number.isFinite(Number(input.minScore))) throw badRequest('minScore muss eine Zahl sein.');
  // fehlende Vektoren: wenige sofort berechnen, viele im Hintergrund (Suche läuft über den vorhandenen Bestand)
  let done = complete.get(ctx.db);
  if (!done) complete.set(ctx.db, (done = new Map()));
  const cacheKey = `${ctx.projectId}|${ctx.embeddings.model}`;
  let change = await changeKey(ctx);
  const missing = done.get(cacheKey) === change ? [] : await missingEmbeddings(ctx, SYNC_EMBED_LIMIT + 1);
  let computed = 0;
  let excluded = 0;
  let pending = 0;
  if (missing.length > SYNC_EMBED_LIMIT) {
    pending = missing.length;
    if (!(await ctx.db.get("SELECT id FROM jobs WHERE type = 'semantic-index' AND status IN ('queued','running')"))) {
      await ctx.jobs.enqueue('semantic-index', { projectId: ctx.projectId, id: newId('idx') });
      ctx.jobs.wake();
    }
  } else if (missing.length) {
    ({ computed, excluded } = await ensureEmbeddings(ctx, missing));
    change = await changeKey(ctx);
  }
  // vollständig (bis auf dauerhaft ausgeschlossene Abschnitte): bis zur nächsten Änderung nicht erneut prüfen
  if (!pending && computed + excluded === missing.length) done.set(cacheKey, change);
  let query: Float32Array;
  try {
    [query] = await ctx.embeddings.embed([q]);
  } catch (e) {
    if (e instanceof LlmError) throw new Problem(502, 'Bad Gateway', e.message);
    throw e;
  }
  const chapterIds = input.chapterId
    ? new Set((await ctx.db.all<{ id: string }>('SELECT id FROM text_snippets WHERE chapter_id = ?', input.chapterId)).map((s) => s.id))
    : undefined;
  const found = await searchVectors(ctx, query, limit, { chapterId: input.chapterId, chapterIds, blocked: await openPrivacyFindings(ctx), change });
  const minScore = input.minScore ?? 0.15;
  const hitIds = found.hits.filter((h) => h.score >= minScore);
  const rows = hitIds.length ? await ctx.db.all<SnippetRow>(
    `SELECT s.id, s.seq, s.text, s.chapter_id, c.title AS chapter_title, d.path, s.evidence_status
     FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id LEFT JOIN chapters c ON c.id = s.chapter_id
     WHERE s.id IN (${hitIds.map(() => '?').join(',')})`, ...hitIds.map((h) => h.snippetId),
  ) : [];
  const byId = new Map(rows.map((r) => [r.id, r]));
  const qTerms = new Set(tokenize(q));
  const hits = hitIds.filter((h) => byId.has(h.snippetId)).map(({ snippetId, score }) => {
    const s = byId.get(snippetId)!;
    return {
      snippetId: s.id, seq: s.seq, text: s.text, chapterId: s.chapter_id, chapterTitle: s.chapter_title, path: s.path, evidenceStatus: s.evidence_status,
      score: Math.round(score * 1000) / 1000,
      matchedTerms: [...new Set(tokenize(s.text))].filter((t) => qTerms.has(t)),
    };
  });
  return {
    query: q, model: ctx.embeddings.model, provider: ctx.embeddings.id, external: ctx.embeddings.external, engine: found.engine, approximate: found.approximate,
    indexed: found.indexed, computed, excluded, pending, hits,
  };
}

export async function indexStatus(ctx: Ctx) {
  const n = async (sql: string, ...p: unknown[]) => Number((await ctx.db.get<{ n: number }>(sql, ...p))?.n ?? 0);
  const cur = `FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
    WHERE d.project_id = ? AND r.is_current = 1 AND s.excluded_reason IS NULL AND s.kind <> 'code'`;
  const snippets = await n(`SELECT COUNT(*) AS n ${cur}`, ctx.projectId);
  const indexed = await n(`SELECT COUNT(*) AS n ${cur} AND EXISTS (SELECT 1 FROM snippet_embeddings e WHERE e.snippet_id = s.id AND e.model = ? AND e.text_hash = s.text_hash)`, ctx.projectId, ctx.embeddings.model);
  const excluded = ctx.embeddings.external && snippets - indexed <= SYNC_EMBED_LIMIT ? (await privacyBlocked(ctx, await missingEmbeddings(ctx, SYNC_EMBED_LIMIT))).size : 0;
  return { provider: ctx.embeddings.id, model: ctx.embeddings.model, external: ctx.embeddings.external, snippets, indexed, excluded, index: await vectorIndexStatus(ctx) };
}

/** Index im Hintergrund aufbauen (große Bestände, externer Dienst) */
export async function startIndexJob(ctx: Ctx, actor: string) {
  const id = newId('idx');
  await ctx.db.tx(async () => {
    await ctx.jobs.enqueue('semantic-index', { projectId: ctx.projectId, id });
    await audit(ctx, actor, 'semantic.index_requested', 'project', ctx.projectId, { model: ctx.embeddings.model, provider: ctx.embeddings.id });
  });
  ctx.jobs.wake();
  return { id, ...(await indexStatus(ctx)) };
}

export async function runIndexJob(ctx: Ctx) {
  // in Portionen: Speicherbedarf und Anfragegröße an den Embedding-Dienst begrenzt
  let skip = new Set<string>();
  for (;;) {
    const batch = (await missingEmbeddings(ctx, 1000 + skip.size)).filter((s) => !skip.has(s.id));
    if (!batch.length) break;
    await ensureEmbeddings(ctx, batch);
    // durch Datenschutz ausgeschlossene Abschnitte bleiben ohne Vektor – nicht erneut anfassen
    skip = new Set([...skip, ...(await privacyBlocked(ctx, batch))]);
  }
}

/**
 * Hybride Analyse: Paare mit hoher Embedding-Ähnlichkeit (vollständiger Vergleich bis maxDocs Abschnitte).
 * Ergänzt die TF-IDF-Paare – erkennt z. B. Umschreibungen ohne gemeinsame Begriffe (mit einem semantischen Modell).
 */
export async function embeddingPairs(ctx: Ctx, snippets: { id: string; text: string }[], threshold: number, maxDocs: number) {
  const { vectors } = await ensureEmbeddings(ctx, snippets);
  const docs = snippets.filter((s) => vectors.has(s.id));
  const vecs = docs.map((d) => vectors.get(d.id)!);
  const terms = new Map<number, Set<string>>();
  const termsOf = (i: number) => terms.get(i) ?? terms.set(i, new Set(tokenize(docs[i].text))).get(i)!;
  const pairs: SimilarityPair[] = [];
  const push = (i: number, j: number, score: number) => {
    const [a, b] = docs[i].id < docs[j].id ? [i, j] : [j, i];
    pairs.push({ a: docs[a].id, b: docs[b].id, score: Math.min(1, Math.round(score * 1000) / 1000), sharedTerms: [...termsOf(i)].filter((t) => termsOf(j).has(t)).slice(0, 6) });
  };
  if (docs.length <= maxDocs) {
    // vollständiger Vergleich
    for (let i = 0; i < docs.length; i++) {
      for (let j = i + 1; j < docs.length; j++) {
        const score = dot(vecs[i], vecs[j]);
        if (score >= threshold) push(i, j, score);
      }
    }
    return { pairs, skipped: false, approximate: false, model: ctx.embeddings.model };
  }
  // große Bestände (ADR-024): je Abschnitt die 10 nächsten Nachbarn über HNSW statt n² Vergleiche
  for (const [i, j, score] of knnPairs(vecs, 10, threshold)) push(i, j, score);
  return { pairs, skipped: false, approximate: true, model: ctx.embeddings.model };
}

export async function semanticSettings(ctx: Ctx) {
  return (await getSettings(ctx.db)).semantic;
}
