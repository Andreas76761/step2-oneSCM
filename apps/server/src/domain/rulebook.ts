// Regelwerk (Etappe 100): Text-Regeln allgemein oder je Kapitel – Pflichtbegriff, verbotener Begriff, Textmuster.
import { safeRulePattern } from './ruleSets.js';

export const RULE_KINDS = ['required', 'forbidden', 'pattern'] as const;
export type RuleKind = (typeof RULE_KINDS)[number];
export const RULE_KIND_LABELS: Record<RuleKind, string> = { required: 'Pflichtbegriff', forbidden: 'Verbotener Begriff', pattern: 'Textmuster' };

export interface RulebookRule {
  id: string;
  chapterId: string | null;
  kind: RuleKind;
  term: string;
  message: string | null;
  severity: string;
  active: boolean;
}

export interface RuleViolation {
  rule: RulebookRule;
  /** betroffener Text (Textabschnitt oder Absatz); fehlt bei einem fehlenden Pflichtbegriff */
  id?: string;
  match?: string;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Begriffe als ganzes Wort (auch mit Umlauten am Rand), Muster wie eingegeben; null = ungültiges oder riskantes Muster */
export function ruleMatcher(rule: Pick<RulebookRule, 'kind' | 'term'>): RegExp | null {
  if (rule.kind === 'pattern') {
    const p = safeRulePattern(rule.term);
    return p ? new RegExp(p, 'giu') : null;
  }
  const term = rule.term.trim();
  return term ? new RegExp(`(?<![\\p{L}\\p{N}_])${escape(term)}(?![\\p{L}\\p{N}_])`, 'giu') : null;
}

/** Regeln, die für ein Kapitel gelten: allgemeine und die des Kapitels, nur aktive */
export function rulesFor(rules: RulebookRule[], chapterId: string): RulebookRule[] {
  return rules.filter((r) => r.active && (!r.chapterId || r.chapterId === chapterId));
}

/** Verstöße der Texte eines Kapitels: verbotene Begriffe und Muster je Text, fehlende Pflichtbegriffe einmal je Kapitel */
export function ruleViolations(rules: RulebookRule[], texts: { id: string; text: string }[]): RuleViolation[] {
  const out: RuleViolation[] = [];
  for (const rule of rules) {
    const re = ruleMatcher(rule);
    if (!re) continue;
    if (rule.kind === 'required') {
      if (texts.length && !texts.some((t) => (re.lastIndex = 0, re.test(t.text)))) out.push({ rule });
      continue;
    }
    for (const t of texts) {
      re.lastIndex = 0;
      const m = re.exec(t.text);
      if (m) out.push({ rule, id: t.id, match: m[0] });
    }
  }
  return out;
}

export function violationReason(v: RuleViolation): string {
  const label = RULE_KIND_LABELS[v.rule.kind];
  const what = v.rule.kind === 'required' ? `„${v.rule.term}“ fehlt im Kapitel` : v.rule.kind === 'forbidden' ? `„${v.match ?? v.rule.term}“ ist nicht erlaubt` : `Muster „${v.rule.term}“ gefunden: „${v.match}“`;
  return `Regelwerk (${label}${v.rule.chapterId ? ', Kapitelregel' : ''}): ${what}${v.rule.message ? ` – ${v.rule.message}` : ''}`;
}
