// Gliederungen, Draft Manual und Redaktionsplanung (ADR-032, ADR-033).
// Gliederungen sind eine zusätzliche Sicht: Textschnipsel werden Kapiteln/Unterkapiteln zugeordnet,
// die bestehende Kapitelstruktur, Werkstatt und Freigabe bleiben unverändert.
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { countNodes, matchKey, MAX_NODES, numberNodes, outlineToMarkdown, parseOutlineJson, parseOutlineMarkdown, stripNumber, variantProblems, type OutlineTreeNode } from '../domain/outline.js';
import { DIVISION_CODES, ROLE_CODES } from '../domain/reference.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { assertIdsInProject } from './projects.js';

export type MarketScope = 'blueprint' | 'markets';
export const OUTLINE_STATUS = ['draft', 'active', 'archived'] as const;
export const PLAN_STATUS = ['open', 'in_progress', 'review', 'done'] as const;

export interface OutlineInput {
  name?: string;
  description?: string | null;
  roles?: string[];
  divisions?: string[];
  marketScope?: MarketScope;
  markets?: string[];
  status?: string;
}

async function projectMarkets(ctx: Ctx) {
  const p = await ctx.db.get<{ markets: string }>('SELECT markets FROM projects WHERE id = ?', ctx.projectId);
  return parseJson<string[]>(p?.markets, []);
}

/** Variante prüfen: Rollen, Sparten, Blueprint oder Märkte des Projekts */
async function validVariant(ctx: Ctx, input: OutlineInput, base?: Row) {
  const roles = input.roles !== undefined ? [...new Set(input.roles.map(String))] : parseJson<string[]>(base?.roles, []);
  const divisions = input.divisions !== undefined ? [...new Set(input.divisions.map(String))] : parseJson<string[]>(base?.divisions, []);
  const bad = [...roles.filter((r) => !ROLE_CODES.includes(r) || r === 'all'), ...divisions.filter((d) => !DIVISION_CODES.includes(d) || d === 'all')];
  if (bad.length) throw badRequest(`Unbekannte Rollen/Sparten: ${bad.join(', ')}.`);
  const marketScope = (input.marketScope ?? base?.market_scope ?? 'blueprint') as MarketScope;
  if (marketScope !== 'blueprint' && marketScope !== 'markets') throw badRequest('marketScope muss blueprint oder markets sein.');
  let markets = input.markets !== undefined ? [...new Set(input.markets.map((m) => String(m).toUpperCase()))] : parseJson<string[]>(base?.markets, []);
  if (marketScope === 'blueprint') markets = [];
  else {
    const allowed = await projectMarkets(ctx);
    if (!markets.length) throw badRequest('Bei marketScope=markets mindestens einen Markt angeben.');
    const unknown = markets.filter((m) => !allowed.includes(m));
    if (unknown.length) throw badRequest(`Märkte ${unknown.join(', ')} sind nicht für das Projekt eingerichtet (${allowed.join(', ')}).`);
  }
  return { roles, divisions, marketScope, markets };
}

function outlineDto(o: Row, extra: Record<string, unknown> = {}) {
  return {
    id: o.id, familyId: o.family_id, versionNo: o.version_no, basedOnId: o.based_on_id ?? null, name: o.name, description: o.description ?? null,
    roles: parseJson<string[]>(o.roles, []), divisions: parseJson<string[]>(o.divisions, []), marketScope: o.market_scope as MarketScope, markets: parseJson<string[]>(o.markets, []),
    status: o.status, createdBy: o.created_by, createdAt: o.created_at, updatedBy: o.updated_by, updatedAt: o.updated_at, ...extra,
  };
}

