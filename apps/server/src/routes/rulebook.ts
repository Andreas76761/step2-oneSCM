// Regelwerk sowie Kapitel „Intern“ und „In Planung“ (Etappe 100)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { listParked, parkBlock, parkSnippet, unparkSnippet } from '../services/parking.js';
import { createRule, deleteRule, listRules, updateRule } from '../services/rulebook.js';
import { userOf } from './helpers.js';

export function rulebookRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/rulebook/rules', async (req) => (userOf(req.ctx, req), listRules(req.ctx)));
  app.post<{ Body: any }>('/rulebook/rules', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createRule(req.ctx, req.body ?? {}, user);
  });
  app.patch<{ Params: { id: string }; Body: any }>('/rulebook/rules/:id', async (req) => updateRule(req.ctx, req.params.id, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<{ Params: { id: string } }>('/rulebook/rules/:id', async (req, reply) => {
    await deleteRule(req.ctx, req.params.id, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });

  app.get<{ Querystring: { target?: string } }>('/parked', async (req) => (userOf(req.ctx, req), listParked(req.ctx, req.query.target)));
  app.post<{ Params: { snippetId: string }; Body: any }>('/snippets/:snippetId/park', async (req) => parkSnippet(req.ctx, req.params.snippetId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<{ Params: { snippetId: string } }>('/snippets/:snippetId/park', async (req) => unparkSnippet(req.ctx, req.params.snippetId, userOf(req.ctx, req, 'edit')));
  app.post<{ Params: { blockId: string }; Body: any }>('/content-blocks/:blockId/park', async (req) => parkBlock(req.ctx, req.params.blockId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
}
