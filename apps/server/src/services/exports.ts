// Rollen-, sparten-, markt- und releasegefilterter Export freigegebener Kapitel (US-010, US-012, US-014).
import { audit, type Ctx } from '../context.js';
import { json, newId, now, parseJson } from '../db.js';
import { DIVISIONS, ROLES } from '../domain/reference.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { gateForChapter, getChapterVersion } from './chapters.js';
import { escapeHtml, markdownToHtml, markdownToPdf, renderPdf } from './render.js';
import { assertIdsInProject } from './projects.js';
import { dataUri, inlineMedia, loadMedia, type MediaFile } from './media.js';
import { appendixHtmlSections, appendixMarkdown, appendixPdf } from './appendixRender.js';
import { appendicesFor, hasAppendices, outlineOf, variantFilter, type Appendices } from './variants.js';

type Media = Map<string, MediaFile>;

export interface ExportFilter {
  roles?: string[];
  divisions?: string[];
  market?: string | null;
  release?: string | null;
  /** Handbuch-Variante (ADR-034): Blueprint ohne marktspezifische Inhalte bzw. nur die gewählten Märkte */
  blueprint?: boolean;
  markets?: string[];
}

/** Titel und Anhang eines Exports (Varianten-Export) */
export interface ExportExtras {
  title?: string;
  appendices?: Appendices | null;
}

export interface ExportInput extends ExportFilter {
  chapterIds?: string[];
  format?: ExportFormat;
  /** Handbuch-Variante (ADR-034): freigegebene Kapitel dieser Gliederung, Filter aus ihrer Variante, Verzeichnisse im Anhang */
  outlineId?: string;
  /** Verzeichnisse anhängen (Standard: bei Varianten ja) */
  appendices?: boolean;
}

export const EXPORT_FORMATS = ['md', 'html', 'pdf', 'json'] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];
export const CONTENT_TYPES: Record<ExportFormat, string> = {
  md: 'text/markdown; charset=utf-8',
  html: 'text/html; charset=utf-8',
  pdf: 'application/pdf',
  json: 'application/json',
};

type Block = { roles: string[]; divisions: string[]; market: string | null; release: string | null; kind: string };

