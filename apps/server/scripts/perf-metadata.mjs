// Lasttest oneSCM_Metadaten (docs/lasttest-metadaten.md): großer Bestand gegen einen laufenden Server, Werte in ms.
// Aufruf: node apps/server/scripts/perf-metadata.mjs <Port> <Dokumente> – Server mit frischem DATA_DIR und Demo-Daten (seed-demo)
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const req = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), '../package.json'));
const { createCanvas } = req('@napi-rs/canvas');
const JSZip = req('jszip');
const PORT = process.argv[2] ?? '3200';
const B = `http://localhost:${PORT}/api/v1`;
const DOCS = Number(process.argv[3] ?? 500);
const hdr = (u = 'u-admin', json = true) => ({ 'x-user-id': u, ...(json ? { 'content-type': 'application/json' } : {}) });
const call = async (m, p, body, u) => { const r = await fetch(B + p, { method: m, headers: hdr(u, !!body), body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); if (r.status >= 400) throw new Error(`${m} ${p} → ${r.status} ${t.slice(0, 200)}`); try { return JSON.parse(t); } catch { return t; } };
const upload = async (p, name, buf) => { const fd = new FormData(); fd.append('file', new Blob([buf]), name); const r = await fetch(B + p, { method: 'POST', headers: { 'x-user-id': 'u-admin' }, body: fd }); return r.json(); };
const t = async (fn) => { const s = performance.now(); const r = await fn(); return [performance.now() - s, r]; };
const stats = (xs) => { const a = [...xs].sort((x, y) => x - y); const q = (p) => a[Math.min(a.length - 1, Math.floor(p * a.length))]; return { n: a.length, p50: Math.round(q(0.5)), p95: Math.round(q(0.95)), max: Math.round(a[a.length - 1]) }; };
const out = {};
const topics = ['Vertrag', 'Reifenpaket', 'Garantie', 'Preisliste', 'Händler', 'Kündigung', 'Rechnung', 'Lieferung', 'Produkt', 'Fahrzeuggruppe', 'Marktfreigabe', 'Benutzer'];
const verbs = ['anlegen', 'ändern', 'kündigen', 'prüfen', 'freigeben', 'exportieren', 'kopieren', 'löschen'];
const FM = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';
const z = new JSZip();
for (let d = 0; d < DOCS; d++) {
  const topic = topics[d % topics.length];
  let md = `${FM}# ${topic} ${d}\n\n`;
  for (let s = 0; s < 8; s++) {
    const v = verbs[(d + s) % verbs.length];
    md += `## ${topic} ${v} (${d}.${s})\n\nUm ${topic} ${d}.${s} zu ${v}, öffnen Sie **${topic} > Übersicht** und wählen Sie den Eintrag. Klicken Sie anschließend auf **${v[0].toUpperCase() + v.slice(1)}**.\n\nDie Änderung wird nach dem Speichern sofort wirksam. Bei Fragen wenden Sie sich an den Markt ${d % 7}.\n\n- Prüfen Sie die Pflichtfelder\n- Speichern Sie den Eintrag\n\n`;
  }
  z.file(`handbuch/k${String(d).padStart(4, '0')}.md`, md);
}
for (let i = 0; i < 20; i++) { const c = createCanvas(1280, 720); const g = c.getContext('2d'); g.fillStyle = `hsl(${i * 18},60%,50%)`; g.fillRect(0, 0, 1280, 720); z.file(`bilder/b${i}.png`, c.toBuffer('image/png')); }
const zip = await z.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
out.daten = { dokumente: DOCS, abschnitte: DOCS * 8, zipKB: Math.round(zip.length / 1024) };

const waitImport = async (id) => { for (;;) { const s = await call('GET', `/imports/${id}`); if (!['queued', 'processing'].includes(s.status)) return s; await new Promise((r) => setTimeout(r, 250)); } };
// TRIAGE läuft nach jedem Import mit neuen Chunks als eigener Job (ADR-100): abwarten, damit spätere Messungen nicht mitlaufen
const triageRuns = async () => (await call('GET', '/triage/runs', null, 'u-leser')).items ?? [];
const waitTriage = async (before) => { for (let i = 0; i < 1200; i++) { const r = await triageRuns(); if (r.length > before && !r.some((x) => x.status === 'running')) return r[0]; await new Promise((res) => setTimeout(res, 250)); } return null; };
let runsBefore = (await triageRuns()).length;
let [ms, imp] = await t(async () => waitImport((await upload('/imports', 'last.zip', zip)).id));
out.import = { ms: Math.round(ms), status: imp.status, stats: imp.stats, dokumenteJeSekunde: Math.round(DOCS / (ms / 1000)) };
let tr;
[ms, tr] = await t(() => waitTriage(runsBefore));
out.triageNachImport = { ms: Math.round(ms), chunks: tr?.stats?.chunks, labels: tr?.stats?.labels };
[ms, imp] = await t(async () => waitImport((await upload('/imports', 'last.zip', zip)).id));
out.importUnveraendert = { ms: Math.round(ms), identical: imp.stats?.identical };

const lat = async (n, fn) => { const xs = []; for (let i = 0; i < n; i++) xs.push((await t(() => fn(i)))[0]); return stats(xs); };
out.chunksListe = await lat(20, (i) => call('GET', `/metadata/chunks?limit=50&offset=${i * 50}`, null, 'u-leser'));
out.chunksSuche = await lat(20, (i) => call('GET', `/metadata/chunks?limit=50&q=${encodeURIComponent(topics[i % topics.length])}`, null, 'u-leser'));
out.globaleSuche = await lat(20, (i) => call('GET', `/search?q=${encodeURIComponent(`${topics[i % topics.length]} ${verbs[i % verbs.length]}`)}`, null, 'u-leser'));
out.quellenJeUeberschrift = await lat(5, () => call('GET', '/metadata/headings/documents', null, 'u-leser'));
out.fragenAnAlleQuellen = await lat(20, (i) => call('POST', '/metadata/ask', { question: `Wie kann ich ${topics[i % topics.length]} ${verbs[(i * 3) % verbs.length]}?` }, 'u-leser'));
out.dubletten = await lat(5, () => call('GET', '/metadata/duplicates?limit=50', null, 'u-leser'));
out.bildarchiv = await lat(5, () => call('GET', '/image-archive', null, 'u-leser'));
out.deckungsmatrix = await lat(5, () => call('GET', '/image-archive/coverage-matrix', null, 'u-leser'));
const set = await call('POST', '/metadata/eval-sets', { name: 'Last', items: Array.from({ length: 30 }, (_, i) => ({ question: `Wie kann ich ${topics[i % topics.length]} ${verbs[i % verbs.length]}?`, expected: [`handbuch/`], keywords: [verbs[i % verbs.length]] })) });
[ms] = await t(() => call('POST', `/metadata/eval-sets/${set.id}/runs`, {}));
out.pruefLauf30Fragen = { ms: Math.round(ms), jeFrage: Math.round(ms / 30) };
const chapters = (await call('GET', '/chapters', null, 'u-leser'));
const ids = (Array.isArray(chapters) ? chapters : chapters.items ?? []).map((c) => c.id);
// 30 Kapitel aus den Quellen erzeugen, Lücken entfernen, einreichen und freigeben – dann exportieren
const gen = [];
const okIds = [];
for (const c of (Array.isArray(chapters) ? chapters : []).filter((c) => c.snippetCount > 0).slice(0, 30)) {
  try {
    const [g, v] = await t(() => call('POST', `/chapters/${c.id}/generate`, {}, 'u-redaktion'));
    gen.push(g);
    for (const s of v.sections) for (const b of s.blocks) {
      if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
      else if (b.scopeStatus === 'unconfirmed') await call('PATCH', `/content-blocks/${b.id}`, { scopeStatus: 'confirmed' }, 'u-redaktion');
    }
    await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion');
    await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'Lasttest' }, 'u-freigabe');
    okIds.push(c.id);
  } catch { /* Kapitel mit Blockern bleibt draußen */ }
}
out.kapitelErzeugen = { ...stats(gen), freigegeben: okIds.length };
for (const format of ['md', 'html', 'pdf', 'docx']) {
  try {
    const [m1, r] = await t(() => call('POST', '/exports', { chapterIds: okIds, format }, 'u-leser'));
    out['export_' + format] = { ms: Math.round(m1), kapitel: okIds.length - (r.skipped?.length ?? 0) };
  } catch (e) { out['export_' + format] = { fehler: String(e.message).slice(0, 160) }; }
}
// Etappe 49: Stilprüfung mit Ton, Kapitel-Stilprüfung, Ticket-Einstufung, Projektvergleich, Export mit Stand
const longText = Array.from({ length: 40 }, (_, i) => `Sie müssen den Vertrag ${i} einfach im Menü **Verträge** öffnen und den Eintrag speichern, das gibt's auch als Vorlage.`).join(' ');
out.stilpruefungTon = await lat(20, (i) => call('POST', '/style/check', { text: longText, roles: i % 2 ? ['dealer'] : undefined, product: 'manual' }, 'u-leser'));
const fresh = await call('GET', '/chapters', null, 'u-leser');
const approvedVersions = (Array.isArray(fresh) ? fresh : []).filter((c) => okIds.includes(c.id)).map((c) => c.versions.find((v) => v.status === 'approved')?.id).filter(Boolean);
out.kapitelStilpruefung = approvedVersions.length ? await lat(Math.min(10, approvedVersions.length), (i) => call('GET', `/style/chapter-versions/${approvedVersions[i]}`, null, 'u-leser')) : { fehler: 'keine freigegebenen Versionen' };
const jiraHead = 'Summary,Issue key,Issue Type,Status,Fix Version/s,Created,Description';
const jiraRows = Array.from({ length: 500 }, (_, i) => `"${topics[i % topics.length]} ${verbs[i % verbs.length]} ${i}",PERF-${i + 1},${i % 5 === 0 ? 'Bug' : 'Story'},Fertig,P${(i % 4) + 1},2026-02-05T10:00:00.000+0100,"Beschreibung ${i}."`);
runsBefore = (await triageRuns()).length;
[ms] = await t(async () => waitImport((await upload('/imports', 'tickets.csv', Buffer.from([jiraHead, ...jiraRows].join('\n')))).id));
out.import500Tickets = { ms: Math.round(ms) };
[ms] = await t(() => waitTriage(runsBefore));
out.triageNachTicketImport = { ms: Math.round(ms) };
out.releaseAbgleich = await lat(5, () => call('GET', '/ticket-releases', null, 'u-leser'));
[ms] = await t(() => call('PUT', '/ticket-classifications', { keys: Array.from({ length: 100 }, (_, i) => `PERF-${i + 1}`), classification: 'background' }, 'u-fachpruefung'));
out.einstufung100Tickets = { ms: Math.round(ms) };
const r1 = await call('POST', '/releases', { version: 'P1' }, 'u-freigabe');
const r2 = await call('POST', '/releases', { version: 'P2' }, 'u-freigabe');
out.projektvergleich = await lat(5, () => call('GET', `/releases/${r2.id}/comparison?from=${r1.id}`, null, 'u-leser'));
[ms] = await t(() => call('POST', '/release-letters/from-comparison', { releaseId: r2.id }, 'u-redaktion'));
out.letterAusVergleich = { ms: Math.round(ms) };
[ms] = await t(() => call('POST', '/exports', { chapterIds: okIds, format: 'md', asOf: 'P1' }, 'u-leser'));
out.exportMitStand = { ms: Math.round(ms) };
// parallele Nutzer: 20 gleichzeitig, je 25 Anfragen (Lesen)
const paths = ['/metadata/overview', '/metadata/chunks?limit=20', '/search?q=Vertrag', '/image-archive/coverage', '/metadata/qa'];
const all = [];
const [wall] = await t(() => Promise.all(Array.from({ length: 20 }, async (_, u) => { for (let i = 0; i < 25; i++) all.push((await t(() => call('GET', paths[(u + i) % paths.length], null, 'u-leser')))[0]); })));
out.parallel20Nutzer = { anfragen: all.length, sekunden: Math.round(wall / 100) / 10, anfragenJeSekunde: Math.round(all.length / (wall / 1000)), ...stats(all) };
const parallelAsk = [];
const [wall2] = await t(() => Promise.all(Array.from({ length: 10 }, async (_, u) => { for (let i = 0; i < 3; i++) parallelAsk.push((await t(() => call('POST', '/metadata/ask', { question: `Wie kann ich ${topics[(u + i) % topics.length]} prüfen?` }, 'u-leser')))[0]); })));
out.parallel10Fragen = { anfragen: parallelAsk.length, sekunden: Math.round(wall2 / 100) / 10, ...stats(parallelAsk) };
const pid = execSync(`lsof -ti tcp:${PORT} -sTCP:LISTEN || true`).toString().trim().split('\n')[0];
if (pid) out.serverSpeicherMB = Math.round(Number(execSync(`ps -o rss= -p ${pid}`).toString().trim()) / 1024);
console.log(JSON.stringify(out, null, 2));
