# Batch 1264 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation: Änderungen im Überblick**

**Einheitlichere Oberflächen und einfachere Übersetzung**

Um die Oberfläche von oneSCM klarer und leichter ins Deutsche übersetzbar zu machen, wurden die Texte in der gesamten Anwendung vereinheitlicht. In allen Suchfiltern entfallen Handlungsaufforderungen, es bleibt nur das Suchkriterium stehen. Aus „Select Template Type“ wird beispielsweise „Template Type“. Auch die Überschriften oberhalb der Filtereingaben wurden auf die wesentlichen Informationen verkürzt. Auf allen Seiten mit einer tabellarischen Übersicht lautet die Überschrift über der Trefferanzahl nun einheitlich „Results“, unabhängig vom bisherigen Namen wie etwa „Verification Checks“. Die Anzeige „Displaying 4 of 4 records“ wurde zu „4 of 4“ verkürzt. Wenn keine Daten vorhanden sind, erscheint statt des langen Hinweistextes nur noch „No data to display“.

Dieselbe Textstraffung gilt für mehrere Bereiche der Anwendung. Bei den Fahrzeuggruppen heißt der Abschnitt zur Eingabe von Name und Beschreibung nun „Define vehicle group“. Der Abschnitt zur Auswahl von Produkt und Preisversion trägt die Bezeichnung „Select product and price version for this vehicle group“. Bei der Produkterstellung lautet die Abschnittsüberschrift „Define product“. Der Hinweis zum Marketingbild wurde zu „Default marketing image will be used if you don’t select another one“ geändert. Im Erfolgsdialog nach der Produkterstellung steht nur noch „You can now assign prices or go back to the product view“.

Bei den Clustern lautet die Überschrift des Eingabebereichs jetzt „Define Cluster“, der Hinweis zur Tabelle „Please fill in the desired prices in the table“. Das Stiftsymbol in den Tabellenzellen entfällt. Bei den Kampagnen wurde der Auswahltext zu „Select the clusters from which you want to apply the discount“ geändert, die Übersicht trägt den Titel „Products and Clusters“, und der Hinweistext im Vorschaubereich wurde entfernt.

Bei der Erstellung eines Blueprints lautet die Überschrift im ersten Schritt „Define your blueprint“. Im zweiten Schritt heißt es „Select the Coverage codes“, und auch hier entfällt der Hinweistext im Vorschaubereich. Im Dialog zum Löschen eines Blueprints wurde die Aufforderung zur Bestätigung der Löschung aus dem Vorschaubereich entfernt.

**Coverage-Codes**

Bei Coverage-Codes wurde das Feld „Default Short Description“ im ersten Schritt, im zugehörigen Tooltip und im zweiten Schritt in „Coverage Name“ umbenannt. Die Felder erscheinen nun in dieser Reihenfolge: Coverage Category, Division, Coverage Name, Coverage Code und Coverage Reference. Abhängig vom gewählten Coverage-Typ wird zudem der erste Buchstabe des Codes vorbelegt: „P“ für Base Coverage, „O“ für Optional und „A“ für Body.

**Blueprints und Produkte**

Beim Anlegen eines Blueprints muss der Blueprint-Name zwischen 3 und 30 Zeichen lang sein. Sobald das Eingabefeld verlassen wird, prüft eine neue Schnittstelle im Backend, ob der Name bereits vergeben ist. Außerdem ist die Zeichenanzahl in allen Feldern des Produkterstellungsprozesses auf die jeweils zulässige Maximallänge begrenzt.

Wird als Ablaufkriterium „Contingent“ gewählt, können im zweiten Schritt keine Optional- oder Body-Coverages mehr hinzugefügt werden; beide Dropdown-Listen sind deaktiviert.

Wenn die Preismatrix eines Produkts bearbeitet wird, wirken sich die Änderungen nun auch auf die Preistabelle im Tab „Optional Coverages“ eines Clusters aus, sofern eine Kostenabhängigkeit von der Laufzeit, von der Laufleistung oder von beidem gewählt wurde. Zuvor wurde nur die Preistabelle im Tab „Base Coverages“ aktualisiert.

**Kampagnen und Aktionen**

In der Kampagnenübersicht wurde die Aktion „View“ aus dem Aktionsmenü („…“) entfernt. Stattdessen sind die Kampagnennamen jetzt Hyperlinks, die diese Funktion übernehmen. Für Benutzer mit der Rolle MO enthält die Aktionsliste neben „View Prices“ nun auch „View Product“, ausgerichtet wie in der übrigen Oberfläche.

**Weitere Korrekturen und Erweiterungen**

Im Backend wurde behoben, dass nach einer Kurzzeitverlängerung keine Langzeitverlängerung angelegt werden konnte. Die Modifikation „Long Term Extension“ steht außerdem für alle Produkte zur Verfügung. Zudem wurde das Verhalten beim Anlegen einer Kampagne mit einem bereits vergebenen Namen angepasst.