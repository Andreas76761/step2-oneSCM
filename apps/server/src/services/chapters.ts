// Kapitel, Generierung, Kapitelwerkstatt, Qualitätsgate und Freigabe (US-008, US-009, US-010, US-012).
import { audit, type Ctx } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { evaluateGate, type GateResult } from '../domain/gate.js';
import { generateChapter, GENERATOR_ID, type GenSnippet } from '../domain/generator.js';
import { BLOCK_KINDS, CHAPTER_SECTIONS, CONFIRMED_EVIDENCE, DIVISION_CODES, ROLE_CODES, SECTION_CODES } from '../domain/reference.js';
import { badRequest, conflict, notFound, unprocessable } from '../problem.js';
import { assertIdsInProject } from './projects.js';
import { systemNotice } from './collaboration.js';
import { snippetScope, variantSnippetRefs } from './variantSnippets.js';
import { checkDecider, clearWorkflowSql, recordApproval, startWorkflow, workflowState } from './workflow.js';

// ---------- Kapitel ----------

/** Kapitel aus den Quellen (Standard) oder die Kapitel einer Handbuch-Variante (outline = Gliederungs-ID, ADR-034) */
/** Standard: Kapitel der Quellen; `outlineFamilyId`: Kapitel einer Handbuch-Variante; `all`: beide (ADR-034) */
export async function listChapters(ctx: Ctx, opts: { outlineFamilyId?: string; outlineId?: string } = {}) {
  const chapters = opts.outlineFamilyId === 'all'
    ? await ctx.db.all('SELECT * FROM chapters WHERE project_id = ? ORDER BY CASE WHEN outline_family_id IS NULL THEN 0 ELSE 1 END, outline_family_id, position, title', ctx.projectId)
    : opts.outlineFamilyId
    ? await ctx.db.all('SELECT * FROM chapters WHERE project_id = ? AND outline_family_id = ? ORDER BY position, title', ctx.projectId, opts.outlineFamilyId)
    : await ctx.db.all('SELECT * FROM chapters WHERE project_id = ? AND outline_family_id IS NULL ORDER BY position, title', ctx.projectId);
  // outlineId: Inhalte der Variantenkapitel an dieser Gliederungsversion messen
  return Promise.all(chapters.map((c) => chapterSummary(ctx, opts.outlineId && c.outline_family_id ? { ...c, outline_id: opts.outlineId } : c)));
}

async function chapterSummary(ctx: Ctx, c: Row) {
  const { db } = ctx;
  const scope = await snippetScope(ctx, c);
  const counts = (await db.get(
    `SELECT COUNT(*) AS total, SUM(CASE WHEN s.evidence_status IN ('source_confirmed','manually_confirmed') THEN 1 ELSE 0 END) AS confirmed
     FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id WHERE ${scope.sql} AND r.is_current = 1`, ...scope.params,
  ))!;
  const findings = await chapterFindings(ctx, c.id);
  const versions = await db.all('SELECT id, version_no, status, generated_at, approved_at FROM generated_chapter_versions WHERE chapter_id = ? ORDER BY version_no DESC', c.id);
  const coverage = {
    roles: await db.all(
      `SELECT sr.role_code AS code, COUNT(DISTINCT s.id) AS n FROM snippet_roles sr JOIN text_snippets s ON s.id = sr.snippet_id JOIN source_revisions r ON r.id = s.revision_id
       WHERE ${scope.sql} AND r.is_current = 1 GROUP BY sr.role_code`, ...scope.params),
    divisions: await db.all(
      `SELECT sd.division_code AS code, COUNT(DISTINCT s.id) AS n FROM snippet_divisions sd JOIN text_snippets s ON s.id = sd.snippet_id JOIN source_revisions r ON r.id = s.revision_id
       WHERE ${scope.sql} AND r.is_current = 1 GROUP BY sd.division_code`, ...scope.params),
  };
  return {
    id: c.id,
    title: c.title,
    position: c.position,
    outlineFamilyId: c.outline_family_id ?? null,
    subchapters: c.outline_family_id
      ? (await variantSnippetRefs(ctx, c)).subchapters
      : await db.all('SELECT id, title, position FROM subchapters WHERE chapter_id = ? ORDER BY position', c.id),
    snippetCount: counts.total ?? 0,
    confirmedSnippetCount: counts.confirmed ?? 0,
    openFindings: findings.filter((f) => f.status === 'open' || f.status === 'deferred').length,
    openBlockers: findings.filter((f) => (f.status === 'open' || f.status === 'deferred') && f.severity === 'blocker').length,
    coverage,
    versions: versions.map((v) => ({ id: v.id, versionNo: v.version_no, status: v.status, generatedAt: v.generated_at, approvedAt: v.approved_at })),
  };
}

export async function getChapter(ctx: Ctx, id: string) {
  const c = await ctx.db.get('SELECT * FROM chapters WHERE id = ?', id);
  if (!c) throw notFound(`Kapitel ${id}`);
  return chapterSummary(ctx, c);
}

