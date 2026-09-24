// Analytik und Berichte (ADR-023)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { analyticsOverview, dataset, projectReport, toCsv } from '../services/analytics.js';
import { badRequest } from '../problem.js';
import { userOf } from './helpers.js';

type Range = { Querystring: { from?: string; to?: string } };

export function analyticsRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<Range>('/analytics', async (req) => (userOf(req.ctx, req), analyticsOverview(req.ctx, req.query.from, req.query.to)));
  app.get<Range>('/analytics/report', async (req, reply) => {
    userOf(req.ctx, req);
    const pdf = await projectReport(req.ctx, req.query.from, req.query.to);
    reply.header('Content-Type', 'application/pdf').header('Content-Disposition', `attachment; filename="projektbericht-${new Date().toISOString().slice(0, 10)}.pdf"`);
    return pdf;
  });
  // BI-Export: stabile Spaltennamen, CSV oder JSON – für Power BI, Excel, Tableau o. Ä.
  app.get<{ Params: { dataset: string }; Querystring: { from?: string; to?: string; format?: string } }>('/analytics/export/:dataset', async (req, reply) => {
    userOf(req.ctx, req);
    const format = req.query.format ?? 'csv';
    if (!['csv', 'json'].includes(format)) throw badRequest('format muss csv oder json sein.');
    const rows = await dataset(req.ctx, req.params.dataset, req.query.from, req.query.to);
    if (format === 'json') return { dataset: req.params.dataset, projectId: req.ctx.projectId, generatedAt: new Date().toISOString(), rows };
    reply.header('Content-Type', 'text/csv; charset=utf-8').header('Content-Disposition', `attachment; filename="${req.params.dataset}.csv"`);
    return toCsv(rows);
  });
}
