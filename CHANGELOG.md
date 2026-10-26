# Changelog

## 0.84.0 – Etappe 84 (26.10.2026)

### Hinzugefügt
- **Dialoge und Erklärungen per Tastatur geprüft (E2E T-403, WCAG 2.1.2, 2.4.3, 1.4.13):**
  - Vier Dialoge (Aufgabe, Webhook, Quellverbindung, Pipeline-Eintrag) werden nur mit der Tastatur geöffnet.
  - Der Fokus steht danach im ersten Feld.
  - Eingaben werden Zeichen für Zeichen getippt; der Fokus bleibt dabei im Feld.
  - Tab und Umschalt+Tab bleiben im Dialog.
  - Esc schließt den Dialog, und der Fokus steht wieder auf dem Auslöser.
  - Glossar: Die Erklärung bleibt offen, wenn die Maus vom Begriff auf sie wechselt. Esc schließt sie.
- **Benutzerdokumentation:** Dialoge und Glossar-Erklärungen im Abschnitt „Mit der Tastatur“.

### Behoben
- **Tippen in Dialogen:** Nach dem ersten Zeichen sprang der Fokus auf „Schließen“, die weiteren Zeichen gingen verloren. Das betraf alle 18 Dialoge, aber nur bei Bedienung mit der Tastatur. Ursache: Der Dialog setzte den Fokus bei jeder neuen Darstellung neu, nicht nur beim Öffnen. Mit der Maus und in den bisherigen Tests (die Felder in einem Schritt füllen) fiel das nicht auf.
- **Erster Fokus im Dialog:** Er steht jetzt im ersten Eingabefeld statt auf „Schließen“. Dialoge ohne Eingabefeld beginnen weiter bei „Schließen“.
- **Dialogname:** Der Name kommt aus der sichtbaren Überschrift (`aria-labelledby`). Tab überspringt ausgeblendete Elemente. Steht der Fokus außerhalb, holt Tab ihn in den Dialog zurück.
- **E2E T-236:** Die Schaltfläche einer fehlenden Übersetzung heißt seit Etappe 83 „Englisch übersetzen“ wie ihr sichtbarer Text „Übersetzen“; der Test suchte noch „Englisch bearbeiten“.
- **E2E T-340:** Der Vorher/Nachher-Regler zeigt seinen Wert seit Etappe 83 als „Anteil Nachher 80 %“; der Test prüft jetzt den Wert im `<output>`.
- **Glossar-Erklärung:** Zwischen Begriff und Erklärung lagen 4 px Abstand. Wer die Maus auf die Erklärung bewegte, schloss sie. Esc schloss sie nur, wenn der Begriff den Fokus hatte.

## 0.83.0 – Etappe 83 (26.10.2026)

### Hinzugefügt
- **Sichtbare Beschriftung im zugänglichen Namen geprüft (E2E T-402, WCAG 2.5.3):** Auf allen 77 Seiten, bei 1280 und 390 px, muss jede Schaltfläche, jeder Link und jedes Feld mit eigenem Namen (`aria-label`, `aria-labelledby`) seinen sichtbaren Text enthalten. Nur so finden Sprachsteuerungen wie Dragon oder die Sprachsteuerung von Windows und macOS ein Element über das, was auf dem Bildschirm steht. Werte von Schiebereglern zählen nicht zur Beschriftung.
- **Benutzerdokumentation:** Abschnitt „Mit Sprachsteuerung“ in den Grundlagen.

### Behoben
- **19 Stellen auf 13 Seiten**, deren Name vom sichtbaren Text abwich:
  - Lesezeichen: „Notiz speichern“ hieß „Notiz zu „…“ speichern“, jetzt „Notiz speichern: „…““.
  - Häufige Fragen: „Übersetzen“ hieß „Französisch bearbeiten“, jetzt „Französisch übersetzen“.
  - oneSCM_Metadaten: Die Beschriftung „Labels auf“ lautet jetzt wie der Name „Sprache der Labels“; die Links „→ Chunks zu dieser Überschrift“ heißen „Chunks zu dieser Überschrift: …“.
  - Cluster: Die Auswahl zum Teilen heißt nach dem Text des Absatzes statt „Zum Teilen auswählen“.
  - Felder mit sichtbarem Label und abweichendem Namen (u. a. „Beschreibung (optional)“, „Zu vermeiden (kommagetrennt)“, „Definition (optional)“, „Verglichen mit“, „oder Inhalt einfügen“, „Einleitung / Hinweise“) nutzen jetzt ihr Label als Namen.
  - Schieberegler (Einstellungen, Widersprüche, Vorher/Nachher): Der Wert steht in einem `<output>` neben der Beschriftung; der Vorher/Nachher-Regler ist mit „Anteil Nachher“ beschriftet.

## 0.82.0 – Etappe 82 (26.10.2026)

### Hinzugefügt
- **Seitentitel geprüft (E2E T-401, WCAG 2.4.2):** Jede der 77 Seiten hat einen eigenen Fenstertitel. Gleiche Titel gibt es nur bei einer Weiterleitung. Detailseiten nennen das geöffnete Objekt.
- **Titel mit geöffnetem Objekt:** Die Reihenfolge ist Objekt – Seite – App, z. B. „3. Benutzerverwaltung – Kapitelwerkstatt – oneSCM Handbook Studio“. Das gilt für Kapitelwerkstatt, Leseransicht, Anleitungs-Check, Kapitelbewertung, Evidenz, Versionsvergleich, Draft Manual und Inhaltsverzeichnis. Mehrere offene Tabs, der Verlauf und Screenreader unterscheiden die Seiten damit.

### Behoben
- **Kapitelwerkstatt ohne Seitentitel:** Der Fenstertitel lautete nur „oneSCM Handbook Studio“.
- **E2E-Tests mit eigener Statuszeile der Seite:** Seit Etappe 81 ist die Statusregion für Meldungen immer vorhanden. Seiten mit einer eigenen Statuszeile (z. B. Release-Abgleich) haben damit zwei Elemente mit `role="status"`, und seitenweite Suchen in den Tests waren nicht mehr eindeutig. Die Tests suchen die Statusmeldung jetzt über ihren Text.
- **E2E T-212 weiter gelegentlich 3 statt 2 Hinweise:** Auch mit `WEEKLY_DIGEST=0` (Etappe 80) zählte die CI einmal einen dritten ungelesenen Hinweis für die Redaktion (Node 20, Stand `54d7bcd`). Die Wochenübersicht war also nicht die einzige Quelle. Der Test nahm an, dass die Redaktion vorher keine ungelesenen Hinweise hat. Andere Tests und Hintergrundaufträge dürfen aber Hinweise erzeugen. T-212 prüft jetzt über die API, dass genau ein Hinweis „erwähnt“ und einer „zugewiesen“ aus diesem Test entstehen, und dass der Zähler der Zahl der ungelesenen Hinweise laut Server entspricht. Weitere Hinweise schreibt der Test mit Typ, Zeit und Text ins Protokoll, damit ihre Quelle sichtbar wird.

## 0.81.0 – Etappe 81 (26.10.2026)

### Hinzugefügt
- **Statusmeldungen für Screenreader geprüft (E2E T-400, WCAG 4.1.3):**
  - Beide Live-Regionen sind beim Laden der Seite vorhanden und leer.
  - Eine Bestätigung erscheint in der Statusregion.
  - Dieselbe Bestätigung ein zweites Mal wird als neuer Knoten eingefügt und dadurch erneut angesagt.
  - Ein Fehler erscheint in der Alarmregion.

### Geändert
- **Meldungen der App (Toasts):**
  - Bestätigungen stehen in einer Statusregion (`role="status"`, höflich), Fehler in einer Alarmregion (`role="alert"`, sofort).
  - Beide Regionen gibt es von Anfang an. Bisher entstand die Region erst mit der Meldung, und viele Screenreader (NVDA, JAWS, VoiceOver) sagen sie dann nicht an.
  - Fehler kamen bisher nur als höfliche Statusmeldung.
  - Das Aussehen bleibt gleich. Die Position am unteren Rand tragen die Live-Regionen selbst (`.toast-region`). Eine Live-Region ohne eigene Fläche gilt sonst als unsichtbar; das brach in der CI sechs Tests, die Meldungen mit `getByRole('status')` suchen.

### Behoben
- **Server-Test T-147 mit eigenem Zeitlimit (120 s):** Der Test baut Suchindizes für drei Suchmaschinen, mit PostgreSQL auch pgvector. Lokal braucht er 2 s (SQLite) bzw. 10 s (PostgreSQL). Auf einem geteilten CI-Rechner mit langsamer Platte überschritt er das allgemeine Limit von 30 s (Node 20, Stand `adad5cb`).

## 0.80.0 – Etappe 80 (26.10.2026)

### Hinzugefügt
- **Einstellung `WEEKLY_DIGEST`:** `0` schaltet die automatische Wochenübersicht ab, z. B. für Test- und Schulungsinstanzen.
- **Kontrast von Eingabefeldern und Fokusrahmen geprüft (E2E T-398, WCAG 1.4.11):** Auf allen 77 Seiten, hell und dunkel, braucht jedes Eingabefeld, jede Auswahlliste und jedes Textfeld einen Rand mit mindestens 3:1 Kontrast. Dieser Rand kann ein Rahmen oder die Feldfläche sein. Auch der Fokusrahmen muss mindestens 3:1 zum Hintergrund erreichen, in Seitenleiste und Inhaltsbereich. Schaltflächen erkennt man an ihrer Beschriftung; für sie gilt die Regel nicht.
- **Farbwert `--field-border`** für Feldrahmen: hell `#7d8798` (mindestens 3,2:1), dunkel `#6b7894` (mindestens 3,5:1).
- **Farbwert `--focus` und einheitlicher Fokusrahmen:** Alle Bedienelemente zeigen beim Fokus denselben Rahmen (`:focus-visible`, 2 px). Die Farbe ist hell `#1d63d8` (mindestens 4,8:1) und dunkel `#60a5fa` (mindestens 6,1:1). Bisher zeichnete der Browser bei Reitern, Chips und aufklappbaren Abschnitten (`summary`) seinen eigenen Ring. Dessen Farbe war im dunklen Modus nicht prüfbar, und er sah anders aus als der Rest der App.

### Behoben
- **E2E T-212 montags instabil:** Die Wochenübersicht ist standardmäßig auf Montag eingestellt. Der Hintergrundauftrag verschickt sie zwei Minuten nach dem Serverstart, in der CI also ungefähr während T-212. Je nach Zeitpunkt zählte „Aufgaben & Hinweise“ deshalb 3 statt 2 ungelesene Hinweise, auf Node 20 in der CI für Etappe 79. Die automatische Wochenübersicht lässt sich jetzt mit `WEEKLY_DIGEST=0` abschalten, „Jetzt senden“ bleibt möglich. Die E2E-Tests nutzen diese Einstellung. Die Wochenübersicht prüft T-231 weiterhin über „Jetzt senden“.
- **Feldrahmen kaum sichtbar:** Eingabefelder nutzten die Farbe der Kartenränder und erreichten nur 1,2 bis 1,9:1. Sie nutzen jetzt `--field-border`. Das Suchfeld in der Seitenleiste erreicht jetzt mindestens 5:1.
- **Fokusrahmen in der Seitenleiste:** Die Hauptfarbe auf dem dunklen Blau der Seitenleiste erreichte nur 2,98:1. Der Fokusrahmen ist dort jetzt weiß.
- **Fokusrahmen im dunklen Modus:** Die Hauptfarbe `#2563eb` erreichte auf dem dunklen Hintergrund nur 2,8 bis 3,3:1, etwa bei Links in der Freigabe und bei Linkschaltflächen in der Werkstatt. Fokusrahmen nutzen jetzt `--focus`. Gefunden hat das T-398 in der CI mit den vollen Testdaten.
- **Bernsteinfarbener Fokusrahmen:** Drei Stellen nutzten die nicht vorhandene Variable `--focus` und damit Bernstein mit 2,05:1 auf Weiß. Betroffen waren Schaltflächen im Linkstil (u. a. Kapitelbewertung), „Entfernen“ in den Chunks und die Gliederungsliste in „Kapitel ↔ Quellen“. Sie nutzen jetzt `--focus`.

## 0.79.0 – Etappe 79 (26.10.2026)

### Hinzugefügt
- **Hinweise ohne Ortsangaben geprüft (E2E T-397, WCAG 1.3.3):** Der Test liest alle Oberflächentexte, auch die neun Sprachen der Leseransicht. Er schlägt an bei Hinweisen, die nur in einem Layout stimmen („Wählen Sie links …“, „on the left“, „à gauche“ …). Zusätzlich prüft er die Leseransicht in Smartphone-Breite.

### Geändert
- **Hinweise nennen den Namen der Liste statt ihrer Lage.** Auf dem Smartphone steht die Liste über dem Inhalt, nicht links davon.
  - Leseransicht: „Wählen Sie unter „Inhalt“ ein Kapitel.“, in allen neun Sprachen.
  - Bildarchiv: „Wählen Sie in der Liste „Bilder“ ein Bild.“
  - Kapitelsteuerung: „Wählen Sie unter „Kapitel und Unterkapitel“ einen Eintrag.“
  - Kapitelwerkstatt: „Wählen Sie im Kapitel einen Absatz …“ statt „Block in der Mitte auswählen“.
  - Kapitel ↔ Quellen: Untertitel ohne „links“ und „rechts“.
- **Benutzerdokumentation:** Projekt und Demo-Benutzer werden „in der Seitenleiste“ gewählt statt „oben links“.

## 0.78.0 – Etappe 78 (26.10.2026)

### Hinzugefügt
- **Vergrößerung und Textabstände geprüft (E2E T-396):**
  - Alle 77 Seiten bei 320 px Breite, das entspricht 400 % Zoom: Die Seite darf nicht waagerecht scrollen (WCAG 1.4.10).
  - Mit vergrößerten Textabständen nach WCAG 1.4.12 (Zeilenhöhe 1,5, Absatzabstand doppelt, Buchstaben 0,12 em, Wörter 0,16 em) wird bei 320 und 1280 px kein Text abgeschnitten.
- **T-391 prüft auch die Seitenleiste:** keine Codes, Emoji oder Berechtigungs-Codes.

### Behoben
- **320 px, also 400 % Zoom:** Vier Seiten waren 5 bis 25 px zu breit, mit vergrößerten Textabständen sechs Seiten bis 91 px.
  - Beschriftete Auswahlfelder in Filterzeilen (Draft Manual, Druck, Lesezeichen, Planung) brechen jetzt um.
  - Kapitelwerkstatt und Kapitel ↔ Quellen nutzen einspaltig `minmax(0, 1fr)`.
  - Lange Wörter (Deckblatt „Benutzerhandbuch“, Dateipfade) brechen um, wenn sie sonst nicht in die Zeile passen (`overflow-wrap: break-word`).
  - Kapitelüberschriften in Leseransicht und Druck passen ihre Größe an schmale Bildschirme an (19 bis 24 px) und werden getrennt, wenn ein Wort sonst nicht passt. In der CI war „/lesen/druck“ wegen anderer Schriften noch 23 px zu breit; geprüft ist jetzt auch 280 px, also mit Reserve.
- **Berechtigungen auf Deutsch:** Die Seitenleiste zeigte „Berechtigungen: read, edit, decide, approve, admin“. Sie zeigt jetzt „Lesen, Bearbeiten, Entscheiden, Freigeben, Administration“. Die Projektverwaltung nutzt dieselben Bezeichnungen wie die Benutzerverwaltung (bisher „lesen, bearbeiten … administrieren“).

## 0.77.0 – Etappe 77 (25.10.2026)

