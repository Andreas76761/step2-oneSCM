# 1. Gap-Analyse

**Stand:** 24.09.2026 · **Basis:** `reference/CLAUDE_MASTER_PROMPT.md` v1.0, `reference/REFERENZ_UI.png`
**Ausgangslage:** leeres Repository (keine Commits, kein Code, keine Daten).

Legende Status: ✅ im ersten Implementierungsschritt umgesetzt · 🟡 umgesetzt als *vorläufige Annahme* (seit 24.09.2026 als Entscheidung übernommen, siehe 1.4) · ⏳ bewusst späteren Etappen zugeordnet · ❓ fachlich ungeklärt

## 1.1 Anforderungen vs. Ist

| Bereich | Soll (Masterprompt) | Ist vorher | Ergebnis Etappe 1 |
|---|---|---|---|
| Import (US-001) | ZIP + MD, SHA-256, Status, Teilfehler, identische Revision, Originale unveränderlich | nichts | ✅ ZIP/MD-Import als Hintergrundjob, SHA-256 je Datei, Import-Items mit Status `imported`/`identical`/`failed`/`skipped`, Originaldatei im Object-Store (content-addressed) 🟡 Limits/Dateitypen konfigurierbar |
| Struktur (US-002) | H1→Kapitel, H2→Unterkapitel, H3–H6 erhalten, Reihenfolge, `Ohne Kapitel` | nichts | ✅ eigener, nicht ausführender Markdown-Parser, `heading_path`, Zeilennummern, Position; 🟡 Snippet-Granularität = Absatz/Liste/Tabelle/Code/Zitat |
| Rollen (US-003) | Mehrfachzuordnung, Score, Methode, Modellversion, Evidenzstatus, Trennung fachliche Rolle/Berechtigung | nichts | ✅ m:n `snippet_roles` mit Score/Methode/Modellversion/Evidenzstatus; Berechtigungen separat in `users.permissions`; 🟡 Klassifikation = Schlüsselwortregeln `rules-1.0` |
| Sparten (US-004) | unabhängig von Rollen, Icon+Label, Dateinamen-Ableitung unbestätigt | nichts | ✅ m:n `snippet_divisions`; Ableitung aus Dateiname/Pfad immer `unconfirmed` |
| Clustering (US-005) | kapitelintern/-übergreifend, Schwellen konfigurierbar, Score/Quelle/Methode/Begründung, bestätigen/teilen/zusammenführen/umbenennen | nichts | ✅ TF-IDF-Kosinus (`tfidf-cosine-1.0`), Schwellen in Einstellungen, Cluster-Aktionen; 🟡 Verfahren selbst ist P0-offen (kein Embedding-Modell verfügbar/entschieden) |
| Dopplungen (US-006) | exakt vs. semantisch getrennt, CanonicalTopic, Querverweis, kein Auto-Löschen | nichts | ✅ Stufe 1 (Hash) + Stufe 2 (semantisch) + Stufe 3 (kapitelübergreifend) getrennt; Canonical Topic nur per Entscheidung; Generator setzt Querverweis |
| Widersprüche (US-007) | beide Aussagen + Kontext, Blocker sperren Generierung/Freigabe/Export, Entscheidung mit Begründung/Entscheider/Zeit, Unterschiedsklassen | nichts | ✅ Regeln Negation, Pflicht/Optional, Zahl, Frist, Zuständigkeit, Rollen/Sparten/Markt/Release-Unterschied, veraltete Quelle; alle 10 Entscheidungsoptionen; 🟡 Blocker-Definition konfigurierbar |
| Generierung (US-008) | nur bestätigte Quellen, 10-teilige Struktur, Absatz-Traceability, nichts erfinden | nichts | ✅ **extraktiver** Generator (keine Textsynthese → nichts erfunden), leere Abschnitte werden als Lücke (`gap`) statt mit Fülltext markiert; ⏳ LLM-gestützte Umformulierung hinter Schnittstelle (ADR-007) |
| Werkstatt (US-009) | hinzufügen/ändern/löschen/verschieben, Versionierung, Schutz manueller Änderungen, Vergleich, Wiederherstellung | nichts | ✅ `content_block_versions` (append-only), Modi `generated`/`manually_edited`/`locked`/`needs_regeneration`/`approved`, Diff + Restore |
| Icons (US-010) | eindeutige Icons, Icon+Label+Farbe, gefilterte Ansicht = allgemein + passend | nichts | ✅ zentrale Referenzdaten, `Badge`-Komponente rendert immer Icon+Label+Farbe; Filterlogik serverseitig getestet |
| Qualitätsgate (US-012) | keine Blocker, Evidenz/Begründung je Absatz, Klassifikation bestätigt oder bewusst allgemein, Freigabe protokolliert | nichts | ✅ Gate-Service mit Einzelprüfungen; Freigabe nur mit Berechtigung `approve`; Approval + Audit; veröffentlichte Version unveränderlich |
| Traceability (US-020) | Anforderung↔API↔Test↔Doku↔Release, Export Excel/CSV/MD | nichts | ✅ `x-requirements` in OpenAPI wird geparst, Test-Registry `traceability/tests.json`, Export XLSX/CSV/MD, Test-Check „jede Operation hat ≥1 Story“ |
| P1 Dashboard/Optimierungen | | nichts | ✅ Basis (Kennzahlen, Befundverteilung, Lesbarkeit/Terminologie-Befunde) |
| P1 Terminologieverwaltung | | nichts | 🟡 Terminologie-Liste in Einstellungen (bevorzugt/abgelehnt), Befundtyp `terminology`; ⏳ eigene Verwaltungsmaske |
| P1 Suche/Filter | | nichts | ✅ kombinierte Suche (Text, Kapitel, Unterkapitel, Rolle, Sparte, Markt, Release, Evidenzstatus) — als Pflichttest ohnehin nötig |
| P1 Datenschutzprüfung | | nichts | ✅ Muster E-Mail/Telefon/IBAN → `privacy`-Blocker (Pflicht wegen US-012/Tests) |
| P2 Versionsvergleich | | nichts | ✅ Block-Versionsvergleich (wegen US-009); ⏳ Vergleich ganzer Kapitelversionen |
| Produktion PostgreSQL | | nichts | ⏳ Migrationen sind dialektneutral gehalten; PostgreSQL-Adapter in Etappe 2 (ADR-003) |
| Echte Authentifizierung | RBAC | nichts | 🟡 Demo-Benutzer mit Berechtigungen per Header `X-User-Id`; ⏳ OIDC/IdP-Anbindung |
| Docker, CI, E2E | | nichts | ✅ Dockerfile, docker-compose, GitHub Actions (Node 20 + 22), Playwright-Smoke-Test |

## 1.2 Lücken im Masterprompt selbst

1. **Story-Nummerierung lückenhaft:** US-011 und US-013…US-019 fehlen. Die P1/P2-Stories aus Abschnitt 5 haben keine IDs. → Vorläufig vergeben: US-011 Evidenz-/Quellenansicht, US-013 Optimierungsdashboard, US-014 gefilterter Export, US-015 Terminologie, US-016 Freigabeworkflow, US-017 Suche/Filter, US-018 Datenschutzprüfung, US-019 Versionsvergleich (**Annahme, zu bestätigen**, siehe E-14).
2. **Evidenzstatus unvollständig definiert:** genannt werden `source_confirmed`, `manually_confirmed`, `unconfirmed`, `open_question`. Semantik von `source_confirmed` fehlt. → Annahme: `source_confirmed` = explizit in der Quelle (Front-Matter) deklariert.
3. **Keine Definition von „Blocker“** außer „offene Blocker-Widersprüche oder Datenschutzblocker“.
4. **Keine Markt-/Releaseliste**, keine Regeln zur Ableitung.
5. **Keine Aufbewahrungsfristen** für Ursprungstexte, Versionen, Audit.
6. **Keine Uploadgrenzen** (Größe, Anzahl Dateien, ZIP-Tiefe, Zip-Bomb-Schutz).
7. **Keine Freigeberrollen** (wer darf freigeben? Vier-Augen-Prinzip?).
8. **Keine Barrierefreiheitsnorm** (WCAG-Level) genannt.
9. **Keine Exportformate** für das Handbuch (nur Traceability-Formate genannt). → Annahme: Markdown + HTML.
10. **API-Liste deckt UI-Bedarf nicht ab** (Cluster, Canonical Topics, Einstellungen, Quellenliste, Versionsliste/Restore). → Ergänzungsoperationen mit `x-requirements` in OpenAPI, als `x-extension: true` gekennzeichnet.

## 1.3 Risiken

| Risiko | Wirkung | Maßnahme |
|---|---|---|
| Semantik ohne Embedding-Modell | Paraphrasen werden schwächer erkannt | Verfahren hinter Interface `SimilarityEngine`, Methode + Version je Treffer gespeichert, Austausch ohne Datenmigration |
| Regelbasierte Widerspruchserkennung | False Positives | Befunde sind *Hinweise*, nie automatische Entscheidung; Schwellen konfigurierbar |
| Tausende Quellen, paarweiser Vergleich O(n²) | Laufzeit | invertierter Index über Terme, Vergleich nur von Kandidaten mit gemeinsamen Termen; Job im Hintergrund |
| SQLite in Produktion | Nebenläufigkeit | nur Demo/Test; PostgreSQL in Etappe 2 |

