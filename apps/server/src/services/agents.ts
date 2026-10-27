// Agenten in der App (ADR-100): Katalog (TRIAGE, GOAL, ORCHESTRATOR und die Agenten des Arbeitsordners), Aufgaben
// (offene Todos), Entscheidungen, Ziel-Abgleich (GOAL) und Planung (ORCHESTRATOR). Der Orchestrator leitet Aufgaben und
// Entscheidungen aus dem Stand ab, verfeinert sie bei jedem Lauf (erledigte schließen, Prioritäten anpassen) und gibt
// Freigaben nie selbst – Entscheidungen trifft ein Mensch.
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { REQUIRED_GROUPS } from '../domain/metadataLabels.js';
import { badRequest, conflict, notFound } from '../problem.js';
import { contentDashboard, newSubchapters } from './triage.js';

export interface AgentInfo { code: string; name: string; purpose: string; inApp: boolean; folder: string | null; link: string | null }

export const AGENTS: AgentInfo[] = [
  { code: 'orchestrator', name: 'ORCHESTRATOR', purpose: 'steuert alle Agenten: plant Aufgaben aus dem Stand, verfeinert sie bei jedem Lauf, legt Entscheidungen vor', inApp: true, folder: '00_Dokumentation/Agenten', link: '/agenten' },
  { code: 'triage', name: 'TRIAGE', purpose: 'ordnet nach dem Einlesen jedem Chunk die Pflichtlabels zu und schlägt Kapitel und Unterkapitel vor (auch neue mit Kennung „neu“)', inApp: true, folder: '01_Input', link: '/metadaten/triage' },
  { code: 'goal', name: 'GOAL', purpose: 'vergleicht den Stand aller Funktionen mit dem Ziel und erstellt Empfehlungen', inApp: true, folder: '12_Goal', link: '/agenten/goal' },
  { code: 'input-sortierer', name: 'input-sortierer', purpose: 'Eingang sichten, Datenschutz, Dubletten, Raw-Jahr, Zuordnung', inApp: false, folder: '01_Input', link: '/metadaten/einlesen' },
  { code: 'uebersetzer-de', name: 'uebersetzer-de', purpose: 'fremdsprachige Quellen ins Deutsche (dt_-Dateien)', inApp: false, folder: '02_Kapitel', link: null },
  { code: 'steuerung', name: 'steuerung', purpose: 'Rollen, Markt und Sparte je Unterkapitel', inApp: false, folder: '02_Kapitel/<Kapitel>/08_Steuerung', link: '/kapitelsteuerung' },
  { code: 'kapitel-redakteur', name: 'kapitel-redakteur', purpose: 'Entwurf je Unterkapitel aus den Quellen', inApp: false, folder: '02_Kapitel/<Kapitel>/02_Entwurf', link: '/werkstatt' },
  { code: 'bild-redakteur', name: 'bild-redakteur', purpose: 'Bilder, Alternativtext, Anonymisierung', inApp: false, folder: '02_Kapitel/<Kapitel>/03_Bilder', link: '/bildarchiv' },
  { code: 'faq-redakteur', name: 'faq-redakteur', purpose: 'Fragen mit belegter Antwort', inApp: false, folder: '02_Kapitel/<Kapitel>/06_FAQ', link: '/metadaten/fragen' },
  { code: 'sprach-lektor', name: 'sprach-lektor', purpose: 'Grammatik, Synonyme, Tonalität', inApp: false, folder: '07_III_Grammatik_Synonyme_Fehlerliste', link: '/schreibstil' },
  { code: 'pruefer', name: 'pruefer', purpose: 'Entwürfe prüfen – ändert keine Texte', inApp: false, folder: '02_Kapitel/<Kapitel>/04_Pruefung_Freigabe', link: '/anleitungs-check' },
  { code: 'auditor', name: 'auditor', purpose: 'Nachweisführung prüfen und messen', inApp: false, folder: '02_Kapitel/<Kapitel>/05_Audit', link: '/evidenz' },
  { code: 'ideen-sammler', name: 'ideen-sammler', purpose: 'Ideen und Zukünftiges festhalten', inApp: false, folder: '02_Kapitel/<Kapitel>/07_Ideenspeicher', link: null },
  { code: 'pipeline-redakteur', name: 'pipeline-redakteur', purpose: 'Pipeline, Backlog, Intern pflegen', inApp: false, folder: '09_Pipeline', link: '/pipeline' },
  { code: 'uebersetzer-ausgabe', name: 'uebersetzer-ausgabe', purpose: 'freigegebene Kapitel und Produkte übersetzen', inApp: false, folder: '08_IV_Translation', link: '/uebersetzungen' },
  { code: 'ausgabe-produzent', name: 'ausgabe-produzent', purpose: 'fertige Produkte aus freigegebenen Kapiteln', inApp: false, folder: '05_I_Output', link: '/export' },
  { code: 'stil-designer', name: 'stil-designer', purpose: 'Design, Tonalität, Vorlagen', inApp: false, folder: '06_II_Stil_und_Design', link: null },
  { code: 'gliederungs-pfleger', name: 'gliederungs-pfleger', purpose: 'Ordner und Agenten mit Gliederungen abgleichen', inApp: false, folder: '00_Dokumentation/Gliederung', link: '/stammdaten/inhaltsverzeichnis' },
];
const AGENT_CODES = AGENTS.map((a) => a.code);
const TASK_STATUS = ['open', 'in_progress', 'done', 'dropped'];

