// Volltext-Suchindex (ADR-039): SQLite FTS5 (Tokenizer unicode61, Umlaute/Akzente ignoriert) bzw. PostgreSQL tsvector mit
// deutscher Stammformbildung. Abgeleitete Daten: nicht im Backup, je Projekt und Bereich über einen Fingerabdruck aktuell gehalten –
// vor jeder Suche wird nur neu aufgebaut, was sich seit dem letzten Aufbau geändert hat.
import type { Ctx } from '../context.js';
import type { Db } from '../db.js';
import { sha256 } from '../domain/similarity.js';

export const INDEX_TYPES = ['chapter', 'block', 'snippet', 'source', 'outline', 'abbreviation', 'term', 'faq'] as const;
export type IndexType = (typeof INDEX_TYPES)[number];

/** Bereiche mit gemeinsamem Fingerabdruck (Quellen und ihre Schnipsel ändern sich zusammen) */
const AREAS: Record<string, IndexType[]> = {
  chapter: ['chapter'], block: ['block'], source: ['snippet', 'source'], outline: ['outline'], abbreviation: ['abbreviation'], term: ['term'], faq: ['faq'],
};

const FINGERPRINT: Record<string, string> = {
  chapter: "SELECT COUNT(*) AS n, COALESCE(SUM(LENGTH(title)), 0) AS m FROM chapters WHERE project_id = ? AND key <> '__none__'",
  block: `SELECT COUNT(*) AS n, MAX(b.updated_at) AS m FROM content_blocks b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id
    JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ?`,
  source: `SELECT COUNT(*) AS n, MAX(r.imported_at) AS m, SUM(r.is_current) AS c, COUNT(d.removed_at) AS x, MAX(d.removed_at) AS y
    FROM source_revisions r JOIN source_documents d ON d.id = r.document_id WHERE d.project_id = ?`,
  outline: 'SELECT COUNT(*) AS n, MAX(updated_at) AS m FROM outlines WHERE project_id = ?',
  abbreviation: 'SELECT COUNT(*) AS n, MAX(updated_at) AS m FROM abbreviations WHERE project_id = ?',
  term: 'SELECT COUNT(*) AS n, MAX(updated_at) AS m FROM terminology_terms WHERE project_id = ?',
  faq: 'SELECT COUNT(*) AS n, MAX(updated_at) AS m FROM faq_entries WHERE project_id = ?',
};

/**
 * Kapiteltitel stecken im Index der Kapitel und der Kapiteltexte – daher fließt ein Hash aller Titel in beide Fingerabdrücke
 * ein (eine Umbenennung mit gleicher Länge wäre sonst unsichtbar).
 */
async function fingerprint(ctx: Ctx, area: string) {
  const base = JSON.stringify(await ctx.db.get(FINGERPRINT[area], ctx.projectId));
  if (area !== 'chapter' && area !== 'block') return base;
  const titles = (await ctx.db.all('SELECT id, title FROM chapters WHERE project_id = ? ORDER BY id', ctx.projectId)).map((r) => `${r.id}\u0000${r.title}`).join('\u0001');
  return `${base}|${sha256(titles)}`;
}

interface Doc { type: IndexType; refId: string; title: string; body: string; link: string }

const ensured = new WeakMap<Db, Promise<void>>();
/** PostgreSQL: Erweiterung unaccent verfügbar (Akzente wie à, é beim Indexieren und Suchen entfernen) */
const unaccentOn = new WeakMap<Db, boolean>();

