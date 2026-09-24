import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { REPO_ROOT } from '../src/config.js';
import type { Ctx } from '../src/context.js';
import { buildDemoZip } from '../scripts/demo-zip.js';
import { freshDatabase, tempDir } from './helpers.js';

type App = Awaited<ReturnType<typeof buildApp>>['app'];
let app: App;
let ctx: Ctx;
let dataDir: string;

function multipart(fileName: string, data: Buffer) {
  const boundary = '----onescm' + Math.random().toString(16).slice(2);
  const head = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`);
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  return { payload: Buffer.concat([head, data, tail]), headers: { 'content-type': `multipart/form-data; boundary=${boundary}` } };
}

async function call(method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE', url: string, body?: unknown, user = 'u-admin') {
  const res = await app.inject({ method, url: `/api/v1${url}`, payload: body as any, headers: { 'x-user-id': user } });
  let json: any = null;
  try {
    json = res.json();
  } catch {
    /* kein JSON */
  }
  return { status: res.statusCode, json, body: res.body, headers: res.headers };
}

async function upload(fileName: string, data: Buffer, user = 'u-admin') {
  const mp = multipart(fileName, data);
  const res = await app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp.payload, headers: { ...mp.headers, 'x-user-id': user } });
  await ctx.jobs.idle();
  return { status: res.statusCode, json: res.json(), headers: res.headers };
}

async function zipOf(files: Record<string, string | Buffer>) {
  const z = new JSZip();
  for (const [p, c] of Object.entries(files)) z.file(p, c);
  return z.generateAsync({ type: 'nodebuffer' });
}

const chapterId = async (prefix: string) => (await call('GET', '/chapters')).json.find((c: any) => c.title.startsWith(prefix)).id as string;
const openFindings = async (q = '') => (await call('GET', `/quality/findings?status=open,deferred${q}`)).json as any[];
const blocks = (v: any) => v.sections.flatMap((s: any) => s.blocks);

beforeAll(async () => {
  dataDir = tempDir();
  ({ app, ctx } = await buildApp({ dataDir, database: await freshDatabase(dataDir), logger: false, webDist: null, authMode: 'demo' }));
});
afterAll(async () => {
  await app.close();
  fs.rmSync(dataDir, { recursive: true, force: true });
});

describe('Import (US-001, US-002)', () => {
  it('[T-101] ZIP- und MD-Import mit SHA-256 und Protokoll je Datei', async () => {
    const res = await upload('onescm-demo.zip', await buildDemoZip(path.join(REPO_ROOT, 'demo-data')));
    expect(res.status).toBe(202);
    expect(res.headers.location).toBe(`/api/v1/imports/${res.json.id}`);
    const imp = (await call('GET', `/imports/${res.json.id}`)).json;
    expect(imp.status).toBe('completed');
    expect(imp.kind).toBe('zip');
    expect(imp.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(imp.stats).toMatchObject({ imported: 13, skipped: 1, failed: 0 });
    expect(imp.items.find((i: any) => i.path === 'LIESMICH.txt').status).toBe('skipped');
    expect(imp.items.every((i: any) => i.status === 'skipped' || /^[0-9a-f]{64}$/.test(i.sha256))).toBe(true);

    const md = await upload('archiv.md', Buffer.from('---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n# 8. Archivierung\n\nDer Vertrag wird nach der Prüfung automatisch archiviert.\n\nNach der Prüfung wird der Vertrag automatisch archiviert!\n'));
    const mdImp = (await call('GET', `/imports/${md.json.id}`)).json;
    expect(mdImp).toMatchObject({ kind: 'md', status: 'completed' });

    const chapters = (await call('GET', '/chapters')).json;
    expect(chapters.map((c: any) => c.title)).toEqual(expect.arrayContaining(['Ohne Kapitel', '3. Benutzerverwaltung', '4. Vertragsbearbeitung', '5. MO-Check', '8. Archivierung']));
    const ch3 = chapters.find((c: any) => c.title === '3. Benutzerverwaltung');
    expect(ch3.subchapters.map((s: any) => s.title)).toEqual(['3.1 Überblick', '3.2 Freigabe', '3.3 Fehlerbehebung', '3.4 Benachrichtigungen', '3.5 Rollenzuordnung']);
  });

  it('[T-102] Teilfehler, identische Revision und neue Revision ohne Überschreiben', async () => {
    const partial = await upload('teil.zip', await zipOf({ 'ok.md': '# 9. Test\n\nText.', 'kaputt.md': Buffer.from([0xff, 0xfe, 0x00, 0xc3]) }));
    const p = (await call('GET', `/imports/${partial.json.id}`)).json;
    expect(p.status).toBe('completed_with_errors');
    expect(p.items.find((i: any) => i.path === 'kaputt.md')).toMatchObject({ status: 'failed', message: 'Keine gültige UTF-8-Datei' });
    expect(p.items.find((i: any) => i.path === 'ok.md').status).toBe('imported');

    const again = await upload('teil2.zip', await zipOf({ 'ok.md': '# 9. Test\n\nText.' }));
    expect((await call('GET', `/imports/${again.json.id}`)).json.items[0]).toMatchObject({ status: 'identical', message: 'Identisch mit Revision 1' });

    const changed = await upload('teil3.zip', await zipOf({ 'ok.md': '# 9. Test\n\nGeänderter Text.' }));
    expect((await call('GET', `/imports/${changed.json.id}`)).json.items[0].message).toMatch(/^Revision 2/);
    const src = (await call('GET', '/sources')).json.find((s: any) => s.path === 'ok.md');
    expect(src.revisions.map((r: any) => [r.revisionNo, r.isCurrent])).toEqual([[2, true], [1, false]]);
    const raw1 = await call('GET', `/source-revisions/${src.revisions[1].id}/raw`);
    expect(raw1.body).toBe('# 9. Test\n\nText.');
    expect(raw1.headers['content-type']).toContain('text/plain');
    const current = (await call('GET', `/snippets?q=Text&chapterId=${await chapterId('9.')}`)).json;
    expect(current.items.map((s: any) => s.text)).toEqual(['Geänderter Text.']);
    const all = (await call('GET', `/snippets?chapterId=${await chapterId('9.')}&includeHistoric=true`)).json;
    expect(all.total).toBe(2);
  });

  it('[T-103] unzulässiger Dateityp liefert application/problem+json', async () => {
    const res = await upload('handbuch.pdf', Buffer.from('%PDF'));
    expect(res.status).toBe(415);
    expect(res.headers['content-type']).toContain('application/problem+json');
    expect(res.json).toMatchObject({ status: 415, title: 'Unsupported Media Type' });
    expect((await upload('x.md', Buffer.from('# X'), 'u-leser')).status).toBe(403);
  });
});

describe('Suche und Klassifikation (US-003, US-004, US-017)', () => {
  it('[T-104] kombinierte Suche und Filter', async () => {
    const ch3 = await chapterId('3.');
    const r = (await call('GET', `/snippets?q=Freigabe&role=market&chapterId=${ch3}&evidenceStatus=source_confirmed`)).json;
    expect(r.total).toBeGreaterThan(0);
    for (const s of r.items) {
      expect(s.text.toLowerCase()).toContain('freigabe');
      expect(s.roles.map((x: any) => x.code)).toContain('market');
      expect(s.chapter.id).toBe(ch3);
      expect(s.evidenceStatus).toBe('source_confirmed');
    }
    const truck = (await call('GET', '/snippets?division=truck&role=dealer')).json;
    expect(truck.items.map((s: any) => s.text)).toEqual(['Für Truck-Verträge ist zusätzlich die Laufleistung in Kilometern bei Vertragsbeginn anzugeben.']);
    const de = (await call('GET', '/snippets?market=DE&pageSize=2&page=1')).json;
    expect(de.items).toHaveLength(2);
    expect(de.total).toBe(7);
  });

  it('[T-105] Mehrfachzuordnung, Ursprungstext bleibt unverändert, Berechtigung geprüft', async () => {
    const s = (await call('GET', '/snippets?q=Busse')).json.items[0];
    expect(s.roles.every((r: any) => r.evidenceStatus === 'unconfirmed')).toBe(true);
    const denied = await call('PATCH', `/snippets/${s.id}`, { roles: ['dealer'] }, 'u-leser');
    expect(denied.status).toBe(403);
    expect(denied.headers['content-type']).toContain('application/problem+json');
    const res = await call('PATCH', `/snippets/${s.id}`, { roles: ['dealer', 'market'], divisions: ['bus', 'van'], text: 'manipuliert' }, 'u-redaktion');
    expect(res.status).toBe(200);
    expect(res.json.text).toBe(s.text);
    expect(res.json.roles.map((r: any) => [r.code, r.evidenceStatus, r.method])).toEqual([['dealer', 'manually_confirmed', 'manual'], ['market', 'manually_confirmed', 'manual']]);
    expect(res.json.divisions.map((d: any) => d.code)).toEqual(['bus', 'van']);
    expect((await call('PATCH', `/snippets/${s.id}`, { roles: ['kunde'] })).status).toBe(400);
    const audit = (await call('GET', `/audit-events?entityType=snippet&entityId=${s.id}`)).json;
    expect(audit[0]).toMatchObject({ actor: 'u-redaktion', action: 'snippet.classified' });
  });
});

describe('Qualitätsanalyse (US-005, US-006, US-007)', () => {
  it('[T-106] exakte und semantische Dopplungen getrennt, Widerspruchstypen erkannt', async () => {
    const run = await call('POST', '/quality/analysis');
    expect(run.status).toBe(202);
    await ctx.jobs.idle();
    expect((await call('GET', `/quality/analysis/${run.json.id}`)).json.status).toBe('completed');
    const f = await openFindings();
    const dup = f.filter((x) => x.type === 'duplicate');
    expect(dup.find((x) => x.subtype === 'exact_hash')).toMatchObject({ score: 1, details: { level: 1, crossChapter: true } });
    const semantic = dup.find((x) => x.subtype === 'semantic');
    expect(semantic.details.level).toBe(2);
    expect(semantic.a.text).toContain('archiviert');
    const contradictions = f.filter((x) => x.type === 'contradiction');
    expect(contradictions.map((x) => x.subtype).sort()).toEqual(['deadline', 'negation', 'obligation']);
    for (const c of contradictions) {
      expect(c.severity).toBe('blocker');
      expect(c.a.path).toBeTruthy();
      expect(c.b.path).toBeTruthy();
      expect(c.score).toBeGreaterThanOrEqual(0.4);
      expect(c.method).toContain('tfidf-cosine');
    }
    expect(f.find((x) => x.type === 'gap' && x.reason.includes('3.5 Rollenzuordnung'))).toBeTruthy();
    // Wiederholte Analyse erzeugt keine Duplikate von Befunden
    await call('POST', '/quality/analysis');
    await ctx.jobs.idle();
    expect((await openFindings()).length).toBe(f.length);
  });

  it('[T-107] Cluster bestätigen, umbenennen, teilen und zusammenführen', async () => {
    const clusters = (await call('GET', '/clusters')).json;
    expect(clusters.length).toBeGreaterThan(1);
    const big = clusters.find((c: any) => c.members.length >= 2);
    expect(big.members[0]).toHaveProperty('score');
    expect(big.members[0].reason).toBeTruthy();
    const renamed = (await call('PATCH', `/clusters/${big.id}`, { name: 'Freigabe von Benutzern', status: 'confirmed' })).json;
    expect(renamed).toMatchObject({ name: 'Freigabe von Benutzern', status: 'confirmed' });
    const [rest, split] = (await call('POST', `/clusters/${big.id}/split`, { snippetIds: [big.members[0].snippetId], name: 'Abgeteilt' })).json;
    expect(split.members.map((m: any) => m.snippetId)).toEqual([big.members[0].snippetId]);
    expect(rest.members).toHaveLength(big.members.length - 1);
    const merged = (await call('POST', `/clusters/${big.id}/merge`, { clusterIds: [split.id] })).json;
    expect(merged.members).toHaveLength(big.members.length);
    expect((await call('GET', '/clusters?status=dissolved')).json.map((c: any) => c.id)).toContain(split.id);
  });

  it('[T-108] Entscheidungen brauchen Begründung; offene Blocker verhindern Generierung', async () => {
    const ch3 = await chapterId('3.');
    const gen = await call('POST', `/chapters/${ch3}/generate`, {}, 'u-redaktion');
    expect(gen.status).toBe(409);
    expect(gen.json.gate.checks.find((c: any) => c.code === 'no_open_blockers').passed).toBe(false);

    const findings = (await openFindings(`&type=contradiction&chapterId=${ch3}`));
    const f = findings[0];
    expect((await call('POST', `/quality/findings/${f.id}/decision`, { decision: 'take_a', reason: '' }, 'u-fachpruefung')).status).toBe(422);
    expect((await call('POST', `/quality/findings/${f.id}/decision`, { decision: 'take_a', reason: 'passt' }, 'u-redaktion')).status).toBe(403);
    expect((await call('POST', `/quality/findings/${f.id}/decision`, { decision: 'erfinden', reason: 'passt' }, 'u-fachpruefung')).status).toBe(400);

    const deferred = (await call('POST', `/quality/findings/${f.id}/decision`, { decision: 'defer', reason: 'Rückfrage Fachbereich' }, 'u-fachpruefung')).json;
    expect(deferred.status).toBe('deferred');
    expect((await call('POST', `/chapters/${ch3}/generate`, {}, 'u-redaktion')).status).toBe(409);

    for (const x of findings) {
      const outdatedSide = /_alt|_v2/.test(x.a.path) ? 'a' : 'b';
      const body = x.subtype === 'deadline'
        ? { decision: 'outdated_source', outdated: outdatedSide, reason: 'Alte Prozessbeschreibung' }
        : { decision: outdatedSide === 'b' ? 'take_a' : 'take_b', reason: 'Aktuelle Quelle ist führend' };
      const res = await call('POST', `/quality/findings/${x.id}/decision`, body, 'u-fachpruefung');
      expect(res.status).toBe(200);
      expect(res.json).toMatchObject({ status: 'resolved', decidedBy: 'u-fachpruefung', decisionReason: body.reason });
      expect(res.json.decidedAt).toBeTruthy();
      expect(res.json[outdatedSide].excludedReason).toContain(`Befund #${x.seq}`);
    }
  });

  it('[T-109] Canonical Topic legt führendes Kapitel fest und erzeugt Querverweis', async () => {
    const dup = (await openFindings('&type=duplicate')).find((x) => x.subtype === 'exact_hash');
    const ch5 = await chapterId('5.');
    expect((await call('POST', '/canonical-topics', { title: 'Änderungsprotokoll', snippetIds: [dup.a.id, dup.b.id], leadChapterId: ch5, reason: '' }, 'u-fachpruefung')).status).toBe(422);
    const topic = await call('POST', '/canonical-topics', { title: 'Änderungsprotokoll', snippetIds: [dup.a.id, dup.b.id], leadChapterId: ch5, reason: 'MO-Check beschreibt Protokoll fachlich' }, 'u-fachpruefung');
    expect(topic.status).toBe(201);
    expect((await call('GET', `/quality/findings/${dup.id}`)).json).toMatchObject({ status: 'resolved', decision: 'canonical_topic' });

    const v = (await call('POST', `/chapters/${await chapterId('3.')}/generate`, {}, 'u-redaktion')).json;
    const xref = blocks(v).find((b: any) => b.kind === 'xref');
    expect(xref.text).toBe('Siehe Kapitel „5. MO-Check“ – Änderungsprotokoll.');
    expect(blocks(v).some((b: any) => b.kind !== 'xref' && b.text.includes('Änderungsprotokoll'))).toBe(false);
    const v5 = (await call('POST', `/chapters/${ch5}/generate`, {}, 'u-redaktion')).json;
    expect(blocks(v5).some((b: any) => b.text.startsWith('Alle Änderungen werden im Änderungsprotokoll'))).toBe(true);
  });
});

