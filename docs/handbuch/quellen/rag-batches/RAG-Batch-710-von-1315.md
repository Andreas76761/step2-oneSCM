# Batch 710 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Lieferantenrechnungen und Lieferanten-Zahlungsplan (Supplier Payment Plan)**

Für Produkte, deren Leistungen an einen externen Lieferanten ausgelagert sind, etwa Reifen, erzeugt oneSCM automatisch einen Lieferanten-Zahlungsplan. Dadurch entfällt der Mehraufwand, der entsteht, wenn der Lieferant selbst eine Rechnung stellen muss. Stattdessen stellt oneSCM dem Lieferanten für die erbrachte Leistung eine Gutschrift aus. Der Prozess läuft überwiegend im Hintergrund und erfordert keine aktive Benutzerinteraktion. Er ist besonders für B2B-Themen mit Lieferantenbeteiligung relevant.

**Konfiguration**

Im Lieferantenmanagement wird für jeden Lieferanten festgelegt, ob er einen Zahlungsplan vom Typ „Light" oder „Normal" (Full) erhält. Das hängt davon ab, ob der Lieferant Self-Billing erlaubt. Erlaubt er es nicht, erzeugt oneSCM einen Zahlungsplan „Light". Diese Rechnungen dienen dem Abgleich und der Berichterstattung an den Lieferanten und werden nicht an die FI-Systeme exportiert. Erlaubt der Lieferant Self-Billing, erstellt oneSCM also Gutschriften für den Lieferanten, wird ein vollständiger („Full") Zahlungsplan erzeugt, dessen Rechnungen über eine dedizierte Schnittstelle an das FI-System übertragen werden.

Im Produktmanagement besitzt jedes Produkt einen oder mehrere Deckungscodes (Coverage Codes), und jedem Deckungscode kann nur ein Lieferant zugeordnet sein. Ein Zahlungsplan wird nur erstellt, wenn dem Deckungscode ein Lieferant zugeordnet und die Option „Excluded from VEGA" gesetzt ist. Ein Reifenprodukt kann zum Beispiel zwei Deckungscodes haben: einen für Winterreifen, angeboten von Continental, und einen für Sommerreifen, angeboten von Pirelli.

**Erzeugung des Zahlungsplans**

Der Zahlungsplan wird bei der Vertragsaktivierung im Cost Management erzeugt, und zwar je Deckungscode bzw. Lieferant ein eigener Plan. Bei zwei Reifenlieferanten entstehen somit zwei Zahlungspläne. Sie enthalten Gutschriften mit dem Wert, der für den jeweiligen Deckungscode in der Preismatrix (Lieferantenpreis) hinterlegt ist. Aus dem Vertrag werden dafür je Deckungscode der Deckungscode selbst, der zugeordnete Lieferant (ID und Name), der Preis der Leistung je Deckungscode und Lieferant sowie die Anzahl der zu erzeugenden Rechnungen übermittelt.

Die Positionen des Zahlungsplans enthalten folgende Angaben: die oneSCM-Belegnummer, die erst vergeben wird, wenn die Rechnung in den Status „Accepted" wechselt, den Status „Planned", den Flow-Typ „Supplier Documents", den Lieferantennamen, den Belegtyp „Credit Notes", das Belegdatum, den Nettobetrag, den Bruttobetrag und den Belegzeitraum. Bei monatlicher Abrechnung reicht der Belegzeitraum vom Vertragsbeginn bis zum Vertragsbeginn plus einen Monat minus einen Tag. Bei einmaliger Abrechnung reicht er vom Vertragsbeginn bis zum Vertragsende.

**Anzeige im Vertrag**

Nach der Erzeugung sind die Rechnungen im Vertrag auf dem Reiter „Payment" im Bereich „Supplier Invoices" sichtbar. Gibt es mehr als einen Deckungscode, steht ein Dropdown mit Mehrfachauswahl zur Verfügung, mit dem sich die angezeigten Dokumente filtern lassen. Die Summe der Lieferantendokumente richtet sich nach der Filterauswahl. Mit Filter wird „Sum of filtered Supplier Documents" angezeigt, ohne Filter „Sum of All Supplier Documents".

Eine Lieferantenrechnung kann im Anzeigemodus geöffnet werden. Im Bereich „Supplier Documents" sieht der Benutzer folgende Felder: oneSCM-Belegnummer, FI-System-Belegnummer, Processing Number, FI-System-Transferdatum, Belegtyp, Belegempfänger, SAP-Debitorennummer, Belegreferenz, Rechnungstyp „Service Provider Monthly (SPMP)", Belegdatum, Nettobetrag, Steuerbetrag, Gesamtbetrag und Belegstatus. Netto- und Steuerbetrag ergeben sich jeweils aus der Summe der erzeugten Rechnungspositionen, der Gesamtbetrag aus der Summe von Netto- und Steuerbetrag. Der Beleg enthält je Zeitraum nur eine Position mit den Feldern Belegposition, Belegzeitraum, Nettobetrag, Steuerbetrag, Steuerklassifizierung und Positionstext. Außerdem gibt es einen Verlaufsbereich, der alle Statusänderungen anzeigt.

**Batch-Jobs und Export**

Ein SFDM-Batch-Job, der nur für Lieferanten gilt, berücksichtigt ausschließlich Verträge nach Ablauf der Karenzzeit (Grace Period). Er vergibt die oneSCM-Belegnummer auf Basis des Belegzeitraums und setzt den Status auf „Accepted".

Für den Export der Lieferantenrechnungen gibt es den neuen Batch-Job „oneERPSupplierE167EXP" mit einer neuen E167-Variante, die ausschließlich für Lieferantenrechnungen gilt. Die Dateistruktur entspricht der der Werkstattrechnungen. Exportiert werden Rechnungen für Self-Billing Light und Full, die Übertragung an das FI-System erfolgt wöchentlich. Bei Self-Billing Light wird in der E167 ein gesperrter Status (Blocked) gesendet.

**Bericht an Lieferanten**

Nur bei Self-Billing Light wird zusätzlich ein Bericht an die Lieferanten erzeugt, und zwar jedes Mal, wenn der Job „oneERPSupplierE167EXP" ausgeführt wird. Die Liste der enthaltenen Dokumente basiert auf den exportierten Dokumenten der E167 für Lieferanten und wird je Lieferant und Deckungscode zusammengestellt. Der Bericht enthält folgende Felder: Vertragsnummer, FIN, VIN, Vertragsbeginn, Vertragsende, Rechnungsnummer (die oneSCM-Rechnungsnummer), Processing Number der Rechnung, Beginn und Ende des Rechnungszeitraums, Nettobetrag, Steuerbetrag und Bruttobetrag.