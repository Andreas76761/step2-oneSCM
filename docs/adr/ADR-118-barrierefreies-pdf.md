# ADR-118 Barrierefreies PDF im Design mit Prüfbericht

**Status:** akzeptiert, umgesetzt in Etappe 66 (Wahl des Auftraggebers vom 24.10.2026: „Barrierefreies PDF“). Erweitert ADR-113 (PDF im Design) und ADR-016 (Barrierefreiheit).

## Kontext
PDF im Design entsteht über einen lokalen Chromium-Browser (ADR-113). Für Leserinnen und Leser mit Screenreader muss das PDF getaggt sein: mit Strukturbaum, Sprache, Titel, Lesezeichen, ausgezeichneten Überschriften, Alternativtexten der Bilder und Tabellenköpfen. Das Standard-PDF (pdfmake) ist nicht getaggt.

## Entscheidung
- **Druck mit Tags und Lesezeichen:** Der Browser bekommt `--export-tagged-pdf` und `--generate-pdf-document-outline`.
  - Die Tags folgen der HTML-Struktur der Vorlagen: Überschriften, Absätze, Listen, Tabellen mit Spaltenbezug, Abbildungen mit `alt`, Links.
  - Dekorative Icons sind `aria-hidden` und erscheinen nicht als Abbildung.
  - Chromium setzt Sprache (`lang`), Titel und „Dokumenttitel anzeigen“.
- **Bessere Struktur:** Die Kennzahlen-Karten des Handbuch-Kapitels sind eine Liste (`ul`/`li`) statt loser Blöcke.
- **Prüfbericht** (`domain/pdfAccessibility.ts`) nach jedem PDF-Export, in der API als `accessibility` und auf der Seite „Export“:
  - getaggt (MarkInfo), Strukturbaum, Sprache, Titel, Fenstertitel, Lesezeichen;
  - Überschriften, Abbildungen mit Alternativtext, Tabellen mit Kopfzellen.
  
  Gelesen werden die Objekt-Wörterbücher. Bei gepackten Objektströmen gelten die Strukturprüfungen als „nicht prüfbar“. Beim Standard-PDF nennt der Bericht die Lücken und verweist auf PDF im Design.
- **Keine Konformitätsbehauptung:** Der Bericht prüft die Grundlagen in Anlehnung an PDF/UA (ISO 14289-1). Eine vollständige PDF/UA-Prüfung, etwa mit dem Matterhorn-Protokoll, bleibt Aufgabe eines Prüfwerkzeugs wie PAC oder veraPDF.

## Begründung
- Chromium erzeugt aus sauberem HTML bereits gute Tags. Entscheidend sind die Schalter und eine semantische Vorlage.
- Ein eigener, kleiner Prüfbericht macht Fortschritt und Rückschritte sichtbar, ohne neue Abhängigkeit.

## Folgen
- Geprüft mit Chromium 141: Quick Reference Guide und Handbuch-Kapitel bestehen alle neun Prüfungen. Ohne den Lesezeichen-Schalter meldet der Bericht die fehlende Gliederung.
- Das Standard-PDF bleibt ungetaggt; für barrierefreie PDFs ist PDF im Design der Weg.
