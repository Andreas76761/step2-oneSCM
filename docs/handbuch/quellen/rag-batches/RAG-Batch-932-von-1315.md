# Batch 932 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Hinweis:** Das zugrunde liegende Ticket hat den Status „Cancelled". Die beschriebene Funktion wurde daher nicht umgesetzt oder freigegeben. Der folgende Text gibt den geplanten Umfang wieder und sollte nur dann ins Benutzerhandbuch übernommen werden, wenn die Funktion tatsächlich ausgeliefert wird.

**Entwurf für das Benutzerhandbuch**

**Fortsetzen der Massenerstellung über die Seite „Mass Vehicles Draft Page"**

Wenn bei der Vertragserstellung mehrere Fahrzeuge hinzugefügt und bestätigt werden, werden die Daten zur Fahrzeugvalidierung an Stream 1 gesendet. Die Validierung dauert einige Minuten. Bisher wird in dieser Zeit eine Meldung angezeigt, dass die Validierung läuft, und weitere Aufgaben können nicht ausgeführt werden. Vorgesehen war, dass Anwender (KAM, Dealer, MO und MPC) den Ablauf währenddessen verlassen, andere Aufgaben erledigen und nach Abschluss der Validierung benachrichtigt werden. Hat ein Anwender die Benachrichtigung verpasst oder gelöscht, sollte er den Vorgang trotzdem fortsetzen können. Das spart Zeit und vermeidet mehrfache Anfragen für dasselbe Fahrzeug.

Voraussetzung ist, dass Produkte und Sonderkonfigurationen für Commercial-Fleet-Kunden verfügbar sind. Die Massenerstellung muss für die Abläufe Fahrgestellnummer/VIN/FIN mit verfügbarem FRD, Build to Order und Build to Stock zur Verfügung stehen. Der Baumaster-Ablauf wird nicht unterstützt.

Im Menü sollte unter „Contract Generation" ein neuer Eintrag „Mass Vehicles Draft Page" ergänzt werden. Sobald mehrere Fahrzeuge hinzugefügt und zur Validierung an Stream 1 gesendet wurden, wird für diese Anfrage automatisch eine Mass-Draft-Nummer vergeben. Zu dieser Anfrage entsteht auf der Seite ein Eintrag, der die zunächst gesendeten Fahrzeugdaten sichert.

Die Seite enthält oben eine Suche. Gefiltert werden kann nach Mass-Draft-Nummer (Texteingabe), Identifier (Texteingabe), Produkt (Dropdown) und Übermittlungsdatum (Datumsauswahl), also dem Datum, an dem die Fahrzeuge an Stream 1 gesendet wurden. Unter „More Filters" lässt sich zusätzlich nach Identifier-Typ, nach dem Einreicher der Anfrage und nach der Anzahl der Fahrzeuge filtern. Die Schaltfläche „Search" startet die Suche, über „X" werden alle Eingaben und Filter zurückgesetzt.

Die Ergebnistabelle zeigt die Anzahl der Treffer im Verhältnis zur Gesamtzahl. Über ein Dropdown wählen Sie, wie viele Ergebnisse pro Seite angezeigt werden, und die Ergebnisse sind paginiert. Die Tabelle enthält folgende Spalten:

- Die Mass-Draft-Nummer wird als Hyperlink dargestellt.
- Der Identifier-Typ und der Identifier stammen vom Primärfahrzeug, mit dem die Massenanfrage gestartet wurde.
- Die Spalte „Product" zeigt das Produkt, für das die Anfrage erstellt wurde.
- Die Anzahl der Fahrzeuge entspricht dem aktuellen Stand der Anfrage. Wurden zunächst 99 Fahrzeuge gesendet und löscht der Anwender nach der Validierung einige Datensätze und sendet die Daten erneut, wird die Anzahl entsprechend angepasst.
- „Submitted On" zeigt das Übermittlungsdatum im Format TT.MM.JJJJ zusammen mit der User-ID des Absenders. Ändert der Anwender nach der ersten Antwort die Fahrzeugliste und sendet sie erneut an Stream 1, wird das Datum aktualisiert.

**Wiedereinstieg in den Ablauf**

Der Zugang erfolgt immer über Contract Generation, dann Mass Draft Page. Dort suchen Sie die passende Mass-Draft-Nummer und klicken auf den Hyperlink. Je nach Bearbeitungsstand gelangen Sie an unterschiedliche Stellen:

- Wurde die Benachrichtigung über die abgeschlossene Validierung versehentlich geschlossen oder verworfen, öffnet sich die Seite „Add Multiple Vehicles", und Sie können dort fortfahren.
- Läuft die Validierung noch, öffnet sich ebenfalls die Seite „Add Multiple Vehicles". Die Validierung wird dort weiterhin als in Bearbeitung angezeigt.
- Haben Sie die Ergebnisse bestätigt und die Seite „Product Configuration" wieder verlassen, werden Sie dorthin zurückgeführt, mit der eingegebenen Fahrzeugliste und den Preisen der Fahrzeuge.
- Haben Sie auf der Seite „Product Configuration" Änderungen vorgenommen, aber noch nicht alle Fahrzeuge neu validiert, und verlassen Sie die Seite, wird die Seite mit den alten Konfigurationen geöffnet, nicht mit den geänderten.
- Haben Sie Fahrzeuge und Konfiguration bestätigt und die Seite „Customer & Payment Information" verlassen, öffnet sich diese Seite mit den ursprünglich ausgefüllten Werten.
- Haben Sie alle Kundendaten eingegeben und auf „Next" geklickt, wird die Meldung angezeigt, dass die Vertragsreferenzen für alle Fahrzeuge erzeugt werden, was ebenfalls Zeit benötigt. Verlassen Sie die Seite in diesem Moment, gelangen Sie später zur Seite „Customer & Payment Information" zurück, auf der die Meldung angezeigt wird, dass die Erzeugung der Vertragsreferenzen noch läuft.

Ändern Sie nach der Bestätigung der Ergebnisse die Konfigurationen in der Produktkonfiguration, müssen Sie erneut zu „Manage vehicles" wechseln und die Liste neu bestätigen. Dabei wird jedes Mal die vollständige Fahrzeugliste an Stream 1 gesendet, und das Datum „Submitted On" der Mass-Draft-Nummer wird auf das aktuelle Datum gesetzt.

**Von der Mass-Draft-Nummer zur Group ID**

Solange nicht für alle Fahrzeuge Vertragsreferenznummern vergeben sind, wird die Anfrage als Mass-Draft-Nummer geführt. Sobald allen Fahrzeugen eine Referenznummer zugewiesen wurde, wird dieselbe Nummer als Group ID bezeichnet. Der Entwurf ist dann in eine Group ID überführt und erscheint nicht mehr auf der Mass Draft Page. Dies ist der Fall, sobald Sie zur Seite „Overview & confirmation" weitergeleitet werden.