// Backup und Wiederherstellung (ADR-015). Portables Format unabhängig vom Datenbankdialekt:
//   manifest.json          Format, Version, Migrationen, Zeilenzahlen, fehlende Objekte
//   db/<tabelle>.jsonl     eine Zeile je Datensatz (Spaltenname → Wert)
//   objects/<schlüssel>    Originaldateien, Uploads und Exporte aus dem Object-Store
// Damit lässt sich auch von SQLite nach PostgreSQL umziehen.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';
import type { Db, Row } from '../db.js';
import { ObjectNotFoundError, type ObjectStore } from '../storage.js';

export const BACKUP_FORMAT = 'onescm-backup';
export const BACKUP_VERSION = 1;
const MIGRATIONS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'migrations');

/** Tabellen in Anlagereihenfolge der Migrationen (Fremdschlüssel zeigen immer auf früher angelegte Tabellen). */
export function backupTables(): string[] {
  const tables: string[] = [];
  for (const f of fs.readdirSync(MIGRATIONS_DIR).filter((x) => x.endsWith('.sql')).sort()) {
    for (const m of fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf8').matchAll(/CREATE TABLE (\w+)/g)) tables.push(m[1]);
  }
  return tables;
}

/** Reihenfolge innerhalb einer Tabelle, falls sie auf sich selbst verweist */
const ROW_ORDER: Record<string, string> = { generated_chapter_versions: 'ORDER BY chapter_id, version_no' };

async function objectKeys(db: Db): Promise<string[]> {
  const keys = new Set<string>();
  for (const r of await db.all<{ k: string }>('SELECT storage_key AS k FROM source_revisions')) keys.add(r.k);
  for (const r of await db.all<{ k: string }>('SELECT storage_key AS k FROM exports WHERE storage_key IS NOT NULL')) keys.add(r.k);
  for (const r of await db.all<{ sha256: string }>('SELECT DISTINCT sha256 FROM imports')) keys.add(`uploads/${r.sha256}`);
  return [...keys].sort();
}

export interface BackupManifest {
  format: string;
  version: number;
  appVersion: string;
  createdAt: string;
  sourceDialect: string;
  migrations: string[];
  tables: Record<string, number>;
  objects: number;
  missingObjects: string[];
}

export async function createBackup(db: Db, store: ObjectStore, appVersion: string): Promise<{ data: Buffer; manifest: BackupManifest }> {
  const zip = new JSZip();
  const manifest: BackupManifest = {
    format: BACKUP_FORMAT, version: BACKUP_VERSION, appVersion, createdAt: new Date().toISOString(), sourceDialect: db.dialect,
    migrations: (await db.all<{ name: string }>('SELECT name FROM schema_migrations ORDER BY name')).map((r) => r.name),
    tables: {}, objects: 0, missingObjects: [],
  };
  // Konsistenter Stand: alle Tabellen aus einem einheitlichen Snapshot lesen (Fremdschlüssel bleiben vollständig)
  await db.tx(async () => {
    for (const t of backupTables()) {
      const rows = await db.all(`SELECT * FROM ${t} ${ROW_ORDER[t] ?? ''}`);
      manifest.tables[t] = rows.length;
      zip.file(`db/${t}.jsonl`, rows.map((r) => JSON.stringify(r)).join('\n'));
    }
  }, { snapshot: true });
  for (const key of await objectKeys(db)) {
    try {
      zip.file(`objects/${key}`, await store.get(key));
      manifest.objects++;
    } catch (e) {
      if (!(e instanceof ObjectNotFoundError)) throw e;
      manifest.missingObjects.push(key);
    }
  }
  zip.file('manifest.json', JSON.stringify(manifest, null, 2));
  return { data: await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }), manifest };
}

export class RestoreError extends Error {}

/**
 * Backup in eine migrierte Datenbank einspielen. Vorhandene Inhalte werden ersetzt; ohne `force` nur,
 * wenn die Ziel-Datenbank noch keine fachlichen Daten enthält (Schutz vor versehentlichem Überschreiben).
 */
export async function restoreBackup(db: Db, store: ObjectStore, data: Buffer, opts: { force?: boolean } = {}) {
  const zip = await JSZip.loadAsync(data);
  const mf = zip.file('manifest.json');
  if (!mf) throw new RestoreError('Kein onescm-Backup: manifest.json fehlt.');
  const manifest = JSON.parse(await mf.async('string')) as BackupManifest;
  if (manifest.format !== BACKUP_FORMAT || manifest.version !== BACKUP_VERSION) throw new RestoreError(`Unbekanntes Backup-Format ${manifest.format}/${manifest.version}.`);
  const applied = (await db.all<{ name: string }>('SELECT name FROM schema_migrations')).map((r) => r.name);
  const unknown = manifest.migrations.filter((m) => !applied.includes(m));
  if (unknown.length) throw new RestoreError(`Backup stammt von einer neueren Version (Migrationen ${unknown.join(', ')}) – bitte zuerst die Anwendung aktualisieren.`);
  const has = async (t: string) => ((await db.get<{ n: number }>(`SELECT COUNT(*) AS n FROM ${t}`))?.n ?? 0) > 0;
  if (!opts.force && ((await has('source_documents')) || (await has('chapters')) || (await has('imports')))) {
    throw new RestoreError('Die Ziel-Datenbank enthält bereits Daten. Zum Ersetzen --force angeben.');
  }

  const tables = backupTables();
  const counts: Record<string, number> = {};
  await db.tx(async () => {
    for (const t of [...tables].reverse()) await db.run(`DELETE FROM ${t}`);
    for (const t of tables) {
      const f = zip.file(`db/${t}.jsonl`);
      const text = f ? await f.async('string') : '';
      const rows: Row[] = text ? text.split('\n').map((l) => JSON.parse(l)) : [];
      for (const r of rows) {
        const cols = Object.keys(r);
        await db.run(`INSERT INTO ${t} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, ...cols.map((c) => r[c]));
      }
      counts[t] = rows.length;
    }
  });
  let objects = 0;
  for (const entry of Object.values(zip.files)) {
    if (entry.dir || !entry.name.startsWith('objects/')) continue;
    await store.put(entry.name.slice('objects/'.length), await entry.async('nodebuffer'));
    objects++;
  }
  return { manifest, restored: counts, objects };
}