### Hinzugefügt
- **Tastaturbedienung aller Seiten geprüft (E2E T-395):** Auf allen 77 Seiten ist „Zum Inhalt springen“ der erste Tabstopp. Danach durchläuft der Test bis zu 80 Tabstopps im Inhaltsbereich, mit den vollen Testdaten des E2E-Laufs (gut 2 000 Tabstopps; im dunklen Modus zusätzlich einmalig geprüft, ohne Befund). Jeder Tabstopp muss einen sichtbaren Fokus haben (WCAG 2.4.7), der nicht verdeckt ist (2.4.11), und der Fokus darf nicht kreisen (2.1.2). Kopf und Menü werden einmal vollständig geprüft.
- **Benutzerdokumentation:** Abschnitt „Mit der Tastatur“ in den Grundlagen.

### Behoben
- **Sprunglink beim direkten Aufruf von /stammdaten und /werkstatt:** Beide Seiten leiten beim Laden weiter, zum Inhaltsverzeichnis bzw. zum ersten Kapitel. Die App wertete das als Seitenwechsel und setzte den Fokus auf die Überschrift, sodass der erste Tabstopp nicht mehr „Zum Inhalt springen“ war. Weiterleitungen beim ersten Laden setzen den Fokus jetzt nicht mehr. Nach einem Klick im Menü steht der Fokus weiter auf der Überschrift, auch mit Weiterleitung (WCAG 2.4.3).
- **Zugriffsmatrix per Tastatur:** Beim Tabben durch die Matrix schob der Browser das nächste Feld nur knapp ins Bild und damit unter die fixierte erste Spalte. Ein fokussiertes Feld unter einer fixierten Spalte wird jetzt ganz sichtbar geschoben, in allen Tabellen mit fixierter Spalte (WCAG 2.4.11).

## 0.76.0 – Etappe 76 (25.10.2026)

### Hinzugefügt
- **Smartphone-Breite geprüft (E2E T-394):** Alle 77 Seiten werden bei 390 px Breite geprüft. Die Seite darf nicht waagerecht scrollen (WCAG 1.4.10, Umbruch), und axe darf keinen Befund melden.
- **Tastaturzugang zu scrollenden Tabellen:** Tabellen, die waagerecht scrollen und nichts Fokussierbares enthalten, erhalten automatisch einen Tabstopp (WCAG 2.1.1). Das gilt für alle Seiten, auch für künftige Tabellen.

### Behoben
- **Dashboard und Generator in Smartphone-Breite:** Die Seiten waren 73 bzw. 80 px zu breit. Ursache waren Texte nur für Screenreader (`.sr-only`, absolut positioniert) in Tabellenzellen: Sie richteten sich nach der Seite statt nach dem Scrollbereich der Tabelle. Die Scrollbereiche der Tabellen sind jetzt Bezugsrahmen (`position: relative`).
- **Bildarchiv und Evidenz in Smartphone-Breite:** Mit vielen Daten waren die Seiten bis zu 73 bzw. 53 px zu breit. Im Bildarchiv dehnte die Bildliste die einspaltige Kartenreihe (`.grid2`) auf ihre Mindestbreite. In der Evidenz war die Kapitelauswahl so breit wie ihr längster Eintrag. Die einspaltigen Raster nutzen jetzt `minmax(0, 1fr)`, und Auswahllisten sind höchstens so breit wie ihr Bereich.
- **Draft Manual im dunklen Modus:** Textbausteine nutzten die nicht vorhandene Variable `--card` und damit immer einen weißen Hintergrund, im dunklen Modus mit heller Schrift. Sie nutzen jetzt die Flächenfarbe der Darstellung. Gefunden hat es T-393 in der CI.
- **Seitenprüfungen T-392 bis T-394** melden jetzt alle Fundstellen je Regel statt nur die ersten zwei, damit ein Fund keine weiteren verdeckt.

## 0.75.0 – Etappe 75 (25.10.2026)

### Hinzugefügt
- **Barrierefreiheit aller Seiten im dunklen Modus (E2E T-393):** axe (WCAG 2.2 AA) läuft auf allen 77 Seiten auch mit der Darstellung „Dunkel“ (über das Betriebssystem, ADR-035). Damit werden Farbkontraste in beiden Darstellungen geprüft.

### Behoben
- **Draft Manual im dunklen Modus:** Der Kopf eines Lückenknotens hatte einen fest hellen Hintergrund, im dunklen Modus mit heller Schrift. Der Hintergrund wird jetzt aus der Flächenfarbe abgeleitet. Gefunden hat es T-393.

## 0.74.0 – Etappe 74 (25.10.2026)

### Hinzugefügt
- Kommentar in T-202, warum der Test den Absatz über die Kopfzeile auswählt (ein Klick in die Mitte trifft je nach Schriftbreite eine Schaltfläche).

### Behoben (Tests)
- **T-202 lokal wieder grün:** Der Test wählte einen Absatz der Kapitelwerkstatt per Klick in seine Mitte aus. Je nach Schriftbreite traf der Klick die Schaltfläche „Bild erzeugen“; der Dialog verdeckte danach die Reiter. Der Test wählt den Absatz jetzt über seine Kopfzeile aus.
- Damit laufen erstmals alle E2E-Tests auch lokal grün; bisher scheiterten T-202 und T-231 nur lokal (T-231 behoben in Etappe 73).

## 0.73.0 – Etappe 73 (25.10.2026)

### Hinzugefügt
- **Barrierefreiheit aller Seiten (E2E T-392):** axe (WCAG 2.2 AA) läuft auf allen 77 Seiten ohne Pfadparameter, mit den Daten des E2E-Laufs. Bisher prüften die Tests nur ausgewählte Seiten. Die Seitenliste teilen T-391 und T-392 (`ALL_PAGES`).

### Behoben
- **Freigabe:** Das Prüfkriterium „Keine Blöcke mit Status „needs_regeneration““ heißt jetzt „Keine Absätze, die nach einer Quellenänderung neu zu generieren sind (Status „prüfen“)“. Gefunden hat es die Seitenprüfung T-391 im ersten Lauf mit vollen Daten.
- **Rückmeldungen:** Die Links der Wochenübersicht („Ihre Übersicht für …“) haben jetzt die Mindestgröße von 24 px (WCAG 2.5.8). Gefunden hat es T-392. Damit besteht auch T-231 wieder lokal; es scheiterte bisher nur lokal an genau diesem Befund.

## 0.72.0 – Etappe 72 (25.10.2026)

### Behoben
- **Status auf Deutsch:** Versionsauswahl der Kapitelwerkstatt, Evidenzansicht, Versionsvergleich, Abdeckung im Bildarchiv und „Letzte Analyse“ im Dashboard zeigten rohe Codes („Version 1 (draft)“). Sie nutzen jetzt die gemeinsame Bezeichnung (Entwurf, eingereicht, freigegeben …).

### Hinzugefügt
- **Seitenprüfung (E2E T-391):** Der Test geht alle 77 Seiten ohne Pfadparameter mit den Daten des E2E-Laufs durch. Er schlägt an bei rohen Status-Codes, farbigen Emoji, „undefined“, „NaN“, „[object Object]“ und Konsolenfehlern. Anforderung NFR-158.

## 0.71.0 – Etappe 71 (25.10.2026)

### Behoben (Feinschliff nach Sichtprüfung)
- **Quick Reference Guide:** Am Bildschirm stehen die Karten wieder in zwei Spalten. Bisher füllte `column-fill:auto` ohne Seitenhöhe nur die linke Spalte; im Druck bleibt die Füllung je Seite.
- **Handbuch-Kapitel:** Die Kennzahlen-Karten stehen bündig mit Titel und Text. Die Listenregel `.fd ul` überschrieb seit Etappe 66 Einzug und Abstand.
- **Boxbeschriftung:** Ein fett gesetztes Signalwort am Anfang („**Wichtig:**“, „**Achtung:**“ …) wird zur Beschriftung der Box und fällt aus dem Text – in HTML, PDF, Word und PowerPoint. Das Muster zeigt damit die Box „Wichtig“ statt „Tipp“ mit „Wichtig:“.
- **Einstellungen:** Schweregrade je Widerspruchsregel auf Deutsch (Blocker, Hoch, Mittel, Niedrig); der zugängliche Name nennt die Regel statt ihres Codes.

### Hinzugefügt
- Tests T-389 und E2E T-390. T-368 und T-371 erwarten im Muster die Beschriftung „Wichtig“.

## 0.70.0 – Etappe 70 (25.10.2026)

### Geändert
- **Lucide-Icons für Rollen, Sparten und Label-Gruppen (ADR-122, Entscheidung vom 25.10.2026):**
  - Die Stammdaten tragen den Namen eines Lucide-Icons statt eines Emoji; bestehende Datenbanken werden beim Start angepasst.
  - Badges, Filter, Stammdaten, Gliederungen, Quellen und oneSCM_Metadaten zeichnen einheitliche SVG-Icons; Farbe und Textlabel bleiben.
  - Exporte und der Kapitelgenerator nennen nur den Namen („Dealer · Truck“, „- HQ (…)“).
- Entscheidung E-11 geändert; die Ausnahme in ADR-111 ist aufgehoben.
- U-07 (weitere Sprachen und Märkte): am 25.10.2026 vorerst zurückgestellt.

### Hinzugefügt
- Tests T-387 und E2E T-388; Anforderung NFR-157.

## 0.69.0 – Etappe 69 (24.10.2026)

### Hinzugefügt
- **Prüfbericht Barrierefreiheit für HTML (ADR-121):** nach jedem HTML-Export, im Standard und im Design:
  - Sprache der Seite, Seitentitel, Hauptbereich;
  - Überschriften ohne übersprungene Ebene;
  - Bilder mit Alternativtext, Icons ausgeblendet oder benannt;
  - Tabellen mit Kopfzellen, Links mit erkennbarem Namen.
- Karte „Barrierefreiheit (HTML)“ auf der Seite „Export“.
- Tests T-384, T-385 und E2E T-386; Anforderung NFR-156.

### Geändert
- Standard-HTML: Kapitel im Hauptbereich (`<main>`), damit Screenreader direkt zum Inhalt springen.
- T-377 prüft „ohne Bericht“ mit Markdown statt HTML.

### Behoben
- Export-Seite: Kontrollkästchen „Lesefassung“ und „Weiter mit …“ stehen wieder neben ihrer Beschriftung (`label.inline` in Formularzeilen).
- Export-Seite: Text der Karte „Designvorlagen“ nennt alle vier Formate statt nur HTML.
- T-357 wartet nach dem Benutzerwechsel, bis die Startseite neu aufgebaut ist (scheiterte unter Last).

### Dokumentation
- Benutzerdokumentation: Prüfbericht Barrierefreiheit als Übersicht je Format, Designvorlagen für alle vier Formate, Arbeitsablauf „Handbuch im Design ausgeben“, Kontexthilfe im Lesestil.
- Stand von docs/10 und der Doku-Übersicht im README auf v0.69.

## 0.68.0 – Etappe 68 (24.10.2026)

### Hinzugefügt
- **Barrierefreiheit für Word und PowerPoint (ADR-120):** Prüfbericht nach jedem Word- und PowerPoint-Export, wie beim PDF:
  - Word: Titel, Sprache, Überschriften als Formatvorlage, Bilder mit Alternativtext, Tabellen mit Kopfzeile;
  - PowerPoint: Titel, Sprache, jede Folie mit Titel, Bilder mit Alternativtext, Tabellen mit Kopfzeile.
- Karte „Barrierefreiheit (Word)“ bzw. „(PowerPoint)“ auf der Seite „Export“ mit Hinweis zur Abhilfe.
- Tests T-381, T-382 und E2E T-383; Anforderung NFR-155.

### Geändert
- Word-Exporte: Dokumentsprache Deutsch in den Standardformaten (auch mit Firmenvorlage), Icons als „dekorativ“ markiert, eindeutige Bild-IDs.
- Quick Reference Guide als Word: Titel und Kartentitel sind Überschriften (Navigationsbereich), Aussehen unverändert.
- Designvorlagen als PowerPoint: Folientitel als Titelplatzhalter, Icons als „dekorativ“ markiert.

## 0.67.0 – Etappe 67 (24.10.2026)

### Hinzugefügt
- **Kontexthilfe im Lesestil „Handbuch-Kapitel“ (ADR-119):** Das Hilfe-Widget in oneSCM übernimmt den gewählten Lesestil:
  - Farben und Schriften der Anpassung, Überschriften mit Balken;
  - Hinweisboxen mit Icon und Beschriftung in der Sprache des Inhalts;
  - Schaltflächen in der Hauptfarbe.
- Tests T-379 und E2E T-380 (axe auf der eingebetteten Hilfeseite); Anforderung NFR-154.

### Geändert
- „War das hilfreich?“ in der Kontexthilfe mit Icons (Daumen hoch/runter) statt Emoji; der zugängliche Name bleibt „Ja“/„Nein“.
- Icon-Generator um `thumbs-up` und `thumbs-down` ergänzt.

## 0.66.0 – Etappe 66 (24.10.2026)

Wahl des Auftraggebers vom 24.10.2026: barrierefreies PDF.

### Hinzugefügt
- **Barrierefreies PDF im Design (ADR-118):** Der Browser druckt mit `--export-tagged-pdf` und `--generate-pdf-document-outline`, also getaggt mit Lesezeichen aus den Überschriften. Die Tags folgen der HTML-Struktur der Vorlagen; dekorative Icons bleiben ausgeblendet.
- **Prüfbericht** nach jedem PDF-Export (`accessibility` in `POST /exports`, Karte „Barrierefreiheit (PDF)“ im Ergebnis):
  - getaggt, Strukturbaum, Sprache, Titel, Fenstertitel, Lesezeichen;
  - Überschriften, Alternativtexte der Abbildungen, Tabellen mit Kopfzellen.
  
  Angelehnt an PDF/UA, ohne Konformität zu behaupten.
- Tests T-376 (Prüfbericht, Druckschalter, Kennzahlen als Liste) und T-377 (API), E2E T-378 (mit Chromium); Anforderung NFR-153.

### Geändert
- Die Kennzahlen-Karten des Handbuch-Kapitels sind eine Liste (`ul`/`li`, „Kennzahlen“) – bessere Struktur für Screenreader und Tags.

## 0.65.0 – Etappe 65 (24.10.2026)

### Hinzugefügt
- **Lesestil „Handbuch-Kapitel“ (ADR-117):** neues Feld „Stil für Leseransicht, Druck und Online-Hilfe“ im Firmen-Layout (`readingStyle`: `standard` oder `fachdoku`, nur Administration).
  - **Leseransicht und Druck:** Abschnittsüberschriften in Schrift und Hauptfarbe der Vorlage mit Balken; Hinweisboxen mit farbigem Balken; Fließtext in der Textschrift. Im dunklen Modus bleiben die Textfarben der App.
  - **Online-Hilfe:** Kopfzeile, Überschriften, Links und Boxen in Farben und Schriften der Vorlage; Lucide-Icon vor der Beschriftung der Hinweisboxen. Weiterhin ohne Skripte.
- Tests T-374 (Einstellung, Online-Hilfe) und E2E T-375 (Leseransicht, axe); Anforderung NFR-152.

## 0.64.0 – Etappe 64 (24.10.2026)

Wahl des Auftraggebers vom 24.10.2026: PowerPoint im Design.

### Hinzugefügt
- **Designvorlagen als PowerPoint (ADR-116):** `POST /exports` mit `format: pptx` und `design`, Muster über `?format=pptx`, Schaltfläche „Muster als PowerPoint“.
  - **Quick Reference Guide:**
    - Titelfolie mit Marke, Hinweis „interaktiv“ und „Die Prozesse im Überblick“.
    - Je Abschnitt eine Karte mit abgerundetem Rahmen, Icon, Text, Bildschirmfoto und Warnbox; Links und häufige Fragen.
    - „STAND … | n/N“ auf jeder Folie.
  - **Handbuch-Kapitel:**
    - Kopfzeile mit Dokumentart und „Folie n von N“; Titelfolie mit Kennzahlen.
    - Abschnittsfolien mit Balken, Tabellen, Code, Bildern und Hinweisboxen.
  - Fortsetzungsfolien bei langen Inhalten; Farben, Schriften und Logo aus der Anpassung.
