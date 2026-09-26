// Übersetzungswünsche (ADR-075): Leser fordern für ein Kapitel ohne (aktuelle) Übersetzung eine Übersetzung an; die Redaktion
// sieht die Wünsche gesammelt nach Anzahl und erhält beim ersten Wunsch je Kapitel und Sprache einen Hinweis im Kapitel.
import { audit, type Ctx, type User } from '../context.js';
import { now, parseJson } from '../db.js';
import { LANGUAGES } from '../domain/translate.js';
import { badRequest, notFound } from '../problem.js';
import { projectNotice, systemNotice } from './collaboration.js';

export type RequestState = 'missing' | 'outdated' | 'in_progress' | 'done';

/** Stand der Übersetzung eines Kapitels in einer Sprache, gemessen an der neuesten freigegebenen deutschen Fassung */
async function stateOf(ctx: Ctx, chapterId: string, language: string): Promise<RequestState> {
  const v = await ctx.db.get("SELECT id FROM generated_chapter_versions WHERE chapter_id = ? AND status = 'approved' ORDER BY version_no DESC LIMIT 1", chapterId);
  const rows = await ctx.db.all('SELECT chapter_version_id, status FROM translations WHERE project_id = ? AND chapter_id = ? AND language = ?', ctx.projectId, chapterId, language);
  const current = rows.filter((r) => r.chapter_version_id === v?.id);
  if (current.some((r) => r.status === 'approved')) return 'done';
  if (current.length) return 'in_progress';
  return rows.some((r) => r.status === 'approved') ? 'outdated' : 'missing';
}

/** Übersetzung wünschen (jede Person mit Lesezugriff); wiederholte Wünsche derselben Person zählen einmal */
export async function requestTranslation(ctx: Ctx, input: { chapterId?: unknown; language?: unknown }, user: User) {
  if (typeof input.chapterId !== 'string' || typeof input.language !== 'string') throw badRequest('chapterId und language sind Pflicht.');
  const { chapterId, language } = input;
  const languages = parseJson<string[]>((await ctx.db.get('SELECT languages FROM projects WHERE id = ?', ctx.projectId))?.languages, []);
  if (!languages.includes(language)) throw badRequest(`Sprache „${language}“ ist keine Zielsprache des Projekts.`);
  const chapter = await ctx.db.get('SELECT id, title FROM chapters WHERE id = ? AND project_id = ?', chapterId, ctx.projectId);
  if (!chapter) throw notFound(`Kapitel ${chapterId}`);
  const state = await stateOf(ctx, chapterId, language);
  if (state === 'done') throw badRequest('Dieses Kapitel liegt bereits aktuell übersetzt vor.');
  let count = 0;
  await ctx.db.tx(async () => {
    const fresh = await ctx.db.run(
      'INSERT INTO translation_requests (project_id, chapter_id, language, user_id, created_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT DO NOTHING',
      ctx.projectId, chapterId, language, user.id, now(),
    );
    count = Number((await ctx.db.get('SELECT COUNT(*) AS n FROM translation_requests WHERE project_id = ? AND chapter_id = ? AND language = ?', ctx.projectId, chapterId, language))?.n ?? 0);
    if (!fresh.changes) return;
    await audit(ctx, user.id, 'translation.requested', 'chapter', chapterId, { language, count });
    // erster Wunsch: Hinweis im Kapitel an Autorin/Autor und Einreichende der neuesten Fassung (wie Leser-Rückmeldungen).
    // „Erster“ entscheidet das Einfügen der Hinweis-Zeile je Kapitel und Sprache – nicht die Zählung, die bei gleichzeitigen
    // Wünschen verschiedener Personen in beiden Transaktionen 1 ergeben kann
    const first = await ctx.db.run(
      'INSERT INTO translation_request_notices (project_id, chapter_id, language, created_at) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING',
      ctx.projectId, chapterId, language, now(),
    );
    if (first.changes) {
      const v = await ctx.db.get('SELECT generated_by, submitted_by FROM generated_chapter_versions WHERE chapter_id = ? ORDER BY version_no DESC LIMIT 1', chapterId);
      const to = [v?.generated_by, v?.submitted_by].filter((x): x is string => typeof x === 'string' && x !== 'system' && x !== user.id);
      const name = LANGUAGES[language] ?? language;
      if (to.length) await systemNotice(ctx, chapterId, `Übersetzung gewünscht: „${chapter.title}“ auf ${name}${state === 'outdated' ? ' (vorhandene Übersetzung ist veraltet)' : ''} – angefordert aus der Leseransicht.`, to, 'translation_request');
    }
  });
  return { chapterId, language, requested: true, count, state };
}

/** Eigene offene Wünsche (für die Leseransicht) */
export async function myTranslationRequests(ctx: Ctx, userId: string) {
  const rows = await ctx.db.all('SELECT chapter_id, language FROM translation_requests WHERE project_id = ? AND user_id = ?', ctx.projectId, userId);
  return rows.map((r) => ({ chapterId: r.chapter_id as string, language: r.language as string }));
}

/** Wünsche gesammelt je Kapitel und Sprache, meistgewünschte zuerst; erledigte (aktuell übersetzt) nur mit `all` */
export async function listTranslationRequests(ctx: Ctx, all = false) {
  const rows = await ctx.db.all(
    `SELECT r.chapter_id, r.language, c.title, COUNT(*) AS n, MIN(r.created_at) AS first_at, MAX(r.created_at) AS last_at
     FROM translation_requests r JOIN chapters c ON c.id = r.chapter_id WHERE r.project_id = ? GROUP BY r.chapter_id, r.language, c.title`, ctx.projectId,
  );
  const out = [];
  for (const r of rows) {
    const state = await stateOf(ctx, r.chapter_id as string, r.language as string);
    if (state === 'done' && !all) continue;
    out.push({
      chapterId: r.chapter_id as string, title: String(r.title), language: r.language as string, languageName: LANGUAGES[r.language as string] ?? String(r.language),
      count: Number(r.n), firstRequestedAt: r.first_at as string, lastRequestedAt: r.last_at as string, state,
    });
  }
  return out.sort((a, b) => b.count - a.count || b.lastRequestedAt.localeCompare(a.lastRequestedAt));
}

/**
 * Nach der Freigabe einer Übersetzung: alle, die sie gewünscht haben, erhalten einen Hinweis mit Link in die Leseransicht.
 * Läuft in der Transaktion der Freigabe; die Wünsche bleiben für die Statistik erhalten (Stand „erledigt“).
 */
export async function notifyTranslationReady(ctx: Ctx, chapterId: string, language: string, title: string, actor: string) {
  const rows = await ctx.db.all('SELECT user_id FROM translation_requests WHERE project_id = ? AND chapter_id = ? AND language = ?', ctx.projectId, chapterId, language);
  const name = LANGUAGES[language] ?? language;
  for (const r of rows) {
    if (r.user_id === actor) continue;
    await projectNotice(ctx, r.user_id as string, `Ihre gewünschte Übersetzung ist da: „${title}“ auf ${name}.`, 'translation_ready', `/lesen/${chapterId}?lang=${language}`);
  }
  return rows.length;
}
