// Lokale Grammatikprüfung mit LanguageTool (ADR-108, G-04): selbst betriebener Java-Dienst (HTTP-API v2) auf einer
// lokalen bzw. internen Adresse – Texte verlassen das Haus nicht. Ohne Dienst oder bei Fehlern bleibt es bei den
// eigenen Regeln. Funde werden je Text zwischengespeichert.
import { createHash } from 'node:crypto';
import type { AppConfig } from '../config.js';
import type { StyleIssue, StyleRule } from '../domain/style.js';
import { isLocalUrl } from '../llm.js';

type LtConfig = AppConfig['languageTool'];
export interface LtMatch { offset: number; length: number; message: string; shortMessage?: string; replacements?: { value: string }[]; rule?: { id?: string; issueType?: string; category?: { id?: string; name?: string } } }

const CACHE_MAX = 2000;
const cache = new Map<string, StyleIssue[]>();
const LANG: Record<string, string> = { de: 'de-DE', en: 'en-US', 'de-ch': 'de-CH' };
/** Regeln, die die eigenen Prüfungen schon abdecken oder Markdown missverstehen */
const DISABLED_RULES = ['WHITESPACE_RULE', 'DE_DOUBLE_PUNCTUATION', 'EN_QUOTES', 'TYPOGRAFISCHE_ANFUEHRUNGSZEICHEN', 'PUNCTUATION_PARAGRAPH_END', 'UPPERCASE_SENTENCE_START'];

/** Nur lokale bzw. interne Adressen – sonst gilt der Dienst als nicht eingerichtet */
export function languageToolUrl(cfg: LtConfig) {
  return cfg.url && isLocalUrl(cfg.url) ? cfg.url : null;
}

/**
 * Markdown für die Prüfung neutralisieren, ohne Stellen zu verschieben: Auszeichnung, Code, Bilder und Linkziele werden
 * Leerzeichen gleicher Länge, damit LanguageTool weder `**` noch Pfade bemängelt
 */
export function maskMarkdown(text: string) {
  const blank = (m: string) => ' '.repeat(m.length);
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, blank)
    .replace(/`[^`]*`/g, blank)
    .replace(/\]\([^)]*\)/g, (m) => ` ${' '.repeat(m.length - 1)}`)
    .replace(/[*_]{1,3}(?=\S)|(?<=\S)[*_]{1,3}/g, blank)
    .replace(/^(\s*)(\d+[.)]|[-*•]|#{1,6}|>)\s/gm, (m) => ' '.repeat(m.length))
    .replace(/\[/g, ' ')
    .replace(/\|/g, ' ');
}

const ruleOf = (m: LtMatch): StyleRule => {
  const c = m.rule?.category?.id ?? '';
  if (c === 'TYPOS' || m.rule?.issueType === 'misspelling') return 'spelling';
  if (c === 'PUNCTUATION') return 'punctuation';
  if (c === 'CASING') return 'capitalization';
  if (c === 'TYPOGRAPHY') return 'typography';
  return 'grammar';
};

/**
 * Treffer der API in Funde der Stilprüfung (Stelle, Meldung, erste Ersetzung als Korrektur). Mit `masked` (Text nach
 * maskMarkdown) entfallen Treffer, die nur durch das Maskieren entstanden sind – etwa „Leerzeichen vor dem Punkt“ nach
 * „**Verträge**.“: außer maskierten Zeichen nur Leerraum und Satzzeichen.
 */
export function toIssues(matches: LtMatch[], text: string, masked?: string): StyleIssue[] {
  const out: StyleIssue[] = [];
  for (const m of matches) {
    const start = m.offset;
    const end = m.offset + m.length;
    if (start < 0 || end > text.length || end <= start) continue;
    const found = text.slice(start, end);
    // nur maskierte Zeichen getroffen (Markdown) → kein Fund
    if (!found.trim()) continue;
    if (masked) {
      let touched = false;
      let rest = '';
      for (let k = start; k < end; k++) (masked[k] !== text[k] ? (touched = true) : (rest += text[k]));
      if (touched && !/[\p{L}\p{N}]/u.test(rest)) continue;
    }
    const rep = m.replacements?.[0]?.value;
    const style = m.rule?.issueType === 'style' || m.rule?.category?.id === 'STYLE' || m.rule?.category?.id === 'REDUNDANCY';
    out.push({
      rule: ruleOf(m), severity: style ? 'info' : 'warning', message: `LanguageTool: ${m.message}`, start, end,
      ...(rep !== undefined && rep !== found ? { fix: { start, end, replacement: rep, label: `„${rep}“` } } : {}),
    });
  }
  return out;
}

async function post(url: string, body: URLSearchParams, timeoutMs: number) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${url}/v2/check`, { method: 'POST', body, headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' }, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as { matches?: LtMatch[] };
  } finally {
    clearTimeout(t);
  }
}

/** Text prüfen; null = Dienst nicht eingerichtet bzw. nicht erreichbar (dann zählen nur die eigenen Regeln) */
export async function languageToolIssues(cfg: LtConfig, text: string, language = 'de'): Promise<{ issues: StyleIssue[]; error: string | null } | null> {
  const url = languageToolUrl(cfg);
  const lang = LANG[language.toLowerCase()];
  if (!url || !lang || !text.trim()) return null;
  const key = createHash('sha256').update(`${lang}\u0000${text}`).digest('hex');
  const hit = cache.get(key);
  if (hit) return { issues: hit, error: null };
  try {
    const masked = maskMarkdown(text);
    const r = await post(url, new URLSearchParams({ text: masked, language: lang, disabledRules: DISABLED_RULES.join(',') }), cfg.timeoutMs);
    const issues = toIssues(r.matches ?? [], text, masked);
    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!);
    cache.set(key, issues);
    return { issues, error: null };
  } catch (e) {
    return { issues: [], error: (e as Error).name === 'AbortError' ? 'Zeitüberschreitung' : (e as Error).message };
  }
}

/** Status für Einstellungen und Prüfseiten */
export async function languageToolStatus(cfg: LtConfig) {
  const url = languageToolUrl(cfg);
  if (!cfg.url) return { configured: false, available: false, reason: 'LANGUAGETOOL_URL ist nicht gesetzt.' };
  if (!url) return { configured: false, available: false, reason: 'LANGUAGETOOL_URL ist keine lokale bzw. interne Adresse – Texte dürfen das Haus nicht verlassen.' };
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), Math.min(cfg.timeoutMs, 3000));
    const res = await fetch(`${url}/v2/languages`, { signal: ctrl.signal }).finally(() => clearTimeout(t));
    const langs = res.ok ? ((await res.json()) as { longCode: string }[]).map((l) => l.longCode) : [];
    return { configured: true, available: res.ok, languages: langs.filter((l) => /^(de|en)/.test(l)), reason: res.ok ? null : `HTTP ${res.status}` };
  } catch (e) {
    return { configured: true, available: false, reason: (e as Error).message };
  }
}

/** mehrere Texte mit begrenzter Parallelität prüfen */
export async function languageToolMany(cfg: LtConfig, texts: string[], language = 'de', parallel = 4) {
  const out: ({ issues: StyleIssue[]; error: string | null } | null)[] = new Array(texts.length).fill(null);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(parallel, texts.length) }, async () => {
    while (next < texts.length) {
      const i = next++;
      out[i] = await languageToolIssues(cfg, texts[i], language);
    }
  }));
  return out;
}

export const clearLanguageToolCache = () => cache.clear();
