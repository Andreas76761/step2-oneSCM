// Änderungsvorschläge (ADR-104): Word-Prüffassung zurücklesen (W-06) und Absätze den Absätzen der Kapitelversion
// zuordnen; Wortvergleich für die Anzeige (G-07). Reine Fachlogik ohne I/O.

/** Zeile der Prüffassung je Kapitel */
export const CRITERION_PREFIX = 'Fertig, wenn:';
export const DEFAULT_CRITERION = 'alle Schritte, Begriffe und Bildschirmtexte mit der aktuellen Oberfläche übereinstimmen.';

export interface ReviewChapter { title: string; criterion: string | null; sections: { title: string; paragraphs: string[] }[] }

const unwrapEmphasis = (s: string) => s.replace(/^[_*]+|[_*]+$/g, '').trim();

/** Hinweis-, Tipp- und Warnkästen stehen in Word als Tabelle mit einer Zelle und Kennwort – zurück zum Absatztext */
const BOX_LABELS = /^\*\*(?:Hinweis|Tipp|Warnung)\*\*\s*/;
export function unwrapBox(text: string) {
  const m = /^\|\s*([\s\S]*?)\s*\|\n\|\s*-{3,}\s*\|$/.exec(text);
  return m ? m[1].replace(BOX_LABELS, '').trim() : text;
}

/**
 * Markdown einer zurückgelesenen Word-Datei in Kapitel (Überschrift 1), Abschnitte (Überschrift 2) und Absätze zerlegen.
 * Zusammenhängende Zeilen (z. B. eine nummerierte Liste) bilden einen Absatz; die Zeile „Fertig, wenn: …“ ist das
 * Prüfkriterium und kein Absatz. Inhalt vor dem ersten Kapitel (Titelseite, Inhaltsverzeichnis) zählt nicht.
 */
export function parseReviewDocument(markdown: string): ReviewChapter[] {
  const out: ReviewChapter[] = [];
  let ch: ReviewChapter | null = null;
  let sec: { title: string; paragraphs: string[] } | null = null;
  let buf: string[] = [];
  const flush = () => {
    const text = buf.join('\n').trim();
    buf = [];
    if (!text || !ch) return;
    const plain = unwrapEmphasis(text);
    if (plain.startsWith(CRITERION_PREFIX)) {
      ch.criterion = plain.slice(CRITERION_PREFIX.length).trim();
      return;
    }
    if (!sec) return; // Versionszeile u. Ä. zwischen Kapitel- und erster Abschnittsüberschrift
    sec.paragraphs.push(unwrapBox(text));
  };
  for (const line of markdown.replace(/\r\n?/g, '\n').split('\n')) {
    const h = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (h && h[1].length <= 2) {
      flush();
      if (h[1].length === 1) {
        ch = { title: unwrapEmphasis(h[2]), criterion: null, sections: [] };
        out.push(ch);
        sec = null;
      } else if (ch) {
        sec = { title: unwrapEmphasis(h[2]), paragraphs: [] };
        ch.sections.push(sec);
      }
      continue;
    }
    if (!line.trim()) flush();
    else buf.push(line);
  }
  flush();
  return out;
}

