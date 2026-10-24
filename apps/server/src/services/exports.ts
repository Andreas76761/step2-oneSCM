// Rollen-, sparten-, markt- und releasegefilterter Export freigegebener Kapitel (US-010, US-012, US-014).
import { audit, type Ctx } from '../context.js';
import { json, newId, now, parseJson } from '../db.js';
import { DIVISIONS, ROLES } from '../domain/reference.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { gateForChapter, getChapterVersion } from './chapters.js';
import { escapeHtml, markdownToHtml, markdownToPdf, renderPdf } from './render.js';
import { assertIdsInProject } from './projects.js';
import { dataUri, inlineMedia, loadMedia, type MediaFile } from './media.js';
import { appendixHtmlSections, appendixMarkdown, appendixPdf, APPENDIX_ANCHORS } from './appendixRender.js';
import { isFutureContent } from '../domain/releaseOrder.js';
import { frameTexts, pageLine, type FrameTexts } from '../domain/frameTexts.js';
import { htmlLang } from '../domain/translate.js';
import { historyAppendix } from './structure.js';
import { appendicesFor, hasAppendices, outlineOf, variantFilter, type Appendices } from './variants.js';
import { DEFAULT_LAYOUT, resolveLayout, type ResolvedLayout } from './layout.js';
import { renderDocx } from './docx.js';
import { transitionsFor } from './transitions.js';
import { applyVariants } from './imageArchive.js';

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
  /** Firmen-Layout (ADR-038) */
  layout?: ResolvedLayout;
  /** Lesefassung (ADR-085, F-28): ohne Rollen-/Sparten-/Markt-Badges und ohne Versionszeile */
  reading?: boolean;
  /** Sprache der Rahmentexte (ADR-101, U-08); Standard Deutsch */
  language?: string;
}

/** Ausgabeprofile (ADR-085, F-27): vollständiges Handbuch, Quick Guide (Schritte, Ergebnis, Warnungen) oder One Pager */
export const EXPORT_PROFILES = ['full', 'quickguide', 'onepager'] as const;
export type ExportProfile = (typeof EXPORT_PROFILES)[number];
export const PROFILE_LABEL: Record<ExportProfile, string> = { full: 'Handbuch', quickguide: 'Quick Guide', onepager: 'One Pager' };

const NO_LAYOUT: ResolvedLayout = { ...DEFAULT_LAYOUT, logo: null, stylesXml: null };

export interface ExportInput extends ExportFilter {
  chapterIds?: string[];
  format?: ExportFormat;
  /** Handbuch-Variante (ADR-034): freigegebene Kapitel dieser Gliederung, Filter aus ihrer Variante, Verzeichnisse im Anhang */
  outlineId?: string;
  /** Verzeichnisse anhängen (Standard: bei Varianten ja) */
  appendices?: boolean;
  /** Ausgabeprofil (F-27) */
  profile?: ExportProfile;
  /** Lesefassung ohne Badges und Versionszeile (F-28) */
  reading?: boolean;
  /** „Weiter mit Kapitel …“ am Kapitelende (F-29, nur vollständiges Handbuch): Standard = gepflegte Übergänge, true = zusätzlich automatisch das nächste Kapitel, false = keine */
  transitions?: boolean;
  /**
   * Stand (Release) für Zukunfts-Inhalte (ADR-102, W-09): Kapitel mit späterem „gültig ab“ werden ausgeblendet.
   * Standard ist der Release-Filter; ohne beides wird nichts ausgeblendet.
   */
  asOf?: string;
}

