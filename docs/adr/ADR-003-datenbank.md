# ADR-003 SQLite für Demo/Test, PostgreSQL für Produktion

**Status:** akzeptiert – PostgreSQL-Adapter folgt in Etappe 2

## Entscheidung
Etappe 1 nutzt `better-sqlite3` (synchron, transaktionssicher, keine Infrastruktur für Demo/Tests). Migrationen (`apps/server/migrations/*.sql`) verwenden nur dialektneutrales SQL (TEXT/INTEGER/REAL, keine SQLite-Spezialitäten außer `AUTOINCREMENT`-freie IDs). IDs sind Präfix-UUIDs (Text), Zeitstempel ISO-8601 (Text). Zugriff erfolgt ausschließlich über `db.ts`, sodass ein PostgreSQL-Adapter (`pg`) ohne Änderung der Services ergänzt werden kann.

## Konsequenzen
- SQLite ist **nicht** für Produktionslast freigegeben (Schreib-Nebenläufigkeit).
- JSON-Felder werden als TEXT gespeichert; in PostgreSQL später als `jsonb`.