async function outlineRow(ctx: Ctx, id: string) {
  const o = await ctx.db.get('SELECT * FROM outlines WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!o) throw notFound(`Gliederung ${id}`);
  return o;
}

async function nodesOf(ctx: Ctx, outlineId: string) {
  const rows = await ctx.db.all('SELECT * FROM outline_nodes WHERE outline_id = ?', outlineId);
  return numberNodes(rows.map((n) => ({ id: n.id as string, parentId: (n.parent_id as string) ?? null, level: n.level as number, position: n.position as number, title: n.title as string, description: (n.description as string) ?? null })));
}

export async function listOutlines(ctx: Ctx) {
  const rows = await ctx.db.all('SELECT * FROM outlines WHERE project_id = ? ORDER BY name, family_id, version_no DESC', ctx.projectId);
  const stats = new Map((await ctx.db.all(
    `SELECT o.id, (SELECT COUNT(*) FROM outline_nodes n WHERE n.outline_id = o.id) AS nodes, (SELECT COUNT(*) FROM outline_assignments a WHERE a.outline_id = o.id) AS assigned
     FROM outlines o WHERE o.project_id = ?`, ctx.projectId,
  )).map((r) => [r.id, r]));
  const latest = new Map<string, number>();
  for (const r of rows) latest.set(r.family_id, Math.max(latest.get(r.family_id) ?? 0, r.version_no));
  return {
    markets: await projectMarkets(ctx),
    items: rows.map((o) => outlineDto(o, { nodes: Number(stats.get(o.id)?.nodes ?? 0), assigned: Number(stats.get(o.id)?.assigned ?? 0), latest: latest.get(o.family_id) === o.version_no })),
  };
}

export async function getOutline(ctx: Ctx, id: string) {
  const o = await outlineRow(ctx, id);
  const counts = new Map((await ctx.db.all('SELECT node_id, COUNT(*) AS n FROM outline_assignments WHERE outline_id = ? GROUP BY node_id', id)).map((r) => [r.node_id, Number(r.n)]));
  const versions = await ctx.db.all('SELECT id, version_no, status, created_at, created_by FROM outlines WHERE family_id = ? ORDER BY version_no DESC', o.family_id);
  return outlineDto(o, {
    nodes: (await nodesOf(ctx, id)).map((n) => ({ ...n, snippets: counts.get(n.id) ?? 0 })),
    versions: versions.map((v) => ({ id: v.id, versionNo: v.version_no, status: v.status, createdAt: v.created_at, createdBy: v.created_by })),
  });
}

async function insertTree(ctx: Ctx, outlineId: string, tree: OutlineTreeNode[]) {
  if (countNodes(tree) > MAX_NODES) throw badRequest(`Höchstens ${MAX_NODES} Einträge je Gliederung.`);
  const idMap: { title: string; id: string; children: { title: string; id: string }[] }[] = [];
  let pos = 0;
  for (const c of tree) {
    const id = newId('on');
    await ctx.db.run('INSERT INTO outline_nodes (id, outline_id, parent_id, level, position, title, description) VALUES (?, ?, NULL, 1, ?, ?, ?)', id, outlineId, (pos += 10), c.title, c.description ?? null);
    const children: { title: string; id: string }[] = [];
    let sub = 0;
    for (const s of c.children ?? []) {
      const sid = newId('on');
      await ctx.db.run('INSERT INTO outline_nodes (id, outline_id, parent_id, level, position, title, description) VALUES (?, ?, ?, 2, ?, ?, ?)', sid, outlineId, id, (sub += 10), s.title, s.description ?? null);
      children.push({ title: s.title, id: sid });
    }
    idMap.push({ title: c.title, id, children });
  }
  return idMap;
}

/** Aktuelle Kapitelstruktur (aus den Quellen) als Ausgangsgliederung */
async function treeFromChapters(ctx: Ctx): Promise<OutlineTreeNode[]> {
  const chapters = await ctx.db.all("SELECT id, title FROM chapters WHERE project_id = ? AND key <> '__none__' ORDER BY position, title", ctx.projectId);
  const out: OutlineTreeNode[] = [];
  for (const c of chapters) {
    const subs = await ctx.db.all('SELECT title FROM subchapters WHERE chapter_id = ? ORDER BY position, title', c.id);
    out.push({ title: stripNumber(c.title) || c.title, children: subs.map((s) => ({ title: stripNumber(s.title) || s.title })) });
  }
  return out;
}

export async function createOutline(ctx: Ctx, input: OutlineInput & { nodes?: OutlineTreeNode[]; fromChapters?: boolean; content?: string; format?: 'markdown' | 'json' }, user: User) {
  const name = input.name?.trim().slice(0, 120);
  let tree: OutlineTreeNode[] = [];
  let meta: Record<string, unknown> = {};
  if (input.content !== undefined) {
    // Hochgeladene Gliederung (Markdown oder JSON)
    if (input.content.length > 1_000_000) throw badRequest('Datei zu groß (höchstens 1 MB).');
    try {
      if (input.format === 'json') ({ tree, meta } = parseOutlineJson(input.content));
      else tree = parseOutlineMarkdown(input.content);
    } catch (e) {
      throw badRequest((e as Error).message);
    }
    if (!tree.length) throw badRequest('Keine Gliederungseinträge gefunden (erwartet # Kapitel / ## Unterkapitel, 1. / 1.1 oder Aufzählung).');
  } else if (input.fromChapters) tree = await treeFromChapters(ctx);
  else if (input.nodes) tree = parseOutlineJson(JSON.stringify({ nodes: input.nodes })).tree;
  const merged: OutlineInput = {
    roles: (meta.roles as string[]) ?? undefined, divisions: (meta.divisions as string[]) ?? undefined,
    marketScope: (meta.marketScope as MarketScope) ?? undefined, markets: (meta.markets as string[]) ?? undefined, ...stripUndefined(input),
  };
  const finalName = name || (typeof meta.name === 'string' ? meta.name.trim().slice(0, 120) : '');
  if (!finalName) throw badRequest('name ist Pflicht.');
  const variant = await validVariant(ctx, merged);
  const id = newId('ol');
  const ts = now();
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO outlines (id, project_id, family_id, version_no, based_on_id, name, description, roles, divisions, market_scope, markets, status, created_by, created_at, updated_by, updated_at)
       VALUES (?, ?, ?, 1, NULL, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?)`,
      id, ctx.projectId, id, finalName, input.description?.trim().slice(0, 1000) || (typeof meta.description === 'string' ? meta.description.slice(0, 1000) : null),
      json(variant.roles), json(variant.divisions), variant.marketScope, json(variant.markets), user.id, ts, user.id, ts,
    );
    await insertTree(ctx, id, tree);
    await audit(ctx, user.id, 'outline.created', 'outline', id, { name: finalName, nodes: countNodes(tree), source: input.content !== undefined ? `upload:${input.format ?? 'markdown'}` : input.fromChapters ? 'chapters' : 'manual' });
  });
  return getOutline(ctx, id);
}

function stripUndefined<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}

export async function updateOutline(ctx: Ctx, id: string, input: OutlineInput, user: User) {
  const o = await outlineRow(ctx, id);
  const variant = await validVariant(ctx, input, o);
  const name = input.name !== undefined ? input.name.trim().slice(0, 120) : o.name;
  if (!name) throw badRequest('name darf nicht leer sein.');
  const status = input.status ?? o.status;
  if (!(OUTLINE_STATUS as readonly string[]).includes(status)) throw badRequest(`status muss einer von ${OUTLINE_STATUS.join(', ')} sein.`);
  await ctx.db.tx(async () => {
    // höchstens eine aktive Version je Gliederung
    if (status === 'active' && o.status !== 'active') await ctx.db.run("UPDATE outlines SET status = 'draft' WHERE family_id = ? AND status = 'active' AND id <> ?", o.family_id, id);
    await ctx.db.run(
      'UPDATE outlines SET name = ?, description = ?, roles = ?, divisions = ?, market_scope = ?, markets = ?, status = ?, updated_by = ?, updated_at = ? WHERE id = ?',
      name, input.description !== undefined ? input.description?.trim().slice(0, 1000) || null : o.description, json(variant.roles), json(variant.divisions),
      variant.marketScope, json(variant.markets), status, user.id, now(), id,
    );
    await audit(ctx, user.id, 'outline.updated', 'outline', id, { name, status, ...variant });
  });
  return getOutline(ctx, id);
}

export async function deleteOutline(ctx: Ctx, id: string, user: User) {
  const o = await outlineRow(ctx, id);
  if (await ctx.db.get('SELECT id FROM outlines WHERE based_on_id = ?', id)) throw conflict('Auf dieser Version bauen weitere Versionen auf – bitte zuerst diese löschen oder die Gliederung archivieren.');
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM plan_items WHERE outline_id = ?', id);
    await ctx.db.run('DELETE FROM outline_assignments WHERE outline_id = ?', id);
    await ctx.db.run('DELETE FROM outline_nodes WHERE outline_id = ? AND parent_id IS NOT NULL', id);
    await ctx.db.run('DELETE FROM outline_nodes WHERE outline_id = ?', id);
    await ctx.db.run('DELETE FROM outlines WHERE id = ?', id);
    await audit(ctx, user.id, 'outline.deleted', 'outline', id, { name: o.name, versionNo: o.version_no });
  });
}

/** Neue Version: Kopie der Gliederung samt Zuordnungen und Planung; die Vorlage bleibt unverändert erhalten */
export async function newOutlineVersion(ctx: Ctx, id: string, input: { name?: string }, user: User) {
  const o = await outlineRow(ctx, id);
  const nid = newId('ol');
  const ts = now();
  await ctx.db.tx(async () => {
    const versionNo = ((await ctx.db.get<{ m: number }>('SELECT MAX(version_no) AS m FROM outlines WHERE family_id = ?', o.family_id))?.m ?? 0) + 1;
    await ctx.db.run(
      `INSERT INTO outlines (id, project_id, family_id, version_no, based_on_id, name, description, roles, divisions, market_scope, markets, status, created_by, created_at, updated_by, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?)`,
      nid, ctx.projectId, o.family_id, versionNo, id, input.name?.trim().slice(0, 120) || o.name, o.description, o.roles, o.divisions, o.market_scope, o.markets, user.id, ts, user.id, ts,
    );
    const map = new Map<string, string>();
    for (const n of await ctx.db.all('SELECT * FROM outline_nodes WHERE outline_id = ? ORDER BY level, position', id)) {
      const nn = newId('on');
      map.set(n.id, nn);
      await ctx.db.run('INSERT INTO outline_nodes (id, outline_id, parent_id, level, position, title, description) VALUES (?, ?, ?, ?, ?, ?, ?)', nn, nid, n.parent_id ? map.get(n.parent_id) : null, n.level, n.position, n.title, n.description);
    }
    for (const a of await ctx.db.all('SELECT * FROM outline_assignments WHERE outline_id = ?', id)) {
      await ctx.db.run('INSERT INTO outline_assignments (outline_id, snippet_id, node_id, position, assigned_by, assigned_at) VALUES (?, ?, ?, ?, ?, ?)', nid, a.snippet_id, map.get(a.node_id), a.position, a.assigned_by, a.assigned_at);
    }
    for (const p of await ctx.db.all('SELECT * FROM plan_items WHERE outline_id = ?', id)) {
      await ctx.db.run('INSERT INTO plan_items (node_id, outline_id, assignee, due_date, status, note, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', map.get(p.node_id), nid, p.assignee, p.due_date, p.status, p.note, p.updated_by, p.updated_at);
    }
    await audit(ctx, user.id, 'outline.version_created', 'outline', nid, { basedOn: id, versionNo });
  });
  return getOutline(ctx, nid);
}

export async function exportOutline(ctx: Ctx, id: string, format: string) {
  const o = await outlineRow(ctx, id);
  const nodes = await nodesOf(ctx, id);
  const base = `gliederung-${o.name.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'export'}-v${o.version_no}`;
  if (format === 'json') {
    const d = outlineDto(o);
    const tree = nodes.filter((n) => n.level === 1).map((c) => ({ title: c.title, description: c.description ?? undefined, children: nodes.filter((s) => s.parentId === c.id).map((s) => ({ title: s.title, description: s.description ?? undefined })) }));
    const data = { format: 'onescm-outline', version: 1, name: d.name, description: d.description, roles: d.roles, divisions: d.divisions, marketScope: d.marketScope, markets: d.markets, nodes: tree };
    return { data: Buffer.from(`${JSON.stringify(data, null, 2)}\n`), fileName: `${base}.json`, type: 'application/json' };
  }
  if (format !== 'md') throw badRequest('format muss md oder json sein.');
  return { data: Buffer.from(outlineToMarkdown(o.name, nodes)), fileName: `${base}.md`, type: 'text/markdown; charset=utf-8' };
}

// ---------- Knoten ----------

async function nodeRow(ctx: Ctx, nodeId: string) {
  const n = await ctx.db.get('SELECT n.*, o.project_id FROM outline_nodes n JOIN outlines o ON o.id = n.outline_id WHERE n.id = ?', nodeId);
  if (!n || n.project_id !== ctx.projectId) throw notFound(`Gliederungseintrag ${nodeId}`);
  return n;
}

export async function addNode(ctx: Ctx, outlineId: string, input: { title?: string; parentId?: string | null; afterId?: string | null; description?: string }, user: User) {
  await outlineRow(ctx, outlineId);
  const title = stripNumber(String(input.title ?? ''));
  if (!title) throw badRequest('title ist Pflicht.');
  let parentId: string | null = null;
  if (input.parentId) {
    const p = await nodeRow(ctx, input.parentId);
    if (p.outline_id !== outlineId) throw badRequest('parentId gehört nicht zu dieser Gliederung.');
    if (p.level !== 1) throw badRequest('Unterkapitel können keine weiteren Ebenen enthalten.');
    parentId = p.id;
  }
  if ((await ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM outline_nodes WHERE outline_id = ?', outlineId))!.n >= MAX_NODES) throw badRequest(`Höchstens ${MAX_NODES} Einträge je Gliederung.`);
  const siblings = await ctx.db.all(`SELECT id, position FROM outline_nodes WHERE outline_id = ? AND ${parentId ? 'parent_id = ?' : 'parent_id IS NULL'} ORDER BY position`, outlineId, ...(parentId ? [parentId] : []));
  let position = (siblings.at(-1)?.position ?? 0) + 10;
  const id = newId('on');
  await ctx.db.tx(async () => {
    if (input.afterId) {
      const idx = siblings.findIndex((s) => s.id === input.afterId);
      if (idx < 0) throw badRequest('afterId ist kein Geschwistereintrag.');
      // Einfügen nach afterId: nachfolgende Einträge verschieben
      position = siblings[idx].position + 1;
      for (const s of siblings.slice(idx + 1)) await ctx.db.run('UPDATE outline_nodes SET position = position + 10 WHERE id = ?', s.id);
    }
    await ctx.db.run('INSERT INTO outline_nodes (id, outline_id, parent_id, level, position, title, description) VALUES (?, ?, ?, ?, ?, ?, ?)', id, outlineId, parentId, parentId ? 2 : 1, position, title, input.description?.trim().slice(0, 1000) || null);
    await touch(ctx, outlineId, user);
  });
  return getOutline(ctx, outlineId);
}

async function touch(ctx: Ctx, outlineId: string, user: User) {
  await ctx.db.run('UPDATE outlines SET updated_by = ?, updated_at = ? WHERE id = ?', user.id, now(), outlineId);
}

/** Titel/Beschreibung ändern oder verschieben (move: up | down; parentId: unter ein anderes Kapitel bzw. null = Kapitel) */
export async function updateNode(ctx: Ctx, nodeId: string, input: { title?: string; description?: string | null; move?: 'up' | 'down'; parentId?: string | null }, user: User) {
  const n = await nodeRow(ctx, nodeId);
  await ctx.db.tx(async () => {
    if (input.title !== undefined) {
      const title = stripNumber(input.title);
      if (!title) throw badRequest('title darf nicht leer sein.');
      await ctx.db.run('UPDATE outline_nodes SET title = ? WHERE id = ?', title, nodeId);
    }
    if (input.description !== undefined) await ctx.db.run('UPDATE outline_nodes SET description = ? WHERE id = ?', input.description?.trim().slice(0, 1000) || null, nodeId);
    if (input.parentId !== undefined && (input.parentId ?? null) !== (n.parent_id ?? null)) {
      if (input.parentId) {
        const p = await nodeRow(ctx, input.parentId);
        if (p.outline_id !== n.outline_id || p.level !== 1 || p.id === nodeId) throw badRequest('Ziel muss ein Kapitel derselben Gliederung sein.');
        if (await ctx.db.get('SELECT id FROM outline_nodes WHERE parent_id = ?', nodeId)) throw badRequest('Ein Kapitel mit Unterkapiteln kann nicht selbst Unterkapitel werden.');
      }
      const max = (await ctx.db.get<{ m: number | null }>(`SELECT MAX(position) AS m FROM outline_nodes WHERE outline_id = ? AND ${input.parentId ? 'parent_id = ?' : 'parent_id IS NULL'}`, n.outline_id, ...(input.parentId ? [input.parentId] : [])))?.m ?? 0;
      await ctx.db.run('UPDATE outline_nodes SET parent_id = ?, level = ?, position = ? WHERE id = ?', input.parentId ?? null, input.parentId ? 2 : 1, max + 10, nodeId);
    } else if (input.move) {
      const siblings = await ctx.db.all(`SELECT id, position FROM outline_nodes WHERE outline_id = ? AND ${n.parent_id ? 'parent_id = ?' : 'parent_id IS NULL'} ORDER BY position`, n.outline_id, ...(n.parent_id ? [n.parent_id] : []));
      const i = siblings.findIndex((s) => s.id === nodeId);
      const j = input.move === 'up' ? i - 1 : i + 1;
      if (j >= 0 && j < siblings.length) {
        await ctx.db.run('UPDATE outline_nodes SET position = ? WHERE id = ?', siblings[j].position, nodeId);
        await ctx.db.run('UPDATE outline_nodes SET position = ? WHERE id = ?', siblings[i].position, siblings[j].id);
      }
    }
    await touch(ctx, n.outline_id, user);
  });
  return getOutline(ctx, n.outline_id);
}

/** Eintrag löschen (mit Unterkapiteln); zugeordnete Schnipsel werden wieder frei */
export async function deleteNode(ctx: Ctx, nodeId: string, user: User) {
  const n = await nodeRow(ctx, nodeId);
  const ids = [nodeId, ...(await ctx.db.all('SELECT id FROM outline_nodes WHERE parent_id = ?', nodeId)).map((r) => r.id as string)];
  await ctx.db.tx(async () => {
    for (const id of ids) {
      await ctx.db.run('DELETE FROM outline_assignments WHERE node_id = ?', id);
      await ctx.db.run('DELETE FROM plan_items WHERE node_id = ?', id);
    }
    for (const id of ids.slice(1)) await ctx.db.run('DELETE FROM outline_nodes WHERE id = ?', id);
    await ctx.db.run('DELETE FROM outline_nodes WHERE id = ?', nodeId);
    await touch(ctx, n.outline_id, user);
  });
  return getOutline(ctx, n.outline_id);
}

// ---------- Zuordnung und Draft Manual ----------

export type FlagType = 'duplicate' | 'contradiction' | 'gap' | 'warning';
export interface Flag {
  type: FlagType;
  label: string;
  findingSeq?: number;
}

const FLAG_LABEL: Record<string, FlagType> = { duplicate: 'duplicate', contradiction: 'contradiction', gap: 'gap' };

interface SnippetInfo {
  id: string;
  seq: number;
  text: string;
  kind: string;
  chapter: string;
  subchapter: string | null;
  path: string;
  isCurrent: boolean;
  evidenceStatus: string;
  roles: string[];
  divisions: string[];
  market: string | null;
  normHash: string;
}

async function snippetInfos(ctx: Ctx, ids: string[]): Promise<Map<string, SnippetInfo>> {
  const out = new Map<string, SnippetInfo>();
  for (let i = 0; i < ids.length; i += 400) {
    const part = ids.slice(i, i + 400);
    if (!part.length) break;
    const marks = part.map(() => '?').join(',');
    const rows = await ctx.db.all(
      `SELECT s.id, s.seq, s.text, s.kind, s.norm_hash, s.evidence_status, s.market_code, r.is_current, d.path, c.title AS chapter_title, sc.title AS sub_title
       FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
       JOIN chapters c ON c.id = s.chapter_id LEFT JOIN subchapters sc ON sc.id = s.subchapter_id WHERE s.id IN (${marks})`, ...part,
    );
    const roles = await ctx.db.all(`SELECT snippet_id, role_code FROM snippet_roles WHERE snippet_id IN (${marks})`, ...part);
    const divs = await ctx.db.all(`SELECT snippet_id, division_code FROM snippet_divisions WHERE snippet_id IN (${marks})`, ...part);
    for (const r of rows) {
      out.set(r.id, {
        id: r.id, seq: r.seq, text: r.text, kind: r.kind, chapter: r.chapter_title, subchapter: r.sub_title ?? null, path: r.path, isCurrent: !!r.is_current,
        evidenceStatus: r.evidence_status, market: r.market_code ?? null, normHash: r.norm_hash,
        roles: roles.filter((x) => x.snippet_id === r.id).map((x) => x.role_code), divisions: divs.filter((x) => x.snippet_id === r.id).map((x) => x.division_code),
      });
    }
  }
  return out;
}

/** Offene Befunde je Schnipsel (Dopplung, Widerspruch, übrige als Warnung) */
async function findingFlags(ctx: Ctx, ids: string[]): Promise<Map<string, Flag[]>> {
  const out = new Map<string, Flag[]>();
  for (let i = 0; i < ids.length; i += 400) {
    const part = ids.slice(i, i + 400);
    if (!part.length) break;
    const marks = part.map(() => '?').join(',');
    const rows = await ctx.db.all(
      `SELECT seq, type, severity, reason, snippet_a_id, snippet_b_id FROM quality_findings
       WHERE project_id = ? AND status IN ('open', 'deferred') AND (snippet_a_id IN (${marks}) OR snippet_b_id IN (${marks}))`,
      ctx.projectId, ...part, ...part,
    );
    for (const f of rows) {
      const flag: Flag = { type: FLAG_LABEL[f.type] ?? 'warning', label: `#${f.seq} ${f.reason}`.slice(0, 240), findingSeq: f.seq };
      for (const sid of [f.snippet_a_id, f.snippet_b_id]) if (sid && part.includes(sid)) out.set(sid, [...(out.get(sid) ?? []), flag]);
    }
  }
  return out;
}

