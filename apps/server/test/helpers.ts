// Testumgebung: SQLite (Standard) oder PostgreSQL, wenn TEST_DATABASE_URL gesetzt ist.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import pg from 'pg';

export const TEST_PG = process.env.TEST_DATABASE_URL ?? null;

/** Frische, leere Datenbank: SQLite-Datei im Temp-Verzeichnis oder zurückgesetztes PostgreSQL-Schema. */
export async function freshDatabase(dataDir: string, name = 'test'): Promise<string> {
  if (!TEST_PG) return path.join(dataDir, `${name}.db`);
  const client = new pg.Client({ connectionString: TEST_PG });
  await client.connect();
  await client.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
  await client.end();
  return TEST_PG;
}

export const tempDir = () => fs.mkdtempSync(path.join(os.tmpdir(), 'onescm-test-'));
