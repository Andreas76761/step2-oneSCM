# ADR-008 Persistente Jobqueue und Object-Storage-Abstraktion

**Status:** akzeptiert – Jobqueue in Etappe 2 persistent gemacht

## Entscheidung
- `jobs.ts`: Jobs liegen in der Tabelle `jobs` (Typ, Payload, Status, Versuche, `run_after`, Lease). Ein Worker je Instanz holt Jobs ab:
  - PostgreSQL: `UPDATE … WHERE id = (SELECT … FOR UPDATE SKIP LOCKED)` – mehrere Instanzen arbeiten parallel, ohne einen Job doppelt zu nehmen.
  - SQLite: Abholung in einer Transaktion (eine Instanz).
- Fehler → erneuter Versuch mit exponentiellem Backoff bis `max_attempts` (Standard 3), danach `failed` und fachlicher Fehler-Handler (z. B. Import auf `failed`).
- Neustart: Jobs im Status `running`, deren Lease (`JOB_LEASE_MS`, Standard 10 min) abgelaufen ist, werden wieder eingereiht; bei SQLite alle.
- Handler sind idempotent: Der Import-Job löscht sein Protokoll vor jedem Lauf und erkennt eigene Revisionen wieder; die Analyse schreibt alle Ergebnisse in einer Transaktion.
- Payloads enthalten nur IDs; die Originaldatei liegt im Object-Store (`uploads/<sha256>`).
- `JOB_WORKER=0` startet eine reine API-Instanz ohne Worker.
- `storage.ts`: Interface `ObjectStore` (`put`, `get`, `exists`); Implementierung `LocalObjectStore` (Dateisystem, Schlüssel = SHA-256). Für mehrere Instanzen muss `DATA_DIR/objects` ein gemeinsames Volume sein oder ein S3-kompatibler Store ergänzt werden.

## Alternativen
pg-boss/BullMQ: ausgereifter, aber zusätzliche Abhängigkeit (Redis bzw. pg-only) und kein SQLite-Betrieb für Demo/Tests.
