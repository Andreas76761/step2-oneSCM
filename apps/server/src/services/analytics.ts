// Analytik und Berichte (ADR-023): Kennzahlen-Zeitreihen, Freigabedauer, Projektbericht (PDF), BI-Export.
// Zustandsgrößen (offene Befunde, Abdeckung …) werden je Tag als Snapshot festgehalten,
// Flussgrößen (Befunde neu/erledigt, Freigaben, Importe) aus den Zeitstempeln der Fachdaten berechnet.
import type { Ctx } from '../context.js';
import { json, now, parseJson } from '../db.js';
import { badRequest } from '../problem.js';
import { renderPdf } from './render.js';
import { listReleases } from './releases.js';
import { translationStatus } from './translations.js';

export interface Kpis {
  snippets: number;
  confirmedSnippets: number;
  /** Anteil bestätigter Textabschnitte in % */
  confirmedShare: number;
  openFindings: number;
  openBlockers: number;
  chapters: number;
  approvedChapters: number;
  inReview: number;
  /** Anteil der Absätze in den aktuellen Kapitelständen mit Quelle oder Begründung in % */
  evidenceCoverage: number;
}
export const KPI_LABELS: Record<keyof Kpis, string> = {
  snippets: 'Textabschnitte', confirmedSnippets: 'Bestätigte Textabschnitte', confirmedShare: 'Bestätigt (%)', openFindings: 'Offene Befunde',
  openBlockers: 'Offene Blocker', chapters: 'Kapitel', approvedChapters: 'Freigegebene Kapitel', inReview: 'In Prüfung', evidenceCoverage: 'Nachweisabdeckung (%)',
};

const day = (iso: string) => iso.slice(0, 10);
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : 0);

export async function computeKpis(ctx: Ctx): Promise<Kpis> {
  const { db, projectId: pid } = ctx;
  const n = async (sql: string, ...p: unknown[]) => Number((await db.get<{ n: number }>(sql, ...p))?.n ?? 0);
  const cur = 'FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id WHERE r.is_current = 1 AND d.project_id = ?';
  const snippets = await n(`SELECT COUNT(*) AS n ${cur}`, pid);
  const confirmedSnippets = await n(`SELECT COUNT(*) AS n ${cur} AND s.evidence_status IN ('source_confirmed','manually_confirmed')`, pid);
  // aktueller Stand je Kapitel: höchste Versionsnummer
  const latest = `SELECT v.id FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ?
    AND v.version_no = (SELECT MAX(v2.version_no) FROM generated_chapter_versions v2 WHERE v2.chapter_id = v.chapter_id)`;
  const blocks = await n(`SELECT COUNT(*) AS n FROM content_blocks b WHERE b.deleted_at IS NULL AND b.kind <> 'gap' AND b.chapter_version_id IN (${latest})`, pid);
  const evidenced = await n(`SELECT COUNT(*) AS n FROM content_blocks b WHERE b.deleted_at IS NULL AND b.kind <> 'gap' AND b.chapter_version_id IN (${latest})
    AND (EXISTS (SELECT 1 FROM content_block_sources x WHERE x.block_id = b.id) OR COALESCE(TRIM(b.justification), '') <> '')`, pid);
  return {
    snippets, confirmedSnippets, confirmedShare: pct(confirmedSnippets, snippets),
    openFindings: await n("SELECT COUNT(*) AS n FROM quality_findings WHERE project_id = ? AND status IN ('open','deferred')", pid),
    openBlockers: await n("SELECT COUNT(*) AS n FROM quality_findings WHERE project_id = ? AND status IN ('open','deferred') AND severity = 'blocker'", pid),
    chapters: await n("SELECT COUNT(*) AS n FROM chapters WHERE project_id = ? AND key <> '__none__'", pid),
    approvedChapters: await n("SELECT COUNT(DISTINCT v.chapter_id) AS n FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND v.status = 'approved'", pid),
    inReview: await n("SELECT COUNT(*) AS n FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND v.status = 'in_review'", pid),
    evidenceCoverage: pct(evidenced, blocks),
  };
}

/** Kennzahlen des heutigen Tages festhalten (idempotent, überschreibt den Tageswert) */
export async function recordSnapshot(ctx: Ctx) {
  const metrics = await computeKpis(ctx);
  // archivierte Projekte sind nur lesbar
  if ((await ctx.db.get<{ archived_at: string | null }>('SELECT archived_at FROM projects WHERE id = ?', ctx.projectId))?.archived_at) return metrics;
  await ctx.db.run(
    'INSERT INTO kpi_snapshots (project_id, day, metrics, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT (project_id, day) DO UPDATE SET metrics = excluded.metrics, updated_at = excluded.updated_at',
    ctx.projectId, day(now()), json(metrics), now(),
  );
  return metrics;
}

