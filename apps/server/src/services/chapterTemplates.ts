// Eigene Kapitelvorlagen je Projekt (ADR-059): aus einem gelungenen Kapitel „Als Vorlage speichern“, pflegen und im
// Kapitel-Assistenten neben den mitgelieferten Vorlagen (ADR-055) anbieten.
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { CHAPTER_TEMPLATES } from '../domain/chapterTemplates.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { getChapterVersion } from './chapters.js';
import { assertIdsInProject } from './projects.js';

const dto = (r: Row) => ({
  id: r.id as string, name: r.name as string, description: (r.description as string | null) ?? '', titleHint: (r.title_hint as string | null) ?? '',
  purpose: r.purpose as string, prerequisites: parseJson<string[]>(r.prerequisites, []), steps: parseJson<string[]>(r.steps, []), result: r.result as string,
  hints: parseJson<string[]>(r.hints, []), builtin: false, sourceVersionId: (r.source_version_id as string | null) ?? null,
  createdBy: r.created_by as string, createdAt: r.created_at as string, updatedAt: (r.updated_at ?? r.created_at) as string,
});

/** Mitgelieferte (builtin) und eigene Vorlagen des Projekts */
export async function listChapterTemplates(ctx: Ctx) {
  const own = (await ctx.db.all('SELECT * FROM chapter_templates WHERE project_id = ? ORDER BY name', ctx.projectId)).map(dto);
  return [...CHAPTER_TEMPLATES.map((t) => ({ ...t, builtin: true })), ...own];
}

const LIST_ITEM = /^\s*(?:\d+[.)]|[-*•])\s+/;
const lines = (text: string) => text.split('\n').filter((l) => LIST_ITEM.test(l)).map((l) => l.replace(LIST_ITEM, '').trim()).filter(Boolean);
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
const cleanLines = (v: unknown, field: string) => {
  if (v === undefined) return undefined;
  if (!Array.isArray(v) || v.length > 40 || v.some((x) => typeof x !== 'string')) throw badRequest(`${field}: Liste von Texten (höchstens 40).`);
  return (v as string[]).map((x) => x.trim().slice(0, 600)).filter(Boolean);
};

/** Inhalt einer Kapitelversion in Vorlagenfelder übertragen */
async function fromVersion(ctx: Ctx, versionId: string) {
  const v = await getChapterVersion(ctx, versionId);
  const sec = (code: string) => v.sections.find((s) => s.code === code)?.blocks.filter((b: any) => b.kind !== 'gap') ?? [];
  const text = (code: string) => sec(code).map((b: any) => b.text as string).join('\n\n');
  const listOf = (code: string) => sec(code).flatMap((b: any) => (b.kind === 'list' ? lines(b.text) : [String(b.text).trim()])).filter(Boolean);
  return {
    purpose: text('purpose'), prerequisites: listOf('prerequisites'), steps: sec('steps').flatMap((b: any) => lines(b.text).length ? lines(b.text) : [String(b.text).trim()]),
    result: text('result'), hints: sec('hints').map((b: any) => String(b.text).trim()), title: v.title as string,
  };
}

export async function createChapterTemplate(ctx: Ctx, input: Record<string, unknown>, user: User) {
  const name = clip(input.name, 80);
  if (!name) throw badRequest('name ist Pflicht.');
  if (CHAPTER_TEMPLATES.some((t) => t.name.toLowerCase() === name.toLowerCase()) || await ctx.db.get('SELECT 1 FROM chapter_templates WHERE project_id = ? AND LOWER(name) = LOWER(?)', ctx.projectId, name)) {
    throw conflict(`Eine Vorlage „${name}“ gibt es bereits.`);
  }
  let fields: { purpose: string; prerequisites: string[]; steps: string[]; result: string; hints: string[] };
  let sourceVersionId: string | null = null;
  if (typeof input.fromVersionId === 'string') {
    // Quelle muss zum Projekt gehören (Mandantentrennung; IDs im Body prüft kein Pfad-Hook)
    await assertIdsInProject(ctx, 'versionId', [input.fromVersionId]);
    const f = await fromVersion(ctx, input.fromVersionId);
    if (!f.steps.length) throw badRequest('Das Kapitel enthält keine Schritte – als Vorlage ungeeignet.');
    fields = f;
    sourceVersionId = input.fromVersionId;
  } else {
    fields = { purpose: clip(input.purpose, 2000), prerequisites: cleanLines(input.prerequisites, 'prerequisites') ?? [], steps: cleanLines(input.steps, 'steps') ?? [], result: clip(input.result, 2000), hints: cleanLines(input.hints, 'hints') ?? [] };
    if (!fields.steps.length) throw badRequest('steps: mindestens ein Schritt.');
  }
  const id = newId('ct');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO chapter_templates (id, project_id, name, description, title_hint, purpose, prerequisites, steps, result, hints, source_version_id, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      id, ctx.projectId, name, clip(input.description, 300) || null, clip(input.titleHint, 160) || null, fields.purpose, json(fields.prerequisites), json(fields.steps), fields.result, json(fields.hints), sourceVersionId, user.id, now(),
    );
    await audit(ctx, user.id, 'chapter_template.created', 'chapter_template', id, { name, fromVersionId: sourceVersionId, steps: fields.steps.length });
  });
  return dto((await ctx.db.get('SELECT * FROM chapter_templates WHERE id = ?', id))!);
}

