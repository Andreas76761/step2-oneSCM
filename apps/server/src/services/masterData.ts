// Stammdaten (ADR-032): Abkürzungen, FAQ mit Vorschlägen aus dem Assistenten, Bildverzeichnis.
// Das Glossar nutzt die Begriffe und Definitionen der Terminologie (Etappe 3).
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { imageRefs } from '../domain/media.js';
import { DIVISION_CODES, ROLE_CODES } from '../domain/reference.js';
import { badRequest, conflict, notFound } from '../problem.js';

// ---------- Abkürzungen ----------

const abbrDto = (r: Row) => ({ id: r.id, abbreviation: r.abbreviation, expansion: r.expansion, description: r.description ?? null, updatedBy: r.updated_by, updatedAt: r.updated_at });

export async function listAbbreviations(ctx: Ctx) {
  return (await ctx.db.all('SELECT * FROM abbreviations WHERE project_id = ? ORDER BY LOWER(abbreviation)', ctx.projectId)).map(abbrDto);
}

function cleanAbbr(input: { abbreviation?: string; expansion?: string }) {
  const abbreviation = String(input.abbreviation ?? '').trim().slice(0, 40);
  const expansion = String(input.expansion ?? '').trim().slice(0, 300);
  if (!abbreviation || !expansion) throw badRequest('abbreviation und expansion sind Pflicht.');
  return { abbreviation, expansion };
}

export async function createAbbreviation(ctx: Ctx, input: { abbreviation?: string; expansion?: string; description?: string }, user: User) {
  const { abbreviation, expansion } = cleanAbbr(input);
  if (await ctx.db.get('SELECT id FROM abbreviations WHERE project_id = ? AND abbreviation = ?', ctx.projectId, abbreviation)) throw conflict(`Abkürzung „${abbreviation}“ existiert bereits.`);
  const id = newId('abk');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      'INSERT INTO abbreviations (id, project_id, abbreviation, expansion, description, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, ctx.projectId, abbreviation, expansion, input.description?.trim().slice(0, 1000) || null, user.id, now(), user.id, now(),
    );
    await audit(ctx, user.id, 'abbreviation.created', 'abbreviation', id, { abbreviation, expansion });
  });
  return abbrDto((await ctx.db.get('SELECT * FROM abbreviations WHERE id = ?', id))!);
}

export async function updateAbbreviation(ctx: Ctx, id: string, input: { abbreviation?: string; expansion?: string; description?: string | null }, user: User) {
  const r = await ctx.db.get('SELECT * FROM abbreviations WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Abkürzung ${id}`);
  const { abbreviation, expansion } = cleanAbbr({ abbreviation: input.abbreviation ?? r.abbreviation, expansion: input.expansion ?? r.expansion });
  if (abbreviation !== r.abbreviation && await ctx.db.get('SELECT id FROM abbreviations WHERE project_id = ? AND abbreviation = ?', ctx.projectId, abbreviation)) throw conflict(`Abkürzung „${abbreviation}“ existiert bereits.`);
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE abbreviations SET abbreviation = ?, expansion = ?, description = ?, updated_by = ?, updated_at = ? WHERE id = ?',
      abbreviation, expansion, input.description !== undefined ? input.description?.trim().slice(0, 1000) || null : r.description, user.id, now(), id);
    await audit(ctx, user.id, 'abbreviation.updated', 'abbreviation', id, { abbreviation, expansion });
  });
  return abbrDto((await ctx.db.get('SELECT * FROM abbreviations WHERE id = ?', id))!);
}

export async function deleteAbbreviation(ctx: Ctx, id: string, user: User) {
  const r = await ctx.db.get('SELECT abbreviation FROM abbreviations WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Abkürzung ${id}`);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM abbreviations WHERE id = ?', id);
    await audit(ctx, user.id, 'abbreviation.deleted', 'abbreviation', id, { abbreviation: r.abbreviation });
  });
}

