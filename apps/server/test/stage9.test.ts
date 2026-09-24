import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { freshDatabase, tempDir } from './helpers.js';
import { client, FM, importFile } from './api-helpers.js';

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
