// Kapitelanweisung (ADR-096): je Kapitel und Unterkapitel eine kurze Anleitung, wichtige Themen und Themen, die nicht
// beschrieben werden. Sie gilt mit Vorrang für Generator, KI-Vorschläge und Anleitungs-Check – Quellenbindung und
// Datenschutz gehen ihr vor.

export interface Instruction {
  text: string | null;
  topics: string[];
  excluded: string[];
}

export const MAX_TOPICS = 30;
export const MAX_INSTRUCTION = 2000;
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Thema kommt im Text vor: Wortanfang muss passen, Endungen sind frei („Kündigung“ findet „Kündigungen“) */
export function mentions(text: string, topic: string): boolean {
  const t = topic.trim();
  if (t.length < 3) return false;
  return new RegExp(`(?<![\\p{L}\\d])${escapeRe(t).replace(/\s+/g, '\\s+')}`, 'iu').test(text);
}

/** Themenliste bereinigen: getrimmt, ohne Dubletten (Groß-/Kleinschreibung egal), 3–80 Zeichen */
export function cleanTopics(v: unknown, field: string): string[] {
  if (v === null || v === undefined) return [];
  const list = typeof v === 'string' ? v.split(/\r?\n|;/) : v;
  if (!Array.isArray(list)) throw new Error(`${field} ist eine Liste von Themen.`);
  const out: string[] = [];
  for (const x of list) {
    if (typeof x !== 'string') throw new Error(`${field} ist eine Liste von Themen.`);
    const t = x.replace(/\s+/g, ' ').trim();
    if (!t) continue;
    if (t.length < 3 || t.length > 80) throw new Error(`${field}: „${t.slice(0, 40)}“ – je Thema 3 bis 80 Zeichen.`);
    if (!out.some((o) => o.toLowerCase() === t.toLowerCase())) out.push(t);
  }
  if (out.length > MAX_TOPICS) throw new Error(`${field}: höchstens ${MAX_TOPICS} Themen.`);
  return out;
}

/** Anweisung von Kapitel und Unterkapitel zusammenführen – das Unterkapitel ergänzt, es hebt nichts auf */
export function mergeInstructions(chapter: Instruction, sub?: Instruction | null): Instruction {
  if (!sub) return chapter;
  const uniq = (a: string[]) => a.filter((x, i) => a.findIndex((y) => y.toLowerCase() === x.toLowerCase()) === i);
  return {
    text: [chapter.text, sub.text].filter(Boolean).join('\n') || null,
    topics: uniq([...chapter.topics, ...sub.topics]),
    excluded: uniq([...chapter.excluded, ...sub.excluded]),
  };
}

export const isEmpty = (i: Instruction) => !i.text?.trim() && !i.topics.length && !i.excluded.length;

/** Prüfung eines Textes gegen die Anweisung: erwähnte ausgeschlossene Themen, fehlende wichtige Themen */
export function checkAgainst(i: Instruction, blocks: { id: string; text: string }[]) {
  const excludedMentioned = i.excluded.flatMap((topic) => blocks.filter((b) => mentions(b.text, topic)).map((b) => ({ topic, blockId: b.id })));
  const topicsMissing = i.topics.filter((topic) => !blocks.some((b) => mentions(b.text, topic)));
  return { excludedMentioned, topicsMissing, ok: !excludedMentioned.length && !topicsMissing.length };
}

/** Anweisung als Markdown (für ANWEISUNG.md im Arbeitsordner und den Export) */
export function instructionMarkdown(title: string, i: Instruction, validFrom?: string | null) {
  const out = [`# Anweisung: ${title}`, '', '> Gilt mit hohem Vorrang für alle Arbeiten an diesem Kapitel bzw. Unterkapitel. Vorrang haben nur die Grundregeln (Daten lokal, nichts erfinden, nichts löschen, Datenschutz).', ''];
  if (validFrom) out.push(`**Gültig ab:** ${validFrom}`, '');
  out.push('## Worauf es ankommt', '', i.text?.trim() || '[offen]', '');
  out.push('## Wichtige Themen (müssen vorkommen)', '', ...(i.topics.length ? i.topics.map((t) => `- ${t}`) : ['- [offen]']), '');
  out.push('## Nicht beschreiben', '', ...(i.excluded.length ? i.excluded.map((t) => `- ${t}`) : ['- [offen]']), '');
  return out.join('\n');
}
