// Mehrsprachigkeit (ADR-020): Übersetzungen freigegebener deutscher Kapitelversionen je Zielsprache.
// KI-Übersetzung je Absatz mit Satz-Zuordnung zur deutschen Quelle, manuelle Nachbearbeitung, Freigabe je Sprache.
import { audit, type Ctx } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { detectPrivacy } from '../domain/privacy.js';
import { CHAPTER_SECTIONS } from '../domain/reference.js';
import { RewriteParseError } from '../domain/rewrite.js';
import {
  buildTranslatePrompt, checkTranslation, LANGUAGES, parseTranslateResponse, SECTION_TITLES, splitSentences, TRANSLATE_PROMPT_VERSION, TRANSLATION_ISSUE_LABELS,
  type TranslationIssue,
} from '../domain/translate.js';
import { LlmError } from '../llm.js';
import { badRequest, conflict, notFound, Problem, unprocessable } from '../problem.js';
import { getChapterVersion } from './chapters.js';
import { notifyTranslationReady } from './translationRequests.js';
import { renderHtml, renderMarkdown, type ExportChapter } from './exports.js';
import { loadMedia } from './media.js';
import { preserveImages } from '../domain/media.js';

/** Übersetzt werden Absätze mit Text; Lückenhinweise und erzeugte Statusangaben nicht */
const TRANSLATABLE = ['paragraph', 'list', 'note', 'tip', 'warning', 'table', 'xref'];

export async function projectLanguages(ctx: Ctx): Promise<string[]> {
  return parseJson<string[]>((await ctx.db.get('SELECT languages FROM projects WHERE id = ?', ctx.projectId))?.languages, []);
}

export function languageInfo() {
  return { languages: Object.entries(LANGUAGES).map(([code, name]) => ({ code, name })), issueLabels: TRANSLATION_ISSUE_LABELS, promptVersion: TRANSLATE_PROMPT_VERSION };
}

async function row(ctx: Ctx, id: string) {
  const t = await ctx.db.get('SELECT * FROM translations WHERE id = ?', id);
  if (!t) throw notFound(`Übersetzung ${id}`);
  return t;
}

async function summary(ctx: Ctx, t: Row) {
  const counts = (await ctx.db.get<{ total: number; done: number; flagged: number }>(
    "SELECT COUNT(*) AS total, SUM(CASE WHEN text IS NOT NULL THEN 1 ELSE 0 END) AS done, SUM(CASE WHEN issues <> '[]' THEN 1 ELSE 0 END) AS flagged FROM translation_blocks WHERE translation_id = ?",
    t.id,
  ))!;
  const latest = await ctx.db.get("SELECT id, version_no FROM generated_chapter_versions WHERE chapter_id = ? AND status = 'approved'", t.chapter_id);
  const src = await ctx.db.get('SELECT version_no FROM generated_chapter_versions WHERE id = ?', t.chapter_version_id);
  return {
    id: t.id, chapterId: t.chapter_id, chapterVersionId: t.chapter_version_id, sourceVersionNo: src?.version_no ?? null, language: t.language,
    languageName: LANGUAGES[t.language] ?? t.language, title: t.title ?? null, status: t.status, jobStatus: t.job_status ?? null, jobError: t.job_error ?? null,
    blocks: Number(counts.total ?? 0), translated: Number(counts.done ?? 0), flagged: Number(counts.flagged ?? 0),
    // eine neuere deutsche Freigabe macht die Übersetzung veraltet
    outdated: !!latest && latest.id !== t.chapter_version_id,
    createdBy: t.created_by, createdAt: t.created_at, approvedBy: t.approved_by ?? null, approvedAt: t.approved_at ?? null,
  };
}

export async function listTranslations(ctx: Ctx, chapterId?: string) {
  const rows = await ctx.db.all(
    `SELECT * FROM translations WHERE project_id = ? ${chapterId ? 'AND chapter_id = ?' : ''} ORDER BY created_at DESC`,
    ...(chapterId ? [ctx.projectId, chapterId] : [ctx.projectId]),
  );
  return Promise.all(rows.map((t) => summary(ctx, t)));
}