## 1.4 Stand nach Etappe 2 (24.09.2026)

| Lücke aus Etappe 1 | Ergebnis Etappe 2 |
|---|---|
| Alle 🟡-Punkte (offene P0-Entscheidungen) | ✅ als Entscheidungen übernommen (docs/04, Entscheidungsprotokoll); Code-Markierung `ENTSCHEIDUNG(E-xx)` |
| Produktion PostgreSQL | ✅ PostgreSQL-Adapter (`DATABASE_URL`), gemeinsame Testsuite läuft gegen SQLite **und** PostgreSQL (ADR-003) |
| Echte Authentifizierung | ✅ OpenID Connect: Bearer-JWT in der API, PKCE-Anmeldung in der UI, Berechtigungen aus IdP-Gruppen (ADR-011) |
| In-Process-Jobqueue | ✅ persistente Jobqueue in der Datenbank mit Wiederholung, Lease und Neustart-Sicherheit (ADR-008) |
| E-06 Vorschlag führendes Kapitel | ✅ UI schlägt das Kapitel mit den meisten Cluster-Mitgliedern vor |

Weiterhin offen nach Etappe 2: Freigabeworkflow, eigene Terminologiemaske, HTML/PDF-Export (→ Etappe 3), S3-kompatibler Object-Store (→ Etappe 4).

## 1.5 Stand nach Etappe 3 (24.09.2026)

| P1-Story | Ergebnis |
|---|---|
| US-011 Evidenz- und Quellenansicht | ✅ `GET /chapter-versions/{id}/evidence`, Seite „Evidenz“: Quellen je Absatz, Revision, Bestätigung, Auffälligkeiten (fehlend, nur begründet, veraltet, unbestätigt, ausgeschlossen) |
| US-013 Optimierungsdashboard | ✅ `GET /optimizations`: Kennzahlen je Kapitel, Nachweisquote, priorisierte Empfehlungen mit Sprung ins passende Modul |
| US-014 Gefilterter Export | ✅ zusätzlich HTML (eigenständig, ohne Skripte) und PDF (ADR-012) |
| US-015 Terminologieverwaltung | ✅ Tabelle `terminology_terms`, Seite „Terminologie“, Konsistenzprüfung, Ausmustern mit Audit; Analyse nutzt aktive Begriffe |
| US-016 Freigabeworkflow | ✅ Entwurf → eingereicht → freigegeben/abgelehnt, Zurückziehen, Sperre während der Prüfung (einstufig gemäß E-12) |

Offen (Etappe 4): US-019 Vergleich ganzer Kapitelversionen, S3-kompatibler Object-Store, optionale LLM-Umformulierung.

## 1.6 Stand nach Etappe 4 (24.09.2026)

| Punkt | Ergebnis |
|---|---|
| US-019 Versionsvergleich | ✅ Vergleich ganzer Kapitelversionen über die Lineage der Absätze; Seite „Versionsvergleich“ |
| Mehrinstanzbetrieb | ✅ S3-kompatibler Object-Store; zusammen mit PostgreSQL und der verteilten Jobqueue horizontal skalierbar |
| Lineage-Stabilität | ✅ behoben (Lückenhinweise und Blöcke mit gleichen Quellen verloren bei Neugenerierung ihre Lineage) |

Damit sind alle User Stories US-001 … US-020 umgesetzt. Offen ist nur die optionale LLM-Umformulierung (E-16).

## 1.7 Stand nach Etappe 5 (24.09.2026)

| Punkt | Ergebnis |
|---|---|
| E-16 KI-Umformulierung | ✅ entschieden (Cloud erlaubt, Anthropic + OpenAI-kompatibel, Evidenz je Satz + Übernahme durch die Redaktion) und umgesetzt ([ADR-013](adr/ADR-013-ki-umformulierung.md)) |
| Nichts erfinden (US-008) | ✅ automatische Satzprüfung: Quellen, unbekannte Quellen, neue Zahlen, Wortabdeckung, Datenschutz; ungültige Vorschläge sind nicht übernehmbar |
| Nachvollziehbarkeit (US-009, §9) | ✅ Modus `ai_rewritten`, Satz-Evidenz am Absatz, Blockversion `rewritten`, Audit mit Anbieter/Modell/Prompt-Hash/übertragenen Textabschnitten |
| Qualitätsgate (US-012) | ✅ neue Prüfung `sentence_evidence` |
| Datenschutz (§13) | ✅ keine Übertragung bei offenen Datenschutzbefunden oder neuen personenbezogenen Daten; Rückfrage vor Übertragung an externe Dienste |

Offene Punkte aus dem Auftrag bestehen nicht mehr.

## 1.8 Stand nach Etappe 6 (24.09.2026)

Umfang vom Auftraggeber am 24.09.2026 festgelegt: Betrieb & Härtung, KI-Umformulierung ganzer Kapitel, Barrierefreiheit & UX, Mandanten/Projekte.

| Punkt | Ergebnis |
|---|---|
| Mandanten/Projekte (NFR-01) | ✅ mehrere Projekte, Mitgliedschaften, Mandantentrennung in Pfaden, Nutzdaten, Listen, Audit und Jobs ([ADR-014](adr/ADR-014-mandanten.md)) |
| Betrieb (NFR-02) | ✅ Liveness/Readiness, Request-ID, Metriken, Rate-Limiting, Backup/Restore (auch SQLite → PostgreSQL), Lasttest, Abhängigkeitsprüfung ([ADR-015](adr/ADR-015-betrieb.md)) |
| KI ganzer Kapitel (US-008/US-009) | ✅ Hintergrundjob mit Fortschritt, Abbruch und Fortsetzen; Sammelprüfung und Sammelübernahme; Nutzung/Kosten |
| Barrierefreiheit (NFR-03, §15) | ✅ WCAG 2.2 AA automatisch geprüft (hell/dunkel), Tastatur und Fokus, schmale Bildschirme ([ADR-016](adr/ADR-016-barrierefreiheit.md)) |

## 1.9 Stand nach Etappe 7 (24.09.2026)

Umfang vom Auftraggeber am 24.09.2026 festgelegt: semantische Suche, Veröffentlichung & Versionierung, Kollaboration, Mehrsprachigkeit.

| Punkt | Ergebnis |
|---|---|
| Semantische Suche (NFR-04) | ✅ Embeddings lokal oder über einen OpenAI-kompatiblen Dienst, Suche und optionale hybride Analyse ([ADR-017](adr/ADR-017-semantische-suche.md)) |
| Veröffentlichung (NFR-05) | ✅ Handbuch-Releases mit Änderungsliste und statischer Online-Hilfe ([ADR-018](adr/ADR-018-releases.md)) |
| Kollaboration (NFR-06) | ✅ Diskussionen, @Erwähnungen, Aufgaben, Benachrichtigungen In-App/Webhook/E-Mail ([ADR-019](adr/ADR-019-kollaboration.md)) |
| Mehrsprachigkeit (NFR-07) | ✅ Übersetzung freigegebener Kapitel mit Satz-Zuordnung, Prüfung und Freigabe je Sprache ([ADR-020](adr/ADR-020-mehrsprachigkeit.md)) |

## 1.10 Stand nach Etappe 8 (24.09.2026)

Umfang vom Auftraggeber am 24.09.2026 festgelegt: mehrsprachige Releases, Import aus Fremdsystemen, Analytik & Berichte, Skalierung.

| Punkt | Ergebnis |
|---|---|
| Mehrsprachige Releases (NFR-08) | ✅ Online-Hilfe und Markdown je Sprache, Sprachumschalter, Rückfall auf Deutsch, Übersetzungsstand im Dashboard ([ADR-021](adr/ADR-021-mehrsprachige-releases.md)) |
| Fremdsysteme (NFR-09) | ✅ Confluence-/HTML-Export und Word in Markdown umgewandelt, Original erhalten; Git-Repositories mit periodischem Abgleich ([ADR-022](adr/ADR-022-fremdsysteme.md)) |
| Analytik (NFR-10) | ✅ Kennzahlen-Zeitreihen, Freigabedauer, Projektbericht (PDF), BI-Export CSV/JSON ([ADR-023](adr/ADR-023-analytik.md)) |
| Skalierung (NFR-11) | ✅ Vektorindex exakt/HNSW/pgvector, kNN für die hybride Analyse großer Bestände, Lasttest mit 50 000 Textabschnitten ([ADR-024](adr/ADR-024-vektorindex.md), [Lasttest](lasttest-semantik.md)) |

## 1.11 Stand nach Etappe 9 (24.09.2026)

Umfang vom Auftraggeber am 24.09.2026 festgelegt: Handbuch-Assistent, mehrstufige Freigabe, Betrieb & Performance.

