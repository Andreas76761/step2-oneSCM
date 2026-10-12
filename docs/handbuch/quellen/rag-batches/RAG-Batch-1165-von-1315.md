# Batch 1165 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Gebührenverwaltung in der Preisversionierung

Im Bereich der Vertragskalkulation steht die Gebührenverwaltung innerhalb der Preisversionierung zur Verfügung und befindet sich im produktiven Einsatz. Bei der Anlage eines Preises sind alle Gebührenkonfigurationen verfügbar. Dies gilt sowohl für die Sparte Passenger Cars als auch für die Sparte Van. Darüber hinaus lässt sich die Gebührenkonfiguration in der Preisverwaltung (Manage prices) für die Sparte Passenger Cars über die Funktion „Edit" prüfen und bearbeiten.

Analyse der Jobs und Marktprodukte

Im Zuge einer Analyse wurden die bestehenden Batch-Jobs im Hinblick darauf betrachtet, ob sie marktübergreifend oder pro Markt umgesetzt werden. Der Import der Fahrzeugdaten über CePro für Passenger Cars und Vans wird zusammengeführt und ist bereits marktübergreifend umgesetzt. Der Job zur Synchronisierung der Servicehistorie ruft den Dienst DSB auf und prüft für jedes Fahrzeug die Servicehistorie. Der Job zur Synchronisierung von Fahrzeugbestellungen ruft AFAB oder GO auf und kontrolliert dabei den Liefertermin sowie die Zuteilung der Fahrgestellnummer. Der Fahrzeugabgleich ruft für jedes Fahrzeug in der eigenen Datenbank das System Vedoc auf und speichert die Informationen erneut. Auch diese drei Jobs sind bereits marktübergreifend umgesetzt.

Lediglich der Job zur vollständigen Synchronisierung der Produkte, der die Produkte in ElasticSearch neu indiziert, muss noch pro Markt umgesetzt werden.

Behobene Probleme

Mehrere Probleme mit einzelnen Verträgen in der Produktivumgebung wurden untersucht und abgeschlossen. Es handelt sich dabei um drei Verträge der Vertragskalkulation.