/** Übersetzung der aktuell freigegebenen deutschen Version anlegen (Absätze zunächst unübersetzt) */
export async function createTranslation(ctx: Ctx, input: { chapterId?: string; language?: string }, actor: string) {
  const language = input.language?.trim().toLowerCase() ?? '';
  if (!LANGUAGES[language]) throw badRequest(`language muss eine von ${Object.keys(LANGUAGES).join(', ')} sein.`);
  if (!(await projectLanguages(ctx)).includes(language)) throw unprocessable(`${LANGUAGES[language]} ist keine Zielsprache dieses Projekts (Projekte → Sprachen).`);
  const chapter = await ctx.db.get('SELECT * FROM chapters WHERE id = ? AND project_id = ?', input.chapterId, ctx.projectId);
  if (!chapter) throw notFound(`Kapitel ${input.chapterId}`);
  const v = await ctx.db.get("SELECT id FROM generated_chapter_versions WHERE chapter_id = ? AND status = 'approved'", chapter.id);
  if (!v) throw unprocessable('Übersetzt werden nur freigegebene Kapitelversionen – dieses Kapitel hat keine.');
  if (await ctx.db.get('SELECT id FROM translations WHERE chapter_version_id = ? AND language = ?', v.id, language)) {
    throw conflict('Für diese Kapitelversion und Sprache gibt es bereits eine Übersetzung.');
  }
  const version = await getChapterVersion(ctx, v.id);
  const id = newId('tr');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      "INSERT INTO translations (id, project_id, chapter_id, chapter_version_id, language, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?)",
      id, ctx.projectId, chapter.id, v.id, language, actor, now(),
    );
    for (const b of version.sections.flatMap((s) => s.blocks)) {
      if (!TRANSLATABLE.includes(b.kind) || b.section === 'status') continue;
      await ctx.db.run(
        "INSERT INTO translation_blocks (id, translation_id, block_id, source_text, issues, mode) VALUES (?, ?, ?, ?, ?, 'pending')",
        newId('trb'), id, b.id, b.text, json(['empty']),
      );
    }
    await audit(ctx, actor, 'translation.created', 'translation', id, { chapterId: chapter.id, chapterVersionId: v.id, language });
  });
  return summary(ctx, await row(ctx, id));
}

export async function getTranslation(ctx: Ctx, id: string) {
  const t = await row(ctx, id);
  const blocks = await ctx.db.all(
    `SELECT tb.*, b.section_code, b.kind, b.position FROM translation_blocks tb JOIN content_blocks b ON b.id = tb.block_id WHERE tb.translation_id = ? ORDER BY b.position`,
    id,
  );
  const chapter = await ctx.db.get('SELECT title FROM chapters WHERE id = ?', t.chapter_id);
  return {
    ...(await summary(ctx, t)),
    sourceTitle: chapter?.title ?? '',
    sections: CHAPTER_SECTIONS.map((s) => ({
      code: s.code, title: s.title, translatedTitle: SECTION_TITLES[t.language]?.[s.code] ?? s.title,
      blocks: blocks.filter((b) => b.section_code === s.code).map((b) => ({
        id: b.id, blockId: b.block_id, kind: b.kind, sourceText: b.source_text, text: b.text ?? null, mode: b.mode,
        sentences: parseJson(b.sentences, null), issues: parseJson<TranslationIssue[]>(b.issues, []), provider: b.provider ?? null, model: b.model ?? null,
        updatedBy: b.updated_by ?? null, updatedAt: b.updated_at ?? null,
      })),
    })).filter((s) => s.blocks.length),
  };
}

function assertDraft(t: Row) {
  if (t.status !== 'draft') throw conflict('Die Übersetzung ist freigegeben und unveränderlich – für Änderungen die neue deutsche Freigabe übersetzen.');
}

