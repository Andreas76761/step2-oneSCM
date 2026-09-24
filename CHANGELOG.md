# Changelog

## 0.4.0 – Etappe 4 (24.09.2026)

### Hinzugefügt
- Versionsvergleich ganzer Kapitelversionen (US-019): `GET /chapters/{id}/compare`, Seite „Versionsvergleich“ mit hinzugefügten, entfernten, geänderten und verschobenen Absätzen, Textdiff und Feldänderungen.
- S3-kompatibler Object-Store (`OBJECT_STORE=s3`) für den Mehrinstanzbetrieb; unveränderliche Ablage per bedingtem Schreiben (ADR-008).
- CI prüft den S3-Speicher gegen einen moto-S3-Server, lokal gegen s3rver. `/health` meldet den Speichertyp.
- Tests T-126, T-127, E2E T-204.

### Behoben
- Stabile Lineage bei Neugenerierung: Zuordnung über Abschnitt, Blocktyp und Quellen; quellenlose Lückenhinweise und Blöcke mit gleichen Quellen behalten ihre Lineage (Grundlage für Historie und Vergleich).

## 0.3.0 – Etappe 3 (24.09.2026)

### Hinzugefügt
- Freigabeworkflow (US-016): Einreichen (nur mit bestandenem Qualitätsgate), Zurückziehen, Freigeben, Ablehnen zurück in den Entwurf; eingereichte Versionen sind gesperrt; Freigabe-Eingang in der UI.
- Terminologieverwaltung (US-015): Tabelle `terminology_terms`, Seite „Terminologie“, Konsistenzprüfung, Ausmustern mit Audit; bestehende Einträge aus der Einstellung werden einmalig übernommen.
- Evidenzansicht (US-011): Quellen je Absatz mit Revision, Bestätigung und Auffälligkeiten; Seite „Evidenz“.
- Optimierungsübersicht (US-013): Kennzahlen je Kapitel, Nachweisquote, priorisierte Empfehlungen.
- Export als HTML und PDF (US-014, ADR-012) – eingebettetes HTML aus Quellen wird nie ausgeführt.
- Tests T-121 … T-125 und E2E T-203.

### Geändert
- `POST /chapter-versions/{id}/approve` erwartet jetzt eine eingereichte Version (`in_review`).
- Terminologie ist nicht mehr Teil der Einstellungen.

### Behoben (Review zu Etappe 2)
- OIDC: `OIDC_AUDIENCE` ist Pflicht, `aud` wird immer geprüft.
- Jobqueue: Lease-Rückholung bei jedem Polling, Heartbeat; Import/Analyselauf und Job atomar angelegt.

## 0.2.0 – Etappe 2 (24.09.2026)

### Entschieden
- Alle P0-Entscheidungen E-01 … E-15 und Widersprüche W-01 … W-09 als Übernahme der vorläufigen Annahmen festgelegt (Entscheidungsprotokoll in docs/04). Markierungen `ANNAHME` → `ENTSCHEIDUNG`, UI-Hinweise entsprechend.

### Hinzugefügt
- PostgreSQL-Adapter (`DATABASE_URL`) neben SQLite; asynchrone Datenbankschnittstelle mit Transaktionen über `AsyncLocalStorage` (ADR-003).
- OIDC-Anmeldung: Bearer-JWT-Prüfung in der API, Berechtigungen aus IdP-Gruppen, PKCE-Login in der UI, `GET /api/v1/auth/config` (ADR-011).
- Persistente Jobqueue (Tabelle `jobs`) mit Wiederholung, Backoff, Lease und Neustart-Sicherheit; Import- und Analyse-Jobs idempotent (ADR-008).
- Vorschlag des führenden Kapitels für Canonical Topics (E-06).
- Tests T-118 … T-120; die Testsuite läuft gegen SQLite und PostgreSQL. ESLint-Prüfung auf unabgewartete Promises.
- CI: PostgreSQL-Service, Lint; docker-compose mit PostgreSQL.

### Geändert
- Downloads (Export, Traceability) laufen authentifiziert per `fetch`.
- Migration 002: `import_items.position` ersetzt die SQLite-`rowid`-Sortierung.

## 0.1.0 – Etappe 1 (24.09.2026)

### Hinzugefügt
- Projektpaket unverändert unter `reference/` abgelegt (Masterprompt, Start-Hinweise, Referenz-UI).
- Gap-Analyse, P0-Reihenfolge, Repository-Struktur, offene Entscheidungen (E-01 … E-15, W-01 … W-09), Datenmodell, 10 ADRs.
- Server (Node.js + TypeScript, Fastify, SQLite):
  - ZIP-/MD-Import als Hintergrundjob mit SHA-256, Revisionslogik, Teilfehlern, Zip-Bomb-Grenzen (US-001).
  - Nicht ausführender Markdown-Struktur-Parser, `Ohne Kapitel` (US-002).
  - Rollen-/Sparten-/Markt-/Release-Klassifikation mit Score, Methode, Modellversion, Evidenzstatus (US-003, US-004).
  - TF-IDF-Ähnlichkeit, Cluster, Dopplungsstufen 1–3, Canonical Topics (US-005, US-006).
  - Widerspruchsregeln inkl. aller zehn Entscheidungsoptionen (US-007).
  - Extraktiver Kapitelgenerator mit 10-teiliger Struktur und Quellen je Absatz (US-008).
  - Kapitelwerkstatt mit append-only Blockversionen, Sperren, Wiederherstellen, Schutz manueller Änderungen (US-009).
  - Qualitätsgate, protokollierte Freigabe, unveränderliche freigegebene Versionen (US-012).
  - Gefilterter Markdown-/JSON-Export, Datenschutzblocker (US-010, US-014, US-018).
  - Traceability-Matrix als JSON/CSV/Markdown/Excel (US-020).
- Web-UI (React + TypeScript) mit allen 14 Navigationspunkten aus §14.
- OpenAPI 3.1.1 mit `x-requirements` je Operation.
- 26 Unit-/API-Tests, 2 Playwright-E2E-Tests, CI (Node 20 + 22), Dockerfile, fiktive Demo-Daten.

### Offen (nächste Etappen)
- Klärung der P0-Entscheidungen (docs/04-offene-entscheidungen.md).
- PostgreSQL-Adapter, OIDC-Authentifizierung, persistente Jobqueue.
