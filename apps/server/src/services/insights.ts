// Evidenz- und Quellenansicht (US-011) und Optimierungsübersicht (US-013).
import type { Ctx } from '../context.js';
import { CHAPTER_SECTIONS, CONFIRMED_EVIDENCE } from '../domain/reference.js';
import { notFound } from '../problem.js';
import { listChapters } from './chapters.js';

export type EvidenceIssue = 'no_evidence' | 'justified_only' | 'outdated_source' | 'unconfirmed_source' | 'excluded_source' | 'scope_unconfirmed' | 'needs_regeneration';

export const EVIDENCE_ISSUE_LABELS: Record<EvidenceIssue, string> = {
  no_evidence: 'Weder Quelle noch Begründung',
  justified_only: 'Nur manuelle Begründung, keine Quelle',
  outdated_source: 'Quelle stammt aus einer veralteten Revision',
  unconfirmed_source: 'Quelle ist nicht bestätigt',
  excluded_source: 'Quelle wurde durch eine Widerspruchsentscheidung ausgeschlossen',
  scope_unconfirmed: 'Rolle/Sparte/Markt/Release nicht bestätigt',
  needs_regeneration: 'Manuell bearbeitet, Quelle hat sich geändert',
};

export async function evidenceForVersion(ctx: Ctx, versionId: string) {
  const v = await ctx.db.get('SELECT id, chapter_id, version_no, status, title FROM generated_chapter_versions WHERE id = ?', versionId);
  if (!v) throw notFound(`Kapitelversion ${versionId}`);
  const blocks = await ctx.db.all(
    'SELECT id, section_code, position, kind, text, mode, justification, scope_status FROM content_blocks WHERE chapter_version_id = ? AND deleted_at IS NULL ORDER BY position',
    versionId,
  );
  const sources = await ctx.db.all(
    `SELECT x.block_id, s.id AS snippet_id, s.seq, s.text, s.evidence_status, s.excluded_reason, s.line_start, s.line_end, d.path, r.id AS revision_id, r.revision_no, r.is_current
     FROM content_block_sources x JOIN content_blocks b ON b.id = x.block_id JOIN text_snippets s ON s.id = x.snippet_id
     JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id
     WHERE b.chapter_version_id = ? AND b.deleted_at IS NULL ORDER BY s.seq`,
    versionId,
  );
  const bySection = new Map(CHAPTER_SECTIONS.map((s) => [s.code as string, s.title as string]));
  const rows = blocks.map((b) => {
    const src = sources.filter((s) => s.block_id === b.id).map((s) => ({
      snippetId: s.snippet_id as string, seq: s.seq as number, text: s.text as string, path: s.path as string, revisionId: s.revision_id as string,
      revisionNo: s.revision_no as number, isCurrent: !!s.is_current, lineStart: s.line_start as number, lineEnd: s.line_end as number,
      evidenceStatus: s.evidence_status as string, excludedReason: (s.excluded_reason as string | null) ?? null,
    }));
    const issues: EvidenceIssue[] = [];
    if (!src.length && !b.justification?.trim()) issues.push('no_evidence');
    else if (!src.length) issues.push('justified_only');
    if (src.some((s) => !s.isCurrent)) issues.push('outdated_source');
    if (src.some((s) => !CONFIRMED_EVIDENCE.includes(s.evidenceStatus))) issues.push('unconfirmed_source');
    if (src.some((s) => s.excludedReason)) issues.push('excluded_source');
    if (b.scope_status !== 'confirmed' && b.scope_status !== 'general') issues.push('scope_unconfirmed');
    if (b.mode === 'needs_regeneration') issues.push('needs_regeneration');
    return {
      blockId: b.id as string, section: b.section_code as string, sectionTitle: bySection.get(b.section_code) ?? b.section_code, kind: b.kind as string,
      text: b.text as string, mode: b.mode as string, justification: (b.justification as string | null) ?? null, scopeStatus: b.scope_status as string,
      sources: src, issues,
    };
  });
  const count = (i: EvidenceIssue) => rows.filter((r) => r.issues.includes(i)).length;
  const withEvidence = rows.filter((r) => !r.issues.includes('no_evidence')).length;
  return {
    versionId: v.id as string, chapterId: v.chapter_id as string, versionNo: v.version_no as number, status: v.status as string, title: v.title as string,
    summary: {
      blocks: rows.length,
      withSources: rows.filter((r) => r.sources.length).length,
      justifiedOnly: count('justified_only'),
      withoutEvidence: count('no_evidence'),
      outdatedSources: count('outdated_source'),
      unconfirmedSources: count('unconfirmed_source'),
      excludedSources: count('excluded_source'),
      scopeUnconfirmed: count('scope_unconfirmed'),
      coverage: rows.length ? Math.round((withEvidence / rows.length) * 100) : 0,
    },
    issueLabels: EVIDENCE_ISSUE_LABELS,
    blocks: rows,
  };
}

