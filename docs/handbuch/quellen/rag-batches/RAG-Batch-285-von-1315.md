# Batch 285 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Rechnungen im Bereich Administration suchen und freigeben**

Im Bereich Administration von Revenue Management steht Benutzern der Marktorganisation (Market Operation) die Option „Invoices" zur Verfügung. Wer sie auswählt, gelangt zur Suchseite für Rechnungen. Diese besteht aus einem Filterbereich und einer Ergebnistabelle. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden validierten UI-Design.

**Filterbereich**

Der Filterbereich trägt den Titel „Search invoices by using the following fields and filters". Sichtbar sind vier Suchkriterien: die Verarbeitungsnummer (Processing Number) als Textfeld, der Rechnungsstatus als Dropdown mit allen verfügbaren Status, die Rechnungsempfängernummer als numerisches Textfeld sowie die Vertragsnummer als Textfeld, das Buchstaben und Ziffern zulässt.

Über die Schaltfläche „More filters" öffnet sich ein Pop-up mit weiteren Filterfeldern: OneSCM-Rechnungsnummer, FI-System-Rechnungsnummer, Dokumenttyp, Kundenrechnungstyp, Rechnungsdatum von, Rechnungsdatum bis, Name des Rechnungsempfängers, Fahrgestellnummer und Kennzeichen. Das Pop-up bietet die Optionen „Apply" und „Cancel". Mit „Apply" wird das Pop-up geschlossen, und alle gewählten Optionen erscheinen im Filterbereich als Tags. Jede ausgewählte Option bildet ein eigenes Tag im Format „Filtername: gewählte Option". Jedes Tag besitzt eine „X"-Schaltfläche, mit der sich die Auswahl wieder entfernen lässt. Mit „Cancel" werden alle Änderungen verworfen.

Änderungen oder Auswahlen in den Filterfeldern wirken sich nicht automatisch auf die Suchergebnisse aus. Erst ein Klick auf die Schaltfläche zur Rechnungssuche zeigt die Ergebnisse passend zu den gewählten Filtern an. Die Schaltfläche „Reset" setzt alle Filterauswahlen auf den Ausgangszustand zurück (alle Felder leer), aktualisiert dabei aber die Ergebnisse nicht. Beim Laden oder Neuladen der Seite sind die Felder ebenfalls leer.

**Ergebnisbereich**

Im Ausgangszustand ist kein Filter angewendet, und es werden keine Ergebnisse angezeigt. Stattdessen erscheint der Hinweis: „Results will be displayed when searching for invoices. You can search using the Search input and/or applying the filters to narrow your search."

Nach einer Suche werden alle passenden Rechnungen in einer Tabelle dargestellt. Die Spalten lauten: OneSCM-Rechnungsnummer, FI-System-Rechnungsnummer, Rechnungsstatus, Dokumenttyp, Kundenrechnungstyp, Rechnungsdatum, Rechnungsdatum von, Rechnungsdatum bis, Nettobetrag, Währung, Vertragsnummer, Verarbeitungsnummer, Sammelkundenrechnung, Rechnungsempfängernummer, Name des Rechnungsempfängers, Fahrgestellnummer, Kennzeichen und Aktion. Die Aktionen in der letzten Spalte werden in anderen Epics umgesetzt.

Übersteigt die Zahl der Ergebnisse die maximale Anzahl pro Seite, werden sie auf mehrere Seiten verteilt, zwischen denen die Benutzer navigieren können. Standardmäßig werden 10 Datensätze pro Seite angezeigt. Über ein Dropdown lässt sich die Anzahl auf 10, 20, 30, 40 oder 50 ändern. Der zuletzt gewählte Wert wird nicht gespeichert und nach einem Neuladen der Seite auf 10 zurückgesetzt.

**Rechnungen freigeben**

Wird eine Rechnung manuell erstellt und liegt ihr Nettobetrag über dem Schwellenwert, bleibt sie im Status „Created" und muss von einem Benutzer der Marktorganisation manuell freigegeben werden. Der Schwellenwert beträgt 100 Euro. Er gilt je Markt und kann in einem Administrationsbereich geändert werden, der zu einem späteren Zeitpunkt folgt.

Die Option „Accept" ist nur für Rechnungen im Status „Created" sichtbar. Sie findet sich in der Spalte „Aktion", nachdem die drei Punkte angeklickt wurden und sich die Aktionsliste öffnet. Wählt der Benutzer „Accept", erscheint ein Bestätigungs-Pop-up mit der Frage „Are you sure you want to accept the invoice?" und dem Hinweis, dass die Aktion nicht rückgängig gemacht werden kann und die Rechnung nicht in den vorherigen Status zurückversetzt werden darf. Mit „Cancel" wird das Pop-up geschlossen, und der aktuelle Status bleibt erhalten. Mit „Confirm" wird der Status der Rechnung auf „Accepted" gesetzt und das Pop-up geschlossen.

Nach erfolgreicher Freigabe erscheint die Meldung „Invoice <INVOICE_NUMBER> was successfully accepted". Kann der Status nicht geändert werden, bleibt die Rechnung im Status „Created", und es wird die Fehlermeldung „An error occurred while accepting Invoice <INVOICE_NUMBER>" angezeigt. Diese Fehlermeldung enthält eine Schaltfläche „Close" und bleibt so lange sichtbar, bis der Benutzer sie schließt.