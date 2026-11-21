// Retrieval v2 für „Frage an alle Quellen“ (ADR-099) – lokal, ohne Netz und ohne Modell-Download:
// 1. Analyse mit deutscher Morphologie: Stämme, Partizip (ge…t), Umlaut-Varianten, trennbare Verben („lege … an“ → anleg),
//    Zerlegung von Komposita gegen das Vokabular des Bestands (Kündigungsfrist → kündig + frist), Abkürzungen (MO) bleiben.
// 2. Abfrageerweiterung aus Terminologie (Synonyme, Übersetzungen – auch für englische Fragen) und Abkürzungen.
// 3. BM25 je Begriff (Konzept) über Text plus Kontextkopf (Datei und Überschriftenpfad, doppelt gewichtet).
// 4. Reciprocal Rank Fusion von BM25 und Vektor (k = 60), Neugewichtung nach gewichteter Begriffsabdeckung.
// 5. Relevanzschwelle (IDF-gewichtete Abdeckung, unbekannte Begriffe zählen voll) → begründete Enthaltung bei Lückenfragen.
// 6. MMR-Auswahl der Belege (Vielfalt, keine Dubletten älterer Fassungen).
import { normalizeText, stem } from './similarity.js';
import { splitSentences } from './translate.js';

export const RRF_K = 60;
export const BM25_K1 = 1.2;
export const BM25_B = 0.75;
export const HEADER_WEIGHT = 2;
/** Mindestabdeckung der Frage durch einen Beleg (IDF-gewichtet) */
export const MIN_COVERAGE = 0.6;
export const MMR_LAMBDA = 0.75;
export const DUPLICATE_JACCARD = 0.9;

// Funktionswörter der Frage: tragen keine Bedeutung für die Suche (zusätzlich zu den Stoppwörtern der Tokenisierung)
const QUESTION_WORDS = new Set((
  'wie was wer wen wem wessen welche welcher welches welchen wann wo wohin woher warum wieso weshalb wieviel wie viele viel viele lange lang ' +
  'gibt geben macht machen gemacht passiert passieren bleibt bleiben dauert dauern geht gehen ich mein meine meinen mir mich man wird werden worden ' +
  'darf dürfen kann können muss müssen soll sollen hat haben habe ist sind sein bitte genau eigentlich denn hier dort damit dafür dabei wieder immer schon ' +
  'how what who whom which when where why does do did can could should would will is are was were the a an of to in on for with by my i me you it ' +
  'long much many have has had there get got need'
).split(/\s+/));
const STOPWORDS = new Set((
  'der die das den dem des ein eine einer eines einem einen und oder aber auch als am an auf aus bei bis durch für gegen im in ins um unter über von vor zu zum zur ' +
  'sich es er sie wir ihr dies diese dieser dieses jede jeder jedes alle allen wenn dann da dass noch nur bzw ggf etc sowie beim nicht kein keine keinen ' +
  'mit nach ohne seit so wie ' +
  'and or of to in is are be for on with by the a an'
).split(/\s+/));
const PARTICLES = ['an', 'ab', 'auf', 'aus', 'ein', 'zu', 'zurück', 'vor', 'nach', 'mit', 'weg', 'fest', 'frei', 'hinzu'];
// unregelmäßige Formen, die kein Stemming zusammenführt (Ablaut)
const IRREGULAR: Record<string, string[]> = { gilt: ['gelt', 'gueltig'], galt: ['gelt', 'gueltig'], gibt: ['geb'], nimmt: ['nehm'], hielt: ['halt'], liegt: ['lieg'] };
const VERB_PREFIX = /^(?:be|ver|er|ent|zer|ge)(?=.{4,})/;
// allgemeine Substantive der Frage („Wie viel Zeit …“): keine Fachbegriffe
const GENERIC = new Set(['zeit', 'frage', 'problem', 'moeglichkeit', 'möglichkeit', 'art', 'weise', 'fall', 'thema', 'information', 'info', 'sache', 'punkt', 'beispiel']);
/** Kennungen wie E-4711, ONESCM-1234 als ein Token */
const IDENT = /\b\p{L}{1,10}-\d{2,}\b/gu;

const fold = (w: string) => w.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
const words = (text: string) => normalizeText(text).split(/[^\p{L}\p{N}]+/u).filter(Boolean);

