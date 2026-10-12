# Batch 181 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Zugriff nach Division und Plausibilitätsprüfung SWT**

**Divisionsbezogene Zugriffsrechte**

In oneSCM richtet sich der Datenzugriff nach den Divisionen, die einem Benutzer zugewiesen sind. Das gilt für die Rollen HQ Admin, MPC und MO. Ist einem Benutzer nur die Division VAN zugewiesen, sieht er in den relevanten Modulen ausschließlich VAN-Daten und kann nur mit diesen arbeiten. Hat ein Benutzer nur Zugriff auf die Division PC, sind entsprechend nur PC-Daten sichtbar und bearbeitbar. Sind einem MPC oder MO sowohl die PC- als auch die VAN-Rolle zugewiesen, kann der Benutzer in allen Modulen die Daten beider Divisionen einsehen.

**Plausibilitätsprüfung SWT: Ausgangs- und Eingangsbetrag**

Für Benutzer der Rolle Market Operation (MO) oder MPC steht auf der Seite „Financial Control“ unter „Admin“ ein neuer Reiter zur Verfügung, mit dem sich die Richtigkeit der an SWT übermittelten Rechnungen überprüfen lässt. Dazu wird die Summe der gesendeten Rechnungsbeträge mit der Summe verglichen, die in der von SWT zurückgelieferten Feedback-Datei ausgewiesen ist. Die Oberfläche ist so konzipiert, dass mehrere Märkte mit unterschiedlichen Finanzsystemen unterstützt werden. Werte lassen sich somit gezielt für einen Markt betrachten, zum Beispiel für Deutschland (oneERP), Indien (SWT) oder die Slowakei (CoFiCo). Die Funktion war bisher nur für das andere Finanzsystem oneERP vorhanden.

**Suchkriterien**

Der neue Reiter bietet folgende Suchkriterien: Dateityp (Auswahlliste mit den in der Datenbank verfügbaren Optionen, derzeit „Outbound“, später möglicherweise auch „Workshop Interface“), Exportdatum und Importdatum (jeweils per Datumsauswahl) sowie Status (Auswahlliste mit den in der Datenbank verfügbaren Status). Unter „Weitere Filter“ stehen der Dateiname und die Prüfung zur Verfügung. Der Dateiname ist ein Textfeld, das Buchstaben (a–z, A–Z) und Ziffern (0–9) zulässt, Groß- und Kleinschreibung nicht unterscheidet und eine unscharfe Suche unterstützt. Das Feld „Check“ ist eine Auswahlliste mit allen in der Datenbank verfügbaren Status. Änderungen an den Filterfeldern wirken sich nicht automatisch auf die Ergebnisliste aus. Erst mit „Search“ wird der Ergebnisbereich mit den gefilterten Datensätzen gefüllt. Mit „Cancel“ werden alle Änderungen verworfen.

**Ergebnisbereich**

Der Ergebnisbereich zeigt je Datei den Dateinamen, den Dateityp und den Status der Datei an. Der Status „Exported“ bedeutet, dass die Datei SWTInvExp erzeugt wurde. „Import Pending“ bezeichnet den Zwischenstand zwischen Export und Import. „Imported“ bedeutet, dass die Feedback-Datei in oneSCM verarbeitet wurde. Das Exportdatum entspricht dem Erzeugungsdatum der Datei SWTInvExp, das Importdatum dem Datum, an dem das SWT-Rechnungsfeedback importiert wurde.

Die Spalte „Total Sum Export“ wird aus der Exportdatei berechnet. Berücksichtigt werden alle Zeilen vom Typ „L“, unabhängig davon, ob es sich um eine Rechnung oder eine Gutschrift handelt. Summiert werden die Werte der Positionen 364 bis 379 (Invoice Position Net Amount), geteilt durch 100. Die Spalte „Total Sum Import“ wird aus der Importdatei berechnet. Hier werden die Zeilen mit dem Rechnungsstatus „10“ berücksichtigt, und es werden die Werte der Positionen 58 bis 74 (Payment Amount) summiert und durch 100 geteilt.

Die Spalte „Check“ zeigt das Ergebnis des Vergleichs: Sind „Total Sum Export“ und „Total Sum Import“ gleich, lautet das Ergebnis „OK“, andernfalls „Not OK“. Alle Spalten der Tabelle sind sortierbar. Standardmäßig wird nach dem Exportdatum sortiert, wobei das neueste Datum oben steht. Pro Seite werden standardmäßig 10 Einträge angezeigt. Dieser Wert kann auf 10, 20, 30, 40 oder 50 geändert werden.

**Verhalten für MO/MPC des Marktes Indien**

Ein MO oder MPC des Marktes Indien findet nach der Anmeldung an oneSCM die Seite „Financial Control – SWT Check“. Sobald der Batch SWTInvExp ausgelöst und abgeschlossen wurde, wird der Status „Exported“ zusammen mit dem exportierten Gesamtbetrag angezeigt. Sobald das Feedback zum Batch eingegangen ist, wechselt der Status auf „Imported“, und der importierte Gesamtbetrag wird angezeigt. Das Prüfergebnis lautet „OK“, wenn der exportierte Gesamtbetrag der importierten Gesamtsumme entspricht, andernfalls „Not OK“.

**SAP-Debitorennummer**

Für die Anbindungen CoFiCo und SWT wurde zudem geprüft, dass die SAP-Debitorennummer alphanumerisch sein darf.