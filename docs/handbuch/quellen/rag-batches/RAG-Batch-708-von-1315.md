# Batch 708 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kostenweiterleitung bei Management-Verträgen**

Für ausgewählte Kundengruppen, etwa Militärangehörige, bietet oneSCM einen speziellen Servicevertrag an, den sogenannten Management-Vertrag. Er sieht eine geringe monatliche oder einmalige Gebühr vor und stellt damit eine günstige Option für diese Kunden dar. Im Schadenfall wird die Rechnung nicht von Mercedes-Benz übernommen, sondern direkt an den Kunden weitergeleitet. Auf diese Weise bleibt der Service kostengünstig, ohne dass der gewohnte Qualitätsanspruch an Betreuung und Support leidet. Händler oder MOs können diese Art von Verträgen anlegen.

**Fall 1: Schadenmeldung über I156**

Geht in oneSCM über die Schnittstelle I156 eine Schadenmeldung von Vega ein, wird sie wie bisher importiert, und es wird ein Vega-Schadeneintrag mit dem Status „Processed" angelegt. Beim Einfügen eines Schadens prüft das System die Vertragsnummer und ermittelt die zugehörigen Deckungen. Lautet die Kostenstelle (Cost Unit) einer Deckung „Customer", erkennt oneSCM, dass die Kosten an den Kunden weiterzuleiten sind. Anschließend wird im Bereich der Kundenrechnungen automatisch eine neue Rechnung erzeugt. Der Flow-Typ ist „Open-Book Invoice", die oneSCM-Rechnungsnummer wird vergeben, die Verarbeitungsnummer bleibt leer, und als Dokumenttyp wird „Invoice" verwendet. Als Kundenrechnungstyp wird „Customer Charge Invoice (CCIN)" gesetzt. Der Rechnungszeitraum beginnt und endet jeweils am Reparaturdatum. Der Nettobetrag entspricht dem gesamten Schadenbetrag, und Rechnungsempfänger ist der Kunde, der den Vertrag bezahlt. Nach der Erstellung erhält die Rechnung automatisch den Status „Accepted". Wird ein Export-Batchjob ausgelöst, wird die akzeptierte Kundenrechnung im Batchjob E169 an das FI-System übermittelt. Die Materialnummer ist hierfür noch abzustimmen.

Sind mehrere Deckungen betroffen und werden alle vom Kunden bezahlt, werden die Beträge des Schadens summiert und eine einzige CCIN an den Kunden erstellt. Wird nur ein Teil der Deckungen vom Kunden bezahlt, wird die CCIN nur über die Summe der Beträge dieser Deckungen erstellt. Beide Varianten werden über E169 übermittelt.

**Fall 2: Manuelle Werkstattrechnung bei Papierschäden**

Geht für einen Management-Vertrag ein Papierschaden ein, legt der MO die Werkstattrechnung an den Händler manuell im System an. Sobald diese Rechnung nach dem üblichen Freigabeprozess akzeptiert ist, wird sie an E167 gesendet. Bei externen Händlern erfolgt der Versand, bei internen Händlern verbleibt die Rechnung im System. Ist bei den Deckungen die Kostenstelle „Customer" hinterlegt, wird auch hier die Kostenweiterleitung erkannt, und die CCIN wird automatisch im Bereich der Kundenrechnungen erstellt. Die Angaben entsprechen denen aus Fall 1, ebenso der Status „Accepted" und die Übermittlung im Batchjob E169.

Der Prozess funktioniert sowohl für Gutschriften als auch für Rechnungen. Bei manuell erstellten Werkstattrechnungen steht in der Oberfläche ein neues Feld „calculated old part tax" zur Verfügung, das für die Kostenweiterleitung verwendet wird. Das bisherige Feld „old part tax" wird in „base amount for old Part tax" umbenannt. Außerdem enthält der Reiter für Werkstattrechnungen eine neue Spalte, die nur bei Management-Verträgen (bzw. Kostenweiterleitung) die oneSCM-Rechnungsnummer der zugehörigen CCIN zeigt. Sie steht als Rechnungsreferenz hinter der Werkstattrechnungsnummer.

**Fall 3: Management-Verträge und Nemesis**

Für Management-Verträge sollen keine Kunden-, Vertrags-, Umsatz- und Kosteninformationen an Nemesis übermittelt werden. Es werden also weder Kunden-Trigger-Events (Abhängigkeit zu Stream 4), Vertragsstamm-Events (Abhängigkeit zu Stream 2), Umsatz-Events noch Händler-Events an Nemesis gesendet. Dieser Punkt ist noch offen: Möglicherweise wird es ein eigenes Produkt für Management-Verträge geben, für das die Marktverantwortlichen (MPC) Nemesis deaktivieren können.

**Weitere Änderungen im Bereich Cost Management**

Beim Import von I156-Dateien wird die Fahrzeug-Identifizierungsnummer (FIN) aus der Datei mit der FIN des Vertrags verglichen. Stimmen sie nicht überein, wird der Schaden übersprungen. Die VIN kann ignoriert werden. Zudem wurde die Validierungsregel für die erste Zeile angepasst, sodass sie nun 600 Zeichen prüft. Ferner werden in der Schnittstelle E167 nun die Händlerdetails mit exportiert.