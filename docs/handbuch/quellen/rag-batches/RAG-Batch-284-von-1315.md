# Batch 284 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Rechnungen im Admin-Bereich anzeigen und stornieren**

Im Admin-Bereich des Revenue Managements steht Ihnen als Market-Operation-Nutzer die Seite „Invoices" zur Verfügung. In der Spalte „Actions" jeder Rechnung finden Sie ein Menü mit drei Punkten. Darüber erreichen Sie die verfügbaren Aktionen für die jeweilige Rechnung.

**Rechnungsdetails ansehen**

Die Option „View" ist für Rechnungen in jedem Status verfügbar. Wenn Sie sie auswählen, werden Sie zur Detailseite der Rechnung weitergeleitet. Der Seitentitel lautet „Invoice Number" gefolgt von der jeweiligen Rechnungsnummer.

Die Detailseite zeigt folgende Rechnungsfelder: OneSCM Invoice Number, Processing Number, Document Type, Customer Invoice Type, Invoice Creation Date, Invoice Period, Invoice Status, Actual Mileage, Invoice Recipient, Financial System Transfer Date, FI-System Invoice Number, Invoice Reference und Currency. Hinzu kommen die Beträge. Der Net Amount ergibt sich aus der Summe der angelegten Rechnungspositionen. Bestehen beispielsweise zwei Positionen mit je 100 €, werden 200 € angezeigt. Der Tax Amount wird ebenfalls als Summe der Steuerbeträge der Rechnungspositionen berechnet. Bei zwei Positionen mit je 19 € Steuer erscheinen 38 €. Der Total Amount ergibt sich aus der Summe von Net Amount und Tax Amount. Je nach Status der Rechnung enthalten die Felder mehr oder weniger Informationen. Ist für ein Feld keine Information vorhanden, wird „-" angezeigt.

Zusätzlich enthält die Detailseite eine Tabelle mit den Rechnungspositionen. Ihre Spalten lauten Invoice Position, Invoice Date, Invoice Period, Net Amount, Tax Amount, VAT Classification und Invoice Position Text. Jede Zeile steht für eine Position.

Auf der Detailseite stehen Ihnen zwei Aktionen zur Verfügung. Mit „Cancel" schließen Sie die Detailseite und kehren zur Rechnungstabelle zurück. Mit „Edit" gelangen Sie in die Bearbeitungsansicht. Die Gestaltung der Seite entspricht der Mercedes-Benz Workbench und dem abgestimmten UI-Design.

**Rechnungen stornieren**

Rechnungen können storniert werden, wenn sie sich im Status „Created" oder „Accepted" befinden. Bei manuell angelegten Rechnungen bleibt die Rechnung im Status „Created", wenn der Nettobetrag den Schwellenwert überschreitet. Sie muss dann von einem Market-Operation-Nutzer manuell freigegeben werden. Der Schwellenwert beträgt 100 Euro, gilt marktspezifisch und soll künftig über einen Admin-Bereich änderbar sein. Dieser Konfigurationsbereich folgt zu einem späteren Zeitpunkt.

Die Option „Cancel" wird im Aktionsmenü nur für Rechnungen in den genannten Status angezeigt. Wenn Sie sie auswählen, erscheint ein Bestätigungs-Popup. Wählen Sie dort „Cancel", bleibt der aktuelle Status der Rechnung erhalten und das Popup wird geschlossen. Wählen Sie „Confirm", wechselt die Rechnung in den Status „Canceled" und das Popup wird ebenfalls geschlossen.

Anschließend erhalten Sie eine Rückmeldung als Toast-Nachricht. Bei erfolgreicher Stornierung lautet sie „Invoice <INVOICE_NUMBER> was successfully canceled". Tritt ein Fehler auf, erscheint „An error occurred while canceling Invoice <INVOICE_NUMBER>", und der Status der Rechnung bleibt unverändert. Die Fehlermeldung enthält eine Schaltfläche „Close" und bleibt so lange sichtbar, bis Sie sie schließen. Auch hier entspricht die Gestaltung der Mercedes-Benz Workbench und dem abgestimmten UI-Design.

**Hinweis zur Dokumentation:** In den Rohdaten werden für die Stornierung teils die Status „Accepted" und teils „Approved" genannt. Bitte prüfen Sie vor der Veröffentlichung, welche Bezeichnung in der Anwendung tatsächlich verwendet wird.