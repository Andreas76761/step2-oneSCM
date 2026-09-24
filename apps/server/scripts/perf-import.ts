// Lasttest (ADR-015): erzeugt N fiktive Markdown-Dateien, importiert sie als ZIP, analysiert und generiert alle Kapitel.
//   npm run perf -w apps/server -- 800        (Anzahl Dateien, Standard 400)
// Datenbank über DATABASE_URL (sonst temporäre SQLite-Datei).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import JSZip from 'jszip';
import { buildApp } from '../src/app.js';
import { startAnalysis } from '../src/services/analysis.js';
import { generate, listChapters } from '../src/services/chapters.js';
import { createImport, getImport } from '../src/services/imports.js';

const files = Number(process.argv[2] ?? 400);
const chapters = Math.max(5, Math.round(files / 20));
const WORDS = ('Auftrag Vertrag Fahrzeug Kunde Rechnung Freigabe Werkstatt Ersatzteil Lieferung Bestellung Preis Rabatt Garantie Termin Händler Markt ' +
  'Zulassung Leasing Finanzierung Angebot Stammdaten Benutzer Rolle Sparte Release Status Prüfung Export Import Bericht').split(' ');
let seed = 42;
const rnd = (n: number) => ((seed = (seed * 1103515245 + 12345) % 2 ** 31), seed % n);
const sentence = () => `${Array.from({ length: 8 + rnd(10) }, () => WORDS[rnd(WORDS.length)]).join(' ').toLowerCase().replace(/^./, (c) => c.toUpperCase())}.`;

const zip = new JSZip();
for (let i = 0; i < files; i++) {
  const c = i % chapters;
  const body = Array.from({ length: 4 }, (_, s) => `## ${c + 1}.${s + 1} Abschnitt ${s + 1}\n\n${Array.from({ length: 3 }, sentence).join(' ')}\n\n${sentence()}\n`).join('\n');
  zip.file(`kapitel-${c + 1}/datei-${i}.md`, `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n# ${c + 1}. Kapitel ${c + 1}\n\n${body}`);
}
const data = await zip.generateAsync({ type: 'nodebuffer' });
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'onescm-perf-'));
const { app, ctx } = await buildApp({ dataDir, logger: false, webDist: null, authMode: 'demo' });
const t = (label: string, t0: number) => console.log(`${label.padEnd(28)} ${((performance.now() - t0) / 1000).toFixed(2)} s`);
console.log(`${files} Dateien, ${chapters} Kapitel, ZIP ${(data.length / 1024).toFixed(0)} KB, Datenbank ${ctx.db.dialect}`);

let t0 = performance.now();
const imp = await createImport(ctx, 'perf.zip', data, 'u-admin');
await ctx.jobs.idle(600_000);
t('Import', t0);
const r = await getImport(ctx, imp.id);
const snippets = (await ctx.db.get<{ n: number }>('SELECT COUNT(*) AS n FROM text_snippets'))!.n;
console.log(`  Status ${r.status}, ${snippets} Textabschnitte`);

t0 = performance.now();
await startAnalysis(ctx, 'u-admin');
await ctx.jobs.idle(600_000);
t('Qualitätsanalyse', t0);
const findings = await ctx.db.all('SELECT type, COUNT(*) AS n FROM quality_findings GROUP BY type ORDER BY type');
console.log(`  Befunde: ${findings.map((f) => `${f.type} ${f.n}`).join(', ')}`);

t0 = performance.now();
let generated = 0;
for (const c of await listChapters(ctx)) {
  try {
    await generate(ctx, c.id, 'u-admin');
    generated++;
  } catch {
    /* Kapitel mit Blockern werden übersprungen */
  }
}
t(`Generierung (${generated} Kapitel)`, t0);
console.log(`Speicher (RSS) ${(process.memoryUsage().rss / 1024 / 1024).toFixed(0)} MB`);
await app.close();
fs.rmSync(dataDir, { recursive: true, force: true });
