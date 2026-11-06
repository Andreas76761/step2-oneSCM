import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { normalizeSection, wordDiff } from '../src/domain/sectionDupes.js';
import { renderPdf } from '../src/services/render.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const STEPS = [
  'Öffnen Sie im Contract Management die Vertragssuche und suchen Sie den Vertrag über die Vertragsnummer',
  'Wählen Sie den Vertrag in der Trefferliste aus und prüfen Sie Laufzeit, Kunde und Fahrzeug',
  'Klicken Sie auf Beenden und bestätigen Sie die Kündigung zum Monatsende mit Speichern',
];

async function pptx() {
  const NS = 'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"';
  const REL = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const p = (t: string) => `<a:p><a:r><a:t>${t}</a:t></a:r></a:p>`;
  const sp = (ph: string, paras: string[]) => `<p:sp><p:nvSpPr><p:cNvPr id="2" name="F"/><p:cNvSpPr/><p:nvPr><p:ph ${ph}/></p:nvPr></p:nvSpPr><p:spPr/><p:txBody><a:bodyPr/>${paras.join('')}</p:txBody></p:sp>`;
  const z = new JSZip();
  z.file('ppt/presentation.xml', `<p:presentation ${NS}><p:sldIdLst><p:sldId id="256" r:id="rId1"/></p:sldIdLst></p:presentation>`);
  z.file('ppt/_rels/presentation.xml.rels', `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="${REL}/slide" Target="slides/slide1.xml"/></Relationships>`);
  z.file('ppt/slides/slide1.xml', `<p:sld ${NS}><p:cSld><p:spTree>${sp('type="title"', [p('Vertrag kündigen')])}${sp('idx="1"', STEPS.map(p))}</p:spTree></p:cSld></p:sld>`);
  return z.generateAsync({ type: 'nodebuffer' });
}
const pdf = () => renderPdf({ content: [{ text: 'Kündigung im Handbuch', fontSize: 22, bold: true }, { text: 'Vertrag kündigen', fontSize: 15, bold: true }, { ol: [...STEPS] }] }); // Kopie: pdfmake verändert das übergebene Array

