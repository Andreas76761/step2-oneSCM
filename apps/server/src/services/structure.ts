// Kapitelsteuerung (ADR-096): Kapitelanweisung je Kapitel und Unterkapitel, fehlende Kapitel und Unterkapitel
// ergänzen, Version („gültig ab“) an Kapiteln, Unterkapiteln und Labels, und Ablösen veralteter Funktionen durch neue –
// das Abgelöste kommt in die Historie (nicht mehr im Handbuch, im Anhang „Historie“ nachvollziehbar).
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { cleanTopics, instructionMarkdown, isEmpty, MAX_INSTRUCTION, mergeInstructions, type Instruction } from '../domain/chapterInstruction.js';
import { chapterOf, headingKey } from '../domain/markdown.js';
import { badRequest, conflict, notFound } from '../problem.js';

export type StructureKind = 'chapter' | 'subchapter' | 'label';
const VERSION_RE = /^[\p{L}\d][\p{L}\d .,/_-]{0,39}$/u;

export const instructionOf = (r: Row | null | undefined): Instruction => ({
  text: r?.instruction ?? null,
  topics: parseJson<string[]>(r?.instruction_topics, []),
  excluded: parseJson<string[]>(r?.instruction_excluded, []),
});

const versionOf = (r: Row) => ({ validFrom: r.valid_from ?? null, validUntil: r.valid_until ?? null, replacedBy: r.replaced_by ?? null, inHistory: !!r.history_at, historyAt: r.history_at ?? null });

function subDto(r: Row) {
  return { id: r.id, key: r.key, title: r.title, position: Number(r.position), instruction: instructionOf(r), ...versionOf(r), updatedBy: r.meta_updated_by ?? null, updatedAt: r.meta_updated_at ?? null };
}

async function chapterDto(ctx: Ctx, r: Row, withHistory: boolean) {
  const subs = await ctx.db.all(`SELECT * FROM subchapters WHERE chapter_id = ? ${withHistory ? '' : 'AND history_at IS NULL'} ORDER BY position, title`, r.id);
  const snippets = Number((await ctx.db.get('SELECT COUNT(*) AS n FROM text_snippets WHERE chapter_id = ?', r.id))?.n ?? 0);
  // Pipeline (ADR-098): Tickets in Bearbeitung zu diesem Kapitel – noch nicht produktiv
  const pipeline = Number((await ctx.db.get("SELECT COUNT(*) AS n FROM work_items WHERE chapter_id = ? AND area = 'pipeline' AND state NOT IN ('live', 'cancelled')", r.id))?.n ?? 0);
  return {
    id: r.id, key: r.key, title: r.title, position: Number(r.position), outlineFamilyId: r.outline_family_id ?? null, snippets, pipeline,
    instruction: instructionOf(r), ...versionOf(r), updatedBy: r.meta_updated_by ?? null, updatedAt: r.meta_updated_at ?? null,
    subchapters: subs.map(subDto),
  };
}

/**
 * Kapitel und Unterkapitel der Quellen mit Anweisung und Version; Historie nur auf Wunsch. `outlineFamilyId`: Kapitel einer
 * Handbuch-Variante (ADR-097, W-01) – sie haben eine eigene Anweisung zusätzlich zu der ihrer Quellkapitel.
 */
export async function listStructure(ctx: Ctx, opts: { history?: boolean; outlineFamilyId?: string } = {}) {
  const rows = await ctx.db.all(
    `SELECT * FROM chapters WHERE project_id = ? AND ${opts.outlineFamilyId ? 'outline_family_id = ?' : 'outline_family_id IS NULL'} AND key <> '__none__' ${opts.history ? '' : 'AND history_at IS NULL'} ORDER BY position, title`,
    ctx.projectId, ...(opts.outlineFamilyId ? [opts.outlineFamilyId] : []),
  );
  const chapters = await Promise.all(rows.map((r) => chapterDto(ctx, r, !!opts.history)));
  const withInstruction = chapters.filter((c) => !isEmpty(c.instruction)).length + chapters.reduce((n, c) => n + c.subchapters.filter((s) => !isEmpty(s.instruction)).length, 0);
  return { chapters, summary: { chapters: chapters.length, subchapters: chapters.reduce((n, c) => n + c.subchapters.length, 0), withInstruction } };
}

