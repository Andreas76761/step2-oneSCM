// Terminologieverwaltung (US-015): bevorzugte Begriffe, zu vermeidende Varianten, Definition.
// Die Qualitätsanalyse meldet aktive Einträge als Befundtyp `terminology`.
import { audit, type Ctx } from '../context.js';
import { json, newId, now, parseJson, type Db } from '../db.js';
import { badRequest, conflict, notFound, unprocessable } from '../problem.js';

export interface Term {
  id: string;
  preferred: string;
  avoid: string[];
  definition: string | null;
  status: 'active' | 'retired';
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

/** Startbestand bis Etappe 2 (Einstellung `terminology`) */
export const DEFAULT_TERMS = [
  { preferred: 'Freigabe', avoid: ['Genehmigung', 'Approval'] },
  { preferred: 'Autohaus', avoid: ['Händlerbetrieb'] },
  { preferred: 'anmelden', avoid: ['einloggen'] },
];

/** Einmalige Übernahme: bisherige Einstellung `terminology` bzw. Standardliste in die Tabelle. */
export async function seedTerminology(db: Db, projectId: string) {
  const existing = await db.get<{ n: number }>('SELECT COUNT(*) AS n FROM terminology_terms WHERE project_id = ?', projectId);
  if (existing?.n) return;
  const legacy = await db.get<{ value: string }>("SELECT value FROM settings WHERE key = 'terminology'");
  const terms = parseJson<{ preferred: string; avoid: string[] }[] | null>(legacy?.value, null) ?? DEFAULT_TERMS;
  for (const t of terms) {
    if (!t.preferred?.trim()) continue;
    await db.run(
      `INSERT INTO terminology_terms (id, project_id, preferred, avoid, definition, status, created_by, created_at, updated_by, updated_at)
       VALUES (?, ?, ?, ?, NULL, 'active', 'system', ?, 'system', ?) ON CONFLICT (project_id, preferred) DO NOTHING`,
      newId('term'), projectId, t.preferred.trim(), json(cleanList(t.avoid)), now(), now(),
    );
  }
}

const cleanList = (v: unknown) => [...new Set((Array.isArray(v) ? v : []).map((x) => String(x).trim()).filter(Boolean))];

function toTerm(r: Record<string, any>): Term {
  return {
    id: r.id, preferred: r.preferred, avoid: parseJson(r.avoid, []), definition: r.definition, status: r.status,
    createdBy: r.created_by, createdAt: r.created_at, updatedBy: r.updated_by, updatedAt: r.updated_at,
  };
}

export async function listTerms(ctx: Ctx, opts: { includeRetired?: boolean } = {}) {
  const rows = await ctx.db.all(
    `SELECT * FROM terminology_terms WHERE project_id = ? ${opts.includeRetired ? '' : "AND status = 'active'"} ORDER BY LOWER(preferred)`,
    ctx.projectId,
  );
  return rows.map(toTerm);
}

async function getTerm(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM terminology_terms WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Begriff ${id}`);
  return toTerm(r);
}

export interface TermInput {
  preferred?: string;
  avoid?: string[];
  definition?: string | null;
  status?: 'active' | 'retired';
}

/** Ein zu vermeidender Begriff darf nicht zugleich irgendwo bevorzugt sein (sonst widersprüchliche Befunde). */
async function assertConsistent(ctx: Ctx, preferred: string, avoid: string[], selfId: string | null) {
  if (avoid.some((a) => a.toLowerCase() === preferred.toLowerCase())) throw unprocessable('Der bevorzugte Begriff darf nicht zugleich zu vermeiden sein.');
  // Eindeutigkeit über alle Begriffe inkl. ausgemusterter (UNIQUE-Constraint), ohne Groß-/Kleinschreibung
  for (const t of await listTerms(ctx, { includeRetired: true })) {
    if (t.id === selfId || t.preferred.toLowerCase() !== preferred.toLowerCase()) continue;
    throw conflict(
      t.status === 'retired'
        ? `„${t.preferred}“ ist als ausgemusterter Begriff vorhanden – bitte den bestehenden Begriff reaktivieren.`
        : `„${t.preferred}“ ist bereits als Begriff erfasst.`,
      { existingTermId: t.id, existingStatus: t.status },
    );
  }
  for (const t of await listTerms(ctx)) {
    if (t.id === selfId) continue;
    const clash = avoid.find((a) => a.toLowerCase() === t.preferred.toLowerCase());
    if (clash) throw unprocessable(`„${clash}“ ist an anderer Stelle der bevorzugte Begriff.`);
    if (t.avoid.some((a) => a.toLowerCase() === preferred.toLowerCase())) throw unprocessable(`„${preferred}“ steht bei „${t.preferred}“ auf der Liste der zu vermeidenden Begriffe.`);
  }
}

export async function createTerm(ctx: Ctx, input: TermInput, actor: string) {
  const preferred = input.preferred?.trim();
  if (!preferred) throw badRequest('Bevorzugter Begriff (preferred) ist Pflicht.');
  const avoid = cleanList(input.avoid);
  await assertConsistent(ctx, preferred, avoid, null);
  const id = newId('term');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO terminology_terms (id, project_id, preferred, avoid, definition, status, created_by, created_at, updated_by, updated_at)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, ?)`,
      id, ctx.projectId, preferred, json(avoid), input.definition?.trim() || null, actor, now(), actor, now(),
    );
    await audit(ctx, actor, 'term.created', 'term', id, { preferred, avoid });
  });
  return getTerm(ctx, id);
}

export async function updateTerm(ctx: Ctx, id: string, input: TermInput, actor: string) {
  const before = await getTerm(ctx, id);
  const preferred = input.preferred !== undefined ? input.preferred.trim() : before.preferred;
  if (!preferred) throw badRequest('Bevorzugter Begriff darf nicht leer sein.');
  const avoid = input.avoid !== undefined ? cleanList(input.avoid) : before.avoid;
  const status = input.status ?? before.status;
  if (!['active', 'retired'].includes(status)) throw badRequest('status muss active oder retired sein.');
  if (status === 'active') await assertConsistent(ctx, preferred, avoid, id);
  await ctx.db.tx(async () => {
    await ctx.db.run(
      'UPDATE terminology_terms SET preferred = ?, avoid = ?, definition = ?, status = ?, updated_by = ?, updated_at = ? WHERE id = ?',
      preferred, json(avoid), input.definition !== undefined ? input.definition?.trim() || null : before.definition, status, actor, now(), id,
    );
    await audit(ctx, actor, status === 'retired' && before.status === 'active' ? 'term.retired' : 'term.updated', 'term', id, { before, after: { preferred, avoid, status } });
  });
  return getTerm(ctx, id);
}
