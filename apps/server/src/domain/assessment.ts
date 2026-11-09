// Kapitelbewertung (ADR-103, S-07) und Plausibilität Text ↔ Quellen je Aussage (W-02). Reine Fachlogik ohne I/O.
import { checkSentences, type RewriteSource } from './rewrite.js';
import { segmentSentences } from './style.js';

// ---------- W-02: Plausibilität je Aussage ----------

export const STATEMENT_CLASSES = ['supported', 'unsupported', 'contradiction', 'missing'] as const;
export type StatementClass = (typeof STATEMENT_CLASSES)[number];
export const STATEMENT_LABEL: Record<StatementClass, string> = { supported: 'belegt', unsupported: 'unbelegt', contradiction: 'Widerspruch', missing: 'fehlend' };

export interface StatementSource extends RewriteSource {
  /** Quelle bestätigt (source_confirmed, manually_confirmed) */
  confirmed: boolean;
  /** Quelle in einem offenen Widerspruch der Qualitätsanalyse oder per Entscheidung ausgeschlossen */
  contradicted: boolean;
}

export interface Statement { blockId: string; section: string; text: string; class: StatementClass; support: number | null; reason: string; sources: number[] }

/** Kennzeichen am Satzanfang (Listenpunkt, Hinweisart) zählen nicht zur Aussage */
const clean = (s: string) => s.replace(/^\s*(?:\d+\.|[-*•])\s+/, '').replace(/^\*\*[^*]+:\*\*\s*/, '').trim();

/**
 * Aussagen eines Absatzes einstufen:
 * - **Widerspruch:** eine zitierte Quelle steht in einem offenen Widerspruch bzw. ist ausgeschlossen;
 * - **belegt:** der Satz ist durch bestätigte Quellen gedeckt (Inhaltswörter, keine neuen Zahlen);
 * - **unbelegt:** keine Quelle, nur unbestätigte Quellen oder der Satz geht über die Quellen hinaus;
 * - **fehlend:** Lücke im Kapitel (Thema ohne bestätigte Quelle).
 * Überschriften, Querverweise und Bilder sind keine Aussagen.
 */
export function classifyBlock(b: { id: string; section: string; kind: string; text: string }, sources: StatementSource[], minSupport: number): Statement[] {
  if (b.kind === 'xref') return [];
  if (b.kind === 'gap') return [{ blockId: b.id, section: b.section, text: b.text, class: 'missing', support: null, reason: 'Lücke: Thema ohne bestätigte Quelle', sources: [] }];
  const sentences = segmentSentences(b.text).map((s) => clean(s.text)).filter((t) => t && !/^!\[[^\]]*\]\([^)]*\)$/.test(t) && !/^#{1,6}\s/.test(t) && /\p{L}{3}/u.test(t));
  const out: Statement[] = [];
  const confirmed = sources.filter((s) => s.confirmed && !s.contradicted);
  for (const text of sentences) {
    const base = { blockId: b.id, section: b.section, text };
    if (!sources.length) {
      out.push({ ...base, class: 'unsupported', support: null, reason: 'Absatz ohne Quelle', sources: [] });
      continue;
    }
    const [all] = checkSentences([{ text, sources: sources.map((s) => s.label) }], sources, { minSupport });
    const hit = (s: StatementSource) => checkSentences([{ text, sources: [s.label] }], [s], { minSupport })[0];
    const contradicted = sources.filter((s) => s.contradicted && !hit(s).issues.includes('low_support'));
    if (contradicted.length) {
      out.push({ ...base, class: 'contradiction', support: all.support, reason: 'Quelle steht in einem offenen Widerspruch bzw. ist ausgeschlossen', sources: contradicted.map((s) => s.seq) });
      continue;
    }
    if (!confirmed.length) {
      out.push({ ...base, class: 'unsupported', support: all.support, reason: 'nur unbestätigte Quellen', sources: sources.map((s) => s.seq) });
      continue;
    }
    const [c] = checkSentences([{ text, sources: confirmed.map((s) => s.label) }], confirmed, { minSupport });
    if (c.issues.includes('new_numbers')) out.push({ ...base, class: 'unsupported', support: c.support, reason: `Zahl nicht in der Quelle (${c.details.find((d) => d.startsWith('Zahlen')) ?? ''})`.replace(' ()', ''), sources: confirmed.map((s) => s.seq) });
    else if (c.issues.includes('low_support')) out.push({ ...base, class: 'unsupported', support: c.support, reason: 'geht über die Quellen hinaus', sources: confirmed.map((s) => s.seq) });
    else out.push({ ...base, class: 'supported', support: c.support, reason: 'durch bestätigte Quelle gedeckt', sources: confirmed.map((s) => s.seq) });
  }
  return out;
}

