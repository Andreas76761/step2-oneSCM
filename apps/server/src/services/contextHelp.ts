// Kontexthilfe für oneSCM (ADR-030): Kontext-IDs an Kapiteln, Auflösung nach Rolle, Sparte und Sprache,
// Deep-Links in die Anwendung und eine einbettbare Hilfeseite (Widget) mit Handbuch-Assistent.
import { audit, type Ctx, type User } from '../context.js';
import { newId, now, parseJson, type Row } from '../db.js';
import { CHAPTER_SECTIONS, DIVISION_CODES, ROLE_CODES } from '../domain/reference.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { getChapterVersion } from './chapters.js';
import { visible, type ExportChapter } from './exports.js';
import { dataUri, loadMedia } from './media.js';
import { assertIdsInProject } from './projects.js';
import { escapeHtml, markdownToHtml } from './render.js';
import { projectLanguages, translatedChapter } from './translations.js';

/** Kontext-ID: klein, sprechend, stabil (z. B. „order.create“, „stock:transfer“) */
export const CONTEXT_KEY = /^[a-z0-9][a-z0-9._:-]{0,79}$/;
const SECTION_CODES = CHAPTER_SECTIONS.map((s) => s.code as string);

export function normalizeKey(raw: unknown) {
  const key = String(raw ?? '').trim().toLowerCase();
  if (!CONTEXT_KEY.test(key)) throw badRequest('Kontext-ID: 1–80 Zeichen, Kleinbuchstaben, Ziffern, Punkt, Doppelpunkt, Binde- und Unterstrich; beginnt mit Buchstabe oder Ziffer.');
  return key;
}

function dto(r: Row) {
  return {
    id: r.id, key: r.context_key, chapterId: r.chapter_id, chapterTitle: r.chapter_title ?? null, section: r.section_code ?? null,
    description: r.description ?? null, origin: r.origin, createdBy: r.created_by, createdAt: r.created_at, deepLink: `/hilfe/${encodeURIComponent(r.context_key)}`,
  };
}

const SELECT = 'SELECT h.*, c.title AS chapter_title FROM help_contexts h JOIN chapters c ON c.id = h.chapter_id';

export async function listContexts(ctx: Ctx, chapterId?: string) {
  const rows = chapterId
    ? await ctx.db.all(`${SELECT} WHERE h.project_id = ? AND h.chapter_id = ? ORDER BY h.context_key`, ctx.projectId, chapterId)
    : await ctx.db.all(`${SELECT} WHERE h.project_id = ? ORDER BY h.context_key`, ctx.projectId);
  const p = await ctx.db.get<{ help_public: number }>('SELECT help_public FROM projects WHERE id = ?', ctx.projectId);
  return { public: !!p?.help_public, embedPath: `/help/embed/${ctx.projectId}`, items: rows.map(dto) };
}

function validSection(section: unknown) {
  if (section === undefined || section === null || section === '') return null;
  if (!SECTION_CODES.includes(String(section))) throw badRequest(`Abschnitt muss einer von ${SECTION_CODES.join(', ')} sein.`);
  return String(section);
}

export async function createContext(ctx: Ctx, input: { key?: string; chapterId?: string; section?: string | null; description?: string }, user: User) {
  const key = normalizeKey(input.key);
  if (!input.chapterId) throw badRequest('chapterId ist Pflicht.');
  await assertIdsInProject(ctx, 'chapterId', [input.chapterId]);
  const section = validSection(input.section);
  if (await ctx.db.get('SELECT id FROM help_contexts WHERE project_id = ? AND context_key = ?', ctx.projectId, key)) throw conflict(`Kontext-ID „${key}“ ist bereits vergeben.`);
  const id = newId('hc');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      "INSERT INTO help_contexts (id, project_id, context_key, chapter_id, section_code, description, origin, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, 'manual', ?, ?)",
      id, ctx.projectId, key, input.chapterId, section, input.description?.trim().slice(0, 300) || null, user.id, now(),
    );
    await audit(ctx, user.id, 'help_context.created', 'help_context', id, { key, chapterId: input.chapterId, section });
  });
  return dto((await ctx.db.get(`${SELECT} WHERE h.id = ?`, id))!);
}

