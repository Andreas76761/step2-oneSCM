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

    // Projekt-Administration ist keine globale Administration: systemweite Einstellungen bleiben gesperrt
    await call('PUT', `/projects/${C}/members/u-redaktion`, { permissions: ['admin'] });
    expect((await call('GET', '/me', undefined, 'u-redaktion', C)).json.permissions).toContain('admin');
    expect((await call('PUT', '/settings', { readability: { maxSentenceWords: 5 } }, 'u-redaktion', C)).status).toBe(403);
    const audit = (await call('GET', '/audit-events?limit=500', undefined, 'u-redaktion', C)).json;
    expect(audit.every((e: any) => e.projectId === C)).toBe(true);
    await call('DELETE', `/projects/${C}/members/u-redaktion`);

    // Wartender Import eines später archivierten Projekts wird nicht mehr ausgeführt
    await built.ctx.jobs.stop();
    const mp = multipart('spaet.md', Buffer.from(md('1. Spät', 'Dieser Import wartet auf den Worker.')));
    const queued = await built.app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp.payload, headers: { ...mp.headers, 'x-user-id': 'u-admin', 'x-project-id': C } });
    expect(queued.statusCode).toBe(202);
    await call('PATCH', `/projects/${C}`, { archived: true });
    await built.ctx.jobs.start();
    await built.ctx.jobs.idle();
    expect((await call('GET', `/imports/${queued.json().id}`, undefined, 'u-admin', C)).json).toMatchObject({ status: 'failed', error: expect.stringContaining('archiviert') });
    expect((await call('GET', '/chapters', undefined, 'u-admin', C)).json).toEqual([]);
    await call('PATCH', `/projects/${C}`, { archived: false });

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
      ops: { metricsToken: 'geheim-123', rateLimitMax: 25, rateLimitExpensiveMax: 2, rateLimitStore: 'memory' },
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

