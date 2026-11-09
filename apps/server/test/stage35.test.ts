import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { CHUNK_MAX, CHUNK_MIN, chunkParts } from '../src/domain/chunking.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const sentence = (i: number) => `Satz ${i} beschreibt, wie Sie im Contract Management einen Vertrag suchen, öffnen und die Laufzeit prüfen.`;
const long = (n: number) => Array.from({ length: n }, (_, i) => sentence(i + 1)).join(' ');

describe('Etappe 35', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));

  it('[T-257] Teilstücke langer Chunks: 300–800 Zeichen an Satzgrenzen, 1 Satz Überlappung, Tabellen und Listen bleiben ganz (Einheit)', () => {
    expect(chunkParts('Kurzer Absatz.', 'paragraph')).toEqual([]);
    expect(chunkParts(long(30), 'list')).toEqual([]);
    expect(chunkParts(long(30), 'table')).toEqual([]);
    const text = long(30);
    const parts = chunkParts(text, 'paragraph');
    expect(parts.length).toBeGreaterThan(3);
    for (const p of parts) {
      expect(p.text.length).toBeLessThanOrEqual(CHUNK_MAX * 1.25);
      expect(p.text.length).toBeGreaterThanOrEqual(CHUNK_MIN);
      expect(p.text).toMatch(/^Satz \d+ .*prüfen\.$/); // nur an Satzgrenzen
    }
    // lückenlos und ohne Doppelungen: Teilstücke ergeben den Text
    expect(parts.map((p) => p.text).join(' ')).toBe(text);
    expect(parts[0].overlap).toBeNull();
    expect(parts[1].overlap).toBe(parts[0].text.split(/(?<=\.)\s+(?=Satz)/).pop());
    expect(text.slice(parts[1].start, parts[1].end)).toBe(parts[1].text);
    // zu kurzer Rest wird angehängt
    const tail = chunkParts(`${long(15)} Ende.`, 'paragraph');
    expect(tail).toHaveLength(2);
    expect(tail[tail.length - 1].text.endsWith('Ende.')).toBe(true);
    expect(tail.every((p) => p.text.length >= CHUNK_MIN)).toBe(true);
    // überlanger Satz ohne Punkt wird an Kommas geteilt
    const run = chunkParts(Array.from({ length: 60 }, (_, i) => `Feld ${i} wird geprüft`).join(', '), 'paragraph');
    expect(run.length).toBeGreaterThan(1);
    expect(run.every((p) => p.text.length <= CHUNK_MAX)).toBe(true);
  });

  it('[T-258] Quellen je Überschrift: Baum je Datei, zusammengeführt über Dateien (Nummerierung egal), Filter nach Überschrift, Teilstücke im Chunk', async () => {
    const built = await build('ueberschriften');
    const call = client(built);
    try {
      const z = new JSZip();
      z.file('handbuch/vertraege.md', `${FM}# 10. Verträge verwalten\n\nEinleitung ohne Unterkapitel.\n\n## 10.1 Vertrag suchen\n\nSuchen Sie den Vertrag über die Nummer.\n\n### Filter\n\nGrenzen Sie die Liste ein.\n\n## 10.2 Vertrag kündigen\n\n${long(20)}\n`);
      z.file('schulung/kurs.md', `${FM}# Schulung Contract Management\n\n## Vertrag suchen\n\nIn der Schulung suchen Sie den Vertrag über den Kundennamen.\n`);
      z.file('notizen/ohne.md', `${FM}Text ganz ohne Überschrift.\n`);
      await importFile(built, 'q.zip', await z.generateAsync({ type: 'nodebuffer' }));

      const docs = (await call('GET', '/metadata/headings/documents', undefined, 'u-leser')).json;
      const doc = docs.find((d: any) => d.path === 'handbuch/vertraege.md');
      expect(doc).toMatchObject({ format: 'markdown', chunks: 4, headings: 4 });
      const tree = (await call('GET', `/metadata/headings/documents/${doc.documentId}`)).json;
      expect(tree.tree.map((n: any) => n.title)).toEqual(['10. Verträge verwalten']);
      const ch = tree.tree[0];
      expect(ch.chunks.map((c: any) => c.text)).toEqual(['Einleitung ohne Unterkapitel.']);
      expect(ch.children.map((n: any) => [n.title, n.level])).toEqual([['10.1 Vertrag suchen', 2], ['10.2 Vertrag kündigen', 2]]);
      expect(ch.children[0].children[0]).toMatchObject({ title: 'Filter', level: 3, chunks: [expect.objectContaining({ text: 'Grenzen Sie die Liste ein.' })] });
      expect(ch.children[1].chunks[0].text.endsWith(' …')).toBe(true); // Vorschau gekürzt
      const none = docs.find((d: any) => d.path === 'notizen/ohne.md');
      expect((await call('GET', `/metadata/headings/documents/${none.documentId}`)).json.tree[0].title).toBe('(ohne Überschrift)');
      expect((await call('GET', '/metadata/headings/documents/doc_gibtsnicht')).status).toBe(404);

      // zusammengeführt: „10.1 Vertrag suchen“ und „Vertrag suchen“ aus zwei Dateien
      const merged = (await call('GET', '/metadata/headings/merged?multi=true')).json;
      expect(merged).toMatchObject({ total: 1, multiFiles: 1 });
      expect(merged.items[0]).toMatchObject({ key: 'vertrag suchen', files: 2, chunks: 2 });
      expect(merged.items[0].sources.map((s: any) => s.path).sort()).toEqual(['handbuch/vertraege.md', 'schulung/kurs.md']);
      const all = (await call('GET', '/metadata/headings/merged?q=kündigen')).json;
      expect(all.items.map((i: any) => i.title)).toEqual(['10.2 Vertrag kündigen']);

      // Chunks: Filter nach Überschrift; langer Absatz mit Teilstücken
      const byHeading = (await call('GET', `/metadata/chunks?heading=${encodeURIComponent('vertrag suchen')}`)).json;
      // auch Chunks tieferer Überschriften darunter („Filter“ unter „Vertrag suchen“)
      expect(byHeading.items.map((c: any) => c.text).sort()).toEqual(['Grenzen Sie die Liste ein.', 'In der Schulung suchen Sie den Vertrag über den Kundennamen.', 'Suchen Sie den Vertrag über die Nummer.']);
      expect(chunkParts(long(8), 'paragraph')).toEqual([]); // knapp über 800, Rest zu kurz → bleibt ganz
      const filter = (await call('GET', '/metadata/chunks?heading=filter')).json;
      expect(filter.items.map((c: any) => c.text)).toEqual(['Grenzen Sie die Liste ein.']);
      const longChunk = (await call('GET', '/metadata/chunks?q=Satz%2020')).json.items[0];
      expect(longChunk.chars).toBeGreaterThan(CHUNK_MAX);
      expect(longChunk.parts.length).toBeGreaterThan(1);
      expect(longChunk.parts[1].overlap).toBeTruthy();
      expect(byHeading.items.every((c: any) => c.parts.length === 0)).toBe(true);
    } finally {
      await built.app.close();
    }
  });
});
