# 4. Widersprüche und P0-Entscheidungen

> **Status: entschieden am 24.09.2026.** Der Auftraggeber hat alle vorläufigen Annahmen aus Etappe 1 unverändert als Entscheidungen übernommen („Übernimm alle vorläufigen Annahmen“). Im Code sind die Stellen mit `ENTSCHEIDUNG(E-xx)` markiert, in der UI blau als „Entscheidung“ hinterlegt. Konfigurierbare Werte bleiben unter **Einstellungen** bzw. per Umgebungsvariable änderbar; eine Änderung ist eine neue fachliche Entscheidung und wird hier nachgetragen.

## 4.1 Widersprüche im Auftrag

| ID | Widerspruch | Fundstellen | Entschiedene Behandlung |
|---|---|---|---|
| W-01 | „Datenschutzprüfung“ ist P1, aber Datenschutzblocker sind Teil des P0-Qualitätsgates und Pflichttest | §5 vs. US-012, §13, §16 | Datenschutzmuster-Prüfung in Etappe 1 umgesetzt |
| W-02 | „Freigabeworkflow“ ist P1, aber „Fachliche Freigabe ist protokolliert“ ist P0 | §5 vs. US-012 | einstufige, protokollierte Freigabe in Etappe 1; mehrstufiger Workflow P1 |
| W-03 | „Versionsvergleich“ ist P2, aber „Frühere Versionen können verglichen werden“ ist P0 | §5 vs. US-009 | Block-Versionsvergleich P0, Kapitelversionsvergleich P2 |
| W-04 | „kombinierte Suche und Filter“ und „gefilterter Export“ sind P1, aber Pflichttests | §5 vs. §16 | in Etappe 1 umgesetzt |
| W-05 | Rolle „Markt“ vs. Dimension „Markt“ (Market-Entität) – gleicher Begriff für fachliche Rolle und Gültigkeitsbereich | §2, §9 | getrennt: Rolle `market` (🌍 Markt), Dimension `market_code` (z. B. `DE`) |
| W-06 | Referenz-UI („MD Content Studio v1.3“) nutzt andere Navigation, Status (`übernehmen/Widerspruch/überarbeiten`, `offen/freigegeben/verworfen`) und Pfade (`/api/upload`, `/api/analysis`) | REFERENZ_UI.png vs. §10, §14 | Masterprompt ist verbindlich; Referenz-UI nur als visuelle Vorlage (Layout, Karten, Tabellen, Schwellen-Slider) |
| W-07 | Bearbeitungsmodus `approved` auf Blockebene vs. Regel „veröffentlichte Versionen sind unveränderlich“ auf Versionsebene | §8, §9 | Freigabe erfolgt je Kapitelversion; beim Freigeben erhalten alle Blöcke den Modus `approved`; danach 409 bei Änderung |
| W-08 | US-008 „nur bestätigte Quellen“ vs. §15 „Empfehlung als vorläufige Annahme verwenden“ – Klassifikationen sind initial alle unbestätigt, Generierung wäre ohne manuelle Bestätigung leer | US-008, §15 | Generierung nutzt nur Snippets mit Evidenzstatus `source_confirmed`/`manually_confirmed`; Demo-Daten enthalten Front-Matter (→ `source_confirmed`); Snippets lassen sich in „Quellen“ bestätigen |
| W-09 | Story-IDs US-011, US-013…019 fehlen | §4 | Vergabe gemäß E-14, siehe `traceability/requirements.json` |

## 4.2 P0-Entscheidungen (nach §15)

