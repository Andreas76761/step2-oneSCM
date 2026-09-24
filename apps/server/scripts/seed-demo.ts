// Lädt die fiktiven Demo-Quellen in die konfigurierte Datenbank (SQLite oder DATABASE_URL) und startet die Qualitätsanalyse.
import path from 'node:path';
import { buildApp } from '../src/app.js';
import { REPO_ROOT } from '../src/config.js';
import { startAnalysis } from '../src/services/analysis.js';
import { createImport, getImport } from '../src/services/imports.js';
import { buildDemoZip } from './demo-zip.js';

const { app, ctx } = await buildApp({ logger: false, webDist: null, authMode: 'demo' });
const zip = await buildDemoZip(path.join(REPO_ROOT, 'demo-data'));
const imp = await createImport(ctx, 'onescm-demo.zip', zip, 'u-admin');
await ctx.jobs.idle();
const result = await getImport(ctx, imp.id);
console.log(`Import ${result.status} (${ctx.db.dialect}):`, result.stats);
for (const i of result.items) console.log(`  ${i.status.padEnd(10)} ${i.path} ${i.message ?? ''}`);
await startAnalysis(ctx, 'u-admin');
await ctx.jobs.idle();
const findings = await ctx.db.all("SELECT seq, type, subtype, severity, reason FROM quality_findings WHERE status = 'open' ORDER BY seq");
console.log(`\n${findings.length} offene Befunde:`);
for (const f of findings) console.log(`  #${f.seq} [${f.severity}] ${f.type}/${f.subtype}: ${f.reason}`);
await app.close();
