import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { numberNodes, parseOutlineJson, parseOutlineMarkdown, variantProblems } from '../src/domain/outline.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';
import { png } from './png.js';

const fm = (extra = '') => `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n${extra}---\n`;

describe('Stammdaten und Draft Manual (ADR-032, ADR-033)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' }));

  it('[T-166] Gliederungen: Upload (Markdown/JSON), Varianten Rolle/Sparte/Blueprint/Märkte, Einträge, Versionen, Export, Projekttrennung', async () => {
    // Einheit: Einlesen und Nummerieren
    expect(parseOutlineMarkdown('# 1. Anmeldung\n## 1.1 Zweck\n### tiefer\n# Aufträge\n```\n# kein Kapitel\n```\n- Abrechnung\n  - Rechnungen\n')).toEqual([
      { title: 'Anmeldung', children: [{ title: 'Zweck' }, { title: 'tiefer' }] },
      { title: 'Aufträge', children: [] },
      { title: 'Abrechnung', children: [{ title: 'Rechnungen' }] },
    ]);
    expect(parseOutlineMarkdown('1 Einleitung\n1.1 Ziel\n2. Betrieb\n2.1.3 Details')).toEqual([{ title: 'Einleitung', children: [{ title: 'Ziel' }] }, { title: 'Betrieb', children: [{ title: 'Details' }] }]);
    expect(() => parseOutlineJson('{"x":1}')).toThrow(/nodes/);
    expect(numberNodes([{ id: 'b', parentId: null, level: 1, position: 20, title: 'B' }, { id: 'a', parentId: null, level: 1, position: 10, title: 'A' }, { id: 'a1', parentId: 'a', level: 2, position: 5, title: 'A1' }]).map((n) => `${n.number} ${n.title}`))
      .toEqual(['1 A', '1.1 A1', '2 B']);
    const outlineVariant = { roles: ['dealer'], divisions: ['car'], marketScope: 'blueprint' as const, markets: [] };
    expect(variantProblems({ roles: ['all'], divisions: [], market: null }, outlineVariant)).toEqual([]);
    expect(variantProblems({ roles: ['hq'], divisions: ['van'], market: 'FR' }, outlineVariant)).toEqual([
      'Rolle HQ gehört nicht zur Variante', 'Sparte VAN gehört nicht zur Variante', 'marktspezifisch (FR) in einer Blueprint-Gliederung',
    ]);
    expect(variantProblems({ roles: [], divisions: ['unconfirmed'], market: null }, outlineVariant)).toEqual(['Sparte ungeklärt – bitte zuordnen']);
    expect(variantProblems({ roles: [], divisions: ['unconfirmed'], market: null }, { ...outlineVariant, divisions: [] })).toEqual([]);
    expect(variantProblems({ roles: ['dealer'], divisions: ['car'], market: 'FR' }, { ...outlineVariant, marketScope: 'markets', markets: ['FR'] })).toEqual([]);

    const built = await build('outlines');
    const call = client(built);
    try {
      expect((await call('GET', '/outlines')).json.markets).toEqual(['DE', 'FR', 'IT', 'ES', 'GB', 'NL']);
      expect((await call('POST', '/outlines', { name: 'X' }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/outlines', { name: 'X', roles: ['kunde'] })).status).toBe(400);
      expect((await call('POST', '/outlines', { name: 'X', divisions: ['unconfirmed'] })).status).toBe(400);
      expect((await call('POST', '/outlines', { name: 'X', marketScope: 'markets', markets: [] })).status).toBe(400);
      expect((await call('POST', '/outlines', { name: 'X', marketScope: 'markets', markets: ['US'] })).status).toBe(400);
      expect((await call('POST', '/outlines', { name: 'Leer', content: 'nur Text ohne Gliederung', format: 'markdown' })).status).toBe(400);
      // falsch typisierte Variante (auch aus hochgeladenem JSON) → 400 statt 500
      expect((await call('POST', '/outlines', { name: 'X', content: JSON.stringify({ roles: 'dealer', nodes: [{ title: 'A' }] }), format: 'json' })).status).toBe(400);
      expect((await call('POST', '/outlines', { name: 'X', content: JSON.stringify({ divisions: 'car', nodes: [{ title: 'A' }] }), format: 'json' })).status).toBe(400);
      expect((await call('POST', '/outlines', { name: 'X', marketScope: 'markets', markets: 'FR' })).status).toBe(400);

      // Upload Markdown: Händler, Pkw, Blueprint
      const md = '# 1. Anmeldung\n## 1.1 Zweck\n## 1.2 Schritte\n# 2. Aufträge\n## 2.1 Anlegen\n';
      const dealer = await call('POST', '/outlines', { name: 'Händlerhandbuch Pkw', roles: ['dealer'], divisions: ['car'], content: md, format: 'markdown' }, 'u-redaktion');
      expect(dealer.status).toBe(201);
      expect(dealer.json).toMatchObject({ versionNo: 1, roles: ['dealer'], divisions: ['car'], marketScope: 'blueprint', markets: [], status: 'draft' });
      expect(dealer.json.nodes.map((n: any) => `${n.number} ${n.title}`)).toEqual(['1 Anmeldung', '1.1 Zweck', '1.2 Schritte', '2 Aufträge', '2.1 Anlegen']);
      // Märkte konfigurierbar (Administration), Variante mit 2 Märkten
      expect((await call('PATCH', '/projects/p_default', { markets: ['de', 'FR', 'AT'] })).json.markets).toEqual(['DE', 'FR', 'AT']);
      expect((await call('PATCH', '/projects/p_default', { markets: ['DEUTSCHLAND'] })).status).toBe(400);
      const van = (await call('POST', '/outlines', { name: 'HQ Van Märkte', roles: ['hq', 'market'], divisions: ['van'], marketScope: 'markets', markets: ['AT', 'FR'], nodes: [{ title: 'Übersicht', children: [{ title: 'Ziel' }] }] })).json;
      expect(van).toMatchObject({ marketScope: 'markets', markets: ['AT', 'FR'], roles: ['hq', 'market'] });

      // Einträge: hinzufügen (auch nach einem Eintrag), umbenennen, verschieben, einordnen, löschen
      const id = dealer.json.id;
      const n = (o: any, t: string) => o.nodes.find((x: any) => x.title === t);
      let o = (await call('POST', `/outlines/${id}/nodes`, { title: '3. Abrechnung' })).json;
      o = (await call('POST', `/outlines/${id}/nodes`, { title: 'Voraussetzungen', parentId: n(o, 'Anmeldung').id, afterId: n(o, 'Zweck').id })).json;
      expect(o.nodes.map((x: any) => `${x.number} ${x.title}`)).toEqual(['1 Anmeldung', '1.1 Zweck', '1.2 Voraussetzungen', '1.3 Schritte', '2 Aufträge', '2.1 Anlegen', '3 Abrechnung']);
      expect((await call('POST', `/outlines/${id}/nodes`, { title: 'zu tief', parentId: n(o, 'Zweck').id })).status).toBe(400);
      o = (await call('PATCH', `/outline-nodes/${n(o, 'Abrechnung').id}`, { move: 'up' })).json;
      o = (await call('PATCH', `/outline-nodes/${n(o, 'Anlegen').id}`, { title: '2.1 Auftrag anlegen' })).json;
      o = (await call('PATCH', `/outline-nodes/${n(o, 'Schritte').id}`, { parentId: null })).json;
      expect(o.nodes.map((x: any) => `${x.number} ${x.title}`)).toEqual(['1 Anmeldung', '1.1 Zweck', '1.2 Voraussetzungen', '2 Abrechnung', '3 Aufträge', '3.1 Auftrag anlegen', '4 Schritte']);
      expect((await call('PATCH', `/outline-nodes/${n(o, 'Anmeldung').id}`, { parentId: n(o, 'Abrechnung').id })).status).toBe(400); // hat Unterkapitel
      o = (await call('DELETE', `/outline-nodes/${n(o, 'Schritte').id}`)).json;
      expect(o.nodes).toHaveLength(6);
      // Strukturänderungen im Audit (wer, was)
      const actions = (await built.ctx.db.all("SELECT action, actor FROM audit_events WHERE action LIKE 'outline_node.%' ORDER BY at")).map((r) => r.action);
      expect(actions).toEqual(expect.arrayContaining(['outline_node.created', 'outline_node.updated', 'outline_node.deleted']));
      expect(await built.ctx.db.get("SELECT details FROM audit_events WHERE action = 'outline_node.updated' AND details LIKE '%Auftrag anlegen%'")).toBeTruthy();

      // Export und Wiederimport (JSON behält die Variante)
      const exp = await call('GET', `/outlines/${id}/export?format=json`);
      expect(exp.headers['content-disposition']).toContain('gliederung-handlerhandbuch-pkw-v1.json');
      const again = (await call('POST', '/outlines', { content: exp.body, format: 'json' })).json;
      expect(again).toMatchObject({ name: 'Händlerhandbuch Pkw', roles: ['dealer'], divisions: ['car'] });
      expect(again.nodes.map((x: any) => x.title)).toEqual(o.nodes.map((x: any) => x.title));
      expect((await call('GET', `/outlines/${id}/export?format=md`)).body).toContain('## 3.1 Auftrag anlegen');

      // Versionen: Kopie, Vorlage unverändert; aktive Version eindeutig
      const v2 = (await call('POST', `/outlines/${id}/versions`, {})).json;
      expect(v2).toMatchObject({ versionNo: 2, basedOnId: id, familyId: id, name: 'Händlerhandbuch Pkw' });
      await call('POST', `/outlines/${v2.id}/nodes`, { title: 'Neu in Version 2' });
      expect((await call('GET', `/outlines/${id}`)).json.nodes).toHaveLength(6);
      expect((await call('GET', `/outlines/${v2.id}`)).json.versions.map((x: any) => x.versionNo)).toEqual([2, 1]);
      await call('PATCH', `/outlines/${id}`, { status: 'active' });
      await call('PATCH', `/outlines/${v2.id}`, { status: 'active' });
      expect((await call('GET', `/outlines/${id}`)).json.status).toBe('draft');
      expect((await call('DELETE', `/outlines/${id}`)).status).toBe(409); // Grundlage von Version 2
      const list = (await call('GET', '/outlines')).json.items;
      expect(list.find((x: any) => x.id === v2.id)).toMatchObject({ latest: true, nodes: 7 });

      // Projekttrennung
      const other = (await call('POST', '/projects', { name: 'Anderes' })).json;
      expect((await call('GET', `/outlines/${id}`, undefined, 'u-admin', other.id)).status).toBe(404);
      expect((await call('PATCH', `/outline-nodes/${n(o, 'Zweck').id}`, { title: 'x' }, 'u-admin', other.id)).status).toBe(404);
      expect((await call('DELETE', `/outlines/${van.id}`)).status).toBe(204);
    } finally {
      await built.app.close();
    }
  });

  it('[T-167] Draft Manual: automatische und manuelle Zuordnung, Dopplungen, Lücken, Widersprüche und Warnungen, Export, Backup', async () => {
    const built = await build('draft');
    const call = client(built);
    try {
      await importFile(built, 'anmeldung.md', `${fm()}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldung öffnet oneSCM für alle Nutzer.\n\n## 1.2 Schritte\n\nDie Freigabe der Anmeldung durch den Administrator ist Pflicht.\n`);
      await importFile(built, 'kopie.md', `${fm()}# 7. Sonstiges\n\n## 7.1 Hinweise\n\nDie Anmeldung öffnet oneSCM für alle Nutzer.\n\nDie Freigabe der Anmeldung durch den Administrator ist optional.\n`);
      await importFile(built, 'markt.md', `${fm('market: FR\n')}# 1. Anmeldung\n\n## 1.1 Zweck\n\nIn Frankreich gilt zusätzlich die lokale Anmeldung.\n`);
      await call('POST', '/quality/analysis');
      await built.ctx.jobs.idle();

      const outline = (await call('POST', '/outlines', { name: 'Blueprint', content: '# Anmeldung\n## Zweck\n## Schritte\n# Aufträge\n', format: 'markdown' })).json;
      const node = (t: string) => outline.nodes.find((x: any) => x.title === t).id;
      // mehrdeutig: zwei gleichnamige Unterkapitel unter einem Kapitel → keine automatische Zuordnung dorthin
      const amb = (await call('POST', '/outlines', { name: 'Mehrdeutig', nodes: [{ title: 'Anmeldung', children: [{ title: 'Zweck' }, { title: '1.1 Zweck' }] }] })).json;
      await call('POST', `/outlines/${amb.id}/auto-assign`, {});
      const ambDraft = (await call('GET', `/outlines/${amb.id}/draft`)).json;
      expect(ambDraft.nodes.filter((x: any) => x.level === 2).map((x: any) => x.snippets.length)).toEqual([0, 0]);
      expect(ambDraft.nodes[0].snippets.map((s: any) => s.text)).toContain('Die Anmeldung öffnet oneSCM für alle Nutzer.');
      await call('DELETE', `/outlines/${amb.id}`);
      // automatische Zuordnung über Kapitel-/Unterkapiteltitel (Nummern ignoriert)
      const auto = (await call('POST', `/outlines/${outline.id}/auto-assign`, {}, 'u-redaktion')).json;
      expect(auto).toMatchObject({ assigned: 3, remaining: 2 });
      // Kandidaten: nur nicht zugeordnete, Textsuche
      const cand = (await call('GET', `/outlines/${outline.id}/candidates`)).json;
      expect(cand.total).toBe(2);
      expect((await call('GET', `/outlines/${outline.id}/candidates?q=optional`)).json.items.map((s: any) => s.text)).toEqual(['Die Freigabe der Anmeldung durch den Administrator ist optional.']);
      // manuelle Zuordnung beider Schnipsel aus „Sonstiges“ nach „Schritte“
      expect((await call('POST', `/outlines/${outline.id}/assignments`, { nodeId: node('Schritte'), snippetIds: cand.items.map((s: any) => s.id) }, 'u-leser')).status).toBe(403);
      expect((await call('POST', `/outlines/${outline.id}/assignments`, { nodeId: node('Schritte'), snippetIds: ['sn_fremd'] })).status).toBe(400);
      expect((await call('POST', `/outlines/${outline.id}/assignments`, { nodeId: node('Schritte'), snippetIds: cand.items.map((s: any) => s.id) })).json).toMatchObject({ assigned: 2 });

      const d = (await call('GET', `/outlines/${outline.id}/draft`, undefined, 'u-leser')).json;
      const byTitle = (t: string) => d.nodes.find((x: any) => x.title === t);
      const types = (s: any) => [...new Set(s.flags.map((f: any) => f.type))].sort();
      // Lücke: Kapitel ohne Inhalte
      expect(byTitle('Aufträge').flags).toEqual([{ type: 'gap', label: 'keine Textschnipsel zugeordnet' }]);
      expect(byTitle('Anmeldung').flags).toEqual([]); // Unterkapitel haben Inhalte
      const zweck = byTitle('Zweck').snippets;
      expect(zweck.map((s: any) => s.text)).toEqual(['Die Anmeldung öffnet oneSCM für alle Nutzer.', 'In Frankreich gilt zusätzlich die lokale Anmeldung.']);
      // Dopplung (gleicher Text in 1.1 und 1.2) und Warnung für marktspezifischen Inhalt in der Blueprint-Gliederung
      expect(types(zweck[0])).toContain('duplicate');
      expect(zweck[0].flags.find((f: any) => f.label.startsWith('Gleicher Text'))?.label).toBe('Gleicher Text auch in 1.2');
      expect(zweck[1].flags).toContainEqual({ type: 'warning', label: 'Variante: marktspezifisch (FR) in einer Blueprint-Gliederung' });
      // Widerspruch aus der Qualitätsanalyse (Pflicht vs. optional)
      const schritte = byTitle('Schritte').snippets;
      expect(schritte.some((s: any) => types(s).includes('contradiction'))).toBe(true);
      expect(d.summary).toMatchObject({ snippets: 5, gap: 1, unassigned: 0 });
      expect(d.summary.duplicate).toBeGreaterThanOrEqual(2);
      expect(d.summary.contradiction).toBeGreaterThanOrEqual(2);

      // Reihenfolge ändern, Zuordnung lösen
      await call('PATCH', `/outlines/${outline.id}/assignments/${zweck[1].id}`, { move: 'up' });
      expect((await call('GET', `/outlines/${outline.id}/draft`)).json.nodes.find((x: any) => x.title === 'Zweck').snippets[0].id).toBe(zweck[1].id);
      expect((await call('DELETE', `/outlines/${outline.id}/assignments/${zweck[1].id}`)).status).toBe(204);
      expect((await call('DELETE', `/outlines/${outline.id}/assignments/${zweck[1].id}`)).status).toBe(404);

      // Export als Markdown mit Kennzeichnungen
      const md = (await call('GET', `/outlines/${outline.id}/draft/export`)).body;
      expect(md).toContain('## 2 Aufträge');
      expect(md).toContain('> 🟣 Lücke: keine Textschnipsel zugeordnet');
      expect(md).toContain('> 🟠 Dopplung: Gleicher Text auch in 1.2');
      expect(md).toContain('> 🔴 Widerspruch');
      expect((await call('GET', `/outlines/${outline.id}/draft/export?flags=false`)).body).not.toContain('🟠');

      // Neue Version übernimmt Zuordnungen; Backup/Restore mit selbstbezüglicher Knotenhierarchie
      const v2 = (await call('POST', `/outlines/${outline.id}/versions`, {})).json;
      expect((await call('GET', `/outlines/${v2.id}/draft`)).json.summary.snippets).toBe(4);
      const { createBackup, restoreBackup } = await import('../src/services/backup.js');
      const { data, manifest } = await createBackup(built.ctx.db, built.ctx.store, '0.11.0');
      expect(manifest.tables.outline_nodes).toBe(8);
      const dst = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'draft-ziel'), logger: false, webDist: null, authMode: 'demo' }, { worker: false });
      try {
        expect((await restoreBackup(dst.ctx.db, dst.ctx.store, data)).restored.outline_assignments).toBe(8);
        expect((await client(dst)('GET', `/outlines/${v2.id}/draft`)).json.summary.snippets).toBe(4);
      } finally {
        await dst.app.close();
      }
    } finally {
      await built.app.close();
    }
  });

  it('[T-168] Redaktionsplanung je Kapitel/Unterkapitel: Verantwortliche, Termin, Status, Überfälligkeit, Fortschritt', async () => {
    const built = await build('plan');
    const call = client(built);
    try {
      const o = (await call('POST', '/outlines', { name: 'Plan', nodes: [{ title: 'A', children: [{ title: 'A1' }] }, { title: 'B' }] })).json;
      const [a, a1, b] = o.nodes;
      expect((await call('PUT', `/outline-nodes/${a.id}/plan`, { status: 'fertig' })).status).toBe(400);
      expect((await call('PUT', `/outline-nodes/${a.id}/plan`, { dueDate: '31.12.2026' })).status).toBe(400);
      expect((await call('PUT', `/outline-nodes/${a.id}/plan`, { assignee: 'u-redaktion' }, 'u-leser')).status).toBe(403);
      expect((await call('PUT', `/outline-nodes/${a.id}/plan`, { assignee: 'u-redaktion', dueDate: '2020-01-31', status: 'in_progress', note: 'Screenshots fehlen' })).json)
        .toMatchObject({ number: '1', assignee: 'u-redaktion', dueDate: '2020-01-31', status: 'in_progress', overdue: true, note: 'Screenshots fehlen' });
      await call('PUT', `/outline-nodes/${a1.id}/plan`, { status: 'done', dueDate: '2020-01-01' });
      await call('PUT', `/outline-nodes/${b.id}/plan`, { dueDate: '2999-12-31' });
      const plan = (await call('GET', `/outlines/${o.id}/plan`, undefined, 'u-leser')).json;
      expect(plan.summary).toMatchObject({ total: 3, open: 1, in_progress: 1, done: 1, overdue: 1, progress: 33 });
      expect(plan.items.map((i: any) => [i.number, i.status, i.overdue])).toEqual([['1', 'in_progress', true], ['1.1', 'done', false], ['2', 'open', false]]);
      // Teilaktualisierung behält übrige Werte
      expect((await call('PUT', `/outline-nodes/${a.id}/plan`, { status: 'review' })).json).toMatchObject({ assignee: 'u-redaktion', dueDate: '2020-01-31', status: 'review' });
      // Löschen des Knotens entfernt die Planung
      await call('DELETE', `/outline-nodes/${b.id}`);
      expect((await call('GET', `/outlines/${o.id}/plan`)).json.summary.total).toBe(2);
    } finally {
      await built.app.close();
    }
  });

  it('[T-169] Abkürzungen mit Vorschlägen, FAQ mit Vorschlägen aus dem Assistenten, Bildverzeichnis mit Verwendung und Titel', async () => {
    const built = await build('stammdaten');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${fm()}# 1. Aufträge\n\n## 1.1 Zweck\n\nIm DMS erfassen Sie Aufträge; das DMS übergibt sie an SAP.\n\nDas DMS prüft die VIN.\n`);
      // Abkürzungen
      expect((await call('POST', '/abbreviations', { abbreviation: 'DMS' }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/abbreviations', { abbreviation: 'DMS', expansion: 'Dealer-Management-System' }, 'u-leser')).status).toBe(403);
      const dms = (await call('POST', '/abbreviations', { abbreviation: 'DMS', expansion: 'Dealer-Management-System' }, 'u-redaktion')).json;
      expect((await call('POST', '/abbreviations', { abbreviation: 'DMS', expansion: 'x' })).status).toBe(409);
      expect((await call('GET', '/abbreviations/suggestions')).json.map((s: any) => s.abbreviation)).toEqual(['SAP', 'VIN']);
      await call('POST', '/abbreviations', { abbreviation: 'SAP', expansion: 'Systeme, Anwendungen und Produkte' });
      expect((await call('PATCH', `/abbreviations/${dms.id}`, { abbreviation: 'SAP' })).status).toBe(409);
      expect((await call('PATCH', `/abbreviations/${dms.id}`, { description: 'Händlersystem' })).json).toMatchObject({ abbreviation: 'DMS', description: 'Händlersystem' });
      expect((await call('GET', '/abbreviations', undefined, 'u-leser')).json.map((a: any) => a.abbreviation)).toEqual(['DMS', 'SAP']);
      expect((await call('DELETE', `/abbreviations/${dms.id}`)).status).toBe(204);

      // FAQ: pflegen, filtern, sortieren
      expect((await call('POST', '/faq', { question: 'Wie?', answer: '' })).status).toBe(400);
      expect((await call('POST', '/faq', { question: 'Wer darf Aufträge anlegen?', answer: 'Händler.', roles: ['kunde'] })).status).toBe(400);
      const f1 = (await call('POST', '/faq', { question: 'Wer darf Aufträge anlegen?', answer: 'Händler im DMS.', roles: ['dealer'], status: 'published' }, 'u-redaktion')).json;
      const f2 = (await call('POST', '/faq', { question: 'Wo sehe ich Rechnungen?', answer: 'Unter Abrechnung.' })).json;
      expect(f1).toMatchObject({ source: 'manual', roles: ['dealer'], status: 'published' });
      expect((await call('GET', '/faq?role=hq')).json.map((x: any) => x.id)).toEqual([f2.id]);
      expect((await call('GET', '/faq?status=published')).json.map((x: any) => x.id)).toEqual([f1.id]);
      await call('PATCH', `/faq/${f2.id}`, { move: 'up' });
      expect((await call('GET', '/faq')).json.map((x: any) => x.id)).toEqual([f2.id, f1.id]);

      // Vorschläge aus dem Assistenten: wiederholt, unbeantwortet; bereits erfasste Fragen entfallen
      for (const q of ['Wie lege ich Aufträge im DMS an?', 'wie lege ich aufträge im DMS an', 'Wie storniere ich eine Rechnung?', 'Wer darf Aufträge anlegen?']) await call('POST', '/assistant/ask', { question: q }, 'u-leser');
      expect((await call('GET', '/faq/suggestions', undefined, 'u-leser')).status).toBe(403);
      const sugg = (await call('GET', '/faq/suggestions', undefined, 'u-redaktion')).json;
      const qs = sugg.map((s: any) => s.question);
      expect(qs).toContain('Wie storniere ich eine Rechnung?');
      expect(sugg.find((s: any) => /Aufträge im DMS/i.test(s.question))).toMatchObject({ question: 'Wie lege ich Aufträge im DMS an?', asked: 2, unanswered: 2 });
      expect(qs).not.toContain('Wer darf Aufträge anlegen?');
      const taken = (await call('POST', '/faq', { question: 'Wie storniere ich eine Rechnung?', answer: 'Über Abrechnung → Storno.', sourceQuestion: 'Wie storniere ich eine Rechnung?' })).json;
      expect(taken.source).toBe('assistant');
      expect((await call('GET', '/faq/suggestions', undefined, 'u-redaktion')).json.map((s: any) => s.question)).not.toContain('Wie storniere ich eine Rechnung?');
      expect((await call('DELETE', `/faq/${taken.id}`)).status).toBe(204);

      // Bildverzeichnis: Verwendung, Alternativtexte, Titel
      const JSZip = (await import('jszip')).default;
      const z = new JSZip();
      z.file('2.md', `${fm()}# 2. Rechnungen\n\n## 2.1 Übersicht\n\n![Rechnungsliste](bilder/liste.png)\n`);
      z.file('bilder/liste.png', png(8, 4));
      z.file('bilder/unbenutzt.png', png(2, 2, [0, 0, 0]));
      await importFile(built, 'r.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const idx = (await call('GET', '/image-index', undefined, 'u-leser')).json;
      expect(idx).toHaveLength(2);
      const used = idx.find((i: any) => i.originalName === 'liste.png');
      expect(used).toMatchObject({ number: 1, altTexts: ['Rechnungsliste'], missingAlt: false, width: 8, height: 4 });
      expect(used.usedIn.sources).toEqual([expect.objectContaining({ chapter: '2. Rechnungen' })]);
      expect(idx.find((i: any) => i.originalName === 'unbenutzt.png')).toMatchObject({ number: null, altTexts: [] });
      expect((await call('PATCH', `/media/${used.sha256}`, { title: 'Abb.: Rechnungsliste' }, 'u-leser')).status).toBe(403);
      expect((await call('PATCH', `/media/${used.sha256}`, { title: 'Abb.: Rechnungsliste' })).json.title).toBe('Abb.: Rechnungsliste');
      expect((await call('GET', '/image-index')).json.find((i: any) => i.sha256 === used.sha256).title).toBe('Abb.: Rechnungsliste');
    } finally {
      await built.app.close();
    }
  });
});
