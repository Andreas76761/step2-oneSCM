# 7. Bestehende Artefakte: was existiert, was eingebunden werden kann

> **Status: entschieden am 23.10.2026.** Ausgewertet wurden 22 eigene claude.ai-Artefakte zu Handbuch, oneSCM und Releaseletter (nur gelesen, nichts geändert). Der Auftraggeber hat MO = Market Operation, Anrede „Sie“ und nur Pkw/Van festgelegt und für alle übrigen Punkte die Empfehlungen übernommen: „übernehmen“ = Ja, „optional“/„später“ = Später, D-10 später aus den Originaldateien. Die Auswahl je Punkt steht auf der [Entscheidungsseite](https://claude.ai/artifact/VuADyUkwMWfknavaEuHmWJ). Umgesetzt in Etappe 28: D-01 … D-05 und F-04 ([ADR-080](adr/ADR-080-katalog-onescm-datenschutz.md)). Etappe 29: F-01, F-05, F-06, D-06 … D-08 ([ADR-081](adr/ADR-081-jira-update-zugriff.md)). Etappe 31: F-02, F-03, F-07, F-09, F-12 ([ADR-083](adr/ADR-083-releaseletter-lektorat.md)). Etappe 32: F-13, F-14, F-15, F-17, F-18 ([ADR-084](adr/ADR-084-gliederung-wissen.md)). Etappe 33: F-20, F-21, F-23, F-27, F-28, F-29 ([ADR-085](adr/ADR-085-bilder-ausgabe.md)). Etappe 34: F-25 mit M2 ([ADR-086](adr/ADR-086-pptx-pdf-fundstellen.md)).
> Aufwand: **S** ≤ 1 Tag, **M** 2–4 Tage, **L** ≥ 1 Woche.

## 7.1 Ausgewertete Artefakte

| Artefakt | Inhalt | Wert für die App |
|---|---|---|
| [Handbuch-Werkstatt V4](https://claude.ai/artifact/3pBDtCt5X3tHF6K34dVDVV) | Dashboard zur lokalen Python-Pipeline (434-Seiten-Draft, 15 Kapitel); echtes Menü mit Rollenzugriff, Terminologie, 1 663 Jira-Epics, 20 Schaubilder, 51 Screens | **hoch** (Daten) |
| [oneSCM Handbuch: Struktur und Klickstrecke](https://claude.ai/artifact/MnvrjEq7jANj2WtYxaSjpo) | neueste Gliederung (23 Kapitel, 218 Zeilen, 11.10.2026), 3 713 Quellabschnitte aus 1 315 RAG-Batches, 43 Quick Guides | **hoch** (Daten) |
| [Screenarchiv oneSCM](https://claude.ai/artifact/TxmCjDsdqxjqkNYTmrpLja) | Bildwerkstatt; echte Gesamtgliederung mit 1 153 Stellen (12.10.2026), Wortliste; Bildschirme selbst sind **erfunden** | **hoch** (Gliederung, Bildfunktionen) |
| [oneSCM Wissenssuche](https://claude.ai/artifact/W27KLF3bDv9mbEjGs7K2Pv) | ~155 Wissenseinträge aus 13 Quellen, Handbuch NEU (50 Kapitel, FAQ, Glossar, Abkürzungen), 127 Screens mit Unterschriften, echte Menüpfade und Rollen | **hoch** (Daten) |
| [ONESCM Ticket-Cockpit](https://claude.ai/artifact/GxttjhbXogwwEkuQuK58Bv) + [Feature-Übersicht](https://claude.ai/artifact/NzobxPkP4rS9eEwdLAebTo) | Jira-/Confluence-Import, Bereinigung, Releaseletter, Rollen-Navigation, 239 Labels DE/EN | **hoch** (Funktionen, Daten) |
| [Releaseletter-Prüfer · Jira ↔ Dify](https://claude.ai/artifact/HC3hUciYhbifLuA6wU5wsG) | 12 Prüfregeln Ticket ↔ Letter, PII-Muster, Aufbau des Letters, ~75 Fachbegriffe | **hoch** (Releaseletter) |
| [oneSCM Releaseletter-Generator · Dify-Pipeline](https://claude.ai/artifact/3yy73yrZkVWXvnEJD7BDdA) | Pipeline-Beschreibung mit Guardrails (Datum, PI, verlinkte Tickets, PII) | mittel (Regeln) |
| [oneSCM Lückenanalyse](https://claude.ai/artifact/GaiBdA8aMhytEdhHHN5QLV) | 41 Fragen gegen Handbuch NEU geprüft (7 beantwortet, 10 teilweise, 24 offen) | mittel (Testfragen) |
| [oneSCM Wissens-Check](https://claude.ai/artifact/QRYH6RCgXP14J8gYhzw8WA) | 20 unbelegte Fragen mit Antwortoptionen für Experten | mittel |
| [Checkliste: Benutzerhandbuch erstellen](https://claude.ai/artifact/5qgWKjawPYw1bhBGyAj3PV) | Normen-Checkliste (IEC/IEEE 82079-1, ANSI Z535.6, WCAG), Qualitäts-Gate | mittel (Prüfregeln) |
| [DokuPress – DTP-Mockup](https://claude.ai/artifact/BMxpuMpw9fMcseSefuUqit), [Konzept](https://claude.ai/artifact/AS8pDVQV3apivkruey7Khk), [Audit](https://claude.ai/artifact/YMQ1eSfXJi6E7r91yyfakF) | Prototyp eines Redaktionssystems; Beispieldaten **erfunden** (Supply-Chain-Produkt) | mittel (Funktionsideen) |
| [Screenshot-Studio](https://claude.ai/artifact/E11KtkZAD8SrUKQ7nWQ4jd) | Video → beschriftete Schritt-Screenshots | mittel (M6) |
| [oneSCM Handbuch Überblick](https://claude.ai/artifact/KxfxAiWoftXDeByWnUWemq) | ältere Gliederung (50 Kapitel), Rollen, Kundengruppen | gering (Daten) |
| [Market Implementation Plan](https://claude.ai/artifact/4ttVTtsSAQaS8S7W2nAzX9) | Rollout-Board, Systemnamen | gering (Glossar) |
| [App-Werkstatt – Übersicht](https://claude.ai/artifact/1G4zK2N4Y5ECjz7dinoC4s) | Liste von 30 eigenen Apps, u. a. lokale Releaseletter-Werkzeuge, OCR-Xtractor | gering (Verweise) |
| Review-Studio, Report-Studio (3 Fassungen), Vertragsübersicht, Fotoarchiv Camera | Controlling-Berichte bzw. privat | **keiner** |

**Wichtig:** Ein großer Teil Ihres Knowledge-Ordners steckt bereits in diesen Artefakten (Gliederungen, Navigation, FAQ, Glossar, Screens, Quellabschnitte). Diese Daten kann ich hier ohne Zugriff auf Ihren Rechner übernehmen.

## 7.2 Wichtigster Befund: der Labelkatalog passt nicht zum echten oneSCM

Die 100 Labels aus Etappe M1 sind ein Vorschlag aus den Demo-Daten. Die Artefakte belegen etwas anderes:

| Gruppe | Befund | Vorschlag |
|---|---|---|
| Gliederung (30) | Begriffe wie „Preislisten“, „Gutschriften“, „Systemeinstellungen“ kommen in keiner echten Gliederung vor | durch die echte Gliederung ersetzen (siehe D-01) |
| Navigation (25) | „Verträge › Übersicht“, „Abrechnung › Gutschriften“, „Stammdaten › Fahrzeuge“ gibt es nicht. Echt (englische UI, `Navigation_oneSCM_Version3.docx`): Product Management › Manage Vehicle Groups / Manage Products and Prices / Manage Campaign / Manage Blueprints / Vega Codes / Product Testing; Contract Generation › Contract Proposal / Proposal Management / MO Checks / Special Cases; Contract Management; Customer Management › Private / Commercial Customer; Finance › Status FI Document / Document Type / Financial Control / oneERP Checks; International Workshop; Nemesis; Market Settings › Inflation; Template Management; Admin Section › Material Number / Batch Jobs / Vehicle Management / Health Check / Cross File Transfer / Information Banner (34 Punkte) | ersetzen: UI-Begriff englisch als `nameEn`, Handbuchbegriff als `nameDe` (D-02) |
| Rollen (10) | nicht belegt: Key User, Vertrieb, Buchhaltung, Support. Es fehlen: Dealer+, MPC (MPC1/MPC2, Vier-Augen), KAM, HQ Admin, HQ Produktmanager, CaM-Team | ersetzen (D-03) |
| Sparte (5) | Quellen kennen nur **Pkw (PC) und Van**; Truck und Bus nirgends | Truck/Bus ausblenden (D-04) |
| Inhaltstyp (15) | Diátaxis-Arten fehlen: Tutorial, Referenz, Erklärung; ebenso Statusmodell, Systemsteckbrief, Quick Guide, Jira-Ticket | ergänzen (D-05) |
| Qualität (15) | fehlen: „Redaktionsteil – nicht veröffentlichen“, „Produktivnachweis fehlt“ | ergänzen (D-05) |
| neue Gruppen | Domäne (9: Contract Calculation, Contract Generation, Contract Management, Revenue, Cost, Customer & Partner, Vehicle, Documents & Communication, Reporting), Kundengruppe (5), Systeme (~19: VEGA, OTR, ALICE, oneERP, NEMESIS, MPay …) | ergänzen (D-05) – dann mehr als 100 Labels |

**Widersprüche in den Quellen, die Sie klären müssen:**
- **MO** steht im Screenarchiv für „Market Organisation“, in der App und im Ticket-Cockpit für „Market Operation“.
- **Drei Gliederungen** existieren: 23 Kapitel (Gesamtgliederung Ebene 3, 11./12.10.2026, 1 153 Stellen), 50 Kapitel (Handbuch NEU, 30.09.2026), 15 Kapitel (Gesamtausgabe V5, 08.09.2026).
- Die echten Menüpfade sind laut Gliederung (15.6.2 „Offene Bildschirmnachweise“) noch nicht vollständig mit Screenshots belegt.

## 7.3 Daten übernehmen

| ID | Daten | Herkunft | Ziel in der App | Hinweis | Entscheidung |
|---|---|---|---|---|---|
| D-01 | Gliederung: **23 Kapitel** + Übergänge T6-7 … T15-16 + Anhänge A–I (empfohlen) **oder** 50 Kapitel Handbuch NEU **oder** 15 Kapitel V5 | Screenarchiv / Struktur und Klickstrecke | Gliederungs-Labels + Inhaltsverzeichnis (Stammdaten) | beim Ersetzen entstehen neue Codes; in M1 vergebene Labels werden umgehängt | |
| D-02 | Echte Navigation (34 Menüpunkte) mit Rollenzugriff V/L/– je Dealer, Market, MO, HQ | Handbuch-Werkstatt V4, Ticket-Cockpit, Wissenssuche | Navigations-Labels (Gruppe erweitern auf ~34) | Zugriffsstufe siehe F-06 | |
| D-03 | Rollen: Dealer, Dealer+, Markt/MPC, MO, KAM, HQ Admin, HQ Produktmanager, CaM-Team; ALICE-Rollen | V4, Wissenssuche, Überblick | Rollen-Labels | MO-Bedeutung klären | |
| D-04 | Sparten nur Pkw und Van | alle | Truck/Bus-Labels ausblenden | `domain/reference.ts` bleibt unverändert | |
| D-05 | Weitere Labels: Diátaxis, Statusmodell, Systemsteckbrief, Quick Guide, Jira-Ticket, zwei Qualitäts-Labels, Gruppen Domäne, Kundengruppe, Systeme | V4, Checkliste, Wissenssuche, Struktur | Labelkatalog | Katalog wächst über 100 hinaus | |
| D-06 | Terminologie: 61 UI-↔Handbuch-Paare, 17 Status/Aktionen, 11 verbindliche Regeln, 13 Wortregeln, ~75 Fachbegriffe | V4, Screenarchiv, Releaseletter-Prüfer | Terminologie, Stilregeln | | |
| D-07 | Glossar (~38), Abkürzungen (~46), Systemnamen aus Rollout (MPay, NEMESIS, VEGA, TraCS, CFT, GSSN, MBFS …) | Wissenssuche, Market Implementation Plan | Stammdaten Glossar/Abkürzungen | | |
| D-08 | FAQ (~20 aus Kap. 44) als gespeicherte Fragen & Antworten; 20 Fragen Wissens-Check und 41 Fragen Lückenanalyse als Testfragensatz | Wissenssuche, Wissens-Check, Lückenanalyse | oneSCM_Metadaten Fragen & Antworten, M7 | Lückenfragen mit Label „Lücke“ | |
| D-09 | Bilder: 127 Screens mit Unterschriften, 51 Navigations-Screens, 20 Prozessschaubilder, 43 Quick-Guide-PDFs | Wissenssuche, V4, Struktur | Bildverzeichnis / Quellen | **Datenschutzprüfung nötig** (Testdaten mit Namen, GSSN, E-Mails) | |
| D-10 | Quellabschnitte: 3 713 Abschnitte aus RAG-Batches, 168 Vorschläge, 676 Funktionen, Jira-Epic-Liste je Kapitel | Struktur, Wissenssuche, V4 | Quellen → Chunks | Datenschutzprüfung; besser aus den Originaldateien (Knowledge-Ordner) | |

## 7.4 Neue Funktionen

Status gegenüber der App: **neu** = gibt es nicht, **teilweise** = Ansatz vorhanden, **geplant** = in M2–M7 vorgesehen.

### Jira und Releaseletter

| ID | Funktion | Herkunft | Status | Aufwand | Empfehlung | Entscheidung |
|---|---|---|---|---|---|---|
| F-01 | **Jira-Import als Datei** (XML, HTML, DOCX, CSV): Feldparser (Typ, Status, PI, Komponente, Epic, Links, Acceptance Criteria), Ticketreferenz je Kapitel | Ticket-Cockpit, Prüfer, V4, DokuPress | neu | M | übernehmen – lokal, ohne Jira-Anbindung | |
| F-02 | **Releaseletter aus Tickets** (DE/EN, Kurzfassung), feste Guardrails (Datum nur aus „Erstellt“, „PI TBD“, verlinkte Tickets kein Inhalt), 12 Prüfregeln Ticket ↔ Letter, Urteil „freigeben/bedingt/nicht“, Vorlage mit 25 Abschnitten | Generator, Prüfer | neu | L | übernehmen – mit lokalem Modell und vorhandener Belegprüfung statt Dify/OpenAI | |
| F-03 | Release-Abgleich: Ticketliste gegen Bestand (Bug = intern, sonst Handbuch-Kandidat) | Ticket-Cockpit | neu | S | übernehmen (mit F-01) | |

### Datenschutz und Qualität

| ID | Funktion | Herkunft | Status | Aufwand | Empfehlung | Entscheidung |
|---|---|---|---|---|---|---|
| F-04 | **Datenschutz erweitern:** FIN/VIN, Kennzeichen, User-ID, Adresse, PLZ+Ort, Namen aus Metadaten, Pseudonymisierung „Person N“, eigene Namensliste | Ticket-Cockpit, Prüfer | teilweise (nur E-Mail, Telefon, IBAN) | M | übernehmen – wichtig vor D-09/D-10 | |
| F-05 | **Update-Eingang:** geänderte Quelle → Absatz-Diff (ersetzen, ergänzen, löschen) im Posteingang | DokuPress | teilweise | M | übernehmen – größte Lücke laut DokuPress-Audit | |
| F-06 | Zugriffsstufe je Rolle und Menüpunkt (V/L/–) als Matrix | V4 | teilweise | M | übernehmen (mit D-02) | |
| F-07 | Warnhinweis-Schema (Signalwort + Gefahr + Folge + Vermeidung) als Prüfregel, feste Signalwörter je Sprache | Checkliste | neu | S | übernehmen | |
| F-08 | Punktmodell Muss/Soll im Anleitungs-Check | Checkliste | teilweise | S | optional | |
| F-09 | Platzhalter- und Strukturvergleich bei Übersetzungen | Checkliste | teilweise | S | übernehmen | |
| F-10 | Vier Prüferprofile (fachlich, Redaktion, Compliance, Endanwender) mit lokalem Modell | Ticket-Cockpit | teilweise | M | optional | |
| F-11 | Lokale Grammatikprüfung (LanguageTool, selbst betrieben) | DokuPress-Konzept | neu | M | optional | |
| F-12 | Synonyme mit fester Übersetzung; Begriffskandidaten aus Tickets | Ticket-Cockpit | teilweise | S | übernehmen (mit D-06) | |

### oneSCM_Metadaten und Wissen

| ID | Funktion | Herkunft | Status | Aufwand | Empfehlung | Entscheidung |
|---|---|---|---|---|---|---|
| F-13 | Automatischer Gliederungs-Vorschlag je Chunk mit Trefferwert (nie automatisch bestätigt) | Struktur und Klickstrecke | geplant (Label-Agent) | M | übernehmen in M3 | |
| F-14 | Handbuch ↔ Quellen zweispaltig je Kapitel | V4, Wissenssuche | geplant (M3) | S | in M3 | |
| F-15 | Wissensnotizen (Frage, Erkenntnis, Screenshot) als eigene Quelle | Wissenssuche | neu | M | übernehmen | |
| F-16 | Expertenbefragung zu Wissenslücken (Optionen + Freitext → Antwort mit Label „Prüfen“) | Wissens-Check | teilweise | M | optional | |
| F-17 | Ausschlussliste „nicht einlesen“ für den Eingangsordner | Wissenssuche | neu | S | übernehmen in M2 | |
| F-18 | Zielkapitel je Dopplung („zusammenführen in Kapitel X“) | V4 | teilweise | S | übernehmen in M4 | |
| F-19 | Textbausteine (Single Sourcing) für wiederkehrende Absätze | V4 | teilweise | L | später | |

### Bilder und Ausgabe

| ID | Funktion | Herkunft | Status | Aufwand | Empfehlung | Entscheidung |
|---|---|---|---|---|---|---|
| F-20 | Labels für Bilder (Sprache, Rolle, Sparte, Markt, Version, Reiter) + Bildprüfregeln + Bildabdeckung je Kapitel | Screenarchiv | teilweise | M | übernehmen | |
| F-21 | Bildversionen: Original bleibt, neue Fassung ersetzt das Bild überall; Platzhalterbild mit reservierter Nummer | Screenarchiv, DokuPress | teilweise | M | übernehmen | |
| F-22 | Varianten einer Maske verknüpfen (Sprache/Rolle/Sparte/Markt) | Screenarchiv | neu | M | optional | |
| F-23 | Screenshot aus der Zwischenablage einfügen mit Zuschnitt | Screenarchiv | teilweise | S | übernehmen | |
| F-24 | Klickstrecke aus Screenshots (parallele Schritte 3a/3b) | Screenarchiv | teilweise | M | optional | |
| F-25 | Bild → Gliederungsstelle über den Folientext beim PPTX-Import | Screenarchiv | geplant (M2) | S | in M2 | |
| F-26 | Video → Einzelbilder mit Änderungserkennung und roten Rahmen, lokal | Screenarchiv, Screenshot-Studio | neu | M | übernommen in Etappe 38 (ADR-090, ffmpeg lokal) | |
| F-27 | Ausgabe „Quick Guide“ und „One Pager“ je Variante | Struktur, Screenarchiv | teilweise | M | übernehmen | |
| F-28 | Lesefassung ohne Quellenbezüge; Wasserzeichen „Entwurf“ im Druck | V4, DokuPress | teilweise | S | übernehmen | |
| F-29 | Klickstrecke/Übergangskapitel im Lesen („weiter zu Kapitel …“) | Struktur und Klickstrecke | neu | S | übernehmen | |
| F-30 | Deckungsmatrix Stelle × Sprache/Rolle/Sparte | Screenarchiv | teilweise | M | optional | |
| F-31 | Translation Memory | DokuPress-Audit | neu | L | später | |

## 7.5 Nicht übernehmen

Ticket-Graph, Trend/Burndown, Prozessbild- und Klickanleitungs-Designs des Cockpits, n8n- und Dify-Setup, Bildarchiv vorher/nachher, Publikationskalender, Review-Studio, Report-Studio, Vertragsübersicht, Fotoarchiv – und **alle erfundenen Beispieldaten** (Screens im Screenarchiv, DokuPress-Projekt „Handbuch oneSCM“ der „Muster Supply Chain GmbH“).

## 7.6 Externe Dienste und „Daten bleiben lokal“

| Dienst | in | vereinbar? | Vorschlag |
|---|---|---|---|
| Jira Software Cloud | Prüfer, Cockpit | nein | nur Datei-Import (F-01), außer es gibt ein intern betriebenes Jira |
| Dify (`api.dify.ai`), OpenAI gpt-4o | Generator, Prüfer | nein | Logik in die App, lokales Modell (M-02) |
| Claude (`sample`) | Cockpit, Screenarchiv, Screenshot-Studio | nein | lokales Modell |
| n8n | Prüfer | nur intern | nicht nötig (Webhooks/API-Tokens, ADR-028) |
| Tesseract (Sprachdaten per CDN) | Cockpit | nur mit lokal abgelegten Daten | umgesetzt in Etappe 38: Tesseract lokal über `OCR_CMD` (ADR-090) |
| **Confluence Cloud** | **bereits in der App** (ADR-028) | nein | klären, ob abschalten oder nur für bestimmte Projekte |

## 7.7 Fragen an den Auftraggeber

1. Welche Gliederung gilt (D-01)? Empfehlung: 23 Kapitel vom 11./12.10.2026.
2. MO = Market Operation oder Market Organisation?
3. Nur Pkw und Van – Truck und Bus ausblenden?
4. Darf der Labelkatalog über 100 Labels wachsen (neue Gruppen Domäne, Kundengruppe, Systeme)?
5. Gibt es ein intern betriebenes Jira (Data Center) oder nur Datei-Exporte?
6. Soll die vorhandene Confluence-Cloud-Anbindung bleiben?
7. Welche Funktionen F-01 … F-31 und Daten D-01 … D-10 sollen umgesetzt werden, in welcher Reihenfolge?
