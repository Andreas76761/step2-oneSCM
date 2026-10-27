// Arbeitsbereiche Pipeline, Backlog und Intern (ADR-098)
// - Pipeline: Jira-Tickets in Bearbeitung, noch nicht produktiv, je Kapitel/Unterkapitel der aktuellen Gliederung – mit
//   Erstelldatum, Stream, Produktionsdatum und der Vorab-Dokumentation. Ist ein Ticket produktiv, übernimmt die Redaktion
//   die Dokumentation als Quelle des Kapitels (normaler Import, Evidenz „unbestätigt“ bis zur Bestätigung).
// - Backlog: Tickets, deren Bearbeitung noch nicht begonnen hat; wechseln beim nächsten Abgleich in die Pipeline.
// - Intern: interne Themen (Testing, Reporting, Systeme, Migration, Rollout, Other) – nie im Handbuch, Export oder Release.
import { audit, privacyNames, type Ctx, type User } from '../context.js';
import { newId, now, type Row } from '../db.js';
import { detectPrivacy, pseudonymize } from '../domain/privacy.js';
import { manualClass } from '../domain/releaseLetter.js';
import {
  AREA_LABEL, AREAS, cleanDate, germanDate, placeOf, STATE_LABEL, suggestChapter, TOPIC_FOLDER, TOPIC_LABEL, TOPICS,
  type Area, type OutlineEntry, type Topic, type WorkState,
} from '../domain/workAreas.js';
import { badRequest, conflict, notFound, unprocessable } from '../problem.js';
import { importNow } from './imports.js';

const KEY_RE = /^[A-Z][A-Z0-9_]+-\d+$/;
const MAX_TEXT = 50_000;
const today = () => new Date().toISOString().slice(0, 10);

/** Aktuelle Gliederung: Kapitel und Unterkapitel der Quellen ohne Historie, ohne Varianten und Sammelkapitel */
export async function currentOutline(ctx: Ctx): Promise<OutlineEntry[]> {
  const chapters = await ctx.db.all(
    `SELECT id, title FROM chapters WHERE project_id = ? AND outline_family_id IS NULL AND history_at IS NULL AND key NOT IN ('__none__', 'jira-tickets', 'wissensnotizen') ORDER BY position, title`,
    ctx.projectId,
  );
  const out: OutlineEntry[] = [];
  for (const c of chapters) {
    const subs = await ctx.db.all('SELECT id, title FROM subchapters WHERE chapter_id = ? AND history_at IS NULL ORDER BY position, title', c.id);
    out.push({ chapterId: c.id, chapterTitle: c.title, subchapters: subs.map((s) => ({ id: s.id as string, title: s.title as string })) });
  }
  return out;
}

function dto(r: Row, outline: Map<string, { chapter: string; subs: Map<string, string> }>) {
  const c = r.chapter_id ? outline.get(r.chapter_id) : undefined;
  return {
    id: r.id, area: r.area as Area, areaLabel: AREA_LABEL[r.area as Area], topic: (r.topic ?? null) as Topic | null, topicLabel: r.topic ? TOPIC_LABEL[r.topic as Topic] : null,
    origin: r.origin, jiraKey: r.jira_key ?? null, documentId: r.document_id ?? null, title: r.title, jiraStatus: r.jira_status ?? null, jiraType: r.jira_type ?? null,
    stream: r.stream ?? null, createdOn: r.created_on ?? null, productionDate: r.production_date ?? null,
    chapterId: r.chapter_id ?? null, chapterTitle: c?.chapter ?? null, subchapterId: r.subchapter_id ?? null, subchapterTitle: (r.subchapter_id && c?.subs.get(r.subchapter_id)) || null,
    chapterSource: r.chapter_source ?? null, text: r.text, documented: !!String(r.text ?? '').trim(),
    state: r.state as WorkState, stateLabel: STATE_LABEL[r.state as WorkState],
    liveImportId: r.live_import_id ?? null, liveBy: r.live_by ?? null, liveAt: r.live_at ?? null,
    createdBy: r.created_by, createdAt: r.created_at, updatedBy: r.updated_by, updatedAt: r.updated_at,
  };
}
export type WorkItem = ReturnType<typeof dto>;