/** Indexstrukturen anlegen (einmal je Datenbankverbindung) */
export function ensureSearchIndex(db: Db) {
  if (!ensured.has(db)) {
    const p = (async () => {
      await db.run('CREATE TABLE IF NOT EXISTS search_index_state (project_id TEXT NOT NULL, area TEXT NOT NULL, fingerprint TEXT NOT NULL, built_at TEXT NOT NULL, PRIMARY KEY (project_id, area))');
      if (db.dialect === 'sqlite') {
        await db.run("CREATE VIRTUAL TABLE IF NOT EXISTS search_fts USING fts5(title, body, project_id UNINDEXED, type UNINDEXED, ref_id UNINDEXED, link UNINDEXED, tokenize = 'unicode61 remove_diacritics 2')");
      } else {
        try {
          if (!(await db.get("SELECT 1 AS ok FROM pg_extension WHERE extname = 'unaccent'"))) await db.run('CREATE EXTENSION IF NOT EXISTS unaccent');
          unaccentOn.set(db, true);
        } catch {
          unaccentOn.set(db, false); // ohne Rechte: Umlaute über die deutsche Stammformbildung, andere Akzente bleiben
        }
        await db.run('CREATE TABLE IF NOT EXISTS search_docs (project_id TEXT NOT NULL, type TEXT NOT NULL, ref_id TEXT NOT NULL, title TEXT NOT NULL, body TEXT NOT NULL, link TEXT NOT NULL, tsv tsvector NOT NULL)');
        await db.run('CREATE INDEX IF NOT EXISTS idx_search_docs_tsv ON search_docs USING GIN (tsv)');
        await db.run('CREATE INDEX IF NOT EXISTS idx_search_docs_project ON search_docs (project_id, type)');
      }
    })();
    p.catch(() => ensured.delete(db));
    ensured.set(db, p);
  }
  return ensured.get(db)!;
}

async function docsFor(ctx: Ctx, type: IndexType): Promise<Doc[]> {
  const { db, projectId } = ctx;
  switch (type) {
    case 'chapter':
      return (await db.all("SELECT id, title FROM chapters WHERE project_id = ? AND key <> '__none__'", projectId))
        .map((r) => ({ type, refId: r.id, title: r.title, body: '', link: `/werkstatt/${r.id}` }));
    case 'block':
      // Texte der jeweils neuesten Kapitelversion
      return (await db.all(
        `SELECT b.id, b.text, c.id AS chapter_id, c.title, v.version_no FROM content_blocks b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id
         JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND b.deleted_at IS NULL
         AND v.version_no = (SELECT MAX(x.version_no) FROM generated_chapter_versions x WHERE x.chapter_id = c.id)`, projectId,
      )).map((r) => ({ type, refId: r.id, title: `${r.title} · Version ${r.version_no}`, body: r.text, link: `/werkstatt/${r.chapter_id}` }));
    case 'snippet':
      return (await db.all(
        `SELECT s.id, s.seq, s.text, d.path FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
         WHERE d.project_id = ? AND r.is_current = 1 AND d.removed_at IS NULL`, projectId,
      )).map((r) => ({ type, refId: r.id, title: `#${r.seq} · ${r.path}`, body: r.text, link: `/quellen?q=${encodeURIComponent(String(r.seq))}` }));
    case 'source':
      return (await db.all('SELECT id, path FROM source_documents WHERE project_id = ? AND removed_at IS NULL', projectId))
        .map((r) => ({ type, refId: r.id, title: r.path, body: '', link: `/quellen?q=${encodeURIComponent(r.path)}` }));
    case 'outline': {
      // neueste Version je Gliederung, Einträge im Text
      const rows = await db.all('SELECT o.id, o.name, o.version_no FROM outlines o WHERE o.project_id = ? AND o.version_no = (SELECT MAX(x.version_no) FROM outlines x WHERE x.family_id = o.family_id)', projectId);
      const out: Doc[] = [];
      for (const r of rows) {
        const nodes = (await db.all('SELECT title FROM outline_nodes WHERE outline_id = ? ORDER BY level, position', r.id)).map((n) => n.title as string);
        out.push({ type, refId: r.id, title: `${r.name} – V${r.version_no}`, body: nodes.join(' · '), link: `/stammdaten/inhaltsverzeichnis/${r.id}` });
      }
      return out;
    }
    case 'abbreviation':
      return (await db.all('SELECT id, abbreviation, expansion, description FROM abbreviations WHERE project_id = ?', projectId))
        .map((r) => ({ type, refId: r.id, title: r.abbreviation, body: [r.expansion, r.description].filter(Boolean).join(' – '), link: '/stammdaten/abkuerzungen' }));
    case 'term':
      return (await db.all("SELECT id, preferred, definition, avoid FROM terminology_terms WHERE project_id = ? AND status = 'active'", projectId))
        .map((r) => ({ type, refId: r.id, title: r.preferred, body: [r.definition, (JSON.parse(r.avoid || '[]') as string[]).join(', ')].filter(Boolean).join(' – '), link: '/stammdaten/glossar' }));
    case 'faq':
      return (await db.all('SELECT id, question, answer FROM faq_entries WHERE project_id = ?', projectId))
        .map((r) => ({ type, refId: r.id, title: r.question, body: r.answer, link: '/stammdaten/faq' }));
  }
}

