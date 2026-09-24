import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { matchNodes } from '../src/domain/outline.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const fm = (extra = '') => `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n${extra}---\n`;

describe('Etappe 13', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' }));

  it('[T-173] Varianten synchronisieren: Vergleich Blueprint → Markt-Variante, Schnipsel und fehlende Einträge übernehmen, Variantenprüfung', async () => {
    // Einheit: Zuordnung über Titel (Nummern egal, Unterkapitel nur unter zugeordnetem Kapitel, mehrdeutig → keine) bzw. Kennung
    const n = (id: string, title: string, parentId: string | null = null, nodeKey = id) => ({ id, title, parentId, level: parentId ? 2 : 1, nodeKey });
    const m = matchNodes([n('a', '1. Anmeldung'), n('a1', 'Zweck', 'a'), n('b', 'Hilfe'), n('b2', 'Hilfe')], [n('x', 'anmeldung'), n('x1', '1.1 Zweck', 'x'), n('y', 'Hilfe')], false);
    expect([...m]).toEqual([['a', 'x'], ['a1', 'x1']]);
    expect([...matchNodes([n('a', 'A', null, 'k1')], [n('z', 'B', null, 'k1')], true)]).toEqual([['a', 'z']]);

    const built = await build('sync');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${fm()}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldung öffnet oneSCM.\n\n## 1.2 Schritte\n\nBenutzername und Passwort eingeben.\n\n# 2. Aufträge\n\nAufträge werden im DMS angelegt.\n`);
      await importFile(built, 'fr.md', `${fm('market: FR\n')}# 1. Anmeldung\n\n## 1.1 Zweck\n\nIn Frankreich gilt die lokale Anmeldung.\n`);
      await importFile(built, 'it.md', `${fm('market: IT\n')}# 1. Anmeldung\n\n## 1.1 Zweck\n\nIn Italien gilt die SPID-Anmeldung.\n`);
      const blueprint = (await call('POST', '/outlines', { name: 'Blueprint', content: '# Anmeldung\n## Zweck\n## Schritte\n# Aufträge\n', format: 'markdown' })).json;
      await call('POST', `/outlines/${blueprint.id}/auto-assign`, {});
      const fr = (await call('POST', '/outlines', { name: 'Markt FR', marketScope: 'markets', markets: ['FR'], content: '# 1. Anmeldung\n## 1.1 Zweck\n# 2. Lokales\n', format: 'markdown' })).json;
      const frZweck = fr.nodes.find((x: any) => x.title === 'Zweck');
      const frSnippet = (await call('GET', `/outlines/${fr.id}/candidates?q=Frankreich`)).json.items[0];
      await call('POST', `/outlines/${fr.id}/assignments`, { nodeId: frZweck.id, snippetIds: [frSnippet.id] });

      expect((await call('GET', `/outlines/${fr.id}/sync`)).status).toBe(400);
      expect((await call('GET', `/outlines/${fr.id}/sync?from=${fr.id}`)).status).toBe(400);
      const pv = (await call('GET', `/outlines/${fr.id}/sync?from=${blueprint.id}`, undefined, 'u-leser')).json;
      const entry = (t: string) => pv.entries.find((e: any) => e.title === t);
      expect(entry('Zweck').target).toMatchObject({ number: '1.1', title: 'Zweck' });
      // Zweck: allgemein (passt), IT (passt nicht zur FR-Variante); FR ist schon zugeordnet → gemeinsam
      expect(entry('Zweck').onlySource.map((x: any) => [x.text, x.fits])).toEqual([['Die Anmeldung öffnet oneSCM.', true], ['In Italien gilt die SPID-Anmeldung.', false]]);
      expect(entry('Zweck').onlySource[1].problems).toEqual(['Markt IT gehört nicht zur Variante']);
      expect(entry('Zweck').common).toBe(1);
      expect(entry('Schritte').target).toBeNull();
      expect(entry('Aufträge').target).toBeNull();
      expect(pv.summary).toMatchObject({ matched: 2, missing: 2, offered: 4, fitting: 3 });

      // Übernehmen: passende Schnipsel in Zweck, Unterkapitel „Schritte“ und Kapitel „Aufträge“ neu
      expect((await call('POST', `/outlines/${fr.id}/sync`, { from: blueprint.id, add: [{ sourceNodeId: entry('Zweck').sourceNodeId, snippetIds: [entry('Zweck').onlySource[0].id] }] }, 'u-leser')).status).toBe(403);
      expect((await call('POST', `/outlines/${fr.id}/sync`, { from: blueprint.id, add: [{ sourceNodeId: entry('Zweck').sourceNodeId, snippetIds: ['sn_fremd'] }] })).status).toBe(400);
      expect((await call('POST', `/outlines/${fr.id}/sync`, { from: blueprint.id, add: [{ sourceNodeId: entry('Schritte').sourceNodeId }] })).status).toBe(400);
      expect((await call('POST', `/outlines/${fr.id}/sync`, { from: blueprint.id })).status).toBe(400);
      const res = (await call('POST', `/outlines/${fr.id}/sync`, {
        from: blueprint.id,
        add: [{ sourceNodeId: entry('Zweck').sourceNodeId, snippetIds: [entry('Zweck').onlySource[0].id] }],
        create: [{ sourceNodeId: entry('Schritte').sourceNodeId }, { sourceNodeId: entry('Aufträge').sourceNodeId }],
      }, 'u-redaktion')).json;
      expect(res).toMatchObject({ added: 3, created: 2 });
      expect(res.preview.summary).toMatchObject({ matched: 4, missing: 0, offered: 1, fitting: 0 });
      const after = (await call('GET', `/outlines/${fr.id}`)).json;
      expect(after.nodes.map((x: any) => `${x.number} ${x.title}`)).toEqual(['1 Anmeldung', '1.1 Zweck', '1.2 Schritte', '2 Lokales', '3 Aufträge']);
      const draft = (await call('GET', `/outlines/${fr.id}/draft`)).json;
      expect(draft.nodes.find((x: any) => x.title === 'Zweck').snippets.map((s: any) => s.text)).toEqual(['In Frankreich gilt die lokale Anmeldung.', 'Die Anmeldung öffnet oneSCM.']);
      expect(draft.nodes.find((x: any) => x.title === 'Lokales').flags).toEqual([{ type: 'gap', label: 'keine Textschnipsel zugeordnet' }]);
      // Unterkapitel ohne Kapitel im Ziel wird abgewiesen
      const empty = (await call('POST', '/outlines', { name: 'Leer', nodes: [{ title: 'Anderes' }] })).json;
      expect((await call('POST', `/outlines/${empty.id}/sync`, { from: blueprint.id, create: [{ sourceNodeId: entry('Schritte').sourceNodeId }] })).status).toBe(400);
      expect((await built.ctx.db.get("SELECT details FROM audit_events WHERE action = 'outline.synced'"))!.details).toContain('"created":2');
    } finally {
      await built.app.close();
    }
  });
});
