// API-Tokens für Maschinen (ADR-028): projektgebunden, mit Scopes und Ablaufdatum; gespeichert wird nur der SHA-256-Hash.
import { randomBytes } from 'node:crypto';
import { audit, type Ctx, type User } from '../context.js';
import { json, newId, now, parseJson, type Row } from '../db.js';
import { PERMISSIONS } from '../domain/reference.js';
import { sha256 } from '../domain/similarity.js';
import { badRequest, notFound } from '../problem.js';

export const TOKEN_PREFIX = 'oscm_';
const MAX_DAYS = 365;

function dto(r: Row) {
  return {
    id: r.id, name: r.name, prefix: r.prefix, scopes: parseJson<string[]>(r.scopes, []), expiresAt: r.expires_at, createdBy: r.created_by, createdAt: r.created_at,
    lastUsedAt: r.last_used_at ?? null, revokedAt: r.revoked_at ?? null, revokedBy: r.revoked_by ?? null,
    status: r.revoked_at ? 'revoked' : r.expires_at < now() ? 'expired' : 'active',
  };
}

export async function listTokens(ctx: Ctx) {
  return (await ctx.db.all('SELECT * FROM api_tokens WHERE project_id = ? ORDER BY created_at DESC', ctx.projectId)).map(dto);
}

/** Token erstellen; Scopes höchstens die (Projekt-)Berechtigungen der erstellenden Person. Klartext nur in dieser Antwort. */
export async function createToken(ctx: Ctx, input: { name?: string; scopes?: string[]; expiresInDays?: number }, user: User) {
  if (user.token) throw badRequest('API-Tokens können keine weiteren Tokens erstellen.');
  const name = String(input.name ?? '').trim();
  if (!name || name.length > 80) throw badRequest('Name (1–80 Zeichen) erforderlich.');
  const scopes = [...new Set((input.scopes ?? ['read']).map(String))];
  const unknown = scopes.filter((s) => !(PERMISSIONS as readonly string[]).includes(s));
  if (unknown.length || !scopes.length) throw badRequest(`Unbekannte Scopes: ${unknown.join(', ') || '(leer)'}. Erlaubt: ${PERMISSIONS.join(', ')}.`);
  const own = user.permissions.includes('admin') ? PERMISSIONS : user.permissions;
  const beyond = scopes.filter((s) => !(own as readonly string[]).includes(s));
  if (beyond.length) throw badRequest(`Scopes über die eigenen Berechtigungen hinaus: ${beyond.join(', ')}.`);
  const days = Number(input.expiresInDays ?? 90);
  if (!Number.isInteger(days) || days < 1 || days > MAX_DAYS) throw badRequest(`Gültigkeit 1 … ${MAX_DAYS} Tage.`);
  const id = newId('tok');
  const secret = randomBytes(24).toString('base64url');
  const token = `${TOKEN_PREFIX}${secret}`;
  const expiresAt = new Date(Date.now() + days * 86_400_000).toISOString();
  await ctx.db.tx(async () => {
    await ctx.db.run(
      'INSERT INTO api_tokens (id, project_id, name, token_hash, prefix, scopes, expires_at, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      id, ctx.projectId, name, sha256(token), token.slice(0, 12), json(scopes), expiresAt, user.id, now(),
    );
    await audit(ctx, user.id, 'api_token.created', 'api_token', id, { name, scopes, expiresAt });
  });
  return { ...dto((await ctx.db.get('SELECT * FROM api_tokens WHERE id = ?', id))!), token };
}

export async function revokeToken(ctx: Ctx, id: string, user: User) {
  const r = await ctx.db.get('SELECT * FROM api_tokens WHERE id = ? AND project_id = ?', id, ctx.projectId);
  if (!r) throw notFound(`API-Token ${id}`);
  if (!r.revoked_at) {
    await ctx.db.tx(async () => {
      await ctx.db.run('UPDATE api_tokens SET revoked_at = ?, revoked_by = ? WHERE id = ?', now(), user.id, id);
      await audit(ctx, user.id, 'api_token.revoked', 'api_token', id, {});
    });
  }
  return dto((await ctx.db.get('SELECT * FROM api_tokens WHERE id = ?', id))!);
}

/** Bearer-Token prüfen; liefert den Token-Prinzipal oder null (kein oscm_-Token) */
export async function tokenPrincipal(db: Ctx['db'], bearer: string): Promise<User | { error: string } | null> {
  if (!bearer.startsWith(TOKEN_PREFIX)) return null;
  const r = await db.get('SELECT * FROM api_tokens WHERE token_hash = ?', sha256(bearer));
  if (!r) return { error: 'API-Token unbekannt.' };
  if (r.revoked_at) return { error: 'API-Token wurde widerrufen.' };
  if (r.expires_at < now()) return { error: 'API-Token ist abgelaufen.' };
  // Tokens gesperrter Benutzer gelten nicht (ADR-045)
  if ((await db.get('SELECT disabled_at FROM users WHERE id = ?', r.created_by))?.disabled_at) return { error: 'Ersteller des API-Tokens ist gesperrt.' };
  // Nutzung höchstens alle 5 Minuten schreiben (keine Schreiblast je Anfrage)
  if (!r.last_used_at || Date.parse(r.last_used_at) < Date.now() - 300_000) await db.run('UPDATE api_tokens SET last_used_at = ? WHERE id = ?', now(), r.id);
  const scopes = parseJson<string[]>(r.scopes, []);
  // global ohne Berechtigungen – wirksam sind nur die Scopes im gebundenen Projekt
  return { id: `token:${r.id}`, name: `API-Token „${r.name}“`, permissions: [], token: { id: r.id, projectId: r.project_id, scopes } };
}
