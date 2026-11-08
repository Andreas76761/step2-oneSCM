# Batch 127 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Externe Vertrags- und Zahlungsreferenz für CoFiCo und SWT**

Die im Vertragsdatenmodell hinterlegten Felder „External Contract Reference" und „External Payment Reference" können von gewerblichen Kunden genutzt werden. Die Abrechnungssysteme CoFiCo und SWT erhalten und speichern diese Werte nun, sodass Rechnungen und nachgelagerte Finanzprozesse korrekt auf externe Systeme verweisen und die Nachverfolgbarkeit über Schnittstellen hinweg gewährleistet bleibt.

Beim Export für CoFiCo und SWT wird das Feld „External Contract Reference" in der L-Zeile mit dem im Vertrag gespeicherten Wert der Contract Reference befüllt. Die External Payment Reference wird aus der Vertragsebene übernommen, sofern sie vorhanden ist, und in der L-Zeile im Feld „Invoice position text" abgebildet. Wird zusätzlich ein Rechnungspositionstext angegeben, etwa bei der Erstellung einer MANU, werden beide Angaben in die Datei übernommen. Die External Payment Reference wird dabei für MANU und MPPI hinter dem Rechnungspositionstext eingefügt, zum Beispiel: „Goodwill Credit for Service done on 11.06.2026. External Payment Reference: "MS20041992"".

Fehlt die External Contract Reference oder die External Payment Reference, läuft die Rechnungserstellung ohne Fehler weiter, und das entsprechende Feld bleibt in CoFiCo/SWT leer.

**Daten je Kostenstelle und Coverage Code**

Die Berechnung pro Kostenstelle und Preiskomponenten wird erweitert. Dadurch erhält das Revenue Management sowohl den Netto-Kundenpreis als auch den Lieferantenpreis (Kostenstelle). Der Zahlungsplan des Kunden enthält den Kundenpreis, der Zahlungsplan des Lieferanten den Lieferantenpreis.

**Anpassungen im E169-Export zum PartnerBank Type**

oneERP führt mehrere Bankverbindungen pro Kunde ein, sodass ein Kunde einen Vertrag von einem Konto und einen anderen Vertrag von einem anderen Konto bezahlen kann. Die IBANs je Konto werden zusammen mit dem Feld „PartnerBank Type" gespeichert. Bei der Vertragserstellung wird der PartnerBank Type ausgewählt und im Vertrag abgelegt. Beim Export einer Rechnung an das Finanzsystem oneERP wird der PartnerBank Type im HEADER-Segment in einem neuen Feld übertragen. Dieses Feld steht nach dem Feld „ServiceContract" und ist das letzte Feld des HEADERs. Es hat eine feste Länge von 4 Zeichen: Ist der Wert leer, werden 4 Leerzeichen eingetragen, ist er kürzer als 4 Zeichen, wird er mit Leerzeichen auf 4 Zeichen aufgefüllt.

Außerdem ändert sich im Header der Wert des Felds „Type of business Transactions" von „E" auf „O". Das Feld bleibt weiterhin fest vorgegeben.

**Weitere Korrekturen**

Auf internationalen Werkstattrechnungen werden Coverage Codes bei der Rechnungserstellung nun angezeigt. Außerdem wurde ein Fehler im DocumentSignatureStatusJob behoben, der die Laufnummer nicht erhöhte und keinen neuen Eintrag in der Tabelle anlegte.