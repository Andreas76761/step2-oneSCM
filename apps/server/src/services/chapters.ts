// Kapitel, Generierung, Kapitelwerkstatt, Qualitätsgate und Freigabe (US-008, US-009, US-010, US-012).
import { audit, type Ctx } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { evaluateGate, type GateResult } from '../domain/gate.js';
import { generateChapter, GENERATOR_ID, type GenSnippet } from '../domain/generator.js';
import { BLOCK_KINDS, BLOCK_MODES, CHAPTER_SECTIONS, CONFIRMED_EVIDENCE, DIVISION_CODES, ROLE_CODES, SECTION_CODES } from '../domain/reference.js';
import { badRequest, conflict, notFound, unprocessable } from '../problem.js';

// ---------- Kapitel ----------

export function listChapters(ctx: Ctx) {
  const chapters = ctx.db.all('SELECT * FROM chapters WHERE project_id = ? ORDER BY position, title', ctx.projectId);
  return chapters.map((c) => chapterSummary(ctx, c));
}

function chapterSummary(ctx: Ctx, c: Row) {
  const { db } = ctx;
  const counts = db.get(
    `SELECT COUNT(*) AS total, SUM(CASE WHEN s.evidence_status IN ('source_confirmed','manually_confirmed') THEN 1 ELSE 0 END) AS confirmed
     FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id WHERE s.chapter_id = ? AND r.is_current = 1`, c.id,
  )!;
  const findings = chapterFindings(ctx, c.id);
  const versions = db.all('SELECT id, version_no, status, generated_at, approved_at FROM generated_chapter_versions WHERE chapter_id = ? ORDER BY version_no DESC', c.id);
  const coverage = {
    roles: db.all(
      `SELECT sr.role_code AS code, COUNT(DISTINCT s.id) AS n FROM snippet_roles sr JOIN text_snippets s ON s.id = sr.snippet_id JOIN source_revisions r ON r.id = s.revision_id
       WHERE s.chapter_id = ? AND r.is_current = 1 GROUP BY sr.role_code`, c.id),
    divisions: db.all(
      `SELECT sd.division_code AS code, COUNT(DISTINCT s.id) AS n FROM snippet_divisions sd JOIN text_snippets s ON s.id = sd.snippet_id JOIN source_revisions r ON r.id = s.revision_id
       WHERE s.chapter_id = ? AND r.is_current = 1 GROUP BY sd.division_code`, c.id),
  };
  return {
    id: c.id,
    title: c.title,
    position: c.position,
    subchapters: db.all('SELECT id, title, position FROM subchapters WHERE chapter_id = ? ORDER BY position', c.id),
    snippetCount: counts.total ?? 0,
    confirmedSnippetCount: counts.confirmed ?? 0,
    openFindings: findings.filter((f) => f.status === 'open' || f.status === 'deferred').length,
    openBlockers: findings.filter((f) => (f.status === 'open' || f.status === 'deferred') && f.severity === 'blocker').length,
    coverage,
    versions: versions.map((v) => ({ id: v.id, versionNo: v.version_no, status: v.status, generatedAt: v.generated_at, approvedAt: v.approved_at })),
  };
}

export function getChapter(ctx: Ctx, id: string) {
  const c = ctx.db.get('SELECT * FROM chapters WHERE id = ?', id);
  if (!c) throw notFound(`Kapitel ${id}`);
  return chapterSummary(ctx, c);
}

/** Alle Befunde, die ein Kapitel betreffen (direkt oder über eine der beiden Aussagen). */
function chapterFindings(ctx: Ctx, chapterId: string) {
  return ctx.db.all(
    `SELECT DISTINCT f.id, f.seq, f.type, f.severity, f.status, f.reason FROM quality_findings f
     LEFT JOIN text_snippets sa ON sa.id = f.snippet_a_id LEFT JOIN text_snippets sb ON sb.id = f.snippet_b_id
     WHERE f.status <> 'obsolete' AND (f.chapter_id = ? OR sa.chapter_id = ? OR sb.chapter_id = ?)`,
    chapterId, chapterId, chapterId,
  ) as { id: string; seq: number; type: string; severity: string; status: string; reason: string }[];
}

