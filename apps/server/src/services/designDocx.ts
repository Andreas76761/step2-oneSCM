// Designvorlagen als Word-Dokument (ADR-115): Quick Reference Guide (A4 quer, zwei Spalten, Karten mit Rahmen) und
// Handbuch-Kapitel (A4 hoch, Kopfzeile mit Dokumentart und Seitenzahl, Kennzahlen, nummerierte Abschnitte, Hinweisboxen) –
// mit denselben Inhalten wie HTML und PDF (domain/designs.ts) und der Anpassung der Vorlage (ADR-114).
// Echte Formatvorlagen (Überschrift 1/2) für Navigation und Weiterbearbeitung; Icons als SVG mit PNG-Ersatz.
import {
  AlignmentType, BorderStyle, Document, Footer, Header, ImageRun, LevelFormat, Packer, PageBreak, PageNumber, PageOrientation, Paragraph, SectionType,
  ShadingType, Tab, Table, TableCell, TableLayoutType, TableRow, TabStopPosition, TabStopType, TextRun, VerticalAlign, WidthType, type IBorderOptions, type ParagraphChild,
} from 'docx';
import type { DesignIcon } from '../domain/designIcons.js';
import { iconImage } from './designIconRaster.js';
import {
  BOX, cardTitle, chapterFacts, DEFAULT_THEMES, fachdokuFooter, fachdokuLabel, hasInteractiveLinks, processOverview, QR_ICON,
  type Design, type DesignBlock, type DesignChapter, type DesignOptions, type DesignTheme,
} from '../domain/designs.js';
import { markdownToDocx, newListState, type ListState } from './docx.js';
import type { MediaFile } from './media.js';

export interface DesignDocxOptions extends Omit<DesignOptions, 'md' | 'logo'> {
  media: Map<string, MediaFile>;
  logo?: MediaFile | null;
  /** intern: Zählung der nummerierten Listen im Dokument */
  lists?: ListState;
}

const FONT: Record<DesignTheme['headingFont'], string> = { serif: 'Georgia', sans: 'Segoe UI' };
const hex = (c: string) => c.replace('#', '').toUpperCase();
/** Farbe mischen (wie color-mix im HTML): Anteil von a, Rest b */
function mix(a: string, b: string, share: number) {
  const p = (c: string, i: number) => parseInt(c.slice(1 + i * 2, 3 + i * 2), 16);
  return [0, 1, 2].map((i) => Math.round(p(a, i) * share + p(b, i) * (1 - share)).toString(16).padStart(2, '0')).join('').toUpperCase();
}
const NONE: IBorderOptions = { style: BorderStyle.NONE, size: 0, color: 'auto' };
const NO_BORDERS = { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE };
const line = (color: string, size = 8): IBorderOptions => ({ style: BorderStyle.SINGLE, size, color });

async function icon(name: DesignIcon, color: string, px = 14) {
  const d = await iconImage(name, color);
  return new ImageRun({ type: 'svg', data: d.svg, fallback: { type: 'png', data: d.png }, transformation: { width: px, height: px }, altText: { name: '', description: '', title: '' } });
}

function logoRun(logo: MediaFile, maxH: number) {
  const type = logo.mime === 'image/png' ? 'png' : logo.mime === 'image/jpeg' ? 'jpg' : null;
  if (!type) return null;
  const w0 = logo.width ?? maxH * 3;
  const h0 = logo.height ?? maxH;
  const scale = Math.min(maxH / h0, (maxH * 3) / w0);
  return new ImageRun({ type, data: logo.data, transformation: { width: Math.round(w0 * scale), height: Math.round(h0 * scale) }, altText: { name: 'Logo', description: 'Logo', title: 'Logo' } });
}

/** Marke wie im HTML: Logo oder neutrales Buchzeichen, Name, Zusatz kursiv */
async function brandParagraphs(o: DesignDocxOptions, t: DesignTheme, sizes: { name: number; mark: number }) {
  const logo = o.logo ? logoRun(o.logo, sizes.mark) : null;
  const mark: ParagraphChild = logo ?? (await icon('book-open', '#4b5563', sizes.mark));
  return [
    new Paragraph({ alignment: t.logo === 'left' ? AlignmentType.LEFT : AlignmentType.RIGHT, children: [mark, new TextRun({ text: `  ${o.brand || 'oneSCM'}`, font: FONT[t.headingFont], size: sizes.name, color: '374151' })] }),
    ...(o.productLine ? [new Paragraph({ alignment: t.logo === 'left' ? AlignmentType.LEFT : AlignmentType.RIGHT, children: [new TextRun({ text: o.productLine, italics: true, font: FONT[t.headingFont], size: sizes.name - 2, color: hex(t.primary) })] })] : []),
  ];
}

