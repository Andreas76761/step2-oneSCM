# Batch 530 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise für das Benutzerhandbuch**

**Edge Service: Kurzfristige Verlängerung über die API**

Die Funktion der kurzfristigen Verlängerung (Short-Term Extension), die bisher nur im oneSCM-Frontend zur Verfügung stand, ist jetzt auch über den Edge Service per API nutzbar. Externe Systeme können damit Vertragsverlängerungen direkt und vollautomatisiert auslösen, ohne dass ein manueller Eingriff durch das Mobility Operations Team (MO) im Frontend erforderlich ist. Die Funktion richtet sich vor allem an MBLD, das eine vollständige Integration des Vertragsmanagements mit oneSCM plant. Typische Anwendungsfälle sind eine Verzögerung bei der Lieferung eines neuen Fahrzeugs, obwohl der Kunde bereits einen Folgevertrag abgeschlossen hat, sowie der Fall, dass ein Kunde sein Fahrzeug zum Vertragsende nicht zurückgibt und der Service-Leasingvertrag monatlich informell verlängert wird. In beiden Fällen ist eine Verlängerung um insgesamt bis zu sechs Monate möglich.

Zur Auslösung sendet MBLD über den Edge Service eine Anfrage mit der Servicevertragsnummer und der gewünschten Anzahl an Verlängerungsmonaten. Die Anfrage wird im Vertrags-Microservice geprüft. Voraussetzung ist, dass der Servicevertrag den Status „Aktiv“ hat und das zugrunde liegende Produkt für die kurzfristige Verlängerung konfiguriert ist. Geprüft werden außerdem die Einstellungen für Division und Markt, die Preis- und Berechtigungsregeln sowie die Vorgabe, dass die Summe aller kurzfristigen Verlängerungen, einschließlich bereits durchgeführter, sechs Monate nicht überschreitet. Zudem darf der Vertrag die maximal zulässige Laufzeit unter Berücksichtigung der ursprünglichen Vertragslaufzeit und früherer Verlängerungen nicht überschreiten.

Ist die Verlängerung nicht zulässig, wird die Anfrage abgelehnt und der Absender erhält eine Antwort mit der Begründung der Ablehnung. Gründe können ein ungültiger Vertragsstatus, eine überschrittene maximale Verlängerungsdauer oder eine nicht unterstützende Produktkonfiguration sein. Ist die Verlängerung zulässig, wird sie durchgeführt: Der Zahlungsplan und die Vertragswerte (Laufzeit, Enddatum, Laufleistung und Preis) werden aktualisiert, das Frontend zeigt die neuen Werte an, und die aktualisierten Vertragsdaten werden an Revenue und Nemesis übermittelt. An MBLD werden als Antwort das neue Vertragsende, die neue Vertragslaufzeit, die Gesamtlaufleistung, die monatliche Rate und der Gesamtpreis zurückgegeben. Eine E-Mail-Benachrichtigung wird dabei nicht versendet.

**Customer Account Center: Verträge mit Bestandskunden**

Im Rahmen der Qualitätssicherung wurde der Ablauf für das Anlegen von Verträgen mit bereits bestehenden Kunden erweitert. Dies umfasst die manuelle Anlage von Kunden für die Kundengruppen Privat, Gewerbe und Gewerbe-Flotte sowie die Erstellung von Verträgen für bestehende Kunden dieser Gruppen. Die dafür erforderlichen Schritte und die MO-Prüfungen wurden entsprechend angepasst.

**DevOps: Betriebliche Verbesserungen**

Im Bereich DevOps wurden Anpassungen an den Health Checks des Configuration Service vorgenommen, die Integration von Fehlern bei ECS-Deployments in CloudWatch umgesetzt und ein Wochenend-Shutdown für niedrigere Umgebungen eingeführt. Weitere Details liegen hierzu nicht vor.