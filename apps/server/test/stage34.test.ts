import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { headingLocators, headingSlug, htmlHeadingIds } from '../src/domain/convert.js';
import { pdfToMarkdown } from '../src/domain/pdf.js';
import { pptxToMarkdown } from '../src/domain/pptx.js';
import { renderPdf } from '../src/services/render.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';
import { png } from './png.js';

const NS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const para = (t: string, pPr = '') => `<a:p>${pPr}<a:r><a:rPr lang="de-DE"/><a:t>${t}</a:t></a:r></a:p>`;
const sp = (ph: string | null, paras: string[]) => `<p:sp><p:nvSpPr><p:cNvPr id="2" name="Form"/><p:cNvSpPr/><p:nvPr>${ph ? `<p:ph ${ph}/>` : ''}</p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/>${paras.join('')}</p:txBody></p:sp>`;
const pic = (rid: string, descr: string) => `<p:pic><p:nvPicPr><p:cNvPr id="5" name="Bild 4" descr="${descr}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="${rid}"/></p:blipFill><p:spPr/></p:pic>`;
const tbl = (rows: string[][]) => `<p:graphicFrame><p:nvGraphicFramePr><p:cNvPr id="6" name="Tabelle"/><p:cNvGraphicFramePr/><p:nvPr/></p:nvGraphicFramePr><a:graphic><a:graphicData><a:tbl>${rows.map((r) => `<a:tr>${r.map((c) => `<a:tc><a:txBody>${para(c)}</a:txBody></a:tc>`).join('')}</a:tr>`).join('')}</a:tbl></a:graphicData></a:graphic></p:graphicFrame>`;

