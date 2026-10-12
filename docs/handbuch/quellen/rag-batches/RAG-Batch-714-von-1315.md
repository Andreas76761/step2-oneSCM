# Batch 714 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Werkstattrechnung für einen Kunden manuell erfassen**

Bisher konnte eine Werkstattrechnung nur für einen Händler erstellt werden, wobei die Erstellung einer Werkstattrechnung und einer internationalen Werkstattrechnung in demselben Prozess erfolgte. Künftig können Mitarbeitende der Marktbetreuung (Market Operation) Werkstattrechnungen auch manuell für einen Kunden anlegen. Dazu wählen Sie den entsprechenden Vertrag aus und wechseln zu den Zahlungsdetails und dort zum Bereich „Werkstattrechnungen“. Die Schaltfläche „Werkstattrechnung erstellen“ steht dort immer zur Verfügung und bietet drei Optionen: Manuelle Rechnung, Internationale manuelle Rechnung und Erstattungsrechnung.

Die Option „Manuelle Rechnung“ enthält alle Felder der bisherigen Umsetzung, jedoch ohne den Schalter „International Claims“ und ohne das zugehörige Feld „Market“. Das Verhalten entspricht dem bisherigen Verhalten bei ausgeschaltetem Schalter „International Claims“. Bei der Option „Internationale manuelle Rechnung“ werden ebenfalls alle bisherigen Felder angezeigt, allerdings entfallen der Schalter „International Claims“, die Partnernummer (Vega-ID), der Werkstattname und die SAP-Debitorennummer.

**Rechnungskopf der Erstattungsrechnung**

Wenn Sie „Erstattungsrechnung“ auswählen, öffnet sich die Seite „Werkstattrechnung erstellen“. Der Rechnungskopf enthält folgende Angaben. Die Werkstattrechnungsnummer ist ein Pflichtfeld und muss aus genau neun Ziffern bestehen. Das Rechnungsdatum wird über eine Datumsauswahl im Format TT.MM.JJJJ (zum Beispiel 16.05.2023) erfasst, ist ein Pflichtfeld und muss zwischen dem Startdatum des Vertrags und dem Vertragsende plus drei Jahren liegen. Der Dokumenttyp ist ein Pflicht-Dropdown mit Einfachauswahl und den Werten „Invoice“ (Rechnung) und „Credit note“ (Gutschrift). Der Werkstattrechnungstyp ist ebenfalls ein Pflicht-Dropdown mit Einfachauswahl. Zur Auswahl stehen CLAI (VEGA-Schadenfall), COMM (Provisionsrechnung), SPIN (individuelle Rechnung eines Dienstleisters), SPMP (monatliche, periodische Zahlung an einen Dienstleister) und WSIN (Werkstatt-Finanzdokument); Letzteres ist vorbelegt und nicht editierbar.

Der aktuelle Kilometerstand ist ein numerisches Pflichtfeld mit Werten von 0 bis 9.999.999. Das Reparaturdatum wird über eine Datumsauswahl erfasst, ist ein Pflichtfeld und muss zwischen dem Vertragsbeginn und dem Vertragsende liegen. Die Währung wird aus dem Vertrag übernommen. Die Partnernummer (VEGA-ID) ist ein Pflichtfeld. Der Werkstattname ist ein Pflichtfeld mit maximal 50 Zeichen und stammt aus dem Dealership Management auf Basis der VEGA-ID. Die SAP-Debitorennummer der Werkstatt ist ein deaktiviertes Feld und wird ebenfalls aus dem Dealership Management anhand der VEGA-ID befüllt. Der Gesamtnettobetrag und der Gesamtbruttobetrag sind deaktivierte Felder und werden aus den Rechnungspositionen berechnet. Der Kundenname wird standardmäßig mit dem Namen des Vertragsinhabers befüllt, zusätzlich wird die SAP-Debitorennummer des Kunden angezeigt.

Stimmen Vertragsinhaber und Zahler überein, wird der Kundenname mit dem Namen des Vertragsinhabers befüllt. Stimmen sie nicht überein, ist eine Erstattung nicht möglich: Die Option „Reimbursement“ im Dropdown ist dann deaktiviert, und ein Tooltip zeigt den Hinweis „Reimbursement is not possible because Contract Holder is not the same as the Payer.“

