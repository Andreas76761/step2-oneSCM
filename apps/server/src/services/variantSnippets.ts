// Kapitel einer Handbuch-Variante (ADR-034): Inhalte kommen aus den Zuordnungen der Gliederung (Draft Manual)
// statt aus der Kapitelstruktur der Quellen.
import type { Ctx } from '../context.js';
import type { Row } from '../db.js';

/** Maßgebliche Version einer Gliederung: aktive Version, sonst die neueste */
export async function effectiveOutline(ctx: Ctx, familyId: string) {
  return (await ctx.db.get("SELECT * FROM outlines WHERE family_id = ? AND project_id = ? AND status = 'active'", familyId, ctx.projectId))
    ?? ctx.db.get('SELECT * FROM outlines WHERE family_id = ? AND project_id = ? ORDER BY version_no DESC LIMIT 1', familyId, ctx.projectId);
}

export interface VariantSnippetRef {
  snippetId: string;
  /** Titel des Unterkapitels der Gliederung, null = direkt im Kapitel */
  subTitle: string | null;
  subPosition: number;
}

/** Zugeordnete Schnipsel eines Varianten-Kapitels in Gliederungsreihenfolge (Kapitel vor Unterkapiteln) */
export async function variantSnippetRefs(ctx: Ctx, chapter: Row): Promise<{ refs: VariantSnippetRef[]; subchapters: { id: string; title: string; position: number }[] }> {
  if (!chapter.outline_family_id) return { refs: [], subchapters: [] };
  const outline = await effectiveOutline(ctx, chapter.outline_family_id);
  if (!outline) return { refs: [], subchapters: [] };
  const node = await ctx.db.get('SELECT id FROM outline_nodes WHERE outline_id = ? AND node_key = ? AND level = 1', outline.id, chapter.outline_node_key);
  if (!node) return { refs: [], subchapters: [] };
  const subs = await ctx.db.all('SELECT id, title, position FROM outline_nodes WHERE parent_id = ? ORDER BY position', node.id);
  const rows = await ctx.db.all(
    `SELECT a.snippet_id, a.position, n.level, n.title, n.position AS npos FROM outline_assignments a JOIN outline_nodes n ON n.id = a.node_id
     WHERE a.outline_id = ? AND (n.id = ? OR n.parent_id = ?) ORDER BY n.level, n.position, a.position`,
    outline.id, node.id, node.id,
  );
  return {
    refs: rows.map((r) => ({ snippetId: r.snippet_id as string, subTitle: r.level === 2 ? (r.title as string) : null, subPosition: r.level === 2 ? (r.npos as number) : 0 })),
    subchapters: subs.map((s) => ({ id: s.id as string, title: s.title as string, position: s.position as number })),
  };
}

/** SQL-Bedingung für die Schnipsel eines Kapitels (Quelle: chapter_id, Variante: Zuordnungen) */
export async function snippetScope(ctx: Ctx, chapter: Row, alias = 's'): Promise<{ sql: string; params: unknown[] }> {
  if (!chapter.outline_family_id) return { sql: `${alias}.chapter_id = ?`, params: [chapter.id] };
  const ids = (await variantSnippetRefs(ctx, chapter)).refs.map((r) => r.snippetId);
  return ids.length ? { sql: `${alias}.id IN (${ids.map(() => '?').join(',')})`, params: ids } : { sql: '1 = 0', params: [] };
}
