// Eigene Testdatei: der Tracer wird prozessweit registriert (Vitest isoliert Dateien)
import fs from 'node:fs';
import { InMemorySpanExporter } from '@opentelemetry/sdk-trace-base';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { initTracing, shutdownTracing } from '../src/tracing.js';
import { FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Tracing (ADR-027)', () => {
  const dataDir = tempDir();
  afterAll(async () => {
    await shutdownTracing();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('[T-152] OpenTelemetry: Serverspan mit Kontext des Aufrufers, Datenbank-, Job- und KI-Spans, Trace-ID in der Antwort', async () => {
    const exporter = new InMemorySpanExporter();
    initTracing({ exporter: 'none', serviceName: 'onescm-test' }, exporter);
    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'tracing'), logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } });
    try {
      const traceId = '4bf92f3577b34da6a3ce929d0e0e4736';
      const res = await built.app.inject({ method: 'GET', url: '/api/v1/chapters', headers: { 'x-user-id': 'u-admin', traceparent: `00-${traceId}-00f067aa0ba902b7-01` } });
      expect(res.statusCode).toBe(200);
      expect(res.headers['x-trace-id']).toBe(traceId);
      const spans = exporter.getFinishedSpans();
      const server = spans.find((s) => s.name === 'GET /api/v1/chapters')!;
      expect(server).toBeTruthy();
      expect(server.spanContext().traceId).toBe(traceId); // Kontext des Aufrufers übernommen
      expect(server.parentSpanContext?.spanId).toBe('00f067aa0ba902b7');
      expect(server.attributes).toMatchObject({ 'http.request.method': 'GET', 'http.route': '/api/v1/chapters', 'http.response.status_code': 200, 'enduser.id': 'u-admin', 'onescm.project': 'p_default' });
      const dbSpans = spans.filter((s) => s.name.startsWith('db ') && s.spanContext().traceId === traceId);
      expect(dbSpans.length).toBeGreaterThan(0);
      expect(dbSpans.every((s) => s.parentSpanContext?.spanId === server.spanContext().spanId || spans.some((p) => p.spanContext().spanId === s.parentSpanContext?.spanId))).toBe(true);
      expect(String(dbSpans[0].attributes['db.query.text'])).not.toMatch(/u-admin/); // keine Parameterwerte

      // Job-Span (Import) und KI-Span (Übersetzung ist hier nicht nötig: Assistent mit Demo-KI)
      exporter.reset();
      await importFile(built, 'x.md', `${FM}# 1. X\n\n## 1.1 Zweck\n\nText.\n`);
      expect(exporter.getFinishedSpans().some((s) => s.name === 'job import' && s.attributes['job.type'] === 'import')).toBe(true);
      const kiRes = await built.ctx.llm!.complete({ system: 's', user: 'Answer. Input:\n<<<DATA\n{"question":"Text","passages":[{"id":"P1","text":"Text.","chapter":"X","section":"Zweck"}]}\nDATA>>>' });
      expect(kiRes.text).toContain('P1');
      expect(exporter.getFinishedSpans().find((s) => s.name === 'gen_ai.complete')?.attributes).toMatchObject({ 'gen_ai.system': 'demo', 'gen_ai.request.model': 'demo-extractive' });
      // Fehler: 5xx markiert den Span
      exporter.reset();
      await built.app.inject({ method: 'GET', url: '/api/v1/chapters/unbekannt', headers: { 'x-user-id': 'u-admin' } });
      expect(exporter.getFinishedSpans().find((s) => s.name === 'GET /api/v1/chapters/:chapterId')?.attributes['http.response.status_code']).toBe(404);
    } finally {
      await built.app.close();
    }
  });
});