- PowerPoint-Generator: frei gestaltete Folien (Formen, Textfelder, Bilder, Tabellen), Läufe mit Farbe und Schrift, Schriftschema.
- Gemeinsame Icon-Grafiken für Word und PowerPoint (`services/designIconRaster.ts`).
- Tests T-371 (Folienaufbau, Fortsetzung, Nummerierung, Anpassung, eigener Import) und T-372 (API), E2E T-373; Anforderung NFR-151.

### Geändert
- PowerPoint-Export allgemein: Nummerierte Schritte behalten ihre Nummer aus dem Markdown (`startAt`), auch nach Unterpunkten und auf Folgefolien.
- T-336 erwartet bei nummerierten Absätzen zusätzlich die Nummer (`num`).

## 0.63.0 – Etappe 63 (24.10.2026)

### Hinzugefügt
- **Designvorlagen als Word-Dokument (ADR-115):** `POST /exports` mit `format: docx` und `design`, Muster über `?format=docx`, Schaltfläche „Muster als Word“.
  - **Quick Reference Guide:**
    - A4 quer; Titelzeile mit Marke; darunter zwei Spalten mit „Die Prozesse im Überblick“ und Karten mit Rahmen in der Akzentfarbe.
    - Warnbox mit Icon; Tipp, Links, häufige Fragen.
    - Fußzeile „Hinweis: …“ und „STAND: … | Seite/Seiten“.
  - **Handbuch-Kapitel:**
    - Kopfzeile mit Dokumentart und „Seite n von N“.
    - Überschrift 1 mit Untertitel, Kennzahlen-Karten, nummerierte Abschnitte als Überschrift 2 mit Balken.
    - Hinweis-, Wichtig-, Warn- und Querverweis-Boxen; Fußzeile.
  - Echte Formatvorlagen in Schrift und Farben der Anpassung (ADR-114); Lucide-Icons als SVG mit PNG-Ersatzdarstellung.
- Gemeinsame Funktionen für Überblick, Kartentitel, Kennzahlen, Kopf- und Fußzeile – HTML, PDF und Word zeigen dieselben Inhalte.
- Tests T-368 (Aufbau des Word-Dokuments), T-369 (API) und E2E T-370; Anforderung NFR-150.

### Geändert
- Word-Export allgemein: Nummerierte Listen zählen je Liste neu, eine fortgesetzte Liste (z. B. ab 6) zählt weiter. Bisher lief die Zählung über alle Listen des Dokuments.
- Die Prüffassung gibt es nur im Standard-Design (400 mit Hinweis).
- T-366 prüft das Audit-Protokoll ohne die nur in SQLite vorhandene Spalte `rowid` (scheiterte auf PostgreSQL).

## 0.62.0 – Etappe 62 (24.10.2026)

Wahl des Auftraggebers vom 24.10.2026: Designvorlagen anpassbar machen.

### Hinzugefügt
- **Designvorlagen anpassen (ADR-114)** je Vorlage und Projekt:
  - Hauptfarbe, Akzentfarbe, Warnfarbe;
  - Schrift der Überschriften und des Textes (mit Serifen oder serifenlos, nur Systemschriften);
  - Logo rechts, links oder ohne.
- **Prüfung:** Farben nur als `#rrggbb`; Kontrast zu Weiß mindestens 4,5 : 1 für Textfarben und 3 : 1 für Rahmen und Icons. Fehler kommen gesammelt als Sätze zurück.
- **API:**
  - `POST /design-templates/:id/preview`: Vorschau ohne Speichern.
  - `PUT` und `DELETE /design-templates/:id/theme`: speichern bzw. zurücksetzen, nur Administration, im Audit-Protokoll.
  - `GET /design-templates` mit `theme`, `defaultTheme`, `customized` und `minContrast`.
- **Einstellungen:** Karte „Designvorlagen anpassen“ mit Farbwählern, Kontrastanzeige, Schriften, Logo-Position und einer Vorschau, die beim Ändern nachzieht (abgeschottetes iframe).
- Export im Design (HTML und PDF), Muster und Muster als PDF übernehmen die Anpassung.
- Tests T-365 (Darstellung, Prüfung), T-366 (API) und E2E T-367 (Oberfläche, axe); Anforderung NFR-149.

### Geändert
- Die Kontrastberechnung für Hausfarbe und Designvorlagen ist gemeinsam (`domain/designs.ts`); in der Oberfläche liegt sie in `contrast.ts`.

## 0.61.0 – Etappe 61 (24.10.2026)

### Hinzugefügt
- **PDF im Design (ADR-113):** Quick Reference Guide und Handbuch-Kapitel entstehen direkt als PDF. Dafür druckt ein lokal installierter Chromium, Chrome oder Edge (`PDF_BROWSER_PATH`) die Vorlage:
  - ohne Shell, mit eigenem Profil im Temp-Ordner und mit Zeitlimit (`PDF_BROWSER_TIMEOUT_MS`);
  - ohne Netz, alle Namen lösen ins Leere auf;
  - Seitenformat, Kopf- und Fußzeilen mit Seitenzahl wie in der Vorlage.
- `POST /exports` mit `format: pdf` und `design`; `GET /design-templates` nennt die verfügbaren `formats`; `GET /design-templates/:id/sample?format=pdf` liefert das Muster als PDF.
- Seite **Export:**
  - Hinweis, ob PDF im Design eingerichtet ist;
  - Auswahl „Design“ auch beim Format PDF;
  - Schaltfläche „Muster als PDF“;
  - „Für den Export wählen“ stellt PDF ein, wenn verfügbar.
- Tests T-362 (Druckaufruf, Fehler), T-363 (API mit Ersatzbrowser, ohne Browser, defekter Browser) und E2E T-364 (mit Chromium aus Playwright); Anforderung NFR-148.

### Geändert
- Ohne eingerichteten Browser lehnt die App PDF im Design mit Hinweis auf `PDF_BROWSER_PATH` und das HTML-Format ab (400). Scheitert der Browser, kommt 503 mit der Fehlermeldung des Browsers.
- Die E2E-Konfiguration richtet für den Server den Chromium von Playwright als PDF-Browser ein (`PDF_BROWSER_NO_SANDBOX=1`).
- Korrektur aus CI (Etappe 60): Die Karten der Designvorlagen sind keine benannten Regionen mehr. Die Karte „Handbuch-Kapitel“ machte `getByLabel('Handbuch')` in T-222 mehrdeutig; die Überschrift bleibt.

## 0.60.0 – Etappe 60 (24.10.2026)

Wunsch des Auftraggebers vom 24.10.2026: Er hat zwei Muster geliefert (einen Quick Reference Guide und ein Handbuch-Kapitel) mit der Bitte, sie detailgetreu als Designvorlagen anzulegen und professionelle Icons zu nutzen.

### Hinzugefügt
- **Designvorlagen für den HTML-Export (ADR-112).** Der Parameter `design` von `POST /exports` gilt nur für das Format html.
  - **Quick Reference Guide** (`quickref`, A4 quer):
    - Kopf: Serifentitel, rechts die Marke mit Zusatz, darunter der Hinweis „Dieses Dokument ist interaktiv“.
    - „Die Prozesse im Überblick“ mit römischen Nummern.
    - Karten in zwei Spalten mit abgerundetem hellblauem Rahmen, nummerierten Schritten und Bildschirmfotos rechts.
    - Rote Warnboxen; Hinweis und Tipp mit vorangestelltem Wort.
    - Karten „Wichtige Links und Ansprechpartner“ und „Häufig gestellte Fragen und Antworten“.
    - Fußzeile je Seite „Hinweis: …“ und „STAND: TT.MM.JJJJ | n/N“. Vorgabeprofil ist Quick Guide.
  - **Handbuch-Kapitel** (`fachdoku`, A4 hoch):
    - Kopfzeile je Seite mit Dokumentart in Großbuchstaben und „Seite n von N“.
    - Titel in Dunkelblau mit Untertitel; vier Kennzahlen-Karten mit Icons.
    - Nummerierte Abschnitte mit Balken; Tabellen mit grauem Kopf.
    - Boxen für Hinweis, Wichtig, Warnung und Querverweis; Code- und Ablaufdarstellung; Fußzeile.
- **Muster** je Vorlage mit fiktiven Inhalten (`GET /design-templates`, `GET /design-templates/:id/sample`). Sie zeigen Marke, Logo und Texte des Projekts.
- Seite **Export**: Karte „Designvorlagen“ mit „Muster ansehen“ und „Für den Export wählen“ sowie die Auswahl „Design“ beim Format HTML.
- **Firmen-Layout**: neue Felder „Zusatz unter der Marke“, „Dokumentart in der Kopfzeile“ und „Wichtige Links und Ansprechpartner“ (Markdown).
- **Icons** in den Dokumenten: Lucide (ISC) als Inline-SVG. Das Skript `apps/server/scripts/gen-design-icons.mjs` erzeugt sie; der Server erhält dadurch keine neue Abhängigkeit.
- Tests T-359 (Darstellung), T-360 (API) und E2E T-361 (Oberfläche; axe auch für die Muster); Anforderung NFR-147.

### Geändert
- Die Muster übernehmen keine Marke Dritter (kein Logo, kein Markenzeichen, keine Hausschrift). Ohne eigenes Logo erscheint ein neutrales Buchzeichen.
- Farben der Muster für Kontrast nach WCAG AA leicht abgedunkelt (Blau der Links, Tabellenkopf, Ablauftext).
- T-232 öffnet die Glossar-Erklärung erneut, falls der Klick während des Neuaufbaus nach „Markierung entfernen“ ins Leere geht (scheiterte einmal in CI unter Node 20).

## 0.59.0 – Etappe 59 (24.10.2026)

### Hinzugefügt
- **Icons auf allen Seiten (ADR-111, Fortsetzung):** die restlichen Emoji der Oberfläche als Lucide-Icons.
  - Quellformate (Markdown, HTML, Word, PowerPoint, PDF, Video, Untertitel, Jira, ZIP) in Einlesen, Quellen je Überschrift, Dubletten und oneSCM_Metadaten.
  - Blocker, Warnungen und Prüfergebnisse.
  - Hinweisarten in Werkstatt und Leseransicht (Hinweis, Tipp, Warnung, Querverweis, Lücke).
  - Werkzeuge des Screenshot-Editors, Sperren/Entsperren, Kommentar, Bearbeiten, Export/Import, Schließen.
  - Leseransicht in allen neun Sprachen: Merken (Stern, gefüllt wenn gemerkt), Notiz, häufige Fragen, Übersetzung angefordert.
- Gemeinsamer Baustein `components/icons.tsx` (Icon im Text, Format-Icon, erfüllt/nicht erfüllt, Warnung, Blocker).
- E2E T-358: Seiten ohne bunte Emoji, Format-Icons im Einlesen, axe.

### Geändert
- Beschriftungen ohne Emoji, z. B. „KI-umformuliert“, „Merken“/„Gemerkt“, „Notiz hinzufügen“; die Tests sprechen die Schaltflächen über den Text an.
- Die Kommentar-Schaltfläche der Werkstatt hat einen zugänglichen Namen („Kommentar“).
- Einfarbige Textzeichen wie ✓, ✎ und ✖ bleiben an einigen Stellen; Rollen- und Spartenzeichen stammen aus den Stammdaten und bleiben unverändert.

## 0.58.0 – Etappe 58 (24.10.2026)

Wunsch des Auftraggebers vom 24.10.2026: Oberfläche verbessern, professionelle Icons verwenden.

### Hinzugefügt
- **Einheitliche SVG-Icons mit Lucide (ADR-111):** statt Emoji in der gesamten Navigation, im Kopf (Logo, Ein-/Ausklappen, Menü), auf den Aufgaben-Kacheln der Startseite und auf den Hauptschaltflächen von Kapitelwerkstatt, Leseransicht und Dialogen. Linien-Icons in `currentColor` passen zu Hell- und Dunkelmodus. Sie werden lokal mitgebaut, ohne Nachladen aus dem Netz.
- E2E T-357 (axe hell und dunkel); Anforderung NFR-146; neue Abhängigkeit `lucide-react` 1.54.0 (ISC).

### Geändert
- Feinschliff: Icon-Flächen auf den Startkacheln, ruhigere Navigation (Abstand, Deckkraft, aktiver Eintrag), Kacheln heben sich beim Überfahren leicht an (nicht bei „Bewegung reduzieren“).
- Barrierefreiheit: Icons sind für Screenreader ausgeblendet; Schaltflächen heißen wie ihr sichtbarer Text (z. B. „KI-Vorschlag“ statt „✨ KI-Vorschlag“).
- T-172: Die Zusammenfassung des Stammdaten-Imports enthält die Zählung „übersprungen“ (Nachtrag zu Etappe 57).

## 0.57.0 – Etappe 57 (24.10.2026)

Entscheidung des Auftraggebers vom 24.10.2026 (S-04): „MO-Prüfungen“ im Fließtext, „MO Checks“ nur in Menüpfaden und als UI-Begriff in Anführungszeichen. Offen bleiben die Schreibweise der Systemnamen (später nach Oberfläche), der deutsche Begriff für „Grace Period“ (Redaktion) und U-07.

### Hinzugefügt
- **UI-Begriffe in der Terminologie (ADR-110):** Merkmal „UI-Begriff erlaubt“ je Begriff. Die zu vermeidenden Varianten werden nur im Fließtext gemeldet; erlaubt bleiben sie in Anführungszeichen, in fett gesetzten Menüpfaden und direkt am Trenner „›“. Pflege auf der Seite „Terminologie“; die KI-Umformulierung erhält einen entsprechenden Hinweis.
- **SYNONYME.csv in die App übernehmen:** Der Glossar-Import der Stammdaten liest die Datei des Arbeitsordners (Spalte „Bevorzugt“, neue Spalte „UI-Begriff erlaubt“). Zeilen mit Status „offen“ oder „Vorschlag“ werden übersprungen und so gekennzeichnet.
- Tests T-354, T-355, E2E T-356 (axe); Anforderung NFR-145; Migration 063.

### Geändert
- Vorlagen des Arbeitsordners: `SYNONYME.csv` („MO-Prüfungen“ entschieden, neue Spalte „UI-Begriff erlaubt“), `BEGRIFFE.md`, `CLAUDE.md`, Agent `sprach-lektor`.
- Schreibstil: „MO Checks“ ist nicht mehr Beispiel für erlaubte Begriffe.

## 0.56.0 – Etappe 56 (24.10.2026)

### Hinzugefügt
- **Zuschaltbare Regelsätze (ADR-109, S-06):** ein- und ausschalten je Projekt unter „Schreibstil › Regeln“, jede Regel einzeln abschaltbar. Die Funde zählen als Regel „Regelsatz“ in Schreibstil, Kapitelprüfung, Kapitelbewertung, Prüferprofil „Redaktion“ und Fehlerliste.
  - **Regelbasiertes Schreiben** (Deutsch): eine Handlung je Schritt, Bedingung vor Handlung, direkt auffordern, Schritte höchstens 20 Wörter, genau verweisen, keine doppelte Verneinung, keine Klammern in Schritten.
  - **Simplified Technical English** (Englisch, Schreibregeln von ASD-STE100 ohne das geschützte Wörterbuch): Satzlänge 20/25 Wörter, eine Anweisung je Satz, Aktiv, keine -ing-Formen, klare Anweisungen, höchstens sechs Sätze je Absatz.
  - **Vale-Stile** einlesen (YAML-Dateien oder ZIP mit dem Stilordner) mit den Regeltypen existence, substitution (mit Korrektur per Klick) und occurrence. Nicht unterstützte Regeln und unsichere Muster werden mit Grund genannt. Die Prüfung läuft lokal in der App.
