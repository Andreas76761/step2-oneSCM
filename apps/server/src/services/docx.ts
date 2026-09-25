// Word-Export (ADR-038): .docx mit Formatvorlagen (Titel, Überschrift 1–3), Inhaltsverzeichnis-Feld, Tabellen, Bildern,
// Kopf- und Fußzeile mit Seitenzahl sowie optionaler Firmenvorlage (Formatvorlagen aus .dotx/.docx).
// Markdown wird über dieselben Tokens wie beim PDF übersetzt; eingebettetes HTML erscheint als Text, Links nur http(s)/mailto.
import {
  AlignmentType, BorderStyle, Document, ExternalHyperlink, Footer, Header, ImageRun, LevelFormat, Packer, PageBreak, PageNumber, Paragraph,
  ShadingType, Table, TableCell, TableOfContents, TableRow, TextRun, WidthType, type IStylesOptions, type ParagraphChild,
} from 'docx';
import { Marked, type Token, type Tokens } from 'marked';
import { now } from '../db.js';
import type { MediaFile } from './media.js';
import type { ResolvedLayout } from './layout.js';
import type { Appendices } from './variants.js';

export interface DocxBlock { kind: string; text: string; badges: string; label: string | null }
export interface DocxChapter { title: string; meta: string; sections: { title: string; blocks: DocxBlock[] }[] }

const SAFE_URL = /^(https?:|mailto:)/i;
const marked = new Marked({ gfm: true, async: false });
const MAX_WIDTH = 600; // px, entspricht etwa der Satzspiegelbreite A4
const IMG_TYPES: Record<string, 'png' | 'jpg' | 'gif'> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif' };

const decode = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const hex = (c: string) => c.replace('#', '').toUpperCase();

interface Ctx { media: Map<string, MediaFile>; color: string }

function image(t: Tokens.Image, c: Ctx): ParagraphChild {
  const sha = /^media:([a-f0-9]{64})$/.exec(t.href)?.[1];
  const m = sha ? c.media.get(sha) : undefined;
  const type = m ? IMG_TYPES[m.mime] : undefined;
  if (!m || !type) return new TextRun({ text: `[Bild: ${t.text || 'ohne Alternativtext'}]`, italics: true });
  const w = m.width ?? MAX_WIDTH;
  const h = m.height ?? Math.round(w * 0.6);
  const scale = Math.min(1, MAX_WIDTH / w);
  return new ImageRun({ type, data: m.data, transformation: { width: Math.round(w * scale), height: Math.round(h * scale) }, altText: { name: t.text || 'Bild', description: t.text || '', title: t.text || '' } });
}

function inline(tokens: Token[] | undefined, c: Ctx, style: { bold?: boolean; italics?: boolean } = {}): ParagraphChild[] {
  const out: ParagraphChild[] = [];
  for (const t of tokens ?? []) {
    switch (t.type) {
      case 'strong': out.push(...inline((t as Tokens.Strong).tokens, c, { ...style, bold: true })); break;
      case 'em': out.push(...inline((t as Tokens.Em).tokens, c, { ...style, italics: true })); break;
      case 'del': out.push(...inline((t as Tokens.Del).tokens, c, style)); break;
      case 'codespan': out.push(new TextRun({ text: decode((t as Tokens.Codespan).text), font: 'Consolas', ...style })); break;
      case 'br': out.push(new TextRun({ text: '', break: 1 })); break;
      case 'image': out.push(image(t as Tokens.Image, c)); break;
      case 'link': {
        const l = t as Tokens.Link;
        const children = inline(l.tokens, c, style).filter((x): x is TextRun => x instanceof TextRun);
        if (SAFE_URL.test(l.href)) out.push(new ExternalHyperlink({ link: l.href, children: children.length ? children : [new TextRun({ text: l.href, style: 'Hyperlink' })] }));
        else out.push(...children);
        break;
      }
      case 'text': {
        const x = t as Tokens.Text;
        if (x.tokens?.length) out.push(...inline(x.tokens, c, style));
        else out.push(new TextRun({ text: decode(x.text), ...style }));
        break;
      }
      default: out.push(new TextRun({ text: decode((t as { raw?: string }).raw ?? ''), ...style }));
    }
  }
  return out;
}

