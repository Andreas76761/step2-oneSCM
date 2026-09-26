// Anleitungs-Check (ADR-051): Ist ein Kapitel für Leserinnen und Leser leicht zu befolgen?
// Geprüft wird der Aufbau einer Handlungsanleitung (Zweck → Voraussetzungen → nummerierte Schritte → Ergebnis) und die
// Form der Schritte (eine Handlung je Schritt, Menüpfade hervorgehoben, Abkürzungen erklärt). Rein regelbasiert, ohne KI.
import { segmentSentences } from './style.js';

export interface GuidanceBlock { id: string; section: string; kind: string; text: string; versionNo: number; locked?: boolean }
export interface GuidanceFix { blockId: string; versionNo: number; text: string; kind?: string; label: string }
export interface GuidanceItem { blockId: string | null; excerpt: string; fix?: GuidanceFix }
export type GuidanceCode = 'purpose' | 'prerequisites' | 'steps' | 'numbered' | 'one_action' | 'menu_bold' | 'result' | 'step_count' | 'abbreviations' | 'long_paragraph';
export interface GuidanceCheck {
  code: GuidanceCode;
  label: string;
  status: 'ok' | 'warning' | 'info';
  message: string;
  hint: string;
  items: GuidanceItem[];
  /** Abschnitt fehlt: in der Oberfläche direkt einen Absatz dafür schreiben */
  addSection?: { section: string; kind: 'paragraph' | 'list'; placeholder: string };
}

export const GUIDANCE_LABEL: Record<GuidanceCode, string> = {
  purpose: 'Zweck beschrieben',
  prerequisites: 'Voraussetzungen genannt',
  steps: 'Handlungsschritte vorhanden',
  numbered: 'Schritte nummeriert',
  one_action: 'Eine Handlung je Schritt',
  menu_bold: 'Menüpfade hervorgehoben',
  result: 'Ergebnis beschrieben',
  step_count: 'Überschaubare Schrittzahl',
  abbreviations: 'Abkürzungen erklärt',
  long_paragraph: 'Kurze Absätze',
};

/** Kurzbezeichnung eines offenen Punkts (Übersichten) */
export const GUIDANCE_OPEN_LABEL: Record<GuidanceCode, string> = {
  purpose: 'Zweck fehlt',
  prerequisites: 'Voraussetzungen fehlen',
  steps: 'Keine Schritte',
  numbered: 'Schritte nicht nummeriert',
  one_action: 'Mehrere Handlungen je Schritt',
  menu_bold: 'Menüpfade nicht hervorgehoben',
  result: 'Ergebnis fehlt',
  step_count: 'Sehr viele Schritte',
  abbreviations: 'Abkürzungen unerklärt',
  long_paragraph: 'Lange Absätze',
};

