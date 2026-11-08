# Batch 520 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Edge Service**

Im Edge Service wurden mehrere Verbesserungen und Fehlerbehebungen umgesetzt. Beim Anlegen eines Vertrags wird nun ebenfalls ein Datum im ISO-Format verlangt (z. B. 2025-12-01). Damit folgt der Edge Service einheitlich dem standardkonformen ISO-Datumsformat, das die Antworten von oneSCM bereits verwenden. Zuvor erwartete die Schnittstelle zur Aktualisierung von Leasingverträgen Datumsangaben in der Anfrage im Format TT.MM.JJJJ (z. B. 01.12.2025). Das führte zu einer uneinheitlichen Schnittstellenspezifikation und erschwerte die Integration durch die Leasing-Kollegen. Dieses Thema wurde als eigenständige Meldung geschlossen.

Korrigiert wurde außerdem ein fehlerhafter Preisvergleich bei der Aktivierung im Bereich Leasing. Ebenso wurde die Darstellung der Differenz zwischen dem Datum des ersten Fälligkeitstermins (FRD) und dem Erstellungsdatum des Angebots angepasst: Diese Differenz wird nun in Monaten statt in Tagen angezeigt. Schließlich wurde ein interner Serverfehler behoben, der bei der Vertragserstellung auftrat, wenn versucht wurde, einen Vertrag zu aktivieren.

**Plattformbetrieb (DevOps)**

Auch im Betrieb der Plattform gab es Neuerungen. Die Wartungsfenster der verwalteten AWS-Dienste wie Kafka, OpenSearch und RDS werden nun an die geplanten oneSCM-Wartungen angeglichen und entsprechend dem Kalender angepasst.

Zur besseren Überwachung wurden KPI-basierte Datadog-Dashboards für die oneSCM-Plattform eingeführt. Ein Dashboard zeigt die Ausfallzeiten je Service, ein weiteres den Gesamtstatus der Umgebung. Damit lassen sich Kennzahlen wie Verfügbarkeit und Ausfallminuten sowie der aktuelle Zustand der Umgebung schnell erfassen. Die Dashboards sind als Code definiert und in allen vier Umgebungen bereitgestellt. Sie decken die ECS-Services sowie die unterstützende Infrastruktur wie Load Balancer, RDS, MSK, OpenSearch und ElastiCache ab.

Für Produktivreleases wurde der Wartungsablauf definiert, dokumentiert und automatisiert. Dazu gehören ein verbindliches Runbook mit den geordneten Schritten pro Release, eine Checkliste zur Prüfung nach dem Release sowie auf diese Anforderungen abgestimmte Neustart-Pipelines. Für ECS-basierte Services wird zudem fortlaufend eine aktuelle Task-Definition-Version bereitgestellt, um eine AWS-Außerbetriebnahme (Retirement) zu vermeiden.

Zusätzlich wurde das Infrastruktur-Repository von reinem Terraform auf Terragrunt umgestellt. Es nutzt eine geschichtete Struktur aus Anwendung, Daten und Infrastruktur. Dadurch entfallen doppelte Backend-, Provider- und Umgebungskonfigurationen über die vier Umgebungen (dev, int, preprod, prod) hinweg. Alle Komponenten laufen nun in allen Umgebungen über Terragrunt, der Zustand wurde ohne Neuerstellung von Ressourcen migriert, und die Auslieferung per CI/CD erfolgt ebenfalls über Terragrunt.

Ein Reporting-Problem, bei dem der Konverter in der Tabelle der Schadenskosten fehlschlug, wurde geschlossen. Ein Vorhaben zur Bereinigung von Log-Meldungen wurde abgebrochen. Die Arbeiten zu Support und Monitoring im aktuellen Planungsintervall (PI16) sind noch in Entwicklung.