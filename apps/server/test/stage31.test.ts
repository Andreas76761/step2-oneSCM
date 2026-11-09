import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { analyzeGuidance } from '../src/domain/guidance.js';
import { checkTranslation, missingFixedTerms, type FixedTerm } from '../src/domain/translate.js';
import { checkWarning, signalWordsMissing } from '../src/domain/warnings.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 31', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));

  it('[T-241] Release-Abgleich und Releaseletter aus Jira-Tickets: Releases, Bug = intern, Handbuch-Lücken, Änderungen zum vorigen Import, Ticketliste, Letter mit Guardrails, Prüfregeln und Urteil, Freigabe, Export', async () => {
    const built = await build('releaseletter');
    const call = client(built);
    const head = 'Summary,Issue key,Issue Type,Status,Priority,Component/s,Fix Version/s,Labels,Created,Description,Outward issue link (relates)';
    const rows = [
      '"Contract Preview PDF without vehicle data",ONESCM-101,Story,Fertig,High,8 - Documents & Communications,PI16,preview,2026-02-05T10:00:00.000+0100,"Target State: The contract preview PDF is shown even when vehicle data is missing.",ONESCM-900',
      '"Preview crashes for long names",ONESCM-102,Bug,Fertig,Medium,8 - Documents & Communications,PI16,,2026-02-07T10:00:00.000+0100,"Crash fixed.",',
      '"Validate preview",ONESCM-103,Test,BAT Testing,Low,8 - Documents & Communications,PI16,,2026-02-01T10:00:00.000+0100,"Validation of the preview.",',
      '"Cancelled idea",ONESCM-104,Story,Cancelled,Low,,PI16,,2026-01-20T10:00:00.000+0100,"Not needed.",',
      '"Without version",ONESCM-105,Story,Offen,Low,,,,2026-03-01T10:00:00.000+0100,"Later.",',
    ];
    try {
      await importFile(built, 'release.csv', Buffer.from([head, ...rows].join('\n')));
      // F-03: Releases, Klassifizierung, Statusgruppen, Lücken
      const r = (await call('GET', '/ticket-releases', undefined, 'u-leser')).json;
      expect(r.releases).toEqual([
        { label: 'PI16', tickets: 4, manual: 3, internal: 1, unknown: 0, done: 2, gaps: 2, changed: 0 },
        { label: 'PI TBD', tickets: 1, manual: 1, internal: 0, unknown: 0, done: 0, gaps: 1, changed: 0 },
      ]);
      const t = (k: string) => r.tickets.find((x: any) => x.key === k);
      expect(t('ONESCM-102')).toMatchObject({ manualClass: 'internal', manualClassLabel: 'Intern / Bug', gap: false, statusBucket: 'done' });
      expect(t('ONESCM-103')).toMatchObject({ manualClass: 'manual', statusBucket: 'progress', statusLabel: 'In Bearbeitung', gap: true });
      expect(t('ONESCM-104')).toMatchObject({ statusBucket: 'cancelled', gap: false });
      expect((await call('GET', '/ticket-releases?release=PI%20TBD')).json.tickets.map((x: any) => x.key)).toEqual(['ONESCM-105']);
      expect((await call('POST', '/ticket-releases/match', { keys: 'onescm-101\nONESCM-102, ONESCM-999' })).json).toEqual({ total: 3, loaded: ['ONESCM-101', 'ONESCM-102'], missing: ['ONESCM-999'] });
      expect((await call('POST', '/ticket-releases/match', { keys: 'nichts' })).status).toBe(400);

      // F-02: Letter aus dem Release – stornierte Tickets entfallen, Datum aus „Erstellt“, verknüpfte Tickets kein Inhalt
      expect((await call('POST', '/release-letters', { release: 'PI16' }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/release-letters', { release: 'PI16', division: 'truck' }, 'u-redaktion')).status).toBe(400);
      const created = await call('POST', '/release-letters', { release: 'PI16', language: 'de', audience: 'biz', country: 'FR', division: 'car' }, 'u-redaktion');
      expect(created.status).toBe(201);
      const letter = created.json;
      expect(letter).toMatchObject({ release: 'PI16', ticketKeys: ['ONESCM-101', 'ONESCM-102', 'ONESCM-103'], origin: 'generated', status: 'draft', language: 'de', audience: 'biz' });
      expect(letter.text).toContain('# oneSCM Consolidated Release PI16 – 07 Feb 2026');
      expect(letter.text).toContain('| Erstellt von | oneSCM Team |');
      expect(letter.text).toContain('Typ: Testfall / Validierung');
      expect(letter.text).toContain('Für Markt FR ist eine Lokalisierung erforderlich.');
      expect(letter.text).toContain('- ONESCM-103: Validate preview (Status: BAT Testing)');
      expect(letter.text).not.toContain('ONESCM-900');
      expect(letter.text).not.toContain('ONESCM-104');
      expect(letter.check).toMatchObject({ verdict: 'ok', counts: { fail: 0, warn: 0 }, phantoms: [], pii: [] });

      // Prüfregeln an einem eingefügten Letter (z. B. aus Dify): Phantom, Typ, PI, Datum, Erledigung, Personendaten
      const dify = [
        '# oneSCM Release PI 2024.4 – 23 Oct 2026',
        'Prepared by: Max Mustermann (max.mustermann@autohaus-muster.de)',
        'ONESCM-103 New feature: preview validation successfully completed. Status: Release Candidate / Validation Phase.',
        'Key Changes: scope includes ONESCM-900. Improves efficiency.',
      ].join('\n');
      const imp = (await call('POST', '/release-letters/import', { text: dify, keys: ['ONESCM-103'], audience: 'biz' }, 'u-redaktion')).json;
      expect(imp).toMatchObject({ origin: 'external', ticketKeys: ['ONESCM-103'], verdict: 'block' });
      const rules = imp.check.findings.map((f: any) => `${f.rule}:${f.severity}`);
      expect(rules).toEqual(['1:fail', '6:fail', '10b:fail', 'pii:fail', '2:warn', '5:warn', '10:warn', '10c:warn', '9:hint', '12:hint']);
      expect(imp.check.pii.map((p: any) => p.kind)).toEqual(['email', 'name']);
      expect(imp.check.findings.find((f: any) => f.rule === '10b').detail).toBe('ONESCM-900');
      expect(imp.check.verdictLabel).toBe('Nicht freigeben');
      expect((await call('POST', `/release-letters/${imp.id}/approve`, {}, 'u-admin')).status).toBe(409);
      // Umfang aus dem Text, wenn keine Tickets angegeben sind
      expect((await call('POST', '/release-letters/import', { text: 'Release mit ONESCM-101 und ONESCM-102.' }, 'u-redaktion')).json.ticketKeys).toEqual(['ONESCM-101', 'ONESCM-102']);
      expect((await call('POST', '/release-letters/import', { text: 'ohne Ticket' }, 'u-redaktion')).status).toBe(400);

      // Bearbeiten: Warnung → bedingte Freigabe nur mit Begründung
      const edited = (await call('PATCH', `/release-letters/${letter.id}`, { text: letter.text.replace(/Fertig/g, '–') }, 'u-redaktion')).json;
      expect(edited.check.verdict).toBe('cond');
      expect((await call('POST', `/release-letters/${letter.id}/approve`, {}, 'u-redaktion')).status).toBe(403);
      expect((await call('POST', `/release-letters/${letter.id}/approve`, {}, 'u-admin')).status).toBe(409);
      const approved = (await call('POST', `/release-letters/${letter.id}/approve`, { reason: 'Status im Begleitschreiben' }, 'u-admin')).json;
      expect(approved).toMatchObject({ status: 'approved', verdict: 'cond', approvedBy: 'u-admin' });
      expect((await call('PATCH', `/release-letters/${letter.id}`, { text: 'neu' }, 'u-redaktion')).status).toBe(409);
      expect((await call('DELETE', `/release-letters/${letter.id}`, undefined, 'u-redaktion')).status).toBe(409);
      expect((await call('DELETE', `/release-letters/${imp.id}`, undefined, 'u-redaktion')).status).toBe(204);
      const list = (await call('GET', '/release-letters', undefined, 'u-leser')).json;
      expect(list.map((l: any) => l.id)).toContain(letter.id);
      expect(list[0].text).toBeUndefined();

      // Export als Markdown und Word
      const md = await call('GET', `/release-letters/${letter.id}/export?format=md`, undefined, 'u-leser');
      expect(md.headers['content-disposition']).toContain('releaseletter_PI16_de.md');
      const docx = await call('GET', `/release-letters/${letter.id}/export?format=docx`, undefined, 'u-leser');
      expect(docx.headers['content-type']).toContain('wordprocessingml');
      expect((await call('GET', `/release-letters/${letter.id}/export?format=pdf`)).status).toBe(400);

      // Kurzfassung (Management) auf Englisch und Endanwender ohne Metadaten
      const mgmt = (await call('POST', '/release-letters', { keys: ['ONESCM-101'], language: 'en', audience: 'mgmt' }, 'u-redaktion')).json;
      expect(mgmt.text).toContain('Short version: only facts backed by the tickets.');
      expect(mgmt.text).not.toContain('## Details per ticket');
      expect(mgmt.check.verdict).toBe('ok');
      const end = (await call('POST', '/release-letters', { keys: ['ONESCM-101'], audience: 'end' }, 'u-redaktion')).json;
      expect(end.text).not.toContain('Typ:');
      expect(end.check.verdict).toBe('ok');
      expect((await call('POST', '/release-letters', { keys: ['ONESCM-104'] }, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/release-letters', { keys: ['ONESCM-999'] }, 'u-redaktion')).status).toBe(400);

      // Änderungen zum vorigen Import: Status und Version
      await importFile(built, 'release2.csv', Buffer.from([head, rows[0].replace('Fertig', 'Geschlossen').replace('PI16', 'PI17')].join('\n')));
      const r2 = (await call('GET', '/ticket-releases')).json;
      expect(r2.tickets.find((x: any) => x.key === 'ONESCM-101')).toMatchObject({ release: 'PI17', isNew: false, revisionNo: 2,
        changes: [{ field: 'Status', before: 'Fertig', after: 'Geschlossen' }, { field: 'Lösungsversion', before: 'PI16', after: 'PI17' }] });
      expect(r2.releases.find((x: any) => x.label === 'PI17')).toMatchObject({ tickets: 1, changed: 1 });
    } finally {
      await built.app.close();
    }
  });

  it('[T-242] Warnhinweis-Schema, Platzhalter- und Strukturvergleich beim Übersetzen, feste Übersetzungen, Begriffskandidaten aus Tickets, Sprachen Slowakisch/Koreanisch/Malaiisch', async () => {
    // F-07: Signalwort + Gefahr + Folge + Vermeidung
    expect(checkWarning('**WARNUNG:** Beim Stornieren werden alle Zahlungen gelöscht. Prüfen Sie vorher den Zahlungsstatus.')).toMatchObject({ level: 'warning', missing: [] });
    expect(checkWarning('Warnung: Daten weg.')).toMatchObject({ missing: ['uppercase', 'hazard', 'consequence', 'avoidance'], fixed: 'WARNUNG: Daten weg.' });
    expect(checkWarning('Achtung: Der Vertrag wird sofort beendet und kann nicht reaktiviert werden. Prüfen Sie vorher die Laufzeit.')).toMatchObject({ level: null, missing: ['standard_signal'], fixed: 'HINWEIS: Der Vertrag wird sofort beendet und kann nicht reaktiviert werden. Prüfen Sie vorher die Laufzeit.' });
    expect(checkWarning('Hinweis: Die Liste ist alphabetisch sortiert.')).toBeNull(); // Informationshinweis, kein Warnhinweis
    expect(checkWarning('Hinweise zur Bedienung stehen unten.')).toBeNull();
    const blocks = [
      { id: 'p', section: 'purpose', kind: 'paragraph', text: 'Mit dieser Anleitung kündigen Sie einen Vertrag.', versionNo: 1 },
      { id: 'w', section: 'hints', kind: 'paragraph', text: 'Achtung: Daten weg.', versionNo: 3 },
    ];
    const g = analyzeGuidance(blocks).checks.find((c) => c.code === 'warning_schema')!;
    expect(g).toMatchObject({ status: 'warning', label: 'Warnhinweise nach Schema' });
    expect(g.items[0].excerpt).toContain('fehlt: festes Signalwort');
    expect(g.items[0].fix).toMatchObject({ blockId: 'w', versionNo: 3, text: 'HINWEIS: Daten weg.', label: 'Festes Signalwort setzen' });
    // ohne Warnhinweis kein zusätzlicher Prüfpunkt (Bewertung bestehender Kapitel unverändert)
    expect(analyzeGuidance(blocks.slice(0, 1)).checks.some((c) => c.code === 'warning_schema')).toBe(false);

    // F-09: Platzhalter, Ticketnummern, Links, Code, Fettung, Tabellen und Überschriften; Signalwörter je Sprache
    const de = 'WARNUNG: Ein Storno in **Contract Management** löscht {count} Zahlungen ([Person 1], ONESCM-12, `F5`, https://example.org/a).';
    expect(checkTranslation(de, 'WARNING: A cancellation in **Contract Management** deletes {count} payments ([Person 1], ONESCM-12, `F5`, https://example.org/a).', null, { language: 'en' })).toEqual([]);
    expect(checkTranslation(de, 'WARNING: A cancellation in Contract Management deletes {anzahl} payments ([Person 1], ONESCM-12, F5, https://example.org/a).', null, { language: 'en' }))
      .toEqual(['placeholders_changed', 'formatting_changed']);
    expect(checkTranslation(de, 'NOTE: A cancellation in **Contract Management** deletes {count} payments ([Person 1], ONESCM-12, `F5`, https://example.org/a).', null, { language: 'en' })).toEqual(['signal_word_missing']);
    expect(signalWordsMissing('WARNUNG: a\nVORSICHT: b', 'AVERTISSEMENT : a\nATTENTION : b', 'fr')).toEqual([]);
    expect(signalWordsMissing('HINWEIS: a', '주의: a', 'ko')).toEqual(['알림']);
    expect(checkTranslation('| A | B |\n|---|---|\n| 1 | 2 |', '| A | B |\n| 1 | 2 |')).toEqual(['structure_changed']);
    expect(checkTranslation('## Zweck\nText.', 'Purpose\nText.')).toEqual(['structure_changed']);

    // F-12: feste Übersetzung aus der Terminologie
    const terms: FixedTerm[] = [{ preferred: 'Servicevertrag', translations: { en: 'service contract' } }, { preferred: 'Antrag', translations: {} }];
    expect(missingFixedTerms('Der Servicevertrag und der Antrag.', 'The maintenance contract and the proposal.', 'en', terms)).toEqual(['Servicevertrag']);
    expect(checkTranslation('Der Servicevertrag endet.', 'The Service Contract ends.', null, { language: 'en', terms })).toEqual([]);
    expect(checkTranslation('Der Servicevertrag endet.', 'The maintenance contract ends.', null, { language: 'en', terms })).toEqual(['term_translation']);

    const built = await build('lektorat');
    const call = client(built);
    try {
      // neue Ausgabesprachen
      expect((await call('PATCH', '/projects/p_default', { languages: ['en', 'sk', 'ko', 'ms'] })).status).toBe(200);
      const langs = (await call('GET', '/languages')).json.languages.map((l: any) => l.code);
      expect(langs).toEqual(expect.arrayContaining(['sk', 'ko', 'ms']));

      // feste Übersetzung wirkt beim Speichern einer FAQ-Übersetzung
      expect((await call('POST', '/terminology', { preferred: 'Servicevertrag', avoid: [], translations: { en: { term: 'service contract' } } }, 'u-redaktion')).status).toBe(201);
      const faq = (await call('POST', '/faq', { question: 'Wie verlängere ich einen Servicevertrag?', answer: 'Öffnen Sie den Servicevertrag und wählen Sie **Verlängern**.', status: 'published' }, 'u-redaktion')).json;
      const bad = (await call('PUT', `/faq/${faq.id}/translations/en`, { question: 'How do I extend a maintenance contract?', answer: 'Open the maintenance contract and choose Extend.' }, 'u-redaktion')).json;
      expect(bad.issues).toEqual(expect.arrayContaining(['term_translation', 'formatting_changed']));
      const good = (await call('PUT', `/faq/${faq.id}/translations/en`, { question: 'How do I extend a service contract?', answer: 'Open the service contract and choose **Extend**.' }, 'u-redaktion')).json;
      expect(good.issues).toEqual([]);

      // Begriffskandidaten aus Jira-Tickets: mindestens zwei Tickets, bekannte Begriffe und Feldtabelle ausgenommen
      const csv = [
        'Summary,Issue key,Issue Type,Status,Description',
        '"Preview",ONESCM-1,Story,Done,"The Contract Preview PDF shows the Vehicle Group. When the Service Contract is saved, the Contract Preview PDF is updated."',
        '"Preview 2",ONESCM-2,Bug,Done,"Contract Preview PDF is empty for one Vehicle Group."',
        '"Other",ONESCM-3,Story,Open,"The Master Template is used once."',
      ].join('\n');
      await importFile(built, 'jira.csv', Buffer.from(csv));
      const cands = (await call('GET', '/terminology/candidates', undefined, 'u-leser')).json;
      expect(cands.map((c: any) => [c.term, c.tickets])).toEqual([['Contract Preview PDF', 2], ['Vehicle Group', 2]]);
      expect(cands[0].examples).toEqual(['ONESCM-1', 'ONESCM-2']);
      // „Service Contract“ steht schon als feste Übersetzung von „Servicevertrag“ in der Terminologie
      expect((await call('GET', '/terminology/candidates?minTickets=1')).json.map((c: any) => c.term)).toEqual(['Contract Preview PDF', 'Vehicle Group', 'Master Template']);
      await call('POST', '/terminology', { preferred: 'Vehicle Group', avoid: [] }, 'u-redaktion');
      expect((await call('GET', '/terminology/candidates')).json.map((c: any) => c.term)).toEqual(['Contract Preview PDF']);
    } finally {
      await built.app.close();
    }
  });
});
