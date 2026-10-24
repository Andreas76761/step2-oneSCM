import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { buildComparisonLetter, type ComparisonData } from '../src/domain/comparisonLetter.js';
import { defaultTicketClass, ticketFeedsManual, ticketInLetter } from '../src/domain/releaseLetter.js';
import { compareReleases, isFutureContent } from '../src/domain/releaseOrder.js';
import { analyzeStyle } from '../src/domain/style.js';
import { cleanToneSettings, resolveTone, toneHits } from '../src/domain/tone.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 49', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));
  /** Kapitel über den Kapitel-Assistenten anlegen und freigeben */
  const chapter = async (call: ReturnType<typeof client>, title: string, extra: Record<string, unknown> = {}) => {
    const ch = (await call('POST', '/chapter-assistant', { title, purpose: 'Mit dieser Anleitung legen Sie einen Vertrag an.', steps: ['Öffnen Sie **Verträge**', 'Klicken Sie auf **Neu**'], result: 'Der Vertrag ist gespeichert.', ...extra }, 'u-redaktion')).json;
    expect((await call('POST', `/chapter-versions/${ch.versionId}/submit`, {}, 'u-redaktion')).status).toBe(200);
    expect((await call('POST', `/chapter-versions/${ch.versionId}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
    return ch as { chapterId: string; versionId: string };
  };
  const rules = (issues: { rule: string }[]) => issues.map((i) => i.rule);
  const all = (text: string, opts: Parameters<typeof analyzeStyle>[1]) => analyzeStyle(text, opts).sentences.flatMap((s) => s.issues);

  it('[T-319] Tonalität, Reihenfolge von Releases, Ticket-Einstufung und Letter aus dem Projektvergleich (Einheit)', () => {
    // S-02: Prüfregeln je Ton
    expect(toneHits('Das geht einfach und blitzschnell.', 'factual').map((h) => h.message)).toEqual([
      'Ton „sachlich“: Werbesprache „einfach“ – streichen oder sachlich belegen', 'Ton „sachlich“: Werbesprache „blitzschnell“ – streichen oder sachlich belegen',
    ]);
    expect(toneHits('Das gibt\'s auch als Vorlage :)', 'formal').map((h) => h.severity)).toEqual(['warning', 'warning']);
    expect(toneHits('Bitte beachten Sie, dass der Antrag gespeichert ist.', 'concise')).toHaveLength(1);
    expect(toneHits('Wählen Sie im Menü Verträge den Vertrag aus, prüfen Sie die Daten und speichern Sie anschließend den Antrag.', 'concise')[0].message).toContain('höchstens 15');
    expect(toneHits('Sie müssen den Antrag speichern.', 'friendly')[0].message).toContain('als Empfehlung');
    expect(toneHits('Sie müssen den Antrag speichern.', 'factual')).toEqual([]);
    // in der Stilprüfung als Regel „tone“, nicht in Code und nicht ohne Ton
    expect(rules(all('Speichern Sie den Antrag `einfach`.', { tone: 'factual' }))).not.toContain('tone');
    expect(rules(all('Das geht einfach.', {}))).not.toContain('tone');
    expect(rules(all('Das geht einfach.', { tone: 'factual' }))).toContain('tone');
    expect(rules(all('Das geht einfach.', { tone: 'factual', disabled: ['tone'] }))).not.toContain('tone');
    // langer Satz: im knappen Ton keine doppelte Meldung
    const long = 'Wählen Sie im Menü Verträge den Vertrag aus und prüfen Sie dann alle Daten des Antrags sorgfältig, bevor Sie ihn speichern und an die Market Operation senden.';
    expect(rules(all(long, { tone: 'concise' })).filter((r) => r === 'long_sentence' || r === 'tone')).toEqual(['long_sentence']);
    // wirksamer Ton: Rollenprofil bei genau einer Rolle, sonst Produktart, sonst TONALITAET.md
    const s = cleanToneSettings({ products: { manual: 'formal' }, roles: { dealer: 'friendly' } });
    expect(typeof s).toBe('object');
    expect(resolveTone(s as any, { roles: ['dealer'] })).toEqual({ tone: 'friendly', source: 'role', role: 'dealer' });
    expect(resolveTone(s as any, { roles: ['dealer', 'mo'] }).tone).toBe('formal');
    expect(resolveTone(s as any, { roles: ['all'] }).tone).toBe('formal');
    expect(resolveTone(s as any, { product: 'releaseletter' })).toEqual({ tone: 'concise', source: 'default' });
    expect(cleanToneSettings({ products: { flyer: 'factual' } })).toContain('unbekannt');
    expect(cleanToneSettings({ roles: { dealer: 'laut' } })).toContain('erlaubt sind');
    expect(cleanToneSettings({ roles: { all: 'factual' } })).toContain('unbekannt');

    // W-09: Reihenfolge von Releases
    expect(compareReleases('2026.10', '2026.9')).toBeGreaterThan(0);
    expect(compareReleases('PI 26.3', 'PI26.10')).toBeLessThan(0);
    expect(compareReleases('R12', '12')).toBe(0);
    expect(compareReleases('2026.1', '2026.1.1')).toBeLessThan(0);
    expect(compareReleases('2026.1-beta', '2026.1')).toBeLessThan(0);
    expect(isFutureContent('2026.4', '2026.3')).toBe(true);
    expect(isFutureContent('2026.3', '2026.3')).toBe(false);
    expect(isFutureContent('2026.4', null)).toBe(false);
    expect(isFutureContent(null, '2026.3')).toBe(false);

    // W-03: Einstufung
    expect(defaultTicketClass('Bug')).toBe('internal');
    expect(defaultTicketClass('Story')).toBe('review');
    expect(['approved', 'review', 'internal', 'background'].map((c) => ticketFeedsManual(c as any))).toEqual([true, true, false, false]);
    expect(ticketInLetter('internal', 'Bug')).toBe(true); // behobener Fehler
    expect(ticketInLetter('internal', 'Story')).toBe(false);
    expect(ticketInLetter('background', 'Bug')).toBe(false);

    // W-04: Letter aus dem Vergleich
    const d: ComparisonData = {
      from: { id: 'r1', version: '2026.2', createdAt: '2026-01-01' }, to: { id: 'r2', version: '2026.3', title: 'Handbuch', createdAt: '2026-03-01' },
      chapters: [{ chapterId: 'c1', title: 'Vertrag anlegen', change: 'updated', fromVersionNo: 1, toVersionNo: 2, summary: { added: 1, removed: 0, changed: 2, moved: 0 } }, { chapterId: 'c2', title: 'Vertrag pausieren', change: 'new', fromVersionNo: null, toVersionNo: 1, summary: null }],
      images: [{ sha: 'a'.repeat(64), title: 'Vertragsliste', change: 'version', versionNo: 2, fromVersionNo: 1, chapters: ['Vertrag anlegen'] }],
      functions: { added: [{ kind: 'subchapter', id: 's1', title: 'Pause anlegen', parentTitle: 'Vertrag pausieren', validFrom: '2026.3' }], superseded: [{ kind: 'subchapter', title: 'Pause erfassen', parentTitle: 'Vertrag pausieren', replacedByTitle: 'Pause anlegen', validUntil: '2026.3' }] },
      tickets: [{ key: 'ONESCM-1', summary: 'Pause anlegen', type: 'Story', status: 'Fertig' } as any],
    };
    const md = buildComparisonLetter(d, { language: 'de', audience: 'biz' });
    expect(md).toContain('# Releaseletter 2026.3');
    expect(md).toContain('Entwurf aus dem Projektvergleich Version 2026.2 → 2026.3');
    expect(md).toContain('1 neue Funktionen, 2 neue bzw. geänderte Kapitel, 1 geänderte Bilder, 1 abgelöste Funktionen.');
    expect(md).toContain('- **Pause anlegen** (Vertrag pausieren) – neu ab 2026.3');
    expect(md).toContain('- **Vertrag anlegen** – Version 1 → 2: 1 Absätze neu, 2 geändert');
    expect(md).toContain('- **Vertrag pausieren** – neues Kapitel');
    expect(md).toContain('- „Vertragsliste“ – neue Fassung (Fassung 1 → 2) (in „Vertrag anlegen“)');
    expect(md).toContain('- „Pause erfassen“ (Vertrag pausieren) – ersetzt durch „Pause anlegen“ · gültig bis 2026.3');
    expect(md).toContain('- Pause anlegen (ONESCM-1) – Story, Fertig');
    expect(buildComparisonLetter(d, { language: 'en', audience: 'end' })).toContain('- 1 × new version');
    expect(buildComparisonLetter({ ...d, from: null, chapters: [], images: [], functions: { added: [], superseded: [] }, tickets: [] }, { language: 'de', audience: 'biz' }))
      .toContain('Keine Änderungen gegenüber dem Vorgänger-Release.');
  });

  it('[T-320] Tonalität je Produktart und Rolle: Einstellung, Prüfung freier Texte und Kapitel, KI-Umformulierung mit Ton', async () => {
    const built = await build('tone');
    const call = client(built);
    try {
      const t0 = (await call('GET', '/style/tone', undefined, 'u-leser')).json;
      expect(t0.active).toBe(true);
      expect(t0.products.find((p: any) => p.product === 'manual')).toMatchObject({ tone: null, effective: 'factual', default: 'factual' });
      expect(t0.products.find((p: any) => p.product === 'releaseletter').effective).toBe('concise');
      expect(t0.roles.map((r: any) => r.role)).toEqual(['dealer', 'market', 'mo', 'hq']);
      expect(t0.tones.map((t: any) => t.label)).toEqual(['sachlich', 'freundlich', 'formell', 'knapp']);
      // ändern nur mit Administration; ungültige Werte abgelehnt
      expect((await call('PUT', '/style/rules', { tone: { products: { manual: 'formal' } } }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/style/rules', { tone: { products: { manual: 'laut' } } })).status).toBe(400);
      expect((await call('PUT', '/style/rules', { tone: { products: { manual: 'formal', training: 'friendly' }, roles: { dealer: 'friendly' } } })).json.tone)
        .toEqual({ products: { manual: 'formal', training: 'friendly' }, roles: { dealer: 'friendly' } });
      expect((await call('GET', '/style/tone')).json.products.find((p: any) => p.product === 'manual')).toMatchObject({ tone: 'formal', effective: 'formal' });

      // freie Prüfung: Produktart und Rolle wählen den Ton
      const text = 'Sie müssen den Antrag speichern, das gibt\'s auch als Vorlage.';
      const formal = (await call('POST', '/style/check', { text })).json;
      expect(formal.tone).toEqual({ tone: 'formal', label: 'formell' });
      expect(formal.rules.map((r: any) => r.rule)).toContain('tone');
      const dealer = (await call('POST', '/style/check', { text, roles: ['dealer'] })).json;
      expect(dealer.tone.tone).toBe('friendly');
      expect(dealer.sentences[0].issues.filter((i: any) => i.rule === 'tone').map((i: any) => i.message)).toEqual(['Ton „freundlich“: „Sie müssen“ wirkt streng – als Empfehlung formulieren („Bitte …“, „Wir empfehlen …“)']);
      expect((await call('POST', '/style/check', { text: 'Das geht einfach.', product: 'quickguide' })).json.tone.tone).toBe('concise');
      expect((await call('POST', '/style/check', { text: 'Das geht einfach.', product: 'flyer' })).status).toBe(400);
      // andere Sprachen ohne Ton
      expect((await call('POST', '/style/check', { text: 'This is simple.', language: 'en' })).json.tone).toBeNull();

      // Kapitel: Ton je Absatz nach Rolle
      const ch = await chapter(call, 'Vertrag anlegen', { purpose: 'Sie müssen den Vertrag anlegen, das gibt\'s für jede Sparte.' });
      const check = (await call('GET', `/style/chapter-versions/${ch.versionId}`)).json;
      expect([...new Set(check.blocks.map((b: any) => b.tone))]).toEqual(['formal']);
      expect(check.blocks.flatMap((b: any) => b.analysis.sentences.flatMap((s: any) => s.issues)).some((i: any) => i.rule === 'tone')).toBe(true);

      // Ton ausschalten über die Regel „tone“
      await call('PUT', '/style/rules', { disabled: ['tone'] });
      expect((await call('GET', '/style/tone')).json.active).toBe(false);
      expect((await call('POST', '/style/check', { text })).json.tone).toBeNull();
      await call('PUT', '/style/rules', { disabled: [] });

      // KI-Umformulierung: Ton geht mit in die Anfrage
      const rw = (await call('POST', '/style/rewrite', { text: 'Das Formular wurde gespeichert.', roles: ['dealer'] }, 'u-redaktion')).json;
      expect(rw.tone).toBe('friendly');
      // Export/Import der Regeln enthält den Ton
      const exp = JSON.parse((await call('GET', '/style/rules/export?format=json')).body);
      expect(exp.tone.roles).toEqual({ dealer: 'friendly' });
    } finally {
      await built.app.close();
    }
  });

  it('[T-321] Ticket-Einstufung: genehmigt, in Prüfung, intern, Background – Lückenanalyse, Releaseletter, Generierung ohne interne Tickets', async () => {
    const built = await build('tickets');
    const call = client(built);
    const head = 'Summary,Issue key,Issue Type,Status,Priority,Component/s,Fix Version/s,Labels,Created,Description';
    const rows = [
      '"Vertrag pausieren",ONESCM-201,Story,Fertig,High,Verträge,PI20,,2026-02-05T10:00:00.000+0100,"Der Vertrag kann im Menü Verträge pausiert werden."',
      '"Absturz behoben",ONESCM-202,Bug,Fertig,Medium,Verträge,PI20,,2026-02-07T10:00:00.000+0100,"Die interne Datenbankmigration löscht alte Pausen."',
      '"Migration Altdaten",ONESCM-203,Story,Fertig,Low,Verträge,PI20,,2026-02-08T10:00:00.000+0100,"Die Migration der Altdaten läuft nachts im Hintergrund."',
    ];
    try {
      await importFile(built, 'tickets.csv', Buffer.from([head, ...rows].join('\n')));
      const list = async () => (await call('GET', '/ticket-releases', undefined, 'u-leser')).json;
      const r0 = await list();
      const t = (r: any, k: string) => r.tickets.find((x: any) => x.key === k);
      expect(t(r0, 'ONESCM-201')).toMatchObject({ classification: 'review', classificationLabel: 'in Prüfung', classificationOrigin: 'derived', gap: true });
      expect(t(r0, 'ONESCM-202')).toMatchObject({ classification: 'internal', classificationOrigin: 'derived', gap: false });
      expect(r0.ticketClassLabels).toEqual({ approved: 'genehmigt', review: 'in Prüfung', internal: 'intern', background: 'Background' });

      // Einstufen: Entscheidung (decide); unbekannte Tickets und Werte abgelehnt
      expect((await call('PUT', '/ticket-classifications', { keys: ['ONESCM-201'], classification: 'approved' }, 'u-redaktion')).status).toBe(403);
      expect((await call('PUT', '/ticket-classifications', { keys: ['ONESCM-999'], classification: 'approved' }, 'u-fachpruefung')).status).toBe(404);
      expect((await call('PUT', '/ticket-classifications', { keys: ['ONESCM-201'], classification: 'wichtig' }, 'u-fachpruefung')).status).toBe(400);
      expect((await call('PUT', '/ticket-classifications', { keys: ['onescm-201'], classification: 'approved' }, 'u-fachpruefung')).json).toEqual({ keys: ['ONESCM-201'], classification: 'approved', label: 'genehmigt' });
      expect((await call('PUT', '/ticket-classifications', { keys: ['ONESCM-203'], classification: 'background', note: 'nur Hintergrund' }, 'u-fachpruefung')).status).toBe(200);
      const r1 = await list();
      expect(t(r1, 'ONESCM-201')).toMatchObject({ classification: 'approved', classificationOrigin: 'manual', classifiedBy: 'u-fachpruefung' });
      // Background bleibt in der Lückenanalyse
      expect(t(r1, 'ONESCM-203')).toMatchObject({ classification: 'background', classificationNote: 'nur Hintergrund', gap: true });

      // Releaseletter: Background entfällt, der Bug bleibt als behobener Fehler
      const letter = (await call('POST', '/release-letters', { release: 'PI20' }, 'u-redaktion')).json;
      expect(letter.ticketKeys).toEqual(['ONESCM-201', 'ONESCM-202']);
      expect(letter.text).not.toContain('ONESCM-203');
      await call('PUT', '/ticket-classifications', { keys: ['ONESCM-201', 'ONESCM-202'], classification: 'background' }, 'u-fachpruefung');
      expect((await call('POST', '/release-letters', { keys: ['ONESCM-201', 'ONESCM-203'] }, 'u-redaktion')).status).toBe(400);
      // zurück auf abgeleitet
      await call('PUT', '/ticket-classifications', { keys: ['ONESCM-201'], classification: 'approved' }, 'u-fachpruefung');
      await call('PUT', '/ticket-classifications', { keys: ['ONESCM-202'], classification: null }, 'u-fachpruefung');
      expect(t(await list(), 'ONESCM-202')).toMatchObject({ classification: 'internal', classificationOrigin: 'derived' });

      // Generierung: Abschnitte aus internen und Background-Tickets fließen nicht ins Kapitel
      await built.ctx.db.run(
        "UPDATE text_snippets SET evidence_status = 'source_confirmed' WHERE revision_id IN (SELECT id FROM source_revisions WHERE source_format = 'jira')",
      );
      const chapterId = (await call('GET', '/chapters')).json.find((c: any) => c.title === 'Jira-Tickets').id;
      const v = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
      const text = v.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text)).join('\n');
      expect(text).toContain('pausiert');
      expect(text).not.toContain('Datenbankmigration');
      expect(text).not.toContain('Altdaten');
      expect(v.generation.excludedByTicket).toBeGreaterThan(0);
    } finally {
      await built.app.close();
    }
  });

  it('[T-322] Zukunfts-Inhalte im Export und Release; Projektvergleich zweier Releases und Releaseletter-Entwurf daraus', async () => {
    const built = await build('comparison');
    const call = client(built);
    try {
      const a = await chapter(call, 'Vertrag anlegen');
      const r1 = (await call('POST', '/releases', { version: '2026.2' }, 'u-freigabe')).json;
      expect(r1.future).toEqual([]);

      // neues Kapitel ab 2026.3, eines erst ab 2026.4 (Zukunfts-Inhalt), Unterkapitel abgelöst
      const c = await chapter(call, 'Vertrag pausieren');
      const b = await chapter(call, 'Vertrag übertragen');
      await call('PATCH', `/structure/chapters/${c.chapterId}`, { validFrom: '2026.3' }, 'u-redaktion');
      await call('PATCH', `/structure/chapters/${b.chapterId}`, { validFrom: '2026.4' }, 'u-redaktion');
      const sub = (await call('POST', `/structure/chapters/${a.chapterId}/subchapters`, { title: 'Pause erfassen' }, 'u-redaktion')).json;
      expect((await call('POST', '/structure/replace', { kind: 'subchapter', id: sub.id, newTitle: 'Pause anlegen', validFrom: '2026.3' }, 'u-redaktion')).status).toBe(200);

      // Export: Stand 2026.3 blendet das Kapitel ab 2026.4 aus; ohne Stand bleibt alles
      const ex = (await call('POST', '/exports', { format: 'md', asOf: '2026.3' }, 'u-leser')).json;
      expect(ex.future).toEqual([{ chapterId: b.chapterId, title: 'Vertrag übertragen', validFrom: '2026.4' }]);
      expect(ex.asOf).toBe('2026.3');
      expect(ex.preview).not.toContain('Vertrag übertragen');
      expect(ex.preview).toContain('Vertrag pausieren');
      expect((await call('POST', '/exports', { format: 'md' }, 'u-leser')).json).toMatchObject({ future: [], asOf: null });
      // der Release-Filter gilt als Stand
      expect((await call('POST', '/exports', { format: 'md', release: '2026.3' }, 'u-leser')).json.future).toHaveLength(1);

      // Release 2026.3: Kapitel ab 2026.4 kommt nicht hinein
      const r2 = (await call('POST', '/releases', { version: '2026.3' }, 'u-freigabe')).json;
      expect(r2.future.map((f: any) => f.title)).toEqual(['Vertrag übertragen']);
      expect(r2.chapters.map((x: any) => x.title).sort()).toEqual(['Vertrag anlegen', 'Vertrag pausieren']);

      // Tickets mit Lösungsversion 2026.3
      const head = 'Summary,Issue key,Issue Type,Status,Fix Version/s,Created,Description';
      await importFile(built, 'tickets.csv', Buffer.from([head,
        '"Vertrag pausieren",ONESCM-301,Story,Fertig,2026.3,2026-02-05T10:00:00.000+0100,"Pausieren."',
        '"Migration",ONESCM-302,Story,Fertig,2026.3,2026-02-06T10:00:00.000+0100,"Hintergrund."',
        '"Später",ONESCM-303,Story,Fertig,2026.4,2026-02-06T10:00:00.000+0100,"Später."'].join('\n')));
      await call('PUT', '/ticket-classifications', { keys: ['ONESCM-302'], classification: 'background' }, 'u-fachpruefung');

      // Vergleich: neue Kapitel, neue Funktionen (gültig ab), abgelöste Funktionen, Tickets
      const cmp = (await call('GET', `/releases/${r2.id}/comparison`, undefined, 'u-leser')).json;
      expect(cmp.from).toMatchObject({ id: r1.id, version: '2026.2' });
      expect(cmp.chapters.map((x: any) => [x.title, x.change])).toEqual([['Vertrag pausieren', 'new']]);
      expect(cmp.functions.added.map((f: any) => [f.kind, f.title])).toEqual([['chapter', 'Vertrag pausieren'], ['subchapter', 'Pause anlegen']]);
      expect(cmp.functions.superseded).toEqual([{ kind: 'subchapter', title: 'Pause erfassen', parentTitle: 'Vertrag anlegen', replacedByTitle: 'Pause anlegen', validUntil: '2026.3' }]);
      expect(cmp.tickets.map((x: any) => x.key)).toEqual(['ONESCM-301']);
      expect(cmp.images).toEqual([]);
      expect((await call('GET', `/releases/${r1.id}/comparison?from=${r2.id}`)).status).toBe(400);
      expect((await call('GET', '/releases/rel_unbekannt/comparison')).status).toBe(404);
      // erstes Release ohne Vorgänger: alles neu
      expect((await call('GET', `/releases/${r1.id}/comparison`)).json).toMatchObject({ from: null, chapters: [{ title: 'Vertrag anlegen', change: 'new' }] });

      // Letter-Entwurf daraus: Bearbeitungsrecht, Herkunft „comparison“, geprüft gegen die Tickets
      expect((await call('POST', '/release-letters/from-comparison', { releaseId: r2.id }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/release-letters/from-comparison', {}, 'u-redaktion')).status).toBe(400);
      const letter = (await call('POST', '/release-letters/from-comparison', { releaseId: r2.id, language: 'de', audience: 'end' }, 'u-redaktion'));
      expect(letter.status).toBe(201);
      expect(letter.json).toMatchObject({ origin: 'comparison', release: '2026.3', ticketKeys: ['ONESCM-301'], status: 'draft', comparison: { fromVersion: '2026.2', toVersion: '2026.3', chapters: 1, added: 2, superseded: 1, tickets: 1 } });
      expect(letter.json.text).toContain('- **Vertrag pausieren** – neu ab 2026.3');
      expect(letter.json.text).toContain('„Pause erfassen“ (Vertrag anlegen) – ersetzt durch „Pause anlegen“');
      expect(letter.json.text).toContain('(ONESCM-301)');
      expect(letter.json.text).not.toContain('ONESCM-302');
      expect(letter.json.check.findings.filter((f: any) => f.rule === '11')).toEqual([]);
      const en = (await call('POST', '/release-letters/from-comparison', { releaseId: r2.id, fromReleaseId: r1.id, language: 'en' }, 'u-redaktion')).json;
      expect(en.text).toContain('# Release letter 2026.3');
      expect((await call('GET', '/release-letters')).json.filter((l: any) => l.origin === 'comparison')).toHaveLength(2);
    } finally {
      await built.app.close();
    }
  });
});
