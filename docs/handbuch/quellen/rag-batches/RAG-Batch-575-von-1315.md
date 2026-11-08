# Batch 575 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 20 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Kunden- und Partnerverwaltung

In der Kunden- und Partnerverwaltung wurden mehrere Fehler behoben, die die tägliche Arbeit mit Gewerbe- und Privatkunden betroffen haben. Es ist nun möglich, mehrere Gewerbekunden mit derselben USt-IdNr. anzulegen. Der Firmenname wird in der Vorschau auf 70 Zeichen begrenzt. Ebenfalls behoben wurden Probleme beim Ändern von Kundendaten: Die Informationen von Privatkunden und von Gewerbekunden lassen sich wieder aktualisieren. Darüber hinaus wurde eine fehlerhafte Meldung wegen einer doppelten Zahlungsart korrigiert. Der FiSystem-Status in den Kundendetails wird nun korrekt als „Available“ statt fälschlich als „Pending“ angezeigt.

Verbessert wurde außerdem die Fehlerbehandlung im Hintergrund: Der VIES-Batch-Job geht nun angemessen mit Fehlern um. Zudem wurde ein Problem gelöst, bei dem ein SEPA-Dokument nicht hochgeladen werden konnte, weil der Vertrag aufgrund eines positiven CAS-Treffers abgelehnt worden war.

Im Bereich der Integration mit CoFiCo CMD wurden die Anlage und die Aktualisierung von Gewerbe- und Privatkunden über die API (POST) geprüft. Als Voraussetzungen werden unter anderem gepflegte Produkte, ausgefüllte Markteinstellungen sowie vorhandene Vorlagen für E-Mails und Dokumente genannt. Ebenfalls geprüft wurden das neue Feld „Account Note“, das aus dem FI-System übernommen wird, sowie die Aufteilung von Kunden (Split Customer) und die Zahlungsinformationen bei Gewerbekunden. Für die CAS-Prüfungen wurde zudem die Verwaltung der Clearing-Gruppe in den Markteinstellungen berücksichtigt, und zwar sowohl für den Privatkunden- als auch für den Van-Bereich.

Für Gewerbekunden entfällt das Feld „Payment Reference“ samt zugehöriger Logik. Dies gilt sowohl im Dialog zur Vertragserstellung als auch in der Kundenverwaltung. Die Änderung wird im Frontend und in allen Schichten des Backends umgesetzt, einschließlich Datenbank, Validierung und Historie. Sie darf erst erfolgen, nachdem die entsprechenden Anpassungen in den Bereichen Vertrag und Revenue vorgenommen wurden.

Nicht umgesetzt wurden die Korrektur zu nicht an CoFiCo gesendeten Anfragen bei der Anlage eines Gewerbekunden, die Korrektur eines CAS-Prüffehlers bei Privatkunden im Van-Bereich sowie die geplante Funktion im Customer Account Center, mit der Kunden die Zahlungsart von Lastschrift auf Lastschrift ändern, also eine andere IBAN hinterlegen können. Diese Punkte wurden abgebrochen.