function blocks(tokens: Token[], c: Ctx, indent = 0): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [];
  for (const t of tokens) {
    switch (t.type) {
      case 'paragraph': out.push(new Paragraph({ children: inline((t as Tokens.Paragraph).tokens, c), indent: indent ? { left: indent } : undefined, spacing: { after: 120 } })); break;
      case 'heading': out.push(new Paragraph({ children: inline((t as Tokens.Heading).tokens, c, { bold: true }), spacing: { before: 120, after: 80 } })); break;
      case 'list': {
        const l = t as Tokens.List;
        const level = Math.min(Math.round(indent / 360), 3);
        for (const item of l.items) {
          const [first, ...rest] = item.tokens;
          const head = first && (first.type === 'text' || first.type === 'paragraph') ? inline((first as Tokens.Text).tokens ?? [first], c) : [];
          out.push(new Paragraph({ children: head, ...(l.ordered ? { numbering: { reference: 'onescm-numbered', level } } : { bullet: { level } }) }));
          out.push(...blocks(first && (first.type === 'text' || first.type === 'paragraph') ? rest : item.tokens, c, indent + 360));
        }
        break;
      }
      case 'table': {
        const tb = t as Tokens.Table;
        const cell = (tokens: Token[], header: boolean) => new TableCell({
          children: [new Paragraph({ children: inline(tokens, c, header ? { bold: true } : {}) })],
          ...(header ? { shading: { type: ShadingType.CLEAR, fill: 'E2E8F0', color: 'auto' } } : {}),
        });
        out.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [new TableRow({ tableHeader: true, children: tb.header.map((h) => cell(h.tokens, true)) }), ...tb.rows.map((r) => new TableRow({ children: r.map((x) => cell(x.tokens, false)) }))],
        }));
        out.push(new Paragraph({ text: '' }));
        break;
      }
      case 'code': out.push(...(t as Tokens.Code).text.split('\n').map((line) => new Paragraph({ children: [new TextRun({ text: line, font: 'Consolas', size: 18 })], shading: { type: ShadingType.CLEAR, fill: 'F3F4F6', color: 'auto' } }))); break;
      case 'blockquote': out.push(...blocks((t as Tokens.Blockquote).tokens, c, indent + 360)); break;
      case 'hr': case 'space': break;
      default: out.push(new Paragraph({ children: [new TextRun({ text: decode((t as { raw?: string }).raw ?? '') })] }));
    }
  }
  return out;
}

export function markdownToDocx(md: string, media: Map<string, MediaFile>, color = '#1d63d8') {
  return blocks(marked.lexer(md), { media, color });
}

function appendixDocx(a: Appendices, c: Ctx, heading: (text: string, level: 1 | 2) => Paragraph): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [];
  const row = (cells: string[], header = false) => new TableRow({
    tableHeader: header,
    children: cells.map((x) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: x, bold: header })] })], ...(header ? { shading: { type: ShadingType.CLEAR, fill: 'E2E8F0', color: 'auto' } } : {}) })),
  });
  if (a.abbreviations.length) {
    out.push(heading('Abkürzungsverzeichnis', 1));
    out.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [row(['Abkürzung', 'Bedeutung'], true), ...a.abbreviations.map((x) => row([x.abbreviation, x.description ? `${x.expansion} – ${x.description}` : x.expansion]))] }));
  }
  if (a.glossary.length) {
    out.push(heading('Glossar', 1));
    for (const g of a.glossary) out.push(new Paragraph({ children: [new TextRun({ text: g.term, bold: true }), new TextRun({ text: ` – ${g.definition}` }), ...(g.avoid.length ? [new TextRun({ text: ` (nicht: ${g.avoid.join(', ')})`, italics: true })] : [])], spacing: { after: 80 } }));
  }
  if (a.images.length) {
    out.push(heading('Bildverzeichnis', 1));
    for (const i of a.images) out.push(new Paragraph({ text: `Abb. ${i.number}: ${i.title ?? i.alt ?? 'Bild'} (${i.chapter})` }));
  }
  if (a.faq.length) {
    out.push(heading('Häufige Fragen (FAQ)', 1));
    for (const f of a.faq) {
      out.push(new Paragraph({ children: [new TextRun({ text: f.question, bold: true })], spacing: { before: 120 } }));
      out.push(...blocks(marked.lexer(f.answer), c));
    }
  }
  return out;
}

