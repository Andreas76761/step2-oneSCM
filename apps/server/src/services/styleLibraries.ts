// Stilregel-Bibliotheken (ADR-050): gemeinsame Formulierungsregeln für mehrere Projekte – einmal pflegen, überall einheitlich.
// Verwaltung projektübergreifend (globale Berechtigung „admin“); Projekte abonnieren Bibliotheken (Style-Seite), eigene
// Projektregeln gehen bei gleicher Formulierung vor.
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import type { StylePhrase } from '../domain/style.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { cleanPhrases, DEFAULT_STYLE_RULES, phrasesFromCsv, phrasesToCsv, type StyleRules } from './style.js';

const dto = (r: Row) => ({
  id: r.id as string, name: r.name as string, description: (r.description as string | null) ?? null,
  phrases: parseJson<StylePhrase[]>(r.phrases, []), projects: Number(r.projects ?? 0),
  updatedAt: (r.updated_at ?? r.created_at) as string, updatedBy: (r.updated_by ?? r.created_by ?? null) as string | null,
});

const SELECT = 'SELECT l.*, (SELECT COUNT(*) FROM project_style_libraries s WHERE s.library_id = l.id) AS projects FROM style_libraries l';

export async function listStyleLibraries(ctx: Ctx) {
  return (await ctx.db.all(`${SELECT} ORDER BY l.name`)).map(dto);
}

export async function getStyleLibrary(ctx: Ctx, id: string) {
  const r = await ctx.db.get(`${SELECT} WHERE l.id = ?`, id);
  if (!r) throw notFound(`Stilregel-Bibliothek ${id}`);
  return dto(r);
}

const cleanName = (v: unknown) => {
  const n = typeof v === 'string' ? v.trim().slice(0, 80) : '';
  if (!n) throw badRequest('name ist Pflicht.');
  return n;
};
const cleanDescription = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, 300) : null);

/** Formulierungen aus der Anfrage: Liste, CSV (wie beim Projekt-Export) oder die eigenen Regeln eines Projekts */
async function incomingPhrases(ctx: Ctx, input: Record<string, unknown>): Promise<StylePhrase[] | undefined> {
  if (input.phrases !== undefined) return cleanPhrases(input.phrases);
  if (typeof input.csv === 'string') return cleanPhrases(phrasesFromCsv(input.csv));
  if (typeof input.fromProjectId === 'string') {
    const p = await ctx.db.get('SELECT style_rules FROM projects WHERE id = ?', input.fromProjectId);
    if (!p) throw notFound(`Projekt ${input.fromProjectId}`);
    return ({ ...DEFAULT_STYLE_RULES, ...parseJson<Partial<StyleRules>>(p.style_rules, {}) }).phrases;
  }
  return undefined;
}

export async function createStyleLibrary(ctx: Ctx, input: Record<string, unknown>, user: User) {
  const name = cleanName(input.name);
  if (await ctx.db.get('SELECT 1 FROM style_libraries WHERE LOWER(name) = LOWER(?)', name)) throw conflict(`Bibliothek „${name}“ existiert bereits.`);
  const phrases = (await incomingPhrases(ctx, input)) ?? [];
  const id = newId('sl');
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO style_libraries (id, name, description, phrases, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)', id, name, cleanDescription(input.description), json(phrases), user.id, now());
    await audit(ctx.db, user.id, 'style_library.created', 'style_library', id, { name, phrases: phrases.length, fromProjectId: input.fromProjectId ?? null });
  });
  return getStyleLibrary(ctx, id);
}

/** Ändern; mit `mode: 'merge'` ergänzt eine CSV die vorhandenen Formulierungen statt sie zu ersetzen */
export async function updateStyleLibrary(ctx: Ctx, id: string, input: Record<string, unknown>, user: User) {
  const cur = await getStyleLibrary(ctx, id);
  const name = input.name === undefined ? cur.name : cleanName(input.name);
  if (name.toLowerCase() !== cur.name.toLowerCase() && await ctx.db.get('SELECT 1 FROM style_libraries WHERE LOWER(name) = LOWER(?)', name)) throw conflict(`Bibliothek „${name}“ existiert bereits.`);
  const description = input.description === undefined ? cur.description : cleanDescription(input.description);
  let phrases = await incomingPhrases(ctx, input);
  if (phrases && input.mode === 'merge') {
    const merged = [...cur.phrases];
    for (const p of phrases) {
      const i = merged.findIndex((x) => x.avoid.toLowerCase() === p.avoid.toLowerCase());
      if (i >= 0) merged[i] = p;
      else merged.push(p);
    }
    phrases = cleanPhrases(merged);
  }
  const next = phrases ?? cur.phrases;
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE style_libraries SET name = ?, description = ?, phrases = ?, updated_by = ?, updated_at = ? WHERE id = ?', name, description, json(next), user.id, now(), id);
    await audit(ctx.db, user.id, 'style_library.updated', 'style_library', id, { name, phrases: next.length, projects: cur.projects });
  });
  return getStyleLibrary(ctx, id);
}

/** Löschen nur ohne Abonnements – sonst änderten sich die Regeln der Projekte unbemerkt */
export async function deleteStyleLibrary(ctx: Ctx, id: string, user: User) {
  const cur = await getStyleLibrary(ctx, id);
  if (cur.projects) throw conflict(`Die Bibliothek wird von ${cur.projects} ${cur.projects === 1 ? 'Projekt' : 'Projekten'} verwendet. Zuerst dort abbestellen.`);
  await ctx.db.tx(async () => {
    await ctx.db.run('DELETE FROM style_libraries WHERE id = ?', id);
    await audit(ctx.db, user.id, 'style_library.deleted', 'style_library', id, { name: cur.name });
  });
}

export async function exportStyleLibrary(ctx: Ctx, id: string) {
  const l = await getStyleLibrary(ctx, id);
  return { fileName: `stilregeln-${l.name.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'bibliothek'}.csv`, body: phrasesToCsv(l.phrases) };
}
