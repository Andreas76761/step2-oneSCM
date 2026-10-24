// Agent TRIAGE (ADR-100): ordnet jedem Chunk nach dem Einlesen die Pflichtlabels zu – lokal, regelbasiert, mit Sicherheit
// und Begründung je Gruppe. Unsichere Gruppen machen den Chunk „zu prüfen“; menschliche Zuordnungen gehen immer vor.
import type { DetailLevel } from './metadataLabels.js';

export interface TriageInput {
  text: string;
  kind: string;
  headingPath: string[];
  path: string;
  sourceFormat: string | null;
  evidenceStatus: string;
  marketCode: string | null;
  releaseCode: string | null;
  roles: string[];
  divisions: string[];
  /** Status des Jira-Tickets, falls die Quelle ein Ticket ist */
  jiraStatus?: string | null;
}
export interface Pick { codes: string[]; confidence: number; reason: string; names?: Record<string, string> }

const count = (text: string, re: RegExp) => (text.match(re) ?? []).length;
const lower = (s: string) => s.toLocaleLowerCase('de');

// ---------------------------------------------------------------- Sprache

const LANG_WORDS: Record<string, RegExp> = {
  de: /\b(?:der|die|das|und|ist|nicht|mit|für|wird|den|ein|eine|sie|im|auf|zu|von)\b/giu,
  en: /\b(?:the|and|is|not|with|for|to|of|in|on|you|this|that|are|be|a)\b/giu,
  fr: /\b(?:le|la|les|et|des|est|une|pour|dans|vous|sur|du)\b/giu,
  it: /\b(?:il|la|che|di|per|una|sono|con|non|del|della)\b/giu,
  es: /\b(?:el|los|las|y|que|para|una|con|por|del|es)\b/giu,
  cs: /\b(?:je|se|na|že|pro|jsou|nebo|jako|také)\b/giu,
};
export const LANGUAGE_NAMES: Record<string, [string, string]> = {
  de: ['Deutsch', 'German'], en: ['Englisch', 'English'], fr: ['Französisch', 'French'], it: ['Italienisch', 'Italian'], es: ['Spanisch', 'Spanish'], cs: ['Tschechisch', 'Czech'],
};

export function detectLanguage(text: string): Pick {
  const scores = Object.entries(LANG_WORDS).map(([code, re]) => [code, count(text, re)] as const).sort((a, b) => b[1] - a[1]);
  const [best, second] = scores;
  const words = Math.max(1, count(text, /\p{L}+/gu));
  if (!best[1]) return { codes: ['de'], confidence: 0.3, reason: 'keine Funktionswörter erkannt – Hauptsprache Deutsch angenommen' };
  const margin = (best[1] - (second?.[1] ?? 0)) / best[1];
  const confidence = Math.min(1, 0.4 + margin * 0.5 + Math.min(0.3, best[1] / words));
  return { codes: [best[0]], confidence, reason: `${best[1]} Funktionswörter ${LANGUAGE_NAMES[best[0]][0]}` };
}

// ---------------------------------------------------------------- Rolle (Dealer, MO, Market, HQ, Sonstiges)

const ROLE_PATTERNS: [string, RegExp][] = [
  ['dealer', /\b(?:dealer|händler|haendler|autohaus|autohäuser|vertragspartner)\w*/iu],
  ['mo', /\b(?:mo|market operations?|mo[- ]checks?|mo[- ]prüfung\w*)\b/iu],
  ['market', /\b(?:market|markt(?:organisation|verantwortlich\w*)?|mpc\d?)\b/iu],
  ['hq', /\b(?:hq|zentrale|headquarters?|hauptverwaltung)\b/iu],
];
const FRONT_ROLE: Record<string, string> = { dealer: 'dealer', mo: 'mo', market: 'market', hq: 'hq' };

export function detectRoles(t: TriageInput): Pick {
  const text = `${t.headingPath.join(' ')} ${t.text}`;
  // „MO“ nur groß geschrieben als Rolle (nicht „mo“ wie Montag)
  const found = ROLE_PATTERNS.filter(([code, re]) => (code === 'mo' ? /\bMO\b|market operation/i.test(text) : re.test(text))).map(([c]) => c);
  // „Markt“ allein ist meist der Ländermarkt, nicht die Rolle: nur mit Rollenbezug
  const market = found.includes('market') && !/\b(?:markt|market)\s+(?:prüft|gibt|legt|pflegt|sieht|freigabe|approves|reviews)|\bmpc\d?\b|marktorganisation|marktverantwortlich/iu.test(text);
  const codes = found.filter((c) => !(c === 'market' && market));
  const front = t.roles.filter((r) => FRONT_ROLE[r]).map((r) => FRONT_ROLE[r]);
  if (t.roles.includes('all')) return { codes: ['dealer', 'mo', 'market', 'hq'], confidence: 0.8, reason: 'Quelle gilt für alle Rollen' };
  const all = [...new Set([...front, ...codes])];
  if (front.length) return { codes: all, confidence: 0.9, reason: `Rolle aus den Quellangaben (${front.join(', ')})` };
  if (all.length) return { codes: all, confidence: 0.7, reason: `Rolle im Text genannt (${all.join(', ')})` };
  return { codes: ['other'], confidence: 0.35, reason: 'keine Rolle erkennbar – Sonstiges' };
}

