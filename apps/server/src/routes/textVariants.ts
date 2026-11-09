// Textvarianten je Kapitel und Prüferprofile (ADR-105, S-05, W-12)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { profileReviews, reviewProfileList, runProfileReviews } from '../services/profileReviews.js';
import { textVariantFile, textVariants } from '../services/textVariants.js';
import { assertVersion } from '../services/assessment.js';
import { userOf } from './helpers.js';

type V = { Params: { versionId: string } };

export function textVariantRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<V & { Querystring: { ai?: string } }>('/chapter-versions/:versionId/text-variants', async (req) => {
    userOf(req.ctx, req);
    await assertVersion(req.ctx, req.params.versionId);
    return textVariants(req.ctx, req.params.versionId, { ai: req.query.ai === 'true' || req.query.ai === '1' });
  });
  app.get<{ Params: { versionId: string; code: string }; Querystring: { ai?: string } }>('/chapter-versions/:versionId/text-variants/:code/download', async (req, reply) => {
    userOf(req.ctx, req);
    await assertVersion(req.ctx, req.params.versionId);
    const f = await textVariantFile(req.ctx, req.params.versionId, req.params.code, { ai: req.query.ai === 'true' || req.query.ai === '1' });
    reply.header('Content-Type', 'text/markdown; charset=utf-8').header('Content-Disposition', `attachment; filename="${f.fileName}"`);
    return f.body;
  });

  app.get('/review-profiles', async (req) => (userOf(req.ctx, req), reviewProfileList()));
  app.get<V>('/chapter-versions/:versionId/profile-reviews', async (req) => {
    userOf(req.ctx, req);
    await assertVersion(req.ctx, req.params.versionId);
    return profileReviews(req.ctx, req.params.versionId);
  });
  app.post<V & { Body: any }>('/chapter-versions/:versionId/profile-reviews', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    await assertVersion(req.ctx, req.params.versionId);
    reply.code(201);
    return runProfileReviews(req.ctx, req.params.versionId, req.body ?? {}, user);
  });
}
