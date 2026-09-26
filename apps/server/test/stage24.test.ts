import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 24', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
  } as any));
  const make = (call: ReturnType<typeof client>) => async (title: string, purpose: string, steps: string[], hints: string[] = []) => {
    const c = (await call('POST', '/chapter-assistant', { title, purpose, steps, result: 'Erledigt.', hints }, 'u-redaktion')).json;
    expect((await call('POST', `/chapter-versions/${c.versionId}/submit`, {}, 'u-redaktion')).status).toBe(200);
    expect((await call('POST', `/chapter-versions/${c.versionId}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
    return c as { chapterId: string; versionId: string };
  };
  /** Übersetzung anlegen, jeden Block mit `f(Quelltext)` füllen (null = offen lassen), Titel setzen, freigeben */
  const translate = async (call: ReturnType<typeof client>, chapterId: string, title: string, f: (src: string) => string | null) => {
    const tr = (await call('POST', '/translations', { chapterId, language: 'en' }, 'u-redaktion')).json;
    const d = (await call('GET', `/translations/${tr.id}`)).json;
    for (const b of d.sections.flatMap((s: any) => s.blocks)) {
      const text = f(b.sourceText);
      if (text) await call('PATCH', `/translation-blocks/${b.id}`, { text }, 'u-redaktion');
    }
    await call('PATCH', `/translations/${tr.id}`, { title }, 'u-redaktion');
    expect((await call('POST', `/translations/${tr.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
    return tr.id as string;
  };

  it('[T-202] Lesen in Sprachen: übersetzte Fassung, deutscher Rückfall mit Hinweis, Titel, Suche und Glossar je Sprache', async () => {
    const built = await build('languages');
    const call = client(built);
    try {
      const mk = make(call);
      const a = await mk('Lieferschein drucken', 'Mit dieser Anleitung drucken Sie einen Lieferschein.', ['Öffnen Sie **Lager › Lieferscheine**', 'Klicken Sie auf **Drucken**']);
      const b = await mk('Auftrag anlegen', 'Mit dieser Anleitung legen Sie einen Auftrag an.', ['Öffnen Sie **Verkauf**', 'Klicken Sie auf **Neu**']);
      expect((await call('GET', `/reader/versions/${a.versionId}?lang=en`)).status).toBe(400); // keine Projektsprache
      await call('PATCH', '/projects/p_default', { languages: ['en'] });
      expect((await call('GET', '/reader/languages', undefined, 'u-leser')).json).toEqual([
        { code: 'de', name: expect.any(String), chapters: null }, { code: 'en', name: expect.any(String), chapters: 0 },
      ]);
      // ohne Übersetzung: deutsch mit Hinweis „missing“
      expect((await call('GET', `/reader/versions/${a.versionId}?lang=en`, undefined, 'u-leser')).json).toMatchObject({ language: 'de', requestedLanguage: 'en', fallback: 'missing', title: 'Lieferschein drucken' });
      // vollständige Übersetzung (nur so freigebbar)
      await translate(call, a.chapterId, 'Print delivery note', (src) => (src.startsWith('Mit dieser') ? 'With this guide you print a delivery note.' : src.includes('Lieferscheine') ? '1. Open **Warehouse › Delivery notes**\n2. Click **Print**' : `EN ${src}`));
      const en = (await call('GET', `/reader/versions/${a.versionId}?lang=en`, undefined, 'u-leser')).json;
      expect(en).toMatchObject({ language: 'en', fallback: null, title: 'Print delivery note', untranslatedBlocks: 0 });
      const steps = en.sections.find((s: any) => s.code === 'steps');
      expect(steps.title).toBe('Step-by-step instructions');
      expect(steps.blocks[0].text).toContain('Warehouse › Delivery notes');
      const purpose = en.sections.find((s: any) => s.code === 'purpose');
      expect(purpose).toMatchObject({ title: 'Purpose', blocks: [expect.objectContaining({ text: 'With this guide you print a delivery note.' })] });
      expect((await call('GET', '/reader/languages')).json[1].chapters).toBe(1);
      // Titel und Übersetzungsstand fürs Inhaltsverzeichnis
      const t = (await call('GET', '/reader/translations?lang=en')).json;
      expect(t).toEqual({ language: 'en', titles: { [a.chapterId]: 'Print delivery note', [b.chapterId]: 'Auftrag anlegen' }, translated: [a.chapterId] });
      // Suche in der Sprache (übersetzte Texte, sonst deutsch)
      expect((await call('GET', '/reader/search?q=Warehouse&lang=en')).json.results).toEqual([expect.objectContaining({ chapterId: a.chapterId, title: 'Print delivery note', translated: true })]);
      expect((await call('GET', '/reader/search?q=Warehouse')).json.total).toBe(0);
      expect((await call('GET', '/reader/search?q=Verkauf&lang=en')).json.results[0]).toMatchObject({ chapterId: b.chapterId, translated: false });
      // Glossar je Sprache: Übersetzung des Begriffs; ohne Übersetzung kein Eintrag
      const term = (await call('POST', '/terminology', { preferred: 'Lieferschein', definition: 'Beleg zur Lieferung.', translations: { en: { term: 'Delivery note', definition: 'Document accompanying a delivery.' } } })).json;
      expect(term.translations).toEqual({ en: { term: 'Delivery note', definition: 'Document accompanying a delivery.' } });
      await call('POST', '/terminology', { preferred: 'Auftrag', definition: 'Bestellung eines Kunden.' });
      expect((await call('POST', '/terminology', { preferred: 'Kunde', translations: { fr: { term: 'Client' } } })).status).toBe(400);
      const gEn = (await call('GET', '/reader/glossary?lang=en')).json;
      expect(gEn.filter((g: any) => g.kind === 'term')).toEqual([{ term: 'Delivery note', text: 'Document accompanying a delivery.', kind: 'term' }]);
      expect((await call('GET', '/reader/glossary')).json.map((g: any) => g.term)).toEqual(expect.arrayContaining(['Lieferschein', 'Auftrag']));
      // „Siehe auch“ über die deutsche Quelle: gleich in jeder Sprache, Titel in der Lesesprache
      const c = await mk('Lieferschein stornieren', 'Mit dieser Anleitung stornieren Sie einen Lieferschein.', ['Öffnen Sie **Lager › Lieferscheine**', 'Klicken Sie auf **Stornieren**']);
      const relDe = (await call('GET', `/reader/related/${c.chapterId}`)).json;
      const relEn = (await call('GET', `/reader/related/${c.chapterId}?lang=en`)).json;
      expect(relDe.automatic.map((r: any) => r.chapterId)).toContain(a.chapterId);
      expect(relEn.automatic.map((r: any) => r.chapterId)).toEqual(relDe.automatic.map((r: any) => r.chapterId));
      expect(relEn.automatic.find((r: any) => r.chapterId === a.chapterId).title).toBe('Print delivery note');
      // neue deutsche Freigabe → Übersetzung veraltet: deutsch mit Hinweis „outdated“
      const ts = new Date().toISOString();
      await built.ctx.db.run("UPDATE generated_chapter_versions SET status = 'superseded' WHERE id = ?", a.versionId);
      await built.ctx.db.run("INSERT INTO generated_chapter_versions (id, chapter_id, version_no, status, title, based_on_version_id, generator, generated_by, generated_at, approved_at) VALUES ('gv_a2', ?, 2, 'approved', 'Lieferschein drucken', ?, 'test', 'u-redaktion', ?, ?)", a.chapterId, a.versionId, ts, ts);
      expect((await call('GET', '/reader/versions/gv_a2?lang=en')).json).toMatchObject({ language: 'de', fallback: 'outdated' });
      // fremdes Projekt
      const other = (await call('POST', '/projects', { name: 'Fremd' })).json;
      expect((await call('GET', `/reader/versions/${b.versionId}`, undefined, 'u-admin', other.id)).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });

  it('[T-203] Siehe auch und FAQ für alle Kapitel (Druck) und in der Online-Hilfe mit Verweis auf das Hilfethema', async () => {
    const built = await build('help-related');
    const call = client(built);
    try {
      const mk = make(call);
      const a = await mk('Lieferschein drucken', 'Mit dieser Anleitung drucken Sie einen Lieferschein für eine Lieferung im Lager.', ['Öffnen Sie **Lager › Lieferscheine**', 'Wählen Sie die Lieferung', 'Klicken Sie auf **Lieferschein drucken**']);
      const b = await mk('Lieferschein stornieren', 'Mit dieser Anleitung stornieren Sie einen falschen Lieferschein einer Lieferung.', ['Öffnen Sie **Lager › Lieferscheine**', 'Wählen Sie den Lieferschein', 'Klicken Sie auf **Stornieren**']);
      const c = await mk('Kunde anlegen', 'Mit dieser Anleitung legen Sie einen Kunden an.', ['Öffnen Sie **Vertrieb › Kunden**', 'Klicken Sie auf **Neu**']);
      await call('POST', '/faq', { question: 'Wie drucke ich einen Lieferschein erneut?', answer: 'Öffnen Sie den **Lieferschein** im Lager und drucken Sie ihn erneut.', status: 'published' }, 'u-redaktion');
      // alle Kapitel auf einmal
      const map = (await call('GET', '/reader/related', undefined, 'u-leser')).json;
      expect(Object.keys(map).sort()).toEqual([a.chapterId, b.chapterId, c.chapterId].sort());
      expect(map[a.chapterId].automatic[0]).toMatchObject({ chapterId: b.chapterId });
      expect(map[a.chapterId].faq[0]).toMatchObject({ question: 'Wie drucke ich einen Lieferschein erneut?' });
      expect(map[c.chapterId].faq).toEqual([]);
      // Online-Hilfe: Siehe auch mit Hilfethema, falls eines existiert
      await call('POST', '/help-contexts', { key: 'ls.print', chapterId: a.chapterId }, 'u-redaktion');
      await call('POST', '/help-contexts', { key: 'ls.storno', chapterId: b.chapterId }, 'u-redaktion');
      const help = (await call('GET', '/context-help/ls.print')).json;
      expect(help.related[0]).toEqual({ chapterId: b.chapterId, title: 'Lieferschein stornieren', contextKey: 'ls.storno' });
      expect(help.faq[0]).toMatchObject({ question: 'Wie drucke ich einen Lieferschein erneut?' });
      expect(help.faq[0].html).toContain('<strong>Lieferschein</strong>');
      // öffentliche Einbettung (Release-Stand): Links bleiben in der Einbettung
      await call('PUT', '/help-settings', { public: true });
      await call('POST', '/releases', { version: '2026.9' }, 'u-freigabe');
      const page = await built.app.inject({ method: 'GET', url: '/help/embed/p_default/ls.print?role=dealer' });
      expect(page.statusCode).toBe(200);
      expect(page.body).toContain('<h2 id="see-h">Siehe auch</h2>');
      expect(page.body).toContain('href="/help/embed/p_default/ls.storno?role=dealer"');
      expect(page.body).toContain('<summary>Wie drucke ich einen Lieferschein erneut?</summary>');
    } finally {
      await built.app.close();
    }
  });

  it('[T-203] Druck einer Handbuch-Variante: „Siehe auch“ und FAQ für die Kapitel der Variante', async () => {
    const built = await build('variant-related');
    const call = client(built);
    try {
      const fm = '---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n---\n';
      await importFile(built, 'lager.md', `${fm}# 1. Lieferschein drucken\n\n## 1.1 Zweck\n\nDer Lieferschein einer Lieferung wird im Lager gedruckt.\n\n# 2. Lieferschein stornieren\n\n## 2.1 Zweck\n\nEin falscher Lieferschein einer Lieferung wird im Lager storniert.\n\n# 3. Kunde anlegen\n\n## 3.1 Zweck\n\nNeue Kunden werden im Vertrieb angelegt.\n`);
      const outline = (await call('POST', '/outlines', { name: 'Lager-Handbuch', content: '# Lieferschein drucken\n## Zweck\n# Lieferschein stornieren\n## Zweck\n', format: 'markdown' })).json;
      await call('POST', `/outlines/${outline.id}/auto-assign`, {});
      const gen = (await call('POST', `/outlines/${outline.id}/generate`, {}, 'u-redaktion')).json;
      const ids = gen.results.filter((r: any) => r.status === 'generated').map((r: any) => r.chapterId);
      expect(ids).toHaveLength(2);
      await call('POST', '/faq', { question: 'Wie drucke ich einen Lieferschein erneut?', answer: 'Im Lager erneut drucken.', status: 'published' }, 'u-redaktion');
      // Entwürfe der Variante: genau deren Kapitel, untereinander verwiesen
      const map = (await call('GET', `/reader/related?drafts=true&outline=${outline.id}`, undefined, 'u-leser')).json;
      expect(Object.keys(map).sort()).toEqual([...ids].sort());
      expect(map[ids[0]].automatic.map((r: any) => r.chapterId)).toEqual([ids[1]]);
      expect(map[ids[0]].faq[0]).toMatchObject({ question: 'Wie drucke ich einen Lieferschein erneut?' });
      // ohne Entwürfe noch nichts freigegeben; unbekannte Variante → 404
      expect((await call('GET', `/reader/related?outline=${outline.id}`)).json).toEqual({});
      expect((await call('GET', '/reader/related?outline=ol_unbekannt')).status).toBe(404);
    } finally {
      await built.app.close();
    }
  });

  it('[T-204] Lesezeichen mit Notiz: setzen, ändern, leeren; Notiz bleibt beim erneuten Merken ohne Notiz', async () => {
    const built = await build('notes');
    const call = client(built);
    try {
      const a = await make(call)('Inventur buchen', 'Mit dieser Anleitung buchen Sie die Inventur.', ['Öffnen Sie **Lager › Inventur**']);
      expect((await call('PUT', `/reader/bookmarks/${a.chapterId}`, { note: '  für die Inventur im Dezember  ' }, 'u-leser')).json).toEqual({ chapterId: a.chapterId, bookmarked: true, note: 'für die Inventur im Dezember' });
      expect((await call('GET', '/reader/me', undefined, 'u-leser')).json.bookmarks[0]).toMatchObject({ note: 'für die Inventur im Dezember' });
      // erneut merken ohne Notiz ändert sie nicht
      expect((await call('PUT', `/reader/bookmarks/${a.chapterId}`, undefined, 'u-leser')).json.note).toBe('für die Inventur im Dezember');
      expect((await call('PUT', `/reader/bookmarks/${a.chapterId}`, { note: 'x'.repeat(600) }, 'u-leser')).json.note).toHaveLength(500);
      expect((await call('PUT', `/reader/bookmarks/${a.chapterId}`, { note: '' }, 'u-leser')).json.note).toBeNull();
      expect((await call('PUT', `/reader/bookmarks/${a.chapterId}`, { note: 42 }, 'u-leser')).status).toBe(400);
      // nur je Person
      expect((await call('GET', '/reader/me', undefined, 'u-redaktion')).json.bookmarks).toEqual([]);
    } finally {
      await built.app.close();
    }
  });
});
