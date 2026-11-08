// Wöchentliche Übersicht (ADR-064): jede Person mit Bearbeitungsrecht erhält einmal je Woche einen Hinweis mit offenen
// Leser-Rückmeldungen, ihren offenen Aufgaben, den Kapiteln mit dem größten Handlungsbedarf sowie offenen Übersetzungswünschen
// und veralteten Übersetzungen (ADR-126) – nur, wenn es etwas zu tun gibt.
import { audit, type Ctx, type User } from '../context.js';
import { now } from '../db.js';
import { badRequest } from '../problem.js';
import { collaborators, projectNotice } from './collaboration.js';
import { faqHash } from './faqTranslations.js';
import { guidanceSummary } from './guidance.js';
import { listTranslationRequests } from './translationRequests.js';

/** ISO-Kalenderwoche, z. B. 2026-W39 */
export function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const year = t.getUTCFullYear();
  const week = Math.ceil(((t.getTime() - Date.UTC(year, 0, 1)) / 86_400_000 + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export async function getDigestSettings(ctx: Ctx) {
  const r = await ctx.db.get('SELECT digest_weekday FROM projects WHERE id = ?', ctx.projectId);
  const last = await ctx.db.get('SELECT week, MAX(sent_at) AS at FROM digest_log WHERE project_id = ? GROUP BY week ORDER BY week DESC LIMIT 1', ctx.projectId);
  return { weekday: r?.digest_weekday === null || r?.digest_weekday === undefined ? null : Number(r.digest_weekday), lastWeek: (last?.week as string) ?? null, lastSentAt: (last?.at as string) ?? null };
}

export async function updateDigestSettings(ctx: Ctx, input: { weekday?: unknown }, user: User) {
  const v = input.weekday;
  if (v !== null && (typeof v !== 'number' || !Number.isInteger(v) || v < 1 || v > 7)) throw badRequest('weekday muss 1 (Montag) bis 7 (Sonntag) oder null sein.');
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE projects SET digest_weekday = ? WHERE id = ?', v, ctx.projectId);
    await audit(ctx, user.id, 'digest.settings_changed', 'project', ctx.projectId, { weekday: v });
  });
  return getDigestSettings(ctx);
}

/** Projektweiter Teil der Übersicht (Rückmeldungen, Kapitel mit Handlungsbedarf) – je Versand nur einmal berechnet */
export async function digestShared(ctx: Ctx) {
  const fb = await ctx.db.all(
    `SELECT f.chapter_id, c.title, COUNT(*) AS n FROM chapter_feedback f LEFT JOIN chapters c ON c.id = f.chapter_id
     WHERE f.project_id = ? AND f.status = 'open' AND (f.helpful = 0 OR f.comment IS NOT NULL) GROUP BY f.chapter_id, c.title ORDER BY n DESC, c.title`, ctx.projectId,
  );
  const weak = (await guidanceSummary(ctx)).chapters.filter((c) => c.open.some((o) => o.status === 'warning')).slice(0, 3);
  return { fb, weak, ...(await digestTranslations(ctx)) };
}

/**
 * Übersetzungsteil der Übersicht (ADR-126): offene Übersetzungswünsche aus der Leseransicht (meistgewünschte zuerst) und
 * veraltete Übersetzungen – Kapitel, deren freigegebene Übersetzung zu einer älteren deutschen Fassung gehört (ohne aktuelle
 * Freigabe), und häufige Fragen, deren deutsche Quelle sich seit der Übersetzung geändert hat.
 */
export async function digestTranslations(ctx: Ctx) {
  const requests = (await listTranslationRequests(ctx)).filter((r) => r.state !== 'in_progress');
  const latest = await ctx.db.all(
    `SELECT c.id, c.title, (SELECT v.id FROM generated_chapter_versions v WHERE v.chapter_id = c.id AND v.status = 'approved' ORDER BY v.version_no DESC LIMIT 1) AS vid
     FROM chapters c WHERE c.project_id = ?`, ctx.projectId,
  );
  const approved = await ctx.db.all("SELECT chapter_id, language, chapter_version_id FROM translations WHERE project_id = ? AND status = 'approved'", ctx.projectId);
  const outdatedChapters: { chapterId: string; title: string; language: string }[] = [];
  for (const c of latest) {
    if (!c.vid) continue;
    const mine = approved.filter((t) => t.chapter_id === c.id);
    for (const language of [...new Set(mine.map((t) => t.language as string))].sort()) {
      if (!mine.some((t) => t.language === language && t.chapter_version_id === c.vid)) outdatedChapters.push({ chapterId: c.id as string, title: String(c.title), language });
    }
  }
  const faq = await ctx.db.all(
    "SELECT t.language, f.question, f.answer, t.source_hash FROM faq_translations t JOIN faq_entries f ON f.id = t.faq_id WHERE t.project_id = ? AND f.language = 'de'", ctx.projectId,
  );
  const outdatedFaq = faq.filter((t) => t.source_hash !== faqHash(String(t.question), String(t.answer))).length;
  return { requests, outdatedChapters, outdatedFaq };
}

