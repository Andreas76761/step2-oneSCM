// Release-Abgleich und Releaseletter (ADR-083, F-02, F-03): Grundlage sind die Jira-Tickets, die als Datei eingelesen wurden
// (ADR-081) – je Ticket die aktuelle Revision mit den Feldern als JSON (ohne Personenfelder, Text pseudonymisiert).
import { Document, Packer } from 'docx';
import { audit, privacyNames, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import {
  AUDIENCES, AUDIENCE_LABEL, buildReleaseLetter, checkReleaseLetter, MANUAL_CLASS_LABEL, manualClass, piLabel, STATUS_BUCKET_LABEL, statusBucket,
  VERDICT_LABEL, VERDICT_TEXT, TICKET_CLASS_HINT, TICKET_CLASS_LABEL, ticketInLetter, type Audience, type ReleaseTicket,
} from '../domain/releaseLetter.js';
import { ticketClassMap } from './ticketClasses.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { markdownToDocx } from './docx.js';
import { recordLetterMemory, refreshLetterIssues } from './translationWorkflow.js';
import { TRANSLATION_ISSUE_LABELS, type TranslationIssue } from '../domain/translate.js';

const MAX_TEXT = 200_000;
const MAX_KEYS = 500;
// Felder, deren Änderung zum vorigen Import zählt (Ticket-Cockpit, ergänzt um Version und Typ für den Release-Bezug)
const TRACKED: (keyof ReleaseTicket)[] = ['status', 'summary', 'created', 'updated', 'fixVersions', 'type'];
const FIELD_LABEL: Record<string, string> = { status: 'Status', summary: 'Zusammenfassung', created: 'Erstellt', updated: 'Aktualisiert', fixVersions: 'Lösungsversion', type: 'Typ' };

const toTicket = (o: any): ReleaseTicket => ({
  key: String(o?.key ?? ''), summary: String(o?.summary ?? ''), type: String(o?.type ?? ''), status: String(o?.status ?? ''), priority: String(o?.priority ?? ''),
  resolution: String(o?.resolution ?? ''), project: String(o?.project ?? ''), components: Array.isArray(o?.components) ? o.components.map(String) : [],
  fixVersions: Array.isArray(o?.fixVersions) ? o.fixVersions.map(String) : [], affectsVersions: Array.isArray(o?.affectsVersions) ? o.affectsVersions.map(String) : [],
  labels: Array.isArray(o?.labels) ? o.labels.map(String) : [], created: String(o?.created ?? ''), updated: String(o?.updated ?? ''),
  links: Array.isArray(o?.links) ? o.links.map((l: any) => ({ type: String(l?.type ?? ''), key: String(l?.key ?? '') })) : [],
  description: String(o?.description ?? ''), acceptance: String(o?.acceptance ?? ''),
});

async function original(ctx: Ctx, key: string | null) {
  if (!key) return null;
  try {
    return toTicket(JSON.parse((await ctx.store.get(key)).toString('utf8')));
  } catch {
    return null;
  }
}

/** Alle Tickets der Jira-Importe (aktuelle Revision) mit Vergleich zur vorigen Revision */
export async function loadTickets(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT d.id AS document_id, d.path, r.id AS revision_id, r.revision_no, r.original_key, r.imported_at,
       (SELECT p.original_key FROM source_revisions p WHERE p.document_id = d.id AND p.revision_no < r.revision_no AND p.source_format = 'jira' ORDER BY p.revision_no DESC LIMIT 1) AS previous_key
     FROM source_documents d JOIN source_revisions r ON r.document_id = d.id
     WHERE d.project_id = ? AND d.removed_at IS NULL AND r.is_current = 1 AND r.source_format = 'jira'`,
    ctx.projectId,
  );
  const out: { ticket: ReleaseTicket; documentId: string; revisionNo: number; importedAt: string; changes: { field: string; before: string; after: string }[]; isNew: boolean }[] = [];
  for (const r of rows) {
    const t = await original(ctx, r.original_key);
    if (!t?.key) continue;
    const prev = await original(ctx, r.previous_key);
    const show = (v: unknown) => (Array.isArray(v) ? v.join(', ') : String(v ?? ''));
    const changes = prev ? TRACKED.filter((f) => show(prev[f]) !== show(t[f])).map((f) => ({ field: FIELD_LABEL[f], before: show(prev[f]), after: show(t[f]) })) : [];
    out.push({ ticket: t, documentId: r.document_id, revisionNo: Number(r.revision_no), importedAt: r.imported_at, changes, isNew: !prev });
  }
  return out.sort((a, b) => a.ticket.key.localeCompare(b.ticket.key, 'en', { numeric: true }));
}

/** Handbuch-Bezug je Ticketdokument: Absätze der neuesten Kapitelversionen, die eine Revision des Tickets als Quelle haben */
async function coverage(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT DISTINCT r.document_id, c.title FROM content_blocks b
     JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id
     JOIN content_block_sources x ON x.block_id = b.id JOIN text_snippets s ON s.id = x.snippet_id JOIN source_revisions r ON r.id = s.revision_id
     WHERE c.project_id = ? AND b.deleted_at IS NULL AND v.status <> 'superseded' AND r.source_format = 'jira'`,
    ctx.projectId,
  );
  const map = new Map<string, string[]>();
  for (const r of rows) map.set(r.document_id, [...(map.get(r.document_id) ?? []), r.title]);
  return map;
}

