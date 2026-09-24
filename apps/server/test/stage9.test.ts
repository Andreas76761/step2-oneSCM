import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { freshDatabase, tempDir, TEST_PG } from './helpers.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';

describe('Mehrstufige Freigabe (ADR-025)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-149] Stufen mit Zuständigkeit, Vier-Augen-Prinzip, Schnappschuss, Ablehnung, Frist und Eskalation, offene Entscheidungen', async () => {
    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'workflow'), logger: false, webDist: null, authMode: 'demo' });
    const call = client(built);
    try {
      await importFile(built, 'w.md', `${FM}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDieses Kapitel beschreibt die Anmeldung.\n`);
      const ch = (await call('GET', '/chapters')).json.find((c: any) => c.title === '1. Anmeldung');
      const newVersion = async () => {
        const v = (await call('POST', `/chapters/${ch.id}/generate`, {}, 'u-redaktion')).json;
        for (const b of v.sections.flatMap((s: any) => s.blocks)) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
        return v;
      };

      // Standard: einstufig (E-12)
      expect((await call('GET', '/approval-workflow')).json).toMatchObject({ configured: false, fourEyes: false, stages: [{ key: 'freigabe', minApprovals: 1 }] });
      // Validierung und Berechtigung
      const stages = [
        { name: 'Fachprüfung', approvers: ['u-freigabe'], minApprovals: 1, dueDays: 2 },
        { name: 'Compliance', approvers: [], minApprovals: 1 },
      ];
      expect((await call('PUT', '/approval-workflow', { stages }, 'u-freigabe')).status).toBe(403);
      expect((await call('PUT', '/approval-workflow', { stages: [{ name: 'X', approvers: ['u-leser'] }] })).status).toBe(400);
      expect((await call('PUT', '/approval-workflow', { stages: [{ name: 'X', approvers: ['u-freigabe'], minApprovals: 2 }] })).status).toBe(400);
      expect((await call('PUT', '/approval-workflow', { stages: [{ name: 'X', dueDays: 0 }] })).status).toBe(400);
      const wf = (await call('PUT', '/approval-workflow', { stages })).json;
      expect(wf).toMatchObject({ configured: true, fourEyes: true, stages: [{ key: 'fachprufung', name: 'Fachprüfung' }, { key: 'compliance' }] });

      // Einreichen: Stufe 1, Frist, Hinweis an die Freigebenden der Stufe
      let v = await newVersion();
      expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
      v = (await call('GET', `/chapter-versions/${v.id}`)).json;
      expect(v.workflow).toMatchObject({ currentStage: 0, overdue: false, stages: [{ status: 'active' }, { status: 'pending' }] });
      expect(new Date(v.workflow.dueAt).getTime()).toBeGreaterThan(Date.now() + 47 * 3_600_000);
      expect((await call('GET', '/notifications', undefined, 'u-freigabe')).json.items.some((n: any) => n.type === 'approval' && n.text.includes('Fachprüfung'))).toBe(true);
      expect((await call('GET', '/approvals/pending', undefined, 'u-freigabe')).json).toEqual([expect.objectContaining({ versionId: v.id, stage: 'Fachprüfung', stageIndex: 0, stages: 2 })]);
      expect((await call('GET', '/approvals/pending', undefined, 'u-admin')).json).toEqual([]); // nicht in Stufe 1 zuständig

      // Workflow-Änderung während der Prüfung betrifft die laufende Einreichung nicht
      await call('PUT', '/approval-workflow', { stages: [{ name: 'Nur eine', approvers: [] }] });

      // Stufe 1: nur u-freigabe; danach Stufe 2
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-admin')).status).toBe(403);
      const s1 = (await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'fachlich ok' }, 'u-freigabe')).json;
      expect(s1.status).toBe('in_review');
      expect(s1.workflow).toMatchObject({ currentStage: 1, stages: [{ status: 'done', votes: [{ approver: 'u-freigabe' }] }, { status: 'active' }] });
      expect((await call('GET', '/approvals/pending', undefined, 'u-admin')).json.map((p: any) => p.stage)).toEqual(['Compliance']);
      // Vier-Augen: dieselbe Person stimmt nicht in zwei Stufen zu
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'nochmal' }, 'u-freigabe')).status).toBe(409);
      const done = (await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'compliance ok' }, 'u-admin')).json;
      expect(done.status).toBe('approved');
      expect(done.approvals.map((a: any) => [a.approver, a.stage, a.final])).toEqual([['u-freigabe', 'fachprufung', false], ['u-admin', 'compliance', true]]);
      expect(done.workflow.stages.map((s: any) => s.status)).toEqual(['done', 'done']);
      // Analytik zählt nur abschließende Entscheidungen
      expect((await call('GET', '/analytics')).json.approvals).toMatchObject({ decisions: 1, approved: 1, firstPassRate: 100 });

      // neuer Workflow (eine Stufe, alle mit approve): Einreichende Person darf nicht selbst freigeben; Ablehnung benachrichtigt
      v = await newVersion();
      await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-admin');
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'selbst' }, 'u-admin')).status).toBe(403);
      const rej = (await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'Screenshots fehlen', decision: 'rejected' }, 'u-freigabe')).json;
      expect(rej).toMatchObject({ status: 'draft', workflow: null });
      expect((await call('GET', '/notifications', undefined, 'u-admin')).json.items.some((n: any) => n.text.includes('Abgelehnt in Freigabestufe „Nur eine“'))).toBe(true);

      // Frist überschritten → einmalige Eskalation an Freigebende und Administration
      await call('PUT', '/approval-workflow', { stages });
      await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion');
      await built.ctx.db.run('UPDATE generated_chapter_versions SET stage_due_at = ? WHERE id = ?', '2020-01-01T00:00:00.000Z', v.id);
      expect((await call('GET', `/chapter-versions/${v.id}`)).json.workflow.overdue).toBe(true);
      const { escalateOverdue } = await import('../src/services/workflow.js');
      const { withProject } = await import('../src/services/projects.js');
      expect(await escalateOverdue(built.ctx, (id) => withProject(built.ctx, id))).toBe(1);
      expect(await escalateOverdue(built.ctx, (id) => withProject(built.ctx, id))).toBe(0);
      for (const u of ['u-freigabe', 'u-admin']) {
        expect((await call('GET', '/notifications', undefined, u)).json.items.filter((n: any) => n.type === 'escalation')).toHaveLength(1);
      }
      expect((await call('GET', `/chapter-versions/${v.id}`)).json.workflow.escalatedAt).toBeTruthy();
      // Zurückziehen setzt den Workflow zurück
      expect((await call('POST', `/chapter-versions/${v.id}/withdraw`, { reason: 'x' }, 'u-redaktion')).json).toMatchObject({ status: 'draft', workflow: null });
      // leere Stufenliste: wieder einstufig
      expect((await call('PUT', '/approval-workflow', { stages: [] })).json).toMatchObject({ configured: false });
      const audit = await built.ctx.db.all("SELECT action FROM audit_events WHERE action LIKE 'chapter_version.%' OR action = 'project.approval_workflow'");
      expect(audit.map((a: any) => a.action)).toEqual(expect.arrayContaining(['project.approval_workflow', 'chapter_version.stage_completed', 'chapter_version.escalated']));
    } finally {
      await built.app.close();
    }
  });
});

