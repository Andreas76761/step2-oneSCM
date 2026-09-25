// Schreibstil (ADR-040) und Bilder aus Text (ADR-041)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { deleteDiagramTemplate, generateDiagrams, listDiagramTemplates, saveDiagram, saveDiagramTemplate } from '../services/diagrams.js';
import { autofixChapterVersion, chapterStyleSummary, checkChapterVersion, checkSnippets, checkText, rewriteText } from '../services/style.js';
import { userOf } from './helpers.js';

export function styleRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.post<{ Body: { text?: unknown } }>('/style/check', async (req) => (userOf(req.ctx, req), checkText(req.ctx, req.body?.text)));
  // Umformulieren verändert nichts Gespeichertes; KI-Nutzung erfordert Bearbeitungsrecht
  app.post<{ Body: any }>('/style/rewrite', async (req) => rewriteText(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'edit').id));
  app.get<{ Params: { versionId: string } }>('/style/chapter-versions/:versionId', async (req) => (userOf(req.ctx, req), checkChapterVersion(req.ctx, req.params.versionId)));
  app.get<{ Querystring: { chapterId?: string; page?: string; pageSize?: string; all?: string } }>('/style/snippets', async (req) => (userOf(req.ctx, req), checkSnippets(req.ctx, {
    chapterId: req.query.chapterId, page: Number(req.query.page) || undefined, pageSize: Number(req.query.pageSize) || undefined, onlyIssues: req.query.all !== 'true',
  })));
  // Bilder aus Text: Erzeugen speichert nichts (KI nur mit Bearbeitungsrecht), Speichern legt ein Bild ab
  app.post<{ Body: any }>('/diagrams/generate', async (req) => {
    const user = userOf(req.ctx, req, (req.body as { useAi?: unknown } | undefined)?.useAi === true ? 'edit' : 'read');
    return generateDiagrams(req.ctx, req.body ?? {}, user.id);
  });
  app.post<{ Body: any }>('/diagrams/save', async (req) => saveDiagram(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.get('/style/chapters', async (req) => (userOf(req.ctx, req), chapterStyleSummary(req.ctx)));
  // Vorschau: Leserecht; Übernehmen (apply) nur mit Bearbeitungsrecht
  app.post<{ Params: { versionId: string }; Body: any }>('/style/chapter-versions/:versionId/autofix', async (req) => {
    const user = userOf(req.ctx, req, (req.body as { apply?: unknown } | undefined)?.apply === true ? 'edit' : 'read');
    return autofixChapterVersion(req.ctx, req.params.versionId, req.body ?? {}, user.id);
  });
  app.get('/diagram-templates', async (req) => (userOf(req.ctx, req), listDiagramTemplates(req.ctx)));
  app.post<{ Body: any }>('/diagram-templates', async (req, reply) => {
    const t = await saveDiagramTemplate(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'edit'));
    return reply.code(201).send(t);
  });
  app.delete<{ Params: { templateId: string } }>('/diagram-templates/:templateId', async (req, reply) => {
    await deleteDiagramTemplate(req.ctx, req.params.templateId, userOf(req.ctx, req, 'edit'));
    return reply.code(204).send();
  });
}
