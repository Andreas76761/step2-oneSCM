# Batch 538 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**DevOps – Neuerungen und Verbesserungen**

Im Bereich DevOps wurden mehrere Vorhaben abgeschlossen, die den Betrieb und die Absicherung der Plattform betreffen. Die Informationen dazu beschränken sich auf die Themen selbst; detaillierte Beschreibungen, Zielzustände oder Abnahmekriterien liegen für die meisten Vorhaben nicht vor.

Abgeschlossen wurde die Integration zwischen GitHub und Terraform. Ebenfalls fertiggestellt sind Anpassungen an der Beobachtbarkeit (Observability) in AWS sowie die Migration auf Graviton. Darüber hinaus wurde die Optimierung von Richtlinien mithilfe des IAM Access Analyzer umgesetzt. Eine Änderung im Zusammenhang mit Artifactory auf Seiten von DevOps wurde ebenfalls abgeschlossen.

Zur Stabilität und Sicherheit des Systems wurden außerdem zwei Fehlerbehebungen vorgenommen: Ein Verbindungs-Timeout (CONNECTION_TIME_OUT) beim File Scanner wurde behoben, und ein Problem bei der AWS-Anmeldung auf den Runnern wurde korrigiert. Zudem wurden Sicherheitsbefunde bearbeitet und behoben. Der laufende Support und das Monitoring wurden im Rahmen eines eigenen Vorhabens abgeschlossen, ebenso die Aktualisierung und Validierung der Dokumentation.

Nicht umgesetzt wurden zwei Vorhaben, die abgebrochen wurden: die Anpassung einer WAF-Regel, mit der eine IP-Adresse von blockierten Ereignissen ausgenommen werden sollte, sowie Verbesserungen am Application Performance Monitoring. Letztere sollten die Überwachung um die Darstellung von Nutzungsverläufen (User Journey) und Heatmaps erweitern, einschließlich Seiten, Fehlern und durchgängiger Ende-zu-Ende-Verfolgung (E2E-Tracing). Diese Funktionen stehen daher nicht zur Verfügung.