/** Vorschläge: in aktuellen Schnipseln vorkommende Abkürzungen (2–6 Großbuchstaben/Ziffern), die noch nicht erfasst sind */
export async function abbreviationSuggestions(ctx: Ctx, limit = 30) {
  const known = new Set((await ctx.db.all('SELECT abbreviation FROM abbreviations WHERE project_id = ?', ctx.projectId)).map((r) => r.abbreviation as string));
  const counts = new Map<string, { n: number; example: string }>();
  const rows = await ctx.db.all(
    `SELECT s.text FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id WHERE d.project_id = ? AND r.is_current = 1`,
    ctx.projectId,
  );
  const IGNORE = new Set(['DE', 'EN', 'OK', 'PDF', 'URL', 'ID', 'II', 'III', 'IV']);
  for (const r of rows) {
    const text = String(r.text).replace(/\]\(media:[a-f0-9]{64}\)/g, '](...)');
    for (const m of text.matchAll(/\b[A-ZÄÖÜ][A-ZÄÖÜ0-9]{1,5}\b/g)) {
      const t = m[0];
      if (known.has(t) || IGNORE.has(t) || /^\d/.test(t) || !/[A-ZÄÖÜ].*[A-ZÄÖÜ]/.test(t)) continue;
      const c = counts.get(t);
      if (c) c.n++;
      else counts.set(t, { n: 1, example: text.slice(Math.max(0, m.index! - 50), m.index! + t.length + 50).replace(/\s+/g, ' ').trim() });
    }
  }
  return [...counts.entries()].sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0])).slice(0, limit).map(([abbreviation, c]) => ({ abbreviation, occurrences: c.n, example: c.example }));
}

// ---------- FAQ ----------

export const FAQ_STATUS = ['draft', 'published'] as const;

const faqDto = (r: Row) => ({
  id: r.id, question: r.question, answer: r.answer, roles: parseJson<string[]>(r.roles, []), divisions: parseJson<string[]>(r.divisions, []), language: r.language,
  status: r.status, source: r.source, sourceQuestion: r.source_question ?? null, position: r.position, updatedBy: r.updated_by, updatedAt: r.updated_at,
});

function faqFields(input: { question?: string; answer?: string; roles?: string[]; divisions?: string[]; language?: string; status?: string }, base?: Row) {
  const question = String(input.question ?? base?.question ?? '').trim().slice(0, 500);
  const answer = String(input.answer ?? base?.answer ?? '').trim().slice(0, 10_000);
  if (question.length < 3 || !answer) throw badRequest('Frage (mind. 3 Zeichen) und Antwort sind Pflicht.');
  const roles = input.roles !== undefined ? [...new Set(input.roles.map(String))] : parseJson<string[]>(base?.roles, []);
  const divisions = input.divisions !== undefined ? [...new Set(input.divisions.map(String))] : parseJson<string[]>(base?.divisions, []);
  const bad = [...roles.filter((r) => !ROLE_CODES.includes(r)), ...divisions.filter((d) => !DIVISION_CODES.includes(d))];
  if (bad.length) throw badRequest(`Unbekannte Rollen/Sparten: ${bad.join(', ')}.`);
  const status = input.status ?? base?.status ?? 'draft';
  if (!(FAQ_STATUS as readonly string[]).includes(status)) throw badRequest('status muss draft oder published sein.');
  const language = String(input.language ?? base?.language ?? 'de').slice(0, 5);
  return { question, answer, roles, divisions, status, language };
}

export async function listFaq(ctx: Ctx, q: { role?: string; division?: string; status?: string; language?: string } = {}) {
  const rows = await ctx.db.all('SELECT * FROM faq_entries WHERE project_id = ? ORDER BY position, created_at', ctx.projectId);
  const fits = (codes: string[], want?: string) => !want || !codes.length || codes.includes('all') || codes.includes(want);
  return rows.map(faqDto).filter((f) => fits(f.roles, q.role) && fits(f.divisions, q.division) && (!q.status || f.status === q.status) && (!q.language || f.language === q.language));
}

