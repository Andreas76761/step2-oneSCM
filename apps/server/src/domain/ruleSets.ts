// Zuschaltbare Regelsätze (ADR-109, S-06): Regelbasiertes Schreiben für deutsche Anleitungen, Grundregeln von
// Simplified Technical English (ASD-STE100, ohne das geschützte Wörterbuch) und eingelesene Vale-Stile.
// Liefert Funde mit Zeichenpositionen wie die eigene Stilprüfung. Reine Fachlogik ohne I/O.
import { parse as parseYaml } from 'yaml';
import { segmentSentences, type StyleIssue } from './style.js';

export interface RuleHit { rule: string; severity: 'warning' | 'info'; message: string; start: number; end: number; fix?: { start: number; end: number; replacement: string; label: string } }
export interface BuiltinRule { id: string; label: string; description: string }
export interface BuiltinSet { key: 'tekom' | 'ste'; name: string; language: string; description: string; rules: BuiltinRule[] }

export const BUILTIN_SETS: BuiltinSet[] = [
  {
    key: 'tekom', name: 'Regelbasiertes Schreiben', language: 'de',
    description: 'Regeln für deutsche Handlungsanweisungen nach dem Vorbild der tekom-Leitlinie: eine Handlung je Schritt, Bedingung vor Handlung, direkte Aufforderung.',
    rules: [
      { id: 'one_action', label: 'Eine Handlung je Schritt', description: 'Ein Schritt fordert zu höchstens einer Handlung auf.' },
      { id: 'condition_first', label: 'Bedingung vor Handlung', description: 'Bedingungen („wenn“, „falls“, „sobald“) stehen vor der Aufforderung.' },
      { id: 'direct', label: 'Direkt auffordern', description: 'Keine Modalverben in Handlungsschritten („Sie müssen … klicken“ → „Klicken Sie …“).' },
      { id: 'step_length', label: 'Kurze Schritte', description: 'Ein Handlungsschritt hat höchstens 20 Wörter.' },
      { id: 'vague_reference', label: 'Genau verweisen', description: 'Keine Verweise wie „siehe oben“ – Kapitel oder Abschnitt nennen.' },
      { id: 'double_negation', label: 'Keine doppelte Verneinung', description: 'Positiv formulieren statt „nicht unwichtig“ oder „kein … nicht“.' },
      { id: 'parentheses', label: 'Keine Klammern in Schritten', description: 'Zusatzinformationen als eigenen Satz nach dem Schritt.' },
    ],
  },
  {
    key: 'ste', name: 'Simplified Technical English (Grundregeln)', language: 'en',
    description: 'Writing rules of ASD-STE100 for English texts – sentence length, one instruction per sentence, active voice, no -ing forms. The controlled dictionary is not included.',
    rules: [
      { id: 'procedural_length', label: 'Procedural sentences ≤ 20 words', description: 'Instructions have no more than 20 words.' },
      { id: 'descriptive_length', label: 'Descriptive sentences ≤ 25 words', description: 'Descriptive sentences have no more than 25 words.' },
      { id: 'one_instruction', label: 'One instruction per sentence', description: 'Write each instruction as a separate sentence.' },
      { id: 'active_voice', label: 'Active voice', description: 'Use the active voice in procedures and descriptions.' },
      { id: 'no_ing', label: 'No -ing forms', description: 'Do not use the -ing form of a verb (except in technical names).' },
      { id: 'clear_instruction', label: 'Clear instructions', description: 'Do not use "should", "could", "may" or "might" in instructions.' },
      { id: 'paragraph_length', label: 'Paragraphs ≤ 6 sentences', description: 'A paragraph has no more than six sentences.' },
    ],
  },
];