// ---------------------------------------------------------------- Sparte (Pkw, Van, Pkw+Van)

export function detectDivision(t: TriageInput): Pick {
  const specific = t.divisions.filter((d) => d === 'car' || d === 'van');
  if (t.divisions.includes('all') || specific.length === 2) return { codes: ['all'], confidence: 0.85, reason: 'Quelle gilt für Pkw und Van' };
  if (specific.length === 1) return { codes: specific, confidence: 0.9, reason: `Sparte aus den Quellangaben (${specific[0] === 'car' ? 'Pkw' : 'Van'})` };
  const text = `${t.headingPath.join(' ')} ${t.text}`;
  const car = /\b(?:pkw|car|cars|personenwagen)\b/iu.test(text);
  const van = /\b(?:van|vans|transporter|kleintransporter)\b/iu.test(text);
  if (car && van) return { codes: ['all'], confidence: 0.7, reason: 'Pkw und Van im Text' };
  if (car || van) return { codes: [car ? 'car' : 'van'], confidence: 0.65, reason: `${car ? 'Pkw' : 'Van'} im Text` };
  return { codes: ['all'], confidence: 0.5, reason: 'keine Sparte genannt – gilt für Pkw+Van' };
}

// ---------------------------------------------------------------- Markt

const MARKET_RE = /\b(?:[Mm]arkt|[Mm]arket|[Ll]and|[Cc]ountry)\s+([A-Z]{2})\b|\(([A-Z]{2})\)/g;
const ISO = new Set(['DE', 'AT', 'CH', 'FR', 'IT', 'ES', 'PT', 'NL', 'BE', 'LU', 'GB', 'IE', 'PL', 'CZ', 'SK', 'HU', 'SE', 'DK', 'NO', 'FI', 'KR', 'MY', 'JP', 'CN', 'US', 'TR', 'IN']);

export function detectMarkets(t: TriageInput): Pick {
  if (t.marketCode && /^[A-Z]{2}$/i.test(t.marketCode)) return { codes: [t.marketCode.toLowerCase()], confidence: 0.9, reason: `Markt aus den Quellangaben (${t.marketCode.toUpperCase()})` };
  const found = new Set<string>();
  for (const m of t.text.matchAll(MARKET_RE)) {
    const code = (m[1] ?? m[2])!;
    if (ISO.has(code)) found.add(code.toLowerCase());
  }
  if (found.size) return { codes: [...found], confidence: 0.65, reason: `Markt im Text (${[...found].map((x) => x.toUpperCase()).join(', ')})` };
  return { codes: ['all'], confidence: 0.6, reason: 'kein Markt genannt – marktübergreifend' };
}

// ---------------------------------------------------------------- Version

const VERSION_RE = /\b(?:PI\s?(\d{1,3})|Release\s+(\d{2,4}(?:\.\d{1,2})?)|Version\s+(\d+(?:\.\d+){0,2})|v(\d+\.\d+(?:\.\d+)?)|(20\d{2}\.\d{1,2}))\b/i;

export function versionSlug(v: string) {
  return v.trim().toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9.-]/g, '-').slice(0, 40);
}

export function detectVersion(t: TriageInput): Pick {
  if (t.releaseCode) return { codes: [versionSlug(t.releaseCode)], confidence: 0.9, reason: `Release aus den Quellangaben (${t.releaseCode})`, names: { [versionSlug(t.releaseCode)]: t.releaseCode } };
  const m = VERSION_RE.exec(`${t.headingPath.join(' ')} ${t.text} ${t.path}`);
  if (m) {
    const name = m[1] ? `PI ${m[1]}` : m[2] ? `Release ${m[2]}` : m[3] ? `Version ${m[3]}` : m[4] ? `v${m[4]}` : m[5]!;
    return { codes: [versionSlug(name)], confidence: 0.7, reason: `Version im Text („${m[0]}“)`, names: { [versionSlug(name)]: name } };
  }
  return { codes: ['open'], confidence: 0.6, reason: 'keine Version genannt' };
}

// ---------------------------------------------------------------- Status (live, Entwurf, in Bearbeitung)

const IN_PROGRESS_STATUS = /progress|bearbeitung|review|test|analysis|refine|blocked|blockiert|qg-bu/i;

