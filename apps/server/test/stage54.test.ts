import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { cachedOverview, touchMetadata } from '../src/services/metadataCache.js';
import { client, FM, importFile } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const HINWEIS = 'Speichern Sie Ihre Eingaben regelmäßig, da die Sitzung nach 30 Minuten ohne Aktivität endet und ungespeicherte Daten verloren gehen.';

describe('Etappe 54', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' } } as any));

  async function chapter(built: Awaited<ReturnType<typeof build>>, title: string, extra: string, approve: boolean) {
    const call = client(built);
    await importFile(built, `${title}.md`, `${FM}# ${title}\n\n## ${title}\n\nMit dieser Anleitung ${extra}.\n\n1. Öffnen Sie **Verträge**.\n2. Klicken Sie auf **Neu**.\n\n${HINWEIS}\n`);
    const chapterId = (await call('GET', '/chapters')).json.find((c: any) => c.title === title).id;
    const v = (await call('POST', `/chapters/${chapterId}/generate`, {}, 'u-redaktion')).json;
    if (approve) {
      for (const b of v.sections.flatMap((s: any) => s.blocks)) {
        if (b.kind === 'gap') await call('DELETE', `/content-blocks/${b.id}?reason=entfällt`, undefined, 'u-redaktion');
        else if (b.scopeStatus === 'unconfirmed') await call('PATCH', `/content-blocks/${b.id}`, { scopeStatus: 'general', reason: 'allgemein' }, 'u-redaktion');
      }
      expect((await call('POST', `/chapter-versions/${v.id}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${v.id}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
    }
    return { chapterId, versionId: v.id as string };
  }
  const texts = (v: any) => v.sections.flatMap((s: any) => s.blocks.map((b: any) => b.text));

  it('[T-341] Zwischenspeicher der Übersicht: höchstens 30 s, sofort verworfen bei Änderungen (Einheit)', async () => {
    let n = 0;
    const compute = async () => ++n;
    expect(await cachedOverview('p1', compute, 1_000)).toBe(1);
    expect(await cachedOverview('p1', compute, 20_000)).toBe(1);
    expect(await cachedOverview('p2', compute, 20_000)).toBe(2);
    expect(await cachedOverview('p1', compute, 31_001)).toBe(3);
    touchMetadata('p1');
    expect(await cachedOverview('p1', compute, 31_002)).toBe(4);
  });

  it('[T-342] Übersicht oneSCM_Metadaten bleibt nach Import und Labeln aktuell', async () => {
    const built = await build('overview');
    const call = client(built);
    try {
      await importFile(built, 'a.md', `${FM}# A\n\n## Erster\n\nText eins über Verträge.\n`);
      const before = (await call('GET', '/metadata/overview', undefined, 'u-leser')).json;
      expect(before.documents).toBe(1);
      await importFile(built, 'b.md', `${FM}# B\n\n## Zweiter\n\nText zwei über Rechnungen.\n`);
      const after = (await call('GET', '/metadata/overview', undefined, 'u-leser')).json;
      expect(after.documents).toBe(2);
      // Labeln ändert die Zahl gelabelter Chunks sofort (der Agent TRIAGE hat sie schon gelabelt – Labels entfernen und setzen)
      const chunk = (await call('GET', '/metadata/chunks?limit=5', undefined, 'u-leser')).json.items[0];
      const label = (await call('GET', '/metadata/labels?group=domain', undefined, 'u-leser')).json[0];
      const labels = chunk.labels.map((l: any) => l.id);
      if (labels.length) await call('POST', '/metadata/chunks/labels', { snippetIds: [chunk.id], remove: labels }, 'u-redaktion');
      const less = (await call('GET', '/metadata/overview', undefined, 'u-leser')).json.labeledChunks;
      await call('POST', '/metadata/chunks/labels', { snippetIds: [chunk.id], add: [label.id] }, 'u-redaktion');
      expect((await call('GET', '/metadata/overview', undefined, 'u-leser')).json.labeledChunks).toBe(less + 1);
    } finally {
      await built.app.close();
    }
  });

  it('[T-343] Textbausteine: anlegen, aus wiederkehrendem Absatz übernehmen, einfügen, neue Fassung in Entwürfe übernehmen, eigener Text löst die Verknüpfung', async () => {
    const built = await build('module');
    const call = client(built);
    try {
      const a = await chapter(built, 'Vertrag anlegen', 'legen Sie einen Vertrag an', true);
      const b = await chapter(built, 'Vertrag kündigen', 'kündigen Sie einen Vertrag', false);
      const c = await chapter(built, 'Vertrag ändern', 'ändern Sie einen Vertrag', false);
      // wiederkehrender Absatz in drei Kapiteln
      const cand = (await call('GET', '/text-modules/candidates', undefined, 'u-leser')).json;
      const hit = cand.find((x: any) => x.text === HINWEIS);
      expect(hit.chapters).toHaveLength(3);

      expect((await call('POST', '/text-modules', { title: 'Sitzung', text: HINWEIS }, 'u-leser')).status).toBe(403);
      expect((await call('POST', '/text-modules', { title: '', text: HINWEIS }, 'u-redaktion')).status).toBe(400);
      const m = (await call('POST', '/text-modules', { title: 'Hinweis Sitzung', text: HINWEIS, kind: 'note' }, 'u-redaktion')).json;
      expect(m).toMatchObject({ key: 'hinweis-sitzung', versionNo: 1, chapters: 0, status: 'active' });
      expect(m.candidates.map((x: any) => x.chapterId).sort()).toEqual([a.chapterId, b.chapterId, c.chapterId].sort());
      expect((await call('POST', '/text-modules', { title: 'Hinweis Sitzung', text: 'x' }, 'u-redaktion')).status).toBe(409);

      // vorhandene Absätze übernehmen: Entwürfe direkt, freigegebenes Kapitel über einen neuen Entwurf
      const adopt = (await call('POST', `/text-modules/${m.id}/propagate`, { adopt: true }, 'u-redaktion')).json;
      expect(adopt.updated).toHaveLength(3);
      expect(adopt.module).toMatchObject({ chapters: 3, outdatedChapters: 0 });
      const draftA = adopt.updated.find((u: any) => u.chapterId === a.chapterId).versionId;
      expect(draftA).not.toBe(a.versionId);
      expect((await call('GET', `/chapter-versions/${a.versionId}`)).json.status).toBe('approved');
      const linkedA = (await call('GET', `/chapter-versions/${draftA}`)).json.sections.flatMap((s: any) => s.blocks).find((x: any) => x.text === HINWEIS);
      expect(linkedA).toMatchObject({ moduleId: m.id, moduleVersion: 1 });

      // neue Fassung → veraltet → in die Entwürfe übernehmen
      const NEU = HINWEIS.replace('30 Minuten', '45 Minuten');
      const m2 = (await call('PATCH', `/text-modules/${m.id}`, { text: NEU, note: 'Sitzungsdauer verlängert' }, 'u-redaktion')).json;
      expect(m2).toMatchObject({ versionNo: 2, outdatedChapters: 3 });
      expect(m2.versions.map((v: any) => v.versionNo)).toEqual([2, 1]);
      expect(m2.usage.every((u: any) => u.outdated)).toBe(true);
      // eingereichte Kapitel werden übersprungen
      const draftB = (await call('GET', '/chapters')).json.find((x: any) => x.id === b.chapterId).versions.sort((x: any, y: any) => y.versionNo - x.versionNo)[0].id;
      for (const blk of (await call('GET', `/chapter-versions/${draftB}`)).json.sections.flatMap((s: any) => s.blocks)) {
        if (blk.kind === 'gap') await call('DELETE', `/content-blocks/${blk.id}?reason=entfällt`, undefined, 'u-redaktion');
        else if (blk.scopeStatus === 'unconfirmed') await call('PATCH', `/content-blocks/${blk.id}`, { scopeStatus: 'general', reason: 'allgemein' }, 'u-redaktion');
      }
      expect((await call('POST', `/chapter-versions/${draftB}/submit`, {}, 'u-redaktion')).status).toBe(200);
      const prop = (await call('POST', `/text-modules/${m.id}/propagate`, {}, 'u-redaktion')).json;
      expect(prop.updated.map((u: any) => u.chapterId).sort()).toEqual([a.chapterId, c.chapterId].sort());
      expect(prop.skipped).toMatchObject([{ chapterId: b.chapterId }]);
      expect(texts((await call('GET', `/chapter-versions/${draftA}`)).json)).toContain(NEU);
      expect(prop.module.outdatedChapters).toBe(1);

      // einfügen in ein Kapitel (Abschnitt „Hinweise“)
      const ins = await call('POST', `/text-modules/${m.id}/insert`, { chapterId: c.chapterId, section: 'hints' }, 'u-redaktion');
      expect(ins.status).toBe(201);
      const vc = (await call('GET', `/chapter-versions/${ins.json.versionId}`)).json;
      const inserted = vc.sections.find((s: any) => s.code === 'hints').blocks.find((x: any) => x.id === ins.json.blockId);
      expect(inserted).toMatchObject({ text: NEU, kind: 'note', mode: 'locked', moduleId: m.id, moduleVersion: 2 });
      expect((await call('POST', `/text-modules/${m.id}/insert`, { chapterId: c.chapterId, section: 'nirgends' }, 'u-redaktion')).status).toBe(400);

      // eigener Text löst die Verknüpfung
      const own = await call('PATCH', `/content-blocks/${inserted.id}`, { text: 'Eigener Hinweis für dieses Kapitel.', mode: 'manually_edited', reason: 'eigene Fassung' }, 'u-redaktion');
      expect(own.json).toMatchObject({ moduleId: null, moduleVersion: null });
      // abgelegt: nicht mehr einfügbar
      await call('PATCH', `/text-modules/${m.id}`, { status: 'retired' }, 'u-redaktion');
      expect((await call('POST', `/text-modules/${m.id}/insert`, { chapterId: c.chapterId, section: 'hints' }, 'u-redaktion')).status).toBe(409);
      expect((await call('GET', '/text-modules?status=retired', undefined, 'u-leser')).json.map((x: any) => x.id)).toEqual([m.id]);
      // Export: verknüpfte Absätze erscheinen als normaler Text
      expect((await call('GET', `/text-modules/${m.id}`, undefined, 'u-leser')).json.versions[0].note).toBe('Sitzungsdauer verlängert');
    } finally {
      await built.app.close();
    }
  });
});
