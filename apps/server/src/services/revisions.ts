// Änderungsvorschläge (ADR-104): Word-Prüffassung zurücklesen (W-06), KI-Lektorat je Kapitel (G-07), interner Kommentar
// je Vorschlag (W-08). Übernommen wird in einen Entwurf des Kapitels – bei freigegebener Version entsteht er als Kopie.
import JSZip from 'jszip';
import { audit, getSettings, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { docxToMarkdown } from '../domain/convert.js';
import { CHAPTER_SECTIONS } from '../domain/reference.js';
import { alignBlocks, normalizeText, parseReviewDocument, wordDiff } from '../domain/revision.js';
import { imageRefs } from '../domain/media.js';
import { badRequest, conflict, notFound, unprocessable } from '../problem.js';
import { blockDto, createBlock, deleteBlock, getChapterVersion, insertBlock, normalizePositions, patchBlock } from './chapters.js';
import { rewriteText } from './style.js';

const SECTION_BY_TITLE = new Map<string, string>(CHAPTER_SECTIONS.map((s) => [s.title.toLowerCase(), s.code]));
const SECTION_TITLE = new Map<string, string>(CHAPTER_SECTIONS.map((s) => [s.code, s.title]));
/** Absätze, die das Lektorat bearbeitet (keine Lücken, Querverweise, Tabellen, Code) */
const LEKTORAT_KINDS = ['paragraph', 'list', 'note', 'tip', 'warning'];
export const PROPOSAL_STATUS_DE: Record<string, string> = { open: 'offen', accepted: 'übernommen', rejected: 'verworfen', stale: 'veraltet' };
export const CHANGE_DE: Record<string, string> = { changed: 'geändert', added: 'neu', removed: 'entfällt' };

/** Exportkennung aus den benutzerdefinierten Eigenschaften der Word-Datei (docProps/custom.xml) */
async function exportIdOf(data: Buffer): Promise<string | null> {
  try {
    const xml = await (await JSZip.loadAsync(data)).file('docProps/custom.xml')?.async('string');
    const m = xml && /name="onescm-export"[^>]*>\s*<vt:lpwstr>([^<]+)<\/vt:lpwstr>/.exec(xml);
    return m ? m[1].trim() : null;
  } catch {
    return null;
  }
}

async function versionFor(ctx: Ctx, title: string, fromExport: Map<string, string>) {
  const exported = fromExport.get(title.toLowerCase());
  if (exported) return ctx.db.get('SELECT v.id, v.chapter_id FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE v.id = ? AND c.project_id = ?', exported, ctx.projectId);
  // ohne Prüffassung: Kapitel gleichen Titels, freigegebene Version, sonst die neueste
  return ctx.db.get(
    `SELECT v.id, v.chapter_id FROM chapters c JOIN generated_chapter_versions v ON v.chapter_id = c.id
     WHERE c.project_id = ? AND LOWER(c.title) = ? AND c.history_at IS NULL AND v.status <> 'superseded'
     ORDER BY CASE v.status WHEN 'approved' THEN 0 ELSE 1 END, v.version_no DESC LIMIT 1`, ctx.projectId, title.toLowerCase(),
  );
}

async function insertProposal(ctx: Ctx, p: Record<string, unknown>, user: User) {
  // laufende Nummer je Liste: Reihenfolge wie in der Datei (Zeitstempel sind oft gleich)
  const seq = Number((await ctx.db.get('SELECT MAX(seq) AS m FROM revision_proposals WHERE batch_id = ?', p.batchId))?.m ?? 0) + 1;
  await ctx.db.run(
    `INSERT INTO revision_proposals (id, project_id, batch_id, chapter_id, chapter_version_id, lineage_id, section_code, change, original_text, proposed_text, criterion, status, created_by, created_at, seq)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?)`,
    newId('rvp'), ctx.projectId, p.batchId, p.chapterId, p.versionId, p.lineageId ?? null, p.section, p.change, p.original ?? null, p.proposed ?? null, p.criterion ?? null, user.id, now(), seq,
  );
}

/**
 * Word-Datei zurücklesen (W-06): Kapitel über die Prüffassung bzw. den Titel finden, Abschnitte über ihre Überschrift,
 * Absätze per Ausrichtung zuordnen; jede Abweichung wird ein offener Vorschlag. Nichts wird sofort geändert.
 */
export async function readWordReview(ctx: Ctx, fileName: string, data: Buffer, user: User) {
  if (!/\.docx$/i.test(fileName)) throw badRequest('Bitte eine Word-Datei (.docx) hochladen.');
  let markdown: string;
  try {
    markdown = (await docxToMarkdown(data, fileName, (await getSettings(ctx.db)).import.maxEntryBytes * 5)).markdown;
  } catch (e) {
    throw unprocessable(`Word-Datei nicht lesbar: ${(e as Error).message}`);
  }
  const exportId = await exportIdOf(data);
  const exp = exportId ? await ctx.db.get('SELECT params FROM exports WHERE id = ? AND project_id = ?', exportId, ctx.projectId) : null;
  const reviewVersions = parseJson<{ review?: { chapterId: string; versionId: string; title: string }[] }>(exp?.params, {}).review ?? [];
  const fromExport = new Map(reviewVersions.map((r) => [r.title.toLowerCase(), r.versionId]));
  const doc = parseReviewDocument(markdown);
  const batchId = newId('rvb');
  const stats = { chapters: 0, proposals: 0, changed: 0, added: 0, removed: 0, unmatchedChapters: [] as string[], unmatchedSections: [] as string[], criteria: [] as { chapter: string; criterion: string }[] };
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO revision_batches (id, project_id, origin, file_name, export_id, stats, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      batchId, ctx.projectId, 'word', fileName.slice(0, 200), exp ? exportId : null, '{}', user.id, now());
    for (const ch of doc) {
      const v = await versionFor(ctx, ch.title, fromExport);
      if (!v) {
        if (ch.sections.length) stats.unmatchedChapters.push(ch.title);
        continue;
      }
      stats.chapters++;
      if (ch.criterion) stats.criteria.push({ chapter: ch.title, criterion: ch.criterion });
      const version = await getChapterVersion(ctx, v.id);
      for (const sec of ch.sections) {
        const code = SECTION_BY_TITLE.get(sec.title.toLowerCase());
        if (!code) {
          stats.unmatchedSections.push(`${ch.title} › ${sec.title}`);
          continue;
        }
        const blocks = (version.sections.find((s) => s.code === code)?.blocks ?? []).filter((b: any) => b.kind !== 'gap' && b.kind !== 'xref');
        const lineage = new Map(blocks.map((b: any) => [b.id as string, b.lineageId as string]));
        for (const op of alignBlocks(blocks.map((b: any) => ({ id: b.id, text: b.text })), sec.paragraphs)) {
          if (op.type === 'same') continue;
          const base = { batchId, chapterId: v.chapter_id, versionId: v.id, section: code, criterion: ch.criterion };
          if (op.type === 'changed') await insertProposal(ctx, { ...base, lineageId: lineage.get(op.blockId), change: 'changed', original: op.original, proposed: op.proposed }, user);
          else if (op.type === 'removed') await insertProposal(ctx, { ...base, lineageId: lineage.get(op.blockId), change: 'removed', original: op.original }, user);
          else await insertProposal(ctx, { ...base, lineageId: op.afterBlockId ? lineage.get(op.afterBlockId) : null, change: 'added', proposed: op.proposed }, user);
          stats.proposals++;
          stats[op.type]++;
        }
      }
    }
    await ctx.db.run('UPDATE revision_batches SET stats = ? WHERE id = ?', json(stats), batchId);
    await audit(ctx, user.id, 'revision.word_read', 'revision_batch', batchId, { fileName, exportId: exp ? exportId : null, chapters: stats.chapters, proposals: stats.proposals });
  });
  return getBatch(ctx, batchId);
}

