// Datenbankzugriff (ADR-003). Alle Services greifen ausschließlich über diese Klasse zu.
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const MIGRATIONS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

export type Row = Record<string, any>;

export class Db {
  readonly raw: Database.Database;

  constructor(file: string) {
    if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
    this.raw = new Database(file);
    this.raw.pragma('journal_mode = WAL');
    this.raw.pragma('foreign_keys = ON');
    this.migrate();
  }

  private migrate() {
    this.raw.exec('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)');
    const applied = new Set(this.all<{ name: string }>('SELECT name FROM schema_migrations').map((r) => r.name));
    for (const file of fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort()) {
      if (applied.has(file)) continue;
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      this.tx(() => {
        this.raw.exec(sql);
        this.run('INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)', file, now());
      });
    }
  }

  all<T = Row>(sql: string, ...params: unknown[]): T[] {
    return this.raw.prepare(sql).all(...params) as T[];
  }
  get<T = Row>(sql: string, ...params: unknown[]): T | undefined {
    return this.raw.prepare(sql).get(...params) as T | undefined;
  }
  run(sql: string, ...params: unknown[]) {
    return this.raw.prepare(sql).run(...params);
  }
  tx<T>(fn: () => T): T {
    return this.raw.transaction(fn)();
  }
  /** Fortlaufende, lesbare Nummer (#34) für Tabellen mit Spalte `seq`. */
  nextSeq(table: 'text_snippets' | 'quality_findings'): number {
    return (this.get<{ m: number | null }>(`SELECT MAX(seq) AS m FROM ${table}`)?.m ?? 0) + 1;
  }
  close() {
    this.raw.close();
  }
}

export const newId = (prefix: string) => `${prefix}_${randomUUID()}`;
export const now = () => new Date().toISOString();
export const json = (v: unknown) => JSON.stringify(v ?? null);
export const parseJson = <T = any>(v: string | null | undefined, fallback: T): T => {
  if (v == null) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
};
