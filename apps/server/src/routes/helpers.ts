import type { FastifyRequest } from 'fastify';
import { requirePermission, resolveUser, type Ctx, type User } from '../context.js';
import type { Permission } from '../domain/reference.js';

export function userOf(ctx: Ctx, req: FastifyRequest, perm: Permission = 'read'): User {
  const header = req.headers['x-user-id'];
  const user = resolveUser(ctx.db, Array.isArray(header) ? header[0] : header);
  requirePermission(user, perm);
  return user;
}

export const list = (v: unknown): string[] | undefined => {
  if (v === undefined || v === null || v === '') return undefined;
  return (Array.isArray(v) ? v : String(v).split(',')).map((x) => String(x).trim()).filter(Boolean);
};
export const num = (v: unknown) => (v === undefined || v === '' ? undefined : Number(v));
