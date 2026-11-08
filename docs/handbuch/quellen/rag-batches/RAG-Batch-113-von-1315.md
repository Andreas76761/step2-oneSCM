# Batch 113 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

Im Bereich Revenue Management wurden mehrere Verbesserungen und Fehlerbehebungen umgesetzt bzw. vorbereitet.

Behoben wurde ein Fehler beim Rechnungsexport: Nach dem Export einer Rechnung wurden am zugehörigen Cofico-Job zunächst keine Dateien angezeigt. Dieses Problem ist gelöst. Ebenfalls behoben ist ein Fehler bei der Filterung: Bei Eingabe eines Filterwerts wurde der Filter nicht angewendet, wenn er mit der Eingabetaste bestätigt wurde. Zudem wurde ein Fehler im Zusammenhang mit importierten Schadenscodes korrigiert. Beim Versuch, einen importierten Schadenscode zu bearbeiten, trat zuvor eine Fehlermeldung auf. Diese Korrektur wurde im Rahmen der Abnahme bestätigt. Auch ein Problem beim erneuten Export von Rechnungen, das durch einen Fehler beim Exporttyp E169 verursacht wurde, wurde bearbeitet und abgeschlossen.

Darüber hinaus ist eine Erweiterung der Marktkonfiguration für CoFiCo / SWT vorgesehen, die sich derzeit im Entwicklungs-Backlog befindet und noch nicht umgesetzt ist. Bisher kann in der Konfigurationstabelle je Zahlungsmethode und Markt nur eine einzelne Zahlungsbedingung hinterlegt werden. Diese Tabelle wird bereits an CoFiCo exportiert. Künftig soll sie um zwei getrennte Spalten ergänzt werden: eine Zahlungsbedingung für den Fall, dass die Zahlung vor der Aktivierung eines Servicevertrags erfolgt, und eine für den Fall, dass sie nach der Aktivierung erfolgt. Dadurch kann das FI-System die jeweils passende Zahlungsbedingung auf Finanzdokumente anwenden.

Jede Zahlungsmethode kann dabei unabhängige Werte für die beiden Zeitpunkte erhalten. Leere Werte sind zulässig, wenn eine Kombination nicht unterstützt wird. So ist beispielsweise bei der Lastschrift keine Zahlung vor der Aktivierung möglich, und die Überweisung wird nur nach der Aktivierung unterstützt. Als Zuordnung ist vorgesehen, dass für Zahlungen vor der Aktivierung (Vorauszahlung) die Bedingung FB01 und für Zahlungen nach der Aktivierung (monatlich oder einmalig) die Bedingung FB30 verwendet wird. Für einzelne Zahlungsmethoden und Konfigurationen können abweichende Werte hinterlegt werden, etwa FB11 und FB31 in der VAN-Variante der Kreditkarte; für die Lastschrift steht der Wert nach der Aktivierung noch aus.

Beim Export an CoFiCo wählt das System die Zahlungsbedingung künftig anhand des Zahlungszeitpunkts des Vertrags aus. Die technische Zahlungsmethode für das FI-System bleibt unverändert, und bestehende Konfigurationen der Zahlungsmethoden werden nicht beeinträchtigt.