# ADR-115 Designvorlagen als Word-Dokument

**Status:** akzeptiert, umgesetzt in Etappe 63. Erweitert ADR-112 (Designvorlagen), ADR-113 (PDF im Design), ADR-114 (Anpassung) und ADR-038 (Word-Export).

## Kontext
Quick Reference Guide und Handbuch-Kapitel gab es als HTML und PDF. Die Redaktion will diese Dokumente auch in Word weiterbearbeiten, zum Beispiel für letzte Anpassungen oder zum Weitergeben an Fachbereiche ohne Zugang zur App. Mit der Prüffassung (ADR-104) gibt es schon einen Rückweg aus Word, allerdings nur für das Standard-Layout.

## Entscheidung
- **Word im Design** über `POST /exports` mit `format: docx` und `design`, dazu `GET /design-templates/:id/sample?format=docx` und „Muster als Word“ auf der Seite „Export“. Es wird kein Browser gebraucht.
- **Gleiche Inhalte wie HTML und PDF:** Überblick, Kartentitel, Untertitel, Kennzahlen, Kopf- und Fußzeile kommen aus gemeinsamen Funktionen in `domain/designs.ts`.
- **Quick Reference Guide** (`services/designDocx.ts`):
  - A4 quer; Titelzeile mit Marke (rechts, links oder ohne) über die volle Breite.
  - Darunter ein fortlaufender Abschnitt mit zwei Spalten: „Die Prozesse im Überblick“, Karten als Tabellen mit Rahmen in der Akzentfarbe.
  - Warnbox mit Icon und Fläche aus der Warnfarbe; Tipp mit Balken; Links und häufige Fragen.
  - Fußzeile „Hinweis: …“ und rechtsbündig „STAND: TT.MM.JJJJ | Seite/Seiten“ als Word-Felder.
- **Handbuch-Kapitel:**
  - A4 hoch; Kopfzeile mit Dokumentart in Großbuchstaben, „Seite n von N“ und Linie in der Hauptfarbe; Fußzeile mit Fußzeilentext und Titel.
  - Titel als Überschrift 1, Untertitel, vier Kennzahlen-Karten mit Icons.
  - Nummerierte Abschnitte als Überschrift 2 mit Balken links.
  - Hinweis-, Wichtig-, Warn- und Querverweis-Boxen; Tabellen und Code.
- **Bearbeitbar:** echte Formatvorlagen (Überschrift 1/2 in Schrift und Hauptfarbe der Anpassung), damit Navigationsbereich und Inhaltsverzeichnis in Word funktionieren. Fließtext in der Textschrift der Anpassung.
- **Icons:** dieselben Lucide-Icons als SVG in der Farbe der Stelle, dazu eine PNG-Ersatzdarstellung (über `@napi-rs/canvas`, bereits vorhanden) für Programme ohne SVG.
- **Nummerierte Listen** zählen je Liste neu; eine fortgesetzte Liste (z. B. ab 6 nach einer Warnung) zählt weiter. Das gilt auch für den bisherigen Word-Export, der bisher über alle Listen weitergezählt hat.
- Die **Prüffassung** bleibt dem Standard-Design vorbehalten (400 mit Hinweis), weil das Zurücklesen auf dessen Aufbau abgestimmt ist.

## Begründung
- Die vorhandene Bibliothek `docx` deckt Spalten, Querformat, Felder, Rahmen und Bilder ab, ohne neue Abhängigkeit.
- Gemeinsame Funktionen für die Inhalte verhindern, dass HTML, PDF und Word auseinanderlaufen.

## Folgen
- Word kann abgerundete Rahmen und schwebende Bilder nicht wie das HTML darstellen. Die Karten sind rechteckig, Bildschirmfotos stehen in einer eigenen Zeile.
- Geprüft mit LibreOffice (Umwandlung nach PDF): Quick Reference Guide 2 Seiten quer, Handbuch-Kapitel 2 Seiten hoch.
