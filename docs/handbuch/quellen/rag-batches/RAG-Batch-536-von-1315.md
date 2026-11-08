# Batch 536 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise: DevOps und Customer Account Center**

Im Bereich DevOps wurden mehrere Maßnahmen abgeschlossen, die den Betrieb und die Überwachung von oneSCM betreffen. Die Migration zur GitHub Cloud ist abgeschlossen. Ebenfalls umgesetzt wurde eine Korrektur am Git-Runner-Template. Zu den abgeschlossenen Arbeiten gehört außerdem der Themenbereich Support und Monitoring.

Die Überwachung wurde mit Datadog verbessert. Ziel ist, Fehlerraten und die Verfügbarkeit von Diensten besser zu überwachen und automatisch zu melden. Dabei sollen Zuständigkeiten und Eskalationswege klar geregelt sein. Bei Bedarf erfolgt die Benachrichtigung per E-Mail, und es wird ein Jira-Fall angelegt.

Für den Fall, dass oneSCM in der Produktivumgebung nicht verfügbar ist, wurde die Meldung in der Benutzeroberfläche angepasst. Die Anwenderinnen und Anwender werden nun klar darüber informiert, dass oneSCM gerade repariert wird. So soll verhindert werden, dass sie in dieser Zeit unnötig eine Eskalation auslösen. Weiterführende Informationen zur Lösung bei nicht funktionierender Umgebung stehen in der zugehörigen Confluence-Dokumentation.

Auch die technische Basis wurde aktualisiert. Die Version der Betriebssystem-Engine wurde angehoben, und ein Engine-Upgrade für RDS wurde durchgeführt. Zudem wurden die ECS-Aufgaben an die geänderte Standard-Protokollierung von AWS angepasst. AWS ändert das Standardverhalten beim Logging von ECS-Tasks. Deshalb wurden die Task-Definitionen, die Logging-Konfigurationen und die Monitoring-Pipelines geprüft und angepasst. Damit soll sichergestellt werden, dass ECS-Tasks weiterhin korrekt und mit voller Transparenz protokollieren und dass Logs nicht unerwartet umgeleitet werden oder verloren gehen.

Zwei weitere Vorhaben aus dem DevOps-Bereich wurden geschlossen: die Integration von FIS in die Managed Services sowie die Bereitstellung von Dumps der Produktions- und der Pre-Produktionsumgebung. Zu diesen beiden Vorhaben liegen keine näheren Angaben zum Ergebnis vor.

Im Customer Account Center wurden zwei Anwendungsfälle zur Kreditkartenverwaltung geprüft. Der erste betrifft den Fall, dass das System eine Karte nach der letzten Erinnerung und der Umsatzbestätigung als abgelaufen kennzeichnet. Der zweite betrifft den Fall, dass Kundinnen und Kunden ihre Kreditkarte vor Ablauf aktualisieren und das System daraufhin keine Erinnerungen mehr sendet. In beiden Fällen gelten dieselben Voraussetzungen: Es besteht ein aktiver Servicevertrag mit einer gültigen Kreditkarte (Asset-ID und NTR), die CIAM-ID ist mit dem Vertrag verknüpft, und das Customer Account Center sowie die Mercedes-me-Authentifizierung funktionieren.