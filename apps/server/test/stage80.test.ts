import fs from 'node:fs';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../src/app.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Etappe 80', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));
  const build = (name: string) => freshDatabase(dataDir, name).then((database) => buildApp({ dataDir, database, logger: false, webDist: null, authMode: 'demo' }));
  const digestJob = (built: Awaited<ReturnType<typeof build>>) =>
    built.ctx.db.get("SELECT id FROM jobs WHERE type = 'weekly-digest' AND status IN ('queued', 'running')");

  it('[T-399] WEEKLY_DIGEST=0 plant keine automatische Wochenübersicht ein; ohne die Einstellung bleibt sie eingeplant', async () => {
    const before = process.env.WEEKLY_DIGEST;
    try {
      process.env.WEEKLY_DIGEST = '0';
      const off = await build('digest-off');
      try {
        expect(await digestJob(off)).toBeUndefined();
        // ein schon eingeplanter Auftrag läuft durch, ohne zu senden und ohne sich neu einzuplanen
        const id = await off.ctx.jobs.enqueue('weekly-digest', {}, 1);
        await expect.poll(async () => (await off.ctx.db.get<{ status: string }>('SELECT status FROM jobs WHERE id = ?', id))?.status, { timeout: 15_000 }).toBe('completed');
        expect(await digestJob(off)).toBeUndefined();
        expect(await off.ctx.db.get("SELECT id FROM notifications WHERE type = 'digest'")).toBeUndefined();
      } finally {
        await off.app.close();
      }
      delete process.env.WEEKLY_DIGEST;
      const on = await build('digest-on');
      try {
        expect(await digestJob(on)).toBeTruthy();
      } finally {
        await on.app.close();
      }
    } finally {
      if (before === undefined) delete process.env.WEEKLY_DIGEST;
      else process.env.WEEKLY_DIGEST = before;
    }
  });
});
