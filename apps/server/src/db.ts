// Datenbankzugriff (ADR-003). Alle Services greifen ausschließlich über diese Schnittstelle zu.
// Zwei Implementierungen: SQLite (Demo/Test, better-sqlite3) und PostgreSQL (Produktion, pg).
// SQL wird im gemeinsamen Dialekt geschrieben (?-Platzhalter, ON CONFLICT, camelCase-Aliase);
// der PostgreSQL-Adapter übersetzt Platzhalter und quotiert Aliase.
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import pg from 'pg';

const MIGRATIONS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'migrations');

export type Row = Record<string, any>;
export type Dialect = 'sqlite' | 'postgres';

export interface Db {
  readonly dialect: Dialect;
  all<T = Row>(sql: string, ...params: unknown[]): Promise<T[]>;
  get<T = Row>(sql: string, ...params: unknown[]): Promise<T | undefined>;
  run(sql: string, ...params: unknown[]): Promise<{ changes: number }>;
  /**
   * Transaktion; verschachtelte Aufrufe laufen in der äußeren Transaktion mit.
   * `snapshot`: nur lesend mit einheitlichem Datenstand für alle Abfragen (PostgreSQL: REPEATABLE READ).
   */
  tx<T>(fn: () => Promise<T>, opts?: { snapshot?: boolean }): Promise<T>;
  /** Fortlaufende, lesbare Nummer (#34) für Tabellen mit Spalte `seq`. */
  nextSeq(table: 'text_snippets' | 'quality_findings'): Promise<number>;
  /** Führt `fn` außerhalb eines Transaktionskontexts aus (für Timer/Hintergrundarbeit, die sonst die Transaktion erben würde). */
  outside<T>(fn: () => T): T;
  close(): Promise<void>;
}

function migrationFiles() {
  return fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort();
}

