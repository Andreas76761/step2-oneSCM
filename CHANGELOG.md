# Changelog

## 0.8.0 – Etappe 8 (24.09.2026)

### Hinzugefügt
- **Mehrsprachige Releases (ADR-021):** Releases enthalten die freigegebenen Übersetzungen der veröffentlichten Kapitelversionen; Online-Hilfe je Sprache unter `<sprache>/` mit Sprachumschalter und Rückfall auf Deutsch, Markdown je Sprache (`?language=`), Übersetzungsstand im Dashboard. Migration `011_release_languages.sql`.
- **Import aus Fremdsystemen (ADR-022):** Confluence-/HTML-Export und Word (`.docx`) werden in Markdown umgewandelt, das Original bleibt erhalten (`GET /source-revisions/{id}/original`, Backup). Git-Quellverbindungen mit flachem Klon, Abgleich nur bei neuem Commit und periodischer Neu-Synchronisierung; Tokens nur über Umgebungsvariablen `GIT_CREDENTIAL_*`. Migration `012_external_sources.sql`; Container-Image mit `git`.
- **Analytik & Berichte (ADR-023):** tägliche Kennzahlen-Snapshots je Projekt, Zeitreihen mit Fortschreibung, Aktivität je Tag, Prüfdauer/Durchlaufzeit/Erstfreigabequote, Projektbericht als PDF, BI-Export CSV/JSON; Seite „Analytik“. Migration `013_kpi_snapshots.sql`.
- **Skalierung der semantischen Suche (ADR-024):** Vektorindex im Speicher (exakt) mit HNSW-Graph ab `semantic.annThreshold` Abschnitten (Hintergrundaufbau), oder pgvector mit HNSW-Index in PostgreSQL (`VECTOR_INDEX`); günstige Änderungserkennung statt Vollabfragen je Suche; hybride Analyse großer Bestände über kNN statt n²-Vergleich; Lasttest `npm run perf:semantic` mit 50 000 Textabschnitten ([docs/lasttest-semantik.md](docs/lasttest-semantik.md)). Migration `014_vector_index.sql`.
- Tests T-142 … T-148, E2E T-214, T-215 (axe auch für „Analytik“); Anforderungen NFR-08 … NFR-11.

### Geändert
- Standard-Endungen für den Import um `.html`, `.htm`, `.docx` erweitert (gespeicherte Einstellungen bleiben unverändert).
- CI und `docker-compose.yml` nutzen `pgvector/pgvector:pg16`.
- `jobs.idle()` wartet nicht auf Jobs, die erst nach der Wartezeit fällig sind (geplante Abgleiche und Snapshots).

### Behoben (Review Etappe 7)
- Backup enthält Release-Artefakte; Kommentare und Releases werden in Eltern-vor-Kind-Reihenfolge wiederhergestellt; leere übersetzte Sätze decken keine Quelle ab; Einstellungen „semantic“ und „rewrite“ werden gespeichert.

## 0.7.0 – Etappe 7 (24.09.2026)

### Hinzugefügt
- **Semantische Suche (ADR-017):** Embedding-Anbieter lokal (ohne Netzwerk) oder OpenAI-kompatibel (OpenAI, Azure, Voyage, Ollama); inkrementeller Vektorindex je Projekt; Suche auf der Seite „Quellen“; optionale hybride Analyse (TF-IDF + Embeddings). Migration `007_embeddings.sql`.
- **Veröffentlichung (ADR-018):** Handbuch-Releases aus allen freigegebenen Kapiteln mit Änderungsliste zur Vorversion, statischer Online-Hilfe (ZIP, ohne Skripte) und Markdown; Seite „Veröffentlichung“. Migration `008_releases.sql`.
- **Kollaboration (ADR-019):** Diskussionen an Absätzen (versionsübergreifend über die Lineage), Befunden und Kapiteln; Antworten, @Erwähnungen, Aufgaben mit Zuständigkeit und Frist; Benachrichtigungen in der App, per Webhook und E-Mail; Tab „Diskussion“ und Seite „Aufgaben & Hinweise“. Migration `009_collaboration.sql`.
- **Mehrsprachigkeit (ADR-020):** Zielsprachen je Projekt, Übersetzung freigegebener Kapitel per KI mit Satz-Zuordnung oder manuell, formale Prüfung, Freigabe je Sprache, Export; Seite „Übersetzungen“. Migration `010_translations.sql`.
- Tests T-137 … T-141, E2E T-210 … T-213; Anforderungen NFR-04 … NFR-07; axe-Prüfung auch der neuen Seiten.

### Behoben (Review Etappe 6)
- Globale Einstellungen und systemweite Audit-Einträge nur mit globaler Administration; PostgreSQL-Backup aus einem Snapshot; höchstens ein aktiver KI-Auftrag je Kapitelversion (eindeutiger Index); wartende Jobs archivierter Projekte werden nicht ausgeführt.