// ---------- Generierung ----------

function loadGenSnippets(ctx: Ctx, chapterId: string): GenSnippet[] {
  const { db } = ctx;
  const rows = db.all(
    `SELECT s.*, sc.title AS subchapter_title, COALESCE(sc.position, 0) AS sub_pos, d.path, r.revision_no
     FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     LEFT JOIN subchapters sc ON sc.id = s.subchapter_id
     WHERE s.chapter_id = ? AND r.is_current = 1 AND s.excluded_reason IS NULL
     ORDER BY sub_pos, d.path, s.position`, chapterId,
  );
  return rows.map((s, i) => {
    const topic = db.get(
      `SELECT t.id, t.title, c.title AS lead FROM canonical_topic_members m JOIN canonical_topics t ON t.id = m.topic_id JOIN chapters c ON c.id = t.lead_chapter_id
       WHERE m.snippet_id = ? AND t.lead_chapter_id <> ?`, s.id, chapterId,
    );
    return {
      id: s.id, seq: s.seq, text: s.text, kind: s.kind, evidenceStatus: s.evidence_status, subchapterTitle: s.subchapter_title,
      headingPath: parseJson<string[]>(s.heading_path, []).filter(Boolean), order: i, normHash: s.norm_hash,
      roles: db.all('SELECT role_code AS code, evidence_status AS evidenceStatus FROM snippet_roles WHERE snippet_id = ?', s.id),
      divisions: db.all('SELECT division_code AS code, evidence_status AS evidenceStatus FROM snippet_divisions WHERE snippet_id = ?', s.id),
      market: s.market_code, release: s.release_code, scopeStatus: s.scope_status, sourceLabel: `${s.path} (Rev. ${s.revision_no})`,
      canonicalRedirect: topic ? { topicId: topic.id, topicTitle: topic.title, leadChapterTitle: topic.lead } : null,
    };
  });
}

export function gateForChapter(ctx: Ctx, chapterId: string, purpose: 'generate' | 'approve' | 'export', versionId?: string): GateResult {
  const findings = chapterFindings(ctx, chapterId);
  const blocks = versionId ? activeBlocks(ctx, versionId).map(gateBlock) : [];
  return evaluateGate(blocks, findings, { purpose });
}

