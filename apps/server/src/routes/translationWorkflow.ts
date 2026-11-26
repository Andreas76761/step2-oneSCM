// Übersetzung (ADR-101, U-01 … U-10): Übersetzungsspeicher, Glossar je Sprache, XLIFF/Excel, Länderreview, Rückübersetzung, Releaseletter DE↔EN
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { getSettings, type Ctx } from '../context.js';
import { badRequest, Problem } from '../problem.js';
import {
  addReviewError, blockMemory, deleteMarketReviewer, listMarketReviewers, myReviews, setMarketReviewer, decideReview, deleteTm, exportGlossary, exportTm, exportTranslationFile, glossary, importGlossary, importTm, importTranslationFile, listReviews,
  listTm, removeReviewError, requestReview, runBackcheck, translateReleaseLetter, updateTm,
} from '../services/translationWorkflow.js';
import { userOf } from './helpers.js';

/** Datei aus multipart (Feld „file“) mit der Uploadgrenze der Einstellungen */
async function upload(req: FastifyRequest) {
  if (!req.isMultipart()) throw badRequest('Erwartet multipart/form-data mit Feld „file“.');
  const file = await req.file();
  if (!file) throw badRequest('Feld „file“ fehlt.');
  const data = await file.toBuffer();
  const max = (await getSettings(req.ctx.db)).import.maxUploadBytes;
  if (data.length > max) throw new Problem(413, 'Content Too Large', `Datei überschreitet ${max} Bytes.`);
  return { name: file.filename, data };
}
const send = (reply: any, f: { data: Buffer; fileName: string; contentType: string }) =>
  reply.header('Content-Type', f.contentType).header('Content-Disposition', `attachment; filename="${f.fileName}"`).send(f.data);

export function translationWorkflowRoutes(app: FastifyInstance, _ctx: Ctx) {
  // Übersetzungsspeicher (U-01)
  app.get<{ Querystring: { language?: string; q?: string; status?: string; limit?: string; offset?: string } }>('/translation-memory', async (req) => {
    userOf(req.ctx, req);
    const q = req.query;
    return listTm(req.ctx, { language: q.language || undefined, q: q.q, status: q.status || undefined, limit: q.limit ? Number(q.limit) : undefined, offset: q.offset ? Number(q.offset) : undefined });
  });
  app.get<{ Querystring: { language?: string; format?: string } }>('/translation-memory/export', async (req, reply) => {
    userOf(req.ctx, req);
    return send(reply, await exportTm(req.ctx, String(req.query.language ?? ''), req.query.format ?? 'csv'));
  });
  app.post<{ Querystring: { language?: string; apply?: string } }>('/translation-memory/import', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    const f = await upload(req);
    return importTm(req.ctx, String(req.query.language ?? ''), f.name, f.data, req.query.apply === 'true', user);
  });
  app.patch<{ Params: { id: string }; Body: any }>('/translation-memory/:id', async (req) => updateTm(req.ctx, req.params.id, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<{ Params: { id: string } }>('/translation-memory/:id', async (req, reply) => {
    await deleteTm(req.ctx, req.params.id, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });
  app.get<{ Params: { id: string } }>('/translation-blocks/:id/memory', async (req) => (userOf(req.ctx, req), blockMemory(req.ctx, req.params.id)));

  // Glossar je Sprache (U-04)
  app.get<{ Querystring: { language?: string } }>('/translation-glossary', async (req) => (userOf(req.ctx, req), { language: req.query.language, items: await glossary(req.ctx, String(req.query.language ?? '')) }));
  app.get<{ Querystring: { language?: string; format?: string } }>('/translation-glossary/export', async (req, reply) => {
    userOf(req.ctx, req);
    return send(reply, await exportGlossary(req.ctx, String(req.query.language ?? ''), req.query.format ?? 'csv'));
  });
  app.post<{ Querystring: { language?: string; apply?: string } }>('/translation-glossary/import', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    const f = await upload(req);
    return importGlossary(req.ctx, String(req.query.language ?? ''), f.name, f.data, req.query.apply === 'true', user);
  });

  // XLIFF 1.2 und Excel je Übersetzung (U-05)
  app.get<{ Params: { translationId: string }; Querystring: { format?: string } }>('/translations/:translationId/file', async (req, reply) => {
    userOf(req.ctx, req);
    return send(reply, await exportTranslationFile(req.ctx, req.params.translationId, req.query.format ?? 'xlf'));
  });
  app.post<{ Params: { translationId: string }; Querystring: { apply?: string } }>('/translations/:translationId/file', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    const f = await upload(req);
    return importTranslationFile(req.ctx, req.params.translationId, f.name, f.data, req.query.apply === 'true', user);
  });

  // Länderreview mit MQM (U-03): anfordern mit edit; erfassen und entscheiden nur die zugewiesene Person (Lesezugriff genügt)
  app.get<{ Params: { translationId: string } }>('/translations/:translationId/reviews', async (req) => (userOf(req.ctx, req), { items: await listReviews(req.ctx, req.params.translationId) }));
  app.post<{ Params: { translationId: string }; Body: any }>('/translations/:translationId/reviews', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return requestReview(req.ctx, req.params.translationId, req.body ?? {}, user);
  });
  // Ansprechperson je Markt (ADR-108, O-09): lesen alle, pflegen Administration
  app.get('/market-reviewers', async (req) => (userOf(req.ctx, req), listMarketReviewers(req.ctx)));
  app.put<{ Body: any }>('/market-reviewers', async (req) => setMarketReviewer(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'admin')));
  app.delete<{ Params: { market: string }; Querystring: { language?: string } }>('/market-reviewers/:market', async (req, reply) => {
    await deleteMarketReviewer(req.ctx, req.params.market, req.query.language ?? '', userOf(req.ctx, req, 'admin'));
    reply.code(204);
  });
  app.get('/translation-reviews/mine', async (req) => ({ items: await myReviews(req.ctx, userOf(req.ctx, req)) }));
  app.post<{ Params: { id: string }; Body: any }>('/translation-reviews/:id/errors', async (req, reply) => {
    const user = userOf(req.ctx, req);
    reply.code(201);
    return addReviewError(req.ctx, req.params.id, req.body ?? {}, user);
  });
  app.delete<{ Params: { id: string; errorId: string } }>('/translation-reviews/:id/errors/:errorId', async (req) => removeReviewError(req.ctx, req.params.id, req.params.errorId, userOf(req.ctx, req)));
  app.post<{ Params: { id: string }; Body: any }>('/translation-reviews/:id/decision', async (req) => decideReview(req.ctx, req.params.id, req.body ?? {}, userOf(req.ctx, req)));

  // Rückübersetzung von Sicherheitshinweisen (U-06)
  app.post<{ Params: { translationId: string } }>('/translations/:translationId/backcheck', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return runBackcheck(req.ctx, req.params.translationId, user);
  });

  // Releaseletter DE↔EN (U-09)
  app.post<{ Params: { id: string } }>('/release-letters/:id/translate', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return translateReleaseLetter(req.ctx, req.params.id, user);
  });
}
