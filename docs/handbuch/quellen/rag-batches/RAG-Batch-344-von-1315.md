# Batch 344 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Einrichtung der Reporting-Umgebungen mit Terraform**

Für das Reporting von oneSCM wurde die Infrastruktur auf der grünen Wiese aufgebaut. Für die Entwicklungsumgebung (DEV) und die Integrationsumgebung (INT) ist die Einrichtung mit Terraform abgeschlossen. Dazu gehören die Migration der Entwickler in die jeweilige Umgebung, die Definition der benötigten IAM-Rollen und deren Anwendung auf die Umgebungen sowie die Einrichtung der Glue-Umgebungen. Zusätzlich wurde pro Umgebung ein S3-Bucket für das DNS-Mapping über CFT angelegt. Log-Gruppen und das Logging über CloudWatch sind eingerichtet. Für INT ist festgelegt, dass hierfür DataDog verwendet werden soll. In der Entwicklungsumgebung wurden außerdem DataDog und SNS-Benachrichtigungen zum Status der Glue-Jobs vorgesehen.

Die CI/CD-Pipelines enthalten Prüfungen der Codequalität mit SonarQube samt Quality Gate in Git sowie BlackDuck-Scans. In der Entwicklungsumgebung kommt zusätzlich Checkov zum Einsatz, für INT ist ein Artifactory zum Bezug von Python-Artefakten vorgesehen. Für INT gehören außerdem zusätzliche Job-Parameter, das Kopieren von Python-Dateien aus dem erwarteten Speicherort und eine neue Pipeline zur Aktualisierung der Job-Parameter zum Umfang. Ebenso sind die Bereinigung von Pull Requests sowie Monitoring und Alerting über einen Teams- bzw. Mattermost-Kanal vorgesehen.

Das Entwicklungsteam kann Glue-Skripte entwickeln, ohne auf AWS-Ressourcen außer AWS Glue Studio zugreifen zu müssen. Die Skripte werden in Git bzw. einem S3-Bucket bereitgestellt und von dort verarbeitet. Automatisierungspipelines deployen die eingecheckten Skripte nach S3. Infrastruktur-Pipelines können die AWS-Reporting-Infrastruktur erstellen und wieder abbauen. Für INT stehen zudem die Pipelines bereit, um die Entwicklungsversion dort zu veröffentlichen, und die erforderliche Dokumentation liegt vor.

Die Einrichtung der Produktivumgebung (PROD) mit Terraform wurde nicht umgesetzt, das zugehörige Vorhaben wurde abgebrochen. Geplant waren dort unter anderem ein weiterer S3-Bucket für das eXtollo-Mapping und die Einrichtung auf Basis vorhandener Dokumentation. Diese Funktionen stehen daher derzeit nicht zur Verfügung.

**Architekturthemen im Reporting**

Mehrere Architektur- und ETL-Themen für das Reporting wurden gebündelt abgeschlossen. Der oneSCM-Datenproduktanschluss an DDX wurde begleitet, wobei beim Onboarding erkannte Lücken identifiziert und behoben wurden. Für die CFT-Integration werden der S3-Pfad und weitere erforderliche Angaben bereitgestellt, und die über CFT empfangenen Daten werden in die jeweiligen Raw-Bucket-Ordner kopiert. Für Reporting-Jobs wurde eine Benachrichtigungslösung für erfolgreiche und fehlgeschlagene Läufe definiert. Das Monitoring der Glue-Jobs erfolgt über DataDog, und es wurden Standards für das Logging innerhalb der Glue-Jobs festgelegt.

Darüber hinaus wurden eine Lösung zur Archivierung von Reporting-Daten definiert und ein Framework für Unit-Tests von Glue-PySpark-Skripten ermittelt. Eine Lösung zur Validierung der Daten zwischen Quelle und Ziel der Glue-Jobs erkennt Datenverluste. Glue-Jobs werden geschäftslogikbasiert ausgelöst: Es wird geprüft, ob die benötigten abhängigen Daten in den erforderlichen Ordnern eingetroffen sind. Die Architektur wurde so angepasst, dass oneSCM-Daten für das Reporting in das vereinheitlichte Datenmodell überführt werden.

**ETL für das Datenprodukt Revenue**

Für das Datenprodukt Revenue wurde der ETL-Prozess entwickelt. Parse-Glue-Jobs bereinigen die Revenue-Berichte und wenden die erforderlichen Validierungen an. Dabei werden die vorhandenen Parse-Jobs der Verträge wiederverwendet, um Daten in den Trusted-Bucket zu kopieren. Die Jobs starten automatisch, sobald Berichtsdateien im Raw-Bucket vorliegen. Die bereinigten Daten werden im Trusted-Bucket im Ordner „revenue“ abgelegt.

Sobald alle erforderlichen Revenue-Dateien im Trusted-Bucket vorhanden sind, startet automatisch ein Transform-Glue-Job. Er schreibt die transformierten Daten gemäß der Spezifikation des vereinheitlichten Datenmodells in den Refined-Bucket. Berücksichtigt werden Daten aus den drei Altsystemen ICON, Asset Global und Sirius. Dabei darf es keinen Datenverlust bei der Anzahl der Datensätze geben. Jeder Jobfehler löst eine Benachrichtigung aus. Vor dem Schreiben neuer Daten wird das vereinheitlichte Datenmodell gesichert und im Fehlerfall aus der Sicherung wiederhergestellt.