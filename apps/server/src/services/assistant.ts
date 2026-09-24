// Handbuch-Assistent (ADR-026): Fragen an das freigegebene Handbuch mit Quellenangabe je Satz.
// Grundlage sind ausschließlich Absätze freigegebener Kapitelversionen bzw. freigegebener Übersetzungen.
import { audit, getSettings, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson } from '../db.js';
import { ASSISTANT_PROMPT_VERSION, buildAssistantPrompt, extractiveAnswer, keywordScore, parseAssistantResponse, type Passage } from '../domain/assistant.js';
import { detectPrivacy } from '../domain/privacy.js';
import { CHAPTER_SECTIONS, DIVISION_CODES, ROLE_CODES } from '../domain/reference.js';
import { checkSentences } from '../domain/rewrite.js';
import { sha256 } from '../domain/similarity.js';
import { SECTION_TITLES } from '../domain/translate.js';
import { decodeVector, dot, encodeVector } from '../embeddings.js';
import { LlmError } from '../llm.js';
import { badRequest, notFound, Problem, unprocessable } from '../problem.js';

interface HandbookPassage {
  blockId: string;
  chapterId: string;
  chapter: string;
  versionNo: number;
  section: string;
  sectionTitle: string;
  text: string;
}

/** Absätze der freigegebenen Kapitelstände (Sprache, Rolle, Sparte gefiltert) */
async function approvedPassages(ctx: Ctx, opts: { language: string; role?: string; division?: string }): Promise<HandbookPassage[]> {
  const { db } = ctx;
  const versions = await db.all(
    `SELECT v.id, v.chapter_id, v.version_no, c.title FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id
     WHERE c.project_id = ? AND v.status = 'approved' ORDER BY c.position, c.title`,
    ctx.projectId,
  );
  const sectionTitle = new Map(CHAPTER_SECTIONS.map((s) => [s.code as string, s.title as string]));
  const out: HandbookPassage[] = [];
  for (const v of versions) {
    let title = v.title as string;
    let translated: Map<string, string> | null = null;
    if (opts.language !== 'de') {
      const t = await db.get("SELECT id, title FROM translations WHERE chapter_version_id = ? AND language = ? AND status = 'approved'", v.id, opts.language);
      if (!t) continue; // nur freigegebene Übersetzungen
      title = t.title ?? title;
      translated = new Map((await db.all('SELECT block_id, text FROM translation_blocks WHERE translation_id = ? AND text IS NOT NULL', t.id)).map((r) => [r.block_id, r.text]));
    }
    const blocks = await db.all(
      "SELECT id, section_code, text FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL AND kind <> 'gap' ORDER BY position", v.id,
    );
    const roles = await db.all<{ block_id: string; code: string }>('SELECT r.block_id, r.role_code AS code FROM content_block_roles r JOIN content_blocks b ON b.id = r.block_id WHERE b.chapter_version_id = ?', v.id);
    const divisions = await db.all<{ block_id: string; code: string }>('SELECT d.block_id, d.division_code AS code FROM content_block_divisions d JOIN content_blocks b ON b.id = d.block_id WHERE b.chapter_version_id = ?', v.id);
    // ohne Zuordnung = allgemein gültig; „all“ gilt für jede Rolle/Sparte
    const fits = (rows: { block_id: string; code: string }[], blockId: string, want?: string) => {
      if (!want) return true;
      const codes = rows.filter((r) => r.block_id === blockId).map((r) => r.code);
      return !codes.length || codes.includes('all') || codes.includes(want);
    };
    for (const b of blocks) {
      if (!fits(roles, b.id, opts.role) || !fits(divisions, b.id, opts.division)) continue;
      const text = translated ? translated.get(b.id) : (b.text as string);
      if (!text?.trim()) continue;
      out.push({
        blockId: b.id, chapterId: v.chapter_id, chapter: title, versionNo: v.version_no, section: b.section_code,
        sectionTitle: (opts.language !== 'de' && SECTION_TITLES[opts.language]?.[b.section_code]) || sectionTitle.get(b.section_code) || b.section_code, text,
      });
    }
  }
  return out;
}