/** Täglicher Job für alle nicht archivierten Projekte; plant sich selbst neu (eine Kette je Installation). */
export async function runDailySnapshots(ctx: Ctx, forProject: (id: string) => Ctx) {
  for (const p of await ctx.db.all<{ id: string }>('SELECT id FROM projects WHERE archived_at IS NULL')) await recordSnapshot(forProject(p.id));
  await ensureDailyJob(ctx, true);
}

export async function ensureDailyJob(ctx: Ctx, next = false) {
  if (!next && (await ctx.db.get("SELECT id FROM jobs WHERE type = 'kpi-daily' AND status IN ('queued','running')"))) return;
  // nächster Lauf 00:05 UTC; der aktuelle Tageswert entsteht zusätzlich bei jedem Aufruf der Analytik
  const t = new Date();
  const at = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate() + 1, 0, 5);
  await ctx.jobs.enqueue('kpi-daily', {}, 1, at - Date.now());
}

function range(from?: string, to?: string) {
  const re = /^\d{4}-\d{2}-\d{2}$/;
  if ((from && !re.test(from)) || (to && !re.test(to))) throw badRequest('from/to im Format JJJJ-MM-TT.');
  const end = to ?? day(now());
  const start = from ?? day(new Date(Date.parse(`${end}T00:00:00Z`) - 89 * 86_400_000).toISOString());
  if (start > end) throw badRequest('from liegt nach to.');
  if (Date.parse(end) - Date.parse(start) > 3 * 366 * 86_400_000) throw badRequest('Zeitraum höchstens drei Jahre.');
  return { start, end };
}

function* days(start: string, end: string) {
  for (let t = Date.parse(`${start}T00:00:00Z`); t <= Date.parse(`${end}T00:00:00Z`); t += 86_400_000) yield new Date(t).toISOString().slice(0, 10);
}

/** Zustandsgrößen je Tag; Tage ohne Snapshot übernehmen den letzten bekannten Wert (Stufenfunktion) */
export async function kpiSeries(ctx: Ctx, from?: string, to?: string) {
  const { start, end } = range(from, to);
  const rows = await ctx.db.all<{ day: string; metrics: string }>('SELECT day, metrics FROM kpi_snapshots WHERE project_id = ? AND day <= ? ORDER BY day', ctx.projectId, end);
  const byDay = new Map(rows.map((r) => [r.day, parseJson<Kpis>(r.metrics, {} as Kpis)]));
  let last: Kpis | null = null;
  for (const r of rows) if (r.day < start) last = byDay.get(r.day)!;
  const out: ({ day: string } & Kpis)[] = [];
  for (const d of days(start, end)) {
    last = byDay.get(d) ?? last;
    if (last) out.push({ day: d, ...last });
  }
  return out;
}

/** Flussgrößen je Tag aus den Zeitstempeln der Fachdaten */
export async function flowSeries(ctx: Ctx, from?: string, to?: string) {
  const { start, end } = range(from, to);
  const { db, projectId: pid } = ctx;
  const lo = `${start}T00:00:00`;
  const hi = `${end}T99`;
  const count = async (sql: string) => new Map((await db.all<{ d: string; n: number }>(sql, pid, lo, hi)).map((r) => [r.d, Number(r.n)]));
  const opened = await count('SELECT SUBSTR(created_at, 1, 10) AS d, COUNT(*) AS n FROM quality_findings WHERE project_id = ? AND created_at >= ? AND created_at < ? GROUP BY SUBSTR(created_at, 1, 10)');
  const closed = await count("SELECT SUBSTR(decided_at, 1, 10) AS d, COUNT(*) AS n FROM quality_findings WHERE project_id = ? AND decided_at >= ? AND decided_at < ? AND status IN ('resolved','ignored') GROUP BY SUBSTR(decided_at, 1, 10)");
  const decisions = (decision: string) => count(`SELECT SUBSTR(a.created_at, 1, 10) AS d, COUNT(*) AS n FROM approvals a JOIN generated_chapter_versions v ON v.id = a.chapter_version_id
    JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND a.created_at >= ? AND a.created_at < ? AND a.decision = '${decision}' GROUP BY SUBSTR(a.created_at, 1, 10)`);
  const approvals = await decisions('approved');
  const rejections = await decisions('rejected');
  const imports = await count('SELECT SUBSTR(created_at, 1, 10) AS d, COUNT(*) AS n FROM imports WHERE project_id = ? AND created_at >= ? AND created_at < ? GROUP BY SUBSTR(created_at, 1, 10)');
  const releases = await count('SELECT SUBSTR(created_at, 1, 10) AS d, COUNT(*) AS n FROM handbook_releases WHERE project_id = ? AND created_at >= ? AND created_at < ? GROUP BY SUBSTR(created_at, 1, 10)');
  return [...days(start, end)].map((d) => ({
    day: d, findingsOpened: opened.get(d) ?? 0, findingsResolved: closed.get(d) ?? 0, approvals: approvals.get(d) ?? 0,
    rejections: rejections.get(d) ?? 0, imports: imports.get(d) ?? 0, releases: releases.get(d) ?? 0,
  }));
}

