# Batch 414 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 19 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation – Neuerungen und Korrekturen**

**Benachrichtigung bei Zahlerwechsel**

Wird bei einem aktiven Vertrag der Zahler gewechselt, informiert das System künftig automatisch sowohl den Halter als auch den Zahler des Vertrags per E-Mail. Ist der Halter zugleich der Zahler, entfällt die getrennte Benachrichtigung an den Zahler. Die beiden Nachrichten werden stets separat an den Halter und an den Zahler versendet.

Dafür legen Sie im Template-Management zwei Vorlagen an. Im Feld „Used For“ wählen Sie für die Halter-Mail „Changing payer for Holder“ und für die Zahler-Mail „Changing payer for Payer“. Pflichtfelder sind der Template-Name (Textfeld, maximal 25 Zeichen), der Markt (vorbelegt mit Deutschland), der Verwendungszweck („Used For“) und das Gültig-ab-Datum, ab dem die Vorlage für den Geschäftsprozess aktiv wird. Sind Pflichtfelder nicht ausgefüllt, weist das System auf das betreffende Feld hin. „Als Entwurf speichern“ bleibt dann verfügbar, „Veröffentlichen“ ist jedoch nicht möglich. Optional können Sie die Division (PC oder VAN) und die Sprache (Englisch) angeben. Der Inhalt der E-Mail wird nach dem MB Style Guide für E-Mails erstellt. Kopf- und Fußzeile wählen Sie per Dropdown aus.

Der Betreff lautet „Important Notice: Change in Payer for Contract %ContractNumber%“. Die Vertragsnummer wird erst beim Versand eingesetzt. Im Template-Editor stehen neue Druckvariablen für Vorname und Nachname des Halters sowie für Vorname und Nachname des Zahlers bereit, die Sie per Drag and Drop in den Text ziehen.

Die Mail an den Halter bedankt sich für die Wahl eines Mercedes-Benz Service Contracts und teilt mit, dass sich der Zahler für den Vertrag geändert hat. Ab dem Vertragsstart werden alle Zahlungen und Finanztransaktionen beim ausgewählten Zahler eingezogen, dessen Name genannt wird. Die Mail an den Zahler enthält dieselbe Information, teilt aber mit, dass die Zahlungen künftig von seinem Konto eingezogen werden. Beide Mails verweisen bei Fragen auf das Customer Support Team und schließen mit der Grußformel „Service Contract Team, Mercedes-Benz Cars Germany“ samt marktspezifischer Telefonnummer, E-Mail-Adresse und einem Umwelthinweis.

**Dokumente in Mercedes me**

Das System übermittelt alle Dokumente von Kunden mit aktivem Vertrag an das Mercedes-me-Portal, sodass Kunden dort darauf zugreifen können. Dafür wird die Archivfunktion des Document Support Service (DSS) genutzt, und in den Metadaten muss „MetaDataConnectedWithCIAM“ auf „true“ gesetzt sein. Die Funktion ist erfolgreich, wenn das Dokument in Mercedes me ankommt, Mercedes me den Empfang mit dem Status „OK“ bestätigt und der Kunde das Dokument abrufen kann.

**Behobene und geprüfte Punkte**

Im Bereich E-Mails und Dokumente wurden mehrere Probleme aus dem Test behoben oder abgeschlossen. Dazu gehören die Anzeige von Verkäufer- und Händlerdetails im Preisdokument sowie die fehlende Darstellung der Preisinformationen in der Preisinformations-E-Mail. In der Reaktivierungs-E-Mail wird das Reaktivierungsdatum nicht mehr mit Zeitstempel angezeigt. Preise erscheinen in Bestätigungs-E-Mails nun einheitlich im gleichen Format wie in der Benutzeroberfläche, also mit Komma (z. B. 32,63). Außerdem wurden die Anzeige des Signaturwerts in der Vertragsvorlage und die Textdarstellung in der Vorschau der Dokumentvorlage korrigiert. Im Template-Management konnten Benutzer zeitweise keine Vorlage anlegen, auch dies wurde behoben. Bei den systeminternen Benachrichtigungen werden Kampagnen- und Rechnungsbenachrichtigungen nun korrekt zurückgesetzt.

Mehrere weitere Punkte sind noch in Prüfung oder offen. Geprüft werden unter anderem der Versand der Preisinformations-E-Mail nach Klick auf „E-Mail senden“, die Anhänge des Zahlungsplans bei Vertragsangebot und Aktivierung je nach Zahlungsart, die Anzeige von Signaturen (Bild oder Text) samt erfasstem Signaturdatum im Vertrag sowie das Fehlen des DRAFT-Wasserzeichens bei aktivierten Verträgen. Noch offen sind die Prüfung, ob die Prolongations-E-Mail beim Kunden mit der Master-Data-Vorlage übereinstimmt, und die Kontrolle, ob Text in der Vorlagenvorschau bei längerem Editortext automatisch in die nächste Zeile umbricht.