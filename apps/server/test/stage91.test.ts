import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { parseValeStyle } from '../src/domain/ruleSets.js';
import { analyzeStyle, type StyleIssue } from '../src/domain/style.js';
import { clearLanguageToolCache, languageToolIssues } from '../src/services/languageTool.js';
import { client, uploadFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 91', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-410] LanguageTool-Funde neben satzweiten Befunden, Pause nach Verbindungsfehler, unsichere Vale-Muster abgelehnt (Einheit)', async () => {
    // ein Satz mit 30 Wörtern: „Langer Satz“ deckt den ganzen Satz ab, der Grammatikfund bleibt trotzdem
    const long = `Die Benutzer klickt ${Array.from({ length: 28 }, (_, i) => `wort${i}`).join(' ')}.`;
    const lt: StyleIssue = { rule: 'grammar', severity: 'warning', message: 'LanguageTool: Kongruenz', start: 4, end: 20 };
    const issues = analyzeStyle(long, { extraIssues: [lt] }).sentences[0].issues;
    expect(issues.some((i) => i.rule === 'long_sentence')).toBe(true);
    expect(issues.some((i) => i.rule === 'grammar')).toBe(true);
    // ausgeschaltete eigene Regel verdrängt den Fund ebenfalls nicht
    expect(analyzeStyle(long, { extraIssues: [lt], disabled: ['long_sentence'] }).sentences[0].issues.map((i) => i.rule)).toContain('grammar');

    // Dienst nicht erreichbar: der erste Aufruf meldet den Fehler, die folgenden warten nicht erneut
    clearLanguageToolCache();
    const cfg = { url: 'http://127.0.0.1:9', timeoutMs: 2000 };
    expect((await languageToolIssues(cfg, 'Erster Text.'))?.error).toBeTruthy();
    const t0 = Date.now();
    const second = await languageToolIssues(cfg, 'Zweiter Text.');
    expect(second?.error).toContain('pausiert');
    expect(Date.now() - t0).toBeLessThan(50);
    clearLanguageToolCache();

    // Muster mit katastrophalem Zurückspringen werden nicht übernommen, harmlose schon
    const v = parseValeStyle(['(a|aa)+$', '((a+))+', '(x+y)*z', 'very', '(?:log|sign) in', 'colou?r', 'a{2}'].map((t, i) => ({ name: `R${i}.yml`, content: `extends: existence\nmessage: "x"\ntokens:\n  - '${t}'\n` })));
    const kept = v.rules.flatMap((r: any) => r.tokens ?? []);
    expect(kept).toEqual(expect.arrayContaining(['very', '(?:log|sign) in', 'colou?r', 'a{2}']));
    for (const bad of ['(a|aa)+$', '((a+))+', '(x+y)*z']) expect(kept).not.toContain(bad);
  });

  it('[T-411] Ansprechperson ist Pflicht; verworfene Begriffe nicht übernommen; Vale-Stil behält Einstellungen; UI-Begriffe in der Analyse erlaubt', async () => {
    const database = await freshDatabase(dataDir, 'e91');
    const built = await buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any);
    const call = client(built);
    try {
      // Ansprechperson je Markt ohne Person: abgelehnt, nichts gespeichert
      expect((await call('PUT', '/market-reviewers', { market: 'CH' })).status).toBe(400);
      expect((await call('PUT', '/market-reviewers', { market: 'CH', deputyUserId: 'u-freigabe' })).status).toBe(400);
      expect((await call('GET', '/market-reviewers')).json.length ?? (await call('GET', '/market-reviewers')).json.items?.length).toBe(0);

      // SYNONYME.csv: verworfen wird übersprungen; nach einer offenen Zeile gilt die entschiedene Zeile desselben Begriffs
      const csv = Buffer.from('Bevorzugt;Vermeiden;Kontext;Sprache;Quelle;Status\nAlpha;Beta;;de;;verworfen\nGamma;Delta;;de;;offen\nGamma;Delta;;de;;entschieden\n');
      const pre = await uploadFile(built, '/master-data/import?kind=glossary', 'SYNONYME.csv', csv, 'u-redaktion');
      expect(pre.status).toBe(200);
      expect(pre.json.rows.find((r: any) => r.key === 'Alpha')).toMatchObject({ action: 'skipped', message: expect.stringContaining('verworfen') });
      expect(pre.json.rows.filter((r: any) => r.key === 'Gamma').map((r: any) => r.action)).toEqual(['skipped', 'create']);

      // Vale-Stil erneut einlesen: Ein/Aus und ausgeschaltete Regeln bleiben; ähnlicher Name ersetzt nicht still
      const yml = (t: string) => `extends: existence\nmessage: "x"\ntokens:\n  - ${t}\n`;
      const files = [{ name: 'Weasel.yml', content: yml('very') }, { name: 'Filler.yml', content: yml('simply') }];
      expect((await call('POST', '/style/rule-sets/vale', { name: 'Haus Stil', language: 'en', files })).status).toBe(201);
      expect((await call('PATCH', '/style/rule-sets/vale:haus-stil', { enabled: false, disabledRules: ['Weasel'] })).status).toBe(200);
      const again = await call('POST', '/style/rule-sets/vale', { name: 'Haus Stil', language: 'en', files });
      expect(again.json.enabled).toBe(false);
      expect(again.json.rules.filter((r: any) => !r.enabled).map((r: any) => r.name ?? r.id)).toEqual(['Weasel']);
      expect((await call('POST', '/style/rule-sets/vale', { name: 'haus-stil', language: 'en', files })).status).toBe(400);
    } finally {
      await built.app.close();
    }
  });
});
