# Batch 160 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**MPay für Kunden ohne Mercedes-me-Konto**

Bisher konnten Kunden ohne Mercedes-me-Konto nicht per MPay bezahlen. Mit dieser Erweiterung ist die Zahlung per MPay auch ohne Mercedes-me-Konto möglich, allerdings eingeschränkt. Hat ein Kunde ein Mercedes-me-Konto, ist weiterhin eine monatliche MPay-Zahlung möglich, und die Karte wird als Asset unter der Konsumentenreferenz gespeichert. Hat ein Kunde kein Mercedes-me-Konto, steht MPay nur für eine Einmalzahlung zur Verfügung. Bei der Vertragsaktivierung wird in diesem Fall kein Karten-Asset gespeichert. Hintergrund ist, dass die MPay-Links für Vorautorisierung und Zahlungseinzug (Capture) nur begrenzt gültig sind (zum Beispiel 30 Tage), der Aktivierungsprozess aber länger als 30 Tage dauern kann.

**Ablauf im Regelfall**

Der Händler wählt bei der Vertragskonfiguration das Produkt, erfasst die Kundendaten und wählt MPay als Zahlungsart. Das System prüft anschließend, ob ein Mercedes-me-Konto vorhanden ist. Ist das Konto gültig, läuft der normale monatliche Ablauf, bei dem das Asset unter der Konsumentenreferenz gespeichert wird. Fehlt das Konto, wird die Zahlungsart MPay nur für das Zahlungsintervall „einmalig“ angeboten.

Der Vertrag wird ohne Erfassung von Kartendaten aktiviert. Nach der Aktivierung wird der MPay-Zahlungslink (Vorautorisierung und Capture) erzeugt, sobald der CFDM-Batch ausgeführt wurde und die Rechnung in den Status „Akzeptiert“ gewechselt ist. Die Aktivierungs-E-Mail an den Kunden enthält einen Link zum Customer Account Center (CAC). Der Kunde öffnet das CAC per OTP, wählt „Bezahlen“, gibt seine Kartendaten ein und schließt die Zahlung ab. Dabei wird kein Asset gespeichert. oneSCM erhält die MPay-Benachrichtigungen (autorisiert bzw. eingezogen), markiert die Rechnung als bezahlt und übermittelt die Details an das FI-System.

**Ausnahmefälle**

Wird der Zahlungslink nicht genutzt, erhält der Kunde am 7. Tag eine Erinnerungs-E-Mail, und zusätzlich wird eine interne Benachrichtigung an das MO versendet. Die E-Mail-Vorlage und der Inhalt der internen Benachrichtigung sind noch nicht festgelegt. Am 14. Tag, dem letzten Tag der Karenzzeit, wird der Vertrag automatisch storniert, sofern der Link nicht genutzt wurde, und das MO wird benachrichtigt. Dazu informiert Revenue das Vertragsmanagement, damit der Vertrag ausgesetzt wird. Für ausgesetzte Verträge ist eine eigene E-Mail-Vorlage vorgesehen.

Wurde eine Zahlung versucht, schlägt der Einzug aber fehl, etwa wegen fehlender Deckung, gilt dies als Zahlungsabsicht. Solange Wiederholungsversuche laufen, wird der Vertrag nicht ausgesetzt. Ist der Link abgelaufen, muss im Customer Account Center ein neuer Zahlungslink erzeugt werden.

Erklärt sich ein Kunde später doch zur Zahlung bereit, zahlt er zunächst über einen neuen Link. Anschließend sendet Revenue ein Ereignis an das Vertragsmanagement, das den Vertrag reaktiviert.

Liegen für den Vertrag Forderungen aus VEGA oder manuelle Werkstattrechnungen im Status „Akzeptiert“ vor, wird die automatische Stornierung blockiert. Das MO muss in diesem Fall die Forderungen klären und danach den Vertragsstatus ändern. Statusänderungen am Vertrag erfordern eine manuelle Prüfung.