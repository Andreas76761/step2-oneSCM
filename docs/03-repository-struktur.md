# 3. Repository-Struktur

```text
.
├── README.md                      Start, Test, Betrieb
├── CHANGELOG.md
├── package.json                   npm-Workspaces (apps/server, apps/web, e2e)
├── Dockerfile / docker-compose.yml
├── .github/workflows/ci.yml       Node 20 + 22: Typecheck, Unit/API-Tests, Build, E2E
├── reference/                     unverändertes Projektpaket (Masterprompt, Referenz-UI)
├── docs/
│   ├── 01-gap-analyse.md
│   ├── 02-p0-reihenfolge.md
│   ├── 03-repository-struktur.md
│   ├── 04-offene-entscheidungen.md    P0-Entscheidungen + Widersprüche im Auftrag
│   ├── 05-datenmodell.md
│   ├── adr/                            Architecture Decision Records
│   └── traceability.md                 generierte Matrix (npm run traceability)
├── openapi/openapi.yaml           OpenAPI 3.1.1, /api/v1, x-requirements je Operation
├── traceability/
│   ├── requirements.json          User Stories (P0/P1/P2)
│   └── tests.json                 Test-ID → Story-IDs → Testdatei
├── demo-data/                     fiktive Markdown-Quellen (keine Echtdaten)
├── apps/server/                   Node.js + TypeScript (Fastify)
│   ├── migrations/                SQL-Migrationen (001_init.sql …)
│   ├── src/
│   │   ├── app.ts / index.ts      HTTP-App, Fehler als application/problem+json
│   │   ├── config.ts              Konfiguration (Env), Standardwerte der Entscheidungen
│   │   ├── auth.ts                Anmeldung: OIDC (Bearer-JWT) oder Demo-Modus
│   │   ├── db.ts                  Datenbankschnittstelle, Adapter SQLite/PostgreSQL, Migrationen
│   │   ├── storage.ts             Object-Store: lokales Dateisystem oder S3-kompatibel
│   │   ├── jobs.ts                persistente Jobqueue (Tabelle jobs)
│   │   ├── domain/                reine Fachlogik, ohne I/O (unit-testbar)
│   │   │   ├── reference.ts       Rollen, Sparten, Icons, Evidenzstatus
│   │   │   ├── markdown.ts        Struktur-Extraktion
│   │   │   ├── classify.ts        Rollen/Sparten/Markt/Release
│   │   │   ├── similarity.ts      TF-IDF-Kosinus, Kandidatenindex
│   │   │   ├── contradictions.ts  Widerspruchsregeln
│   │   │   ├── privacy.ts         Datenschutzmuster
│   │   │   ├── generator.ts       Kapitelstruktur (extraktiv)
│   │   │   └── gate.ts            Qualitätsgate
│   │   ├── services/              Anwendungslogik mit DB (u. a. insights: Evidenz/Optimierung, render: HTML/PDF, terminology, compare: Versionsvergleich)
│   │   └── routes/                HTTP-Routen je Ressource
│   └── test/                      Vitest Unit- und API-Tests (SQLite; PostgreSQL mit TEST_DATABASE_URL)
├── apps/web/                      React + TypeScript (Vite)
│   └── src/pages/                 eine Seite je Navigationspunkt (Abschnitt 14)
└── e2e/                           Playwright
```
