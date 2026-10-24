// Textbausteine (ADR-107, W-11, Single Sourcing): ein Absatz, der in mehreren Kapiteln gleich lauten soll, wird einmal
// gepflegt. Verknüpfte Absätze tragen Baustein und Fassung; eine neue Fassung wird auf Wunsch in Entwürfe der Kapitel
// übernommen (freigegebene Versionen bleiben, es entsteht ein Entwurf). Eigener Text im Absatz löst die Verknüpfung.
import { audit, type Ctx, type User } from '../context.js';
import { newId, now, type Row } from '../db.js';
import { BLOCK_KINDS, CHAPTER_SECTIONS } from '../domain/reference.js';
import { normalizeText } from '../domain/revision.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { applyModuleText, insertBlock, normalizePositions } from './chapters.js';
import { ensureDraft } from './revisions.js';

const MODULE_KINDS = ['paragraph', 'list', 'note', 'tip', 'warning', 'table'];
const SECTION_CODES: string[] = CHAPTER_SECTIONS.map((s) => s.code);
/** Kandidaten: gleicher Absatz (ab 8 Wörtern) in mindestens zwei Kapiteln */
const CANDIDATE_MIN_WORDS = 8;

const cleanKey = (v: unknown) => (typeof v === 'string' ? v.trim().toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) : '');
const cleanText = (v: unknown) => (typeof v === 'string' ? v.replace(/\r\n?/g, '\n').trim().slice(0, 20000) : '');

