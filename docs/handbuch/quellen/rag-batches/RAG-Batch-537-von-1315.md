# Batch 537 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise: DevOps und Infrastruktur**

Im Bereich DevOps wurden mehrere Maßnahmen zur Modernisierung und Absicherung der Plattform-Infrastruktur abgeschlossen. Ein zentrales Thema war die Überwachung der Datenbanken: Da AWS zum 30. November 2025 die Performance-Insights-Konsole sowie die flexiblen Aufbewahrungsoptionen abkündigt, wurde die Überwachung der RDS- und Aurora-Instanzen auf CloudWatch Database Insights umgestellt. Dazu wurden die betroffenen Instanzen identifiziert, der passende Modus (Standard oder Advanced) bewertet, die Funktion für die Instanzen aktiviert und konfiguriert sowie bestehende Dashboards und Überwachungsskripte angepasst. Ziel war eine durchgängige und verbesserte Datenbanküberwachung ohne Datenverlust oder Funktionseinbußen.

Auch bei den Messaging-Diensten wurde die Plattform auf dem aktuellen Stand gehalten. Alle Amazon-MSK-Cluster, die noch mit der Version 3.5.1 in der Region EU-CENTRAL-1 des verwendeten AWS-Kontos betrieben wurden, sind vor dem angekündigten Support-Ende auf eine unterstützte Version aktualisiert worden. Darüber hinaus wurde der Speichertyp auf allen Umgebungen auf gp3 umgestellt.

Weitere Verbesserungen betreffen den Betrieb und die Beobachtbarkeit der Systeme. Es wurden Verbesserungen an der Datadog-Überwachung sowie am Einsatz von Secrets Manager vorgenommen. Zudem wurde der AWS Fault Injection Service (FIS) mit AWS ECS integriert. Für die Build-Infrastruktur steht eine Pipeline zur manuellen Skalierung der Runner zur Verfügung. Ebenfalls umgesetzt wurde ein Request Router für MPay.

Im Bereich Datenablage wurde mithilfe von Terraform ein CFT-Ordner im Nemesis-S3-Bucket angelegt. In diesem Zusammenhang wurde außerdem ein Berechtigungsfehler beim Data Catalog behoben.

Ein dringendes Problem, bei dem sich Benutzer der Marktoperation nicht an der Produktivumgebung anmelden konnten, wurde als Störung bearbeitet und ist inzwischen geschlossen. Die geplante Maßnahme zu fehlertolerantem Autoscaling wurde nicht umgesetzt, sondern abgebrochen.