async function migrate(db: Db, exec: (sql: string) => Promise<void>, translate: (sql: string) => string = (s) => s) {
  await exec('CREATE TABLE IF NOT EXISTS schema_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)');
  const applied = new Set((await db.all<{ name: string }>('SELECT name FROM schema_migrations')).map((r) => r.name));
  for (const file of migrationFiles()) {
    if (applied.has(file)) continue;
    const sql = translate(fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'));
    await db.tx(async () => {
      await exec(sql);
      await db.run('INSERT INTO schema_migrations (name, applied_at) VALUES (?, ?)', file, now());
    });
  }
}

// ---------------------------------------------------------------- SQLite

class SqliteDb implements Db {
  readonly dialect = 'sqlite' as const;
  private readonly raw: Database.Database;
  private readonly als = new AsyncLocalStorage<true>();
  /** Offene Transaktion (eine Verbindung → Transaktionen werden serialisiert). */
  private lock: Promise<void> | null = null;

  constructor(file: string) {
    if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
    this.raw = new Database(file);
    this.raw.pragma('journal_mode = WAL');
    this.raw.pragma('foreign_keys = ON');
    this.raw.pragma('busy_timeout = 5000');
  }

  init() {
    return migrate(this, async (sql) => void this.raw.exec(sql));
  }

  /** Außerhalb einer Transaktion warten, bis eine fremde Transaktion abgeschlossen ist. */
  private async ready() {
    if (this.als.getStore()) return;
    while (this.lock) await this.lock;
  }

  async all<T = Row>(sql: string, ...params: unknown[]) {
    await this.ready();
    return this.raw.prepare(sql).all(...params) as T[];
  }
  async get<T = Row>(sql: string, ...params: unknown[]) {
    await this.ready();
    return this.raw.prepare(sql).get(...params) as T | undefined;
  }
  async run(sql: string, ...params: unknown[]) {
    await this.ready();
    return { changes: this.raw.prepare(sql).run(...params).changes };
  }

  // SQLite: BEGIN IMMEDIATE hält die Schreibsperre – alle Abfragen sehen denselben Stand (auch für `snapshot`)
  async tx<T>(fn: () => Promise<T>, _opts?: { snapshot?: boolean }): Promise<T> {
    if (this.als.getStore()) return fn();
    while (this.lock) await this.lock;
    let release!: () => void;
    this.lock = new Promise<void>((r) => (release = r));
    try {
      this.raw.exec('BEGIN IMMEDIATE');
      try {
        const result = await this.als.run(true, fn);
        this.raw.exec('COMMIT');
        return result;
      } catch (e) {
        this.raw.exec('ROLLBACK');
        throw e;
      }
    } finally {
      this.lock = null;
      release();
    }
  }

  async nextSeq(table: 'text_snippets' | 'quality_findings') {
    return ((await this.get<{ m: number | null }>(`SELECT MAX(seq) AS m FROM ${table}`))?.m ?? 0) + 1;
  }

  outside<T>(fn: () => T): T {
    return this.als.exit(fn);
  }

  async close() {
    while (this.lock) await this.lock;
    this.raw.close();
  }
}

// ---------------------------------------------------------------- PostgreSQL

// BIGINT (COUNT/SUM) und NUMERIC als Zahl liefern
pg.types.setTypeParser(20, (v) => Number.parseInt(v, 10));
pg.types.setTypeParser(1700, (v) => Number.parseFloat(v));

/** ?-Platzhalter → $n (außerhalb von String-Literalen), camelCase-Aliase quotieren. */
export function toPostgresSql(sql: string): string {
  let out = '';
  let n = 0;
  let inString = false;
  for (let i = 0; i < sql.length; i++) {
    const c = sql[i];
    if (c === "'") inString = !inString;
    out += !inString && c === '?' ? `$${++n}` : c;
  }
  return out.replace(/\bAS\s+([a-z][a-z0-9_]*[A-Z][A-Za-z0-9_]*)\b/g, 'AS "$1"');
}

/** Migrationen: REAL (float4) → DOUBLE PRECISION, damit Scores exakt bleiben. */
const translateMigration = (sql: string) => sql.replace(/\bREAL\b/g, 'DOUBLE PRECISION');

class PostgresDb implements Db {
  readonly dialect = 'postgres' as const;
  private readonly pool: pg.Pool;
  private readonly als = new AsyncLocalStorage<pg.PoolClient>();

  constructor(connectionString: string) {
    this.pool = new pg.Pool({ connectionString, max: Number(process.env.DB_POOL_SIZE ?? 10) });
  }

  init() {
    return migrate(this, async (sql) => void (await this.client().query(sql)), translateMigration);
  }

  private client(): pg.Pool | pg.PoolClient {
    return this.als.getStore() ?? this.pool;
  }

  private async query(sql: string, params: unknown[]) {
    return this.client().query(toPostgresSql(sql), params);
  }

  async all<T = Row>(sql: string, ...params: unknown[]) {
    return (await this.query(sql, params)).rows as T[];
  }
  async get<T = Row>(sql: string, ...params: unknown[]) {
    return (await this.query(sql, params)).rows[0] as T | undefined;
  }
  async run(sql: string, ...params: unknown[]) {
    return { changes: (await this.query(sql, params)).rowCount ?? 0 };
  }

  async tx<T>(fn: () => Promise<T>, opts?: { snapshot?: boolean }): Promise<T> {
    if (this.als.getStore()) return fn();
    const client = await this.pool.connect();
    try {
      // READ COMMITTED sieht je Abfrage einen neuen Stand; für konsistente Backups ein fester Snapshot
      await client.query(opts?.snapshot ? 'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY' : 'BEGIN');
      const result = await this.als.run(client, fn);
      await client.query('COMMIT');
      return result;
    } catch (e) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw e;
    } finally {
      client.release();
    }
  }

  async nextSeq(table: 'text_snippets' | 'quality_findings') {
    // Serialisierung über eine transaktionsgebundene Advisory-Sperre je Tabelle
    if (this.als.getStore()) await this.run('SELECT pg_advisory_xact_lock(hashtext(?))', table);
    return ((await this.get<{ m: number | null }>(`SELECT MAX(seq) AS m FROM ${table}`))?.m ?? 0) + 1;
  }

  outside<T>(fn: () => T): T {
    return this.als.exit(fn);
  }

  async close() {
    await this.pool.end();
  }
}

// ---------------------------------------------------------------- Fabrik & Hilfen

/** `postgres://…` → PostgreSQL, sonst Pfad einer SQLite-Datei. */
export async function openDb(target: string): Promise<Db> {
  if (/^postgres(ql)?:\/\//.test(target)) {
    const db = new PostgresDb(target);
    await db.init();
    return db;
  }
  const db = new SqliteDb(target);
  await db.init();
  return db;
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
