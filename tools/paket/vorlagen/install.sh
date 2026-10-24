#!/usr/bin/env sh
# Abhängigkeiten installieren: braucht Node.js 20.16+ (empfohlen 22 LTS)
set -e
cd "$(dirname "$0")"
node -e "if (+process.versions.node.split('.')[0] < 20) { console.error('Node.js ' + process.version + ' ist zu alt – bitte Node.js 22 LTS installieren.'); process.exit(1) }"
npm ci --omit=dev --workspace apps/server --include-workspace-root
echo "Fertig. Starten mit ./start.sh"