| Punkt | Ergebnis |
|---|---|
| Mehrstufige Freigabe (NFR-12) | ✅ Stufen, Zuständige, Mindestanzahl, Frist/Eskalation, Vier-Augen-Prinzip ([ADR-025](adr/ADR-025-mehrstufige-freigabe.md)) |
| Handbuch-Assistent (NFR-13) | ✅ Antworten nur aus freigegebenen Absätzen mit Quellen je Satz, Wissenslücken ([ADR-026](adr/ADR-026-assistent.md)) |
| Betrieb & Performance (NFR-14) | ✅ Import PostgreSQL 3,9×, Helm-Chart, OpenTelemetry, verteilte Rate-Limits, gesperrte Migrationen ([ADR-027](adr/ADR-027-betrieb-skalierung.md)) |

## 1.12 Stand nach Etappe 10 (24.09.2026)

Umfang vom Auftraggeber am 24.09.2026 festgelegt: Integrationen & API, Bilder & Medien, Kontexthilfe für oneSCM, Release-Pipeline.

| Punkt | Ergebnis |
|---|---|
| Integrationen & API (NFR-15) | ✅ API-Tokens je Projekt mit Scopes, signierte Webhooks mit Wiederholung, Push-Webhooks für Git, Confluence-Cloud-Anbindung ([ADR-028](adr/ADR-028-integrationen.md)) |
| Bilder & Medien (NFR-16) | ✅ Bilder aus ZIP/Word/HTML/Git/Confluence, inhaltsadressiert versioniert, in Werkstatt, Export, PDF und Online-Hilfe; Alternativtext als Gate-Pflicht ([ADR-029](adr/ADR-029-bilder-medien.md)) |
| Kontexthilfe (NFR-17) | ✅ Kontext-IDs, API, Deep-Links, einbettbares Widget mit Assistent auf Basis des neuesten Releases ([ADR-030](adr/ADR-030-kontexthilfe.md)) |
| Release-Pipeline (NFR-18) | ✅ Multi-Arch-Image in GHCR, SBOM, Provenienz, cosign keyless, Helm-Chart als OCI-Artefakt, Release-Notes aus dem CHANGELOG ([ADR-031](adr/ADR-031-release-pipeline.md)) |

## 1.13 Stand nach Etappe 11 (24.09.2026)

Umfang vom Auftraggeber am 24.09.2026 festgelegt: einklappbare Navigation mit Stammdaten (Inhaltsverzeichnis, Abkürzungen, Glossar, Bildverzeichnis, FAQ, Planung), Draft Manual mit Zuordnung und Kennzeichnung. Entscheidungen: Märkte konfigurierbar, Redaktionsplanung, Gliederungen als zusätzliche Sicht, FAQ gepflegt mit Vorschlägen.

| Punkt | Ergebnis |
|---|---|
| Stammdaten (NFR-19) | ✅ Gliederungen je Variante mit Versionen, Upload/Export; Abkürzungen, Glossar, Bildverzeichnis, FAQ, Planung ([ADR-032](adr/ADR-032-stammdaten-gliederungen.md)) |
| Draft Manual (NFR-20) | ✅ Zuordnung automatisch/manuell, Kennzeichnung Dopplung/Lücke/Widerspruch/Warnung, Export ([ADR-033](adr/ADR-033-draft-manual.md)) |

## 1.39 Stand nach Etappe 37 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Fragen über alle Quellen mit hybrider Suche, Filtern und Belegen je Satz (M5, NFR-87) | ✅ ([ADR-089](adr/ADR-089-fragen-alle-quellen.md)) |
| Speichern mit Rahmen, erneut fragen mit Vergleich, Export CSV/Excel/JSON (NFR-88) | ✅ ([ADR-089](adr/ADR-089-fragen-alle-quellen.md)) |
| Rückfragen: Fragenkatalog einlesen und mit Belegen beantworten (NFR-89) | ✅ ([ADR-089](adr/ADR-089-fragen-alle-quellen.md)) |
| Offen | Etappen M6 (Video, OCR) und M7 (Antwortqualität) |

## 1.40 Stand nach Etappe 38 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Untertitel und Video mit Zeitmarke je Absatz, Text aus Untertiteln oder lokaler Transkription (M6, NFR-90) | ✅ ([ADR-090](adr/ADR-090-video-untertitel-ocr.md)) |
| Standbilder bei Änderung mit rotem Rahmen (F-26) und Texterkennung gescannter PDF-Seiten, nur lokale Werkzeuge (NFR-91) | ✅ ([ADR-090](adr/ADR-090-video-untertitel-ocr.md)) |
| Offen | Etappe M7 (Antwortqualität); lokale Werkzeuge (whisper.cpp, Tesseract, ffmpeg) im Betrieb einrichten |

## 1.41 Stand nach Etappe 39 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Testfragensätze mit erwarteten Quellen, Stichworten und Lückenfragen (M7, NFR-92) | ✅ ([ADR-091](adr/ADR-091-antwortqualitaet.md)) |
| Prüfläufe mit Trefferquote, MRR, Beleg, Lücken richtig, Vergleich und Export (NFR-93) | ✅ ([ADR-091](adr/ADR-091-antwortqualitaet.md)) |
| Offen | Plan M1–M7 abgeschlossen; Testfragen aus Wissens-Check und Lückenanalyse (D-08) einlesen und erste Prüfläufe mit echten Quellen; lokale Werkzeuge im Betrieb einrichten |

## 1.42 Stand nach Etappe 40 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Punktmodell Muss/Soll im Anleitungs-Check, „alle Muss-Punkte“ als Freigabebedingung (F-08, NFR-94) | ✅ ([ADR-092](adr/ADR-092-punktmodell-befragung-deckung.md)) |
| Expertenbefragung zu Wissenslücken mit Excel hin und zurück, Übernahme mit Label „Prüfen“ (F-16, NFR-95) | ✅ ([ADR-092](adr/ADR-092-punktmodell-befragung-deckung.md)) |
| Deckungsmatrix der Bilder Stelle × Sprache/Rolle/Sparte (F-30, NFR-96) | ✅ ([ADR-092](adr/ADR-092-punktmodell-befragung-deckung.md)) |
| Offen | optional F-10, F-11, F-22, F-24; später F-19, F-31; fastify-Hinweis „low“ (Update braucht Anpassung der Abhängigkeiten) |

## 1.75 Stand nach Etappe 73 (25.10.2026)

| Punkt | Ergebnis |
|---|---|
| axe (WCAG 2.2 AA) über alle 77 Seiten (NFR-03); Prüfkriterium der Freigabe ohne Code | ✅ T-392 |
| Offen | S-04-Begriffe: Funktion vorhanden (Etappe 44); die Schreibweise je Begriff trägt die Redaktion in ihrer Instanz ein |

## 1.74 Stand nach Etappe 72 (25.10.2026)

| Punkt | Ergebnis |
|---|---|
| Status auf Deutsch an fünf Stellen; automatische Seitenprüfung über alle 77 Seiten (NFR-158) | ✅ T-391 |
| Offen | S-04-Begriffe: Funktion vorhanden (Etappe 44); die Schreibweise je Begriff trägt die Redaktion in ihrer Instanz ein |

## 1.73 Stand nach Etappe 71 (25.10.2026)

| Punkt | Ergebnis |
|---|---|
| Feinschliff nach Sichtprüfung: Quick Reference Guide zweispaltig am Bildschirm, Kennzahlen bündig, Signalwort als Boxbeschriftung, Schweregrade auf Deutsch | ✅ T-389, T-390 (axe) |
| Offen | S-04-Begriffe: Funktion vorhanden (Etappe 44); die Schreibweise je Begriff trägt die Redaktion in ihrer Instanz ein |

## 1.72 Stand nach Etappe 70 (25.10.2026)

| Punkt | Ergebnis |
|---|---|
| Rollen, Sparten und Label-Gruppen mit Lucide-Icons statt Emoji; Exporte und Kapiteltext ohne Zeichen (NFR-157) | ✅ ([ADR-122](adr/ADR-122-icons-rollen-sparten.md)), T-387, T-388 (axe) |
| U-07 weitere Sprachen | am 25.10.2026 vorerst zurückgestellt |
| Offen | S-04-Begriffe (Redaktion) |

## 1.71 Stand nach Etappe 69 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Prüfbericht Barrierefreiheit für den HTML-Export; Standard-HTML mit Hauptbereich (NFR-156) | ✅ ([ADR-121](adr/ADR-121-barrierefreiheit-html.md)), T-384, T-385, T-386 (axe) |
| Offen | S-04-Begriffe (Redaktion); U-07 |

## 1.70 Stand nach Etappe 68 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Prüfbericht Barrierefreiheit für Word und PowerPoint; Icons dekorativ, Sprache, Folientitel als Platzhalter (NFR-155) | ✅ ([ADR-120](adr/ADR-120-barrierefreiheit-word-powerpoint.md)), T-381, T-382, T-383 (axe) |
| Offen | S-04-Begriffe (Redaktion); U-07 |

## 1.69 Stand nach Etappe 67 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Kontexthilfe im Lesestil Handbuch-Kapitel; Hinweisboxen mit Icon und Beschriftung; Rückmeldung mit Icons statt Emoji (NFR-154) | ✅ ([ADR-119](adr/ADR-119-kontexthilfe-lesestil.md)), T-379, T-380 (axe) |
| Offen | S-04-Begriffe (Redaktion); U-07 |

