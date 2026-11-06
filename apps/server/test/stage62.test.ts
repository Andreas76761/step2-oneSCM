import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { SAMPLE_FACHDOKU, SAMPLE_QUICKREF } from '../src/domain/designSamples.js';
import { DEFAULT_THEMES, normalizeTheme, renderDesign } from '../src/domain/designs.js';
import { markdownToHtml } from '../src/services/render.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const md = (t: string) => markdownToHtml(t, () => null);
const qr = (theme?: any) => renderDesign('quickref', SAMPLE_QUICKREF.chapters, { title: SAMPLE_QUICKREF.title, asOf: '24.10.2026', md, theme });
const fd = (theme?: any) => renderDesign('fachdoku', SAMPLE_FACHDOKU.chapters, { title: SAMPLE_FACHDOKU.title, asOf: '24.10.2026', md, theme });

describe('Etappe 62', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-365] Anpassung je Vorlage: geprüfte Farben, Schriften und Logo-Position wirken im CSS; Standard unverändert (Einheit)', () => {
    // ohne Anpassung genau das Muster aus Etappe 60
    expect(qr()).toBe(qr(DEFAULT_THEMES.quickref));
    expect(fd()).toBe(fd(DEFAULT_THEMES.fachdoku));
    expect(normalizeTheme('quickref', {})).toEqual({ theme: DEFAULT_THEMES.quickref, issues: [] });

    const { theme, issues } = normalizeTheme('quickref', { primary: '#1B6E3A', accent: '#2e7d32', warn: '#b45309', headingFont: 'sans', bodyFont: 'serif', logo: 'left' });
    expect(issues).toEqual([]);
    expect(theme).toEqual({ primary: '#1b6e3a', accent: '#2e7d32', warn: '#b45309', headingFont: 'sans', bodyFont: 'serif', logo: 'left' });
    const html = qr(theme);
    expect(html).toContain('--qr-line:#2e7d32;');
    expect(html).toContain('--qr-blue:#1b6e3a;');
    expect(html).toContain('--qr-red:#b45309;');
    expect(html).toContain('<header class="qr-head logo-left">');
    expect(html).toMatch(/\.qr-head h1\{font:400 25pt\/1\.1 "Segoe UI"/);
    expect(html).toMatch(/body\{margin:0;font:10\.5pt\/1\.42 Georgia/);
    expect(qr({ ...theme, logo: 'none' })).not.toContain('class="qr-brand"');

    const f = fd(normalizeTheme('fachdoku', { primary: '#5b2a86', headingFont: 'serif', logo: 'none' }).theme);
    expect(f).toContain('--fd-navy:#5b2a86;');
    expect(f).toContain('color:#5b2a86;border-bottom:1.5px solid #5b2a86');
    expect(f).toMatch(/\.fd h1\{font:700 21pt\/1\.15 Georgia/);
    expect(f).not.toContain('class="fd-brand"');

    // Prüfung: Format, Kontrast (Text 4,5, Rahmen 3), Auswahlwerte – nichts davon gelangt ins CSS
    const bad = normalizeTheme('quickref', { primary: '#ffff00', accent: 'red;}body{display:none', warn: '#ff9999', headingFont: 'comic', logo: 'oben' });
    expect(bad.issues).toEqual([
      'Hauptfarbe #ffff00 hat zu wenig Kontrast zu Weiß (1,07 : 1, nötig 4,5 : 1).',
      'Akzentfarbe: Farbe im Format #rrggbb angeben.',
      'Warnfarbe #ff9999 hat zu wenig Kontrast zu Weiß (2,05 : 1, nötig 4,5 : 1).',
      'Schrift der Überschriften: serif (mit Serifen) oder sans (serifenlos).',
      'Logo-Position: right (rechts), left (links) oder none (ohne Logo).',
    ]);
    expect(bad.theme).toEqual(DEFAULT_THEMES.quickref);
    // Rahmenfarbe darf heller sein als Textfarbe (3 : 1)
    expect(normalizeTheme('fachdoku', { accent: '#4b8bd4' }).issues).toEqual([]);
    expect(normalizeTheme('fachdoku', { primary: '#4b8bd4' }).issues).toHaveLength(1);
  });

  it('[T-366] Anpassung speichern (Administration), Vorschau ohne Speichern, Wirkung in Muster und Export, zurücksetzen', async () => {
    const built = await build('theme');
    const call = client(built);
    try {
      const list = (await call('GET', '/design-templates', undefined, 'u-leser')).json;
      expect(list[0]).toMatchObject({ id: 'quickref', customized: false, theme: DEFAULT_THEMES.quickref, defaultTheme: DEFAULT_THEMES.quickref, minContrast: { primary: 4.5, accent: 3, warn: 4.5 } });

      // Vorschau: für Leser erlaubt, speichert nichts; ungültige Werte mit Liste
      const prev = await call('POST', '/design-templates/fachdoku/preview', { theme: { primary: '#5b2a86', logo: 'left' } }, 'u-leser');
      expect(prev.status).toBe(200);
      expect(prev.headers['content-type']).toContain('text/html');
      expect(prev.body).toContain('--fd-navy:#5b2a86;');
      expect(prev.body).toContain('fd-titlerow logo-left');
      const badPrev = await call('POST', '/design-templates/fachdoku/preview', { theme: { warn: '#ffcccc' } });
      expect(badPrev.status).toBe(400);
      expect(badPrev.json.issues).toEqual(['Warnfarbe #ffcccc hat zu wenig Kontrast zu Weiß (1,42 : 1, nötig 4,5 : 1).']);
      expect((await call('GET', '/design-templates/fachdoku/sample')).body).toContain('--fd-navy:#1f3a68;');

      // Speichern nur Administration
      expect((await call('PUT', '/design-templates/quickref/theme', { primary: '#1b6e3a' }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/design-templates/quickref/theme', { primary: '#eeeeee' })).status).toBe(400);
      expect((await call('PUT', '/design-templates/plakat/theme', { primary: '#1b6e3a' })).status).toBe(404);
      const saved = (await call('PUT', '/design-templates/quickref/theme', { primary: '#1b6e3a', headingFont: 'sans', logo: 'left' })).json;
      expect(saved).toMatchObject({ customized: true, theme: { ...DEFAULT_THEMES.quickref, primary: '#1b6e3a', headingFont: 'sans', logo: 'left' } });
      expect((await call('GET', '/design-templates/quickref/sample')).body).toContain('--qr-blue:#1b6e3a;');
      // das Firmen-Layout speichern lässt die Anpassung stehen
      const layout = (await call('GET', '/layout')).json;
      expect(layout.designThemes.quickref.primary).toBe('#1b6e3a');
      await call('PUT', '/layout', { ...layout, designThemes: {}, companyName: 'Muster GmbH' });
      expect((await call('GET', '/design-templates')).json[0].customized).toBe(true);

      // Export im Design nutzt die Anpassung
      await importFile(built, 'v.md', `${FM}# 3. Vertrag verlängern\n\nSie verlängern einen laufenden Vertrag.\n\n## Schritte\n\n1. Öffnen Sie die **Vertragsverwaltung**.\n2. Klicken Sie auf **Verlängern**.\n`);
      await approveChapter(call, (await call('GET', '/chapters')).json[0].id);
      const exp = (await call('POST', '/exports', { format: 'html', design: 'quickref' }, 'u-redaktion')).json;
      const html = (await call('GET', `/exports/${exp.id}/download`)).body;
      expect(html).toContain('--qr-blue:#1b6e3a;');
      expect(html).toContain('<header class="qr-head logo-left">');

      // Zurücksetzen
      expect((await call('DELETE', '/design-templates/quickref/theme', undefined, 'u-redaktion')).status).toBe(403);
      expect((await call('DELETE', '/design-templates/quickref/theme')).json).toMatchObject({ customized: false, theme: DEFAULT_THEMES.quickref });
      expect((await call('GET', '/design-templates/quickref/sample')).body).toContain('--qr-blue:#0870ad;');
      const events = await built.ctx.db.all<{ action: string }>("SELECT action FROM audit_events WHERE action LIKE 'layout.design_theme%'");
      expect(events.map((e) => e.action).sort()).toEqual(['layout.design_theme_reset', 'layout.design_theme_updated']);
    } finally {
      await built.app.close();
    }
  });
});
