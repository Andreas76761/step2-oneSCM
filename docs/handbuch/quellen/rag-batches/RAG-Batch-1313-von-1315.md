# Batch 1313 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 15 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Architektur und Betriebsbereitschaft

Im Bereich Architektur wurden mehrere Themen bearbeitet, die die Betriebsbereitschaft der Anwendungen vor dem Go-live betreffen. Die Arbeiten wurden teamweise organisiert; beteiligt waren die Teams Explorers, M&M, Caffeine Overflow und Brabus. Je nach Team und Thema sind die zugehörigen Aufgaben als abgeschlossen (Status „Fertig") oder als geschlossen geführt.

Monitoring und Logging: Für alle Anwendungen wurde das Thema Monitoring und Logging adressiert. Vorgesehen war, zunächst festzulegen, welche Informationen auf den Log-Ebenen DEBUG, WARN, INFO und ERROR protokolliert werden sollen. Anschließend sollte das Logging im jeweiligen Service umgesetzt und verfeinert werden. Dieses Vorgehen ist für die Teams Explorers und Caffeine Overflow als fertig vermerkt, für das Team M&M als geschlossen. Auch der Teil des Teams Brabus ist abgeschlossen.

Alerting: Es wurde definiert, welche Alerts für den Go-live erforderlich sind. Für das Team M&M war vorgesehen, Alerts für den jeweiligen Service festzulegen, den Aufruf des Benachrichtigungsdienstes SNS für die definierten Alerts zu implementieren und die dafür genutzte SNS-Bibliothek in den Service zu integrieren. Diese Bibliothek war zum Zeitpunkt der Planung nur von einem Team, Brabus, umgesetzt worden. Die Aufgabe des Teams M&M ist geschlossen, die entsprechende Aufgabe des Teams Explorers ist fertiggestellt.

Skalierung: Für alle Anwendungen wurde die Skalierbarkeit betrachtet. Dazu gehörte, die Skalierbarkeit des jeweiligen Services zu prüfen, unter anderem im Hinblick auf geplante Jobs und Caching. Außerdem sollte festgelegt werden, welche Schnittstellen einen Wiederholungsmechanismus (Retry) und welche einen Circuit-Breaker-Mechanismus benötigen. Soweit zutreffend, sollten Retry sowie ein Circuit Breaker auf Basis von Resilience4j für den jeweiligen Service umgesetzt werden. Die Aufgaben der Teams Explorers, Caffeine Overflow und Brabus sind fertig, die des Teams M&M ist geschlossen.

Dokumentation: Die Anwendungsdokumentation, bestehend aus Everybook, Playbook sowie der Benennung von Verantwortlichem und Vertretung, wurde fertiggestellt.

Weitere Themen: Die Themen Hotfix- und Notfallmanagementverfahren sowie die Übersetzung der Benutzeroberfläche sind geschlossen. Nicht weiterverfolgt (abgebrochen) wurden der PROD-Release mit Freigaben sowie das Verfahren zur Wiederherstellung und deren Test, für das eine Wiederherstellung zu einem beliebigen Zeitpunkt (Point-in-Time-Recovery) als Zielzustand vorgesehen war.