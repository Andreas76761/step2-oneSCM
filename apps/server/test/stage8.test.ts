import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { freshDatabase, tempDir } from './helpers.js';

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

describe('Mehrsprachige Releases (ADR-021)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-142] Release mit freigegebenen Übersetzungen, Online-Hilfe je Sprache mit Umschalter, Rückfall auf Deutsch, Übersetzungsstand', async () => {
    const JSZip = (await import('jszip')).default;
    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'ml-releases'), logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } });
    const call = client(built);
    try {
      await importFile(built, 'm.md', `${FM}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDieses Kapitel beschreibt die Anmeldung.\n\n# 2. Aufträge\n\n## 2.1 Zweck\n\nDieses Kapitel beschreibt Aufträge.\n`);
      const [c1, c2] = (await call('GET', '/chapters')).json.filter((c: any) => c.title !== 'Ohne Kapitel');
      await approveChapter(call, c1.id);
      await approveChapter(call, c2.id);
      await call('PATCH', '/projects/p_default', { languages: ['en', 'fr'] });
      const tr = (await call('POST', '/translations', { chapterId: c1.id, language: 'en' }, 'u-redaktion')).json;
      await call('POST', `/translations/${tr.id}/machine`, {}, 'u-redaktion');
      await built.ctx.jobs.idle();
      expect((await call('POST', `/translations/${tr.id}/approve`, { comment: 'geprüft' }, 'u-freigabe')).status).toBe(200);

      const dash = (await call('GET', '/dashboard')).json.translations;
      expect(dash).toEqual([
        expect.objectContaining({ language: 'en', chapters: 2, approved: 1, missing: 1, outdated: 0 }),
        expect.objectContaining({ language: 'fr', chapters: 2, approved: 0, missing: 2 }),
      ]);

      const rel = (await call('POST', '/releases', { version: '2026.10' }, 'u-freigabe')).json;
      expect(rel.languages).toEqual([{ language: 'en', translated: 1, total: 2 }]); // ohne Übersetzung keine Sprachfassung (fr)
      const zip = await JSZip.loadAsync((await call('GET', `/releases/${rel.id}/download?format=site`)).raw);
      expect(Object.keys(zip.files).filter((f) => !f.endsWith('/')).sort()).toEqual([
        'aenderungen.html', 'en/aenderungen.html', 'en/index.html', 'en/kapitel-01.html', 'en/kapitel-02.html', 'index.html', 'kapitel-01.html', 'kapitel-02.html',
      ]);
      const root = await zip.file('kapitel-01.html')!.async('string');
      expect(root).toContain('<html lang="de">');
      expect(root).toContain('href="en/kapitel-01.html"');
      const en1 = await zip.file('en/kapitel-01.html')!.async('string');
      expect(en1).toContain('<html lang="en">');
      expect(en1).toContain('[EN]');
      expect(en1).toContain('Purpose');
      expect(en1).toContain('href="../kapitel-01.html"');
      const en2 = await zip.file('en/kapitel-02.html')!.async('string');
      expect(en2).toContain('Not yet translated – German version shown.');
      expect(en2).toContain('Dieses Kapitel beschreibt Aufträge.');
      expect(await zip.file('en/index.html')!.async('string')).toContain('Contents');

      const md = (await call('GET', `/releases/${rel.id}/download?format=md&language=en`)).body;
      expect(md).toContain('Englisch – Version 2026.10');
      expect(md).toContain('[EN]');
      expect(md).toContain('2. Aufträge (DE)');
      expect((await call('GET', `/releases/${rel.id}/download?format=md&language=fr`)).status).toBe(404);

      // Backup enthält die Sprachfassungen
      const { createBackup } = await import('../src/services/backup.js');
      const { manifest } = await createBackup(built.ctx.db, built.ctx.store, '0.8.0');
      expect(manifest.missingObjects).toEqual([]);
      expect(manifest.objects).toBeGreaterThanOrEqual(5); // Upload, Quelle, Site, Markdown DE, Markdown EN
    } finally {
      await built.app.close();
    }
  });
});