- **Benachrichtigung zum Länderreview (ADR-109):**
  - Prüferin bzw. Prüfer und Vertretung erhalten beim Anfordern einen Hinweis.
  - Die anfordernde Person erhält das Ergebnis.
  - Zustellung über „Aufgaben & Hinweise“ sowie Webhook/E-Mail je Einstellung.
  - Der Link und „Meine Länderreviews“ öffnen die Übersetzung direkt.
- Tests T-349 … T-352, E2E T-353 (axe); Anforderungen NFR-142 … NFR-144; Migration 062.

### Geändert
- Einstellungen: Die Schaltfläche der Karte „Ansprechperson festlegen“ heißt „Ansprechperson speichern“; ein zweites „Speichern“ auf der Seite war mehrdeutig (E2E T-210).
- E2E T-234 öffnet die englische Glossar-Erklärung erneut, falls sie beim Nachladen des Glossars schließt (einmal in CI unter Node 22).

## 0.55.0 – Etappe 55 (24.10.2026)

Entscheidungen des Auftraggebers vom 24.10.2026: G-04 LanguageTool als Java-Dienst ohne Docker; O-09 Benutzer je Land/Markt als Ansprechperson mit Vertretung; U-07 ohne Auswahl (bleibt offen).

### Hinzugefügt
- **Lokale Grammatikprüfung mit LanguageTool (ADR-108, G-04):**
  - Die Stilprüfung von Texten und Kapiteln nutzt einen selbst betriebenen LanguageTool-Dienst (`LANGUAGETOOL_URL`, nur lokale bzw. interne Adressen).
  - Funde als Grammatik, Rechtschreibung, Zeichensetzung und Groß-/Kleinschreibung mit Korrektur per Klick; Markdown wird neutralisiert, ohne Stellen zu verschieben.
  - Ohne Dienst gelten die eigenen Regeln. Status in Schreibstil und Einstellungen.
  - `tools/languagetool` mit Startskripten (Linux/macOS, Windows) und `pom.xml` für LanguageTool 6.6 aus Maven Central.
  - Geprüft mit dem echten LanguageTool 6.6 unter OpenJDK 21.
- **Ansprechperson je Markt (O-09):**
  - Je Land/Markt (optional je Sprache) ein Benutzer mit Vertretung, gepflegt in den Einstellungen.
  - Länderreviews ohne gewählte Prüferin gehen automatisch an die Ansprechperson, bei gesperrtem Konto an die Vertretung. Die Vertretung darf prüfen.
  - „Meine Länderreviews“ auf der Seite Übersetzungen.
- Tests T-345 … T-347, E2E T-348 (axe); Anforderungen NFR-140, NFR-141; Migration 061.

## 0.54.0 – Etappe 54 (24.10.2026)

### Hinzugefügt
- **Textbausteine (ADR-107, W-11, Single Sourcing):** wiederkehrende Absätze einmal pflegen – Kennung, Art, Fassungen mit Notiz; als gesperrten, verknüpften Absatz in Kapitel einfügen; Verwendung je Kapitel mit „aktuell“/„veraltet“; neue Fassung mit einem Klick in die Entwürfe der Kapitel übernehmen (freigegebene Versionen bleiben, eingereichte werden übersprungen); gleiche, noch nicht verknüpfte Absätze verknüpfen; wiederkehrende Absätze als Kandidaten; eigener Text löst die Verknüpfung. Kennzeichen in der Werkstatt.
- **Übersicht oneSCM_Metadaten schneller:** teure Zählungen je Projekt höchstens 30 s zwischengespeichert, bei Import, Labeln, TRIAGE und Entfernen sofort verworfen (offener Punkt aus dem Lasttest der Etappe 49).
- Seite „Textbausteine“ (auch in der Barrierefreiheitsprüfung); Tests T-341 … T-343, E2E T-344 (axe); Anforderungen NFR-138, NFR-139; Migration 060.

### Geändert
- E2E T-291 wartet nach jedem Hinzufügen eines Labels auf die neu geladene Liste (Wettlauf in CI unter Node 22).

## 0.53.0 – Etappe 53 (24.10.2026)

### Hinzugefügt
- **Vorher/Nachher-Belege (ADR-106, W-05):** zwei Fassungen eines Bildes mit Schieberegler, Anlass, Änderung, Wirkung und Ticket; „Als Bild ins Archiv“ legt eine Gegenüberstellung ab, die sich in Kapitel einfügen lässt (erneut erzeugt = neue Fassung).
- **Ausgabe als PowerPoint (W-07):** Exportformat `pptx` (16:9) mit Titelfolie, Übersicht je Kapitel, Inhaltsfolien je Abschnitt (Aufzählungen, Nummerierung, Fettdruck, Hinweisarten) und einer Folie je Bild; Hausfarbe aus dem Firmen-Layout. Eigener Generator, ohne neue Abhängigkeit.
- **Klickstrecke als BPMN 2.0 (W-07):** Start, Aufgabe je Station, parallele Wege zwischen exklusivem Gateway und Zusammenführung, Ende – mit Diagramm für Camunda Modeler oder bpmn.io.
- **Zwischenbilder aus Videos (W-10):** kurz geöffnete Menüs und Dialoge (bis 2 s) zusätzlich zu den Standbildern, rot umrahmt; abschaltbar mit `MEDIA_TRANSIENT_STILLS=false`.
- Seite „Vorher/Nachher“ (auch in der Barrierefreiheitsprüfung); Tests T-336 … T-339, E2E T-340 (axe); Anforderungen NFR-135 … NFR-137; Migration 059.

## 0.52.0 – Etappe 52 (24.10.2026)

### Hinzugefügt
- **Textvarianten je Kapitel (ADR-105, S-05):** Endanwender (Zweck, Voraussetzungen, Schritte, Ergebnis, Hinweise), Fachtext (vollständig) und Kurzfassung für das Management (etwa ¼ der Länge, regelbasiert aus Zweck, Ergebnis, Warnhinweisen und Ablauf; auf Wunsch vom KI-Dienst, ohne erfundene Zahlen). Wortzahl und Anteil je Variante, Download als Markdown, Exportprofil „Kurzfassung“.
- **Vier Prüferprofile (W-12):**
  - **Fachlich:** Widersprüche, unbelegte Aussagen, Zahlen ohne Quelle.
  - **Redaktion:** Stil und Anleitungs-Check.
  - **Compliance:** personenbezogene Daten, unhaltbare Zusagen, folgenreiche Aktion ohne Warnhinweis, Warnhinweis-Schema.
  - **Endanwender:** Lesbarkeit, lange Sätze, Fachjargon, unerklärte Abkürzungen.
  - Je Profil Wert und Ampel; auf Wunsch ergänzt ein lokaler KI-Dienst Funde. Verlauf je Kapitelversion.
- Seiten „Textvarianten“ und „Prüferprofile“ (auch in der Barrierefreiheitsprüfung); Tests T-332 … T-334, E2E T-335 (axe); Anforderungen NFR-133, NFR-134; Migration 058.

## 0.51.0 – Etappe 51 (24.10.2026)

### Hinzugefügt
- **Änderungsvorschläge (ADR-104):** Word-Rücklauf und KI-Lektorat erzeugen eine gemeinsame Vorschlagsliste je Absatz (geändert, neu, entfällt). Übernommen wird in einen Entwurf; bei freigegebener Version entsteht er als Kopie, die freigegebene Version bleibt. Geänderte Absätze machen den Vorschlag „veraltet“ statt überschrieben zu werden.
- **Word zurücklesen (W-06):**
  - Export Word als „Prüffassung“: Lesefassung mit „Fertig, wenn: …“ je Kapitel und Exportkennung in den Dokumenteigenschaften.
  - Die in Word bearbeitete Datei wird zurückgelesen; Kapitel über die Exportkennung bzw. den Titel, Abschnitte über die Überschrift, Absätze über Wortähnlichkeit – auch mehrteilige Absätze und Hinweiskästen.
- **KI-Lektorat mit Wortvergleich (G-07):** je Kapitel eine Umformulierung je Absatz (lokaler KI-Dienst, sonst Regelkorrekturen), Wortvergleich mit Original beim Überfahren, Übernehmen, eigene Fassung, Verwerfen, „Alle übernehmen (Kapitel)“.
- **Interne Kommentare und Drei-Spalten-Ansicht (W-08):** interner Kommentar je Vorschlag und Absatz, der in keinem Export steht (der JSON-Export entfernt ihn); Seite „Überarbeitung“ mit Stand | Vorschlag | Neu.
- Seite „Überarbeitung“ (auch in der Barrierefreiheitsprüfung); Tests T-328 … T-330, E2E T-331 (axe); Anforderungen NFR-130 … NFR-132; Migration 057.

## 0.50.0 – Etappe 50 (24.10.2026)

### Hinzugefügt
- **Plausibilität je Aussage (ADR-103, W-02):** Jeder Satz wird gegen die Quellen seines Absatzes eingestuft – belegt, unbelegt (ohne bzw. unbestätigte Quelle, Zahl fehlt in der Quelle, geht über die Quelle hinaus), Widerspruch (Quelle in offenem Widerspruch), fehlend (Lücke). Der Wert 0–100 je Kapitelversion zählt Widersprüche doppelt.
- **Kapitelbewertung (S-07):**
  - Fünf Kriterien: Sprache (Stilwert und Lesbarkeit), Ziel (Anleitungs-Check), Tonalität, Quellenabgleich (Plausibilität), Fakten (Zahlen und Kennungen in den Quellen).
  - Ampel je Kriterium: grün ab 80, gelb ab 60. Die Gesamtampel ist höchstens so gut wie das schwächste Kriterium.
  - Seite „Kapitelbewertung“ mit Übersicht aller Kapitel.
- **Fehlerliste in der App (G-05):**
  - Funde der Stilprüfung übernehmen (dieselbe Fundstelle nur einmal); Einträge von Hand erfassen.
  - Status offen, korrigiert, abgelehnt (mit Begründung), Regel fehlt; Korrekturen im Kapitel werden erkannt.
  - Export und Rückimport wie `FEHLERLISTE.csv`; `abgleich --app` schreibt die Liste in den Arbeitsordner.
- Seiten „Kapitelbewertung“ und „Fehlerliste“ (auch in der Barrierefreiheitsprüfung); Tests T-324 … T-326, E2E T-327 (axe); Anforderungen NFR-127 … NFR-129; Migration 056.

## 0.49.0 – Etappe 49 (24.10.2026)

### Hinzugefügt
- **Tonalität je Produktart und Rolle (ADR-102, S-02):**
  - Vier Töne: sachlich, freundlich, formell, knapp. Ton je Produktart mit Vorgabe aus `TONALITAET.md`, dazu Rollenprofile für Dealer, Markt, MO und HQ.
  - Neue Prüfregel „Tonalität“, je nach Ton: Werbesprache, Verkürzungen und Smileys, Floskeln und Satzlänge, strenge Formulierungen.
  - Die Kapitelprüfung wählt den Ton je Absatz nach seiner Rolle. Die KI-Umformulierung und der KI-Vorschlag je Absatz treffen den Ton.
- **Ticket-Einstufung (W-03):**
  - genehmigt, in Prüfung, intern oder Background je Jira-Ticket (Berechtigung „Entscheiden“).
  - Intern und Background fließen nicht in Kapitel. Background zählt nur in der Lückenanalyse und erscheint in keinem Releaseletter.
- **Releaseletter aus dem Projektvergleich (W-04):**
  - Vergleich zweier Handbuch-Releases: neue und geänderte Kapitel, Bildfassungen, neue Funktionen („gültig ab“ = Version), abgelöste Funktionen, Tickets der Version.
  - Daraus ein Letter-Entwurf auf Deutsch oder Englisch.
- **Zukunfts-Inhalte (W-09):** Kapitel mit späterem „gültig ab“ blendet der Export (Feld „Stand“) bzw. das Handbuch-Release bis zu ihrer Version aus.
- Tests T-319 … T-322, E2E T-323 (axe); Anforderungen NFR-123 … NFR-126; Migration 055.

### Geändert
- Die Tonprüfung ist standardmäßig aktiv (Handbuch: sachlich) und lässt sich mit der Regel „Tonalität“ abschalten.
- Bug-Tickets ohne Einstufung gelten als intern und sind keine Quelle mehr für Kapitel.
- Der KI-Vorschlag je Absatz nutzt den Prompt `rewrite-1.1` (mit Ton).
- `GET /style/rules` liefert zusätzlich `tone`.

### Behoben
- **TRIAGE sperrt den Server nicht mehr:** Sie arbeitet in Teilschritten zu 250 Chunks mit je eigener Transaktion. Vorher lief sie in einer einzigen Transaktion über alle Chunks, und andere Anfragen warteten (12 000 Chunks ≈ 7 s).
- **Übersicht oneSCM_Metadaten** zählt gelabelte Chunks mit `EXISTS` statt per Join über alle Zuordnungen: 31 statt 504 ms bei 12 000 Chunks. Ein abgebrochener TRIAGE-Lauf steht auf „failed“.
- Lasttest wiederholt (`docs/lasttest-metadaten.md`), Skript misst die Funktionen der Etappen 48 und 49 und wartet auf die TRIAGE.

## 0.48.0 – Etappe 48 (24.10.2026)

### Hinzugefügt
- **Übersetzung (ADR-101, U-01 … U-10):**
  - **Übersetzungsspeicher:** freigegebene Absätze je Sprachpaar; 100-%-Treffer werden beim Anlegen übernommen, ähnliche ab 75 % vorgeschlagen; Pflege, Export und Import wie `SPEICHER.csv`.
  - **Weitere Prüfungen:** Längenverhältnis außerhalb 0,55–1,8, deutsche Wörter im Zieltext, Datum oder Kennung nur auf einer Seite.
  - **Länderreview** je Sprache und Markt mit MQM-Fehlerpunkten (bestanden bis 5 je 1 000 Wörter), „zurück an Übersetzung“, Freigabe durch das Land vor der Freigabe der Übersetzung.
  - **Glossar je Sprache** mit Export (wie `GLOSSAR.csv`, Excel) und Rückimport.
  - **XLIFF 1.2 und Excel** für Übersetzungsbüros, Rückimport mit Vorschau und Prüfung.
  - **Rückübersetzung** einer Stichprobe (10 %) der Sicherheitshinweise.
  - **Sprachen de-CH und fr-CH:** Schweizer Hochdeutsch nach Regeln aus dem deutschen Master (ss statt ß, «…»), Schweizer Französisch auf Basis der freigegebenen französischen Fassung.
  - **Rahmentexte** in Export und Druck je Sprache (Titel, Stand, Inhalt, Seite, Gültig ab, Hinweisarten, Verzeichnisse, Historie).
  - **Releaseletter DE↔EN** übersetzen und prüfen; Freigabe übernimmt die Zeilen in den Speicher.
  - **Hinweis auf Bilder ohne Fassung** in der Zielsprache.
- Seiten **Übersetzungsspeicher** und **Glossar je Sprache**; im Arbeitsordner Sprachordner `10_Deutsch_DE-CH`, `11_Französisch_FR-CH`, Abgleich von Speicher und Glossar mit der App.
- Tests T-314 … T-317, E2E T-318 (axe); Anforderungen NFR-118 … NFR-122; Migration 054.

### Geändert
- Die Demo-KI (ohne eingerichteten KI-Dienst) pseudo-lokalisiert statt deutschen Text auszugeben; ins Deutsche läuft sie rückwärts.

### Behoben
- **Bildarchiv:** Labels und Kapitel werden einzeln hinzugefügt bzw. entfernt (`addLabelIds`, `removeLabelIds`, `addChapterIds`, `removeChapterIds`). Schnell nacheinander gewählte Labels überschreiben sich nicht mehr gegenseitig (Ursache von T-291 in CI).

## 0.47.0 – Etappe 47 (24.10.2026)

