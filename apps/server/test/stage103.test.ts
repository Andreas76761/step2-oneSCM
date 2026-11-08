// Etappe 103: Code-Review der Korrekturen aus den Etappen 95 und 96
import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { DEMO_USERS } from '../src/domain/reference.js';
import { listDuplicates } from '../src/services/metadataDuplicates.js';
import { withProject } from '../src/services/projects.js';
import { relatedForVersions, setChapterLinks } from '../src/services/reader.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const chapter = (no: number, title: string, text: string) => `${FM}# ${no}. ${title}\n\n## ${no}.1 Zweck\n\n${text}\n`;
const LONG = 'Sie erfassen Serviceverträge für Fahrzeuge im Menü Verträge und senden sie zur Prüfung an die Marktorganisation. Die Prüfung dauert in der Regel zwei Arbeitstage, danach erhalten Sie eine Nachricht im Postfach.';

describe('Etappe 103', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));

  it('[T-438] Online-Hilfe: gepflegte Verweise wirken sofort, nicht erst nach Ablauf des Zwischenspeichers', async () => {
    const built = await build('e103a');
    const call = client(built);
    try {
      await importFile(built, 'a.md', chapter(4, 'Verträge', 'Sie erfassen Verträge im Menü Verträge.'));
      await importFile(built, 'b.md', chapter(5, 'Wartung', 'Sie planen die Wartung im Menü Werkstatt.'));
      const chapters = (await call('GET', '/chapters')).json;
      const [a, b] = ['4. Verträge', '5. Wartung'].map((t) => chapters.find((c: any) => c.title === t).id);
      const versions = [(await approveChapter(call, a)).id, (await approveChapter(call, b)).id];
      const ctx = withProject(built.ctx, 'p_default');
      expect((await relatedForVersions(ctx, versions, a, 'de')).manual).toEqual([]);
      const user = { ...DEMO_USERS.find((u) => u.id === 'u-redaktion')!, permissions: ['read', 'edit'] };
      await setChapterLinks(ctx, a, { manual: [b] }, user as any);
      expect((await relatedForVersions(ctx, versions, a, 'de')).manual.map((m: any) => m.chapterId)).toEqual([b]);
    } finally {
      await built.app.close();
    }
  });

  it('[T-439] Dubletten über alle Formate: fehlen die Abschnitte später (z. B. nach dem Zurückspielen einer Sicherung), werden sie neu aufgebaut', async () => {
    const built = await build('e103b');
    try {
      await importFile(built, 'a.md', chapter(4, 'Verträge', LONG));
      await importFile(built, 'b.md', chapter(6, 'Verträge erfassen', LONG));
      const ctx = withProject(built.ctx, 'p_default');
      expect((await listDuplicates(ctx)).items.length).toBeGreaterThan(0);
      await built.ctx.db.run('DELETE FROM metadata_duplicates');
      await built.ctx.db.run('DELETE FROM metadata_sections');
      expect((await listDuplicates(ctx)).items.length).toBeGreaterThan(0);
    } finally {
      await built.app.close();
    }
  });
});
