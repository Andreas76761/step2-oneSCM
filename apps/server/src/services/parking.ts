// Kapitel „Intern“ und „In Planung“ (Etappe 100): Textabschnitte vormerken – sie fehlen ab der nächsten Version im Handbuch,
// in Entwürfen sofort; freigegebene Kapitel bleiben unveränderlich (revisionssicher). Die Vormerkung gilt je Datei und Text.
import { audit, type Ctx, type User } from '../context.js';
import { newId, now, type Row } from '../db.js';
import { RESERVED_CHAPTER_KEYS, RESERVED_CHAPTERS, type ParkTarget } from '../domain/reference.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { deleteBlock, snapshot } from './chapters.js';

const TARGETS = Object.keys(RESERVED_CHAPTERS) as ParkTarget[];
const targetOf = (v: unknown): ParkTarget => {
  if (!(TARGETS as string[]).includes(String(v))) throw badRequest(`target muss eines von ${TARGETS.join(', ')} sein.`);
  return v as ParkTarget;
};

/** Kapitel „Intern“ bzw. „In Planung“ des Projekts (beim ersten Bedarf angelegt) */
export async function reservedChapter(ctx: Ctx, target: ParkTarget): Promise<Row> {
  const def = RESERVED_CHAPTERS[target];
  const existing = await ctx.db.get('SELECT * FROM chapters WHERE project_id = ? AND key = ?', ctx.projectId, def.key);
  if (existing) return existing;
  const id = newId('ch');
  await ctx.db.run('INSERT INTO chapters (id, project_id, key, title, position) VALUES (?, ?, ?, ?, ?) ON CONFLICT DO NOTHING', id, ctx.projectId, def.key, def.title, def.position);
  return (await ctx.db.get('SELECT * FROM chapters WHERE project_id = ? AND key = ?', ctx.projectId, def.key))!;
}

/** beide Kapitel anlegen (Inhaltsverzeichnis zeigt sie auch ohne vorgemerkte Abschnitte) */
export async function ensureReservedChapters(ctx: Ctx) {
  for (const t of TARGETS) await reservedChapter(ctx, t);
}

export const isReserved = (chapter: Row | undefined | null) => !!chapter && RESERVED_CHAPTER_KEYS.includes(chapter.key);

async function snippetRow(ctx: Ctx, id: string) {
  const s = await ctx.db.get(
    `SELECT s.*, r.document_id, r.is_current, c.key AS chapter_key FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id
     JOIN source_documents d ON d.id = r.document_id JOIN chapters c ON c.id = s.chapter_id WHERE s.id = ? AND d.project_id = ?`, id, ctx.projectId,
  );
  if (!s) throw notFound(`Textabschnitt ${id}`);
  return s;
}

/** Entwürfe des Herkunftskapitels: Absätze nur aus diesem Abschnitt entfallen sofort, sonst nur die Quellenangabe */
async function removeFromDrafts(ctx: Ctx, snippetId: string, chapterId: string, reason: string, actor: string) {
  const blocks = await ctx.db.all(
    `SELECT b.id, b.mode, b.version_no, (SELECT COUNT(*) FROM content_block_sources x WHERE x.block_id = b.id) AS sources
     FROM content_blocks b JOIN content_block_sources s ON s.block_id = b.id JOIN generated_chapter_versions v ON v.id = b.chapter_version_id
     WHERE s.snippet_id = ? AND v.chapter_id = ? AND v.status = 'draft' AND b.deleted_at IS NULL`, snippetId, chapterId,
  );
  let removed = 0;
  for (const b of blocks) {
    if (Number(b.sources) <= 1 && b.mode !== 'locked') {
      await deleteBlock(ctx, b.id, reason, actor);
      removed++;
    } else {
      await ctx.db.run('DELETE FROM content_block_sources WHERE block_id = ? AND snippet_id = ?', b.id, snippetId);
      await ctx.db.run('UPDATE content_blocks SET version_no = ?, updated_at = ? WHERE id = ?', b.version_no + 1, now(), b.id);
      await snapshot(ctx, b.id, b.version_no + 1, 'edited', actor, reason);
    }
  }
  return removed;
}

export async function parkSnippet(ctx: Ctx, id: string, input: { target?: string; note?: string | null }, user: User) {
  const target = targetOf(input.target);
  const s = await snippetRow(ctx, id);
  if (!s.is_current) throw conflict('Nur Textabschnitte der aktuellen Revision lassen sich vormerken.');
  const dest = await reservedChapter(ctx, target);
  const note = String(input.note ?? '').trim().slice(0, 500) || null;
  let removedBlocks = 0;
  await ctx.db.tx(async () => {
    // Herkunft nur beim ersten Vormerken merken (Wechsel Intern ↔ In Planung behält sie)
    const fromChapter = RESERVED_CHAPTER_KEYS.includes(s.chapter_key) ? s.parked_from_chapter_id : s.chapter_id;
    const fromSub = RESERVED_CHAPTER_KEYS.includes(s.chapter_key) ? s.parked_from_subchapter_id : s.subchapter_id;
    await ctx.db.run('UPDATE text_snippets SET chapter_id = ?, subchapter_id = NULL, parked_from_chapter_id = ?, parked_from_subchapter_id = ? WHERE id = ?', dest.id, fromChapter, fromSub, id);
    await ctx.db.run(
      `INSERT INTO snippet_parking (project_id, document_id, norm_hash, target, note, parked_by, parked_at) VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT (project_id, document_id, norm_hash) DO UPDATE SET target = excluded.target, note = excluded.note, parked_by = excluded.parked_by, parked_at = excluded.parked_at`,
      ctx.projectId, s.document_id, s.norm_hash, target, note, user.id, now(),
    );
    if (fromChapter) removedBlocks = await removeFromDrafts(ctx, id, fromChapter, `vorgemerkt für „${RESERVED_CHAPTERS[target].title}“`, user.id);
    await audit(ctx, user.id, 'snippet.parked', 'snippet', id, { target, note, fromChapter, removedBlocks });
  });
  return { snippetId: id, target, chapterId: dest.id, removedBlocks };
}

