import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { analyzeStyle } from '../src/domain/style.js';
import { clearLanguageToolCache, languageToolIssues, languageToolUrl, maskMarkdown, toIssues } from '../src/services/languageTool.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

/** Ersatz für den LanguageTool-Dienst (HTTP-API v2): meldet „mit mehrere“ wie das echte LanguageTool 6.6 */
function fakeLanguageTool() {
  const seen: string[] = [];
  const server = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      if (req.url === '/v2/languages') return res.end(JSON.stringify([{ name: 'German (Germany)', code: 'de', longCode: 'de-DE' }, { name: 'English (US)', code: 'en', longCode: 'en-US' }]));
      const p = new URLSearchParams(body);
      const text = p.get('text') ?? '';
      seen.push(text);
      const matches = [];
      const i = text.indexOf('mit mehrere Fehler');
      if (i >= 0) matches.push({ offset: i, length: 18, message: 'Die Präposition ‚mit‘ erfordert in der Regel den Dativ.', replacements: [{ value: 'mit mehreren Fehlern' }], rule: { id: 'PRAEP_DAT', issueType: 'grammatical', category: { id: 'GRAMMAR', name: 'Grammatik' } } });
      const j = text.indexOf('Fehlr');
      if (j >= 0) matches.push({ offset: j, length: 5, message: 'Möglicher Tippfehler gefunden.', replacements: [{ value: 'Fehler' }], rule: { id: 'GERMAN_SPELLER_RULE', issueType: 'misspelling', category: { id: 'TYPOS', name: 'Mögliche Tippfehler' } } });
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ matches }));
    });
  });
  return { server, seen };
}

