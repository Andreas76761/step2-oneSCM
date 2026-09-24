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

/** Minimale Word-Datei (OOXML) mit Absätzen: [Text, Formatvorlage?] */
export async function docx(paragraphs: [string, string?][]) {
  const JSZip = (await import('jszip')).default;
  const z = new JSZip();
  z.file('[Content_Types].xml', '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
  z.file('_rels/.rels', '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  const p = ([t, s]: [string, string?]) => `<w:p>${s ? `<w:pPr><w:pStyle w:val="${s}"/></w:pPr>` : ''}<w:r><w:t xml:space="preserve">${t}</w:t></w:r></w:p>`;
  z.file('word/document.xml', `<?xml version="1.0"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs.map(p).join('')}</w:body></w:document>`);
  return z.generateAsync({ type: 'nodebuffer' });
}

const confluencePage = (title: string, body: string) => `<!DOCTYPE html><html><head><title>Handbuch : ${title}</title><meta charset="utf-8"><script>alert(1)</script></head><body>
<div id="breadcrumb-section"><ol><li><a href="index.html">Handbuch</a></li></ol></div>
<div id="main-content" class="wiki-content group">${body}</div>
<div class="pageSection group"><h2 id="attachments">Anhänge:</h2><a href="attachments/1/bild.png">bild.png</a></div>
<div id="footer"><p>Document generated by Confluence</p></div></body></html>`;

describe('Import aus Fremdsystemen (ADR-022)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-143] Confluence-HTML-Export (ZIP), einzelne HTML- und Word-Dateien werden in Markdown umgewandelt; Original bleibt abrufbar und im Backup', async () => {
    const JSZip = (await import('jszip')).default;
    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'convert'), logger: false, webDist: null, authMode: 'demo' });
    const call = client(built);
    try {
      const z = new JSZip();
      z.file('index.html', '<html><head><title>Handbuch</title></head><body><h2>Available Pages:</h2><ul><li><a href="Anmeldung_1.html">Anmeldung</a></li></ul></body></html>');
      z.file('Anmeldung_1.html', confluencePage('4. Anmeldung', '<h1>Zweck</h1><p>Mit der <strong>Anmeldung</strong> öffnen Sie oneSCM.</p><h1>Schritte</h1><ol><li>Browser öffnen</li><li>Kennung eingeben</li></ol><table><tbody><tr><th>Feld</th><th>Bedeutung</th></tr><tr><td>Kennung</td><td>Benutzername</td></tr></tbody></table><img src="x.png" alt="Anmeldemaske">'));
      z.file('styles/site.css', 'body{}');
      z.file('attachments/1/bild.png', Buffer.from([0x89, 0x50]));
      const imp = await importFile(built, 'confluence-export.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const done = (await call('GET', `/imports/${imp.id}`)).json;
      expect(done.status).toBe('completed');
      const byPath = Object.fromEntries(done.items.map((i: any) => [i.path, i]));
      expect(byPath['index.html'].status).toBe('skipped');
      expect(byPath['index.html'].message).toContain('Übersichtsseite');
      expect(byPath['Anmeldung_1.html'].status).toBe('imported');
      expect(byPath['styles/site.css'].status).toBe('skipped');

      const chapters = (await call('GET', '/chapters')).json;
      const anm = chapters.find((c: any) => c.title === '4. Anmeldung');
      expect(anm).toBeTruthy();
      expect(anm.subchapters.map((s: any) => s.title)).toEqual(['Zweck', 'Schritte']);
      const sources = (await call('GET', '/sources')).json;
      const rev = sources.find((s: any) => s.path === 'Anmeldung_1.html').revisions[0];
      expect(rev.sourceFormat).toBe('html');
      const raw = (await call('GET', `/source-revisions/${rev.id}/raw`)).body;
      expect(raw).toContain('# 4. Anmeldung');
      expect(raw).toContain('## Zweck');
      expect(raw).toContain('1. Browser öffnen');
      expect(raw).toContain('| Kennung | Benutzername |');
      expect(raw).toContain('[Bild: Anmeldemaske]');
      expect(raw).not.toMatch(/alert|breadcrumb|Confluence|bild\.png/);
      const snippets = (await call('GET', `/snippets?chapterId=${anm.id}`)).json.items;
      expect(snippets.map((s: any) => s.kind).sort()).toEqual(['ordered_list', 'paragraph', 'paragraph', 'table']);
      const orig = await call('GET', `/source-revisions/${rev.id}/original`);
      expect(orig.status).toBe(200);
      expect(orig.headers['content-type']).toContain('text/plain'); // HTML-Original nie als HTML ausliefern
      expect(orig.body).toContain('<div id="main-content"');

      // Word: Überschrift 1/2 werden Kapitel/Unterkapitel
      const w = await importFile(built, '5-lager.docx', await docx([['5. Lager', 'Heading1'], ['5.1 Zweck', 'Heading2'], ['Das Lager verwaltet Bestände.'], ['5.2 Einlagern', 'Heading2'], ['Wählen Sie den Lagerplatz.']]));
      expect((await call('GET', `/imports/${w.id}`)).json).toMatchObject({ kind: 'docx', status: 'completed' });
      const lager = (await call('GET', '/chapters')).json.find((c: any) => c.title === '5. Lager');
      expect(lager.subchapters.map((s: any) => s.title)).toEqual(['5.1 Zweck', '5.2 Einlagern']);
      const wrev = (await call('GET', '/sources')).json.find((s: any) => s.path === '5-lager.docx').revisions[0];
      expect(wrev.sourceFormat).toBe('docx');
      const worig = await call('GET', `/source-revisions/${wrev.id}/original`);
      expect(worig.headers['content-type']).toContain('wordprocessingml');
      expect(worig.raw.subarray(0, 2).toString()).toBe('PK');
      // Word ohne Überschrift 1: Dateiname wird Kapitel
      await importFile(built, 'Retouren.docx', await docx([['Zweck', 'Heading1'.replace('1', '2')], ['Retouren werden erfasst.']]));
      expect((await call('GET', '/chapters')).json.find((c: any) => c.title === 'Retouren')?.subchapters.map((s: any) => s.title)).toEqual(['Zweck']);
      // Identischer Re-Import erkennt unveränderten Inhalt
      const again = await importFile(built, '5-lager.docx', await docx([['5. Lager', 'Heading1'], ['5.1 Zweck', 'Heading2'], ['Das Lager verwaltet Bestände.'], ['5.2 Einlagern', 'Heading2'], ['Wählen Sie den Lagerplatz.']]));
      expect((await call('GET', `/imports/${again.id}`)).json.items[0].status).toBe('identical');
      // Kaputte Word-Datei → Fehler je Datei
      const bad = await importFile(built, 'kaputt.docx', Buffer.from('keine Word-Datei'));
      expect((await call('GET', `/imports/${bad.id}`)).json).toMatchObject({ status: 'failed' });
      // Markdown-Quelle hat kein Original
      await importFile(built, 'x.md', `${FM}# 9. X\n\nText.\n`);
      const mdRev = (await call('GET', '/sources')).json.find((s: any) => s.path === 'x.md').revisions[0];
      expect(mdRev.sourceFormat).toBe('markdown');
      expect((await call('GET', `/source-revisions/${mdRev.id}/original`)).status).toBe(404);

      const { createBackup } = await import('../src/services/backup.js');
      const { data, manifest } = await createBackup(built.ctx.db, built.ctx.store, '0.8.0');
      expect(manifest.missingObjects).toEqual([]);
      const bz = await JSZip.loadAsync(data);
      expect(Object.keys(bz.files).filter((f) => f.startsWith('objects/originals/') && !f.endsWith('/')).length).toBe(3); // HTML, 2× Word
    } finally {
      await built.app.close();
    }
  });
});

