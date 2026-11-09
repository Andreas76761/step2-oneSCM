# III Grammatik, Synonyme, Fehlerliste

Sprachliche Regeln und Qualitätssicherung für Kapitelentwürfe und Produkte. Gepflegt vom Agenten `sprach-lektor`; verbindlich wird eine Regel oder ein Begriff erst durch einen Menschen.

| Ordner | Datei | Inhalt |
|---|---|---|
| `01_Grammatik/` | `GRAMMATIK.md` | Rechtschreibung, Zeichensetzung, Zahlen/Einheiten/Datum, Schreibung von UI-Begriffen, geschlechtergerechte Sprache |
| `02_Synonyme/` | `SYNONYME.csv` | bevorzugte und zu vermeidende Begriffe (UTF-8, Semikolon): Bevorzugt;Vermeiden;Kontext;Sprache;Quelle;Status |
| `03_Fehlerliste/` | `FEHLERLISTE.csv`, `FEHLERLISTE.md` | gefundene Fehler mit Korrektur und Regel; Kategorien und Ablauf |

Verhältnis zu `00_Dokumentation/BEGRIFFE.md`: `BEGRIFFE.md` enthält die entschiedenen Schreibweisen; `SYNONYME.csv` ist die maschinenlesbare Liste mit allen Begriffen, auch den offenen (Status `offen`). Ein Begriff mit Status `entschieden` steht in beiden.

Status in `SYNONYME.csv`: `offen` (Klärung nötig) · `Vorschlag` (Agent schlägt vor) · `entschieden` (Mensch hat festgelegt, Datum in `ENTSCHEIDUNGEN.md`) · `verworfen`.

Die CSV-Dateien mit Excel öffnen (Daten › Aus Text/CSV, Trennzeichen Semikolon) oder direkt per Doppelklick – die Kodierung UTF-8 mit BOM erhält die Umlaute.
