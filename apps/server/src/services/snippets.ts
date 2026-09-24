// Textabschnitte: kombinierte Suche/Filter und Klassifikationspflege (US-003, US-004, US-017).
import { audit, type Ctx } from '../context.js';
import { parseJson, type Row } from '../db.js';
import { DIVISION_CODES, EVIDENCE_STATUSES, ROLE_CODES } from '../domain/reference.js';
import { badRequest, notFound } from '../problem.js';

export interface SnippetQuery {
  q?: string;
  chapterId?: string;
  subchapterId?: string;
  role?: string;
  division?: string;
  market?: string;
  release?: string;
  evidenceStatus?: string;
  findingType?: string;
  includeHistoric?: boolean;
  page?: number;
  pageSize?: number;
}

const BASE = `
  FROM text_snippets s
  JOIN source_revisions r ON r.id = s.revision_id
  JOIN source_documents d ON d.id = r.document_id
  JOIN chapters c ON c.id = s.chapter_id
  LEFT JOIN subchapters sc ON sc.id = s.subchapter_id`;

const SELECT = `SELECT s.*, r.revision_no, r.is_current, d.id AS document_id, d.path, c.title AS chapter_title, c.position AS chapter_position,
  sc.title AS subchapter_title, sc.position AS subchapter_position`;

export async function toSnippetDto(ctx: Ctx, s: Row) {
  const roles = await ctx.db.all('SELECT role_code AS code, score, method, model_version AS modelVersion, evidence_status AS evidenceStatus, evidence FROM snippet_roles WHERE snippet_id = ? ORDER BY role_code', s.id);
  const divisions = await ctx.db.all('SELECT division_code AS code, score, method, model_version AS modelVersion, evidence_status AS evidenceStatus, evidence FROM snippet_divisions WHERE snippet_id = ? ORDER BY division_code', s.id);
  const findings = await ctx.db.all(
    "SELECT id, seq, type, severity, status FROM quality_findings WHERE (snippet_a_id = ? OR snippet_b_id = ?) AND status NOT IN ('obsolete') ORDER BY seq",
    s.id, s.id,
  );
  return {
    id: s.id,
    seq: s.seq,
    text: s.text,
    kind: s.kind,
    chapter: { id: s.chapter_id, title: s.chapter_title },
    subchapter: s.subchapter_id ? { id: s.subchapter_id, title: s.subchapter_title } : null,
    headingPath: parseJson<string[]>(s.heading_path, []).filter(Boolean),
    position: s.position,
    lineStart: s.line_start,
    lineEnd: s.line_end,
    textHash: s.text_hash,
    evidenceStatus: s.evidence_status,
    market: s.market_code,
    release: s.release_code,
    scopeStatus: s.scope_status,
    note: s.note,
    excludedReason: s.excluded_reason,
    source: { documentId: s.document_id, path: s.path, revisionId: s.revision_id, revisionNo: s.revision_no, isCurrent: !!s.is_current },
    roles,
    divisions,
    findings,
  };
}