describe('Git-Quellverbindungen (ADR-022)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-144] Git-Repository: Validierung, erster Abgleich, unveränderter Stand ohne Import, neuer Commit als neue Revision, Planung und Projektgrenzen', async () => {
    const { execFileSync } = await import('node:child_process');
    const path = await import('node:path');
    const repo = path.join(dataDir, 'handbuch-repo');
    const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=Test', '-c', 'user.email=t@example.org', ...args], { cwd: repo, env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null' } }).toString().trim();
    fs.mkdirSync(path.join(repo, 'docs', 'teil'), { recursive: true });
    git('init', '-q', '-b', 'main');
    fs.writeFileSync(path.join(repo, 'README.md'), '# Nicht importieren\n\nLiegt außerhalb des Unterordners.\n');
    fs.writeFileSync(path.join(repo, 'docs', 'anmeldung.md'), `${FM}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldung öffnet oneSCM.\n`);
    fs.writeFileSync(path.join(repo, 'docs', 'teil', 'lager.docx'), await docx([['2. Lager', 'Heading1'], ['2.1 Zweck', 'Heading2'], ['Das Lager verwaltet Bestände.']]));
    fs.writeFileSync(path.join(repo, 'docs', 'bild.png'), Buffer.from([0x89]));
    fs.symlinkSync('/etc/passwd', path.join(repo, 'docs', 'geheim.md'));
    git('add', '-A');
    git('commit', '-q', '-m', 'erster Stand');

    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'git'), logger: false, webDist: null, authMode: 'demo', git: { allowFile: true, timeoutMs: 30_000 } });
    const call = client(built);
    try {
      // Validierung
      expect((await call('POST', '/source-connections', { name: 'x', url: 'http://example.org/r.git' })).status).toBe(400);
      expect((await call('POST', '/source-connections', { name: 'x', url: 'https://user:geheim@example.org/r.git' })).status).toBe(400);
      expect((await call('POST', '/source-connections', { name: 'x', url: 'https://example.org/r.git', branch: '--upload-pack=evil' })).status).toBe(400);
      expect((await call('POST', '/source-connections', { name: 'x', url: 'https://example.org/r.git', subPath: '../..' })).status).toBe(400);
      expect((await call('POST', '/source-connections', { name: 'x', url: 'https://example.org/r.git', credentialEnv: 'DATABASE_URL' })).status).toBe(400);
      expect((await call('POST', '/source-connections', { name: 'x', url: 'https://example.org/r.git', intervalMinutes: 1 })).status).toBe(400);
      expect((await call('POST', '/source-connections', { name: 'x', url: repo }, 'u-redaktion')).status).toBe(403);

      const created = await call('POST', '/source-connections', { name: 'Handbuch-Repo', url: repo, branch: 'main', subPath: 'docs', intervalMinutes: 60 });
      expect(created.status).toBe(201);
      const id = created.json.id;
      await built.ctx.jobs.idle();
      let conn = (await call('GET', `/source-connections/${id}`)).json;
      expect(conn).toMatchObject({ status: 'idle', lastError: null, lastCommit: git('rev-parse', 'HEAD') });
      expect(new Date(conn.nextSyncAt).getTime()).toBeGreaterThan(Date.now() + 55 * 60_000); // nächster Abgleich geplant
      const imp = (await call('GET', `/imports/${conn.lastImportId}`)).json;
      expect(imp.status).toBe('completed');
      expect(imp.fileName).toMatch(/^Handbuch-Repo@[0-9a-f]{7}\.zip$/);
      expect(imp.items.map((i: any) => i.path).sort()).toEqual(['anmeldung.md', 'teil/lager.docx']); // kein README, kein Bild, kein Symlink
      expect((await call('GET', '/chapters')).json.map((c: any) => c.title)).toEqual(expect.arrayContaining(['1. Anmeldung', '2. Lager']));

      // Unveränderter Stand: kein neuer Import
      expect((await call('POST', `/source-connections/${id}/sync`, {}, 'u-redaktion')).status).toBe(202);
      await built.ctx.jobs.idle();
      conn = (await call('GET', `/source-connections/${id}`)).json;
      expect(conn.lastImportId).toBe(imp.id);
      expect((await call('GET', '/imports')).json.length).toBe(1);

      // Neuer Commit → neue Revision der geänderten Datei, unveränderte Datei identisch
      fs.writeFileSync(path.join(repo, 'docs', 'anmeldung.md'), `${FM}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldung öffnet oneSCM im Browser.\n`);
      git('commit', '-qam', 'Anmeldung ergänzt');
      await call('POST', `/source-connections/${id}/sync`, {});
      await built.ctx.jobs.idle();
      conn = (await call('GET', `/source-connections/${id}`)).json;
      expect(conn.lastCommit).toBe(git('rev-parse', 'HEAD'));
      const imp2 = (await call('GET', `/imports/${conn.lastImportId}`)).json;
      expect(Object.fromEntries(imp2.items.map((i: any) => [i.path, i.status]))).toEqual({ 'anmeldung.md': 'imported', 'teil/lager.docx': 'identical' });
      expect((await call('GET', '/sources')).json.find((s: any) => s.path === 'anmeldung.md').revisions).toHaveLength(2);

      // Nur ein geplanter Folgejob gilt (ältere Planungen sind wirkungslos)
      const planned = await built.ctx.db.all("SELECT payload FROM jobs WHERE type = 'source-sync' AND status = 'queued'");
      expect(planned.length).toBe(3);
      const current = (await built.ctx.db.get('SELECT schedule_token FROM source_connections WHERE id = ?', id))!.schedule_token;
      expect(planned.filter((j: any) => JSON.parse(j.payload).token === current)).toHaveLength(1);
      const { runSync } = await import('../src/services/connections.js');
      const stale = planned.map((j: any) => JSON.parse(j.payload)).find((p: any) => p.token !== current);
      await runSync(built.ctx, stale);
      expect((await call('GET', '/imports')).json.length).toBe(2); // veralteter Planungsjob tut nichts
      // Intervall 0: keine Planung mehr
      expect((await call('PATCH', `/source-connections/${id}`, { intervalMinutes: 0 })).json.nextSyncAt).toBeNull();

      // Fehlerfälle: fehlender Branch, fehlende Zugangsdaten-Variable
      const broken = (await call('POST', '/source-connections', { name: 'Kaputt', url: repo, branch: 'gibt-es-nicht' })).json;
      const noCred = (await call('POST', '/source-connections', { name: 'Token', url: repo, credentialEnv: 'GIT_CREDENTIAL_FEHLT' })).json;
      expect(noCred.credentialAvailable).toBe(false);
      await built.ctx.jobs.idle();
      expect((await call('GET', `/source-connections/${broken.id}`)).json).toMatchObject({ status: 'failed', lastError: expect.stringContaining('git clone fehlgeschlagen') });
      expect((await call('GET', `/source-connections/${noCred.id}`)).json).toMatchObject({ status: 'failed', lastError: expect.stringContaining('GIT_CREDENTIAL_FEHLT') });

      // Projektgrenzen
      const other = (await call('POST', '/projects', { name: 'Anderes Projekt' })).json;
      expect((await call('GET', `/source-connections/${id}`, undefined, 'u-admin', other.id)).status).toBe(404);
      expect((await call('POST', `/source-connections/${id}/sync`, {}, 'u-admin', other.id)).status).toBe(404);
      expect((await call('GET', '/source-connections', undefined, 'u-admin', other.id)).json).toEqual([]);

      expect((await call('DELETE', `/source-connections/${id}`)).status).toBe(204);
      expect((await call('GET', `/imports/${imp.id}`)).status).toBe(200); // Importe bleiben erhalten
      const audit = await built.ctx.db.all("SELECT action FROM audit_events WHERE entity_type = 'source_connection' AND entity_id = ?", id);
      expect(audit.map((a: any) => a.action)).toEqual(expect.arrayContaining(['source_connection.created', 'source_connection.synced', 'source_connection.deleted']));
    } finally {
      await built.app.close();
    }
  });
});

