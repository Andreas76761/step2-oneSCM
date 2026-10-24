// Update-Eingang (ADR-081, F-05): geänderte Quellen absatzweise übernehmen
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { applySourceUpdate, listSourceUpdates } from '../services/sourceUpdates.js';
import { userOf } from './helpers.js';

export function sourceUpdateRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/source-updates', async (req) => (userOf(req.ctx, req), listSourceUpdates(req.ctx)));
  app.post<{ Body: any }>('/source-updates/decisions', async (req) => applySourceUpdate(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'edit')));
}
