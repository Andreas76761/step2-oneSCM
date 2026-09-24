# ADR-008 Persistente Jobqueue und Object-Storage-Abstraktion

**Status:** akzeptiert – Jobqueue in Etappe 2 persistent gemacht, S3-Speicher in Etappe 4 ergänzt

## Entscheidung
- `jobs.ts`: Jobs liegen in der Tabelle `jobs` (Typ, Payload, Status, Versuche, `run_after`, Lease). Ein Worker je Instanz holt Jobs ab:
  - PostgreSQL: `UPDATE … WHERE id = (SELECT … FOR UPDATE SKIP LOCKED)` – mehrere Instanzen arbeiten parallel, ohne einen Job doppelt zu nehmen.
  - SQLite: Abholung in einer Transaktion (eine Instanz).
- Fehler → erneuter Versuch mit exponentiellem Backoff bis `max_attempts` (Standard 3), danach `failed` und fachlicher Fehler-Handler (z. B. Import auf `failed`).
- Lease: Laufende Jobs verlängern ihre Lease per Heartbeat (alle `JOB_LEASE_MS`/3). Bei **jedem Polling** werden Jobs mit abgelaufener Lease (`JOB_LEASE_MS`, Standard 10 min) zurückgeholt – erneut eingereiht oder, bei ausgeschöpften Versuchen, endgültig fehlgeschlagen samt Fehler-Handler. SQLite (eine Instanz) holt beim Start alle laufenden Jobs zurück.
- Anlegen atomar: Fachdatensatz (Import, Analyselauf), Audit und Job werden in einer Transaktion geschrieben; der Worker wird erst nach dem Commit geweckt, Timer entstehen außerhalb des Transaktionskontexts (`Db.outside`).
- Handler sind idempotent: Der Import-Job löscht sein Protokoll vor jedem Lauf und erkennt eigene Revisionen wieder; die Analyse schreibt alle Ergebnisse in einer Transaktion.
- Payloads enthalten nur IDs; die Originaldatei liegt im Object-Store (`uploads/<sha256>`).
- `JOB_WORKER=0` startet eine reine API-Instanz ohne Worker.
- `storage.ts`: Interface `ObjectStore` (`put`, `get`, `exists`), Schlüssel = SHA-256 bzw. eindeutige IDs, Inhalte werden nie überschrieben.
  - `LocalObjectStore` (Dateisystem unter `DATA_DIR/objects`) für Einzelinstanz, Demo und Tests.
  - `S3ObjectStore` (Etappe 4) für den Mehrinstanzbetrieb: AWS S3 oder S3-kompatibel (MinIO, Ceph …) über `OBJECT_STORE=s3`, `S3_BUCKET`, optional `S3_PREFIX`, `S3_ENDPOINT`, `S3_REGION`, `S3_FORCE_PATH_STYLE`. Zugangsdaten über die Standardkette des AWS-SDK (Umgebungsvariablen, Instanzrolle). Unveränderlichkeit: `HEAD` + bedingtes `PUT` (`If-None-Match: *`); 412/409 = existiert bereits; Speicher ohne bedingtes Schreiben (501) fallen auf ein normales `PUT` nach der `HEAD`-Prüfung zurück.
  - Getestet gegen `s3rver` (lokal) und moto-Server (CI; das Docker-Image `minio/minio` ist nicht mehr verfügbar).

## Alternativen
pg-boss/BullMQ: ausgereifter, aber zusätzliche Abhängigkeit (Redis bzw. pg-only) und kein SQLite-Betrieb für Demo/Tests.
