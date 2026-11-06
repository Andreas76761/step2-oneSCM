import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { readingCss, readingIcon, normalizeTheme, DEFAULT_THEMES } from '../src/domain/designs.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 65', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-374] Lesestil Handbuch-Kapitel: Einstellung, Online-Hilfe mit Farben, Schriften, Balken und Icons der Designvorlage; Standard unverändert', async () => {
    // Baustein: CSS aus der Anpassung, Icon je Hinweisart
    const css = readingCss(normalizeTheme('fachdoku', { primary: '#5b2a86', headingFont: 'serif' }).theme);
    expect(css).toContain('header{background:#5b2a86}');
    expect(css).toContain('h2{border-bottom:0;border-left:4px solid #5b2a86');
    expect(css).toMatch(/h1,h2,h3\{font-family:Georgia/);
    expect(css).toContain(`.kind-warning{border-left-color:${DEFAULT_THEMES.fachdoku.warn}`);
    expect(readingIcon('warning')).toMatch(/^<svg class="ic"[^>]*aria-hidden="true"/);
    expect(readingIcon('paragraph')).toBe('');

    const built = await build('reading');
    const call = client(built);
    try {
      expect((await call('GET', '/layout', undefined, 'u-leser')).json.readingStyle).toBe('standard');
      expect((await call('PUT', '/layout', { readingStyle: 'fachdoku' }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/layout', { readingStyle: 'plakat' })).status).toBe(400);

      await importFile(built, 'v.md', `${FM}# 3. Vertrag verlängern\n\nSie verlängern einen laufenden Vertrag.\n\n## Schritte\n\n1. Öffnen Sie die **Vertragsverwaltung**.\n\nAchtung: Eine Verlängerung ist nur vor Vertragsende möglich.\n`);
      await approveChapter(call, (await call('GET', '/chapters')).json[0].id);
      const site = async (version: string) => {
        const rel = await call('POST', '/releases', { version }, 'u-freigabe');
        expect(rel.status).toBe(201);
        const zip = await JSZip.loadAsync((await call('GET', `/releases/${rel.json.id}/download?format=site`)).raw);
        const pages = await Promise.all(Object.keys(zip.files).filter((f) => f.endsWith('.html')).map((f) => zip.file(f)!.async('string')));
        return pages.find((p) => p.includes('<h1>3. Vertrag verlängern</h1>'))!;
      };
      const standard = await site('1.0');
      expect(standard).toBeDefined();
      expect(standard).not.toContain('border-left:4px solid #1f3a68');
      expect(standard).not.toContain('<svg');

      await call('PUT', '/design-templates/fachdoku/theme', { primary: '#5b2a86' });
      expect((await call('PUT', '/layout', { readingStyle: 'fachdoku' })).json.readingStyle).toBe('fachdoku');
      const styled = await site('1.1');
      expect(styled).toContain('header{background:#5b2a86}');
      expect(styled).toContain('h2{border-bottom:0;border-left:4px solid #5b2a86');
      // Hinweisboxen mit Icon vor der Beschriftung, Icons für Screenreader ausgeblendet; weiterhin ohne Skripte
      expect(styled).toMatch(/<p class="label"><svg class="ic"[^>]*aria-hidden="true"/);
      expect(styled).not.toMatch(/<script/i);
    } finally {
      await built.app.close();
    }
  });
});
