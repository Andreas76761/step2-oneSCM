import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 25', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
  } as any));
  const make = (call: ReturnType<typeof client>) => async (title: string, purpose: string, steps: string[]) => {
    const c = (await call('POST', '/chapter-assistant', { title, purpose, steps, result: 'Erledigt.' }, 'u-redaktion')).json;
    expect((await call('POST', `/chapter-versions/${c.versionId}/submit`, {}, 'u-redaktion')).status).toBe(200);
    expect((await call('POST', `/chapter-versions/${c.versionId}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
    return c as { chapterId: string; versionId: string };
  };
  /** Übersetzung vollständig anlegen und freigeben */
  const translate = async (call: ReturnType<typeof client>, chapterId: string, language: string, title: string) => {
    const tr = (await call('POST', '/translations', { chapterId, language }, 'u-redaktion')).json;
    const d = (await call('GET', `/translations/${tr.id}`)).json;
    // Listen bleiben Listen (sonst meldet die Prüfung abweichende Schritte)
    for (const b of d.sections.flatMap((s: any) => s.blocks)) await call('PATCH', `/translation-blocks/${b.id}`, { text: b.sourceText.replace(/^(\s*\d+[.)]\s+)?/gm, (m: string) => `${m}EN `) }, 'u-redaktion');
    await call('PATCH', `/translations/${tr.id}`, { title }, 'u-redaktion');
    return tr.id as string;
  };

  it('[T-205] Übersetzung anfordern: je Person einmal, Hinweis an die Redaktion beim ersten Wunsch, Übersicht nach Anzahl, Benachrichtigung bei Freigabe', async () => {
    const built = await build('requests');
    const call = client(built);
    try {
      const mk = make(call);
      const a = await mk('Lieferschein drucken', 'Mit dieser Anleitung drucken Sie einen Lieferschein.', ['Öffnen Sie **Lager**', 'Klicken Sie auf **Drucken**']);
      const b = await mk('Auftrag anlegen', 'Mit dieser Anleitung legen Sie einen Auftrag an.', ['Öffnen Sie **Verkauf**', 'Klicken Sie auf **Neu**']);
      // nur Projektsprachen
      expect((await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'en' }, 'u-leser')).status).toBe(400);
      await call('PATCH', '/projects/p_default', { languages: ['en', 'fr'] });
      expect((await call('POST', '/reader/translation-requests', { chapterId: a.chapterId }, 'u-leser')).status).toBe(400);
      expect((await call('POST', '/reader/translation-requests', { chapterId: 'ch_unbekannt', language: 'en' }, 'u-leser')).status).toBe(404);
      // erster Wunsch: Hinweis im Kapitel an die Redaktion (Autorin der Fassung)
      const r1 = (await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'en' }, 'u-leser')).json;
      expect(r1).toEqual({ chapterId: a.chapterId, language: 'en', requested: true, count: 1, state: 'missing' });
      const notes = (await call('GET', '/notifications', undefined, 'u-redaktion')).json;
      expect(notes.items ?? notes).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'translation_request', text: expect.stringContaining('Übersetzung gewünscht: „Lieferschein drucken“ auf Englisch') })]));
      // dieselbe Person erneut: zählt einmal; weitere Personen zählen
      expect((await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'en' }, 'u-leser')).json.count).toBe(1);
      expect((await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'en' }, 'u-fachpruefung')).json.count).toBe(2);
      // gleichzeitige erste Wünsche verschiedener Personen: genau ein Hinweis an die Redaktion
      await Promise.all(['u-leser', 'u-fachpruefung', 'u-admin'].map((u) => call('POST', '/reader/translation-requests', { chapterId: b.chapterId, language: 'fr' }, u)));
      const noticesB = (await call('GET', '/notifications', undefined, 'u-redaktion')).json;
      expect((noticesB.items ?? noticesB).filter((n: any) => n.type === 'translation_request' && n.text.includes('Auftrag anlegen'))).toHaveLength(1);
      // eigene Wünsche in /reader/me
      expect((await call('GET', '/reader/me', undefined, 'u-leser')).json.translationRequests).toEqual(expect.arrayContaining([{ chapterId: a.chapterId, language: 'en' }, { chapterId: b.chapterId, language: 'fr' }]));
      // Übersicht: meistgewünschte zuerst
      const list = (await call('GET', '/translation-requests')).json;
      expect(list.map((r: any) => [r.title, r.language, r.count, r.state])).toEqual([['Auftrag anlegen', 'fr', 3, 'missing'], ['Lieferschein drucken', 'en', 2, 'missing']]);
      // Übersetzung in Arbeit, dann freigegeben: Wunsch erledigt, Anfragende benachrichtigt
      const trId = await translate(call, a.chapterId, 'en', 'Print delivery note');
      expect((await call('GET', '/translation-requests')).json.find((r: any) => r.chapterId === a.chapterId)).toMatchObject({ state: 'in_progress' });
      expect((await call('POST', `/translations/${trId}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      expect((await call('GET', '/translation-requests')).json.map((r: any) => r.chapterId)).toEqual([b.chapterId]);
      expect((await call('GET', '/translation-requests?all=true')).json.find((r: any) => r.chapterId === a.chapterId).state).toBe('done');
      const ready = (await call('GET', '/notifications', undefined, 'u-leser')).json;
      expect(ready.items ?? ready).toEqual(expect.arrayContaining([expect.objectContaining({ type: 'translation_ready', text: 'Ihre gewünschte Übersetzung ist da: „Print delivery note“ auf Englisch.' })]));
      // aktuell übersetzt: kein neuer Wunsch möglich
      expect((await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'en' }, 'u-leser')).status).toBe(400);
      // fremdes Projekt sieht die Wünsche nicht
      const other = (await call('POST', '/projects', { name: 'Fremd' })).json;
      expect((await call('GET', '/translation-requests', undefined, 'u-admin', other.id)).json).toEqual([]);
      expect((await call('POST', '/reader/translation-requests', { chapterId: b.chapterId, language: 'fr' }, 'u-admin', other.id)).status).toBe(400);
    } finally {
      await built.app.close();
    }
  });

  it('[T-206] Online-Hilfe: Beschriftungen in der Sprache, übrige Projektsprachen englisch', async () => {
    const built = await build('help-labels');
    const call = client(built);
    try {
      const a = await make(call)('Lieferschein drucken', 'Mit dieser Anleitung drucken Sie einen Lieferschein.', ['Öffnen Sie **Lager**', 'Klicken Sie auf **Drucken**']);
      await call('PATCH', '/projects/p_default', { languages: ['en', 'fr', 'nl'] });
      await call('POST', '/help-contexts', { key: 'ls.print', chapterId: a.chapterId }, 'u-redaktion');
      await call('PUT', '/help-settings', { public: true });
      await call('POST', '/releases', { version: '2026.9' }, 'u-freigabe');
      const page = (lang: string) => built.app.inject({ method: 'GET', url: `/help/embed/p_default/ls.print?language=${lang}` }).then((r) => r.body);
      expect(await page('de')).toContain('War das hilfreich?');
      expect(await page('fr')).toContain('Cette aide vous a-t-elle été utile ?');
      // Niederländisch: keine eigenen Beschriftungen → englisch statt deutsch
      const nl = await page('nl');
      expect(nl).toContain('Was this helpful?');
      expect(nl).toContain('Not yet translated – German version shown.');
      expect(nl).toContain('<html lang="en">');
      expect(nl).toContain('<div lang="de">');
      // die angefragte Inhaltssprache bleibt in Formularen (Assistent, Rückmeldung) erhalten – nicht die Beschriftungssprache
      expect(nl.match(/<input type="hidden" name="language" value="nl">/g)).toHaveLength(2);
      expect(nl).not.toContain('name="language" value="en"');
      // Rückmeldung aus der niederländischen Hilfe: Seite bleibt niederländisch angefragt
      const fb = await built.app.inject({ method: 'POST', url: '/help/embed/p_default/ls.print/feedback', payload: 'helpful=1&language=nl', headers: { 'content-type': 'application/x-www-form-urlencoded' } });
      expect(fb.body).toContain('Thank you for your feedback.');
      expect(fb.body).toContain('name="language" value="nl"');
    } finally {
      await built.app.close();
    }
  });
});
