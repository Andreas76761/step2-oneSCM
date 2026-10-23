// Wissensnotizen als eigene Quelle (ADR-084, F-15): Frage, Erkenntnis und optional ein Screenshot werden als
// Markdown-Quelle „wissensnotizen/<id>.md“ über die normale Importpipeline eingelesen – mit Revisionen, Chunks,
// Bildern (Pflicht-Alternativtext), Rollen und Sparten. Personenbezogene Daten werden abgewiesen oder pseudonymisiert.
import JSZip from 'jszip';
import { audit, privacyNames, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { escapeAlt, MIME_EXT, sniffImage } from '../domain/media.js';
import { detectPrivacy, pseudonymize } from '../domain/privacy.js';
import { badRequest, conflict, notFound, unprocessable } from '../problem.js';
import { importNow } from './imports.js';

const ROLES = ['dealer', 'market', 'mo', 'hq', 'all'];
const DIVISIONS = ['car', 'van', 'all']; // nur Pkw und Van (Entscheidung 23.10.2026)
const MAX_IMAGE = 5 * 1024 * 1024;
const FOLDER = 'wissensnotizen';

interface NoteInput {
  question?: unknown; insight?: unknown; roles?: unknown; divisions?: unknown; confirmed?: unknown;
  image?: { name?: unknown; data?: unknown } | null; imageAlt?: unknown; pseudonymize?: unknown;
}

const list = (v: unknown, allowed: string[], field: string) => {
  if (v === undefined) return ['all'];
  if (!Array.isArray(v) || !v.length || v.some((x) => !allowed.includes(String(x)))) throw badRequest(`${field} muss eine Liste aus ${allowed.join(', ')} sein.`);
  return [...new Set(v.map(String))];
};

async function clean(ctx: Ctx, input: NoteInput, previous?: Row) {
  let question = String(input.question ?? previous?.question ?? '').trim().replace(/\s+/g, ' ');
  let insight = String(input.insight ?? previous?.insight ?? '').trim();
  if (question.length < 5 || question.length > 300) throw badRequest('question braucht 5 bis 300 Zeichen.');
  if (insight.length < 5 || insight.length > 20000) throw badRequest('insight braucht 5 bis 20 000 Zeichen.');
  const names = await privacyNames(ctx.db);
  const hits = detectPrivacy(`${question}\n${insight}`, { names });
  if (hits.length && input.pseudonymize !== true) {
    throw unprocessable('Die Notiz enthält mögliche personenbezogene Daten. Bitte entfernen oder „pseudonymisieren“ wählen.', { hits: hits.map((h) => ({ kind: h.kind, match: h.match })) });
  }
  if (hits.length) {
    question = pseudonymize(question, { names }).text;
    insight = pseudonymize(insight, { names }).text;
  }
  const roles = input.roles === undefined && previous ? parseJson<string[]>(previous.roles, ['all']) : list(input.roles, ROLES, 'roles');
  const divisions = input.divisions === undefined && previous ? parseJson<string[]>(previous.divisions, ['all']) : list(input.divisions, DIVISIONS, 'divisions');
  const confirmed = input.confirmed === undefined ? !!Number(previous?.confirmed ?? 0) : input.confirmed === true;
  let image: { name: string; data: Buffer } | null = null;
  if (input.image) {
    const data = Buffer.from(String(input.image.data ?? '').replace(/^data:[^,]*,/, ''), 'base64');
    if (!data.length || data.length > MAX_IMAGE) throw badRequest('image.data muss ein Bild (Base64) bis 5 MB sein.');
    const info = sniffImage(data);
    if (!info) throw badRequest('Der Screenshot ist kein PNG, JPEG, GIF oder WebP.');
    image = { name: `screenshot.${MIME_EXT[info.mime] ?? 'png'}`, data };
  }
  const alt = String(input.imageAlt ?? previous?.image_alt ?? '').trim();
  if ((image || (previous?.image_name && input.image !== null)) && alt.length < 3) throw badRequest('Für den Screenshot ist ein Alternativtext (mind. 3 Zeichen) Pflicht.');
  return { question, insight, roles, divisions, confirmed, image, alt, pseudonymized: hits.length > 0 };
}

const yamlList = (v: string[]) => `[${v.join(', ')}]`;

function markdown(n: { question: string; insight: string; roles: string[]; divisions: string[]; confirmed: boolean; imageName: string | null; alt: string }) {
  return [
    '---', `evidence_status: ${n.confirmed ? 'manually_confirmed' : 'unconfirmed'}`, 'source_type: note', `roles: ${yamlList(n.roles)}`, `divisions: ${yamlList(n.divisions)}`, '---', '',
    '# Wissensnotizen', '', `## ${n.question.replace(/^#+\s*/, '')}`, '', n.insight, '',
    ...(n.imageName ? [`![${escapeAlt(n.alt)}](${n.imageName})`, ''] : []),
  ].join('\n');
}

async function write(ctx: Ctx, id: string, n: Awaited<ReturnType<typeof clean>>, imageName: string | null, image: Buffer | null, user: User) {
  const zip = new JSZip();
  zip.file(`${FOLDER}/${id}.md`, markdown({ ...n, imageName: imageName ? `${id}-${imageName}` : null }));
  if (imageName && image) zip.file(`${FOLDER}/${id}-${imageName}`, image);
  const data = await zip.generateAsync({ type: 'nodebuffer' });
  const imp = await importNow(ctx, `wissensnotiz-${id}.zip`, data, user.id, 'note');
  const item = imp.items.find((i: any) => i.path.endsWith('.md'));
  if (imp.status === 'failed' || item?.status === 'failed') throw unprocessable(`Die Notiz konnte nicht eingelesen werden: ${item?.message ?? imp.error ?? 'unbekannter Fehler'}`);
  if (item?.status === 'skipped') throw conflict(`Die Notiz wurde nicht eingelesen: ${item.message}`);
  return imp;
}

async function dto(ctx: Ctx, r: Row) {
  const doc = await ctx.db.get(
    `SELECT d.id, d.removed_at, (SELECT MAX(revision_no) FROM source_revisions x WHERE x.document_id = d.id) AS revisions,
       (SELECT COUNT(*) FROM text_snippets s JOIN source_revisions y ON y.id = s.revision_id WHERE y.document_id = d.id AND y.is_current = 1) AS chunks
     FROM source_documents d WHERE d.project_id = ? AND d.path = ?`, ctx.projectId, r.document_path,
  );
  return {
    id: r.id, question: r.question, insight: r.insight, roles: parseJson<string[]>(r.roles, []), divisions: parseJson<string[]>(r.divisions, []),
    confirmed: !!Number(r.confirmed), image: r.image_name ? { name: r.image_name, alt: r.image_alt } : null, path: r.document_path, status: r.status,
    documentId: doc?.id ?? null, revisions: Number(doc?.revisions ?? 0), chunks: Number(doc?.chunks ?? 0),
    createdBy: r.created_by, createdAt: r.created_at, updatedBy: r.updated_by, updatedAt: r.updated_at,
  };
}

async function noteRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM knowledge_notes WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Wissensnotiz ${id}`);
  return r;
}

export async function listNotes(ctx: Ctx, opts: { includeRemoved?: boolean } = {}) {
  const rows = await ctx.db.all(`SELECT * FROM knowledge_notes WHERE project_id = ? ${opts.includeRemoved ? '' : "AND status = 'active'"} ORDER BY created_at DESC`, ctx.projectId);
  return Promise.all(rows.map((r) => dto(ctx, r)));
}

export async function createNote(ctx: Ctx, input: NoteInput, user: User) {
  const n = await clean(ctx, input);
  const id = newId('kn').replace(/_/g, '-');
  if (n.image) await ctx.store.put(`notes/${id}/${n.image.name}`, n.image.data);
  await write(ctx, id, n, n.image?.name ?? null, n.image?.data ?? null, user);
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO knowledge_notes (id, project_id, question, insight, roles, divisions, confirmed, image_name, image_alt, document_path, status, created_by, created_at, updated_by, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)`,
      id, ctx.projectId, n.question, n.insight, json(n.roles), json(n.divisions), n.confirmed ? 1 : 0, n.image?.name ?? null, n.image ? n.alt : null, `${FOLDER}/${id}.md`, user.id, now(), user.id, now(),
    );
    await audit(ctx, user.id, 'knowledge_note.created', 'knowledge_note', id, { pseudonymized: n.pseudonymized, image: !!n.image });
  });
  return dto(ctx, await noteRow(ctx, id));
}

