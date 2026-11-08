// Etappe 105: Code-Review der Korrekturen aus den Etappen 88–91
import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { safeRulePattern } from '../src/domain/ruleSets.js';
import { renderDesignDocx } from '../src/services/designDocx.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const WEASEL = "extends: existence\nmessage: \"Avoid '%s'.\"\nlevel: warning\nignorecase: true\ntokens:\n  - very\n";

describe('Etappe 105', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-442] Muster (Regelwerk, Vale): auch feste Wiederholungen mit Option oder Alternative gelten als riskant; übliche Muster bleiben erlaubt', async () => {
    const risky = ['(a+)+', '((a+))+', '(a|aa)+', '(a?){30}a{30}', '(a|a){30}', '(\\w+\\s?)+$', '(?:a+)*b', '(a{1,3}){5}'];
    const fine = ['\\d{2}\\.\\d{2}\\.\\d{4}', '(\\d{2}\\.){2}\\d{4}', '(?:ab)+', '(?:Kunde|Kundin)', 'colou?r', '(?:foo)?bar', '[(+]+', '(?<jahr>\\d{4})-\\d{2}', 'a+?b', '(ab){3}'];
    expect(risky.filter((p) => safeRulePattern(p) !== null)).toEqual([]);
    expect(fine.filter((p) => safeRulePattern(p) === null)).toEqual([]);
    // im Regelwerk abgelehnt
    const built = await freshDatabase(dataDir, 'e105a').then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));
    const call = client(built);
    try {
      expect((await call('POST', '/rulebook/rules', { kind: 'pattern', term: '(a?){30}a{30}' }, 'u-redaktion')).status).toBe(400);
      // Vale-Stil erneut einlesen: gleicher Name in anderer Schreibweise ist derselbe Stil
      expect((await call('POST', '/style/rule-sets/vale', { name: 'Haus-Stil', language: 'en', files: [{ name: 'Weasel.yml', content: WEASEL }] })).status).toBeLessThan(300);
      expect((await call('POST', '/style/rule-sets/vale', { name: 'haus-stil', language: 'en', files: [{ name: 'Weasel.yml', content: WEASEL }] })).status).toBeLessThan(300);
      expect((await call('POST', '/style/rule-sets/vale', { name: 'Haus Stil', language: 'en', files: [{ name: 'Weasel.yml', content: WEASEL }] })).status).toBe(400);
    } finally {
      await built.app.close();
    }
  });

  it('[T-443] Word: fortgesetzte Unterliste („2.“ nach einem Zwischenabsatz) zählt mit ihrer Instanz weiter', async () => {
    const text = '1. Erster Schritt\n   1. Unterpunkt\n\n   Zwischentext\n\n   2. Zweiter Unterpunkt\n2. Zweiter Schritt';
    const chapters = [{ title: '1. Test', sections: [{ code: 'steps', title: 'Schritte', blocks: [{ kind: 'list', text }] }] }];
    const doc = await (await JSZip.loadAsync(await renderDesignDocx('fachdoku', chapters, { title: 'T', asOf: '08.11.2026', media: new Map() } as any))).file('word/document.xml')!.async('string');
    const numOf = (t: string) => {
      const p = [...doc.matchAll(/<w:p>[\s\S]*?<\/w:p>|<w:p [^>]*>[\s\S]*?<\/w:p>/g)].map((m) => m[0]).find((x) => x.includes(t));
      return /<w:numId w:val="(\d+)"\/>/.exec(p ?? '')?.[1];
    };
    expect(numOf('Unterpunkt')).toBeTruthy();
    expect(numOf('Zweiter Unterpunkt')).toBe(numOf('Unterpunkt'));
    expect(numOf('Zweiter Schritt')).toBe(numOf('Erster Schritt'));
  });
});