function evidenceFlags(s: SnippetInfo, outline: Row): Flag[] {
  const flags: Flag[] = [];
  if (!s.isCurrent) flags.push({ type: 'warning', label: 'Veraltet: Die Quelle hat eine neuere Revision.' });
  if (s.evidenceStatus === 'unconfirmed' || s.evidenceStatus === 'open_question') flags.push({ type: 'warning', label: s.evidenceStatus === 'open_question' ? 'Offene Frage zur Quelle' : 'Quelle nicht bestätigt' });
  for (const p of variantProblems(s, { roles: parseJson(outline.roles, []), divisions: parseJson(outline.divisions, []), marketScope: outline.market_scope, markets: parseJson(outline.markets, []) })) flags.push({ type: 'warning', label: `Variante: ${p}` });
  return flags;
}

const snippetDto = (s: SnippetInfo, flags: Flag[]) => ({
  id: s.id, seq: s.seq, text: s.text, kind: s.kind, chapter: s.chapter, subchapter: s.subchapter, path: s.path, isCurrent: s.isCurrent,
  evidenceStatus: s.evidenceStatus, roles: s.roles, divisions: s.divisions, market: s.market, flags,
});

/** Draft Manual: Gliederung mit zugeordneten Schnipseln und Kennzeichnung von Dopplungen, Lücken, Widersprüchen und Warnungen */
export async function draftManual(ctx: Ctx, outlineId: string) {
  const o = await outlineRow(ctx, outlineId);
  const nodes = await nodesOf(ctx, outlineId);
  const assignments = await ctx.db.all('SELECT snippet_id, node_id, position FROM outline_assignments WHERE outline_id = ? ORDER BY position', outlineId);
  const ids = assignments.map((a) => a.snippet_id as string);
  const infos = await snippetInfos(ctx, ids);
  const findings = await findingFlags(ctx, ids);
  // Dopplung innerhalb der Gliederung: gleicher normalisierter Text mehrfach zugeordnet
  const byHash = new Map<string, string[]>();
  for (const id of ids) {
    const s = infos.get(id);
    if (s) byHash.set(s.normHash, [...(byHash.get(s.normHash) ?? []), id]);
  }
  const numberOf = new Map(nodes.map((n) => [n.id, n.number]));
  const nodeOf = new Map(assignments.map((a) => [a.snippet_id as string, a.node_id as string]));
  const counts = { duplicate: 0, contradiction: 0, gap: 0, warning: 0, snippets: 0 };
  const out = nodes.map((n) => {
    const own = assignments.filter((a) => a.node_id === n.id).map((a) => infos.get(a.snippet_id)).filter((s): s is SnippetInfo => !!s);
    const snippets = own.map((s) => {
      const flags = [...(findings.get(s.id) ?? []), ...evidenceFlags(s, o)];
      const twins = (byHash.get(s.normHash) ?? []).filter((x) => x !== s.id);
      if (twins.length) flags.unshift({ type: 'duplicate', label: `Gleicher Text auch in ${twins.map((t) => numberOf.get(nodeOf.get(t)!) ?? '?').join(', ')}` });
      for (const f of new Set(flags.map((x) => x.type))) counts[f]++;
      counts.snippets++;
      return snippetDto(s, flags);
    });
    const children = nodes.filter((c) => c.parentId === n.id);
    const hasContent = snippets.length > 0 || children.some((c) => assignments.some((a) => a.node_id === c.id));
    const flags: Flag[] = hasContent ? [] : [{ type: 'gap', label: children.length ? 'weder Kapitel noch Unterkapitel haben Inhalte' : 'keine Textschnipsel zugeordnet' }];
    if (flags.length) counts.gap++;
    return { ...n, flags, snippets };
  });
  const unassigned = (await ctx.db.get<{ n: number }>(
    `SELECT COUNT(*) AS n FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     WHERE d.project_id = ? AND r.is_current = 1 AND s.id NOT IN (SELECT snippet_id FROM outline_assignments WHERE outline_id = ?)`, ctx.projectId, outlineId,
  ))?.n ?? 0;
  return { outline: outlineDto(o), nodes: out, summary: { ...counts, nodes: nodes.length, unassigned: Number(unassigned) } };
}

