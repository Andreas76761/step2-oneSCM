# Batch 339 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting: technische Verbesserungen an der Datenverarbeitung**

Im Bereich Reporting wurden mehrere Verbesserungen an der zugrunde liegenden Datenverarbeitung abgeschlossen. Ein Schwerpunkt lag auf dem ETL-Prozess, der mit einem Glue-Job arbeitet. Bisher wurde dabei jedes Mal der gesamte Datenbestand gelöscht und vollständig neu geschrieben. Im Rahmen der Arbeiten wurde untersucht, ob sich stattdessen nur die geänderten Daten (Delta) erkennen und aktualisieren lassen. Als mögliche Lösung wurde unter anderem das Iceberg-Format betrachtet, wobei alle denkbaren Aktualisierungsmöglichkeiten für Iceberg-Daten geprüft werden sollten. Die Aktualisierung der Delta-Daten sollte effizient erfolgen. Dazu sollte die Schreibleistung bei vollständigem Datenbestand mit der Schreibleistung bei reiner Delta-Verarbeitung gemessen und verglichen werden.

Auch die Abläufe für die Synchronisierung wurden überarbeitet. Zuvor lief die automatische Synchronisierung für die Umgebungen Dev und INT gleichzeitig über einen gemeinsamen Workflow. Nach der Untersuchung verschiedener Workflows für alle Umgebungen und der Umsetzung der besten Variante verfügen Dev und INT nun über voneinander unabhängige Workflows. Die Ergebnisse der Untersuchung wurden dokumentiert.

Weitere Untersuchungen betrafen die Infrastruktur. DynamoDB-Einträge wurden bisher über Python-Skripte erzeugt, da Terraform nicht in der Lage ist, mehr als 50 Einträge anzulegen. Ziel war, die Erstellung der DynamoDB-Einträge und die Verwendung der KMS-Schlüssel über Terraform abzubilden. Zudem wurden der S3-Verschlüsselungsschlüssel und der KMS-Schlüssel bisher manuell von den IAM-Rollen verwendet. Es wurde daher geprüft, wie sich die Verschlüsselung und die KMS-Schlüssel dynamisch nutzen lassen. Die Ergebnisse beider Untersuchungen wurden dokumentiert, und die jeweils machbare Lösung sollte umgesetzt werden.

Zur Qualitätssicherung wurden für alle bestehenden Glue-Jobs Unit-Tests eingeführt, für die es zuvor noch keine gab. Gemäß dem oneSCM-Qualitätsstandard muss die Testabdeckung jedes einzelnen Glue-Jobs über 80 Prozent liegen.

Außerdem wurde der Parse-Job für die Vertragsdeckung (Contract Coverage) angepasst, sodass im Vertragsordner eine zusätzliche Kopie von contract_coverage erstellt wird. Dafür waren Änderungen am Parse-Job für die Vertragsdeckung der Systeme iCON und AssetG sowie am Transform-Trigger erforderlich.