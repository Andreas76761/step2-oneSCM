// Benutzerverwaltung (ADR-045): Benutzer anlegen, Namen/E-Mail/Berechtigungen pflegen, sperren und entsperren,
// Projektzugriffe je Benutzer im Überblick. Projektübergreifend – nur mit globaler Berechtigung „admin“.
// Lokale Benutzer (u-…) gelten im Demo-Modus; OIDC-Benutzer (oidc:<sub>) erhalten ihre Berechtigungen vom Identity Provider,
// hier lassen sie sich vorab anlegen, sperren und Projekten zuordnen.
import { audit, type Ctx, type User } from '../context.js';
import { json, now, parseJson, type Row } from '../db.js';
import { PERMISSIONS } from '../domain/reference.js';
import { badRequest, conflict, notFound } from '../problem.js';

const LOCAL_ID = /^u-[a-z0-9][a-z0-9-]{1,39}$/;
const OIDC_ID = /^oidc:[^\s]{1,200}$/;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

function dto(r: Row) {
  return {
    id: r.id as string, name: r.name as string, email: (r.email as string | null) ?? null, permissions: parseJson<string[]>(r.permissions, []),
    origin: (r.origin as string | null) ?? (String(r.id).startsWith('oidc:') ? 'oidc' : 'local'),
    disabled: !!r.disabled_at, disabledAt: r.disabled_at ?? null, disabledBy: r.disabled_by ?? null, createdAt: r.created_at ?? null, createdBy: r.created_by ?? null,
    lastActivity: r.last_activity ?? null, projects: Number(r.projects ?? 0),
  };
}

const SELECT = `SELECT u.*, (SELECT MAX(a.at) FROM audit_events a WHERE a.actor = u.id) AS last_activity,
  (SELECT COUNT(*) FROM project_members m WHERE m.user_id = u.id) AS projects FROM users u`;

export async function listUsers(ctx: Ctx) {
  return (await ctx.db.all(`${SELECT} ORDER BY CASE WHEN u.disabled_at IS NULL THEN 0 ELSE 1 END, u.name`)).map(dto);
}

async function userRow(ctx: Ctx, id: string) {
  const r = await ctx.db.get(`${SELECT} WHERE u.id = ?`, id);
  if (!r) throw notFound(`Benutzer ${id}`);
  return r;
}

function permissionsOf(v: unknown) {
  if (!Array.isArray(v) || v.some((p) => !(PERMISSIONS as readonly unknown[]).includes(p))) throw badRequest(`permissions: erlaubt sind ${PERMISSIONS.join(', ')}.`);
  const set = new Set(v as string[]);
  set.add('read'); // ohne Lesen ist kein Zugriff sinnvoll
  return PERMISSIONS.filter((p) => set.has(p));
}

const cleanName = (v: unknown) => {
  const n = typeof v === 'string' ? v.trim().slice(0, 120) : '';
  if (!n) throw badRequest('name ist Pflicht.');
  return n;
};
const cleanEmail = (v: unknown) => {
  if (v === null || v === undefined || v === '') return null;
  if (typeof v !== 'string' || !EMAIL.test(v.trim())) throw badRequest('email ist keine gültige E-Mail-Adresse.');
  return v.trim().toLowerCase();
};

/** Aktive Administratoren (für den Schutz vor dem Aussperren) */
async function activeAdmins(ctx: Ctx) {
  return (await ctx.db.all('SELECT id, permissions FROM users WHERE disabled_at IS NULL')).filter((r) => parseJson<string[]>(r.permissions, []).includes('admin')).map((r) => r.id as string);
}

