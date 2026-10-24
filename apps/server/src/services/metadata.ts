// oneSCM_Metadaten (ADR-079, ADR-080): vordefinierte Labels, Chunks mit Fundstelle und Labels, gespeicherte Fragen und Antworten.
// Chunks sind die Textabschnitte der aktuellen Quellrevisionen (text_snippets); entfernte Quelldateien bleiben außen vor.
import { chunkParts } from '../domain/chunking.js';
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Db, type Row } from '../db.js';
import { LABEL_CATALOG, LABEL_CODE_RE, LABEL_GROUP_CODES, LABEL_GROUPS, LABEL_LANGUAGES } from '../domain/metadataLabels.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { assertIdsInProject } from './projects.js';

const MAX_BATCH = 500;
/** Teiltreffer ohne Groß-/Kleinschreibung; % und _ gelten wörtlich */
const likePattern = (q: string) => `%${q.trim().toLowerCase().replace(/[\\%_]/g, (m) => `\\${m}`)}%`;
const MAX_SOURCES = 20;
const EXCERPT_CHARS = 600;

/**
 * Katalog in ein Projekt übernehmen (ADR-080). Fehlende Katalog-Labels werden angelegt. Von niemandem bearbeitete
 * Katalog-Labels (updated_by = system) folgen dem aktuellen Katalog: Namen, Beschreibung und Reihenfolge werden
 * angeglichen; Labels früherer Katalogstände werden ausgeblendet, Zuordnungen bleiben erhalten.
 * Von der Administration bearbeitete oder eigene Labels bleiben unverändert.
 */
export async function seedMetadataLabels(db: Db, projectId: string) {
  // Position je Gruppe in Katalogreihenfolge (Gliederung = Kapitelfolge)
  const soll = new Map(LABEL_CATALOG.map((l) => [l.code, { ...l, position: LABEL_CATALOG.filter((x) => x.group === l.group).indexOf(l) + 1 }]));
  const rows = await db.all('SELECT * FROM metadata_labels WHERE project_id = ?', projectId);
  const vorhanden = new Map(rows.map((r) => [r.code, r]));
  const neu = [...soll.values()].filter((l) => !vorhanden.has(l.code));
  const angleichen = rows.filter((r) => {
    if (r.origin !== 'catalog' || r.updated_by !== 'system') return false;
    const l = soll.get(r.code);
    if (!l) return !r.archived_at;
    return r.name_de !== l.nameDe || r.name_en !== l.nameEn || (r.description ?? null) !== (l.description ?? null) || Number(r.position) !== l.position || r.label_group !== l.group || !!r.archived_at;
  });
  if (!neu.length && !angleichen.length) return;
  await db.tx(async () => {
    for (const l of neu) {
      await db.run(
        `INSERT INTO metadata_labels (id, project_id, code, label_group, name_de, name_en, description, position, origin, archived_at, updated_by, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'catalog', NULL, 'system', ?) ON CONFLICT (project_id, code) DO NOTHING`,
        newId('lbl'), projectId, l.code, l.group, l.nameDe, l.nameEn, l.description ?? null, l.position, now(),
      );
    }
    for (const r of angleichen) {
      const l = soll.get(r.code);
      if (!l) await db.run('UPDATE metadata_labels SET archived_at = ?, updated_at = ? WHERE id = ?', now(), now(), r.id);
      else {
        await db.run('UPDATE metadata_labels SET label_group = ?, name_de = ?, name_en = ?, description = ?, position = ?, archived_at = NULL, updated_at = ? WHERE id = ?',
          l.group, l.nameDe, l.nameEn, l.description ?? null, l.position, now(), r.id);
      }
    }
  });
}

