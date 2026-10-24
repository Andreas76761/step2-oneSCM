import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { parseValeStyle, ruleSetIssues } from '../src/domain/ruleSets.js';
import { analyzeStyle } from '../src/domain/style.js';
import { client, uploadFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const hits = (text: string, key: 'tekom' | 'ste', language: string, disabledRules: string[] = []) =>
  ruleSetIssues(text, language, [{ key, name: key, language, disabledRules }]).map((i) => ({ rule: i.source!.rule, at: text.slice(i.start, i.end), message: i.message }));

const WEASEL = "extends: existence\nmessage: \"'%s' is a weasel word!\"\nignorecase: true\nlevel: warning\ntokens:\n  - very\n  - simply\n";
const TERMS = "extends: substitution\nmessage: \"Use '%s' instead of '%s'.\"\nlevel: error\nignorecase: true\nswap:\n  log in: sign in\n  e-mail: email\n";
const COMMAS = "extends: occurrence\nmessage: \"More than 3 commas!\"\nlevel: suggestion\nscope: sentence\nmax: 3\ntoken: ','\nnonword: true\n";

describe('Etappe 56', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-349] Regelsätze: Regelbasiertes Schreiben (Deutsch) und STE-Grundregeln (Englisch) mit Fundstellen, Regeln abschaltbar (Einheit)', () => {
    const de = '1. Öffnen Sie **Versand › Sendungen** und klicken Sie auf **Drucken**.\n2. Klicken Sie auf **Speichern**, wenn alle Felder gefüllt sind.\n3. Sie müssen die Liste prüfen (siehe oben).\n\nDas ist nicht unwichtig.';
    const d = hits(de, 'tekom', 'de');
    expect(d.map((x) => x.rule).sort()).toEqual(['condition_first', 'direct', 'double_negation', 'one_action', 'parentheses', 'vague_reference']);
    expect(d.find((x) => x.rule === 'one_action')).toMatchObject({ at: 'klicken Sie' });
    expect(d.find((x) => x.rule === 'condition_first')!.message).toContain('„Wenn …, klicken Sie …“');
    expect(d.find((x) => x.rule === 'direct')).toMatchObject({ at: 'Sie müssen' });
    // gute Anweisung: keine Funde; abgeschaltete Regel meldet nichts
    expect(hits('1. Wenn alle Felder gefüllt sind, klicken Sie auf **Speichern**.\n2. Öffnen Sie **Versand**.', 'tekom', 'de')).toEqual([]);
    expect(hits(de, 'tekom', 'de', ['one_action', 'direct']).map((x) => x.rule)).not.toContain('one_action');
    // Beschreibung mit „können Sie“ ist kein Handlungsschritt
    expect(hits('Hier können Sie Verträge anlegen.', 'tekom', 'de')).toEqual([]);
    // langer Schritt
    expect(hits(`1. Klicken Sie ${'auf das Feld '.repeat(6)}rechts.`, 'tekom', 'de').map((x) => x.rule)).toEqual(['step_length']);

    const en = '1. Open the menu and click Save.\nThe file is saved by the system when you are closing the window.\n2. You should check the settings.';
    const e = hits(en, 'ste', 'en');
    expect(e.map((x) => x.rule).sort()).toEqual(['active_voice', 'clear_instruction', 'no_ing', 'one_instruction']);
    expect(e.find((x) => x.rule === 'no_ing')).toMatchObject({ at: 'closing' });
    expect(hits(`Open ${'the main '.repeat(10)}menu.`, 'ste', 'en').map((x) => x.rule)).toEqual(['procedural_length']);
    expect(hits(Array.from({ length: 7 }, (_, i) => `The pump number ${i + 1} is ready.`).join(' '), 'ste', 'en').map((x) => x.rule)).toEqual(['paragraph_length']);
    // ein Satz gilt nur für Texte seiner Sprache
    expect(ruleSetIssues(en, 'de', [{ key: 'ste', name: 'STE', language: 'en', disabledRules: [] }])).toEqual([]);
    // in der Stilprüfung: Regel „Regelsatz“, zählt in Wert und Übersicht; ausschaltbar wie jede Regel
    const a = analyzeStyle(de, { ruleSets: [{ key: 'tekom', name: 'Regelbasiertes Schreiben', language: 'de', disabledRules: [] }] });
    expect(a.counts.rule_set).toBe(6);
    expect(analyzeStyle(de, { ruleSets: [{ key: 'tekom', name: 'R', language: 'de', disabledRules: [] }], disabled: ['rule_set'] }).counts.rule_set).toBeUndefined();
  });

  it('[T-350] Vale-Stile lesen: existence, substitution mit Korrektur, occurrence; nicht unterstützte Regeln und unsichere Muster werden genannt (Einheit)', () => {
    const v = parseValeStyle([
      { name: 'Haus/Weasel.yml', content: WEASEL },
      { name: 'Terms.yml', content: TERMS },
      { name: 'Commas.yml', content: COMMAS },
      { name: 'Spell.yml', content: 'extends: spelling\nmessage: x\n' },
      { name: 'Bad.yml', content: "extends: existence\nmessage: x\ntokens:\n  - '(a+)+b'\n  - '(?<=x)y'\n" },
      { name: 'Broken.yml', content: 'extends: [' },
    ]);
    expect(v.rules.map((r) => r.name)).toEqual(['Weasel', 'Terms', 'Commas']);
    expect(v.unsupported.map((u) => u.name)).toEqual(['Spell', 'Bad', 'Broken']);
    const text = 'Simply log in, then send an e-mail, a b, c, d. Very good.';
    const issues = ruleSetIssues(text, 'en', [{ key: 'vale:haus', name: 'Haus', language: 'en', disabledRules: ['Commas'], rules: v.rules }]);
    expect(issues.map((i) => i.message)).toEqual(["Haus: 'Simply' is a weasel word!", "Haus: 'Very' is a weasel word!", "Haus: Use 'sign in' instead of 'log in'.", "Haus: Use 'email' instead of 'e-mail'."]);
    expect(issues.find((i) => i.message.includes('sign in'))!.fix).toMatchObject({ replacement: 'sign in' });
    expect(issues.find((i) => i.message.includes('weasel'))!.severity).toBe('warning');
    // occurrence je Satz
    expect(ruleSetIssues('a, b, c, d, e.', 'en', [{ key: 'vale:x', name: 'X', language: 'en', disabledRules: [], rules: v.rules }]).map((i) => i.source!.rule)).toEqual(['Commas']);
    // Code und Linkziele bleiben unberührt
    expect(ruleSetIssues('Run `very` and [x](https://very.example).', 'en', [{ key: 'vale:x', name: 'X', language: 'en', disabledRules: [], rules: v.rules }])).toEqual([]);
  });

  it('[T-351] Regelsätze je Projekt: einschalten, Regel abschalten, Vale-Stil als JSON und ZIP einlesen, Wirkung in Stil- und Kapitelprüfung, Berechtigung', async () => {
    const built = await build('sets');
    const call = client(built);
    try {
      const list = (await call('GET', '/style/rule-sets', undefined, 'u-leser')).json;
      expect(list.sets.map((s: any) => [s.key, s.enabled])).toEqual([['tekom', false], ['ste', false]]);
      const text = '1. Öffnen Sie **Verträge** und klicken Sie auf **Neu**.';
      expect((await call('POST', '/style/check', { text })).json.counts.rule_set).toBeUndefined();
      expect((await call('PATCH', '/style/rule-sets/tekom', { enabled: true }, 'u-redaktion')).status).toBe(403);
      expect((await call('PATCH', '/style/rule-sets/tekom', { disabledRules: ['gibt-es-nicht'] })).status).toBe(400);
      expect((await call('PATCH', '/style/rule-sets/tekom', { enabled: true })).json).toMatchObject({ key: 'tekom', enabled: true });
      const check = (await call('POST', '/style/check', { text })).json;
      expect(check.counts.rule_set).toBe(1);
      expect(check.rules).toContainEqual({ rule: 'rule_set', label: 'Regelsatz', count: 1 });
      expect(check.sentences[0].issues.find((i: any) => i.rule === 'rule_set')).toMatchObject({ source: { set: 'tekom', rule: 'one_action' } });
      // Regel des Satzes abschalten
      await call('PATCH', '/style/rule-sets/tekom', { disabledRules: ['one_action'] });
      expect((await call('POST', '/style/check', { text })).json.counts.rule_set).toBeUndefined();
      expect((await call('GET', '/style/rule-sets')).json.sets[0].rules.find((r: any) => r.id === 'one_action').enabled).toBe(false);
      await call('PATCH', '/style/rule-sets/tekom', { disabledRules: [] });

      // Kapitelprüfung nutzt die Regelsätze ebenso
      const ch = (await call('POST', '/chapter-assistant', { title: 'Vertrag anlegen', purpose: 'Mit dieser Anleitung legen Sie einen Vertrag an.', steps: ['Öffnen Sie **Verträge** und klicken Sie auf **Neu**'], result: 'Der Vertrag ist gespeichert.' }, 'u-redaktion')).json;
      const cv = (await call('GET', `/style/chapter-versions/${ch.versionId}`)).json;
      expect(cv.blocks.some((b: any) => b.analysis.counts.rule_set)).toBe(true);

      // Vale-Stil als JSON
      expect((await call('POST', '/style/rule-sets/vale', { name: 'Haus', language: 'en', files: [{ name: 'Spell.yml', content: 'extends: spelling\n' }] })).status).toBe(400);
      const imported = await call('POST', '/style/rule-sets/vale', { name: 'Haus', language: 'en', files: [{ name: 'Weasel.yml', content: WEASEL }, { name: 'Spell.yml', content: 'extends: spelling\n' }] });
      expect(imported.status).toBe(201);
      expect(imported.json).toMatchObject({ key: 'vale:haus', kind: 'vale', enabled: true, language: 'en', unsupported: [{ name: 'Spell' }] });
      const en = (await call('POST', '/style/check', { text: 'Simply open the menu.', language: 'en' })).json;
      expect(en.sentences[0].issues.find((i: any) => i.rule === 'rule_set')).toMatchObject({ message: "Haus: 'Simply' is a weasel word!" });
      // deutscher Text: der englische Stil greift nicht
      expect((await call('POST', '/style/check', { text: 'Simply öffnen.' })).json.sentences[0].issues.some((i: any) => i.message.startsWith('Haus'))).toBe(false);

      // Vale-Stil als ZIP (Stilordner mit Unterordner)
      const zip = new JSZip();
      zip.file('styles/Firma/Terms.yml', TERMS);
      zip.file('styles/Firma/Commas.yml', COMMAS);
      zip.file('styles/Firma/README.md', '# nicht lesen');
      const up = await uploadFile(built, '/style/rule-sets/vale?language=en', 'Firma.zip', await zip.generateAsync({ type: 'nodebuffer' }));
      expect(up.status).toBe(201);
      expect(up.json).toMatchObject({ key: 'vale:firma', name: 'Firma' });
      expect(up.json.rules.map((r: any) => r.id).sort()).toEqual(['Commas', 'Terms']);
      expect((await uploadFile(built, '/style/rule-sets/vale', 'x.txt', Buffer.from('a'))).status).toBe(400);
      const fix = (await call('POST', '/style/check', { text: 'Please log in now.', language: 'en' })).json.sentences[0].issues.find((i: any) => i.message.includes('sign in'));
      expect(fix.fix).toMatchObject({ replacement: 'sign in' });

      expect((await call('GET', '/style/rule-sets')).json.sets.map((s: any) => s.key)).toEqual(['tekom', 'ste', 'vale:firma', 'vale:haus']);
      expect((await call('DELETE', '/style/rule-sets/tekom')).status).toBe(404);
      expect((await call('DELETE', '/style/rule-sets/vale:haus')).status).toBe(204);
      expect((await call('GET', '/style/rule-sets')).json.sets).toHaveLength(3);
      // ganze Regel „Regelsatz“ in den Stilregeln ausschalten
      const rules = (await call('GET', '/style/rules')).json;
      await call('PUT', '/style/rules', { ...rules, disabled: [...rules.disabled, 'rule_set'] });
      expect((await call('POST', '/style/check', { text })).json.counts.rule_set).toBeUndefined();
    } finally {
      await built.app.close();
    }
  });

  it('[T-352] Benachrichtigung: Länderreview an Ansprechperson und Vertretung, Ergebnis an die anfordernde Person, Link öffnet die Übersetzung', async () => {
    const built = await build('notify');
    const call = client(built);
    try {
      await call('PATCH', '/projects/p_default', { languages: ['fr-ch'] });
      const ch = (await call('POST', '/chapter-assistant', { title: 'Vertrag anlegen', purpose: 'Mit dieser Anleitung legen Sie einen Vertrag an.', steps: ['Öffnen Sie **Verträge**'], result: 'Der Vertrag ist gespeichert.' }, 'u-redaktion')).json;
      await call('POST', `/chapter-versions/${ch.versionId}/submit`, {}, 'u-redaktion');
      await call('POST', `/chapter-versions/${ch.versionId}/approve`, { comment: 'ok' }, 'u-freigabe');
      const tr = (await call('POST', '/translations', { chapterId: ch.chapterId, language: 'fr-ch' }, 'u-redaktion')).json;
      await call('PUT', '/market-reviewers', { market: 'CH', userId: 'u-fachpruefung', deputyUserId: 'u-freigabe' });
      const rev = (await call('POST', `/translations/${tr.id}/reviews`, { market: 'CH' }, 'u-redaktion')).json;
      const link = `/uebersetzungen?kapitel=${ch.chapterId}&uebersetzung=${tr.id}`;
      const a = (await call('GET', '/notifications', undefined, 'u-fachpruefung')).json.items;
      expect(a).toMatchObject([{ type: 'review_assigned', link, text: expect.stringContaining('ist Ihnen zugewiesen – als Ansprechperson des Marktes') }]);
      expect(a[0].text).toContain('„Vertrag anlegen“');
      expect(a[0].text).toContain('Markt CH');
      const d = (await call('GET', '/notifications', undefined, 'u-freigabe')).json.items.filter((n: any) => n.type === 'review_assigned');
      expect(d).toMatchObject([{ link, text: expect.stringContaining('als Vertretung eingetragen') }]);
      // anfordernde Person bekommt keinen Hinweis zur eigenen Anforderung, aber das Ergebnis
      expect((await call('GET', '/notifications', undefined, 'u-redaktion')).json.items.filter((n: any) => n.type.startsWith('review_'))).toEqual([]);
      await call('POST', `/translation-reviews/${rev.id}/decision`, { decision: 'return', comment: 'bitte anpassen' }, 'u-fachpruefung');
      expect((await call('GET', '/notifications', undefined, 'u-redaktion')).json.items).toMatchObject([{ type: 'review_decided', link, text: expect.stringContaining('zurück an Übersetzung') }]);
      // „Meine Länderreviews“ nennt die Kapitel-ID für den Sprung
      const rev2 = (await call('POST', `/translations/${tr.id}/reviews`, { reviewer: 'u-fachpruefung', market: 'CH' }, 'u-redaktion')).json;
      expect((await call('GET', '/translation-reviews/mine', undefined, 'u-fachpruefung')).json.items).toMatchObject([{ id: rev2.id, chapterId: ch.chapterId }]);
      // selbst angefordert und selbst geprüft: keine Hinweise an sich selbst
      const before = (await call('GET', '/notifications', undefined, 'u-admin')).json.items.length;
      await call('POST', `/translation-reviews/${rev2.id}/decision`, { decision: 'return', comment: 'x' }, 'u-admin');
      const own = (await call('POST', `/translations/${tr.id}/reviews`, { reviewer: 'u-admin' }, 'u-admin')).json;
      expect(own.reviewer).toBe('u-admin');
      expect((await call('GET', '/notifications', undefined, 'u-admin')).json.items.length).toBe(before);
    } finally {
      await built.app.close();
    }
  });
});
