#!/usr/bin/env bash
# Installationspakete bauen (ADR-094): universell (Linux/macOS/Windows mit eigenem Node.js, Abhängigkeiten per npm) und
# optional Windows x64 offline (mit Node.js portable, allen Abhängigkeiten und Windows-Binärdateien).
#   tools/paket/paket.sh <Zielordner> [--windows <node-vXX-win-x64.zip>]
# Voraussetzung: npm run build ist gelaufen. Die Beispieldaten sind fiktiv (tools/paket/beispieldaten.mjs).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$(mkdir -p "$1" && cd "$1" && pwd)"; shift
NODEZIP=""
[ "${1:-}" = "--windows" ] && NODEZIP="$2"
VERSION="$(node -p "require('$ROOT/package.json').version")"
WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT
[ -f "$ROOT/apps/server/dist/index.js" ] && [ -f "$ROOT/apps/web/dist/index.html" ] || { echo "Bitte zuerst npm run build"; exit 1; }

# 1. Beispieldaten: Demo-Quellen + Beispiele, danach WAL zurückschreiben (eine Datei onescm.db)
BSP="$WORK/beispieldaten"
(cd "$ROOT" && DATA_DIR="$BSP" npx tsx apps/server/scripts/seed-demo.ts > /dev/null)
PORT=$((20000 + RANDOM % 20000))
(cd "$ROOT" && DATA_DIR="$BSP" PORT=$PORT LOG=0 node apps/server/dist/index.js > /dev/null 2>&1 & echo $! > "$WORK/pid")
for i in $(seq 1 60); do curl -sf "http://localhost:$PORT/api/v1/health" > /dev/null && break; sleep 1; done
node "$ROOT/tools/paket/beispieldaten.mjs" "http://localhost:$PORT" > /dev/null
kill "$(cat "$WORK/pid")"; sleep 2
(cd "$ROOT/apps/server" && node -e "const D=require('better-sqlite3');const d=new D('$BSP/onescm.db');d.pragma('wal_checkpoint(TRUNCATE)');d.close()")
rm -f "$BSP"/onescm.db-wal "$BSP"/onescm.db-shm

# 2. Inhalt wie im Container-Abbild (Dockerfile) plus Skripte und Dokumentation
build_tree() {
  local T="$1"; mkdir -p "$T/apps/server" "$T/apps/web" "$T/e2e" "$T/Dokumentation"
  cp "$ROOT/package.json" "$ROOT/package-lock.json" "$T/"
  cp "$ROOT/apps/server/package.json" "$T/apps/server/"; cp -R "$ROOT/apps/server/dist" "$ROOT/apps/server/migrations" "$ROOT/apps/server/assets" "$T/apps/server/"
  cp "$ROOT/apps/web/package.json" "$T/apps/web/"; cp -R "$ROOT/apps/web/dist" "$T/apps/web/"
  cp "$ROOT/e2e/package.json" "$T/e2e/"
  cp -R "$ROOT/openapi" "$ROOT/traceability" "$ROOT/demo-data" "$T/"
  cp -R "$BSP" "$T/beispieldaten"
  cp "$ROOT/docs/08-installation-betrieb.md" "$ROOT/docs/09-benutzerdokumentation.md" "$ROOT/docs/lasttest-metadaten.md" "$ROOT/CHANGELOG.md" "$T/Dokumentation/"
  cp "$ROOT/tools/paket/LIESMICH.md" "$T/"
  for f in start.ps1 install.ps1 backup.ps1; do printf '\xEF\xBB\xBF' > "$T/$f"; cat "$ROOT/tools/paket/vorlagen/$f" >> "$T/$f"; done # BOM: Umlaute in Windows PowerShell 5
  sed 's/$/\r/' "$ROOT/tools/paket/vorlagen/start.cmd" > "$T/start.cmd"
  cp "$ROOT/tools/paket/vorlagen/start.sh" "$ROOT/tools/paket/vorlagen/install.sh" "$T/"; chmod +x "$T"/*.sh
}
NAME="onescm-studio-$VERSION"
build_tree "$WORK/$NAME"
(cd "$WORK" && rm -f "$OUT/$NAME.zip" && zip -qr "$OUT/$NAME.zip" "$NAME")
echo "$OUT/$NAME.zip"

# 3. Windows offline: Abhängigkeiten für win32-x64 (ohne Skripte), better-sqlite3 als Windows-Binärdatei, Node.js portable
if [ -n "$NODEZIP" ]; then
  W="$WORK/$NAME-windows-x64"
  build_tree "$W"
  (cd "$W" && npm ci --omit=dev --workspace apps/server --include-workspace-root --os=win32 --cpu=x64 --ignore-scripts --no-audit --no-fund > /dev/null)
  NODEV="$(basename "$NODEZIP" | sed -E 's/node-v([0-9]+)\..*/\1/')"
  (cd "$W/node_modules/better-sqlite3" && node ../prebuild-install/bin.js --platform win32 --arch x64 --runtime node --target "$(basename "$NODEZIP" | sed -E 's/node-v([0-9.]+)-.*/\1/')")
  [ -f "$W/node_modules/better-sqlite3/build/Release/better_sqlite3.node" ] || { echo "better-sqlite3 für Windows fehlt"; exit 1; }
  unzip -q "$NODEZIP" -d "$WORK/nodezip"; mv "$WORK"/nodezip/node-v*-win-x64 "$W/node"
  rm "$W/install.ps1" "$W/install.sh" "$W/start.sh"
  (cd "$WORK" && rm -f "$OUT/$NAME-windows-x64.zip" && zip -qr "$OUT/$NAME-windows-x64.zip" "$NAME-windows-x64")
  echo "$OUT/$NAME-windows-x64.zip (Node $NODEV)"
fi