const labelDto = (r: Row) => ({
  id: r.id, code: r.code, group: r.label_group, nameDe: r.name_de, nameEn: r.name_en, description: r.description ?? null,
  position: Number(r.position), origin: r.origin, archived: !!r.archived_at,
  // Version und Historie (ADR-096)
  validFrom: r.valid_from ?? null, validUntil: r.valid_until ?? null, replacedBy: r.replaced_by ?? null, inHistory: !!r.history_at,
  ...(r.chunk_count !== undefined ? { chunkCount: Number(r.chunk_count), qaCount: Number(r.qa_count) } : {}),
  updatedBy: r.updated_by, updatedAt: r.updated_at,
});
export const shortLabel = (r: Row) => ({ id: r.id, code: r.code, group: r.label_group, nameDe: r.name_de, nameEn: r.name_en, archived: !!r.archived_at });

export function labelGroups() {
  return LABEL_GROUPS.map((g) => ({ ...g }));
}

export async function listLabels(ctx: Ctx, opts: { group?: string; includeArchived?: boolean } = {}) {
  if (opts.group && !LABEL_GROUP_CODES.includes(opts.group)) throw badRequest(`group muss eines von ${LABEL_GROUP_CODES.join(', ')} sein.`);
  const rows = await ctx.db.all(
    `SELECT l.*,
       (SELECT COUNT(*) FROM metadata_chunk_labels c WHERE c.label_id = l.id) AS chunk_count,
       (SELECT COUNT(*) FROM metadata_qa_labels q WHERE q.label_id = l.id) AS qa_count
     FROM metadata_labels l WHERE l.project_id = ? AND l.origin <> 'deleted' ${opts.group ? 'AND l.label_group = ?' : ''} ${opts.includeArchived ? '' : 'AND l.archived_at IS NULL'}`,
    ...[ctx.projectId, ...(opts.group ? [opts.group] : [])],
  );
  const order = (g: string) => LABEL_GROUP_CODES.indexOf(g);
  return rows.map(labelDto).sort((a, b) => order(a.group) - order(b.group) || a.position - b.position || a.nameDe.localeCompare(b.nameDe, 'de'));
}

function cleanName(v: unknown, field: string) {
  const s = String(v ?? '').trim();
  if (!s) throw badRequest(`${field} ist Pflicht.`);
  if (s.length > 120) throw badRequest(`${field} ist zu lang (max. 120 Zeichen).`);
  return s;
}