const outlineMap = (o: OutlineEntry[]) => new Map(o.map((c) => [c.chapterId, { chapter: c.chapterTitle, subs: new Map(c.subchapters.map((s) => [s.id, s.title])) }]));

async function itemRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM work_items WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Eintrag ${id}`);
  return r;
}

/** Einträge eines Bereichs; Pipeline zusätzlich gruppiert nach Kapitel und Unterkapitel der aktuellen Gliederung */
export async function listWorkItems(ctx: Ctx, opts: { area?: string; topic?: string; chapterId?: string } = {}) {
  if (opts.area && !AREAS.includes(opts.area as Area)) throw badRequest(`area muss eines von ${AREAS.join(', ')} sein.`);
  if (opts.topic && !TOPICS.includes(opts.topic as Topic)) throw badRequest(`topic muss eines von ${TOPICS.join(', ')} sein.`);
  const where = ['project_id = ?'];
  const args: unknown[] = [ctx.projectId];
  if (opts.area) where.push('area = ?'), args.push(opts.area);
  if (opts.topic) where.push('topic = ?'), args.push(opts.topic);
  if (opts.chapterId) where.push('chapter_id = ?'), args.push(opts.chapterId);
  const outline = await currentOutline(ctx);
  const map = outlineMap(outline);
  const rows = await ctx.db.all(`SELECT * FROM work_items WHERE ${where.join(' AND ')} ORDER BY production_date IS NULL, production_date, jira_key, title`, ...args);
  const items = rows.map((r) => dto(r, map));
  const counts = Object.fromEntries(AREAS.map((a) => [a, 0])) as Record<Area, number>;
  const topics = Object.fromEntries(TOPICS.map((t) => [t, 0])) as Record<Topic, number>;
  for (const r of await ctx.db.all('SELECT area, topic, COUNT(*) AS n FROM work_items WHERE project_id = ? AND state <> ? GROUP BY area, topic', ctx.projectId, 'cancelled')) {
    counts[r.area as Area] = (counts[r.area as Area] ?? 0) + Number(r.n);
    if (r.topic) topics[r.topic as Topic] = Number(r.n);
  }
  // Pipeline je Gliederungspunkt: Kapitel → Unterkapitel; ohne Zuordnung am Ende
  const groups = outline.map((c) => ({
    chapterId: c.chapterId, chapterTitle: c.chapterTitle,
    items: items.filter((i) => i.chapterId === c.chapterId && !i.subchapterId).map((i) => i.id),
    subchapters: c.subchapters.map((s) => ({ id: s.id, title: s.title, items: items.filter((i) => i.subchapterId === s.id).map((i) => i.id) })).filter((s) => s.items.length),
  })).filter((g) => g.items.length || g.subchapters.length);
  const unassigned = items.filter((i) => !i.chapterId || !map.has(i.chapterId)).map((i) => i.id);
  return {
    items, groups, unassigned, counts, topicCounts: topics, outline,
    areaLabels: AREA_LABEL, topicLabels: TOPIC_LABEL, topicFolders: TOPIC_FOLDER, stateLabels: STATE_LABEL,
    ready: items.filter((i) => i.state === 'ready').length,
  };
}

interface Input {
  area?: unknown; topic?: unknown; title?: unknown; jiraKey?: unknown; stream?: unknown; createdOn?: unknown; productionDate?: unknown;
  chapterId?: unknown; subchapterId?: unknown; text?: unknown; state?: unknown; pseudonymize?: unknown;
}

async function clean(ctx: Ctx, input: Input, prev?: Row) {
  const area = String(input.area ?? prev?.area ?? '') as Area;
  if (!AREAS.includes(area)) throw badRequest(`area muss eines von ${AREAS.join(', ')} sein.`);
  let topic = (input.topic === undefined ? prev?.topic ?? null : input.topic || null) as Topic | null;
  if (area === 'intern') {
    if (!topic || !TOPICS.includes(topic)) throw badRequest(`Für Intern ist topic Pflicht: ${TOPICS.join(', ')}.`);
  } else topic = null;
  let title = String(input.title ?? prev?.title ?? '').trim().replace(/\s+/g, ' ');
  if (title.length < 3 || title.length > 200) throw badRequest('title braucht 3 bis 200 Zeichen.');
  const jiraKey = input.jiraKey === undefined ? prev?.jira_key ?? null : String(input.jiraKey ?? '').trim().toUpperCase() || null;
  if (jiraKey && !KEY_RE.test(jiraKey)) throw badRequest('jiraKey ist eine Ticketnummer wie ONESCM-123.');
  if (prev?.origin === 'jira' && jiraKey !== prev.jira_key) throw badRequest('Die Ticketnummer eines Jira-Eintrags lässt sich nicht ändern.');
  if (jiraKey && jiraKey !== prev?.jira_key && (await ctx.db.get('SELECT id FROM work_items WHERE project_id = ? AND jira_key = ?', ctx.projectId, jiraKey))) {
    throw conflict(`Ticket ${jiraKey} hat schon einen Eintrag.`);
  }
  const stream = input.stream === undefined ? prev?.stream ?? null : String(input.stream ?? '').trim().slice(0, 80) || null;
  const date = (v: unknown, field: string, old: string | null) => {
    if (v === undefined) return old;
    const d = cleanDate(v);
    if (d === 'invalid') throw badRequest(`${field} ist ein Datum (TT.MM.JJJJ oder JJJJ-MM-TT).`);
    return d;
  };
  const createdOn = date(input.createdOn, 'createdOn', prev?.created_on ?? today());
  const productionDate = date(input.productionDate, 'productionDate', prev?.production_date ?? null);
  // Gliederung: Unterkapitel muss zum Kapitel gehören; ein Unterkapitel allein bestimmt das Kapitel
  let chapterId = input.chapterId === undefined ? prev?.chapter_id ?? null : String(input.chapterId ?? '') || null;
  let subchapterId = input.subchapterId === undefined ? (input.chapterId === undefined ? prev?.subchapter_id ?? null : null) : String(input.subchapterId ?? '') || null;
  if (subchapterId) {
    const s = await ctx.db.get('SELECT s.chapter_id FROM subchapters s JOIN chapters c ON c.id = s.chapter_id WHERE s.id = ? AND c.project_id = ?', subchapterId, ctx.projectId);
    if (!s) throw badRequest(`Unterkapitel ${subchapterId} gibt es nicht.`);
    if (chapterId && chapterId !== s.chapter_id) throw badRequest('Das Unterkapitel gehört nicht zum gewählten Kapitel.');
    chapterId = s.chapter_id;
  }
  if (chapterId && !(await ctx.db.get('SELECT id FROM chapters WHERE id = ? AND project_id = ?', chapterId, ctx.projectId))) throw badRequest(`Kapitel ${chapterId} gibt es nicht.`);
  const chapterSource = input.chapterId === undefined && input.subchapterId === undefined ? prev?.chapter_source ?? null : chapterId ? 'manual' : null;
  let text = input.text === undefined ? String(prev?.text ?? '') : String(input.text ?? '').replace(/\r\n?/g, '\n').trim();
  if (text.length > MAX_TEXT) throw badRequest(`text höchstens ${MAX_TEXT} Zeichen.`);
  // Datenschutz wie bei Wissensnotizen: Fund → abweisen oder pseudonymisieren
  const names = await privacyNames(ctx.db);
  const hits = detectPrivacy(`${title}\n${text}`, { names });
  if (hits.length && input.pseudonymize !== true) {
    throw unprocessable('Der Eintrag enthält mögliche personenbezogene Daten. Bitte entfernen oder „pseudonymisieren“ wählen.', { hits: hits.map((h) => ({ kind: h.kind, match: h.match })) });
  }
  if (hits.length) {
    title = pseudonymize(title, { names }).text;
    text = pseudonymize(text, { names }).text;
  }
  // Zustand: „abgebrochen“ setzen oder zurücknehmen geht von Hand; „dokumentiert“ folgt aus dem Text
  let state = (prev?.state ?? 'open') as WorkState;
  if (input.state !== undefined) {
    if (input.state === 'cancelled') state = 'cancelled';
    else if (input.state === 'open' && state === 'cancelled') state = 'open';
    else if (input.state !== state) throw badRequest('state lässt sich nur auf cancelled setzen oder von cancelled auf open zurücknehmen; ins Handbuch übernehmen über „go-live“.');
  }
  if (state === 'open' && text) state = 'documented';
  if (state === 'documented' && !text) state = 'open';
  if (state === 'ready' && area !== 'pipeline') state = text ? 'documented' : 'open';
  return { area, topic, title, jiraKey, stream, createdOn, productionDate, chapterId, subchapterId: chapterId ? subchapterId : null, chapterSource: chapterId ? chapterSource : null, text, state, pseudonymized: hits.length > 0 };
}

export async function createWorkItem(ctx: Ctx, input: Input, user: User) {
  const v = await clean(ctx, input);
  const id = newId('wi');
  const at = now();
  await ctx.db.run(
    `INSERT INTO work_items (id, project_id, area, topic, origin, jira_key, title, stream, created_on, production_date, chapter_id, subchapter_id, chapter_source, text, state, created_by, created_at, updated_by, updated_at)
     VALUES (?, ?, ?, ?, 'manual', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id, ctx.projectId, v.area, v.topic, v.jiraKey, v.title, v.stream, v.createdOn, v.productionDate, v.chapterId, v.subchapterId, v.chapterSource, v.text, v.state, user.id, at, user.id, at,
  );
  await audit(ctx, user.id, 'work_item.created', 'work_item', id, { area: v.area, topic: v.topic, jiraKey: v.jiraKey, pseudonymized: v.pseudonymized });
  return getWorkItem(ctx, id);
}

