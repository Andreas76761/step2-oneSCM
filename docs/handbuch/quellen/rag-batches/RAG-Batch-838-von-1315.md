# Batch 838 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Änderungen im Bereich Contract Management**

**Neugestaltung des Kommunikations-Tabs in der Vertragsübersicht**

Der Tab „Communication“ in der Vertragsübersicht wurde überarbeitet. Bisher wurden Dokumente (links) und Benachrichtigungen (rechts) in einer gemeinsamen Ansicht dargestellt. Da der Funktionsumfang wächst und weitere Details auf derselben Seite benötigt werden, ist die Ansicht nun in zwei Unterregister aufgeteilt: „Documents“ und „Notifications“. Rechts oben, auf Höhe der Registernamen, steht die Schaltfläche „Send Email“ zur Verfügung.

Die Ansicht erreichen Sie, indem Sie einen Vertrag in der Vertragserstellung (Contract Generation) oder in der Vertragsverwaltung (Contract Management) öffnen und anschließend den Tab „Communication“ aufrufen. Voraussetzung ist, dass der Vertrag in einem dieser Module vorhanden ist und sich mindestens im Status „Created“ oder einem späteren Status befindet.

Im Unterregister „Documents“ werden alle für den Vertrag erzeugten Dokumente in drei Spalten angezeigt. Die Spalte „Document Name“ nennt den Namen des Dokuments. Die Spalte „Time“ zeigt den Erstellungszeitpunkt im Format dd.mm.yyyy hh:mm:ss in UTC. In der Spalte „Actions“ steht eine Download-Option mit Symbol und Beschriftung „Download“ bereit. Die Liste zeigt je Seite zehn Dokumente an. Zusätzlich wird die Gesamtzahl ausgegeben, zum Beispiel „Displaying 10 of 20 documents“.

Das Unterregister „Notifications“ enthält vier Spalten. Die Spalte „Document Name“ listet alle E-Mails auf, die an den Kunden gesendet wurden, etwa Aktivierungs-E-Mails, DSS-E-Mails oder Nachrichten, die über die Schaltfläche „Send Email“ versendet wurden. So wird die gesamte Kommunikation mit dem Kunden nachvollziehbar. Die Spalte „Time“ zeigt den Versandzeitpunkt im selben Format in UTC. Die Spalte „Status“ gibt den Zustand der E-Mail an. Beispiele sind „Sent“ bei erfolgreichem Versand, „Fail“ bei fehlgeschlagenem Versand und „Expired“, wenn eine DSS-E-Mail nicht geöffnet wurde und die Signaturfrist abgelaufen ist. Die Spalte „Actions“ zeigt ein Drei-Punkte-Menü, dessen Einträge vom Status der E-Mail abhängen.

Bei E-Mails mit dem Status „Sent“ steht die Aktion „Download“ zur Verfügung. Damit wird die an den Kunden gesendete E-Mail heruntergeladen. Bei E-Mails mit dem Status „Failed“ oder „Expired“ stehen „Re-send“ und „Download“ zur Auswahl. Wählen Sie „Re-send“, öffnet sich ein neues Fenster. Darin sind Vorname, Nachname, E-Mail-Adresse und Telefonnummer des Kunden aus dem Vertrag bereits vorausgefüllt. Mit „Cancel“ schließen Sie das Fenster und kehren zum Kommunikations-Tab zurück. Mit „Send Email“ wird die fehlgeschlagene E-Mail erneut an den Kunden gesendet. Auch die Liste der Benachrichtigungen wird mit zehn Einträgen pro Seite und dem Hinweis auf die Gesamtzahl dargestellt.

**Vertriebspartner-ID (GSSN+) im Produkt-Tab**

Das Feld „Sales Partner ID (GSSN+)“ im Produkt-Tab der Vertragsverwaltung war bislang fest vorgegeben. Nun werden bei der Vertragserstellung zusammen mit den Vertragsdaten auch die Benutzer-ID bzw. die GSSN+-Outlet-ID gespeichert. Im Produkt-Tab wird die GSSN+-Outlet-ID des Benutzers angezeigt, der den Vertrag angelegt hat.

**Einschränkungen für Händler und MPC**

Die Zahlungsintervalle eines Vertrags können von Benutzern mit der Rolle „Dealer“ sowie der Rolle „MPC“ nicht mehr bearbeitet werden. Ebenso können diese beiden Rollen Verträge nicht mehr aussetzen (Suspend), reaktivieren (Reactivate) oder beenden (Terminate).

**Behobene Fehler und weitere Anpassungen**

Es wurde ein Problem behoben, bei dem Anfragen über Swagger nicht korrekt ausgeführt werden konnten. Ebenfalls korrigiert wurde ein Fehler beim Drucken von Vertragsdokumenten, bei dem die Meldung „query did not return a unique result: 2“ erschien. Darüber hinaus wurde im Kommunikationsbereich das Problem behoben, dass ein Vertrag kein zweites Mal gedruckt werden konnte. Zudem wurden Anpassungen zu den externen Kundeninformationen für Release Candidate 10 (Positionen 71 bis 400) vorgenommen.