### Hinzugefügt
- **Agent TRIAGE (ADR-100):** läuft nach jedem Einlesen (abschaltbar unter Einstellungen) und auf Anforderung (oneSCM_Metadaten › Triage).
  - Pflichtlabels je Chunk mit Sicherheit und Begründung: Version, Status (live, Entwurf, in Bearbeitung), Domäne, Rolle (Dealer, MO, Market, HQ, Sonstiges), Sprache, Sparte (Pkw, Van, Pkw+Van), Markt, Detaillevel, zu prüfen.
  - Labels von Menschen gehen vor; TRIAGE ersetzt nur eigene Zuordnungen.
  - Kapitel und Unterkapitel für gemischte Quellen als Vorschlag: verschieben, neues Unterkapitel mit Kennung „neu“, nicht zugeordnet (zu prüfen). Übernehmen, Verwerfen, alle übernehmen; neue Unterkapitel bestätigen.
- **Detaillevel** Basis, Basis+, Zusatz, Intern, HappyPath, Edge, inPrüfung steuern die Kapitelerzeugung: HappyPath im Standardablauf, Edge unter „Fehlerbehebung“. Die Detaillierung je Kapitel stellen Sie in der Kapitelsteuerung ein (Standard ohne Intern und inPrüfung).
- **Inhalts-Dashboard:** Chunks, Wörter und Labels je Kapitel und Domäne, Anteil je Pflichtgruppe, Detaillevel, offene Vorschläge.
- **Labels löschen** (admin): Zuordnungen werden entfernt, Katalog-Labels kommen beim Abgleich nicht wieder.
- **Agenten in der App:** Übersicht aller Agenten, Aufgaben (offene Todos) und Entscheidungen.
  - **ORCHESTRATOR** plant Aufgaben aus dem Stand, verfeinert sie bei jedem Lauf, legt Entscheidungen vor und führt getroffene Entscheidungen aus. Entscheiden darf nur ein Mensch mit der Berechtigung „Entscheiden“.
  - **GOAL** vergleicht den Stand aller Funktionen mit dem Ziel (zehn Kriterien mit Sollwert) und erstellt Empfehlungen; nicht erfüllte Kriterien werden Aufgaben.
- **Arbeitsordner:** Ordner `12_Goal` (Ziel, Abgleich, Empfehlungen) und `00_Dokumentation/Agenten` (Aufgaben, Entscheidungen, Triage), Agenten `orchestrator`, `triage`, `goal`, Grundregel 10. `abgleich --app` übernimmt Aufgaben, Entscheidungen und Ziel-Abgleich und legt für neue Unterkapitel der Triage Ordner `neu_<Titel>` an.
- Tests T-309 … T-312, E2E T-313 (axe); Anforderungen NFR-114 … NFR-117; Migration 053.

### Geändert
- Labelkatalog: neue Gruppen Version, Status, Sprache, Markt, Detaillevel, zu prüfen; Rolle „Sonstiges“, Domäne „Allgemein“, Sparte „Pkw+Van“.
- Domänenkarte und Zugriffsmatrix werten nur Labels von Menschen bzw. echte Rollen aus.

## 0.46.0 – Etappe 46 (24.10.2026)

### Verbessert
- **RAG-Komponente „Frage an alle Quellen“ (ADR-099, Messung in [docs/11](docs/11-rag-messung.md)):** neues Suchverfahren v2 (Standard).
  - Deutsche Morphologie: Partizip, trennbare Verben, Umlaute, Zerlegung von Komposita, Wortteile.
  - Kennungen wie E-4711 und ONESCM-1234.
  - Abfrageerweiterung aus Terminologie (Synonyme, Übersetzungen) und Abkürzungen.
  - BM25 mit Kontextkopf (Datei, Überschriften) und Vektor, verbunden per Reciprocal Rank Fusion.
  - Relevanzschwelle mit begründeter Enthaltung („in den Quellen nicht gefunden: …“).
  - MMR-Auswahl ohne Dubletten älterer Fassungen; Satzauswahl im Zusammenhang der Überschrift, bei Mengen- und Zeitfragen bevorzugt mit Zahl.
- **Gemessen** am fiktiven Messbestand:
  - Abstimmungssatz: bestanden 53 % → 89 %, Treffer@1 61 % → 81 %, Lückenfragen richtig 20 % → 80 %.
  - Prüfsatz: bestanden 77 % → 82 %.
  - Laufzeit bei 2 000 Dokumenten unverändert (Median ca. 210 ms).
- **KI-Antworten** erhalten die Begriffe der Abfrageerweiterung als Hinweis.

### Hinzugefügt
- **Antwortqualität:** Prüflauf je Verfahren (v1/v2) und Kennzahl **nDCG@6**, auch im Vergleich mit dem vorigen Lauf.
- **Lokale KI- und Embedding-Dienste:** `LLM_LOCAL=true` bzw. `EMBEDDINGS_LOCAL=true` mit einer Adresse auf diesem Rechner oder im eigenen Netz (z. B. Ollama). Der Dienst gilt als intern, die Daten bleiben lokal.
- Messskript `apps/server/scripts/rag-bench.ts` mit fiktivem Messbestand; Tests T-305 … T-307, E2E T-308 (axe); Anforderungen NFR-111 … NFR-113.

## 0.45.0 – Etappe 45 (24.10.2026)

### Hinzugefügt
- **Pipeline, Backlog, Intern (ADR-098):** neue Bereiche in der Navigation.
  - **Pipeline:** Jira-Tickets in Bearbeitung, noch nicht produktiv, je Kapitel und Unterkapitel der aktuellen Gliederung, mit Erstelldatum, Stream, Produktionsdatum und der vorab geschriebenen Dokumentation.
  - **Backlog:** Tickets, deren Bearbeitung noch nicht begonnen hat.
  - **Intern:** Testing, Reporting, Systeme, Migration, Rollout, Other – nie im Handbuch.
- **Aus Jira-Tickets abgleichen:**
  - Ordnet nach Status und Produktionsdatum ein (Backlog → Pipeline, sobald in Bearbeitung; erledigt mit Produktionsdatum in der Zukunft bleibt in der Pipeline) und schlägt den Gliederungspunkt vor.
  - Ein von Hand gesetztes Produktionsdatum bleibt; Bugs bekommen keinen Eintrag.
- **Ins Handbuch übernehmen:** Ist ein Ticket produktiv, wird die Dokumentation als Quelle des Kapitels eingelesen (Evidenz unbestätigt). Der Eintrag bleibt als Nachweis.
- **Jira-Import:**
  - Liest die Felder „Stream“ und „Produktionsdatum“ (auch „Production Date“, „Go-Live Date“).
  - Erkennt deutsche Datumsangaben TT.MM.JJJJ.
- **Kapitelwerkstatt und Kapitelsteuerung:** zeigen die Pipeline-Tickets des Kapitels.
- **Arbeitsordner:**
  - Neue Ordner `09_Pipeline` (Unterordner nach der Gesamtgliederung, `00_Ohne_Zuordnung`, `PIPELINE.md`), `10_Backlog` (`BACKLOG.md`) und `11_Intern` (`01_Testing` … `06_Other` mit `THEMA.md`).
  - Grundregel 9 in `CLAUDE.md`, neuer Agent `pipeline-redakteur`, die Regel in allen Agenten.
  - `abgleich --app` schreibt die Einträge als Dateien (eigene Änderungen bleiben, App-Fassung als `.neu`).
- Migration `052_work_areas.sql`; Tests T-301 … T-303, E2E T-304 (axe); Anforderungen NFR-108 … NFR-110.

### Geändert
- Jira-Datumsangaben im Format TT.MM.JJJJ werden jetzt als JJJJ-MM-TT gespeichert (bisher unverändert übernommen bzw. falsch als Monat.Tag gelesen).

## 0.44.0 – Etappe 44 (24.10.2026)

### Hinzugefügt
- **Hausregeln als Prüfregeln (ADR-097):** Typografie („…“, Gedankenstrich, Menüpfad mit ›, kein Punkt nach Überschriften), Zahlen und Datum (bis zwölf ausschreiben, Tausenderpunkt, Dezimalkomma, Leerzeichen vor Einheit, TT.MM.JJJJ, Zeitraum 2023–2027), Produktname „oneSCM“ – mit Korrektur per Klick.
- **Rechtschreibung:** erweiterte deutsche und neue englische Fehlerliste; **erlaubte Begriffe** (Whitelist) je Projekt, auch als Textliste einlesbar.
- **Englisch und weitere Sprachen:** Prüfung mit Sprachwahl im Textfeld und je Absatz einer Übersetzung; Englisch mit a/an, „I“ und Rechtschreibung.
- **Wortliste je Sprache:** eigene Formulierungen mit Sprache (z. B. Dealer → Händler auf Deutsch, Händler → Dealer auf Englisch); CSV mit Spalte „sprache“.
- **Lesbarkeit je Kapitel:** LIX, Flesch-Amstad, Ø Satzlänge, lange Sätze, Passiv mit Sollwerten je Zielgruppe (Endanwender bzw. Fachanwender) – im Anleitungs-Check und im Schreibstil.
- **„Nicht übersetzen“** je Begriff der Terminologie: bleibt in jeder Sprache unverändert, KI-Übersetzung und Prüfung beachten es.
- **Bildunterschriften:** Prüfregeln für Länge, Satzzahl und Füller.
- **Kapitelanweisung für Handbuch-Varianten** zusätzlich zu der der Quellkapitel; im Arbeitsordner unter `03_Varianten`.
- Migration `051_style_keep_terms.sql`; Tests T-296 … T-299, E2E T-300 (axe); Anforderungen NFR-104 … NFR-107.

## 0.43.0 – Etappe 43 (23.10.2026)

### Hinzugefügt
- **Kapitelsteuerung (ADR-096):** je Kapitel und Unterkapitel eine Kapitelanweisung (worauf es ankommt, wichtige Themen, nicht beschreiben) mit Vorrang: Der Generator lässt Quellen zu ausgeschlossenen Themen weg und meldet wichtige Themen ohne Quelle als Lücke, KI-Vorschläge erhalten die Anweisung, der Anleitungs-Check prüft sie, die Werkstatt zeigt sie oben.
- **Fehlende Kapitel und Unterkapitel ergänzen** – eingelesene Quellen mit gleicher Überschrift werden zugeordnet.
- **Version „gültig ab“** an Kapiteln, Unterkapiteln und Labels; im Export unter der Kapitelüberschrift, auch in der Lesefassung.
- **Veraltete Funktionen ablösen:** Kapitel, Unterkapitel und Labels durch einen Nachfolger ersetzen; das Alte kommt in die Historie (gültig von–bis), erscheint nicht mehr im Handbuch, aber im Anhang „Historie: abgelöste Funktionen“; Label-Zuordnungen übertragbar; zurückholen möglich.
- **Arbeitsordner:** `ANWEISUNG.md` je Kapitel und Unterkapitel, Grundregel 8 in `CLAUDE.md`, alle Agenten lesen die Anweisung mit Vorrang; `abgleich --app` übernimmt die Anweisungen aus der App (eigene Angaben bleiben, App-Fassung als `.neu`).
- Migration `050_chapter_instructions_history.sql`; Tests T-292 … T-294, E2E T-295 (axe); Anforderungen NFR-101 … NFR-103.

## 0.42.0 – Etappe 42 (23.10.2026)

### Hinzugefügt
- **Datenschutz im Bild (ADR-095):** Namen, User-IDs, Adressen, FIN und weitere personenbezogene Daten in Screenshots werden per lokaler Texterkennung erkannt und verpixelt ausgeliefert – im Bildarchiv, in Exporten, Releases und Übersetzungen. Unkenntlichmachung an/aus (rückgängig), je Stelle an/aus, eigene Stellen mit der Maus ziehen; das Original bleibt erhalten und ist nur mit Bearbeitungsrecht abrufbar (`?unredacted=1`). Neue Einstellung `OCR_BOXES_CMD` (sonst aus Tesseract-`OCR_CMD` abgeleitet).
- **Mehrere Labels und Kapitel je Bild:** Domäne, Rolle, Gliederung und weitere Labels sowie Kapitel je Bild; Filter im Bildarchiv, Deckungsmatrix „je Gliederungspunkt“.
- Migration `049_image_redaction_labels.sql`; Tests T-288 … T-290, E2E T-291 (axe); Anforderungen NFR-99, NFR-100.

## 0.41.1 – Abschluss (23.10.2026)

### Behoben
- Antworten und Belegauszüge unter „Fragen & Antworten“, „Rückfragen“ und „Antwortqualität“ zeigen Markdown formatiert (fett, kursiv, Code, Bild als „[Bild: …]“) statt Sternchen.
- Übersicht oneSCM_Metadaten: Schritte ② Extraktion, ④ Indexierung, ⑤ Fragestellung als verfügbar, neu ⑦ Qualität.

### Verbessert
- **Leistung (ADR-094):** Dubletten-Abgleich mit Präfix-Filter (Ergebnis unverändert) und nur für geänderte Abschnitte; Zwischenspeicher für Wortstämme bei der Frage an alle Quellen – Import von 2 000 Dokumenten 33 statt 44 s, Frage an alle Quellen p50 160 statt 328 ms, Prüflauf 30 Fragen 4,5 statt 9,4 s ([Lasttest](docs/lasttest-metadaten.md)).

### Hinzugefügt
- **Installationspaket** (`tools/paket/paket.sh`): Windows-x64-Paket offline mit Node.js portable und allen Abhängigkeiten (Start per `start.cmd`), universelles Paket für Linux/macOS/Windows mit Installationsskript, jeweils mit fiktiven Beispieldaten und Sicherungsskript.
- **Dokumentation:** [08 Installation und Betrieb](docs/08-installation-betrieb.md), [09 Benutzerdokumentation](docs/09-benutzerdokumentation.md), [Lasttest](docs/lasttest-metadaten.md); Lastskript `apps/server/scripts/perf-metadata.mjs`.
- **Handbuch-Arbeitsordner:** `00_Dokumentation/App/` mit Anleitung zur App, Vorlage `TESTFRAGEN.csv` und Ablage für Befragungen und Exporte; der Abgleich ergänzt sie in bestehenden Ordnern.

## 0.41.0 – Etappe 41 (23.10.2026)

### Hinzugefügt
- **Varianten einer Maske (ADR-093, F-22):** Bilder derselben Maske im Bildarchiv verknüpfen; Export, Handbuch-Varianten, Releases und Übersetzungen zeigen je Verweis die Fassung mit passender Sprache, Rolle, Sparte und Markt. Prüfregel für doppelte Varianten, Deckungsmatrix „je Maske“.
- **Klickstrecke aus Screenshots (F-24):** Stationen aus Bildern des Archivs, parallele Wege als 3a/3b, gezeichnet als PNG mit Nummern, Beschriftungen und Pfeilen; im Bildarchiv abgelegt, Änderungen als neue Fassung – alle Verweise folgen.
- Migration `048_variants_clickpaths.sql`; Tests T-284 … T-286, E2E T-287 (axe); Anforderungen NFR-97, NFR-98.

## 0.40.0 – Etappe 40 (23.10.2026)

### Hinzugefügt
- **Punktmodell Muss/Soll im Anleitungs-Check (ADR-092, F-08):** jeder Prüfpunkt ist Muss (10 Punkte) oder Soll (5 Punkte), je Projekt umstellbar; „alle Muss-Punkte erfüllt“ wahlweise als Bedingung für Einreichen und Freigabe; Punkte und offene Muss-Punkte in Checkliste, Übersicht und Freigabe.
- **Expertenbefragung zu Wissenslücken (F-16):** Fragen ohne Aussage aus Rückfragen oder Prüfläufen an Fachleute – Antwort per Option und Freitext in der App oder per Excel-Datei; Übernahme als Frage & Antwort mit Label „Prüfen“.
- **Deckungsmatrix der Bilder (F-30):** Reiter/Menüpunkt bzw. Kapitel × Sprache/Rolle/Sparte im Bildarchiv – abgedeckt, nur Platzhalter, Lücke; Export als Excel oder CSV.
- Migration `047_points_surveys.sql`; Tests T-279 … T-282, E2E T-283 (axe); Anforderungen NFR-94 … NFR-96.