export async function getWorkItem(ctx: Ctx, id: string) {
  return dto(await itemRow(ctx, id), outlineMap(await currentOutline(ctx)));
}

export async function updateWorkItem(ctx: Ctx, id: string, input: Input, user: User) {
  const prev = await itemRow(ctx, id);
  if (prev.state === 'live') throw conflict('Der Eintrag ist schon ins Handbuch übernommen – Änderungen bitte im Kapitel.');
  const v = await clean(ctx, input, prev);
  await ctx.db.run(
    `UPDATE work_items SET area = ?, topic = ?, jira_key = ?, title = ?, stream = ?, created_on = ?, production_date = ?, chapter_id = ?, subchapter_id = ?, chapter_source = ?, text = ?, state = ?, updated_by = ?, updated_at = ?
     WHERE id = ?`,
    v.area, v.topic, v.jiraKey, v.title, v.stream, v.createdOn, v.productionDate, v.chapterId, v.subchapterId, v.chapterSource, v.text, v.state, user.id, now(), id,
  );
  await audit(ctx, user.id, 'work_item.updated', 'work_item', id, { area: v.area, topic: v.topic, state: v.state, movedFrom: prev.area !== v.area ? prev.area : undefined });
  return getWorkItem(ctx, id);
}

/** Löschen nur für eigene Einträge; Jira-Einträge kommen beim nächsten Abgleich wieder – dort „abgebrochen“ setzen */
export async function deleteWorkItem(ctx: Ctx, id: string, user: User) {
  const r = await itemRow(ctx, id);
  if (r.origin === 'jira') throw conflict('Einträge aus Jira-Tickets werden nicht gelöscht – bitte auf „abgebrochen“ setzen.');
  if (r.state === 'live') throw conflict('Der Eintrag ist ins Handbuch übernommen und bleibt als Nachweis erhalten.');
  await ctx.db.run('DELETE FROM work_items WHERE id = ?', id);
  await audit(ctx, user.id, 'work_item.deleted', 'work_item', id, { area: r.area, title: r.title });
}