/** Absatz manuell übersetzen bzw. KI-Übersetzung nachbearbeiten */
export async function editTranslationBlock(ctx: Ctx, id: string, input: { text?: string }, actor: string) {
  const b = await ctx.db.get('SELECT * FROM translation_blocks WHERE id = ?', id);
  if (!b) throw notFound(`Übersetzungsabsatz ${id}`);
  assertDraft(await row(ctx, b.translation_id));
  const text = input.text?.trim() ?? '';
  if (!text) throw badRequest('Text ist Pflicht.');
  const issues = checkTranslation(b.source_text, text, null);
  await ctx.db.tx(async () => {
    await ctx.db.run("UPDATE translation_blocks SET text = ?, sentences = NULL, issues = ?, mode = 'edited', updated_by = ?, updated_at = ? WHERE id = ?", text, json(issues), actor, now(), id);
    await audit(ctx, actor, 'translation.block_edited', 'translation', b.translation_id, { blockId: b.block_id, issues });
  });
  return (await getTranslation(ctx, b.translation_id)).sections.flatMap((s) => s.blocks).find((x) => x.id === id);
}

export async function setTranslationTitle(ctx: Ctx, id: string, title: string | undefined, actor: string) {
  const t = await row(ctx, id);
  assertDraft(t);
  if (!title?.trim()) throw badRequest('Titel ist Pflicht.');
  await ctx.db.run('UPDATE translations SET title = ? WHERE id = ?', title.trim().slice(0, 200), id);
  await audit(ctx, actor, 'translation.title_set', 'translation', id, { title });
  return summary(ctx, await row(ctx, id));
}

/** KI-Übersetzung aller noch nicht übersetzten Absätze als Hintergrundjob */
export async function startMachineTranslation(ctx: Ctx, id: string, actor: string) {
  if (!ctx.llm) throw new Problem(503, 'Service Unavailable', 'KI-Dienst ist nicht eingerichtet (LLM_PROVIDER).');
  const t = await row(ctx, id);
  assertDraft(t);
  // atomar: nur ein laufender Auftrag je Übersetzung
  const res = await ctx.db.run("UPDATE translations SET job_status = 'queued', job_error = NULL WHERE id = ? AND (job_status IS NULL OR job_status IN ('completed', 'failed'))", id);
  if (!res.changes) throw conflict('Die KI-Übersetzung läuft bereits.');
  await ctx.db.tx(async () => {
    await ctx.jobs.enqueue('translate', { translationId: id, actor });
    await audit(ctx, actor, 'translation.machine_requested', 'translation', id, { provider: ctx.llm!.id, model: ctx.llm!.model, language: t.language });
  });
  ctx.jobs.wake();
  return summary(ctx, await row(ctx, id));
}

