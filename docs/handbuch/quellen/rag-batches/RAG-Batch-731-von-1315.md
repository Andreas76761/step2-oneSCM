# Batch 731 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Schadencodes im Kostenmanagement**

Im Bereich Cost Management stehen auf der Seite „VEGA Codes“ im Admin-Bereich unter dem Reiter „Damage codes“ (Schadencodes) Funktionen zum Anzeigen, Suchen, Anlegen und Löschen von Schadencodes zur Verfügung. Die Oberfläche entspricht den Vorgaben der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Übersicht und Suche**

Die Übersichtsseite zeigt alle in oneSCM verfügbaren Schadencodes und ermöglicht die gezielte Suche. Als Hauptkriterien stehen Schadencode, Schadenstyp (Einfachauswahl), Beschreibung des Schadencodes und Beschreibung des Schadenstyps zur Verfügung. Über „Weitere Filter“ lässt sich zusätzlich nach Division (Mehrfachauswahl) und Markt (Dropdown mit Mehrfachauswahl) eingrenzen. Wählen Sie beispielsweise den Markt DE, werden nur die für DE spezifischen Schadencodes angezeigt. Wählen Sie „General (ALL)“, erscheinen die Schadencodes, die für alle Märkte verfügbar sind.

Mit der Schaltfläche „Search“ wird das Filterfenster geschlossen, und alle gewählten Optionen erscheinen im Filterbereich als Tags im Format „Filtername: gewählte Option“. Jedes Tag besitzt ein „X“, mit dem sich die jeweilige Auswahl entfernen lässt. Mit „Cancel“ werden alle Änderungen verworfen. Änderungen in den Filterfeldern wirken sich nicht automatisch auf die Suchergebnisse aus.

Der Ergebnisbereich zeigt für jeden Schadencode Division, Markt, Damage Reference, Schadencode, Schadenstyp, Beschreibung des Schadencodes, Beschreibung des Schadenstyps und Aktionen. Die Aktionen werden in anderen Epics umgesetzt. Alle Spalten außer „Aktionen“ sind sortierbar, standardmäßig wird alphabetisch nach der Spalte Division sortiert. Pro Seite werden standardmäßig 10 Einträge angezeigt; wählbar sind 10, 20, 30, 40 und 50.

**Schadencode anlegen**

Market-Operation-Nutzer und Administratoren können Schadencodes anlegen, damit diese anschließend einem Coverage Code zugewiesen werden können. Navigieren Sie dazu im Admin-Bereich zu „VEGA Codes“, öffnen Sie den Reiter „Damage codes“ und klicken Sie auf „Create Damage code“. Es öffnet sich ein Assistent mit drei Schritten.

Im ersten Schritt, „Define Damage Code“, wählen Sie einen Coverage Code aus (Pflichtfeld, Einfachauswahl). Die Auswahlmöglichkeiten stammen aus dem Feld „Coverage Reference“ im Reiter „Coverage“. Die Division ist ein schreibgeschütztes Dropdown, dessen Optionen (Passenger Cars, Vans) sich aus dem gewählten Coverage Code ergeben; oneSCM ist dabei das führende System für die Beziehung zwischen Division und Coverage Code. Für jede Kombination aus Division, Schadencode und Schadenstyp wird eine eigene Zeile in der Tabelle angelegt, etwa eine für Division PC, Schadencode 0001, Schadenstyp SV und eine weitere für Division VANS mit denselben Werten. Der Schadencode ist ein Pflichtfeld mit genau 5 Zeichen, erlaubt sind die Zeichen 0-9 und A-Z. Der Schadenstyp ist ebenfalls ein Pflichtfeld, mit genau 2 Zeichen, ebenfalls aus 0-9 und A-Z. Bei ungültigen Eingaben werden Fehlermeldungen angezeigt. Sobald alle Pflichtfelder ausgefüllt sind, wird die Schaltfläche „Next“ aktiv.

Im zweiten Schritt, „Market Specificity“, wählen Sie aus einer Liste die verfügbaren Märkte aus. Derzeit ist dies nur Deutschland; die Liste wird mit jedem weiteren von oneSCM unterstützten Markt erweitert. Mit „Select All Markets“ werden alle verfügbaren Märkte ausgewählt. Damit die Schaltfläche „Confirm“ aktiv wird, muss mindestens ein Markt ausgewählt sein. Nach der Bestätigung erscheint auf der rechten Seite für jeden Markt eine Karte mit zwei Pflichteingabefeldern: Code Description und Type Description. Beide müssen mindestens 5 und höchstens 100 Zeichen enthalten, wobei alle Zeichen einschließlich sprachspezifischer Sonderzeichen erlaubt sind. Wenn Sie einen Markt abwählen und bestätigen, werden die zugehörige Karte und die erfassten Beschreibungen entfernt. Die Marktauswahl legt fest, in welchen Märkten der Schadencode verfügbar ist.

Der dritte Schritt, „Overview & Confirmation“, bietet eine Übersicht. Das „X“ löst einen Dialog zum Verlassen des Assistenten aus, „Back“ führt zum vorherigen Schritt. Im letzten Schritt speichert „Confirm“ die Konfiguration in der Übersichtsliste.

**Schadencode löschen**

Market-Operation-Nutzer können Schadencodes löschen; die Löschoption steht für alle Schadencodes zur Verfügung. Öffnen Sie dazu die Seite „VEGA Codes“, wechseln Sie in den Reiter „Damage codes“ und klicken Sie in der Spalte „Action“ auf „Delete“. Es erscheint ein Bestätigungsdialog mit dem Titel „Delete Damage Code“ und der Frage „Are you sure you want to delete this Damage Code?“. Der Hinweis lautet, dass die Aktion nicht rückgängig gemacht werden kann und alle zugehörigen Details verloren gehen, und bittet um Bestätigung der Löschung.

Mit „Cancel“ wird der Dialog geschlossen, und Sie kehren zur Tabelle der Schadencodes zurück. Mit „Delete“ wird der Schadencode aus der Datenbank gelöscht, der Dialog geschlossen und die Tabelle erneut angezeigt; der gelöschte Schadencode ist dort nicht mehr enthalten. Nach erfolgreichem Löschen erscheint die Meldung „Damage Code was successfully deleted“. Schlägt das Löschen fehl, wird die Fehlermeldung „Damage Code could not be deleted.“ angezeigt. Diese Fehlermeldung enthält eine Schaltfläche „Close“ und bleibt so lange sichtbar, bis Sie sie schließen.