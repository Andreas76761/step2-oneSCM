# Batch 291 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Manuelle Rechnungserstellung im Revenue Management**

Mitarbeitende der Marktorganisation (Market Operation) können im Bereich Revenue Management neue Rechnungen manuell anlegen und alle dafür erforderlichen Angaben erfassen. Den Einstieg bildet der Abschnitt „Customer Invoice“ im Zahlungsbereich eines Vertrags. Mit einem Klick auf die Schaltfläche „Create Invoice“ öffnet sich die Seite zur Rechnungserstellung. Die Gestaltung der Oberfläche folgt der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Rechnungsfelder**

Im oberen Bereich der Seite werden die allgemeinen Rechnungsdaten erfasst. Das Rechnungsdatum ist ein Pflichtfeld im Format TT.MM.JJJJ, zum Beispiel 16.05.2023. Der Dokumenttyp ist ebenfalls ein Pflichtfeld und wird per Einfachauswahl bestimmt, möglich sind „Invoice“ (Rechnung) und „Credit note“ (Gutschrift). Als Rechnungstyp (Customer Invoice Type) steht derzeit der Wert „Manually created customer financial documents (MANU)“ zur Verfügung; auch dieses Feld ist verpflichtend. Der aktuelle Kilometerstand (Actual Mileage) ist optional und akzeptiert numerische Werte zwischen 0 und 9999999.

Der Rechnungsempfänger ist ein Pflichtfeld und wird über ein Dropdown mit dem Namen des Halters (Holder) und des Zahlers (Payer) ausgewählt. Er wird anhand der Vertragseinstellungen vorbelegt: Gibt es nur einen Halter des Vertrags, ist dieser der Empfänger. Für spätere Ausbaustufen nach dem MVP ist vorgesehen, den Empfänger automatisch auf den Zahler zu setzen, wenn Zahler und Halter unterschiedliche Kunden sind. Er soll dann auch für Market-Operation-Nutzer editierbar sein. Zudem sollen die wählbaren Empfänger auf die Partner begrenzt werden, die mit dem Vertragsobjekt verknüpft sind, um Fehler bei manuellen Rechnungen zu minimieren.

Der Rechnungstext ist optional, erlaubt Sonderzeichen und ist auf maximal 240 Zeichen begrenzt. Zusätzlich gibt es ein Feld für die Währung. Die Rechnungsreferenz (Invoice Reference) bietet eine Liste der Rechnungsnummern aus dem FI-System, die mindestens den Status „FI Doc Created“ haben. Die vom FI-System erzeugte Nummer ist dabei die zentrale Referenz, über die das FI-System den neuen Datensatz mit dem vorhergehenden in Beziehung setzt. Die Rechnungspositionsnummer kann ergänzend angezeigt werden.

**Tabelle der Rechnungspositionen**

Unterhalb der Rechnungsfelder befindet sich die Tabelle der Rechnungspositionen (Manual Payment Plan Items). Bei der ersten Rechnung ist sie leer. In diesem Fall erscheint statt der Datenzeilen die Meldung „There are no Invoice positions to be displayed!“ zusammen mit der Schaltfläche „Create invoice position“. Sobald eine Position angelegt wurde, verschwindet diese Schaltfläche. Die Tabelle zeigt pro Position die Positionsnummer (automatisch erzeugt, beginnend mit 1), den Rechnungstyp, das Rechnungsdatum, den Rechnungszeitraum, den Nettobetrag, den Steuerbetrag, die Steuerklassifizierung und den Positionstext. Über die Spalte „Action“ kann eine Position bearbeitet oder gelöscht werden. Beim Bearbeiten öffnet sich das Popup zur Positionserfassung mit allen bereits ausgefüllten Feldern. Beim Löschen wird der Datensatz nach Betätigen der Schaltfläche aus der Liste entfernt.

**Rechnungsposition anlegen**

Über „Create Invoice Position“ öffnet sich ein Popup. Dort sind „Invoice From“ und „Invoice to“ als Datumsfelder Pflicht, wobei das Enddatum nach dem Startdatum liegen muss. Die Steuerklassifizierung ist ein Pflicht-Dropdown mit den Werten „Debtor Invoice (VAT_VALUE%)[AX]“ und „Debtor Invoice (0%)[DI]“. Der Nettobetrag ist ein Pflichtfeld als Dezimalzahl mit zwei Nachkommastellen. Der Steuerbetrag wird auf Basis der Steuerklassifizierung und des Nettobetrags berechnet, beispielsweise 1000 * 24 %. Der Positionstext ist optional, erlaubt Sonderzeichen und ist auf 240 Zeichen begrenzt.

Die Schaltfläche „Create“ im Popup bleibt ausgegraut, bis alle Pflichtfelder ausgefüllt sind. Danach schließt sie das Popup und zeigt die Position am Ende der Tabelle an. „Cancel“ schließt das Popup und verwirft die eingegebenen Daten.

**Status manuell erstellter Rechnungen**

Der Status der neu angelegten Payment Plan Items hängt vom Wert der Rechnung ab. Liegt er unterhalb eines Schwellenwerts, erhält die Position den Status „Accepted“. Liegt er darüber, ist ein Workflow erforderlich: Die Position erhält zunächst den Status „Created“ und muss den Workflow durchlaufen, um „Accepted“ zu werden. Der Schwellenwert für den MVP-Markt muss noch verifiziert werden; die grundlegende Funktionalität ist jedoch vorhanden.

**Rechnung anlegen oder abbrechen**

Die Schaltfläche „Create“ der Rechnungsseite bleibt ausgegraut, solange nicht alle Pflichtfelder der Rechnungsfelder ausgefüllt sind und keine Position angelegt wurde. Pro Rechnung ist nur eine Position zulässig. Nach Klick auf „Create“ wird die manuelle Rechnung erstellt, die Anwendung wechselt zur Tabelle der Kundenrechnungen, und die neue Rechnung erscheint dort.

Mit „Cancel“ kehren Nutzer zur Kundenrechnungstabelle zurück, sofern noch nichts eingegeben wurde. Wurden bereits Angaben gemacht, erscheint ein Bestätigungsdialog. „Cancel“ schließt diesen und hält Nutzer auf der Erstellungsseite. „Proceed“ schließt den Dialog, verwirft die Änderungen und beendet den Erstellungsprozess.

**Rückmeldungen an den Nutzer**

Bei erfolgreicher Erstellung erscheint die Meldung „Invoice <INVOICE_NUMBER> was successfully created“. Schlägt die Erstellung fehl, wird die Fehlermeldung „Invoice <INVOICE_NUMBER> could not be created.“ angezeigt. Diese Fehlermeldung enthält eine Schaltfläche „Close“ und bleibt sichtbar, bis der Nutzer sie schließt.

**Rechnungstypen**

Im Rahmen des MVP sind die Rechnungstypen MANU (manuell erstelltes Kundenfinanzdokument) und MPPI (monatliche Zahlung bzw. periodische Kundenrechnung) vorgesehen.