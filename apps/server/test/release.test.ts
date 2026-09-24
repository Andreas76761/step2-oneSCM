import fs from 'node:fs';
import path from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { bumpVersion, checkVersions, releaseNotes, ROOT } from '../scripts/release.js';
import { buildApp } from '../src/app.js';
import { APP_VERSION } from '../src/version.js';
import { freshDatabase, tempDir } from './helpers.js';

describe('Release-Pipeline (ADR-031)', () => {
  const dataDir = tempDir();
  afterAll(() => fs.rmSync(dataDir, { recursive: true, force: true }));

  it('[T-165] Versionen konsistent, Versionssprung in allen Dateien, Release-Notes aus dem CHANGELOG, Version im Health-Endpunkt', async () => {
    // Repository selbst: eine Version für Pakete, Lockfile, OpenAPI und Helm-Chart, CHANGELOG-Abschnitt vorhanden
    const repo = checkVersions();
    expect(repo.problems).toEqual([]);
    expect(repo.found.length).toBeGreaterThanOrEqual(12);
    expect(checkVersions(ROOT, `v${repo.version}`).problems).toEqual([]);
    expect(checkVersions(ROOT, 'v0.0.1').problems).toEqual([`Tag v0.0.1 passt nicht zur Version ${repo.version} (erwartet v${repo.version}).`]);

    // Versionssprung in einer Kopie der relevanten Dateien
    const copy = path.join(dataDir, 'repo');
    for (const f of ['package.json', 'apps/server/package.json', 'apps/web/package.json', 'e2e/package.json', 'package-lock.json', 'openapi/openapi.yaml', 'deploy/helm/onescm/Chart.yaml', 'CHANGELOG.md']) {
      fs.mkdirSync(path.dirname(path.join(copy, f)), { recursive: true });
      fs.copyFileSync(path.join(ROOT, f), path.join(copy, f));
    }
    expect(() => bumpVersion('1.0', copy)).toThrow(/SemVer/);
    const bumped = bumpVersion('1.2.0-rc.1', copy);
    expect(bumped.version).toBe('1.2.0-rc.1');
    expect(bumped.problems).toEqual(['CHANGELOG.md: kein Abschnitt „## 1.2.0-rc.1“.']);
    expect(bumped.found.every((f) => f.version === '1.2.0-rc.1')).toBe(true);
    const chart = fs.readFileSync(path.join(copy, 'deploy/helm/onescm/Chart.yaml'), 'utf8');
    expect(chart).toContain('version: 1.2.0-rc.1\n');
    expect(chart).toContain('appVersion: "1.2.0-rc.1"');
    expect(chart).toContain('kubeVersion: ">=1.25.0-0"'); // Rest unverändert
    const openapi = fs.readFileSync(path.join(copy, 'openapi/openapi.yaml'), 'utf8');
    expect(openapi.split('\n').slice(0, 4).join('\n')).toBe('openapi: 3.1.1\ninfo:\n  title: oneSCM Handbook Studio API\n  version: 1.2.0-rc.1');
    // Abweichung wird erkannt
    fs.writeFileSync(path.join(copy, 'apps/web/package.json'), fs.readFileSync(path.join(copy, 'apps/web/package.json'), 'utf8').replace('"1.2.0-rc.1"', '"1.1.9"'));
    expect(checkVersions(copy).problems).toContain('apps/web/package.json: 1.1.9 statt 1.2.0-rc.1');

    // Release-Notes: Abschnitt bis zur nächsten Versionsüberschrift, auch der letzte; unbekannt → null
    const log = '# Changelog\n\n## 1.1.0 – Etappe 11 (01.10.2026)\n\n### Hinzugefügt\n- A\n\n## 1.0.0 – Etappe 10\n\n- B\n';
    expect(releaseNotes(log, '1.1.0')).toBe('### Hinzugefügt\n- A');
    expect(releaseNotes(log, '1.0.0')).toBe('- B');
    expect(releaseNotes(log, '1.0')).toBeNull();
    expect(releaseNotes(log, '0.9.0')).toBeNull();
    expect(releaseNotes(fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8'), repo.version)).toContain('### Hinzugefügt');

    // Laufende Anwendung meldet ihre Version
    expect(APP_VERSION).toBe(repo.version);
    const built = await buildApp({ dataDir, database: await freshDatabase(dataDir, 'release'), logger: false, webDist: null, authMode: 'demo' });
    try {
      expect((await built.app.inject({ method: 'GET', url: '/api/v1/health' })).json()).toMatchObject({ status: 'ok', version: repo.version });
    } finally {
      await built.app.close();
    }
  });
});
