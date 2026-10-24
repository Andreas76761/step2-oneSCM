import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { DESIGN_ICONS } from '../src/domain/designIcons.js';
import { SAMPLE_FACHDOKU, SAMPLE_QUICKREF } from '../src/domain/designSamples.js';
import { renderDesign } from '../src/domain/designs.js';
import { markdownToHtml } from '../src/services/render.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const md = (t: string) => markdownToHtml(t, () => null);

describe('Etappe 60', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-359] Designvorlagen: Quick Reference Guide (A4 quer) und Handbuch-Kapitel (A4 hoch) mit Icons, ohne Skripte und externe Quellen (Einheit)', () => {
    const qr = renderDesign('quickref', SAMPLE_QUICKREF.chapters, { title: SAMPLE_QUICKREF.title, productLine: 'für Transporter', footerText: SAMPLE_QUICKREF.footer, links: SAMPLE_QUICKREF.links, faq: SAMPLE_QUICKREF.faq, asOf: '24.10.2026', md });
    expect(qr).toContain('size:A4 landscape');
    expect(qr).toContain('content:"STAND: 24.10.2026 | " counter(page) "/" counter(pages)');
    expect(qr).toContain(`"Hinweis: ${SAMPLE_QUICKREF.footer}"`);
    expect(qr).toContain('<h1>oneSCM – Servicevertrag anlegen und verwalten</h1>');
    expect(qr).toContain('<em>für Transporter</em>');
    // Überblick mit römischen Nummern, Karten je Abschnitt, Warnbox, Links und FAQ
    expect(qr).toContain('Die Prozesse im Überblick');
    expect(qr).toContain('<h3>I. Vertrag anlegen</h3>');
    expect(qr).toContain('<h3>II. Vertrag verwalten</h3>');
    expect(qr.match(/class="qr-warn"/g)).toHaveLength(2);
    expect(qr).toContain('<strong>Hinweis</strong>: Bei fehlenden');
    expect(qr).toContain('Wichtige Links und Ansprechpartner');
    expect(qr).toContain('Häufig gestellte Fragen und Antworten');
    expect(qr).toContain('Dieses Dokument ist interaktiv');
    // ohne Logo ein neutrales Zeichen (Lucide „book-open“), mit Logo das Bild
    expect(qr).toContain(`<span class="qr-mark"><svg class="ic"`);
    expect(renderDesign('quickref', SAMPLE_QUICKREF.chapters, { title: 'T', logo: 'data:image/png;base64,AA==', brand: 'Muster GmbH', asOf: '01.01.2026', md })).toContain('<img class="qr-logo" src="data:image/png;base64,AA==" alt="Muster GmbH">');

    const fd = renderDesign('fachdoku', SAMPLE_FACHDOKU.chapters, { title: SAMPLE_FACHDOKU.title, docLabel: SAMPLE_FACHDOKU.docLabel, footerText: SAMPLE_FACHDOKU.footer, asOf: '24.10.2026', md });
    expect(fd).toContain('size:A4;');
    expect(fd).toContain('content:"ONESCM FACHDOKUMENTATION · KAPITEL 4: VERTRAGSBERECHNUNG"');
    expect(fd).toContain('content:"Seite " counter(page) " von " counter(pages)');
    expect(fd).toMatch(/<h2>1\. Einleitung und fachlicher Auftrag<\/h2>/);
    expect(fd).toMatch(/<h2>4\. Ergebnis und Zahlungsintervalle<\/h2>/);
    expect(fd).toContain('class="fd-kpis"');
    for (const box of ['info', 'tip', 'warn', 'xref']) expect(fd).toContain(`class="fd-box ${box}"`);
    expect(fd).toContain('<table');
    expect(fd).toContain('<pre');

    for (const html of [qr, fd]) {
      expect(html).not.toMatch(/<script|<link|https?:\/\/(?!(portal|onescm|schulung)\.example\.org)[^"]*\.(css|js|woff)/i);
      expect(html).toContain(`content="default-src 'none'; style-src 'unsafe-inline'; img-src data:"`);
      expect(html).toMatch(/<svg class="ic"[^>]*aria-hidden="true"/);
      expect(html).not.toMatch(/Mercedes|Daimler/i);
    }
    // Titel mit Sonderzeichen werden maskiert, auch in den Seitenrändern
    const evil = renderDesign('fachdoku', SAMPLE_FACHDOKU.chapters, { title: 'A "<b>" \\ B', asOf: '01.01.2026', md });
    expect(evil).toContain('<title>A &quot;&lt;b&gt;&quot; \\ B</title>');
    expect(evil).not.toContain('content:"A "<b>"');
    expect(Object.keys(DESIGN_ICONS).length).toBeGreaterThanOrEqual(30);
  });

  it('[T-360] Export in einer Designvorlage, Muster je Vorlage, neue Felder im Firmen-Layout', async () => {
    const built = await build('design');
    const call = client(built);
    try {
      const list = (await call('GET', '/design-templates', undefined, 'u-leser')).json;
      expect(list.map((t: any) => [t.id, t.page])).toEqual([['quickref', 'A4 quer'], ['fachdoku', 'A4 hoch']]);
      expect(list[0]).toMatchObject({ name: 'Quick Reference Guide', sampleUrl: '/api/v1/design-templates/quickref/sample' });

      // Firmen-Layout: Zusatz, Dokumentart, Links (nur Administration)
      expect((await call('PUT', '/layout', { productLine: 'für Transporter' }, 'u-redaktion')).status).toBe(403);
      const lay = (await call('PUT', '/layout', { companyName: 'Muster GmbH', productLine: 'für Transporter', docLabel: 'Muster Fachdokumentation', quickRefLinks: '- **Hilfe**: [hilfe@example.org](mailto:hilfe@example.org)\r\n' })).json;
      expect(lay).toMatchObject({ productLine: 'für Transporter', docLabel: 'Muster Fachdokumentation', quickRefLinks: '- **Hilfe**: [hilfe@example.org](mailto:hilfe@example.org)' });
      expect((await call('PUT', '/layout', { quickRefLinks: 'x'.repeat(2001) })).status).toBe(400);

      const qrSample = await call('GET', '/design-templates/quickref/sample', undefined, 'u-leser');
      expect(qrSample.status).toBe(200);
      expect(qrSample.headers['content-type']).toContain('text/html');
      expect(qrSample.body).toContain('<em>für Transporter</em>');
      expect(qrSample.body).toContain('hilfe@example.org');
      expect(qrSample.body).toContain('src="data:image/svg+xml;base64,');
      const fdSample = (await call('GET', '/design-templates/fachdoku/sample')).body;
      expect(fdSample).toContain('MUSTER FACHDOKUMENTATION · KAPITEL 4: VERTRAGSBERECHNUNG');
      expect((await call('GET', '/design-templates/standard/sample')).status).toBe(404);

      // Export: freigegebenes Kapitel im Quick Reference Guide (Profil Quick Guide) und als Handbuch-Kapitel
      await importFile(built, 'v.md', `${FM}# 3. Vertrag verlängern\n\nSie verlängern einen laufenden Vertrag.\n\n## Schritte\n\n1. Öffnen Sie die **Vertragsverwaltung**.\n2. Klicken Sie auf **Verlängern**.\n\nAchtung: Eine Verlängerung ist nur vor Vertragsende möglich.\n`);
      const ch = (await call('GET', '/chapters')).json[0];
      await approveChapter(call, ch.id);
      const qr = (await call('POST', '/exports', { format: 'html', design: 'quickref' }, 'u-redaktion')).json;
      expect(qr.fileName).toMatch(/^onescm-handbuch-quickref-quickguide-\d{4}-\d{2}-\d{2}\.html$/);
      const qrHtml = (await call('GET', `/exports/${qr.id}/download`)).body;
      expect(qrHtml).toContain('size:A4 landscape');
      expect(qrHtml).toContain('<h1>3. Vertrag verlängern</h1>');
      expect(qrHtml).toContain('Muster GmbH');
      expect(qrHtml).toContain('Die Prozesse im Überblick');
      const fd = (await call('POST', '/exports', { format: 'html', design: 'fachdoku', profile: 'full' }, 'u-redaktion')).json;
      expect(fd.fileName).toMatch(/^onescm-handbuch-fachdoku-\d{4}-\d{2}-\d{2}\.html$/);
      const fdHtml = (await call('GET', `/exports/${fd.id}/download`)).body;
      expect(fdHtml).toContain('MUSTER FACHDOKUMENTATION · 3. VERTRAG VERLÄNGERN');
      expect(fdHtml).toContain('class="fd-kpis"');
      // Standard bleibt unverändert
      expect((await call('GET', `/exports/${(await call('POST', '/exports', { format: 'html' }, 'u-redaktion')).json.id}/download`)).body).not.toContain('class="fd-kpis"');

      // Prüfungen
      expect((await call('POST', '/exports', { format: 'docx', design: 'quickref' }, 'u-redaktion')).json.detail).toContain('Designvorlagen gibt es für das Format html');
      expect((await call('POST', '/exports', { format: 'html', design: 'plakat' }, 'u-redaktion')).status).toBe(400);
    } finally {
      await built.app.close();
    }
  });
});