export async function listTicketReleases(ctx: Ctx, opts: { release?: string } = {}) {
  const all = await loadTickets(ctx);
  const cov = await coverage(ctx);
  const classes = await ticketClassMap(ctx, all.map((x) => x.ticket));
  const tickets = all.map((x) => {
    const t = x.ticket;
    const cls = manualClass(t.type);
    const bucket = statusBucket(t.status);
    // Einstufung (ADR-102, W-03): intern zählt nicht als Lücke, Background nur in der Lückenanalyse
    const tc = classes.get(t.key)!;
    return {
      classification: tc.classification, classificationLabel: tc.label, classificationOrigin: tc.origin, classificationNote: tc.note, classifiedBy: tc.setBy, classifiedAt: tc.setAt,
      key: t.key, summary: t.summary, type: t.type, status: t.status, statusBucket: bucket, statusLabel: STATUS_BUCKET_LABEL[bucket],
      manualClass: cls, manualClassLabel: MANUAL_CLASS_LABEL[cls], release: piLabel(t), components: t.components, created: t.created,
      revisionNo: x.revisionNo, importedAt: x.importedAt, isNew: x.isNew, changes: x.changes,
      chapters: cov.get(x.documentId) ?? [],
      // Handbuch-Kandidat ohne Kapitel, das auf dem Ticket beruht
      gap: tc.classification !== 'internal' && (cls === 'manual' || tc.origin === 'manual') && bucket !== 'cancelled' && !(cov.get(x.documentId)?.length),
    };
  });
  const releases = [...new Set(tickets.map((t) => t.release))].sort((a, b) => (a === 'PI TBD' ? 1 : b === 'PI TBD' ? -1 : a.localeCompare(b, 'de', { numeric: true }))).map((label) => {
    const of = tickets.filter((t) => t.release === label);
    return {
      label, tickets: of.length, manual: of.filter((t) => t.manualClass === 'manual').length, internal: of.filter((t) => t.manualClass === 'internal').length,
      unknown: of.filter((t) => t.manualClass === 'unknown').length, done: of.filter((t) => t.statusBucket === 'done').length,
      gaps: of.filter((t) => t.gap).length, changed: of.filter((t) => t.changes.length).length,
    };
  });
  const shown = opts.release ? tickets.filter((t) => t.release === opts.release) : tickets;
  return { releases, tickets: shown, statusLabels: STATUS_BUCKET_LABEL, classLabels: MANUAL_CLASS_LABEL, ticketClassLabels: TICKET_CLASS_LABEL, ticketClassHints: TICKET_CLASS_HINT };
}

export const parseKeys = (v: unknown) => {
  const raw = Array.isArray(v) ? v.map(String).join('\n') : String(v ?? '');
  return [...new Set((raw.toUpperCase().match(/[A-Z][A-Z0-9]{1,9}-\d+/g) ?? []))].slice(0, MAX_KEYS);
};

/** Ticketliste eines Releases gegen die eingelesenen Tickets: geladen, fehlend */
export async function matchTicketList(ctx: Ctx, input: { keys?: unknown }) {
  const keys = parseKeys(input.keys);
  if (!keys.length) throw badRequest('keys braucht mindestens eine Ticketnummer (z. B. ONESCM-123), eine je Zeile.');
  const loaded = new Set((await loadTickets(ctx)).map((x) => x.ticket.key));
  return { total: keys.length, loaded: keys.filter((k) => loaded.has(k)), missing: keys.filter((k) => !loaded.has(k)) };
}

