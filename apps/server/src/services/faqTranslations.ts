// Übersetzungen häufiger Fragen (ADR-077): je deutschem FAQ-Eintrag und Projektsprache eine Übersetzung – von Hand oder als
// KI-Vorschlag, mit Freigabe. Leseransicht, Druck und Online-Hilfe zeigen die freigegebene, aktuelle Übersetzung, sonst deutsch.
import { createHash } from 'node:crypto';
import { audit, type Ctx, type User } from '../context.js';
import { json, now, parseJson, type Row } from '../db.js';
import { detectPrivacy } from '../domain/privacy.js';
import { buildTranslatePrompt, checkTranslation, LANGUAGES, parseTranslateResponse, splitSentences, TRANSLATION_ISSUE_LABELS, type TranslationIssue } from '../domain/translate.js';
import { badRequest, conflict, notFound, Problem } from '../problem.js';

/** Fingerabdruck der deutschen Quelle: ändert sich Frage oder Antwort, ist die Übersetzung veraltet */
export const faqHash = (question: string, answer: string) => createHash('sha256').update(`${question}\u0000${answer}`).digest('hex').slice(0, 32);

async function projectLangs(ctx: Ctx) {
  return parseJson<string[]>((await ctx.db.get('SELECT languages FROM projects WHERE id = ?', ctx.projectId))?.languages, []);
}

/** Deutscher FAQ-Eintrag des Projekts (nur deutsche Einträge sind Quelle einer Übersetzung) */
async function sourceOf(ctx: Ctx, faqId: string) {
  const f = await ctx.db.get('SELECT * FROM faq_entries WHERE id = ? AND project_id = ?', faqId, ctx.projectId);
  if (!f) throw notFound(`FAQ-Eintrag ${faqId}`);
  if (f.language !== 'de') throw badRequest('Übersetzt werden deutsche FAQ-Einträge; dieser Eintrag ist bereits in einer anderen Sprache verfasst.');
  return f;
}

async function targetLanguage(ctx: Ctx, lang: string) {
  if (!(await projectLangs(ctx)).includes(lang)) throw badRequest(`Sprache „${lang}“ ist keine Zielsprache des Projekts.`);
  return lang;
}

const dto = (source: Row, t: Row | undefined, language: string) => {
  const outdated = !!t && t.source_hash !== faqHash(String(source.question), String(source.answer));
  return {
    faqId: source.id as string, language, languageName: LANGUAGES[language] ?? language,
    question: (t?.question as string | undefined) ?? null, answer: (t?.answer as string | undefined) ?? null,
    status: (t?.status as 'draft' | 'approved' | undefined) ?? 'missing', mode: (t?.mode as string | undefined) ?? null, outdated,
    issues: parseJson<TranslationIssue[]>(t?.issues, []), updatedBy: (t?.updated_by as string | undefined) ?? null, updatedAt: (t?.updated_at as string | undefined) ?? null,
    approvedBy: (t?.approved_by as string | undefined) ?? null, approvedAt: (t?.approved_at as string | undefined) ?? null,
  };
};

/** Übersetzungsstand eines FAQ-Eintrags in allen Projektsprachen */
export async function listFaqTranslations(ctx: Ctx, faqId: string) {
  const source = await sourceOf(ctx, faqId);
  const rows = await ctx.db.all('SELECT * FROM faq_translations WHERE faq_id = ?', faqId);
  return (await projectLangs(ctx)).map((l) => dto(source, rows.find((r) => r.language === l), l));
}

/** Stand aller deutschen FAQ-Einträge je Sprache (Übersicht in den Stammdaten) */
export async function faqTranslationSummary(ctx: Ctx) {
  const langs = await projectLangs(ctx);
  const sources = await ctx.db.all("SELECT id, question, answer FROM faq_entries WHERE project_id = ? AND language = 'de'", ctx.projectId);
  const rows = await ctx.db.all('SELECT faq_id, language, status, source_hash FROM faq_translations WHERE project_id = ?', ctx.projectId);
  const out: Record<string, Record<string, 'missing' | 'draft' | 'approved' | 'outdated'>> = {};
  for (const s of sources) {
    const hash = faqHash(String(s.question), String(s.answer));
    out[s.id as string] = Object.fromEntries(langs.map((l) => {
      const t = rows.find((r) => r.faq_id === s.id && r.language === l);
      return [l, !t ? 'missing' : t.source_hash !== hash ? 'outdated' : (t.status as 'draft' | 'approved')];
    }));
  }
  return { languages: langs, entries: out };
}

