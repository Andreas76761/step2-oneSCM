// Fiktive Beispieldaten für das Installationspaket: kleines Handbuch, Screenshots mit Varianten, Klickstrecke,
// Untertitel, gespeicherte Frage, Testfragen mit Prüflauf und Expertenbefragung. Aufruf: node beispieldaten.mjs <Basis-URL>
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const req = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), '../../apps/server/package.json'));
const { createCanvas } = req('@napi-rs/canvas');
const JSZip = req('jszip');
const B = `${process.argv[2] ?? 'http://localhost:3000'}/api/v1`;
const H = (u = 'u-admin') => ({ 'x-user-id': u, 'content-type': 'application/json' });
const call = async (m, p, body, u) => { const r = await fetch(B + p, { method: m, headers: H(u), body: body ? JSON.stringify(body) : undefined }); const t = await r.text(); try { return JSON.parse(t); } catch { return t; } };
const upload = async (p, name, buf) => { const fd = new FormData(); fd.append('file', new Blob([buf]), name); const r = await fetch(B + p, { method: 'POST', headers: { 'x-user-id': 'u-admin' }, body: fd }); return r.json(); };
function screen(title, lang, accent, rows) {
  const c = createCanvas(1280, 720); const g = c.getContext('2d');
  g.fillStyle = '#f8fafc'; g.fillRect(0, 0, 1280, 720);
  g.fillStyle = accent; g.fillRect(0, 0, 1280, 64);
  g.fillStyle = '#fff'; g.font = 'bold 28px sans-serif'; g.fillText('oneSCM', 24, 42);
  g.font = '20px sans-serif'; g.fillText(title, 200, 40);
  g.fillStyle = '#0f172a'; g.font = 'bold 24px sans-serif'; g.fillText(title, 40, 120);
  rows.forEach((r, i) => { g.fillStyle = i % 2 ? '#e2e8f0' : '#fff'; g.fillRect(40, 150 + i * 48, 1200, 48); g.fillStyle = '#334155'; g.font = '18px sans-serif'; g.fillText(r, 60, 180 + i * 48); });
  g.fillStyle = accent; g.fillRect(1080, 620, 160, 48); g.fillStyle = '#fff'; g.font = 'bold 18px sans-serif'; g.fillText(lang === 'de' ? 'Speichern' : 'Save', 1115, 650);
  return c.toBuffer('image/png');
}
const shots = {
  'liste-de.png': screen('Vertragsliste', 'de', '#0b5cad', ['V-1001  Autohaus Nord   aktiv', 'V-1002  Autohaus Süd    gekündigt', 'V-1003  Partner West    aktiv']),
  'liste-en.png': screen('Contract list', 'en', '#0b5cad', ['V-1001  Dealer North   active', 'V-1002  Dealer South   terminated', 'V-1003  Partner West   active']),
  'liste-van.png': screen('Vertragsliste Van', 'de', '#0f766e', ['V-2001  Van Center Ost   aktiv', 'V-2002  Van Partner      aktiv']),
  'neu.png': screen('Vertrag anlegen', 'de', '#0b5cad', ['Händler: ________', 'Laufzeit: 12 Monate', 'Produkt: Reifenpaket']),
  'kopie.png': screen('Vertrag kopieren', 'de', '#0b5cad', ['Vorlage: V-1001', 'Neuer Händler: ________']),
};
const z = new JSZip();
for (const [n, b] of Object.entries(shots)) z.file(`bilder/${n}`, b);
const FM = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';
z.file('handbuch/vertraege.md', `${FM}# Verträge verwalten\n\n## Vertrag kündigen\n\nUm einen Vertrag zu kündigen, öffnen Sie die Vertragsliste und klicken Sie in der Vertragsdetailansicht auf **Beenden**. Die Kündigung wird zum Monatsende wirksam.\n\n![Vertragsliste](../bilder/liste-de.png)\n\n## Vertrag anlegen\n\nEinen neuen Vertrag legen Sie über **Verträge > Neu** an. Wählen Sie den Händler und die Laufzeit.\n`);
z.file('schulung/reifen.md', `${FM}# Reifen\n\n## Reifenpaket anlegen\n\nEin Reifenpaket legen Sie unter **Produkte > Reifen** an. Die Preise pflegt der Markt.\n`);
z.file('schulung/kuendigung.vtt', 'WEBVTT\n\nKapitel-1\n00:00:00.000 --> 00:00:03.000\nVertrag kündigen\n\n00:00:04.000 --> 00:00:09.000\nÖffnen Sie die Vertragsliste und wählen Sie den Vertrag.\n\n00:00:10.000 --> 00:00:15.000\nKlicken Sie auf Beenden. Die Kündigung gilt zum Monatsende.\n');
const imp = await upload('/imports', 'beispiel.zip', await z.generateAsync({ type: 'nodebuffer' }));
for (let i = 0; i < 40; i++) { const s = await call('GET', `/imports/${imp.id}`); if (!['queued', 'processing'].includes(s.status)) { console.log('import', s.status); break; } await new Promise((r) => setTimeout(r, 500)); }
const { createHash } = await import('node:crypto');
const sha = Object.fromEntries(Object.entries(shots).map(([n, b]) => [n, createHash('sha256').update(b).digest('hex')]));
const meta = (n, m) => call('PATCH', `/image-archive/${sha[n]}`, m);
await meta('liste-de.png', { title: 'Vertragsliste', language: 'de', roles: ['all'], divisions: ['car'] });
await meta('liste-en.png', { title: 'Contract list', language: 'en', roles: ['all'], divisions: ['car'] });
await meta('liste-van.png', { title: 'Vertragsliste Van', language: 'de', roles: ['all'], divisions: ['van'] });
await meta('neu.png', { title: 'Vertrag anlegen', language: 'de', roles: ['dealer'], divisions: ['car', 'van'] });
await meta('kopie.png', { title: 'Vertrag kopieren', language: 'de', roles: ['dealer'], divisions: ['car'] });
await call('POST', `/image-archive/${sha['liste-de.png']}/variants`, { withSha: sha['liste-en.png'] });
await call('POST', `/image-archive/${sha['liste-de.png']}/variants`, { withSha: sha['liste-van.png'] });
await call('POST', '/image-archive/placeholders', { title: 'Vertragsliste Englisch Van', language: 'en', roles: ['all'], divisions: ['van'] });
const cp = await call('POST', '/image-clickpaths', { title: 'Vertrag anlegen', steps: [
  { alternatives: [{ sha: sha['liste-de.png'], caption: 'Vertragsliste öffnen' }] },
  { alternatives: [{ sha: sha['neu.png'], caption: 'Neu anlegen' }, { sha: sha['kopie.png'], caption: 'Vorhandenen Vertrag kopieren' }] },
  { alternatives: [{ sha: sha['liste-de.png'], caption: 'Speichern – Vertrag erscheint in der Liste' }] },
] });
console.log('clickpath', cp.id);
const ask = await call('POST', '/metadata/ask', { question: 'Wie kündige ich einen Vertrag?' }, 'u-leser');
await call('POST', '/metadata/qa', { question: ask.question, answer: ask.answerText, snippetIds: ask.sources.map((s) => s.snippetId), filters: ask.filters, askId: ask.id });
const es = await call('POST', '/metadata/eval-sets', { name: 'Wissens-Check Verträge', items: [
  { question: 'Wie kündige ich einen Vertrag?', expected: ['handbuch/vertraege.md › kündigen'], keywords: ['Beenden', 'Monatsende'] },
  { question: 'Wie lege ich ein Reifenpaket an?', expected: ['schulung/reifen.md'], keywords: ['Produkte'] },
  { question: 'Wie lege ich einen neuen Vertrag an?', expected: ['handbuch/vertraege.md › anlegen'], keywords: ['Neu'] },
  { question: 'Wann wird eine Kündigung wirksam?', expected: ['kuendigung.vtt'], keywords: ['Monatsende'] },
  { question: 'Welche Zollvorschriften gelten in Brasilien?', expectNoAnswer: true },
  { question: 'Wer genehmigt Sonderpreise in Japan?', expectNoAnswer: true },
] });
const run = await call('POST', `/metadata/eval-sets/${es.id}/runs`, {});
console.log('eval', run.metrics);
const sv = await call('POST', '/metadata/surveys', { title: 'Lücken Verträge international', audience: 'Fachbereich Zoll und Preise', from: { evalRunId: run.id } });
if (sv.items?.[0]) await call('PUT', `/metadata/survey-items/${sv.items[0].id}/answer`, { choice: 'Teilweise', text: 'Es gelten die Einfuhrregeln des Landes; Details liefert der Zoll.' }, 'u-leser');
console.log('survey', sv.id, sv.items?.length);