export async function createLabel(ctx: Ctx, input: { code?: string; group?: string; nameDe?: string; nameEn?: string; description?: string }, user: User) {
  const group = String(input.group ?? '');
  if (!LABEL_GROUP_CODES.includes(group)) throw badRequest(`group muss eines von ${LABEL_GROUP_CODES.join(', ')} sein.`);
  const nameDe = cleanName(input.nameDe, 'nameDe');
  const nameEn = cleanName(input.nameEn, 'nameEn');
  const code = String(input.code ?? '').trim().toLowerCase();
  if (!LABEL_CODE_RE.test(code)) throw badRequest('code: 2–60 Zeichen aus Kleinbuchstaben, Ziffern, Punkt und Bindestrich.');
  if (await ctx.db.get('SELECT id FROM metadata_labels WHERE project_id = ? AND code = ?', ctx.projectId, code)) throw conflict(`Label „${code}“ existiert bereits.`);
  const max = await ctx.db.get<{ n: number | null }>('SELECT MAX(position) AS n FROM metadata_labels WHERE project_id = ? AND label_group = ?', ctx.projectId, group);
  const id = newId('lbl');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO metadata_labels (id, project_id, code, label_group, name_de, name_en, description, position, origin, archived_at, updated_by, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'custom', NULL, ?, ?)`,
      id, ctx.projectId, code, group, nameDe, nameEn, input.description?.trim().slice(0, 1000) || null, Number(max?.n ?? 0) + 1, user.id, now(),
    );
    await audit(ctx, user.id, 'metadata.label.created', 'metadata_label', id, { code, group });
  });
  return labelDto((await ctx.db.get('SELECT * FROM metadata_labels WHERE id = ?', id))!);
}

export async function updateLabel(ctx: Ctx, id: string, input: { nameDe?: string; nameEn?: string; description?: string | null; position?: number; archived?: boolean; validFrom?: string | null }, user: User) {
  const r = await ctx.db.get('SELECT * FROM metadata_labels WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Label ${id}`);
  const nameDe = input.nameDe !== undefined ? cleanName(input.nameDe, 'nameDe') : r.name_de;
  const nameEn = input.nameEn !== undefined ? cleanName(input.nameEn, 'nameEn') : r.name_en;
  const description = input.description !== undefined ? input.description?.trim().slice(0, 1000) || null : r.description;
  if (input.position !== undefined && (!Number.isInteger(input.position) || input.position < 1)) throw badRequest('position muss eine ganze Zahl ≥ 1 sein.');
  const position = input.position ?? r.position;
  const archivedAt = input.archived === undefined ? r.archived_at : input.archived ? r.archived_at ?? now() : null;
  if (r.history_at && input.archived === false) throw badRequest('Das Label ist in der Historie – holen Sie es unter „Kapitelsteuerung › Historie“ zurück.');
  let validFrom = r.valid_from ?? null;
  if (input.validFrom !== undefined) {
    validFrom = input.validFrom === null || input.validFrom === '' ? null : String(input.validFrom).trim();
    if (validFrom && !/^[\p{L}\d][\p{L}\d .,/_-]{0,39}$/u.test(validFrom)) throw badRequest('validFrom: Version oder Release mit bis zu 40 Zeichen, z. B. „2026.3“.');
  }
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE metadata_labels SET name_de = ?, name_en = ?, description = ?, position = ?, archived_at = ?, valid_from = ?, updated_by = ?, updated_at = ? WHERE id = ?',
      nameDe, nameEn, description, position, archivedAt, validFrom, user.id, now(), id);
    await audit(ctx, user.id, 'metadata.label.updated', 'metadata_label', id, { code: r.code, nameDe, nameEn, archived: !!archivedAt });
  });
  return labelDto((await ctx.db.get('SELECT * FROM metadata_labels WHERE id = ?', id))!);
}

/**
 * Label löschen (ADR-100): Zuordnungen zu Chunks, Fragen & Antworten und Bildern entfallen. Eigene und von TRIAGE angelegte
 * Labels werden entfernt; Katalog-Labels bleiben als „gelöscht“ vermerkt, damit der Katalogabgleich sie nicht wieder anlegt.
 */
export async function deleteLabel(ctx: Ctx, id: string, user: User) {
  const r = await ctx.db.get("SELECT * FROM metadata_labels WHERE id = ? AND project_id = ? AND origin <> 'deleted'", id, ctx.projectId);
  if (!r) throw notFound(`Label ${id}`);
  const counts = {
    chunks: Number((await ctx.db.get('SELECT COUNT(*) AS n FROM metadata_chunk_labels WHERE label_id = ?', id))?.n ?? 0),
    qa: Number((await ctx.db.get('SELECT COUNT(*) AS n FROM metadata_qa_labels WHERE label_id = ?', id))?.n ?? 0),
  };
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM metadata_chunk_labels WHERE label_id = ?', id);
    await ctx.db.run('DELETE FROM metadata_qa_labels WHERE label_id = ?', id);
    await ctx.db.run('DELETE FROM media_labels WHERE label_id = ?', id);
    await ctx.db.run('DELETE FROM metadata_label_links WHERE domain_label_id = ? OR target_label_id = ?', id, id);
    if (r.origin === 'catalog') await ctx.db.run("UPDATE metadata_labels SET origin = 'deleted', archived_at = ?, updated_by = ?, updated_at = ? WHERE id = ?", now(), user.id, now(), id);
    else await ctx.db.run('DELETE FROM metadata_labels WHERE id = ?', id);
    await audit(ctx, user.id, 'metadata.label.deleted', 'metadata_label', id, { code: r.code, group: r.label_group, ...counts });
  });
  return { id, code: r.code, removedAssignments: counts };
}

