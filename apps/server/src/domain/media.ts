// Bilder in Handbuchinhalten (ADR-029). Bilder werden im Markdown als `![Alternativtext](media:<sha256>)` referenziert;
// die Datei liegt inhaltsadressiert im Object-Store. Erlaubt sind Rasterformate (PNG, JPEG, GIF, WebP) – kein SVG (Skripte).
import path from 'node:path';

export const MEDIA_EXT: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' };
export const MIME_EXT: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp' };

export interface ImageInfo {
  mime: string;
  width: number | null;
  height: number | null;
}

/** Format anhand der Signatur (nicht der Endung) bestimmen; null = kein erlaubtes Bild */
export function sniffImage(b: Buffer): ImageInfo | null {
  if (b.length >= 24 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { mime: 'image/png', width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  if (b.length >= 10 && (b.subarray(0, 6).toString('latin1') === 'GIF87a' || b.subarray(0, 6).toString('latin1') === 'GIF89a')) {
    return { mime: 'image/gif', width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  }
  if (b.length >= 30 && b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') {
    const chunk = b.subarray(12, 16).toString('latin1');
    if (chunk === 'VP8X') return { mime: 'image/webp', width: b.readUIntLE(24, 3) + 1, height: b.readUIntLE(27, 3) + 1 };
    if (chunk === 'VP8 ') return { mime: 'image/webp', width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { mime: 'image/webp', width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    return { mime: 'image/webp', width: null, height: null };
  }
  if (b.length >= 4 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    // JPEG: Segmente bis zum Start-of-Frame durchlaufen
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) break;
      const marker = b[i + 1];
      const len = b.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { mime: 'image/jpeg', width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
    return { mime: 'image/jpeg', width: null, height: null };
  }
  return null;
}

// ![alt](ziel "titel") – Alternativtext ohne unmaskierte schließende Klammer, Ziel ohne Leerzeichen oder in <…>
const IMAGE = /!\[((?:\\.|[^\]\\])*)\]\(\s*(<[^>]*>|[^)\s]+)(\s+"[^"]*")?\s*\)/g;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;

export const escapeAlt = (s: string) => s.replace(/\s+/g, ' ').trim().replace(/([\\[\]])/g, '\\$1');
const unescapeAlt = (s: string) => s.replace(/\\([\\[\]])/g, '$1');

export interface ImageRef {
  alt: string;
  target: string;
  /** SHA-256 bei `media:`-Verweisen */
  sha: string | null;
}

/** Zeilenweise über Markdown außerhalb von Codeblöcken */
function mapOutsideCode(md: string, fn: (line: string) => string) {
  let fence: string | null = null;
  return md.split('\n').map((line) => {
    const m = FENCE.exec(line);
    if (m) {
      if (!fence) fence = m[1][0];
      else if (m[1][0] === fence) fence = null;
      return line;
    }
    return fence ? line : fn(line);
  }).join('\n');
}

export function imageRefs(md: string): ImageRef[] {
  const refs: ImageRef[] = [];
  mapOutsideCode(md, (line) => {
    for (const m of line.matchAll(IMAGE)) {
      const target = m[2].replace(/^<|>$/g, '');
      refs.push({ alt: unescapeAlt(m[1]).trim(), target, sha: /^media:([a-f0-9]{64})$/.exec(target)?.[1] ?? null });
    }
    return line;
  });
  return refs;
}

export const mediaShas = (texts: string[]) => [...new Set(texts.flatMap((t) => imageRefs(t).map((r) => r.sha).filter((s): s is string => !!s)))];

/** Bilder ohne Alternativtext (Barrierefreiheit, Gate-Prüfung `image_alt`) */
export const imagesWithoutAlt = (md: string) => imageRefs(md).filter((r) => !r.alt);

/** Relative Bildverweise auflösen und in `media:`-Verweise umschreiben. `resolve` liefert den SHA-256 oder null. */
export function rewriteImages(md: string, resolve: (target: string) => string | null) {
  const missing: string[] = [];
  let changed = false;
  const markdown = mapOutsideCode(md, (line) =>
    line.replace(IMAGE, (all, alt: string, rawTarget: string) => {
      const target = rawTarget.replace(/^<|>$/g, '');
      if (/^(media|https?|data|mailto):/i.test(target) || target.startsWith('#')) return all;
      const sha = resolve(target);
      if (!sha) {
        missing.push(target);
        return all;
      }
      changed = true;
      return `![${alt}](media:${sha})`;
    }));
  return { markdown, changed, missing };
}

/** Pfad eines Bildverweises relativ zur Datei im ZIP (`bilder/a.png` in `kap/1.md` → `kap/bilder/a.png`) */
export function resolveRelative(fromFile: string, target: string): string | null {
  let t: string;
  try {
    t = decodeURIComponent(target.split(/[?#]/)[0]);
  } catch {
    t = target.split(/[?#]/)[0];
  }
  const joined = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), t.replace(/\\/g, '/')));
  return joined.startsWith('..') || joined.startsWith('/') ? null : joined;
}

/** Bilder der Vorlage, die in einem maschinell erzeugten Text fehlen, wieder anhängen (Übersetzung, ADR-029) */
export function preserveImages(source: string, text: string) {
  const present = new Set(imageRefs(text).map((r) => r.target));
  const lost = imageRefs(source).filter((r) => !present.has(r.target));
  return lost.length ? `${text}\n\n${lost.map((r) => `![${escapeAlt(r.alt)}](${r.target})`).join(' ')}` : text;
}
