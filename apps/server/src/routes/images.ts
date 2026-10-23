// Bildarchiv (ADR-085, F-20, F-21): Merkmale, Versionen, Platzhalter, Prüfregeln, Bildabdeckung je Kapitel
import type { FastifyInstance } from 'fastify';
import { audit, getSettings, type Ctx } from '../context.js';
import { badRequest, Problem } from '../problem.js';
import { addImageVersion, createPlaceholder, imageCoverage, listImageArchive, updateImageMeta } from '../services/imageArchive.js';
import { userOf } from './helpers.js';

type P = { Params: { mediaSha: string } };

export function imageRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<{ Querystring: { q?: string } }>('/image-archive', async (req) => (userOf(req.ctx, req), listImageArchive(req.ctx, { q: req.query.q })));
  app.get('/image-archive/coverage', async (req) => (userOf(req.ctx, req), imageCoverage(req.ctx)));
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
