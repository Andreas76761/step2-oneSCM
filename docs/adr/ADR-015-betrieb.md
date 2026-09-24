# ADR-015 Betrieb und Härtung

**Status:** akzeptiert, umgesetzt in Etappe 6

## Entscheidung
- **Health-Checks:** `/api/v1/health/live` (Prozess antwortet) und `/api/v1/health/ready` (Datenbank, Object-Store, Jobqueue; 503 bei Störung) ohne Anmeldung; der Docker-Healthcheck nutzt Readiness. `/api/v1/health` bleibt als Übersicht.
- **Nachvollziehbare Logs:** strukturierte JSON-Logs (pino); jede Anfrage erhält eine Request-ID (`X-Request-Id` wird übernommen, sonst erzeugt, und in der Antwort zurückgegeben); nach der Anmeldung enthält jede Logzeile Benutzer und Projekt. `LOG_LEVEL`, `TRUST_PROXY=1` hinter einem Reverse Proxy.
- **Metriken:** Prometheus-Format unter `/metrics` (`prom-client`): HTTP-Anfragen und -Dauer je Route, abgelehnte Anfragen (Rate-Limit), Jobs je Typ/Status, Projekte, KI-Vorschläge, Prozesskennzahlen. Zugriff mit Bearer `METRICS_TOKEN` (zeitkonstanter Vergleich) oder globaler Berechtigung `admin`.
- **Rate-Limiting** (`@fastify/rate-limit`) je Benutzer (ohne Anmeldung je IP) und Minute: allgemein `RATE_LIMIT_MAX` (Standard 1200), für aufwendige Aktionen – Import, Analyse, Export, KI-Umformulierung – `RATE_LIMIT_EXPENSIVE_MAX` (Standard 60). Antwort 429 als Problem Details mit `Retry-After`. Zähler liegen im Speicher der Instanz; bei mehreren Instanzen gilt das Limit je Instanz.
- **Backup/Restore:** portables ZIP (Tabellen als JSON-Zeilen in Migrationsreihenfolge, Objekte aus dem Object-Store, Manifest mit Migrationen und Zeilenzahlen) über `node dist/cli.js backup|restore` bzw. `npm run backup|restore`. Unabhängig vom Dialekt – damit auch Umzug SQLite → PostgreSQL. Restore nur in eine Datenbank mit gleichem oder neuerem Schema; ersetzt vorhandene Daten nur mit `--force`. Das Backup liest alle Tabellen in einer Transaktion; laufende Importe sollten vorher abgeschlossen sein.
- **Abhängigkeiten:** `npm audit --omit=dev --audit-level=moderate` in der CI. `@fastify/static` auf 10.x (Pfad-Traversal-Lücken), `uuid` 11 per `overrides` für `exceljs`.
- **Lasttest:** `npm run perf -w apps/server -- <Dateien>` erzeugt fiktive Quellen, importiert, analysiert und generiert alle Kapitel und misst die Zeiten.

## Messwerte (Entwicklungscontainer, 24.09.2026)

| Dateien | Textabschnitte | Datenbank | Import | Analyse | Generierung (Kapitel) | RSS |
|---|---|---|---|---|---|---|
| 400 | 3 200 | SQLite | 1,4 s | 0,7 s | 1,0 s (20) | 241 MB |
| 2 000 | 16 000 | SQLite | 7,4 s | 15,7 s | 9,0 s (100) | 342 MB |
| 2 000 | 16 000 | PostgreSQL | 25,9 s | 21,4 s | 23,9 s (100) | 386 MB |

Die Analyse wächst stärker als linear (Kandidatenpaare der Ähnlichkeitsprüfung); für deutlich größere Bestände ist ein Embedding-Index (ADR-006) der nächste Schritt.

## Alternativen
- OpenTelemetry-Tracing: sinnvoll mit vorhandener Infrastruktur; Request-ID und Metriken decken den Bedarf ohne weitere Komponenten.
- Datenbankeigene Dumps (`pg_dump`): weiterhin nutzbar, aber dialektgebunden und ohne Object-Store.
