# Batch 133 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vorzeitige Abrechnung (Early Settlement) aus dem Vertrag – Transaktion für den Restbetrag erstellen**

Bisher wurde bei einer vorzeitigen Abrechnung eines aktiven Vertrags mit der Zahlungsart „Digital Payments" der Zahlungslink für die verbleibenden Rechnungen nicht neu erzeugt. Der Kunde konnte die Zahlung dadurch nicht abschließen. Dieses Verhalten wurde angepasst.

Eine vorzeitige Abrechnung ist nun möglich, wenn ein aktiver Vertrag ein periodisches Zahlungsintervall (monatlich, vierteljährlich, halbjährlich oder jährlich) hat und auf „Einmalig" umgestellt wird. Ein Mitarbeiter des Managing Office (MO) löst sie im Vertragsmanagement auf dem Reiter „Payment" aus: Im Bereich „Payment Information" wählt er im Dropdown „Payment Interval" den Wert „One Time". Anschließend startet der Ablauf der vorzeitigen Abrechnung, und das System ermittelt alle Rechnungen des Vertrags im Status „Planned".

Bei Verträgen mit der Zahlungsart „Digital Payments" erzeugt das System eine Transaktion über den Restbetrag. Dafür wird die bereits hinterlegte Karte per PreAuth und Capture verwendet, der Kunde muss keine neue Karte eingeben. Der Transaktionsbetrag entspricht der Summe aller Rechnungen im Status „Planned". Rechnungen in anderen Status, etwa „Accepted", „Exported", „FI Doc Created" oder „Paid", werden nicht berücksichtigt.

Das weitere Verhalten hängt davon ab, ob alle Rechnungen im Status „Planned" sind.

Befindet sich mindestens eine Rechnung in einem anderen Status als „Planned", bleibt der Zahlungsplan unverändert. Wurden die Zahlungsdaten validiert und die Zahlung erfolgreich durchgeführt, wechseln die Rechnungen im Status „Planned" in den Status „Accepted" mit dem MPay-Status „Captured". Schlägt die Zahlung trotz validierter Zahlungsdaten fehl, zum Beispiel wegen unzureichender Deckung, wechseln diese Rechnungen ebenfalls in den Status „Accepted", jedoch mit dem MPay-Status „Failed". In diesem Fall steht eine Wiederholungsmöglichkeit (Retry) zur Verfügung. Rechnungen in anderen Status bleiben in beiden Fällen unverändert und behalten ihren bisherigen Rechnungs- und MPay-Status.

Befinden sich alle Rechnungen im Status „Planned", wird der Zahlungsplan neu erstellt und enthält nur noch eine einzige Rechnung. Deren Betrag entspricht der Summe aller Rechnungen des ursprünglichen Zahlungsplans. Bei erfolgreicher Zahlung erhält diese Rechnung den Status „Accepted" mit dem MPay-Status „Captured". Schlägt die Zahlung fehl, erhält sie den Status „Accepted" mit dem MPay-Status „Failed", und die Wiederholungsmöglichkeit steht zur Verfügung.

Bei Verträgen mit der Zahlungsart „Lastschrift" (Direct Debit) wird die vorzeitige Abrechnung über den Lastschrift-Ablauf durchgeführt, wenn das Zahlungsintervall auf „One Time" geändert wird.