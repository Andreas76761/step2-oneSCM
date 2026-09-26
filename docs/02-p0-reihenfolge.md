# 2. Priorisierte Reihenfolge der P0-Stories

Die Reihenfolge folgt den technischen Abhängigkeiten des Zielworkflows (Abschnitt 3). Eine Story kann erst „fertig“ (DoD, Abschnitt 18) sein, wenn ihre Vorgänger stehen.

| Rang | Story | Begründung / Abhängigkeit | Etappe |
|---:|---|---|---|
| 1 | **US-020 Traceability** (Gerüst) | muss von Anfang an mitlaufen, sonst ist DoD „Traceability vollständig“ nicht prüfbar | 1 |
| 2 | **US-001 Quellen importieren** | Eingang aller Daten; Revisionen sind Basis für Unveränderlichkeit | 1 |
| 3 | **US-002 Struktur extrahieren** | liefert Kapitel/Unterkapitel/Snippets | 1 |
| 4 | **US-004 Sparten klassifizieren** | unabhängig von Rollen, benötigt nur Snippets | 1 |
| 5 | **US-003 Rollen klassifizieren** | wie US-004; zusätzlich Trennung Rolle ↔ Berechtigung | 1 |
| 6 | **US-010 Rollen-/Spartenhinweise darstellen** | Referenzdaten (Icons) werden ab UI-Beginn benötigt | 1 |
| 7 | **US-005 Semantisch clustern** | benötigt klassifizierte Snippets | 1 |
| 8 | **US-006 Globale Dopplungen** | baut auf Ähnlichkeitsverfahren aus US-005 auf | 1 |
| 9 | **US-007 Widersprüche klären** | baut auf Kandidatenpaaren aus US-005 auf; Blocker steuern US-008/012 | 1 |
| 10 | **US-008 Kapitel generieren** | benötigt bestätigte Snippets, Canonical Topics, blockerfreie Kapitel | 1 |
| 11 | **US-009 Manuell bearbeiten** | benötigt generierte Content Blocks | 1 |
| 12 | **US-012 Qualitätsgate** | prüft Ergebnis aus US-007/008/009; Voraussetzung für Freigabe und Export | 1 |
| 13 | **US-020 Traceability** (Vervollständigung, Export) | Abschluss jeder Etappe | 1 |

## Etappenplan

