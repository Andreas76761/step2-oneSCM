# ADR-116 Designvorlagen als PowerPoint

**Status:** akzeptiert, umgesetzt in Etappe 64 (Wahl des Auftraggebers vom 24.10.2026: „PowerPoint im Design“). Erweitert ADR-112 bis ADR-115 und ADR-106 (PowerPoint-Export).

## Kontext
Quick Reference Guide und Handbuch-Kapitel gibt es als HTML, PDF und Word. Für Schulungen und Präsentationen braucht die Redaktion dieselben Inhalte als Foliensatz, in Farben, Schriften und mit Logo der Anpassung. Der vorhandene PowerPoint-Export (ADR-106) setzt Standardfolien mit Platzhaltern.

## Entscheidung
- **Foliensatz im Design (16:9)** über `POST /exports` mit `format: pptx` und `design`, dazu `GET /design-templates/:id/sample?format=pptx` und „Muster als PowerPoint“.
- **Generator** (`domain/pptxWriter.ts`):
  - neue Folienart `custom` mit frei gesetzten Formen (Rechtecke, abgerundete Rahmen), Textfeldern, Bildern und echten Tabellen;
  - Läufe mit Farbe, Schrift, fett und kursiv;
  - Schriftschema aus der Anpassung.
  
  Weiterhin ohne Fremdbibliothek.
- **Quick Reference Guide** (`services/designPptx.ts`):
  - Titelfolie mit Titel, Marke (rechts, links oder ohne), Hinweis „interaktiv“ und „Die Prozesse im Überblick“ in zwei Spalten.
  - Je Abschnitt eine Karte mit abgerundetem Rahmen in der Akzentfarbe, Icon und Titel, Text links, Bildschirmfoto rechts.
  - Warnboxen unten; Links und häufige Fragen.
  - Fußzeile „Hinweis: …“ und „STAND: … | n/N“ auf jeder Folie.
- **Handbuch-Kapitel:**
  - Kopfzeile mit Dokumentart und „Folie n von N“, Linie in der Hauptfarbe; Fußzeile mit Fußzeilentext und Titel.
  - Titelfolie mit Titel, Untertitel und vier Kennzahlen-Karten.
  - Je Abschnitt Folien mit „n. Abschnitt“ und Balken; Inhalte nach geschätzter Höhe verteilt: Text, Tabellen, Code, Bilder sowie Hinweis-, Wichtig-, Warn- und Querverweis-Boxen.
- **Fortsetzung:** Lange Inhalte laufen auf Folgefolien „(Fortsetzung)“ weiter. Nummerierte Schritte behalten ihre Nummer aus dem Markdown (`startAt`), auch über Unterpunkte und Folgefolien hinweg. Das gilt jetzt auch für den Standard-Export.
- **Icons** als PNG (Lucide, über `@napi-rs/canvas`, gemeinsam mit Word in `services/designIconRaster.ts`). Icons haben eine leere Beschreibung, weil sie dekorativ sind; Bildschirmfotos behalten ihren Alternativtext.

## Begründung
- Dieselben gemeinsamen Funktionen (ADR-115) halten Überblick, Titel und Kennzahlen in allen Formaten gleich.
- Folien statt fortlaufender Seiten: Jede Karte bzw. jeder Abschnitt bekommt eine eigene Folie, wie es in Schulungen üblich ist.

## Folgen
- Die Höhenschätzung ist eine Näherung. Textfelder verkleinern zu langen Text automatisch (`normAutofit`).
- Geprüft mit LibreOffice (Umwandlung nach PDF) und mit dem eigenen PPTX-Import.
