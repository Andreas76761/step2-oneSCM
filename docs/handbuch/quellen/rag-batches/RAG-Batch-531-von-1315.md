# Batch 531 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Sicherheit und Schwachstellenmanagement**

Für den Edge Service wurde das Ziel verfolgt, die in Black Duck gemeldeten Schwachstellen im Bereich Edge Contract zu beheben. Dieses Vorhaben ist abgeschlossen. Ergänzend dazu wurde im DevOps-Bereich eine Prüfung der Schwachstellen aus ECR- und Sechub-Scans für PI13 umgesetzt. Ziel war ein Confluence-Dashboard, das einen klaren Überblick über die vorhandenen Schwachstellen bietet. Außerdem sollten die Aktualisierung, die Ausführung und der Vergleich der kritischen und hochgradigen Schwachstellen aus beiden Scans automatisiert werden. Auch dieses Vorhaben ist fertiggestellt.

**Plattform, Infrastruktur und Dokumentation**

Die Interne Entwicklerplattform (IDP) wurde außer Betrieb genommen. Vor der Abschaltung wurden die Teamrollen auf die neue Lösung migriert. Die Arbeiten sind abgeschlossen. Ebenfalls abgeschlossen ist die Dokumentation der AWS-Ressourcen, etwa von Instanztypen und Datenbank-Engines. Sie sollte auf GitHub Pages oder in Confluence bereitgestellt werden, und zwar mithilfe eines Skripts auf Basis der AWS CLI (EC2 oder CSV-Upload).

**Repositories und Pipelines**

Unter dem Titel „Repository & Pipeline Improvements“ wurden Sicherheit, Dokumentation und Automatisierung der Repositories verbessert. Dazu gehörten die Korrektur der Maskierung von CodeArtifact-Token, die Aktualisierung der GitHub-Übersichtsseiten und die automatische Erzeugung der Dokumentation für Terraform-Module. Auch dieses Vorhaben ist fertig. Abgeschlossen ist außerdem das Vorhaben zu GitHub Runners und AWS-Integration. Konkrete Angaben zum Zielverhalten liegen dafür nicht vor.

**Betrieb und Überwachung**

Das Vorhaben „Support & Monitoring PI13“ ist abgeschlossen. Zum angestrebten Verhalten enthalten die vorliegenden Informationen keine näheren Angaben.

**Nicht umgesetzte und geplante Vorhaben**

Die Konfiguration von AWS-Health-Themen wurde abgebrochen. Vorgesehen war, die bestehende Lambda-Funktion durch integrierte AWS-Health-Themen zu ersetzen. Außerdem sollten Zustellkanäle (Webhook, GChat) eingerichtet und ein Terraform-Modul für die AWS-Health-Integration umgesetzt werden. Das Vorhaben „Production Maintenance Window“ befindet sich im Dev Backlog und ist noch nicht umgesetzt. Es sieht vor, Änderungen außerhalb der üblichen Betriebszeiten vorzubereiten und bereitzustellen, um die Auswirkungen auf die Produktion möglichst gering zu halten.