/** Schnipsel zum Zuordnen: aktuelle Schnipsel des Projekts, optional Text- und Kapitelfilter, nur nicht zugeordnete */
export async function outlineCandidates(ctx: Ctx, outlineId: string, q: { q?: string; chapterId?: string; assigned?: string; page?: number; pageSize?: number }) {
  const o = await outlineRow(ctx, outlineId);
  const where = ['d.project_id = ?', 'r.is_current = 1'];
  const params: unknown[] = [ctx.projectId];
  if (q.assigned !== 'all') {
    where.push('s.id NOT IN (SELECT snippet_id FROM outline_assignments WHERE outline_id = ?)');
    params.push(outlineId);
  }
  if (q.chapterId) where.push('s.chapter_id = ?'), params.push(q.chapterId);
  if (q.q?.trim()) where.push('LOWER(s.text) LIKE ?'), params.push(`%${q.q.trim().toLowerCase().replace(/[%_]/g, '')}%`);
  const pageSize = Math.min(Math.max(Math.trunc(q.pageSize ?? 50) || 50, 1), 200);
  const page = Math.max(Math.trunc(q.page ?? 1) || 1, 1);
  const base = `FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id JOIN chapters c ON c.id = s.chapter_id WHERE ${where.join(' AND ')}`;
  const total = (await ctx.db.get<{ n: number }>(`SELECT COUNT(*) AS n ${base}`, ...params))?.n ?? 0;
  const ids = (await ctx.db.all(`SELECT s.id ${base} ORDER BY c.position, s.position, s.seq LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`, ...params)).map((r) => r.id as string);
  const infos = await snippetInfos(ctx, ids);
  const findings = await findingFlags(ctx, ids);
  return { total: Number(total), page, pageSize, items: ids.map((id) => infos.get(id)!).filter(Boolean).map((s) => snippetDto(s, [...(findings.get(s.id) ?? []), ...evidenceFlags(s, o)])) };
}

