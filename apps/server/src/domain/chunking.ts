// Teilstücke langer Chunks (ADR-087, M3): Zielgröße 300–800 Zeichen, Teilung an Satzgrenzen, 1 Satz Überlappung.
// Die Textabschnitte selbst bleiben unverändert (E-02: Snippet = Absatz, ADR-004 unveränderlich) – die Teilstücke
// werden aus dem Text abgeleitet und dienen Suche und Antworten. Tabellen, Listen und Codeblöcke bleiben ganz.

export const CHUNK_MIN = 300;
export const CHUNK_MAX = 800;
const WHOLE = new Set(['table', 'list', 'ordered_list', 'code']);

export interface ChunkPart {
  no: number;
  /** Text des Teilstücks (ohne Überlappung) */
  text: string;
  /** letzter Satz des vorigen Teilstücks – nur Kontext, nicht Teil des Textes */
  overlap: string | null;
  /** Zeichenbereich im Originaltext (Leerraum vereinheitlicht) */
  start: number;
  end: number;
}

/** Sätze; ein überlanger Satz wird an Kommas bzw. Leerzeichen weiter geteilt */
function sentences(text: string): string[] {
  const out: string[] = [];
  for (const s of text.split(/(?<=[.!?…])\s+(?=[\p{Lu}\d„"(])/u)) {
    if (s.length <= CHUNK_MAX) {
      out.push(s);
      continue;
    }
    let rest = s;
    while (rest.length > CHUNK_MAX) {
      const cut = Math.max(rest.lastIndexOf(', ', CHUNK_MAX), rest.lastIndexOf(' ', CHUNK_MAX));
      const at = cut > CHUNK_MIN ? cut + 1 : CHUNK_MAX;
      out.push(rest.slice(0, at).trim());
      rest = rest.slice(at).trim();
    }
    if (rest) out.push(rest);
  }
  return out.filter(Boolean);
}

/** Teilstücke eines Chunks; kurze Chunks und Tabellen, Listen, Code bleiben ganz (leere Liste) */
export function chunkParts(text: string, kind: string): ChunkPart[] {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (WHOLE.has(kind) || flat.length <= CHUNK_MAX) return [];
  const groups: string[][] = [];
  let cur: string[] = [];
  let len = 0;
  for (const s of sentences(flat)) {
    if (cur.length && len + 1 + s.length > CHUNK_MAX) {
      groups.push(cur);
      cur = [];
      len = 0;
    }
    cur.push(s);
    len += (len ? 1 : 0) + s.length;
  }
  if (cur.length) groups.push(cur);
  // zu kurzes letztes Teilstück an das vorige hängen, solange es die Obergrenze nicht weit überschreitet
  if (groups.length > 1) {
    const last = groups[groups.length - 1].join(' ');
    const prev = groups[groups.length - 2].join(' ');
    if (last.length < CHUNK_MIN && prev.length + 1 + last.length <= CHUNK_MAX * 1.25) groups.splice(-2, 2, [...groups[groups.length - 2], ...groups[groups.length - 1]]);
  }
  if (groups.length < 2) return []; // nach dem Anhängen nur ein Stück: Chunk bleibt ganz
  let pos = 0;
  return groups.map((g, i) => {
    const t = g.join(' ');
    const start = flat.indexOf(t, pos);
    pos = start + t.length;
    return { no: i + 1, text: t, overlap: i ? groups[i - 1][groups[i - 1].length - 1] : null, start, end: pos };
  });
}
