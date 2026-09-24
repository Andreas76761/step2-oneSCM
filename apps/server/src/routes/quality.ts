// Analyse, Befunde, Cluster, Canonical Topics (US-005, US-006, US-007)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import {
  createCanonicalTopic, decideFinding, getAnalysisRun, getFinding, listCanonicalTopics, listClusters, listFindings, mergeClusters, splitCluster, startAnalysis, updateCluster,
} from '../services/analysis.js';
import { num, userOf } from './helpers.js';

export function qualityRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.post('/quality/analysis', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    const run = await startAnalysis(req.ctx, user.id);
    reply.code(202).header('Location', `/api/v1/quality/analysis/${run.id}`);
    return run;
  });
  app.get<{ Params: { runId: string } }>('/quality/analysis/:runId', async (req) => (userOf(req.ctx, req), getAnalysisRun(req.ctx, req.params.runId)));
  app.get<{ Querystring: Record<string, string> }>('/quality/findings', async (req) => {
    userOf(req.ctx, req);
    const q = req.query;
    return listFindings(req.ctx, { type: q.type, severity: q.severity, status: q.status, chapterId: q.chapterId, minScore: num(q.minScore) });
  });
  app.get<{ Params: { findingId: string } }>('/quality/findings/:findingId', async (req) => (userOf(req.ctx, req), getFinding(req.ctx, req.params.findingId)));
  app.post<{ Params: { findingId: string }; Body: any }>('/quality/findings/:findingId/decision', async (req) => {
    const user = userOf(req.ctx, req, 'decide');
    return decideFinding(req.ctx, req.params.findingId, (req.body ?? {}) as any, user.id);
  });

  app.get<{ Querystring: { status?: string } }>('/clusters', async (req) => (userOf(req.ctx, req), listClusters(req.ctx, req.query.status)));
  app.patch<{ Params: { clusterId: string }; Body: any }>('/clusters/:clusterId', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return updateCluster(req.ctx, req.params.clusterId, (req.body ?? {}) as any, user.id);
  });
  app.post<{ Params: { clusterId: string }; Body: { clusterIds: string[] } }>('/clusters/:clusterId/merge', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return mergeClusters(req.ctx, req.params.clusterId, req.body?.clusterIds ?? [], user.id);
  });
  app.post<{ Params: { clusterId: string }; Body: { snippetIds: string[]; name?: string } }>('/clusters/:clusterId/split', async (req) => {
    const user = userOf(req.ctx, req, 'edit');
    return splitCluster(req.ctx, req.params.clusterId, req.body?.snippetIds ?? [], req.body?.name, user.id);
  });
  app.get('/canonical-topics', async (req) => (userOf(req.ctx, req), listCanonicalTopics(req.ctx)));
  app.post<{ Body: any }>('/canonical-topics', async (req, reply) => {
    const user = userOf(req.ctx, req, 'decide');
    reply.code(201);
    return createCanonicalTopic(req.ctx, (req.body ?? {}) as any, user.id);
  });
}
