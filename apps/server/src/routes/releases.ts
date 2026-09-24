// Handbuch-Releases und statische Online-Hilfe (ADR-018)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { createRelease, downloadRelease, getRelease, listReleases } from '../services/releases.js';
import { userOf } from './helpers.js';

export function releaseRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/releases', async (req) => (userOf(req.ctx, req), listReleases(req.ctx)));
  app.post<{ Body: { version?: string; title?: string; notes?: string } }>('/releases', async (req, reply) => {
    // Veröffentlichen ist eine Freigabeentscheidung
    const user = userOf(req.ctx, req, 'approve');
    reply.code(201);
    return createRelease(req.ctx, req.body ?? {}, user.id);
  });
  app.get<{ Params: { releaseId: string } }>('/releases/:releaseId', async (req) => (userOf(req.ctx, req), getRelease(req.ctx, req.params.releaseId)));
  app.get<{ Params: { releaseId: string }; Querystring: { format?: string } }>('/releases/:releaseId/download', async (req, reply) => {
    userOf(req.ctx, req);
    const f = await downloadRelease(req.ctx, req.params.releaseId, req.query.format ?? 'site');
    reply.header('Content-Type', f.type).header('Content-Disposition', `attachment; filename="${f.fileName}"`);
    return f.data;
  });
}
