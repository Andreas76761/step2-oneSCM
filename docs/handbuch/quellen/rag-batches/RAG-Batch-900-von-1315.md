# Batch 900 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Hinweis vorab: Die beiden Ausgangsdaten sind sehr unterschiedlich belastbar. Das erste Ticket hat den Status „Cancelled“, die darin beschriebene Funktion wurde also nicht umgesetzt. Das zweite Ticket enthält nur Platzhaltertexte ohne fachliche Inhalte. Für das Benutzerhandbuch ergibt sich daher folgender Text, der die Funktion ausdrücklich nicht als verfügbar darstellt:

**Erweiterung der VdZ-Integration: Kundendaten (nicht umgesetzt)**

Die geplante Erweiterung der VdZ-Integration im Bereich Contract Generation sollte den Ablauf der Angebotserstellung beschleunigen und die manuelle Eingabe von Kundendaten reduzieren. Bislang wird die Deal-ID genutzt, um Fahrzeuginformationen und verfügbare Produkte abzurufen. Künftig sollte das System anhand der eingegebenen Deal-ID zusätzlich die zugehörigen Kundendaten aus dem Finanzsystem abrufen. Die Umsetzung wurde jedoch abgebrochen, weshalb diese Funktion in der aktuellen Version nicht zur Verfügung steht.

Vorgesehen war, dass der Vertrieb den Ablauf zur Erstellung eines Angebots mit der Deal-ID startet. Das System sollte daraufhin Fahrzeugspezifikationen und passende Produktangebote bereitstellen. Anschließend sollte das gewünschte Produkt mit allen verfügbaren Optionen konfiguriert werden können, nämlich technische Optionen, enthaltene und optionale Absicherungen, Kampagnen, Händlerrabatte, Kulanzzeit-Kampagnen (Grace Period Campaigns), Massenerstellung und Sonderfälle. Die Funktion sollte für alle Kundentypen und alle genannten Szenarien gelten.

Beim Fortfahren mit „Create Proposal“ sollte die Deal-ID an den Customer Microservice übermittelt werden, der das Finanzsystem abfragt. Existiert der Kunde dort, sollten die Kundendaten automatisch in die Kundenfelder übernommen und die Dublettenprüfung durchgeführt werden, wobei die Maske der Dublettenprüfung bereits mit den Werten vorbelegt gewesen wäre. Wäre der Kunde im Finanzsystem nicht vorhanden gewesen, hätte das System die Maske zur Dublettenprüfung angezeigt und den bestehenden Standardablauf zur Kundenanlage fortgesetzt, bei dem die Daten manuell eingegeben werden. Nach der Bestätigung der Kundendaten hätte der Vertrieb die Zahlungsinformationen erfasst und die Vertragserstellung und -aktivierung fortgesetzt.

Für Fehlerfälle war vorgesehen, dass bei einer gestörten internen oder externen Kommunikation zur Deal-ID oder bei fehlender Reaktion des Finanzsystems die Prüfungen übersprungen werden. Der bestehende Ablauf sollte dann mit der Maske und der manuellen Eingabe der Kundendaten fortgesetzt werden. Änderungen an Oberfläche und Bedienung waren nicht vorgesehen. Gestaltung und Grafiken sollten der Mercedes-Benz Workbench entsprechen.

**Sammlung von Change Requests für Contract Generation (PI14)**

Für die Sammlung von Änderungsanforderungen im Bereich Contract Generation im Programminkrement 14 liegen in den vorliegenden Daten keine inhaltlichen Angaben vor. Der Eintrag ist als abgeschlossen markiert, enthält jedoch keine Beschreibung der enthaltenen Änderungen. Für das Benutzerhandbuch lassen sich daraus keine Funktionen oder Verhaltensänderungen ableiten. Hier sollten bei Bedarf die konkreten Einzeländerungen ergänzt werden.