/** Handbuch-Varianten mit angelegten Kapiteln (für die Auswahl in der Kapitelsteuerung) */
export async function structureOutlines(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT o.family_id, o.name, o.version_no, (SELECT COUNT(*) FROM chapters c WHERE c.project_id = o.project_id AND c.outline_family_id = o.family_id) AS chapters
     FROM outlines o WHERE o.project_id = ? AND o.version_no = (SELECT MAX(x.version_no) FROM outlines x WHERE x.family_id = o.family_id) ORDER BY o.name`, ctx.projectId,
  );
  return rows.map((r) => ({ familyId: r.family_id as string, name: r.name as string, versionNo: Number(r.version_no), chapters: Number(r.chapters) }));
}

async function chapterRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM chapters WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Kapitel ${id}`);
  return r;
}

async function subRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT s.*, c.title AS chapter_title FROM subchapters s JOIN chapters c ON c.id = s.chapter_id WHERE s.id = ? AND c.project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Unterkapitel ${id}`);
  return r;
}

function cleanTitle(v: unknown) {
  const t = String(v ?? '').replace(/\s+/g, ' ').trim();
  if (t.length < 3 || t.length > 160) throw badRequest('title braucht 3 bis 160 Zeichen.');
  return t;
}

function cleanVersion(v: unknown, field: string): string | null {
  if (v === null || v === undefined || v === '') return null;
  const s = String(v).trim();
  if (!VERSION_RE.test(s)) throw badRequest(`${field}: Version oder Release mit bis zu 40 Zeichen, z. B. „2026.3“ oder „Release 12“.`);
  return s;
}

/** Felder für Anweisung und Version aus der Eingabe (nur angegebene) */
function metaSets(input: any) {
  const sets: [string, unknown][] = [];
  try {
    if (input.instruction !== undefined) {
      const t = input.instruction === null ? null : String(input.instruction).trim();
      if (t && t.length > MAX_INSTRUCTION) throw new Error(`instruction: höchstens ${MAX_INSTRUCTION} Zeichen.`);
      sets.push(['instruction', t || null]);
    }
    if (input.topics !== undefined) sets.push(['instruction_topics', json(cleanTopics(input.topics, 'topics'))]);
    if (input.excluded !== undefined) sets.push(['instruction_excluded', json(cleanTopics(input.excluded, 'excluded'))]);
  } catch (e) {
    throw badRequest((e as Error).message);
  }
  if (input.validFrom !== undefined) sets.push(['valid_from', cleanVersion(input.validFrom, 'validFrom')]);
  return sets;
}

/** Fehlendes Kapitel ergänzen – Schlüssel wie beim Import, damit später eingelesene Quellen dazu passen */
export async function createChapter(ctx: Ctx, input: any, user: User) {
  const title = cleanTitle(input.title);
  const { key } = chapterOf({ chapterTitle: title });
  if (await ctx.db.get('SELECT 1 FROM chapters WHERE project_id = ? AND key = ?', ctx.projectId, key)) throw conflict(`Ein Kapitel „${title}“ gibt es bereits.`);
  let position: number;
  const numbered = title.match(/^\s*(?:kapitel\s+)?(\d+)\.?\s/i);
  if (input.afterId) {
    const after = await chapterRow(ctx, String(input.afterId));
    const next = await ctx.db.get('SELECT MIN(position) AS p FROM chapters WHERE project_id = ? AND outline_family_id IS NULL AND position > ?', ctx.projectId, after.position);
    position = next?.p != null ? (Number(after.position) + Number(next.p)) / 2 : Number(after.position) + 1000;
  } else if (numbered) position = Number(numbered[1]) * 1000;
  else position = Number((await ctx.db.get('SELECT MAX(position) AS m FROM chapters WHERE project_id = ?', ctx.projectId))?.m ?? 0) + 1000;
  const id = newId('ch');
  const sets = metaSets(input);
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO chapters (id, project_id, key, title, position, meta_updated_by, meta_updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', id, ctx.projectId, key, title, Math.round(position), user.id, now());
    if (sets.length) await ctx.db.run(`UPDATE chapters SET ${sets.map(([c]) => `${c} = ?`).join(', ')} WHERE id = ?`, ...sets.map(([, v]) => v), id);
    await audit(ctx, user.id, 'chapter.created', 'chapter', id, { title });
  });
  return chapterDto(ctx, await chapterRow(ctx, id), true);
}

export async function updateChapterMeta(ctx: Ctx, id: string, input: any, user: User) {
  const r = await chapterRow(ctx, id);
  const sets = metaSets(input);
  if (input.title !== undefined) {
    const title = cleanTitle(input.title);
    if (await ctx.db.get('SELECT 1 FROM chapters WHERE project_id = ? AND LOWER(title) = LOWER(?) AND id <> ?', ctx.projectId, title, id)) throw conflict(`Ein Kapitel „${title}“ gibt es bereits.`);
    sets.push(['title', title]);
  }
  if (!sets.length) throw badRequest('Nichts zu ändern (title, instruction, topics, excluded, validFrom).');
  await ctx.db.tx(async () => {
    await ctx.db.run(`UPDATE chapters SET ${sets.map(([c]) => `${c} = ?`).join(', ')}, meta_updated_by = ?, meta_updated_at = ? WHERE id = ?`, ...sets.map(([, v]) => v), user.id, now(), id);
    await audit(ctx, user.id, 'chapter.meta_updated', 'chapter', id, { title: r.title, fields: sets.map(([c]) => c) });
  });
  return chapterDto(ctx, await chapterRow(ctx, id), true);
}

/** Fehlendes Unterkapitel ergänzen */
export async function createSubchapter(ctx: Ctx, chapterId: string, input: any, user: User) {
  const ch = await chapterRow(ctx, chapterId);
  const title = cleanTitle(input.title);
  const key = headingKey(title) || title;
  if (await ctx.db.get('SELECT 1 FROM subchapters WHERE chapter_id = ? AND key = ?', chapterId, key)) throw conflict(`Ein Unterkapitel „${title}“ gibt es in diesem Kapitel bereits.`);
  const numbered = title.match(/^\s*\d+\.(\d+)\.?\s/);
  const max = Number((await ctx.db.get('SELECT MAX(position) AS m FROM subchapters WHERE chapter_id = ?', chapterId))?.m ?? 0);
  const position = numbered ? Number(numbered[1]) * 1000 : max + 1000;
  const id = newId('sub');
  const sets = metaSets(input);
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO subchapters (id, chapter_id, key, title, position, meta_updated_by, meta_updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)', id, chapterId, key, title, position, user.id, now());
    if (sets.length) await ctx.db.run(`UPDATE subchapters SET ${sets.map(([c]) => `${c} = ?`).join(', ')} WHERE id = ?`, ...sets.map(([, v]) => v), id);
    await audit(ctx, user.id, 'subchapter.created', 'chapter', chapterId, { title, chapter: ch.title });
  });
  return subDto(await subRow(ctx, id));
}

export async function updateSubchapterMeta(ctx: Ctx, id: string, input: any, user: User) {
  const r = await subRow(ctx, id);
  const sets = metaSets(input);
  if (input.title !== undefined) sets.push(['title', cleanTitle(input.title)]);
  if (!sets.length) throw badRequest('Nichts zu ändern (title, instruction, topics, excluded, validFrom).');
  await ctx.db.tx(async () => {
    await ctx.db.run(`UPDATE subchapters SET ${sets.map(([c]) => `${c} = ?`).join(', ')}, meta_updated_by = ?, meta_updated_at = ? WHERE id = ?`, ...sets.map(([, v]) => v), user.id, now(), id);
    await audit(ctx, user.id, 'subchapter.meta_updated', 'chapter', r.chapter_id, { subchapterId: id, title: r.title, fields: sets.map(([c]) => c) });
  });
  return subDto(await subRow(ctx, id));
}

/** Gültige Anweisung für ein Kapitel und optional ein Unterkapitel (Unterkapitel ergänzt das Kapitel) */
export async function instructionFor(ctx: Ctx, chapterId: string, subchapterId?: string | null): Promise<Instruction> {
  const ch = await ctx.db.get('SELECT * FROM chapters WHERE id = ?', chapterId);
  const sub = subchapterId ? await ctx.db.get('SELECT * FROM subchapters WHERE id = ? AND chapter_id = ?', subchapterId, chapterId) : null;
  return mergeInstructions(instructionOf(ch), sub ? instructionOf(sub) : null);
}

/** Anweisungen je Unterkapitel eines Kapitels (für den Generator) */
export async function subchapterInstructions(ctx: Ctx, chapterId: string) {
  const rows = await ctx.db.all('SELECT * FROM subchapters WHERE chapter_id = ?', chapterId);
  return new Map(rows.map((r) => [r.id as string, instructionOf(r)]));
}

// ---------- Ablösen und Historie ----------

const TABLE: Record<'chapter' | 'subchapter', string> = { chapter: 'chapters', subchapter: 'subchapters' };

async function labelRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM metadata_labels WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Label ${id}`);
  return r;
}