export const EXPORT_FORMATS = ['md', 'html', 'pdf', 'docx', 'json'] as const;
export type ExportFormat = (typeof EXPORT_FORMATS)[number];
export const CONTENT_TYPES: Record<ExportFormat, string> = {
  md: 'text/markdown; charset=utf-8',
  html: 'text/html; charset=utf-8',
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
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

const KIND_ICON: Record<string, string> = { note: 'ℹ️', tip: '💡', warning: '⚠️' };
const kindPrefix = (kind: string, F: FrameTexts) => (kind === 'xref' ? '↗️ ' : KIND_ICON[kind] ? `${KIND_ICON[kind]} **${F[kind as 'note' | 'tip' | 'warning']}:** ` : '');
const kindLabel = (kind: string, F: FrameTexts) => (['note', 'tip', 'warning', 'xref'].includes(kind) ? F[kind as 'note' | 'tip' | 'warning' | 'xref'] : undefined);
export const KIND_LABEL: Record<string, string> = { note: 'Hinweis', tip: 'Tipp', warning: 'Warnung', xref: 'Querverweis' };
/** Titel der Verzeichnisse im Anhang in der Sprache der Rahmentexte */
const APPENDIX_KEY: Record<string, keyof FrameTexts> = { abkuerzungen: 'abbreviations', glossar: 'glossary', bildverzeichnis: 'images', faq: 'faq', historie: 'history' };
function localizeAppendixMarkdown(md: string, F: FrameTexts) {
  let out = md;
  for (const a of APPENDIX_ANCHORS) out = out.replace(new RegExp(`^(#{1,6} )${a.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm'), `$1${F[APPENDIX_KEY[a.id]]}`);
  return out;
}

export type ExportChapter = { title: string; versionNo: number; approvedAt: string | null; sections: { code: string; title: string; blocks: any[] }[] };

function filterDescription(f: ExportFilter, F: FrameTexts = frameTexts('de')): string {
  const parts = [
    f.roles?.length ? `${F.roles}: ${f.roles.map((c) => ROLES.find((r) => r.code === c)?.label ?? c).join(', ')}` : null,
    f.divisions?.length ? `${F.divisions}: ${f.divisions.map((c) => DIVISIONS.find((d) => d.code === c)?.label ?? c).join(', ')}` : null,
    f.market ? `${F.market}: ${f.market}` : f.markets && f.markets.length > 1 ? `${F.markets}: ${f.markets.join(', ')}` : null,
    f.blueprint ? F.blueprint : null,
    f.release ? `${F.release}: ${f.release}` : null,
  ].filter(Boolean);
  return parts.length ? `${F.filter}: ${parts.join(' · ')}` : F.unfiltered;
}

/** Kapitel → sichtbare Abschnitte/Blöcke nach Filter (gemeinsam für alle Formate). */
export function visible(chapters: ExportChapter[], f: ExportFilter) {
  return chapters.map((ch) => ({
    ...ch,
    sections: ch.sections.map((s) => ({ ...s, blocks: s.blocks.filter((b) => b.kind !== 'gap' && blockMatches(b, f)) })).filter((s) => s.blocks.length),
  }));
}

// Version der Funktion („gültig ab“, ADR-096) steht auch in der Lesefassung; die Freigabeversion nicht
const versionLine = (ch: ExportChapter, F: FrameTexts = frameTexts('de')) => [
  (ch as any).hideVersion ? '' : `${F.approvedVersion} ${ch.versionNo}${ch.approvedAt ? ` ${F.dated} ${ch.approvedAt.slice(0, 10)}` : ''}`,
  (ch as any).validFrom ? `${F.validFrom} ${(ch as any).validFrom}` : '',
].filter(Boolean).join(' · ');

const firstSentences = (text: string, n: number) => text.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ0-9„"])/).slice(0, n).join(' ');

/**
 * Kapitel für ein Ausgabeprofil zuschneiden (F-27), als Lesefassung ohne Badges/Versionszeile (F-28) und mit
 * „Weiter mit …“ am Kapitelende (F-29). Läuft nach dem Filter; die Renderer bleiben unverändert.
 */
export function shapeChapters(chapters: ExportChapter[], f: ExportFilter, opts: { profile?: ExportProfile; reading?: boolean; next?: Map<string, { title: string; text: string | null }> } = {}): ExportChapter[] {
  const profile = opts.profile ?? 'full';
  const plain = (b: any) => (opts.reading ? { ...b, roles: [], divisions: [], market: null, release: null } : b);
  return visible(chapters, f).map((ch: any) => {
    // Lesefassung: ohne Abschnitt „Quellen- und Freigabestatus“ (Quellenverweise)
    let sections = opts.reading ? ch.sections.filter((s: any) => s.code !== 'status') : ch.sections;
    if (profile !== 'full') {
      const warnings = sections.flatMap((s: any) => s.blocks.filter((b: any) => b.kind === 'warning' && s.code !== 'steps'));
      const purpose = sections.find((s: any) => s.code === 'purpose')?.blocks[0];
      const keep = profile === 'quickguide' ? ['prerequisites', 'steps', 'result'] : ['steps'];
      sections = [
        ...(profile === 'onepager' && purpose ? [{ code: 'purpose', title: 'Zweck', blocks: [{ ...purpose, text: firstSentences(purpose.text, 2) }] }] : []),
        ...sections.filter((s: any) => keep.includes(s.code)),
        ...(warnings.length ? [{ code: 'hints', title: 'Wichtige Hinweise', blocks: warnings }] : []),
      ];
    }
    const next = profile === 'full' ? opts.next?.get(ch.chapterId) : undefined;
    if (next) {
      const block = { kind: 'xref', text: `Weiter mit „${next.title}“${next.text ? ` – ${next.text}` : ''}`, roles: [], divisions: [], market: null, release: null };
      sections = sections.length ? [...sections.slice(0, -1), { ...sections[sections.length - 1], blocks: [...sections[sections.length - 1].blocks, block] }] : sections;
    }
    return { ...ch, hideVersion: !!opts.reading, sections: sections.map((s: any) => ({ ...s, blocks: s.blocks.map(plain) })) };
  }).filter((ch: any) => profile === 'full' || ch.sections.some((s: any) => s.code === 'steps'));
}

/** `media`: Bilder als data:-URIs einbetten (eigenständige Datei); ohne: Verweise bleiben `media:<sha>` */
export function renderMarkdown(chapters: ExportChapter[], f: ExportFilter, media?: Media, extras: ExportExtras = {}): string {
  const F = frameTexts(extras.language);
  const out: string[] = [`# ${extras.title ?? F.manualTitle}`, '', `> ${F.exportedOn} ${now().slice(0, 10)} · ${filterDescription(f, F)}`, ''];
  for (const ch of visible(chapters, f)) {
    const vl = versionLine(ch, F);
    out.push(`## ${ch.title}`, '', ...(vl ? [`*${vl}*`, ''] : []));
    for (const s of ch.sections) {
      out.push(`### ${s.title}`, '');
      for (const b of s.blocks) {
        const badges = badgeLine(b);
        if (badges) out.push(`> ${badges}`, '');
        out.push(`${kindPrefix(b.kind, F)}${media ? inlineMedia(b.text, media) : b.text}`, '');
      }
    }
  }
  if (extras.appendices && hasAppendices(extras.appendices)) out.push(localizeAppendixMarkdown(appendixMarkdown(extras.appendices), F));
  return out.join('\n');
}

/** Eigenständiges, druckfähiges HTML ohne Skripte (CSP im Dokument, HTML aus Quellen escaped). */
export function renderHtml(chapters: ExportChapter[], f: ExportFilter, media: Media = new Map(), extras: ExportExtras = {}): string {
  const F = frameTexts(extras.language);
  const title = extras.title ?? F.manualTitle;
  const l = extras.layout ?? NO_LAYOUT;
  const images = (sha: string) => (media.has(sha) ? dataUri(media.get(sha)!) : null);
  // Titelseite (ADR-038)
  const cover = l.cover ? `<header class="cover">${l.logo ? `<img class="logo" src="${escapeHtml(dataUri(l.logo))}" alt="${escapeHtml(l.companyName ?? 'Logo')}">` : ''}
${l.companyName ? `<p class="company">${escapeHtml(l.companyName)}</p>` : ''}<h1>${escapeHtml(title)}</h1>${l.coverSubtitle ? `<p class="subtitle">${escapeHtml(l.coverSubtitle)}</p>` : ''}
<p class="filter">${F.asOf} ${now().slice(0, 10)} · ${escapeHtml(filterDescription(f, F))}</p>${l.confidentiality ? `<p class="confidential">${escapeHtml(l.confidentiality)}</p>` : ''}</header>` : '';
  const body: string[] = [];
  const toc: string[] = [];
  visible(chapters, f).forEach((ch, i) => {
    toc.push(`<li><a href="#k${i}">${escapeHtml(ch.title)}</a></li>`);
    const vl = versionLine(ch, F);
    body.push(`<section class="chapter" id="k${i}"><h2>${escapeHtml(ch.title)}</h2>${vl ? `<p class="meta">${escapeHtml(vl)}</p>` : ''}`);
    for (const s of ch.sections) {
      body.push(`<h3>${escapeHtml(s.title)}</h3>`);
      for (const b of s.blocks) {
        const badges = badgeLine(b);
        body.push(`<div class="block kind-${escapeHtml(b.kind)}">`);
        if (badges) body.push(`<p class="badges">${escapeHtml(badges)}</p>`);
        if (kindLabel(b.kind, F) && b.kind !== 'xref') body.push(`<p class="label">${escapeHtml(kindLabel(b.kind, F)!)}</p>`);
        body.push(markdownToHtml(b.text, images), '</div>');
      }
    }
    body.push('</section>');
  });
  // Verzeichnisse im Anhang (Varianten-Export)
  for (const a of extras.appendices ? appendixHtmlSections(extras.appendices, images) : []) {
    const at = APPENDIX_KEY[a.id] ? String(F[APPENDIX_KEY[a.id]]) : a.title;
    toc.push(`<li><a href="#${a.id}">${escapeHtml(at)}</a></li>`);
    body.push(`<section class="chapter" id="${a.id}"><h2>${escapeHtml(at)}</h2>${a.html}</section>`);
  }
  return `<!doctype html>
<html lang="${htmlLang(extras.language ?? 'de')}"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
body{font:15px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0f172a;max-width:860px;margin:0 auto;padding:24px}
h1{font-size:26px}h2{font-size:21px;border-bottom:2px solid ${l.primaryColor};color:${l.primaryColor};padding-bottom:4px;margin-top:36px}h3{font-size:16px;margin:20px 0 6px}
.cover{min-height:60vh;display:flex;flex-direction:column;justify-content:center;border-left:8px solid ${l.primaryColor};padding-left:24px}.cover .logo{max-width:220px;border:0}
.company{font-weight:700;color:${l.primaryColor};font-size:18px;margin:16px 0 0}.subtitle{font-size:18px;margin:4px 0}.confidential{color:#b91c1c;font-weight:700;margin-top:24px}
.running{color:#5b6474;font-size:12px;text-align:right}
.meta,.filter{color:#5b6474;font-size:13px}.badges{font-size:12px;color:#334155;margin:0 0 4px}
.block{margin:6px 0 10px}.kind-note,.kind-tip{background:#eaf1fd;border-left:4px solid ${l.primaryColor};padding:6px 10px}
.kind-warning{background:#fdecec;border-left:4px solid #b91c1c;padding:6px 10px}.label{font-weight:600;margin:0 0 2px}
table{border-collapse:collapse}td,th{border:1px solid #cbd5e1;padding:4px 8px}pre{background:#f3f4f6;padding:8px;white-space:pre-wrap}
img{max-width:100%;height:auto;border:1px solid #e2e8f0}
nav ol{columns:2}
@media print{body{max-width:none;padding:0}.chapter{break-before:page}a{color:inherit;text-decoration:none}nav{break-after:page}.cover{break-after:page;min-height:90vh}}
</style></head><body>
${l.headerText ? `<p class="running">${escapeHtml(l.headerText)}</p>` : ''}
${cover || `<h1>${escapeHtml(title)}</h1>
<p class="filter">${F.exportedOn} ${now().slice(0, 10)} · ${escapeHtml(filterDescription(f, F))}</p>`}
<nav><h2>${escapeHtml(F.contents)}</h2><ol>${toc.join('')}</ol></nav>
${body.join('\n')}
${l.footerText ? `<footer class="running">${escapeHtml(l.footerText)}</footer>` : ''}
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
  const F = frameTexts(extras.language);
  const title = extras.title ?? F.manualTitle;
  const l = extras.layout ?? NO_LAYOUT;
  const content: unknown[] = l.cover ? [
    // Titelseite (ADR-038)
    ...(l.logo ? [{ image: dataUri(l.logo), fit: [200, 90], margin: [0, 80, 0, 40] }] : [{ text: '', margin: [0, 160, 0, 0] }]),
    ...(l.companyName ? [{ text: l.companyName, fontSize: 14, bold: true, color: l.primaryColor, margin: [0, 0, 0, 8] }] : []),
    { text: title, style: 'title' },
    ...(l.coverSubtitle ? [{ text: l.coverSubtitle, fontSize: 14, margin: [0, 0, 0, 12] }] : []),
    { text: `${F.asOf} ${now().slice(0, 10)} · ${filterDescription(f, F)}`, style: 'meta' },
    ...(l.confidentiality ? [{ text: l.confidentiality, bold: true, color: '#b91c1c', margin: [0, 40, 0, 0] }] : []),
    { text: '', pageBreak: 'after' },
  ] : [
    { text: title, style: 'title' },
    { text: `${F.exportedOn} ${now().slice(0, 10)} · ${filterDescription(f, F)}`, style: 'meta', margin: [0, 0, 0, 16] },
  ];
  visible(chapters, f).forEach((ch, i) => {
    content.push({ text: ch.title, style: 'chapter', tocItem: true, ...(i > 0 ? { pageBreak: 'before' } : {}) });
    if (versionLine(ch, F)) content.push({ text: versionLine(ch, F), style: 'meta', margin: [0, 0, 0, 8] });
    for (const s of ch.sections) {
      content.push({ text: s.title, style: 'section' });
      for (const b of s.blocks) {
        const badges = pdfBadges(b);
        const inner: unknown[] = [];
        if (badges) inner.push({ text: badges, style: 'badges' });
        if (kindLabel(b.kind, F) && b.kind !== 'xref') inner.push({ text: kindLabel(b.kind, F), bold: true });
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
    header: (page: number) => (l.cover && page === 1) || !(l.headerText || l.companyName) ? null
      : { text: l.headerText ?? [l.companyName, title].filter(Boolean).join(' · '), alignment: 'right', fontSize: 8, color: '#64748b', margin: [48, 24, 48, 0] },
    footer: (page: number, pages: number) => (l.cover && page === 1 ? null
      : { text: `${l.footerText ? `${l.footerText} · ` : ''}${pageLine(F, page, pages)}`, alignment: 'center', fontSize: 8, color: '#64748b', margin: [0, 20, 0, 0] }),
    styles: {
      title: { fontSize: 22, bold: true, margin: [0, 0, 0, 4] },
      meta: { fontSize: 9, color: '#5b6474' },
      chapter: { fontSize: 17, bold: true, color: l.primaryColor, margin: [0, 0, 0, 2] },
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

/** Word-Export (ADR-038) aus den sichtbaren Absätzen */
export async function renderDocxExport(chapters: ExportChapter[], f: ExportFilter, media: Media = new Map(), extras: ExportExtras = {}): Promise<Buffer> {
  const F = frameTexts(extras.language);
  return renderDocx(visible(chapters, f).map((ch) => ({
    title: ch.title, meta: versionLine(ch, F),
    sections: ch.sections.map((s) => ({
      title: s.title,
      blocks: s.blocks.map((b: any) => ({ kind: b.kind, text: b.text, badges: pdfBadges(b), label: kindLabel(b.kind, F) && b.kind !== 'xref' ? kindLabel(b.kind, F)! : null })),
    })),
  })), { title: extras.title ?? F.manualTitle, filterLine: filterDescription(f, F), media, layout: extras.layout ?? NO_LAYOUT, appendices: extras.appendices, frame: F });
}

/** Ohne Verzeichnisse: nur die Historie abgelöster Funktionen (ADR-096), sofern vorhanden */
async function historyOnly(ctx: Ctx): Promise<Appendices | null> {
  const history = await historyAppendix(ctx);
  return history.length ? { abbreviations: [], glossary: [], images: [], faq: [], history } : null;
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
      ? await ctx.db.all("SELECT DISTINCT chapter_id, c.position FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND c.outline_family_id = ? AND c.outline_node_key IN (SELECT node_key FROM outline_nodes WHERE outline_id = ? AND level = 1) AND v.status = 'approved' ORDER BY c.position", ctx.projectId, outline.family_id, outline.id)
      // abgelöste Kapitel (Historie, ADR-096) gehören nicht mehr ins Handbuch
      : await ctx.db.all("SELECT DISTINCT chapter_id FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND c.outline_family_id IS NULL AND c.history_at IS NULL AND v.status = 'approved'", ctx.projectId)
    ).map((r) => r.chapter_id as string);

  const blockers: { chapterId: string; checks: unknown }[] = [];
  const skipped: { chapterId: string; reason: string }[] = [];
  const asOf = (typeof input.asOf === 'string' ? input.asOf.trim().slice(0, 40) : '') || input.release || null;
  const future: { chapterId: string; title: string; validFrom: string }[] = [];
  let chapters: any[] = [];
  for (const cid of chapterIds) {
    const chapter = await ctx.db.get('SELECT id, title, position, valid_from FROM chapters WHERE id = ?', cid);
    if (!chapter) throw notFound(`Kapitel ${cid}`);
    // Zukunfts-Inhalt (W-09): eingebaut, aber erst ab einem späteren Release veröffentlicht
    if (isFutureContent(chapter.valid_from, asOf)) {
      future.push({ chapterId: cid, title: chapter.title, validFrom: chapter.valid_from });
      continue;
    }
    const gate = await gateForChapter(ctx, cid, 'export');
    if (!gate.passed) blockers.push({ chapterId: cid, checks: gate.checks.filter((c) => !c.passed) });
    const v = await ctx.db.get("SELECT id FROM generated_chapter_versions WHERE chapter_id = ? AND status = 'approved'", cid);
    if (!v) {
      skipped.push({ chapterId: cid, reason: `Kapitel „${chapter.title}“ hat keine freigegebene Version.` });
      continue;
    }
    chapters.push({ ...(await getChapterVersion(ctx, v.id)), position: chapter.position, validFrom: chapter.valid_from ?? null });
  }
  if (blockers.length) throw conflict('Export blockiert: offene Blocker- oder Datenschutzbefunde.', { blockers });
  chapters.sort((a, b) => a.position - b.position);
  const profile = input.profile ?? 'full';
  if (!(EXPORT_PROFILES as readonly string[]).includes(profile)) throw badRequest(`profile muss eines von ${EXPORT_PROFILES.join(', ')} sein.`);

  const vf = outline ? variantFilter(outline) : null;
  const filter: ExportFilter = {
    roles: input.roles ?? (vf?.roles.length ? vf.roles : undefined), divisions: input.divisions ?? (vf?.divisions.length ? vf.divisions : undefined),
    market: input.market ?? vf?.market ?? null, release: input.release ?? null,
    ...(vf ? { blueprint: vf.blueprint, markets: vf.markets } : {}),
  };
  // Übergänge nur im vollständigen Handbuch; gepflegte immer, automatische mit transitions: true
  const next = profile === 'full' && input.transitions !== false ? await transitionsFor(ctx, chapters, input.transitions === true) : undefined;
  const raw = chapters;
  chapters = shapeChapters(raw, filter, { profile, reading: input.reading, next });
  // Varianten einer Maske (ADR-093, F-22): passende Fassung je Rolle, Sparte und Markt; das Handbuch ist deutsch
  chapters = await applyVariants(ctx, chapters, { language: 'de', roles: filter.roles, divisions: filter.divisions, market: filter.market });
  const baseTitle = outline ? outline.name : profile === 'full' ? undefined : 'oneSCM Benutzerhandbuch';
  const extras: ExportExtras = {
    title: baseTitle && profile !== 'full' ? `${baseTitle} – ${PROFILE_LABEL[profile]}` : baseTitle,
    reading: !!input.reading,
    layout: format === 'pdf' || format === 'html' || format === 'docx' ? await resolveLayout(ctx) : undefined,
    appendices: (input.appendices ?? !!outline) ? await appendicesFor(ctx, outline, visible(raw, filter)) : await historyOnly(ctx),
  };
  // Bilder der sichtbaren Absätze (ADR-029) – eingebettet, damit die Datei eigenständig bleibt
  const media = format === 'json' ? new Map() : await loadMedia(ctx, visible(chapters, filter).flatMap((ch) => ch.sections.flatMap((s) => s.blocks.map((b: any) => b.text as string))));
  let data: Buffer;
  let preview: string | null;
  if (format === 'pdf') {
    data = await renderPdfExport(chapters, filter, media, extras);
    preview = null;
  } else if (format === 'docx') {
    data = await renderDocxExport(chapters, filter, media, extras);
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
  const suffix = (profile === 'full' ? '' : `-${profile}`) + (input.reading ? '-lesefassung' : '');
  const fileName = `onescm-handbuch${suffix}-${now().slice(0, 10)}.${format}`;
  await ctx.db.run(
    'INSERT INTO exports (id, project_id, params, status, format, storage_key, file_name, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    id, ctx.projectId, json({ ...input, skipped, future }), 'completed', format, key, fileName, actor, now(),
  );
  await audit(ctx, actor, 'export.created', 'export', id, { ...input, chapters: chapters.length, skipped, future: future.length });
  return { id, status: 'completed', format, fileName, chapters: chapters.length, skipped, asOf, future, downloadUrl: `/api/v1/exports/${id}/download`, preview, byteSize: data.length };
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

