import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { compliancePromises, endUserLanguage, missingWarnings, parseAiFindings, profileScore, type ReviewBlock } from '../src/domain/reviewProfiles.js';
import { extractiveSummary, inventedFacts, sectionsWords, stepsOf, wordCount, type VariantSection } from '../src/domain/textVariants.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 52', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  const chapter: VariantSection[] = [
    { code: 'purpose', title: 'Zweck', blocks: [{ kind: 'paragraph', text: 'Mit dieser Anleitung kündigen Sie einen Vertrag. Sie benötigen sie, wenn ein Händler den Vertrag beendet und die Frist von 30 Tagen eingehalten ist.' }] },
    { code: 'prerequisites', title: 'Voraussetzungen', blocks: [{ kind: 'list', text: '- Sie haben die Berechtigung **Verträge bearbeiten**.\n- Der Vertrag ist aktiv.' }] },
    { code: 'steps', title: 'Schrittweise Durchführung', blocks: [{ kind: 'list', text: '1. Öffnen Sie **Verträge**.\n2. Wählen Sie den Vertrag aus.\n3. Klicken Sie auf **Kündigen**.\n4. Geben Sie das Kündigungsdatum ein.\n5. Bestätigen Sie mit **Speichern**.' }] },
    { code: 'result', title: 'Ergebnis und Systemstatus', blocks: [{ kind: 'paragraph', text: 'Der Vertrag hat den Status „gekündigt“. Der Händler erhält eine Bestätigung per E-Mail, und die Kündigung erscheint in der Übersicht der beendeten Verträge.' }] },
    { code: 'hints', title: 'Hinweise, Tipps und Warnungen', blocks: [{ kind: 'warning', text: 'Eine Kündigung lässt sich nicht zurücknehmen. Prüfen Sie das Datum vor dem Speichern.' }, { kind: 'tip', text: 'Sie können mehrere Verträge nacheinander kündigen, indem Sie die Liste gefiltert lassen und jeden Vertrag einzeln öffnen.' }] },
    { code: 'responsibilities', title: 'Rollen und Zuständigkeiten', blocks: [{ kind: 'paragraph', text: 'Die Kündigung führt die Vertragsverwaltung des Marktes durch; der Händler wird anschließend automatisch informiert und kann Rückfragen an die Vertragsverwaltung richten.' }] },
  ];

  it('[T-332] Kurzfassung, erfundene Zahlen, Prüferprofile (Einheit)', () => {
    expect(stepsOf(chapter)).toHaveLength(5);
    const s = extractiveSummary(chapter);
    expect(s.startsWith('Mit dieser Anleitung kündigen Sie einen Vertrag.')).toBe(true);
    expect(s).toContain('Wichtig: eine Kündigung lässt sich nicht zurücknehmen.');
    expect(s).toContain('Der Vertrag hat den Status „gekündigt“.');
    // etwa ein Viertel (Zweck steht immer darin, danach nur, was ins Budget passt)
    expect(wordCount(s)).toBeLessThanOrEqual(Math.round(sectionsWords(chapter) * 0.25) + 2);
    expect(wordCount(extractiveSummary(chapter, 0.6))).toBeGreaterThan(wordCount(s));
    expect(extractiveSummary(chapter, 0.6)).toContain('Ablauf in 5 Schritten: von „Öffnen Sie **Verträge**“ bis „Bestätigen Sie mit **Speichern**“.');
    expect(inventedFacts('Die Frist beträgt 30 Tage, Fehler E-4711.', 'Frist 30 Tage')).toEqual(['E-4711']);
    expect(inventedFacts('Frist 30 Tage.', 'Frist von 30 Tagen')).toEqual([]);

    const blocks: ReviewBlock[] = [
      { id: 'b1', section: 'purpose', sectionTitle: 'Zweck', kind: 'paragraph', text: 'Die Übertragung ist garantiert fehlerfrei und rechtssicher.' },
      { id: 'b2', section: 'steps', sectionTitle: 'Schritte', kind: 'list', text: '1. Klicken Sie auf **Löschen**, um den Datensatz endgültig zu löschen.' },
      { id: 'b3', section: 'result', sectionTitle: 'Ergebnis', kind: 'paragraph', text: 'Das Backend schreibt den Datensatz dann über einen Job in die Queue, der nachts verarbeitet wird, sofern kein Fehler auftritt und alle abhängigen Datensätze bereits vorhanden und geprüft sind.' },
    ];
    const promises = compliancePromises(blocks);
    expect(promises.map((p) => p.rule)).toEqual(['promise', 'promise', 'promise']);
    expect(promises[0]).toMatchObject({ profile: 'compliance', blockId: 'b1', section: 'Zweck' });
    expect(missingWarnings(blocks)).toMatchObject([{ rule: 'missing_warning', severity: 'high', blockId: 'b2' }]);
    expect(missingWarnings([...blocks, { id: 'w', section: 'hints', sectionTitle: 'Hinweise', kind: 'warning', text: 'Gelöschte Daten sind weg.' }])).toEqual([]);
    const eu = endUserLanguage(blocks);
    expect(eu.map((f) => f.rule).sort()).toEqual(['jargon', 'long_sentence']);
    expect(eu.find((f) => f.rule === 'jargon')!.message).toContain('Backend');
    expect(profileScore([{ severity: 'high' }, { severity: 'medium' }, { severity: 'low' }])).toBe(75);
    expect(profileScore(Array.from({ length: 10 }, () => ({ severity: 'high' as const })))).toBe(0);
    // KI-Funde: nur bekannte Absätze, Meldung Pflicht, Schweregrad sonst „gering“
    const ai = parseAiFindings('domain', { findings: [{ blockId: 'b1', quote: 'garantiert', message: 'Zusage prüfen', severity: 'high' }, { blockId: 'x', message: 'fremd', severity: 'bogus' }, { blockId: 'b2' }] }, blocks);
    expect(ai).toHaveLength(2);
    expect(ai[0]).toMatchObject({ origin: 'ai', blockId: 'b1', severity: 'high' });
    expect(ai[1]).toMatchObject({ blockId: null, severity: 'low' });
    expect(parseAiFindings('domain', 'kein JSON', blocks)).toEqual([]);
  });

  async function generated(built: Awaited<ReturnType<typeof build>>, md: string, title: string) {
    const call = client(built);
    await importFile(built, `${title}.md`, md);
    const chapterId = (await call('GET', '/chapters')).json.find((c: any) => c.title === title).id;
    const v = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
    return { chapterId, v };
  }

  it('[T-333] Textvarianten mit Wortzahl, KI-Kurzfassung, Download und Exportprofil Kurzfassung', async () => {
    const built = await build('variants');
    const call = client(built);
    try {
      const md = `${FM}# Kündigung\n\n## Vertrag kündigen\n\nMit dieser Anleitung kündigen Sie einen Vertrag. Verträge kündigen Sie im Menü **Verträge** mit der Schaltfläche **Kündigen**. Die Kündigungsfrist beträgt 30 Tage.\n\n1. Öffnen Sie **Verträge**.\n2. Wählen Sie den Vertrag aus.\n3. Klicken Sie auf **Kündigen**.\n4. Bestätigen Sie mit **Speichern**.\n\nNach der Kündigung erhält der Händler eine Bestätigung. Die Kündigung erscheint in der Übersicht der beendeten Verträge.\n\nACHTUNG: Eine Kündigung lässt sich nicht zurücknehmen.\n`;
      const { chapterId, v } = await generated(built, md, 'Kündigung');
      const r = (await call('GET', `/chapter-versions/${v.id}/text-variants`, undefined, 'u-leser')).json;
      expect(r.method).toBe('rules');
      expect(r.variants.map((x: any) => x.code)).toEqual(['enduser', 'expert', 'summary']);
      const [enduser, expert, summary] = r.variants;
      expect(expert.ratio).toBe(100);
      // Endanwender ohne Rollen, Geltungsbereich und Quellenstatus
      expect(enduser.sections.map((s: any) => s.code).every((c: string) => ['purpose', 'prerequisites', 'steps', 'result', 'hints'].includes(c))).toBe(true);
      expect(expert.sections.some((s: any) => s.code === 'status')).toBe(true);
      expect(enduser.words).toBeLessThan(expert.words);
      expect(summary.ratio).toBeLessThanOrEqual(40);
      expect(summary.sections[0].blocks).toHaveLength(1);
      expect(summary.markdown.startsWith('# Kündigung\n\n## Kurzfassung')).toBe(true);
      // KI-Kurzfassung (Demo-Dienst übernimmt den Entwurf)
      const ai = (await call('GET', `/chapter-versions/${v.id}/text-variants?ai=true`, undefined, 'u-leser')).json;
      expect(ai.method).toBe('ai');
      expect(ai.variants[2].sections[0].blocks[0].text).toBe(summary.sections[0].blocks[0].text);
      const file = await call('GET', `/chapter-versions/${v.id}/text-variants/summary/download`, undefined, 'u-leser');
      expect(file.headers['content-disposition']).toContain('kundigung-summary.md');
      expect(file.body).toContain('## Kurzfassung');
      expect((await call('GET', `/chapter-versions/${v.id}/text-variants/kurz/download`, undefined, 'u-leser')).status).toBe(400);
      expect((await call('GET', '/chapter-versions/cv_unbekannt/text-variants', undefined, 'u-leser')).status).toBe(404);

      // Exportprofil Kurzfassung (freigegebene Kapitel)
      for (const b of v.sections.flatMap((s: any) => s.blocks)) {
        if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
        else if (b.scopeStatus === 'unconfirmed') await call('PATCH', `/content-blocks/${b.id}`, { scopeStatus: 'general', reason: 'allgemein' }, 'u-redaktion');
      }
      expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      const e = (await call('POST', '/exports', { format: 'md', chapterIds: [chapterId], profile: 'summary' }, 'u-leser')).json;
      expect(e.fileName).toMatch(/-summary-/);
      const text = (await call('GET', e.downloadUrl.replace('/api/v1', ''), undefined, 'u-leser')).body;
      expect(text).toContain('Kurzfassung');
      expect(text).toContain('Mit dieser Anleitung kündigen Sie einen Vertrag.');
      expect(text).not.toContain('Schrittweise Durchführung');
    } finally {
      await built.app.close();
    }
  });

  it('[T-334] Prüferprofile: alle vier oder Auswahl, Funde je Profil, Verlauf, Berechtigung', async () => {
    const built = await build('profiles');
    const call = client(built);
    try {
      const md = `${FM}# Datensätze\n\n## Datensatz löschen\n\nMit dieser Anleitung löschen Sie einen Datensatz. Die Übertragung ist garantiert fehlerfrei.\n\n1. Öffnen Sie **Stammdaten**.\n2. Klicken Sie auf **Löschen**, um den Datensatz endgültig zu löschen.\n\nDas Backend schreibt den Datensatz anschließend über einen Job in die Queue, der nachts verarbeitet wird, sofern kein Fehler auftritt und alle abhängigen Datensätze bereits vorhanden und geprüft sind.\n`;
      const { v } = await generated(built, md, 'Datensätze');
      expect((await call('GET', '/review-profiles', undefined, 'u-leser')).json.map((p: any) => p.label)).toEqual(['Fachlich', 'Redaktion', 'Compliance', 'Endanwender']);
      expect((await call('POST', `/chapter-versions/${v.id}/profile-reviews`, {}, 'u-leser')).status).toBe(403);
      expect((await call('POST', `/chapter-versions/${v.id}/profile-reviews`, { profiles: ['legal'] }, 'u-fachpruefung')).status).toBe(400);
      const empty = (await call('GET', `/chapter-versions/${v.id}/profile-reviews`, undefined, 'u-leser')).json;
      expect(empty.latest).toEqual([]);

      const res = await call('POST', `/chapter-versions/${v.id}/profile-reviews`, {}, 'u-fachpruefung');
      expect(res.status).toBe(201);
      const r = res.json;
      expect(r.latest.map((x: any) => x.profile)).toEqual(['domain', 'editorial', 'compliance', 'enduser']);
      const by = Object.fromEntries(r.latest.map((x: any) => [x.profile, x]));
      for (const x of r.latest) {
        expect(x.method).toBe('rules');
        expect(x.score).toBe(Math.max(0, 100 - 15 * x.counts.high - 7 * x.counts.medium - 3 * x.counts.low));
        expect(['green', 'yellow', 'red']).toContain(x.traffic);
      }
      // Fachlich: Lücken der Generierung fehlen als Quelle
      expect(by.domain.findings.some((f: any) => f.rule === 'statement.missing')).toBe(true);
      // Compliance: Zusage und folgenreiche Aktion ohne Warnhinweis
      const rules = by.compliance.findings.map((f: any) => f.rule);
      expect(rules).toContain('promise');
      expect(rules).toContain('missing_warning');
      expect(by.compliance.findings[0].severity).toBe('high');
      // Endanwender: langer Satz und Fachjargon
      expect(by.enduser.findings.map((f: any) => f.rule)).toEqual(expect.arrayContaining(['long_sentence', 'jargon']));
      expect(by.enduser.findings.find((f: any) => f.rule === 'jargon').section).toBeTruthy();
      // Redaktion: Anleitungs-Check und Stil
      expect(by.editorial.findings.length).toBeGreaterThan(0);

      // Auswahl mit KI (Demo-Dienst ohne zusätzliche Funde), Verlauf
      const again = (await call('POST', `/chapter-versions/${v.id}/profile-reviews`, { profiles: ['compliance'], ai: true }, 'u-redaktion')).json;
      expect(again.latest.find((x: any) => x.profile === 'compliance').method).toBe('ai');
      expect(again.latest.find((x: any) => x.profile === 'domain').method).toBe('rules');
      expect(again.history).toHaveLength(5);
      expect(again.history[0].profile).toBe('compliance');
    } finally {
      await built.app.close();
    }
  });
});
