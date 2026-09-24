// Anwendungskontext, Stammdaten, Einstellungen, Benutzer und Audit.
import type { AppConfig, Settings } from './config.js';
import { DEFAULT_SETTINGS } from './config.js';
import { json, newId, now, parseJson, type Db } from './db.js';
import { DEMO_USERS, DIVISIONS, ROLES, type Permission } from './domain/reference.js';
import type { JobQueue } from './jobs.js';
import type { LlmProvider } from './llm.js';
import { forbidden } from './problem.js';
import type { ObjectStore } from './storage.js';

export const DEFAULT_PROJECT_ID = 'p_default';

export interface Ctx {
  db: Db;
  store: ObjectStore;
  jobs: JobQueue;
  config: AppConfig;
  /** KI-Dienst für Umformulierungsvorschläge; null = ausgeschaltet */
  llm: LlmProvider | null;
  projectId: string;
  log: (msg: string, extra?: unknown) => void;
}

export interface User {
  id: string;
  name: string;
  permissions: string[];
}

export async function seedReferenceData(db: Db, authMode: AppConfig['authMode']) {
  await db.tx(async () => {
    await db.run('INSERT INTO projects (id, name, created_at) VALUES (?, ?, ?) ON CONFLICT (id) DO NOTHING', DEFAULT_PROJECT_ID, 'oneSCM Benutzerhandbuch', now());
    for (const r of ROLES) {
      await db.run(
        'INSERT INTO roles (code, label, icon, color, description) VALUES (?, ?, ?, ?, ?) ON CONFLICT (code) DO UPDATE SET label = excluded.label, icon = excluded.icon, color = excluded.color, description = excluded.description',
        r.code, r.label, r.icon, r.color, r.description,
      );
    }
    for (const d of DIVISIONS) {
      await db.run(
        'INSERT INTO divisions (code, label, icon, color) VALUES (?, ?, ?, ?) ON CONFLICT (code) DO UPDATE SET label = excluded.label, icon = excluded.icon, color = excluded.color',
        d.code, d.label, d.icon, d.color,
      );
    }
    // Demo-Benutzer nur im Demo-Modus (ENTSCHEIDUNG E-15)
    if (authMode === 'demo') {
      for (const u of DEMO_USERS) {
        await db.run('INSERT INTO users (id, name, permissions) VALUES (?, ?, ?) ON CONFLICT (id) DO UPDATE SET name = excluded.name, permissions = excluded.permissions', u.id, u.name, json(u.permissions));
      }
    }
  });
}

export async function getSettings(db: Db): Promise<Settings> {
  const out: any = structuredClone(DEFAULT_SETTINGS);
  for (const row of await db.all<{ key: string; value: string }>('SELECT key, value FROM settings')) {
    const v = parseJson<any>(row.value, null);
    if (v !== null && row.key in out) out[row.key] = typeof v === 'object' && !Array.isArray(v) ? { ...out[row.key], ...v } : v;
  }
  return out as Settings;
}

export async function saveSettings(db: Db, patch: Partial<Settings>) {
  await db.tx(async () => {
    for (const [key, value] of Object.entries(patch)) {
      if (!(key in DEFAULT_SETTINGS)) continue;
      await db.run('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value', key, json(value));
    }
  });
}

/** Demo-Modus: Benutzer über Header X-User-Id; ohne Header nur Lesezugriff. */
export async function resolveDemoUser(db: Db, userId: string | undefined): Promise<User> {
  const row = await db.get<{ id: string; name: string; permissions: string }>('SELECT * FROM users WHERE id = ?', userId ?? 'u-leser');
  if (!row) return { id: 'anonymous', name: 'Anonym', permissions: ['read'] };
  return { id: row.id, name: row.name, permissions: parseJson(row.permissions, []) };
}

export function requirePermission(user: User, perm: Permission) {
  if (!user.permissions.includes(perm) && !user.permissions.includes('admin')) {
    throw forbidden(`Benutzer „${user.name}“ fehlt die technische Berechtigung „${perm}“.`);
  }
}

/** Audit-Eintrag; mit Kontext im Projekt, mit reiner Datenbank systemweit (z. B. Einstellungen, Projektverwaltung). */
export async function audit(scope: Pick<Ctx, 'db' | 'projectId'> | Db, actor: string, action: string, entityType: string, entityId: string, details: unknown = {}) {
  const [db, projectId] = 'projectId' in scope ? [scope.db, scope.projectId] : [scope, null];
  await db.run(
    'INSERT INTO audit_events (id, at, actor, action, entity_type, entity_id, details, project_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    newId('ae'), now(), actor, action, entityType, entityId, json(details), projectId,
  );
}
