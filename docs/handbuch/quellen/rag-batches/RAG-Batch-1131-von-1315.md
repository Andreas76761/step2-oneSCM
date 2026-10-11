# Batch 1131 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Abruf von Fahrzeuginformationen in der Vertragskalkulation**

In der Vertragskalkulation können Benutzer zu einem Fahrzeug die Marke, die Sparte (Division) und die Verkaufsbezeichnung abrufen. Diese Funktion steht bereits im produktiven Einsatz. Welche Einstiegsdaten dafür genutzt werden können, hängt vom Fahrzeugtyp und der Benutzerrolle ab.

Benutzer mit Zugriff auf Pkw können die drei Angaben für einen Pkw über die Auftragsnummer, den Modellcode oder die Fahrzeugidentifizierungsnummer (FIN/VIN) abrufen. Benutzer mit Zugriff auf Transporter (Vans) können sie für einen Van über den Modellcode abrufen. Benutzer mit kombiniertem Zugriff auf Pkw und Vans können sowohl für Pkw als auch für Vans den Modellcode oder die FIN/VIN als Einstieg verwenden.

**Änderungen an der Kalkulation (noch nicht freigegeben)**

Eine geplante Anpassung der Kalkulationslogik befindet sich derzeit im Status „BU Blocked“ und ist daher noch nicht umgesetzt. Die folgenden Angaben beschreiben den geplanten Stand und können sich noch ändern.

Hintergrund ist eine Vereinbarung zwischen Mercedes-Benz und den Händlern zur Auszahlung der Provision. Auf dem deutschen Markt legen die Händlerverträge fest, dass Verwaltungsgebühren und Inflationsanpassungen in die Berechnungsbasis der Händlerprovision einfließen müssen. Das aktuelle System berücksichtigt diese Bestandteile bislang nicht korrekt. Dadurch erhalten Händler weniger Provision als vertraglich vereinbart.

Geplant sind zwei Änderungen: die Berechnung der Händlerprovision und die Berechnung des Inflationsaufschlags. Beim Inflationsaufschlag sollen künftig zusätzlich die zahlungsbezogene Verwaltungsgebühr (einmalig oder monatlich) und der Verwaltungsgebührenbetrag in die Berechnungsbasis einfließen, neben Grundpreis, enthaltenem Optionsumfang, technischen Optionen, optionalen Deckungsumfängen (sofern für die Industrie als enthalten markiert) und Industriefaktor-Preis. Die Händlerprovision soll künftig auf derselben erweiterten Basis berechnet werden und zusätzlich den Inflationsaufschlag berücksichtigen. Die übrigen Preisbestandteile wie Grundpreis, Optionsumfänge, technische Optionen, Industriefaktor-Preis, Rabattaktion, Händlerrabatt und Mehrwertsteuer bleiben in ihrer Berechnung unverändert.

Die Umsetzung soll so geprüft werden, dass das System die Händlerprovision und den Inflationsaufschlag nach den erweiterten Formeln berechnet und die aktualisierten Werte per Datenübermittlung (Payload) an die Vertragsdomäne weitergegeben werden. Zu klären ist noch, welche Auswirkungen die Änderung auf andere Kalkulationen hat, etwa auf die Prolongation oder die Berechnung komplexer Produkte.