// oneSCM_Metadaten (ADR-079): Labels, Chunks mit Labels, gespeicherte Fragen und Antworten
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { badRequest } from '../problem.js';
import {
  createLabel, createQa, deleteQa, getQa, labelGroups, listChunks, listLabels, listQa, metadataOverview, setChunkLabels, updateLabel, updateQa,
} from '../services/metadata.js';
import { exportAccessMatrix, getAccessMatrix, importAccessMatrix, setAccessCell } from '../services/accessMatrix.js';
import { exportDomainMap, getDomainMap, setDomainLink } from '../services/domainMap.js';
import { listChunksWithSuggestions, outlineCoverage, outlineSources } from '../services/metadataOutline.js';
import { askSources, exportQa, reaskQa } from '../services/metadataAsk.js';
import { answerCatalog, deleteCatalog, exportCatalog, getCatalog, importCatalog, itemToQa, listCatalogs } from '../services/questionCatalog.js';
import { decideDuplicate, duplicateGroups, getDuplicate, listDuplicates, refreshDuplicates } from '../services/metadataDuplicates.js';
import { headingDocuments, headingTree, mergedHeadings } from '../services/metadataHeadings.js';
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
  app.get<{ Querystring: { q?: string; heading?: string; labels?: string; unlabeled?: string; noOutline?: string; documentId?: string; format?: string; limit?: string; offset?: string } }>('/metadata/chunks', async (req) => {
    userOf(req.ctx, req);
    const q = req.query;
    // mit Gliederungs-Vorschlägen für Chunks ohne Gliederungspunkt (F-13, ADR-084)
    return listChunksWithSuggestions(req.ctx, {
      q: q.q, heading: q.heading || undefined, labelIds: list(q.labels), unlabeled: q.unlabeled === 'true', noOutline: q.noOutline === 'true', documentId: q.documentId || undefined, format: q.format || undefined,
      limit: num(q.limit), offset: num(q.offset),
    });
  });
  // Kapitel ↔ Quellen je Gliederungspunkt (F-14, ADR-084)
  app.get('/metadata/outline-coverage', async (req) => (userOf(req.ctx, req), outlineCoverage(req.ctx)));
  app.get<P<'labelId'> & { Querystring: { minScore?: string } }>('/metadata/outline/:labelId', async (req) => {
    userOf(req.ctx, req);
    return outlineSources(req.ctx, req.params.labelId, { minScore: req.query.minScore ? Number(req.query.minScore) : undefined });
  });
  // Quellen je Überschrift (M3, ADR-087): je Datei als Baum oder zusammengeführt je Überschrift
  app.get('/metadata/headings/documents', async (req) => (userOf(req.ctx, req), headingDocuments(req.ctx)));
  app.get<P<'documentId'>>('/metadata/headings/documents/:documentId', async (req) => (userOf(req.ctx, req), headingTree(req.ctx, req.params.documentId)));
  app.get<{ Querystring: { q?: string; multi?: string; limit?: string; offset?: string } }>('/metadata/headings/merged', async (req) => {
    userOf(req.ctx, req);
    return mergedHeadings(req.ctx, { q: req.query.q, multi: req.query.multi === 'true', limit: num(req.query.limit), offset: num(req.query.offset) });
  });
  // Dubletten über alle Formate je Abschnitt (M4, ADR-088)
  app.get<{ Querystring: { crossFormat?: string; status?: string; minScore?: string; q?: string; limit?: string; offset?: string } }>('/metadata/duplicates', async (req) => {
    userOf(req.ctx, req);
    const q = req.query;
    return listDuplicates(req.ctx, { crossFormat: q.crossFormat === 'true', status: q.status || undefined, minScore: q.minScore ? Number(q.minScore) : undefined, q: q.q, limit: num(q.limit), offset: num(q.offset) });
  });
  app.get<{ Querystring: { crossFormat?: string } }>('/metadata/duplicates/groups', async (req) => (userOf(req.ctx, req), duplicateGroups(req.ctx, { crossFormat: req.query.crossFormat === 'true' })));
  app.post('/metadata/duplicates/rebuild', async (req) => (userOf(req.ctx, req, 'edit'), refreshDuplicates(req.ctx)));
  app.get<P<'duplicateId'>>('/metadata/duplicates/:duplicateId', async (req) => (userOf(req.ctx, req), getDuplicate(req.ctx, req.params.duplicateId)));
  app.put<P<'duplicateId'> & { Body: any }>('/metadata/duplicates/:duplicateId/decision', async (req) => decideDuplicate(req.ctx, req.params.duplicateId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
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
  // Fragen über alle Quellen (M5, ADR-089): fragen mit `read`, speichern mit `edit`
  app.post<{ Body: any }>('/metadata/ask', async (req) => askSources(req.ctx, req.body ?? {}, userOf(req.ctx, req)));
  app.get<{ Querystring: { format?: string; q?: string; labels?: string; language?: string } }>('/metadata/qa/export', async (req, reply) => {
    userOf(req.ctx, req);
    const f = await exportQa(req.ctx, req.query.format ?? 'csv', { q: req.query.q, labelIds: list(req.query.labels), language: req.query.language || undefined });
    reply.header('Content-Type', f.contentType).header('Content-Disposition', `attachment; filename="${f.fileName}"`);
    return f.data;
  });
  // Fragenkatalog (Rückfragen) einlesen und mit Belegen beantworten (ADR-089)
  app.get('/metadata/question-sets', async (req) => (userOf(req.ctx, req), listCatalogs(req.ctx)));
  app.post<{ Body: any }>('/metadata/question-sets', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    let input: { name?: string; fileName?: string; data: string };
    if (req.isMultipart()) {
      const file = await req.file();
      if (!file) throw badRequest('Feld „file“ fehlt.');
      const buf = await file.toBuffer();
      if (buf.length > 10 * 1024 * 1024) throw badRequest('Datei größer als 10 MB.');
      input = { fileName: file.filename, data: buf.toString('utf8'), name: (file.fields as any)?.name?.value };
    } else {
      const b = (req.body ?? {}) as any;
      if (typeof b.text !== 'string') throw badRequest('text (Fragen, eine je Zeile) oder eine Datei ist Pflicht.');
      input = { fileName: typeof b.fileName === 'string' ? b.fileName : 'fragen.txt', data: b.text.slice(0, 2_000_000), name: b.name };
    }
    reply.code(201);
    return importCatalog(req.ctx, input, user);
  });
  app.get<P<'setId'>>('/metadata/question-sets/:setId', async (req) => (userOf(req.ctx, req), getCatalog(req.ctx, req.params.setId)));
  app.post<P<'setId'> & { Body: any }>('/metadata/question-sets/:setId/answer', async (req) => answerCatalog(req.ctx, req.params.setId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.get<P<'setId'> & { Querystring: { format?: string } }>('/metadata/question-sets/:setId/export', async (req, reply) => {
    userOf(req.ctx, req);
    const f = await exportCatalog(req.ctx, req.params.setId, req.query.format ?? 'xlsx');
    reply.header('Content-Type', f.contentType).header('Content-Disposition', `attachment; filename="${encodeURIComponent(f.fileName)}"`);
    return f.data;
  });
  app.delete<P<'setId'>>('/metadata/question-sets/:setId', async (req, reply) => {
    await deleteCatalog(req.ctx, req.params.setId, userOf(req.ctx, req, 'edit'));
    reply.code(204);
  });
  app.post<P<'itemId'> & { Body: any }>('/metadata/question-items/:itemId/qa', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return itemToQa(req.ctx, req.params.itemId, req.body ?? {}, user);
  });
  app.post<P<'qaId'>>('/metadata/qa/:qaId/reask', async (req) => reaskQa(req.ctx, req.params.qaId, userOf(req.ctx, req)));
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
