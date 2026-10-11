# Batch 1182 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Einheitliche Definition von Preiskomponenten**

Der Preis eines Produkts setzt sich aus einem Grundpreis und verschiedenen zusätzlichen Preiskomponenten zusammen. Dazu gehören Produktoptionen, technische Optionen, Branchenfaktoren, Händlerprovision, Verwaltungsgebühren und Aufschläge. Jede dieser Komponenten lässt sich entweder als eigenständiger Betrag oder in Abhängigkeit von Laufzeit und Laufleistung des Vertrags definieren. Möglich sind ein Gesamtwert, ein Prozentsatz des Grundpreises, ein Betrag pro Jahr oder pro Monat oder auch keine konkrete Preisangabe.

Bisher unterschieden sich die Auswahlmöglichkeiten je nach Komponente. Nun stehen überall dort, wo eine Kostendefinition und eine Kostenabhängigkeit erforderlich sind, dieselben Dropdown-Inhalte zur Verfügung. Die neue Kostenabhängigkeit unterscheidet vier Varianten. „Keine Abhängigkeit“ erfordert einen einzelnen Wert. „Laufzeitabhängig“ und „Laufleistungsabhängig“ erfordern jeweils eine Liste von Werten. „Laufzeit- und laufleistungsabhängig“ erfordert eine Wertematrix. Die bisherige Option „Duration Mileage Independent“ wurde durch „Keine Abhängigkeit“ ersetzt. Die neue Liste der Kostendefinitionen gilt für Produktoptionen (optionale Deckungen), Karosserie- bzw. Aufbaudeckungen, technische Optionen und Branchenfaktoren.

Die neuen Optionen sind an folgenden Stellen sichtbar. In „Upsert Price Version“ finden Sie sie im Schritt „Price Version Setup“ für die Preise optionaler Deckungen und technischer Reifenoptionen sowie im Schritt „Industry Surcharges“ für die Preise der Branchencodes. In „Upsert Cluster“ stehen sie im Reiter „Technical Options“ für die Preise allgemeiner technischer Optionen zur Verfügung.

Bei Produkten, deren Basispreistabelle nicht in Währungswerten, sondern in Kontingenten oder Reifenanzahlen geführt wird, etwa beim Reifenprodukt, steht die Kostendefinition „Prozent“ nicht zur Verfügung. Das gilt für alle Komponenten, bei denen ein Preis zu definieren ist. Bei Kontingentprodukten entspricht jede Kombination aus Kostendefinition und Kostenabhängigkeit demselben Aufbau der Preismatrix wie bei Zeit- oder Laufleistungsprodukten. Die Spalte „Alle Laufleistungen/Jahreslaufleistung“ wurde dabei durch die Spalte „Kontingente“ ersetzt. Die spezielle Kostenabhängigkeit „Duration Contingent Independent“, die zuvor für Branchenzuschläge verwendet wurde, entfällt.

Im Schritt „Industry Surcharges“ von „Upsert Price Version“ erscheint nun aus Konsistenzgründen ein zusätzlicher Dialog, der dem im Bereich der allgemeinen technischen Optionen von „Upsert Cluster“ entspricht. Er weist darauf hin, dass beim Ändern der Kostendefinition oder der Kostenabhängigkeit die erfassten Matrixwerte verloren gehen. Wurde eine technische Reifenoption mit der Kostendefinition „Keine Kosten“ konfiguriert, wird sie im Dialog zum Hinzufügen von Gruppen technischer Optionen nicht als auswählbare Option angezeigt. Die Aktionen „Bearbeiten“ und „Duplizieren“ für Preisversionen und Cluster funktionieren unverändert.

Bei der Vertragserstellung werden die Preise für jede verfügbare Kombination aus Kostendefinition und Kostenabhängigkeit korrekt berechnet. Das betrifft Branchencodes, technische Optionen und Deckungen, einschließlich Reifen- und Kontingentprodukten. Bei der Vertragsverlängerung gilt dies für optionale Deckungen, bei kurzfristigen Verlängerungen auch für Reifenprodukte.

**Zwei Bestellnummern für dieselbe FIN/VIN**

Es kann vorkommen, dass einer Fahrzeugidentifikationsnummer (FIN/VIN) zunächst in VeDoc eine Bestellnummer zugewiesen wird, die sich nach einiger Zeit ändert. Das System speichert in diesem Fall sowohl die alte als auch die aktualisierte Bestellnummer. Der Vertrag wird über diese Änderung nicht informiert. Bis diese Behandlung umgesetzt ist, wird das bestehende Problem übergangsweise dadurch behoben, dass die alte Bestellnummer aus der Datenbank gelöscht wird.

**Bereitstellung aller Preiskomponenten für die Vertragserzeugung**

Händler sollen alle Preiskomponenten einsehen können, damit sie nachvollziehen, woraus sich der Preis zusammensetzt, und Kunden entsprechend informieren können. Dazu wird an die Vertragserzeugung ein Datenpaket (Payload) mit einem klar definierten Feld für die Preiskomponenten übermittelt. Der Betrag jeder Preiskomponente wird angegeben, und das Datenpaket enthält alle Preiskomponenten. Es wird jedes Mal angepasst, wenn eine neue Preiskomponente oder ein preisrelevanter Faktor zum Produkt hinzukommt.

Enthalten sind der Grundpreis, die Optionspreise, technische Optionen, die Verkaufsprovision, die Gebühr für das Zahlungsintervall, der Rabatt nach Kampagnentyp und der Händlerrabatt. Der Branchenfaktor und die Verwaltungsgebühr sind noch nicht umgesetzt. Der Inflationsfaktor ist noch nicht definiert.