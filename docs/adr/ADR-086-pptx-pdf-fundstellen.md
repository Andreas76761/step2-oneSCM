# ADR-086 PowerPoint und PDF einlesen, Fundstelle je Chunk, Bild → Gliederungsstelle aus dem Folientext

**Status:** akzeptiert, umgesetzt in Etappe 34 (M2 aus [docs/06](../06-plan-onescm-metadaten.md), F-25 aus [docs/07](../07-bestehende-artefakte.md); erweitert ADR-022, ADR-029, ADR-079, ADR-084, ADR-085)

## Kontext
Für oneSCM_Metadaten sollen neben Markdown, HTML, Word und Jira auch Schulungsfolien (PPTX) und PDF-Handbücher eingelesen werden – mit einer Fundstelle je Chunk (Folie, Seite), damit Antworten und Belege auf die Stelle im Original verweisen. Daten bleiben lokal (M-02), ohne KI. Echte Beispieldateien lagen bis Etappe 34 nicht vor; getestet wird mit erzeugten Dateien.

## Entscheidung
- **PowerPoint (.pptx):** eigener Leser über die Paketstruktur (JSZip, ohne zusätzliche Abhängigkeit). Reihenfolge laut `ppt/presentation.xml`; je Folie ein Abschnitt „## Folientitel“ (ohne Titel „Folie n“), Titelfolie wird Kapitelüberschrift, sonst der Dokumenttitel bzw. Dateiname. Inhaltsplatzhalter werden Aufzählungen mit Ebenen, Textfelder Absätze, ausdrückliche Aufzählungszeichen und Nummerierungen bleiben erhalten; Tabellen als Pipe-Tabellen; Bilder als Medien (ADR-029) mit Alternativtext aus `descr`; Sprechernotizen als Zitat. Foliennummer, Datum und Fußzeile entfallen, ausgeblendete Folien werden nicht eingelesen (Hinweis im Import). Zip-Bomben-Schutz wie bei Word.
- **PDF:** Textebene mit pdf.js (`pdfjs-dist` 5.x – läuft ab Node 20.16, ohne Skriptausführung, ohne Systemschriften). Zeilen nach Grundlinie, Absätze nach Abstand und Zeilenende, Listenpunkte nach Aufzählungszeichen, Nummer oder Einzug. Überschriften aus den Lesezeichen, sonst aus der Schriftgröße (mindestens 15 % über dem Fließtext, höchstens drei Ebenen). Kopf- und Fußzeilen, die auf mindestens der Hälfte der Seiten (ab drei Seiten) an gleicher Stelle stehen, und Seitenzahlen entfallen. Seiten ohne Textebene werden gemeldet, eine PDF ganz ohne Text wird übersprungen – Texterkennung folgt mit M6 (M-05). Kennwortgeschützte PDFs werden mit Hinweis abgewiesen.
- **Fundstelle je Chunk:** Die Umwandlung setzt Markierungen in den Text; daraus entsteht je Chunk `locator` (`{ slide }`, `{ page }`, bei HTML und Word `{ anchor }` – die `id` der Überschrift aus dem HTML, sonst ein Anker aus dem Überschriftentext). Anzeige als „Folie 3“, „Seite 12“, „Abschnitt #…“, sonst wie bisher Zeilen.
- **Original:** bleibt wie bei Word erhalten und wird nur als Download ausgeliefert (`nosniff`, `sandbox`).
- **Bild → Gliederungsstelle (F-25):** Je Bild aus einer Folie werden Quelldatei, Foliennummer und -titel gespeichert (`media_context`); der Gliederungs-Vorschlag (ADR-084) nutzt Alternativtext, Folientext und Titel der Präsentation. Fehlt eine Bildunterschrift, wird der Folientitel übernommen. Den Vorschlag übernimmt die Redaktion im Bildarchiv von Hand (`media_meta.outline_label_id`), nie automatisch.
- **Seite „Einlesen“** unter oneSCM_Metadaten: mehrere Dateien auf einmal, je Datei Ergebnis und Hinweise, Übersicht der Formate mit ihrer Fundstelle. `.pptx` und `.pdf` sind Standard; gespeicherte Einstellungen mit der bisherigen Standardliste werden ergänzt.

## Folgen
- Migration `041_slides_pages.sql`; Tests T-252 … T-255, E2E T-256; Anforderungen NFR-81, NFR-82.
- Mit echten Beispieldateien sind die Schwellen (Überschriftengröße, Kopf-/Fußzeilen, Listen-Einzug) nachzuschärfen; eingebettete Bilder in PDF und Texterkennung kommen mit M6.
