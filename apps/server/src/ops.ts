// Betrieb (ADR-015): Request-ID, Health-Checks, Prometheus-Metriken und Rate-Limiting.
import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { collectDefaultMetrics, Counter, Gauge, Histogram, Registry } from 'prom-client';
import type { Ctx } from './context.js';
import { Problem } from './problem.js';

export interface OpsConfig {
  /** Bearer-Token für /metrics; ohne Token sind Metriken nur mit globaler Berechtigung „admin“ abrufbar */
  metricsToken: string | null;
  /** Anfragen je Benutzer (bzw. IP) und Minute; 0 = aus */
  rateLimitMax: number;
  /** Anfragen je Minute für aufwendige Aktionen (Import, Analyse, Export, KI) */
  rateLimitExpensiveMax: number;
}

export function opsFromEnv(): OpsConfig {
  return {
    metricsToken: process.env.METRICS_TOKEN || null,
    rateLimitMax: Number(process.env.RATE_LIMIT_MAX ?? 1200),
    rateLimitExpensiveMax: Number(process.env.RATE_LIMIT_EXPENSIVE_MAX ?? 60),
  };
}

/** Request-ID übernehmen (X-Request-Id, sonst neu), damit Logs über Proxy und Dienst hinweg zusammenpassen. */
export function requestId(req: { headers: Record<string, string | string[] | undefined> }) {
  const h = req.headers['x-request-id'];
  const v = Array.isArray(h) ? h[0] : h;
  return v && /^[\w.:-]{1,128}$/.test(v) ? v : randomUUID();
}

/** Aufwendige Aktionen mit eigenem, engerem Limit */
const EXPENSIVE: [string, RegExp][] = [
  ['POST', /^\/api\/v1\/imports$/],
  ['POST', /^\/api\/v1\/quality\/analysis$/],
  ['POST', /^\/api\/v1\/exports$/],
  ['POST', /^\/api\/v1\/content-blocks\/[^/]+\/rewrite-proposals$/],
  ['POST', /^\/api\/v1\/chapter-versions\/[^/]+\/rewrite-jobs$/],
  ['POST', /^\/api\/v1\/semantic-index$/],
  ['GET', /^\/api\/v1\/search\/semantic$/],
];
const isExpensive = (req: FastifyRequest) => EXPENSIVE.some(([m, re]) => req.method === m && re.test(req.url.split('?')[0]));

