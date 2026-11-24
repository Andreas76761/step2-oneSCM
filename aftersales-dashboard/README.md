# Aftersales Parts – Head of (Version 3.0)

KPI-Dashboard für den Teile-Aftersales eines Premium-Fahrzeugherstellers auf **erfundenen Testdaten**: 41 Register, 9 Simulationen, Import/Export, Booklet (PDF, Word, PowerPoint), Chat-Fenster mit Maßnahmen-Tracker und ein Excel-Template.

Dieser Ordner ist die Quelle der Wahrheit für das veröffentlichte Dashboard. Er ist eigenständig: kein Bezug zu den übrigen Ordnern des Repositories, kein Teil von dessen npm-Workspaces und der CI.

## Aufbau

| Ordner | Inhalt |
|---|---|
| `src/` | Die Seite: `index.html` (Markup und Stile) und 41 Skripte (`app.js` Kern, `calcs.js` und `v3calc.js` berechnete Datensätze, `v3.js` neue Register, `sim.js` Simulationen, `imp*.js`/`exp.js` Import und Export, `bk*.js` Booklet, `chat.js` Chat …). Die Reihenfolge der Skripte steht in `index.html`. |
| `data/` | Alle 74 Datensätze als JSON (`_manifest.json` listet Titel und Beschreibung). Blattnamen des Excel-Imports = Dateinamen. |
| `excel/` | Generator des Excel-Templates (`main.py`) mit 16 Registern, 3 Formel-Simulationen und allen Datenblättern. |
| `test/` | Browser-Testlauf mit Laufzeit-Ersatz (`dash-mock.js`), Server (`server.js`) und Prüfungen (`run.js`). |

## Tests

```bash
npm install                 # d3 für den Laufzeit-Ersatz (Playwright wird mitgeführt)
npm test                    # Browser-Testlauf, 102 Prüfungen
npm run test:shots          # zusätzlich Screenshots nach test/screenshots/
npm run test:excel          # Excel-Template bauen, mit LibreOffice rechnen, Kernwerte prüfen
```

Der Browser-Testlauf lädt die Seite mit einem Ersatz für die Dashboard-Laufzeitumgebung (`window.dash`, Datensätze aus `data/`), öffnet alle 41 Register und prüft: keine Skriptfehler, Inhalt sichtbar, Summen-Kennzahlen, alle 9 Simulationen (u. a. Ausgangslage der Gesamtrechnung = Betriebsergebnis im Register Ertrag, Preis/Zoll ohne Änderung = 0) und Eckdaten der Datensätze.
Ist im System bereits ein Chromium vorhanden, den Pfad mit `CHROMIUM_PATH=/pfad/zu/chrome npm test` angeben.

Grenzen: Der Laufzeit-Ersatz bildet nur `dash.data`, `dash.calc`, `dash.params` und `dash.onData` nach. Datenbank, Chat-Speicher und die Darstellung im Artifact-Fenster (Farben, Themen) sind nicht Teil des Tests.

## Excel-Template erzeugen

```bash
pip install openpyxl
npm run excel               # schreibt Aftersales_Parts_Excel_Template_v3.xlsx
```

Das Template liest `data/` und die Kennzahlen-Definitionen aus `src/calcs.js` und `src/v3calc.js`. Für die Neuberechnung (Werte sichtbar ohne Excel) hilft `soffice --headless --convert-to xlsx`.

## Veröffentlichen (Artifact)

Das Dashboard ist ein Artifact vom Typ „Dashboard“. Jede Datei in `src/` entspricht einem Dokument `files/<Name>` mit dem Feld `text`; jeder Datensatz in `data/` einem Asset, auf das `datasets/<id>` über `source.url` zeigt.

1. Datei ändern, `npm test` ausführen.
2. Dokument `files/<Name>` mit dem Dateiinhalt als `{ "text": … }` aktualisieren (mit `if_version`).
3. Geänderten Datensatz als neues Asset hochladen und `datasets/<id>.source.url` umstellen.
4. Danach `src/` gegen den veröffentlichten Stand abgleichen: Texte der Dokumente und Dateien müssen gleich sein.

Wichtig: Vor dem Überschreiben eines Dokuments immer den **aktuellen** veröffentlichten Stand holen. Eine veraltete lokale Kopie hat schon einmal Änderungen überschrieben; der Testlauf hat das sofort gezeigt.

Größenlimit: `index.html` darf als Dokument 262.144 Byte nicht überschreiten (aktuell rund 245 KB). Neue Programmteile gehören in eigene Skripte unter `src/`.

## Annahmen und Grenzen

* Alle Daten sind erfunden. Die Kopplungsfaktoren der Gesamtrechnung (`data/sim_coupling.json`) und die Annahmen in `data/sim_params.json` (Wareneinsatzquote, Kapitalkostensatz, Lieferfähigkeit) sind Annahmen, keine Messwerte.
* In der Gesamtrechnung sind die Fixkosten so kalibriert, dass die Ausgangslage dem Betriebsergebnis im Register Ertrag entspricht.
* Noch fest im Code: Kostenanteil 62 % in der Preis/Zoll-Simulation sowie weitere Konstanten in den Simulationen Bestand, Netz und Werkstatt.