const words = (t: string) => (t.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;
const LIST = /^\s*(?:\d+\.|[-*])\s+/;
const skipSentence = (t: string) => /^#{1,6}\s|^\s*\|/.test(t);

// ---------------------------------------------------------------- Regelbasiertes Schreiben (Deutsch)

// Aufforderung in der Sie-Form: Verb + „Sie“ (Klicken Sie, Wählen Sie, Öffnen Sie …)
const IMPERATIVE_DE = /(?<![\p{L}])([\p{L}]+(?:en|ern|eln))\s+Sie(?![\p{L}])/gu;
const NOT_VERB_DE = new Set(['wenn', 'denen', 'eigenen', 'allen', 'einen', 'diesen', 'jenen', 'welchen', 'müssen', 'sollten', 'sollen', 'können', 'dürfen', 'möchten']);
const MODAL_DE = /(?<![\p{L}])(?:(?:müssen|sollten|sollen|können|dürfen|möchten)\s+Sie|Sie\s+(?:müssen|sollten|sollen|können|dürfen))(?![\p{L}])/gu;

function tekom(text: string, off: Set<string>): RuleHit[] {
  const out: RuleHit[] = [];
  for (const s of segmentSentences(text)) {
    const t = s.text;
    if (skipSentence(t)) continue;
    const add = (rule: string, severity: RuleHit['severity'], message: string, a: number, b: number) => { if (!off.has(rule)) out.push({ rule, severity, message, start: s.start + a, end: s.start + b }); };
    const step = LIST.test(t);
    const imps = [...t.matchAll(IMPERATIVE_DE)].filter((m) => !NOT_VERB_DE.has(m[1].toLowerCase()) && !/^(?:Sie|Wenn|Falls)$/i.test(m[1]));
    if (imps.length >= 2) add('one_action', 'warning', `Eine Handlung je Schritt: ${imps.length} Aufforderungen („${imps.map((m) => m[0]).slice(0, 3).join('“, „')}“) – in einzelne Schritte teilen`, imps[1].index!, imps[1].index! + imps[1][0].length);
    const cond = /,\s+(wenn|falls|sobald|sofern)\s/iu.exec(t);
    if (cond && imps.length && imps[0].index! < cond.index!) add('condition_first', 'info', `Bedingung vor Handlung: „${cond[1][0].toUpperCase()}${cond[1].slice(1)} …, ${imps[0][1].toLowerCase()} Sie …“`, cond.index! + 2, cond.index! + 2 + cond[1].length);
    // nur in Handlungsschritten: „Hier können Sie …“ beschreibt eine Möglichkeit und bleibt erlaubt
    if (step) for (const m of t.matchAll(MODAL_DE)) add('direct', 'warning', `Direkt auffordern statt „${m[0]}“ – z. B. „Klicken Sie …“`, m.index!, m.index! + m[0].length);
    if (step && words(t.replace(LIST, '')) > 20) add('step_length', 'info', `Langer Schritt (${words(t.replace(LIST, ''))} Wörter, höchstens 20) – Zusatzinformation in einen eigenen Satz`, 0, t.length);
    for (const m of t.matchAll(/(?<![\p{L}])(?:siehe (?:oben|unten)|wie (?:oben|unten) (?:beschrieben|erwähnt|genannt)|weiter (?:oben|unten)|obige[nmrs]?|untenstehende[nmrs]?|obenstehende[nmrs]?)(?![\p{L}])/giu)) {
      add('vague_reference', 'info', `Ungenauer Verweis „${m[0]}“ – Kapitel oder Abschnitt nennen`, m.index!, m.index! + m[0].length);
    }
    for (const m of t.matchAll(/(?<![\p{L}])(?:nicht\s+un[\p{Ll}]{3,}|kein[\p{Ll}]*\s+(?:[\p{L}]+\s+){0,4}nicht)(?![\p{L}])/gu)) add('double_negation', 'info', `Doppelte Verneinung „${m[0]}“ – positiv formulieren`, m.index!, m.index! + m[0].length);
    if (step) {
      const p = /\((?![^)]*\]\()[^)]{3,}\)/.exec(t.replace(/\]\([^)]*\)/g, (x) => ' '.repeat(x.length)));
      if (p) add('parentheses', 'info', 'Klammer im Handlungsschritt – Zusatzinformation als eigenen Satz nach dem Schritt', p.index, p.index + p[0].length);
    }
  }
  return out;
}

// ---------------------------------------------------------------- Simplified Technical English (Grundregeln)