const hours = (a: string, b: string) => Math.round(((Date.parse(b) - Date.parse(a)) / 3_600_000) * 10) / 10;
function quantile(sorted: number[], q: number) {
  if (!sorted.length) return null;
  const i = (sorted.length - 1) * q;
  const lo = Math.floor(i);
  return Math.round((sorted[lo] + (sorted[Math.ceil(i)] - sorted[lo]) * (i - lo)) * 10) / 10;
}

/** Freigabeentscheidungen mit Prüfdauer (Einreichen → Entscheidung) und Durchlaufzeit (Generierung → Freigabe) */
export async function approvalDecisions(ctx: Ctx, from?: string, to?: string) {
  const { start, end } = range(from, to);
  const rows = await ctx.db.all(
    `SELECT a.id, a.chapter_version_id AS version_id, a.decision, a.approver, a.created_at, v.version_no, v.generated_at, c.id AS chapter_id, c.title,
       (SELECT MAX(e.at) FROM audit_events e WHERE e.entity_type = 'chapter_version' AND e.entity_id = a.chapter_version_id
          AND e.action = 'chapter_version.submitted' AND e.at <= a.created_at) AS submitted_at
     FROM approvals a JOIN generated_chapter_versions v ON v.id = a.chapter_version_id JOIN chapters c ON c.id = v.chapter_id
     WHERE c.project_id = ? AND a.created_at >= ? AND a.created_at < ? ORDER BY a.created_at`,
    ctx.projectId, `${start}T00:00:00`, `${end}T99`,
  );
  return rows.map((r) => ({
    id: r.id as string, versionId: r.version_id as string, chapterId: r.chapter_id as string, chapter: r.title as string, versionNo: r.version_no as number,
    decision: r.decision as string, approver: r.approver as string, decidedAt: r.created_at as string, submittedAt: (r.submitted_at as string | null) ?? null,
    reviewHours: r.submitted_at ? hours(r.submitted_at, r.created_at) : null,
    leadHours: r.decision === 'approved' ? hours(r.generated_at, r.created_at) : null,
  }));
}

export async function approvalStats(ctx: Ctx, from?: string, to?: string) {
  const list = await approvalDecisions(ctx, from, to);
  const review = list.map((d) => d.reviewHours).filter((h): h is number => h !== null).sort((a, b) => a - b);
  const lead = list.map((d) => d.leadHours).filter((h): h is number => h !== null).sort((a, b) => a - b);
  return {
    decisions: list.length,
    approved: list.filter((d) => d.decision === 'approved').length,
    rejected: list.filter((d) => d.decision === 'rejected').length,
    /** Anteil der Entscheidungen, die im ersten Anlauf freigegeben wurden (je Version) */
    firstPassRate: pct(list.filter((d) => d.decision === 'approved' && !list.some((x) => x.versionId === d.versionId && x.decision === 'rejected')).length, new Set(list.map((d) => d.versionId)).size),
    reviewHours: { median: quantile(review, 0.5), p90: quantile(review, 0.9), max: review.at(-1) ?? null },
    leadHours: { median: quantile(lead, 0.5), p90: quantile(lead, 0.9), max: lead.at(-1) ?? null },
  };
}

export async function analyticsOverview(ctx: Ctx, from?: string, to?: string) {
  const current = await recordSnapshot(ctx); // Aufruf hält den Tageswert aktuell
  const { start, end } = range(from, to);
  return { from: start, to: end, current, labels: KPI_LABELS, series: await kpiSeries(ctx, start, end), flow: await flowSeries(ctx, start, end), approvals: await approvalStats(ctx, start, end) };
}

// ------------------------------------------------------------------ BI-Export

export const DATASETS = ['kpis', 'flow', 'approvals', 'chapters', 'findings'] as const;
type Dataset = (typeof DATASETS)[number];

