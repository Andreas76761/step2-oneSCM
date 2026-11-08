# Batch 912 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Branchenberücksichtigung in der Vertragserstellung**

Bei der Erstellung eines Vertragsangebots berücksichtigt das System die Branchen, die auf Produktebene zugeordnet sind. Branchen wirken dabei als Aufschlagsfaktoren auf den Grundpreis des Produkts. Die Preisdaten dazu werden im Product Microservice gepflegt. Branchencodes aus Vega bleiben unberücksichtigt, es zählen ausschließlich die auf Produktebene definierten Branchen. Die Funktion gilt nur für Commercial-Kunden, Commercial-Fleet-Kunden und Commercial-Governmental-Kunden.

Der Vertrieb startet ein Vertragsangebot mit der gewünschten Kundenkennung, woraufhin das System alle passenden Produkte anzeigt. Wählt der Benutzer ein Produkt zur Konfiguration aus, erscheint das Feld „Branche“ als Auswahlliste. Ist dem Produkt keine Branche zugeordnet, zeigt das System im Feld „-“ schreibgeschützt an, und die Konfiguration kann fortgesetzt werden. Ist dem Produkt dagegen eine Branche zugeordnet, aber noch keine aus der Auswahlliste gewählt, kann der Vertrieb nicht zum nächsten Konfigurationsschritt wechseln.

Wählt der Benutzer eine Branche aus, die einen definierten Preisfaktor besitzt, ruft das System den Preis aus dem Product Microservice ab und aktualisiert den Gesamtpreis entsprechend, sodass der Preis inklusive Branchenaufschlag angezeigt wird. Ist für die gewählte Branche kein Preis hinterlegt, bleibt der Produktpreis unverändert, und das System zeigt den Grundpreis ohne Aufschlag an. Die gewählte Branche bleibt im weiteren Aktivierungsablauf erhalten und wird in den Vertragsdetails angezeigt.

Die Branchenauswahl wird in den MO Checks als Prüfpunkt markiert. Der Market Operator muss sie bestätigen, bevor die Aktivierung fortgesetzt werden kann. Bei der Aktivierung des Servicevertrags erzeugt das System das i155-Dokument einschließlich des Branchencodes und übermittelt die Branchen- sowie die aktualisierten Vertrags- und Preisdaten an die Systeme Revenue und Nemesis. Dieser Teil wird nach Umsetzung einer separaten Erweiterung zur Aufnahme des Branchencodes in die Aktivierungsbenachrichtigung und das i155-Dokument erneut getestet.

**Geplante Erweiterungen: Vertragserstellung für Online Sales**

Für den Vertriebskanal Online Sales ist vorgesehen, dass Kunden Serviceverträge direkt in einem Online-Shop abschließen und diese den Prozess der Vertragserstellung und Aktivierung durchlaufen. Der Aktivierungsprozess einschließlich aller internen Prüfungen soll dabei so nah wie möglich am Ablauf für den stationären Handel (Retail) liegen. Vorgesehene Nutzer sind MPC/MO und HQ. Zu definieren sind die Vertragsstatus, die internen Prüfungen und der gesamte Prozessablauf. Dieses Vorhaben ist noch nicht umgesetzt.

Da im Online-Verkauf kein Händler beteiligt ist, soll außerdem entweder ein generischer Händler verwendet oder das Verkäuferfeld als Pflichtfeld in der Vertragserstellung entfernt werden. Auch diese Anpassung ist noch offen, und es steht noch nicht fest, welche der beiden Varianten umgesetzt wird.