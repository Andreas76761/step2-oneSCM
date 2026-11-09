// Etappe 111: Schreibweisen S-04 (Kulanzfrist, Fahrgestellnummer, FI-Beleg, Belegart, Systemnamen) – ADR-128
import fs from 'node:fs';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { LABEL_CATALOG } from '../src/domain/metadataLabels.js';
import { client, FM, importFile, uploadFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 111', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' }));

  it('[T-452] Schreibweisen aus S-04: Vorlage übernehmen, Systemname in genauer Schreibweise, „Grace Period“ nur im Menüpfad, Analyse meldet „NEMESIS“, nicht „Nemesis“', async () => {
    const built = await build('s04');
    const call = client(built);
    try {
      // Vorlage des Arbeitsordners einlesen
      const csv = fs.readFileSync(path.resolve(__dirname, '../../../tools/handbuch-ordner/vorlagen/SYNONYME.csv'));
      const applied = await uploadFile(built, '/master-data/import?kind=glossary&apply=true', 'SYNONYME.csv', csv, 'u-redaktion');
      expect(applied.json.summary).toMatchObject({ error: 0, skipped: 0 });
      const terms = (await call('GET', '/terminology')).json as any[];
      const term = (p: string) => terms.find((t) => t.preferred === p);
      expect(term('Kulanzfrist')).toMatchObject({ avoid: ['Grace Period', 'Karenzzeit'], uiAllowed: true });
      expect(term('Fahrgestellnummer')).toMatchObject({ avoid: ['Chassis Number'], uiAllowed: true });
      expect(term('Nemesis')).toMatchObject({ avoid: ['NEMESIS'] });
      for (const p of ['Status FI-Beleg', 'Belegart', 'VeDoc', 'CoFiCo', 'oneERP']) expect(term(p), p).toBeTruthy();

      // Stilprüfung: Systemname nur in falscher Schreibweise ein Fund; UI-Begriff im Menüpfad erlaubt
      const findings = async (text: string) => ((await call('POST', '/style/check', { text })).json.sentences as any[])
        .flatMap((s) => s.issues).filter((i) => i.rule === 'terminology').map((i) => text.slice(i.start, i.end));
      expect(await findings('Nemesis liefert die Daten. NEMESIS meldet einen Fehler.')).toEqual(['NEMESIS']);
      expect(await findings('Die Grace Period beträgt 30 Tage. Öffnen Sie **Produktmanagement › Grace Period**.')).toEqual(['Grace Period']);
      expect(await findings('Geben Sie die Chassis Number ein. Die Karenzzeit endet heute.')).toEqual(['Chassis Number', 'Karenzzeit']);
      expect(await findings('Prüfen Sie den Status FI-Beleg, die Belegart und die Fahrgestellnummer in VeDoc.')).toEqual([]);

      // genau gleiche Schreibweise bleibt unzulässig, Varianten in Groß-/Kleinschreibung sind erlaubt
      expect((await call('POST', '/terminology', { preferred: 'MPay', avoid: ['MPay'] }, 'u-redaktion')).status).toBe(422);
      expect((await call('POST', '/terminology', { preferred: 'MPay', avoid: ['MPAY'] }, 'u-redaktion')).status).toBe(201);

      // Analyse: „Nemesis“ ist kein Terminologie-Befund, „NEMESIS“ schon
      await importFile(built, 'n.md', `${FM}# 1. Schnittstellen\n\n## 1.1 Zweck\n\nNemesis überträgt die Verträge jede Nacht an das Archiv.\n`);
      await importFile(built, 'm.md', `${FM}# 2. Fehler\n\n## 2.1 Zweck\n\nNEMESIS meldet abgelehnte Verträge an das Autohaus.\n`);
      expect((await call('POST', '/quality/analysis', {}, 'u-redaktion')).status).toBe(202);
      await built.ctx.jobs.idle();
      const open = ((await call('GET', '/quality/findings')).json as any[]).filter((f) => f.type === 'terminology');
      expect(open.map((f) => f.details.term)).toEqual(['NEMESIS']);
    } finally {
      await built.app.close();
    }
    // Labelkatalog: Systemname wie in der Oberfläche
    expect(LABEL_CATALOG.filter((l) => l.code.endsWith('nemesis')).map((l) => l.nameDe)).toEqual(['Nemesis', 'Nemesis']);
  });
});
