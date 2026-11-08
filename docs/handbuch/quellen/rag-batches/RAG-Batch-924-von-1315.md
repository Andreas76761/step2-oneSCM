# Batch 924 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reifenprodukte: einheitliche Erfassung und Darstellung der Reifeninformationen**

Die Erfassung, Anzeige und Speicherung von Reifeninformationen wurde in der Anwendung vereinheitlicht, damit die Daten durchgängig konsistent, nachvollziehbar und benutzerfreundlich sind. Die Neuerung gilt für drei Produktvarianten: das eigenständige Produkt „Tire Product Limited", das eigenständige Produkt „Tire Product Unlimited" sowie komplexe Produkte, bei denen eine Reifenoption zu einem anderen Produkt hinzugefügt wird.

**Produktkonfiguration**

Bei der Anlage eines Vertrags mit dem eigenständigen Produkt „Tire Product Limited" erfasst das System Vertragslaufzeit, jährliche Fahrleistung, Zahlungsintervall, Wetterprofil, Reifentyp, Reifengröße und Anzahl der Reifen. Beim eigenständigen Produkt „Tire Product Unlimited" werden Vertragslaufzeit, jährliche Fahrleistung, Zahlungsintervall, Wetterprofil, Stahlfelge, Radgröße und Reifenlieferant erfasst.

Bei komplexen Produkten mit Reifenoption werden für das Basisprodukt Vertragslaufzeit, jährliche Fahrleistung und Zahlungsintervall erfasst. Hinzu kommen die Angaben der gewählten Reifenoption. Bei der Variante „Tire Option Limited" sind das Wetterprofil, Reifentyp, Reifengröße und Anzahl der Reifen. Bei der Variante „Tire Option Unlimited" sind es Wetterprofil, Stahlfelge, Radgröße und Reifenlieferant.

**Übersicht und Bestätigung**

Hat der Vertrag den Status „Created", zeigt die Übersicht und Bestätigung für alle drei Produktvarianten ein einheitliches Bild. Das bisher unter dem Produktnamen angezeigte Feld „Technical Specification" entfällt. Der Bereich „Product Option" enthält den Produktnamen (bei komplexen Produkten den Namen des Hauptprodukts), den Zeitraum (Vertragsbeginn bis Vertragsende), die jährliche Fahrleistung, die Zahlungsoption und den Vertragsbeginn.

Zusätzlich gibt es einen neuen Abschnitt „Tire Product Specifications". Er enthält folgende Felder: Produktname, externer Reifenlieferant, Wetterprofil, Felgen inklusive, Radgröße, Reifengröße, Reifentyp, technische Optionen und Anzahl der inkludierten Reifen. Der Produktname wird immer angezeigt. Bei allen übrigen Feldern erscheint der erfasste Wert, andernfalls ein Bindestrich („-"). Bei komplexen Produkten wird bei der Anzahl der inkludierten Reifen entweder der erfasste Wert oder „Unlimited" angezeigt. Als Beispielwerte nennen die Vorgaben unter anderem „Summer", „Summer/Winter" und „All Seasons" beim Wetterprofil, „Continental" als Lieferant, „Included" bei den Felgen, „195/65 R15" als Radgröße sowie „Double Axle" bei den technischen Optionen. Bei „Tire Product Limited" nennen sie zudem beispielhaft die Reifengröße 17, den Reifentyp „MO" und vier inkludierte Reifen. Bei „Tire Product Unlimited" lautet der Beispielwert für die Anzahl der Reifen „Unlimited".

**Vertragsdetailansicht**

Im Reiter „Contract" erscheint unter „Contract Details" ein neuer Abschnitt „Tire Details". Er enthält dieselben Felder wie der Abschnitt „Tire Product Specifications" in der Übersicht: Produktname, externer Reifenlieferant, Wetterprofil, Felgen inklusive, Radgröße, Reifengröße, Reifentyp, technische Optionen und Anzahl der inkludierten Reifen. Auch hier wird der Produktname immer angezeigt, die übrigen Felder zeigen den erfassten Wert oder einen Bindestrich. Bei komplexen Produkten wird bei der Anzahl der inkludierten Reifen der erfasste Wert oder „Unlimited" angezeigt.

Zusätzlich gibt es das Feld „Claimed Tires" (beanspruchte Reifen). Es steht standardmäßig auf „0" und wird automatisch angepasst, sobald ein Schadenfall über die Schnittstelle i156 importiert wird. Dies gilt für alle Reifenprodukte, also für „Limited", „Unlimited" und komplexe Produkte mit Reifenoption. Der aktualisierte Wert ist anschließend im Abschnitt „Tire Details" unter „Contract Details" sichtbar.