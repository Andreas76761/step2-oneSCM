// Anwendungskontext, Stammdaten, Einstellungen, Benutzer und Audit.
import type { AppConfig, Settings } from './config.js';
import { DEFAULT_SETTINGS } from './config.js';
import { Db, json, newId, now, parseJson } from './db.js';
import { DEMO_USERS, DIVISIONS, ROLES, type Permission } from './domain/reference.js';
import { JobQueue } from './jobs.js';
import { forbidden } from './problem.js';
import type { ObjectStore } from './storage.js';

export const DEFAULT_PROJECT_ID = 'p_default';

export interface Ctx {
  db: Db;
  store: ObjectStore;
  jobs: JobQueue;
  config: AppConfig;
  projectId: string;
  log: (msg: string, extra?: unknown) => void;
}

export interface User {
  id: string;
  name: string;
  permissions: string[];
}

export function seedReferenceData(db: Db) {
  db.tx(() => {
    if (!db.get('SELECT id FROM projects WHERE id = ?', DEFAULT_PROJECT_ID)) {
      db.run('INSERT INTO projects (id, name, created_at) VALUES (?, ?, ?)', DEFAULT_PROJECT_ID, 'oneSCM Benutzerhandbuch', now());
    }
    for (const r of ROLES) db.run('INSERT OR REPLACE INTO roles (code, label, icon, color, description) VALUES (?, ?, ?, ?, ?)', r.code, r.label, r.icon, r.color, r.description);
    for (const d of DIVISIONS) db.run('INSERT OR REPLACE INTO divisions (code, label, icon, color) VALUES (?, ?, ?, ?)', d.code, d.label, d.icon, d.color);
    for (const u of DEMO_USERS) db.run('INSERT OR REPLACE INTO users (id, name, permissions) VALUES (?, ?, ?)', u.id, u.name, json(u.permissions));
  });
}

export function getSettings(db: Db): Settings {
  const out: any = structuredClone(DEFAULT_SETTINGS);
  for (const row of db.all<{ key: string; value: string }>('SELECT key, value FROM settings')) {
    const v = parseJson<any>(row.value, null);
    if (v !== null && row.key in out) out[row.key] = typeof v === 'object' && !Array.isArray(v) ? { ...out[row.key], ...v } : v;
  }
  return out as Settings;
}

export function saveSettings(db: Db, patch: Partial<Settings>) {
  db.tx(() => {
    for (const [key, value] of Object.entries(patch)) {
      if (!(key in DEFAULT_SETTINGS)) continue;
      db.run('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', key, json(value));
    }
  });
}

/** ANNAHME(E-15): Demo-Authentifizierung über Header X-User-Id; ohne Header nur Lesezugriff. */
export function resolveUser(db: Db, userId: string | undefined): User {
  const row = db.get<{ id: string; name: string; permissions: string }>('SELECT * FROM users WHERE id = ?', userId ?? 'u-leser');
  if (!row) return { id: 'anonymous', name: 'Anonym', permissions: ['read'] };
  return { id: row.id, name: row.name, permissions: parseJson(row.permissions, []) };
}

export function requirePermission(user: User, perm: Permission) {
  if (!user.permissions.includes(perm) && !user.permissions.includes('admin')) {
    throw forbidden(`Benutzer „${user.name}“ fehlt die technische Berechtigung „${perm}“.`);
  }
}

export function audit(db: Db, actor: string, action: string, entityType: string, entityId: string, details: unknown = {}) {
  db.run('INSERT INTO audit_events (id, at, actor, action, entity_type, entity_id, details) VALUES (?, ?, ?, ?, ?, ?, ?)', newId('ae'), now(), actor, action, entityType, entityId, json(details));
}
