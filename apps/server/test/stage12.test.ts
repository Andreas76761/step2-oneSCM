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
      expect((await built.ctx.db.get("SELECT COUNT(*) AS n FROM audit_events WHERE action = 'outline.variant_materialized'"))!.n).toBeGreaterThanOrEqual(2);
    } finally {
      await built.app.close();
    }
  });

  it('[T-171] Bedienkomfort: Drag & Drop für Schnipsel und Gliederung, Vergleich von Gliederungsversionen, globale Suche', async () => {
    const built = await build('comfort');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${fm()}# 1. Anmeldung\n\n## 1.1 Zweck\n\nErster Absatz zur Anmeldung.\n\nZweiter Absatz zur Anmeldung.\n\nDritter Absatz mit 100% Rabatt_Code.\n`);
      const o = (await call('POST', '/outlines', { name: 'Händler', content: '# Anmeldung\n## Zweck\n# Aufträge\n# Abrechnung\n', format: 'markdown' })).json;
      await call('POST', `/outlines/${o.id}/auto-assign`, {});
      const node = (x: any, t: string) => x.nodes.find((n: any) => n.title === t);
      const zweck = () => call('GET', `/outlines/${o.id}/draft`).then((r) => node(r.json, 'Zweck').snippets.map((s: any) => s.text));
      const draft = (await call('GET', `/outlines/${o.id}/draft`)).json;
      const [s1, s2, s3] = node(draft, 'Zweck').snippets;
      // Schnipsel vor einem anderen ablegen (Drag & Drop), auch aus einem anderen Eintrag
      await call('POST', `/outlines/${o.id}/assignments`, { nodeId: node(draft, 'Zweck').id, snippetIds: [s3.id], beforeSnippetId: s1.id });
      expect(await zweck()).toEqual(['Dritter Absatz mit 100% Rabatt_Code.', 'Erster Absatz zur Anmeldung.', 'Zweiter Absatz zur Anmeldung.']);
      await call('POST', `/outlines/${o.id}/assignments`, { nodeId: node(draft, 'Aufträge').id, snippetIds: [s2.id] });
      await call('POST', `/outlines/${o.id}/assignments`, { nodeId: node(draft, 'Zweck').id, snippetIds: [s2.id], beforeSnippetId: s3.id });
      expect((await zweck())[0]).toBe('Zweiter Absatz zur Anmeldung.');
      expect((await call('POST', `/outlines/${o.id}/assignments`, { nodeId: node(draft, 'Zweck').id, snippetIds: [s2.id], beforeSnippetId: s2.id })).status).toBe(400);
      expect((await call('POST', `/outlines/${o.id}/assignments`, { nodeId: node(draft, 'Aufträge').id, snippetIds: [s1.id], beforeSnippetId: s3.id })).status).toBe(400);

      // Gliederung: Eintrag vor einem anderen einordnen (übernimmt dessen Ebene)
      let x = (await call('PATCH', `/outline-nodes/${node(o, 'Abrechnung').id}`, { beforeId: node(o, 'Anmeldung').id })).json;
      expect(x.nodes.map((n: any) => `${n.number} ${n.title}`)).toEqual(['1 Abrechnung', '2 Anmeldung', '2.1 Zweck', '3 Aufträge']);
      x = (await call('PATCH', `/outline-nodes/${node(x, 'Aufträge').id}`, { beforeId: node(x, 'Zweck').id })).json;
      expect(x.nodes.map((n: any) => `${n.number} ${n.title}`)).toEqual(['1 Abrechnung', '2 Anmeldung', '2.1 Aufträge', '2.2 Zweck']);
      expect((await call('PATCH', `/outline-nodes/${node(x, 'Anmeldung').id}`, { beforeId: node(x, 'Zweck').id })).status).toBe(400); // hat Unterkapitel
      expect((await call('PATCH', `/outline-nodes/${node(x, 'Anmeldung').id}`, { beforeId: 42 })).status).toBe(400);
      x = (await call('PATCH', `/outline-nodes/${node(x, 'Aufträge').id}`, { beforeId: null, parentId: null })).json;
      expect(x.nodes.map((n: any) => `${n.number} ${n.title}`)).toEqual(['1 Abrechnung', '2 Anmeldung', '2.1 Zweck', '3 Aufträge']);

      // Versionsvergleich über stabile Eintragskennungen
      const v2 = (await call('POST', `/outlines/${o.id}/versions`, {})).json;
      await call('PATCH', `/outlines/${v2.id}`, { name: 'Händler Pkw', divisions: ['car'] });
      await call('PATCH', `/outline-nodes/${node(v2, 'Abrechnung').id}`, { title: 'Rechnungen' });
      await call('PATCH', `/outline-nodes/${node(v2, 'Aufträge').id}`, { beforeId: node(v2, 'Abrechnung').id });
      await call('DELETE', `/outline-nodes/${node(v2, 'Zweck').id}`);
      await call('POST', `/outlines/${v2.id}/nodes`, { title: 'Reklamationen' });
      const cmp = (await call('GET', `/outlines/${v2.id}/compare?with=${o.id}`, undefined, 'u-leser')).json;
      expect(cmp.summary).toEqual({ added: 1, removed: 1, changed: 3, unchanged: 0 });
      const e = (t: string) => cmp.entries.find((y: any) => (y.to ?? y.from).title === t);
      expect(e('Rechnungen').details).toEqual(['umbenannt (vorher „Abrechnung“)', 'verschoben (vorher 1)']);
      expect(e('Zweck')).toMatchObject({ change: 'removed', snippetsRemoved: 3 });
      expect(e('Reklamationen')).toMatchObject({ change: 'added', to: { number: '4' } });
      expect(cmp.variant).toEqual(['Name: „Händler“ → „Händler Pkw“', 'Sparten: – → car']);
      const other = (await call('POST', '/outlines', { name: 'Andere', nodes: [{ title: 'A' }] })).json;
      expect((await call('GET', `/outlines/${v2.id}/compare?with=${other.id}`)).status).toBe(400);
      expect((await call('GET', `/outlines/${v2.id}/compare`)).status).toBe(400);

      // Globale Suche: gruppiert, mit Sprungziel; Platzhalter % und _ werden wörtlich gesucht
      await call('POST', '/abbreviations', { abbreviation: 'DMS', expansion: 'Dealer-Management-System für die Anmeldung' });
      await call('POST', '/faq', { question: 'Wie funktioniert die Anmeldung?', answer: 'Mit dem DMS-Konto.' });
      const r = (await call('GET', '/search?q=anmeldung', undefined, 'u-leser')).json;
      expect(r.groups.map((g: any) => g.type)).toEqual(['chapter', 'snippet', 'outline', 'abbreviation', 'faq']);
      expect((await call('GET', '/search?q=a.md')).json.groups.find((g: any) => g.type === 'source').hits[0]).toMatchObject({ title: 'a.md', link: '/quellen?q=a.md' });
      expect(r.groups[0].hits[0]).toMatchObject({ title: '1. Anmeldung', link: expect.stringMatching(/^\/werkstatt\//) });
      expect(r.groups.find((g: any) => g.type === 'outline').hits.map((h: any) => h.title)).toEqual(['Händler Pkw – V2']);
      expect((await call('GET', '/search?q=100%25')).json.groups.find((g: any) => g.type === 'snippet').hits[0].excerpt).toContain('100% Rabatt_Code');
      expect((await call('GET', '/search?q=%25%25')).json.total).toBe(0);
      expect((await call('GET', '/search?q=_')).status).toBe(400);
      expect((await call('GET', '/search?q=Anmeldung', undefined, 'u-admin', 'p_fremd')).status).toBeGreaterThanOrEqual(400);
    } finally {
      await built.app.close();
    }
  });
});
