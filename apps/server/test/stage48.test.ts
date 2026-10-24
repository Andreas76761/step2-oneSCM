import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { frameTexts } from '../src/domain/frameTexts.js';
import { sha256 } from '../src/domain/similarity.js';
import {
  backSimilarity, buildXliff, checkTranslation, germanWords, lengthRatio, mqmScore, parseXliff, pseudoLocalize, sampleEvery, tmSimilarity, toSwissGerman, unpseudo, valuesOneSide,
} from '../src/domain/translate.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const png = (rgb: string) => {
  const c = createCanvas(800, 450);
  const g = c.getContext('2d');
  g.fillStyle = rgb;
  g.fillRect(0, 0, 800, 450);
  return c.toBuffer('image/png');
};

describe('Etappe 48', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));
  /** Kapitel über den Kapitel-Assistenten anlegen und freigeben */
  const chapter = async (call: ReturnType<typeof client>, title: string, extra: Record<string, unknown> = {}) => {
    const ch = (await call('POST', '/chapter-assistant', { title, purpose: 'Mit dieser Anleitung legen Sie einen Vertrag an.', steps: ['Öffnen Sie **Verträge**', 'Klicken Sie auf **Neu**'], result: 'Der Vertrag ist gespeichert.', ...extra }, 'u-redaktion')).json;
    expect((await call('POST', `/chapter-versions/${ch.versionId}/submit`, {}, 'u-redaktion')).status).toBe(200);
    expect((await call('POST', `/chapter-versions/${ch.versionId}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
    return ch as { chapterId: string; versionId: string };
  };
  /** alle Absätze einer Übersetzung mit dem gegebenen Text belegen */
  const fill = async (call: ReturnType<typeof client>, id: string, text: (b: any) => string) => {
    const d = (await call('GET', `/translations/${id}`)).json;
    for (const b of d.sections.flatMap((s: any) => s.blocks)) await call('PATCH', `/translation-blocks/${b.id}`, { text: text(b) }, 'u-redaktion');
    return (await call('GET', `/translations/${id}`)).json;
  };
  const EN: Record<string, string> = {
    'Mit dieser Anleitung legen Sie einen Vertrag an.': 'This guide shows you how to create a contract.',
    '1. Öffnen Sie **Verträge**.\n2. Klicken Sie auf **Neu**.': '1. Open **Contracts**.\n2. Click **New**.',
    'Der Vertrag ist gespeichert.': 'The contract is saved.',
  };

  it('[T-314] Prüfregeln und Verfahren der Übersetzung: Länge, deutsche Wörter, Werte nur auf einer Seite, Schweizer Hochdeutsch, Speicher-Ähnlichkeit, MQM, XLIFF 1.2, Rückübersetzung, Rahmentexte (Einheit)', () => {
    // U-02
    expect(lengthRatio('Öffnen Sie den Vertrag und speichern Sie ihn.', 'Open.')).toBeLessThan(0.55);
    expect(checkTranslation('Öffnen Sie den Vertrag und speichern Sie ihn sofort.', 'Open.', null, { language: 'en' })).toContain('length_ratio');
    expect(germanWords('Open the contract und click auf Save.')).toEqual(['und', 'auf']);
    expect(germanWords('Die Vertragsliste – Wählen Sie **Neu**.')).toEqual([]); // Satzanfang, Großschreibung zählt nicht
    expect(checkTranslation('Öffnen Sie den Vertrag und klicken Sie auf Neu.', 'Open the contract und klicken auf New.', null, { language: 'en' })).toContain('german_words');
    expect(checkTranslation('Ab 31.12.2026 gilt E-4711.', 'From 12/31/2026, E-4711 applies.', null, { language: 'en' })).not.toContain('values_one_side');
    expect(valuesOneSide('Fehler E-4711 am 01.02.2026.', 'Error E-4712 on 2026-02-01.')).toEqual(['id:E4711', 'id:E4712']);
    // U-07 Schweizer Hochdeutsch
    expect(toSwissGerman('Die Straße heißt „Hauptstraße“; siehe `maß` und https://example.org/straße.')).toBe('Die Strasse heisst «Hauptstrasse»; siehe `maß` und https://example.org/straße.');
    expect(checkTranslation('Die Straße.', 'Die Straße.', null, { language: 'de-ch' })).toEqual(['swiss_eszett']);
    expect(checkTranslation('Die Straße ist gesperrt und wird nicht geräumt.', 'Die Strasse ist gesperrt und wird nicht geräumt.', null, { language: 'de-ch' })).toEqual([]);
    // U-01
    expect(tmSimilarity('Öffnen Sie die Vertragsliste.', 'Öffnen Sie die Vertragsliste.')).toBe(1);
    expect(tmSimilarity('Öffnen Sie die Vertragsliste und wählen Sie den Vertrag.', 'Öffnen Sie die Vertragsliste und wählen Sie einen Vertrag.')).toBeGreaterThanOrEqual(0.75);
    expect(tmSimilarity('Öffnen Sie die Vertragsliste.', 'Drucken Sie den Lieferschein aus.')).toBeLessThan(0.5);
    // U-03 MQM
    expect(mqmScore([{ severity: 'minor' }, { severity: 'major' }], 2000)).toEqual({ points: 6, words: 2000, per1000: 3, pass: true });
    expect(mqmScore([{ severity: 'critical' }], 1000).pass).toBe(false);
    // U-05 XLIFF 1.2
    const xml = buildXliff({ original: 'K & Co', sourceLanguage: 'de', targetLanguage: 'fr-ch', units: [{ id: 'trb_1', source: '1. Öffnen <b>\n2. „Neu“', target: null }] });
    expect(xml).toContain('target-language="fr-CH"');
    expect(xml).toContain('&lt;b&gt;');
    const tagged = xml.replace('<target state="new"></target>', '<target state="translated">1. Ouvrez <g id="1">&lt;b&gt;</g><x id="2"/>\n2. « Nouveau »</target>');
    expect(parseXliff(tagged)).toEqual({ targetLanguage: 'fr-ch', units: [{ id: 'trb_1', source: '1. Öffnen <b>\n2. „Neu“', target: '1. Ouvrez <b>\n2. « Nouveau »', state: 'translated' }] });
    expect(() => parseXliff('<xliff version="2.0"></xliff>')).toThrow(/XLIFF-1.2/);
    expect(() => parseXliff('<!DOCTYPE x [<!ENTITY a "b">]><xliff version="1.2"><trans-unit id="a"><source>x</source></trans-unit></xliff>')).toThrow(/DOCTYPE/);
    // U-06
    expect(backSimilarity('WARNUNG: Gespeicherte Verträge lassen sich nicht löschen.', 'WARNUNG: Gespeicherte Verträge können nicht gelöscht werden.')).toBeGreaterThanOrEqual(0.5);
    expect(backSimilarity('WARNUNG: Gespeicherte Verträge lassen sich nicht löschen.', 'Der Lieferschein wird im Lager gedruckt.')).toBeLessThan(0.2);
    expect(sampleEvery([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21])).toEqual([1, 8, 15]);
    // Demo-KI: Pseudo-Lokalisierung mit festen Bestandteilen, Rückweg ins Deutsche
    const p = pseudoLocalize('Öffnen Sie {name} und `code` – WARNUNG bei ONESCM-12.');
    expect(p).toBe('Öffnen Sie {name} úñd `code` – WARNUNG bél ONESCM-12.'.replace('bél', 'béí'));
    expect(unpseudo(`[FR] ${pseudoLocalize('AVERTISSEMENT: Verträge lassen sich nicht löschen.')}`, 'fr')).toBe('WARNUNG: Verträge lassen sich nicht löschen.');
    // U-08 Rahmentexte
    expect(frameTexts('fr').contents).toBe('Sommaire');
    expect(frameTexts('de-ch').validFrom).toBe('Gültig ab');
    expect(frameTexts('fr-ch')).toMatchObject({ native: 'Français (Suisse)', approvedVersion: 'Version approuvée' });
    expect(frameTexts('xx').manualTitle).toBe('oneSCM User Manual');
  });

  it('[T-315] Übersetzungsspeicher (100 % und ähnlich), Export/Import wie SPEICHER.csv, XLIFF 1.2 und Excel hin und zurück mit Prüfung, Glossar je Sprache mit Rückimport', async () => {
    const built = await build('t315');
    const call = client(built);
    try {
      await importFile(built, 'x.md', `${FM}# 1. Nebenkapitel\n\nText.\n`);
      expect((await call('PATCH', '/projects/p_default', { languages: ['en', 'fr', 'de-ch', 'fr-ch', 'cs', 'sk'] })).json.languages).toEqual(['en', 'fr', 'de-ch', 'fr-ch', 'cs', 'sk']);
      const a = await chapter(call, 'Vertrag anlegen');
      const tr = (await call('POST', '/translations', { chapterId: a.chapterId, language: 'en' }, 'u-redaktion')).json;
      expect(tr.translated).toBe(0);
      // Demo-KI: Pseudo-Lokalisierung, keine deutschen Wörter im Zieltext
      await call('POST', `/translations/${tr.id}/machine`, {}, 'u-redaktion');
      await built.ctx.jobs.idle();
      const machine = (await call('GET', `/translations/${tr.id}`)).json;
      expect(machine.sections.flatMap((s: any) => s.blocks).every((b: any) => b.mode === 'machine' && !b.issues.includes('german_words'))).toBe(true);
      const d = await fill(call, tr.id, (b) => EN[b.sourceText]);
      expect(d.flagged).toBe(0);
      await call('PATCH', `/translations/${tr.id}`, { title: 'Create a contract' }, 'u-redaktion');
      expect((await call('POST', `/translations/${tr.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      // freigegebene Absätze im Speicher
      const tm = (await call('GET', '/translation-memory?language=en')).json;
      expect(tm.total).toBe(3);
      expect(tm.items.find((x: any) => x.sourceText === 'Der Vertrag ist gespeichert.')).toMatchObject({ targetText: 'The contract is saved.', origin: 'translation', originRef: 'Vertrag anlegen', originVersion: 'Version 1', status: 'approved' });
      // zweites Kapitel: gleiche Absätze sofort aus dem Speicher, geänderter Absatz mit ähnlichem Treffer
      const b = await chapter(call, 'Vertrag anlegen (Van)', { result: 'Der Vertrag ist jetzt gespeichert.' });
      const tr2 = (await call('POST', '/translations', { chapterId: b.chapterId, language: 'en' }, 'u-redaktion')).json;
      expect(tr2.translated).toBe(2);
      const d2 = (await call('GET', `/translations/${tr2.id}`)).json;
      const blocks2 = d2.sections.flatMap((s: any) => s.blocks);
      expect(blocks2.filter((x: any) => x.mode === 'memory').map((x: any) => x.tmScore)).toEqual([1, 1]);
      const changed = blocks2.find((x: any) => x.mode === 'pending');
      const sug = (await call('GET', `/translation-blocks/${changed.id}/memory`)).json.matches;
      expect(sug[0]).toMatchObject({ targetText: 'The contract is saved.' });
      expect(sug[0].score).toBeGreaterThanOrEqual(0.75);
      expect(sug[0].score).toBeLessThan(1);

      // Export wie SPEICHER.csv, Rückimport mit „zu prüfen“
      const csv = (await call('GET', '/translation-memory/export?language=en&format=csv')).body as string;
      expect(csv.replace(/^﻿/, '').split('\n')[0]).toBe('Nr;Deutsch;EN;Datei;Ausgangsversion;Datum;Status');
      expect(csv).toMatch(/;The contract is saved\.;Vertrag anlegen;Version 1;\d{2}\.\d{2}\.\d{4};freigegeben/);
      const upload = (name: string, data: string | Buffer, path: string, user = 'u-redaktion') => built.app.inject({
        method: 'POST', url: `/api/v1${path}`, headers: { 'x-user-id': user, 'content-type': 'multipart/form-data; boundary=X' },
        payload: Buffer.concat([Buffer.from(`--X\r\nContent-Disposition: form-data; name="file"; filename="${name}"\r\nContent-Type: application/octet-stream\r\n\r\n`), Buffer.isBuffer(data) ? data : Buffer.from(data), Buffer.from('\r\n--X--\r\n')]),
      }).then((r) => ({ status: r.statusCode, json: r.json() }));
      const imp = `﻿Nr;Deutsch;EN;Datei;Ausgangsversion;Datum;Status\n1;Der Lieferschein ist gedruckt.;The delivery note is printed.;Lager.docx;3;01.10.2026;zu prüfen\n2;Der Vertrag ist gespeichert.;The contract has been saved.;x;;;\n`;
      expect((await upload('SPEICHER.csv', imp, '/translation-memory/import?language=en', 'u-leser')).status).toBe(403);
      expect((await upload('SPEICHER.csv', imp, '/translation-memory/import?language=en')).json).toMatchObject({ rows: 2, usable: 2, approved: 0, applied: false });
      expect((await upload('SPEICHER.csv', imp, '/translation-memory/import?language=en&apply=true')).json).toMatchObject({ applied: true, added: 1, updated: 0 }); // freigegebenes Segment bleibt
      const review = (await call('GET', '/translation-memory?language=en&status=review')).json.items;
      expect(review).toHaveLength(1);
      expect((await call('PATCH', `/translation-memory/${review[0].id}`, { status: 'approved' }, 'u-redaktion')).json.status).toBe('approved');
      expect((await call('DELETE', `/translation-memory/${review[0].id}`, undefined, 'u-redaktion')).status).toBe(204);

      // XLIFF 1.2 für das Büro: offener Absatz übersetzt zurück, geprüft
      const xlf = (await call('GET', `/translations/${tr2.id}/file?format=xlf`)).body as string;
      expect(xlf).toContain('<xliff version="1.2"');
      expect(xlf).toContain(`<trans-unit id="${changed.id}"`);
      const back = xlf.replace(/(<trans-unit id="[^"]+" xml:space="preserve">\s*<source>Der Vertrag ist jetzt gespeichert\.<\/source>\s*)<target state="new"><\/target>/, '$1<target state="translated">The contract is now saved.</target>');
      const preview = (await upload('buero.xlf', back, `/translations/${tr2.id}/file`)).json;
      expect(preview).toMatchObject({ units: 3, updated: 1, unchanged: 2, applied: false });
      expect((await upload('buero.xlf', back, `/translations/${tr2.id}/file?apply=true`)).json).toMatchObject({ updated: 1, withIssues: 0, applied: true });
      const after = (await call('GET', `/translations/${tr2.id}`)).json.sections.flatMap((s: any) => s.blocks).find((x: any) => x.id === changed.id);
      expect(after).toMatchObject({ text: 'The contract is now saved.', mode: 'imported', issues: [] });
      expect((await upload('buero.xlf', back.replace('Der Vertrag ist jetzt gespeichert.', 'Anderer Text.'), `/translations/${tr2.id}/file`)).json.sourceChanged).toBe(1);
      expect((await upload('buero.xlf', back.replace('target-language="en"', 'target-language="fr"'), `/translations/${tr2.id}/file`)).status).toBe(400);
      // Excel hin und zurück
      const xlsxRes = await built.app.inject({ method: 'GET', url: `/api/v1/translations/${tr2.id}/file?format=xlsx`, headers: { 'x-user-id': 'u-redaktion' } });
      expect(xlsxRes.headers['content-type']).toContain('spreadsheetml');
      const ExcelJS = (await import('exceljs')).default;
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(xlsxRes.rawPayload as any);
      const ws = wb.worksheets[0];
      expect(ws.getRow(1).values).toEqual([undefined, 'ID', 'Abschnitt', 'Deutsch', 'EN', 'Status', 'Hinweis']);
      ws.eachRow((row, n) => { if (n > 1 && String(row.getCell(3).value).startsWith('Der Vertrag ist jetzt')) row.getCell(4).value = 'The contract has now been saved.'; });
      const xlsxBack = Buffer.from(await wb.xlsx.writeBuffer());
      expect((await upload('buero.xlsx', xlsxBack, `/translations/${tr2.id}/file?apply=true`)).json).toMatchObject({ updated: 1, applied: true });

      // Glossar je Sprache (U-04): feste Übersetzung, Export, Rückimport
      await call('POST', '/terminology', { preferred: 'Vertragsliste', avoid: [], definition: 'Liste aller Verträge', translations: { en: { term: 'contract list' } } }, 'u-redaktion');
      await call('POST', '/terminology', { preferred: 'Lieferschein', avoid: [] }, 'u-redaktion');
      const g = (await call('GET', '/translation-glossary?language=en')).json.items;
      expect(g.find((x: any) => x.term === 'Vertragsliste')).toMatchObject({ translation: 'contract list', status: 'bestätigt', definition: 'Liste aller Verträge' });
      expect(g.find((x: any) => x.term === 'Lieferschein')).toMatchObject({ translation: null, status: 'offen' });
      expect((await call('GET', '/translation-glossary?language=de-ch')).json.items.find((x: any) => x.term === 'Vertragsliste')).toMatchObject({ translation: null, status: 'offen' });
      const gcsv = (await call('GET', '/translation-glossary/export?language=en&format=csv')).body as string;
      expect(gcsv.replace(/^﻿/, '').split('\n')[0]).toBe('Deutsch;EN;Kontext;Status;Quelle');
      const gback = 'Deutsch;EN;Kontext;Status;Quelle\nVertragsliste;contract list;;bestätigt;\nLieferschein;delivery note;;;Büro\nUnbekannt;unknown;;;\n';
      expect((await upload('GLOSSAR.csv', gback, '/translation-glossary/import?language=en')).json).toMatchObject({ rows: 3, changes: [{ term: 'Lieferschein', before: null, after: 'delivery note' }], unknown: ['Unbekannt'], applied: false });
      await upload('GLOSSAR.csv', gback, '/translation-glossary/import?language=en&apply=true');
      expect((await call('GET', '/translation-glossary?language=en')).json.items.find((x: any) => x.term === 'Lieferschein')).toMatchObject({ translation: 'delivery note', status: 'bestätigt' });
    } finally {
      await built.app.close();
    }
  });

  it('[T-316] Länderreview mit MQM und „zurück an Übersetzung“, Rückübersetzung der Sicherheitshinweise, de-CH nach Regeln, fr-CH aus Französisch, Hinweis auf fehlende Bildvarianten, Rahmentexte im Export', async () => {
    const built = await build('t316');
    const call = client(built);
    try {
      const img = png('#1d4ed8');
      const z = new JSZip();
      z.file('bilder/liste.png', img);
      await importFile(built, 'b.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const sha = sha256(img);
      await call('PATCH', `/image-archive/${sha}`, { title: 'Vertragsliste', language: 'de', roles: ['all'], divisions: ['car'] }, 'u-redaktion');
      await call('PATCH', '/projects/p_default', { languages: ['fr', 'de-ch', 'fr-ch'] });
      const a = await chapter(call, 'Straßenverkehr melden', {
        result: `Der Vertrag ist gespeichert.\n\n![Vertragsliste](media:${sha})`, hints: ['WARNUNG: Gespeicherte Verträge lassen sich nicht löschen'],
      });
      // de-CH nach Regeln, ohne KI
      const ch = (await call('POST', '/translations', { chapterId: a.chapterId, language: 'de-ch' }, 'u-redaktion')).json;
      await call('POST', `/translations/${ch.id}/machine`, {}, 'u-redaktion');
      await built.ctx.jobs.idle();
      const dch = (await call('GET', `/translations/${ch.id}`)).json;
      expect(dch).toMatchObject({ title: 'Strassenverkehr melden', ruleBased: true, flagged: 0, imageHints: [] }); // deutsches Bild passt für de-CH
      expect(dch.sections.flatMap((s: any) => s.blocks).every((b: any) => b.provider === 'rules' && !/ß/.test(b.text))).toBe(true);

      // Französisch: Hinweis auf fehlende Bildvariante (U-10)
      const fr = (await call('POST', '/translations', { chapterId: a.chapterId, language: 'fr' }, 'u-redaktion')).json;
      await call('POST', `/translations/${fr.id}/machine`, {}, 'u-redaktion');
      await built.ctx.jobs.idle();
      let dfr = (await call('GET', `/translations/${fr.id}`)).json;
      expect(dfr.imageHints).toEqual([expect.objectContaining({ sha, imageLanguage: 'de', title: 'Vertragsliste' })]);
      expect(dfr.flagged).toBe(0);
      await call('PATCH', `/translations/${fr.id}`, { title: 'Signaler la circulation' }, 'u-redaktion');

      // Rückübersetzung der Sicherheitshinweise (U-06)
      expect((await call('POST', `/translations/${fr.id}/backcheck`, {}, 'u-leser')).status).toBe(403);
      const bc = (await call('POST', `/translations/${fr.id}/backcheck`, {}, 'u-redaktion')).json;
      expect(bc).toMatchObject({ candidates: 1, checked: 1, passed: 1, failed: 0 });
      expect(bc.sample[0].back).toContain('WARNUNG');
      expect((await call('POST', `/translations/${ch.id}/backcheck`, {}, 'u-redaktion')).status).toBe(422);

      // Länderreview (U-03)
      expect((await call('POST', `/translations/${fr.id}/reviews`, { reviewer: 'nobody' }, 'u-redaktion')).status).toBe(400);
      const rev = (await call('POST', `/translations/${fr.id}/reviews`, { reviewer: 'u-fachpruefung', market: 'fr' }, 'u-redaktion')).json;
      expect(rev).toMatchObject({ status: 'open', market: 'FR', reviewer: 'u-fachpruefung', score: { points: 0, pass: true } });
      expect((await call('POST', `/translations/${fr.id}/reviews`, { reviewer: 'u-fachpruefung' }, 'u-redaktion')).status).toBe(409);
      expect((await call('POST', `/translations/${fr.id}/approve`, { comment: 'ok' }, 'u-freigabe')).json.detail).toMatch(/Länderreview .* noch offen/);
      const block = dfr.sections.flatMap((s: any) => s.blocks)[0];
      expect((await call('POST', `/translation-reviews/${rev.id}/errors`, { blockId: block.id, category: 'accuracy', severity: 'major', note: 'Sinn verfälscht' }, 'u-redaktion')).status).toBe(403);
      expect((await call('POST', `/translation-reviews/${rev.id}/errors`, { category: 'xyz', severity: 'major', note: 'x' }, 'u-fachpruefung')).status).toBe(400);
      const withErr = (await call('POST', `/translation-reviews/${rev.id}/errors`, { blockId: block.id, category: 'accuracy', severity: 'major', note: 'Sinn verfälscht' }, 'u-fachpruefung')).json;
      expect(withErr.score.points).toBe(5);
      expect(withErr.score.per1000).toBeGreaterThan(5); // wenige Wörter – 5 Punkte sind zu viel
      expect((await call('POST', `/translation-reviews/${rev.id}/decision`, { decision: 'approve' }, 'u-fachpruefung')).status).toBe(409);
      expect((await call('POST', `/translation-reviews/${rev.id}/decision`, { decision: 'return', comment: 'bitte korrigieren' }, 'u-fachpruefung')).json.status).toBe('returned');
      expect((await call('POST', `/translations/${fr.id}/approve`, { comment: 'ok' }, 'u-freigabe')).json.detail).toMatch(/zurück an Übersetzung/);
      // überarbeiten, neue Runde, Land gibt frei
      await call('PATCH', `/translation-blocks/${block.id}`, { text: `${block.text} ` }, 'u-redaktion');
      const rev2 = (await call('POST', `/translations/${fr.id}/reviews`, { reviewer: 'u-fachpruefung', market: 'FR' }, 'u-redaktion')).json;
      expect((await call('POST', `/translation-reviews/${rev2.id}/decision`, { decision: 'approve' }, 'u-fachpruefung')).json).toMatchObject({ status: 'approved', score: { pass: true } });
      // Änderung nach der Freigabe durch das Land: erneut prüfen
      await call('PATCH', `/translation-blocks/${block.id}`, { text: block.text }, 'u-redaktion');
      expect((await call('GET', `/translations/${fr.id}/reviews`)).json.items[0]).toMatchObject({ id: rev2.id, status: 'open' });
      await call('POST', `/translation-reviews/${rev2.id}/decision`, { decision: 'approve' }, 'u-fachpruefung');
      expect((await call('POST', `/translations/${fr.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);

      // fr-CH aus der freigegebenen französischen Fassung (U-07)
      const frch = (await call('POST', '/translations', { chapterId: a.chapterId, language: 'fr-ch' }, 'u-redaktion')).json;
      await call('POST', `/translations/${frch.id}/machine`, {}, 'u-redaktion');
      await built.ctx.jobs.idle();
      const dfrch = (await call('GET', `/translations/${frch.id}`)).json.sections.flatMap((s: any) => s.blocks);
      dfr = (await call('GET', `/translations/${fr.id}`)).json;
      const frTexts = dfr.sections.flatMap((s: any) => s.blocks).map((b: any) => b.text);
      // aus dem Speicher (freigegebenes Französisch ist für fr-CH ein eigenes Sprachpaar) bzw. aus der Variante
      expect(dfrch.every((b: any) => b.provider === 'variant' && frTexts.includes(b.text))).toBe(true);

      // Rahmentexte in der Zielsprache (U-08)
      const html = (await call('GET', `/translations/${fr.id}/export?format=html`)).body as string;
      expect(html).toContain('<html lang="fr">');
      expect(html).toContain('<h2>Sommaire</h2>');
      expect(html).toContain('Version approuvée 1');
      expect(html).toContain('Conseil');
      const md = (await call('GET', `/translations/${ch.id}/export?format=md`)).body as string;
      expect(md).toContain('# oneSCM – Deutsch (Schweiz) (Entwurf)');
      expect(md).toContain('> Exportiert am');
    } finally {
      await built.app.close();
    }
  });

  it('[T-317] Releaseletter DE→EN übersetzen und prüfen: Speicher, KI, Prüfbefunde je Zeile, Freigabe übernimmt in den Speicher, Schutz des Ausgangsletters', async () => {
    const built = await build('t317');
    const call = client(built);
    try {
      const head = 'Summary,Issue key,Issue Type,Status,Priority,Component/s,Fix Version/s,Labels,Created,Description';
      const rows = ['"Contract Preview PDF without vehicle data",ONESCM-101,Story,Fertig,High,8 - Documents,PI16,,2026-02-05T10:00:00.000+0100,"The preview is shown."'];
      await importFile(built, 'release.csv', Buffer.from([head, ...rows].join('\n')));
      const de = (await call('POST', '/release-letters', { release: 'PI16', language: 'de', audience: 'biz', country: 'DE', division: 'car' }, 'u-redaktion')).json;
      expect((await call('POST', `/release-letters/${de.id}/translate`, {}, 'u-leser')).status).toBe(403);
      const res = (await call('POST', `/release-letters/${de.id}/translate`, {}, 'u-redaktion')).json;
      expect(res.machine).toBeGreaterThan(0);
      const en = (await call('GET', `/release-letters/${res.id}`)).json;
      expect(en).toMatchObject({ language: 'en', origin: 'translated', translationOf: de.id, status: 'draft' });
      expect(en.text).toContain('ONESCM-101'); // Ticketnummern bleiben
      expect(en.text.split('\n').length).toBe(de.text.split('\n').length);
      expect((await call('GET', `/release-letters/${de.id}`)).json.translations).toEqual([{ id: res.id, language: 'en', status: 'draft' }]);
      expect((await call('POST', `/release-letters/${de.id}/translate`, {}, 'u-redaktion')).status).toBe(409);
      expect((await call('POST', `/release-letters/${res.id}/translate`, {}, 'u-redaktion')).status).toBe(422);
      expect((await call('DELETE', `/release-letters/${de.id}`, undefined, 'u-redaktion')).status).toBe(409);
      // Prüfbefund je Zeile: Zeile mit deutschem Text sperrt die Freigabe
      const lines = en.text.split('\n');
      const k = lines.findIndex((l: string) => l.length > 30 && !l.startsWith('|'));
      lines[k] = 'Diese Zeile ist nicht übersetzt und wird auch nicht geprüft für den Markt.';
      const broken = (await call('PATCH', `/release-letters/${res.id}`, { text: lines.join('\n') }, 'u-redaktion')).json;
      expect(broken.translationIssues[0]).toMatchObject({ line: k + 1, issues: expect.arrayContaining(['german_words']) });
      expect((await call('POST', `/release-letters/${res.id}/approve`, { reason: 'ok' }, 'u-freigabe')).status).toBe(409);
      await call('PATCH', `/release-letters/${res.id}`, { text: en.text }, 'u-redaktion');
      const ok = await call('POST', `/release-letters/${res.id}/approve`, { reason: 'geprüft' }, 'u-freigabe');
      expect(ok.status).toBe(200);
      // Zeilenpaare DE→EN im Speicher
      const tm = (await call('GET', '/translation-memory?language=en')).json;
      expect(tm.items.some((x: any) => x.origin === 'release_letter' && x.sourceLanguage === 'de')).toBe(true);
    } finally {
      await built.app.close();
    }
  });
});
