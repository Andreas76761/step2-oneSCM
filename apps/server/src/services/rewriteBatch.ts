// KI-Umformulierung ganzer Kapitel (ADR-013, Etappe 6): ein Hintergrundjob erzeugt für alle geeigneten Absätze
// einer Entwurfsversion Vorschläge; die Redaktion prüft sie gesammelt und übernimmt nur gültige.
import { audit, type Ctx } from '../context.js';
import { newId, now, type Row } from '../db.js';
import { REWRITABLE_KINDS } from '../domain/rewrite.js';
import { conflict, notFound, Problem } from '../problem.js';
import { assertEditable } from './chapters.js';
import { acceptProposal, isSourceDerived, proposeRewrite, withText } from './rewrite.js';

function batchDto(b: Row) {
  return {
    id: b.id, chapterVersionId: b.chapter_version_id, status: b.status as string, instructions: b.instructions ?? null,
    total: b.total, done: b.done, valid: b.valid, invalid: b.invalid, skipped: b.skipped, failed: b.failed,
    inputTokens: b.input_tokens, outputTokens: b.output_tokens, error: b.error ?? null, cancelRequested: !!b.cancel_requested,
    createdBy: b.created_by, createdAt: b.created_at, finishedAt: b.finished_at ?? null,
  };
}

async function batchRow(ctx: Ctx, id: string) {
  const b = await ctx.db.get('SELECT * FROM rewrite_batches WHERE id = ?', id);
  if (!b) throw notFound(`Umformulierungsauftrag ${id}`);
  return b;
}

/** Geeignete Absätze: umformulierbarer Typ, aus Quelltext abgeleitet, nicht gesperrt, ohne offenen Vorschlag. */
async function eligibleBlocks(ctx: Ctx, versionId: string) {
  const rows = await ctx.db.all(
    `SELECT b.id FROM content_blocks b WHERE b.chapter_version_id = ? AND b.deleted_at IS NULL AND b.mode <> 'locked'
       AND b.kind IN (${REWRITABLE_KINDS.map(() => '?').join(',')})
       AND EXISTS (SELECT 1 FROM content_block_sources s WHERE s.block_id = b.id)
       AND NOT EXISTS (SELECT 1 FROM rewrite_proposals p WHERE p.block_id = b.id AND p.status = 'proposed')
     ORDER BY b.position`,
    versionId, ...REWRITABLE_KINDS,
  );
  const out: string[] = [];
  for (const r of rows) if (await isSourceDerived(ctx, r.id)) out.push(r.id);
  return out;
}

export async function startBatch(ctx: Ctx, versionId: string, input: { instructions?: string }, actor: string) {
  if (!ctx.llm) throw new Problem(503, 'Service Unavailable', 'KI-Umformulierung ist nicht eingerichtet (LLM_PROVIDER).');
  await assertEditable(ctx, versionId);
  const running = await ctx.db.get("SELECT id FROM rewrite_batches WHERE chapter_version_id = ? AND status IN ('queued','processing')", versionId);
  if (running) throw conflict('Für diese Version läuft bereits eine Umformulierung.', { batchId: running.id });
  const blocks = await eligibleBlocks(ctx, versionId);
  if (!blocks.length) throw new Problem(422, 'Unprocessable Content', 'Keine geeigneten Absätze (mit Quelle, nicht gesperrt, ohne offenen Vorschlag).');
  const id = newId('rwb');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      "INSERT INTO rewrite_batches (id, chapter_version_id, status, instructions, total, created_by, created_at) VALUES (?, ?, 'queued', ?, ?, ?, ?)",
      id, versionId, input.instructions?.trim().slice(0, 500) || null, blocks.length, actor, now(),
    );
    await ctx.jobs.enqueue('rewrite-batch', { batchId: id });
    await audit(ctx, actor, 'rewrite.batch_started', 'chapter_version', versionId, { batchId: id, blocks: blocks.length, provider: ctx.llm!.id, model: ctx.llm!.model });
  });
  ctx.jobs.wake();
  return batchDto(await batchRow(ctx, id));
}

