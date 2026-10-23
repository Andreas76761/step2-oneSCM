// PowerPoint (.pptx) → Markdown mit Fundstelle je Folie (ADR-086, Etappe 34 / M2).
// Je Folie ein Abschnitt (Folientitel als Überschrift 2), Aufzählungen mit Ebenen, Tabellen als Pipe-Tabellen,
// Bilder als abgelegte Medien mit Alternativtext, Sprechernotizen als Zitat. Ausgeblendete Folien entfallen.
// Für F-25 liefert die Umwandlung je Bild den Text seiner Folie (Grundlage für den Gliederungs-Vorschlag).
import path from 'node:path';
import JSZip from 'jszip';
import type { EmbedImage } from './convert.js';
import { escapeAlt } from './media.js';

export type Locator = { page?: number; slide?: number; anchor?: string };
/** Markdown mit Fundstellen: ab Zeile `line` (1-basiert) gilt `locator` */
export interface LocatedMarkdown {
  markdown: string;
  warnings: string[];
  locators: { line: number; locator: Locator }[];
  /** Bilder mit dem Text ihrer Folie (F-25) */
  images?: { sha: string; slide: number; title: string; text: string }[];
  skip?: string;
}

const MARK = '\u0001';
/** Markierungszeile: ab der nächsten Textzeile gilt diese Fundstelle */
export const marker = (locator: Locator) => `${MARK}${JSON.stringify(locator)}`;

/**
 * Text aus Zeilen mit Markierungen zusammensetzen: Markierungen entfallen, mehrfache Leerzeilen werden zu einer;
 * je Markierung die Zeilennummer (1-basiert) der nächsten nicht leeren Zeile.
 */
export function finalize(parts: string[]): Pick<LocatedMarkdown, 'markdown' | 'locators'> {
  const out: string[] = [];
  const locators: LocatedMarkdown['locators'] = [];
  let pending: Locator | null = null;
  for (const line of parts.join('\n').split('\n')) {
    if (line.startsWith(MARK)) {
      pending = JSON.parse(line.slice(1));
      continue;
    }
    if (!line.trim()) {
      if (out.length && out[out.length - 1] !== '') out.push('');
      continue;
    }
    out.push(line.replace(/\s+$/, ''));
    if (pending) locators.push({ line: out.length, locator: pending });
    pending = null;
  }
  while (out.length && out[out.length - 1] === '') out.pop();
  return { markdown: `${out.join('\n')}\n`, locators };
}

