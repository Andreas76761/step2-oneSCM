import fs from 'node:fs';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { buildRewritePrompt } from '../src/domain/rewrite.js';
import { analyzeStyle, inUiContext } from '../src/domain/style.js';
import { client, uploadFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const MO = [{ preferred: 'MO-Prüfungen', avoid: ['MO Checks'], uiAllowed: true }];
const terminology = (text: string, terms = MO) => analyzeStyle(text, { terms }).sentences.flatMap((s) => s.issues).filter((i) => i.rule === 'terminology').map((i) => text.slice(i.start, i.end));

describe('Etappe 57', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-354] UI-Begriff: „MO Checks“ im Fließtext gemeldet, in Menüpfad und Anführungszeichen erlaubt; ohne Merkmal überall gemeldet (Einheit)', () => {
    const at = (text: string, word: string) => inUiContext(text, text.indexOf(word), text.indexOf(word) + word.length);
    expect(at('Öffnen Sie **Vertragserstellung › MO Checks**.', 'MO Checks')).toBe(true);
    expect(at('Öffnen Sie Vertragserstellung › MO Checks.', 'MO Checks')).toBe(true);
    expect(at('Die Maske MO Checks › Übersicht zeigt alles.', 'MO Checks')).toBe(true);
    expect(at('Klicken Sie auf „MO Checks“.', 'MO Checks')).toBe(true);
    expect(at('Klicken Sie auf "MO Checks".', 'MO Checks')).toBe(true);
    expect(at('Die MO Checks laufen nachts.', 'MO Checks')).toBe(false);
    // ein Menüpfad früher im Satz macht den Fließtext danach nicht zum UI-Kontext
    expect(at('Öffnen Sie Versand › Sendungen und starten Sie die MO Checks.', 'MO Checks')).toBe(false);
    expect(at('Unter **Versand** starten Sie die MO Checks.', 'MO Checks')).toBe(false);

    expect(terminology('Die MO Checks laufen nachts. Öffnen Sie **Vertragserstellung › MO Checks**. Der Reiter heißt „MO Checks“.')).toEqual(['MO Checks']);
    expect(terminology('Öffnen Sie **Vertragserstellung › MO Checks**.', [{ preferred: 'MO-Prüfungen', avoid: ['MO Checks'], uiAllowed: false }])).toEqual(['MO Checks']);
    // Korrektur bleibt die bevorzugte Form
    const fix = analyzeStyle('Die MO Checks laufen nachts.', { terms: MO }).sentences[0].issues.find((i) => i.rule === 'terminology')!.fix;
    expect(fix).toMatchObject({ replacement: 'MO-Prüfungen' });

    // KI-Umformulierung: Hinweis nur bei UI-Begriffen, sonst unverändert
    const base = { kind: 'paragraph', section: 'steps', text: 'x', sources: [], terms: [{ preferred: 'Freigabe', avoid: ['Approval'] }] } as any;
    expect(buildRewritePrompt(base).user).not.toContain('avoidAllowedIn');
    expect(buildRewritePrompt({ ...base, terms: MO }).user).toContain('"avoidAllowedIn": "Menüpfade (›) und Anführungszeichen"');
  });

  it('[T-355] Terminologie: Merkmal „UI-Begriff erlaubt“ pflegen, Wirkung in der Stilprüfung, SYNONYME.csv übernehmen (nur entschiedene Zeilen)', async () => {
    const built = await build('ui');
    const call = client(built);
    try {
      const created = await call('POST', '/terminology', { preferred: 'MO-Prüfungen', avoid: ['MO Checks'] }, 'u-redaktion');
      expect(created.status).toBe(201);
      expect(created.json).toMatchObject({ uiAllowed: false });
      const text = 'Die MO Checks laufen nachts. Öffnen Sie **Vertragserstellung › MO Checks**.';
      const count = async () => (await call('POST', '/style/check', { text })).json.counts.terminology;
      expect(await count()).toBe(2);
      expect((await call('PATCH', `/terminology/${created.json.id}`, { uiAllowed: true }, 'u-redaktion')).json).toMatchObject({ uiAllowed: true, avoid: ['MO Checks'] });
      expect(await count()).toBe(1);
      expect((await call('GET', '/terminology')).json.find((t: any) => t.preferred === 'MO-Prüfungen').uiAllowed).toBe(true);
      // andere Änderungen lassen das Merkmal stehen
      await call('PATCH', `/terminology/${created.json.id}`, { definition: 'Prüfung und Freigabe durch Market Operation' }, 'u-redaktion');
      expect(await count()).toBe(1);

      // Vorlage SYNONYME.csv aus dem Arbeitsordner: entschiedene Zeile übernehmen, offene überspringen
      const csv = fs.readFileSync(path.resolve(__dirname, '../../../tools/handbuch-ordner/vorlagen/SYNONYME.csv'));
      const preview = await uploadFile(built, '/master-data/import?kind=glossary', 'SYNONYME.csv', csv, 'u-redaktion');
      expect(preview.status).toBe(200);
      expect(preview.json.summary).toMatchObject({ skipped: 8, error: 0 });
      expect(preview.json.rows.find((r: any) => r.key === 'MO-Prüfungen')).toMatchObject({ action: 'update' });
      expect(preview.json.rows.find((r: any) => r.key.startsWith('Nemesis'))).toMatchObject({ action: 'skipped', message: expect.stringContaining('Status „offen“') });
      const applied = await uploadFile(built, '/master-data/import?kind=glossary&apply=true', 'SYNONYME.csv', csv, 'u-redaktion');
      expect(applied.json.summary).toMatchObject({ update: 1, skipped: 8 });
      const mo = (await call('GET', '/terminology')).json.find((t: any) => t.preferred === 'MO-Prüfungen');
      expect(mo).toMatchObject({ uiAllowed: true, avoid: ['MO Checks', 'Marktprüfung'] });
      expect((await call('GET', '/terminology')).json.some((t: any) => /Nemesis|Karenzzeit/.test(t.preferred))).toBe(false);
      // gleicher Stand: unverändert
      expect((await uploadFile(built, '/master-data/import?kind=glossary', 'SYNONYME.csv', csv, 'u-redaktion')).json.summary).toMatchObject({ unchanged: 1 });
      // Spalte „UI-Begriff erlaubt“ leer → Merkmal aus
      const off = Buffer.from('Bevorzugt;Vermeiden;Status;UI-Begriff erlaubt\nMO-Prüfungen;MO Checks, Marktprüfung;entschieden;\n');
      expect((await uploadFile(built, '/master-data/import?kind=glossary&apply=true', 'x.csv', off, 'u-redaktion')).json.summary).toMatchObject({ update: 1 });
      expect(await count()).toBe(2);
    } finally {
      await built.app.close();
    }
  });
});
