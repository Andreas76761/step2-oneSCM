// Designvorlagen (ADR-112): Übersicht und Muster mit fiktiven Inhalten in Marke und Texten des Firmen-Layouts.
// Anpassung je Vorlage (ADR-114): Farben, Schriften, Logo-Position – geprüft, mit Vorschau vor dem Speichern.
import type { Ctx, User } from '../context.js';
import { DEFAULT_THEMES, DESIGN_INFO, normalizeTheme, renderDesign, THEME_CONTRAST, type Design, type DesignTheme } from '../domain/designs.js';
import { SAMPLE_FACHDOKU, SAMPLE_QUICKREF, SAMPLE_SHA, sampleScreenshot } from '../domain/designSamples.js';
import { badRequest, notFound, Problem } from '../problem.js';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { renderDesignDocx } from './designDocx.js';
import { renderDesignPptx } from './designPptx.js';
import { dataUri, type MediaFile } from './media.js';
import { getLayout, resolveLayout, saveDesignTheme, type Layout } from './layout.js';
import { htmlToPdf, pdfBrowserAvailable } from './pdfBrowser.js';
import { markdownToHtml } from './render.js';

type TemplateId = Exclude<Design, 'standard'>;

function templateId(id: string): TemplateId {
  // nur eigene Schlüssel: „constructor“ oder „__proto__“ sind keine Vorlagen
  if (!Object.hasOwn(DESIGN_INFO, id)) throw notFound(`Designvorlage ${id}`);
  return id as TemplateId;
}

/** Wirksame Anpassung einer Vorlage (gespeichert, sonst Standard) */
export const themeOf = (l: Pick<Layout, 'designThemes'>, id: TemplateId): DesignTheme => normalizeTheme(id, l.designThemes?.[id] ?? {}).theme;

/** Anpassung prüfen; Fehler gesammelt als 400 */
function checkedTheme(id: TemplateId, input: unknown): DesignTheme {
  const { theme, issues } = normalizeTheme(id, input && typeof input === 'object' ? (input as Record<string, unknown>) : {});
  if (issues.length) throw badRequest(issues.join(' '), { issues });
  return theme;
}

/** Vorlagen mit Formaten (html, docx und pptx immer, pdf nur mit lokalem Browser, ADR-113, ADR-115) und Anpassung (ADR-114) */
export async function listDesignTemplates(ctx: Ctx) {
  const l = await getLayout(ctx);
  const formats = pdfBrowserAvailable(ctx.config.pdfBrowser) ? ['html', 'pdf', 'docx', 'pptx'] : ['html', 'docx', 'pptx'];
  return (Object.keys(DESIGN_INFO) as TemplateId[]).map((id) => ({
    id, ...DESIGN_INFO[id], formats, sampleUrl: `/api/v1/design-templates/${id}/sample`,
    theme: themeOf(l, id), defaultTheme: DEFAULT_THEMES[id], customized: !!l.designThemes?.[id], minContrast: THEME_CONTRAST,
  }));
}

/** Muster einer Designvorlage als HTML – fiktive Inhalte, Marke, Logo und Texte aus dem Firmen-Layout des Projekts */
export async function designSample(ctx: Ctx, rawId: string, draft?: DesignTheme): Promise<string> {
  const design = templateId(rawId);
  const l = await resolveLayout(ctx);
  const shot = sampleScreenshot();
  const md = (text: string) => markdownToHtml(text, (sha) => (sha === SAMPLE_SHA ? shot : null));
  const d = new Date();
  const asOf = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  const common = { brand: l.companyName, productLine: l.productLine ?? 'Muster', logo: l.logo ? dataUri(l.logo) : null, asOf, md, theme: draft ?? themeOf(l, design) };
  return design === 'quickref'
    ? renderDesign(design, SAMPLE_QUICKREF.chapters, { ...common, title: SAMPLE_QUICKREF.title, footerText: l.footerText ?? SAMPLE_QUICKREF.footer, links: l.quickRefLinks ?? SAMPLE_QUICKREF.links, faq: SAMPLE_QUICKREF.faq })
    : renderDesign(design, SAMPLE_FACHDOKU.chapters, { ...common, title: SAMPLE_FACHDOKU.title, footerText: l.footerText ?? SAMPLE_FACHDOKU.footer, docLabel: l.docLabel ?? SAMPLE_FACHDOKU.docLabel });
}

