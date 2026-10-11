# Batch 1282 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 18 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation: Produkt- und Preisverwaltung**

Im Bereich Contract Calculation wurden zahlreiche Verbesserungen und Fehlerbehebungen an der Produkt- und Preisverwaltung umgesetzt.

**Produkte anlegen**

Beim Anlegen eines Produkts im mehrstufigen Assistenten bleiben die Felder in Schritt 4 (Preismatrix-Definition) nun leer, wenn Sie zuvor zu Schritt 3 zurückgegangen sind und erneut auf „Weiter“ geklickt haben. Zuvor wurden einzelne Felder fälschlich mit „NaN“ vorbelegt. Außerdem merkt sich der Assistent beim Verlassen der Seite keine bereits eingegebenen Informationen mehr. Wenn Sie zu einem anderen Bereich wie der Vertragserstellung oder dem Admin-Bereich wechseln und danach erneut auf „Produkt anlegen“ klicken, beginnt der Vorgang von vorn. Auch die Rückgabe der Produktbild-URL durch die Produktverwaltung wurde korrigiert, sodass Produktbilder in den betroffenen Umgebungen korrekt angezeigt werden.

**Fahrzeugvoraussetzungen**

Es wurde ein Fehler in der Logik behoben, die prüft, ob die Grenzwerte innerhalb der Produktwerte liegen. Dadurch ließen sich Fahrzeugvoraussetzungen teils nicht speichern, und der Assistent konnte nicht fortgesetzt werden, obwohl das Produktlimit korrekt gesetzt war.

**Preisversionen**

Für Produkte im Status „Veröffentlicht“ können nun neue Preisversionen angelegt werden. Für eine Preisversion mit einem Startdatum in der Zukunft lassen sich dabei auch Cluster erstellen. Für Produkte im Status „Gelöscht“ ist das Anlegen neuer Preisversionen nicht mehr möglich. Preise können grundsätzlich nur für Produkte im Status „Erstellt“, „Bereit“ oder „Unveröffentlicht“ angelegt werden. Auf der Seite zum Anlegen einer Preisversion lautet die Beschriftung des ersten Pflichtfelds jetzt einheitlich „Version Name“. Das zweite Pflichtfeld ist das Startdatum.

Die Tabelle der Preisversionen wurde ebenfalls überarbeitet. Wenn Sie die Produktauswahl ändern, aktualisiert sich die Liste der Preisversionen. Gibt es keine aktuell gültige Preisversion, wird die erste zukünftige Version in der Tabelle hervorgehoben. Ist noch keine Preisversion vorhanden, tritt kein Konsolenfehler mehr auf. Wenn Sie die Option „Abgelaufene Versionen anzeigen“ aktivieren und zur Produktübersicht zurückkehren, werden abgelaufene Versionen beim erneuten Öffnen der Preisversionen nicht mehr automatisch angezeigt. Zudem wurde die Abfrage abgelaufener Preise im Backend korrigiert.

Beim Löschen der ersten zukünftigen Preisversion in der Tabelle wird der Dialog „Preisversion löschen“ jetzt korrekt angezeigt.

**Cluster**

Das Anlegen eines Clusters mit nur einem Preispunkt ist wieder möglich. Beim Löschen eines Clusters wird die Tabelle der Preisversionen aktualisiert. Der Fehler, der auftrat, wenn nur ein einzelner vorhandener Cluster aus einer Preisversion gelöscht wurde, ist behoben. Zusätzlich wurden Constraints und Validierungen im Backend überarbeitet.

**Übersichtsseite „Produkte und Preise verwalten“**

Wenn Sie in der Paginierung eine höhere Anzahl an Einträgen pro Seite wählen, erscheint keine Fehlermeldung mehr. Stattdessen wird automatisch die letzte Seite für die gewählte Anzahl angezeigt.