| ID | Gruppe | Frage(n) | Entscheidung (24.09.2026) | Konfigurierbar über |
|---|---|---|---|---|
| E-01 | Importformate, Limits, Teilfehler, Revisionslogik | Erlaubte Endungen? Max. Größe? ZIP-Tiefe? Verhalten bei Teilfehlern? Wann ist eine Revision „identisch“? | `.md`, `.markdown`, `.zip`; max. 50 MB Upload, 5 000 Dateien, 20 MB entpackt je Datei; Teilfehler → Status `completed_with_errors`, andere Dateien werden übernommen; identisch = gleicher SHA-256 wie letzte Revision desselben Pfads | `UPLOAD_MAX_BYTES`, `ZIP_MAX_FILES`, Einstellungen `import.*` |
| E-02 | Markdown-Mapping, Snippet-Granularität | Absatz- oder Satzebene? Listen als ein Snippet? Tabellen? | Absatz, Liste, Tabelle, Codeblock, Zitat je ein Snippet; H1 = Kapitel, H2 = Unterkapitel, H3–H6 = `heading_path`; Kapitelidentität über normalisierten H1-Titel (projektweit) | Code (`domain/markdown.ts`) |
| E-03 | Rollenzuordnung, Konfidenz, Freigabeberechtigung | Ab welchem Score gilt eine Zuordnung? Wer darf bestätigen/freigeben? | Schlüsselwortregeln, Score 0,5–0,9; automatische Zuordnung bleibt `unconfirmed`; bestätigen: Berechtigung `edit`; freigeben: Berechtigung `approve` | Einstellungen `classification.*`, Demo-Benutzer |
| E-04 | Spartenliste, Icons, automatische Ableitung | Ist die Liste abschließend? Ableitung aus Pfad/Dateiname zulässig? | Liste gemäß §2; Ableitung aus Pfad/Dateiname erlaubt, aber stets `unconfirmed` | `domain/reference.ts` |
| E-05 | Semantisches Verfahren, Schwellenwerte | Embedding-Modell? On-Prem? Schwellen? | TF-IDF-Kosinus (`tfidf-cosine-1.0`), Clusterschwelle 0,55, Dopplung 0,85, Widerspruchskandidat 0,40 (vgl. Referenz-UI 40 %/55 %) | Einstellungen `analysis.*` |
| E-06 | Globale Cluster und Canonical Topics | Wer legt das führende Kapitel fest? Automatischer Vorschlag? | Vorschlag = Kapitel mit höchster Snippet-Anzahl im Cluster; Festlegung nur manuell mit Begründung | – |
| E-07 | Blockerdefinition, Widerspruchsentscheidungen | Welche Befunde blockieren? | Blocker: Negation, Pflicht/Optional, abweichende Zahl/Frist, Datenschutz; `high`: Zuständigkeit; `medium`: Rollen/Sparten/Markt/Release-Unterschied, veraltete Quelle | Einstellungen `analysis.blockerRules` |
| E-08 | Zulässige Evidenzstatus | Vollständige Liste und Semantik? | `source_confirmed` (Front-Matter der Quelle), `manually_confirmed`, `unconfirmed`, `open_question` | `domain/reference.ts` |
| E-09 | Kapitelstruktur, Styleguide | Ist die 10-teilige Struktur fix? Zuordnung von Inhalten zu Abschnitten? | Struktur fix nach §6; Zuordnung per Heuristik (Überschrift/Schlüsselwort/Listentyp); Generator ist extraktiv und formuliert nicht um | `domain/generator.ts` |
| E-10 | Schutz manueller Änderungen, Aufbewahrung | Aufbewahrungsdauer? Darf Regenerierung manuelle Blöcke ersetzen? | Manuelle/gesperrte Blöcke werden bei Regenerierung übernommen, nie ersetzt; betroffene Blöcke werden `needs_regeneration`, wenn sich Quellen ändern; keine Löschung (Soft-Delete), unbegrenzte Aufbewahrung | – |
| E-11 | Verbindliche Icons, Barrierefreiheit | WCAG-Level? Emoji oder SVG? | Emoji gemäß §2 + Textlabel + Farbe; Ziel WCAG 2.2 AA (Kontrast, Tastatur, `aria-label`) | `domain/reference.ts` |
| E-12 | Qualitätsgates, Freigeberrollen, Ausnahmen | Vier-Augen? Ausnahmegenehmigung? | Gate gemäß US-012; einstufige Freigabe; keine Ausnahmen möglich | – |
| E-13 | Traceability-Ebenen, Tests, Status, Nachweise | Welche Ebenen? Nachweisformat? | Story ↔ API-Operation ↔ Test ↔ Doku ↔ Release; Nachweis = Testdatei + CI-Lauf | `traceability/*.json` |
| E-14 | Story-IDs für P1/P2 | Welche IDs? | US-011 Evidenzansicht, US-013 Optimierungsdashboard, US-014 gefilterter Export, US-015 Terminologie, US-016 Freigabeworkflow, US-017 Suche/Filter, US-018 Datenschutzprüfung, US-019 Versionsvergleich | `traceability/requirements.json` |
| E-15 | Authentifizierung | IdP? Rollenmodell? | Berechtigungen `read`, `edit`, `decide`, `approve`, `admin`. Produktion: OpenID Connect (beliebiger Provider), Berechtigungen aus einem Gruppen-/Rollen-Claim (Standard-Gruppen `onescm-reader/-editor/-reviewer/-approver/-admin`). Demo-Benutzer nur im Demo-Modus | `AUTH_MODE`, `OIDC_*` (README) |

