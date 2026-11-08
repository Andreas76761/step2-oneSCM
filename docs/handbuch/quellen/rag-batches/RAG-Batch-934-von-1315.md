# Batch 934 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Branchenschlüssel für Vega (Schnittstelle i155)**

Bei der Erstellung eines Vertragsangebots für einen Gewerbekunden kann nun die Branche (Industry Type) aus einer Auswahlliste gewählt werden. Die Auswahl wird auf Vertragsebene gespeichert und überall in der Anwendung angezeigt, wo der Platzhalter „Industry“ vorgesehen ist, sowohl in der Benutzeroberfläche als auch in den Dokumenten.

Wird der Vertrag aktiviert und die Datei i155 erzeugt, übernimmt das System den zur gewählten Branche gehörenden Code in die Datei, damit Vega über die für den jeweiligen Vertrag verwendete Branche informiert ist. Der Code steht im Satz RC05 an den Positionen 266 bis 269, linksbündig und mit einem nachfolgenden Leerzeichen. Wird beispielsweise die Branche „Furniture Transport“ gewählt, erscheint dort „002“ gefolgt von einem Leerzeichen. Ist als Branche „Not Relevant“ gewählt, bleibt es wie bisher bei der Ausgabe „****“.

Die Auswahlliste umfasst Codes von 001 bis 049 sowie den Code 099 für „FleetSite - vehicle“. Beispiele sind 001 „General Cargo“, 004 „Private Usage“, 012 „Courier Express Parcel“, 017 „Commercial Passenger Transport“, 024 „Company Car“, 046 „money transport / worth transport“ und 049 „Sewer/pipe cleaning/suction excavator“.

**Kostenzuordnung bei Management-Verträgen**

Bei der Vertragserstellung lässt sich nun für jede Deckung festlegen, welcher Partei die Kosten zugeordnet werden, damit Schadenkosten korrekt weitergeleitet werden. Das gilt für Basisdeckungen, optionale Deckungen mit dauerhafter Einbindung (100 % enthalten), optionale Deckungen sowie optionale Karosseriedeckungen.

Voraussetzung ist, dass jeder Deckungstyp eine definierte Kostenstelle (Cost Unit) hat. Zur Auswahl stehen Mercedes Benz, Kunde und Lieferant. Beim Lieferanten werden zusätzlich Lieferantenname und Kreditorennummer erfasst. Die Kostenstelle wird aus Stream 1 für jede Deckung mitgeliefert. Optionale Deckungen mit dauerhafter Einbindung werden im Datenpaket mit dem Kennzeichen „Base“ übertragen und im Bereich der enthaltenen Deckungen ohne Preis angezeigt.

Der Ablauf gestaltet sich wie folgt: Zunächst wird ein Vertragsangebot gestartet, eine Kennung hinzugefügt und die verfügbaren Produkte werden abgerufen. Nach der Produktauswahl werden die neuen Attribute je Deckung erfasst, also Mercedes-Benz, Kunde oder Lieferant samt Name und Kreditorennummer. Anschließend wird das Produkt konfiguriert, optionale Deckungen können ergänzt werden, und das Angebot wird erstellt. Für jede Deckung werden Preis und Zahlerinformation, also die neuen Kostenstellenattribute, gespeichert.

Bei der Aktivierung des Vertrags werden die Deckungen nach Kostenstelle gruppiert, bei Lieferanten zusammen mit dem Lieferantennamen. In der erzeugten i155-Datei wird im Satz RC20 an den Positionen 195 bis 244 der Lieferantenname linksbündig eingetragen. Außerdem wird an Revenue eine Liste aller für den Produkt-Servicevertrag konfigurierten Deckungscodes gesendet, gruppiert nach Kostenstelle. Jede Deckung wird mit dem erfassten und gespeicherten Preis übertragen. Die Kostenstelle wird als Mercedes Benz, Kunde oder Lieferant mit Name und Kreditorennummer ergänzt. Das Datenpaket wird an Stream 3 gesendet.

**Weitere Änderung**

Für Vans wurde im Rahmen des Releases PI11 eine Änderung (Change Request) im Bereich der Vertragserstellung umgesetzt. Die Unterlagen enthalten dazu keine weiteren Angaben.