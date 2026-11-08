# Batch 117 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

Der Ablauf bei der Ablehnung eines Vertrags mit Vorab-Zahlung (Pre-activation Payment) wurde erweitert. Wird ein solcher Vertrag abgelehnt und der zugehörige Zahlungslink wurde nicht genutzt, die Rechnung also nicht bezahlt, kann MPay den Zahlungslink nun ungültig machen. Kundinnen und Kunden können dadurch nicht mehr über diesen Link zahlen.

Außerdem wurde ein Fehler behoben, bei dem der PTXT über alle Exporttypen hinweg nicht korrekt war. Ebenfalls behoben wurden MPay-Fehler, die beim Anlegen einer MANU ausgelöst wurden.

Derzeit in Entwicklung ist die Übersetzung von Schadenscodes. Bisher ließen sich nur manuell angelegte Schadenscodes in ihren Übersetzungen bearbeiten, während per Datei-Upload importierte Schadenscodes schreibgeschützt waren. Nutzer mussten deshalb Umwege gehen oder ganze Dateien erneut hochladen, um eine einzelne Übersetzung zu korrigieren. Künftig sollen Admin- und MPC-Nutzer auch importierte Schadenscodes bearbeiten können. Alle in oneSCM vorhandenen Schadenscodes, ob manuell angelegt oder importiert, sind dann editierbar. Die Bearbeitung beschränkt sich auf die Übersetzungen, der Wert des Schadenscodes selbst kann nicht geändert werden.

Für den Upload einer Schadenscode-Datei gelten folgende Regeln: Ein Schadenscode, der in oneSCM, aber nicht in der hochgeladenen Datei vorhanden ist, wird aus oneSCM gelöscht. Ein Schadenscode, der in beiden vorhanden ist und nicht manuell bearbeitet wurde, erhält die Übersetzung aus der Datei. Wurde seine Übersetzung dagegen manuell bearbeitet, bleibt sie erhalten und wird nicht überschrieben. Ein Schadenscode, der nur in der Datei vorkommt, wird mit den Übersetzungen aus der Datei neu angelegt. Beim Upload werden außerdem alle Sprachen über alle Märkte hinweg mit den Werten aus dem hochgeladenen Dokument vorbelegt. Fehlt für eine Sprache eine Übersetzung in der Datei, wird für diese Sprache Englisch als Standardwert gesetzt.

Nicht umgesetzt wurden die Vertragsverlängerung (Prolongation) mit MPay sowie die Korrektur der falschen Position von Währung und Kundenrechnungstyp und des fehlenden Exports von Cofico-Rechnungen. Beide Vorhaben wurden abgebrochen.