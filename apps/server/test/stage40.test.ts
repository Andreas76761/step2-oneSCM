import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { analyzeGuidance } from '../src/domain/guidance.js';
import { coverageMatrix, matrixColumns } from '../src/domain/imageMatrix.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const png = (rgb: string) => {
  const c = createCanvas(800, 450);
  const g = c.getContext('2d');
  g.fillStyle = rgb;
  g.fillRect(0, 0, 800, 450);
  return c.toBuffer('image/png');
};
const multipart = (name: string, data: Buffer) => {
  const boundary = '----s' + Math.random().toString(16).slice(2);
  return {
    payload: Buffer.concat([Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${name}"\r\nContent-Type: application/octet-stream\r\n\r\n`), data, Buffer.from(`\r\n--${boundary}--\r\n`)]),
    headers: { 'content-type': `multipart/form-data; boundary=${boundary}` },
  };
};

describe('Etappe 40', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-279] Punktmodell Muss/Soll (F-08) und Deckungsmatrix Stelle × Sprache/Rolle/Sparte (F-30) (Einheit)', () => {
    const b = (id: string, section: string, text: string, kind = 'paragraph') => ({ id, section, kind, text, versionNo: 1 });
    const blocks = [b('1', 'steps', '1. Öffnen Sie **Einkauf > Aufträge**.\n2. Klicken Sie auf **Neu**.', 'list'), b('2', 'result', 'Der Auftrag ist gespeichert.')];
    const a = analyzeGuidance(blocks);
    // Zweck fehlt (Muss), Voraussetzungen fehlen (Soll)
    expect(a.checks.find((c) => c.code === 'purpose')).toMatchObject({ level: 'must', points: 0, maxPoints: 10 });
    expect(a.checks.find((c) => c.code === 'prerequisites')).toMatchObject({ level: 'should', points: 0, maxPoints: 5 });
    expect(a.mustOpen).toEqual(['purpose']);
    expect(a.mustPassed).toBe(false);
    expect(a.points.possible).toBe(a.checks.reduce((n, c) => n + c.maxPoints, 0));
    expect(a.points.achieved).toBe(a.points.possible - 15);
    const relaxed = analyzeGuidance(blocks, { levels: { purpose: 'should' } });
    expect(relaxed).toMatchObject({ mustOpen: [], mustPassed: true });
    expect(relaxed.score).toBe(a.score); // der bisherige Wert bleibt unverändert

    expect(matrixColumns(['role', 'language'], ['de', 'en']).map((c) => c.label)).toEqual(['DE · Händler', 'DE · Markt', 'DE · MO', 'DE · Zentrale', 'EN · Händler', 'EN · Markt', 'EN · MO', 'EN · Zentrale']);
    const img = (imageNo: string, language: string | null, roles: string[], divisions: string[], place: string, placeholder = false) => ({ imageNo, title: null, language, roles, divisions, placeholder, places: [{ key: place, label: place }] });
    const m = coverageMatrix([
      img('B-0001', 'de', ['all'], ['car'], 'Startseite'),
      img('B-0002', 'en', ['dealer'], ['all'], 'Startseite', true),
      img('B-0003', null, [], [], 'Verträge'),
    ], ['language', 'division'], ['de', 'en']);
    expect(m.columns.map((c) => c.key)).toEqual(['de|car', 'de|van', 'en|car', 'en|van']);
    const start = m.rows.find((r) => r.label === 'Startseite')!;
    expect(start.cells.map((c) => [c.count, c.placeholders])).toEqual([[1, 0], [0, 0], [0, 1], [0, 1]]);
    expect(start).toMatchObject({ gaps: 1, placeholderOnly: 2, unassigned: [] });
    expect(m.rows.find((r) => r.label === 'Verträge')).toMatchObject({ gaps: 4, unassigned: ['B-0003'] });
    expect(m.summary).toMatchObject({ rows: 2, columns: 4, cells: 8, covered: 1, gaps: 5, placeholderOnly: 2, coverage: 13, unassigned: 1 });
  });

  it('[T-280] Muss/Soll je Projekt einstellbar, „alle Muss-Punkte“ als Freigabebedingung, Punkte in der Übersicht', async () => {
    const built = await build('punkte');
    const call = client(built);
    try {
      const chapter = (title: string, extra: Record<string, unknown> = {}) => call('POST', '/chapter-assistant', {
        title, purpose: 'Mit dieser Anleitung legen Sie einen Auftrag an.', prerequisites: ['Sie haben die Berechtigung Einkauf'],
        steps: ['Öffnen Sie **Einkauf > Aufträge**', 'Klicken Sie auf **Neu**'], result: 'Der Auftrag ist gespeichert.', ...extra,
      }, 'u-redaktion');
      await importFile(built, 'x.md', `${FM}# 1. Nebenkapitel\n\nKlicken Sie auf **Speichern**.\n`);
      const good = (await chapter('Auftrag anlegen')).json;
      const weak = (await chapter('Schwach', { purpose: 'Zweck …' })).json;
      const s0 = (await call('GET', '/guidance/settings', undefined, 'u-leser')).json;
      expect(s0).toMatchObject({ minScore: null, requireMust: false, levels: { purpose: 'must', result: 'should' } });
      expect(s0.checks).toHaveLength(12);

      const g = (await call('GET', `/guidance/chapter-versions/${weak.versionId}`, undefined, 'u-leser')).json;
      expect(g.mustOpen).toContain('placeholders');
      expect(g.checks.find((c: any) => c.code === 'placeholders')).toMatchObject({ level: 'must', points: 0 });

      expect((await call('PUT', '/guidance/settings', { requireMust: true }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/guidance/settings', { levels: { purpose: 'kann' } })).status).toBe(400);
      expect((await call('PUT', '/guidance/settings', { levels: { unbekannt: 'must' } })).status).toBe(400);
      expect((await call('PUT', '/guidance/settings', { requireMust: 'ja' })).status).toBe(400);
      const s1 = (await call('PUT', '/guidance/settings', { requireMust: true, levels: { result: 'must' } })).json;
      expect(s1).toMatchObject({ minScore: null, requireMust: true, levels: { result: 'must' } });

      // ohne Mindestwert: nur die Muss-Bedingung
      const gate = (await call('GET', `/chapter-versions/${weak.versionId}/gate`)).json;
      const must = gate.checks.find((c: any) => c.code === 'guidance_must');
      expect(must).toMatchObject({ passed: false });
      expect(must.label).toMatch(/alle Muss-Punkte erfüllt \(\d+ von \d+ Punkten, offen: \d+\)/);
      expect(must.details).toContain('! Platzhalter „…“ offen');
      expect(gate.checks.some((c: any) => c.code === 'guidance_min_score')).toBe(false);
      expect((await call('POST', `/chapter-versions/${weak.versionId}/submit`, {}, 'u-redaktion')).status).toBe(409);
      expect((await call('GET', `/chapter-versions/${good.versionId}/gate`)).json.checks.find((c: any) => c.code === 'guidance_must').passed).toBe(true);
      // beides eingestellt: zwei Bedingungen
      await call('PUT', '/guidance/settings', { minScore: 50 });
      expect((await call('GET', `/chapter-versions/${good.versionId}/gate`)).json.checks.filter((c: any) => c.code.startsWith('guidance_')).map((c: any) => c.code)).toEqual(['guidance_min_score', 'guidance_must']);

      const list = (await call('GET', '/guidance', undefined, 'u-leser')).json.chapters;
      const w = list.find((c: any) => c.versionId === weak.versionId);
      expect(w).toMatchObject({ mustPassed: false });
      expect(w.points.achieved).toBeLessThan(w.points.possible);
      expect(w.open.find((o: any) => o.code === 'placeholders')).toMatchObject({ level: 'must' });
      // zurück auf Standard
      const s2 = (await call('PUT', '/guidance/settings', { minScore: null, requireMust: false, levels: { result: 'should' } })).json;
      expect(s2).toMatchObject({ requireMust: false, levels: { result: 'should' } });
      expect((await built.ctx.db.get('SELECT guidance_levels FROM projects WHERE id = ?', built.ctx.projectId))!.guidance_levels).toBe('{}');
      expect((await call('GET', `/chapter-versions/${weak.versionId}/gate`)).json.checks.some((c: any) => c.code.startsWith('guidance_'))).toBe(false);
    } finally {
      await built.app.close();
    }
  });

  it('[T-281] Deckungsmatrix über die API: Reiter bzw. Kapitel × Sprache/Rolle/Sparte, Platzhalter, Lücken, Export', async () => {
    const built = await build('matrix');
    const call = client(built);
    try {
      const z = new JSZip();
      z.file('bilder/start-de.png', png('#1d4ed8'));
      z.file('bilder/start-en.png', png('#15803d'));
      z.file('handbuch/start.md', `${FM}# Startseite\n\n## Aufrufen\n\nÖffnen Sie die Startseite.\n\n![Startseite](../bilder/start-de.png)\n`);
      await importFile(built, 'b.zip', await z.generateAsync({ type: 'nodebuffer' }));
      await call('GET', '/metadata/labels', undefined, 'u-leser');
      const nav = (await built.ctx.db.get("SELECT id FROM metadata_labels WHERE project_id = ? AND code = 'nav.mainpage'", built.ctx.projectId))!.id;
      const items = (await call('GET', '/image-archive', undefined, 'u-leser')).json.items;
      expect(items).toHaveLength(2);
      const [de, en] = items;
      await call('PATCH', `/image-archive/${de.sha}`, { language: 'de', roles: ['all'], divisions: ['car', 'van'], navLabelId: nav }, 'u-redaktion');
      await call('PATCH', `/image-archive/${en.sha}`, { language: 'en', roles: ['dealer'], divisions: ['car'], navLabelId: nav }, 'u-redaktion');
      const ph = (await call('POST', '/image-archive/placeholders', { title: 'Startseite Van Englisch', language: 'en', roles: ['dealer'], divisions: ['van'], navLabelId: nav }, 'u-redaktion')).json;
      expect(ph.placeholder).toBe(true);

      expect((await call('GET', '/image-archive/coverage-matrix?dims=farbe', undefined, 'u-leser')).status).toBe(400);
      const m = (await call('GET', '/image-archive/coverage-matrix?dims=language,division', undefined, 'u-leser')).json;
      expect(m).toMatchObject({ rowsBy: 'navigation', dims: ['language', 'division'], languages: ['de', 'en'] });
      expect(m.columns.map((c: any) => c.label)).toEqual(['DE · Pkw', 'DE · Van', 'EN · Pkw', 'EN · Van']);
      const row = m.rows.find((r: any) => r.label === 'Startseite');
      expect(row.cells.map((c: any) => [c.count, c.placeholders])).toEqual([[1, 0], [1, 0], [1, 0], [0, 1]]);
      expect(row).toMatchObject({ images: 3, gaps: 0, placeholderOnly: 1 });
      // nach Rolle: Händler auf Englisch vorhanden, Markt/MO/Zentrale nur auf Deutsch
      const byRole = (await call('GET', '/image-archive/coverage-matrix?dims=language,role', undefined, 'u-leser')).json;
      expect(byRole.rows[0].cells.map((c: any) => c.count)).toEqual([1, 1, 1, 1, 1, 0, 0, 0]);
      expect(byRole.summary).toMatchObject({ cells: 8, covered: 5, gaps: 3 });
      // je Kapitel: nur das verwendete Bild
      const byChapter = (await call('GET', '/image-archive/coverage-matrix?rows=chapter&dims=language', undefined, 'u-leser')).json;
      expect(byChapter.rowsBy).toBe('chapter');
      expect(byChapter.rows.map((r: any) => r.label)).toEqual(['(in keinem Kapitel)']);

      const csv = await call('GET', '/image-archive/coverage-matrix/export?format=csv&dims=language,division', undefined, 'u-leser');
      expect(csv.body.startsWith('﻿"Reiter/Menüpunkt";"Bilder";"Lücken";"DE · Pkw"')).toBe(true);
      expect(csv.body).toContain(`"Platzhalter: ${ph.imageNo}"`);
      const xlsx = await call('GET', '/image-archive/coverage-matrix/export?format=xlsx&dims=language,division', undefined, 'u-leser');
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(xlsx.raw as any);
      const ws = wb.getWorksheet('Deckungsmatrix')!;
      expect(ws.getCell(2, 1).value).toBe('Startseite');
      expect((ws.getCell(2, 7).fill as any).fgColor.argb).toBe('FFFFF2CC'); // nur Platzhalter: gelb
      expect((await call('GET', '/image-archive/coverage-matrix/export?format=pdf', undefined, 'u-leser')).status).toBe(400);
    } finally {
      await built.app.close();
    }
  });

  it('[T-282] Expertenbefragung zu Wissenslücken (F-16): aus Fragenkatalog und Prüflauf, antworten mit Option und Freitext, Excel hin und zurück, Übernahme mit Label „Prüfen“', async () => {
    const built = await build('befragung');
    const call = client(built);
    try {
      await importFile(built, 'k.md', `${FM}# Verträge verwalten\n\n## Vertrag kündigen\n\nUm einen Vertrag zu kündigen, klicken Sie in der Vertragsdetailansicht auf Beenden.\n`);
      const cat = (await call('POST', '/metadata/question-sets', { text: '## Verträge\nWie kündige ich einen Vertrag?\nWelche Zollvorschriften gelten in Brasilien?' }, 'u-redaktion')).json;
      await call('POST', `/metadata/question-sets/${cat.id}/answer`, {}, 'u-redaktion');

      expect((await call('POST', '/metadata/surveys', { title: 'x', from: { catalogId: cat.id } }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/metadata/surveys', { from: { catalogId: cat.id } }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/metadata/surveys', { title: 'x', from: { catalogId: 'qset_fehlt' } }, 'u-redaktion')).status).toBe(404);
      const sv = (await call('POST', '/metadata/surveys', { title: 'Lücken Verträge', audience: 'Fachbereich Zoll', from: { catalogId: cat.id } }, 'u-redaktion')).json;
      expect(sv).toMatchObject({ origin: 'catalog', status: 'open', options: ['Ja', 'Nein', 'Teilweise', 'Weiß nicht'], summary: { questions: 1, open: 1 } });
      const item = sv.items[0];
      expect(item).toMatchObject({ question: 'Welche Zollvorschriften gelten in Brasilien?', status: 'open' });
      expect(item.context).toContain('Verträge');

      // antworten: Recht „Lesen“ genügt; Option muss passen
      expect((await call('PUT', `/metadata/survey-items/${item.id}/answer`, { choice: 'Vielleicht' }, 'u-leser')).status).toBe(400);
      const ans = (await call('PUT', `/metadata/survey-items/${item.id}/answer`, { choice: 'Teilweise', text: 'Es gelten die Einfuhrregeln des Landes; Details liefert der Zoll.' }, 'u-leser')).json;
      expect(ans).toMatchObject({ choice: 'Teilweise', answeredBy: 'u-leser', status: 'answered' });

      // aus einem Prüflauf: Testfragen ohne Antwort (auch Lückenfragen)
      const evalSet = (await call('POST', '/metadata/eval-sets', { name: 'Check', items: [{ question: 'Wie kündige ich einen Vertrag?', expected: ['k.md'] }, { question: 'Wer genehmigt Sonderpreise in Japan?', expectNoAnswer: true }] }, 'u-redaktion')).json;
      const run = (await call('POST', `/metadata/eval-sets/${evalSet.id}/runs`, {}, 'u-redaktion')).json;
      const sv2 = (await call('POST', '/metadata/surveys', { title: 'Aus Prüflauf', options: ['Stimmt', 'Stimmt nicht'], from: { evalRunId: run.id } }, 'u-redaktion')).json;
      expect(sv2).toMatchObject({ origin: 'eval', options: ['Stimmt', 'Stimmt nicht'] });
      expect(sv2.items.map((i: any) => i.question)).toEqual(['Wer genehmigt Sonderpreise in Japan?']);
      const added = (await call('POST', `/metadata/surveys/${sv2.id}/items`, { question: 'Gibt es eine Frist für Rückfragen?', options: ['Ja', 'Nein'] }, 'u-redaktion')).json;
      expect(added.items[1].options).toEqual(['Ja', 'Nein']);

      // Excel für Fachleute ohne App-Zugang: ausfüllen und zurückspielen
      const x = await call('GET', `/metadata/surveys/${sv2.id}/export?format=xlsx`, undefined, 'u-leser');
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(x.raw as any);
      const ws = wb.getWorksheet('Befragung')!;
      expect(ws.getRow(1).values).toEqual([undefined, 'ID', 'Nr.', 'Frage', 'Hintergrund', 'Optionen', 'Auswahl', 'Freitext']);
      expect(ws.getCell(2, 6).dataValidation).toMatchObject({ type: 'list', formulae: ['"Stimmt,Stimmt nicht"'] });
      ws.getCell(2, 6).value = 'Stimmt';
      ws.getCell(2, 7).value = 'Die Vertriebsleitung Japan.';
      ws.getCell(3, 6).value = 'Vielleicht';
      const back = Buffer.from(await wb.xlsx.writeBuffer());
      const mp = multipart('befragung.xlsx', back);
      const imp = await built.app.inject({ method: 'POST', url: `/api/v1/metadata/surveys/${sv2.id}/answers`, payload: mp.payload, headers: { ...mp.headers, 'x-user-id': 'u-redaktion' } });
      expect(imp.statusCode).toBe(200);
      const r = imp.json();
      expect(r).toMatchObject({ updated: 1, errors: [{ row: 3 }] });
      expect(r.errors[0].message).toMatch(/choice muss eine der Optionen sein: Ja, Nein/);
      expect(r.survey.items[0]).toMatchObject({ choice: 'Stimmt', answerText: 'Die Vertriebsleitung Japan.', answeredBy: 'u-redaktion (Datei)' });

      // übernehmen: Frage & Antwort mit Label „Prüfen“, ohne Quellenbeleg
      expect((await call('POST', `/metadata/survey-items/${added.items[1].id}/qa`, {}, 'u-redaktion')).status).toBe(400);
      const qa = (await call('POST', `/metadata/survey-items/${item.id}/qa`, {}, 'u-redaktion')).json;
      expect(qa).toMatchObject({ question: 'Welche Zollvorschriften gelten in Brasilien?', answer: 'Teilweise. Es gelten die Einfuhrregeln des Landes; Details liefert der Zoll.', sources: [] });
      expect(qa.labels.map((l: any) => l.code)).toEqual(['quality.to-check']);
      expect(qa.note).toBe('Expertenantwort aus Befragung „Lücken Verträge“ (Fachbereich Zoll) – ohne Quellenbeleg, bitte prüfen');
      expect((await call('POST', `/metadata/survey-items/${item.id}/qa`, {}, 'u-redaktion')).status).toBe(409);
      expect((await call('PUT', `/metadata/survey-items/${item.id}/answer`, { choice: 'Nein' }, 'u-leser')).status).toBe(409);

      // abschließen sperrt Antworten; Liste mit Zählern
      expect((await call('PATCH', `/metadata/surveys/${sv2.id}`, { status: 'closed' }, 'u-redaktion')).json.status).toBe('closed');
      expect((await call('PUT', `/metadata/survey-items/${sv2.items[0].id}/answer`, { choice: 'Stimmt' }, 'u-leser')).status).toBe(409);
      const list = (await call('GET', '/metadata/surveys', undefined, 'u-leser')).json;
      expect(list.find((s: any) => s.id === sv.id)).toMatchObject({ questions: 1, answered: 1, adopted: 1 });
      expect((await call('DELETE', `/metadata/surveys/${sv2.id}`, undefined, 'u-redaktion')).status).toBe(204);
      expect((await call('GET', `/metadata/surveys/${sv2.id}`, undefined, 'u-leser')).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });
});
