import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { SAMPLE_FACHDOKU, SAMPLE_QUICKREF } from '../src/domain/designSamples.js';
import { normalizeTheme } from '../src/domain/designs.js';
import { renderDesignDocx } from '../src/services/designDocx.js';
import { sampleMedia } from '../src/services/designTemplates.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const parts = async (buf: Buffer) => {
  const zip = await JSZip.loadAsync(buf);
  const text = async (name: string) => (await zip.file(name)?.async('string')) ?? '';
  const files = Object.keys(zip.files);
  const headers = await Promise.all(files.filter((f) => /^word\/header\d*\.xml$/.test(f)).map(text));
  const footers = await Promise.all(files.filter((f) => /^word\/footer\d*\.xml$/.test(f)).map(text));
  return { files, doc: await text('word/document.xml'), styles: await text('word/styles.xml'), numbering: await text('word/numbering.xml'), header: headers.join(''), footer: footers.join('') };
};
const plain = (xml: string) => [...xml.matchAll(/<w:t(?: [^>]*)?>([^<]*)<\/w:t>/g)].map((m) => m[1]).join('');

describe('Etappe 63', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-368] Designvorlagen als Word: Querformat mit zwei Spalten bzw. Hochformat mit Kopfzeile, Inhalte wie im HTML, Icons, Anpassung, Nummerierung je Liste (Einheit)', async () => {
    const media = await sampleMedia();
    const qr = await parts(await renderDesignDocx('quickref', SAMPLE_QUICKREF.chapters, {
      title: SAMPLE_QUICKREF.title, productLine: 'Muster', footerText: SAMPLE_QUICKREF.footer, links: SAMPLE_QUICKREF.links, faq: SAMPLE_QUICKREF.faq, asOf: '24.10.2026', media,
      theme: normalizeTheme('quickref', { primary: '#1b6e3a', warn: '#b45309', logo: 'left' }).theme,
    }));
    expect(qr.doc).toMatch(/<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"\/>/);
    expect(qr.doc).toMatch(/<w:cols w:space="400" w:num="2" w:equalWidth="true"\/>/);
    const text = plain(qr.doc);
    for (const s of ['oneSCM – Servicevertrag anlegen und verwalten', 'Dieses Dokument ist interaktiv', 'Die Prozesse im Überblick', 'I. Vertrag anlegen', 'II. Vertrag verwalten', 'Anmeldung in oneSCM', 'Wichtige Links und Ansprechpartner', 'Häufig gestellte Fragen und Antworten', 'Hinweis', 'Muster']) expect(text).toContain(s);
    // Anpassung: Hauptfarbe im Hinweis „interaktiv“, Warnfarbe im Überblick, Logo links (Marke vor dem Titel)
    expect(qr.doc).toContain('<w:color w:val="1B6E3A"/>');
    expect(qr.doc).toContain('<w:color w:val="B45309"/>');
    expect(text.indexOf('oneSCM  ')).toBeLessThan(text.indexOf('Servicevertrag anlegen'));
    expect(qr.footer).toContain('STAND: 24.10.2026 | ');
    expect(qr.footer).toMatch(/PAGE[\s\S]*NUMPAGES/);
    // Icons als SVG mit PNG, Bildschirmfoto als PNG
    expect(qr.files.filter((f) => f.endsWith('.svg')).length).toBeGreaterThan(5);
    expect(qr.files.filter((f) => f.startsWith('word/media/') && f.endsWith('.png')).length).toBeGreaterThan(5);
    // zwei Kapitel → zwei nummerierte Listen beginnen neu; die Fortsetzung nach der Warnung zählt weiter („6.“)
    const instances = new Set([...qr.doc.matchAll(/<w:numId w:val="(\d+)"\/>/g)].map((m) => m[1]));
    expect(instances.size).toBeGreaterThanOrEqual(3); // Aufzählung + zwei nummerierte Listen

    const fd = await parts(await renderDesignDocx('fachdoku', SAMPLE_FACHDOKU.chapters, { title: SAMPLE_FACHDOKU.title, docLabel: SAMPLE_FACHDOKU.docLabel, footerText: SAMPLE_FACHDOKU.footer, asOf: '24.10.2026', media }));
    expect(fd.doc).not.toContain('w:orient="landscape"');
    expect(plain(fd.header)).toContain('ONESCM FACHDOKUMENTATION · KAPITEL 4: VERTRAGSBERECHNUNG');
    expect(plain(fd.header)).toContain('Seite ');
    expect(fd.header).toMatch(/PAGE[\s\S]*NUMPAGES/);
    expect(plain(fd.footer)).toContain('oneSCM · Fach- und Handbuchdokumentation (Muster)');
    const ft = plain(fd.doc);
    for (const s of ['Kapitel 4: Vertragsberechnung', 'Abschnitte', 'Handlungsschritte', 'Freigegeben am 20.10.2026', 'gültig ab 2026.4', '1. Einleitung und fachlicher Auftrag', '4. Ergebnis und Zahlungsintervalle', 'Hinweis', 'Wichtig', 'Warnung', 'Siehe auch', '1.480,00 €', 'ONE_TIME']) expect(ft).toContain(s);
    // echte Formatvorlagen für Navigation: Überschrift 1/2 in der Hauptfarbe, Schrift der Anpassung
    expect(fd.doc).toContain('<w:pStyle w:val="Heading1"/>');
    expect(fd.doc).toContain('<w:pStyle w:val="Heading2"/>');
    expect(fd.styles).toMatch(/w:styleId="Heading1"[\s\S]*?<w:color w:val="1F3A68"\/>/);
    expect(fd.styles).toContain('w:ascii="Segoe UI"');
  });

  it('[T-369] Export und Muster als Word im Design; Prüffassung nur im Standard; Standard-Word nummeriert je Liste neu', async () => {
    const built = await build('docx');
    const call = client(built);
    try {
      const sample = await call('GET', '/design-templates/fachdoku/sample?format=docx', undefined, 'u-leser');
      expect(sample.status).toBe(200);
      expect(sample.headers['content-type']).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      expect(sample.headers['content-disposition']).toBe('attachment; filename="muster-fachdoku.docx"');
      expect(plain((await parts(sample.raw)).doc)).toContain('Kapitel 4: Vertragsberechnung');

      await importFile(built, 'v.md', `${FM}# 3. Vertrag verlängern\n\nSie verlängern einen laufenden Vertrag.\n\n## Schritte\n\n1. Öffnen Sie die **Vertragsverwaltung**.\n2. Klicken Sie auf **Verlängern**.\n\n## Ergebnis\n\n1. Der Vertrag läuft weiter.\n2. Sie erhalten eine Bestätigung.\n`);
      await approveChapter(call, (await call('GET', '/chapters')).json[0].id);
      const qr = (await call('POST', '/exports', { format: 'docx', design: 'quickref' }, 'u-redaktion')).json;
      expect(qr.fileName).toMatch(/^onescm-handbuch-quickref-quickguide-\d{4}-\d{2}-\d{2}\.docx$/);
      const qrDoc = await parts((await call('GET', `/exports/${qr.id}/download`)).raw);
      expect(qrDoc.doc).toContain('w:orient="landscape"');
      expect(plain(qrDoc.doc)).toContain('3. Vertrag verlängern');
      const fd = (await call('POST', '/exports', { format: 'docx', design: 'fachdoku', profile: 'full' }, 'u-redaktion')).json;
      expect(fd.fileName).toMatch(/^onescm-handbuch-fachdoku-\d{4}-\d{2}-\d{2}\.docx$/);
      expect(plain((await parts((await call('GET', `/exports/${fd.id}/download`)).raw)).header)).toContain('3. VERTRAG VERLÄNGERN');
      expect((await call('POST', '/exports', { format: 'docx', design: 'fachdoku', reviewCopy: true }, 'u-redaktion')).json.detail).toBe('Die Prüffassung gibt es nur im Standard-Design.');

      // Standard-Word: zwei Listen ab 1 → zwei Zählungen
      const std = await parts((await call('GET', `/exports/${(await call('POST', '/exports', { format: 'docx' }, 'u-redaktion')).json.id}/download`)).raw);
      const numOf = (text: string) => /<w:numId w:val="(\d+)"\/>/.exec(std.doc.split('<w:p>').find((p) => p.includes(text)) ?? '')?.[1];
      expect(numOf('Öffnen Sie die')).toBeDefined();
      expect(numOf('Klicken Sie auf')).toBe(numOf('Öffnen Sie die'));
      expect(numOf('Der Vertrag läuft weiter')).toBeDefined();
      expect(numOf('Der Vertrag läuft weiter')).not.toBe(numOf('Öffnen Sie die'));
    } finally {
      await built.app.close();
    }
  });
});
