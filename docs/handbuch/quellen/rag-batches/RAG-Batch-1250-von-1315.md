# Batch 1250 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kampagnenverwaltung**

Die „External Campaign ID" einer Kampagne ist künftig ein Pflichtfeld. Sie darf maximal 10 alphanumerische Zeichen umfassen, Sonderzeichen sind erlaubt. Hintergrund ist der Kampagnenexport an oneERP, der auf 50 Zeichen begrenzt ist. Da der Kampagnenname in der Kampagnenverwaltung länger sein darf, wird beim Export statt des Kampagnennamens die External Campaign ID verwendet.

Auch die Eindeutigkeitslogik wurde erweitert. Eine bestimmte External Campaign ID darf nun für dieselbe Fahrzeuggruppe nur bei einer Kampagne gleichzeitig vergeben sein. Kampagnen, die sich zeitlich oder in der Fahrzeuggruppe nicht überschneiden, können dieselbe External Campaign ID verwenden. Dadurch kann der Markt Deutschland Kampagnen flexibler definieren, insbesondere im Hinblick auf die Aktions-IDs für Verkaufssubventionen.

Auf der Kampagnenübersicht werden standardmäßig nur Kampagnen im Status „Upcoming" und „Active" angezeigt. Kampagnen im Status „Finished" und „Deactivated" lassen sich weiterhin anzeigen, indem sie gezielt über den Statusfilter ausgewählt werden. Dieses Vorgehen entspricht der Produktübersicht, auf der Produkte im Status „deleted" ebenfalls nur auf ausdrückliche Filterung hin erscheinen.

Im Kampagnenerstellungsprozess sind außerdem auf der Seite für rabattierte Produkte und Fahrzeuge die Kontrollkästchen zur Auswahl von Produkten und Clustern nun auswählbar. Das ist eine Verbesserung für Kampagnen mit Listenpreis (Sticker Price).

**Fahrzeuggruppen**

In der Verwaltung der Fahrzeuggruppen wird bei jeder Preisversion in der Auswahlliste der Status in Klammern angezeigt (Expired, Current oder Upcoming). Beim Anlegen einer Fahrzeuggruppe wird im ersten Schritt des Ablaufs ebenfalls der Status der jeweiligen Preisversion angezeigt (Current oder Upcoming). Die Änderung gilt gleichermaßen für Pkw und Transporter (Vans).

**Zahlungsintervalle**

Für den Zahlungszeitraum standen in der Oberfläche bisher nur „Monthly" und „One-time" zur Verfügung. Künftig lassen sich die Zahlungsintervalle monatlich, vierteljährlich, halbjährlich, jährlich und einmalig festlegen. Die Auswahl der Intervalle erfolgt in der Produktdefinition in Schritt 3. Bei der Einrichtung der Preisversion stehen in Schritt 2 dieselben Intervalle zur Verfügung, die am Produkt definiert wurden, sodass entsprechende Raten hinterlegt werden können. Die optionalen Felder bleiben unverändert. Beachten Sie, dass einige Textbezeichnungen angepasst wurden.

**Reifenprodukt**

Beim Reifenprodukt im Baumuster-Flow wurde die Logik für die Reifengrößen angepasst. Wird für das Produkt eine Preisermittlung (Pricing) durchgeführt, gilt für die Matching-Logik „none must match" im Baumuster-Fall: Diese Einstellung muss sichtbar sein und an die Generierung übermittelt werden, unabhängig von der Matching-Regel aus dem TO und den Bm6-SA-Codes.

Zudem wurde die Interpolationslogik, die für die Kompatibilität mit dem Leasingkanal die Preistabellen von der jährlichen Laufleistung auf die Gesamtlaufleistung erweitert, nun auch auf das kontingentbasierte Reifenprodukt angewendet.

Bei der Basispreistabelle, die für das empfohlene Reifenkontingent je Kombination aus Laufleistung und Laufzeit verwendet wird, gelten folgende Regeln: Für die Randfelder der Tabelle, die nicht zwischen zwei Preispunkten liegen, wird kein Wert berechnet. Wird ein solcher Preispunkt über die getProducts-API abgefragt, wird eine Fehlermeldung zurückgegeben. Dies entspricht der allgemeinen Interpolationslogik. Interpolierte Werte werden gerundet, damit keine ungeraden oder dezimalen Reifenzahlen wie 7, 9, 6,5 oder 6,67 entstehen. Sie werden dem nächstliegenden der beiden umgebenden Preispunkte zugeordnet, bei genau mittiger Lage dem höheren. Beispiele bei 48 Monaten: Bei 65.000 Gesamtlaufleistung ergibt die Interpolation 9, was zu 8 gerundet wird. Bei 70.000 ergibt sie 10, was genau zwischen 8 und 12 liegt und daher zu 12 gerundet wird. Bei 75.000 ergibt sie 11, was zu 12 gerundet wird.

Die übrigen Preistabellen des Reifenprodukts, also optionale Deckungen einschließlich 100-%-Optionen sowie technische Optionen, werden abhängig von ihrer Kostenabhängigkeit interpoliert. Bei „No Dependency", „Duration Dependent" und „Mileage Dependent" erfolgt keine Interpolation. Bei „Duration Mileage Dependent" kommt die reguläre Interpolation zum Einsatz.