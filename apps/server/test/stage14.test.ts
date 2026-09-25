import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { DIAGRAM_KINDS, parseStructure, question, renderDiagrams } from '../src/domain/diagrams.js';
import { sanitizeSvg } from '../src/domain/svg.js';
import { analyzeStyle, applyFixes, autoFix, PRESENT_RULES, segmentSentences } from '../src/domain/style.js';
import { client, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const fm = (extra = '') => `---\nroles: [all]\ndivisions: [all]\nevidence_status: source_confirmed\n${extra}---\n`;

describe('Etappe 14', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string, llm = true) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', ...(llm ? { llm: { provider: 'demo', model: 'demo-extractive' } } : {}),
  } as any));

  it('[T-176] Schreibstil: Regelprüfung mit Fundstellen, automatische Korrekturen, Präsens, KI-Umformulierung, Kapitel und Textschnipsel', async () => {
    // Einheit: Sätze mit Positionen, Abkürzungen trennen nicht
    const text = 'Die Daten wurden gespeichert.Man muss eigentlich den den Vertrag prüfen ,dann wird der Status angezeigt werden!! die Maske war leer z.B. bei neuen Aufträgen';
    expect(segmentSentences('Z. B. im Menü. Danach speichern Sie.').map((s) => s.text)).toEqual(['Z. B. im Menü.', 'Danach speichern Sie.']);
    expect(segmentSentences('Öffnen Sie Menü A > B. Klicken Sie auf OK. Ggf. prüfen Sie z. B. den Status.').map((s) => s.text)).toEqual(['Öffnen Sie Menü A > B.', 'Klicken Sie auf OK.', 'Ggf. prüfen Sie z. B. den Status.']);
    const a = analyzeStyle(text, { terms: [{ preferred: 'Auftrag', avoid: ['Order'] }] });
    const rules = a.sentences.flatMap((s) => s.issues.map((i) => i.rule));
    expect(rules).toEqual(expect.arrayContaining(['past', 'filler', 'double_word', 'punctuation', 'future', 'capitalization', 'abbreviation', 'impersonal']));
    for (const s of a.sentences) for (const i of s.issues) {
      expect(text.slice(s.start, s.end)).toBe(s.text);
      expect(i.start).toBeGreaterThanOrEqual(s.start);
      expect(i.end).toBeLessThanOrEqual(s.end);
    }
    expect(autoFix(text).text).toBe('Die Daten werden gespeichert. Man muss den Vertrag prüfen, dann wird der Status angezeigt. Die Maske ist leer z. B. bei neuen Aufträgen.');
    expect(autoFix('Die Liste wurde aktualisiert und wird angezeigt werden.', { rules: PRESENT_RULES }).text).toBe('Die Liste wird aktualisiert und wird angezeigt.');
    expect(analyzeStyle('Klicken Sie auf **Speichern**.').sentences[0].issues).toEqual([]);
    expect(analyzeStyle('Die Order wird angelegt.', { terms: [{ preferred: 'Auftrag', avoid: ['Order'] }] }).sentences[0].issues[0]).toMatchObject({ rule: 'terminology', fix: { replacement: 'Auftrag' } });
    expect(analyzeStyle('Die Addresse ist Pflicht.').sentences[0].issues[0]).toMatchObject({ rule: 'spelling', fix: { replacement: 'Adresse' } });
    expect(applyFixes('ab', [{ start: 0, end: 1, replacement: 'X', label: '' }, { start: 0, end: 2, replacement: 'Y', label: '' }]).applied).toBe(1);

    const built = await build('style');
    const call = client(built);
    try {
      await call('POST', '/terminology', { preferred: 'Kennwort', avoid: ['Passwort'] });
      // Freier Text
      const chk = (await call('POST', '/style/check', { text: 'Das Passwort wurde gespeichert. Es wird angezeigt werden.' }, 'u-leser')).json;
      expect(chk.problemSentences).toBe(2);
      expect(chk.rules.map((r: any) => r.rule)).toEqual(expect.arrayContaining(['terminology', 'past', 'future']));
      expect(chk.score).toBeLessThan(100);
      expect((await call('POST', '/style/check', { text: '' })).status).toBe(400);
      expect((await call('POST', '/style/check', { text: 'x'.repeat(20001) })).status).toBe(400);
      // Umformulieren (Demo-KI wendet die Regeln an), nur mit Bearbeitungsrecht
      expect((await call('POST', '/style/rewrite', { text: 'Das Passwort wurde gespeichert.' }, 'u-leser')).status).toBe(403);
      const rw = (await call('POST', '/style/rewrite', { text: 'Das Passwort wurde gespeichert. Die Frist beträgt 14 Tage.', mode: 'professional' })).json;
      expect(rw).toMatchObject({ method: 'ai', provider: { id: 'demo' }, text: 'Das Kennwort wird gespeichert. Die Frist beträgt 14 Tage.', lostNumbers: [] });
      expect((await call('POST', '/style/rewrite', { text: 'Das Feld war leer.', mode: 'present' })).json.text).toBe('Das Feld ist leer.');
      expect((await call('POST', '/style/rewrite', { text: 'x', mode: 'poetisch' })).status).toBe(400);
      expect((await built.ctx.db.get("SELECT details FROM audit_events WHERE action = 'style.rewritten'"))!.details).not.toContain('Passwort');

      // Kapitel: Absätze prüfen, im Entwurf über den normalen Absatz-Endpunkt korrigieren
      await importFile(built, 'a.md', `${fm()}# 1. Anmeldung\n\nDie Anmeldung wurde eigentlich geprüft.\n\nKlicken Sie auf **Anmelden**.\n`);
      const ch = (await call('GET', '/chapters')).json.find((c: any) => c.title === '1. Anmeldung');
      const v = (await call('POST', `/chapters/${ch.id}/generate`, {}, 'u-redaktion')).json;
      const cv = (await call('GET', `/style/chapter-versions/${v.id}`, undefined, 'u-leser')).json;
      expect(cv.version).toMatchObject({ editable: true, status: 'draft' });
      const bad = cv.blocks.find((b: any) => b.text.includes('eigentlich'));
      expect(bad.analysis.sentences[0].issues.map((i: any) => i.rule)).toEqual(expect.arrayContaining(['past', 'filler']));
      const fixed = autoFix(bad.text).text;
      expect((await call('PATCH', `/content-blocks/${bad.id}`, { text: fixed, expectedVersionNo: bad.versionNo }, 'u-redaktion')).status).toBe(200);
      const cv2 = (await call('GET', `/style/chapter-versions/${v.id}`)).json;
      expect(cv2.blocks.find((b: any) => b.id === bad.id).text).toBe('Die Anmeldung wird geprüft.');
      expect((await call('GET', '/style/chapter-versions/cv_fremd')).status).toBeGreaterThanOrEqual(400);

      // Textschnipsel: nur prüfen
      const sn = (await call('GET', `/style/snippets?chapterId=${ch.id}`)).json;
      expect(sn.checked).toBe(2);
      expect(sn.items.map((s: any) => s.text)).toEqual(['Die Anmeldung wurde eigentlich geprüft.']);
      expect((await call('GET', `/style/snippets?chapterId=${ch.id}&all=true`)).json.total).toBe(2);
      expect((await call('GET', '/style/snippets')).status).toBe(400);
    } finally {
      await built.app.close();
    }
    // ohne KI-Dienst: Regelkorrekturen
    const plain = await build('style-nollm', false);
    try {
      const r = (await client(plain)('POST', '/style/rewrite', { text: 'Das Feld war leer.' })).json;
      expect(r).toMatchObject({ method: 'rules', provider: null, text: 'Das Feld ist leer.' });
    } finally {
      await plain.app.close();
    }
  });
  it('[T-177] Bilder aus Text: Struktur, ASCII-Bild, Klickstrecke, Prozessbild, Infografik, KI-Struktur, Speichern im Bildverzeichnis', async () => {
    const text = `## Auftrag anlegen\nÖffnen Sie **Verkauf > Aufträge > Neu**.\nGeben Sie die Kundennummer ein und klicken Sie auf **Übernehmen**.\n`
      + `Wenn der Kunde gesperrt ist, dann informieren Sie die Buchhaltung; sonst erfassen Sie die Positionen.\nKlicken Sie auf **Speichern**.\n`
      + `Die Lieferfrist beträgt 14 Tage.\nMindestbestellwert: 50 Euro`;
    // Einheit: Struktur
    const s = parseStructure(text);
    expect(s.title).toBe('Auftrag anlegen');
    expect(s.clicks).toEqual(['Verkauf', 'Aufträge', 'Neu', 'Übernehmen', 'Speichern']);
    expect(s.steps).toHaveLength(4);
    expect(s.steps[2]).toEqual({ label: 'Ist der Kunde gesperrt?', decision: true, yes: 'Informieren Sie die Buchhaltung', no: 'Erfassen Sie die Positionen' });
    expect(s.facts).toEqual([{ label: 'Lieferfrist', value: '14 Tage' }, { label: 'Mindestbestellwert', value: '50 Euro' }]);
    expect(question('die Menge größer als null ist')).toBe('Ist die Menge größer als null?');
    expect(parseStructure('Öffnen Sie **A > B**. Klicken Sie auf **Speichern**.').steps.map((x) => x.label)).toEqual(['Öffnen Sie A > B', 'Klicken Sie auf Speichern']);
    expect(parseStructure('Setzen Sie z. B. einen Filter. Ggf. drucken Sie die Liste. Z. B. im Menü A. Danach speichern.').steps.map((x) => x.label))
      .toEqual(['Setzen Sie z. B. einen Filter', 'Ggf. drucken Sie die Liste', 'Z. B. im Menü A', 'Danach speichern']);
    expect(parseStructure('1. Menü öffnen\n2. Z. B. Filter setzen\n3. Liste drucken').steps.map((x) => x.label)).toEqual(['Menü öffnen', 'Z. B. Filter setzen', 'Liste drucken']);
    // Zeichnen: alle Bildarten, SVGs überstehen die Bereinigung unverändert im Umfang, Texte sind maskiert
    const imgs = renderDiagrams({ ...s, title: 'A & B <x>' }, DIAGRAM_KINDS, '#1d63d8');
    expect(imgs.map((i) => i.kind)).toEqual(['ascii', 'clickpath', 'process', 'infographic']);
    for (const i of imgs) {
      expect(i.svg).toContain('A &amp; B &lt;x&gt;');
      expect(sanitizeSvg(i.svg).svg.length).toBeGreaterThan(i.svg.length * 0.95);
    }
    expect(imgs[0].ascii).toMatch(/\+-+\+\n\| Öffnen Sie Verkauf > Aufträge > Neu +\|/);
    expect(imgs[0].ascii).toContain('Nein -> Erfassen Sie die Positionen');
    expect(imgs[2].svg).toContain('<polygon');
    expect(imgs[3].svg).toContain('14 Tage');
    expect(renderDiagrams(parseStructure('Nur ein Satz.'), ['infographic', 'clickpath'], '#1d63d8').flatMap((i) => i.warnings)).toHaveLength(2);

    const built = await build('diagrams');
    const call = client(built);
    try {
      const g = (await call('POST', '/diagrams/generate', { text, kinds: ['process', 'clickpath'] }, 'u-leser')).json;
      expect(g).toMatchObject({ method: 'rules', aiAvailable: true, provider: null });
      expect(g.images.map((i: any) => i.kind)).toEqual(['process', 'clickpath']);
      // Farbe aus dem Projekt-Layout
      await call('PUT', '/layout', { primaryColor: '#0f766e' }, 'u-admin');
      const colored = (await call('POST', '/diagrams/generate', { text, kinds: ['clickpath'] })).json;
      expect(colored.images[0].svg).toContain('#0f766e');
      // KI-Struktur (Demo) nur mit Bearbeitungsrecht; Audit ohne Text
      expect((await call('POST', '/diagrams/generate', { text, useAi: true }, 'u-leser')).status).toBe(403);
      const ai = (await call('POST', '/diagrams/generate', { text, useAi: true })).json;
      expect(ai).toMatchObject({ method: 'ai', provider: { id: 'demo' } });
      expect(ai.images).toHaveLength(4);
      expect((await built.ctx.db.get("SELECT details FROM audit_events WHERE action = 'diagram.structured'"))!.details).not.toContain('Kundennummer');
      // bearbeitete Struktur neu zeichnen
      const ed = (await call('POST', '/diagrams/generate', { kinds: ['ascii'], structure: { title: 'Neu', steps: ['Eins', { label: 'Ok?', decision: true, yes: 'Weiter' }], clicks: [], facts: [] } })).json;
      expect(ed.method).toBe('edited');
      expect(ed.images[0].ascii).toContain('< Ok?');
      expect((await call('POST', '/diagrams/generate', { structure: { steps: [] } })).status).toBe(400);
      expect((await call('POST', '/diagrams/generate', { text, kinds: ['comic'] })).status).toBe(400);
      expect((await call('POST', '/diagrams/generate', { text: ' ' })).status).toBe(400);

      // Speichern: Alternativtext Pflicht, Titel fürs Bildverzeichnis, bereinigtes SVG
      const img = g.images[0];
      expect((await call('POST', '/diagrams/save', { svg: img.svg, title: img.title, alt: 'x' }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/diagrams/save', { svg: img.svg, title: img.title, alt: ' ' })).status).toBe(400);
      expect((await call('POST', '/diagrams/save', { svg: '<svg><script>alert(1)</script></svg', alt: 'x' })).status).toBe(400);
      const sv = (await call('POST', '/diagrams/save', { svg: img.svg.replace('<title>', '<script>alert(1)</script><title>'), kind: 'process', title: 'Prozess Auftrag anlegen', alt: 'Ablauf [Auftrag] anlegen' })).json;
      expect(sv).toMatchObject({ mime: 'image/svg+xml', title: 'Prozess Auftrag anlegen', markdown: `![Ablauf  Auftrag  anlegen](media:${sv.sha256})` });
      const stored = await built.ctx.store.get(`media/${sv.sha256}`);
      expect(stored.toString('utf8')).not.toContain('script');
      const idx = (await call('GET', '/image-index')).json;
      expect(idx.find((i: any) => i.sha256 === sv.sha256)).toMatchObject({ title: 'Prozess Auftrag anlegen', originalName: 'process.svg', number: null });
      expect(await built.ctx.db.get("SELECT 1 FROM audit_events WHERE action = 'diagram.saved'")).toBeTruthy();
    } finally {
      await built.app.close();
    }
  });
});
