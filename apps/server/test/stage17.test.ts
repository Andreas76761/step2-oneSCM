import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { phrasesFromCsv } from '../src/services/style.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const fm = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';

describe('Etappe 17', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
  } as any));

  it('[T-183] Rollenvorlagen: mitgeliefert, eigene anlegen, Benutzer und Mitgliedschaften per Vorlage, Änderung wirkt auf Benutzer', async () => {
    const built = await build('roles');
    const call = client(built);
    try {
      expect((await call('GET', '/role-templates', undefined, 'u-redaktion')).status).toBe(403);
      const list = (await call('GET', '/role-templates')).json;
      expect(list.map((t: any) => t.name)).toEqual(expect.arrayContaining(['Lesen', 'Redaktion', 'Fachprüfung', 'Freigabe', 'Administration']));
      expect(list.find((t: any) => t.id === 'rt-redaktion')).toMatchObject({ builtin: true, permissions: ['read', 'edit'] });
      // eigene Vorlage
      expect((await call('POST', '/role-templates', { name: 'Redaktion', permissions: ['edit'] })).status).toBe(409);
      expect((await call('POST', '/role-templates', { name: 'X', permissions: ['root'] })).status).toBe(400);
      const lead = (await call('POST', '/role-templates', { name: 'Redaktionsleitung', description: 'Bearbeiten und Freigeben', permissions: ['edit', 'approve'] })).json;
      expect(lead).toMatchObject({ builtin: false, permissions: ['read', 'edit', 'approve'] });
      // Benutzer per Vorlage; einzelne Berechtigungen lösen die Verknüpfung
      const u = (await call('POST', '/users', { id: 'u-lena', name: 'Lena', roleTemplateId: lead.id })).json;
      expect(u).toMatchObject({ permissions: ['read', 'edit', 'approve'], roleTemplateId: lead.id });
      expect((await call('POST', '/users', { id: 'u-xy', name: 'X', roleTemplateId: 'rt-gibtsnicht' })).status).toBe(404);
      // Vorlage ändern → Benutzer folgt
      expect((await call('PATCH', `/role-templates/${lead.id}`, { permissions: ['edit', 'decide', 'approve'] })).json.users).toBe(1);
      expect((await call('GET', '/me', undefined, 'u-lena')).json.permissions).toEqual(['read', 'edit', 'decide', 'approve']);
      await call('PATCH', '/users/u-lena', { permissions: ['read'] });
      expect((await call('GET', '/users')).json.find((x: any) => x.id === 'u-lena').roleTemplateId).toBeNull();
      await call('PATCH', `/role-templates/${lead.id}`, { permissions: ['edit'] });
      expect((await call('GET', '/me', undefined, 'u-lena')).json.permissions).toEqual(['read']);
      await call('PATCH', '/users/u-lena', { roleTemplateId: 'rt-freigabe' });
      expect((await call('GET', '/me', undefined, 'u-lena')).json.permissions).toEqual(['read', 'decide', 'approve']);
      // Mitgliedschaft per Vorlage
      const p = (await call('POST', '/projects', { name: 'Geheim', visibility: 'restricted' })).json;
      await call('PUT', `/projects/${p.id}/members/u-lena`, { roleTemplateId: 'rt-redaktion' });
      expect((await call('GET', '/users/u-lena/projects')).json.find((x: any) => x.projectId === p.id).member).toEqual(['read', 'edit']);
      // letzten Administrator nicht über eine Vorlage herabstufen
      const adminTpl = (await call('POST', '/role-templates', { name: 'Chef', permissions: ['admin'] })).json;
      await call('PATCH', '/users/u-admin', { roleTemplateId: adminTpl.id });
      expect((await call('PATCH', `/role-templates/${adminTpl.id}`, { permissions: ['edit'] })).status).toBe(409);
      // Löschen: mitgelieferte nicht; eigene ja, Benutzer behalten Rechte
      expect((await call('DELETE', '/role-templates/rt-leser')).status).toBe(409);
      expect((await call('DELETE', `/role-templates/${lead.id}`)).status).toBe(204);
      expect(await built.ctx.db.get("SELECT 1 FROM audit_events WHERE action = 'role_template.updated'")).toBeTruthy();
    } finally {
      await built.app.close();
    }
  });

  it('[T-184] Stilregeln austauschen: CSV-Export/-Import (zusammenführen/ersetzen), JSON, Übernahme aus anderem Projekt', async () => {
    expect(phrasesFromCsv('Vermeiden;Aktion;Ersetzen durch;Hinweis\nzu diesem Zeitpunkt;ersetzen;jetzt;\nleider;streichen;;\nKunde;hinweis;;"Geschäftspartner; nicht Kunde"\n'))
      .toEqual([{ avoid: 'zu diesem Zeitpunkt', use: 'jetzt', note: null }, { avoid: 'leider', use: '', note: null }, { avoid: 'Kunde', use: null, note: 'Geschäftspartner; nicht Kunde' }]);
    const built = await build('rulesx');
    const call = client(built);
    try {
      await call('PUT', '/style/rules', { phrases: [{ avoid: 'leider', use: '' }, { avoid: 'Kunde', note: 'Geschäftspartner; nicht Kunde' }], address: 'du' });
      const csv = await call('GET', '/style/rules/export?format=csv', undefined, 'u-leser');
      expect(csv.headers['content-type']).toContain('text/csv');
      expect(csv.body).toContain('leider;streichen;;');
      expect(csv.body).toContain('Kunde;hinweis;;"Geschäftspartner; nicht Kunde"');
      const js = JSON.parse((await call('GET', '/style/rules/export?format=json')).body);
      expect(js).toMatchObject({ format: 'onescm-style-rules', address: 'du' });
      expect((await call('GET', '/style/rules/export?format=xml')).status).toBe(400);
      // Import: zusammenführen (aktualisiert „leider“, ergänzt neu), nur Administration
      const imp = { csv: 'vermeiden;aktion;ersetzen durch\nleider;ersetzen;bedauerlicherweise\nzu diesem Zeitpunkt;ersetzen;jetzt\n' };
      expect((await call('POST', '/style/rules/import', imp, 'u-redaktion')).status).toBe(403);
      const m = (await call('POST', '/style/rules/import', imp)).json;
      expect(m.summary).toEqual({ added: 1, updated: 1, total: 3, mode: 'merge' });
      expect(m.rules.phrases.find((p: any) => p.avoid === 'leider').use).toBe('bedauerlicherweise');
      expect((await call('POST', '/style/rules/import', { csv: 'foo;bar\n1;2\n' })).status).toBe(400);
      // ersetzen
      expect((await call('POST', '/style/rules/import', { csv: 'vermeiden\nquasi\n', mode: 'replace' })).json.rules.phrases).toEqual([{ avoid: 'quasi', use: null, note: null }]);
      // JSON-Import übernimmt auch Einstellungen
      expect((await call('POST', '/style/rules/import', { rules: js, mode: 'replace' })).json.rules).toMatchObject({ address: 'du', phrases: [{ avoid: 'leider' }, { avoid: 'Kunde' }] });
      // Übernahme aus einem anderen Projekt
      const p2 = (await call('POST', '/projects', { name: 'Zweites' })).json;
      const copied = (await call('POST', '/style/rules/copy', { fromProjectId: 'p_default', mode: 'replace' }, 'u-admin', p2.id)).json;
      expect(copied.rules).toMatchObject({ address: 'du', phrases: [{ avoid: 'leider' }, { avoid: 'Kunde' }] });
      expect((await call('POST', '/style/rules/copy', { fromProjectId: p2.id })).status).toBe(200);
      expect((await call('POST', '/style/rules/copy', { fromProjectId: 'p_gibtsnicht' })).status).toBe(404);
      expect((await call('POST', '/style/rules/copy', { fromProjectId: 'p_default' })).status).toBe(400);
      // ohne Zugriff auf das Quellprojekt: wie nicht vorhanden
      const secret = (await call('POST', '/projects', { name: 'Geheim', visibility: 'restricted' })).json;
      await call('POST', '/users', { id: 'u-pa', name: 'Projektadmin', permissions: ['read'] });
      await call('PUT', `/projects/${p2.id}/members/u-pa`, { permissions: ['read', 'edit', 'admin'] });
      expect((await call('POST', '/style/rules/copy', { fromProjectId: secret.id }, 'u-pa', p2.id)).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });

  it('[T-185] Stilwert-Verlauf: Messpunkte bei Änderung, Projektdurchschnitt je Tag, nach Stapelkorrektur fortgeschrieben', async () => {
    const built = await build('history');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${fm}# 1. Anmeldung\n\nDie Anmeldung wurde eigentlich geprüft.\n\nKlicken Sie auf **Anmelden**.\n`);
      await importFile(built, 'b.md', `${fm}# 2. Abmeldung\n\nKlicken Sie auf **Abmelden**.\n`);
      const chs = (await call('GET', '/chapters')).json;
      const c1 = chs.find((c: any) => c.title === '1. Anmeldung');
      const c2 = chs.find((c: any) => c.title === '2. Abmeldung');
      const v1 = (await call('POST', `/chapters/${c1.id}/generate`, {}, 'u-redaktion')).json;
      await call('POST', `/chapters/${c2.id}/generate`, {}, 'u-redaktion');
      await call('GET', '/style/chapters');
      await call('GET', '/style/chapters'); // unverändert → kein weiterer Messpunkt
      let h = (await call('GET', `/style/history?chapterId=${c1.id}`, undefined, 'u-leser')).json;
      expect(h.points).toHaveLength(1);
      const before = h.points[0].score;
      expect(before).toBeLessThan(100);
      // Stapelkorrektur schreibt einen neuen Messpunkt
      const pv = (await call('POST', `/style/chapter-versions/${v1.id}/autofix`, {})).json;
      await call('POST', `/style/chapter-versions/${v1.id}/autofix`, { apply: true, blocks: pv.blocks.map((b: any) => ({ id: b.id, versionNo: b.versionNo })) }, 'u-redaktion');
      h = (await call('GET', `/style/history?chapterId=${c1.id}`)).json;
      expect(h.points).toHaveLength(2);
      expect(h.points[1].score).toBeGreaterThan(before);
      const all = (await call('GET', '/style/history?days=30')).json;
      expect(all.chapters.find((c: any) => c.chapterId === c1.id)).toMatchObject({ title: '1. Anmeldung', change: h.points[1].score - before });
      expect(all.project.at(-1).average).toBeGreaterThan(0);
      expect(all.project.at(-1).day).toBe(new Date().toISOString().slice(0, 10));
      expect((await call('GET', '/style/history?chapterId=ch_fremd')).status).toBeGreaterThanOrEqual(400);
    } finally {
      await built.app.close();
    }
  });
});