/** IDs normalisieren und prüfen: gehören zum Projekt; für neue Zuordnungen nur eingeblendete Labels. */
async function checkLabels(ctx: Ctx, ids: unknown, opts: { forAssign: boolean }): Promise<string[]> {
  if (ids === undefined) return [];
  if (!Array.isArray(ids)) throw badRequest('Label-IDs müssen eine Liste sein.');
  const list = [...new Set(ids.map(String))];
  for (const id of list) {
    const r = await ctx.db.get<{ archived_at: string | null; name_de: string }>('SELECT archived_at, name_de FROM metadata_labels WHERE id = ? AND project_id = ?', id, ctx.projectId);
    if (!r) throw badRequest(`Label ${id} existiert in diesem Projekt nicht.`);
    if (opts.forAssign && r.archived_at) throw badRequest(`Label „${r.name_de}“ ist ausgeblendet und kann nicht zugewiesen werden.`);
  }
  return list;
}

export async function labelsBy(ctx: Ctx, table: 'metadata_chunk_labels' | 'metadata_qa_labels', key: 'snippet_id' | 'qa_id', ids: string[]) {
  const map = new Map<string, ReturnType<typeof shortLabel>[]>();
  if (!ids.length) return map;
  for (let i = 0; i < ids.length; i += 200) {
    const part = ids.slice(i, i + 200);
    const rows = await ctx.db.all(
      `SELECT x.${key} AS owner, l.* FROM ${table} x JOIN metadata_labels l ON l.id = x.label_id WHERE x.${key} IN (${part.map(() => '?').join(', ')}) ORDER BY l.label_group, l.position`,
      ...part,
    );
    for (const r of rows) map.set(r.owner, [...(map.get(r.owner) ?? []), shortLabel(r)]);
  }
  return map;
}

/** Format der Quelldatei: aus der Revision (markdown | html | docx …), sonst aus der Endung */
/** Dateiendungen je Format (Filter in SQL) */
const FORMAT_EXT: Record<string, string[]> = { markdown: ['md', 'markdown'], html: ['html', 'htm'], docx: ['docx'], pptx: ['pptx'], pdf: ['pdf'], mp4: ['mp4'], subtitles: ['vtt', 'srt'] };
export const formatOf = (sourceFormat: string | null, path: string) => {
  if (sourceFormat === 'jira') return 'jira'; // Ticket aus einem Jira-Export (ADR-081), gespeichert als Markdown
  const ext = /\.([a-z0-9]+)$/i.exec(path)?.[1]?.toLowerCase();
  if (ext === 'md' || ext === 'markdown') return 'markdown';
  if (ext === 'htm') return 'html';
  if (ext === 'vtt' || ext === 'srt') return 'subtitles'; // Untertitel (ADR-090)
  return ext ?? sourceFormat ?? 'markdown';
};

export const chunkDto = (r: Row, labels: ReturnType<typeof shortLabel>[]) => ({
  id: r.id, seq: Number(r.seq), documentId: r.document_id, path: r.path, fileName: r.file_name, format: formatOf(r.source_format, r.path),
  revisionId: r.revision_id, revisionNo: Number(r.revision_no), chapter: r.chapter_title, subchapter: r.subchapter_title ?? null,
  headingPath: parseJson<string[]>(r.heading_path, []), kind: r.kind, text: r.text,
  lineStart: Number(r.line_start), lineEnd: Number(r.line_end), locator: parseJson<Record<string, unknown> | null>(r.locator, null), labels,
  // Teilstücke langer Chunks für Suche und Antworten (ADR-087); leer = Chunk bleibt ganz
  chars: String(r.text).length, parts: chunkParts(r.text, r.kind),
});

export const CHUNK_FROM = `FROM text_snippets s
  JOIN source_revisions r ON r.id = s.revision_id
  JOIN source_documents d ON d.id = r.document_id
  JOIN chapters c ON c.id = s.chapter_id
  LEFT JOIN subchapters sc ON sc.id = s.subchapter_id`;

