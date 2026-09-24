// Handbuch-Varianten (ADR-034): aus Gliederung und Draft Manual werden eigene Kapitel mit Versionen,
// die über Werkstatt, Qualitätsgate und Freigabe laufen und als Handbuch der Variante exportiert/veröffentlicht werden.
import { audit, type Ctx, type User } from '../context.js';
import { parseJson, newId, type Row } from '../db.js';
import { imageRefs } from '../domain/media.js';
import { numberNodes } from '../domain/outline.js';
import { badRequest, notFound, Problem } from '../problem.js';
import { generate, listChapters } from './chapters.js';

export async function outlineOf(ctx: Ctx, outlineId: string) {
  const o = await ctx.db.get('SELECT * FROM outlines WHERE id = ? AND project_id = ?', outlineId, ctx.projectId);
  if (!o) throw notFound(`Gliederung ${outlineId}`);
  return o;
}

export const variantFilter = (o: Row) => {
  const markets = parseJson<string[]>(o.markets, []);
  return {
    roles: parseJson<string[]>(o.roles, []), divisions: parseJson<string[]>(o.divisions, []),
    // Blueprint: nur allgemeine Inhalte ohne Marktbezug; genau ein Markt: dessen Inhalte; mehrere: alle ausgewählten
    market: o.market_scope === 'markets' && markets.length === 1 ? markets[0] : null,
    markets: o.market_scope === 'markets' ? markets : [],
    blueprint: o.market_scope !== 'markets',
  };
};

/**
 * Kapitel der Variante anlegen bzw. aktualisieren: je Kapitel der Gliederung ein Kapitel (Titel mit Nummer,
 * Reihenfolge wie in der Gliederung). Kennung über Gliederung (family) und Eintrag (node_key) – auch neue Gliederungsversionen
 * führen dieselben Kapitel mit ihrer Historie fort.
 */
export async function materializeVariant(ctx: Ctx, outlineId: string, user: User) {
  const o = await outlineOf(ctx, outlineId);
  const nodes = numberNodes((await ctx.db.all('SELECT * FROM outline_nodes WHERE outline_id = ?', outlineId)).map((n) => ({
    id: n.id as string, parentId: (n.parent_id as string) ?? null, level: n.level as number, position: n.position as number, title: n.title as string, nodeKey: (n.node_key ?? n.id) as string,
  }))).filter((n) => n.level === 1);
  if (!nodes.length) throw badRequest('Die Gliederung hat keine Kapitel.');
  const created: string[] = [];
  await ctx.db.tx(async () => {
    for (const n of nodes) {
      const key = `ol:${o.family_id}:${n.nodeKey}`;
      const title = `${n.number}. ${n.title}`;
      const position = Number(n.number) * 1000;
      const cur = await ctx.db.get('SELECT id FROM chapters WHERE project_id = ? AND key = ?', ctx.projectId, key);
      // Inhalte kommen ab jetzt aus dieser Gliederungsversion
      if (cur) await ctx.db.run('UPDATE chapters SET title = ?, position = ?, outline_id = ? WHERE id = ?', title, position, outlineId, cur.id);
      else {
        const id = newId('ch');
        await ctx.db.run('INSERT INTO chapters (id, project_id, key, title, position, outline_family_id, outline_node_key, outline_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', id, ctx.projectId, key, title, position, o.family_id, n.nodeKey, outlineId);
        created.push(id);
      }
    }
    await audit(ctx, user.id, 'outline.variant_materialized', 'outline', outlineId, { chapters: nodes.length, created: created.length });
  });
  return variantChapters(ctx, outlineId);
}

/** Kapitel der Variante mit Stand (neueste Version, freigegeben) – nur Kapitel, die in dieser Gliederungsversion vorkommen */
export async function variantChapters(ctx: Ctx, outlineId: string) {
  const o = await outlineOf(ctx, outlineId);
  const keys = new Set((await ctx.db.all('SELECT node_key FROM outline_nodes WHERE outline_id = ? AND level = 1', outlineId)).map((r) => `ol:${o.family_id}:${r.node_key}`));
  // Stand gemessen an der angefragten Gliederungsversion
  const all = await listChapters(ctx, { outlineFamilyId: o.family_id, outlineId });
  const rows = await ctx.db.all('SELECT id, key FROM chapters WHERE project_id = ? AND outline_family_id = ?', ctx.projectId, o.family_id);
  const keyOf = new Map(rows.map((r) => [r.id, r.key]));
  return { outlineId, familyId: o.family_id, name: o.name, chapters: all.filter((c) => keys.has(keyOf.get(c.id))) };
}

