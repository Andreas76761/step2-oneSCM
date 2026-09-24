// Globale Suche (ADR-035): ein Suchfeld für Kapitel, Kapiteltexte, Textschnipsel, Quellen, Gliederungen und Stammdaten.
// Einfache Teilwortsuche (Groß-/Kleinschreibung egal) – ergänzt die semantische Suche (ADR-020) um direkte Treffer mit Sprungziel.
import type { Ctx } from '../context.js';
import { badRequest } from '../problem.js';

export interface SearchHit {
  type: 'chapter' | 'block' | 'snippet' | 'source' | 'outline' | 'abbreviation' | 'term' | 'faq';
  id: string;
  title: string;
  excerpt: string | null;
  /** Ziel in der Oberfläche */
  link: string;
}

const GROUPS: Record<SearchHit['type'], string> = {
  chapter: 'Kapitel', block: 'Kapiteltexte', snippet: 'Textschnipsel', source: 'Quellen', outline: 'Gliederungen', abbreviation: 'Abkürzungen', term: 'Glossar', faq: 'FAQ',
};

/** Ausschnitt um den ersten Treffer, Markdown-Bildverweise gekürzt */
export function excerpt(text: string, q: string, width = 160) {
  const t = text.replace(/!\[([^\]]*)\]\(media:[0-9a-f]+\)/g, '[Bild: $1]').replace(/\s+/g, ' ').trim();
  const i = t.toLowerCase().indexOf(q.toLowerCase());
  const start = Math.max(0, i < 0 ? 0 : i - Math.floor((width - q.length) / 2));
  return `${start > 0 ? '…' : ''}${t.slice(start, start + width)}${start + width < t.length ? '…' : ''}`;
}

export async function globalSearch(ctx: Ctx, query: string, limit = 8) {
  const q = query.trim();
  if (q.length < 2) throw badRequest('Suchbegriff mit mindestens 2 Zeichen angeben.');
  if (q.length > 200) throw badRequest('Suchbegriff zu lang (max. 200 Zeichen).');
  const like = `%${q.toLowerCase().replace(/[\\%_]/g, (c) => `\\${c}`)}%`;
  const L = (col: string) => `LOWER(${col}) LIKE ? ESCAPE '\\'`;
  const n = Math.min(Math.max(limit, 1), 25);
  const { db, projectId } = ctx;
  const hits: SearchHit[] = [];

  for (const r of await db.all(`SELECT id, title FROM chapters WHERE project_id = ? AND ${L('title')} ORDER BY outline_family_id, position LIMIT ${n}`, projectId, like)) {
    hits.push({ type: 'chapter', id: r.id, title: r.title, excerpt: null, link: `/werkstatt/${r.id}` });
  }
  // Texte der jeweils neuesten Kapitelversion
  for (const r of await db.all(
    `SELECT b.id, b.text, c.id AS chapter_id, c.title, v.version_no FROM content_blocks b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id
     WHERE c.project_id = ? AND b.deleted_at IS NULL AND v.version_no = (SELECT MAX(x.version_no) FROM generated_chapter_versions x WHERE x.chapter_id = c.id) AND ${L('b.text')}
     ORDER BY c.position, b.position LIMIT ${n}`, projectId, like,
  )) hits.push({ type: 'block', id: r.id, title: `${r.title} · Version ${r.version_no}`, excerpt: excerpt(r.text, q), link: `/werkstatt/${r.chapter_id}` });
  for (const r of await db.all(
    `SELECT s.id, s.seq, s.text, d.path FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     WHERE d.project_id = ? AND r.is_current = 1 AND d.removed_at IS NULL AND ${L('s.text')} ORDER BY d.path, s.seq LIMIT ${n}`, projectId, like,
  )) hits.push({ type: 'snippet', id: r.id, title: `#${r.seq} · ${r.path}`, excerpt: excerpt(r.text, q), link: `/quellen?q=${encodeURIComponent(String(r.seq))}` });
  for (const r of await db.all(`SELECT id, path FROM source_documents WHERE project_id = ? AND ${L('path')} ORDER BY path LIMIT ${n}`, projectId, like)) {
    hits.push({ type: 'source', id: r.id, title: r.path, excerpt: null, link: `/quellen?q=${encodeURIComponent(r.path)}` });
  }
  // Gliederungen: Name oder Eintrag (neueste Version je Gliederung)
  for (const r of await db.all(
    `SELECT o.id, o.name, o.version_no, (SELECT n.title FROM outline_nodes n WHERE n.outline_id = o.id AND ${L('n.title')} ORDER BY n.level, n.position LIMIT 1) AS node
     FROM outlines o WHERE o.project_id = ? AND o.version_no = (SELECT MAX(x.version_no) FROM outlines x WHERE x.family_id = o.family_id)
     AND (${L('o.name')} OR EXISTS (SELECT 1 FROM outline_nodes n WHERE n.outline_id = o.id AND ${L('n.title')})) ORDER BY o.name LIMIT ${n}`, like, projectId, like, like,
  )) hits.push({ type: 'outline', id: r.id, title: `${r.name} – V${r.version_no}`, excerpt: r.node ? `Eintrag: ${r.node}` : null, link: `/stammdaten/inhaltsverzeichnis/${r.id}` });
  for (const r of await db.all(`SELECT id, abbreviation, expansion FROM abbreviations WHERE project_id = ? AND (${L('abbreviation')} OR ${L('expansion')}) ORDER BY abbreviation LIMIT ${n}`, projectId, like, like)) {
    hits.push({ type: 'abbreviation', id: r.id, title: r.abbreviation, excerpt: r.expansion, link: '/stammdaten/abkuerzungen' });
  }
  for (const r of await db.all(`SELECT id, preferred, definition FROM terminology_terms WHERE project_id = ? AND status = 'active' AND (${L('preferred')} OR ${L("COALESCE(definition, '')")}) ORDER BY preferred LIMIT ${n}`, projectId, like, like)) {
    hits.push({ type: 'term', id: r.id, title: r.preferred, excerpt: r.definition ? excerpt(r.definition, q) : null, link: '/stammdaten/glossar' });
  }
  for (const r of await db.all(`SELECT id, question, answer FROM faq_entries WHERE project_id = ? AND (${L('question')} OR ${L('answer')}) ORDER BY position, created_at LIMIT ${n}`, projectId, like, like)) {
    hits.push({ type: 'faq', id: r.id, title: r.question, excerpt: excerpt(r.answer, q), link: '/stammdaten/faq' });
  }
  const groups = (Object.keys(GROUPS) as SearchHit['type'][])
    .map((type) => ({ type, label: GROUPS[type], hits: hits.filter((h) => h.type === type) }))
    .filter((g) => g.hits.length);
  return { query: q, total: hits.length, groups };
}
