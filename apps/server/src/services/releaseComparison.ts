// Projektvergleich zweier Handbuch-Releases und Releaseletter-Entwurf daraus (ADR-102, W-04): Kapitel (gespeicherte Änderungen
// bzw. Vergleich der Kapitelversionen), Bilder (Fassungen aus dem Bildarchiv), neue Funktionen („gültig ab“ = Version),
// abgelöste Funktionen (Historie) und die Tickets des Releases nach ihrer Einstufung.
import type { Ctx, User } from '../context.js';
import { parseJson, type Row } from '../db.js';
import { buildComparisonLetter, type ComparisonData } from '../domain/comparisonLetter.js';
import { piLabel, statusBucket, ticketInLetter } from '../domain/releaseLetter.js';
import { compareReleases } from '../domain/releaseOrder.js';
import { badRequest, notFound } from '../problem.js';
import { cleanOptions, loadTickets, storeLetter } from './releaseLetters.js';
import { ticketClassMap } from './ticketClasses.js';

type ReleaseChapter = { chapterId: string; chapterVersionId: string; title: string; versionNo: number };
type Change = Omit<ComparisonData['chapters'][number], 'change'> & { change: 'new' | 'updated' | 'removed' | 'unchanged' };

const IMAGE = /!\[([^\]]*)\]\(media:([a-f0-9]{64})\)/g;
const sameVersion = (a: string | null | undefined, b: string) => !!a && compareReleases(a, b) === 0;

async function releaseRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get('SELECT * FROM handbook_releases WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Release ${id}`);
  return r;
}

/** Bilder je Release: sha → Alternativtext und Kapitel */
async function imagesOf(ctx: Ctx, chapters: ReleaseChapter[]) {
  const out = new Map<string, { alt: string; chapters: Set<string> }>();
  for (const c of chapters) {
    for (const b of await ctx.db.all('SELECT text FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL', c.chapterVersionId)) {
      for (const m of String(b.text).matchAll(IMAGE)) {
        const e = out.get(m[2]) ?? { alt: m[1].trim(), chapters: new Set<string>() };
        if (!e.alt && m[1].trim()) e.alt = m[1].trim();
        e.chapters.add(c.title);
        out.set(m[2], e);
      }
    }
  }
  return out;
}

async function versionsOf(ctx: Ctx, shas: string[]) {
  if (!shas.length) return new Map<string, { base: string; no: number }>();
  const rows = await ctx.db.all(`SELECT sha, base_sha, version_no FROM media_versions WHERE project_id = ? AND sha IN (${shas.map(() => '?').join(',')})`, ctx.projectId, ...shas);
  return new Map(rows.map((r) => [r.sha as string, { base: r.base_sha as string, no: Number(r.version_no) }]));
}

async function imageTitles(ctx: Ctx, shas: string[]) {
  if (!shas.length) return new Map<string, string>();
  const rows = await ctx.db.all(`SELECT sha256, original_name FROM media_assets WHERE project_id = ? AND sha256 IN (${shas.map(() => '?').join(',')})`, ctx.projectId, ...shas);
  return new Map(rows.map((r) => [r.sha256 as string, (r.original_name as string | null) ?? '']));
}

