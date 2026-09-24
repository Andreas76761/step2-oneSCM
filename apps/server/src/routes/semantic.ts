// Semantische Suche und Embedding-Index (ADR-017)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { indexStatus, semanticSearch, startIndexJob } from '../services/semantic.js';
import { num, userOf } from './helpers.js';

export function semanticRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<{ Querystring: { q?: string; limit?: string; chapterId?: string; minScore?: string } }>('/search/semantic', async (req) => {
    userOf(req.ctx, req);
    return semanticSearch(req.ctx, { q: req.query.q, limit: num(req.query.limit), chapterId: req.query.chapterId || undefined, minScore: num(req.query.minScore) });
  });
  app.get('/semantic-index', async (req) => (userOf(req.ctx, req), indexStatus(req.ctx)));
  app.post('/semantic-index', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(202);
    return startIndexJob(req.ctx, user.id);
  });
}