describe('Etappe 36', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));

  it('[T-260] Abschnittstext formatneutral normalisieren, Unterschiede wortweise (Einheit)', () => {
    const asList = normalizeSection(['- Öffnen Sie **Verträge**\n- Klicken Sie auf *Neu*', '![Maske](media:abc)']);
    const asText = normalizeSection(['1. Öffnen Sie Verträge', '2) Klicken Sie auf Neu']);
    expect(asList).toBe('Öffnen Sie Verträge Klicken Sie auf Neu');
    expect(asText).toBe(asList);
    expect(normalizeSection(['| Status | Bedeutung |\n| --- | --- |\n| Aktiv | läuft |', '> Hinweis: [Link](http://x)'])).toBe('Status Bedeutung Aktiv läuft Hinweis: Link');
    const d = wordDiff('Kündigung zum Monatsende wirksam', 'Kündigung zum Quartalsende wirksam');
    expect(d).toEqual([{ op: '=', text: 'Kündigung zum ' }, { op: '-', text: 'Monatsende' }, { op: '+', text: 'Quartalsende' }, { op: '=', text: ' wirksam' }]);
  });

  it('[T-261] Dubletten über Formate: Folie und PDF-Abschnitt exakt gleich, ähnliche Fassung ab 85 %, nur geänderte Dateien neu, Entscheidung überlebt erneutes Einlesen', async () => {
    const built = await build('dubletten');
    const call = client(built);
    try {
      const md = (end: string) => `${FM}# Schulung Verträge\n\n## Vertrag kündigen\n\n${STEPS.slice(0, 2).map((s) => `- ${s}`).join('\n')}\n- Klicken Sie auf Beenden und bestätigen Sie die Kündigung ${end} mit Speichern\n\n## Kontakt\n\nBei Fragen wenden Sie sich bitte an den Support Ihres Marktes.\n`;
      const z = new JSZip();
      z.file('schulung/kuendigen.pptx', await pptx());
      z.file('handbuch/kuendigen.pdf', await pdf());
      z.file('notizen/kuendigen.md', md('zum Ende des Monats'));
      await importFile(built, 'd.zip', await z.generateAsync({ type: 'nodebuffer' }));

      const list = (await call('GET', '/metadata/duplicates?status=all', undefined, 'u-leser')).json;
      expect(list.summary).toMatchObject({ exact: 1, crossFormat: 3, open: 3 });
      const exact = list.items.find((p: any) => p.kind === 'exact');
      expect([exact.a.format, exact.b.format].sort()).toEqual(['pdf', 'pptx']);
      expect(exact).toMatchObject({ score: 1, crossFormat: true });
      expect(exact.a.title).toBe('Vertrag kündigen');
      const pptxSide = exact.a.format === 'pptx' ? exact.a : exact.b;
      expect(pptxSide.locator).toEqual({ slide: 1 });
      const near = list.items.filter((p: any) => p.kind === 'near');
      expect(near).toHaveLength(2);
      for (const n of near) expect(n.score).toBeGreaterThanOrEqual(0.85);
      expect(list.items.some((p: any) => p.a.title === 'Kontakt' || p.b.title === 'Kontakt')).toBe(false);
      const groups = (await call('GET', '/metadata/duplicates/groups?crossFormat=true')).json;
      expect(groups).toHaveLength(1);
      expect(groups[0].formats.sort()).toEqual(['markdown', 'pdf', 'pptx']);

      // nebeneinander mit Unterschieden
      const one = (await call('GET', `/metadata/duplicates/${near[0].id}`)).json;
      expect(one.diff.some((o: any) => o.op === '-' || o.op === '+')).toBe(true);
      expect(one.chunksA.length + one.chunksB.length).toBeGreaterThanOrEqual(2);

      // Entscheidung: nur Bearbeitung, Werte geprüft
      expect((await call('PUT', `/metadata/duplicates/${exact.id}/decision`, { decision: 'leading', leading: 'a' }, 'u-leser')).status).toBe(403);
      expect((await call('PUT', `/metadata/duplicates/${exact.id}/decision`, { decision: 'leading' }, 'u-redaktion')).status).toBe(400);
      const pdfLeads = exact.a.format === 'pdf' ? 'a' : 'b';
      const decided = (await call('PUT', `/metadata/duplicates/${exact.id}/decision`, { decision: 'leading', leading: pdfLeads, note: 'Handbuch ist führend' }, 'u-redaktion')).json;
      expect(decided.decision).toMatchObject({ decision: 'leading', leading: pdfLeads, note: 'Handbuch ist führend', decidedBy: 'u-redaktion' });
      expect((await call('PUT', `/metadata/duplicates/${near[0].id}/decision`, { decision: 'not_duplicate' }, 'u-redaktion')).status).toBe(200);
      // Entscheidung gilt je Inhaltspaar: PPTX und PDF sind gleich, also sind beide Paare zur Markdown-Fassung entschieden
      expect((await call('GET', '/metadata/duplicates')).json.items).toHaveLength(0);
      expect((await call('GET', '/metadata/duplicates?status=decided')).json.total).toBe(3);

      // nur geänderte Datei neu: Markdown geändert → Paar PPTX/PDF bleibt mit derselben ID, neue Fassung ist exakt gleich
      await importFile(built, 'notizen.zip', await (async () => { const y = new JSZip(); y.file('notizen/kuendigen.md', md('zum Monatsende')); return y.generateAsync({ type: 'nodebuffer' }); })());
      const after = (await call('GET', '/metadata/duplicates?status=all')).json;
      const keep = after.items.find((p: any) => p.id === exact.id);
      expect(keep?.decision).toMatchObject({ decision: 'leading', leading: pdfLeads });
      expect(after.summary.exact).toBeGreaterThanOrEqual(3);

      // Neuaufbau verwirft Paare, die Entscheidung hängt am Inhalt und bleibt
      expect((await call('POST', '/metadata/duplicates/rebuild', {}, 'u-leser')).status).toBe(403);
      const rebuilt = (await call('POST', '/metadata/duplicates/rebuild', {}, 'u-redaktion')).json;
      expect(rebuilt.sections).toBe(4); // Folie, PDF-Abschnitt, zwei Markdown-Abschnitte
      const again = (await call('GET', '/metadata/duplicates?status=decided')).json.items;
      expect(again.find((p: any) => [p.a.format, p.b.format].sort().join() === 'pdf,pptx')?.decision).toMatchObject({ decision: 'leading', note: 'Handbuch ist führend' });
      expect((await call('GET', '/metadata/duplicates/dup_gibtsnicht')).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });
});