const EN_VERBS = 'click|select|open|enter|press|type|choose|close|save|set|remove|install|check|go|use|do|tap|add|delete|make|put|turn|push|pull|connect|disconnect|start|stop|read|write|record|apply|attach|replace|move|keep|let|make sure|ensure';
const IMPERATIVE_EN = new RegExp(String.raw`^(?:\s*(?:\d+\.|[-*])\s+)?(?:\*\*)?(?:if [^,]+,\s*)?(?:${EN_VERBS})\b`, 'i');
const ING_OK = new Set(['during', 'thing', 'things', 'string', 'strings', 'nothing', 'something', 'anything', 'everything', 'bring', 'ring', 'rings', 'king', 'spring', 'springs', 'ceiling', 'wing', 'wings', 'sing', 'sling', 'swing', 'sting', 'bearing', 'bearings', 'warning', 'warnings', 'awning', 'morning', 'evening', 'ping', 'login']);

function ste(text: string, off: Set<string>): RuleHit[] {
  const out: RuleHit[] = [];
  const sentences = segmentSentences(text).filter((s) => !skipSentence(s.text));
  for (const s of sentences) {
    const t = s.text;
    const add = (rule: string, severity: RuleHit['severity'], message: string, a: number, b: number) => { if (!off.has(rule)) out.push({ rule, severity, message, start: s.start + a, end: s.start + b }); };
    const n = words(t.replace(LIST, ''));
    const procedural = IMPERATIVE_EN.test(t) || LIST.test(t);
    if (procedural && n > 20) add('procedural_length', 'warning', `Procedural sentence with ${n} words (maximum 20)`, 0, t.length);
    if (!procedural && n > 25) add('descriptive_length', 'warning', `Descriptive sentence with ${n} words (maximum 25)`, 0, t.length);
    const second = new RegExp(String.raw`(?:,\s*|\s)(?:and|then|and then)\s+(?:${EN_VERBS})\b`, 'i').exec(t);
    if (procedural && second) add('one_instruction', 'warning', 'More than one instruction – write each instruction as a separate sentence', second.index, second.index + second[0].length);
    for (const m of t.matchAll(/\b(?:is|are|was|were|be|been|being)\s+(?:\w+ly\s+)?(\w+(?:ed|en))\b/gi)) {
      // Wörter auf -en, die kein Partizip sind („is open“, „is often“)
      if (/^(?:open|often|even|token|then|when|screen|seven|eleven|garden|kitchen)$/i.test(m[1])) continue;
      add('active_voice', 'info', `Passive voice „${m[0]}“ – use the active voice`, m.index!, m.index! + m[0].length);
    }
    for (const m of t.matchAll(/(?<![\p{L}`])([\p{L}]{3,}ing)(?![\p{L}`])/gu)) {
      if (ING_OK.has(m[1].toLowerCase()) || /^[\p{Lu}]{2,}/u.test(m[1])) continue;
      add('no_ing', 'info', `-ing form „${m[1]}“ – rewrite without -ing`, m.index!, m.index! + m[1].length);
    }
    if (procedural) for (const m of t.matchAll(/\b(should|could|may|might|would)\b/gi)) add('clear_instruction', 'warning', `Unclear instruction „${m[0]}“ – use the imperative`, m.index!, m.index! + m[0].length);
  }
  // Absätze: höchstens sechs Sätze (Listen und Überschriften zählen nicht)
  if (!off.has('paragraph_length')) {
    for (const para of paragraphs(text)) {
      const ss = segmentSentences(para.text).filter((s) => !skipSentence(s.text) && !LIST.test(s.text));
      if (ss.length > 6) out.push({ rule: 'paragraph_length', severity: 'info', message: `Paragraph with ${ss.length} sentences (maximum 6)`, start: para.start + ss[6].start, end: para.start + ss[6].end });
    }
  }
  return out;
}

/** Absätze (durch Leerzeilen getrennt) mit Startposition */
function paragraphs(text: string) {
  const cuts = [0];
  for (const m of text.matchAll(/\n\s*\n/g)) cuts.push(m.index! + m[0].length);
  return cuts.map((c, i) => ({ start: c, text: text.slice(c, i + 1 < cuts.length ? cuts[i + 1] : text.length) }));
}