/** Job-Handler. Nach einem Neustart setzt er fort: bereits bearbeitete Absätze haben einen Vorschlag mit dieser batch_id. */
export async function runBatch(ctx: Ctx, batchId: string) {
  const { db } = ctx;
  const b = await batchRow(ctx, batchId);
  if (!['queued', 'processing'].includes(b.status)) return;
  await db.run("UPDATE rewrite_batches SET status = 'processing' WHERE id = ?", batchId);
  const already = new Set((await db.all('SELECT block_id FROM rewrite_proposals WHERE batch_id = ?', batchId)).map((r) => r.block_id as string));
  const todo = (await db.all(
    `SELECT b.id FROM content_blocks b WHERE b.chapter_version_id = ? AND b.deleted_at IS NULL AND b.kind IN (${REWRITABLE_KINDS.map(() => '?').join(',')})
       AND EXISTS (SELECT 1 FROM content_block_sources s WHERE s.block_id = b.id) ORDER BY b.position`,
    b.chapter_version_id, ...REWRITABLE_KINDS,
  )).map((r) => r.id as string).filter((id) => !already.has(id));
  const candidates: string[] = [];
  for (const id of todo) if (await isSourceDerived(ctx, id)) candidates.push(id);
  let aborted: string | null = null;
  for (const blockId of candidates) {
    if ((await db.get('SELECT cancel_requested FROM rewrite_batches WHERE id = ?', batchId))?.cancel_requested) {
      aborted = 'cancelled';
      break;
    }
    const open = await db.get("SELECT id FROM rewrite_proposals WHERE block_id = ? AND status = 'proposed'", blockId);
    const block = await db.get('SELECT mode FROM content_blocks WHERE id = ?', blockId);
    let field: 'valid' | 'invalid' | 'skipped' | 'failed';
    let usage = { inputTokens: 0, outputTokens: 0 };
    if (open || block?.mode === 'locked') field = 'skipped';
    else {
      try {
        const p = await proposeRewrite(ctx, blockId, { instructions: b.instructions ?? undefined, batchId }, b.created_by);
        field = p.valid ? 'valid' : 'invalid';
        usage = { inputTokens: Number(p.usage?.inputTokens ?? 0), outputTokens: Number(p.usage?.outputTokens ?? 0) };
      } catch (e) {
        const status = e instanceof Problem ? e.status : 500;
        // Version nicht mehr bearbeitbar oder KI-Dienst abgeschaltet: Auftrag abbrechen
        if (status === 409 && /Kapitelversion/.test((e as Error).message)) {
          aborted = (e as Error).message;
          break;
        }
        field = status === 502 || status === 503 || status === 500 ? 'failed' : 'skipped';
      }
    }
    await db.run(
      `UPDATE rewrite_batches SET done = done + 1, ${field} = ${field} + 1, input_tokens = input_tokens + ?, output_tokens = output_tokens + ? WHERE id = ?`,
      usage.inputTokens, usage.outputTokens, batchId,
    );
  }
  const status = aborted === 'cancelled' ? 'cancelled' : aborted ? 'failed' : 'completed';
  await db.run('UPDATE rewrite_batches SET status = ?, error = ?, finished_at = ? WHERE id = ?', status, aborted && aborted !== 'cancelled' ? aborted : null, now(), batchId);
  const final = batchDto(await batchRow(ctx, batchId));
  await audit(ctx, b.created_by, `rewrite.batch_${status}`, 'chapter_version', b.chapter_version_id, { batchId, ...final });
}

export async function failBatch(ctx: Ctx, batchId: string, error: string) {
  await ctx.db.run("UPDATE rewrite_batches SET status = 'failed', error = ?, finished_at = ? WHERE id = ?", error.slice(0, 500), now(), batchId);
}

export async function listBatches(ctx: Ctx, versionId: string) {
  return (await ctx.db.all('SELECT * FROM rewrite_batches WHERE chapter_version_id = ? ORDER BY created_at DESC', versionId)).map(batchDto);
}

export async function getBatch(ctx: Ctx, id: string) {
  return batchDto(await batchRow(ctx, id));
}

export async function cancelBatch(ctx: Ctx, id: string, actor: string) {
  const b = await batchRow(ctx, id);
  if (!['queued', 'processing'].includes(b.status)) throw conflict(`Auftrag ist bereits ${b.status}.`);
  await ctx.db.run('UPDATE rewrite_batches SET cancel_requested = 1 WHERE id = ?', id);
  await audit(ctx, actor, 'rewrite.batch_cancel_requested', 'chapter_version', b.chapter_version_id, { batchId: id });
  return batchDto(await batchRow(ctx, id));
}