export async function listChunks(ctx: Ctx, opts: { q?: string; heading?: string; labelIds?: string[]; unlabeled?: boolean; noOutline?: boolean; documentId?: string; format?: string; limit?: number; offset?: number } = {}) {
  const where = ['d.project_id = ?', 'r.is_current = 1', 'd.removed_at IS NULL'];
  const params: unknown[] = [ctx.projectId];
  if (opts.q?.trim()) {
    where.push(`LOWER(s.text) LIKE ? ESCAPE '\\'`);
    params.push(likePattern(opts.q));
  }
  // Überschrift (M3): Kapitel, Unterkapitel oder tiefere Überschrift enthält den Text
  if (opts.heading?.trim()) {
    where.push(`(LOWER(c.title) LIKE ? ESCAPE '\\' OR LOWER(sc.title) LIKE ? ESCAPE '\\' OR LOWER(s.heading_path) LIKE ? ESCAPE '\\')`);
    const like = likePattern(opts.heading);
    params.push(like, like, like);
  }
  if (opts.format === 'jira') where.push("r.source_format = 'jira'");
  else if (opts.format) {
    const exts = FORMAT_EXT[opts.format];
    if (!exts) throw badRequest(`format muss eines von ${[...Object.keys(FORMAT_EXT), 'jira'].join(', ')} sein.`);
    where.push(`(${exts.map(() => 'LOWER(d.path) LIKE ?').join(' OR ')})`, "r.source_format <> 'jira'");
    params.push(...exts.map((e) => `%.${e}`));
  }
  if (opts.documentId) {
    where.push('d.id = ?');
    params.push(opts.documentId);
  }
  const labelIds = await checkLabels(ctx, opts.labelIds, { forAssign: false });
  // alle gewählten Labels müssen vorhanden sein (UND)
  for (const id of labelIds) {
    where.push('EXISTS (SELECT 1 FROM metadata_chunk_labels x WHERE x.snippet_id = s.id AND x.label_id = ?)');
    params.push(id);
  }
  if (opts.unlabeled) where.push('NOT EXISTS (SELECT 1 FROM metadata_chunk_labels x WHERE x.snippet_id = s.id)');
  // ohne Gliederungspunkt (F-13): Kandidaten für Gliederungs-Vorschläge
  if (opts.noOutline) where.push("NOT EXISTS (SELECT 1 FROM metadata_chunk_labels x JOIN metadata_labels l ON l.id = x.label_id WHERE x.snippet_id = s.id AND l.label_group = 'outline')");
  const limit = Math.min(Math.max(Math.trunc(opts.limit ?? 50), 1), 200);
  const offset = Math.max(Math.trunc(opts.offset ?? 0), 0);
  const total = await ctx.db.get<{ n: number }>(`SELECT COUNT(*) AS n ${CHUNK_FROM} WHERE ${where.join(' AND ')}`, ...params);
  const page = await ctx.db.all(
    `SELECT s.*, d.id AS document_id, d.path, d.file_name, r.source_format, r.revision_no, c.title AS chapter_title, sc.title AS subchapter_title
     ${CHUNK_FROM} WHERE ${where.join(' AND ')} ORDER BY d.path, s.position, s.id LIMIT ? OFFSET ?`,
    ...params, limit, offset,
  );
  const labels = await labelsBy(ctx, 'metadata_chunk_labels', 'snippet_id', page.map((r) => r.id));
  return { total: Number(total?.n ?? 0), limit, offset, items: page.map((r) => chunkDto(r, labels.get(r.id) ?? [])) };
}

