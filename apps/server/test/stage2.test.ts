import { exportJWK, generateKeyPair, SignJWT } from 'jose';
import fs from 'node:fs';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { permissionsFromClaims } from '../src/auth.js';
import { buildApp } from '../src/app.js';
import { DEFAULT_PERMISSION_MAP, type OidcConfig } from '../src/config.js';
import { openDb, toPostgresSql } from '../src/db.js';
import { JobQueue } from '../src/jobs.js';
import { freshDatabase, tempDir } from './helpers.js';

const MD = Buffer.from('---\nevidence_status: source_confirmed\n---\n# 1. Test\n\nText für den Jobtest.\n');

function multipart(fileName: string, data: Buffer) {
  const boundary = '----onescm' + Math.random().toString(16).slice(2);
  const head = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`);
  return { payload: Buffer.concat([head, data, Buffer.from(`\r\n--${boundary}--\r\n`)]), headers: { 'content-type': `multipart/form-data; boundary=${boundary}` } };
}

describe('Persistente Jobqueue (ADR-008)', () => {
  it('[T-118] Import-Job übersteht einen Neustart; Wiederholung und endgültiger Fehlschlag', async () => {
    const dataDir = tempDir();
    const database = await freshDatabase(dataDir, 'jobs');

    // 1. Instanz ohne Worker nimmt den Import an und „stürzt ab“
    const first = await buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' }, { worker: false });
    const mp = multipart('neustart.md', MD);
    const res = await first.app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp.payload, headers: { ...mp.headers, 'x-user-id': 'u-admin' } });
    expect(res.statusCode).toBe(202);
    const importId = res.json().id;
    await first.app.close();

    // 2. Instanz mit Worker arbeitet den gespeicherten Job ab
    const second = await buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' });
    await second.ctx.jobs.idle();
    const imp = await second.app.inject({ method: 'GET', url: `/api/v1/imports/${importId}`, headers: { 'x-user-id': 'u-admin' } });
    expect(imp.json()).toMatchObject({ status: 'completed', stats: { imported: 1 } });
    expect(await second.ctx.db.get("SELECT status, attempts FROM jobs WHERE type = 'import'")).toMatchObject({ status: 'completed', attempts: 1 });

    // Wiederholung mit Backoff und endgültiger Fehlschlag mit Fehler-Handler
    const q = new JobQueue(second.ctx.db, { backoffMs: 10, pollMs: 10 });
    let calls = 0;
    const failed: string[] = [];
    q.register('flaky', async () => {
      if (++calls < 2) throw new Error('vorübergehend');
    });
    q.register('broken', async () => {
      throw new Error('dauerhaft');
    }, async (_p, err) => void failed.push(err));
    await q.start();
    await q.enqueue('flaky', {});
    await q.enqueue('broken', {}, 2);
    await q.idle();
    await q.stop();
    expect(calls).toBe(2);
    expect(failed).toEqual(['dauerhaft']);
    expect(await second.ctx.db.get("SELECT status, attempts, error FROM jobs WHERE type = 'broken'")).toMatchObject({ status: 'failed', attempts: 2, error: 'dauerhaft' });

    // Lease-Rückholung im laufenden Betrieb (nicht nur beim Start): Job einer „abgestürzten“ Instanz
    const lq = new JobQueue(second.ctx.db, { leaseMs: 50, pollMs: 10 });
    const reclaimed: string[] = [];
    const exhausted: string[] = [];
    lq.register('orphan', async (p) => void reclaimed.push(p.name), async (p, err) => void exhausted.push(`${p.name}: ${err}`));
    await lq.start();
    const stale = new Date(Date.now() - 60_000).toISOString();
    for (const [name, attempts] of [['wiederholbar', 1], ['ausgeschöpft', 3]] as const) {
      await second.ctx.db.run(
        "INSERT INTO jobs (id, type, payload, status, attempts, max_attempts, run_after, locked_by, locked_at, created_at) VALUES (?, 'orphan', ?, 'running', ?, 3, ?, 'w_tot', ?, ?)",
        `job_${name}`, JSON.stringify({ name }), attempts, stale, stale, stale,
      );
    }
    lq.wake();
    await lq.idle();
    await lq.stop();
    expect(reclaimed).toEqual(['wiederholbar']);
    expect(exhausted).toEqual(['ausgeschöpft: Lease abgelaufen (Worker nicht mehr aktiv)']);

    // Import und Job werden atomar angelegt: schlägt das Einreihen fehl, bleibt kein Import zurück
    const original = second.ctx.jobs.enqueue.bind(second.ctx.jobs);
    second.ctx.jobs.enqueue = async () => {
      throw new Error('Verbindung verloren');
    };
    const mp2 = multipart('atomar.md', MD);
    const failed2 = await second.app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp2.payload, headers: { ...mp2.headers, 'x-user-id': 'u-admin' } });
    second.ctx.jobs.enqueue = original;
    expect(failed2.statusCode).toBe(500);
    expect(await second.ctx.db.get("SELECT COUNT(*) AS n FROM imports WHERE file_name = 'atomar.md'")).toEqual({ n: 0 });
    await second.app.close();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });
});

describe('OIDC-Anmeldung (ENTSCHEIDUNG E-15)', () => {
  let app: Awaited<ReturnType<typeof buildApp>>['app'];
  let sign: (claims: Record<string, unknown>, opts?: { issuer?: string; expired?: boolean; audience?: string | null }) => Promise<string>;
  let foreignToken: string;
  const issuer = 'https://idp.example.test/realms/onescm';
  const dataDir = tempDir();

  beforeAll(async () => {
    const { privateKey, publicKey } = await generateKeyPair('RS256');
    const jwk = { ...(await exportJWK(publicKey)), kid: 'k1', alg: 'RS256', use: 'sig' };
    const oidc: OidcConfig = {
      issuer, audience: 'onescm-api', clientId: 'onescm-web', scope: 'openid profile', jwksUri: null, jwks: { keys: [jwk] },
      permissionsClaim: 'realm_access.roles', permissionMap: DEFAULT_PERMISSION_MAP,
    };
    sign = (claims, opts = {}) => {
      const jwt = new SignJWT(claims)
        .setProtectedHeader({ alg: 'RS256', kid: 'k1' })
        .setIssuer(opts.issuer ?? issuer)
        .setIssuedAt()
        .setExpirationTime(opts.expired ? Math.floor(Date.now() / 1000) - 3600 : '5m');
      if (opts.audience !== null) jwt.setAudience(opts.audience ?? 'onescm-api');
      return jwt.sign(privateKey);
    };
    const other = await generateKeyPair('RS256');
    foreignToken = await new SignJWT({ sub: 'x' }).setProtectedHeader({ alg: 'RS256', kid: 'k1' }).setIssuer(issuer).setAudience('onescm-api').setExpirationTime('5m').sign(other.privateKey);
    ({ app } = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'oidc'), logger: false, webDist: null, authMode: 'oidc', oidc }));
  });
  afterAll(async () => {
    await app.close();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('[T-119] Bearer-Token wird geprüft; Berechtigungen kommen aus IdP-Gruppen, getrennt von fachlichen Rollen', async () => {
    const call = (url: string, token?: string, method: 'GET' | 'PUT' = 'GET', payload?: unknown) =>
      app.inject({ method, url: `/api/v1${url}`, payload: payload as any, headers: token ? { authorization: `Bearer ${token}` } : {} });

    // Öffentliche Endpunkte
    expect((await call('/health')).json()).toMatchObject({ status: 'ok', auth: 'oidc' });
    expect((await call('/auth/config')).json()).toEqual({ mode: 'oidc', issuer, clientId: 'onescm-web', scope: 'openid profile', audience: 'onescm-api' });

    // Ohne, mit fremdem, abgelaufenem oder falsch ausgestelltem Token → 401 problem+json
    const none = await call('/chapters');
    expect(none.statusCode).toBe(401);
    expect(none.headers['content-type']).toContain('application/problem+json');
    expect(none.headers['www-authenticate']).toBe('Bearer');
    expect((await call('/chapters', foreignToken)).statusCode).toBe(401);
    expect((await call('/chapters', await sign({ sub: 'a' }, { expired: true }))).statusCode).toBe(401);
    expect((await call('/chapters', await sign({ sub: 'a' }, { issuer: 'https://evil.example.test' }))).statusCode).toBe(401);
    // Token desselben Providers, aber für eine andere Anwendung (aud) → abgelehnt
    const otherAud = await sign({ sub: 'a', realm_access: { roles: ['onescm-admin'] } }, { audience: 'andere-api' });
    expect((await call('/chapters', otherAud)).statusCode).toBe(401);
    const noAud = await sign({ sub: 'a', realm_access: { roles: ['onescm-admin'] } }, { audience: null });
    expect((await call('/chapters', noAud)).statusCode).toBe(401);

    // Redaktion: lesen ja, Einstellungen ändern nein
    const editor = await sign({ sub: 'u-123', name: 'Erika Redaktion', realm_access: { roles: ['onescm-editor', 'offline_access'] } });
    const me = await call('/me', editor);
    expect(me.json()).toEqual({ id: 'oidc:u-123', name: 'Erika Redaktion', permissions: ['read', 'edit'] });
    expect((await call('/chapters', editor)).statusCode).toBe(200);
    expect((await call('/settings', editor, 'PUT', { readability: { maxSentenceWords: 25 } })).statusCode).toBe(403);

    // Administration darf; Audit-Eintrag trägt die OIDC-Identität
    const admin = await sign({ sub: 'u-9', preferred_username: 'admin', realm_access: { roles: ['onescm-admin'] } });
    expect((await call('/settings', admin, 'PUT', { readability: { maxSentenceWords: 25 } })).statusCode).toBe(200);
    const audit = (await call('/audit-events?entityType=settings', admin)).json();
    expect(audit[0]).toMatchObject({ actor: 'oidc:u-9', action: 'settings.updated' });

    // Demo-Benutzer existieren im OIDC-Modus nicht und der Header X-User-Id wird ignoriert
    expect((await call('/reference', admin)).json().users).toEqual([]);
    const spoof = await app.inject({ method: 'GET', url: '/api/v1/me', headers: { 'x-user-id': 'u-admin' } });
    expect(spoof.statusCode).toBe(401);

    // Abbildung Claim → Berechtigungen (direkte Namen, unbekannte Gruppen, Zeichenkette)
    const map = { permissionsClaim: 'groups', permissionMap: DEFAULT_PERMISSION_MAP };
    expect(permissionsFromClaims({ groups: ['onescm-approver', 'fremd'] }, map).sort()).toEqual(['approve', 'decide', 'read']);
    expect(permissionsFromClaims({ groups: 'read edit' }, map)).toEqual(['read', 'edit']);
    expect(permissionsFromClaims({}, map)).toEqual([]);
  });
});

describe('Datenbankadapter (ADR-003)', () => {
  it('[T-120] SQL-Übersetzung für PostgreSQL und Transaktions-Rollback', async () => {
    expect(toPostgresSql("SELECT a AS revisionNo, b AS n FROM t WHERE x = ? AND y = 'wer?' AND z IN (?, ?)")).toBe(
      'SELECT a AS "revisionNo", b AS n FROM t WHERE x = $1 AND y = \'wer?\' AND z IN ($2, $3)',
    );
    const dataDir = tempDir();
    const db = await openDb(await freshDatabase(dataDir, 'tx'));
    await db.run('INSERT INTO settings (key, value) VALUES (?, ?)', 'probe', '1');
    await expect(db.tx(async () => {
      await db.run('UPDATE settings SET value = ? WHERE key = ?', '2', 'probe');
      throw new Error('Abbruch');
    })).rejects.toThrow('Abbruch');
    expect(await db.get('SELECT value FROM settings WHERE key = ?', 'probe')).toEqual({ value: '1' });
    // Verschachtelte Transaktion läuft in der äußeren mit
    await db.tx(async () => {
      await db.tx(async () => db.run('UPDATE settings SET value = ? WHERE key = ?', '3', 'probe'));
    });
    expect(await db.get('SELECT value FROM settings WHERE key = ?', 'probe')).toEqual({ value: '3' });
    expect([await db.nextSeq('text_snippets'), db.dialect === 'sqlite' || db.dialect === 'postgres']).toEqual([1, true]);
    await db.close();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });
});
