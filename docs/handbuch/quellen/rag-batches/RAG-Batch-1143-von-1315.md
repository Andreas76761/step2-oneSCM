# Batch 1143 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation (Contract Calculation)**

**Produktkonfiguration und Reifenprodukte**

In der Produktkonfiguration steht im Erstellungs- und Bearbeitungsdialog (Schritt 6) das Feld „Weather Profile“ zur Verfügung. Es handelt sich um ein Mehrfachauswahlfeld mit fest hinterlegten Werten. Bleibt das Feld leer, zeigt das System eine Validierungsmeldung an und verhindert das Speichern. Werden ein oder mehrere Wetterprofile ausgewählt, speichert das System die Zuordnung zum Produkt. Für eine bestimmte Kombination aus „Tire Type“ und „Weather Profile“ kann ein eigener Preis festgelegt werden. Die Preisberechnung wendet die Regeln für Produkte mit zugeordnetem Wetterprofil korrekt an. Zusätzlich wird die Datenübertragung an die Vertragserstellung (Generation) geprüft, ebenso der Abgleich des SA-Identifiers.

Das Blueprint wurde für Reifenprodukte mit unbegrenztem Umfang vereinheitlicht. Da bei unbegrenzten Produkten das Ablaufkriterium entfällt, ist nicht erkennbar, welche Preismatrix zu erzeugen ist. Wählt der Benutzer einen unbegrenzten Reifenumfang und ausschließlich die Produktoption, werden deshalb Zeit oder Laufleistung im Blueprint schreibgeschützt angezeigt. Außerdem unterschieden sich die Felder von optionalen Deckungen und Reifen-Zusatzdeckungen. Künftig stehen für beide alle Filter zur Verfügung: Bei den optionalen Deckungen wird der Kundentyp ergänzt, bei der Reifendeckung die Vertriebsebene. Für Deckungscodes vom Typ Reifen gibt es nur zwei Kostendefinitionen. Bei „No cost“ wird kein Preis im Cluster definiert, und die Option erscheint im Vertragsvorschlag mit einem Preis von 0. Bei „Product reference price“ erscheint die optionale Deckung im Vertragsvorschlag mit dem Produktpreis.

**Preisberechnung**

Der Inflationsfaktor geht in die Preisberechnung als tatsächlicher Faktor und nicht mehr als Prozentwert ein. Geprüft werden außerdem die Interpolations- und Rundungslogik für kontingentbasierte Reifenprodukte, die Obergrenze (Maximum Cap) in der Preismatrix samt Formatangleichung sowie die Aktualisierung der Prozentgrenze für den Industriefaktor.

**Händlerprovision**

Die Händlerprovision richtet sich nach den Vertriebskanälen der Preisversion. Enthalten die Vertriebskanäle die Option „Retail“, wird die Provision für optionale Deckungen in der Vertragserstellung angewendet und im Produkttest angezeigt. Enthalten sie „Retail“ nicht, wird die Provision weder angewendet noch angezeigt, weder in der Vertragserstellung noch im Produkttest.

**Kampagnen und Limit-Voreinstellungen**

Die externe Kampagnen-ID ist nun ein Pflichtfeld und erlaubt maximal 10 alphanumerische Zeichen. Hintergrund ist, dass der Kampagnenexport an oneERP auf 50 Zeichen begrenzt ist, der Kampagnenname im Kampagnenmanagement aber länger sein kann. Beim Export wird daher die externe Kampagnen-ID statt des Namens verwendet. Eine bestimmte externe Kampagnen-ID darf für dieselbe Fahrzeuggruppe nur bei einer Kampagne zur selben Zeit vorkommen. Kampagnen, die sich weder zeitlich noch in der Fahrzeuggruppe überschneiden, können dieselbe ID tragen. Das gibt dem Markt Deutschland mehr Flexibilität, insbesondere bei den Aktions-IDs für Verkaufssubventionen.

Limit-Voreinstellungen sind jetzt divisionsspezifisch. Von einem Benutzer einer Division erstellte Voreinstellungen können von Benutzern der anderen Division weder eingesehen noch bearbeitet werden. Wird eine Voreinstellung von einem Benutzer mit PC- und Van-Rolle angelegt, wird sie der Division zugeordnet, der das Produkt zugeordnet ist.

**Aktualisierung von SA-Codes (in Planung)**

Geplant ist, dass das System aktualisierte SA-Codes aus externen Bestellsystemen übernimmt. Ändert ein Kunde mit einer Bestellnummer nach Erstellung eines Vorschlags seine Auswahl, soll der Vertrag erkennen, ob sich der Preis geändert hat, und über das weitere Vorgehen entscheiden können. Dazu soll das Produktsystem mit einer gültigen Bestellnummer eine Preisanfrage starten, die zugehörigen SA-Codes abrufen und speichern, die aktualisierten Fahrgestelldaten gezielt abfragen und das gesamte Paket aus Bestell- und Fahrgestelldaten an die Vertragsdomäne senden, um den finalen Preisabruf auszulösen. Zusätzlich soll eine wiederholbare Produktabfrage („Call Product“) die Produktpreise erneut prüfen können.

**Erweiterung des Produkt-Blueprints (in Planung)**

Die Erweiterung des Produkt-Blueprints für den Anwendungsfall MBLD ist noch offen. Nähere Angaben liegen derzeit nicht vor.