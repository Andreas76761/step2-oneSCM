// Verteiltes Tracing mit OpenTelemetry (ADR-027). Nur aktiv, wenn ein Exporter eingerichtet ist
// (OTEL_EXPORTER_OTLP_ENDPOINT bzw. …_TRACES_ENDPOINT); sonst liefert die API No-op-Spans ohne Kosten.
// Spans: HTTP-Anfragen (mit W3C traceparent des Aufrufers), Datenbankabfragen, Jobs, KI- und Embedding-Aufrufe.
import { context, propagation, SpanKind, SpanStatusCode, trace, type Span, type Tracer } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchSpanProcessor, SimpleSpanProcessor, type SpanExporter } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import type { FastifyInstance } from 'fastify';
import type { Db } from './db.js';
import type { EmbeddingProvider } from './embeddings.js';
import type { LlmProvider } from './llm.js';

export interface TracingConfig {
  /** otlp: Export per OTLP/HTTP (Endpunkt aus den Standard-Umgebungsvariablen); none: aus */
  exporter: 'otlp' | 'none';
  serviceName: string;
}

export function tracingFromEnv(): TracingConfig {
  const enabled = !!(process.env.OTEL_EXPORTER_OTLP_ENDPOINT || process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT) && process.env.OTEL_SDK_DISABLED !== 'true';
  return { exporter: enabled ? 'otlp' : 'none', serviceName: process.env.OTEL_SERVICE_NAME || 'onescm-handbook-studio' };
}

let provider: NodeTracerProvider | null = null;

/** Tracing einrichten (einmal je Prozess). `exporter` für Tests (z. B. InMemorySpanExporter). */
export function initTracing(cfg: TracingConfig, exporter?: SpanExporter) {
  if (provider || (cfg.exporter === 'none' && !exporter)) return provider;
  provider = new NodeTracerProvider({
    resource: resourceFromAttributes({ 'service.name': cfg.serviceName, 'service.version': process.env.npm_package_version ?? '0.9.0' }),
    spanProcessors: [exporter ? new SimpleSpanProcessor(exporter) : new BatchSpanProcessor(new OTLPTraceExporter())],
  });
  provider.register({ propagator: new W3CTraceContextPropagator() });
  return provider;
}

export async function shutdownTracing() {
  await provider?.shutdown();
  provider = null;
  trace.disable();
  propagation.disable();
  context.disable();
}

export const tracer = (): Tracer => trace.getTracer('onescm');
export const tracingActive = () => provider !== null;

/** Funktion in einem Span ausführen; Fehler werden am Span vermerkt */
export async function withSpan<T>(name: string, attributes: Record<string, string | number | boolean | undefined>, fn: (span: Span) => Promise<T>, kind = SpanKind.INTERNAL): Promise<T> {
  if (!provider) return fn(trace.wrapSpanContext({ traceId: '', spanId: '', traceFlags: 0 }));
  return tracer().startActiveSpan(name, { kind, attributes: clean(attributes) }, async (span) => {
    try {
      return await fn(span);
    } catch (e) {
      span.recordException(e as Error);
      span.setStatus({ code: SpanStatusCode.ERROR, message: (e as Error).message });
      throw e;
    } finally {
      span.end();
    }
  });
}

function clean(a: Record<string, string | number | boolean | undefined>) {
  return Object.fromEntries(Object.entries(a).filter(([, v]) => v !== undefined)) as Record<string, string | number | boolean>;
}

/** HTTP-Serverspans: Kontext des Aufrufers übernehmen, Span für Hooks und Handler aktiv setzen, Trace-ID zurückgeben */
export function registerTracing(app: FastifyInstance) {
  if (!provider) return;
  const spans = new WeakMap<object, Span>();
  app.addHook('onRequest', (req, reply, done) => {
    const parent = propagation.extract(context.active(), req.headers);
    const route = req.routeOptions?.url ?? req.url.split('?')[0];
    const span = tracer().startSpan(`${req.method} ${route}`, {
      kind: SpanKind.SERVER,
      attributes: { 'http.request.method': req.method, 'url.path': req.url.split('?')[0], 'http.route': route, 'request.id': String(req.id) },
    }, parent);
    spans.set(req, span);
    reply.header('X-Trace-Id', span.spanContext().traceId);
    // done() im Span-Kontext aufrufen: weitere Hooks und der Handler laufen darin (AsyncLocalStorage)
    context.with(trace.setSpan(parent, span), done);
  });
  app.addHook('onResponse', async (req, reply) => {
    const span = spans.get(req);
    if (!span) return;
    span.setAttribute('http.response.status_code', reply.statusCode);
    if (req.globalUser?.id) span.setAttribute('enduser.id', req.globalUser.id);
    if (req.ctx?.projectId) span.setAttribute('onescm.project', req.ctx.projectId);
    if (reply.statusCode >= 500) span.setStatus({ code: SpanStatusCode.ERROR });
    span.end();
  });
}

/** Datenbankabfragen als Client-Spans (Anweisung ohne Parameterwerte, gekürzt) */
export function traceDb(db: Db): Db {
  if (!provider) return db;
  const wrap = <A extends unknown[], R>(op: string, fn: (sql: string, ...a: A) => Promise<R>) => (sql: string, ...a: A) =>
    withSpan(`db ${sql.trimStart().split(/\s+/, 1)[0].toUpperCase()}`, { 'db.system.name': db.dialect === 'postgres' ? 'postgresql' : 'sqlite', 'db.operation.name': op, 'db.query.text': sql.replace(/\s+/g, ' ').slice(0, 500) },
      () => fn.call(db, sql, ...a), SpanKind.CLIENT);
  return new Proxy(db, {
    get(target, prop, receiver) {
      if (prop === 'all' || prop === 'get' || prop === 'run') return wrap(prop, (target as any)[prop]);
      const v = Reflect.get(target, prop, receiver);
      return typeof v === 'function' ? v.bind(target) : v;
    },
  });
}

/** KI-Aufrufe als Client-Spans (Anbieter, Modell, Tokens; keine Inhalte) */
export function traceLlm(p: LlmProvider | null): LlmProvider | null {
  if (!p || !provider) return p;
  return {
    id: p.id, model: p.model, external: p.external,
    complete: (req) => withSpan('gen_ai.complete', { 'gen_ai.system': p.id, 'gen_ai.request.model': p.model }, async (span) => {
      const res = await p.complete(req);
      if (res.usage?.inputTokens !== undefined) span.setAttribute('gen_ai.usage.input_tokens', res.usage.inputTokens);
      if (res.usage?.outputTokens !== undefined) span.setAttribute('gen_ai.usage.output_tokens', res.usage.outputTokens);
      return res;
    }, SpanKind.CLIENT),
  };
}

export function traceEmbeddings(p: EmbeddingProvider): EmbeddingProvider {
  if (!provider) return p;
  return { id: p.id, model: p.model, external: p.external, embed: (texts) => withSpan('gen_ai.embeddings', { 'gen_ai.system': p.id, 'gen_ai.request.model': p.model, 'onescm.texts': texts.length }, () => p.embed(texts), SpanKind.CLIENT) };
}
