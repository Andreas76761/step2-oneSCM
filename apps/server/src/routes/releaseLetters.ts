// Release-Abgleich und Releaseletter aus Jira-Tickets (ADR-083, F-02, F-03)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import {
  approveReleaseLetter, createReleaseLetter, deleteReleaseLetter, exportReleaseLetter, getReleaseLetter, importReleaseLetter, listReleaseLetters,
  listTicketReleases, matchTicketList, updateReleaseLetter,
} from '../services/releaseLetters.js';
import { userOf } from './helpers.js';

type P = { Params: { letterId: string } };

export function releaseLetterRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<{ Querystring: { release?: string } }>('/ticket-releases', async (req) => (userOf(req.ctx, req), listTicketReleases(req.ctx, { release: req.query.release || undefined })));
  app.post<{ Body: any }>('/ticket-releases/match', async (req) => (userOf(req.ctx, req), matchTicketList(req.ctx, req.body ?? {})));

  app.get('/release-letters', async (req) => (userOf(req.ctx, req), listReleaseLetters(req.ctx)));
  app.post<{ Body: any }>('/release-letters', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createReleaseLetter(req.ctx, req.body ?? {}, user);
  });
  app.post<{ Body: any }>('/release-letters/import', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return importReleaseLetter(req.ctx, req.body ?? {}, user);
  });
  app.get<P>('/release-letters/:letterId', async (req) => (userOf(req.ctx, req), getReleaseLetter(req.ctx, req.params.letterId)));
  app.patch<P & { Body: any }>('/release-letters/:letterId', async (req) => updateReleaseLetter(req.ctx, req.params.letterId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.post<P & { Body: any }>('/release-letters/:letterId/approve', async (req) => approveReleaseLetter(req.ctx, req.params.letterId, req.body ?? {}, userOf(req.ctx, req, 'approve')));
  app.delete<P>('/release-letters/:letterId', async (req, reply) => {
    await deleteReleaseLetter(req.ctx, req.params.letterId, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });
  app.get<P & { Querystring: { format?: string } }>('/release-letters/:letterId/export', async (req, reply) => {
    userOf(req.ctx, req);
    const f = await exportReleaseLetter(req.ctx, req.params.letterId, req.query.format ?? 'md');
    reply.header('Content-Type', f.contentType).header('Content-Disposition', `attachment; filename="${f.fileName}"`);
    return f.data;
  });
}