/** Schnipsel einem Knoten zuordnen (verschiebt bereits zugeordnete) */
export async function assignSnippets(ctx: Ctx, outlineId: string, input: { nodeId?: string; snippetIds?: string[] }, user: User) {
  await outlineRow(ctx, outlineId);
  const ids = [...new Set((input.snippetIds ?? []).map(String))];
  if (!input.nodeId || !ids.length) throw badRequest('nodeId und snippetIds sind Pflicht.');
  if (ids.length > 500) throw badRequest('Höchstens 500 Schnipsel je Aufruf.');
  const node = await nodeRow(ctx, input.nodeId);
  if (node.outline_id !== outlineId) throw badRequest('nodeId gehört nicht zu dieser Gliederung.');
  await assertIdsInProject(ctx, 'snippetId', ids);
  await ctx.db.tx(async () => {
    let pos = (await ctx.db.get<{ m: number | null }>('SELECT MAX(position) AS m FROM outline_assignments WHERE node_id = ?', node.id))?.m ?? 0;
    for (const sid of ids) {
      await ctx.db.run('DELETE FROM outline_assignments WHERE outline_id = ? AND snippet_id = ?', outlineId, sid);
      await ctx.db.run('INSERT INTO outline_assignments (outline_id, snippet_id, node_id, position, assigned_by, assigned_at) VALUES (?, ?, ?, ?, ?, ?)', outlineId, sid, node.id, (pos += 10), user.id, now());
    }
    await touch(ctx, outlineId, user);
    await audit(ctx, user.id, 'outline.snippets_assigned', 'outline', outlineId, { nodeId: node.id, snippets: ids.length });
  });
  return { assigned: ids.length, nodeId: node.id };
}

