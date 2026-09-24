import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { localEmbedding, dot } from '../src/embeddings.js';
import { freshDatabase, tempDir } from './helpers.js';

function multipart(fileName: string, data: Buffer) {
  const boundary = '----onescm' + Math.random().toString(16).slice(2);
  const head = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`);
  return { payload: Buffer.concat([head, data, Buffer.from(`\r\n--${boundary}--\r\n`)]), headers: { 'content-type': `multipart/form-data; boundary=${boundary}` } };
}

type Built = Awaited<ReturnType<typeof buildApp>>;
function client(built: Built) {
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
    return { status: res.statusCode, json, body: res.body, headers: res.headers };
  };
}
async function importMd(built: Built, name: string, content: string, project?: string) {
  const mp = multipart(name, Buffer.from(content));
  const res = await built.app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp.payload, headers: { ...mp.headers, 'x-user-id': 'u-admin', ...(project ? { 'x-project-id': project } : {}) } });
  expect(res.statusCode).toBe(202);
  await built.ctx.jobs.idle();
}
const FM = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';

describe('Semantische Suche und hybride Analyse (ADR-017)', () => {
  const dataDir = tempDir();
  const requests: any[] = [];
  // Nachgebildeter OpenAI-kompatibler Embedding-Dienst: Texte über Fahrzeuge bzw. Autos erhalten denselben Vektor
  const server = http.createServer((req, res) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      const body = JSON.parse(data);
      requests.push({ path: req.url, auth: req.headers.authorization, body });
      const vec = (t: string) => (/fahrzeug|auto|pkw|wagen/i.test(t) ? [1, 0, 0, 0.01] : /rechnung|zahlung/i.test(t) ? [0, 1, 0, 0.01] : [0, 0, 1, 0.01]);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ data: body.input.map((t: string, index: number) => ({ index, embedding: vec(t) })), model: body.model }));
    });
  });
  let url = '';
  beforeAll(async () => {
    await new Promise<void>((ok) => server.listen(0, '127.0.0.1', () => ok()));
    url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/v1`;
  });
  afterAll(async () => {
    await new Promise<void>((ok) => server.close(() => ok()));
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('[T-137] lokale Embeddings: Suche findet flektierte Formen und Komposita; Index inkrementell und je Projekt', async () => {
    // Einheit: Flexion/Kompositum ähnlicher als fremdes Thema
    const q = localEmbedding('Vertrag freigeben');
    expect(dot(q, localEmbedding('Die Freigabe des Vertrags erfolgt durch die MO.'))).toBeGreaterThan(dot(q, localEmbedding('Rechnungen werden monatlich gedruckt.')));

    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'semantik-lokal'), logger: false, webDist: null, authMode: 'demo' });
    const call = client(built);
    try {
      await importMd(built, 'a.md', `${FM}# 1. Verträge\n\n## 1.1 Freigabe\n\nDie Freigabe des Servicevertrags erfolgt durch die Marktorganisation.\n\nRechnungen werden monatlich gedruckt.\n`);
      expect((await call('GET', '/semantic-index')).json).toMatchObject({ provider: 'local', model: 'local-hash-384', external: false, indexed: 0 });
      const r = (await call('GET', `/search/semantic?q=${encodeURIComponent('Serviceverträge freigeben')}`)).json;
      expect(r).toMatchObject({ provider: 'local', computed: 2 });
      expect(r.hits[0].text).toContain('Freigabe des Servicevertrags');
      expect(r.hits[0].chapterTitle).toBe('1. Verträge');
      expect((await call('GET', '/semantic-index')).json.indexed).toBe(2);
      // zweite Suche nutzt den gespeicherten Index
      expect((await call('GET', '/search/semantic?q=Rechnung')).json).toMatchObject({ computed: 0, hits: [expect.objectContaining({ text: expect.stringContaining('Rechnungen') })] });
      expect((await call('GET', '/search/semantic')).status).toBe(400);
      // anderes Projekt sieht nichts davon
      const P = (await call('POST', '/projects', { name: 'Leer', visibility: 'open' })).json.id;
      expect((await call('GET', '/search/semantic?q=Freigabe', undefined, 'u-admin', P)).json.hits).toEqual([]);
      // Index-Job
      expect((await call('POST', '/semantic-index', {}, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/semantic-index')).status).toBe(202);
      await built.ctx.jobs.idle();
    } finally {
      await built.app.close();
    }
  });

  it('[T-138] OpenAI-kompatibler Dienst: semantische Treffer ohne gemeinsame Begriffe, hybride Analyse, kein Versand bei Datenschutzbefund', async () => {
    const built = await buildApp({
      dataDir, database: await freshDatabase(dataDir, 'semantik-dienst'), logger: false, webDist: null, authMode: 'demo',
      embeddings: { provider: 'openai', model: 'text-embedding-test', apiKey: 'emb-key', baseUrl: url },
    });
    const call = client(built);
    try {
      await importMd(built, 'b.md', `${FM}# 1. Stammdaten\n\n## 1.1 Anlage\n\nNeue Fahrzeuge werden im Bestand angelegt.\n\n## 1.2 Pflege\n\nDer PKW erscheint danach in der Übersicht.\n\n## 1.3 Abrechnung\n\nZahlungen werden täglich verbucht.\n`);
      const r = (await call('GET', `/search/semantic?q=${encodeURIComponent('Wagen')}`)).json;
      expect(r).toMatchObject({ provider: 'openai', model: 'text-embedding-test', external: true });
      expect(r.hits.map((h: any) => h.text)).toEqual(expect.arrayContaining([expect.stringContaining('Fahrzeuge'), expect.stringContaining('PKW')]));
      expect(r.hits.every((h: any) => !h.text.includes('Zahlungen'))).toBe(true);
      expect(requests.at(-1)).toMatchObject({ path: '/v1/embeddings', auth: 'Bearer emb-key', body: { model: 'text-embedding-test', input: ['Wagen'] } });

      // Hybride Analyse findet die Umschreibung, die TF-IDF nicht erkennt
      await call('POST', '/quality/analysis');
      await built.ctx.jobs.idle();
      const tfidf = (await call('GET', '/quality/findings?type=duplicate')).json;
      const dupFahrzeug = (list: any[]) => list.filter((f: any) => /Fahrzeuge|PKW/.test(`${f.a?.text ?? ''} ${f.b?.text ?? ''} ${JSON.stringify(f)}`));
      expect(dupFahrzeug(tfidf.items ?? tfidf)).toHaveLength(0);
      expect((await call('PUT', '/settings', { semantic: { analysisMethod: 'hybrid', embeddingThreshold: 0.9 } })).status).toBe(200);
      expect((await call('PUT', '/settings', { semantic: { analysisMethod: 'magie' } })).status).toBe(400);
      const run = (await call('POST', '/quality/analysis')).json;
      await built.ctx.jobs.idle();
      const runDone = (await call('GET', `/quality/analysis/${run.id}`)).json;
      expect(JSON.stringify(runDone)).toContain('text-embedding-test');
      const hybrid = (await call('GET', '/quality/findings?type=duplicate')).json;
      const found = dupFahrzeug(hybrid.items ?? hybrid);
      expect(found.length).toBeGreaterThanOrEqual(1);
      expect(found[0].method).toContain('hybrid');

      // Datenschutz: Abschnitt mit offenem Befund wird nicht an den Dienst übertragen
      await importMd(built, 'c.md', `${FM}# 2. Kontakt\n\n## 2.1 Ansprechpartner\n\nFahrzeugfragen an max.mustermann@firma.de senden.\n`);
      await call('POST', '/quality/analysis');
      await built.ctx.jobs.idle();
      const sent = requests.flatMap((x) => x.body.input as string[]);
      expect(sent.some((t) => t.includes('max.mustermann'))).toBe(false);
      expect((await call('GET', '/semantic-index')).json.excluded).toBe(1);
    } finally {
      await built.app.close();
    }
  });
});

