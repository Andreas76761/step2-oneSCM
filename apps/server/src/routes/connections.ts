// Git-Quellverbindungen (ADR-022): Verwaltung durch Administration, Abgleich durch Redaktion
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { createConnection, deleteConnection, getConnection, handlePushWebhook, listConnections, requestSync, updateConnection, type ConnectionInput } from '../services/connections.js';
import { userOf } from './helpers.js';

export function connectionRoutes(app: FastifyInstance, ctx: Ctx) {
  // Push-Webhook (ADR-028): öffentlich, Prüfung über das Geheimnis der Verbindung; Rumpf roh für die HMAC-Signatur
  void app.register(async (hooks) => {
    hooks.addContentTypeParser(['application/json', 'application/x-www-form-urlencoded'], { parseAs: 'string' }, (_req, body, done) => done(null, body));
    hooks.post<{ Params: { hookConnectionId: string }; Body: string }>('/hooks/source-connections/:hookConnectionId', async (req, reply) => {
      const raw = typeof req.body === 'string' ? req.body : '';
      // GitHub sendet bei application/x-www-form-urlencoded das JSON im Feld „payload“
      const body = req.headers['content-type']?.includes('urlencoded') ? new URLSearchParams(raw).get('payload') ?? '' : raw;
      // Signatur über den Rohrumpf, Auswertung des (ggf. aus dem Formularfeld gelösten) JSON
      const res = await handlePushWebhook(ctx, req.params.hookConnectionId, req.headers, raw, body);
      reply.code(res.status === 'queued' ? 202 : 200);
      return res;
    });
  });

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