## 0.39.0 – Etappe 39 (23.10.2026)

### Hinzugefügt
- **Antwortqualität (ADR-091, M7):** unter „oneSCM_Metadaten › Antwortqualität“ Testfragensätze mit erwarteten Quellen (Pfad, optional Überschrift), Stichworten und Lückenfragen – aus CSV, Excel, JSON, aus gespeicherten Fragen & Antworten oder von Hand.
- **Prüflauf** stellt jede Testfrage wie eine Frage an alle Quellen und misst: bestanden, Treffer@1/@3/@6, MRR, Beleg richtig, Stichwort-Abdeckung, Lücken richtig, Zeit je Frage – ohne Einträge im Frageprotokoll.
- **Verlauf und Vergleich** mit dem vorigen Lauf (Änderung je Kennzahl, neu bestanden/durchgefallen), Ergebnis je Frage mit Antwort und gefundenen Stellen, Export als Excel/CSV/JSON.
- „Frage an alle Quellen“ liefert zusätzlich die gefundenen Stellen in Rangfolge (`retrieved`).
- Migration `046_answer_quality.sql`; Tests T-275 … T-277, E2E T-278 (axe); Anforderungen NFR-92, NFR-93.

## 0.38.0 – Etappe 38 (23.10.2026)

### Hinzugefügt
- **Untertitel und Video einlesen (ADR-090, M6):** `.vtt` und `.srt` mit Abschnitten je Kapitelmarke bzw. 2 Minuten und Zeitmarke je Absatz als Fundstelle („bei 01:31“); `.mp4` mit Untertiteln gleichen Namens im ZIP oder mit lokaler Transkription (`TRANSCRIBE_CMD`, z. B. whisper.cpp).
- **Standbilder bei Änderung (F-26):** mit ffmpeg (`FFMPEG_PATH`) alle 2 s verglichen, behalten nur Bilder mit sichtbarer Änderung, geänderter Bereich rot umrahmt, an ihrer Zeitmarke im Text.
- **Texterkennung gescannter PDF-Seiten** mit lokalem Werkzeug (`OCR_CMD`, z. B. Tesseract), gekennzeichnet „bitte prüfen“.
- Seite „Einlesen“ zeigt die Formate Video und Untertitel und den Status der lokalen Werkzeuge; Formatfilter „Video“ und „Untertitel“ in Chunks und Fragen.
- Werkzeuge nur über Umgebungsvariablen, ohne Shell, mit Zeitlimit (`MEDIA_TOOL_TIMEOUT_MS`); Daten verlassen den Rechner nicht.
- Migration `045_media_tools.sql`; Tests T-270 … T-273, E2E T-274 (axe); Anforderungen NFR-90, NFR-91.

## 0.37.0 – Etappe 37 (23.10.2026)

### Hinzugefügt
- **Frage an alle Quellen (ADR-089, M5):** unter „oneSCM_Metadaten › Fragen & Antworten“ – hybride Suche über Chunks und Teilstücke, eingrenzbar nach Format, Datei, Überschrift und Label; Antwort nur aus den sechs besten Belegen, jeder Satz mit Beleg [n] (KI mit Satzprüfung, sonst extraktiv).
- **Als Frage & Antwort übernehmen** mit dem Rahmen der Frage; **Erneut fragen** vergleicht mit dem gespeicherten Stand (Belege neu/entfallen/gleich, Antwort wortweise).
- **Export** der gespeicherten Fragen und Antworten als CSV, Excel oder JSON.
- **Rückfragen (Fragenkatalog):** Fragen aus einer HTML-App (z. B. Review-Cockpit), CSV, JSON oder Text einlesen, alle mit Belegen beantworten, als Frage & Antwort speichern, als Excel/CSV/JSON exportieren.
- Mindestrelevanz je Beleg (30 % der Fragewörter oder deutliche Ähnlichkeit) – keine Scheinantworten aus einzelnen gemeinsamen Wörtern.
- Migrationen `043_metadata_ask.sql`, `044_question_catalog.sql`; Tests T-263 … T-265, T-267, T-268, E2E T-266, T-269 (axe); Anforderungen NFR-87 … NFR-89.

## 0.36.0 – Etappe 36 (23.10.2026)

### Hinzugefügt
- **Dubletten über alle Formate (ADR-088, M4):** gleiche und ähnliche Abschnitte (ab 85 %) über Dateien und Formate hinweg, z. B. dieselbe Folie als PowerPoint und PDF; Paare und Gruppen, Unterschiede wortweise markiert.
- **Nach jedem Import** werden nur geänderte Dateien neu berechnet; „Neu berechnen“ baut alles neu auf.
- **Entscheidung** „A/B führend“ oder „kein Duplikat“ je Inhaltspaar – bleibt bei erneutem Einlesen erhalten.
- Seite „Dubletten (alle Formate)“ unter oneSCM_Metadaten; Migration `042_section_duplicates.sql`; Tests T-260, T-261, E2E T-262 (axe); Anforderungen NFR-85, NFR-86.

### Behoben
- PDF: Textstücke einer Zeile werden nach Position zusammengesetzt – nummerierte Listen (Nummer nach dem Text geschrieben) werden richtig erkannt.

## 0.35.0 – Etappe 35 (23.10.2026)

### Hinzugefügt
- **Teilstücke langer Chunks (ADR-087, M3):** Chunks über 800 Zeichen werden für Suche und Antworten an Satzgrenzen in Teilstücke von 300–800 Zeichen mit einem Satz Überlappung geteilt; die Textabschnitte selbst bleiben unverändert (E-02).
- **Quellen je Überschrift:** neue Seite unter oneSCM_Metadaten – je Datei als Überschriftenbaum oder alle Quellen zusammengeführt je Überschrift.
- **Filter „Überschrift“** in der Chunk-Liste.
- Tests T-257, T-258, E2E T-259 (axe); Anforderungen NFR-83, NFR-84.

## 0.34.0 – Etappe 34 (23.10.2026)

### Hinzugefügt
- **PowerPoint einlesen (ADR-086, M2):** je Folie ein Abschnitt mit Titel, Aufzählungen mit Ebenen, Tabellen, Bildern mit Alternativtext und Sprechernotizen; ausgeblendete Folien entfallen.
- **PDF einlesen (M2):** Textebene lokal mit pdf.js; Überschriften aus Lesezeichen bzw. Schriftgröße, Absätze und Listen, ohne wiederholte Kopf-/Fußzeilen und Seitenzahlen; Seiten ohne Textebene werden gemeldet.
- **Fundstelle je Chunk:** Folie, Seite bzw. Abschnitt (Anker der Überschrift bei HTML und Word).
- **Bild → Gliederungsstelle (F-25):** Vorschlag aus Folientext und Alternativtext, im Bildarchiv von Hand übernehmen; Folientitel als Bildunterschrift.
- **Seite „Einlesen“** unter oneSCM_Metadaten: mehrere Dateien auf einmal mit Ergebnis je Datei.
- Migration `041_slides_pages.sql`; Tests T-252 … T-255, E2E T-256 (axe); Anforderungen NFR-81, NFR-82; Abhängigkeit `pdfjs-dist`.

### Geändert
- `.pptx` und `.pdf` sind erlaubte Importformate (auch in gespeicherten Einstellungen mit der bisherigen Standardliste); Originale werden nur als Download mit `nosniff` und `sandbox` ausgeliefert.

## 0.33.0 – Etappe 33 (23.10.2026)

### Hinzugefügt
- **Bildarchiv (ADR-085, F-20):** feste Bildnummer B-0001 …, Merkmale (Sprache, Rollen, Sparten, Märkte, Release, Reiter), Prüfregeln je Bild und Bildabdeckung je Kapitel.
- **Bildversionen und Platzhalter (F-21):** eine neue Fassung ersetzt das Bild überall, das Original bleibt über `?original=1` abrufbar; Platzhalterbild mit reservierter Nummer.
- **Screenshot aus der Zwischenablage (F-23):** Strg+V oder Schaltfläche im Screenshot-Editor (danach zuschneiden) und im Bildarchiv.
- **Quick Guide und One Pager (F-27)** als Ausgabeprofil im Export, für alle Formate und je Variante.
- **Lesefassung (F-28)** ohne Badges, Versionszeile und Quellenstatus; Wasserzeichen „ENTWURF“ beim Druck mit Entwürfen.
- **„Weiter mit …“ (F-29):** Übergangstext und Folgekapitel je Kapitel in Leseransicht, Druck und Export.
- Migration `040_image_archive.sql`; Tests T-248 … T-250, E2E T-251 (axe); Anforderungen NFR-79, NFR-80.

### Geändert
- `GET /media/{sha}` liefert die neueste Fassung mit `ETag` und `Cache-Control: private, no-cache` statt `immutable`.

## 0.32.0 – Etappe 32 (23.10.2026)

### Hinzugefügt
- **Gliederungs-Vorschlag je Chunk (ADR-084, F-13):** bis zu drei Punkte der Gesamtgliederung mit Trefferwert und Treffer-Wörtern, nie automatisch übernommen; Filter „nur ohne Gliederungspunkt“.
- **Kapitel ↔ Quellen (F-14):** je Gliederungspunkt das Handbuchkapitel links und die zugeordneten Quellen rechts – „im Handbuch“ oder „nicht verwendet“ –, dazu Vorschläge.
- **Wissensnotizen (F-15):** Frage, Erkenntnis und Screenshot als eigene Quelle mit Revisionen, Rollen und Sparten; personenbezogene Daten abgewiesen oder pseudonymisiert.
- **Ausschlussliste „nicht einlesen“ (F-17)** in den Einstellungen; ausgeschlossene Dateien erscheinen im Import als übersprungen.
- **Zielkapitel je Dopplung (F-18):** „zusammenführen in …“ ordnet beide Textabschnitte dem Gliederungspunkt zu.
- Migration `039_knowledge_notes.sql`; Tests T-244 … T-246, E2E T-247 (axe); Anforderungen NFR-77, NFR-78.

## 0.31.0 – Etappe 31 (23.10.2026)

### Hinzugefügt
- **Release-Abgleich (ADR-083, F-03):** Jira-Tickets je Release mit Statusgruppe, Einordnung „Benutzerhandbuch-Kandidat“ oder „Intern / Bug“, Kapitelbezug („fehlt“), Änderungen seit dem letzten Import und Abgleich einer Ticketliste.
- **Releaseletter (ADR-083, F-02):** aus den Tickets eines Releases erzeugt – nur Ticketfakten, feste Guardrails, Deutsch oder Englisch, vier Zielgruppen; eingefügte Letter (z. B. aus Dify) werden mit denselben Regeln geprüft; Urteil „Nicht freigeben“, „Bedingt freigeben“, „Freigabe möglich“; Freigabe, Export als Markdown und Word.
- **Warnhinweis-Schema (F-07)** im Anleitungs-Check; **Übersetzungsprüfung (F-09)** mit Platzhaltern, Struktur, Fettung und Signalwörtern; **feste Übersetzungen und Begriffskandidaten aus Tickets (F-12)**.
- Zielsprachen Slowakisch, Koreanisch und Malaiisch.
- Migration `038_release_letters.sql`; Tests T-241, T-242, E2E T-243 (axe); Anforderungen NFR-75, NFR-76.

### Geändert
- Englische UI-Begriffe für Contract Management 3.1–3.5 und die Domänenzuordnung sind bestätigt (ADR-082).
- Die Datenschutzprüfung erkennt Namen auch hinter „Prepared by“ und „Exported by“.

## 0.30.0 – Etappe 30 (23.10.2026)

### Hinzugefügt
- **Zuordnung (ADR-082):** neue Seite „oneSCM_Metadaten › Zuordnung“ – je Fachdomäne die Gliederungspunkte mit Kapitelordner (`02_Kapitel/…`) und Unterordnern aus einer wählbaren Gliederung, die Menüpunkte und Vorschläge aus gelabelten Chunks; übernehmen, lösen, zuordnen; CSV-Export.
- **Contract Management 3.1–3.5** als eigene Menüpunkte im Labelkatalog (Navigation 39, Katalog 158 Labels).
- **Arbeitsordner:** vier Hauptordner zur Steuerung – `05_I_Output` (Handbuch, Releaseletter, QuickGuide, Schulungsmaterial, interne Dokumente, Videos, Grafiken, Prozesse), `06_II_Stil_und_Design`, `07_III_Grammatik_Synonyme_Fehlerliste`, `08_IV_Translation` – mit neuen Agenten.
- Migration `037_domain_map.sql`; Tests T-240, E2E T-239 (axe); Anforderung NFR-74.

### Korrigiert
- Gepflegte Klarnamen sperren die Übertragung an externe Dienste schon vor der ersten Analyse; die Namensliste lässt sich wieder normal eintippen (Review PR 28).

## 0.29.0 – Etappe 29 (23.10.2026)

### Hinzugefügt
- **Jira-Import als Datei (ADR-081, F-01):** XML- und CSV-Exporte, je Ticket eine Quelle unter `jira/` mit Feldern, Beschreibung, Akzeptanzkriterien und Verknüpfungen; ohne Personenfelder und Kommentare, Text pseudonymisiert; Format „Jira-Ticket“ in oneSCM_Metadaten.
- **Quellenänderungen (ADR-081, F-05):** geänderte, entfallene und neue Quellabschnitte je Kapitelabsatz mit Gegenüberstellung; Text übernehmen, nur Quelle aktualisieren, ergänzen, entfernen oder verwerfen – nur an Entwürfen.
- **Zugriffsmatrix (ADR-081, F-06):** Rolle × Menüpunkt mit V/L/–/? und Beleg, CSV-Import und -Export.
- Migration `036_source_updates_access.sql`; Tests T-214 … T-216, E2E T-238 (axe); Anforderungen NFR-71 … NFR-73.

## 0.28.0 – Etappe 28 (23.10.2026)

### Geändert
- **Labelkatalog nach echtem oneSCM (ADR-080):** 153 Labels in neun Gruppen – Gesamtgliederung (Vorspann, Kapitel 1–23, Anhänge A–I), 34 Menüpunkte der Oberfläche (UI-Begriff englisch, Handbuchbegriff deutsch), Rollen mit MO = Market Operation, neu Fachdomäne, Kundengruppe und Systeme; Sparten nur Pkw und Van. Bestehende Projekte werden abgeglichen: Labels früherer Katalogstände werden ausgeblendet, Zuordnungen und Anpassungen der Administration bleiben.

### Hinzugefügt
- **Erweiterte Datenschutzprüfung (ADR-080, F-04):** Fahrgestellnummer, Kfz-Kennzeichen, Benutzerkennung, Straßenadresse, Namen hinter Metadatenfeldern und aus einer Namensliste (Einstellungen › Datenschutz); Pseudonymisierung und Prüf-Endpunkt `POST /privacy/check`.
- Entscheidungen vom 23.10.2026 in docs/04 und docs/07; Tests T-212, T-213; Anforderungen NFR-69, NFR-70; keine Migration.

## 0.27.0 – Etappe 27 (23.10.2026)

