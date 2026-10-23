// oneSCM_Metadaten (ADR-079): Labels, Chunks mit Labels, gespeicherte Fragen und Antworten
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import {
  createLabel, createQa, deleteQa, getQa, labelGroups, listChunks, listLabels, listQa, metadataOverview, setChunkLabels, updateLabel, updateQa,
} from '../services/metadata.js';
import { exportAccessMatrix, getAccessMatrix, importAccessMatrix, setAccessCell } from '../services/accessMatrix.js';
import { exportDomainMap, getDomainMap, setDomainLink } from '../services/domainMap.js';
import { listChunksWithSuggestions, outlineCoverage, outlineSources } from '../services/metadataOutline.js';
import { list, num, userOf } from './helpers.js';

type P<T extends string> = { Params: Record<T, string> };

export function metadataRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get('/metadata/overview', async (req) => (userOf(req.ctx, req), metadataOverview(req.ctx)));

  // ENTSCHEIDUNG(M-06): Labels vordefiniert; lesen mit `read`, pflegen nur mit `admin`
  app.get('/metadata/label-groups', async (req) => (userOf(req.ctx, req), labelGroups()));
  app.get<{ Querystring: { group?: string; includeArchived?: string } }>('/metadata/labels', async (req) => {
    userOf(req.ctx, req);
    return listLabels(req.ctx, { group: req.query.group || undefined, includeArchived: req.query.includeArchived === 'true' });
  });
  app.post<{ Body: any }>('/metadata/labels', async (req, reply) => {
    const user = userOf(req.ctx, req, 'admin');
    reply.code(201);
    return createLabel(req.ctx, req.body ?? {}, user);
  });
  app.patch<P<'labelId'> & { Body: any }>('/metadata/labels/:labelId', async (req) => updateLabel(req.ctx, req.params.labelId, req.body ?? {}, userOf(req.ctx, req, 'admin')));

  // ENTSCHEIDUNG(M-09): Chunks lesen mit `read`, labeln mit `edit`
  app.get<{ Querystring: { q?: string; labels?: string; unlabeled?: string; noOutline?: string; documentId?: string; format?: string; limit?: string; offset?: string } }>('/metadata/chunks', async (req) => {
    userOf(req.ctx, req);
    const q = req.query;
    // mit Gliederungs-Vorschlägen für Chunks ohne Gliederungspunkt (F-13, ADR-084)
    return listChunksWithSuggestions(req.ctx, {
      q: q.q, labelIds: list(q.labels), unlabeled: q.unlabeled === 'true', noOutline: q.noOutline === 'true', documentId: q.documentId || undefined, format: q.format || undefined,
      limit: num(q.limit), offset: num(q.offset),
    });
  });
  // Kapitel ↔ Quellen je Gliederungspunkt (F-14, ADR-084)
  app.get('/metadata/outline-coverage', async (req) => (userOf(req.ctx, req), outlineCoverage(req.ctx)));
  app.get<P<'labelId'> & { Querystring: { minScore?: string } }>('/metadata/outline/:labelId', async (req) => {
    userOf(req.ctx, req);
    return outlineSources(req.ctx, req.params.labelId, { minScore: req.query.minScore ? Number(req.query.minScore) : undefined });
  });
  app.post<{ Body: any }>('/metadata/chunks/labels', async (req) => setChunkLabels(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'edit')));

  // Gespeicherte Fragen und Antworten: lesen mit `read`, speichern, ändern, löschen mit `edit`
  app.get<{ Querystring: { q?: string; labels?: string; language?: string } }>('/metadata/qa', async (req) => {
    userOf(req.ctx, req);
    return listQa(req.ctx, { q: req.query.q, labelIds: list(req.query.labels), language: req.query.language || undefined });
  });
  app.post<{ Body: any }>('/metadata/qa', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createQa(req.ctx, req.body ?? {}, user);
  });
  app.get<P<'qaId'>>('/metadata/qa/:qaId', async (req) => (userOf(req.ctx, req), getQa(req.ctx, req.params.qaId)));
  app.patch<P<'qaId'> & { Body: any }>('/metadata/qa/:qaId', async (req) => updateQa(req.ctx, req.params.qaId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.delete<P<'qaId'>>('/metadata/qa/:qaId', async (req, reply) => {
    await deleteQa(req.ctx, req.params.qaId, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });

  // Zugriffsmatrix Rolle × Menüpunkt (ADR-081, F-06): lesen mit `read`, pflegen und importieren mit `edit`
  // Zuordnung Domäne → Gliederungspunkt → Ordner (ADR-082)
  app.get<{ Querystring: { outlineId?: string } }>('/metadata/domain-map', async (req) => (userOf(req.ctx, req), getDomainMap(req.ctx, { outlineId: req.query.outlineId || undefined })));
  app.put<{ Body: any }>('/metadata/domain-map/links', async (req) => setDomainLink(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.get<{ Querystring: { outlineId?: string } }>('/metadata/domain-map/export', async (req, reply) => {
    userOf(req.ctx, req);
    reply.header('Content-Type', 'text/csv; charset=utf-8').header('Content-Disposition', 'attachment; filename="zuordnung-domaene-ordner.csv"');
    return exportDomainMap(req.ctx, { outlineId: req.query.outlineId || undefined });
  });

  app.get('/metadata/access-matrix', async (req) => (userOf(req.ctx, req), getAccessMatrix(req.ctx)));
  app.put<{ Body: any }>('/metadata/access-matrix/cells', async (req) => setAccessCell(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.post<{ Body: any }>('/metadata/access-matrix/import', async (req) => importAccessMatrix(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.get('/metadata/access-matrix/export', async (req, reply) => {
    userOf(req.ctx, req);
    reply.header('Content-Type', 'text/csv; charset=utf-8').header('Content-Disposition', 'attachment; filename="zugriffsmatrix.csv"');
    return exportAccessMatrix(req.ctx);
  });
}