## 1.68 Stand nach Etappe 66 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Barrierefreies PDF im Design (Tags, Lesezeichen) mit Prüfbericht nach jedem PDF-Export (NFR-153) | ✅ ([ADR-118](adr/ADR-118-barrierefreies-pdf.md)), T-376–T-378, mit Chromium 141 alle neun Prüfungen bestanden |
| Offen | vollständige PDF/UA-Prüfung (PAC/veraPDF) außerhalb der App; Standard-PDF ungetaggt; S-04-Begriffe; U-07 |

## 1.67 Stand nach Etappe 65 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Lesestil „Handbuch-Kapitel“ für Leseransicht, Druck und Online-Hilfe (NFR-152) | ✅ ([ADR-117](adr/ADR-117-lesestil-handbuch-kapitel.md)), T-374, T-375 |
| Offen | S-04-Begriffe (Redaktion); U-07 |

## 1.66 Stand nach Etappe 64 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Designvorlagen als PowerPoint mit Titelfolie, Karten/Abschnittsfolien, Tabellen, Boxen, Fortsetzung und Nummerierung mit Startwert (NFR-151) | ✅ ([ADR-116](adr/ADR-116-designvorlagen-powerpoint.md)), T-371–T-373, mit LibreOffice und eigenem Import geprüft |
| Offen | S-04-Begriffe (Redaktion); U-07 |

## 1.65 Stand nach Etappe 63 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Designvorlagen als Word: gleiche Inhalte, Anpassung, Formatvorlagen, Icons, Kopf-/Fußzeilen mit Feldern; Nummerierung je Liste auch im Standard-Word (NFR-150) | ✅ ([ADR-115](adr/ADR-115-designvorlagen-word.md)), T-368–T-370, mit LibreOffice geprüft |
| Offen | S-04-Begriffe (Redaktion); U-07 |

## 1.64 Stand nach Etappe 62 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Designvorlagen anpassen: Farben mit Kontrastprüfung, Schriften, Logo-Position, Vorschau, speichern und zurücksetzen (NFR-149) | ✅ ([ADR-114](adr/ADR-114-designvorlagen-anpassen.md)), T-365–T-367 |
| Offen | S-04-Begriffe (Redaktion); U-07 |

## 1.63 Stand nach Etappe 61 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| PDF im Design: Quick Reference Guide und Handbuch-Kapitel direkt als PDF über einen lokalen Browser, ohne Netz; Muster als PDF (NFR-148) | ✅ ([ADR-113](adr/ADR-113-pdf-im-design.md)), T-362–T-364, mit Chromium 141 geprüft |
| Offen | S-04-Begriffe (Redaktion); U-07 |

## 1.62 Stand nach Etappe 60 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Designvorlagen Quick Reference Guide (A4 quer) und Handbuch-Kapitel (A4 hoch) nach den gelieferten Mustern, mit Lucide-Icons, ohne Marke Dritter, Muster mit fiktiven Inhalten (NFR-147) | ✅ ([ADR-112](adr/ADR-112-designvorlagen.md)), T-359–T-361, axe ohne Befund auch für die Muster |
| Offen | PDF direkt im Design (bis dahin: HTML im Browser als PDF speichern); S-04-Begriffe (Redaktion); U-07 |

## 1.61 Stand nach Etappe 59 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Restliche Emoji der Oberfläche als Lucide-Icons: Quellformate, Blocker/Warnungen, Hinweisarten, Screenshot-Editor, Leseransicht in neun Sprachen (NFR-146) | ✅ ([ADR-111](adr/ADR-111-icons-lucide.md)), E2E T-358 |
| Offen | Rollen- und Spartenzeichen der Stammdaten (Daten, bewusst unverändert); S-04-Begriffe (Redaktion); U-07 |

## 1.60 Stand nach Etappe 58 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Oberfläche mit einheitlichen SVG-Icons (Lucide) statt Emoji: Navigation, Kopf, Startseite, Hauptschaltflächen (NFR-146) | ✅ ([ADR-111](adr/ADR-111-icons-lucide.md)), axe hell und dunkel ohne Befund |
| Offen | Emoji in Inhalten, Befunden und Schaltflächen seltener Seiten (später); Systemnamen, „Grace Period“ u. a. (S-04, Redaktion); U-07 |

## 1.59 Stand nach Etappe 57 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| „MO-Prüfungen“ im Fließtext, „MO Checks“ als UI-Begriff in Menüpfaden und Anführungszeichen (S-04, NFR-145; Entscheidung 24.10.2026) | ✅ ([ADR-110](adr/ADR-110-ui-begriffe-mo-pruefungen.md)) |
| SYNONYME.csv in die Terminologie übernehmen, nur entschiedene Begriffe (NFR-145) | ✅ |
| Offen | Schreibweise der Systemnamen (später nach Oberfläche); „Grace Period“, FI-Beleg, Belegart, „Chassis Number“ (Redaktion); U-07 weitere Sprachen (ohne Auswahl) |

## 1.58 Stand nach Etappe 56 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Zuschaltbare Regelsätze: Regelbasiertes Schreiben (Deutsch), Simplified Technical English (Englisch, ohne Wörterbuch), Regeln einzeln abschaltbar (S-06, NFR-142) | ✅ ([ADR-109](adr/ADR-109-regelsaetze-benachrichtigung.md)) |
| Vale-Stile einlesen (YAML oder ZIP; existence, substitution, occurrence), Prüfung lokal (S-06, NFR-143) | ✅ |
| Benachrichtigung zum Länderreview an Prüferin/Prüfer und Vertretung, Ergebnis an die anfordernde Person (NFR-144) | ✅ – schließt den offenen Punkt aus Etappe 55 |
| Offen | U-07 weitere Sprachen und Märkte (ohne Auswahl am 24.10.2026); Schreibweise offener Begriffe (S-04, entscheidet die Redaktion) |

## 1.57 Stand nach Etappe 55 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Lokale Grammatikprüfung mit LanguageTool als Java-Dienst (G-04, NFR-140; Entscheidung 24.10.2026) | ✅ ([ADR-108](adr/ADR-108-languagetool-ansprechperson-markt.md)), mit echtem LanguageTool 6.6 geprüft |
| Ansprechperson je Land/Markt mit Vertretung im Länderreview (O-09, NFR-141; Entscheidung 24.10.2026) | ✅ |
| Offen | U-07 weitere Sprachen und Märkte (ohne Auswahl am 24.10.2026); Schreibweise offener Begriffe (S-04, entscheidet die Redaktion); Benachrichtigung der Ansprechperson |

## 1.56 Stand nach Etappe 54 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Textbausteine mit Fassungen, Verwendung, Aktualisieren in Entwürfen, Kandidaten aus wiederkehrenden Absätzen (W-11, NFR-138) | ✅ ([ADR-107](adr/ADR-107-textbausteine-uebersicht.md)) |
| Übersicht oneSCM_Metadaten mit Zwischenspeicher (NFR-139, Lasttest Etappe 49) | ✅ |
| Offen – Entscheidung des Auftraggebers | G-04 LanguageTool lokal; weitere Märkte und Sprachen (U-07); Schreibweise offener Begriffe (S-04); O-09 |

## 1.55 Stand nach Etappe 53 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Vorher/Nachher-Belege mit Schieberegler, Anlass/Änderung/Wirkung, Gegenüberstellung im Archiv (W-05, NFR-135) | ✅ ([ADR-106](adr/ADR-106-vorher-nachher-pptx-zwischenbilder.md)) |
| Ausgabe als PowerPoint, Klickstrecke als BPMN 2.0 mit Diagramm (W-07, NFR-136) | ✅ |
| Zwischenbilder kurzer Zustände aus Videos (W-10, NFR-137) | ✅ |
| Offen | G-04 LanguageTool lokal; weitere Märkte und Sprachen (U-07); Schreibweise offener Begriffe (S-04); O-09; W-11 Textbausteine (später); schnellere Übersicht oneSCM_Metadaten (Lasttest Etappe 49) |

## 1.54 Stand nach Etappe 52 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Textvarianten je Kapitel: Endanwender, Fachtext, Kurzfassung (~¼), Exportprofil „Kurzfassung“ (S-05, NFR-133) | ✅ ([ADR-105](adr/ADR-105-textvarianten-pruefprofile.md)) |
| Vier Prüferprofile fachlich, Redaktion, Compliance, Endanwender mit Wert, Ampel, Funden und optional lokalem KI-Dienst (W-12, NFR-134) | ✅ |
| Offen | G-04 LanguageTool lokal; weitere Märkte und Sprachen (U-07); Schreibweise offener Begriffe (S-04); O-09; optional W-05, W-07, W-10; schnellere Übersicht oneSCM_Metadaten (Lasttest Etappe 49) |

## 1.53 Stand nach Etappe 51 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Word-Prüffassung mit „Fertig, wenn …“ exportieren und zurücklesen, Abweichungen als Vorschläge (W-06, NFR-130) | ✅ ([ADR-104](adr/ADR-104-aenderungsvorschlaege-word-lektorat.md)) |
| KI-Lektorat je Kapitel mit Wortvergleich, Übernahme je Vorschlag oder je Kapitel (G-07, NFR-131) | ✅ |
| Interne Kommentare nie im Export, Drei-Spalten-Ansicht Stand – Vorschlag – Neu (W-08, NFR-132) | ✅ |
| Offen | G-04 LanguageTool lokal; weitere Märkte und Sprachen (U-07); Schreibweise offener Begriffe (S-04); O-09; schnellere Übersicht oneSCM_Metadaten (Lasttest Etappe 49) |