## 0.6.0 – Etappe 6 (24.09.2026)

### Hinzugefügt
- **Mandanten/Projekte (ADR-014):** mehrere Handbuch-Projekte, Projektwahl je Anfrage (`X-Project-Id`), Sichtbarkeit offen/eingeschränkt, Mitgliedschaften mit Berechtigungen je Projekt, Archivierung; Seite „Projekte“ und Projektauswahl in der Seitenleiste. Migration `005_projects.sql`.
- **Mandantentrennung:** IDs in Pfaden und Nutzdaten werden auf das Projekt geprüft; Dashboard, Audit und Hintergrundjobs je Projekt.
- **Betrieb (ADR-015):** Liveness/Readiness, Request-ID, strukturierte Logs mit Benutzer/Projekt, Prometheus-Metriken (`/metrics`), Rate-Limiting je Benutzer, portables Backup/Restore per CLI (auch SQLite → PostgreSQL), Lasttest-Skript; Docker-Healthcheck auf Readiness.
- **KI-Umformulierung ganzer Kapitel:** Hintergrundjob mit Fortschritt, Abbruch und Fortsetzen, Sammelprüfung, Sammelübernahme gültiger Vorschläge, Nutzung/Tokens/geschätzte Kosten je Modell. Migration `006_rewrite_batches.sql`.
- **Barrierefreiheit (ADR-016):** WCAG 2.2 AA per axe in der E2E-Suite (hell/dunkel, Interaktionszustände), Sprunglink, Fokusführung, Dialog-Fokusfalle, Tastaturbedienung klickbarer Elemente, Menü-Schalter und Layouts für schmale Bildschirme.
- Tests T-132 … T-136, E2E T-206 … T-209; Anforderungen NFR-01 … NFR-03 in der Traceability.

### Geändert
- Umformuliert werden nur Absätze, die selbst durch ihre Quellen gedeckt sind (keine vom Generator erzeugten Rollen-/Statushinweise).
- Kontraste: dunkleres Grün für Statusangaben, getrennte Link- und Buttonfarbe, Badges im Dark Mode.

### Sicherheit
- `@fastify/static` 10.x (Pfad-Traversal/Route-Guard-Umgehung), `uuid` 11 für `exceljs`; `npm audit` für Laufzeitabhängigkeiten in der CI.

## 0.5.0 – Etappe 5 (24.09.2026)

### Hinzugefügt
- KI-gestützte Umformulierung je Absatz als Vorschlag (Entscheidung E-16, ADR-013): Adapter für Anthropic Claude (Messages API) und OpenAI-kompatible Endpunkte, Demo-Anbieter ohne Netzwerk; standardmäßig ausgeschaltet (`LLM_PROVIDER`).
- Satzprüfung: jeder Satz nennt Quellen des Absatzes; unbekannte Quellen, neue Zahlen, geringe Wortabdeckung und neue personenbezogene Daten machen den Vorschlag ungültig.
- Übernahme durch die Redaktion: Modus `ai_rewritten`, Satz-Evidenz am Absatz, Blockversion `rewritten`, Schutz bei Neugenerierung; Audit mit Anbieter, Modell, Prompt-Hash und übertragenen Textabschnitten.
- Qualitätsgate-Prüfung `sentence_evidence`; Kapitelwerkstatt mit „✨ KI-Vorschlag“, Textdiff, Quellen und Abdeckung je Satz; Satz-Evidenz im Quellen-Tab.
- API: `GET /llm/status`, `POST|GET /content-blocks/{id}/rewrite-proposals`, `GET /rewrite-proposals/{id}`, `POST /rewrite-proposals/{id}/accept|reject`; Migration `004_rewrite.sql`.
- Tests T-128 … T-131, E2E T-205.

### Geändert
- `PATCH /content-blocks/{id}` akzeptiert als `mode` nur noch `locked`, `manually_edited` oder `generated`.

## 0.4.0 – Etappe 4 (24.09.2026)

### Hinzugefügt
- Versionsvergleich ganzer Kapitelversionen (US-019): `GET /chapters/{id}/compare`, Seite „Versionsvergleich“ mit hinzugefügten, entfernten, geänderten und verschobenen Absätzen, Textdiff und Feldänderungen; Umsortierungen innerhalb eines Abschnitts werden als „verschoben“ erkannt (längste gemeinsam geordnete Teilfolge bleibt stehen).
- S3-kompatibler Object-Store (`OBJECT_STORE=s3`) für den Mehrinstanzbetrieb; unveränderliche Ablage per bedingtem Schreiben (ADR-008); `docker-compose.yml` reicht `S3_*` und `AWS_*`-Zugangsdaten an den Container durch.
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
