// Firmen-Layout (ADR-038): Titelseite, Logo, Hausfarbe, Kopf- und Fußzeile, Vertraulichkeitshinweis, Word-Formatvorlagen.
// Gilt je Projekt für PDF-, HTML- und Word-Export sowie die Online-Hilfe.
import JSZip from 'jszip';
import { audit, type Ctx, type User } from '../context.js';
import { json, now, parseJson } from '../db.js';
import { sha256 } from '../domain/similarity.js';
import { badRequest, notFound } from '../problem.js';
import { getMedia, type MediaFile } from './media.js';

export interface DocxTemplate {
  name: string;
  key: string;
  uploadedAt: string;
  /** Formatvorlagen-IDs der Vorlage für Titel und Überschriften (auch in lokalisierten Vorlagen, z. B. „berschrift1“) */
  styles: Record<'title' | 'heading1' | 'heading2' | 'heading3', string | null>;
}

export interface Layout {
  companyName: string | null;
  primaryColor: string;
  logoSha: string | null;
  cover: boolean;
  coverSubtitle: string | null;
  headerText: string | null;
  footerText: string | null;
  confidentiality: string | null;
  docxTemplate: DocxTemplate | null;
}

export const DEFAULT_LAYOUT: Layout = {
  companyName: null, primaryColor: '#1d63d8', logoSha: null, cover: false, coverSubtitle: null, headerText: null, footerText: null, confidentiality: null, docxTemplate: null,
};

/** Relative Leuchtdichte (WCAG 2.x) */
function luminance(hex: string) {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export const contrastToWhite = (hex: string) => 1.05 / (luminance(hex) + 0.05);

export async function getLayout(ctx: Ctx): Promise<Layout> {
  const r = await ctx.db.get<{ layout: string | null }>('SELECT layout FROM projects WHERE id = ?', ctx.projectId);
  return { ...DEFAULT_LAYOUT, ...parseJson<Partial<Layout>>(r?.layout, {}) };
}

const text = (v: unknown, max: number) => (v === null || v === undefined ? null : String(v).replace(/\s+/g, ' ').trim().slice(0, max) || null);

/** Layout ändern (Administration). Hausfarbe braucht Kontrast ≥ 4,5 : 1 zu Weiß (weiße Schrift in Kopfzeilen, farbige Überschriften). */
export async function updateLayout(ctx: Ctx, input: Partial<Layout>, user: User) {
  const cur = await getLayout(ctx);
  const next: Layout = { ...cur };
  if (input.companyName !== undefined) next.companyName = text(input.companyName, 120);
  if (input.coverSubtitle !== undefined) next.coverSubtitle = text(input.coverSubtitle, 200);
  if (input.headerText !== undefined) next.headerText = text(input.headerText, 160);
  if (input.footerText !== undefined) next.footerText = text(input.footerText, 160);
  if (input.confidentiality !== undefined) next.confidentiality = text(input.confidentiality, 200);
  if (input.cover !== undefined) {
    if (typeof input.cover !== 'boolean') throw badRequest('cover muss true oder false sein.');
    next.cover = input.cover;
  }
  if (input.primaryColor !== undefined) {
    const c = String(input.primaryColor).trim().toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(c)) throw badRequest('primaryColor im Format #rrggbb.');
    const ratio = contrastToWhite(c);
    if (ratio < 4.5) throw badRequest(`Hausfarbe ${c} hat zu wenig Kontrast zu Weiß (${ratio.toFixed(2)} : 1, nötig 4,5 : 1) – bitte eine dunklere Farbe wählen.`);
    next.primaryColor = c;
  }
  if (input.logoSha !== undefined) {
    if (input.logoSha === null || input.logoSha === '') next.logoSha = null;
    else {
      const m = await getMedia(ctx, String(input.logoSha)).catch(() => null);
      if (!m) throw badRequest('logoSha: Bild nicht gefunden (zuerst unter Bilder hochladen).');
      if (m.mime !== 'image/png' && m.mime !== 'image/jpeg') throw badRequest('Logo muss PNG oder JPEG sein (für PDF und Word).');
      next.logoSha = m.sha;
    }
  }
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE projects SET layout = ? WHERE id = ?', json(next), ctx.projectId);
    await audit(ctx, user.id, 'layout.updated', 'project', ctx.projectId, { ...next, docxTemplate: next.docxTemplate?.name ?? null });
  });
  return next;
}

