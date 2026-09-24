// Mehrsprachigkeit (ADR-020)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import {
  approveTranslation, createTranslation, editTranslationBlock, exportTranslation, getTranslation, languageInfo, listTranslations, projectLanguages, setTranslationTitle, startMachineTranslation,
} from '../services/translations.js';
import { userOf } from './helpers.js';

export function translationRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/languages', async (req) => (userOf(req.ctx, req), { ...languageInfo(), projectLanguages: await projectLanguages(req.ctx) }));
  app.get<{ Querystring: { chapterId?: string } }>('/translations', async (req) => (userOf(req.ctx, req), listTranslations(req.ctx, req.query.chapterId)));
  app.post<{ Body: { chapterId?: string; language?: string } }>('/translations', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createTranslation(req.ctx, req.body ?? {}, user.id);
  });
  app.get<{ Params: { translationId: string } }>('/translations/:translationId', async (req) => (userOf(req.ctx, req), getTranslation(req.ctx, req.params.translationId)));
  app.patch<{ Params: { translationId: string }; Body: { title?: string } }>('/translations/:translationId', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return setTranslationTitle(req.ctx, req.params.translationId, req.body?.title, user.id);
  });
  app.post<{ Params: { translationId: string } }>('/translations/:translationId/machine', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(202);
    return startMachineTranslation(req.ctx, req.params.translationId, user.id);
  });
  app.patch<{ Params: { translationBlockId: string }; Body: { text?: string } }>('/translation-blocks/:translationBlockId', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return editTranslationBlock(req.ctx, req.params.translationBlockId, req.body ?? {}, user.id);
  });
  app.post<{ Params: { translationId: string }; Body: { comment?: string } }>('/translations/:translationId/approve', async (req) => {
    const user = userOf(req.ctx, req, 'approve');
    return approveTranslation(req.ctx, req.params.translationId, req.body ?? {}, user.id);
  });
  app.get<{ Params: { translationId: string }; Querystring: { format?: string } }>('/translations/:translationId/export', async (req, reply) => {
    userOf(req.ctx, req);
    const f = await exportTranslation(req.ctx, req.params.translationId, req.query.format ?? 'md');
    reply.header('Content-Type', f.type).header('Content-Disposition', `attachment; filename="${f.fileName}"`);
    return f.data;
  });
}
