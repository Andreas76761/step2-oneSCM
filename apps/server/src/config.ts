// Laufzeitkonfiguration. ENTSCHEIDUNG(E-xx) verweist auf docs/04-offene-entscheidungen.md
// (am 24.09.2026 als Übernahme der vorläufigen Annahmen entschieden).
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_RULE_SEVERITY } from './domain/contradictions.js';
import { DEFAULT_MODELS, type LlmConfig, type LlmProviderId } from './llm.js';
import { opsFromEnv, type OpsConfig } from './ops.js';
import { embeddingsFromEnv, type EmbeddingConfig } from './embeddings.js';
import { notifyFromEnv, type NotifyConfig } from './notify.js';

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
  /** Ablage der Originaldateien und Exporte (ADR-008) */
  objectStore: ObjectStoreConfig;
  /** KI-Dienst für Umformulierungsvorschläge (ADR-013); null = ausgeschaltet (Standard) */
  llm: LlmConfig | null;
  /** Betrieb: Metriken und Rate-Limiting (ADR-015) */
  ops: OpsConfig;
  /** Embeddings für semantische Suche/hybride Analyse (ADR-017); Standard lokal ohne Netzwerk */
  embeddings: EmbeddingConfig;
  /** Benachrichtigungen per Webhook/E-Mail (ADR-019) */
  notify: NotifyConfig;
  /** Git-Quellverbindungen (ADR-022) */
  git: GitConfig;
  /** Vektorindex der semantischen Suche (ADR-024) */
  vectorIndex: EngineSetting;
}

export type EngineSetting = 'auto' | 'exact' | 'hnsw' | 'pgvector';

export function vectorIndexFromEnv(): EngineSetting {
  const v = (process.env.VECTOR_INDEX ?? 'auto').toLowerCase();
  if (!['auto', 'exact', 'hnsw', 'pgvector'].includes(v)) throw new Error(`VECTOR_INDEX „${v}“ unbekannt (auto, exact, hnsw, pgvector).`);
  return v as EngineSetting;
}

export interface GitConfig {
  /** lokale Repositories (file://, absolute Pfade) zulassen – nur für Tests und abgeschottete Umgebungen */
  allowFile: boolean;
  timeoutMs: number;
}

export type ObjectStoreConfig =
  | { kind: 'local' }
  | { kind: 's3'; bucket: string; prefix?: string; region?: string; endpoint?: string; forcePathStyle?: boolean };

function objectStoreFromEnv(): ObjectStoreConfig {
  if ((process.env.OBJECT_STORE ?? 'local') !== 's3') return { kind: 'local' };
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error('OBJECT_STORE=s3 erfordert S3_BUCKET.');
  return {
    kind: 's3',
    bucket,
    prefix: process.env.S3_PREFIX || undefined,
    region: process.env.S3_REGION || process.env.AWS_REGION || undefined,
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE ? process.env.S3_FORCE_PATH_STYLE === 'true' : undefined,
  };
}

/** ENTSCHEIDUNG(E-16): KI-Umformulierung nur, wenn der Betreiber einen Anbieter konfiguriert. */
function llmFromEnv(): LlmConfig | null {
  const provider = (process.env.LLM_PROVIDER ?? 'none').toLowerCase();
  if (provider === 'none' || provider === '') return null;
  if (!['anthropic', 'openai', 'demo'].includes(provider)) throw new Error('LLM_PROVIDER muss none, anthropic, openai oder demo sein.');
  const id = provider as LlmProviderId;
  const model = process.env.LLM_MODEL || DEFAULT_MODELS[id];
  if (!model) throw new Error(`LLM_PROVIDER=${id} erfordert LLM_MODEL.`);
  const apiKey = process.env.LLM_API_KEY || (id === 'anthropic' ? process.env.ANTHROPIC_API_KEY : id === 'openai' ? process.env.OPENAI_API_KEY : undefined) || undefined;
  if (id === 'anthropic' && !apiKey) throw new Error('LLM_PROVIDER=anthropic erfordert LLM_API_KEY oder ANTHROPIC_API_KEY.');
  return {
    provider: id,
    model,
    apiKey,
    baseUrl: process.env.LLM_BASE_URL || undefined,
    timeoutMs: Number(process.env.LLM_TIMEOUT_MS || 60_000),
    maxTokens: Number(process.env.LLM_MAX_TOKENS || 4000),
  };
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
    objectStore: overrides.objectStore ?? objectStoreFromEnv(),
    llm: overrides.llm !== undefined ? overrides.llm : llmFromEnv(),
    ops: { ...opsFromEnv(), ...overrides.ops },
    embeddings: overrides.embeddings ?? embeddingsFromEnv(),
    notify: { ...notifyFromEnv(), ...overrides.notify },
    vectorIndex: overrides.vectorIndex ?? vectorIndexFromEnv(),
    git: { allowFile: process.env.GIT_ALLOW_FILE === '1', timeoutMs: Number(process.env.GIT_TIMEOUT_MS ?? 120_000), ...overrides.git },
  };
}

/** Standardwerte der fachlichen Einstellungen (in der Tabelle `settings` überschreibbar). */
export const DEFAULT_SETTINGS = {
  // ENTSCHEIDUNG(E-01)
  import: {
    allowedExtensions: ['.md', '.markdown', '.zip', '.html', '.htm', '.docx'],
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
  // Terminologie: seit Etappe 3 eigene Tabelle `terminology_terms` (US-015)
  readability: { maxSentenceWords: 30 },
  // ENTSCHEIDUNG(E-16): Mindestabdeckung der Inhaltswörter eines umformulierten Satzes durch seine Quellen
  rewrite: { minSupport: 0.5 },
  // ADR-017: semantische Suche und optionale hybride Analyse (TF-IDF bleibt Standard, ENTSCHEIDUNG E-05)
  semantic: { analysisMethod: 'tfidf' as 'tfidf' | 'hybrid', embeddingThreshold: 0.85, maxPairDocs: 8000, annThreshold: 20000, annEfSearch: 800 },
};
export type Settings = typeof DEFAULT_SETTINGS;
