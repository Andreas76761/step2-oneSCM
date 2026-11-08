# Batch 191 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Neuerungen und Änderungen**

**Nemesis-Ereignisse nur für Nemesis-Märkte**
In den Markteinstellungen gibt es unter „External System Settings" einen neuen Bereich „Nemesis". Berechtigte Benutzer können dort für ihren Markt festlegen, ob Nemesis-Ereignisse gesendet werden dürfen. Ist die Option „Allow Nemesis events to be sent" aktiviert, erzeugt und sendet oneSCM wie bisher auf Basis der definierten Auslöser Kunden-, Vertrags-, Umsatz- und Kostenereignisse an Nemesis. Zusätzlich werden weitere Nemesis-Einstellungen freigeschaltet. Diese Einstellungen waren bisher unter „Feature Settings -> Invoice configuration" zu finden und wurden in den Nemesis-Bereich verschoben. Ist die Option nicht aktiviert, werden für diesen Markt keine Nemesis-Ereignisse erzeugt oder gesendet. Dadurch lassen sich Märkte, in denen Nemesis nicht genutzt wird, von Nemesis entkoppeln.

**Aktualisierung von Rechnungsdaten bei Kundenänderungen**
Wird in der Kundenverwaltung die SAP-Debitorennummer oder der Name eines Kunden geändert, wird nun das Revenue Management informiert. Die Änderungen werden auf alle Rechnungen des Kunden (MPPI und MANU) übertragen, die sich im Status „Planned", „Created" oder „Accepted" befinden. Damit stimmt die SAP-Debitorennummer in der Kundenverwaltung mit der Nummer in der Exportdatei (E169) überein.

**Anpassung des Export-Jobs für VAN-Produktlinien**
Für den Geschäftsbereich VAN gelten abweichende Produktlinien: Complete, Comfort, SelectPlus, Maintenance, Extended Warranty und Tire. Der Export-Job an oneERP wird so angepasst, dass er diese neuen Produktlinien für VAN verwendet. Dabei kommt der in der Export-Typ-Zuordnung (Export type mapping) definierte Exporttyp zum Einsatz. Dieser Punkt befindet sich derzeit im Abnahmetest (BAT Testing).

**Produktlinien bei der Materialnummer für VAN**
Mit der Einführung des Geschäftsbereichs VAN hat sich die Liste der Produktlinien geändert. Für VAN stehen Complete, Comfort, SelectPlus, Maintenance, Extended Warranty, Tire und SIVECO zur Verfügung. Beim Anlegen einer Materialnummer besteht nun eine Abhängigkeit zwischen den Feldern Geschäftsbereich und Produktlinie: Zuerst wird der Geschäftsbereich gewählt, anschließend werden im Feld Produktlinie nur die für diesen Bereich verfügbaren Produktlinien angezeigt.

**Behobene Fehler**
Behoben wurde ein Marktkonfigurationsfehler, der beim Aufruf eines Dienstes auftrat. Ebenso behoben wurde ein Fehler in der Materialnummern-Suche: Die Suche nach einem Unterbereich überschrieb zuvor das Suchergebnis. Außerdem wurde ein Problem gelöst, bei dem nach der Aktivierung eines Vertrags kein Zahlungsplan erzeugt wurde.

**Nicht umgesetzte Punkte**
Zwei geplante Anpassungen wurden nicht weiterverfolgt (Status „Cancelled"). Dies betrifft zum einen die Berücksichtigung des Steuerbetrags aus der oneERP-Rückmeldedatei beim Import. Zum anderen betrifft es die Anzeige von Materialnummern, deren Gültigkeitsbeginn in der Zukunft liegt. Beim Import der Rückmeldedatei bleibt der Steuerbetrag der Rechnung daher weiterhin unberücksichtigt.