# oneSCM Handbook Studio

Revisionssichere Webapp, die aus vielen Markdown-Texten ein konsistentes, rollen- und spartenspezifisches oneSCM-Benutzerhandbuch erzeugt.
Grundlage ist das Projektpaket in [`reference/`](reference/) (Masterprompt v1.0 und Referenz-UI).

> **Status: Etappe 65 (v0.65.0).** Alle P0-, P1- und P2-Stories (US-001 … US-020) sind umgesetzt, dazu die KI-Umformulierung mit Quellenbindung je Satz (E-16, ADR-013) – auch für ganze Kapitel –, mehrere Projekte (ADR-014), Betriebsfunktionen (ADR-015), Barrierefreiheit nach WCAG 2.2 AA (ADR-016), semantische Suche (ADR-017), Handbuch-Releases mit Online-Hilfe (ADR-018), Kollaboration (ADR-019), Mehrsprachigkeit (ADR-020) samt mehrsprachiger Releases (ADR-021), Import aus Confluence, Word und Git (ADR-022), Analytik und Berichte (ADR-023) ein skalierbarer Vektorindex mit HNSW bzw. pgvector (ADR-024), mehrstufige Freigabe (ADR-025), ein Handbuch-Assistent mit Quellen je Satz (ADR-026), Kubernetes-Betrieb mit Helm-Chart, OpenTelemetry und verteilten Rate-Limits (ADR-027), Integrationen mit API-Tokens, signierten Webhooks und Confluence Cloud (ADR-028), Bilder mit Pflicht-Alternativtext (ADR-029), Kontexthilfe für oneSCM mit einbettbarem Widget (ADR-030) eine Release-Pipeline mit signiertem Container-Image und SBOM (ADR-031) sowie Stammdaten mit Gliederungen je Variante (ADR-032) und ein Draft Manual mit farblicher Kennzeichnung von Dopplungen, Lücken, Widersprüchen und Warnungen (ADR-033), aus dem Handbuch-Varianten mit Freigabe, Export und Online-Hilfe samt Verzeichnissen entstehen (ADR-034), dazu Drag & Drop, Gliederungsvergleich, globale Suche und Dunkelmodus (ADR-035) sowie Pflegefunktionen: entfernte Quelldateien, bereinigtes SVG, Stammdaten-Import aus CSV/Excel und Planungserinnerungen (ADR-036); Varianten lassen sich mit dem Blueprint abgleichen (ADR-037), Handbücher erscheinen im Firmen-Layout und als Word-Dokument (ADR-038), und die Suche nutzt einen Volltextindex (ADR-039); unter „Schreibstil“ werden Texte geprüft, gelb markiert und umformuliert (ADR-040), unter „Bilder“ entstehen aus Textstellen ASCII-Bilder, Klickstrecken, Prozessbilder und Infografiken (ADR-041) – mit PNG-Fassung für Word, direkt aus der Werkstatt, nachbearbeitbar und als Vorlage, dazu markierte Screenshots (ADR-042); der Schreibstil ist in die Werkstatt und das Dashboard integriert (ADR-043), mit eigenen Stilregeln je Projekt und KI-Stapelumformulierung (ADR-044); dazu eine Benutzerverwaltung (ADR-045) und ein Screenshot-Editor mit Pfeilen, Textfeldern und Unschärfe (ADR-046); Rollenvorlagen und der Austausch von Stilregeln (ADR-047), ein Stilwert-Verlauf (ADR-048) sowie Zuschneiden, Lupe und Verschieben im Screenshot-Editor (ADR-049); für leserfreundliche Handbücher und leichte Bedienung gibt es Stilregel-Bibliotheken (ADR-050), einen Anleitungs-Check je Kapitel (ADR-051), einen Kapitel-Assistenten (ADR-052) sowie eine Startseite mit Menü nach Arbeitsablauf (ADR-053); dazu eine Leseransicht mit Rückmeldungen (ADR-054), Kapitelvorlagen (ADR-055), eine Einführung beim ersten Start (ADR-056) und der Anleitungs-Check vor der Freigabe (ADR-057); Rückmeldungen lassen sich auswerten (ADR-058), eigene Kapitelvorlagen anlegen (ADR-059), das Handbuch drucken (ADR-060) und Rückmeldungen auch aus der Online-Hilfe sammeln (ADR-061); Vorlagen sind vollständig bearbeitbar (ADR-062), der Druck hat ein Deckblatt mit Seitenzahlen (ADR-063), und die Redaktion erhält eine wöchentliche Übersicht (ADR-064); gedruckt wird auch je Variante oder Rolle im Firmen-Layout (ADR-065), Leser suchen im Handbuch und sehen Fachbegriffe erklärt (ADR-066), und Vorlagen lassen sich kopieren und zwischen Projekten austauschen (ADR-067); die Oberfläche lädt dank Code-Splitting, Vorkomprimierung und Caching deutlich schneller (ADR-068); unter jedem Kapitel stehen verwandte Kapitel und passende häufige Fragen (ADR-069), und Leser merken sich Kapitel und sehen, was neu oder geändert ist (ADR-070). Neu ist der Bereich **oneSCM_Metadaten** mit vordefinierten Labels nach dem echten oneSCM (ADR-080), einer Zuordnung Domäne → Gliederungspunkt → Ordner (ADR-082), Releaselettern aus Jira-Tickets (ADR-083), Gliederungs-Vorschlägen und Wissensnotizen (ADR-084), einem Bildarchiv mit Versionen sowie Quick Guide, One Pager und Lesefassung (ADR-085), dem Einlesen von PowerPoint und PDF mit Fundstelle je Folie bzw. Seite (ADR-086), Quellen je Überschrift mit Teilstücken langer Chunks (ADR-087), Dubletten über alle Formate (ADR-088), Fragen an alle Quellen mit Belegen (ADR-089), Video, Untertiteln und Texterkennung mit lokalen Werkzeugen (ADR-090), messbarer Antwortqualität (ADR-091), einem Punktmodell Muss/Soll, einer Expertenbefragung zu Wissenslücken und einer Deckungsmatrix der Bilder (ADR-092), Varianten einer Maske und Klickstrecken aus Screenshots (ADR-093), unkenntlich gemachten personenbezogenen Daten in Bildern und mehreren Labels und Kapiteln je Bild (ADR-095), Kapitelanweisungen, Version und Historie abgelöster Funktionen (ADR-096), Hausregeln, Englischprüfung und Lesbarkeit (ADR-097), Pipeline, Backlog und Intern für kommende Funktionen und interne Themen (ADR-098), einer gemessen besseren Suche für Fragen an alle Quellen (ADR-099), dem Agenten TRIAGE mit Pflichtlabels und Kapitelzuordnung nach dem Einlesen, Detaillevel je Kapitel, einem Inhalts-Dashboard und Agenten in der App mit ORCHESTRATOR und GOAL (ADR-100), Übersetzung mit Übersetzungsspeicher, Länderreview, XLIFF für Übersetzungsbüros und den Sprachen de-CH und fr-CH (ADR-101), Tonalität je Produktart und Rolle, Ticket-Einstufung, Releaseletter aus dem Projektvergleich und Zukunfts-Inhalten (ADR-102), einer Kapitelbewertung mit Ampel, Plausibilität je Aussage und einer Fehlerliste in der App (ADR-103), Änderungsvorschlägen aus Word und KI-Lektorat mit Wortvergleich und internen Kommentaren (ADR-104), Textvarianten je Kapitel und vier Prüferprofilen (ADR-105), Vorher/Nachher-Belegen, Ausgabe als PowerPoint, Klickstrecken als BPMN und Zwischenbildern aus Videos (ADR-106), Textbausteinen für wiederkehrende Absätze (ADR-107), lokaler Grammatikprüfung mit LanguageTool und Ansprechpersonen je Markt für das Länderreview (ADR-108), zuschaltbaren Regelsätzen (Regelbasiertes Schreiben, Simplified Technical English, Vale-Stile) und Benachrichtigungen zum Länderreview (ADR-109), UI-Begriffen wie „MO Checks“ in der Terminologie (ADR-110), Designvorlagen für Quick Reference Guide und Handbuch-Kapitel (ADR-112) – auf Wunsch direkt als PDF (ADR-113) oder Word-Dokument (ADR-115) bzw. als PowerPoint (ADR-116) und in eigenen Farben, Schriften und mit eigener Logo-Position (ADR-114) –, einem Lesestil „Handbuch-Kapitel“ für Leseransicht, Druck und Online-Hilfe (ADR-117), Chunks je Überschrift und gespeicherten Fragen und Antworten (ADR-079, Plan in [docs/06](docs/06-plan-onescm-metadaten.md)). Die P0-Entscheidungen wurden am 24.09.2026 festgelegt ([docs/04-offene-entscheidungen.md](docs/04-offene-entscheidungen.md)); im Code sind sie mit `ENTSCHEIDUNG(E-xx)` markiert. Für den Produktivbetrieb gibt es PostgreSQL, eine OIDC-Anmeldung und eine persistente Jobqueue.

