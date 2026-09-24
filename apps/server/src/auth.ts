// Authentifizierung (ENTSCHEIDUNG E-15, ADR-009).
// - demo: Demo-Benutzer über Header X-User-Id (nur Entwicklung/Demo)
// - oidc: Bearer-Token (JWT) eines OpenID-Connect-Providers; Signatur über JWKS geprüft.
//   Technische Berechtigungen werden aus einem Claim (z. B. `roles`/`groups`) abgeleitet.
//   Fachliche Rollen (Dealer, Markt, MO, HQ) bleiben davon unabhängig.
import { createLocalJWKSet, createRemoteJWKSet, jwtVerify, type JWTPayload, type JWTVerifyGetKey } from 'jose';
import type { OidcConfig } from './config.js';
import { resolveDemoUser, type Ctx, type User } from './context.js';
import { json } from './db.js';
import { PERMISSIONS } from './domain/reference.js';
import { Problem } from './problem.js';

export const unauthorized = (detail: string) => new Problem(401, 'Unauthorized', detail);

let cachedKeys: { issuer: string; getKey: JWTVerifyGetKey } | null = null;

async function keysFor(oidc: OidcConfig): Promise<JWTVerifyGetKey> {
  if (cachedKeys?.issuer === oidc.issuer) return cachedKeys.getKey;
  let getKey: JWTVerifyGetKey;
  if (oidc.jwks) getKey = createLocalJWKSet(oidc.jwks as any);
  else {
    let uri = oidc.jwksUri;
    if (!uri) {
      const res = await fetch(`${oidc.issuer.replace(/\/$/, '')}/.well-known/openid-configuration`);
      if (!res.ok) throw new Error(`OIDC-Discovery fehlgeschlagen (${res.status})`);
      uri = ((await res.json()) as { jwks_uri: string }).jwks_uri;
    }
    getKey = createRemoteJWKSet(new URL(uri));
  }
  cachedKeys = { issuer: oidc.issuer, getKey };
  return getKey;
}

/** Wert eines (ggf. verschachtelten) Claims, z. B. `realm_access.roles`. */
function claim(payload: JWTPayload, name: string): unknown {
  return name.split('.').reduce<any>((o, k) => (o == null ? undefined : o[k]), payload);
}

export function permissionsFromClaims(payload: JWTPayload, oidc: Pick<OidcConfig, 'permissionsClaim' | 'permissionMap'>): string[] {
  const raw = claim(payload, oidc.permissionsClaim);
  const values = Array.isArray(raw) ? raw.map(String) : typeof raw === 'string' ? raw.split(/[\s,]+/) : [];
  const perms = new Set<string>();
  for (const v of values) {
    for (const p of oidc.permissionMap[v] ?? []) perms.add(p);
    if ((PERMISSIONS as readonly string[]).includes(v)) perms.add(v); // direkte Berechtigungsnamen
  }
  return [...perms];
}

export async function verifyToken(token: string, oidc: OidcConfig): Promise<JWTPayload> {
  if (!oidc.audience) throw new Error('OIDC_AUDIENCE ist nicht konfiguriert.');
  const { payload } = await jwtVerify(token, await keysFor(oidc), {
    issuer: oidc.issuer,
    audience: oidc.audience, // immer prüfen: verhindert, dass Tokens anderer Clients/APIs akzeptiert werden
    clockTolerance: 30,
  });
  return payload;
}

export async function authenticate(ctx: Ctx, headers: Record<string, string | string[] | undefined>): Promise<User> {
  const h = (name: string) => {
    const v = headers[name];
    return Array.isArray(v) ? v[0] : v;
  };
  if (ctx.config.authMode === 'demo') return resolveDemoUser(ctx.db, h('x-user-id'));

  const oidc = ctx.config.oidc!;
  const auth = h('authorization');
  if (!auth?.startsWith('Bearer ')) throw unauthorized('Anmeldung erforderlich (Bearer-Token fehlt).');
  let payload: JWTPayload;
  try {
    payload = await verifyToken(auth.slice(7), oidc);
  } catch (e) {
    throw unauthorized(`Token ungültig: ${(e as Error).message}`);
  }
  if (!payload.sub) throw unauthorized('Token ohne Subject (sub).');
  const user: User = {
    id: `oidc:${payload.sub}`,
    name: String(payload.name ?? payload.preferred_username ?? payload.sub),
    permissions: permissionsFromClaims(payload, oidc),
  };
  // Anzeigename und Berechtigungen für Audit-Auswertungen aktuell halten
  // E-Mail nur aus bestätigtem Claim (für Benachrichtigungen, ADR-019)
  const email = typeof payload.email === 'string' && payload.email_verified !== false ? payload.email : null;
  await ctx.db.run(
    'INSERT INTO users (id, name, permissions, email) VALUES (?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET name = excluded.name, permissions = excluded.permissions, email = excluded.email',
    user.id, user.name, json(user.permissions), email,
  );
  return user;
}
