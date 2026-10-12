# Batch 615 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Mercedes-me-QR-Code-Integration im Kundenprozess**

Im Bereich Customer & Partner Management wurde die Anbindung an das Mercedes-me-Kundenprofil erweitert. Händler können Endkunden nun über einen QR-Code die Daten ihres Mercedes-me-Profils an oneSCM übermitteln lassen. Die Funktion gilt für Privat- und Gewerbekunden, die bereits ein Mercedes-me-Konto besitzen, und betrifft die Streams BS2 und BS3. Bisher bestand lediglich eine Integration mit der Standardanwendung Mercedes me. Der Kunde identifiziert sich nun über seine CIAM-ID und kann seinen Zahlungsprozess fortsetzen. Dies dient der Authentifizierung des Kunden für die Zahlungsoption Kreditkarte (MPAY).

**Ablauf bei der Auswahl der Zahlungsart**

Händler und Kunde erfassen zunächst die Kundendaten auf der Seite „Customer and Details“ und wählen anschließend in den Zahlungsinformationen die Zahlungsart per Auswahlschalter (Radio Button). Die Seite zeigt dazu Bereiche für Kreditkarte und Debitkarte und reagiert entsprechend auf die getroffene Auswahl. Bei Lastschrift (DIRECT DEBIT) läuft der Prozess unverändert ab.

Wird Kreditkarte gewählt, werden keine IBAN-Felder angezeigt. Der Händler klickt auf die Erzeugung des QR-Codes. Das System ruft den Mercedes-me-Endpunkt auf, prüft die CIAM-ID und speichert den QR-Code. Dieser wird in einem Pop-up zusammen mit einem sichtbaren Countdown-Timer und klaren Hinweisen zum Scannen angezeigt. Der Kunde scannt den Code mit der Mercedes-me-App. Läuft der Code ab oder schlägt die Erzeugung fehl, kann ein neuer QR-Code erzeugt werden. Nach erfolgreicher Validierung (Callback von Mercedes me) schließt sich das Fenster automatisch. Der von Mercedes me gesendete vierstellige Code wird gespeichert und angezeigt. Anschließend kann der Prozess mit den übrigen Angaben von der Seite „Customer and Details“ fortgesetzt werden. Ist Mercedes me nicht erreichbar, erscheint eine Toast-Meldung.

**Übersicht und Bestätigung**

Die Übersicht der Kunden- und Zahlungsinformationen enthält bei dieser Zahlungsart ausschließlich Kreditkarteninformationen. Bei der Kundenbestätigung läuft die Auswahl der Unterschrift wie gewohnt ab. Bei Auswahl der Kreditkarte werden stattdessen der QR-Code und der vierstellige Code von Mercedes me angezeigt, der von Stream 3 Revenue bereitgestellt wird.

**Nachgelagerte Prozessschritte**

Die Daten werden wie im bisherigen Generation-Prozess an CAS übermittelt, die Prüfung erfolgt unverändert. Zusätzlich erfolgt ein Abgleich mit oneERP: Dort wird anhand von Kundenname und Kundenadresse geprüft, ob der Kunde bereits existiert. Ist dies der Fall, wird der aktuelle Kundenstapel zurückgegeben. Andernfalls wird der Kunde angelegt und anschließend der aktuelle Kundenstapel zurückgegeben. Aus oneERP wird dabei nur die SAP-Debitorennummer übernommen, nicht jedoch Lastschriftdaten.