# Batch 842 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vega i155 im Bereich „Batch Job"**

Die Erzeugung der Vega i155 lässt sich jetzt im Bereich „Batch Job" steuern. Bisher lief sie nach einem fest eingestellten Zeitplan im Backend alle fünf Minuten, und der Zeitplan konnte weder geändert noch über die Oberfläche angestoßen werden. Nun können MPC- und Admin-Benutzer eigene Zeitpläne und weitere Aktionen selbst festlegen, ohne auf Backend-Entwickler angewiesen zu sein. Die Gestaltung folgt der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

Die Startseite des Batch-Job-Bereichs enthält oben einen Suchbereich. Dort können Sie nach dem Namen des Jobs suchen und im Dropdown einen verfügbaren Markt wählen. „Search for Job" startet die Suche, „Reset" leert die Suchfelder. Darunter zeigt die Ergebnisliste die Anzahl der angezeigten Datensätze, zum Beispiel „5 of 5". Über ein Dropdown stellen Sie 10, 20, 30, 40 oder 50 Datensätze pro Seite ein. Die Ergebnistabelle zeigt den Jobnamen („Vega i155"), den aktuellen Jobstatus, die Markt-ID aus Ländernummer und Marktcode nach ISO 3166 ALPHA-2 (zum Beispiel 20000DE), den Zeitpunkt des letzten Laufs und den Zeitpunkt des nächsten Laufs. Beide Zeitpunkte erscheinen im Format TT.MM.JJJJ HH:MM:SS UTC. Als Aktionen stehen „View", „Run Now", „Schedule" und „Disable" zur Verfügung. Die Option zum Aktivieren erscheint nur, wenn der Job den Status „Disabled" hat.

Mit „View" öffnet sich die Seite „Vega i155" mit den erzeugten i155-Dateien. Oben können Sie nach dem Dateinamen suchen und einen Zeitraum wählen: letzte 24 Stunden, letzte Woche, letzter Monat, aktuelles Jahr oder frei per Kalender. „Search for Files" startet die Suche, „Reset" leert die Suchfelder. Auch hier sehen Sie die Anzahl der Datensätze und können die Datensätze pro Seite wählen (10 bis 50). Die Tabelle nennt Dateiname, Größe und Änderungsdatum, also den Erstellungszeitpunkt im Format TT.MM.JJJJ HH:MM:SS UTC. Über die Schaltfläche „Download" laden Sie die Datei auf Ihren Computer herunter. Zu jeder i155 können zwei weitere Dateien heruntergeladen werden: die beim Erzeugen entstandene Logdatei und das Vega-Transferprotokoll. Das Protokoll steht erst zur Verfügung, nachdem Vega die i155 erfolgreich empfangen und verarbeitet hat.

„Run Now" startet den Job sofort, unabhängig von Jobstatus und Zeitplan. Dafür ist eine doppelte Bestätigung erforderlich. Mit „Schedule" öffnet sich ein Modal. Falls bereits Cron-Jobs definiert wurden, werden sie dort aufgelistet, und Sie können einen davon auswählen oder über „Add Cron Extension" einen neuen anlegen. Cron-Ausdrücke lassen sich hinzufügen und löschen. „Cancel" schließt das Modal ohne Speichern, „Save" speichert den definierten Cron-Ausdruck.

Beim Aktivieren und Deaktivieren eines Jobs ist jedes Mal eine Zwei-Faktor-Bestätigung nötig. Ein Job muss aktiviert sein, damit Sie ihn deaktivieren können. Neu hinzugefügte Jobs sind standardmäßig deaktiviert.

**Verbesserungen bei der i155-Erzeugung**

Für fehlerhafte Vertragsdaten gibt es eine neue Fehlerbehandlung. Ist das geplante Vertragsende früher als der Vertragsbeginn, wird für diesen Vertrag keine i155 erzeugt. Zuvor wurde ein solcher Vertrag trotzdem aktiviert und in die i155 übernommen, und die an die E-Mail-Adresse gesendete Logdatei war leer und enthielt keine Fehlermeldung. Jetzt wird der Fehler in der Logdatei mit der Meldung „Contract planned end date or Contract start date is not valid" vermerkt. Der Vertrag wird zudem markiert, damit er in die nächste erzeugte i155 aufgenommen wird.

Außerdem wird die Logdatei nach der Erzeugung der i155 nun mit Excel-Dateiendung an die E-Mail-Adresse der Market Operations gesendet. Bisher hatte die Datei keine Dateiendung.

Die Coverage-ID in der i155 ist jetzt eindeutig. Zuvor enthielt die Datei für alle Coverages einen einzigen fest hinterlegten Wert. Das führte in Vega zu Fehlern, verhinderte den Import von Verträgen und blockierte weitere Tests des Kostenmanagements. Die Coverage-ID steht in Satzart RC20, Position 66 bis 97, und ist numerisch mit 32 Stellen. Sie beginnt bei 00000000000000000000000000000001 und wird für jede neu vergebene Coverage-ID um 1 erhöht. Beim Erzeugen eines Vertrags erhält jeder Coverage Code des Produkts eine eigene ID, und zwar auch über Verträge hinweg. Bei der ersten Erzeugung erhalten zum Beispiel P001, P002 und P003 die IDs ...0001, ...0002 und ...0003. Ein zweiter, neu angelegter Vertrag erhält für seine Coverage Codes die IDs ...0004, ...0005 und ...0006. Ändern sich später der Status oder ein Attribut eines Vertrags, überträgt die i155 nur die Änderungen und behält die ursprünglich vergebenen Coverage-IDs bei.

**Entfernte Funktion**

Der Bereich „Contract Management" im Admin-Bereich wurde samt der Funktion „Generate i155" vollständig entfernt. Die Erzeugung der i155 steuern Sie nun ausschließlich über den Bereich „Batch Job".