export async function updateContext(ctx: Ctx, id: string, input: { chapterId?: string; section?: string | null; description?: string | null }, user: User) {
  const r = await ctx.db.get('SELECT * FROM help_contexts WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Kontext ${id}`);
  if (input.chapterId) await assertIdsInProject(ctx, 'chapterId', [input.chapterId]);
  const chapterId = input.chapterId ?? r.chapter_id;
  const section = input.section !== undefined ? validSection(input.section) : r.section_code;
  const description = input.description !== undefined ? input.description?.trim().slice(0, 300) || null : r.description;
  await ctx.db.tx(async () => {
    await ctx.db.run("UPDATE help_contexts SET chapter_id = ?, section_code = ?, description = ?, origin = 'manual' WHERE id = ?", chapterId, section, description, id);
    await audit(ctx, user.id, 'help_context.updated', 'help_context', id, { key: r.context_key, chapterId, section });
  });
  return dto((await ctx.db.get(`${SELECT} WHERE h.id = ?`, id))!);
}

export async function deleteContext(ctx: Ctx, id: string, user: User) {
  const r = await ctx.db.get('SELECT * FROM help_contexts WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Kontext ${id}`);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM help_contexts WHERE id = ?', id);
    await audit(ctx, user.id, 'help_context.deleted', 'help_context', id, { key: r.context_key });
  });
}

/** Öffentliche Einbettung ein-/ausschalten (Administration) */
export async function setHelpPublic(ctx: Ctx, value: boolean, user: User) {
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE projects SET help_public = ? WHERE id = ?', value ? 1 : 0, ctx.projectId);
    await audit(ctx, user.id, 'help_context.public_changed', 'project', ctx.projectId, { public: value });
  });
  return listContexts(ctx);
}

/** Kontext-IDs aus dem Front-Matter einer Quelldatei (`help_context: order.create` oder Liste) – manuelle Zuordnungen haben Vorrang */
export async function contextsFromFrontMatter(ctx: Ctx, frontMatter: Record<string, unknown>, chapterId: string, actor: string) {
  const raw = frontMatter.help_context ?? frontMatter.help_contexts;
  const list = (Array.isArray(raw) ? raw : raw ? [raw] : []).map((x) => String(x).trim().toLowerCase()).filter((k) => CONTEXT_KEY.test(k));
  for (const key of [...new Set(list)].slice(0, 20)) {
    await ctx.db.run(
      `INSERT INTO help_contexts (id, project_id, context_key, chapter_id, section_code, description, origin, created_by, created_at)
       VALUES (?, ?, ?, ?, NULL, NULL, 'front_matter', ?, ?) ON CONFLICT (project_id, context_key) DO NOTHING`,
      newId('hc'), ctx.projectId, key, chapterId, actor, now(),
    );
  }
}

export interface HelpQuery {
  role?: string;
  division?: string;
  language?: string;
}

export interface ResolvedHelp {
  key: string;
  chapterId: string;
  title: string;
  versionNo: number;
  approvedAt: string | null;
  section: string | null;
  language: string;
  /** angefragte Sprache nicht freigegeben – deutscher Text */
  fallback: boolean;
  source: 'approved' | 'release';
  release: { id: string; version: string } | null;
  sections: { code: string; title: string; blocks: { id: string; kind: string; text: string }[] }[];
  /** eigenständiges HTML (Bilder eingebettet, ohne Skripte) */
  html: string;
  deepLink: string;
  /** Kapitelversionen, auf die sich der Assistent im Widget stützt */
  versionIds: string[];
}

function validQuery(q: HelpQuery, languages: string[]) {
  if (q.role && !(ROLE_CODES as readonly string[]).includes(q.role)) throw badRequest(`Unbekannte Rolle „${q.role}“.`);
  if (q.division && !(DIVISION_CODES as readonly string[]).includes(q.division)) throw badRequest(`Unbekannte Sparte „${q.division}“.`);
  const language = q.language || 'de';
  if (language !== 'de' && !languages.includes(language)) throw badRequest(`Sprache „${language}“ ist keine Zielsprache des Projekts.`);
  return language;
}

