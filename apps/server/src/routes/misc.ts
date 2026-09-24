// Export, Traceability, Einstellungen, Referenzdaten, Dashboard, Audit (US-010, US-012, US-013, US-014, US-020)
import type { FastifyInstance } from 'fastify';
import { audit, getSettings, requirePermission, saveSettings, type Ctx } from '../context.js';
import { parseJson } from '../db.js';
import { RULE_LABELS } from '../domain/contradictions.js';
import {
  BLOCK_MODES, CHAPTER_SECTIONS, DECISIONS, DIVISIONS, EVIDENCE_STATUSES, FINDING_TYPES, PERMISSIONS, ROLES, SEVERITIES,
} from '../domain/reference.js';
import { badRequest } from '../problem.js';
import { CONTENT_TYPES, createExport, downloadExport, listExports } from '../services/exports.js';
import { optimizationOverview } from '../services/insights.js';
import { translationStatus } from '../services/translations.js';
import { buildMatrix, matrixCsv, matrixMarkdown, matrixXlsx } from '../services/traceability.js';
import { list, userOf } from './helpers.js';

export function miscRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.post<{ Body: any }>('/exports', async (req, reply) => {
    const user = userOf(req.ctx, req, 'read');
    const b = (req.body ?? {}) as any;
    reply.code(201);
    return createExport(req.ctx, { chapterIds: list(b.chapterIds), roles: list(b.roles), divisions: list(b.divisions), market: b.market || null, release: b.release || null, format: b.format }, user.id);
  });
  app.get('/exports', async (req) => (userOf(req.ctx, req), listExports(req.ctx)));
  app.get<{ Params: { exportId: string } }>('/exports/:exportId/download', async (req, reply) => {
    userOf(req.ctx, req);
    const f = await downloadExport(req.ctx, req.params.exportId);
    reply.header('Content-Type', CONTENT_TYPES[f.format] ?? 'application/octet-stream').header('Content-Disposition', `attachment; filename="${f.fileName}"`);
    return f.data;
  });

  app.get<{ Querystring: { format?: string } }>('/traceability', async (req, reply) => {
    userOf(req.ctx, req);
    const m = buildMatrix(req.ctx);
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

  app.get('/settings', async (req) => (userOf(req.ctx, req), getSettings(req.ctx.db)));
  app.put<{ Body: any }>('/settings', async (req) => {
    // Einstellungen gelten systemweit: globale Berechtigung „admin“ erforderlich (nicht nur Projekt-Administration)
    const user = req.globalUser!;
    requirePermission(user, 'admin');
    const body = (req.body ?? {}) as any;
    const a = body.analysis;
    if (a) {
      for (const k of ['clusterThreshold', 'duplicateThreshold', 'contradictionThreshold']) {
        if (a[k] !== undefined && (typeof a[k] !== 'number' || a[k] < 0.05 || a[k] > 1)) throw badRequest(`analysis.${k} muss eine Zahl zwischen 0,05 und 1 sein.`);
      }
    }
    const sem = body.semantic;
    if (sem?.analysisMethod !== undefined && !['tfidf', 'hybrid'].includes(sem.analysisMethod)) throw badRequest('semantic.analysisMethod muss tfidf oder hybrid sein.');
    if (sem?.embeddingThreshold !== undefined && (typeof sem.embeddingThreshold !== 'number' || sem.embeddingThreshold < 0.3 || sem.embeddingThreshold > 1)) throw badRequest('semantic.embeddingThreshold muss zwischen 0,3 und 1 liegen.');
    const mins = body.rewrite?.minSupport;
    if (mins !== undefined && (typeof mins !== 'number' || mins < 0.1 || mins > 1)) throw badRequest('rewrite.minSupport muss eine Zahl zwischen 0,1 und 1 sein.');
    await saveSettings(req.ctx.db, body);
    await audit(req.ctx.db, user.id, 'settings.updated', 'settings', 'project', body);
    return getSettings(req.ctx.db);
  });

  app.get('/reference', async (req) => {
    userOf(req.ctx, req);
    return {
      roles: ROLES, divisions: DIVISIONS, evidenceStatuses: EVIDENCE_STATUSES, findingTypes: FINDING_TYPES, severities: SEVERITIES, decisions: DECISIONS,
      sections: CHAPTER_SECTIONS, blockModes: BLOCK_MODES, permissions: PERMISSIONS, contradictionRules: RULE_LABELS,
      markets: await req.ctx.db.all('SELECT code, label FROM markets ORDER BY code'), releases: await req.ctx.db.all('SELECT code, label FROM release_scopes ORDER BY code'),
      // Benutzerliste (für die Demo-Auswahl) nur im Demo-Modus
      users: req.ctx.config.authMode === 'demo'
        ? (await req.ctx.db.all("SELECT id, name, permissions FROM users WHERE id LIKE 'u-%' ORDER BY name")).map((u) => ({ ...u, permissions: parseJson(u.permissions, []) }))
        : [],
    };
  });
  app.get('/me', async (req) => userOf(req.ctx, req));

  // Öffentlich: Anmeldekonfiguration für die Web-UI (ENTSCHEIDUNG E-15)
  app.get('/auth/config', async (req) =>
    req.ctx.config.authMode === 'oidc'
      ? { mode: 'oidc', issuer: req.ctx.config.oidc!.issuer, clientId: req.ctx.config.oidc!.clientId, scope: req.ctx.config.oidc!.scope, audience: req.ctx.config.oidc!.audience }
      : { mode: 'demo' },
  );

  app.get('/dashboard', async (req) => {
    userOf(req.ctx, req);
    const { db, projectId: pid } = req.ctx;
    const one = async (sql: string, ...p: unknown[]) => (await db.get<{ n: number }>(sql, ...p))?.n ?? 0;
    // aktuelle Textabschnitte des Projekts
    const cur = 'FROM text_snippets s JOIN source_revisions r ON r.id = s.revision_id JOIN source_documents d ON d.id = r.document_id WHERE r.is_current = 1 AND d.project_id = ?';
    return {
      sources: await one('SELECT COUNT(*) AS n FROM source_documents WHERE project_id = ?', pid),
      revisions: await one('SELECT COUNT(*) AS n FROM source_revisions r JOIN source_documents d ON d.id = r.document_id WHERE d.project_id = ?', pid),
      imports: await one('SELECT COUNT(*) AS n FROM imports WHERE project_id = ?', pid),
      chapters: await one('SELECT COUNT(*) AS n FROM chapters WHERE project_id = ?', pid),
      snippets: await one(`SELECT COUNT(*) AS n ${cur}`, pid),
      confirmedSnippets: await one(`SELECT COUNT(*) AS n ${cur} AND s.evidence_status IN ('source_confirmed','manually_confirmed')`, pid),
      openFindings: await db.all("SELECT type, severity, COUNT(*) AS n FROM quality_findings WHERE project_id = ? AND status IN ('open','deferred') GROUP BY type, severity", pid),
      clusters: await one("SELECT COUNT(*) AS n FROM semantic_clusters WHERE project_id = ? AND status <> 'dissolved'", pid),
      canonicalTopics: await one('SELECT COUNT(*) AS n FROM canonical_topics WHERE project_id = ?', pid),
      versions: await db.all('SELECT v.status, COUNT(*) AS n FROM generated_chapter_versions v JOIN chapters c ON c.id = v.chapter_id WHERE c.project_id = ? GROUP BY v.status', pid),
      roleCoverage: await db.all(`SELECT sr.role_code AS code, COUNT(*) AS n FROM snippet_roles sr JOIN text_snippets s ON s.id = sr.snippet_id JOIN source_revisions r ON r.id = s.revision_id
        JOIN source_documents d ON d.id = r.document_id WHERE r.is_current = 1 AND d.project_id = ? GROUP BY sr.role_code`, pid),
      divisionCoverage: await db.all(`SELECT sd.division_code AS code, COUNT(*) AS n FROM snippet_divisions sd JOIN text_snippets s ON s.id = sd.snippet_id JOIN source_revisions r ON r.id = s.revision_id
        JOIN source_documents d ON d.id = r.document_id WHERE r.is_current = 1 AND d.project_id = ? GROUP BY sd.division_code`, pid),
      lastAnalysis: (await db.get('SELECT id, status, started_at AS startedAt, finished_at AS finishedAt, stats FROM analysis_runs WHERE project_id = ? ORDER BY started_at DESC LIMIT 1', pid)) ?? null,
      translations: await translationStatus(req.ctx),
    };
  });

  app.get('/optimizations', async (req) => (userOf(req.ctx, req), optimizationOverview(req.ctx)));

  app.get<{ Querystring: { entityType?: string; entityId?: string; limit?: string } }>('/audit-events', async (req) => {
    userOf(req.ctx, req);
    const { entityType, entityId } = req.query;
    const limit = Math.min(Number(req.query.limit ?? 200), 1000);
    // Projektereignisse; systemweite Ereignisse (Einstellungen) nur für die Administration
    const where: string[] = [req.globalUser?.permissions.includes('admin') ? '(project_id = ? OR project_id IS NULL)' : 'project_id = ?'];
    const p: unknown[] = [req.ctx.projectId];
    if (entityType) (where.push('entity_type = ?'), p.push(entityType));
    if (entityId) (where.push('entity_id = ?'), p.push(entityId));
    return (await req.ctx.db.all(`SELECT * FROM audit_events WHERE ${where.join(' AND ')} ORDER BY at DESC LIMIT ?`, ...p, limit)).map((e) => ({
      id: e.id, at: e.at, projectId: e.project_id ?? null, actor: e.actor, action: e.action, entityType: e.entity_type, entityId: e.entity_id, details: parseJson(e.details, {}),
    }));
  });
}
