// Etappe 120: OpenTelemetry 3, Mindestversion Node 22.15
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('../../..', import.meta.url));
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const semver = createRequire(import.meta.url)('semver') as { satisfies: (v: string, r: string) => boolean };

describe('Etappe 120', () => {
  it('[T-454] Mindestversion Node: engines, Installationsskripte und Doku stimmen überein, jede Laufzeit-Abhängigkeit läuft damit', () => {
    const engines = JSON.parse(read('package.json')).engines.node as string;
    const m = /^>=(\d+)\.(\d+)$/.exec(engines);
    expect(m, engines).toBeTruthy();
    const [major, minor] = [m![1], m![2]];
    const min = `${major}.${minor}.0`;
    // Prüfungen beim Einrichten und Angaben in der Doku
    expect(read('tools/paket/vorlagen/install.sh')).toContain(`a === ${major} && b < ${minor}`);
    expect(read('tools/paket/vorlagen/install.ps1')).toContain(`-eq ${major} -and [int]$v[1] -lt ${minor}`);
    for (const f of ['tools/paket/vorlagen/install.sh', 'tools/paket/vorlagen/install.ps1', 'README.md', 'docs/08-installation-betrieb.md']) {
      expect(read(f), f).toContain(`mindestens ${major}.${minor}`);
    }
    // jede Laufzeit-Abhängigkeit (nicht nur für Entwicklung) akzeptiert die Mindestversion
    const pkgs = JSON.parse(read('package-lock.json')).packages as Record<string, { dev?: boolean; engines?: { node?: string } | string[] }>;
    const runtime = Object.entries(pkgs).filter(([k, p]) => k.includes('node_modules/') && !p.dev && p.engines && !Array.isArray(p.engines) && p.engines.node);
    expect(runtime.length).toBeGreaterThan(20);
    const tooNew = runtime.filter(([, p]) => !semver.satisfies(min, (p.engines as { node: string }).node)).map(([k, p]) => `${k}: ${(p.engines as { node: string }).node}`);
    expect(tooNew).toEqual([]);
    // OpenTelemetry 3 braucht 22.15 – darunter fiele genau diese Prüfung
    expect(runtime.some(([k, p]) => k.endsWith('@opentelemetry/sdk-trace') && !semver.satisfies('22.13.0', (p.engines as { node: string }).node))).toBe(true);
  });
});
