# Batch 296 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting**

Im Bereich Reporting wurden mehrere Verbesserungen und Fehlerbehebungen umgesetzt, die die Qualität und Vollständigkeit der bereitgestellten Daten betreffen.

Behoben wurden Probleme bei der Datenbereitstellung für einzelne Märkte. Dazu zählen fehlerhafte UDM-Daten für den Markt Österreich (AT) sowie fehlende Daten für die Märkte Slowakei (SK) und Indien (IN) in den Preisdetails. Auch Verträge, die für die Märkte Deutschland (DE) und Slowakei (SK) zunächst nicht berücksichtigt wurden, werden nun korrekt erfasst. Darüber hinaus wurden fehlerhafte Preisdetails im Datenprodukt „Revenue“ korrigiert. Im Datenprodukt „Contract“ wurde zudem eine falsche Verkäufer-Kennung (salesman_number_id) berichtigt.

Auch bei der technischen Verarbeitung wurden Störungen beseitigt. So schlug die Verarbeitung von Vertragsereignissen im DCS beim Schreiben in die Datenbank fehl; dieses Problem wurde gelöst. Ebenso wurde ein Fehler im Job „ReportingIspDeltaData“ behoben, bei dem der Schritt „ReportingIspDeltaDataStep“ nicht erfolgreich ausgeführt werden konnte. Außerdem werden Nemesis-Dateien nun wie vorgesehen in den Archivordner verschoben.

Derzeit befindet sich die Korrektur für einen fehlgeschlagenen Revenue-Bulk-Update im BAT-Test und ist noch nicht abgeschlossen.

Zusätzlich ist eine Anpassung vorgesehen, die noch offen ist: Das Kafka-Ereignis, das die Verkäufer-Kennung enthält, soll diese künftig nicht mehr aus dem bisherigen Feld für die Kennung des Vertragserstellers beziehen, sondern aus dem neuen Feld „Contract Salesman ID“. Damit wird die Verkäufer-Kennung der Datenbasis künftig gezielter bereitgestellt.