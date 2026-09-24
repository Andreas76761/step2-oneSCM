// Kollaboration (ADR-019): Kommentare und Aufgaben an Absätzen, Befunden und Kapiteln, @Erwähnungen und
// Benachrichtigungen (In-App, Webhook, E-Mail). Absatz-Diskussionen hängen an der Lineage und bleiben über
// Neugenerierungen und Kapitelversionen hinweg erhalten.
import { audit, requirePermission, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { badRequest, conflict, forbidden, notFound } from '../problem.js';
import { effectiveUser } from './projects.js';

export const ENTITY_TYPES = ['block', 'finding', 'chapter'] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

/** Prüft, dass das Objekt zum Projekt gehört, und liefert den Link in der Web-UI. */
async function entityInfo(ctx: Ctx, type: string, id: string): Promise<{ link: string; label: string }> {
  const { db } = ctx;
  if (type === 'block') {
    const r = await db.get(
      `SELECT c.id AS chapter_id, c.title, b.section_code FROM content_blocks b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id
       JOIN chapters c ON c.id = v.chapter_id WHERE b.lineage_id = ? AND c.project_id = ? ORDER BY v.version_no DESC LIMIT 1`,
      id, ctx.projectId,
    );
    if (r) return { link: `/werkstatt/${r.chapter_id}`, label: `Absatz in „${r.title}“` };
  } else if (type === 'finding') {
    const r = await db.get('SELECT seq, type FROM quality_findings WHERE id = ? AND project_id = ?', id, ctx.projectId);
    if (r) return { link: r.type === 'contradiction' ? '/widersprueche' : r.type === 'duplicate' ? '/dopplungen' : '/', label: `Befund #${r.seq}` };
  } else if (type === 'chapter') {
    const r = await db.get('SELECT title FROM chapters WHERE id = ? AND project_id = ?', id, ctx.projectId);
    if (r) return { link: `/werkstatt/${id}`, label: `Kapitel „${r.title}“` };
  } else throw badRequest(`entityType muss eines von ${ENTITY_TYPES.join(', ')} sein.`);
  throw notFound(`${type} ${id}`);
}

/** Benutzer mit Zugriff auf das Projekt (für Erwähnungen und Zuweisungen). */
export async function collaborators(ctx: Ctx) {
  const project = await ctx.db.get('SELECT * FROM projects WHERE id = ?', ctx.projectId);
  const out: { id: string; name: string; permissions: string[] }[] = [];
  for (const u of await ctx.db.all('SELECT id, name, permissions FROM users ORDER BY name')) {
    const eff = await effectiveUser(ctx, { id: u.id, name: u.name, permissions: parseJson(u.permissions, []) }, project!);
    if (eff) out.push({ id: u.id, name: u.name, permissions: eff.permissions });
  }
  return out;
}

const MENTION = /@([A-Za-z0-9_.:-]+[A-Za-z0-9_])/g;

function commentDto(r: Row, names: Map<string, string>) {
  return {
    id: r.id, entityType: r.entity_type, entityId: r.entity_id, parentId: r.parent_id ?? null, kind: r.kind, body: r.body,
    mentions: parseJson<string[]>(r.mentions, []), assignee: r.assignee ?? null, assigneeName: r.assignee ? names.get(r.assignee) ?? r.assignee : null,
    dueDate: r.due_date ?? null, status: r.status, author: r.author, authorName: names.get(r.author) ?? r.author,
    createdAt: r.created_at, updatedAt: r.updated_at, doneBy: r.done_by ?? null, doneAt: r.done_at ?? null,
  };
}

async function userNames(ctx: Ctx) {
  return new Map((await ctx.db.all('SELECT id, name FROM users')).map((u) => [u.id as string, u.name as string]));
}

async function notify(ctx: Ctx, userIds: string[], type: string, commentId: string, text: string, link: string) {
  const ids = [...new Set(userIds)];
  for (const userId of ids) {
    const id = newId('ntf');
    await ctx.db.run(
      'INSERT INTO notifications (id, project_id, user_id, type, comment_id, text, link, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      id, ctx.projectId, userId, type, commentId, text, link, now(),
    );
    const ch = ctx.notifier.channels;
    if (ch.webhook || ch.email) await ctx.jobs.enqueue('notify', { notificationId: id });
  }
  return ids.length;
}

export async function listComments(ctx: Ctx, entityType: string, entityId: string) {
  await entityInfo(ctx, entityType, entityId);
  const names = await userNames(ctx);
  return (await ctx.db.all('SELECT * FROM comments WHERE project_id = ? AND entity_type = ? AND entity_id = ? ORDER BY created_at, id', ctx.projectId, entityType, entityId))
    .map((r) => commentDto(r, names));
}

export async function createComment(
  ctx: Ctx,
  input: { entityType?: string; entityId?: string; body?: string; parentId?: string; kind?: string; assignee?: string; dueDate?: string },
  user: User,
) {
  const body = input.body?.trim();
  if (!body) throw badRequest('Text (body) ist Pflicht.');
  if (body.length > 5000) throw badRequest('Text ist zu lang (max. 5000 Zeichen).');
  const kind = input.kind ?? 'comment';
  if (!['comment', 'task'].includes(kind)) throw badRequest('kind muss comment oder task sein.');
  const info = await entityInfo(ctx, input.entityType ?? '', input.entityId ?? '');
  const people = await collaborators(ctx);
  const known = new Map(people.map((p) => [p.id, p]));
  let assignee: string | null = null;
  if (kind === 'task') {
    requirePermission(user, 'edit'); // Aufgaben vergeben ist Redaktionsarbeit; kommentieren darf jede Person mit Lesezugriff
    if (!input.assignee || !known.has(input.assignee)) throw badRequest('Aufgaben benötigen eine zuständige Person mit Zugriff auf das Projekt (assignee).');
    assignee = input.assignee;
    if (input.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(input.dueDate)) throw badRequest('dueDate im Format JJJJ-MM-TT.');
  }
  let parent: Row | undefined;
  if (input.parentId) {
    parent = await ctx.db.get('SELECT * FROM comments WHERE id = ? AND project_id = ?', input.parentId, ctx.projectId);
    if (!parent || parent.entity_type !== input.entityType || parent.entity_id !== input.entityId) throw badRequest('Antwort muss sich auf dieselbe Diskussion beziehen.');
  }
  const mentions = [...new Set([...body.matchAll(MENTION)].map((m) => m[1]).filter((id) => known.has(id) && id !== user.id))];
  const id = newId('cm');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO comments (id, project_id, entity_type, entity_id, parent_id, kind, body, mentions, assignee, due_date, status, author, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?)`,
      id, ctx.projectId, input.entityType, input.entityId, parent?.id ?? null, kind, body, json(mentions), assignee, input.dueDate ?? null, user.id, now(), now(),
    );
    const excerpt = body.length > 140 ? `${body.slice(0, 140)}…` : body;
    if (assignee && assignee !== user.id) await notify(ctx, [assignee], 'assigned', id, `${user.name} hat Ihnen eine Aufgabe zugewiesen (${info.label}): ${excerpt}`, info.link);
    await notify(ctx, mentions.filter((m) => m !== assignee), 'mention', id, `${user.name} hat Sie erwähnt (${info.label}): ${excerpt}`, info.link);
    if (parent && parent.author !== user.id && !mentions.includes(parent.author) && parent.author !== assignee) {
      await notify(ctx, [parent.author], 'reply', id, `${user.name} hat geantwortet (${info.label}): ${excerpt}`, info.link);
    }
    await audit(ctx, user.id, kind === 'task' ? 'task.created' : 'comment.created', 'comment', id, { entityType: input.entityType, entityId: input.entityId, mentions, assignee });
  });
  ctx.jobs.wake();
  const names = await userNames(ctx);
  return commentDto((await ctx.db.get('SELECT * FROM comments WHERE id = ?', id))!, names);
}

export async function updateComment(ctx: Ctx, id: string, input: { body?: string; status?: string; assignee?: string }, user: User) {
  const c = await ctx.db.get('SELECT * FROM comments WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!c) throw notFound(`Kommentar ${id}`);
  const info = await entityInfo(ctx, c.entity_type, c.entity_id);
  const canEdit = user.permissions.includes('edit') || user.permissions.includes('admin');
  const set: string[] = [];
  const vals: unknown[] = [];
  const notes: { users: string[]; type: string; text: string }[] = [];
  if (input.body !== undefined) {
    if (c.author !== user.id) throw forbidden('Nur die verfassende Person kann den Text ändern.');
    const body = input.body.trim();
    if (!body || body.length > 5000) throw badRequest('Text muss 1–5000 Zeichen lang sein.');
    set.push('body = ?'), vals.push(body);
  }
  if (input.status !== undefined) {
    if (c.kind !== 'task') throw conflict('Nur Aufgaben haben einen Status.');
    if (!['open', 'done'].includes(input.status)) throw badRequest('status muss open oder done sein.');
    if (c.assignee !== user.id && !canEdit) throw forbidden('Status ändern dürfen die zuständige Person und die Redaktion.');
    set.push('status = ?', 'done_by = ?', 'done_at = ?');
    vals.push(input.status, input.status === 'done' ? user.id : null, input.status === 'done' ? now() : null);
    if (input.status === 'done' && c.author !== user.id) notes.push({ users: [c.author], type: 'task_done', text: `${user.name} hat eine Aufgabe erledigt (${info.label}): ${c.body.slice(0, 140)}` });
  }
  if (input.assignee !== undefined) {
    if (c.kind !== 'task') throw conflict('Nur Aufgaben haben eine zuständige Person.');
    requirePermission(user, 'edit');
    if (!(await collaborators(ctx)).some((p) => p.id === input.assignee)) throw badRequest('Zuständige Person hat keinen Zugriff auf das Projekt.');
    set.push('assignee = ?'), vals.push(input.assignee);
    if (input.assignee !== user.id) notes.push({ users: [input.assignee], type: 'assigned', text: `${user.name} hat Ihnen eine Aufgabe zugewiesen (${info.label}): ${c.body.slice(0, 140)}` });
  }
  if (!set.length) throw badRequest('Keine Änderung angegeben.');
  await ctx.db.tx(async () => {
    await ctx.db.run(`UPDATE comments SET ${set.join(', ')}, updated_at = ? WHERE id = ?`, ...vals, now(), id);
    for (const n of notes) await notify(ctx, n.users, n.type, id, n.text, info.link);
    await audit(ctx, user.id, 'comment.updated', 'comment', id, input);
  });
  ctx.jobs.wake();
  return commentDto((await ctx.db.get('SELECT * FROM comments WHERE id = ?', id))!, await userNames(ctx));
}

/** Aufgaben im Projekt, z. B. „meine offenen Aufgaben“ */
export async function listTasks(ctx: Ctx, input: { assignee?: string; status?: string }, user: User) {
  const where = ["project_id = ?", "kind = 'task'"];
  const params: unknown[] = [ctx.projectId];
  if (input.assignee) (where.push('assignee = ?'), params.push(input.assignee === 'me' ? user.id : input.assignee));
  if (input.status) (where.push('status = ?'), params.push(input.status));
  const names = await userNames(ctx);
  const rows = await ctx.db.all(`SELECT * FROM comments WHERE ${where.join(' AND ')} ORDER BY status, COALESCE(due_date, '9999'), created_at`, ...params);
  return Promise.all(rows.map(async (r) => ({ ...commentDto(r, names), ...(await entityInfo(ctx, r.entity_type, r.entity_id).catch(() => ({ link: null, label: r.entity_type }))) })));
}

export async function listNotifications(ctx: Ctx, user: User, unreadOnly: boolean) {
  const rows = await ctx.db.all(
    `SELECT * FROM notifications WHERE project_id = ? AND user_id = ? ${unreadOnly ? 'AND read_at IS NULL' : ''} ORDER BY created_at DESC LIMIT 200`,
    ctx.projectId, user.id,
  );
  const unread = (await ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM notifications WHERE project_id = ? AND user_id = ? AND read_at IS NULL', ctx.projectId, user.id))?.n ?? 0;
  return {
    unread: Number(unread),
    items: rows.map((n) => ({ id: n.id, type: n.type, text: n.text, link: n.link, commentId: n.comment_id, createdAt: n.created_at, readAt: n.read_at ?? null, delivered: parseJson(n.delivered, {}) })),
  };
}

export async function markRead(ctx: Ctx, user: User, ids?: string[]) {
  const params: unknown[] = [now(), ctx.projectId, user.id];
  let sql = 'UPDATE notifications SET read_at = ? WHERE project_id = ? AND user_id = ? AND read_at IS NULL';
  if (ids?.length) (sql += ` AND id IN (${ids.map(() => '?').join(',')})`), params.push(...ids);
  const res = await ctx.db.run(sql, ...params);
  return { marked: res.changes };
}

/** Job: Benachrichtigung per Webhook und E-Mail zustellen (Wiederholung durch die Jobqueue). */
export async function deliverNotification(ctx: Ctx, notificationId: string) {
  const n = await ctx.db.get('SELECT n.*, u.email FROM notifications n LEFT JOIN users u ON u.id = n.user_id WHERE n.id = ?', notificationId);
  if (!n) return;
  const delivered = parseJson<Record<string, string>>(n.delivered, {});
  const msg = { to: n.email, subject: `oneSCM Handbook Studio: ${n.text.slice(0, 80)}`, text: n.text, link: n.link, type: n.type, projectId: n.project_id, userId: n.user_id };
  // je Kanal sofort speichern: bei einer Wiederholung wird ein bereits erfolgreicher Kanal nicht erneut beliefert
  const save = () => ctx.db.run('UPDATE notifications SET delivered = ? WHERE id = ?', json(delivered), notificationId);
  if (!delivered.webhook && (await ctx.notifier.webhook(msg))) (delivered.webhook = now(), await save());
  if (!delivered.email && (await ctx.notifier.email(msg))) (delivered.email = now(), await save());
}

/**
 * Systemhinweis in der Kapitel-Diskussion (z. B. Freigabeworkflow, ADR-025): Kommentar von „system“ und Benachrichtigung
 * der Empfänger über alle Kanäle. Läuft in der Transaktion des Aufrufers.
 */
export async function systemNotice(ctx: Ctx, chapterId: string, body: string, recipients: string[], type: string) {
  const info = await entityInfo(ctx, 'chapter', chapterId);
  const id = newId('cm');
  const to = [...new Set(recipients)];
  await ctx.db.run(
    `INSERT INTO comments (id, project_id, entity_type, entity_id, parent_id, kind, body, mentions, assignee, due_date, status, author, created_at, updated_at)
     VALUES (?, ?, 'chapter', ?, NULL, 'comment', ?, ?, NULL, NULL, 'open', 'system', ?, ?)`,
    id, ctx.projectId, chapterId, body, json(to), now(), now(),
  );
  await notify(ctx, to, type, id, body, info.link);
  return id;
}
