import fs from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { checkSentences, parseRewriteResponse, sentenceEvidenceProblems } from '../src/domain/rewrite.js';
import type { LlmConfig } from '../src/llm.js';
import { freshDatabase, tempDir } from './helpers.js';

const MD = `---
roles: [all]
divisions: [all]
evidence_status: source_confirmed
---
# 1. Umformulierung

## 1.1 Zweck

Dieses Kapitel beschreibt das Anlegen eines Auftrags. Der Auftrag wird im Modul Verkauf erfasst.

## 1.2 Schritte

1. Modul Verkauf öffnen.
2. Auftrag anlegen.

Ergebnis: Der Auftrag erhält die Nummer 4711.
`;

const VALID = [
  { text: 'Dieses Kapitel erklärt, wie Sie einen Auftrag anlegen.', sources: ['S1'] },
  { text: 'Sie erfassen den Auftrag im Modul Verkauf.', sources: ['S1'] },
];
const INVALID = [
  { text: 'Dieses Kapitel beschreibt das Anlegen eines Auftrags in 3 Minuten.', sources: ['S1'] },
  { text: 'Der Auftrag wird im Modul Verkauf erfasst.', sources: [] },
  { text: 'Kunden erhalten automatisch eine Rechnung per Post zugestellt.', sources: ['S1'] },
  { text: 'Der Auftrag wird erfasst.', sources: ['S9'] },
];

/** Nachgebildeter KI-Dienst: zeichnet Anfragen auf und antwortet im Format von Anthropic oder OpenAI. */
function mockLlm() {
  const requests: { path: string; headers: http.IncomingHttpHeaders; body: any }[] = [];
  let reply: { status?: number; sentences?: unknown; raw?: string } = { sentences: VALID };
  const server = http.createServer((req, res) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      requests.push({ path: req.url ?? '', headers: req.headers, body: JSON.parse(data) });
      const text = reply.raw ?? '```json\n' + JSON.stringify({ sentences: reply.sentences }) + '\n```';
      res.writeHead(reply.status ?? 200, { 'content-type': 'application/json' });
      if ((reply.status ?? 200) >= 400) return res.end(JSON.stringify({ error: { message: 'überlastet' } }));
      res.end(JSON.stringify(req.url?.includes('/chat/completions')
        ? { choices: [{ message: { role: 'assistant', content: text } }], usage: { prompt_tokens: 120, completion_tokens: 40 } }
        : { content: [{ type: 'text', text }], stop_reason: 'end_turn', usage: { input_tokens: 100, output_tokens: 30 } }));
    });
  });
  return {
    requests,
    set: (r: typeof reply) => (reply = r),
    start: () => new Promise<string>((ok) => server.listen(0, '127.0.0.1', () => ok(`http://127.0.0.1:${(server.address() as AddressInfo).port}`))),
    stop: () => new Promise<void>((ok) => server.close(() => ok())),
  };
}