function fields(input: { question?: unknown; answer?: unknown }) {
  const question = typeof input.question === 'string' ? input.question.trim().slice(0, 500) : '';
  const answer = typeof input.answer === 'string' ? input.answer.trim().slice(0, 10_000) : '';
  if (question.length < 3 || !answer) throw badRequest('Übersetzte Frage (mind. 3 Zeichen) und Antwort sind Pflicht.');
  return { question, answer };
}

async function upsert(ctx: Ctx, source: Row, lang: string, text: { question: string; answer: string }, mode: 'manual' | 'machine', issues: TranslationIssue[], user: User) {
  const hash = faqHash(String(source.question), String(source.answer));
  await ctx.db.run(
    `INSERT INTO faq_translations (faq_id, project_id, language, question, answer, status, mode, source_hash, issues, updated_by, updated_at)
     VALUES (?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?)
     ON CONFLICT (faq_id, language) DO UPDATE SET question = excluded.question, answer = excluded.answer, status = 'draft', mode = excluded.mode,
       source_hash = excluded.source_hash, issues = excluded.issues, updated_by = excluded.updated_by, updated_at = excluded.updated_at, approved_by = NULL, approved_at = NULL`,
    source.id, ctx.projectId, lang, text.question, text.answer, mode, hash, json(issues), user.id, now(),
  );
}

/** Übersetzung speichern (Bearbeitungsrecht): immer als Entwurf – jede Änderung braucht eine neue Freigabe */
export async function saveFaqTranslation(ctx: Ctx, faqId: string, lang: string, input: { question?: unknown; answer?: unknown }, user: User) {
  const source = await sourceOf(ctx, faqId);
  await targetLanguage(ctx, lang);
  const text = fields(input);
  const issues = [...new Set([...checkTranslation(String(source.question), text.question), ...checkTranslation(String(source.answer), text.answer)])];
  await ctx.db.tx(async () => {
    await upsert(ctx, source, lang, text, 'manual', issues, user);
    await audit(ctx, user.id, 'faq.translation_saved', 'faq', faqId, { language: lang });
  });
  return dto(source, await ctx.db.get('SELECT * FROM faq_translations WHERE faq_id = ? AND language = ?', faqId, lang), lang);
}

/** KI-Vorschlag (Bearbeitungsrecht): Frage und Antwort satzweise übersetzt, als Entwurf gespeichert und geprüft */
export async function machineFaqTranslation(ctx: Ctx, faqId: string, lang: string, user: User) {
  const provider = ctx.llm;
  if (!provider) throw new Problem(503, 'Service Unavailable', 'KI-Dienst ist nicht eingerichtet (LLM_PROVIDER).');
  const source = await sourceOf(ctx, faqId);
  await targetLanguage(ctx, lang);
  const q = String(source.question);
  const a = String(source.answer);
  // keine personenbezogenen Daten an externe Dienste (ADR-013)
  if (provider.external && detectPrivacy(`${q}\n${a}`).length) throw badRequest('Der Eintrag enthält personenbezogene Daten und wird nicht an den externen KI-Dienst gesendet.');
  const terms = (await ctx.db.all("SELECT preferred FROM terminology_terms WHERE project_id = ? AND status = 'active'", ctx.projectId)).map((x) => ({ preferred: String(x.preferred) }));
  const run = async (text: string, kind: string) => {
    const out = parseTranslateResponse((await provider.complete(buildTranslatePrompt({ language: lang, kind, sentences: splitSentences(text, kind), terms }))).text);
    const joined = out.map((s) => s.text).filter(Boolean).join(/^\s*(\d+\.|[-*])\s+/m.test(text) ? '\n' : ' ');
    return { text: joined, issues: checkTranslation(text, joined, out) };
  };
  let tq: Awaited<ReturnType<typeof run>>;
  let ta: Awaited<ReturnType<typeof run>>;
  try {
    tq = await run(q, 'paragraph');
    ta = await run(a, /^\s*(\d+\.|[-*])\s+/m.test(a) ? 'list' : 'paragraph');
  } catch (e) {
    throw new Problem(502, 'Bad Gateway', `KI-Übersetzung fehlgeschlagen: ${(e as Error).message}`);
  }
  if (!tq.text || !ta.text) throw new Problem(502, 'Bad Gateway', 'Die KI hat keine Übersetzung geliefert.');
  await ctx.db.tx(async () => {
    await upsert(ctx, source, lang, { question: tq.text.slice(0, 500), answer: ta.text.slice(0, 10_000) }, 'machine', [...new Set([...tq.issues, ...ta.issues])], user);
    await audit(ctx, user.id, 'faq.translation_machine', 'faq', faqId, { language: lang, provider: provider.id, model: provider.model });
  });
  return dto(source, await ctx.db.get('SELECT * FROM faq_translations WHERE faq_id = ? AND language = ?', faqId, lang), lang);
}