export async function searchSnippets(ctx: Ctx, q: SnippetQuery) {
  const where: string[] = ['d.project_id = ?'];
  const params: unknown[] = [ctx.projectId];
  if (!q.includeHistoric) where.push('r.is_current = 1');
  if (q.q) {
    where.push('(LOWER(s.text) LIKE LOWER(?) OR LOWER(d.path) LIKE LOWER(?) OR CAST(s.seq AS TEXT) = ?)');
    params.push(`%${q.q}%`, `%${q.q}%`, q.q.replace(/^#/, ''));
  }
  if (q.chapterId) (where.push('s.chapter_id = ?'), params.push(q.chapterId));
  if (q.subchapterId) (where.push('s.subchapter_id = ?'), params.push(q.subchapterId));
  if (q.role) (where.push('EXISTS (SELECT 1 FROM snippet_roles x WHERE x.snippet_id = s.id AND x.role_code = ?)'), params.push(q.role));
  if (q.division) (where.push('EXISTS (SELECT 1 FROM snippet_divisions x WHERE x.snippet_id = s.id AND x.division_code = ?)'), params.push(q.division));
  if (q.market) (where.push('s.market_code = ?'), params.push(q.market));
  if (q.release) (where.push('s.release_code = ?'), params.push(q.release));
  if (q.evidenceStatus) (where.push('s.evidence_status = ?'), params.push(q.evidenceStatus));
  if (q.findingType) {
    where.push("EXISTS (SELECT 1 FROM quality_findings f WHERE (f.snippet_a_id = s.id OR f.snippet_b_id = s.id) AND f.type = ? AND f.status IN ('open','deferred'))");
    params.push(q.findingType);
  }
  const whereSql = `WHERE ${where.join(' AND ')}`;
  const total = (await ctx.db.get<{ n: number }>(`SELECT COUNT(*) AS n ${BASE} ${whereSql}`, ...params))!.n;
  const pageSize = Math.min(Math.max(q.pageSize ?? 50, 1), 500);
  const page = Math.max(q.page ?? 1, 1);
  const rows = await ctx.db.all(
    `${SELECT} ${BASE} ${whereSql} ORDER BY c.position, COALESCE(sc.position, 0), d.path, s.position LIMIT ? OFFSET ?`,
    ...params, pageSize, (page - 1) * pageSize,
  );
  return { total, page, pageSize, items: await Promise.all(rows.map((r) => toSnippetDto(ctx, r))) };
}

export async function getSnippet(ctx: Ctx, id: string) {
  const row = await ctx.db.get(`${SELECT} ${BASE} WHERE s.id = ?`, id);
  if (!row) throw notFound(`Textabschnitt ${id}`);
  return toSnippetDto(ctx, row);
}

export interface SnippetPatch {
  roles?: string[];
  divisions?: string[];
  confirmRoles?: boolean;
  confirmDivisions?: boolean;
  evidenceStatus?: string;
  market?: string | null;
  release?: string | null;
  confirmScope?: boolean;
  note?: string | null;
}

/** Ändert ausschließlich Klassifikation/Evidenz – der Ursprungstext bleibt unverändert (ADR-004). */
export async function patchSnippet(ctx: Ctx, id: string, patch: SnippetPatch, actor: string) {
  const before = await getSnippet(ctx, id);
  const { db } = ctx;
  if (patch.roles?.some((r) => !ROLE_CODES.includes(r))) throw badRequest(`Unbekannte Rolle. Erlaubt: ${ROLE_CODES.join(', ')}`);
  if (patch.divisions?.some((r) => !DIVISION_CODES.includes(r))) throw badRequest(`Unbekannte Sparte. Erlaubt: ${DIVISION_CODES.join(', ')}`);
  if (patch.evidenceStatus && !(EVIDENCE_STATUSES as readonly string[]).includes(patch.evidenceStatus)) throw badRequest(`Unbekannter Evidenzstatus. Erlaubt: ${EVIDENCE_STATUSES.join(', ')}`);

  await db.tx(async () => {
    if (patch.roles) {
      await db.run('DELETE FROM snippet_roles WHERE snippet_id = ?', id);
      for (const code of patch.roles) await db.run("INSERT INTO snippet_roles VALUES (?, ?, 1, 'manual', 'manual', 'manually_confirmed', ?)", id, code, `bestätigt durch ${actor}`);
    } else if (patch.confirmRoles) {
      await db.run("UPDATE snippet_roles SET evidence_status = 'manually_confirmed', evidence = ? WHERE snippet_id = ? AND evidence_status <> 'source_confirmed'", `bestätigt durch ${actor}`, id);
    }
    if (patch.divisions) {
      await db.run('DELETE FROM snippet_divisions WHERE snippet_id = ?', id);
      for (const code of patch.divisions) await db.run("INSERT INTO snippet_divisions VALUES (?, ?, 1, 'manual', 'manual', 'manually_confirmed', ?)", id, code, `bestätigt durch ${actor}`);
    } else if (patch.confirmDivisions) {
      await db.run("UPDATE snippet_divisions SET evidence_status = 'manually_confirmed', evidence = ? WHERE snippet_id = ? AND evidence_status <> 'source_confirmed'", `bestätigt durch ${actor}`, id);
    }
    if (patch.evidenceStatus) await db.run('UPDATE text_snippets SET evidence_status = ? WHERE id = ?', patch.evidenceStatus, id);
    if (patch.market !== undefined) await db.run('UPDATE text_snippets SET market_code = ? WHERE id = ?', patch.market || null, id);
    if (patch.release !== undefined) await db.run('UPDATE text_snippets SET release_code = ? WHERE id = ?', patch.release || null, id);
    if (patch.market !== undefined || patch.release !== undefined || patch.confirmScope) await db.run("UPDATE text_snippets SET scope_status = 'confirmed' WHERE id = ?", id);
    if (patch.note !== undefined) await db.run('UPDATE text_snippets SET note = ? WHERE id = ?', patch.note, id);
    if (patch.market) await db.run('INSERT INTO markets (code, label) VALUES (?, ?) ON CONFLICT (code) DO NOTHING', patch.market, patch.market);
    if (patch.release) await db.run('INSERT INTO release_scopes (code, label) VALUES (?, ?) ON CONFLICT (code) DO NOTHING', patch.release, patch.release);
    await audit(db, actor, 'snippet.classified', 'snippet', id, { patch, before: { roles: before.roles, divisions: before.divisions, evidenceStatus: before.evidenceStatus } });
  });
  return getSnippet(ctx, id);
}
