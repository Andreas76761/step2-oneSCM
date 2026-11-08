# Batch 527 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise: Edge Service**

Im Edge Service wurde ein Fehler behoben, bei dem ein Leasingvertrag mit einer falschen Gesamtlaufleistung aus der Produktkonfiguration angelegt wurde. Ebenfalls korrigiert wurde ein Fehler, bei dem die Endpunkte zum Abrufen von Produkten eine Fehlermeldung zurückgaben, wenn Produkte mit einem Inflationsfaktor abgefragt wurden.

Für Produkt- und Preisanfragen wurde die Verarbeitung von SA-Codes vorbereitet. Der Leasingkanal übermittelt bei solchen Anfragen keine Fahrzeugidentifikation wie FIN/VIN oder Auftragsnummer, sondern das Baumuster und eine Liste von SA-Codes. Damit oneSCM die verfügbaren Produkte und die korrekten Preise ermitteln kann, muss das System die vom Leasing gelieferten SA-Codes auswerten und die zugehörigen technischen Optionen bestimmen, etwa allgemeine Optionen, Reifengrößen, Reifentypen oder Radgrößen. Ziel ist, dass die über die Schnittstelle übergebenen SA-Codes verarbeitet werden können. Zu beachten ist, dass dieser Punkt den Status „Geschlossen" trägt und nicht als „Fertig" geführt wird.

Außerdem wurde die Machbarkeitsprüfung zusammengeführt. Bisher wurden die Machbarkeitsprüfungen für OS und Leasing getrennt mit jeweils eigener Logik und eigenen Antworten ausgeführt. Künftig prüft eine einheitliche Machbarkeitsprüfung sowohl die OS- als auch die Leasing-Regeln und liefert eine einzige, konsistente Antwort. Vorgesehen sind ein gemeinsamer Endpunkt für die Machbarkeitsprüfung, konsistente Ergebnisse über alle Abläufe hinweg, verständliche Fehlermeldungen sowie die Nutzung des neuen Endpunkts durch alle bestehenden Abläufe. Die Tests sollen alle Machbarkeitsszenarien abdecken, und es sollen keine Regressionen in der Produktion auftreten.

**Release-Hinweise: DevOps**

Im Bereich DevOps wurden mehrere Vorhaben abgeschlossen. Dazu gehören die Migration von SonarQube, Anpassungen an den Terraform-Konfigurationen und Skripten für den AWS-Einstieg sowie Ergänzungen im Repository für Infrastruktur als Code. Dort wurde ein PR-Kommentator eingeführt, der die Lesbarkeit innerhalb von Pull Requests verbessert, ebenso wurden Branching-Regeln festgelegt. Abgeschlossen sind auch die Arbeiten zu Support und Monitoring im PI14.

Ebenfalls abgeschlossen ist die Schwachstellenprüfung für ECR und Sechub im PI14. Vorgesehen ist ein Confluence-Dashboard, das einen klaren Überblick über Schwachstellen bietet. Aktualisierung, Ausführung und Vergleich der kritischen und hohen Schwachstellen aus den ECR- und Sechub-Scans sollen automatisiert werden.

Noch in Entwicklung befindet sich das Vorhaben „Infrastructure Security & Platform Hardening". Es soll Sicherheit, Stabilität und Compliance der Cloud-Infrastruktur durch wichtige Upgrades, Patches und Erweiterungen der Sicherheitswerkzeuge verbessern. Die Aktualisierung der GitHub-Pages-Dokumentation ist noch nicht umgesetzt und liegt derzeit im PI-Backlog.