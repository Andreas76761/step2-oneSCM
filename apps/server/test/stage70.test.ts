import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { LABEL_GROUPS } from '../src/domain/metadataLabels.js';
import { DIVISIONS, ROLES } from '../src/domain/reference.js';
import { approveChapter, client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

// Bildzeichen (Emoji, Piktogramme) – Pfeile und einfache Textzeichen sind nicht gemeint
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{1F000}-\u{1F2FF}]/u;
const CHAPTER = `---\nroles: [hq, dealer]\ndivisions: [truck]\nevidence_status: source_confirmed\n---\n# 6. Preise pflegen\n\n## 6.1 Zweck\n\nHQ pflegt Preislisten zentral.\n\n## 6.2 Schritte\n\n1. Öffnen Sie **Produkte › Preislisten**.\n`;

describe('Etappe 70', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-387] Rollen, Sparten und Label-Gruppen mit Lucide-Icons statt Emoji; Kapiteltext und Exporte nennen nur den Namen', async () => {
    for (const x of [...ROLES, ...DIVISIONS, ...LABEL_GROUPS]) expect(x.icon, x.code).toMatch(/^[a-z][a-z0-9-]*$/);

    const database = await freshDatabase(dataDir, 'icons');
    const built = await buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any);
    const call = client(built);
    try {
      // Stammdaten über die API (auch nach dem Upsert beim Start aus einer bestehenden Datenbank)
      const ref = (await call('GET', '/reference')).json;
      expect(ref.roles.find((r: any) => r.code === 'hq').icon).toBe('building-2');
      expect(ref.divisions.find((d: any) => d.code === 'van').icon).toBe('van');
      expect(EMOJI.test(JSON.stringify(ref))).toBe(false);
      expect(EMOJI.test(JSON.stringify((await call('GET', '/metadata/label-groups')).json ?? ''))).toBe(false);

      await importFile(built, 'p.md', CHAPTER);
      const v = await approveChapter(call, (await call('GET', '/chapters')).json[0].id);
      const text = v.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text)).join('\n');
      expect(text).toMatch(/- HQ \(zentrale Produkt-, Preis- und Systempflege\)/);
      expect(EMOJI.test(text)).toBe(false);

      const md = (await call('POST', '/exports', { format: 'md' }, 'u-redaktion')).json.preview as string;
      expect(md).toContain('> Dealer · HQ · Truck');
      expect(EMOJI.test(md)).toBe(false);
    } finally {
      await built.app.close();
    }
  });
});