const decode = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&amp;/g, '&');
const attr = (tag: string, name: string) => new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];
/** Markdown-Steuerzeichen am Zeilenanfang und Pipes in Tabellen entschärfen */
const mdText = (s: string) => s.replace(/\s+/g, ' ').trim().replace(/^([#>]|\d+\.\s|[-*+]\s)/, '\\$1');

/** Absätze eines Textkörpers: Text, Ebene, Aufzählungsart */
function paragraphs(xml: string) {
  return [...xml.matchAll(/<a:p>([\s\S]*?)<\/a:p>|<a:p\s[^>]*>([\s\S]*?)<\/a:p>/g)].map((m) => {
    const p = m[1] ?? m[2] ?? '';
    const pPr = /<a:pPr\b[^>]*\/?>(?:[\s\S]*?<\/a:pPr>)?/.exec(p)?.[0] ?? '';
    const text = [...p.matchAll(/<a:t>([\s\S]*?)<\/a:t>|<a:t\s[^>]*>([\s\S]*?)<\/a:t>|<a:br\s*\/>/g)].map((t) => (t[0].startsWith('<a:br') ? ' ' : decode(t[1] ?? t[2] ?? ''))).join('');
    return {
      text: text.replace(/\s+/g, ' ').trim(),
      level: Number(attr(pPr, 'lvl') ?? 0),
      bullet: /<a:buChar\b/.test(pPr) ? 'char' as const : /<a:buAutoNum\b/.test(pPr) ? 'num' as const : /<a:buNone\b/.test(pPr) ? 'none' as const : null,
    };
  }).filter((p) => p.text);
}

function table(xml: string): string[] {
  const rows = [...xml.matchAll(/<a:tr\b[\s\S]*?<\/a:tr>/g)].map((r) => [...r[0].matchAll(/<a:tc\b[\s\S]*?<\/a:tc>/g)].map((c) => paragraphs(c[0]).map((p) => p.text).join(' ').replace(/\|/g, '\\|')));
  if (!rows.length) return [];
  const n = Math.max(...rows.map((r) => r.length));
  const line = (r: string[]) => `| ${Array.from({ length: n }, (_, i) => r[i] ?? '').join(' | ')} |`;
  return [line(rows[0]), `|${' --- |'.repeat(n)}`, ...rows.slice(1).map(line)];
}

async function rels(zip: JSZip, file: string) {
  const relPath = path.posix.join(path.posix.dirname(file), '_rels', `${path.posix.basename(file)}.rels`);
  const xml = (await zip.file(relPath)?.async('string')) ?? '';
  const out = new Map<string, { type: string; target: string }>();
  for (const m of xml.matchAll(/<Relationship\b[^>]*>/g)) {
    const id = attr(m[0], 'Id');
    const target = attr(m[0], 'Target');
    if (id && target) out.set(id, { type: attr(m[0], 'Type') ?? '', target: attr(m[0], 'TargetMode') === 'External' ? '' : path.posix.normalize(path.posix.join(path.posix.dirname(file), target)) });
  }
  return out;
}

export async function pptxToMarkdown(data: Buffer, fallbackTitle: string, maxUncompressed: number, embed?: EmbedImage): Promise<LocatedMarkdown> {
  const zip = await JSZip.loadAsync(data);
  const total = Object.values(zip.files).reduce((n, f: any) => n + (f._data?.uncompressedSize ?? 0), 0);
  if (total > maxUncompressed) throw new Error(`PowerPoint-Datei entpackt größer als ${maxUncompressed} Bytes`);
  const pres = await zip.file('ppt/presentation.xml')?.async('string');
  if (!pres) throw new Error('Keine gültige PowerPoint-Datei (ppt/presentation.xml fehlt)');
  const presRels = await rels(zip, 'ppt/presentation.xml');
  const slideFiles = [...pres.matchAll(/<p:sldId\b[^>]*>/g)].map((m) => presRels.get(attr(m[0], 'r:id') ?? '')?.target).filter((t): t is string => !!t && !!zip.file(t));
  const core = (await zip.file('docProps/core.xml')?.async('string')) ?? '';
  const docTitle = decode(/<dc:title>([\s\S]*?)<\/dc:title>/.exec(core)?.[1] ?? '').trim();

  const warnings: string[] = [];
  const out: string[] = [];
  const images: NonNullable<LocatedMarkdown['images']> = [];
  const hidden: number[] = [];
  const unsupported = new Set<string>();
  let h1: string | null = null;

  for (let i = 0; i < slideFiles.length; i++) {
    const no = i + 1;
    const xml = (await zip.file(slideFiles[i])!.async('string'));
    if (/<p:sld\b[^>]*\sshow="0"/.test(xml)) {
      hidden.push(no);
      continue;
    }
    const slideRels = await rels(zip, slideFiles[i]);
    const tree = /<p:spTree>([\s\S]*)<\/p:spTree>/.exec(xml)?.[1] ?? xml;
    let title = '';
    let subtitle = '';
    let centered = false;
    const body: string[] = [];
    const slideImages: { sha: string; alt: string }[] = [];
    // Formen in Reihenfolge des Folienbaums: Textformen, Bilder, Tabellen (auch in Gruppen)
    for (const m of tree.matchAll(/<p:sp>[\s\S]*?<\/p:sp>|<p:pic>[\s\S]*?<\/p:pic>|<p:graphicFrame>[\s\S]*?<\/p:graphicFrame>/g)) {
      const shape = m[0];
      if (shape.startsWith('<p:pic>')) {
        const descr = decode(attr(/<p:cNvPr\b[^>]*>/.exec(shape)?.[0] ?? '', 'descr') ?? '');
        const target = slideRels.get(attr(/<a:blip\b[^>]*>/.exec(shape)?.[0] ?? '', 'r:embed') ?? '')?.target;
        const file = target ? zip.file(target) : null;
        if (!file || !embed) continue;
        try {
          const sha = await embed(await file.async('nodebuffer'), path.posix.basename(target!));
          slideImages.push({ sha, alt: descr });
          body.push(`![${escapeAlt(descr)}](media:${sha})`);
        } catch {
          unsupported.add(path.posix.extname(target!).toLowerCase() || target!);
          if (descr) body.push(`[Bild: ${descr}]`);
        }
        continue;
      }
      if (shape.startsWith('<p:graphicFrame>')) {
        const rows = table(shape);
        if (rows.length) body.push(rows.join('\n'));
        continue;
      }
      const ph = /<p:ph\b[^>]*>/.exec(shape)?.[0];
      const type = ph ? attr(ph, 'type') ?? 'obj' : null;
      const paras = paragraphs(/<p:txBody>([\s\S]*?)<\/p:txBody>/.exec(shape)?.[1] ?? '');
      if (!paras.length) continue;
      if (type === 'title' || type === 'ctrTitle') {
        title = paras.map((p) => p.text).join(' ');
        centered ||= type === 'ctrTitle';
        continue;
      }
      if (type === 'subTitle') {
        subtitle = paras.map((p) => p.text).join(' ');
        continue;
      }
      if (type === 'sldNum' || type === 'dt' || type === 'ftr') continue; // Foliennummer, Datum, Fußzeile
      // Platzhalter für Inhalt sind Aufzählungen, Textfelder Absätze – außer ausdrücklichen Aufzählungszeichen
      const listy = (type === 'obj' || type === 'body') && paras.length > 1;
      let n = 0;
      const lines = paras.map((p) => {
        const kind = p.bullet === 'num' ? 'num' : p.bullet === 'char' || (listy && p.bullet !== 'none') ? 'char' : null;
        const indent = '  '.repeat(Math.min(p.level, 4));
        if (kind === 'num') return `${indent}${++n}. ${mdText(p.text)}`;
        if (kind === 'char') return `${indent}- ${mdText(p.text)}`;
        return `\n${mdText(p.text)}\n`;
      });
      body.push(lines.join('\n').replace(/\n{3,}/g, '\n\n').trim());
    }
    // Sprechernotizen (Platzhalter „body“ der Notizenseite)
    const notesTarget = [...slideRels.values()].find((r) => r.type.endsWith('/notesSlide'))?.target;
    const notesXml = notesTarget ? await zip.file(notesTarget)?.async('string') : undefined;
    const notes = notesXml ? [...notesXml.matchAll(/<p:sp>[\s\S]*?<\/p:sp>/g)].filter((s) => /<p:ph\b[^>]*type="body"/.test(s[0])).flatMap((s) => paragraphs(s[0]).map((p) => p.text)) : [];

    if (no === 1 && centered && !h1) {
      // Titelfolie: Titel der Präsentation
      h1 = title || docTitle || fallbackTitle;
      out.push(marker({ slide: no }), `# ${mdText(h1)}`, '');
      if (subtitle) out.push(mdText(subtitle), '');
    } else {
      if (!h1) {
        h1 = docTitle || fallbackTitle;
        out.push(`# ${mdText(h1)}`, '');
      }
      const heading = title || `Folie ${no}`;
      out.push(marker({ slide: no }), `## ${mdText(heading)}`, '');
      if (subtitle) out.push(mdText(subtitle), '');
    }
    for (const b of body) out.push(b, '');
    if (notes.length) out.push(...notes.map((t) => `> ${t.replace(/\s+/g, ' ')}`), '');
    const slideText = [title, subtitle, ...body.filter((b) => !b.startsWith('![')), ...notes].join(' ').replace(/!\[[^\]]*\]\(media:[a-f0-9]+\)/g, '');
    // Kontext je Bild: Alternativtext, Folientext und Titel der Präsentation
    for (const im of slideImages) images.push({ sha: im.sha, slide: no, title: title || `Folie ${no}`, text: `${im.alt} ${slideText} ${h1 ?? ''}`.replace(/\s+/g, ' ').trim() });
  }
  if (!h1) return { markdown: '', warnings, locators: [], skip: 'Präsentation ohne sichtbare Folien – übersprungen' };
  if (hidden.length) warnings.push(`Ausgeblendete Folien nicht eingelesen: ${hidden.join(', ')}`);
  if (unsupported.size) warnings.push(`Bildformat nicht unterstützt (nur Alternativtext): ${[...unsupported].join(', ')}`);
  return { ...finalize(out), warnings, images };
}
