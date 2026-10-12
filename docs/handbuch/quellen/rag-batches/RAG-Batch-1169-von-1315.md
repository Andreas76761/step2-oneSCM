# Batch 1169 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Service-Contract-Produkt mit Reifenoption (Van Unlimited)**

Für Van-Unlimited-Verträge lässt sich ein Reifenprodukt künftig entweder eigenständig oder als Option an ein bestehendes Service-Contract-Produkt anhängen. Bisher war es bei einem Service-Contract-Produkt nicht möglich, ein weiteres Produkt hinzuzufügen. Nun können Sie ein Service-Contract-Produkt anlegen, das ein Reifenprodukt als Option unterstützt. Die Kalkulation berücksichtigt dabei die komplexe Option, sodass das Produkt für den Verkauf bereitgestellt werden kann.

Voraussetzung ist, dass ein Blueprint vom Typ Service Contract existiert, bei dem die Reifenoption auf „Ja" gesetzt ist. Außerdem muss ein Reifenprodukt angelegt sein, dessen Sales Dependency auch als Produktoption definiert ist (es kann sowohl als Option als auch als Standalone verfügbar sein). Zudem müssen Vega-Codes mit Reifenoption angelegt sein.

Die Anlage des Produkts erfolgt wie gewohnt: Sie wählen Division und Blueprint, füllen die Basisproduktinformationen sowie die Sales- und Vertragskonfiguration aus. Wählen Sie einen Blueprint mit „Tire Option: YES", wird diese Eigenschaft in der Vorschau der Blueprint-Attribute angezeigt.

Bei der Konfiguration der Coverages sehen Sie zunächst die Coverages aus dem Blueprint. Über „Edit Coverage" öffnet sich ein Modal, das neben den Standard-Coverages auch die Coverages der neuen Kategorie „Tire Product Reference" auflistet; hier können mehrere Einträge vorhanden sein. Für diese Reifenoptionen ist der Standardzustand „Nicht enthalten". Sie können nicht als „Always Included" gewählt werden, sondern nur als „Optional" ausgewählt werden oder „Nicht enthalten" bzw. ausgeschlossen bleiben.

Haben Sie eine Reifenoption als „Optional" gewählt, erscheint für diese Option die Schaltfläche „Configure". Sie öffnet ein neues Modal mit zwei Auswahlfeldern. Das erste ist ein Dropdown mit allen Reifenprodukten, deren Sales Dependency die Produktoption einschließt. Das zweite ist eine Mehrfachauswahl für den Kundentyp. Damit legen Sie fest, welche Kundentypen diese Reifenoption im Zusammenhang mit dem Service-Contract-Produkt nicht erwerben dürfen. Zur Auswahl stehen Private, Commercial, Commercial Fleet, Private Governmental und Commercial Governmental. Ein Info-Tooltip („Select Excluding Customers") erläutert die Auswahl. Beide Felder sind standardmäßig nicht ausgewählt. Die Auswahl eines Reifenprodukts ist verpflichtend, damit die Konfiguration gespeichert werden kann.

Die weiteren Schritte verlaufen wie bisher. In der Produktübersicht werden anschließend die neuen Attribute angezeigt. Als letzte Spalte erscheint dort der Kundentyp, also die ausgeschlossenen Kundentypen, analog zur Darstellung auf Sales-Ebene in Schritt 4.

Die Anlage der Preisversion für das Service-Contract-Produkt bleibt unverändert. Beim Erstellen des Preises und beim Definieren des Clusters weist ein Banner darauf hin, dass das Produkt auch eine Reifenoption enthält.