// ---------------------------------------------------------------- Aufgaben

const taskDto = (r: Row) => ({
  id: r.id, agent: r.agent, title: r.title, detail: r.detail ?? null, status: r.status, priority: Number(r.priority), source: r.source, key: r.task_key ?? null, link: r.link ?? null,
  createdBy: r.created_by, createdAt: r.created_at, updatedBy: r.updated_by, updatedAt: r.updated_at, doneAt: r.done_at ?? null,
});

export async function listTasks(ctx: Ctx, opts: { agent?: string; status?: string } = {}) {
  const where = ['project_id = ?'];
  const params: unknown[] = [ctx.projectId];
  if (opts.agent) (where.push('agent = ?'), params.push(opts.agent));
  if (opts.status === 'active') where.push("status IN ('open', 'in_progress')");
  else if (opts.status) (where.push('status = ?'), params.push(opts.status));
  return (await ctx.db.all(`SELECT * FROM agent_tasks WHERE ${where.join(' AND ')} ORDER BY CASE status WHEN 'in_progress' THEN 0 WHEN 'open' THEN 1 ELSE 2 END, priority, created_at`, ...params)).map(taskDto);
}

function cleanTask(input: any, prev?: Row) {
  const agent = String(input.agent ?? prev?.agent ?? '');
  if (!AGENT_CODES.includes(agent)) throw badRequest(`agent muss einer von ${AGENT_CODES.join(', ')} sein.`);
  const title = String(input.title ?? prev?.title ?? '').trim().replace(/\s+/g, ' ');
  if (title.length < 3 || title.length > 200) throw badRequest('title braucht 3 bis 200 Zeichen.');
  const detail = input.detail === undefined ? prev?.detail ?? null : String(input.detail ?? '').trim().slice(0, 4000) || null;
  const status = String(input.status ?? prev?.status ?? 'open');
  if (!TASK_STATUS.includes(status)) throw badRequest(`status muss einer von ${TASK_STATUS.join(', ')} sein.`);
  const priority = Number(input.priority ?? prev?.priority ?? 2);
  if (![1, 2, 3].includes(priority)) throw badRequest('priority muss 1, 2 oder 3 sein.');
  return { agent, title, detail, status, priority };
}