/** Vektoren je Text-Hash (dauerhaft zwischengespeichert, modellbezogen) */
async function embedTexts(ctx: Ctx, texts: string[]): Promise<Float32Array[]> {
  const model = ctx.embeddings.model;
  const hashes = texts.map((t) => sha256(t));
  const known = new Map<string, Float32Array>();
  const unique = [...new Set(hashes)];
  for (let i = 0; i < unique.length; i += 500) {
    const part = unique.slice(i, i + 500);
    for (const r of await ctx.db.all<{ text_hash: string; vector: string }>(
      `SELECT text_hash, vector FROM passage_embeddings WHERE model = ? AND text_hash IN (${part.map(() => '?').join(',')})`, model, ...part,
    )) known.set(r.text_hash, decodeVector(r.vector));
  }
  const missing = unique.filter((h) => !known.has(h));
  if (missing.length) {
    const textOf = new Map(hashes.map((h, i) => [h, texts[i]]));
    let vectors: Float32Array[];
    try {
      vectors = await ctx.embeddings.embed(missing.map((h) => textOf.get(h)!));
    } catch (e) {
      if (e instanceof LlmError) throw new Problem(502, 'Bad Gateway', e.message);
      throw e;
    }
    await ctx.db.tx(async () => {
      for (const [i, h] of missing.entries()) {
        known.set(h, vectors[i]);
        await ctx.db.run('INSERT INTO passage_embeddings (text_hash, model, vector, created_at) VALUES (?, ?, ?, ?) ON CONFLICT (text_hash, model) DO NOTHING', h, model, encodeVector(vectors[i]), now());
      }
    });
  }
  return hashes.map((h) => known.get(h)!);
}

export interface AskInput {
  question?: string;
  language?: string;
  role?: string;
  division?: string;
}

const MAX_PASSAGES = 6;

export async function ask(ctx: Ctx, input: AskInput, user: User) {
  const question = input.question?.trim() ?? '';
  if (question.length < 3 || question.length > 500) throw badRequest('Frage mit 3 bis 500 Zeichen erforderlich.');
  const project = await ctx.db.get<{ languages: string }>('SELECT languages FROM projects WHERE id = ?', ctx.projectId);
  const language = input.language ?? 'de';
  if (language !== 'de' && !parseJson<string[]>(project?.languages, []).includes(language)) throw badRequest(`Sprache „${language}“ ist keine Zielsprache des Projekts.`);
  if (input.role && !(ROLE_CODES as readonly string[]).includes(input.role)) throw badRequest(`Unbekannte Rolle „${input.role}“.`);
  if (input.division && !(DIVISION_CODES as readonly string[]).includes(input.division)) throw badRequest(`Unbekannte Sparte „${input.division}“.`);
  // Datenschutz: personenbezogene Daten in der Frage nicht an externe Dienste
  if ((ctx.embeddings.external || ctx.llm?.external) && detectPrivacy(question).length) {
    throw unprocessable('Die Frage enthält mögliche personenbezogene Daten und wird nicht an externe Dienste übertragen.');
  }

  // Passagen mit personenbezogenen Mustern nie an externe Dienste (wie beim semantischen Index, ADR-017)
  const sensitive = (p: HandbookPassage) => detectPrivacy(p.text).length > 0;
  const all = (await approvedPassages(ctx, { language, role: input.role, division: input.division })).filter((p) => !(ctx.embeddings.external && sensitive(p)));
  let ranked: (HandbookPassage & { score: number })[] = [];
  if (all.length) {
    const [qv, ...pv] = await embedTexts(ctx, [question, ...all.map((p) => `${p.chapter} – ${p.sectionTitle}: ${p.text}`)]);
    // hybride Bewertung: Bedeutung (Embedding) und gemeinsame Begriffe (robust auch mit lokalen Hash-Vektoren)
    ranked = all.map((p, i) => {
      const kw = keywordScore(question, `${p.chapter} ${p.sectionTitle} ${p.text}`);
      return { ...p, score: 0.5 * Math.max(0, dot(qv, pv[i])) + 0.5 * kw, kw };
    }).filter((p) => p.kw > 0 || p.score >= 0.3).sort((a, b) => b.score - a.score).slice(0, MAX_PASSAGES);
  }
  const passages: Passage[] = ranked.map((p, i) => ({ label: `P${i + 1}`, text: p.text, chapter: p.chapter, section: p.sectionTitle }));

  let mode: 'llm' | 'extractive' | 'none' = 'none';
  let sentences: { text: string; sources: string[] }[] = [];
  let dropped = 0;
  let notice: string | null = null;
  const forLlm = ctx.llm?.external ? passages.filter((_, i) => !sensitive(ranked[i])) : passages;
  if (forLlm.length && ctx.llm) {
    const prompt = buildAssistantPrompt(question, forLlm, language);
    try {
      const res = await ctx.llm.complete(prompt);
      const parsed = parseAssistantResponse(res.text);
      // jeder Satz muss durch die zitierten Passagen gedeckt sein (dieselbe Prüfung wie bei der KI-Umformulierung)
      const checked = checkSentences(parsed, forLlm.map((p) => ({ label: p.label, snippetId: p.label, seq: 0, text: p.text })), { minSupport: (await getSettings(ctx.db)).rewrite.minSupport });
      sentences = checked.filter((c) => !c.issues.length).map((c) => ({ text: c.text, sources: c.sourceLabels }));
      dropped = checked.length - sentences.length;
      mode = 'llm';
      if (!parsed.length) notice = 'Das freigegebene Handbuch enthält dazu keine eindeutige Aussage.';
      else if (!sentences.length) notice = 'Die KI-Antwort war nicht durch das Handbuch belegt – es folgen die passenden Handbuchstellen.';
    } catch (e) {
      notice = `KI-Dienst nicht verfügbar (${(e as Error).message}) – es folgen die passenden Handbuchstellen.`;
    }
  }
  if (passages.length && !sentences.length && !(mode === 'llm' && notice?.startsWith('Das freigegebene'))) {
    sentences = extractiveAnswer(question, passages);
    mode = sentences.length ? 'extractive' : 'none';
  }
  if (!sentences.length) notice ??= 'Das freigegebene Handbuch enthält dazu keine Aussage.';

  // nur tatsächlich zitierte Passagen als Quellen (in Reihenfolge der ersten Nennung)
  const citedLabels = [...new Set(sentences.flatMap((s) => s.sources))];
  const sources = citedLabels.map((label, i) => {
    const p = ranked[passages.findIndex((x) => x.label === label)];
    return { n: i + 1, blockId: p.blockId, chapterId: p.chapterId, chapter: p.chapter, versionNo: p.versionNo, section: p.section, sectionTitle: p.sectionTitle, text: p.text, link: `/werkstatt/${p.chapterId}` };
  });
  const number = new Map(citedLabels.map((l, i) => [l, i + 1]));
  const answer = sentences.map((s) => ({ text: s.text, sources: s.sources.map((l) => number.get(l)!).filter(Boolean) }));
  const id = newId('ask');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO assistant_log (id, project_id, user_id, question, language, role_code, division_code, mode, answer, source_blocks, answered, provider, model, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, ctx.projectId, user.id, question, language, input.role ?? null, input.division ?? null, mode, json(answer), json(sources.map((s) => s.blockId)),
      answer.length ? 1 : 0, mode === 'llm' ? ctx.llm!.id : null, mode === 'llm' ? ctx.llm!.model : null, now(),
    );
    if (mode === 'llm') {
      await audit(ctx, user.id, 'assistant.asked', 'assistant_answer', id, { provider: ctx.llm!.id, model: ctx.llm!.model, promptVersion: ASSISTANT_PROMPT_VERSION, passages: ranked.map((p) => p.blockId), external: ctx.llm!.external });
    }
  });
  return { id, question, language, mode, answer, sources, notice, dropped, candidates: passages.length };
}

