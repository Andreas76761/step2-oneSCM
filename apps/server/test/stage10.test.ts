import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import path from 'node:path';
import { createHmac } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

/** Kleiner HTTP-Empfänger für Webhooks und die nachgebildete Confluence-API */
async function server(handler: (req: http.IncomingMessage, body: string, res: http.ServerResponse) => void) {
  const s = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => handler(req, body, res));
  });
  await new Promise<void>((r) => s.listen(0, '127.0.0.1', r));
  return { url: `http://127.0.0.1:${(s.address() as AddressInfo).port}`, close: () => new Promise<void>((r) => s.close(() => r())) };
}

describe('Integrationen & API (ADR-028)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string, extra: Record<string, unknown> = {}) =>
    freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', integrations: { allowInsecure: true }, ...extra }));

  it('[T-153] API-Tokens: projektgebunden, Scopes, Ablauf, Widerruf, kein Zugriff auf Projektverwaltung', async () => {
    const built = await build('tokens');
    const call = client(built);
    const as = (token: string, method: 'GET' | 'POST', url: string, project?: string) =>
      built.app.inject({ method, url: `/api/v1${url}`, headers: { authorization: `Bearer ${token}`, ...(project ? { 'x-project-id': project } : {}) }, payload: method === 'POST' ? {} : undefined });
    try {
      expect((await call('POST', '/api-tokens', { name: 'CI', scopes: ['read'] }, 'u-redaktion')).status).toBe(403);
      expect((await call('POST', '/api-tokens', { name: 'CI', scopes: ['fliegen'] })).status).toBe(400);
      expect((await call('POST', '/api-tokens', { name: 'CI', expiresInDays: 0 })).status).toBe(400);
      const created = await call('POST', '/api-tokens', { name: 'Lesezugriff CI', scopes: ['read'], expiresInDays: 30 });
      expect(created.status).toBe(201);
      const token = created.json.token as string;
      expect(token).toMatch(/^oscm_/);
      expect(created.json).toMatchObject({ name: 'Lesezugriff CI', scopes: ['read'], status: 'active', prefix: token.slice(0, 12) });
      const listed = (await call('GET', '/api-tokens')).json;
      expect(listed).toHaveLength(1);
      expect(JSON.stringify(listed)).not.toContain(token); // Klartext nie wieder
      expect(await built.ctx.db.get('SELECT id FROM api_tokens WHERE token_hash = ?', token)).toBeUndefined(); // nur Hash gespeichert

      expect((await as(token, 'GET', '/chapters')).statusCode).toBe(200);
      expect((await as(token, 'GET', '/me')).json()).toMatchObject({ id: `token:${created.json.id}`, permissions: ['read'] });
      expect((await as(token, 'POST', '/quality/analysis')).statusCode).toBe(403); // nur read
      expect((await as(token, 'POST', '/api-tokens')).statusCode).toBe(403);
      expect((await as(token, 'GET', '/projects')).statusCode).toBe(403);
      const other = (await call('POST', '/projects', { name: 'Anderes' })).json;
      expect((await as(token, 'GET', '/chapters', other.id)).statusCode).toBe(403);
      expect((await as('oscm_falsch', 'GET', '/chapters')).statusCode).toBe(401);

      // Schreibendes Token: Aktion wird dem Token zugeordnet
      const writer = (await call('POST', '/api-tokens', { name: 'Import-Bot', scopes: ['read', 'edit'] })).json;
      const res = await as(writer.token, 'POST', '/quality/analysis');
      expect(res.statusCode).toBe(202);
      expect(await built.ctx.db.get("SELECT actor FROM audit_events WHERE action = 'analysis.started' ORDER BY at DESC LIMIT 1")).toMatchObject({ actor: `token:${writer.id}` });
      // Ablauf und Widerruf
      await built.ctx.db.run('UPDATE api_tokens SET expires_at = ? WHERE id = ?', '2020-01-01T00:00:00.000Z', writer.id);
      expect((await as(writer.token, 'GET', '/chapters')).json().detail).toContain('abgelaufen');
      expect((await call('DELETE', `/api-tokens/${created.json.id}`)).json.status).toBe('revoked');
      expect((await as(token, 'GET', '/chapters')).statusCode).toBe(401);
      await built.ctx.jobs.idle();
    } finally {
      await built.app.close();
    }
  });

  it('[T-154] Ausgehende Webhooks: Abo, HMAC-Signatur, Ereignisse aus dem Audit, Wiederholung, erneute Zustellung, SSRF-Schutz', async () => {
    process.env.JOB_BACKOFF_MS = '20';
    const received: { headers: http.IncomingHttpHeaders; body: string }[] = [];
    let failing = true;
    const rx = await server((req, body, res) => {
      received.push({ headers: req.headers, body });
      res.writeHead(failing ? 500 : 204).end();
    });
    const built = await build('webhooks');
    const call = client(built);
    try {
      expect((await call('POST', '/webhooks', { url: rx.url, events: ['gibt.es.nicht'] })).status).toBe(400);
      expect((await call('POST', '/webhooks', { url: rx.url, events: ['import.finished'] }, 'u-redaktion')).status).toBe(403);
      const sub = (await call('POST', '/webhooks', { url: `${rx.url}/hook`, events: ['import.finished', 'chapter_version.approved'], description: 'CI' })).json;
      expect(sub.secret).toMatch(/^whsec_/);
      expect(JSON.stringify((await call('GET', '/webhooks')).json)).not.toContain(sub.secret);

      // Empfänger scheitert: fünf Versuche, dann „failed“
      await importFile(built, 'w.md', `${FM}# 1. W\n\n## 1.1 Zweck\n\nText.\n`);
      await built.ctx.jobs.idle();
      let deliveries = (await call('GET', `/webhooks/${sub.id}/deliveries`)).json;
      expect(deliveries[0]).toMatchObject({ event: 'import.finished', status: 'failed', attempts: 5, responseCode: 500 });
      expect(received).toHaveLength(5);

      // Signatur prüfen wie ein Empfänger
      const h = received[0].headers;
      const expected = `sha256=${createHmac('sha256', sub.secret).update(`${h['x-onescm-timestamp']}.${received[0].body}`).digest('hex')}`;
      expect(h['x-onescm-signature']).toBe(expected);
      expect(h['x-onescm-event']).toBe('import.finished');
      expect(JSON.parse(received[0].body)).toMatchObject({ event: 'import.finished', projectId: 'p_default', entity: { type: 'import' }, data: { status: 'completed' } });
      const { verifySignature } = await import('../src/services/webhooks.js');
      expect(verifySignature(sub.secret, String(h['x-onescm-timestamp']), received[0].body, String(h['x-onescm-signature']))).toBe(true);
      expect(verifySignature(sub.secret, String(h['x-onescm-timestamp']), `${received[0].body} `, String(h['x-onescm-signature']))).toBe(false);
      expect(verifySignature(sub.secret, '1000', received[0].body, sign(sub.secret, '1000', received[0].body))).toBe(false); // zu alt

      // Empfänger wieder erreichbar: erneut zustellen, Ping
      failing = false;
      expect((await call('POST', `/webhook-deliveries/${deliveries[0].id}/redeliver`)).status).toBe(202);
      await call('POST', `/webhooks/${sub.id}/ping`);
      await built.ctx.jobs.idle();
      deliveries = (await call('GET', `/webhooks/${sub.id}/deliveries`)).json;
      expect(deliveries.map((d: any) => [d.event, d.status])).toEqual([['ping', 'delivered'], ['import.finished', 'delivered']]);
      // nicht abonnierte Ereignisse und deaktivierte Abos erzeugen nichts
      await call('PATCH', `/webhooks/${sub.id}`, { active: false });
      await importFile(built, 'x.md', `${FM}# 2. X\n\n## 2.1 Zweck\n\nText.\n`);
      await built.ctx.jobs.idle();
      expect((await call('GET', `/webhooks/${sub.id}/deliveries`)).json).toHaveLength(2);
      expect((await call('DELETE', `/webhooks/${sub.id}`)).status).toBe(204);

      // SSRF-Schutz ohne Freigabe für unsichere Ziele
      const { assertSafeUrl } = await import('../src/services/webhooks.js');
      await expect(assertSafeUrl('http://example.org/x', false)).rejects.toThrow(/https/);
      await expect(assertSafeUrl('https://127.0.0.1/x', false)).rejects.toThrow(/internen Netz/);
      await expect(assertSafeUrl('https://10.1.2.3/x', false)).rejects.toThrow(/internen Netz/);
      // IPv4-abgebildete und Link-Local-Adressen (IPv6) sowie weitere nicht öffentliche Bereiche
      for (const host of ['[::ffff:127.0.0.1]', '[::ffff:7f00:1]', '[::ffff:a00:1]', '[fe81::1]', '[febf::1]', '[::1]', '[::]', '[fd00::1]', '[ff02::1]', '0.0.0.0', '169.254.169.254', '100.64.0.1', '192.0.0.8', '198.18.0.1', '224.0.0.1']) {
        await expect(assertSafeUrl(`https://${host}/x`, false), host).rejects.toThrow(/internen Netz/);
      }
      await expect(assertSafeUrl('https://[2606:4700:4700::1111]/x', false)).resolves.toBeTruthy();
      await expect(assertSafeUrl('https://1.1.1.1/x', false)).resolves.toBeTruthy();
      await expect(assertSafeUrl('https://user:pw@hooks.example.org/x', false)).rejects.toThrow(/Zugangsdaten/);
    } finally {
      delete process.env.JOB_BACKOFF_MS;
      await built.app.close();
      await rx.close();
    }
  });

  it('[T-155] Push-Webhook: GitHub-Signatur oder GitLab-Token startet den Abgleich, Branch-Filter, falsches Geheimnis', async () => {
    const repo = path.join(dataDir, 'push-repo');
    fs.mkdirSync(repo, { recursive: true });
    const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=T', '-c', 'user.email=t@example.org', ...args], { cwd: repo, env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null' } }).toString().trim();
    git('init', '-q', '-b', 'main');
    fs.writeFileSync(path.join(repo, 'a.md'), `${FM}# 1. A\n\n## 1.1 Zweck\n\nErster Stand.\n`);
    git('add', '-A');
    git('commit', '-q', '-m', 'eins');
    const built = await build('push', { git: { allowFile: true, timeoutMs: 30_000 } });
    const call = client(built);
    try {
      const conn = (await call('POST', '/source-connections', { name: 'Repo', url: repo, branch: 'main' })).json;
      expect(conn.webhookSecret).toMatch(/^whsec_/);
      expect(conn.webhookPath).toBe(`/api/v1/hooks/source-connections/${conn.id}`);
      await built.ctx.jobs.idle();
      expect((await call('GET', `/source-connections/${conn.id}`)).json.webhookSecret).toBeUndefined();
      fs.writeFileSync(path.join(repo, 'a.md'), `${FM}# 1. A\n\n## 1.1 Zweck\n\nZweiter Stand.\n`);
      git('commit', '-qam', 'zwei');

      const push = (body: object, headers: Record<string, string>) =>
        built.app.inject({ method: 'POST', url: conn.webhookPath, payload: JSON.stringify(body), headers: { 'content-type': 'application/json', ...headers } });
      const body = { ref: 'refs/heads/main', after: git('rev-parse', 'HEAD'), repository: { default_branch: 'main' } };
      const raw = JSON.stringify(body);
      const ghSig = `sha256=${createHmac('sha256', conn.webhookSecret).update(raw).digest('hex')}`;
      expect((await push(body, { 'x-hub-signature-256': 'sha256=00' })).statusCode).toBe(401);
      expect((await push(body, {})).statusCode).toBe(401);
      expect((await built.app.inject({ method: 'POST', url: '/api/v1/hooks/source-connections/conn_unbekannt', payload: raw, headers: { 'content-type': 'application/json', 'x-hub-signature-256': ghSig } })).statusCode).toBe(401);
      expect((await push(body, { 'x-hub-signature-256': ghSig, 'x-github-event': 'ping' })).json()).toEqual({ status: 'pong' });
      const other = { ...body, ref: 'refs/heads/feature' };
      const otherSig = `sha256=${createHmac('sha256', conn.webhookSecret).update(JSON.stringify(other)).digest('hex')}`;
      expect((await push(other, { 'x-hub-signature-256': otherSig })).json()).toMatchObject({ status: 'ignored' });
      const ok = await push(body, { 'x-hub-signature-256': ghSig, 'x-github-event': 'push' });
      expect(ok.statusCode).toBe(202);
      await built.ctx.jobs.idle();
      expect((await call('GET', `/source-connections/${conn.id}`)).json).toMatchObject({ status: 'idle', lastCommit: git('rev-parse', 'HEAD') });
      // GitHub mit Inhaltstyp application/x-www-form-urlencoded: Signatur über den Rohrumpf, JSON im Feld „payload“
      const form = `payload=${encodeURIComponent(raw)}`;
      const viaForm = await built.app.inject({
        method: 'POST', url: conn.webhookPath, payload: form,
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-github-event': 'push', 'x-hub-signature-256': `sha256=${createHmac('sha256', conn.webhookSecret).update(form).digest('hex')}` },
      });
      expect(viaForm.statusCode, viaForm.body).toBe(202);
      await built.ctx.jobs.idle();
      // GitLab: Token-Header
      expect((await push({ ref: 'refs/heads/main', project: { default_branch: 'main' } }, { 'x-gitlab-token': conn.webhookSecret })).statusCode).toBe(202);
      await built.ctx.jobs.idle();
      // Geheimnis erneuern: altes gilt nicht mehr
      const rotated = (await call('PATCH', `/source-connections/${conn.id}`, { rotateWebhookSecret: true })).json;
      expect(rotated.webhookSecret).not.toBe(conn.webhookSecret);
      expect((await push(body, { 'x-hub-signature-256': ghSig })).statusCode).toBe(401);
      expect(await built.ctx.db.get("SELECT actor FROM audit_events WHERE action = 'source_connection.push_received'")).toMatchObject({ actor: 'webhook' });
    } finally {
      await built.app.close();
    }
  });

  it('[T-156] Confluence Cloud: Seiten eines Bereichs über die REST-API (Paginierung, Anmeldung), unveränderter Stand ohne Import, neue Version', async () => {
    const pages = [
      { id: '101', title: '1. Anmeldung', version: { number: 1 }, body: { storage: { value: '<h1>Zweck</h1><p>Die Anmeldung erfolgt mit <strong>Kennung</strong>.</p>' } } },
      { id: '102', title: '2. Aufträge', version: { number: 3 }, body: { storage: { value: '<h1>Zweck</h1><p>Aufträge legen Sie im Menü Verkauf an.</p>' } } },
    ];
    const seenAuth: string[] = [];
    const conf = await server((req, _body, res) => {
      seenAuth.push(String(req.headers.authorization));
      const u = new URL(req.url!, 'http://x');
      if (u.pathname !== '/wiki/rest/api/content' || u.searchParams.get('spaceKey') !== 'HB') return void res.writeHead(404).end();
      if (req.headers.authorization !== `Basic ${Buffer.from('hb@example.org:api-token').toString('base64')}`) return void res.writeHead(401).end();
      const start = Number(u.searchParams.get('start') ?? 0);
      const slice = pages.slice(start, start + 1); // eine Seite je Antwort → Paginierung
      res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify({
        results: slice, _links: start + 1 < pages.length ? { next: `/rest/api/content?spaceKey=HB&type=page&start=${start + 1}&limit=1` } : {},
      }));
    });
    process.env.CONFLUENCE_CREDENTIAL_TEST = 'hb@example.org:api-token';
    const built = await build('confluence');
    const call = client(built);
    try {
      expect((await call('POST', '/source-connections', { kind: 'confluence', name: 'C', url: `${conf.url}/wiki` })).status).toBe(400); // spaceKey fehlt
      const conn = (await call('POST', '/source-connections', { kind: 'confluence', name: 'Handbuch-Bereich', url: `${conf.url}/wiki`, spaceKey: 'HB', credentialEnv: 'CONFLUENCE_CREDENTIAL_TEST' })).json;
      expect(conn).toMatchObject({ kind: 'confluence', spaceKey: 'HB', webhookPath: null });
      await built.ctx.jobs.idle();
      let c = (await call('GET', `/source-connections/${conn.id}`)).json;
      expect(c).toMatchObject({ status: 'idle', lastError: null });
      const imp = (await call('GET', `/imports/${c.lastImportId}`)).json;
      expect(imp.items.map((i: any) => i.status)).toEqual(['imported', 'imported']);
      const chapters = (await call('GET', '/chapters')).json.map((x: any) => x.title);
      expect(chapters).toEqual(expect.arrayContaining(['1. Anmeldung', '2. Aufträge']));
      // unveränderte Versionen: kein Import
      await call('POST', `/source-connections/${conn.id}/sync`, {});
      await built.ctx.jobs.idle();
      expect((await call('GET', '/imports')).json).toHaveLength(1);
      // neue Seitenversion → neuer Import
      pages[1] = { ...pages[1], version: { number: 4 }, body: { storage: { value: '<h1>Zweck</h1><p>Aufträge legen Sie im Menü Verkauf oder per Import an.</p>' } } };
      await call('POST', `/source-connections/${conn.id}/sync`, {});
      await built.ctx.jobs.idle();
      c = (await call('GET', `/source-connections/${conn.id}`)).json;
      expect(Object.fromEntries((await call('GET', `/imports/${c.lastImportId}`)).json.items.map((i: any) => [i.path.replace(/^HB\//, ''), i.status]))).toEqual({ '1-anmeldung-101.html': 'identical', '2-auftrage-102.html': 'imported' });
      // falsche Zugangsdaten: Fehler sichtbar
      process.env.CONFLUENCE_CREDENTIAL_TEST = 'hb@example.org:falsch';
      await call('POST', `/source-connections/${conn.id}/sync`, { force: true });
      await built.ctx.jobs.idle();
      expect((await call('GET', `/source-connections/${conn.id}`)).json).toMatchObject({ status: 'failed', lastError: expect.stringContaining('401') });
    } finally {
      delete process.env.CONFLUENCE_CREDENTIAL_TEST;
      await built.app.close();
      await conf.close();
    }
  });
});

function sign(secret: string, ts: string, body: string) {
  return `sha256=${createHmac('sha256', secret).update(`${ts}.${body}`).digest('hex')}`;
}