export interface Recommendation {
  priority: 1 | 2 | 3;
  chapterId: string;
  chapter: string;
  text: string;
  target: 'widersprueche' | 'quellen' | 'generator' | 'werkstatt' | 'freigabe' | 'optimierungen';
}

/** Kennzahlen je Kapitel und priorisierte Handlungsempfehlungen */
export async function optimizationOverview(ctx: Ctx) {
  const chapters = await listChapters(ctx);
  const open = await ctx.db.all(
    `SELECT f.type, f.severity, COALESCE(f.chapter_id, s.chapter_id) AS chapter_id, COUNT(*) AS n FROM quality_findings f
     LEFT JOIN text_snippets s ON s.id = f.snippet_a_id
     WHERE f.project_id = ? AND f.status IN ('open','deferred') GROUP BY f.type, f.severity, COALESCE(f.chapter_id, s.chapter_id)`,
    ctx.projectId,
  );
  const rows = [];
  const recommendations: Recommendation[] = [];
  for (const c of chapters) {
    const byType: Record<string, number> = {};
    for (const f of open.filter((o) => o.chapter_id === c.id)) byType[f.type] = (byType[f.type] ?? 0) + f.n;
    const latest = c.versions[0] ?? null;
    const evidence = latest ? (await evidenceForVersion(ctx, latest.id)).summary : null;
    const confirmedPct = c.snippetCount ? Math.round((c.confirmedSnippetCount / c.snippetCount) * 100) : 0;
    rows.push({
      chapterId: c.id, title: c.title, snippets: c.snippetCount, confirmedPct, openFindings: c.openFindings, blockers: c.openBlockers, findingsByType: byType,
      latestVersion: latest ? { id: latest.id, versionNo: latest.versionNo, status: latest.status } : null, evidence,
    });
    const rec = (priority: 1 | 2 | 3, text: string, target: Recommendation['target']) => recommendations.push({ priority, chapterId: c.id, chapter: c.title, text, target });
    if (c.openBlockers) rec(1, `${c.openBlockers} Blocker-Befund(e) klären`, 'widersprueche');
    if (c.snippetCount && c.confirmedSnippetCount < c.snippetCount) rec(2, `${c.snippetCount - c.confirmedSnippetCount} unbestätigte Textabschnitte prüfen und bestätigen`, 'quellen');
    if (!latest && c.confirmedSnippetCount && !c.openBlockers) rec(2, 'Kapitel ist generierbar, aber noch nicht generiert', 'generator');
    if (evidence?.withoutEvidence) rec(1, `${evidence.withoutEvidence} Absatz/Absätze ohne Quelle oder Begründung`, 'werkstatt');
    if (evidence?.outdatedSources) rec(2, `${evidence.outdatedSources} Absatz/Absätze mit veralteter Quelle – neu generieren`, 'generator');
    if (evidence?.scopeUnconfirmed) rec(2, `${evidence.scopeUnconfirmed} Absatz/Absätze mit unbestätigter Rollen-/Spartenzuordnung`, 'werkstatt');
    if (latest?.status === 'in_review') rec(2, 'Version wartet auf fachliche Freigabe', 'freigabe');
    if ((byType.terminology ?? 0) + (byType.readability ?? 0)) rec(3, `${(byType.terminology ?? 0) + (byType.readability ?? 0)} Terminologie-/Lesbarkeitshinweise`, 'optimierungen');
  }
  recommendations.sort((a, b) => a.priority - b.priority || a.chapter.localeCompare(b.chapter));
  const totals = {
    chapters: rows.length,
    approved: rows.filter((r) => r.latestVersion?.status === 'approved').length,
    inReview: rows.filter((r) => r.latestVersion?.status === 'in_review').length,
    blockers: rows.reduce((s, r) => s + r.blockers, 0),
    evidenceCoverage: (() => {
      const withVersion = rows.filter((r) => r.evidence?.blocks);
      const blocks = withVersion.reduce((s, r) => s + r.evidence!.blocks, 0);
      const covered = withVersion.reduce((s, r) => s + r.evidence!.blocks - r.evidence!.withoutEvidence, 0);
      return blocks ? Math.round((covered / blocks) * 100) : null;
    })(),
  };
  return { totals, chapters: rows, recommendations };
}
