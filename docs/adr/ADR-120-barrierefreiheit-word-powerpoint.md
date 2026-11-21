# ADR-120 Barrierefreiheit für Word und PowerPoint mit Prüfbericht

**Status:** akzeptiert, umgesetzt in Etappe 68. Erweitert ADR-115 (Designvorlagen als Word), ADR-116 (Designvorlagen als PowerPoint) und ADR-118 (barrierefreies PDF mit Prüfbericht).

## Kontext
Seit Etappe 66 prüft die App jedes PDF auf die Grundlagen der Barrierefreiheit. Word- und PowerPoint-Exporte hatten keinen solchen Bericht. Außerdem zeigten sich in den erzeugten Dateien Lücken, die die Barrierefreiheitsprüfung von Microsoft Office meldet:
- Icons hatten weder Alternativtext noch die Markierung „dekorativ“.
- Alle Bilder in Word trugen dieselbe ID.
- Die Dokumentsprache fehlte in den Word-Standardformaten.
- Im Quick Reference Guide als Word waren die Kartentitel keine Überschriften.
- Die Folien der Designvorlagen hatten keinen Titelplatzhalter, sondern nur ein Textfeld.

## Entscheidung
- **Nachbearbeitung Word** (`finishDocx` in `domain/officeAccessibility.ts`) für jeden Word-Export, im Standard und im Design:
  - Dokumentsprache `de-DE` in den Standardformaten, auch mit eigener Firmenvorlage;
  - Bilder ohne Namen und Beschreibung (die Icons) als „dekorativ“ markiert (Office-Erweiterung `adec:decorative`, ältere Programme überspringen sie);
  - eindeutige Bild-IDs.
- **Quick Reference Guide als Word:** Dokumenttitel als Überschrift 1, Kartentitel und „Die Prozesse im Überblick“ als Überschrift 2 – ohne Balken, im bisherigen Aussehen. Damit erscheinen sie im Navigationsbereich.
- **PowerPoint:** Der Folientitel jeder Designfolie ist ein Titelplatzhalter (`<p:ph type="title"/>`) an der bisherigen Stelle. Icons sind als „dekorativ“ markiert.
- **Prüfbericht** nach jedem Word- und PowerPoint-Export (`accessibility`, Karte „Barrierefreiheit (Word)“ bzw. „(PowerPoint)“ auf der Seite „Export“):
  - Word: Titel, Sprache, Überschriften als Formatvorlage, Bilder mit Alternativtext (dekorative zählen nicht mit), Tabellen mit Kopfzeile.
  - PowerPoint: Titel, Sprache, jede Folie mit Titel (mit Hinweis auf doppelte Titel), Bilder mit Alternativtext, Tabellen mit Kopfzeile.
  - Als Tabelle zählt nur, was mehr als eine Zeile hat. Einzeilige Tabellen sind Layout (Boxen, Karten, Kennzahlen). Verschachtelte Tabellen werden einzeln gezählt.
  - Der Hinweis bei einem Befund nennt die Abhilfe: Alternativtext am Bild im Kapitel; die Kopfzeile kommt aus der ersten Markdown-Zeile.
- **Keine Konformitätsbehauptung:** Der Bericht prüft die Grundlagen in Anlehnung an die Barrierefreiheitsprüfung von Office. Lesereihenfolge, Farbkontraste in Office und Linktexte prüft er nicht.

## Begründung
- Dieselben Regeln wie beim PDF machen alle Ausgabeformate vergleichbar. Die Redaktion sieht Lücken sofort nach dem Export, nicht erst beim Empfänger.
- Die Nachbearbeitung im ZIP ist unabhängig von der Bibliothek `docx` und wirkt auch auf Firmenvorlagen.

## Folgen
- Geprüft mit den Mustern beider Designvorlagen und mit LibreOffice (Umwandlung nach PDF): Aussehen unverändert.
- Tests T-381, T-382, E2E T-383; NFR-155.