async function chapterRows(ctx: Ctx) {
  const rows = await ctx.db.all(
    `SELECT c.id, c.title, c.position,
       (SELECT v.version_no FROM generated_chapter_versions v WHERE v.chapter_id = c.id ORDER BY v.version_no DESC LIMIT 1) AS latest_version,
       (SELECT v.status FROM generated_chapter_versions v WHERE v.chapter_id = c.id ORDER BY v.version_no DESC LIMIT 1) AS latest_status,
       (SELECT MAX(v.approved_at) FROM generated_chapter_versions v WHERE v.chapter_id = c.id AND v.status = 'approved') AS approved_at,
       (SELECT COUNT(*) FROM quality_findings f WHERE f.chapter_id = c.id AND f.status IN ('open','deferred')) AS open_findings,
       (SELECT COUNT(*) FROM quality_findings f WHERE f.chapter_id = c.id AND f.status IN ('open','deferred') AND f.severity = 'blocker') AS open_blockers
     FROM chapters c WHERE c.project_id = ? AND c.key <> '__none__' ORDER BY c.position, c.title`,
    ctx.projectId,
  );
  return rows.map((r) => ({
    chapterId: r.id, chapter: r.title, latestVersion: r.latest_version ?? null, latestStatus: r.latest_status ?? 'none', approvedAt: r.approved_at ?? null,
    openFindings: Number(r.open_findings), openBlockers: Number(r.open_blockers),
  }));
}

export async function dataset(ctx: Ctx, name: string, from?: string, to?: string): Promise<object[]> {
  switch (name as Dataset) {
    case 'kpis':
      await recordSnapshot(ctx);
      return kpiSeries(ctx, from, to);
    case 'flow':
      return flowSeries(ctx, from, to);
    case 'approvals':
      return approvalDecisions(ctx, from, to);
    case 'chapters':
      return chapterRows(ctx);
    case 'findings': {
      const { start, end } = range(from, to);
      return (await ctx.db.all(
        `SELECT f.seq, f.type, f.subtype, f.severity, f.status, c.title AS chapter, f.created_at, f.decided_at, f.decision FROM quality_findings f
         LEFT JOIN chapters c ON c.id = f.chapter_id WHERE f.project_id = ? AND f.created_at >= ? AND f.created_at < ? ORDER BY f.seq`,
        ctx.projectId, `${start}T00:00:00`, `${end}T99`,
      )).map((r) => ({ id: `B-${r.seq}`, type: r.type, subtype: r.subtype, severity: r.severity, status: r.status, chapter: r.chapter ?? null, createdAt: r.created_at, decidedAt: r.decided_at ?? null, decision: r.decision ?? null }));
    }
    default:
      throw badRequest(`Unbekannter Datensatz „${name}“. Verfügbar: ${DATASETS.join(', ')}`);
  }
}

/** CSV nach RFC 4180 mit BOM (Excel), Schutz vor Formel-Injektion in Tabellenkalkulationen */
export function toCsv(list: object[]) {
  const rows = list as Record<string, unknown>[];
  if (!rows.length) return '\ufeff';
  const cols = Object.keys(rows[0]);
  const cell = (v: unknown) => {
    if (v === null || v === undefined) return '';
    let s = String(v);
    if (typeof v === 'string' && /^[=+\-@\t\r]/.test(s)) s = `'${s}`;
    return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return `\ufeff${[cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\r\n')}\r\n`;
}

// ------------------------------------------------------------------ Projektbericht (PDF)

const STATUS_DE: Record<string, string> = { draft: 'Entwurf', in_review: 'in Prüfung', approved: 'freigegeben', superseded: 'ersetzt', none: 'nicht generiert' };
const fmtH = (h: number | null) => (h === null ? '–' : h < 48 ? `${h} h` : `${Math.round((h / 24) * 10) / 10} Tage`);
const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('de-DE', { timeZone: 'UTC' }) : '–');

