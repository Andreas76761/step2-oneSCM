// KI-Umformulierung als Vorschlag mit Quellenbindung je Satz (ADR-013, E-16)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { acceptProposal, getProposal, listProposals, llmStatus, proposeRewrite, rejectProposal } from '../services/rewrite.js';
import { acceptValid, cancelBatch, getBatch, listBatches, llmUsage, startBatch, versionProposals } from '../services/rewriteBatch.js';
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

  // Ganze Kapitel (Hintergrundjob), Sammelprüfung und Nutzung
  app.post<{ Params: { versionId: string }; Body: { instructions?: string } }>('/chapter-versions/:versionId/rewrite-jobs', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    const batch = await startBatch(req.ctx, req.params.versionId, req.body ?? {}, user.id);
    reply.code(202).header('Location', `/api/v1/rewrite-jobs/${batch.id}`);
    return batch;
  });
  app.get<{ Params: { versionId: string } }>('/chapter-versions/:versionId/rewrite-jobs', async (req) => (userOf(req.ctx, req), listBatches(req.ctx, req.params.versionId)));
  app.get<{ Params: { batchId: string } }>('/rewrite-jobs/:batchId', async (req) => (userOf(req.ctx, req), getBatch(req.ctx, req.params.batchId)));
  app.post<{ Params: { batchId: string } }>('/rewrite-jobs/:batchId/cancel', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return cancelBatch(req.ctx, req.params.batchId, user.id);
  });
  app.get<{ Params: { versionId: string }; Querystring: { status?: string } }>('/chapter-versions/:versionId/rewrite-proposals', async (req) =>
    (userOf(req.ctx, req), versionProposals(req.ctx, req.params.versionId, req.query.status)));
  app.post<{ Params: { versionId: string }; Body: { proposalIds?: string[]; reason?: string } }>('/chapter-versions/:versionId/rewrite-proposals/accept-valid', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return acceptValid(req.ctx, req.params.versionId, req.body ?? {}, user.id);
  });
  app.get<{ Querystring: { from?: string; to?: string } }>('/llm/usage', async (req) => (userOf(req.ctx, req), llmUsage(req.ctx, req.query)));
}