// ---------------------------------------------------------------- Releaseletter

async function ticketsFor(ctx: Ctx, keys: string[]) {
  const all = (await loadTickets(ctx)).map((x) => x.ticket);
  const by = new Map(all.map((t) => [t.key, t]));
  return { tickets: keys.map((k) => by.get(k)).filter((t): t is ReleaseTicket => !!t), missing: keys.filter((k) => !by.has(k)), all };
}

export function cleanOptions(input: any) {
  const language = input.language ?? 'de';
  if (language !== 'de' && language !== 'en') throw badRequest('language muss de oder en sein.');
  const audience = (input.audience ?? 'biz') as Audience;
  if (!AUDIENCES.includes(audience)) throw badRequest(`audience muss eines von ${AUDIENCES.join(', ')} sein.`);
  const country = String(input.country ?? 'DE').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) throw badRequest('country ist ein Ländercode mit zwei Buchstaben (z. B. DE).');
  const division = input.division ?? 'all';
  if (!['car', 'van', 'all'].includes(division)) throw badRequest('division muss car, van oder all sein (nur Pkw und Van).');
  return { language: language as 'de' | 'en', audience, country, division: division as string };
}

/** Prüfergebnis eines Letters gegen seine Tickets (auch für übersetzte Letter, ADR-101) */
export async function letterVerdict(ctx: Ctx, text: string, keys: string[], audience: Audience) {
  const { tickets } = await ticketsFor(ctx, keys);
  return checkReleaseLetter(text, tickets, { audience, names: await privacyNames(ctx.db) }).verdict;
}

async function dto(ctx: Ctx, r: Row, withCheck = true) {
  const keys = parseJson<string[]>(r.ticket_keys, []);
  const base = {
    id: r.id, title: r.title, release: r.release_label, ticketKeys: keys, language: r.language, audience: r.audience, audienceLabel: AUDIENCE_LABEL[r.audience as Audience],
    country: r.country, division: r.division, origin: r.origin, status: r.status, verdict: r.verdict ?? null, verdictLabel: r.verdict ? VERDICT_LABEL[r.verdict as keyof typeof VERDICT_LABEL] : null,
    createdBy: r.created_by, createdAt: r.created_at, updatedBy: r.updated_by, updatedAt: r.updated_at, approvedBy: r.approved_by ?? null, approvedAt: r.approved_at ?? null,
    // Übersetzung DE↔EN (U-09): Ausgangsletter, Prüfbefunde je Zeile, vorhandene Übersetzungen
    translationOf: r.translation_of ?? null, translationIssues: parseJson<any[]>(r.translation_issues, []).map((x) => ({ ...x, labels: x.issues.map((i: TranslationIssue) => TRANSLATION_ISSUE_LABELS[i]) })),
    translations: (await ctx.db.all('SELECT id, language, status FROM release_letters WHERE translation_of = ?', r.id)).map((x) => ({ id: x.id, language: x.language, status: x.status })),
    // Entwurf aus dem Projektvergleich (ADR-102, W-04): verglichene Releases und Umfang
    comparison: parseJson<Record<string, unknown> | null>(r.comparison, null),
  };
  if (!withCheck) return base;
  const { tickets, missing } = await ticketsFor(ctx, keys);
  const check = checkReleaseLetter(r.text, tickets, { audience: r.audience as Audience, names: await privacyNames(ctx.db) });
  return { ...base, text: r.text, check: { ...check, verdictLabel: VERDICT_LABEL[check.verdict], verdictText: VERDICT_TEXT[check.verdict], ticketsNotLoaded: missing } };
}