/** KI-Lektorat einer Kapitelversion (G-07): je Absatz eine Umformulierung (KI-Dienst, sonst Regelkorrekturen) als Vorschlag */
export async function runLektorat(ctx: Ctx, versionId: string, user: User) {
  const v = await getChapterVersion(ctx, versionId);
  const batchId = newId('rvb');
  const stats = { chapters: 1, proposals: 0, changed: 0, added: 0, removed: 0, skipped: 0, method: '' };
  const proposals: Record<string, unknown>[] = [];
  for (const s of v.sections) {
    for (const b of s.blocks as any[]) {
      if (!LEKTORAT_KINDS.includes(b.kind) || b.mode === 'locked' || imageRefs(b.text).length) {
        stats.skipped++;
        continue;
      }
      const r = await rewriteText(ctx, { text: b.text, mode: 'professional', roles: b.roles }, user.id);
      stats.method = r.method;
      if (normalizeText(r.text) === normalizeText(b.text) || r.lostNumbers.length) {
        if (r.lostNumbers.length) stats.skipped++;
        continue;
      }
      proposals.push({ batchId, chapterId: v.chapterId, versionId, section: s.code, lineageId: b.lineageId, change: 'changed', original: b.text, proposed: r.text });
    }
  }
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO revision_batches (id, project_id, origin, file_name, export_id, stats, created_by, created_at) VALUES (?, ?, ?, NULL, NULL, ?, ?, ?)', batchId, ctx.projectId, 'ai', '{}', user.id, now());
    for (const p of proposals) await insertProposal(ctx, p, user);
    stats.proposals = stats.changed = proposals.length;
    await ctx.db.run('UPDATE revision_batches SET stats = ? WHERE id = ?', json(stats), batchId);
    await audit(ctx, user.id, 'revision.lektorat', 'chapter_version', versionId, { proposals: proposals.length, method: stats.method });
  });
  return getBatch(ctx, batchId);
}

