# Batch 521 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Edge Service**

Für den Edge Service wurde eine Anpassung der EDGE-API vorgesehen. Der Umfang umfasste Änderungen an der API für EDGE, eine Abstimmung samt Auswirkungsanalyse sowie die Umsetzung, sofern diese bestätigt wird. Der Abschluss dieser Arbeiten ist als erledigt markiert. Weitere inhaltliche Details, etwa zu Zielgruppe, Abnahmekriterien oder Risiken, liegen nicht vor.

Ein weiteres Vorhaben zur Stabilität des Reportings im Edge Service wurde geschlossen. Zu seinem Inhalt, seinem Ziel oder seinem Umfang liegen keine Angaben vor, sodass sich daraus keine Auswirkungen für die Anwenderinnen und Anwender ableiten lassen.

**DevOps**

Die Release- und Qualitätspipeline des Reporting-Infrastrukturprojekts (reporting-iac) wurde grundlegend überarbeitet. Ziel war ein einheitlicher, automatisierter und nachvollziehbarer Release-Prozess. Zuvor verlief die Freigabe von Releases manuell und von Durchlauf zu Durchlauf uneinheitlich, was sie fehleranfällig und schwer rückverfolgbar machte. Zudem gab es keine automatische Qualitätsprüfung, sodass Probleme im Code unbemerkt bleiben konnten. Versionierung und Release-Notes waren nicht standardisiert, und auch die Sicherheits- und Freigaberegeln unterschieden sich innerhalb der Pipeline.

Im Rahmen der Überarbeitung wurde der Workflow für Infrastruktur-Releases neu geschrieben, damit Releases wiederholbar und automatisiert ablaufen. SonarQube wurde für das Repository eingerichtet, um die Codequalität zu prüfen, und die dabei gemeldeten Befunde wurden bewertet und behoben. Hinzu kommen ein Workflow zur Erstellung von Tags und Releases, die automatische Erzeugung von Release-Notes in Verbindung mit semantischer Versionierung sowie vereinheitlichte Sicherheits- und Freigaberegeln. Davon profitieren Plattform- und DevOps-Ingenieure, die Infrastruktur-Releases durchführen, Entwicklerinnen und Entwickler, die schnelles Qualitätsfeedback erhalten, Prüfende und Freigebende sowie alle, die anhand der Release-Notes nachvollziehen möchten, was wann ausgeliefert wurde.

Zu beachten ist, dass die automatische Versionierung und die Erstellung der Release-Notes auf disziplinierten Konventionen bei Commits und Pull Requests beruhen und daher die Mitwirkung der Beitragenden erfordern. Zudem sollten Schwellenwerte für Qualitäts- und Freigabeprüfungen bewusst gewählt werden, damit sie das Team nicht unnötig ausbremsen.

Die geplante Einrichtung von LocalStack für das Reporting wurde nicht umgesetzt, das Vorhaben wurde abgebrochen. Vorgesehen war, AWS-abhängigen Reporting-Code lokal testen zu können, ohne zuvor in eine gemeinsam genutzte Entwicklungsumgebung zu deployen. Da das Vorhaben nicht realisiert wurde, steht eine solche lokale Testumgebung nicht zur Verfügung. Tests von AWS-abhängigem Reporting-Code erfolgen weiterhin über die gemeinsam genutzte Entwicklungsumgebung.