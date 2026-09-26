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
| [ADR-028](ADR-028-integrationen.md) | Integrationen & API: API-Tokens, signierte Webhooks, Push-Webhooks, Confluence Cloud | akzeptiert, umgesetzt |
| [ADR-029](ADR-029-bilder-medien.md) | Bilder & Medien: inhaltsadressiert, Alternativtext als Pflicht, in allen Ausgaben | akzeptiert, umgesetzt |
| [ADR-030](ADR-030-kontexthilfe.md) | Kontexthilfe für oneSCM: Kontext-IDs, Deep-Links, Hilfe-Widget | akzeptiert, umgesetzt |
| [ADR-031](ADR-031-release-pipeline.md) | Release-Pipeline: GHCR-Image, SBOM, cosign, Helm-OCI, Release-Notes | akzeptiert, umgesetzt |
| [ADR-032](ADR-032-stammdaten-gliederungen.md) | Stammdaten und Gliederungen je Variante, einklappbare Navigation | akzeptiert, umgesetzt |
| [ADR-033](ADR-033-draft-manual.md) | Draft Manual: Zuordnung von Schnipseln, Kennzeichnung von Dopplungen, Lücken, Widersprüchen, Warnungen | akzeptiert, umgesetzt |
| [ADR-034](ADR-034-handbuch-varianten.md) | Handbuch-Varianten: vom Draft Manual zu Freigabe, Export und Veröffentlichung mit Verzeichnissen | akzeptiert, umgesetzt |
| [ADR-035](ADR-035-bedienkomfort.md) | Bedienkomfort: Drag & Drop, Gliederungsvergleich, globale Suche, Darstellung, mobile Ansicht | akzeptiert, umgesetzt |
| [ADR-036](ADR-036-betrieb-pflege.md) | Betrieb & Pflege: entfernte Quelldateien, bereinigtes SVG, Stammdaten-Import, Erinnerungen | akzeptiert, umgesetzt |
| [ADR-037](ADR-037-varianten-synchronisieren.md) | Varianten synchronisieren: Abgleich mit Blueprint, Schnipsel und fehlende Einträge übernehmen | akzeptiert, umgesetzt |
| [ADR-038](ADR-038-layout-word.md) | Firmen-Layout für PDF, HTML, Online-Hilfe; Word-Export mit Formatvorlagen | akzeptiert, umgesetzt |
| [ADR-039](ADR-039-volltextsuche.md) | Volltextsuche mit Suchindex (SQLite FTS5, PostgreSQL tsvector) | akzeptiert, umgesetzt |
| [ADR-040](ADR-040-schreibstil.md) | Schreibstil: Regelprüfung, gelb markierte Sätze, Umformulierung und Präsens | akzeptiert, umgesetzt |
| [ADR-041](ADR-041-bilder-aus-text.md) | Bilder aus Text: ASCII-Bild, Klickstrecke, Prozessbild, Infografik | akzeptiert, umgesetzt |
| [ADR-042](ADR-042-bilder-word-werkstatt.md) | Bilder in Word und Werkstatt, Screenshots markieren, Diagramme nachbearbeiten und als Vorlage speichern | akzeptiert, umgesetzt |
| [ADR-043](ADR-043-schreibstil-werkstatt.md) | Schreibstil in der Werkstatt, Stilwert je Kapitel, Stapelkorrektur | akzeptiert, umgesetzt |
| [ADR-044](ADR-044-stilregeln-ki-stapel.md) | Eigene Stilregeln je Projekt, KI-Stapelumformulierung, Suchgewichtung | akzeptiert, umgesetzt |
| [ADR-045](ADR-045-benutzerverwaltung.md) | Benutzerverwaltung: anlegen, sperren, Projektzugriffe | akzeptiert, umgesetzt |
| [ADR-046](ADR-046-screenshot-editor.md) | Screenshot-Editor: Pfeile, Textfelder, Unschärfe | akzeptiert, umgesetzt |
| [ADR-047](ADR-047-rollenvorlagen-stilregeln-austausch.md) | Rollenvorlagen; Stilregeln exportieren, importieren, aus Projekten übernehmen | akzeptiert, umgesetzt |
| [ADR-048](ADR-048-stilwert-verlauf.md) | Stilwert-Verlauf je Kapitel und Projekt | akzeptiert, umgesetzt |
| [ADR-049](ADR-049-screenshot-zuschnitt-lupe.md) | Screenshot-Editor: Zuschneiden, Lupe, Verschieben | akzeptiert, umgesetzt |
| [ADR-050](ADR-050-stilregel-bibliotheken.md) | Stilregel-Bibliotheken für mehrere Projekte | akzeptiert, umgesetzt |
| [ADR-051](ADR-051-anleitungs-check.md) | Anleitungs-Check: Leserfreundlichkeit je Kapitel | akzeptiert, umgesetzt |
| [ADR-052](ADR-052-kapitel-assistent.md) | Kapitel-Assistent: geführte Erstellung mit Vorschlägen aus Quellen | akzeptiert, umgesetzt |
| [ADR-053](ADR-053-einfache-oberflaeche.md) | Einfache Oberfläche: Startseite und Menü nach Arbeitsablauf | akzeptiert, umgesetzt |
| [ADR-054](ADR-054-leseransicht-rueckmeldungen.md) | Leseransicht und Rückmeldungen von Lesern | akzeptiert, umgesetzt |
| [ADR-055](ADR-055-kapitelvorlagen.md) | Kapitelvorlagen im Assistenten, Platzhalter-Prüfung | akzeptiert, umgesetzt |
| [ADR-056](ADR-056-einfuehrung.md) | Einführung beim ersten Start | akzeptiert, umgesetzt |
| [ADR-057](ADR-057-check-vor-freigabe.md) | Anleitungs-Check vor der Freigabe (optional als Bedingung) | akzeptiert, umgesetzt |
| [ADR-058](ADR-058-rueckmeldungen-auswerten.md) | Rückmeldungen auswerten, Aufgabe aus Rückmeldung | akzeptiert, umgesetzt |
| [ADR-059](ADR-059-eigene-kapitelvorlagen.md) | Eigene Kapitelvorlagen je Projekt | akzeptiert, umgesetzt |
| [ADR-060](ADR-060-druckansicht.md) | Druck- und PDF-Ansicht des Handbuchs | akzeptiert, umgesetzt |
| [ADR-061](ADR-061-online-hilfe-rueckmeldung.md) | Rückmeldungen in der Online-Hilfe (anonym, geschützt) | akzeptiert, umgesetzt |
| [ADR-062](ADR-062-vorlagen-bearbeiten.md) | Eigene Kapitelvorlagen vollständig bearbeiten | akzeptiert, umgesetzt |
| [ADR-063](ADR-063-druck-deckblatt.md) | Druck mit Deckblatt und Seitenzahlen | akzeptiert, umgesetzt |
| [ADR-064](ADR-064-wochenuebersicht.md) | Wöchentliche Übersicht für die Redaktion | akzeptiert, umgesetzt |
| [ADR-065](ADR-065-druck-variante-rolle.md) | Druck je Variante und Rolle im Firmen-Layout | akzeptiert, umgesetzt |
| [ADR-066](ADR-066-suche-glossar-lesen.md) | Suche und Glossar in der Leseransicht | akzeptiert, umgesetzt |
| [ADR-067](ADR-067-vorlagen-teilen.md) | Kapitelvorlagen duplizieren, exportieren und importieren | akzeptiert, umgesetzt |
| [ADR-068](ADR-068-schnelles-laden.md) | Schnelles Laden: Code-Splitting, vorkomprimierte Dateien, Caching | akzeptiert, umgesetzt |
| [ADR-069](ADR-069-siehe-auch-faq.md) | „Siehe auch“ und passende häufige Fragen | akzeptiert, umgesetzt |
| [ADR-070](ADR-070-lesezeichen-verlauf.md) | Lesezeichen und Verlauf in der Leseransicht | akzeptiert, umgesetzt |
| [ADR-071](ADR-071-sprachen-beim-lesen.md) | Sprachen beim Lesen | akzeptiert, umgesetzt |
| [ADR-072](ADR-072-siehe-auch-druck-hilfe.md) | „Siehe auch“ und FAQ im Druck und in der Online-Hilfe | akzeptiert, umgesetzt |
| [ADR-073](ADR-073-lesezeichen-notizen.md) | Lesezeichen mit eigenen Notizen | akzeptiert, umgesetzt |