export async function createFaq(ctx: Ctx, input: Parameters<typeof faqFields>[0] & { sourceQuestion?: string }, user: User) {
  const f = faqFields(input);
  const id = newId('faq');
  const position = ((await ctx.db.get<{ m: number | null }>('SELECT MAX(position) AS m FROM faq_entries WHERE project_id = ?', ctx.projectId))?.m ?? 0) + 10;
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO faq_entries (id, project_id, question, answer, roles, divisions, language, status, source, source_question, position, created_by, created_at, updated_by, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, ctx.projectId, f.question, f.answer, json(f.roles), json(f.divisions), f.language, f.status, input.sourceQuestion ? 'assistant' : 'manual',
      input.sourceQuestion?.trim().slice(0, 500) || null, position, user.id, now(), user.id, now(),
    );
    await audit(ctx, user.id, 'faq.created', 'faq', id, { question: f.question, status: f.status });
  });
  return faqDto((await ctx.db.get('SELECT * FROM faq_entries WHERE id = ?', id))!);
}

export async function updateFaq(ctx: Ctx, id: string, input: Parameters<typeof faqFields>[0] & { move?: 'up' | 'down' }, user: User) {
  const r = await ctx.db.get('SELECT * FROM faq_entries WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`FAQ-Eintrag ${id}`);
  const f = faqFields(input, r);
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE faq_entries SET question = ?, answer = ?, roles = ?, divisions = ?, language = ?, status = ?, updated_by = ?, updated_at = ? WHERE id = ?',
      f.question, f.answer, json(f.roles), json(f.divisions), f.language, f.status, user.id, now(), id);
    if (input.move) {
      const list = await ctx.db.all('SELECT id, position FROM faq_entries WHERE project_id = ? ORDER BY position, created_at', ctx.projectId);
      const i = list.findIndex((x) => x.id === id);
      const j = input.move === 'up' ? i - 1 : i + 1;
      if (j >= 0 && j < list.length) {
        await ctx.db.run('UPDATE faq_entries SET position = ? WHERE id = ?', list[j].position, id);
        await ctx.db.run('UPDATE faq_entries SET position = ? WHERE id = ?', list[i].position, list[j].id);
      }
    }
    await audit(ctx, user.id, 'faq.updated', 'faq', id, { status: f.status });
  });
  return faqDto((await ctx.db.get('SELECT * FROM faq_entries WHERE id = ?', id))!);
}

export async function deleteFaq(ctx: Ctx, id: string, user: User) {
  const r = await ctx.db.get('SELECT id FROM faq_entries WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`FAQ-Eintrag ${id}`);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM faq_entries WHERE id = ?', id);
    await audit(ctx, user.id, 'faq.deleted', 'faq', id, {});
  });
}

/**
 * Vorschläge aus dem Handbuch-Assistenten (ADR-026): wiederholt gestellte Fragen sowie Fragen ohne Antwort
 * oder mit negativer Bewertung, die noch nicht als FAQ erfasst sind. Beantwortete Fragen bringen die Antwort als Entwurf mit.
 */
export async function faqSuggestions(ctx: Ctx, limit = 20) {
  const existing = new Set((await ctx.db.all('SELECT LOWER(COALESCE(source_question, question)) AS q FROM faq_entries WHERE project_id = ?', ctx.projectId)).map((r) => String(r.q).trim()));
  const rows = await ctx.db.all('SELECT question, answered, rating, answer, role_code, language, created_at FROM assistant_log WHERE project_id = ? ORDER BY created_at DESC LIMIT 2000', ctx.projectId);
  const groups = new Map<string, { question: string; count: number; unanswered: number; negative: number; answer: string | null; roles: Set<string>; language: string; last: string }>();
  for (const r of rows) {
    const key = String(r.question).trim().toLowerCase().replace(/[?!.\s]+$/g, '').replace(/\s+/g, ' ');
    if (!key || existing.has(key) || existing.has(`${key}?`)) continue;
    const g = groups.get(key) ?? { question: String(r.question).trim(), count: 0, unanswered: 0, negative: 0, answer: null, roles: new Set<string>(), language: r.language, last: r.created_at };
    g.count++;
    // lesbarste Schreibweise als Vorschlag (Großbuchstabe am Anfang, Fragezeichen am Ende)
    const q = String(r.question).trim();
    const score = (x: string) => (/^[A-ZÄÖÜ]/.test(x) ? 2 : 0) + (x.endsWith('?') ? 1 : 0);
    if (score(q) > score(g.question)) g.question = q;
    if (!r.answered) g.unanswered++;
    if (r.rating === -1) g.negative++;
    if (r.answered && r.rating !== -1 && !g.answer) g.answer = parseJson<{ text: string }[]>(r.answer, []).map((s) => s.text).join(' ') || null;
    if (r.role_code) g.roles.add(r.role_code);
    groups.set(key, g);
  }
  return [...groups.values()]
    .filter((g) => g.count >= 2 || g.unanswered > 0 || g.negative > 0)
    .sort((a, b) => b.count - a.count || b.unanswered - a.unanswered || b.last.localeCompare(a.last))
    .slice(0, limit)
    .map((g) => ({
      question: g.question, asked: g.count, unanswered: g.unanswered, negative: g.negative, roles: [...g.roles], language: g.language, lastAskedAt: g.last,
      suggestedAnswer: g.answer, reason: g.unanswered ? 'ohne Antwort im Handbuch' : g.negative ? 'Antwort negativ bewertet' : 'häufig gefragt',
    }));
}