/** Vergleich: Release `toId` gegen `fromId` bzw. sein Vorgänger-Release */
export async function releaseComparison(ctx: Ctx, toId: string, fromId?: string): Promise<ComparisonData> {
  const to = await releaseRow(ctx, toId);
  const fromKey = fromId || to.previous_release_id;
  const from: Row | null = fromKey ? await releaseRow(ctx, fromKey) : null;
  if (from && from.id === to.id) throw badRequest('from: bitte ein anderes Release wählen.');
  if (from && from.created_at > to.created_at) throw badRequest('from muss ein älteres Release sein.');
  const toChapters = parseJson<ReleaseChapter[]>(to.chapters, []);
  const fromChapters = from ? parseJson<ReleaseChapter[]>(from.chapters, []) : [];

  // Kapitel: beim direkten Vorgänger die beim Veröffentlichen ermittelten Änderungen (mit Absatzzahlen), sonst Versionsvergleich
  let changes: Change[];
  if (from && from.id === to.previous_release_id) changes = parseJson<Change[]>(to.changes, []);
  else {
    changes = toChapters.map((c): Change => {
      const before = fromChapters.find((p) => p.chapterId === c.chapterId);
      if (!before) return { chapterId: c.chapterId, title: c.title, change: 'new', fromVersionNo: null, toVersionNo: c.versionNo, summary: null };
      return { chapterId: c.chapterId, title: c.title, change: before.chapterVersionId === c.chapterVersionId ? 'unchanged' : 'updated', fromVersionNo: before.versionNo, toVersionNo: c.versionNo, summary: null };
    });
    for (const p of fromChapters) if (!toChapters.some((c) => c.chapterId === p.chapterId)) changes.push({ chapterId: p.chapterId, title: p.title, change: 'removed', fromVersionNo: p.versionNo, toVersionNo: null, summary: null });
  }

  // Bilder: neu, neue Fassung desselben Bildes (gleiche erste Fassung) oder entfernt
  const now = await imagesOf(ctx, toChapters);
  const before = await imagesOf(ctx, fromChapters);
  const versions = await versionsOf(ctx, [...new Set([...now.keys(), ...before.keys()])]);
  const titles = await imageTitles(ctx, [...new Set([...now.keys(), ...before.keys()])]);
  const baseOf = (sha: string) => versions.get(sha)?.base ?? sha;
  const beforeByBase = new Map([...before.keys()].map((sha) => [baseOf(sha), sha]));
  const nowBases = new Set([...now.keys()].map(baseOf));
  const images: ComparisonData['images'] = [];
  for (const [sha, e] of now) {
    if (before.has(sha)) continue;
    const old = beforeByBase.get(baseOf(sha));
    images.push({ sha, title: e.alt || titles.get(sha) || 'Bild', change: old ? 'version' : 'new', versionNo: versions.get(sha)?.no ?? null, fromVersionNo: old ? versions.get(old)?.no ?? null : null, chapters: [...e.chapters] });
  }
  for (const [sha, e] of before) {
    if (!now.has(sha) && !nowBases.has(baseOf(sha))) images.push({ sha, title: e.alt || titles.get(sha) || 'Bild', change: 'removed', versionNo: null, fromVersionNo: versions.get(sha)?.no ?? null, chapters: [...e.chapters] });
  }

  // Neue Funktionen: Kapitel bzw. Unterkapitel mit „gültig ab“ = diese Version (nur Kapitel dieses Releases)
  const inRelease = new Set(toChapters.map((c) => c.chapterId));
  const version = String(to.version);
  const added: ComparisonData['functions']['added'] = [];
  for (const c of await ctx.db.all('SELECT id, title, valid_from FROM chapters WHERE project_id = ? AND valid_from IS NOT NULL ORDER BY position', ctx.projectId)) {
    if (inRelease.has(c.id) && sameVersion(c.valid_from, version)) added.push({ kind: 'chapter', id: c.id, title: c.title, parentTitle: null, validFrom: c.valid_from });
  }
  for (const s of await ctx.db.all('SELECT s.id, s.title, s.valid_from, s.chapter_id, c.title AS chapter_title FROM subchapters s JOIN chapters c ON c.id = s.chapter_id WHERE c.project_id = ? AND s.valid_from IS NOT NULL AND s.history_at IS NULL ORDER BY c.position, s.position', ctx.projectId)) {
    if (inRelease.has(s.chapter_id) && sameVersion(s.valid_from, version)) added.push({ kind: 'subchapter', id: s.id, title: s.title, parentTitle: s.chapter_title, validFrom: s.valid_from });
  }
  // Abgelöste Funktionen: „gültig bis“ = diese Version oder abgelöst zwischen den beiden Releases (nicht wiederhergestellt)
  const superseded = (await ctx.db.all('SELECT * FROM structure_history WHERE project_id = ? AND restored_at IS NULL ORDER BY created_at', ctx.projectId))
    .filter((h) => sameVersion(h.valid_until, version) || (h.created_at <= to.created_at && (!from || h.created_at > from.created_at)))
    .map((h) => ({ kind: h.kind as string, title: h.title as string, parentTitle: (h.parent_title as string | null) ?? null, replacedByTitle: (h.replaced_by_title as string | null) ?? null, validUntil: (h.valid_until as string | null) ?? null }));

  // Tickets mit dieser Lösungsversion, ohne stornierte; Einstufung wie beim Letter aus Tickets (W-03)
  const all = (await loadTickets(ctx)).map((x) => x.ticket).filter((t) => sameVersion(piLabel(t), version) && statusBucket(t.status) !== 'cancelled');
  const classes = await ticketClassMap(ctx, all);
  const tickets = all.filter((t) => ticketInLetter(classes.get(t.key)!.classification, t.type));

  return {
    from: from ? { id: from.id, version: from.version, createdAt: from.created_at } : null,
    to: { id: to.id, version, title: to.title, createdAt: to.created_at },
    chapters: changes.filter((c) => c.change !== 'unchanged') as ComparisonData['chapters'],
    images, functions: { added, superseded }, tickets,
  };
}

/** Releaseletter-Entwurf aus dem Vergleich (Berechtigung edit); geprüft wird er wie jeder Letter gegen seine Tickets */
export async function createLetterFromComparison(ctx: Ctx, input: any, user: User) {
  const releaseId = typeof input?.releaseId === 'string' ? input.releaseId : '';
  if (!releaseId) throw badRequest('releaseId ist Pflicht.');
  const opts = cleanOptions(input ?? {});
  const d = await releaseComparison(ctx, releaseId, typeof input?.fromReleaseId === 'string' && input.fromReleaseId ? input.fromReleaseId : undefined);
  const text = buildComparisonLetter(d, { language: opts.language, audience: opts.audience, title: typeof input?.title === 'string' ? input.title : undefined });
  const title = (typeof input?.title === 'string' && input.title.trim().slice(0, 200)) || `Releaseletter ${d.to.version} aus Projektvergleich (${opts.language.toUpperCase()})`;
  const comparison = {
    fromReleaseId: d.from?.id ?? null, fromVersion: d.from?.version ?? null, toReleaseId: d.to.id, toVersion: d.to.version,
    chapters: d.chapters.length, images: d.images.length, added: d.functions.added.length, superseded: d.functions.superseded.length, tickets: d.tickets.length,
  };
  return storeLetter(ctx, { ...opts, title, release: d.to.version, keys: d.tickets.map((t) => t.key), text, origin: 'comparison', comparison }, user, 'release_letter.compared');
}
