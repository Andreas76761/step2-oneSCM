// Kapitelbewertung mit Ampel, Plausibilität je Aussage und Fehlerliste (ADR-103, S-07, W-02, G-05)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { assertVersion, assessmentOverview, chapterAssessment, plausibility } from '../services/assessment.js';
import { collectFromVersion, createLanguageError, exportLanguageErrors, importLanguageErrors, listLanguageErrors, updateLanguageError } from '../services/languageErrors.js';
import { userOf } from './helpers.js';

type V = { Params: { versionId: string } };

export function assessmentRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/assessments', async (req) => (userOf(req.ctx, req), assessmentOverview(req.ctx)));
  app.get<V>('/chapter-versions/:versionId/assessment', async (req) => {
    userOf(req.ctx, req);
    await assertVersion(req.ctx, req.params.versionId);
    return chapterAssessment(req.ctx, req.params.versionId);
  });
  app.get<V>('/chapter-versions/:versionId/plausibility', async (req) => {
    userOf(req.ctx, req);
    await assertVersion(req.ctx, req.params.versionId);
    return plausibility(req.ctx, req.params.versionId);
  });

  app.get<{ Querystring: { status?: string; chapterId?: string; category?: string; q?: string } }>('/language-errors', async (req) => (userOf(req.ctx, req), listLanguageErrors(req.ctx, req.query)));
  app.get('/language-errors/export', async (req, reply) => {
    userOf(req.ctx, req);
    const f = await exportLanguageErrors(req.ctx);
    reply.header('Content-Type', f.contentType).header('Content-Disposition', `attachment; filename="${f.fileName}"`);
    return f.body;
  });
  app.post<{ Body: any }>('/language-errors/collect', async (req) => collectFromVersion(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.post<{ Body: any }>('/language-errors/import', async (req) => importLanguageErrors(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.post<{ Body: any }>('/language-errors', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createLanguageError(req.ctx, (req.body ?? {}) as Record<string, unknown>, user);
  });
  app.patch<{ Params: { id: string }; Body: any }>('/language-errors/:id', async (req) => updateLanguageError(req.ctx, req.params.id, (req.body ?? {}) as Record<string, unknown>, userOf(req.ctx, req, 'edit')));
}
