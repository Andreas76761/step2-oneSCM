# ADR-027 Betrieb & Performance: Import, Kubernetes, Tracing, verteilte Rate-Limits

**Status:** akzeptiert, umgesetzt in Etappe 9 (ergänzt ADR-015)

## Entscheidung
- **Import auf PostgreSQL:** Kapitel und Unterkapitel werden je Import zwischengespeichert, fortlaufende Nummern je Datei in einem Block reserviert und Textabschnitte, Rollen, Sparten und Protokollzeilen mit mehrzeiligen INSERTs geschrieben.
  Messung (10 000 Textabschnitte in 400 Dateien, Entwicklungsumgebung): PostgreSQL 15,8 s → 4,1 s (3,9×), SQLite 3,5 s → 2,4 s.
- **Migrationen bei mehreren Replikaten:** PostgreSQL führt jede Migration unter einer transaktionsgebundenen Sperre (`pg_advisory_xact_lock`) aus und prüft in der Transaktion erneut, ob sie schon angewendet ist – gleichzeitig startende Instanzen warten aufeinander, ohne eine zweite Verbindung zu belegen (auch mit `DB_POOL_SIZE=1`; Test T-151).
- **Rate-Limits über Instanzen:** `RATE_LIMIT_STORE=db` speichert die Zähler in `rate_limits` (Migration `017`), festes Zeitfenster, atomares `INSERT … ON CONFLICT … RETURNING`; bei Datenbankfehlern werden Anfragen nicht blockiert (`skipOnError`). Standard bleibt `memory` (je Instanz).
- **OpenTelemetry:** mit `OTEL_EXPORTER_OTLP_ENDPOINT` (bzw. `…_TRACES_ENDPOINT`) Export per OTLP/HTTP. Spans für HTTP-Anfragen (W3C `traceparent` des Aufrufers wird übernommen, Antwort mit `X-Trace-Id`), Datenbankabfragen (Anweisung ohne Parameterwerte), Jobs sowie KI- und Embedding-Aufrufe (Anbieter, Modell, Tokens, keine Inhalte). Ohne Exporter keine Kosten (No-op-API).
- **Helm-Chart** `deploy/helm/onescm`: getrennte Deployments für API (ohne Worker) und Worker, Service, optional Ingress mit TLS, HPA, PodDisruptionBudget, ServiceMonitor; Probes auf Liveness/Readiness; nicht-root, schreibgeschütztes Dateisystem mit `emptyDir` für `/tmp` und `/data`; Geheimnisse ausschließlich aus einem vorhandenen Secret. Die CI prüft das Chart mit `helm lint --strict` und rendert es mit mehreren Wertesätzen.
- **Hintergrundketten** (Tages-Snapshots, Eskalation) sind als solche registriert; `jobs.idle()` wartet nicht auf sie.

## Konsequenzen
- Für Mehrinstanzbetrieb: PostgreSQL, `OBJECT_STORE=s3`, `RATE_LIMIT_STORE=db`; Container-Image wird aus dem Dockerfile gebaut und in eine eigene Registry übertragen (Wert `image.repository`).