describe('Kapitelgenerierung und Werkstatt (US-008, US-009)', () => {
  let versionId: string;

  it('[T-110] nur bestätigte Quellen, feste Struktur, Quellenbeziehung je Absatz', async () => {
    const ch3 = await chapterId('3.');
    const res = await call('POST', `/chapters/${ch3}/generate`, {}, 'u-redaktion');
    expect(res.status).toBe(201);
    const v = res.json;
    versionId = v.id;
    expect(v.status).toBe('draft');
    expect(v.sections.map((s: any) => s.title)).toEqual([
      'Zweck', 'Voraussetzungen', 'Rollen und Zuständigkeiten', 'Schrittweise Durchführung', 'Ergebnis und Systemstatus',
      'Rollenabhängige Besonderheiten', 'Sparten-, Markt- und Releaseunterschiede', 'Hinweise, Tipps und Warnungen', 'Fehlerbehebung', 'Quellen- und Freigabestatus',
    ]);
    const all = blocks(v);
    for (const b of all) if (b.kind !== 'gap') expect(b.sources.length).toBeGreaterThan(0);
    const texts = all.map((b: any) => b.text).join('\n');
    expect(texts).not.toContain('optional'); // ausgeschlossen durch Entscheidung
    expect(texts).not.toContain('5 Tagen'); // veraltete Quelle
    expect(texts).not.toContain('keine Bestätigungs-E-Mail');
    expect(texts).toContain('Ein Administrator muss den Benutzer freigeben');
    const steps = v.sections.find((s: any) => s.code === 'steps').blocks;
    expect(steps.some((b: any) => b.text.startsWith('1. Öffnen Sie'))).toBe(true);
    expect(v.sections.find((s: any) => s.code === 'result').blocks[0].text).toMatch(/^Ergebnis:/);
    expect(v.sections.find((s: any) => s.code === 'troubleshooting').blocks[0].kind).toBe('note');
    const src = all.find((b: any) => b.text.startsWith('Ein Administrator')).sources[0];
    expect(src).toMatchObject({ path: 'benutzerverwaltung/user_management.md', revisionNo: 1 });
    expect(src.lineStart).toBeGreaterThan(1);
    expect(v.generation.skippedUnconfirmed).toBe(0);

    const ch4 = (await call('POST', `/chapters/${await chapterId('4.')}/generate`, {}, 'u-redaktion')).json;
    // Rollen wurden in T-105 manuell bestätigt, der Evidenzstatus des Textes selbst ist aber unbestätigt → nicht übernommen
    expect(blocks(ch4).some((b: any) => b.text.includes('Busse'))).toBe(false);
    expect(ch4.generation.skippedUnconfirmed).toBe(1);
    const bus = (await call('GET', '/snippets?q=Busse')).json.items[0];
    expect(bus.evidenceStatus).toBe('unconfirmed');
  });

  it('[T-111] ändern, verschieben, löschen, wiederherstellen; manuelle Änderungen sind geschützt', async () => {
    const v = (await call('GET', `/chapter-versions/${versionId}`)).json;
    const purpose = v.sections.find((s: any) => s.code === 'purpose').blocks[0];
    const edited = await call('PATCH', `/content-blocks/${purpose.id}`, { text: 'Die Benutzerverwaltung steuert, wer oneSCM nutzen darf.', reason: 'Kürzer formuliert', expectedVersionNo: 1 }, 'u-redaktion');
    expect(edited.json).toMatchObject({ mode: 'manually_edited', versionNo: 2 });
    expect((await call('PATCH', `/content-blocks/${purpose.id}`, { text: 'x', expectedVersionNo: 1 }, 'u-redaktion')).status).toBe(409);

    const hint = v.sections.find((s: any) => s.code === 'troubleshooting').blocks[0];
    const moved = (await call('PATCH', `/content-blocks/${hint.id}`, { section: 'hints' }, 'u-redaktion')).json;
    expect(moved.section).toBe('hints');

    const del = await call('DELETE', `/content-blocks/${hint.id}?reason=doppelt`, undefined, 'u-redaktion');
    expect(del.status).toBe(204);
    expect(blocks((await call('GET', `/chapter-versions/${versionId}`)).json).some((b: any) => b.id === hint.id)).toBe(false);
    const history = (await call('GET', `/content-blocks/${hint.id}/versions`)).json;
    expect(history.map((h: any) => h.changeType)).toEqual(['deleted', 'moved', 'created']);
    const restored = (await call('POST', `/content-blocks/${hint.id}/restore`, { versionNo: 1 }, 'u-redaktion')).json;
    expect(restored).toMatchObject({ section: 'troubleshooting', versionNo: 4, deletedAt: null });

    const locked = (await call('PATCH', `/content-blocks/${hint.id}`, { mode: 'locked' }, 'u-redaktion')).json;
    expect(locked.mode).toBe('locked');
    expect((await call('PATCH', `/content-blocks/${hint.id}`, { text: 'anders' }, 'u-redaktion')).status).toBe(409);
    expect((await call('DELETE', `/content-blocks/${hint.id}`, undefined, 'u-redaktion')).status).toBe(409);

    const added = await call('POST', `/chapter-versions/${versionId}/content-blocks`, { section: 'hints', kind: 'tip', text: 'Prüfen Sie vor der Freigabe die Organisationseinheit.', justification: 'Ergänzung aus Fachabstimmung', roles: ['all'], divisions: ['all'], scopeStatus: 'general' }, 'u-redaktion');
    expect(added.status).toBe(201);
    expect(added.json).toMatchObject({ mode: 'manually_edited', kind: 'tip' });

    // Neugenerierung überschreibt manuelle und gesperrte Blöcke nicht
    const regen = (await call('POST', `/chapters/${await chapterId('3.')}/generate`, {}, 'u-redaktion')).json;
    const rb = blocks(regen);
    expect(regen.versionNo).toBeGreaterThan(v.versionNo);
    expect(rb.find((b: any) => b.lineageId === purpose.lineageId)).toMatchObject({ text: 'Die Benutzerverwaltung steuert, wer oneSCM nutzen darf.', mode: 'manually_edited' });
    expect(rb.find((b: any) => b.lineageId === hint.lineageId).mode).toBe('locked');
    expect(rb.filter((b: any) => b.text.startsWith('Die Benutzerverwaltung legt fest'))).toHaveLength(0);
    expect(rb.some((b: any) => b.kind === 'tip')).toBe(true);
    expect((await call('GET', `/chapter-versions/${versionId}`)).json.status).toBe('superseded');
    expect((await call('PATCH', `/content-blocks/${purpose.id}`, { text: 'alt' }, 'u-redaktion')).status).toBe(409);
    versionId = regen.id;
  });

  it('[T-112] Qualitätsgate blockiert Einreichen und Freigabe; Freigabe protokolliert; Version danach unveränderlich', async () => {
    const gate = (await call('GET', `/chapter-versions/${versionId}/gate`)).json;
    expect(gate.passed).toBe(false);
    expect(gate.checks.find((c: any) => c.code === 'evidence_per_block').passed).toBe(false);
    const blocked = await call('POST', `/chapter-versions/${versionId}/submit`, {}, 'u-redaktion');
    expect(blocked.status).toBe(409);
    expect(blocked.json.gate.passed).toBe(false);
    expect((await call('POST', `/chapter-versions/${versionId}/approve`, { comment: 'ok' }, 'u-freigabe')).json.detail).toContain('zuerst zur Freigabe eingereicht');

    const v = (await call('GET', `/chapter-versions/${versionId}`)).json;
    for (const b of blocks(v)) {
      if (b.kind === 'gap') await call('PATCH', `/content-blocks/${b.id}`, { justification: 'Abschnitt entfällt für dieses Kapitel', scopeStatus: 'general' }, 'u-redaktion');
      else if (b.scopeStatus === 'unconfirmed') await call('PATCH', `/content-blocks/${b.id}`, { mode: 'manually_edited', scopeStatus: 'general' }, 'u-redaktion');
    }
    expect((await call('GET', `/chapter-versions/${versionId}/gate`)).json.passed).toBe(true);
    await freigeben(versionId, 'Fachlich geprüft');
    const ok = (await call('GET', `/chapter-versions/${versionId}`)).json;
    expect(ok.status).toBe('approved');
    expect(ok.approvals[ok.approvals.length - 1]).toMatchObject({ approver: 'u-freigabe', decision: 'approved', comment: 'Fachlich geprüft' });
    expect(blocks(ok).every((b: any) => b.mode === 'approved')).toBe(true);
    const anyBlock = blocks(ok)[0];
    expect((await call('PATCH', `/content-blocks/${anyBlock.id}`, { text: 'nachträglich' })).status).toBe(409);
    expect((await call('POST', `/chapter-versions/${versionId}/approve`, { comment: 'nochmal' }, 'u-freigabe')).status).toBe(409);
    const audit = (await call('GET', `/audit-events?entityType=chapter_version&entityId=${versionId}`)).json;
    expect(audit.map((a: any) => a.action)).toEqual(expect.arrayContaining(['chapter_version.submitted', 'chapter_version.approved']));
  });
});

