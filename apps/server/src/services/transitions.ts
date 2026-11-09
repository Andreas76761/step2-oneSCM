// Übergang „weiter zu Kapitel …“ (ADR-085, F-29): je Kapitel ein redaktioneller Übergangstext und optional ein anderes
// Folgekapitel. Ohne Eintrag gilt das nächste Kapitel derselben Gliederung nach Reihenfolge.
import { audit, type Ctx, type User } from '../context.js';
import { now } from '../db.js';
import { badRequest, notFound } from '../problem.js';

async function chapterOf(ctx: Ctx, id: string) {
  const c = await ctx.db.get('SELECT id, title, position, outline_family_id FROM chapters WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!c) throw notFound(`Kapitel ${id}`);
  return c;
}

/** Nächstes Kapitel derselben Gliederung (bzw. ohne Gliederung) nach Reihenfolge */
async function followingChapter(ctx: Ctx, c: any) {
  return c.outline_family_id
    ? ctx.db.get('SELECT id, title FROM chapters WHERE project_id = ? AND outline_family_id = ? AND position > ? ORDER BY position, id LIMIT 1', ctx.projectId, c.outline_family_id, c.position)
    : ctx.db.get('SELECT id, title FROM chapters WHERE project_id = ? AND outline_family_id IS NULL AND position > ? ORDER BY position, id LIMIT 1', ctx.projectId, c.position);
}

export async function getTransition(ctx: Ctx, chapterId: string) {
  const c = await chapterOf(ctx, chapterId);
  const t = await ctx.db.get('SELECT * FROM chapter_transitions WHERE chapter_id = ?', chapterId);
  const next = t?.next_chapter_id ? await ctx.db.get('SELECT id, title FROM chapters WHERE id = ?', t.next_chapter_id) : await followingChapter(ctx, c);
  return {
    chapterId, explicit: !!t, text: (t?.text as string | null) ?? null, nextChapterId: (t?.next_chapter_id as string | null) ?? null,
    next: next ? { chapterId: next.id as string, title: next.title as string } : null,
    updatedBy: t?.updated_by ?? null, updatedAt: t?.updated_at ?? null,
  };
}

export async function listTransitions(ctx: Ctx) {
  const rows = await ctx.db.all('SELECT chapter_id FROM chapter_transitions WHERE project_id = ? ORDER BY chapter_id', ctx.projectId);
  return Promise.all(rows.map((r) => getTransition(ctx, r.chapter_id)));
}

export async function setTransition(ctx: Ctx, chapterId: string, input: any, user: User) {
  await chapterOf(ctx, chapterId);
  const nextId = input.nextChapterId === undefined || input.nextChapterId === null || input.nextChapterId === '' ? null : String(input.nextChapterId);
  if (nextId === chapterId) throw badRequest('Ein Kapitel kann nicht auf sich selbst verweisen.');
  if (nextId) await chapterOf(ctx, nextId).catch(() => { throw badRequest(`nextChapterId ${nextId} ist kein Kapitel dieses Projekts.`); });
  const text = input.text === undefined || input.text === null ? null : String(input.text).replace(/\s+/g, ' ').trim().slice(0, 500) || null;
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO chapter_transitions (chapter_id, project_id, next_chapter_id, text, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT (chapter_id) DO UPDATE SET next_chapter_id = excluded.next_chapter_id, text = excluded.text, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
      chapterId, ctx.projectId, nextId, text, user.id, now(),
    );
    await audit(ctx, user.id, 'chapter.transition_set', 'chapter', chapterId, { nextChapterId: nextId, text });
  });
  return getTransition(ctx, chapterId);
}

export async function deleteTransition(ctx: Ctx, chapterId: string, user: User) {
  await chapterOf(ctx, chapterId);
  await ctx.db.run('DELETE FROM chapter_transitions WHERE chapter_id = ?', chapterId);
  await audit(ctx, user.id, 'chapter.transition_removed', 'chapter', chapterId, {});
  return getTransition(ctx, chapterId);
}

/**
 * Übergänge für einen Export: gepflegte Einträge immer, mit `auto` zusätzlich das jeweils nächste exportierte Kapitel.
 * Verweise auf Kapitel außerhalb des Exports entfallen (die Datei soll keine toten Verweise enthalten).
 */
export async function transitionsFor(ctx: Ctx, chapters: { chapterId: string; title: string }[], auto: boolean) {
  const map = new Map<string, { title: string; text: string | null }>();
  const inExport = new Map(chapters.map((c) => [c.chapterId, c.title]));
  for (let i = 0; i < chapters.length; i++) {
    const t = await ctx.db.get('SELECT next_chapter_id, text FROM chapter_transitions WHERE chapter_id = ?', chapters[i].chapterId);
    if (!t && !auto) continue;
    const nextId = t?.next_chapter_id ?? chapters[i + 1]?.chapterId;
    const title = nextId ? inExport.get(nextId) : undefined;
    if (title) map.set(chapters[i].chapterId, { title, text: t?.text ?? null });
  }
  return map;
}