export function generate(ctx: Ctx, chapterId: string, actor: string) {
  const chapter = ctx.db.get('SELECT * FROM chapters WHERE id = ?', chapterId);
  if (!chapter) throw notFound(`Kapitel ${chapterId}`);
  const gate = gateForChapter(ctx, chapterId, 'generate');
  if (!gate.passed) throw conflict('Generierung blockiert: offene Blocker-Befunde müssen zuerst geklärt werden.', { gate });

  const snippets = loadGenSnippets(ctx, chapterId);
  if (!snippets.some((s) => CONFIRMED_EVIDENCE.includes(s.evidenceStatus))) {
    throw unprocessable('Keine bestätigten Quellen (source_confirmed/manually_confirmed) in diesem Kapitel – es wird nichts generiert.');
  }
  const result = generateChapter(chapter.title, snippets);
  const { db } = ctx;
  const prev = db.get("SELECT * FROM generated_chapter_versions WHERE chapter_id = ? ORDER BY version_no DESC LIMIT 1", chapterId);
  const versionId = newId('cv');
  const currentIds = new Set(snippets.map((s) => s.id));

  db.tx(() => {
    db.run(
      "INSERT INTO generated_chapter_versions (id, chapter_id, version_no, status, title, based_on_version_id, generator, generated_by, generated_at) VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?)",
      versionId, chapterId, (prev?.version_no ?? 0) + 1, chapter.title, prev?.id ?? null, GENERATOR_ID, actor, now(),
    );
    if (prev?.status === 'draft') db.run("UPDATE generated_chapter_versions SET status = 'superseded' WHERE id = ?", prev.id);

    // Manuelle und gesperrte Blöcke übernehmen – nie still überschreiben (US-009).
    const prevBlocks = prev ? activeBlocks(ctx, prev.id).map((b) => ({ ...b, mode: effectiveMode(ctx, b.id, b.mode) })) : [];
    const carried = prevBlocks.filter((b) => MANUAL_MODES.includes(b.mode));
    const carriedSourceKeys = new Set<string>();
    const prevGenerated = prevBlocks.filter((b) => b.mode === 'generated');
    for (const b of carried) {
      const sources: string[] = b.sources.map((s: Row) => s.snippetId);
      carriedSourceKeys.add([...sources].sort().join('|'));
      const sourcesChanged = sources.some((s) => !currentIds.has(s));
      const mode = b.mode === 'manually_edited' && sourcesChanged ? 'needs_regeneration' : b.mode;
      insertBlock(ctx, versionId, { ...b, mode, lineageId: b.lineageId, sourceIds: sources }, actor, sourcesChanged ? 'Quelle geändert – Prüfung erforderlich' : 'aus Vorversion übernommen (manuell geschützt)');
    }
    let pos = 0;
    for (const g of result.blocks) {
      const key = [...g.sourceIds].sort().join('|');
      if (g.sourceIds.length && carriedSourceKeys.has(key)) continue;
      const lineage = prevGenerated.find((p) => [...p.sources.map((s: Row) => s.snippetId)].sort().join('|') === key && key)?.lineageId ?? newId('ln');
      insertBlock(ctx, versionId, {
        section: g.section, position: pos++, kind: g.kind, text: g.text, mode: 'generated', market: g.market, release: g.release, scopeStatus: g.scopeStatus,
        roles: g.roles, divisions: g.divisions, sourceIds: g.sourceIds, lineageId: lineage, justification: null, comment: null,
      }, actor, 'generiert');
    }
    normalizePositions(ctx, versionId);
    audit(db, actor, 'chapter.generated', 'chapter_version', versionId, { chapterId, gaps: result.gaps, used: result.usedSnippetIds.length, skippedUnconfirmed: result.skippedUnconfirmed, deduplicated: result.deduplicated, carried: carried.length });
  });
  return { ...getChapterVersion(ctx, versionId), generation: { gaps: result.gaps, usedSnippets: result.usedSnippetIds.length, skippedUnconfirmed: result.skippedUnconfirmed, deduplicated: result.deduplicated } };
}

const MANUAL_MODES = ['manually_edited', 'locked', 'needs_regeneration'];

/** Bei freigegebenen Blöcken zählt der Modus vor der Freigabe (manuelle Änderungen bleiben geschützt). */
function effectiveMode(ctx: Ctx, blockId: string, mode: string): string {
  if (mode !== 'approved') return mode;
  const v = ctx.db.get("SELECT snapshot FROM content_block_versions WHERE block_id = ? AND change_type <> 'approved' ORDER BY version_no DESC LIMIT 1", blockId);
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
}

