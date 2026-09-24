// Umwandlung fremder Formate in Markdown (ADR-022): Confluence-/HTML-Export und Word (.docx).
// Die Originaldatei bleibt im Object-Store erhalten; Analyse und Nachweise beziehen sich auf das erzeugte Markdown.
import JSZip from 'jszip';
import mammoth from 'mammoth';
import TurndownService from 'turndown';

export const CONVERTIBLE: Record<string, 'html' | 'docx'> = { '.html': 'html', '.htm': 'html', '.docx': 'docx' };

export interface Converted {
  markdown: string;
  warnings: string[];
  /** Datei enthält keinen Handbuchinhalt (z. B. Confluence-Übersichtsseite) */
  skip?: string;
}

const decodeEntities = (s: string) =>
  s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));

function turndown() {
  const td = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', codeBlockStyle: 'fenced', emDelimiter: '*', strongDelimiter: '**' });
  // Keine aktiven Inhalte und keine eingebetteten Bilder (Datenschutz, Größe); Alternativtext bleibt als Hinweis erhalten
  td.remove(['script', 'style', 'noscript', 'iframe', 'object', 'embed', 'form', 'button', 'head']);
  td.addRule('image', { filter: 'img', replacement: (_c, node: any) => (node.getAttribute('alt') ? `[Bild: ${node.getAttribute('alt')}]` : '') });
  // Tabellen als Pipe-Tabellen (der Parser erkennt sie als Tabellenblock)
  td.addRule('tableCell', { filter: ['th', 'td'], replacement: (c) => ` ${c.replace(/\n+/g, ' ').replace(/\|/g, '\\|').trim()} |` });
  td.addRule('tableRow', {
    filter: 'tr',
    replacement: (c, node: any) => {
      const row = `|${c}\n`;
      const parent = node.parentNode;
      const isFirst = (parent.nodeName === 'THEAD' || !parent.parentNode?.querySelector?.('thead')) && parent.firstElementChild === node
        && (parent.nodeName !== 'TBODY' || !parent.previousElementSibling);
      return isFirst ? `${row}|${' --- |'.repeat(node.children.length)}\n` : row;
    },
  });
  td.addRule('table', { filter: 'table', replacement: (c) => `\n\n${c.replace(/\n{2,}/g, '\n').trim()}\n\n` });
  td.addRule('tableSection', { filter: ['thead', 'tbody', 'tfoot'], replacement: (c) => c });
  return td;
}

/** Überschriften so verschieben, dass die höchste Ebene `top` wird (Seite = Kapitel, Abschnitte = Unterkapitel). */
function shiftHeadings(html: string, top: number): string {
  const levels = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
  if (!levels.length) return html;
  const delta = top - Math.min(...levels);
  if (!delta) return html;
  return html.replace(/<(\/?)h([1-6])\b/gi, (_m, slash, l) => `<${slash}h${Math.min(6, Math.max(1, Number(l) + delta))}`);
}

function tidy(md: string) {
  const out = md
    .replace(/^(\s*)(\d+\.|-) {2,}/gm, '$1$2 ') // Listenmarker mit einem Leerzeichen
    .replace(/^(#{1,6} .*)$/gm, (h) => h.replace(/(\d)\\\./g, '$1.')); // „# 3\. Lager“ → „# 3. Lager“ (Nummerierung für die Sortierung)
  return `${out.replace(/ /g, ' ').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

/**
 * HTML → Markdown. Confluence-Exporte: Seitentitel („Bereich : Seite“) wird Kapitelüberschrift (H1),
 * Überschriften des Seiteninhalts werden darunter eingeordnet; Brotkrumen, Fußzeile und Anhanglisten entfallen.
 */
export function htmlToMarkdown(html: string, fallbackTitle?: string): Converted {
  const warnings: string[] = [];
  if (/<h2[^>]*>\s*(Available Pages|Verfügbare Seiten)\s*:?\s*<\/h2>/i.test(html)) return { markdown: '', warnings, skip: 'Confluence-Übersichtsseite – übersprungen' };
  const rawTitle = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1];
  let title = rawTitle ? decodeEntities(rawTitle).replace(/\s+/g, ' ').trim() : '';
  if (title.includes(' : ')) title = title.split(' : ').slice(1).join(' : ').trim();
  let body = /<div[^>]+id=["']main-content["'][^>]*>([\s\S]*)/i.exec(html)?.[1] // Confluence
    ?? /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html)?.[1] ?? html;
  body = body
    .replace(/<div[^>]+id=["'](breadcrumb-section|footer|attachments|likes-and-labels-container)["'][\s\S]*?<\/div>/gi, '')
    .replace(/<div[^>]+class=["'][^"']*pageSection group[^"']*["'][\s\S]*$/i, ''); // Confluence: Anhänge und Kommentare am Seitenende
  title ||= fallbackTitle ?? '';
  const hasH1 = /<h1\b/i.test(body);
  if (title) body = `<h1>${title.replace(/</g, '&lt;')}</h1>${shiftHeadings(body, 2)}`;
  else if (!hasH1) warnings.push('Keine Überschrift erster Ebene – Inhalt landet unter „Ohne Kapitel“.');
  const markdown = tidy(turndown().turndown(body));
  if (!markdown.trim() || markdown.trim() === `# ${title}`) warnings.push('Kein Textinhalt gefunden.');
  return { markdown, warnings };
}

/** Word (.docx) → Markdown über semantisches HTML (Formatvorlagen „Überschrift 1“ … werden Überschriften). */
export async function docxToMarkdown(data: Buffer, fallbackTitle: string, maxUncompressed: number): Promise<Converted> {
  // Schutz vor Zip-Bomben: .docx ist ein ZIP-Container
  const zip = await JSZip.loadAsync(data);
  const total = Object.values(zip.files).reduce((n, f: any) => n + (f._data?.uncompressedSize ?? 0), 0);
  if (total > maxUncompressed) throw new Error(`Word-Datei entpackt größer als ${maxUncompressed} Bytes`);
  if (!zip.file('word/document.xml')) throw new Error('Keine gültige Word-Datei (word/document.xml fehlt)');
  const res = await mammoth.convertToHtml({ buffer: data }, {
    styleMap: ['p[style-name=\'Überschrift 1\'] => h1:fresh', 'p[style-name=\'Überschrift 2\'] => h2:fresh', 'p[style-name=\'Überschrift 3\'] => h3:fresh', 'p[style-name=\'Title\'] => h1:fresh', 'p[style-name=\'Titel\'] => h1:fresh'],
    convertImage: mammoth.images.imgElement(async () => ({ src: '' })),
  });
  const warnings = [...new Set(res.messages.filter((m) => m.type === 'warning' && !/referenced but not defined/.test(m.message)).map((m) => m.message.replace(/^Unrecognised paragraph style: /, 'Unbekannte Formatvorlage: ')))].slice(0, 5);
  const hasH1 = /<h1\b/i.test(res.value);
  // Ohne Überschrift 1 wird der Dateiname Kapitelüberschrift, vorhandene Überschriften rücken darunter
  const html = hasH1 ? res.value : `<h1>${fallbackTitle.replace(/</g, '&lt;')}</h1>${shiftHeadings(res.value, 2)}`;
  const markdown = tidy(turndown().turndown(html));
  return { markdown, warnings };
}