describe('Handbuch-Assistent (ADR-026)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-150] Antworten nur aus freigegebenen Absätzen mit Quellen je Satz, Rolle/Sprache, Prüfung der KI-Antwort, Bewertung und Wissenslücken', async () => {
    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'assistant'), logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } });
    const call = client(built);
    const ctx = built.ctx as any;
    const demo = ctx.llm;
    try {
      await importFile(built, 'a.md', `${FM}# 1. Anmeldung\n\n## 1.1 Zweck\n\nMit der Anmeldung öffnen Sie oneSCM im Browser. Das Kennwort muss 12 Zeichen haben.\n\n# 2. Aufträge\n\n## 2.1 Zweck\n\nAufträge legen Sie über das Menü Verkauf an.\n`);
      await importFile(built, 'h.md', `---\nroles: [dealer]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n# 3. Händlerbonus\n\n## 3.1 Zweck\n\nDer Händlerbonus wird quartalsweise berechnet.\n`);
      await importFile(built, 'e.md', `${FM}# 4. Entwurf\n\n## 4.1 Zweck\n\nDer Geheimtext steht nur im Entwurf.\n`);
      const chapters = (await call('GET', '/chapters')).json;
      const byTitle = (t: string) => chapters.find((c: any) => c.title === t);
      for (const t of ['1. Anmeldung', '2. Aufträge', '3. Händlerbonus']) await approveChapter(call, byTitle(t).id);
      await call('POST', `/chapters/${byTitle('4. Entwurf').id}/generate`, {}, 'u-redaktion'); // nicht freigegeben

      // ohne KI: extraktive Antwort mit Quelle
      ctx.llm = null;
      let r = (await call('POST', '/assistant/ask', { question: 'Wie viele Zeichen muss das Kennwort haben?' }, 'u-leser')).json;
      expect(r).toMatchObject({ mode: 'extractive', notice: null });
      expect(r.answer[0]).toEqual({ text: 'Das Kennwort muss 12 Zeichen haben.', sources: [1] });
      expect(r.sources[0]).toMatchObject({ n: 1, chapter: '1. Anmeldung', section: 'purpose', sectionTitle: 'Zweck', link: `/werkstatt/${byTitle('1. Anmeldung').id}` });
      // nicht freigegebene Inhalte sind nie Grundlage
      r = (await call('POST', '/assistant/ask', { question: 'Wo steht der Geheimtext?' })).json;
      expect(r).toMatchObject({ mode: 'none', answer: [], sources: [], notice: 'Das freigegebene Handbuch enthält dazu keine Aussage.' });
      // Rolle: Händlerbonus nur für Händler
      expect((await call('POST', '/assistant/ask', { question: 'Wie wird der Händlerbonus berechnet?', role: 'dealer' })).json.answer[0].text).toContain('quartalsweise');
      expect((await call('POST', '/assistant/ask', { question: 'Wie wird der Händlerbonus berechnet?', role: 'hq' })).json.answer.some((s: any) => s.text.includes('quartalsweise'))).toBe(false);

      // mit KI (Demo): Antwort mit Quellen je Satz
      ctx.llm = demo;
      r = (await call('POST', '/assistant/ask', { question: 'Wie lege ich Aufträge an?' })).json;
      expect(r.mode).toBe('llm');
      expect(r.answer[0]).toEqual({ text: 'Aufträge legen Sie über das Menü Verkauf an.', sources: [1] });
      // KI-Antwort ohne Beleg wird verworfen → Handbuchstellen
      ctx.llm = { id: 'openai', model: 'fake', external: false, complete: async () => ({ text: JSON.stringify({ sentences: [{ text: 'Drücken Sie 42-mal F5.', sources: ['P1'] }, { text: 'Rufen Sie den Support an.', sources: ['P9'] }] }) }) };
      r = (await call('POST', '/assistant/ask', { question: 'Wie lege ich Aufträge an?' })).json;
      expect(r).toMatchObject({ mode: 'extractive', dropped: 2 });
      expect(r.notice).toContain('nicht durch das Handbuch belegt');
      expect(r.answer[0].text).toContain('Menü Verkauf');
      // KI: keine Aussage im Handbuch
      ctx.llm = { id: 'openai', model: 'fake', external: false, complete: async () => ({ text: '{"sentences":[]}' }) };
      r = (await call('POST', '/assistant/ask', { question: 'Wie lege ich Aufträge an?' })).json;
      expect(r).toMatchObject({ mode: 'llm', answer: [], notice: 'Das freigegebene Handbuch enthält dazu keine eindeutige Aussage.' });
      // Datenschutz bei externem Dienst
      ctx.llm = { ...ctx.llm, external: true };
      expect((await call('POST', '/assistant/ask', { question: 'Was gilt für max.mustermann@autohaus-muster.de?' })).status).toBe(422);
      ctx.llm = demo;

      // Sprache: freigegebene Übersetzung
      await call('PATCH', '/projects/p_default', { languages: ['en'] });
      const tr = (await call('POST', '/translations', { chapterId: byTitle('2. Aufträge').id, language: 'en' }, 'u-redaktion')).json;
      await call('POST', `/translations/${tr.id}/machine`, {}, 'u-redaktion');
      await built.ctx.jobs.idle();
      expect((await call('POST', `/translations/${tr.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      r = (await call('POST', '/assistant/ask', { question: 'Menü Verkauf', language: 'en' })).json;
      expect(r.answer[0].text).toContain('[EN]');
      expect(r.sources.every((s: any) => s.chapter !== '1. Anmeldung')).toBe(true); // nicht übersetzte Kapitel fehlen

      // Validierung
      expect((await call('POST', '/assistant/ask', { question: 'x' })).status).toBe(400);
      expect((await call('POST', '/assistant/ask', { question: 'Wie?', language: 'fr' })).status).toBe(400);
      expect((await call('POST', '/assistant/ask', { question: 'Wie?', role: 'chef' })).status).toBe(400);

      // Bewertung und Wissenslücken
      const asked = (await call('POST', '/assistant/ask', { question: 'Wie lege ich Aufträge an?' }, 'u-redaktion')).json;
      expect((await call('POST', `/assistant/answers/${asked.id}/feedback`, { helpful: false }, 'u-admin')).status).toBe(400);
      expect((await call('POST', `/assistant/answers/${asked.id}/feedback`, { helpful: false, comment: 'zu knapp' }, 'u-redaktion')).json).toEqual({ id: asked.id, rating: -1 });
      expect((await call('GET', '/assistant/open-questions', undefined, 'u-leser')).status).toBe(403);
      const open = (await call('GET', '/assistant/open-questions', undefined, 'u-redaktion')).json;
      expect(open.items.map((i: any) => i.question)).toEqual(expect.arrayContaining(['Wo steht der Geheimtext?', 'Wie lege ich Aufträge an?']));
      expect(open.stats.unhelpful).toBe(1);
      const other = (await call('POST', '/projects', { name: 'Anderes' })).json;
      expect((await call('POST', `/assistant/answers/${asked.id}/feedback`, { helpful: true }, 'u-admin', other.id)).status).toBe(404);
      expect((await call('POST', '/assistant/ask', { question: 'Wie lege ich Aufträge an?' }, 'u-admin', other.id)).json.answer).toEqual([]);
      // Online-Hilfe verlinkt den Assistenten (ohne Skripte), wenn APP_URL gesetzt ist
      ctx.config.notify.appUrl = 'https://handbuch.example.org/';
      const rel = (await call('POST', '/releases', { version: '2026.11' }, 'u-freigabe')).json;
      const JSZip = (await import('jszip')).default;
      const zip = await JSZip.loadAsync((await call('GET', `/releases/${rel.id}/download?format=site`)).raw);
      expect(await zip.file('index.html')!.async('string')).toContain('<a href="https://handbuch.example.org/assistent?language=de">Frage an den Handbuch-Assistenten</a>');
      expect(await zip.file('en/index.html')!.async('string')).toContain('assistent?language=en">Ask the manual assistant</a>');
    } finally {
      await built.app.close();
    }
  });
});

describe('Betrieb über mehrere Instanzen (ADR-027)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-151] Gleichzeitiger Start mehrerer Instanzen (Migrationen gesperrt), Rate-Limits gemeinsam über Instanzen (RATE_LIMIT_STORE=db), je Instanz im Speicher', async () => {
    const database = await freshDatabase(dataDir, 'ratelimit');
    if (TEST_PG) {
      // zwei Replikate starten gleichzeitig auf leerer Datenbank: Migrationen laufen genau einmal
      const [x, y] = await Promise.all([0, 1].map(() => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' }, { worker: false })));
      const applied = await x.ctx.db.all<{ name: string }>('SELECT name FROM schema_migrations');
      expect(new Set(applied.map((r) => r.name)).size).toBe(applied.length);
      await x.app.close();
      await y.app.close();
    }
    const ops = (store: 'db' | 'memory') => ({ metricsToken: null, rateLimitMax: 3, rateLimitExpensiveMax: 1, rateLimitStore: store });
    for (const store of ['db', 'memory'] as const) {
      if (store === 'memory') await closeAll();
      const a = await buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', ops: ops(store) });
      const b = await buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', ops: ops(store) }, { worker: false });
      open.push(a, b);
      const user = `u-${store}`; // eigener Schlüssel je Durchlauf
      await a.ctx.db.run("INSERT INTO users (id, name, permissions) VALUES (?, ?, '[\"read\"]') ON CONFLICT (id) DO NOTHING", user, user);
      const get = (x: typeof a) => x.app.inject({ method: 'GET', url: '/api/v1/me', headers: { 'x-user-id': user } });
      const codes = [(await get(a)).statusCode, (await get(a)).statusCode, (await get(b)).statusCode, (await get(b)).statusCode];
      if (store === 'db') {
        expect(codes).toEqual([200, 200, 200, 429]); // vierte Anfrage über beide Instanzen hinweg
        const limited = await get(a);
        expect(limited.statusCode).toBe(429);
        expect(Number(limited.headers['retry-after'])).toBeGreaterThan(0);
        expect(Number((await a.ctx.db.get<{ count: number }>('SELECT count FROM rate_limits WHERE key = ?', `n:${user}`))!.count)).toBe(5);
      } else {
        expect(codes).toEqual([200, 200, 200, 200]); // Zähler je Instanz
      }
    }
    await closeAll();
  });
  const open: Awaited<ReturnType<typeof buildApp>>[] = [];
  async function closeAll() {
    while (open.length) await open.pop()!.app.close();
  }
});
