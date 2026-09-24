// Quellen, Importe, Textabschnitte (US-001 … US-004, US-017)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { badRequest } from '../problem.js';
import { createImport, getImport, getRevisionRaw, listImports, listSources } from '../services/imports.js';
import { getSnippet, patchSnippet, searchSnippets } from '../services/snippets.js';
import { num, userOf } from './helpers.js';

export function sourceRoutes(app: FastifyInstance, ctx: Ctx) {
  app.post('/imports', async (req, reply) => {
    const user = userOf(ctx, req, 'edit');
    if (!req.isMultipart()) throw badRequest('Erwartet multipart/form-data mit Feld „file“.');
    const file = await req.file();
    if (!file) throw badRequest('Feld „file“ fehlt.');
    const data = await file.toBuffer();
    const result = await createImport(ctx, file.filename, data, user.id);
    reply.code(202).header('Location', `/api/v1/imports/${result.id}`);
    return result;
  });
  app.get('/imports', async (req) => (userOf(ctx, req), listImports(ctx)));
  app.get<{ Params: { importId: string } }>('/imports/:importId', async (req) => (userOf(ctx, req), getImport(ctx, req.params.importId)));
  app.get('/sources', async (req) => (userOf(ctx, req), listSources(ctx)));
  app.get<{ Params: { revisionId: string } }>('/source-revisions/:revisionId/raw', async (req, reply) => {
    userOf(ctx, req);
    // Quelltext wird als text/plain ausgeliefert – eingebettetes HTML wird nie ausgeführt.
    reply.header('Content-Type', 'text/plain; charset=utf-8').header('X-Content-Type-Options', 'nosniff');
    return getRevisionRaw(ctx, req.params.revisionId);
  });

  app.get<{ Querystring: Record<string, string> }>('/snippets', async (req) => {
    userOf(ctx, req);
    const q = req.query;
    return searchSnippets(ctx, {
      q: q.q, chapterId: q.chapterId, subchapterId: q.subchapterId, role: q.role, division: q.division, market: q.market, release: q.release,
      evidenceStatus: q.evidenceStatus, findingType: q.findingType, includeHistoric: q.includeHistoric === 'true', page: num(q.page), pageSize: num(q.pageSize),
    });
  });
  app.get<{ Params: { snippetId: string } }>('/snippets/:snippetId', async (req) => (userOf(ctx, req), getSnippet(ctx, req.params.snippetId)));
  app.patch<{ Params: { snippetId: string }; Body: any }>('/snippets/:snippetId', async (req) => {
    const user = userOf(ctx, req, 'edit');
    return patchSnippet(ctx, req.params.snippetId, (req.body ?? {}) as any, user.id);
  });
}
