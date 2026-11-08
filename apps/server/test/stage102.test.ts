// Etappe 102: Code-Review der Korrekturen aus den Etappen 97–99 (und v0.99.1/v0.99.2)
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import type { AddressInfo } from 'node:net';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { generateChapter, type GenSnippet } from '../src/domain/generator.js';
import { failSync } from '../src/services/connections.js';
import { client, FM } from './api-helpers.js';
import { freshDatabase, tempDir } from './helpers.js';

const gen = (id: string, market: string | null, release: string | null = null, order = 1): GenSnippet => ({
  id, seq: order, text: 'Der Auftrag wird im Menü Aufträge angelegt.', kind: 'paragraph', evidenceStatus: 'source_confirmed', subchapterTitle: 'Schritte', headingPath: [], order,
  normHash: 'h1', roles: [{ code: 'all', evidenceStatus: 'source_confirmed' }], divisions: [{ code: 'all', evidenceStatus: 'source_confirmed' }], market, release, scopeStatus: 'confirmed', sourceLabel: `${id}.md`,
});

describe('Etappe 102', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string, extra: Record<string, unknown> = {}) =>
    freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo', integrations: { allowInsecure: true }, ...extra }));

  it('[T-436] Kapitelerzeugung: gleicher Satz allgemein und für einen Markt bzw. ein Release nur einmal (die allgemeine Fassung), verschiedene Märkte weiter getrennt', () => {
    const steps = (list: GenSnippet[]) => generateChapter('Aufträge', list).blocks.filter((b) => b.section === 'steps');
    // DE-Fassung zuerst, allgemeine danach: ein Absatz ohne Markt mit beiden Quellen
    const merged = steps([gen('de', 'DE', null, 1), gen('alle', null, null, 2)]);
    expect(merged.map((b) => [b.market, b.sourceIds.sort()])).toEqual([[null, ['alle', 'de']]]);
    // Release-Fassung geht in der allgemeinen auf
    expect(steps([gen('r', null, '2026.2', 1), gen('alle', null, null, 2)]).map((b) => b.release)).toEqual([null]);
    // DE und FR ohne allgemeine Fassung: zwei Absätze
    expect(steps([gen('de', 'DE', null, 1), gen('fr', 'FR', null, 2)]).map((b) => b.market)).toEqual(['DE', 'FR']);
  });

  it('[T-437] Abgleich: vorgemerkter Abgleich liest denselben Commit nicht erneut ein; Webhook-Zustellung schließt die Verbindung', async () => {
    const repo = path.join(dataDir, 'repo');
    fs.mkdirSync(repo, { recursive: true });
    const git = (...args: string[]) => execFileSync('git', ['-c', 'user.name=T', '-c', 'user.email=t@example.org', ...args], { cwd: repo, env: { ...process.env, GIT_CONFIG_GLOBAL: '/dev/null' } }).toString().trim();
    git('init', '-q', '-b', 'main');
    fs.writeFileSync(path.join(repo, 'a.md'), `${FM}# 1. A\n\n## 1.1 Zweck\n\nErster Stand.\n`);
    git('add', '-A');
    git('commit', '-q', '-m', 'eins');
    // Empfänger: antwortet 200 und schickt einen Körper, der nie endet
    let closed = false;
    const rx = http.createServer((req, res) => {
      req.resume();
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.write('ok');
      res.on('close', () => { closed = true; });
    });
    await new Promise<void>((r) => rx.listen(0, '127.0.0.1', () => r()));
    const built = await build('e102b', { git: { allowFile: true, timeoutMs: 30_000 } });
    const call = client(built);
    try {
      const conn = (await call('POST', '/source-connections', { name: 'Repo', url: repo, branch: 'main' })).json;
      await built.ctx.jobs.idle();
      const imports = async () => (await built.ctx.db.get<any>('SELECT COUNT(*) AS n FROM imports'))!.n;
      const before = await imports();
      // Push-Webhook während des Abgleichs, der den Stand schon hat: vorgemerkt, danach kein zweiter Import desselben Commits
      await built.ctx.db.run("UPDATE source_connections SET status = 'syncing' WHERE id = ?", conn.id);
      expect((await call('POST', `/source-connections/${conn.id}/sync`, {})).status).toBeLessThan(300);
      await failSync(built.ctx, { connectionId: conn.id }, 'Neustart');
      await built.ctx.jobs.idle();
      expect((await call('GET', `/source-connections/${conn.id}`)).json.status).toBe('idle');
      expect(await imports()).toBe(before);

      // Webhook-Test: Zustellung gilt als erfolgt, die Verbindung zum Empfänger wird geschlossen
      const url = `http://127.0.0.1:${(rx.address() as AddressInfo).port}/hook`;
      const sub = (await call('POST', '/webhooks', { url, events: ['import.finished'] })).json;
      expect((await call('POST', `/webhooks/${sub.id}/ping`, {})).status).toBeLessThan(300);
      await built.ctx.jobs.idle();
      expect((await call('GET', `/webhooks/${sub.id}/deliveries`)).json.map((d: any) => d.status)).toEqual(['delivered']);
      for (let i = 0; i < 50 && !closed; i++) await new Promise((r) => setTimeout(r, 20));
      expect(closed).toBe(true);
    } finally {
      await built.app.close();
      rx.closeAllConnections();
      await new Promise((r) => rx.close(r));
    }
  });
});
