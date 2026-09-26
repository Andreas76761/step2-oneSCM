// Rückmeldungen aus der Leseransicht (ADR-054): „War das hilfreich?“ je Kapitel; Kritik mit Kommentar erreicht die Redaktion
// als Aufgabe. Eine Stimme je Person und Kapitelversion (erneutes Abstimmen ersetzt die offene Rückmeldung).
import { audit, type Ctx, type User } from '../context.js';
import { newId, now, type Row } from '../db.js';
import { badRequest, notFound } from '../problem.js';
import { systemNotice } from './collaboration.js';

const dto = (r: Row) => ({
  id: r.id as string, chapterId: r.chapter_id as string, title: (r.title as string | null) ?? null, versionId: (r.version_id as string | null) ?? null,
  helpful: !!r.helpful, comment: (r.comment as string | null) ?? null, status: r.status as string,
  createdBy: r.created_by as string, createdAt: r.created_at as string, handledBy: (r.handled_by as string | null) ?? null, handledAt: (r.handled_at as string | null) ?? null,
});

export async function submitFeedback(ctx: Ctx, chapterId: string, input: { helpful?: unknown; comment?: unknown; versionId?: unknown }, user: User) {
  if (typeof input.helpful !== 'boolean') throw badRequest('helpful muss true oder false sein.');
  const comment = typeof input.comment === 'string' && input.comment.trim() ? input.comment.trim().slice(0, 1000) : null;
  const chapter = await ctx.db.get('SELECT id, title FROM chapters WHERE id = ? AND project_id = ?', chapterId, ctx.projectId);
  if (!chapter) throw notFound(`Kapitel ${chapterId}`);
  let versionId: string | null = null;
  if (input.versionId !== undefined && input.versionId !== null) {
    const v = await ctx.db.get('SELECT id FROM generated_chapter_versions WHERE id = ? AND chapter_id = ?', input.versionId, chapterId);
    if (!v) throw badRequest('versionId gehört nicht zu diesem Kapitel.');
    versionId = v.id as string;
  }
  let id = '';
  await ctx.db.tx(async () => {
    const prev = await ctx.db.get("SELECT id FROM chapter_feedback WHERE project_id = ? AND chapter_id = ? AND created_by = ? AND status = 'open' AND COALESCE(version_id, '') = ?", ctx.projectId, chapterId, user.id, versionId ?? '');
    if (prev) {
      id = prev.id as string;
      await ctx.db.run('UPDATE chapter_feedback SET helpful = ?, comment = ?, created_at = ? WHERE id = ?', input.helpful ? 1 : 0, comment, now(), id);
    } else {
      id = newId('fb');
      await ctx.db.run('INSERT INTO chapter_feedback (id, project_id, chapter_id, version_id, helpful, comment, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        id, ctx.projectId, chapterId, versionId, input.helpful ? 1 : 0, comment, 'open', user.id, now());
    }
    await audit(ctx, user.id, 'feedback.submitted', 'chapter', chapterId, { helpful: input.helpful, comment: !!comment });
    // Kritik oder Anmerkung → Aufgabe für die Redaktion (Autorin/Autor und Einreichende der neuesten Version)
    if (!input.helpful || comment) {
      const v = await ctx.db.get('SELECT generated_by, submitted_by FROM generated_chapter_versions WHERE chapter_id = ? ORDER BY version_no DESC LIMIT 1', chapterId);
      const to = [v?.generated_by, v?.submitted_by].filter((x): x is string => typeof x === 'string' && x !== 'system' && x !== user.id);
      if (to.length) await systemNotice(ctx, chapterId, `Leser-Rückmeldung zu „${chapter.title}“: ${input.helpful ? 'hilfreich' : 'nicht hilfreich'}${comment ? ` – „${comment}“` : ''}`, to, 'feedback');
    }
  });
  return dto({ ...(await ctx.db.get('SELECT * FROM chapter_feedback WHERE id = ?', id))!, title: chapter.title });
}

export async function listFeedback(ctx: Ctx, q: { status?: string; chapterId?: string }) {
  const where = ['f.project_id = ?'];
  const p: unknown[] = [ctx.projectId];
  if (q.status === 'open' || q.status === 'done') (where.push('f.status = ?'), p.push(q.status));
  if (q.chapterId) (where.push('f.chapter_id = ?'), p.push(q.chapterId));
  return (await ctx.db.all(`SELECT f.*, c.title FROM chapter_feedback f LEFT JOIN chapters c ON c.id = f.chapter_id WHERE ${where.join(' AND ')} ORDER BY f.created_at DESC LIMIT 500`, ...p)).map(dto);
}

/** Je Kapitel: hilfreich / nicht hilfreich / offene Rückmeldungen mit Kommentar */
export async function feedbackSummary(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT chapter_id, SUM(CASE WHEN helpful = 1 THEN 1 ELSE 0 END) AS yes, SUM(CASE WHEN helpful = 0 THEN 1 ELSE 0 END) AS no,
       SUM(CASE WHEN status = 'open' AND (helpful = 0 OR comment IS NOT NULL) THEN 1 ELSE 0 END) AS open
     FROM chapter_feedback WHERE project_id = ? GROUP BY chapter_id`, ctx.projectId,
  );
  return rows.map((r) => ({ chapterId: r.chapter_id as string, helpful: Number(r.yes), notHelpful: Number(r.no), open: Number(r.open) }));
}

export async function updateFeedback(ctx: Ctx, id: string, input: { status?: unknown }, user: User) {
  if (input.status !== 'open' && input.status !== 'done') throw badRequest('status muss open oder done sein.');
  const r = await ctx.db.get('SELECT * FROM chapter_feedback WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Rückmeldung ${id}`);
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE chapter_feedback SET status = ?, handled_by = ?, handled_at = ? WHERE id = ?', input.status, input.status === 'done' ? user.id : null, input.status === 'done' ? now() : null, id);
    await audit(ctx, user.id, 'feedback.updated', 'chapter', r.chapter_id as string, { feedbackId: id, status: input.status });
  });
  return dto({ ...(await ctx.db.get('SELECT f.*, c.title FROM chapter_feedback f LEFT JOIN chapters c ON c.id = f.chapter_id WHERE f.id = ?', id))! });
}