/** Built-in-Name → Formatvorlagen-ID (w:name ist in allen Sprachen englisch, die ID ist lokalisiert) */
export function styleIds(stylesXml: string): DocxTemplate['styles'] {
  const find = (name: string) => {
    const re = /<w:style\b[^>]*w:styleId="([^"]+)"[^>]*>([\s\S]*?)<\/w:style>/g;
    for (const m of stylesXml.matchAll(re)) if (new RegExp(`<w:name\\s+w:val="${name}"`, 'i').test(m[2])) return m[1];
    return null;
  };
  return { title: find('Title'), heading1: find('heading 1'), heading2: find('heading 2'), heading3: find('heading 3') };
}

/** Word-Vorlage (.dotx/.docx) hochladen: übernommen werden nur die Formatvorlagen (word/styles.xml) */
export async function uploadDocxTemplate(ctx: Ctx, fileName: string, data: Buffer, user: User) {
  if (!/\.(dotx|docx)$/i.test(fileName)) throw badRequest('Erlaubt sind Word-Vorlagen (.dotx) oder Dokumente (.docx).');
  let styles: string | undefined;
  try {
    styles = await (await JSZip.loadAsync(data)).file('word/styles.xml')?.async('string');
  } catch {
    throw badRequest('Keine gültige Word-Datei.');
  }
  if (!styles || !/<w:styles\b/.test(styles)) throw badRequest('Die Datei enthält keine Formatvorlagen (word/styles.xml).');
  if (styles.length > 2_000_000) throw badRequest('Formatvorlagen zu groß.');
  const key = `layouts/${ctx.projectId}/styles-${sha256(Buffer.from(styles))}.xml`;
  await ctx.store.put(key, Buffer.from(styles, 'utf8'));
  const cur = await getLayout(ctx);
  const tpl: DocxTemplate = { name: fileName.slice(0, 200), key, uploadedAt: now(), styles: styleIds(styles) };
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE projects SET layout = ? WHERE id = ?', json({ ...cur, docxTemplate: tpl }), ctx.projectId);
    await audit(ctx, user.id, 'layout.docx_template_uploaded', 'project', ctx.projectId, { name: tpl.name, styles: tpl.styles });
  });
  return getLayout(ctx);
}

export async function deleteDocxTemplate(ctx: Ctx, user: User) {
  const cur = await getLayout(ctx);
  if (!cur.docxTemplate) throw notFound('Word-Vorlage');
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE projects SET layout = ? WHERE id = ?', json({ ...cur, docxTemplate: null }), ctx.projectId);
    await audit(ctx, user.id, 'layout.docx_template_deleted', 'project', ctx.projectId, { name: cur.docxTemplate!.name });
  });
  return getLayout(ctx);
}

/** Layout mit geladenem Logo und Formatvorlagen für die Ausgabe */
export interface ResolvedLayout extends Layout {
  logo: MediaFile | null;
  stylesXml: string | null;
}
export async function resolveLayout(ctx: Ctx): Promise<ResolvedLayout> {
  const l = await getLayout(ctx);
  const logo = l.logoSha ? await getMedia(ctx, l.logoSha).catch(() => null) : null;
  const stylesXml = l.docxTemplate ? await ctx.store.get(l.docxTemplate.key).then((b) => b.toString('utf8')).catch(() => null) : null;
  return { ...l, logo, stylesXml };
}
