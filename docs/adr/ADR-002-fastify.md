# ADR-002 Fastify, Fehler als `application/problem+json`

**Status:** akzeptiert

## Entscheidung
Fastify 5 als HTTP-Framework (Schema-Validierung, `inject()` für API-Tests ohne Netzwerk, gute Performance). Alle Fehler werden zentral als RFC 9457 Problem Details (`application/problem+json`) mit `type`, `title`, `status`, `detail` und optional `blockers` ausgegeben. Basispfad `/api/v1`.

## Alternativen
Express: verbreiteter, aber keine eingebaute Schema-Validierung, langsamer, Fehlerbehandlung asynchroner Handler umständlicher.
