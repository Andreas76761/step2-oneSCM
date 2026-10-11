# Batch 539 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise DevOps: Infrastruktur und Betrieb**

Im Bereich DevOps wurden mehrere Vorhaben rund um die Infrastruktur von oneSCM abgeschlossen. Ein Schwerpunkt lag auf der Arbeit mit Terraform: Die Bereitstellung der Umgebungen wurde mit einer Terraform-basierten Deployment-Automatisierung umgesetzt. Ergänzend wurden die Terraform-Konfigurationen im Rahmen einer Sicherheitshärtung überarbeitet, und die eingesetzte Terraform-Version wurde aktualisiert. Zusätzlich wurde ein Themenblock zu Betrieb und Wartung der Produktionsumgebung (Production Operations & Maintenance) abgeschlossen.

Auch bei den eingesetzten Diensten gab es Änderungen. Die bisherige Redis-Instanz wurde auf AWS Valkey migriert, und im Zusammenhang mit Elasticache wurden Anpassungen vorgenommen. Darüber hinaus wurde Artifactory nach AWS migrated beziehungsweise in die AWS-Umgebung überführt. Für diese Vorhaben liegen in den Quelldaten keine weiteren inhaltlichen Details vor, etwa zu Zielzustand, Auswirkungen oder Abnahmekriterien.

Im Bereich Monitoring wurde die Lambda-Funktion des Datadog Log Forwarders auf die jeweils aktuelle Version aktualisiert. Die Aktualisierung erfolgte in allen Umgebungen mit Ausnahme der Produktionsumgebung. Nach dem Update wurde überwacht und geprüft, ob sich Auswirkungen ergeben.

Zudem wurde ein Fehler im Schritt „Check-deployment“ behoben. Bei einer größeren Zeichenanzahl wurde der AWS-CLI-Befehl auf mehrere Zeilen aufgeteilt, wodurch der Befehl fehlschlug.

Hinweis an die Redaktion: Im Text wurde „Artifactory nach AWS migrated“ versehentlich sprachlich vermischt. Die korrekte Formulierung lautet: „Artifactory wurde nach AWS migriert.“ Die Beschreibungsfelder der Terraform-, Redis/Valkey-, Elasticache- und Betriebs-Themen enthielten nur unausgefüllte Vorlagentexte, weshalb dazu keine weiteren Details aufgenommen wurden.