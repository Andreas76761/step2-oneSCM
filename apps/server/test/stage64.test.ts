import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { SAMPLE_FACHDOKU, SAMPLE_QUICKREF } from '../src/domain/designSamples.js';
import { normalizeTheme } from '../src/domain/designs.js';
import { pptxToMarkdown } from '../src/domain/pptx.js';
import { markdownParagraphs } from '../src/domain/pptxWriter.js';
import { renderDesignPptx } from '../src/services/designPptx.js';
import { sampleMedia } from '../src/services/designTemplates.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

async function slides(buf: Buffer) {
  const zip = await JSZip.loadAsync(buf);
  const names = Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f)).sort((a, b) => parseInt(a.match(/\d+/)![0], 10) - parseInt(b.match(/\d+/)![0], 10));
  const xml = await Promise.all(names.map((n) => zip.file(n)!.async('string')));
  return { zip, xml, text: xml.map((x) => [...x.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => m[1]).join(' ')), theme: await zip.file('ppt/theme/theme1.xml')!.async('string') };
}

describe('Etappe 64', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-371] Designvorlagen als Foliensatz: Titelfolie mit Überblick, Karten, Kennzahlen, Boxen, Tabelle, Fortsetzung, Nummerierung, Anpassung (Einheit)', async () => {
    const media = await sampleMedia();
    const qr = await slides(await renderDesignPptx('quickref', SAMPLE_QUICKREF.chapters, {
      title: SAMPLE_QUICKREF.title, productLine: 'Muster', footerText: SAMPLE_QUICKREF.footer, links: SAMPLE_QUICKREF.links, faq: SAMPLE_QUICKREF.faq, asOf: '24.10.2026', media,
      theme: normalizeTheme('quickref', { primary: '#1b6e3a', accent: '#2e7d32', headingFont: 'sans' }).theme,
    }));
    const n = qr.xml.length;
    expect(n).toBeGreaterThanOrEqual(7);
    expect(qr.text[0]).toContain('oneSCM – Servicevertrag anlegen und verwalten');
    expect(qr.text[0]).toContain('Die Prozesse im Überblick');
    expect(qr.text[0]).toContain('I. Vertrag anlegen');
    qr.text.forEach((t, i) => expect(t).toContain(`STAND: 24.10.2026 | ${i + 1}/${n}`));
    const all = qr.text.join(' | ');
    for (const s of ['Anmeldung in oneSCM', 'I. Vertrag anlegen (Fortsetzung)', 'II. Vertrag verwalten', 'Wichtige Links und Ansprechpartner', 'Häufig gestellte Fragen und Antworten', 'Zahlungsintervall']) expect(all).toContain(s);
    // Nummerierung bleibt über Unterpunkte und Folgefolie erhalten
    expect(qr.xml.join('')).toContain('<a:buAutoNum type="arabicPeriod" startAt="5"/>');
    // Anpassung: Akzent als Kartenrahmen, Hauptfarbe im Hinweis, Schriften im Design
    expect(qr.xml[1]).toContain('<a:ln w="19050"><a:solidFill><a:srgbClr val="2E7D32"/>');
    expect(qr.xml[0]).toContain('<a:srgbClr val="1B6E3A"/>');
    expect(qr.theme).toContain('<a:majorFont><a:latin typeface="Segoe UI"/>');
    // Icons und Bildschirmfoto als Bilder; Bilder haben Beschreibungen, Icons sind leer (dekorativ)
    expect(Object.keys(qr.zip.files).filter((f) => f.startsWith('ppt/media/')).length).toBeGreaterThan(10);
    expect(qr.xml.join('')).toContain('descr="Startseite von oneSCM"');

    const fd = await slides(await renderDesignPptx('fachdoku', SAMPLE_FACHDOKU.chapters, { title: SAMPLE_FACHDOKU.title, docLabel: SAMPLE_FACHDOKU.docLabel, footerText: SAMPLE_FACHDOKU.footer, asOf: '24.10.2026', media }));
    const m = fd.xml.length;
    fd.text.forEach((t, i) => {
      expect(t).toContain('ONESCM FACHDOKUMENTATION · KAPITEL 4: VERTRAGSBERECHNUNG');
      expect(t).toContain(`Folie ${i + 1} von ${m}`);
    });
    expect(fd.text[0]).toContain('Kapitel 4: Vertragsberechnung');
    for (const s of ['Abschnitte', 'Handlungsschritte', 'V3', 'Freigegeben am 20.10.2026']) expect(fd.text[0]).toContain(s);
    const fall = fd.text.join(' | ');
    for (const s of ['1. Einleitung und fachlicher Auftrag', '2. Preismatrix und Fahrzeuggruppen', 'Hinweis', 'Wichtig', 'Warnung', 'Siehe auch', '1.480,00 €', 'ONE_TIME', '[Entwurf]']) expect(fall).toContain(s);
    expect(fd.xml.join('')).toContain('<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">');

    // gültiges PPTX: der eigene Import liest die Folien wieder
    const back = await pptxToMarkdown(await renderDesignPptx('fachdoku', SAMPLE_FACHDOKU.chapters, { title: SAMPLE_FACHDOKU.title, asOf: '24.10.2026', media }), 'x', 50_000_000);
    expect(back.markdown).toContain('Kapitel 4: Vertragsberechnung');
    expect(back.markdown).toContain('Preismatrix und Fahrzeuggruppen');

    // Markdown-Nummern bleiben als Startwert erhalten (auch für den Standard-Export)
    expect(markdownParagraphs('5. fünf\n6. sechs\n- Punkt')).toEqual([{ text: 'fünf', bullet: 'num', level: 0, num: 5 }, { text: 'sechs', bullet: 'num', level: 0, num: 6 }, { text: 'Punkt', bullet: 'char', level: 0 }]);
  });

  it('[T-372] Export und Muster als PowerPoint im Design', async () => {
    const built = await build('pptx');
    const call = client(built);
    try {
      const sample = await call('GET', '/design-templates/quickref/sample?format=pptx', undefined, 'u-leser');
      expect(sample.status).toBe(200);
      expect(sample.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.presentationml.presentation');
      expect(sample.headers['content-disposition']).toBe('attachment; filename="muster-quickref.pptx"');
      expect((await slides(sample.raw)).text[0]).toContain('Die Prozesse im Überblick');

      await importFile(built, 'v.md', `${FM}# 3. Vertrag verlängern\n\nSie verlängern einen laufenden Vertrag.\n\n## Schritte\n\n1. Öffnen Sie die **Vertragsverwaltung**.\n2. Klicken Sie auf **Verlängern**.\n`);
      await approveChapter(call, (await call('GET', '/chapters')).json[0].id);
      const exp = (await call('POST', '/exports', { format: 'pptx', design: 'fachdoku', profile: 'full' }, 'u-redaktion')).json;
      expect(exp.fileName).toMatch(/^onescm-handbuch-fachdoku-\d{4}-\d{2}-\d{2}\.pptx$/);
      const deck = await slides((await call('GET', `/exports/${exp.id}/download`)).raw);
      expect(deck.text[0]).toContain('3. Vertrag verlängern');
      expect(deck.text[0]).toContain('3. VERTRAG VERLÄNGERN');
      const qr = (await call('POST', '/exports', { format: 'pptx', design: 'quickref' }, 'u-redaktion')).json;
      expect(qr.fileName).toMatch(/-quickref-quickguide-.*\.pptx$/);
      // Standard-PowerPoint bleibt unverändert (Titelfolie mit Platzhaltern)
      const std = await slides((await call('GET', `/exports/${(await call('POST', '/exports', { format: 'pptx' }, 'u-redaktion')).json.id}/download`)).raw);
      expect(std.xml[0]).toContain('<p:ph type="ctrTitle"/>');
    } finally {
      await built.app.close();
    }
  });
});
