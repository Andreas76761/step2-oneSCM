# Batch 928 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Hinweis:** Dieses Vorhaben hat den Status „Cancelled". Die beschriebene Funktion wurde laut Ticketstatus nicht umgesetzt. Der folgende Text sollte daher nur dann in ein Benutzerhandbuch übernommen werden, wenn das Release-Team dies ausdrücklich bestätigt.

**Benachrichtigung nach Abschluss der Fahrzeugvalidierung bei der Massenanlage**

Wenn Sie bei der Vertragserstellung für Flottenkunden mehrere Fahrzeuge gleichzeitig hinzufügen, werden die Fahrzeugdaten zur Validierung an Stream 1 übermittelt. Diese Prüfung kann einige Minuten dauern. Bisher wurde während dieser Zeit eine Meldung angezeigt, dass die Validierung läuft, und Sie mussten warten, bevor Sie weiterarbeiten konnten. Die Funktion richtet sich an KAM, Händler, MO und MPC. Sie soll Zeit sparen und verhindern, dass für dasselbe Fahrzeug mehrfach Anfragen gestellt werden.

Nach dem Bestätigen der Fahrzeugliste müssen Sie nicht mehr auf das Ergebnis der Validierung warten. Sie verlassen die Seite „Mehrere Fahrzeuge hinzufügen“ und erledigen andere Aufgaben. Die übermittelte Fahrzeugliste wird gespeichert, sodass Sie später darauf zugreifen können. Sobald alle Fahrzeuge validiert sind, erhalten Sie eine Benachrichtigung. Über diese gelangen Sie an die Stelle zurück, an der Sie den Ablauf verlassen haben, und zwar auf die Seite „Mehrere Fahrzeuge hinzufügen“ mit den Validierungsmeldungen zu den einzelnen Fahrzeugen. Dort setzen Sie die Vertragserstellung fort. Beim Absenden der Fahrzeuge erscheint eine Meldung mit dem Hinweis, dass die Fahrzeugdaten verarbeitet werden, dass dies einige Sekunden oder Minuten dauern kann und dass Sie bitte warten oder später benachrichtigt werden, um den Ablauf fortzusetzen.

Voraussetzung ist, dass Produkte und Sonderkonfigurationen für gewerbliche Flottenkunden verfügbar sind. Die Massenanlage muss für die folgenden Abläufe zur Verfügung stehen: Fahrgestellnummer/VIN/FIN mit verfügbarem FRD, Build to Order und Build to Stock. Der Baumaster-Ablauf wird nicht unterstützt.

Der Ablauf beginnt unter „Contract Generation“ im Bereich „Contract Proposal“. Sie wählen als Kundentyp „Commercial Fleet“ und können optional eine Branche angeben (Standardwert: „Not Relevant“). Anschließend geben Sie eine Kennung ein, zum Beispiel Auftragsnummer, Fahrgestellnummer, VIN, FIN oder Baumaster, und ergänzen weitere Informationen. Danach wählen Sie das Produkt und schließen die Produktkonfiguration ab. Über „Add Multiple Vehicles“ fügen Sie die Fahrzeugliste hinzu, entweder manuell, per Excel-Upload oder per Copy-and-paste. Mit dem Haken bestätigen Sie die Liste erstmalig, mit „Update“ senden Sie sie nach Änderungen erneut ab.

Eine Benachrichtigung erhalten Sie in folgenden Fällen:

- Sie haben die Fahrzeugliste zum ersten Mal bestätigt. Sie werden benachrichtigt, sobald alle Fahrzeuge validiert sind.
- Die Validierung hat Fehler ergeben, und Sie haben Datensätze korrigiert oder gelöscht und auf „Update“ geklickt. Die vollständige Fahrzeugliste wird dann erneut an Stream 1 gesendet, und es erscheint dieselbe Meldung wie oben. Sie können wieder andere Aufgaben erledigen und werden später benachrichtigt.
- Sie haben eine gültige Fahrzeugliste bestätigt und ändern anschließend auf der Seite der Produktkonfiguration die Konfiguration. Die Schaltfläche „Create Proposal“ ist dann deaktiviert, weil die Fahrzeugliste erneut bestätigt werden muss. Die Seite „Mehrere Fahrzeuge hinzufügen“ öffnet sich, Sie bestätigen erneut, die vollständige Liste geht wieder an Stream 1, und Sie werden nach Abschluss der Validierung benachrichtigt.

Diese Schritte können sich wiederholen, bis alle Fahrzeuge validiert sind und Sie die endgültige Liste gültiger Fahrzeuge bestätigt haben.

Dieser Ablauf gilt für Fälle, in denen Sie nach der Bestätigung nicht auf die Validierung warten, sondern auf die Benachrichtigung warten. Für den Fall, dass Sie die Benachrichtigung verpasst oder gelöscht haben und den Ablauf trotzdem fortsetzen möchten, ist ein separater Ablauf vorgesehen.

Die Rohdaten enthalten außerdem Überlegungen zu einer „Mass Draft Number“. Diese Nummer sollte die Daten aller zunächst gesendeten Fahrzeuge speichern und dem Format der Vertragsreferenznummer ähneln. Im Ticket ist dies jedoch als offene Frage markiert, und es ist unklar, ob es so umgesetzt wurde. Deshalb wird es hier nicht als feste Funktion beschrieben.