/** Sammelprüfung: Vorschläge einer Kapitelversion (Standard: offene), mit Abschnitt und Blocktyp. */
export async function versionProposals(ctx: Ctx, versionId: string, status = 'proposed,invalid') {
  const statuses = status.split(',').map((s) => s.trim()).filter(Boolean);
  const rows = await ctx.db.all(
    `SELECT p.*, b.section_code, b.kind, b.position FROM rewrite_proposals p JOIN content_blocks b ON b.id = p.block_id
     WHERE b.chapter_version_id = ? AND b.deleted_at IS NULL AND p.status IN (${statuses.map(() => '?').join(',')}) ORDER BY b.position, p.created_at DESC`,
    versionId, ...statuses,
  );
  return Promise.all(rows.map(async (r) => ({ ...(await withText(ctx, r)), section: r.section_code as string, kind: r.kind as string })));
}

/** Alle (bzw. die ausgewählten) gültigen offenen Vorschläge übernehmen; jeder einzeln, Fehler werden gesammelt. */
export async function acceptValid(ctx: Ctx, versionId: string, input: { proposalIds?: string[]; reason?: string }, actor: string) {
  await assertEditable(ctx, versionId);
  const open = (await versionProposals(ctx, versionId, 'proposed')).filter((p) => p.valid && (!input.proposalIds || input.proposalIds.includes(p.id)));
  const accepted: string[] = [];
  const errors: { proposalId: string; detail: string }[] = [];
  for (const p of open) {
    try {
      await acceptProposal(ctx, p.id, { reason: input.reason ?? 'Sammelübernahme' }, actor);
      accepted.push(p.id);
    } catch (e) {
      errors.push({ proposalId: p.id, detail: (e as Error).message });
    }
  }
  return { accepted, errors };
}

/** Nutzung und geschätzte Kosten je Anbieter/Modell im Projekt (Preise optional per Konfiguration). */
export async function llmUsage(ctx: Ctx, input: { from?: string; to?: string }) {
  const where = ['c.project_id = ?'];
  const params: unknown[] = [ctx.projectId];
  if (input.from) (where.push('p.created_at >= ?'), params.push(input.from));
  if (input.to) (where.push('p.created_at < ?'), params.push(input.to));
  const rows = await ctx.db.all(
    `SELECT p.provider, p.model, p.status, p.usage FROM rewrite_proposals p JOIN content_blocks b ON b.id = p.block_id
     JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id WHERE ${where.join(' AND ')}`,
    ...params,
  );
  const price = { input: Number(process.env.LLM_PRICE_INPUT_PER_MTOK || 0), output: Number(process.env.LLM_PRICE_OUTPUT_PER_MTOK || 0) };
  const groups = new Map<string, { provider: string; model: string; requests: number; accepted: number; invalid: number; inputTokens: number; outputTokens: number }>();
  for (const r of rows) {
    const k = `${r.provider}/${r.model}`;
    const g = groups.get(k) ?? { provider: r.provider, model: r.model, requests: 0, accepted: 0, invalid: 0, inputTokens: 0, outputTokens: 0 };
    const u = r.usage ? JSON.parse(r.usage) : null;
    g.requests++;
    if (r.status === 'accepted') g.accepted++;
    if (r.status === 'invalid') g.invalid++;
    g.inputTokens += Number(u?.inputTokens ?? 0);
    g.outputTokens += Number(u?.outputTokens ?? 0);
    groups.set(k, g);
  }
  const items = [...groups.values()].map((g) => ({
    ...g,
    estimatedCost: price.input || price.output ? Math.round(((g.inputTokens * price.input + g.outputTokens * price.output) / 1e6) * 100) / 100 : null,
  }));
  return {
    items,
    totals: items.reduce((t, g) => ({ requests: t.requests + g.requests, accepted: t.accepted + g.accepted, inputTokens: t.inputTokens + g.inputTokens, outputTokens: t.outputTokens + g.outputTokens }), { requests: 0, accepted: 0, inputTokens: 0, outputTokens: 0 }),
    pricePerMTok: price.input || price.output ? price : null,
    currency: process.env.LLM_PRICE_CURRENCY || 'USD',
  };
}