/** Entwürfe für alle Kapitel der Variante erzeugen; blockierte oder leere Kapitel werden mit Grund gemeldet */
export async function generateVariant(ctx: Ctx, outlineId: string, user: User) {
  const { chapters } = await materializeVariant(ctx, outlineId, user);
  const results: { chapterId: string; title: string; status: 'generated' | 'skipped' | 'blocked'; versionNo?: number; message?: string }[] = [];
  for (const c of chapters) {
    if (!c.snippetCount) {
      results.push({ chapterId: c.id, title: c.title, status: 'skipped', message: 'keine Textschnipsel zugeordnet' });
      continue;
    }
    try {
      const v = await generate(ctx, c.id, user.id);
      results.push({ chapterId: c.id, title: c.title, status: 'generated', versionNo: v.versionNo });
    } catch (e) {
      if (!(e instanceof Problem) || e.status >= 500) throw e;
      results.push({ chapterId: c.id, title: c.title, status: e.status === 409 ? 'blocked' : 'skipped', message: e.detail ?? e.title });
    }
  }
  return { outlineId, results, generated: results.filter((r) => r.status === 'generated').length };
}

// ---------- Verzeichnisse (ADR-034, Anhang von Export und Online-Hilfe) ----------

export interface Appendices {
  abbreviations: { abbreviation: string; expansion: string; description: string | null }[];
  glossary: { term: string; definition: string; avoid: string[] }[];
  images: { number: number; sha: string; title: string | null; alt: string; chapter: string }[];
  faq: { question: string; answer: string }[];
}

/** Abkürzungen, Glossar (Begriffe mit Definition), Bildverzeichnis der enthaltenen Kapitel, veröffentlichte FAQ der Variante */
export async function appendicesFor(ctx: Ctx, outline: Row | null, chapters: { title: string; sections: { blocks: { text: string }[] }[] }[]): Promise<Appendices> {
  const abbreviations = (await ctx.db.all('SELECT abbreviation, expansion, description FROM abbreviations WHERE project_id = ? ORDER BY LOWER(abbreviation)', ctx.projectId))
    .map((r) => ({ abbreviation: r.abbreviation, expansion: r.expansion, description: r.description ?? null }));
  const glossary = (await ctx.db.all("SELECT preferred, definition, avoid FROM terminology_terms WHERE project_id = ? AND status = 'active' AND definition IS NOT NULL AND definition <> ''", ctx.projectId))
    .map((r) => ({ term: r.preferred as string, definition: r.definition as string, avoid: parseJson<string[]>(r.avoid, []) }))
    .sort((a, b) => a.term.localeCompare(b.term, 'de'));
  const titles = new Map((await ctx.db.all('SELECT sha256, title FROM media_assets WHERE project_id = ?', ctx.projectId)).map((r) => [r.sha256, r.title as string | null]));
  const images: Appendices['images'] = [];
  const seen = new Set<string>();
  for (const ch of chapters) {
    for (const s of ch.sections) for (const b of s.blocks) {
      for (const r of imageRefs(b.text)) {
        if (!r.sha || seen.has(r.sha)) continue;
        seen.add(r.sha);
        images.push({ number: images.length + 1, sha: r.sha, title: titles.get(r.sha) ?? null, alt: r.alt, chapter: ch.title });
      }
    }
  }
  const f = outline ? variantFilter(outline) : { roles: [] as string[], divisions: [] as string[] };
  const fits = (codes: string[], want: string[]) => !want.length || !codes.length || codes.includes('all') || codes.some((c) => want.includes(c));
  const faq = (await ctx.db.all("SELECT question, answer, roles, divisions FROM faq_entries WHERE project_id = ? AND status = 'published' ORDER BY position, created_at", ctx.projectId))
    .filter((r) => fits(parseJson<string[]>(r.roles, []), f.roles) && fits(parseJson<string[]>(r.divisions, []), f.divisions))
    .map((r) => ({ question: r.question as string, answer: r.answer as string }));
  return { abbreviations, glossary, images, faq };
}

export const hasAppendices = (a: Appendices) => a.abbreviations.length + a.glossary.length + a.images.length + a.faq.length > 0;
