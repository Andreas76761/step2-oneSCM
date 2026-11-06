#!/bin/sh
# LanguageTool als lokaler Java-Dienst (ADR-108, G-04) – nur auf localhost
cd "$(dirname "$0")"
PORT="${LT_PORT:-8081}"
MEM="${LT_MEMORY:-1g}"
if [ -n "$LT_JAR" ]; then CP="$LT_JAR"; else CP="lib/*"; fi
exec java -Xmx"$MEM" -cp "$CP" org.languagetool.server.HTTPServer --port "$PORT"
