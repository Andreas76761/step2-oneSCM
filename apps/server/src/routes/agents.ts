// Agenten in der App (ADR-100): TRIAGE, Dashboard, Aufgaben, Entscheidungen, GOAL, ORCHESTRATOR
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import {
  agentsOverview, createDecision, createTask, decide, deleteTask, exportAgents, getGoal, listDecisions, listTasks, orchestrate, runGoal, updateGoal, updateTask,
} from '../services/agents.js';
import { acceptAll, confirmNewSubchapter, contentDashboard, decideResult, getRun, listResults, listRuns, newSubchapters, runTriage } from '../services/triage.js';
import { userOf } from './helpers.js';

export function agentRoutes(app: FastifyInstance, _ctx: Ctx) {
  // TRIAGE
  app.post<{ Body: any }>('/triage/runs', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return runTriage(req.ctx, { scope: (req.body as any)?.scope }, user.id);
  });
  app.get('/triage/runs', async (req) => (userOf(req.ctx, req), { items: await listRuns(req.ctx) }));
  app.get<{ Params: { id: string } }>('/triage/runs/:id', async (req) => (userOf(req.ctx, req), getRun(req.ctx, req.params.id)));
  app.get<{ Querystring: { runId?: string; status?: string; review?: string; placement?: string; limit?: string } }>('/triage/results', async (req) => {
    userOf(req.ctx, req);
    const q = req.query;
    return { items: await listResults(req.ctx, { runId: q.runId || undefined, status: q.status || undefined, review: q.review === 'true', placement: q.placement || undefined, limit: q.limit ? Number(q.limit) : undefined }) };
  });
  app.post<{ Params: { id: string }; Body: any }>('/triage/results/:id/decision', async (req) => decideResult(req.ctx, req.params.id, (req.body as any)?.decision, userOf(req.ctx, req, 'edit')));
  app.post<{ Body: any }>('/triage/accept-all', async (req) => acceptAll(req.ctx, (req.body ?? {}) as any, userOf(req.ctx, req, 'edit')));
  app.get('/triage/new-subchapters', async (req) => (userOf(req.ctx, req), { items: await newSubchapters(req.ctx) }));
  app.post<{ Params: { id: string } }>('/triage/new-subchapters/:id/confirm', async (req) => confirmNewSubchapter(req.ctx, req.params.id, userOf(req.ctx, req, 'edit')));
  app.get('/triage/dashboard', async (req) => (userOf(req.ctx, req), contentDashboard(req.ctx)));

  // Agenten, Aufgaben, Entscheidungen
  app.get('/agents', async (req) => (userOf(req.ctx, req), { items: await agentsOverview(req.ctx) }));
  app.get('/agents/export', async (req) => (userOf(req.ctx, req), exportAgents(req.ctx)));
  app.get<{ Querystring: { agent?: string; status?: string } }>('/agents/tasks', async (req) => (userOf(req.ctx, req), { items: await listTasks(req.ctx, req.query) }));
  app.post<{ Body: any }>('/agents/tasks', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createTask(req.ctx, req.body ?? {}, user);
  });
  app.patch<{ Params: { id: string }; Body: any }>('/agents/tasks/:id', async (req) => updateTask(req.ctx, req.params.id, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<{ Params: { id: string } }>('/agents/tasks/:id', async (req, reply) => {
    await deleteTask(req.ctx, req.params.id, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });
  app.get<{ Querystring: { status?: string } }>('/agents/decisions', async (req) => (userOf(req.ctx, req), { items: await listDecisions(req.ctx, req.query) }));
  app.post<{ Body: any }>('/agents/decisions', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createDecision(req.ctx, req.body ?? {}, user);
  });
  // Entscheidungen trifft ein Mensch mit dem Recht „Entscheiden“
  app.post<{ Params: { id: string }; Body: any }>('/agents/decisions/:id/decide', async (req) => decide(req.ctx, req.params.id, req.body ?? {}, userOf(req.ctx, req, 'decide')));
  // ORCHESTRATOR und GOAL
  app.post('/agents/orchestrator/plan', async (req) => orchestrate(req.ctx, userOf(req.ctx, req, 'edit')));
  app.get('/agents/goal', async (req) => (userOf(req.ctx, req), getGoal(req.ctx)));
  app.put<{ Body: any }>('/agents/goal', async (req) => updateGoal(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.post('/agents/goal/runs', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return runGoal(req.ctx, user);
  });
}
