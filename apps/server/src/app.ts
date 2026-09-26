// HTTP-Anwendung (ADR-002). Basispfad /api/v1, Fehler als application/problem+json.
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import { authenticate } from './auth.js';
import { loadConfig, type AppConfig } from './config.js';
import { DEFAULT_PROJECT_ID, seedReferenceData, type Ctx } from './context.js';
import { openDb } from './db.js';
import { JobQueue } from './jobs.js';
import { createProvider } from './llm.js';
import { createEmbeddingProvider } from './embeddings.js';
import { Notifier } from './notify.js';
import { readiness, registerOps, requestId } from './ops.js';
import { Problem } from './problem.js';
import { chapterRoutes } from './routes/chapters.js';
import { projectRoutes } from './routes/projects.js';
import { semanticRoutes } from './routes/semantic.js';
import { releaseRoutes } from './routes/releases.js';
import { collaborationRoutes } from './routes/collaboration.js';
import { translationRoutes } from './routes/translations.js';
import { failMachineTranslation, runMachineTranslation } from './services/translations.js';
import { deliverNotification } from './services/collaboration.js';
import { runIndexJob } from './services/semantic.js';
import { failSync, runSync } from './services/connections.js';
import { connectionRoutes } from './routes/connections.js';
import { analyticsRoutes } from './routes/analytics.js';
import { assistantRoutes } from './routes/assistant.js';
import { integrationRoutes } from './routes/integrations.js';
import { contextHelpRoutes, publicHelpRoutes } from './routes/contextHelp.js';
import { masterDataRoutes } from './routes/masterData.js';
import { styleRoutes } from './routes/style.js';
import { APP_VERSION } from './version.js';
import { deliverWebhook, failWebhookDelivery } from './services/webhooks.js';
import { ensureDailyJob, runDailySnapshots } from './services/analytics.js';
import { ensureEscalationJob, escalateOverdue } from './services/workflow.js';
import { ensurePlanReminderJob, remindOverduePlans } from './services/outlines.js';
import { miscRoutes } from './routes/misc.js';
import { qualityRoutes } from './routes/quality.js';
import { rewriteRoutes } from './routes/rewrite.js';
import { sourceRoutes } from './routes/sources.js';
import { terminologyRoutes } from './routes/terminology.js';
import { failAnalysisJob, runAnalysis } from './services/analysis.js';
import { failImportJob, runImportJob } from './services/imports.js';
import { failBatch, runBatch } from './services/rewriteBatch.js';
import { assertParamsInProject, resolveProject, withProject } from './services/projects.js';
import { seedTerminology } from './services/terminology.js';
import { createObjectStore } from './storage.js';
import { initTracing, registerTracing, traceDb, traceEmbeddings, traceLlm } from './tracing.js';

/** Öffentliche Endpunkte ohne Anmeldung */
const PUBLIC_PATHS = new Set(['/api/v1/health', '/api/v1/health/live', '/api/v1/health/ready', '/api/v1/auth/config']);

export interface BuildOptions {
  /** Jobqueue nicht starten (z. B. reine API-Instanz ohne Worker) */
  worker?: boolean;
}