function multipart(fileName: string, data: Buffer) {
  const boundary = '----onescm' + Math.random().toString(16).slice(2);
  const head = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`);
  return { payload: Buffer.concat([head, data, Buffer.from(`\r\n--${boundary}--\r\n`)]), headers: { 'content-type': `multipart/form-data; boundary=${boundary}` } };
}

type App = Awaited<ReturnType<typeof buildApp>>;

async function setup(dataDir: string, name: string, llm: LlmConfig | null) {
  const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, name), logger: false, webDist: null, authMode: 'demo', llm });
  const call = async (method: 'GET' | 'POST' | 'PATCH' | 'DELETE', url: string, body?: unknown, user = 'u-redaktion') => {
    const res = await built.app.inject({ method, url: `/api/v1${url}`, payload: body as any, headers: { 'x-user-id': user } });
    let json: any = null;
    try {
      json = res.json();
    } catch {
      /* kein JSON */
    }
    return { status: res.statusCode, json };
  };
  const mp = multipart('umformulierung.md', Buffer.from(MD));
  const res = await built.app.inject({ method: 'POST', url: '/api/v1/imports', payload: mp.payload, headers: { ...mp.headers, 'x-user-id': 'u-admin' } });
  expect(res.statusCode).toBe(202);
  await built.ctx.jobs.idle();
  const chapterId = (await call('GET', '/chapters')).json[0].id;
  return { built, call, chapterId };
}

const blocksOf = (v: any) => v.sections.flatMap((s: any) => s.blocks);

describe('KI-Umformulierung: Anthropic-Adapter, Übernahme und Satz-Evidenz (ADR-013)', () => {
  const dataDir = tempDir();
  const mock = mockLlm();
  let s: Awaited<ReturnType<typeof setup>>;
  beforeAll(async () => {
    const url = await mock.start();
    s = await setup(dataDir, 'rw-anthropic', { provider: 'anthropic', model: 'claude-sonnet-5', apiKey: 'test-key', baseUrl: url });
  });
  afterAll(async () => {
    await s.built.app.close();
    await mock.stop();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('[T-128] Vorschlag über die Claude-API, Übernahme mit Satz-Evidenz, Gate und Neugenerierung', async () => {
    const { call, chapterId } = s;
    expect((await call('GET', '/llm/status')).json).toMatchObject({ enabled: true, provider: 'anthropic', model: 'claude-sonnet-5', external: true });
    expect((await call('GET', '/health')).json.llm).toBe('anthropic');
    const v = (await call('POST', `/chapters/${chapterId}/generate`)).json;
    const purpose = blocksOf(v).find((b: any) => b.section === 'purpose');

    const created = await call('POST', `/content-blocks/${purpose.id}/rewrite-proposals`, { instructions: 'kürzer' });
    expect(created.status).toBe(201);
    const p = created.json;
    expect(p).toMatchObject({ status: 'proposed', valid: true, provider: 'anthropic', model: 'claude-sonnet-5', blockVersionNo: 1, originalText: purpose.text });
    expect(p.proposedText).toBe(`${VALID[0].text} ${VALID[1].text}`);
    expect(p.sentences.map((x: any) => x.sourceIds)).toEqual([[purpose.sources[0].snippetId], [purpose.sources[0].snippetId]]);
    expect(p.sentences.every((x: any) => x.issues.length === 0 && x.support >= 0.5)).toBe(true);

    // Anfrage im Format der Messages API; nur Absatz, Quellen und Terminologie werden übertragen
    const req = mock.requests.at(-1)!;
    expect(req.path).toBe('/v1/messages');
    expect(req.headers['x-api-key']).toBe('test-key');
    expect(req.headers['anthropic-version']).toBe('2023-06-01');
    expect(req.body).toMatchObject({ model: 'claude-sonnet-5', messages: [{ role: 'user' }] });
    expect(req.body.system).toContain('Erfinde keine Fakten');
    const data = JSON.parse(req.body.messages[0].content.match(/<<<DATA\n([\s\S]*)\nDATA>>>/)[1]);
    expect(data).toMatchObject({ blockType: 'paragraph', section: 'purpose', paragraph: purpose.text, sources: [{ id: 'S1' }], editorNote: 'kürzer' });
    expect(data.terminology.map((t: any) => t.preferred)).toContain('Freigabe');

    // Übernehmen: neuer Modus, Satz-Evidenz, Blockversion mit Änderungstyp „rewritten“
    const accepted = await call('POST', `/rewrite-proposals/${p.id}/accept`, { reason: 'klarer' });
    expect(accepted.status).toBe(200);
    expect(accepted.json).toMatchObject({ mode: 'ai_rewritten', text: p.proposedText, versionNo: 2 });
    expect(accepted.json.sentences).toEqual(VALID.map((x) => ({ text: x.text, sourceIds: [purpose.sources[0].snippetId] })));
    expect((await call('GET', `/content-blocks/${purpose.id}/versions`)).json[0]).toMatchObject({ changeType: 'rewritten', reason: expect.stringContaining('anthropic/claude-sonnet-5') });
    expect((await call('POST', `/rewrite-proposals/${p.id}/accept`)).status).toBe(409); // nicht doppelt
    const listed = (await call('GET', `/content-blocks/${purpose.id}/rewrite-proposals`)).json;
    expect(listed[0]).toMatchObject({ id: p.id, status: 'accepted', decidedBy: 'u-redaktion', decisionReason: 'klarer' });

    // Audit enthält Anbieter, Modell, Prompt-Hash und übertragene Textabschnitte
    const events = (await call('GET', `/audit-events?entityId=${purpose.id}`, undefined, 'u-admin')).json;
    const proposed = (events.items ?? events).find((e: any) => e.action === 'rewrite.proposed');
    expect(proposed.details).toMatchObject({ provider: 'anthropic', model: 'claude-sonnet-5', sentSnippetIds: [purpose.sources[0].snippetId], external: true });
    expect(proposed.details.promptHash).toMatch(/^[0-9a-f]{64}$/);

    // Qualitätsgate prüft die Satz-Evidenz
    const gate = (await call('GET', `/chapter-versions/${v.id}/gate`)).json;
    expect(gate.checks.find((c: any) => c.code === 'sentence_evidence')).toMatchObject({ passed: true });

    // Neugenerierung übernimmt den umformulierten Absatz geschützt
    const v2 = (await call('POST', `/chapters/${chapterId}/generate`)).json;
    const carried = blocksOf(v2).find((b: any) => b.lineageId === purpose.lineageId);
    expect(carried).toMatchObject({ mode: 'ai_rewritten', text: p.proposedText });
    expect(carried.sentences).toHaveLength(2);

    // Manuelle Textänderung: Satz-Evidenz entfällt, Modus „manuell bearbeitet“
    const edited = (await call('PATCH', `/content-blocks/${carried.id}`, { text: 'Freier Text der Redaktion.' })).json;
    expect(edited).toMatchObject({ mode: 'manually_edited', sentences: null });
    // Wiederherstellen der KI-Fassung stellt auch die Satz-Evidenz wieder her
    const restored = (await call('POST', `/content-blocks/${carried.id}/restore`, { versionNo: 1 })).json;
    expect(restored).toMatchObject({ mode: 'ai_rewritten', text: p.proposedText });
    expect(restored.sentences).toHaveLength(2);

    // Satz-Evidenz, die nicht mehr zu den Quellen passt, blockiert das Gate
    await call('PATCH', `/content-blocks/${carried.id}`, { sourceIds: [] , justification: 'Test' });
    const gate2 = (await call('GET', `/chapter-versions/${v2.id}/gate`)).json;
    expect(gate2.checks.find((c: any) => c.code === 'sentence_evidence')).toMatchObject({ passed: false, details: [expect.stringContaining('nicht mehr zugeordnet')] });
  });
});

describe('KI-Umformulierung: OpenAI-kompatibler Adapter und Satzprüfung (ADR-013)', () => {
  const dataDir = tempDir();
  const mock = mockLlm();
  let s: Awaited<ReturnType<typeof setup>>;
  beforeAll(async () => {
    const url = await mock.start();
    s = await setup(dataDir, 'rw-openai', { provider: 'openai', model: 'gpt-test', apiKey: 'sk-test', baseUrl: `${url}/v1` });
  });
  beforeEach(() => mock.set({ sentences: VALID }));
  afterAll(async () => {
    await s.built.app.close();
    await mock.stop();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('[T-129] Chat-Completions-Format; unbelegte, erfundene oder fremde Sätze machen den Vorschlag ungültig', async () => {
    const { call, chapterId } = s;
    const v = (await call('POST', `/chapters/${chapterId}/generate`)).json;
    const purpose = blocksOf(v).find((b: any) => b.section === 'purpose');

    mock.set({ sentences: INVALID });
    const p = (await call('POST', `/content-blocks/${purpose.id}/rewrite-proposals`)).json;
    const req = mock.requests.at(-1)!;
    expect(req.path).toBe('/v1/chat/completions');
    expect(req.headers.authorization).toBe('Bearer sk-test');
    expect(req.body).toMatchObject({ model: 'gpt-test', messages: [{ role: 'system' }, { role: 'user' }] });

    expect(p).toMatchObject({ status: 'invalid', valid: false, provider: 'openai', usage: { inputTokens: 120, outputTokens: 40 } });
    expect(p.sentences.map((x: any) => x.issues)).toEqual([['new_numbers'], ['no_sources'], ['low_support'], ['unknown_source']]);
    expect(p.sentences[0].details[0]).toContain('3');
    const accept = await call('POST', `/rewrite-proposals/${p.id}/accept`);
    expect(accept.status).toBe(409);
    expect(accept.json.detail).toContain('Satzprüfung');
    expect((await call('POST', `/rewrite-proposals/${p.id}/reject`, { reason: 'unbrauchbar' })).json).toMatchObject({ status: 'rejected', decisionReason: 'unbrauchbar' });

    // Veraltet: Absatz nach dem Vorschlag geändert
    mock.set({ sentences: VALID });
    const p2 = (await call('POST', `/content-blocks/${purpose.id}/rewrite-proposals`)).json;
    expect(p2.status).toBe('proposed');
    await call('PATCH', `/content-blocks/${purpose.id}`, { comment: 'Bitte prüfen' });
    const stale = await call('POST', `/rewrite-proposals/${p2.id}/accept`);
    expect(stale.status).toBe(409);
    expect(stale.json.detail).toContain('veraltet');
    expect((await call('GET', `/rewrite-proposals/${p2.id}`)).json.status).toBe('stale');

    // Parallele Änderung zwischen Prüfung und Übernahme: 409 statt Datenbankfehler
    const p4 = (await call('POST', `/content-blocks/${purpose.id}/rewrite-proposals`)).json;
    const db = s.built.ctx.db;
    const tx = db.tx.bind(db);
    db.tx = (async (fn: () => Promise<unknown>) => {
      db.tx = tx;
      await db.run('UPDATE content_blocks SET version_no = version_no + 1 WHERE id = ?', purpose.id);
      return tx(fn);
    }) as typeof db.tx;
    const raced = await call('POST', `/rewrite-proposals/${p4.id}/accept`);
    expect(raced.status).toBe(409);
    expect((await call('GET', `/rewrite-proposals/${p4.id}`)).json.status).toBe('stale');
    expect((await call('GET', `/content-blocks/${purpose.id}/versions`)).json[0].changeType).not.toBe('rewritten');

    // Listen bleiben zeilenweise erhalten
    const steps = blocksOf(v).find((b: any) => b.section === 'steps');
    mock.set({ sentences: [{ text: '1. Öffnen Sie das Modul Verkauf.', sources: ['S1'] }, { text: '2. Legen Sie den Auftrag an.', sources: ['S1'] }] });
    const p3 = (await call('POST', `/content-blocks/${steps.id}/rewrite-proposals`)).json;
    expect(p3).toMatchObject({ status: 'proposed', proposedText: '1. Öffnen Sie das Modul Verkauf.\n2. Legen Sie den Auftrag an.' });
  });
});

describe('KI-Umformulierung: Schutzmechanismen (ADR-013)', () => {
  const dataDir = tempDir();
  const mock = mockLlm();
  let s: Awaited<ReturnType<typeof setup>>;
  let off: Awaited<ReturnType<typeof setup>>;
  beforeAll(async () => {
    const url = await mock.start();
    s = await setup(dataDir, 'rw-guards', { provider: 'anthropic', model: 'claude-sonnet-5', apiKey: 'k', baseUrl: url, timeoutMs: 5000 });
  });
  afterAll(async () => {
    await s.built.app.close();
    await off?.built.app.close();
    await mock.stop();
    fs.rmSync(dataDir, { recursive: true, force: true });
  });

  it('[T-130] ausgeschaltet, Berechtigung, Sperre, Lücken, Datenschutz und Anbieterfehler', async () => {
    const { call, chapterId, built } = s;
    const v = (await call('POST', `/chapters/${chapterId}/generate`)).json;
    const b = blocksOf(v);
    const purpose = b.find((x: any) => x.section === 'purpose');
    const gap = b.find((x: any) => x.kind === 'gap');
    const result = b.find((x: any) => x.section === 'result');
    const sent = () => mock.requests.length;
    const before = sent();

    expect((await call('POST', `/content-blocks/${purpose.id}/rewrite-proposals`, {}, 'u-leser')).status).toBe(403);
    expect((await call('POST', `/content-blocks/${gap.id}/rewrite-proposals`)).status).toBe(422);
    // Manuell eingefügte personenbezogene Daten werden nicht übertragen
    await call('PATCH', `/content-blocks/${result.id}`, { text: 'Ergebnis: Der Auftrag erhält die Nummer 4711. Rückfragen an max.mustermann@firma.de.' });
    const priv = await call('POST', `/content-blocks/${result.id}/rewrite-proposals`);
    expect(priv.status).toBe(422);
    expect(priv.json.detail).toContain('personenbezogene');
    // Offener Datenschutzbefund zur Quelle sperrt die Übertragung
    await built.ctx.db.run(
      `INSERT INTO quality_findings (id, seq, project_id, type, subtype, severity, status, chapter_id, snippet_a_id, method, reason, fingerprint, created_at)
       VALUES ('qf_priv', 9999, 'p_default', 'privacy', 'email', 'blocker', 'open', ?, ?, 'test', 'Testbefund', 'fp-priv', '2026-09-24T00:00:00Z')`,
      chapterId, purpose.sources[0].snippetId,
    );
    const blocked = await call('POST', `/content-blocks/${purpose.id}/rewrite-proposals`);
    expect(blocked.status).toBe(422);
    expect(blocked.json.findings).toEqual([9999]);
    await built.ctx.db.run("UPDATE quality_findings SET status = 'resolved' WHERE id = 'qf_priv'");
    // Gesperrter Block
    await call('PATCH', `/content-blocks/${purpose.id}`, { mode: 'locked' });
    expect((await call('POST', `/content-blocks/${purpose.id}/rewrite-proposals`)).status).toBe(409);
    await call('PATCH', `/content-blocks/${purpose.id}`, { mode: 'manually_edited' });
    expect(sent()).toBe(before); // bis hierher nichts an den Dienst übertragen

    // Anbieterfehler und unbrauchbare Antwort → 502, protokolliert
    mock.set({ status: 529 });
    const failed = await call('POST', `/content-blocks/${purpose.id}/rewrite-proposals`);
    expect(failed.status).toBe(502);
    expect(failed.json.detail).toContain('HTTP 529');
    mock.set({ raw: 'Ich kann dabei leider nicht helfen.' });
    expect((await call('POST', `/content-blocks/${purpose.id}/rewrite-proposals`)).status).toBe(502);
    const events = (await call('GET', `/audit-events?entityId=${purpose.id}`, undefined, 'u-admin')).json;
    expect((events.items ?? events).filter((e: any) => e.action === 'rewrite.failed')).toHaveLength(2);

    // Ohne Konfiguration: Funktion aus, nichts wird übertragen
    off = await setup(tempDir(), 'rw-off', null);
    expect((await off.call('GET', '/llm/status')).json).toMatchObject({ enabled: false, provider: null });
    const vOff = (await off.call('POST', `/chapters/${off.chapterId}/generate`)).json;
    expect((await off.call('POST', `/content-blocks/${blocksOf(vOff)[0].id}/rewrite-proposals`)).status).toBe(503);
  });

  it('[T-131] Satzprüfung und Gate-Regel als Einheit', () => {
    const sources = [{ label: 'S1', snippetId: 'sn1', seq: 1, text: 'Im Modul Verkauf legen Benutzer Aufträge an. Die Frist beträgt 14 Tage.' }];
    const checked = checkSentences(
      [
        { text: 'Sie legen Aufträge im Modul Verkauf an.', sources: ['S1'] },
        { text: 'Die Frist beträgt 30 Tage.', sources: ['s1'] },
        { text: 'Freigabe erfolgt im Modul Verkauf.', sources: ['S1'] },
        { text: 'Schreiben Sie an info@firma.de.', sources: ['S1'] },
      ],
      sources,
      { minSupport: 0.5, preferredTerms: ['Freigabe'] },
    );
    expect(checked.map((c) => c.issues)).toEqual([[], ['new_numbers'], [], expect.arrayContaining(['privacy'])]);
    expect(checked[1].sourceIds).toEqual(['sn1']); // Kennungen unabhängig von Groß-/Kleinschreibung
    expect(() => parseRewriteResponse('keine Ahnung')).toThrow('kein JSON');
    expect(parseRewriteResponse('Hier: {"sentences":[{"text":" A. ","sources":["s2"]}]} Ende')).toEqual([{ text: 'A.', sources: ['S2'] }]);

    const ok = { kind: 'paragraph', text: 'A. B.', mode: 'ai_rewritten', sourceIds: ['x'], sentences: [{ text: 'A.', sourceIds: ['x'] }, { text: 'B.', sourceIds: ['x'] }] };
    expect(sentenceEvidenceProblems(ok)).toEqual([]);
    expect(sentenceEvidenceProblems({ ...ok, text: 'A. C.' })).toEqual(['Text weicht von den belegten Sätzen ab']);
    expect(sentenceEvidenceProblems({ ...ok, sentences: null })).toEqual(['keine Satz-Evidenz gespeichert']);
    expect(sentenceEvidenceProblems({ ...ok, mode: 'generated', sentences: null })).toEqual([]);
  });
});
