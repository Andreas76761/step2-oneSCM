// Struktur-Extraktion aus Markdown (US-002, ADR-005).
// Der Parser führt kein HTML aus und rendert nichts; er liefert nur Struktur und Quellpositionen.
// ANNAHME(E-02): Snippet-Granularität = Absatz | Liste | Tabelle | Codeblock | Zitat.
import { parse as parseYaml } from 'yaml';

export const NO_CHAPTER_TITLE = 'Ohne Kapitel';

export type BlockKind = 'paragraph' | 'list' | 'ordered_list' | 'table' | 'code' | 'quote';

export interface ParsedBlock {
  chapterTitle: string | null;
  subchapterTitle: string | null;
  headingPath: string[]; // H3–H6
  kind: BlockKind;
  text: string;
  lineStart: number; // 1-basiert, bezogen auf die Originaldatei
  lineEnd: number;
  position: number; // Reihenfolge in der Datei
}

export interface ParsedHeading {
  level: number;
  title: string;
  line: number;
  chapterTitle: string | null;
  subchapterTitle: string | null;
  contentBlocks: number; // Anzahl direkter Inhaltsblöcke bis zur nächsten Überschrift
}

export interface ParsedDocument {
  frontMatter: Record<string, unknown>;
  frontMatterError?: string;
  blocks: ParsedBlock[];
  headings: ParsedHeading[];
}

const ATX = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
const BULLET = /^\s*[-*+][ \t]+/;
const ORDERED = /^\s*\d{1,9}[.)][ \t]+/;

/** Normalisierter Schlüssel für Kapitel/Unterkapitel (Nummerierung wird ignoriert). */
export function headingKey(title: string): string {
  return title
    .normalize('NFC')
    .replace(/^\s*(?:kapitel\s+)?\d+(?:\.\d+)*\.?\s*/i, '')
    .toLowerCase()
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function classify(lines: string[]): BlockKind {
  const first = lines[0];
  if (ORDERED.test(first)) return 'ordered_list';
  if (BULLET.test(first)) return 'list';
  if (/^\s*\|/.test(first) || (lines.length > 1 && /^\s*\|?\s*:?-{3,}/.test(lines[1]) && first.includes('|'))) return 'table';
  if (/^\s*>/.test(first)) return 'quote';
  return 'paragraph';
}

export function parseMarkdown(input: string): ParsedDocument {
  const text = input.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const lines = text.split('\n');
  let i = 0;
  let frontMatter: Record<string, unknown> = {};
  let frontMatterError: string | undefined;

  if (lines[0]?.trim() === '---') {
    const end = lines.findIndex((l, idx) => idx > 0 && (l.trim() === '---' || l.trim() === '...'));
    if (end > 0) {
      try {
        const fm = parseYaml(lines.slice(1, end).join('\n'), { customTags: [], maxAliasCount: 10 });
        if (fm && typeof fm === 'object' && !Array.isArray(fm)) frontMatter = fm as Record<string, unknown>;
      } catch (e) {
        frontMatterError = (e as Error).message;
      }
      i = end + 1;
    }
  }

  const blocks: ParsedBlock[] = [];
  const headings: ParsedHeading[] = [];
  let chapter: string | null = null;
  let sub: string | null = null;
  let path: string[] = [];
  let buf: string[] = [];
  let bufStart = 0;
  let position = 0;

  const currentHeading = () => headings[headings.length - 1];

  const pushBlock = (kind: BlockKind, blockLines: string[], start: number, end: number) => {
    const body = blockLines.join('\n').replace(/\s+$/, '');
    if (!body.trim()) return;
    blocks.push({ chapterTitle: chapter, subchapterTitle: sub, headingPath: [...path], kind, text: body, lineStart: start, lineEnd: end, position: position++ });
    const h = currentHeading();
    if (h) h.contentBlocks++;
  };

  const flush = () => {
    if (!buf.length) return;
    pushBlock(classify(buf), buf, bufStart, bufStart + buf.length - 1);
    buf = [];
  };

  const setHeading = (level: number, rawTitle: string, line: number) => {
    const title = rawTitle.trim() || '(ohne Titel)';
    if (level === 1) {
      chapter = title;
      sub = null;
      path = [];
    } else if (level === 2) {
      sub = title;
      path = [];
    } else {
      path = path.slice(0, level - 3);
      while (path.length < level - 3) path.push('');
      path.push(title);
    }
    headings.push({ level, title, line, chapterTitle: chapter, subchapterTitle: sub, contentBlocks: 0 });
  };

  for (; i < lines.length; i++) {
    const line = lines[i];
    const lineNo = i + 1;

    const fence = FENCE.exec(line);
    if (fence) {
      flush();
      const marker = fence[1];
      const start = lineNo;
      const code: string[] = [line];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith(marker)) code.push(lines[i++]);
      if (i < lines.length) code.push(lines[i]);
      pushBlock('code', code, start, Math.min(i + 1, lines.length));
      continue;
    }

    const atx = ATX.exec(line);
    if (atx) {
      flush();
      setHeading(atx[1].length, atx[2] ?? '', lineNo);
      continue;
    }

    // Setext-Überschrift: genau eine Absatzzeile, gefolgt von === oder ---
    if (buf.length === 1 && classify(buf) === 'paragraph' && /^ {0,3}(=+|-+)\s*$/.test(line)) {
      const level = line.trim().startsWith('=') ? 1 : 2;
      const title = buf[0];
      buf = [];
      setHeading(level, title, lineNo - 1);
      continue;
    }

    if (!line.trim()) {
      // Lockere Listen: Leerzeile gefolgt von weiterem Listenpunkt/Einrückung gehört zur Liste
      if (buf.length && (BULLET.test(buf[0]) || ORDERED.test(buf[0]))) {
        const next = lines[i + 1] ?? '';
        if (BULLET.test(next) || ORDERED.test(next) || /^\s{2,}\S/.test(next)) {
          buf.push('');
          continue;
        }
      }
      flush();
      continue;
    }

    // Wechsel Absatz → Liste ohne Leerzeile beginnt einen neuen Block
    if (buf.length && classify(buf) === 'paragraph' && (BULLET.test(line) || ORDERED.test(line))) flush();
    if (!buf.length) bufStart = lineNo;
    buf.push(line);
  }
  flush();

  return { frontMatter, frontMatterError, blocks, headings };
}

/** Kapitel-/Unterkapitel-Schlüssel und Anzeigetitel für einen Block. */
export function chapterOf(block: Pick<ParsedBlock, 'chapterTitle'>): { key: string; title: string } {
  if (!block.chapterTitle) return { key: '__none__', title: NO_CHAPTER_TITLE };
  return { key: headingKey(block.chapterTitle) || '__none__', title: block.chapterTitle };
}