export async function setChunkLabels(ctx: Ctx, input: { snippetIds?: unknown; add?: unknown; remove?: unknown }, user: User) {
  if (!Array.isArray(input.snippetIds) || !input.snippetIds.length) throw badRequest('snippetIds (Liste) ist Pflicht.');
  const snippetIds = [...new Set(input.snippetIds.map(String))];
  if (snippetIds.length > MAX_BATCH) throw badRequest(`Höchstens ${MAX_BATCH} Chunks je Aufruf.`);
  const add = await checkLabels(ctx, input.add, { forAssign: true });
  const remove = await checkLabels(ctx, input.remove, { forAssign: false });
  if (!add.length && !remove.length) throw badRequest('add oder remove (Label-IDs) angeben.');
  if (add.some((id) => remove.includes(id))) throw badRequest('Ein Label kann nicht gleichzeitig hinzugefügt und entfernt werden.');
  await assertIdsInProject(ctx, 'snippetId', snippetIds);
  let added = 0;
  let removed = 0;
  await ctx.db.tx(async () => {
    for (const s of snippetIds) {
      for (const l of add) {
        added += (await ctx.db.run(
          // ein Label der Triage, das ein Mensch setzt, gilt danach als von Hand gesetzt (ADR-100)
          `INSERT INTO metadata_chunk_labels (snippet_id, label_id, project_id, assigned_by, assigned_at, origin) VALUES (?, ?, ?, ?, ?, 'manual')
           ON CONFLICT (snippet_id, label_id) DO UPDATE SET origin = 'manual', confidence = NULL, assigned_by = excluded.assigned_by, assigned_at = excluded.assigned_at
           WHERE metadata_chunk_labels.origin <> 'manual'`,
          s, l, ctx.projectId, user.id, now(),
        )).changes;
      }
      for (const l of remove) removed += (await ctx.db.run('DELETE FROM metadata_chunk_labels WHERE snippet_id = ? AND label_id = ?', s, l)).changes;
    }
    await audit(ctx, user.id, 'metadata.chunk_labels.changed', 'text_snippet', snippetIds.length === 1 ? snippetIds[0] : `${snippetIds.length} Chunks`, { snippetIds, add, remove, added, removed });
  });
  return { chunks: snippetIds.length, added, removed };
}

// ---------------------------------------------------------------- Fragen und Antworten

interface QaSource { snippetId: string; path: string; headingPath: string[]; locator: Record<string, unknown> | null; lineStart: number; lineEnd: number; excerpt: string }

async function sourceSnapshot(ctx: Ctx, ids: unknown): Promise<QaSource[]> {
  if (ids === undefined) return [];
  if (!Array.isArray(ids)) throw badRequest('snippetIds muss eine Liste sein.');
  const list = [...new Set(ids.map(String))];
  if (list.length > MAX_SOURCES) throw badRequest(`Höchstens ${MAX_SOURCES} Quellen je Antwort.`);
  await assertIdsInProject(ctx, 'snippetId', list);
  const out: QaSource[] = [];
  for (const id of list) {
    const r = (await ctx.db.get(`SELECT s.*, d.path ${CHUNK_FROM} WHERE s.id = ?`, id))!;
    out.push({
      snippetId: id, path: r.path, headingPath: parseJson<string[]>(r.heading_path, []), locator: parseJson(r.locator, null),
      lineStart: Number(r.line_start), lineEnd: Number(r.line_end), excerpt: String(r.text).slice(0, EXCERPT_CHARS),
    });
  }
  return out;
}

function cleanLanguage(v: unknown) {
  const lang = String(v ?? 'de');
  if (!(LABEL_LANGUAGES as readonly string[]).includes(lang)) throw badRequest(`language muss ${LABEL_LANGUAGES.join(' oder ')} sein.`);
  return lang;
}
function cleanText(v: unknown, field: string, max: number) {
  const s = String(v ?? '').trim();
  if (!s) throw badRequest(`${field} ist Pflicht.`);
  if (s.length > max) throw badRequest(`${field} ist zu lang (max. ${max} Zeichen).`);
  return s;
}

async function qaDto(ctx: Ctx, rows: Row[]) {
  const labels = await labelsBy(ctx, 'metadata_qa_labels', 'qa_id', rows.map((r) => r.id));
  return rows.map((r) => ({
    id: r.id, question: r.question, answer: r.answer, language: r.language, sources: parseJson<QaSource[]>(r.sources, []), note: r.note ?? null,
    filters: parseJson<Record<string, unknown> | null>(r.filters, null), askId: r.ask_id ?? null,
    labels: labels.get(r.id) ?? [], createdBy: r.created_by, createdAt: r.created_at, updatedBy: r.updated_by, updatedAt: r.updated_at,
  }));
}