export async function unassignSnippet(ctx: Ctx, outlineId: string, snippetId: string, user: User) {
  await outlineRow(ctx, outlineId);
  const res = await ctx.db.run('DELETE FROM outline_assignments WHERE outline_id = ? AND snippet_id = ?', outlineId, snippetId);
  if (!res.changes) throw notFound(`Zuordnung von Schnipsel ${snippetId}`);
  await touch(ctx, outlineId, user);
}

/** Schnipsel innerhalb eines Knotens verschieben */
export async function moveAssignment(ctx: Ctx, outlineId: string, snippetId: string, move: 'up' | 'down', user: User) {
  const a = await ctx.db.get('SELECT * FROM outline_assignments WHERE outline_id = ? AND snippet_id = ?', outlineId, snippetId);
  if (!a) throw notFound(`Zuordnung von Schnipsel ${snippetId}`);
  const list = await ctx.db.all('SELECT snippet_id, position FROM outline_assignments WHERE node_id = ? ORDER BY position', a.node_id);
  const i = list.findIndex((x) => x.snippet_id === snippetId);
  const j = move === 'up' ? i - 1 : i + 1;
  if (j < 0 || j >= list.length) return;
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE outline_assignments SET position = ? WHERE outline_id = ? AND snippet_id = ?', list[j].position, outlineId, snippetId);
    await ctx.db.run('UPDATE outline_assignments SET position = ? WHERE outline_id = ? AND snippet_id = ?', list[i].position, outlineId, list[j].snippet_id);
    await touch(ctx, outlineId, user);
  });
}

