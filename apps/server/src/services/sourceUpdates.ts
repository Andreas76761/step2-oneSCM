// Update-Eingang (ADR-081, F-05): Ändert sich eine Quelle, zeigt der Eingang je Kapitelabsatz, was sich geändert hat –
// geänderter, entfallener oder neuer Abschnitt der aktuellen Revision – und übernimmt die Entscheidung absatzweise.
// Bearbeitet wird nur über die vorhandenen Blockfunktionen (Versionierung, Audit, Sperren, nur Entwürfe).
import { audit, type Ctx, type User } from '../context.js';
import { newId, now, parseJson, type Row } from '../db.js';
import { tokenize } from '../domain/similarity.js';
import { badRequest, notFound } from '../problem.js';
import { createBlock, deleteBlock, patchBlock } from './chapters.js';

export type UpdateKind = 'changed' | 'unchanged' | 'removed' | 'added';
const ACTIONS = ['replace', 'relink', 'append', 'remove', 'dismiss'] as const;
type Action = (typeof ACTIONS)[number];
// Ähnlichkeit (Jaccard der Wortstämme), ab der ein Abschnitt der neuen Revision als Nachfolger gilt
const MATCH_THRESHOLD = 0.35;

const jaccard = (a: Set<string>, b: Set<string>) => {
  if (!a.size && !b.size) return 1;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
};

/** neueste, nicht ersetzte Kapitelversion je Kapitel (Entwurf, eingereicht oder freigegeben) */
const LATEST = `v.status <> 'superseded' AND NOT EXISTS (
  SELECT 1 FROM generated_chapter_versions v2 WHERE v2.chapter_id = v.chapter_id AND v2.status <> 'superseded' AND v2.version_no > v.version_no)`;