/** Titelzeile: Titel und Marke nebeneinander (Logo rechts oder links), ohne Logo nur der Titel */
async function titleRow(o: DesignDocxOptions, t: DesignTheme, titleParas: Paragraph[], sizes: { name: number; mark: number }) {
  if (t.logo === 'none') return titleParas;
  const brand = new TableCell({ children: await brandParagraphs(o, t, sizes), width: { size: 20, type: WidthType.PERCENTAGE }, verticalAlign: VerticalAlign.TOP, borders: NO_BORDERS });
  const title = new TableCell({ children: titleParas, width: { size: 80, type: WidthType.PERCENTAGE }, borders: NO_BORDERS });
  return [new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: NO_BORDERS, rows: [new TableRow({ children: t.logo === 'left' ? [brand, title] : [title, brand] })] })];
}

const md = (o: DesignDocxOptions, text: string, maxWidth: number) => markdownToDocx(text, o.media, '#1d63d8', { maxWidth, lists: o.lists, imageBreak: true });
const box = (children: (Paragraph | Table)[], borders: Record<'top' | 'bottom' | 'left' | 'right', IBorderOptions>, fill?: string) => new Table({
  width: { size: 100, type: WidthType.PERCENTAGE }, borders: { ...NO_BORDERS, ...borders },
  rows: [new TableRow({ cantSplit: false, children: [new TableCell({ children: children.length ? children : [new Paragraph('')], margins: { top: 100, bottom: 100, left: 160, right: 160 }, ...(fill ? { shading: { type: ShadingType.CLEAR, fill, color: 'auto' } } : {}) })] })],
});
const gap = (after = 120) => new Paragraph({ spacing: { after }, children: [] });

// ---------------------------------------------------------------- Quick Reference Guide

async function qrBlock(b: DesignBlock, o: DesignDocxOptions, t: DesignTheme): Promise<(Paragraph | Table)[]> {
  const W = 240; // px, Bildbreite in einer Spalte
  if (b.kind === 'warning') {
    // Warnbox: Icon links, Text rechts, Rahmen und Fläche aus der Warnfarbe
    const fill = mix(t.warn, '#ffffff', 0.06);
    const cell = (children: (Paragraph | Table)[], w: number) => new TableCell({ children, width: { size: w, type: WidthType.DXA }, borders: NO_BORDERS, margins: { top: 80, bottom: 80, left: 100, right: 100 }, shading: { type: ShadingType.CLEAR, fill, color: 'auto' } });
    const edge = line(mix(t.warn, '#ffffff', 0.6), 12);
    return [new Table({
      width: { size: 6900, type: WidthType.DXA }, columnWidths: [620, 6280], layout: TableLayoutType.FIXED,
      borders: { ...NO_BORDERS, top: edge, bottom: edge, left: edge, right: edge },
      rows: [new TableRow({ children: [cell([new Paragraph({ children: [await icon('circle-alert', t.warn, 22)] })], 620), cell(md(o, b.text, W), 6280)] })],
    }), gap(80)];
  }
  if (b.kind === 'note') return md(o, `**Hinweis**: ${b.text}`, W);
  if (b.kind === 'xref') return md(o, `**Siehe auch**: ${b.text}`, W);
  if (b.kind === 'tip') return [box(md(o, `**Tipp**: ${b.text}`, W), { left: line(hex(t.accent), 18), top: NONE, bottom: NONE, right: NONE }), gap(80)];
  return md(o, b.text, W);
}

async function card(title: string, ic: DesignIcon, content: (Paragraph | Table)[], t: DesignTheme) {
  const head = new Paragraph({ keepNext: true, spacing: { after: 100 }, children: [await icon(ic, t.primary, 16), new TextRun({ text: `  ${title}`, font: FONT[t.headingFont], size: 26, color: '1B1B1B' })] });
  const border = line(hex(t.accent), 12);
  return [box([head, ...content], { top: border, bottom: border, left: border, right: border }), gap(200)];
}