/** Varianten eines Wortstamms: Partizip ohne ge-/-t, ohne End-t, Umlaut gefaltet – symmetrisch für Frage und Text */
export function forms(word: string): string[] {
  const s = stem(word.toLowerCase());
  const out = new Set([s]);
  const add = (x: string) => x.length >= 3 && out.add(x);
  if (s.length >= 6 && s.startsWith('ge')) add(stem(s.slice(2).replace(/t$/, '')));
  if (s.length >= 5 && /[^s]t$/.test(s)) add(s.slice(0, -1));
  for (const x of [...out]) {
    const u = x.replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');
    if (u !== x) add(u);
  }
  return [...out];
}

/** Kompositum in Teile zerlegen, die als eigene Wörter im Vokabular vorkommen (mit Fugen-s/-es/-n) */
export function decompound(word: string, vocab: Set<string>, depth = 0): string[] | null {
  const w = fold(word.toLowerCase());
  if (w.length < 8 || depth > 2) return null;
  for (let i = w.length - 4; i >= 4; i--) {
    const right = w.slice(i);
    const rightStem = stem(right);
    if (!vocab.has(rightStem) && !vocab.has(right)) continue;
    for (const left of [w.slice(0, i), w.slice(0, i).replace(/(?:es|s|n)$/, '')]) {
      if (left.length < 4) continue;
      const ls = stem(left);
      if (vocab.has(ls) || vocab.has(left)) return [ls, rightStem];
      const sub = decompound(left, vocab, depth + 1);
      if (sub) return [...sub, rightStem];
    }
  }
  return null;
}

export interface Unit { text: string; header: string }
interface Doc { tf: Map<string, number>; len: number; head: Set<string>; body: Set<string> }
export interface Index { docs: Doc[]; df: Map<string, number>; avgLen: number; vocab: Set<string>; n: number }

/** Tokens eines Textes mit Varianten und Kompositumteilen (Vokabular aus dem Bestand) */
function analyze(text: string, vocab: Set<string> | null) {
  const out: string[] = (text.match(IDENT) ?? []).map((x) => x.toLowerCase());
  for (const w of words(text)) {
    if (/^\d+$/.test(w)) {
      if (w.length >= 3) out.push(w);
      continue;
    }
    if (w.length < 2 || STOPWORDS.has(w)) continue;
    out.push(...forms(w));
    if (vocab) {
      const parts = decompound(w, vocab);
      if (parts) for (const p of parts) out.push(...forms(p));
    }
  }
  return out;
}

/** Index über alle Such-Einheiten: zuerst Vokabular der einfachen Stämme, dann Analyse mit Zerlegung */
export function buildIndex(units: Unit[]): Index {
  const vocab = new Set<string>();
  for (const u of units) for (const w of words(`${u.header} ${u.text}`)) if (w.length >= 3 && !STOPWORDS.has(w)) vocab.add(stem(w));
  const df = new Map<string, number>();
  const docs = units.map((u) => {
    const body = analyze(u.text, vocab);
    const head = analyze(u.header, vocab);
    const tf = new Map<string, number>();
    for (const t of body) tf.set(t, (tf.get(t) ?? 0) + 1);
    for (const t of head) tf.set(t, (tf.get(t) ?? 0) + HEADER_WEIGHT);
    for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    return { tf, len: body.length + head.length * HEADER_WEIGHT, head: new Set(head), body: new Set(body) };
  });
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / (docs.length || 1);
  return { docs, df, avgLen, vocab, n: docs.length };
}

export interface Lexicon { groups: string[][] }
export interface Concept { word: string; terms: Map<string, number>; expandedBy: string[]; known: boolean; idf: number; noun: boolean; ident?: boolean; weight: number }
/** Gewicht der Wortarten in der Abdeckung: Substantive, Abkürzungen und Kennungen tragen die Frage, Verben und Adjektive weniger */
export const NON_NOUN_WEIGHT = 0.5;
export interface Query { concepts: Concept[]; expansions: string[]; text: string }

/**
 * Frage → Konzepte (je Inhaltswort): Varianten (Gewicht 1), Kompositumteile (0,8), trennbares Verb (1),
 * Synonyme/Übersetzungen/Abkürzungen (0,6). Abkürzungen in Großbuchstaben bleiben trotz Kürze erhalten.
 */
