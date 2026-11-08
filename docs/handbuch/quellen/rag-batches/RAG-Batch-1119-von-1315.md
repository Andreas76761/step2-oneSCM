# Batch 1119 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reifenprodukt (Limited/Unlimited und als Produktoption)**

Das Reifenprodukt lässt sich in oneSCM künftig vollständig abbilden. Es kann als eigenständiges Produkt verkauft oder als Produktoption an einen Hauptservicevertrag (komplexes Produkt) angehängt werden. Bisher konnte nur ein unbegrenztes Reifenprodukt konfiguriert werden. Nun stehen bei der Konfiguration sowohl die Variante „Unlimited" als auch die Variante „Limited (contingent)" zur Verfügung. Bei „Limited" legt der MPC eine bestimmte Anzahl abgedeckter Reifen fest. Diese Anzahl ist für Händler bei der Vertragskonfiguration sichtbar und fließt in die Preisberechnung ein. In einem komplexen Produkt können eine Option mit unbegrenzten und eine Option mit begrenzten Reifen gemeinsam enthalten sein; die Daten werden vollständig an die Vertragsgenerierung übergeben. Auch eine Prolongation ist möglich.

**Sichtbarkeit von Feldern in „Sales and Contract Configuration"**

Um die Konfiguration übersichtlicher zu machen, werden Felder ausgeblendet, die im jeweiligen Kontext keine Wirkung haben. Ist die Sales Dependency ausschließlich „Product Option", werden in Schritt 3 die Felder „Expiry Criteria" und „Sales Priority" nicht mehr angezeigt, da sie in diesem Fall nie einen Wert haben. Sie werden vom Hauptprodukt bestimmt und nicht von der Reifenoption. Ebenso entfällt in der Price Version das Zahlungsfeld, weil die Zahlungsart vom Hauptprodukt vorgegeben wird. Ist die Sales Dependency sowohl „Product Option" als auch „Standalone Product", erhalten die Felder „Sales Logic", „Allowed Contract Modifications", „Expiry Criteria" und „Sales Priority" einen Info-Tooltip. Dieser weist darauf hin, dass sie nur beim Verkauf als eigenständiges Produkt gelten. Allgemein gilt: Felder ohne Wirkung oder ohne Wert im jeweiligen Kontext werden entfernt bzw. ausgeblendet, statt leer oder deaktiviert angezeigt zu werden. Das betrifft die Konfigurationsseiten für Sales and Contract Configuration, Post-/Pre-Activation und Reifenoptionen. Außerdem entfällt das Feld „External Supplier", da es das Feld „Tire Supplier" auf Ebene der Technical Option doppelt.

**Coverages und Lieferantenzuordnung**

Ein Reifenprodukt muss künftig mindestens eine optionale Coverage enthalten, die als „Included" gesetzt ist. Andernfalls wird der Nutzer am Fortfahren gehindert, denn ohne Coverage erhält die Vertragsgenerierung keinen Preis. Wird als Cost Unit „Supplier" gewählt, ermittelt das System über BS4, welche Lieferanten für die jeweilige Coverage gültig sind. Ist einer Coverage bereits ein Lieferant zugeordnet, kann weiterhin die Cost Unit „MB" gewählt werden. Wird die Coverage als Reifenoption bearbeitet, entfällt die Auswahl eines Lieferanten, da das Produkt bereits veröffentlicht und je Cost Unit konfiguriert ist.

**Wetterprofil-Empfehlung und Preismatrix**

Bei begrenzten Reifenprodukten kann der MPC in der Price Version je Cost Unit eine Wetterprofil-Empfehlung auswählen. Daraufhin wird eine neue Preismatrix (Laufleistung × Laufzeit) geladen, die befüllt werden kann. Alle in der Reifenkomponente vorhandenen Wetterprofile stehen zur Auswahl. Mindestens eine Wetterprofil-Matrix muss vollständig ausgefüllt sein, die übrigen sind optional. Die Empfehlung wird an die Vertragsgenerierung übergeben und dort dem Händler angezeigt.

**Reifen-Matching-Logik**

Bei der Definition der Preismatrix an der Reifenkomponente muss der MPC genau eine Matching-Logik auswählen (Pflichtfeld, Einfachauswahl): „Match with SA Codes", „Compatible with Baumuster code" (ggf. mehrere Baumuster) oder „All available tires". Bei der Vertragsgenerierung werden dem Händler nur die Reifen angeboten, die dieser Logik und den Fahrzeugdaten entsprechen. Dies hat Auswirkungen auf die Kommunikation mit Brabus und auf die Generierung.

**Anzeige in der Vertragsgenerierung und Terms & Conditions**

In der Vertragsgenerierung sieht der Händler für eine Reifen-Technical-Option den zugewiesenen Produktnamen (Tire Description) statt des internen Namens der Technical Option. In der Auswahl der Reifenoptionen werden die konfigurierten Produktnamen angezeigt und keine internen VEGA-Referenzcodes. Enthält ein komplexes Produkt eine Reifenoption, werden dem Kunden bei der Vertragserstellung sowohl die Terms & Conditions des Hauptprodukts als auch die der Reifenoption präsentiert. Ein komplexes Produkt muss stets beide enthalten.