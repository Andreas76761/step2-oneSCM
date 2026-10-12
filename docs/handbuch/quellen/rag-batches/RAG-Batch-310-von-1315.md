# Batch 310 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting**

Für MBD Vans wurde das Data Product „base_service_contracts" um das neue Feld „Verso Order Number" (verso_order_number_id) erweitert. Dafür wurde ein neues Feld im UDM und im Data Product angelegt, der Wert wird aus oneSCM bezogen und in das Feld übernommen, und das Mapping-Dokument wurde entsprechend aktualisiert. Das Feld ist künftig nur für oneSCM-Verträge relevant; bei Altverträgen (Legacy) bleibt es leer. Die Änderung sollte bis Anfang März in der Produktivumgebung verfügbar sein.

Außerdem wurde ein Fehler behoben, bei dem die Spalte iso_country_code_pk in den Delta-Tabellen der Data Products Contract, Cost und Revenue leer ausgegeben wurde. Ebenso wurde ein Fehler im Customer Data Product korrigiert, der durch ein Problem mit dem Verknüpfungsschlüssel zwischen Quelle und Ziel verursacht wurde.

Im Bereich Infrastruktur und Betrieb wurde der Aqua-Dev-Account mit der ID 823880884543 stillgelegt. Für E-Mail-Benachrichtigungen bei Deployments ist künftig keine manuelle Subscription mehr nötig. Die Benachrichtigungen sollen an die konfigurierte Gruppenverteilerliste (dw_002_SC-Reporting) gesendet werden. Zusätzlich wurden die Terraform-Änderungen umgesetzt, mit denen die Data Products im Iceberg-Format bereitgestellt werden können. Der bestehende Terraform-Workflow legt nur noch die Nicht-Iceberg-Tabellen des Glue-Datenkatalogs an. Die Iceberg-Tabellen werden über einen Glue-Job in der jeweiligen Umgebung erzeugt, den der Workflow mit den passenden Parametern für Umgebung und Eingabepfad der Data-Catalog-JSON-Dateien aufruft.

Darüber hinaus wurde die Weiterleitung der AWS-Inspector-Findings an Datadog (Datadog Forwarder) ab dem 23.01.2026 umgesetzt.

Nicht umgesetzt wurden die geplante Bereitstellung des neuen Feldes aq_division_cd für die zeilenbasierte Zugriffssteuerung (Row Level Security) in ADP, die automatisierte Terraform-Bereitstellung mit OIDC-Authentifizierung sowie die Bearbeitung der Security Findings vom 12.01.2026 (alle abgebrochen). Die Prüfung der AWS-Inspector-Findings vom Januar 2026 wurde geschlossen.