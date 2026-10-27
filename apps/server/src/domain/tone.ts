// Tonalität je Produktart und Rolle (ADR-102, S-02): Einstellung je Projekt, wirkt auf die Stilprüfung und die KI-Vorschläge.
// Grundlage ist TONALITAET.md des Arbeitsordners (Ton je Produktart). Reine Fachlogik ohne I/O.
import { ROLES } from './reference.js';

export const TONES = ['factual', 'friendly', 'formal', 'concise'] as const;
export type Tone = (typeof TONES)[number];
export const TONE_LABEL: Record<Tone, string> = { factual: 'sachlich', friendly: 'freundlich', formal: 'formell', concise: 'knapp' };
/** Beschreibung für Oberfläche und KI-Anweisung */
export const TONE_HINT: Record<Tone, string> = {
  factual: 'sachlich, vollständig, anleitend; ohne Werbesprache',
  friendly: 'freundlich und zugewandt, erklärend; Hinweise als Empfehlung statt als Verbot, ohne Druck',
  formal: 'formell und präzise; keine Umgangssprache, keine Verkürzungen („gibt’s“), keine Emojis',
  concise: 'knapp, auf das Nötigste reduziert; kurze Sätze (höchstens 15 Wörter), keine Einleitungsfloskeln',
};

/** Produktarten aus TONALITAET.md bzw. 05_I_Output */
export const PRODUCTS = ['manual', 'releaseletter', 'quickguide', 'training', 'internal', 'video', 'graphic', 'process'] as const;
export type Product = (typeof PRODUCTS)[number];
export const PRODUCT_LABEL: Record<Product, string> = {
  manual: 'Handbuch', releaseletter: 'Releaseletter', quickguide: 'Quick Guide', training: 'Schulungsmaterial', internal: 'Interne Dokumente',
  video: 'Videos', graphic: 'Grafiken', process: 'Prozesse',
};
/** Ton je Produktart laut TONALITAET.md */
export const DEFAULT_PRODUCT_TONE: Record<Product, Tone> = {
  manual: 'factual', releaseletter: 'concise', quickguide: 'concise', training: 'friendly', internal: 'formal', video: 'friendly', graphic: 'concise', process: 'factual',
};
/** Rollenprofile: alle Rollen der Steuerung außer „Alle“ */
export const TONE_ROLES = ROLES.map((r) => r.code as string).filter((c) => c !== 'all');

export interface ToneSettings {
  /** Ton je Produktart; ohne Eintrag gilt der Ton aus TONALITAET.md */
  products: Partial<Record<Product, Tone>>;
  /** Ton je Rolle: gilt für Absätze, die nur dieser einen Rolle zugeordnet sind */
  roles: Partial<Record<string, Tone>>;
}
export const DEFAULT_TONE_SETTINGS: ToneSettings = { products: {}, roles: {} };

export const isTone = (v: unknown): v is Tone => typeof v === 'string' && (TONES as readonly string[]).includes(v);
export const isProduct = (v: unknown): v is Product => typeof v === 'string' && (PRODUCTS as readonly string[]).includes(v);

/** Bereinigen und prüfen; Fehlertext für die API, sonst die Einstellung */
export function cleanToneSettings(v: unknown): ToneSettings | string {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return 'tone ist ein Objekt mit products und roles.';
  const o = v as Record<string, unknown>;
  const out: ToneSettings = { products: {}, roles: {} };
  for (const [key, target, allowed] of [['products', out.products, PRODUCTS], ['roles', out.roles, TONE_ROLES]] as const) {
    const m = o[key];
    if (m === undefined || m === null) continue;
    if (typeof m !== 'object' || Array.isArray(m)) return `tone.${key} ist ein Objekt.`;
    for (const [k, t] of Object.entries(m as Record<string, unknown>)) {
      if (!(allowed as readonly string[]).includes(k)) return `tone.${key}: „${k}“ ist unbekannt (erlaubt: ${allowed.join(', ')}).`;
      if (t === null || t === '') continue;
      if (!isTone(t)) return `tone.${key}.${k}: erlaubt sind ${TONES.join(', ')}.`;
      (target as Record<string, Tone>)[k] = t;
    }
  }
  return out;
}

/**
 * Wirksamer Ton: Rollenprofil, wenn der Text genau einer Rolle (außer „Alle“) zugeordnet ist und für sie ein Ton eingestellt ist;
 * sonst der Ton der Produktart (Standard Handbuch).
 */
export function resolveTone(s: ToneSettings, opts: { product?: Product; roles?: string[] } = {}): { tone: Tone; source: 'role' | 'product' | 'default'; role?: string } {
  const specific = (opts.roles ?? []).filter((r) => r !== 'all');
  if (specific.length === 1 && s.roles[specific[0]]) return { tone: s.roles[specific[0]]!, source: 'role', role: specific[0] };
  const product = opts.product ?? 'manual';
  if (s.products[product]) return { tone: s.products[product]!, source: 'product' };
  return { tone: DEFAULT_PRODUCT_TONE[product], source: 'default' };
}