export async function listQa(ctx: Ctx, opts: { q?: string; labelIds?: string[]; language?: string } = {}) {
  const where = ['q.project_id = ?'];
  const params: unknown[] = [ctx.projectId];
  if (opts.q?.trim()) {
    where.push(`(LOWER(q.question) LIKE ? ESCAPE '\\' OR LOWER(q.answer) LIKE ? ESCAPE '\\')`);
    const like = likePattern(opts.q);
    params.push(like, like);
  }
  if (opts.language) {
    where.push('q.language = ?');
    params.push(cleanLanguage(opts.language));
  }
  for (const id of await checkLabels(ctx, opts.labelIds, { forAssign: false })) {
    where.push('EXISTS (SELECT 1 FROM metadata_qa_labels x WHERE x.qa_id = q.id AND x.label_id = ?)');
    params.push(id);
  }
  return qaDto(ctx, await ctx.db.all(`SELECT q.* FROM metadata_qa q WHERE ${where.join(' AND ')} ORDER BY q.created_at DESC, q.id`, ...params));
}

export async function getQa(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM metadata_qa WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Frage ${id}`);
  return (await qaDto(ctx, [r]))[0];
}

async function replaceQaLabels(ctx: Ctx, qaId: string, labelIds: string[]) {
  await ctx.db.run('DELETE FROM metadata_qa_labels WHERE qa_id = ?', qaId);
  for (const l of labelIds) await ctx.db.run('INSERT INTO metadata_qa_labels (qa_id, label_id) VALUES (?, ?)', qaId, l);
}

export async function createQa(ctx: Ctx, input: { question?: string; answer?: string; language?: string; snippetIds?: unknown; labelIds?: unknown; note?: string; filters?: unknown; askId?: string }, user: User) {
  const question = cleanText(input.question, 'question', 2000);
  const answer = cleanText(input.answer, 'answer', 20000);
  const language = cleanLanguage(input.language);
  const labelIds = await checkLabels(ctx, input.labelIds, { forAssign: true });
  const sources = await sourceSnapshot(ctx, input.snippetIds);
  const id = newId('qa');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      'INSERT INTO metadata_qa (id, project_id, question, answer, language, sources, note, created_by, created_at, updated_by, updated_at, filters, ask_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, ctx.projectId, question, answer, language, json(sources), input.note?.trim().slice(0, 2000) || null, user.id, now(), user.id, now(),
      // Rahmen der Frage (ADR-089) für „erneut fragen“; nur bekannte Filter
      input.filters && typeof input.filters === 'object' ? json(Object.fromEntries(Object.entries(input.filters as Record<string, unknown>).filter(([k]) => ['format', 'documentId', 'heading', 'labelIds'].includes(k)))) : null,
      typeof input.askId === 'string' && input.askId ? input.askId.slice(0, 80) : null,
    );
    await replaceQaLabels(ctx, id, labelIds);
    await audit(ctx, user.id, 'metadata.qa.created', 'metadata_qa', id, { question, labelIds, sources: sources.length });
  });
  return getQa(ctx, id);
}

export async function updateQa(ctx: Ctx, id: string, input: { question?: string; answer?: string; language?: string; snippetIds?: unknown; labelIds?: unknown; note?: string | null }, user: User) {
  const r = await ctx.db.get('SELECT * FROM metadata_qa WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Frage ${id}`);
  const question = input.question !== undefined ? cleanText(input.question, 'question', 2000) : r.question;
  const answer = input.answer !== undefined ? cleanText(input.answer, 'answer', 20000) : r.answer;
  const language = input.language !== undefined ? cleanLanguage(input.language) : r.language;
  const note = input.note !== undefined ? input.note?.trim().slice(0, 2000) || null : r.note;
  // bestehende, inzwischen ausgeblendete Labels dürfen bleiben – nur neu hinzukommende müssen eingeblendet sein
  let labelIds: string[] | undefined;
  if (input.labelIds !== undefined) {
    const current = new Set((await ctx.db.all<{ label_id: string }>('SELECT label_id FROM metadata_qa_labels WHERE qa_id = ?', id)).map((x) => x.label_id));
    const all = await checkLabels(ctx, input.labelIds, { forAssign: false });
    await checkLabels(ctx, all.filter((l) => !current.has(l)), { forAssign: true });
    labelIds = all;
  }
  const sources = input.snippetIds !== undefined ? json(await sourceSnapshot(ctx, input.snippetIds)) : r.sources;
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE metadata_qa SET question = ?, answer = ?, language = ?, sources = ?, note = ?, updated_by = ?, updated_at = ? WHERE id = ?',
      question, answer, language, sources, note, user.id, now(), id);
    if (labelIds) await replaceQaLabels(ctx, id, labelIds);
    await audit(ctx, user.id, 'metadata.qa.updated', 'metadata_qa', id, { question, labelIds });
  });
  return getQa(ctx, id);
}