### Hinzugefügt
- **oneSCM_Metadaten, Etappe M1 (ADR-079):** eigener Bereich in der Navigation mit Übersicht (Quelldateien und Chunks je Format, Ablauf Ablage → Ausgabe), **Chunks** (je Überschrift oder als Tabelle, Fundstelle, Suche, Filter nach Format, Labels und „ohne Label“, einzeln und gesammelt labeln), **Fragen & Antworten** (mit Quell-Chunks samt Auszug, Labels, Sprache Deutsch/Englisch, Notiz) und **Labels**.
- **100 vordefinierte Labels** in sechs Gruppen, Deutsch und Englisch: Handbuch-Gliederung (30), Rollen (10), Navigation im System (25), Inhaltstyp (15), Sparte (5), Qualität und Status (15); Pflege, Ausblenden und eigene Labels durch die Administration; jedes Projekt erhält den Katalog.
- Plan [docs/06-plan-onescm-metadaten.md](docs/06-plan-onescm-metadaten.md) mit den Entscheidungen M-01 … M-10 (Daten bleiben lokal) und Entwicklungs-Agenten unter `.claude/agents/`.
- Migration `035_metadata.sql`; Tests T-209 … T-211, E2E T-237 (axe); Anforderungen NFR-66 … NFR-68.

### Geändert
- Navigation: Übersichtseinträge sind nur auf der eigenen Seite markiert, wenn Unterseiten eigene Einträge haben.

## 0.26.0 – Etappe 26 (27.09.2026)

### Hinzugefügt
- **Häufige Fragen übersetzen (ADR-077):** Übersetzung je FAQ-Eintrag und Projektsprache – von Hand oder als KI-Vorschlag, mit Freigabe (ohne Prüfbefunde, Vier-Augen-Prinzip); veraltet, sobald sich das deutsche Original ändert. Leseransicht, „Häufige Fragen dazu“, Druck und Online-Hilfe zeigen die freigegebene Übersetzung, sonst deutsch mit Kennzeichen.
- **Alle Projektsprachen vollständig (ADR-078):** Niederländisch, Polnisch, Tschechisch und Portugiesisch mit eigenen Beschriftungen in Leseransicht, Druck und Online-Hilfe sowie übersetzten Abschnittstiteln.
- Migration `034_faq_translations.sql`; Tests T-207, T-208, E2E T-236 (axe); Anforderungen NFR-64, NFR-65.

### Geändert
- Online-Hilfe: „Siehe auch“ und FAQ in der angefragten Sprache, auch wenn das Kapitel selbst noch deutsch angezeigt wird.

