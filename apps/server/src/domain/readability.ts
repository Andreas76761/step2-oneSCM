// Lesbarkeit (ADR-097, S-01): Kennzahlen je Kapitel – LIX, Flesch-Amstad (deutsche Fassung des Flesch-Index), Ø Wörter je
// Satz, Anteil langer Sätze und Passivanteil – mit Sollwerten je Zielgruppe (Endanwender bzw. Fachanwender/Admin).
import { segmentSentences } from './style.js';

export type Audience = 'enduser' | 'expert';
export const AUDIENCES: Audience[] = ['enduser', 'expert'];
export const AUDIENCE_LABEL: Record<Audience, string> = { enduser: 'Endanwender (z. B. Dealer)', expert: 'Fachanwender und Administration' };

/** Sollwerte (Checkliste „Benutzerhandbuch“, Multi-Agent-Gate): Flesch ≥ 60 bzw. ≥ 40, Ø ≤ 15 Wörter, höchstens 25 Wörter je Satz */
export const TARGETS: Record<Audience, { fleschMin: number; lixMax: number; avgWordsMax: number; longShareMax: number; passiveShareMax: number }> = {
  enduser: { fleschMin: 60, lixMax: 50, avgWordsMax: 15, longShareMax: 10, passiveShareMax: 20 },
  expert: { fleschMin: 40, lixMax: 55, avgWordsMax: 20, longShareMax: 20, passiveShareMax: 30 },
};
export const LONG_WORDS = 25;

const WORD = /[\p{L}][\p{L}\p{N}\-]*/gu;
const PASSIVE = /(?<![\p{L}])(?:wird|werden|wurde|wurden)(?![\p{L}])[^.!?]*?(?<![\p{L}])(?:ge\p{Ll}+(?:t|en)|\p{Ll}+iert)(?![\p{L}])/u;

/** Silben eines deutschen Wortes, angenähert über Vokalgruppen (Diphthonge ei, ie, au, eu, äu zählen als eine) */
export function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-zäöüßy]/g, '');
  if (!w) return 0;
  const groups = w.replace(/(?:ei|ie|au|eu|äu|ai|ey|oi)/g, 'a').match(/[aeiouäöüy]+/g);
  return Math.max(1, groups?.length ?? 1);
}

/** Text ohne Markdown-Auszeichnung, Bilder, Links, Code und Tabellen */
function plain(text: string) {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`[^`]*`/g, ' ')
    .split('\n').filter((l) => !/^\s*\|/.test(l)).join('\n')
    .replace(/^\s*(?:#{1,6}|\d+\.|[-*>])\s+/gm, '')
    .replace(/[*_]/g, '');
}

export interface Readability {
  sentences: number;
  words: number;
  avgWords: number;
  longShare: number;
  passiveShare: number;
  lix: number;
  flesch: number;
}

export function readability(texts: string[]): Readability {
  let sentences = 0;
  let words = 0;
  let long = 0;
  let passive = 0;
  let longWords = 0;
  let syl = 0;
  for (const t of texts) {
    for (const s of segmentSentences(plain(t))) {
      const ws = s.text.match(WORD) ?? [];
      if (!ws.length) continue;
      sentences++;
      words += ws.length;
      if (ws.length > LONG_WORDS) long++;
      if (PASSIVE.test(s.text)) passive++;
      for (const w of ws) {
        if (w.length > 6) longWords++;
        syl += syllables(w);
      }
    }
  }
  if (!sentences || !words) return { sentences: 0, words: 0, avgWords: 0, longShare: 0, passiveShare: 0, lix: 0, flesch: 0 };
  const asl = words / sentences;
  const asw = syl / words;
  const round = (n: number) => Math.round(n * 10) / 10;
  return {
    sentences, words,
    avgWords: round(asl),
    longShare: Math.round((long / sentences) * 100),
    passiveShare: Math.round((passive / sentences) * 100),
    lix: Math.round(asl + (longWords * 100) / words),
    // Flesch-Amstad: 180 − ASL − 58,5 × ASW, begrenzt auf 0–100
    flesch: Math.max(0, Math.min(100, Math.round(180 - asl - 58.5 * asw))),
  };
}

export const lixLabel = (lix: number) => (lix < 40 ? 'leicht' : lix <= 50 ? 'mittel' : 'schwer');

/** Kennzahlen gegen die Sollwerte der Zielgruppe */
export function assessReadability(r: Readability, audience: Audience) {
  const t = TARGETS[audience];
  const checks = [
    { code: 'flesch', label: `Flesch-Amstad mindestens ${t.fleschMin}`, value: r.flesch, ok: r.flesch >= t.fleschMin },
    { code: 'lix', label: `LIX höchstens ${t.lixMax} (${lixLabel(r.lix)})`, value: r.lix, ok: r.lix <= t.lixMax },
    { code: 'avg_words', label: `Ø höchstens ${t.avgWordsMax} Wörter je Satz`, value: r.avgWords, ok: r.avgWords <= t.avgWordsMax },
    { code: 'long_share', label: `höchstens ${t.longShareMax} % Sätze über ${LONG_WORDS} Wörter`, value: r.longShare, ok: r.longShare <= t.longShareMax },
    { code: 'passive_share', label: `höchstens ${t.passiveShareMax} % Sätze im Passiv`, value: r.passiveShare, ok: r.passiveShare <= t.passiveShareMax },
  ];
  return { ...r, audience, audienceLabel: AUDIENCE_LABEL[audience], targets: t, checks, ok: r.sentences > 0 && checks.every((c) => c.ok), lixLabel: lixLabel(r.lix) };
}
