// Suchen und Glossar in der Leseransicht (ADR-066): Leser finden Anleitungen über Wörter aus dem Text und sehen
// Fachbegriffe und Abkürzungen direkt erklärt – aus Terminologie und Abkürzungsverzeichnis, ohne eigene Pflege.
import type { Ctx } from '../context.js';
import type { Row } from '../db.js';
import { badRequest } from '../problem.js';

const HIDDEN_SECTIONS = new Set(['status']);
const lower = (s: string) => s.toLocaleLowerCase('de');
/** Markdown-Zeichen für Treffer und Ausschnitt entfernen (Fett, Code, Bilder, Links) */
const plain = (s: string) => s.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*|`|^\s*(?:\d+[.)]|[-*•])\s+/gm, '').replace(/\s+/g, ' ').trim();

/** Kapitel, deren Titel oder Text alle Suchwörter enthält – freigegebene Fassung, mit `drafts` die neueste */
export async function readerSearch(ctx: Ctx, q: unknown, drafts: boolean) {
  const query = typeof q === 'string' ? q.trim().slice(0, 100) : '';
  const words = [...new Set(lower(query).split(/\s+/).filter((w) => w.length >= 2))];
  if (!words.length) throw badRequest('q: mindestens ein Suchwort mit zwei Zeichen.');
  // zwei Abfragen statt zwei je Kapitel: gezeigte Fassung je Kapitel, dann alle Blöcke dieser Fassungen
  const versions = await ctx.db.all(
    `SELECT v.chapter_id, v.id, v.title, v.status FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id
     WHERE c.project_id = ? AND c.outline_family_id IS NULL ${drafts ? '' : "AND v.status = 'approved'"} ORDER BY c.position, c.title, v.version_no DESC`, ctx.projectId,
  );
  const shown = new Map<string, Row>();
  for (const v of versions) if (!shown.has(v.chapter_id as string)) shown.set(v.chapter_id as string, v);
  const blocksOf = new Map<string, string[]>();
  const ids = [...shown.values()].map((v) => v.id as string);
  for (let i = 0; i < ids.length; i += 500) {
    const part = ids.slice(i, i + 500);
    const rows = await ctx.db.all(
      `SELECT chapter_version_id, section_code, text FROM content_blocks WHERE chapter_version_id IN (${part.map(() => '?').join(', ')}) AND deleted_at IS NULL AND kind <> 'gap'
       ORDER BY chapter_version_id, section_code, position`, ...part,
    );
    for (const b of rows) {
      if (HIDDEN_SECTIONS.has(b.section_code as string)) continue;
      const list = blocksOf.get(b.chapter_version_id as string) ?? [];
      list.push(plain(String(b.text)));
      blocksOf.set(b.chapter_version_id as string, list);
    }
  }
  const results: { chapterId: string; title: string; versionId: string; draft: boolean; hits: number; snippet: string }[] = [];
  for (const [chapterId, v] of shown) {
    const blocks = blocksOf.get(v.id as string) ?? [];
    const title = String(v.title);
    const all = lower([title, ...blocks].join(' \n '));
    if (!words.every((w) => all.includes(w))) continue;
    const hits = words.reduce((n, w) => n + all.split(w).length - 1, 0);
    // Ausschnitt um den ersten Treffer im Text (nicht im Titel)
    const block = blocks.find((b) => words.some((w) => lower(b).includes(w))) ?? blocks[0] ?? '';
    const at = Math.max(0, Math.min(...words.map((w) => lower(block).indexOf(w)).filter((i) => i >= 0), block.length) - 60);
    const snippet = `${at > 0 ? '… ' : ''}${block.slice(at, at + 180).trim()}${at + 180 < block.length ? ' …' : ''}`;
    results.push({ chapterId, title, versionId: v.id as string, draft: v.status !== 'approved', hits: hits + (words.some((w) => lower(title).includes(w)) ? 100 : 0), snippet });
  }
  results.sort((a, b) => b.hits - a.hits);
  return { q: query, words, total: results.length, results: results.slice(0, 30).map((r) => ({ ...r, hits: r.hits >= 100 ? r.hits - 100 : r.hits })) };
}

/** Begriffe mit Erklärung: Terminologie (bevorzugter Begriff mit Definition) und Abkürzungen – längste zuerst */
export async function readerGlossary(ctx: Ctx) {
  const terms = await ctx.db.all("SELECT preferred, definition FROM terminology_terms WHERE project_id = ? AND status = 'active' AND definition IS NOT NULL AND TRIM(definition) <> ''", ctx.projectId);
  const abbr = await ctx.db.all('SELECT abbreviation, expansion, description FROM abbreviations WHERE project_id = ?', ctx.projectId);
  const seen = new Set<string>();
  const entries = [
    ...terms.map((t) => ({ term: String(t.preferred).trim(), text: String(t.definition).trim(), kind: 'term' as const })),
    ...abbr.map((a) => ({ term: String(a.abbreviation).trim(), text: `${String(a.expansion).trim()}${a.description ? ` – ${String(a.description).trim()}` : ''}`, kind: 'abbreviation' as const })),
  ].filter((e) => e.term.length >= 2 && !seen.has(lower(e.term)) && seen.add(lower(e.term)));
  return entries.sort((a, b) => b.term.length - a.term.length || a.term.localeCompare(b.term, 'de'));
}