/** Alle Befunde, die ein Kapitel betreffen (direkt oder über eine der beiden Aussagen). */
async function chapterFindings(ctx: Ctx, chapterId: string) {
  type F = { id: string; seq: number; type: string; severity: string; status: string; reason: string };
  const chapter = await ctx.db.get('SELECT * FROM chapters WHERE id = ?', chapterId);
  if (chapter?.outline_family_id) {
    // Handbuch-Variante: Befunde der zugeordneten Schnipsel (ADR-034)
    const ids = (await variantSnippetRefs(ctx, chapter)).refs.map((r) => r.snippetId);
    if (!ids.length) return [] as F[];
    const marks = ids.map(() => '?').join(',');
    return ctx.db.all<F>(
      `SELECT DISTINCT f.id, f.seq, f.type, f.severity, f.status, f.reason FROM quality_findings f
       WHERE f.status <> 'obsolete' AND (f.snippet_a_id IN (${marks}) OR f.snippet_b_id IN (${marks}))`, ...ids, ...ids,
    );
  }
  return ctx.db.all<F>(
    `SELECT DISTINCT f.id, f.seq, f.type, f.severity, f.status, f.reason FROM quality_findings f
     LEFT JOIN text_snippets sa ON sa.id = f.snippet_a_id LEFT JOIN text_snippets sb ON sb.id = f.snippet_b_id
     WHERE f.status <> 'obsolete' AND (f.chapter_id = ? OR sa.chapter_id = ? OR sb.chapter_id = ?)`,
    chapterId, chapterId, chapterId,
  );
}

// ---------- Generierung ----------

async function loadGenSnippets(ctx: Ctx, chapterId: string): Promise<GenSnippet[]> {
  const { db } = ctx;
  const chapter = await db.get('SELECT * FROM chapters WHERE id = ?', chapterId);
  let rows: Row[];
  const variant = !!chapter?.outline_family_id;
  if (variant) {
    // Handbuch-Variante (ADR-034): zugeordnete Schnipsel in Gliederungsreihenfolge, Unterkapitel aus der Gliederung
    const { refs } = await variantSnippetRefs(ctx, chapter!);
    const order = new Map(refs.map((r, i) => [r.snippetId, i]));
    const sub = new Map(refs.map((r) => [r.snippetId, r.subTitle]));
    rows = refs.length ? await db.all(
      `SELECT s.*, d.path, r.revision_no FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
       WHERE s.id IN (${refs.map(() => '?').join(',')}) AND r.is_current = 1 AND s.excluded_reason IS NULL`, ...refs.map((r) => r.snippetId),
    ) : [];
    rows = rows.map((r): Row => ({ ...r, subchapter_title: sub.get(r.id) ?? null })).sort((a, b) => order.get(a.id)! - order.get(b.id)!);
  } else {
    rows = await db.all(
      `SELECT s.*, sc.title AS subchapter_title, COALESCE(sc.position, 0) AS sub_pos, d.path, r.revision_no
       FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
       LEFT JOIN subchapters sc ON sc.id = s.subchapter_id
       WHERE s.chapter_id = ? AND r.is_current = 1 AND s.excluded_reason IS NULL
       ORDER BY sub_pos, d.path, s.position`, chapterId,
    );
  }
  return Promise.all(rows.map(async (s, i) => {
    // Querverweise auf Leitkapitel nur in den Quellkapiteln; die Variante enthält, was ihr zugeordnet ist
    const topic = variant ? undefined : await db.get(
      `SELECT t.id, t.title, c.title AS lead FROM canonical_topic_members m JOIN canonical_topics t ON t.id = m.topic_id JOIN chapters c ON c.id = t.lead_chapter_id
       WHERE m.snippet_id = ? AND t.lead_chapter_id <> ?`, s.id, chapterId,
    );
    return {
      id: s.id, seq: s.seq, text: s.text, kind: s.kind, evidenceStatus: s.evidence_status, subchapterTitle: s.subchapter_title,
      headingPath: parseJson<string[]>(s.heading_path, []).filter(Boolean), order: i, normHash: s.norm_hash,
      roles: await db.all('SELECT role_code AS code, evidence_status AS evidenceStatus FROM snippet_roles WHERE snippet_id = ?', s.id),
      divisions: await db.all('SELECT division_code AS code, evidence_status AS evidenceStatus FROM snippet_divisions WHERE snippet_id = ?', s.id),
      market: s.market_code, release: s.release_code, scopeStatus: s.scope_status, sourceLabel: `${s.path} (Rev. ${s.revision_no})`,
      canonicalRedirect: topic ? { topicId: topic.id, topicTitle: topic.title, leadChapterTitle: topic.lead } : null,
    } as GenSnippet;
  }));
}

export async function gateForChapter(ctx: Ctx, chapterId: string, purpose: 'generate' | 'approve' | 'export', versionId?: string): Promise<GateResult> {
  const findings = await chapterFindings(ctx, chapterId);
  const blocks = versionId ? (await activeBlocks(ctx, versionId)).map(gateBlock) : [];
  return evaluateGate(blocks, findings, { purpose });
}

