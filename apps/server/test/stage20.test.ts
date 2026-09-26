import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { approveChapter, client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const fm = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\nhelp_context: [order.create]\n---\n';
const AUFTRAG = `${fm}# 3. Aufträge\n\n## 3.1 Zweck\n\nAufträge legen Sie im Menü Verkauf an.\n\n## 3.2 Schritte\n\n1. Öffnen Sie das Menü Verkauf.\n2. Klicken Sie auf **Neu**.\n`;

describe('Etappe 20', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
  } as any));
  const assistant = (call: ReturnType<typeof client>, title: string) => call('POST', '/chapter-assistant', {
    title, purpose: 'Mit dieser Anleitung legen Sie einen Auftrag an.', prerequisites: ['Sie haben die Berechtigung Einkauf'],
    steps: ['Öffnen Sie **Einkauf > Aufträge**', 'Klicken Sie auf **Neu**'], result: 'Der Auftrag ist gespeichert.', hints: ['Pflichtfelder sind markiert'],
  }, 'u-redaktion');

  it('[T-192] Rückmeldungen auswerten: Anteil „nicht hilfreich“ je Kapitel, häufige Begriffe, Aufgabe aus Rückmeldung', async () => {
    const built = await build('insights');
    const call = client(built);
    try {
      const a = (await assistant(call, 'Auftrag anlegen')).json;
      const b = (await assistant(call, 'Auftrag löschen')).json;
      await call('POST', `/chapters/${a.chapterId}/feedback`, { helpful: false, versionId: a.versionId, comment: 'Wo finde ich die Lieferantennummer?' }, 'u-leser');
      await call('POST', `/chapters/${a.chapterId}/feedback`, { helpful: false, versionId: a.versionId, comment: 'Lieferantennummer fehlt im Beispiel' }, 'u-freigabe');
      await call('POST', `/chapters/${a.chapterId}/feedback`, { helpful: true, versionId: a.versionId }, 'u-fachpruefung');
      await call('POST', `/chapters/${b.chapterId}/feedback`, { helpful: true, versionId: b.versionId }, 'u-leser');
      // alte Rückmeldung (vor 45 Tagen) für die Entwicklung
      await built.ctx.db.run("INSERT INTO chapter_feedback (id, project_id, chapter_id, version_id, helpful, comment, status, created_by, created_at) VALUES ('fb-alt', 'p_default', ?, ?, 1, NULL, 'open', 'u-admin', ?)",
        a.chapterId, a.versionId, new Date(Date.now() - 45 * 86_400_000).toISOString());
      const ins = (await call('GET', '/feedback/insights?days=90', undefined, 'u-leser')).json;
      expect(ins).toMatchObject({ total: 5, helpful: 3, notHelpful: 2, helpfulShare: 60 });
      expect(ins.chapters[0]).toMatchObject({ chapterId: a.chapterId, helpful: 2, notHelpful: 2, notHelpfulShare: 50, open: 2, trend: 67 });
      expect(ins.chapters[1]).toMatchObject({ chapterId: b.chapterId, notHelpfulShare: 0, trend: null });
      expect(ins.words).toEqual([{ word: 'lieferantennummer', count: 2 }]);
      expect(ins.comments).toHaveLength(2);
      // Aufgabe aus einer Rückmeldung: Kommentar vom Typ Aufgabe, Rückmeldung erledigt
      const fb = ins.comments[0];
      expect((await call('POST', `/feedback/${fb.id}/task`, {}, 'u-leser')).status).toBe(403);
      const r = await call('POST', `/feedback/${fb.id}/task`, { assignee: 'u-redaktion' }, 'u-fachpruefung');
      expect(r.status).toBe(201);
      expect(r.json.task).toMatchObject({ kind: 'task', assignee: 'u-redaktion', entityId: a.chapterId });
      expect(r.json.task.body).toContain('Lieferantennummer');
      expect(r.json.feedback).toMatchObject({ status: 'done', handledBy: 'u-fachpruefung' });
      expect((await call('GET', '/feedback/insights')).json.chapters[0].open).toBe(1);
      // kein zweites Mal
      expect((await call('POST', `/feedback/${fb.id}/task`, { assignee: 'u-redaktion' }, 'u-fachpruefung')).status).toBe(409);
      // 30-Tage-Ansicht: Entwicklung berücksichtigt die 30 Tage davor
      expect((await call('GET', '/feedback/insights?days=30')).json.chapters.find((x: any) => x.chapterId === a.chapterId)).toMatchObject({ total: 3, trend: 67 });
    } finally {
      await built.app.close();
    }
  });

  it('[T-193] Eigene Kapitelvorlagen: aus Kapitel speichern, pflegen, im Assistenten neben den mitgelieferten', async () => {
    const built = await build('own-templates');
    const call = client(built);
    try {
      const a = (await assistant(call, 'Auftrag anlegen')).json;
      expect((await call('POST', '/chapter-templates', { name: 'Bestellung', fromVersionId: a.versionId }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/chapter-templates', { name: 'Datensatz anlegen', fromVersionId: a.versionId }, 'u-redaktion')).status).toBe(409);
      const t = (await call('POST', '/chapter-templates', { name: 'Bestellung', description: 'Aus „Auftrag anlegen“', fromVersionId: a.versionId }, 'u-redaktion'));
      expect(t.status).toBe(201);
      expect(t.json).toMatchObject({
        name: 'Bestellung', builtin: false, purpose: 'Mit dieser Anleitung legen Sie einen Auftrag an.', prerequisites: ['Sie haben die Berechtigung Einkauf.'],
        steps: ['Öffnen Sie **Einkauf > Aufträge**.', 'Klicken Sie auf **Neu**.'], result: 'Der Auftrag ist gespeichert.', hints: ['Pflichtfelder sind markiert.'], sourceVersionId: a.versionId,
      });
      expect((await call('POST', '/chapter-templates', { name: 'bestellung', steps: ['X'] }, 'u-redaktion')).status).toBe(409);
      // Quelle aus einem anderen Projekt ist nicht erlaubt
      const other0 = (await call('POST', '/projects', { name: 'Fremd' })).json;
      expect((await call('POST', '/chapter-templates', { name: 'Fremdkopie', fromVersionId: a.versionId }, 'u-admin', other0.id)).status).toBe(400);
      expect((await call('POST', '/chapter-templates', { name: 'Leer', steps: [] }, 'u-redaktion')).status).toBe(400);
      const list = (await call('GET', '/chapter-assistant/templates', undefined, 'u-leser')).json;
      expect(list.filter((x: any) => x.builtin)).toHaveLength(6);
      expect(list.at(-1)).toMatchObject({ id: t.json.id, name: 'Bestellung', builtin: false });
      // pflegen
      const u = (await call('PATCH', `/chapter-templates/${t.json.id}`, { name: 'Bestellung erfassen', steps: ['Öffnen Sie **…**', 'Klicken Sie auf **Neu**'] }, 'u-redaktion')).json;
      expect(u).toMatchObject({ name: 'Bestellung erfassen', steps: ['Öffnen Sie **…**', 'Klicken Sie auf **Neu**'], hints: ['Pflichtfelder sind markiert.'] });
      expect((await call('PATCH', `/chapter-templates/${t.json.id}`, { name: 'Fehler beheben' }, 'u-redaktion')).status).toBe(409);
      // andere Projekte sehen die Vorlage nicht
      const other = (await call('POST', '/projects', { name: 'Anderes' })).json;
      expect((await call('GET', '/chapter-assistant/templates', undefined, 'u-admin', other.id)).json.some((x: any) => x.id === t.json.id)).toBe(false);
      expect((await call('DELETE', `/chapter-templates/${t.json.id}`, undefined, 'u-admin', other.id)).status).toBe(404);
      expect((await call('DELETE', `/chapter-templates/${t.json.id}`, undefined, 'u-redaktion')).status).toBe(204);
      expect((await call('GET', '/chapter-assistant/templates')).json).toHaveLength(6);
    } finally {
      await built.app.close();
    }
  });

  it('[T-194] Rückmeldung in der Online-Hilfe: anonym, nur veröffentlichte Hilfe, Schutz vor Missbrauch', async () => {
    const built = await build('help-feedback');
    const call = client(built);
    const form = (url: string, payload: string) => built.app.inject({ method: 'POST', url, payload, headers: { 'content-type': 'application/x-www-form-urlencoded' }, remoteAddress: '203.0.113.7' });
    try {
      await importFile(built, '3-auftraege.md', AUFTRAG);
      const chapter = (await call('GET', '/chapters')).json.find((c: any) => c.title === '3. Aufträge');
      await approveChapter(call, chapter.id);
      // nicht freigeschaltet → 404
      expect((await form('/help/embed/p_default/order.create/feedback', 'helpful=1')).statusCode).toBe(404);
      await call('PUT', '/help-settings', { public: true });
      // noch kein Release → 404
      expect((await form('/help/embed/p_default/order.create/feedback', 'helpful=1')).statusCode).toBe(404);
      await call('POST', '/releases', { version: '2026.5' }, 'u-freigabe');
      const page = await built.app.inject({ method: 'GET', url: '/help/embed/p_default/order.create' });
      expect(page.body).toContain('War das hilfreich?');
      expect(page.body).toContain('action="/help/embed/p_default/order.create/feedback"');
      expect(page.body).not.toMatch(/<script/i);
      expect((await form('/help/embed/p_default/order.create/feedback', 'helpful=vielleicht')).statusCode).toBe(400);
      const sent = await form('/help/embed/p_default/order.create/feedback', `helpful=0&comment=${encodeURIComponent('Wo ist das Menü Verkauf?')}`);
      expect(sent.statusCode).toBe(200);
      expect(sent.body).toContain('Danke für Ihre Rückmeldung.');
      // Honigtopf: freundlich bestätigt, nicht gespeichert
      expect((await form('/help/embed/p_default/order.create/feedback', 'helpful=1&website=spam')).body).toContain('Danke');
      const list = (await call('GET', '/feedback')).json;
      expect(list).toHaveLength(1);
      expect(list[0]).toMatchObject({ chapterId: chapter.id, helpful: false, comment: 'Wo ist das Menü Verkauf?', source: 'online-help', createdBy: 'online-hilfe' });
      expect(list[0].versionId).toBeTruthy();
      // Grenze je Adresse und Stunde (Standard 10; zwei schon verbraucht)
      for (let i = 0; i < 8; i++) expect((await form('/help/embed/p_default/order.create/feedback', 'helpful=1')).statusCode).toBe(200);
      const limited = await form('/help/embed/p_default/order.create/feedback', 'helpful=1');
      expect(limited.statusCode).toBe(429);
      expect(limited.body).toContain('Zu viele Rückmeldungen');
      expect((await call('GET', '/feedback/insights')).json.chapters[0]).toMatchObject({ online: 9, total: 9 });
    } finally {
      await built.app.close();
    }
  });
});
