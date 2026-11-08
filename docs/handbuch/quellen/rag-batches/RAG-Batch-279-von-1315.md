# Batch 279 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

**Fehlerbehandlung beim Import von E169**

Kann NACOS eine Rechnungsanforderung aus E169EXP nicht verarbeiten, sendet es in der Datei E169IMP die Rückmeldung 888888888 ("Error"). Mögliche Ursachen sind ein falscher oder gesperrter Kunde sowie eine falsche Fahrgestellnummer (FIN/VIN). Fehler bei der Fahrgestellnummer sollten dank der aktiven Schnittstelle zum Vehicle Data Interface selten auftreten. In diesen Fällen wurden die geplanten Rechnungen in NACOS nicht gebucht und konnten dem Kunden nicht in Rechnung gestellt werden. Eine Nacharbeit ist erforderlich, damit sie erneut angestoßen werden können.

Hat eine Rechnungsanforderung nach der Verarbeitung der E169IMP-Datei den Status "Error", ist sie in der Tabelle der Kundenrechnungen auf Vertragsebene oder auf der Seite Admin -> Invoices sichtbar. Benutzer der Market Operations untersuchen, warum NACOS den Status "Error" gesendet hat. Zur Unterstützung der Recherche ist in der Tabelle unter Admin -> Invoices die Spalte "Contract Number" als Link zur Vertragsseite und der Name des Rechnungsempfängers als Link zur Kundendetailseite umgesetzt. Anschließend beheben die Market-Operations-Benutzer die Ursache des Problems entsprechend dem fachlichen Hintergrund, etwa einen falschen Kunden, gegebenenfalls durch Korrektur der Angaben auf Vertragsebene.

Ist das Problem behoben, bestätigen die Benutzer die Korrektur und setzen den Status auf "Accepted". Der nächste Lauf des Invoice-Creation-Batch-Jobs verarbeitet die Rechnungsanforderung dann. Dazu öffnen sie im Admin-Bereich die Seite Invoices, suchen bzw. filtern nach der Rechnungsanforderung mit dem Status "Error" und wählen in der Spalte "Action" die Option "Confirm Fixes". Diese Aktion steht ausschließlich für Rechnungen mit dem Status "Error" zur Verfügung.

Nach Auswahl von "Confirm Fixes" erscheint ein Popup mit dem Titel "Confirm Fixes". Der Text lautet: "Please confirm that the Errors regarding this entry have been resolved. Enter the reason why the entry had to be adjusted." Das Textfeld für die Begründung ist ein Pflichtfeld, erlaubt Sonderzeichen und verlangt mindestens 10 und höchstens 150 Zeichen. Mit "Cancel" wird das Popup geschlossen und die Rechnungstabelle wieder angezeigt. Die Schaltfläche "Confirm" ist erst aktiv, wenn die Begründung gültig ist. Sie speichert den Begründungstext in der Änderungshistorie des Status, ändert den Status von "Error" auf "Accepted", schließt das Popup und führt zurück zur Rechnungstabelle. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Rechnungsposition: Erfolgreicher Ablauf beim Anlegen**

Für Revenue Management steht der Ablauf "Create invoice position success flow" zur Verfügung. Weitere Details liegen nicht vor.

**Steuerverwaltung: Steuersatz löschen**

MPC-Benutzer können einen Steuersatz löschen, sofern dessen Gültigkeitszeitraum in der Zukunft liegt. Die Löschoption steht nur für Steuersätze zur Verfügung, deren Gültigkeit frühestens morgen beginnt. Dazu öffnen Benutzer die Seite "Tax Rate", klicken in der Spalte "Action" auf die drei Punkte und wählen "Delete".

Daraufhin erscheint ein Bestätigungspopup mit dem Titel "Delete Tax Rate" und der Frage "Are you sure you want to delete this Tax Rate?". Der Hinweistext lautet: "This action cannot be undone and you will lose all the details associated with it. Please confirm that you would like to proceed with the deletion." Mit "Cancel" wird das Popup geschlossen und die Tabelle der Steuersätze angezeigt. Mit "Delete" wird der Steuersatz endgültig aus der Datenbank gelöscht und das Popup geschlossen.

Bei erfolgreichem Löschen erscheint die Meldung "Tax <Name> was successfully deleted". Kann der Steuersatz nicht gelöscht werden, wird die Fehlermeldung "Tax <Name> could not be deleted." angezeigt. Diese Fehlermeldung hat eine Schaltfläche "Close" und bleibt sichtbar, bis der Benutzer sie schließt. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Steuerverwaltung: Steuersatz bearbeiten**

MPC-Benutzer können einen bestehenden Steuersatz (Tax Code) bearbeiten, sofern der Gültigkeitsbeginn in der Zukunft liegt. Dazu öffnen sie die Seite "Tax Management" und den Tab "Tax Rate", klicken beim gewünschten Eintrag in der Spalte "Action" auf die drei Punkte und wählen "Edit". Die Bearbeitungsseite enthält dieselben Felder wie die Anlegeseite, jedoch mit den vorhandenen Daten befüllt.

Folgende Felder stehen zur Verfügung: "Name" ist eine Dropdown-Auswahl auf Basis der Werte im Bereich Tax Type und des Mandanten und ein Pflichtfeld. "Entity" und "Type" sind schreibgeschützte Textfelder, deren Werte sich aus dem gewählten Namen ergeben. "Financial System Document Code" ist ein Pflichtfeld mit zwei Zeichen, bestehend aus Buchstaben (A–Z) und Ziffern (0–9). "Financial Document Definition" ist ein Pflicht-Dropdown mit den Werten "Invoice" und "Credit Note". "Tax Factor" ist ein Pflichtfeld für Dezimalzahlen zwischen 0 und 0,99. "Valid from" ist ein Pflicht-Datumsfeld, frühestens ab morgen. "Valid to" ist ein Pflicht-Datumsfeld, dessen Datum nicht vor "Valid from" liegen darf.

Im Aktionsbereich gibt es "Cancel" und "Update". Wurde kein Feld geändert, schließt "Cancel" die Bearbeitungsseite und führt zur Übersicht der Steuersätze zurück. Wurde mindestens ein Feld geändert, erscheint ein Popup mit dem Titel "You have unsaved changes!" und der Meldung "If you proceed, you will lose all the changes you have made. Are you sure you want to close?". Mit "Yes" werden das Popup und die Bearbeitungsansicht geschlossen und alle Änderungen verworfen. Mit "No" wird das Popup geschlossen und die Bearbeitungsansicht bleibt geöffnet. "Update" ist nur aktiv, wenn alle Felder die Validierungsregeln erfüllen, speichert die Änderungen und führt zur Übersicht der Steuersätze zurück.

Bei Erfolg erscheint die Meldung "Tax Rate <NAME> was successfully created", andernfalls die Fehlermeldung "Tax Rate <NAME> could not be created." Die Fehlermeldung hat eine Schaltfläche "Close" und bleibt sichtbar, bis der MPC-Benutzer sie schließt. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.