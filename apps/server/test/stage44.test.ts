import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { assessReadability, readability, syllables } from '../src/domain/readability.js';
import { sha256 } from '../src/domain/similarity.js';
import { analyzeStyle, autoFix } from '../src/domain/style.js';
import { captionChecks } from '../src/services/imageArchive.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const rules = (text: string, opts: Parameters<typeof analyzeStyle>[1] = {}) => analyzeStyle(text, opts).sentences.flatMap((s) => s.issues).map((i) => i.rule);
const fixed = (text: string, only: string[], opts: Parameters<typeof analyzeStyle>[1] = {}) => autoFix(text, { ...opts, rules: only as any }).text;

describe('Etappe 44', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-296] Hausregeln (Typografie, Zahlen, Datum, Produktname), Englisch (a/an, „I“, Rechtschreibung), Wortliste je Sprache, erlaubte Begriffe (Einheit)', () => {
    // Typografie (G-Z1–G-Z4)
    expect(fixed('Klicken Sie auf "Speichern".', ['typography'])).toBe('Klicken Sie auf „Speichern“.');
    expect(fixed('Antrag - Prüfung - Freigabe.', ['typography'])).toBe('Antrag – Prüfung – Freigabe.');
    expect(fixed('Öffnen Sie Contract Management > Contracts.', ['typography'])).toBe('Öffnen Sie Contract Management › Contracts.');
    expect(fixed('## Vertrag anlegen.', ['typography'])).toBe('## Vertrag anlegen');
    expect(rules('Mit `a > B` im Code.')).not.toContain('typography');
    // Zahlen, Einheiten, Datum (G-N1–G-N6)
    expect(fixed('Es gibt 3 Rollen.', ['numbers'])).toBe('Es gibt drei Rollen.');
    expect(rules('Die Frist beträgt 5 Tage.')).not.toContain('numbers'); // mit Einheit
    expect(rules('Siehe Kapitel 7 und Schritt 3.')).not.toContain('numbers');
    expect(rules('1. Klicken Sie 2 Mal.')).not.toContain('numbers'); // Schritt
    expect(fixed('Der Betrag ist 12500,50 €.', ['numbers'])).toBe('Der Betrag ist 12.500,50 €.');
    expect(fixed('Der Betrag ist 1,250.50 €.', ['numbers'])).toBe('Der Betrag ist 1.250,50 €.');
    expect(fixed('Der Rabatt beträgt 19%.', ['numbers'])).toBe('Der Rabatt beträgt 19 %.');
    expect(fixed('Gültig ab 2026-10-23.', ['numbers'])).toBe('Gültig ab 23.10.2026.');
    expect(fixed('Gültig 2023-2027.', ['numbers'])).toBe('Gültig 2023–2027.');
    expect(rules('Ticket-Nr. 123456 ist offen.')).not.toContain('numbers');
    // Produktname in allen Sprachen, Ticketschlüssel bleiben
    expect(fixed('Öffnen Sie OneSCM.', ['product_name'])).toBe('Öffnen Sie oneSCM.');
    expect(rules('Siehe ONESCM-1234.')).not.toContain('product_name');
    expect(fixed('Open ONESCM.', ['product_name'], { language: 'en' })).toBe('Open oneSCM.');
    // Englisch (G-06)
    expect(fixed('Create a order for a user and an MO check.', ['grammar'], { language: 'en' })).toBe('Create an order for a user and an MO check.');
    expect(fixed('Select an contract, then i save it.', ['grammar'], { language: 'en' })).toBe('Select a contract, then I save it.');
    expect(fixed('An hour later the dealar can recieve it.', ['spelling', 'grammar'], { language: 'en' })).toBe('An hour later the dealer can receive it.');
    // deutsche Regeln greifen nicht im Englischen (z. B. Anführungszeichen, Passiv, Zahlen)
    expect(rules('Click "Save" and wait 3 seconds. The contract was saved.', { language: 'en' })).toEqual([]);
    // andere Sprachen: nur sprachneutrale Regeln
    expect(rules('Cliquez  sur "Enregistrer" .', { language: 'fr' }).sort()).toEqual(['punctuation', 'punctuation']);
    // Wortliste je Sprache (S-03)
    const phrases = [{ avoid: 'Dealer', use: 'Händler' }, { avoid: 'Händler', use: 'Dealer', language: 'en' }];
    expect(fixed('Der Dealer prüft den Antrag.', ['custom'], { phrases })).toBe('Der Händler prüft den Antrag.');
    expect(fixed('The Händler checks the proposal.', ['custom'], { phrases, language: 'en' })).toBe('The Dealer checks the proposal.');
    expect(rules('The Dealer checks the proposal.', { phrases, language: 'en' })).not.toContain('custom');
    // erlaubte Begriffe (G-03)
    expect(rules('Öffnen Sie OneSCM.', { allowed: ['OneSCM'] })).not.toContain('product_name');
    expect(rules('Die Standart-Ansicht.')).toContain('spelling');
    expect(rules('Die Vorraussetzung fehlt.', { allowed: ['Vorraussetzung'] })).not.toContain('spelling');
  });

  it('[T-297] Lesbarkeit (LIX, Flesch-Amstad, Sollwerte je Zielgruppe) und Bildunterschriften (Einheit)', () => {
    expect(syllables('Vertrag')).toBe(2);
    expect(syllables('Freigabe')).toBe(3);
    expect(syllables('Einstellungen')).toBe(4);
    const easy = readability(['Öffnen Sie den Vertrag. Klicken Sie auf Speichern. Der Vertrag ist gespeichert.']);
    expect(easy).toMatchObject({ sentences: 3, words: 12, avgWords: 4 });
    expect(easy.flesch).toBeGreaterThanOrEqual(60);
    const hard = readability(['Die Berücksichtigung sämtlicher vertragsrelevanter Konfigurationsparameter wird im Rahmen der Antragsbearbeitung durch die zuständige Marktorganisation sichergestellt und dokumentiert, sofern entsprechende Berechtigungen vorliegen und die Prüfung abgeschlossen wurde.']);
    expect(hard.lix).toBeGreaterThan(55);
    expect(hard.longShare).toBe(100);
    expect(hard.passiveShare).toBe(100);
    const a = assessReadability(hard, 'enduser');
    expect(a.ok).toBe(false);
    expect(a.checks.filter((c) => !c.ok).map((c) => c.code)).toEqual(['flesch', 'lix', 'avg_words', 'long_share', 'passive_share']);
    expect(assessReadability(easy, 'expert')).toMatchObject({ ok: true, lixLabel: 'mittel' });
    expect(readability(['| Spalte | Wert |\n|---|---|', '![Bild](media:x)'])).toMatchObject({ sentences: 0 });
    // Bildunterschriften (S-08)
    expect(captionChecks('Vertragsliste mit Filter')).toEqual([]);
    expect(captionChecks('Hier sieht man die Vertragsliste.').map((c) => c.rule)).toEqual(['caption_filler']);
    expect(captionChecks('Eins. Zwei. Drei.').map((c) => c.rule)).toEqual(['caption_sentences']);
    expect(captionChecks('x'.repeat(201)).map((c) => c.rule)).toEqual(['caption_long']);
    expect(captionChecks('Hier sieht man nichts', true)).toEqual([]);
  });

  it('[T-298] Stilregeln mit Zielgruppe, erlaubten Begriffen und Sprache je Regel; Prüfung in Englisch; Lesbarkeit im Anleitungs-Check; „nicht übersetzen“; Sprachprüfung der Übersetzung; Bildunterschrift im Archiv', async () => {
    const built = await build('stil');
    const call = client(built);
    try {
      expect((await call('PUT', '/style/rules', { audience: 'kids' })).status).toBe(400);
      expect((await call('PUT', '/style/rules', { phrases: [{ avoid: 'x', use: 'y', language: 'xx' }] })).status).toBe(400);
      expect((await call('PUT', '/style/rules', { allowed: ['ok', 'x'] })).status).toBe(400);
      expect((await call('PUT', '/style/rules', { allowed: ['BTO'] }, 'u-redaktion')).status).toBe(403);
      const r = (await call('PUT', '/style/rules', {
        audience: 'expert', allowed: 'VIN\nBTO; OneSCM', phrases: [{ avoid: 'Dealer', use: 'Händler' }, { avoid: 'Händler', use: 'Dealer', language: 'en' }, { avoid: 'Dealer', use: 'Concessionnaire', language: 'fr' }],
      })).json;
      expect(r).toMatchObject({ audience: 'expert', allowed: ['VIN', 'BTO', 'OneSCM'] });
      expect(r.phrases.map((p: any) => p.language ?? 'de')).toEqual(['de', 'en', 'fr']);
      const csv = (await call('GET', '/style/rules/export?format=csv')).body;
      expect(csv).toContain('vermeiden;aktion;ersetzen durch;hinweis;sprache');
      expect(csv).toContain('Händler;ersetzen;Dealer;;en');
      // Import mit Spalte „sprache“ (Wortliste „falsch → richtig“)
      const imp = (await call('POST', '/style/rules/import', { csv: 'falsch;richtig;sprache\nService Vertrag;Servicevertrag;de\nService Contract;service contract;en\n', mode: 'merge' })).json;
      expect(imp.summary).toMatchObject({ added: 2 });
      const en = (await call('POST', '/style/check', { text: 'Create a order in the Händler view of OneSCM.', language: 'en' }, 'u-leser')).json;
      expect(en.language).toBe('en');
      expect(en.rules.map((x: any) => x.rule).sort()).toEqual(['custom', 'grammar']); // OneSCM ist erlaubt
      expect((await call('POST', '/style/check', { text: 'x', language: 'xx' })).status).toBe(400);

      // Kapitel mit Freigabe für Übersetzung und Anleitungs-Check
      await importFile(built, 'k.md', `${FM}# 1. Vertrag anlegen\n\nÖffnen Sie den Vertrag. Klicken Sie auf **Speichern**. Der Vertrag ist gespeichert.\n`);
      const chapter = (await call('GET', '/chapters')).json[0];
      const v = await approveChapter(call, chapter.id);
      const g = (await call('GET', `/guidance/chapter-versions/${v.id}`)).json;
      expect(g.readability).toMatchObject({ audience: 'expert', ok: true });
      expect(g.readability.checks).toHaveLength(5);
      expect((await call('GET', '/guidance')).json.chapters[0].readability).toMatchObject({ ok: true });
      expect((await call('GET', `/style/chapter-versions/${v.id}`)).json.readability.sentences).toBeGreaterThan(0);

      // „nicht übersetzen“ (S-04): Begriff bleibt in jeder Sprache, Übersetzungsprüfung meldet Abweichung
      await call('PATCH', '/projects/p_default', { languages: ['en'] });
      const term = (await call('POST', '/terminology', { preferred: 'Speichern', avoid: [], keepUntranslated: true }, 'u-redaktion')).json;
      expect(term.keepUntranslated).toBe(true);
      const tr = (await call('POST', '/translations', { chapterId: chapter.id, language: 'en' }, 'u-redaktion')).json;
      const blocks = (await call('GET', `/translations/${tr.id}`)).json.sections.flatMap((s: any) => s.blocks);
      const edited = (await call('PATCH', `/translation-blocks/${blocks[0].id}`, { text: 'Open the contract. Click **Save**. The Händler sees an contract.' }, 'u-redaktion')).json;
      expect(edited.issues).toContain('term_translation');
      expect(edited.style.map((x: any) => x.rule).sort()).toEqual(['custom', 'grammar']);
      const ok = (await call('PATCH', `/translation-blocks/${blocks[0].id}`, { text: 'Open the contract. Click **Speichern**. The contract is saved.' }, 'u-redaktion')).json;
      expect(ok.issues).not.toContain('term_translation');
      expect(ok.style).toEqual([]);

      // Bildunterschrift im Bildarchiv (S-08)
      const c = createCanvas(800, 450);
      const png = c.toBuffer('image/png');
      const z = new JSZip();
      z.file('bilder/a.png', png);
      await importFile(built, 'b.zip', await z.generateAsync({ type: 'nodebuffer' }));
      const it2 = (await call('PATCH', `/image-archive/${sha256(png)}`, { title: 'Hier sieht man die Vertragsliste.' }, 'u-redaktion')).json;
      expect(it2.checks.map((x: any) => x.rule)).toContain('caption_filler');
    } finally {
      await built.app.close();
    }
  });

  it('[T-299] Kapitelanweisung für Handbuch-Varianten: eigene Anweisung des Variantenkapitels und die der Quellkapitel gelten beim Generieren; Export mit Varianten', async () => {
    const built = await build('varianten');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${FM}# 1. Anmeldung\n\n## 1.1 Zweck\n\nDie Anmeldung öffnet oneSCM.\n\nDas Passwort setzen Sie über den Link zurück.\n\nDie Sitzung endet nach acht Stunden.\n`);
      const source = (await call('GET', '/chapters')).json[0];
      // Quellkapitel: Passwort nicht beschreiben
      await call('PATCH', `/structure/chapters/${source.id}`, { excluded: ['Passwort'] }, 'u-redaktion');
      const o = (await call('POST', '/outlines', { name: 'Händler', roles: ['dealer'], content: '# Anmeldung\n## Zweck\n', format: 'markdown' })).json;
      await call('POST', `/outlines/${o.id}/auto-assign`, {});
      const mat = (await call('POST', `/outlines/${o.id}/materialize`, {}, 'u-redaktion')).json;
      const vch = mat.chapters[0];
      expect((await call('GET', '/structure/outlines')).json.items).toEqual([expect.objectContaining({ familyId: o.familyId, name: 'Händler', chapters: 1 })]);
      const st = (await call('GET', `/structure?outline=${o.familyId}`)).json;
      expect(st.chapters.map((c: any) => c.id)).toEqual([vch.id]);
      // Variantenkapitel: zusätzlich „Sitzung“ nicht beschreiben, „Anmeldung“ wichtig
      await call('PATCH', `/structure/chapters/${vch.id}`, { excluded: ['Sitzung'], topics: ['Anmeldung'] }, 'u-redaktion');
      const v = (await call('POST', `/chapters/${vch.id}/generate`, {}, 'u-redaktion')).json;
      const texts = v.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text)).join('\n');
      expect(texts).toContain('Die Anmeldung öffnet oneSCM.');
      expect(texts).not.toContain('Passwort');
      expect(texts).not.toContain('Sitzung');
      expect(v.generation.excludedByInstruction.map((x: any) => x.topic).sort()).toEqual(['Passwort', 'Sitzung']);
      expect(v.generation.missingTopics).toEqual([]);
      const ex = (await call('GET', '/structure/instructions/export')).json;
      expect(ex.variants).toEqual([expect.objectContaining({ familyId: o.familyId, name: 'Händler' })]);
      expect(ex.variants[0].chapters[0].markdown).toContain('- Sitzung');
    } finally {
      await built.app.close();
    }
  });
});
