import fs from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { clickpathAlt, normalizeStations, stationLabels } from '../src/domain/clickpath.js';
import { pickVariant, variantScore } from '../src/domain/imageVariants.js';
import { sha256 } from '../src/domain/similarity.js';
import { variantSwapper } from '../src/services/imageArchive.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const png = (rgb: string, w = 800, h = 450) => {
  const c = createCanvas(w, h);
  const g = c.getContext('2d');
  g.fillStyle = rgb;
  g.fillRect(0, 0, w, h);
  return c.toBuffer('image/png');
};

describe('Etappe 41', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-284] Variante wählen nach Sprache, Rolle, Sparte, Markt; Nummern 3a/3b und Alternativtext der Klickstrecke (Einheit)', () => {
    const v = (sha: string, language: string | null, roles: string[] = [], divisions: string[] = [], markets: string[] = []) => ({ sha, language, roles, divisions, markets });
    const de = v('de', 'de', ['all'], ['car']);
    const en = v('en', 'en', ['all'], ['car']);
    const van = v('van', 'de', ['all'], ['van']);
    const fr = v('fr', 'de', ['all'], ['car'], ['FR']);
    const group = [de, en, van, fr];
    expect(variantScore(en, { language: 'de' })).toBeNull(); // nie in falscher Sprache
    expect(pickVariant(de, group, { language: 'en' })).toBe('en');
    expect(pickVariant(de, group, { language: 'de', divisions: ['van'] })).toBe('van');
    expect(pickVariant(de, group, { language: 'de', market: 'FR' })).toBe('fr');
    expect(pickVariant(de, group, { language: 'de' })).toBe('de'); // Gleichstand: bleibt
    expect(pickVariant(de, group, { language: 'it' })).toBe('de'); // keine passende Fassung: bleibt
    expect(pickVariant(fr, group, { language: 'de' })).toBe('de'); // marktspezifisch nur, wenn der Markt gefragt ist

    const a = 'a'.repeat(64);
    const b = 'b'.repeat(64);
    const st = normalizeStations([{ sha: a, caption: ' Startseite  öffnen ' }, { alternatives: [{ sha: a, caption: 'Neu' }, { sha: b, caption: 'Kopieren' }] }, { sha: b, caption: 'Speichern' }]);
    expect(stationLabels(st)).toEqual([['1'], ['2a', '2b'], ['3']]);
    expect(clickpathAlt('Reifen anlegen', st)).toBe('Klickstrecke Reifen anlegen: 1 Startseite öffnen → 2a Neu oder 2b Kopieren → 3 Speichern');
    expect(() => normalizeStations([{ sha: a }])).toThrow('2 bis 12 Stationen');
    expect(() => normalizeStations([{ sha: a }, { sha: 'x' }])).toThrow('Station 2: Bild fehlt.');
    expect(() => normalizeStations([{ sha: a }, { alternatives: [{ sha: a }, { sha: a }, { sha: a }, { sha: a }] }])).toThrow('1 bis 3 Bilder');
  });

  it('[T-285] Varianten einer Maske verknüpfen, doppelte Merkmale melden, passende Fassung im Export und in der Übersetzung, Deckungsmatrix je Maske', async () => {
    const built = await build('varianten');
    const call = client(built);
    try {
      const imgs = { de: png('#1d4ed8'), en: png('#15803d'), van: png('#b45309'), dup: png('#7c3aed') };
      const z = new JSZip();
      for (const [k, b] of Object.entries(imgs)) z.file(`bilder/${k}.png`, b);
      await importFile(built, 'b.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const sha = Object.fromEntries(Object.entries(imgs).map(([k, b]) => [k, sha256(b)]));
      const meta = (s: string, m: object) => call('PATCH', `/image-archive/${s}`, m, 'u-redaktion');
      await meta(sha.de, { title: 'Vertragsliste', language: 'de', roles: ['all'], divisions: ['car'] });
      await meta(sha.en, { title: 'Contract list', language: 'en', roles: ['all'], divisions: ['car'] });
      await meta(sha.van, { title: 'Vertragsliste Van', language: 'de', roles: ['all'], divisions: ['van'] });
      await meta(sha.dup, { language: 'en', roles: ['all'], divisions: ['car'] });

      expect((await call('POST', `/image-archive/${sha.de}/variants`, { withSha: sha.en }, 'u-leser')).status).toBe(403);
      expect((await call('POST', `/image-archive/${sha.de}/variants`, { withSha: sha.de }, 'u-redaktion')).status).toBe(400);
      expect((await call('DELETE', `/image-archive/${sha.de}/variants`, undefined, 'u-redaktion')).status).toBe(400);
      await call('POST', `/image-archive/${sha.de}/variants`, { withSha: sha.en }, 'u-redaktion');
      await call('POST', `/image-archive/${sha.van}/variants`, { withSha: sha.de }, 'u-redaktion');
      const linked = (await call('POST', `/image-archive/${sha.dup}/variants`, { withSha: sha.en }, 'u-redaktion')).json;
      expect(linked.variantGroup).toBe(sha.de);
      expect(linked.variants.map((x: any) => x.sha).sort()).toEqual([sha.de, sha.en, sha.van].sort());
      expect(linked.checks.find((c: any) => c.rule === 'variant_duplicate').message).toMatch(/Gleiche Merkmale wie die Variante B-\d{4}/);
      const freed = (await call('DELETE', `/image-archive/${sha.dup}/variants`, undefined, 'u-redaktion')).json;
      expect(freed).toMatchObject({ variantGroup: null, variants: [] });

      // Kapitel mit der deutschen Pkw-Fassung; Export für Van zeigt die Van-Fassung
      await importFile(built, 'x.md', `${FM}# 1. Nebenkapitel\n\nKlicken Sie auf **Speichern**.\n`);
      const ch = (await call('POST', '/chapter-assistant', {
        title: 'Vertrag suchen', purpose: 'Mit dieser Anleitung finden Sie einen Vertrag.', prerequisites: ['Sie haben die Berechtigung Verträge'],
        steps: ['Öffnen Sie **Verträge > Vertragsliste**', 'Klicken Sie auf **Suchen**'], result: `Die Vertragsliste zeigt den Vertrag.\n\n![Vertragsliste](media:${sha.de})`,
      }, 'u-redaktion')).json;
      expect((await call('POST', `/chapter-versions/${ch.versionId}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${ch.versionId}/approve`, { comment: 'ok' }, 'u-freigabe')).json.status).toBe('approved');
      const exp = async (body: object) => (await call('GET', `/exports/${(await call('POST', '/exports', { chapterIds: [ch.chapterId], ...body })).json.id}/download`)).body;
      const b64 = (b: Buffer) => b.toString('base64').slice(0, 120);
      const plain = await exp({});
      expect(plain).toContain(b64(imgs.de));
      const van = await exp({ divisions: ['van'] });
      expect(van).toContain(b64(imgs.van));
      expect(van).not.toContain(b64(imgs.de));
      // Übersetzung ins Englische: englische Fassung
      const swapEn = await variantSwapper(built.ctx, { language: 'en' });
      expect(swapEn(`![x](media:${sha.de})`)).toBe(`![x](media:${sha.en})`);
      expect(swapEn(`![x](media:${sha.dup})`)).toBe(`![x](media:${sha.dup})`); // ohne Gruppe unverändert

      const m = (await call('GET', '/image-archive/coverage-matrix?rows=variant&dims=language,division', undefined, 'u-leser')).json;
      expect(m.rowsBy).toBe('variant');
      const row = m.rows.find((r: any) => r.label.endsWith('Vertragsliste'));
      expect(row).toMatchObject({ images: 3, gaps: 1 }); // en · Van fehlt
      expect(row.cells.map((c: any) => c.count)).toEqual([1, 1, 1, 0]);
    } finally {
      await built.app.close();
    }
  });

  it('[T-286] Klickstrecke aus Screenshots: Bild mit Nummern und parallelen Schritten, im Archiv, Änderung als neue Fassung', async () => {
    const built = await build('klickstrecke');
    const call = client(built);
    try {
      const imgs = [png('#1d4ed8'), png('#15803d', 600, 900), png('#b45309'), png('#7c3aed')];
      const z = new JSZip();
      imgs.forEach((b, i) => z.file(`bilder/s${i}.png`, b));
      await importFile(built, 'b.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const s = imgs.map(sha256);
      const steps = [
        { alternatives: [{ sha: s[0], caption: 'Startseite öffnen' }] },
        { alternatives: [{ sha: s[1], caption: 'Neu anlegen' }, { sha: s[2], caption: 'Vorhandenen Vertrag kopieren' }] },
        { alternatives: [{ sha: s[3], caption: 'Speichern' }] },
      ];
      expect((await call('POST', '/image-clickpaths', { title: 'Vertrag anlegen', steps }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/image-clickpaths', { title: 'Vertrag anlegen', steps: steps.slice(0, 1) }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/image-clickpaths', { title: 'Vertrag anlegen', steps, perRow: 9 }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/image-clickpaths', { title: 'Vertrag anlegen', steps: [...steps, { alternatives: [{ sha: 'c'.repeat(64), caption: 'x' }] }] }, 'u-redaktion')).status).toBe(400);
      const cp = (await call('POST', '/image-clickpaths', { title: 'Vertrag anlegen', steps }, 'u-redaktion')).json;
      expect(cp.alt).toBe('Klickstrecke Vertrag anlegen: 1 Startseite öffnen → 2a Neu anlegen oder 2b Vorhandenen Vertrag kopieren → 3 Speichern');
      expect(cp.markdown).toBe(`![${cp.alt}](media:${cp.baseSha})`);

      const file = await call('GET', `/media/${cp.baseSha}`, undefined, 'u-leser');
      expect(file.headers['content-type']).toContain('image/png');
      const pic = await loadImage(file.raw);
      expect(pic.width).toBeGreaterThan(1000); // drei Stationen nebeneinander
      fs.writeFileSync(path.join(dataDir, 'klickstrecke.png'), file.raw);
      // Nummernkreise in der Akzentfarbe vorhanden
      const c = createCanvas(pic.width, pic.height);
      const g = c.getContext('2d');
      g.drawImage(pic, 0, 0);
      const d = g.getImageData(0, 0, pic.width, pic.height).data;
      let accent = 0;
      for (let i = 0; i < d.length; i += 4) if (d[i] === 11 && d[i + 1] === 92 && d[i + 2] === 173) accent++;
      expect(accent).toBeGreaterThan(500);

      const item = (await call('GET', '/image-archive', undefined, 'u-leser')).json.items.find((i: any) => i.sha === cp.baseSha);
      expect(item).toMatchObject({ title: 'Klickstrecke: Vertrag anlegen', versions: [{ versionNo: 1 }] });

      // Änderung: neue Fassung desselben Bildes
      const up = (await call('PUT', `/image-clickpaths/${cp.id}`, { perRow: 2, title: 'Vertrag neu anlegen' }, 'u-redaktion')).json;
      expect(up).toMatchObject({ baseSha: cp.baseSha, perRow: 2, title: 'Vertrag neu anlegen' });
      const item2 = (await call('GET', '/image-archive', undefined, 'u-leser')).json.items.find((i: any) => i.sha === cp.baseSha);
      expect(item2.versions.map((v: any) => v.versionNo)).toEqual([1, 2]);
      expect(item2.title).toBe('Klickstrecke: Vertrag neu anlegen');
      const pic2 = await loadImage((await call('GET', `/media/${item2.currentSha}`, undefined, 'u-leser')).raw);
      expect(pic2.width).toBeLessThan(pic.width); // Umbruch nach zwei Stationen
      expect(pic2.height).toBeGreaterThan(pic.height);

      expect((await call('GET', '/image-clickpaths', undefined, 'u-leser')).json.map((x: any) => x.id)).toEqual([cp.id]);
      expect((await call('DELETE', `/image-clickpaths/${cp.id}`, undefined, 'u-redaktion')).status).toBe(204);
      expect((await call('GET', `/image-clickpaths/${cp.id}`, undefined, 'u-leser')).status).toBe(404);
      expect((await call('GET', `/media/${cp.baseSha}`, undefined, 'u-leser')).status).toBe(200); // Bild bleibt
    } finally {
      await built.app.close();
    }
  });
});