## 1.52 Stand nach Etappe 50 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Plausibilität Text ↔ Quellen je Aussage mit Wert 0–100 (W-02, NFR-127) | ✅ ([ADR-103](adr/ADR-103-kapitelbewertung-fehlerliste.md)) |
| Kapitelbewertung mit fünf Kriterien und Ampel, Übersicht (S-07, NFR-128) | ✅ |
| Fehlerliste in der App mit Abgleich FEHLERLISTE.csv (G-05, NFR-129) | ✅ |
| Offen | G-04 LanguageTool lokal; weitere Märkte und Sprachen (U-07); Schreibweise offener Begriffe (S-04); O-09; schnellere Übersicht oneSCM_Metadaten (Lasttest Etappe 49) |

## 1.51 Stand nach Etappe 49 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Tonalität je Produktart und Rolle, Prüfregel „Tonalität“, Ton in den KI-Vorschlägen (S-02, NFR-123) | ✅ ([ADR-102](adr/ADR-102-tonalitaet-tickets-releasevergleich.md)) |
| Ticket-Einstufung genehmigt / in Prüfung / intern / Background, ohne interne Tickets in Kapiteln (W-03, NFR-124) | ✅ |
| Releaseletter-Entwurf aus dem Projektvergleich zweier Handbuch-Releases (W-04, NFR-125) | ✅ |
| Zukunfts-Inhalte in Export und Release ausgeblendet (W-09, NFR-126) | ✅ |
| Offen | G-04 LanguageTool lokal; weitere Märkte und Sprachen (U-07); Zukunfts-Inhalte je Unterkapitel; Schreibweise offener Begriffe (S-04) |

## 1.50 Stand nach Etappe 48 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Übersetzungsspeicher mit 100 % und ähnlichen Treffern, SPEICHER.csv hin und zurück (U-01, NFR-118) | ✅ ([ADR-101](adr/ADR-101-uebersetzung.md)) |
| Weitere Prüfungen, Glossar je Sprache, XLIFF 1.2 und Excel (U-02, U-04, U-05, NFR-119) | ✅ |
| Länderreview mit MQM, Rückübersetzung der Sicherheitshinweise (U-03, U-06, NFR-120) | ✅ |
| de-CH und fr-CH, Rahmentexte je Sprache, Hinweis auf Bildvarianten (U-07, U-08, U-10, NFR-121) | ✅ |
| Releaseletter DE↔EN (U-09, NFR-122) | ✅ |
| Offen | weitere Märkte und Sprachen (U-07); Pflicht-Länderreview je Sprache; Ansprechperson je Land (O-09); Satzsegmentierung (SRX) für den Speicher; G-04 LanguageTool |

## 1.49 Stand nach Etappe 47 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| TRIAGE nach dem Einlesen: Pflichtlabels je Chunk mit Sicherheit, Mensch geht vor, Labels löschen (NFR-114) | ✅ ([ADR-100](adr/ADR-100-triage-agenten.md)) |
| Kapitel- und Unterkapitelvorschläge für gemischte Quellen, neue Unterkapitel „neu“ (NFR-115) | ✅ |
| Detaillevel steuern das Kapitel (HappyPath, Edge), Detaillierung je Kapitel, Inhalts-Dashboard (NFR-116) | ✅ |
| Agenten in der App: ORCHESTRATOR, Aufgaben, Entscheidungen, GOAL; Ordner `12_Goal`, `00_Dokumentation/Agenten` (NFR-117) | ✅ |
| Offen | Erkennung weiterer Sprachen; Zuordnung über ein lokales Sprachmodell oder Embeddings (Entscheidung lokaler Dienst); Domänennamen aus echten Quellen ergänzen; Übersetzung U-01 … U-10 |

## 1.48 Stand nach Etappe 46 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Suche v2: Morphologie, Komposita, Kennungen, Abfrageerweiterung, BM25 + Vektor per RRF, MMR (NFR-111) | ✅ ([ADR-099](adr/ADR-099-rag-retrieval-v2.md), Messung [docs/11](11-rag-messung.md)) |
| Relevanzschwelle mit begründeter Enthaltung, Antwortauswahl (NFR-112) | ✅ |
| Prüflauf je Verfahren mit nDCG@6, Messbestand mit Regressionsschutz, lokale KI-/Embedding-Dienste (NFR-113) | ✅ |
| Offen | englische Fragen auf deutsche Quellen ohne Terminologie-Eintrag (lokales mehrsprachiges Modell, nicht gemessen); lokaler neuronaler Reranker; Treueprüfung der KI-Antworten; Übersetzung U-01 … U-10 |

## 1.47 Stand nach Etappe 45 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Pipeline: Jira-Tickets in Bearbeitung je Gliederung mit Erstelldatum, Stream, Produktionsdatum, vorab dokumentiert, Übernahme wenn produktiv (NFR-108) | ✅ ([ADR-098](adr/ADR-098-pipeline-backlog-intern.md)) |
| Backlog und Intern (Testing, Reporting, Systeme, Migration, Rollout, Other), nie im Handbuch (NFR-109) | ✅ |
| Arbeitsordner `09_Pipeline`, `10_Backlog`, `11_Intern`, Grundregel 9, Agent pipeline-redakteur, Abgleich mit der App (NFR-110) | ✅ |
| Offen | Feldnamen für Stream und Produktionsdatum im echten Jira-Export bestätigen; Übersetzung U-01 … U-10 (Etappe 46); G-04 (LanguageTool – Entscheidung) |

## 1.46 Stand nach Etappe 44 (24.10.2026)

| Punkt | Ergebnis |
|---|---|
| Hausregeln, Rechtschreibliste, erlaubte Begriffe (G-01–G-03, NFR-104) | ✅ ([ADR-097](adr/ADR-097-grammatik-sprachstil.md)) |
| Englisch, Sprache je Regel, Prüfung der Übersetzungen, „nicht übersetzen“ (G-06, S-03, S-04, NFR-105) | ✅ |
| Lesbarkeit mit Sollwerten je Zielgruppe, Bildunterschriften (S-01, S-08, NFR-106) | ✅ |
| Kapitelanweisung für Handbuch-Varianten (W-01, NFR-107) | ✅ |
| Offen | G-04 (LanguageTool lokal – Entscheidung), G-05, S-02, Übersetzung U-01 … U-10 (damals für Etappe 45 geplant, jetzt Etappe 46) |

## 1.45 Stand nach Etappe 43 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Kapitelanweisung je Kapitel und Unterkapitel mit Vorrang für Generator, KI, Check, Agenten; Kapitel ergänzen (NFR-101) | ✅ ([ADR-096](adr/ADR-096-kapitelsteuerung-historie.md)) |
| Version „gültig ab“ an Kapiteln, Unterkapiteln, Labels im Output (NFR-102) | ✅ |
| Abgelöste Funktionen in der Historie, Anhang „Historie“, zurückholbar (NFR-103) | ✅ |
| Offen | Anweisung für Handbuch-Varianten nur über die Quellkapitel; optional F-10, F-11; später F-19, F-31 |

## 1.44 Stand nach Etappe 42 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Namen, User-ID, Adresse, FIN in Bildern erkennen und verpixeln; an/aus, je Stelle, manuelle Stellen; Original bleibt (NFR-99) | ✅ ([ADR-095](adr/ADR-095-datenschutz-bild-labels.md)) |
| Mehrere Labels (Domäne, Rolle, Gliederung …) und Kapitel je Bild, Filter, Deckungsmatrix je Gliederungspunkt (NFR-100) | ✅ ([ADR-095](adr/ADR-095-datenschutz-bild-labels.md)) |
| Offen | Gesichter/Unterschriften nur manuell; optional F-10, F-11; später F-19, F-31; fastify-Hinweis „low“ |

## 1.43 Stand nach Etappe 41 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Varianten einer Maske mit passender Fassung in Export, Release und Übersetzung (F-22, NFR-97) | ✅ ([ADR-093](adr/ADR-093-varianten-klickstrecke.md)) |
| Klickstrecke aus Screenshots mit parallelen Wegen 3a/3b, neue Fassung bei Änderung (F-24, NFR-98) | ✅ ([ADR-093](adr/ADR-093-varianten-klickstrecke.md)) |
| Offen | optional F-10, F-11; später F-19, F-31; fastify-Hinweis „low“ |

## 1.38 Stand nach Etappe 36 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Dubletten je Abschnitt über alle Formate, exakt und ab 85 %, Gruppen (M4, NFR-85) | ✅ ([ADR-088](adr/ADR-088-dubletten-formatuebergreifend.md)) |
| Nach jedem Import nur geänderte Dateien; Entscheidung führende Fassung / kein Duplikat mit Unterschieden (NFR-86) | ✅ ([ADR-088](adr/ADR-088-dubletten-formatuebergreifend.md)) |
| Offen | Etappen M5 (Fragen über alle Quellen mit Teilstücken), M6 (Video, OCR), M7 (Antwortqualität) |

