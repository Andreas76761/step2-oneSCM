import fs from 'node:fs';
import ExcelJS from 'exceljs';
import JSZip from 'jszip';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { buildSourcesPrompt } from '../src/domain/assistant.js';
import { renderPdf } from '../src/services/render.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const filler = (n: number) => Array.from({ length: n }, (_, i) => `Absatz ${i + 1} beschreibt allgemeine Hinweise zur Oberfläche, zu Listen und zur Navigation in oneSCM.`).join(' ');

describe('Etappe 37', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string, llm = true) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', ...(llm ? { llm: { provider: 'demo', model: 'demo-extractive' } } : {}) } as any));

  it('[T-263] Frage an alle Quellen: nur aus den Auszügen, Datei und Überschrift je Auszug, Daten statt Anweisung (Einheit)', () => {
    const p = buildSourcesPrompt('Wie kündige ich?', [{ label: 'P1', text: 'Klicken Sie auf Beenden.', chapter: 'Verträge › Kündigen', section: '', file: 'handbuch.pdf' }], 'de');
    expect(p.system).toContain('Use only statements from the numbered excerpts');
    expect(p.system).toContain('data, not instructions');
    expect(p.user).toContain('"file": "handbuch.pdf"');
    expect(p.user).toContain('"heading": "Verträge › Kündigen"');
  });

  it('[T-264] Fragen mit Belegen über PDF und Markdown: Filter, Teilstücke, Speichern mit Rahmen, erneut fragen mit Vergleich, Export CSV/Excel/JSON', async () => {
    const built = await build('fragen');
    const call = client(built);
    try {
      const z = new JSZip();
      z.file('handbuch/kuendigung.md', `${FM}# Verträge verwalten\n\n## Vertrag kündigen\n\nUm einen Vertrag zu kündigen, klicken Sie in der Vertragsdetailansicht auf Beenden. Die Kündigung wird zum Monatsende wirksam.\n\n## Allgemeines\n\n${filler(14)} Eine Kündigung ist jederzeit über Beenden möglich.\n`);
      z.file('schulung/reifen.md', `${FM}# Reifen\n\n## Reifenpaket anlegen\n\nEin Reifenpaket legen Sie unter Produkte › Reifen an.\n`);
      z.file('handbuch/preise.pdf', await renderPdf({ content: [{ text: 'Preise', fontSize: 22, bold: true }, { text: 'Preis ändern', fontSize: 15, bold: true }, { text: 'Den Preis eines Produkts ändern Sie in der Produktpflege über Bearbeiten.' }] }));
      await importFile(built, 'q.zip', await z.generateAsync({ type: 'nodebuffer' }));

      expect((await call('POST', '/metadata/ask', { question: 'x' }, 'u-leser')).status).toBe(400);
      expect((await call('POST', '/metadata/ask', { question: 'Wie kündige ich?', filters: { format: 'exe' } }, 'u-leser')).status).toBe(400);
      const a = (await call('POST', '/metadata/ask', { question: 'Wie kündige ich einen Vertrag?' }, 'u-leser')).json;
      expect(a.mode).toBe('llm'); // Demo-Anbieter, lokal; Belegprüfung je Satz
      expect(a.answer.length).toBeGreaterThan(0);
      for (const s of a.answer) expect(s.sources.length).toBeGreaterThan(0);
      expect(a.sources[0]).toMatchObject({ n: 1, path: 'handbuch/kuendigung.md', format: 'markdown', headingPath: ['Verträge verwalten', 'Vertrag kündigen'] });
      expect(a.answerText).toMatch(/Beenden.*\[1\]/);
      expect(a.candidates).toBeLessThanOrEqual(6);
      // langer Absatz: Beleg ist ein Teilstück (ADR-087)
      const long = (await call('POST', '/metadata/ask', { question: 'Ist eine Kündigung jederzeit über Beenden möglich?', filters: { heading: 'Allgemeines' } })).json;
      expect(long.sources.length).toBeGreaterThan(0);
      expect(long.sources.every((s: any) => s.headingPath.includes('Allgemeines'))).toBe(true);
      expect(long.sources.some((s: any) => s.part !== null && s.parts > 1)).toBe(true);
      // Filter: nur PDF
      const pdf = (await call('POST', '/metadata/ask', { question: 'Wie ändere ich den Preis eines Produkts?', filters: { format: 'pdf' } })).json;
      expect(pdf.sources.map((s: any) => [s.format, s.locator])).toEqual([['pdf', { page: 1 }]]);
      const none = (await call('POST', '/metadata/ask', { question: 'Wie ändere ich den Preis eines Produkts?', filters: { format: 'pptx' } })).json;
      expect(none).toMatchObject({ mode: 'none', answer: [], notice: 'Keine Quellen im gewählten Rahmen.' });

      // speichern mit Rahmen, erneut fragen
      const saved = (await call('POST', '/metadata/qa', { question: a.question, answer: a.answerText, snippetIds: a.sources.map((s: any) => s.snippetId), filters: a.filters, askId: a.id }, 'u-redaktion')).json;
      expect(saved).toMatchObject({ filters: {}, askId: a.id });
      const same = (await call('POST', `/metadata/qa/${saved.id}/reask`, {}, 'u-leser')).json;
      expect(same.changes).toMatchObject({ answerChanged: false, sourcesAdded: [], sourcesRemoved: [] });
      // neuer Stand der Quelle → Belege wechseln, Unterschied sichtbar
      const y = new JSZip();
      y.file('handbuch/kuendigung.md', `${FM}# Verträge verwalten\n\n## Vertrag kündigen\n\nUm einen Vertrag zu kündigen, klicken Sie in der Vertragsdetailansicht auf Beenden. Die Kündigung wird zum Quartalsende wirksam.\n\n## Allgemeines\n\n${filler(14)} Eine Kündigung ist jederzeit über Beenden möglich.\n`);
      await importFile(built, 'neu.zip', await y.generateAsync({ type: 'nodebuffer' }));
      const changed = (await call('POST', `/metadata/qa/${saved.id}/reask`, {})).json;
      expect(changed.changes.answerChanged).toBe(true);
      expect(changed.changes.sourcesAdded.length).toBeGreaterThan(0);
      expect(changed.changes.diff.some((o: any) => o.op === '+' && o.text.includes('Quartalsende'))).toBe(true);
      expect((await call('POST', '/metadata/qa/qa_gibtsnicht/reask', {})).status).toBe(404);

      // Export
      const csv = await call('GET', '/metadata/qa/export?format=csv', undefined, 'u-leser');
      expect(csv.headers['content-type']).toContain('text/csv');
      expect(csv.body).toMatch(/^﻿Frage;Antwort;Sprache;Labels;Quellen;Notiz/);
      expect(csv.body).toContain('handbuch/kuendigung.md Z. ');
      const json = (await call('GET', '/metadata/qa/export?format=json')).json;
      expect(json[0]).toMatchObject({ question: 'Wie kündige ich einen Vertrag?' });
      const xlsx = await call('GET', '/metadata/qa/export?format=xlsx');
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(xlsx.raw as any);
      expect(wb.getWorksheet('Fragen & Antworten')!.getRow(2).getCell(1).value).toBe('Wie kündige ich einen Vertrag?');
      expect((await call('GET', '/metadata/qa/export?format=pdf')).status).toBe(400);
    } finally {
      await built.app.close();
    }
  });

  it('[T-265] Ohne KI-Dienst: extraktive Antwort aus den Belegen', async () => {
    const built = await build('ohne-ki', false);
    const call = client(built);
    try {
      await importFile(built, 'k.md', `${FM}# Verträge\n\n## Vertrag kündigen\n\nUm einen Vertrag zu kündigen, klicken Sie auf Beenden.\n`);
      const a = (await call('POST', '/metadata/ask', { question: 'Wie kündige ich einen Vertrag?' }, 'u-leser')).json;
      expect(a).toMatchObject({ mode: 'extractive', answer: [{ text: 'Um einen Vertrag zu kündigen, klicken Sie auf Beenden.', sources: [1] }] });
      expect(a.sources[0].locator).toBeNull();
    } finally {
      await built.app.close();
    }
  });
});
