// Integrationen (ADR-028): API-Tokens und ausgehende Webhooks je Projekt (Berechtigung admin)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { WEBHOOK_EVENTS } from '../context.js';
import { createToken, listTokens, revokeToken } from '../services/tokens.js';
import { createWebhook, deleteWebhook, listDeliveries, listWebhooks, pingWebhook, redeliver, updateWebhook } from '../services/webhooks.js';
import { userOf } from './helpers.js';

export function integrationRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/api-tokens', async (req) => (userOf(req.ctx, req, 'admin'), listTokens(req.ctx)));
  app.post<{ Body: any }>('/api-tokens', async (req, reply) => {
    const user = userOf(req.ctx, req, 'admin');
    reply.code(201);
    return createToken(req.ctx, req.body ?? {}, user);
  });
  app.delete<{ Params: { tokenId: string } }>('/api-tokens/:tokenId', async (req) => revokeToken(req.ctx, req.params.tokenId, userOf(req.ctx, req, 'admin')));

  app.get('/webhooks', async (req) => (userOf(req.ctx, req, 'admin'), { events: WEBHOOK_EVENTS, items: await listWebhooks(req.ctx) }));
  app.post<{ Body: any }>('/webhooks', async (req, reply) => {
    const user = userOf(req.ctx, req, 'admin');
    reply.code(201);
    return createWebhook(req.ctx, req.body ?? {}, user);
  });
  app.patch<{ Params: { webhookId: string }; Body: any }>('/webhooks/:webhookId', async (req) => updateWebhook(req.ctx, req.params.webhookId, req.body ?? {}, userOf(req.ctx, req, 'admin')));
  app.delete<{ Params: { webhookId: string } }>('/webhooks/:webhookId', async (req, reply) => {
    await deleteWebhook(req.ctx, req.params.webhookId, userOf(req.ctx, req, 'admin'));
    reply.code(204);
  });
  app.get<{ Params: { webhookId: string } }>('/webhooks/:webhookId/deliveries', async (req) => (userOf(req.ctx, req, 'admin'), listDeliveries(req.ctx, req.params.webhookId)));
  app.post<{ Params: { webhookId: string } }>('/webhooks/:webhookId/ping', async (req, reply) => {
    reply.code(202);
    return pingWebhook(req.ctx, req.params.webhookId, userOf(req.ctx, req, 'admin'));
  });
  app.post<{ Params: { deliveryId: string } }>('/webhook-deliveries/:deliveryId/redeliver', async (req, reply) => {
    userOf(req.ctx, req, 'admin');
    reply.code(202);
    return redeliver(req.ctx, req.params.deliveryId);
  });
}