// ---------- Bildverzeichnis ----------

/** Bilder mit Titel, Alternativtexten und Verwendung (Quellen, Kapitelversionen) */
export async function imageIndex(ctx: Ctx) {
  const assets = await ctx.db.all('SELECT * FROM media_assets WHERE project_id = ? ORDER BY created_at', ctx.projectId);
  // PNG-Fassungen von SVG-Bildern (ADR-042) erscheinen nur, wenn sie selbst verwendet werden
  const renditions = new Set(assets.map((a) => a.png_sha).filter(Boolean));
  const out = [];
  let n = 0;
  for (const a of assets) {
    const like = `%media:${a.sha256}%`;
    const snippets = await ctx.db.all(
      `SELECT s.seq, s.text, c.title AS chapter FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
       JOIN chapters c ON c.id = s.chapter_id WHERE d.project_id = ? AND r.is_current = 1 AND s.text LIKE ?`, ctx.projectId, like,
    );
    const blocks = await ctx.db.all(
      `SELECT DISTINCT c.id AS chapter_id, c.title AS chapter, v.version_no, v.status, b.text FROM content_blocks b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id
       JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND b.deleted_at IS NULL AND v.status IN ('draft', 'in_review', 'approved') AND b.text LIKE ?`, ctx.projectId, like,
    );
    const alts = [...new Set([...snippets, ...blocks].flatMap((x) => imageRefs(String(x.text)).filter((r) => r.sha === a.sha256).map((r) => r.alt)))];
    const used = snippets.length + blocks.length > 0;
    if (!used && renditions.has(a.sha256)) continue;
    out.push({
      number: used ? ++n : null, sha256: a.sha256, title: a.title ?? null, originalName: a.original_name ?? null, mime: a.mime, width: a.width ?? null, height: a.height ?? null,
      byteSize: a.byte_size, createdAt: a.created_at, url: `/api/v1/media/${a.sha256}`, pngSha: a.png_sha ?? null, altTexts: alts, missingAlt: alts.includes(''),
      usedIn: {
        sources: snippets.map((s) => ({ seq: s.seq, chapter: s.chapter })),
        chapters: [...new Map(blocks.map((b) => [`${b.chapter_id}|${b.version_no}`, { chapterId: b.chapter_id, chapter: b.chapter, versionNo: b.version_no, status: b.status }])).values()],
      },
    });
  }
  return out;
}

export async function setMediaTitle(ctx: Ctx, sha: string, title: string | null, user: User) {
  const r = await ctx.db.get('SELECT id FROM media_assets WHERE project_id = ? AND sha256 = ?', ctx.projectId, sha);
  if (!r) throw notFound(`Bild ${sha}`);
  const t = title?.trim().slice(0, 300) || null;
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE media_assets SET title = ? WHERE id = ?', t, r.id);
    await audit(ctx, user.id, 'media.title_changed', 'media', sha, { title: t });
  });
  return { sha256: sha, title: t };
}