## 1.37 Stand nach Etappe 35 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Teilstücke langer Chunks 300–800 Zeichen mit 1 Satz Überlappung, ohne E-02 zu ändern (M3, NFR-83) | ✅ ([ADR-087](adr/ADR-087-teilstuecke-ueberschriften.md)) |
| Quellen je Überschrift (je Datei, zusammengeführt), Filter „Überschrift“ (M3, NFR-84) | ✅ ([ADR-087](adr/ADR-087-teilstuecke-ueberschriften.md)) |
| Offen | Etappen M4 (formatübergreifende Dopplungen), M5 (Fragen über alle Quellen mit Teilstücken), M6 (Video, OCR), M7 (Antwortqualität) |

## 1.36 Stand nach Etappe 34 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| PowerPoint und PDF einlesen, Fundstelle je Folie, Seite bzw. Abschnitt, Seite „Einlesen“ (M2, NFR-81) | ✅ ([ADR-086](adr/ADR-086-pptx-pdf-fundstellen.md)) |
| Bild → Gliederungsstelle über den Folientext (F-25, NFR-82) | ✅ ([ADR-086](adr/ADR-086-pptx-pdf-fundstellen.md)) |
| Offen | Feinabstimmung mit echten PPTX-/PDF-Beispieldateien; F-22, F-24, F-30 (optional); Etappen M3 (Rest) bis M7, F-26 mit M6 |

## 1.35 Stand nach Etappe 33 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Bildarchiv: Bildnummer, Merkmale, Prüfregeln, Bildabdeckung, Versionen, Platzhalter, Zwischenablage (F-20, F-21, F-23, NFR-79) | ✅ ([ADR-085](adr/ADR-085-bilder-ausgabe.md)) |
| Quick Guide, One Pager, Lesefassung, Wasserzeichen, Übergänge „Weiter mit …“ (F-27, F-28, F-29, NFR-80) | ✅ ([ADR-085](adr/ADR-085-bilder-ausgabe.md)) |
| Offen | F-22, F-24, F-30 (optional), F-25 mit M2, F-26 mit M6; Etappen M2 (PPTX/PDF, Beispieldateien nötig) bis M7 |

## 1.34 Stand nach Etappe 32 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Gliederungs-Vorschlag je Chunk, Kapitel ↔ Quellen, Zielkapitel je Dopplung (F-13, F-14, F-18, NFR-77) | ✅ ([ADR-084](adr/ADR-084-gliederung-wissen.md)) |
| Wissensnotizen, Ausschlussliste (F-15, F-17, NFR-78) | ✅ ([ADR-084](adr/ADR-084-gliederung-wissen.md)) |
| Offen | Bilder und Ausgabe (F-20 … F-30), Etappen M2 (PPTX/PDF, Beispieldateien nötig) bis M7 |

## 1.33 Stand nach Etappe 31 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Release-Abgleich (F-03) | ✅ Tickets je Release, Bug = intern, Kapitelbezug, Änderungen, Ticketliste ([ADR-083](adr/ADR-083-releaseletter-lektorat.md)) |
| Releaseletter (F-02, NFR-75) | ✅ aus Tickets mit Guardrails, Prüfregeln und Urteil, auch für eingefügte Letter ([ADR-083](adr/ADR-083-releaseletter-lektorat.md)) |
| Warnhinweis-Schema, Übersetzungsprüfung, feste Übersetzungen (F-07, F-09, F-12, NFR-76) | ✅ ([ADR-083](adr/ADR-083-releaseletter-lektorat.md)) |
| Offen | KI-Formulierung des Letters mit lokalem Modell (optional); weitere Funktionen aus docs/07 (F-13 ff.); Etappen M2–M7 |

## 1.32 Stand nach Etappe 30 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Menüpunkte Contract Management 3.1–3.5 | ✅ eigene Navigations-Labels, Zugriffsmatrix vollständig ([ADR-082](adr/ADR-082-zuordnung-domaene-ordner.md)) |
| Zuordnung Domäne → Gliederung → Ordner (NFR-74) | ✅ Seite „Zuordnung“ mit Kapitel- und Unterordnern, Vorschlägen aus Chunks, CSV ([ADR-082](adr/ADR-082-zuordnung-domaene-ordner.md)) |
| Steuerungsordner im Arbeitsordner | ✅ 05_I_Output, 06_II_Stil_und_Design, 07_III_Grammatik_Synonyme_Fehlerliste, 08_IV_Translation mit Agenten |
| Offen | englische UI-Begriffe für 3.1–3.5 bestätigen; Domänenzuordnung fachlich prüfen; F-02, F-03, M2–M7 |

## 1.31 Stand nach Etappe 29 (23.10.2026)

| Punkt | Ergebnis |
|---|---|
| Jira-Import als Datei (NFR-71) | ✅ XML/CSV, je Ticket eine Quelle, ohne Personenfelder ([ADR-081](adr/ADR-081-jira-update-zugriff.md)) |
| Update-Eingang (NFR-72) | ✅ geänderte, entfallene, neue Quellabschnitte absatzweise übernehmen ([ADR-081](adr/ADR-081-jira-update-zugriff.md)) |
| Zugriffsmatrix (NFR-73) | ✅ Rolle × Menüpunkt mit Beleg, CSV-Import/-Export ([ADR-081](adr/ADR-081-jira-update-zugriff.md)) |
| Offen | Releaseletter aus Tickets (F-02), Release-Abgleich (F-03), weitere Funktionen aus docs/07, Etappen M2–M7 |

## 1.30 Stand nach Etappe 28 (23.10.2026)

Umfang vom Auftraggeber am 23.10.2026 festgelegt: Empfehlungen der Entscheidungsvorlage ([07](07-bestehende-artefakte.md)) übernommen, Start mit Labelkatalog und Datenschutz.

| Punkt | Ergebnis |
|---|---|
| Labelkatalog nach echtem oneSCM (NFR-69) | ✅ 153 Labels in neun Gruppen, Abgleich bestehender Projekte ([ADR-080](adr/ADR-080-katalog-onescm-datenschutz.md)) |
| Erweiterte Datenschutzprüfung (NFR-70) | ✅ FIN, Kennzeichen, Benutzerkennung, Adresse, Namen, Namensliste, Pseudonymisierung ([ADR-080](adr/ADR-080-katalog-onescm-datenschutz.md)) |
| Offen | übrige Funktionen aus docs/07 (Jira-Import, Releaseletter, Update-Eingang, Zugriffsmatrix …) und Etappen M2–M7 |

## 1.29 Stand nach Etappe 27 (23.10.2026)

Umfang vom Auftraggeber am 23.10.2026 festgelegt: oneSCM_Metadaten nach Plan [06](06-plan-onescm-metadaten.md), Etappe M1; Annahmen M-01 … M-10 übernommen, Daten bleiben lokal, 100 vordefinierte Labels, Deutsch und Englisch.

| Punkt | Ergebnis |
|---|---|
| Vordefinierte Labels (NFR-66) | ✅ 100 Labels in sechs Gruppen (Gliederung, Rollen, Navigation, Inhaltstyp, Sparte, Qualität), Deutsch/Englisch, Pflege durch die Administration ([ADR-079](adr/ADR-079-onescm-metadaten.md)) |
| Chunks je Überschrift labeln (NFR-67) | ✅ Ansicht je Überschrift und Tabelle, Fundstelle, Filter, Einzel- und Sammel-Labeln ([ADR-079](adr/ADR-079-onescm-metadaten.md)) |
| Fragen und Antworten speichern (NFR-68) | ✅ mit Quell-Chunks samt Auszug, Labels, Sprache, Notiz ([ADR-079](adr/ADR-079-onescm-metadaten.md)) |
| Offen für M2 … M7 | PowerPoint, PDF und Video einlesen, Fundstellen je Seite/Folie/Zeitmarke, Dopplungen über alle Formate, automatische Antworten aus allen Quellen, Qualitätsmessung |

## 1.28 Stand nach Etappe 26 (27.09.2026)

Umfang vom Auftraggeber am 27.09.2026 festgelegt: Häufige Fragen übersetzen, weitere Sprachen vollständig.

| Punkt | Ergebnis |
|---|---|
| Häufige Fragen übersetzen (NFR-64) | ✅ Übersetzung je Eintrag und Sprache, KI-Vorschlag, Freigabe, veraltet nach Änderung; Leseransicht, Druck, Online-Hilfe ([ADR-077](adr/ADR-077-faq-uebersetzen.md)) |
| Weitere Sprachen vollständig (NFR-65) | ✅ nl, pl, cs, pt mit Beschriftungen und Abschnittstiteln ([ADR-078](adr/ADR-078-weitere-sprachen.md)) |

## 1.27 Stand nach Etappe 25 (26.09.2026)

Umfang vom Auftraggeber am 26.09.2026 festgelegt: Leseransicht mehrsprachig, Übersetzung anfordern, Notizen direkt im Kapitel.

