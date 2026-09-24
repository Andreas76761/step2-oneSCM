import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { parseOrigins } from '../src/config.js';
import { approveChapter, client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const fm = (roles: string, extra = '') => `---\nroles: [${roles}]\ndivisions: [all]\nevidence_status: source_confirmed\n${extra}---\n`;
const AUFTRAG = `${fm('all', 'help_context: [order.create, Order.Edit]\n')}# 3. Aufträge\n\n## 3.1 Zweck\n\nAufträge legen Sie im Menü Verkauf an.\n\n## 3.2 Schritte\n\n1. Menü Verkauf öffnen.\n2. Auftrag anlegen wählen.\n`;
const HAENDLER = `${fm('dealer')}# 3. Aufträge\n\n## 3.1 Zweck\n\nHändler sehen nur eigene Aufträge.\n`;

describe('Kontexthilfe für oneSCM (ADR-030)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string, extra: Record<string, unknown> = {}) =>
    freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', ...extra }));

  it('[T-162] Kontext-IDs: Validierung, Berechtigungen, Front-Matter-Zuordnung, Projekttrennung', async () => {
    const built = await build('contexts');
    const call = client(built);
    try {
      await importFile(built, '3-auftraege.md', AUFTRAG);
      const chapter = (await call('GET', '/chapters')).json.find((c: any) => c.title === '3. Aufträge');
      // Front-Matter: Zuordnung beim Import (klein geschrieben), Herkunft sichtbar
      let list = (await call('GET', '/help-contexts', undefined, 'u-leser')).json;
      expect(list).toMatchObject({ public: false, embedPath: '/help/embed/p_default' });
      expect(list.items.map((c: any) => [c.key, c.chapterId, c.origin])).toEqual([['order.create', chapter.id, 'front_matter'], ['order.edit', chapter.id, 'front_matter']]);
      expect(list.items[0].deepLink).toBe('/hilfe/order.create');

      expect((await call('POST', '/help-contexts', { key: 'x', chapterId: chapter.id }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/help-contexts', { key: 'Leer zeichen', chapterId: chapter.id }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/help-contexts', { key: 'order.list', chapterId: 'ch_fremd' }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/help-contexts', { key: 'order.list', chapterId: chapter.id, section: 'kapitel9' }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/help-contexts', { key: 'ORDER.CREATE', chapterId: chapter.id }, 'u-redaktion')).status).toBe(409);
      const steps = await call('POST', '/help-contexts', { key: 'order.steps', chapterId: chapter.id, section: 'steps', description: 'Maske Auftrag, Schritt-Hilfe' }, 'u-redaktion');
      expect(steps.status).toBe(201);
      expect(steps.json).toMatchObject({ key: 'order.steps', section: 'steps', origin: 'manual', chapterTitle: '3. Aufträge' });

      // manuelle Änderung bleibt bei erneutem Import erhalten
      expect((await call('PATCH', `/help-contexts/${list.items[1].id}`, { section: 'purpose' }, 'u-redaktion')).json).toMatchObject({ origin: 'manual', section: 'purpose' });
      await importFile(built, '3-auftraege.md', `${AUFTRAG}\nErgänzung für einen neuen Stand.\n`);
      list = (await call('GET', '/help-contexts')).json;
      expect(list.items.find((c: any) => c.key === 'order.edit')).toMatchObject({ origin: 'manual', section: 'purpose' });

      // Projekttrennung
      const other = (await call('POST', '/projects', { name: 'Anderes Projekt' })).json;
      expect((await call('PATCH', `/help-contexts/${steps.json.id}`, { description: 'x' }, 'u-admin', other.id)).status).toBe(404);
      expect((await call('GET', '/help-contexts', undefined, 'u-admin', other.id)).json.items).toEqual([]);
      expect((await call('GET', '/context-help/order.create', undefined, 'u-admin', other.id)).status).toBe(404);

      expect((await call('DELETE', `/help-contexts/${steps.json.id}`, undefined, 'u-leser')).status).toBe(403);
      expect((await call('DELETE', `/help-contexts/${steps.json.id}`, undefined, 'u-redaktion')).status).toBe(204);
      expect((await call('GET', '/help-contexts')).json.items).toHaveLength(2);
    } finally {
      await built.app.close();
    }
  });

  it('[T-163] Hilfe zu einer Kontext-ID: nur freigegebene Inhalte, Rolle, Abschnitt, Sprache mit Rückfall, API-Token', async () => {
    const built = await build('resolve');
    const call = client(built);
    try {
      await importFile(built, '3-auftraege.md', AUFTRAG);
      await importFile(built, '3-haendler.md', HAENDLER);
      const chapter = (await call('GET', '/chapters')).json.find((c: any) => c.title === '3. Aufträge');
      const notYet = await call('GET', '/context-help/order.create', undefined, 'u-leser');
      expect(notYet.status).toBe(404);
      expect(notYet.json.detail).toContain('noch nicht freigegeben');
      expect((await call('GET', '/context-help/gibt.es.nicht')).status).toBe(404);
      await approveChapter(call, chapter.id);

      const all = (await call('GET', '/context-help/order.create', undefined, 'u-leser')).json;
      expect(all).toMatchObject({ key: 'order.create', title: '3. Aufträge', versionNo: 1, source: 'approved', language: 'de', fallback: false, deepLink: '/hilfe/order.create', release: null });
      expect(all.versionIds).toBeUndefined();
      const texts = (h: any) => h.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text));
      expect(texts(all)).toEqual(expect.arrayContaining(['Aufträge legen Sie im Menü Verkauf an.', 'Händler sehen nur eigene Aufträge.']));
      expect(all.html).toContain('<h2>');
      expect(all.html).not.toMatch(/<script/i);
      // Rolle: Inhalte für Händler nur für Händler
      const hq = (await call('GET', '/context-help/order.create?role=hq')).json;
      expect(texts(hq)).not.toContain('Händler sehen nur eigene Aufträge.');
      expect(texts((await call('GET', '/context-help/order.create?role=dealer')).json)).toContain('Händler sehen nur eigene Aufträge.');
      expect((await call('GET', '/context-help/order.create?role=pilot')).status).toBe(400);
      expect((await call('GET', '/context-help/order.create?role=hq&language=en')).status).toBe(400); // keine Zielsprache

      // Abschnitt
      await call('POST', '/help-contexts', { key: 'order.steps', chapterId: chapter.id, section: 'steps' }, 'u-redaktion');
      const steps = (await call('GET', '/context-help/order.steps?role=hq')).json;
      expect(steps.sections.map((s: any) => s.code)).toEqual(['steps']);
      expect(steps.deepLink).toBe('/hilfe/order.steps?role=hq');

      // Sprache: ohne freigegebene Übersetzung deutscher Rückfall, danach Englisch
      await call('PATCH', '/projects/p_default', { languages: ['en'] });
      const fb = (await call('GET', '/context-help/order.create?language=en')).json;
      expect(fb).toMatchObject({ language: 'de', fallback: true, title: '3. Aufträge' });
      const tr = (await call('POST', '/translations', { chapterId: chapter.id, language: 'en' }, 'u-redaktion')).json;
      const d = (await call('GET', `/translations/${tr.id}`)).json;
      for (const b of d.sections.flatMap((s: any) => s.blocks)) {
        await call('PATCH', `/translation-blocks/${b.id}`, { text: b.sourceText.includes('Händler') ? 'Dealers only see their own orders.' : b.sourceText.startsWith('1.') ? '1. Open the sales menu.\n2. Choose create order.' : `EN ${b.sourceText}` }, 'u-redaktion');
      }
      await call('PATCH', `/translations/${tr.id}`, { title: '3. Orders' }, 'u-redaktion');
      expect((await call('POST', `/translations/${tr.id}/approve`, { comment: 'geprüft' }, 'u-freigabe')).status).toBe(200);
      const en = (await call('GET', '/context-help/order.create?language=en&role=dealer')).json;
      expect(en).toMatchObject({ language: 'en', fallback: false, title: '3. Orders', deepLink: '/hilfe/order.create?role=dealer&language=en' });
      expect(texts(en)).toContain('Dealers only see their own orders.');

      // API-Token (read) – Maschinenzugriff für oneSCM
      const token = (await call('POST', '/api-tokens', { name: 'oneSCM', scopes: ['read'] })).json.token;
      const viaToken = await built.app.inject({ method: 'GET', url: '/api/v1/context-help/order.create?role=hq', headers: { authorization: `Bearer ${token}` } });
      expect(viaToken.statusCode).toBe(200);
      expect(viaToken.json().title).toBe('3. Aufträge');
    } finally {
      await built.app.close();
    }
  });

  it('[T-164] Öffentliches Hilfe-Widget: Freischaltung, nur veröffentlichtes Release, CSP, Assistent, Skript', async () => {
    expect(parseOrigins('https://onescm.example.com, http://localhost:8080')).toEqual(['https://onescm.example.com', 'http://localhost:8080']);
    expect(() => parseOrigins('https://onescm.example.com/pfad')).toThrow(/HELP_EMBED_ORIGINS/);
    expect(() => parseOrigins('javascript:alert(1)')).toThrow(/HELP_EMBED_ORIGINS/);

    const built = await build('embed', { help: { embedOrigins: ['https://onescm.example.com'] }, notify: { appUrl: 'https://handbuch.example.com' } });
    const call = client(built);
    const embed = (url: string, init: { method?: 'GET' | 'POST'; payload?: string } = {}) =>
      built.app.inject({ method: init.method ?? 'GET', url, ...(init.payload ? { payload: init.payload, headers: { 'content-type': 'application/x-www-form-urlencoded' } } : {}) });
    try {
      await importFile(built, '3-auftraege.md', AUFTRAG);
      const chapter = (await call('GET', '/chapters')).json.find((c: any) => c.title === '3. Aufträge');
      await approveChapter(call, chapter.id);

      // nicht freigeschaltet: wie unbekannt
      expect((await embed('/help/embed/p_default/order.create')).statusCode).toBe(404);
      expect((await embed('/help/embed/p_gibtsnicht/order.create')).statusCode).toBe(404);
      expect((await call('PUT', '/help-settings', { public: true }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/help-settings', { public: true })).json.public).toBe(true);
      // freigeschaltet, aber noch kein Release → keine öffentliche Hilfe
      expect((await embed('/help/embed/p_default/order.create')).statusCode).toBe(404);

      await call('POST', '/releases', { version: '2026.4' }, 'u-freigabe');
      const page = await embed('/help/embed/p_default/order.create?role=hq');
      expect(page.statusCode).toBe(200);
      expect(page.headers['content-type']).toContain('text/html');
      const csp = String(page.headers['content-security-policy']);
      expect(csp).toContain('frame-ancestors https://onescm.example.com');
      expect(csp).toContain("default-src 'none'");
      expect(csp).not.toContain('script-src');
      expect(page.body).toContain('<h1>3. Aufträge</h1>');
      expect(page.body).toContain('Version 2026.4');
      expect(page.body).toContain('href="https://handbuch.example.com/hilfe/order.create?role=hq"');
      expect(page.body).not.toMatch(/<script/i);
      expect(page.body).toContain('<input type="hidden" name="role" value="hq">');

      // Neuer freigegebener Stand erscheint erst mit dem nächsten Release
      await importFile(built, '3-auftraege.md', AUFTRAG.replace('im Menü Verkauf an.', 'im Menü Verkauf oder per Schnellerfassung an.'));
      await approveChapter(call, chapter.id);
      expect((await call('GET', '/context-help/order.create')).json.html).toContain('Schnellerfassung');
      expect((await embed('/help/embed/p_default/order.create')).body).not.toContain('Schnellerfassung');

      // Assistent im Widget: nur Inhalte des Releases
      const answered = await embed('/help/embed/p_default/order.create', { method: 'POST', payload: 'question=Wo+lege+ich+Auftr%C3%A4ge+an%3F&role=hq' });
      expect(answered.statusCode).toBe(200);
      expect(answered.body).toContain('class="answer" role="status"');
      expect(answered.body).toContain('Menü Verkauf');
      expect(answered.body).not.toContain('Schnellerfassung');
      expect(answered.body).toContain('value="Wo lege ich Aufträge an?"');
      const log = await built.ctx.db.get("SELECT user_id, role_code FROM assistant_log WHERE user_id = 'help-widget'");
      expect(log).toMatchObject({ user_id: 'help-widget', role_code: 'hq' });
      const tooShort = await embed('/help/embed/p_default/order.create', { method: 'POST', payload: 'question=a' });
      expect(tooShort.statusCode).toBe(200);
      expect(tooShort.body).toContain('role="alert"');
      // unbekannte Kontext-ID und ungültige Rolle
      expect((await embed('/help/embed/p_default/gibt.es.nicht')).statusCode).toBe(404);
      expect((await embed('/help/embed/p_default/order.create?role=pilot')).statusCode).toBe(400);

      // Widget-Skript öffentlich, ausschalten sperrt die Einbettung wieder
      const js = await embed('/help/widget.js');
      expect(js.statusCode).toBe(200);
      expect(js.headers['content-type']).toContain('text/javascript');
      expect(js.body).toContain('window.OneScmHelp');
      expect(js.body).toContain('/help/embed/');
      await call('PUT', '/help-settings', { public: false });
      expect((await embed('/help/embed/p_default/order.create')).statusCode).toBe(404);
      // Medien-Auslieferung behält ihre eigene, strengere Richtlinie
      expect((await call('GET', '/health')).headers['content-security-policy']).toContain("frame-ancestors 'none'");
    } finally {
      await built.app.close();
    }
  });
});