async function letterRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM release_letters WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Releaseletter ${id}`);
  return r;
}

export async function listReleaseLetters(ctx: Ctx) {
  const rows = await ctx.db.all('SELECT * FROM release_letters WHERE project_id = ? ORDER BY created_at DESC', ctx.projectId);
  return Promise.all(rows.map((r) => dto(ctx, r, false)));
}

export async function getReleaseLetter(ctx: Ctx, id: string) {
  return dto(ctx, await letterRow(ctx, id));
}

export async function storeLetter(ctx: Ctx, row: Record<string, unknown>, user: User, action: string) {
  const { tickets } = await ticketsFor(ctx, row.keys as string[]);
  const verdict = checkReleaseLetter(String(row.text), tickets, { audience: row.audience as Audience, names: await privacyNames(ctx.db) }).verdict;
  const id = newId('rl');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO release_letters (id, project_id, title, release_label, ticket_keys, language, audience, country, division, origin, text, status, verdict, created_by, created_at, updated_by, updated_at, comparison)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?)`,
      id, ctx.projectId, row.title, row.release, json(row.keys), row.language, row.audience, row.country, row.division, row.origin, row.text, verdict, user.id, now(), user.id, now(),
      row.comparison ? json(row.comparison) : null,
    );
    await audit(ctx, user.id, action, 'release_letter', id, { release: row.release, tickets: (row.keys as string[]).length, verdict });
  });
  return getReleaseLetter(ctx, id);
}

/** Releaseletter aus Tickets erzeugen: Release (Lösungsversion) oder Ticketliste; stornierte Tickets entfallen */
export async function createReleaseLetter(ctx: Ctx, input: any, user: User) {
  const opts = cleanOptions(input ?? {});
  const { all } = await ticketsFor(ctx, []);
  let keys = parseKeys(input?.keys);
  const release = typeof input?.release === 'string' ? input.release.trim() : '';
  if (!keys.length && release) keys = all.filter((t) => piLabel(t) === release).map((t) => t.key);
  if (!keys.length) throw badRequest('Bitte ein Release (Lösungsversion) oder Ticketnummern angeben.');
  const { tickets: chosen, missing } = await ticketsFor(ctx, keys);
  if (missing.length) throw badRequest(`Diese Tickets sind nicht eingelesen: ${missing.join(', ')}. Jira-Export unter „Quellen“ hochladen.`);
  // Einstufung (ADR-102, W-03): Background nie, intern nur als behobener Fehler
  const classes = await ticketClassMap(ctx, chosen);
  const tickets = chosen.filter((t) => ticketInLetter(classes.get(t.key)!.classification, t.type));
  if (!tickets.length) throw badRequest('Alle gewählten Tickets sind als Background bzw. intern eingestuft – kein Inhalt für einen Releaseletter.');
  const letter = buildReleaseLetter(tickets, { ...opts, release: release || undefined, title: input?.title });
  if (!letter.keys.length) throw badRequest('Alle gewählten Tickets sind storniert – kein Inhalt für einen Releaseletter.');
  return storeLetter(ctx, { ...opts, title: String(input?.title ?? '').trim().slice(0, 200) || `Releaseletter ${letter.release} (${opts.language.toUpperCase()})`, release: letter.release, keys: letter.keys, text: letter.markdown, origin: 'generated' }, user, 'release_letter.generated');
}

/** Fremden Letter (z. B. aus Dify) einfügen und gegen die Tickets prüfen */
export async function importReleaseLetter(ctx: Ctx, input: any, user: User) {
  const opts = cleanOptions(input ?? {});
  const text = String(input?.text ?? '').trim();
  if (!text) throw badRequest('text ist Pflicht.');
  if (text.length > MAX_TEXT) throw badRequest(`Höchstens ${MAX_TEXT} Zeichen.`);
  let keys = parseKeys(input?.keys);
  const { all } = await ticketsFor(ctx, []);
  if (!keys.length) {
    // Umfang aus dem Text: genannte, eingelesene Tickets
    const loaded = new Set(all.map((t) => t.key));
    keys = parseKeys(text).filter((k) => loaded.has(k));
  }
  if (!keys.length) throw badRequest('Kein eingelesenes Ticket im Text gefunden – bitte keys angeben.');
  const { tickets } = await ticketsFor(ctx, keys);
  const release = [...new Set(tickets.map(piLabel))].join(', ') || 'PI TBD';
  return storeLetter(ctx, { ...opts, title: String(input?.title ?? '').trim().slice(0, 200) || `Eingefügter Releaseletter (${keys[0]}${keys.length > 1 ? ' …' : ''})`, release, keys, text, origin: 'external' }, user, 'release_letter.imported');
}