export async function deleteQa(ctx: Ctx, id: string, user: User) {
  const r = await ctx.db.get('SELECT question FROM metadata_qa WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Frage ${id}`);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM metadata_qa_labels WHERE qa_id = ?', id);
    await ctx.db.run('DELETE FROM metadata_qa WHERE id = ?', id);
    await audit(ctx, user.id, 'metadata.qa.deleted', 'metadata_qa', id, { question: r.question });
  });
}

// ---------------------------------------------------------------- Übersicht

export async function metadataOverview(ctx: Ctx) {
  const docs = await ctx.db.all(
    `SELECT d.path, r.source_format, (SELECT COUNT(*) FROM text_snippets s WHERE s.revision_id = r.id) AS chunks
     FROM source_documents d JOIN source_revisions r ON r.document_id = d.id AND r.is_current = 1
     WHERE d.project_id = ? AND d.removed_at IS NULL`, ctx.projectId,
  );
  const formats = new Map<string, { documents: number; chunks: number }>();
  for (const d of docs) {
    const f = formatOf(d.source_format, d.path);
    const cur = formats.get(f) ?? { documents: 0, chunks: 0 };
    formats.set(f, { documents: cur.documents + 1, chunks: cur.chunks + Number(d.chunks) });
  }
  // je aktuellem Chunk ein Blick in den Primärschlüssel der Labels – seit TRIAGE trägt jeder Chunk rund zwölf Labels,
  // ein Join über alle Zuordnungen mit COUNT(DISTINCT) wurde bei 12 000 Chunks zur halben Sekunde (Lasttest Etappe 49)
  const labeled = await ctx.db.get<{ n: number }>(
    `SELECT COUNT(*) AS n FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     WHERE d.project_id = ? AND r.is_current = 1 AND d.removed_at IS NULL AND EXISTS (SELECT 1 FROM metadata_chunk_labels x WHERE x.snippet_id = s.id)`, ctx.projectId,
  );
  const labels = await ctx.db.all<{ label_group: string; n: number }>(
    'SELECT label_group, COUNT(*) AS n FROM metadata_labels WHERE project_id = ? AND archived_at IS NULL GROUP BY label_group', ctx.projectId,
  );
  const qa = await ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM metadata_qa WHERE project_id = ?', ctx.projectId);
  const chunks = docs.reduce((n, d) => n + Number(d.chunks), 0);
  return {
    documents: docs.length,
    chunks,
    labeledChunks: Number(labeled?.n ?? 0),
    savedAnswers: Number(qa?.n ?? 0),
    formats: [...formats.entries()].map(([format, v]) => ({ format, ...v })).sort((a, b) => a.format.localeCompare(b.format)),
    labelGroups: LABEL_GROUPS.map((g) => ({ ...g, labels: Number(labels.find((l) => l.label_group === g.code)?.n ?? 0) })),
  };
}
