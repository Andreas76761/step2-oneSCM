# Batch 93 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Anpassung der E169-Schnittstelle für Altteilesteuer-Transaktionen**

Im Bereich Revenue Management wurde die Schnittstellendatei im Format E169 angepasst, damit Vorgänge der Altteilesteuer korrekt steuerlich eingeordnet werden und den geltenden fachlichen Anforderungen entsprechen. Bisher wurde im Satztyp HEADER das Feld „Type of Business Transaction" für Transaktionen aus dem Altteilesteuer-Prozess mit dem Wert „O" befüllt. Diese Zuordnung wurde geändert.

Wird eine Transaktion als Altteilesteuer-Transaktion (Used-Parts-Tax-Transaktion) erkannt, schreibt die Schnittstelle im HEADER-Satz nun den Wert „4" anstelle von „O" in das Feld „Type of Business Transaction". Für alle anderen Geschäftsvorfallarten bleibt das bisherige Verhalten unverändert, ihre Zuordnung wird nicht angepasst.

Die Änderung betrifft die Erzeugung der E169-Datei, die Mapping-Logik des HEADER-Satzes sowie nachgelagerte Systeme, die E169-Dateien weiterverarbeiten. Nicht betroffen sind die Satzstruktur und die Feldlänge, die übrigen Satztypen und die anderen Transaktionskategorien. Auch die Länge und die Position des geänderten Feldes in der Datei bleiben gleich.

Beim Test mit einer Transaktion, die als Altteilesteuer-Transaktion gilt, wird die E169-Datei erfolgreich erzeugt. Der HEADER-Satz enthält dann im Feld „Type of Business Transaction" den Wert „4", und die Datei besteht die Validierung in den nachgelagerten Systemen.

Hinweis: Die Überschrift der Rohdaten erwähnt zusätzlich eine Anpassung von „HTXT06" und des Datumsformats auf der Position (POS). Die Beschreibung enthält dazu keine Angaben, daher wurden diese Punkte hier nicht näher ausgeführt.