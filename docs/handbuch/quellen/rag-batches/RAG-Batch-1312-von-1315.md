# Batch 1312 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 21 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Architektur und Systembetrieb**

Im Bereich Architektur wurden mehrere Verbesserungen umgesetzt, die sowohl den Datenschutz als auch die Bedienbarkeit und Stabilität des Systems betreffen.

Für die Zustimmung zu den Nutzungsbedingungen (Terms of Usage) gibt es ein Löschkonzept auf Benutzerebene. Die Tabelle, in der die Zustimmungen der Benutzer gespeichert werden, wird nach einer festgelegten Anzahl von Jahren gelöscht, damit keine personenbezogenen Daten gespeichert bleiben, die nicht mehr benötigt werden. Bei aktiven Benutzern erfolgt die Löschung nach drei Jahren, gerechnet bis zum Ende des Jahres nach der letzten Aktualisierung der Nutzungsbedingungen. Das bedeutet, dass diese Benutzer den Nutzungsbedingungen erneut zustimmen müssen, auch wenn sich diese nicht geändert haben. Bei nicht mehr aktiven Benutzern erfolgt die Löschung drei Jahre nach der letzten Anmeldung. Ergänzend kann eine Protokolldatei von einem Batch-Job heruntergeladen werden. Sie wird auf S3 gespeichert, ist ein Jahr lang verfügbar und enthält die Benutzer-ID, Datum und Uhrzeit sowie die Version der Nutzungsbedingungen.

Auch die Oberfläche wurde angepasst. Die Schaltfläche „Admin Section" ist für die Händlerrolle (Dealer) nicht mehr sichtbar, da sie keinen Inhalt hatte. Alle englischsprachigen Fehlermeldungen wurden ins Deutsche übersetzt, und die deutschen Übersetzungen im Frontend wurden aktualisiert. Zudem wurde ein Problem bei der Seitennavigation behoben, bei dem Einträge fehlten bzw. das Seiten-Dropdown betroffen war.

Für einen stabilen Betrieb wurden im Backend der Umgang mit Optimistic Locking bei Batch-Jobs verbessert und eine Prüfung für verwaiste Job-Instanzen eingeführt. Ein Fehler bei der Anmeldung an der oneSCM-App für Händler, MO und weitere Benutzer wurde behoben. Nach der Aktualisierung des Security Clients am 21. Juni wurden außerdem die End-to-End-Tests für alle Anwendungen angepasst.

Darüber hinaus wurden die Vorbereitung der Release-Teststrategie abgeschlossen und die Testausführungen skaliert.

Zur Systemdokumentation erstellen die Teams Anwendungskontext-Diagramme nach dem C4-Modell. Als Beispiel dient der Contract Service. Jedes Team legt einen eigenen Tab für seinen Service an und dokumentiert alle internen Kommunikationswege, darunter REST, Kafka, S3 und Datenbank. Dies wurde für die Teams Explorers, Caffeine Overflow und M&M umgesetzt. Ebenfalls abgeschlossen ist die Anwendungsdokumentation (Everybook, Playbook, Verantwortlicher und Stellvertreter) für die Teams M&M, Explorers und Caffeine.

Für das Alerting wurde definiert, welche Alarme für den Go-Live erforderlich sind. Dies wurde für die Teams Brabus und Caffeine abgeschlossen. Für Caffeine umfasste das die Definition der Alarme für den Service sowie die Anbindung der SNS-Bibliothek, die bislang nur von einem Team (Brabus) umgesetzt wurde, an den Service.