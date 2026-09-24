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
import { Problem } from './problem.js';
import { chapterRoutes } from './routes/chapters.js';
import { miscRoutes } from './routes/misc.js';
import { qualityRoutes } from './routes/quality.js';
import { rewriteRoutes } from './routes/rewrite.js';
import { sourceRoutes } from './routes/sources.js';
import { terminologyRoutes } from './routes/terminology.js';
import { failAnalysisJob, runAnalysis } from './services/analysis.js';
import { failImportJob, runImportJob } from './services/imports.js';
import { seedTerminology } from './services/terminology.js';
import { LocalObjectStore, S3ObjectStore } from './storage.js';

/** Öffentliche Endpunkte ohne Anmeldung */
const PUBLIC_PATHS = new Set(['/api/v1/health', '/api/v1/auth/config']);

export interface BuildOptions {
  /** Jobqueue nicht starten (z. B. reine API-Instanz ohne Worker) */
  worker?: boolean;
}

export async function buildApp(overrides: Partial<AppConfig> = {}, options: BuildOptions = {}) {
  const config = loadConfig(overrides);
  const app = Fastify({ logger: config.logger ? { level: 'info' } : false, bodyLimit: 5 * 1024 * 1024 });
  const db = await openDb(config.database);
  await seedReferenceData(db, config.authMode);
  await seedTerminology(db, DEFAULT_PROJECT_ID);
  const jobs = new JobQueue(db, { onError: (type, err) => app.log.error({ err }, `Job ${type} fehlgeschlagen`) });
  const ctx: Ctx = {
    db,
    store: config.objectStore.kind === 's3' ? new S3ObjectStore(config.objectStore) : new LocalObjectStore(path.join(config.dataDir, 'objects')),
    jobs,
    config,
    llm: createProvider(config.llm),
    projectId: DEFAULT_PROJECT_ID,
    log: (msg, extra) => app.log.info(extra ?? {}, msg),
  };
  jobs.register('import', (p) => runImportJob(ctx, p), (p, err) => failImportJob(ctx, p, err));
  jobs.register('analysis', (p) => runAnalysis(ctx, p.runId).then(() => undefined), (p, err) => failAnalysisJob(ctx, p, err));
  if (options.worker !== false && process.env.JOB_WORKER !== '0') await jobs.start();

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
    reply.header('Content-Security-Policy', `default-src 'self'; connect-src 'self'${idp}; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; frame-ancestors 'none'`);
    return payload;
  });

  app.decorateRequest('user', null);
  await app.register(
    async (api) => {
      // Anmeldung für alle API-Endpunkte außer den öffentlichen (ENTSCHEIDUNG E-15)
      api.addHook('onRequest', async (req) => {
        if (PUBLIC_PATHS.has(req.url.split('?')[0])) return;
        req.user = await authenticate(ctx, req.headers);
      });
      api.get('/health', async () => ({ status: 'ok', database: db.dialect, auth: config.authMode, objectStore: ctx.store.kind, llm: ctx.llm?.id ?? 'none' }));
      sourceRoutes(api, ctx);
      qualityRoutes(api, ctx);
      chapterRoutes(api, ctx);
      miscRoutes(api, ctx);
      terminologyRoutes(api, ctx);
      rewriteRoutes(api, ctx);
    },
    { prefix: '/api/v1' },
  );

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
