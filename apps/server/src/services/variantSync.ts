// Varianten synchronisieren (ADR-037): Unterschiede der Zuordnungen zwischen einer Quellgliederung (z. B. Blueprint)
// und einer Zielgliederung (z. B. Markt-Variante) anzeigen und ausgewählte Schnipsel bzw. fehlende Einträge übernehmen.
import { audit, type Ctx, type User } from '../context.js';
import { newId, now, parseJson, type Row } from '../db.js';
import { MAX_NODES, matchNodes, numberNodes, variantProblems } from '../domain/outline.js';
import { badRequest, notFound } from '../problem.js';

async function outlineOf(ctx: Ctx, id: string) {
  const o = await ctx.db.get('SELECT * FROM outlines WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!o) throw notFound(`Gliederung ${id}`);
  return o;
}

async function load(ctx: Ctx, outlineId: string) {
  const rows = await ctx.db.all('SELECT * FROM outline_nodes WHERE outline_id = ?', outlineId);
  const nodes = numberNodes(rows.map((n) => ({
    id: n.id as string, parentId: (n.parent_id as string) ?? null, level: n.level as number, position: n.position as number, title: n.title as string, nodeKey: (n.node_key ?? n.id) as string,
  })));
  const assigned = new Map<string, string[]>();
  const nodeOf = new Map<string, string>();
  for (const a of await ctx.db.all('SELECT node_id, snippet_id FROM outline_assignments WHERE outline_id = ? ORDER BY position', outlineId)) {
    assigned.set(a.node_id, [...(assigned.get(a.node_id) ?? []), a.snippet_id]);
    nodeOf.set(a.snippet_id, a.node_id);
  }
  return { nodes, assigned, nodeOf };
}

async function snippetFacts(ctx: Ctx, ids: string[]) {
  const out = new Map<string, { id: string; seq: number; text: string; path: string; isCurrent: boolean; roles: string[]; divisions: string[]; market: string | null }>();
  for (let i = 0; i < ids.length; i += 400) {
    const part = ids.slice(i, i + 400);
    const marks = part.map(() => '?').join(',');
    const rows = await ctx.db.all(
      `SELECT s.id, s.seq, s.text, s.market_code, r.is_current, d.path FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id
       JOIN source_documents d ON d.id = r.document_id WHERE s.id IN (${marks})`, ...part,
    );
    const roles = await ctx.db.all(`SELECT snippet_id, role_code FROM snippet_roles WHERE snippet_id IN (${marks})`, ...part);
    const divs = await ctx.db.all(`SELECT snippet_id, division_code FROM snippet_divisions WHERE snippet_id IN (${marks})`, ...part);
    for (const r of rows) {
      out.set(r.id, {
        id: r.id, seq: r.seq, text: r.text, path: r.path, isCurrent: !!r.is_current, market: r.market_code ?? null,
        roles: roles.filter((x) => x.snippet_id === r.id).map((x) => x.role_code), divisions: divs.filter((x) => x.snippet_id === r.id).map((x) => x.division_code),
      });
    }
  }
  return out;
}

const variantOf = (o: Row) => ({ roles: parseJson<string[]>(o.roles, []), divisions: parseJson<string[]>(o.divisions, []), marketScope: o.market_scope, markets: parseJson<string[]>(o.markets, []) });

/**
 * Vorschau: je Eintrag der Quelle der zugeordnete Eintrag im Ziel, Schnipsel nur in der Quelle (übernehmbar; mit Prüfung gegen die
 * Variante des Ziels), Schnipsel nur im Ziel (z. B. marktspezifisch) sowie Einträge, die im Ziel fehlen.
 */
export async function syncPreview(ctx: Ctx, targetId: string, sourceId: string) {
  if (!sourceId) throw badRequest('from (Quellgliederung) ist Pflicht.');
  if (sourceId === targetId) throw badRequest('Quelle und Ziel müssen verschiedene Gliederungen sein.');
  const [target, source] = [await outlineOf(ctx, targetId), await outlineOf(ctx, sourceId)];
  const [t, s] = [await load(ctx, targetId), await load(ctx, sourceId)];
  const match = matchNodes(s.nodes, t.nodes, source.family_id === target.family_id);
  const ids = [...new Set([...[...s.assigned.values()].flat(), ...[...t.assigned.values()].flat()])];
  const facts = await snippetFacts(ctx, ids);
  const tNode = new Map(t.nodes.map((n) => [n.id, n]));
  const variant = variantOf(target);
  const snippet = (id: string) => {
    const f = facts.get(id);
    const problems = f ? variantProblems(f, variant) : [];
    return {
      id, seq: f?.seq ?? null, text: f ? (f.text.length > 300 ? `${f.text.slice(0, 300)} …` : f.text) : '', path: f?.path ?? null,
      isCurrent: f?.isCurrent ?? false, problems, fits: !!f && f.isCurrent && !problems.length,
      // bereits an anderer Stelle im Ziel zugeordnet
      elsewhere: t.nodeOf.has(id) ? tNode.get(t.nodeOf.get(id)!)?.number ?? null : null,
    };
  };
  const entries = s.nodes.map((n) => {
    const targetNodeId = match.get(n.id) ?? null;
    const src = s.assigned.get(n.id) ?? [];
    const tgt = targetNodeId ? t.assigned.get(targetNodeId) ?? [] : [];
    return {
      sourceNodeId: n.id, nodeKey: n.nodeKey, number: n.number, title: n.title, level: n.level,
      target: targetNodeId ? { nodeId: targetNodeId, number: tNode.get(targetNodeId)!.number, title: tNode.get(targetNodeId)!.title } : null,
      onlySource: src.filter((id) => !tgt.includes(id)).map(snippet),
      onlyTarget: tgt.filter((id) => !src.includes(id)).map(snippet),
      common: src.filter((id) => tgt.includes(id)).length,
    };
  });
  const offered = entries.flatMap((e) => e.onlySource.filter((x) => !x.elsewhere));
  return {
    sameFamily: source.family_id === target.family_id,
    source: { id: source.id, name: source.name, versionNo: source.version_no },
    target: { id: target.id, name: target.name, versionNo: target.version_no },
    summary: {
      matched: entries.filter((e) => e.target).length, missing: entries.filter((e) => !e.target).length,
      offered: offered.length, fitting: offered.filter((x) => x.fits).length,
      onlyTarget: entries.reduce((a, e) => a + e.onlyTarget.length, 0),
    },
    entries,
  };
}

/**
 * Übernehmen: `add` – Schnipsel der Quelle einem zugeordneten Zieleintrag hinzufügen (nur Schnipsel, die in der Quelle an diesem Eintrag
 * hängen und im Ziel noch nirgends zugeordnet sind); `create` – fehlende Einträge der Quelle im Ziel anlegen, samt ihrer Schnipsel.
 */
export async function applySync(
  ctx: Ctx, targetId: string,
  input: { from?: string; add?: { sourceNodeId?: string; snippetIds?: string[] }[]; create?: { sourceNodeId?: string; snippetIds?: string[] }[] },
  user: User,
) {
  const preview = await syncPreview(ctx, targetId, String(input.from ?? ''));
  const bySource = new Map(preview.entries.map((e) => [e.sourceNodeId, e]));
  const add = Array.isArray(input.add) ? input.add : [];
  const create = Array.isArray(input.create) ? input.create : [];
  if (!add.length && !create.length) throw badRequest('Nichts ausgewählt (add oder create).');
  const pick = (e: (typeof preview.entries)[number], ids: unknown) => {
    const allowed = new Set(e.onlySource.filter((x) => !x.elsewhere).map((x) => x.id));
    const wanted = Array.isArray(ids) ? ids.map(String) : [...allowed];
    const bad = wanted.filter((id) => !allowed.has(id));
    if (bad.length) throw badRequest(`Schnipsel ${bad.slice(0, 3).join(', ')} gehört nicht zu Eintrag ${e.number} der Quelle oder ist im Ziel bereits zugeordnet.`);
    return wanted;
  };
  const result = { added: 0, created: 0 };
  await ctx.db.tx(async () => {
    const assign = async (nodeId: string, ids: string[]) => {
      let pos = (await ctx.db.get<{ m: number | null }>('SELECT MAX(position) AS m FROM outline_assignments WHERE node_id = ?', nodeId))?.m ?? 0;
      for (const sid of ids) {
        await ctx.db.run('INSERT INTO outline_assignments (outline_id, snippet_id, node_id, position, assigned_by, assigned_at) VALUES (?, ?, ?, ?, ?, ?)', targetId, sid, nodeId, (pos += 10), user.id, now());
        result.added++;
      }
    };
    for (const a of add) {
      const e = bySource.get(String(a.sourceNodeId ?? ''));
      if (!e) throw badRequest(`Eintrag ${a.sourceNodeId} gibt es in der Quelle nicht.`);
      if (!e.target) throw badRequest(`Eintrag ${e.number} ${e.title} fehlt im Ziel – über create anlegen.`);
      await assign(e.target.nodeId, pick(e, a.snippetIds));
    }
    // fehlende Einträge: Kapitel vor Unterkapiteln, Unterkapitel unter dem zugeordneten bzw. neu angelegten Kapitel
    const created = new Map<string, string>();
    const sourceParent = new Map((await ctx.db.all('SELECT id, parent_id FROM outline_nodes WHERE outline_id = ?', preview.source.id)).map((r) => [r.id as string, (r.parent_id as string) ?? null]));
    const list = create.map((c) => {
      const e = bySource.get(String(c.sourceNodeId ?? ''));
      if (!e) throw badRequest(`Eintrag ${c.sourceNodeId} gibt es in der Quelle nicht.`);
      if (e.target) throw badRequest(`Eintrag ${e.number} ${e.title} ist im Ziel bereits vorhanden – über add ergänzen.`);
      return { e, c };
    }).sort((x, y) => x.e.level - y.e.level);
    const count = (await ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM outline_nodes WHERE outline_id = ?', targetId))!.n;
    if (count + list.length > MAX_NODES) throw badRequest(`Höchstens ${MAX_NODES} Einträge je Gliederung.`);
    for (const { e, c } of list) {
      let parentId: string | null = null;
      if (e.level === 2) {
        const sp = sourceParent.get(e.sourceNodeId)!;
        parentId = bySource.get(sp)?.target?.nodeId ?? created.get(sp) ?? null;
        if (!parentId) throw badRequest(`Für ${e.number} ${e.title} fehlt das Kapitel im Ziel – das Kapitel mit übernehmen.`);
      }
      const pos = ((await ctx.db.get<{ m: number | null }>(`SELECT MAX(position) AS m FROM outline_nodes WHERE outline_id = ? AND ${parentId ? 'parent_id = ?' : 'parent_id IS NULL'}`, targetId, ...(parentId ? [parentId] : [])))?.m ?? 0) + 10;
      const id = newId('on');
      // gleiche Gliederungsfamilie: stabile Kennung der Quelle übernehmen (Abgleich und Variantenkapitel erkennen den Eintrag wieder)
      await ctx.db.run('INSERT INTO outline_nodes (id, outline_id, parent_id, level, position, title, node_key) VALUES (?, ?, ?, ?, ?, ?, ?)', id, targetId, parentId, e.level, pos, e.title, preview.sameFamily ? e.nodeKey : id);
      created.set(e.sourceNodeId, id);
      result.created++;
      await assign(id, pick(e, c.snippetIds));
    }
    await ctx.db.run('UPDATE outlines SET updated_by = ?, updated_at = ? WHERE id = ?', user.id, now(), targetId);
    await audit(ctx, user.id, 'outline.synced', 'outline', targetId, { from: preview.source.id, ...result });
  });
  return { ...result, preview: await syncPreview(ctx, targetId, preview.source.id) };
}
