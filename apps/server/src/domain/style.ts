// Schreibstil (ADR-040): regelbasierte Prüfung deutscher Handbuchtexte – ohne Netz, ohne Wörterbuchdienst.
// Liefert je Satz die Fundstellen (Zeichenpositionen) und, wo eindeutig, eine automatische Korrektur.
// Reine Fachlogik ohne I/O.

export type StyleRule =
  | 'long_sentence' | 'passive' | 'future' | 'past' | 'filler' | 'double_word' | 'punctuation' | 'capitalization'
  | 'impersonal' | 'colloquial' | 'hedging' | 'nominal' | 'spelling' | 'abbreviation' | 'terminology';

export interface StyleFix { start: number; end: number; replacement: string; label: string }
export interface StyleIssue { rule: StyleRule; severity: 'warning' | 'info'; message: string; start: number; end: number; fix?: StyleFix }
export interface StyleSentence { start: number; end: number; text: string; issues: StyleIssue[] }
export interface StyleOptions { maxWords?: number; terms?: { preferred: string; avoid: string[] }[] }

export const RULE_LABEL: Record<StyleRule, string> = {
  long_sentence: 'Langer Satz', passive: 'Passiv', future: 'Futur', past: 'Vergangenheit', filler: 'Füllwort', double_word: 'Doppeltes Wort',
  punctuation: 'Zeichensetzung', capitalization: 'Großschreibung', impersonal: 'Unpersönlich', colloquial: 'Umgangssprache', hedging: 'Unklare Anweisung',
  nominal: 'Nominalstil', spelling: 'Rechtschreibung', abbreviation: 'Abkürzung', terminology: 'Terminologie',
};

const FILLERS = ['eigentlich', 'grundsätzlich', 'halt', 'eben', 'quasi', 'sozusagen', 'gewissermaßen', 'irgendwie', 'ziemlich', 'relativ', 'einfach mal', 'wohl', 'durchaus', 'letztendlich', 'im Prinzip', 'an und für sich'];
const COLLOQUIAL = ['super', 'toll', 'klasse', 'okay', 'ok', 'kriegen', 'kriegt', 'echt', 'cool', 'krass', 'Kram', 'checken', 'gucken', 'klicken Sie mal'];
const HEDGING = ['vielleicht', 'eventuell', 'möglicherweise', 'unter Umständen', 'gegebenenfalls eventuell', 'in etwa', 'ungefähr'];
/** häufige Falschschreibungen → richtig */
const SPELLING: Record<string, string> = {
  wiederrum: 'wiederum', standart: 'standard', nähmlich: 'nämlich', addresse: 'adresse', vorraus: 'voraus', vorraussetzung: 'voraussetzung', vorraussetzungen: 'voraussetzungen',
  rythmus: 'rhythmus', resource: 'ressource', resourcen: 'ressourcen', email: 'E-Mail', seperat: 'separat', seperator: 'separator', aggresiv: 'aggressiv',
  garnicht: 'gar nicht', zuende: 'zu Ende', desweiteren: 'des Weiteren', packet: 'paket', packete: 'pakete', tip: 'tipp', detailiert: 'detailliert', vorallem: 'vor allem',
  entgültig: 'endgültig', wiederspiegeln: 'widerspiegeln', wiederspruch: 'widerspruch', wiedersprechen: 'widersprechen', rückgrad: 'rückgrat', ergebniss: 'ergebnis',
  ansich: 'an sich', morgends: 'morgens', nachwievor: 'nach wie vor', ebenfals: 'ebenfalls', eigendlich: 'eigentlich', interresse: 'interesse', interressant: 'interessant',
};
const ABBREVIATIONS: [RegExp, string][] = [[/\bz\.B\./g, 'z. B.'], [/\bd\.h\./g, 'd. h.'], [/\bu\.a\./g, 'u. a.'], [/\bz\.T\./g, 'z. T.'], [/\bi\.d\.R\./g, 'i. d. R.'], [/\bu\.U\./g, 'u. U.'], [/\bggf(?!\.)\b/g, 'ggf.'], [/\bbzw(?!\.)\b/g, 'bzw.'], [/\bbzgl(?!\.)\b/g, 'bzgl.'], [/\bca(?!\.)\b(?=\s*\d)/g, 'ca.']];