function insertBlock(ctx: Ctx, versionId: string, b: BlockInput, actor: string, reason: string) {
  const id = newId('cb');
  const { db } = ctx;
  db.run(
    `INSERT INTO content_blocks (id, chapter_version_id, lineage_id, section_code, position, kind, text, mode, market_code, release_code, scope_status, justification, comment, version_no, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
    id, versionId, b.lineageId, b.section, b.position, b.kind, b.text, b.mode, b.market, b.release, b.scopeStatus, b.justification, b.comment, now(),
  );
  for (const r of b.roles) db.run('INSERT OR IGNORE INTO content_block_roles VALUES (?, ?)', id, r);
  for (const d of b.divisions) db.run('INSERT OR IGNORE INTO content_block_divisions VALUES (?, ?)', id, d);
  for (const s of b.sourceIds) db.run('INSERT OR IGNORE INTO content_block_sources VALUES (?, ?)', id, s);
  snapshot(ctx, id, 1, 'created', actor, reason);
  return id;
}

function blockRow(ctx: Ctx, id: string) {
  const b = ctx.db.get('SELECT * FROM content_blocks WHERE id = ?', id);
  if (!b) throw notFound(`Content Block ${id}`);
  return b;
}

function blockDto(ctx: Ctx, b: Row) {
  const { db } = ctx;
  return {
    id: b.id, chapterVersionId: b.chapter_version_id, lineageId: b.lineage_id, section: b.section_code, position: b.position, kind: b.kind, text: b.text, mode: b.mode,
    market: b.market_code, release: b.release_code, scopeStatus: b.scope_status, justification: b.justification, comment: b.comment, versionNo: b.version_no,
    deletedAt: b.deleted_at, updatedAt: b.updated_at,
    roles: db.all('SELECT role_code FROM content_block_roles WHERE block_id = ? ORDER BY role_code', b.id).map((r) => r.role_code as string),
    divisions: db.all('SELECT division_code FROM content_block_divisions WHERE block_id = ? ORDER BY division_code', b.id).map((r) => r.division_code as string),
    sources: db.all(
      `SELECT s.id AS snippetId, s.seq, d.path, r.revision_no AS revisionNo, r.id AS revisionId, s.line_start AS lineStart, s.line_end AS lineEnd, r.is_current AS isCurrent, s.evidence_status AS evidenceStatus
       FROM content_block_sources x JOIN text_snippets s ON s.id = x.snippet_id JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
       WHERE x.block_id = ? ORDER BY s.seq`, b.id,
    ).map((s) => ({ ...s, isCurrent: !!s.isCurrent }) as { snippetId: string; seq: number; path: string; revisionNo: number; revisionId: string; lineStart: number; lineEnd: number; isCurrent: boolean; evidenceStatus: string }),
  };
}

function activeBlocks(ctx: Ctx, versionId: string) {
  return ctx.db.all('SELECT * FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL ORDER BY position', versionId).map((b) => blockDto(ctx, b));
}

const gateBlock = (b: ReturnType<typeof blockDto>) => ({ id: b.id, kind: b.kind, section: b.section, sourceCount: b.sources.length, justification: b.justification, scopeStatus: b.scopeStatus, mode: b.mode });

function snapshot(ctx: Ctx, blockId: string, versionNo: number, changeType: string, actor: string, reason: string | null) {
  const b = blockDto(ctx, blockRow(ctx, blockId));
  const { sources, ...rest } = b;
  ctx.db.run(
    'INSERT INTO content_block_versions (id, block_id, version_no, change_type, snapshot, author, reason, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    newId('cbv'), blockId, versionNo, changeType, json({ ...rest, sourceIds: sources.map((s) => s.snippetId) }), actor, reason, now(),
  );
}

function normalizePositions(ctx: Ctx, versionId: string) {
  const order = SECTION_CODES;
  const rows = ctx.db.all('SELECT id, section_code, position FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL', versionId);
  rows.sort((a, b) => order.indexOf(a.section_code) - order.indexOf(b.section_code) || a.position - b.position);
  rows.forEach((r, i) => ctx.db.run('UPDATE content_blocks SET position = ? WHERE id = ?', i * 10, r.id));
}

export function getChapterVersion(ctx: Ctx, versionId: string) {
  const v = ctx.db.get('SELECT * FROM generated_chapter_versions WHERE id = ?', versionId);
  if (!v) throw notFound(`Kapitelversion ${versionId}`);
  const blocks = activeBlocks(ctx, versionId);
  const approvals = ctx.db.all('SELECT id, approver, decision, comment, gate_result, created_at FROM approvals WHERE chapter_version_id = ? ORDER BY created_at', versionId);
  return {
    id: v.id, chapterId: v.chapter_id, versionNo: v.version_no, status: v.status, title: v.title, basedOnVersionId: v.based_on_version_id,
    generator: v.generator, generatedBy: v.generated_by, generatedAt: v.generated_at, approvedAt: v.approved_at,
    sections: CHAPTER_SECTIONS.map((s) => ({ code: s.code, title: s.title, blocks: blocks.filter((b) => b.section === s.code) })),
    approvals: approvals.map((a) => ({ id: a.id, approver: a.approver, decision: a.decision, comment: a.comment, gateResult: parseJson(a.gate_result, {}), createdAt: a.created_at })),
    deletedBlocks: ctx.db.all('SELECT id, section_code AS section, text, deleted_at AS deletedAt FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NOT NULL', versionId),
  };
}

export function listChapterVersions(ctx: Ctx, chapterId: string) {
  return ctx.db.all('SELECT id, version_no AS versionNo, status, generated_at AS generatedAt, generated_by AS generatedBy, approved_at AS approvedAt FROM generated_chapter_versions WHERE chapter_id = ? ORDER BY version_no DESC', chapterId);
}

// ---------- Kapitelwerkstatt ----------

function assertEditable(ctx: Ctx, versionId: string) {
  const v = ctx.db.get('SELECT status, version_no FROM generated_chapter_versions WHERE id = ?', versionId);
  if (!v) throw notFound(`Kapitelversion ${versionId}`);
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
  if (p.mode && !(BLOCK_MODES as readonly string[]).includes(p.mode)) throw badRequest('Unbekannter Bearbeitungsmodus.');
  if (p.scopeStatus && !['confirmed', 'general', 'unconfirmed'].includes(p.scopeStatus)) throw badRequest('scopeStatus muss confirmed, general oder unconfirmed sein.');
}

export function patchBlock(ctx: Ctx, id: string, p: BlockPatch, actor: string) {
  validatePatch(p);
  const b = blockRow(ctx, id);
  if (b.deleted_at) throw conflict('Block ist gelöscht – bitte zuerst wiederherstellen.');
  assertEditable(ctx, b.chapter_version_id);
  if (p.expectedVersionNo !== undefined && p.expectedVersionNo !== b.version_no) {
    throw conflict(`Block wurde zwischenzeitlich geändert (aktuelle Version ${b.version_no}).`, { currentVersionNo: b.version_no });
  }
  const unlocking = p.mode === 'manually_edited' || p.mode === 'generated';
  const contentChange = p.text !== undefined || p.section !== undefined || p.kind !== undefined || p.roles !== undefined || p.divisions !== undefined ||
    p.market !== undefined || p.release !== undefined || p.scopeStatus !== undefined || p.justification !== undefined || p.sourceIds !== undefined;
  if (b.mode === 'locked' && contentChange && !unlocking) throw conflict('Block ist gesperrt. Zum Bearbeiten zuerst entsperren (mode: manually_edited).');

  const { db } = ctx;
  let changeType = 'edited';
  db.tx(() => {
    const set: string[] = [];
    const vals: unknown[] = [];
    const upd = (col: string, v: unknown) => (set.push(`${col} = ?`), vals.push(v));
    if (p.text !== undefined) {
      if (!p.text.trim()) throw unprocessable('Text darf nicht leer sein – zum Entfernen DELETE verwenden.');
      upd('text', p.text);
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
    db.run(`UPDATE content_blocks SET ${set.join(', ')} WHERE id = ?`, ...vals, id);
    if (p.roles) {
      db.run('DELETE FROM content_block_roles WHERE block_id = ?', id);
      for (const r of p.roles) db.run('INSERT INTO content_block_roles VALUES (?, ?)', id, r);
    }
    if (p.divisions) {
      db.run('DELETE FROM content_block_divisions WHERE block_id = ?', id);
      for (const d of p.divisions) db.run('INSERT INTO content_block_divisions VALUES (?, ?)', id, d);
    }
    if (p.sourceIds) {
      db.run('DELETE FROM content_block_sources WHERE block_id = ?', id);
      for (const s of p.sourceIds) {
        if (!db.get('SELECT id FROM text_snippets WHERE id = ?', s)) throw badRequest(`Textabschnitt ${s} existiert nicht.`);
        db.run('INSERT INTO content_block_sources VALUES (?, ?)', id, s);
      }
    }
    if (p.position !== undefined || p.section !== undefined) normalizePositions(ctx, b.chapter_version_id);
    snapshot(ctx, id, b.version_no + 1, changeType, actor, p.reason ?? null);
    audit(db, actor, `content_block.${changeType}`, 'content_block', id, { ...p, previousVersion: b.version_no });
  });
  return blockDto(ctx, blockRow(ctx, id));
}

export function createBlock(ctx: Ctx, versionId: string, p: BlockPatch & { text: string; section: string }, actor: string) {
  validatePatch(p);
  assertEditable(ctx, versionId);
  if (!p.text?.trim()) throw unprocessable('Text ist Pflicht.');
  if (!p.section) throw unprocessable('Abschnitt (section) ist Pflicht.');
  let id = '';
  ctx.db.tx(() => {
    const maxPos = ctx.db.get<{ m: number | null }>('SELECT MAX(position) m FROM content_blocks WHERE chapter_version_id = ? AND section_code = ?', versionId, p.section)?.m;
    id = insertBlock(ctx, versionId, {
      section: p.section, position: p.position ?? (maxPos ?? 100000) + 1, kind: p.kind ?? 'paragraph', text: p.text, mode: 'manually_edited', market: p.market ?? null, release: p.release ?? null,
      scopeStatus: p.scopeStatus ?? 'unconfirmed', roles: p.roles ?? [], divisions: p.divisions ?? [], sourceIds: p.sourceIds ?? [], lineageId: newId('ln'),
      justification: p.justification ?? null, comment: p.comment ?? null,
    }, actor, p.reason ?? 'manuell hinzugefügt');
    normalizePositions(ctx, versionId);
    audit(ctx.db, actor, 'content_block.created', 'content_block', id, p);
  });
  return blockDto(ctx, blockRow(ctx, id));
}

export function deleteBlock(ctx: Ctx, id: string, reason: string | undefined, actor: string) {
  const b = blockRow(ctx, id);
  if (b.deleted_at) throw conflict('Block ist bereits gelöscht.');
  assertEditable(ctx, b.chapter_version_id);
  if (b.mode === 'locked') throw conflict('Gesperrte Blöcke können nicht gelöscht werden.');
  ctx.db.tx(() => {
    ctx.db.run('UPDATE content_blocks SET deleted_at = ?, version_no = ?, updated_at = ? WHERE id = ?', now(), b.version_no + 1, now(), id);
    snapshot(ctx, id, b.version_no + 1, 'deleted', actor, reason ?? null);
    audit(ctx.db, actor, 'content_block.deleted', 'content_block', id, { reason });
  });
}

export function listBlockVersions(ctx: Ctx, id: string) {
  blockRow(ctx, id);
  return ctx.db.all('SELECT version_no, change_type, snapshot, author, reason, created_at FROM content_block_versions WHERE block_id = ? ORDER BY version_no DESC', id).map((v) => ({
    versionNo: v.version_no, changeType: v.change_type, snapshot: parseJson(v.snapshot, {}), author: v.author, reason: v.reason, createdAt: v.created_at,
  }));
}

/** Frühere Version wiederherstellen – erzeugt eine neue Version (append-only). */
export function restoreBlock(ctx: Ctx, id: string, versionNo: number, actor: string) {
  const b = blockRow(ctx, id);
  assertEditable(ctx, b.chapter_version_id);
  const v = ctx.db.get('SELECT snapshot FROM content_block_versions WHERE block_id = ? AND version_no = ?', id, versionNo);
  if (!v) throw notFound(`Version ${versionNo} von Block ${id}`);
  const s = parseJson<any>(v.snapshot, {});
  const { db } = ctx;
  db.tx(() => {
    db.run(
      `UPDATE content_blocks SET text = ?, section_code = ?, kind = ?, market_code = ?, release_code = ?, scope_status = ?, justification = ?, comment = ?,
       mode = ?, deleted_at = NULL, version_no = ?, updated_at = ? WHERE id = ?`,
      s.text, s.section, s.kind, s.market, s.release, s.scopeStatus, s.justification, s.comment, s.mode === 'approved' ? 'manually_edited' : s.mode === 'generated' ? 'manually_edited' : s.mode,
      b.version_no + 1, now(), id,
    );
    db.run('DELETE FROM content_block_roles WHERE block_id = ?', id);
    for (const r of s.roles ?? []) db.run('INSERT INTO content_block_roles VALUES (?, ?)', id, r);
    db.run('DELETE FROM content_block_divisions WHERE block_id = ?', id);
    for (const d of s.divisions ?? []) db.run('INSERT INTO content_block_divisions VALUES (?, ?)', id, d);
    db.run('DELETE FROM content_block_sources WHERE block_id = ?', id);
    for (const sid of s.sourceIds ?? []) db.run('INSERT INTO content_block_sources VALUES (?, ?)', id, sid);
    normalizePositions(ctx, b.chapter_version_id);
    snapshot(ctx, id, b.version_no + 1, 'restored', actor, `Wiederhergestellt aus Version ${versionNo}`);
    audit(db, actor, 'content_block.restored', 'content_block', id, { fromVersion: versionNo });
  });
  return blockDto(ctx, blockRow(ctx, id));
}

// ---------- Qualitätsgate und Freigabe ----------

export function versionGate(ctx: Ctx, versionId: string) {
  const v = ctx.db.get('SELECT chapter_id FROM generated_chapter_versions WHERE id = ?', versionId);
  if (!v) throw notFound(`Kapitelversion ${versionId}`);
  return gateForChapter(ctx, v.chapter_id, 'approve', versionId);
}

export function approveVersion(ctx: Ctx, versionId: string, input: { comment: string; decision?: 'approved' | 'rejected' }, actor: string) {
  const v = ctx.db.get('SELECT * FROM generated_chapter_versions WHERE id = ?', versionId);
  if (!v) throw notFound(`Kapitelversion ${versionId}`);
  if (v.status !== 'draft') throw conflict(`Kapitelversion ist bereits ${v.status}.`);
  if (!input.comment?.trim()) throw unprocessable('Die fachliche Freigabe benötigt einen Kommentar.');
  const decision = input.decision ?? 'approved';
  const gate = versionGate(ctx, versionId);
  const { db } = ctx;
  if (decision === 'rejected') {
    db.run('INSERT INTO approvals (id, chapter_version_id, approver, decision, comment, gate_result, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', newId('ap'), versionId, actor, 'rejected', input.comment.trim(), json(gate), now());
    audit(db, actor, 'chapter_version.rejected', 'chapter_version', versionId, { comment: input.comment });
    return getChapterVersion(ctx, versionId);
  }
  if (!gate.passed) throw conflict('Qualitätsgate nicht bestanden – Freigabe nicht möglich.', { gate });
  db.tx(() => {
    db.run("UPDATE generated_chapter_versions SET status = 'superseded' WHERE chapter_id = ? AND status = 'approved'", v.chapter_id);
    db.run("UPDATE generated_chapter_versions SET status = 'approved', approved_at = ? WHERE id = ?", now(), versionId);
    for (const b of db.all('SELECT id, version_no FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL', versionId)) {
      db.run("UPDATE content_blocks SET mode = 'approved', version_no = ?, updated_at = ? WHERE id = ?", b.version_no + 1, now(), b.id);
      snapshot(ctx, b.id, b.version_no + 1, 'approved', actor, input.comment.trim());
    }
    db.run('INSERT INTO approvals (id, chapter_version_id, approver, decision, comment, gate_result, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', newId('ap'), versionId, actor, 'approved', input.comment.trim(), json(gate), now());
    audit(db, actor, 'chapter_version.approved', 'chapter_version', versionId, { comment: input.comment, gate });
  });
  return getChapterVersion(ctx, versionId);
}
