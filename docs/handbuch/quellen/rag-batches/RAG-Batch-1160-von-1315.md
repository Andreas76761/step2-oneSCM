# Batch 1160 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 31 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation: Service- und Reifen-Blueprints**

Im Bereich Contract Calculation können Service Contract Blueprints mit der Logik der Reifenoption (Tire Option) angelegt werden, auch für den Van. Beim Anlegen eines Tire Blueprints stehen neue Felder zur Verfügung, die entsprechend der Geschäftslogik funktionieren. Wird die Option „Tire Option“ auf „Yes“ gesetzt, lässt sich ein passender Coverage Code auswählen. Für Tire Blueprints gelten aktualisierte Coverage-Definitionsregeln. Bestehende Blueprints können bearbeitet, aktualisiert und gelöscht werden, solange der Blueprint-Typ nicht geändert wird. Auf der Ergebnisseite lässt sich die Blueprint-Liste nach Blueprint-Typ, Sales Dependency und Tire Option filtern. Voraussetzung ist, dass mehrere Blueprints mit unterschiedlichen Typen, Abhängigkeiten und Reifenoptionen vorhanden sind.

Bei kontingentbasierten Produkten (Tires and Contingent Products) wird die Kontingentnummer nur für Base Coverages von Stream 1 an Stream 2 übergeben, nicht für optionale Coverages oder Body-Coverages. Voraussetzung ist, dass kontingentbasierte Produkte verfügbar sind.

**Baumuster-Flow für den Van**

Der Baumuster-Flow (BM-Flow) wurde für den Van erweitert. Für ein gültiges Baumuster werden Motortyp (Engine Type) und Fahrzeuggruppe (Vehicle Group) ermittelt. Dies gilt für ein achtstelliges Baumuster sowie für ein sechsstelliges Baumuster mit einer Fahrzeuggruppe. Beide Angaben stehen außerdem im Bereich Product Testing zur Verfügung.

**Produkte für Leasing und Online-Vertrieb**

Die Antwort der Edge-Services für Leasingprodukte enthält nun die Währung. Sie wird je Produkt in den priceConfigurations der Endpunkte /product/v1/online-sales/searches und /product/v1/leasing/searches ausgegeben. Voraussetzung ist, dass Produkte mit gültigen Preisen vorhanden sind.

**Vega Codes und Benennung**

Die Bezeichnung „Tire option“ wurde durch „Tire product reference“ ersetzt. Das betrifft die Coverages unter Product Management, sowohl in Manage Product & Prices als auch in Manage Product Blueprints beim Anlegen eines Blueprints. Im Admin-Bereich unter VEGA Codes und Coverage Codes gilt die neue Bezeichnung ebenfalls, sowohl in der Coverage Category bei der Suche nach einem Coverage Code als auch beim Anlegen eines Coverage Codes. Die Sucheingabe im Coverages-Tab der VEGA Codes im Admin-Bereich ist auf maximal vier Zeichen begrenzt.

**Branchenauswahl**

Wird eine Branche ausgewählt, werden ausschließlich die Produkte zurückgegeben, die dieser Branche zugeordnet sind. Diese Produkte enthalten die branchenspezifische Preisgestaltung, alle nicht passenden Produkte werden ausgeschlossen. Die Filterung nach Branche erfolgt streng. Gibt es zur gewählten Branche keine passenden Produkte, werden alle infrage kommenden Produkte angezeigt, als wäre keine Branche gewählt worden. Dabei erscheint die Meldung „No Industry was selected / Not relevant“, und es gilt die Standardpreisgestaltung ohne Branchenbezug. So sieht die Benutzerin oder der Benutzer auch dann Produkte, wenn die gewählte Branche keine Treffer hat.

**Technische Optionen und Reifenprodukte**

Bei der Konfiguration eines Reifenprodukts und seiner Preise kann eine definierte technische Option „Wheel Size“ ausgewählt und verwendet werden. Technische Optionen mit dem Gruppentyp Wheel Size lassen sich anlegen und erscheinen anschließend in der Übersichtstabelle. Bei einer bestehenden technischen Option dieses Gruppentyps können nur die Beschreibung, die Matching-Logik und die Equipment Codes bearbeitet werden. Wird eine technische Option gelöscht, etwa 225/55 R17, wird sie nicht mehr in der Übersichtstabelle angezeigt. Beim Anlegen werden zudem ein bereits vorhandener Name sowie ungültige Zeichen im Gruppennamen geprüft.

**Allgemeine Geschäftsbedingungen**

Ist für ein Produkt bereits eine Fassung der Allgemeinen Geschäftsbedingungen (T&C) definiert, müssen die T&C für alle Marktsprachen hinterlegt werden.