export async function listSourceUpdates(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT b.id AS block_id, b.text AS block_text, b.mode, b.section_code, b.position, v.id AS version_id, v.status, v.version_no, c.id AS chapter_id, c.title AS chapter_title,
       -- extraktiv: der Absatz übernimmt den Wortlaut einer seiner Quellen (Generator, E-09)
       CASE WHEN EXISTS (SELECT 1 FROM content_block_sources y JOIN text_snippets t ON t.id = y.snippet_id WHERE y.block_id = b.id AND t.text = b.text) THEN 1 ELSE 0 END AS extractive,
       s.id AS old_id, s.text AS old_text, s.chapter_id AS s_chapter, s.subchapter_id AS s_sub, s.heading_path, s.norm_hash, r.document_id, r.revision_no AS old_rev, d.path, d.removed_at
     FROM content_blocks b
     JOIN generated_chapter_versions v ON v.id = b.chapter_version_id
     JOIN chapters c ON c.id = v.chapter_id
     JOIN content_block_sources x ON x.block_id = b.id
     JOIN text_snippets s ON s.id = x.snippet_id
     JOIN source_revisions r ON r.id = s.revision_id
     JOIN source_documents d ON d.id = r.document_id
     WHERE c.project_id = ? AND b.deleted_at IS NULL AND r.is_current = 0 AND ${LATEST}
       AND NOT EXISTS (SELECT 1 FROM source_update_decisions u WHERE u.block_id = b.id AND u.old_snippet_id = s.id)
     ORDER BY c.position, b.section_code, b.position`,
    ctx.projectId,
  );
  // aktuelle Abschnitte je Dokument (einmal laden)
  const current = new Map<string, Row[]>();
  const currentOf = async (documentId: string) => {
    if (!current.has(documentId)) {
      current.set(documentId, (await ctx.db.all(
        `SELECT s.id, s.text, s.chapter_id, s.subchapter_id, s.heading_path, s.norm_hash, s.position, r.revision_no FROM text_snippets s
         JOIN source_revisions r ON r.id = s.revision_id WHERE r.document_id = ? AND r.is_current = 1 ORDER BY s.position`, documentId,
      )).map((x) => ({ ...x, tokens: new Set(tokenize(x.text)) })));
    }
    return current.get(documentId)!;
  };
  const items: any[] = [];
  const matched = new Map<string, Set<string>>(); // version → Abschnitte der neuen Revision, die schon zugeordnet sind
  const touched = new Map<string, Row>(); // Dokument+Kapitel → erster betroffener Absatz (für neue Abschnitte)
  // Übersichtsabsätze des Generators (Rollen, Quellenstatus, Querverweise) haben eigenen Text: sie erneuert „Kapitel generieren“
  const regenerate = new Set<string>();
  for (const r of rows) {
    if (r.mode === 'generated' && !Number(r.extractive)) {
      regenerate.add(r.block_id);
      continue;
    }
    const editable = r.status === 'draft';
    const base = {
      chapterId: r.chapter_id, chapter: r.chapter_title, versionId: r.version_id, versionNo: Number(r.version_no), versionStatus: r.status, editable,
      blockId: r.block_id, blockText: r.block_text, blockMode: r.mode, section: r.section_code, path: r.path,
    };
    const old = { snippetId: r.old_id, text: r.old_text, revisionNo: Number(r.old_rev), headingPath: parseJson<string[]>(r.heading_path, []) };
    const cands = r.removed_at ? [] : await currentOf(r.document_id);
    const oldTokens = new Set(tokenize(r.old_text));
    let best: Row | null = null;
    let bestScore = 0;
    for (const c of cands) {
      // gleicher Inhalt zählt sofort; sonst Ähnlichkeit, bei Gleichstand gleiche Überschrift bevorzugt
      const score = c.norm_hash === r.norm_hash ? 1 : jaccard(oldTokens, c.tokens) + (c.subchapter_id === r.s_sub ? 0.01 : 0);
      if (score > bestScore) [best, bestScore] = [c, score];
    }
    const key = `${r.document_id}|${r.version_id}`;
    if (!touched.has(key)) touched.set(key, { ...r, ...base });
    if (best && bestScore >= MATCH_THRESHOLD) {
      matched.set(r.version_id, (matched.get(r.version_id) ?? new Set()).add(best.id));
      const kind: UpdateKind = best.norm_hash === r.norm_hash ? 'unchanged' : 'changed';
      items.push({ id: `${r.block_id}:${r.old_id}`, kind, ...base, old, new: { snippetId: best.id, text: best.text, revisionNo: Number(best.revision_no), headingPath: parseJson<string[]>(best.heading_path, []) }, similarity: Math.min(1, Math.round(bestScore * 100) / 100) });
    } else {
      items.push({ id: `${r.block_id}:${r.old_id}`, kind: 'removed' as UpdateKind, ...base, old, new: null, similarity: best ? Math.round(bestScore * 100) / 100 : 0, documentRemoved: !!r.removed_at });
    }
  }
  // neue Abschnitte: in der aktuellen Revision, ohne Vorgänger, in einem Kapitel/Unterkapitel, aus dem der Absatz stammt
  for (const [key, t] of touched) {
    const [documentId, versionId] = key.split('|');
    const used = matched.get(versionId) ?? new Set();
    const linked = new Set((await ctx.db.all(
      `SELECT x.snippet_id FROM content_block_sources x JOIN content_blocks b ON b.id = x.block_id WHERE b.chapter_version_id = ? AND b.deleted_at IS NULL`, versionId,
    )).map((x) => x.snippet_id));
    const dismissed = new Set((await ctx.db.all(
      'SELECT new_snippet_id FROM source_update_decisions WHERE project_id = ? AND old_snippet_id IS NULL AND block_id IN (SELECT id FROM content_blocks WHERE chapter_version_id = ?)', ctx.projectId, versionId,
    )).map((x) => x.new_snippet_id));
    const oldHashes = new Set((await ctx.db.all(
      'SELECT s.norm_hash FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id WHERE r.document_id = ? AND r.is_current = 0', documentId,
    )).map((x) => x.norm_hash));
    for (const c of await currentOf(documentId)) {
      if (used.has(c.id) || linked.has(c.id) || dismissed.has(c.id) || oldHashes.has(c.norm_hash)) continue;
      if (c.chapter_id !== t.s_chapter) continue;
      items.push({
        id: `${t.blockId}:+${c.id}`, kind: 'added' as UpdateKind, chapterId: t.chapterId, chapter: t.chapter, versionId: t.versionId, versionNo: t.versionNo, versionStatus: t.versionStatus,
        editable: t.editable, blockId: t.blockId, blockText: t.blockText, blockMode: t.blockMode, section: t.section, path: t.path,
        old: null, new: { snippetId: c.id, text: c.text, revisionNo: Number(c.revision_no), headingPath: parseJson<string[]>(c.heading_path, []) }, similarity: 0,
      });
    }
  }
  const count = (k: UpdateKind) => items.filter((i) => i.kind === k).length;
  return { summary: { regenerate: regenerate.size, total: items.length, changed: count('changed'), unchanged: count('unchanged'), removed: count('removed'), added: count('added'), chapters: new Set(items.map((i) => i.chapterId)).size }, items };
}

async function snippetInProject(ctx: Ctx, id: string, opts: { current?: boolean } = {}) {
  const s = await ctx.db.get(
    `SELECT s.*, r.is_current, d.project_id FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id WHERE s.id = ?`, id,
  );
  if (!s || s.project_id !== ctx.projectId) throw badRequest(`Textabschnitt ${id} existiert in diesem Projekt nicht.`);
  if (opts.current && !s.is_current) throw badRequest(`Textabschnitt ${id} stammt nicht aus der aktuellen Revision.`);
  return s;
}

export async function applySourceUpdate(ctx: Ctx, input: { blockId?: string; oldSnippetId?: string | null; newSnippetId?: string | null; action?: string; reason?: string }, user: User) {
  const action = input.action as Action;
  if (!ACTIONS.includes(action)) throw badRequest(`action muss eines von ${ACTIONS.join(', ')} sein.`);
  if (!input.blockId) throw badRequest('blockId ist Pflicht.');
  const b = await ctx.db.get(
    `SELECT b.*, c.project_id FROM content_blocks b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id WHERE b.id = ?`, input.blockId,
  );
  if (!b || b.project_id !== ctx.projectId) throw notFound(`Absatz ${input.blockId}`);
  const sources = (await ctx.db.all<{ snippet_id: string }>('SELECT snippet_id FROM content_block_sources WHERE block_id = ?', b.id)).map((x) => x.snippet_id);
  const oldId = input.oldSnippetId ?? null;
  const newId_ = input.newSnippetId ?? null;
  if (oldId && !sources.includes(oldId)) throw badRequest('oldSnippetId ist keine Quelle dieses Absatzes.');
  if (['replace', 'relink', 'remove'].includes(action) && !oldId) throw badRequest(`oldSnippetId ist für ${action} Pflicht.`);
  if (['replace', 'relink', 'append'].includes(action) && !newId_) throw badRequest(`newSnippetId ist für ${action} Pflicht.`);
  if (action === 'dismiss' && !oldId && !newId_) throw badRequest('oldSnippetId oder newSnippetId angeben.');
  const neu = newId_ ? await snippetInProject(ctx, newId_, { current: action !== 'dismiss' }) : null;
  if (oldId) await snippetInProject(ctx, oldId);
  const reason = input.reason?.trim().slice(0, 500) || null;
  const swapped = (ids: string[]) => [...new Set(ids.map((x) => (x === oldId ? newId_! : x)))];

  let result: unknown = null;
  await ctx.db.tx(async () => {
    if (action === 'replace') {
      result = await patchBlock(ctx, b.id, { text: neu!.text, sourceIds: swapped(sources), reason: reason ?? 'Quelle geändert – Text übernommen (Update-Eingang)' }, user.id);
    } else if (action === 'relink') {
      result = await patchBlock(ctx, b.id, { sourceIds: swapped(sources), reason: reason ?? 'Quelle aktualisiert, Text unverändert (Update-Eingang)' }, user.id);
    } else if (action === 'append') {
      // Geltungsbereich vom Nachbarabsatz übernehmen (Rollen, Sparten, Markt, Release, Bestätigung)
      const roles = (await ctx.db.all<{ role_code: string }>('SELECT role_code FROM content_block_roles WHERE block_id = ?', b.id)).map((x) => x.role_code);
      const divisions = (await ctx.db.all<{ division_code: string }>('SELECT division_code FROM content_block_divisions WHERE block_id = ?', b.id)).map((x) => x.division_code);
      result = await createBlock(ctx, b.chapter_version_id, {
        text: neu!.text, section: b.section_code, position: Number(b.position) + 1, kind: b.kind, sourceIds: [neu!.id], roles, divisions,
        market: b.market_code, release: b.release_code, scopeStatus: b.scope_status, reason: reason ?? 'neuer Quellabschnitt ergänzt (Update-Eingang)',
      }, user.id);
    } else if (action === 'remove') {
      if (sources.length > 1) {
        result = await patchBlock(ctx, b.id, { sourceIds: sources.filter((x) => x !== oldId), reason: reason ?? 'entfallene Quelle entfernt (Update-Eingang)' }, user.id);
      } else {
        await deleteBlock(ctx, b.id, reason ?? 'Quelle entfallen (Update-Eingang)', user.id);
      }
    }
    // dismiss: Absatz bleibt unverändert, die Änderung erscheint nicht mehr im Eingang (auch für freigegebene Versionen)
    await ctx.db.run(
      'INSERT INTO source_update_decisions (id, project_id, block_id, old_snippet_id, new_snippet_id, action, reason, decided_by, decided_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      newId('sud'), ctx.projectId, b.id, oldId, newId_, action, reason, user.id, now(),
    );
    await audit(ctx, user.id, 'source_update.decided', 'content_block', b.id, { action, oldSnippetId: oldId, newSnippetId: newId_, reason });
  });
  return { action, block: result };
}
