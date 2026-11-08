# Batch 1101 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 24 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung: Neuerungen und Änderungen**

**Signaturanfrage und Dokumenten-Upload**

Im Signaturfenster während der Vertragserstellung wurden Vorauswahl und Bezeichnungen angepasst. Vorausgewählt ist nun die Option „Use eSignature“; der Zusatz „(on premise)“ entfällt. Die Option „Use DSS Signature“ heißt jetzt „Use Signature by E-Mail“ (deutsch: „Unterschrift per E-Mail verwenden“). Das Zeitlimit (Timeout) für den DSS-Dienst wurde auf das Dreifache des bisherigen Wertes erhöht. Ebenso wurde das Lesezeitlimit für die Anbindung des Dokumentensignaturdienstes verlängert.

Nach der Signatur empfängt das System ein Ereignis aus dem Dokumentenmanagement. Dabei wird nun zusätzlich geprüft, ob die darin enthaltene Versions-ID mit der in der Datenbank gespeicherten übereinstimmt.

Wenn Vertriebsmitarbeitende, MO oder MPC eine unterschriebene, ausgedruckte Version des Servicevertrags hochladen, um die Vertragsaktivierung fortzusetzen, verarbeitet das System das Dokument im Hintergrund. Das kann etwa eine Minute dauern. Während dieser Zeit zeigt ein Fortschrittsbalken in Phase 1 einen Stand von 70 % an, damit erkennbar ist, dass das System arbeitet und nicht hängt. Sobald die Aufgaben abgeschlossen und der Vertrag validiert sind, wird der Fortschrittsbalken ausgeblendet.

**Fahrzeugdaten und Vertragsvorlage**

In der Übersicht und Bestätigung (Reiter „Fahrzeug“) wird nun die Auftragsnummer (Order Number) des Fahrzeugs angezeigt. Sie wird beim Initiieren des Vertragsangebots abgerufen und gespeichert. Zusätzlich steht in der Vertragsvorlage ein neuer Platzhalter „Order Number“ zur Verfügung.

Startet man ein Vertragsangebot über ein Baumuster (Model Code), werden verfügbare Produkte abgerufen, das gewünschte Produkt ausgewählt und konfiguriert. Danach wird ein Identifier, etwa eine Fahrgestellnummer, eingegeben. Anschließend müssen Erstzulassungsdatum (FRD) und Laufleistung angegeben werden. Das Kennzeichen ist nun gleichermaßen ein Pflichtfeld; ohne dieses kann der Vertrag nicht fortgesetzt werden. Das Kennzeichen wird im Vertrag gespeichert.

In der Detailansicht des Vertrags sowie des Angebots (Bereich „Coverage Details“) werden die technischen Optionen nicht mehr angezeigt. Dies gilt für das Angebots- und das Vertragsmanagement.

**Prüfungen bei der Vertragserstellung**

Bei jeder Vertragserstellung werden nun immer die Prüfungen auf den Direct-Debit-Code und die SAP-Debitorennummer durchgeführt. Die MO-Prüfungen werden nach der Vertragserstellung gestartet. Für B2B wurde zudem eine neue Kundenschnittstelle umgesetzt, die fehlende Zahlungsinformationen berücksichtigt.

Wurde ein Vertrag für ein Fahrzeug ohne Erstzulassungsdatum angelegt (Schalter „FRD unavailable“) und wird dieses später über die Aktion „Update“ im Angebotsmanagement nachgetragen, erfolgt eine Prüfung des eingegebenen Datums. Liegt das Datum später als das Erstzulassungsdatum zuzüglich Vertragslaufzeit, erscheint ein Hinweisbanner, dass das Fortfahren den Vertrag auf „abgelehnt“ setzt. Entscheidet sich der Benutzer dennoch fortzufahren, wird der Vertrag auf „Terminated“ gesetzt. Andernfalls wird das eingegebene Datum übernommen und die Aktivierung fortgesetzt.

**Marktkonfiguration**

In den Markteinstellungen gibt es bei den Nutzungsbedingungen (Terms of Use) ein neues Kontrollkästchen zur Aktualisierung der Version. Es befindet sich unterhalb der Nutzungsbedingungen, zusammen mit der Anzeige der aktuellen Version (zum Beispiel „Current Version 1“, gespeichert in der Datenbank). Ist die Option aktiviert, muss für jede Sprache ein neues Dokument hochgeladen werden, alle Benutzer müssen es erneut unterzeichnen, und die Dokumentversion wird erhöht. Die Schaltfläche „Aktualisieren“ ist so lange deaktiviert, bis alle Sprachen hochgeladen sind. Ist die Option nicht aktiviert, überschreibt das neue Dokument das bestehende, ohne dass es erneut von allen Benutzern akzeptiert werden muss; die Schaltfläche ist dann aktiviert.

Für den indischen Markt wurde die Auswahl erweitert: Zusätzlich zu DE steht nun der Markt IN zur Verfügung. Administratoren finden unter Admin, Markteinstellungen, Reiter „Allgemeine Einstellungen“, Bereich „Formate“, in der Währungsauswahl den Wert INR. Weitere Währungstypen wurden außerdem in den Währungsangaben des Vertrags ergänzt.

**Datenbank und Feldlängen**

Die in der Datenbank zulässige Zeichenanzahl für Outlet-Name, Händlername und Händleradresse wurde von 100 auf 250 Zeichen erhöht. Hintergrund waren Probleme im Produktivbetrieb bei sehr langen Bezeichnungen. Die Prüfung ergab, dass das Feld in keiner anderen Domäne verwendet wird. Die Änderung ist in die Flyway-Datenbankmigration aufgenommen.