// KI-gestützte Umformulierung als Vorschlag (ADR-013, ENTSCHEIDUNG E-16).
// Ablauf: Vorschlag anfordern → automatische Satzprüfung → Redaktion übernimmt oder verwirft.
// Übernommene Vorschläge werden als eigener Modus `ai_rewritten` mit Satz-Evidenz gespeichert.
import { audit, getSettings, type Ctx } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { detectPrivacy } from '../domain/privacy.js';
import {
  buildRewritePrompt, checkSentences, ISSUE_LABELS, joinSentences, parseRewriteResponse, REWRITABLE_KINDS, REWRITE_PROMPT_VERSION, RewriteParseError, type CheckedSentence, type RewriteSource,
} from '../domain/rewrite.js';
import { sha256 } from '../domain/similarity.js';
import { LlmError } from '../llm.js';
import { conflict, notFound, Problem, unprocessable } from '../problem.js';
import { assertEditable, blockDto, blockRow, snapshot } from './chapters.js';

export function llmStatus(ctx: Ctx) {
  const p = ctx.llm;
  return {
    enabled: !!p,
    provider: p?.id ?? null,
    model: p?.model ?? null,
    /** Daten verlassen die eigene Umgebung (Hinweis vor dem Senden) */
    external: p?.external ?? false,
    promptVersion: REWRITE_PROMPT_VERSION,
    issueLabels: ISSUE_LABELS,
  };
}

function proposalDto(r: Row) {
  return {
    id: r.id, blockId: r.block_id, blockVersionNo: r.block_version_no, provider: r.provider, model: r.model, promptHash: r.prompt_hash,
    sentSnippetIds: parseJson<string[]>(r.sent_snippet_ids, []), originalText: r.original_text,
    sentences: parseJson<CheckedSentence[]>(r.sentences, []), valid: !!r.valid, proposedText: null as string | null,
    usage: parseJson(r.usage, null), status: r.status as string, createdBy: r.created_by, createdAt: r.created_at,
    decidedBy: r.decided_by, decidedAt: r.decided_at, decisionReason: r.decision_reason,
  };
}

async function proposalRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM rewrite_proposals WHERE id = ?', id);
  if (!r) throw notFound(`Umformulierungsvorschlag ${id}`);
  return r;
}

async function withText(ctx: Ctx, r: Row) {
  const dto = proposalDto(r);
  const b = await ctx.db.get('SELECT kind FROM content_blocks WHERE id = ?', r.block_id);
  dto.proposedText = joinSentences(b?.kind ?? 'paragraph', dto.sentences);
  return dto;
}

