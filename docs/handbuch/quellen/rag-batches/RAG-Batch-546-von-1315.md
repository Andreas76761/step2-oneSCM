# Batch 546 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 28 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise: DevOps und Infrastruktur**

In diesem Release wurden zahlreiche Verbesserungen an der technischen Infrastruktur von oneSCM umgesetzt, die vor allem den stabilen, nachvollziehbaren und sicheren Betrieb der Anwendung betreffen. Für Anwenderinnen und Anwender ergeben sich daraus vor allem eine höhere Zuverlässigkeit und eine bessere Überwachung des Systems.

**Stabilität und Fehlerbehebungen**

Es wurden mehrere Probleme behoben, die den laufenden Betrieb betrafen. Dazu zählen Korrekturen an den Gesundheitsprüfungen der ECS-Dienste, an der Fehlerbehandlung der Lambda-Funktion im CFT-Flow sowie an Fehlern bei der Änderung von Lambda-Secrets. Ebenfalls korrigiert wurden das Abrufen der DynamoDB-Tabelle, eine ungültige Kafka-Richtlinie, die ECS-Richtlinie für S3-Buckets, ein Problem mit dem Volume-Mount bei old-part-tax sowie Speicherprobleme von Kafka in der Entwicklungsumgebung. Behoben wurde außerdem ein Fehler, durch den eine Signatur beim Erstellen nicht gespeichert werden konnte. Zudem wurden Korrekturen an IAM-Einstellungen im IaC-Repository vorgenommen, ein Fehler im Zusammenhang mit FAILURE_MINIMUM_INTERVAL_NOT_MET beseitigt und ein Problem gelöst, bei dem sich ein Benutzer bei der Testausführung in einem Git-Runner nicht anmelden konnte.

**Überwachung und Monitoring**

Die Überwachung der Anwendung wurde ausgebaut. Neben einem Monitoring des Anwendungszustands wurden die synthetischen Datadog-Tests der Preprod-Umgebung korrigiert. Im Rahmen des Datadog-/JVM-Monitorings entstehen neue Monitore für JVM-Metriken, die bei Erreichen von 80 % alarmieren. Weitere Monitore sollen alle Operationen abdecken und sämtliche Fehler aus dem APM erfassen. Außerdem wird die Integration mit dem Datadog-Agent geprüft, um zusätzliche JVM-Metriken auszulesen, etwa um festzustellen, welches Objekt den JVM-Speicher belegt. Für den Support wurden tägliche, wiederkehrende Aufgaben gebündelt und mit klaren Handlungsanweisungen versehen. Zudem werden Schwachstellen in jedem Sprint geprüft und behoben.

**Architektur und Infrastruktur**

Die Infrastruktur wurde weiterentwickelt: Es wurde eine Versionierung der Infrastruktur eingeführt und die Rollenverwaltung im IDP teambasiert gestaltet. Der öffentliche Ingress-ALB wurde angepasst. Für interne Aufrufe wird ein dedizierter ALB bereitgestellt, bei dem jeder Microservice als Target registriert ist. Interne Endpunkte werden dadurch nicht mehr direkt, sondern über einen Pfad wie onescm-internal/revenue aufgerufen, und die Skalierung kann anhand der Anzahl der Anfragen erfolgen. Die ECR-Images wurden aus dem Account ONESC-DEV in einen eigenen AWS-Account migriert. Im Zuge einer AWS-Bereinigung wurden ungenutzte Komponenten entfernt, der Abgleich der AWS-Infrastruktur mit dem Terraform-Stand per Terraform Plan geprüft, alte Checkov-Dateien entfernt, die README-Dateien mit dem Terraform-Docs-Plugin aktualisiert und der Code neu formatiert.

**Sicherheit, Nachvollziehbarkeit und Dokumentation**

Für den Produktions-Account wurde die Nachvollziehbarkeit verbessert: Bei der Anmeldung eines Benutzers wird eine Benachrichtigung versendet, und die CloudTrail-Protokolle der ausgeführten Aktionen werden per E-Mail zugestellt. Die Dokumentation wurde ebenfalls erweitert. Es liegt nun eine Anleitung (SOP) für Sicherung und Wiederherstellung samt getesteter Verfahren für RDS (Point-in-Time-Recovery), S3, Secrets Manager, Kafka und EC2 vor. Die Standardbetriebsverfahren für die Produktion wurden um detaillierte Schritte für alle Szenarien ergänzt. Die Preprod-Dokumentation wurde geprüft und so angepasst, dass sie alle Änderungen abdeckt und für das PROD-Deployment vollständig ist. Dafür wurde zuvor die gesamte Infrastruktur in der Testumgebung bereitgestellt.