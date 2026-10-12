# Batch 204 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Änderungen und Anpassungen**

Im Bereich Revenue Management wurden mehrere Anpassungen für die Anbindung an oneERP umgesetzt. Bei der Erstellung von Werkstattrechnungen wird nun anstelle der SAP-Debitorennummer die SAP-Kreditorennummer verwendet. Das entsprechende Eingabefeld wurde von „SAP Debtor Number" auf „SAP Creditor Number" umgestellt. Wird die Partnernummer (VEGA-ID) angegeben, ermittelt das System die SAP-Kreditorennummer automatisch aus der Händlerverwaltung. Die Kreditorennummer wird außerdem in der Ansicht der Rechnung angezeigt. Die bisherige Funktionsweise der SAP-Debitorennummer bleibt unverändert.

Auch der Export der Werkstattrechnungen (E167) für oneERP wurde angepasst. Als Kontonummer wird nun die SAP-Kreditorennummer aus der Händlerverwaltung exportiert, wo bisher die Debitorennummer stand. Nach Tests mit oneERP wurden zudem weitere Änderungen an diesem Export vorgenommen: Die Dateiendung lautet nun „.txt" statt „.dat". Die Materialnummer wurde in das Feld XREF3 verschoben (ab Position 325), und an der bisherigen Stelle der Materialnummer wird nun die Fahrgestellnummer ausgegeben. Bei der Rechnungsbuchung gelten neue Buchungsschlüssel im Satztyp 2: Bei einer Rechnung lautet der Buchungsschlüssel in der ersten Zeile 31 und in der zweiten Zeile 50, bei einer Gutschrift in der ersten Zeile 21 und in der zweiten Zeile 40. Die Controlling-Buchung entfällt. Für den Export E174 gilt bei allen Typen das Sachkonto 40172100, und als Belegart wird statt „SA" nun „RC" verwendet.

Bei der Generierung der Rechnungsnummern wurden Fehler in der Nummernfolge behoben. Außerdem wurde ein Fehler behoben, durch den der Batch-Job für oneERP (E169) fehlschlug. Die Namen der Batch-Jobs für oneERP werden nun in Großbuchstaben geschrieben.

In der Oberfläche wurden die bisher getrennten Seiten zum Anlegen und Bearbeiten von Kundenrechnungen zu einer einzigen Komponente zusammengeführt. Alle Funktionen bleiben dabei unverändert erhalten.

Die geplante Erweiterung von E174 für interne Händlerrabatte und die Provisionsabwicklung für Verkäufer von Eigenbetrieben wurde nicht umgesetzt, die Arbeiten daran wurden eingestellt. Ebenso wurden mehrere Meldungen zu Fehlern bei der Verarbeitung der Datei i156 sowie zu Einträgen, die wegen fehlender Pflichtdaten nicht verarbeitet werden konnten, abgebrochen bzw. geschlossen.