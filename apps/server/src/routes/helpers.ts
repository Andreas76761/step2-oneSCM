import type { FastifyRequest } from 'fastify';
import { requirePermission, type Ctx, type User } from '../context.js';
import type { Permission } from '../domain/reference.js';

declare module 'fastify' {
  interface FastifyRequest {
    /** wirksamer Benutzer im Projekt der Anfrage */
    user: User | null;
    /** Benutzer mit globalen Berechtigungen (Projektverwaltung) */
    globalUser: User | null;
    /** Anwendungskontext im Projekt der Anfrage (Header X-Project-Id, ADR-014) */
    ctx: Ctx;
  }
}

/** Angemeldeter Benutzer (gesetzt im onRequest-Hook) mit Prüfung der technischen Berechtigung. */
export function userOf(_ctx: Ctx, req: FastifyRequest, perm: Permission = 'read'): User {
  const user = req.user;
  if (!user) throw new Error('Benutzer nicht aufgelöst');
  requirePermission(user, perm);
  return user;
}

export const list = (v: unknown): string[] | undefined => {
  if (v === undefined || v === null || v === '') return undefined;
  return (Array.isArray(v) ? v : String(v).split(',')).map((x) => String(x).trim()).filter(Boolean);
};
export const num = (v: unknown) => (v === undefined || v === '' ? undefined : Number(v));