export function detectStatus(t: TriageInput): Pick {
  if (t.jiraStatus && IN_PROGRESS_STATUS.test(t.jiraStatus)) return { codes: ['in-progress'], confidence: 0.9, reason: `Ticket in Bearbeitung (${t.jiraStatus})` };
  if (t.sourceFormat === 'jira' || /^pipeline-/i.test(t.path)) return { codes: ['in-progress'], confidence: 0.7, reason: 'Ticket bzw. Pipeline – noch nicht als produktiv bestätigt' };
  if (t.evidenceStatus === 'source_confirmed' || t.evidenceStatus === 'manually_confirmed') return { codes: ['live'], confidence: 0.85, reason: 'Quelle bestätigt' };
  return { codes: ['draft'], confidence: 0.75, reason: 'Quelle unbestätigt' };
}

// ---------------------------------------------------------------- Detaillevel

const EDGE = /\b(?:ausnahme\w*|sonderfall\w*|sonderregel\w*|fehler\w*|fehlermeldung\w*|falls\s+(?:nicht|kein)\w*|wenn\s+\S+(?:\s+\S+){0,4}\s+nicht\b|abgelehnt\w*|ablehnung\w*|abbruch|abbrechen|storn\w*|ungültig\w*|nicht\s+möglich|gesperrt|exception|error|failed|rejected|[A-Z]{1,4}-\d{3,5})/iu;
const STEPS = /(?:^|\n)\s*(?:\d+\.|[-*])\s+\S|\b(?:öffnen|klicken|wählen|geben|speichern|bestätigen|markieren)\s+sie\b|\b(?:open|click|select|enter|save)\b/iu;
const ADDITIONAL = /\b(?:tipp|hinweis|beispiel|optional\w*|zusätzlich\w*|alternativ\w*|auch\s+möglich|note|tip|example)\b/iu;
const INTERNAL = /\b(?:intern\w*|nur\s+für\s+(?:die\s+)?redaktion|testfall\w*|testdaten|testing|migration\w*|deployment|rollout|systemlandschaft|bug)\b/iu;
const DEFINITION = /\b(?:ist|sind|bezeichnet|bedeutet|beschreibt|dient|umfasst)\b/iu;

export function detectDetail(t: TriageInput): Pick & { codes: DetailLevel[] } {
  const text = `${t.headingPath.slice(-1).join(' ')}\n${t.text}`;
  const words = count(t.text, /\S+/g);
  const pick = (code: DetailLevel, confidence: number, reason: string) => ({ codes: [code], confidence, reason });
  if (/(?:^|\/)intern(?:\/|_|-)/i.test(t.path) || INTERNAL.test(text)) return pick('intern', 0.7, 'interner Inhalt (Test, Migration, Rollout, Redaktion)');
  const edge = EDGE.test(text);
  const steps = STEPS.test(t.text) || t.kind === 'ordered_list';
  if (edge) return pick('edge', steps ? 0.75 : 0.7, 'Ausnahme, Fehler oder Sonderfall');
  if (steps) return pick('happy-path', 0.8, 'Schritte des Standardablaufs');
  if (ADDITIONAL.test(text)) return pick('zusatz', 0.7, 'Tipp, Hinweis oder Beispiel');
  if (t.evidenceStatus !== 'source_confirmed' && t.evidenceStatus !== 'manually_confirmed' && words < 8) return pick('in-review', 0.4, 'kurz und unbestätigt – Umfang offen');
  if (words <= 45 && DEFINITION.test(t.text)) return pick('basis', 0.7, 'Überblick bzw. Begriff');
  if (words > 45) return pick('basis-plus', 0.6, 'vertiefte Erklärung');
  return pick('basis', 0.5, 'kurzer Text ohne Schritte');
}

// ---------------------------------------------------------------- Domäne

export interface DomainRef { code: string; names: string[] }

/** Domäne: Name der Domäne im Text bzw. in der Überschrift, sonst über das Kapitel (Zuordnung Domäne → Gliederung) */
export function detectDomain(t: TriageInput, domains: DomainRef[], byChapter: string | null): Pick {
  const text = lower(`${t.headingPath.join(' ')} ${t.text}`);
  const hits = domains.map((d) => ({ d, n: d.names.filter((nm) => nm.length >= 4 && text.includes(lower(nm))).length })).filter((x) => x.n).sort((a, b) => b.n - a.n);
  if (hits.length) return { codes: [hits[0].d.code], confidence: hits.length === 1 ? 0.8 : 0.6, reason: `Domäne im Text (${hits[0].d.names[0]})` };
  if (byChapter) return { codes: [byChapter], confidence: 0.65, reason: 'Domäne über das zugeordnete Kapitel' };
  // „Allgemein“ ist eine gültige Domäne (allgemeine Inhalte), allein kein Grund für „zu prüfen“
  return { codes: ['general'], confidence: REVIEW_BELOW, reason: 'keine Domäne erkennbar – allgemein' };
}

/** Unter dieser Sicherheit gilt eine Gruppe als unsicher → „zu prüfen“ */
export const REVIEW_BELOW = 0.5;