/** Einreichen (Redaktion) und freigeben (Freigabe) – Workflow US-016 */
async function freigeben(versionId: string, comment = 'Freigabe Test') {
  const sub = await call('POST', `/chapter-versions/${versionId}/submit`, { comment: 'Bitte prüfen' }, 'u-redaktion');
  expect(sub.status, JSON.stringify(sub.json)).toBe(200);
  const res = await call('POST', `/chapter-versions/${versionId}/approve`, { comment }, 'u-freigabe');
  expect(res.status, JSON.stringify(res.json)).toBe(200);
  return res.json;
}

async function approveChapter(prefix: string) {
  const v = (await call('POST', `/chapters/${await chapterId(prefix)}/generate`, {}, 'u-redaktion')).json;
  for (const b of blocks(v)) {
    if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
    else if (b.scopeStatus === 'unconfirmed') await call('PATCH', `/content-blocks/${b.id}`, { scopeStatus: 'confirmed' }, 'u-redaktion');
  }
  return freigeben(v.id);
}

describe('Export (US-010, US-012, US-014)', () => {
  it('[T-113] gefilterter Export enthält allgemeine plus passende spezifische Inhalte', async () => {
    await approveChapter('4.');
    const ch3 = await chapterId('3.');
    const ch4 = await chapterId('4.');
    const truck = await call('POST', '/exports', { chapterIds: [ch3, ch4], roles: ['dealer'], divisions: ['truck'] }, 'u-leser');
    expect(truck.status).toBe(201);
    const md = (await call('GET', `/exports/${truck.json.id}/download`)).body;
    expect(md).toContain('## 4. Vertragsbearbeitung');
    expect(md).toContain('Laufleistung');
    expect(md).toContain('> 🏪 Dealer · 🚛 Truck');
    expect(md).not.toContain('Produkt nicht verfügbar');
    expect(md).toContain('Filter: Rollen: Dealer · Sparten: Truck');
    const car = (await call('GET', `/exports/${(await call('POST', '/exports', { chapterIds: [ch4], divisions: ['car'] })).json.id}/download`)).body;
    expect(car).toContain('Produkt nicht verfügbar');
    expect(car).not.toContain('Laufleistung');
    const hq = (await call('GET', `/exports/${(await call('POST', '/exports', { chapterIds: [ch3], roles: ['hq'] })).json.id}/download`)).body;
    expect(hq).toContain('Ein Administrator muss den Benutzer freigeben');
    const unapproved = await call('POST', '/exports', { chapterIds: [await chapterId('5.')] });
    expect(unapproved.json.skipped[0].reason).toContain('keine freigegebene Version');
  });

  it('[T-114] Datenschutzblocker verhindern Generierung und Export', async () => {
    const ch7 = await chapterId('7.');
    const privacy = (await openFindings(`&type=privacy&chapterId=${ch7}`))[0];
    expect(privacy).toMatchObject({ severity: 'blocker', subtype: 'iban' });
    expect(privacy.reason).not.toContain('0000 0000'); // maskiert
    const exp = await call('POST', '/exports', { chapterIds: [ch7] });
    expect(exp.status).toBe(409);
    expect(exp.json.blockers[0].checks.map((c: any) => c.code)).toContain('no_privacy_blockers');
    expect((await call('POST', `/chapters/${ch7}/generate`, {}, 'u-redaktion')).status).toBe(409);
  });
});