async function moduleRow(ctx: Ctx, id: string) {
  const m = await ctx.db.get('SELECT * FROM text_modules WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!m) throw notFound(`Textbaustein ${id}`);
  return m;
}

async function versionText(ctx: Ctx, id: string, no: number) {
  return (await ctx.db.get('SELECT text FROM text_module_versions WHERE module_id = ? AND version_no = ?', id, no))?.text as string;
}

/** Verknüpfte Absätze in der neuesten Version je Kapitel (abgelöste Kapitel zählen nicht) */
async function linkedBlocks(ctx: Ctx, moduleId: string) {
  return ctx.db.all(
    `SELECT b.id, b.lineage_id, b.module_version, b.section_code, v.id AS version_id, v.version_no, v.status, c.id AS chapter_id, c.title
     FROM content_blocks b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id
     WHERE b.module_id = ? AND b.deleted_at IS NULL AND c.project_id = ? AND c.history_at IS NULL
       AND v.version_no = (SELECT MAX(v2.version_no) FROM generated_chapter_versions v2 WHERE v2.chapter_id = c.id AND v2.status <> 'superseded')
     ORDER BY c.position, b.position`, moduleId, ctx.projectId,
  );
}

/** Nicht verknüpfte Absätze in der neuesten Version je Kapitel, deren Text einer Fassung des Bausteins gleicht */
async function adoptable(ctx: Ctx, moduleId: string) {
  const texts = new Set((await ctx.db.all('SELECT text FROM text_module_versions WHERE module_id = ?', moduleId)).map((r) => normalizeText(r.text)));
  const rows = await ctx.db.all(
    `SELECT b.id, b.lineage_id, b.text, b.section_code, v.id AS version_id, v.version_no, v.status, c.id AS chapter_id, c.title
     FROM content_blocks b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id
     WHERE b.module_id IS NULL AND b.deleted_at IS NULL AND b.kind NOT IN ('gap', 'xref') AND c.project_id = ? AND c.history_at IS NULL
       AND v.version_no = (SELECT MAX(v2.version_no) FROM generated_chapter_versions v2 WHERE v2.chapter_id = c.id AND v2.status <> 'superseded')`, ctx.projectId,
  );
  return rows.filter((r) => texts.has(normalizeText(r.text)));
}

async function dto(ctx: Ctx, m: Row, detail = false) {
  const linked = await linkedBlocks(ctx, m.id);
  const chapters = new Set(linked.map((l) => l.chapter_id));
  const outdated = linked.filter((l) => Number(l.module_version) < Number(m.current_version));
  const base = {
    id: m.id as string, key: m.module_key as string, title: m.title as string, kind: m.kind as string, versionNo: Number(m.current_version), status: m.status as string,
    text: await versionText(ctx, m.id, Number(m.current_version)), chapters: chapters.size, outdatedChapters: new Set(outdated.map((l) => l.chapter_id)).size,
    updatedBy: m.updated_by as string, updatedAt: m.updated_at as string,
  };
  if (!detail) return base;
  const versions = await ctx.db.all('SELECT version_no, text, note, created_by, created_at FROM text_module_versions WHERE module_id = ? ORDER BY version_no DESC', m.id);
  const byChapter = new Map<string, any>();
  for (const l of linked) {
    const c = byChapter.get(l.chapter_id) ?? { chapterId: l.chapter_id, title: l.title, versionId: l.version_id, versionNo: Number(l.version_no), status: l.status, blocks: 0, moduleVersions: [] as number[], outdated: false };
    c.blocks++;
    c.moduleVersions.push(Number(l.module_version));
    c.outdated ||= Number(l.module_version) < Number(m.current_version);
    byChapter.set(l.chapter_id, c);
  }
  const adopt = await adoptable(ctx, m.id);
  return {
    ...base,
    versions: versions.map((v) => ({ versionNo: Number(v.version_no), text: v.text, note: v.note ?? null, createdBy: v.created_by, createdAt: v.created_at })),
    usage: [...byChapter.values()],
    candidates: [...new Map(adopt.map((a) => [a.chapter_id, { chapterId: a.chapter_id, title: a.title, versionId: a.version_id, versionNo: Number(a.version_no), status: a.status }])).values()],
    markdownHint: `Textbaustein „${m.module_key}“`,
  };
}

export async function listTextModules(ctx: Ctx, q: { status?: string; q?: string } = {}) {
  const rows = await ctx.db.all('SELECT * FROM text_modules WHERE project_id = ? ORDER BY title', ctx.projectId);
  const needle = q.q?.trim().toLowerCase();
  const out = [];
  for (const r of rows) {
    if (q.status && r.status !== q.status) continue;
    const d = await dto(ctx, r);
    if (needle && !`${d.key} ${d.title} ${d.text}`.toLowerCase().includes(needle)) continue;
    out.push(d);
  }
  return out;
}

export async function getTextModule(ctx: Ctx, id: string) {
  return dto(ctx, await moduleRow(ctx, id), true);
}

export async function createTextModule(ctx: Ctx, input: Record<string, unknown>, user: User) {
  const text = cleanText(input.text);
  const title = typeof input.title === 'string' ? input.title.replace(/\s+/g, ' ').trim().slice(0, 120) : '';
  const key = cleanKey(input.key) || cleanKey(title);
  const kind = typeof input.kind === 'string' ? input.kind : 'paragraph';
  if (!title || !text) throw badRequest('title und text sind Pflicht.');
  if (!key) throw badRequest('key (Kennung) fehlt.');
  if (!MODULE_KINDS.includes(kind)) throw badRequest(`kind muss eines von ${MODULE_KINDS.join(', ')} sein.`);
  if (await ctx.db.get('SELECT 1 FROM text_modules WHERE project_id = ? AND module_key = ?', ctx.projectId, key)) throw conflict(`Kennung „${key}“ ist schon vergeben.`);
  const id = newId('tm');
  await ctx.db.tx(async () => {
    await ctx.db.run("INSERT INTO text_modules (id, project_id, module_key, title, kind, current_version, status, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, 1, 'active', ?, ?, ?, ?)",
      id, ctx.projectId, key, title, kind, user.id, now(), user.id, now());
    await ctx.db.run('INSERT INTO text_module_versions (module_id, version_no, text, note, created_by, created_at) VALUES (?, 1, ?, ?, ?, ?)', id, text, 'angelegt', user.id, now());
    await audit(ctx, user.id, 'text_module.created', 'text_module', id, { key });
  });
  return getTextModule(ctx, id);
}

/** Titel, Blocktyp, Status oder Text ändern; geänderter Text = neue Fassung (verknüpfte Absätze bleiben, bis sie aktualisiert werden) */
export async function updateTextModule(ctx: Ctx, id: string, input: Record<string, unknown>, user: User) {
  const m = await moduleRow(ctx, id);
  const title = typeof input.title === 'string' && input.title.trim() ? input.title.replace(/\s+/g, ' ').trim().slice(0, 120) : m.title;
  const kind = typeof input.kind === 'string' ? input.kind : m.kind;
  if (!MODULE_KINDS.includes(kind)) throw badRequest(`kind muss eines von ${MODULE_KINDS.join(', ')} sein.`);
  const status = input.status === 'retired' || input.status === 'active' ? input.status : m.status;
  const text = input.text !== undefined ? cleanText(input.text) : null;
  if (input.text !== undefined && !text) throw badRequest('text darf nicht leer sein.');
  const current = await versionText(ctx, id, Number(m.current_version));
  let version = Number(m.current_version);
  await ctx.db.tx(async () => {
    if (text && text !== current) {
      version++;
      await ctx.db.run('INSERT INTO text_module_versions (module_id, version_no, text, note, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        id, version, text, typeof input.note === 'string' ? input.note.trim().slice(0, 300) || null : null, user.id, now());
    }
    await ctx.db.run('UPDATE text_modules SET title = ?, kind = ?, status = ?, current_version = ?, updated_by = ?, updated_at = ? WHERE id = ?', title, kind, status, version, user.id, now(), id);
    await audit(ctx, user.id, 'text_module.updated', 'text_module', id, { version, status });
  });
  return getTextModule(ctx, id);
}

/** Baustein in ein Kapitel einfügen (am Ende des Abschnitts); bei freigegebener Version in einen neuen Entwurf */
export async function insertTextModule(ctx: Ctx, id: string, input: Record<string, unknown>, user: User) {
  const m = await moduleRow(ctx, id);
  if (m.status !== 'active') throw conflict('Der Textbaustein ist abgelegt und kann nicht eingefügt werden.');
  const chapterId = typeof input.chapterId === 'string' ? input.chapterId : '';
  const section = typeof input.section === 'string' ? input.section : '';
  if (!SECTION_CODES.includes(section)) throw badRequest(`section muss einer von ${SECTION_CODES.join(', ')} sein.`);
  if (!(await ctx.db.get('SELECT 1 FROM chapters WHERE id = ? AND project_id = ?', chapterId, ctx.projectId))) throw notFound(`Kapitel ${chapterId}`);
  const version = Number(m.current_version);
  const text = await versionText(ctx, id, version);
  let blockId = '';
  let draft = '';
  await ctx.db.tx(async () => {
    draft = await ensureDraft(ctx, chapterId, user.id);
    const max = Number((await ctx.db.get('SELECT MAX(position) AS m FROM content_blocks WHERE chapter_version_id = ? AND section_code = ? AND deleted_at IS NULL', draft, section))?.m ?? 0);
    blockId = await insertBlock(ctx, draft, {
      lineageId: newId('ln'), section, position: max + 10, kind: (BLOCK_KINDS as readonly string[]).includes(m.kind) ? m.kind : 'paragraph', text, mode: 'locked',
      market: null, release: null, scopeStatus: 'general', justification: `Textbaustein „${m.module_key}“ (Fassung ${version})`, comment: null,
      roles: [], divisions: [], sourceIds: [], moduleId: id, moduleVersion: version,
    }, user.id, `Textbaustein „${m.module_key}“ eingefügt`);
    await normalizePositions(ctx, draft);
    await audit(ctx, user.id, 'text_module.inserted', 'text_module', id, { chapterId, draft, blockId });
  });
  return { blockId, versionId: draft, module: await getTextModule(ctx, id) };
}

/**
 * Aktuelle Fassung in die Kapitel übernehmen: verknüpfte Absätze mit älterer Fassung und – mit `adopt` – Absätze mit
 * gleichem Text, die noch nicht verknüpft sind. Je Kapitel in einen Entwurf; eingereichte Kapitel werden übersprungen.
 */
export async function propagateTextModule(ctx: Ctx, id: string, input: { chapterIds?: unknown; adopt?: unknown }, user: User) {
  const m = await moduleRow(ctx, id);
  const version = Number(m.current_version);
  const text = await versionText(ctx, id, version);
  const only = Array.isArray(input.chapterIds) && input.chapterIds.length ? new Set(input.chapterIds.map(String)) : null;
  const targets = [
    ...(await linkedBlocks(ctx, id)).filter((l) => Number(l.module_version) < version),
    ...(input.adopt === true ? await adoptable(ctx, id) : []),
  ].filter((t) => !only || only.has(t.chapter_id));
  const byChapter = new Map<string, Row[]>();
  for (const t of targets) byChapter.set(t.chapter_id, [...(byChapter.get(t.chapter_id) ?? []), t]);
  const updated: { chapterId: string; title: string; versionId: string; blocks: number }[] = [];
  const skipped: { chapterId: string; title: string; reason: string }[] = [];
  for (const [chapterId, list] of byChapter) {
    if (list[0].status === 'in_review') {
      skipped.push({ chapterId, title: list[0].title, reason: 'zur Freigabe eingereicht – Einreichung zurückziehen, dann erneut aktualisieren' });
      continue;
    }
    await ctx.db.tx(async () => {
      const draft = await ensureDraft(ctx, chapterId, user.id);
      let n = 0;
      for (const t of list) {
        const b = await ctx.db.get('SELECT id FROM content_blocks WHERE chapter_version_id = ? AND lineage_id = ? AND deleted_at IS NULL', draft, t.lineage_id);
        if (!b) continue;
        await applyModuleText(ctx, b.id, text, { id, version }, user.id, `Textbaustein „${m.module_key}“ auf Fassung ${version} aktualisiert`);
        n++;
      }
      updated.push({ chapterId, title: list[0].title, versionId: draft, blocks: n });
    });
  }
  await audit(ctx, user.id, 'text_module.propagated', 'text_module', id, { version, chapters: updated.length, skipped: skipped.length });
  return { version, updated, skipped, module: await getTextModule(ctx, id) };
}

/** Wiederkehrende Absätze: gleicher Text (ab 8 Wörtern) in mindestens zwei Kapiteln, noch ohne Baustein */
export async function textModuleCandidates(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT b.text, b.kind, c.id AS chapter_id, c.title FROM content_blocks b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id
     WHERE b.module_id IS NULL AND b.deleted_at IS NULL AND b.kind IN ('paragraph', 'list', 'note', 'tip', 'warning') AND c.project_id = ? AND c.history_at IS NULL
       AND v.version_no = (SELECT MAX(v2.version_no) FROM generated_chapter_versions v2 WHERE v2.chapter_id = c.id AND v2.status <> 'superseded')`, ctx.projectId,
  );
  const groups = new Map<string, { text: string; kind: string; chapters: Map<string, string> }>();
  for (const r of rows) {
    const norm = normalizeText(r.text);
    if (norm.split(' ').length < CANDIDATE_MIN_WORDS || /^dieses kapitel betrifft folgende rollen/.test(norm)) continue;
    const g = groups.get(norm) ?? { text: r.text, kind: r.kind, chapters: new Map() };
    g.chapters.set(r.chapter_id, r.title);
    groups.set(norm, g);
  }
  return [...groups.values()].filter((g) => g.chapters.size >= 2).sort((a, b) => b.chapters.size - a.chapters.size).slice(0, 30)
    .map((g) => ({ text: g.text, kind: g.kind, chapters: [...g.chapters].map(([chapterId, title]) => ({ chapterId, title })) }));
}