/** Gefilterte Sicht = allgemeine Inhalte + passende spezifische Inhalte (US-010). */
export function blockMatches(b: Block, f: ExportFilter): boolean {
  const generalRole = b.roles.length === 0 || b.roles.includes('all');
  const generalDiv = b.divisions.length === 0 || b.divisions.includes('all');
  if (f.roles?.length && !generalRole && !b.roles.some((r) => f.roles!.includes(r))) return false;
  if (f.divisions?.length && !generalDiv && !b.divisions.some((d) => f.divisions!.includes(d))) return false;
  if (f.market && b.market && b.market !== f.market) return false;
  if (f.release && b.release && b.release !== f.release) return false;
  if (f.blueprint && b.market) return false;
  if (f.markets?.length && b.market && !f.markets.includes(b.market)) return false;
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
export const KIND_LABEL: Record<string, string> = { note: 'Hinweis', tip: 'Tipp', warning: 'Warnung', xref: 'Querverweis' };

export type ExportChapter = { title: string; versionNo: number; approvedAt: string | null; sections: { code: string; title: string; blocks: any[] }[] };

function filterDescription(f: ExportFilter): string {
  const parts = [
    f.roles?.length ? `Rollen: ${f.roles.map((c) => ROLES.find((r) => r.code === c)?.label ?? c).join(', ')}` : null,
    f.divisions?.length ? `Sparten: ${f.divisions.map((c) => DIVISIONS.find((d) => d.code === c)?.label ?? c).join(', ')}` : null,
    f.market ? `Markt: ${f.market}` : f.markets && f.markets.length > 1 ? `Märkte: ${f.markets.join(', ')}` : null,
    f.blueprint ? 'Blueprint (ohne marktspezifische Inhalte)' : null,
    f.release ? `Release: ${f.release}` : null,
  ].filter(Boolean);
  return parts.length ? `Filter: ${parts.join(' · ')}` : 'ungefiltert';
}

/** Kapitel → sichtbare Abschnitte/Blöcke nach Filter (gemeinsam für alle Formate). */
export function visible(chapters: ExportChapter[], f: ExportFilter) {
  return chapters.map((ch) => ({
    ...ch,
    sections: ch.sections.map((s) => ({ ...s, blocks: s.blocks.filter((b) => b.kind !== 'gap' && blockMatches(b, f)) })).filter((s) => s.blocks.length),
  }));
}

const versionLine = (ch: ExportChapter) => `Freigegebene Version ${ch.versionNo}${ch.approvedAt ? ` vom ${ch.approvedAt.slice(0, 10)}` : ''}`;

/** `media`: Bilder als data:-URIs einbetten (eigenständige Datei); ohne: Verweise bleiben `media:<sha>` */
export function renderMarkdown(chapters: ExportChapter[], f: ExportFilter, media?: Media, extras: ExportExtras = {}): string {
  const out: string[] = [`# ${extras.title ?? 'oneSCM Benutzerhandbuch'}`, '', `> Exportiert am ${now().slice(0, 10)} · ${filterDescription(f)}`, ''];
  for (const ch of visible(chapters, f)) {
    out.push(`## ${ch.title}`, '', `*${versionLine(ch)}*`, '');
    for (const s of ch.sections) {
      out.push(`### ${s.title}`, '');
      for (const b of s.blocks) {
        const badges = badgeLine(b);
        if (badges) out.push(`> ${badges}`, '');
        out.push(`${KIND_PREFIX[b.kind] ?? ''}${media ? inlineMedia(b.text, media) : b.text}`, '');
      }
    }
  }
  if (extras.appendices && hasAppendices(extras.appendices)) out.push(appendixMarkdown(extras.appendices));
  return out.join('\n');
}

/** Eigenständiges, druckfähiges HTML ohne Skripte (CSP im Dokument, HTML aus Quellen escaped). */
export function renderHtml(chapters: ExportChapter[], f: ExportFilter, media: Media = new Map(), extras: ExportExtras = {}): string {
  const title = extras.title ?? 'oneSCM Benutzerhandbuch';
  const images = (sha: string) => (media.has(sha) ? dataUri(media.get(sha)!) : null);
  const body: string[] = [];
  const toc: string[] = [];
  visible(chapters, f).forEach((ch, i) => {
    toc.push(`<li><a href="#k${i}">${escapeHtml(ch.title)}</a></li>`);
    body.push(`<section class="chapter" id="k${i}"><h2>${escapeHtml(ch.title)}</h2><p class="meta">${escapeHtml(versionLine(ch))}</p>`);
    for (const s of ch.sections) {
      body.push(`<h3>${escapeHtml(s.title)}</h3>`);
      for (const b of s.blocks) {
        const badges = badgeLine(b);
        body.push(`<div class="block kind-${escapeHtml(b.kind)}">`);
        if (badges) body.push(`<p class="badges">${escapeHtml(badges)}</p>`);
        if (KIND_LABEL[b.kind] && b.kind !== 'xref') body.push(`<p class="label">${KIND_LABEL[b.kind]}</p>`);
        body.push(markdownToHtml(b.text, images), '</div>');
      }
    }
    body.push('</section>');
  });
  // Verzeichnisse im Anhang (Varianten-Export)
  for (const a of extras.appendices ? appendixHtmlSections(extras.appendices, images) : []) {
    toc.push(`<li><a href="#${a.id}">${escapeHtml(a.title)}</a></li>`);
    body.push(`<section class="chapter" id="${a.id}"><h2>${escapeHtml(a.title)}</h2>${a.html}</section>`);
  }
  return `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
body{font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0f172a;max-width:860px;margin:0 auto;padding:24px}
h1{font-size:26px}h2{font-size:21px;border-bottom:2px solid #1d63d8;padding-bottom:4px;margin-top:36px}h3{font-size:16px;margin:20px 0 6px}
.meta,.filter{color:#5b6474;font-size:13px}.badges{font-size:12px;color:#334155;margin:0 0 4px}
.block{margin:6px 0 10px}.kind-note,.kind-tip{background:#eaf1fd;border-left:4px solid #1d63d8;padding:6px 10px}
.kind-warning{background:#fdecec;border-left:4px solid #b91c1c;padding:6px 10px}.label{font-weight:600;margin:0 0 2px}
table{border-collapse:collapse}td,th{border:1px solid #cbd5e1;padding:4px 8px}pre{background:#f3f4f6;padding:8px;white-space:pre-wrap}
img{max-width:100%;height:auto;border:1px solid #e2e8f0}
nav ol{columns:2}
@media print{body{max-width:none;padding:0}.chapter{break-before:page}a{color:inherit;text-decoration:none}nav{break-after:page}}
</style></head><body>
<h1>${escapeHtml(title)}</h1>
<p class="filter">Exportiert am ${now().slice(0, 10)} · ${escapeHtml(filterDescription(f))}</p>
<nav><h2>Inhalt</h2><ol>${toc.join('')}</ol></nav>
${body.join('\n')}
</body></html>`;
}

/** Badge-Zeile ohne Emojis (PDF-Schrift enthält keine Emojis): Text + Farbe statt Icon. */
function pdfBadges(b: Block): string {
  const parts: string[] = [];
  for (const r of ROLES) if (b.roles.includes(r.code) && r.code !== 'all') parts.push(`Rolle ${r.label}`);
  for (const d of DIVISIONS) if (b.divisions.includes(d.code) && d.code !== 'all') parts.push(`Sparte ${d.label}`);
  if (b.market) parts.push(`Markt ${b.market}`);
  if (b.release) parts.push(`Release ${b.release}`);
  return parts.join(' · ');
}

export async function renderPdfExport(chapters: ExportChapter[], f: ExportFilter, media?: Media, extras: ExportExtras = {}): Promise<Buffer> {
  const title = extras.title ?? 'oneSCM Benutzerhandbuch';
  const content: unknown[] = [
    { text: title, style: 'title' },
    { text: `Exportiert am ${now().slice(0, 10)} · ${filterDescription(f)}`, style: 'meta', margin: [0, 0, 0, 16] },
  ];
  visible(chapters, f).forEach((ch, i) => {
    content.push({ text: ch.title, style: 'chapter', tocItem: true, ...(i > 0 ? { pageBreak: 'before' } : {}) });
    content.push({ text: versionLine(ch), style: 'meta', margin: [0, 0, 0, 8] });
    for (const s of ch.sections) {
      content.push({ text: s.title, style: 'section' });
      for (const b of s.blocks) {
        const badges = pdfBadges(b);
        const inner: unknown[] = [];
        if (badges) inner.push({ text: badges, style: 'badges' });
        if (KIND_LABEL[b.kind] && b.kind !== 'xref') inner.push({ text: KIND_LABEL[b.kind], bold: true });
        inner.push(...markdownToPdf(b.text, media));
        const box = b.kind === 'warning' ? '#fdecec' : b.kind === 'note' || b.kind === 'tip' ? '#eaf1fd' : null;
        content.push(box ? { table: { widths: ['*'], body: [[{ stack: inner, fillColor: box }]] }, layout: 'noBorders', margin: [0, 2, 0, 8] } : { stack: inner, margin: [0, 0, 0, 4] });
      }
    }
  });
  if (extras.appendices) content.push(...appendixPdf(extras.appendices, media));
  return renderPdf({
    info: { title, creator: 'oneSCM Handbook Studio' },
    pageSize: 'A4',
    pageMargins: [48, 56, 48, 56],
    defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.25 },
    footer: (page: number, pages: number) => ({ text: `Seite ${page} von ${pages}`, alignment: 'center', fontSize: 8, color: '#64748b', margin: [0, 20, 0, 0] }),
    styles: {
      title: { fontSize: 22, bold: true, margin: [0, 0, 0, 4] },
      meta: { fontSize: 9, color: '#5b6474' },
      chapter: { fontSize: 17, bold: true, color: '#1d63d8', margin: [0, 0, 0, 2] },
      section: { fontSize: 12.5, bold: true, margin: [0, 10, 0, 4] },
      badges: { fontSize: 8.5, color: '#334155', margin: [0, 0, 0, 2] },
      md_h1: { fontSize: 13, bold: true, margin: [0, 6, 0, 4] },
      md_h2: { fontSize: 12, bold: true, margin: [0, 6, 0, 4] },
      md_h3: { fontSize: 11, bold: true, margin: [0, 4, 0, 3] },
      md_h4: { fontSize: 10, bold: true, margin: [0, 4, 0, 3] },
    },
    content,
  });
}

