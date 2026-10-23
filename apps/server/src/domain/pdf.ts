// PDF → Markdown mit Fundstelle je Seite (ADR-086, Etappe 34 / M2), lokal mit pdf.js (Textebene).
// Überschriften: aus den Lesezeichen, sonst aus der Schriftgröße (größer als der Fließtext). Zeilen werden zu Absätzen
// zusammengefügt, eingerückte bzw. mit Aufzählungszeichen beginnende Zeilen zu Listenpunkten. Kopf- und Fußzeilen,
// die sich auf vielen Seiten wiederholen, und Seitenzahlen entfallen. Seiten ohne Textebene (gescannt) werden
// mit lokaler Texterkennung gelesen (OCR_CMD, ADR-090), sonst gemeldet.
import { finalize, marker, type LocatedMarkdown } from './pptx.js';

interface Line { page: number; y: number; x: number; right: number; size: number; text: string; bold: boolean; parts?: { x: number; w: number; s: string }[] }

const BULLET_RE = /^([•▪◦●○■□➢►‣⁃–-])\s*/;
const NUM_RE = /^(\d{1,2})[.)]\s+/;
const PAGE_NO_RE = /^(seite\s+|page\s+)?\d{1,4}(\s*(von|of|\/)\s*\d{1,4})?$/i;
const norm = (s: string) => s.toLocaleLowerCase('de').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const mdText = (s: string) => s.replace(/\s+/g, ' ').trim().replace(/^([#>]|[-*+]\s)/, '\\$1');

type PdfJs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Promise<PdfJs> | null = null;
const loadPdfJs = () => (pdfjs ??= import('pdfjs-dist/legacy/build/pdf.mjs'));

/** Lesezeichen als Überschriften: normierter Titel → Ebene (1 = oberste) */
async function outlineLevels(doc: any): Promise<Map<string, number>> {
  const out = new Map<string, number>();
  const walk = (items: any[] | null, depth: number) => {
    for (const it of items ?? []) {
      if (it.title && !out.has(norm(it.title))) out.set(norm(it.title), depth);
      walk(it.items, depth + 1);
    }
  };
  walk(await doc.getOutline().catch(() => null), 1);
  return out;
}

async function readLines(doc: any): Promise<{ lines: Line[]; empty: number[] }> {
  const lines: Line[] = [];
  const empty: number[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    const styles = tc.styles ?? {};
    const pageLines: Line[] = [];
    let cur: Line | null = null;
    for (const it of tc.items as any[]) {
      if (typeof it.str !== 'string') continue;
      const size = Math.round(Math.hypot(it.transform[0], it.transform[1]) * 10) / 10;
      const x = it.transform[4];
      const y = Math.round(it.transform[5]);
      const font = String(styles[it.fontName]?.fontFamily ?? '') + String(it.fontName ?? '');
      if (it.str === '' && !it.hasEOL) continue;
      // neue Zeile bei anderer Grundlinie
      if (!cur || Math.abs(cur.y - y) > Math.max(2, size * 0.4)) {
        if (cur?.parts?.some((q) => q.s.trim())) pageLines.push(cur);
        cur = { page: p, y, x, right: x + (it.width ?? 0), size: it.str.trim() ? size : 0, text: '', bold: false, parts: [] };
      }
      cur.parts!.push({ x, w: it.width ?? 0, s: it.str });
      if (it.str.trim()) {
        if (!cur.size || size > cur.size) cur.size = size;
        cur.x = Math.min(cur.x, x);
        cur.right = Math.max(cur.right, x + (it.width ?? 0));
        cur.bold ||= /bold|black|heavy|semibold/i.test(font);
      }
    }
    if (cur?.parts?.some((q) => q.s.trim())) pageLines.push(cur);
    if (!pageLines.length) empty.push(p);
    // Textstücke einer Zeile nach Position zusammensetzen – manche Erzeuger schreiben z. B. die Nummer „1.“ erst nach dem Text
    lines.push(...pageLines.map(({ parts, ...l }) => {
      const sorted = [...(parts ?? [])].sort((a, b) => a.x - b.x);
      let text = '';
      let end = -Infinity;
      for (const q of sorted) {
        if (text && !/\s$/.test(text) && !/^\s/.test(q.s) && q.x - end > l.size * 0.15) text += ' ';
        text += q.s;
        if (q.s) end = Math.max(end, q.x + q.w);
      }
      return { ...l, text: text.replace(/\s+/g, ' ').trim() };
    }));
    page.cleanup?.();
  }
  return { lines, empty };
}

/** Kopf-/Fußzeilen: gleicher Text an gleicher Stelle auf mindestens der Hälfte der Seiten (ab drei Seiten) */
function repeated(lines: Line[], pages: number) {
  if (pages < 3) return new Set<string>();
  const count = new Map<string, Set<number>>();
  for (const l of lines) {
    const k = `${Math.round(l.y / 4)}|${norm(l.text).replace(/\d+/g, '#')}`;
    if (!count.has(k)) count.set(k, new Set());
    count.get(k)!.add(l.page);
  }
  return new Set([...count].filter(([, s]) => s.size >= Math.max(3, pages / 2)).map(([k]) => k));
}

/** Texterkennung einer gerenderten Seite (PNG) – lokal (ADR-090); null = nicht eingerichtet */
export type OcrFn = (png: Buffer) => Promise<string | null>;

/** Seite ohne Textebene rendern (doppelte Auflösung) und per Texterkennung lesen */
async function ocrPage(doc: any, p: number, ocr: OcrFn): Promise<string | null> {
  const { createCanvas } = await import('@napi-rs/canvas');
  const page = await doc.getPage(p);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const g = canvas.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: g as any, viewport, canvas: canvas as any }).promise;
  page.cleanup?.();
  return ocr(Buffer.from(await canvas.encode('png')));
}

export async function pdfToMarkdown(data: Buffer, fallbackTitle: string, opts: { ocr?: OcrFn } = {}): Promise<LocatedMarkdown> {
  const { getDocument } = await loadPdfJs();
  let doc: any;
  try {
    doc = await getDocument({ data: new Uint8Array(data), isEvalSupported: false, useSystemFonts: false, disableFontFace: true, verbosity: 0 }).promise;
  } catch (e) {
    const msg = (e as Error).message ?? '';
    throw new Error(/password/i.test(msg) ? 'PDF ist kennwortgeschützt – bitte ohne Kennwort exportieren' : `Keine gültige PDF-Datei (${msg})`);
  }
  try {
    const warnings: string[] = [];
    const { lines: textLines, empty } = await readLines(doc);
    const meta = await doc.getMetadata().catch(() => null);
    const docTitle = String(meta?.info?.Title ?? '').trim();
    const rep = repeated(textLines, doc.numPages);
    let lines = textLines.filter((l) => !PAGE_NO_RE.test(l.text) && !rep.has(`${Math.round(l.y / 4)}|${norm(l.text).replace(/\d+/g, '#')}`));
    // Seiten ohne Textebene (gescannt): lokale Texterkennung, falls eingerichtet (ADR-090); erkannter Text als Fließtext
    const recognized: number[] = [];
    if (empty.length && opts.ocr) {
      const size = lines.length ? Math.min(...lines.map((l) => l.size)) : 12;
      const x = lines.length ? Math.min(...lines.map((l) => l.x)) : 50;
      for (const p of empty.slice(0, 200)) {
        const text = await ocrPage(doc, p, opts.ocr).catch(() => null);
        if (!text?.trim()) continue;
        recognized.push(p);
        let y = 800;
        for (const raw of text.split(/\r?\n/)) {
          if (!raw.trim()) { y -= size * 2.5; continue; } // Leerzeile = neuer Absatz
          lines.push({ page: p, y, x, right: x + raw.length * size * 0.5, size, text: raw.replace(/\s+/g, ' ').trim(), bold: false });
          y -= size * 1.2;
        }
      }
      lines = lines.sort((a, b) => a.page - b.page); // stabil: Reihenfolge innerhalb der Seite bleibt
    }
    const missing = empty.filter((p) => !recognized.includes(p));
    if (recognized.length) warnings.push(`Seite per Texterkennung gelesen (bitte prüfen): ${recognized.slice(0, 10).join(', ')}${recognized.length > 10 ? ' …' : ''}`);
    if (missing.length) warnings.push(`Seite ohne Textebene (gescannt?)${opts.ocr ? ' – Texterkennung ohne Ergebnis' : ' – Texterkennung nicht eingerichtet (OCR_CMD)'}: ${missing.slice(0, 10).join(', ')}${missing.length > 10 ? ' …' : ''}`);
    if (!lines.length) return { markdown: '', warnings, locators: [], skip: empty.length ? `PDF ohne Textebene (gescannt)${opts.ocr ? '' : ' – Texterkennung nicht eingerichtet (OCR_CMD)'}, übersprungen` : 'PDF ohne Text – übersprungen' };

    // Fließtextgröße = häufigste Größe nach Zeichen; größere (bzw. fett und eigenständig) = Überschrift
    const bySize = new Map<number, number>();
    for (const l of lines) bySize.set(l.size, (bySize.get(l.size) ?? 0) + l.text.length);
    const body = [...bySize].sort((a, b) => b[1] - a[1])[0][0];
    const headingSizes = [...bySize.keys()].filter((s) => s >= body * 1.15).sort((a, b) => b - a).slice(0, 3);
    const bookmarks = await outlineLevels(doc);
    const levelOf = (l: Line): number | null => {
      if (l.text.length > 160) return null;
      if (bookmarks.size) return bookmarks.get(norm(l.text)) ?? null;
      const i = headingSizes.indexOf(l.size);
      return i >= 0 ? i + 1 : null;
    };

    const left = Math.min(...lines.map((l) => l.x));
    const right = Math.max(...lines.map((l) => l.right));
    const out: string[] = [];
    let page = 0;
    let para: string[] = [];
    let item: { prefix: string; text: string[] } | null = null;
    let prev: Line | null = null;
    // end = false: weiterer Listenpunkt folgt (Liste bleibt ohne Leerzeile zusammen)
    const flush = (end = true) => {
      if (item) {
        out.push(`${item.prefix}${mdText(item.text.join(' '))}`);
        if (end) out.push('');
      } else if (para.length) out.push(mdText(para.join(' ').replace(/(\p{L})- (\p{Ll})/gu, '$1$2')), '');
      para = [];
      item = null;
    };
    const firstLevel = levelOf(lines[0]);
    const shift = firstLevel === 1 ? 0 : 1; // Text vor der ersten Überschrift → Dateititel als Kapitel
    if (shift) out.push(`# ${mdText(docTitle || fallbackTitle)}`, '');
    for (const l of lines) {
      if (l.page !== page) {
        // Fundstelle ab der nächsten geschriebenen Zeile; Absätze über Seitengrenzen werden getrennt
        flush();
        page = l.page;
        out.push(marker({ page }));
      }
      const level = levelOf(l);
      if (level) {
        flush();
        // mehrzeilige Überschrift (gleiche Größe direkt darunter) zusammenfügen
        const last = out[out.length - 2];
        if (prev && levelOf(prev) === level && prev.page === l.page && Math.abs(prev.y - l.y) < l.size * 1.6 && last?.startsWith('#')) {
          out[out.length - 2] = `${last} ${mdText(l.text)}`;
        } else out.push(`${'#'.repeat(Math.min(6, level + shift))} ${mdText(l.text)}`, '');
        prev = l;
        continue;
      }
      const bullet = BULLET_RE.exec(l.text);
      const num = NUM_RE.exec(l.text);
      const indented = l.x > left + l.size * 0.8;
      const gap = prev && prev.page === l.page ? prev.y - l.y : 0;
      const prevWrapped = !!prev && prev.right > right - prev.size * 3 && !levelOf(prev);
      const startsItem = !!bullet || !!num || (indented && !(item && prevWrapped && Math.abs(gap) < l.size * 1.6));
      if (startsItem) {
        if (item) flush(false);
        else if (para.length) flush();
        const text = bullet ? l.text.slice(bullet[0].length) : num ? l.text.slice(num[0].length) : l.text;
        item = { prefix: num ? `${num[1]}. ` : '- ', text: [text] };
      } else if (item && prevWrapped && Math.abs(gap) < l.size * 1.6) {
        item.text.push(l.text);
      } else {
        if (item) flush();
        // neuer Absatz bei großem Abstand oder wenn die vorige Zeile kurz mit Satzende endete
        if (para.length && (Math.abs(gap) > l.size * 1.7 || (prev && prev.right < right - prev.size * 4 && /[.:!?]$/.test(prev.text)))) flush();
        para.push(l.text);
      }
      prev = l;
    }
    flush();
    return { ...finalize(out), warnings };
  } finally {
    await doc.destroy?.();
  }
}
