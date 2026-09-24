// Git-Quellverbindungen (ADR-022): Verwaltung durch Administration, Abgleich durch Redaktion
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { createConnection, deleteConnection, getConnection, listConnections, requestSync, updateConnection, type ConnectionInput } from '../services/connections.js';
import { userOf } from './helpers.js';

export function connectionRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/source-connections', async (req) => (userOf(req.ctx, req), listConnections(req.ctx)));
  app.post<{ Body: ConnectionInput }>('/source-connections', async (req, reply) => {
    const user = userOf(req.ctx, req, 'admin');
    reply.code(201);
    return createConnection(req.ctx, req.body ?? {}, user.id);
  });
  app.get<{ Params: { connectionId: string } }>('/source-connections/:connectionId', async (req) => (userOf(req.ctx, req), getConnection(req.ctx, req.params.connectionId)));
  app.patch<{ Params: { connectionId: string }; Body: ConnectionInput }>('/source-connections/:connectionId', async (req) => {
    const user = userOf(req.ctx, req, 'admin');
    return updateConnection(req.ctx, req.params.connectionId, req.body ?? {}, user.id);
  });
  app.delete<{ Params: { connectionId: string } }>('/source-connections/:connectionId', async (req, reply) => {
    const user = userOf(req.ctx, req, 'admin');
    await deleteConnection(req.ctx, req.params.connectionId, user.id);
    reply.code(204);
  });
  app.post<{ Params: { connectionId: string }; Body: { force?: boolean } }>('/source-connections/:connectionId/sync', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(202);
    return requestSync(req.ctx, req.params.connectionId, user.id, !!req.body?.force);
  });
}
