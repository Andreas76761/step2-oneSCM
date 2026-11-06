import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { detectContradictions, type Statement } from '../src/domain/contradictions.js';
import { generateChapter, type GenSnippet } from '../src/domain/generator.js';
import { parseMarkdown } from '../src/domain/markdown.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const st = (id: string, text: string): Statement => ({ id, text, roles: ['all'], divisions: ['all'], market: null, release: null, documentId: id, revisionNo: 1, isCurrentRevision: true, path: `${id}.md` });
const gen = (id: string, market: string | null): GenSnippet => ({
  id, seq: 1, text: 'Der Auftrag wird im Menü Aufträge angelegt.', kind: 'paragraph', evidenceStatus: 'source_confirmed', subchapterTitle: 'Schritte', headingPath: [], order: id === 'fr' ? 1 : 2,
  normHash: 'h1', roles: [{ code: 'all', evidenceStatus: 'source_confirmed' }], divisions: [{ code: 'all', evidenceStatus: 'source_confirmed' }], market, release: null, scopeStatus: 'confirmed', sourceLabel: `${id}.md`,
});

describe('Etappe 99', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' }));

  it('[T-426] Regeln: Zahl vor dem Satzpunkt, Frist nur mit Einheit, Dopplung je Markt, Codeblock bis zur echten Schlusszeile', () => {
    // Zahlenwert am Satzende wird verglichen
    expect(detectContradictions(st('a', 'Die Bearbeitungsgebühr für den Auftrag beträgt 50.'), st('b', 'Die Bearbeitungsgebühr für den Auftrag beträgt 60.')).map((h) => h.rule)).toContain('number');
    // „Tagesbericht“ ist keine Frist; „3 Tage“ bleibt eine
    expect(detectContradictions(st('a', 'Erstellen Sie 2 Tagesberichte.'), st('b', 'Erstellen Sie 3 Tagesberichte.')).map((h) => h.rule)).not.toContain('deadline');
    expect(detectContradictions(st('a', 'Die Frist beträgt 3 Tage.'), st('b', 'Die Frist beträgt 5 Tage.')).map((h) => h.rule)).toContain('deadline');

    // gleiche Aussage für FR und IT: zwei Absätze, je mit ihrem Markt
    const steps = generateChapter('Aufträge', [gen('fr', 'FR'), gen('it', 'IT')]).blocks.filter((b) => b.section === 'steps');
    expect(steps.map((b) => b.market)).toEqual(['FR', 'IT']);
    // gleicher Markt: weiter zusammengeführt
    expect(generateChapter('Aufträge', [gen('fr', 'FR'), { ...gen('it', 'FR') }]).deduplicated).toBe(1);

    // Codeblock: „```js“ und eingerücktes „    ```“ beenden ihn nicht
    const doc = parseMarkdown('# 1. A\n\n```\n```js\nx = 1\n    ```\n## nicht\n```\n\nDanach.\n');
    expect(doc.blocks.map((b) => b.kind)).toEqual(['code', 'paragraph']);
    expect(doc.headings.map((h) => h.title)).toEqual(['1. A']);
  });

  it('[T-427] Analyse ohne ausgeschlossene Aussagen, Begriffe mit Umlaut, entfernte Wissensnotiz, Klassifikation prüft Typen', async () => {
    const built = await build('e99');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${FM}# 1. Aufträge\n\n## 1.1 Freigabe\n\nDie Freigabe des Auftrags ist für den Händler verpflichtend und erfolgt im Menü Aufträge unter Freigeben.\n`);
      await importFile(built, 'b.md', `${FM}# 1. Aufträge\n\n## 1.1 Freigabe\n\nDie Freigabe des Auftrags ist für den Händler optional und erfolgt im Menü Aufträge unter Freigeben. Rückfragen an max.muster@autohaus-muster.de.\n`);
      await call('POST', '/terminology', { preferred: 'Gesamtansicht', avoid: ['Übersicht'] });
      await importFile(built, 'c.md', `${FM}# 2. Berichte\n\n## 2.1 Zweck\n\nDie Übersicht zeigt alle offenen Berichte.\n`);
      const analyse = async () => {
        expect((await call('POST', '/quality/analysis', {}, 'u-redaktion')).status).toBe(202);
        await built.ctx.jobs.idle();
        return (await call('GET', '/quality/findings')).json as any[];
      };
      let findings = await analyse();
      // Begriff mit Umlaut am Wortanfang wird gefunden
      expect(findings.some((f) => f.type === 'terminology' && f.details.term === 'Übersicht')).toBe(true);
      const contra = findings.find((f) => f.type === 'contradiction');
      const privacy = findings.find((f) => f.type === 'privacy');
      expect(contra).toBeTruthy();
      expect(privacy?.a.text).toContain('optional');
      // A übernehmen → B ausgeschlossen; B erzeugt danach keine offenen Befunde mehr (Datenschutz-Blocker entfällt)
      const keep = contra.a.text.includes('verpflichtend') ? 'take_a' : 'take_b';
      expect((await call('POST', `/quality/findings/${contra.id}/decision`, { decision: keep, reason: 'Pflicht laut Fachbereich' }, 'u-fachpruefung')).status).toBe(200);
      findings = await analyse();
      expect(findings.filter((f) => f.type === 'privacy' && f.status === 'open')).toEqual([]);

      // entfernte Wissensnotiz: keine aktuelle Revision mehr (wie beim Import entfernte Dateien)
      const note = (await call('POST', '/knowledge-notes', { question: 'Wie storniere ich einen Vertrag nach der Aktivierung?', insight: 'In der Vertragsverwaltung über Beenden.' }, 'u-redaktion')).json;
      expect((await call('DELETE', `/knowledge-notes/${note.id}`, undefined, 'u-redaktion')).status).toBe(204);
      const current = await built.ctx.db.get<any>(
        'SELECT COUNT(*) AS n FROM source_revisions r JOIN source_documents d ON d.id = r.document_id WHERE d.path = ? AND r.is_current = 1', note.path,
      );
      expect(Number(current!.n)).toBe(0);

      // Klassifikation: Typen geprüft, Markt in Großbuchstaben
      const snippet = (await call('GET', '/snippets?q=Berichte')).json.items[0];
      expect((await call('PATCH', `/snippets/${snippet.id}`, { roles: 'dealer' }, 'u-redaktion')).status).toBe(400);
      expect((await call('PATCH', `/snippets/${snippet.id}`, { market: 7 }, 'u-redaktion')).status).toBe(400);
      expect((await call('PATCH', `/snippets/${snippet.id}`, { market: ' fr ' }, 'u-redaktion')).json.market).toBe('FR');
      expect((await call('GET', '/snippets?market=FR')).json.items.map((s: any) => s.id)).toEqual([snippet.id]);
    } finally {
      await built.app.close();
    }
  });
});
