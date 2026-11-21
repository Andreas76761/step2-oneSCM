import { describe, expect, it } from 'vitest';
import { SAMPLE_FACHDOKU, SAMPLE_QUICKREF } from '../src/domain/designSamples.js';
import { boxLabel, renderDesign } from '../src/domain/designs.js';
import { renderDesignDocx } from '../src/services/designDocx.js';
import { renderDesignPptx } from '../src/services/designPptx.js';
import { sampleMedia } from '../src/services/designTemplates.js';
import { markdownToHtml } from '../src/services/render.js';
import JSZip from 'jszip';

const md = (t: string) => markdownToHtml(t, () => null);
const textOf = async (buf: Buffer, re: RegExp) => {
  const zip = await JSZip.loadAsync(buf);
  const parts = await Promise.all(Object.keys(zip.files).filter((n) => re.test(n)).map((n) => zip.file(n)!.async('string')));
  return parts.join(' ').replace(/<[^>]+>/g, '');
};

describe('Etappe 71', () => {
  it('[T-389] Feinschliff Designvorlagen: Signalwort als Boxbeschriftung ohne Dopplung, zwei Spalten am Bildschirm, Kennzahlen bündig (Einheit)', async () => {
    // Signalwort wird zur Beschriftung und fällt aus dem Text; sonst gilt die Art
    expect(boxLabel({ kind: 'tip', text: '**Wichtig:** Preis gesperrt.' } as any)).toEqual({ label: 'Wichtig', text: 'Preis gesperrt.' });
    expect(boxLabel({ kind: 'note', text: '**Hinweis**: Text' } as any)).toEqual({ label: 'Hinweis', text: 'Text' });
    expect(boxLabel({ kind: 'warning', text: '**ACHTUNG:** heiß' } as any)).toEqual({ label: 'Achtung', text: 'heiß' });
    expect(boxLabel({ kind: 'note', text: '**Zielbild:** Händler wählen' } as any)).toEqual({ label: 'Hinweis', text: '**Zielbild:** Händler wählen' });
    expect(boxLabel({ kind: 'paragraph', text: '**Wichtig:** x' } as any)).toBeNull();

    const fd = renderDesign('fachdoku', SAMPLE_FACHDOKU.chapters, { title: SAMPLE_FACHDOKU.title, asOf: '25.10.2026', md });
    expect(fd).toMatch(/<div class="fd-box tip"><div class="t"><svg[\s\S]*?<\/svg>Wichtig<\/div><p>Sobald eine Preisversion/);
    expect(fd).not.toContain('Wichtig:</strong>');
    // die Listenregel .fd ul darf Einzug und Abstand der Kennzahlen nicht überschreiben
    expect(fd).toContain('.fd ul.fd-kpis{display:grid;');
    expect(fd).toMatch(/\.fd ul\.fd-kpis\{[^}]*padding:0/);

    const qr = renderDesign('quickref', SAMPLE_QUICKREF.chapters, { title: SAMPLE_QUICKREF.title, asOf: '25.10.2026', links: SAMPLE_QUICKREF.links, faq: SAMPLE_QUICKREF.faq, md });
    expect(qr).toContain('@media screen{body{background:#eef2f6}.qr-cols{column-fill:balance}');
    expect(qr).toContain('.qr-cols{column-count:2;column-gap:14px;column-fill:auto}');
    expect(qr).toMatch(/<strong>(Tipp|Hinweis)<\/strong>: /);

    // Word und PowerPoint: dieselbe Beschriftung, kein „Wichtig:“ im Text
    const media = await sampleMedia();
    const o = { title: SAMPLE_FACHDOKU.title, asOf: '25.10.2026', media };
    const docx = await textOf(await renderDesignDocx('fachdoku', SAMPLE_FACHDOKU.chapters, o), /^word\/document\.xml$/);
    expect(docx).toContain('WichtigSobald eine Preisversion');
    expect(docx).not.toContain('Wichtig:');
    const pptx = await textOf(await renderDesignPptx('fachdoku', SAMPLE_FACHDOKU.chapters, o), /^ppt\/slides\/slide\d+\.xml$/);
    expect(pptx).toContain('Wichtig');
    expect(pptx).not.toContain('Wichtig:');
  });
});
