// Semantische Suche und Embedding-Index je Projekt (ADR-017).
import { audit, getSettings, type Ctx } from '../context.js';
import { newId, now, type Row } from '../db.js';
import { detectPrivacy } from '../domain/privacy.js';
import { sha256, tokenize, type SimilarityPair } from '../domain/similarity.js';
import { decodeVector, dot, encodeVector } from '../embeddings.js';
import { LlmError } from '../llm.js';
import { badRequest, Problem } from '../problem.js';

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
  const limit = Math.min(Math.max(Number(input.limit ?? 20), 1), 100);
  const snippets = await currentSnippets(ctx, input.chapterId);
  const { vectors, computed, excluded } = await ensureEmbeddings(ctx, snippets);
  let query: Float32Array;
  try {
    [query] = await ctx.embeddings.embed([q]);
  } catch (e) {
    if (e instanceof LlmError) throw new Problem(502, 'Bad Gateway', e.message);
    throw e;
  }
  const minScore = input.minScore ?? 0.15;
  const qTerms = new Set(tokenize(q));
  const hits = snippets
    .filter((s) => vectors.has(s.id))
    .map((s) => ({ s, score: dot(query, vectors.get(s.id)!) }))
    .filter((h) => h.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ s, score }) => ({
      snippetId: s.id, seq: s.seq, text: s.text, chapterId: s.chapter_id, chapterTitle: s.chapter_title, path: s.path, evidenceStatus: s.evidence_status,
      score: Math.round(score * 1000) / 1000,
      matchedTerms: [...new Set(tokenize(s.text))].filter((t) => qTerms.has(t)),
    }));
  return { query: q, model: ctx.embeddings.model, provider: ctx.embeddings.id, external: ctx.embeddings.external, indexed: vectors.size, computed, excluded, hits };
}

export async function indexStatus(ctx: Ctx) {
  const snippets = await currentSnippets(ctx);
  const rows = await ctx.db.all<{ snippet_id: string; text_hash: string }>(
    `SELECT e.snippet_id, e.text_hash FROM snippet_embeddings e JOIN text_snippets s ON s.id = e.snippet_id JOIN source_revisions r ON r.id = s.revision_id
     JOIN source_documents d ON d.id = r.document_id WHERE d.project_id = ? AND e.model = ?`,
    ctx.projectId, ctx.embeddings.model,
  );
  const hashes = new Map(rows.map((r) => [r.snippet_id, r.text_hash]));
  const current = snippets.filter((s) => hashes.get(s.id) === sha256(s.text)).length;
  return { provider: ctx.embeddings.id, model: ctx.embeddings.model, external: ctx.embeddings.external, snippets: snippets.length, indexed: current, excluded: (await privacyBlocked(ctx, snippets)).size };
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
  await ensureEmbeddings(ctx, await currentSnippets(ctx));
}

/**
 * Hybride Analyse: Paare mit hoher Embedding-Ähnlichkeit (vollständiger Vergleich bis maxDocs Abschnitte).
 * Ergänzt die TF-IDF-Paare – erkennt z. B. Umschreibungen ohne gemeinsame Begriffe (mit einem semantischen Modell).
 */
export async function embeddingPairs(ctx: Ctx, snippets: { id: string; text: string }[], threshold: number, maxDocs: number) {
  if (snippets.length > maxDocs) return { pairs: [] as SimilarityPair[], skipped: true, model: ctx.embeddings.model };
  const { vectors } = await ensureEmbeddings(ctx, snippets);
  const docs = snippets.filter((s) => vectors.has(s.id));
  const vecs = docs.map((d) => vectors.get(d.id)!);
  const terms = docs.map((d) => new Set(tokenize(d.text)));
  const pairs: SimilarityPair[] = [];
  for (let i = 0; i < docs.length; i++) {
    for (let j = i + 1; j < docs.length; j++) {
      const score = dot(vecs[i], vecs[j]);
      if (score < threshold) continue;
      const [a, b] = docs[i].id < docs[j].id ? [i, j] : [j, i];
      pairs.push({ a: docs[a].id, b: docs[b].id, score: Math.min(1, Math.round(score * 1000) / 1000), sharedTerms: [...terms[i]].filter((t) => terms[j].has(t)).slice(0, 6) });
    }
  }
  return { pairs, skipped: false, model: ctx.embeddings.model };
}

export async function semanticSettings(ctx: Ctx) {
  return (await getSettings(ctx.db)).semantic;
}
