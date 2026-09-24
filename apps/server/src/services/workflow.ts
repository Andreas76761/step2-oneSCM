// Mehrstufige Freigabe (ADR-025). Ersetzt die einstufige Freigabe (E-12) nur, wenn ein Projekt einen Workflow festlegt.
// Eine eingereichte Version hält einen Schnappschuss des Workflows – spätere Änderungen betreffen nur neue Einreichungen.
import { audit, type Ctx } from '../context.js';
import { json, now, parseJson, type Row } from '../db.js';
import { badRequest, conflict, forbidden } from '../problem.js';
import { collaborators, systemNotice } from './collaboration.js';

export interface Stage {
  key: string;
  name: string;
  /** leer: jede Person mit Berechtigung approve im Projekt */
  approvers: string[];
  minApprovals: number;
  /** Frist in Tagen ab Beginn der Stufe; null = ohne Frist */
  dueDays: number | null;
}
export interface Workflow {
  stages: Stage[];
  /** Vier-Augen-Prinzip: einreichende Person entscheidet nicht, niemand stimmt in zwei Stufen zu */
  fourEyes: boolean;
}

/** Standard: einstufig wie bisher (E-12) – eine Freigabe durch eine Person mit Berechtigung approve */
export const DEFAULT_WORKFLOW: Workflow = { stages: [{ key: 'freigabe', name: 'Freigabe', approvers: [], minApprovals: 1, dueDays: null }], fourEyes: false };

const configured = (raw: unknown): raw is Workflow => !!raw && Array.isArray((raw as Workflow).stages) && (raw as Workflow).stages.length > 0;

export async function getWorkflow(ctx: Ctx): Promise<Workflow & { configured: boolean }> {
  const p = await ctx.db.get<{ approval_workflow: string }>('SELECT approval_workflow FROM projects WHERE id = ?', ctx.projectId);
  const raw = parseJson<unknown>(p?.approval_workflow, {});
  return configured(raw) ? { ...raw, configured: true } : { ...DEFAULT_WORKFLOW, configured: false };
}

const slug = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'stufe';

/** Workflow festlegen (Administration). Leere Stufenliste stellt die einstufige Freigabe wieder her. */
export async function setWorkflow(ctx: Ctx, input: { stages?: Partial<Stage>[]; fourEyes?: boolean }, actor: string) {
  const stagesIn = input.stages ?? [];
  if (!Array.isArray(stagesIn) || stagesIn.length > 6) throw badRequest('Höchstens 6 Freigabestufen.');
  const people = await collaborators(ctx);
  const approversOk = new Set(people.filter((p) => p.permissions.includes('approve')).map((p) => p.id));
  const keys = new Set<string>();
  const stages: Stage[] = stagesIn.map((s, i) => {
    const name = String(s.name ?? '').trim();
    if (!name || name.length > 80) throw badRequest(`Stufe ${i + 1}: Name (1–80 Zeichen) erforderlich.`);
    let key = slug(name);
    while (keys.has(key)) key = `${key}-${i + 1}`;
    keys.add(key);
    const approvers = [...new Set((s.approvers ?? []).map(String))];
    const unknown = approvers.filter((a) => !approversOk.has(a));
    if (unknown.length) throw badRequest(`Stufe „${name}“: ${unknown.join(', ')} hat keine Berechtigung approve in diesem Projekt.`);
    const minApprovals = Number(s.minApprovals ?? 1);
    const pool = approvers.length || approversOk.size;
    if (!Number.isInteger(minApprovals) || minApprovals < 1 || minApprovals > Math.max(1, pool)) {
      throw badRequest(`Stufe „${name}“: Mindestanzahl Zustimmungen 1 … ${Math.max(1, pool)}.`);
    }
    const dueDays = s.dueDays === null || s.dueDays === undefined || (s.dueDays as unknown) === '' ? null : Number(s.dueDays);
    if (dueDays !== null && (!Number.isInteger(dueDays) || dueDays < 1 || dueDays > 90)) throw badRequest(`Stufe „${name}“: Frist 1 … 90 Tage oder leer.`);
    return { key, name, approvers, minApprovals, dueDays };
  });
  const wf = stages.length ? { stages, fourEyes: input.fourEyes ?? true } : {};
  await ctx.db.tx(async () => {
    await ctx.db.run('UPDATE projects SET approval_workflow = ? WHERE id = ?', json(wf), ctx.projectId);
    await audit(ctx, actor, 'project.approval_workflow', 'project', ctx.projectId, wf);
  });
  return getWorkflow(ctx);
}

/** Workflow einer eingereichten Version (Schnappschuss; ältere Einreichungen ohne Schnappschuss: Standard) */
export function versionWorkflow(v: Row): Workflow {
  const w = parseJson<unknown>(v.workflow, null);
  return configured(w) ? w : DEFAULT_WORKFLOW;
}

