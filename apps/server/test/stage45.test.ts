import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { parseJiraCsv } from '../src/domain/jira.js';
import { cleanDate, germanDate, placeOf, suggestChapter } from '../src/domain/workAreas.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const HEAD = 'Summary,Issue key,Issue Type,Status,Component/s,Created,Custom field (Stream),Custom field (Production Date),Description';
const future = `${new Date().getFullYear() + 1}-03-15`;

describe('Etappe 45', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  it('[T-301] Einordnung nach Status und Produktionsdatum, Datum, Kapitelvorschlag, Stream und Produktionsdatum aus dem Jira-Export (Einheit)', () => {
    const today = '2026-10-24';
    expect(placeOf({ status: 'In Progress' }, today)).toBe('pipeline');
    expect(placeOf({ status: 'BAT Testing' }, today)).toBe('pipeline');
    expect(placeOf({ status: 'Blocked BAT Testing' }, today)).toBe('pipeline');
    expect(placeOf({ status: 'Offen' }, today)).toBe('backlog');
    expect(placeOf({ status: 'PI Backlog' }, today)).toBe('backlog');
    expect(placeOf({ status: 'Fertig', productionDate: '2026-11-01' }, today)).toBe('pipeline'); // erledigt, aber noch nicht produktiv
    expect(placeOf({ status: 'Fertig', productionDate: '2026-10-01' }, today)).toBe('live');
    expect(placeOf({ status: 'Done' }, today)).toBe('live');
    expect(placeOf({ status: 'Cancelled' }, today)).toBe('cancelled');
    expect(cleanDate('15.03.2027')).toBe('2027-03-15');
    expect(cleanDate('2027-03-15')).toBe('2027-03-15');
    expect(cleanDate('31.02.2027')).toBe('invalid');
    expect(cleanDate('')).toBeNull();
    expect(germanDate('2027-03-15')).toBe('15.03.2027');
    const outline = [
      { chapterId: 'c1', chapterTitle: '3. Vertragsverwaltung', subchapters: [{ id: 's1', title: '3.1 Vertrag anlegen' }, { id: 's2', title: '3.2 Vertrag kündigen' }] },
      { chapterId: 'c2', chapterTitle: '7. Reporting', subchapters: [] },
    ];
    expect(suggestChapter('Neuer Button beim Vertrag kündigen', outline)).toMatchObject({ chapterId: 'c1', subchapterId: 's2' });
    expect(suggestChapter('Export im Reporting erweitern', outline)).toMatchObject({ chapterId: 'c2', subchapterId: null });
    expect(suggestChapter('Login-Seite überarbeiten', outline)).toBeNull();
    const [t] = parseJiraCsv([HEAD, `Vertrag kündigen,ONESCM-9,Story,In Progress,Contracts,01.10.2026,Stream A,15.03.2027,Text`].join('\n'))!;
    expect(t).toMatchObject({ key: 'ONESCM-9', stream: 'Stream A', productionDate: '2027-03-15', created: '2026-10-01' });
  });

  it('[T-302] Jira-Tickets → Pipeline je Gliederung (Erstelldatum, Stream, Produktionsdatum), Backlog, Statuswechsel, produktiv → übernehmen', async () => {
    const built = await build('t302');
    const call = client(built);
    try {
      await importFile(built, 'kapitel.md', `${FM}# 3. Vertragsverwaltung\n\n## 3.1 Vertrag anlegen\n\nSie legen einen Vertrag an.\n\n## 3.2 Vertrag kündigen\n\nSie kündigen einen Vertrag.\n`);
      const rows = [
        `Kündigungsgrund beim Vertrag kündigen,ONESCM-1,Story,In Progress,Contracts,01.10.2026,Stream A,${future},Neues Pflichtfeld`,
        'Vertrag anlegen mit Vorlage,ONESCM-2,Story,PI Backlog,Contracts,02.10.2026,Stream B,,Idee',
        'Absturz beim Speichern,ONESCM-3,Bug,In Progress,Contracts,03.10.2026,,,Fehler',
        'Altes Feature,ONESCM-4,Story,Fertig,Contracts,01.01.2026,Stream A,01.02.2026,Erledigt',
        'Login-Seite überarbeiten,ONESCM-5,Story,In Progress,,04.10.2026,,,Text',
      ];
      await importFile(built, 'jira.csv', Buffer.from([HEAD, ...rows].join('\n')));
      const sync = await call('POST', '/work-areas/sync-jira', {}, 'u-redaktion');
      expect(sync.status).toBe(200);
      expect(sync.json).toMatchObject({ tickets: 5, created: 3, skipped: 2 }); // Bug und produktives Ticket ohne Eintrag
      expect((await call('POST', '/work-areas/sync-jira', {}, 'u-lesen')).status).toBe(403);
      const pipe = (await call('GET', '/work-areas?area=pipeline')).json;
      const one = pipe.items.find((i: any) => i.jiraKey === 'ONESCM-1');
      expect(one).toMatchObject({ area: 'pipeline', stream: 'Stream A', createdOn: '2026-10-01', productionDate: future, chapterSource: 'suggested', subchapterTitle: '3.2 Vertrag kündigen', state: 'open', documented: false });
      // Gruppen je Kapitel → Unterkapitel; ohne Vorschlag unter „ohne Zuordnung“
      expect(pipe.groups[0].subchapters[0]).toMatchObject({ title: '3.2 Vertrag kündigen', items: [one.id] });
      const five = pipe.items.find((i: any) => i.jiraKey === 'ONESCM-5');
      expect(pipe.unassigned).toEqual([five.id]);
      expect(pipe.counts).toMatchObject({ pipeline: 2, backlog: 1, intern: 0 });
      const backlog = (await call('GET', '/work-areas?area=backlog')).json.items;
      expect(backlog.map((i: any) => i.jiraKey)).toEqual(['ONESCM-2']);
      // bereits dokumentiert; Produktionsdatum von Hand geändert bleibt beim nächsten Abgleich
      const later = `${new Date().getFullYear() + 1}-06-30`;
      const doc = await call('PATCH', `/work-areas/${one.id}`, { text: '1. Öffnen Sie den Vertrag.\n2. Wählen Sie den Kündigungsgrund.', productionDate: later.split('-').reverse().join('.') }, 'u-redaktion');
      expect(doc.json).toMatchObject({ state: 'documented', documented: true, productionDate: later });
      // Statuswechsel: Backlog → Pipeline, Pipeline → produktiv, Ticket 1 bleibt mit eigenem Datum
      const rows2 = [
        `Kündigungsgrund beim Vertrag kündigen,ONESCM-1,Story,Fertig,Contracts,01.10.2026,Stream A,${future},Neues Pflichtfeld`,
        'Vertrag anlegen mit Vorlage,ONESCM-2,Story,In Progress,Contracts,02.10.2026,Stream B,,Idee',
        'Login-Seite überarbeiten,ONESCM-5,Story,Cancelled,,04.10.2026,,,Text',
      ];
      await importFile(built, 'jira2.csv', Buffer.from([HEAD, ...rows2].join('\n')));
      const s2 = (await call('POST', '/work-areas/sync-jira', {}, 'u-redaktion')).json;
      expect(s2).toMatchObject({ moved: 1, cancelled: 1, ready: 0 });
      const after = (await call('GET', '/work-areas')).json.items;
      const byKey = (k: string) => after.find((i: any) => i.jiraKey === k);
      expect(byKey('ONESCM-1')).toMatchObject({ productionDate: later, state: 'documented', jiraStatus: 'Fertig' }); // Produktionsdatum noch nicht erreicht
      expect(byKey('ONESCM-2')).toMatchObject({ area: 'pipeline' });
      expect(byKey('ONESCM-5')).toMatchObject({ state: 'cancelled' });
      // Produktionsdatum erreicht → „produktiv – ins Handbuch übernehmen“
      await call('PATCH', `/work-areas/${one.id}`, { productionDate: '01.01.2026' }, 'u-redaktion');
      expect((await call('POST', '/work-areas/sync-jira', {}, 'u-redaktion')).json.ready).toBe(1);
      expect((await call('GET', `/work-areas/${one.id}`)).json).toMatchObject({ state: 'ready', stateLabel: 'produktiv – ins Handbuch übernehmen' });
      // Jira-Einträge werden nicht gelöscht
      expect((await call('DELETE', `/work-areas/${one.id}`, undefined, 'u-redaktion')).status).toBe(409);
    } finally {
      await built.app.close();
    }
  });

  it('[T-303] Intern mit sechs Themen, eigene Einträge, Datenschutz, Übernahme ins Handbuch als Quelle des Unterkapitels, Export für den Arbeitsordner', async () => {
    const built = await build('t303');
    const call = client(built);
    try {
      await importFile(built, 'kapitel.md', `${FM}# 3. Vertragsverwaltung\n\n## 3.2 Vertrag kündigen\n\nSie kündigen einen Vertrag.\n`);
      const structure = (await call('GET', '/structure')).json.chapters[0];
      // Intern: Thema Pflicht, sechs Themen
      expect((await call('POST', '/work-areas', { area: 'intern', title: 'Testkonzept PI 17' }, 'u-redaktion')).status).toBe(400);
      for (const topic of ['testing', 'reporting', 'systems', 'migration', 'rollout', 'other']) {
        expect((await call('POST', '/work-areas', { area: 'intern', topic, title: `Notiz ${topic}`, text: 'Intern.' }, 'u-redaktion')).status).toBe(201);
      }
      const intern = (await call('GET', '/work-areas?area=intern&topic=migration')).json;
      expect(intern.items).toHaveLength(1);
      expect(intern.topicCounts).toEqual({ testing: 1, reporting: 1, systems: 1, migration: 1, rollout: 1, other: 1 });
      expect(intern.topicLabels.systems).toBe('Systeme');
      // Datenschutz: abweisen oder pseudonymisieren
      const bad = await call('POST', '/work-areas', { area: 'intern', topic: 'other', title: 'Rückruf', text: 'Bitte kowalski@autohaus-muster.de anrufen.' }, 'u-redaktion');
      expect(bad.status).toBe(422);
      const ok = await call('POST', '/work-areas', { area: 'intern', topic: 'other', title: 'Rückruf', text: 'Bitte kowalski@autohaus-muster.de anrufen.', pseudonymize: true }, 'u-redaktion');
      expect(ok.json.text).not.toContain('kowalski@');
      expect((await call('DELETE', `/work-areas/${ok.json.id}`, undefined, 'u-redaktion')).status).toBe(204);
      // eigener Pipeline-Eintrag mit Gliederung; Übernahme erst mit Text und Kapitel
      const sub = structure.subchapters[0];
      const p = (await call('POST', '/work-areas', { area: 'pipeline', title: 'Kündigungsgrund', jiraKey: 'onescm-77', stream: 'Stream C', productionDate: '2026-01-01' }, 'u-redaktion')).json;
      expect(p).toMatchObject({ jiraKey: 'ONESCM-77', state: 'open', chapterId: null });
      expect((await call('POST', '/work-areas', { area: 'backlog', title: 'Doppelt', jiraKey: 'ONESCM-77' }, 'u-redaktion')).status).toBe(409);
      expect((await call('POST', `/work-areas/${p.id}/go-live`, {}, 'u-redaktion')).status).toBe(422);
      await call('PATCH', `/work-areas/${p.id}`, { subchapterId: sub.id, text: '# Kündigungsgrund wählen\n\nWählen Sie im Feld „Grund“ den Kündigungsgrund.' }, 'u-redaktion');
      const live = await call('POST', `/work-areas/${p.id}/go-live`, {}, 'u-redaktion');
      expect(live.status).toBe(200);
      expect(live.json.item).toMatchObject({ state: 'live', chapterId: structure.id, subchapterTitle: sub.title });
      // als Quelle des Unterkapitels eingelesen, Evidenz unbestätigt
      const fromPipeline = (await call('GET', `/snippets?subchapterId=${sub.id}&q=Kündigungsgrund`)).json.items;
      expect(fromPipeline.length).toBeGreaterThan(0);
      expect(fromPipeline.every((s: any) => s.evidenceStatus === 'unconfirmed')).toBe(true);
      expect((await call('PATCH', `/work-areas/${p.id}`, { text: 'x' }, 'u-redaktion')).status).toBe(409);
      // Export für den Arbeitsordner
      const exp = (await call('GET', '/work-areas/export')).json;
      expect(exp.format).toBe('onescm-work-areas');
      expect(exp.intern.map((i: any) => i.topicFolder).sort()).toEqual(['01_Testing', '02_Reporting', '03_Systeme', '04_Migration', '05_Rollout', '06_Other']);
      expect(exp.pipeline[0].markdown).toContain('| Produktionsdatum | 01.01.2026 |');
      expect(exp.pipeline[0].markdown).toContain('| Stream | Stream C |');
      expect(exp.intern[0].markdown).toContain('Intern – nicht für das Handbuch');
    } finally {
      await built.app.close();
    }
  });
});
