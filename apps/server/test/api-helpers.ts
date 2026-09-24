// Gemeinsame Hilfen für API-Tests (Anfragen, Import, Freigabe)
import { expect } from 'vitest';
import type { buildApp } from '../src/app.js';

function multipart(fileName: string, data: Buffer) {
  const boundary = '----onescm' + Math.random().toString(16).slice(2);
  const head = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`);
  return { payload: Buffer.concat([head, data, Buffer.from(`\r\n--${boundary}--\r\n`)]), headers: { 'content-type': `multipart/form-data; boundary=${boundary}` } };
}
type Built = Awaited<ReturnType<typeof buildApp>>;
export function client(built: Built) {
  return async (method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string, body?: unknown, user = 'u-admin', project?: string) => {
    const headers: Record<string, string> = { 'x-user-id': user };
    if (project) headers['x-project-id'] = project;
    const res = await built.app.inject({ method, url: `/api/v1${url}`, payload: body as any, headers });
    let json: any = null;
    try {
      json = res.json();
    } catch {
      /* kein JSON */
    }
    return { status: res.statusCode, json, body: res.body, raw: res.rawPayload, headers: res.headers };
  };
}
export async function importFile(built: Built, name: string, content: string | Buffer, project?: string) {
  const mp = multipart(name, Buffer.isBuffer(content) ? content : Buffer.from(content));
  const res = await built.app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp.payload, headers: { ...mp.headers, 'x-user-id': 'u-admin', ...(project ? { 'x-project-id': project } : {}) } });
  expect(res.statusCode).toBe(202);
  await built.ctx.jobs.idle();
  return res.json();
}
export const FM = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';

export async function approveChapter(call: ReturnType<typeof client>, chapterId: string) {
  const v = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
  for (const b of v.sections.flatMap((s: any) => s.blocks)) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
  expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
  expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
  return v;
}

