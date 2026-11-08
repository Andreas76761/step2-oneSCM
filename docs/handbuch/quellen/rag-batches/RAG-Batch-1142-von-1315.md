# Batch 1142 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation: Neuerungen und Änderungen**

**Lieferantenkonditionen und Zahlungsintervalle**
Für die Abrechnung mit Lieferanten werden die im Lieferantenmanagement hinterlegten Konditionen pro Coverage berücksichtigt. Das System stellt dem zuständigen Team (Stream 4) alle COV-Codes sowie alle verfügbaren Zahlungsintervalle bereit, damit dort im Lieferantenmanagement jedem Code ein Zahlungsintervall zugewiesen werden kann. Die Lieferantenkonditionen werden gespeichert, bei der Produkterstellung an die Generierung übergeben und von dort an Revenue weitergeleitet. Zusätzlich berechnet das System die Anzahl der Rechnungen, die an den Lieferanten gestellt werden, und übermittelt sie an Revenue, damit dort ein Zahlungsplan erstellt werden kann. Der Umfang berührt außerdem die Aufteilung von Lieferanten- und Endkundenpreis über die Admin Fee.

**Reifenoptionen für Vans**
Für die Division VANS wurde die Konfiguration von Reifen angepasst. Beim Definieren der Reifenkomponente wird der Bereich abhängig von der gewählten Fahrzeugkategorie (PC oder VANS) zu Beginn des Konfigurationsablaufs angezeigt. Bei der Kategorie VANS ist das Feld „Wheel Size“ sowohl für limitierte als auch für unlimitierte Varianten sichtbar, und es können die verfügbaren Größen ausgewählt werden (z. B. 11 Wheel Sizes). Wird eine Wheel Size gewählt, zeigt das System über einen Informations-Tooltip oder eine Ansicht die konkreten Reifengrößen an (z. B. 195/65 R16). Die Daten werden an die Generierung übergeben. Für Preisversion und Cluster gilt bei VANS mit limitierter Wheel Size weiterhin die bisherige Logik.

Für die Basisabdeckung bei unlimitierten Reifen gilt: Wurde die Basisabdeckung im Blueprint oder im Produkt auf „Always Include“ gesetzt, kann die Kostenstruktur der Coverage in der Preisversion definiert werden, anschließend lassen sich die Cluster-Preise konfigurieren. Diese Anpassung befindet sich im PI-Backlog.

**Kampagnen und externe Kampagnen-ID**
Die externe Kampagnen-ID ist bei der Kampagnenerstellung sowie in den Bearbeitungsoptionen ein Pflichtfeld. Sie steht in der Reihenfolge oberhalb der Debitorennummer, erlaubt maximal 10 Zeichen und lässt Sonderzeichen zu. Eine bestimmte externe Kampagnen-ID darf für dieselbe Fahrzeuggruppe zur gleichen Zeit nur einmal vorkommen. Kampagnen, die sich zeitlich oder in der Fahrzeuggruppe nicht überschneiden, dürfen dieselbe ID verwenden. Außerdem wurde eine Datenbankänderung zur Reaktivierung beendeter Kampagnen umgesetzt.

**Preisprüfung bei Serviceverträgen mit komplexer Reifenoption**
Validiert werden die Preisberechnung von Serviceverträgen mit Reifenoption, die Preisberechnung eines eigenständigen Reifenvertrags mit Inflation als Rate sowie die Preisberechnung eines eigenständigen Servicevertrags, bei dem alle Komponenten als Beträge angegeben sind.

**Anzeige kompatibler Produkte**
Für die Anzeige kompatibler Produkte werden die Meldungen bei verschiedenen Prüfungen verifiziert. Hat ein Fahrzeug keinen erfassten Service im DSB (Prüfung 3), erscheint der Hinweis, dass die Eingabe kein Ergebnis geliefert hat, verbunden mit der Bitte, eine gültige Fahrgestellnummer, Auftragsnummer oder einen Modellcode einzugeben oder durchgeführte Services zu prüfen. Wurden Services durchgeführt, die nicht den Mercedes-Benz-Standards entsprechen (Prüfung 4), lautet der Hinweis ähnlich, verweist aber auf die Reihenfolge der durchgeführten Services. Bei einer falschen Kennung (Prüfung 5) werden keine Produkte angezeigt, und es erscheint der Hinweis, dass die Eingabe kein Ergebnis geliefert hat und angepasst werden sollte.

**Weitere Änderungen**
Die Integration der Verso-ID über die OTR-Schnittstelle wurde umgesetzt: AFAB- und GO-Auftragsnummern werden abgerufen, danach läuft der bisherige Ablauf weiter. Die Produktlinienliste für Vans wurde aktualisiert und wird verifiziert. Bei Langzeit-Prolongation und STE werden nur zulässige Kombinationen aus Laufleistung und Laufzeit angeboten. Die Integration des Produkterstellungsablaufs in den Vertragsgenerierungsablauf ist ebenfalls abgeschlossen.