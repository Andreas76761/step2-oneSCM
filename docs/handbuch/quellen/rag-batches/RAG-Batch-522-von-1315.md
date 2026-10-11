# Batch 522 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Hinweis zum Stand der Änderungen**

Im Bereich Marktkonfiguration (Market Settings) wurde die Benutzeroberfläche korrigiert: Für den Markt Indonesien (ID) wurde der Wert der Entität „Steuersatz" zuvor lediglich als Platzhalter angezeigt. Dieser Fehler ist behoben, und die Darstellung des Steuersatzes in den Markteinstellungen funktioniert wieder wie vorgesehen.

Im Edge Service wurde zudem ein Problem mit der externen Kampagnen-ID behoben. Die externe Kampagnen-ID funktionierte bisher nicht korrekt; die Korrektur ist abgeschlossen.

Ein weiterer Punkt in den Markteinstellungen, der sich darauf bezog, dass in der Benutzeroberfläche nur für eine einzelne Division ein Shortcut angeboten wird, wurde nicht umgesetzt. Die Aufgabe wurde abgebrochen, sodass sich das Verhalten an dieser Stelle nicht ändert.

**Geplante Verbesserung des Monitorings und Loggings im Reporting (derzeit pausiert)**

Für die Reporting-Plattform ist vorgesehen, Überwachung und Alarmierung auf Datadog zu bündeln. Aktuell ist das Monitoring auf verschiedene Werkzeuge verteilt, und Benachrichtigungen laufen über eine eigene SNS-Notification-Lambda, deren Pflege aufwendig geworden ist. Es gibt keine zentrale Übersicht über den Zustand des Reportings, und die Abdeckung durch Alarme ist uneinheitlich. Die Alarmierungslogik liegt zudem im Code statt in einem verwalteten Werkzeug.

Im Zielzustand fließen Metriken und Logs der AWS-Glue-Jobs sowie Ereignisse der CI/CD-Pipeline des Reportings in Datadog ein. Ein eigenes Reporting-Dashboard zeigt den Zustand der Pipelines auf einen Blick. Alarme in Datadog decken Jobausfälle und Verletzungen von Service-Level-Vereinbarungen (SLA) ab und werden an die richtigen Kanäle weitergeleitet. Sobald die Alarmierung in Datadog aktiv und überprüft ist, wird die SNS-Notification-Lambda außer Betrieb genommen. Dabei darf keine Alarmabdeckung verloren gehen; vor der Umstellung sollen beide Lösungen parallel laufen.

Nutzen sollen dies vor allem Bereitschaftsingenieure, die auf Ausfälle im Reporting reagieren, das Reporting- und Data-Engineering-Team im täglichen Betrieb sowie DevOps- und Plattform-Ingenieure, die CI/CD und Alarmierung pflegen. Vorteile sind eine einheitliche Informationsquelle, eine schnellere Erkennung von Störungen und weniger selbst betriebene Infrastruktur. Datadog wird bereits an anderer Stelle eingesetzt, und sowohl Glue als auch CI/CD stellen Daten bereit, die Datadog verarbeiten kann.

Zu den benannten Risiken zählen eine mögliche Lücke in der Alarmabdeckung bei zu früher Abschaltung der Lambda, fehlende oder zu viele Daten durch Lücken in der Integration, Fehlkonfigurationen der Alarme, die zu Alarmmüdigkeit oder übersehenen Vorfällen führen können, sowie steigende Kosten für die Datenaufnahme in Datadog je nach Menge der Metriken und Logs. Da der Status derzeit „On Hold" ist, steht der Umsetzungszeitpunkt noch nicht fest.