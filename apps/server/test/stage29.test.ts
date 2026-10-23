import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { parseJiraCsv, wikiToMarkdown } from '../src/domain/jira.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 29', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));
  const fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'jira-export.xml'));

  it('[T-214] Jira-Import als Datei: XML- und CSV-Export, je Ticket eine Quelle unter jira/, Felder und Verknüpfungen, ohne Personenfelder, Text pseudonymisiert, erneuter Import nur bei Änderung', async () => {
    const built = await build('jira');
    const call = client(built);
    try {
      const imp = await importFile(built, 'filter.xml', fixture);
      const detail = (await call('GET', `/imports/${imp.id}`)).json;
      expect(detail).toMatchObject({ status: 'completed', kind: 'jira' });
      expect(detail.items.map((i: any) => [i.path, i.status])).toEqual([['jira/ONESCM-10263.md', 'imported'], ['jira/ONESCM-772.md', 'imported']]);
      const sources = (await call('GET', '/sources')).json;
      const doc = sources.find((d: any) => d.path === 'jira/ONESCM-10263.md');
      expect(doc.revisions[0]).toMatchObject({ sourceFormat: 'jira', frontMatter: { source_type: 'jira', jira_key: 'ONESCM-10263', jira_type: 'Test', jira_status: 'Reviewed', jira_epic: 'ONESCM-8703' } });
      const raw = (await call('GET', `/source-revisions/${doc.revisions[0].id}/raw`)).body;
      expect(raw).toContain('## ONESCM-10263 Vertragsvorschau als PDF erzeugen');
      expect(raw).toContain('| Komponente | 8 - Documents & Communications |');
      expect(raw).toContain('| Lösungsversion (PI) | PI TBD |');
      expect(raw).toContain('- relates to: ONESCM-14533');
      expect(raw).toContain('[E-Mail 1]');
      // Personenfelder und Kommentare werden nicht übernommen – auch nicht im gespeicherten Original
      const original = (await call('GET', `/source-revisions/${doc.revisions[0].id}/original`)).body;
      for (const t of [raw, original]) {
        expect(t).not.toContain('Mustermann');
        expect(t).not.toContain('Musterfrau');
        expect(t).not.toContain('Bitte bis Freitag');
      }
      // Überschriften der Beschreibung erzeugen keine Kapitel: alle Tickets liegen unter „Jira-Tickets“
      const chunks = (await call('GET', '/metadata/chunks?format=jira')).json;
      expect(chunks.total).toBeGreaterThan(0);
      expect(new Set(chunks.items.map((c: any) => c.chapter))).toEqual(new Set(['Jira-Tickets']));
      expect(chunks.items[0].format).toBe('jira');
      expect((await call('GET', '/metadata/chunks?format=markdown')).json.total).toBe(0);
      // gleicher Export erneut: identisch; kein Jira-Export: Fehler mit Hinweis
      const again = await importFile(built, 'filter.xml', fixture);
      expect((await call('GET', `/imports/${again.id}`)).json.items.map((i: any) => i.status)).toEqual(['identical', 'identical']);
      const bad = await importFile(built, 'liste.csv', 'a,b\n1,2\n');
      expect((await call('GET', `/imports/${bad.id}`)).json).toMatchObject({ status: 'failed', items: [{ message: expect.stringContaining('Kein Jira-Export erkannt') }] });
      // CSV-Export mit wiederholten Spalten, deutscher Oberfläche und Wiki-Syntax
      const csv = 'Zusammenfassung,Vorgangsschlüssel,Vorgangstyp,Status,Komponente/n,Komponente/n,Lösungsversion/en,Beschreibung,Bearbeiter\n"Antrag anlegen",ONESCM-1,Story,Erledigt,Contract Generation,Vehicle,PI15,"h2. Ziel\n* Antrag *speichern*",Max Mustermann\n';
      const issue = parseJiraCsv(csv)![0];
      expect(issue).toMatchObject({ key: 'ONESCM-1', type: 'Story', components: ['Contract Generation', 'Vehicle'], fixVersions: ['PI15'] });
      expect(JSON.stringify(issue)).not.toContain('Mustermann');
      expect(wikiToMarkdown('h1. Titel\n# eins\n## zwei\n{code}\nx = *1*\n{code}')).toBe('#### Titel\n1. eins\n   1. zwei\n```\nx = *1*\n```');
      // im ZIP: Jira-Export wird zerlegt, andere CSV-Dateien werden übersprungen
      const zip = new JSZip();
      zip.file('export/jira.csv', csv);
      zip.file('export/anhang.csv', 'Spalte A;Spalte B\n1;2\n');
      const zipImp = await importFile(built, 'paket.zip', await zip.generateAsync({ type: 'nodebuffer' }));
      expect((await call('GET', `/imports/${zipImp.id}`)).json.items.map((i: any) => [i.path, i.status]).sort()).toEqual([['export/anhang.csv', 'skipped'], ['jira/ONESCM-1.md', 'imported']]);
      const csvImp = await importFile(built, 'export.csv', csv);
      expect((await call('GET', `/imports/${csvImp.id}`)).json.items.map((i: any) => [i.path, i.status])).toEqual([['jira/ONESCM-1.md', 'identical']]);
    } finally {
      await built.app.close();
    }
  });

  it('[T-215] Update-Eingang: geänderte, entfallene und neue Quellabschnitte je Absatz; Text übernehmen, Quelle aktualisieren, ergänzen, entfernen, verwerfen; nur Entwürfe änderbar', async () => {
    const built = await build('updates');
    const call = client(built);
    try {
      const v1 = `${FM}# Abrechnung\n\n## Gutschriften\n\nGutschriften werden monatlich erstellt und per Post zugestellt.\n\nDie Gutschrift enthält die Vertragsnummer.\n\nStornierte Verträge erhalten eine Korrekturgutschrift.\n`;
      await importFile(built, 'abrechnung.md', v1);
      const chapterId = (await call('GET', '/chapters')).json.find((c: any) => c.title === 'Abrechnung').id;
      const version = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
      expect((await call('GET', '/source-updates')).json.summary.total).toBe(0);

      // neue Revision: ein Absatz geändert, einer entfallen, einer unverändert, einer neu
      const v2 = `${FM}# Abrechnung\n\n## Gutschriften\n\nGutschriften werden wöchentlich erstellt und elektronisch zugestellt.\n\nDie Gutschrift enthält die Vertragsnummer.\n\nGutschriften über 10 000 EUR werden vor dem Versand geprüft.\n`;
      await importFile(built, 'abrechnung.md', v2);
      const inbox = (await call('GET', '/source-updates', undefined, 'u-leser')).json;
      expect(inbox.summary).toMatchObject({ changed: 1, unchanged: 1, removed: 1, added: 1, chapters: 1 });
      expect(inbox.summary.regenerate).toBeGreaterThan(0);
      const item = (k: string) => inbox.items.find((i: any) => i.kind === k);
      expect(item('changed')).toMatchObject({ editable: true, versionStatus: 'draft', old: { text: expect.stringContaining('monatlich'), revisionNo: 1 }, new: { text: expect.stringContaining('wöchentlich'), revisionNo: 2 } });
      expect(item('added').new.text).toContain('10 000 EUR');

      // nur mit Bearbeitungsrecht, Eingaben werden geprüft
      const changed = item('changed');
      expect((await call('POST', '/source-updates/decisions', { blockId: changed.blockId, oldSnippetId: changed.old.snippetId, newSnippetId: changed.new.snippetId, action: 'replace' }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/source-updates/decisions', { blockId: changed.blockId, action: 'xx' }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/source-updates/decisions', { blockId: changed.blockId, oldSnippetId: item('removed').old.snippetId, newSnippetId: changed.new.snippetId, action: 'replace' }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/source-updates/decisions', { blockId: changed.blockId, oldSnippetId: changed.new.snippetId, newSnippetId: changed.old.snippetId, action: 'replace' }, 'u-redaktion')).status).toBe(400);

      // Text übernehmen: Absatz bekommt neuen Text und aktuelle Quelle, neue Blockversion
      const done = (await call('POST', '/source-updates/decisions', { blockId: changed.blockId, oldSnippetId: changed.old.snippetId, newSnippetId: changed.new.snippetId, action: 'replace' }, 'u-redaktion')).json;
      expect(done.block).toMatchObject({ text: expect.stringContaining('wöchentlich'), mode: 'manually_edited' });
      expect((await call('GET', `/content-blocks/${changed.blockId}/versions`)).json.length).toBeGreaterThan(1);
      // unveränderter Text: nur Quelle aktualisieren; neuer Abschnitt: ergänzen; entfallener: Absatz entfernen
      const u = item('unchanged');
      await call('POST', '/source-updates/decisions', { blockId: u.blockId, oldSnippetId: u.old.snippetId, newSnippetId: u.new.snippetId, action: 'relink' }, 'u-redaktion');
      const a = item('added');
      const appended = (await call('POST', '/source-updates/decisions', { blockId: a.blockId, newSnippetId: a.new.snippetId, action: 'append' }, 'u-redaktion')).json;
      expect(appended.block).toMatchObject({ text: expect.stringContaining('10 000 EUR'), mode: 'manually_edited' });
      const r = item('removed');
      expect((await call('POST', '/source-updates/decisions', { blockId: r.blockId, oldSnippetId: r.old.snippetId, action: 'remove', reason: 'entfällt laut Quelle' }, 'u-redaktion')).status).toBe(200);
      expect((await call('GET', '/source-updates')).json.summary.total).toBe(0);
      const ev = (await call('GET', `/chapter-versions/${version.id}/evidence`)).json;
      // übrig bleiben nur die Übersichtsabsätze des Generators – sie erneuert „Kapitel generieren“
      expect(ev.blocks.filter((x: any) => x.issues.includes('outdated_source') && x.mode !== 'generated')).toEqual([]);
      const actions = (await call('GET', '/audit-events?limit=200')).json.filter((e: any) => e.action === 'source_update.decided').map((e: any) => e.details.action);
      expect(actions.sort()).toEqual(['append', 'relink', 'remove', 'replace']);

      // freigegebene Version: Änderungen erscheinen, sind aber nicht änderbar – nur verwerfen
      // Übersichtsabsätze erneuert „Kapitel generieren“; übernommene Absätze bleiben (manuell geschützt)
      const v2nd = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
      expect(v2nd.sections.flatMap((s: any) => s.blocks).map((b: any) => b.text).join(' ')).toContain('wöchentlich');
      for (const b of v2nd.sections.flatMap((s: any) => s.blocks)) {
        if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
      }
      const sub = await call('POST', `/chapter-versions/${v2nd.id}/submit`, {}, 'u-redaktion');
      expect(sub.status, JSON.stringify(sub.json)).toBe(200);
      expect((await call('POST', `/chapter-versions/${v2nd.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      await importFile(built, 'abrechnung.md', v2.replace('wöchentlich', 'täglich'));
      const after = (await call('GET', '/source-updates')).json;
      const c2 = after.items.find((i: any) => i.kind === 'changed');
      expect(c2).toMatchObject({ editable: false, versionStatus: 'approved' });
      expect((await call('POST', '/source-updates/decisions', { blockId: c2.blockId, oldSnippetId: c2.old.snippetId, newSnippetId: c2.new.snippetId, action: 'replace' }, 'u-redaktion')).status).toBe(409);
      expect((await call('POST', '/source-updates/decisions', { blockId: c2.blockId, oldSnippetId: c2.old.snippetId, newSnippetId: c2.new.snippetId, action: 'dismiss', reason: 'nächstes Release' }, 'u-redaktion')).status).toBe(200);
      expect((await call('GET', '/source-updates')).json.items.find((i: any) => i.id === c2.id)).toBeUndefined();
    } finally {
      await built.app.close();
    }
  });

  it('[T-216] Zugriffsmatrix Rolle × Menüpunkt: Stufen V, L, –, ? mit Beleg, Pflege mit Bearbeitungsrecht, CSV-Import mit Namen oder Codes, Export ohne Formel-Einschleusung', async () => {
    const built = await build('matrix');
    const call = client(built);
    try {
      const m = (await call('GET', '/metadata/access-matrix', undefined, 'u-leser')).json;
      expect(m.roles.map((r: any) => r.code)).not.toContain('role.all');
      expect(m.roles.length).toBe(10);
      expect(m.navigation.length).toBe(34);
      expect(m.summary).toMatchObject({ cells: 340, V: 0, L: 0, none: 0, open: 340 });
      const role = (c: string) => m.roles.find((r: any) => r.code === c).id;
      const nav = (c: string) => m.navigation.find((n: any) => n.code === c).id;
      const cell = { roleId: role('role.mo'), navId: nav('nav.generation.mo-checks'), level: 'V', evidence: 'Navigation_oneSCM_Version3.docx, Rolle MO' };
      expect((await call('PUT', '/metadata/access-matrix/cells', cell, 'u-leser')).status).toBe(403);
      expect((await call('PUT', '/metadata/access-matrix/cells', { ...cell, level: 'Z' }, 'u-redaktion')).status).toBe(400);
      expect((await call('PUT', '/metadata/access-matrix/cells', { ...cell, roleId: nav('nav.mainpage') }, 'u-redaktion')).status).toBe(400);
      const after = (await call('PUT', '/metadata/access-matrix/cells', cell, 'u-redaktion')).json;
      expect(after.summary).toMatchObject({ V: 1, open: 339, withEvidence: 1 });
      expect(after.cells[0]).toMatchObject({ level: 'V', evidence: 'Navigation_oneSCM_Version3.docx, Rolle MO', updatedBy: 'u-redaktion' });

      // CSV: Menüpunkt als UI-Begriff, deutscher Name oder Code; Rollen als Name oder Code; leere Felder ändern nichts
      const csv = 'Menüpunkt;Dealer;MO (Market Operation);role.hq;Unbekannt;Beleg\nContract Generation › Contract Proposal;V;–;L;x;Navigation V3\nAdministration › Batch-Jobs;-;;V;;\nnav.product.blueprints;-;-;V;;\nGibt es nicht;V;;;;\nVertragsverwaltung;Z;;;;\n';
      const imp = (await call('POST', '/metadata/access-matrix/import', { csv }, 'u-redaktion')).json;
      expect(imp).toMatchObject({ written: 8, unknownNavigation: ['Gibt es nicht'], unknownRoles: ['Unbekannt'] });
      expect(imp.errors).toEqual(['Zeile 6, Dealer: „Z“ ist keine Stufe (V, L, -, ?)']);
      const m2 = (await call('GET', '/metadata/access-matrix')).json;
      const lv = (r: string, n: string) => m2.cells.find((c: any) => c.roleId === role(r) && c.navId === nav(n))?.level;
      expect([lv('role.dealer', 'nav.generation.proposal'), lv('role.mo', 'nav.generation.proposal'), lv('role.hq', 'nav.generation.proposal')]).toEqual(['V', '-', 'L']);
      expect(lv('role.mo', 'nav.generation.mo-checks')).toBe('V'); // unverändert
      expect((await call('POST', '/metadata/access-matrix/import', { csv: 'nur Kopf' }, 'u-redaktion')).status).toBe(400);

      await call('PUT', '/metadata/access-matrix/cells', { roleId: role('role.it'), navId: nav('nav.admin.health-check'), level: 'L', evidence: '=HYPERLINK("x")' }, 'u-redaktion');
      const out = await call('GET', '/metadata/access-matrix/export', undefined, 'u-leser');
      expect(out.headers['content-type']).toContain('text/csv');
      expect(out.body).toContain('Vertragserstellung › Antrag anlegen;Contract Generation › Contract Proposal;V;?;?;-;?;L;?;?;?;?;Navigation V3');
      expect(out.body).toContain(`"'=HYPERLINK(""x"")"`);
    } finally {
      await built.app.close();
    }
  });
});
