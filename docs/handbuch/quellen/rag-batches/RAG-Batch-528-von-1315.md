# Batch 528 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 17 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Edge Service**

Die Produkt-API wurde grundlegend überarbeitet: Produktsuche und Produktdetails stehen nun als getrennte Endpunkte zur Verfügung. Die Preismatrix ist nicht mehr Bestandteil der Hauptantwort zum Produkt. Stattdessen wird der Preis dynamisch für eine angegebene Laufleistung und Laufzeit berechnet. Wird keine Laufleistung oder Laufzeit übergeben, verwendet die API standardmäßig die kleinste verfügbare Kombination. Zusätzlich liefert die API die verfügbaren Kombinationen aus Laufleistung und Laufzeit zurück. Die vollständige Preismatrix kann über einen eigenen Preis-Endpunkt abgerufen werden. Alle Endpunkte sind dokumentiert und getestet, wobei die Performance im Produktivbetrieb nicht beeinträchtigt werden soll.

Auch die Vertrags-API soll strukturell verbessert werden. Die Antwort trennt künftig die Objekte Produkt, Fahrzeug und Kunde klar voneinander, und fachliche Fehlermeldungen werden verständlicher und handlungsorientierter gestaltet. Die neue Struktur wird dokumentiert und versioniert, und automatisierte Tests decken das neue Schema ab. Dieser Punkt befindet sich derzeit noch im BAT-Test und ist blockiert, ist also noch nicht abgeschlossen.

Darüber hinaus wurden mehrere Fehler behoben. Dazu zählen fehlende Preise für Mehr- und Minderkilometer in der Antwort zum Leasing-Verlängerungsangebot sowie die Tatsache, dass der Signaturprozess für im Retail erstellte Verträge nicht ausgelöst werden konnte. Ebenfalls behoben wurde, dass sich kontingentspezifische Verträge für Leasing nicht anlegen ließen und dass der Wert für das Vertragsstartdatum bei Anfragen ignoriert wurde. Retail-Verträge für die Zahlungsart Kreditkarte wurden zudem fälschlicherweise direkt erstellt, was korrigiert wurde. Ein neu konfigurierter Vertrag löste nach der Aktivierung einen internen Fehler aus, und bei einer nicht vorhandenen Kunden-ID wurden keine Fehlerdetails zurückgegeben; auch diese Probleme sind gelöst. Außerdem wurden fehlschlagende End-to-End-Tests für Leasing in der Entwicklungsumgebung repariert. Ein Ticket zu einem internen Serverfehler beim Anlegen eines neuen Kunden über Online-Sales wurde abgebrochen und nicht umgesetzt.

Für die Zukunft sind drei Erweiterungen vorgesehen, die noch offen sind. Erstens soll der Kundentyp aus oneSCM in der Produktsuche sowie in den Endpunkten zum Erstellen und Aktualisieren von Verträgen berücksichtigt werden, und zwar für die Kanäle Leasing und Online-Sales. Hintergrund ist, dass die Verfügbarkeit von Produkten, die Größe der Preismatrizen und die Verfügbarkeit von Kampagnen an den Kundentyp gebunden sein können. Zweitens soll der Branchenfaktor, der aktuell nur für Vans genutzt wird, um Servicevertragspreise für bestimmte Branchen zu erhöhen, durchgängig in den Leasing-Endpunkten verfügbar sein. Bisher steht er nur in der Produktsuche zur Verfügung, sodass der anschließende Aufruf zum Anlegen eines Vertragsvorschlags zu einem Preisvalidierungsfehler führen kann. Drittens sollen die Leasing-Endpunkte SA-Codes als Parameter akzeptieren. Damit lässt sich bei Angabe eines Baumusters prüfen, welche technischen Optionen und Preisanpassungen zu berücksichtigen sind. Das entspricht dem Verhalten in der oneSCM-Oberfläche bei Eingabe einer FIN/VIN.

**User Interface**

Für Verträge auf dem Markt Slowakei (SK) wurde ein Feature-Toggle für die Produktivumgebung bereitgestellt.

**DevOps**

Ein Ticket zum FI-Systemstatus, der als in Ordnung erwartet wurde, aber „nicht in Ordnung“ meldete, wurde abgebrochen.