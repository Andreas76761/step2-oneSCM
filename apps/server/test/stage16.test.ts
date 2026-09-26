import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { analyzeStyle, autoFix } from '../src/domain/style.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const fm = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';

describe('Etappe 16', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
  } as any));

  it('[T-180] Eigene Stilregeln: Formulierungen mit Ersatz, Anrede, Regeln ausschalten, Satzlänge – in Prüfung, Korrektur und KI-Umformulierung', async () => {
    // Einheit
    const phrases = [{ avoid: 'zu diesem Zeitpunkt', use: 'jetzt' }, { avoid: 'leider', use: '' }, { avoid: 'Kunde', note: 'Geschäftspartner schreiben' }];
    const a = analyzeStyle('Leider ist der Kunde zu diesem Zeitpunkt nicht gespeichert.', { phrases });
    expect(a.sentences[0].issues.filter((i) => i.rule === 'custom').map((i) => i.message)).toEqual(['„Leider“ streichen', 'Geschäftspartner schreiben', '„jetzt“ statt „zu diesem Zeitpunkt“']);
    expect(autoFix('Das Feld ist zu diesem Zeitpunkt leider leer.', { phrases }).text).toBe('Das Feld ist jetzt leer.');
    expect(analyzeStyle('Speichere deine Daten.', { address: 'sie' }).sentences[0].issues.map((i) => i.rule)).toEqual(['address']);
    expect(analyzeStyle('Sie speichern Ihre Daten.', { address: 'du' }).sentences[0].issues.map((i) => i.message)).toEqual(['Anrede: „du“ statt „Ihre“']);
    expect(analyzeStyle('**Sie** speichern.', { address: 'du' }).sentences[0].issues).toEqual([]);
    expect(analyzeStyle('Die Daten wurden eigentlich gespeichert.', { disabled: ['filler', 'past'] }).sentences[0].issues).toEqual([]);

    const built = await build('rules');
    const call = client(built);
    try {
      expect((await call('GET', '/style/rules', undefined, 'u-leser')).json).toEqual({ disabled: [], phrases: [], address: 'sie', maxSentenceWords: null });
      const rules = { disabled: ['filler'], phrases, address: 'sie', maxSentenceWords: 8 };
      expect((await call('PUT', '/style/rules', rules, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/style/rules', { disabled: ['gibtsnicht'] })).status).toBe(400);
      expect((await call('PUT', '/style/rules', { phrases: [{ avoid: 'a' }, { avoid: 'A' }] })).status).toBe(400);
      expect((await call('PUT', '/style/rules', { maxSentenceWords: 3 })).status).toBe(400);
      expect((await call('PUT', '/style/rules', rules)).json).toMatchObject({ disabled: ['filler'], address: 'sie', maxSentenceWords: 8, phrases: [{ avoid: 'zu diesem Zeitpunkt', use: 'jetzt' }, { avoid: 'leider', use: '' }, { avoid: 'Kunde', use: null, note: 'Geschäftspartner schreiben' }] });
      const chk = (await call('POST', '/style/check', { text: 'Der Kunde wird eigentlich zu diesem Zeitpunkt über die neue Funktion im Menü informiert.' }, 'u-leser')).json;
      const rulesHit = chk.sentences[0].issues.map((i: any) => i.rule);
      expect(rulesHit).toEqual(expect.arrayContaining(['custom', 'long_sentence']));
      expect(rulesHit).not.toContain('filler');
      // KI-Umformulierung (Demo) wendet die Projektregeln an
      expect((await call('POST', '/style/rewrite', { text: 'Das Feld ist zu diesem Zeitpunkt leider leer.' })).json.text).toBe('Das Feld ist jetzt leer.');
      // ausgeschaltete eigene Regeln gelten auch nicht für die KI-Umformulierung
      await call('PUT', '/style/rules', { disabled: ['filler', 'custom'] });
      expect((await call('POST', '/style/rewrite', { text: 'Das Feld ist zu diesem Zeitpunkt leider leer.' })).json.text).toBe('Das Feld ist zu diesem Zeitpunkt leider leer.');
      await call('PUT', '/style/rules', { disabled: ['filler'] });
      // Projekte getrennt
      const p2 = (await call('POST', '/projects', { name: 'Zweites Projekt' })).json;
      expect((await call('GET', '/style/rules', undefined, 'u-admin', p2.id)).json.phrases).toEqual([]);
      expect(await built.ctx.db.get("SELECT 1 FROM audit_events WHERE action = 'style.rules_changed'")).toBeTruthy();
    } finally {
      await built.app.close();
    }
  });

  it('[T-181] Benutzerverwaltung: anlegen, ändern, sperren, Schutz vor Aussperren, Projektzugriffe, gesperrte Tokens', async () => {
    const built = await build('users');
    const call = client(built);
    try {
      expect((await call('GET', '/users', undefined, 'u-redaktion')).status).toBe(403);
      const list = (await call('GET', '/users')).json;
      expect(list.map((u: any) => u.id)).toEqual(expect.arrayContaining(['u-admin', 'u-leser', 'u-redaktion']));
      expect(list.find((u: any) => u.id === 'u-admin')).toMatchObject({ origin: 'demo', disabled: false, permissions: expect.arrayContaining(['admin']) });

      // anlegen
      expect((await call('POST', '/users', { id: 'Hans', name: 'Hans' })).status).toBe(400);
      expect((await call('POST', '/users', { id: 'u-hans', name: '' })).status).toBe(400);
      expect((await call('POST', '/users', { id: 'u-hans', name: 'Hans', permissions: ['root'] })).status).toBe(400);
      expect((await call('POST', '/users', { id: 'u-hans', name: 'Hans', email: 'kein-mail' })).status).toBe(400);
      const created = await call('POST', '/users', { id: 'u-hans', name: 'Hans Muster', email: 'Hans@Example.com', permissions: ['edit'] });
      expect(created.status).toBe(201);
      expect(created.json).toMatchObject({ id: 'u-hans', name: 'Hans Muster', email: 'hans@example.com', permissions: ['read', 'edit'], origin: 'local', createdBy: 'u-admin' });
      expect((await call('POST', '/users', { id: 'u-hans', name: 'X' })).status).toBe(409);
      expect((await call('POST', '/users', { id: 'oidc:abc-123', name: 'Extern', permissions: ['admin'] })).json).toMatchObject({ origin: 'oidc', permissions: ['read'] });
      expect((await call('PATCH', '/users/oidc:abc-123', { permissions: ['edit'] })).status).toBe(400);
      // neuer Benutzer kann sich (Demo) anmelden und arbeiten; erscheint in der Auswahl
      expect((await call('GET', '/me', undefined, 'u-hans')).json).toMatchObject({ id: 'u-hans', permissions: ['read', 'edit'] });
      expect((await call('GET', '/reference')).json.users.map((u: any) => u.id)).toContain('u-hans');

      // ändern, sperren, entsperren
      expect((await call('PATCH', '/users/u-hans', { name: 'Hans M.', permissions: ['read'] })).json).toMatchObject({ name: 'Hans M.', permissions: ['read'] });
      expect((await call('PATCH', '/users/u-hans', { disabled: true })).json).toMatchObject({ disabled: true, disabledBy: 'u-admin' });
      expect((await call('GET', '/me', undefined, 'u-hans')).status).toBe(403);
      expect((await call('GET', '/reference')).json.users.map((u: any) => u.id)).not.toContain('u-hans');
      expect((await call('PATCH', '/users/u-hans', { disabled: false })).json.disabled).toBe(false);
      expect((await call('GET', '/me', undefined, 'u-hans')).status).toBe(200);
      expect(await built.ctx.db.get("SELECT 1 FROM audit_events WHERE action = 'user.disabled' AND entity_id = 'u-hans'")).toBeTruthy();

      // Schutz: nicht selbst sperren, eigene Administration nicht entziehen, letzter Administrator bleibt
      expect((await call('PATCH', '/users/u-admin', { disabled: true })).status).toBe(409);
      expect((await call('PATCH', '/users/u-admin', { permissions: ['read'] })).status).toBe(409);
      await call('POST', '/users', { id: 'u-chef', name: 'Chef', permissions: ['admin'] });
      expect((await call('PATCH', '/users/u-admin', { disabled: true }, 'u-chef')).status).toBe(200);
      expect((await call('PATCH', '/users/u-chef', { permissions: ['read'] }, 'u-chef')).status).toBe(409);
      expect((await call('PATCH', '/users/u-admin', { disabled: false }, 'u-chef')).status).toBe(200);
      // gleichzeitiges gegenseitiges Sperren der beiden letzten Administratoren: höchstens eines gelingt
      const both = await Promise.all([call('PATCH', '/users/u-chef', { disabled: true }, 'u-admin'), call('PATCH', '/users/u-admin', { disabled: true }, 'u-chef')]);
      expect(both.map((r) => r.status).sort()).toEqual([200, 409]);
      const activeAdmins = (await call('GET', '/users', undefined, both[0].status === 200 ? 'u-admin' : 'u-chef')).json.filter((u: any) => !u.disabled && u.permissions.includes('admin'));
      expect(activeAdmins).toHaveLength(1);
      await call('PATCH', both[0].status === 200 ? '/users/u-chef' : '/users/u-admin', { disabled: false }, both[0].status === 200 ? 'u-admin' : 'u-chef');
      expect((await call('PATCH', '/users/gibtsnicht', { name: 'x' })).status).toBe(404);

      // Projektzugriffe
      const p2 = (await call('POST', '/projects', { name: 'Geheim', visibility: 'restricted' })).json;
      expect((await call('PUT', `/projects/${p2.id}/members/u-hans`, { permissions: ['read', 'edit'] })).status).toBeLessThan(300);
      const access = (await call('GET', '/users/u-hans/projects')).json;
      expect(access.find((p: any) => p.projectId === p2.id)).toMatchObject({ member: ['read', 'edit'], effective: ['read', 'edit'], visibility: 'restricted' });
      expect(access.find((p: any) => p.projectId === 'p_default')).toMatchObject({ member: null, effective: ['read'], visibility: 'open' });
      expect((await call('GET', '/users/u-leser/projects')).json.find((p: any) => p.projectId === p2.id).effective).toEqual([]);

      // API-Token eines gesperrten Benutzers gilt nicht
      await call('PATCH', '/users/u-hans', { permissions: ['read', 'edit', 'admin'] });
      const tok = (await call('POST', '/api-tokens', { name: 'CI', scopes: ['read'] }, 'u-hans')).json;
      const withToken = () => built.app.inject({ method: 'GET', url: '/api/v1/chapters', headers: { authorization: `Bearer ${tok.token}` } });
      expect((await withToken()).statusCode).toBe(200);
      await call('PATCH', '/users/u-hans', { disabled: true });
      expect((await withToken()).statusCode).toBe(401);
      expect((await built.app.inject({ method: 'GET', url: '/api/v1/users', headers: { authorization: `Bearer ${tok.token}` } })).statusCode).toBe(401);
    } finally {
      await built.app.close();
    }
  });

  it('[T-182] KI-Stapelumformulierung übernehmen mit Versionsprüfung; Suche: Kapitel vor Pfadtreffern', async () => {
    const built = await build('batch');
    const call = client(built);
    try {
      await importFile(built, 'vertrag/anmeldung.md', `${fm}# 1. Anmeldung\n\nDie Anmeldung wurde geprüft.\n\nDas Passwort war leer.\n`);
      await importFile(built, 'anmeldung/hinweise.md', `${fm}# 2. Hinweise\n\nKlicken Sie auf **Hilfe**.\n`);
      const ch = (await call('GET', '/chapters')).json.find((c: any) => c.title === '1. Anmeldung');
      const v = (await call('POST', `/chapters/${ch.id}/generate`, {}, 'u-redaktion')).json;
      const blocks = v.sections.flatMap((s: any) => s.blocks).filter((b: any) => b.kind !== 'gap');
      const [b1, b2] = [blocks.find((b: any) => b.text.includes('Anmeldung wurde')), blocks.find((b: any) => b.text.includes('Passwort'))];
      // Vorschläge je Absatz über /style/rewrite, dann Übernahme
      const r1 = (await call('POST', '/style/rewrite', { text: b1.text, mode: 'present' })).json.text;
      expect(r1).toBe('Die Anmeldung wird geprüft.');
      expect((await call('POST', `/style/chapter-versions/${v.id}/apply`, { blocks: [{ id: b1.id, versionNo: b1.versionNo, text: r1 }] }, 'u-leser')).status).toBe(403);
      await call('PATCH', `/content-blocks/${b2.id}`, { text: 'Das Passwort ist leer.', expectedVersionNo: b2.versionNo }, 'u-redaktion');
      const res = (await call('POST', `/style/chapter-versions/${v.id}/apply`, {
        blocks: [{ id: b1.id, versionNo: b1.versionNo, text: r1 }, { id: b2.id, versionNo: b2.versionNo, text: 'Das Kennwort ist leer.' }, { id: 'cb_x', versionNo: 1, text: 'x' }, { id: b1.id, versionNo: b1.versionNo + 1, text: '' }],
      }, 'u-redaktion')).json;
      expect(res.saved).toEqual([b1.id]);
      expect(res.skipped.map((x: any) => x.reason)).toEqual([expect.stringContaining('zwischenzeitlich geändert'), 'nicht in dieser Version', 'Text fehlt oder ist zu lang']);
      const after = (await call('GET', `/chapter-versions/${v.id}`)).json.sections.flatMap((s: any) => s.blocks).find((b: any) => b.id === b1.id);
      expect(after.text).toBe('Die Anmeldung wird geprüft.');
      expect(await built.ctx.db.get("SELECT 1 FROM audit_events WHERE action = 'style.batch_applied'")).toBeTruthy();
      expect((await call('POST', `/style/chapter-versions/${v.id}/apply`, { blocks: [] }, 'u-redaktion')).status).toBe(400);

      // Suche: „anmeldung“ trifft Kapitel, Texte und den Quellpfad „anmeldung/hinweise.md“ – Kapitel stehen vorn, Pfadtreffer hinten
      const hits = (await call('GET', '/search?q=anmeldung&limit=50')).json.hits;
      const firstSource = hits.findIndex((h: any) => h.type === 'source');
      const lastChapter = hits.map((h: any) => h.type).lastIndexOf('chapter');
      expect(hits[0].type).toBe('chapter');
      expect(firstSource).toBeGreaterThan(lastChapter);
    } finally {
      await built.app.close();
    }
  });
});