async function quickRefChildren(chapters: DesignChapter[], o: DesignDocxOptions, t: DesignTheme) {
  const head = await titleRow(o, t, [new Paragraph({ children: [new TextRun({ text: o.title, font: FONT[t.headingFont], size: 50, color: '1B1B1B' })] })], { name: 30, mark: 34 });
  const intro: (Paragraph | Table)[] = [...head];
  if (hasInteractiveLinks(chapters, o)) intro.push(new Paragraph({ spacing: { before: 80, after: 160 }, children: [await icon('mouse-pointer-click', t.primary, 14), new TextRun({ text: '  Dieses Dokument ist interaktiv – enthaltene Links können direkt geöffnet werden.', color: hex(t.primary), size: 20 })] }));

  const body: (Paragraph | Table)[] = [];
  const ov = processOverview(chapters);
  if (ov.length) {
    body.push(new Paragraph({ keepNext: true, spacing: { after: 80 }, children: [await icon('layers', t.primary, 16), new TextRun({ text: '  Die Prozesse im Überblick', font: FONT[t.headingFont], size: 26 })] }));
    for (const x of ov) {
      body.push(new Paragraph({ keepNext: true, spacing: { before: 60 }, children: [new TextRun({ text: x.title, font: FONT[t.headingFont], size: 21, color: hex(t.warn) })] }));
      for (const s of x.steps) body.push(new Paragraph({ bullet: { level: 0 }, children: [new TextRun({ text: s, size: 19 })] }));
    }
    body.push(gap(200));
  }
  for (const [i, c] of chapters.entries()) {
    for (const s of c.sections) {
      const content: (Paragraph | Table)[] = [];
      for (const b of s.blocks) content.push(...(await qrBlock(b, o, t)));
      body.push(...(await card(cardTitle(chapters, i, s), QR_ICON[s.code] ?? 'file-text', content, t)));
    }
  }
  if (o.links) body.push(...(await card('Wichtige Links und Ansprechpartner', 'link', md(o, o.links, 300), t)));
  if (o.faq?.length) {
    const faq: (Paragraph | Table)[] = [];
    for (const f of o.faq) {
      faq.push(new Paragraph({ spacing: { before: 80 }, children: [await icon('circle-question-mark', t.primary, 12), new TextRun({ text: `  ${f.question}`, bold: true })] }));
      faq.push(...md(o, f.answer, 300));
    }
    body.push(...(await card('Häufig gestellte Fragen und Antworten', 'circle-question-mark', faq, t)));
  }
  return { intro, body };
}

// ---------------------------------------------------------------- Handbuch-Kapitel

const FD_BOX: Record<string, (t: DesignTheme) => { border: string; text?: string }> = {
  info: (t) => ({ border: hex(t.accent) }),
  tip: () => ({ border: 'C76B00', text: '8A4B00' }),
  warn: (t) => ({ border: hex(t.warn), text: mix(t.warn, '#000000', 0.7) }),
  xref: (t) => ({ border: hex(t.primary) }),
};

async function fdBlock(b: DesignBlock, o: DesignDocxOptions, t: DesignTheme): Promise<(Paragraph | Table)[]> {
  const kind = BOX[b.kind];
  if (!kind) return md(o, b.text, 600);
  const c = FD_BOX[kind.cls](t);
  const label = new Paragraph({ spacing: { after: 40 }, children: [await icon(kind.icon, `#${c.text ?? c.border}`, 13), new TextRun({ text: `  ${kind.label}`, bold: true, color: c.text })] });
  const grey = line('D9DEE5', 4);
  return [box([label, ...md(o, b.text, 560)], { left: line(c.border, 24), top: kind.cls === 'xref' ? grey : NONE, bottom: kind.cls === 'xref' ? grey : NONE, right: kind.cls === 'xref' ? grey : NONE }), gap(120)];
}

async function fachdokuChildren(chapters: DesignChapter[], o: DesignDocxOptions, t: DesignTheme) {
  const out: (Paragraph | Table)[] = [];
  for (const [ci, c] of chapters.entries()) {
    if (ci > 0) out.push(new Paragraph({ children: [new PageBreak()] }));
    const { sub, kpis } = chapterFacts(c);
    const titleParas = [new Paragraph({ heading: 'Heading1', children: [new TextRun({ text: c.title })] }), new Paragraph({ spacing: { after: 160 }, children: [new TextRun({ text: sub, color: '5F6B7A', size: 21 })] })];
    out.push(...(ci === 0 ? await titleRow(o, t, titleParas, { name: 18, mark: 22 }) : titleParas));
    const kpiCells: TableCell[] = [];
    for (const [ic, v, l] of kpis) {
      kpiCells.push(new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE }, margins: { top: 100, bottom: 100, left: 140, right: 100 },
        borders: { top: line(hex(t.primary), 16), bottom: line('D9DEE5', 4), left: line('D9DEE5', 4), right: line('D9DEE5', 4) },
        children: [
          new Paragraph({ children: [await icon(ic, t.accent, 16), new TextRun({ text: `  ${v}`, bold: true, size: 30, color: hex(t.primary), font: FONT[t.headingFont] })] }),
          new Paragraph({ children: [new TextRun({ text: l, size: 16, color: '5F6B7A' })] }),
        ],
      }));
    }
    out.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, borders: { ...NO_BORDERS, insideVertical: line('FFFFFF', 24) }, rows: [new TableRow({ cantSplit: true, children: kpiCells })] }), gap(200));
    for (const [si, s] of c.sections.entries()) {
      out.push(new Paragraph({ heading: 'Heading2', children: [new TextRun({ text: `${si + 1}. ${s.title}` })] }));
      for (const b of s.blocks) out.push(...(await fdBlock(b, o, t)));
    }
  }
  return out;
}