// ---------------------------------------------------------------- Vale-Stile

/** Regel eines Vale-Stils in der von der App unterstützten Form */
export interface ValeRule {
  name: string;
  extends: 'existence' | 'substitution' | 'occurrence';
  message: string;
  level: 'suggestion' | 'warning' | 'error';
  ignorecase: boolean;
  nonword: boolean;
  tokens?: string[];
  swap?: Record<string, string>;
  max?: number;
  token?: string;
}
export interface ValeImport { rules: ValeRule[]; unsupported: { name: string; reason: string }[] }

const MAX_TOKENS = 500;
const MAX_TOKEN_LEN = 300;

/** Regex aus Vale (RE2) für JavaScript prüfen; Lookbehind und Rückverweise gibt es in RE2 nicht, sie bleiben abgelehnt */
function safePattern(p: string): string | null {
  if (typeof p !== 'string' || !p || p.length > MAX_TOKEN_LEN) return null;
  if (/\\[1-9]|\(\?<[=!]/.test(p)) return null;
  // verschachtelte Wiederholungen wie (a+)+ können sehr langsam werden
  if (/\([^)]*[+*][^)]*\)[+*{]/.test(p)) return null;
  try {
    new RegExp(p, 'u');
    return p;
  } catch {
    return null;
  }
}

/** Vale-Stil aus YAML-Dateien lesen (eine Datei je Regel, Name = Dateiname ohne .yml) */
export function parseValeStyle(files: { name: string; content: string }[]): ValeImport {
  const rules: ValeRule[] = [];
  const unsupported: ValeImport['unsupported'] = [];
  for (const f of files) {
    const name = f.name.replace(/^.*[\\/]/, '').replace(/\.ya?ml$/i, '');
    let y: any;
    try {
      y = parseYaml(f.content);
    } catch (e) {
      unsupported.push({ name, reason: `YAML nicht lesbar: ${(e as Error).message.split('\n')[0]}` });
      continue;
    }
    if (!y || typeof y !== 'object') { unsupported.push({ name, reason: 'keine Regel' }); continue; }
    const kind = String(y.extends ?? '');
    if (!['existence', 'substitution', 'occurrence'].includes(kind)) { unsupported.push({ name, reason: `Regeltyp „${kind || '–'}“ wird nicht unterstützt (unterstützt: existence, substitution, occurrence)` }); continue; }
    if (y.scope && !['sentence', 'paragraph', 'text', 'raw', 'summary'].includes(String(y.scope))) { unsupported.push({ name, reason: `Geltungsbereich „${y.scope}“ wird nicht unterstützt` }); continue; }
    const level = ['suggestion', 'warning', 'error'].includes(y.level) ? y.level : 'suggestion';
    const base = { name, extends: kind as ValeRule['extends'], message: String(y.message ?? name).slice(0, 300), level, ignorecase: !!y.ignorecase, nonword: !!y.nonword };
    if (kind === 'existence') {
      const raw: unknown[] = Array.isArray(y.tokens) ? y.tokens : [];
      const tokens = raw.map((t) => safePattern(String(t))).filter((t): t is string => !!t);
      if (!tokens.length) { unsupported.push({ name, reason: 'keine verwendbaren tokens' }); continue; }
      if (raw.length > MAX_TOKENS) { unsupported.push({ name, reason: `zu viele tokens (höchstens ${MAX_TOKENS})` }); continue; }
      if (tokens.length < raw.length) unsupported.push({ name, reason: `${raw.length - tokens.length} von ${raw.length} tokens nicht übernommen (Muster nicht unterstützt)` });
      rules.push({ ...base, tokens });
    } else if (kind === 'substitution') {
      const sw = y.swap && typeof y.swap === 'object' ? Object.entries(y.swap as Record<string, unknown>) : [];
      const swap: Record<string, string> = {};
      for (const [k, v] of sw.slice(0, MAX_TOKENS)) { const p = safePattern(k); if (p) swap[p] = String(v ?? ''); }
      if (!Object.keys(swap).length) { unsupported.push({ name, reason: 'keine verwendbaren swap-Einträge' }); continue; }
      if (Object.keys(swap).length < sw.length) unsupported.push({ name, reason: `${sw.length - Object.keys(swap).length} von ${sw.length} Ersetzungen nicht übernommen` });
      rules.push({ ...base, swap });
    } else {
      const token = safePattern(String(y.token ?? ''));
      const max = Number(y.max);
      if (!token || !Number.isInteger(max) || max < 0) { unsupported.push({ name, reason: 'occurrence braucht token und max' }); continue; }
      rules.push({ ...base, token, max });
    }
  }
  return { rules, unsupported };
}

