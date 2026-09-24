// Sichere Darstellung von Markdown für den Export (US-014, §13).
// Eingebettetes HTML aus Quellen wird nie ausgeführt: HTML-Tokens werden als Text escaped,
// Links nur für http(s)/mailto/Anker. Bilder nur aus der eigenen Medienablage (`media:<sha>`, ADR-029) – eingebettet
// oder als Datei der Online-Hilfe; externe Bilder werden durch ihren Alternativtext ersetzt (keine externen Abrufe).
import { Marked, type Token, type Tokens } from 'marked';
import { createRequire } from 'node:module';
import path from 'node:path';

const SAFE_URL = /^(https?:|mailto:|#)/i;

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const decodeEntities = (s: string) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

/** Bildquelle für `media:<sha>` (data:-URI oder relativer Pfad) – null: nur Alternativtext */
export type ImageSource = (sha: string) => string | null;
/** Während eines (synchronen) Aufrufs von markdownToHtml gesetzt */
let imageSource: ImageSource | null = null;

const marked = new Marked({ gfm: true, async: false });
marked.use({
  walkTokens(t) {
    if (t.type === 'link' && !SAFE_URL.test((t as Tokens.Link).href)) (t as Tokens.Link).href = '#';
  },
  renderer: {
    html(token) {
      return escapeHtml(token.text);
    },
    image(token) {
      const sha = /^media:([a-f0-9]{64})$/.exec(token.href)?.[1];
      const src = sha && imageSource ? imageSource(sha) : null;
      if (src) return `<img src="${escapeHtml(src)}" alt="${escapeHtml(token.text)}" loading="lazy">`;
      return escapeHtml(token.text || '[Bild]');
    },
  },
});

/** Markdown → HTML-Fragment ohne ausführbare Inhalte */
export function markdownToHtml(md: string, images?: ImageSource): string {
  imageSource = images ?? null;
  try {
    return marked.parse(md) as string;
  } finally {
    imageSource = null;
  }
}

// ---------------------------------------------------------------- PDF (pdfmake)

type PdfNode = Record<string, unknown> | string;

/** Bilder für die PDF-Ausgabe (pdfmake: nur PNG und JPEG) */
export interface PdfImage {
  mime: string;
  data: Buffer;
  width: number | null;
  height: number | null;
}
let pdfImages: Map<string, PdfImage> | null = null;
const PDF_WIDTH = 499; // A4 abzüglich Seitenränder

function pdfImage(t: Tokens.Image): PdfNode | null {
  const sha = /^media:([a-f0-9]{64})$/.exec(t.href)?.[1];
  const img = sha ? pdfImages?.get(sha) : undefined;
  if (!img || (img.mime !== 'image/png' && img.mime !== 'image/jpeg')) return null;
  const node: Record<string, unknown> = { image: `data:${img.mime};base64,${img.data.toString('base64')}`, margin: [0, 2, 0, 6] };
  // Bildschirmfotos in natürlicher Größe (96 dpi → pt), höchstens Satzspiegelbreite
  if (img.width) node.width = Math.min(PDF_WIDTH, Math.round(img.width * 0.75));
  else node.fit = [PDF_WIDTH, 400];
  return node;
}

function inline(tokens: Token[] | undefined, style: Record<string, unknown> = {}): PdfNode[] {
  const out: PdfNode[] = [];
  for (const t of tokens ?? []) {
    switch (t.type) {
      case 'strong':
        out.push(...inline((t as Tokens.Strong).tokens, { ...style, bold: true }));
        break;
      case 'em':
        out.push(...inline((t as Tokens.Em).tokens, { ...style, italics: true }));
        break;
      case 'del':
        out.push(...inline((t as Tokens.Del).tokens, { ...style, decoration: 'lineThrough' }));
        break;
      case 'codespan':
        out.push({ text: decodeEntities((t as Tokens.Codespan).text), background: '#eef1f5', ...style });
        break;
      case 'link': {
        const l = t as Tokens.Link;
        out.push(...inline(l.tokens, { ...style, color: '#1d4ed8', ...(SAFE_URL.test(l.href) && !l.href.startsWith('#') ? { link: l.href } : {}) }));
        break;
      }
      case 'br':
        out.push('\n');
        break;
      case 'image':
        out.push({ text: (t as Tokens.Image).text || '[Bild]', italics: true, ...style });
        break;
      case 'text': {
        const tt = t as Tokens.Text;
        if (tt.tokens?.length) out.push(...inline(tt.tokens, style));
        else out.push({ text: decodeEntities(tt.text), ...style });
        break;
      }
      default:
        out.push({ text: decodeEntities((t as { raw?: string }).raw ?? ''), ...style });
    }
  }
  return out;
}

export function tokensToPdf(tokens: Token[]): PdfNode[] {
  const out: PdfNode[] = [];
  for (const t of tokens) {
    switch (t.type) {
      case 'heading': {
        const h = t as Tokens.Heading;
        out.push({ text: inline(h.tokens), style: `md_h${Math.min(h.depth, 4)}` });
        break;
      }
      case 'paragraph': {
        // Bilder sind in pdfmake Blockelemente: Absatz an Bildern aufteilen
        let run: Token[] = [];
        const flush = () => {
          if (run.some((x) => x.type !== 'text' || (x as Tokens.Text).text.trim())) out.push({ text: inline(run), margin: [0, 0, 0, 6] });
          run = [];
        };
        for (const x of (t as Tokens.Paragraph).tokens) {
          const img = x.type === 'image' ? pdfImage(x as Tokens.Image) : null;
          if (img) {
            flush();
            out.push(img);
          } else run.push(x);
        }
        flush();
        break;
      }
      case 'text':
        out.push({ text: inline((t as Tokens.Text).tokens ?? [t]), margin: [0, 0, 0, 4] });
        break;
      case 'list': {
        const l = t as Tokens.List;
        const items = l.items.map((i) => ({ stack: tokensToPdf(i.tokens) }));
        out.push(l.ordered ? { ol: items, start: typeof l.start === 'number' ? l.start : 1, margin: [0, 0, 0, 6] } : { ul: items, margin: [0, 0, 0, 6] });
        break;
      }
      case 'table': {
        const tb = t as Tokens.Table;
        out.push({
          table: {
            headerRows: 1,
            widths: tb.header.map(() => '*'),
            body: [tb.header.map((c) => ({ text: inline(c.tokens), bold: true })), ...tb.rows.map((r) => r.map((c) => ({ text: inline(c.tokens) })))],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 8],
        });
        break;
      }
      case 'code':
        out.push({ text: (t as Tokens.Code).text, fontSize: 8, background: '#f3f4f6', preserveLeadingSpaces: true, margin: [0, 0, 0, 6] });
        break;
      case 'blockquote':
        out.push({ stack: tokensToPdf((t as Tokens.Blockquote).tokens), margin: [12, 0, 0, 6], color: '#475569' });
        break;
      case 'hr':
        out.push({ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#cbd5e1' }], margin: [0, 4, 0, 8] });
        break;
      case 'html':
        out.push({ text: (t as Tokens.HTML).text, margin: [0, 0, 0, 6] });
        break;
      case 'space':
        break;
      default:
        out.push({ text: (t as { raw?: string }).raw ?? '', margin: [0, 0, 0, 6] });
    }
  }
  return out;
}

export function markdownToPdf(md: string, images?: Map<string, PdfImage>) {
  pdfImages = images ?? null;
  try {
    return tokensToPdf(marked.lexer(md));
  } finally {
    pdfImages = null;
  }
}

const require = createRequire(import.meta.url);
let pdfmake: any = null;

function pdf() {
  if (pdfmake) return pdfmake;
  pdfmake = require('pdfmake');
  const fontDir = path.join(path.dirname(require.resolve('pdfmake/package.json')), 'fonts', 'Roboto');
  pdfmake.setFonts({
    Roboto: {
      normal: path.join(fontDir, 'Roboto-Regular.ttf'),
      bold: path.join(fontDir, 'Roboto-Medium.ttf'),
      italics: path.join(fontDir, 'Roboto-Italic.ttf'),
      bolditalics: path.join(fontDir, 'Roboto-MediumItalic.ttf'),
    },
  });
  // Keine externen Abrufe, lokal nur die mitgelieferten Schriften
  pdfmake.setUrlAccessPolicy(() => false);
  pdfmake.setLocalAccessPolicy((p: string) => path.resolve(p).startsWith(fontDir));
  return pdfmake;
}

export async function renderPdf(docDefinition: Record<string, unknown>): Promise<Buffer> {
  return Buffer.from(await pdf().createPdf(docDefinition).getBuffer());
}
