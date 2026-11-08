# Batch 904 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Verlängerung bei Langzeitmiete – Reifen (begrenzt und unbegrenzt)**

Im Bereich der Vertragserstellung wurde die Funktion zur Verlängerung von Langzeitverträgen um die Position Reifen erweitert, sowohl in der begrenzten als auch in der unbegrenzten Variante. Weitere Einzelheiten zu Umfang oder Verhalten liegen in den vorliegenden Angaben nicht vor.

**Vereinfachter Kreditkartenablauf nach Aktivierung (Kunden ohne MMe)**

Für Kunden, die als Zahlungskonfiguration die Zahlung nach Aktivierung (Post Activation), als einmalige Zahlung (One-Time) und per Kreditkarte wählen, wurde der Ablauf der Vertragsbestätigung und -aktivierung angepasst. Die Regelung gilt für alle Kundentypen und alle Divisionen. Bei der Vertragserstellung und -bestätigung verlangt das System in diesem Fall weder eine MMe-ID noch eine CIAM-ID und führt auch keine Kreditkartenvalidierung durch. Für Kunden mit MMe-Account bleibt der Ablauf unverändert.

Bestätigt der Benutzer den Vertrag in der Ansicht „Overview & Confirmation“, fordert das System ihn auf, die Signaturmethode auszuwählen. Ist der Vertrag signiert, das Ergebnis der CAS-Prüfung negativ und eine FI-System-Debitorennummer vorhanden, werden die Vertragsdaten an den Revenue Microservice übermittelt. Dazu gehören die Vertragsnummer, die Beträge und die SAP-Debitorennummer. Der Revenue Microservice erzeugt daraufhin einen Zahlungslink. Der Customer Microservice versendet eine E-Mail an den Kunden und ermöglicht ihm den Zugang zum Customer Account Center, wo die Kreditkarte validiert wird. Der Vertragsstatus wird auf „Waiting for Activation“ gesetzt. Sobald alle MO-Prüfungen erfolgreich abgeschlossen sind, wird der Vertrag aktiviert und auf „Active“ gesetzt. Revenue und Nemesis werden benachrichtigt, und die i155 wird erzeugt.

Der Vertrag wird somit aktiviert, ohne dass eine Bestätigung der Zahlung vorliegt. Die Zahlungsüberwachung erfolgt anschließend über Revenue, das den Vertrag bei Bedarf per Ereignis aussetzen oder wieder aktivieren lässt.

Ist die Zahlung sieben Kalendertage nach Erzeugung des Zahlungslinks nicht erfolgreich, sendet Revenue eine Anfrage zur Benachrichtigung des Kunden. Der Documents-Service bereitet die Vorlage für die Erinnerung vor, und der Vertragsservice versendet die Erinnerungs-E-Mail an den Kunden. Der Vertragsstatus bleibt dabei unverändert.

Ist die Zahlung auch 14 Kalendertage nach Erzeugung des Zahlungslinks nicht erfolgreich, fordert Revenue den Vertragsservice auf, den Dienstleistungsvertrag auszusetzen. Der Vertrag erhält den Status „Suspended“, und im Bereich „History“ wird der Eintrag „Payment Overdue“ vermerkt. Zusätzlich werden das Datum der Aussetzung und der Systembenutzer erfasst. Geht für einen bereits ausgesetzten Vertrag erneut eine Aussetzungsanfrage ein, wird sie ignoriert, und es entsteht kein doppelter Historieneintrag.

Wird die Zahlung nach der Aussetzung erfolgreich verarbeitet, bestätigt Revenue dies, und der Vertragsservice reaktiviert den Vertrag. Der Status wird wieder auf „Active“ gesetzt, und in der Historie erscheint der Eintrag „Payment Confirmed“. Geht die Zahlung dagegen nach mehr als sieben, aber vor Ablauf von 14 Tagen ein und ist der Vertrag nicht ausgesetzt, bleibt der Vertragsstatus unverändert, und es erfolgt keine Aussetzung.