export async function runMachineTranslation(ctx: Ctx, id: string, actor: string) {
  const provider = ctx.llm;
  const t = await row(ctx, id);
  if (!provider || t.status !== 'draft') {
    await ctx.db.run("UPDATE translations SET job_status = 'failed', job_error = ? WHERE id = ?", provider ? 'Übersetzung ist nicht mehr bearbeitbar.' : 'Kein KI-Dienst eingerichtet.', id);
    return;
  }
  await ctx.db.run("UPDATE translations SET job_status = 'processing' WHERE id = ?", id);
  const terms = await ctx.db.all("SELECT preferred FROM terminology_terms WHERE project_id = ? AND status = 'active'", ctx.projectId);
  const blocks = await ctx.db.all(
    "SELECT tb.*, b.kind FROM translation_blocks tb JOIN content_blocks b ON b.id = tb.block_id WHERE tb.translation_id = ? AND tb.mode = 'pending'",
    id,
  );
  const call = async (sentences: string[], kind: string) => {
    const prompt = buildTranslatePrompt({ language: t.language, kind, sentences, terms: terms.map((x) => ({ preferred: x.preferred })) });
    return parseTranslateResponse((await provider.complete(prompt)).text);
  };
  let failed = 0;
  for (const b of blocks) {
    // keine personenbezogenen Daten an externe Dienste (wie bei der Umformulierung, ADR-013)
    if (provider.external && detectPrivacy(b.source_text).length) {
      await ctx.db.run('UPDATE translation_blocks SET issues = ? WHERE id = ?', json(['empty']), b.id);
      continue;
    }
    const sentences = splitSentences(b.source_text, b.kind);
    try {
      const out = await call(sentences, b.kind);
      const text = preserveImages(b.source_text, out.map((s) => s.text).filter(Boolean).join(b.kind === 'list' || /^\s*(\d+\.|[-*])\s+/m.test(b.source_text) ? '\n' : ' '));
      const issues = checkTranslation(b.source_text, text, out);
      await ctx.db.run(
        "UPDATE translation_blocks SET text = ?, sentences = ?, issues = ?, mode = 'machine', provider = ?, model = ?, updated_by = ?, updated_at = ? WHERE id = ?",
        text, json(out), json(issues), provider.id, provider.model, actor, now(), b.id,
      );
    } catch (e) {
      if (!(e instanceof LlmError || e instanceof RewriteParseError)) throw e;
      failed++;
    }
  }
  if (!t.title) {
    const chapter = await ctx.db.get('SELECT title FROM chapters WHERE id = ?', t.chapter_id);
    try {
      const [title] = await call([chapter!.title], 'paragraph');
      if (title?.text) await ctx.db.run('UPDATE translations SET title = ? WHERE id = ?', title.text.slice(0, 200), id);
    } catch (e) {
      if (!(e instanceof LlmError || e instanceof RewriteParseError)) throw e;
    }
  }
  await ctx.db.run('UPDATE translations SET job_status = ?, job_error = ? WHERE id = ?', 'completed', failed ? `${failed} Absätze konnten nicht übersetzt werden.` : null, id);
  await audit(ctx, actor, 'translation.machine_completed', 'translation', id, { blocks: blocks.length, failed, provider: provider.id, model: provider.model });
}

export async function failMachineTranslation(ctx: Ctx, id: string, error: string) {
  await ctx.db.run("UPDATE translations SET job_status = 'failed', job_error = ? WHERE id = ?", error.slice(0, 500), id);
}

/** Freigabe je Sprache: alle Absätze übersetzt, keine offenen Prüfbefunde, Titel vorhanden */
export async function approveTranslation(ctx: Ctx, id: string, input: { comment?: string }, actor: string) {
  const t = await row(ctx, id);
  assertDraft(t);
  if (!input.comment?.trim()) throw unprocessable('Die Freigabe benötigt einen Kommentar.');
  const s = await summary(ctx, t);
  const problems = [
    s.translated < s.blocks ? `${s.blocks - s.translated} Absätze nicht übersetzt` : null,
    s.flagged ? `${s.flagged} Absätze mit Prüfbefunden` : null,
    !t.title ? 'Kapiteltitel nicht übersetzt' : null,
    s.outdated ? 'deutsche Quelle ist nicht mehr die aktuelle Freigabe' : null,
  ].filter(Boolean);
  if (problems.length) throw conflict(`Freigabe nicht möglich: ${problems.join('; ')}.`, { problems });
  await ctx.db.tx(async () => {
    const res = await ctx.db.run("UPDATE translations SET status = 'approved', approved_by = ?, approved_at = ?, approval_comment = ? WHERE id = ? AND status = 'draft'", actor, now(), input.comment!.trim(), id);
    if (!res.changes) throw conflict('Übersetzung wurde zwischenzeitlich geändert.');
    await audit(ctx, actor, 'translation.approved', 'translation', id, { comment: input.comment, language: t.language });
    // Übersetzungswünsche aus der Leseransicht erfüllt (ADR-075)
    await notifyTranslationReady(ctx, t.chapter_id as string, t.language as string, String(t.title ?? ''), actor);
  });
  return summary(ctx, await row(ctx, id));
}