export async function buildApp(overrides: Partial<AppConfig> = {}, options: BuildOptions = {}) {
  const config = loadConfig(overrides);
  initTracing(config.tracing);
  const app = Fastify({
    logger: config.logger ? { level: process.env.LOG_LEVEL ?? 'info' } : false,
    bodyLimit: 5 * 1024 * 1024,
    genReqId: requestId,
    trustProxy: process.env.TRUST_PROXY === '1',
  });
  const db = traceDb(await openDb(config.database));
  await seedReferenceData(db, config.authMode);
  await seedTerminology(db, DEFAULT_PROJECT_ID);
  const jobs = new JobQueue(db, { onError: (type, err) => app.log.error({ err }, `Job ${type} fehlgeschlagen`) });
  const ctx: Ctx = {
    db,
    store: createObjectStore(config.objectStore, config.dataDir),
    jobs,
    config,
    llm: traceLlm(createProvider(config.llm)),
    embeddings: traceEmbeddings(createEmbeddingProvider(config.embeddings)),
    notifier: new Notifier(config.notify),
    projectId: DEFAULT_PROJECT_ID,
    log: (msg, extra) => app.log.info(extra ?? {}, msg),
  };
  // Jobs laufen im Projekt ihres Imports bzw. Analyselaufs (ADR-014)
  const jobCtx = async (sql: string, id: string) => withProject(ctx, (await db.get<{ project_id: string }>(sql, id))?.project_id ?? DEFAULT_PROJECT_ID);
  const importCtx = (p: any) => jobCtx('SELECT project_id FROM imports WHERE id = ?', p.importId);
  const runCtx = (p: any) => jobCtx('SELECT project_id FROM analysis_runs WHERE id = ?', p.runId);
  // Archivierte Projekte sind nur lesbar: noch wartende Jobs werden als fehlgeschlagen beendet statt ausgeführt
  const ARCHIVED = 'Projekt ist archiviert – Job nicht ausgeführt.';
  const archived = async (c: Ctx) => !!(await db.get<{ archived_at: string | null }>('SELECT archived_at FROM projects WHERE id = ?', c.projectId))?.archived_at;
  jobs.register('import', async (p) => {
    const c = await importCtx(p);
    if (await archived(c)) return failImportJob(c, p, ARCHIVED);
    await runImportJob(c, p);
  }, async (p, err) => failImportJob(await importCtx(p), p, err));
  jobs.register('analysis', async (p) => {
    const c = await runCtx(p);
    if (await archived(c)) return failAnalysisJob(c, p, ARCHIVED);
    await runAnalysis(c, p.runId);
  }, async (p, err) => failAnalysisJob(await runCtx(p), p, err));
  const batchCtx = (p: any) => jobCtx(
    'SELECT c.project_id FROM rewrite_batches b JOIN generated_chapter_versions v ON v.id = b.chapter_version_id JOIN chapters c ON c.id = v.chapter_id WHERE b.id = ?', p.batchId,
  );
  const translationCtx = (p: any) => jobCtx('SELECT project_id FROM translations WHERE id = ?', p.translationId);
  jobs.register('translate', async (p) => {
    const c = await translationCtx(p);
    if (await archived(c)) return failMachineTranslation(c, p.translationId, ARCHIVED);
    await runMachineTranslation(c, p.translationId, p.actor);
  }, async (p, err) => failMachineTranslation(await translationCtx(p), p.translationId, err));
  jobs.register('notify', async (p) => deliverNotification(ctx, p.notificationId));
  jobs.register('semantic-index', async (p) => {
    const c = withProject(ctx, p.projectId);
    if (!(await archived(c))) await runIndexJob(c);
  });
  jobs.register('rewrite-batch', async (p) => {
    const c = await batchCtx(p);
    if (await archived(c)) return failBatch(c, p.batchId, ARCHIVED);
    await runBatch(c, p.batchId);
  }, async (p, err) => failBatch(await batchCtx(p), p.batchId, err));
  const connectionCtx = (p: any) => jobCtx('SELECT project_id FROM source_connections WHERE id = ?', p.connectionId);
  jobs.register('source-sync', async (p) => {
    const c = await connectionCtx(p);
    if (await archived(c)) return failSync(c, p, ARCHIVED);
    await runSync(c, p);
  }, async (p, err) => failSync(await connectionCtx(p), p, err));
  const deliveryCtx = (p: any) => jobCtx('SELECT s.project_id FROM webhook_deliveries d JOIN webhook_subscriptions s ON s.id = d.subscription_id WHERE d.id = ?', p.deliveryId);
  jobs.register('webhook-deliver', async (p) => deliverWebhook(await deliveryCtx(p), p), async (p, err) => failWebhookDelivery(await deliveryCtx(p), p, err));
  jobs.register('kpi-daily', async () => runDailySnapshots(ctx, (id) => withProject(ctx, id)), undefined, { background: true });
  jobs.register('approval-escalation', async () => {
    await escalateOverdue(ctx, (id) => withProject(ctx, id));
    await ensureEscalationJob(ctx, true);
  }, undefined, { background: true });
  jobs.register('plan-reminders', async () => {
    await remindOverduePlans(ctx, (id) => withProject(ctx, id));
    await ensurePlanReminderJob(ctx, true);
  }, undefined, { background: true });
  if (options.worker !== false && process.env.JOB_WORKER !== '0') {
    await ensureDailyJob(ctx);
    await ensureEscalationJob(ctx);
    await ensurePlanReminderJob(ctx);
    await jobs.start();
  }

  await app.register(multipart, { limits: { fileSize: 512 * 1024 * 1024, files: 1 } });

  app.setErrorHandler((err: any, req, reply) => {
    let problem: Problem;
    if (err instanceof Problem) problem = err;
    else if (err.validation) problem = new Problem(400, 'Bad Request', err.message);
    else if (err.code === 'FST_REQ_FILE_TOO_LARGE') problem = new Problem(413, 'Content Too Large', 'Datei zu groß.');
    else if (err.statusCode && err.statusCode < 500) problem = new Problem(err.statusCode, 'Bad Request', err.message);
    else {
      req.log.error(err);
      problem = new Problem(500, 'Internal Server Error', 'Unerwarteter Fehler.');
    }
    if (problem.status === 401) reply.header('WWW-Authenticate', 'Bearer');
    reply.code(problem.status).type('application/problem+json').send(JSON.stringify({ ...problem.toJSON(), instance: req.url }));
  });

  // Sicherheitsheader: keine Skriptausführung aus Inhalten (§13)
  app.addHook('onSend', async (_req, reply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('Referrer-Policy', 'no-referrer');
    const idp = config.oidc ? ` ${new URL(config.oidc.issuer).origin}` : '';
    // Routen mit eigener Richtlinie (Medien, eingebettete Kontexthilfe) behalten diese
    if (!reply.hasHeader('Content-Security-Policy')) reply.header('Content-Security-Policy', `default-src 'self'; connect-src 'self'${idp}; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; frame-ancestors 'none'`);
    return payload;
  });

  // Tracing (ADR-027): Serverspans mit Kontext des Aufrufers (W3C traceparent)
  registerTracing(app);

  // Betrieb: Request-ID in der Antwort, Metriken, Rate-Limiting (ADR-015)
  app.addHook('onRequest', async (req, reply) => {
    reply.header('X-Request-Id', req.id);
  });
  const workerExpected = options.worker !== false && process.env.JOB_WORKER !== '0';
  await registerOps(app, ctx, config.ops, async (req) => {
    try {
      return (await authenticate(ctx, req.headers)).permissions.includes('admin');
    } catch {
      return false;
    }
  });

  app.decorateRequest('user', null);
  app.decorateRequest('globalUser', null);
  app.decorateRequest('ctx', null as unknown as Ctx);
  await app.register(
    async (api) => {
      // Anmeldung für alle API-Endpunkte außer den öffentlichen (ENTSCHEIDUNG E-15)
      api.addHook('onRequest', async (req) => {
        req.ctx = ctx;
        const url = req.url.split('?')[0];
        // öffentlich: Health, Anmeldekonfiguration, eingehende Webhooks (eigene Signaturprüfung, ADR-028)
        if (PUBLIC_PATHS.has(url) || url.startsWith('/api/v1/hooks/')) return;
        const user = await authenticate(ctx, req.headers);
        req.globalUser = user;
        req.user = user;
        // Projektverwaltung arbeitet projektübergreifend mit globalen Berechtigungen – nicht für API-Tokens
        if (url === '/api/v1/projects' || url.startsWith('/api/v1/projects/') || url === '/api/v1/users' || url.startsWith('/api/v1/users/') || url === '/api/v1/role-templates' || url.startsWith('/api/v1/role-templates/')) {
          if (user.token) throw new Problem(403, 'Forbidden', 'API-Tokens haben keinen Zugriff auf die Projekt- und Benutzerverwaltung.');
          return;
        }
        const header = req.headers['x-project-id'];
        const scoped = await resolveProject(ctx, user, Array.isArray(header) ? header[0] : header);
        req.ctx = scoped.ctx;
        req.user = scoped.user;
        req.log = req.log.child({ userId: user.id, projectId: scoped.ctx.projectId });
      });
      // Mandantentrennung: IDs in Pfaden müssen zum Projekt der Anfrage gehören
      api.addHook('preHandler', async (req) => {
        await assertParamsInProject(req.ctx, req.params as Record<string, string>);
      });
      api.get('/health', async () => ({ status: 'ok', version: APP_VERSION, database: db.dialect, auth: config.authMode, objectStore: ctx.store.kind, llm: ctx.llm?.id ?? 'none' }));
      // Liveness: Prozess antwortet; Readiness: Abhängigkeiten erreichbar (für Load Balancer/Kubernetes)
      api.get('/health/live', async () => ({ status: 'ok' }));
      api.get('/health/ready', async (_req, reply) => {
        const r = await readiness(ctx, workerExpected);
        reply.code(r.ready ? 200 : 503);
        return r;
      });
      sourceRoutes(api, ctx);
      qualityRoutes(api, ctx);
      chapterRoutes(api, ctx);
      miscRoutes(api, ctx);
      terminologyRoutes(api, ctx);
      rewriteRoutes(api, ctx);
      projectRoutes(api, ctx);
      semanticRoutes(api, ctx);
      releaseRoutes(api, ctx);
      connectionRoutes(api, ctx);
      analyticsRoutes(api, ctx);
      assistantRoutes(api, ctx);
      integrationRoutes(api, ctx);
      contextHelpRoutes(api, ctx);
      masterDataRoutes(api, ctx);
      styleRoutes(api, ctx);
      collaborationRoutes(api, ctx);
      translationRoutes(api, ctx);
    },
    { prefix: '/api/v1' },
  );

  // Öffentliche Kontexthilfe (Widget, Einbettung) – eigene Freischaltung je Projekt (ADR-030)
  await publicHelpRoutes(app, ctx, config.help.embedOrigins);

  app.get('/openapi.yaml', async (_req, reply) => reply.type('application/yaml').send(fs.readFileSync(config.openapiPath, 'utf8')));

  const notFound = (url: string) => JSON.stringify(new Problem(404, 'Not Found', `Pfad ${url} existiert nicht.`).toJSON());
  if (config.webDist && fs.existsSync(path.join(config.webDist, 'index.html'))) {
    await app.register(fastifyStatic, { root: config.webDist, wildcard: false });
    app.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith('/api/')) reply.code(404).type('application/problem+json').send(notFound(req.url));
      else reply.sendFile('index.html');
    });
  } else {
    app.setNotFoundHandler((req, reply) => {
      reply.code(404).type('application/problem+json').send(notFound(req.url));
    });
  }

  app.addHook('onClose', async () => {
    await jobs.stop();
    await db.close();
  });
  return { app, ctx };
}
