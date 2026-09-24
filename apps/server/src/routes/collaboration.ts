// Kollaboration: Kommentare, Aufgaben, Benachrichtigungen (ADR-019)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { collaborators, createComment, listComments, listNotifications, listTasks, markRead, updateComment } from '../services/collaboration.js';
import { userOf } from './helpers.js';

export function collaborationRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/collaborators', async (req) => (userOf(req.ctx, req), collaborators(req.ctx)));
  app.get<{ Querystring: { entityType?: string; entityId?: string } }>('/comments', async (req) => {
    userOf(req.ctx, req);
    return listComments(req.ctx, req.query.entityType ?? '', req.query.entityId ?? '');
  });
  app.post<{ Body: any }>('/comments', async (req, reply) => {
    const user = userOf(req.ctx, req, 'read');
    reply.code(201);
    return createComment(req.ctx, (req.body ?? {}) as any, user);
  });
  app.patch<{ Params: { commentId: string }; Body: any }>('/comments/:commentId', async (req) => {
    const user = userOf(req.ctx, req, 'read');
    return updateComment(req.ctx, req.params.commentId, (req.body ?? {}) as any, user);
  });
  app.get<{ Querystring: { assignee?: string; status?: string } }>('/tasks', async (req) => {
    const user = userOf(req.ctx, req);
    return listTasks(req.ctx, req.query, user);
  });
  app.get<{ Querystring: { unread?: string } }>('/notifications', async (req) => {
    const user = userOf(req.ctx, req);
    return listNotifications(req.ctx, user, req.query.unread === 'true');
  });
  app.post<{ Body: { ids?: string[] } }>('/notifications/read', async (req) => {
    const user = userOf(req.ctx, req);
    return markRead(req.ctx, user, req.body?.ids);
  });
}
