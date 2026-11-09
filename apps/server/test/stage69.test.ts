import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { checkHtmlAccessibility } from '../src/domain/htmlAccessibility.js';
import { SAMPLE_FACHDOKU, SAMPLE_QUICKREF } from '../src/domain/designSamples.js';
import { renderDesign } from '../src/domain/designs.js';
import { renderHtml } from '../src/services/exports.js';
import { markdownToHtml } from '../src/services/render.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const failed = (r: { checks: { id: string; ok: boolean | null }[] }) => r.checks.filter((c) => c.ok === false).map((c) => c.id);

describe('Etappe 69', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-384] Prüfbericht HTML: Designvorlagen und Standard ohne Befund, Lücken werden erkannt, Icons und dekorative Bilder zählen nicht (Einheit)', () => {
    for (const [design, s] of [['quickref', SAMPLE_QUICKREF], ['fachdoku', SAMPLE_FACHDOKU]] as const) {
      const html = renderDesign(design, s.chapters, { title: s.title, asOf: '24.10.2026', links: 'links' in s ? s.links : undefined, faq: 'faq' in s ? s.faq : undefined, md: (t) => markdownToHtml(t, () => null) });
      const r = checkHtmlAccessibility(html);
      expect(failed(r), design).toEqual([]);
      expect(r.checks.map((c) => c.id)).toEqual(['lang', 'title', 'main', 'headings', 'figures', 'icons', 'tables', 'links']);
      expect(Number(/^(\d+) von \1$/.exec(r.checks.find((c) => c.id === 'icons')!.detail!)?.[1])).toBeGreaterThan(0);
    }
    // Standard-HTML hat jetzt einen Hauptbereich
    const std = renderHtml([{ title: 'Kapitel', versionNo: 1, approvedAt: null, sections: [{ code: 'steps', title: 'Schritte', blocks: [{ kind: 'paragraph', text: 'Text [Hilfe](https://hilfe.example.org)\n\n| Feld | Wert |\n|---|---|\n| a | 1 |', roles: [], divisions: [], market: null, release: null }] }] }] as any, {} as any);
    expect(std).toMatch(/<main>[\s\S]*<\/main>/);
    expect(failed(checkHtmlAccessibility(std))).toEqual([]);

    const bad = checkHtmlAccessibility(`<!doctype html><html><head><title> </title></head><body><h2>A</h2><h4>B</h4>
      <img src="a.png" alt=""><img src="b.png"><img src="c.png" alt="" aria-hidden="true"><img src="d.png" alt="Maske Vertrag">
      <svg viewBox="0 0 1 1"></svg><svg aria-hidden="true"></svg><svg role="img" aria-label="Status"></svg>
      <table><tr><td>x</td></tr></table><table role="presentation"><tr><td>Layout</td></tr></table>
      <a href="https://x.example.org"></a><a href="#k"><img src="e.png" alt="Weiter"></a><a href="#n" aria-label="Nächste Seite"><svg aria-hidden="true"></svg></a><a name="anker"></a></body></html>`);
    expect(failed(bad)).toEqual(['lang', 'title', 'main', 'headings', 'figures', 'icons', 'tables', 'links']);
    const detail = Object.fromEntries(bad.checks.map((c) => [c.id, c.detail]));
    expect(detail).toMatchObject({ headings: '2 Überschriften, 1 Sprünge', figures: '2 von 4, 1 dekorativ', icons: '3 von 4', tables: '0 von 1', links: '2 von 3' });
  });

  it('[T-385] Export als HTML mit Prüfbericht – Standard und Designvorlagen; andere Textformate ohne Bericht', async () => {
    const database = await freshDatabase(dataDir, 'html');
    const built = await buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any);
    const call = client(built);
    try {
      await importFile(built, 'v.md', `${FM}# 3. Vertrag verlängern\n\nSie verlängern einen laufenden Vertrag.\n\n| Feld | Bedeutung |\n| --- | --- |\n| Laufzeit | Monate |\n`);
      await approveChapter(call, (await call('GET', '/chapters')).json[0].id);
      for (const design of ['standard', 'fachdoku', 'quickref']) {
        const r = (await call('POST', '/exports', { format: 'html', design }, 'u-redaktion')).json;
        expect(r.accessibility, design).toBeDefined();
        expect(failed(r.accessibility), design).toEqual([]);
      }
      expect((await call('POST', '/exports', { format: 'md' }, 'u-redaktion')).json.accessibility).toBeUndefined();
      expect((await call('POST', '/exports', { format: 'json' }, 'u-redaktion')).json.accessibility).toBeUndefined();
    } finally {
      await built.app.close();
    }
  });
});