/**
 * Handbuch als Word-Dokument. Ohne Firmenvorlage gelten eigene Formatvorlagen in der Hausfarbe; mit Vorlage werden deren
 * Formatvorlagen (Titel, Überschrift 1–3) verwendet. Das Inhaltsverzeichnis ist ein Word-Feld, das Word beim Öffnen aktualisiert.
 */
export async function renderDocx(
  chapters: DocxChapter[], opts: { title: string; filterLine: string; media: Map<string, MediaFile>; layout: ResolvedLayout; appendices?: Appendices | null },
): Promise<Buffer> {
  const { layout: l } = opts;
  const color = hex(l.primaryColor);
  const c: Ctx = { media: opts.media, color: l.primaryColor };
  const tpl = l.stylesXml && l.docxTemplate ? l.docxTemplate.styles : null;
  const heading = (text: string, level: 1 | 2 | 3) => {
    const style = tpl?.[`heading${level}`];
    return new Paragraph(style ? { text, style } : { text, heading: (['Heading1', 'Heading2', 'Heading3'] as const)[level - 1] });
  };
  const children: (Paragraph | Table | TableOfContents)[] = [];

  // Titelseite bzw. Titel
  if (l.cover && l.logo && IMG_TYPES[l.logo.mime]) {
    const w = Math.min(220, l.logo.width ?? 220);
    const h = l.logo.width && l.logo.height ? Math.round((l.logo.height / l.logo.width) * w) : Math.round(w / 3);
    children.push(new Paragraph({ children: [new ImageRun({ type: IMG_TYPES[l.logo.mime], data: l.logo.data, transformation: { width: w, height: h }, altText: { name: 'Logo', description: l.companyName ?? 'Logo', title: 'Logo' } })], spacing: { after: 600 } }));
  }
  if (l.cover && l.companyName) children.push(new Paragraph({ children: [new TextRun({ text: l.companyName, color, bold: true, size: 28 })], spacing: { before: l.logo ? 0 : 1600 } }));
  children.push(new Paragraph(tpl?.title ? { text: opts.title, style: tpl.title } : { text: opts.title, heading: 'Title' }));
  if (l.cover && l.coverSubtitle) children.push(new Paragraph({ children: [new TextRun({ text: l.coverSubtitle, size: 28 })], spacing: { after: 240 } }));
  children.push(new Paragraph({ children: [new TextRun({ text: `Stand ${now().slice(0, 10)} · ${opts.filterLine}`, color: '5B6474', size: 18 })] }));
  if (l.cover && l.confidentiality) children.push(new Paragraph({ children: [new TextRun({ text: l.confidentiality, bold: true, color: 'B91C1C' })], spacing: { before: 480 } }));
  if (l.cover) children.push(new Paragraph({ children: [new PageBreak()] }));

  children.push(new Paragraph({ children: [new TextRun({ text: 'Inhalt', bold: true, size: 28, color })], spacing: { after: 120 } }));
  children.push(new TableOfContents('Inhalt', { hyperlink: true, headingStyleRange: '1-2' }));
  children.push(new Paragraph({ children: [new PageBreak()] }));

  chapters.forEach((ch, i) => {
    if (i > 0) children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(heading(ch.title, 1));
    children.push(new Paragraph({ children: [new TextRun({ text: ch.meta, italics: true, color: '5B6474', size: 18 })], spacing: { after: 120 } }));
    for (const s of ch.sections) {
      children.push(heading(s.title, 2));
      for (const b of s.blocks) {
        const box = b.kind === 'warning' ? 'FDECEC' : b.kind === 'note' || b.kind === 'tip' ? 'EAF1FD' : null;
        const inner: (Paragraph | Table)[] = [];
        if (b.badges) inner.push(new Paragraph({ children: [new TextRun({ text: b.badges, size: 16, color: '334155' })] }));
        if (b.label) inner.push(new Paragraph({ children: [new TextRun({ text: b.label, bold: true })] }));
        inner.push(...markdownToDocx(b.text, opts.media, l.primaryColor));
        if (box) {
          children.push(new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: { top: { style: BorderStyle.NONE, size: 0, color: 'auto' }, bottom: { style: BorderStyle.NONE, size: 0, color: 'auto' }, right: { style: BorderStyle.NONE, size: 0, color: 'auto' }, left: { style: BorderStyle.SINGLE, size: 24, color: b.kind === 'warning' ? 'B91C1C' : color }, insideHorizontal: { style: BorderStyle.NONE, size: 0, color: 'auto' }, insideVertical: { style: BorderStyle.NONE, size: 0, color: 'auto' } },
            rows: [new TableRow({ children: [new TableCell({ children: inner.length ? inner : [new Paragraph('')], shading: { type: ShadingType.CLEAR, fill: box, color: 'auto' } })] })],
          }));
          children.push(new Paragraph({ text: '' }));
        } else children.push(...inner);
      }
    }
  });
  if (opts.appendices) {
    const app = appendixDocx(opts.appendices, c, heading);
    if (app.length) children.push(new Paragraph({ children: [new PageBreak()] }), ...app);
  }

  const headerText = l.headerText ?? [l.companyName, opts.title].filter(Boolean).join(' · ');
  const footerRuns = [
    ...(l.footerText ? [new TextRun({ text: `${l.footerText} · ` })] : []),
    new TextRun({ children: ['Seite ', PageNumber.CURRENT, ' von ', PageNumber.TOTAL_PAGES] }),
  ];
  const styles: IStylesOptions = {
    default: {
      title: { run: { size: 48, bold: true, color }, paragraph: { spacing: { after: 120 } } },
      heading1: { run: { size: 34, bold: true, color }, paragraph: { spacing: { before: 240, after: 120 } } },
      heading2: { run: { size: 26, bold: true }, paragraph: { spacing: { before: 200, after: 80 } } },
      heading3: { run: { size: 22, bold: true }, paragraph: { spacing: { before: 160, after: 60 } } },
      document: { run: { font: 'Calibri', size: 21 } },
    },
  };
  const doc = new Document({
    creator: 'oneSCM Handbook Studio', title: opts.title, description: opts.filterLine,
    features: { updateFields: true },
    ...(l.stylesXml ? { externalStyles: l.stylesXml } : { styles }),
    numbering: {
      config: [{
        reference: 'onescm-numbered',
        levels: [0, 1, 2, 3].map((level) => ({ level, format: LevelFormat.DECIMAL, text: `%${level + 1}.`, alignment: AlignmentType.START, style: { paragraph: { indent: { left: 360 * (level + 1), hanging: 260 } } } })),
      }],
    },
    sections: [{
      properties: { titlePage: l.cover, page: { margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
      headers: { default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: headerText, size: 16, color: '5B6474' })], alignment: AlignmentType.RIGHT })] }), ...(l.cover ? { first: new Header({ children: [] }) } : {}) },
      footers: { default: new Footer({ children: [new Paragraph({ children: footerRuns.map((r) => r), alignment: AlignmentType.CENTER })] }), ...(l.cover ? { first: new Footer({ children: [] }) } : {}) },
      children,
    }],
  });
  return Packer.toBuffer(doc);
}
