// Leseransicht: Suche und Glossar (ADR-066), „Siehe auch“ und FAQ (ADR-069), Lesezeichen und Verlauf (ADR-070),
// Sprachen (ADR-071), Verweise in Druck und Online-Hilfe (ADR-072), Notizen an Lesezeichen (ADR-073).
import { audit, type Ctx, type User } from '../context.js';
import { now, parseJson, type Row } from '../db.js';
import { LANGUAGES, SECTION_TITLES } from '../domain/translate.js';
import { badRequest, notFound } from '../problem.js';
import { getChapterVersion } from './chapters.js';
import { assertIdsInProject } from './projects.js';
import { projectLanguages } from './translations.js';
import { variantChapters } from './variants.js';

const HIDDEN_SECTIONS = new Set(['status']);
const lower = (s: string) => s.toLocaleLowerCase('de');
/** Markdown-Zeichen für Treffer und Ausschnitt entfernen (Fett, Code, Bilder, Links) */
const plain = (s: string) => s.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*|`|^\s*(?:\d+[.)]|[-*•])\s+/gm, '').replace(/\s+/g, ' ').trim();

/** Sprache prüfen: „de“ oder eine Projektsprache */
export async function readerLanguage(ctx: Ctx, lang: unknown) {
  const code = typeof lang === 'string' && lang ? lang : 'de';
  if (code !== 'de' && !(await projectLanguages(ctx)).includes(code)) throw badRequest(`lang: „${code}“ ist keine Sprache dieses Projekts.`);
  return code;
}

/** Freigegebene Übersetzungen der genannten deutschen Fassungen: Titel und Blocktexte je Fassung */
async function approvedTranslations(ctx: Ctx, versionIds: string[], lang: string) {
  const out = new Map<string, { title: string | null; blocks: Map<string, string> }>();
  if (lang === 'de' || !versionIds.length) return out;
  for (let i = 0; i < versionIds.length; i += 500) {
    const part = versionIds.slice(i, i + 500);
    const rows = await ctx.db.all(
      `SELECT t.chapter_version_id, t.title, b.block_id, b.text FROM translations t LEFT JOIN translation_blocks b ON b.translation_id = t.id
       WHERE t.language = ? AND t.status = 'approved' AND t.chapter_version_id IN (${part.map(() => '?').join(', ')})`, lang, ...part,
    );
    for (const r of rows) {
      const e = out.get(r.chapter_version_id as string) ?? { title: (r.title as string | null) ?? null, blocks: new Map<string, string>() };
      if (r.block_id && r.text) e.blocks.set(r.block_id as string, String(r.text));
      out.set(r.chapter_version_id as string, e);
    }
  }
  return out;
}

/**
 * Gezeigte Fassung je Kapitel (freigegeben, mit `drafts` die neueste; oder feste Fassungen, z. B. eines Releases) und
 * deren Klartext je Block – in der Sprache `lang`, wo eine freigegebene Übersetzung vorliegt, sonst deutsch.
 */
async function loadShown(ctx: Ctx, drafts: boolean, opts: { lang?: string; versionIds?: string[] } = {}) {
  const lang = opts.lang ?? 'de';
  const versions = opts.versionIds
    ? (opts.versionIds.length ? await ctx.db.all(
      `SELECT v.chapter_id, v.id, v.title, v.status, v.version_no FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id
       WHERE c.project_id = ? AND v.id IN (${opts.versionIds.map(() => '?').join(', ')}) ORDER BY c.position, c.title`, ctx.projectId, ...opts.versionIds,
    ) : [])
    : await ctx.db.all(
      `SELECT v.chapter_id, v.id, v.title, v.status, v.version_no FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id
       WHERE c.project_id = ? AND c.outline_family_id IS NULL ${drafts ? '' : "AND v.status = 'approved'"} ORDER BY c.position, c.title, v.version_no DESC`, ctx.projectId,
    );
  const shown = new Map<string, Row>();
  for (const v of versions) if (!shown.has(v.chapter_id as string)) shown.set(v.chapter_id as string, { ...v, source_title: v.title });
  const ids = [...shown.values()].map((v) => v.id as string);
  const tr = await approvedTranslations(ctx, ids, lang);
  const translated = new Set<string>();
  for (const [chapterId, v] of shown) {
    const t = tr.get(v.id as string);
    if (!t) continue;
    translated.add(chapterId);
    if (t.title) v.title = t.title;
  }
  const blocksOf = new Map<string, string[]>();
  const sourceBlocksOf = new Map<string, string[]>(); // deutsche Quelle: für sprachunabhängige Ähnlichkeit
  for (let i = 0; i < ids.length; i += 500) {
    const part = ids.slice(i, i + 500);
    const rows = await ctx.db.all(
      `SELECT id, chapter_version_id, section_code, text FROM content_blocks WHERE chapter_version_id IN (${part.map(() => '?').join(', ')}) AND deleted_at IS NULL AND kind <> 'gap'
       ORDER BY chapter_version_id, section_code, position`, ...part,
    );
    for (const b of rows) {
      if (HIDDEN_SECTIONS.has(b.section_code as string)) continue;
      const list = blocksOf.get(b.chapter_version_id as string) ?? [];
      list.push(plain(tr.get(b.chapter_version_id as string)?.blocks.get(b.id as string) ?? String(b.text)));
      blocksOf.set(b.chapter_version_id as string, list);
      const src = sourceBlocksOf.get(b.chapter_version_id as string) ?? [];
      src.push(plain(String(b.text)));
      sourceBlocksOf.set(b.chapter_version_id as string, src);
    }
  }
  return { shown, blocksOf, sourceBlocksOf, translated, lang };
}

/** Titel der gezeigten Fassungen in einer Sprache und welche Kapitel übersetzt vorliegen (Inhaltsverzeichnis, Druck) */
export async function readerTranslations(ctx: Ctx, drafts: boolean, lang: unknown) {
  const code = await readerLanguage(ctx, lang);
  const { shown, translated } = await loadShown(ctx, drafts, { lang: code });
  return { language: code, titles: Object.fromEntries([...shown].map(([id, v]) => [id, String(v.title)])), translated: [...translated] };
}

/**
 * Kapitelfassung für die Leseransicht in einer Sprache: gleiche Struktur wie die deutsche Fassung (Rollen, Blockarten),
 * Texte aus der freigegebenen Übersetzung dieser Fassung. Fehlt sie, deutsch mit Hinweis `missing` bzw. `outdated`
 * (eine Übersetzung gibt es nur zu einer älteren Fassung).
 */
export async function readerVersion(ctx: Ctx, versionId: string, lang: unknown) {
  const code = await readerLanguage(ctx, lang);
  await assertIdsInProject(ctx, 'versionId', [versionId]);
  const v = await getChapterVersion(ctx, versionId);
  if (code === 'de') return { ...v, language: 'de', requestedLanguage: 'de', fallback: null as null | 'missing' | 'outdated', untranslatedBlocks: 0 };
  const tr = (await approvedTranslations(ctx, [versionId], code)).get(versionId);
  if (!tr) {
    const older = await ctx.db.get("SELECT 1 FROM translations WHERE chapter_id = ? AND language = ? AND status = 'approved'", v.chapterId, code);
    return { ...v, language: 'de', requestedLanguage: code, fallback: (older ? 'outdated' : 'missing') as 'missing' | 'outdated', untranslatedBlocks: 0 };
  }
  let untranslated = 0;
  const sections = v.sections.map((s) => ({
    ...s, title: SECTION_TITLES[code]?.[s.code] ?? s.title,
    blocks: s.blocks.map((b: any) => {
      const text = tr.blocks.get(b.id);
      if (!text && b.kind !== 'gap' && s.code !== 'status') untranslated++;
      return text ? { ...b, text } : { ...b, untranslated: true };
    }),
  }));
  return { ...v, title: tr.title ?? v.title, sections, language: code, requestedLanguage: code, fallback: null, untranslatedBlocks: untranslated };
}

/** Sprachen für die Leseransicht: Deutsch und die Projektsprachen mit Anzahl übersetzter (freigegebener) Kapitel */
export async function readerLanguages(ctx: Ctx) {
  const langs = await projectLanguages(ctx);
  const counts = new Map((await ctx.db.all(
    `SELECT t.language, COUNT(DISTINCT t.chapter_id) AS n FROM translations t JOIN generated_chapter_versions v ON v.id = t.chapter_version_id
     WHERE t.project_id = ? AND t.status = 'approved' AND v.status = 'approved' GROUP BY t.language`, ctx.projectId,
  )).map((r) => [r.language as string, Number(r.n)]));
  return [{ code: 'de', name: LANGUAGES.de ?? 'Deutsch', chapters: null as number | null }, ...langs.map((c) => ({ code: c, name: LANGUAGES[c] ?? c, chapters: counts.get(c) ?? 0 }))];
}

/** Kapitel, deren Titel oder Text alle Suchwörter enthält – freigegebene Fassung, mit `drafts` die neueste */
export async function readerSearch(ctx: Ctx, q: unknown, drafts: boolean, lang?: unknown) {
  const query = typeof q === 'string' ? q.trim().slice(0, 100) : '';
  const words = [...new Set(lower(query).split(/\s+/).filter((w) => w.length >= 2))];
  if (!words.length) throw badRequest('q: mindestens ein Suchwort mit zwei Zeichen.');
  const { shown, blocksOf, translated } = await loadShown(ctx, drafts, { lang: await readerLanguage(ctx, lang) });
  const results: { chapterId: string; title: string; versionId: string; draft: boolean; translated: boolean; hits: number; snippet: string }[] = [];
  for (const [chapterId, v] of shown) {
    const blocks = blocksOf.get(v.id as string) ?? [];
    const title = String(v.title);
    const all = lower([title, ...blocks].join(' \n '));
    if (!words.every((w) => all.includes(w))) continue;
    const hits = words.reduce((n, w) => n + all.split(w).length - 1, 0);
    // Ausschnitt um den ersten Treffer im Text (nicht im Titel)
    const block = blocks.find((b) => words.some((w) => lower(b).includes(w))) ?? blocks[0] ?? '';
    const at = Math.max(0, Math.min(...words.map((w) => lower(block).indexOf(w)).filter((i) => i >= 0), block.length) - 60);
    const snippet = `${at > 0 ? '… ' : ''}${block.slice(at, at + 180).trim()}${at + 180 < block.length ? ' …' : ''}`;
    results.push({ chapterId, title, versionId: v.id as string, draft: v.status !== 'approved', translated: translated.has(chapterId), hits: hits + (words.some((w) => lower(title).includes(w)) ? 100 : 0), snippet });
  }
  results.sort((a, b) => b.hits - a.hits);
  return { q: query, words, total: results.length, results: results.slice(0, 30).map((r) => ({ ...r, hits: r.hits >= 100 ? r.hits - 100 : r.hits })) };
}

/** Begriffe mit Erklärung: Terminologie (bevorzugter Begriff mit Definition) und Abkürzungen – längste zuerst */
export async function readerGlossary(ctx: Ctx, lang?: unknown) {
  const code = await readerLanguage(ctx, lang);
  const rows = await ctx.db.all("SELECT preferred, definition, translations FROM terminology_terms WHERE project_id = ? AND status = 'active'", ctx.projectId);
  // je Sprache (ADR-071): deutsch aus Begriff und Definition, sonst aus der hinterlegten Übersetzung des Begriffs
  const terms = rows.map((r) => {
    if (code === 'de') return { term: String(r.preferred).trim(), text: String(r.definition ?? '').trim() };
    const t = parseJson<Record<string, { term?: string; definition?: string }>>(r.translations, {})[code];
    return { term: String(t?.term ?? '').trim(), text: String(t?.definition ?? '').trim() };
  }).filter((t) => t.term && t.text);
  const abbr = await ctx.db.all('SELECT abbreviation, expansion, description FROM abbreviations WHERE project_id = ?', ctx.projectId);
  const seen = new Set<string>();
  const entries = [
    ...terms.map((t) => ({ term: t.term, text: t.text, kind: 'term' as const })),
    ...abbr.map((a) => ({ term: String(a.abbreviation).trim(), text: `${String(a.expansion).trim()}${a.description ? ` – ${String(a.description).trim()}` : ''}`, kind: 'abbreviation' as const })),
  ].filter((e) => e.term.length >= 2 && !seen.has(lower(e.term)) && seen.add(lower(e.term)));
  return entries.sort((a, b) => b.term.length - a.term.length || a.term.localeCompare(b.term, 'de'));
}

// ---------- Verwandte Kapitel und passende FAQ (ADR-069) ----------

const STOP = new Set(('aber alle allem allen aller alles also auch auf aus bei beim bereits bis bitte dabei damit dann dass dem den denen der des dessen die dies diese diesem diesen dieser dieses doch dort durch eine einem einen einer eines etwa für gibt hat hier ihre ihrem ihren ihrer ihres immer ist jede jedem jeden jeder jedes kann keine können mehr mit muss nach nicht noch nur oder ohne schon sehr sich sie sind so über um und uns unter vom von vor wann was weil wenn werden wie wird wir wird zum zur zwischen sowie mittels anleitung dieser benötigen klicken öffnen wählen geben sollen oder werden'.split(' ')));
/** Wortstämme (grob): Kleinschreibung, ab 4 Buchstaben, ohne Füllwörter, häufige Endungen gekürzt */
const terms = (text: string) => lower(text).split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 4 && !STOP.has(w))
  .map((w) => w.replace(/(ungen|ung|en|er|es|e|n|s)$/u, '')).filter((w) => w.length >= 4);
type Vec = Map<string, number>;
const tf = (parts: [string, number][]) => {
  const v: Vec = new Map();
  for (const [text, weight] of parts) for (const t of terms(text)) v.set(t, (v.get(t) ?? 0) + weight);
  return v;
};
function cosine(a: Vec, b: Vec, idf: Map<string, number>) {
  let dot = 0; let na = 0; let nb = 0;
  for (const [t, x] of a) { const w = x * (idf.get(t) ?? 0); na += w * w; const y = b.get(t); if (y) dot += w * y * (idf.get(t) ?? 0); }
  for (const [t, y] of b) { const w = y * (idf.get(t) ?? 0); nb += w * w; }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}
const MIN_RELATED = 0.08;
const MIN_FAQ = 0.1;
const MAX_RELATED = 5;

type Related = {
  chapterId: string;
  manual: { chapterId: string; title: string }[];
  automatic: { chapterId: string; title: string; score: number }[];
  hidden: { chapterId: string; title: string }[];
  faq: { id: string; question: string; answer: string; score: number }[];
};

/**
 * „Siehe auch“ und passende FAQ für alle gezeigten Kapitel (einmal berechnet: Leseransicht, Druck, Online-Hilfe).
 * Manuelle Verweise zuerst, dann ähnliche Kapitel (ausgeblendete nicht); FAQ in der Lesesprache, sonst deutsch.
 */
async function relatedAll(ctx: Ctx, drafts: boolean, opts: { lang?: string; versionIds?: string[] } = {}) {
  const { shown, blocksOf, sourceBlocksOf, lang } = await loadShown(ctx, drafts, opts);
  const titleOf = (id: string) => String(shown.get(id)?.title ?? '');
  const links = await ctx.db.all('SELECT l.chapter_id, l.target_chapter_id, l.kind, c.title FROM chapter_links l JOIN chapters c ON c.id = l.target_chapter_id WHERE l.project_id = ? ORDER BY l.position, c.title', ctx.projectId);
  let faqRows = await ctx.db.all("SELECT id, question, answer FROM faq_entries WHERE project_id = ? AND status = 'published' AND language = ? ORDER BY position", ctx.projectId, lang);
  const faqLang = faqRows.length ? lang : 'de';
  if (!faqRows.length && lang !== 'de') faqRows = await ctx.db.all("SELECT id, question, answer FROM faq_entries WHERE project_id = ? AND status = 'published' AND language = 'de' ORDER BY position", ctx.projectId);
  const vecOf = (title: unknown, blocks: string[] | undefined) => tf([[String(title), 3], ...(blocks ?? []).map((t): [string, number] => [t, 1])]);
  // Kapitel untereinander: immer über die deutsche Quelle – „Siehe auch“ ist in jeder Sprache gleich, auch wenn nur ein Teil übersetzt ist
  const docs = new Map<string, Vec>([...shown].map(([id, v]) => [id, vecOf(v.source_title, sourceBlocksOf.get(v.id as string))]));
  // FAQ: in der Sprache der Fragen (übersetzte Texte, wo vorhanden)
  const faqSide = faqLang === 'de' ? docs : new Map<string, Vec>([...shown].map(([id, v]) => [id, vecOf(v.title, blocksOf.get(v.id as string))]));
  const faqDocs = faqRows.map((f) => ({ f, vec: tf([[String(f.question), 2], [String(f.answer), 1]]) }));
  // Seltenheit eines Wortes über Kapitel und FAQ: häufige Wörter tragen wenig zur Ähnlichkeit bei
  const idfOf = (vecs: Vec[]) => {
    const df = new Map<string, number>();
    for (const vec of vecs) for (const t of vec.keys()) df.set(t, (df.get(t) ?? 0) + 1);
    return new Map([...df].map(([t, d]) => [t, Math.log(1 + vecs.length / d)]));
  };
  const idf = idfOf([...docs.values(), ...(faqSide === docs ? faqDocs.map((d) => d.vec) : [])]);
  const faqIdf = faqSide === docs ? idf : idfOf([...faqSide.values(), ...faqDocs.map((d) => d.vec)]);
  const of = (chapterId: string): Related => {
    const mine = links.filter((l) => l.chapter_id === chapterId);
    const manualIds = mine.filter((l) => l.kind === 'manual').map((l) => l.target_chapter_id as string);
    const hiddenIds = new Set(mine.filter((l) => l.kind === 'hidden').map((l) => l.target_chapter_id as string));
    const hidden = mine.filter((l) => l.kind === 'hidden').map((l) => ({ chapterId: l.target_chapter_id as string, title: String(l.title) }));
    // nur Kapitel, die die Leserin auch öffnen kann (gezeigte Fassung vorhanden)
    const manual = manualIds.filter((id) => shown.has(id)).slice(0, MAX_RELATED).map((id) => ({ chapterId: id, title: titleOf(id) }));
    const me = docs.get(chapterId);
    if (!me) return { chapterId, manual, automatic: [], hidden, faq: [] };
    const automatic = [...docs].filter(([id]) => id !== chapterId && !manualIds.includes(id) && !hiddenIds.has(id))
      .map(([id, vec]) => ({ chapterId: id, title: titleOf(id), score: Math.round(cosine(me, vec, idf) * 100) / 100 }))
      .filter((r) => r.score >= MIN_RELATED).sort((a, b) => b.score - a.score).slice(0, Math.max(0, MAX_RELATED - manual.length));
    const mineFaq = faqSide.get(chapterId)!;
    const faq = faqDocs.map(({ f, vec }) => ({ id: f.id as string, question: String(f.question), answer: String(f.answer), score: Math.round(cosine(mineFaq, vec, faqIdf) * 100) / 100 }))
      .filter((f) => f.score >= MIN_FAQ).sort((a, b) => b.score - a.score).slice(0, 3);
    return { chapterId, manual, automatic, hidden, faq };
  };
  return { of, shown };
}

/** „Siehe auch“ und passende FAQ für ein Kapitel (Leseransicht) */
export async function readerRelated(ctx: Ctx, chapterId: string, drafts: boolean, lang?: unknown) {
  return (await relatedAll(ctx, drafts, { lang: await readerLanguage(ctx, lang) })).of(chapterId);
}

/** Für alle gezeigten Kapitel auf einmal (Druck, ADR-072): chapterId → Verweise und FAQ; mit `outlineId` die Kapitel dieser Handbuch-Variante */
export async function readerRelatedMap(ctx: Ctx, drafts: boolean, lang?: unknown, outlineId?: string) {
  const code = await readerLanguage(ctx, lang);
  let versionIds: string[] | undefined;
  if (outlineId) {
    const { chapters } = await variantChapters(ctx, outlineId); // 404 bei fremder oder unbekannter Variante
    versionIds = chapters.map((c: any) => (drafts ? c.versions[0] : c.versions.find((v: any) => v.status === 'approved'))?.id).filter(Boolean);
  }
  const r = await relatedAll(ctx, drafts, { lang: code, versionIds });
  return Object.fromEntries([...r.shown.keys()].map((id) => {
    const x = r.of(id);
    return [id, { manual: x.manual, automatic: x.automatic, faq: x.faq }];
  }));
}

/** Für feste Fassungen, z. B. eines Releases (Online-Hilfe, ADR-072) */
export async function relatedForVersions(ctx: Ctx, versionIds: string[], chapterId: string, lang: string) {
  return (await relatedAll(ctx, false, { lang, versionIds })).of(chapterId);
}

/** Verweise pflegen (Bearbeitungsrecht): Liste manueller Verweise in Reihenfolge und ausgeblendeter Vorschläge – ersetzt beide */
export async function setChapterLinks(ctx: Ctx, chapterId: string, input: { manual?: unknown; hidden?: unknown }, user: User) {
  if (!(await ctx.db.get('SELECT 1 FROM chapters WHERE id = ? AND project_id = ?', chapterId, ctx.projectId))) throw notFound(`Kapitel ${chapterId}`);
  const list = (v: unknown, field: string) => {
    if (v === undefined) return [];
    if (!Array.isArray(v) || v.length > 10 || v.some((x) => typeof x !== 'string')) throw badRequest(`${field}: Liste von Kapitel-IDs (höchstens 10).`);
    return [...new Set(v as string[])];
  };
  const manual = list(input.manual, 'manual');
  if (manual.length > MAX_RELATED) throw badRequest(`manual: höchstens ${MAX_RELATED} Verweise („Siehe auch“ zeigt insgesamt höchstens ${MAX_RELATED}).`);
  const hidden = list(input.hidden, 'hidden');
  if ([...manual, ...hidden].includes(chapterId)) throw badRequest('Ein Kapitel kann nicht auf sich selbst verweisen.');
  if (manual.some((id) => hidden.includes(id))) throw badRequest('Ein Kapitel kann nicht zugleich Verweis und ausgeblendet sein.');
  await assertIdsInProject(ctx, 'chapterId', [...manual, ...hidden]);
  const known = new Set((await ctx.db.all(`SELECT id FROM chapters WHERE project_id = ? AND id IN (${[...manual, ...hidden, ''].map(() => '?').join(', ')})`, ctx.projectId, ...manual, ...hidden, '')).map((r) => r.id as string));
  const missing = [...manual, ...hidden].find((id) => !known.has(id));
  if (missing) throw badRequest(`Kapitel ${missing} gibt es nicht.`);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM chapter_links WHERE chapter_id = ? AND project_id = ?', chapterId, ctx.projectId);
    const ts = now();
    for (const [i, id] of manual.entries()) await ctx.db.run('INSERT INTO chapter_links (project_id, chapter_id, target_chapter_id, kind, position, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', ctx.projectId, chapterId, id, 'manual', i, user.id, ts);
    for (const id of hidden) await ctx.db.run('INSERT INTO chapter_links (project_id, chapter_id, target_chapter_id, kind, position, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', ctx.projectId, chapterId, id, 'hidden', 0, user.id, ts);
    await audit(ctx, user.id, 'chapter.links_changed', 'chapter', chapterId, { manual, hidden });
  });
  return { manual, hidden };
}

// ---------- Lesezeichen und Verlauf (ADR-070) ----------

/**
 * Lesezeichen, zuletzt gelesene Kapitel und Hinweise – bezogen auf freigegebene Fassungen:
 * „geändert“ = neuere Fassung als die gelesene; „neu“ = seit dem ersten Lesen freigegeben und noch nie geöffnet
 */
export async function readerMe(ctx: Ctx, userId: string) {
  const bookmarks = await ctx.db.all(
    'SELECT b.chapter_id, c.title, b.created_at, b.note FROM reader_bookmarks b JOIN chapters c ON c.id = b.chapter_id WHERE b.project_id = ? AND b.user_id = ? ORDER BY b.created_at DESC', ctx.projectId, userId,
  );
  const visits = await ctx.db.all(
    'SELECT v.chapter_id, c.title, v.version_no, v.visited_at, v.first_visited_at FROM reader_visits v JOIN chapters c ON c.id = v.chapter_id WHERE v.project_id = ? AND v.user_id = ? ORDER BY v.visited_at DESC', ctx.projectId, userId,
  );
  const approved = await ctx.db.all(
    `SELECT v.chapter_id, MAX(v.version_no) AS version_no, MAX(v.approved_at) AS approved_at FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id
     WHERE c.project_id = ? AND c.outline_family_id IS NULL AND v.status = 'approved' GROUP BY v.chapter_id`, ctx.projectId,
  );
  const lastVisit = visits[0]?.visited_at as string | undefined;
  // „neu“ misst am ERSTEN Besuch: der aktuelle Besuch wird beim Öffnen sofort gespeichert und darf den Hinweis nicht verdrängen
  const firstVisit = visits.reduce<string | undefined>((m, v) => (!m || String(v.first_visited_at) < m ? String(v.first_visited_at) : m), undefined);
  const seen = new Map(visits.map((v) => [v.chapter_id as string, Number(v.version_no)]));
  const updates: Record<string, 'changed' | 'new'> = {};
  for (const a of approved) {
    const id = a.chapter_id as string;
    if (seen.has(id)) {
      if (Number(a.version_no) > seen.get(id)!) updates[id] = 'changed';
    } else if (firstVisit && a.approved_at && String(a.approved_at) > firstVisit) updates[id] = 'new';
  }
  return {
    bookmarks: bookmarks.map((b) => ({ chapterId: b.chapter_id as string, title: String(b.title), createdAt: b.created_at as string, note: (b.note as string | null) ?? null })),
    recent: visits.slice(0, 5).map((v) => ({ chapterId: v.chapter_id as string, title: String(v.title), visitedAt: v.visited_at as string })),
    updates, lastVisitAt: lastVisit ?? null,
  };
}

/** Besuch merken (gelesene Fassung); die Fassung muss zum Kapitel und Projekt gehören */
export async function recordVisit(ctx: Ctx, userId: string, input: { chapterId?: unknown; versionId?: unknown }) {
  if (typeof input.chapterId !== 'string' || typeof input.versionId !== 'string') throw badRequest('chapterId und versionId sind Pflicht.');
  await assertIdsInProject(ctx, 'versionId', [input.versionId]);
  const v = await ctx.db.get('SELECT v.version_no FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE v.id = ? AND v.chapter_id = ? AND c.project_id = ?', input.versionId, input.chapterId, ctx.projectId);
  if (!v) throw badRequest('Die Fassung gehört nicht zu diesem Kapitel.');
  await ctx.db.run(
    `INSERT INTO reader_visits (project_id, user_id, chapter_id, version_id, version_no, visited_at, first_visited_at) VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (project_id, user_id, chapter_id) DO UPDATE SET version_id = excluded.version_id, version_no = excluded.version_no, visited_at = excluded.visited_at`,
    ctx.projectId, userId, input.chapterId, input.versionId, Number(v.version_no), now(), now(),
  );
  return { ok: true };
}

/** Lesezeichen setzen oder entfernen; beim Setzen optional eine Notiz (ADR-073, höchstens 500 Zeichen; leer = keine) */
export async function setBookmark(ctx: Ctx, userId: string, chapterId: string, on: boolean, input: { note?: unknown } = {}) {
  if (!(await ctx.db.get('SELECT 1 FROM chapters WHERE id = ? AND project_id = ?', chapterId, ctx.projectId))) throw notFound(`Kapitel ${chapterId}`);
  if (input.note !== undefined && input.note !== null && typeof input.note !== 'string') throw badRequest('note muss Text sein.');
  const note = typeof input.note === 'string' ? input.note.trim().slice(0, 500) || null : undefined;
  if (on) {
    await ctx.db.run(
      `INSERT INTO reader_bookmarks (project_id, user_id, chapter_id, created_at, note) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (project_id, user_id, chapter_id) DO ${note === undefined ? 'NOTHING' : 'UPDATE SET note = excluded.note'}`,
      ctx.projectId, userId, chapterId, now(), note ?? null,
    );
  } else await ctx.db.run('DELETE FROM reader_bookmarks WHERE project_id = ? AND user_id = ? AND chapter_id = ?', ctx.projectId, userId, chapterId);
  const row = on ? await ctx.db.get('SELECT note FROM reader_bookmarks WHERE project_id = ? AND user_id = ? AND chapter_id = ?', ctx.projectId, userId, chapterId) : null;
  return { chapterId, bookmarked: on, note: (row?.note as string | null) ?? null };
}
