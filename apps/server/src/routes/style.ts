// Schreibstil (ADR-040) und Bilder aus Text (ADR-041)
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import { deleteDiagramTemplate, generateDiagrams, listDiagramTemplates, saveDiagram, saveDiagramTemplate } from '../services/diagrams.js';
import { styleHistory, applyChapterTexts, copyStyleRules, exportStyleRules, importStyleRules, getStyleRules, updateStyleRules, autofixChapterVersion, chapterStyleSummary, checkChapterVersion, checkSnippets, checkText, rewriteText } from '../services/style.js';
import { applyGuidanceFixes, assistantSuggestions, chapterGuidance, createChapterFromAssistant, guidanceSummary } from '../services/guidance.js';
import { effectivePhrases, projectLibraries, setProjectLibraries } from '../services/style.js';
import { CHAPTER_TEMPLATES } from '../domain/chapterTemplates.js';
import { feedbackSummary, listFeedback, submitFeedback, updateFeedback } from '../services/feedback.js';
import { getGuidanceSettings, updateGuidanceSettings } from '../services/guidanceBase.js';
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
  // Eigene Stilregeln je Projekt (ADR-044): lesen für alle, ändern nur Administration
  app.get('/style/rules', async (req) => (userOf(req.ctx, req), getStyleRules(req.ctx)));
  app.put<{ Body: any }>('/style/rules', async (req) => updateStyleRules(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'admin')));
  // Umformulierungen (KI-Stapel) nach Prüfung übernehmen
  app.post<{ Params: { versionId: string }; Body: any }>('/style/chapter-versions/:versionId/apply', async (req) =>
    applyChapterTexts(req.ctx, req.params.versionId, req.body ?? {}, userOf(req.ctx, req, 'edit').id));
  // Stilregeln austauschen (ADR-047)
  app.get<{ Querystring: { format?: string } }>('/style/rules/export', async (req, reply) => {
    userOf(req.ctx, req);
    const f = await exportStyleRules(req.ctx, req.query.format ?? 'csv');
    return reply.header('Content-Type', f.contentType).header('Content-Disposition', `attachment; filename="${f.fileName}"`).send(f.body);
  });
  app.post<{ Body: any }>('/style/rules/import', async (req) => importStyleRules(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'admin')));
  app.post<{ Body: any }>('/style/rules/copy', async (req) => {
    const user = userOf(req.ctx, req, 'admin');
    return copyStyleRules(req.ctx, req.body ?? {}, req.globalUser ?? user, user);
  });
  // Stilwert-Verlauf (ADR-048)
  app.get<{ Querystring: { chapterId?: string; days?: string } }>('/style/history', async (req) =>
    (userOf(req.ctx, req), styleHistory(req.ctx, { chapterId: req.query.chapterId, days: Number(req.query.days) || undefined })));
  // Stilregel-Bibliotheken (ADR-050): Abonnements des Projekts und wirksame Regeln
  app.get('/style/libraries', async (req) => (userOf(req.ctx, req), projectLibraries(req.ctx)));
  app.put<{ Body: any }>('/style/libraries', async (req) => setProjectLibraries(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'admin')));
  app.get('/style/rules/effective', async (req) => (userOf(req.ctx, req), effectivePhrases(req.ctx)));
  // Anleitungs-Check (ADR-051)
  app.get('/guidance', async (req) => (userOf(req.ctx, req), guidanceSummary(req.ctx)));
  app.get<{ Params: { versionId: string } }>('/guidance/chapter-versions/:versionId', async (req) => (userOf(req.ctx, req), chapterGuidance(req.ctx, req.params.versionId)));
  app.post<{ Params: { versionId: string }; Body: any }>('/guidance/chapter-versions/:versionId/apply', async (req) =>
    applyGuidanceFixes(req.ctx, req.params.versionId, req.body ?? {}, userOf(req.ctx, req, 'edit').id));
  // Kapitel-Assistent (ADR-052)
  app.get<{ Querystring: { topic?: string; chapterId?: string } }>('/chapter-assistant/suggestions', async (req) =>
    (userOf(req.ctx, req), assistantSuggestions(req.ctx, { topic: req.query.topic, chapterId: req.query.chapterId || undefined })));
  app.post<{ Body: any }>('/chapter-assistant', async (req, reply) =>
    reply.code(201).send(await createChapterFromAssistant(req.ctx, (req.body ?? {}) as Record<string, unknown>, userOf(req.ctx, req, 'edit').id)));
  // Kapitelvorlagen (ADR-055)
  app.get('/chapter-assistant/templates', async (req) => (userOf(req.ctx, req), CHAPTER_TEMPLATES));
  // Anleitungs-Check als Freigabebedingung (ADR-057): lesen für alle, ändern nur Administration
  app.get('/guidance/settings', async (req) => (userOf(req.ctx, req), getGuidanceSettings(req.ctx)));
  app.put<{ Body: any }>('/guidance/settings', async (req) => updateGuidanceSettings(req.ctx, req.body ?? {}, userOf(req.ctx, req, 'admin')));
  // Rückmeldungen aus der Leseransicht (ADR-054): abgeben mit Leserecht, bearbeiten mit Bearbeitungsrecht
  app.post<{ Params: { chapterId: string }; Body: any }>('/chapters/:chapterId/feedback', async (req, reply) =>
    reply.code(201).send(await submitFeedback(req.ctx, req.params.chapterId, req.body ?? {}, userOf(req.ctx, req))));
  app.get<{ Querystring: { status?: string; chapterId?: string } }>('/feedback', async (req) => (userOf(req.ctx, req), listFeedback(req.ctx, req.query)));
  app.get('/feedback/summary', async (req) => (userOf(req.ctx, req), feedbackSummary(req.ctx)));
  app.patch<{ Params: { feedbackId: string }; Body: any }>('/feedback/:feedbackId', async (req) => updateFeedback(req.ctx, req.params.feedbackId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
}
