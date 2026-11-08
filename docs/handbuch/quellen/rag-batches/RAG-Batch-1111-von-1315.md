# Batch 1111 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation – Änderungen im Überblick**

**Vertragsangebot und Kennung (Identifier)**
Im Vertragsangebot lässt sich die Suche nun zurücksetzen. Rechts neben dem Eingabefeld für die Kennung steht eine „X"-Schaltfläche. Wenn Sie darauf klicken, bleibt der gewählte Kundentyp erhalten. Die bisherigen Fahrzeugdetails und die aufgelisteten Produkte werden gelöscht, und das Eingabefeld ist wieder frei für einen neuen Wert. So können Sie bequem mit einem anderen Kennungstyp suchen, ohne das Angebot neu starten zu müssen. Die Gestaltung folgt den Vorgaben des Mercedes-Benz Workbench.

Wenn Sie ein Angebot über ein Baumuster starten, ein Produkt auswählen und konfigurieren und anschließend mit „Add Identified" zur Vertragserstellung wechseln, wird das Feld zu einem Eingabefeld für die Kennung. Darunter erscheint der Hinweis „Enter a valid Chassis Number or Order Number", genauso wie im Bereich „Identifier" des Vertragsangebots. Zuvor war dort ein vordefinierter Text „Chassis Number / Order Number" hinterlegt.

Außerdem sind bei einem Angebot über ein Baumuster die Optionen „Drucken" und „E-Mail senden" in der Fußzeile bereits nach der Konfiguration von Laufzeit, Laufleistung und Zahlungsintervall aktiv. Sie können also die aktuelle Konfiguration drucken oder versenden. Wenn Sie anschließend eine Kennung hinzufügen, bleiben beide Optionen aktiv. Ändern Sie nach dem Hinzufügen der Kennung die Konfiguration, wird die Datei aktualisiert.

**Produktauswahl, Konfiguration und Vergleich**
Bei der Konfiguration eines Produkts gilt jetzt eine feste Reihenfolge, sowohl in der Vertragserstellung als auch in der Verlängerung (Long Term). Zuerst wählen Sie die Vertragslaufzeit. Erst danach kann die jährliche Laufleistung als Dropdown ausgewählt werden. Das Zahlungsintervall wird erst verfügbar, wenn Laufzeit und Laufleistung gewählt sind. Bei Kontingentprodukten müssen stattdessen Vertragslaufzeit und Anzahl der Services gewählt sein, bevor das Zahlungsintervall aktiviert wird.

In den zusätzlichen Filteroptionen der Produktauswahl gilt für die Kategorien Jahreslaufleistung, Laufzeit und Leistungsumfang (Coverages) bei Mehrfachauswahl die UND-Verknüpfung. Es werden nur Produkte angezeigt, die alle gewählten Optionen erfüllen. Zwischen den Kategorien wurde bereits zuvor mit UND gefiltert.

In der Produktvergleichsansicht ist die Reihenfolge der Zeilen neu festgelegt: Bild, Produkt, Allgemeine Informationen, Preis, Vertragslaufzeit, jährliche Laufleistung, Anzahl der Services (nur bei Kontingentprodukten), Zahlungsintervall, Beschreibung und Leistungsumfang.

**Preis, Zahler und Karenzzeit-Kampagne**
Ist der Vertragswert durch eine aktive Kampagne, einen Händlerrabatt oder beides zusammen auf null reduziert und muss der Kunde nichts zahlen, kann im Bereich „Kunde und Zahlung" kein abweichender Zahler mehr hinzugefügt werden.

Ähnlich verhält es sich mit der Karenzzeit-Kampagne (Grace Period Campaign). Entspricht der Händlerrabatt dem Produktwert, wird die Möglichkeit, diese Kampagne zu beantragen, in der Oberfläche nicht mehr angezeigt. Der MPC kann eine Karenzzeit-Kampagne nun zusätzlich zu den Status „Created", „Confirmed" und „Waiting for Activation" auch im Status „Waiting for Confirmation" freigeben.

**Dokumente und Meldungen**
Das PDF mit den Preisinformationen heißt jetzt „Price information.pdf".

Beim Versand eines Angebots oder Vergleichs per E-Mail erscheint die Meldung „Offer was sent successfully to the customer". Die E-Mail-Adresse des Kunden wird darin nicht mehr genannt.

Wenn Sie nach der Wahl der Signaturart den Signaturprozess starten, erscheint die Meldung „Signature process initiated for Contract XXXXXXXX/XXXXX". Zuvor wurde fälschlich angezeigt, der Vertrag sei aktiviert worden. Die Erfolgsmeldung nach dem Auslösen der Signatur lautet: „Digital signature process for contract xxx/xxx has been successfully initiated. The Digital Signature (DSS) instructions were sent to the customer's email. Once the contract was checked and activated, it will be sent to the customer via email."

**Schnittstelle i155**
In der Schnittstelle i155 wird die Position 175 des Satzes RC20 angepasst. Stehen die Positionen 165 bis 169 auf „00000", bleibt Position 175 leer (Leerzeichen). Andernfalls wird dort wie bisher „1" eingetragen. Die zugehörige Dokumentation wurde aktualisiert.