// Vergleich ganzer Kapitelversionen (US-019).
// Absätze werden über ihre Lineage (stabil über Neugenerierungen, manuelle Übernahmen und Wiederherstellungen)
// einander zugeordnet; ohne Lineage-Treffer gelten sie als hinzugefügt bzw. entfernt.
import type { Ctx } from '../context.js';
import { CHAPTER_SECTIONS } from '../domain/reference.js';
import { notFound, unprocessable } from '../problem.js';
import { getChapterVersion } from './chapters.js';

export type ChangeType = 'unchanged' | 'changed' | 'moved' | 'added' | 'removed';

const FIELDS = ['text', 'kind', 'roles', 'divisions', 'market', 'release', 'scopeStatus', 'justification', 'sources'] as const;
type Field = (typeof FIELDS)[number] | 'section' | 'order';

export const FIELD_LABELS: Record<Field, string> = {
  text: 'Text', kind: 'Blocktyp', roles: 'Rollen', divisions: 'Sparten', market: 'Markt', release: 'Release',
  scopeStatus: 'Zuordnungsstatus', justification: 'Begründung', sources: 'Quellen', section: 'Abschnitt', order: 'Reihenfolge',
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
  market: b.market, release: b.release, scopeStatus: b.scopeStatus, justification: b.justification, sources: b.sources.map((s) => s.seq),
});

/** Indizes einer längsten aufsteigenden Teilfolge – diese Elemente gelten als nicht verschoben. */
function stableIndexes(seq: number[]): Set<number> {
  const tails: number[] = [];
  const prev: number[] = new Array(seq.length).fill(-1);
  for (let i = 0; i < seq.length; i++) {
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (seq[tails[mid]] < seq[i]) lo = mid + 1;
      else hi = mid;
    }
    if (lo > 0) prev[i] = tails[lo - 1];
    tails[lo] = i;
  }
  const keep = new Set<number>();
  for (let i = tails.length ? tails[tails.length - 1] : -1; i >= 0; i = prev[i]) keep.add(i);
  return keep;
}

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

  // Umsortierung innerhalb eines Abschnitts: Absätze, die in beiden Versionen im selben Abschnitt stehen,
  // gelten als verschoben, wenn sie nicht zur längsten gemeinsam geordneten Teilfolge gehören.
  const reordered = new Set<string>();
  for (const code of new Set(b.map((x) => x.section))) {
    const common = b.filter((x) => x.section === code && aByLineage.get(x.lineageId)?.section === code);
    const fromIdx = new Map(a.filter((x) => x.section === code).map((x, i) => [x.lineageId, i]));
    const keep = stableIndexes(common.map((x) => fromIdx.get(x.lineageId)!));
    common.forEach((x, i) => {
      if (!keep.has(i)) reordered.add(x.lineageId);
    });
  }

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
    if (reordered.has(nb.lineageId)) fields.push('order');
    const onlyMoved = fields.every((f) => f === 'section' || f === 'order');
    const change: ChangeType = fields.length === 0 ? 'unchanged' : onlyMoved ? 'moved' : 'changed';
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
