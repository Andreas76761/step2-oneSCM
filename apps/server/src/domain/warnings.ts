// Warnhinweis-Schema (ADR-083, F-07): Signalwort + Art und Quelle der Gefahr + Folgen + Vermeidung (ANSI Z535.6 / SAFE),
// feste Signalwörter je Sprache. Rein regelbasiert; geprüft im Anleitungs-Check und beim Übersetzen.

export type SignalLevel = 'danger' | 'warning' | 'caution' | 'notice';
export const SIGNAL_LEVELS: SignalLevel[] = ['danger', 'warning', 'caution', 'notice'];
/** Bedeutung der Stufen (Checkliste Benutzerhandbuch, Phase 3) */
export const SIGNAL_MEANING: Record<SignalLevel, string> = {
  danger: 'Tod oder schwere Verletzung',
  warning: 'mögliche schwere Verletzung',
  caution: 'leichte bis mittlere Verletzung',
  notice: 'Sachschaden, Datenverlust oder Störung im Ablauf',
};

/** Feste Signalwörter je Sprache (Großschreibung wie gedruckt) */
export const SIGNAL_WORDS: Record<string, Record<SignalLevel, string>> = {
  de: { danger: 'GEFAHR', warning: 'WARNUNG', caution: 'VORSICHT', notice: 'HINWEIS' },
  en: { danger: 'DANGER', warning: 'WARNING', caution: 'CAUTION', notice: 'NOTICE' },
  fr: { danger: 'DANGER', warning: 'AVERTISSEMENT', caution: 'ATTENTION', notice: 'AVIS' },
  it: { danger: 'PERICOLO', warning: 'AVVERTENZA', caution: 'ATTENZIONE', notice: 'AVVISO' },
  es: { danger: 'PELIGRO', warning: 'ADVERTENCIA', caution: 'PRECAUCIÓN', notice: 'AVISO' },
  cs: { danger: 'NEBEZPEČÍ', warning: 'VAROVÁNÍ', caution: 'UPOZORNĚNÍ', notice: 'OZNÁMENÍ' },
  sk: { danger: 'NEBEZPEČENSTVO', warning: 'VAROVANIE', caution: 'UPOZORNENIE', notice: 'OZNÁMENIE' },
  ko: { danger: '위험', warning: '경고', caution: '주의', notice: '알림' },
  ms: { danger: 'BAHAYA', warning: 'AMARAN', caution: 'AWAS', notice: 'NOTIS' },
  nl: { danger: 'GEVAAR', warning: 'WAARSCHUWING', caution: 'VOORZICHTIG', notice: 'LET OP' },
  pl: { danger: 'NIEBEZPIECZEŃSTWO', warning: 'OSTRZEŻENIE', caution: 'UWAGA', notice: 'NOTYFIKACJA' },
  pt: { danger: 'PERIGO', warning: 'ADVERTÊNCIA', caution: 'CUIDADO', notice: 'AVISO' },
};
// Schweizer Varianten (U-07): Signalwörter wie Deutsch bzw. Französisch
SIGNAL_WORDS['de-ch'] = SIGNAL_WORDS.de;
SIGNAL_WORDS['fr-ch'] = SIGNAL_WORDS.fr;

/** Umgangssprachliche Signalwörter, die durch ein festes ersetzt werden sollen (Vorschlag: HINWEIS) */
const NON_STANDARD = ['ACHTUNG', 'WICHTIG', 'BITTE BEACHTEN', 'BEACHTEN'];

// Signalwort am Anfang eines Absatzes oder einer Zeile, optional mit Symbol und Fettung („⚠ **WARNUNG:** …“)
const LEAD = String.raw`^[\s>*_]*(?:⚠️?|❗|‼️?|ℹ️?)?\s*(?:\*\*|__)?`;
const GERMAN = SIGNAL_WORDS.de;
const SIGNAL_RE = new RegExp(`${LEAD}(${[...Object.values(GERMAN), ...NON_STANDARD].join('|')})(?![\\p{L}])(?:\\*\\*|__)?\\s*[:!–-]?(?:\\*\\*|__)?\\s*`, 'imu');
const SYMBOL = /[⚠❗‼]/u;

// Folge: was passiert, wenn man den Hinweis nicht beachtet
const CONSEQUENCE = /\b(?:kann|können|könnte|führt|führen|droh(?:t|en)|sonst|andernfalls|ansonsten|verloren|gelöscht|überschrieben|storniert|unwiderruflich|nicht mehr|Folge|dadurch|dann (?:wird|werden|ist|sind))\b/iu;
// Vermeidung: Handlungsaufforderung oder Verbot
const AVOIDANCE = /\b(?:\p{L}+en Sie|Stellen Sie sicher|Achten Sie|Vermeiden Sie|Sie müssen|Sie sollten|nicht|niemals|nie|zuerst|vorher|vor dem|bevor|erst nach|nur)\b/iu;

