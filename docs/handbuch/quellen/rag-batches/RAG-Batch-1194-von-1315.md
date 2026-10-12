# Batch 1194 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Baumuster-Auswahl und Preis-Clustering für Vans**

Bei Van-Produkten ist ein Baumuster allein nicht eindeutig. Deshalb lassen sich Baumuster für Vans nun über zusätzliche Merkmale eingrenzen, insbesondere über Sonderausstattungscodes (SA-Codes). Dadurch können HQ-Administratoren und Mitarbeitende im MPC beim Definieren von Preisen für Van-Produkte präzise Fahrzeuggruppen anlegen und diesen die richtigen Preise zuordnen. Das ist auch die Grundlage für Produkte mit marktspezifischen Ausschlüssen: Ein Produkt kann festlegen, dass bestimmte SA-Codes enthalten sein müssen und andere nicht enthalten sein dürfen. Solche Produkte können anschließend im Generierungsprozess verkauft werden.

Die Auswahl erfolgt in der Fahrzeugverwaltung für Vans. Nach dem Anlegen einer Fahrzeuggruppe und der Definition von Name, Details, Produkt und Preis ordnen Sie der Gruppe Modellcodes zu. Dazu suchen Sie über die Filter der Seite nach Modellcodes. Bei Vans können diese sechsstellig (zum Beispiel 907133) oder siebenstellig (zum Beispiel 4156011) sein. Die Ergebnisse zeigen in einem Vorschaubereich alle Baumuster, die dem Modellcode zugeordnet sind, sowie deren Anzahl. Die Daten stammen aus CEPRO. Berücksichtigt werden nur freigegebene Baumuster; deaktivierte werden nicht importiert.

Anschließend können Sie die Ergebnisse über eine Auswahlbox mit SA-Codes weiter eingrenzen. Die Box enthält alle SA-Codes aus CEPRO, wobei die Codes je Baumuster nur einmal erscheinen. Angeboten werden die SA-Codes, die im jeweiligen Baumuster enthalten sind. Mehrfachauswahl ist möglich. Die Liste der Ergebnisse wird anhand der gewählten SA-Codes gefiltert, sobald Sie „Anwenden“ wählen. Die Baumuster-Anzahl aus der Vorschau wird in diesem Schritt nicht mehr benötigt. Die Ergebnisanzeige wird bei Filteraktionen aktualisiert und zeigt dabei einen Ladezustand. Schlägt der Filtervorgang fehl, erscheint eine Fehlermeldung. Liefert er keine Treffer, wird „Keine Ergebnisse“ angezeigt.

In der Übersicht der Fahrzeuggruppe sehen Sie Ihre Auswahl auf Ebene des Baumusters, nicht des Modellcodes. Mit „Erstellen“ werden die Gruppenkarten angelegt, und Sie gelangen in die Van-Übersicht. Für die Preisfindung gilt der Ablauf: Aus dem Baumuster wird die zugehörige Gruppe ermittelt und daraus der Preis.

**Preiserweiterung für Leasing: zusätzliche Preispunkte für die Gesamtlaufleistung**

Für den Leasingpartner MBLD stellt oneSCM Produkt- und Preisinformationen über einen Service bereit. oneSCM definiert Preise auf Basis der jährlichen Laufleistung, MBLD fragt sie jedoch auf Basis der Gesamtlaufleistung an. Bei der Umrechnung entsteht eine Matrix von Preispunkten mit Lücken. Für diese Zellen lieferte das System bisher die Antwort „No price available“, obwohl die Anfrage eine gültige Gesamtlaufleistung enthielt, etwa 25.000 km bei 36 Monaten.

Diese Lücken werden nun durch interpolierte Preise gefüllt. Dabei gilt eine lineare Interpolation zwischen vorhandenen, gültigen Preispunkten derselben Laufzeit. Beispiel: Bei 24 Monaten und 15.000 km liegt der Preis zwischen den Preispunkten bei 10.000 km (20 EUR) und 20.000 km (40 EUR) und beträgt damit 30 EUR.

Es gelten folgende Einschränkungen: Zwischen Preispunkten unterschiedlicher Laufzeiten wird nicht interpoliert. Bei einer nicht standardmäßigen Laufzeit, etwa 30 Monaten, liefert das System daher weiterhin „No price available“ im JSON. Ebenso wird nicht zwischen einer Laufleistung von 0 und dem ersten gültigen Preispunkt interpoliert, und es wird nicht über den höchsten gültigen Laufleistungspunkt hinaus interpoliert. Interpoliert wird ausschließlich zwischen definierten Preispunkten derselben Laufzeit.