/** Übersicht für die Oberfläche: wirksamer Ton je Produktart und Rolle */
export function toneOverview(s: ToneSettings) {
  return {
    products: PRODUCTS.map((p) => ({ product: p, label: PRODUCT_LABEL[p], tone: s.products[p] ?? null, effective: resolveTone(s, { product: p }).tone, default: DEFAULT_PRODUCT_TONE[p] })),
    roles: TONE_ROLES.map((r) => ({ role: r, label: ROLES.find((x) => x.code === r)!.label, tone: s.roles[r] ?? null })),
    tones: TONES.map((t) => ({ tone: t, label: TONE_LABEL[t], hint: TONE_HINT[t] })),
  };
}

// ---------- Prüfregeln je Ton (Regel „tone“ der Stilprüfung, nur Deutsch) ----------

/** Werbesprache (TONALITAET.md: „ohne Werbesprache, ohne Füllwörter wie einfach, natürlich, schnell“) */
export const PROMO_WORDS = ['einfach', 'natürlich', 'schnell', 'kinderleicht', 'mühelos', 'blitzschnell', 'bequem', 'optimal', 'perfekt', 'genial', 'revolutionär', 'innovativ', 'einzigartig', 'spielend'];
/** Umgangssprachliche Verkürzungen und Emojis – im formellen Ton nicht erlaubt */
const CONTRACTIONS = /(?<![\p{L}])(?:gibt|geht|hat|ist|war|wär|steht|klappt)['’]s(?![\p{L}])|(?<![\p{L}])(?:mal|nen|ne|nem)(?![\p{L}])/giu;
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]|[:;]-?[)(DP](?![\p{L}\d])/gu;
/** Floskeln, die im knappen Ton entfallen */
export const PADDING = ['Bitte beachten Sie, dass', 'Es ist wichtig, dass', 'Es ist zu beachten, dass', 'Im Folgenden', 'An dieser Stelle', 'Wie bereits erwähnt', 'Grundsätzlich gilt', 'In diesem Zusammenhang'];
/** Harte Formulierungen – im freundlichen Ton als Empfehlung formulieren */
const HARSH = ['verboten', 'unbedingt', 'niemals', 'auf keinen Fall', 'Sie müssen', 'zwingend'];
export const CONCISE_MAX_WORDS = 15;

export interface ToneHit { start: number; end: number; severity: 'warning' | 'info'; message: string }

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Fundstellen eines Satzes für den Ton (Positionen relativ zum Satz). Ausrufezeichen meldet schon die Zeichensetzung;
 * `longReported`: der Satz ist bereits als „Langer Satz“ gemeldet.
 */
export function toneHits(sentence: string, tone: Tone, opts: { longReported?: boolean } = {}): ToneHit[] {
  const out: ToneHit[] = [];
  const L = TONE_LABEL[tone];
  const words = (sentence.match(/[\p{L}\d][\p{L}\d'’-]*/gu) ?? []).length;
  if (tone === 'factual' || tone === 'concise') {
    for (const w of PROMO_WORDS) {
      for (const m of sentence.matchAll(new RegExp(String.raw`(?<![\p{L}])${esc(w)}(?![\p{L}])`, 'giu'))) {
        out.push({ start: m.index!, end: m.index! + m[0].length, severity: 'info', message: `Ton „${L}“: Werbesprache „${m[0]}“ – streichen oder sachlich belegen` });
      }
    }
  }
  if (tone === 'formal') {
    for (const m of sentence.matchAll(CONTRACTIONS)) out.push({ start: m.index!, end: m.index! + m[0].length, severity: 'warning', message: `Ton „${L}“: umgangssprachliche Verkürzung „${m[0]}“ – ausschreiben` });
    for (const m of sentence.matchAll(EMOJI)) out.push({ start: m.index!, end: m.index! + m[0].length, severity: 'warning', message: `Ton „${L}“: Emoji bzw. Smiley entfernen` });
  }
  if (tone === 'concise') {
    if (words > CONCISE_MAX_WORDS && !opts.longReported) out.push({ start: 0, end: sentence.length, severity: 'info', message: `Ton „${L}“: ${words} Wörter – höchstens ${CONCISE_MAX_WORDS} je Satz` });
    for (const p of PADDING) {
      for (const m of sentence.matchAll(new RegExp(String.raw`(?<![\p{L}])${esc(p)}(?![\p{L}])`, 'giu'))) out.push({ start: m.index!, end: m.index! + m[0].length, severity: 'info', message: `Ton „${L}“: Floskel „${m[0]}“ – direkt formulieren` });
    }
  }
  if (tone === 'friendly') {
    for (const h of HARSH) {
      for (const m of sentence.matchAll(new RegExp(String.raw`(?<![\p{L}])${esc(h)}(?![\p{L}])`, 'gu'))) out.push({ start: m.index!, end: m.index! + m[0].length, severity: 'info', message: `Ton „${L}“: „${m[0]}“ wirkt streng – als Empfehlung formulieren („Bitte …“, „Wir empfehlen …“)` });
    }
  }
  return out;
}
