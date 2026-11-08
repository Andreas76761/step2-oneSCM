# Batch 261 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Batch-Job-Verwaltung: Dateien eines Batch-Jobs aus S3 suchen**

Administratoren können nach Dateien suchen, die ein bestimmter Batch-Job erzeugt oder verwendet hat, und diese anschließend herunterladen. Dazu wählen sie in der Job-Liste den gewünschten Job aus. Ein Klick auf den Namen des Batch-Jobs öffnet eine neue Seite. Diese zeigt ausschließlich die herunterladbaren Dateien, die zum ausgewählten Batch-Job gehören.

Im Ausgangszustand der Seite „Dateisuche" sind alle Filterfelder leer, und im Ergebnisbereich wird noch keine Datei angezeigt. Im Filterbereich kann nach dem Dateinamen und nach einem Zeitraum gesucht werden. Die Suche nach dem Dateinamen arbeitet nach dem Prinzip „enthält". Der Zeitraum wird in einem Dropdown-Feld mit Einfachauswahl festgelegt. Zur Auswahl stehen „Today", „Last week", „Last month" und „Last 3 months". Änderungen in den Filterfeldern wirken sich nicht automatisch auf die Suchergebnisse aus. Erst ein Klick auf die Schaltfläche „Search for Files" zeigt die Ergebnisse passend zu den gewählten Filtern an. Mit der Schaltfläche „Reset" werden alle Filterfelder in den Ausgangszustand zurückgesetzt, also geleert. Dabei werden auch die Ergebnisse aktualisiert.

Der Ergebnisbereich zeigt den Namen des ausgewählten Batch-Jobs an. Darunter listet eine Tabelle die zugehörigen Dateien aus S3 auf. Die Tabelle enthält eine Spalte mit Kontrollkästchen, den Dateinamen, die Größe und das Datum, wie es in S3 hinterlegt ist. Das Kontrollkästchen in der Kopfzeile markiert alle auf der Seite aufgelisteten Dateien, wenn es aktiviert wird. Wird es deaktiviert, wird die Markierung aller Dateien auf der Seite aufgehoben.

Übersteigt die Zahl der Treffer die maximale Anzahl an Einträgen pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, und Administratoren können zwischen den Seiten navigieren. Standardmäßig werden bis zu 10 Datensätze pro Seite angezeigt. Über ein Dropdown-Feld lässt sich die Anzahl auf 10, 20, 30, 40 oder 50 ändern. Der zuletzt gewählte Wert wird nicht gespeichert. Nach dem Aktualisieren der Seite gelten wieder 10 Datensätze pro Seite.

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Batch-Job-Verwaltung: Einen Job aktivieren**

Administratoren können einen Job aktivieren, damit er aktiv wird und zum geplanten Datum und zur geplanten Uhrzeit ausgeführt wird. Dazu suchen sie in der Job-Liste nach einem Job mit dem Status „Disabled" und wählen in der Spalte „Action" die Option „Enable". Diese Option steht nur bei Jobs mit dem Status „Disabled" zur Verfügung.

Nach der Auswahl erscheint ein Bestätigungsdialog mit dem Titel „Enable". Der Text lautet: „Are you sure you want to Enable this job? This action will make the job active and will run at the scheduled date and time. Please confirm that you would like to Enable the job."

Der Dialog bietet zwei Schaltflächen. Mit „Cancel" wird der Vorgang abgebrochen. Der Dialog schließt sich, und man gelangt zurück zur Job-Tabelle, ohne dass der Job verändert wird. Mit „Enable" wird der Status des Jobs auf „Enabled" gesetzt. Ein Job mit diesem Status läuft zum geplanten Datum und zur geplanten Uhrzeit. Auch in diesem Fall schließt sich der Dialog, und man gelangt zurück zur Batch-Job-Tabelle.

Auch hier entspricht die Oberfläche der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.