/** Neuestes Release des Projekts (Grundlage der öffentlichen Einbettung) */
export async function latestRelease(ctx: Ctx) {
  const r = await ctx.db.get('SELECT id, version, chapters FROM handbook_releases WHERE project_id = ? AND outline_family_id IS NULL ORDER BY created_at DESC LIMIT 1', ctx.projectId);
  return r ? { id: r.id as string, version: r.version as string, chapters: parseJson<{ chapterId: string; chapterVersionId: string }[]>(r.chapters, []) } : null;
}

/**
 * Hilfe zu einer Kontext-ID. `approved`: aktuell freigegebene Kapitelversion (angemeldete Nutzung, API);
 * `release`: Stand des neuesten veröffentlichten Releases (öffentliche Einbettung).
 */
export async function resolveHelp(ctx: Ctx, rawKey: string, q: HelpQuery, source: 'approved' | 'release'): Promise<ResolvedHelp> {
  const key = String(rawKey ?? '').trim().toLowerCase();
  const row = CONTEXT_KEY.test(key) ? await ctx.db.get(`${SELECT} WHERE h.project_id = ? AND h.context_key = ?`, ctx.projectId, key) : undefined;
  if (!row) throw notFound(`Hilfethema zur Kontext-ID „${key}“`);
  const language = validQuery(q, await projectLanguages(ctx));
  let versionId: string | undefined;
  let release: ResolvedHelp['release'] = null;
  let versionIds: string[];
  if (source === 'release') {
    const rel = await latestRelease(ctx);
    versionId = rel?.chapters.find((c) => c.chapterId === row.chapter_id)?.chapterVersionId;
    if (!rel || !versionId) throw notFound(`Veröffentlichte Hilfe zur Kontext-ID „${key}“`);
    release = { id: rel.id, version: rel.version };
    versionIds = rel.chapters.map((c) => c.chapterVersionId);
  } else {
    versionId = (await ctx.db.get("SELECT id FROM generated_chapter_versions WHERE chapter_id = ? AND status = 'approved'", row.chapter_id))?.id;
    if (!versionId) throw notFound(`Freigegebene Hilfe zur Kontext-ID „${key}“ (Kapitel „${row.chapter_title}“ ist noch nicht freigegeben)`);
    versionIds = [];
  }
  let chapter: ExportChapter = await getChapterVersion(ctx, versionId);
  let fallback = false;
  if (language !== 'de') {
    const tr = await ctx.db.get("SELECT id FROM translations WHERE chapter_version_id = ? AND language = ? AND status = 'approved'", versionId, language);
    if (tr) chapter = await translatedChapter(ctx, tr.id);
    else fallback = true;
  }
  const [filtered] = visible([chapter], { roles: q.role ? [q.role] : undefined, divisions: q.division ? [q.division] : undefined });
  const sections = filtered.sections
    .filter((s) => !row.section_code || s.code === row.section_code)
    .map((s) => ({ code: s.code, title: s.title, blocks: s.blocks.map((b: any) => ({ id: b.id as string, kind: b.kind as string, text: b.text as string })) }));
  const media = await loadMedia(ctx, sections.flatMap((s) => s.blocks.map((b) => b.text)));
  const images = (sha: string) => (media.has(sha) ? dataUri(media.get(sha)!) : null);
  const html = sections.map((s) => `<section><h2>${escapeHtml(s.title)}</h2>${s.blocks.map((b) => `<div class="block kind-${escapeHtml(b.kind)}">${markdownToHtml(b.text, images)}</div>`).join('')}</section>`).join('\n');
  const params = new URLSearchParams(Object.entries({ role: q.role, division: q.division, language: language === 'de' ? undefined : language }).filter(([, v]) => v) as [string, string][]);
  return {
    key, chapterId: row.chapter_id, title: chapter.title, versionNo: chapter.versionNo, approvedAt: chapter.approvedAt, section: row.section_code ?? null,
    language: fallback ? 'de' : language, fallback, source, release, sections, html,
    deepLink: `/hilfe/${encodeURIComponent(key)}${params.size ? `?${params}` : ''}`, versionIds,
  };
}
