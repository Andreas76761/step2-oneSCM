// Designvorlagen (ADR-112): Übersicht und Muster mit fiktiven Inhalten in Marke und Texten des Firmen-Layouts.
import type { Ctx } from '../context.js';
import { DESIGN_INFO, renderDesign, type Design } from '../domain/designs.js';
import { SAMPLE_FACHDOKU, SAMPLE_QUICKREF, SAMPLE_SHA, sampleScreenshot } from '../domain/designSamples.js';
import { notFound } from '../problem.js';
import { dataUri } from './media.js';
import { resolveLayout } from './layout.js';
import { markdownToHtml } from './render.js';

export function listDesignTemplates() {
  return Object.entries(DESIGN_INFO).map(([id, d]) => ({ id, ...d, sampleUrl: `/api/v1/design-templates/${id}/sample` }));
}

/** Muster einer Designvorlage als HTML – fiktive Inhalte, Marke, Logo und Texte aus dem Firmen-Layout des Projekts */
export async function designSample(ctx: Ctx, id: string): Promise<string> {
  if (!(id in DESIGN_INFO)) throw notFound(`Designvorlage ${id}`);
  const design = id as Exclude<Design, 'standard'>;
  const l = await resolveLayout(ctx);
  const shot = sampleScreenshot();
  const md = (text: string) => markdownToHtml(text, (sha) => (sha === SAMPLE_SHA ? shot : null));
  const d = new Date();
  const asOf = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
  const common = { brand: l.companyName, productLine: l.productLine ?? 'Muster', logo: l.logo ? dataUri(l.logo) : null, asOf, md };
  return design === 'quickref'
    ? renderDesign(design, SAMPLE_QUICKREF.chapters, { ...common, title: SAMPLE_QUICKREF.title, footerText: l.footerText ?? SAMPLE_QUICKREF.footer, links: l.quickRefLinks ?? SAMPLE_QUICKREF.links, faq: SAMPLE_QUICKREF.faq })
    : renderDesign(design, SAMPLE_FACHDOKU.chapters, { ...common, title: SAMPLE_FACHDOKU.title, footerText: l.footerText ?? SAMPLE_FACHDOKU.footer, docLabel: l.docLabel ?? SAMPLE_FACHDOKU.docLabel });
}