export async function createExport(ctx: Ctx, input: ExportInput, actor: string) {
  const format = input.format ?? 'md';
  if (!(EXPORT_FORMATS as readonly string[]).includes(format)) throw badRequest(`format muss eines von ${EXPORT_FORMATS.join(', ')} sein.`);
  if (input.chapterIds?.length) await assertIdsInProject(ctx, 'chapterId', input.chapterIds);
  const outline = input.outlineId ? await outlineOf(ctx, input.outlineId) : null;
  // ohne Auswahl: freigegebene Kapitel der Quellen bzw. der Variante
  const chapterIds = input.chapterIds?.length
    ? input.chapterIds
    : (outline
      ? await ctx.db.all("SELECT DISTINCT chapter_id, c.position FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND c.outline_family_id = ? AND v.status = 'approved' ORDER BY c.position", ctx.projectId, outline.family_id)
      : await ctx.db.all("SELECT DISTINCT chapter_id FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND c.outline_family_id IS NULL AND v.status = 'approved'", ctx.projectId)
    ).map((r) => r.chapter_id as string);

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

  const vf = outline ? variantFilter(outline) : null;
  const filter: ExportFilter = {
    roles: input.roles ?? (vf?.roles.length ? vf.roles : undefined), divisions: input.divisions ?? (vf?.divisions.length ? vf.divisions : undefined),
    market: input.market ?? vf?.market ?? null, release: input.release ?? null,
    ...(vf ? { blueprint: vf.blueprint, markets: vf.markets } : {}),
  };
  const extras: ExportExtras = {
    title: outline ? outline.name : undefined,
    appendices: (input.appendices ?? !!outline) ? await appendicesFor(ctx, outline, visible(chapters, filter)) : null,
  };
  // Bilder der sichtbaren Absätze (ADR-029) – eingebettet, damit die Datei eigenständig bleibt
  const media = format === 'json' ? new Map() : await loadMedia(ctx, visible(chapters, filter).flatMap((ch) => ch.sections.flatMap((s) => s.blocks.map((b: any) => b.text as string))));
  let data: Buffer;
  let preview: string | null;
  if (format === 'pdf') {
    data = await renderPdfExport(chapters, filter, media, extras);
    preview = null;
  } else {
    const text = format === 'md' ? renderMarkdown(chapters, filter, media, extras) : format === 'html' ? renderHtml(chapters, filter, media, extras)
      : JSON.stringify({ title: extras.title ?? null, filter, chapters: visible(chapters, filter), appendices: extras.appendices ?? null }, null, 2);
    data = Buffer.from(text, 'utf8');
    // Vorschau für die UI immer als Markdown bzw. JSON (HTML wird dort nicht eingebettet)
    preview = (format === 'json' ? text : renderMarkdown(chapters, filter, undefined, { title: extras.title })).slice(0, 4000);
  }

  const id = newId('exp');
  const key = `exports/${id}.${format}`;
  await ctx.store.put(key, data);
  const fileName = `onescm-handbuch-${now().slice(0, 10)}.${format}`;
  await ctx.db.run(
    'INSERT INTO exports (id, project_id, params, status, format, storage_key, file_name, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    id, ctx.projectId, json({ ...input, skipped }), 'completed', format, key, fileName, actor, now(),
  );
  await audit(ctx, actor, 'export.created', 'export', id, { ...input, chapters: chapters.length, skipped });
  return { id, status: 'completed', format, fileName, chapters: chapters.length, skipped, downloadUrl: `/api/v1/exports/${id}/download`, preview, byteSize: data.length };
}

export async function listExports(ctx: Ctx) {
  return (await ctx.db.all('SELECT * FROM exports WHERE project_id = ? ORDER BY created_at DESC', ctx.projectId)).map((e) => ({
    id: e.id, status: e.status, format: e.format, fileName: e.file_name, params: parseJson(e.params, {}), createdBy: e.created_by, createdAt: e.created_at, downloadUrl: `/api/v1/exports/${e.id}/download`,
  }));
}

export async function downloadExport(ctx: Ctx, id: string) {
  const e = await ctx.db.get('SELECT * FROM exports WHERE id = ?', id);
  if (!e) throw notFound(`Export ${id}`);
  return { fileName: e.file_name as string, format: e.format as ExportFormat, data: await ctx.store.get(e.storage_key) };
}