export async function generate(ctx: Ctx, chapterId: string, actor: string) {
  const chapter = await ctx.db.get('SELECT * FROM chapters WHERE id = ?', chapterId);
  if (!chapter) throw notFound(`Kapitel ${chapterId}`);
  const gate = await gateForChapter(ctx, chapterId, 'generate');
  if (!gate.passed) throw conflict('Generierung blockiert: offene Blocker-Befunde müssen zuerst geklärt werden.', { gate });

  const snippets = await loadGenSnippets(ctx, chapterId);
  if (!snippets.some((s) => CONFIRMED_EVIDENCE.includes(s.evidenceStatus))) {
    throw unprocessable('Keine bestätigten Quellen (source_confirmed/manually_confirmed) in diesem Kapitel – es wird nichts generiert.');
  }
  const result = generateChapter(chapter.title, snippets);
  const { db } = ctx;
  const versionId = newId('cv');
  const currentIds = new Set(snippets.map((s) => s.id));

  await db.tx(async () => {
    const prev = await db.get('SELECT * FROM generated_chapter_versions WHERE chapter_id = ? ORDER BY version_no DESC LIMIT 1', chapterId);
    await db.run(
      "INSERT INTO generated_chapter_versions (id, chapter_id, version_no, status, title, based_on_version_id, generator, generated_by, generated_at) VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?)",
      versionId, chapterId, (prev?.version_no ?? 0) + 1, chapter.title, prev?.id ?? null, GENERATOR_ID, actor, now(),
    );
    // Offener Entwurf oder eingereichte Version wird durch die neue Version ersetzt
    if (prev?.status === 'draft' || prev?.status === 'in_review') await db.run("UPDATE generated_chapter_versions SET status = 'superseded' WHERE id = ?", prev.id);

    // Manuelle und gesperrte Blöcke übernehmen – nie still überschreiben (US-009).
    const prevBlocks = prev ? await Promise.all((await activeBlocks(ctx, prev.id)).map(async (b) => ({ ...b, mode: await effectiveMode(ctx, b.id, b.mode) }))) : [];
    const carried = prevBlocks.filter((b) => MANUAL_MODES.includes(b.mode));
    const carriedSourceKeys = new Set<string>();
    const prevGenerated = prevBlocks.filter((b) => b.mode === 'generated');
    for (const b of carried) {
      const sources: string[] = b.sources.map((s: Row) => s.snippetId);
      carriedSourceKeys.add([...sources].sort().join('|'));
      const sourcesChanged = sources.some((s) => !currentIds.has(s));
      const mode = (b.mode === 'manually_edited' || b.mode === 'ai_rewritten') && sourcesChanged ? 'needs_regeneration' : b.mode;
      await insertBlock(ctx, versionId, { ...b, mode, lineageId: b.lineageId, sourceIds: sources, sentences: b.sentences }, actor, sourcesChanged ? 'Quelle geändert – Prüfung erforderlich' : 'aus Vorversion übernommen (manuell geschützt)');
    }
    // Lineage stabil halten (Grundlage für Historie und Versionsvergleich, US-019): zuerst exakte Zuordnung über
    // Abschnitt + Blocktyp + Quellen (erfasst auch quellenlose Lückenhinweise), dann über dieselben Quellen;
    // jede Lineage wird höchstens einmal vergeben.
    const srcKey = (ids: string[]) => [...ids].sort().join('|');
    const exact = new Map<string, string[]>();
    const bySources = new Map<string, string[]>();
    for (const p of prevGenerated) {
      const ids = p.sources.map((s: Row) => s.snippetId as string);
      const push = (m: Map<string, string[]>, k: string) => m.set(k, [...(m.get(k) ?? []), p.lineageId]);
      push(exact, `${p.section}#${p.kind}#${srcKey(ids)}`);
      if (ids.length) push(bySources, srcKey(ids));
    }
    const used = new Set<string>();
    const take = (m: Map<string, string[]>, k: string) => {
      const list = m.get(k) ?? [];
      const hit = list.find((l) => !used.has(l));
      if (hit) used.add(hit);
      return hit;
    };
    let pos = 0;
    for (const g of result.blocks) {
      const key = srcKey(g.sourceIds);
      if (g.sourceIds.length && carriedSourceKeys.has(key)) continue;
      const lineage = take(exact, `${g.section}#${g.kind}#${key}`) ?? (key ? take(bySources, key) : undefined) ?? newId('ln');
      await insertBlock(ctx, versionId, {
        section: g.section, position: pos++, kind: g.kind, text: g.text, mode: 'generated', market: g.market, release: g.release, scopeStatus: g.scopeStatus,
        roles: g.roles, divisions: g.divisions, sourceIds: g.sourceIds, lineageId: lineage, justification: null, comment: null,
      }, actor, 'generiert');
    }
    await normalizePositions(ctx, versionId);
    await audit(ctx, actor, 'chapter.generated', 'chapter_version', versionId, { chapterId, gaps: result.gaps, used: result.usedSnippetIds.length, skippedUnconfirmed: result.skippedUnconfirmed, deduplicated: result.deduplicated, carried: carried.length });
  });
  return { ...(await getChapterVersion(ctx, versionId)), generation: { gaps: result.gaps, usedSnippets: result.usedSnippetIds.length, skippedUnconfirmed: result.skippedUnconfirmed, deduplicated: result.deduplicated } };
}

const MANUAL_MODES = ['manually_edited', 'locked', 'needs_regeneration', 'ai_rewritten'];

/** Bei freigegebenen Blöcken zählt der Modus vor der Freigabe (manuelle Änderungen bleiben geschützt). */
async function effectiveMode(ctx: Ctx, blockId: string, mode: string): Promise<string> {
  if (mode !== 'approved') return mode;
  const v = await ctx.db.get("SELECT snapshot FROM content_block_versions WHERE block_id = ? AND change_type <> 'approved' ORDER BY version_no DESC LIMIT 1", blockId);
  return parseJson<any>(v?.snapshot, {}).mode ?? 'generated';
}