/** Vorschlag anfordern. Überträgt nur den Absatz, seine Quelltexte und die Terminologie an den KI-Dienst. */
export async function proposeRewrite(ctx: Ctx, blockId: string, input: { instructions?: string }, actor: string) {
  const provider = ctx.llm;
  if (!provider) throw new Problem(503, 'Service Unavailable', 'KI-Umformulierung ist nicht eingerichtet (LLM_PROVIDER).');
  const row = await blockRow(ctx, blockId);
  if (row.deleted_at) throw conflict('Block ist gelöscht.');
  await assertEditable(ctx, row.chapter_version_id);
  const b = await blockDto(ctx, row);
  if (b.mode === 'locked') throw conflict('Block ist gesperrt.');
  if (!REWRITABLE_KINDS.includes(b.kind)) throw unprocessable(`Blocktyp „${b.kind}“ wird nicht umformuliert.`);
  if (!b.sources.length) throw unprocessable('Absatz ohne Quelle: Umformulierung erfordert Quellen, auf die sich jeder Satz stützt.');

  const { db } = ctx;
  const snippetIds = b.sources.map((s) => s.snippetId);
  // Datenschutz: keine Übertragung bei offenen Datenschutzbefunden der Quellen …
  const marks = snippetIds.map(() => '?').join(',');
  const privacy = await db.all(
    `SELECT seq FROM quality_findings WHERE type = 'privacy' AND status IN ('open','deferred') AND (snippet_a_id IN (${marks}) OR snippet_b_id IN (${marks}))`,
    ...snippetIds, ...snippetIds,
  );
  if (privacy.length) throw unprocessable('Übertragung gesperrt: offene Datenschutzbefunde zu den Quellen dieses Absatzes.', { findings: privacy.map((f) => f.seq) });
  const sourceRows = await db.all(`SELECT id, seq, text FROM text_snippets WHERE id IN (${marks}) ORDER BY seq`, ...snippetIds);
  // … und keine personenbezogenen Daten, die nur im (manuell bearbeiteten) Absatz stehen
  const sourceHits = new Set(detectPrivacy(sourceRows.map((s) => s.text).join('\n')).map((h) => h.match));
  const ownHits = detectPrivacy(b.text).filter((h) => !sourceHits.has(h.match));
  if (ownHits.length) throw unprocessable('Übertragung gesperrt: Der Absatz enthält mögliche personenbezogene Daten.', { hits: ownHits });

  const sources: RewriteSource[] = sourceRows.map((s, i) => ({ label: `S${i + 1}`, snippetId: s.id, seq: s.seq, text: s.text }));
  const terms = (await db.all("SELECT preferred, avoid FROM terminology_terms WHERE project_id = ? AND status = 'active' ORDER BY preferred", ctx.projectId))
    .map((t) => ({ preferred: t.preferred as string, avoid: parseJson<string[]>(t.avoid, []) }));
  const prompt = buildRewritePrompt({ kind: b.kind, section: b.section, text: b.text, sources, terms, instructions: input.instructions });
  const promptHash = sha256(`${prompt.system}\n${prompt.user}`);
  const requestInfo = { provider: provider.id, model: provider.model, promptHash, promptVersion: REWRITE_PROMPT_VERSION, sentSnippetIds: snippetIds, external: provider.external };

  let response;
  try {
    response = await provider.complete(prompt);
  } catch (e) {
    await audit(db, actor, 'rewrite.failed', 'content_block', blockId, { ...requestInfo, error: (e as Error).message });
    if (e instanceof LlmError) throw new Problem(502, 'Bad Gateway', `KI-Dienst nicht verfügbar: ${e.message}`);
    throw e;
  }

  let sentences: CheckedSentence[];
  try {
    const settings = await getSettings(db);
    sentences = checkSentences(parseRewriteResponse(response.text), sources, { minSupport: settings.rewrite.minSupport, preferredTerms: terms.map((t) => t.preferred) });
  } catch (e) {
    if (!(e instanceof RewriteParseError)) throw e;
    await audit(db, actor, 'rewrite.failed', 'content_block', blockId, { ...requestInfo, error: e.message });
    throw new Problem(502, 'Bad Gateway', `Antwort des KI-Dienstes unbrauchbar: ${e.message}`);
  }
  const valid = sentences.every((s) => s.issues.length === 0);
  const id = newId('rw');
  await db.tx(async () => {
    await db.run(
      `INSERT INTO rewrite_proposals (id, block_id, block_version_no, provider, model, prompt_hash, sent_snippet_ids, original_text, sentences, valid, raw_response, usage, status, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, blockId, b.versionNo, provider.id, provider.model, promptHash, json(snippetIds), b.text, json(sentences), valid ? 1 : 0,
      response.text.slice(0, 20000), json(response.usage ?? null), valid ? 'proposed' : 'invalid', actor, now(),
    );
    await audit(db, actor, 'rewrite.proposed', 'content_block', blockId, { ...requestInfo, proposalId: id, valid, sentences: sentences.length, usage: response.usage });
  });
  return withText(ctx, await proposalRow(ctx, id));
}

export async function listProposals(ctx: Ctx, blockId: string) {
  await blockRow(ctx, blockId);
  const rows = await ctx.db.all('SELECT * FROM rewrite_proposals WHERE block_id = ? ORDER BY created_at DESC, id DESC', blockId);
  return Promise.all(rows.map((r) => withText(ctx, r)));
}

export async function getProposal(ctx: Ctx, id: string) {
  return withText(ctx, await proposalRow(ctx, id));
}

async function decide(ctx: Ctx, id: string, from: string[], status: string, actor: string, reason: string | null) {
  const res = await ctx.db.run(
    `UPDATE rewrite_proposals SET status = ?, decided_by = ?, decided_at = ?, decision_reason = ? WHERE id = ? AND status IN (${from.map(() => '?').join(',')})`,
    status, actor, now(), reason, id, ...from,
  );
  if (!res.changes) throw conflict('Vorschlag wurde zwischenzeitlich entschieden.');
}

/** Vorschlag übernehmen: nur gültig, aktuell und für einen bearbeitbaren, nicht gesperrten Absatz. */
export async function acceptProposal(ctx: Ctx, id: string, input: { reason?: string }, actor: string) {
  const r = await proposalRow(ctx, id);
  if (r.status !== 'proposed') {
    throw conflict(r.status === 'invalid' ? 'Vorschlag hat die Satzprüfung nicht bestanden und kann nicht übernommen werden.' : `Vorschlag ist bereits ${r.status}.`);
  }
  const row = await blockRow(ctx, r.block_id);
  await assertEditable(ctx, row.chapter_version_id);
  const { db } = ctx;
  if (row.deleted_at || row.version_no !== r.block_version_no) {
    await decide(ctx, id, ['proposed'], 'stale', 'system', 'Absatz wurde nach dem Vorschlag geändert');
    throw conflict('Vorschlag ist veraltet: Der Absatz wurde inzwischen geändert. Bitte neu anfordern.');
  }
  if (row.mode === 'locked') throw conflict('Block ist gesperrt.');
  const b = await blockDto(ctx, row);
  const sentences = proposalDto(r).sentences;
  const own = new Set(b.sources.map((s) => s.snippetId));
  if (sentences.some((s) => s.sourceIds.some((sid) => !own.has(sid)))) {
    await decide(ctx, id, ['proposed'], 'stale', 'system', 'Quellen des Absatzes haben sich geändert');
    throw conflict('Vorschlag ist veraltet: Die Quellen des Absatzes haben sich geändert.');
  }
  const text = joinSentences(b.kind, sentences);
  await db.tx(async () => {
    await decide(ctx, id, ['proposed'], 'accepted', actor, input.reason?.trim() || null);
    await db.run(
      "UPDATE content_blocks SET text = ?, mode = 'ai_rewritten', sentence_sources = ?, version_no = ?, updated_at = ? WHERE id = ?",
      text, json(sentences.map((s) => ({ text: s.text, sourceIds: s.sourceIds }))), row.version_no + 1, now(), row.id,
    );
    // übrige offene Vorschläge desselben Absatzes sind damit veraltet
    await db.run("UPDATE rewrite_proposals SET status = 'stale', decided_by = 'system', decided_at = ?, decision_reason = ? WHERE block_id = ? AND status = 'proposed' AND id <> ?", now(), 'anderer Vorschlag übernommen', row.id, id);
    await snapshot(ctx, row.id, row.version_no + 1, 'rewritten', actor, `KI-Vorschlag übernommen (${r.provider}/${r.model})${input.reason?.trim() ? `: ${input.reason.trim()}` : ''}`);
    await audit(db, actor, 'rewrite.accepted', 'content_block', row.id, { proposalId: id, provider: r.provider, model: r.model, reason: input.reason });
  });
  return blockDto(ctx, await blockRow(ctx, row.id));
}

export async function rejectProposal(ctx: Ctx, id: string, input: { reason?: string }, actor: string) {
  const r = await proposalRow(ctx, id);
  if (!['proposed', 'invalid'].includes(r.status)) throw conflict(`Vorschlag ist bereits ${r.status}.`);
  await ctx.db.tx(async () => {
    await decide(ctx, id, ['proposed', 'invalid'], 'rejected', actor, input.reason?.trim() || null);
    await audit(ctx.db, actor, 'rewrite.rejected', 'content_block', r.block_id, { proposalId: id, reason: input.reason });
  });
  return getProposal(ctx, id);
}