describe('Analytik und Berichte (ADR-023)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-145] Kennzahlen-Zeitreihe mit Fortschreibung, Flussgrößen, Freigabedauer, Projektbericht (PDF) und BI-Export (CSV/JSON)', async () => {
    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'analytics'), logger: false, webDist: null, authMode: 'demo' });
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${FM}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDieses Kapitel beschreibt die Anmeldung.\n\n# =HYPERLINK("http://x")\n\n## Zweck\n\nDer Auftrag wird angelegt.\n\nDer Auftrag wird angelegt.\n`);
      expect((await call('POST', '/quality/analysis', {}, 'u-redaktion')).status).toBe(202);
      await built.ctx.jobs.idle();
      const chapters = (await call('GET', '/chapters')).json.filter((c: any) => c.title !== 'Ohne Kapitel');
      const c1 = chapters.find((c: any) => c.title === '1. Anmeldung');
      // eine Ablehnung, dann Freigabe
      const v = (await call('POST', `/chapters/${c1.id}/generate`, {}, 'u-redaktion')).json;
      for (const b of v.sections.flatMap((s: any) => s.blocks)) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
      await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion');
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'nachbessern', decision: 'rejected' }, 'u-freigabe')).status).toBe(200);
      await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion');
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);

      // ältere Snapshots (vor 10 und 5 Tagen) für die Zeitreihe
      const today = new Date().toISOString().slice(0, 10);
      const ago = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString().slice(0, 10);
      const old = { snippets: 1, confirmedSnippets: 0, confirmedShare: 0, openFindings: 9, openBlockers: 2, chapters: 1, approvedChapters: 0, inReview: 0, evidenceCoverage: 0 };
      await built.ctx.db.run('INSERT INTO kpi_snapshots (project_id, day, metrics, updated_at) VALUES (?, ?, ?, ?)', 'p_default', ago(10), JSON.stringify(old), new Date().toISOString());
      await built.ctx.db.run('INSERT INTO kpi_snapshots (project_id, day, metrics, updated_at) VALUES (?, ?, ?, ?)', 'p_default', ago(5), JSON.stringify({ ...old, openFindings: 4 }), new Date().toISOString());

      const a = (await call('GET', `/analytics?from=${ago(7)}&to=${today}`)).json;
      expect(a.current).toMatchObject({ chapters: 2, approvedChapters: 1, inReview: 0 });
      expect(a.current.snippets).toBeGreaterThanOrEqual(3);
      expect(a.current.openFindings).toBeGreaterThanOrEqual(1); // Dublette
      expect(a.current.evidenceCoverage).toBe(100);
      expect(a.series).toHaveLength(8);
      expect(a.series[0]).toMatchObject({ day: ago(7), openFindings: 9 }); // fortgeschrieben aus dem Snapshot vor dem Zeitraum
      expect(a.series[2]).toMatchObject({ day: ago(5), openFindings: 4 });
      expect(a.series[6].openFindings).toBe(4);
      expect(a.series[7]).toMatchObject({ day: today, approvedChapters: 1 });
      const flowToday = a.flow.find((d: any) => d.day === today);
      expect(flowToday).toMatchObject({ approvals: 1, rejections: 1, imports: 1 });
      expect(flowToday.findingsOpened).toBeGreaterThanOrEqual(1);
      expect(a.approvals).toMatchObject({ decisions: 2, approved: 1, rejected: 1, firstPassRate: 0 });
      expect(a.approvals.reviewHours.median).not.toBeNull();
      expect(a.approvals.leadHours.median).not.toBeNull();
      expect((await call('GET', '/analytics?from=2026-13-01')).status).toBe(400);
      expect((await call('GET', `/analytics?from=${today}&to=${ago(3)}`)).status).toBe(400);

      // Projektbericht
      const pdf = await call('GET', '/analytics/report');
      expect(pdf.status).toBe(200);
      expect(pdf.headers['content-type']).toBe('application/pdf');
      expect(pdf.raw.subarray(0, 5).toString()).toBe('%PDF-');
      expect(pdf.raw.length).toBeGreaterThan(3000);

      // BI-Export
      const csv = await call('GET', '/analytics/export/chapters');
      expect(csv.headers['content-type']).toContain('text/csv');
      expect(csv.body.startsWith('﻿chapterId,chapter,latestVersion,latestStatus,approvedAt,openFindings,openBlockers\r\n')).toBe(true);
      expect(csv.body).toContain(`"'=HYPERLINK(""http://x"")"`); // Formel-Injektion entschärft
      expect(csv.body).toContain(',approved,');
      const appr = (await call('GET', '/analytics/export/approvals?format=json')).json;
      expect(appr.rows.map((r: any) => r.decision)).toEqual(['rejected', 'approved']);
      expect(appr.rows[1]).toMatchObject({ chapter: '1. Anmeldung', versionNo: v.versionNo });
      expect((await call('GET', `/analytics/export/kpis?format=json&from=${ago(1)}`)).json.rows).toHaveLength(2);
      expect((await call('GET', '/analytics/export/findings?format=json')).json.rows[0].id).toMatch(/^B-\d+$/);
      expect((await call('GET', '/analytics/export/flow')).body.split('\r\n')[0]).toBe('﻿day,findingsOpened,findingsResolved,approvals,rejections,imports,releases');
      expect((await call('GET', '/analytics/export/nutzer')).status).toBe(400);
      expect((await call('GET', '/analytics/export/chapters?format=xml')).status).toBe(400);

      // Projektgrenzen; archivierte Projekte schreiben keine Snapshots
      const other = (await call('POST', '/projects', { name: 'Leer' })).json;
      const oa = (await call('GET', '/analytics', undefined, 'u-admin', other.id)).json;
      expect(oa.current).toMatchObject({ snippets: 0, chapters: 0, openFindings: 0 });
      expect(oa.approvals.decisions).toBe(0);
      await call('PATCH', `/projects/${other.id}`, { archived: true });
      await built.ctx.db.run('DELETE FROM kpi_snapshots WHERE project_id = ?', other.id);
      expect((await call('GET', '/analytics', undefined, 'u-admin', other.id)).status).toBe(200);
      expect(await built.ctx.db.get('SELECT day FROM kpi_snapshots WHERE project_id = ?', other.id)).toBeUndefined();

      // Täglicher Job: genau eine geplante Ausführung
      const { runDailySnapshots } = await import('../src/services/analytics.js');
      const { withProject } = await import('../src/services/projects.js');
      await runDailySnapshots(built.ctx, (id) => withProject(built.ctx, id));
      const daily = await built.ctx.db.all("SELECT run_after FROM jobs WHERE type = 'kpi-daily' AND status = 'queued'");
      expect(daily.length).toBeGreaterThanOrEqual(1);
      expect(daily.every((j: any) => j.run_after > new Date().toISOString())).toBe(true);
    } finally {
      await built.app.close();
    }
  });
});

