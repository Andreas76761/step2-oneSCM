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