async function own(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM chapter_templates WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Kapitelvorlage ${id}`);
  return r;
}

export async function updateChapterTemplate(ctx: Ctx, id: string, input: Record<string, unknown>, user: User) {
  const r = await own(ctx, id);
  const name = input.name === undefined ? (r.name as string) : clip(input.name, 80);
  if (!name) throw badRequest('name darf nicht leer sein.');
  if (name.toLowerCase() !== String(r.name).toLowerCase() && (CHAPTER_TEMPLATES.some((t) => t.name.toLowerCase() === name.toLowerCase())
    || await ctx.db.get('SELECT 1 FROM chapter_templates WHERE project_id = ? AND LOWER(name) = LOWER(?) AND id <> ?', ctx.projectId, name, id))) {
    throw conflict(`Eine Vorlage „${name}“ gibt es bereits.`);
  }
  const steps = cleanLines(input.steps, 'steps');
  if (steps && !steps.length) throw badRequest('steps: mindestens ein Schritt.');
  const pick = <T>(v: T | undefined, cur: T) => (v === undefined ? cur : v);
  await ctx.db.tx(async () => {
    await ctx.db.run(
      'UPDATE chapter_templates SET name = ?, description = ?, title_hint = ?, purpose = ?, prerequisites = ?, steps = ?, result = ?, hints = ?, updated_by = ?, updated_at = ? WHERE id = ?',
      name, input.description === undefined ? r.description : clip(input.description, 300) || null, input.titleHint === undefined ? r.title_hint : clip(input.titleHint, 160) || null,
      input.purpose === undefined ? r.purpose : clip(input.purpose, 2000), pick(cleanLines(input.prerequisites, 'prerequisites') && json(cleanLines(input.prerequisites, 'prerequisites')), r.prerequisites),
      pick(steps && json(steps), r.steps), input.result === undefined ? r.result : clip(input.result, 2000), pick(cleanLines(input.hints, 'hints') && json(cleanLines(input.hints, 'hints')), r.hints),
      user.id, now(), id,
    );
    await audit(ctx, user.id, 'chapter_template.updated', 'chapter_template', id, { name });
  });
  return dto((await ctx.db.get('SELECT * FROM chapter_templates WHERE id = ?', id))!);
}

export async function deleteChapterTemplate(ctx: Ctx, id: string, user: User) {
  const r = await own(ctx, id);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM chapter_templates WHERE id = ?', id);
    await audit(ctx, user.id, 'chapter_template.deleted', 'chapter_template', id, { name: r.name });
  });
}

// ---------- Duplizieren, Export, Import (ADR-067) ----------

export const TEMPLATE_FORMAT = 'onescm-chapter-templates';
const MAX_IMPORT = 50;

/** Freier Name: „X“, sonst „X (2)“, „X (3)“ … – mitgelieferte Vorlagen zählen mit */
async function freeName(ctx: Ctx, base: string) {
  const taken = new Set([
    ...CHAPTER_TEMPLATES.map((t) => t.name.toLowerCase()),
    ...(await ctx.db.all('SELECT name FROM chapter_templates WHERE project_id = ?', ctx.projectId)).map((r) => String(r.name).toLowerCase()),
  ]);
  const root = base.slice(0, 72);
  if (!taken.has(root.toLowerCase())) return root;
  for (let i = 2; ; i++) if (!taken.has(`${root} (${i})`.toLowerCase())) return `${root} (${i})`;
}

type TemplateFields = { name: string; description: string; titleHint: string; purpose: string; prerequisites: string[]; steps: string[]; result: string; hints: string[] };
const fieldsOf = (t: TemplateFields) => ({
  name: t.name, description: t.description, titleHint: t.titleHint, purpose: t.purpose, prerequisites: t.prerequisites, steps: t.steps, result: t.result, hints: t.hints,
});

/** Eigene oder mitgelieferte Vorlage als neue eigene Vorlage „X (Kopie)“ anlegen – mitgelieferte so zum Anpassen */
export async function duplicateChapterTemplate(ctx: Ctx, id: string, user: User) {
  const builtin = CHAPTER_TEMPLATES.find((t) => t.id === id);
  const src = builtin ? { ...builtin } : dto(await own(ctx, id));
  const name = await freeName(ctx, `${src.name} (Kopie)`);
  return createChapterTemplate(ctx, { ...fieldsOf(src), name }, user);
}

/** Eigene Vorlagen als JSON-Datei (alle oder ausgewählte) – zum Übernehmen in andere Projekte oder Installationen */
export async function exportChapterTemplates(ctx: Ctx, ids?: string[]) {
  let rows = (await ctx.db.all('SELECT * FROM chapter_templates WHERE project_id = ? ORDER BY name', ctx.projectId)).map(dto);
  if (ids?.length) {
    rows = rows.filter((r) => ids.includes(r.id));
    if (rows.length !== new Set(ids).size) throw notFound('Kapitelvorlage');
  }
  return { format: TEMPLATE_FORMAT, version: 1, exportedAt: now(), templates: rows.map(fieldsOf) };
}

/**
 * Vorlagen aus einer Exportdatei anlegen. Erst wird alles geprüft (Format, höchstens 50, je Vorlage Name und Schritte),
 * dann angelegt – eine fehlerhafte Datei legt nichts an. Gleichnamige Vorlagen werden nicht überschrieben, sondern
 * unter freiem Namen („X (2)“) angelegt.
 */
export async function importChapterTemplates(ctx: Ctx, input: Record<string, unknown>, user: User) {
  if (input.format !== TEMPLATE_FORMAT || !Array.isArray(input.templates)) throw badRequest(`Keine Vorlagendatei (format „${TEMPLATE_FORMAT}“ mit templates erwartet).`);
  const list = input.templates as unknown[];
  if (!list.length) throw badRequest('Die Datei enthält keine Vorlagen.');
  if (list.length > MAX_IMPORT) throw badRequest(`Höchstens ${MAX_IMPORT} Vorlagen je Import.`);
  const prepared = list.map((raw, i) => {
    const t = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
    const at = `Vorlage ${i + 1}`;
    const name = clip(t.name, 80);
    if (!name) throw badRequest(`${at}: name fehlt.`);
    const steps = cleanLines(t.steps ?? [], `${at}: steps`) ?? [];
    if (!steps.length) throw badRequest(`${at} („${name}“): mindestens ein Schritt.`);
    return {
      name, description: clip(t.description, 300), titleHint: clip(t.titleHint, 160), purpose: clip(t.purpose, 2000), result: clip(t.result, 2000), steps,
      prerequisites: cleanLines(t.prerequisites ?? [], `${at}: prerequisites`) ?? [], hints: cleanLines(t.hints ?? [], `${at}: hints`) ?? [],
    };
  });
  // eine Transaktion für alle Vorlagen und das Protokoll (innere tx werden zusammengeführt): ganz oder gar nicht
  return ctx.db.tx(async () => {
    const created: { id: string; name: string; renamedFrom: string | null }[] = [];
    for (const t of prepared) {
      const name = await freeName(ctx, t.name);
      const c = await createChapterTemplate(ctx, { ...t, name }, user);
      created.push({ id: c.id, name: c.name, renamedFrom: name === t.name ? null : t.name });
    }
    await audit(ctx, user.id, 'chapter_template.imported', 'project', ctx.projectId, { count: created.length });
    return { imported: created.length, templates: created };
  });
}
