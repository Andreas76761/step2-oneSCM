import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 27', () => {
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

  it('[T-209] FAQ-Stapelübersetzung: fehlende und veraltete Einträge einer Sprache als KI-Entwurf, Fortschritt, Hinweis, Datenschutz, danach Freigabe', async () => {
    const built = await build('faq-batch');
    const call = client(built);
    try {
      await call('PATCH', '/projects/p_default', { languages: ['en', 'fr'] });
      const q = (question: string, answer: string) => call('POST', '/faq', { question, answer, status: 'published' }, 'u-redaktion').then((r) => r.json);
      const f1 = await q('Wie drucke ich einen Lieferschein erneut?', 'Öffnen Sie den Lieferschein im Lager und drucken Sie ihn erneut.');
      const f2 = await q('Wo finde ich offene Aufträge?', 'Unter Verkauf finden Sie alle offenen Aufträge.');
      const f3 = await q('Wen frage ich bei Problemen?', 'Schreiben Sie an max.muster@lager-posen.de.');
      // f1 ist bereits aktuell übersetzt und freigegeben: bleibt unberührt
      await call('PUT', `/faq/${f1.id}/translations/en`, { question: 'How do I reprint a delivery note?', answer: 'Open the delivery note in the warehouse and print it again.' }, 'u-redaktion');
      expect((await call('POST', `/faq/${f1.id}/translations/en/approve`, {}, 'u-freigabe')).status).toBe(200);
      // Rechte und Eingaben
      expect((await call('POST', '/faq/translation-batches', { language: 'en' }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/faq/translation-batches', {}, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/faq/translation-batches', { language: 'xx' }, 'u-redaktion')).status).toBe(400);
      expect((await call('GET', '/faq/translation-batches/preview?language=en', undefined, 'u-redaktion')).json).toEqual({ language: 'en', pending: 2, privacy: 0, eligible: 2 });
      // Start: 202, im Hintergrund; danach Entwürfe (KI) für f2 und f3, Freigabe von f1 unverändert
      const started = await call('POST', '/faq/translation-batches', { language: 'en' }, 'u-redaktion');
      expect(started.status).toBe(202);
      expect(started.json).toMatchObject({ language: 'en', languageName: 'Englisch', total: 2 });
      await built.ctx.jobs.idle();
      const done = (await call('GET', `/faq/translation-batches/${started.json.id}`)).json;
      expect(done).toMatchObject({ status: 'completed', total: 2, done: 2, failed: 0, skipped: 0 });
      expect(done.translated + done.flagged).toBe(2);
      expect((await call('GET', '/faq/translations')).json.entries).toMatchObject({ [f1.id]: { en: 'approved', fr: 'missing' }, [f2.id]: { en: 'draft' }, [f3.id]: { en: 'draft' } });
      const t2 = (await call('GET', `/faq/${f2.id}/translations`)).json[0];
      expect(t2).toMatchObject({ language: 'en', status: 'draft', mode: 'machine', updatedBy: 'u-redaktion' });
      // Hinweis an die auftraggebende Person mit Link in die FAQ-Pflege
      const notes = (await call('GET', '/notifications', undefined, 'u-redaktion')).json.items.filter((n: any) => n.type === 'faq_batch');
      expect(notes).toEqual([expect.objectContaining({ link: '/stammdaten/faq?sprache=en', text: expect.stringContaining('KI-Übersetzung der häufigen Fragen (Englisch) abgeschlossen') })]);
      // Liste je Sprache; nichts mehr zu tun → 422; Abbruch eines beendeten Auftrags → 409; fremde Projekte sehen nichts
      expect((await call('GET', '/faq/translation-batches?language=en')).json.map((b: any) => b.id)).toEqual([started.json.id]);
      expect((await call('GET', '/faq/translation-batches?language=fr')).json).toEqual([]);
      expect((await call('POST', '/faq/translation-batches', { language: 'en' }, 'u-redaktion')).status).toBe(422);
      expect((await call('POST', `/faq/translation-batches/${started.json.id}/cancel`, {}, 'u-redaktion')).status).toBe(409);
      const other = (await call('POST', '/projects', { name: 'Fremd' })).json;
      expect((await call('GET', `/faq/translation-batches/${started.json.id}`, undefined, 'u-admin', other.id)).status).toBe(404);
      // Freigabe wie gewohnt (andere Person, ohne Prüfbefund)
      if (!t2.issues.length) expect((await call('POST', `/faq/${f2.id}/translations/en/approve`, {}, 'u-freigabe')).status).toBe(200);
      // deutsche Antwort geändert → veraltet → erneut im Stapel
      await call('PATCH', `/faq/${f1.id}`, { answer: 'Öffnen Sie den Lieferschein und klicken Sie auf **Erneut drucken**.' }, 'u-redaktion');
      expect((await call('GET', '/faq/translation-batches/preview?language=en', undefined, 'u-redaktion')).json.pending).toBe(1);
      // externer KI-Dienst: Einträge mit personenbezogenen Daten bleiben ausgenommen
      const llm = built.ctx.llm as any;
      Object.defineProperty(llm, 'external', { value: true, configurable: true });
      try {
        expect((await call('GET', '/faq/translation-batches/preview?language=fr', undefined, 'u-redaktion')).json).toEqual({ language: 'fr', pending: 3, privacy: 1, eligible: 2 });
        const fr = (await call('POST', '/faq/translation-batches', { language: 'fr' }, 'u-redaktion')).json;
        expect(fr.total).toBe(2);
        await built.ctx.jobs.idle();
        expect((await call('GET', '/faq/translations')).json.entries[f3.id].fr).toBe('missing');
      } finally {
        Object.defineProperty(llm, 'external', { value: false, configurable: true });
      }
      const en2 = (await call('POST', '/faq/translation-batches', { language: 'en' }, 'u-redaktion')).json;
      expect(en2.total).toBe(1);
      await built.ctx.jobs.idle();
      expect((await call('GET', `/faq/${f1.id}/translations`)).json[0]).toMatchObject({ status: 'draft', mode: 'machine', outdated: false });
    } finally {
      await built.app.close();
    }
  });

  it('[T-210] Übersetzungswunsch mit Begründung; Wochenübersicht mit Übersetzungswünschen und veralteten Übersetzungen', async () => {
    const built = await build('reasons-digest');
    const call = client(built);
    try {
      const a = await make(call)('Lieferschein drucken', 'Mit dieser Anleitung drucken Sie einen Lieferschein.', ['Öffnen Sie **Lager**', 'Klicken Sie auf **Drucken**']);
      const b = await make(call)('Auftrag anlegen', 'Mit dieser Anleitung legen Sie einen Auftrag an.', ['Öffnen Sie **Verkauf**', 'Klicken Sie auf **Neu**']);
      await call('PATCH', '/projects/p_default', { languages: ['en', 'pl'] });
      // Begründung: optional, Text, gekürzt; im Hinweis an die Redaktion
      expect((await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'pl', reason: 42 }, 'u-leser')).status).toBe(400);
      const r1 = (await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'pl', reason: `  Neue Kollegen im Lager   Posen ${'x'.repeat(400)}` }, 'u-leser')).json;
      expect(r1).toMatchObject({ count: 1, state: 'missing' });
      expect(r1.reason).toMatch(/^Neue Kollegen im Lager Posen x+$/);
      expect(r1.reason).toHaveLength(300);
      const notes = (await call('GET', '/notifications', undefined, 'u-redaktion')).json.items;
      expect(notes.find((n: any) => n.type === 'translation_request').text).toContain('Begründung: „Neue Kollegen im Lager Posen');
      // erneuter Wunsch derselben Person: zählt nicht doppelt, Begründung wird ersetzt; ohne Begründung bleibt sie
      expect((await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'pl', reason: 'Schulung im Oktober' }, 'u-leser')).json).toMatchObject({ count: 1, reason: 'Schulung im Oktober' });
      expect((await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'pl' }, 'u-leser')).json.reason).toBe('Schulung im Oktober');
      await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'pl', reason: '   ' }, 'u-fachpruefung');
      await call('POST', '/reader/translation-requests', { chapterId: b.chapterId, language: 'en', reason: 'Für den Außendienst' }, 'u-fachpruefung');
      // Redaktion: Begründungen ohne Namen, neueste zuerst
      const list = (await call('GET', '/translation-requests')).json;
      expect(list.find((r: any) => r.chapterId === a.chapterId)).toMatchObject({ language: 'pl', count: 2, reasons: [{ text: 'Schulung im Oktober', requestedAt: expect.any(String) }] });
      expect(JSON.stringify(list)).not.toContain('u-leser');
      expect((await call('GET', '/reader/me', undefined, 'u-leser')).json.translationRequests).toEqual([{ chapterId: a.chapterId, language: 'pl', reason: 'Schulung im Oktober' }]);
      // Wochenübersicht: Übersetzungswünsche
      let p = (await call('GET', '/digest/preview', undefined, 'u-redaktion')).json;
      expect(p).toMatchObject({ empty: false, openTranslationRequests: 3, outdatedFaqTranslations: 0, outdatedChapterTranslations: [] });
      expect(p.translationRequests[0]).toMatchObject({ chapterId: a.chapterId, languageName: 'Polnisch', count: 2 });
      expect(p.text).toContain('3 Übersetzungswünsche offen (Lieferschein drucken – Polnisch: 2, Auftrag anlegen – Englisch: 1)');
      // veraltete Übersetzungen: Kapitel (neue deutsche Freigabe) und häufige Frage (deutsche Quelle geändert)
      const tr = (await call('POST', '/translations', { chapterId: b.chapterId, language: 'en' }, 'u-redaktion')).json;
      const d = (await call('GET', `/translations/${tr.id}`)).json;
      for (const blk of d.sections.flatMap((s: any) => s.blocks)) await call('PATCH', `/translation-blocks/${blk.id}`, { text: blk.sourceText.replace(/^(\s*\d+[.)]\s+)?/gm, (m: string) => `${m}EN `) }, 'u-redaktion');
      await call('PATCH', `/translations/${tr.id}`, { title: 'Create order' }, 'u-redaktion');
      expect((await call('POST', `/translations/${tr.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      p = (await call('GET', '/digest/preview', undefined, 'u-redaktion')).json;
      expect(p.openTranslationRequests).toBe(2); // Wunsch für „Auftrag anlegen“ (Englisch) ist erledigt
      const ts = new Date().toISOString();
      await built.ctx.db.run("UPDATE generated_chapter_versions SET status = 'superseded' WHERE id = ?", b.versionId);
      await built.ctx.db.run("INSERT INTO generated_chapter_versions (id, chapter_id, version_no, status, title, based_on_version_id, generator, generated_by, generated_at, approved_at) VALUES ('gv_b2', ?, 2, 'approved', 'Auftrag anlegen', ?, 'test', 'u-redaktion', ?, ?)", b.chapterId, b.versionId, ts, ts);
      const faq = (await call('POST', '/faq', { question: 'Wo finde ich offene Aufträge?', answer: 'Unter Verkauf.', status: 'published' }, 'u-redaktion')).json;
      await call('PUT', `/faq/${faq.id}/translations/en`, { question: 'Where do I find open orders?', answer: 'Under Sales.' }, 'u-redaktion');
      await call('PATCH', `/faq/${faq.id}`, { answer: 'Unter Verkauf › Aufträge.' }, 'u-redaktion');
      p = (await call('GET', '/digest/preview', undefined, 'u-redaktion')).json;
      expect(p.outdatedChapterTranslations).toEqual([{ chapterId: b.chapterId, title: 'Auftrag anlegen', language: 'en' }]);
      expect(p.outdatedFaqTranslations).toBe(1);
      expect(p.text).toContain('Veraltete Übersetzungen: 1 Kapitel und 1 häufige Frage');
    } finally {
      await built.app.close();
    }
  });
});
