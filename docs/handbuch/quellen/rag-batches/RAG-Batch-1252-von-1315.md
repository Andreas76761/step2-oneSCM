# Batch 1252 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Neuerungen und Änderungen**

**Produktpreise und Schnittstellen für den Leasingkanal**

Die Preistabellen in oneSCM werden für die Kompatibilität mit dem Leasingkanal von der jährlichen Fahrleistung auf die Gesamtfahrleistung erweitert. Die dafür erforderliche Interpolationslogik gilt nun auch für das kontingentbasierte Reifenprodukt. Bei dessen Basispreistabelle, die das empfohlene Reifenkontingent je Kombination aus Laufleistung und Laufzeit abbildet, werden Randwerte nicht berechnet, da sie nicht zwischen zwei Preispunkten liegen. Wird ein solcher Wert über die getProducts-Schnittstelle angefragt, erscheint eine Fehlermeldung. Interpolierte Werte werden auf einen der beiden umgebenden Preispunkte gerundet, damit keine ungeraden oder dezimalen Reifenanzahlen entstehen. Liegt ein Wert näher an einem Preispunkt, wird auf diesen gerundet. Liegt er genau in der Mitte, wird aufgerundet. Beispielsweise ergibt sich bei 48 Monaten und 65.000 km Gesamtfahrleistung der Wert 8, bei 70.000 km sowie bei 75.000 km jeweils der Wert 12. Die übrigen Preistabellen des Reifenprodukts, also optionale Deckungen einschließlich 100-%-Optionen sowie technische Optionen, werden abhängig von ihrer Kostenabhängigkeit behandelt. Nur bei der Abhängigkeit „Duration Mileage Dependent“ wird regulär interpoliert. Bei „No Dependency“, „Duration Dependent“ und „Mileage Dependent“ erfolgt keine Interpolation.

Für Preispunkte im Leasing gilt außerdem: Wird ein Preispunkt direkt getroffen, verändert sich sein Wert nicht und es erfolgt keine Berechnung. Interpoliert werden nur Zwischenwerte.

Die Edge-Service-Schnittstellen für Leasing und Online-Vertrieb liefern zusätzlich die Währung. Sie wird als dreistelliger ISO-Code (zum Beispiel EUR) einmal pro Produkt im Knoten priceConfigurations ausgegeben, analog zum Attribut „vat“.

Zudem wird der Umgang mit Kampagnen angepasst. Übermittelt das anfragende System eine Kampagnenkennung im Attribut extCampaignIds, wird diese mit allen für die Produkte gültigen aktiven Kampagnen verglichen. Wird eine passende Kampagne gefunden, wird sie auf die zurückgegebenen Preise angewendet und erscheint in der Liste der Preiskomponenten. Wird keine passende Kampagne gefunden, wird der Standardpreis ohne Preisreduzierung zurückgegeben, und das Attribut „summary“ enthält den Text „No matching price reduction found“.

Bei der Ausgabe von Produkten nach Branche gilt folgende Regel: Passt die gewählte Branche zu einem Produkt, wird das Produkt mit den entsprechenden Preisen zurückgegeben. Passt sie nicht, werden die Produkte so zurückgegeben, als wäre keine Branche gewählt worden. In diesem Fall enthält die Antwort die Meldung „No Industry was selected / Not relevant“, die darauf hinweist, dass die gewählte Branche auf keines der verfügbaren Produkte zutrifft.

**Vertragsberechnung und Produktanlage**

Für ein deaktiviertes Produkt, das nicht veröffentlicht, aber für Verlängerungen zugelassen ist, wird bei der langfristigen Verlängerung künftig die jeweils neueste Preisversion berücksichtigt, also die Preise zum Verlängerungszeitpunkt. In Schritt 3 („Sales and Contract Configurations“) des Produktanlageprozesses heißt die Bezeichnung „Prices at Contract Signing“ jetzt „Pricing at Contract Sales Date“. In der Auswahlliste der Produktlaufzeiten steht zusätzlich der Schritt 24 zur Verfügung. Alle weiteren Elemente, darunter die Matrix-Vorschau und der Preis, wurden an diesen neuen Schritt angepasst.

**Allgemeine Bedienung, Verwaltung und Texte**

In Texteingabefeldern, die nur eine Zeile erlauben, werden führende und nachfolgende Leerzeichen automatisch entfernt, sobald der Benutzer das Feld verlässt. Mehrere aufeinanderfolgende Leerzeichen zwischen Wörtern werden zu einem einzigen zusammengefasst. Dies gilt beispielsweise für den Versionsnamen bei der Erstellung einer Preisversion. Mehrzeilige Textfelder sind davon ausgenommen.

Im Admin-Menü unter „VEGA Codes“ ist die Suche im Reiter „Coverage Codes“ eingeschränkt: Im Suchfeld für Coverage Codes sind maximal 4 Zeichen erlaubt, für die Coverage Reference maximal 10 Zeichen. Außerdem wurde die Benennung in der gesamten Anwendung von „Tire Option“ auf „Tire Product Reference“ geändert, auch in weiteren betroffenen Bereichen, in denen das Reifenprodukt erwähnt wurde.

**Mehrsprachigkeit und Geschäftsbedingungen**

Ein Produkt muss Geschäftsbedingungen (T&C) in allen in den Markteinstellungen hinterlegten Sprachen besitzen. Fügt ein Benutzer in den Markteinstellungen Marktsprachen hinzu und existieren bereits Produkte mit T&C, wird er darauf hingewiesen, dass er auch alle Vorlagen, also E-Mail-Vorlagen, Dokumentvorlagen und T&C, in dieser Sprache ergänzen sollte. Unternimmt er nichts, erscheint wie bisher eine Fehlermeldung, die die fehlende Sprache nennt, zum Beispiel „language DE missing“.

Bei Produkten mit mehreren Sprachen wird der Benutzer zudem direkt zur Erstellung der T&C in der fehlenden Sprache geführt, wobei die Angaben bereits vorausgefüllt sind. Beim Aufruf von „Manage T&C“ sieht der Benutzer in der Vorlagenverwaltung die Produkte bereits gefiltert.

**Hinweis zu in Planung befindlichen Verbesserungen**

Geplant ist außerdem, die Dauer der Statusübergänge eines Produkts von „created“ über „ready“ bis „published“ im Produktmanagement zu verkürzen.