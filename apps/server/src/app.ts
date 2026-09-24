// HTTP-Anwendung (ADR-002). Basispfad /api/v1, Fehler als application/problem+json.
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import Fastify from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import { loadConfig, type AppConfig } from './config.js';
import { DEFAULT_PROJECT_ID, seedReferenceData, type Ctx } from './context.js';
import { Db } from './db.js';
import { JobQueue } from './jobs.js';
import { Problem } from './problem.js';
import { chapterRoutes } from './routes/chapters.js';
import { miscRoutes } from './routes/misc.js';
import { qualityRoutes } from './routes/quality.js';
import { sourceRoutes } from './routes/sources.js';
import { LocalObjectStore } from './storage.js';

export async function buildApp(overrides: Partial<AppConfig> = {}) {
  const config = loadConfig(overrides);
  const app = Fastify({ logger: config.logger ? { level: 'info' } : false, bodyLimit: 5 * 1024 * 1024 });
  const db = new Db(config.dbPath);
  seedReferenceData(db);
  const ctx: Ctx = {
    db,
    store: new LocalObjectStore(path.join(config.dataDir, 'objects')),
    jobs: new JobQueue((name, err) => app.log.error({ err }, `Job ${name} fehlgeschlagen`)),
    config,
    projectId: DEFAULT_PROJECT_ID,
    log: (msg, extra) => app.log.info(extra ?? {}, msg),
  };

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
    reply.code(problem.status).type('application/problem+json').send(JSON.stringify({ ...problem.toJSON(), instance: req.url }));
  });

  // Sicherheitsheader: keine Skriptausführung aus Inhalten (§13)
  app.addHook('onSend', async (_req, reply, payload) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('Referrer-Policy', 'no-referrer');
    reply.header('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; object-src 'none'; frame-ancestors 'none'");
    return payload;
  });

  await app.register(
    async (api) => {
      api.get('/health', async () => ({ status: 'ok' }));
      sourceRoutes(api, ctx);
      qualityRoutes(api, ctx);
      chapterRoutes(api, ctx);
      miscRoutes(api, ctx);
    },
    { prefix: '/api/v1' },
  );

  app.get('/openapi.yaml', async (_req, reply) => reply.type('application/yaml').send(fs.readFileSync(config.openapiPath, 'utf8')));

  if (config.webDist && fs.existsSync(path.join(config.webDist, 'index.html'))) {
    await app.register(fastifyStatic, { root: config.webDist, wildcard: false });
    app.setNotFoundHandler((req, reply) => {
      if (req.url.startsWith('/api/')) {
        reply.code(404).type('application/problem+json').send(JSON.stringify(new Problem(404, 'Not Found', `Pfad ${req.url} existiert nicht.`).toJSON()));
      } else reply.sendFile('index.html');
    });
  } else {
    app.setNotFoundHandler((req, reply) => {
      reply.code(404).type('application/problem+json').send(JSON.stringify(new Problem(404, 'Not Found', `Pfad ${req.url} existiert nicht.`).toJSON()));
    });
  }

  app.addHook('onClose', async () => {
    await ctx.jobs.idle();
    db.close();
  });
  return { app, ctx };
}
