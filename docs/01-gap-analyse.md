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

## 1.24 Stand nach Etappe 22 (26.09.2026)

Umfang vom Auftraggeber am 26.09.2026 festgelegt: Druck je Variante/Rolle, Suche & Glossar im Lesen, Vorlagen duplizieren & teilen.

| Punkt | Ergebnis |
|---|---|
| Druck je Variante/Rolle (NFR-52) | ✅ Auswahl Variante und Rolle, Firmen-Layout, Kopf-/Fußzeile, Glossar-Anhang ([ADR-065](adr/ADR-065-druck-variante-rolle.md)) |
| Suche & Glossar im Lesen (NFR-53) | ✅ Suche mit Ausschnitt und Markierung, Begriffserklärungen per Tooltip ([ADR-066](adr/ADR-066-suche-glossar-lesen.md)) |
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

Bekannte Grenzen (Etappe 6): Rate-Limits gelten je Instanz; die Qualitätsanalyse wächst bei sehr großen Beständen stärker als linear (ADR-015); eine manuelle Screenreader-Prüfung steht aus (ADR-016). Etappe 8: Import über PostgreSQL war durch Einzelabfragen langsamer als über SQLite (in Etappe 9 auf das 1,7-Fache von SQLite verringert); Confluence wurde über den HTML-Export angebunden (seit Etappe 10 auch über die Cloud-API); gelöschte Dateien eines Git-Repositories bleiben als Quelle erhalten. Etappe 10: Die Release-Pipeline läuft erst mit dem ersten Tag in GitHub (lokal nur Build/Start des Images in der CI geprüft); das Widget zeigt öffentlich nur Release-Stände; SVG-Grafiken werden nicht übernommen. Etappe 11: Gliederungen haben zwei Ebenen (Kapitel, Unterkapitel). Etappe 12: Der Tag `v0.11.0` muss von einer berechtigten Person gesetzt werden (die Sitzung darf nur den Arbeitsbranch pushen). Etappe 13: Aus Word-Vorlagen werden nur Formatvorlagen übernommen (keine Kopf-/Fußzeilen der Vorlage); SVG/WebP erscheinen in Word als Alternativtext; der Variantenabgleich erkennt umbenannte Einträge verschiedener Gliederungen nicht. Etappe 14: Die Stilregeln sind heuristisch (Passiv wird erkannt, nicht automatisch aktiviert); die Bilderkennung ist regelbasiert für typische Handbuchtexte; erzeugte SVG-Bilder erscheinen in Word als Alternativtext (seit Etappe 15 mit PNG-Fassung als Bild). Etappe 15: PNG-Fassungen entstehen im Browser – per API importierte SVGs brauchen einmal „PNG für Word erzeugen“; die Screenshot-Markierung kennt Nummern und Rahmen, keine Pfeile oder Unschärfe (seit Etappe 16 vorhanden). Etappe 16: Die du-Anrede-Prüfung erkennt „Sie“ am Satzanfang nicht; lokale Benutzer haben kein Passwort (Anmeldung im Produktivbetrieb über OIDC). Etappe 17: Der Stilwert-Verlauf beginnt mit dem Update; Verschieben im Screenshot-Editor ist nicht rückgängig zu machen. Etappe 18: Anleitungs-Check und Vorschläge des Kapitel-Assistenten sind regelbasiert (Handlungen werden an der Satzform erkannt); Bibliotheksregeln lassen sich im Projekt nur überschreiben, nicht einzeln abschalten; das Dashboard liegt jetzt unter „Weitere“ (`/dashboard`). Etappe 19: Rückmeldungen nur angemeldet (nicht in der öffentlichen Online-Hilfe); Kapitelvorlagen sind fest vorgegeben; der Merker der Einführung gilt je Browser. Etappe 20: Die Grenze für anonyme Rückmeldungen gilt je Instanz; die Begriffsauswertung zählt Wörter ohne Synonyme; PDF entsteht über den Druckdialog des Browsers. Etappe 21: Kopfzeile und Seitenzahlen erscheinen nur in Browsern mit `@page`-Randboxen (Chrome/Edge ab 131); die Wochenübersicht erscheint als Benachrichtigung in der App (kein E-Mail-Versand). Etappe 22: Die Lesesuche vergleicht Wortteile ohne Wortformen oder Synonyme; Trefferhervorhebung braucht die CSS Custom Highlight API (Chrome/Edge 105+, Safari 17.2+, Firefox 140+); Glossarbegriffe werden je Absatz beim ersten Vorkommen markiert.