/** Übersetztes Kapitel in der Exportstruktur (übersetzte Abschnittstitel, nur übersetzte Absätze) */
export async function translatedChapter(ctx: Ctx, id: string): Promise<ExportChapter & { language: string; approved: boolean }> {
  const t = await getTranslation(ctx, id);
  const src = await getChapterVersion(ctx, t.chapterVersionId);
  const byBlock = new Map(t.sections.flatMap((s) => s.blocks).map((b) => [b.blockId, b]));
  return {
    language: t.language,
    approved: t.status === 'approved',
    title: t.title ?? src.title,
    versionNo: src.versionNo,
    approvedAt: t.approvedAt ?? src.approvedAt,
    sections: src.sections.map((s) => ({
      code: s.code, title: SECTION_TITLES[t.language]?.[s.code] ?? s.title,
      blocks: s.blocks.filter((b) => byBlock.get(b.id)?.text).map((b) => ({ ...b, text: byBlock.get(b.id)!.text! })),
    })),
  };
}

/** Export einer Übersetzung (Markdown/HTML) in derselben Struktur wie der deutsche Export */
export async function exportTranslation(ctx: Ctx, id: string, format: string) {
  const t = await getTranslation(ctx, id);
  if (!['md', 'html'].includes(format)) throw badRequest('format muss md oder html sein.');
  const src = await getChapterVersion(ctx, t.chapterVersionId);
  const byBlock = new Map(t.sections.flatMap((s) => s.blocks).map((b) => [b.blockId, b]));
  const chapter: ExportChapter = {
    title: t.title ?? src.title,
    versionNo: src.versionNo,
    approvedAt: t.approvedAt ?? src.approvedAt,
    sections: src.sections.map((s) => ({
      code: s.code, title: SECTION_TITLES[t.language]?.[s.code] ?? s.title,
      blocks: s.blocks.filter((b) => byBlock.get(b.id)?.text).map((b) => ({ ...b, text: byBlock.get(b.id)!.text! })),
    })),
  };
  const heading = `oneSCM – ${LANGUAGES[t.language] ?? t.language}${t.status === 'approved' ? '' : ' (Entwurf)'}`;
  const media = await loadMedia(ctx, chapter.sections.flatMap((s) => s.blocks.map((b) => b.text as string)));
  const body = format === 'md'
    ? renderMarkdown([chapter], {}, media).replace(/^# oneSCM Benutzerhandbuch/, `# ${heading}`)
    : renderHtml([chapter], {}, media).replace(/<html lang="de">/, `<html lang="${t.language}">`).replace('<h1>oneSCM Benutzerhandbuch</h1>', `<h1>${heading.replace(/[<>&]/g, '')}</h1>`);
  return { data: Buffer.from(body, 'utf8'), fileName: `onescm-${t.language}-${(t.title ?? 'kapitel').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}.${format}`, type: format === 'md' ? 'text/markdown; charset=utf-8' : 'text/html; charset=utf-8' };
}

/** Übersetzungsstand je Zielsprache für das Dashboard (ADR-021) */
export async function translationStatus(ctx: Ctx) {
  const current = await ctx.db.all(
    "SELECT v.id, v.chapter_id FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND v.status = 'approved'",
    ctx.projectId,
  );
  const currentIds = new Set(current.map((v) => v.id as string));
  const out = [];
  for (const language of await projectLanguages(ctx)) {
    const rows = await ctx.db.all('SELECT chapter_version_id, status FROM translations WHERE project_id = ? AND language = ?', ctx.projectId, language);
    const upToDate = rows.filter((r) => currentIds.has(r.chapter_version_id));
    out.push({
      language, languageName: LANGUAGES[language] ?? language, chapters: current.length,
      approved: upToDate.filter((r) => r.status === 'approved').length,
      draft: upToDate.filter((r) => r.status === 'draft').length,
      outdated: rows.filter((r) => !currentIds.has(r.chapter_version_id)).length,
      missing: current.length - upToDate.length,
    });
  }
  return out;
}
