# Batch 177 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Plausibilitätsprüfung CoFiCo: Ausgangs- und Eingangsbeträge im Vergleich**

Im Bereich Revenue Management steht eine neue Plausibilitätsprüfung für CoFiCo zur Verfügung. Mitarbeitende aus Market Operation und MPC können damit prüfen, ob die an CoFiCo übermittelten Rechnungen korrekt verarbeitet wurden. Dazu wird die Summe der gesendeten Rechnungsbeträge mit der Summe aus der Rückmeldedatei verglichen, die von SWT eingeht. Stimmen beide Summen überein, wurden die Rechnungen korrekt übermittelt. Eine vergleichbare Funktion gab es bisher bereits für ein anderes FI-System.

Die Prüfung finden Sie unter Admin → Financial Control auf dem neuen Tab „CoFiCo Check". Da oneSCM mehrere Märkte mit unterschiedlichen FI-Systemen unterstützt, ist die Oberfläche auf den Betrieb mit mehreren Märkten ausgelegt. So lassen sich gezielt nur die deutschen Werte für oneERP, die indischen Werte für SWT oder die CoFiCo-Werte für die Slowakei anzeigen.

**Suchkriterien**

Zur Eingrenzung der Ergebnisse stehen folgende Felder zur Verfügung:

- Dateityp: Auswahlliste mit den in der Datenbank verfügbaren Optionen. Derzeit ist das „Outbound"; später kann auch das „Workshop Interface" hinzukommen.
- Exportdatum und Importdatum: jeweils über eine Datumsauswahl, wobei alle Daten wählbar sind.
- Status: Auswahlliste mit den in der Datenbank verfügbaren Status.

Unter den weiteren Filtern finden Sie:

- Dateiname: Textfeld, das Buchstaben (a–z, A–Z) und Ziffern (0–9) zulässt. Die Suche unterscheidet nicht zwischen Groß- und Kleinschreibung und arbeitet unscharf (Fuzzy-Suche).
- Check: Auswahlliste mit allen in der Datenbank verfügbaren Status.

Mit „Search" füllen Sie den Ergebnisbereich mit den gefilterten Datensätzen. Mit „Cancel" verwerfen Sie alle Änderungen. Änderungen oder Auswahlen in den Filterfeldern wirken sich nicht automatisch auf die Suchergebnisse aus. Erst ein Klick auf „Search" aktualisiert die Anzeige.

**Ergebnisbereich**

Der Ergebnisbereich zeigt für jede Datei folgende Angaben:

- Dateiname und Dateityp.
- Status der Datei. „Exported" bedeutet, dass die Datei CoFiCoInvExp erzeugt wurde. „Import Pending" bezeichnet den Zustand zwischen Export und Import. „Imported" bedeutet, dass die Rückmeldedatei in oneSCM verarbeitet wurde.
- Exportdatum: das Erstellungsdatum der Datei CoFiCoInvExp.
- Importdatum: das Datum, an dem das CoFiCo-Invoice-Feedback importiert wurde.
- Total Sum Export: wird aus der Exportdatei berechnet. Berücksichtigt werden alle Zeilen vom Typ „L", unabhängig davon, ob es sich um eine Rechnung oder eine Gutschrift handelt. Summiert werden die Werte der Positionen 364 bis 379 (Invoice Position Net Amount), geteilt durch 100.
- Total Sum Import: wird aus der Importdatei berechnet. Berücksichtigt werden die Zeilen mit dem Rechnungsstatus „10". Summiert werden die Werte der Positionen 58 bis 74 (Payment Amount), geteilt durch 100.
- Check: Sind Total Sum Export und Total Sum Import identisch, lautet das Ergebnis „OK". Weichen die Summen voneinander ab, lautet es „Not OK".

Alle Spalten der Tabelle lassen sich sortieren. Standardmäßig wird nach dem Exportdatum sortiert, wobei das neueste Datum oben steht. Pro Seite werden standardmäßig 10 Einträge angezeigt. Sie können den Wert auf 10, 20, 30, 40 oder 50 ändern.

**Ablauf für Benutzer des indischen Marktes**

Als MO/MPC des indischen Marktes finden Sie nach der Anmeldung in oneSCM die Seite „Financial Control – CoFiCo Check". Sobald der Batch CoFiCoInvExp ausgelöst und abgeschlossen wurde, sehen Sie den Status „Exported" und den exportierten Gesamtbetrag der Datei. Nach Eingang des Feedbacks wechselt der Status auf „Imported", und der importierte Gesamtbetrag wird angezeigt. Der Check zeigt „OK", wenn der exportierte Gesamtbetrag der importierten Summe entspricht, andernfalls „Not OK".