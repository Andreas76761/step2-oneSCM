# 3. Repository-Struktur

```text
.
├── README.md                      Start, Test, Betrieb
├── CHANGELOG.md
├── package.json                   npm-Workspaces (apps/server, apps/web, e2e)
├── Dockerfile / docker-compose.yml
├── .github/workflows/ci.yml       Node 20 + 22: Typecheck, Unit/API-Tests, Build, E2E; Helm; Release-Prüfung (Versionen, actionlint, Image)
├── .github/workflows/release.yml  Tag vX.Y.Z → GHCR-Image, SBOM, cosign, Helm-OCI, GitHub-Release (ADR-031)
├── reference/                     unverändertes Projektpaket (Masterprompt, Referenz-UI)
├── deploy/helm/onescm/       Helm-Chart (ADR-027)
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
│   │   ├── llm.ts                 KI-Anbieter: Anthropic, OpenAI-kompatibel, Demo (ADR-013)
│   │   ├── ops.ts                 Betrieb: Request-ID, Readiness, Metriken, Rate-Limiting (ADR-015)
│   │   ├── cli.ts                 Betriebswerkzeuge: backup / restore
│   │   ├── embeddings.ts          Embedding-Anbieter: lokal, OpenAI-kompatibel (ADR-017)
│   │   ├── notify.ts              Benachrichtigungskanäle Webhook/E-Mail (ADR-019)
│   │   ├── domain/                reine Fachlogik, ohne I/O (unit-testbar)
│   │   │   ├── reference.ts       Rollen, Sparten, Icons, Evidenzstatus
│   │   │   ├── markdown.ts        Struktur-Extraktion
│   │   │   ├── classify.ts        Rollen/Sparten/Markt/Release
│   │   │   ├── similarity.ts      TF-IDF-Kosinus, Kandidatenindex
│   │   │   ├── contradictions.ts  Widerspruchsregeln
│   │   │   ├── privacy.ts         Datenschutzmuster
│   │   │   ├── generator.ts       Kapitelstruktur (extraktiv)
│   │   │   ├── rewrite.ts         KI-Umformulierung: Anfrage, Antwort, Satzprüfung
│   │   │   ├── translate.ts       Übersetzung: Satzzerlegung, Anfrage, Prüfung (ADR-020)
│   │   │   ├── media.ts           Bildformate, Bildverweise im Markdown (ADR-029)
│   │   │   ├── outline.ts         Gliederungen: Einlesen, Nummerierung, Variantenprüfung (ADR-032)
│   │   │   ├── svg.ts             SVG-Bereinigung nach Positivliste (ADR-036)
│   │   │   ├── style.ts           Schreibstil: Satzzerlegung, Stilregeln, Korrekturen (ADR-040)
│   │   │   ├── diagrams.ts        Bilder aus Text: Struktur, ASCII/SVG-Zeichnung (ADR-041)
│   │   │   └── gate.ts            Qualitätsgate
│   │   ├── services/              Anwendungslogik mit DB (u. a. insights: Evidenz/Optimierung, render: HTML/PDF, terminology, compare: Versionsvergleich, rewrite/rewriteBatch: KI-Vorschläge und Kapitel-Aufträge, projects: Mandanten, backup, semantic: Suche/Index, vectorIndex: exakt/HNSW/pgvector, releases, collaboration, translations, connections: Git-Quellen, analytics: Kennzahlen/Bericht/BI-Export, workflow: mehrstufige Freigabe, assistant: Handbuch-Assistent, tokens/webhooks: Integrationen, media: Bilder, contextHelp: Kontexthilfe, outlines: Gliederungen/Draft Manual/Planung/Vergleich/Erinnerungen, masterData: Abkürzungen/FAQ/Bildverzeichnis, masterDataImport: CSV/Excel, variants/variantSnippets/appendixRender: Handbuch-Varianten und Verzeichnisse, search/searchIndex: Volltextsuche, variantSync: Varianten abgleichen, layout/docx: Firmen-Layout und Word-Export, style: Schreibstil inkl. Stilwert je Kapitel und Stapelkorrektur, diagrams: Bilder aus Text und Diagramm-Vorlagen, users: Benutzerverwaltung, roleTemplates: Rollenvorlagen)
│   │   └── routes/                HTTP-Routen je Ressource
│   ├── assets/help-widget.js      Einbettungsskript der Kontexthilfe (ADR-030)
│   ├── scripts/release.ts         Release-Werkzeug: check, bump, notes (ADR-031)
│   └── test/                      Vitest Unit- und API-Tests (SQLite; PostgreSQL mit TEST_DATABASE_URL)
├── apps/web/                      React + TypeScript (Vite)
│   └── src/pages/                 eine Seite je Navigationspunkt (Abschnitt 14)
└── e2e/                           Playwright (tests/app.spec.ts Abläufe, tests/a11y.spec.ts WCAG 2.2 AA mit axe)
```
