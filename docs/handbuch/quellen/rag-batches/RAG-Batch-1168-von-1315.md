# Batch 1168 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Berechnung eines Servicevertrags mit komplexer Reifenoption (Van Unlimited)

Das System berechnet den Preis eines Servicevertragsprodukts mit komplexer Reifenoption nach festgelegten Regeln und übergibt das Ergebnis anschließend an den Generierungsprozess. Voraussetzung dafür ist, dass das Reifenprodukt samt Preisen angelegt ist, die Sales Dependency als Mehrfachauswahl aus Standalone-Produkt und Produktoption konfiguriert ist und ein Servicevertragsprodukt mit Reifenoption (Blueprint "Tire Option YES") sowie die zugehörigen Preise vorhanden sind.

Sowohl für das Servicevertragsprodukt als auch für den Reifenvertrag gilt dieselbe Preislogik. Der Fahrzeuggesamtpreis (Vehicle Total Price) setzt sich aus Basispreis, Optionspreis, Preis der technischen Option und Branchenfaktorpreis zusammen. Der Marktlistenpreis (Market List Price) berücksichtigt den Fahrzeuggesamtpreis, die Händlerprovision, die Zahlungsadministrationsgebühr, die Administrationsgebühr und den Inflationsaufschlag. Der Kundennettopreis ergibt sich aus dem Marktlistenpreis abzüglich Rabattkampagne und Händlerrabatt. Der Kundenbruttopreis besteht schließlich aus dem Kundennettopreis zuzüglich Mehrwertsteuer.

Wird ein Servicevertrag zusammen mit einer Reifenoption verkauft, gelten für die Kombination besondere Regeln. Bei der Zahlungsadministrationsgebühr wird nur die Gebühr des Servicevertrags berücksichtigt, nicht die der Reifenoption. Die Administrationsgebühr der Reifenoption wird dagegen in die Berechnung einbezogen und zur Administrationsgebühr des Servicevertrags addiert. Bei der Rabattkampagne zählt ausschließlich die Kampagne des Servicevertrags. Der Händlerrabatt wird als der vom Händler auf den Gesamtpreis vergebene Wert berechnet. Die Händlerprovision ergibt sich aus dem Maximalwert des Servicevertrags plus dem Maximalwert der Reifenoption.

Die Reifenoption wird dabei nur berücksichtigt, wenn der Händler sie ausdrücklich auswählt. Das System berechnet zunächst die Einzelpreise des Servicevertragsprodukts und des gewählten Reifenprodukts jeweils so, als wären sie eigenständige Produkte. Der Gesamtpreis ist die Summe beider Produkte, wobei die Zahlungsadministrationsgebühr, die Administrationsgebühr und die Rabattkampagne des Reifenvertrags nicht einfließen. Die Händlerprovision ist die Summe beider Händlerprovisionen, und der Händlerrabatt entspricht dem vom Händler angegebenen Wert in Bezug auf den Gesamtpreis.

Die an den Generierungsprozess übergebenen Daten (Payload) sind nach den Preisfaktoren klar und detailliert definiert. Die Reifenoption wird darin als "durch den Händler auswählbar" gekennzeichnet. Der Preis der Reifenoption wird erst aktualisiert, nachdem der Händler die Auswahl bestätigt hat.

Zur Überprüfung lassen sich der Servicevertrag und die Reifenoption mit ihren Preisen anhand des zugehörigen Diagramms einrichten und anschließend ein Vertrag generieren, um das Ergebnis zu validieren.