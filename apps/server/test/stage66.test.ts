import fs from 'node:fs';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { SAMPLE_FACHDOKU } from '../src/domain/designSamples.js';
import { renderDesign } from '../src/domain/designs.js';
import { checkPdfAccessibility } from '../src/domain/pdfAccessibility.js';
import { renderPdfExport } from '../src/services/exports.js';
import { browserArgs } from '../src/services/pdfBrowser.js';
import { markdownToHtml } from '../src/services/render.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

/** kleines getaggtes PDF wie aus Chromium (Katalog mit MarkInfo, Strukturbaum, Sprache, Lesezeichen) */
function taggedPdf(o: { alt?: boolean; outline?: boolean } = {}) {
  const objs = [
    '<</Title (Muster) /Producer (Test)>>',
    `<</Type /Catalog /Pages 3 0 R /MarkInfo <</Type /MarkInfo /Marked true>> /StructTreeRoot 4 0 R${o.outline === false ? '' : ' /Outlines 8 0 R'} /ViewerPreferences <</Type /ViewerPreferences /DisplayDocTitle true>> /Lang (de)>>`,
    '<</Type /Pages /Kids [] /Count 0>>',
    '<</Type /StructTreeRoot /K [5 0 R]>>',
    '<</Type /StructElem /S /H1 /P 4 0 R>>',
    `<</Type /StructElem /S /Figure /P 4 0 R${o.alt === false ? '' : ' /Alt (Startseite von oneSCM)'}>>`,
    '<</Type /StructElem /S /Table /P 4 0 R>>',
    '<</Type /Outlines /Count 0>>',
    '<</Type /StructElem /S /TH /P 7 0 R>>',
  ];
  const body = objs.map((d, i) => `${i + 1} 0 obj\n${d}\nendobj\n`).join('');
  return Buffer.from(`%PDF-1.4\n${body}trailer\n<</Size ${objs.length + 1} /Root 2 0 R /Info 1 0 R>>\nstartxref\n0\n%%EOF\n`, 'latin1');
}

describe('Etappe 66', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-376] Prüfbericht Barrierefreiheit: getaggt, Struktur, Sprache, Titel, Lesezeichen, Überschriften, Alternativtexte, Tabellenköpfe (Einheit)', async () => {
    const good = checkPdfAccessibility(taggedPdf());
    expect(good.ok).toBe(true);
    expect(good.checks.map((c) => [c.id, c.ok])).toEqual([
      ['tagged', true], ['structure', true], ['lang', true], ['title', true], ['displayTitle', true], ['outline', true], ['headings', true], ['figures', true], ['tables', true],
    ]);
    expect(good.checks.find((c) => c.id === 'lang')!.detail).toBe('de');
    expect(good.checks.find((c) => c.id === 'figures')!.detail).toBe('1 von 1');

    const noAlt = checkPdfAccessibility(taggedPdf({ alt: false, outline: false }));
    expect(noAlt.ok).toBe(false);
    expect(noAlt.checks.filter((c) => c.ok === false).map((c) => c.id)).toEqual(['outline', 'figures']);

    // Standard-PDF (pdfmake) ist nicht getaggt – der Bericht sagt es
    const std = checkPdfAccessibility(await renderPdfExport([{ title: 'Kapitel', versionNo: 1, approvedAt: null, sections: [{ code: 'steps', title: 'Schritte', blocks: [{ kind: 'paragraph', text: 'Text', roles: [], divisions: [], market: null, release: null }] }] }] as any, {}));
    expect(std.ok).toBe(false);
    expect(std.checks.find((c) => c.id === 'tagged')!.ok).toBe(false);

    // Druck mit Tags und Lesezeichen; Kennzahlen als Liste
    expect(browserArgs({ path: 'x', timeoutMs: 1, noSandbox: false }, '/t', '/t/a.html', '/t/a.pdf')).toEqual(expect.arrayContaining(['--export-tagged-pdf', '--generate-pdf-document-outline']));
    const html = renderDesign('fachdoku', SAMPLE_FACHDOKU.chapters, { title: SAMPLE_FACHDOKU.title, asOf: '24.10.2026', md: (t) => markdownToHtml(t, () => null) });
    expect(html).toContain('<ul class="fd-kpis" role="list" aria-label="Kennzahlen"><li class="fd-kpi">');
  });

  it('[T-377] Export als PDF mit Prüfbericht: im Design getaggt, im Standard mit Hinweis', async () => {
    const fake = path.join(dataDir, 'tagging-browser.mjs');
    fs.writeFileSync(fake, `#!/usr/bin/env node
import fs from 'node:fs';
const out = process.argv.slice(2).find((a) => a.startsWith('--print-to-pdf=')).slice(15);
fs.writeFileSync(out, ${JSON.stringify(taggedPdf().toString('latin1'))}, 'latin1');
`);
    fs.chmodSync(fake, 0o755);
    const database = await freshDatabase(dataDir, 'a11y');
    const built = await buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' }, pdfBrowser: { path: fake, timeoutMs: 20_000, noSandbox: false } } as any);
    const call = client(built);
    try {
      await importFile(built, 'v.md', `${FM}# 3. Vertrag verlängern\n\nSie verlängern einen laufenden Vertrag.\n`);
      await approveChapter(call, (await call('GET', '/chapters')).json[0].id);
      const design = (await call('POST', '/exports', { format: 'pdf', design: 'fachdoku' }, 'u-redaktion')).json;
      expect(design.accessibility.ok).toBe(true);
      expect(design.accessibility.checks).toHaveLength(9);
      const std = (await call('POST', '/exports', { format: 'pdf' }, 'u-redaktion')).json;
      expect(std.accessibility.ok).toBe(false);
      expect(std.accessibility.checks.find((c: any) => c.id === 'tagged').ok).toBe(false);
      // andere Formate ohne Bericht
      expect((await call('POST', '/exports', { format: 'html', design: 'fachdoku' }, 'u-redaktion')).json.accessibility).toBeUndefined();
    } finally {
      await built.app.close();
    }
  });
});
