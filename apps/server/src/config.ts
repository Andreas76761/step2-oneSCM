// Laufzeitkonfiguration. ENTSCHEIDUNG(E-xx) verweist auf docs/04-offene-entscheidungen.md
// (am 24.09.2026 als Übernahme der vorläufigen Annahmen entschieden).
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_RULE_SEVERITY } from './domain/contradictions.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..', '..');

export interface OidcConfig {
  issuer: string;
  /** erwartete Zielgruppe (`aud`) – Pflicht, damit Tokens anderer Clients/APIs desselben Providers abgelehnt werden */
  audience: string;
  /** Client-ID der Web-UI (Authorization Code + PKCE) */
  clientId: string;
  scope: string;
  jwksUri: string | null;
  /** Inline-JWKS (JSON) – für Tests und abgeschottete Umgebungen */
  jwks: { keys: unknown[] } | null;
  /** Claim mit Gruppen/Rollen des Benutzers, z. B. `roles` oder `groups` (Punktnotation erlaubt) */
  permissionsClaim: string;
  /** Zuordnung Claim-Wert → technische Berechtigungen */
  permissionMap: Record<string, string[]>;
}

export interface AppConfig {
  dataDir: string;
  /** `postgres://…` oder Pfad zur SQLite-Datei */
  database: string;
  port: number;
  host: string;
  webDist: string | null;
  openapiPath: string;
  traceabilityDir: string;
  logger: boolean;
  authMode: 'demo' | 'oidc';
  oidc: OidcConfig | null;
}

/** ENTSCHEIDUNG(E-15): Standard-Zuordnung von IdP-Gruppen zu technischen Berechtigungen. */
export const DEFAULT_PERMISSION_MAP: Record<string, string[]> = {
  'onescm-reader': ['read'],
  'onescm-editor': ['read', 'edit'],
  'onescm-reviewer': ['read', 'edit', 'decide'],
  'onescm-approver': ['read', 'decide', 'approve'],
  'onescm-admin': ['read', 'edit', 'decide', 'approve', 'admin'],
};

function parseJsonEnv<T>(name: string): T | null {
  const v = process.env[name];
  if (!v) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    throw new Error(`Umgebungsvariable ${name} enthält kein gültiges JSON.`);
  }
}

export function loadConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  const dataDir = overrides.dataDir ?? process.env.DATA_DIR ?? path.join(REPO_ROOT, 'data');
  const authMode = overrides.authMode ?? (process.env.AUTH_MODE === 'oidc' ? 'oidc' : 'demo');
  let oidc: OidcConfig | null = overrides.oidc ?? null;
  if (authMode === 'oidc' && !oidc) {
    const issuer = process.env.OIDC_ISSUER;
    const clientId = process.env.OIDC_CLIENT_ID;
    const audience = process.env.OIDC_AUDIENCE;
    if (!issuer || !clientId || !audience) throw new Error('AUTH_MODE=oidc erfordert OIDC_ISSUER, OIDC_CLIENT_ID und OIDC_AUDIENCE.');
    oidc = {
      issuer,
      clientId,
      audience,
      scope: process.env.OIDC_SCOPE ?? 'openid profile',
      jwksUri: process.env.OIDC_JWKS_URI ?? null,
      jwks: parseJsonEnv('OIDC_JWKS'),
      permissionsClaim: process.env.OIDC_PERMISSIONS_CLAIM ?? 'roles',
      permissionMap: parseJsonEnv('OIDC_PERMISSION_MAP') ?? DEFAULT_PERMISSION_MAP,
    };
  }
  return {
    dataDir,
    database: overrides.database ?? process.env.DATABASE_URL ?? process.env.DB_PATH ?? path.join(dataDir, 'onescm.db'),
    port: Number(process.env.PORT ?? 3000),
    host: process.env.HOST ?? '0.0.0.0',
    webDist: overrides.webDist !== undefined ? overrides.webDist : process.env.WEB_DIST ?? path.join(REPO_ROOT, 'apps', 'web', 'dist'),
    openapiPath: overrides.openapiPath ?? path.join(REPO_ROOT, 'openapi', 'openapi.yaml'),
    traceabilityDir: overrides.traceabilityDir ?? path.join(REPO_ROOT, 'traceability'),
    logger: overrides.logger ?? process.env.LOG !== '0',
    authMode,
    oidc,
  };
}

/** Standardwerte der fachlichen Einstellungen (in der Tabelle `settings` überschreibbar). */
export const DEFAULT_SETTINGS = {
  // ENTSCHEIDUNG(E-01)
  import: {
    allowedExtensions: ['.md', '.markdown', '.zip'],
    maxUploadBytes: Number(process.env.UPLOAD_MAX_BYTES ?? 50 * 1024 * 1024),
    maxZipFiles: Number(process.env.ZIP_MAX_FILES ?? 5000),
    maxEntryBytes: 20 * 1024 * 1024,
  },
  // ENTSCHEIDUNG(E-05, E-07)
  analysis: {
    clusterThreshold: 0.55,
    duplicateThreshold: 0.85,
    contradictionThreshold: 0.4,
    crossChapter: true,
    ruleSeverity: DEFAULT_RULE_SEVERITY as Record<string, string>,
  },
  // Terminologie- und Lesbarkeitsregeln (US-015), redaktionell pflegbar
  terminology: [
    { preferred: 'Freigabe', avoid: ['Genehmigung', 'Approval'] },
    { preferred: 'Autohaus', avoid: ['Händlerbetrieb'] },
    { preferred: 'anmelden', avoid: ['einloggen'] },
  ] as { preferred: string; avoid: string[] }[],
  readability: { maxSentenceWords: 30 },
};
export type Settings = typeof DEFAULT_SETTINGS;
