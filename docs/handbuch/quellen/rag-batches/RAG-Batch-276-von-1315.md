# Batch 276 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Batch-Job-Verwaltung im Bereich Revenue Management**

Administratoren können in der Batch-Job-Verwaltung die Dateien eines bestimmten Jobs durchsuchen, den Ausführungszeitplan eines Jobs festlegen und deaktivierte Jobs wieder aktivieren. Alle drei Funktionen werden über die Jobliste aufgerufen. Gestaltung und Darstellung entsprechen der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Dateien eines Jobs suchen**

Um erzeugte oder verwendete Dateien eines Jobs zu finden und herunterzuladen, wählen Administratoren den gewünschten Job in der Jobliste aus. Ein Klick auf den Namen des Batch-Jobs öffnet eine neue Seite. Sie zeigt ausschließlich die herunterladbaren Dateien, die zu diesem Job gehören.

Die Seite besteht aus einem Filterbereich und einem Ergebnisbereich. Im Ausgangszustand sind alle Filterfelder leer, und es werden noch keine Dateien angezeigt. Gefiltert werden kann nach dem Dateinamen, wobei die Suche nach dem Prinzip „enthält“ arbeitet, sowie nach einem Zeitraum. Der Zeitraum wird in einem Dropdown mit Einfachauswahl gewählt. Zur Verfügung stehen „Today“, „Last week“, „Last month“ und „Last 3 months“. Änderungen an den Filtern wirken sich nicht automatisch auf die Ergebnisse aus. Erst ein Klick auf die Schaltfläche „Search for Files“ zeigt die Dateien an, die der gewählte Job in S3 erzeugt hat und die zu den gewählten Filtern passen. Die Schaltfläche „Reset“ setzt alle Filter auf den Ausgangszustand zurück, also auf leere Felder, und aktualisiert dabei auch die Ergebnisse.

Im Ergebnisbereich steht der Name des ausgewählten Batch-Jobs. Darunter listet eine Tabelle die Dateien des Jobs mit den Spalten Kontrollkästchen, Dateiname, Größe und Datum. Der Dateiname entspricht dem Namen der Datei in S3, das Datum dem in S3 angegebenen Datum. Das Kontrollkästchen in der Kopfzeile markiert alle auf der Seite aufgeführten Dateien. Wird es wieder abgewählt, werden auch alle Markierungen aufgehoben.

Übersteigt die Zahl der Treffer die maximale Anzahl pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, zwischen denen Administratoren wechseln können. Standardmäßig werden 10 Einträge pro Seite angezeigt. Über ein Dropdown lässt sich dieser Wert auf 10, 20, 30, 40 oder 50 ändern. Die Auswahl wird nicht gespeichert und nach dem Neuladen der Seite auf 10 zurückgesetzt.

**Zeitplan eines Jobs konfigurieren**

Administratoren legen fest, wann ein Batch-Job laufen soll. Dazu suchen sie den Job in der Jobliste und wählen in der Spalte „Action“ die Option „Schedule“. Diese Option steht für alle Jobs zur Verfügung, unabhängig davon, ob sie aktiviert (Enabled) oder deaktiviert (Disabled) sind.

Es öffnet sich ein Popup mit dem Titel „Schedule“. Wurde für den Job noch kein Ausführungsmuster definiert, erscheint die Meldung „No cron expression to display“. Besitzt der Job bereits Cron-Ausdrücke, zeigt das Popup die gespeicherten Angaben an.

Mit „Add Cron Expression“ wird der Liste eine neue Zeile hinzugefügt. Sie enthält ein Textfeld für den Cron-Ausdruck, in dem der Ausdruck festgelegt wird, nach dem der Job läuft. Das Feld ist ein Pflichtfeld und akzeptiert nur Cron-Ausdrücke. Als Platzhalter dient „Cron Expression #1“, „Cron Expression #2“ usw. Die Nummer gibt die Position in der Liste an, die nicht umsortiert werden kann. Ist der eingegebene Wert kein gültiger Cron-Ausdruck, erscheint die Fehlermeldung „Please enter a valid cron expression“. Mit der Schaltfläche zum Löschen wird ein Cron-Ausdruck entfernt. „Add Cron Expression“ ist deaktiviert, solange die vorherigen Ausdrücke nicht gültig sind. Es können höchstens 10 Cron-Ausdrücke angelegt werden. Ist die Grenze erreicht, erscheint der Hinweis „Maximum cron expressions limit has been reached“.

Die Schaltfläche „Save“ ist deaktiviert, solange die Liste leer ist oder mindestens ein Ausdruck ungültig ist. Beim Speichern wird das Muster übernommen, und der Job läuft künftig nach den neu gespeicherten Mustern. Die Reihenfolge der Ausdrücke hat keinen Einfluss auf den nächsten Ausführungszeitpunkt.

Hat der Administrator im Formular nichts geändert, schließt „Cancel“ das Popup und führt zurück zur Jobliste. Wurden Angaben geändert, erscheint beim Klick auf „Cancel“ zunächst ein Bestätigungs-Popup. Dort schließt „Cancel“ das Popup und belässt den Administrator auf der Schedule-Seite. „Proceed“ schließt das Popup, verwirft die Änderungen und beendet die Konfiguration.

Nach dem Speichern erscheint bei Erfolg die Toast-Meldung „Schedule for <Job_Name> was successfully updated“. Kann der Zeitplan nicht gespeichert werden, wird die Fehlermeldung „Schedule for <Job_Name> could not be updated.“ angezeigt. Diese Fehlermeldung enthält eine Schaltfläche „Close“ und bleibt sichtbar, bis der Benutzer sie schließt.

**Einen Job aktivieren**

Mit der Aktivierung wird ein Job aktiv und läuft zum geplanten Datum und zur geplanten Uhrzeit. Dazu suchen Administratoren in der Jobliste einen Job mit dem Status „Disabled“ und wählen in der Spalte „Action“ die Option „Enable“. Diese Option steht ausschließlich für Jobs mit dem Status „Disabled“ zur Verfügung.

Es erscheint ein Bestätigungs-Popup mit dem Titel „Enable“. Der Text lautet: „Are you sure you want to Enable this job? This action will make the job active and will run at the scheduled date and time. Please confirm that you would like to Enable the job.“ Mit „Cancel“ wird das Popup geschlossen, und der Administrator kehrt zur Jobtabelle zurück. Mit „Enable“ wird der Status des Jobs auf „Enabled“ gesetzt, das Popup geschlossen und die Batch-Job-Tabelle angezeigt. Ein Job mit dem Status „Enabled“ läuft zum geplanten Datum und zur geplanten Uhrzeit.