// Rückmeldungen aus der Leseransicht (ADR-054): „War das hilfreich?“ je Kapitel; Kritik mit Kommentar erreicht die Redaktion
// als Aufgabe. Eine Stimme je Person und Kapitelversion (erneutes Abstimmen ersetzt die offene Rückmeldung).
import { audit, type Ctx, type User } from '../context.js';
import { newId, now, type Row } from '../db.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { createComment, systemNotice } from './collaboration.js';

const dto = (r: Row) => ({
  id: r.id as string, chapterId: r.chapter_id as string, title: (r.title as string | null) ?? null, versionId: (r.version_id as string | null) ?? null,
  helpful: !!r.helpful, comment: (r.comment as string | null) ?? null, status: r.status as string, source: (r.source as string | null) ?? 'app',
  createdBy: r.created_by as string, createdAt: r.created_at as string, handledBy: (r.handled_by as string | null) ?? null, handledAt: (r.handled_at as string | null) ?? null,
});

export async function submitFeedback(ctx: Ctx, chapterId: string, input: { helpful?: unknown; comment?: unknown; versionId?: unknown }, user: User, source: 'app' | 'online-help' = 'app') {
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
    // anonyme Stimmen aus der Online-Hilfe lassen sich keiner Person zuordnen – jede zählt einzeln
    const prev = source === 'app'
      ? await ctx.db.get("SELECT id FROM chapter_feedback WHERE project_id = ? AND chapter_id = ? AND created_by = ? AND status = 'open' AND COALESCE(version_id, '') = ?", ctx.projectId, chapterId, user.id, versionId ?? '')
      : undefined;
    if (prev) {
      id = prev.id as string;
      await ctx.db.run('UPDATE chapter_feedback SET helpful = ?, comment = ?, created_at = ? WHERE id = ?', input.helpful ? 1 : 0, comment, now(), id);
    } else {
      id = newId('fb');
      await ctx.db.run('INSERT INTO chapter_feedback (id, project_id, chapter_id, version_id, helpful, comment, status, created_by, created_at, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        id, ctx.projectId, chapterId, versionId, input.helpful ? 1 : 0, comment, 'open', user.id, now(), source);
    }
    await audit(ctx, user.id, 'feedback.submitted', 'chapter', chapterId, { helpful: input.helpful, comment: !!comment, source });
    // Kritik oder Anmerkung → Aufgabe für die Redaktion (Autorin/Autor und Einreichende der neuesten Version)
    if (!input.helpful || comment) {
      const v = await ctx.db.get('SELECT generated_by, submitted_by FROM generated_chapter_versions WHERE chapter_id = ? ORDER BY version_no DESC LIMIT 1', chapterId);
      const to = [v?.generated_by, v?.submitted_by].filter((x): x is string => typeof x === 'string' && x !== 'system' && x !== user.id);
      if (to.length) await systemNotice(ctx, chapterId, `Leser-Rückmeldung${source === 'online-help' ? ' (Online-Hilfe)' : ''} zu „${chapter.title}“: ${input.helpful ? 'hilfreich' : 'nicht hilfreich'}${comment ? ` – „${comment}“` : ''}`, to, 'feedback');
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

// ---------- Auswertung (ADR-058) ----------

const STOP = new Set(['aber', 'auch', 'dass', 'dann', 'denn', 'dies', 'diese', 'dieser', 'dieses', 'eine', 'einen', 'einem', 'einer', 'hier', 'habe', 'haben', 'ich', 'ist', 'kann',
  'keine', 'mehr', 'nicht', 'noch', 'nach', 'oder', 'schon', 'sehr', 'sind', 'soll', 'unter', 'viel', 'wenn', 'werden', 'wird', 'wie', 'wo', 'war', 'waren', 'wurde', 'zum', 'zur', 'über', 'bitte', 'danke',
  'finde', 'fehlt', 'steht', 'gibt', 'alle', 'etwas', 'immer', 'einfach', 'wäre', 'würde', 'muss', 'möchte']);

/**
 * Auswertung der Rückmeldungen: je Kapitel Zustimmung, Anteil „nicht hilfreich“, Entwicklung (letzte 30 Tage gegenüber den
 * 30 Tagen davor), häufige Begriffe aus den Kommentaren und die neuesten Kommentare.
 */
export async function feedbackInsights(ctx: Ctx, q: { days?: number }) {
  const days = Math.min(Math.max(Math.round(q.days ?? 90), 7), 730);
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const d30 = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const d60 = new Date(Date.now() - 60 * 86_400_000).toISOString();
  // für die Entwicklung immer mindestens 60 Tage laden; Summen, Begriffe und Kommentare nur für den gewählten Zeitraum
  const loadSince = since < d60 ? since : d60;
  const all = await ctx.db.all('SELECT f.*, c.title FROM chapter_feedback f LEFT JOIN chapters c ON c.id = f.chapter_id WHERE f.project_id = ? AND f.created_at >= ? ORDER BY f.created_at DESC', ctx.projectId, loadSince);
  const rows = all.filter((r) => r.created_at >= since);
  const by = new Map<string, { chapterId: string; title: string; helpful: number; notHelpful: number; open: number; online: number; recentNo: number; recentTotal: number; prevNo: number; prevTotal: number }>();
  const entry = (r: any) => by.get(r.chapter_id) ?? { chapterId: r.chapter_id, title: r.title ?? r.chapter_id, helpful: 0, notHelpful: 0, open: 0, online: 0, recentNo: 0, recentTotal: 0, prevNo: 0, prevTotal: 0 };
  for (const r of rows) {
    const e = entry(r);
    if (r.helpful) e.helpful++; else e.notHelpful++;
    if (r.status === 'open' && (!r.helpful || r.comment)) e.open++;
    if (r.source === 'online-help') e.online++;
    by.set(r.chapter_id, e);
  }
  // Entwicklung: letzte 30 Tage gegenüber den 30 Tagen davor – unabhängig vom gewählten Zeitraum, nur für Kapitel im Zeitraum
  for (const r of all) {
    const e = by.get(r.chapter_id);
    if (!e) continue;
    if (r.created_at >= d30) (e.recentTotal++, !r.helpful && e.recentNo++);
    else if (r.created_at >= d60) (e.prevTotal++, !r.helpful && e.prevNo++);
  }
  const share = (no: number, total: number) => (total ? Math.round((no / total) * 100) : null);
  const chapters = [...by.values()].map((e) => {
    const recent = share(e.recentNo, e.recentTotal);
    const prev = share(e.prevNo, e.prevTotal);
    return {
      chapterId: e.chapterId, title: e.title, helpful: e.helpful, notHelpful: e.notHelpful, total: e.helpful + e.notHelpful,
      notHelpfulShare: share(e.notHelpful, e.helpful + e.notHelpful) ?? 0, open: e.open, online: e.online,
      // Veränderung des Anteils „nicht hilfreich“ in Prozentpunkten (negativ = besser)
      trend: recent !== null && prev !== null ? recent - prev : null,
    };
  }).sort((a, b) => b.notHelpfulShare - a.notHelpfulShare || b.notHelpful - a.notHelpful || a.title.localeCompare(b.title));
  const counts = new Map<string, number>();
  for (const r of rows) {
    if (r.helpful || !r.comment) continue;
    const seen = new Set<string>();
    for (const w of String(r.comment).toLowerCase().match(/[\p{L}][\p{L}-]{3,}/gu) ?? []) {
      if (STOP.has(w) || seen.has(w)) continue;
      seen.add(w);
      counts.set(w, (counts.get(w) ?? 0) + 1);
    }
  }
  const words = [...counts.entries()].filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12).map(([word, count]) => ({ word, count }));
  const total = rows.length;
  const yes = rows.filter((r) => r.helpful).length;
  return {
    days, total, helpful: yes, notHelpful: total - yes, helpfulShare: total ? Math.round((yes / total) * 100) : null, chapters, words,
    comments: rows.filter((r) => r.comment).slice(0, 20).map(dto),
  };
}

/** Aus einer Rückmeldung eine Aufgabe am Kapitel machen (Kommentar vom Typ „Aufgabe“) und die Rückmeldung erledigen */
export async function feedbackToTask(ctx: Ctx, id: string, input: { assignee?: unknown; dueDate?: unknown }, user: User) {
  const r = await ctx.db.get('SELECT f.*, c.title FROM chapter_feedback f LEFT JOIN chapters c ON c.id = f.chapter_id WHERE f.id = ? AND f.project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Rückmeldung ${id}`);
  // nur offene Rückmeldungen – wiederholte Aufrufe (z. B. nach verlorener Antwort) erzeugen keine zweite Aufgabe
  if (r.status !== 'open') throw conflict('Die Rückmeldung ist bereits erledigt.');
  const assignee = typeof input.assignee === 'string' && input.assignee ? input.assignee : user.id;
  const body = `Leser-Rückmeldung (${r.helpful ? 'hilfreich' : 'nicht hilfreich'}${r.source === 'online-help' ? ', Online-Hilfe' : ''}): ${r.comment ? `„${r.comment}“` : 'ohne Kommentar'} – bitte das Kapitel prüfen und verbessern.`;
  const task = await createComment(ctx, { entityType: 'chapter', entityId: r.chapter_id, body, kind: 'task', assignee, dueDate: typeof input.dueDate === 'string' ? input.dueDate : undefined }, user);
  await ctx.db.tx(async () => {
    await ctx.db.run("UPDATE chapter_feedback SET status = 'done', handled_by = ?, handled_at = ? WHERE id = ?", user.id, now(), id);
    await audit(ctx, user.id, 'feedback.task_created', 'chapter', r.chapter_id, { feedbackId: id, taskId: task.id, assignee });
  });
  return { task, feedback: dto({ ...(await ctx.db.get('SELECT * FROM chapter_feedback WHERE id = ?', id))!, title: r.title }) };
}
