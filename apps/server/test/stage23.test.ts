import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 23', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
  } as any));
  const make = (call: ReturnType<typeof client>) => async (title: string, purpose: string, steps: string[], approve = true) => {
    const c = (await call('POST', '/chapter-assistant', { title, purpose, steps, result: 'Erledigt.' }, 'u-redaktion')).json;
    if (approve) {
      expect((await call('POST', `/chapter-versions/${c.versionId}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${c.versionId}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
    }
    return c as { chapterId: string; versionId: string };
  };

  it('[T-200] Verwandte Kapitel: ähnliche automatisch, manuelle zuerst, ausblendbar; passende FAQ; Pflege nur mit Bearbeitungsrecht', async () => {
    const built = await build('related');
    const call = client(built);
    try {
      const mk = make(call);
      const a = await mk('Lieferschein drucken', 'Mit dieser Anleitung drucken Sie einen Lieferschein für eine Lieferung im Lager.', ['Öffnen Sie **Lager › Lieferscheine**', 'Wählen Sie die Lieferung', 'Klicken Sie auf **Lieferschein drucken**']);
      const b = await mk('Lieferschein stornieren', 'Mit dieser Anleitung stornieren Sie einen falschen Lieferschein einer Lieferung.', ['Öffnen Sie **Lager › Lieferscheine**', 'Wählen Sie den Lieferschein', 'Klicken Sie auf **Stornieren**']);
      const c = await mk('Kunde anlegen', 'Mit dieser Anleitung legen Sie einen neuen Kunden im Vertrieb an.', ['Öffnen Sie **Vertrieb › Kunden**', 'Klicken Sie auf **Neu**']);
      const d = await mk('Kundendaten ändern', 'Mit dieser Anleitung ändern Sie Adresse und Telefon eines Kunden.', ['Öffnen Sie **Vertrieb › Kunden**', 'Wählen Sie den Kunden'], false);
      await call('POST', '/faq', { question: 'Wie drucke ich einen Lieferschein erneut?', answer: 'Öffnen Sie den Lieferschein im Lager und drucken Sie ihn erneut.', status: 'published' }, 'u-redaktion');
      await call('POST', '/faq', { question: 'Wie ändere ich mein Passwort?', answer: 'Über das Benutzermenü.', status: 'published' }, 'u-redaktion');
      await call('POST', '/faq', { question: 'Lieferschein als Entwurf?', answer: 'Lieferschein im Lager drucken.', status: 'draft' }, 'u-redaktion');
      const r = (await call('GET', `/reader/related/${a.chapterId}`, undefined, 'u-leser')).json;
      expect(r.manual).toEqual([]);
      expect(r.automatic[0]).toMatchObject({ chapterId: b.chapterId, title: 'Lieferschein stornieren' });
      expect(r.automatic.some((x: any) => x.chapterId === a.chapterId)).toBe(false);
      expect(r.automatic.some((x: any) => x.chapterId === d.chapterId)).toBe(false); // Entwurf: für Leser nicht sichtbar
      expect(r.faq.map((f: any) => f.question)).toEqual(['Wie drucke ich einen Lieferschein erneut?']); // nur veröffentlicht und passend
      // mit Entwürfen: Kundendaten ändern ist Kunde anlegen ähnlich
      expect((await call('GET', `/reader/related/${c.chapterId}?drafts=true`)).json.automatic[0]).toMatchObject({ chapterId: d.chapterId });
      // Pflege: manuell zuerst, ausgeblendet entfällt
      expect((await call('PUT', `/chapters/${a.chapterId}/related`, { manual: [c.chapterId] }, 'u-leser')).status).toBe(403);
      expect((await call('PUT', `/chapters/${a.chapterId}/related`, { manual: [a.chapterId] }, 'u-redaktion')).status).toBe(400);
      expect((await call('PUT', `/chapters/${a.chapterId}/related`, { manual: [c.chapterId], hidden: [c.chapterId] }, 'u-redaktion')).status).toBe(400);
      expect((await call('PUT', `/chapters/${a.chapterId}/related`, { manual: ['ch_gibt-es-nicht'] }, 'u-redaktion')).status).toBe(400);
      // höchstens fünf manuelle Verweise (Gesamtgrenze von „Siehe auch“)
      const six = (await call('PUT', `/chapters/${a.chapterId}/related`, { manual: [b.chapterId, c.chapterId, d.chapterId, 'x1', 'x2', 'x3'] }, 'u-redaktion'));
      expect(six.status).toBe(400);
      expect(six.json.detail).toContain('höchstens 5');
      expect((await call('PUT', `/chapters/${a.chapterId}/related`, { manual: [c.chapterId], hidden: [b.chapterId] }, 'u-redaktion')).json).toEqual({ manual: [c.chapterId], hidden: [b.chapterId] });
      const r2 = (await call('GET', `/reader/related/${a.chapterId}`)).json;
      expect(r2.manual).toEqual([{ chapterId: c.chapterId, title: 'Kunde anlegen' }]);
      expect(r2.automatic.some((x: any) => x.chapterId === b.chapterId || x.chapterId === c.chapterId)).toBe(false);
      expect(r2.hidden).toEqual([{ chapterId: b.chapterId, title: 'Lieferschein stornieren' }]);
      // Mandantentrennung: Kapitel eines anderen Projekts weder lesbar noch verknüpfbar
      const other = (await call('POST', '/projects', { name: 'Fremd' })).json;
      expect((await call('GET', `/reader/related/${a.chapterId}`, undefined, 'u-admin', other.id)).status).toBe(404);
      const o = (await call('POST', '/chapter-assistant', { title: 'Fremdkapitel', purpose: 'x', steps: ['Öffnen Sie **X**'] }, 'u-admin', other.id)).json;
      expect((await call('PUT', `/chapters/${a.chapterId}/related`, { manual: [o.chapterId] }, 'u-redaktion')).status).toBe(400);
    } finally {
      await built.app.close();
    }
  });

  it('[T-201] Lesezeichen und Verlauf je Person: merken, zuletzt gelesen, „geändert“ seit dem Lesen und „neu“ seit dem ersten Lesen', async () => {
    const built = await build('bookmarks');
    const call = client(built);
    try {
      const mk = make(call);
      const a = await mk('Auftrag anlegen', 'Mit dieser Anleitung legen Sie einen Auftrag an.', ['Öffnen Sie **Aufträge**', 'Klicken Sie auf **Neu**']);
      const b = await mk('Auftrag prüfen', 'Mit dieser Anleitung prüfen Sie einen Auftrag.', ['Öffnen Sie **Aufträge**', 'Wählen Sie den Auftrag']);
      expect((await call('GET', '/reader/me', undefined, 'u-leser')).json).toEqual({ bookmarks: [], recent: [], updates: {}, lastVisitAt: null });
      // merken (idempotent), nur je Person
      expect((await call('PUT', `/reader/bookmarks/${a.chapterId}`, undefined, 'u-leser')).json).toEqual({ chapterId: a.chapterId, bookmarked: true, note: null });
      await call('PUT', `/reader/bookmarks/${a.chapterId}`, undefined, 'u-leser');
      expect((await call('GET', '/reader/me', undefined, 'u-leser')).json.bookmarks).toEqual([expect.objectContaining({ chapterId: a.chapterId, title: 'Auftrag anlegen' })]);
      expect((await call('GET', '/reader/me', undefined, 'u-redaktion')).json.bookmarks).toEqual([]);
      expect((await call('PUT', '/reader/bookmarks/ch_gibt-es-nicht', undefined, 'u-leser')).status).toBe(404);
      // Besuche: Fassung muss zum Kapitel gehören
      expect((await call('POST', '/reader/visits', { chapterId: a.chapterId, versionId: b.versionId }, 'u-leser')).status).toBe(400);
      expect((await call('POST', '/reader/visits', { chapterId: a.chapterId }, 'u-leser')).status).toBe(400);
      await call('POST', '/reader/visits', { chapterId: a.chapterId, versionId: a.versionId }, 'u-leser');
      await new Promise((r) => setTimeout(r, 5));
      await call('POST', '/reader/visits', { chapterId: b.chapterId, versionId: b.versionId }, 'u-leser');
      let me = (await call('GET', '/reader/me', undefined, 'u-leser')).json;
      expect(me.recent.map((r: any) => r.title)).toEqual(['Auftrag prüfen', 'Auftrag anlegen']);
      expect(me.updates).toEqual({});
      // neue Fassung von a wird freigegeben → „geändert“; neues Kapitel c → „neu“
      await new Promise((r) => setTimeout(r, 5));
      const ts = new Date().toISOString();
      await built.ctx.db.run(
        "INSERT INTO generated_chapter_versions (id, chapter_id, version_no, status, title, based_on_version_id, generator, generated_by, generated_at, approved_at) VALUES (?, ?, 2, 'approved', ?, ?, 'test', 'u-redaktion', ?, ?)",
        'gv_a2', a.chapterId, 'Auftrag anlegen', a.versionId, ts, ts,
      );
      await new Promise((r) => setTimeout(r, 5));
      const c = await mk('Auftrag stornieren', 'Mit dieser Anleitung stornieren Sie einen Auftrag.', ['Öffnen Sie **Aufträge**', 'Klicken Sie auf **Stornieren**']);
      // der erneute Besuch eines anderen Kapitels verdrängt „neu“ nicht (Bezug: erstes Lesen)
      await call('POST', '/reader/visits', { chapterId: b.chapterId, versionId: b.versionId }, 'u-leser');
      me = (await call('GET', '/reader/me', undefined, 'u-leser')).json;
      expect(me.updates[c.chapterId]).toBe('new');
      expect(me.updates[a.chapterId]).toBe('changed');
      expect(me.updates[b.chapterId]).toBeUndefined();
      // erneut gelesen → nicht mehr geändert
      await call('POST', '/reader/visits', { chapterId: c.chapterId, versionId: c.versionId }, 'u-leser');
      expect((await call('GET', '/reader/me', undefined, 'u-leser')).json.updates[c.chapterId]).toBeUndefined();
      // entfernen
      await call('DELETE', `/reader/bookmarks/${a.chapterId}`, undefined, 'u-leser');
      expect((await call('GET', '/reader/me', undefined, 'u-leser')).json.bookmarks).toEqual([]);
      // anderes Projekt: fremde Kapitel nicht merkbar
      const other = (await call('POST', '/projects', { name: 'Fremd' })).json;
      expect((await call('PUT', `/reader/bookmarks/${a.chapterId}`, undefined, 'u-admin', other.id)).status).toBe(404);
      expect((await call('POST', '/reader/visits', { chapterId: a.chapterId, versionId: a.versionId }, 'u-admin', other.id)).status).toBe(400);
    } finally {
      await built.app.close();
    }
  });
});
