# Batch 1150 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Verlängerung von Reifenverträgen (Prolongation)**

Verträge mit dem Produkt Reifen können künftig verlängert werden. Die Funktion richtet sich an Mitarbeitende im Vertragsmanagement (MO/MPC), die einen Reifenvertrag verlängern, sowohl im Leasing als auch über den Edge Service. Sie erhalten dabei die Preise und die Konfiguration, die für die Verlängerung nötig sind, sodass der Kunde seine Präferenzen auswählen kann.

**Voraussetzungen in der Produktverwaltung**

Damit ein Reifenprodukt verlängert werden kann, muss in der Produktverwaltung das Feld „Select Allowed Contract Modifications“ gesetzt werden. Dieses Feld ist für das Reifenprodukt neu in der Oberfläche vorhanden und funktioniert wie bei den übrigen Produkten. Durch die Einstellung wird festgelegt, dass das Vertragsmanagement das Reifenprodukt verlängern darf. Die Felder „Allowed Modifications“ und „Long Term“ werden nur angezeigt, wenn der Service-Contract-Blueprint und der Blueprint „Tire Limited Passenger Car“ mit der Sales Dependency „Standalone Product“ verwendet werden. Handelt es sich ausschließlich um eine PRODUCT_OPTION, erscheint dieser Block nicht.

**Ablauf der Verlängerung**

Wählt das Vertragsmanagement im Vertrag die Schaltfläche „Prolongate“, bietet das System immer beide Optionen an: die Kurzzeitverlängerung (Short-Term Extension, STE) und die Langzeitverlängerung (Long-Term Extension, LT).

Bei der Kurzzeitverlängerung wird dem Benutzer der berechnete Monatspreis angezeigt. Das gilt unabhängig vom ursprünglichen Zahlungsintervall des Vertrags (jährlich, halbjährlich oder vierteljährlich). Der Grund dafür ist, dass die Kurzzeitverlängerung monatlich erfolgt, das Zahlungsintervall aber abweichen kann.

Bei der Langzeitverlängerung stellt die Produktdomäne drei Auswahlfelder bereit: den Preis, die Kombination aus Laufzeit und Laufleistung sowie die Anzahl der Reifen samt Empfehlung. Der Preis richtet sich danach, wie das Produkt unter „Allowed Contract Modifications“ konfiguriert ist. Die Anzahl der Reifen wird mit der Empfehlung aus der Matrix vorbelegt, die von der Vertragskalkulation (Contract Calculation) in der Antwort für Laufzeit und Laufleistung geliefert wird. Die Anzahl ist ein Vielfaches von 2 (2, 4, 6, 8 usw.), vorbelegt ist beispielsweise 4. Dazu erscheint der Hinweis „We recommend x tires“, wobei x der empfohlenen Reifenanzahl entspricht. Die getroffene Auswahl wird an den Vertrag übermittelt.

**Berechnung des Verlängerungspreises**

Das System berechnet und zeigt den Verlängerungspreis auf Basis der unter „Allowed Contract Modifications“ gewählten Produktkonfiguration an. Je nach Einstellung kommt eine von zwei Formeln zum Einsatz.

Bei „Pricing at Prolongation Time“ wird der neue Matrixwert multipliziert mit dem TO-Preis genommen. Dazu werden die monatliche Zahlungsgebühr multipliziert mit den verbleibenden Raten und die monatliche Verwaltungsgebühr multipliziert mit den verbleibenden Raten addiert. Davon wird der bisher gezahlte Netto-Gesamtbetrag des Vertrags abgezogen. Das Ergebnis wird durch die Anzahl der verbleibenden Monate geteilt.

Bei „Pricing at Contract Sales Date“ wird dieselbe Berechnung mit den alten Werten durchgeführt, also mit dem alten Matrixwert, dem alten TO-Preis, der alten monatlichen Zahlungsgebühr und der alten monatlichen Verwaltungsgebühr.

**Hinweis**

Die Reifenmatrix enthält die Anzahl der Reifen und keinen Preispunkt. Dies ist bei der Nutzung der Preisangaben zu beachten.