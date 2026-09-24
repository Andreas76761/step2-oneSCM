// Mandanten/Projekte (ADR-014): mehrere Handbuch-Projekte mit Sichtbarkeit und Mitgliedschaften.
// Wirksame Berechtigungen in einem Projekt:
//   globale Administration → alle Projekte, alle Rechte
//   Mitglied               → Berechtigungen der Mitgliedschaft
//   offenes Projekt        → globale Berechtigungen des Benutzers
//   sonst                  → kein Zugriff
// Archivierte Projekte sind nur lesbar.
import { audit, DEFAULT_PROJECT_ID, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { PERMISSIONS } from '../domain/reference.js';
import { badRequest, conflict, forbidden, notFound, Problem } from '../problem.js';
import { seedTerminology } from './terminology.js';
import { LANGUAGES } from '../domain/translate.js';

export type Visibility = 'open' | 'restricted';

export function withProject(ctx: Ctx, projectId: string): Ctx {
  return projectId === ctx.projectId ? ctx : { ...ctx, projectId };
}

const isAdmin = (u: User) => u.permissions.includes('admin');

async function projectRow(ctx: Ctx, id: string) {
  const p = await ctx.db.get('SELECT * FROM projects WHERE id = ?', id);
  if (!p) throw notFound(`Projekt ${id}`);
  return p;
}

/** Wirksamer Benutzer im Projekt oder null, wenn kein Zugriff besteht. */
export async function effectiveUser(ctx: Ctx, user: User, project: Row): Promise<User | null> {
  let perms: string[] | null = null;
  if (isAdmin(user)) perms = user.permissions;
  else {
    const m = await ctx.db.get('SELECT permissions FROM project_members WHERE project_id = ? AND user_id = ?', project.id, user.id);
    if (m) perms = parseJson<string[]>(m.permissions, []);
    else if (project.visibility === 'open') perms = user.permissions;
  }
  if (!perms) return null;
  if (project.archived_at) perms = perms.filter((p) => p === 'read');
  return { ...user, permissions: perms };
}

/** Projekt einer Anfrage auflösen (Header `X-Project-Id`, Standard `p_default`). */
export async function resolveProject(ctx: Ctx, user: User, projectId: string | undefined) {
  if (user.token) {
    // API-Token: nur das gebundene Projekt, Berechtigungen = Scopes (archiviert: nur lesen)
    const id = projectId?.trim() || user.token.projectId;
    if (id !== user.token.projectId) throw forbidden('Das API-Token gilt nicht für dieses Projekt.');
    const p = await ctx.db.get('SELECT * FROM projects WHERE id = ?', id);
    if (!p) throw new Problem(404, 'Not Found', `Projekt ${id} wurde nicht gefunden.`);
    const perms = p.archived_at ? user.token.scopes.filter((s) => s === 'read') : user.token.scopes;
    return { ctx: withProject(ctx, id), user: { ...user, permissions: perms } };
  }
  const id = projectId?.trim() || DEFAULT_PROJECT_ID;
  const p = await ctx.db.get('SELECT * FROM projects WHERE id = ?', id);
  if (!p) throw new Problem(404, 'Not Found', `Projekt ${id} wurde nicht gefunden.`);
  const eff = await effectiveUser(ctx, user, p);
  if (!eff) throw forbidden(`Kein Zugriff auf Projekt „${p.name}“.`);
  return { ctx: withProject(ctx, id), user: eff };
}

function dto(p: Row, eff: User | null, counts?: Row) {
  return {
    id: p.id, name: p.name, description: p.description ?? null, visibility: p.visibility as Visibility, createdAt: p.created_at, createdBy: p.created_by ?? null,
    archivedAt: p.archived_at ?? null, myPermissions: eff?.permissions ?? [], languages: parseJson<string[]>(p.languages, []),
    ...(counts ? { chapters: counts.chapters ?? 0, sources: counts.sources ?? 0 } : {}),
  };
}

export async function listProjects(ctx: Ctx, user: User) {
  const rows = await ctx.db.all('SELECT * FROM projects ORDER BY archived_at IS NOT NULL, LOWER(name)');
  const out = [];
  for (const p of rows) {
    const eff = await effectiveUser(ctx, user, p);
    if (!eff) continue;
    const counts = await ctx.db.get(
      'SELECT (SELECT COUNT(*) FROM chapters WHERE project_id = ?) AS chapters, (SELECT COUNT(*) FROM source_documents WHERE project_id = ?) AS sources',
      p.id, p.id,
    );
    out.push(dto(p, eff, counts));
  }
  return out;
}

function cleanPermissions(v: unknown): string[] {
  if (!Array.isArray(v) || !v.length) throw badRequest('permissions muss eine nicht leere Liste sein.');
  const perms = [...new Set(v.map(String))];
  const unknown = perms.filter((p) => !(PERMISSIONS as readonly string[]).includes(p));
  if (unknown.length) throw badRequest(`Unbekannte Berechtigung: ${unknown.join(', ')}`);
  if (!perms.includes('read')) perms.unshift('read');
  return perms;
}

function cleanVisibility(v: unknown): Visibility {
  if (v !== 'open' && v !== 'restricted') throw badRequest('visibility muss open oder restricted sein.');
  return v;
}

export async function createProject(ctx: Ctx, input: { name?: string; description?: string; visibility?: string }, user: User) {
  const name = input.name?.trim();
  if (!name) throw badRequest('Name ist Pflicht.');
  if (name.length > 120) throw badRequest('Name ist zu lang (max. 120 Zeichen).');
  const visibility = cleanVisibility(input.visibility ?? 'restricted');
  const { db } = ctx;
  if (await db.get('SELECT id FROM projects WHERE LOWER(name) = LOWER(?)', name)) throw conflict(`Ein Projekt „${name}“ existiert bereits.`);
  const id = newId('p');
  await db.tx(async () => {
    await db.run('INSERT INTO projects (id, name, description, visibility, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)', id, name, input.description?.trim() || null, visibility, user.id, now());
    await seedTerminology(db, id);
    await audit(withProject(ctx, id), user.id, 'project.created', 'project', id, { name, visibility });
  });
  const p = await projectRow(ctx, id);
  return dto(p, await effectiveUser(ctx, user, p));
}

export async function updateProject(ctx: Ctx, id: string, input: { name?: string; description?: string | null; visibility?: string; archived?: boolean; languages?: unknown }, user: User) {
  const p = await projectRow(ctx, id);
  const set: string[] = [];
  const vals: unknown[] = [];
  if (input.name !== undefined) {
    const name = input.name.trim();
    if (!name) throw badRequest('Name darf nicht leer sein.');
    if (await ctx.db.get('SELECT id FROM projects WHERE LOWER(name) = LOWER(?) AND id <> ?', name, id)) throw conflict(`Ein Projekt „${name}“ existiert bereits.`);
    set.push('name = ?'), vals.push(name);
  }
  if (input.description !== undefined) set.push('description = ?'), vals.push(input.description?.trim() || null);
  if (input.visibility !== undefined) set.push('visibility = ?'), vals.push(cleanVisibility(input.visibility));
  if (input.archived !== undefined) {
    if (id === DEFAULT_PROJECT_ID && input.archived) throw conflict('Das Standardprojekt kann nicht archiviert werden.');
    set.push('archived_at = ?'), vals.push(input.archived ? (p.archived_at ?? now()) : null);
  }
  if (input.languages !== undefined) {
    // Zielsprachen für Übersetzungen (ADR-020); Quellsprache ist Deutsch
    if (!Array.isArray(input.languages) || input.languages.some((l) => typeof l !== 'string' || !LANGUAGES[l])) {
      throw badRequest(`languages muss eine Liste aus ${Object.keys(LANGUAGES).join(', ')} sein.`);
    }
    set.push('languages = ?'), vals.push(json([...new Set(input.languages as string[])]));
  }
  if (!set.length) throw badRequest('Keine Änderung angegeben.');
  await ctx.db.tx(async () => {
    await ctx.db.run(`UPDATE projects SET ${set.join(', ')} WHERE id = ?`, ...vals, id);
    await audit(withProject(ctx, id), user.id, 'project.updated', 'project', id, input);
  });
  const np = await projectRow(ctx, id);
  return dto(np, await effectiveUser(ctx, user, np));
}

export async function listMembers(ctx: Ctx, projectId: string) {
  await projectRow(ctx, projectId);
  return (await ctx.db.all(
    'SELECT m.user_id, m.permissions, m.added_by, m.added_at, u.name FROM project_members m LEFT JOIN users u ON u.id = m.user_id WHERE m.project_id = ? ORDER BY m.user_id',
    projectId,
  )).map((m) => ({ userId: m.user_id, name: m.name ?? null, permissions: parseJson<string[]>(m.permissions, []), addedBy: m.added_by, addedAt: m.added_at }));
}

export async function setMember(ctx: Ctx, projectId: string, userId: string, input: { permissions?: unknown }, actor: User) {
  await projectRow(ctx, projectId);
  const uid = userId.trim();
  if (!uid || uid.length > 200) throw badRequest('Ungültige Benutzerkennung.');
  const perms = cleanPermissions(input.permissions);
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO project_members (project_id, user_id, permissions, added_by, added_at) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (project_id, user_id) DO UPDATE SET permissions = excluded.permissions, added_by = excluded.added_by, added_at = excluded.added_at`,
      projectId, uid, json(perms), actor.id, now(),
    );
    await audit(withProject(ctx, projectId), actor.id, 'project.member_set', 'project', projectId, { userId: uid, permissions: perms });
  });
  return listMembers(ctx, projectId);
}

export async function removeMember(ctx: Ctx, projectId: string, userId: string, actor: User) {
  await projectRow(ctx, projectId);
  await ctx.db.tx(async () => {
    const res = await ctx.db.run('DELETE FROM project_members WHERE project_id = ? AND user_id = ?', projectId, userId);
    if (!res.changes) throw notFound(`Mitglied ${userId}`);
    await audit(withProject(ctx, projectId), actor.id, 'project.member_removed', 'project', projectId, { userId });
  });
}

// ---------- Mandantentrennung für IDs in Pfaden und Nutzdaten ----------

/** Projekt einer Ressource je Pfadparameter; unbekannte IDs werden von der Route selbst mit 404 beantwortet. */
const OWNER_SQL: Record<string, string> = {
  chapterId: 'SELECT project_id FROM chapters WHERE id = ?',
  versionId: 'SELECT c.project_id FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE v.id = ?',
  blockId: 'SELECT c.project_id FROM content_blocks b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id WHERE b.id = ?',
  proposalId: `SELECT c.project_id FROM rewrite_proposals p JOIN content_blocks b ON b.id = p.block_id JOIN generated_chapter_versions v ON v.id = b.chapter_version_id
               JOIN chapters c ON c.id = v.chapter_id WHERE p.id = ?`,
  snippetId: 'SELECT d.project_id FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id WHERE s.id = ?',
  revisionId: 'SELECT d.project_id FROM source_revisions r JOIN source_documents d ON d.id = r.document_id WHERE r.id = ?',
  findingId: 'SELECT project_id FROM quality_findings WHERE id = ?',
  clusterId: 'SELECT project_id FROM semantic_clusters WHERE id = ?',
  importId: 'SELECT project_id FROM imports WHERE id = ?',
  runId: 'SELECT project_id FROM analysis_runs WHERE id = ?',
  exportId: 'SELECT project_id FROM exports WHERE id = ?',
  termId: 'SELECT project_id FROM terminology_terms WHERE id = ?',
  commentId: 'SELECT project_id FROM comments WHERE id = ?',
  translationId: 'SELECT project_id FROM translations WHERE id = ?',
  translationBlockId: 'SELECT t.project_id FROM translation_blocks b JOIN translations t ON t.id = b.translation_id WHERE b.id = ?',
  releaseId: 'SELECT project_id FROM handbook_releases WHERE id = ?',
  connectionId: 'SELECT project_id FROM source_connections WHERE id = ?',
  answerId: 'SELECT project_id FROM assistant_log WHERE id = ?',
  tokenId: 'SELECT project_id FROM api_tokens WHERE id = ?',
  webhookId: 'SELECT project_id FROM webhook_subscriptions WHERE id = ?',
  deliveryId: 'SELECT s.project_id FROM webhook_deliveries d JOIN webhook_subscriptions s ON s.id = d.subscription_id WHERE d.id = ?',
  batchId: 'SELECT c.project_id FROM rewrite_batches b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id WHERE b.id = ?',
};

/** Pfadparameter prüfen: Ressourcen anderer Projekte gelten als nicht vorhanden (keine Preisgabe fremder IDs). */
export async function assertParamsInProject(ctx: Ctx, params: Record<string, string> | undefined) {
  for (const [key, value] of Object.entries(params ?? {})) {
    const sql = OWNER_SQL[key];
    if (!sql || typeof value !== 'string') continue;
    const row = await ctx.db.get<{ project_id: string }>(sql, value);
    if (row && row.project_id !== ctx.projectId) throw notFound(`${key.replace(/Id$/, '')} ${value}`);
  }
}

/** IDs aus Nutzdaten (z. B. Quellen eines Absatzes) müssen zum aktuellen Projekt gehören. */
export async function assertIdsInProject(ctx: Ctx, kind: keyof typeof OWNER_SQL, ids: string[]) {
  for (const id of ids) {
    const row = await ctx.db.get<{ project_id: string }>(OWNER_SQL[kind], id);
    if (!row || row.project_id !== ctx.projectId) throw badRequest(`${kind.replace(/Id$/, '')} ${id} existiert in diesem Projekt nicht.`);
  }
}
