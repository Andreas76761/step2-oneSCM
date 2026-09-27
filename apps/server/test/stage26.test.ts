import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 26', () => {
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

  it('[T-207] Häufige Fragen übersetzen: Entwurf, KI-Vorschlag, Freigabe, veraltet nach Änderung; Leseransicht, „Siehe auch“ und Online-Hilfe in der Sprache', async () => {
    const built = await build('faq-translations');
    const call = client(built);
    try {
      const a = await make(call)('Lieferschein drucken', 'Mit dieser Anleitung drucken Sie einen Lieferschein im Lager.', ['Öffnen Sie **Lager › Lieferscheine**', 'Klicken Sie auf **Drucken**']);
      const faq = (await call('POST', '/faq', { question: 'Wie drucke ich einen Lieferschein erneut?', answer: 'Öffnen Sie den Lieferschein im Lager und drucken Sie ihn erneut.', status: 'published' }, 'u-redaktion')).json;
      const fr = (await call('POST', '/faq', { question: 'Où trouver le bon de livraison ?', answer: 'Dans l’entrepôt.', language: 'fr', status: 'published' }, 'u-redaktion')).json;
      // nur Projektsprachen, nur deutsche Quellen, nur mit Bearbeitungsrecht
      expect((await call('PUT', `/faq/${faq.id}/translations/en`, { question: 'How do I reprint a delivery note?', answer: 'Open it and print again.' }, 'u-redaktion')).status).toBe(400);
      await call('PATCH', '/projects/p_default', { languages: ['en', 'fr'] });
      expect((await call('PUT', `/faq/${faq.id}/translations/en`, { question: 'How?', answer: 'x' }, 'u-leser')).status).toBe(403);
      expect((await call('PUT', `/faq/${fr.id}/translations/en`, { question: 'Where?', answer: 'x' }, 'u-redaktion')).status).toBe(400);
      expect((await call('PUT', `/faq/${faq.id}/translations/en`, { question: 'x' }, 'u-redaktion')).status).toBe(400);
      // Stand: alle Sprachen fehlen
      expect((await call('GET', `/faq/${faq.id}/translations`)).json.map((t: any) => [t.language, t.status])).toEqual([['en', 'missing'], ['fr', 'missing']]);
      // Entwurf von Hand: in der Leseransicht noch deutsch
      const saved = (await call('PUT', `/faq/${faq.id}/translations/en`, { question: 'How do I reprint a delivery note?', answer: 'Open the delivery note in the warehouse and print it again.' }, 'u-redaktion')).json;
      expect(saved).toMatchObject({ language: 'en', status: 'draft', mode: 'manual', outdated: false });
      const draftView = (await call('GET', '/reader/faq?lang=en', undefined, 'u-leser')).json;
      expect(draftView.find((f: any) => f.id === faq.id)).toMatchObject({ language: 'de', translated: false, question: 'Wie drucke ich einen Lieferschein erneut?' });
      // Freigabe nur mit Freigaberecht, dann englisch
      expect((await call('POST', `/faq/${faq.id}/translations/en/approve`, {}, 'u-redaktion')).status).toBe(403);
      expect((await call('POST', `/faq/${faq.id}/translations/en/approve`, {}, 'u-freigabe')).json).toMatchObject({ status: 'approved', approvedBy: 'u-freigabe' });
      expect((await call('POST', `/faq/${faq.id}/translations/en/approve`, {}, 'u-freigabe')).status).toBe(409);
      expect((await call('GET', '/reader/faq?lang=en')).json.find((f: any) => f.id === faq.id)).toMatchObject({ language: 'en', translated: true, question: 'How do I reprint a delivery note?' });
      // direkt auf Französisch verfasste Einträge erscheinen nur auf Französisch
      expect((await call('GET', '/reader/faq?lang=en')).json.map((f: any) => f.id)).not.toContain(fr.id);
      expect((await call('GET', '/reader/faq?lang=fr')).json.map((f: any) => f.id)).toEqual([faq.id, fr.id]);
      expect((await call('GET', '/reader/faq')).json.map((f: any) => f.id)).toEqual([faq.id]);
      expect((await call('GET', '/reader/faq?lang=xx')).status).toBe(400);
      // „Siehe auch“: passende FAQ in der Sprache (übersetzt), auch in der Online-Hilfe
      const rel = (await call('GET', `/reader/related/${a.chapterId}?lang=en`)).json;
      expect(rel.faq[0]).toMatchObject({ id: faq.id, language: 'en', question: 'How do I reprint a delivery note?' });
      await call('POST', '/help-contexts', { key: 'ls.print', chapterId: a.chapterId }, 'u-redaktion');
      expect((await call('GET', '/context-help/ls.print?language=en')).json.faq[0]).toMatchObject({ language: 'en', question: 'How do I reprint a delivery note?' });
      // Übersicht in den Stammdaten
      expect((await call('GET', '/faq/translations')).json).toEqual({ languages: ['en', 'fr'], entries: { [faq.id]: { en: 'approved', fr: 'missing' } } });
      // deutsche Antwort geändert → veraltet: wieder deutsch, Freigabe erst nach Überarbeitung
      await call('PATCH', `/faq/${faq.id}`, { answer: 'Öffnen Sie den Lieferschein im Lager und klicken Sie auf **Erneut drucken**.' }, 'u-redaktion');
      expect((await call('GET', `/faq/${faq.id}/translations`)).json[0]).toMatchObject({ language: 'en', status: 'approved', outdated: true });
      expect((await call('GET', '/reader/faq?lang=en')).json.find((f: any) => f.id === faq.id)).toMatchObject({ language: 'de', translated: false });
      // KI-Vorschlag: als Entwurf, aktuell, dann freigebbar
      const machine = (await call('POST', `/faq/${faq.id}/translations/fr/machine`, {}, 'u-redaktion')).json;
      expect(machine).toMatchObject({ language: 'fr', status: 'draft', mode: 'machine', outdated: false });
      expect(machine.question.length).toBeGreaterThan(3);
      expect((await call('POST', `/faq/${faq.id}/translations/fr/approve`, {}, 'u-freigabe')).status).toBe(200);
      // Überarbeiten der veralteten englischen Fassung: neuer Entwurf, dann Freigabe
      await call('PUT', `/faq/${faq.id}/translations/en`, { question: 'How do I reprint a delivery note?', answer: 'Open the delivery note in the warehouse and click **Reprint**.' }, 'u-redaktion');
      expect((await call('POST', `/faq/${faq.id}/translations/en/approve`, {}, 'u-freigabe')).status).toBe(200);
      expect((await call('GET', '/reader/faq?lang=en')).json[0]).toMatchObject({ translated: true, answer: 'Open the delivery note in the warehouse and click **Reprint**.' });
      // fremdes Projekt, Löschen
      const other = (await call('POST', '/projects', { name: 'Fremd' })).json;
      expect((await call('GET', `/faq/${faq.id}/translations`, undefined, 'u-admin', other.id)).status).toBe(404);
      expect((await call('DELETE', `/faq/${faq.id}/translations/fr`, undefined, 'u-redaktion')).status).toBe(204);
      expect((await call('DELETE', `/faq/${faq.id}`, undefined, 'u-redaktion')).status).toBe(204);
      expect(await built.ctx.db.all('SELECT * FROM faq_translations WHERE faq_id = ?', faq.id)).toEqual([]);
    } finally {
      await built.app.close();
    }
  });

  it('[T-208] Weitere Sprachen: Abschnittstitel und Beschriftungen der Online-Hilfe auf Niederländisch, Polnisch, Tschechisch und Portugiesisch', async () => {
    const built = await build('more-languages');
    const call = client(built);
    try {
      const a = await make(call)('Lieferschein drucken', 'Mit dieser Anleitung drucken Sie einen Lieferschein.', ['Öffnen Sie **Lager**', 'Klicken Sie auf **Drucken**']);
      await call('PATCH', '/projects/p_default', { languages: ['nl', 'pl', 'cs', 'pt'] });
      // Übersetzung ins Niederländische: Abschnittstitel niederländisch
      const tr = (await call('POST', '/translations', { chapterId: a.chapterId, language: 'nl' }, 'u-redaktion')).json;
      const d = (await call('GET', `/translations/${tr.id}`)).json;
      for (const b of d.sections.flatMap((s: any) => s.blocks)) await call('PATCH', `/translation-blocks/${b.id}`, { text: b.sourceText.replace(/^(\s*\d+[.)]\s+)?/gm, (m: string) => `${m}NL `) }, 'u-redaktion');
      await call('PATCH', `/translations/${tr.id}`, { title: 'Pakbon afdrukken' }, 'u-redaktion');
      expect((await call('POST', `/translations/${tr.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      const nl = (await call('GET', `/reader/versions/${a.versionId}?lang=nl`)).json;
      expect(nl.sections.find((s: any) => s.code === 'steps').title).toBe('Stapsgewijze instructies');
      expect(nl.sections.find((s: any) => s.code === 'purpose').title).toBe('Doel');
      // Online-Hilfe: Beschriftungen je Sprache
      await call('POST', '/help-contexts', { key: 'ls.print', chapterId: a.chapterId }, 'u-redaktion');
      await call('PUT', '/help-settings', { public: true });
      await call('POST', '/releases', { version: '2026.9' }, 'u-freigabe');
      const page = (lang: string) => built.app.inject({ method: 'GET', url: `/help/embed/p_default/ls.print?language=${lang}` }).then((r) => r.body);
      expect(await page('nl')).toContain('Was dit nuttig?');
      const pl = await page('pl');
      expect(pl).toContain('Czy to było pomocne?');
      expect(pl).toContain('Jeszcze nieprzetłumaczone – wersja niemiecka.');
      expect(await page('cs')).toContain('Bylo to užitečné?');
      expect(await page('pt')).toContain('Isto foi útil?');
    } finally {
      await built.app.close();
    }
  });
});
