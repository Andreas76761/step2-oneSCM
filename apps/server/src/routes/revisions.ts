// Änderungsvorschläge (ADR-104, W-06, G-07, W-08): Word-Prüffassung zurücklesen, KI-Lektorat, Übernehmen/Verwerfen, interner Kommentar
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { getSettings, type Ctx } from '../context.js';
import { badRequest, Problem } from '../problem.js';
import { acceptAll, commentProposal, decideProposal, getBatch, listBatches, readWordReview, runLektorat } from '../services/revisions.js';
import { userOf } from './helpers.js';

async function upload(req: FastifyRequest) {
  if (!req.isMultipart()) throw badRequest('Erwartet multipart/form-data mit Feld „file“.');
  const file = await req.file();
  if (!file) throw badRequest('Feld „file“ fehlt.');
  const data = await file.toBuffer();
  const max = (await getSettings(req.ctx.db)).import.maxUploadBytes;
  if (data.length > max) throw new Problem(413, 'Content Too Large', `Datei überschreitet ${max} Bytes.`);
  return { name: file.filename, data };
}

type Id = { Params: { id: string } };

export function revisionRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.post('/revisions/word', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    const f = await upload(req);
    reply.code(201);
    return readWordReview(req.ctx, f.name, f.data, user);
  });
  app.post<{ Params: { versionId: string } }>('/chapter-versions/:versionId/lektorat', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return runLektorat(req.ctx, req.params.versionId, user);
  });
  app.get('/revision-batches', async (req) => (userOf(req.ctx, req), listBatches(req.ctx)));
  app.get<Id>('/revision-batches/:id', async (req) => (userOf(req.ctx, req), getBatch(req.ctx, req.params.id)));
  app.post<Id & { Body: any }>('/revision-batches/:id/accept-all', async (req) => acceptAll(req.ctx, req.params.id, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.post<Id & { Body: any }>('/revision-proposals/:id/decision', async (req) => decideProposal(req.ctx, req.params.id, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.patch<Id & { Body: any }>('/revision-proposals/:id', async (req) => commentProposal(req.ctx, req.params.id, req.body ?? {}, userOf(req.ctx, req, 'edit')));
}
