# Batch 258 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

**Fehlerbehandlung beim E169-Import**

Rechnungen, die beim Import der E169-Datei in den Status „Error" gelangen, werden sowohl in der Kundenrechnungstabelle als auch im Admin-Bereich unter „Invoices" angezeigt. Eine Rechnung in diesem Status kann bestätigt werden. Dafür öffnet sich ein Modal zur Bestätigung der Korrekturen („Confirm fixes"), in dem eine Begründung eingegeben wird; das Textfeld für die Begründung unterliegt dabei festgelegten Zeichenbegrenzungen. Der Bestätigungsvorgang lässt sich jederzeit abbrechen.

**Steuerverwaltung (Tax Management)**

Für jeden Markt wird eine Liste der verfügbaren und anwendbaren Steuerarten (Tax Types) festgelegt. Diese Liste wird von einem Administrator im Rahmen der Markteinführung definiert. Die Steuerarten dienen anschließend dazu, einzelnen Arten konkrete Steuersätze und Gültigkeiten zuzuweisen.

Auf der Seite „Tax Management" steht dafür der Tab „Tax Type" zur Verfügung. Im Filterbereich lässt sich nach Name (die Tabelle wird nach Namen durchsucht, die das eingegebene Wort enthalten), Tax Category, Customer Tax Classification und Type suchen. Die Auswahlfelder bieten die in der Datenbank verfügbaren Werte an. Im Ausgangszustand ist kein Filter gesetzt, und es werden alle Ergebnisse angezeigt. Änderungen an den Filterfeldern wirken sich nicht automatisch auf die Ergebnisse aus; erst mit der Schaltfläche „Search" werden die Treffer entsprechend der Auswahl angezeigt. Die Schaltfläche „Reset" setzt die Filterauswahl auf den Ausgangszustand zurück, aktualisiert die Ergebnisse jedoch nicht.

Die Ergebnisse erscheinen in einer Tabelle mit den Spalten Name (Standardsortierung), Tax Category, Customer Tax Classification, Type, Customer Classification und Actions. Bei mehr Treffern als pro Seite darstellbar werden die Ergebnisse auf mehrere Seiten verteilt, zwischen denen Administratoren wechseln können. Standardmäßig werden 10 Datensätze pro Seite angezeigt; über ein Dropdown kann zwischen 10, 20, 30, 40 und 50 gewählt werden. Der zuletzt gewählte Wert wird nicht gespeichert und nach einer Aktualisierung der Seite auf 10 zurückgesetzt.

Um eine neue Steuerart anzulegen, navigiert ein Administrator im Admin-Bereich zur Seite „Tax Management", öffnet den Tab „Tax Type" und wählt die Schaltfläche „Create Tax Type". Auf der Erstellungsseite sind folgende Pflichtfelder auszufüllen:

Das Feld „Name" ist ein Textfeld mit mindestens 3 und höchstens 50 Zeichen. Sonderzeichen sind erlaubt. Derselbe Name darf nicht für mehrere Steuerarten verwendet werden; in diesem Fall erscheint eine Fehlermeldung. Das Feld „Tax Category" gibt an, ob sich die Steuer auf den Kunden oder das Produkt bezieht, und bietet die Werte „Client" und „Product" zur Auswahl. Das Feld „Customer Tax Classification" wird aus dem Wert des vorherigen Feldes abgeleitet und vorbelegt; mögliche Werte sind „Standard", „Exempt" und „Reduced". Im Dropdown „Customer Tax Type" steht „VAT" zur Verfügung. Die Optionen „Luxury Tax" und „Insurance Tax" gelten laut Stand vom 29.04.2024 nicht für den Markt DE. Sie sind in der Oberfläche nicht sichtbar, und das Dropdown ist deaktiviert, da nur eine Option verbleibt.

Die Schaltfläche „Create" ist ausgegraut, solange nicht alle Pflichtfelder ausgefüllt sind. Nach dem Klick wird die Steuerart angelegt, der Benutzer wird zur Tabelle der Steuerarten weitergeleitet, und die neue Steuerart erscheint dort. Wurden im Formular keine Angaben gemacht, führt „Cancel" direkt zur Tabelle zurück. Wurden bereits Angaben gemacht, erscheint ein Bestätigungs-Popup: „Cancel" schließt das Popup, und der Benutzer bleibt auf der Erstellungsseite. „Proceed" schließt das Popup, verwirft die Änderungen und beendet den Erstellungsprozess.

Bei erfolgreicher Anlage erscheint die Meldung „Tax Type <NAME> was successfully created". Schlägt die Anlage fehl, wird die Fehlermeldung „Tax type <NAME> could not be created." angezeigt. Diese Fehlermeldung enthält eine Schaltfläche „Close" und bleibt sichtbar, bis der Benutzer sie schließt. Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Integration der Steuerverwaltung in die Kundenanlage**

Die Steuerverwaltung ist mit der Kundenanlage verknüpft. Wird ein Vertrag mit der VAT-Klassifizierung „Exempt" angelegt, steht bei der Rechnungserstellung ausschließlich die Option „Exempt" zur Verfügung. Entsprechend steht bei einem Vertrag mit der Klassifizierung „Standard" nur die Option „Standard" zur Verfügung.

**Rechnungen ab 100 Euro**

Für Rechnungen mit einem Wert von mindestens 100 Euro muss im Admin-Bereich unter „Invoices" die Aktion „Accept" verfügbar sein. Zuvor wurde diese Aktion bei einer manuell erstellten Rechnung mit einem Wert von 100 Euro nicht angeboten.

**Weitere Korrekturen**

Behoben wurde außerdem ein Problem, bei dem der entfernte zweite Schalter für die globale Rechnungsstellung („Global Invoicing") die Vertragserstellung verhinderte. Zudem wurde ein Fehler bei den Batch Jobs behoben, der beim Löschen eines Job-Zeitplans (Job Schedule) auftrat.