/**
 * Automatische Zuordnung: nicht zugeordnete aktuelle Schnipsel, deren Kapitel/Unterkapitel (aus der Quelle) dem Titel
 * eines Gliederungseintrags entspricht (Nummerierung und Schreibweise ignoriert). Unterkapitel vor Kapitel.
 */
export async function autoAssign(ctx: Ctx, outlineId: string, user: User) {
  await outlineRow(ctx, outlineId);
  const nodes = await nodesOf(ctx, outlineId);
  const chapterNodes = new Map(nodes.filter((n) => n.level === 1).map((n) => [matchKey(n.title), n]));
  const subNodes = new Map(nodes.filter((n) => n.level === 2).map((n) => [`${n.parentId}|${matchKey(n.title)}`, n]));
  const subAnywhere = new Map<string, typeof nodes[number] | null>();
  for (const n of nodes.filter((x) => x.level === 2)) {
    const k = matchKey(n.title);
    subAnywhere.set(k, subAnywhere.has(k) ? null : n); // mehrdeutig → keine Zuordnung
  }
  const rows = await ctx.db.all(
    `SELECT s.id, c.title AS chapter_title, sc.title AS sub_title FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id
     JOIN source_documents d ON d.id = r.document_id JOIN chapters c ON c.id = s.chapter_id LEFT JOIN subchapters sc ON sc.id = s.subchapter_id
     WHERE d.project_id = ? AND r.is_current = 1 AND s.id NOT IN (SELECT snippet_id FROM outline_assignments WHERE outline_id = ?)
     ORDER BY c.position, s.position, s.seq`, ctx.projectId, outlineId,
  );
  const plan: { snippetId: string; nodeId: string }[] = [];
  for (const r of rows) {
    const ch = chapterNodes.get(matchKey(r.chapter_title));
    let target = ch && r.sub_title ? subNodes.get(`${ch.id}|${matchKey(r.sub_title)}`) : undefined;
    if (!target && r.sub_title) target = subAnywhere.get(matchKey(r.sub_title)) ?? undefined;
    target ??= ch;
    if (target) plan.push({ snippetId: r.id, nodeId: target.id });
  }
  await ctx.db.tx(async () => {
    const pos = new Map<string, number>();
    for (const p of plan) {
      const cur = pos.get(p.nodeId) ?? (await ctx.db.get<{ m: number | null }>('SELECT MAX(position) AS m FROM outline_assignments WHERE node_id = ?', p.nodeId))?.m ?? 0;
      pos.set(p.nodeId, cur + 10);
      await ctx.db.run('INSERT INTO outline_assignments (outline_id, snippet_id, node_id, position, assigned_by, assigned_at) VALUES (?, ?, ?, ?, ?, ?)', outlineId, p.snippetId, p.nodeId, cur + 10, user.id, now());
    }
    await touch(ctx, outlineId, user);
    await audit(ctx, user.id, 'outline.auto_assigned', 'outline', outlineId, { assigned: plan.length });
  });
  return { assigned: plan.length, remaining: rows.length - plan.length };
}

