# Batch 1305 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Architektur und Qualitätssicherung in oneSCM**

Im Bereich Architektur wurden mehrere Themen bearbeitet, die teils bereits abgeschlossen sind, teils noch umgesetzt werden oder nicht weiterverfolgt wurden.

**Abgeschlossene Arbeiten**

Die automatisierten End-to-End-Tests für die Bereiche Revenue und de-custom-market wurden repariert. Die C4-Architekturdiagramme wurden aktualisiert, sodass sie die aktuellen Systemstrukturen widerspiegeln. Für das Projekt Brabus umfasste das C4-Upgrade zusätzlich die Aktualisierung und Prüfung der Abhängigkeiten, auch im Hinblick auf neue Abhängigkeiten, sowie die Pflege der zugehörigen Confluence-Seite mit dem C4-Modell.

Im Kontext von MultiMarket und Alice wurden die Benutzerrollen und Berechtigungen marktübergreifend unter Einbeziehung der Sicherheitsteams überprüft und weiterentwickelt. Die Rollenstrukturen der Organisationen sollten geklärt, umgesetzt und im Alice-System für VAN und PC visualisiert werden. Hierfür waren laut Vorgabe noch fachliche Spezifikationen erforderlich.

Die Fehlerbehandlung wurde vereinheitlicht, indem der Standardumgang mit dem HTTP-Fehler 403 angepasst wurde. Außerdem wurde die Dokumentation der APIs erstellt und validiert, mit Schwerpunkt auf den Edge-APIs, den Fehlercodes und Beispielen für Anfragen.

Ebenfalls abgeschlossen ist die Bearbeitung der BlackDuck-Findings für das Team Explorers; Ziel war die Behebung der dort gemeldeten Befunde. Zudem wurde die Anpassung der Log-Level umgesetzt: Nicht kritische Fehler sollen künftig mit den Stufen Warning bzw. Info protokolliert werden.

**Geplante Arbeiten**

Im Dev Backlog befindet sich die Änderung der Impressumsdaten in oneSCM und den Markteinstellungen. Vorgesehen ist, die bisherige Lösung zum Hochladen des Impressums zu entfernen und stattdessen eine API-Schnittstelle zu integrieren. Zusätzlich soll ein Endpunkt für das Customer Account Center bereitgestellt werden, der die zugehörigen Daten sowie die UI-Anforderungen für die kundenseitige Website bereitstellt. oneSCM soll dabei das neue Impressum aus der API verwenden.

Ebenfalls im Dev Backlog liegt die Bearbeitung der ECR-Findings (Elastic Container Registry). Dabei sollen Schwachstellen und Probleme aus den ECR-Scans behoben werden. Aktuell wurden kritische Findings im Document-Management-Service, im Customer-Service und im Notification-Service festgestellt, die behoben werden sollen.

**Offene und nicht weiterverfolgte Themen**

Das Thema „Cleanup in der App nach Testläufen“ im Rahmen der automatisierten Qualitätssicherung ist offen. Zu Ziel und Umfang liegen derzeit keine näheren Angaben vor. Die geplante Behebung kritischer SecHub-Findings für das Team Explorers wurde abgebrochen und wird nicht weiterverfolgt.