/** Vergleichstext: ohne Markdown-Auszeichnung, Listenzeichen und Leerraum-Unterschiede */
export function normalizeText(s: string) {
  return s.replace(/^\s*\|?[\s|:-]*-[\s|:-]*\|?\s*$/gm, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/^\s*(?:\d+\.|[-*•])\s+/gm, '').replace(/[*_`>]/g, '').replace(/\\([.\-()[\]])/g, '$1')
    .replace(/[„“”"«»]/g, '"').replace(/\s+/g, ' ').trim().toLowerCase();
}

const words = (s: string) => normalizeText(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

/** Ähnlichkeit zweier Absätze (Dice über Wörter), 0–1 */
export function similarity(a: string, b: string) {
  const x = words(a);
  const y = words(b);
  if (!x.length && !y.length) return 1;
  const count = new Map<string, number>();
  for (const w of x) count.set(w, (count.get(w) ?? 0) + 1);
  let common = 0;
  for (const w of y) {
    const n = count.get(w) ?? 0;
    if (n > 0) (common++, count.set(w, n - 1));
  }
  return (2 * common) / (x.length + y.length);
}

export const MATCH_MIN = 0.35;
export type AlignOp =
  | { type: 'same'; blockId: string }
  | { type: 'changed'; blockId: string; original: string; proposed: string; similarity: number }
  | { type: 'added'; afterBlockId: string | null; proposed: string }
  | { type: 'removed'; blockId: string; original: string };

type UnitOp = { type: 'pair'; unit: number; para: number } | { type: 'del'; unit: number } | { type: 'ins'; para: number; after: number | null };

/** Globale Ausrichtung wie beim Textvergleich: Paare ab MATCH_MIN Ähnlichkeit, gleiche Reihenfolge */
function alignUnits(units: string[], paragraphs: string[]): UnitOp[] {
  const n = units.length;
  const m = paragraphs.length;
  const sim = units.map((u) => paragraphs.map((p) => similarity(u, p)));
  const score: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      const pair = sim[i][j] >= MATCH_MIN ? sim[i][j] + score[i + 1][j + 1] : -Infinity;
      score[i][j] = Math.max(pair, score[i + 1][j], score[i][j + 1]);
    }
  }
  const ops: UnitOp[] = [];
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    if (i < n && j < m && sim[i][j] >= MATCH_MIN && score[i][j] === sim[i][j] + score[i + 1][j + 1]) ops.push({ type: 'pair', unit: i++, para: j++ });
    else if (i < n && (j >= m || score[i][j] === score[i + 1][j])) ops.push({ type: 'del', unit: i++ });
    else ops.push({ type: 'ins', para: j++, after: i > 0 ? i - 1 : null });
  }
  return ops;
}

const PART_SPLIT = /\n[ \t]*\n/;

/**
 * Absätze einer Kapitelversion (Reihenfolge eines Abschnitts) den zurückgelesenen Absätzen zuordnen. Ein Absatz mit
 * Leerzeilen (z. B. Einleitung und Liste) steht in Word als mehrere Absätze – er wird in Teile zerlegt, die Teile werden
 * ausgerichtet und danach wieder zum Absatz zusammengesetzt. Übrige Word-Absätze gelten als neu, fehlende als entfallen.
 */
export function alignBlocks(blocks: { id: string; text: string }[], paragraphs: string[]): AlignOp[] {
  const units: { block: number; text: string }[] = [];
  blocks.forEach((b, k) => {
    const parts = b.text.split(PART_SPLIT).map((t) => t.trim()).filter(Boolean);
    for (const t of parts.length ? parts : ['']) units.push({ block: k, text: t });
  });
  const ops = alignUnits(units.map((u) => u.text), paragraphs);
  // je Absatz: Teile (gleich/geändert/fehlt) und dazwischen eingefügte Word-Absätze; danach eingefügte gehören dahinter
  const parts: { kept: number; text: string[]; changed: boolean }[] = blocks.map(() => ({ kept: 0, text: [], changed: false }));
  const after = new Map<number, string[]>();
  const before: string[] = [];
  const lastUnit = new Map<number, number>();
  units.forEach((u, idx) => lastUnit.set(u.block, idx));
  for (const op of ops) {
    if (op.type === 'pair') {
      const u = units[op.unit];
      const p = parts[u.block];
      p.kept++;
      p.text.push(paragraphs[op.para]);
      if (normalizeText(u.text) !== normalizeText(paragraphs[op.para])) p.changed = true;
    } else if (op.type === 'del') parts[units[op.unit].block].changed = true;
    else if (op.after === null) before.push(paragraphs[op.para]);
    else {
      const u = units[op.after];
      // zwischen zwei Teilen desselben Absatzes eingefügt → Teil des Absatzes
      if (lastUnit.get(u.block) !== op.after) {
        parts[u.block].text.push(paragraphs[op.para]);
        parts[u.block].changed = true;
      } else after.set(u.block, [...(after.get(u.block) ?? []), paragraphs[op.para]]);
    }
  }
  const out: AlignOp[] = before.map((t) => ({ type: 'added', afterBlockId: null, proposed: t }));
  blocks.forEach((b, k) => {
    const p = parts[k];
    if (!p.kept) out.push({ type: 'removed', blockId: b.id, original: b.text });
    else if (!p.changed) out.push({ type: 'same', blockId: b.id });
    else {
      const proposed = p.text.join('\n\n');
      out.push({ type: 'changed', blockId: b.id, original: b.text, proposed, similarity: Math.round(similarity(b.text, proposed) * 100) / 100 });
    }
    for (const t of after.get(k) ?? []) out.push({ type: 'added', afterBlockId: b.id, proposed: t });
  });
  return out;
}

/** Wortvergleich für die Anzeige: gleiche, entfernte und neue Abschnitte (Leerzeichen bleiben am Wort) */
export function wordDiff(a: string, b: string): { op: '=' | '-' | '+'; text: string }[] {
  const x = a.match(/\s*\S+/g) ?? [];
  const y = b.match(/\s*\S+/g) ?? [];
  const key = (t: string) => t.trim();
  const L: number[][] = Array.from({ length: x.length + 1 }, () => new Array<number>(y.length + 1).fill(0));
  for (let i = x.length - 1; i >= 0; i--) for (let j = y.length - 1; j >= 0; j--) L[i][j] = key(x[i]) === key(y[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out: { op: '=' | '-' | '+'; text: string }[] = [];
  const push = (op: '=' | '-' | '+', text: string) => {
    const prev = out[out.length - 1];
    if (prev && prev.op === op) prev.text += text;
    else out.push({ op, text });
  };
  let i = 0;
  let j = 0;
  while (i < x.length && j < y.length) {
    if (key(x[i]) === key(y[j])) (push('=', y[j]), i++, j++);
    else if (L[i + 1][j] >= L[i][j + 1]) push('-', x[i++]);
    else push('+', y[j++]);
  }
  while (i < x.length) push('-', x[i++]);
  while (j < y.length) push('+', y[j++]);
  return out;
}
