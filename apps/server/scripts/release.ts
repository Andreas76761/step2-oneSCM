// Release-Werkzeug (ADR-031). Eine Version für Anwendung, API-Beschreibung und Helm-Chart:
//   npm run release -- check [--tag v0.10.0]   Versionen konsistent? Tag passt zur Version?
//   npm run release -- bump 0.11.0             Version in allen Dateien setzen (inkl. package-lock.json)
//   npm run release -- notes 0.10.0            Release-Notes aus CHANGELOG.md (Abschnitt der Version)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?$/;
const PACKAGES = ['package.json', 'apps/server/package.json', 'apps/web/package.json', 'e2e/package.json'];
const WORKSPACES = ['apps/server', 'apps/web', 'e2e'];

export interface VersionReport {
  version: string;
  found: { file: string; version: string | null }[];
  problems: string[];
}

const read = (root: string, f: string) => fs.readFileSync(path.join(root, f), 'utf8');
const yamlField = (text: string, re: RegExp) => re.exec(text)?.[1]?.replace(/^["']|["']$/g, '') ?? null;

/** Alle Versionsangaben einlesen und gegen die Version der Wurzel-package.json prüfen */
export function checkVersions(root = ROOT, tag?: string): VersionReport {
  const version = JSON.parse(read(root, 'package.json')).version as string;
  const found: VersionReport['found'] = [];
  for (const f of PACKAGES) found.push({ file: f, version: JSON.parse(read(root, f)).version ?? null });
  const lock = JSON.parse(read(root, 'package-lock.json'));
  found.push({ file: 'package-lock.json', version: lock.version ?? null });
  for (const ws of ['', ...WORKSPACES]) found.push({ file: `package-lock.json#${ws || '(root)'}`, version: lock.packages?.[ws]?.version ?? null });
  found.push({ file: 'openapi/openapi.yaml', version: yamlField(read(root, 'openapi/openapi.yaml'), /^info:\n(?:[ ].*\n)*?[ ]+version:\s*(\S+)/m) });
  const chart = read(root, 'deploy/helm/onescm/Chart.yaml');
  found.push({ file: 'deploy/helm/onescm/Chart.yaml#version', version: yamlField(chart, /^version:\s*(\S+)/m) });
  found.push({ file: 'deploy/helm/onescm/Chart.yaml#appVersion', version: yamlField(chart, /^appVersion:\s*(\S+)/m) });

  const problems: string[] = [];
  if (!SEMVER.test(version)) problems.push(`package.json: „${version}“ ist keine SemVer-Version.`);
  for (const f of found) if (f.version !== version) problems.push(`${f.file}: ${f.version ?? '(fehlt)'} statt ${version}`);
  if (tag !== undefined && tag !== `v${version}`) problems.push(`Tag ${tag} passt nicht zur Version ${version} (erwartet v${version}).`);
  if (!releaseNotes(read(root, 'CHANGELOG.md'), version)) problems.push(`CHANGELOG.md: kein Abschnitt „## ${version}“.`);
  return { version, found, problems };
}

/** Abschnitt einer Version aus dem CHANGELOG (ohne Überschrift); null, wenn es ihn nicht gibt */
export function releaseNotes(changelog: string, version: string): string | null {
  const lines = changelog.split('\n');
  const esc = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const start = lines.findIndex((l) => new RegExp(`^## \\[?v?${esc}\\]?(\\s|$)`).test(l));
  if (start < 0) return null;
  let end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  if (end < 0) end = lines.length;
  const body = lines.slice(start + 1, end).join('\n').trim();
  return body || null;
}

/** Version in allen Dateien setzen (Formatierung der Dateien bleibt erhalten) */
export function bumpVersion(next: string, root = ROOT) {
  if (!SEMVER.test(next)) throw new Error(`„${next}“ ist keine SemVer-Version (z. B. 0.11.0 oder 1.0.0-rc.1).`);
  const setJson = (f: string, fn: (j: any) => void) => {
    const j = JSON.parse(read(root, f));
    fn(j);
    fs.writeFileSync(path.join(root, f), `${JSON.stringify(j, null, 2)}\n`);
  };
  for (const f of PACKAGES) setJson(f, (j) => (j.version = next));
  setJson('package-lock.json', (j) => {
    j.version = next;
    for (const ws of ['', ...WORKSPACES]) if (j.packages?.[ws]) j.packages[ws].version = next;
  });
  const openapi = read(root, 'openapi/openapi.yaml').replace(/^(info:\n(?:[ ].*\n)*?[ ]+version:\s*)\S+/m, `$1${next}`);
  fs.writeFileSync(path.join(root, 'openapi/openapi.yaml'), openapi);
  const chart = read(root, 'deploy/helm/onescm/Chart.yaml').replace(/^version:\s*\S+/m, `version: ${next}`).replace(/^appVersion:\s*\S+/m, `appVersion: "${next}"`);
  fs.writeFileSync(path.join(root, 'deploy/helm/onescm/Chart.yaml'), chart);
  return checkVersions(root);
}

function main(argv: string[]) {
  const [cmd, arg] = argv;
  if (cmd === 'check') {
    const tagIdx = argv.indexOf('--tag');
    const r = checkVersions(ROOT, tagIdx >= 0 ? argv[tagIdx + 1] : undefined);
    if (r.problems.length) {
      console.error(`Version ${r.version}: ${r.problems.length} Problem(e)\n- ${r.problems.join('\n- ')}`);
      process.exit(1);
    }
    console.log(`Version ${r.version} ist in ${r.found.length} Angaben konsistent.`);
  } else if (cmd === 'bump' && arg) {
    const r = bumpVersion(arg);
    console.log(`Version ${r.version} gesetzt.${r.problems.length ? `\nHinweise:\n- ${r.problems.join('\n- ')}` : ''}`);
  } else if (cmd === 'notes' && arg) {
    const notes = releaseNotes(read(ROOT, 'CHANGELOG.md'), arg.replace(/^v/, ''));
    if (!notes) {
      console.error(`CHANGELOG.md enthält keinen Abschnitt für ${arg}.`);
      process.exit(1);
    }
    process.stdout.write(`${notes}\n`);
  } else {
    console.error('Aufruf: release check [--tag vX.Y.Z] | bump X.Y.Z | notes X.Y.Z');
    process.exit(2);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
