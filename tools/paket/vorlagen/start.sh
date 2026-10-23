#!/usr/bin/env sh
# oneSCM Handbook Studio starten (Linux/macOS): ./start.sh [Port]
set -e
cd "$(dirname "$0")"
PORT="${1:-3000}"
if [ ! -d daten ]; then
  if [ -d beispieldaten ] && [ -z "$OHNE_BEISPIELDATEN" ]; then cp -R beispieldaten daten; echo "Beispieldaten übernommen."; else mkdir daten; fi
fi
[ -d node_modules ] || { echo "Abhängigkeiten fehlen – bitte zuerst ./install.sh ausführen."; exit 1; }
export DATA_DIR="$(pwd)/daten" PORT AUTH_MODE="${AUTH_MODE:-demo}"
echo "oneSCM Handbook Studio – http://localhost:$PORT (Beenden mit Strg+C)"
exec node apps/server/dist/index.js
