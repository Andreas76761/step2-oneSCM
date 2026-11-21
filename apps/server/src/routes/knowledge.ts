// Wissensnotizen (F-15) und Zielkapitel je Dopplung (F-18), ADR-084
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { listDuplicateTargets, removeDuplicateTarget, setDuplicateTarget } from '../services/duplicateTargets.js';
import { createNote, listNotes, removeNote, updateNote } from '../services/knowledgeNotes.js';
import { userOf } from './helpers.js';

export function knowledgeRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<{ Querystring: { includeRemoved?: string } }>('/knowledge-notes', async (req) => (userOf(req.ctx, req), listNotes(req.ctx, { includeRemoved: req.query.includeRemoved === 'true' })));
  app.post<{ Body: any }>('/knowledge-notes', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createNote(req.ctx, req.body ?? {}, user);
  });
  app.patch<{ Params: { noteId: string }; Body: any }>('/knowledge-notes/:noteId', async (req) => updateNote(req.ctx, req.params.noteId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<{ Params: { noteId: string } }>('/knowledge-notes/:noteId', async (req, reply) => {
    await removeNote(req.ctx, req.params.noteId, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });

  app.get('/duplicate-targets', async (req) => (userOf(req.ctx, req), listDuplicateTargets(req.ctx)));
  app.put<{ Params: { findingId: string }; Body: any }>('/duplicate-targets/:findingId', async (req) => setDuplicateTarget(req.ctx, req.params.findingId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<{ Params: { findingId: string } }>('/duplicate-targets/:findingId', async (req, reply) => {
    await removeDuplicateTarget(req.ctx, req.params.findingId, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });
}
