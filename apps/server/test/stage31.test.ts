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