**Rechnungspositionen**

Sind noch keine Positionen vorhanden, zeigt die Tabelle die Meldung „There are not Invoice Positions to be displayed“ sowie die Schaltfläche „Create Invoice Position“. Über diese Schaltfläche öffnet sich ein Popup mit folgenden Feldern: Coverage Code (Pflicht-Dropdown mit den Coverage Codes des Produkts bzw. Vertrags), Damage Code (Pflicht-Textfeld mit 7 Zeichen), Damage Type, Tax Classification (Pflicht-Dropdown mit den gültigen Steuerklassifizierungen aus dem Tax Management), Labor Net Value, Materials Net Value und Sublets Net Value (jeweils optionale Währungsfelder), Total Net Amount und Total Gross Amount (deaktivierte, berechnete Währungsfelder) sowie Invoice Position Text (optionales Textfeld mit Sonderzeichen, maximal 240 Zeichen). Der Gesamtnettobetrag ergibt sich aus der Summe der drei Nettowerte, der Gesamtbruttobetrag aus dem Nettobetrag zuzüglich Nettobetrag multipliziert mit dem Mehrwertsteuersatz.

Die Schaltfläche „Create“ im Popup ist ausgegraut, bis alle Pflichtfelder gefüllt sind und mindestens einer der drei Nettowerte angegeben wurde. Sie schließt das Popup und zeigt die Position in der Tabelle an. „Cancel“ schließt das Popup und verwirft die Eingaben. Neue Positionen erscheinen am Ende der Tabelle. Sobald mindestens eine Position existiert, wird die Schaltfläche „Create Invoice Position“ oben rechts über der Tabelle angezeigt.

**Rechnung speichern und abbrechen**

Zum Speichern der Rechnung klicken Sie auf „Create“. Die Schaltfläche ist ausgegraut, solange nicht alle Pflichtfelder des Rechnungskopfs ausgefüllt sind und keine Position angelegt wurde. Nach dem Klick wird die manuelle Rechnung angelegt, Sie werden zur Tabelle der Werkstattrechnungen weitergeleitet, und die neue Rechnung erscheint dort mit dem Status „Created“. Sie muss anschließend von einem Market-Operation-Benutzer im Admin-Bereich freigegeben werden.

Haben Sie im Formular nichts eingegeben, führt „Cancel“ direkt zur Tabelle der Werkstattrechnungen zurück. Wurden bereits Angaben gemacht, erscheint ein Bestätigungsdialog: „Cancel“ schließt ihn, und Sie bleiben auf der Erstellungsseite; „Proceed“ schließt ihn, verwirft die Änderungen und beendet den Erstellungsprozess.

Nach erfolgreicher Erstellung erscheint die Meldung „Invoice <INVOICE_NUMBER> was successfully created“. Schlägt die Erstellung fehl, wird „Invoice <INVOICE_NUMBER> could not be created.“ angezeigt. Diese Fehlermeldung enthält eine Schaltfläche „Close“ und bleibt sichtbar, bis der Market-Operation-Benutzer sie schließt.

**Weiterverarbeitung**

Die erstellte Rechnung durchläuft den üblichen Freigabeprozess der Marktbetreuung. Beim Lauf des Batches E169 werden diese Rechnungen zur weiteren Verarbeitung an NACOS gesendet. Der Dokumenttyp in E169 ist dabei „Credit Note“. Der Exporttyp und die Materialnummer richten sich nach dem Vertragstyp. Der Positionstext lautet: „Abrechnung Ihres Vertrages <Product_type>|Vertrag <Contract_Number>|Fahrzeugnr. <Chassis_number>|Kennzeichen <License_plate>|Umsatzsteuer <VAT Rate> aus <NET Amount> EUR|Credit Note for you Invoice with Reference Number <Workshop Invoice Number>“. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden validierten UI-Design.

**Import vollständig abgelehnter Schadenfälle (Schnittstelle i156)**

Wird ein Schadenfall mit einer neueren Entscheidungsnummer vollständig abgelehnt, wird er importiert und aktualisiert die ältere Version des Schadenfalls. In der Schnittstelle i156 enthalten bei einem vollständig abgelehnten Schadenfall sowohl RC10 als auch RC20 ausschließlich Beträge von 0.