/** Aktueller Text eines Absatzes (Lineage) im Entwurf bzw. in der neuesten Version des Kapitels */
async function currentBlock(ctx: Ctx, chapterId: string, lineageId: string | null) {
  if (!lineageId) return null;
  return ctx.db.get(
    `SELECT b.* FROM content_blocks b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id
     WHERE v.chapter_id = ? AND b.lineage_id = ? AND b.deleted_at IS NULL AND v.status <> 'superseded' ORDER BY v.version_no DESC LIMIT 1`, chapterId, lineageId,
  );
}

async function proposalDto(ctx: Ctx, r: Row) {
  const cur = r.change === 'added' ? null : await currentBlock(ctx, r.chapter_id, r.lineage_id);
  const current = cur?.text ?? null;
  return {
    id: r.id as string, batchId: r.batch_id as string, chapterId: r.chapter_id as string, versionId: r.chapter_version_id as string, section: r.section_code as string,
    sectionTitle: SECTION_TITLE.get(r.section_code) ?? r.section_code, change: r.change as string, changeLabel: CHANGE_DE[r.change], status: r.status as string, statusLabel: PROPOSAL_STATUS_DE[r.status],
    original: r.original_text ?? null, proposed: r.proposed_text ?? null, current,
    // Stand hat sich seit dem Vorschlag geändert → nicht mehr ohne Weiteres übernehmbar
    outdated: r.status === 'open' && r.change !== 'added' && (current === null || normalizeText(current) !== normalizeText(r.original_text ?? '')),
    diff: r.change === 'changed' ? wordDiff(r.original_text ?? '', r.proposed_text ?? '') : null,
    criterion: r.criterion ?? null, comment: r.internal_comment ?? null, appliedVersionId: r.applied_version_id ?? null, decidedBy: r.decided_by ?? null, decidedAt: r.decided_at ?? null,
  };
}

const batchDto = (r: Row) => ({ id: r.id as string, origin: r.origin as string, fileName: r.file_name ?? null, exportId: r.export_id ?? null, stats: parseJson<Record<string, unknown>>(r.stats, {}), createdBy: r.created_by as string, createdAt: r.created_at as string });

export async function listBatches(ctx: Ctx) {
  const rows = await ctx.db.all('SELECT * FROM revision_batches WHERE project_id = ? ORDER BY created_at DESC LIMIT 100', ctx.projectId);
  const counts = await ctx.db.all('SELECT batch_id, status, COUNT(*) AS n FROM revision_proposals WHERE project_id = ? GROUP BY batch_id, status', ctx.projectId);
  return rows.map((r) => ({ ...batchDto(r), counts: Object.fromEntries(counts.filter((c) => c.batch_id === r.id).map((c) => [c.status, Number(c.n)])) }));
}

