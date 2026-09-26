// Suchen und Glossar in der Leseransicht (ADR-066): Leser finden Anleitungen über Wörter aus dem Text und sehen
// Fachbegriffe und Abkürzungen direkt erklärt – aus Terminologie und Abkürzungsverzeichnis, ohne eigene Pflege.
import type { Ctx } from '../context.js';
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
  const chapters = await ctx.db.all('SELECT id FROM chapters WHERE project_id = ? AND outline_family_id IS NULL ORDER BY position, title', ctx.projectId);
  const results: { chapterId: string; title: string; versionId: string; draft: boolean; hits: number; snippet: string }[] = [];
  for (const c of chapters) {
    const v = await ctx.db.get(
      `SELECT id, title, status FROM generated_chapter_versions WHERE chapter_id = ? ${drafts ? '' : "AND status = 'approved'"} ORDER BY version_no DESC LIMIT 1`, c.id,
    );
    if (!v) continue;
    const blocks = (await ctx.db.all("SELECT section_code, text FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL AND kind <> 'gap' ORDER BY section_code, position", v.id))
      .filter((b) => !HIDDEN_SECTIONS.has(b.section_code as string)).map((b) => plain(String(b.text)));
    const title = String(v.title);
    const all = lower([title, ...blocks].join(' \n '));
    if (!words.every((w) => all.includes(w))) continue;
    const hits = words.reduce((n, w) => n + all.split(w).length - 1, 0);
    // Ausschnitt um den ersten Treffer im Text (nicht im Titel)
    const block = blocks.find((b) => words.some((w) => lower(b).includes(w))) ?? blocks[0] ?? '';
    const at = Math.max(0, Math.min(...words.map((w) => lower(block).indexOf(w)).filter((i) => i >= 0), block.length) - 60);
    const snippet = `${at > 0 ? '… ' : ''}${block.slice(at, at + 180).trim()}${at + 180 < block.length ? ' …' : ''}`;
    results.push({ chapterId: c.id as string, title, versionId: v.id as string, draft: v.status !== 'approved', hits: hits + (words.some((w) => lower(title).includes(w)) ? 100 : 0), snippet });
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
