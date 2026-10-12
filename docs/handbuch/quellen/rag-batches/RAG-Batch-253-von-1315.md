# Batch 253 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Änderungen**

**Steuerarten bearbeiten (Tax Management)**
Administratoren können jetzt eine bestehende Steuerart bearbeiten, um fehlerhafte Angaben zu korrigieren. Dazu öffnen Sie die Seite „Tax Management“ und wechseln auf den Reiter „Tax Type“. In der Spalte „Action“ der gewünschten Steuerart wählen Sie die drei Punkte und anschließend „Edit“. Es öffnet sich eine Bearbeitungsseite mit denselben Feldern wie beim Anlegen, die bereits mit den vorhandenen Informationen befüllt sind.

Das Feld „Name“ ist ein Pflichtfeld und muss zwischen 3 und 50 Zeichen lang sein. Sonderzeichen sind erlaubt. Derselbe Name darf nicht für mehrere Steuerarten vergeben werden; in diesem Fall erscheint eine Fehlermeldung. Die Felder „Tax Category“ (sie zeigt an, ob sich eine Steuer auf den Kunden oder auf ein Produkt bezieht), „Customer Tax Classification“ und „Customer Tax Type“ sind nicht bearbeitbar.

Wenn Sie die Bearbeitung mit „Cancel“ abbrechen und nichts geändert haben, wird die Bearbeitungsseite geschlossen und Sie gelangen zurück zur Übersicht der Steuerarten. Wurde mindestens ein Feld geändert, erscheint ein Hinweisfenster mit dem Titel „You have unsaved changes that will be lost“ und der Meldung „The changes you have made will be lost. Are you sure you want to proceed?“. Mit „Proceed“ wird das Fenster geschlossen, die Bearbeitungsansicht verlassen und alle Änderungen werden verworfen. Mit „Cancel“ wird nur das Fenster geschlossen, und die Bearbeitung bleibt geöffnet. Diese Meldungen entsprechen denen beim Anlegen einer Steuerart.

Die Schaltfläche „Update“ ist nur aktiv, wenn alle Felder die Validierungsregeln erfüllen. Beim Klick werden die Änderungen gespeichert und Sie gelangen zur Übersicht der Steuerarten zurück. Eine Erfolgsmeldung wird als Toast-Nachricht angezeigt. Schlägt der Vorgang fehl, erscheint eine Fehlermeldung als Toast, die eine Schaltfläche „Close“ besitzt und so lange sichtbar bleibt, bis der Administrator sie schließt. Die Oberfläche folgt der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Batch Jobs Management: „Run Now“**
Bisher konnte ein Batch-Job-Lauf auch dann gestartet werden, wenn der Job in einer anderen Sitzung deaktiviert worden war. Dieses Verhalten wurde behoben.

**NEMESIS: Verlängerung von Verträgen signalisieren**
Wird ein Vertrag verlängert, fordert NEMESIS ein Contract-Master-Data-Event an, in dem das Feld „ExtensionReductionIndicator“ befüllt ist. Bei einer kurzfristigen Verlängerung (Short Term Extension) wird dabei der Wert „S“ übermittelt.

**NEMESIS: Revenue Event erst nach FI-System-Buchung senden**
Bisher wurden Revenue Events an NEMESIS gesendet, sobald sie erstellt wurden, unabhängig davon, ob die Übertragung an das FI-System erfolgreich war. Zur besseren Nachvollziehbarkeit und um Fehler bei Korrekturen zu vermeiden, wird das Revenue Event nun erst erzeugt, nachdem oneSCM die Rückmeldung des FI-Systems zur Rechnung erhalten hat. Voraussetzung ist, dass die Rückmeldung „FI-Document Created“ oder einen späteren Status lautet, etwa „Paid On-Time“, „Paid overdue“ oder „Dunning Level 1“.

Wird in oneSCM eine geplante Rechnung erstellt, passieren zwei Dinge: Die Rechnung wird an das FI-System übergeben, um die Buchung und die Kundenrechnung zu erzeugen, und das Revenue Event informiert NEMESIS über einen neu generierten Umsatz zum Vertrag.

In den Markteinstellungen steht dafür das Mehrfachauswahl-Dropdown „NEMESIS Revenue Event Generation“ zur Verfügung. Es enthält alle Rechnungsstatus, zum Beispiel „Planned“, „Created“ und „Accepted“. Neben dem Dropdown befindet sich ein Info-Symbol, das beim Überfahren mit der Maus den Text „Select status for NEMESIS Revenue Event generation“ anzeigt.

**Hinweis zu einer nicht umgesetzten Anforderung**
Die Anforderung, Zahlungsbeginn und Zahlungsende an NEMESIS zu senden, wurde abgebrochen und ist nicht Teil dieses Releases.