describe('Handbuch-Releases und Online-Hilfe (ADR-018)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-139] Release aus freigegebenen Kapiteln, Änderungen zum Vorgänger, statische Online-Hilfe, unveränderlich', async () => {
    const JSZip = (await import('jszip')).default;
    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'releases'), logger: false, webDist: null, authMode: 'demo' });
    const call = client(built);
    // Kapitel generieren, Lücken entfernen, einreichen und freigeben
    const approve = async (chapterId: string, edit?: string) => {
      const v = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
      const blocks = v.sections.flatMap((s: any) => s.blocks);
      for (const b of blocks) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
      if (edit) await call('PATCH', `/content-blocks/${blocks.find((b: any) => b.section === 'purpose').id}`, { text: edit }, 'u-redaktion');
      expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      return v;
    };
    try {
      await importMd(built, 'r.md', `${FM}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDieses Kapitel beschreibt die Anmeldung.\n\n# 2. Aufträge\n\n## 2.1 Zweck\n\nDieses Kapitel beschreibt Aufträge <script>alert(1)</script>.\n`);
      expect((await call('POST', '/releases', { version: '2026.1' }, 'u-freigabe')).status).toBe(422); // noch nichts freigegeben
      const [c1, c2] = (await call('GET', '/chapters')).json.filter((c: any) => c.title !== 'Ohne Kapitel');
      await approve(c1.id);
      await approve(c2.id);

      expect((await call('POST', '/releases', { version: '2026.1' }, 'u-redaktion')).status).toBe(403);
      expect((await call('POST', '/releases', { version: 'v 1/..' }, 'u-freigabe')).status).toBe(400);
      const r1 = await call('POST', '/releases', { version: '2026.1', title: 'Handbuch Händlerportal', notes: 'Erste Ausgabe.' }, 'u-freigabe');
      expect(r1.status).toBe(201);
      expect(r1.json.chapters.map((c: any) => c.title)).toEqual(['1. Anmeldung', '2. Aufträge']);
      expect(r1.json.changes.map((c: any) => c.change)).toEqual(['new', 'new']);
      expect((await call('POST', '/releases', { version: '2026.1' }, 'u-freigabe')).status).toBe(409);

      // Online-Hilfe: eigenständige Seiten ohne Skripte, Quell-HTML escaped
      const site = await built.app.inject({ method: 'GET', url: `/api/v1/releases/${r1.json.id}/download?format=site`, headers: { 'x-user-id': 'u-leser' } });
      expect(site.headers['content-type']).toBe('application/zip');
      const zip = await JSZip.loadAsync(site.rawPayload);
      expect(Object.keys(zip.files).sort()).toEqual(['aenderungen.html', 'index.html', 'kapitel-01.html', 'kapitel-02.html']);
      const index = await zip.file('index.html')!.async('string');
      expect(index).toContain('Handbuch Händlerportal');
      expect(index).toContain('Erste Ausgabe.');
      const k2 = await zip.file('kapitel-02.html')!.async('string');
      expect(k2).not.toMatch(/<script/i);
      expect(k2).toContain('&lt;script&gt;');
      expect(k2).toContain("default-src 'none'");
      expect((await call('GET', `/releases/${r1.json.id}/download?format=md`)).body).toContain('# Handbuch Händlerportal – Version 2026.1');

      // Neue Freigabe von Kapitel 1 → Release 2026.2 mit Änderungsliste
      await approve(c1.id, 'Dieses Kapitel erklärt die Anmeldung am Portal.');
      const r2 = (await call('POST', '/releases', { version: '2026.2' }, 'u-freigabe')).json;
      expect(r2.previousReleaseId).toBe(r1.json.id);
      expect(r2.changes).toEqual([
        expect.objectContaining({ title: '1. Anmeldung', change: 'updated', fromVersionNo: 1, toVersionNo: 2, summary: expect.objectContaining({ changed: 1 }) }),
        expect.objectContaining({ title: '2. Aufträge', change: 'unchanged' }),
      ]);
      const zip2 = await JSZip.loadAsync((await built.app.inject({ method: 'GET', url: `/api/v1/releases/${r2.id}/download`, headers: { 'x-user-id': 'u-leser' } })).rawPayload);
      expect(await zip2.file('aenderungen.html')!.async('string')).toContain('Geändert: 1. Anmeldung – Version 1 → 2 (1 geändert)');
      // Release 2026.1 bleibt unverändert
      expect((await call('GET', `/releases/${r1.json.id}`)).json.chapters[0].versionNo).toBe(1);
      expect((await call('GET', '/releases')).json.map((r: any) => r.version)).toEqual(['2026.2', '2026.1']);
      // Mandantentrennung
      const P = (await call('POST', '/projects', { name: 'Anderes', visibility: 'open' })).json.id;
      expect((await call('GET', `/releases/${r1.json.id}`, undefined, 'u-admin', P)).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });
});
