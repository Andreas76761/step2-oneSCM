# ADR-008 In-Process-Jobqueue und Object-Storage-Abstraktion

**Status:** akzeptiert

## Entscheidung
- `jobs.ts`: serielle In-Process-Queue für Import, Analyse, Generierung und Export. Status wird in der Datenbank geführt (`imports.status`), die API liefert 202 + Ressourcen-URL. Für horizontale Skalierung wird die Queue in Etappe 2+ durch eine persistente Queue (z. B. pg-boss auf PostgreSQL) ersetzt; die Schnittstelle `enqueue(name, fn)` bleibt.
- `storage.ts`: Interface `ObjectStore` (`put`, `get`, `exists`); Implementierung `LocalObjectStore` (Dateisystem, Schlüssel = SHA-256). S3-kompatibler Store ist ohne Änderung der Services ergänzbar.
