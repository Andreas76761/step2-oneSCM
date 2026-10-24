// Terminologieverwaltung (US-015): bevorzugte Begriffe, zu vermeidende Varianten, Definition.
// Die Qualitätsanalyse meldet aktive Einträge als Befundtyp `terminology`.
import { audit, type Ctx } from '../context.js';
import { json, newId, now, parseJson, type Db } from '../db.js';
import { badRequest, conflict, notFound, unprocessable } from '../problem.js';
import type { FixedTerm } from '../domain/translate.js';
import { projectLanguages } from './translations.js';

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
  translations: Record<string, { term: string; definition: string | null }>;
  /** nicht übersetzen (ADR-097, S-04): der Begriff steht in jeder Sprache unverändert */
  keepUntranslated: boolean;
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
    translations: parseJson<Record<string, { term: string; definition: string | null }>>(r.translations, {}),
    createdBy: r.created_by, createdAt: r.created_at, updatedBy: r.updated_by, updatedAt: r.updated_at,
    keepUntranslated: !!Number(r.keep_untranslated ?? 0),
  };
}

export async function listTerms(ctx: Ctx, opts: { includeRetired?: boolean } = {}) {
  const rows = await ctx.db.all(
    `SELECT * FROM terminology_terms WHERE project_id = ? ${opts.includeRetired ? '' : "AND status = 'active'"} ORDER BY LOWER(preferred)`,
    ctx.projectId,
  );
  return rows.map(toTerm);
}

/** Begriffe mit fester Übersetzung je Sprache (F-12, ADR-083) für Übersetzungsanfrage und -prüfung */
export async function fixedTranslations(ctx: Ctx): Promise<FixedTerm[]> {
  const rows = await ctx.db.all("SELECT preferred, translations, keep_untranslated FROM terminology_terms WHERE project_id = ? AND status = 'active'", ctx.projectId);
  const langs = rows.some((r) => Number(r.keep_untranslated)) ? await projectLanguages(ctx) : [];
  return rows.map((r) => ({
    preferred: String(r.preferred),
    // „nicht übersetzen“ (S-04): in jeder Projektsprache genau der deutsche Begriff
    translations: Number(r.keep_untranslated)
      ? Object.fromEntries(langs.map((l) => [l, String(r.preferred)]))
      : Object.fromEntries(Object.entries(parseJson<Record<string, { term?: string }>>(r.translations, {})).map(([l, v]) => [l, v?.term?.trim() ?? '']).filter(([, v]) => v)),
  }));
}

// Begriffskandidaten aus Jira-Tickets (F-12, ADR-083): mehrteilige Fachbegriffe in Großschreibung („Contract Preview PDF“),
// die in mindestens zwei Tickets vorkommen und noch nicht in der Terminologie stehen. Nur Vorschläge – angelegt wird von Hand.
const CANDIDATE = /(?<![\p{L}\d])(?:\p{Lu}[\p{Ll}\d]+|\p{Lu}{2,}[\p{Ll}]*)(?:[ -](?:\p{Lu}[\p{Ll}\d]+|\p{Lu}{2,}[\p{Ll}]*|&)){1,3}(?![\p{L}\d])/gu;
const LEADING = new Set(['The', 'A', 'An', 'When', 'If', 'In', 'On', 'As', 'For', 'With', 'And', 'Or', 'To', 'From', 'After', 'Before', 'Given', 'Then', 'This', 'All',
  'Der', 'Die', 'Das', 'Ein', 'Eine', 'Wenn', 'Im', 'Bei', 'Und', 'Oder', 'Mit', 'Für', 'Nach', 'Vor', 'Als', 'Auf', 'Aus', 'Zum', 'Zur', 'Beim', 'Ist', 'Sind']);
const FIELD_WORDS = new Set(['Typ', 'Status', 'Priorität', 'Komponente', 'Lösungsversion', 'Beschreibung', 'Akzeptanzkriterien', 'Verknüpfte Tickets', 'Jira-Tickets', 'PI TBD']);

