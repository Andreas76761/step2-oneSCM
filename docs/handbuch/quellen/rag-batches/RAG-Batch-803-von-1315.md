# Batch 803 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Automatische Vertragsschließung nach vorzeitiger Beendigung**

Bisher mussten Verträge, die auf den Status „Early Termination" (vorzeitige Beendigung) gesetzt wurden, manuell durch den Market Owner (MO) oder den Market Product Coordinator (MPC) geschlossen werden. Künftig übernimmt das System diesen Schritt automatisch, sofern keine abschließende Vertragsprüfung (Final Contract Review) erforderlich ist. Dadurch wird der Prozess effizienter und zeitnah abgewickelt.

Voraussetzung für die automatische Schließung ist, dass sich der Vertrag im Status „Early Termination" befindet und in den Markteinstellungen die Wartezeit bis zur Schließung hinterlegt ist. Hierfür steht in den Markteinstellungen unter „Timer and Reminders" das neue Eingabefeld „Close Contract after Early Termination" zur Verfügung. Es ist ein numerisches Feld, in das die Anzahl der Tage eingetragen wird. Über das Info-Symbol („i") wird erläutert, dass das Feld festlegt, wie viele Tage das System wartet, bevor ein vorzeitig beendeter Vertrag geschlossen wird, wenn keine abschließende Vertragsprüfung erforderlich ist.

Der Ablauf gestaltet sich wie folgt: Der MO oder MPC setzt einen aktiven oder ausgesetzten (Suspended) Vertrag auf „Early Termination". Anschließend prüft das System anhand des zugewiesenen Contract Review Profile, ob eine abschließende Vertragsprüfung erforderlich ist. Eine solche Prüfung kann nur dann angefordert werden, wenn die tatsächliche Laufleistung (Real Mileage) die geplante Gesamtlaufleistung des Vertrags (Planned Contract Total Mileage) abzüglich Pi10 überschreitet. Ist keine abschließende Vertragsprüfung erforderlich, wartet das System die in den Markteinstellungen festgelegte Anzahl von Tagen ab.

Während dieser Wartezeit können Händler weiterhin Forderungen (Claims) zum Vertrag einreichen. Nach Ablauf der definierten Frist setzt das System den Vertrag automatisch auf „Closed". Im Bereich „History" wird dabei als Grund „Claiming period time over" vermerkt.

Für die Einrichtung öffnen Sie die Markteinstellungen, wechseln zu „Timer and Reminders" und tragen im Feld „Close Contract after Early Termination" die gewünschte Wartezeit in Tagen ein. Design und Grafiken der Funktion entsprechen den Vorgaben der Mercedes-Benz Workbench.