## Dokumentation

| Dokument | Inhalt |
|---|---|
| [docs/01-gap-analyse.md](docs/01-gap-analyse.md) | Gap-Analyse Soll/Ist, Lücken im Auftrag, Risiken |
| [docs/11-rag-messung.md](docs/11-rag-messung.md) | RAG-Komponente: Test, recherchierte Methoden, Messung v1/v2 |
| [docs/02-p0-reihenfolge.md](docs/02-p0-reihenfolge.md) | priorisierte P0-Reihenfolge und Etappenplan |
| [docs/03-repository-struktur.md](docs/03-repository-struktur.md) | Repository-Struktur |
| [docs/04-offene-entscheidungen.md](docs/04-offene-entscheidungen.md) | Widersprüche im Auftrag und P0-Entscheidungen samt vorläufiger Annahme |
| [docs/05-datenmodell.md](docs/05-datenmodell.md) | Datenmodell und zentrale Regeln |
| [docs/06-plan-onescm-metadaten.md](docs/06-plan-onescm-metadaten.md) | Plan oneSCM_Metadaten: RAG über DOCX, PPTX, HTML, PDF, MP4 (Entwurf, offene Entscheidungen M-01 … M-10) |
| [docs/07-bestehende-artefakte.md](docs/07-bestehende-artefakte.md) | Entscheidungsvorlage: Funktionen und Daten aus bestehenden Artefakten (Handbuch, oneSCM, Releaseletter) |
| [docs/08-installation-betrieb.md](docs/08-installation-betrieb.md) | **Installation und Betrieb:** Windows-Paket (offline), universelles Paket, Container, Einstellungen, Sicherung, Fehlerbehebung |
| [docs/09-benutzerdokumentation.md](docs/09-benutzerdokumentation.md) | **Benutzerdokumentation:** alle Menüpunkte, Arbeitsabläufe, Datenschutz |
| [docs/10-offene-funktionen.md](docs/10-offene-funktionen.md) | **Offene Funktionen:** Abgleich mit den oneSCM-Artefakten (Stand v0.43) – Grammatik, Sprachstil, Übersetzung und Weiteres, mit Aufwand, Empfehlung und Vorschlag für die nächsten Etappen |
| [docs/adr/](docs/adr/README.md) | Architecture Decision Records |
| [docs/traceability.md](docs/traceability.md) | Traceability-Matrix (generiert) |
| [docs/lasttest-semantik.md](docs/lasttest-semantik.md) | Lasttest der semantischen Suche mit 50 000 Textabschnitten |
| [docs/lasttest-metadaten.md](docs/lasttest-metadaten.md) | Lasttest oneSCM_Metadaten und Gesamtanwendung mit 12 000 und 48 000 Textabschnitten |
| [openapi/openapi.yaml](openapi/openapi.yaml) | OpenAPI 3.1.1, Basispfad `/api/v1` |

## Schnellstart

**Ohne Entwicklungsumgebung:** Installationspaket bauen mit `tools/paket/paket.sh <Zielordner> --windows node-v22.x.y-win-x64.zip` – das Windows-Paket startet per Doppelklick auf `start.cmd` ohne Installation und ohne Internet ([docs/08](docs/08-installation-betrieb.md)).

Voraussetzung: Node.js 20 oder 22.

```bash
npm install
npm run build          # Web-UI und Server bauen
npm run demo:seed      # fiktive Demo-Quellen importieren und analysieren (./data)
npm start              # http://localhost:3000
```