export async function createUser(ctx: Ctx, input: Record<string, unknown>, admin: User) {
  const id = typeof input.id === 'string' ? input.id.trim() : '';
  if (!LOCAL_ID.test(id) && !OIDC_ID.test(id)) throw badRequest('id: „u-…“ (Kleinbuchstaben, Ziffern, Bindestrich, 3–41 Zeichen) oder „oidc:<Subject>“.');
  if (await ctx.db.get('SELECT 1 FROM users WHERE id = ?', id)) throw conflict(`Benutzer ${id} existiert bereits.`);
  const oidc = id.startsWith('oidc:');
  // OIDC: Berechtigungen kommen bei jeder Anmeldung vom Identity Provider; vorab nur Lesen
  const permissions = oidc ? ['read'] : permissionsOf(input.permissions ?? ['read']);
  const name = cleanName(input.name);
  const email = cleanEmail(input.email);
  await ctx.db.tx(async () => {
    await ctx.db.run('INSERT INTO users (id, name, permissions, email, origin, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      id, name, json(permissions), email, oidc ? 'oidc' : 'local', now(), admin.id);
    await audit(ctx, admin.id, 'user.created', 'user', id, { name, permissions, origin: oidc ? 'oidc' : 'local' });
  });
  return dto(await userRow(ctx, id));
}

/** Name, E-Mail, Berechtigungen (nur lokal), Sperre ändern – mit Schutz vor Selbstaussperrung und ohne letzten Administrator */
export async function updateUser(ctx: Ctx, id: string, input: Record<string, unknown>, admin: User) {
  const r = await userRow(ctx, id);
  const oidc = String(r.id).startsWith('oidc:');
  const set: string[] = [];
  const vals: unknown[] = [];
  const changes: Record<string, unknown> = {};
  const upd = (col: string, v: unknown) => (set.push(`${col} = ?`), vals.push(v));
  if (input.name !== undefined) {
    if (oidc) throw badRequest('Name von OIDC-Benutzern kommt vom Identity Provider.');
    upd('name', (changes.name = cleanName(input.name)));
  }
  if (input.email !== undefined) {
    if (oidc) throw badRequest('E-Mail von OIDC-Benutzern kommt vom Identity Provider.');
    upd('email', (changes.email = cleanEmail(input.email)));
  }
  let willBeAdmin = parseJson<string[]>(r.permissions, []).includes('admin');
  let willBeActive = !r.disabled_at;
  if (input.permissions !== undefined) {
    if (oidc) throw badRequest('Berechtigungen von OIDC-Benutzern kommen vom Identity Provider (Rollen-Zuordnung in der Konfiguration); Projektzugriffe lassen sich hier vergeben.');
    const p = permissionsOf(input.permissions);
    if (id === admin.id && !p.includes('admin')) throw conflict('Die eigene Administrationsberechtigung kann nicht entzogen werden.');
    willBeAdmin = p.includes('admin');
    upd('permissions', json((changes.permissions = p)));
  }
  if (input.disabled !== undefined) {
    if (typeof input.disabled !== 'boolean') throw badRequest('disabled muss true oder false sein.');
    if (input.disabled && id === admin.id) throw conflict('Das eigene Benutzerkonto kann nicht gesperrt werden.');
    willBeActive = !input.disabled;
    if (input.disabled && !r.disabled_at) (upd('disabled_at', now()), upd('disabled_by', admin.id));
    if (!input.disabled && r.disabled_at) (upd('disabled_at', null), upd('disabled_by', null));
    changes.disabled = input.disabled;
  }
  if (!set.length) return dto(r);
  // mindestens ein aktiver Administrator muss bleiben
  const admins = (await activeAdmins(ctx)).filter((a) => a !== id);
  if (!admins.length && !(willBeAdmin && willBeActive)) throw conflict('Der letzte aktive Administrator kann nicht gesperrt oder herabgestuft werden.');
  await ctx.db.tx(async () => {
    await ctx.db.run(`UPDATE users SET ${set.join(', ')} WHERE id = ?`, ...vals, id);
    await audit(ctx, admin.id, 'disabled' in changes ? (changes.disabled ? 'user.disabled' : 'user.enabled') : 'user.updated', 'user', id, changes);
  });
  return dto(await userRow(ctx, id));
}

/** Projektzugriffe eines Benutzers: Mitgliedschaft (mit Berechtigungen) bzw. Zugriff über offene Projekte */
export async function userProjects(ctx: Ctx, id: string) {
  const u = dto(await userRow(ctx, id));
  const projects = await ctx.db.all('SELECT id, name, visibility, archived_at FROM projects ORDER BY name');
  const members = new Map((await ctx.db.all('SELECT project_id, permissions FROM project_members WHERE user_id = ?', id)).map((m) => [m.project_id as string, parseJson<string[]>(m.permissions, [])]));
  return projects.map((p) => {
    const member = members.get(p.id) ?? null;
    const effective = u.disabled ? [] : u.permissions.includes('admin') ? u.permissions : member ?? (p.visibility === 'open' ? u.permissions : []);
    return {
      projectId: p.id as string, name: p.name as string, visibility: p.visibility as string, archived: !!p.archived_at,
      member, effective: p.archived_at ? effective.filter((x) => x === 'read') : effective,
    };
  });
}
