# Batch 340 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Anbindung von oneSCM an das Reporting**

Für das Reporting wurde die technische Grundlage geschaffen, damit Reporting-Daten aus oneSCM künftig in standardisierter Form bereitstehen. Bisher holte eine Legacy-Anwendung die Daten aus verschiedenen Quellen, wandelte sie in ein einheitliches Format um und lud sie in eine Datenbank, auf die die Reporting-Werkzeuge zugriffen, um Berichte zu erzeugen. Die Reporting-Daten zu Servicekontrakten liegen nun im S3-Bucket des Reporting-AWS-Accounts. Sie werden dort als Unified Data Model (UDM) und als Data Product (DP) im Parquet-Format bereitgestellt. Die bestehende Lösung wird über ETL Glue transformiert, die Quelldateien der Berichte werden über CFT verfügbar gemacht. Neu ist die Anforderung, UDM und DP auch für oneSCM-Daten zu erzeugen.

Dafür kommen zwei Microservices zum Einsatz. Der Data Capture Service nimmt die Reporting-Daten entgegen, die die einzelnen Microservices bei ihrer Erzeugung in ein Kafka-Topic schreiben, und speichert sie in einer Postgres-Datenbank. Zusätzlich stellt er eine API zum Export der Reporting-Daten bereit. Der Reporting Service führt geplante Jobs aus, die die Daten über diese API abrufen und in den „refined“-Bucket im Reporting-AWS-Account schreiben.

Alle erforderliche Infrastruktur sowie die CI/CD-Pipelines für beide Microservices stehen zur Verfügung. Data Capture Service, Reporting Service und Managed Kafka sind Teil von „onescm-iac“ im AWS-Account „onescm“. Die Rollen und Richtlinien für den Zugriff auf den „refined“-Bucket im Reporting-Account werden über „reporting-iac“ angelegt. Damit hat der oneSCM-AWS-Account passende IAM-Zugriffsrechte auf die Ordner des „refined“-Buckets, und die Dokumentation zur Infrastruktur als Code liegt vor.

**Verbessertes Logging und Monitoring mit Datadog**

Die Datadog-Anbindung im Reporting wurde erweitert. Zuvor wurde die Integration der Logs manuell über ein Abonnement von CloudWatch geprüft, Lambda-Logs waren in Datadog nur für abonnierte Funktionen sichtbar, SNS diente lediglich der Benachrichtigung bei fehlgeschlagenen Glue-Jobs, und die Integration bestand nur in der Entwicklungsumgebung. Nun ist die Datadog-Integration sowohl für INT als auch für Prod umgesetzt.

Beim Logging werden die CloudWatch-Abonnements für alle Lambda-Funktionen und Glue-Jobs über Terraform eingerichtet. Alle Logs lassen sich in Datadog einsehen und nach Host, Service, Status, Umgebung und weiteren Standard-Tags filtern.

Bei den Benachrichtigungen ist zusätzlich Microsoft Teams angebunden. Benachrichtigungen gehen an die abonnierten Mitglieder in SNS sowie an einen Teams-Kanal. In Teams wird bei fehlgeschlagenen Jobs auf jeder Ebene, bei erfolgreicher Erstellung eines DP und bei der Wiederherstellung eines DP benachrichtigt. Über SNS wird bei fehlgeschlagenen Jobs auf jeder Ebene und bei lang laufenden Jobs benachrichtigt.

Für das Monitoring wurden in Datadog zwei Dashboards für das Reporting eingerichtet, eines für Glue und eines für Lambda. Das Glue-Dashboard zeigt die Glue-Job-Metriken. Das Lambda-Dashboard enthält die Metriken, die bereits im Dashboard „[onescm][onescm-all][all]AWS Lambda“ vorhanden sind, sowie weitere Angaben zu jeder Ausführung: Laufzeitversion des Programmtyps, Start- und Endzeit, Dauer, abgerechnete Dauer, Speichergröße, maximal genutzter Speicher, Initialisierungsdauer und Ausführungsstatus (erfolgreich oder fehlgeschlagen).