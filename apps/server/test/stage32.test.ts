import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { compileExclusions } from '../src/domain/exclude.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

// 1×1-PNG
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

describe('Etappe 32', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));

  it('[T-244] Ausschlussliste „nicht einlesen“: Muster für Dateinamen und Ordner, im ZIP und als Einzeldatei, Pflege nur durch die Administration', async () => {
    const ex = compileExclusions(['*.tmp', '~$*', 'Archiv/**', 'alt/entwurf_*.md', 'Notizen']);
    expect(ex('ordner/datei.tmp')).toBe('*.tmp');
    expect(ex('~$Handbuch.docx')).toBe('~$*');
    expect(ex('Archiv/2023/a.md')).toBe('Archiv/**');
    expect(ex('x/archiv/a.md')).toBe('Archiv/**');
    expect(ex('alt/Entwurf_1.md')).toBe('alt/entwurf_*.md');
    expect(ex('alt/sub/entwurf_1.md')).toBeNull();
    expect(ex('Notizen/a.md')).toBe('Notizen');
    expect(ex('Kapitel/Notizenliste.md')).toBeNull();

    const built = await build('ausschluss');
    const call = client(built);
    try {
      expect((await call('PUT', '/settings', { import: { excludePatterns: ['*.tmp'] } }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/settings', { import: { excludePatterns: 'Archiv/**' } })).status).toBe(400);
      const saved = (await call('PUT', '/settings', { import: { excludePatterns: [' Archiv/** ', 'Archiv/**', 'entwurf_*', ''] } })).json;
      expect(saved.import.excludePatterns).toEqual(['Archiv/**', 'entwurf_*']);
      expect(saved.import.allowedExtensions).toContain('.zip'); // übrige Importeinstellungen bleiben
      const zip = new JSZip();
      zip.file('Kapitel/a.md', `${FM}# A\n\n## Zweck\n\nText A.\n`);
      zip.file('Archiv/b.md', `${FM}# B\n\n## Zweck\n\nText B.\n`);
      zip.file('Kapitel/Entwurf_alt.md', `${FM}# C\n\n## Zweck\n\nText C.\n`);
      const up = await importFile(built, 'paket.zip', await zip.generateAsync({ type: 'nodebuffer' }));
      await built.ctx.jobs.idle();
      const imp = (await call('GET', `/imports/${up.id}`)).json;
      const items = Object.fromEntries(imp.items.map((i: any) => [i.path, [i.status, i.message]]));
      expect(items['Kapitel/a.md'][0]).toBe('imported');
      expect(items['Archiv/b.md']).toEqual(['skipped', 'Ausgeschlossen (Ausschlussliste: „Archiv/**“) – übersprungen']);
      expect(items['Kapitel/Entwurf_alt.md']).toEqual(['skipped', 'Ausgeschlossen (Ausschlussliste: „entwurf_*“) – übersprungen']);
      const one = await importFile(built, 'Entwurf_neu.md', `${FM}# D\n\n## Zweck\n\nText D.\n`);
      await built.ctx.jobs.idle();
      const single = (await call('GET', `/imports/${one.id}`)).json;
      expect(single.items).toMatchObject([{ path: 'Entwurf_neu.md', status: 'skipped' }]);
      expect((await call('GET', '/sources')).json.map((d: any) => d.path)).toEqual(['Kapitel/a.md']);
    } finally {
      await built.app.close();
    }
  });

  it('[T-245] Gliederungs-Vorschlag je Chunk mit Trefferwert (nie automatisch), Übersicht je Gliederungspunkt und Kapitel ↔ Quellen zweispaltig', async () => {
    const built = await build('gliederung');
    const call = client(built);
    try {
      await importFile(built, 'vertrag.md', `${FM}# 10. Verträge im Alltag verwalten\n\n## 10.1 Vertrag kündigen\n\nSie kündigen einen Vertrag in der Vertragsverwaltung über die Funktion Beenden.\n\n## 10.2 Zahlungen\n\nRechnungen und Zahlungen prüfen Sie im Bereich Finanzen.\n`);
      const page = (await call('GET', '/metadata/chunks?noOutline=true', undefined, 'u-leser')).json;
      const kuend = page.items.find((c: any) => c.text.includes('kündigen'));
      expect(kuend.labels.filter((l: any) => l.group === 'outline')).toEqual([]); // Gliederung nie automatisch übernommen (Pflichtlabels setzt die Triage, ADR-100)
      expect(kuend.outlineSuggestions[0]).toMatchObject({ code: 'outline.kap10' });
      expect(kuend.outlineSuggestions[0].score).toBeGreaterThanOrEqual(0.25);
      expect(kuend.outlineSuggestions[0].matched.length).toBeGreaterThan(0);
      const zahl = page.items.find((c: any) => c.text.includes('Rechnungen'));
      expect(zahl.outlineSuggestions.map((s: any) => s.code)).toContain('outline.kap11');

      // Übernehmen = vorhandene Label-Zuordnung; danach keine Vorschläge mehr für diesen Chunk
      await call('POST', '/metadata/chunks/labels', { snippetIds: [kuend.id], add: [kuend.outlineSuggestions[0].labelId] }, 'u-redaktion');
      const after = (await call('GET', '/metadata/chunks')).json.items.find((c: any) => c.id === kuend.id);
      expect(after.outlineSuggestions).toEqual([]);
      expect((await call('GET', '/metadata/chunks?noOutline=true')).json.items.map((c: any) => c.id)).not.toContain(kuend.id);

      // Übersicht je Gliederungspunkt
      const cov = (await call('GET', '/metadata/outline-coverage', undefined, 'u-leser')).json;
      const k10 = cov.items.find((i: any) => i.code === 'outline.kap10');
      expect(k10).toMatchObject({ chunks: 1, used: 0, folder: '02_Kapitel/10_Verträge_im_Alltag_verwalten' });
      expect(cov.unassigned).toBe(cov.chunks - 1);

      // Kapitel ↔ Quellen: Handbuchkapitel mit gleichem Titel, Quellen mit „im Handbuch verwendet“
      const chapter = (await call('GET', '/chapters')).json.find((c: any) => c.title === '10. Verträge im Alltag verwalten');
      await call('POST', `/chapters/${chapter.id}/generate`);
      const view = (await call('GET', `/metadata/outline/${k10.id}`, undefined, 'u-leser')).json;
      expect(view.outline).toMatchObject({ code: 'outline.kap10', folder: '02_Kapitel/10_Verträge_im_Alltag_verwalten' });
      expect(view.handbook).toHaveLength(1);
      expect(view.handbook[0]).toMatchObject({ chapterId: chapter.id, match: 'title', fromAssigned: 1 });
      expect(view.handbook[0].blocks.length).toBeGreaterThan(0);
      expect(view.chunks).toMatchObject([{ id: kuend.id, usedInHandbook: true }]);
      expect(view.summary).toMatchObject({ chapters: 1, chunks: 1, used: 1, unused: 0 });
      expect((await call('GET', `/metadata/outline/${k10.id}?minScore=5`)).status).toBe(400);
      expect((await call('GET', '/metadata/outline/lbl_gibtesnicht')).status).toBe(404);
      const k11 = cov.items.find((i: any) => i.code === 'outline.kap11');
      expect((await call('GET', `/metadata/outline/${k11.id}`)).json.suggestions.map((s: any) => s.id)).toContain(zahl.id);
    } finally {
      await built.app.close();
    }
  });

  it('[T-246] Wissensnotizen als eigene Quelle mit Screenshot und Revisionen, Datenschutz; Zielkapitel je Dopplung ordnet beide Chunks zu', async () => {
    const built = await build('wissen');
    const call = client(built);
    try {
      // F-15: Notiz anlegen → Quelle wissensnotizen/<id>.md mit Chunk und Bild
      expect((await call('POST', '/knowledge-notes', { question: 'Wie storniere ich?', insight: 'Über Beenden.' }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/knowledge-notes', { question: 'Wie?', insight: 'Über Beenden.' }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/knowledge-notes', { question: 'Wer hilft beim Storno?', insight: 'Frau Kowalski unter kowalski@autohaus-muster.de.' }, 'u-redaktion')).status).toBe(422);
      expect((await call('POST', '/knowledge-notes', { question: 'Wie storniere ich einen Vertrag?', insight: 'Über Beenden.', divisions: ['truck'] }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/knowledge-notes', { question: 'Wie storniere ich einen Vertrag?', insight: 'Über Beenden.', image: { data: PNG.toString('base64') } }, 'u-redaktion')).status).toBe(400);
      const note = await call('POST', '/knowledge-notes', {
        question: 'Wie storniere ich einen Vertrag nach der Aktivierung?', insight: 'In der Vertragsverwaltung über **Beenden**; der Grund ist Pflicht.',
        roles: ['dealer', 'mo'], divisions: ['van'], image: { name: 'x.png', data: `data:image/png;base64,${PNG.toString('base64')}` }, imageAlt: 'Dialog Vertrag beenden',
      }, 'u-redaktion');
      expect(note.status).toBe(201);
      expect(note.json).toMatchObject({ roles: ['dealer', 'mo'], divisions: ['van'], confirmed: false, image: { name: 'screenshot.png', alt: 'Dialog Vertrag beenden' }, revisions: 1, status: 'active' });
      expect(note.json.path).toMatch(/^wissensnotizen\/kn-.+\.md$/);
      expect(note.json.chunks).toBeGreaterThan(0);
      const chunk = (await call('GET', '/metadata/chunks?q=Grund%20ist%20Pflicht')).json.items[0];
      expect(chunk).toMatchObject({ path: note.json.path, chapter: 'Wissensnotizen', subchapter: 'Wie storniere ich einen Vertrag nach der Aktivierung?' });
      expect((await call('GET', '/media')).json.length).toBeGreaterThanOrEqual(1);

      // Ändern → neue Revision, Screenshot bleibt; pseudonymisieren auf Wunsch
      const upd = (await call('PATCH', `/knowledge-notes/${note.json.id}`, { insight: 'Über Beenden; Rückfragen an Frau Kowalski (kowalski@autohaus-muster.de).', confirmed: true, pseudonymize: true }, 'u-redaktion')).json;
      expect(upd).toMatchObject({ revisions: 2, confirmed: true, image: { name: 'screenshot.png' } });
      expect(upd.insight).not.toContain('kowalski@');
      const list = (await call('GET', '/knowledge-notes', undefined, 'u-leser')).json;
      expect(list.map((n: any) => n.id)).toEqual([note.json.id]);
      expect((await call('DELETE', `/knowledge-notes/${note.json.id}`, undefined, 'u-redaktion')).status).toBe(204);
      expect((await call('GET', '/knowledge-notes')).json).toEqual([]);
      expect((await call('GET', '/knowledge-notes?includeRemoved=true')).json[0].status).toBe('removed');
      expect((await call('GET', '/sources')).json.find((d: any) => d.path === note.json.path).removedAt).toBeTruthy();
      expect((await call('GET', '/metadata/chunks?q=Grund%20ist%20Pflicht')).json.items).toEqual([]);

      // F-18: Dopplung → Zielkapitel; beide Chunks erhalten das Gliederungs-Label
      const text = 'Rechnungen und Zahlungen prüfen Sie im Bereich Finanzen unter Status FI-Beleg.';
      await importFile(built, 'a.md', `${FM}# 11. Rechnung\n\n## Prüfen\n\n${text}\n`);
      await importFile(built, 'b.md', `${FM}# 12. Sonderfälle\n\n## Prüfen\n\n${text}\n`);
      await call('POST', '/quality/analysis');
      await built.ctx.jobs.idle();
      const dup = (await call('GET', '/quality/findings?type=duplicate')).json.find((f: any) => f.a?.text === text);
      expect(dup).toBeTruthy();
      const targets = (await call('GET', '/duplicate-targets', undefined, 'u-leser')).json;
      const t = targets.find((x: any) => x.findingId === dup.id);
      expect(t).toMatchObject({ target: null, suggestion: { code: 'outline.kap11' } });
      expect((await call('PUT', `/duplicate-targets/${dup.id}`, { outlineLabelId: t.suggestion.labelId }, 'u-leser')).status).toBe(403);
      expect((await call('PUT', `/duplicate-targets/${dup.id}`, { outlineLabelId: 'x' }, 'u-redaktion')).status).toBe(400);
      const set = (await call('PUT', `/duplicate-targets/${dup.id}`, { outlineLabelId: t.suggestion.labelId, note: 'in Kapitel 11 zusammenführen' }, 'u-redaktion')).json;
      expect(set).toMatchObject({ target: { code: 'outline.kap11', note: 'in Kapitel 11 zusammenführen', decidedBy: 'u-redaktion' }, suggestion: null });
      const labeled = (await call('GET', `/metadata/chunks?labels=${t.suggestion.labelId}`)).json.items.map((c: any) => c.id).sort();
      expect(labeled).toEqual([dup.a.id, dup.b.id].sort());
      expect((await call('DELETE', `/duplicate-targets/${dup.id}`, undefined, 'u-redaktion')).status).toBe(204);
      expect((await call('DELETE', `/duplicate-targets/${dup.id}`, undefined, 'u-redaktion')).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });
});