/** Vorschau mit ungespeicherter Anpassung (ADR-114) */
export const designPreview = (ctx: Ctx, rawId: string, input: unknown) => designSample(ctx, rawId, checkedTheme(templateId(rawId), input));

/** Bilder des Musters für Word: das neutrale Bildschirmfoto als PNG */
export async function sampleMedia(): Promise<Map<string, MediaFile>> {
  const svg = Buffer.from(sampleScreenshot().split(',')[1], 'base64');
  const canvas = createCanvas(480, 270);
  canvas.getContext('2d').drawImage(await loadImage(svg), 0, 0, 480, 270);
  return new Map([[SAMPLE_SHA, { sha: SAMPLE_SHA, mime: 'image/png', data: canvas.toBuffer('image/png'), width: 480, height: 270 }]]);
}

/** Muster als Word-Dokument (ADR-115) bzw. Foliensatz (ADR-116) */
export async function designSampleOffice(ctx: Ctx, rawId: string, format: 'docx' | 'pptx' = 'docx'): Promise<Buffer> {
  const design = templateId(rawId);
  const l = await resolveLayout(ctx);
  const d = new Date();
  const asOf = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  const common = { brand: l.companyName, productLine: l.productLine ?? 'Muster', logo: l.logo, asOf, media: await sampleMedia(), theme: themeOf(l, design) };
  const render = format === 'pptx' ? renderDesignPptx : renderDesignDocx;
  return design === 'quickref'
    ? render(design, SAMPLE_QUICKREF.chapters, { ...common, title: SAMPLE_QUICKREF.title, footerText: l.footerText ?? SAMPLE_QUICKREF.footer, links: l.quickRefLinks ?? SAMPLE_QUICKREF.links, faq: SAMPLE_QUICKREF.faq })
    : render(design, SAMPLE_FACHDOKU.chapters, { ...common, title: SAMPLE_FACHDOKU.title, footerText: l.footerText ?? SAMPLE_FACHDOKU.footer, docLabel: l.docLabel ?? SAMPLE_FACHDOKU.docLabel });
}

/** Muster als PDF (ADR-113) */
export async function designSamplePdf(ctx: Ctx, id: string): Promise<Buffer> {
  // erst prüfen, ob gedruckt werden kann, dann das Muster aufbauen
  if (!pdfBrowserAvailable(ctx.config.pdfBrowser)) throw badRequest('PDF im Design braucht einen lokal installierten Chromium, Chrome oder Edge (PDF_BROWSER_PATH).');
  const html = await designSample(ctx, id);
  return htmlToPdf(ctx.config.pdfBrowser, html).catch((e: Error) => {
    throw new Problem(503, 'Service Unavailable', `PDF im Design konnte nicht erzeugt werden: ${e.message}`);
  });
}

/** Anpassung speichern (Administration) */
export async function updateDesignTheme(ctx: Ctx, rawId: string, input: unknown, user: User) {
  const id = templateId(rawId);
  await saveDesignTheme(ctx, id, checkedTheme(id, input), user);
  return (await listDesignTemplates(ctx)).find((t) => t.id === id)!;
}

/** Auf den Standard der Vorlage zurücksetzen (Administration) */
export async function resetDesignTheme(ctx: Ctx, rawId: string, user: User) {
  const id = templateId(rawId);
  await saveDesignTheme(ctx, id, null, user);
  return (await listDesignTemplates(ctx)).find((t) => t.id === id)!;
}
