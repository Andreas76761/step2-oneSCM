// Etappe 124: Code-Review der Etappen 113–123
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('../../..', import.meta.url));
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');

describe('Etappe 124', () => {
  it('[T-456] Installationspaket: npm ci ohne Installationsskripte – keine C++-Werkzeuge nötig, better-sqlite3 bringt die Binärdateien mit', () => {
    for (const f of ['tools/paket/vorlagen/install.sh', 'tools/paket/vorlagen/install.ps1']) {
      const ci = read(f).split('\n').find((l) => l.trim().startsWith('npm ci'));
      expect(ci, f).toContain('--ignore-scripts');
    }
    // nur better-sqlite3 hat unter den Laufzeit-Abhängigkeiten ein Installationsskript – und dafür liegen Binärdateien im Paket
    const pkgs = JSON.parse(read('package-lock.json')).packages as Record<string, { dev?: boolean; hasInstallScript?: boolean }>;
    expect(Object.entries(pkgs).filter(([, p]) => p.hasInstallScript && !p.dev).map(([k]) => k)).toEqual(['node_modules/better-sqlite3']);
    const prebuilds = path.join(ROOT, 'node_modules/better-sqlite3/prebuilds');
    for (const target of ['linux-x64', 'linux-arm64', 'linuxmusl-x64', 'darwin-arm64', 'darwin-x64', 'win32-x64']) {
      expect(fs.existsSync(path.join(prebuilds, `${target}.node`)), target).toBe(true);
    }
  });
});
