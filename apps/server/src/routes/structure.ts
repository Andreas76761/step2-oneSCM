// Kapitelsteuerung (ADR-096): Kapitelanweisung, Kapitel und Unterkapitel ergänzen, Version, Ablösen und Historie
import type { FastifyInstance } from 'fastify';
import type { Ctx } from '../context.js';
import {
  createChapter, createSubchapter, exportInstructions, structureOutlines, instructionFor, listHistory, listStructure, replaceItem, restoreItem, subchapterInstructions, updateChapterMeta, updateSubchapterMeta, type StructureKind,
} from '../services/structure.js';
import { userOf } from './helpers.js';

export function structureRoutes(app: FastifyInstance, _ctx: Ctx) {
  app.get<{ Querystring: { history?: string; outline?: string } }>('/structure', async (req) => (userOf(req.ctx, req), listStructure(req.ctx, { history: req.query.history === 'true', outlineFamilyId: req.query.outline || undefined })));
  // Handbuch-Varianten mit Kapiteln (ADR-097, W-01)
  app.get('/structure/outlines', async (req) => (userOf(req.ctx, req), { items: await structureOutlines(req.ctx) }));
  app.post<{ Body: any }>('/structure/chapters', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createChapter(req.ctx, req.body ?? {}, user);
  });
  app.patch<{ Params: { chapterId: string }; Body: any }>('/structure/chapters/:chapterId', async (req) => updateChapterMeta(req.ctx, req.params.chapterId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  app.post<{ Params: { chapterId: string }; Body: any }>('/structure/chapters/:chapterId/subchapters', async (req, reply) => {
    const user = userOf(req.ctx, req, 'edit');
    reply.code(201);
    return createSubchapter(req.ctx, req.params.chapterId, req.body ?? {}, user);
  });
  app.patch<{ Params: { subchapterId: string }; Body: any }>('/structure/subchapters/:subchapterId', async (req) => updateSubchapterMeta(req.ctx, req.params.subchapterId, req.body ?? {}, userOf(req.ctx, req, 'edit')));
  // gültige Anweisung eines Kapitels (für Werkstatt und Agenten), dazu je Unterkapitel
  app.get<{ Params: { chapterId: string } }>('/chapters/:chapterId/instruction', async (req) => {
    userOf(req.ctx, req);
    const chapter = await instructionFor(req.ctx, req.params.chapterId);
    const subs = await subchapterInstructions(req.ctx, req.params.chapterId);
    const titles = new Map((await req.ctx.db.all('SELECT id, title FROM subchapters WHERE chapter_id = ? AND history_at IS NULL ORDER BY position', req.params.chapterId)).map((r) => [r.id as string, r.title as string]));
    return { chapterId: req.params.chapterId, chapter, subchapters: [...titles].map(([id, title]) => ({ id, title, instruction: subs.get(id)! })) };
  });
  // Ablösen: Labels nur mit Administration (wie der Labelkatalog), Kapitel und Unterkapitel mit Bearbeitungsrecht
  app.post<{ Body: any }>('/structure/replace', async (req) => {
    const body = (req.body ?? {}) as any;
    const kind = String(body.kind ?? '') as StructureKind;
    const user = userOf(req.ctx, req, kind === 'label' ? 'admin' : 'edit');
    return replaceItem(req.ctx, kind, String(body.id ?? ''), body, user);
  });
  app.get<{ Querystring: { restored?: string } }>('/structure/history', async (req) => (userOf(req.ctx, req), { items: await listHistory(req.ctx, { includeRestored: req.query.restored === 'true' }) }));
  app.post<{ Params: { historyId: string } }>('/structure/history/:historyId/restore', async (req) => {
    const h = await req.ctx.db.get('SELECT kind FROM structure_history WHERE id = ? AND project_id = ?', req.params.historyId, req.ctx.projectId);
    return { items: await restoreItem(req.ctx, req.params.historyId, userOf(req.ctx, req, h?.kind === 'label' ? 'admin' : 'edit')) };
  });
  app.get('/structure/instructions/export', async (req) => (userOf(req.ctx, req), exportInstructions(req.ctx)));
}
