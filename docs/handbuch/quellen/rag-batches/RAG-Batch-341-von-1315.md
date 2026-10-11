# Batch 341 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting: Neuerungen und Änderungen**

**Automatisierte Bereitstellung von Infrastrukturänderungen**
Bisher haben die DevOps-Mitarbeitenden Workflows manuell gestartet, um Terraform-Änderungen in der Entwicklungsumgebung und in den höheren Umgebungen bereitzustellen. Dieser Ablauf wurde automatisiert. Änderungen, die in den Main-Branch übernommen werden, werden nun automatisch in der Entwicklungsumgebung (DEV) ausgerollt. Für die Umgebungen INT und PROD stehen Workflows zur Verfügung, die auf Basis einer manuellen Freigabe ausgelöst werden. Diese Workflows stellen neben den Terraform-Änderungen auch die Modulskripte (zum Beispiel für Lambda und Glue) bereit. Die Skripte werden dazu vor dem Anwenden der Terraform-Änderungen in den S3-Bucket der jeweiligen höheren Umgebung übertragen. Das Runbook wurde entsprechend der Umsetzung aktualisiert.

**Anbindung von Datenprodukten an AQUA**
Die Datenprodukte von oneSCM liegen im S3-Data-Product-Bucket. Für die Integration mit AQUA wurde das Onboarding des Datenprodukts „Base Service Contract“ gestartet und der Ablauf mit dem AQUA-Team abgestimmt. Die vereinbarten Schritte wurden umgesetzt, sodass das Datenprodukt in AQUA zur Verfügung steht. Die Dokumentation für das Onboarding weiterer Datenprodukte in AQUA liegt vor.

**Nicht umgesetzte Vorhaben**
Folgende Vorhaben wurden abgebrochen und sind daher nicht Teil des Funktionsumfangs.

Geplant war ein eigenes Datenprodukt für den Markt Deutschland und die Division Cars. Es sollte ausschließlich Daten dieses Marktes und dieser Division enthalten und aus den bestehenden, marktübergreifenden Datenprodukten „Base Service Contract“ und „Base SC Revenue“ abgeleitet werden, da DDX keinen zeilen- und spaltenbasierten Datenzugriff unterstützt. Vorgesehen war außerdem eine Variante nur für „Base SC“. Beide Vorhaben wurden abgebrochen, die entsprechenden Datenprodukte stehen daher nicht zur Verfügung.

Ebenfalls abgebrochen wurde ein Sammelvorhaben, das die aus PI3 übrig gebliebenen Aufgaben für eine Priorisierung und Umsetzung in PI4 bündeln sollte.