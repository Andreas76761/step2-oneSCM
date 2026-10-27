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
| **23** ✅ | „Siehe auch“ und häufige Fragen (ADR-069); Lesezeichen und Verlauf (ADR-070) | 110 Server- und 74 E2E-Tests grün auf SQLite und PostgreSQL |
| **24** ✅ | Sprachen beim Lesen (ADR-071); „Siehe auch“ und FAQ im Druck und in der Online-Hilfe (ADR-072); Lesezeichen mit Notizen (ADR-073) | 113 Server- und 75 E2E-Tests grün auf SQLite und PostgreSQL |
| **25** ✅ | Leseransicht in der Lesesprache (ADR-074); Übersetzung anfordern (ADR-075); Notizen direkt im Kapitel (ADR-076) | 116 Server- und 76 E2E-Tests grün auf SQLite und PostgreSQL |
| **26** ✅ | Häufige Fragen übersetzen (ADR-077); alle Projektsprachen vollständig beschriftet (ADR-078) | 118 Server- und 77 E2E-Tests grün auf SQLite und PostgreSQL |
| **29** ✅ | Jira-Import als Datei, Update-Eingang, Zugriffsmatrix (ADR-081) | 126 Server-Tests grün auf SQLite und PostgreSQL |
| **30** ✅ | Zuordnung Domäne → Gliederungspunkt → Ordner, Menüpunkte Contract Management 3.1–3.5, vier Steuerungsordner im Arbeitsordner (ADR-082) | 127 Server-Tests grün auf SQLite und PostgreSQL |
| **31** ✅ | Release-Abgleich, Releaseletter mit Prüfregeln, Warnhinweis-Schema, Übersetzungsprüfung, feste Übersetzungen (ADR-083) | 129 Server-Tests grün auf SQLite und PostgreSQL |
| **32** ✅ | Gliederungs-Vorschlag je Chunk, Kapitel ↔ Quellen, Wissensnotizen, Ausschlussliste, Zielkapitel je Dopplung (ADR-084) | 132 Server-Tests grün auf SQLite und PostgreSQL |
| **33** ✅ | Bildarchiv mit Bildnummer, Merkmalen, Prüfregeln, Versionen und Platzhaltern; Zwischenablage; Quick Guide, One Pager, Lesefassung, Übergänge (ADR-085) | 135 Server-Tests grün auf SQLite und PostgreSQL |
| **34** ✅ | M2: PowerPoint und PDF einlesen mit Fundstelle je Folie bzw. Seite, Abschnitts-Anker für HTML/Word, Seite „Einlesen“, Bild → Gliederungsstelle (ADR-086) | 139 Server-Tests grün auf SQLite und PostgreSQL |
| **35** ✅ | M3: Teilstücke langer Chunks (300–800 Zeichen, 1 Satz Überlappung), Quellen je Überschrift, Filter „Überschrift“ (ADR-087) | 141 Server-Tests grün auf SQLite und PostgreSQL |
| **36** ✅ | M4: Dubletten über alle Formate je Abschnitt, nach jedem Import nur geänderte Dateien, Entscheidung führende Fassung / kein Duplikat (ADR-088) | 143 Server-Tests grün auf SQLite und PostgreSQL |
| **37** ✅ | M5: Frage an alle Quellen mit Belegen (hybride Suche, Top 20 → Top 6), erneut fragen, Export, Rückfragen-Katalog (ADR-089) | 148 Server-Tests grün auf SQLite und PostgreSQL |
| **38** ✅ | M6: Untertitel und Video mit Zeitmarke, lokale Transkription, Standbilder bei Änderung (F-26), Texterkennung gescannter PDF-Seiten (ADR-090) | 152 Server-Tests grün auf SQLite und PostgreSQL |
| **39** ✅ | M7: Antwortqualität – Testfragen mit erwarteten Quellen, Prüfläufe mit Trefferquote und MRR, Vergleich, Export (ADR-091) | 155 Server-Tests grün auf SQLite und PostgreSQL |
| **40** ✅ | Optional: Punktmodell Muss/Soll (F-08), Expertenbefragung zu Wissenslücken (F-16), Deckungsmatrix der Bilder (F-30) (ADR-092) | 159 Server-Tests grün auf SQLite und PostgreSQL |
| **41** ✅ | Optional: Varianten einer Maske mit passender Fassung je Ausgabe (F-22), Klickstrecke aus Screenshots mit 3a/3b (F-24) (ADR-093) | 162 Server-Tests grün auf SQLite und PostgreSQL |
| **42** ✅ | Datenschutz im Bild: Namen, User-ID, Adresse, FIN erkennen und verpixeln, an/aus, Original bleibt; mehrere Labels und Kapitel je Bild (ADR-095) | 165 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **43** ✅ | Kapitelanweisung je Kapitel/Unterkapitel mit Vorrang (App und Arbeitsordner), Kapitel ergänzen, Version „gültig ab“, Historie abgelöster Funktionen (ADR-096) | 168 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **44** ✅ | Grammatik und Sprachstil: Hausregeln, erlaubte Begriffe, Englisch und Sprache je Regel, Lesbarkeit je Zielgruppe, „nicht übersetzen“, Bildunterschriften, Anweisung für Varianten (ADR-097) | 172 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **45** ✅ | Pipeline (Jira-Tickets in Bearbeitung je Gliederung mit Erstelldatum, Stream, Produktionsdatum, vorab dokumentiert), Backlog, Intern – in App, Datenbank, Arbeitsordner und Agenten (ADR-098) | 175 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **46** ✅ | RAG-Komponente getestet und erweitert: Messbestand, Suche v2 (Morphologie, Komposita, Abfrageerweiterung, BM25 + Vektor per RRF, Relevanzschwelle, MMR), nDCG@6, lokale Dienste (ADR-099) | 178 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL; Messung in docs/11 |
| **47** ✅ | Agent TRIAGE mit Pflichtlabels und Kapitelzuordnung (neue Unterkapitel „neu“), Detaillevel je Kapitel, Inhalts-Dashboard, Labels löschen, Agenten in der App mit ORCHESTRATOR und GOAL, Ordner 12_Goal (ADR-100) | 182 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **67** ✅ | Kontexthilfe im Lesestil, Rückmeldung mit Icons (ADR-119) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-380 |
| **68** ✅ | Barrierefreiheit für Word und PowerPoint mit Prüfbericht (ADR-120) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-383 |
| **69** ✅ | Prüfbericht Barrierefreiheit für HTML (ADR-121) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-386 |
| **70** ✅ | Lucide-Icons für Rollen, Sparten und Label-Gruppen (ADR-122) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-388 |
| **71** ✅ | Feinschliff nach Sichtprüfung (Designvorlagen, Einstellungen) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-390 |
| **72** ✅ | Status auf Deutsch, Seitenprüfung über alle Seiten | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-391 |
| **73** ✅ | Barrierefreiheit aller Seiten automatisch geprüft | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-391 und T-392 |
| **74** ✅ | T-202 lokal grün (Absatzauswahl im Test) | Server-Tests grün auf SQLite und PostgreSQL; alle E2E-Tests lokal grün |
| **75** ✅ | Barrierefreiheit aller Seiten im dunklen Modus | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-393 |
| **76** ✅ | Smartphone-Breite geprüft, Tabellen per Tastatur erreichbar | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-394 |
| **77** ✅ | Tastaturbedienung aller Seiten geprüft | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-395 |
| **78** ✅ | Vergrößerung (320 px) und Textabstände geprüft | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-396 |
| **79** ✅ | Hinweise ohne Ortsangaben | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-397 |
| **80** ✅ | Kontrast von Eingabefeldern und Fokusrahmen | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-398 |
| **81** ✅ | Statusmeldungen für Screenreader | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-400 |
| **82** ✅ | Seitentitel mit geöffnetem Objekt | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-401 |
| **83** ✅ | Sichtbare Beschriftung im zugänglichen Namen | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-402 |
| **84** ✅ | Dialoge und Erklärungen per Tastatur | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-403 |
| **85** ✅ | Screenshot-Editor ohne Ziehbewegung | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-404 |
| **86** ✅ | Gesperrte Schaltflächen nennen fehlende Angaben | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-405 |
| **87** ✅ | Gliederung jeder Seite (Überschriften und Bereiche) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-406 |
| **88** ✅ | Code-Review der Etappen 79–87 mit Korrekturen | Server-Tests grün auf SQLite und PostgreSQL; T-399, T-402, T-404 erweitert |
| **89** ✅ | Code-Review der Etappen 70–78 mit Korrekturen | Server-Tests grün auf SQLite und PostgreSQL; T-407, T-387 erweitert |
| **66** ✅ | Barrierefreies PDF im Design (Tags, Lesezeichen) mit Prüfbericht (ADR-118) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-378 |
| **65** ✅ | Lesestil „Handbuch-Kapitel“ für Leseransicht, Druck und Online-Hilfe (ADR-117) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-375 |
| **64** ✅ | Designvorlagen als PowerPoint (16:9) mit Titelfolie, Karten, Kennzahlen, Tabellen, Fortsetzung (ADR-116) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-373 |
| **63** ✅ | Designvorlagen als Word (.docx) mit Formatvorlagen, Icons und Anpassung; Nummerierung je Liste (ADR-115) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-370 |
| **62** ✅ | Designvorlagen anpassen: Farben mit Kontrastprüfung, Schriften, Logo-Position, Vorschau (ADR-114) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-367 |
| **61** ✅ | PDF im Design über einen lokalen Browser (Chromium, Chrome, Edge), Muster als PDF (ADR-113) | Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-364 |
| **60** ✅ | Designvorlagen für den HTML-Export: Quick Reference Guide und Handbuch-Kapitel mit Lucide-Icons, Muster, neue Layoutfelder (ADR-112) | 217 Server-Tests grün auf SQLite und PostgreSQL; E2E mit T-361 |
| **59** ✅ | Restliche Emoji als Lucide-Icons auf allen Seiten und in der Leseransicht (ADR-111) | 215 Server-Tests grün; E2E mit T-358 |
| **58** ✅ | Oberfläche mit professionellen Icons (Lucide) statt Emoji, Feinschliff der Navigation und Startseite (ADR-111) | 215 Server-Tests grün, E2E 114 grün (T-202/T-231 lokal wie bisher) |
| **57** ✅ | UI-Begriffe in der Terminologie: „MO-Prüfungen“ im Fließtext, „MO Checks“ in Menüpfaden und Anführungszeichen; SYNONYME.csv übernehmen (S-04, ADR-110) | 215 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **56** ✅ | Zuschaltbare Regelsätze: Regelbasiertes Schreiben, Simplified Technical English, Vale-Stile (S-06); Benachrichtigung zum Länderreview (ADR-109) | 213 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **55** ✅ | Lokale Grammatikprüfung mit LanguageTool (G-04), Ansprechperson je Markt mit Vertretung (O-09) (ADR-108) | 209 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL; Abgleich mit echtem LanguageTool 6.6 |
| **54** ✅ | Textbausteine (W-11, Single Sourcing), schnellere Übersicht oneSCM_Metadaten (ADR-107) | 206 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **53** ✅ | Vorher/Nachher-Belege (W-05), PowerPoint und BPMN (W-07), Zwischenbilder aus Videos (W-10) (ADR-106) | 203 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **52** ✅ | Textvarianten je Kapitel (S-05), vier Prüferprofile (W-12) (ADR-105) | 199 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **51** ✅ | Word-Prüffassung zurücklesen (W-06), KI-Lektorat mit Wortvergleich (G-07), interne Kommentare und Drei-Spalten-Ansicht (W-08) (ADR-104) | 196 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **50** ✅ | Kapitelbewertung mit Ampel (S-07), Plausibilität je Aussage (W-02), Fehlerliste in der App (G-05) (ADR-103) | 193 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **49** ✅ | Tonalität je Produktart und Rolle (S-02), Ticket-Einstufung (W-03), Releaseletter aus dem Projektvergleich (W-04), Zukunfts-Inhalte im Export (W-09) (ADR-102) | 190 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **48** ✅ | Übersetzung U-01 … U-10: Übersetzungsspeicher, Prüfungen, Länderreview mit MQM, Glossar je Sprache, XLIFF 1.2/Excel, Rückübersetzung, de-CH/fr-CH, Rahmentexte, Releaseletter DE↔EN, Bildvarianten (ADR-101) | 186 Server-Tests grün auf SQLite, Etappen-Tests auch auf PostgreSQL |
| **28** ✅ | Labelkatalog nach echtem oneSCM, erweiterte Datenschutzprüfung mit Pseudonymisierung (ADR-080) | 123 Server-Tests grün auf SQLite und PostgreSQL |
| **27** ✅ | oneSCM_Metadaten M1: 100 vordefinierte Labels, Chunks je Überschrift labeln, Fragen und Antworten mit Quellen speichern (ADR-079) | 121 Server-Tests grün auf SQLite und PostgreSQL, 78 E2E-Tests (T-202 und T-231 scheitern in dieser Umgebung auch ohne die Änderung) |
| **22** ✅ | Druck je Variante und Rolle im Firmen-Layout (ADR-065); Suche und Glossar beim Lesen (ADR-066); Vorlagen duplizieren, exportieren, importieren (ADR-067); schnelles Laden (ADR-068) | 108 Server- und 73 E2E-Tests grün auf SQLite und PostgreSQL |
| **21** ✅ | Vorlagen bearbeiten (ADR-062); Druck mit Deckblatt und Seitenzahlen (ADR-063); wöchentliche Übersicht (ADR-064) | 105 Server- und 72 E2E-Tests grün auf SQLite und PostgreSQL |
| **20** ✅ | Rückmeldungen auswerten (ADR-058); eigene Kapitelvorlagen (ADR-059); Druck-/PDF-Ansicht (ADR-060); Rückmeldungen in der Online-Hilfe (ADR-061) | 103 Server- und 71 E2E-Tests grün auf SQLite und PostgreSQL |
| **19** ✅ | Leseransicht & Rückmeldungen (ADR-054); Kapitelvorlagen (ADR-055); Einführung (ADR-056); Anleitungs-Check vor der Freigabe (ADR-057) | 100 Server- und 68 E2E-Tests grün auf SQLite und PostgreSQL |
| **18** ✅ | Stilregel-Bibliotheken (ADR-050); Anleitungs-Check (ADR-051); Kapitel-Assistent (ADR-052); Startseite und Menü nach Arbeitsablauf (ADR-053) | 97 Server- und 66 E2E-Tests grün auf SQLite und PostgreSQL |
| **17** ✅ | Rollenvorlagen, Stilregeln-Austausch (ADR-047); Stilwert-Verlauf (ADR-048); Screenshot: Zuschneiden, Lupe, Verschieben (ADR-049) | 94 Server- und 62 E2E-Tests grün auf SQLite und PostgreSQL |
| **16** ✅ | Eigene Stilregeln, KI-Stapelumformulierung, Suchgewichtung (ADR-044); Benutzerverwaltung (ADR-045); Screenshot-Editor mit Pfeilen, Text, Unschärfe (ADR-046) | 91 Server- und 61 E2E-Tests grün auf SQLite und PostgreSQL |
| **15** ✅ | Bilder in Word (PNG-Fassung) und Werkstatt, Diagramme nachbearbeiten mit Vorlagen, Screenshots markieren (ADR-042); Schreibstil in der Werkstatt, Stapelkorrektur, Stilwert im Dashboard (ADR-043) | 88 Server- und 59 E2E-Tests grün auf SQLite und PostgreSQL |
| **14** ✅ | Schreibstil mit gelb markierten Sätzen, Korrekturen und KI-Umformulierung (ADR-040); Bilder aus Text: ASCII-Bild, Klickstrecke, Prozessbild, Infografik (ADR-041) | 86 Server- und 58 E2E-Tests grün auf SQLite und PostgreSQL |
| **13** ✅ | Varianten synchronisieren (ADR-037), Firmen-Layout und Word-Export (ADR-038), Volltextsuche mit Index (ADR-039) | 84 Server- und 55 E2E-Tests grün auf SQLite und PostgreSQL |
| **12** ✅ | Handbuch-Varianten mit Freigabe, Export und Verzeichnissen (ADR-034); Drag & Drop, Gliederungsvergleich, globale Suche, Dunkelmodus, mobile Ansicht (ADR-035); entfernte Quelldateien, SVG, Stammdaten-Import, Planungserinnerungen (ADR-036) | 81 Server- und 54 E2E-Tests grün auf SQLite und PostgreSQL |
