import fs from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { freshDatabase, tempDir } from './helpers.js';

const md = (title: string, text: string) => `---
roles: [all]
divisions: [all]
evidence_status: source_confirmed
---
# ${title}

## 1.1 Zweck

${text}
`;

function multipart(fileName: string, data: Buffer) {
  const boundary = '----onescm' + Math.random().toString(16).slice(2);
  const head = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`);
  return { payload: Buffer.concat([head, data, Buffer.from(`\r\n--${boundary}--\r\n`)]), headers: { 'content-type': `multipart/form-data; boundary=${boundary}` } };
}

describe('Mandanten/Projekte (ADR-014)', () => {
  const dataDir = tempDir();
  let built: Awaited<ReturnType<typeof buildApp>>;
  const call = async (method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', url: string, body?: unknown, user = 'u-admin', project?: string) => {
    const headers: Record<string, string> = { 'x-user-id': user };
    if (project) headers['x-project-id'] = project;
    const res = await built.app.inject({ method, url: `/api/v1${url}`, payload: body as any, headers });
    let json: any = null;
    try {
      json = res.json();
    } catch {
      /* kein JSON */
    }
    return { status: res.statusCode, json, body: res.body };
  };
  const importInto = async (project: string, name: string, content: string) => {
    const mp = multipart(name, Buffer.from(content));
    const res = await built.app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp.payload, headers: { ...mp.headers, 'x-user-id': 'u-admin', 'x-project-id': project } });
    expect(res.statusCode).toBe(202);
    await built.ctx.jobs.idle();
  };

  beforeAll(async () => {
    built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'projekte'), logger: false, webDist: null, authMode: 'demo' });
  });
  afterAll(async () => {
    await built.app.close();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('[T-132] Projekte anlegen; Daten, Jobs, Audit und IDs sind je Projekt getrennt', async () => {
    // Nur die Administration legt Projekte an
    expect((await call('POST', '/projects', { name: 'Werkstatt' }, 'u-redaktion')).status).toBe(403);
    const created = await call('POST', '/projects', { name: 'Werkstatt-Handbuch', description: 'After Sales', visibility: 'open' });
    expect(created.status).toBe(201);
    const B = created.json.id;
    expect(created.json).toMatchObject({ name: 'Werkstatt-Handbuch', visibility: 'open', myPermissions: expect.arrayContaining(['admin']) });
    expect((await call('POST', '/projects', { name: 'werkstatt-handbuch' })).status).toBe(409);
    // Terminologie-Startbestand je Projekt
    expect((await call('GET', '/terminology', undefined, 'u-admin', B)).json.length).toBeGreaterThan(0);

    await importInto('p_default', 'a.md', md('1. Verkauf', 'Im Projekt A wird der Verkauf beschrieben.'));
    await importInto(B, 'b.md', md('1. Werkstatt', 'Im Projekt B wird die Werkstatt beschrieben.'));
    const chA = (await call('GET', '/chapters')).json;
    const chB = (await call('GET', '/chapters', undefined, 'u-admin', B)).json;
    expect(chA.map((c: any) => c.title)).toEqual(['1. Verkauf']);
    expect(chB.map((c: any) => c.title)).toEqual(['1. Werkstatt']);
    expect((await call('GET', '/sources', undefined, 'u-admin', B)).json.map((s: any) => s.path)).toEqual(['b.md']);
    expect((await call('GET', '/snippets?q=Werkstatt')).json.items ?? (await call('GET', '/snippets?q=Werkstatt')).json).toHaveLength(0);
    const dashB = (await call('GET', '/dashboard', undefined, 'u-admin', B)).json;
    expect(dashB).toMatchObject({ sources: 1, chapters: 1, imports: 1 });

    // Analyse läuft im Projekt des Laufs
    const run = (await call('POST', '/quality/analysis', {}, 'u-admin', B)).json;
    await built.ctx.jobs.idle();
    expect((await call('GET', `/quality/analysis/${run.id}`, undefined, 'u-admin', B)).json.status).toBe('completed');
    expect((await call('GET', `/quality/analysis/${run.id}`)).status).toBe(404); // aus Projekt A nicht sichtbar

    // IDs anderer Projekte gelten als nicht vorhanden – in Pfaden und Nutzdaten
    const vB = (await call('POST', `/chapters/${chB[0].id}/generate`, {}, 'u-admin', B)).json;
    const blockB = vB.sections.flatMap((s: any) => s.blocks)[0];
    expect((await call('GET', `/chapters/${chB[0].id}`)).status).toBe(404);
    expect((await call('GET', `/chapter-versions/${vB.id}`)).status).toBe(404);
    expect((await call('PATCH', `/content-blocks/${blockB.id}`, { text: 'fremd' })).status).toBe(404);
    expect((await call('GET', `/snippets/${blockB.sources[0].snippetId}`)).status).toBe(404);
    expect((await call('GET', `/source-revisions/${blockB.sources[0].revisionId}/raw`)).status).toBe(404);
    const vA = (await call('POST', `/chapters/${chA[0].id}/generate`)).json;
    const blockA = vA.sections.flatMap((s: any) => s.blocks)[0];
    const foreign = await call('PATCH', `/content-blocks/${blockA.id}`, { sourceIds: [blockB.sources[0].snippetId] });
    expect(foreign.status).toBe(400);
    expect(foreign.json.detail).toContain('existiert in diesem Projekt nicht');
    expect((await call('POST', '/exports', { chapterIds: [chB[0].id], format: 'md' })).status).toBe(400);

    // Audit je Projekt
    const auditB = (await call('GET', '/audit-events?limit=500', undefined, 'u-leser', B)).json;
    expect(auditB.every((e: any) => e.projectId === B)).toBe(true);
    expect(auditB.some((e: any) => e.action === 'project.created')).toBe(true);
    const auditA = (await call('GET', '/audit-events?limit=500', undefined, 'u-leser')).json;
    expect(auditA.some((e: any) => e.entityId === blockB.id)).toBe(false);

    // Unbekanntes Projekt
    expect((await call('GET', '/chapters', undefined, 'u-admin', 'p_gibtsnicht')).status).toBe(404);
  });

  it('[T-133] Sichtbarkeit, Mitgliedschaften mit Berechtigungen je Projekt, Archivierung', async () => {
    const C = (await call('POST', '/projects', { name: 'Vertraulich' })).json.id; // Standard: restricted
    const listed = (await call('GET', '/projects', undefined, 'u-redaktion')).json.map((p: any) => p.id);
    expect(listed).toContain('p_default');
    expect(listed).not.toContain(C);
    expect((await call('GET', '/chapters', undefined, 'u-redaktion', C)).status).toBe(403);

    // Leser wird Redakteur in C (Berechtigungen der Mitgliedschaft gelten nur dort)
    expect((await call('PUT', `/projects/${C}/members/u-leser`, { permissions: ['edit'] }, 'u-redaktion')).status).toBe(403);
    const members = (await call('PUT', `/projects/${C}/members/u-leser`, { permissions: ['edit'] })).json;
    expect(members).toEqual([expect.objectContaining({ userId: 'u-leser', permissions: ['read', 'edit'], addedBy: 'u-admin' })]);
    expect((await call('PUT', `/projects/${C}/members/u-leser`, { permissions: ['fly'] })).status).toBe(400);
    const me = (await call('GET', '/me', undefined, 'u-leser', C)).json;
    expect(me.permissions).toEqual(['read', 'edit']);
    expect((await call('POST', '/terminology', { preferred: 'Auftrag', avoid: ['Order'] }, 'u-leser', C)).status).toBe(201);
    expect((await call('POST', '/terminology', { preferred: 'Kunde' }, 'u-leser')).status).toBe(403); // im Standardprojekt weiter nur lesend
    expect((await call('GET', '/projects', undefined, 'u-leser')).json.find((p: any) => p.id === C)).toMatchObject({ myPermissions: ['read', 'edit'] });

    // Archiviert: nur lesbar; Standardprojekt nicht archivierbar
    expect((await call('PATCH', '/projects/p_default', { archived: true })).status).toBe(409);
    expect((await call('PATCH', `/projects/${C}`, { archived: true })).json.archivedAt).toBeTruthy();
    expect((await call('POST', '/terminology', { preferred: 'Rechnung' }, 'u-leser', C)).status).toBe(403);
    expect((await call('GET', '/terminology', undefined, 'u-leser', C)).status).toBe(200);
    await call('PATCH', `/projects/${C}`, { archived: false });

    // Mitgliedschaft entfernen
    expect((await call('DELETE', `/projects/${C}/members/u-leser`)).status).toBe(204);
    expect((await call('GET', '/chapters', undefined, 'u-leser', C)).status).toBe(403);
    expect((await call('DELETE', `/projects/${C}/members/u-leser`)).status).toBe(404);
    // Sichtbarkeit öffnen: globale Berechtigungen gelten
    await call('PATCH', `/projects/${C}`, { visibility: 'open' });
    expect((await call('GET', '/chapters', undefined, 'u-leser', C)).status).toBe(200);
  });
});

describe('Betrieb: Health, Metriken, Request-ID, Rate-Limiting (ADR-015)', () => {
  const dataDir = tempDir();
  let built: Awaited<ReturnType<typeof buildApp>>;
  beforeAll(async () => {
    built = await buildApp({
      dataDir, database: await freshDatabase(dataDir, 'betrieb'), logger: false, webDist: null, authMode: 'demo',
      ops: { metricsToken: 'geheim-123', rateLimitMax: 25, rateLimitExpensiveMax: 2 },
    });
  });
  afterAll(async () => {
    await built.app.close();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('[T-134] Liveness/Readiness, Request-ID, geschützte Metriken und Limits je Benutzer', async () => {
    const inject = (method: 'GET' | 'POST', url: string, headers: Record<string, string> = {}, payload?: unknown) => built.app.inject({ method, url, headers, payload: payload as any });
    expect((await inject('GET', '/api/v1/health/live')).json()).toEqual({ status: 'ok' });
    const ready = await inject('GET', '/api/v1/health/ready');
    expect(ready.statusCode).toBe(200);
    expect(ready.json()).toMatchObject({ ready: true, checks: { database: { ok: true }, objectStore: { ok: true }, jobQueue: { ok: true } } });

    // Request-ID: übernommen oder erzeugt
    expect((await inject('GET', '/api/v1/health', { 'x-request-id': 'trace-42' })).headers['x-request-id']).toBe('trace-42');
    expect((await inject('GET', '/api/v1/health', { 'x-request-id': 'böse id<script>' })).headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);

    // Metriken nur mit Token oder als Administration
    expect((await inject('GET', '/metrics')).statusCode).toBe(401);
    expect((await inject('GET', '/metrics', { authorization: 'Bearer falsch-123' })).statusCode).toBe(401);
    expect((await inject('GET', '/metrics', { 'x-user-id': 'u-leser' })).statusCode).toBe(401);
    await inject('GET', '/api/v1/chapters', { 'x-user-id': 'u-leser' });
    const m = await inject('GET', '/metrics', { authorization: 'Bearer geheim-123' });
    expect(m.statusCode).toBe(200);
    expect(m.body).toContain('onescm_http_requests_total{method="GET",route="/api/v1/chapters",status="200"}');
    expect(m.body).toContain('onescm_http_request_duration_seconds_bucket');
    expect(m.body).toMatch(/onescm_projects\{state="active"\} 1/);
    expect(m.body).toContain('onescm_process_resident_memory_bytes');
    expect((await inject('GET', '/metrics', { 'x-user-id': 'u-admin' })).statusCode).toBe(200);

    // Aufwendige Aktionen: engeres Limit je Benutzer; andere Benutzer sind nicht betroffen
    const analysis = (user: string) => inject('POST', '/api/v1/quality/analysis', { 'x-user-id': user });
    expect((await analysis('u-redaktion')).statusCode).toBe(202);
    expect((await analysis('u-redaktion')).statusCode).toBe(202);
    const limited = await analysis('u-redaktion');
    expect(limited.statusCode).toBe(429);
    expect(limited.headers['content-type']).toContain('application/problem+json');
    expect(limited.json().detail).toContain('Zu viele Anfragen');
    expect(limited.headers['retry-after']).toBeDefined();
    expect((await analysis('u-admin')).statusCode).toBe(202);
    // Allgemeines Limit; Health-Checks sind ausgenommen
    let last = 0;
    for (let i = 0; i < 30; i++) last = (await inject('GET', '/api/v1/chapters', { 'x-user-id': 'u-leser' })).statusCode;
    expect(last).toBe(429);
    expect((await inject('GET', '/api/v1/health/ready')).statusCode).toBe(200);
    expect((await inject('GET', '/metrics', { authorization: 'Bearer geheim-123' })).body).toMatch(/onescm_rate_limited_total\{kind="expensive"\} 1/);
    await built.ctx.jobs.idle();
  });
});

describe('Backup und Wiederherstellung (ADR-015)', () => {
  const srcDir = tempDir();
  const dstDir = tempDir();
  afterAll(() => {
    fs.rmSync(srcDir, { recursive: true, force: true });
    fs.rmSync(dstDir, { recursive: true, force: true });
  });

  it('[T-135] portables Backup aus SQLite, Wiederherstellung in frische Datenbank (PostgreSQL in der CI) inkl. Objekten', async () => {
    const { createBackup, restoreBackup, RestoreError } = await import('../src/services/backup.js');
    // Quelle: immer SQLite – in der PostgreSQL-CI prüft der Test damit auch den Umzug SQLite → PostgreSQL
    const src = await buildApp({ dataDir: srcDir, database: `${srcDir}/quelle.db`, logger: false, webDist: null, authMode: 'demo' });
    const inj = (method: 'GET' | 'POST', url: string, payload?: unknown, project?: string) =>
      src.app.inject({ method, url: `/api/v1${url}`, payload: payload as any, headers: { 'x-user-id': 'u-admin', ...(project ? { 'x-project-id': project } : {}) } });
    const P = (await inj('POST', '/projects', { name: 'Zweites Handbuch', visibility: 'open' })).json().id;
    const mp = multipart('backup.md', Buffer.from(md('1. Sicherung', 'Dieses Kapitel beschreibt die Datensicherung.')));
    await src.app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp.payload, headers: { ...mp.headers, 'x-user-id': 'u-admin', 'x-project-id': P } });
    await src.ctx.jobs.idle();
    const chapter = (await inj('GET', '/chapters', undefined, P)).json()[0];
    const v = (await inj('POST', `/chapters/${chapter.id}/generate`, {}, P)).json();
    const { data, manifest } = await createBackup(src.ctx.db, src.ctx.store, '0.6.0');
    await src.app.close();
    expect(manifest).toMatchObject({ format: 'onescm-backup', version: 1, sourceDialect: 'sqlite', missingObjects: [] });
    expect(manifest.tables.content_blocks).toBeGreaterThan(0);
    expect(manifest.objects).toBe(2); // Upload + Quelldatei

    const dst = await buildApp({ dataDir: dstDir, database: await freshDatabase(dstDir, 'ziel'), logger: false, webDist: null, authMode: 'demo' }, { worker: false });
    try {
      await expect(restoreBackup(dst.ctx.db, dst.ctx.store, Buffer.from('kein zip'))).rejects.toThrow();
      const r = await restoreBackup(dst.ctx.db, dst.ctx.store, data);
      expect(r.objects).toBe(2);
      expect(r.restored.generated_chapter_versions).toBe(1);
      const get = (url: string, project?: string) => dst.app.inject({ method: 'GET', url: `/api/v1${url}`, headers: { 'x-user-id': 'u-admin', ...(project ? { 'x-project-id': project } : {}) } });
      expect((await get('/projects')).json().map((p: any) => p.name)).toEqual(expect.arrayContaining(['Zweites Handbuch']));
      const restored = (await get(`/chapter-versions/${v.id}`, P)).json();
      expect(restored.sections.flatMap((s: any) => s.blocks).map((b: any) => b.text)).toEqual(v.sections.flatMap((s: any) => s.blocks).map((b: any) => b.text));
      const rev = restored.sections.flatMap((s: any) => s.blocks).find((b: any) => b.sources.length).sources[0].revisionId;
      expect((await get(`/source-revisions/${rev}/raw`, P)).body).toContain('Datensicherung');
      // Neue Nummern setzen nach dem Restore fort
      const before = (await dst.ctx.db.get<{ m: number }>('SELECT MAX(seq) AS m FROM text_snippets'))!.m;
      expect(await dst.ctx.db.nextSeq('text_snippets')).toBe(before + 1);
      // Zweites Einspielen nur mit force
      await expect(restoreBackup(dst.ctx.db, dst.ctx.store, data)).rejects.toBeInstanceOf(RestoreError);
      expect((await restoreBackup(dst.ctx.db, dst.ctx.store, data, { force: true })).restored.chapters).toBe(1);
    } finally {
      await dst.app.close();
    }
  });
});