/** Ändern = neue Revision derselben Quelle; image: null entfernt den Screenshot */
export async function updateNote(ctx: Ctx, id: string, input: NoteInput, user: User) {
  const r = await noteRow(ctx, id);
  if (r.status !== 'active') throw conflict('Die Notiz ist entfernt.');
  const n = await clean(ctx, input, r);
  let imageName: string | null = r.image_name ?? null;
  let image: Buffer | null = null;
  if (n.image) {
    imageName = n.image.name;
    image = n.image.data;
    await ctx.store.put(`notes/${id}/${imageName}`, image);
  } else if (input.image === null) imageName = null;
  else if (imageName) image = await ctx.store.get(`notes/${id}/${imageName}`);
  await write(ctx, id, n, imageName, image, user);
  await ctx.db.tx(async () => {
    await ctx.db.run(
      'UPDATE knowledge_notes SET question = ?, insight = ?, roles = ?, divisions = ?, confirmed = ?, image_name = ?, image_alt = ?, updated_by = ?, updated_at = ? WHERE id = ?',
      n.question, n.insight, json(n.roles), json(n.divisions), n.confirmed ? 1 : 0, imageName, imageName ? n.alt : null, user.id, now(), id,
    );
    await audit(ctx, user.id, 'knowledge_note.updated', 'knowledge_note', id, { pseudonymized: n.pseudonymized });
  });
  return dto(ctx, await noteRow(ctx, id));
}

/** Entfernen: Quelle gilt als entfernt (ADR-036), Revisionen und Historie bleiben */
export async function removeNote(ctx: Ctx, id: string, user: User) {
  const r = await noteRow(ctx, id);
  if (r.status !== 'active') return;
  await ctx.db.tx(async () => {
    await ctx.db.run("UPDATE knowledge_notes SET status = 'removed', updated_by = ?, updated_at = ? WHERE id = ?", user.id, now(), id);
    await ctx.db.run('UPDATE source_documents SET removed_at = ? WHERE project_id = ? AND path = ? AND removed_at IS NULL', now(), ctx.projectId, r.document_path);
    await audit(ctx, user.id, 'knowledge_note.removed', 'knowledge_note', id, {});
  });
}