describe('Etappe 55', () => {
  const dataDir = tempDir();
  const lt = fakeLanguageTool();
  let url = '';
  beforeAll(async () => {
    await new Promise<void>((r) => lt.server.listen(0, '127.0.0.1', () => r()));
    url = `http://127.0.0.1:${(lt.server.address() as AddressInfo).port}`;
  });
  afterAll(() => {
    lt.server.close();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });
  const build = (name: string, languageTool?: { url: string | null }) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' }, ...(languageTool ? { languageTool: { timeoutMs: 3000, ...languageTool } } : {}),
  } as any));

  it('[T-345] LanguageTool: Markdown neutralisieren, Treffer übernehmen, doppelte Funde vermeiden, nur lokale Adressen (Einheit)', () => {
    const md = 'Klicken Sie auf **Speichern** im `Menü` und ![Bild](media:abc).\n1. Öffnen Sie [Verträge](https://x.example/a).';
    const masked = maskMarkdown(md);
    expect(masked).toHaveLength(md.length);
    expect(masked).not.toMatch(/[*`[\]|]/);
    expect(masked).toContain('Klicken Sie auf   Speichern');
    expect(masked).not.toContain('media:abc');
    expect(masked).not.toContain('https://');
    const text = 'Das ist ein Test mit mehrere Fehler.';
    const issues = toIssues([
      { offset: 17, length: 18, message: 'Dativ', replacements: [{ value: 'mit mehreren Fehlern' }], rule: { category: { id: 'GRAMMAR' } } },
      { offset: 0, length: 3, message: 'Stil', replacements: [], rule: { issueType: 'style', category: { id: 'STYLE' } } },
      { offset: 30, length: 99, message: 'außerhalb', rule: {} },
    ], text);
    expect(issues).toEqual([
      { rule: 'grammar', severity: 'warning', message: 'LanguageTool: Dativ', start: 17, end: 35, fix: { start: 17, end: 35, replacement: 'mit mehreren Fehlern', label: '„mit mehreren Fehlern“' } },
      { rule: 'grammar', severity: 'info', message: 'LanguageTool: Stil', start: 0, end: 3 },
    ]);
    // Treffer, die nur durch das Maskieren entstehen („**Verträge**.“ → Leerzeichen vor dem Punkt), entfallen
    const bold = 'Öffnen Sie **Verträge**.';
    expect(toIssues([{ offset: 22, length: 2, message: 'Leerzeichen vor Punkt', replacements: [{ value: '.' }], rule: { category: { id: 'TYPOGRAPHY' } } }], bold, maskMarkdown(bold))).toEqual([]);
    expect(toIssues([{ offset: 7, length: 3, message: 'Sie', replacements: [{ value: 'Sie' }], rule: { category: { id: 'CASING' } } }], 'Öffnen sie **A**.', maskMarkdown('Öffnen sie **A**.'))[0].rule).toBe('capitalization');
    // eigene Regel an derselben Stelle zählt nur einmal; ausgeschaltete Regeln gelten auch für LanguageTool
    const withLt = analyzeStyle(text, { extraIssues: issues });
    expect(withLt.sentences[0].issues.filter((i) => i.message.startsWith('LanguageTool')).map((i) => i.start)).toEqual([17, 0].sort((a, b) => a - b));
    const doubled = analyzeStyle('Das das ist gut.', { extraIssues: [{ rule: 'grammar', severity: 'warning', message: 'LanguageTool: doppelt', start: 0, end: 7 }] });
    expect(doubled.sentences[0].issues.filter((i) => i.rule === 'grammar')).toEqual([]);
    expect(analyzeStyle(text, { extraIssues: issues, disabled: ['grammar'] }).sentences[0].issues.some((i) => i.rule === 'grammar')).toBe(false);
    expect(languageToolUrl({ url: 'http://localhost:8081', timeoutMs: 1 })).toBe('http://localhost:8081');
    expect(languageToolUrl({ url: 'http://10.1.2.3:8081', timeoutMs: 1 })).toBe('http://10.1.2.3:8081');
    expect(languageToolUrl({ url: 'https://api.languagetool.org', timeoutMs: 1 })).toBeNull();
  });

  it('[T-346] Stilprüfung mit lokalem LanguageTool: Funde mit Korrektur, Kapitelprüfung, Status, ohne Dienst nur eigene Regeln', async () => {
    clearLanguageToolCache();
    const built = await build('lt', { url });
    const call = client(built);
    try {
      expect((await call('GET', '/style/language-tool', undefined, 'u-leser')).json).toMatchObject({ configured: true, available: true, languages: ['de-DE', 'en-US'] });
      const r = (await call('POST', '/style/check', { text: 'Das ist ein Test mit mehrere Fehler. Klicken Sie auf **Speichern**.' }, 'u-leser')).json;
      expect(r.languageTool).toEqual({ used: true, error: null });
      const issue = r.sentences.flatMap((s: any) => s.issues).find((i: any) => i.rule === 'grammar');
      expect(issue).toMatchObject({ message: 'LanguageTool: Die Präposition ‚mit‘ erfordert in der Regel den Dativ.', fix: { replacement: 'mit mehreren Fehlern' } });
      expect(r.rules.find((x: any) => x.rule === 'grammar')).toMatchObject({ label: 'Grammatik', count: 1 });
      // der Dienst bekam Markdown ohne Sternchen
      expect(lt.seen.at(-1)).toContain('Klicken Sie auf   Speichern  .');
      // englischer Text: Sprache en-US; Sprachen ohne LanguageTool (z. B. Französisch) nur eigene Regeln
      const before = lt.seen.length;
      await call('POST', '/style/check', { text: 'This is a text.', language: 'en' }, 'u-leser');
      expect(lt.seen.length).toBe(before + 1);
      // Kapitelprüfung: je Absatz, mit Zwischenspeicher
      const ch = (await call('POST', '/chapter-assistant', { title: 'Grammatik', purpose: 'Mit dieser Anleitung prüfen Sie einen Text mit mehrere Fehler.', steps: ['Öffnen Sie **Texte**', 'Klicken Sie auf **Prüfen**'], result: 'Der Fehlr ist markiert.' }, 'u-redaktion')).json;
      const style = (await call('GET', `/style/chapter-versions/${ch.versionId}`, undefined, 'u-leser')).json;
      expect(style.languageTool).toEqual({ used: true, errors: 0 });
      const rules = style.blocks.flatMap((b: any) => b.analysis.sentences.flatMap((s: any) => s.issues)).filter((i: any) => i.message.startsWith('LanguageTool')).map((i: any) => i.rule).sort();
      expect(rules).toEqual(['grammar', 'spelling']);
      const n = lt.seen.length;
      await call('GET', `/style/chapter-versions/${ch.versionId}`, undefined, 'u-leser');
      expect(lt.seen.length).toBe(n);
    } finally {
      await built.app.close();
    }
    // Dienst nicht erreichbar bzw. nicht lokal: eigene Regeln, Hinweis im Ergebnis
    clearLanguageToolCache();
    const down = await build('lt-down', { url: 'http://127.0.0.1:9' });
    try {
      const r = (await client(down)('POST', '/style/check', { text: 'Das ist ein Test mit mehrere Fehler.' }, 'u-leser')).json;
      expect(r.languageTool.used).toBe(false);
      expect(r.languageTool.error).toBeTruthy();
      expect((await client(down)('GET', '/style/language-tool', undefined, 'u-leser')).json).toMatchObject({ configured: true, available: false });
    } finally {
      await down.app.close();
    }
    const remote = await build('lt-remote', { url: 'https://api.languagetool.org' });
    try {
      expect((await client(remote)('GET', '/style/language-tool', undefined, 'u-leser')).json).toMatchObject({ configured: false, available: false });
      expect((await client(remote)('POST', '/style/check', { text: 'Test mit mehrere Fehler.' }, 'u-leser')).json.languageTool).toEqual({ used: false, error: null });
      expect(await languageToolIssues({ url: 'https://api.languagetool.org', timeoutMs: 100 }, 'x')).toBeNull();
    } finally {
      await remote.app.close();
    }
  });

  it('[T-347] Ansprechperson je Markt mit Vertretung: Länderreview automatisch zuweisen, Vertretung prüft, „Meine Länderreviews“', async () => {
    const built = await build('markt');
    const call = client(built);
    try {
      await call('PATCH', '/projects/p_default', { languages: ['fr', 'fr-ch'] });
      const ch = (await call('POST', '/chapter-assistant', { title: 'Vertrag anlegen', purpose: 'Mit dieser Anleitung legen Sie einen Vertrag an.', steps: ['Öffnen Sie **Verträge**', 'Klicken Sie auf **Neu**'], result: 'Der Vertrag ist gespeichert.' }, 'u-redaktion')).json;
      expect((await call('POST', `/chapter-versions/${ch.versionId}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${ch.versionId}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      const tr = (await call('POST', '/translations', { chapterId: ch.chapterId, language: 'fr-ch' }, 'u-redaktion')).json;

      // ohne Eintrag: Fehler mit Hinweis
      const none = await call('POST', `/translations/${tr.id}/reviews`, { market: 'CH' }, 'u-redaktion');
      expect(none.status).toBe(400);
      expect(none.json.detail).toMatch(/keine Ansprechperson/);
      expect((await call('PUT', '/market-reviewers', { market: 'CH', userId: 'u-fachpruefung', deputyUserId: 'u-freigabe' }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/market-reviewers', { market: 'CH', userId: 'u-fachpruefung', deputyUserId: 'u-fachpruefung' })).status).toBe(400);
      expect((await call('PUT', '/market-reviewers', { market: 'C', userId: 'u-fachpruefung' })).status).toBe(400);
      const list = (await call('PUT', '/market-reviewers', { market: 'ch', userId: 'u-fachpruefung', deputyUserId: 'u-freigabe', note: 'Schweiz, alle Sprachen' })).json;
      expect(list).toMatchObject([{ market: 'CH', language: null, userId: 'u-fachpruefung', deputyUserId: 'u-freigabe' }]);
      // sprachspezifischer Eintrag geht vor
      await call('PUT', '/market-reviewers', { market: 'CH', language: 'fr', userId: 'u-redaktion' });
      expect((await call('GET', '/market-reviewers', undefined, 'u-leser')).json).toHaveLength(2);

      const rev = (await call('POST', `/translations/${tr.id}/reviews`, { market: 'CH' }, 'u-redaktion')).json;
      expect(rev).toMatchObject({ reviewer: 'u-fachpruefung', deputy: 'u-freigabe', assignedBy: 'market', market: 'CH' });
      // die Vertretung kann prüfen und sieht das Review unter „Meine Länderreviews“
      const mine = (await call('GET', '/translation-reviews/mine', undefined, 'u-freigabe')).json.items;
      expect(mine).toMatchObject([{ id: rev.id, asDeputy: true, language: 'fr-ch', chapterTitle: 'Vertrag anlegen' }]);
      expect((await call('POST', `/translation-reviews/${rev.id}/errors`, { category: 'terminology', severity: 'minor', note: 'Begriff prüfen' }, 'u-freigabe')).status).toBe(201);
      expect((await call('POST', `/translation-reviews/${rev.id}/errors`, { category: 'terminology', severity: 'minor', note: 'fremd' }, 'u-leser')).status).toBe(403);
      expect((await call('POST', `/translation-reviews/${rev.id}/decision`, { decision: 'return', comment: 'bitte anpassen' }, 'u-freigabe')).status).toBe(200);

      // Ansprechperson gesperrt → Vertretung wird Prüferin
      expect((await call('PATCH', '/users/u-fachpruefung', { disabled: true })).status).toBe(200);
      const rev2 = (await call('POST', `/translations/${tr.id}/reviews`, { market: 'CH' }, 'u-redaktion')).json;
      expect(rev2).toMatchObject({ reviewer: 'u-freigabe', deputy: null, assignedBy: 'market' });
      expect((await call('DELETE', '/market-reviewers/CH?language=fr')).status).toBe(204);
      expect((await call('DELETE', '/market-reviewers/CH?language=fr')).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });
});
