import fs from 'node:fs';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { browserArgs, htmlToPdf } from '../src/services/pdfBrowser.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 61', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  // Ersatz für Chromium: liest die HTML-Datei aus der file:-URL, schreibt ein PDF mit ihrem Titel und protokolliert die Argumente
  const fake = path.join(dataDir, 'fake-browser.mjs');
  const argsLog = path.join(dataDir, 'args.json');
  fs.writeFileSync(fake, `#!/usr/bin/env node
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const args = process.argv.slice(2);
fs.writeFileSync(${JSON.stringify(argsLog)}, JSON.stringify(args));
const out = args.find((a) => a.startsWith('--print-to-pdf='))?.slice(15);
const html = fs.readFileSync(fileURLToPath(args.at(-1)), 'utf8');
if (html.includes('ABBRUCH')) { process.stderr.write('[1:1:ERROR:dbus] egal\\nDruck fehlgeschlagen\\n'); process.exit(3); }
if (html.includes('KEINPDF')) process.exit(0);
fs.writeFileSync(out, '%PDF-1.4\\n%' + /<title>([^<]*)<\\/title>/.exec(html)[1] + '\\n%%EOF\\n');
`);
  fs.chmodSync(fake, 0o755);
  const cfg = { path: fake, timeoutMs: 20_000, noSandbox: false };
  const build = (name: string, pdfBrowser: typeof cfg | { path: null; timeoutMs: number; noSandbox: boolean }) =>
    freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' }, pdfBrowser } as any));

  it('[T-362] Browser-Druck: Argumente ohne Netz und eigenes Profil, PDF geprüft, Fehler verständlich (Einheit)', async () => {
    const args = browserArgs(cfg, '/tmp/x', '/tmp/x/dokument.html', '/tmp/x/dokument.pdf');
    expect(args).toEqual(expect.arrayContaining(['--headless', '--host-resolver-rules=MAP * ~NOTFOUND', '--no-pdf-header-footer', '--user-data-dir=/tmp/x/profil', '--print-to-pdf=/tmp/x/dokument.pdf']));
    expect(args).not.toContain('--no-sandbox');
    expect(args.at(-1)).toBe('file:///tmp/x/dokument.html');
    expect(browserArgs({ ...cfg, noSandbox: true }, '/tmp/x', '/tmp/x/a.html', '/tmp/x/a.pdf')).toContain('--no-sandbox');

    const pdf = await htmlToPdf(cfg, '<!doctype html><title>Muster</title><p>x</p>');
    expect(pdf.toString()).toContain('%PDF-1.4\n%Muster');
    await expect(htmlToPdf(cfg, '<title>ABBRUCH</title>')).rejects.toThrow('fake-browser.mjs: Druck fehlgeschlagen');
    await expect(htmlToPdf(cfg, '<title>KEINPDF</title>')).rejects.toThrow('hat kein PDF erzeugt');
    await expect(htmlToPdf({ ...cfg, path: path.join(dataDir, 'fehlt') }, '<title>x</title>')).rejects.toThrow(/fehlt/);
    await expect(htmlToPdf({ ...cfg, path: null }, '<title>x</title>')).rejects.toThrow('PDF_BROWSER_PATH');
    // der Temp-Ordner wird aufgeräumt
    const dir = JSON.parse(fs.readFileSync(argsLog, 'utf8')).find((a: string) => a.startsWith('--user-data-dir=')).slice(16);
    expect(fs.existsSync(path.dirname(dir))).toBe(false);
  });

  it('[T-363] Export als PDF im Design und Muster als PDF mit lokalem Browser; ohne Browser verständlich abgelehnt', async () => {
    const built = await build('pdf', cfg);
    const call = client(built);
    try {
      expect((await call('GET', '/design-templates')).json.map((t: any) => t.formats)).toEqual([['html', 'pdf', 'docx', 'pptx'], ['html', 'pdf', 'docx', 'pptx']]);
      const sample = await call('GET', '/design-templates/quickref/sample?format=pdf', undefined, 'u-leser');
      expect(sample.status).toBe(200);
      expect(sample.headers['content-type']).toBe('application/pdf');
      expect(sample.headers['content-disposition']).toBe('attachment; filename="muster-quickref.pdf"');
      expect(sample.raw.toString()).toContain('%oneSCM – Servicevertrag anlegen und verwalten');
      expect((await call('GET', '/design-templates/plakat/sample?format=pdf')).status).toBe(404);

      await importFile(built, 'v.md', `${FM}# 3. Vertrag verlängern\n\nSie verlängern einen laufenden Vertrag.\n\n## Schritte\n\n1. Öffnen Sie die **Vertragsverwaltung**.\n2. Klicken Sie auf **Verlängern**.\n`);
      await approveChapter(call, (await call('GET', '/chapters')).json[0].id);
      const exp = (await call('POST', '/exports', { format: 'pdf', design: 'quickref' }, 'u-redaktion')).json;
      expect(exp).toMatchObject({ format: 'pdf', preview: null });
      expect(exp.fileName).toMatch(/^onescm-handbuch-quickref-quickguide-\d{4}-\d{2}-\d{2}\.pdf$/);
      const pdf = (await call('GET', `/exports/${exp.id}/download`)).raw.toString();
      expect(pdf).toBe('%PDF-1.4\n%3. Vertrag verlängern\n%%EOF\n');
      // ohne Design bleibt das bisherige PDF (eigener Satz, kein Browser)
      fs.rmSync(argsLog);
      const std = (await call('POST', '/exports', { format: 'pdf' }, 'u-redaktion')).json;
      expect((await call('GET', `/exports/${std.id}/download`)).raw.subarray(0, 5).toString()).toBe('%PDF-');
      expect(fs.existsSync(argsLog)).toBe(false);
      expect((await call('POST', '/exports', { format: 'md', design: 'fachdoku' }, 'u-redaktion')).json.detail).toBe('Designvorlagen gibt es für die Formate html, pdf, docx und pptx.');
    } finally {
      await built.app.close();
    }

    const failing = await build('kaputt', { ...cfg, path: path.join(dataDir, 'fehlt') });
    const c2 = client(failing);
    try {
      await importFile(failing, 'v.md', `${FM}# 4. Vertrag kündigen\n\nKlicken Sie auf **Kündigen**.\n`);
      await approveChapter(c2, (await c2('GET', '/chapters')).json[0].id);
      const r = await c2('POST', '/exports', { format: 'pdf', design: 'fachdoku' }, 'u-redaktion');
      expect(r.status).toBe(503);
      expect(r.json.detail).toMatch(/^PDF im Design konnte nicht erzeugt werden: fehlt/);
    } finally {
      await failing.app.close();
    }

    const none = await build('ohne', { path: null, timeoutMs: 1000, noSandbox: false });
    const c3 = client(none);
    try {
      expect((await c3('GET', '/design-templates')).json[0].formats).toEqual(['html', 'docx', 'pptx']);
      const r = await c3('POST', '/exports', { format: 'pdf', design: 'quickref' }, 'u-redaktion');
      expect(r.status).toBe(400);
      expect(r.json.detail).toContain('PDF_BROWSER_PATH');
      expect((await c3('GET', '/design-templates/fachdoku/sample?format=pdf')).status).toBe(400);
    } finally {
      await none.app.close();
    }
  });
});
