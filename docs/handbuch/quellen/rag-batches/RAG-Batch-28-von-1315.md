# Batch 28 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeuggruppen verwalten: Anlegen, Bearbeiten und Löschen**

In der Übersicht der Fahrzeuggruppen sehen Sie als MPC-Benutzer die Fahrzeuggruppen, die bereits für den Markt angelegt wurden, in dem Sie tätig sind. Jede Fahrzeuggruppe wird als Karte dargestellt. Über ein Untermenü der Übersicht können Sie neue Gruppen anlegen. Die einzelnen Karten ermöglichen es, eine Gruppe zu bearbeiten oder zu löschen. Die Oberfläche folgt dem Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Fahrzeuggruppe anlegen**

Wählen Sie im Untermenü der Übersicht den Eintrag „Create Vehicle Group“. Es öffnet sich ein Pop-up, in dem Sie einen Namen und Details der Fahrzeuggruppe eingeben. Der Gruppenname muss mindestens 5 und darf höchstens 25 Zeichen lang sein. Als Sonderzeichen sind nur „-“, „/“ und „+“ erlaubt. Das Feld für die Gruppendetails verlangt mindestens 5 und höchstens 100 Zeichen. Die Einschränkung auf bestimmte Sonderzeichen wurde für dieses Feld am 21.04.2023 aufgehoben. Werden die Vorgaben nicht eingehalten, erscheint unter dem jeweiligen Feld eine Fehlermeldung.

Die Schaltfläche „Create“ ist zunächst deaktiviert. Sie wird erst aktiv, sobald sowohl der Gruppenname als auch die Gruppendetails ausgefüllt sind. Mit einem Klick darauf wird die Fahrzeuggruppe angelegt und gespeichert. Anschließend erscheint eine Erfolgsmeldung („Vehicle Group "X" was successfully created“), wobei „X“ für den Namen der Gruppe steht. Diese Meldung bleibt 15 Sekunden sichtbar und verschwindet dann von selbst. Sie werden zur Übersicht weitergeleitet, wo die neue Gruppe als Karte angezeigt wird.

Lässt sich die Gruppe nicht anlegen, etwa aufgrund eines Systemfehlers, erscheint die Fehlermeldung „Vehicle Group "X" could not be created.“ Das Pop-up schließt sich, die eingegebenen Informationen gehen verloren, und Sie gelangen zurück zur Übersicht. Die Fehlermeldung verfügt über eine Schaltfläche „Close“ und bleibt so lange sichtbar, bis Sie sie schließen.

Der Name einer Fahrzeuggruppe muss im Markt des MPC-Benutzers eindeutig sein. Wenn Sie einen bereits vergebenen Namen verwenden, erscheinen die Hinweise „Please enter a valid vehicle name“ sowie „Vehicle Group X already used“. Geben Sie in diesem Fall einen anderen Namen ein. Mit „Cancel“ schließen Sie das Pop-up jederzeit; alle bis dahin eingegebenen Informationen gehen dabei verloren.

**Fahrzeuggruppe bearbeiten**

Die Bearbeitung starten Sie direkt auf der Karte der jeweiligen Fahrzeuggruppe. Es öffnet sich ein Pop-up, in dem Sie den Namen und die Details der Gruppe ändern können. Mit „Update“ werden die Änderungen gespeichert, mit „Cancel“ wird das Pop-up geschlossen und alle bearbeiteten Angaben werden verworfen. Nach erfolgreicher Änderung erhalten Sie die Meldung „Vehicle Group "X" was successfully updated“ beziehungsweise „Vehicle group details was successfully updated“. Kann die Änderung nicht durchgeführt werden, lautet die Meldung „Vehicle Group "X" was not updated“ beziehungsweise „Vehicle group details was not updated“.

**Fahrzeuggruppe löschen**

Auch das Löschen starten Sie über die Karte der Fahrzeuggruppe. Es öffnet sich ein Pop-up, das zur Bestätigung auffordert: „Are you sure you want to delete this item? This action cannot be undone, and you will lose the group with all the details associated with it. The Baumusters will be removed but not deleted. Please confirm that you would like to proceed with the deletion.“ Die Gruppe und alle zugehörigen Details gehen also unwiderruflich verloren, die zugeordneten Baumuster werden aus der Gruppe entfernt, aber nicht gelöscht.

Mit der Schaltfläche „Delete“ schließen Sie den Löschvorgang ab. Daraufhin erhalten Sie die Meldung „Vehicle Group "X" was successfully deleted“. Schlägt das Löschen fehl, erscheint die Meldung „Vehicle Group "X" was not deleted“. Mit „Cancel“ brechen Sie den Vorgang ab.