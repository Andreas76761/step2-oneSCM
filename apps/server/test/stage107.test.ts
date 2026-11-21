// Etappe 107: Code-Review der aus main übernommenen Etappe 27 (FAQ-Stapelübersetzung, Wunsch mit Begründung, Wochenübersicht)
import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { sendDigests } from '../src/services/digest.js';
import { failFaqBatch } from '../src/services/faqTranslations.js';
import { withProject } from '../src/services/projects.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 107', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-447] FAQ-Stapelübersetzung endgültig gescheitert: Hinweis an die auftraggebende Person; Wochenübersicht mit nur veralteten FAQ verlinkt die FAQ-Pflege', async () => {
    const built = await freshDatabase(dataDir, 'e107a').then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' } as any));
    const call = client(built);
    const ctx = withProject(built.ctx, 'p_default');
    try {
      await call('PATCH', '/projects/p_default', { languages: ['en'] });
      // gescheiterter Auftrag (z. B. nach den Wiederholungen der Jobqueue)
      await built.ctx.db.run("INSERT INTO faq_translation_batches (id, project_id, language, status, total, done, faq_ids, created_by, created_at) VALUES ('fqb_x', 'p_default', 'en', 'processing', 4, 1, '[]', 'u-redaktion', '2026-11-08T00:00:00Z')");
      await failFaqBatch(ctx, 'fqb_x', 'Datenbank nicht erreichbar');
      const notes = (await call('GET', '/notifications', undefined, 'u-redaktion')).json.items.filter((n: any) => n.type === 'faq_batch');
      expect(notes).toEqual([expect.objectContaining({ link: '/stammdaten/faq?sprache=en', text: expect.stringContaining('fehlgeschlagen: Datenbank nicht erreichbar. 1 von 4') })]);
      // ein zweites Mal (schon gescheitert): kein weiterer Hinweis
      await failFaqBatch(ctx, 'fqb_x', 'noch einmal');
      expect((await call('GET', '/notifications', undefined, 'u-redaktion')).json.items.filter((n: any) => n.type === 'faq_batch')).toHaveLength(1);

      // nur eine veraltete FAQ-Übersetzung: der Hinweis der Wochenübersicht führt in die FAQ-Pflege
      const faq = (await call('POST', '/faq', { question: 'Wie drucke ich neu?', answer: 'Öffnen Sie den Beleg und drucken Sie ihn.', status: 'published' }, 'u-redaktion')).json;
      await call('PUT', `/faq/${faq.id}/translations/en`, { question: 'How do I reprint?', answer: 'Open the document and print it.' }, 'u-redaktion');
      await call('PATCH', `/faq/${faq.id}`, { answer: 'Öffnen Sie den Beleg und drucken Sie ihn erneut.' }, 'u-redaktion');
      await sendDigests(ctx, { force: true });
      const digest = (await call('GET', '/notifications', undefined, 'u-redaktion')).json.items.find((n: any) => n.type === 'digest');
      expect(digest).toMatchObject({ link: '/stammdaten/faq', text: expect.stringContaining('Veraltete Übersetzungen: 1 häufige Frage') });
    } finally {
      await built.app.close();
    }
  });
});
