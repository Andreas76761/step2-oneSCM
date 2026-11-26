import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { failSync } from '../src/services/connections.js';
import { guardedLookup } from '../src/services/webhooks.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const ROOT = path.join(import.meta.dirname, '../../..');
const fmHelp = (key: string) => `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\nhelp_context: [${key}]\n---\n`;

describe('Etappe 98', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string, extra: Record<string, unknown> = {}) =>
    freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', integrations: { allowInsecure: true }, ...extra }));

  it('[T-424] Abgleich: Push während des laufenden Abgleichs wird nachgeholt, abgebrochener Abgleich plant weiter; API-Token mit den heutigen Rechten des Erstellers', async () => {
    const repo = path.join(dataDir, 'resync-repo');
    fs.mkdirSync(repo, { recursive: true });
    const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=T', '-c', 'user.email=t@example.org', ...args], { cwd: repo, env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null' } }).toString().trim();
    git('init', '-q', '-b', 'main');
    fs.writeFileSync(path.join(repo, 'a.md'), `${FM}# 1. A\n\n## 1.1 Zweck\n\nErster Stand.\n`);
    git('add', '-A');
    git('commit', '-q', '-m', 'eins');
    const built = await build('e98a', { git: { allowFile: true, timeoutMs: 30_000 } });
    const call = client(built);
    try {
      const conn = (await call('POST', '/source-connections', { name: 'Repo', url: repo, branch: 'main' })).json;
      await built.ctx.jobs.idle();
      expect((await call('GET', `/source-connections/${conn.id}`)).json.lastCommit).toBe(git('rev-parse', 'HEAD'));

      // zweiter Commit, während der Abgleich noch importiert: vormerken statt verwerfen
      fs.writeFileSync(path.join(repo, 'a.md'), `${FM}# 1. A\n\n## 1.1 Zweck\n\nZweiter Stand.\n`);
      git('commit', '-qam', 'zwei');
      await built.ctx.db.run("UPDATE source_connections SET status = 'importing' WHERE id = ?", conn.id);
      expect((await call('POST', `/source-connections/${conn.id}/sync`, {})).status).toBeLessThan(300);
      expect((await built.ctx.db.get<any>('SELECT resync_requested FROM source_connections WHERE id = ?', conn.id))!.resync_requested).toBe(1);
      // der laufende Abgleich bricht ab (z. B. Neustart): der vorgemerkte startet, die Verbindung ist danach auf dem neuen Stand
      await failSync(built.ctx, { connectionId: conn.id }, 'Neustart');
      await built.ctx.jobs.idle();
      expect((await call('GET', `/source-connections/${conn.id}`)).json).toMatchObject({ status: 'idle', lastCommit: git('rev-parse', 'HEAD') });

      // geplanter Abgleich bricht ab: die Kette geht weiter
      expect((await call('PATCH', `/source-connections/${conn.id}`, { intervalMinutes: 60 })).status).toBe(200);
      const token = (await built.ctx.db.get<any>('SELECT schedule_token FROM source_connections WHERE id = ?', conn.id))!.schedule_token;
      expect(token).toBeTruthy();
      await failSync(built.ctx, { connectionId: conn.id, token }, 'Neustart beim Klonen');
      const after = (await built.ctx.db.get<any>('SELECT status, schedule_token, next_sync_at FROM source_connections WHERE id = ?', conn.id))!;
      expect(after.status).toBe('failed');
      expect(after.schedule_token).toBeTruthy();
      expect(after.schedule_token).not.toBe(token);
      expect(Date.parse(after.next_sync_at)).toBeGreaterThan(Date.now() + 50 * 60_000);

      // API-Token: entfernt der Administrator den Ersteller aus dem Projekt, gilt das Token dort nicht mehr; herabgestuft nur noch lesen
      const p2 = (await call('POST', '/projects', { name: 'Geheim', visibility: 'restricted' })).json;
      expect((await call('PUT', `/projects/${p2.id}/members/u-redaktion`, { permissions: ['read', 'edit', 'admin'] })).status).toBeLessThan(300);
      const created = await call('POST', '/api-tokens', { name: 'Bot', scopes: ['read', 'admin'] }, 'u-redaktion', p2.id);
      expect(created.status).toBe(201);
      const as = (url: string) => built.app.inject({ method: 'GET', url: `/api/v1${url}`, headers: { authorization: `Bearer ${created.json.token}`, 'x-project-id': p2.id } });
      expect((await as('/webhooks')).statusCode).toBe(200);
      expect((await call('PUT', `/projects/${p2.id}/members/u-redaktion`, { permissions: ['read'] })).status).toBeLessThan(300);
      expect((await as('/webhooks')).statusCode).toBe(403);
      expect((await as('/chapters')).statusCode).toBe(200);
      expect((await call('DELETE', `/projects/${p2.id}/members/u-redaktion`)).status).toBeLessThan(300);
      expect((await as('/chapters')).statusCode).toBe(403);
    } finally {
      await built.app.close();
    }
  });

  it('[T-425] Kontexthilfe: Seitensprache ohne Übersetzung zeigt Deutsch, Kontext-ID folgt der Datei; Verbindungsaufbau prüft die Adresse; Bild-Upload mit Grenze; Helm-Chart', async () => {
    const built = await build('e98b');
    const call = client(built);
    try {
      await importFile(built, 'auftrag.md', `${fmHelp('order.create')}# 3. Aufträge\n\n## 3.1 Zweck\n\nAufträge legen Sie im Menü Verkauf an.\n`);
      const chapter = (await call('GET', '/chapters')).json.find((c: any) => c.title === '3. Aufträge');
      await approveChapter(call, chapter.id);
      await call('PUT', '/help-settings', { public: true });
      expect((await call('POST', '/releases', { version: '2026.9' }, 'u-freigabe')).status).toBe(201);
      // <html lang="en"> der oneSCM-Seite, Englisch ist keine Zielsprache: deutsche Hilfe statt „keine Hilfe“
      const page = await built.app.inject({ method: 'GET', url: '/help/embed/p_default/order.create?language=en' });
      expect(page.statusCode).toBe(200);
      expect(page.body).toContain('Aufträge legen Sie im Menü Verkauf an.');
      // angemeldete API bleibt streng
      expect((await call('GET', '/context-help/order.create?language=en')).status).toBe(400);

      // Kontext-ID aus dem Front-Matter wandert mit der Datei in ein anderes Kapitel
      await importFile(built, 'auftrag.md', `${fmHelp('order.create')}# 4. Bestellungen\n\n## 4.1 Zweck\n\nBestellungen legen Sie im Menü Einkauf an.\n`);
      const moved = (await call('GET', '/chapters')).json.find((c: any) => c.title === '4. Bestellungen');
      const ctxRow = await built.ctx.db.get<any>("SELECT chapter_id, origin FROM help_contexts WHERE context_key = 'order.create'");
      expect(ctxRow).toMatchObject({ chapter_id: moved.id, origin: 'front_matter' });

      // Verbindungsaufbau: interne Adressen auch dann gesperrt, wenn der Name erst jetzt so auflöst
      const err = await new Promise<Error | null>((resolve) => guardedLookup('localhost', {}, (e) => resolve(e)));
      expect(err?.message).toContain('internen Netz');

      // Bild-Upload: Grenze greift beim Einlesen
      await call('PUT', '/settings', { import: { maxEntryBytes: 1000 } });
      const boundary = '----onescm98';
      const payload = Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="gross.png"\r\nContent-Type: image/png\r\n\r\n`), Buffer.alloc(5000, 1), Buffer.from(`\r\n--${boundary}--\r\n`)]);
      const up = await built.app.inject({ method: 'POST', url: '/api/v1/media', payload, headers: { 'content-type': `multipart/form-data; boundary=${boundary}`, 'x-user-id': 'u-redaktion' } });
      expect(up.statusCode).toBe(413);
      expect(up.json().detail).toContain('1000 Bytes');
    } finally {
      await built.app.close();
    }

    // Helm-Chart: Image wie in der Release-Pipeline (ghcr.io/<owner>/<repo>, klein), keine fremden Dateien im Chart
    const values = fs.readFileSync(path.join(ROOT, 'deploy/helm/onescm/values.yaml'), 'utf8');
    expect(values).toMatch(/^ {2}repository: ghcr\.io\/andreas76761\/step2-onescm\b/m);
    expect(fs.readdirSync(path.join(ROOT, 'deploy/helm/onescm')).sort()).toEqual(['.helmignore', 'Chart.yaml', 'templates', 'values.yaml']);
  });
});
