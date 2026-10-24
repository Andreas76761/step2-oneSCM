// Ticket-Einstufung (ADR-102, W-03): genehmigt / in Prüfung / intern / Background je Jira-Ticket.
// Intern und Background fließen nicht ins Handbuch (Generierung), Background nur in die Lückenanalyse.
import { audit, type Ctx, type User } from '../context.js';
import { now } from '../db.js';
import { defaultTicketClass, isTicketClass, TICKET_CLASS_LABEL, TICKET_CLASSES, ticketFeedsManual, type TicketClass } from '../domain/releaseLetter.js';
import { badRequest, notFound } from '../problem.js';

const MAX_NOTE = 500;
const MAX_BULK = 500;

/** Aktuelle Jira-Tickets: Schlüssel, Typ und Quelldokument */
export async function jiraTicketDocs(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT d.id AS document_id, r.original_key FROM source_documents d JOIN source_revisions r ON r.document_id = d.id
     WHERE d.project_id = ? AND d.removed_at IS NULL AND r.is_current = 1 AND r.source_format = 'jira'`, ctx.projectId,
  );
  const out: { key: string; type: string; documentId: string }[] = [];
  for (const r of rows) {
    if (!r.original_key) continue;
    try {
      const o = JSON.parse((await ctx.store.get(r.original_key)).toString('utf8'));
      if (o?.key) out.push({ key: String(o.key), type: String(o.type ?? ''), documentId: r.document_id });
    } catch {
      // unlesbare Revision: Ticket fehlt in der Einstufung
    }
  }
  return out;
}

export interface TicketClassInfo { classification: TicketClass; label: string; origin: 'manual' | 'derived'; note: string | null; setBy: string | null; setAt: string | null }

/** Einstufung je Ticketschlüssel: vom Menschen gesetzt, sonst abgeleitet (Bug = intern, sonst in Prüfung) */
export async function ticketClassMap(ctx: Ctx, tickets: { key: string; type: string }[]): Promise<Map<string, TicketClassInfo>> {
  const set = new Map((await ctx.db.all('SELECT * FROM ticket_classifications WHERE project_id = ?', ctx.projectId)).map((r) => [r.ticket_key as string, r]));
  const out = new Map<string, TicketClassInfo>();
  for (const t of tickets) {
    const r = set.get(t.key);
    const classification = (r && isTicketClass(r.classification) ? r.classification : defaultTicketClass(t.type)) as TicketClass;
    out.set(t.key, { classification, label: TICKET_CLASS_LABEL[classification], origin: r ? 'manual' : 'derived', note: r?.note ?? null, setBy: r?.set_by ?? null, setAt: r?.set_at ?? null });
  }
  return out;
}

/** Quelldokumente von Tickets, die nicht ins Handbuch fließen (intern, Background) */
export async function excludedTicketDocuments(ctx: Ctx) {
  const docs = await jiraTicketDocs(ctx);
  if (!docs.length) return new Map<string, TicketClass>();
  const cls = await ticketClassMap(ctx, docs);
  const out = new Map<string, TicketClass>();
  for (const d of docs) {
    const c = cls.get(d.key)!.classification;
    if (!ticketFeedsManual(c)) out.set(d.documentId, c);
  }
  return out;
}

/** Einstufung setzen (classification null = wieder ableiten); mehrere Tickets auf einmal mit `keys` */
export async function setTicketClasses(ctx: Ctx, input: { keys?: unknown; classification?: unknown; note?: unknown }, user: User) {
  const keys = Array.isArray(input.keys) ? [...new Set(input.keys.map((k) => String(k).trim().toUpperCase()).filter(Boolean))] : [];
  if (!keys.length) throw badRequest('keys braucht mindestens eine Ticketnummer.');
  if (keys.length > MAX_BULK) throw badRequest(`Höchstens ${MAX_BULK} Tickets auf einmal.`);
  const c = input.classification;
  if (c !== null && !isTicketClass(c)) throw badRequest(`classification: erlaubt sind ${TICKET_CLASSES.join(', ')} oder null.`);
  const note = typeof input.note === 'string' && input.note.trim() ? input.note.trim().slice(0, MAX_NOTE) : null;
  const loaded = new Set((await jiraTicketDocs(ctx)).map((d) => d.key));
  const missing = keys.filter((k) => !loaded.has(k));
  if (missing.length) throw notFound(`Tickets ${missing.join(', ')} (nicht eingelesen)`);
  await ctx.db.tx(async () => {
    for (const key of keys) {
      if (c === null) await ctx.db.run('DELETE FROM ticket_classifications WHERE project_id = ? AND ticket_key = ?', ctx.projectId, key);
      else {
        await ctx.db.run(
          `INSERT INTO ticket_classifications (project_id, ticket_key, classification, note, set_by, set_at) VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT (project_id, ticket_key) DO UPDATE SET classification = excluded.classification, note = excluded.note, set_by = excluded.set_by, set_at = excluded.set_at`,
          ctx.projectId, key, c, note, user.id, now(),
        );
      }
    }
    await audit(ctx, user.id, 'ticket.classified', 'project', ctx.projectId, { keys, classification: c, note: !!note });
  });
  return { keys, classification: c, label: c ? TICKET_CLASS_LABEL[c] : null };
}
