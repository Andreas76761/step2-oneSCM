// Textbausteine (ADR-107, W-11, Single Sourcing)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { createTextModule, getTextModule, insertTextModule, listTextModules, propagateTextModule, textModuleCandidates, updateTextModule } from '../services/textModules.js';
import { userOf } from './helpers.js';

type Id = { Params: { id: string } };

export function textModuleRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<{ Querystring: { status?: string; q?: string } }>('/text-modules', async (req) => (userOf(req.ctx, req), listTextModules(req.ctx, req.query)));
  app.get('/text-modules/candidates', async (req) => (userOf(req.ctx, req), textModuleCandidates(req.ctx)));
  app.post<{ Body: any }>('/text-modules', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createTextModule(req.ctx, (req.body ?? {}) as Record<string, unknown>, user);
  });
  app.get<Id>('/text-modules/:id', async (req) => (userOf(req.ctx, req), getTextModule(req.ctx, req.params.id)));
  app.patch<Id & { Body: any }>('/text-modules/:id', async (req) => updateTextModule(req.ctx, req.params.id, (req.body ?? {}) as Record<string, unknown>, userOf(req.ctx, req, 'edit')));
  app.post<Id & { Body: any }>('/text-modules/:id/insert', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return insertTextModule(req.ctx, req.params.id, (req.body ?? {}) as Record<string, unknown>, user);
  });
  app.post<Id & { Body: any }>('/text-modules/:id/propagate', async (req) => propagateTextModule(req.ctx, req.params.id, req.body ?? {}, userOf(req.ctx, req, 'edit')));
}
