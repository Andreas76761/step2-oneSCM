// Etappe 110: GitHub-Actions auf Node 24
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('../../..', import.meta.url));
// erste Hauptversion je Action, die auf Node 24 läuft (Composite-Actions und anchore/sbom-action@v0 sind nicht betroffen)
const MIN_MAJOR: Record<string, number> = {
  'actions/checkout': 5,
  'actions/setup-node': 5,
  'actions/upload-artifact': 6,
  'actions/download-artifact': 7,
  'azure/setup-helm': 5,
  'docker/setup-qemu-action': 4,
  'docker/setup-buildx-action': 4,
  'docker/login-action': 4,
  'docker/metadata-action': 6,
  'docker/build-push-action': 7,
};

describe('Etappe 110', () => {
  it('[T-451] CI und Release-Pipeline verwenden nur Actions, die auf Node 24 laufen (GitHub stellt Node 20 ein)', () => {
    const dir = path.join(ROOT, '.github/workflows');
    const uses = fs.readdirSync(dir).filter((f) => f.endsWith('.yml')).flatMap((f) =>
      [...fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/uses:\s*([\w.-]+\/[\w.-]+)@v(\d+)/g)].map((m) => ({ file: f, action: m[1], major: Number(m[2]) })),
    );
    expect(uses.length).toBeGreaterThan(10);
    const old = uses.filter((u) => MIN_MAJOR[u.action] !== undefined && u.major < MIN_MAJOR[u.action]);
    expect(old).toEqual([]);
    // jede bekannte Action kommt vor – sonst prüfte die Liste ins Leere
    for (const a of Object.keys(MIN_MAJOR)) expect(uses.some((u) => u.action === a), a).toBe(true);
  });
});