/** Inhalt der Übersicht für eine Person (auch als Vorschau); `shared` aus digestShared() spart beim Versand die Wiederholung */
export async function buildDigest(ctx: Ctx, userId: string, date = new Date(), shared?: Awaited<ReturnType<typeof digestShared>>) {
  const { fb, weak, requests, outdatedChapters, outdatedFaq } = shared ?? await digestShared(ctx);
  const openFeedback = fb.reduce((n, r) => n + Number(r.n), 0);
  const tasks = await ctx.db.all(
    "SELECT id, entity_type, entity_id, body, due_date FROM comments WHERE project_id = ? AND kind = 'task' AND status = 'open' AND assignee = ? ORDER BY COALESCE(due_date, '9999'), created_at", ctx.projectId, userId,
  );
  const today = now().slice(0, 10);
  const overdue = tasks.filter((t) => t.due_date && t.due_date < today).length;
  const lines: string[] = [];
  if (openFeedback) lines.push(`${openFeedback} offene Leser-Rückmeldung${openFeedback === 1 ? '' : 'en'} (${fb.slice(0, 3).map((r) => `${r.title ?? r.chapter_id}: ${r.n}`).join(', ')})`);
  if (tasks.length) lines.push(`${tasks.length} offene Aufgabe${tasks.length === 1 ? '' : 'n'} für Sie${overdue ? `, davon ${overdue} überfällig` : ''}`);
  if (weak.length) lines.push(`Anleitungs-Check mit Pflichtpunkten offen: ${weak.map((c) => `${c.title} (${c.score})`).join(', ')}`);
  const wishes = requests.reduce((n, r) => n + r.count, 0);
  if (requests.length) lines.push(`${wishes === 1 ? '1 Übersetzungswunsch' : `${wishes} Übersetzungswünsche`} offen (${requests.slice(0, 3).map((r) => `${r.title} – ${r.languageName}: ${r.count}`).join(', ')})`);
  const outdated = outdatedChapters.length + outdatedFaq;
  if (outdated) {
    const parts = [outdatedChapters.length && `${outdatedChapters.length} Kapitel`, outdatedFaq && `${outdatedFaq} häufige Frage${outdatedFaq === 1 ? '' : 'n'}`].filter(Boolean);
    lines.push(`Veraltete Übersetzungen: ${parts.join(' und ')}`);
  }
  return {
    week: isoWeek(date), openFeedback, feedbackByChapter: fb.slice(0, 5).map((r) => ({ chapterId: r.chapter_id as string, title: (r.title as string) ?? r.chapter_id, open: Number(r.n) })),
    tasks: tasks.length, overdueTasks: overdue,
    translationRequests: requests.slice(0, 5).map((r) => ({ chapterId: r.chapterId, title: r.title, language: r.language, languageName: r.languageName, count: r.count, state: r.state })),
    openTranslationRequests: wishes, outdatedChapterTranslations: outdatedChapters.slice(0, 10), outdatedFaqTranslations: outdatedFaq, weakChapters: weak.map((c) => ({ chapterId: c.chapterId, title: c.title, score: c.score, versionId: c.versionId })),
    empty: !lines.length, text: lines.length ? `Wochenübersicht ${isoWeek(date)}: ${lines.join(' · ')}.` : null,
  };
}

/**
 * Übersicht an alle Personen mit Bearbeitungsrecht senden – je Person höchstens einmal je Woche (digest_log).
 * `force` (Schaltfläche „Jetzt senden“) ignoriert den Wochentag, nicht aber die Wochensperre.
 */
export async function sendDigests(ctx: Ctx, opts: { force?: boolean; date?: Date } = {}) {
  const date = opts.date ?? new Date();
  const { weekday } = await getDigestSettings(ctx);
  if (!opts.force && (weekday === null || (date.getUTCDay() || 7) !== weekday)) return { sent: 0, skipped: 'nicht der eingestellte Wochentag' };
  const week = isoWeek(date);
  const editors = (await collaborators(ctx)).filter((u) => u.permissions.includes('edit') || u.permissions.includes('admin'));
  let sent = 0;
  let shared: Awaited<ReturnType<typeof digestShared>> | undefined; // erst bei der ersten offenen Person, dann für alle
  for (const u of editors) {
    if (await ctx.db.get('SELECT 1 FROM digest_log WHERE project_id = ? AND user_id = ? AND week = ?', ctx.projectId, u.id, week)) continue;
    shared ??= await digestShared(ctx);
    const d = await buildDigest(ctx, u.id, date, shared);
    if (d.empty) continue; // nichts zu tun: keine Nachricht, die Woche bleibt offen
    await ctx.db.tx(async () => {
      const res = await ctx.db.run('INSERT INTO digest_log (project_id, user_id, week, sent_at) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING', ctx.projectId, u.id, week, now());
      if (!res.changes) return;
      await projectNotice(ctx, u.id, d.text!, 'digest', d.openFeedback ? '/rueckmeldungen' : d.tasks ? '/aufgaben' : d.openTranslationRequests || d.outdatedChapterTranslations.length ? '/uebersetzungen' : '/aufgaben');
      sent++;
    });
  }
  if (sent) await audit(ctx, 'system', 'digest.sent', 'project', ctx.projectId, { week, recipients: sent });
  ctx.jobs.wake();
  return { sent, week };
}

/** Job: stündlich prüfen, ob in einem Projekt heute die Wochenübersicht fällig ist */
export async function runDigests(ctx: Ctx, forProject: (id: string) => Ctx) {
  let sent = 0;
  for (const p of await ctx.db.all('SELECT id FROM projects WHERE archived_at IS NULL AND digest_weekday IS NOT NULL')) sent += (await sendDigests(forProject(p.id as string))).sent;
  return sent;
}

export async function ensureDigestJob(ctx: Ctx, next = false) {
  if (!next && (await ctx.db.get("SELECT id FROM jobs WHERE type = 'weekly-digest' AND status IN ('queued','running')"))) return;
  await ctx.jobs.enqueue('weekly-digest', {}, 1, next ? 3_600_000 : 120_000);
}
