// Übergang „weiter zu Kapitel …“ (ADR-085, F-29)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { deleteTransition, getTransition, listTransitions, setTransition } from '../services/transitions.js';
import { userOf } from './helpers.js';

type P = { Params: { chapterId: string } };

export function transitionRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/chapter-transitions', async (req) => (userOf(req.ctx, req), listTransitions(req.ctx)));
  app.get<P>('/chapter-transitions/:chapterId', async (req) => (userOf(req.ctx, req), getTransition(req.ctx, req.params.chapterId)));
  app.put<P & { Body: any }>('/chapter-transitions/:chapterId', async (req) => setTransition(req.ctx, req.params.chapterId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<P>('/chapter-transitions/:chapterId', async (req) => deleteTransition(req.ctx, req.params.chapterId, userOf(req.ctx, req, 'edit')));
}