| Punkt | Ergebnis |
|---|---|
| Leseransicht mehrsprachig (NFR-61) | ✅ Beschriftungen von Leseransicht, Druck und Online-Hilfe in der Lesesprache ([ADR-074](adr/ADR-074-leseransicht-mehrsprachig.md)) |
| Übersetzung anfordern (NFR-62) | ✅ Wunsch aus der Leseransicht, Hinweis an die Redaktion, Übersicht nach Anzahl, Benachrichtigung bei Freigabe ([ADR-075](adr/ADR-075-uebersetzung-anfordern.md)) |
| Notizen direkt im Kapitel (NFR-63) | ✅ Notiz unter dem Kapiteltitel anlegen, ändern, löschen ([ADR-076](adr/ADR-076-notiz-im-kapitel.md)) |

## 1.26 Stand nach Etappe 24 (26.09.2026)

Umfang vom Auftraggeber am 26.09.2026 festgelegt: Sprachen beim Lesen, Siehe auch in Druck & Online-Hilfe, Lesezeichen mit Notizen.

| Punkt | Ergebnis |
|---|---|
| Sprachen beim Lesen (NFR-58) | ✅ Sprachauswahl, übersetzte Kapitel/Titel/Suche/FAQ/Glossar, deutscher Rückfall mit Hinweis ([ADR-071](adr/ADR-071-sprachen-beim-lesen.md)) |
| Siehe auch in Druck & Online-Hilfe (NFR-59) | ✅ Verweise mit Kapitelnummer, FAQ-Anhang, Druck je Sprache, Online-Hilfe mit verwandten Themen und FAQ ([ADR-072](adr/ADR-072-siehe-auch-druck-hilfe.md)) |
| Lesezeichen mit Notizen (NFR-60) | ✅ private Notiz je Lesezeichen, Seite mit Filter und CSV-Export ([ADR-073](adr/ADR-073-lesezeichen-notizen.md)) |

## 1.25 Stand nach Etappe 23 (26.09.2026)

Umfang vom Auftraggeber am 26.09.2026 festgelegt: Verwandte Kapitel & FAQ, Lesezeichen & Verlauf.

| Punkt | Ergebnis |
|---|---|
| Verwandte Kapitel & FAQ (NFR-56) | ✅ „Siehe auch“ manuell und automatisch, pflegbar in der Leseransicht, passende FAQ, FAQ-Seite ([ADR-069](adr/ADR-069-siehe-auch-faq.md)) |
| Lesezeichen & Verlauf (NFR-57) | ✅ Lesezeichen je Person, zuletzt gelesen, „Neu“/„Geändert“ ([ADR-070](adr/ADR-070-lesezeichen-verlauf.md)) |

## 1.24 Stand nach Etappe 22 (26.09.2026)

Umfang vom Auftraggeber am 26.09.2026 festgelegt: Druck je Variante/Rolle, Suche & Glossar im Lesen, Vorlagen duplizieren & teilen.

| Punkt | Ergebnis |
|---|---|
| Druck je Variante/Rolle (NFR-52) | ✅ Auswahl Variante und Rolle, Firmen-Layout, Kopf-/Fußzeile, Glossar-Anhang ([ADR-065](adr/ADR-065-druck-variante-rolle.md)) |
| Suche & Glossar im Lesen (NFR-53) | ✅ Suche mit Ausschnitt und Markierung, Begriffserklärungen per Tooltip ([ADR-066](adr/ADR-066-suche-glossar-lesen.md)) |
| Schnelles Laden (NFR-55) | ✅ Code-Splitting, Brotli/gzip, Caching – Erstaufruf −60 % ([ADR-068](adr/ADR-068-schnelles-laden.md)) |
| Vorlagen duplizieren & teilen (NFR-54) | ✅ Duplizieren (auch mitgelieferte), Export/Import als JSON ([ADR-067](adr/ADR-067-vorlagen-teilen.md)) |

## 1.23 Stand nach Etappe 21 (26.09.2026)

Umfang vom Auftraggeber am 26.09.2026 festgelegt: Vorlagen bearbeiten, Druck mit Deckblatt, wöchentliche Übersicht.

| Punkt | Ergebnis |
|---|---|
| Vorlagen bearbeiten (NFR-49) | ✅ alle Teile im Dialog, eine Zeile je Eintrag ([ADR-062](adr/ADR-062-vorlagen-bearbeiten.md)) |
| Druck mit Deckblatt (NFR-50) | ✅ Deckblatt, nummerierte Kapitel, Kopfzeile, „Seite X von Y“ ([ADR-063](adr/ADR-063-druck-deckblatt.md)) |
| Wöchentliche Übersicht (NFR-51) | ✅ einmal je Woche, nur mit Inhalt, Wochentag, Vorschau, „Jetzt senden“ ([ADR-064](adr/ADR-064-wochenuebersicht.md)) |

## 1.22 Stand nach Etappe 20 (26.09.2026)

Umfang vom Auftraggeber am 26.09.2026 festgelegt: Rückmeldungen auswerten, eigene Kapitelvorlagen, Druck-/PDF-Ansicht, Rückmeldungen in der Online-Hilfe.

| Punkt | Ergebnis |
|---|---|
| Rückmeldungen auswerten (NFR-45) | ✅ Anteil „nicht hilfreich“ je Kapitel, Entwicklung, häufige Begriffe, Aufgabe aus Rückmeldung ([ADR-058](adr/ADR-058-rueckmeldungen-auswerten.md)) |
| Eigene Kapitelvorlagen (NFR-46) | ✅ „Als Vorlage“ in der Werkstatt, Pflege im Assistenten ([ADR-059](adr/ADR-059-eigene-kapitelvorlagen.md)) |
| Druck-/PDF-Ansicht (NFR-47) | ✅ Kapitel oder ganzes Handbuch, Kästchen zum Abhaken ([ADR-060](adr/ADR-060-druckansicht.md)) |
| Rückmeldungen in der Online-Hilfe (NFR-48) | ✅ anonym, nur Veröffentlichtes, Grenze je Adresse, Honigtopf ([ADR-061](adr/ADR-061-online-hilfe-rueckmeldung.md)) |

## 1.21 Stand nach Etappe 19 (26.09.2026)

Umfang vom Auftraggeber am 26.09.2026 festgelegt (weiter mit Schwerpunkt leserfreundliches Handbuch und leichte Bedienung): Leseransicht & Rückmeldungen, Kapitelvorlagen im Assistenten, Einführung beim ersten Start, Anleitungs-Check vor der Freigabe.

| Punkt | Ergebnis |
|---|---|
| Leseransicht & Rückmeldungen (NFR-41) | ✅ Inhaltsverzeichnis, Schritte zum Abhaken, „War das hilfreich?“ mit Aufgabe für die Redaktion ([ADR-054](adr/ADR-054-leseransicht-rueckmeldungen.md)) |
| Kapitelvorlagen (NFR-42) | ✅ sechs Aufgabentypen, Platzhalter-Prüfung ([ADR-055](adr/ADR-055-kapitelvorlagen.md)) |
| Einführung (NFR-43) | ✅ sechs Hinweise, nicht modal, jederzeit neu startbar ([ADR-056](adr/ADR-056-einfuehrung.md)) |
| Check vor der Freigabe (NFR-44) | ✅ Anzeige in der Freigabe, optionaler Mindestwert im Qualitätsgate ([ADR-057](adr/ADR-057-check-vor-freigabe.md)) |

## 1.20 Stand nach Etappe 18 (26.09.2026)

Umfang vom Auftraggeber am 26.09.2026 festgelegt und auf Wunsch neu ausgerichtet: Schwerpunkt auf dem Inhalt eines leserfreundlichen Benutzerhandbuchs und einer leichten Bedienung – Anleitungs-Check, Kapitel-Assistent, einfache Oberfläche; dazu Stilregel-Bibliotheken (Projektvergleich des Stilwerts und CSV-Export des Verlaufs entfallen).

| Punkt | Ergebnis |
|---|---|
| Stilregel-Bibliotheken (NFR-37) | ✅ gemeinsame Formulierungen, Abonnement mit Vorrang, CSV ([ADR-050](adr/ADR-050-stilregel-bibliotheken.md)) |
| Anleitungs-Check (NFR-38) | ✅ zehn Punkte je Kapitel, Wert 0–100, Korrekturen per Klick ([ADR-051](adr/ADR-051-anleitungs-check.md)) |
| Kapitel-Assistent (NFR-39) | ✅ vier Schritte mit Vorschlägen aus den Quellen ([ADR-052](adr/ADR-052-kapitel-assistent.md)) |
| Einfache Oberfläche (NFR-40) | ✅ Startseite „Was möchten Sie tun?“, Menü nach Arbeitsablauf ([ADR-053](adr/ADR-053-einfache-oberflaeche.md)) |

## 1.19 Stand nach Etappe 17 (26.09.2026)

Umfang vom Auftraggeber am 26.09.2026 festgelegt: Rollenvorlagen & Stilregeln-Austausch, Stilwert-Verlauf, Screenshot-Editor: Zuschneiden & Lupe (Passwort-Anmeldung zurückgestellt).

| Punkt | Ergebnis |
|---|---|
| Rollenvorlagen, Stilregeln-Austausch (NFR-34) | ✅ Vorlagen für Benutzer und Mitgliedschaften, CSV/JSON, Übernahme aus Projekten ([ADR-047](adr/ADR-047-rollenvorlagen-stilregeln-austausch.md)) |
| Stilwert-Verlauf (NFR-35) | ✅ Messpunkte bei Änderung, Verlauf und Veränderung im Dashboard ([ADR-048](adr/ADR-048-stilwert-verlauf.md)) |
| Screenshot: Zuschneiden, Lupe, Verschieben (NFR-36) | ✅ ([ADR-049](adr/ADR-049-screenshot-zuschnitt-lupe.md)) |