Entwicklung mit Hot Reload: `npm run dev` (API auf :3000, UI auf http://localhost:5173 mit Proxy).

Mit Docker (App + PostgreSQL):

```bash
POSTGRES_PASSWORD=… docker compose up --build      # http://localhost:3000
```

### Anmeldung

**Demo-Modus** (Standard, `AUTH_MODE=demo`): In der Seitenleiste wählen Sie einen **Demo-Benutzer**. Nur für Entwicklung und Vorführung. Technische Berechtigungen sind von fachlichen Rollen getrennt (ADR-009):

| Demo-Benutzer | Berechtigungen |
|---|---|
| Redaktion | read, edit |
| Fachprüfung | read, edit, decide |
| Freigabe | read, decide, approve |
| Administration | alle |
| Lesezugriff | read |

**OIDC-Modus** (`AUTH_MODE=oidc`, Produktion, ADR-011): Die UI meldet über den OpenID-Connect-Provider an (Authorization Code + PKCE), die API prüft das Bearer-Token. Beim Provider benötigen Sie:
1. einen **öffentlichen Client** (z. B. `onescm-web`) mit Redirect-URI `https://<app>/` und Post-Logout-URI `https://<app>/`;
2. ein Access-Token mit der Zielgruppe `OIDC_AUDIENCE` (Pflicht – Tokens für andere Anwendungen desselben Providers werden abgelehnt) und einem Claim mit den Gruppen/Rollen des Benutzers;
3. die Gruppen `onescm-reader`, `onescm-editor`, `onescm-reviewer`, `onescm-approver`, `onescm-admin` (oder eine eigene Zuordnung über `OIDC_PERMISSION_MAP`).

## Arbeitsablauf in der App

0. **Projekt wählen** (Seitenleiste): Jedes Projekt ist ein eigenes Handbuch mit eigenen Quellen, Befunden, Kapiteln, Freigaben und Audit. Projekte und Mitglieder verwaltet die Administration unter **Projekte** (ADR-014).
1. **Quellen:** ZIP-, Markdown-, HTML- (Confluence-Export) oder Word-Datei importieren oder ein **Git-Repository verbinden**, das automatisch abgeglichen wird (ADR-022). Textabschnitte suchen und filtern – auch **semantisch** (ähnliche Aussagen bei anderer Formulierung, ADR-017) –, Rollen/Sparten/Markt/Release bestätigen.
2. **Dashboard → Analyse starten:** erzeugt Cluster, Dopplungen, Widersprüche, Lücken sowie Datenschutz-, Terminologie- und Lesbarkeitsbefunde.
3. **Widersprüche / Dopplungen / Textcluster:** Befunde mit Begründung entscheiden und Canonical Topics festlegen. Offene Blocker sperren Generierung, Freigabe und Export.
4. **Kapitelgenerator:** Entwurf ausschließlich aus bestätigten Quellen erzeugen (`source_confirmed` / `manually_confirmed`).
5. **Kapitelwerkstatt:** Absätze bearbeiten, verschieben, löschen, sperren, klassifizieren, kommentieren, einzelne Absatzversionen wiederherstellen. **Versionen vergleichen** zeigt die Unterschiede zweier ganzer Kapitelversionen. Mit eingerichtetem KI-Dienst (`LLM_PROVIDER`) liefert **✨ KI-Vorschlag** eine Umformulierung, in der jeder Satz seine Quellen nennt; nur geprüfte Vorschläge lassen sich übernehmen (ADR-013). **✨ Kapitel umformulieren** fordert Vorschläge für alle geeigneten Absätze im Hintergrund an; die Sammelprüfung zeigt sie gemeinsam, gültige lassen sich einzeln oder gesammelt übernehmen. Nutzung und Tokens stehen unter **Einstellungen**.
6. **Evidenz:** je Absatz prüfen, auf welcher Quelle er beruht und ob sie aktuell und bestätigt ist.
7. **Freigabe:** Redaktion reicht ein (Qualitätsgate muss bestanden sein), die Freigabe entscheidet: freigeben oder ablehnen. Optional mehrere Stufen mit Zuständigen, Mindestanzahl, Frist und Vier-Augen-Prinzip (ADR-025); „Meine offenen Entscheidungen“ zeigt, was ansteht. Alles wird protokolliert.
8. **Export / Rollen- und Spartenansichten:** gefiltert als Markdown, HTML, PDF oder JSON. Enthalten sind allgemeine Inhalte plus die passenden spezifischen.
9. **Terminologie / Optimierungen:** Begriffe pflegen; Kennzahlen und priorisierte Empfehlungen je Kapitel.
10. **Traceability:** Matrix als Excel, CSV oder Markdown.
11. **Diskussion & Aufgaben (ADR-019):** In der Kapitelwerkstatt (Tab „Diskussion“) Absätze kommentieren, Personen mit `@kennung` erwähnen, Aufgaben mit Frist zuweisen; Hinweise unter **Aufgaben & Hinweise**, optional per Webhook und E-Mail.
12. **Übersetzungen (ADR-020):** Freigegebene Kapitel in die Zielsprachen des Projekts übersetzen (KI mit Satz-Zuordnung oder manuell), prüfen, je Sprache freigeben und exportieren.
13. **Veröffentlichung (ADR-018, ADR-021):** Den Stand aller freigegebenen Kapitel als Handbuch-Version veröffentlichen – mit Änderungsliste zur Vorversion und statischer Online-Hilfe (ZIP), inklusive freigegebener Übersetzungen mit Sprachumschalter.
14. **Analytik (ADR-023):** Kennzahlen im Zeitverlauf, Freigabedauer und Erstfreigabequote, Projektbericht als PDF, Export für BI-Werkzeuge (CSV/JSON).
15. **Assistent (ADR-026):** Fragen an das freigegebene Handbuch – Antworten mit Quellen je Satz, gefiltert nach Sprache, Rolle und Sparte; Wissenslücken für die Redaktion.
16. **Kontexthilfe (ADR-030):** Kontext-IDs aus oneSCM (z. B. `order.create`) Kapiteln zuordnen; Aufruf per API, Deep-Link `/hilfe/<id>` oder eingebettetem Hilfe-Widget mit Assistent.
17. **Integrationen (ADR-028):** API-Tokens für Maschinen, Webhooks zu Ereignissen des Projekts mit Zustellprotokoll.
18. **Stammdaten (ADR-032, unten in der Navigation):** **Inhaltsverzeichnis** – Gliederungen je Rolle, Sparte und Blueprint oder Märkten anlegen (leer, aus der Kapitelstruktur, per Upload `.md`/`.json`), bearbeiten, erweitern, als Version speichern, exportieren; **Abkürzungen**, **Glossar**, **Bildverzeichnis**, **FAQ** (mit Vorschlägen aus dem Assistenten) und **Planung** (Verantwortliche, Termin, Status je Kapitel). Die Navigation lässt sich mit « / » einklappen.
19. **Draft Manual (ADR-033):** Gliederung wählen, Textschnipsel automatisch, manuell oder per Drag & Drop Kapiteln/Unterkapiteln zuordnen; 🔴 Widersprüche, 🟠 Dopplungen, 🟡 Warnungen und 🟣 Lücken sind farblich und mit Text gekennzeichnet; Export als Markdown.
20. **Handbuch der Variante (ADR-034):** Im Draft Manual „Kapitel für Freigabe erzeugen“ – die Kapitel erscheinen in der Werkstatt unter „Variante: …“, werden geprüft und freigegeben. Unter **Export** bzw. **Veröffentlichung** das Handbuch wählen: Ausgabe gefiltert nach der Variante, mit Abkürzungsverzeichnis, Glossar, Bildverzeichnis und FAQ.
21. **Suche und Darstellung (ADR-035):** Suchfeld oben in der Navigation (Taste „/“) findet Kapitel, Texte, Schnipsel, Quellen, Gliederungen und Stammdaten; unter „Darstellung“ Hell, Dunkel oder wie System. Gliederungsversionen lassen sich vergleichen.
22. **Pflege (ADR-036):** ZIP als „vollständigen Stand“ importieren markiert fehlende Dateien als entfernt (wiederherstellbar); Abkürzungen, Glossar und FAQ lassen sich aus CSV/Excel importieren (mit Vorschau); SVG-Grafiken werden bereinigt übernommen; überfällige Planung wird stündlich im Posteingang erinnert.
23. **Varianten abgleichen (ADR-037):** Im Draft Manual „Mit anderer Gliederung abgleichen“ – neue Inhalte und Kapitel aus dem Blueprint gezielt in eine Markt- oder Rollenvariante übernehmen.
24. **Layout und Word (ADR-038):** Unter Einstellungen › Layout Firmenname, Hausfarbe, Logo, Titelseite, Kopf-/Fußzeile und eine Word-Vorlage festlegen; unter Export das Format „Word (.docx)“ wählen.
25. **Schreibstil (ADR-040):** Text einfügen oder ein Kapitel bzw. Textschnipsel wählen, „Prüfen“ – gelb markierte Sätze anklicken und korrigieren, „Automatisch korrigieren“, „Professionell umformulieren“ oder „In Präsens umwandeln“; Kapitelabsätze im Entwurf direkt speichern.
26. **Bilder (ADR-041):** Textstelle einfügen, Bildarten wählen, „Bilder erzeugen“ – Struktur bei Bedarf bearbeiten, Bilder auswählen, Alternativtext prüfen und „Ausgewählte speichern“; das Markdown in einen Absatz einfügen.
27. **Bilder in der Werkstatt (ADR-042):** Am Absatz „🎨 Bild erzeugen“ – Diagramm auswählen, speichern, es wird angehängt und erscheint auch im Word-Export. Unter „Bilder“ die Struktur und Darstellung nachbearbeiten, als Vorlage speichern oder im Tab „Screenshot markieren“ Klickpunkte einzeichnen.
28. **Schreibstil in der Werkstatt (ADR-043):** „🖋️ Stil anzeigen“ markiert Sätze gelb (anklicken zum Korrigieren), „🖋️ Stil korrigieren“ korrigiert das ganze Kapitel mit Vorschau; das Dashboard zeigt den Stilwert je Kapitel.
29. **Stilregeln (ADR-044):** Unter Schreibstil › Regeln eigene Formulierungen, Anrede, Satzlänge und aktive Prüfungen festlegen (Administration). In der Werkstatt unter „Stil korrigieren“ das Kapitel per KI umformulieren lassen.
30. **Benutzer (ADR-045):** Unter „Benutzer“ Benutzer anlegen, Berechtigungen und Projektzugriffe vergeben oder Benutzer sperren.
31. **Rollenvorlagen und Regel-Austausch (ADR-047):** Unter „Benutzer“ Rollenvorlagen pflegen und beim Anlegen wählen; unter Schreibstil › Regeln › Austauschen als CSV/JSON exportieren, importieren oder aus einem anderen Projekt übernehmen.
32. **Stilwert-Verlauf (ADR-048):** Das Dashboard (unter „Weitere“) zeigt den Verlauf des Stilwerts und die Veränderung je Kapitel.
33. **Start (ADR-053):** Die Startseite fragt „Was möchten Sie tun?“ und zeigt den Weg zum fertigen Handbuch mit dem nächsten Schritt; das Menü folgt dem Ablauf Sammeln → Schreiben → Prüfen → Veröffentlichen.
34. **Kapitel-Assistent (ADR-052):** Unter „2 Schreiben › Kapitel-Assistent“ ein Kapitel in vier Schritten schreiben – Vorschläge aus den Quellen per Klick übernehmen.
35. **Anleitungs-Check (ADR-051):** Unter „3 Prüfen › Anleitungs-Check“ (oder „🔍 Anleitungs-Check“ in der Werkstatt) sehen, ob ein Kapitel leicht zu befolgen ist, und Korrekturen per Klick übernehmen.
36. **Stilregel-Bibliotheken (ADR-050):** Unter Schreibstil › Regeln gemeinsame Regeln für mehrere Handbücher anlegen und abonnieren.
37. **Leseransicht (ADR-054):** Unter „4 Veröffentlichen › Leseransicht“ das Handbuch wie ein Leser lesen, Schritte abhaken und „War dieses Kapitel hilfreich?“ beantworten; die Redaktion sieht Rückmeldungen im Anleitungs-Check.
38. **Vorlagen (ADR-055):** Im Kapitel-Assistenten eine Vorlage wählen (z. B. „Datensatz anlegen“) und die „…“ ausfüllen.
39. **Einführung (ADR-056):** Beim ersten Start erklärt eine kurze Tour die Oberfläche; „Einführung“ im Benutzerbereich startet sie erneut.
40. **Check vor der Freigabe (ADR-057):** Die Freigabe zeigt den Anleitungs-Check; unter „Anleitungs-Check“ lässt sich ein Mindestwert für Einreichen und Freigabe festlegen.
41. **Rückmeldungen (ADR-058):** Unter „3 Prüfen › Rückmeldungen“ sehen, welche Kapitel Lesern nicht helfen und was sie vermissen; aus einer Rückmeldung eine Aufgabe erstellen.
42. **Eigene Vorlagen (ADR-059):** In der Werkstatt „💾 Als Vorlage“ – im Kapitel-Assistenten wählbar, dort umbenennen oder löschen.
43. **Drucken (ADR-060):** In der Leseransicht ein Kapitel oder das ganze Handbuch drucken bzw. als PDF speichern.
44. **Online-Hilfe (ADR-061):** Die eingebettete Hilfe fragt „War das hilfreich?“ – anonym, mit Schutz vor Missbrauch (`HELP_FEEDBACK_MAX`, Standard 10 je Stunde und Adresse).
45. **Vorlagen bearbeiten (ADR-062):** Im Kapitel-Assistenten unter „Eigene Vorlagen“ auf „✏️ Bearbeiten“ – alle Teile, eine Zeile je Schritt.
46. **Deckblatt (ADR-063):** „Ganzes Handbuch drucken“ beginnt mit einem Deckblatt (Version oder Arbeitsstand, Datum); jede Seite trägt „Seite X von Y“.
47. **Wochenübersicht (ADR-064):** Unter „Rückmeldungen“ den Wochentag wählen (Standard Montag), die eigene Übersicht ansehen oder sie „Jetzt senden“.
48. **Drucken je Variante/Rolle (ADR-065):** In „Handbuch drucken“ eine Variante und/oder Rolle wählen; Logo, Firma und Hausfarbe kommen aus dem Firmen-Layout, am Ende steht ein Glossar.
49. **Suchen und Begriffe (ADR-066):** In der Leseransicht „Im Handbuch suchen“ – Treffer sind im Kapitel gelb markiert; gepunktet unterstrichene Begriffe erklären sich per Klick (aus Terminologie und Abkürzungen).
50. **Vorlagen teilen (ADR-067):** Im Kapitel-Assistenten Vorlagen kopieren, duplizieren, exportieren („📤“) und in einem anderen Projekt importieren („📥“).
51. **Siehe auch & FAQ (ADR-069):** Unter jedem Kapitel verwandte Kapitel und passende häufige Fragen; „Verweise bearbeiten“ fügt Kapitel hinzu oder blendet Vorschläge aus; alle Fragen unter „❓ Häufige Fragen“.
52. **Lesezeichen (ADR-070):** „☆ Merken“ im Kapitel; Lesezeichen, zuletzt gelesene und neue bzw. geänderte Kapitel stehen oben im Inhaltsverzeichnis.
53. **Sprachen beim Lesen (ADR-071):** Oben im Inhaltsverzeichnis „Sprache“ wählen – Kapitel erscheinen in der freigegebenen Übersetzung, sonst deutsch mit Hinweis. Begriffe fürs Glossar übersetzen Sie unter „Terminologie“ → „Bearbeiten“.
54. **Siehe auch im Druck und in der Online-Hilfe (ADR-072):** Das gedruckte Handbuch verweist mit Kapitelnummern und hat einen Anhang „Häufige Fragen“; die Online-Hilfe verlinkt verwandte Hilfethemen.
55. **Notizen zu Lesezeichen (ADR-073):** „Alle Lesezeichen und Notizen“ öffnet die Liste – Notiz eintragen, filtern, als CSV speichern.
56. **Leseransicht in der Lesesprache (ADR-074):** Mit der gewählten Sprache erscheinen auch Beschriftungen, Hinweise und das gedruckte Deckblatt in dieser Sprache.
57. **Übersetzung anfordern (ADR-075):** Leser klicken bei „noch nicht übersetzt“ auf „Übersetzung anfordern“; die Redaktion sieht unter „Übersetzungen“ die meistgewünschten Kapitel und legt die Übersetzung mit einem Klick an.
58. **Notiz im Kapitel (ADR-076):** „📝 Notiz hinzufügen“ unter dem Kapiteltitel – ohne Umweg über die Lesezeichen-Seite.
59. **Häufige Fragen übersetzen (ADR-077):** Stammdaten › FAQ → Eintrag aufklappen → „Übersetzen“ oder „✨ KI-Vorschlag“, dann „Freigeben“. Ändert sich die deutsche Frage, zeigt ⚠ die veraltete Übersetzung.
60. **Neun Sprachen (ADR-078):** Leseransicht, Druck und Online-Hilfe sprechen jetzt auch Niederländisch, Polnisch, Tschechisch und Portugiesisch.
61. **oneSCM_Metadaten (ADR-079, ADR-080):** Oben in der Navigation › „Übersicht“ zeigt Quelldateien und Chunks je Format; unter „Chunks“ je Überschrift lesen, filtern und mit den vordefinierten Labels versehen (einzeln oder „Alle auf dieser Seite auswählen“); unter „Fragen & Antworten“ Frage, Antwort, Quell-Chunks und Labels speichern; unter „Labels“ den Katalog auf Deutsch oder Englisch ansehen und (Administration) pflegen. Dateien liest weiterhin „Quellen“ ein.
62. **Datenschutz (ADR-080):** Die Prüfung meldet auch Fahrgestellnummern, Kennzeichen, Benutzerkennungen, Adressen und Namen hinter Feldern wie „Assignee:“; weitere Namen unter Einstellungen › Datenschutz: Namensliste. `POST /api/v1/privacy/check` liefert Treffer und einen pseudonymisierten Text.
63. **Jira, Quellenänderungen, Zugriffsmatrix (ADR-081):** Unter „Quellen“ Jira-Exporte (XML/CSV) hochladen – je Ticket eine Quelle unter `jira/`, ohne Personenfelder. Unter „1 Sammeln › Quellenänderungen“ geänderte Quellen absatzweise übernehmen. Unter „oneSCM_Metadaten › Zugriffsmatrix“ je Rolle und Menüpunkt V/L/– mit Beleg pflegen oder aus CSV übernehmen.
64. **Zuordnung (ADR-082):** Unter „oneSCM_Metadaten › Zuordnung“ sehen Sie je Fachdomäne die Gliederungspunkte mit Ordner und Unterordnern im Arbeitsordner sowie die Menüpunkte; Zuordnungen übernehmen, lösen oder ergänzen und als CSV exportieren.
65. **Releaseletter und Release-Abgleich (ADR-083):** Unter „4 Veröffentlichen › Release-Abgleich“ sehen Sie die Jira-Tickets je Release – Handbuch-Kandidat oder intern, Kapitelbezug, Änderungen. Unter „Releaseletter“ erzeugen Sie einen Letter aus den Tickets oder fügen einen vorhandenen ein; beide werden gegen die Tickets geprüft und erst nach dem Urteil freigegeben. Der Anleitungs-Check prüft Warnhinweise nach Schema, die Übersetzungsprüfung Platzhalter, Struktur und feste Begriffsübersetzungen.
66. **Gliederung und Wissen (ADR-084):** Unter „oneSCM_Metadaten › Chunks“ schlägt die App je Chunk einen Punkt der Gesamtgliederung vor – übernommen wird nur von Hand. „Kapitel ↔ Quellen“ zeigt je Gliederungspunkt Handbuch und Quellen nebeneinander. „Wissensnotizen“ werden mit Screenshot zur eigenen Quelle. Unter „Dopplungen“ wählen Sie das Zielkapitel, unter „Einstellungen“ Muster, die nicht eingelesen werden.
67. **Bilder und Ausgabe (ADR-085):** Unter „2 Schreiben › Bildarchiv“ hat jedes Bild eine feste Nummer, Merkmale und Prüfregeln; neue Fassungen (auch per Strg+V aus der Zwischenablage) ersetzen das Bild überall, Platzhalter reservieren die Nummer. Im Export wählen Sie „Quick Guide“, „One Pager“ und die Lesefassung; in der Leseransicht pflegen Sie den Übergang „Weiter mit …“.
68. **PowerPoint und PDF (ADR-086):** Unter „oneSCM_Metadaten › Einlesen“ ziehen Sie mehrere Dateien auf einmal hinein. Jeder Chunk zeigt seine Fundstelle (Folie, Seite oder Abschnitt). Bilder aus Folien bekommen im Bildarchiv einen Vorschlag für die Gliederungsstelle, den Sie von Hand übernehmen.
69. **Quellen je Überschrift (ADR-087):** Unter „oneSCM_Metadaten › Quellen je Überschrift“ sehen Sie je Datei den Überschriftenbaum oder alle Dateien zusammengeführt je Überschrift. Lange Chunks zeigen ihre Teilstücke für Suche und Antworten.
70. **Dubletten über alle Formate (ADR-088):** Unter „oneSCM_Metadaten › Dubletten (alle Formate)“ stehen gleiche und ähnliche Abschnitte aus allen Dateien nebeneinander – mit markierten Unterschieden. Legen Sie die führende Fassung fest oder markieren Sie „kein Duplikat“.
71. **Frage an alle Quellen (ADR-089):** Unter „oneSCM_Metadaten › Fragen & Antworten“ fragen Sie alle eingelesenen Quellen – wahlweise nur ein Format, eine Datei, eine Überschrift oder Chunks mit Label. Jeder Satz der Antwort nennt seinen Beleg. Übernehmen Sie die Antwort, stellen Sie sie später erneut und exportieren Sie die Liste als CSV, Excel oder JSON. Unter „Rückfragen“ lesen Sie einen ganzen Fragenkatalog ein (z. B. aus einem Review-Cockpit) und lassen alle Fragen mit Belegen beantworten.
72. **Video, Untertitel und Texterkennung (ADR-090):** Unter „Einlesen“ lesen Sie Videos (MP4) und Untertitel (VTT, SRT) ein – jeder Chunk nennt seine Zeitmarke. Liegen Untertitel mit gleichem Namen neben dem Video, wird ihr Text verwendet, sonst die lokale Transkription. Standbilder mit sichtbarer Änderung erscheinen mit rot markiertem Bereich; gescannte PDF-Seiten werden per Texterkennung gelesen. Die Werkzeuge richtet der Betrieb ein (`TRANSCRIBE_CMD`, `FFMPEG_PATH`, `OCR_CMD`).
73. **Antwortqualität (ADR-091):** Unter „oneSCM_Metadaten › Antwortqualität“ legen Sie Testfragen mit erwarteten Quellen und Stichworten an – aus CSV, Excel, JSON oder gespeicherten Fragen & Antworten. Ein Prüflauf zeigt, wie oft die richtige Quelle gefunden und als Beleg genannt wird (Trefferquote, MRR) und ob Lückenfragen unbeantwortet bleiben – mit Vergleich zum vorigen Lauf und Export.
74. **Muss/Soll, Expertenbefragung, Deckungsmatrix (ADR-092):** Im Anleitungs-Check zählt jeder Punkt als Muss oder Soll – auf Wunsch sind alle Muss-Punkte Bedingung für die Freigabe. Unter „Expertenbefragung“ geben Sie Wissenslücken an Fachleute, in der App oder als Excel-Datei, und übernehmen die Antworten mit dem Label „Prüfen“. Im Bildarchiv zeigt die Deckungsmatrix je Reiter oder Kapitel, für welche Sprache, Rolle und Sparte ein Bild fehlt.
75. **Varianten und Klickstrecke (ADR-093):** Verknüpfen Sie im Bildarchiv die Screenshots derselben Maske – Export, Releases und Übersetzungen zeigen dann jeweils die Fassung in passender Sprache, Rolle, Sparte und Markt. Unter „Klickstrecke aus Screenshots“ reihen Sie Bilder zu nummerierten Stationen, parallele Wege heißen 3a und 3b; das Ergebnis liegt als Bild im Archiv.
76. **Datenschutz im Bild, Labels und Kapitel (ADR-095):** Namen, User-IDs, Adressen und FIN in Screenshots werden per lokaler Texterkennung erkannt und verpixelt ausgeliefert – auch in Exporten. Im Bildarchiv schalten Sie die Unkenntlichmachung je Bild oder je Stelle aus und wieder an, ziehen eigene Stellen mit der Maus auf und sehen mit Bearbeitungsrecht das Original, das unverändert erhalten bleibt. Unter „Labels und Kapitel“ ordnen Sie jedem Bild mehrere Labels (Domäne, Rolle, Gliederung …) und Kapitel zu. Texterkennung mit Wortpositionen: `OCR_BOXES_CMD` oder Tesseract als `OCR_CMD`.
77. **Kapitelsteuerung (ADR-096):** Unter „2 Schreiben › Kapitelsteuerung“ schreiben Sie je Kapitel und Unterkapitel eine kurze Anweisung – worauf es ankommt, welche Themen wichtig sind und was nicht beschrieben wird. Generator, KI-Vorschläge, Anleitungs-Check und die Agenten im Arbeitsordner (`ANWEISUNG.md`) befolgen sie mit Vorrang. Dort ergänzen Sie auch fehlende Kapitel und Unterkapitel, setzen „gültig ab“ (erscheint im Export) und lösen veraltete Funktionen durch neue ab: Das Alte kommt in die Historie und steht im Handbuch nur noch im Anhang „Historie“.
78. **Grammatik und Sprachstil (ADR-097):** Der Schreibstil prüft die Hausregeln aus `GRAMMATIK.md` – „…“, Gedankenstrich, Menüpfad mit ›, Zahlen bis zwölf, Tausenderpunkt, Datum TT.MM.JJJJ, „oneSCM“ – und korrigiert per Klick. Wählen Sie die Sprache des Textes (Englisch mit a/an, „I“, Rechtschreibung); Übersetzungen werden je Absatz geprüft. Unter „Regeln“ legen Sie erlaubte Begriffe, die Zielgruppe für die Lesbarkeit (LIX, Flesch) und eigene Formulierungen je Sprache fest; in der Terminologie markieren Sie Begriffe als „nicht übersetzen“.
79. **Pipeline, Backlog, Intern (ADR-098):** Lesen Sie den Jira-Export ein (mit den Feldern Stream und Produktionsdatum) und wählen Sie unter „Pipeline“ „Aus Jira-Tickets abgleichen“.
    - Tickets in Bearbeitung erscheinen je Kapitel und Unterkapitel mit Erstelldatum, Stream und Produktionsdatum; noch nicht begonnene stehen im Backlog.
    - Die Dokumentation schreiben Sie vorab im Eintrag. Ist das Ticket produktiv, übernimmt „Ins Handbuch übernehmen“ sie als Quelle des Kapitels.
    - Unter „Intern“ legen Sie Themen zu Testing, Reporting, Systemen, Migration, Rollout und Sonstigem ab – sie erscheinen nie im Handbuch.
    - Im Arbeitsordner entsprechen dem `09_Pipeline`, `10_Backlog` und `11_Intern`.
80. **Bessere Suche für „Frage an alle Quellen“ (ADR-099):** Die Suche versteht deutsche Wortformen und Komposita (Kündigungsfrist, Vertragsverlängerung), Kennungen wie E-4711 und erweitert die Frage um Synonyme, Übersetzungen und Abkürzungen aus Terminologie und Stammdaten.
81. **TRIAGE, Detaillevel und Agenten (ADR-100):** Nach dem Einlesen ordnet der Agent TRIAGE jedem Chunk die Pflichtlabels zu (Version, Status, Domäne, Rolle, Sprache, Sparte, Markt, Detaillevel, zu prüfen) und schlägt Kapitel und Unterkapitel vor – auch neue mit Kennung „neu“. Detaillevel steuern die Kapitel (HappyPath = Standardablauf, Edge = Ausnahmen), das Inhalts-Dashboard zeigt Chunks, Labels und Wörter je Kapitel und Domäne. Unter „Agenten“ plant der ORCHESTRATOR Aufgaben und legt Entscheidungen vor, GOAL gleicht mit dem Ziel ab; im Arbeitsordner kommen `12_Goal` und `00_Dokumentation/Agenten` dazu.
82. **Übersetzung (ADR-101):** Ein Übersetzungsspeicher übernimmt freigegebene Absätze und schlägt ähnliche vor. Neue Prüfungen melden Länge, deutsche Wörter und Werte nur auf einer Seite. Das Länderreview bewertet nach MQM. Übersetzungsbüros arbeiten mit XLIFF 1.2 oder Excel, das Glossar je Sprache geht hin und zurück. Sicherheitshinweise werden stichprobenartig rückübersetzt. Neu sind Schweizer Hochdeutsch und Schweizer Französisch, Rahmentexte in allen Sprachen, Releaseletter DE↔EN und ein Hinweis auf fehlende Bildvarianten.
    - Fehlt ein Fachbegriff in den Quellen, antwortet die App nicht, sondern nennt ihn.
    - Unter „Antwortqualität“ vergleichen Sie das neue Verfahren (v2) mit dem bisherigen (v1) am eigenen Bestand, mit nDCG@6.
    - Messung und Methoden: [docs/11](docs/11-rag-messung.md).
83. **Tonalität, Ticket-Einstufung, Projektvergleich, Zukunfts-Inhalte (ADR-102):** Je Projekt legen Sie den Ton je Produktart (sachlich, freundlich, formell, knapp – Vorgabe aus TONALITAET.md) und je Rolle fest; die Stilprüfung meldet Abweichungen, die KI schreibt im gewählten Ton. Jira-Tickets stufen Sie als genehmigt, in Prüfung, intern oder Background ein – intern und Background fließen nicht in Kapitel, Background nur in die Lückenanalyse. Aus dem Vergleich zweier Handbuch-Releases entsteht ein Releaseletter-Entwurf mit neuen und geänderten Kapiteln, Bildfassungen, neuen und abgelösten Funktionen. Kapitel mit späterem „gültig ab“ blenden Export und Release bis zu ihrer Version aus.
84. **Kapitelbewertung, Plausibilität, Fehlerliste (ADR-103):** Die Seite „Kapitelbewertung“ zeigt je Kapitel fünf Kriterien mit Ampel – Sprache, Ziel, Tonalität, Quellenabgleich, Fakten – und eine Gesamtampel. Jede Aussage ist eingestuft: belegt, unbelegt, Widerspruch oder fehlend. Funde der Stilprüfung kommen per Klick in die „Fehlerliste“; sie hat Status mit Begründung und erkennt Korrekturen. Export und Rückimport laufen wie `FEHLERLISTE.csv` des Arbeitsordners.
85. **Überarbeitung (ADR-104):** Eine Word-Prüffassung mit „Fertig, wenn …“ je Kapitel geht an den Fachbereich; die bearbeitete Datei wird zurückgelesen, jede Abweichung wird ein Änderungsvorschlag. Das KI-Lektorat schlägt je Absatz eine bessere Fassung vor. Auf der Seite „Überarbeitung“ stehen Stand, Vorschlag mit Wortvergleich und neue Fassung nebeneinander; übernommen wird in einen Entwurf. Interne Kommentare erscheinen in keinem Export.
86. **Textvarianten und Prüferprofile (ADR-105):** Jedes Kapitel gibt es für Endanwender, als Fachtext und als Kurzfassung für das Management mit etwa einem Viertel der Länge – auch als Exportprofil. Vier Prüferprofile – fachlich, Redaktion, Compliance, Endanwender – prüfen ein Kapitel mit eigenem Blick, je mit Wert, Ampel und Funden; ein lokaler KI-Dienst kann Funde ergänzen.
87. **Vorher/Nachher, PowerPoint, BPMN, Zwischenbilder (ADR-106):** Zwei Fassungen eines Bildes stehen mit Schieberegler nebeneinander, dazu Anlass, Änderung und Wirkung – auch als Gegenüberstellung im Bildarchiv. Das Handbuch lässt sich als PowerPoint exportieren, jede Klickstrecke als BPMN-Prozessmodell. Aus Videos entstehen zusätzlich Zwischenbilder kurz geöffneter Menüs und Dialoge.
88. **Textbausteine (ADR-107):** Wiederkehrende Absätze – etwa ein Hinweis zur Sitzungsdauer – pflegen Sie einmal unter „Textbausteine“. Verknüpfte Absätze zeigen, ob sie aktuell sind; eine neue Fassung übernehmen Sie mit einem Klick in die Entwürfe aller Kapitel. Die App schlägt gleich lautende Absätze in mehreren Kapiteln als Bausteine vor.
89. **LanguageTool und Ansprechperson je Markt (ADR-108):** Die Stilprüfung nutzt auf Wunsch einen lokal betriebenen LanguageTool-Dienst (Java, ohne Docker) für Grammatik, Kommasetzung und Groß-/Kleinschreibung – die Texte bleiben im Haus. Je Land ist eine Ansprechperson mit Vertretung hinterlegt; Länderreviews gehen automatisch an sie.
90. **Regelsätze und Benachrichtigung zum Länderreview (ADR-109):** Unter „Schreibstil › Regeln“ lassen sich Regelsätze zuschalten: Regelbasiertes Schreiben für deutsche Anleitungen, die Schreibregeln von Simplified Technical English und eigene Vale-Stile. Wer ein Länderreview prüfen soll, erhält einen Hinweis mit direktem Link; das Ergebnis geht an die anfordernde Person.
91. **UI-Begriffe (ADR-110):** Begriffe der Oberfläche wie „MO Checks“ bleiben in Menüpfaden und Anführungszeichen erlaubt; im Fließtext meldet die Stilprüfung den Handbuchbegriff „MO-Prüfungen“. `SYNONYME.csv` lässt sich in die Terminologie übernehmen – nur entschiedene Begriffe.
92. **Professionelle Icons (ADR-111):** Navigation, Startseite, Schaltflächen, Quellformate, Hinweisarten und die Leseransicht nutzen einheitliche SVG-Icons (Lucide) statt Emoji – passend zu Hell- und Dunkelmodus, lokal gebündelt und für Screenreader ausgeblendet.
93. **Designvorlagen (ADR-112):** Der HTML-Export erscheint auf Wunsch als **Quick Reference Guide** (A4 quer, Karten in zwei Spalten, Prozessüberblick, rote Warnboxen, Links und häufige Fragen, „STAND“ und Seitenzahl in der Fußzeile) oder als **Handbuch-Kapitel** im Stil einer Fachdokumentation (A4 hoch, Kopfzeile mit Dokumentart und „Seite n von N“, Kennzahlen-Karten, nummerierte Abschnitte, farbige Hinweisboxen). Beide mit Lucide-Icons, Marke und Logo aus dem Firmen-Layout und einem Muster mit fiktiven Inhalten.
94. **PDF im Design (ADR-113):** Mit einem lokal installierten Chromium, Chrome oder Edge (`PDF_BROWSER_PATH`) entstehen Quick Reference Guide und Handbuch-Kapitel direkt als PDF – ohne Netz, mit Kopf- und Fußzeilen und Seitenzahlen der Vorlage; das Muster gibt es ebenfalls als PDF.
95. **Designvorlagen anpassen (ADR-114):** Haupt-, Akzent- und Warnfarbe (mit Kontrastprüfung 4,5 : 1 bzw. 3 : 1), Schriften für Überschriften und Text sowie die Logo-Position je Vorlage – mit Vorschau in den Einstellungen; Export, Muster und PDF übernehmen die Anpassung.
96. **Designvorlagen als Word (ADR-115):** Quick Reference Guide (A4 quer, zwei Spalten, Karten, Warnboxen, „STAND … | n/N“) und Handbuch-Kapitel (Kopfzeile mit „Seite n von N“, Kennzahlen, nummerierte Abschnitte, Hinweisboxen) als bearbeitbares .docx mit Formatvorlagen und Icons; nummerierte Listen zählen je Liste neu.
97. **Designvorlagen als PowerPoint (ADR-116):** Foliensatz 16:9 mit Titelfolie und Überblick, je Abschnitt einer Karte bzw. Abschnittsfolie mit Tabellen und Hinweisboxen, Kennzahlen, „STAND … | n/N“ bzw. „Folie n von N“, Fortsetzungsfolien und durchgehender Nummerierung – in Farben, Schriften und mit Logo der Anpassung.
98. **Lesestil „Handbuch-Kapitel“ (ADR-117):** Leseransicht, Druck und Online-Hilfe wahlweise mit Farben, Schriften, Balken und Hinweisboxen der Designvorlage Handbuch-Kapitel (Einstellungen → Layout); im dunklen Modus bleiben die Textfarben der App.

### Import

- Erlaubt sind `.md`, `.markdown`, `.zip` (E-01) sowie `.html`/`.htm` (Confluence-/HTML-Export) und `.docx` (Word), die in Markdown umgewandelt werden; das Original bleibt abrufbar (ADR-022). Grenzen: `UPLOAD_MAX_BYTES`, `ZIP_MAX_FILES` bzw. **Einstellungen**. Bestehende Installationen mit angepasster Endungsliste ergänzen die neuen Endungen dort.
- **Git-Quellverbindungen** (Seite „Quellen“, Administration): https-Repository, Branch, Unterordner, Intervall. Unveränderte Commits erzeugen keinen Import. Ein Token wird nie gespeichert, sondern als Umgebungsvariable `GIT_CREDENTIAL_<NAME>` des Servers hinterlegt und in der Verbindung nur mit Namen genannt. **Push-Webhook** (ADR-028): Die Verbindung zeigt URL und Geheimnis für GitHub (Secret, `application/json`) bzw. GitLab (Secret Token); ein Push auf den Branch stößt den Abgleich sofort an.
- **Confluence Cloud** (ADR-028): Verbindungsart „Confluence“ mit Basis-URL (`https://firma.atlassian.net/wiki`) und Bereichsschlüssel; Zugang als `CONFLUENCE_CREDENTIAL_<NAME>=email:api-token`. Seiten und Bildanhänge werden übernommen, unveränderte Stände nicht erneut importiert.
- **Bilder** (ADR-029): PNG, JPEG, GIF und WebP im ZIP (relativ referenziert, z. B. `![Anmeldemaske](bilder/maske.png)`), in Word, HTML und Confluence werden übernommen und als `media:<sha256>` versioniert abgelegt; in der Werkstatt fügt **🖼️ Bild einfügen** Bilder hinzu. Jedes Bild braucht einen Alternativtext – sonst blockiert das Qualitätsgate (`image_alt`).
- Optionales Front-Matter je Datei legt Werte als **von der Quelle bestätigt** fest:

  ```yaml
  ---
  roles: [dealer, mo]          # dealer | market | mo | hq | all
  divisions: [car, truck]      # car | van | truck | bus | all
  market: DE
  release: "2026.3"
  evidence_status: source_confirmed
  help_context: [order.create]  # optional: Kontext-IDs für die Kontexthilfe (ADR-030)
  ---
  ```

  Ohne Front-Matter bleibt alles `unconfirmed`; auch Werte, die aus Dateinamen oder Pfaden abgeleitet sind.

## Tests

```bash
npm test                 # Unit- und API-Tests (Vitest)
npm run test:e2e         # Playwright (baut vorher: npm run build)
TEST_DATABASE_URL=postgres://user:pass@localhost:5432/onescm_test npm test   # dieselben Tests gegen PostgreSQL (Schema wird geleert!)
npm run traceability     # docs/traceability.md neu erzeugen; bricht ab, wenn P0-Stories ohne Test/API sind
npm run typecheck
npm run lint             # u. a. keine unabgewarteten Datenbankaufrufe (no-floating-promises)
```

Jeder Test trägt eine ID (`[T-xxx]`), die in [`traceability/tests.json`](traceability/tests.json) den User Stories zugeordnet ist.

## Betrieb

| Variable | Standard | Bedeutung |
|---|---|---|
| `PORT` / `HOST` | `3000` / `0.0.0.0` | HTTP |
| `DATABASE_URL` | – | `postgres://user:pass@host:5432/db` → PostgreSQL (Produktion). Ohne Angabe: SQLite in `DB_PATH` |
| `DB_PATH` | `$DATA_DIR/onescm.db` | SQLite-Datei (Demo/Entwicklung) |
| `DB_POOL_SIZE` | `10` | Verbindungen im PostgreSQL-Pool |
| `DATA_DIR` | `./data` | lokaler Object-Store (Originaldateien, Exporte) bei `OBJECT_STORE=local` |
| `OBJECT_STORE` | `local` | `s3` für AWS S3 oder S3-kompatible Speicher (MinIO, Ceph …) – empfohlen für mehrere Instanzen |
| `S3_BUCKET` / `S3_PREFIX` | – | Bucket (Pflicht bei `s3`) und optionales Präfix |
| `S3_ENDPOINT` / `S3_REGION` / `S3_FORCE_PATH_STYLE` | AWS / `us-east-1` / automatisch | für S3-kompatible Speicher; Zugangsdaten über `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` oder Instanzrolle |
| `LLM_PROVIDER` | `none` | KI-Umformulierung (ADR-013): `anthropic`, `openai` (OpenAI-kompatibel, auch Azure/vLLM/Ollama) oder `demo` (offline, nur Demo/Tests) |
| `LLM_MODEL` | `claude-sonnet-5` bei `anthropic` | Modell; bei `openai` Pflicht |
| `LLM_API_KEY` | – | Schlüssel; alternativ `ANTHROPIC_API_KEY` bzw. `OPENAI_API_KEY` |
| `LLM_BASE_URL` / `LLM_TIMEOUT_MS` / `LLM_MAX_TOKENS` | Anbieter-Standard / `60000` / `4000` | eigener Endpunkt (z. B. EU-Region, Proxy, selbst betrieben), Zeitlimit, Antwortlänge |
| `AUTH_MODE` | `demo` | `oidc` für den Produktivbetrieb |
| `OIDC_ISSUER` | – | Issuer-URL des Providers (Discovery unter `/.well-known/openid-configuration`) |
| `OIDC_CLIENT_ID` | – | Client-ID der Web-UI |
| `OIDC_AUDIENCE` | – | **Pflicht im OIDC-Modus:** erwartete Zielgruppe (`aud`) des Access-Tokens |
| `OIDC_SCOPE` | `openid profile` | angeforderte Scopes |
| `OIDC_PERMISSIONS_CLAIM` | `roles` | Claim mit Gruppen/Rollen, Punktnotation erlaubt (z. B. `realm_access.roles`) |
| `OIDC_PERMISSION_MAP` | Standardgruppen | JSON: `{"gruppe": ["read","edit"]}` |
| `OIDC_JWKS_URI` / `OIDC_JWKS` | Discovery | abweichende JWKS-URL bzw. Inline-JWKS |
| `JOB_WORKER` | `1` | `0` = Instanz ohne Hintergrund-Worker (nur API) |
| `JOB_LEASE_MS` | 600000 | nach dieser Zeit gelten laufende Jobs abgestürzter Instanzen als verwaist und werden wiederholt |
| `UPLOAD_MAX_BYTES` | 50 MB | maximale Uploadgröße |
| `ZIP_MAX_FILES` | 5000 | maximale Dateien je ZIP |
| `LOG` / `LOG_LEVEL` | `1` / `info` | `0` schaltet das Logging ab; Logs sind JSON mit Request-ID, Benutzer und Projekt |
| `TRUST_PROXY` | – | `1` hinter einem Reverse Proxy (Client-IP aus `X-Forwarded-For`) |
| `METRICS_TOKEN` | – | Bearer-Token für `/metrics` (Prometheus); ohne Token nur mit Berechtigung `admin` |
| `RATE_LIMIT_MAX` / `RATE_LIMIT_EXPENSIVE_MAX` | `1200` / `60` | Anfragen je Benutzer und Minute; aufwendig = Import, Git-Abgleich, Analyse, Export, Projektbericht, KI, semantische Suche; `0` schaltet ab |
| `LLM_PRICE_INPUT_PER_MTOK` / `LLM_PRICE_OUTPUT_PER_MTOK` / `LLM_PRICE_CURRENCY` | – / – / `USD` | optionale Preise je 1 Mio. Tokens für die Kostenschätzung der KI-Nutzung |
| `EMBEDDINGS_PROVIDER` | `local` | semantische Suche (ADR-017): `local` (ohne Netzwerk) oder `openai` (OpenAI-kompatibel, auch Azure/Voyage/Ollama) |
| `EMBEDDINGS_MODEL` / `EMBEDDINGS_BASE_URL` / `EMBEDDINGS_API_KEY` | – | Modell (Pflicht bei `openai`), Endpunkt, Schlüssel (alternativ `OPENAI_API_KEY`) |
| `NOTIFY_WEBHOOK_URL` | – | Benachrichtigungen per Webhook (ADR-019), JSON mit `text` |
| `SMTP_URL` / `MAIL_FROM` | – / `noreply@example.com` | Benachrichtigungen per E-Mail (`smtp://user:pass@host:587`) |
| `APP_URL` | – | Basis-URL der Web-UI für Links in Benachrichtigungen |
| `VECTOR_INDEX` | `auto` | Suchverfahren der semantischen Suche (ADR-024): `auto` (exakt im Speicher; bei einem semantischen Embedding-Modell ab `semantic.annThreshold` Abschnitten näherungsweise über pgvector, falls verfügbar, sonst HNSW), `exact`, `hnsw`, `pgvector` |
| `RATE_LIMIT_STORE` | `memory` | `db`: Rate-Limits gemeinsam über alle Instanzen derselben Datenbank (ADR-027) |
| `OTEL_EXPORTER_OTLP_ENDPOINT` / `OTEL_SERVICE_NAME` | – / `onescm-handbook-studio` | OpenTelemetry-Tracing per OTLP/HTTP (ADR-027); ohne Endpunkt aus |
| `GIT_CREDENTIAL_*` | – | Tokens für Git-Quellverbindungen (ADR-022), in der Verbindung nur per Name referenziert |
| `GIT_TIMEOUT_MS` / `GIT_ALLOW_FILE` | `120000` / – | Zeitlimit je git-Aufruf; `1` erlaubt lokale Repositories (nur Tests) |
| `TRANSCRIBE_CMD` | – | lokale Transkription von Videos mit Platzhaltern `{input}`, `{output}`, `{lang}`, z. B. `whisper-cli -m /models/ggml-base.bin -l de -ovtt -of {output} -f {input}` (ADR-090) |
| `FFMPEG_PATH` | – | ffmpeg für Standbilder bei Änderung aus Videos (F-26), z. B. `/usr/bin/ffmpeg` |
| `OCR_CMD` | – | lokale Texterkennung gescannter PDF-Seiten, z. B. `tesseract {input} stdout -l deu+eng` |
| `OCR_BOXES_CMD` | aus `OCR_CMD` (Tesseract + `tsv`) | Texterkennung mit Wortpositionen (TSV wie Tesseract) für den Datenschutz im Bild (ADR-095), z. B. `tesseract {input} stdout -l deu+eng tsv` |
| `MEDIA_TOOL_TIMEOUT_MS` | `1800000` | Zeitlimit je Werkzeugaufruf; Befehle laufen ohne Shell |
| `CONFLUENCE_CREDENTIAL_*` | – | Zugang für Confluence-Cloud-Verbindungen (ADR-028): `email:api-token` (Basic) oder persönliches Token (Bearer) |
| `INTEGRATIONS_ALLOW_INSECURE` | – | `1` erlaubt `http` und interne Ziele für Webhooks und Confluence (nur Tests/abgeschottete Netze; sonst SSRF-Schutz) |
| `JOB_BACKOFF_MS` | `2000` | Grundabstand der Wiederholungen fehlgeschlagener Jobs (verdoppelt sich je Versuch), z. B. Webhook-Zustellungen |
| `HELP_EMBED_ORIGINS` | – | Ursprünge, die das Hilfe-Widget einbetten dürfen (ADR-030), z. B. `https://onescm.example.com`; ohne Angabe nur die eigene Anwendung |
| `APP_VERSION` | Version aus `package.json` | im Container-Image von der Release-Pipeline gesetzt; erscheint in `/api/v1/health` und Traces |

**Integrationen (ADR-028):** API-Tokens (Seite „Integrationen“, Administration) gelten für ein Projekt mit gewählten Rechten: `curl -H "Authorization: Bearer oscm_…" https://handbuch.example.org/api/v1/chapters`. Webhooks senden Ereignisse (z. B. `chapter_version.approved`, `release.published`) als JSON mit `X-Onescm-Event`, `X-Onescm-Delivery`, `X-Onescm-Timestamp` und `X-Onescm-Signature: sha256=<HMAC-SHA256(Geheimnis, "<Zeitstempel>.<Rumpf>")>`; fehlgeschlagene Zustellungen werden bis zu fünfmal wiederholt.

**Kontexthilfe in oneSCM (ADR-030):** Nach Freischaltung unter „Kontexthilfe“ bindet oneSCM das Widget ein – angezeigt wird der Stand des neuesten Releases:

```html
<script src="https://handbuch.example.org/help/widget.js" data-project="p_default" data-language="de" data-role="dealer" defer></script>
<button type="button" data-onescm-help="order.create">Hilfe</button>   <!-- Klick oder F1 im Bereich öffnet die Hilfe -->
```

Server-seitig liefert `GET /api/v1/context-help/order.create?role=dealer&language=en` (API-Token) den freigegebenen Stand samt HTML.

**Releases (ADR-031):** Version setzen, CHANGELOG-Abschnitt schreiben, taggen – die Pipeline baut und veröffentlicht den Rest:

```bash
npm run release -- bump 0.11.0 && $EDITOR CHANGELOG.md && npm run release -- check
git commit -am "Release 0.11.0" && git tag v0.11.0 && git push --follow-tags
docker pull ghcr.io/<owner>/<repo>:0.11.0
cosign verify ghcr.io/<owner>/<repo>:0.11.0 --certificate-identity-regexp '^https://github.com/<owner>/<repo>/.github/workflows/release.yml@' --certificate-oidc-issuer https://token.actions.githubusercontent.com
helm install handbuch oci://ghcr.io/<owner>/charts/onescm --version 0.11.0
```

Mehrere Instanzen sind mit PostgreSQL und `OBJECT_STORE=s3` möglich: Jobs werden per `FOR UPDATE SKIP LOCKED` verteilt, Dateien liegen im gemeinsamen Bucket (ADR-008).

**Kubernetes (ADR-027):** Helm-Chart unter [`deploy/helm/onescm`](deploy/helm/onescm/values.yaml) mit getrennten Deployments für API und Worker, Probes, HPA, PodDisruptionBudget, Ingress und ServiceMonitor:

```bash
kubectl create secret generic onescm-secrets --from-literal=DATABASE_URL=postgres://… --from-literal=METRICS_TOKEN=…
helm install handbuch deploy/helm/onescm --set image.repository=registry.example.org/onescm --set extraEnv.S3_BUCKET=onescm --set extraEnv.OIDC_ISSUER=https://idp.example.org
```

Mehrere Replikate starten gefahrlos gleichzeitig (Migrationen unter PostgreSQL-Sperre).

**Überwachung (ADR-015):** `GET /api/v1/health/live` (Liveness) und `GET /api/v1/health/ready` (Datenbank, Object-Store, Jobqueue) ohne Anmeldung; Prometheus-Metriken unter `/metrics`. Jede Antwort trägt `X-Request-Id`.

**Backup und Wiederherstellung (ADR-015):** mit derselben Konfiguration wie der Server

```bash
npm run backup -- --out backup.zip             # im Container: node apps/server/dist/cli.js backup --out /data/backup.zip
npm run restore -- --in backup.zip [--force]   # --force ersetzt vorhandene Daten
```

Das Backup ist dialektunabhängig (Tabellen als JSON-Zeilen plus Objekte) – damit lässt sich auch von SQLite nach PostgreSQL umziehen: Backup mit SQLite-Konfiguration erstellen, Restore mit `DATABASE_URL` einspielen.

**Lasttest:** `npm run perf -w apps/server -- 2000` (Messwerte in ADR-015); semantische Suche: `npm run perf:semantic -w apps/server -- 50000` (Messwerte in [docs/lasttest-semantik.md](docs/lasttest-semantik.md)).

**pgvector (ADR-024):** Mit PostgreSQL und der Erweiterung `vector` (z. B. Image `pgvector/pgvector:pg16`) legt der Server Tabelle `snippet_vectors` und einen HNSW-Index selbst an; fehlt die Erweiterung oder das Recht dazu, sucht er im Speicher.

Sicherheit: Markdown/HTML aus Quellen wird nie ausgeführt (eigener Parser, `react-markdown` ohne Raw-HTML, Rohtext als `text/plain` + `nosniff`). Dazu eine restriktive CSP, Datenschutzblocker vor Export und ein Auditprotokoll (`GET /api/v1/audit-events`).

