import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { LABEL_CATALOG } from '../src/domain/metadataLabels.js';
import { detectPrivacy, pseudonymize } from '../src/domain/privacy.js';
import { seedMetadataLabels } from '../src/services/metadata.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 28', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));

  it('[T-212] Labelkatalog nach echtem oneSCM: Gesamtgliederung, Menü der Oberfläche, Rollen (MO = Market Operation), nur Pkw und Van; ältere Katalog-Labels werden ausgeblendet, Zuordnungen und Anpassungen bleiben', async () => {
    const built = await build('katalog');
    const call = client(built);
    try {
      const count = (g: string) => LABEL_CATALOG.filter((l) => l.group === g).length;
      expect(['outline', 'role', 'navigation', 'domain', 'customer', 'system', 'content', 'division', 'quality'].map(count)).toEqual([33, 11, 34, 9, 5, 19, 22, 3, 17]);
      const labels = (await call('GET', '/metadata/labels')).json;
      expect(labels).toHaveLength(LABEL_CATALOG.length);
      const by = (code: string) => labels.find((l: any) => l.code === code);
      expect(labels[0]).toMatchObject({ code: 'outline.vorspann', position: 1 });
      expect(by('outline.kap09')).toMatchObject({ nameDe: '09 MO Checks und fachliche Prüfungen', nameEn: '09 MO checks and business reviews' });
      expect(by('outline.anhang-i').position).toBe(33);
      expect(by('nav.generation.mo-checks')).toMatchObject({ nameDe: 'Vertragserstellung › MO Checks', nameEn: 'Contract Generation › MO Checks' });
      expect(by('nav.mainpage').description).toContain('Acess Mainpage');
      expect(by('role.mo').nameDe).toBe('MO (Market Operation)');
      expect(labels.filter((l: any) => l.group === 'division').map((l: any) => l.nameDe)).toEqual(['Pkw', 'Van', 'Pkw und Van']);

      // Stand von Etappe 27 nachstellen: alte Katalog-Labels, eines mit Zuordnung, eines von der Administration geändert
      const db = built.ctx.db;
      const alt = async (code: string, group: string, nameDe: string, updatedBy = 'system') => {
        const id = `lbl_alt_${code.replace(/\W/g, '_')}`;
        await db.run(`INSERT INTO metadata_labels (id, project_id, code, label_group, name_de, name_en, description, position, origin, archived_at, updated_by, updated_at)
          VALUES (?, 'p_default', ?, ?, ?, ?, NULL, 99, 'catalog', NULL, ?, ?)`, id, code, group, nameDe, nameDe, updatedBy, new Date().toISOString());
        return id;
      };
      const truck = await alt('division.truck', 'division', 'Truck');
      const keyUser = await alt('role.key-user', 'role', 'Key User', 'u-admin');
      await db.run("UPDATE metadata_labels SET name_de = 'Markt', updated_by = 'system' WHERE project_id = 'p_default' AND code = 'role.market'");
      await db.run("UPDATE metadata_labels SET name_de = 'Händler', updated_by = 'u-admin' WHERE project_id = 'p_default' AND code = 'role.dealer'");
      await importFile(built, 'vertrag.md', `${FM}# Vertrag\n\n## Anlegen\n\nDer Truck-Vertrag wird angelegt.\n`);
      const chunk = (await call('GET', '/metadata/chunks')).json.items[0];
      expect((await call('POST', '/metadata/chunks/labels', { snippetIds: [chunk.id], add: [truck] }, 'u-redaktion')).json.added).toBe(1);

      await seedMetadataLabels(db, 'p_default');
      const nach = (await call('GET', '/metadata/labels?includeArchived=true')).json;
      const n = (code: string) => nach.find((l: any) => l.code === code);
      expect(n('division.truck')).toMatchObject({ archived: true, chunkCount: 1 });
      expect(n('role.key-user').archived).toBe(false); // von der Administration bearbeitet → bleibt
      expect(n('role.market').nameDe).toBe('Markt (MPC)'); // unbearbeitet → folgt dem Katalog
      expect(n('role.dealer').nameDe).toBe('Händler'); // bearbeitet → bleibt
      expect((await call('GET', '/metadata/chunks')).json.items[0].labels.map((l: any) => [l.code, l.archived])).toEqual([['division.truck', true]]);
      // ein zweiter Abgleich ändert nichts mehr
      const stand = JSON.stringify(nach.map((l: any) => [l.code, l.nameDe, l.archived, l.position]));
      await seedMetadataLabels(db, 'p_default');
      expect(JSON.stringify((await call('GET', '/metadata/labels?includeArchived=true')).json.map((l: any) => [l.code, l.nameDe, l.archived, l.position]))).toBe(stand);
    } finally {
      await built.app.close();
    }
  });

  it('[T-213] Datenschutz: FIN, Kennzeichen, Benutzerkennung, Adresse, Namen aus Metadaten und Namensliste; Pseudonymisierung; Prüf-Endpunkt; Namensliste wirkt in der Analyse', async () => {
    const text = 'Assignee: Max Mustermann, FIN WDD2130421A123456, Kennzeichen S-AB 1234, User-ID: D7ABCDE, Hauptstraße 12, 70372 Stuttgart';
    expect(detectPrivacy(text).map((h) => h.kind)).toEqual(['vin', 'plate', 'user_id', 'address', 'name']);
    expect(detectPrivacy(text).every((h) => !text.includes(h.match) || h.match.includes('…'))).toBe(true);
    // keine Fehlalarme bei typischen Fachangaben
    expect(detectPrivacy('Release-Letter RL-ONESCM-20240101-RC01, PI 14, ONESCM-10263, MO Checks, CM-04.01-2024-003, Kapitel 6.2, Autor: oneSCM Team')).toEqual([]);
    // bisherige Arten bleiben erhalten; FIN gilt nicht mehr als IBAN
    expect(detectPrivacy('IBAN DE89 3704 0044 0532 0130 00').map((h) => h.kind)).toEqual(['iban']);
    expect(detectPrivacy('WDB9634031L123456').map((h) => h.kind)).toEqual(['vin']);
    expect(detectPrivacy('Rückruf bei Frau Kowalski', { names: ['Kowalski'] }).map((h) => h.kind)).toEqual(['name']);
    const p = pseudonymize('Bearbeiter: Anna Berg. Bearbeiter: Anna Berg. Erstellt von Jan Roth, anna.berg@firma.de', {});
    expect(p.text).toBe('Bearbeiter: [Person 1]. Bearbeiter: [Person 1]. Erstellt von [Person 2], [E-Mail 1]');
    expect(p.kinds).toEqual([{ kind: 'name', distinct: 2 }, { kind: 'email', distinct: 1 }]);

    const built = await build('datenschutz');
    const call = client(built);
    try {
      expect((await call('POST', '/privacy/check', { text: '' }, 'u-leser')).status).toBe(400);
      const r = (await call('POST', '/privacy/check', { text, pseudonymize: true }, 'u-leser')).json;
      expect(r.hits).toHaveLength(5);
      expect(r.pseudonymized.text).toContain('[FIN 1]');
      expect(JSON.stringify(r)).not.toContain('WDD2130421A123456');
      // Namensliste: nur Administration, Validierung, wirkt in Prüfung und Analyse
      expect((await call('PUT', '/settings', { privacy: { names: ['Kowalski'] } }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/settings', { privacy: { names: [''] } })).status).toBe(400);
      await importFile(built, 'rueckruf.md', `${FM}# Support\n\n## Rückruf\n\nRückruf bei Frau Kowalski wegen des Antrags.\n`);
      const findings = async () => (await call('GET', '/quality/findings?status=open,deferred&type=privacy')).json as any[];
      await call('POST', '/quality/analysis');
      await built.ctx.jobs.idle();
      expect(await findings()).toEqual([]);
      expect((await call('PUT', '/settings', { privacy: { names: [' Kowalski ', 'Kowalski'] } })).json.privacy.names).toEqual(['Kowalski']);
      expect((await call('POST', '/privacy/check', { text: 'Frau Kowalski' })).json.hits).toEqual([{ kind: 'name', match: 'Ko…ki' }]);
      await call('POST', '/quality/analysis');
      await built.ctx.jobs.idle();
      expect((await findings()).map((f) => [f.subtype, f.severity])).toEqual([['name', 'blocker']]);
    } finally {
      await built.app.close();
    }
  });
});