## 1.18 Stand nach Etappe 16 (25.09.2026)

Umfang vom Auftraggeber am 25.09.2026 festgelegt: eigene Stilregeln, Benutzerverwaltung, Screenshot-Editor erweitern, KI-Stapelumformulierung; Suche: Kapitel vor Pfadtreffern.

| Punkt | Ergebnis |
|---|---|
| Eigene Stilregeln, KI-Stapelumformulierung, Suchgewichtung (NFR-31) | ✅ Regeln je Projekt in allen Stilfunktionen, KI-Stapel mit Vorschau, Kapitel zuerst ([ADR-044](adr/ADR-044-stilregeln-ki-stapel.md)) |
| Benutzerverwaltung (NFR-32) | ✅ anlegen, sperren, Projektzugriffe, Schutz vor Aussperren ([ADR-045](adr/ADR-045-benutzerverwaltung.md)) |
| Screenshot-Editor (NFR-33) | ✅ Pfeile, Textfelder, verpixelte Bereiche ([ADR-046](adr/ADR-046-screenshot-editor.md)) |

## 1.17 Stand nach Etappe 15 (25.09.2026)

Umfang vom Auftraggeber am 25.09.2026 festgelegt: Bilder in Word & Werkstatt, Schreibstil in der Werkstatt, Screenshots markieren, Diagramme nachbearbeiten.

| Punkt | Ergebnis |
|---|---|
| Bilder in Word & Werkstatt, Screenshots, Nachbearbeitung (NFR-29) | ✅ PNG-Fassung für Word, Bild aus Absatz, Diagramm-Optionen und Vorlagen, Screenshot-Markierung ([ADR-042](adr/ADR-042-bilder-word-werkstatt.md)) |
| Schreibstil in der Werkstatt (NFR-30) | ✅ gelbe Markierung im Kapitel, Stapelkorrektur mit Vorschau, Stilwert im Dashboard ([ADR-043](adr/ADR-043-schreibstil-werkstatt.md)) |

## 1.16 Stand nach Etappe 14 (25.09.2026)

Umfang vom Auftraggeber am 25.09.2026 festgelegt: Navigationspunkte „Schreibstil“ (Regeln + KI; Textfeld, Kapitel, Textschnipsel) und „Bilder“ (Regeln + KI).

| Punkt | Ergebnis |
|---|---|
| Schreibstil (NFR-27) | ✅ Regelprüfung mit Fundstellen, gelb markierte Sätze zum Bearbeiten, automatische Korrekturen, professionell umformulieren und Präsens über KI ([ADR-040](adr/ADR-040-schreibstil.md)) |
| Bilder aus Text (NFR-28) | ✅ ASCII-Bild, Klickstrecke, Prozessbild, Infografik; Struktur bearbeitbar; auswählen und speichern ([ADR-041](adr/ADR-041-bilder-aus-text.md)) |

## 1.15 Stand nach Etappe 13 (24.09.2026)

Umfang vom Auftraggeber am 24.09.2026 festgelegt: Varianten synchronisieren, Layout & Word-Export (mit Formatvorlagen), Volltextsuche.

| Punkt | Ergebnis |
|---|---|
| Varianten synchronisieren (NFR-24) | ✅ Abgleich mit Quellgliederung, Übernahme von Schnipseln und fehlenden Einträgen mit Variantenprüfung ([ADR-037](adr/ADR-037-varianten-synchronisieren.md)) |
| Layout & Word (NFR-25) | ✅ Firmen-Layout für PDF, HTML, Online-Hilfe; .docx mit Formatvorlagen, Inhaltsverzeichnisfeld und Firmenvorlage ([ADR-038](adr/ADR-038-layout-word.md)) |
| Volltextsuche (NFR-26) | ✅ FTS5 bzw. tsvector, Relevanz, Filter, Umlaute, Präfix, Hervorhebung, inkrementell aktuell ([ADR-039](adr/ADR-039-volltextsuche.md)) |

## 1.14 Stand nach Etappe 12 (24.09.2026)

Umfang vom Auftraggeber am 24.09.2026 festgelegt: Draft Manual → Freigabe, Varianten-Export mit Verzeichnissen, Bedienkomfort, Betrieb & Pflege.

| Punkt | Ergebnis |
|---|---|
| Handbuch-Varianten (NFR-21) | ✅ Kapitelversionen aus der Gliederung, Freigabe wie Quellenkapitel, Export und Online-Hilfe je Variante mit Abkürzungen, Glossar, Bildverzeichnis, FAQ ([ADR-034](adr/ADR-034-handbuch-varianten.md)) |
| Bedienkomfort (NFR-22) | ✅ Drag & Drop, Gliederungsvergleich, globale Suche, Dunkelmodus, mobile Ansicht ([ADR-035](adr/ADR-035-bedienkomfort.md)) |
| Betrieb & Pflege (NFR-23) | ✅ entfernte Quelldateien, bereinigtes SVG, Stammdaten-Import CSV/Excel, Planungserinnerungen ([ADR-036](adr/ADR-036-betrieb-pflege.md)) |

Bekannte Grenzen (Etappe 6): Rate-Limits gelten je Instanz; die Qualitätsanalyse wächst bei sehr großen Beständen stärker als linear (ADR-015); eine manuelle Screenreader-Prüfung steht aus (ADR-016). Etappe 8: Import über PostgreSQL war durch Einzelabfragen langsamer als über SQLite (in Etappe 9 auf das 1,7-Fache von SQLite verringert); Confluence wurde über den HTML-Export angebunden (seit Etappe 10 auch über die Cloud-API); gelöschte Dateien eines Git-Repositories bleiben als Quelle erhalten. Etappe 10: Die Release-Pipeline läuft erst mit dem ersten Tag in GitHub (lokal nur Build/Start des Images in der CI geprüft); das Widget zeigt öffentlich nur Release-Stände; SVG-Grafiken werden nicht übernommen. Etappe 11: Gliederungen haben zwei Ebenen (Kapitel, Unterkapitel). Etappe 12: Der Tag `v0.11.0` muss von einer berechtigten Person gesetzt werden (die Sitzung darf nur den Arbeitsbranch pushen). Etappe 13: Aus Word-Vorlagen werden nur Formatvorlagen übernommen (keine Kopf-/Fußzeilen der Vorlage); SVG/WebP erscheinen in Word als Alternativtext; der Variantenabgleich erkennt umbenannte Einträge verschiedener Gliederungen nicht. Etappe 14: Die Stilregeln sind heuristisch (Passiv wird erkannt, nicht automatisch aktiviert); die Bilderkennung ist regelbasiert für typische Handbuchtexte; erzeugte SVG-Bilder erscheinen in Word als Alternativtext (seit Etappe 15 mit PNG-Fassung als Bild). Etappe 15: PNG-Fassungen entstehen im Browser – per API importierte SVGs brauchen einmal „PNG für Word erzeugen“; die Screenshot-Markierung kennt Nummern und Rahmen, keine Pfeile oder Unschärfe (seit Etappe 16 vorhanden). Etappe 16: Die du-Anrede-Prüfung erkennt „Sie“ am Satzanfang nicht; lokale Benutzer haben kein Passwort (Anmeldung im Produktivbetrieb über OIDC). Etappe 17: Der Stilwert-Verlauf beginnt mit dem Update; Verschieben im Screenshot-Editor ist nicht rückgängig zu machen. Etappe 18: Anleitungs-Check und Vorschläge des Kapitel-Assistenten sind regelbasiert (Handlungen werden an der Satzform erkannt); Bibliotheksregeln lassen sich im Projekt nur überschreiben, nicht einzeln abschalten; das Dashboard liegt jetzt unter „Weitere“ (`/dashboard`). Etappe 19: Rückmeldungen nur angemeldet (nicht in der öffentlichen Online-Hilfe); Kapitelvorlagen sind fest vorgegeben; der Merker der Einführung gilt je Browser. Etappe 20: Die Grenze für anonyme Rückmeldungen gilt je Instanz; die Begriffsauswertung zählt Wörter ohne Synonyme; PDF entsteht über den Druckdialog des Browsers. Etappe 21: Kopfzeile und Seitenzahlen erscheinen nur in Browsern mit `@page`-Randboxen (Chrome/Edge ab 131); die Wochenübersicht erscheint als Benachrichtigung in der App (kein E-Mail-Versand). Etappe 22: Die Lesesuche vergleicht Wortteile ohne Wortformen oder Synonyme; Trefferhervorhebung braucht die CSS Custom Highlight API (Chrome/Edge 105+, Safari 17.2+, Firefox 140+); Glossarbegriffe werden je Absatz beim ersten Vorkommen markiert. Etappe 23: Ähnlichkeit der Kapitel ist wortbasiert (keine Synonyme); FAQ-Vorschläge nur für deutsche Einträge; „Neu“ bezieht sich auf das erste Lesen im Handbuch.