const FLAG_MD: Record<FlagType, string> = { duplicate: '🟠 Dopplung', contradiction: '🔴 Widerspruch', gap: '🟣 Lücke', warning: '🟡 Warnung' };

/** Draft Manual als Markdown (Arbeitsstand mit Kennzeichnungen als Zitatzeilen) */
export async function exportDraft(ctx: Ctx, outlineId: string, withFlags = true) {
  const d = await draftManual(ctx, outlineId);
  const lines = [`# ${d.outline.name} – Draft Manual (Version ${d.outline.versionNo})`, '', `> Arbeitsstand vom ${now().slice(0, 10)} – nicht freigegeben.`, ''];
  for (const n of d.nodes) {
    lines.push(`${n.level === 1 ? '##' : '###'} ${n.number} ${n.title}`, '');
    if (withFlags) for (const f of n.flags) lines.push(`> ${FLAG_MD[f.type]}: ${f.label}`, '');
    for (const s of n.snippets) {
      if (withFlags) for (const f of s.flags) lines.push(`> ${FLAG_MD[f.type]}: ${f.label}`);
      if (withFlags && s.flags.length) lines.push('');
      lines.push(s.text, '');
    }
  }
  const slug = d.outline.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'draft';
  return { data: Buffer.from(lines.join('\n')), fileName: `draft-manual-${slug}-v${d.outline.versionNo}.md`, type: 'text/markdown; charset=utf-8' };
}

// ---------- Redaktionsplanung ----------

export async function outlinePlan(ctx: Ctx, outlineId: string) {
  const o = await outlineRow(ctx, outlineId);
  const nodes = await nodesOf(ctx, outlineId);
  const plans = new Map((await ctx.db.all('SELECT * FROM plan_items WHERE outline_id = ?', outlineId)).map((p) => [p.node_id, p]));
  const counts = new Map((await ctx.db.all('SELECT node_id, COUNT(*) AS n FROM outline_assignments WHERE outline_id = ? GROUP BY node_id', outlineId)).map((r) => [r.node_id, Number(r.n)]));
  const today = now().slice(0, 10);
  const items = nodes.map((n) => {
    const p = plans.get(n.id);
    const status = (p?.status ?? 'open') as string;
    return {
      nodeId: n.id, number: n.number, title: n.title, level: n.level, snippets: counts.get(n.id) ?? 0,
      assignee: p?.assignee ?? null, dueDate: p?.due_date ?? null, status, note: p?.note ?? null, updatedAt: p?.updated_at ?? null, updatedBy: p?.updated_by ?? null,
      overdue: !!p?.due_date && p.due_date < today && status !== 'done',
    };
  });
  const byStatus = Object.fromEntries(PLAN_STATUS.map((s) => [s, items.filter((i) => i.status === s).length]));
  return { outline: outlineDto(o), items, summary: { total: items.length, ...byStatus, overdue: items.filter((i) => i.overdue).length, progress: items.length ? Math.round((100 * (byStatus.done ?? 0)) / items.length) : 0 } };
}

export async function setPlanItem(ctx: Ctx, nodeId: string, input: { assignee?: string | null; dueDate?: string | null; status?: string; note?: string | null }, user: User) {
  const n = await nodeRow(ctx, nodeId);
  const cur = await ctx.db.get('SELECT * FROM plan_items WHERE node_id = ?', nodeId);
  const status = input.status ?? cur?.status ?? 'open';
  if (!(PLAN_STATUS as readonly string[]).includes(status)) throw badRequest(`status muss einer von ${PLAN_STATUS.join(', ')} sein.`);
  const dueDate = input.dueDate !== undefined ? input.dueDate || null : cur?.due_date ?? null;
  if (dueDate && (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate) || Number.isNaN(Date.parse(dueDate)))) throw badRequest('dueDate im Format JJJJ-MM-TT.');
  const assignee = input.assignee !== undefined ? input.assignee?.trim().slice(0, 120) || null : cur?.assignee ?? null;
  const note = input.note !== undefined ? input.note?.trim().slice(0, 1000) || null : cur?.note ?? null;
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO plan_items (node_id, outline_id, assignee, due_date, status, note, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (node_id) DO UPDATE SET assignee = excluded.assignee, due_date = excluded.due_date, status = excluded.status, note = excluded.note, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
      nodeId, n.outline_id, assignee, dueDate, status, note, user.id, now(),
    );
    await audit(ctx, user.id, 'plan_item.updated', 'outline_node', nodeId, { assignee, dueDate, status });
  });
  return (await outlinePlan(ctx, n.outline_id)).items.find((i) => i.nodeId === nodeId);
}