// ---------------------------------------------------------------- Dokument

/** Designvorlage als .docx (ADR-115) */
export async function renderDesignDocx(design: Exclude<Design, 'standard'>, chapters: DesignChapter[], o: DesignDocxOptions): Promise<Buffer> {
  const t = o.theme ?? DEFAULT_THEMES[design];
  o = { ...o, lists: newListState() };
  const styles = {
    default: {
      document: { run: { font: FONT[t.bodyFont], size: design === 'quickref' ? 20 : 19, color: '1F2933' } },
      heading1: { run: { font: FONT[t.headingFont], size: 42, bold: true, color: hex(t.primary) }, paragraph: { spacing: { after: 40 } } },
      heading2: { run: { font: FONT[t.headingFont], size: 26, bold: true, color: hex(t.primary) }, paragraph: { spacing: { before: 280, after: 100 }, keepNext: true, border: { left: { style: BorderStyle.SINGLE, size: 24, color: hex(t.primary), space: 8 } } } },
    },
  };
  const numbering = { config: [{ reference: 'onescm-numbered', levels: [0, 1, 2, 3].map((level) => ({ level, format: LevelFormat.DECIMAL, text: `%${level + 1}.`, alignment: AlignmentType.START, style: { paragraph: { indent: { left: 360 * (level + 1), hanging: 260 } } } })) }] };
  const tabRight = [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }];
  let doc: Document;
  if (design === 'quickref') {
    const { intro, body } = await quickRefChildren(chapters, o, t);
    const page = { size: { width: 11906, height: 16838, orientation: PageOrientation.LANDSCAPE }, margin: { top: 620, bottom: 700, left: 567, right: 567, footer: 300 } };
    const footer = new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: 15704 }],
      children: [
        ...(o.footerText ? [new TextRun({ text: 'Hinweis: ', bold: true, size: 16 }), new TextRun({ text: o.footerText, size: 16 })] : []),
        new TextRun({ children: [new Tab(), `STAND: ${o.asOf} | `, PageNumber.CURRENT, '/', PageNumber.TOTAL_PAGES], size: 16, color: '4B5563', characterSpacing: 30 }),
      ],
    });
    doc = new Document({
      creator: 'oneSCM Handbook Studio', title: o.title, description: 'Quick Reference Guide', styles, numbering,
      sections: [
        { properties: { page }, footers: { default: new Footer({ children: [footer] }) }, children: intro },
        { properties: { page, type: SectionType.CONTINUOUS, column: { count: 2, space: 400, equalWidth: true } }, children: body },
      ],
    });
  } else {
    const label = fachdokuLabel(chapters, o);
    const header = new Paragraph({
      tabStops: tabRight, border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: hex(t.primary), space: 4 } },
      children: [new TextRun({ text: label, bold: true, size: 16, color: hex(t.primary) }), new TextRun({ children: [new Tab(), 'Seite ', PageNumber.CURRENT, ' von ', PageNumber.TOTAL_PAGES], size: 16 })],
    });
    const footer = new Paragraph({
      tabStops: tabRight, border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'D9DEE5', space: 4 } },
      children: [new TextRun({ text: fachdokuFooter(o), size: 15, color: '5F6B7A' }), new TextRun({ children: [new Tab(), o.title], size: 15, color: '5F6B7A' })],
    });
    doc = new Document({
      creator: 'oneSCM Handbook Studio', title: o.title, description: 'Handbuch-Kapitel (Fachdokumentation)', styles, numbering,
      sections: [{
        properties: { page: { margin: { top: 1300, bottom: 1100, left: 907, right: 907, header: 560, footer: 480 } } },
        headers: { default: new Header({ children: [header] }) },
        footers: { default: new Footer({ children: [footer] }) },
        children: await fachdokuChildren(chapters, o, t),
      }],
    });
  }
  return Packer.toBuffer(doc);
}
