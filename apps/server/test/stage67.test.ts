import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { approveChapter, client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const CHAPTER = `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\nhelp_context: [contract.extend]\n---\n# 3. Vertrag verlängern\n\n## 3.1 Zweck\n\nSie verlängern einen laufenden Vertrag.\n\n## 3.2 Schritte\n\n1. Öffnen Sie die **Vertragsverwaltung**.\n\nAchtung: Eine Verlängerung ist nur vor Vertragsende möglich.\n`;

describe('Etappe 67', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-379] Kontexthilfe im Lesestil Handbuch-Kapitel: Farben, Schriften, Boxen mit Beschriftung und Icon; Rückmeldung mit Icons statt Emoji', async () => {
    const database = await freshDatabase(dataDir, 'help');
    const built = await buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any);
    const call = client(built);
    const embed = async (url: string) => (await built.app.inject({ method: 'GET', url })).body;
    try {
      await importFile(built, 'v.md', CHAPTER);
      await approveChapter(call, (await call('GET', '/chapters')).json[0].id);
      await call('PUT', '/help-settings', { public: true });
      expect((await call('POST', '/releases', { version: '1.0' }, 'u-freigabe')).status).toBe(201);

      const standard = await embed('/help/embed/p_default/contract.extend');
      expect(standard).toContain('<h1>3. Vertrag verlängern</h1>');
      expect(standard).not.toContain('<p class="label">');
      expect(standard).not.toMatch(/👍|👎/u);
      // Rückmeldung mit Icons (für Screenreader ausgeblendet), Name bleibt der Text
      expect(standard).toMatch(/<button type="submit" name="helpful" value="1"><svg class="ic"[^>]*aria-hidden="true"[\s\S]*?<\/svg> Ja<\/button>/);

      await call('PUT', '/design-templates/fachdoku/theme', { primary: '#5b2a86', headingFont: 'serif' });
      await call('PUT', '/layout', { readingStyle: 'fachdoku' });
      const styled = await embed('/help/embed/p_default/contract.extend');
      expect(styled).toContain('h2{border-bottom:0;border-left:4px solid #5b2a86');
      expect(styled).toMatch(/h1,h2,h3\{font-family:Georgia/);
      expect(styled).toContain('button{background:#5b2a86}');
      expect(styled).toMatch(/<div class="block kind-warning"><p class="label"><svg class="ic"[^>]*aria-hidden="true"[\s\S]*?<\/svg>Warnung<\/p>/);
      expect(styled).not.toMatch(/<script/i);
    } finally {
      await built.app.close();
    }
  });
});
