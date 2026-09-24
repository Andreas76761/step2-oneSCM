// Kapitel, Generierung, Kapitelwerkstatt, Freigabe (US-008, US-009, US-012)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import {
  approveVersion, createBlock, submitVersion, withdrawVersion, deleteBlock, generate, getChapter, getChapterVersion, listBlockVersions, listChapters, listChapterVersions, patchBlock, restoreBlock, versionGate,
} from '../services/chapters.js';
import { compareVersions } from '../services/compare.js';
import { evidenceForVersion } from '../services/insights.js';
import { unprocessable } from '../problem.js';
import { userOf } from './helpers.js';

export function chapterRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/chapters', async (req) => (userOf(req.ctx, req), listChapters(req.ctx)));
  app.get<{ Params: { chapterId: string } }>('/chapters/:chapterId', async (req) => (userOf(req.ctx, req), getChapter(req.ctx, req.params.chapterId)));
  app.get<{ Params: { chapterId: string }; Querystring: { from?: string; to?: string } }>('/chapters/:chapterId/compare', async (req) => {
    userOf(req.ctx, req);
    let { from, to } = req.query;
    if (!from || !to) {
      // Standard: vorletzte gegen neueste Version
      const versions = await listChapterVersions(req.ctx, req.params.chapterId);
      to ??= versions[0]?.id;
      from ??= versions.find((v) => v.id !== to)?.id;
      if (!from || !to) throw unprocessable('Zum Vergleichen werden mindestens zwei Versionen benötigt.');
    }
    return compareVersions(req.ctx, req.params.chapterId, from, to);
  });
  app.get<{ Params: { chapterId: string } }>('/chapters/:chapterId/versions', async (req) => (userOf(req.ctx, req), listChapterVersions(req.ctx, req.params.chapterId)));
  app.post<{ Params: { chapterId: string } }>('/chapters/:chapterId/generate', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return generate(req.ctx, req.params.chapterId, user.id);
  });
  app.get<{ Params: { versionId: string } }>('/chapter-versions/:versionId', async (req) => (userOf(req.ctx, req), getChapterVersion(req.ctx, req.params.versionId)));
  app.get<{ Params: { versionId: string } }>('/chapter-versions/:versionId/gate', async (req) => (userOf(req.ctx, req), versionGate(req.ctx, req.params.versionId)));
  app.post<{ Params: { versionId: string }; Body: any }>('/chapter-versions/:versionId/content-blocks', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createBlock(req.ctx, req.params.versionId, (req.body ?? {}) as any, user.id);
  });
  app.get<{ Params: { versionId: string } }>('/chapter-versions/:versionId/evidence', async (req) => (userOf(req.ctx, req), evidenceForVersion(req.ctx, req.params.versionId)));
  app.post<{ Params: { versionId: string }; Body: any }>('/chapter-versions/:versionId/submit', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return submitVersion(req.ctx, req.params.versionId, (req.body ?? {}) as any, user.id);
  });
  app.post<{ Params: { versionId: string }; Body: any }>('/chapter-versions/:versionId/withdraw', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return withdrawVersion(req.ctx, req.params.versionId, (req.body ?? {}) as any, user.id);
  });
  app.post<{ Params: { versionId: string }; Body: any }>('/chapter-versions/:versionId/approve', async (req) => {
    const user = userOf(req.ctx, req, 'approve');
    return approveVersion(req.ctx, req.params.versionId, (req.body ?? {}) as any, user.id);
  });
  app.patch<{ Params: { blockId: string }; Body: any }>('/content-blocks/:blockId', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return patchBlock(req.ctx, req.params.blockId, (req.body ?? {}) as any, user.id);
  });
  app.delete<{ Params: { blockId: string }; Querystring: { reason?: string } }>('/content-blocks/:blockId', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    await deleteBlock(req.ctx, req.params.blockId, req.query.reason, user.id);
    reply.code(204);
  });
  app.get<{ Params: { blockId: string } }>('/content-blocks/:blockId/versions', async (req) => (userOf(req.ctx, req), listBlockVersions(req.ctx, req.params.blockId)));
  app.post<{ Params: { blockId: string }; Body: { versionNo: number } }>('/content-blocks/:blockId/restore', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return restoreBlock(req.ctx, req.params.blockId, Number(req.body?.versionNo), user.id);
  });
}