/** Kleine PowerPoint-Datei: Titelfolie, Inhaltsfolie mit Ebenen, Bild und Notizen, Tabelle, ausgeblendete Folie */
async function pptx(image: Buffer) {
  const z = new JSZip();
  const slides = [
    { xml: sp('type="ctrTitle"', [para('Reifenprodukte in oneSCM')]) + sp('type="subTitle"', [para('Schulung für Händler')]) },
    {
      xml: sp('type="title"', [para('Reifenpaket anlegen')]) + sp('idx="1"', [para('Öffnen Sie Produkte › Reifen'), para('Wählen Sie das Reifenpaket', '<a:pPr lvl="1"/>'), para('Speichern Sie den Vertrag &amp; prüfen Sie den Status')])
        + pic('rId2', 'Maske Reifenpaket mit Tyres-Auswahl') + sp('type="sldNum"', [para('2')]),
      rels: '<Relationship Id="rId2" Type="' + REL + '/image" Target="../media/image1.png"/><Relationship Id="rId3" Type="' + REL + '/notesSlide" Target="../notesSlides/notesSlide2.xml"/>',
      notes: sp('type="body"', [para('Hinweis für Trainer: Winterreifen zuerst zeigen.')]),
    },
    { xml: sp('type="title"', [para('Statusübersicht')]) + tbl([['Status', 'Bedeutung'], ['Aktiv', 'Vertrag läuft'], ['Gekündigt', 'Vertrag endet | zum Monatsende']]) },
    { xml: sp('type="title"', [para('Interne Notizen')]) + sp('idx="1"', [para('Nicht zeigen')]), hidden: true },
    { xml: sp(null, [para('Fragen? Wenden Sie sich an den Support.')]) },
  ];
  z.file('ppt/presentation.xml', `<?xml version="1.0"?><p:presentation ${NS}><p:sldIdLst>${slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 10}"/>`).join('')}</p:sldIdLst></p:presentation>`);
  z.file('ppt/_rels/presentation.xml.rels', `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${slides.map((_, i) => `<Relationship Id="rId${i + 10}" Type="${REL}/slide" Target="slides/slide${i + 1}.xml"/>`).join('')}</Relationships>`);
  slides.forEach((s, i) => {
    z.file(`ppt/slides/slide${i + 1}.xml`, `<?xml version="1.0"?><p:sld ${NS}${s.hidden ? ' show="0"' : ''}><p:cSld><p:spTree>${s.xml}</p:spTree></p:cSld></p:sld>`);
    if (s.rels) z.file(`ppt/slides/_rels/slide${i + 1}.xml.rels`, `<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${s.rels}</Relationships>`);
    if (s.notes) z.file(`ppt/notesSlides/notesSlide${i + 1}.xml`, `<?xml version="1.0"?><p:notes ${NS}><p:cSld><p:spTree>${s.notes}</p:spTree></p:cSld></p:notes>`);
  });
  z.file('ppt/media/image1.png', image);
  return z.generateAsync({ type: 'nodebuffer' });
}

/** PDF über drei Seiten: Überschriften nach Schriftgröße, Liste, Kopfzeile und Seitenzahl auf jeder Seite */
function pdf() {
  return renderPdf({
    header: { text: 'oneSCM Handbuch – vertraulich', fontSize: 8, margin: [40, 10, 0, 0] },
    footer: (page: number, pages: number) => ({ text: `Seite ${page} von ${pages}`, fontSize: 8, margin: [40, 0, 0, 0] }),
    content: [
      { text: 'Verträge verwalten', fontSize: 22, bold: true },
      { text: 'Zweck', fontSize: 15, bold: true },
      { text: 'Mit dieser Anleitung ändern Sie einen bestehenden Vertrag. Der Vertrag bleibt dabei aktiv.' },
      { ul: ['Öffnen Sie Contract Management', 'Suchen Sie den Vertrag über die Vertragsnummer'] },
      { text: 'Kündigen', fontSize: 15, bold: true, pageBreak: 'before' },
      { text: 'Kündigen Sie den Vertrag über Beenden. Die Kündigung wird zum Monatsende wirksam.' },
      { text: 'Verlängern', fontSize: 15, bold: true, pageBreak: 'before' },
      { text: 'Verlängern Sie den Vertrag vor Ablauf der Laufzeit.' },
    ],
  });
}

describe('Etappe 34', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));

  it('[T-252] PowerPoint: je Folie ein Abschnitt mit Fundstelle, Ebenen, Tabelle, Bild mit Alternativtext, Notizen; ausgeblendete Folien entfallen (Einheit)', async () => {
    const shas: string[] = [];
    const res = await pptxToMarkdown(await pptx(png(800, 450)), 'datei', 50_000_000, async (_b, name) => (shas.push(name), 'a'.repeat(64)));
    const md = res.markdown;
    expect(md).toMatch(/^# Reifenprodukte in oneSCM\n\nSchulung für Händler\n/);
    expect(md).toContain('## Reifenpaket anlegen\n\n- Öffnen Sie Produkte › Reifen\n  - Wählen Sie das Reifenpaket\n- Speichern Sie den Vertrag & prüfen Sie den Status');
    expect(md).toContain(`![Maske Reifenpaket mit Tyres-Auswahl](media:${'a'.repeat(64)})`);
    expect(md).toContain('> Hinweis für Trainer: Winterreifen zuerst zeigen.');
    expect(md).toContain('| Status | Bedeutung |\n| --- | --- |\n| Aktiv | Vertrag läuft |\n| Gekündigt | Vertrag endet \\| zum Monatsende |');
    expect(md).toContain('## Folie 5\n\nFragen? Wenden Sie sich an den Support.');
    expect(md).not.toContain('Nicht zeigen');
    expect(md).not.toMatch(/^2$/m); // Foliennummer
    expect(res.warnings).toEqual(['Ausgeblendete Folien nicht eingelesen: 4']);
    expect(shas).toEqual(['image1.png']);
    const lines = md.split('\n');
    expect(res.locators.map((l) => [lines[l.line - 1], l.locator.slide])).toEqual([
      ['# Reifenprodukte in oneSCM', 1], ['## Reifenpaket anlegen', 2], ['## Statusübersicht', 3], ['## Folie 5', 5],
    ]);
    expect(res.images).toEqual([expect.objectContaining({ slide: 2, title: 'Reifenpaket anlegen', text: expect.stringContaining('Winterreifen') })]);
    await expect(pptxToMarkdown(Buffer.from('kein zip'), 'x', 1000)).rejects.toThrow();
    const empty = new JSZip();
    empty.file('word/document.xml', '<x/>');
    await expect(pptxToMarkdown(await empty.generateAsync({ type: 'nodebuffer' }), 'x', 1000)).rejects.toThrow('Keine gültige PowerPoint-Datei');
  });

  it('[T-253] PDF: Überschriften nach Schriftgröße, Absätze, Liste, Fundstelle je Seite; Kopf-/Fußzeilen und Seitenzahlen entfallen (Einheit)', async () => {
    const res = await pdfToMarkdown(await pdf(), 'datei');
    const md = res.markdown;
    expect(md).toMatch(/^# Verträge verwalten\n\n## Zweck\n\nMit dieser Anleitung ändern Sie einen bestehenden Vertrag\. Der Vertrag bleibt dabei aktiv\.\n\n- Öffnen Sie Contract Management\n- Suchen Sie den Vertrag über die Vertragsnummer\n/);
    expect(md).toContain('## Kündigen\n\nKündigen Sie den Vertrag über Beenden. Die Kündigung wird zum Monatsende wirksam.');
    expect(md).toContain('## Verlängern');
    expect(md).not.toContain('vertraulich');
    expect(md).not.toMatch(/Seite \d von \d/);
    const lines = md.split('\n');
    expect(res.locators.map((l) => [l.locator.page, lines[l.line - 1]])).toEqual([[1, '# Verträge verwalten'], [2, '## Kündigen'], [3, '## Verlängern']]);
    await expect(pdfToMarkdown(Buffer.from('%PDF-1.4 kaputt'), 'x')).rejects.toThrow('Keine gültige PDF-Datei');
    const blank = await pdfToMarkdown(await renderPdf({ content: [{ canvas: [{ type: 'rect', x: 0, y: 0, w: 50, h: 50 }] }] }), 'leer');
    expect(blank.skip).toMatch(/ohne Textebene/);
  });

  it('[T-254] Einlesen über die API: Fundstelle je Chunk (Folie, Seite, Abschnitt), Bild mit Gliederungs-Vorschlag aus dem Folientext (F-25), nur von Hand übernommen', async () => {
    const built = await build('m2');
    const call = client(built);
    try {
      const image = png(900, 500, [10, 90, 160]);
      const z = new JSZip();
      z.file('schulung/reifen.pptx', await pptx(image));
      z.file('handbuch/vertraege.pdf', await pdf());
      z.file('confluence/status.html', '<html><head><title>Handbuch : Statusmodell</title></head><body><h2 id="Statusmodell-Aktiv">Aktiv</h2><p>Der Vertrag läuft.</p><h2>Gekündigt</h2><p>Der Vertrag endet.</p></body></html>');
      const up = await importFile(built, 'm2.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const imp = (await call('GET', `/imports/${up.id}`)).json;
      const items = Object.fromEntries(imp.items.map((i: any) => [i.path, i]));
      expect(items['schulung/reifen.pptx']).toMatchObject({ status: 'imported' });
      expect(items['schulung/reifen.pptx'].message).toContain('Ausgeblendete Folien nicht eingelesen: 4');
      expect(items['handbuch/vertraege.pdf'].status).toBe('imported');

      const chunks = (await call('GET', '/metadata/chunks?limit=200', undefined, 'u-leser')).json.items;
      const find = (t: string) => chunks.find((c: any) => c.text.includes(t));
      expect(find('Wählen Sie das Reifenpaket')).toMatchObject({ format: 'pptx', locator: { slide: 2 } });
      expect(find('Vertrag endet \\| zum Monatsende')).toMatchObject({ locator: { slide: 3 } });
      expect(find('Kündigung wird zum Monatsende')).toMatchObject({ format: 'pdf', locator: { page: 2 } });
      expect(find('Der Vertrag läuft.')).toMatchObject({ format: 'html', locator: { anchor: 'Statusmodell-Aktiv' } });
      expect(find('Der Vertrag endet.')).toMatchObject({ locator: { anchor: 'gekundigt' } });
      // Original bleibt abrufbar
      const src = (await call('GET', '/sources')).json.find((s: any) => s.path === 'schulung/reifen.pptx');
      const orig = await call('GET', `/source-revisions/${src.revisions[0].id}/original`, undefined, 'u-leser');
      expect(orig.status).toBe(200);
      expect(orig.headers['content-type']).toContain('presentationml');

      // F-25: Bild aus Folie 2 mit Bildunterschrift aus dem Folientitel und Gliederungs-Vorschlag „13 Reifenprodukte“
      const { sha256 } = await import('../src/domain/similarity.js');
      const arch = (await call('GET', '/image-archive')).json.items.find((i: any) => i.sha === sha256(image));
      expect(arch).toMatchObject({ title: 'Reifenpaket anlegen', outline: null, source: { path: 'schulung/reifen.pptx', slide: 2, slideTitle: 'Reifenpaket anlegen' } });
      const top = arch.source.suggestions[0];
      expect(top).toMatchObject({ code: 'outline.kap13' });
      expect(top.matched).toEqual(expect.arrayContaining(['reifenprodukt', 'tyre']));
      expect((await call('PATCH', `/image-archive/${arch.sha}`, { outlineLabelId: 'falsch' }, 'u-redaktion')).status).toBe(400);
      const ok = (await call('PATCH', `/image-archive/${arch.sha}`, { outlineLabelId: top.labelId }, 'u-redaktion')).json;
      expect(ok.outline).toMatchObject({ code: 'outline.kap13' });

      // Standard-Formatliste enthält PowerPoint und PDF; einzelne PDF-Datei direkt einlesen
      expect((await call('GET', '/settings')).json.import.allowedExtensions).toEqual(expect.arrayContaining(['.pptx', '.pdf']));
      const single = await importFile(built, 'Kurzanleitung.pdf', await pdf());
      expect((await call('GET', `/imports/${single.id}`)).json).toMatchObject({ status: 'completed', items: [expect.objectContaining({ path: 'Kurzanleitung.pdf', status: 'imported' })] });
    } finally {
      await built.app.close();
    }
  });

  it('[T-255] Abschnitts-Anker für HTML und Word (Einheit)', () => {
    expect(headingSlug('3.2 Verträge ändern & prüfen')).toBe('3-2-vertrage-andern-prufen');
    expect(headingSlug('Straße')).toBe('strasse');
    const ids = htmlHeadingIds('<h1 id="top">Start</h1><h2 class="x" id="Abschnitt-B">B <b>fett</b></h2><h3>ohne</h3>');
    expect([...ids]).toEqual([['Start', 'top'], ['B fett', 'Abschnitt-B']]);
    const md = '# Start\n\nText\n\n```\n# kein Titel\n```\n\n## B fett\n\n### ohne ###\n';
    expect(headingLocators(md, ids)).toEqual([
      { line: 1, locator: { anchor: 'top' } }, { line: 9, locator: { anchor: 'Abschnitt-B' } }, { line: 11, locator: { anchor: 'ohne' } },
    ]);
  });
});
