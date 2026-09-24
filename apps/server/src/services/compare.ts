// Vergleich ganzer Kapitelversionen (US-019).
// Absätze werden über ihre Lineage (stabil über Neugenerierungen, manuelle Übernahmen und Wiederherstellungen)
// einander zugeordnet; ohne Lineage-Treffer gelten sie als hinzugefügt bzw. entfernt.
import type { Ctx } from '../context.js';
import { CHAPTER_SECTIONS } from '../domain/reference.js';
import { notFound, unprocessable } from '../problem.js';
import { getChapterVersion } from './chapters.js';

export type ChangeType = 'unchanged' | 'changed' | 'moved' | 'added' | 'removed';

const FIELDS = ['text', 'kind', 'roles', 'divisions', 'market', 'release', 'scopeStatus', 'justification', 'sources'] as const;
type Field = (typeof FIELDS)[number] | 'section';

export const FIELD_LABELS: Record<Field, string> = {
  text: 'Text', kind: 'Blocktyp', roles: 'Rollen', divisions: 'Sparten', market: 'Markt', release: 'Release',
  scopeStatus: 'Zuordnungsstatus', justification: 'Begründung', sources: 'Quellen', section: 'Abschnitt',
};

interface Block {
  id: string;
  lineageId: string;
  section: string;
  position: number;
  kind: string;
  text: string;
  mode: string;
  roles: string[];
  divisions: string[];
  market: string | null;
  release: string | null;
  scopeStatus: string;
  justification: string | null;
  sources: { snippetId: string; seq: number }[];
}

const norm = (b: Block, f: (typeof FIELDS)[number]) => {
  if (f === 'sources') return b.sources.map((s) => s.snippetId).sort().join(',');
  const v = b[f];
  return Array.isArray(v) ? [...v].sort().join(',') : (v ?? '');
};

const brief = (b: Block) => ({
  blockId: b.id, section: b.section, kind: b.kind, text: b.text, mode: b.mode, roles: b.roles, divisions: b.divisions,
  market: b.market, release: b.release, sources: b.sources.map((s) => s.seq),
});

export async function compareVersions(ctx: Ctx, chapterId: string, fromId: string, toId: string) {
  const chapter = await ctx.db.get('SELECT id, title FROM chapters WHERE id = ?', chapterId);
  if (!chapter) throw notFound(`Kapitel ${chapterId}`);
  const [from, to] = await Promise.all([getChapterVersion(ctx, fromId), getChapterVersion(ctx, toId)]);
  if (from.chapterId !== chapterId || to.chapterId !== chapterId) throw unprocessable('Beide Versionen müssen zum angegebenen Kapitel gehören.');

  const blocksOf = (v: typeof from) => v.sections.flatMap((s) => s.blocks) as unknown as Block[];
  const a = blocksOf(from);
  const b = blocksOf(to);
  const aByLineage = new Map(a.map((x) => [x.lineageId, x]));
  const bLineages = new Set(b.map((x) => x.lineageId));
  const sectionOrder = CHAPTER_SECTIONS.map((s) => s.code as string);

  type Entry = { change: ChangeType; section: string; from: ReturnType<typeof brief> | null; to: ReturnType<typeof brief> | null; fields: Field[] };
  const entries: Entry[] = [];
  for (const nb of b) {
    const ob = aByLineage.get(nb.lineageId);
    if (!ob) {
      entries.push({ change: 'added' as ChangeType, section: nb.section, from: null, to: brief(nb), fields: [] as Field[] });
      continue;
    }
    const fields: Field[] = FIELDS.filter((f) => norm(ob, f) !== norm(nb, f));
    if (ob.section !== nb.section) fields.push('section');
    const change: ChangeType = fields.length === 0 ? 'unchanged' : fields.length === 1 && fields[0] === 'section' ? 'moved' : 'changed';
    entries.push({ change, section: nb.section, from: brief(ob), to: brief(nb), fields });
  }
  // Entfernte Absätze an ihrem ursprünglichen Abschnitt einsortieren
  for (const ob of a.filter((x) => !bLineages.has(x.lineageId))) {
    entries.push({ change: 'removed' as ChangeType, section: ob.section, from: brief(ob), to: null, fields: [] as Field[] });
  }
  entries.sort((x, y) => sectionOrder.indexOf(x.section) - sectionOrder.indexOf(y.section));

  const count = (c: ChangeType) => entries.filter((e) => e.change === c).length;
  const meta = (v: typeof from) => ({ id: v.id, versionNo: v.versionNo, status: v.status, generatedAt: v.generatedAt, generatedBy: v.generatedBy, approvedAt: v.approvedAt });
  return {
    chapterId, chapterTitle: chapter.title as string,
    from: meta(from), to: meta(to),
    summary: { added: count('added'), removed: count('removed'), changed: count('changed'), moved: count('moved'), unchanged: count('unchanged') },
    fieldLabels: FIELD_LABELS,
    sections: CHAPTER_SECTIONS.map((s) => ({ code: s.code, title: s.title })),
    entries,
  };
}
