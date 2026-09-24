// Laufzeitkonfiguration. Werte mit ANNAHME-Markierung sind vorläufige Annahmen zu offenen P0-Entscheidungen.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_RULE_SEVERITY } from './domain/contradictions.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(here, '..', '..', '..');

export interface AppConfig {
  dataDir: string;
  dbPath: string;
  port: number;
  host: string;
  webDist: string | null;
  openapiPath: string;
  traceabilityDir: string;
  logger: boolean;
}

export function loadConfig(overrides: Partial<AppConfig> = {}): AppConfig {
  const dataDir = overrides.dataDir ?? process.env.DATA_DIR ?? path.join(REPO_ROOT, 'data');
  return {
    dataDir,
    dbPath: overrides.dbPath ?? process.env.DB_PATH ?? path.join(dataDir, 'onescm.db'),
    port: Number(process.env.PORT ?? 3000),
    host: process.env.HOST ?? '0.0.0.0',
    webDist: overrides.webDist !== undefined ? overrides.webDist : process.env.WEB_DIST ?? path.join(REPO_ROOT, 'apps', 'web', 'dist'),
    openapiPath: overrides.openapiPath ?? path.join(REPO_ROOT, 'openapi', 'openapi.yaml'),
    traceabilityDir: overrides.traceabilityDir ?? path.join(REPO_ROOT, 'traceability'),
    logger: overrides.logger ?? process.env.LOG !== '0',
  };
}

/** Standardwerte der fachlichen Einstellungen (in der Tabelle `settings` überschreibbar). */
export const DEFAULT_SETTINGS = {
  // ANNAHME(E-01)
  import: {
    allowedExtensions: ['.md', '.markdown', '.zip'],
    maxUploadBytes: Number(process.env.UPLOAD_MAX_BYTES ?? 50 * 1024 * 1024),
    maxZipFiles: Number(process.env.ZIP_MAX_FILES ?? 5000),
    maxEntryBytes: 20 * 1024 * 1024,
  },
  // ANNAHME(E-05, E-07)
  analysis: {
    clusterThreshold: 0.55,
    duplicateThreshold: 0.85,
    contradictionThreshold: 0.4,
    crossChapter: true,
    ruleSeverity: DEFAULT_RULE_SEVERITY as Record<string, string>,
  },
  // ANNAHME: Terminologie- und Lesbarkeitsregeln (P1, US-015)
  terminology: [
    { preferred: 'Freigabe', avoid: ['Genehmigung', 'Approval'] },
    { preferred: 'Autohaus', avoid: ['Händlerbetrieb'] },
    { preferred: 'anmelden', avoid: ['einloggen'] },
  ] as { preferred: string; avoid: string[] }[],
  readability: { maxSentenceWords: 30 },
};
export type Settings = typeof DEFAULT_SETTINGS;