const WORD = /[\p{L}\p{N}][\p{L}\p{N}\-]*/gu;
// Partizip II: (Präfix)ge…t/en, …iert, be-/ver-/er-…t – Wortgrenzen über Lookarounds (\b kennt keine Umlaute)
const PARTICIPLE = String.raw`(?<![\p{L}])(?:(?:[\p{Ll}]*?(?:ab|an|auf|aus|ein|mit|nach|vor|zu|zurück|weiter|fest|frei|hoch|her|hin|dar|um|weg))?ge[\p{Ll}]+(?:t|en)|[\p{Ll}]+iert|(?:be|ver|er|ent|zer|über|unter|miss)[\p{Ll}]+t)(?![\p{L}])`;
const B = String.raw`(?<![\p{L}])`;
const E = String.raw`(?![\p{L}])`;

/** Text in Sätze bzw. Listenpunkte/Zeilen zerlegen – mit Positionen im Original */
export function segmentSentences(text: string): { start: number; end: number; text: string }[] {
  const out: { start: number; end: number; text: string }[] = [];
  const lines = /[^\n]+/g;
  for (const line of text.matchAll(lines)) {
    const base = line.index!;
    const l = line[0];
    // Satzende: . ! ? … gefolgt von Leerraum und Großbuchstabe/Ziffer/Anführung; Abkürzungen wie „z. B.“ nicht trennen
    const re = /[.!?…]+(?=\s+[\p{L}\d„"(])/gu;
    let from = 0;
    for (const m of l.matchAll(re)) {
      const endIdx = m.index! + m[0].length;
      const before = l.slice(Math.max(0, m.index! - 4), m.index! + 1);
      // Abkürzungen (einzelne Buchstaben wie „z. B.“, „ca.“, „Nr.“) und Aufzählungsnummern („1.“) beenden keinen Satz
      if (/(?:(?<![\p{L}])\p{L}|(?<![\p{L}])(?:ca|ggf|bzw|bzgl|Nr|vgl|inkl|evtl|usw|etc))\.$/iu.test(before) || /(?<!\d)\d{1,2}\.$/.test(l.slice(Math.max(0, m.index! - 3), endIdx))) continue;
      push(from, endIdx);
      from = endIdx;
    }
    push(from, l.length);
    function push(a: number, b: number) {
      const seg = l.slice(a, b);
      const lead = seg.length - seg.trimStart().length;
      const t = seg.trim();
      if (t) out.push({ start: base + a + lead, end: base + a + lead + t.length, text: t });
    }
  }
  return out;
}

const wordCount = (s: string) => [...s.replace(/^\s*(?:\d+\.|[-*])\s+/, '').matchAll(WORD)].length;
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Regelprüfung eines Textes */
export function analyzeStyle(text: string, opts: StyleOptions = {}): { sentences: StyleSentence[]; counts: Partial<Record<StyleRule, number>>; score: number } {
  const maxWords = opts.maxWords ?? 25;
  const sentences: StyleSentence[] = segmentSentences(text).map((s) => ({ ...s, issues: [] }));
  for (const s of sentences) {
    const add = (rule: StyleRule, severity: 'warning' | 'info', message: string, relStart: number, relEnd: number, fix?: Omit<StyleFix, 'start' | 'end'> & { relStart?: number; relEnd?: number }) => {
      s.issues.push({
        rule, severity, message, start: s.start + relStart, end: s.start + relEnd,
        ...(fix ? { fix: { start: s.start + (fix.relStart ?? relStart), end: s.start + (fix.relEnd ?? relEnd), replacement: fix.replacement, label: fix.label } } : {}),
      });
    };
    const t = s.text;
    const isList = /^\s*(?:\d+\.|[-*])\s+/.test(t);
    const isHeading = /^#{1,6}\s/.test(t);
    const words = wordCount(t);
    if (words > maxWords) add('long_sentence', 'warning', `Langer Satz (${words} Wörter) – in kürzere Sätze teilen (höchstens ${maxWords} Wörter)`, 0, t.length);

    // Futur Passiv „wird … angezeigt werden“ → Präsens „wird … angezeigt“
    for (const m of t.matchAll(new RegExp(String.raw`(${PARTICIPLE})\s+werden${E}`, 'gu'))) {
      add('future', 'warning', 'Futur – im Präsens formulieren', m.index!, m.index! + m[0].length, { replacement: m[1], label: `„${m[1]}“ (Präsens)` });
    }
    // Futur I aktiv „wird … speichern“ (ohne Partizip davor): nur Hinweis, Umformulierung per KI
    const fut = new RegExp(String.raw`${B}(wird|werden|wirst|werdet)${E}(?![^.!?]*${PARTICIPLE})[^.!?,]*?\s(\p{Ll}+(?:en|ern|eln))\s*[.!?]?$`, 'u').exec(t);
    if (fut && !s.issues.some((i) => i.rule === 'future')) add('future', 'warning', 'Futur – im Präsens formulieren („wird … speichern“ → „speichert“)', fut.index!, fut.index! + fut[1].length);
    // Vergangenheit: Vorgangspassiv „wurde … gespeichert“ → „wird … gespeichert“, Zustand „war/waren“ → „ist/sind“
    const pastMap: Record<string, string> = { wurde: 'wird', wurden: 'werden', war: 'ist', waren: 'sind', hatte: 'hat', hatten: 'haben', Wurde: 'Wird', Wurden: 'Werden', War: 'Ist', Waren: 'Sind', Hatte: 'Hat', Hatten: 'Haben' };
    for (const m of t.matchAll(new RegExp(String.raw`${B}(wurde|wurden|war|waren|hatte|hatten|Wurde|Wurden|War|Waren|Hatte|Hatten)${E}`, 'gu'))) {
      add('past', 'warning', 'Vergangenheit – Anleitungen im Präsens formulieren', m.index!, m.index! + m[0].length, { replacement: pastMap[m[0]], label: `„${pastMap[m[0]]}“ (Präsens)` });
    }
    // Perfekt „hat … gespeichert“ → nur Hinweis
    const perf = new RegExp(String.raw`${B}(hat|haben|habe|hast|habt)${E}[^.!?]*${PARTICIPLE}`, 'u').exec(t);
    if (perf && !/\bwerden\b/.test(perf[0])) add('past', 'info', 'Perfekt – im Präsens formulieren', perf.index!, perf.index! + perf[0].length);
    // Passiv (Präsens): „wird … gespeichert“ → aktiv formulieren (Hinweis)
    const pass = new RegExp(String.raw`${B}(wird|werden)${E}[^.!?]*?${PARTICIPLE}(?!\s+werden)`, 'u').exec(t);
    if (pass && !s.issues.some((i) => i.rule === 'future' && i.start <= s.start + pass.index! + pass[0].length)) add('passive', 'info', 'Passiv – aktiv formulieren (wer macht was?)', pass.index!, pass.index! + pass[0].length);

    for (const f of FILLERS) {
      for (const m of t.matchAll(new RegExp(String.raw`(^|\s)(${escape(f)})(?=[\s,.!?;:])`, 'giu'))) {
        const st = m.index! + m[1].length;
        add('filler', 'info', `Füllwort „${m[2]}“ – streichen`, st, st + m[2].length, { replacement: '', label: 'streichen', relStart: m.index!, relEnd: st + m[2].length });
      }
    }
    for (const m of t.matchAll(/(?<![\p{L}])([\p{L}]{2,})\s+\1(?![\p{L}])/giu)) {
      const second = m.index! + m[0].length - m[1].length;
      add('double_word', 'warning', `Doppeltes Wort „${m[1]}“`, m.index!, m.index! + m[0].length, { replacement: '', label: 'doppeltes Wort entfernen', relStart: m.index! + m[1].length, relEnd: second + m[1].length });
    }
    // Zeichensetzung
    for (const m of t.matchAll(/ +([,.;:!?])/g)) add('punctuation', 'warning', 'Leerzeichen vor Satzzeichen', m.index!, m.index! + m[0].length, { replacement: m[1], label: 'Leerzeichen entfernen' });
    for (const m of t.matchAll(/([,;])(?=[\p{L}])/gu)) add('punctuation', 'warning', 'Leerzeichen nach Satzzeichen fehlt', m.index!, m.index! + 1, { replacement: `${m[1]} `, label: 'Leerzeichen einfügen' });
    for (const m of t.matchAll(/(?<=[\p{Ll}]{2}|\d|\))([.!?])(?=[\p{Lu}])/gu)) add('punctuation', 'warning', 'Leerzeichen nach Satzende fehlt', m.index!, m.index! + 1, { replacement: `${m[1]} `, label: 'Leerzeichen einfügen' });
    for (const m of t.matchAll(/ {2,}/g)) add('punctuation', 'info', 'Doppeltes Leerzeichen', m.index!, m.index! + m[0].length, { replacement: ' ', label: 'ein Leerzeichen' });
    for (const m of t.matchAll(/([!?])\1+|\.{2}(?!\.)/g)) add('punctuation', 'warning', 'Mehrfache Satzzeichen – sachlich bleiben', m.index!, m.index! + m[0].length, { replacement: m[0][0], label: `„${m[0][0]}“` });
    for (const m of t.matchAll(/!/g)) if (!/!{2,}/.test(t)) add('punctuation', 'info', 'Ausrufezeichen – im Handbuch sachlich formulieren', m.index!, m.index! + 1, { replacement: '.', label: '„.“' });
    if (!isList && !isHeading && words >= 3 && !/[.!?:…)"“»]$/.test(t)) add('punctuation', 'warning', 'Satzzeichen am Satzende fehlt', t.length - 1, t.length, { replacement: `${t.slice(-1)}.`, label: 'Punkt ergänzen' });
    const firstLetter = /^(?:\s*(?:\d+\.|[-*])\s+|\*\*)?(\p{Ll})/u.exec(t);
    if (firstLetter && !isHeading && !/^(?:\s*(?:\d+\.|[-*])\s+)?(?:z\.|d\.|e-|i[A-Z])/.test(t)) {
      const at = firstLetter.index! + firstLetter[0].length - 1;
      add('capitalization', 'warning', 'Satzanfang kleingeschrieben', at, at + 1, { replacement: firstLetter[1].toUpperCase(), label: `„${firstLetter[1].toUpperCase()}“` });
    }
    for (const m of t.matchAll(new RegExp(String.raw`${B}[Mm]an${E}`, 'gu'))) add('impersonal', 'info', 'Unpersönlich – Leser direkt ansprechen („Sie“)', m.index!, m.index! + 3);
    for (const w of COLLOQUIAL) for (const m of t.matchAll(new RegExp(String.raw`(?<![\p{L}])${escape(w)}(?![\p{L}])`, 'giu'))) add('colloquial', 'info', `Umgangssprache „${m[0]}“ – sachlich formulieren`, m.index!, m.index! + m[0].length);
    for (const w of HEDGING) for (const m of t.matchAll(new RegExp(String.raw`(?<![\p{L}])${escape(w)}(?![\p{L}])`, 'giu'))) add('hedging', 'info', `Unklare Anweisung „${m[0]}“ – eindeutig formulieren`, m.index!, m.index! + m[0].length);
    const nominal = [...t.matchAll(/\b[\p{Lu}][\p{Ll}]+(?:ung|heit|keit|ion|ierung|schaft)(?:en)?\b/gu)];
    if (nominal.length >= 3) add('nominal', 'info', `Nominalstil (${nominal.map((n) => n[0]).slice(0, 4).join(', ')}) – mit Verben formulieren`, nominal[0].index!, nominal.at(-1)!.index! + nominal.at(-1)![0].length);
    for (const [wrong, right] of Object.entries(SPELLING)) {
      if (wrong === right) continue;
      for (const m of t.matchAll(new RegExp(String.raw`(?<![\p{L}-])${escape(wrong)}(?![\p{L}])`, 'giu'))) {
        // Groß-/Kleinschreibung des Fundes übernehmen
        const fixWord = right === 'E-Mail' ? right : m[0][0] === m[0][0].toUpperCase() ? right[0].toUpperCase() + right.slice(1) : right;
        if (fixWord === m[0]) continue;
        add('spelling', 'warning', `Rechtschreibung: „${fixWord}“`, m.index!, m.index! + m[0].length, { replacement: fixWord, label: `„${fixWord}“` });
      }
    }
    for (const [re, right] of ABBREVIATIONS) for (const m of t.matchAll(re)) add('abbreviation', 'info', `Abkürzung „${right}“ schreiben`, m.index!, m.index! + m[0].length, { replacement: right, label: `„${right}“` });
    for (const term of opts.terms ?? []) {
      for (const avoid of term.avoid) {
        for (const m of t.matchAll(new RegExp(String.raw`(?<![\p{L}])${escape(avoid)}(?![\p{L}])`, 'giu'))) add('terminology', 'warning', `Terminologie: „${term.preferred}“ statt „${m[0]}“`, m.index!, m.index! + m[0].length, { replacement: term.preferred, label: `„${term.preferred}“` });
      }
    }
    s.issues.sort((a, b) => a.start - b.start || (a.severity === 'warning' ? -1 : 1));
  }
  const counts: Partial<Record<StyleRule, number>> = {};
  let penalty = 0;
  for (const s of sentences) for (const i of s.issues) {
    counts[i.rule] = (counts[i.rule] ?? 0) + 1;
    penalty += i.severity === 'warning' ? 4 : 1;
  }
  const score = sentences.length ? Math.max(0, Math.round(100 - (penalty / sentences.length) * 10)) : 100;
  return { sentences, counts, score };
}

/** Korrekturen anwenden (von hinten nach vorn, überlappende werden ausgelassen) */
export function applyFixes(text: string, fixes: StyleFix[]): { text: string; applied: number } {
  let out = text;
  let applied = 0;
  let limit = Infinity;
  for (const f of [...fixes].sort((a, b) => b.start - a.start || b.end - a.end)) {
    if (f.end > limit || f.start < 0 || f.end > text.length || f.start > f.end) continue;
    out = out.slice(0, f.start) + f.replacement + out.slice(f.end);
    limit = f.start;
    applied++;
  }
  return { text: out, applied };
}

/** Alle automatischen Korrekturen (optional nur bestimmte Regeln), wiederholt bis nichts mehr zu tun ist */
export function autoFix(text: string, opts: StyleOptions & { rules?: StyleRule[] } = {}): { text: string; applied: number } {
  let cur = text;
  let total = 0;
  for (let round = 0; round < 5; round++) {
    const fixes = analyzeStyle(cur, opts).sentences.flatMap((s) => s.issues).filter((i) => i.fix && (!opts.rules || opts.rules.includes(i.rule))).map((i) => i.fix!);
    if (!fixes.length) break;
    const r = applyFixes(cur, fixes);
    if (r.text === cur) break;
    cur = r.text;
    total += r.applied;
  }
  return { text: cur, applied: total };
}

export const PRESENT_RULES: StyleRule[] = ['future', 'past'];
