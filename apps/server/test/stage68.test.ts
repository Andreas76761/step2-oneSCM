import fs from 'node:fs';
import { Document, ImageRun, Packer, Paragraph, Table, TableCell, TableRow } from 'docx';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { SAMPLE_FACHDOKU, SAMPLE_QUICKREF } from '../src/domain/designSamples.js';
import { checkDocxAccessibility, checkPptxAccessibility, finishDocx } from '../src/domain/officeAccessibility.js';
import { renderPptx } from '../src/domain/pptxWriter.js';
import { renderDesignDocx } from '../src/services/designDocx.js';
import { renderDesignPptx } from '../src/services/designPptx.js';
import { sampleMedia } from '../src/services/designTemplates.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
const failed = (r: { checks: { id: string; ok: boolean | null }[] }) => r.checks.filter((c) => c.ok === false).map((c) => c.id);

describe('Etappe 68', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-381] Barrierefreiheit Word und PowerPoint: Designvorlagen ohne Befund, Icons dekorativ, Sprache, Folientitel; Lücken werden erkannt (Einheit)', async () => {
    const media = await sampleMedia();
    for (const [design, s] of [['quickref', SAMPLE_QUICKREF], ['fachdoku', SAMPLE_FACHDOKU]] as const) {
      const o = { title: s.title, asOf: '24.10.2026', media, links: 'links' in s ? s.links : undefined, faq: 'faq' in s ? s.faq : undefined };
      const docx = await renderDesignDocx(design, s.chapters, o);
      const w = await checkDocxAccessibility(docx);
      expect(failed(w), `${design} Word`).toEqual([]);
      expect(w.checks.map((c) => c.id)).toEqual(['title', 'lang', 'headings', 'figures', 'tables']);
      expect(w.checks.find((c) => c.id === 'figures')!.detail).toMatch(/dekorativ/);
      const x = await (await JSZip.loadAsync(docx)).file('word/document.xml')!.async('string');
      const ids = [...x.matchAll(/<wp:docPr id="(\d+)"/g)].map((m) => m[1]);
      expect(new Set(ids).size).toBe(ids.length);
      expect(x).toContain('adec:decorative');

      const p = await checkPptxAccessibility(await renderDesignPptx(design, s.chapters, o));
      expect(failed(p), `${design} PowerPoint`).toEqual([]);
      expect(p.checks.find((c) => c.id === 'slideTitles')!.detail).toMatch(/^(\d+) von \1/);
    }

    // Lücken: Bild ohne Alternativtext, Tabelle ohne Kopfzeile, keine Überschrift, kein Titel
    const raw = await Packer.toBuffer(new Document({ sections: [{ children: [
      new Paragraph({ children: [new ImageRun({ type: 'png', data: PNG, transformation: { width: 10, height: 10 }, altText: { name: 'Bild', description: '', title: '' } })] }),
      new Table({ rows: [0, 1].map(() => new TableRow({ children: [new TableCell({ children: [new Paragraph('x')] })] })) }),
    ] }] }));
    const gaps = await checkDocxAccessibility(await finishDocx(raw));
    expect(failed(gaps)).toEqual(['title', 'headings', 'figures', 'tables']);
    expect(gaps.checks.find((c) => c.id === 'lang')!.detail).toBe('de-DE');

    const deck = await renderPptx([
      { kind: 'title', title: 'Titel' },
      { kind: 'custom', title: 'ohne Titelplatzhalter', shapes: '', images: [] },
    ], { title: 'Folien' });
    const pr = await checkPptxAccessibility(deck);
    expect(failed(pr)).toEqual(['slideTitles']);
    expect(pr.checks.find((c) => c.id === 'slideTitles')!.detail).toBe('1 von 2');
  });

  it('[T-382] Export als Word und PowerPoint mit Prüfbericht – Standard und Designvorlage', async () => {
    const database = await freshDatabase(dataDir, 'office');
    const built = await buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any);
    const call = client(built);
    try {
      await importFile(built, 'v.md', `${FM}# 3. Vertrag verlängern\n\nSie verlängern einen laufenden Vertrag.\n\n| Feld | Bedeutung |\n| --- | --- |\n| Laufzeit | Monate |\n| Ende | Datum |\n`);
      await approveChapter(call, (await call('GET', '/chapters')).json[0].id);
      for (const format of ['docx', 'pptx'] as const) {
        for (const design of ['standard', 'fachdoku', 'quickref']) {
          const r = (await call('POST', '/exports', { format, design }, 'u-redaktion')).json;
          expect(r.accessibility, `${format} ${design}`).toBeDefined();
          expect(failed(r.accessibility), `${format} ${design}`).toEqual([]);
        }
      }
      // Word im Standard: Sprache Deutsch in den Standardformaten
      const r = (await call('POST', '/exports', { format: 'docx' }, 'u-redaktion')).json;
      expect(r.accessibility.checks.find((c: any) => c.id === 'lang').detail).toBe('de-DE');
    } finally {
      await built.app.close();
    }
  });
});