| Etappe | Inhalt | Abnahme |
|---|---|---|
| **1** ✅ | alle P0-Stories in erster, lauffähiger Ausprägung auf SQLite, Demo-Daten, Unit-/API-/E2E-Tests, CI, Doku | Tests grün, Traceability-Matrix vollständig, offene Entscheidungen sichtbar |
| **2** ✅ | P0-Entscheidungen übernommen (24.09.2026); PostgreSQL-Adapter; OIDC-Anmeldung; persistente Jobqueue | Tests grün auf SQLite und PostgreSQL, Entscheidungsprotokoll |
| **3** ✅ | P1: Freigabeworkflow (US-016, gemäß E-12 einstufig), Terminologieverwaltung (US-015), Evidenzansicht (US-011), Export HTML/PDF (US-014), Optimierungsübersicht (US-013) | 34 Server- und 3 E2E-Tests grün auf SQLite und PostgreSQL |
| **4** ✅ | P2: Vergleich ganzer Kapitelversionen (US-019); S3-kompatibler Object-Store für Mehrinstanzbetrieb | 36 Server- und 4 E2E-Tests grün auf SQLite und PostgreSQL; S3 gegen s3rver/moto |
| **5** ✅ | Optional: KI-gestützte Umformulierung je Absatz (E-16, ADR-013): Anthropic und OpenAI-kompatibel, Evidenz je Satz, Übernahme durch die Redaktion | 40 Server- und 5 E2E-Tests grün auf SQLite und PostgreSQL |
| **6** ✅ | Mandanten/Projekte (ADR-014), Betrieb & Härtung (ADR-015), KI-Umformulierung ganzer Kapitel, Barrierefreiheit WCAG 2.2 AA (ADR-016) | 45 Server- und 26 E2E-Tests (inkl. axe) grün auf SQLite und PostgreSQL; 0 Schwachstellen in Laufzeitabhängigkeiten |
| **7** ✅ | Semantische Suche (ADR-017), Handbuch-Releases & Online-Hilfe (ADR-018), Kollaboration (ADR-019), Mehrsprachigkeit (ADR-020) | 50 Server- und 33 E2E-Tests grün auf SQLite und PostgreSQL |
| **8** ✅ | Mehrsprachige Releases (ADR-021), Import aus Confluence/Word/Git (ADR-022), Analytik & Berichte (ADR-023), Vektorindex HNSW/pgvector mit Lasttest 50 000 Abschnitte (ADR-024) | 58 Server- und 36 E2E-Tests grün auf SQLite und PostgreSQL (mit pgvector) |
| **9** ✅ | Mehrstufige Freigabe (ADR-025), Handbuch-Assistent (ADR-026), Betrieb & Performance mit Helm, OpenTelemetry und verteilten Rate-Limits (ADR-027) | 61 Server- und 39 E2E-Tests grün auf SQLite und PostgreSQL; Helm-Chart geprüft |
| **10** ✅ | Integrationen & API (ADR-028), Bilder & Medien (ADR-029), Kontexthilfe für oneSCM (ADR-030), Release-Pipeline (ADR-031) | 74 Server- und 44 E2E-Tests grün auf SQLite und PostgreSQL; Workflows mit actionlint geprüft |
| **11** ✅ | Stammdaten mit Gliederungen je Variante, Abkürzungen, Glossar, Bildverzeichnis, FAQ, Planung (ADR-032); Draft Manual mit Kennzeichnung (ADR-033); einklappbare Navigation | 78 Server- und 52 E2E-Tests grün auf SQLite und PostgreSQL |
| **20** ✅ | Rückmeldungen auswerten (ADR-058); eigene Kapitelvorlagen (ADR-059); Druck-/PDF-Ansicht (ADR-060); Rückmeldungen in der Online-Hilfe (ADR-061) | 103 Server- und 71 E2E-Tests grün auf SQLite und PostgreSQL |
| **19** ✅ | Leseransicht & Rückmeldungen (ADR-054); Kapitelvorlagen (ADR-055); Einführung (ADR-056); Anleitungs-Check vor der Freigabe (ADR-057) | 100 Server- und 68 E2E-Tests grün auf SQLite und PostgreSQL |
| **18** ✅ | Stilregel-Bibliotheken (ADR-050); Anleitungs-Check (ADR-051); Kapitel-Assistent (ADR-052); Startseite und Menü nach Arbeitsablauf (ADR-053) | 97 Server- und 66 E2E-Tests grün auf SQLite und PostgreSQL |
| **17** ✅ | Rollenvorlagen, Stilregeln-Austausch (ADR-047); Stilwert-Verlauf (ADR-048); Screenshot: Zuschneiden, Lupe, Verschieben (ADR-049) | 94 Server- und 62 E2E-Tests grün auf SQLite und PostgreSQL |
| **16** ✅ | Eigene Stilregeln, KI-Stapelumformulierung, Suchgewichtung (ADR-044); Benutzerverwaltung (ADR-045); Screenshot-Editor mit Pfeilen, Text, Unschärfe (ADR-046) | 91 Server- und 61 E2E-Tests grün auf SQLite und PostgreSQL |
| **15** ✅ | Bilder in Word (PNG-Fassung) und Werkstatt, Diagramme nachbearbeiten mit Vorlagen, Screenshots markieren (ADR-042); Schreibstil in der Werkstatt, Stapelkorrektur, Stilwert im Dashboard (ADR-043) | 88 Server- und 59 E2E-Tests grün auf SQLite und PostgreSQL |
| **14** ✅ | Schreibstil mit gelb markierten Sätzen, Korrekturen und KI-Umformulierung (ADR-040); Bilder aus Text: ASCII-Bild, Klickstrecke, Prozessbild, Infografik (ADR-041) | 86 Server- und 58 E2E-Tests grün auf SQLite und PostgreSQL |
| **13** ✅ | Varianten synchronisieren (ADR-037), Firmen-Layout und Word-Export (ADR-038), Volltextsuche mit Index (ADR-039) | 84 Server- und 55 E2E-Tests grün auf SQLite und PostgreSQL |
| **12** ✅ | Handbuch-Varianten mit Freigabe, Export und Verzeichnissen (ADR-034); Drag & Drop, Gliederungsvergleich, globale Suche, Dunkelmodus, mobile Ansicht (ADR-035); entfernte Quelldateien, SVG, Stammdaten-Import, Planungserinnerungen (ADR-036) | 81 Server- und 54 E2E-Tests grün auf SQLite und PostgreSQL |
