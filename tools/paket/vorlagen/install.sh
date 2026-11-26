#!/usr/bin/env sh
# Abhängigkeiten installieren: braucht Node.js 22.15+ (22 oder 24 LTS)
set -e
cd "$(dirname "$0")"
node -e "const [a, b] = process.versions.node.split('.').map(Number); if (a < 22 || (a === 22 && b < 15)) { console.error('Node.js ' + process.version + ' ist zu alt – bitte Node.js 22 LTS (mindestens 22.15) oder 24 LTS installieren.'); process.exit(1) }"
# ohne Installationsskripte: better-sqlite3 (ab 13) bringt die Binärdateien in prebuilds/ mit; sein node-gyp-Leerlauf
# bräuchte sonst Python, einen C++-Compiler und die Node-Header aus dem Netz
npm ci --omit=dev --workspace apps/server --include-workspace-root --ignore-scripts
echo "Fertig. Starten mit ./start.sh"
