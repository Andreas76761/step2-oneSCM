// Fragenkatalog einlesen (ADR-089, Etappe 37): Rückfragen aus einer HTML-App (Text, Tabellen und Daten im Skript),
// aus CSV, JSON oder Text – je Frage mit Kapitelbezug, ohne Doppelungen. Es wird nichts ausgeführt.

export interface CatalogQuestion { chapter: string | null; question: string }

const MAX = 500;
const Q_KEYS = ['frage', 'question', 'rueckfrage', 'rückfrage', 'q', 'text', 'titel', 'title'];
const C_KEYS = ['kapitel', 'chapter', 'kap', 'bereich', 'section', 'abschnitt', 'thema', 'topic'];

const decode = (s: string) => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
const clean = (s: string) => s.replace(/\\n/g, ' ').replace(/\\(["'`\\])/g, '$1').replace(/\s+/g, ' ').trim();
const isQuestion = (s: string) => s.length >= 8 && s.length <= 600 && /\?\s*$/.test(s) && /\p{L}{3}/u.test(s);
const norm = (s: string) => s.toLocaleLowerCase('de').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

function unique(list: CatalogQuestion[]) {
  const seen = new Set<string>();
  const out: CatalogQuestion[] = [];
  for (const q of list) {
    const question = clean(q.question).replace(/^(\d+[.)]|[-*•–]|F\d+:?)\s+/, '');
    const k = norm(question);
    if (!k || seen.has(k) || !isQuestion(question)) continue;
    seen.add(k);
    out.push({ chapter: q.chapter ? clean(q.chapter).slice(0, 200) : null, question: question.slice(0, 500) });
    if (out.length >= MAX) break;
  }
  return out;
}

/** Objekte im Skript wie { kapitel: "3 …", frage: "…?" } bzw. JSON-artige Daten */
function fromScripts(js: string): CatalogQuestion[] {
  const out: CatalogQuestion[] = [];
  for (const obj of js.matchAll(/\{[^{}]{0,4000}\}/g)) {
    const fields = new Map<string, string>();
    for (const m of obj[0].matchAll(/["']?([\p{L}_][\p{L}\p{N}_]*)["']?\s*:\s*(["'`])((?:\\.|(?!\2)[^\\])*)\2/gu)) fields.set(m[1].toLowerCase(), m[3]);
    const qk = Q_KEYS.find((k) => fields.has(k) && isQuestion(clean(fields.get(k)!)));
    if (!qk) continue;
    const ck = C_KEYS.find((k) => fields.has(k));
    out.push({ chapter: ck ? fields.get(ck)! : null, question: fields.get(qk)! });
  }
  // lose Zeichenketten mit Fragezeichen (z. B. Listen von Fragen)
  if (!out.length) for (const m of js.matchAll(/(["'`])((?:\\.|(?!\1)[^\\]){8,600}?\?)\1/g)) out.push({ chapter: null, question: m[2] });
  return out;
}

/** Sichtbarer Text: Überschriften setzen das Kapitel, Zeilen mit Fragezeichen sind Fragen; Tabellenzeilen mit Kapitelspalte */
function fromMarkup(html: string): CatalogQuestion[] {
  const out: CatalogQuestion[] = [];
  const body = html.replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1>/gi, ' ');
  // Tabellen mit Spalten „Kapitel“ und „Frage“
  for (const t of body.matchAll(/<table\b[\s\S]*?<\/table>/gi)) {
    const rows = [...t[0].matchAll(/<tr\b[\s\S]*?<\/tr>/gi)].map((r) => [...r[0].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((c) => clean(decode(c[1].replace(/<[^>]+>/g, ' ')))));
    if (!rows.length) continue;
    const head = rows[0].map((h) => h.toLowerCase());
    const qi = head.findIndex((h) => /frage|question/.test(h));
    const ci = head.findIndex((h) => /kapitel|chapter|bereich|abschnitt/.test(h));
    if (qi >= 0) for (const r of rows.slice(1)) out.push({ chapter: ci >= 0 ? r[ci] ?? null : null, question: r[qi] ?? '' });
  }
  let chapter: string | null = null;
  const text = body.replace(/<(h[1-4])\b[^>]*>([\s\S]*?)<\/\1>/gi, (_, _h, t) => `\n\u0001${t.replace(/<[^>]+>/g, ' ')}\n`)
    .replace(/<\/(p|div|li|tr|td|th|section|article|br|h[1-6])>|<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ');
  for (const raw of decode(text).split('\n')) {
    const line = clean(raw);
    if (!line) continue;
    if (line.startsWith('\u0001')) chapter = line.slice(1).trim() || chapter;
    else if (isQuestion(line)) out.push({ chapter, question: line });
  }
  return out;
}

export function parseQuestionCatalog(fileName: string, data: string): CatalogQuestion[] {
  const ext = fileName.toLowerCase().split('.').pop() ?? '';
  if (ext === 'json') {
    let j: any;
    try {
      j = JSON.parse(data);
    } catch {
      throw new Error('Keine gültige JSON-Datei.');
    }
    const list = Array.isArray(j) ? j : Array.isArray(j?.questions) ? j.questions : Array.isArray(j?.fragen) ? j.fragen : [];
    return unique(list.map((x: any) => (typeof x === 'string' ? { chapter: null, question: x }
      : { chapter: C_KEYS.map((k) => x?.[k]).find((v) => typeof v === 'string') ?? null, question: Q_KEYS.map((k) => x?.[k]).find((v) => typeof v === 'string') ?? '' })));
  }
  if (ext === 'csv') {
    const lines = data.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l.trim());
    const sep = (lines[0].match(/;/g)?.length ?? 0) >= (lines[0].match(/,/g)?.length ?? 0) ? ';' : ',';
    const cells = (l: string) => [...l.matchAll(new RegExp(`(?:^|${sep})(?:"((?:[^"]|"")*)"|([^${sep}]*))`, 'g'))].map((m) => (m[1] ?? m[2] ?? '').replace(/""/g, '"'));
    const head = cells(lines[0]).map((h) => h.toLowerCase());
    const qi = head.findIndex((h) => /frage|question/.test(h));
    const ci = head.findIndex((h) => /kapitel|chapter|bereich|abschnitt/.test(h));
    const rows = qi >= 0 ? lines.slice(1) : lines;
    return unique(rows.map((l) => cells(l)).map((c) => ({ chapter: ci >= 0 ? c[ci] ?? null : null, question: c[qi >= 0 ? qi : 0] ?? '' })));
  }
  if (ext === 'html' || ext === 'htm') {
    const scripts = [...data.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n');
    const fromJs = fromScripts(scripts);
    // Daten im Skript sind meist vollständiger (die App blendet Kapitel ein und aus); sichtbarer Text ergänzt
    return unique([...fromJs, ...fromMarkup(data)]);
  }
  // Text/Markdown: Überschriften setzen das Kapitel
  let chapter: string | null = null;
  const out: CatalogQuestion[] = [];
  for (const raw of data.split(/\r?\n/)) {
    const h = /^\s*#{1,4}\s+(.+)$/.exec(raw);
    if (h) chapter = h[1].trim();
    else if (raw.trim()) out.push({ chapter, question: raw.trim() });
  }
  return unique(out);
}
