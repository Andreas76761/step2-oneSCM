# Batch 532 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise: DevOps**

Im Bereich DevOps wurden mehrere Verbesserungen an der Build- und Infrastruktur-Umgebung abgeschlossen. Die Terragrunt-Module und der zugehörige Blueprint wurden um Mock-Outputs ergänzt. Dadurch können die Terragrunt-Befehle „init" und „plan" für alle Module eigenständig und ohne Fehler ausgeführt werden. Außerdem wurde die Instanzvorlage für On-Demand-Runner an Docker angepasst. Das Basis-Image für das Back-End, das in den Pipelines verwendet wird, wurde neu erstellt, um seine Größe zu verringern.

Für die geplante OTR-Integration, konkret den Abruf von Fahrzeugdaten (Teil 1), wurde die Infrastruktur des Repositories vorbereitet. Dazu gehören die Datenbank, Kafka und, falls erforderlich, OpenSearch. Zudem wurde ein Problem behoben, durch das die Seite „Health Check" nicht erreichbar war.

**Edge Service**

Der Edge Service zählt zu den wichtigsten Diensten der Architektur. Für Fehler im Edge Service wurde deshalb ein Alerting eingerichtet: Es gibt Monitore für Edge-Fehler, und bei auftretenden Fehlern werden Benachrichtigungen versendet. Diese Aufgabe wurde mit Priorität behandelt.

Außerdem wurden sämtliche Berechtigungen (Entitlements) des Edge Service neu erstellt, damit sie einfacher zugewiesen und genutzt werden können. In der ersten Phase wurde zudem eine grundlegende Eingabevalidierung für Pflichtfelder in den Edge-Service-APIs umgesetzt.

**User Interface**

In der Benutzeroberfläche wurden die Sanity-Tests der automatisierten Qualitätssicherung nach Domänen aufgeteilt. Die zugehörige Test-Status-Ansicht wurde dafür überarbeitet. Sie umfasst einen angepassten Kopfbereich, Filter mit Mehrfachauswahl und einem neuen Domänen-Dropdown sowie überarbeitete Karten.

**Hinweis zu nicht umgesetzten Punkten**

Nicht umgesetzt wurden die einheitliche Benennung ähnlicher Felder in den Edge-Service-APIs (Ticket geschlossen), die Konsolidierung von Assertions in der automatisierten Qualitätssicherung (abgebrochen) sowie ein Ticket zu einem Branch, der nicht angelegt werden konnte (geschlossen). Für diese Punkte liegen keine Änderungen vor, die im Handbuch zu beschreiben wären.