import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { isoWeek, runDigests, sendDigests } from '../src/services/digest.js';
import { withProject } from '../src/services/projects.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 21', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
  } as any));
  const assistant = (call: ReturnType<typeof client>, title: string) => call('POST', '/chapter-assistant', {
    title, purpose: 'Mit dieser Anleitung legen Sie einen Auftrag an.', steps: ['Öffnen Sie **Einkauf > Aufträge**', 'Klicken Sie auf **Neu**'], result: 'Der Auftrag ist gespeichert.',
  }, 'u-redaktion');

  it('[T-195] Eigene Vorlage vollständig bearbeiten: Zweck, Voraussetzungen, Schritte, Ergebnis, Tipps, Titelvorschlag', async () => {
    const built = await build('tpl-edit');
    const call = client(built);
    try {
      const t = (await call('POST', '/chapter-templates', { name: 'Bestellung', steps: ['Öffnen Sie **…**'] }, 'u-redaktion')).json;
      const u = await call('PATCH', `/chapter-templates/${t.id}`, {
        description: 'Bestellung im Einkauf', titleHint: '… bestellen', purpose: 'Mit dieser Anleitung bestellen Sie ….',
        prerequisites: ['Sie haben die Berechtigung „…“'], steps: ['Öffnen Sie **Einkauf › Bestellungen**', 'Klicken Sie auf **Neu**', 'Wählen Sie den Lieferanten …'],
        result: 'Die Bestellung ist angelegt.', hints: ['Eilbestellungen kennzeichnen Sie mit …'],
      }, 'u-redaktion');
      expect(u.status).toBe(200);
      expect(u.json).toMatchObject({ description: 'Bestellung im Einkauf', titleHint: '… bestellen', prerequisites: ['Sie haben die Berechtigung „…“'], result: 'Die Bestellung ist angelegt.', hints: ['Eilbestellungen kennzeichnen Sie mit …'] });
      expect(u.json.steps).toHaveLength(3);
      // leere Liste bei Voraussetzungen erlaubt, bei Schritten nicht
      expect((await call('PATCH', `/chapter-templates/${t.id}`, { prerequisites: [] }, 'u-redaktion')).json.prerequisites).toEqual([]);
      expect((await call('PATCH', `/chapter-templates/${t.id}`, { steps: [] }, 'u-redaktion')).status).toBe(400);
      expect((await call('PATCH', `/chapter-templates/${t.id}`, { steps: 'kein Array' }, 'u-redaktion')).status).toBe(400);
      expect((await call('PATCH', `/chapter-templates/${t.id}`, { result: 'x' }, 'u-leser')).status).toBe(403);
      const listed = (await call('GET', '/chapter-assistant/templates')).json.find((x: any) => x.id === t.id);
      expect(listed).toMatchObject({ titleHint: '… bestellen', builtin: false });
    } finally {
      await built.app.close();
    }
  });

  it('[T-196] Wöchentliche Übersicht: Inhalt je Person, einmal je Woche, Wochentag einstellbar, nur mit Bearbeitungsrecht', async () => {
    expect(isoWeek(new Date('2026-09-28T08:00:00Z'))).toBe('2026-W40');
    expect(isoWeek(new Date('2027-01-01T08:00:00Z'))).toBe('2026-W53');
    const built = await build('digest');
    const call = client(built);
    try {
      expect((await call('GET', '/digest/settings', undefined, 'u-leser')).json).toMatchObject({ weekday: 1, lastWeek: null });
      expect((await call('PUT', '/digest/settings', { weekday: 3 }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/digest/settings', { weekday: 8 })).status).toBe(400);
      expect((await call('PUT', '/digest/settings', { weekday: 3 })).json.weekday).toBe(3);
      // leer: nichts zu tun → keine Nachricht
      expect((await call('GET', '/digest/preview', undefined, 'u-redaktion')).json).toMatchObject({ empty: true, text: null });
      // eine leere Übersicht sperrt die Woche nicht (später in derselben Woche wird trotzdem gesendet)
      await sendDigests(withProject(built.ctx, 'p_default'), { force: true, date: new Date('2026-09-30T08:00:00Z') });
      expect(await built.ctx.db.get("SELECT 1 FROM digest_log WHERE user_id = 'u-redaktion'")).toBeFalsy();
      // Inhalte: offene Kritik, Aufgabe, Kapitel mit offenen Pflichtpunkten
      const a = (await assistant(call, 'Auftrag anlegen')).json;
      await call('POST', `/chapters/${a.chapterId}/feedback`, { helpful: false, versionId: a.versionId, comment: 'Lieferant fehlt' }, 'u-leser');
      await call('POST', '/comments', { entityType: 'chapter', entityId: a.chapterId, kind: 'task', body: 'Bitte ergänzen', assignee: 'u-redaktion', dueDate: '2020-01-01' }, 'u-fachpruefung');
      await call('POST', '/chapter-assistant', { title: 'Schwach', purpose: 'Zweck …', steps: ['Öffnen Sie …'] }, 'u-redaktion');
      const p = (await call('GET', '/digest/preview', undefined, 'u-redaktion')).json;
      expect(p).toMatchObject({ empty: false, openFeedback: 1, tasks: 1, overdueTasks: 1, feedbackByChapter: [{ title: 'Auftrag anlegen', open: 1 }] });
      expect(p.weakChapters.map((c: any) => c.title)).toContain('Schwach');
      expect(p.text).toContain('1 offene Leser-Rückmeldung (Auftrag anlegen: 1)');
      expect(p.text).toContain('1 offene Aufgabe für Sie, davon 1 überfällig');
      // falscher Wochentag: nichts; richtiger Wochentag (Mittwoch): an alle mit Bearbeitungsrecht, einmal je Woche
      const ctx = built.ctx;
      expect((await sendDigests(withProject(ctx, 'p_default'), { date: new Date('2026-09-28T08:00:00Z') })).sent).toBe(0);
      const wednesday = new Date('2026-09-30T08:00:00Z');
      const first = await sendDigests(withProject(ctx, 'p_default'), { date: wednesday });
      expect(first.sent).toBeGreaterThanOrEqual(3);
      expect((await sendDigests(withProject(ctx, 'p_default'), { date: wednesday })).sent).toBe(0);
      const inbox = (await call('GET', '/notifications', undefined, 'u-redaktion')).json.items.filter((n: any) => n.type === 'digest');
      expect(inbox).toHaveLength(1);
      expect(inbox[0]).toMatchObject({ link: '/rueckmeldungen' });
      expect(inbox[0].text).toMatch(/^Wochenübersicht 2026-W40: /);
      expect((await call('GET', '/notifications', undefined, 'u-leser')).json.items.some((n: any) => n.type === 'digest')).toBe(false);
      // „Jetzt senden“ (nur Administration) – in derselben Woche schon versandt
      expect((await call('POST', '/digest/send', {}, 'u-redaktion')).status).toBe(403);
      expect((await call('POST', '/digest/send', {})).status).toBe(200);
      // aus: Job versendet nichts
      await call('PUT', '/digest/settings', { weekday: null });
      expect(await runDigests(ctx, (id) => withProject(ctx, id))).toBe(0);
      expect((await call('GET', '/digest/settings')).json.lastWeek).toBeTruthy();
    } finally {
      await built.app.close();
    }
  });
});