export async function termCandidates(ctx: Ctx, opts: { minTickets?: number } = {}) {
  const min = Math.max(1, Math.min(20, Math.trunc(opts.minTickets ?? 2) || 2));
  const rows = await ctx.db.all(
    `SELECT d.path, s.text FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     WHERE d.project_id = ? AND r.is_current = 1 AND d.removed_at IS NULL AND r.source_format = 'jira'`,
    ctx.projectId,
  );
  const known = new Set<string>();
  for (const t of await ctx.db.all('SELECT preferred, avoid, translations FROM terminology_terms WHERE project_id = ?', ctx.projectId)) {
    known.add(String(t.preferred).toLowerCase());
    for (const a of parseJson<string[]>(t.avoid, [])) known.add(a.toLowerCase());
    for (const v of Object.values(parseJson<Record<string, { term?: string }>>(t.translations, {}))) if (v?.term) known.add(v.term.toLowerCase());
  }
  const found = new Map<string, { term: string; tickets: Set<string>; count: number }>();
  for (const r of rows) {
    const ticket = String(r.path).replace(/^jira\//, '').replace(/\.md$/, '');
    // Feldtabelle und Überschriften der Ticketvorlage gehören nicht dazu
    const text = String(r.text).split('\n').filter((l) => !/^\s*(\||#)/.test(l)).join('\n').replace(/\[[^\]]*\d+\]/g, ' ');
    for (const m of text.matchAll(CANDIDATE)) {
      const parts = m[0].split(/ (?=\S)/);
      while (parts.length && LEADING.has(parts[0])) parts.shift();
      const term = parts.join(' ').replace(/\s*&$/, '');
      if (term.split(' ').length < 2 || FIELD_WORDS.has(term) || known.has(term.toLowerCase())) continue;
      const key = term.toLowerCase();
      const e = found.get(key) ?? { term, tickets: new Set<string>(), count: 0 };
      e.tickets.add(ticket);
      e.count++;
      found.set(key, e);
    }
  }
  return [...found.values()].filter((e) => e.tickets.size >= min)
    .sort((a, b) => b.tickets.size - a.tickets.size || b.count - a.count || a.term.localeCompare(b.term))
    .slice(0, 200)
    .map((e) => ({ term: e.term, tickets: e.tickets.size, occurrences: e.count, examples: [...e.tickets].sort().slice(0, 5) }));
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
  /** Begriff und Definition je Projektsprache (Glossar in der Leseransicht, ADR-071) */
  translations?: Record<string, { term?: string; definition?: string | null }>;
  /** nicht übersetzen (S-04) */
  keepUntranslated?: boolean;
}

/** Übersetzungen prüfen: nur Projektsprachen, Begriff Pflicht (sonst entfällt die Sprache), Längen begrenzt */
async function cleanTranslations(ctx: Ctx, v: unknown) {
  if (v === undefined) return undefined;
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw badRequest('translations: Objekt { Sprache: { term, definition } }.');
  const langs = await projectLanguages(ctx);
  const out: Record<string, { term: string; definition: string | null }> = {};
  for (const [lang, t] of Object.entries(v as Record<string, any>)) {
    if (!langs.includes(lang)) throw badRequest(`translations: „${lang}“ ist keine Sprache dieses Projekts.`);
    const term = typeof t?.term === 'string' ? t.term.trim().slice(0, 120) : '';
    if (term) out[lang] = { term, definition: typeof t?.definition === 'string' ? t.definition.trim().slice(0, 1000) || null : null };
  }
  return out;
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
  const translations = (await cleanTranslations(ctx, input.translations)) ?? {};
  const id = newId('term');
  await ctx.db.tx(async () => {
    await ctx.db.run(
      `INSERT INTO terminology_terms (id, project_id, preferred, avoid, definition, status, created_by, created_at, updated_by, updated_at, translations, keep_untranslated)
       VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, ?, ?)`,
      id, ctx.projectId, preferred, json(avoid), input.definition?.trim() || null, actor, now(), actor, now(), json(translations), input.keepUntranslated ? 1 : 0,
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
  const translations = (await cleanTranslations(ctx, input.translations)) ?? before.translations;
  await ctx.db.tx(async () => {
    await ctx.db.run(
      'UPDATE terminology_terms SET preferred = ?, avoid = ?, definition = ?, status = ?, translations = ?, keep_untranslated = ?, updated_by = ?, updated_at = ? WHERE id = ?',
      preferred, json(avoid), input.definition !== undefined ? input.definition?.trim() || null : before.definition, status, json(translations),
      (input.keepUntranslated ?? before.keepUntranslated) ? 1 : 0, actor, now(), id,
    );
    await audit(ctx, actor, status === 'retired' && before.status === 'active' ? 'term.retired' : 'term.updated', 'term', id, { before, after: { preferred, avoid, status } });
  });
  return getTerm(ctx, id);
}