export async function createTask(ctx: Ctx, input: any, user: User) {
  const v = cleanTask(input);
  const id = newId('tsk');
  const at = now();
  await ctx.db.run('INSERT INTO agent_tasks (id, project_id, agent, title, detail, status, priority, source, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    id, ctx.projectId, v.agent, v.title, v.detail, v.status, v.priority, input.source === 'goal' ? 'goal' : 'manual', user.id, at, user.id, at);
  await audit(ctx, user.id, 'agent_task.created', 'agent_task', id, { agent: v.agent });
  return taskDto((await ctx.db.get('SELECT * FROM agent_tasks WHERE id = ?', id))!);
}

export async function updateTask(ctx: Ctx, id: string, input: any, user: User) {
  const r = await ctx.db.get('SELECT * FROM agent_tasks WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Aufgabe ${id}`);
  const v = cleanTask(input, r);
  const doneAt = v.status === 'done' ? r.done_at ?? now() : null;
  await ctx.db.run('UPDATE agent_tasks SET agent = ?, title = ?, detail = ?, status = ?, priority = ?, done_at = ?, updated_by = ?, updated_at = ? WHERE id = ?',
    v.agent, v.title, v.detail, v.status, v.priority, doneAt, user.id, now(), id);
  await audit(ctx, user.id, 'agent_task.updated', 'agent_task', id, { status: v.status });
  return taskDto((await ctx.db.get('SELECT * FROM agent_tasks WHERE id = ?', id))!);
}

export async function deleteTask(ctx: Ctx, id: string, user: User) {
  const r = await ctx.db.get('SELECT * FROM agent_tasks WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Aufgabe ${id}`);
  if (r.source !== 'manual') throw conflict('Geplante Aufgaben werden nicht gelöscht – bitte auf „verworfen“ setzen.');
  await ctx.db.run('DELETE FROM agent_tasks WHERE id = ?', id);
  await audit(ctx, user.id, 'agent_task.deleted', 'agent_task', id, { title: r.title });
}

// ---------------------------------------------------------------- Entscheidungen

const decisionDto = (r: Row) => ({
  id: r.id, agent: r.agent, question: r.question, context: r.context ?? null, options: parseJson<string[]>(r.options, []), status: r.status, decision: r.decision ?? null, note: r.note ?? null,
  key: r.decision_key ?? null, executedAt: r.executed_at ?? null, createdBy: r.created_by, createdAt: r.created_at, decidedBy: r.decided_by ?? null, decidedAt: r.decided_at ?? null,
});

export async function listDecisions(ctx: Ctx, opts: { status?: string } = {}) {
  const rows = await ctx.db.all(`SELECT * FROM agent_decisions WHERE project_id = ? ${opts.status ? 'AND status = ?' : ''} ORDER BY CASE status WHEN 'open' THEN 0 ELSE 1 END, created_at DESC`,
    ...[ctx.projectId, ...(opts.status ? [opts.status] : [])]);
  return rows.map(decisionDto);
}

export async function createDecision(ctx: Ctx, input: any, user: User) {
  const agent = String(input.agent ?? 'orchestrator');
  if (!AGENT_CODES.includes(agent)) throw badRequest(`agent muss einer von ${AGENT_CODES.join(', ')} sein.`);
  const question = String(input.question ?? '').trim();
  if (question.length < 5 || question.length > 500) throw badRequest('question braucht 5 bis 500 Zeichen.');
  const options = Array.isArray(input.options) ? [...new Set(input.options.map((o: unknown) => String(o).trim()).filter(Boolean))].slice(0, 10) as string[] : [];
  const id = newId('dec');
  await ctx.db.run("INSERT INTO agent_decisions (id, project_id, agent, question, context, options, status, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?)",
    id, ctx.projectId, agent, question, String(input.context ?? '').trim().slice(0, 4000) || null, json(options), user.id, now());
  await audit(ctx, user.id, 'agent_decision.created', 'agent_decision', id, { agent });
  return decisionDto((await ctx.db.get('SELECT * FROM agent_decisions WHERE id = ?', id))!);
}

/** Entscheidung treffen (oder verwerfen) – nur ein Mensch; die Antwort steuert den nächsten Plan */
export async function decide(ctx: Ctx, id: string, input: any, user: User) {
  const r = await ctx.db.get('SELECT * FROM agent_decisions WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`Entscheidung ${id}`);
  if (r.status !== 'open') throw conflict('Die Entscheidung ist schon getroffen.');
  if (input.drop === true) {
    await ctx.db.run("UPDATE agent_decisions SET status = 'dropped', note = ?, decided_by = ?, decided_at = ? WHERE id = ?", String(input.note ?? '').trim() || null, user.id, now(), id);
  } else {
    const decision = String(input.decision ?? '').trim();
    if (!decision) throw badRequest('decision ist Pflicht.');
    const options = parseJson<string[]>(r.options, []);
    if (options.length && !options.includes(decision) && input.free !== true) throw badRequest(`decision muss eine der Möglichkeiten sein: ${options.join(' | ')} (oder free: true).`);
    await ctx.db.run("UPDATE agent_decisions SET status = 'decided', decision = ?, note = ?, decided_by = ?, decided_at = ? WHERE id = ?", decision, String(input.note ?? '').trim() || null, user.id, now(), id);
  }
  await audit(ctx, user.id, 'agent_decision.decided', 'agent_decision', id, { decision: input.decision ?? null, dropped: input.drop === true });
  return decisionDto((await ctx.db.get('SELECT * FROM agent_decisions WHERE id = ?', id))!);
}

// ---------------------------------------------------------------- GOAL: Ziel und Abgleich

export interface Criterion { code: string; title: string; target: number; direction: 'min' | 'max'; agent: string; recommendation: string; unit: 'share' | 'count' }
export const CRITERIA: Criterion[] = [
  { code: 'required_labels', title: 'Chunks mit allen Pflichtlabels', target: 0.95, direction: 'min', agent: 'triage', unit: 'share', recommendation: 'TRIAGE für Chunks ohne Pflichtlabels starten (oneSCM_Metadaten › Triage, „ohne Pflichtlabels“).' },
  { code: 'review_open', title: 'Chunks „zu prüfen“', target: 0.05, direction: 'max', agent: 'triage', unit: 'share', recommendation: 'Chunks „zu prüfen“ sichten: Labels bestätigen oder korrigieren (Chunks › Filter „zu prüfen“).' },
  { code: 'placed', title: 'Chunks in Kapiteln der Gliederung', target: 0.95, direction: 'min', agent: 'triage', unit: 'share', recommendation: 'Vorschläge der Triage übernehmen oder Kapitel/Unterkapitel in der Kapitelsteuerung ergänzen.' },
  { code: 'new_confirmed', title: 'Unterkapitel „neu“ unbestätigt', target: 0, direction: 'max', agent: 'gliederungs-pfleger', unit: 'count', recommendation: 'Neue Unterkapitel der Triage in der Kapitelsteuerung bestätigen, umbenennen oder ablösen.' },
  { code: 'happy_edge', title: 'Kapitel mit Standardablauf (HappyPath) und Ausnahmen (Edge)', target: 0.8, direction: 'min', agent: 'kapitel-redakteur', unit: 'share', recommendation: 'Fehlende HappyPath- bzw. Edge-Inhalte je Kapitel ergänzen (Quellen, Expertenbefragung).' },
  { code: 'instructions', title: 'Kapitel mit Kapitelanweisung', target: 0.8, direction: 'min', agent: 'steuerung', unit: 'share', recommendation: 'Kapitelanweisungen in der Kapitelsteuerung ergänzen.' },
  { code: 'approved', title: 'Kapitel mit freigegebener Fassung', target: 0.8, direction: 'min', agent: 'pruefer', unit: 'share', recommendation: 'Kapitel generieren, prüfen (Anleitungs-Check) und freigeben.' },
  { code: 'answer_quality', title: 'Antwortqualität: bestandene Testfragen (letzter Prüflauf)', target: 0.8, direction: 'min', agent: 'goal', unit: 'share', recommendation: 'Testfragensatz anlegen bzw. Prüflauf starten (Antwortqualität) und Lücken schließen.' },
  { code: 'pipeline_ready', title: 'Produktive Pipeline-Einträge nicht übernommen', target: 0, direction: 'max', agent: 'pipeline-redakteur', unit: 'count', recommendation: 'Produktive Pipeline-Einträge ins Handbuch übernehmen.' },
  { code: 'open_decisions', title: 'Offene Entscheidungen', target: 0, direction: 'max', agent: 'orchestrator', unit: 'count', recommendation: 'Offene Entscheidungen der Agenten treffen.' },
];
export const DEFAULT_GOAL = 'Ein vollständiges, belegtes und freigegebenes oneSCM-Handbuch: jeder Inhalt trägt die Pflichtlabels und steht im richtigen Kapitel, jedes Kapitel zeigt Standardablauf und Ausnahmen, Fragen an alle Quellen werden belegt beantwortet – Daten bleiben lokal.';

export async function getGoal(ctx: Ctx) {
  const r = await ctx.db.get('SELECT * FROM agent_goals WHERE project_id = ?', ctx.projectId);
  const saved = parseJson<{ code: string; target?: number; enabled?: boolean }[]>(r?.criteria, []);
  const criteria = CRITERIA.map((c) => {
    const s = saved.find((x) => x.code === c.code);
    return { ...c, target: s?.target ?? c.target, enabled: s?.enabled ?? true };
  });
  const last = await ctx.db.get('SELECT * FROM goal_runs WHERE project_id = ? ORDER BY created_at DESC LIMIT 1', ctx.projectId);
  return { goal: r?.goal ?? DEFAULT_GOAL, criteria, updatedBy: r?.updated_by ?? null, updatedAt: r?.updated_at ?? null, lastRun: last ? runDto(last) : null };
}

export async function updateGoal(ctx: Ctx, input: any, user: User) {
  const current = await getGoal(ctx);
  const goal = input.goal === undefined ? current.goal : String(input.goal ?? '').trim();
  if (goal.length < 10 || goal.length > 4000) throw badRequest('goal braucht 10 bis 4000 Zeichen.');
  let criteria = current.criteria.map((c) => ({ code: c.code, target: c.target, enabled: c.enabled }));
  if (input.criteria !== undefined) {
    if (!Array.isArray(input.criteria)) throw badRequest('criteria muss eine Liste sein.');
    for (const x of input.criteria) {
      const c = criteria.find((k) => k.code === x?.code);
      if (!c) throw badRequest(`Unbekanntes Kriterium ${x?.code}.`);
      if (x.target !== undefined) {
        const t = Number(x.target);
        if (!Number.isFinite(t) || t < 0 || t > 100000) throw badRequest(`target für ${c.code} ist keine gültige Zahl.`);
        c.target = t;
      }
      if (x.enabled !== undefined) c.enabled = x.enabled === true;
    }
  }
  await ctx.db.run(
    `INSERT INTO agent_goals (project_id, goal, criteria, updated_by, updated_at) VALUES (?, ?, ?, ?, ?)
     ON CONFLICT (project_id) DO UPDATE SET goal = excluded.goal, criteria = excluded.criteria, updated_by = excluded.updated_by, updated_at = excluded.updated_at`,
    ctx.projectId, goal, json(criteria), user.id, now(),
  );
  await audit(ctx, user.id, 'agent_goal.updated', 'project', ctx.projectId, {});
  return getGoal(ctx);
}

const runDto = (r: Row) => ({ id: r.id, results: parseJson<any[]>(r.results, []), score: Number(r.score), createdBy: r.created_by, createdAt: r.created_at });

/** Messwerte des Stands für die Kriterien */
async function measure(ctx: Ctx) {
  const n = async (sql: string, ...p: unknown[]) => Number((await ctx.db.get(sql, ...p))?.n ?? 0);
  const dash = await contentDashboard(ctx);
  const total = dash.totals.chunks;
  const share = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 1000 : 0);
  const chapters = await ctx.db.all("SELECT id, title, instruction, key FROM chapters WHERE project_id = ? AND outline_family_id IS NULL AND history_at IS NULL AND key NOT IN ('__none__', 'jira-tickets', 'wissensnotizen')", ctx.projectId);
  const withChunks = dash.chapters.filter((c) => c.chunks > 0 && chapters.some((x) => x.id === c.chapterId));
  const happyEdge = withChunks.filter((c) => (c.detail['happy-path'] ?? 0) > 0 && (c.detail.edge ?? 0) > 0).length;
  // Anteil unter den Kapiteln mit Chunks (Nenner) – abgelöste oder leere Kapitel zählen nicht mit (sonst über 100 %)
  const approvedIds = new Set((await ctx.db.all("SELECT DISTINCT v.chapter_id FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? AND v.status = 'approved'", ctx.projectId)).map((r) => r.chapter_id as string));
  const approved = withChunks.filter((c) => approvedIds.has(c.chapterId)).length;
  const collectorChunks = dash.chapters.filter((c) => !chapters.some((x) => x.id === c.chapterId)).reduce((s, c) => s + c.chunks, 0);
  const lastEval = await ctx.db.get('SELECT r.metrics FROM metadata_eval_runs r WHERE r.project_id = ? ORDER BY r.created_at DESC LIMIT 1', ctx.projectId);
  return {
    dash, withChunks, chapters,
    values: {
      required_labels: share(dash.totals.complete, total),
      review_open: share(dash.totals.review, total),
      placed: share(total - collectorChunks, total),
      new_confirmed: (await newSubchapters(ctx)).length,
      happy_edge: share(happyEdge, withChunks.length),
      instructions: share(chapters.filter((c) => c.instruction).length, chapters.length),
      approved: share(approved, withChunks.length),
      answer_quality: lastEval ? Number(parseJson<any>(lastEval.metrics, {}).passRate ?? 0) : null,
      pipeline_ready: await n("SELECT COUNT(*) AS n FROM work_items WHERE project_id = ? AND state = 'ready'", ctx.projectId),
      open_decisions: await n("SELECT COUNT(*) AS n FROM agent_decisions WHERE project_id = ? AND status = 'open'", ctx.projectId),
    } as Record<string, number | null>,
  };
}

/** GOAL: Stand aller Funktionen gegen das Ziel – erfüllt/nicht erfüllt je Kriterium mit Empfehlung und zuständigem Agenten */
export async function runGoal(ctx: Ctx, user: User) {
  const g = await getGoal(ctx);
  const { values } = await measure(ctx);
  const results = g.criteria.filter((c) => c.enabled).map((c) => {
    const value = values[c.code];
    const ok = value !== null && value !== undefined && (c.direction === 'min' ? value >= c.target : value <= c.target);
    return { code: c.code, title: c.title, value, target: c.target, direction: c.direction, unit: c.unit, ok, agent: c.agent, recommendation: ok ? null : value === null ? 'Noch kein Messwert – ' + c.recommendation : c.recommendation };
  });
  const score = results.length ? Math.round((results.filter((r) => r.ok).length / results.length) * 1000) / 1000 : 0;
  const id = newId('gol');
  await ctx.db.run('INSERT INTO goal_runs (id, project_id, results, score, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?)', id, ctx.projectId, json(results), score, user.id, now());
  // Empfehlungen werden Aufgaben des zuständigen Agenten (Schlüssel goal:<Kriterium>); erfüllte Kriterien schließen ihre Aufgabe
  const at = now();
  let tasks = 0;
  for (const r of results) {
    const key = `goal:${r.code}`;
    const have = await ctx.db.get('SELECT id, status FROM agent_tasks WHERE project_id = ? AND task_key = ?', ctx.projectId, key);
    if (!r.ok) {
      const title = `${r.title}: Ist ${r.value === null ? '–' : r.unit === 'share' ? `${Math.round(r.value * 100)} %` : r.value}, Soll ${r.direction === 'min' ? '≥' : '≤'} ${r.unit === 'share' ? `${Math.round(r.target * 100)} %` : r.target}`;
      if (!have) {
        await ctx.db.run("INSERT INTO agent_tasks (id, project_id, agent, title, detail, status, priority, source, task_key, link, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, 'open', 2, 'goal', ?, '/agenten/goal', ?, ?, ?, ?)",
          newId('tsk'), ctx.projectId, r.agent, title, r.recommendation, key, user.id, at, user.id, at);
        tasks++;
      } else if (have.status !== 'dropped') {
        await ctx.db.run("UPDATE agent_tasks SET title = ?, detail = ?, status = CASE WHEN status = 'done' THEN 'open' ELSE status END, done_at = NULL, updated_by = ?, updated_at = ? WHERE id = ?", title, r.recommendation, user.id, at, have.id);
      }
    } else if (have && ['open', 'in_progress'].includes(have.status)) {
      await ctx.db.run("UPDATE agent_tasks SET status = 'done', done_at = ?, updated_by = ?, updated_at = ? WHERE id = ?", at, user.id, at, have.id);
    }
  }
  await audit(ctx, user.id, 'agent_goal.run', 'goal_run', id, { score, tasks });
  return runDto((await ctx.db.get('SELECT * FROM goal_runs WHERE id = ?', id))!);
}

// ---------------------------------------------------------------- ORCHESTRATOR: planen und verfeinern

interface PlanStep { key: string; agent: string; title: string; detail: string; priority: number; link: string | null; decision?: { question: string; options: string[]; context: string } }

/**
 * Plan aus dem Stand: Aufgaben je Agent mit Schlüssel (keine Doppelungen), Entscheidungen bei Unklarem. Beim erneuten Planen
 * werden offene Aufgaben aktualisiert, nicht mehr nötige geplante Aufgaben geschlossen („erledigt laut Stand“), verworfene
 * bleiben verworfen. Reihenfolge: Triage → Prüfen → Gliederung → Schreiben → Freigeben → Pipeline → Qualität → Ziel.
 */
export async function orchestrate(ctx: Ctx, user: User) {
  const executed = await executeDecisions(ctx, user);
  const { dash, withChunks, values } = await measure(ctx);
  const total = dash.totals.chunks;
  const steps: PlanStep[] = [];
  const missing = total - dash.totals.complete;
  if (missing > 0) steps.push({ key: 'triage:missing', agent: 'triage', priority: 1, link: '/metadaten/triage', title: `TRIAGE für ${missing} Chunks ohne vollständige Pflichtlabels`, detail: `Pflichtgruppen: ${REQUIRED_GROUPS.join(', ')}. Lauf „ohne Pflichtlabels“ starten.` });
  if (dash.openProposals > 0) {
    steps.push({ key: 'triage:proposals', agent: 'triage', priority: 1, link: '/metadaten/triage', title: `${dash.openProposals} Zuordnungsvorschläge der Triage entscheiden`, detail: 'Verschieben in Kapitel/Unterkapitel bzw. neue Unterkapitel „neu“ übernehmen oder verwerfen.',
      decision: { question: `${dash.openProposals} Vorschläge der Triage (Kapitel, Unterkapitel, neue Unterkapitel „neu“) übernehmen?`, options: ['alle übernehmen', 'einzeln prüfen', 'verwerfen'], context: 'oneSCM_Metadaten › Triage' } });
  }
  if (dash.totals.review > 0) steps.push({ key: 'triage:review', agent: 'pruefer', priority: 2, link: '/metadaten/triage', title: `${dash.totals.review} Chunks „zu prüfen“ sichten`, detail: 'Unsichere Labels bestätigen oder korrigieren; danach Label „geprüft“.' });
  if ((values.new_confirmed ?? 0) > 0) steps.push({ key: 'structure:new', agent: 'gliederungs-pfleger', priority: 2, link: '/kapitelsteuerung', title: `${values.new_confirmed} Unterkapitel „neu“ bestätigen`, detail: 'Von der Triage angelegt: bestätigen, umbenennen oder ablösen.',
    decision: { question: `${values.new_confirmed} neue Unterkapitel der Triage in die Gliederung aufnehmen?`, options: ['aufnehmen', 'einzeln prüfen', 'nicht aufnehmen'], context: 'Kapitelsteuerung – Kennung „neu“' } });
  // erst die Kapitel mit Lücken, dann begrenzen – sonst bekämen Kapitel ab Position 50 nie eine Aufgabe
  const lacking = withChunks.filter((c) => !((c.detail['happy-path'] ?? 0) > 0) || !((c.detail.edge ?? 0) > 0));
  for (const c of lacking.slice(0, 50)) {
    const happy = (c.detail['happy-path'] ?? 0) > 0;
    const edge = (c.detail.edge ?? 0) > 0;
    steps.push({ key: `chapter:detail:${c.chapterId}`, agent: 'kapitel-redakteur', priority: 3, link: `/werkstatt/${c.chapterId}`, title: `${c.title}: ${!happy && !edge ? 'Standardablauf und Ausnahmen' : !happy ? 'Standardablauf (HappyPath)' : 'Ausnahmen (Edge)'} fehlen`, detail: 'Quellen ergänzen oder Expertenbefragung anlegen.' });
  }
  const unapproved = await ctx.db.all(
    `SELECT c.id, c.title FROM chapters c WHERE c.project_id = ? AND c.outline_family_id IS NULL AND c.history_at IS NULL AND c.key NOT IN ('__none__', 'jira-tickets', 'wissensnotizen')
       AND EXISTS (SELECT 1 FROM text_snippets s WHERE s.chapter_id = c.id AND s.evidence_status IN ('source_confirmed', 'manually_confirmed'))
       AND NOT EXISTS (SELECT 1 FROM generated_chapter_versions v WHERE v.chapter_id = c.id AND v.status = 'approved') ORDER BY c.position LIMIT 20`, ctx.projectId,
  );
  for (const c of unapproved) steps.push({ key: `chapter:approve:${c.id}`, agent: 'kapitel-redakteur', priority: 2, link: `/werkstatt/${c.id}`, title: `${c.title}: generieren, prüfen, freigeben`, detail: 'Kapitelgenerator → Werkstatt → Anleitungs-Check → Freigabe (Mensch).' });
  if ((values.pipeline_ready ?? 0) > 0) steps.push({ key: 'pipeline:ready', agent: 'pipeline-redakteur', priority: 1, link: '/pipeline', title: `${values.pipeline_ready} produktive Pipeline-Einträge übernehmen`, detail: 'Produktiv laut Jira und Produktionsdatum – Mensch bestätigt.' });
  if (values.answer_quality === null || (values.answer_quality ?? 0) < 0.8) steps.push({ key: 'quality:eval', agent: 'goal', priority: 2, link: '/metadaten/qualitaet', title: values.answer_quality === null ? 'Antwortqualität messen: Testfragensatz anlegen und Prüflauf starten' : `Antwortqualität verbessern (${Math.round((values.answer_quality ?? 0) * 100)} % bestanden)`, detail: 'Prüflauf (Verfahren v2), nicht bestandene Fragen prüfen.' });
  const lastGoal = await ctx.db.get('SELECT created_at FROM goal_runs WHERE project_id = ? ORDER BY created_at DESC LIMIT 1', ctx.projectId);
  if (!lastGoal || Date.now() - Date.parse(lastGoal.created_at) > 24 * 3600 * 1000) steps.push({ key: 'goal:run', agent: 'goal', priority: 3, link: '/agenten/goal', title: 'Ziel-Abgleich (GOAL) ausführen', detail: 'Stand aller Funktionen gegen das Ziel prüfen, Empfehlungen übernehmen.' });

  const at = now();
  const stats = { created: 0, updated: 0, reopened: 0, closed: 0, decisions: 0 };
  const keys = new Set(steps.map((s) => s.key));
  await ctx.db.tx(async () => {
    for (const s of steps) {
      const r = await ctx.db.get('SELECT * FROM agent_tasks WHERE project_id = ? AND task_key = ?', ctx.projectId, s.key);
      if (!r) {
        await ctx.db.run("INSERT INTO agent_tasks (id, project_id, agent, title, detail, status, priority, source, task_key, link, created_by, created_at, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, 'open', ?, 'orchestrator', ?, ?, ?, ?, ?, ?)",
          newId('tsk'), ctx.projectId, s.agent, s.title, s.detail, s.priority, s.key, s.link, user.id, at, user.id, at);
        stats.created++;
      } else if (r.status === 'done') {
        // Bedingung ist wieder da: neu öffnen
        await ctx.db.run("UPDATE agent_tasks SET status = 'open', title = ?, detail = ?, priority = ?, done_at = NULL, updated_by = ?, updated_at = ? WHERE id = ?", s.title, s.detail, s.priority, user.id, at, r.id);
        stats.reopened++;
      } else if (r.status !== 'dropped' && (r.title !== s.title || Number(r.priority) !== s.priority)) {
        await ctx.db.run('UPDATE agent_tasks SET title = ?, detail = ?, priority = ?, updated_by = ?, updated_at = ? WHERE id = ?', s.title, s.detail, s.priority, user.id, at, r.id);
        stats.updated++;
      }
      if (s.decision && !(await ctx.db.get("SELECT 1 FROM agent_decisions WHERE project_id = ? AND decision_key = ? AND status = 'open'", ctx.projectId, s.key))) {
        await ctx.db.run("INSERT INTO agent_decisions (id, project_id, agent, question, context, options, status, decision_key, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?, ?)",
          newId('dec'), ctx.projectId, s.agent, s.decision.question, s.decision.context, json(s.decision.options), s.key, user.id, at);
        stats.decisions++;
      }
    }
    // verfeinern: geplante Aufgaben, deren Bedingung entfallen ist, schließen
    for (const r of await ctx.db.all("SELECT id, task_key FROM agent_tasks WHERE project_id = ? AND source = 'orchestrator' AND status IN ('open', 'in_progress')", ctx.projectId)) {
      if (!keys.has(r.task_key)) {
        await ctx.db.run("UPDATE agent_tasks SET status = 'done', done_at = ?, detail = COALESCE(detail, '') || ' (erledigt laut Stand)', updated_by = ?, updated_at = ? WHERE id = ?", at, user.id, at, r.id);
        stats.closed++;
      }
    }
    await audit(ctx, user.id, 'orchestrator.planned', 'project', ctx.projectId, { steps: steps.length, ...stats });
  });
  const order = (s: PlanStep) => ['triage', 'pruefer', 'gliederungs-pfleger', 'kapitel-redakteur', 'pipeline-redakteur', 'goal'].indexOf(s.agent);
  return {
    plannedAt: at, created: stats.created, updated: stats.updated, reopened: stats.reopened, closed: stats.closed, decisionsCreated: stats.decisions, executed,
    plan: [...steps].sort((a, b) => a.priority - b.priority || order(a) - order(b)).map((s, i) => ({ step: i + 1, key: s.key, agent: s.agent, title: s.title, detail: s.detail, priority: s.priority, link: s.link, decision: !!s.decision })),
    tasks: await listTasks(ctx, { status: 'active' }), decisions: await listDecisions(ctx, { status: 'open' }),
  };
}

/**
 * Getroffene Entscheidungen ausführen, die der Orchestrator selbst umsetzen kann (einmalig, mit Vermerk):
 * Triage-Vorschläge übernehmen bzw. verwerfen, neue Unterkapitel aufnehmen. „einzeln prüfen“ bleibt bei der Redaktion.
 */
async function executeDecisions(ctx: Ctx, user: User) {
  const { acceptAll, confirmNewSubchapter, newSubchapters: listNew } = await import('./triage.js');
  const done: { decisionId: string; key: string; decision: string; result: string }[] = [];
  for (const d of await ctx.db.all("SELECT * FROM agent_decisions WHERE project_id = ? AND status = 'decided' AND executed_at IS NULL AND decision_key IS NOT NULL", ctx.projectId)) {
    let result = 'keine Aktion (Redaktion entscheidet einzeln)';
    // nur Vorschläge, die es bei der Entscheidung schon gab – spätere (neuer Import) prüft die Redaktion bzw. die nächste Frage
    const asOf = String(d.decided_at ?? now());
    if (d.decision_key === 'triage:proposals' && d.decision === 'alle übernehmen') result = `${(await acceptAll(ctx, { createdUpTo: asOf }, user)).accepted} Vorschläge übernommen`;
    else if (d.decision_key === 'triage:proposals' && d.decision === 'verwerfen') {
      const n = Number((await ctx.db.get("SELECT COUNT(*) AS n FROM triage_results WHERE project_id = ? AND status = 'proposed' AND created_at <= ?", ctx.projectId, asOf))?.n ?? 0);
      await ctx.db.run("UPDATE triage_results SET status = 'rejected', decided_by = ?, decided_at = ? WHERE project_id = ? AND status = 'proposed' AND created_at <= ?", user.id, now(), ctx.projectId, asOf);
      result = `${n} Vorschläge verworfen`;
    } else if (d.decision_key === 'structure:new' && d.decision === 'aufnehmen') {
      const subs = await listNew(ctx);
      for (const s of subs) await confirmNewSubchapter(ctx, s.id, user);
      result = `${subs.length} Unterkapitel aufgenommen`;
    }
    await ctx.db.run('UPDATE agent_decisions SET executed_at = ?, note = COALESCE(note, ?) WHERE id = ?', now(), result, d.id);
    await audit(ctx, user.id, 'orchestrator.executed', 'agent_decision', d.id, { key: d.decision_key, decision: d.decision, result });
    done.push({ decisionId: d.id, key: d.decision_key, decision: d.decision, result });
  }
  return done;
}

/** Übersicht für die Agenten-Seite: je Agent offene Aufgaben und Entscheidungen */
export async function agentsOverview(ctx: Ctx) {
  const tasks = await listTasks(ctx, { status: 'active' });
  const decisions = await listDecisions(ctx, { status: 'open' });
  return AGENTS.map((a) => ({ ...a, openTasks: tasks.filter((t) => t.agent === a.code).length, openDecisions: decisions.filter((d) => d.agent === a.code).length }));
}

/** Für den Arbeitsordner: Aufgaben, Entscheidungen und Ziel-Abgleich als Markdown (abgleich --app) */
export async function exportAgents(ctx: Ctx) {
  const tasks = await listTasks(ctx);
  const decisions = await listDecisions(ctx);
  const goal = await getGoal(ctx);
  const pct = (v: number | null, unit: string) => (v === null ? '–' : unit === 'share' ? `${Math.round(v * 100)} %` : String(v));
  const statusDe: Record<string, string> = { open: 'offen', in_progress: 'in Arbeit', done: 'erledigt', dropped: 'verworfen' };
  const tasksMd = ['# Aufgaben der Agenten (aus der App)', '', '> Gepflegt in der App unter „Agenten“; der Orchestrator plant und verfeinert. Diese Datei wird beim Abgleich aktualisiert.', '',
    '| Agent | Aufgabe | Priorität | Status | Herkunft | geändert |', '|---|---|---|---|---|---|',
    ...tasks.map((t) => `| ${t.agent} | ${t.title.replace(/\|/g, '\\|')} | ${t.priority} | ${statusDe[t.status] ?? t.status} | ${t.source} | ${t.updatedAt.slice(0, 10)} |`), ''].join('\n');
  const decMd = ['# Entscheidungen der Agenten (aus der App)', '', '> Entscheidungen trifft ein Mensch – in der App unter „Agenten › Entscheidungen“.', '',
    '| Agent | Frage | Möglichkeiten | Status | Entscheidung | von, am |', '|---|---|---|---|---|---|',
    ...decisions.map((d) => `| ${d.agent} | ${d.question.replace(/\|/g, '\\|')} | ${d.options.join(' / ')} | ${d.status === 'open' ? 'offen' : d.status === 'decided' ? 'entschieden' : 'verworfen'} | ${d.decision ?? '–'} | ${d.decidedBy ? `${d.decidedBy}, ${d.decidedAt?.slice(0, 10)}` : '–'} |`), ''].join('\n');
  const run = goal.lastRun;
  const goalMd = ['# Ziel-Abgleich (GOAL, aus der App)', '', `**Ziel:** ${goal.goal}`, '', run ? `Stand: ${run.createdAt.slice(0, 10)} – ${Math.round(run.score * 100)} % der Kriterien erfüllt.` : 'Noch kein Abgleich in der App.', '',
    '| Kriterium | Ist | Soll | erfüllt | Empfehlung | Agent |', '|---|---|---|---|---|---|',
    ...(run?.results ?? []).map((r: any) => `| ${r.title} | ${pct(r.value, r.unit)} | ${r.direction === 'min' ? '≥' : '≤'} ${pct(r.target, r.unit)} | ${r.ok ? 'ja' : 'nein'} | ${r.recommendation ?? '–'} | ${r.agent} |`), ''].join('\n');
  return { format: 'onescm-agents', version: 1, exportedAt: now(), files: { tasks: tasksMd, decisions: decMd, goal: goalMd } };
}
