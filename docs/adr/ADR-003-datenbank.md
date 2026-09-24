# ADR-003 SQLite für Demo/Test, PostgreSQL für Produktion

**Status:** akzeptiert – PostgreSQL-Adapter umgesetzt in Etappe 2

## Entscheidung
- Datenzugriff ausschließlich über die asynchrone Schnittstelle `Db` (`apps/server/src/db.ts`): `all`, `get`, `run`, `tx`, `nextSeq`.
- Zwei Adapter, gewählt über `DATABASE_URL`:
  - **PostgreSQL** (`postgres://…`, Treiber `pg`, Verbindungspool) für den Produktivbetrieb.
  - **SQLite** (`better-sqlite3`, Dateipfad) für Demo, Entwicklung und schnelle Tests.
- SQL wird in einem gemeinsamen Dialekt geschrieben: `?`-Platzhalter, `ON CONFLICT … DO NOTHING/UPDATE`, `NULLS LAST`, `LOWER(…) LIKE LOWER(?)`. Der PostgreSQL-Adapter übersetzt Platzhalter in `$n` und quotiert camelCase-Aliase (PostgreSQL faltet unquotierte Bezeichner klein).
- Migrationen (`apps/server/migrations/*.sql`) sind dialektneutral; für PostgreSQL wird `REAL` beim Anwenden zu `DOUBLE PRECISION` (exakte Scores).
- Transaktionen: PostgreSQL nutzt je Transaktion eine Pool-Verbindung, die über `AsyncLocalStorage` an alle Aufrufe innerhalb der Transaktion gebunden wird; verschachtelte `tx`-Aufrufe laufen in der äußeren mit. SQLite serialisiert Transaktionen über eine Sperre.
- Fortlaufende Nummern (`seq`) werden in PostgreSQL über eine transaktionsgebundene Advisory-Sperre vergeben.

## Konsequenzen
- Dieselbe Testsuite läuft gegen beide Datenbanken (`TEST_DATABASE_URL`); die CI prüft beide.
- ESLint (`no-floating-promises`) stellt sicher, dass kein Datenbankaufruf unabgewartet bleibt.
- JSON-Felder bleiben TEXT (in beiden Dialekten gleich); eine spätere Umstellung auf `jsonb` ist eine eigene Migration.