// ---------------------------------------------------------------- Abgleich mit den eingelesenen Jira-Tickets

/** Tickets der Jira-Importe (aktuelle Revision): Felder aus dem gespeicherten JSON (ohne Personenfelder) */
async function jiraTickets(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT d.id AS document_id, r.original_key FROM source_documents d JOIN source_revisions r ON r.document_id = d.id
     WHERE d.project_id = ? AND d.removed_at IS NULL AND r.is_current = 1 AND r.source_format = 'jira'`, ctx.projectId,
  );
  const out: { documentId: string; key: string; summary: string; type: string; status: string; created: string; stream: string; productionDate: string; text: string }[] = [];
  for (const r of rows) {
    try {
      const o = JSON.parse((await ctx.store.get(r.original_key)).toString('utf8'));
      if (!KEY_RE.test(String(o?.key ?? ''))) continue;
      const list = (v: unknown) => (Array.isArray(v) ? v.map(String) : []);
      out.push({
        documentId: r.document_id, key: String(o.key), summary: String(o.summary ?? ''), type: String(o.type ?? ''), status: String(o.status ?? ''),
        created: cleanDate(o.created) && cleanDate(o.created) !== 'invalid' ? String(cleanDate(o.created)) : '', stream: String(o.stream ?? ''),
        productionDate: cleanDate(o.productionDate) && cleanDate(o.productionDate) !== 'invalid' ? String(cleanDate(o.productionDate)) : '',
        text: [o.summary, ...list(o.components), ...list(o.labels), o.epic].filter(Boolean).join(' '),
      });
    } catch {
      // Original fehlt oder ist kein JSON – Ticket überspringen
    }
  }
  return out.sort((a, b) => a.key.localeCompare(b.key, 'en', { numeric: true }));
}

/** Kapitel, deren aktuelle Fassung ein Ticket als Quelle nutzt (wie im Release-Abgleich) */
async function handbookChapters(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT DISTINCT r.document_id, c.id AS chapter_id FROM content_blocks b
     JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id
     JOIN content_block_sources x ON x.block_id = b.id JOIN text_snippets s ON s.id = x.snippet_id JOIN source_revisions r ON r.id = s.revision_id
     WHERE c.project_id = ? AND b.deleted_at IS NULL AND v.status <> 'superseded' AND r.source_format = 'jira' AND c.outline_family_id IS NULL`, ctx.projectId,
  );
  return new Map(rows.map((r) => [r.document_id as string, r.chapter_id as string]));
}

