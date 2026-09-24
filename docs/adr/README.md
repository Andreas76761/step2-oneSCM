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