export function analyzeQuery(question: string, index: Index, lexicon: Lexicon, opts: { language?: string } = {}): Query {
  // Englisch kennt keine Großschreibung der Substantive: alle Inhaltswörter gleich gewichtet
  const en = opts.language === 'en';
  const raw = question.normalize('NFKC').split(/[^\p{L}\p{N}-]+/u).filter(Boolean);
  const lower = words(question);
  const particles = new Set(lower.filter((w) => PARTICLES.includes(w)));
  const concepts: Concept[] = [];
  const seen = new Set<string>();
  const expansions: string[] = [];
  const idf = (t: string) => Math.log(1 + (index.n - (index.df.get(t) ?? 0) + 0.5) / ((index.df.get(t) ?? 0) + 0.5));
  const keys = [...index.df.keys()];
  for (const [pos, r] of raw.entries()) {
    // Kennungen wie E-4711 oder ONESCM-1234 als Ganzes (ein Konzept)
    if (/^\p{L}{1,10}-\d{2,}$/u.test(r)) {
      const id = r.toLowerCase();
      if (!seen.has(id)) (seen.add(id), concepts.push({ word: r, terms: new Map([[id, 1]]), expandedBy: [], known: false, idf: 0, noun: true, ident: true, weight: 1 }));
      continue;
    }
    for (const p of r.split('-')) {
      const w = normalizeText(p);
      const acronym = /^\p{Lu}{2,5}$/u.test(p);
      if (!w || PARTICLES.includes(w) || GENERIC.has(w) || (!acronym && (w.length < 3 || STOPWORDS.has(w) || QUESTION_WORDS.has(w))) || (/^\d+$/.test(w) && w.length < 3)) continue;
      // Großschreibung: Substantive und Abkürzungen tragen die Bedeutung (nicht das erste Wort der Frage)
      const noun = en || acronym || (pos > 0 && /^\p{Lu}/u.test(p));
      const key = stem(w);
      if (seen.has(key)) continue;
      seen.add(key);
      const terms = new Map<string, number>();
      for (const f of forms(w)) terms.set(f, 1);
      for (const x of IRREGULAR[w] ?? []) for (const f of forms(x)) terms.set(f, 0.9);
      const comp = decompound(w, index.vocab);
      if (comp) for (const c of comp) for (const f of forms(c)) if (!terms.has(f)) terms.set(f, 0.8);
      for (const pt of particles) for (const f of forms(pt + w)) if (index.df.has(f)) terms.set(f, 1);
      // Wortteil eines Kompositums im Bestand (Fahrzeug → Fahrzeugmodell, Grund → Kündigungsgrund), auch ohne Vorsilbe (bezahlen → Zahlungsziel)
      if (![...terms.keys()].some((t) => index.df.has(t))) {
        const own = [...terms.keys()];
        // Vorsilben nur bei Verben abtrennen (bezahlen → zahl), Partikelverben auf ihre Familie (zurücknehmen → zurück…)
        const bases = new Set([...own, ...(noun ? [] : own.map((t) => t.replace(VERB_PREFIX, '')))].filter((b) => b.length >= 4));
        const particle = noun ? undefined : PARTICLES.map(fold).find((pt) => pt.length >= 3 && fold(w).startsWith(pt) && fold(w).length >= pt.length + 4);
        let n = 0;
        for (const k of keys) {
          if (n >= 30) break;
          // Kopf eines Kompositums, oder Schwanz mit bekanntem Kopf davor (Kündigungs|grund – nicht Über|sicht)
          const tail = (b: string) => k.endsWith(b) && ((h) => index.vocab.has(stem(h)) || index.vocab.has(stem(h.replace(/(?:es|s|n)$/, ''))))(k.slice(0, -b.length));
          if ([...bases].some((b) => k.length >= b.length + 3 && (k.startsWith(b) || tail(b)))) (terms.set(k, 0.7), n++);
          else if (particle && k.startsWith(particle) && k.length >= particle.length + 3 && !terms.has(k)) (terms.set(k, 0.5), n++);
        }
      }
      concepts.push({ word: p, terms, expandedBy: [], known: false, idf: 0, noun, weight: noun ? 1 : NON_NOUN_WEIGHT });
    }
  }
  // Erweiterung: Gruppe passt, wenn alle Wörter eines Eintrags in der Frage stehen (als Stamm oder Variante)
  const qForms = new Set(concepts.flatMap((c) => [...c.terms.keys()]));
  for (const g of lexicon.groups) {
    for (const member of g) {
      const mw = words(member).filter((w) => !STOPWORDS.has(w));
      if (!mw.length || !mw.every((w) => forms(w).some((f) => qForms.has(f)))) continue;
      const owners = concepts.filter((c) => mw.some((w) => forms(w).some((f) => c.terms.has(f))));
      const target = owners[0];
      if (!target) continue;
      // mehrteiliger Eintrag („payment term“): seine Wörter bilden ein Konzept
      for (const o of owners.slice(1)) {
        for (const [t, w] of o.terms) if (!target.terms.has(t)) target.terms.set(t, w);
        concepts.splice(concepts.indexOf(o), 1);
      }
      for (const other of g) {
        if (other === member) continue;
        let added = false;
        for (const w of words(other)) {
          if (STOPWORDS.has(w)) continue;
          for (const f of forms(w)) if (!target.terms.has(f)) (target.terms.set(f, 0.85), (added = true));
          const comp = decompound(w, index.vocab);
          if (comp) for (const c of comp) for (const f of forms(c)) if (!target.terms.has(f)) (target.terms.set(f, 0.75), (added = true));
        }
        if (added) {
          target.expandedBy.push(other);
          expansions.push(other);
        }
      }
      break;
    }
  }
  const maxIdf = Math.log(1 + (index.n + 0.5) / 0.5);
  for (const c of concepts) {
    const present = [...c.terms.keys()].filter((t) => index.df.has(t));
    c.known = present.length > 0;
    // unbekannte Fachbegriffe (Substantive, Abkürzungen, Kennungen) zählen voll, unbekannte Verben und Adjektive halb
    c.idf = c.known ? Math.max(...present.map(idf)) : c.noun ? maxIdf : maxIdf / 2;
    // Kennungen (Ticket, Fehlercode) entscheiden die Frage
    if (c.ident) c.idf = maxIdf * 1.5;
  }
  return { concepts, expansions: [...new Set(expansions)], text: [question, ...expansions].join(' ') };
}

