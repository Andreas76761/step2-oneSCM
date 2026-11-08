# Batch 535 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release Notes: DevOps und Customer Account Center**

Im Bereich DevOps wurden mehrere Vorhaben zur Verbesserung der Entwicklungs- und Betriebsumgebung bearbeitet. Abgeschlossen wurden das Onboarding des Disco Portals sowie die Einrichtung einer GitHub App für selbst gehostete Runner, die auch das automatische Hoch- und Herunterskalieren unterstützt. Ebenfalls fertiggestellt wurde die Optimierung der CI/CD-Workflows: Ungenutzte Workflows wurden bereinigt bzw. im Sinne einer höheren Effizienz überarbeitet, sodass die GitHub-Workflows insgesamt aufgeräumter und leistungsfähiger sind.

Die Modernisierung des ECS-Deployments wurde ebenfalls abgeschlossen. Ziel war es, die Zuverlässigkeit und Verfügbarkeit von Deployments auf ECS zu verbessern. Dazu wurde die bestehende Umsetzung mit rollierenden Deployments in mehreren Szenarien mit einem Blue/Green-Deployment verglichen. Das rollierende Deployment sollte nur dann ersetzt werden, wenn das Blue/Green-Verfahren eine bessere Verfügbarkeit und ein noch geringeres Ausfallrisiko bietet.

Außerdem wurde ein Problem behoben, bei dem die DEV-Umgebung nicht erreichbar war. Zudem wurden die Zertifikate für die GO-SOAP-Schnittstelle erneuert. Die bisherigen Zertifikate liefen am 21.08.2025 ab. Für die Produktivumgebung (PRU) wurde das Zertifikat CA-GO-WS-MPC-SHA2-CC-2025-0001 eingesetzt, für die Umgebungen WAU, INU und RTU das Zertifikat CA-GO-WS-Test-SHA2-CC-2025-0001. Beide neuen Zertifikate sind bis zum 23.07.2026 gültig.

Das Vorhaben „Monitoring & Notifications" befindet sich derzeit noch in der Entwicklung. Es soll die Beobachtbarkeit, das Monitoring und die Kommunikation verbessern.

Nicht umgesetzt wurden drei Vorhaben: Der Themenblock „Certbot extraction and auto update", der die DevSecOps-Praktiken und das Schwachstellenmanagement stärken sollte, sowie das Thema „Support & Monitoring PI12" wurden geschlossen. Das Vorhaben „Infrastructure Automation & Maintenance", das Umgebungen und Infrastruktur sauber, konsistent und aktuell halten sollte, wurde abgebrochen.

Im Customer Account Center wurde im Bereich Customer Management ein Fehler korrigiert: Die Vorschau der letzten Servicevverträge wurde für Flottenkunden zuvor nicht angezeigt.