/**
 * Veraltete Funktion ablösen: `replacementId` (vorhandener Nachfolger) oder `newTitle` (Nachfolger wird angelegt, bei
 * Kapiteln und Unterkapiteln mit derselben Anweisung). Das Alte gilt bis zur Version des Neuen und kommt in die Historie.
 * Bei Labels überträgt `moveAssignments` Chunks, Fragen & Antworten und Bilder auf das neue Label.
 */
export async function replaceItem(ctx: Ctx, kind: StructureKind, id: string, input: any, user: User) {
  if (!['chapter', 'subchapter', 'label'].includes(kind)) throw badRequest('kind: chapter, subchapter oder label.');
  const validFrom = cleanVersion(input.validFrom, 'validFrom');
  const note = input.note === undefined || input.note === null ? null : String(input.note).trim().slice(0, 500) || null;
  if (!input.replacementId && !input.newTitle) throw badRequest('replacementId (vorhandener Nachfolger) oder newTitle (neuer Nachfolger) ist Pflicht.');
  let old: Row;
  let parentTitle: string | null = null;
  let successor: { id: string; title: string };
  const moved: Record<string, number> = {};
  if (kind === 'label') old = await labelRow(ctx, id);
  else if (kind === 'chapter') old = await chapterRow(ctx, id);
  else {
    old = await subRow(ctx, id);
    parentTitle = old.chapter_title;
  }
  if (old.history_at) throw conflict('Das ist bereits in der Historie.');
  await ctx.db.tx(async () => {
    if (input.replacementId) {
      const rid = String(input.replacementId);
      if (rid === id) throw badRequest('Ein Eintrag kann sich nicht selbst ablösen.');
      const r = kind === 'label' ? await labelRow(ctx, rid) : kind === 'chapter' ? await chapterRow(ctx, rid) : await subRow(ctx, rid);
      if (r.history_at) throw badRequest('Der Nachfolger ist selbst in der Historie.');
      if (kind === 'label' && r.label_group !== old.label_group) throw badRequest('Nachfolger muss in derselben Labelgruppe sein.');
      successor = { id: r.id, title: kind === 'label' ? r.name_de : r.title };
      if (validFrom) {
        if (kind === 'label') await ctx.db.run('UPDATE metadata_labels SET valid_from = ? WHERE id = ?', validFrom, rid);
        else await ctx.db.run(`UPDATE ${TABLE[kind]} SET valid_from = ? WHERE id = ?`, validFrom, rid);
      }
    } else if (kind === 'label') {
      const title = String(input.newTitle).trim();
      const nameDe = title.slice(0, 120);
      if (nameDe.length < 2) throw badRequest('newTitle ist zu kurz.');
      const base = `${old.code.replace(/-v\d+$/, '')}`.slice(0, 54);
      let code = `${base}-v2`;
      for (let n = 2; await ctx.db.get('SELECT 1 FROM metadata_labels WHERE project_id = ? AND code = ?', ctx.projectId, code); n++) code = `${base}-v${n}`;
      const nid = newId('lbl');
      await ctx.db.run(
        `INSERT INTO metadata_labels (id, project_id, code, label_group, name_de, name_en, description, position, origin, archived_at, updated_by, updated_at, valid_from)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'custom', NULL, ?, ?, ?)`,
        nid, ctx.projectId, code, old.label_group, nameDe, String(input.newTitleEn ?? nameDe).slice(0, 120), old.description ?? null, Number(old.position), user.id, now(), validFrom,
      );
      successor = { id: nid, title: nameDe };
    } else if (kind === 'chapter') {
      const c = await createChapter(ctx, { title: input.newTitle, afterId: id, validFrom, instruction: old.instruction, topics: parseJson(old.instruction_topics, []), excluded: parseJson(old.instruction_excluded, []) }, user);
      successor = { id: c.id, title: c.title };
    } else {
      const s = await createSubchapter(ctx, old.chapter_id, { title: input.newTitle, validFrom, instruction: old.instruction, topics: parseJson(old.instruction_topics, []), excluded: parseJson(old.instruction_excluded, []) }, user);
      successor = { id: s.id, title: s.title };
    }
    const until = validFrom ?? old.valid_until ?? null;
    if (kind === 'label') {
      if (input.moveAssignments) {
        for (const [table, key, name] of [['metadata_chunk_labels', 'snippet_id', 'chunks'], ['metadata_qa_labels', 'qa_id', 'qa'], ['media_labels', 'base_sha', 'images']] as const) {
          const rows = await ctx.db.all(`SELECT * FROM ${table} WHERE label_id = ?`, id);
          for (const r of rows) {
            const exists = await ctx.db.get(`SELECT 1 FROM ${table} WHERE label_id = ? AND ${key} = ?`, successor!.id, r[key]);
            if (!exists) {
              const cols = Object.keys(r);
              await ctx.db.run(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, ...cols.map((c) => (c === 'label_id' ? successor!.id : r[c])));
            }
          }
          await ctx.db.run(`DELETE FROM ${table} WHERE label_id = ?`, id);
          moved[name] = rows.length;
        }
      }
      // ausgeblendet: nicht mehr zuweisbar; bestehende Zuordnungen (ohne Übertragung) bleiben als Historie
      await ctx.db.run('UPDATE metadata_labels SET valid_until = ?, replaced_by = ?, history_at = ?, archived_at = COALESCE(archived_at, ?), updated_by = ?, updated_at = ? WHERE id = ?',
        until, successor!.id, now(), now(), user.id, now(), id);
      parentTitle = old.label_group;
    } else {
      await ctx.db.run(`UPDATE ${TABLE[kind]} SET valid_until = ?, replaced_by = ?, history_at = ?, meta_updated_by = ?, meta_updated_at = ? WHERE id = ?`, until, successor!.id, now(), user.id, now(), id);
    }
    await ctx.db.run(
      `INSERT INTO structure_history (id, project_id, kind, item_id, title, parent_title, replaced_by_id, replaced_by_title, valid_from, valid_until, note, moved, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      newId('hst'), ctx.projectId, kind, id, kind === 'label' ? old.name_de : old.title, parentTitle, successor!.id, successor!.title, old.valid_from ?? null, until, note, json(moved), user.id, now(),
    );
    await audit(ctx, user.id, `${kind}.replaced`, kind === 'label' ? 'metadata_label' : 'chapter', id, { successor: successor!.id, validFrom, moved });
  });
  return { replaced: { kind, id }, successor: successor!, moved, history: await listHistory(ctx) };
}

/** Aus der Historie zurückholen (Ablösung rückgängig); übertragene Zuordnungen bleiben beim Nachfolger */
export async function restoreItem(ctx: Ctx, historyId: string, user: User) {
  const h = await ctx.db.get('SELECT * FROM structure_history WHERE id = ? AND project_id = ?', historyId, ctx.projectId);
  if (!h) throw notFound(`Historie ${historyId}`);
  if (h.restored_at) throw conflict('Schon zurückgeholt.');
  await ctx.db.tx(async () => {
    if (h.kind === 'label') await ctx.db.run('UPDATE metadata_labels SET valid_until = NULL, replaced_by = NULL, history_at = NULL, archived_at = NULL, updated_by = ?, updated_at = ? WHERE id = ?', user.id, now(), h.item_id);
    else await ctx.db.run(`UPDATE ${TABLE[h.kind as 'chapter' | 'subchapter']} SET valid_until = NULL, replaced_by = NULL, history_at = NULL, meta_updated_by = ?, meta_updated_at = ? WHERE id = ?`, user.id, now(), h.item_id);
    await ctx.db.run('UPDATE structure_history SET restored_by = ?, restored_at = ? WHERE id = ?', user.id, now(), historyId);
    await audit(ctx, user.id, `${h.kind}.restored`, h.kind === 'label' ? 'metadata_label' : 'chapter', h.item_id, { historyId });
  });
  return listHistory(ctx);
}

const KIND_LABEL: Record<string, string> = { label: 'Label', chapter: 'Kapitel', subchapter: 'Unterkapitel' };

export async function listHistory(ctx: Ctx, opts: { includeRestored?: boolean } = {}) {
  const rows = await ctx.db.all(`SELECT * FROM structure_history WHERE project_id = ? ${opts.includeRestored ? '' : 'AND restored_at IS NULL'} ORDER BY created_at DESC, id DESC`, ctx.projectId);
  return rows.map((r) => ({
    id: r.id, kind: r.kind, kindLabel: KIND_LABEL[r.kind], itemId: r.item_id, title: r.title, parentTitle: r.parent_title ?? null,
    replacedBy: r.replaced_by_id ? { id: r.replaced_by_id, title: r.replaced_by_title } : null,
    validFrom: r.valid_from ?? null, validUntil: r.valid_until ?? null, note: r.note ?? null, moved: parseJson<Record<string, number>>(r.moved, {}),
    createdBy: r.created_by, createdAt: r.created_at, restoredAt: r.restored_at ?? null,
  }));
}

/** Historie für den Anhang im Handbuch (nur Kapitel, Unterkapitel und Labels, die nicht zurückgeholt wurden) */
export async function historyAppendix(ctx: Ctx) {
  return (await listHistory(ctx)).map((h) => ({
    kind: h.kindLabel, title: h.parentTitle && h.kind === 'subchapter' ? `${h.parentTitle} › ${h.title}` : h.title,
    validFrom: h.validFrom, validUntil: h.validUntil, replacedBy: h.replacedBy?.title ?? null, date: h.createdAt.slice(0, 10), note: h.note,
  }));
}

/** Anweisungen aller Kapitel und Unterkapitel als Markdown-Dateien (für ANWEISUNG.md im Arbeitsordner) */
export async function exportInstructions(ctx: Ctx) {
  const shape = (chapters: Awaited<ReturnType<typeof listStructure>>['chapters']) => chapters.map((c) => ({
    title: c.title, validFrom: c.validFrom, instruction: c.instruction, markdown: instructionMarkdown(c.title, c.instruction, c.validFrom),
    subchapters: c.subchapters.map((s) => ({ title: s.title, validFrom: s.validFrom, instruction: s.instruction, markdown: instructionMarkdown(s.title, s.instruction, s.validFrom) })),
  }));
  const variants = [];
  for (const o of (await structureOutlines(ctx)).filter((x) => x.chapters)) {
    variants.push({ familyId: o.familyId, name: o.name, chapters: shape((await listStructure(ctx, { outlineFamilyId: o.familyId })).chapters) });
  }
  return { format: 'onescm-instructions', chapters: shape((await listStructure(ctx)).chapters), variants };
}
