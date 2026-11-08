# Batch 14 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Verbesserungen in der Baumuster-Suche und Fahrzeuggruppen**

Die Baumuster-Suche im Vehicle Management wurde in mehreren Punkten überarbeitet. Beim Laden oder Neuladen der Seite zeigten die Schaltflächen zuvor für den Bruchteil einer Sekunde einen Ladezustand mit internen bzw. Systembezeichnungen an. Dies trat besonders nach dem Leeren des Caches auf, aber auch bei nahezu jeder Aktualisierung. Die Schaltflächen verwenden nun den Ladezustand der MB Workbench mit einer rotierenden Animation. Außerdem wurde ein Darstellungsproblem behoben: Beim ersten Aufruf der Baumuster-Suche nach der Anmeldung oder in einer neuen Sitzung wurde die Liste der Baureihen nicht korrekt geladen und erschien lediglich als einzeilige Bildlaufleiste. Die Baureihenliste wird nun vollständig und ohne visuelle Beeinträchtigungen angezeigt.

Auch die Filter der Baumuster-Suche wurden verbessert. Zuvor zeigte ein Filter-Dropdown nach der Auswahl von Werten, etwa bei Marke/Division, Klasse und Baureihe, beim erneuten Öffnen nur die bereits ausgewählten Optionen an. Um eine andere Option zu wählen, musste die bestehende Auswahl zunächst abgewählt werden. Nun werden sowohl ausgewählte als auch nicht ausgewählte Optionen angezeigt. Zudem wurde die Ladezeit des Dialogs „Weitere Filter“ behandelt, der in der Baumuster-Suche, die Sie über die Verwaltung von Fahrzeuggruppen erreichen, teilweise erst nach fünf bis sieben Sekunden erschien, während die Filter anderer Module sofort geladen wurden. Er soll sich nun unmittelbar öffnen.

Beim Entfernen eines Baumusters aus einer Fahrzeuggruppe erschien zwar die Erfolgsmeldung zur Aktualisierung der Gruppe, das Baumuster blieb jedoch in der Liste sichtbar und verschwand erst nach einem Neuladen der Seite. Das Baumuster wird nun direkt nach dem Entfernen aus der Liste ausgeblendet.

**Verständlichere Fehlermeldung bei der Vertragserstellung**

Bei der Erstellung eines Vertrags im Modul Vertragsgenerierung wurde bei einem unplausiblen anfänglichen Kilometerstand eine technisch formulierte Fehlermeldung angezeigt. Sie nannte den eingegebenen Kilometerstand und den zuletzt dokumentierten Servicekilometerstand. Die Meldung wurde als nicht benutzerfreundlich eingestuft, und der Fehlerhinweis soll nun verständlicher formuliert angezeigt werden.

Hinweis: Ein weiteres Problem, bei dem die Baumuster-Suche vereinzelt nicht korrekt geladen wurde, wurde nicht umgesetzt und ist daher nicht Teil dieser Änderungen.