const MAX_STEPS = 10;
const MAX_PARAGRAPH_WORDS = 80;
const MODALS = new Set(['können', 'müssen', 'sollten', 'sollen', 'dürfen', 'haben', 'sind', 'werden', 'wollen', 'möchten', 'hätten', 'wären', 'würden']);
const ADVERBS = new Set(['dann', 'anschließend', 'danach', 'zuerst', 'zunächst', 'nun', 'jetzt', 'abschließend', 'bitte', 'hier', 'dort']);
const DU_VERBS = new Set(['klicke', 'wähle', 'öffne', 'gib', 'trage', 'speichere', 'prüfe', 'markiere', 'bestätige', 'drücke', 'lege', 'gehe', 'rufe', 'ändere', 'lösche', 'füge', 'suche', 'setze', 'aktiviere', 'starte', 'schließe', 'erfasse', 'ziehe', 'lade']);
const INFINITIVE_END = /(?:klicken|wählen|öffnen|eingeben|eintragen|speichern|bestätigen|markieren|drücken|anlegen|aufrufen|ändern|löschen|hinzufügen|prüfen|aktivieren|erfassen|auswählen|anklicken|schließen|starten|hochladen|freigeben)\s*[.!]?$/i;
const LIST_ITEM = /^(\s*)(?:(\d+)[.)]|[-*•])\s+/;
// Menüpfad: mindestens zwei Glieder, getrennt durch > → -> » oder „|“ (z. B. „Stammdaten > Artikel > Neu“)
// Glieder aus großgeschriebenen Wörtern (ohne „Sie“, damit „Öffnen Sie Einkauf > …“ nur den Pfad erfasst)
const SEG = String.raw`(?!Sie\b)\p{Lu}[\p{L}\d-]*(?: (?!Sie\b)\p{Lu}[\p{L}\d-]*){0,2}`;
const MENU_PATH = new RegExp(String.raw`(?<![\p{L}*])(${SEG}(?:\s*(?:>|→|->|»)\s*${SEG})+)(?![\p{L}*])`, 'gu');
const ACRONYM = /(?<![\p{L}\d])(\p{Lu}{2,6}|\p{Lu}{1,4}\d{1,2})(?![\p{L}\d])/gu;
const COMMON_ACRONYMS = new Set(['OK', 'PDF', 'URL', 'ID', 'E-MAIL', 'CSV', 'PC', 'USB', 'EU', 'IT', 'CEO', 'GMBH', 'AG', 'KG', 'EUR', 'USD', 'NR', 'II', 'III', 'IV', 'VI']);

const words = (s: string) => s.split(/\s+/).filter(Boolean);
const strip = (s: string) => s.replace(/\*\*|__|`/g, '').replace(/^[„"(]+/, '');
const excerpt = (s: string, n = 90) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

/** Satz ist eine Handlungsaufforderung („Klicken Sie …“, „Klicke …“, „Auf Speichern klicken.“) */
export function isAction(sentence: string): boolean {
  const s = strip(sentence.replace(LIST_ITEM, '')).trim();
  if (!s || s.endsWith('?')) return false;
  const w = words(s).map((x) => x.replace(/[.,:;!]+$/, ''));
  let i = 0;
  if (w[0] && ADVERBS.has(w[0].toLowerCase())) i = 1;
  const first = w[i] ?? '';
  const lower = first.toLowerCase();
  if (w[i + 1] === 'Sie' && /^[\p{L}]+(?:en|ern|eln)$/u.test(first) && !MODALS.has(lower)) return true;
  if (DU_VERBS.has(lower)) return true;
  return INFINITIVE_END.test(s) && !/\b(?:Sie|du|wird|werden|kann|können|muss|müssen)\b/.test(s);
}

/** Aufteilen eines Satzes mit zwei Handlungen („Klicken Sie auf X und wählen Sie Y.“) */
function splitCompound(sentence: string): string[] | null {
  const m = sentence.match(/^(.*?)(?:,)?\s+(?:und|dann|anschließend|danach)\s+((?:dann\s+)?[\p{L}]+\s+Sie\b.*|(?:klicke|wähle|öffne|gib|trage|speichere|prüfe|markiere|bestätige|drücke)\b.*)$/u);
  if (!m) return null;
  const a = m[1].trim().replace(/[,;]$/, '');
  const b = m[2].trim();
  if (!isAction(a) || !isAction(b)) return null;
  const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
  return [/[.!]$/.test(a) ? a : `${a}.`, cap(b)];
}

interface Item { lead: string; text: string }
const renderNumbered = (intro: string[], items: string[]) =>
  [...(intro.length ? [intro.join(' '), ''] : []), ...items.map((t, i) => `${i + 1}. ${t}`)].join('\n');

/** Listentext → Einleitung (Zeilen vor der ersten Aufzählung) + Einträge */
function parseList(text: string): { intro: string[]; items: Item[]; numbered: boolean } {
  const intro: string[] = [];
  const items: Item[] = [];
  let numbered = true;
  for (const line of text.split('\n')) {
    const m = line.match(LIST_ITEM);
    if (m) {
      if (!m[2]) numbered = false;
      items.push({ lead: m[0], text: line.slice(m[0].length).trim() });
    } else if (line.trim()) {
      if (items.length) items[items.length - 1].text += ` ${line.trim()}`;
      else intro.push(line.trim());
    }
  }
  return { intro, items, numbered };
}

function boldMenuPaths(text: string): string {
  return text.replace(MENU_PATH, (m, _g, offset: number, all: string) => {
    // schon fett oder in Code
    const before = all.slice(Math.max(0, offset - 2), offset);
    if (before === '**' || before.endsWith('`')) return m;
    return `**${m.trim()}**`;
  });
}