## 4.3 Neue offene Entscheidung (Etappe 4)

| ID | Gruppe | Frage(n) | Stand |
|---|---|---|---|
| E-16 | LLM-gestützte Umformulierung (ADR-007, optional) | Dürfen Quelltexte an einen externen KI-Dienst übertragen werden (Datenschutz, Vertraulichkeit)? Welcher Anbieter/Betrieb (Cloud, EU-Region, on-prem)? Muss jeder umformulierte Satz einzeln belegt und freigegeben werden? | **entschieden 24.09.2026:** a) Cloud-Dienst erlaubt, standardmäßig aus, Aktivierung per Konfiguration; b) Anthropic Claude und OpenAI-kompatible Endpunkte; c) Quellen je Satz, Umformulierung nur als Vorschlag mit Übernahme durch die Redaktion – umgesetzt in Etappe 5 ([ADR-013](adr/ADR-013-ki-umformulierung.md)) |

## 4.4 Entscheidungsprotokoll

| Datum | Entscheider | Umfang | Anmerkung |
|---|---|---|---|
| 24.09.2026 | Auftraggeber (Andreas) | E-01 … E-15, W-01 … W-09 | Übernahme aller vorläufigen Annahmen aus Etappe 1 ohne Änderung; E-15 um die in Etappe 2 umgesetzte OIDC-Anbindung konkretisiert |
| 24.09.2026 | Auftraggeber (Andreas) | E-16 | Cloud-KI erlaubt (Aktivierung per Konfiguration), Anthropic + OpenAI-kompatibel, Evidenz je Satz + Übernahme durch die Redaktion |
| 24.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 11 | Stammdaten und Draft Manual (ADR-032, ADR-033): Märkte konfigurierbar (Vorbelegung DE, FR, IT, ES, GB, NL), Planung = Redaktionsplanung je Kapitel, Gliederungen als zusätzliche Sicht neben der Kapitelstruktur, FAQ gepflegt mit Vorschlägen aus dem Assistenten |
| 24.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 12 | Alle vier Themen: Draft Manual → Freigabe und Veröffentlichung je Variante (ADR-034), Varianten-Export mit Verzeichnissen, Bedienkomfort (ADR-035), Betrieb & Pflege inkl. erstem Release v0.11.0 und aktualisiertem Windows-Paket (ADR-036) |
| 26.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 23 | Verwandte Kapitel & FAQ, Lesezeichen & Verlauf (ADR-069, ADR-070); Sprachen beim Lesen und Wochenübersicht per E-Mail zurückgestellt |
| 26.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 24 | Sprachen beim Lesen, Siehe auch in Druck & Online-Hilfe, Lesezeichen mit Notizen (ADR-071 … ADR-073); Wochenübersicht per E-Mail weiter zurückgestellt |
| 26.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 22 | Druck je Variante/Rolle, Suche & Glossar im Lesen, Vorlagen duplizieren & teilen (ADR-065 … ADR-067); Wochenübersicht per E-Mail zurückgestellt |
| 26.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 21 | Vorlagen bearbeiten, Druck mit Deckblatt, wöchentliche Übersicht (ADR-062 … ADR-064) |
| 26.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 20 | Rückmeldungen auswerten, eigene Kapitelvorlagen, Druck-/PDF-Ansicht, Rückmeldungen in der Online-Hilfe (ADR-058 … ADR-061) |
| 26.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 19 | Leseransicht & Rückmeldungen, Kapitelvorlagen im Assistenten, Einführung beim ersten Start, Anleitungs-Check vor der Freigabe (ADR-054 … ADR-057) |
| 26.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 18 | Schwerpunkt Inhalt eines leserfreundlichen Handbuchs und leichte Bedienung: Anleitungs-Check, Kapitel-Assistent, einfache Oberfläche (ADR-051 … ADR-053) sowie Stilregel-Bibliotheken (ADR-050); Projektvergleich/CSV-Export des Stilwerts entfallen |
| 26.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 17 | Rollenvorlagen & Stilregeln-Austausch, Stilwert-Verlauf, Screenshot: Zuschneiden & Lupe (ADR-047 … ADR-049); Passwort-Anmeldung zurückgestellt |
| 25.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 16 | Eigene Stilregeln, Benutzerverwaltung, Screenshot-Editor (Pfeile, Text, Unschärfe), KI-Stapelumformulierung (ADR-044 … ADR-046); Suche: Kapitel vor Pfadtreffern |
| 25.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 15 | Bilder in Word & Werkstatt, Schreibstil in der Werkstatt, Screenshots markieren, Diagramme nachbearbeiten (ADR-042, ADR-043); eigene Stilregeln und Benutzerverwaltung zurückgestellt |
| 25.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 14 | Navigationspunkt „Schreibstil“ mit Regeln + KI für Textfeld, Kapitel und Textschnipsel (ADR-040); Navigationspunkt „Bilder“ mit Regeln + KI für ASCII-Bild, Klickstrecke, Prozessbild, Infografik (ADR-041) |
| 24.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 13 | Varianten synchronisieren (ADR-037), Layout & Word-Export mit Formatvorlagen (ADR-038), Volltextsuche (ADR-039); Benutzerverwaltung zurückgestellt |
| 24.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 10 | Integrationen & API, Bilder & Medien (Alternativtext als Pflicht), Kontexthilfe für oneSCM, Release-Pipeline (ADR-028 … ADR-031) |
| 24.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 9 | Handbuch-Assistent (RAG), mehrstufige Freigabe (erweitert E-12 als Option je Projekt), Betrieb & Performance (ADR-025 … ADR-027) |
| 24.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 8 | Mehrsprachige Releases, Import aus Fremdsystemen (Git, Confluence-HTML, Word), Analytik & Berichte, Skalierung mit ANN-Index/pgvector und Lasttest 50 000 Abschnitte (ADR-021 … ADR-024) |
| 24.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 7 | Semantische Suche/Embeddings, Veröffentlichung & Versionierung, Kollaboration, Mehrsprachigkeit (ADR-017 … ADR-020); TF-IDF bleibt Standard der Analyse (E-05) |
| 24.09.2026 | Auftraggeber (Andreas) | Umfang Etappe 6 | Betrieb & Härtung, KI-Umformulierung ganzer Kapitel, Barrierefreiheit & UX, Mandanten/Projekte (ADR-014 … ADR-016) |
