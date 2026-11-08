# Batch 1204 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 30 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Branchencodes (Industry Codes)**

Beim Anlegen eines Branchencodes (Industry Code) wird derzeit geprüft, ob die Auswahl der Märkte korrekt funktioniert. Dazu gehört, dass die Option für die aktuellen Märkte vorausgewählt ist und alle Märkte angehakt sind. Außerdem wird kontrolliert, dass die ausgewählten Märkte auf der linken Seite richtig angezeigt werden und dass die Auswahl des Standardmarkts nach der Änderung individueller Märkte alle Märkte zurücksetzt. In Schritt 1 des Assistenten werden Fehlermeldungen bei ungültigen oder leeren Pflichtfeldern geprüft. Ebenso wird getestet, dass kein Branchencode mit einem bereits vorhandenen Namen angelegt werden kann.

Bestehende Branchencodes lassen sich über das Aktionsmenü bearbeiten. Mit „Bearbeiten“ gelangen Anwender zum ersten Schritt des Erstellungsassistenten. Der Branchencode selbst ist nicht änderbar, der Name der Branche kann jedoch angepasst werden. Im zweiten Schritt können Märkte hinzugefügt oder entfernt werden. Zum Speichern der Änderungen muss der letzte Schritt des Prozesses erreicht werden. Bei Erfolg erscheint die Meldung „[Industry Code] was successfully updated“, bei einem Fehler „Failed to update [Industry Code] successfully“. Branchencodes, die Produkten zugeordnet sind, können deaktiviert werden. Dabei verschwinden sie aus der Auflistung (Soft Delete), damit sie in einer späteren Ausbaustufe gegebenenfalls in der Oberfläche eingesehen werden können. Nicht verwendete Branchencodes können dagegen endgültig gelöscht werden; die Aktion heißt dann „Löschen“. Beide Aktionen erfordern eine Bestätigung. Beim Löschen weist der Dialog darauf hin, dass die Aktion nicht rückgängig gemacht werden kann und der Branchencode samt aller zugehörigen Details verloren geht. Beim Deaktivieren wird erklärt, dass der Branchencode für neue Produkte nicht mehr zur Verfügung steht. Diese Aktionen sind für Nutzer mit der Rolle HQPM vorgesehen.

**Preise für technische Optionen**

Für technische Optionen (TO) wird geprüft, dass alle angelegten technischen Optionen angezeigt werden und dass die Daten zur angezeigten TO-Gruppe korrekt sind. Beim Erstellen einer Preisdefinition für eine TO wird kontrolliert, dass der Preis angewendet wird. Die Schaltfläche „Erstellen“ bleibt deaktiviert, solange das Preisfeld ungültige Daten enthält. Über „Abbrechen“ gelangen Anwender zurück zur TO-Seite, wobei die eingegebenen Daten verworfen werden.

**Übersicht der Gruppen technischer Optionen**

In der Übersicht der TO-Gruppen wurden folgende Funktionen geprüft: Suche nach vorhandenen Gruppennamen und Ausstattungscodes (Equipment Codes) mit Anzeige in der Tabelle, Zurücksetzen der Suche, Sortierung der Spalten sowie die Anzahl der Einträge pro Seite. Beschreibung und Ausstattungscodes lassen sich bearbeiten. Eine TO-Gruppe kann deaktiviert werden, und eine nicht verwendete TO-Gruppe kann gelöscht werden.

**Kampagnen verwalten – neuer Rabatttyp**

Beim Anlegen einer Kampagne mit dem neuen Rabatttyp wird getestet, dass in Schritt 2 nur veröffentlichte Produkte mit gültigen Clustern angezeigt werden. Eine Kampagne mit gültigen Daten muss sich erfolgreich erstellen lassen. Wird die Matrix mit ungültigen Daten ausgefüllt, darf der Anwender nicht fortfahren können. Außerdem wird geprüft, dass die Augen-Schaltfläche die Anfangswerte und, sofern vorhanden, den Rabatt anzeigt.

**Produktverwaltung**

Bei den Verbesserungen der Produktverwaltung wird verifiziert, dass im ersten Schritt die Daten der gewählten Produktvorlage (Blueprint) korrekt angezeigt werden und dass die Deckungen (Coverages) der Vorlage im dritten und letzten Schritt der Produkterstellung erscheinen.

**Fahrzeugverwaltung**

Die vom DSB empfangene Laufleistung wurde bisher nicht in der Antwort zu Produkten und Preisen an die Vertragserstellung übermittelt, wenn für das Fahrzeug eine Fahrgestellnummer vorhanden ist. Künftig wird die Laufleistung aus DSB oder MiC zusammen mit der Angabe der Datenquelle (DSB oder MiC) übermittelt. Diese Änderung befindet sich derzeit im BAT-Test.

**Weitere Tests**

Für das MPC-Dashboard und die Seite „Preise anzeigen“ der Contract Calculation stehen manuelle Testausführungen noch aus.