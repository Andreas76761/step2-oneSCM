// Rollen-, sparten-, markt- und releasegefilterter Export freigegebener Kapitel (US-010, US-012, US-014).
import { audit, type Ctx } from '../context.js';
import { json, newId, now, parseJson } from '../db.js';
import { DIVISIONS, ROLES } from '../domain/reference.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { gateForChapter, getChapterVersion } from './chapters.js';

export interface ExportFilter {
  roles?: string[];
  divisions?: string[];
  market?: string | null;
  release?: string | null;
}

export interface ExportInput extends ExportFilter {
  chapterIds?: string[];
  format?: 'md' | 'json';
}

type Block = { roles: string[]; divisions: string[]; market: string | null; release: string | null; kind: string };

/** Gefilterte Sicht = allgemeine Inhalte + passende spezifische Inhalte (US-010). */
export function blockMatches(b: Block, f: ExportFilter): boolean {
  const generalRole = b.roles.length === 0 || b.roles.includes('all');
  const generalDiv = b.divisions.length === 0 || b.divisions.includes('all');
  if (f.roles?.length && !generalRole && !b.roles.some((r) => f.roles!.includes(r))) return false;
  if (f.divisions?.length && !generalDiv && !b.divisions.some((d) => f.divisions!.includes(d))) return false;
  if (f.market && b.market && b.market !== f.market) return false;
  if (f.release && b.release && b.release !== f.release) return false;
  return true;
}

export function badgeLine(b: Pick<Block, 'roles' | 'divisions' | 'market' | 'release'>): string {
  const parts: string[] = [];
  for (const r of ROLES) if (b.roles.includes(r.code) && r.code !== 'all') parts.push(`${r.icon} ${r.label}`);
  for (const d of DIVISIONS) if (b.divisions.includes(d.code) && d.code !== 'all') parts.push(`${d.icon} ${d.label}`);
  if (b.market) parts.push(`Markt: ${b.market}`);
  if (b.release) parts.push(`Release: ${b.release}`);
  return parts.join(' · ');
}

const KIND_PREFIX: Record<string, string> = { note: 'ℹ️ **Hinweis:** ', tip: '💡 **Tipp:** ', warning: '⚠️ **Warnung:** ', xref: '↗️ ' };

export function renderMarkdown(chapters: { title: string; versionNo: number; approvedAt: string | null; sections: { code: string; title: string; blocks: any[] }[] }[], f: ExportFilter): string {
  const out: string[] = [];
  const filterDesc = [
    f.roles?.length ? `Rollen: ${f.roles.map((c) => ROLES.find((r) => r.code === c)?.label ?? c).join(', ')}` : null,
    f.divisions?.length ? `Sparten: ${f.divisions.map((c) => DIVISIONS.find((d) => d.code === c)?.label ?? c).join(', ')}` : null,
    f.market ? `Markt: ${f.market}` : null,
    f.release ? `Release: ${f.release}` : null,
  ].filter(Boolean);
  out.push('# oneSCM Benutzerhandbuch', '', `> Exportiert am ${now().slice(0, 10)}${filterDesc.length ? ` · Filter: ${filterDesc.join(' · ')}` : ' · ungefiltert'}`, '');
  for (const ch of chapters) {
    out.push(`## ${ch.title}`, '', `*Freigegebene Version ${ch.versionNo}${ch.approvedAt ? ` vom ${ch.approvedAt.slice(0, 10)}` : ''}*`, '');
    for (const s of ch.sections) {
      const blocks = s.blocks.filter((b) => b.kind !== 'gap' && blockMatches(b, f));
      if (!blocks.length) continue;
      out.push(`### ${s.title}`, '');
      for (const b of blocks) {
        const badges = badgeLine(b);
        if (badges) out.push(`> ${badges}`, '');
        out.push(`${KIND_PREFIX[b.kind] ?? ''}${b.text}`, '');
      }
    }
  }
  return out.join('\n');
}

export async function createExport(ctx: Ctx, input: ExportInput, actor: string) {
  const format = input.format ?? 'md';
  if (!['md', 'json'].includes(format)) throw badRequest('format muss md oder json sein.');
  const chapterIds = input.chapterIds?.length
    ? input.chapterIds
    : (await ctx.db.all("SELECT DISTINCT chapter_id FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND v.status = 'approved'", ctx.projectId)).map((r) => r.chapter_id as string);

  const blockers: { chapterId: string; checks: unknown }[] = [];
  const skipped: { chapterId: string; reason: string }[] = [];
  const chapters: any[] = [];
  for (const cid of chapterIds) {
    const chapter = await ctx.db.get('SELECT id, title, position FROM chapters WHERE id = ?', cid);
    if (!chapter) throw notFound(`Kapitel ${cid}`);
    const gate = await gateForChapter(ctx, cid, 'export');
    if (!gate.passed) blockers.push({ chapterId: cid, checks: gate.checks.filter((c) => !c.passed) });
    const v = await ctx.db.get("SELECT id FROM generated_chapter_versions WHERE chapter_id = ? AND status = 'approved'", cid);
    if (!v) {
      skipped.push({ chapterId: cid, reason: `Kapitel „${chapter.title}“ hat keine freigegebene Version.` });
      continue;
    }
    chapters.push({ ...(await getChapterVersion(ctx, v.id)), position: chapter.position });
  }
  if (blockers.length) throw conflict('Export blockiert: offene Blocker- oder Datenschutzbefunde.', { blockers });
  chapters.sort((a, b) => a.position - b.position);

  const filter: ExportFilter = { roles: input.roles, divisions: input.divisions, market: input.market ?? null, release: input.release ?? null };
  const content = format === 'md'
    ? renderMarkdown(chapters, filter)
    : JSON.stringify({ filter, chapters: chapters.map((c) => ({ ...c, sections: c.sections.map((s: any) => ({ ...s, blocks: s.blocks.filter((b: any) => b.kind !== 'gap' && blockMatches(b, filter)) })) })) }, null, 2);

  const id = newId('exp');
  const key = `exports/${id}.${format}`;
  await ctx.store.put(key, Buffer.from(content, 'utf8'));
  const fileName = `onescm-handbuch-${now().slice(0, 10)}.${format}`;
  await ctx.db.run(
    'INSERT INTO exports (id, project_id, params, status, format, storage_key, file_name, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    id, ctx.projectId, json({ ...input, skipped }), 'completed', format, key, fileName, actor, now(),
  );
  await audit(ctx.db, actor, 'export.created', 'export', id, { ...input, chapters: chapters.length, skipped });
  return { id, status: 'completed', format, fileName, chapters: chapters.length, skipped, downloadUrl: `/api/v1/exports/${id}/download`, preview: content.slice(0, 4000) };
}

export async function listExports(ctx: Ctx) {
  return (await ctx.db.all('SELECT * FROM exports WHERE project_id = ? ORDER BY created_at DESC', ctx.projectId)).map((e) => ({
    id: e.id, status: e.status, format: e.format, fileName: e.file_name, params: parseJson(e.params, {}), createdBy: e.created_by, createdAt: e.created_at, downloadUrl: `/api/v1/exports/${e.id}/download`,
  }));
}

export async function downloadExport(ctx: Ctx, id: string) {
  const e = await ctx.db.get('SELECT * FROM exports WHERE id = ?', id);
  if (!e) throw notFound(`Export ${id}`);
  return { fileName: e.file_name as string, format: e.format as string, data: await ctx.store.get(e.storage_key) };
}

