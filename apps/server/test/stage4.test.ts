import { CreateBucketCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import fs from 'node:fs';
import path from 'node:path';
import S3rver from 's3rver';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { ObjectNotFoundError, S3ObjectStore } from '../src/storage.js';
import { freshDatabase, tempDir } from './helpers.js';

const MD = `---
roles: [all]
divisions: [all]
evidence_status: source_confirmed
---
# 1. Vergleich

## 1.1 Zweck

Dieses Kapitel beschreibt den Vergleich von Versionen.

## 1.2 Schritte

1. Version auswählen.
2. Vergleich starten.

Ergebnis: Die Unterschiede werden angezeigt.

Hinweis: Freigegebene Versionen bleiben unverändert.
`;

function multipart(fileName: string, data: Buffer) {
  const boundary = '----onescm' + Math.random().toString(16).slice(2);
  const head = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`);
  return { payload: Buffer.concat([head, data, Buffer.from(`\r\n--${boundary}--\r\n`)]), headers: { 'content-type': `multipart/form-data; boundary=${boundary}` } };
}

type App = Awaited<ReturnType<typeof buildApp>>;

function caller(app: App['app']) {
  return async (method: 'GET' | 'POST' | 'PATCH' | 'DELETE', url: string, body?: unknown, user = 'u-admin') => {
    const res = await app.inject({ method, url: `/api/v1${url}`, payload: body as any, headers: { 'x-user-id': user } });
    let json: any = null;
    try {
      json = res.json();
    } catch {
      /* kein JSON */
    }
    return { status: res.statusCode, json, body: res.body };
  };
}

async function importMd(built: App, name: string, content: string) {
  const mp = multipart(name, Buffer.from(content));
  const res = await built.app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp.payload, headers: { ...mp.headers, 'x-user-id': 'u-admin' } });
  expect(res.statusCode).toBe(202);
  await built.ctx.jobs.idle();
}

const blocks = (v: any) => v.sections.flatMap((s: any) => s.blocks);

describe('Versionsvergleich (US-019)', () => {
  const dataDir = tempDir();
  let built: App;
  let call: ReturnType<typeof caller>;

  beforeAll(async () => {
    built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'vergleich'), logger: false, webDist: null, authMode: 'demo' });
    call = caller(built.app);
    await importMd(built, 'vergleich.md', MD);
  });
  afterAll(async () => {
    await built.app.close();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('[T-126] Vergleich ganzer Kapitelversionen: geändert, verschoben, entfernt, hinzugefügt, unverändert', async () => {
    const chapterId = (await call('GET', '/chapters')).json[0].id;
    expect((await call('GET', `/chapters/${chapterId}/compare`)).status).toBe(422); // noch keine zwei Versionen

    const v1 = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
    const v2 = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
    // Unveränderte Neugenerierung: alle Absätze über die Lineage zugeordnet und unverändert
    const same = (await call('GET', `/chapters/${chapterId}/compare?from=${v1.id}&to=${v2.id}`)).json;
    expect(same.summary).toMatchObject({ added: 0, removed: 0, changed: 0, moved: 0 });
    expect(same.summary.unchanged).toBe(blocks(v2).length);

    const b = blocks(v2);
    const purpose = b.find((x: any) => x.section === 'purpose');
    const hint = b.find((x: any) => x.section === 'hints');
    const result = b.find((x: any) => x.section === 'result');
    await call('PATCH', `/content-blocks/${purpose.id}`, { text: 'Dieses Kapitel erklärt, wie Versionen verglichen werden.' }, 'u-redaktion');
    await call('PATCH', `/content-blocks/${hint.id}`, { section: 'troubleshooting' }, 'u-redaktion');
    await call('DELETE', `/content-blocks/${result.id}?reason=entfällt`, undefined, 'u-redaktion');
    await call('POST', `/chapter-versions/${v2.id}/content-blocks`, { section: 'hints', kind: 'tip', text: 'Tipp: Vergleichen Sie vor jeder Freigabe.', justification: 'Redaktion' }, 'u-redaktion');

    const diff = await call('GET', `/chapters/${chapterId}/compare?from=${v1.id}&to=${v2.id}`);
    expect(diff.status).toBe(200);
    const d = diff.json;
    expect(d).toMatchObject({ chapterTitle: '1. Vergleich', from: { versionNo: 1, status: 'superseded' }, to: { versionNo: 2, status: 'draft' } });
    expect(d.summary).toMatchObject({ changed: 1, moved: 1, removed: 1, added: 1 });
    const changed = d.entries.find((e: any) => e.change === 'changed');
    expect(changed.fields).toEqual(['text']);
    expect(changed.from.text).toBe('Dieses Kapitel beschreibt den Vergleich von Versionen.');
    expect(changed.to.text).toBe('Dieses Kapitel erklärt, wie Versionen verglichen werden.');
    expect(d.entries.find((e: any) => e.change === 'moved')).toMatchObject({ section: 'troubleshooting', from: { section: 'hints' }, to: { section: 'troubleshooting' }, fields: ['section'] });
    expect(d.entries.find((e: any) => e.change === 'removed')).toMatchObject({ section: 'result', to: null, from: { text: expect.stringMatching(/^Ergebnis:/) } });
    expect(d.entries.find((e: any) => e.change === 'added')).toMatchObject({ section: 'hints', from: null, to: { kind: 'tip' } });
    // Reihenfolge folgt der Kapitelstruktur
    const order = d.sections.map((s: any) => s.code);
    const idx = d.entries.map((e: any) => order.indexOf(e.section));
    expect(idx).toEqual([...idx].sort((x: number, y: number) => x - y));
    expect(d.fieldLabels.text).toBe('Text');

    // Standard ohne Parameter: vorletzte gegen neueste Version
    expect((await call('GET', `/chapters/${chapterId}/compare`)).json).toMatchObject({ from: { id: v1.id }, to: { id: v2.id } });
    // Versionen eines anderen Kapitels → 422
    await importMd(built, 'anderes.md', MD.replace('# 1. Vergleich', '# 2. Anderes'));
    const other = (await call('GET', '/chapters')).json.find((c: any) => c.title === '2. Anderes');
    const ov = (await call('POST', `/chapters/${other.id}/generate`, {}, 'u-redaktion')).json;
    expect((await call('GET', `/chapters/${chapterId}/compare?from=${v1.id}&to=${ov.id}`)).status).toBe(422);
  });
});

describe('S3-kompatibler Object-Store (ADR-008)', () => {
  const dataDir = tempDir();
  let s3: InstanceType<typeof S3rver> | null = null;
  let endpoint: string;
  const bucket = `onescm-test-${Date.now()}`;

  beforeAll(async () => {
    if (process.env.TEST_S3_ENDPOINT) {
      // Echter S3-kompatibler Speicher (in der CI: moto-Server)
      endpoint = process.env.TEST_S3_ENDPOINT;
    } else {
      // s3rver akzeptiert nur seine festen Testzugangsdaten (vorhandene AWS-Variablen der Umgebung überschreiben)
      process.env.AWS_ACCESS_KEY_ID = 'S3RVER';
      process.env.AWS_SECRET_ACCESS_KEY = 'S3RVER';
      delete process.env.AWS_SESSION_TOKEN;
      s3 = new S3rver({ port: 0, address: '127.0.0.1', silent: true, directory: path.join(dataDir, 's3') });
      const addr = (await s3.run()) as unknown as { port: number };
      endpoint = `http://127.0.0.1:${addr.port}`;
    }
    await new S3Client({ region: 'us-east-1', endpoint, forcePathStyle: true }).send(new CreateBucketCommand({ Bucket: bucket }));
  });
  afterAll(async () => {
    await s3?.close();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('[T-127] Objekte unveränderlich ablegen und lesen; Import und Export laufen über S3', async () => {
    const store = new S3ObjectStore({ bucket, prefix: 'probe', endpoint });
    expect(await store.exists('a/b.txt')).toBe(false);
    await expect(store.get('a/b.txt')).rejects.toBeInstanceOf(ObjectNotFoundError);
    await store.put('a/b.txt', Buffer.from('erste Fassung'));
    await store.put('a/b.txt', Buffer.from('überschreiben?')); // bleibt unverändert
    expect((await store.get('a/b.txt')).toString()).toBe('erste Fassung');
    expect(await store.exists('a/b.txt')).toBe(true);
    await expect(store.put('../ausbruch', Buffer.from('x'))).rejects.toThrow('Ungültiger Objektschlüssel');

    const built = await buildApp({
      dataDir, database: await freshDatabase(dataDir, 's3'), logger: false, webDist: null, authMode: 'demo',
      objectStore: { kind: 's3', bucket, prefix: 'onescm', endpoint, forcePathStyle: true },
    });
    const call = caller(built.app);
    expect((await call('GET', '/health')).json.objectStore).toBe('s3');
    await importMd(built, 's3.md', MD);
    const chapterId = (await call('GET', '/chapters')).json[0].id;
    const v = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
    for (const b of blocks(v)) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
    await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion');
    await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe');
    const exp = (await call('POST', '/exports', { format: 'md' })).json;
    expect((await call('GET', `/exports/${exp.id}/download`)).body).toContain('## 1. Vergleich');
    const src = (await call('GET', '/sources')).json[0];
    expect((await call('GET', `/source-revisions/${src.revisions[0].id}/raw`)).body).toBe(MD);

    const listed = await new S3Client({ region: 'us-east-1', endpoint, forcePathStyle: true }).send(new ListObjectsV2Command({ Bucket: bucket, Prefix: 'onescm/' }));
    const keys = (listed.Contents ?? []).map((o) => o.Key!.replace(/[0-9a-f]{64}/, '<sha>').replace(/exp_[^.]+/, '<id>'));
    expect(keys.sort()).toEqual(['onescm/exports/<id>.md', 'onescm/sources/<sha>', 'onescm/uploads/<sha>']);
    expect(fs.existsSync(path.join(dataDir, 'objects'))).toBe(false); // nichts im lokalen Dateisystem
    await built.app.close();
  });
});
