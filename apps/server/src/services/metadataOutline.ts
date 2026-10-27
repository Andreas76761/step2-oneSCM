// Gliederungs-Vorschlag je Chunk (F-13) und Kapitel ↔ Quellen je Gliederungspunkt (F-14), ADR-084.
// Vorschläge werden nie automatisch übernommen; übernommen wird über die vorhandene Label-Zuordnung (POST /metadata/chunks/labels).
import type { Ctx } from '../context.js';
import { parseJson, type Row } from '../db.js';
import { stripNumber } from '../domain/outline.js';
import { buildProfiles, suggestOutline, SUGGEST_MIN_SCORE, type OutlineProfiles } from '../domain/outlineSuggest.js';
import { badRequest, notFound } from '../problem.js';
import { chapterFolder } from './domainMap.js';
import { CHUNK_FROM, chunkDto, labelsBy, listChunks } from './metadata.js';

/** neueste, nicht ersetzte Kapitelversion je Kapitel */
const LATEST = `v.status <> 'superseded' AND NOT EXISTS (
  SELECT 1 FROM generated_chapter_versions v2 WHERE v2.chapter_id = v.chapter_id AND v2.status <> 'superseded' AND v2.version_no > v.version_no)`;
const MAX_SCAN = 20000;

/** Profile aller Gliederungspunkte inkl. der über die Zuordnung verbundenen Domänen und Menüpunkte */
export async function outlineProfiles(ctx: Ctx): Promise<OutlineProfiles> {
  const labels = await ctx.db.all(
    "SELECT id, code, label_group, name_de, name_en, description FROM metadata_labels WHERE project_id = ? AND archived_at IS NULL AND label_group IN ('outline', 'domain', 'navigation') ORDER BY position",
    ctx.projectId,
  );
  const byId = new Map(labels.map((l) => [l.id as string, l]));
  const links = await ctx.db.all('SELECT domain_label_id AS d, target_label_id AS t FROM metadata_label_links WHERE project_id = ? AND active = 1', ctx.projectId);
  return buildProfiles(labels.filter((l) => l.label_group === 'outline').map((o) => {
    const domains = links.filter((k) => k.t === o.id).map((k) => k.d as string).filter((d) => byId.has(d));
    const navs = links.filter((k) => domains.includes(k.d) && byId.get(k.t)?.label_group === 'navigation').map((k) => k.t as string);
    const ids = [...new Set([...domains, ...navs])];
    return {
      id: o.id, code: o.code, name: o.name_de, description: o.description,
      linkedNames: ids.flatMap((id) => [byId.get(id)!.name_de, byId.get(id)!.name_en]), linkedLabelIds: ids,
    };
  }));
}

const headingsOf = (r: Row) => [r.subchapter_title ?? r.subchapter, ...parseJson<string[]>(r.heading_path, []).slice(1)].filter(Boolean) as string[];
const contextOf = (r: Row) => [r.chapter_title ?? r.chapter].filter(Boolean) as string[];

/** Chunks wie /metadata/chunks, zusätzlich Gliederungs-Vorschläge für Chunks ohne Gliederungspunkt */
export async function listChunksWithSuggestions(ctx: Ctx, opts: Parameters<typeof listChunks>[1] & { minScore?: number }) {
  const page = await listChunks(ctx, opts);
  const profiles = await outlineProfiles(ctx);
  return {
    ...page,
    items: page.items.map((c) => ({
      ...c,
      outlineSuggestions: c.labels.some((l) => l.group === 'outline') ? [] : suggestOutline(profiles, { text: c.text, headings: [c.subchapter, ...c.headingPath.slice(1)].filter(Boolean) as string[], context: [c.chapter].filter(Boolean) as string[], labelIds: c.labels.map((l) => l.id) }, { minScore: opts.minScore }),
    })),
  };
}

