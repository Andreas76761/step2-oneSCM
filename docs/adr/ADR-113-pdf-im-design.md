# ADR-113 PDF im Design über einen lokalen Browser

**Status:** akzeptiert, umgesetzt in Etappe 61. Schließt den offenen Punkt aus ADR-112 (Designvorlagen).

## Kontext
Die Designvorlagen Quick Reference Guide und Handbuch-Kapitel (ADR-112) sind druckfähiges HTML. Ein PDF entstand bisher nur, wenn jemand die Datei im Browser öffnete und über „Drucken → Als PDF speichern“ sicherte. Der vorhandene PDF-Export (pdfmake) setzt das Standard-Layout. Er kann die Vorlagen nicht wiedergeben: zwei Spalten mit fortlaufenden Karten, Randfelder mit Seitenzahl, Inline-SVG.

## Entscheidung
- **Druck durch einen lokal installierten Chromium, Chrome oder Edge** (`PDF_BROWSER_PATH`). Diese Browser setzen dieselben `@page`-Regeln um wie beim Speichern aus dem Browser: Seitenformat, Kopf- und Fußzeilen mit „Seite n von N“ bzw. „STAND … | n/N“.
- **Aufruf** (`services/pdfBrowser.ts`):
  - ohne Shell (`execFile`), mit Zeitlimit (`PDF_BROWSER_TIMEOUT_MS`);
  - mit eigenem Profil und Arbeitsordner im Temp-Verzeichnis, danach gelöscht;
  - Argumente: `--headless`, `--no-pdf-header-footer`, `--print-to-pdf`.
- **Kein Netz:** Mit `--host-resolver-rules=MAP * ~NOTFOUND` lösen alle Namen ins Leere auf. Die Vorlage enthält keine Skripte, bettet Bilder als `data:`-URI ein und erlaubt per CSP nur das. Das Abschalten von Skripten per Browser-Option verhindert den Druck, deshalb entfällt es; die CSP schließt Skripte ohnehin aus.
- **Sandbox** bleibt an. `PDF_BROWSER_NO_SANDBOX=1` schaltet sie nur für Container ab, in denen der Browser als root läuft.
- **Ergebnisprüfung:** Die Datei muss mit `%PDF-` beginnen. Sonst gibt es 503 mit der letzten aussagekräftigen Zeile der Fehlerausgabe (Meldungen zu D-Bus werden übergangen).
- **API:**
  - `POST /exports` mit `format: pdf` und `design: quickref | fachdoku`. Ohne eingerichteten Browser gibt es 400 mit Hinweis auf `PDF_BROWSER_PATH` und das HTML-Format.
  - `GET /design-templates` nennt je Vorlage die `formats` (`html`, mit Browser zusätzlich `pdf`).
  - `GET /design-templates/:id/sample?format=pdf` liefert das Muster als PDF.
  - Ohne Design bleibt das PDF wie bisher (pdfmake, kein Browser).
- **Oberfläche:**
  - Auf der Seite „Export“ zeigt ein Hinweis, ob PDF im Design eingerichtet ist.
  - Die Auswahl „Design“ gibt es auch beim Format PDF; dazu „Muster als PDF“.
  - „Für den Export wählen“ stellt PDF ein, wenn verfügbar, sonst HTML.

## Begründung
- Ein Browser ist auf praktisch jedem Arbeitsplatz vorhanden (unter Windows Edge). Damit braucht die App keine neue Abhängigkeit und keinen Dienst im Netz. Die Daten bleiben lokal (M-01).
- Ein Druckweg für HTML, Browser und PDF hält die Darstellung gleich. Eine zweite Umsetzung der Vorlagen in pdfmake würde vom Muster abweichen und doppelte Pflege kosten.

## Folgen
- Neue Umgebungsvariablen `PDF_BROWSER_PATH`, `PDF_BROWSER_TIMEOUT_MS`, `PDF_BROWSER_NO_SANDBOX` (docs/08).
- Die E2E-Tests drucken mit dem Chromium von Playwright. Die Servertests nutzen einen Ersatzbrowser, der die Aufrufparameter protokolliert.
- Geprüft mit Chromium 141 (voller Browser und Headless Shell): Quick Reference Guide A4 quer mit 2 Seiten, Handbuch-Kapitel A4 hoch mit „Seite 2 von 2“, rund 0,3–0,7 s je PDF.
