# Batch 718 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 17 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Im Bereich Cost Management wurden mit diesem Release mehrere Verbesserungen und Fehlerbehebungen umgesetzt, die vor allem die Erfassung von Werkstattrechnungen, den Import und Export von Rechnungsdaten sowie die Anbindung an Nachbarsysteme betreffen.

Bei der Erfassung einer Rechnungsposition für eine Werkstattrechnung oder eine internationale Werkstattrechnung wird die Fehlermeldung, wenn zu einem eingegebenen Schadencode kein Eintrag gefunden wird (etwa „No damage code found for given market code or all markets!"), nun nicht mehr als Hinweis-Popup angezeigt. Stattdessen erscheint sie direkt unter dem Eingabefeld für die Schadencode-Suche. Außerdem entfallen die Dealer-Handling-Felder in Werkstattrechnungen, auch in internationalen. Die Netto-Werte für Dealer Handling werden nur noch in der Ansicht angezeigt, und zwar ausschließlich bei importierten Werkstattrechnungen, die nicht vom Typ WSIN sind. Bei manuell erstellten Rechnungen werden sie nicht angezeigt. Zudem wurde die Feldvalidierung bei Werkstattrechnungen korrigiert, und die Anlage von Schadencodes wurde überarbeitet.

In der Administration unter „Invoices" wurde der Rechnungstyp COMM (Commissions Invoice) entfernt, da er in SCOM umbenannt wurde. Er steht entsprechend auch in den erweiterten Filtern („More filters") nicht mehr zur Auswahl. Außerdem wurde ein Fehler behoben, durch den Werkstattrechnungen in diesem Bereich nicht angezeigt wurden.

Für den Import von i156-Dateien gilt: Importierte Werkstattrechnungen erhalten nun den Status „Processed" und werden nicht mehr im Export E168 berücksichtigt. Der Batch-Job für E168 wurde aus der Batch-Job-Liste entfernt. Nach einem i156-Import werden zudem alle Kostendaten per Kafka-Nachricht an DCS gesendet. Das geschieht bei Anlage, Änderung und Löschung von Kosten. Für manuell angelegte Kosten erfolgt kein Versand, da die dafür erforderlichen Informationen nicht in der Datenbank vorliegen und fachlich nicht gefordert sind.

Beim Export E167 wird die Belegnummer (BELNR) eines Buchungsbelegs nicht mehr fest auf 6168000000 gesetzt, sondern von oneSCM für jede Werkstattrechnung generiert und in der Rechnungsnummer des FI-Systems gespeichert. Sie liegt im Bereich von 6168700000 bis 6168999999. Wird das Maximum erreicht, beginnt die Vergabe wieder bei 6168700000. Die Anzahl der Datensätze wird jetzt ohne führende Nullen ausgegeben. Weitere Korrekturen betreffen die Buchungsschlüssel im Satztyp 2 (zweite und vierte Zeile) sowie das Problem, dass E167-Dateien nach Ausführung des Batch-Jobs nicht erzeugt wurden.

Manuell angelegte Werkstattrechnungen (Rechnungstyp WSIN) werden im Status „Exported" über die Dealer Invoice Events an NEMESIS übermittelt.

Darüber hinaus wurden technische Fehler behoben: Beim Aktualisieren der Market Settings trat ein Fehler in der Konsole auf, und der Cache-Manager in Cost und Revenue wurde korrigiert.