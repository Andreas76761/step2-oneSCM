import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const fm = (extra = '') => `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n${extra}---\n`;

describe('Etappe 12: Handbuch-Varianten aus dem Draft Manual (ADR-034)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' }));

  it('[T-170] Draft Manual → Kapitel der Variante, Entwürfe, Freigabe, Veröffentlichung je Variante; Quellenkapitel bleiben getrennt', async () => {
    const built = await build('variant');
    const call = client(built);
    try {
      await importFile(built, 'anmeldung.md', `${fm()}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldung öffnet oneSCM für alle Nutzer.\n\n## 1.2 Schritte\n\nDer Nutzer meldet sich mit seinem DMS-Konto an.\n`);
      await importFile(built, 'markt.md', `${fm('market: FR\n')}# 1. Anmeldung\n\n## 1.1 Zweck\n\nIn Frankreich gilt zusätzlich die lokale Anmeldung.\n`);
      const sourceChapters = (await call('GET', '/chapters')).json;
      expect(sourceChapters.map((c: any) => c.title)).toEqual(['1. Anmeldung']);

      const outline = (await call('POST', '/outlines', { name: 'Händlerhandbuch Blueprint', roles: ['dealer'], content: '# Anmeldung\n## Zweck\n## Schritte\n# Aufträge\n', format: 'markdown' })).json;
      expect((await call('POST', `/outlines/${outline.id}/auto-assign`, {})).json).toMatchObject({ assigned: 3 });

      // Kapitel der Variante: je Kapitel der Gliederung, nur mit Bearbeitungsrecht
      expect((await call('POST', `/outlines/${outline.id}/materialize`, {}, 'u-leser')).status).toBe(403);
      const mat = (await call('POST', `/outlines/${outline.id}/materialize`, {}, 'u-redaktion')).json;
      expect(mat.chapters.map((c: any) => [c.title, c.snippetCount])).toEqual([['1. Anmeldung', 3], ['2. Aufträge', 0]]);
      // Quellenkapitel und Variantenkapitel getrennt
      expect((await call('GET', '/chapters')).json.map((c: any) => c.id)).toEqual(sourceChapters.map((c: any) => c.id));
      expect((await call('GET', `/chapters?outline=${outline.familyId}`)).json.map((c: any) => c.title)).toEqual(['1. Anmeldung', '2. Aufträge']);

      // Entwürfe: Kapitel ohne Inhalte werden übersprungen
      const gen = (await call('POST', `/outlines/${outline.id}/generate`, {}, 'u-redaktion')).json;
      expect(gen.results.map((r: any) => [r.title, r.status])).toEqual([['1. Anmeldung', 'generated'], ['2. Aufträge', 'skipped']]);
      const chapterId = gen.results[0].chapterId;
      const v = (await call('GET', `/chapters/${chapterId}`)).json.latestVersion ?? (await call('GET', `/chapters/${chapterId}/versions`)).json[0];
      const version = (await call('GET', `/chapter-versions/${v.id}`)).json;
      // Inhalte aus den zugeordneten Schnipseln (Kapitelvorlage mit festen Abschnitten)
      const texts = version.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text)).join('\n');
      expect(texts).toContain('Die Anmeldung öffnet oneSCM für alle Nutzer.');
      expect(texts).toContain('In Frankreich gilt zusätzlich die lokale Anmeldung.');

      // Freigabe über den normalen Workflow
      for (const b of version.sections.flatMap((s: any) => s.blocks)) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
      expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      expect((await call('GET', `/outlines/${outline.id}/chapters`)).json.chapters[0].versions[0]).toMatchObject({ versionNo: 1, status: 'approved' });

      // Verzeichnisse: Abkürzung und veröffentlichte FAQ der Rolle
      await call('POST', '/abbreviations', { abbreviation: 'DMS', expansion: 'Dealer-Management-System' });
      await call('POST', '/faq', { question: 'Wer meldet sich an?', answer: 'Jeder Händler.', roles: ['dealer'], status: 'published' });
      await call('POST', '/faq', { question: 'Nur für HQ?', answer: 'Ja.', roles: ['hq'], status: 'published' });

      // Quellen-Release: keine freigegebenen Quellenkapitel → nichts zu veröffentlichen
      expect((await call('POST', '/releases', { version: '1.0' }, 'u-freigabe')).status).toBe(422);
      // Varianten-Release: Blueprint ohne marktspezifische Inhalte, Verzeichnisse als eigene Seite
      const rel = await call('POST', '/releases', { version: 'haendler-1.0', outlineId: outline.id }, 'u-freigabe');
      expect(rel.status).toBe(201);
      expect(rel.json).toMatchObject({ title: 'Händlerhandbuch Blueprint', outlineId: outline.id, outlineFamilyId: outline.familyId });
      expect(rel.json.changes.map((c: any) => c.change)).toEqual(['new']);
      const zip = await JSZip.loadAsync((await call('GET', `/releases/${rel.json.id}/download?format=site`)).raw);
      expect(Object.keys(zip.files).sort()).toEqual(['aenderungen.html', 'index.html', 'kapitel-01.html', 'verzeichnisse.html']);
      const chapterHtml = await zip.file('kapitel-01.html')!.async('string');
      expect(chapterHtml).toContain('Die Anmeldung öffnet oneSCM');
      expect(chapterHtml).not.toContain('In Frankreich');
      const lists = await zip.file('verzeichnisse.html')!.async('string');
      expect(lists).toContain('Dealer-Management-System');
      expect(lists).toContain('Wer meldet sich an?');
      expect(lists).not.toContain('Nur für HQ?');
      expect(await zip.file('index.html')!.async('string')).toContain('verzeichnisse.html#abkuerzungen');
      const md = (await call('GET', `/releases/${rel.json.id}/download?format=md`)).body;
      expect(md).toMatch(/^# Händlerhandbuch Blueprint – Version haendler-1\.0/);
      expect(md).toContain('## Abkürzungsverzeichnis');

      // Varianten-Export (Markdown, JSON) mit Titel und Verzeichnissen
      const exp = (await call('POST', '/exports', { format: 'md', outlineId: outline.id })).json;
      const expMd = (await call('GET', `/exports/${exp.id}/download`)).body;
      expect(expMd).toMatch(/^# Händlerhandbuch Blueprint/);
      expect(expMd).toContain('Blueprint (ohne marktspezifische Inhalte)');
      expect(expMd).not.toContain('In Frankreich');
      expect(expMd).toContain('## Häufige Fragen (FAQ)');
      const noLists = (await call('POST', '/exports', { format: 'md', outlineId: outline.id, appendices: false })).json;
      expect((await call('GET', `/exports/${noLists.id}/download`)).body).not.toContain('Abkürzungsverzeichnis');
      const json = JSON.parse((await call('GET', `/exports/${(await call('POST', '/exports', { format: 'json', outlineId: outline.id })).json.id}/download`)).body);
      expect(json.appendices.abbreviations.map((a: any) => a.abbreviation)).toEqual(['DMS']);
      expect((await call('POST', '/exports', { format: 'pdf', outlineId: outline.id })).status).toBe(201);
      expect((await call('POST', '/exports', { format: 'html', outlineId: 'ol_fremd' })).status).toBe(404);

      // Neue Gliederungsversion führt dieselben Kapitel fort (stabile Eintragskennung)
      const v2 = (await call('POST', `/outlines/${outline.id}/versions`, {})).json;
      const again = (await call('POST', `/outlines/${v2.id}/materialize`, {})).json;
      expect(again.chapters.map((c: any) => c.id)).toEqual(mat.chapters.map((c: any) => c.id));
      // Folge-Release derselben Variante vergleicht mit dem Vorgänger der Variante
      const rel2 = (await call('POST', '/releases', { version: 'haendler-1.1', outlineId: v2.id }, 'u-freigabe')).json;
      expect(rel2.previousReleaseId).toBe(rel.json.id);
      expect(rel2.changes.map((c: any) => c.change)).toEqual(['unchanged']);
      expect((await built.ctx.db.get("SELECT COUNT(*) AS n FROM audit_events WHERE action = 'outline.variant_materialized'")).n).toBeGreaterThanOrEqual(2);
    } finally {
      await built.app.close();
    }
  });
});