/**
 * Jira-Tickets → Pipeline/Backlog. Neue Tickets (ohne Bugs, die intern bleiben) bekommen einen Eintrag mit Kapitelvorschlag;
 * vorhandene folgen dem Status (Backlog ↔ Pipeline, produktiv → „übernehmen“, abgebrochen). Leere Felder füllt Jira,
 * von Hand gesetzte bleiben. Nach Intern verschobene Einträge bleiben in Intern.
 */
export async function syncFromJira(ctx: Ctx, user: User) {
  const tickets = await jiraTickets(ctx);
  const outline = await currentOutline(ctx);
  const known = new Set(outline.map((c) => c.chapterId));
  const usedBy = await handbookChapters(ctx);
  const day = today();
  const stats = { tickets: tickets.length, created: 0, updated: 0, moved: 0, ready: 0, cancelled: 0, skipped: 0 };
  const at = now();
  await ctx.db.tx(async () => {
    for (const t of tickets) {
      const prev = await ctx.db.get('SELECT * FROM work_items WHERE project_id = ? AND jira_key = ?', ctx.projectId, t.key);
      if (!prev) {
        const place = placeOf(t, day);
        // nur, was noch kommt: produktive und abgebrochene Tickets brauchen keinen Eintrag, Bugs gehören nicht ins Handbuch
        if ((place !== 'pipeline' && place !== 'backlog') || manualClass(t.type) === 'internal') {
          stats.skipped++;
          continue;
        }
        const used = usedBy.get(t.documentId);
        const s = used && known.has(used) ? { chapterId: used, subchapterId: null } : suggestChapter(t.text, outline);
        const source = used && known.has(used) ? 'handbook' : s ? 'suggested' : null;
        await ctx.db.run(
          `INSERT INTO work_items (id, project_id, area, topic, origin, jira_key, document_id, title, jira_status, jira_type, stream, created_on, production_date, jira_production_date, chapter_id, subchapter_id, chapter_source, text, state, created_by, created_at, updated_by, updated_at)
           VALUES (?, ?, ?, NULL, 'jira', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', 'open', ?, ?, ?, ?)`,
          newId('wi'), ctx.projectId, place, t.key, t.documentId, t.summary || t.key, t.status, t.type, t.stream || null, t.created || null, t.productionDate || null, t.productionDate || null,
          s?.chapterId ?? null, s?.subchapterId ?? null, source, user.id, at, user.id, at,
        );
        stats.created++;
        continue;
      }
      if (prev.state === 'live') continue;
      // von Hand geändertes Produktionsdatum gilt vor dem aus Jira
      const manualDate = prev.production_date && prev.production_date !== (prev.jira_production_date ?? null);
      const productionDate = manualDate ? prev.production_date : t.productionDate || prev.production_date || null;
      const place = placeOf({ status: t.status, productionDate: productionDate ?? '' }, day);
      let area = prev.area as Area;
      let state = prev.state as WorkState;
      if (area !== 'intern' && (place === 'pipeline' || place === 'backlog') && area !== place) {
        area = place;
        stats.moved++;
      }
      // ein Backlog-Ticket, das zwischen zwei Abgleichen schon produktiv ging, gehört in die Pipeline und ist bereit
      if (place === 'live' && area === 'backlog') {
        area = 'pipeline';
        stats.moved++;
      }
      if (place === 'live' && area === 'pipeline' && state !== 'ready' && state !== 'cancelled') {
        state = 'ready';
        stats.ready++;
      } else if (place === 'cancelled' && state !== 'cancelled') {
        state = 'cancelled';
        stats.cancelled++;
      } else if (place !== 'live' && place !== 'cancelled' && (state === 'ready' || (state === 'cancelled' && prev.jira_status !== t.status))) {
        // wieder in Arbeit (z. B. Produktionsdatum verschoben) bzw. nach Abbruch wieder aufgenommen
        state = String(prev.text ?? '').trim() ? 'documented' : 'open';
      }
      await ctx.db.run(
        `UPDATE work_items SET area = ?, state = ?, document_id = ?, title = CASE WHEN title = jira_key OR title = '' THEN ? ELSE title END, jira_status = ?, jira_type = ?,
           stream = COALESCE(stream, ?), created_on = COALESCE(created_on, ?), production_date = ?,
           jira_production_date = ?, updated_by = ?, updated_at = ? WHERE id = ?`,
        area, state, t.documentId, t.summary || t.key, t.status, t.type, t.stream || null, t.created || null,
        productionDate, t.productionDate || null, user.id, at, prev.id,
      );
      stats.updated++;
    }
    await audit(ctx, user.id, 'work_items.synced', 'project', ctx.projectId, stats);
  });
  return { ...stats, ...(await listWorkItems(ctx, { area: 'pipeline' })) };
}

