import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { classifyBlock, factValue, overall, plausibilityValue, traffic, type StatementSource } from '../src/domain/assessment.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 50', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));
  const src = (text: string, extra: Partial<StatementSource> = {}): StatementSource => ({ label: 'S1', snippetId: 's1', seq: 1, text, confirmed: true, contradicted: false, ...extra });

  it('[T-324] Plausibilität je Aussage, Fakten-Wert, Ampel und Gesamtbewertung (Einheit)', () => {
    const quelle = 'Verträge kündigen Sie im Menü Verträge mit der Schaltfläche Kündigen. Die Kündigungsfrist beträgt 30 Tage.';
    const b = { id: 'b1', section: 'Schritte', kind: 'paragraph', text: 'Verträge kündigen Sie im Menü Verträge. Die Kündigungsfrist beträgt 45 Tage. Der Händler erhält automatisch eine Gutschrift per Brief.' };
    const s = classifyBlock(b, [src(quelle)], 0.6);
    expect(s.map((x) => x.class)).toEqual(['supported', 'unsupported', 'unsupported']);
    expect(s[1].reason).toContain('Zahl nicht in der Quelle');
    expect(s[2].reason).toBe('geht über die Quellen hinaus');
    expect(classifyBlock(b, [], 0.6).every((x) => x.class === 'unsupported' && x.reason === 'Absatz ohne Quelle')).toBe(true);
    expect(classifyBlock({ ...b, text: 'Verträge kündigen Sie im Menü Verträge.' }, [src(quelle, { contradicted: true })], 0.6)[0].class).toBe('contradiction');
    expect(classifyBlock({ ...b, text: 'Verträge kündigen Sie im Menü Verträge.' }, [src(quelle, { confirmed: false })], 0.6)[0]).toMatchObject({ class: 'unsupported', reason: 'nur unbestätigte Quellen' });
    expect(classifyBlock({ id: 'g', section: 'Zweck', kind: 'gap', text: 'Thema Kündigungsfrist ohne Quelle.' }, [], 0.6)[0].class).toBe('missing');
    // Listenpunkte und Bilder sind keine eigene Aussage, Querverweise zählen nicht
    expect(classifyBlock({ id: 'l', section: 'Schritte', kind: 'list', text: '1. Öffnen Sie das Menü Verträge.\n2. ![Liste](media:abc)' }, [src(quelle)], 0.6)).toHaveLength(1);
    expect(classifyBlock({ id: 'x', section: 'Schritte', kind: 'xref', text: 'Weiter mit „Vertrag anlegen“' }, [], 0.6)).toEqual([]);
    // Wert: Widerspruch zählt doppelt
    expect(plausibilityValue([{ class: 'supported' }, { class: 'supported' }, { class: 'unsupported' }, { class: 'missing' }])).toMatchObject({ value: 50 });
    expect(plausibilityValue([{ class: 'supported' }, { class: 'contradiction' }]).value).toBe(33);
    expect(plausibilityValue([]).value).toBe(100);
    // Fakten
    expect(factValue([{ text: '1. Öffnen Sie **E-4711**.\nDie Frist beträgt 30 Tage, 45 % gelten als Rabatt.', sourceText: 'Fehler E-4711. Frist 30 Tage.' }])).toEqual({ value: 67, total: 3, found: 2, missing: ['45 %'] });
    expect(factValue([{ text: 'Ohne Zahlen.', sourceText: '' }]).value).toBe(100);
    // Ampel und Gesamtwert
    expect([traffic(80), traffic(79), traffic(60), traffic(59)]).toEqual(['green', 'yellow', 'yellow', 'red']);
    expect(overall({ language: 90, goal: 90, tone: 90, sources: 90, facts: 90 })).toEqual({ value: 90, traffic: 'green' });
    expect(overall({ language: 100, goal: 100, tone: 100, sources: 100, facts: 50 })).toEqual({ value: 90, traffic: 'red' });
    expect(overall({ language: 85, goal: 85, tone: 85, sources: 70, facts: 85 }).traffic).toBe('yellow');
  });

  it('[T-325] Kapitelbewertung mit fünf Kriterien und Ampel, Plausibilität je Aussage, Übersicht aller Kapitel', async () => {
    const built = await build('assessment');
    const call = client(built);
    try {
      const md = `${FM}# Kündigung\n\n## Vertrag kündigen\n\nVerträge kündigen Sie im Menü **Verträge** mit der Schaltfläche **Kündigen**. Die Kündigungsfrist beträgt 30 Tage.\n\nNach der Kündigung erhält der Händler eine Bestätigung.\n`;
      await importFile(built, 'kuendigung.md', md);
      const chapterId = (await call('GET', '/chapters')).json.find((c: any) => c.title === 'Kündigung').id;
      const v = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
      const p = (await call('GET', `/chapter-versions/${v.id}/plausibility`, undefined, 'u-leser')).json;
      expect(p.counts.supported).toBeGreaterThan(0);
      expect(p.statements.every((s: any) => ['belegt', 'unbelegt', 'Widerspruch', 'fehlend'].includes(s.label))).toBe(true);
      // Lücken des erzeugten Kapitels zählen als „fehlend“, die Rollenliste des Generators ist keine Aussage
      expect(p.counts.missing).toBeGreaterThan(0);
      expect(p.statements.some((s: any) => /betrifft folgende Rollen/.test(s.text))).toBe(false);
      expect(p.value).toBe(Math.round((100 * p.counts.supported) / (p.counts.supported + p.counts.unsupported + p.counts.missing + 2 * p.counts.contradiction)));
      const a = (await call('GET', `/chapter-versions/${v.id}/assessment`, undefined, 'u-leser')).json;
      expect(a.criteria.map((c: any) => c.label)).toEqual(['Sprache', 'Ziel', 'Tonalität', 'Quellenabgleich', 'Fakten']);
      for (const c of a.criteria) {
        expect(c.value).toBeGreaterThanOrEqual(0);
        expect(c.value).toBeLessThanOrEqual(100);
        expect(['green', 'yellow', 'red']).toContain(c.traffic);
        expect(c.detail).toBeTruthy();
      }
      expect(a.criteria.find((c: any) => c.code === 'sources').value).toBe(p.value);
      expect(a.overall).toMatchObject({ traffic: expect.stringMatching(/green|yellow|red/), label: expect.any(String) });

      // Absatz mit erfundener Zahl: Quellenabgleich und Fakten sinken
      const purpose = v.sections.flatMap((s: any) => s.blocks).find((b: any) => b.kind === 'paragraph' && /Kündigungsfrist/.test(b.text));
      expect((await call('PATCH', `/content-blocks/${purpose.id}`, { text: `${purpose.text} Die Rückerstattung erfolgt nach 14 Tagen über das Portal E-9999.`, reason: 'Test', expectedVersionNo: purpose.versionNo }, 'u-redaktion')).status).toBe(200);
      const a2 = (await call('GET', `/chapter-versions/${v.id}/assessment`)).json;
      const val = (x: any, c: string) => x.criteria.find((k: any) => k.code === c).value;
      expect(val(a2, 'facts')).toBeLessThan(val(a, 'facts'));
      expect(val(a2, 'sources')).toBeLessThan(val(a, 'sources'));
      expect(a2.criteria.find((k: any) => k.code === 'facts').detail).toContain('E-9999');
      const p2 = (await call('GET', `/chapter-versions/${v.id}/plausibility`)).json;
      expect(p2.statements.some((s: any) => s.class === 'unsupported' && /14 Tagen/.test(s.text))).toBe(true);

      const ov = (await call('GET', '/assessments', undefined, 'u-leser')).json;
      const row = ov.items.find((i: any) => i.chapterId === chapterId);
      expect(row).toMatchObject({ versionId: v.id, title: 'Kündigung' });
      expect(ov.summary.chapters).toBe(ov.items.length);
      expect(ov.summary.green + ov.summary.yellow + ov.summary.red).toBe(ov.items.length);
      expect((await call('GET', '/chapter-versions/cv_unbekannt/assessment')).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });

  it('[T-326] Fehlerliste: Funde der Stilprüfung übernehmen, Status mit Begründung, Abgleich nach Korrektur, Export und Rückimport wie FEHLERLISTE.csv', async () => {
    const built = await build('errors');
    const call = client(built);
    try {
      const ch = (await call('POST', '/chapter-assistant', { title: 'Antrag anlegen', purpose: 'Mit dieser Anleitung legen sie einen Antrag an , der Antrag wird gespeichert werden.', steps: ['Öffnen Sie **Anträge**'], result: 'Der Antrag ist gespeichert.' }, 'u-redaktion')).json;
      expect((await call('POST', '/language-errors/collect', { versionId: ch.versionId }, 'u-leser')).status).toBe(403);
      const c1 = (await call('POST', '/language-errors/collect', { versionId: ch.versionId }, 'u-redaktion')).json;
      expect(c1.added).toBeGreaterThan(0);
      expect(c1.items.every((i: any) => i.status === 'open' && /^F-\d{4}$/.test(i.nr) && i.location.startsWith('App: Antrag anlegen › '))).toBe(true);
      expect(c1.items.map((i: any) => i.category)).toEqual(expect.arrayContaining(['Zeichensetzung']));
      // erneut übernehmen: nichts doppelt
      const c2 = (await call('POST', '/language-errors/collect', { versionId: ch.versionId }, 'u-redaktion')).json;
      expect(c2).toMatchObject({ added: 0, known: c1.added });
      // Status: abgelehnt nur mit Begründung
      const first = c1.items[0];
      expect((await call('PATCH', `/language-errors/${first.id}`, { status: 'rejected' }, 'u-redaktion')).status).toBe(409);
      expect((await call('PATCH', `/language-errors/${first.id}`, { status: 'rejected', reason: 'Absicht' }, 'u-redaktion')).json).toMatchObject({ status: 'rejected', statusLabel: 'abgelehnt', reason: 'Absicht' });
      expect((await call('PATCH', `/language-errors/${first.id}`, { status: 'wichtig' }, 'u-redaktion')).status).toBe(400);
      // manueller Eintrag
      const manual = (await call('POST', '/language-errors', { location: '05_I_Output/02_Releaseletter/03_Final/01_Deutsch_DE/RL.md, Zeile 3', error: 'Service Vertrag', correction: 'Servicevertrag', category: 'Rechtschreibung' }, 'u-redaktion'));
      expect(manual.status).toBe(201);
      expect((await call('POST', '/language-errors', { location: 'x', error: 'y', category: 'Unsinn' }, 'u-redaktion')).status).toBe(400);
      // Korrektur im Kapitel: Abgleich setzt erledigte Funde auf „korrigiert“
      const v = (await call('GET', `/chapter-versions/${ch.versionId}`)).json;
      const purpose = v.sections.flatMap((s: any) => s.blocks).find((b: any) => /Antrag an ,/.test(b.text));
      await call('PATCH', `/content-blocks/${purpose.id}`, { text: 'Mit dieser Anleitung legen Sie einen Antrag an.', reason: 'Lektorat', expectedVersionNo: purpose.versionNo }, 'u-redaktion');
      const c3 = (await call('POST', '/language-errors/collect', { versionId: ch.versionId }, 'u-redaktion')).json;
      expect(c3.fixed).toBeGreaterThan(0);
      const list = (await call('GET', '/language-errors', undefined, 'u-leser')).json;
      expect(list.summary.fixed).toBe(c3.fixed);
      expect(list.statusLabels).toEqual({ open: 'offen', fixed: 'korrigiert', rejected: 'abgelehnt', rule_missing: 'Regel fehlt' });
      expect((await call('GET', '/language-errors?status=rejected')).json.items).toHaveLength(1);
      expect((await call('GET', '/language-errors?q=service')).json.items).toHaveLength(1);

      // Export wie FEHLERLISTE.csv
      const exp = await call('GET', '/language-errors/export', undefined, 'u-leser');
      expect(exp.headers['content-type']).toContain('text/csv');
      const lines = exp.body.replace(/^﻿/, '').trim().split('\r\n');
      expect(lines[0]).toBe('Nr;Datum;Fundstelle;Fehler;Korrektur;Kategorie;Regel;Status');
      expect(lines.some((l: string) => l.endsWith(';abgelehnt (Absicht)'))).toBe(true);
      expect(lines.some((l: string) => /;\d{2}\.\d{2}\.\d{4};/.test(l))).toBe(true);
      // Rückimport: Status ändern, neuer Eintrag, Fehler in einer Zeile → nur Vorschau
      const manualNr = manual.json.nr;
      const csv = [lines[0], ...lines.slice(1).map((l: string) => (l.startsWith(`${manualNr};`) ? l.replace(/;offen$/, ';korrigiert') : l)),
        'F-0900;24.10.2026;06_II_Stil_und_Design/02_Tonalitaet/TONALITAET.md;Du;Sie;Stil und Tonalität;TONALITAET.md;offen'].join('\r\n');
      const pre = (await call('POST', '/language-errors/import', { csv }, 'u-redaktion')).json;
      expect(pre.applied).toBe(false);
      expect(pre.changes.filter((c: any) => c.action === 'update').map((c: any) => c.nr)).toEqual([manualNr]);
      expect(pre.changes.find((c: any) => c.nr === 'F-0900').action).toBe('new');
      const bad = (await call('POST', '/language-errors/import', { csv: `${csv}\r\nF-0901;;x;y;;Kategorie X;;erledigt`, apply: true }, 'u-redaktion')).json;
      expect(bad).toMatchObject({ applied: false, invalid: 1 });
      const ok = (await call('POST', '/language-errors/import', { csv, apply: true }, 'u-redaktion')).json;
      expect(ok.applied).toBe(true);
      const after = (await call('GET', '/language-errors')).json.items;
      expect(after.find((i: any) => i.nr === manualNr).status).toBe('fixed');
      expect(after.find((i: any) => i.nr === 'F-0900')).toMatchObject({ origin: 'import', category: 'Stil und Tonalität', location: '06_II_Stil_und_Design/02_Tonalitaet/TONALITAET.md' });
      // neue Nummern zählen nach dem Import weiter
      expect((await call('POST', '/language-errors', { location: 'x', error: 'y', category: 'Format' }, 'u-redaktion')).json.nr).toBe('F-0901');
    } finally {
      await built.app.close();
    }
  });
});