/** Freigeben (Freigaberecht): nur ein aktueller Entwurf – eine veraltete Übersetzung muss erst überarbeitet werden */
export async function approveFaqTranslation(ctx: Ctx, faqId: string, lang: string, user: User) {
  const source = await sourceOf(ctx, faqId);
  const t = await ctx.db.get('SELECT * FROM faq_translations WHERE faq_id = ? AND language = ?', faqId, lang);
  if (!t) throw notFound(`Übersetzung ${lang} zu FAQ ${faqId}`);
  if (t.status === 'approved') throw conflict('Die Übersetzung ist bereits freigegeben.');
  if (t.source_hash !== faqHash(String(source.question), String(source.answer))) throw conflict('Die deutsche Frage wurde seit der Übersetzung geändert – bitte zuerst die Übersetzung überarbeiten.');
  // wie bei Kapitelübersetzungen: nur ohne offene Prüfbefunde (geänderte Zahlen, Struktur, nicht abgedeckte Sätze …)
  const issues = parseJson<TranslationIssue[]>(t.issues, []);
  if (issues.length) throw conflict(`Freigabe nicht möglich: ${issues.map((i) => TRANSLATION_ISSUE_LABELS[i] ?? i).join('; ')}. Bitte die Übersetzung korrigieren.`, { issues });
  // Vier-Augen-Prinzip: wer den Entwurf zuletzt bearbeitet (oder als KI-Vorschlag angelegt) hat, gibt ihn nicht frei
  if (t.updated_by === user.id) throw conflict('Vier-Augen-Prinzip: Die Übersetzung muss von einer anderen Person freigegeben werden, als sie zuletzt bearbeitet hat.');
  await ctx.db.tx(async () => {
    const res = await ctx.db.run("UPDATE faq_translations SET status = 'approved', approved_by = ?, approved_at = ? WHERE faq_id = ? AND language = ? AND status = 'draft' AND updated_at = ?",
      user.id, now(), faqId, lang, t.updated_at);
    if (!res.changes) throw conflict('Die Übersetzung wurde zwischenzeitlich geändert.');
    await audit(ctx, user.id, 'faq.translation_approved', 'faq', faqId, { language: lang });
  });
  return dto(source, await ctx.db.get('SELECT * FROM faq_translations WHERE faq_id = ? AND language = ?', faqId, lang), lang);
}

export async function deleteFaqTranslation(ctx: Ctx, faqId: string, lang: string, user: User) {
  await sourceOf(ctx, faqId);
  const res = await ctx.db.run('DELETE FROM faq_translations WHERE faq_id = ? AND language = ?', faqId, lang);
  if (!res.changes) throw notFound(`Übersetzung ${lang} zu FAQ ${faqId}`);
  await audit(ctx, user.id, 'faq.translation_deleted', 'faq', faqId, { language: lang });
}

export interface ReaderFaq {
  id: string; question: string; answer: string; language: string; translated: boolean;
  /** deutsche Quelle (bei deutschen und übersetzten Einträgen) – für sprachunabhängige Ähnlichkeit */
  source: { question: string; answer: string } | null;
}

/**
 * Veröffentlichte FAQ für Leser in einer Sprache: deutsche Einträge in der freigegebenen, aktuellen Übersetzung (sonst deutsch,
 * `translated: false`), dazu direkt in dieser Sprache verfasste Einträge – in der gepflegten Reihenfolge.
 */
export async function readerFaqEntries(ctx: Ctx, lang: string): Promise<ReaderFaq[]> {
  const rows = await ctx.db.all("SELECT id, question, answer, language FROM faq_entries WHERE project_id = ? AND status = 'published' AND language IN ('de', ?) ORDER BY position, created_at", ctx.projectId, lang);
  const src = (r: Row) => ({ question: String(r.question), answer: String(r.answer) });
  if (lang === 'de') return rows.map((r) => ({ id: r.id as string, ...src(r), language: 'de', translated: true, source: src(r) }));
  const tr = await ctx.db.all("SELECT faq_id, question, answer, source_hash FROM faq_translations WHERE project_id = ? AND language = ? AND status = 'approved'", ctx.projectId, lang);
  const byId = new Map(tr.map((t) => [t.faq_id as string, t]));
  return rows.map((r) => {
    if (r.language === lang) return { id: r.id as string, ...src(r), language: lang, translated: true, source: null };
    const t = byId.get(r.id as string);
    if (t && t.source_hash === faqHash(String(r.question), String(r.answer))) return { id: r.id as string, question: String(t.question), answer: String(t.answer), language: lang, translated: true, source: src(r) };
    return { id: r.id as string, ...src(r), language: 'de', translated: false, source: src(r) };
  });
}