const dueAt = (stage: Stage) => (stage.dueDays ? new Date(Date.now() + stage.dueDays * 86_400_000).toISOString() : null);

/** Personen, die in einer Stufe entscheiden dürfen */
export async function stageApprovers(ctx: Ctx, stage: Stage) {
  if (stage.approvers.length) return stage.approvers;
  return (await collaborators(ctx)).filter((p) => p.permissions.includes('approve')).map((p) => p.id);
}

/** Beim Einreichen: Schnappschuss und erste Stufe setzen, Freigebende benachrichtigen (nur bei eigenem Workflow) */
export async function startWorkflow(ctx: Ctx, v: Row, actor: string) {
  const wf = await getWorkflow(ctx);
  const { configured: isCustom, ...snapshot } = wf;
  const stage = snapshot.stages[0];
  await ctx.db.run(
    'UPDATE generated_chapter_versions SET workflow = ?, current_stage = 0, stage_started_at = ?, stage_due_at = ?, stage_escalated_at = NULL WHERE id = ?',
    json(snapshot), now(), dueAt(stage), v.id,
  );
  if (isCustom) await announceStage(ctx, v, stage, 0, snapshot, actor);
}

async function announceStage(ctx: Ctx, v: Row, stage: Stage, index: number, wf: Workflow, actor: string) {
  const people = (await stageApprovers(ctx, stage)).filter((p) => !(wf.fourEyes && p === (v.submitted_by ?? actor)));
  const due = stage.dueDays ? ` Frist: ${stage.dueDays} Tag(e).` : '';
  await systemNotice(ctx, v.chapter_id, `Freigabestufe ${index + 1}/${wf.stages.length} „${stage.name}“ wartet auf Ihre Entscheidung: „${v.title}“, Version ${v.version_no}.${due}`, people, 'approval');
}

export function clearWorkflowSql() {
  return 'workflow = NULL, current_stage = NULL, stage_started_at = NULL, stage_due_at = NULL, stage_escalated_at = NULL';
}

/** Zustimmungen der laufenden Einreichung (seit dem Einreichen) */
async function currentVotes(ctx: Ctx, v: Row) {
  return ctx.db.all<{ approver: string; stage: string | null; decision: string; created_at: string }>(
    "SELECT approver, stage, decision, created_at FROM approvals WHERE chapter_version_id = ? AND decision = 'approved' AND created_at >= ? ORDER BY created_at",
    v.id, v.submitted_at ?? '',
  );
}

/** Prüft, ob `actor` in der aktuellen Stufe entscheiden darf; liefert Stufe und Workflow */
export async function checkDecider(ctx: Ctx, v: Row, actor: string) {
  const wf = versionWorkflow(v);
  const index = Math.min(Number(v.current_stage ?? 0), wf.stages.length - 1);
  const stage = wf.stages[index];
  if (stage.approvers.length && !stage.approvers.includes(actor)) throw forbidden(`Sie entscheiden nicht in der Freigabestufe „${stage.name}“.`);
  if (wf.fourEyes) {
    if (actor === v.submitted_by) throw forbidden('Vier-Augen-Prinzip: Die einreichende Person entscheidet nicht über die eigene Einreichung.');
    if ((await currentVotes(ctx, v)).some((x) => x.approver === actor)) throw conflict('Vier-Augen-Prinzip: Sie haben dieser Einreichung bereits zugestimmt.');
  }
  return { wf, stage, index };
}

/**
 * Zustimmung in der aktuellen Stufe verbuchen. Liefert `final: true`, wenn damit die letzte Stufe abgeschlossen ist
 * (der Aufrufer setzt dann die Version auf freigegeben), sonst rückt die Version ggf. in die nächste Stufe.
 */
export async function recordApproval(ctx: Ctx, v: Row, actor: string, stage: Stage, index: number, wf: Workflow, insertApproval: (stage: string, final: boolean) => Promise<void>) {
  const votes = (await currentVotes(ctx, v)).filter((x) => x.stage === stage.key && x.approver !== actor).length + 1;
  const stageDone = votes >= stage.minApprovals;
  const last = index === wf.stages.length - 1;
  await insertApproval(stage.key, stageDone && last);
  if (!stageDone) {
    await audit(ctx, actor, 'chapter_version.stage_vote', 'chapter_version', v.id, { stage: stage.key, votes, required: stage.minApprovals });
    return { final: false };
  }
  if (last) return { final: true };
  const next = wf.stages[index + 1];
  const res = await ctx.db.run(
    "UPDATE generated_chapter_versions SET current_stage = ?, stage_started_at = ?, stage_due_at = ?, stage_escalated_at = NULL WHERE id = ? AND status = 'in_review' AND current_stage = ?",
    index + 1, now(), dueAt(next), v.id, index,
  );
  if (!res.changes) throw conflict('Kapitelversion wurde zwischenzeitlich geändert.');
  await audit(ctx, actor, 'chapter_version.stage_completed', 'chapter_version', v.id, { stage: stage.key, next: next.key });
  await announceStage(ctx, v, next, index + 1, wf, actor);
  return { final: false };
}

