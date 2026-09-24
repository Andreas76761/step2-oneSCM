// KI-Umformulierung als Vorschlag mit Quellenbindung je Satz (ADR-013, E-16)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { acceptProposal, getProposal, listProposals, llmStatus, proposeRewrite, rejectProposal } from '../services/rewrite.js';
import { userOf } from './helpers.js';

export function rewriteRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/llm/status', async (req) => (userOf(req.ctx, req), llmStatus(req.ctx)));
  app.post<{ Params: { blockId: string }; Body: { instructions?: string } }>('/content-blocks/:blockId/rewrite-proposals', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    const proposal = await proposeRewrite(req.ctx, req.params.blockId, req.body ?? {}, user.id);
    reply.code(201);
    return proposal;
  });
  app.get<{ Params: { blockId: string } }>('/content-blocks/:blockId/rewrite-proposals', async (req) => (userOf(req.ctx, req), listProposals(req.ctx, req.params.blockId)));
  app.get<{ Params: { proposalId: string } }>('/rewrite-proposals/:proposalId', async (req) => (userOf(req.ctx, req), getProposal(req.ctx, req.params.proposalId)));
  app.post<{ Params: { proposalId: string }; Body: { reason?: string } }>('/rewrite-proposals/:proposalId/accept', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return acceptProposal(req.ctx, req.params.proposalId, req.body ?? {}, user.id);
  });
  app.post<{ Params: { proposalId: string }; Body: { reason?: string } }>('/rewrite-proposals/:proposalId/reject', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return rejectProposal(req.ctx, req.params.proposalId, req.body ?? {}, user.id);
  });
}
