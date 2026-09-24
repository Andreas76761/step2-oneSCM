// Betriebswerkzeuge (ADR-015). Nutzt dieselbe Konfiguration wie der Server (DATABASE_URL, OBJECT_STORE, S3_* …).
//   node dist/cli.js backup  --out backup.zip
//   node dist/cli.js restore --in backup.zip [--force]
import fs from 'node:fs';
import path from 'node:path';
import { loadConfig } from './config.js';
import { openDb } from './db.js';
import { createBackup, restoreBackup, RestoreError } from './services/backup.js';
import { createObjectStore } from './storage.js';

const [cmd, ...rest] = process.argv.slice(2);
// Relative Pfade gelten ab dem Aufrufverzeichnis (auch bei `npm run backup` aus dem Repository-Wurzelverzeichnis)
const arg = (name: string) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 && rest[i + 1] ? path.resolve(process.env.INIT_CWD ?? process.cwd(), rest[i + 1]) : undefined;
};
const usage = () => {
  console.error('Verwendung: cli backup --out <datei.zip> | cli restore --in <datei.zip> [--force]');
  process.exit(2);
};

const config = loadConfig({ logger: false });
const db = await openDb(config.database);
const store = createObjectStore(config.objectStore, config.dataDir);
try {
  if (cmd === 'backup') {
    const out = arg('out') ?? usage();
    const { data, manifest } = await createBackup(db, store, process.env.npm_package_version ?? 'unbekannt');
    fs.writeFileSync(out!, data);
    const rows = Object.values(manifest.tables).reduce((a, b) => a + b, 0);
    console.log(`Backup ${out}: ${rows} Datensätze in ${Object.keys(manifest.tables).length} Tabellen, ${manifest.objects} Objekte (${(data.length / 1024).toFixed(0)} KB, Quelle ${manifest.sourceDialect}).`);
    if (manifest.missingObjects.length) console.warn(`Warnung: ${manifest.missingObjects.length} Objekte fehlten im Object-Store:`, manifest.missingObjects.slice(0, 10));
  } else if (cmd === 'restore') {
    const input = arg('in') ?? usage();
    const r = await restoreBackup(db, store, fs.readFileSync(input!), { force: rest.includes('--force') });
    const rows = Object.values(r.restored).reduce((a, b) => a + b, 0);
    console.log(`Wiederhergestellt aus ${input} (${r.manifest.createdAt}, Quelle ${r.manifest.sourceDialect}) nach ${db.dialect}: ${rows} Datensätze, ${r.objects} Objekte.`);
  } else usage();
} catch (e) {
  if (e instanceof RestoreError) {
    console.error(`Fehler: ${e.message}`);
    process.exitCode = 1;
  } else throw e;
} finally {
  await db.close();
}
