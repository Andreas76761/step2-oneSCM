import fs from 'node:fs';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { getSettings } from '../src/context.js';
import { openDb } from '../src/db.js';
import { detectPrivacy } from '../src/domain/privacy.js';
import { subtitlesToMarkdown } from '../src/domain/subtitles.js';
import { checkWarning } from '../src/domain/warnings.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const VTT = `WEBVTT

intro
00:00:01.000 --> 00:00:05.000
Willkommen zur Schulung Vertragsverwaltung.

Kapitel: Anmelden
00:00:45.000 --> 00:00:48.000
Anmelden

a1
00:00:46.000 --> 00:00:52.000
Melden Sie sich mit Ihrer Benutzerkennung an.
`;

describe('Etappe 95', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-418] Warnblock ohne Signalwort im Text, Einleitung vor der ersten Kapitelmarke, Namen in einem Ausdruck, alte Importeinstellungen (Einheit)', async () => {
    // Block der Art „Warnung“: das Signalwort setzt der Export – Folge und Vermeidung zählen weiter
    const ok = checkWarning('Der Vertrag wird sonst storniert. Prüfen Sie vorher die Frist.', { kind: 'warning' })!;
    expect(ok.missing).toEqual([]);
    expect(ok.level).toBe('warning');
    expect(checkWarning('Das ist so.', { kind: 'warning' })!.missing).toEqual(expect.arrayContaining(['consequence']));
    expect(checkWarning('Das ist so.', { kind: 'warning' })!.missing).not.toContain('standard_signal');
    // im Fließtext bleibt das Signalwort Pflicht
    expect(checkWarning('Achtung: Der Vertrag wird sonst storniert. Prüfen Sie vorher die Frist.')!.missing).toContain('standard_signal');

    // Untertitel: Text vor der ersten Kapitelmarke geht nicht verloren
    const md = subtitlesToMarkdown(VTT, 'Schulung').markdown;
    expect(md).toContain('Willkommen zur Schulung Vertragsverwaltung.');
    expect(md.indexOf('Willkommen')).toBeLessThan(md.indexOf('## Anmelden'));

    // Namen: ein gemeinsamer Ausdruck, längster Name zuerst, Wortgrenzen mit Umlauten
    const names = ['Kowalski', 'Erika Musterfrau', 'Müller'];
    expect(detectPrivacy('Rückruf bei Erika Musterfrau und Frau Müller.', { names }).map((h) => h.kind)).toEqual(['name', 'name']);
    expect(detectPrivacy('Die Müllerei liefert.', { names })).toEqual([]);
    expect(detectPrivacy('Kowalski', { names: ['ko', ...names] }).length).toBe(1);

    // gespeicherte Importeinstellungen von vor v0.29 bekommen die neuen Formate
    const db = await openDb(await freshDatabase(dataDir, 'e95m'));
    try {
      await db.run("INSERT INTO settings (key, value) VALUES ('import', ?)", JSON.stringify({ maxUploadBytes: 1000, allowedExtensions: ['.md', '.markdown', '.zip', '.html', '.htm', '.docx'] }));
      for (const stmt of fs.readFileSync(path.join(import.meta.dirname, '../migrations/065_import_extensions.sql'), 'utf8').split(';').map((x) => x.replace(/^--.*$/gm, '').trim()).filter(Boolean)) await db.run(stmt);
      expect((await getSettings(db)).import.allowedExtensions).toEqual(expect.arrayContaining(['.xml', '.csv', '.pptx', '.pdf', '.mp4', '.vtt', '.srt']));
    } finally {
      await db.close();
    }
  });

  it('[T-419] FAQ-Übersetzung mit Namensliste, Quick Guide ohne doppelte Warnungen, Grenze der Suche gemeldet, Bildarchiv', async () => {
    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'e95'), logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any);
    const call = client(built);
    try {
      await call('PATCH', '/projects/p_default', { languages: ['en'] });
      // FAQ-Übersetzung: gepflegter Klarname geht nicht an einen externen KI-Dienst
      expect((await call('PUT', '/settings', { privacy: { names: ['Erika Musterfrau'] } })).status).toBe(200);
      const faq = (await call('POST', '/faq', { question: 'Wer hilft beim Vertrag?', answer: 'Ansprechpartnerin ist Erika Musterfrau aus dem Vertrieb.', status: 'published' }, 'u-redaktion')).json;
      built.ctx.llm = { ...built.ctx.llm!, external: true } as any;
      const blocked = await call('POST', `/faq/${faq.id}/translations/en/machine`, {}, 'u-redaktion');
      expect(blocked.status).toBe(400);
      expect(blocked.json.detail).toContain('personenbezogene Daten');
      built.ctx.llm = { ...built.ctx.llm!, external: false } as any;

      // Quick Guide: Warnung aus „Voraussetzungen“ nur einmal
      await importFile(built, 'k.md', `${FM}# Vertrag kündigen\n\n## Kündigen\n\nMit dieser Anleitung kündigen Sie einen Vertrag.\n\n1. Öffnen Sie **Verträge**.\n2. Klicken Sie auf **Kündigen**.\n`);
      const chapterId = (await call('GET', '/chapters')).json.find((c: any) => c.title === 'Vertrag kündigen').id;
      const v = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
      const warn = 'Prüfen Sie vorher die Frist, sonst wird die Kündigung abgelehnt.';
      expect((await call('POST', `/chapter-versions/${v.id}/content-blocks`, { section: 'prerequisites', kind: 'warning', text: warn, reason: 'Test', justification: 'Fachliche Vorgabe der Redaktion' }, 'u-redaktion')).status).toBe(201);
      for (const b of (await call('GET', `/chapter-versions/${v.id}`)).json.sections.flatMap((s: any) => s.blocks)) {
        if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
        else if (b.scopeStatus === 'unconfirmed') await call('PATCH', `/content-blocks/${b.id}`, { scopeStatus: 'general', reason: 'allgemein' }, 'u-redaktion');
      }
      const sub = await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion');
      expect(sub.status, JSON.stringify(sub.json)).toBe(200);
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      const e = (await call('POST', '/exports', { format: 'md', chapterIds: [chapterId], profile: 'quickguide' }, 'u-leser')).json;
      const body = (await call('GET', e.downloadUrl.replace('/api/v1', ''), undefined, 'u-leser')).body as string;
      expect(body.split(warn).length - 1).toBe(1);

      // Frage an alle Quellen: Grenze erreicht → gemeldet statt still gekürzt
      process.env.ASK_MAX_UNITS = '1';
      try {
        const r = (await call('POST', '/metadata/ask', { question: 'Wie kündige ich einen Vertrag?' }, 'u-leser')).json;
        expect(r.truncated).toBe(true);
        expect(r.notice).toContain('nur die ersten 1 Chunks');
      } finally {
        delete process.env.ASK_MAX_UNITS;
      }
      expect((await call('POST', '/metadata/ask', { question: 'Wie kündige ich einen Vertrag?' }, 'u-leser')).json.truncated).toBe(false);

      // Bildarchiv und Deckungsmatrix aus dem gemeinsamen Verwendungsindex
      expect((await call('GET', '/image-archive')).status).toBe(200);
      expect((await call('GET', '/image-archive/coverage')).status).toBe(200);
    } finally {
      await built.app.close();
    }
  });
});
