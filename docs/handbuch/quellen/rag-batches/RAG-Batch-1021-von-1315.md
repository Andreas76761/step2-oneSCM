# Batch 1021 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Statusverwaltung für Verträge vor der Aktivierung**

Im Bereich Contract Generation können Mitarbeitende der Market Operation Verträgen, die noch nicht aktiviert wurden, einen weiteren Status zuweisen. Das betrifft Verträge im Status „Created" (Erstellt) oder „Waiting for Activation" (Wartet auf Aktivierung), zum Beispiel wenn bei der Prüfung auffällige Ergebnisse (NOK-Checks) gemeldet wurden. Voraussetzung für die Nutzung dieser Funktion ist die Anmeldung als Market-Operation-Benutzer.

Die Vertragsdetails eines noch nicht aktivierten Vertrags lassen sich auf zwei Wegen aufrufen. Der erste Weg führt über die Startseite von Contract Generation: Dort wählen Sie den gesuchten Vertrag, indem Sie auf die Vertragsnummer klicken. Der zweite Weg führt über die Oberfläche der Market-Operation-Verifikationsprüfung (Verification Check UI), wo Sie ebenfalls auf die Vertragsnummer des gewünschten Vertrags klicken. In beiden Fällen öffnet sich die Vertragsübersicht (Contract Overview). Dort klicken Sie oben rechts in der Kopfzeile auf die Schaltfläche „Select" und wählen den nächsten Status aus.

**Vertrag aktivieren**

Wenn Sie die Option „ACTIVATE" wählen, erscheint ein Bestätigungs-Pop-up. Darin müssen Sie zwingend einen Grund für die Aktivierung angeben. Erst nach Eingabe des Grundes wird die Schaltfläche „Activate" unten rechts aktiv. Eine Toast-Meldung bestätigt anschließend, dass der Vertrag erfolgreich aktiviert wurde.

Mit der Aktivierung wechselt der Vertrag in den Status „ACTIVE". Das System informiert VEGA über die Statusänderung über die I155-Datei und übermittelt dabei den VEGA-Statuscode 001. Zusätzlich wird der Kunde per E-Mail über die Aktivierung benachrichtigt. Der Vertrag erscheint danach nicht mehr auf der Startseite von Contract Generation und auch nicht mehr in der Verifikationsprüfung der Market Operation. Stattdessen finden Sie ihn auf der Startseite des Vertragsmanagements (Contract Management).

**Vertrag stornieren**

Die Option „CANCEL" steht unter denselben Voraussetzungen zur Verfügung: Der Vertrag muss den Status „Created" oder „Waiting for Activation" haben. Nach der Auswahl erscheint ebenfalls ein Bestätigungs-Pop-up, in dem Sie einen Grund für die Stornierung angeben müssen. Sobald dieser eingegeben ist, wird die Schaltfläche „Cancel" unten rechts aktiv. Eine Toast-Meldung bestätigt die erfolgreiche Stornierung, und der Kunde wird per E-Mail über die Stornierung informiert.

Ein stornierter Vertrag verschwindet aus der Verifikationsprüfung der Market Operation, bleibt aber auf der Startseite von Contract Generation sichtbar. Beachten Sie, dass die Stornierung endgültig ist: Ein Vertrag im Status „Canceled" kann nicht mehr in einen anderen Status überführt werden.

**Hinweise zur Oberfläche**

Die Gestaltung der Oberfläche entspricht der Mercedes-Benz Workbench sowie dem vom Kunden freigegebenen UI-Design. Weitere Informationen zu den Vertragsstatus finden sich im Dokument „Contract Status Model" in der Projektdokumentation.