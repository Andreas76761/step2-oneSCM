// Widerspruchsregeln (US-007, Masterprompt §7).
// Befunde sind Prüfhinweise, keine fachliche Bewertung. ANNAHME(E-07): Schweregrade konfigurierbar.
import type { Severity } from './reference.js';

export type ContradictionRule =
  | 'negation'
  | 'obligation'
  | 'number'
  | 'deadline'
  | 'responsibility'
  | 'role_difference'
  | 'division_difference'
  | 'market_difference'
  | 'release_difference'
  | 'outdated_source';

export const RULE_LABELS: Record<ContradictionRule, string> = {
  negation: 'Negation (erlaubt vs. nicht erlaubt)',
  obligation: 'Pflicht vs. optional',
  number: 'Abweichender Zahlenwert',
  deadline: 'Abweichende Frist',
  responsibility: 'Unterschiedliche Zuständigkeit',
  role_difference: 'Rollenunterschied',
  division_difference: 'Spartenunterschied',
  market_difference: 'Marktunterschied',
  release_difference: 'Releaseunterschied',
  outdated_source: 'Veraltete Quelle',
};

export const DEFAULT_RULE_SEVERITY: Record<ContradictionRule, Severity> = {
  negation: 'blocker',
  obligation: 'blocker',
  number: 'blocker',
  deadline: 'blocker',
  responsibility: 'high',
  role_difference: 'medium',
  division_difference: 'medium',
  market_difference: 'medium',
  release_difference: 'medium',
  outdated_source: 'medium',
};

export interface Statement {
  id: string;
  text: string;
  roles: string[];
  divisions: string[];
  market: string | null;
  release: string | null;
  documentId: string;
  revisionNo: number;
  isCurrentRevision: boolean;
  path: string;
}

export interface ContradictionHit {
  rule: ContradictionRule;
  reason: string;
  details: Record<string, unknown>;
}

const NEGATION = /\b(nicht|kein|keine|keinen|keinem|keiner|nie|niemals|verboten|untersagt|unzulässig)\b/i;
const MANDATORY = /\b(muss|müssen|muessen|pflicht\w*|zwingend|verpflichtend|erforderlich|obligatorisch|ist notwendig)\b/i;
const OPTIONAL = /\b(optional|kann|können|koennen|freiwillig|wahlweise|nicht erforderlich|nicht notwendig)\b/i;
const DEADLINE = /(\d+(?:[.,]\d+)?)\s*(arbeitstag\w*|werktag\w*|tag\w*|stunde\w*|std\.?|woche\w*|monat\w*|minute\w*|min\.?|jahr\w*)/gi;
const NUMBER = /(?<![\w.])(\d+(?:[.,]\d+)?)(?![\w.])/g;
const ACTOR = /\b(dealer|händler|autohaus|marktorganisation|markt|MO|market operation|HQ|zentrale|administrator\w*|benutzer\w*|freigeber\w*)\b/gi;

function unitKey(unit: string): string {
  const u = unit.toLowerCase();
  if (u.startsWith('arbeitstag') || u.startsWith('werktag')) return 'werktag';
  if (u.startsWith('tag')) return 'tag';
  if (u.startsWith('stunde') || u.startsWith('std')) return 'stunde';
  if (u.startsWith('woche')) return 'woche';
  if (u.startsWith('monat')) return 'monat';
  if (u.startsWith('min')) return 'minute';
  return 'jahr';
}

const UNIT_LABEL: Record<string, string> = { werktag: 'Werktage', tag: 'Tage', stunde: 'Stunden', woche: 'Wochen', monat: 'Monate', minute: 'Minuten', jahr: 'Jahre' };

function deadlines(text: string): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const m of text.matchAll(DEADLINE)) {
    const k = unitKey(m[2]);
    out.set(k, [...(out.get(k) ?? []), m[1].replace(',', '.')]);
  }
  return out;
}

function numbersWithoutDeadlines(text: string): string[] {
  const stripped = text.replace(DEADLINE, ' ').replace(/\b\d+(?:\.\d+)+\b/g, ' '); // Kapitelnummern/Versionen ignorieren
  return [...stripped.matchAll(NUMBER)].map((m) => m[1].replace(',', '.'));
}

function actors(text: string): Set<string> {
  const s = new Set<string>();
  for (const m of text.matchAll(ACTOR)) {
    const v = m[1].toLowerCase();
    if (v === 'dealer' || v.startsWith('händler') || v === 'autohaus') s.add('dealer');
    else if (v.startsWith('markt')) s.add('market');
    else if (v === 'mo' || v === 'market operation') s.add('mo');
    else if (v === 'hq' || v === 'zentrale') s.add('hq');
    else if (v.startsWith('administrator')) s.add('administrator');
    else if (v.startsWith('benutzer')) s.add('benutzer');
    else s.add('freigeber');
  }
  return s;
}

