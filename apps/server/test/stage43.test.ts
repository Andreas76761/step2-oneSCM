import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { checkAgainst, cleanTopics, instructionMarkdown, mentions, mergeInstructions } from '../src/domain/chapterInstruction.js';
import { buildRewritePrompt } from '../src/domain/rewrite.js';
import { approveChapter, client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 43', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-292] Kapitelanweisung: Themen erkennen, bereinigen, Kapitel und Unterkapitel zusammenführen, Prüfung, Markdown, KI-Anfrage (Einheit)', () => {
    expect(mentions('Die Kündigungsfristen stehen im Vertrag.', 'Kündigungsfrist')).toBe(true);
    expect(mentions('Vorkündigung', 'Kündigung')).toBe(false); // Wortanfang muss passen
    expect(mentions('Der  Vertrag   stornieren', 'vertrag stornieren')).toBe(true);
    expect(mentions('ab', 'ab')).toBe(false); // zu kurz
    expect(cleanTopics(' Storno ; storno\nKündigungsfrist ', 'excluded')).toEqual(['Storno', 'Kündigungsfrist']);
    expect(() => cleanTopics(['ab'], 'topics')).toThrow('3 bis 80 Zeichen');
    expect(() => cleanTopics(Array.from({ length: 31 }, (_, i) => `Thema ${i}`), 'topics')).toThrow('höchstens 30');
    const ch = { text: 'Nur Händlersicht.', topics: ['Kündigungsfrist'], excluded: ['Storno'] };
    const merged = mergeInstructions(ch, { text: 'Mit Beispiel.', topics: ['kündigungsfrist', 'Rückgabe'], excluded: ['Inflation'] });
    expect(merged).toEqual({ text: 'Nur Händlersicht.\nMit Beispiel.', topics: ['Kündigungsfrist', 'Rückgabe'], excluded: ['Storno', 'Inflation'] });
    const r = checkAgainst(merged, [{ id: 'b1', text: 'Ein Storno ist möglich.' }, { id: 'b2', text: 'Die Rückgabe erfolgt im Menü.' }]);
    expect(r).toEqual({ excludedMentioned: [{ topic: 'Storno', blockId: 'b1' }], topicsMissing: ['Kündigungsfrist'], ok: false });
    const md = instructionMarkdown('6.2 Vertrag kündigen', merged, '2026.3');
    expect(md).toContain('# Anweisung: 6.2 Vertrag kündigen');
    expect(md).toContain('**Gültig ab:** 2026.3');
    expect(md).toMatch(/## Nicht beschreiben\n\n- Storno\n- Inflation/);
    // KI-Anfrage: Anweisung im Systemteil, ohne Anweisung unverändert
    const base = { kind: 'paragraph', section: 'steps', text: 'x', sources: [], terms: [] };
    expect(buildRewritePrompt(base).system).not.toContain('Kapitelanweisung');
    const p = buildRewritePrompt({ ...base, chapterInstruction: merged });
    expect(p.system).toContain('Kapitelanweisung der Redaktion – mit hoher Priorität');
    expect(p.system).toContain('Nicht beschreiben: Storno; Inflation');
    expect(p.user).not.toContain('Storno');
  });

  it('[T-293] Fehlende Kapitel und Unterkapitel ergänzen, Anweisung setzen; Generator lässt ausgeschlossene Themen weg und meldet fehlende wichtige Themen; Anleitungs-Check', async () => {
    const built = await build('anweisung');
    const call = client(built);
    try {
      expect((await call('POST', '/structure/chapters', { title: '7. Vertrag kündigen' }, 'u-leser')).status).toBe(403);
      const ch = (await call('POST', '/structure/chapters', { title: '7. Vertrag kündigen', validFrom: '2026.3' }, 'u-redaktion'));
      expect(ch.status).toBe(201);
      expect(ch.json).toMatchObject({ title: '7. Vertrag kündigen', position: 7000, validFrom: '2026.3', subchapters: [] });
      expect((await call('POST', '/structure/chapters', { title: '7. Vertrag kündigen' }, 'u-redaktion')).status).toBe(409);
      const sub = (await call('POST', `/structure/chapters/${ch.json.id}/subchapters`, { title: '7.1 Kündigung erfassen' }, 'u-redaktion')).json;
      expect(sub).toMatchObject({ title: '7.1 Kündigung erfassen', position: 1000 });
      expect((await call('PATCH', `/structure/chapters/${ch.json.id}`, { excluded: ['xy'] }, 'u-redaktion')).status).toBe(400);
      await call('PATCH', `/structure/chapters/${ch.json.id}`, { instruction: 'Nur die Sicht des Händlers beschreiben.', topics: ['Kündigungsgrund'], excluded: ['Storno'] }, 'u-redaktion');
      await call('PATCH', `/structure/subchapters/${sub.id}`, { topics: ['Kündigungsfrist'] }, 'u-redaktion');

      // Quellen zum ergänzten Kapitel einlesen (Zuordnung über den Titel wie beim Import)
      await importFile(built, 'k.md', `${FM}# 7. Vertrag kündigen\n\nÖffnen Sie den Vertrag und klicken Sie auf **Kündigen**.\n\n## 7.1 Kündigung erfassen\n\nWählen Sie den Kündigungsgrund aus der Liste.\n\nEin Storno ist nur am selben Tag möglich.\n`);
      const structure = (await call('GET', '/structure')).json;
      const c = structure.chapters.find((x: any) => x.id === ch.json.id);
      expect(c.snippets).toBeGreaterThanOrEqual(2);
      expect(c.subchapters.map((s: any) => s.id)).toEqual([sub.id]);
      expect(structure.summary.withInstruction).toBe(2);
      const ins = (await call('GET', `/chapters/${ch.json.id}/instruction`, undefined, 'u-leser')).json;
      expect(ins.chapter).toEqual({ text: 'Nur die Sicht des Händlers beschreiben.', topics: ['Kündigungsgrund'], excluded: ['Storno'] });
      expect(ins.subchapters[0].instruction.topics).toEqual(['Kündigungsfrist']);

      const v = (await call('POST', `/chapters/${ch.json.id}/generate`, {}, 'u-redaktion')).json;
      const texts = v.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text)).join('\n');
      expect(texts).not.toContain('Storno');
      expect(texts).toContain('Kündigungsgrund');
      expect(v.generation.excludedByInstruction).toHaveLength(1);
      expect(v.generation.excludedByInstruction[0].topic).toBe('Storno');
      expect(v.generation.missingTopics).toEqual(['Kündigungsfrist']);
      expect(texts).toContain('Laut Kapitelanweisung wichtig, aber ohne bestätigte Quelle: „Kündigungsfrist“.');

      // Anleitungs-Check: Absatz mit ausgeschlossenem Thema wird gemeldet
      const block = v.sections.flatMap((s: any) => s.blocks).find((b: any) => b.kind !== 'gap');
      await call('PATCH', `/content-blocks/${block.id}`, { text: `${block.text} Ein Storno ist möglich.`, versionNo: block.versionNo, reason: 'Test' }, 'u-redaktion');
      const g = (await call('GET', `/guidance/chapter-versions/${v.id}`)).json;
      expect(g.instruction.excludedMentioned.map((m: any) => m.topic)).toEqual(['Storno']);
      expect(g.instruction.topicsMissing).toEqual(['Kündigungsfrist']);
    } finally {
      await built.app.close();
    }
  });

  it('[T-294] Version an Labels und Kapiteln im Output; veraltete Funktion ablösen → Historie (nicht im Handbuch, Anhang „Historie“), Zuordnungen übertragen, zurückholen', async () => {
    const built = await build('historie');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${FM}# 1. Vertrag aussetzen\n\nKlicken Sie auf **Aussetzen**, um den Vertrag zu pausieren.\n`);
      await importFile(built, 'b.md', `${FM}# 2. Vertrag pausieren\n\nKlicken Sie auf **Pausieren** und wählen Sie das Enddatum.\n`);
      const chapters = (await call('GET', '/chapters')).json;
      const old = chapters.find((c: any) => c.title === '1. Vertrag aussetzen');
      const neu = chapters.find((c: any) => c.title === '2. Vertrag pausieren');
      await approveChapter(call, old.id);
      await approveChapter(call, neu.id);
      await call('PATCH', `/structure/chapters/${old.id}`, { validFrom: '2025.1' }, 'u-redaktion');

      // Label mit Version, ablösen durch neues Label mit Übertragung der Chunks
      const label = (await call('POST', '/metadata/labels', { group: 'navigation', code: 'nav.e2e-aussetzen', nameDe: 'Aussetzen', nameEn: 'Suspend' })).json;
      expect((await call('PATCH', `/metadata/labels/${label.id}`, { validFrom: '2025.1' })).json.validFrom).toBe('2025.1');
      const chunks = (await call('GET', '/metadata/chunks')).json.items;
      await call('POST', '/metadata/chunks/labels', { snippetIds: [chunks[0].id], add: [label.id] }, 'u-redaktion');
      expect((await call('POST', '/structure/replace', { kind: 'label', id: label.id, newTitle: 'Pausieren', validFrom: '2026.3' }, 'u-redaktion')).status).toBe(403);
      const rl = (await call('POST', '/structure/replace', { kind: 'label', id: label.id, newTitle: 'Pausieren', validFrom: '2026.3', moveAssignments: true, note: 'Menüpunkt umbenannt' })).json;
      expect(rl.moved).toMatchObject({ chunks: 1 });
      const labels = (await call('GET', '/metadata/labels?group=navigation')).json;
      expect(labels.some((l: any) => l.id === label.id)).toBe(false); // in der Historie: nicht mehr zuweisbar
      expect(labels.find((l: any) => l.id === rl.successor.id)).toMatchObject({ nameDe: 'Pausieren', validFrom: '2026.3' });
      expect((await call('PATCH', `/metadata/labels/${label.id}`, { archived: false })).status).toBe(400);

      // Kapitel ablösen: das alte verschwindet aus Kapitelliste und Handbuch, die Historie steht im Anhang
      expect((await call('POST', '/structure/replace', { kind: 'chapter', id: old.id }, 'u-redaktion')).status).toBe(400);
      const rc = (await call('POST', '/structure/replace', { kind: 'chapter', id: old.id, replacementId: neu.id, validFrom: '2026.3' }, 'u-redaktion')).json;
      expect(rc.successor).toEqual({ id: neu.id, title: '2. Vertrag pausieren' });
      expect((await call('POST', '/structure/replace', { kind: 'chapter', id: old.id, replacementId: neu.id }, 'u-redaktion')).status).toBe(409);
      expect((await call('GET', '/chapters')).json.map((c: any) => c.id)).not.toContain(old.id);
      const hist = (await call('GET', '/structure/history', undefined, 'u-leser')).json.items;
      expect(hist.map((h: any) => [h.kind, h.title, h.validFrom, h.validUntil, h.replacedBy.title])).toEqual([
        ['chapter', '1. Vertrag aussetzen', '2025.1', '2026.3', '2. Vertrag pausieren'],
        ['label', 'Aussetzen', '2025.1', '2026.3', 'Pausieren'],
      ]);
      const exp = (await call('POST', '/exports', { format: 'md' }, 'u-redaktion')).json;
      const md = (await call('GET', `/exports/${exp.id}/download`)).body;
      expect(md).not.toContain('## 1. Vertrag aussetzen');
      expect(md).toMatch(/## 2\. Vertrag pausieren\n\n\*Freigegebene Version 1 vom \d{4}-\d{2}-\d{2} · Gültig ab 2026\.3\*/);
      expect(md).toContain('## Historie: abgelöste Funktionen');
      expect(md).toContain('| Kapitel | 1. Vertrag aussetzen | 2025.1 – 2026.3 | 2. Vertrag pausieren |  |');
      expect(md).toContain('| Label | Aussetzen | 2025.1 – 2026.3 | Pausieren | Menüpunkt umbenannt |');
      for (const format of ['html', 'pdf', 'docx']) expect((await call('POST', '/exports', { format }, 'u-redaktion')).status).toBe(201);
      const html = (await call('GET', `/exports/${(await call('POST', '/exports', { format: 'html', reading: true }, 'u-redaktion')).json.id}/download`)).body;
      expect(html).toContain('Historie: abgelöste Funktionen');
      expect(html).toContain('Gültig ab 2026.3'); // auch in der Lesefassung

      // zurückholen
      const back = (await call('POST', `/structure/history/${hist[0].id}/restore`, {}, 'u-redaktion')).json.items;
      expect(back.map((h: any) => h.kind)).toEqual(['label']);
      expect((await call('GET', '/chapters')).json.map((c: any) => c.id)).toContain(old.id);
      expect((await call('POST', `/structure/history/${hist[1].id}/restore`, {}, 'u-redaktion')).status).toBe(403); // Labels: Administration

      // Unterkapitel ablösen mit neuem Nachfolger: Anweisung wird übernommen
      const s1 = (await call('POST', `/structure/chapters/${neu.id}/subchapters`, { title: '2.1 Pause erfassen', excluded: ['Inflation'] }, 'u-redaktion')).json;
      const rs = (await call('POST', '/structure/replace', { kind: 'subchapter', id: s1.id, newTitle: '2.1 Pause anlegen', validFrom: '2026.4' }, 'u-redaktion')).json;
      const st = (await call('GET', '/structure?history=true')).json.chapters.find((c: any) => c.id === neu.id);
      expect(st.subchapters.map((s: any) => [s.title, s.inHistory, s.validFrom, s.instruction.excluded]).sort()).toEqual([
        ['2.1 Pause anlegen', false, '2026.4', ['Inflation']],
        ['2.1 Pause erfassen', true, null, ['Inflation']],
      ]);
      expect(rs.successor.title).toBe('2.1 Pause anlegen');
      const ex = (await call('GET', '/structure/instructions/export')).json;
      expect(ex.format).toBe('onescm-instructions');
      expect(ex.chapters.find((c: any) => c.title === '2. Vertrag pausieren').subchapters[0].markdown).toContain('- Inflation');
    } finally {
      await built.app.close();
    }
  });
});
