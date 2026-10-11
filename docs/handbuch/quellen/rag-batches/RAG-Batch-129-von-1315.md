# Batch 129 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 26 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Korrekturen**

**Gutschriften unterhalb der zugehörigen Rechnung**

Im Reiter „Payment“ eines Vertrags werden gutgeschriebene Belege künftig direkt unter der Rechnung angezeigt, auf die sie sich beziehen. Das gilt für Kundenbelege (MPPI, MANU), Werkstattbelege (Werkstattrechnung, SIVECO, Customer Price Reimbursement), Lieferantenbelege und internationale Werkstattbelege. Besitzt eine Rechnung mindestens eine Gutschrift, ist sie mit einem Pfeil markiert. Standardmäßig ist der Bereich eingeklappt. Ein Klick auf den Pfeil klappt ihn auf und zeigt die zugehörigen Gutschriften, bei mehreren Gutschriften sortiert nach Belegdatum. Der Inhalt der Tabelle bleibt unverändert, auch bei aufgeklapptem Bereich.

Die Verknüpfung erfolgt bei Kundenbelegen über die Document Reference und bei Werkstattbelegen über die Workshop Document Reference. Beide entsprechen der oneSCM-Belegnummer der Rechnung. Wird eine Gutschrift neu erstellt, erscheint sie sofort unter der Rechnung, ohne dass die Seite neu geladen werden muss.

**Zahlungen, Export und MPay**

Für Verträge mit Vor- und Nachaktivierung, die über MPay bezahlt werden, wurden mehrere Punkte angepasst oder korrigiert. Rechnungen aus der Voraktivierung können nun in den Finanzbelegen angezeigt werden. Der Versand der E-Mails mit dem Zahlungslink nach sieben Tagen wurde korrigiert. Außerdem wurde behoben, dass der MPay-Status nicht auf „Captured“ aktualisiert wurde. Private Details zu Fahrzeug und Karteninhaber werden aus den MPay-Logs gelöscht. In den Markteinstellungen unter Market Configuration > Mpay Configuration wird die Gültigkeit des Zahlungslinks nun in Minuten angezeigt, und der Hinweis „(minutes)“ erscheint im Platzhalter des Feldes.

Für Verträge mit Vor- und Nachaktivierung gilt ferner: Ist der Export-Batchjob für CoFiCo/SWT deaktiviert, werden Rechnungen nicht mehr exportiert. Sie verbleiben im Status „Accepted + Captured“ und werden nach erneuter Aktivierung des Batchjobs exportiert. Ebenso wurde festgelegt, dass bei der Nachaktivierung eine Rechnung nicht auf „Accepted“ gesetzt wird, wenn das Fahrzeug nicht autorisiert ist. Zudem wurde ein Fehler behoben, bei dem eine Rückerstattung nicht möglich war, wenn eine Transaktion abgelehnt wurde, bevor eine andere erfasst wurde.

**Provisionen und Zahlungspläne**

Verkaufsprovisionen für VANs werden storniert und nicht an das FI-System exportiert. Dazu wurde ein Batchjob vorgesehen, der entsprechende SCOM-Rechnungen auf „storniert“ setzt. Ebenfalls behandelt wurden mehrfache Händlerprovisionen in verschiedenen Verträgen sowie ein Fehler, bei dem ein Zahlungsplan trotz der Fehlermeldung zum Feld „cost_unit“ angelegt wurde. Eine slowakische Übersetzung im Zahlungsplan (MBSK) wurde korrigiert.

**Weitere Korrekturen**

Für Einmalverträge wird beim CoFiCo-Export die Operation-ID statt der Transaction-ID übertragen. Revenue Events an NEMESIS wurden in mehreren Fällen nicht wie erwartet gesendet, unter anderem beim Import des E169-Feedbacks. Dies wurde korrigiert. Bei der Schadenerfassung wird der Coverage Code nach der Suche über den Schadencode nun automatisch ausgewählt. Außerdem wurde ein Problem behoben, bei dem nach dem Aufruf der Cross-File-Transfer-Seite eine leere Seite angezeigt wurde.

**Geprüfte Funktionen**

Geprüft wurden zudem die Rückgabe der Gültigkeitsdaten durch den Revenue Service nach Ablauf der Angebotsgültigkeit, die Umbenennung des Begriffs „Invoice“ in „Financial Document“ bzw. „Document“, die Suchfilter der Batchjobs sowie die Seite, Reiter und Aktionen des Cross File Transfer.