// Export, Traceability, Einstellungen, Referenzdaten, Dashboard, Audit (US-010, US-012, US-013, US-014, US-020)
import type { FastifyInstance } from 'fastify';
import { audit, getSettings, saveSettings, type Ctx } from '../context.js';
import { parseJson } from '../db.js';
import { RULE_LABELS } from '../domain/contradictions.js';
import {
  BLOCK_MODES, CHAPTER_SECTIONS, DECISIONS, DIVISIONS, EVIDENCE_STATUSES, FINDING_TYPES, PERMISSIONS, ROLES, SEVERITIES,
} from '../domain/reference.js';
import { badRequest } from '../problem.js';
import { createExport, downloadExport, listExports } from '../services/exports.js';
import { buildMatrix, matrixCsv, matrixMarkdown, matrixXlsx } from '../services/traceability.js';
import { list, userOf } from './helpers.js';

export function miscRoutes(app: FastifyInstance, ctx: Ctx) {
  app.post<{ Body: any }>('/exports', async (req, reply) => {
    const user = userOf(ctx, req, 'read');
    const b = (req.body ?? {}) as any;
    reply.code(201);
    return createExport(ctx, { chapterIds: list(b.chapterIds), roles: list(b.roles), divisions: list(b.divisions), market: b.market || null, release: b.release || null, format: b.format }, user.id);
  });
  app.get('/exports', async (req) => (userOf(ctx, req), listExports(ctx)));
  app.get<{ Params: { exportId: string } }>('/exports/:exportId/download', async (req, reply) => {
    userOf(ctx, req);
    const f = await downloadExport(ctx, req.params.exportId);
    reply.header('Content-Type', f.format === 'md' ? 'text/markdown; charset=utf-8' : 'application/json').header('Content-Disposition', `attachment; filename="${f.fileName}"`);
    return f.data;
  });

  app.get<{ Querystring: { format?: string } }>('/traceability', async (req, reply) => {
    userOf(ctx, req);
    const m = buildMatrix(ctx);
    switch (req.query.format ?? 'json') {
      case 'json':
        return m;
      case 'csv':
        reply.header('Content-Type', 'text/csv; charset=utf-8').header('Content-Disposition', 'attachment; filename="traceability.csv"');
        return matrixCsv(m.rows);
      case 'md':
        reply.header('Content-Type', 'text/markdown; charset=utf-8').header('Content-Disposition', 'attachment; filename="traceability.md"');
        return matrixMarkdown(m.rows, m.release, m.issues);
      case 'xlsx':
        reply.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet').header('Content-Disposition', 'attachment; filename="traceability.xlsx"');
        return matrixXlsx(m.rows, m.operations);
      default:
        throw badRequest('format muss json, csv, md oder xlsx sein.');
    }
  });

  app.get('/settings', async (req) => (userOf(ctx, req), getSettings(ctx.db)));
  app.put<{ Body: any }>('/settings', async (req) => {
    const user = userOf(ctx, req, 'admin');
    const body = (req.body ?? {}) as any;
    const a = body.analysis;
    if (a) {
      for (const k of ['clusterThreshold', 'duplicateThreshold', 'contradictionThreshold']) {
        if (a[k] !== undefined && (typeof a[k] !== 'number' || a[k] < 0.05 || a[k] > 1)) throw badRequest(`analysis.${k} muss eine Zahl zwischen 0,05 und 1 sein.`);
      }
    }
    await saveSettings(ctx.db, body);
    await audit(ctx.db, user.id, 'settings.updated', 'settings', 'project', body);
    return getSettings(ctx.db);
  });

  app.get('/reference', async (req) => {
    userOf(ctx, req);
    return {
      roles: ROLES, divisions: DIVISIONS, evidenceStatuses: EVIDENCE_STATUSES, findingTypes: FINDING_TYPES, severities: SEVERITIES, decisions: DECISIONS,
      sections: CHAPTER_SECTIONS, blockModes: BLOCK_MODES, permissions: PERMISSIONS, contradictionRules: RULE_LABELS,
      markets: await ctx.db.all('SELECT code, label FROM markets ORDER BY code'), releases: await ctx.db.all('SELECT code, label FROM release_scopes ORDER BY code'),
      // Benutzerliste (für die Demo-Auswahl) nur im Demo-Modus
      users: ctx.config.authMode === 'demo'
        ? (await ctx.db.all("SELECT id, name, permissions FROM users WHERE id LIKE 'u-%' ORDER BY name")).map((u) => ({ ...u, permissions: parseJson(u.permissions, []) }))
        : [],
    };
  });
  app.get('/me', async (req) => userOf(ctx, req));

  // Öffentlich: Anmeldekonfiguration für die Web-UI (ENTSCHEIDUNG E-15)
  app.get('/auth/config', async () =>
    ctx.config.authMode === 'oidc'
      ? { mode: 'oidc', issuer: ctx.config.oidc!.issuer, clientId: ctx.config.oidc!.clientId, scope: ctx.config.oidc!.scope, audience: ctx.config.oidc!.audience }
      : { mode: 'demo' },
  );

  app.get('/dashboard', async (req) => {
    userOf(ctx, req);
    const { db } = ctx;
    const one = async (sql: string, ...p: unknown[]) => (await db.get<{ n: number }>(sql, ...p))?.n ?? 0;
    const snippets = await one('SELECT COUNT(*) AS n FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id WHERE r.is_current = 1');
    const byType = await db.all("SELECT type, severity, COUNT(*) AS n FROM quality_findings WHERE status IN ('open','deferred') GROUP BY type, severity");
    return {
      sources: await one('SELECT COUNT(*) AS n FROM source_documents'),
      revisions: await one('SELECT COUNT(*) AS n FROM source_revisions'),
      imports: await one('SELECT COUNT(*) AS n FROM imports'),
      chapters: await one('SELECT COUNT(*) AS n FROM chapters'),
      snippets,
      confirmedSnippets: await one("SELECT COUNT(*) AS n FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id WHERE r.is_current = 1 AND s.evidence_status IN ('source_confirmed','manually_confirmed')"),
      openFindings: byType,
      clusters: await one("SELECT COUNT(*) AS n FROM semantic_clusters WHERE status <> 'dissolved'"),
      canonicalTopics: await one('SELECT COUNT(*) AS n FROM canonical_topics'),
      versions: await db.all('SELECT status, COUNT(*) AS n FROM generated_chapter_versions GROUP BY status'),
      roleCoverage: await db.all('SELECT sr.role_code AS code, COUNT(*) AS n FROM snippet_roles sr JOIN text_snippets s ON s.id = sr.snippet_id JOIN source_revisions r ON r.id = s.revision_id WHERE r.is_current = 1 GROUP BY sr.role_code'),
      divisionCoverage: await db.all('SELECT sd.division_code AS code, COUNT(*) AS n FROM snippet_divisions sd JOIN text_snippets s ON s.id = sd.snippet_id JOIN source_revisions r ON r.id = s.revision_id WHERE r.is_current = 1 GROUP BY sd.division_code'),
      lastAnalysis: (await db.get('SELECT id, status, started_at AS startedAt, finished_at AS finishedAt, stats FROM analysis_runs ORDER BY started_at DESC LIMIT 1')) ?? null,
    };
  });

  app.get<{ Querystring: { entityType?: string; entityId?: string; limit?: string } }>('/audit-events', async (req) => {
    userOf(ctx, req);
    const { entityType, entityId } = req.query;
    const limit = Math.min(Number(req.query.limit ?? 200), 1000);
    const where: string[] = [];
    const p: unknown[] = [];
    if (entityType) (where.push('entity_type = ?'), p.push(entityType));
    if (entityId) (where.push('entity_id = ?'), p.push(entityId));
    return (await ctx.db.all(`SELECT * FROM audit_events ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY at DESC LIMIT ?`, ...p, limit)).map((e) => ({
      id: e.id, at: e.at, actor: e.actor, action: e.action, entityType: e.entity_type, entityId: e.entity_id, details: parseJson(e.details, {}),
    }));
  });
}