const wrap = (p: string, nonword: boolean) => (nonword ? `(?:${p})` : String.raw`(?<![\p{L}\p{N}_])(?:${p})(?![\p{L}\p{N}_])`);
const fmt = (message: string, ...args: string[]) => { let i = 0; return message.replace(/%s/g, () => args[i++] ?? ''); };

function vale(text: string, rules: ValeRule[], off: Set<string>): RuleHit[] {
  const out: RuleHit[] = [];
  const severity = (r: ValeRule): RuleHit['severity'] => (r.level === 'suggestion' ? 'info' : 'warning');
  const flags = (r: ValeRule) => `g${r.ignorecase ? 'i' : ''}u`;
  // Code und Linkziele bleiben unberührt
  const masked = text.replace(/`[^`]*`|\]\([^)]*\)|https?:\/\/\S+/g, (x) => ' '.repeat(x.length));
  for (const r of rules) {
    if (off.has(r.name)) continue;
    if (r.extends === 'existence') {
      const re = new RegExp(wrap(r.tokens!.join('|'), r.nonword), flags(r));
      for (const m of masked.matchAll(re)) if (m[0]) out.push({ rule: r.name, severity: severity(r), message: fmt(r.message, m[0]), start: m.index!, end: m.index! + m[0].length });
    } else if (r.extends === 'substitution') {
      for (const [from, to] of Object.entries(r.swap!)) {
        const re = new RegExp(wrap(from, r.nonword), flags(r));
        const first = to.split('|')[0].trim();
        for (const m of masked.matchAll(re)) {
          if (!m[0] || m[0] === first) continue;
          // Vale: %s = Vorschlag, %s = Fund
          out.push({ rule: r.name, severity: severity(r), message: fmt(r.message, to, m[0]), start: m.index!, end: m.index! + m[0].length, ...(first && !to.includes('|') ? { fix: { start: m.index!, end: m.index! + m[0].length, replacement: first, label: `„${first}“` } } : {}) });
        }
      }
    } else {
      const re = new RegExp(wrap(r.token!, r.nonword), flags(r));
      for (const s of segmentSentences(masked)) {
        const hits = [...s.text.matchAll(re)].filter((m) => m[0]);
        if (hits.length > r.max!) out.push({ rule: r.name, severity: severity(r), message: fmt(r.message, String(hits.length)), start: s.start, end: s.end });
      }
    }
  }
  return out;
}

// ---------------------------------------------------------------- gemeinsamer Einstieg

export interface ActiveSet { key: string; name: string; language: string; disabledRules: string[]; rules?: ValeRule[] }

/** Funde aller eingeschalteten Regelsätze für einen Text der Sprache `language` – als Funde der Regel „Regelsatz“ */
export function ruleSetIssues(text: string, language: string, sets: ActiveSet[]): StyleIssue[] {
  const lang = language.toLowerCase().slice(0, 2);
  const out: StyleIssue[] = [];
  for (const set of sets) {
    if (set.language.toLowerCase().slice(0, 2) !== lang) continue;
    const off = new Set(set.disabledRules);
    const hits = set.key === 'tekom' ? tekom(text, off) : set.key === 'ste' ? ste(text, off) : vale(text, set.rules ?? [], off);
    for (const h of hits) out.push({ rule: 'rule_set', severity: h.severity, message: `${set.name}: ${h.message}`, start: h.start, end: h.end, ...(h.fix ? { fix: h.fix } : {}), source: { set: set.key, rule: h.rule } });
  }
  return out;
}