async function insertDocs(ctx: Ctx, docs: Doc[]) {
  const { db, projectId } = ctx;
  const norm = unaccentOn.get(db) ? "unaccent(regexp_replace(?, '[^[:alnum:]]+', ' ', 'g'))" : "regexp_replace(?, '[^[:alnum:]]+', ' ', 'g')";
  if (db.dialect === 'sqlite') {
    for (const d of docs) await db.run('INSERT INTO search_fts (title, body, project_id, type, ref_id, link) VALUES (?, ?, ?, ?, ?, ?)', d.title, d.body, projectId, d.type, d.refId, d.link);
    return;
  }
  // PostgreSQL: blockweise; Satzzeichen trennen Wörter wie bei der Suchanfrage (sonst wäre „a.md“ ein einziges Token)
  for (let i = 0; i < docs.length; i += 250) {
    const part = docs.slice(i, i + 250);
    await db.run(
      `INSERT INTO search_docs (project_id, type, ref_id, title, body, link, tsv) VALUES ${part.map(() => `(?, ?, ?, ?, ?, ?, setweight(to_tsvector('german', ${norm}), 'A') || setweight(to_tsvector('german', ${norm}), 'B'))`).join(', ')}`,
      ...part.flatMap((d) => [projectId, d.type, d.refId, d.title, d.body, d.link, d.title, d.body]),
    );
  }
}

const inflight = new Map<string, Promise<{ rebuilt: string[] }>>();

/** Geänderte Bereiche des Projekts neu indexieren; liefert die neu aufgebauten Bereiche */
export function refreshSearchIndex(ctx: Ctx, force = false): Promise<{ rebuilt: string[] }> {
  const key = `${ctx.projectId}|${force}`;
  if (!inflight.has(key)) {
    const p = (async () => {
      await ensureSearchIndex(ctx.db);
      const state = new Map((await ctx.db.all('SELECT area, fingerprint FROM search_index_state WHERE project_id = ?', ctx.projectId)).map((r) => [r.area as string, r.fingerprint as string]));
      const rebuilt: string[] = [];
      for (const [area, types] of Object.entries(AREAS)) {
        const fp = await fingerprint(ctx, area);
        if (!force && state.get(area) === fp) continue;
        const docs = (await Promise.all(types.map((t) => docsFor(ctx, t)))).flat();
        await ctx.db.tx(async () => {
          for (const t of types) {
            await ctx.db.run(ctx.db.dialect === 'sqlite' ? 'DELETE FROM search_fts WHERE project_id = ? AND type = ?' : 'DELETE FROM search_docs WHERE project_id = ? AND type = ?', ctx.projectId, t);
          }
          await insertDocs(ctx, docs);
          await ctx.db.run('DELETE FROM search_index_state WHERE project_id = ? AND area = ?', ctx.projectId, area);
          await ctx.db.run('INSERT INTO search_index_state (project_id, area, fingerprint, built_at) VALUES (?, ?, ?, ?)', ctx.projectId, area, fp, new Date().toISOString());
        });
        rebuilt.push(area);
      }
      return { rebuilt };
    })().finally(() => inflight.delete(key));
    inflight.set(key, p);
  }
  return inflight.get(key)!;
}

/** Suchbegriffe: Wörter aus Buchstaben/Ziffern (Sonderzeichen trennen), höchstens 12 */
export function searchTerms(q: string) {
  return [...q.normalize('NFC').matchAll(/[\p{L}\p{N}]+/gu)].map((m) => m[0]).slice(0, 12);
}

