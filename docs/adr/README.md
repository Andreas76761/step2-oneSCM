# ADR-Liste

| ADR | Titel | Status |
|---|---|---|
| [ADR-001](ADR-001-monorepo-typescript.md) | Monorepo mit React + TypeScript und Node.js + TypeScript | akzeptiert |
| [ADR-002](ADR-002-fastify.md) | Fastify als HTTP-Framework, Fehler als `application/problem+json` | akzeptiert |
| [ADR-003](ADR-003-datenbank.md) | SQLite für Demo/Test, PostgreSQL für Produktion, dialektneutrale Migrationen | akzeptiert, umgesetzt |
| [ADR-004](ADR-004-unveraenderlichkeit.md) | Unveränderliche Ursprungstexte und append-only Versionierung | akzeptiert |
| [ADR-005](ADR-005-markdown-parser.md) | Eigener, nicht ausführender Markdown-Struktur-Parser | akzeptiert |
| [ADR-006](ADR-006-aehnlichkeit.md) | Austauschbare Ähnlichkeits-Engine, TF-IDF-Kosinus | akzeptiert (E-05) |
| [ADR-007](ADR-007-extraktiver-generator.md) | Extraktiver Kapitelgenerator, LLM nur optional hinter Schnittstelle | akzeptiert (E-09) |
| [ADR-008](ADR-008-jobs-storage.md) | Persistente Jobqueue und Object-Store (Dateisystem oder S3-kompatibel) | akzeptiert, umgesetzt |
| [ADR-009](ADR-009-berechtigungen.md) | Trennung fachlicher Rollen und technischer Berechtigungen | akzeptiert (E-03, E-15) |
| [ADR-010](ADR-010-traceability.md) | Traceability aus OpenAPI `x-requirements` und Test-Registry | akzeptiert |
| [ADR-011](ADR-011-oidc.md) | Anmeldung über OpenID Connect (Bearer-JWT, PKCE in der UI) | akzeptiert, umgesetzt |
| [ADR-012](ADR-012-export-rendering.md) | Sicherer Export als HTML (marked, escaped) und PDF (pdfmake) | akzeptiert, umgesetzt |
| [ADR-013](ADR-013-ki-umformulierung.md) | KI-gestützte Umformulierung als Vorschlag mit Quellenbindung je Satz | akzeptiert, umgesetzt (E-16; Kapitel-Aufträge in Etappe 6) |
| [ADR-014](ADR-014-mandanten.md) | Mandanten/Projekte mit Mitgliedschaften und Mandantentrennung | akzeptiert, umgesetzt |
| [ADR-015](ADR-015-betrieb.md) | Betrieb: Health, Metriken, Rate-Limiting, Backup/Restore, Lasttest | akzeptiert, umgesetzt |
| [ADR-016](ADR-016-barrierefreiheit.md) | Barrierefreiheit (WCAG 2.2 AA) und responsive Oberfläche | akzeptiert, umgesetzt |
| [ADR-017](ADR-017-semantische-suche.md) | Semantische Suche und hybride Analyse mit Embeddings | akzeptiert, umgesetzt |
| [ADR-018](ADR-018-releases.md) | Handbuch-Releases und statische Online-Hilfe | akzeptiert, umgesetzt |
| [ADR-019](ADR-019-kollaboration.md) | Kollaboration: Kommentare, Aufgaben, Benachrichtigungen | akzeptiert, umgesetzt |
| [ADR-020](ADR-020-mehrsprachigkeit.md) | Mehrsprachigkeit mit Satz-Zuordnung und Freigabe je Sprache | akzeptiert, umgesetzt |
| [ADR-021](ADR-021-mehrsprachige-releases.md) | Mehrsprachige Releases mit Sprachumschalter und Rückfall auf Deutsch | akzeptiert, umgesetzt |
| [ADR-022](ADR-022-fremdsysteme.md) | Import aus Confluence-/HTML-Export, Word und Git-Repositories | akzeptiert, umgesetzt |
| [ADR-023](ADR-023-analytik.md) | Analytik: Kennzahlen-Zeitreihen, Freigabedauer, Projektbericht, BI-Export | akzeptiert, umgesetzt |
| [ADR-024](ADR-024-vektorindex.md) | Vektorindex: exakt, HNSW im Speicher oder pgvector | akzeptiert, umgesetzt |
| [ADR-025](ADR-025-mehrstufige-freigabe.md) | Mehrstufige Freigabe mit Vier-Augen-Prinzip, Fristen und Eskalation | akzeptiert, umgesetzt |
| [ADR-026](ADR-026-assistent.md) | Handbuch-Assistent: Antworten nur aus freigegebenen Absätzen mit Quellen | akzeptiert, umgesetzt |
| [ADR-027](ADR-027-betrieb-skalierung.md) | Betrieb & Performance: Import, Helm, OpenTelemetry, verteilte Rate-Limits | akzeptiert, umgesetzt |