/** Wert 0–100: Anteil belegter Aussagen; ein Widerspruch zählt doppelt gegen den Wert */
export function plausibilityValue(statements: Pick<Statement, 'class'>[]) {
  const counts = Object.fromEntries(STATEMENT_CLASSES.map((c) => [c, statements.filter((s) => s.class === c).length])) as Record<StatementClass, number>;
  const weight = counts.supported + counts.unsupported + counts.missing + 2 * counts.contradiction;
  return { value: weight ? Math.round((100 * counts.supported) / weight) : 100, counts };
}

// ---------- S-07: Kapitelbewertung mit Ampel ----------

export const CRITERIA = ['language', 'goal', 'tone', 'sources', 'facts'] as const;
export type Criterion = (typeof CRITERIA)[number];
export const CRITERION_LABEL: Record<Criterion, string> = { language: 'Sprache', goal: 'Ziel', tone: 'Tonalität', sources: 'Quellenabgleich', facts: 'Fakten' };
export const CRITERION_HINT: Record<Criterion, string> = {
  language: 'Stilwert der Sätze und Lesbarkeit mit Sollwerten der Zielgruppe',
  goal: 'Anleitungs-Check: Zweck, Voraussetzungen, Schritte, Ergebnis, Warnhinweise',
  tone: 'Anteil der Sätze ohne Befund der Regel „Tonalität“',
  sources: 'Plausibilität je Aussage: belegt, unbelegt, Widerspruch, fehlend',
  facts: 'Zahlen und Kennungen im Text, die auch in den Quellen stehen',
};
export type Traffic = 'green' | 'yellow' | 'red';
export const TRAFFIC_LABEL: Record<Traffic, string> = { green: 'grün', yellow: 'gelb', red: 'rot' };
/** Schwellen der Ampel je Kriterium */
export const GREEN_FROM = 80;
export const YELLOW_FROM = 60;
export const traffic = (v: number): Traffic => (v >= GREEN_FROM ? 'green' : v >= YELLOW_FROM ? 'yellow' : 'red');

/** Gesamt = Mittelwert; die Ampel ist höchstens so gut wie das schwächste Kriterium */
export function overall(values: Record<Criterion, number>) {
  const v = Math.round(CRITERIA.reduce((n, c) => n + values[c], 0) / CRITERIA.length);
  const all = [traffic(v), ...CRITERIA.map((c) => traffic(values[c]))];
  return { value: v, traffic: (all.includes('red') ? 'red' : all.includes('yellow') ? 'yellow' : 'green') as Traffic };
}

const FACT = /(?<![\p{L}\d])(?:\d+(?:[.,]\d+)*(?:\s?%)?|[A-Z]{1,6}-\d{2,})(?![\p{L}\d])/gu;
/** Fakten-Wert: Anteil der Zahlen und Kennungen im Text, die in den Quellen des Absatzes vorkommen (ohne Schrittnummern) */
export function factValue(blocks: { text: string; sourceText: string }[]) {
  let total = 0;
  let found = 0;
  const missing: string[] = [];
  for (const b of blocks) {
    const text = b.text.replace(/^\s*\d+\.\s+/gm, '').replace(/\(media:[a-f0-9]+\)/g, '');
    const src = b.sourceText.replace(/\s/g, '');
    for (const m of text.matchAll(FACT)) {
      total++;
      if (src.includes(m[0].replace(/\s/g, ''))) found++;
      else if (missing.length < 10) missing.push(m[0]);
    }
  }
  return { value: total ? Math.round((100 * found) / total) : 100, total, found, missing };
}
