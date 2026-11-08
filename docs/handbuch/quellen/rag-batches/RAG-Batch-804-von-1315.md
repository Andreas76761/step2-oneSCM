# Batch 804 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsstornierung: Prüfung auf bestehende Schadensfälle**

Nach der Aktivierung eines Vertrags können Benutzer mit der Rolle MO oder MPC den Vertrag innerhalb eines festgelegten Zeitraums stornieren. Dieser Zeitraum richtet sich nach der Stornierungsfrist in den Market Settings. Für MO- und MPC-Benutzer gilt zusätzlich eine Pufferzeit von fünf Arbeitstagen. Die Stornierung ist nur möglich, wenn zur Fahrgestellnummer des Vertrags (FIN/VIN) kein Schadensfall vorliegt. Schadensfälle, die über die Schnittstelle i156 importiert wurden, werden dabei nicht mehr berücksichtigt. Voraussetzung ist, dass die Stornierungsfrist in den Market Settings definiert ist. Benutzer mit einer anderen Rolle als MO oder MPC können die Funktion „Vertrag stornieren" nicht auslösen.

Zur Prüfung auf Schadensfälle ruft das System beim Klick auf die Schaltfläche „Cancel Contract" automatisch die externe Warranty-and-Goodwill-Schnittstelle (Vehicle History Endpoint) auf. Die Abfrage erfolgt anhand der Fahrgestellnummer über die Products-Stream-Antwort (Stream 1). Das Ergebnis bestimmt, wie es weitergeht.

Liegt ein Schadensfall vor, ersetzt das System das Stornierungsfenster durch ein Warnfenster. Es informiert darüber, dass der Vertrag nicht storniert werden kann, weil ein offener Schadensfall besteht. Die Meldung lautet: „This Contract cannot be cancelled. This Contract has an open claim and cannot be cancelled. Would you like to early terminate it instead?" Mit „Cancel" oder dem „X" schließen Sie das Fenster und kehren zur Vertragsdetailansicht zurück. Mit „Go to Early Terminate" öffnen Sie das Fenster für die vorzeitige Beendigung.

Ist die Schnittstelle nicht verfügbar und liefert keine Antwort, ersetzt das System das Stornierungsfenster ebenfalls durch ein Warnfenster. Es weist darauf hin, dass etwas schiefgelaufen ist und die Aktion nicht abgeschlossen werden konnte. Die Meldung lautet: „Something went wrong. We couldn't complete your action. Please try again later." Mit „Back" oder „X" schließen Sie das Fenster und kehren zur Vertragsdetailansicht zurück.

Wird von der Schnittstelle kein Schadensfall gemeldet, läuft die Stornierung wie bisher ab. Sie wählen das gewünschte Datum, geben den Grund an und können optional einen Kommentar ergänzen. Anschließend führen Sie die Stornierung fort und bestätigen die Anfrage oder brechen sie ab.

Für die auswählbaren Stornierungsdaten gilt: Endanwender können bis zum Ende der in den Market Settings definierten Frist stornieren. MO- und MPC-Benutzer können bis zum Aktivierungsdatum zuzüglich der Frist aus den Market Settings und der Pufferzeit von fünf Arbeitstagen stornieren. Während der Pufferzeit bleibt die Schaltfläche „Cancel" aktiv. Der Datumsauswähler erlaubt dann nur noch die Auswahl des letzten gültigen Stornierungstags.

Ein Beispiel: Bei einer Frist von 14 Tagen in den Market Settings und einem Aktivierungsdatum am 01.02.2025 kann ein Endanwender bis zum 15.02.2025 stornieren. MO- und MPC-Benutzer können unter Einbeziehung der fünf Arbeitstage bis zum 21.02.2025 stornieren. Erfolgt die Stornierung zwischen dem 16.02.2025 und dem 21.02.2025, ist ausschließlich der 15.02.2025 auswählbar.

Grafik und Design der Oberfläche entsprechen den Vorgaben der Mercedes-Benz Workbench.