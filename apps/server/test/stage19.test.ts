import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { CHAPTER_TEMPLATES } from '../src/domain/chapterTemplates.js';
import { analyzeGuidance } from '../src/domain/guidance.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const fm = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';

describe('Etappe 19', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
  } as any));
  const assistantChapter = (call: ReturnType<typeof client>, title: string, extra: Record<string, unknown> = {}) => call('POST', '/chapter-assistant', {
    title, purpose: 'Mit dieser Anleitung legen Sie einen Auftrag an.', prerequisites: ['Sie haben die Berechtigung Einkauf'],
    steps: ['Öffnen Sie **Einkauf > Aufträge**', 'Klicken Sie auf **Neu**'], result: 'Der Auftrag ist gespeichert.', ...extra,
  }, 'u-redaktion');

  it('[T-189] Leser-Rückmeldungen: abgeben (eine je Person und Version), Aufgabe für die Redaktion, Übersicht, erledigen', async () => {
    const built = await build('feedback');
    const call = client(built);
    try {
      const { chapterId, versionId } = (await assistantChapter(call, 'Auftrag anlegen')).json;
      expect((await call('POST', `/chapters/${chapterId}/feedback`, { helpful: 'ja' }, 'u-leser')).status).toBe(400);
      expect((await call('POST', '/chapters/ch_fremd/feedback', { helpful: true }, 'u-leser')).status).toBe(404);
      expect((await call('POST', `/chapters/${chapterId}/feedback`, { helpful: true, versionId: 'cv_x' }, 'u-leser')).status).toBe(400);
      // Leser dürfen abstimmen; zweite Stimme derselben Person ersetzt die erste
      expect((await call('POST', `/chapters/${chapterId}/feedback`, { helpful: true, versionId }, 'u-leser')).status).toBe(201);
      const fb = (await call('POST', `/chapters/${chapterId}/feedback`, { helpful: false, versionId, comment: 'Schritt 2 fehlt: Lieferant wählen' }, 'u-leser')).json;
      expect(fb).toMatchObject({ helpful: false, status: 'open', title: 'Auftrag anlegen' });
      await call('POST', `/chapters/${chapterId}/feedback`, { helpful: true, versionId }, 'u-freigabe');
      expect((await call('GET', '/feedback/summary')).json).toEqual([{ chapterId, helpful: 1, notHelpful: 1, open: 1 }]);
      // Kritik → Hinweis an die Autorin/den Autor der Version
      const inbox = (await call('GET', '/notifications', undefined, 'u-redaktion')).json;
      expect(inbox.items.some((n: any) => n.type === 'feedback' && n.text.includes('Schritt 2 fehlt'))).toBe(true);
      // erledigen: nur mit Bearbeitungsrecht
      expect((await call('PATCH', `/feedback/${fb.id}`, { status: 'done' }, 'u-leser')).status).toBe(403);
      expect((await call('PATCH', `/feedback/${fb.id}`, { status: 'done' }, 'u-redaktion')).json).toMatchObject({ status: 'done', handledBy: 'u-redaktion' });
      expect((await call('GET', '/feedback?status=open')).json).toHaveLength(1);
      expect((await call('GET', '/feedback/summary')).json[0].open).toBe(0);
      expect((await call('PATCH', '/feedback/fb_fremd', { status: 'done' }, 'u-redaktion')).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });

  it('[T-190] Kapitelvorlagen: je Aufgabentyp, Platzhalter „…“ werden im Anleitungs-Check gemeldet', async () => {
    expect(CHAPTER_TEMPLATES.map((t) => t.id)).toEqual(['create', 'approve', 'search', 'change', 'troubleshoot', 'export']);
    for (const t of CHAPTER_TEMPLATES) expect(t.steps.length).toBeGreaterThanOrEqual(3);
    const a = analyzeGuidance([{ id: 'b', section: 'steps', kind: 'list', text: '1. Öffnen Sie **… › …**.\n2. Klicken Sie auf **Neu**.', versionNo: 1 }]);
    expect(a.checks.find((c) => c.code === 'placeholders')).toMatchObject({ status: 'warning', items: [{ blockId: 'b' }] });
    const built = await build('templates');
    const call = client(built);
    try {
      const list = (await call('GET', '/chapter-assistant/templates', undefined, 'u-leser')).json;
      expect(list.find((t: any) => t.id === 'approve')).toMatchObject({ name: 'Prüfen und genehmigen' });
      const t = list.find((x: any) => x.id === 'create');
      const r = (await call('POST', '/chapter-assistant', { title: 'Kunde anlegen', purpose: t.purpose, prerequisites: t.prerequisites, steps: t.steps, result: t.result, hints: t.hints }, 'u-redaktion')).json;
      const ph = r.guidance.checks.find((c: any) => c.code === 'placeholders');
      expect(ph.status).toBe('warning');
      expect(ph.items.length).toBeGreaterThanOrEqual(3);
      expect(r.guidance.total).toBe(11);
    } finally {
      await built.app.close();
    }
  });

  it('[T-191] Anleitungs-Check als Freigabebedingung: Mindestwert je Projekt, Gate beim Einreichen und Freigeben', async () => {
    const built = await build('gate');
    const call = client(built);
    try {
      await importFile(built, 'x.md', `${fm}# 1. Nebenkapitel\n\nKlicken Sie auf **Speichern**.\n`);
      const good = (await assistantChapter(call, 'Auftrag anlegen')).json;
      const weak = (await call('POST', '/chapter-assistant', { title: 'Schwach', purpose: 'Zweck …', steps: ['Öffnen Sie …'] }, 'u-redaktion')).json;
      expect((await call('GET', '/guidance/settings', undefined, 'u-leser')).json).toEqual({ minScore: null });
      // ohne Mindestwert: kein zusätzlicher Gate-Punkt
      expect((await call('GET', `/chapter-versions/${weak.versionId}/gate`)).json.checks.some((c: any) => c.code === 'guidance_min_score')).toBe(false);
      expect((await call('PUT', '/guidance/settings', { minScore: 80 }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/guidance/settings', { minScore: 101 })).status).toBe(400);
      expect((await call('PUT', '/guidance/settings', { minScore: 80 })).json).toEqual({ minScore: 80 });
      const gate = (await call('GET', `/chapter-versions/${weak.versionId}/gate`)).json;
      const chk = gate.checks.find((c: any) => c.code === 'guidance_min_score');
      expect(chk).toMatchObject({ passed: false });
      expect(chk.label).toMatch(/mindestens 80 von 100 \(aktuell \d+\)/);
      expect(chk.details).toContain('! Platzhalter „…“ offen');
      expect(gate.passed).toBe(false);
      const sub = await call('POST', `/chapter-versions/${weak.versionId}/submit`, {}, 'u-redaktion');
      expect(sub.status).toBe(409);
      // gutes Kapitel: einreichen und freigeben
      expect((await call('GET', `/chapter-versions/${good.versionId}/gate`)).json.checks.find((c: any) => c.code === 'guidance_min_score').passed).toBe(true);
      expect((await call('POST', `/chapter-versions/${good.versionId}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${good.versionId}/approve`, { comment: 'ok' }, 'u-freigabe')).json.status).toBe('approved');
      await call('PUT', '/guidance/settings', { minScore: null });
      expect((await call('GET', `/chapter-versions/${weak.versionId}/gate`)).json.checks.some((c: any) => c.code === 'guidance_min_score')).toBe(false);
    } finally {
      await built.app.close();
    }
  });
});
