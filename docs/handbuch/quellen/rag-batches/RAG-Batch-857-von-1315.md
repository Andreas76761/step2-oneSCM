# Batch 857 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeugbereich in den Vertragsdetails**

Im Bereich Contract Management können berechtigte Anwender (Power User) einen bestimmten Vertrag öffnen und dort den Abschnitt „Vehicle" (Fahrzeug) aufrufen. Voraussetzung ist, dass der Vertrag bereits erzeugt wurde und den Status „Aktiv" hat, da er sonst im Contract Management nicht sichtbar ist. Die Daten stammen aus oneSCM und stehen nach der Erstellung eines Vertrags zur Verfügung. Das Contract Management soll eine umfassende und benutzerfreundliche Oberfläche bieten, um wichtige Vertragsinformationen einzusehen und bei Bedarf Maßnahmen wie Aussetzen, Beenden, Stornieren oder Reaktivieren durchzuführen. Gestaltung und Darstellung folgen der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

Im Fahrzeugbereich werden folgende Informationen angezeigt: Marke, Sparte, Modell, Baumuster, Fahrgestellnummer, FIN, VIN, FRD, Kennzeichen und aktueller Kilometerstand.

Marke, Sparte und Modell werden anhand der FIN ermittelt. Ist im System noch keine Zuordnung vorhanden, wird die CePRO-Schnittstelle abgefragt. Bei der Marke dient dazu das Baumuster als Eingabe. Im MVP wird als Marke „Mercedes-Benz" und als Sparte „Passenger Car" angezeigt. Das Baumuster wird ebenfalls aus der FIN abgeleitet: Es entspricht den Zeichen 4 bis 10 der FIN. Liegt nur die VIN vor, wird zunächst über die VeDOC-Schnittstelle die zugehörige FIN abgerufen.

Als Fahrgestellnummer wird die im Vertrag gespeicherte VIN angezeigt, andernfalls die FIN. Bei der FIN wird zunächst geprüft, ob sie bei der Vertragserstellung zugewiesen wurde. Ist das nicht der Fall, sucht das System nach einer zur VIN des Vertrags passenden FIN. Wird auch dort keine gefunden, wird sie über VeDOC ermittelt und angezeigt. Für die VIN gilt das entsprechende Vorgehen in umgekehrter Richtung: Vorrang hat die bei der Vertragserstellung zugewiesene VIN, danach eine im System zur FIN hinterlegte VIN, zuletzt eine über VeDOC ermittelte.

FRD und Kennzeichen entsprechen den Werten, die bei der Vertragserstellung verwendet wurden. Beide Felder sind grundsätzlich editierbar, die Bearbeitungsfunktion steht jedoch erst nach dem MVP zur Verfügung. Wird eines dieser Felder geändert, wird die Schnittstelle i155 ausgelöst. Für alle editierbaren Felder ist eine Versionierung vorgesehen.

Der aktuelle Kilometerstand ist Teil des MVP. Beim Import der Schnittstelle i156 wird der Kilometerstand aus RC10, Position 180 bis 188, gespeichert. Angezeigt wird der zuletzt über i156 importierte Wert, ergänzt um die Einheit des Marktes: „Km" für Deutschland und „Mi" für Großbritannien. Wurde noch keine i156-Datei importiert, kann kein aktueller Kilometerstand angezeigt werden. Ebenso gibt es keine anzuzeigenden Informationen, wenn noch kein Vertrag erzeugt wurde.

**Historie: VEGA-Historie**

Im Contract Management steht außerdem der Bereich „History" (Historie) zur Verfügung. Dazu meldet sich der Anwender mit entsprechenden Berechtigungen an, öffnet den gewünschten Vertrag und ruft den Bereich „History" auf. Voraussetzung ist, dass der Vertrag bereits erstellt wurde, damit er ausgewählt werden kann und seine Daten angezeigt werden.

Im Bereich „History" wird die VEGA-Historie dargestellt. Sie enthält für jede Änderung folgende Angaben: das geänderte Objekt, das geänderte Attribut, den alten Wert, den neuen Wert, die Art der Änderung, das Datum der Änderung und den Bearbeiter. Auch hier folgen Gestaltung und Darstellung der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design. Die Datenquelle ist oneSCM, die Informationen stehen nach der Erstellung eines Vertrags zur Verfügung.