/** Stand des Workflows für die Anzeige */
export async function workflowState(ctx: Ctx, v: Row) {
  if (v.status !== 'in_review' && !v.workflow) return null;
  const wf = versionWorkflow(v);
  const votes = v.status === 'in_review' ? await currentVotes(ctx, v) : [];
  const index = Number(v.current_stage ?? 0);
  return {
    fourEyes: wf.fourEyes,
    currentStage: v.status === 'in_review' ? index : null,
    dueAt: v.status === 'in_review' ? v.stage_due_at ?? null : null,
    overdue: v.status === 'in_review' && !!v.stage_due_at && v.stage_due_at < now(),
    escalatedAt: v.stage_escalated_at ?? null,
    stages: wf.stages.map((s, i) => ({
      key: s.key, name: s.name, approvers: s.approvers, minApprovals: s.minApprovals, dueDays: s.dueDays,
      status: v.status !== 'in_review' ? 'done' : i < index ? 'done' : i === index ? 'active' : 'pending',
      votes: votes.filter((x) => x.stage === s.key).map((x) => ({ approver: x.approver, at: x.created_at })),
    })),
  };
}

/** Offene Entscheidungen der Person (aktuelle Stufe, nicht eigene Einreichung, noch nicht zugestimmt) */
export async function myPendingApprovals(ctx: Ctx, userId: string) {
  const rows = await ctx.db.all(
    `SELECT v.*, c.title AS chapter_title FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id
     WHERE c.project_id = ? AND v.status = 'in_review' ORDER BY v.stage_due_at IS NULL, v.stage_due_at, v.submitted_at`,
    ctx.projectId,
  );
  const out = [];
  for (const v of rows) {
    try {
      const { stage, index, wf } = await checkDecider(ctx, v, userId);
      if (!(await stageApprovers(ctx, stage)).includes(userId)) continue;
      out.push({
        versionId: v.id, chapterId: v.chapter_id, chapter: v.chapter_title, versionNo: v.version_no, stage: stage.name, stageIndex: index, stages: wf.stages.length,
        submittedBy: v.submitted_by, submittedAt: v.submitted_at, dueAt: v.stage_due_at ?? null, overdue: !!v.stage_due_at && v.stage_due_at < now(),
      });
    } catch {
      /* nicht entscheidungsberechtigt */
    }
  }
  return out;
}

/** Job `approval-escalation`: überfällige Stufen einmalig eskalieren (Freigebende der Stufe und Projektadministration) */
export async function escalateOverdue(ctx: Ctx, forProject: (id: string) => Ctx) {
  const rows = await ctx.db.all(
    `SELECT v.*, c.project_id FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id
     WHERE v.status = 'in_review' AND v.stage_due_at IS NOT NULL AND v.stage_due_at < ? AND v.stage_escalated_at IS NULL`,
    now(),
  );
  let escalated = 0;
  for (const v of rows) {
    const pctx = forProject(v.project_id);
    const wf = versionWorkflow(v);
    const stage = wf.stages[Number(v.current_stage ?? 0)];
    const admins = (await collaborators(pctx)).filter((p) => p.permissions.includes('admin')).map((p) => p.id);
    await pctx.db.tx(async () => {
      const res = await pctx.db.run('UPDATE generated_chapter_versions SET stage_escalated_at = ? WHERE id = ? AND stage_escalated_at IS NULL', now(), v.id);
      if (!res.changes) return;
      await systemNotice(pctx, v.chapter_id, `Frist überschritten: Freigabestufe „${stage.name}“ für „${v.title}“, Version ${v.version_no} (fällig ${new Date(v.stage_due_at).toLocaleDateString('de-DE', { timeZone: 'UTC' })}).`,
        [...(await stageApprovers(pctx, stage)), ...admins].filter((p) => !(wf.fourEyes && p === v.submitted_by)), 'escalation');
      await audit(pctx, 'system', 'chapter_version.escalated', 'chapter_version', v.id, { stage: stage.key, dueAt: v.stage_due_at });
      escalated++;
    });
  }
  ctx.jobs.wake();
  return escalated;
}

/** Stündliche Prüfung auf überfällige Stufen (eine Kette je Installation) */
export async function ensureEscalationJob(ctx: Ctx, next = false) {
  if (!next && (await ctx.db.get("SELECT id FROM jobs WHERE type = 'approval-escalation' AND status IN ('queued','running')"))) return;
  await ctx.jobs.enqueue('approval-escalation', {}, 1, next ? 3_600_000 : 60_000);
}
