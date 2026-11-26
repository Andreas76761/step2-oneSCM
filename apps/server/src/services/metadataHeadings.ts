// Quellen je Überschrift (ADR-087, M3): je Datei ein Überschriftenbaum mit ihren Chunks, oder alle Quellen
// zusammengeführt je Überschrift – gleiche Überschrift aus mehreren Dateien nebeneinander (Nummerierung ignoriert).
import type { Ctx } from '../context.js';
import { parseJson, type Row } from '../db.js';
import { headingKey, NO_CHAPTER_TITLE } from '../domain/markdown.js';
import { notFound } from '../problem.js';
import { CHUNK_FROM, formatOf } from './metadata.js';

const PREVIEW = 240;

/** Überschriftenpfad eines Chunks: Kapitel › Unterkapitel › tiefere Überschriften */
const pathOf = (r: Row) => [r.chapter_title, r.subchapter_title, ...parseJson<string[]>(r.heading_path, [])].filter((x) => x && x !== NO_CHAPTER_TITLE) as string[];
const preview = (r: Row) => ({
  id: r.id as string, seq: Number(r.seq), kind: r.kind as string, chars: String(r.text).length,
  text: String(r.text).length > PREVIEW ? `${String(r.text).slice(0, PREVIEW).trimEnd()} …` : r.text,
  locator: parseJson<Record<string, unknown> | null>(r.locator, null), lineStart: Number(r.line_start), lineEnd: Number(r.line_end),
});

async function currentChunks(ctx: Ctx, documentId?: string) {
  return ctx.db.all(
    `SELECT s.id, s.seq, s.kind, s.text, s.locator, s.line_start, s.line_end, s.heading_path, s.position, d.id AS document_id, d.path, r.source_format,
            c.title AS chapter_title, sc.title AS subchapter_title
     ${CHUNK_FROM} WHERE d.project_id = ? AND r.is_current = 1 AND d.removed_at IS NULL ${documentId ? 'AND d.id = ?' : ''}
     ORDER BY d.path, s.position, s.id`,
    ctx.projectId, ...(documentId ? [documentId] : []),
  );
}

/** Dateien mit Anzahl Überschriften und Chunks */
export async function headingDocuments(ctx: Ctx) {
  const by = new Map<string, { documentId: string; path: string; format: string; chunks: number; headings: Set<string> }>();
  for (const r of await currentChunks(ctx)) {
    const d = by.get(r.document_id) ?? { documentId: r.document_id, path: r.path, format: formatOf(r.source_format, r.path), chunks: 0, headings: new Set<string>() };
    by.set(r.document_id, d);
    d.chunks++;
    const p = pathOf(r);
    for (let i = 1; i <= p.length; i++) d.headings.add(p.slice(0, i).join('\u0000'));
  }
  return [...by.values()].map(({ headings, ...d }) => ({ ...d, headings: headings.size }));
}

type Node = { title: string; level: number; chunks: ReturnType<typeof preview>[]; children: Node[] };

/** Überschriftenbaum einer Datei; Chunks vor der ersten Überschrift stehen unter „(ohne Überschrift)“ */
export async function headingTree(ctx: Ctx, documentId: string) {
  const rows = await currentChunks(ctx, documentId);
  if (!rows.length) {
    const doc = await ctx.db.get('SELECT id FROM source_documents WHERE id = ? AND project_id = ? AND removed_at IS NULL', documentId, ctx.projectId);
    if (!doc) throw notFound(`Quelle ${documentId}`);
  }
  const root: Node = { title: '', level: 0, chunks: [], children: [] };
  for (const r of rows) {
    let node = root;
    pathOf(r).forEach((title, i) => {
      let child = node.children.find((c) => c.title === title);
      if (!child) node.children.push((child = { title, level: i + 1, chunks: [], children: [] }));
      node = child;
    });
    if (node === root) {
      let none = root.children.find((c) => c.level === 1 && c.title === '(ohne Überschrift)');
      if (!none) root.children.unshift((none = { title: '(ohne Überschrift)', level: 1, chunks: [], children: [] }));
      node = none;
    }
    node.chunks.push(preview(r));
  }
  return { documentId, path: rows[0]?.path ?? null, format: rows[0] ? formatOf(rows[0].source_format, rows[0].path) : null, chunks: rows.length, tree: root.children };
}

/**
 * Alle Quellen zusammengeführt je Überschrift: Schlüssel = tiefste Überschrift ohne Nummerierung und Formatierung.
 * `multi` zeigt nur Überschriften, die in mehreren Dateien vorkommen.
 */
export async function mergedHeadings(ctx: Ctx, opts: { q?: string; multi?: boolean; limit?: number; offset?: number } = {}) {
  const groups = new Map<string, { key: string; title: string; paths: Set<string>; sources: Map<string, { documentId: string; path: string; format: string; headingPath: string[]; chunks: ReturnType<typeof preview>[] }> }>();
  for (const r of await currentChunks(ctx)) {
    const p = pathOf(r);
    const title = p[p.length - 1];
    if (!title) continue;
    const key = headingKey(title);
    if (!key) continue;
    const g = groups.get(key) ?? { key, title, paths: new Set<string>(), sources: new Map() };
    groups.set(key, g);
    const src = g.sources.get(r.document_id) ?? { documentId: r.document_id, path: r.path, format: formatOf(r.source_format, r.path), headingPath: p, chunks: [] };
    g.sources.set(r.document_id, src);
    src.chunks.push(preview(r));
  }
  const q = opts.q?.trim() ? headingKey(opts.q) : '';
  let items = [...groups.values()]
    .map((g) => ({ key: g.key, title: g.title, files: g.sources.size, chunks: [...g.sources.values()].reduce((n, s) => n + s.chunks.length, 0), sources: [...g.sources.values()] }))
    .filter((g) => (!opts.multi || g.files > 1) && (!q || g.key.includes(q)));
  // mehrfach vorkommende Überschriften zuerst, dann alphabetisch
  items.sort((a, b) => b.files - a.files || a.key.localeCompare(b.key, 'de'));
  const total = items.length;
  const limit = Math.min(Math.max(Math.trunc(opts.limit ?? 30), 1), 100);
  const offset = Math.max(Math.trunc(opts.offset ?? 0), 0);
  items = items.slice(offset, offset + limit);
  return { total, limit, offset, multiFiles: [...groups.values()].filter((g) => g.sources.size > 1).length, items };
}
