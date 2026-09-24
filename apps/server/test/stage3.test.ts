import fs from 'node:fs';
import JSZip from 'jszip';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import type { Ctx } from '../src/context.js';
import { freshDatabase, tempDir } from './helpers.js';

type App = Awaited<ReturnType<typeof buildApp>>['app'];
let app: App;
let ctx: Ctx;
const dataDir = tempDir();

const ANMELDUNG = `---
roles: [dealer]
divisions: [car]
evidence_status: source_confirmed
---
# 1. Anmeldung

## 1.1 Zweck

Mit der Anmeldung erhalten Benutzer Zugriff auf oneSCM.

## 1.2 Schritte

1. Öffnen Sie die Startseite.
2. Klicken Sie auf **Anmelden**.

Ergebnis: Die Startseite wird angezeigt.

Hinweis: Nach dem einloggen bleibt die Sitzung erhalten. <script>alert('x')</script>
`;

const KENNWORT = `# 2. Kennwort

## 2.1 Zurücksetzen

Das Passwort kann über den Link auf der Anmeldeseite zurückgesetzt werden.
`;

function multipart(fileName: string, data: Buffer) {
  const boundary = '----onescm' + Math.random().toString(16).slice(2);
  const head = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`);
  return { payload: Buffer.concat([head, data, Buffer.from(`\r\n--${boundary}--\r\n`)]), headers: { 'content-type': `multipart/form-data; boundary=${boundary}` } };
}

async function call(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', url: string, body?: unknown, user = 'u-admin') {
  const res = await app.inject({ method, url: `/api/v1${url}`, payload: body as any, headers: { 'x-user-id': user } });
  let json: any = null;
  try {
    json = res.json();
  } catch {
    /* kein JSON */
  }
  return { status: res.statusCode, json, body: res.body, raw: res.rawPayload, headers: res.headers };
}

async function importFiles(files: Record<string, string>) {
  const z = new JSZip();
  for (const [p, c] of Object.entries(files)) z.file(p, c);
  const mp = multipart('etappe3.zip', await z.generateAsync({ type: 'nodebuffer' }));
  const res = await app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp.payload, headers: { ...mp.headers, 'x-user-id': 'u-admin' } });
  expect(res.statusCode).toBe(202);
  await ctx.jobs.idle();
}

const chapterId = async (prefix: string) => (await call('GET', '/chapters')).json.find((c: any) => c.title.startsWith(prefix)).id as string;
const blocks = (v: any) => v.sections.flatMap((s: any) => s.blocks);

/** Generieren und Lücken entfernen, damit das Qualitätsgate besteht */
async function draft(prefix: string) {
  const v = (await call('POST', `/chapters/${await chapterId(prefix)}/generate`, {}, 'u-redaktion')).json;
  for (const b of blocks(v)) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
  return v.id as string;
}

beforeAll(async () => {
  ({ app, ctx } = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'etappe3'), logger: false, webDist: null, authMode: 'demo' }));
  await importFiles({ 'anmeldung.md': ANMELDUNG, 'kennwort.md': KENNWORT });
});
afterAll(async () => {
  await app.close();
  fs.rmSync(dataDir, { recursive: true, force: true });
});

describe('Freigabeworkflow (US-016, ENTSCHEIDUNG E-12)', () => {
  it('[T-121] Einreichen, Zurückziehen, Ablehnen, Freigeben; eingereichte Version ist gesperrt', async () => {
    const v1 = await draft('1.');
    expect((await call('POST', `/chapter-versions/${v1}/submit`, {}, 'u-leser')).status).toBe(403);
    const sub = await call('POST', `/chapter-versions/${v1}/submit`, { comment: 'Bitte prüfen' }, 'u-redaktion');
    expect(sub.json).toMatchObject({ status: 'in_review', submittedBy: 'u-redaktion', submitComment: 'Bitte prüfen' });
    expect(sub.json.submittedAt).toBeTruthy();

    // Während der Prüfung gesperrt
    const block = blocks(sub.json).find((b: any) => b.kind !== 'gap');
    const locked = await call('PATCH', `/content-blocks/${block.id}`, { text: 'geändert' }, 'u-redaktion');
    expect(locked.status).toBe(409);
    expect(locked.json.detail).toContain('zur Freigabe eingereicht');
    expect((await call('POST', `/chapter-versions/${v1}/submit`, {}, 'u-redaktion')).status).toBe(409);

    // Zurückziehen → wieder bearbeitbar
    expect((await call('POST', `/chapter-versions/${v1}/withdraw`, { reason: 'Nachtrag' }, 'u-redaktion')).json).toMatchObject({ status: 'draft', submittedBy: null });
    expect((await call('PATCH', `/content-blocks/${block.id}`, { comment: 'geprüft' }, 'u-redaktion')).status).toBe(200);

    // Ablehnen → zurück in den Entwurf, protokolliert
    await call('POST', `/chapter-versions/${v1}/submit`, {}, 'u-redaktion');
    expect((await call('POST', `/chapter-versions/${v1}/approve`, { comment: 'ok' }, 'u-redaktion')).status).toBe(403);
    expect((await call('POST', `/chapter-versions/${v1}/approve`, { decision: 'rejected' }, 'u-freigabe')).status).toBe(422);
    const rejected = (await call('POST', `/chapter-versions/${v1}/approve`, { decision: 'rejected', comment: 'Ergebnis unklar formuliert' }, 'u-freigabe')).json;
    expect(rejected.status).toBe('draft');
    expect(rejected.approvals[0]).toMatchObject({ decision: 'rejected', approver: 'u-freigabe', comment: 'Ergebnis unklar formuliert' });

    // Neugenerierung ersetzt auch eine eingereichte Version
    await call('POST', `/chapter-versions/${v1}/submit`, {}, 'u-redaktion');
    const v2 = await draft('1.');
    expect((await call('GET', `/chapter-versions/${v1}`)).json.status).toBe('superseded');

    // Freigabe
    await call('POST', `/chapter-versions/${v2}/submit`, {}, 'u-redaktion');
    const approved = (await call('POST', `/chapter-versions/${v2}/approve`, { comment: 'Fachlich geprüft' }, 'u-freigabe')).json;
    expect(approved.status).toBe('approved');
    expect((await call('POST', `/chapter-versions/${v2}/submit`, {}, 'u-redaktion')).status).toBe(409);
    expect((await call('POST', `/chapter-versions/${v2}/withdraw`, {}, 'u-redaktion')).status).toBe(409);
    const audit = (await call('GET', `/audit-events?entityType=chapter_version&entityId=${v1}`)).json.map((a: any) => a.action);
    expect(audit).toEqual(expect.arrayContaining(['chapter_version.submitted', 'chapter_version.withdrawn', 'chapter_version.rejected']));
  });
});

describe('Terminologieverwaltung (US-015)', () => {
  it('[T-122] Begriffe pflegen, Konsistenz prüfen, Analyse nutzt die aktiven Begriffe', async () => {
    const initial = (await call('GET', '/terminology')).json;
    expect(initial.map((t: any) => t.preferred)).toEqual(['anmelden', 'Autohaus', 'Freigabe']);
    expect((await call('POST', '/terminology', { preferred: 'Kennwort', avoid: ['Passwort'] }, 'u-leser')).status).toBe(403);
    const created = await call('POST', '/terminology', { preferred: 'Kennwort', avoid: ['Passwort', ' Passwort ', ''], definition: 'Geheimes Anmeldemerkmal' }, 'u-redaktion');
    expect(created.status).toBe(201);
    expect(created.json).toMatchObject({ preferred: 'Kennwort', avoid: ['Passwort'], status: 'active', createdBy: 'u-redaktion' });
    expect((await call('POST', '/terminology', { preferred: 'kennwort' })).status).toBe(409);
    expect((await call('POST', '/terminology', { preferred: 'Genehmigung' })).status).toBe(422); // steht bei „Freigabe“ als zu vermeiden
    expect((await call('POST', '/terminology', { preferred: 'Zugang', avoid: ['Freigabe'] })).status).toBe(422); // anderswo bevorzugt
    expect((await call('POST', '/terminology', { preferred: 'Zugang', avoid: ['zugang'] })).status).toBe(422);

    const anmelden = initial.find((t: any) => t.preferred === 'anmelden');
    const retired = await call('PATCH', `/terminology/${anmelden.id}`, { status: 'retired' }, 'u-redaktion');
    expect(retired.json.status).toBe('retired');
    expect((await call('GET', '/terminology')).json.map((t: any) => t.preferred)).not.toContain('anmelden');
    expect((await call('GET', '/terminology?includeRetired=true')).json.map((t: any) => t.preferred)).toContain('anmelden');

    await call('POST', '/quality/analysis');
    await ctx.jobs.idle();
    const findings = (await call('GET', '/quality/findings?type=terminology')).json.map((f: any) => f.reason);
    expect(findings).toContain('„Passwort“ → bevorzugt „Kennwort“');
    expect(findings.some((r: string) => r.includes('einloggen'))).toBe(false); // ausgemusterter Begriff wird nicht mehr gemeldet
    const audit = (await call('GET', `/audit-events?entityType=term&entityId=${anmelden.id}`)).json;
    expect(audit[0]).toMatchObject({ action: 'term.retired', actor: 'u-redaktion' });
  });
});

describe('Evidenz und Optimierung (US-011, US-013)', () => {
  it('[T-123] Evidenzansicht zeigt Quellen je Absatz und markiert fehlende, manuelle und veraltete Evidenz', async () => {
    // Quelle ohne Front-Matter ist unbestätigt → erst manuell bestätigen, sonst generiert der Generator nichts
    const snippet = (await call('GET', `/snippets?chapterId=${await chapterId('2.')}`)).json.items[0];
    expect((await call('POST', `/chapters/${await chapterId('2.')}/generate`, {}, 'u-redaktion')).status).toBe(422);
    await call('PATCH', `/snippets/${snippet.id}`, { evidenceStatus: 'manually_confirmed' }, 'u-redaktion');
    const vid = await draft('2.');
    // Bestätigung nachträglich zurückgenommen → Evidenzansicht markiert die Quelle
    await call('PATCH', `/snippets/${snippet.id}`, { evidenceStatus: 'unconfirmed' }, 'u-redaktion');
    await call('POST', `/chapter-versions/${vid}/content-blocks`, { section: 'hints', kind: 'tip', text: 'Kennwort regelmäßig ändern.', justification: 'Vorgabe IT-Sicherheit' }, 'u-redaktion');
    await call('POST', `/chapter-versions/${vid}/content-blocks`, { section: 'hints', kind: 'note', text: 'Ohne Beleg.' }, 'u-redaktion');
    let ev = (await call('GET', `/chapter-versions/${vid}/evidence`)).json;
    const sourced = ev.blocks.find((b: any) => b.text.startsWith('Das Passwort'));
    expect(sourced.sources[0]).toMatchObject({ path: 'kennwort.md', revisionNo: 1, isCurrent: true, evidenceStatus: 'unconfirmed', text: expect.stringContaining('Passwort') });
    expect(sourced.issues).toContain('unconfirmed_source');
    expect(ev.blocks.find((b: any) => b.text.startsWith('Kennwort regelmäßig')).issues).toContain('justified_only');
    expect(ev.blocks.find((b: any) => b.text === 'Ohne Beleg.').issues).toContain('no_evidence');
    expect(ev.summary).toMatchObject({ justifiedOnly: 1, withoutEvidence: 1, outdatedSources: 0 });
    expect(ev.issueLabels.no_evidence).toBe('Weder Quelle noch Begründung');

    // Neue Revision der Quelle → bestehende Version verweist auf veraltete Quelle
    await importFiles({ 'kennwort.md': KENNWORT.replace('zurückgesetzt', 'jederzeit zurückgesetzt') });
    ev = (await call('GET', `/chapter-versions/${vid}/evidence`)).json;
    expect(ev.blocks.find((b: any) => b.text.startsWith('Das Passwort')).issues).toContain('outdated_source');
    expect(ev.summary.outdatedSources).toBe(2); // Textabsatz + Block „Quellen- und Freigabestatus“
    expect(ev.summary.coverage).toBeLessThan(100);
  });

  it('[T-124] Optimierungsübersicht liefert Kennzahlen je Kapitel und priorisierte Empfehlungen', async () => {
    const o = (await call('GET', '/optimizations')).json;
    expect(o.totals).toMatchObject({ chapters: 2, approved: 1 });
    const k = o.chapters.find((c: any) => c.title === '2. Kennwort');
    expect(k).toMatchObject({ confirmedPct: 0, latestVersion: { status: 'draft' } });
    expect(k.evidence.withoutEvidence).toBe(1);
    expect(k.findingsByType.terminology).toBe(1);
    const recs = o.recommendations.filter((r: any) => r.chapter === '2. Kennwort');
    expect(recs[0]).toMatchObject({ priority: 1, target: 'werkstatt' });
    expect(recs.map((r: any) => r.target)).toEqual(expect.arrayContaining(['quellen', 'generator', 'optimierungen']));
    expect(o.recommendations.map((r: any) => r.priority)).toEqual([...o.recommendations.map((r: any) => r.priority)].sort());
  });
});

describe('Export HTML und PDF (US-014)', () => {
  it('[T-125] HTML ohne ausführbare Inhalte, PDF-Datei, Formatprüfung', async () => {
    const html = await call('POST', '/exports', { format: 'html', roles: ['dealer'] });
    expect(html.status).toBe(201);
    const file = await call('GET', `/exports/${html.json.id}/download`);
    expect(file.headers['content-type']).toContain('text/html');
    expect(file.body).toContain('<h2>1. Anmeldung</h2>');
    expect(file.body).toContain('&lt;script&gt;');
    expect(file.body).not.toMatch(/<script/i);
    expect(file.body).toContain("Content-Security-Policy\" content=\"default-src 'none'");
    expect(file.body).toContain('Filter: Rollen: Dealer');
    expect(html.json.preview).toContain('# oneSCM Benutzerhandbuch');

    const pdf = await call('POST', '/exports', { format: 'pdf' });
    expect(pdf.status).toBe(201);
    expect(pdf.json.preview).toBeNull();
    const pdfFile = await call('GET', `/exports/${pdf.json.id}/download`);
    expect(pdfFile.headers['content-type']).toBe('application/pdf');
    expect(pdfFile.raw.subarray(0, 5).toString()).toBe('%PDF-');
    expect(pdfFile.raw.length).toBeGreaterThan(2000);
    expect(pdfFile.headers['content-disposition']).toMatch(/\.pdf"$/);

    expect((await call('POST', '/exports', { format: 'docx' })).status).toBe(400);
  });
});
