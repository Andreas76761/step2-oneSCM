// Klassifikation von Rolle, Sparte, Markt und Release (US-003, US-004).
// ANNAHME(E-03, E-04): Schlüsselwortregeln; automatische Zuordnungen bleiben immer `unconfirmed`.
// Nur explizite Angaben im Front-Matter der Quelle gelten als `source_confirmed`.
import { DIVISION_CODES, ROLE_CODES, type EvidenceStatus } from './reference.js';

export const CLASSIFIER_METHOD = 'keyword-rules';
export const CLASSIFIER_VERSION = 'rules-1.0';

export interface Assignment {
  code: string;
  score: number;
  method: string;
  modelVersion: string;
  evidenceStatus: EvidenceStatus;
  evidence: string;
}

export interface ClassificationInput {
  text: string;
  headings: string[]; // Kapitel, Unterkapitel, H3–H6
  path: string; // Pfad im Import (Dateiname inkl. Ordner)
  frontMatter: Record<string, unknown>;
}

export interface Classification {
  roles: Assignment[];
  divisions: Assignment[];
  market: { code: string; status: 'confirmed' | 'unconfirmed' } | null;
  release: { code: string; status: 'confirmed' | 'unconfirmed' } | null;
  evidenceStatus: EvidenceStatus;
}

const ROLE_RULES: Record<string, RegExp> = {
  dealer: /\b(dealer|händler\w*|haendler\w*|autohaus|autohäuser\w*|autohaeuser\w*)\b/i,
  market: /\b(marktorganisation\w*|markteinstellung\w*|marktgesellschaft\w*|marktverantwortlich\w*|rolle markt)\b/i,
  mo: /\b(MO|MO-Check|market operations?)\b/,
  hq: /\b(HQ|headquarters?|konzernzentrale|zentrale)\b/i,
  all: /\b(alle rollen|alle benutzer|alle anwender|rollenübergreifend\w*)\b/i,
};
const MO_CI = /\bmarket operations?\b/i;

const DIVISION_RULES: Record<string, RegExp> = {
  car: /\b(pkw|personenkraftwagen|cars?)\b/i,
  van: /\b(vans?|transporter)\b/i,
  truck: /\b(trucks?|lkw|lastkraftwagen)\b/i,
  bus: /\b(bus|busse|omnibus\w*)\b/i,
  all: /\b(alle sparten|spartenübergreifend\w*)\b/i,
};

function asList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim().toLowerCase()).filter(Boolean);
  if (typeof v === 'string') return v.split(/[,;]/).map((x) => x.trim().toLowerCase()).filter(Boolean);
  return [];
}

const DIVISION_ALIASES: Record<string, string> = { pkw: 'car', lkw: 'truck', transporter: 'van' };

function ruleMatches(rules: Record<string, RegExp>, text: string, extra?: (code: string, t: string) => boolean): string[] {
  return Object.entries(rules)
    .filter(([code, re]) => re.test(text) || (extra ? extra(code, text) : false))
    .map(([code]) => code);
}

function pathTokens(path: string): string {
  return path.replace(/[_\-./\\]+/g, ' ');
}

export function classifySnippet(input: ClassificationInput): Classification {
  const fm = input.frontMatter ?? {};
  const roles = new Map<string, Assignment>();
  const divisions = new Map<string, Assignment>();

  // 1. Explizite Angaben der Quelle (Front-Matter) → source_confirmed
  for (const code of asList(fm.roles ?? fm.rollen)) {
    if (ROLE_CODES.includes(code)) roles.set(code, { code, score: 1, method: 'front-matter', modelVersion: CLASSIFIER_VERSION, evidenceStatus: 'source_confirmed', evidence: 'Front-Matter: roles' });
  }
  for (const raw of asList(fm.divisions ?? fm.sparten)) {
    const code = DIVISION_ALIASES[raw] ?? raw;
    if (DIVISION_CODES.includes(code)) divisions.set(code, { code, score: 1, method: 'front-matter', modelVersion: CLASSIFIER_VERSION, evidenceStatus: 'source_confirmed', evidence: 'Front-Matter: divisions' });
  }

  // 2. Schlüsselwörter in Text und Überschriften → unconfirmed
  const headingText = input.headings.filter(Boolean).join(' / ');
  const add = (map: Map<string, Assignment>, code: string, score: number, method: string, evidence: string) => {
    const prev = map.get(code);
    if (prev && (prev.evidenceStatus === 'source_confirmed' || prev.score >= score)) return;
    map.set(code, { code, score, method, modelVersion: CLASSIFIER_VERSION, evidenceStatus: 'unconfirmed', evidence });
  };
  const moExtra = (code: string, t: string) => code === 'mo' && MO_CI.test(t);
  for (const code of ruleMatches(ROLE_RULES, input.text, moExtra)) add(roles, code, 0.7, CLASSIFIER_METHOD, 'Schlüsselwort im Text');
  for (const code of ruleMatches(ROLE_RULES, headingText, moExtra)) add(roles, code, 0.8, CLASSIFIER_METHOD, 'Schlüsselwort in Überschrift');
  for (const code of ruleMatches(DIVISION_RULES, input.text)) add(divisions, code, 0.7, CLASSIFIER_METHOD, 'Schlüsselwort im Text');
  for (const code of ruleMatches(DIVISION_RULES, headingText)) add(divisions, code, 0.8, CLASSIFIER_METHOD, 'Schlüsselwort in Überschrift');

  // 3. Ableitung aus Pfad/Dateiname → immer unconfirmed, niedriger Score (US-004)
  const p = pathTokens(input.path);
  for (const code of ruleMatches(ROLE_RULES, p, moExtra)) add(roles, code, 0.5, 'path-derivation', `Dateipfad: ${input.path}`);
  for (const code of ruleMatches(DIVISION_RULES, p)) add(divisions, code, 0.5, 'path-derivation', `Dateipfad: ${input.path}`);

  if (divisions.size === 0) {
    divisions.set('unconfirmed', { code: 'unconfirmed', score: 0, method: 'default', modelVersion: CLASSIFIER_VERSION, evidenceStatus: 'open_question', evidence: 'Keine Spartenangabe gefunden' });
  }

  // Markt/Release
  let market: Classification['market'] = null;
  if (typeof fm.market === 'string' || typeof fm.markt === 'string') market = { code: String(fm.market ?? fm.markt).toUpperCase(), status: 'confirmed' };
  let release: Classification['release'] = null;
  if (fm.release !== undefined) release = { code: String(fm.release), status: 'confirmed' };
  else {
    const m = /\b(?:release|version)\s+(\d{2,4}(?:\.\d+){1,2})\b/i.exec(input.text);
    if (m) release = { code: m[1], status: 'unconfirmed' };
  }

  const fmEvidence = String(fm.evidence_status ?? fm.evidence ?? '').toLowerCase();
  const evidenceStatus: EvidenceStatus = fmEvidence === 'source_confirmed' || fmEvidence === 'confirmed' ? 'source_confirmed' : 'unconfirmed';

  return { roles: [...roles.values()], divisions: [...divisions.values()], market, release, evidenceStatus };
}