describe('Skalierung der semantischen Suche (ADR-024)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-146] HNSW-Graph: Trefferquote gegenüber exakter Suche, Filter, exakte Suche im Vektorspeicher, kNN-Paare', async () => {
    const { Hnsw, VectorStore } = await import('../src/domain/hnsw.js');
    const { knnPairs } = await import('../src/services/vectorIndex.js');
    let seed = 11;
    const r = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31), seed / 2 ** 31 - 0.5);
    const norm = (v: Float32Array) => {
      const n = Math.hypot(...v);
      return v.map((x) => x / n);
    };
    const D = 32;
    const store = new VectorStore(D, 16);
    for (let i = 0; i < 3000; i++) store.push(norm(Float32Array.from({ length: D }, r)));
    const h = new Hnsw(store, { M: 12, efConstruction: 64 });
    while (h.size < store.count) h.insertNext();
    let recall = 0;
    for (let t = 0; t < 30; t++) {
      const q = norm(Float32Array.from({ length: D }, r));
      const exact = store.exact(q, 10);
      expect(exact.map((e) => e.score)).toEqual([...exact.map((e) => e.score)].sort((a, b) => b - a));
      const approx = h.search(q, 10);
      recall += approx.filter((a) => exact.some((e) => e.id === a.id)).length / 10;
      // Filter: nur gerade IDs
      expect(h.search(q, 10, 200, (id) => id % 2 === 0).every((n) => n.id % 2 === 0)).toBe(true);
      expect(store.exact(q, 5, (id) => id < 100).every((n) => n.id < 100)).toBe(true);
    }
    expect(recall / 30).toBeGreaterThanOrEqual(0.9);
    // viele identische Vektoren (Textbausteine): ein Graphknoten mit Aliasen, Suche bleibt vollständig
    const dupStore = new VectorStore(D, 16);
    const bases = Array.from({ length: 40 }, () => norm(Float32Array.from({ length: D }, r)));
    for (let i = 0; i < 2000; i++) dupStore.push(bases[i % 40]);
    const dh = new Hnsw(dupStore);
    while (dh.size < dupStore.count) dh.insertNext();
    const top = dh.search(bases[3], 60, 100);
    expect(top.slice(0, 50).every((n) => n.id % 40 === 3)).toBe(true); // alle 50 Kopien zuerst
    expect(dh.search(bases[3], 5, 100, (id) => id >= 1000).every((n) => n.id % 40 === 3 && n.id >= 1000)).toBe(true);
    // kNN-Paare: Beinahe-Duplikate werden gefunden
    const base = Array.from({ length: 500 }, () => norm(Float32Array.from({ length: D }, r)));
    const dup = norm(base[7].map((x) => x + 0.001));
    const pairs = knnPairs([...base, dup], 5, 0.99);
    expect(pairs).toEqual([[7, 500, expect.any(Number)]]);
    expect(() => new VectorStore(4).push(new Float32Array(3))).toThrow();
  });

  it('[T-147] Suchmaschinen exact, hnsw und (falls verfügbar) pgvector liefern dieselben Treffer; Aktualisierung bei neuer Revision, Kapitelfilter, Status', async () => {
    const corpus = Array.from({ length: 40 }, (_, i) => `## ${i + 1}.1 Abschnitt\n\nThema ${i}: ${['Rechnung', 'Lieferung', 'Garantie', 'Leasing', 'Zulassung'][i % 5]} Nummer ${i} wird ${['geprüft', 'erfasst', 'storniert', 'freigegeben'][i % 4]} im Bereich ${i}.\n`);
    const md = `${FM}# 1. Handbuch\n\n${corpus.join('\n')}\n# 2. Werkstatt\n\n## 2.1 Zweck\n\nDie Werkstatt repariert Fahrzeuge und bestellt Ersatzteile.\n`;
    const results: Record<string, any> = {};
    const { TEST_PG } = await import('./helpers.js');
    const { pgvectorAvailable, awaitHnsw } = await import('../src/services/vectorIndex.js');
    for (const engine of ['exact', 'hnsw'] as const) {
      const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, `vec-${engine}`), logger: false, webDist: null, authMode: 'demo', vectorIndex: engine });
      const call = client(built);
      try {
        await importFile(built, 'h.md', md);
        // Näherung erst ab annThreshold Abschnitten – für den Test herabgesetzt
        await call('PUT', '/settings', { semantic: { annThreshold: 10 } });
        const q = encodeURIComponent('Werkstatt repariert Fahrzeuge');
        let res = (await call('GET', `/search/semantic?q=${q}&limit=5`)).json;
        if (engine === 'hnsw') {
          await awaitHnsw(built.ctx);
          res = (await call('GET', `/search/semantic?q=${q}&limit=5`)).json;
        }
        expect(res.engine).toBe(engine);
        expect(res.approximate).toBe(engine !== 'exact');
        expect(res.indexed).toBe(41);
        expect(res.hits[0].text).toContain('Werkstatt repariert');
        results[engine] = res.hits.map((h: any) => h.text);
        // Kapitelfilter
        const ch = (await call('GET', '/chapters')).json.find((c: any) => c.title === '1. Handbuch');
        const filtered = (await call('GET', `/search/semantic?q=${q}&chapterId=${ch.id}&limit=50&minScore=-1`)).json;
        expect(filtered.hits.length).toBe(40);
        expect(filtered.hits.every((h: any) => h.chapterId === ch.id)).toBe(true);
        // neue Revision: alter Abschnitt verschwindet, neuer wird gefunden
        await importFile(built, 'h.md', md.replace('Die Werkstatt repariert Fahrzeuge und bestellt Ersatzteile.', 'Das Autohaus verkauft Neuwagen an Privatkunden.'));
        const after = (await call('GET', `/search/semantic?q=${encodeURIComponent('Autohaus verkauft Neuwagen')}&limit=3`)).json;
        expect(after.hits[0].text).toContain('Autohaus verkauft');
        const old = (await call('GET', `/search/semantic?q=${q}&limit=50&minScore=-1`)).json;
        expect(old.hits.some((h: any) => h.text.includes('Werkstatt repariert'))).toBe(false);
        expect(old.indexed).toBe(41);
        const status = (await call('GET', '/semantic-index')).json;
        expect(status).toMatchObject({ snippets: 41, indexed: 41, index: { setting: engine, engine, vectors: 41 } });
        // anderes Projekt sieht nichts
        const other = (await call('POST', '/projects', { name: `Leer ${engine}` })).json;
        expect((await call('GET', `/search/semantic?q=${q}`, undefined, 'u-admin', other.id)).json.hits).toEqual([]);
      } finally {
        await built.app.close();
      }
    }
    expect(results.hnsw).toEqual(results.exact);

    // pgvector (nur PostgreSQL mit Erweiterung): Index ab annThreshold, exakte SQL-Suche mit Kapitelfilter, Nachziehen neuer Vektoren
    const pgApp = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'vec-pg'), logger: false, webDist: null, authMode: 'demo', vectorIndex: 'pgvector' });
    try {
      if (TEST_PG && (await pgvectorAvailable(pgApp.ctx.db))) {
        const call = client(pgApp);
        await importFile(pgApp, 'h.md', md);
        const q = encodeURIComponent('Werkstatt repariert Fahrzeuge');
        // unter annThreshold: exakt im Speicher
        expect((await call('GET', `/search/semantic?q=${q}&limit=5`)).json).toMatchObject({ engine: 'exact', approximate: false });
        await call('PUT', '/settings', { semantic: { annThreshold: 10 } });
        const res = (await call('GET', `/search/semantic?q=${q}&limit=5&minScore=-1`)).json;
        expect(res).toMatchObject({ engine: 'pgvector', approximate: true, indexed: 41 });
        expect(res.hits).toHaveLength(5); // Näherung: Rangfolge nicht garantiert (kleiner Bestand)
        expect(Number((await pgApp.ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM snippet_vectors'))!.n)).toBe(41);
        expect(await pgApp.ctx.db.get("SELECT indexname FROM pg_indexes WHERE indexname = 'idx_snippet_vectors_hnsw_384'")).toBeTruthy();
        const ch2 = (await call('GET', '/chapters')).json.find((c: any) => c.title === '2. Werkstatt');
        const inChapter = (await call('GET', `/search/semantic?q=${q}&chapterId=${ch2.id}`)).json;
        expect(inChapter.hits.map((h: any) => h.text)).toEqual(['Die Werkstatt repariert Fahrzeuge und bestellt Ersatzteile.']);
        await importFile(pgApp, 'h.md', md.replace('Die Werkstatt repariert Fahrzeuge und bestellt Ersatzteile.', 'Das Autohaus verkauft Neuwagen an Privatkunden.'));
        const after = (await call('GET', `/search/semantic?q=${encodeURIComponent('Autohaus verkauft Neuwagen')}&chapterId=${ch2.id}`)).json;
        expect(after.hits[0].text).toContain('Autohaus verkauft');
        expect(Number((await pgApp.ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM snippet_vectors'))!.n)).toBe(82); // neue Revision = neue Abschnitte; alte Zeilen filtert der Join
      }
    } finally {
      await pgApp.app.close();
    }

    // auto mit lokalem Hash-Modell: immer exakt im Speicher (Näherung nur für semantische Modelle ab annThreshold)
    const auto = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'vec-auto'), logger: false, webDist: null, authMode: 'demo', vectorIndex: 'auto' });
    try {
      await importFile(auto, 'h.md', md);
      await client(auto)('PUT', '/settings', { semantic: { annThreshold: 10 } });
      const r = (await client(auto)('GET', `/search/semantic?q=${encodeURIComponent('Werkstatt repariert Fahrzeuge')}`)).json;
      expect(r).toMatchObject({ engine: 'exact', approximate: false });
      expect(r.hits[0].text).toContain('Werkstatt repariert');
    } finally {
      await auto.app.close();
    }
  });

  it('[T-148] Hybride Analyse großer Bestände: kNN über HNSW statt n²-Vergleich', async () => {
    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'knn'), logger: false, webDist: null, authMode: 'demo' });
    try {
      const { embeddingPairs } = await import('../src/services/semantic.js');
      const paras = Array.from({ length: 30 }, (_, i) => `Eintrag ${i} über ${['Rechnung', 'Lager', 'Kasse'][i % 3]} ${i * 7}.`);
      await importFile(built, 'k.md', `${FM}# 1. K\n\n## 1.1 A\n\n${paras.join('\n\n')}\n\n## 1.2 B\n\n${paras[4]}\n`);
      const docs = await built.ctx.db.all<{ id: string; text: string }>('SELECT id, text FROM text_snippets ORDER BY seq');
      expect(docs).toHaveLength(31);
      const dupIds = docs.filter((d) => d.text === paras[4]).map((d) => d.id).sort();
      const full = await embeddingPairs(built.ctx, docs, 0.95, 1000);
      const approx = await embeddingPairs(built.ctx, docs, 0.95, 10);
      expect(full.approximate).toBe(false);
      expect(approx.approximate).toBe(true);
      const key = (ps: { a: string; b: string }[]) => ps.map((p) => `${p.a}|${p.b}`).sort();
      expect(key(approx.pairs)).toEqual(key(full.pairs));
      expect(full.pairs.map((p) => [p.a, p.b])).toContainEqual(dupIds);
    } finally {
      await built.app.close();
    }
  });
});
