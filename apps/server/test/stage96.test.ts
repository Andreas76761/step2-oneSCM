import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 96', () => {
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
  const notices = async (call: ReturnType<typeof client>, user: string, type: string) => {
    const n = (await call('GET', '/notifications', undefined, user)).json;
    return (n.items ?? n).filter((x: any) => x.type === type);
  };

  it('[T-420] Übersetzungswunsch mit Zyklus: erfüllt, veraltet, erneut gewünscht und gemeldet', async () => {
    const built = await build('e96a');
    const call = client(built);
    try {
      const a = await make(call)('Lieferschein drucken', 'Mit dieser Anleitung drucken Sie einen Lieferschein.', ['Öffnen Sie **Lager**', 'Klicken Sie auf **Drucken**']);
      await call('PATCH', '/projects/p_default', { languages: ['en'] });
      expect((await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'en' }, 'u-leser')).json.count).toBe(1);
      expect(await notices(call, 'u-redaktion', 'translation_request')).toHaveLength(1);
      // übersetzen und freigeben: Wunsch erfüllt, nicht mehr offen
      const tr = (await call('POST', '/translations', { chapterId: a.chapterId, language: 'en' }, 'u-redaktion')).json;
      for (const b of (await call('GET', `/translations/${tr.id}`)).json.sections.flatMap((s: any) => s.blocks)) await call('PATCH', `/translation-blocks/${b.id}`, { text: b.sourceText.replace(/^(\s*\d+[.)]\s+)?/gm, (m: string) => `${m}EN `) }, 'u-redaktion');
      await call('PATCH', `/translations/${tr.id}`, { title: 'Print delivery note' }, 'u-redaktion');
      expect((await call('POST', `/translations/${tr.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      expect(await notices(call, 'u-leser', 'translation_ready')).toHaveLength(1);
      expect((await call('GET', '/reader/me', undefined, 'u-leser')).json.translationRequests).toEqual([]);
      expect((await call('GET', '/translation-requests')).json).toEqual([]);
      expect((await call('GET', '/translation-requests?all=true')).json[0]).toMatchObject({ chapterId: a.chapterId, state: 'done' });

      // neue deutsche Fassung → Übersetzung veraltet: dieselbe Person wünscht erneut, die Redaktion erfährt es wieder
      const ts = new Date().toISOString();
      await built.ctx.db.run("UPDATE generated_chapter_versions SET status = 'superseded' WHERE id = ?", a.versionId);
      await built.ctx.db.run("INSERT INTO generated_chapter_versions (id, chapter_id, version_no, status, title, based_on_version_id, generator, generated_by, generated_at, approved_at) VALUES ('gv_a2', ?, 2, 'approved', 'Lieferschein drucken', ?, 'test', 'u-redaktion', ?, ?)", a.chapterId, a.versionId, ts, ts);
      const again = (await call('POST', '/reader/translation-requests', { chapterId: a.chapterId, language: 'en' }, 'u-leser')).json;
      expect(again).toMatchObject({ requested: true, count: 1, state: 'outdated' });
      expect(await notices(call, 'u-redaktion', 'translation_request')).toHaveLength(2);
      expect((await call('GET', '/reader/me', undefined, 'u-leser')).json.translationRequests).toEqual([{ chapterId: a.chapterId, language: 'en' }]);
      expect((await call('GET', '/translation-requests')).json.map((r: any) => [r.chapterId, r.count, r.state])).toEqual([[a.chapterId, 1, 'outdated']]);
    } finally {
      await built.app.close();
    }
  });

  it('[T-421] FAQ der Online-Hilfe nach Rolle, Rückmeldung nur eine Aufgabe, Stilregeln (CSV-Formeln, fehlerhafter Import), Blocktyp, Trefferzahl der Suche', async () => {
    const built = await build('e96b');
    const call = client(built);
    try {
      const a = await make(call)('Lieferschein drucken', 'Mit dieser Anleitung drucken Sie einen Lieferschein im Lager.', ['Öffnen Sie **Lager › Lieferscheine**', 'Klicken Sie auf **Drucken**']);
      // FAQ nur für Dealer: in der Online-Hilfe nur mit dieser Rolle
      await call('POST', '/faq', { question: 'Wie drucke ich einen Lieferschein im Lager?', answer: 'Öffnen Sie den Lieferschein im Lager und klicken Sie auf Drucken.', roles: ['dealer'], status: 'published' }, 'u-redaktion');
      expect((await call('POST', '/help-contexts', { key: 'ls.print', chapterId: a.chapterId }, 'u-redaktion')).status).toBe(201);
      const forDealer = (await call('GET', '/context-help/ls.print?role=dealer')).json;
      expect(forDealer.faq.map((f: any) => f.question)).toEqual(['Wie drucke ich einen Lieferschein im Lager?']);
      expect((await call('GET', '/context-help/ls.print?role=market')).json.faq).toEqual([]);
      expect((await call('GET', '/context-help/ls.print')).json.faq).toHaveLength(1);

      // Rückmeldung zweimal gleichzeitig als Aufgabe: genau eine Aufgabe
      await call('POST', `/chapters/${a.chapterId}/feedback`, { helpful: false, versionId: a.versionId, comment: 'Druckername fehlt' }, 'u-leser');
      const fb = (await call('GET', '/feedback?status=open')).json.items?.[0] ?? (await call('GET', '/feedback?status=open')).json[0];
      const both = await Promise.all([0, 1].map(() => call('POST', `/feedback/${fb.id}/task`, { assignee: 'u-redaktion' }, 'u-fachpruefung')));
      expect(both.map((r) => r.status).sort()).toEqual([201, 409]);
      const tasks = Number((await built.ctx.db.get<any>("SELECT COUNT(*) AS n FROM comments WHERE kind = 'task' AND entity_id = ?", a.chapterId))!.n);
      expect(tasks).toBe(1);

      // Stilregeln: Formeln im CSV-Export entschärft, beim Einlesen wieder wie eingegeben
      await call('PUT', '/style/rules', { phrases: [{ avoid: '=HYPERLINK("http://x","y")', use: 'Link' }, { avoid: '- bitte', use: '' }] });
      const csv = (await call('GET', '/style/rules/export?format=csv')).body as string;
      expect(csv).toContain(`"'=HYPERLINK(""http://x"",""y"")"`);
      expect(csv).toContain(`'- bitte`);
      const back = (await call('POST', '/style/rules/import', { csv, mode: 'replace' })).json;
      expect(back.rules.phrases.map((p: any) => p.avoid)).toEqual(['=HYPERLINK("http://x","y")', '- bitte']);
      // fehlerhafter JSON-Import: 400 statt 500
      for (const phrases of [[{ use: 'x' }], [null]]) expect((await call('POST', '/style/rules/import', { rules: { phrases } })).status).toBe(400);

      // Blocktyp '' oder null wird nicht gespeichert
      const d = (await call('POST', '/chapter-assistant', { title: 'Etikett drucken', purpose: 'Mit dieser Anleitung drucken Sie ein Etikett.', steps: ['Öffnen Sie **Lager**'], result: 'Erledigt.' }, 'u-redaktion')).json;
      const block = (await call('GET', `/chapter-versions/${d.versionId}`)).json.sections.flatMap((s: any) => s.blocks).find((b: any) => b.kind === 'paragraph');
      expect(block).toBeTruthy();
      for (const kind of ['', null]) expect((await call('PATCH', `/content-blocks/${block.id}`, { kind, reason: 'x' }, 'u-redaktion')).status).toBe(400);
      expect((await call('GET', `/chapter-versions/${d.versionId}`)).json.sections.flatMap((s: any) => s.blocks).find((b: any) => b.id === block.id).kind).toBe('paragraph');

      // Suche: Trefferzahl stimmt auch über 100 Treffern ohne Titeltreffer
      const many = Array.from({ length: 120 }, () => 'Etikett').join(' ');
      await make(call)('Versand vorbereiten', `Mit dieser Anleitung bereiten Sie den Versand vor. ${many}.`, ['Öffnen Sie **Versand**', 'Klicken Sie auf **Neu**']);
      const hit = (await call('GET', '/reader/search?q=Etikett')).json.results[0];
      expect(hit.hits).toBeGreaterThanOrEqual(120);
    } finally {
      await built.app.close();
    }
  });
});