export async function rateAnswer(ctx: Ctx, id: string, input: { helpful?: boolean; comment?: string }, user: User) {
  const row = await ctx.db.get('SELECT user_id FROM assistant_log WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!row) throw notFound(`Antwort ${id}`);
  if (row.user_id !== user.id) throw badRequest('Nur die fragende Person bewertet ihre Antwort.');
  if (typeof input.helpful !== 'boolean') throw badRequest('helpful (true/false) erforderlich.');
  await ctx.db.run('UPDATE assistant_log SET rating = ?, feedback = ? WHERE id = ?', input.helpful ? 1 : -1, input.comment?.trim().slice(0, 1000) || null, id);
  return { id, rating: input.helpful ? 1 : -1 };
}

/** Wissenslücken: Fragen ohne Antwort oder mit negativer Bewertung (für die Redaktion) */
export async function openQuestions(ctx: Ctx, limit = 50) {
  const rows = await ctx.db.all(
    `SELECT id, question, language, role_code, division_code, mode, answered, rating, feedback, created_at FROM assistant_log
     WHERE project_id = ? AND (answered = 0 OR rating = -1) ORDER BY created_at DESC LIMIT ${Math.min(Math.max(Math.trunc(limit) || 50, 1), 200)}`,
    ctx.projectId,
  );
  const stats = await ctx.db.get<{ n: number; answered: number; helpful: number; unhelpful: number }>(
    `SELECT COUNT(*) AS n, SUM(answered) AS answered, SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS helpful, SUM(CASE WHEN rating = -1 THEN 1 ELSE 0 END) AS unhelpful
     FROM assistant_log WHERE project_id = ?`, ctx.projectId,
  );
  return {
    stats: { questions: Number(stats?.n ?? 0), answered: Number(stats?.answered ?? 0), helpful: Number(stats?.helpful ?? 0), unhelpful: Number(stats?.unhelpful ?? 0) },
    items: rows.map((r) => ({
      id: r.id, question: r.question, language: r.language, role: r.role_code ?? null, division: r.division_code ?? null, mode: r.mode,
      answered: !!r.answered, rating: r.rating ?? null, feedback: r.feedback ?? null, createdAt: r.created_at,
    })),
  };
}
