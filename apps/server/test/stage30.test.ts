import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { chapterFolder, ordnername } from '../src/services/domainMap.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 30', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));

  it('[T-240] Zuordnung Domäne → Gliederungspunkt → Ordner: Katalogvorschlag, Contract Management 3.1–3.5 als Menüpunkte, Unterordner aus einer App-Gliederung, Vorschläge aus Chunks, Pflege mit Bearbeitungsrecht, CSV', async () => {
    // Ordnernamen wie handbuch_struktur.py
    expect(ordnername('MO Checks und fachliche Prüfungen')).toBe('MO_Checks_und_fachliche_Prüfungen');
    expect(ordnername('Reifenprodukte – Tyres, Teil 1: Übersicht [Entwurf]')).toBe('Reifenprodukte_-_Tyres_Teil_1_Übersicht');
    expect(chapterFolder('outline.kap09', '09 MO Checks und fachliche Prüfungen')).toEqual({ number: 9, folder: '02_Kapitel/09_MO_Checks_und_fachliche_Prüfungen' });
    expect(chapterFolder('outline.anhang-d', 'D Rollen-, Status- und Scopematrizen').folder).toBe('02_Kapitel/Anhang_D_Rollen-_Status-_und_Scopematrizen');

    const built = await build('zuordnung');
    const call = client(built);
    try {
      const m = (await call('GET', '/metadata/domain-map', undefined, 'u-leser')).json;
      expect(m.domains.map((d: any) => d.code)).toHaveLength(9);
      const cm = m.domains.find((d: any) => d.code === 'domain.contract-management');
      expect(cm.outline.map((o: any) => [o.code, o.folder, o.origin])).toEqual([
        ['outline.kap10', '02_Kapitel/10_Verträge_im_Alltag_verwalten', 'catalog'],
        ['outline.kap12', '02_Kapitel/12_Geschäftskunden_Kampagnen_und_Sonderfälle', 'catalog'],
      ]);
      expect(cm.navigation.map((n: any) => n.nameDe)).toEqual([
        'Vertragsverwaltung', 'Vertragsverwaltung › Vertrag suchen und ändern', 'Vertragsverwaltung › Vertrag aussetzen und reaktivieren',
        'Vertragsverwaltung › Vertrag beenden, stornieren und kündigen', 'Vertragsverwaltung › Verlängerung, Folgevertrag und Neuvertrag', 'Vertragsverwaltung › Dokumente und Kommunikation',
      ]);
      expect(cm.outline[0].subfolders).toBeNull();
      expect(m.withoutDomain.length).toBeGreaterThan(0);
      expect(m.outline.find((o: any) => o.id === m.withoutDomain[0]).code).toBe('outline.vorspann');
      expect(m.controlFolders.map((f: any) => f.folder)).toEqual(['05_I_Output', '06_II_Stil_und_Design', '07_III_Grammatik_Synonyme_Fehlerliste', '08_IV_Translation']);
      expect(m.summary).toMatchObject({ domains: 9, suggestions: 0 });
      const linksBefore = m.summary.links;

      // Unterordner aus einer App-Gliederung, deren Kapitel die Titel der Gesamtgliederung tragen
      const outline = (await call('POST', '/outlines', { name: 'Gesamtgliederung', nodes: [
        { title: '10 Verträge im Alltag verwalten', children: [{ title: 'Vertrag suchen und ändern' }, { title: 'Vertrag aussetzen und reaktivieren' }] },
        { title: 'Kapitel ohne Gegenstück', children: [{ title: 'X' }] },
      ] }, 'u-redaktion')).json;
      const m2 = (await call('GET', `/metadata/domain-map?outlineId=${outline.id}`)).json;
      expect(m2.subfolderSource).toMatchObject({ name: 'Gesamtgliederung', matched: 1, chapters: 2 });
      const kap10 = m2.domains.find((d: any) => d.code === 'domain.contract-management').outline[0];
      expect(kap10.subfolders.map((s: any) => s.folder)).toEqual([
        '02_Kapitel/10_Verträge_im_Alltag_verwalten/10.1_Vertrag_suchen_und_ändern',
        '02_Kapitel/10_Verträge_im_Alltag_verwalten/10.2_Vertrag_aussetzen_und_reaktivieren',
      ]);
      expect((await call('GET', '/metadata/domain-map?outlineId=on_gibtesnicht')).status).toBe(404);

      // Vorschlag aus Chunks: Abschnitt mit Domäne „Vehicle Management“ und Kapitel 13
      await importFile(built, 'reifen.md', `${FM}# Reifen\n\n## Reifenpaket\n\nReifenpakete werden je Fahrzeuggruppe angeboten.\n`);
      const chunk = (await call('GET', '/metadata/chunks?q=Reifenpakete')).json.items[0];
      const label = (code: string) => m.outline.concat(m.navigation).find((l: any) => l.code === code)?.id ?? m.domains.find((d: any) => d.code === code)?.id;
      const vehicle = label('domain.vehicle');
      await call('POST', '/metadata/chunks/labels', { snippetIds: [chunk.id], add: [vehicle, label('outline.kap13')] }, 'u-redaktion');
      const m3 = (await call('GET', '/metadata/domain-map')).json;
      const sug = m3.domains.find((d: any) => d.id === vehicle).outline.find((o: any) => o.code === 'outline.kap13');
      expect(sug).toMatchObject({ linked: false, suggested: true, chunks: 1 });
      expect(m3.summary.suggestions).toBe(1);

      // Pflege: nur mit Bearbeitungsrecht; übernehmen, lösen; gelöste Katalogvorschläge kommen beim Neustart nicht wieder
      const body = { domainId: vehicle, targetId: label('outline.kap13'), linked: true };
      expect((await call('PUT', '/metadata/domain-map/links', body, 'u-leser')).status).toBe(403);
      expect((await call('PUT', '/metadata/domain-map/links', { ...body, targetId: vehicle }, 'u-redaktion')).status).toBe(400);
      expect((await call('PUT', '/metadata/domain-map/links', { ...body, linked: 'ja' }, 'u-redaktion')).status).toBe(400);
      expect((await call('PUT', '/metadata/domain-map/links', body, 'u-redaktion')).status).toBe(200);
      expect((await call('PUT', '/metadata/domain-map/links', { domainId: cm.id, targetId: cm.outline[1].id, linked: false }, 'u-redaktion')).status).toBe(200);
      const m4 = (await call('GET', '/metadata/domain-map')).json;
      const cm4 = m4.domains.find((d: any) => d.id === cm.id);
      expect(cm4.outline.map((o: any) => o.code)).toEqual(['outline.kap10']);
      expect(m4.domains.find((d: any) => d.id === vehicle).outline.find((o: any) => o.code === 'outline.kap13')).toMatchObject({ linked: true, origin: 'manual', chunks: 1 });
      expect(m4.summary.links).toBe(linksBefore);
      const { seedDomainLinks } = await import('../src/services/domainMap.js');
      await seedDomainLinks(built.ctx.db, 'p_default');
      expect((await call('GET', '/metadata/domain-map')).json.domains.find((d: any) => d.id === cm.id).outline).toHaveLength(1);
      const auditRows = await built.ctx.db.all("SELECT action FROM audit_events WHERE action = 'domain_map.updated'");
      expect(auditRows).toHaveLength(2);

      const csv = await call('GET', '/metadata/domain-map/export', undefined, 'u-leser');
      expect(csv.headers['content-type']).toContain('text/csv');
      expect(csv.body).toContain('Domäne;Gliederungspunkt;Ordner;Unterordner;Menüpunkte;Herkunft;Chunks');
      expect(csv.body).toContain('Vehicle Management;13 Reifenprodukte – Tyres;02_Kapitel/13_Reifenprodukte_-_Tyres;;Product Management › Manage Vehicle Groups, Product Management › Vega Codes, Admin Section › Vehicle Management;manuell;1');
    } finally {
      await built.app.close();
    }
  });
});