const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((x) => b.includes(x));
const specific = (codes: string[]) => codes.filter((c) => c !== 'all' && c !== 'unconfirmed');

/** Mindestähnlichkeit je Regel – schwächere Signale verlangen ähnlichere Aussagen (weniger Fehlalarme). */
export const RULE_MIN_SCORE: Partial<Record<ContradictionRule, number>> = { number: 0.5, responsibility: 0.6 };

/** Prüft ein Kandidatenpaar (bereits semantisch ähnlich) auf Widerspruchsmuster. */
export function detectContradictions(a: Statement, b: Statement, score = 1): ContradictionHit[] {
  const hits: ContradictionHit[] = [];
  const negA = NEGATION.test(a.text);
  const negB = NEGATION.test(b.text);
  const manA = MANDATORY.test(a.text);
  const manB = MANDATORY.test(b.text);
  const optA = OPTIONAL.test(a.text) && !manA;
  const optB = OPTIONAL.test(b.text) && !manB;

  if ((manA && optB) || (optA && manB)) {
    hits.push({ rule: 'obligation', reason: 'Pflicht vs. Optional', details: { a: manA ? 'Pflicht' : 'optional', b: manB ? 'Pflicht' : 'optional' } });
  } else if (negA !== negB) {
    hits.push({ rule: 'negation', reason: `Negation (${negA ? 'A verneint' : 'B verneint'})`, details: { negatedA: negA, negatedB: negB } });
  }

  const dA = deadlines(a.text);
  const dB = deadlines(b.text);
  for (const [unit, valsA] of dA) {
    const valsB = dB.get(unit);
    if (valsB && !sameSet(valsA, valsB)) {
      hits.push({ rule: 'deadline', reason: `Abweichende Frist (${valsA.join('/')} vs. ${valsB.join('/')} ${UNIT_LABEL[unit] ?? unit})`, details: { unit, a: valsA, b: valsB } });
      break;
    }
  }
  if (!hits.some((h) => h.rule === 'deadline')) {
    const nA = numbersWithoutDeadlines(a.text);
    const nB = numbersWithoutDeadlines(b.text);
    if (score >= RULE_MIN_SCORE.number! && nA.length && nB.length && !sameSet(nA, nB)) {
      hits.push({ rule: 'number', reason: `Zahlenwert abweichend (${nA.join('/')} vs. ${nB.join('/')})`, details: { a: nA, b: nB } });
    }
  }

  const acA = actors(a.text);
  const acB = actors(b.text);
  if (score >= RULE_MIN_SCORE.responsibility! && acA.size && acB.size && ![...acA].some((x) => acB.has(x))) {
    hits.push({ rule: 'responsibility', reason: `Unterschiedliche Zuständigkeit (${[...acA].join(', ')} vs. ${[...acB].join(', ')})`, details: { a: [...acA], b: [...acB] } });
  }

  // Kontextunterschiede nur melden, wenn ein inhaltlicher Konflikt besteht – dann als Hinweis zur Klassifikation.
  if (hits.length) {
    const rA = specific(a.roles);
    const rB = specific(b.roles);
    if (rA.length && rB.length && !sameSet(rA, rB)) hits.push({ rule: 'role_difference', reason: 'Aussagen gelten für unterschiedliche Rollen', details: { a: rA, b: rB } });
    const sA = specific(a.divisions);
    const sB = specific(b.divisions);
    if (sA.length && sB.length && !sameSet(sA, sB)) hits.push({ rule: 'division_difference', reason: 'Aussagen gelten für unterschiedliche Sparten', details: { a: sA, b: sB } });
    if (a.market && b.market && a.market !== b.market) hits.push({ rule: 'market_difference', reason: 'Aussagen gelten für unterschiedliche Märkte', details: { a: a.market, b: b.market } });
    if (a.release && b.release && a.release !== b.release) hits.push({ rule: 'release_difference', reason: 'Aussagen gelten für unterschiedliche Releases', details: { a: a.release, b: b.release } });
  }

  if (a.documentId === b.documentId && a.isCurrentRevision !== b.isCurrentRevision) {
    hits.push({ rule: 'outdated_source', reason: 'Eine Aussage stammt aus einer veralteten Revision', details: { revisionA: a.revisionNo, revisionB: b.revisionNo } });
  } else if (/(_alt|_old|veraltet|deprecated)\b/i.test(a.path) !== /(_alt|_old|veraltet|deprecated)\b/i.test(b.path) && hits.length) {
    hits.push({ rule: 'outdated_source', reason: 'Dateiname deutet auf veraltete Quelle hin (unbestätigt)', details: { a: a.path, b: b.path } });
  }
  return hits;
}
