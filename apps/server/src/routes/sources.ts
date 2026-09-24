// Quellen, Importe, Textabschnitte (US-001 … US-004, US-017)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { badRequest } from '../problem.js';
import { createImport, getImport, getRevisionOriginal, getRevisionRaw, listImports, listSources } from '../services/imports.js';
import { getSnippet, patchSnippet, searchSnippets } from '../services/snippets.js';
import { getMedia, listMedia, storeMedia } from '../services/media.js';
import { audit, getSettings } from '../context.js';
import { Problem } from '../problem.js';
import { num, userOf } from './helpers.js';

export function sourceRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.post('/imports', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    if (!req.isMultipart()) throw badRequest('Erwartet multipart/form-data mit Feld „file“.');
    const file = await req.file();
    if (!file) throw badRequest('Feld „file“ fehlt.');
    const data = await file.toBuffer();
    const result = await createImport(req.ctx, file.filename, data, user.id);
    reply.code(202).header('Location', `/api/v1/imports/${result.id}`);
    return result;
  });
  app.get('/imports', async (req) => (userOf(req.ctx, req), listImports(req.ctx)));
  app.get<{ Params: { importId: string } }>('/imports/:importId', async (req) => (userOf(req.ctx, req), getImport(req.ctx, req.params.importId)));
  app.get('/sources', async (req) => (userOf(req.ctx, req), listSources(req.ctx)));
  app.get<{ Params: { revisionId: string } }>('/source-revisions/:revisionId/raw', async (req, reply) => {
    userOf(req.ctx, req);
    // Quelltext wird als text/plain ausgeliefert – eingebettetes HTML wird nie ausgeführt.
    reply.header('Content-Type', 'text/plain; charset=utf-8').header('X-Content-Type-Options', 'nosniff');
    return getRevisionRaw(req.ctx, req.params.revisionId);
  });
  app.get<{ Params: { revisionId: string } }>('/source-revisions/:revisionId/original', async (req, reply) => {
    userOf(req.ctx, req);
    const o = await getRevisionOriginal(req.ctx, req.params.revisionId);
    reply.header('Content-Type', o.contentType).header('Content-Disposition', `attachment; filename="${encodeURIComponent(o.fileName)}"`);
    return o.data;
  });

  // Bilder & Medien (ADR-029)
  app.get('/media', async (req) => (userOf(req.ctx, req), listMedia(req.ctx)));
  app.get<{ Params: { mediaSha: string } }>('/media/:mediaSha', async (req, reply) => {
    userOf(req.ctx, req);
    const m = await getMedia(req.ctx, req.params.mediaSha);
    // Inhaltsadressiert → unveränderlich; privat (projektgebunden), nie als etwas anderes als Bild interpretieren
    reply.header('Content-Type', m.mime).header('X-Content-Type-Options', 'nosniff').header('Cache-Control', 'private, max-age=31536000, immutable')
      .header('Content-Security-Policy', "default-src 'none'; sandbox");
    return m.data;
  });
  app.post('/media', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    if (!req.isMultipart()) throw badRequest('Erwartet multipart/form-data mit Feld „file“.');
    const file = await req.file();
    if (!file) throw badRequest('Feld „file“ fehlt.');
    const data = await file.toBuffer();
    const max = (await getSettings(req.ctx.db)).import.maxEntryBytes;
    if (data.length > max) throw new Problem(413, 'Content Too Large', `Bild überschreitet ${max} Bytes.`);
    const m = await storeMedia(req.ctx, data, file.filename);
    await audit(req.ctx, user.id, 'media.uploaded', 'media', m.sha, { fileName: file.filename, mime: m.mime, byteSize: data.length });
    reply.code(201);
    return { sha256: m.sha, mime: m.mime, width: m.width, height: m.height, url: `/api/v1/media/${m.sha}`, markdown: `![Alternativtext](media:${m.sha})` };
  });

  app.get<{ Querystring: Record<string, string> }>('/snippets', async (req) => {
    userOf(req.ctx, req);
    const q = req.query;
    return searchSnippets(req.ctx, {
      q: q.q, chapterId: q.chapterId, subchapterId: q.subchapterId, role: q.role, division: q.division, market: q.market, release: q.release,
      evidenceStatus: q.evidenceStatus, findingType: q.findingType, includeHistoric: q.includeHistoric === 'true', page: num(q.page), pageSize: num(q.pageSize),
    });
  });
  app.get<{ Params: { snippetId: string } }>('/snippets/:snippetId', async (req) => (userOf(req.ctx, req), getSnippet(req.ctx, req.params.snippetId)));
  app.patch<{ Params: { snippetId: string }; Body: any }>('/snippets/:snippetId', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return patchSnippet(req.ctx, req.params.snippetId, (req.body ?? {}) as any, user.id);
  });
}