export async function updateReleaseLetter(ctx: Ctx, id: string, input: { text?: unknown; title?: unknown }, user: User) {
  const r = await letterRow(ctx, id);
  if (r.status !== 'draft') throw conflict('Der Releaseletter ist freigegeben und unveränderlich – für Änderungen einen neuen erzeugen.');
  const text = input.text === undefined ? r.text : String(input.text).trim();
  if (!text) throw badRequest('text darf nicht leer sein.');
  if (text.length > MAX_TEXT) throw badRequest(`Höchstens ${MAX_TEXT} Zeichen.`);
  const title = input.title === undefined ? r.title : String(input.title).trim().slice(0, 200);
  if (!title) throw badRequest('title darf nicht leer sein.');
  const { tickets } = await ticketsFor(ctx, parseJson<string[]>(r.ticket_keys, []));
  const verdict = checkReleaseLetter(text, tickets, { audience: r.audience, names: await privacyNames(ctx.db) }).verdict;
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE release_letters SET text = ?, title = ?, verdict = ?, updated_by = ?, updated_at = ? WHERE id = ?', text, title, verdict, user.id, now(), id);
    await refreshLetterIssues(ctx, id);
    await audit(ctx, user.id, 'release_letter.updated', 'release_letter', id, { verdict });
  });
  return getReleaseLetter(ctx, id);
}

/** Freigabe (Berechtigung approve): nicht bei „Nicht freigeben“; „Bedingt“ nur mit Begründung */
export async function approveReleaseLetter(ctx: Ctx, id: string, input: { reason?: unknown }, user: User) {
  const r = await letterRow(ctx, id);
  if (r.status !== 'draft') throw conflict('Der Releaseletter ist bereits freigegeben.');
  const current = await dto(ctx, r);
  const check = (current as any).check;
  if (check.verdict === 'block') throw conflict(`Freigabe nicht möglich: ${check.findings.filter((f: any) => f.severity === 'fail').map((f: any) => f.title).join('; ')}.`, { findings: check.findings });
  const reason = String(input.reason ?? '').trim();
  // übersetzter Letter: Prüfbefunde der Übersetzung zuerst beheben (U-09)
  const trIssues = await refreshLetterIssues(ctx, id);
  if (trIssues.length) throw conflict(`Freigabe nicht möglich: ${trIssues.length} Zeilen mit Befunden der Übersetzungsprüfung.`, { translationIssues: trIssues });
  if (check.verdict === 'cond' && !reason) throw conflict('Der Releaseletter hat noch Warnungen – für eine bedingte Freigabe ist eine Begründung nötig.', { findings: check.findings });
  await ctx.db.tx(async () => {
    await ctx.db.run("UPDATE release_letters SET status = 'approved', verdict = ?, approved_by = ?, approved_at = ? WHERE id = ?", check.verdict, user.id, now(), id);
    await audit(ctx, user.id, 'release_letter.approved', 'release_letter', id, { verdict: check.verdict, reason: reason || null });
    await recordLetterMemory(ctx, id, user.id);
  });
  return getReleaseLetter(ctx, id);
}

export async function deleteReleaseLetter(ctx: Ctx, id: string, user: User) {
  const r = await letterRow(ctx, id);
  if (r.status !== 'draft') throw conflict('Freigegebene Releaseletter bleiben erhalten.');
  if (await ctx.db.get('SELECT 1 FROM release_letters WHERE translation_of = ?', id)) throw conflict('Zu diesem Letter gibt es eine Übersetzung – bitte zuerst die Übersetzung löschen.');
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM release_letters WHERE id = ?', id);
    await audit(ctx, user.id, 'release_letter.deleted', 'release_letter', id, {});
  });
}

export async function exportReleaseLetter(ctx: Ctx, id: string, format: string) {
  const r = await letterRow(ctx, id);
  const base = `releaseletter_${String(r.release_label).replace(/[^\w.-]+/g, '_')}_${r.language}`;
  if (format === 'md') return { data: Buffer.from(r.text, 'utf8'), contentType: 'text/markdown; charset=utf-8', fileName: `${base}.md` };
  if (format !== 'docx') throw badRequest('format muss md oder docx sein.');
  const doc = new Document({ sections: [{ children: markdownToDocx(r.text, new Map()) }] });
  return { data: await Packer.toBuffer(doc), contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', fileName: `${base}.docx` };
}
