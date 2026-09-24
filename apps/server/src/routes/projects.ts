// Mandanten/Projekte (ADR-014). Verwaltung mit globaler Berechtigung „admin“; Liste zeigt nur zugängliche Projekte.
import type { FastifyInstance, FastifyRequest } from 'fastify';
import { requirePermission, type Ctx, type User } from '../context.js';
import { createProject, listMembers, listProjects, removeMember, setMember, updateProject } from '../services/projects.js';

function globalUser(req: FastifyRequest, perm?: 'admin'): User {
  const user = req.globalUser;
  if (!user) throw new Error('Benutzer nicht aufgelöst');
  if (perm) requirePermission(user, perm);
  return user;
}

export function projectRoutes(app: FastifyInstance, ctx: Ctx) {
  app.get('/projects', async (req) => listProjects(ctx, globalUser(req)));
  app.post<{ Body: any }>('/projects', async (req, reply) => {
    const user = globalUser(req, 'admin');
    reply.code(201);
    return createProject(ctx, (req.body ?? {}) as any, user);
  });
  app.patch<{ Params: { projectId: string }; Body: any }>('/projects/:projectId', async (req) => updateProject(ctx, req.params.projectId, (req.body ?? {}) as any, globalUser(req, 'admin')));
  app.get<{ Params: { projectId: string } }>('/projects/:projectId/members', async (req) => (globalUser(req, 'admin'), listMembers(ctx, req.params.projectId)));
  app.put<{ Params: { projectId: string; userId: string }; Body: any }>('/projects/:projectId/members/:userId', async (req) =>
    setMember(ctx, req.params.projectId, req.params.userId, (req.body ?? {}) as any, globalUser(req, 'admin')));
  app.delete<{ Params: { projectId: string; userId: string } }>('/projects/:projectId/members/:userId', async (req, reply) => {
    await removeMember(ctx, req.params.projectId, req.params.userId, globalUser(req, 'admin'));
    reply.code(204);
  });
}