export interface GuidanceOptions {
  /** bekannte Abkürzungen (Stammdaten, Terminologie) in Großbuchstaben */
  knownAcronyms?: Set<string>;
}

export function analyzeGuidance(blocks: GuidanceBlock[], opts: GuidanceOptions = {}) {
  const content = blocks.filter((b) => b.kind !== 'gap' && b.kind !== 'xref' && b.text.trim());
  const inSection = (s: string) => content.filter((b) => b.section === s);
  const stepBlocks = inSection('steps');
  const hasSteps = stepBlocks.length > 0 || content.some((b) => segmentSentences(b.text).filter((x) => isAction(x.text)).length >= 2);
  const checks: GuidanceCheck[] = [];
  const add = (code: GuidanceCode, bad: 'warning' | 'info', failed: boolean, message: [string, string], hint: string, items: GuidanceItem[] = [], addSection?: GuidanceCheck['addSection']) =>
    checks.push({ code, label: GUIDANCE_LABEL[code], status: failed ? bad : 'ok', message: failed ? message[1] : message[0], hint, items: failed ? items : [], ...(failed && addSection ? { addSection } : {}) });

  add('purpose', 'warning', inSection('purpose').length === 0,
    ['Der Zweck des Kapitels ist beschrieben.', 'Es fehlt ein kurzer Einstieg: Wozu dient diese Anleitung?'],
    'Ein bis zwei Sätze: Was erreichen Leserinnen und Leser mit dieser Anleitung und wann brauchen sie sie?', [],
    { section: 'purpose', kind: 'paragraph', placeholder: 'Mit dieser Anleitung legen Sie … an. Sie benötigen sie, wenn …' });

  add('prerequisites', 'info', hasSteps && inSection('prerequisites').length === 0,
    ['Voraussetzungen sind genannt.', 'Voraussetzungen fehlen: Was muss erledigt sein, bevor man beginnt?'],
    'Zum Beispiel Berechtigung, benötigte Stammdaten oder vorher abgeschlossene Schritte – als kurze Liste.', [],
    { section: 'prerequisites', kind: 'list', placeholder: '- Sie haben die Berechtigung …\n- Die Stammdaten … sind angelegt.' });

  add('steps', 'warning', !hasSteps,
    ['Das Kapitel enthält Handlungsschritte.', 'Es gibt keine Handlungsschritte – Leser wissen nicht, was sie tun sollen.'],
    'Beschreiben Sie die Aufgabe als nummerierte Schritte, je Schritt eine Handlung („Klicken Sie auf **Speichern**.“).', [],
    { section: 'steps', kind: 'list', placeholder: '1. Öffnen Sie **Menü > Eintrag**.\n2. Klicken Sie auf **Neu**.\n3. …' });

  // Schritte als Fließtext oder als Aufzählung ohne Nummern
  const numbered: GuidanceItem[] = [];
  const oneAction: GuidanceItem[] = [];
  const stepCount: GuidanceItem[] = [];
  for (const b of content) {
    if (b.kind === 'table' || b.kind === 'code') continue;
    const fixable = !b.locked;
    if (b.kind === 'list') {
      const l = parseList(b.text);
      const actions = l.items.filter((it) => isAction(it.text)).length;
      if (!actions) continue;
      if (!l.numbered && actions >= 2 && (b.section === 'steps' || actions === l.items.length)) {
        numbered.push({ blockId: b.id, excerpt: excerpt(l.items[0].text), ...(fixable ? { fix: { blockId: b.id, versionNo: b.versionNo, text: renderNumbered(l.intro, l.items.map((i) => i.text)), label: 'Aufzählung nummerieren' } } : {}) });
      }
      // mehrere Handlungen in einem Schritt → aufteilen
      let split = false;
      const out: string[] = [];
      for (const it of l.items) {
        const sents = segmentSentences(it.text).map((s) => s.text);
        const acts = sents.filter(isAction);
        if (acts.length >= 2) {
          split = true;
          // nicht-Handlungssätze bleiben beim vorangehenden Schritt
          let cur: string[] = [];
          for (const s of sents) {
            if (isAction(s) && cur.some(isAction)) (out.push(cur.join(' ')), (cur = []));
            cur.push(s);
          }
          if (cur.length) out.push(cur.join(' '));
          oneAction.push({ blockId: b.id, excerpt: excerpt(it.text) });
          continue;
        }
        const parts = sents.length === 1 ? splitCompound(sents[0]) : null;
        if (parts) {
          split = true;
          out.push(...parts);
          oneAction.push({ blockId: b.id, excerpt: excerpt(it.text) });
          continue;
        }
        out.push(it.text);
      }
      if (split && fixable) {
        const first = oneAction.findIndex((x) => x.blockId === b.id);
        oneAction[first].fix = { blockId: b.id, versionNo: b.versionNo, text: renderNumbered(l.intro, out), label: 'In einzelne Schritte teilen' };
      }
      if (l.items.length > MAX_STEPS && actions >= 2) stepCount.push({ blockId: b.id, excerpt: `${l.items.length} Schritte: ${excerpt(l.items[0].text, 60)}` });
    } else {
      const sents = segmentSentences(b.text).map((s) => s.text);
      const actionCount = sents.filter(isAction).length;
      if (actionCount >= 2) {
        const intro: string[] = [];
        const items: string[] = [];
        for (const s of sents) {
          if (isAction(s)) items.push(...(splitCompound(s) ?? [s]));
          else if (items.length) items[items.length - 1] += ` ${s}`;
          else intro.push(s);
        }
        numbered.push({ blockId: b.id, excerpt: excerpt(sents.find(isAction)!), ...(fixable ? { fix: { blockId: b.id, versionNo: b.versionNo, text: renderNumbered(intro, items), kind: 'list', label: 'Als nummerierte Schritte schreiben' } } : {}) });
      } else if (actionCount === 1 && sents.length === 1) {
        const parts = splitCompound(sents[0]);
        if (parts) oneAction.push({ blockId: b.id, excerpt: excerpt(sents[0]), ...(fixable ? { fix: { blockId: b.id, versionNo: b.versionNo, text: renderNumbered([], parts), kind: 'list', label: 'In einzelne Schritte teilen' } } : {}) });
      }
    }
  }
  add('numbered', 'warning', numbered.length > 0,
    ['Handlungsschritte sind nummeriert.', `${numbered.length} ${numbered.length === 1 ? 'Stelle beschreibt' : 'Stellen beschreiben'} Schritte als Fließtext oder ohne Nummern.`],
    'Nummerierte Schritte zeigen die Reihenfolge und lassen sich beim Arbeiten leichter abhaken.', numbered);
  add('one_action', 'warning', oneAction.length > 0,
    ['Jeder Schritt enthält eine Handlung.', `${oneAction.length} ${oneAction.length === 1 ? 'Schritt enthält' : 'Schritte enthalten'} mehrere Handlungen.`],
    'Eine Handlung je Schritt: Leser verlieren sonst leicht die Stelle, an der sie gerade sind.', oneAction);

  const menu: GuidanceItem[] = [];
  for (const b of content) {
    if (b.kind === 'code') continue;
    const fixed = boldMenuPaths(b.text);
    if (fixed !== b.text) {
      const first = b.text.match(MENU_PATH)?.[0] ?? '';
      menu.push({ blockId: b.id, excerpt: first.trim(), ...(!b.locked ? { fix: { blockId: b.id, versionNo: b.versionNo, text: fixed, label: 'Menüpfade fett setzen' } } : {}) });
    }
  }
  add('menu_bold', 'info', menu.length > 0,
    ['Menüpfade und Schaltflächen sind hervorgehoben.', `${menu.length} ${menu.length === 1 ? 'Menüpfad ist' : 'Menüpfade sind'} nicht hervorgehoben.`],
    'Fett gesetzte Menüpfade („**Stammdaten > Artikel**“) findet man beim Überfliegen sofort.', menu);

  add('result', 'info', hasSteps && inSection('result').length === 0,
    ['Das Ergebnis ist beschrieben.', 'Es fehlt, woran Leser erkennen, dass sie fertig sind.'],
    'Ein Satz genügt: Was zeigt das System nach dem letzten Schritt an?', [],
    { section: 'result', kind: 'paragraph', placeholder: 'Der Eintrag ist gespeichert und erscheint in der Liste …' });

  add('step_count', 'info', stepCount.length > 0,
    ['Die Anleitungen sind überschaubar lang.', `Eine Anleitung hat mehr als ${MAX_STEPS} Schritte.`],
    'Lange Abläufe in Teilaufgaben mit eigener Zwischenüberschrift aufteilen.', stepCount);

  const known = opts.knownAcronyms ?? new Set<string>();
  const all = content.map((b) => b.text).join('\n');
  const inline = new Set([...all.matchAll(/\((\p{Lu}{2,6}|\p{Lu}{1,4}\d{1,2})\)/gu)].map((m) => m[1]));
  const unknown = new Map<string, string>();
  for (const b of content) {
    if (b.kind === 'code') continue;
    for (const m of b.text.replace(/`[^`]*`|\]\([^)]*\)/g, ' ').matchAll(ACRONYM)) {
      const a = m[1];
      if (known.has(a) || inline.has(a) || COMMON_ACRONYMS.has(a) || unknown.has(a)) continue;
      unknown.set(a, b.id);
    }
  }
  add('abbreviations', 'info', unknown.size > 0,
    ['Alle Abkürzungen sind erklärt.', `${unknown.size} ${unknown.size === 1 ? 'Abkürzung ist' : 'Abkürzungen sind'} weder im Text noch in den Stammdaten erklärt.`],
    'Beim ersten Vorkommen ausschreiben („Supply Chain Management (SCM)“) oder unter Stammdaten → Abkürzungen erfassen.',
    [...unknown.entries()].map(([a, id]) => ({ blockId: id, excerpt: a })));

  const long = content.filter((b) => b.kind === 'paragraph' && words(b.text).length > MAX_PARAGRAPH_WORDS).map((b) => ({ blockId: b.id, excerpt: `${words(b.text).length} Wörter: ${excerpt(b.text, 60)}` }));
  add('long_paragraph', 'info', long.length > 0,
    ['Die Absätze sind kurz.', `${long.length} ${long.length === 1 ? 'Absatz ist' : 'Absätze sind'} länger als ${MAX_PARAGRAPH_WORDS} Wörter.`],
    'Kurze Absätze mit je einem Gedanken lesen sich am Bildschirm leichter.', long);

  const penalty = checks.reduce((n, c) => n + (c.status === 'warning' ? 15 : c.status === 'info' ? 5 : 0), 0);
  const score = Math.max(0, 100 - penalty);
  return { score, passed: checks.filter((c) => c.status === 'ok').length, total: checks.length, fixable: checks.reduce((n, c) => n + c.items.filter((i) => i.fix).length, 0), checks };
}