### Behoben
- Online-Hilfe behält die angefragte Inhaltssprache in Formularen und Links; Hinweis an die Redaktion beim ersten Übersetzungswunsch genau einmal (PR #25).

## 0.25.0 – Etappe 25 (26.09.2026)

### Hinzugefügt
- **Leseransicht mehrsprachig (ADR-074):** Beschriftungen von Leseransicht und Druck (Inhaltsverzeichnis, Suche, Hinweise, Schritte, Rückmeldung, „Siehe auch“, Deckblatt, „Seite X von Y“) in der Lesesprache – Deutsch, Englisch, Französisch, Spanisch, Italienisch; übrige Sprachen englisch. Online-Hilfe für übrige Sprachen englisch statt deutsch.
- **Übersetzung anfordern (ADR-075):** Knopf im Hinweis „noch nicht übersetzt“; Hinweis an die Redaktion beim ersten Wunsch; „Gewünschte Übersetzungen“ nach Anzahl mit direktem Anlegen; Benachrichtigung der Anfragenden bei Freigabe.
- **Notizen direkt im Kapitel (ADR-076):** Notiz unter dem Kapiteltitel anlegen, ändern, löschen – merkt das Kapitel automatisch.
- Migration `033_translation_requests.sql`; Tests T-205, T-206, E2E T-235 (axe); Anforderungen NFR-61, NFR-62, NFR-63.

### Behoben
- Druck einer Handbuch-Variante mit „Siehe auch“ und FAQ-Anhang; CSV-Export der Lesezeichen ohne Formel-Einschleusung (PR #24).

## 0.24.0 – Etappe 24 (26.09.2026)

### Hinzugefügt
- **Sprachen beim Lesen (ADR-071):** Sprachauswahl in der Leseransicht; Kapitel, Titel, Suche, FAQ und Glossar in der gewählten Sprache aus freigegebenen Übersetzungen; deutscher Rückfall mit Hinweis; Übersetzungen von Begriffen unter „Terminologie“.
- **„Siehe auch“ und FAQ im Druck und in der Online-Hilfe (ADR-072):** Querverweise mit Kapitelnummer, FAQ-Anhang, Druck in einer Sprache, auch für Handbuch-Varianten; Online-Hilfe mit Links auf verwandte Hilfethemen und passenden FAQ.
- **Lesezeichen mit Notizen (ADR-073):** eigene Notiz je Lesezeichen, Seite „Lesezeichen“ mit Filter und CSV-Export.
- Migration `032_reader_languages_notes.sql`; Tests T-202, T-203, T-204, E2E T-234 (axe); Anforderungen NFR-58, NFR-59, NFR-60.

### Geändert
- „Siehe auch“ vergleicht Kapitel über die deutsche Quelle – gleiche Verweise in jeder Sprache.

### Behoben
- Lesezeichen-Export als CSV: Werte, die wie eine Formel beginnen (`=`, `+`, `-`, `@`), werden als Text markiert.
- „Siehe auch“: höchstens fünf manuelle Verweise auch über die API; Verweis-Editor speichert nacheinander; Hinweis auf neue/geänderte Kapitel zählt beim Lesen herunter (PR #23).

## 0.23.0 – Etappe 23 (26.09.2026)

### Hinzugefügt
- **„Siehe auch“ und häufige Fragen (ADR-069):** unter jedem Kapitel verwandte Kapitel – manuell gepflegt und automatisch aus ähnlichen Inhalten – sowie passende FAQ; Verweise direkt in der Leseransicht bearbeiten; FAQ-Seite `/lesen/faq`.
- **Lesezeichen und Verlauf (ADR-070):** Kapitel merken, „Zuletzt gelesen“, Markierung „Neu“/„Geändert“ im Inhaltsverzeichnis mit Hinweis im Kapitel.
- Migration `031_reader_links_bookmarks.sql`; Tests T-200, T-201, E2E T-233 (axe); Anforderungen NFR-56, NFR-57.

### Behoben
- Druckansicht und alle Seiten übernehmen nur noch die Antwort der jüngsten Anfrage (kein falsches Handbuch nach schnellem Variantenwechsel); Drucken erst mit geladenem Renderer und Logo; Vorlagen-Import in einer Transaktion.

## 0.22.0 – Etappe 22 (26.09.2026)

### Hinzugefügt
- **Druck je Variante und Rolle (ADR-065):** Standardhandbuch oder Handbuch-Variante, optional nur für eine Rolle; Deckblatt im Firmen-Layout (Logo, Firma, Untertitel, Vertraulichkeit, Hausfarbe), Kopf- und Fußzeile, Glossar-Anhang.
- **Suche und Glossar beim Lesen (ADR-066):** „Im Handbuch suchen“ mit Ausschnitten und markierten Treffern im Kapitel; Fachbegriffe und Abkürzungen erklären sich per Klick, Maus oder Tastatur.
- **Vorlagen teilen (ADR-067):** Vorlagen duplizieren (auch mitgelieferte zum Anpassen), als Datei exportieren und in anderen Projekten importieren.
- **Schnelles Laden (ADR-068):** Seiten, Markdown-Renderer und OIDC werden erst bei Bedarf geladen, React/Router als eigenes Cache-Paket; Brotli-/gzip-Fassungen aus dem Build, unveränderliche Dateien ein Jahr gecacht – Erstaufruf ≈ 96 kB statt 243 kB (gzip).
- Tests T-197 … T-199, E2E T-232 (axe); Anforderungen NFR-52 … NFR-55; keine Migration.

### Behoben
- Drucken erst, wenn Deckblattangaben geladen sind; die Wochenübersicht berechnet den projektweiten Teil einmal je Versand.

## 0.21.0 – Etappe 21 (26.09.2026)

### Hinzugefügt
- **Vorlagen bearbeiten (ADR-062):** eigene Kapitelvorlagen im Kapitel-Assistenten vollständig bearbeiten – Name, Beschreibung, Titelvorschlag, Zweck, Voraussetzungen, Schritte, Ergebnis, Tipps.
- **Druck mit Deckblatt (ADR-063):** Deckblatt mit Projekt, Version bzw. Arbeitsstand, Datum und Kapitelzahl; nummerierte Kapitel; Kopfzeile und „Seite X von Y“.
- **Wöchentliche Übersicht (ADR-064):** einmal pro Woche eine Benachrichtigung mit offenen Rückmeldungen, eigenen Aufgaben und Kapiteln mit Handlungsbedarf – nur wenn es etwas zu tun gibt; Wochentag, Vorschau und „Jetzt senden“ auf der Seite „Rückmeldungen“.
- Migration `030_weekly_digest.sql`; Tests T-195, T-196, E2E T-231 (axe); Anforderungen NFR-49 … NFR-51.

### Behoben
- Vorlagenquelle wird gegen das Projekt geprüft; 30-Tage-Entwicklung vergleicht mit dem Vorzeitraum; eine Rückmeldung erzeugt höchstens eine Aufgabe.

## 0.20.0 – Etappe 20 (26.09.2026)

### Hinzugefügt
- **Rückmeldungen auswerten (ADR-058):** Seite „Rückmeldungen“ mit Anteil „nicht hilfreich“ je Kapitel, Entwicklung, häufigen Begriffen und neuesten Kommentaren; aus einer Rückmeldung eine Aufgabe erstellen.
- **Eigene Kapitelvorlagen (ADR-059):** „💾 Als Vorlage“ in der Werkstatt; im Kapitel-Assistenten wählbar, umbenennen und löschen.
- **Druck-/PDF-Ansicht (ADR-060):** Kapitel oder ganzes Handbuch drucken bzw. als PDF speichern, mit Inhaltsverzeichnis und Kästchen zum Abhaken.
- **Rückmeldungen in der Online-Hilfe (ADR-061):** „War das hilfreich?“ in der eingebetteten Hilfe – anonym, nur für Veröffentlichtes, mit Grenze je Adresse und Honigtopf.
- Migration `029_templates_feedback_source.sql`; Tests T-192 … T-194, E2E T-230 (axe); Anforderungen NFR-45 … NFR-48.

### Behoben
- Anleitungs-Check vor der Freigabe gilt nicht für Handbuch-Varianten; „Entwürfe einblenden“ zeigt die neueste Version; Folgezeilen nummerierter Schritte bleiben in der Leseransicht erhalten.

## 0.19.0 – Etappe 19 (26.09.2026)

### Hinzugefügt
- **Leseransicht (ADR-054):** Handbuch mit Inhaltsverzeichnis, Schritten zum Abhaken, hervorgehobenen Hinweisen; „War dieses Kapitel hilfreich?“ mit Kommentar – Kritik erreicht die Redaktion als Hinweis; Übersicht und „Erledigt“ im Anleitungs-Check, offene Rückmeldungen auf der Startseite.
- **Kapitelvorlagen (ADR-055):** sechs Aufgabentypen im Kapitel-Assistenten; der Anleitungs-Check meldet offene Platzhalter „…“ (elfter Punkt).
- **Einführung (ADR-056):** kurze Tour beim ersten Start, jederzeit über „Einführung“ neu startbar.
- **Anleitungs-Check vor der Freigabe (ADR-057):** Wert und offene Punkte in der Freigabe; optionaler Mindestwert als Bedingung im Qualitätsgate.
- Migration `028_reader_feedback.sql`; Tests T-189 … T-191, E2E T-229 (axe); Anforderungen NFR-41 … NFR-44.

### Behoben
- Anleitungs-Check: Schritte zählen nur mit erkannten Handlungen; „Alle Korrekturen übernehmen“ wendet mehrere Korrekturen je Absatz nacheinander an; Pflege der Stilregel-Bibliotheken nur mit globaler Administration (`/me` liefert `globalPermissions`).

## 0.18.0 – Etappe 18 (26.09.2026)

### Hinzugefügt
- **Anleitungs-Check (ADR-051):** Checkliste je Kapitel – Zweck, Voraussetzungen, Schritte, nummerierte Schritte, eine Handlung je Schritt, Menüpfade fett, Ergebnis, Schrittzahl, Abkürzungen, Absatzlänge – mit Wert 0–100 und Korrekturen per Klick; fehlende Abschnitte direkt schreiben.
- **Kapitel-Assistent (ADR-052):** neues Kapitel in vier Schritten (Aufgabe, Voraussetzungen, Schritte, Ergebnis & Tipps) mit Vorschlägen aus den Quellen und Vorschau; legt einen Entwurf im Standardaufbau mit Quellenbezug an.
- **Einfache Oberfläche (ADR-053):** Startseite „Was möchten Sie tun?“ mit Hauptaufgaben, Fortschritt und Kapiteln mit Handlungsbedarf; Menü nach Arbeitsablauf (Sammeln, Schreiben, Prüfen, Veröffentlichen), Selteneres unter „Weitere“.
- **Stilregel-Bibliotheken (ADR-050):** gemeinsame Formulierungsregeln für mehrere Projekte; abonnieren mit Vorrang, wirksame Regeln mit Herkunft, CSV-Import/-Export.
- Migration `027_style_libraries.sql`; Tests T-186 … T-188, E2E T-228 (axe); Anforderungen NFR-37 … NFR-40.

### Geändert
- Das Dashboard liegt unter `/dashboard` (Menü „Weitere“); `/` ist die Startseite.

### Behoben
- Rollenvorlagen: Prüfung auf den letzten Administrator serialisiert; Speichern von Name/E-Mail löst die Vorlagen-Verknüpfung nicht mehr; Veränderung im Stilwert-Verlauf berücksichtigt den Startwert vor dem Zeitraum.

## 0.17.0 – Etappe 17 (26.09.2026)

### Hinzugefügt
- **Rollenvorlagen (ADR-047):** mitgelieferte (Lesen, Redaktion, Fachprüfung, Freigabe, Administration) und eigene Vorlagen; Benutzer und Projektmitgliedschaften per Vorlage; Änderungen einer Vorlage wirken auf zugeordnete Benutzer.
- **Stilregeln austauschen (ADR-047):** Export als CSV/JSON, Import (zusammenführen oder ersetzen), Übernahme aus einem anderen Projekt.
- **Stilwert-Verlauf (ADR-048):** Messpunkte je Kapitel bei Änderung; Dashboard mit Verlaufslinie des Projektdurchschnitts und Veränderung je Kapitel (90 Tage).
- **Screenshot-Editor (ADR-049):** Zuschneiden, Lupe (2-/3-fach), Markierungen per Maus verschieben.
- Migration `026_roles_style_history.sql`; Tests T-183 … T-185, E2E T-227 (axe); Anforderungen NFR-34 … NFR-36.

## 0.16.0 – Etappe 16 (25.09.2026)

### Hinzugefügt
- **Eigene Stilregeln (ADR-044):** je Projekt Prüfungen ein-/ausschalten, Anrede Sie/du, maximale Satzlänge, eigene Formulierungen (ersetzen, streichen, Hinweis) – wirksam in Prüfung, Korrektur, Stapelkorrektur, Stilwert und KI-Umformulierung (Schreibstil › Regeln).
- **KI-Stapelumformulierung (ADR-044):** in der Werkstatt „Stil korrigieren“ mit „KI: professionell umformulieren“ oder „KI: ins Präsens“ – Fortschritt, Vorschau je Absatz, Auswahl, Übernahme mit Versionsprüfung.
- **Benutzerverwaltung (ADR-045):** Seite „Benutzer“ – anlegen (lokal oder OIDC vorab), Name/E-Mail/Berechtigungen ändern, sperren/entsperren (auch API-Tokens), Projektzugriffe je Benutzer; Schutz vor Selbstaussperrung.
- **Screenshot-Editor (ADR-046):** Pfeile, Textfelder, unkenntlich machen (verpixelt).
- Migration `025_users_style.sql`; Tests T-180 … T-182, E2E T-226 (axe, /benutzer); Anforderungen NFR-31 … NFR-33.

### Geändert
- Suche: Kapitel und Kapiteltexte stehen vor Quellen, die nur über den Dateipfad passen (Gewichtung je Bereich).
- Demo-Benutzer werden nur beim ersten Start angelegt; Änderungen aus der Benutzerverwaltung bleiben erhalten.

## 0.15.0 – Etappe 15 (25.09.2026)

### Hinzugefügt
- **Bilder in Word (ADR-042):** SVG-Bilder erhalten eine im Browser erzeugte PNG-Fassung; der Word-Export bettet SVG mit PNG-Ersatz ein statt nur den Alternativtext. Im Bildverzeichnis lassen sich fehlende PNG-Fassungen nachholen.
- **Bild aus Absatz (ADR-042):** In der Kapitelwerkstatt „🎨 Bild erzeugen“ – Diagramm aus dem Absatztext erzeugen, auswählen und direkt an den Absatz anhängen.
- **Diagramme nachbearbeiten (ADR-042):** Schritte sortieren, bearbeiten, Entscheidungen mit Ja/Nein; Farbe, Form, Schriftgröße, Stationen je Zeile; Vorlagen speichern, laden, löschen.
- **Screenshots markieren (ADR-042):** Bildschirmfoto laden, nummerierte Klickpunkte und Rahmen einzeichnen, Legende pflegen, als PNG speichern.
- **Schreibstil in der Werkstatt (ADR-043):** „🖋️ Stil anzeigen“ markiert problematische Sätze gelb direkt im Kapitel und korrigiert sie per Klick; „🖋️ Stil korrigieren“ als Stapelkorrektur mit Vorschau; Stilwert je Kapitel im Dashboard.
- Migration `024_images_style.sql`; Tests T-178, T-179, E2E T-225 (axe); Anforderungen NFR-29, NFR-30.

### Geändert
- `POST /api/v1/diagrams/generate` akzeptiert `options` (color, shape, textSize, perRow) und liefert sie zurück.
- Bildzeilen (`![…](media:…)`) werden bei der Stilprüfung nicht mehr als Sätze gewertet.

## 0.14.0 – Etappe 14 (25.09.2026)

### Hinzugefügt
- **Schreibstil (ADR-040):** neuer Navigationspunkt – Texte aus Textfeld, Kapitelentwürfen oder Textschnipseln prüfen (Präsens, Passiv, „man“, Füllwörter, Wortdopplungen, Zeichensetzung, Groß-/Kleinschreibung, Umgangssprache, Rechtschreibung, Abkürzungen, lange Sätze, Terminologie); problematische Sätze gelb markiert und per Klick bearbeitbar; automatisch korrigieren; professionell umformulieren bzw. ins Präsens umwandeln über den KI-Dienst (ohne KI mit Regelkorrekturen); Kapitelabsätze im Entwurf direkt speichern.
- **Bilder aus Text (ADR-041):** neuer Navigationspunkt – aus einer Textstelle ASCII-Bild, Klickstrecke, Prozessbild und Infografik (SVG in der Hausfarbe) erzeugen; Struktur per Regeln oder KI erkennen und bearbeiten; Bilder auswählen und mit Alternativtext speichern (Bildverzeichnis, „Bild einfügen“, Exporte), SVG herunterladen, ASCII kopieren.
- Tests T-176, T-177, E2E T-224 (axe auf /schreibstil und /bilder); Anforderungen NFR-27, NFR-28.

## 0.13.0 – Etappe 13 (24.09.2026)

### Hinzugefügt
- **Varianten synchronisieren (ADR-037):** Im Draft Manual „Mit anderer Gliederung abgleichen“ – je Eintrag Schnipsel nur in der Quelle (mit Prüfung gegen die Variante), nur im Ziel und fehlende Einträge; ausgewählte Schnipsel übernehmen und fehlende Einträge anlegen, ohne etwas zu löschen.
- **Firmen-Layout (ADR-038):** Firmenname, Hausfarbe mit Kontrastprüfung, Logo, Titelseite mit Untertitel und Vertraulichkeitshinweis, Kopf- und Fußzeile – für PDF, HTML und Online-Hilfe (Einstellungen › Layout).
- **Word-Export (ADR-038):** `.docx` mit Formatvorlagen, Inhaltsverzeichnisfeld, Listen, Tabellen, Bildern, Hinweiskästen, Seitenzahlen und Verzeichnissen; optionale Firmenvorlage (.dotx/.docx), deren Formatvorlagen übernommen werden – auch lokalisierte.
- **Volltextsuche (ADR-039):** Suchindex (SQLite FTS5 bzw. PostgreSQL tsvector mit deutschen Stammformen und unaccent), Relevanz, Präfixsuche je Wort, alle Wörter, Umlaute/Akzente egal, Filter nach Bereich mit Anzahl, Seiten, hervorgehobene Treffer; inkrementell aktuell, nach Importen vorab aufgebaut, Neuaufbau für Administration.
- Migration `023_layout.sql`; Abhängigkeit `docx` (MIT); Tests T-173 … T-175, E2E T-223 (axe in den neuen Zuständen); Anforderungen NFR-24 … NFR-26.

### Geändert
- `GET /api/v1/search` liefert Treffer nach Relevanz (`hits`, `facets`, `page`) und akzeptiert `types`; `groups` bleibt für die Gruppenansicht.
- `POST /api/v1/exports` kennt das Format `docx`.

## 0.12.0 – Etappe 12 (24.09.2026)

### Hinzugefügt
- **Handbuch-Varianten (ADR-034):** Aus Gliederung und Draft Manual entstehen eigene Kapitel mit Versionen („Kapitel für Freigabe erzeugen“), die über Werkstatt, Qualitätsgate und Freigabe laufen; neue Gliederungsversionen führen dieselben Kapitel fort. Export und Veröffentlichung je Variante mit Variantenfilter (Rollen, Sparten, Blueprint/Märkte), Titel der Gliederung und **Verzeichnissen** – Abkürzungsverzeichnis, Glossar, Bildverzeichnis, FAQ der Variante – in Markdown, HTML, PDF, JSON und als Seite der Online-Hilfe.
- **Bedienkomfort (ADR-035):** Drag & Drop für Schnipsel im Draft Manual und Einträge der Gliederung; Vergleich von Gliederungsversionen; **globale Suche** (Tastenkürzel „/“) über Kapitel, Texte, Schnipsel, Quellen, Gliederungen und Stammdaten; Darstellung System/Hell/Dunkel; bessere mobile Ansicht.
- **Betrieb & Pflege (ADR-036):** Import als **vollständiger Stand** (ZIP-Option, Git/Confluence immer) markiert fehlende Quelldateien als entfernt, wiederherstellbar; **SVG** wird bereinigt übernommen (Positivliste, keine Skripte/externen Verweise), im PDF als Vektorgrafik; **Stammdaten-Import** aus CSV/Excel mit Vorschau für Abkürzungen, Glossar und FAQ; stündliche **Erinnerung an überfällige Planung**.
- Migration `022_variants.sql`; Tests T-170 … T-172, E2E T-222 (axe in den neuen Zuständen und für die Suchseite); Anforderungen NFR-21 … NFR-23.

### Geändert
- `GET /api/v1/chapters` liefert standardmäßig nur Kapitel der Quellen (`?outline=<Familie>` bzw. `?outline=all` für Varianten); Werkstatt gruppiert nach Handbuch, Freigabe und Übersetzungen zeigen alle Kapitel.
- `POST /api/v1/releases` und `POST /api/v1/exports` akzeptieren `outlineId` (Exporte zusätzlich `appendices`); `POST /api/v1/imports?snapshot=true`.
- SVG-Upload ist erlaubt (bisher 400); ADR-029 in diesem Punkt abgelöst.

## 0.11.0 – Etappe 11 (24.09.2026)

### Hinzugefügt
- **Navigation:** links einklappbar (nur Symbole, Zustand gemerkt); unten die Gruppe **Stammdaten** mit Untermenü und **Einstellungen**; neues Register **Draft Manual**.
- **Inhaltsverzeichnis (ADR-032):** Gliederungen je Variante – Rollen (z. B. Dealer, Markt, HQ), Sparten (z. B. Pkw, Van), Blueprint oder ausgewählte Märkte (Märkte je Projekt konfigurierbar, Vorbelegung DE, FR, IT, ES, GB, NL). Anlegen leer, aus der Kapitelstruktur oder per Upload (Markdown/JSON); Kapitel und Unterkapitel hinzufügen, umbenennen, verschieben, einordnen, löschen; als neue Version speichern, aktiv setzen; Export Markdown/JSON.
- **Draft Manual (ADR-033):** Textschnipsel einer Gliederung je Kapitel/Unterkapitel zuordnen – automatisch über die Titel der Quellen oder manuell – verschieben, umsortieren, lösen; Kennzeichnung von **Widersprüchen** (rot), **Dopplungen** (orange), **Warnungen** (gelb: übrige Befunde, unbestätigte Quelle, veraltete Revision, falsche Variante) und **Lücken** (violett) mit Symbol und Text; Übersicht, Filter, Export Markdown.
- **Stammdaten:** Abkürzungen (mit Vorschlägen aus den Quellen), Glossar (Begriffe und Definitionen der Terminologie), Bildverzeichnis (Abbildungsnummer, Titel, Alternativtexte, Verwendung), FAQ (je Rolle/Sparte, Vorschläge aus dem Handbuch-Assistenten), Redaktionsplanung je Gliederungseintrag (Verantwortliche, Termin, Status, Überfälligkeit, Fortschritt).
- Migration `021_master_data.sql`; Tests T-166 … T-169, E2E T-221 (axe auch für Draft Manual und alle Stammdaten-Seiten); Anforderungen NFR-19, NFR-20.

### Geändert
- Projekte haben eine Marktliste (`PATCH /api/v1/projects/{id}` mit `markets`).
- „Einstellungen“ steht in der Navigation unten.

### Behoben (Review Etappe 11)
- Falsch typisierte Varianten (z. B. `"roles": "dealer"` in hochgeladenem JSON) ergeben 400 statt 500; gleichnamige Unterkapitel eines Kapitels gelten bei der automatischen Zuordnung als mehrdeutig; Änderungen an Gliederungseinträgen stehen im Audit.

## 0.10.0 – Etappe 10 (24.09.2026)

### Hinzugefügt
- **Integrationen & API (ADR-028):** API-Tokens je Projekt (`Authorization: Bearer oscm_…`, Scopes höchstens die eigenen Rechte, Ablauf, Widerruf), ausgehende Webhooks zu Audit-Ereignissen mit HMAC-Signatur, Zeitstempel, Wiederholung über die Jobqueue, Zustellprotokoll, Test und erneuter Zustellung (SSRF-Schutz); Push-Webhooks für Git-Verbindungen (GitHub/GitLab); Confluence Cloud als Quellverbindung über die REST-API; Seite „Integrationen“. Migration `018_integrations.sql`.
- **Bilder & Medien (ADR-029):** Bilder (PNG, JPEG, GIF, WebP) aus ZIP, Word, HTML, Git und Confluence werden inhaltsadressiert je Projekt abgelegt und als `media:<sha256>` referenziert; Anzeige in der Werkstatt, **🖼️ Bild einfügen** mit Pflicht-Alternativtext, Gate-Prüfung `image_alt`, Einbettung in HTML-, Markdown- und PDF-Export, Bilddateien in der Online-Hilfe, Medien im Backup. Migration `019_media.sql`.
- **Kontexthilfe für oneSCM (ADR-030):** Kontext-IDs an Kapiteln/Abschnitten (manuell oder Front-Matter `help_context`), `GET /api/v1/context-help/{key}` nach Rolle, Sparte und Sprache, Deep-Link `/hilfe/{key}`, Seite „Kontexthilfe“, einbettbares Hilfe-Widget (`/help/widget.js`, Klick/F1) mit Assistent auf Basis des neuesten Releases, freischaltbar je Projekt, Einbettung nur für `HELP_EMBED_ORIGINS`. Migration `020_context_help.sql`.
- **Release-Pipeline (ADR-031):** Tag `vX.Y.Z` baut ein Multi-Arch-Image in GHCR mit SemVer-Tags, SBOM und Provenienz, signiert es keyless mit cosign, veröffentlicht das Helm-Chart als OCI-Artefakt und erstellt das GitHub-Release mit Notes aus diesem CHANGELOG; `npm run release -- check|bump|notes`; Version im Health-Endpunkt; CI prüft Versionen, Workflows (actionlint) und das Image.
- Tests T-153 … T-165, E2E T-218 … T-220 (axe auch für „Integrationen“ und „Kontexthilfe“); Anforderungen NFR-15 … NFR-18.

### Geändert
- Git-Verbindungen übernehmen Bilddateien; ein Import gilt als fehlgeschlagen, wenn alle Dokumente (ohne Bilder) fehlschlagen.
- CSP der Anwendung erlaubt `blob:`-Bilder (angemeldet geladene Medien); Routen mit eigener CSP (Medien, eingebettete Hilfe) behalten diese.
- Absätze mit Bildern werden nicht KI-umformuliert; maschinelle Übersetzungen behalten Bildverweise.
- Traceability berücksichtigt pfadeigene `servers` der OpenAPI (öffentliche Pfade unter `/help`).

### Behoben
- Review: SSRF-Schutz erkennt IPv4-abgebildete IPv6-Adressen, den ganzen Link-Local-Bereich `fe80::/10` und weitere nicht öffentliche Bereiche (`net.BlockList`); GitHub-Push-Webhooks mit `application/x-www-form-urlencoded` werden verarbeitet; der Assistent im Hilfe-Widget antwortet ohne freigegebene Übersetzung aus der angezeigten deutschen Fassung.
- Container-Image enthielt nicht hochgezogene Laufzeitabhängigkeiten aus `apps/server/node_modules` nicht (z. B. `@fastify/static`) und startete nicht; der neue Smoke-Test in der CI deckt das künftig auf.

## 0.9.0 – Etappe 9 (24.09.2026)

### Hinzugefügt
- **Mehrstufige Freigabe (ADR-025):** Workflow je Projekt mit bis zu 6 Stufen (Zuständige, Mindestanzahl Zustimmungen, Frist), Vier-Augen-Prinzip, Schnappschuss je Einreichung, Hinweise über die Diskussion, stündliche Eskalation überfälliger Stufen, „Meine offenen Entscheidungen“; Standard bleibt einstufig (E-12). Migration `015_approval_workflow.sql`.
- **Handbuch-Assistent (ADR-026):** Fragen an das freigegebene Handbuch (Sprache, Rolle, Sparte), hybride Suche, KI-Antwort mit geprüften Quellen je Satz oder extraktive Antwort ohne KI, Bewertung und Wissenslücken; Seite „Assistent“, Link aus der Online-Hilfe. Migration `016_assistant.sql`.
- **Betrieb & Performance (ADR-027):** Import auf PostgreSQL 3,9-mal schneller (Sammel-INSERTs, Strukturcache), Migrationen unter Sperre bei gleichzeitigem Start, Rate-Limits über Instanzen (`RATE_LIMIT_STORE=db`, Migration `017_rate_limits.sql`), OpenTelemetry-Tracing (HTTP, Datenbank, Jobs, KI), Helm-Chart `deploy/helm/onescm` mit CI-Prüfung.
- Tests T-149 … T-152, E2E T-216, T-217 (axe auch für „Assistent“); Anforderungen NFR-12 … NFR-14.

### Geändert
- Ablehnungen benachrichtigen die einreichende Person.
- Die Analytik zählt nur abschließende Freigabeentscheidungen.
- `jobs.idle()` wartet nicht auf periodische Hintergrundketten.

### Behoben (Review Etappe 8)
- Git-Abgleich übernimmt den Commit erst nach erfolgreichem Import; geänderte Quelle gleicht neu ab; ungültiges `limit` der semantischen Suche → 400; Erstfreigabequote berücksichtigt frühere Ablehnungen; pgvector-Index erst ab `annThreshold`.

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