/** BM25 je Konzept: bester Begriff des Konzepts zählt (Varianten und Erweiterungen werden nicht doppelt gezählt) */
export function bm25(index: Index, q: Query, i: number) {
  const d = index.docs[i];
  let score = 0;
  for (const c of q.concepts) {
    let best = 0;
    for (const [t, w] of c.terms) {
      const tf = d.tf.get(t);
      if (!tf) continue;
      const df = index.df.get(t) ?? 0;
      const idf = Math.log(1 + (index.n - df + 0.5) / (df + 0.5));
      const s = (w * idf * tf * (BM25_K1 + 1)) / (tf + BM25_K1 * (1 - BM25_B + (BM25_B * d.len) / index.avgLen));
      if (s > best) best = s;
    }
    score += best;
  }
  return score;
}

/** Anteil der Frage, den ein Text abdeckt: je Konzept bestes Gewicht, IDF-gewichtet; unbekannte Begriffe zählen voll */
export function coverage(q: Query, tokens: Set<string>) {
  let got = 0;
  let total = 0;
  for (const c of q.concepts) {
    total += c.idf * c.weight;
    let best = 0;
    for (const [t, w] of c.terms) if (tokens.has(t) && w > best) best = w;
    got += c.idf * c.weight * best;
  }
  return total ? got / total : 0;
}

const jaccard = (a: Set<string>, b: Set<string>) => {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter || 1);
};

export interface Ranked { i: number; score: number; bm25: number; coverage: number; head: number; rrf: number }

/**
 * Rangfolge: BM25- und Vektorliste per RRF verbinden, Kandidaten mit Mindestabdeckung neu gewichten, per MMR auswählen.
 * `sims`: Vektorähnlichkeit je Einheit (oder null, wenn kein Vektor berechnet wurde).
 */
