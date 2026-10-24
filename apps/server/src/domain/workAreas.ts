// Arbeitsbereiche Pipeline, Backlog und Intern (ADR-098): Einordnung der Jira-Tickets nach Status und Produktionsdatum,
// Vorschlag für Kapitel/Unterkapitel der aktuellen Gliederung über den Titel. Ticket- und Teststatus sind kein Nachweis
// für den Produktivstand – „produktiv“ heißt hier nur: erledigt und Produktionsdatum erreicht; übernommen wird von Hand.
import { statusBucket } from './releaseLetter.js';

export type Area = 'pipeline' | 'backlog' | 'intern';
export const AREAS: Area[] = ['pipeline', 'backlog', 'intern'];
export const AREA_LABEL: Record<Area, string> = { pipeline: 'Pipeline', backlog: 'Backlog', intern: 'Intern' };

export type Topic = 'testing' | 'reporting' | 'systems' | 'migration' | 'rollout' | 'other';
export const TOPICS: Topic[] = ['testing', 'reporting', 'systems', 'migration', 'rollout', 'other'];
export const TOPIC_LABEL: Record<Topic, string> = { testing: 'Testing', reporting: 'Reporting', systems: 'Systeme', migration: 'Migration', rollout: 'Rollout', other: 'Other' };
/** Unterordner von 11_Intern im Arbeitsordner */
export const TOPIC_FOLDER: Record<Topic, string> = { testing: '01_Testing', reporting: '02_Reporting', systems: '03_Systeme', migration: '04_Migration', rollout: '05_Rollout', other: '06_Other' };

export type WorkState = 'open' | 'documented' | 'ready' | 'live' | 'cancelled';
export const STATE_LABEL: Record<WorkState, string> = {
  open: 'offen (noch nicht dokumentiert)', documented: 'bereits dokumentiert', ready: 'produktiv – ins Handbuch übernehmen', live: 'ins Handbuch übernommen', cancelled: 'abgebrochen',
};

export type TicketPlace = Area | 'live' | 'cancelled';

/**
 * Wohin gehört ein Ticket? Offen/Backlog → Backlog; in Bearbeitung oder blockiert → Pipeline; erledigt mit Produktionsdatum
 * in der Zukunft → Pipeline (noch nicht produktiv); erledigt sonst → produktiv; abgebrochen → abgebrochen.
 */
export function placeOf(t: { status: string; productionDate?: string }, today: string): TicketPlace {
  const bucket = statusBucket(t.status);
  if (bucket === 'cancelled') return 'cancelled';
  if (bucket === 'backlog') return 'backlog';
  if (bucket === 'done') return t.productionDate && t.productionDate > today ? 'pipeline' : 'live';
  return 'pipeline';
}

/** Datum als JJJJ-MM-TT; akzeptiert auch TT.MM.JJJJ; leer → null; sonst Fehlermeldung */
export function cleanDate(v: unknown): string | null | 'invalid' {
  const s = String(v ?? '').trim();
  if (!s) return null;
  const de = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(s);
  const iso = de ? `${de[3]}-${de[2].padStart(2, '0')}-${de[1].padStart(2, '0')}` : s;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return 'invalid';
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== iso ? 'invalid' : iso;
}

/** TT.MM.JJJJ für Anzeige und Arbeitsordner (Hausregel Datum, ADR-097) */
export const germanDate = (iso: string | null | undefined) => (iso && /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}` : iso ?? '');

const STOP = new Set(['und', 'oder', 'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'für', 'mit', 'von', 'im', 'in', 'auf', 'zu', 'zum', 'zur', 'bei', 'nach', 'aus', 'the', 'and', 'for', 'with', 'of', 'to', 'new', 'neu', 'neue', 'neuer']);

/** Wortstämme (grob): Kleinbuchstaben, ohne Nummern und Stoppwörter, deutsche Endungen gekürzt */
export function stems(text: string): Set<string> {
  const out = new Set<string>();
  for (const w of text.toLowerCase().normalize('NFC').match(/[\p{L}][\p{L}\-]+/gu) ?? []) {
    if (w.length < 4 || STOP.has(w)) continue;
    out.add(w.replace(/(?:ungen|ung|en|er|es|e|n|s)$/u, '') || w);
  }
  return out;
}

export interface OutlineEntry { chapterId: string; chapterTitle: string; subchapters: { id: string; title: string }[] }

/**
 * Vorschlag Kapitel/Unterkapitel über gemeinsame Wortstämme von Ticket (Zusammenfassung, Komponenten, Labels, Epic) und
 * Titel – mindestens die Hälfte der Wörter des Titels muss im Ticket vorkommen. Nur ein Vorschlag, die Redaktion bestätigt.
 */
export function suggestChapter(ticketText: string, outline: OutlineEntry[]): { chapterId: string; subchapterId: string | null; score: number } | null {
  const t = stems(ticketText);
  if (!t.size) return null;
  const score = (title: string) => {
    const s = stems(title);
    if (!s.size) return 0;
    const hit = [...s].filter((x) => t.has(x)).length;
    return hit / s.size >= 0.5 ? hit + hit / s.size : 0;
  };
  let best: { chapterId: string; subchapterId: string | null; score: number } | null = null;
  for (const c of outline) {
    const cs = score(c.chapterTitle);
    if (cs && (!best || cs > best.score)) best = { chapterId: c.chapterId, subchapterId: null, score: cs };
    for (const s of c.subchapters) {
      // Unterkapitel zählt mit dem Kapitel zusammen: gleiche Trefferzahl → das genauere Unterkapitel gewinnt
      const ss = score(s.title);
      if (ss && (!best || ss + cs * 0.1 >= best.score)) best = { chapterId: c.chapterId, subchapterId: s.id, score: ss + cs * 0.1 };
    }
  }
  return best;
}
