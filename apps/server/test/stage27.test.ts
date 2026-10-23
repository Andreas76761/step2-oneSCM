import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { LABEL_CATALOG } from '../src/domain/metadataLabels.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 27 (oneSCM_Metadaten M1)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));
  const SOURCE = `${FM}# Vertragsbearbeitung\n\n## Vertrag anlegen\n\nÖffnen Sie Verträge › Neuer Vertrag und erfassen Sie den Kunden.\n\n## Fehlerbehebung\n\nBei 100%_Auslastung wenden Sie sich an den Support.\n`;

  it('[T-209] Label-Katalog: 100 vordefinierte Labels in sechs Gruppen (Deutsch, Englisch), auch in neuen Projekten; Pflege nur durch die Administration', async () => {
    const built = await build('labels');
    const call = client(built);
    try {
      expect(LABEL_CATALOG).toHaveLength(100);
      expect(new Set(LABEL_CATALOG.map((l) => l.code)).size).toBe(100);
      const labels = (await call('GET', '/metadata/labels', undefined, 'u-leser')).json;
      expect(labels).toHaveLength(100);
      const count = (g: string) => labels.filter((l: any) => l.group === g).length;
      expect([count('outline'), count('role'), count('navigation'), count('content'), count('division'), count('quality')]).toEqual([30, 10, 25, 15, 5, 15]);
      expect(labels[0]).toMatchObject({ code: 'outline.01-introduction', nameDe: '01 Einleitung', nameEn: '01 Introduction', origin: 'catalog', archived: false, chunkCount: 0 });
      expect((await call('GET', '/metadata/labels?group=role')).json.map((l: any) => l.code).slice(0, 4)).toEqual(['role.dealer', 'role.market', 'role.mo', 'role.hq']);
      expect((await call('GET', '/metadata/labels?group=xx')).status).toBe(400);
      expect((await call('GET', '/metadata/label-groups')).json.map((g: any) => g.code)).toEqual(['outline', 'role', 'navigation', 'content', 'division', 'quality']);

      // Pflege nur mit admin
      const nav = labels.find((l: any) => l.code === 'nav.contracts.new');
      expect((await call('PATCH', `/metadata/labels/${nav.id}`, { nameDe: 'Verträge › Anlegen' }, 'u-redaktion')).status).toBe(403);
      expect((await call('PATCH', `/metadata/labels/${nav.id}`, { nameDe: 'Verträge › Anlegen', nameEn: 'Contracts › Create' })).json).toMatchObject({ code: 'nav.contracts.new', nameDe: 'Verträge › Anlegen', nameEn: 'Contracts › Create' });
      expect((await call('PATCH', `/metadata/labels/${nav.id}`, { nameDe: ' ' })).status).toBe(400);
      expect((await call('POST', '/metadata/labels', { code: 'nav.orders', group: 'navigation', nameDe: 'Aufträge', nameEn: 'Orders' }, 'u-redaktion')).status).toBe(403);
      const own = await call('POST', '/metadata/labels', { code: 'nav.orders', group: 'navigation', nameDe: 'Aufträge', nameEn: 'Orders' });
      expect(own.status).toBe(201);
      expect(own.json).toMatchObject({ origin: 'custom', position: 26 });
      expect((await call('POST', '/metadata/labels', { code: 'nav.orders', group: 'navigation', nameDe: 'x', nameEn: 'x' })).status).toBe(409);
      expect((await call('POST', '/metadata/labels', { code: 'Nav Orders', group: 'navigation', nameDe: 'x', nameEn: 'x' })).status).toBe(400);
      expect((await call('POST', '/metadata/labels', { code: 'x.y', group: 'xx', nameDe: 'x', nameEn: 'x' })).status).toBe(400);
      // ausblenden: nicht mehr in der Standardliste
      await call('PATCH', `/metadata/labels/${own.json.id}`, { archived: true });
      expect((await call('GET', '/metadata/labels')).json).toHaveLength(100);
      expect((await call('GET', '/metadata/labels?includeArchived=true')).json).toHaveLength(101);

      // neues Projekt erhält den vollständigen Katalog, Namen dort unverändert; Labels anderer Projekte sind unsichtbar
      const p = (await call('POST', '/projects', { name: 'Metadaten', visibility: 'open' })).json;
      const other = (await call('GET', '/metadata/labels', undefined, 'u-admin', p.id)).json;
      expect(other).toHaveLength(100);
      expect(other.find((l: any) => l.code === 'nav.contracts.new').nameDe).toBe('Verträge › Neuer Vertrag');
      expect((await call('PATCH', `/metadata/labels/${nav.id}`, { nameDe: 'x' }, 'u-admin', p.id)).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });

  it('[T-210] Chunks je Überschrift mit Fundstelle anzeigen, filtern und labeln (einzeln und gesammelt), Übersicht je Format', async () => {
    const built = await build('chunks');
    const call = client(built);
    try {
      await importFile(built, 'vertrag.md', SOURCE);
      const all = (await call('GET', '/metadata/chunks', undefined, 'u-leser')).json;
      expect(all.total).toBe(2);
      expect(all.items[0]).toMatchObject({ path: 'vertrag.md', format: 'markdown', chapter: 'Vertragsbearbeitung', subchapter: 'Vertrag anlegen', locator: null, labels: [] });
      expect(all.items[0].lineStart).toBeGreaterThan(0);
      // Suche: % und _ wörtlich
      expect((await call('GET', `/metadata/chunks?q=${encodeURIComponent('100%_')}`)).json.total).toBe(1);
      expect((await call('GET', `/metadata/chunks?q=${encodeURIComponent('%')}`)).json.total).toBe(1);
      expect((await call('GET', '/metadata/chunks?format=docx')).json.total).toBe(0);
      expect((await call('GET', '/metadata/chunks?format=markdown')).json.total).toBe(2);
      expect((await call('GET', '/metadata/chunks?format=xls')).status).toBe(400);
      expect((await call('GET', '/metadata/chunks?limit=1&offset=1')).json.items.map((c: any) => c.id)).toEqual([all.items[1].id]);

      const labels = (await call('GET', '/metadata/labels')).json;
      const id = (code: string) => labels.find((l: any) => l.code === code).id;
      const [a, b] = all.items.map((c: any) => c.id);
      // labeln nur mit edit
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: [a], add: [id('role.dealer')] }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: [a, b], add: [id('role.dealer'), id('outline.10-contracts')] }, 'u-redaktion')).json).toEqual({ chunks: 2, added: 4, removed: 0 });
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: [a], add: [id('nav.contracts.new')], remove: [id('outline.10-contracts')] }, 'u-redaktion')).json).toEqual({ chunks: 1, added: 1, removed: 1 });
      // doppelt hinzufügen zählt nicht
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: [a], add: [id('role.dealer')] }, 'u-redaktion')).json.added).toBe(0);
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: [a], add: [id('role.mo')], remove: [id('role.mo')] }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: [a] }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: ['snp_x'], add: [id('role.mo')] }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: [a], add: ['lbl_x'] }, 'u-redaktion')).status).toBe(400);

      const first = (await call('GET', `/metadata/chunks?labels=${id('role.dealer')},${id('nav.contracts.new')}`)).json;
      expect(first.items.map((c: any) => c.id)).toEqual([a]);
      expect(first.items[0].labels.map((l: any) => l.code)).toEqual(['nav.contracts.new', 'role.dealer']);
      expect((await call('GET', `/metadata/chunks?labels=${id('role.dealer')}`)).json.total).toBe(2);
      expect((await call('GET', '/metadata/chunks?unlabeled=true')).json.total).toBe(0);
      expect((await call('GET', '/metadata/labels?group=role')).json.find((l: any) => l.code === 'role.dealer').chunkCount).toBe(2);

      // ausgeblendete Labels: nicht mehr zuweisbar, entfernen bleibt möglich
      await call('PATCH', `/metadata/labels/${id('role.dealer')}`, { archived: true });
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: [a], add: [id('role.dealer')] }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: [b], remove: [id('role.dealer')] }, 'u-redaktion')).json.removed).toBe(1);

      const ov = (await call('GET', '/metadata/overview')).json;
      expect(ov).toMatchObject({ documents: 1, chunks: 2, labeledChunks: 2, savedAnswers: 0, formats: [{ format: 'markdown', documents: 1, chunks: 2 }] });
      expect(ov.labelGroups.find((g: any) => g.code === 'role').labels).toBe(9);

      // Chunks anderer Projekte bleiben verborgen
      const p = (await call('POST', '/projects', { name: 'Fremd', visibility: 'open' })).json;
      expect((await call('GET', '/metadata/chunks', undefined, 'u-admin', p.id)).json.total).toBe(0);
      const foreign = (await call('GET', '/metadata/labels', undefined, 'u-admin', p.id)).json[0].id;
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: [a], add: [foreign] }, 'u-admin', p.id)).status).toBe(400);
    } finally {
      await built.app.close();
    }
  });

  it('[T-211] Fragen und Antworten mit Quellen (Datei, Überschrift, Auszug) und Labels speichern, filtern, ändern, löschen', async () => {
    const built = await build('qa');
    const call = client(built);
    try {
      await importFile(built, 'vertrag.md', SOURCE);
      const chunk = (await call('GET', '/metadata/chunks')).json.items[0];
      const labels = (await call('GET', '/metadata/labels')).json;
      const id = (code: string) => labels.find((l: any) => l.code === code).id;
      const input = { question: 'Wie lege ich einen Vertrag an?', answer: 'Über Verträge › Neuer Vertrag [1].', language: 'de', snippetIds: [chunk.id], labelIds: [id('outline.11-contract-create'), id('content.instruction')] };
      expect((await call('POST', '/metadata/qa', input, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/metadata/qa', { ...input, language: 'fr' }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/metadata/qa', { ...input, question: '' }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/metadata/qa', { ...input, snippetIds: ['snp_x'] }, 'u-redaktion')).status).toBe(400);
      const qa = await call('POST', '/metadata/qa', input, 'u-redaktion');
      expect(qa.status).toBe(201);
      expect(qa.json).toMatchObject({ question: input.question, language: 'de', createdBy: 'u-redaktion' });
      expect(qa.json.sources).toEqual([expect.objectContaining({ snippetId: chunk.id, path: 'vertrag.md', headingPath: chunk.headingPath, excerpt: chunk.text })]);
      expect(qa.json.labels.map((l: any) => l.code)).toEqual(['content.instruction', 'outline.11-contract-create']);
      const en = (await call('POST', '/metadata/qa', { question: 'Who do I contact?', answer: 'Support.', language: 'en', labelIds: [id('role.support')] }, 'u-redaktion')).json;

      expect((await call('GET', '/metadata/qa', undefined, 'u-leser')).json).toHaveLength(2);
      expect((await call('GET', `/metadata/qa?labels=${id('content.instruction')}`)).json.map((x: any) => x.id)).toEqual([qa.json.id]);
      expect((await call('GET', '/metadata/qa?language=en')).json.map((x: any) => x.id)).toEqual([en.id]);
      expect((await call('GET', '/metadata/qa?q=vertrag')).json.map((x: any) => x.id)).toEqual([qa.json.id]);
      expect((await call('GET', '/metadata/labels?group=content')).json.find((l: any) => l.code === 'content.instruction').qaCount).toBe(1);

      // ändern: Labels ersetzen, ausgeblendete bleiben erhalten, aber nicht neu zuweisbar
      await call('PATCH', `/metadata/labels/${id('content.instruction')}`, { archived: true });
      const upd = await call('PATCH', `/metadata/qa/${qa.json.id}`, { labelIds: [id('content.instruction'), id('role.dealer')], note: 'geprüft' }, 'u-redaktion');
      expect(upd.json.labels.map((l: any) => l.code)).toEqual(['content.instruction', 'role.dealer']);
      expect(upd.json.note).toBe('geprüft');
      expect((await call('PATCH', `/metadata/qa/${en.id}`, { labelIds: [id('content.instruction')] }, 'u-redaktion')).status).toBe(400);
      expect((await call('GET', `/metadata/qa/${qa.json.id}`)).json.sources).toHaveLength(1);
      expect((await call('PATCH', `/metadata/qa/${qa.json.id}`, { snippetIds: [] }, 'u-redaktion')).json.sources).toEqual([]);

      // fremdes Projekt: nicht sichtbar
      const p = (await call('POST', '/projects', { name: 'Fremd', visibility: 'open' })).json;
      expect((await call('GET', `/metadata/qa/${qa.json.id}`, undefined, 'u-admin', p.id)).status).toBe(404);
      expect((await call('DELETE', `/metadata/qa/${qa.json.id}`, undefined, 'u-admin', p.id)).status).toBe(404);

      expect((await call('DELETE', `/metadata/qa/${qa.json.id}`, undefined, 'u-leser')).status).toBe(403);
      expect((await call('DELETE', `/metadata/qa/${qa.json.id}`, undefined, 'u-redaktion')).status).toBe(204);
      expect((await call('GET', `/metadata/qa/${qa.json.id}`)).status).toBe(404);
      const events = (await call('GET', '/audit-events?limit=500')).json;
      const actions = (events.items ?? events).map((e: any) => e.action);
      expect(actions).toEqual(expect.arrayContaining(['metadata.qa.created', 'metadata.qa.updated', 'metadata.qa.deleted', 'metadata.label.updated']));
    } finally {
      await built.app.close();
    }
  });
});
