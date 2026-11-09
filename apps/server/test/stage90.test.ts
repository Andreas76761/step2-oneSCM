import { createHash } from 'node:crypto';
import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { SAMPLE_FACHDOKU } from '../src/domain/designSamples.js';
import { chapterFacts, renderDesign } from '../src/domain/designs.js';
import { renderDesignPptx } from '../src/services/designPptx.js';
import { sampleMedia } from '../src/services/designTemplates.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const md = (t: string) => `<p>${t}</p>`;

describe('Etappe 90', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-409] Designvorlagen: Titel und Fußzeile können den Stilblock nicht beenden; Lesefassung ohne Version; nur echte Vorlagen; gleiche Bilder in PowerPoint einmal', async () => {
    // „</style>“ in Titel, Kapitel und Fußzeile steht als CSS-Escape im Stilblock, nicht als Ende des Blocks
    const chapters = [{ title: 'Tabellen </style><h1>X</h1>', sections: [{ code: 'purpose', title: 'Zweck', blocks: [{ kind: 'paragraph', text: 'Text' }] }] }];
    for (const design of ['fachdoku', 'quickref'] as const) {
      const html = renderDesign(design, chapters, { title: 'Titel </style><h1>Y</h1>', footerText: 'Fuß </style>', asOf: '27.10.2026', md });
      expect(html.match(/<\/style>/g)?.length, design).toBe(1);
      expect(html, design).not.toContain('<h1>X</h1>');
    }
    // Lesefassung: Kennzahl ohne Versionsnummer und Freigabedatum
    const facts = chapterFacts({ title: 'K', versionNo: 3, approvedAt: '2026-05-12T10:00:00Z', hideVersion: true, sections: [] });
    expect(facts.kpis[2]).toEqual(['shield-check', '✓', 'Freigegeben']);
    expect(JSON.stringify(facts)).not.toContain('V3');
    expect(chapterFacts({ title: 'K', versionNo: 3, approvedAt: '2026-05-12T10:00:00Z', sections: [] }).kpis[2][1]).toBe('V3');

    // geerbte Schlüssel sind keine Vorlagen
    const database = await freshDatabase(dataDir, 'tpl');
    const built = await buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' });
    try {
      const call = client(built);
      for (const id of ['constructor', 'toString', '__proto__']) expect((await call('GET', `/design-templates/${id}/sample`)).status, id).toBe(404);
      expect((await call('GET', '/design-templates/fachdoku/sample')).status).toBe(200);
    } finally {
      await built.app.close();
    }

    // PowerPoint: jedes Bild nur einmal in ppt/media, auch wenn dasselbe Icon auf vielen Folien steht
    const zip = await JSZip.loadAsync(await renderDesignPptx('fachdoku', SAMPLE_FACHDOKU.chapters, { title: SAMPLE_FACHDOKU.title, asOf: '27.10.2026', media: await sampleMedia() }));
    const media = Object.keys(zip.files).filter((f) => f.startsWith('ppt/media/') && !zip.files[f].dir);
    const hashes = await Promise.all(media.map(async (f) => createHash('sha1').update(await zip.file(f)!.async('nodebuffer')).digest('hex')));
    expect(media.length).toBeGreaterThan(3);
    expect(new Set(hashes).size).toBe(hashes.length);
  });
});