export async function getBatch(ctx: Ctx, id: string) {
  const b = await ctx.db.get('SELECT * FROM revision_batches WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!b) throw notFound(`Vorschlagsliste ${id}`);
  const rows = await ctx.db.all(
    `SELECT p.*, c.title AS chapter_title, c.position FROM revision_proposals p JOIN chapters c ON c.id = p.chapter_id WHERE p.batch_id = ? ORDER BY c.position, p.created_at, p.seq, p.id`, id,
  );
  type Group = { chapterId: string; title: string; proposals: Awaited<ReturnType<typeof proposalDto>>[] };
  const chapters = new Map<string, Group>();
  for (const r of rows) {
    const c: Group = chapters.get(r.chapter_id) ?? { chapterId: r.chapter_id, title: r.chapter_title, proposals: [] };
    c.proposals.push(await proposalDto(ctx, r));
    chapters.set(r.chapter_id, c);
  }
  return { ...batchDto(b), chapters: [...chapters.values()], statusLabels: PROPOSAL_STATUS_DE };
}

/** Entwurf des Kapitels: offener Entwurf, sonst Kopie der neuesten Version (freigegeben bleibt unverändert) */
export async function ensureDraft(ctx: Ctx, chapterId: string, actor: string) {
  const latest = await ctx.db.get('SELECT * FROM generated_chapter_versions WHERE chapter_id = ? AND status <> \'superseded\' ORDER BY version_no DESC LIMIT 1', chapterId);
  if (!latest) throw notFound(`Kapitel ${chapterId}`);
  if (latest.status === 'draft') return latest.id as string;
  if (latest.status === 'in_review') throw conflict(`Kapitelversion ${latest.version_no} ist zur Freigabe eingereicht – zum Übernehmen die Einreichung zurückziehen.`);
  const id = newId('cv');
  const max = Number((await ctx.db.get('SELECT MAX(version_no) AS m FROM generated_chapter_versions WHERE chapter_id = ?', chapterId))?.m ?? 0);
  await ctx.db.run(
    "INSERT INTO generated_chapter_versions (id, chapter_id, version_no, status, title, based_on_version_id, generator, generated_by, generated_at) VALUES (?, ?, ?, 'draft', ?, ?, ?, ?, ?)",
    id, chapterId, max + 1, latest.title, latest.id, 'revision-1.0', actor, now(),
  );
  for (const r of await ctx.db.all('SELECT * FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL ORDER BY position', latest.id)) {
    const b = await blockDto(ctx, r);
    await insertBlock(ctx, id, {
      lineageId: b.lineageId, section: b.section, position: b.position, kind: b.kind, text: b.text, mode: b.mode, market: b.market, release: b.release, scopeStatus: b.scopeStatus,
      justification: b.justification, comment: b.comment, roles: b.roles, divisions: b.divisions, sourceIds: b.sources.map((s) => s.snippetId), sentences: b.sentences ?? undefined, moduleId: b.moduleId, moduleVersion: b.moduleVersion,
    } as any, actor, `aus Version ${latest.version_no} übernommen (Änderungsvorschläge)`);
  }
  await normalizePositions(ctx, id);
  await audit(ctx, actor, 'chapter_version.draft_from_version', 'chapter_version', id, { from: latest.id });
  return id;
}

async function apply(ctx: Ctx, p: Row, text: string | null, actor: string) {
  const draft = await ensureDraft(ctx, p.chapter_id, actor);
  const block = p.lineage_id ? await ctx.db.get('SELECT * FROM content_blocks WHERE chapter_version_id = ? AND lineage_id = ? AND deleted_at IS NULL', draft, p.lineage_id) : null;
  const reason = `Änderungsvorschlag übernommen${p.criterion ? ` (Fertig, wenn: ${String(p.criterion).slice(0, 120)})` : ''}`;
  if (p.change === 'added') {
    // hinter den Absatz davor – oder hinter den zuletzt übernommenen neuen Absatz, der in der Datei davor stand
    let after = block && block.section_code === p.section_code ? Number(block.position) : null;
    const siblings = await ctx.db.all(
      `SELECT id, applied_lineage_id FROM revision_proposals WHERE batch_id = ? AND chapter_id = ? AND section_code = ? AND change = 'added' AND ${p.lineage_id ? 'lineage_id = ?' : 'lineage_id IS NULL'}
       ORDER BY created_at, seq, id`, p.batch_id, p.chapter_id, p.section_code, ...(p.lineage_id ? [p.lineage_id] : []),
    );
    for (const s of siblings.slice(0, siblings.findIndex((s) => s.id === p.id)).reverse()) {
      const prev = s.applied_lineage_id && await ctx.db.get('SELECT position FROM content_blocks WHERE chapter_version_id = ? AND lineage_id = ? AND section_code = ? AND deleted_at IS NULL', draft, s.applied_lineage_id, p.section_code);
      if (prev) {
        after = Number(prev.position);
        break;
      }
    }
    const created = await createBlock(ctx, draft, { section: p.section_code, text: text ?? p.proposed_text, position: after === null ? -1 : after + 5, reason, justification: 'Ergänzung aus Änderungsvorschlag (Prüfung in Word bzw. Lektorat)' } as any, actor);
    await ctx.db.run('UPDATE revision_proposals SET applied_lineage_id = ? WHERE id = ?', created.lineageId, p.id);
  } else {
    if (!block || normalizeText(block.text) !== normalizeText(p.original_text ?? '')) return null;
    if (p.change === 'removed') await deleteBlock(ctx, block.id, reason, actor);
    else await patchBlock(ctx, block.id, { text: text ?? p.proposed_text, reason }, actor);
  }
  return draft;
}

/** Vorschlag übernehmen (optional mit geändertem Text) oder verwerfen; geänderter Stand → „veraltet“ */
export async function decideProposal(ctx: Ctx, id: string, input: { decision?: unknown; text?: unknown; comment?: unknown }, user: User) {
  if (input.decision !== 'accept' && input.decision !== 'reject') throw badRequest('decision muss accept oder reject sein.');
  const text = typeof input.text === 'string' && input.text.trim() ? input.text.replace(/\r\n?/g, '\n').trim() : null;
  // Entwurf, Änderung und Status gemeinsam – bei einem Fehler bleibt der Vorschlag offen
  const status = await ctx.db.tx(async () => {
    const p = await ctx.db.get('SELECT * FROM revision_proposals WHERE id = ? AND project_id = ?', id, ctx.projectId);
    if (!p) throw notFound(`Vorschlag ${id}`);
    if (p.status !== 'open') throw conflict(`Der Vorschlag ist bereits ${PROPOSAL_STATUS_DE[p.status]}.`);
    const comment = typeof input.comment === 'string' ? input.comment.trim().slice(0, 1000) || null : p.internal_comment ?? null;
    const draft = input.decision === 'accept' ? await apply(ctx, p, text, user.id) : null;
    const next = input.decision === 'reject' ? 'rejected' : draft ? 'accepted' : 'stale';
    await ctx.db.run('UPDATE revision_proposals SET status = ?, internal_comment = ?, applied_version_id = ?, decided_by = ?, decided_at = ? WHERE id = ?', next, comment, draft, user.id, now(), id);
    await audit(ctx, user.id, `revision.${next}`, 'revision_proposal', id, { draft });
    return next;
  });
  const dto = await proposalDto(ctx, (await ctx.db.get('SELECT * FROM revision_proposals WHERE id = ?', id))!);
  if (status === 'stale') throw conflict('Der Absatz wurde inzwischen geändert – der Vorschlag ist veraltet.', { proposal: dto });
  return dto;
}

/** Interner Kommentar (W-08) – nie im Export */
export async function commentProposal(ctx: Ctx, id: string, input: { comment?: unknown }, user: User) {
  const p = await ctx.db.get('SELECT id FROM revision_proposals WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!p) throw notFound(`Vorschlag ${id}`);
  const comment = typeof input.comment === 'string' ? input.comment.trim().slice(0, 1000) || null : null;
  await ctx.db.run('UPDATE revision_proposals SET internal_comment = ? WHERE id = ?', comment, id);
  await audit(ctx, user.id, 'revision.commented', 'revision_proposal', id, {});
  return proposalDto(ctx, (await ctx.db.get('SELECT * FROM revision_proposals WHERE id = ?', id))!);
}

/** Alle offenen, nicht veralteten Vorschläge einer Liste (optional eines Kapitels) übernehmen */
export async function acceptAll(ctx: Ctx, batchId: string, input: { chapterId?: unknown }, user: User) {
  const b = await ctx.db.get('SELECT id FROM revision_batches WHERE id = ? AND project_id = ?', batchId, ctx.projectId);
  if (!b) throw notFound(`Vorschlagsliste ${batchId}`);
  const chapterId = typeof input.chapterId === 'string' && input.chapterId ? input.chapterId : null;
  const rows = await ctx.db.all(`SELECT * FROM revision_proposals WHERE batch_id = ? AND status = 'open'${chapterId ? ' AND chapter_id = ?' : ''} ORDER BY created_at, seq, id`, batchId, ...(chapterId ? [chapterId] : []));
  let accepted = 0;
  let stale = 0;
  await ctx.db.tx(async () => {
    for (const p of rows) {
      const draft = await apply(ctx, p, null, user.id);
      await ctx.db.run('UPDATE revision_proposals SET status = ?, applied_version_id = ?, decided_by = ?, decided_at = ? WHERE id = ?', draft ? 'accepted' : 'stale', draft, user.id, now(), p.id);
      if (draft) accepted++;
      else stale++;
    }
  });
  await audit(ctx, user.id, 'revision.accepted_all', 'revision_batch', batchId, { chapterId, accepted, stale });
  return { accepted, stale, batch: await getBatch(ctx, batchId) };
}