async function currentChunks(ctx: Ctx, where = '', ...params: unknown[]) {
  return ctx.db.all(
    `SELECT s.*, d.id AS document_id, d.path, d.file_name, r.source_format, r.revision_no, c.title AS chapter_title, sc.title AS subchapter_title
     ${CHUNK_FROM} WHERE d.project_id = ? AND r.is_current = 1 AND d.removed_at IS NULL ${where} ORDER BY d.path, s.position LIMIT ${MAX_SCAN}`,
    ctx.projectId, ...params,
  );
}

/** Snippets, auf denen Absätze der neuesten Kapitelversionen beruhen */
async function usedSnippets(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT DISTINCT x.snippet_id, c.id AS chapter_id FROM content_block_sources x JOIN content_blocks b ON b.id = x.block_id
     JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id
     WHERE c.project_id = ? AND b.deleted_at IS NULL AND ${LATEST}`, ctx.projectId,
  );
  const map = new Map<string, Set<string>>();
  for (const r of rows) map.set(r.snippet_id, (map.get(r.snippet_id) ?? new Set()).add(r.chapter_id));
  return map;
}

const norm = (t: string) => (stripNumber(t) || t).toLowerCase().replace(/[^a-z0-9äöüß]+/g, ' ').trim();

/** Übersicht je Gliederungspunkt: zugeordnete Chunks, davon im Handbuch verwendet, offene Vorschläge */
export async function outlineCoverage(ctx: Ctx) {
  const outline = await ctx.db.all("SELECT id, code, name_de, name_en FROM metadata_labels WHERE project_id = ? AND archived_at IS NULL AND label_group = 'outline' ORDER BY position", ctx.projectId);
  const chunks = await currentChunks(ctx);
  const labels = await labelsBy(ctx, 'metadata_chunk_labels', 'snippet_id', chunks.map((c) => c.id));
  const used = await usedSnippets(ctx);
  const profiles = await outlineProfiles(ctx);
  const stats = new Map(outline.map((o) => [o.id as string, { chunks: 0, used: 0, suggestions: 0 }]));
  let unassigned = 0;
  for (const c of chunks) {
    const ls = labels.get(c.id) ?? [];
    const own = ls.filter((l) => l.group === 'outline');
    for (const l of own) {
      const s = stats.get(l.id);
      if (!s) continue;
      s.chunks++;
      if (used.has(c.id)) s.used++;
    }
    if (!own.length) {
      unassigned++;
      const best = suggestOutline(profiles, { text: c.text, headings: headingsOf(c), context: contextOf(c), labelIds: ls.map((l) => l.id) }, { limit: 1 })[0];
      if (best) stats.get(best.labelId)!.suggestions++;
    }
  }
  return {
    chunks: chunks.length, unassigned, minScore: SUGGEST_MIN_SCORE,
    items: outline.map((o) => ({ id: o.id, code: o.code, nameDe: o.name_de, nameEn: o.name_en, folder: chapterFolder(o.code, o.name_de).folder, ...stats.get(o.id)! })),
  };
}

/** F-14: ein Gliederungspunkt zweispaltig – Handbuchkapitel (links) und zugeordnete Quellen-Chunks (rechts) */
export async function outlineSources(ctx: Ctx, labelId: string, opts: { minScore?: number } = {}) {
  const o = await ctx.db.get("SELECT * FROM metadata_labels WHERE id = ? AND project_id = ? AND label_group = 'outline'", labelId, ctx.projectId);
  if (!o) throw notFound(`Gliederungspunkt ${labelId}`);
  const min = opts.minScore ?? SUGGEST_MIN_SCORE;
  if (!(min >= 0.1 && min <= 1)) throw badRequest('minScore muss zwischen 0,1 und 1 liegen.');
  const assigned = await currentChunks(ctx, 'AND EXISTS (SELECT 1 FROM metadata_chunk_labels x WHERE x.snippet_id = s.id AND x.label_id = ?)', labelId);
  const used = await usedSnippets(ctx);
  // Handbuchkapitel: gleicher Titel wie der Gliederungspunkt oder Absätze auf Grundlage zugeordneter Chunks
  const chapters = await ctx.db.all("SELECT id, title FROM chapters WHERE project_id = ? AND key <> '__none__' AND outline_family_id IS NULL ORDER BY position, title", ctx.projectId);
  const viaSources = new Set(assigned.flatMap((c) => [...(used.get(c.id) ?? [])]));
  const target = norm(o.name_de);
  const matched = chapters.filter((c) => norm(c.title) === target || viaSources.has(c.id));
  const handbook = [];
  for (const c of matched) {
    const v = await ctx.db.get(`SELECT v.id, v.version_no, v.status FROM generated_chapter_versions v WHERE v.chapter_id = ? AND ${LATEST}`, c.id);
    const blocks = v ? await ctx.db.all(
      `SELECT b.id, b.section_code, b.kind, b.text, (SELECT COUNT(*) FROM content_block_sources x WHERE x.block_id = b.id) AS sources
       FROM content_blocks b WHERE b.chapter_version_id = ? AND b.deleted_at IS NULL ORDER BY b.section_code, b.position`, v.id,
    ) : [];
    const sourceIds = v ? new Set((await ctx.db.all('SELECT DISTINCT x.snippet_id FROM content_block_sources x JOIN content_blocks b ON b.id = x.block_id WHERE b.chapter_version_id = ? AND b.deleted_at IS NULL', v.id)).map((r) => r.snippet_id)) : new Set();
    handbook.push({
      chapterId: c.id, title: c.title, match: norm(c.title) === target ? 'title' : 'sources',
      version: v ? { id: v.id, versionNo: Number(v.version_no), status: v.status } : null,
      blocks: blocks.map((b) => ({ id: b.id, section: b.section_code, kind: b.kind, text: b.text, sources: Number(b.sources) })),
      fromAssigned: assigned.filter((a) => sourceIds.has(a.id)).length,
    });
  }
  const assignedLabels = await labelsBy(ctx, 'metadata_chunk_labels', 'snippet_id', assigned.map((c) => c.id));
  // Vorschläge: Chunks ohne Gliederungspunkt, deren bester Vorschlag dieser Punkt ist
  const profiles = await outlineProfiles(ctx);
  const open = await currentChunks(ctx, "AND NOT EXISTS (SELECT 1 FROM metadata_chunk_labels x JOIN metadata_labels l ON l.id = x.label_id WHERE x.snippet_id = s.id AND l.label_group = 'outline')");
  const openLabels = await labelsBy(ctx, 'metadata_chunk_labels', 'snippet_id', open.map((c) => c.id));
  const suggestions = open.map((c) => ({ c, s: suggestOutline(profiles, { text: c.text, headings: headingsOf(c), context: contextOf(c), labelIds: (openLabels.get(c.id) ?? []).map((l) => l.id) }, { minScore: min, limit: 1 })[0] }))
    .filter((x) => x.s?.labelId === labelId).sort((a, b) => b.s!.score - a.s!.score).slice(0, 50)
    .map((x) => ({ ...chunkDto(x.c, openLabels.get(x.c.id) ?? []), score: x.s!.score, matched: x.s!.matched }));
  const chunkItems = assigned.map((c) => ({ ...chunkDto(c, assignedLabels.get(c.id) ?? []), usedInHandbook: used.has(c.id) }));
  return {
    outline: { id: o.id, code: o.code, nameDe: o.name_de, nameEn: o.name_en, folder: chapterFolder(o.code, o.name_de).folder },
    handbook, chunks: chunkItems, suggestions,
    summary: { chapters: handbook.length, chunks: chunkItems.length, used: chunkItems.filter((c) => c.usedInHandbook).length, unused: chunkItems.filter((c) => !c.usedInHandbook).length, suggestions: suggestions.length },
  };
}
