import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { analyzeStyle } from '../src/domain/style.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const fm = (roles = 'all', extra = '') => `---\nroles: [${roles}]\ndivisions: [all]\nevidence_status: source_confirmed\n${extra}---\n`;

describe('Etappe 97', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' }));

  it('[T-422] Varianten-Export mit leerer Rollenauswahl, Befunde an der Gliederungsversion, Übersetzungsstand ohne Variantenkapitel, doppelte Schnipsel beim Abgleich', async () => {
    const built = await build('e97a');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${fm()}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldung öffnet oneSCM für alle Nutzer.\n\n## 1.2 Schritte\n\nDer Nutzer meldet sich mit seinem DMS-Konto an.\n`);
      await importFile(built, 'hq.md', `${fm('hq')}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Zentrale prüft die Anmeldung im Hauptmenü.\n`);
      const outline = (await call('POST', '/outlines', { name: 'Händlerhandbuch', roles: ['dealer'], content: '# Anmeldung\n## Zweck\n## Schritte\n', format: 'markdown' })).json;
      await call('POST', `/outlines/${outline.id}/auto-assign`, {});
      const gen = (await call('POST', `/outlines/${outline.id}/generate`, {}, 'u-redaktion')).json;
      const chapterId = gen.results[0].chapterId;
      const v = (await call('GET', `/chapters/${chapterId}`)).json.versions[0];
      for (const b of (await call('GET', `/chapter-versions/${v.id}`)).json.sections.flatMap((s: any) => s.blocks)) if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
      expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);

      // Export der Variante: ohne Häkchen schickt die Oberfläche roles: [] – es gilt der Rollenfilter der Variante
      const exp = (await call('POST', '/exports', { format: 'md', outlineId: outline.id, roles: [], divisions: [] })).json;
      const md = (await call('GET', `/exports/${exp.id}/download`)).body as string;
      expect(md).toContain('Die Anmeldung öffnet oneSCM');
      expect(md).not.toContain('Die Zentrale prüft');

      // Übersetzungsstand: Variantenkapitel zählen nicht mit (Leseransicht und Variantenhandbuch sind deutsch)
      await call('PATCH', '/projects/p_default', { languages: ['en'] });
      expect((await call('GET', '/dashboard')).json.translations[0]).toMatchObject({ language: 'en', chapters: 0, missing: 0 });

      // neue Gliederungsversion ohne den HQ-Schnipsel: Befunde an dieser Version messen, nicht an der des Kapitels
      const hqSnippet = (await call('GET', `/outlines/${outline.id}/candidates?q=Zentrale`)).json.items[0]
        ?? (await built.ctx.db.get<any>("SELECT id FROM text_snippets WHERE text LIKE '%Zentrale%'"));
      await built.ctx.db.run(
        `INSERT INTO quality_findings (id, seq, project_id, type, subtype, severity, status, snippet_a_id, method, reason, fingerprint, created_at)
         VALUES ('qf_e97', 99701, 'p_default', 'gap', 'test', 'high', 'open', ?, 'test', 'Test', 'fp_e97', ?)`, hqSnippet.id, new Date().toISOString(),
      );
      expect((await call('GET', `/outlines/${outline.id}/chapters`)).json.chapters[0].openFindings).toBe(1);
      const v2 = (await call('POST', `/outlines/${outline.id}/versions`, {})).json;
      expect((await call('DELETE', `/outlines/${v2.id}/assignments/${hqSnippet.id}`)).status).toBe(204);
      const at2 = (await call('GET', `/outlines/${v2.id}/chapters`)).json.chapters[0];
      expect(at2.snippetCount).toBe(2);
      expect(at2.openFindings).toBe(0);

      // Abgleich: derselbe Schnipsel doppelt in der Anfrage wird einmal zugeordnet (statt 500)
      const pv = (await call('GET', `/outlines/${v2.id}/sync?from=${outline.id}`)).json;
      const zweck = pv.entries.find((e: any) => e.title === 'Zweck');
      expect(zweck.onlySource.map((x: any) => x.id)).toEqual([hqSnippet.id]);
      const res = await call('POST', `/outlines/${v2.id}/sync`, { from: outline.id, add: [{ sourceNodeId: zweck.sourceNodeId, snippetIds: [hqSnippet.id, hqSnippet.id] }, { sourceNodeId: zweck.sourceNodeId, snippetIds: [hqSnippet.id] }] });
      expect(res.status, JSON.stringify(res.json)).toBe(200);
      expect(res.json.added).toBe(1);
    } finally {
      await built.app.close();
    }
  });

  it('[T-423] Gesperrte Benutzer nicht mehr als Beteiligte, Nominalstil auch mit Umlaut am Wortanfang', async () => {
    // Nominalstil: Änderung, Übertragung, Überprüfung beginnen mit Umlaut
    expect(analyzeStyle('Die Änderung, Übertragung und Überprüfung der Daten erfolgt im Lager.').counts.nominal).toBe(1);
    expect(analyzeStyle('Die Prüfung, Übertragung und Änderung der Daten erfolgt im Lager.').sentences[0].issues.find((i: any) => i.rule === 'nominal')?.message).toContain('Prüfung, Übertragung, Änderung');

    const built = await build('e97b');
    const call = client(built);
    try {
      expect((await call('GET', '/collaborators')).json.map((u: any) => u.id)).toContain('u-fachpruefung');
      expect((await call('PATCH', '/users/u-fachpruefung', { disabled: true })).status).toBe(200);
      expect((await call('GET', '/collaborators')).json.map((u: any) => u.id)).not.toContain('u-fachpruefung');
    } finally {
      await built.app.close();
    }
  });
});
