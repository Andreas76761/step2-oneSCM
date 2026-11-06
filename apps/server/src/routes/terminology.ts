// Terminologieverwaltung (US-015)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { createTerm, listTerms, termCandidates, updateTerm } from '../services/terminology.js';
import { userOf } from './helpers.js';

export function terminologyRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<{ Querystring: { includeRetired?: string } }>('/terminology', async (req) => (userOf(req.ctx, req), listTerms(req.ctx, { includeRetired: req.query.includeRetired === 'true' })));
  // Begriffskandidaten aus Jira-Tickets (F-12, ADR-083)
  app.get<{ Querystring: { minTickets?: string } }>('/terminology/candidates', async (req) => (userOf(req.ctx, req), termCandidates(req.ctx, { minTickets: req.query.minTickets ? Number(req.query.minTickets) : undefined })));
  app.post<{ Body: any }>('/terminology', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createTerm(req.ctx, (req.body ?? {}) as any, user.id);
  });
  app.patch<{ Params: { termId: string }; Body: any }>('/terminology/:termId', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return updateTerm(req.ctx, req.params.termId, (req.body ?? {}) as any, user.id);
  });
}
