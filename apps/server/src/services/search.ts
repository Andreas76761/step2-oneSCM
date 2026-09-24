// Globale Suche (ADR-035, Volltext seit ADR-039): Kapitel, Kapiteltexte, Textschnipsel, Quellen, Gliederungen und Stammdaten
// aus dem Suchindex – nach Relevanz sortiert, Präfixsuche je Wort, Umlaute/Akzente egal (SQLite) bzw. deutsche Stammformen (PostgreSQL).
import type { Ctx } from '../context.js';
import { badRequest } from '../problem.js';
import { excerptParts, INDEX_TYPES, queryIndex, refreshSearchIndex, searchTerms, type IndexType } from './searchIndex.js';

export type SearchType = IndexType;

const GROUPS: Record<SearchType, string> = {
  chapter: 'Kapitel', block: 'Kapiteltexte', snippet: 'Textschnipsel', source: 'Quellen', outline: 'Gliederungen', abbreviation: 'Abkürzungen', term: 'Glossar', faq: 'FAQ',
};

export async function globalSearch(ctx: Ctx, query: string, opts: { limit?: number; types?: string[]; page?: number } = {}) {
  const q = query.trim();
  if (q.length < 2) throw badRequest('Suchbegriff mit mindestens 2 Zeichen angeben.');
  if (q.length > 200) throw badRequest('Suchbegriff zu lang (max. 200 Zeichen).');
  const types = (opts.types ?? []).filter(Boolean);
  const bad = types.filter((t) => !(INDEX_TYPES as readonly string[]).includes(t));
  if (bad.length) throw badRequest(`Unbekannte Bereiche: ${bad.join(', ')}.`);
  const pageSize = Math.min(Math.max(opts.limit ?? 20, 1), 50);
  const page = Math.max(opts.page ?? 1, 1);
  const terms = searchTerms(q);
  const empty = { query: q, total: 0, page, pageSize, facets: [] as { type: SearchType; label: string; count: number }[], hits: [], groups: [] };
  if (!terms.length) return empty;
  await refreshSearchIndex(ctx);
  const { facets, rows } = await queryIndex(ctx, terms, types as SearchType[], pageSize, (page - 1) * pageSize);
  const facetList = INDEX_TYPES.map((type) => ({ type, label: GROUPS[type], count: Number(facets.find((f) => f.type === type)?.n ?? 0) })).filter((f) => f.count);
  const hits = rows.map((r) => {
    const parts = excerptParts(r.excerpt);
    return { type: r.type, label: GROUPS[r.type], id: r.refId, title: r.title, link: r.link, score: r.score, excerpt: parts ? parts.map((p) => p.text).join('') : null, excerptParts: parts };
  });
  const total = (types.length ? facetList.filter((f) => types.includes(f.type)) : facetList).reduce((a, f) => a + f.count, 0);
  return {
    query: q, total, page, pageSize, facets: facetList, hits,
    // Treffer der Seite nach Bereich (Reihenfolge der Bereiche fest, innerhalb nach Relevanz)
    groups: INDEX_TYPES.map((type) => ({ type, label: GROUPS[type], hits: hits.filter((h) => h.type === type) })).filter((g) => g.hits.length),
  };
}
