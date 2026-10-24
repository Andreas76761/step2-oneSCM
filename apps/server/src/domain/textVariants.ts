// Textvarianten je Kapitel (ADR-105, S-05): Endanwender, Fachtext und Kurzfassung für das Management (~¼ der Länge).
// Reine Fachlogik ohne I/O; die Kurzfassung entsteht regelbasiert (extraktiv) oder über den KI-Dienst.
import { segmentSentences } from './style.js';

export const TEXT_VARIANTS = ['enduser', 'expert', 'summary'] as const;
export type TextVariant = (typeof TEXT_VARIANTS)[number];
export const TEXT_VARIANT_LABEL: Record<TextVariant, string> = { enduser: 'Endanwender', expert: 'Fachtext', summary: 'Kurzfassung (Management)' };
export const TEXT_VARIANT_HINT: Record<TextVariant, string> = {
  enduser: 'Was zu tun ist: Zweck, Voraussetzungen, Schritte, Ergebnis und Hinweise – ohne Rollen, Geltungsbereich und Quellenstatus.',
  expert: 'Vollständiges Kapitel mit Rollen, Zuständigkeiten, Geltungsbereich und Quellen- und Freigabestatus.',
  summary: 'Etwa ein Viertel der Länge: Zweck, Ergebnis, wichtige Hinweise und der Ablauf in einem Satz.',
};
/** Abschnitte der Endanwender-Fassung */
export const ENDUSER_SECTIONS = ['purpose', 'prerequisites', 'steps', 'result', 'hints'];
/** Zielanteil der Kurzfassung am Fachtext */
export const SUMMARY_RATIO = 0.25;
export const SUMMARY_MAX_RATIO = 0.4;

export interface VariantBlock { kind: string; text: string }
export interface VariantSection { code: string; title: string; blocks: VariantBlock[] }

const WORD = /[\p{L}\p{N}][\p{L}\p{N}\-]*/gu;
export const wordCount = (s: string) => (s.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').match(WORD) ?? []).length;
export const sectionsWords = (sections: VariantSection[]) => sections.reduce((n, s) => n + s.blocks.reduce((m, b) => m + wordCount(b.text), 0), 0);

const LIST_ITEM = /^\s*(?:\d+[.)]|[-*•])\s+/;
const plain = (s: string) => s.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\s+/g, ' ').trim();
const firstSentence = (s: string) => {
  const t = plain(s.split('\n').filter((l) => !LIST_ITEM.test(l)).join(' ') || s.replace(LIST_ITEM, ''));
  return segmentSentences(t)[0]?.text.trim() ?? t;
};
const lowerFirst = (s: string) => (/^[A-ZÄÖÜ][a-zäöüß]/.test(s) && !/^(Sie|Ihr|Ihre)\b/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const stripEnd = (s: string) => s.replace(/[.!:;]+$/, '');

/** Schritte eines Kapitels (Listenpunkte im Abschnitt „Schritte“, sonst dessen Sätze) */
export function stepsOf(sections: VariantSection[]) {
  const blocks = sections.find((s) => s.code === 'steps')?.blocks.filter((b) => b.kind !== 'warning' && b.kind !== 'note' && b.kind !== 'tip') ?? [];
  const items = blocks.flatMap((b) => b.text.split('\n').filter((l) => LIST_ITEM.test(l)).map((l) => plain(l.replace(LIST_ITEM, ''))));
  return items.length ? items : blocks.flatMap((b) => segmentSentences(plain(b.text)).map((x) => x.text.trim())).filter(Boolean);
}

/**
 * Kurzfassung extraktiv: Zweck, Ergebnis, Warnungen und der Ablauf („In 4 Schritten: … bis …“), dann Voraussetzungen –
 * in dieser Reihenfolge, bis etwa ein Viertel der Wörter des Fachtexts erreicht ist (der Zweck steht immer darin).
 */
export function extractiveSummary(sections: VariantSection[], ratio = SUMMARY_RATIO) {
  const total = sectionsWords(sections);
  const budget = Math.max(20, Math.round(total * ratio));
  const first = (code: string) => sections.find((s) => s.code === code)?.blocks.find((b) => b.kind !== 'gap' && b.text.trim());
  const parts: string[] = [];
  const purpose = first('purpose');
  if (purpose) parts.push(firstSentence(purpose.text));
  const steps = stepsOf(sections);
  const result = first('result');
  const warnings = sections.flatMap((s) => s.blocks.filter((b) => b.kind === 'warning')).map((b) => `Wichtig: ${lowerFirst(firstSentence(b.text))}`);
  const flow = steps.length > 2 ? `Ablauf in ${steps.length} Schritten: von „${stripEnd(steps[0])}“ bis „${stripEnd(steps[steps.length - 1])}“.`
    : steps.length ? `Ablauf: ${steps.map(stripEnd).join(', dann ')}.` : '';
  const pre = first('prerequisites');
  const candidates = [result ? firstSentence(result.text) : '', ...warnings, flow, pre ? `Voraussetzung: ${lowerFirst(firstSentence(pre.text))}` : ''].filter(Boolean);
  let words = parts.reduce((n, p) => n + wordCount(p), 0);
  for (const c of candidates) {
    const w = wordCount(c);
    if (parts.length && words + w > budget) continue;
    parts.push(c);
    words += w;
  }
  return parts.map((p) => (/[.!?“]$/.test(p) ? p : `${p}.`)).join(' ');
}

/** Zahlen und Kennungen (z. B. 30, E-4711, 2026.3) einer Kurzfassung, die nicht im Fachtext stehen – erfundene Fakten */
export function inventedFacts(summary: string, source: string) {
  const facts = (s: string) => new Set((s.match(/\b(?:[A-Z]{1,5}-)?\d+(?:[.,]\d+)*\b/g) ?? []).map((x) => x.replace(',', '.')));
  const src = facts(source);
  return [...facts(summary)].filter((f) => !src.has(f));
}

/** Markdown einer Variante */
export function variantMarkdown(title: string, sections: VariantSection[]) {
  return [`# ${title}`, ...sections.flatMap((s) => [`## ${s.title}`, ...s.blocks.map((b) => b.text)])].join('\n\n') + '\n';
}