export function rank(index: Index, q: Query, sims: (number | null)[], opts: { candidates: number; passages: number; minCoverage?: number }): { ranked: Ranked[]; best: number } {
  const n = index.n;
  const lex = Array.from({ length: n }, (_, i) => ({ i, s: bm25(index, q, i) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);
  const dense = sims.map((s, i) => ({ i, s: s ?? 0 })).filter((x) => x.s > 0.15).sort((a, b) => b.s - a.s).slice(0, 100);
  const rrf = new Map<number, number>();
  lex.forEach((x, r) => rrf.set(x.i, (rrf.get(x.i) ?? 0) + 1 / (RRF_K + r + 1)));
  dense.forEach((x, r) => rrf.set(x.i, (rrf.get(x.i) ?? 0) + 1 / (RRF_K + r + 1)));
  const bm = new Map(lex.map((x) => [x.i, x.s]));
  const maxRrf = 2 / (RRF_K + 1);
  const min = opts.minCoverage ?? MIN_COVERAGE;
  let best = 0;
  const pool = [...rrf].sort((a, b) => b[1] - a[1]).slice(0, Math.max(opts.candidates, 30)).map(([i, r]) => {
    const d = index.docs[i];
    const cov = coverage(q, new Set([...d.body, ...d.head]));
    const head = coverage(q, d.head);
    if (cov > best) best = cov;
    return { i, rrf: r, bm25: bm.get(i) ?? 0, coverage: cov, head, score: 0.4 * (r / maxRrf) + 0.45 * cov + 0.15 * head };
  }).filter((x) => x.coverage >= min).sort((a, b) => b.score - a.score).slice(0, opts.candidates);
  // MMR: Relevanz gegen Ähnlichkeit zu bereits gewählten Belegen; nahezu gleiche Texte (ältere Fassungen) entfallen
  const chosen: Ranked[] = [];
  const toks = (i: number) => index.docs[i].body;
  const rest = [...pool];
  while (chosen.length < opts.passages && rest.length) {
    let bestIdx = -1;
    let bestVal = -Infinity;
    for (const [k, c] of rest.entries()) {
      const red = chosen.length ? Math.max(...chosen.map((x) => jaccard(toks(x.i), toks(c.i)))) : 0;
      if (red >= DUPLICATE_JACCARD) continue;
      const val = MMR_LAMBDA * c.score - (1 - MMR_LAMBDA) * red;
      if (val > bestVal) (bestVal = val), (bestIdx = k);
    }
    if (bestIdx < 0) break;
    chosen.push(rest.splice(bestIdx, 1)[0]);
  }
  return { ranked: chosen, best };
}

/** Extraktive Antwort v2: Sätze der besten Belege nach Abdeckung der Frage (mit Erweiterungen), in Lesereihenfolge */
// Antworttyp Menge, Dauer, Zeitpunkt: Sätze mit Zahl bevorzugen
const QUANTITY_Q = /\b(?:wie\s+(?:lange?|viele?|oft|hoch|groß|gross|weit)|wann|bis\s+wann|welche[rsn]?\s+(?:laufzeit|frist|dauer|höhe|anzahl)|how\s+(?:long|much|many|often)|when)\b/i;
const NUMBER = /\d|\b(?:eins|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|zwölf|zwanzig|dreißig|hundert|one|two|three|four|five|ten|twelve)\b/i;

export function answerSentences(q: Query, index: Index | null, passages: { label: string; text: string; header?: string }[], maxSentences = 3, question = '') {
  const vocab = index?.vocab ?? null;
  const quantity = QUANTITY_Q.test(question);
  // Satz im Zusammenhang seines Abschnitts: passt die Überschrift zur Frage, tragen auch die ersten Schritte die Antwort
  const cands = passages.slice(0, 4).flatMap((p, rank) => {
    const head = coverage(q, new Set(analyze(p.header ?? '', vocab)));
    return splitSentences(p.text, /^\s*(\d+\.|[-*])\s+/m.test(p.text) ? 'list' : 'paragraph').map((text, i) => ({
      text, source: p.label, score: 0.65 * coverage(q, new Set(analyze(text, vocab))) + 0.35 * head - rank * 0.05 - i * 0.01 + (quantity && NUMBER.test(text) ? 0.15 : 0),
    }));
  });
  const best = cands.filter((c) => c.score > 0.2).sort((a, b) => b.score - a.score).slice(0, maxSentences);
  const order = new Map(cands.map((c, i) => [c, i]));
  return best.sort((a, b) => order.get(a)! - order.get(b)!).map((c) => ({ text: c.text, sources: [c.source] }));
}
