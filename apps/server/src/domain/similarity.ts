// Ähnlichkeits-Engine (US-005, US-006, ADR-006).
// ANNAHME(E-05): TF-IDF-Kosinus über normalisierte Tokens; austauschbar über SimilarityEngine.
import { createHash } from 'node:crypto';

export const SIMILARITY_METHOD = 'tfidf-cosine';
export const SIMILARITY_VERSION = '1.0';

const STOPWORDS = new Set(
  (
    'der die das den dem des ein eine einer eines einem einen und oder aber auch als am an auf aus bei bis durch für fuer ' +
    'gegen im in ins ist sind war wird werden wurde wurden hat haben mit nach ohne seit so um unter über ueber von vor zu zum zur ' +
    'sich es er sie wir ihr man dies diese dieser dieses jede jeder jedes alle allen im wie wo was wenn dann da dass daß noch nur ' +
    'bzw ggf z b zb etc sowie beim kann können koennen soll sollen muss müssen muessen darf dürfen duerfen nicht kein keine keinen ' +
    'the a an and or of to in is are be for on with by'
  ).split(/\s+/),
);

export function normalizeText(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[`*_>#|~\[\]()!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sha256(data: string | Buffer): string {
  return createHash('sha256').update(data).digest('hex');
}

/** Hash über normalisierten Text – Dopplungsstufe 1 (identischer Inhalt trotz Formatierung). */
export function normalizedHash(text: string): string {
  return sha256(normalizeText(text).replace(/[.,;:!?"'„“‚‘-]/g, '').replace(/\s+/g, ' '));
}

const SUFFIXES = ['ungen', 'ung', 'en', 'er', 'es', 'em', 'e', 'n', 's'];

/** Leichtes deutsches Suffix-Stemming (bis zu zwei Suffixe, z. B. Benutzers → benutz). */
export function stem(token: string): string {
  let t = token.replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
  for (let pass = 0; pass < 2; pass++) {
    const suffix = SUFFIXES.find((sx) => t.length > sx.length + 3 && t.endsWith(sx));
    if (!suffix) break;
    t = t.slice(0, -suffix.length);
  }
  return t;
}

export function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t) && !/^\d+$/.test(t))
    .map(stem);
}

/** Merkmale: Wortstämme plus 5-Zeichen-Präfixe (fängt Ablaut/Komposita ab, z. B. Freigabe/freigeben). */
export function features(text: string): string[] {
  const stems = tokenize(text);
  return [...stems, ...stems.filter((t) => t.length > 5).map((t) => `~${t.slice(0, 5)}`)];
}

export interface Doc {
  id: string;
  text: string;
}

export interface SimilarityPair {
  a: string;
  b: string;
  score: number;
  sharedTerms: string[];
}

export interface SimilarityEngine {
  method: string;
  version: string;
  /** Liefert alle Paare mit Score >= minScore (a < b). */
  pairs(docs: Doc[], minScore: number): SimilarityPair[];
}

type Vec = Map<string, number>;

export class TfidfEngine implements SimilarityEngine {
  method = SIMILARITY_METHOD;
  version = SIMILARITY_VERSION;

  pairs(docs: Doc[], minScore: number): SimilarityPair[] {
    const tokens = docs.map((d) => features(d.text));
    const df = new Map<string, number>();
    for (const ts of tokens) for (const t of new Set(ts)) df.set(t, (df.get(t) ?? 0) + 1);
    const n = docs.length;
    const vecs: Vec[] = tokens.map((ts) => {
      const tf = new Map<string, number>();
      for (const t of ts) tf.set(t, (tf.get(t) ?? 0) + 1);
      const v: Vec = new Map();
      let norm = 0;
      for (const [t, c] of tf) {
        const w = (1 + Math.log(c)) * (Math.log((n + 1) / ((df.get(t) ?? 0) + 1)) + 1);
        v.set(t, w);
        norm += w * w;
      }
      norm = Math.sqrt(norm) || 1;
      for (const [t, w] of v) v.set(t, w / norm);
      return v;
    });

    // Invertierter Index: nur Dokumente mit gemeinsamen Termen werden verglichen.
    const index = new Map<string, number[]>();
    vecs.forEach((v, i) => {
      for (const t of v.keys()) {
        const list = index.get(t);
        if (list) list.push(i);
        else index.set(t, [i]);
      }
    });
    const maxPostings = Math.max(50, Math.ceil(n * 0.3)); // sehr häufige Terme ignorieren (Performance)

    const out: SimilarityPair[] = [];
    for (let i = 0; i < n; i++) {
      const dots = new Map<number, number>();
      for (const [t, w] of vecs[i]) {
        const postings = index.get(t)!;
        if (postings.length > maxPostings) continue;
        for (const j of postings) if (j > i) dots.set(j, (dots.get(j) ?? 0) + w * (vecs[j].get(t) ?? 0));
      }
      for (const [j, dot] of dots) {
        const score = Math.min(1, Math.round(dot * 1000) / 1000);
        if (score >= minScore) {
          const shared = [...vecs[i].keys()].filter((t) => vecs[j].has(t) && !t.startsWith('~'));
          shared.sort((x, y) => (vecs[i].get(y)! + vecs[j].get(y)!) - (vecs[i].get(x)! + vecs[j].get(x)!));
          out.push({ a: docs[i].id, b: docs[j].id, score, sharedTerms: shared.slice(0, 6) });
        }
      }
    }
    return out;
  }
}

/** Single-Linkage-Clustering über Paare (Union-Find). */
export function clusterPairs(ids: string[], pairs: SimilarityPair[]): string[][] {
  const parent = new Map(ids.map((id) => [id, id]));
  const find = (x: string): string => {
    let p = parent.get(x)!;
    while (p !== parent.get(p)) p = parent.get(p)!;
    parent.set(x, p);
    return p;
  };
  for (const { a, b } of pairs) {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  }
  const groups = new Map<string, string[]>();
  for (const id of ids) {
    const r = find(id);
    const g = groups.get(r);
    if (g) g.push(id);
    else groups.set(r, [id]);
  }
  return [...groups.values()].filter((g) => g.length > 1);
}