describe('KI-Umformulierung ganzer Kapitel (ADR-013, Etappe 6)', () => {
  const dataDir = tempDir();
  let built: Awaited<ReturnType<typeof buildApp>>;
  const call = async (method: 'GET' | 'POST', url: string, body?: unknown, user = 'u-redaktion') => {
    const res = await built.app.inject({ method, url: `/api/v1${url}`, payload: body as any, headers: { 'x-user-id': user } });
    return { status: res.statusCode, json: res.json() as any };
  };
  beforeAll(async () => {
    built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'kapitel-ki'), logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } });
    const content = `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n# 1. Batch\n\n## 1.1 Zweck\n\nDieses Kapitel beschreibt die Stapelverarbeitung.\n\n## 1.2 Schritte\n\n1. Kapitel öffnen.\n2. Umformulierung starten.\n\nErgebnis: Alle Absätze haben einen Vorschlag.\n\nHinweis: Vorschläge werden einzeln geprüft.\n`;
    const mp = multipart('batch.md', Buffer.from(content));
    await built.app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp.payload, headers: { ...mp.headers, 'x-user-id': 'u-admin' } });
    await built.ctx.jobs.idle();
  });
  afterAll(async () => {
    await built.app.close();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('[T-136] Hintergrundjob je Kapitel, Sammelprüfung, Sammelübernahme, Abbruch, Fortsetzen und Nutzung', async () => {
    const chapterId = (await call('GET', '/chapters')).json[0].id;
    const v = (await call('POST', `/chapters/${chapterId}/generate`)).json;
    // geeignet: aus Quelltext abgeleitete Absätze; erzeugte Rollen-/Statushinweise nicht
    const eligible = v.sections.flatMap((s: any) => s.blocks).filter((b: any) => b.sources.length && ['paragraph', 'list', 'note', 'tip', 'warning'].includes(b.kind) && !['responsibilities', 'status'].includes(b.section));
    expect(eligible.length).toBe(4);
    const statusBlock = v.sections.find((s: any) => s.code === 'status').blocks[0];
    expect((await call('POST', `/content-blocks/${statusBlock.id}/rewrite-proposals`)).status).toBe(422);
    expect((await call('POST', `/chapter-versions/${v.id}/rewrite-jobs`, {}, 'u-leser')).status).toBe(403);

    // Läuft bereits ein Auftrag, wird kein zweiter gestartet
    await built.ctx.db.run("INSERT INTO rewrite_batches (id, chapter_version_id, status, created_by, created_at) VALUES ('rwb_x', ?, 'processing', 'u-admin', '2026-09-24T00:00:00Z')", v.id);
    expect((await call('POST', `/chapter-versions/${v.id}/rewrite-jobs`)).status).toBe(409);
    await built.ctx.db.run("DELETE FROM rewrite_batches WHERE id = 'rwb_x'");

    // Parallele Starts: genau einer wird angenommen (eindeutiger Index auf aktive Aufträge)
    await built.ctx.jobs.stop();
    const both = await Promise.all([1, 2].map(() => call('POST', `/chapter-versions/${v.id}/rewrite-jobs`, { instructions: 'kürzer' })));
    expect(both.map((x) => x.status).sort()).toEqual([202, 409]);
    const started = both.find((x) => x.status === 202)!;
    expect(started.json).toMatchObject({ status: 'queued', total: eligible.length });
    // der Datenbank-Index allein verhindert einen zweiten aktiven Auftrag (auch ohne Vorprüfung, z. B. zweite Instanz)
    await expect(built.ctx.db.run(
      "INSERT INTO rewrite_batches (id, chapter_version_id, status, created_by, created_at) VALUES ('rwb_dup', ?, 'queued', 'u-admin', '2026-09-24T00:00:00Z')", v.id,
    )).rejects.toThrow();
    await built.ctx.jobs.start();
    await built.ctx.jobs.idle();
    const done = (await call('GET', `/rewrite-jobs/${started.json.id}`)).json;
    expect(done).toMatchObject({ status: 'completed', total: eligible.length, done: eligible.length, valid: eligible.length, invalid: 0, failed: 0, instructions: 'kürzer' });
    expect((await call('GET', `/chapter-versions/${v.id}/rewrite-jobs`)).json[0].id).toBe(started.json.id);

    // Sammelprüfung: offene Vorschläge mit Abschnitt; kein zweiter Lauf für dieselben Absätze
    const open = (await call('GET', `/chapter-versions/${v.id}/rewrite-proposals`)).json;
    expect(open).toHaveLength(eligible.length);
    expect(open.every((p: any) => p.batchId === started.json.id && p.section && p.proposedText)).toBe(true);
    expect((await call('POST', `/chapter-versions/${v.id}/rewrite-jobs`)).status).toBe(422);

    // Ausgewählte übernehmen, dann alle übrigen gültigen
    const first = await call('POST', `/chapter-versions/${v.id}/rewrite-proposals/accept-valid`, { proposalIds: [open[0].id] });
    expect(first.json).toEqual({ accepted: [open[0].id], errors: [] });
    const rest = (await call('POST', `/chapter-versions/${v.id}/rewrite-proposals/accept-valid`)).json;
    expect(rest.accepted).toHaveLength(eligible.length - 1);
    const after = (await call('GET', `/chapter-versions/${v.id}`)).json.sections.flatMap((s: any) => s.blocks);
    expect(after.filter((b: any) => b.mode === 'ai_rewritten')).toHaveLength(eligible.length);
    expect((await call('GET', `/chapter-versions/${v.id}/gate`)).json.checks.find((c: any) => c.code === 'sentence_evidence').passed).toBe(true);

    // Nutzung je Anbieter/Modell
    const usage = (await call('GET', '/llm/usage')).json;
    expect(usage.items).toEqual([expect.objectContaining({ provider: 'demo', model: 'demo-extractive', requests: eligible.length, accepted: eligible.length })]);
    expect(usage.totals.requests).toBe(eligible.length);

    // Abbruch: vor dem ersten Absatz angefordert → cancelled, nichts übertragen
    await built.ctx.jobs.stop();
    const b2 = (await call('POST', `/chapter-versions/${v.id}/rewrite-jobs`)).json;
    expect((await call('POST', `/rewrite-jobs/${b2.id}/cancel`)).json.cancelRequested).toBe(true);
    await built.ctx.jobs.start();
    await built.ctx.jobs.idle();
    expect((await call('GET', `/rewrite-jobs/${b2.id}`)).json).toMatchObject({ status: 'cancelled', done: 0 });
    expect((await call('POST', `/rewrite-jobs/${b2.id}/cancel`)).status).toBe(409);

    // Fortsetzen nach Neustart: bereits bearbeitete Absätze werden nicht erneut übertragen
    await built.ctx.jobs.stop();
    const b3 = (await call('POST', `/chapter-versions/${v.id}/rewrite-jobs`)).json;
    const { proposeRewrite } = await import('../src/services/rewrite.js');
    await proposeRewrite(built.ctx, eligible[0].id, { batchId: b3.id }, 'u-redaktion');
    await built.ctx.jobs.start();
    await built.ctx.jobs.idle();
    const r3 = (await call('GET', `/rewrite-jobs/${b3.id}`)).json;
    expect(r3).toMatchObject({ status: 'completed', done: eligible.length - 1 });
    const n = await built.ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM rewrite_proposals WHERE batch_id = ?', b3.id);
    expect(Number(n!.n)).toBe(eligible.length);
  });
});