/** zurück ins Handbuch: wieder im Herkunftskapitel, ab dem nächsten Entwurf wieder im Text */
export async function unparkSnippet(ctx: Ctx, id: string, user: User) {
  const s = await snippetRow(ctx, id);
  if (!RESERVED_CHAPTER_KEYS.includes(s.chapter_key)) throw conflict('Der Textabschnitt ist nicht vorgemerkt.');
  const back = s.parked_from_chapter_id && (await ctx.db.get('SELECT id FROM chapters WHERE id = ? AND project_id = ?', s.parked_from_chapter_id, ctx.projectId))
    ? s.parked_from_chapter_id
    : (await ctx.db.get("SELECT id FROM chapters WHERE project_id = ? AND key = '__none__'", ctx.projectId))?.id;
  if (!back) throw conflict('Das Herkunftskapitel gibt es nicht mehr.');
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE text_snippets SET chapter_id = ?, subchapter_id = ?, parked_from_chapter_id = NULL, parked_from_subchapter_id = NULL WHERE id = ?', back, s.parked_from_subchapter_id ?? null, id);
    await ctx.db.run('DELETE FROM snippet_parking WHERE project_id = ? AND document_id = ? AND norm_hash = ?', ctx.projectId, s.document_id, s.norm_hash);
    await audit(ctx, user.id, 'snippet.unparked', 'snippet', id, { chapterId: back });
  });
  return { snippetId: id, chapterId: back };
}

/** Absatz in der Werkstatt vormerken: alle Quellen des Absatzes (der Absatz entfällt im Entwurf) */
export async function parkBlock(ctx: Ctx, blockId: string, input: { target?: string; note?: string | null }, user: User) {
  targetOf(input.target);
  const sources = await ctx.db.all('SELECT snippet_id FROM content_block_sources WHERE block_id = ?', blockId);
  if (!sources.length) throw badRequest('Der Absatz hat keine Quelle (manuell geschrieben) – löschen Sie ihn stattdessen.');
  const results = [];
  for (const s of sources) results.push(await parkSnippet(ctx, s.snippet_id, input, user));
  return { blockId, parked: results.length, removedBlocks: results.reduce((n, r) => n + r.removedBlocks, 0) };
}

export async function listParked(ctx: Ctx, target?: string) {
  const targets = target ? [targetOf(target)] : TARGETS;
  const keys = targets.map((t) => RESERVED_CHAPTERS[t].key);
  const rows = await ctx.db.all(
    `SELECT s.id, s.seq, s.text, c.key, d.path, fc.title AS from_title, p.note, p.parked_by, u.name AS parked_by_name, p.parked_at
     FROM text_snippets s JOIN chapters c ON c.id = s.chapter_id JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     LEFT JOIN chapters fc ON fc.id = s.parked_from_chapter_id
     LEFT JOIN snippet_parking p ON p.project_id = d.project_id AND p.document_id = d.id AND p.norm_hash = s.norm_hash
     LEFT JOIN users u ON u.id = p.parked_by
     WHERE c.project_id = ? AND c.key IN (${keys.map(() => '?').join(', ')}) AND r.is_current = 1 ORDER BY c.key, d.path, s.position`,
    ctx.projectId, ...keys,
  );
  const targetByKey = new Map(TARGETS.map((t) => [RESERVED_CHAPTERS[t].key, t]));
  return rows.map((r) => ({
    id: r.id, seq: r.seq, text: r.text, target: targetByKey.get(r.key), path: r.path, fromChapter: r.from_title ?? null,
    note: r.note ?? null, parkedBy: r.parked_by ?? null, parkedByName: r.parked_by_name ?? r.parked_by ?? null, parkedAt: r.parked_at ?? null,
  }));
}

/** beim Import: vorgemerkte Texte derselben Datei gleich ins Kapitel „Intern“ bzw. „In Planung“ */
export async function parkingFor(ctx: Ctx, documentId: string): Promise<Map<string, ParkTarget>> {
  const rows = await ctx.db.all('SELECT norm_hash, target FROM snippet_parking WHERE project_id = ? AND document_id = ?', ctx.projectId, documentId);
  return new Map(rows.map((r) => [r.norm_hash as string, r.target as ParkTarget]));
}
