// Kapitel, Generierung, Kapitelwerkstatt, Freigabe (US-008, US-009, US-012)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import {
  approveVersion, createBlock, deleteBlock, generate, getChapter, getChapterVersion, listBlockVersions, listChapters, listChapterVersions, patchBlock, restoreBlock, versionGate,
} from '../services/chapters.js';
import { userOf } from './helpers.js';

export function chapterRoutes(app: FastifyInstance, ctx: Ctx) {
  app.get('/chapters', async (req) => (userOf(ctx, req), listChapters(ctx)));
  app.get<{ Params: { chapterId: string } }>('/chapters/:chapterId', async (req) => (userOf(ctx, req), getChapter(ctx, req.params.chapterId)));
  app.get<{ Params: { chapterId: string } }>('/chapters/:chapterId/versions', async (req) => (userOf(ctx, req), listChapterVersions(ctx, req.params.chapterId)));
  app.post<{ Params: { chapterId: string } }>('/chapters/:chapterId/generate', async (req, reply) => {
    const user = userOf(ctx, req, 'edit');
    reply.code(201);
    return generate(ctx, req.params.chapterId, user.id);
  });
  app.get<{ Params: { versionId: string } }>('/chapter-versions/:versionId', async (req) => (userOf(ctx, req), getChapterVersion(ctx, req.params.versionId)));
  app.get<{ Params: { versionId: string } }>('/chapter-versions/:versionId/gate', async (req) => (userOf(ctx, req), versionGate(ctx, req.params.versionId)));
  app.post<{ Params: { versionId: string }; Body: any }>('/chapter-versions/:versionId/content-blocks', async (req, reply) => {
    const user = userOf(ctx, req, 'edit');
    reply.code(201);
    return createBlock(ctx, req.params.versionId, (req.body ?? {}) as any, user.id);
  });
  app.post<{ Params: { versionId: string }; Body: any }>('/chapter-versions/:versionId/approve', async (req) => {
    const user = userOf(ctx, req, 'approve');
    return approveVersion(ctx, req.params.versionId, (req.body ?? {}) as any, user.id);
  });
  app.patch<{ Params: { blockId: string }; Body: any }>('/content-blocks/:blockId', async (req) => {
    const user = userOf(ctx, req, 'edit');
    return patchBlock(ctx, req.params.blockId, (req.body ?? {}) as any, user.id);
  });
  app.delete<{ Params: { blockId: string }; Querystring: { reason?: string } }>('/content-blocks/:blockId', async (req, reply) => {
    const user = userOf(ctx, req, 'edit');
    deleteBlock(ctx, req.params.blockId, req.query.reason, user.id);
    reply.code(204);
  });
  app.get<{ Params: { blockId: string } }>('/content-blocks/:blockId/versions', async (req) => (userOf(ctx, req), listBlockVersions(ctx, req.params.blockId)));
  app.post<{ Params: { blockId: string }; Body: { versionNo: number } }>('/content-blocks/:blockId/restore', async (req) => {
    const user = userOf(ctx, req, 'edit');
    return restoreBlock(ctx, req.params.blockId, Number(req.body?.versionNo), user.id);
  });
}