// Gewichtung je Bereich (Etappe 16): Kapitel und Kapiteltexte vor Quellen, deren Titel nur der Dateipfad ist
export const TYPE_WEIGHT: Record<IndexType, number> = { chapter: 2, block: 1.5, faq: 1.2, term: 1.1, abbreviation: 1.1, outline: 1, snippet: 1, source: 0.5 };
const weightSql = `CASE type ${Object.entries(TYPE_WEIGHT).map(([t, w]) => `WHEN '${t}' THEN ${w}`).join(' ')} ELSE 1 END`;

const HIT_START = '\u0002';
const HIT_END = '\u0003';

export interface IndexHit { type: IndexType; refId: string; title: string; link: string; excerpt: string | null; score: number }

/** Treffer nach Relevanz (Titel stärker gewichtet), Präfixsuche je Wort, alle Wörter müssen vorkommen */
export async function queryIndex(ctx: Ctx, terms: string[], types: IndexType[], limit: number, offset: number) {
  const { db, projectId } = ctx;
  const typeSql = types.length ? ` AND type IN (${types.map(() => '?').join(',')})` : '';
  if (db.dialect === 'sqlite') {
    const match = terms.map((t) => `"${t.replace(/"/g, '')}"*`).join(' ');
    const where = `search_fts MATCH ? AND project_id = ?`;
    const facets = await db.all(`SELECT type, COUNT(*) AS n FROM search_fts WHERE ${where} GROUP BY type`, match, projectId);
    const rows = await db.all(
      `SELECT type, ref_id, title, link, snippet(search_fts, 1, '${HIT_START}', '${HIT_END}', ' … ', 24) AS excerpt, bm25(search_fts, 6.0, 1.0) * ${weightSql} AS score
       FROM search_fts WHERE ${where}${typeSql} ORDER BY score LIMIT ${limit} OFFSET ${offset}`, match, projectId, ...types,
    );
    return { facets, rows: rows.map((r) => ({ type: r.type, refId: r.ref_id, title: r.title, link: r.link, excerpt: r.excerpt || null, score: -Number(r.score) })) as IndexHit[] };
  }
  // mit unaccent: Suchbegriffe ebenso ohne Akzente/Umlautpunkte (Stammformbildung wie beim Indexieren)
  const plain = (t: string) => (unaccentOn.get(db) ? t.normalize('NFD').replace(/\p{M}/gu, '').replace(/ß/g, 'ss') : t);
  const tsq = terms.map((t) => `${plain(t)}:*`).join(' & ');
  const facets = await db.all("SELECT type, COUNT(*) AS n FROM search_docs WHERE project_id = ? AND tsv @@ to_tsquery('german', ?) GROUP BY type", projectId, tsq);
  const rows = await db.all(
    `SELECT type, ref_id, title, link, ts_rank(tsv, to_tsquery('german', ?)) * ${weightSql} AS score,
       CASE WHEN body = '' THEN NULL ELSE ts_headline('german', body, to_tsquery('german', ?), 'StartSel=${HIT_START}, StopSel=${HIT_END}, MaxWords=28, MinWords=12, ShortWord=2, MaxFragments=1, FragmentDelimiter=" … "') END AS excerpt
     FROM search_docs WHERE project_id = ? AND tsv @@ to_tsquery('german', ?)${typeSql} ORDER BY score DESC, title LIMIT ${limit} OFFSET ${offset}`,
    tsq, tsq, projectId, tsq, ...types,
  );
  return { facets, rows: rows.map((r) => ({ type: r.type, refId: r.ref_id, title: r.title, link: r.link, excerpt: r.excerpt ?? null, score: Number(r.score) })) as IndexHit[] };
}

/** Ausschnitt mit Markierungen → Teile für die Hervorhebung */
export function excerptParts(excerpt: string | null) {
  if (!excerpt) return null;
  const clean = excerpt.replace(/!\[([^\]]*)\]\(media:[0-9a-f]+\)/g, '[Bild: $1]').replace(/\s+/g, ' ');
  const parts: { text: string; hit: boolean }[] = [];
  for (const piece of clean.split(HIT_START)) {
    const [hit, rest] = piece.includes(HIT_END) ? piece.split(HIT_END) : [null, piece];
    if (hit) parts.push({ text: hit, hit: true });
    if (rest) parts.push({ text: rest, hit: false });
  }
  return parts;
}
