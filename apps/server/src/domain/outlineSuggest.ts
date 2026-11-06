// Gliederungs-Vorschlag je Chunk (ADR-084, F-13): passender Punkt der Gesamtgliederung mit Trefferwert 0–1.
// Nie automatisch bestätigt – übernommen wird ein Vorschlag nur von Hand. Rein lexikalisch und lokal:
// Profil je Gliederungspunkt = Name und Beschreibung (doppelt gewichtet) + Namen der über die Zuordnung (ADR-082)
// verbundenen Menüpunkte und Domänen; seltene Wörter zählen mehr. Bonus, wenn der Chunk schon ein verbundenes
// Domänen- oder Menü-Label trägt.
import { stripNumber } from './outline.js';
import { tokenize } from './similarity.js';

export interface OutlineProfileInput {
  id: string; code: string; name: string; description?: string | null;
  /** Namen verbundener Menüpunkte und Domänen */
  linkedNames: string[];
  /** IDs verbundener Domänen- und Menü-Labels */
  linkedLabelIds: string[];
}
export interface OutlineSuggestion { labelId: string; code: string; name: string; score: number; matched: string[] }

export const SUGGEST_MIN_SCORE = 0.25;
const SATURATION = 6; // so viel Gewicht genügt für einen vollen Treffer (≈ drei eigene Wörter)
const LABEL_BONUS = 0.25;

export function buildProfiles(outline: OutlineProfileInput[]) {
  const raw = outline.map((o) => {
    const weights = new Map<string, number>();
    const add = (text: string, w: number) => {
      for (const t of new Set(tokenize(text))) weights.set(t, Math.max(weights.get(t) ?? 0, w));
    };
    add(`${stripNumber(o.name) || o.name} ${o.description ?? ''}`, 2);
    for (const n of o.linkedNames) add(n.replace(/›/g, ' '), 1);
    return { o, weights };
  });
  // seltene Wörter zählen mehr: Gewicht durch Wurzel der Anzahl Profile mit diesem Wort
  const df = new Map<string, number>();
  for (const r of raw) for (const t of r.weights.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  return raw.map(({ o, weights }) => ({
    o, linked: new Set(o.linkedLabelIds),
    weights: new Map([...weights].map(([t, w]) => [t, w / Math.sqrt(df.get(t) ?? 1)])),
  }));
}
export type OutlineProfiles = ReturnType<typeof buildProfiles>;

/** Vorschläge für einen Chunk: höchstens drei, absteigend nach Trefferwert */
export function suggestOutline(profiles: OutlineProfiles, chunk: { text: string; headings: string[]; context?: string[]; labelIds: string[] }, opts: { minScore?: number; limit?: number } = {}): OutlineSuggestion[] {
  // Kapiteltitel der Quelle zählt wie Fließtext (sonst gewinnt er für jeden Abschnitt), Unterüberschriften stärker
  const body = new Set(tokenize(`${chunk.text} ${(chunk.context ?? []).join(' ')}`));
  const head = new Set(tokenize(chunk.headings.join(' ')));
  const labels = new Set(chunk.labelIds);
  const out: (OutlineSuggestion & { raw: number })[] = [];
  for (const p of profiles) {
    let covered = 0;
    const matched: string[] = [];
    for (const [t, w] of p.weights) {
      if (head.has(t)) (covered += w * 1.5, matched.push(t));
      else if (body.has(t)) (covered += w, matched.push(t));
    }
    // Rangfolge nach ungedeckeltem Wert, angezeigt wird höchstens 1
    const raw = covered / SATURATION + ([...p.linked].some((id) => labels.has(id)) ? LABEL_BONUS : 0);
    const score = Math.round(Math.min(1, raw) * 100) / 100;
    if (score >= (opts.minScore ?? SUGGEST_MIN_SCORE)) out.push({ labelId: p.o.id, code: p.o.code, name: p.o.name, score, matched: matched.slice(0, 6), raw });
  }
  return out.sort((a, b) => b.raw - a.raw || a.code.localeCompare(b.code)).slice(0, opts.limit ?? 3).map(({ raw: _raw, ...s }) => s);
}