export async function projectReport(ctx: Ctx, from?: string, to?: string) {
  const o = await analyticsOverview(ctx, from, to);
  const project = await ctx.db.get<{ name: string }>('SELECT name FROM projects WHERE id = ?', ctx.projectId);
  const chapters = await chapterRows(ctx);
  const translations = await translationStatus(ctx);
  const releases = (await listReleases(ctx)).slice(0, 5);
  const blockers = await ctx.db.all(
    `SELECT f.seq, f.type, f.reason, c.title FROM quality_findings f LEFT JOIN chapters c ON c.id = f.chapter_id
     WHERE f.project_id = ? AND f.status IN ('open','deferred') AND f.severity = 'blocker' ORDER BY f.seq LIMIT 20`, ctx.projectId,
  );
  const sum = (k: keyof (typeof o.flow)[number]) => o.flow.reduce((n, d) => n + Number(d[k]), 0);
  const first = o.series[0];
  const delta = (k: keyof Kpis) => (first ? Math.round((o.current[k] - first[k]) * 10) / 10 : null);
  const table = (head: string[], body: (string | number)[][], widths?: (string | number)[]) => ({
    table: { headerRows: 1, widths: widths ?? head.map(() => '*'), body: [head.map((h) => ({ text: h, bold: true, fillColor: '#eef2f7' })), ...body.map((r) => r.map((c) => String(c)))] },
    layout: 'lightHorizontalLines', margin: [0, 4, 0, 12], fontSize: 9,
  });
  const content: unknown[] = [
    { text: `Projektbericht – ${project?.name ?? ctx.projectId}`, style: 'h1' },
    { text: `Zeitraum ${fmtDate(o.from)} – ${fmtDate(o.to)} · erstellt ${new Date().toLocaleString('de-DE', { timeZone: 'UTC' })} UTC`, color: '#555', margin: [0, 0, 0, 12] },
    { text: 'Kennzahlen', style: 'h2' },
    table(['Kennzahl', 'Aktuell', 'Veränderung im Zeitraum'], (Object.keys(KPI_LABELS) as (keyof Kpis)[]).map((k) => {
      const d = delta(k);
      return [KPI_LABELS[k], o.current[k], d === null ? '–' : d > 0 ? `+${d}` : `${d}`];
    }), ['*', 80, 140]),
    { text: 'Aktivität im Zeitraum', style: 'h2' },
    table(['Befunde neu', 'Befunde erledigt', 'Freigaben', 'Ablehnungen', 'Importe', 'Releases'], [[sum('findingsOpened'), sum('findingsResolved'), sum('approvals'), sum('rejections'), sum('imports'), sum('releases')]]),
    { text: 'Freigabeprozess', style: 'h2' },
    table(['Entscheidungen', 'Erstfreigabequote', 'Prüfdauer Median', 'Prüfdauer P90', 'Durchlaufzeit Median'], [[
      o.approvals.decisions, `${o.approvals.firstPassRate} %`, fmtH(o.approvals.reviewHours.median), fmtH(o.approvals.reviewHours.p90), fmtH(o.approvals.leadHours.median),
    ]]),
    { text: 'Kapitelstatus', style: 'h2' },
    chapters.length
      ? table(['Kapitel', 'Version', 'Status', 'Freigegeben am', 'Offene Befunde', 'Blocker'], chapters.map((c) => [
        c.chapter, c.latestVersion ?? '–', STATUS_DE[c.latestStatus] ?? c.latestStatus, fmtDate(c.approvedAt), c.openFindings, c.openBlockers,
      ]), ['*', 45, 70, 75, 55, 40])
      : { text: 'Noch keine Kapitel.', italics: true, margin: [0, 0, 0, 12] },
    { text: 'Offene Blocker', style: 'h2' },
    blockers.length
      ? table(['Befund', 'Typ', 'Kapitel', 'Begründung'], blockers.map((b) => [`B-${b.seq}`, b.type, b.title ?? '–', String(b.reason).slice(0, 160)]), [45, 70, 110, '*'])
      : { text: 'Keine offenen Blocker.', margin: [0, 0, 0, 12] },
  ];
  if (translations.length) {
    content.push({ text: 'Übersetzungsstand', style: 'h2' }, table(['Sprache', 'Freigegeben', 'Entwurf', 'Veraltet', 'Fehlend'], translations.map((t) => [t.languageName, `${t.approved}/${t.chapters}`, t.draft, t.outdated, t.missing])));
  }
  content.push({ text: 'Veröffentlichungen', style: 'h2' }, releases.length
    ? table(['Version', 'Titel', 'Datum', 'Kapitel'], releases.map((r) => [r.version, r.title, fmtDate(r.createdAt), r.chapters.length]))
    : { text: 'Noch keine Veröffentlichung.', margin: [0, 0, 0, 12] });
  return renderPdf({
    info: { title: `Projektbericht ${project?.name ?? ''}`, creator: 'oneSCM Handbook Studio' },
    pageSize: 'A4', pageMargins: [40, 50, 40, 50], defaultStyle: { font: 'Roboto', fontSize: 10 },
    styles: { h1: { fontSize: 18, bold: true, margin: [0, 0, 0, 4] }, h2: { fontSize: 13, bold: true, margin: [0, 8, 0, 2] } },
    footer: (page: number, pages: number) => ({ text: `Seite ${page} von ${pages}`, alignment: 'right', margin: [40, 10], fontSize: 8, color: '#777' }),
    content,
  });
}