export interface WarningFinding {
  /** erkanntes Signalwort, wie es im Text steht */
  signal: string;
  level: SignalLevel | null;
  /** Bausteine, die fehlen */
  missing: ('hazard' | 'consequence' | 'avoidance' | 'standard_signal' | 'uppercase')[];
  /** Vorschlag mit festem, großgeschriebenem Signalwort (nur Signalwort angepasst) */
  fixed: string | null;
}

export const WARNING_PART_LABEL: Record<WarningFinding['missing'][number], string> = {
  hazard: 'Art und Quelle der Gefahr',
  consequence: 'Folge bei Nichtbeachtung',
  avoidance: 'Maßnahme zur Vermeidung',
  standard_signal: 'festes Signalwort (GEFAHR, WARNUNG, VORSICHT, HINWEIS)',
  uppercase: 'Signalwort in Großbuchstaben',
};

const levelOf = (word: string): SignalLevel | null => (Object.entries(GERMAN).find(([, w]) => w === word.toUpperCase())?.[0] as SignalLevel) ?? null;

/** Warnhinweise eines deutschen Absatzes prüfen; liefert je erkanntem Hinweis die fehlenden Bausteine */
export function checkWarning(text: string, opts: { kind?: string } = {}): WarningFinding | null {
  let m = text.match(SIGNAL_RE);
  // ein schlichtes „Hinweis:“ ist ein Informationshinweis, kein Sicherheits- oder Sachschadenhinweis
  if (m && m[1] !== 'HINWEIS' && m[1].toUpperCase() === 'HINWEIS' && !SYMBOL.test(m[0]) && opts.kind !== 'warning') m = null;
  if (!m && opts.kind !== 'warning') return null;
  const signal = m?.[1] ?? '';
  const rest = m ? text.slice((m.index ?? 0) + m[0].length) : text;
  const level = signal ? levelOf(signal) : null;
  const missing: WarningFinding['missing'] = [];
  if (!signal || !level) missing.push('standard_signal');
  else if (signal !== signal.toUpperCase()) missing.push('uppercase');
  const plain = rest.replace(/\*\*|__|`/g, '').trim();
  if (plain.split(/\s+/).filter(Boolean).length < 3) missing.push('hazard');
  if (!CONSEQUENCE.test(plain)) missing.push('consequence');
  if (!AVOIDANCE.test(plain)) missing.push('avoidance');
  let fixed: string | null = null;
  if (m && (missing.includes('uppercase') || missing.includes('standard_signal'))) {
    const word = level ? GERMAN[level] : GERMAN.notice;
    fixed = text.slice(0, m.index! + m[0].indexOf(signal)) + word + text.slice(m.index! + m[0].indexOf(signal) + signal.length);
  }
  return { signal, level, missing, fixed };
}

/** Signalwörter eines deutschen Textes in Reihenfolge (für den Vergleich mit der Übersetzung) */
export function signalLevels(text: string): SignalLevel[] {
  const out: SignalLevel[] = [];
  for (const line of text.split('\n')) {
    const m = line.match(SIGNAL_RE);
    const l = m && !(m[1] !== 'HINWEIS' && m[1].toUpperCase() === 'HINWEIS' && !SYMBOL.test(m[0])) ? levelOf(m[1]) : null;
    if (l) out.push(l);
  }
  return out;
}

/** Fehlen in der Übersetzung die festen Signalwörter der Zielsprache? */
export function signalWordsMissing(source: string, translated: string, language: string): string[] {
  const words = SIGNAL_WORDS[language];
  if (!words) return [];
  const hay = translated.toLocaleUpperCase(language);
  return signalLevels(source).map((l) => words[l]).filter((w, i, all) => {
    const need = all.filter((x) => x === w).length;
    return all.indexOf(w) === i && hay.split(w.toLocaleUpperCase(language)).length - 1 < need;
  });
}

/** Feste deutsche Signalwörter am Zeilenanfang durch die der Zielsprache ersetzen (Demo-Übersetzung, Vorschläge) */
export function translateSignalWords(text: string, language: string): string {
  const target = SIGNAL_WORDS[language];
  if (!target) return text;
  return text.split('\n').map((line) => {
    const m = line.match(SIGNAL_RE);
    const level = m && !(m[1] !== 'HINWEIS' && m[1].toUpperCase() === 'HINWEIS' && !SYMBOL.test(m[0])) ? levelOf(m[1]) : null;
    if (!m || !level) return line;
    const at = (m.index ?? 0) + m[0].indexOf(m[1]);
    return line.slice(0, at) + target[level] + line.slice(at + m[1].length);
  }).join('\n');
}