interface BlockInput {
  section: string;
  position: number;
  kind: string;
  text: string;
  mode: string;
  market: string | null;
  release: string | null;
  scopeStatus: string;
  roles: string[];
  divisions: string[];
  sourceIds: string[];
  lineageId: string;
  justification: string | null;
  comment: string | null;
  /** Satz-Evidenz eines übernommenen KI-Vorschlags (ADR-013) */
  sentences?: Sentence[] | null;
}

export interface Sentence {
  text: string;
  sourceIds: string[];
}

async function insertBlock(ctx: Ctx, versionId: string, b: BlockInput, actor: string, reason: string) {
  const id = newId('cb');
  const { db } = ctx;
  await db.run(
    `INSERT INTO content_blocks (id, chapter_version_id, lineage_id, section_code, position, kind, text, mode, market_code, release_code, scope_status, justification, comment, sentence_sources, version_no, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    id, versionId, b.lineageId, b.section, b.position, b.kind, b.text, b.mode, b.market, b.release, b.scopeStatus, b.justification, b.comment, b.sentences ? json(b.sentences) : null, now(),
  );
  for (const r of b.roles) await db.run('INSERT INTO content_block_roles VALUES (?, ?) ON CONFLICT DO NOTHING', id, r);
  for (const d of b.divisions) await db.run('INSERT INTO content_block_divisions VALUES (?, ?) ON CONFLICT DO NOTHING', id, d);
  for (const s of b.sourceIds) await db.run('INSERT INTO content_block_sources VALUES (?, ?) ON CONFLICT DO NOTHING', id, s);
  await snapshot(ctx, id, 1, 'created', actor, reason);
  return id;
}

export async function blockRow(ctx: Ctx, id: string) {
  const b = await ctx.db.get('SELECT * FROM content_blocks WHERE id = ?', id);
  if (!b) throw notFound(`Content Block ${id}`);
  return b;
}

export async function blockDto(ctx: Ctx, b: Row) {
  const { db } = ctx;
  return {
    id: b.id, chapterVersionId: b.chapter_version_id, lineageId: b.lineage_id, section: b.section_code, position: b.position, kind: b.kind, text: b.text, mode: b.mode,
    market: b.market_code, release: b.release_code, scopeStatus: b.scope_status, justification: b.justification, comment: b.comment, versionNo: b.version_no,
    deletedAt: b.deleted_at, updatedAt: b.updated_at,
    sentences: parseJson<Sentence[] | null>(b.sentence_sources, null),
    roles: (await db.all('SELECT role_code FROM content_block_roles WHERE block_id = ? ORDER BY role_code', b.id)).map((r) => r.role_code as string),
    divisions: (await db.all('SELECT division_code FROM content_block_divisions WHERE block_id = ? ORDER BY division_code', b.id)).map((r) => r.division_code as string),
    sources: (await db.all(
      `SELECT s.id AS snippetId, s.seq, d.path, r.revision_no AS revisionNo, r.id AS revisionId, s.line_start AS lineStart, s.line_end AS lineEnd, r.is_current AS isCurrent, s.evidence_status AS evidenceStatus
       FROM content_block_sources x JOIN text_snippets s ON s.id = x.snippet_id JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
       WHERE x.block_id = ? ORDER BY s.seq`, b.id,
    )).map((s) => ({ ...s, isCurrent: !!s.isCurrent }) as { snippetId: string; seq: number; path: string; revisionNo: number; revisionId: string; lineStart: number; lineEnd: number; isCurrent: boolean; evidenceStatus: string }),
  };
}

async function activeBlocks(ctx: Ctx, versionId: string) {
  const rows = await ctx.db.all('SELECT * FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL ORDER BY position', versionId);
  return Promise.all(rows.map((b) => blockDto(ctx, b)));
}

type BlockDto = Awaited<ReturnType<typeof blockDto>>;
const gateBlock = (b: BlockDto) => ({
  id: b.id, kind: b.kind, section: b.section, sourceCount: b.sources.length, justification: b.justification, scopeStatus: b.scopeStatus, mode: b.mode,
  text: b.text, sourceIds: b.sources.map((s) => s.snippetId), sentences: b.sentences,
});

export async function snapshot(ctx: Ctx, blockId: string, versionNo: number, changeType: string, actor: string, reason: string | null) {
  const b = await blockDto(ctx, await blockRow(ctx, blockId));
  const { sources, ...rest } = b;
  await ctx.db.run(
    'INSERT INTO content_block_versions (id, block_id, version_no, change_type, snapshot, author, reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    newId('cbv'), blockId, versionNo, changeType, json({ ...rest, sourceIds: sources.map((s) => s.snippetId) }), actor, reason, now(),
  );
}

async function normalizePositions(ctx: Ctx, versionId: string) {
  const order = SECTION_CODES;
  const rows = await ctx.db.all('SELECT id, section_code, position FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL', versionId);
  rows.sort((a, b) => order.indexOf(a.section_code) - order.indexOf(b.section_code) || a.position - b.position);
  for (const [i, r] of rows.entries()) await ctx.db.run('UPDATE content_blocks SET position = ? WHERE id = ?', i * 10, r.id);
}

export async function getChapterVersion(ctx: Ctx, versionId: string) {
  const v = await ctx.db.get('SELECT * FROM generated_chapter_versions WHERE id = ?', versionId);
  if (!v) throw notFound(`Kapitelversion ${versionId}`);
  const blocks = await activeBlocks(ctx, versionId);
  const approvals = await ctx.db.all('SELECT id, approver, decision, comment, gate_result, created_at, stage, final FROM approvals WHERE chapter_version_id = ? ORDER BY created_at', versionId);
  return {
    id: v.id, chapterId: v.chapter_id, versionNo: v.version_no, status: v.status, title: v.title, basedOnVersionId: v.based_on_version_id,
    generator: v.generator, generatedBy: v.generated_by, generatedAt: v.generated_at, approvedAt: v.approved_at,
    submittedBy: v.submitted_by, submittedAt: v.submitted_at, submitComment: v.submit_comment,
    sections: CHAPTER_SECTIONS.map((s) => ({ code: s.code, title: s.title, blocks: blocks.filter((b) => b.section === s.code) })),
    approvals: approvals.map((a) => ({ id: a.id, approver: a.approver, decision: a.decision, comment: a.comment, gateResult: parseJson(a.gate_result, {}), createdAt: a.created_at, stage: a.stage ?? null, final: a.final !== 0 })),
    workflow: await workflowState(ctx, v),
    deletedBlocks: await ctx.db.all('SELECT id, section_code AS section, text, deleted_at AS deletedAt FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NOT NULL', versionId),
  };
}

export async function listChapterVersions(ctx: Ctx, chapterId: string) {
  return await ctx.db.all('SELECT id, version_no AS versionNo, status, generated_at AS generatedAt, generated_by AS generatedBy, approved_at AS approvedAt, submitted_at AS submittedAt, submitted_by AS submittedBy FROM generated_chapter_versions WHERE chapter_id = ? ORDER BY version_no DESC', chapterId);
}

// ---------- Kapitelwerkstatt ----------

export async function assertEditable(ctx: Ctx, versionId: string) {
  const v = await ctx.db.get('SELECT status, version_no FROM generated_chapter_versions WHERE id = ?', versionId);
  if (!v) throw notFound(`Kapitelversion ${versionId}`);
  if (v.status === 'in_review') throw conflict(`Kapitelversion ${v.version_no} ist zur Freigabe eingereicht – zum Bearbeiten die Einreichung zurückziehen.`);
  if (v.status !== 'draft') throw conflict(`Kapitelversion ${v.version_no} ist ${v.status === 'approved' ? 'freigegeben und unveränderlich' : 'ersetzt'} – bitte eine neue Version generieren.`);
}

export interface BlockPatch {
  text?: string;
  section?: string;
  position?: number;
  kind?: string;
  roles?: string[];
  divisions?: string[];
  market?: string | null;
  release?: string | null;
  scopeStatus?: 'confirmed' | 'general' | 'unconfirmed';
  justification?: string | null;
  comment?: string | null;
  mode?: 'locked' | 'manually_edited' | 'generated';
  sourceIds?: string[];
  reason?: string;
  expectedVersionNo?: number;
}

function validatePatch(p: BlockPatch) {
  if (p.section && !SECTION_CODES.includes(p.section)) throw badRequest(`Unbekannter Abschnitt. Erlaubt: ${SECTION_CODES.join(', ')}`);
  if (p.kind && !(BLOCK_KINDS as readonly string[]).includes(p.kind)) throw badRequest(`Unbekannter Blocktyp. Erlaubt: ${BLOCK_KINDS.join(', ')}`);
  if (p.roles?.some((r) => !ROLE_CODES.includes(r))) throw badRequest('Unbekannte Rolle.');
  if (p.divisions?.some((d) => !DIVISION_CODES.includes(d))) throw badRequest('Unbekannte Sparte.');
  if (p.mode && !['locked', 'manually_edited', 'generated'].includes(p.mode)) throw badRequest('mode muss locked, manually_edited oder generated sein.');
  if (p.scopeStatus && !['confirmed', 'general', 'unconfirmed'].includes(p.scopeStatus)) throw badRequest('scopeStatus muss confirmed, general oder unconfirmed sein.');
}

export async function patchBlock(ctx: Ctx, id: string, p: BlockPatch, actor: string) {
  validatePatch(p);
  const b = await blockRow(ctx, id);
  if (b.deleted_at) throw conflict('Block ist gelöscht – bitte zuerst wiederherstellen.');
  await assertEditable(ctx, b.chapter_version_id);
  if (p.expectedVersionNo !== undefined && p.expectedVersionNo !== b.version_no) {
    throw conflict(`Block wurde zwischenzeitlich geändert (aktuelle Version ${b.version_no}).`, { currentVersionNo: b.version_no });
  }
  const unlocking = p.mode === 'manually_edited' || p.mode === 'generated';
  const contentChange = p.text !== undefined || p.section !== undefined || p.kind !== undefined || p.roles !== undefined || p.divisions !== undefined ||
    p.market !== undefined || p.release !== undefined || p.scopeStatus !== undefined || p.justification !== undefined || p.sourceIds !== undefined;
  if (b.mode === 'locked' && contentChange && !unlocking) throw conflict('Block ist gesperrt. Zum Bearbeiten zuerst entsperren (mode: manually_edited).');

  if (p.sourceIds) await assertIdsInProject(ctx, 'snippetId', p.sourceIds);
  const { db } = ctx;
  let changeType = 'edited';
  await db.tx(async () => {
    const set: string[] = [];
    const vals: unknown[] = [];
    const upd = (col: string, v: unknown) => (set.push(`${col} = ?`), vals.push(v));
    if (p.text !== undefined) {
      if (!p.text.trim()) throw unprocessable('Text darf nicht leer sein – zum Entfernen DELETE verwenden.');
      upd('text', p.text);
      // Manuell geänderter Text: die Satz-Evidenz eines KI-Vorschlags gilt nicht mehr
      if (p.text !== b.text) upd('sentence_sources', null);
    }
    if (p.section !== undefined) (upd('section_code', p.section), (changeType = 'moved'));
    if (p.position !== undefined) (upd('position', p.position), (changeType = p.text === undefined ? 'moved' : changeType));
    if (p.kind !== undefined) upd('kind', p.kind);
    if (p.market !== undefined) upd('market_code', p.market || null);
    if (p.release !== undefined) upd('release_code', p.release || null);
    if (p.scopeStatus !== undefined) upd('scope_status', p.scopeStatus);
    if (p.justification !== undefined) upd('justification', p.justification || null);
    if (p.comment !== undefined) upd('comment', p.comment || null);
    let mode = b.mode;
    if (p.mode === 'locked') (mode = 'locked'), (changeType = contentChange ? 'edited' : 'locked');
    else if (unlocking) (mode = 'manually_edited'), (changeType = contentChange ? 'edited' : 'unlocked');
    if (contentChange && mode !== 'locked') mode = 'manually_edited';
    if (p.text === undefined && !contentChange && p.comment !== undefined && !p.mode) changeType = 'commented';
    if (p.roles !== undefined || p.divisions !== undefined) changeType = p.text === undefined ? 'classified' : changeType;
    upd('mode', mode);
    upd('version_no', b.version_no + 1);
    upd('updated_at', now());
    await db.run(`UPDATE content_blocks SET ${set.join(', ')} WHERE id = ?`, ...vals, id);
    if (p.roles) {
      await db.run('DELETE FROM content_block_roles WHERE block_id = ?', id);
      for (const r of p.roles) await db.run('INSERT INTO content_block_roles VALUES (?, ?)', id, r);
    }
    if (p.divisions) {
      await db.run('DELETE FROM content_block_divisions WHERE block_id = ?', id);
      for (const d of p.divisions) await db.run('INSERT INTO content_block_divisions VALUES (?, ?)', id, d);
    }
    if (p.sourceIds) {
      await db.run('DELETE FROM content_block_sources WHERE block_id = ?', id);
      for (const s of p.sourceIds) await db.run('INSERT INTO content_block_sources VALUES (?, ?)', id, s);
    }
    if (p.position !== undefined || p.section !== undefined) await normalizePositions(ctx, b.chapter_version_id);
    await snapshot(ctx, id, b.version_no + 1, changeType, actor, p.reason ?? null);
    await audit(ctx, actor, `content_block.${changeType}`, 'content_block', id, { ...p, previousVersion: b.version_no });
  });
  return blockDto(ctx, await blockRow(ctx, id));
}

export async function createBlock(ctx: Ctx, versionId: string, p: BlockPatch & { text: string; section: string }, actor: string) {
  validatePatch(p);
  await assertEditable(ctx, versionId);
  if (!p.text?.trim()) throw unprocessable('Text ist Pflicht.');
  if (!p.section) throw unprocessable('Abschnitt (section) ist Pflicht.');
  if (p.sourceIds?.length) await assertIdsInProject(ctx, 'snippetId', p.sourceIds);
  let id = '';
  await ctx.db.tx(async () => {
    const maxPos = (await ctx.db.get<{ m: number | null }>('SELECT MAX(position) AS m FROM content_blocks WHERE chapter_version_id = ? AND section_code = ?', versionId, p.section))?.m;
    id = await insertBlock(ctx, versionId, {
      section: p.section, position: p.position ?? (maxPos ?? 100000) + 1, kind: p.kind ?? 'paragraph', text: p.text, mode: 'manually_edited', market: p.market ?? null, release: p.release ?? null,
      scopeStatus: p.scopeStatus ?? 'unconfirmed', roles: p.roles ?? [], divisions: p.divisions ?? [], sourceIds: p.sourceIds ?? [], lineageId: newId('ln'),
      justification: p.justification ?? null, comment: p.comment ?? null,
    }, actor, p.reason ?? 'manuell hinzugefügt');
    await normalizePositions(ctx, versionId);
    await audit(ctx, actor, 'content_block.created', 'content_block', id, p);
  });
  return blockDto(ctx, await blockRow(ctx, id));
}

export async function deleteBlock(ctx: Ctx, id: string, reason: string | undefined, actor: string) {
  const b = await blockRow(ctx, id);
  if (b.deleted_at) throw conflict('Block ist bereits gelöscht.');
  await assertEditable(ctx, b.chapter_version_id);
  if (b.mode === 'locked') throw conflict('Gesperrte Blöcke können nicht gelöscht werden.');
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE content_blocks SET deleted_at = ?, version_no = ?, updated_at = ? WHERE id = ?', now(), b.version_no + 1, now(), id);
    await snapshot(ctx, id, b.version_no + 1, 'deleted', actor, reason ?? null);
    await audit(ctx, actor, 'content_block.deleted', 'content_block', id, { reason });
  });
}

export async function listBlockVersions(ctx: Ctx, id: string) {
  await blockRow(ctx, id);
  return (await ctx.db.all('SELECT version_no, change_type, snapshot, author, reason, created_at FROM content_block_versions WHERE block_id = ? ORDER BY version_no DESC', id)).map((v) => ({
    versionNo: v.version_no, changeType: v.change_type, snapshot: parseJson(v.snapshot, {}), author: v.author, reason: v.reason, createdAt: v.created_at,
  }));
}

/** Frühere Version wiederherstellen – erzeugt eine neue Version (append-only). */
export async function restoreBlock(ctx: Ctx, id: string, versionNo: number, actor: string) {
  const b = await blockRow(ctx, id);
  await assertEditable(ctx, b.chapter_version_id);
  const v = await ctx.db.get('SELECT snapshot FROM content_block_versions WHERE block_id = ? AND version_no = ?', id, versionNo);
  if (!v) throw notFound(`Version ${versionNo} von Block ${id}`);
  const s = parseJson<any>(v.snapshot, {});
  const { db } = ctx;
  await db.tx(async () => {
    await db.run(
      `UPDATE content_blocks SET text = ?, section_code = ?, kind = ?, market_code = ?, release_code = ?, scope_status = ?, justification = ?, comment = ?,
       sentence_sources = ?, mode = ?, deleted_at = NULL, version_no = ?, updated_at = ? WHERE id = ?`,
      s.text, s.section, s.kind, s.market, s.release, s.scopeStatus, s.justification, s.comment, s.sentences ? json(s.sentences) : null,
      s.mode === 'approved' || s.mode === 'generated' ? 'manually_edited' : s.mode,
      b.version_no + 1, now(), id,
    );
    await db.run('DELETE FROM content_block_roles WHERE block_id = ?', id);
    for (const r of s.roles ?? []) await db.run('INSERT INTO content_block_roles VALUES (?, ?)', id, r);
    await db.run('DELETE FROM content_block_divisions WHERE block_id = ?', id);
    for (const d of s.divisions ?? []) await db.run('INSERT INTO content_block_divisions VALUES (?, ?)', id, d);
    await db.run('DELETE FROM content_block_sources WHERE block_id = ?', id);
    for (const sid of s.sourceIds ?? []) await db.run('INSERT INTO content_block_sources VALUES (?, ?)', id, sid);
    await normalizePositions(ctx, b.chapter_version_id);
    await snapshot(ctx, id, b.version_no + 1, 'restored', actor, `Wiederhergestellt aus Version ${versionNo}`);
    await audit(ctx, actor, 'content_block.restored', 'content_block', id, { fromVersion: versionNo });
  });
  return blockDto(ctx, await blockRow(ctx, id));
}

// ---------- Qualitätsgate und Freigabe ----------

export async function versionGate(ctx: Ctx, versionId: string) {
  const v = await ctx.db.get('SELECT chapter_id FROM generated_chapter_versions WHERE id = ?', versionId);
  if (!v) throw notFound(`Kapitelversion ${versionId}`);
  return gateForChapter(ctx, v.chapter_id, 'approve', versionId);
}

// Freigabeworkflow (US-016; E-12 einstufig als Standard, mehrstufig je Projekt nach ADR-025):
// draft --submit--> in_review --approve--> approved
//                   in_review --reject/withdraw--> draft (wieder bearbeitbar)

async function versionRow(ctx: Ctx, versionId: string) {
  const v = await ctx.db.get('SELECT * FROM generated_chapter_versions WHERE id = ?', versionId);
  if (!v) throw notFound(`Kapitelversion ${versionId}`);
  return v;
}

const STATUS_LABEL: Record<string, string> = { draft: 'ein Entwurf', in_review: 'zur Freigabe eingereicht', approved: 'bereits freigegeben', superseded: 'durch eine neuere Version ersetzt' };

/** Status bedingt ändern – schützt vor parallelen Aktionen. */
async function transition(ctx: Ctx, versionId: string, from: string, set: string, ...params: unknown[]) {
  const res = await ctx.db.run(`UPDATE generated_chapter_versions SET ${set} WHERE id = ? AND status = ?`, ...params, versionId, from);
  if (!res.changes) throw conflict('Kapitelversion wurde zwischenzeitlich geändert.');
}

/** Zur Freigabe einreichen: nur mit bestandenem Qualitätsgate; danach ist die Version bis zur Entscheidung gesperrt. */
export async function submitVersion(ctx: Ctx, versionId: string, input: { comment?: string }, actor: string) {
  const v = await versionRow(ctx, versionId);
  if (v.status !== 'draft') throw conflict(`Kapitelversion ist ${STATUS_LABEL[v.status] ?? v.status}.`);
  const gate = await gateForChapter(ctx, v.chapter_id, 'approve', versionId);
  if (!gate.passed) throw conflict('Qualitätsgate nicht bestanden – Einreichen nicht möglich.', { gate });
  await ctx.db.tx(async () => {
    await transition(ctx, versionId, 'draft', "status = 'in_review', submitted_by = ?, submitted_at = ?, submit_comment = ?", actor, now(), input.comment?.trim() || null);
    await startWorkflow(ctx, { ...v, submitted_by: actor }, actor);
    await audit(ctx, actor, 'chapter_version.submitted', 'chapter_version', versionId, { comment: input.comment, gate });
  });
  return getChapterVersion(ctx, versionId);
}

/** Einreichung zurückziehen (z. B. für weitere Korrekturen) */
export async function withdrawVersion(ctx: Ctx, versionId: string, input: { reason?: string }, actor: string) {
  const v = await versionRow(ctx, versionId);
  if (v.status !== 'in_review') throw conflict(`Kapitelversion ist ${STATUS_LABEL[v.status] ?? v.status}.`);
  await ctx.db.tx(async () => {
    await transition(ctx, versionId, 'in_review', `status = 'draft', submitted_by = NULL, submitted_at = NULL, submit_comment = NULL, ${clearWorkflowSql()}`);
    await audit(ctx, actor, 'chapter_version.withdrawn', 'chapter_version', versionId, { reason: input.reason });
  });
  return getChapterVersion(ctx, versionId);
}

/** Fachliche Entscheidung über eine eingereichte Version: freigeben oder ablehnen (zurück in den Entwurf). */
export async function approveVersion(ctx: Ctx, versionId: string, input: { comment: string; decision?: 'approved' | 'rejected' }, actor: string) {
  const v = await versionRow(ctx, versionId);
  if (v.status !== 'in_review') {
    throw conflict(v.status === 'draft' ? 'Kapitelversion muss zuerst zur Freigabe eingereicht werden.' : `Kapitelversion ist ${STATUS_LABEL[v.status] ?? v.status}.`);
  }
  if (!input.comment?.trim()) throw unprocessable('Die fachliche Entscheidung benötigt einen Kommentar.');
  const decision = input.decision ?? 'approved';
  if (!['approved', 'rejected'].includes(decision)) throw badRequest('decision muss approved oder rejected sein.');
  // Stufe, Zuständigkeit und Vier-Augen-Prinzip (ADR-025); ohne eigenen Workflow einstufig wie bisher (E-12)
  const { wf, stage, index } = await checkDecider(ctx, v, actor);
  const gate = await versionGate(ctx, versionId);
  const { db } = ctx;
  const insertApproval = (d: string, stageKey: string, final: boolean) => db.run(
    'INSERT INTO approvals (id, chapter_version_id, approver, decision, comment, gate_result, created_at, stage, final) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    newId('ap'), versionId, actor, d, input.comment.trim(), json(gate), now(), stageKey, final ? 1 : 0,
  );
  if (decision === 'rejected') {
    await db.tx(async () => {
      await transition(ctx, versionId, 'in_review', `status = 'draft', ${clearWorkflowSql()}`);
      await insertApproval('rejected', stage.key, true);
      await audit(ctx, actor, 'chapter_version.rejected', 'chapter_version', versionId, { comment: input.comment, stage: stage.key });
      if (v.submitted_by && v.submitted_by !== actor) {
        await systemNotice(ctx, v.chapter_id, `Abgelehnt in Freigabestufe „${stage.name}“ (${actor}): ${input.comment.trim()}`, [v.submitted_by], 'approval');
      }
    });
    ctx.jobs.wake();
    return getChapterVersion(ctx, versionId);
  }
  if (!gate.passed) throw conflict('Qualitätsgate nicht bestanden – Freigabe nicht möglich.', { gate });
  await db.tx(async () => {
    // gleichzeitige Zustimmungen serialisieren: Version sperren, Stand und Zuständigkeit erneut lesen (ADR-025)
    if (db.dialect === 'postgres') await db.get('SELECT id FROM generated_chapter_versions WHERE id = ? FOR UPDATE', versionId);
    const cur = await versionRow(ctx, versionId);
    if (cur.status !== 'in_review') throw conflict('Kapitelversion wurde zwischenzeitlich entschieden.');
    const now2 = await checkDecider(ctx, cur, actor);
    const { final } = await recordApproval(ctx, cur, actor, now2.stage, now2.index, now2.wf, (key, fin) => insertApproval('approved', key, fin).then(() => undefined));
    if (!final) return;
    await transition(ctx, versionId, 'in_review', `status = 'approved', approved_at = ?, ${clearWorkflowSql().replace('workflow = NULL, ', '')}`, now());
    await db.run("UPDATE generated_chapter_versions SET status = 'superseded' WHERE chapter_id = ? AND status = 'approved' AND id <> ?", v.chapter_id, versionId);
    for (const b of await db.all('SELECT id, version_no FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL', versionId)) {
      await db.run("UPDATE content_blocks SET mode = 'approved', version_no = ?, updated_at = ? WHERE id = ?", b.version_no + 1, now(), b.id);
      await snapshot(ctx, b.id, b.version_no + 1, 'approved', actor, input.comment.trim());
    }
    await audit(ctx, actor, 'chapter_version.approved', 'chapter_version', versionId, { comment: input.comment, gate, stage: stage.key });
  });
  ctx.jobs.wake();
  return getChapterVersion(ctx, versionId);
}
