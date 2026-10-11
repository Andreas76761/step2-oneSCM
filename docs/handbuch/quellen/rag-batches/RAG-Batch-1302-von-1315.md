# Batch 1302 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 22 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Architektur und Systemstabilität**

Im Bereich Architektur wurden zahlreiche Verbesserungen an der technischen Basis von oneSCM vorgenommen. Die Import- und Exportordner für die Schnittstellen zu SWT und CoFiCo wurden angepasst. Für SWT liegen der Ausgangs- und der Eingangsordner nun unter dem Umgebungspfad im Bereich „IN/SWT" mit der Kennung „IN_E169". Für CoFiCo wurden der Ausgangs- und der Eingangsordner entsprechend im Bereich „SK/CoFiCo" mit der Kennung „SK_E169" aktualisiert. Die Ordner für technische Rückmeldungen („IN_E169_ERROR" bzw. „SK_E169_ERROR") sind in der Struktur vorgesehen, die zugehörigen Abläufe müssen jedoch noch eingerichtet werden. Die Pfadänderungen müssen zudem im CFT-Flow nachgezogen werden.

Die Finanzfunktionen wurden neu organisiert: Die Module der Kostenverwaltung wurden entfernt und in den Revenue-Service integriert. Dadurch entsteht eine einheitliche Finanzdomäne, die Doppelungen reduziert und die Wartung sowie die Umsetzung künftiger Funktionen erleichtert. Außerdem wurden die Kafka-Debug-Logs der Revenue-Anwendung entfernt, da sie innerhalb von zwei Tagen rund 35 Millionen Logeinträge erzeugt hatten.

**Technische Aktualisierungen und Qualitätssicherung**

Die technische Plattform wurde modernisiert. Angular wurde von Version 15.2.0 auf 18.2.X angehoben, und die Explorers-Komponenten laufen nun mit Java 21 statt Java 17. Im Rahmen der Qualitätssicherung wurden Schwachstellen behoben (PI12), die Smoke- und Sanity-Tests korrigiert, AQA-Abläufe für leistungsfähigere Unit-Tests umgesetzt und weitere Architekturthemen der PI13 abgeschlossen. Zusätzlich wurden weitere Frontend-Tests durchgeführt.

**Navigation**

Die Hauptnavigation wurde rein visuell überarbeitet. Es werden neue Icons verwendet, und der Punkt „MO Checks" wurde entfernt und unter „Contract Generation" eingeordnet. Die Reihenfolge der Registerkarten wurde entsprechend der vorgegebenen Nummerierung angepasst. An den Rollen wurde dabei nichts geändert.

**Markteinstellungen und Konfigurationsservice**

In den Markteinstellungen wurden mehrere Fehler behoben. Bei neuen Märkten, insbesondere in Indonesien und der Slowakei, ist nun Englisch statt Deutsch als Standardsprache voreingestellt. Das Speichern von Inflationswerten löst keinen internen Serverfehler mehr aus, und beim Hochladen einer Datei tritt kein Fehler wegen doppelter Schlüssel mehr auf. Die Entwicklungsumgebung der Markteinstellungen ist wieder erreichbar.

Auch im Konfigurationsservice wurden Korrekturen vorgenommen. Die DEV- und INT-Umgebungen sind wieder zugänglich. Dem Händlerbenutzer „VAN" war zusätzlich die Rolle „PC" zugewiesen, was korrigiert wurde. Bei einem fehlgeschlagenen Systemlogin werden Platzhalter nun als Meldung bereitgestellt.

**Weitere Fehlerbehebungen**

Produkte für den Markt Slowakei konnten zuvor nicht abgerufen werden, da der Zugriff mit dem Fehler 403 abgelehnt wurde; dies wurde behoben. Bei der Ausführung von Batch-Jobs wurde zudem eine falsche Benutzerkennung verwendet, was korrigiert wurde. Schließlich wurde das Problem behoben, dass die Sprache wiederholt auf Englisch zurückgesprungen ist.