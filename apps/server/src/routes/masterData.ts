// Stammdaten und Draft Manual (ADR-032, ADR-033): Gliederungen, Zuordnungen, Planung, Abkürzungen, FAQ, Bildverzeichnis
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import {
  abbreviationSuggestions, createAbbreviation, createFaq, deleteAbbreviation, deleteFaq, faqSuggestions, imageIndex, listAbbreviations, listFaq,
  setMediaTitle, updateAbbreviation, updateFaq,
} from '../services/masterData.js';
import {
  addNode, assignSnippets, autoAssign, createOutline, deleteNode, deleteOutline, draftManual, exportDraft, exportOutline, getOutline, listOutlines,
  moveAssignment, newOutlineVersion, outlineCandidates, outlinePlan, setPlanItem, unassignSnippet, updateNode, updateOutline,
} from '../services/outlines.js';
import { generateVariant, materializeVariant, variantChapters } from '../services/variants.js';
import { badRequest } from '../problem.js';
import { num, userOf } from './helpers.js';

type P<T extends string> = { Params: Record<T, string> };

export function masterDataRoutes(app: FastifyInstance, _ctx: Ctx) {
  // Gliederungen (Inhaltsverzeichnis)
  app.get('/outlines', async (req) => (userOf(req.ctx, req), listOutlines(req.ctx)));
  app.post<{ Body: any }>('/outlines', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createOutline(req.ctx, req.body ?? {}, user);
  });
  app.get<P<'outlineId'>>('/outlines/:outlineId', async (req) => (userOf(req.ctx, req), getOutline(req.ctx, req.params.outlineId)));
  app.patch<P<'outlineId'> & { Body: any }>('/outlines/:outlineId', async (req) => updateOutline(req.ctx, req.params.outlineId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<P<'outlineId'>>('/outlines/:outlineId', async (req, reply) => {
    await deleteOutline(req.ctx, req.params.outlineId, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });
  app.post<P<'outlineId'> & { Body: any }>('/outlines/:outlineId/versions', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return newOutlineVersion(req.ctx, req.params.outlineId, req.body ?? {}, user);
  });
  app.get<P<'outlineId'> & { Querystring: { format?: string } }>('/outlines/:outlineId/export', async (req, reply) => {
    userOf(req.ctx, req);
    const f = await exportOutline(req.ctx, req.params.outlineId, req.query.format ?? 'md');
    reply.header('Content-Type', f.type).header('Content-Disposition', `attachment; filename="${f.fileName}"`);
    return f.data;
  });
  app.post<P<'outlineId'> & { Body: any }>('/outlines/:outlineId/nodes', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return addNode(req.ctx, req.params.outlineId, req.body ?? {}, user);
  });
  app.patch<P<'nodeId'> & { Body: any }>('/outline-nodes/:nodeId', async (req) => updateNode(req.ctx, req.params.nodeId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<P<'nodeId'>>('/outline-nodes/:nodeId', async (req) => deleteNode(req.ctx, req.params.nodeId, userOf(req.ctx, req, 'edit')));

  // Draft Manual
  app.get<P<'outlineId'>>('/outlines/:outlineId/draft', async (req) => (userOf(req.ctx, req), draftManual(req.ctx, req.params.outlineId)));
  app.get<P<'outlineId'> & { Querystring: { flags?: string } }>('/outlines/:outlineId/draft/export', async (req, reply) => {
    userOf(req.ctx, req);
    const f = await exportDraft(req.ctx, req.params.outlineId, req.query.flags !== 'false');
    reply.header('Content-Type', f.type).header('Content-Disposition', `attachment; filename="${f.fileName}"`);
    return f.data;
  });
  app.get<P<'outlineId'> & { Querystring: Record<string, string> }>('/outlines/:outlineId/candidates', async (req) => {
    userOf(req.ctx, req);
    const q = req.query;
    return outlineCandidates(req.ctx, req.params.outlineId, { q: q.q, chapterId: q.chapterId, assigned: q.assigned, page: num(q.page), pageSize: num(q.pageSize) });
  });
  app.post<P<'outlineId'> & { Body: any }>('/outlines/:outlineId/assignments', async (req) => assignSnippets(req.ctx, req.params.outlineId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<P<'outlineId' | 'snippetId'>>('/outlines/:outlineId/assignments/:snippetId', async (req, reply) => {
    await unassignSnippet(req.ctx, req.params.outlineId, req.params.snippetId, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });
  app.patch<P<'outlineId' | 'snippetId'> & { Body: { move?: 'up' | 'down' } }>('/outlines/:outlineId/assignments/:snippetId', async (req, reply) => {
    const move = req.body?.move;
    if (move !== 'up' && move !== 'down') throw badRequest('move muss up oder down sein.');
    await moveAssignment(req.ctx, req.params.outlineId, req.params.snippetId, move, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });
  app.post<P<'outlineId'>>('/outlines/:outlineId/auto-assign', async (req) => autoAssign(req.ctx, req.params.outlineId, userOf(req.ctx, req, 'edit')));

  // Handbuch-Variante (ADR-034): Kapitel der Gliederung anlegen, Entwürfe erzeugen, Stand der Freigabe
  app.get<P<'outlineId'>>('/outlines/:outlineId/chapters', async (req) => (userOf(req.ctx, req), variantChapters(req.ctx, req.params.outlineId)));
  app.post<P<'outlineId'>>('/outlines/:outlineId/materialize', async (req) => materializeVariant(req.ctx, req.params.outlineId, userOf(req.ctx, req, 'edit')));
  app.post<P<'outlineId'>>('/outlines/:outlineId/generate', async (req) => generateVariant(req.ctx, req.params.outlineId, userOf(req.ctx, req, 'edit')));

  // Redaktionsplanung
  app.get<P<'outlineId'>>('/outlines/:outlineId/plan', async (req) => (userOf(req.ctx, req), outlinePlan(req.ctx, req.params.outlineId)));
  app.put<P<'nodeId'> & { Body: any }>('/outline-nodes/:nodeId/plan', async (req) => setPlanItem(req.ctx, req.params.nodeId, req.body ?? {}, userOf(req.ctx, req, 'edit')));

  // Abkürzungen
  app.get('/abbreviations', async (req) => (userOf(req.ctx, req), listAbbreviations(req.ctx)));
  app.get('/abbreviations/suggestions', async (req) => (userOf(req.ctx, req), abbreviationSuggestions(req.ctx)));
  app.post<{ Body: any }>('/abbreviations', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createAbbreviation(req.ctx, req.body ?? {}, user);
  });
  app.patch<P<'abbreviationId'> & { Body: any }>('/abbreviations/:abbreviationId', async (req) => updateAbbreviation(req.ctx, req.params.abbreviationId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<P<'abbreviationId'>>('/abbreviations/:abbreviationId', async (req, reply) => {
    await deleteAbbreviation(req.ctx, req.params.abbreviationId, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });

  // FAQ
  app.get<{ Querystring: Record<string, string> }>('/faq', async (req) => (userOf(req.ctx, req), listFaq(req.ctx, req.query)));
  app.get('/faq/suggestions', async (req) => (userOf(req.ctx, req, 'edit'), faqSuggestions(req.ctx)));
  app.post<{ Body: any }>('/faq', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createFaq(req.ctx, req.body ?? {}, user);
  });
  app.patch<P<'faqId'> & { Body: any }>('/faq/:faqId', async (req) => updateFaq(req.ctx, req.params.faqId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<P<'faqId'>>('/faq/:faqId', async (req, reply) => {
    await deleteFaq(req.ctx, req.params.faqId, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });

  // Bildverzeichnis
  app.get('/image-index', async (req) => (userOf(req.ctx, req), imageIndex(req.ctx)));
  app.patch<P<'mediaSha'> & { Body: { title?: string | null } }>('/media/:mediaSha', async (req) => setMediaTitle(req.ctx, req.params.mediaSha, req.body?.title ?? null, userOf(req.ctx, req, 'edit')));
}
