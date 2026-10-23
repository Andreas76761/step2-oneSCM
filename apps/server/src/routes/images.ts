// Bildarchiv (ADR-085, F-20, F-21): Merkmale, Versionen, Platzhalter, Prüfregeln, Bildabdeckung je Kapitel
import type { FastifyInstance } from 'fastify';
import { audit, getSettings, type Ctx } from '../context.js';
import { badRequest, Problem } from '../problem.js';
import { addImageVersion, createPlaceholder, exportCoverageMatrix, imageCoverage, imageCoverageMatrix, linkVariant, listImageArchive, unlinkVariant, updateImageMeta } from '../services/imageArchive.js';
import { detectRedaction, getRedaction, updateRedaction } from '../services/imageRedaction.js';
import { createClickpath, deleteClickpath, getClickpath, listClickpaths, updateClickpath } from '../services/clickpaths.js';
import { userOf } from './helpers.js';

type P = { Params: { mediaSha: string } };

export function imageRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<{ Querystring: { q?: string; labelId?: string; chapterId?: string } }>('/image-archive', async (req) => (userOf(req.ctx, req), listImageArchive(req.ctx, { q: req.query.q, labelId: req.query.labelId, chapterId: req.query.chapterId })));
  // Datenschutz im Bild (ADR-095): je Fassung; das Original bleibt, ausgeliefert wird bei „an“ die verpixelte Kopie
  app.get<P>('/image-archive/:mediaSha/redaction', async (req) => (userOf(req.ctx, req), getRedaction(req.ctx, req.params.mediaSha)));
  app.post<P>('/image-archive/:mediaSha/redaction/detect', async (req) => detectRedaction(req.ctx, req.params.mediaSha, userOf(req.ctx, req, 'edit').id));
  app.patch<P & { Body: any }>('/image-archive/:mediaSha/redaction', async (req) => updateRedaction(req.ctx, req.params.mediaSha, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.get('/image-archive/coverage', async (req) => (userOf(req.ctx, req), imageCoverage(req.ctx)));
  // Varianten einer Maske (ADR-093, F-22)
  app.post<P & { Body: any }>('/image-archive/:mediaSha/variants', async (req) => linkVariant(req.ctx, req.params.mediaSha, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<P>('/image-archive/:mediaSha/variants', async (req) => unlinkVariant(req.ctx, req.params.mediaSha, userOf(req.ctx, req, 'edit')));
  // Klickstrecke aus Screenshots (ADR-093, F-24)
  app.get('/image-clickpaths', async (req) => (userOf(req.ctx, req), listClickpaths(req.ctx)));
  app.post<{ Body: any }>('/image-clickpaths', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createClickpath(req.ctx, req.body ?? {}, user);
  });
  app.get<{ Params: { clickpathId: string } }>('/image-clickpaths/:clickpathId', async (req) => (userOf(req.ctx, req), getClickpath(req.ctx, req.params.clickpathId)));
  app.put<{ Params: { clickpathId: string }; Body: any }>('/image-clickpaths/:clickpathId', async (req) => updateClickpath(req.ctx, req.params.clickpathId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<{ Params: { clickpathId: string } }>('/image-clickpaths/:clickpathId', async (req, reply) => {
    await deleteClickpath(req.ctx, req.params.clickpathId, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });
  // Deckungsmatrix (ADR-092, F-30): Stelle × Sprache/Rolle/Sparte
  app.get<{ Querystring: { rows?: string; dims?: string } }>('/image-archive/coverage-matrix', async (req) => (userOf(req.ctx, req), imageCoverageMatrix(req.ctx, { rows: req.query.rows, dims: req.query.dims?.split(',').filter(Boolean) })));
  app.get<{ Querystring: { rows?: string; dims?: string; format?: string } }>('/image-archive/coverage-matrix/export', async (req, reply) => {
    userOf(req.ctx, req);
    const f = await exportCoverageMatrix(req.ctx, req.query.format ?? 'xlsx', { rows: req.query.rows, dims: req.query.dims?.split(',').filter(Boolean) });
    reply.header('Content-Type', f.contentType).header('Content-Disposition', `attachment; filename="${f.fileName}"`);
    return f.data;
  });
  app.patch<P & { Body: any }>('/image-archive/:mediaSha', async (req) => updateImageMeta(req.ctx, req.params.mediaSha, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.post<{ Body: any }>('/image-archive/placeholders', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createPlaceholder(req.ctx, req.body ?? {}, user);
  });
  // neue Fassung: multipart mit Feld „file“, optional Feld „note“
  app.post<P>('/image-archive/:mediaSha/versions', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    if (!req.isMultipart()) throw badRequest('Erwartet multipart/form-data mit Feld „file“.');
    let data: Buffer | null = null;
    let name: string | null = null;
    let note: string | null = null;
    for await (const part of req.parts()) {
      if (part.type === 'file' && part.fieldname === 'file') {
        data = await part.toBuffer();
        name = part.filename;
      } else if (part.type === 'field' && part.fieldname === 'note') note = String(part.value ?? '');
    }
    if (!data?.length) throw badRequest('Feld „file“ fehlt.');
    const max = (await getSettings(req.ctx.db)).import.maxEntryBytes;
    if (data.length > max) throw new Problem(413, 'Content Too Large', `Bild überschreitet ${max} Bytes.`);
    const it = await addImageVersion(req.ctx, req.params.mediaSha, data, name, note, user);
    await audit(req.ctx, user.id, 'media.uploaded', 'media', it.currentSha, { fileName: name, version: it.versions.length });
    reply.code(201);
    return it;
  });
}
