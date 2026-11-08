# Batch 880 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Zahlungsart Überweisung in COFICO-Märkten**

In Märkten, in denen COFICO als Finanzsystem (FI-System) eingesetzt wird, wird die Zahlungsart Überweisung automatisch gewährt, sobald sie im Reiter „Zahlung" ausgewählt wird. Voraussetzung ist, dass die Überweisung in den Markteinstellungen für den Markt aktiviert ist und der jeweilige Kundentyp diese Zahlungsart wählen darf. Welche Kundentypen die Überweisung auswählen dürfen, ändert sich dadurch nicht. Entfallen ist lediglich die bisherige Prüfung anhand der Kontonotiz. Grundsätzlich steht die Überweisung nur Geschäftskunden zur Verfügung.

Der Ablauf gestaltet sich wie folgt: Der Vertriebsmitarbeiter legt ein Angebot an und konfiguriert die Produkte. Anschließend wählt er im Reiter „Zahlung" die Überweisung aus, sofern sie für den Kunden nach den geltenden Regeln auswählbar ist. Das System erkennt, dass das FI-System des Marktes COFICO ist, und setzt die MO-Prüfung für die Überweisung auf „NOT_APPLICABLE". Es erfolgt weder eine Abfrage der Kontonotiz noch eine Verifizierung. Die Überweisung wird gewährt, unabhängig vom Wert einer eventuell vorhandenen Kontonotiz, und der Vertrag durchläuft den üblichen Prozess mit Dokumenten, Unterschrift und Aktivierung. Der Kunde profitiert so von der Zahlungsart, ohne durch eine Kontonotiz-Prüfung blockiert zu werden, hinter der keine Daten stehen.

Auch Kundenaktualisierungen wirken sich in COFICO-Märkten nicht auf Überweisungsverträge aus: Bei der Verarbeitung eines Kundenaktualisierungsereignisses wird die Kontonotiz für diese Verträge weder neu bewertet noch zur Blockierung herangezogen.

In der Benutzeroberfläche wird in COFICO-Märkten das Feld „Kontonotiz" ausgeblendet, und zwar auf der Seite für Privatkunden, auf der Seite für Geschäftskunden, im Reiter „Kunde" des Vertrags sowie in der Übersicht und Bestätigung (im Block „Receivables from FI System"). Außerdem wird die Fehlermeldung „Blocked Account Note" in der Fußzeile der Zahlung unterdrückt und kann nicht mehr erscheinen.

In Märkten mit dem FI-System One ERP ändert sich nichts. Die Kontonotiz-Prüfung verhält sich dort unverändert, und das Feld „Kontonotiz" wird weiterhin auf allen Seiten angezeigt.