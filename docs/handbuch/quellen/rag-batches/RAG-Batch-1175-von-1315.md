# Batch 1175 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertriebskanäle bei der Händlerprovision in der Preisversion**

Bei der Definition oder Bearbeitung einer Preisversion steht im Bereich „Dealer Commission“ eine Liste der verfügbaren Vertriebskanäle zur Verfügung. Das Feld „Vertriebskanal“ wird nur angezeigt, wenn der Schalter für die Händlerprovision aktiviert ist, und es ist ein Pflichtfeld: Mindestens ein Vertriebskanal muss ausgewählt sein. Die Händlerprovision ist die Provision, die Mercedes-Benz an den Händler zahlt, wenn dieser den Vertrag verkauft. Standardmäßig sind alle Vertriebskanäle ausgewählt. Bleiben alle in diesem Zustand, wird die Provision auf Basis aller Kanäle berechnet und angewendet. Wählen Sie einzelne Vertriebskanäle gezielt aus oder ab, wird die Provision nur für die ausgewählten Kanäle berechnet. Für einen nicht ausgewählten Kanal wird sie nicht angewendet. Die Auswahl wird als Bestandteil der Preisversion gespeichert. Die Vertriebskanäle der Preisversion sind unabhängig von den Vertriebskanälen, die auf Produktebene ausgewählt wurden. Sie stehen also in keinem Zusammenhang mit der Produktauswahl.

**Erweiterung des Baumuster-Ablaufs für Vans**

Der Baumuster-Ablauf wird ausschließlich für die Van-Sparte erweitert. Für Vans dürfen Anwender ein Baumuster mit 6 bis 8 Stellen eingeben. Damit Händler und Kunden fundierte Entscheidungen treffen können, stellt das System dem Generierungsprozess Daten zur Verfügung: die Liste der Motorisierungsarten zum Baumuster sowie die Liste der Fahrzeuggruppen-Namen samt Preisen. Die Motorisierungsart wird dabei mit D für Diesel, E für Elektro und B für Benzin angegeben. Die Fahrzeuggruppen-Bezeichnungen sind definiert. Motorisierungsart und Fahrzeuggruppen-Namen werden zusätzlich im Produkttestbereich angezeigt.

**Vertriebsebene bei Kampagnen**

Im Kampagnenmanagement gibt es im Abschnitt „Select the Sales Levels where this campaign can be applied“ das Pflichtfeld „Sales Level“. Es ist als Mehrfachauswahl mit Kontrollkästchen gestaltet. Zur Auswahl stehen „Direct-to-Customer“, „Dealerships“ und „MPCs/MOCs“. Sie können eine oder mehrere Vertriebsebenen auswählen und eine Auswahl durch Entfernen des Häkchens wieder aufheben. Die Berechnung und die Anwendbarkeit der Kampagne richten sich nach der gewählten Vertriebsebene.

**Berücksichtigung in der Berechnung der Vertriebsprovision**

In die Berechnung der Vertriebsprovision fließen die Preise der technischen Optionen und der Industriefaktor ein. Die Provision wird zum Fahrzeuggesamtpreis addiert und ist damit im Kundenpreis enthalten. Der Händler erhält die Provision ausgezahlt. Sie beträgt 2 % des Grundpreises (zuzüglich relevanter Optionen), höchstens jedoch 30 EUR. Eine Überschreitung dieser Obergrenze, etwa um 8 EUR, gibt es in der Berechnung nicht.

Ein Rechenbeispiel: Der Fahrzeuggesamtpreis von 1.900 EUR plus 30 EUR Provision ergibt bei angenommenen 0 EUR Verwaltungsgebühr und 0 EUR zahlungsabhängiger Gebühr einen Marktlistenpreis von 1.930 EUR. Ohne Inflationsaufschlag, Kampagne und Händlerrabatt entspricht das dem Kundennettopreis von 1.930 EUR. Mit 19 % Mehrwertsteuer ergibt sich ein Kundenbruttopreis von 2.296,70 EUR.

Ein Beispiel für den Ablauf aus Anwendersicht: Ohne ausgewählte Option werden 1.000 EUR Grundpreis, 100 EUR Industriefaktor und 22 EUR Provision angezeigt, zusammen 1.122 EUR. Mit Option O001 (200 EUR) ergeben sich 1.000 EUR Grundpreis, 200 EUR Option, 100 EUR Industriefaktor und 26 EUR Provision, zusammen 1.326 EUR. Kommt zusätzlich Option O002 (600 EUR) hinzu, ergeben sich 1.000 EUR Grundpreis, 200 EUR und 600 EUR für die Optionen, 100 EUR Industriefaktor und 30 EUR Provision, zusammen 1.930 EUR.