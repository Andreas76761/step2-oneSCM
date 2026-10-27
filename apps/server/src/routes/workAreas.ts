// Arbeitsbereiche Pipeline, Backlog und Intern (ADR-098)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { createWorkItem, deleteWorkItem, exportWorkAreas, getWorkItem, goLive, listWorkItems, syncFromJira, updateWorkItem } from '../services/workAreas.js';
import { userOf } from './helpers.js';

export function workAreaRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<{ Querystring: { area?: string; topic?: string; chapterId?: string } }>('/work-areas', async (req) => (userOf(req.ctx, req), listWorkItems(req.ctx, req.query)));
  // für den Arbeitsordner (abgleich --app): 09_Pipeline, 10_Backlog, 11_Intern
  app.get('/work-areas/export', async (req) => (userOf(req.ctx, req), exportWorkAreas(req.ctx)));
  app.post<{ Body: any }>('/work-areas', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createWorkItem(req.ctx, req.body ?? {}, user);
  });
  app.post('/work-areas/sync-jira', async (req) => syncFromJira(req.ctx, userOf(req.ctx, req, 'edit')));
  app.get<{ Params: { id: string } }>('/work-areas/:id', async (req) => (userOf(req.ctx, req), getWorkItem(req.ctx, req.params.id)));
  app.patch<{ Params: { id: string }; Body: any }>('/work-areas/:id', async (req) => updateWorkItem(req.ctx, req.params.id, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<{ Params: { id: string } }>('/work-areas/:id', async (req, reply) => {
    await deleteWorkItem(req.ctx, req.params.id, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });
  // produktiv: Vorab-Dokumentation als Quelle des Kapitels einlesen
  app.post<{ Params: { id: string } }>('/work-areas/:id/go-live', async (req) => goLive(req.ctx, req.params.id, userOf(req.ctx, req, 'edit')));
}