describe('Traceability (US-020)', () => {
  it('[T-115] jede P0-Story getestet, jede Operation mit Story, Export als CSV/MD/XLSX', async () => {
    const m = (await call('GET', '/traceability')).json;
    expect(m.issues).toEqual([]);
    for (const r of m.rows.filter((x: any) => x.priority === 'P0')) {
      expect(r.tests.length, r.requirement).toBeGreaterThan(0);
      expect(r.apiOperations.length, r.requirement).toBeGreaterThan(0);
    }
    const mandatory = ['POST /api/v1/imports', 'GET /api/v1/imports/{importId}', 'GET /api/v1/snippets', 'PATCH /api/v1/snippets/{snippetId}', 'POST /api/v1/quality/analysis',
      'GET /api/v1/quality/findings', 'POST /api/v1/quality/findings/{findingId}/decision', 'POST /api/v1/chapters/{chapterId}/generate', 'GET /api/v1/chapter-versions/{versionId}',
      'PATCH /api/v1/content-blocks/{blockId}', 'DELETE /api/v1/content-blocks/{blockId}', 'POST /api/v1/chapter-versions/{versionId}/approve', 'POST /api/v1/exports', 'GET /api/v1/traceability'];
    const ops = m.operations.map((o: any) => `${o.method} ${o.path}`);
    for (const op of mandatory) expect(ops).toContain(op);
    for (const o of m.operations.filter((x: any) => !x.extension)) expect(mandatory).toContain(`${o.method} ${o.path}`);

    const csv = await call('GET', '/traceability?format=csv');
    expect(csv.headers['content-type']).toContain('text/csv');
    expect(csv.body).toContain('US-001;Quellen importieren;P0');
    const md = await call('GET', '/traceability?format=md');
    expect(md.body).toContain('| US-020 | Traceability | P0 |');
    const xlsx = await app.inject({ method: 'GET', url: '/api/v1/traceability?format=xlsx' });
    expect(xlsx.rawPayload.subarray(0, 2).toString()).toBe('PK');
  });

  it('[T-116] Test-Registry ist konsistent mit den Testdateien', () => {
    const tests = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'traceability', 'tests.json'), 'utf8'));
    for (const t of tests) {
      const file = fs.readFileSync(path.join(REPO_ROOT, t.file), 'utf8');
      expect(file.includes(`[${t.id}]`), `${t.id} fehlt in ${t.file}`).toBe(true);
    }
  });

  it('[T-117] Terminologie-/Lesbarkeitsbefunde und Einstellungen', async () => {
    const f = await openFindings();
    expect(f.find((x) => x.type === 'terminology').reason).toBe('„Genehmigung“ → bevorzugt „Freigabe“');
    expect(f.find((x) => x.type === 'readability')).toBeTruthy();
    expect((await call('PUT', '/settings', { analysis: { clusterThreshold: 0.6 } }, 'u-redaktion')).status).toBe(403);
    expect((await call('PUT', '/settings', { analysis: { clusterThreshold: 7 } })).status).toBe(400);
    const s = (await call('PUT', '/settings', { analysis: { clusterThreshold: 0.6 } })).json;
    expect(s.analysis).toMatchObject({ clusterThreshold: 0.6, duplicateThreshold: 0.85 });
    const ref = (await call('GET', '/reference')).json;
    expect(ref.roles.map((r: any) => `${r.icon} ${r.label}`)).toEqual(['🏪 Dealer', '🌍 Markt', '✅ MO', '🏢 HQ', '👥 Alle']);
    expect(ref.divisions.map((r: any) => `${r.icon} ${r.label}`)).toEqual(['🚘 PKW', '🚐 VAN', '🚛 Truck', '🚌 Bus', '🔄 Alle', '❓ Ungeklärt']);
    const dash = (await call('GET', '/dashboard')).json;
    expect(dash.snippets).toBeGreaterThan(20);
  });
});