// ---------------------------------------------------------------- Übernahme ins Handbuch

const demote = (md: string) => md.split('\n').map((l) => l.replace(/^(#{1,4})\s/, (_, h: string) => `${'#'.repeat(Math.min(6, h.length + 2))} `)).join('\n');

/**
 * Produktiv: Vorab-Dokumentation als Quelle des Kapitels einlesen (H1 = Kapitel, H2 = Unterkapitel), Evidenz „unbestätigt“ –
 * Bestätigen, Generieren und Freigeben bleiben der Redaktion. Der Eintrag bleibt als Nachweis mit Status „übernommen“.
 */
export async function goLive(ctx: Ctx, id: string, user: User) {
  const r = await itemRow(ctx, id);
  if (r.area !== 'pipeline') throw conflict('Ins Handbuch übernehmen lassen sich nur Einträge der Pipeline.');
  if (r.state === 'live') throw conflict('Der Eintrag ist schon übernommen.');
  if (r.state === 'cancelled') throw conflict('Der Eintrag ist abgebrochen.');
  if (!String(r.text ?? '').trim()) throw unprocessable('Es gibt noch keine Vorab-Dokumentation zum Übernehmen.');
  const outline = outlineMap(await currentOutline(ctx));
  const c = r.chapter_id ? outline.get(r.chapter_id) : undefined;
  if (!c) throw unprocessable('Bitte zuerst Kapitel (und ggf. Unterkapitel) der Gliederung zuordnen.');
  const sub = r.subchapter_id ? c.subs.get(r.subchapter_id) : undefined;
  const fm = ['---', 'evidence_status: unconfirmed', 'source_type: pipeline', ...(r.jira_key ? [`jira_key: ${JSON.stringify(r.jira_key)}`] : []),
    ...(r.stream ? [`stream: ${JSON.stringify(r.stream)}`] : []), ...(r.production_date ? [`production_date: ${JSON.stringify(r.production_date)}`] : []), '---'];
  const md = [...fm, '', `# ${c.chapter}`, '', ...(sub ? [`## ${sub}`, ''] : []), demote(r.text), ''].join('\n');
  const imp = await importNow(ctx, `pipeline-${r.jira_key ?? r.id}.md`, Buffer.from(md, 'utf8'), user.id, 'pipeline');
  const item = imp.items.find((i: any) => i.path.endsWith('.md'));
  if (imp.status === 'failed' || item?.status === 'failed') throw unprocessable(`Die Dokumentation konnte nicht eingelesen werden: ${item?.message ?? imp.error ?? 'unbekannter Fehler'}`);
  const at = now();
  await ctx.db.run("UPDATE work_items SET state = 'live', live_import_id = ?, live_by = ?, live_at = ?, updated_by = ?, updated_at = ? WHERE id = ?", imp.id, user.id, at, user.id, at, id);
  await audit(ctx, user.id, 'work_item.live', 'work_item', id, { jiraKey: r.jira_key, importId: imp.id, chapterId: r.chapter_id, subchapterId: r.subchapter_id });
  return { item: await getWorkItem(ctx, id), importId: imp.id, importStatus: item?.status ?? imp.status };
}

// ---------------------------------------------------------------- Export für den Arbeitsordner

/** Ticketdatei im Arbeitsordner (gleiche Form für Pipeline und Backlog) */
export function itemMarkdown(i: WorkItem) {
  const rows: [string, string][] = [
    ['Ticket', i.jiraKey ?? '–'], ['Bereich', i.topicLabel ? `${i.areaLabel} › ${i.topicLabel}` : i.areaLabel], ['Status (Jira)', i.jiraStatus ?? '–'],
    ['Erstelldatum', germanDate(i.createdOn) || '–'], ['Stream', i.stream ?? '[offen]'], ['Produktionsdatum', germanDate(i.productionDate) || '[offen]'],
    ['Gliederung', [i.chapterTitle, i.subchapterTitle].filter(Boolean).join(' › ') || '[offen]'], ['Dokumentation', i.stateLabel],
  ];
  return [
    `# ${i.jiraKey ? `${i.jiraKey} ` : ''}${i.title}`, '',
    i.area === 'intern' ? '> Intern – nicht für das Handbuch, keine Veröffentlichung.' : '> Noch nicht produktiv – nicht ins Handbuch übernehmen, bevor das Ticket produktiv ist (Produktionsdatum erreicht, Mensch bestätigt).', '',
    '| Feld | Wert |', '|---|---|', ...rows.map(([k, v]) => `| ${k} | ${v.replace(/\|/g, '\\|')} |`), '',
    '## Dokumentation', '', i.text.trim() || '[offen]', '',
  ].join('\n');
}

export async function exportWorkAreas(ctx: Ctx) {
  const all = await listWorkItems(ctx);
  const items = all.items.filter((i) => i.state !== 'cancelled');
  const pick = (i: WorkItem) => ({
    id: i.id, jiraKey: i.jiraKey, title: i.title, area: i.area, topic: i.topic, topicFolder: i.topic ? TOPIC_FOLDER[i.topic] : null, jiraStatus: i.jiraStatus, stream: i.stream,
    createdOn: i.createdOn, productionDate: i.productionDate, chapterTitle: i.chapterTitle, subchapterTitle: i.subchapterTitle, state: i.state, markdown: itemMarkdown(i),
  });
  return {
    format: 'onescm-work-areas', version: 1, exportedAt: now(),
    pipeline: items.filter((i) => i.area === 'pipeline').map(pick),
    backlog: items.filter((i) => i.area === 'backlog').map(pick),
    intern: items.filter((i) => i.area === 'intern').map(pick),
    topics: TOPICS.map((t) => ({ code: t, label: TOPIC_LABEL[t], folder: TOPIC_FOLDER[t] })),
  };
}