export async function registerOps(app: FastifyInstance, ctx: Ctx, ops: OpsConfig, isAdmin: (req: FastifyRequest) => Promise<boolean>) {
  const registry = new Registry();
  collectDefaultMetrics({ register: registry, prefix: 'onescm_' });
  const requests = new Counter({ name: 'onescm_http_requests_total', help: 'HTTP-Anfragen', labelNames: ['method', 'route', 'status'], registers: [registry] });
  const duration = new Histogram({
    name: 'onescm_http_request_duration_seconds', help: 'Dauer der HTTP-Anfragen', labelNames: ['method', 'route'],
    buckets: [0.005, 0.02, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10], registers: [registry],
  });
  const limited = new Counter({ name: 'onescm_rate_limited_total', help: 'Wegen Rate-Limit abgelehnte Anfragen', labelNames: ['kind'], registers: [registry] });
  // Fachliche Kennzahlen beim Abruf aus der Datenbank (gelten für alle Instanzen gemeinsam)
  new Gauge({
    name: 'onescm_jobs', help: 'Jobs in der persistenten Queue nach Typ und Status', labelNames: ['type', 'status'], registers: [registry],
    async collect() {
      this.reset();
      for (const r of await ctx.db.all<{ type: string; status: string; n: number }>('SELECT type, status, COUNT(*) AS n FROM jobs GROUP BY type, status')) this.set({ type: r.type, status: r.status }, Number(r.n));
    },
  });
  new Gauge({
    name: 'onescm_projects', help: 'Projekte (aktiv/archiviert)', labelNames: ['state'], registers: [registry],
    async collect() {
      this.reset();
      const r = await ctx.db.get<{ active: number; archived: number }>('SELECT SUM(CASE WHEN archived_at IS NULL THEN 1 ELSE 0 END) AS active, SUM(CASE WHEN archived_at IS NULL THEN 0 ELSE 1 END) AS archived FROM projects');
      this.set({ state: 'active' }, Number(r?.active ?? 0));
      this.set({ state: 'archived' }, Number(r?.archived ?? 0));
    },
  });
  new Gauge({
    name: 'onescm_rewrite_proposals', help: 'KI-Umformulierungsvorschläge nach Status', labelNames: ['status'], registers: [registry],
    async collect() {
      this.reset();
      for (const r of await ctx.db.all<{ status: string; n: number }>('SELECT status, COUNT(*) AS n FROM rewrite_proposals GROUP BY status')) this.set({ status: r.status }, Number(r.n));
    },
  });

  app.addHook('onResponse', async (req, reply) => {
    const route = req.routeOptions.url ?? 'unmatched';
    if (route === '/metrics') return;
    requests.inc({ method: req.method, route, status: String(reply.statusCode) });
    duration.observe({ method: req.method, route }, reply.elapsedTime / 1000);
  });

  if (ops.rateLimitMax > 0) {
    await app.register(rateLimit, {
      global: true,
      hook: 'preHandler', // nach der Anmeldung: Limit je Benutzer statt je IP
      timeWindow: 60_000,
      max: (req) => (isExpensive(req) ? ops.rateLimitExpensiveMax : ops.rateLimitMax),
      keyGenerator: (req) => `${isExpensive(req) ? 'x' : 'n'}:${req.globalUser?.id ?? req.ip}`,
      allowList: (req) => ['/api/v1/health', '/api/v1/health/live', '/api/v1/health/ready', '/metrics'].includes(req.url.split('?')[0]),
      errorResponseBuilder: (req, c) => {
        limited.inc({ kind: isExpensive(req) ? 'expensive' : 'normal' });
        return new Problem(429, 'Too Many Requests', `Zu viele Anfragen – bitte nach ${Math.ceil(c.ttl / 1000)} s erneut versuchen.`);
      },
    });
  }

  app.get('/metrics', { config: { rateLimit: false } }, async (req, reply) => {
    const auth = req.headers.authorization ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    const tokenOk = !!ops.metricsToken && token.length === ops.metricsToken.length && timingSafeEqual(Buffer.from(token), Buffer.from(ops.metricsToken));
    if (!tokenOk && !(await isAdmin(req))) {
      reply.header('WWW-Authenticate', 'Bearer');
      throw new Problem(401, 'Unauthorized', 'Metriken erfordern METRICS_TOKEN oder die Berechtigung „admin“.');
    }
    reply.type(registry.contentType);
    return registry.metrics();
  });

  return { registry };
}

/** Readiness: Datenbank erreichbar, Object-Store erreichbar, Jobqueue läuft (falls Worker). */
export async function readiness(ctx: Ctx, workerExpected: boolean) {
  const checks: Record<string, { ok: boolean; detail?: string; ms: number }> = {};
  const probe = async (name: string, fn: () => Promise<unknown>) => {
    const t = Date.now();
    try {
      await fn();
      checks[name] = { ok: true, ms: Date.now() - t };
    } catch (e) {
      checks[name] = { ok: false, detail: (e as Error).message.slice(0, 200), ms: Date.now() - t };
    }
  };
  await probe('database', () => ctx.db.get('SELECT 1 AS ok'));
  await probe('objectStore', () => ctx.store.exists('health/probe'));
  if (workerExpected) {
    await probe('jobQueue', async () => {
      if (!ctx.jobs.running) throw new Error('Jobqueue gestoppt');
    });
  }
  return { ready: Object.values(checks).every((c) => c.ok), checks };
}
