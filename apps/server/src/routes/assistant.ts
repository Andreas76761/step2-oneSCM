// Handbuch-Assistent (ADR-026)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { ask, openQuestions, rateAnswer, type AskInput } from '../services/assistant.js';
import { num, userOf } from './helpers.js';

export function assistantRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.post<{ Body: AskInput }>('/assistant/ask', async (req) => {
    const user = userOf(req.ctx, req);
    return ask(req.ctx, req.body ?? {}, user);
  });
  app.post<{ Params: { answerId: string }; Body: { helpful?: boolean; comment?: string } }>('/assistant/answers/:answerId/feedback', async (req) => {
    const user = userOf(req.ctx, req);
    return rateAnswer(req.ctx, req.params.answerId, req.body ?? {}, user);
  });
  app.get<{ Querystring: { limit?: string } }>('/assistant/open-questions', async (req) => {
    userOf(req.ctx, req, 'edit');
    return openQuestions(req.ctx, num(req.query.limit));
  });
}
