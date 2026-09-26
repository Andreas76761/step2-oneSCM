import fs from 'node:fs';
import path from 'node:path';
import { brotliCompressSync, gzipSync } from 'node:zlib';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { client } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 22', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({
    dataDir, database, logger: false, webDist: null, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
  } as any));

  it('[T-197] Kapitelvorlagen duplizieren (auch mitgelieferte), exportieren und in ein anderes Projekt importieren', async () => {
    const built = await build('tpl-share');
    const call = client(built);
    try {
      const t = (await call('POST', '/chapter-templates', { name: 'Bestellung', description: 'Einkauf', steps: ['Öffnen Sie **Einkauf › Bestellungen**', 'Klicken Sie auf **Neu**'], hints: ['Eilig: markieren'] }, 'u-redaktion')).json;
      // duplizieren: Name „(Kopie)“, dann „(Kopie) (2)“ – auch für mitgelieferte Vorlagen
      const d1 = await call('POST', '/chapter-templates/duplicate', { id: t.id }, 'u-redaktion');
      expect(d1.status).toBe(201);
      expect(d1.json).toMatchObject({ name: 'Bestellung (Kopie)', description: 'Einkauf', steps: t.steps, hints: ['Eilig: markieren'], builtin: false });
      expect((await call('POST', '/chapter-templates/duplicate', { id: t.id }, 'u-redaktion')).json.name).toBe('Bestellung (Kopie) (2)');
      const b = (await call('POST', '/chapter-templates/duplicate', { id: 'create' }, 'u-redaktion')).json;
      expect(b).toMatchObject({ name: 'Datensatz anlegen (Kopie)', builtin: false });
      expect(b.steps.length).toBeGreaterThan(2);
      expect((await call('POST', '/chapter-templates/duplicate', { id: 'gibt-es-nicht' }, 'u-redaktion')).status).toBe(404);
      expect((await call('POST', '/chapter-templates/duplicate', {}, 'u-redaktion')).status).toBe(400);
      expect((await call('POST', '/chapter-templates/duplicate', { id: t.id }, 'u-leser')).status).toBe(403);
      // exportieren: alle oder ausgewählte; Datei ohne IDs und Personen
      const all = await call('GET', '/chapter-templates/export', undefined, 'u-leser');
      expect(all.status).toBe(200);
      expect(all.headers['content-disposition']).toMatch(/attachment; filename="kapitelvorlagen-\d{4}-\d{2}-\d{2}\.json"/);
      expect(all.json).toMatchObject({ format: 'onescm-chapter-templates', version: 1 });
      expect(all.json.templates.map((x: any) => x.name)).toEqual(['Bestellung', 'Bestellung (Kopie)', 'Bestellung (Kopie) (2)', 'Datensatz anlegen (Kopie)']);
      expect(Object.keys(all.json.templates[0]).sort()).toEqual(['description', 'hints', 'name', 'prerequisites', 'purpose', 'result', 'steps', 'titleHint']);
      const one = (await call('GET', `/chapter-templates/export?ids=${t.id}`)).json;
      expect(one.templates).toHaveLength(1);
      // anderes Projekt: fremde IDs weder exportierbar noch kopierbar; Import legt an, gleiche Namen werden umbenannt
      const other = (await call('POST', '/projects', { name: 'Zweigwerk' })).json;
      expect((await call('GET', `/chapter-templates/export?ids=${t.id}`, undefined, 'u-admin', other.id)).status).toBe(404);
      expect((await call('POST', '/chapter-templates/duplicate', { id: t.id }, 'u-admin', other.id)).status).toBe(404);
      const imp = await call('POST', '/chapter-templates/import', all.json, 'u-admin', other.id);
      expect(imp.status).toBe(201);
      expect(imp.json.imported).toBe(4);
      expect(imp.json.templates.map((x: any) => [x.name, x.renamedFrom])).toEqual([
        ['Bestellung', null], ['Bestellung (Kopie)', null], ['Bestellung (Kopie) (2)', null], ['Datensatz anlegen (Kopie)', null],
      ]);
      const again = (await call('POST', '/chapter-templates/import', one, 'u-admin', other.id)).json;
      expect(again.templates[0]).toMatchObject({ name: 'Bestellung (2)', renamedFrom: 'Bestellung' });
      const listed = (await call('GET', '/chapter-assistant/templates', undefined, 'u-admin', other.id)).json.find((x: any) => x.name === 'Bestellung');
      expect(listed).toMatchObject({ description: 'Einkauf', steps: t.steps, hints: ['Eilig: markieren'] });
      // fehlerhafte Datei legt nichts an
      const before = (await call('GET', '/chapter-assistant/templates', undefined, 'u-admin', other.id)).json.length;
      expect((await call('POST', '/chapter-templates/import', { format: 'etwas', templates: [] }, 'u-admin', other.id)).status).toBe(400);
      expect((await call('POST', '/chapter-templates/import', { format: 'onescm-chapter-templates', templates: [] }, 'u-admin', other.id)).status).toBe(400);
      const bad = await call('POST', '/chapter-templates/import', { format: 'onescm-chapter-templates', templates: [{ name: 'Gut', steps: ['A'] }, { name: 'Ohne Schritte', steps: [] }] }, 'u-admin', other.id);
      expect(bad.status).toBe(400);
      expect(bad.json.detail).toContain('Vorlage 2');
      expect((await call('POST', '/chapter-templates/import', { format: 'onescm-chapter-templates', templates: Array.from({ length: 51 }, (_, i) => ({ name: `V${i}`, steps: ['A'] })) }, 'u-admin', other.id)).status).toBe(400);
      expect((await call('GET', '/chapter-assistant/templates', undefined, 'u-admin', other.id)).json.length).toBe(before);
      expect((await call('POST', '/chapter-templates/import', one, 'u-leser')).status).toBe(403);
    } finally {
      await built.app.close();
    }
  });

  it('[T-198] Leseransicht: Suche über freigegebene Kapitel (optional Entwürfe) mit Ausschnitt; Glossar aus Terminologie und Abkürzungen', async () => {
    const built = await build('reader');
    const call = client(built);
    try {
      const mk = (title: string, steps: string[], hints: string[] = []) => call('POST', '/chapter-assistant', {
        title, purpose: `Mit dieser Anleitung ${title.toLowerCase()} Sie.`, steps, result: 'Fertig.', hints,
      }, 'u-redaktion').then((r) => r.json);
      const a = await mk('Lieferschein drucken', ['Öffnen Sie **Lager › Lieferscheine**', 'Wählen Sie den Auftrag', 'Klicken Sie auf **Drucken**'], ['Der Drucker wird im DMS eingestellt.']);
      const b = await mk('Auftrag anlegen', ['Öffnen Sie **Verkauf › Aufträge**', 'Klicken Sie auf **Neu**']);
      // a freigeben, b bleibt Entwurf
      expect((await call('POST', `/chapter-versions/${a.versionId}/submit`, {}, 'u-redaktion')).status).toBe(200);
      expect((await call('POST', `/chapter-versions/${a.versionId}/approve`, { comment: 'ok' }, 'u-freigabe')).status).toBe(200);
      expect((await call('GET', '/reader/search?q=x')).status).toBe(400);
      expect((await call('GET', '/reader/search')).status).toBe(400);
      const s1 = (await call('GET', '/reader/search?q=Drucker%20DMS', undefined, 'u-leser')).json;
      expect(s1).toMatchObject({ q: 'Drucker DMS', words: ['drucker', 'dms'], total: 1 });
      expect(s1.results[0]).toMatchObject({ chapterId: a.chapterId, title: 'Lieferschein drucken', versionId: a.versionId, draft: false });
      expect(s1.results[0].snippet).toContain('Der Drucker wird im DMS eingestellt');
      expect(s1.results[0].snippet).not.toContain('**');
      // Entwürfe nur mit drafts=true; alle Wörter müssen vorkommen
      expect((await call('GET', '/reader/search?q=Auftrag')).json.results.map((r: any) => r.title)).toEqual(['Lieferschein drucken']);
      const s2 = (await call('GET', '/reader/search?q=Auftrag&drafts=true')).json;
      expect(s2.results.map((r: any) => r.title)).toEqual(['Auftrag anlegen', 'Lieferschein drucken']); // Titeltreffer zuerst
      expect(s2.results[0]).toMatchObject({ draft: true, versionId: b.versionId });
      expect((await call('GET', '/reader/search?q=Auftrag%20Drucker&drafts=true')).json.total).toBe(1);
      expect((await call('GET', '/reader/search?q=Kühlschrank')).json).toMatchObject({ total: 0, results: [] });
      // Glossar: nur Begriffe mit Definition, dazu Abkürzungen; längste zuerst; je Projekt
      await call('POST', '/terminology', { preferred: 'Lieferschein', definition: 'Beleg, der eine Lieferung begleitet.' });
      await call('POST', '/terminology', { preferred: 'Auftrag' });
      await call('POST', '/abbreviations', { abbreviation: 'DMS', expansion: 'Dealer-Management-System', description: 'Software des Autohauses' }, 'u-redaktion');
      const g = (await call('GET', '/reader/glossary', undefined, 'u-leser')).json;
      expect(g).toEqual(expect.arrayContaining([
        { term: 'Lieferschein', text: 'Beleg, der eine Lieferung begleitet.', kind: 'term' },
        { term: 'DMS', text: 'Dealer-Management-System – Software des Autohauses', kind: 'abbreviation' },
      ]));
      expect(g.some((e: any) => e.term === 'Auftrag')).toBe(false);
      expect(g.map((e: any) => e.term.length)).toEqual([...g.map((e: any) => e.term.length)].sort((x, y) => y - x));
      const other = (await call('POST', '/projects', { name: 'Leer' })).json;
      expect((await call('GET', '/reader/glossary', undefined, 'u-admin', other.id)).json.some((e: any) => e.term === 'DMS')).toBe(false);
      expect((await call('GET', '/reader/search?q=Drucker', undefined, 'u-admin', other.id)).json.total).toBe(0);
    } finally {
      await built.app.close();
    }
  });

  it('[T-199] Schnelles Laden: vorkomprimierte Dateien je Accept-Encoding, Assets ein Jahr gecacht, index.html immer geprüft', async () => {
    const web = path.join(dataDir, 'web');
    fs.mkdirSync(path.join(web, 'assets'), { recursive: true });
    const js = 'console.log("oneSCM");'.repeat(200);
    fs.writeFileSync(path.join(web, 'index.html'), '<!doctype html><title>oneSCM</title>');
    fs.writeFileSync(path.join(web, 'assets', 'app-abc123.js'), js);
    fs.writeFileSync(path.join(web, 'assets', 'app-abc123.js.br'), brotliCompressSync(js));
    fs.writeFileSync(path.join(web, 'assets', 'app-abc123.js.gz'), gzipSync(js));
    const built = await freshDatabase(dataDir, 'static').then((database) => buildApp({
      dataDir, database, logger: false, webDist: web, authMode: 'demo', llm: { provider: 'demo', model: 'demo-extractive' },
    } as any));
    try {
      const get = (url: string, enc?: string) => built.app.inject({ method: 'GET', url, headers: enc ? { 'accept-encoding': enc } : {} });
      const br = await get('/assets/app-abc123.js', 'br, gzip');
      expect(br.statusCode).toBe(200);
      expect(br.headers['content-encoding']).toBe('br');
      expect(br.headers['cache-control']).toBe('public, max-age=31536000, immutable');
      expect(Number(br.headers['content-length'])).toBeLessThan(js.length / 10);
      expect((await get('/assets/app-abc123.js', 'gzip')).headers['content-encoding']).toBe('gzip');
      const plain = await get('/assets/app-abc123.js');
      expect(plain.headers['content-encoding']).toBeUndefined();
      expect(plain.body).toBe(js);
      // Einstieg und SPA-Routen: nie aus dem Cache ohne Rückfrage (neue Version sofort sichtbar)
      for (const url of ['/', '/lesen/druck']) {
        const r = await get(url, 'br');
        expect(r.statusCode).toBe(200);
        expect(r.headers['cache-control']).toBe('no-cache');
        expect(r.body).toContain('<title>oneSCM</title>');
      }
      expect((await get('/api/v1/gibt-es-nicht')).statusCode).toBe(404);
    } finally {
      await built.app.close();
    }
  });
});
