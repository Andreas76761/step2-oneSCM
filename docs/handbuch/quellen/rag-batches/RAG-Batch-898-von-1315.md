# Batch 898 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Technische Fehlerbehandlung bei der Prüfung vor der Vertragsaktivierung**

Bei der Erstellung eines Vertrags führt das System alle verpflichtenden Aktivierungsprüfungen aus. Jede Prüfung kann dabei einen der folgenden Status annehmen: OK, Nicht OK, Ausstehend, Nicht anwendbar oder, neu hinzugekommen, Ausführung fehlgeschlagen. Der Status wird für jede Prüfung auf Feldebene am Vertrag gespeichert. Wird eine Prüfung erfolgreich ausgeführt, lautet das Ergebnis je nach Ablauf OK, Nicht OK oder Ausstehend. Kann eine Prüfung wegen eines technischen Problems nicht ausgeführt werden, etwa durch eine Zeitüberschreitung bei einer API-Abfrage oder weil ein Dienst nicht erreichbar ist, setzt das System den Status auf „Ausführung fehlgeschlagen“.

Dieser Status wird in Violett dargestellt. Die zugehörige Beschreibung weist darauf hin, dass die Prüfung aufgrund eines technischen Fehlers nicht ausgeführt werden konnte und automatisch erneut versucht wird. Der Status kann vom MO weder bestätigt noch übersteuert werden.

Ein Vertrag kann seinen Status nicht ändern, solange eine erforderliche Prüfung den Status „Ausführung fehlgeschlagen“, „Nicht OK“ oder „Ausstehend“ hat. Dadurch ist sichergestellt, dass technische Störungen nicht dazu führen, dass ein Vertrag ohne ordnungsgemäße Validierung im Lebenszyklus voranschreitet. Prüfungen mit dem Status „Nicht anwendbar“ bleiben bei dieser Bewertung unberücksichtigt: Sie blockieren den Vertrag nicht und werden auch nicht als „Ausführung fehlgeschlagen“ markiert.

**Automatische Wiederholung durch den Batch-Job**

Fehlgeschlagene Prüfungen werden automatisch über den Batch-Job „MO Checks Sync“ erneut ausgeführt. Der Job läuft pro Markt und verarbeitet ausschließlich Prüfungen mit dem Status „Ausführung fehlgeschlagen“. Dazu sucht er alle Verträge mit einer solchen Prüfung und führt nur diese Prüfungen erneut aus; alle anderen Status werden ignoriert. Ist die Ausführung erfolgreich, wird der Status auf das entsprechende Ergebnis (OK, Nicht OK oder Ausstehend) aktualisiert. Besteht das technische Problem weiterhin, bleibt der Status „Ausführung fehlgeschlagen“, und die Prüfung wird beim nächsten geplanten Lauf erneut versucht.

**Konfiguration und Steuerung des Jobs**

Standardmäßig läuft der Job alle 24 Stunden. Die Konfiguration entspricht der aller bestehenden Batch-Jobs. In der Konfigurationstabelle werden Jobname („MO Checks Sync“), Jobstatus (aktiviert oder deaktiviert), Markt-ID, der Zeitpunkt des letzten Laufs und der Zeitpunkt des nächsten Laufs angezeigt. Die Zeitangaben erfolgen im Format TT/MM/JJJJ HH:MM:SS AM in UTC.

Für den Job stehen folgende Aktionen zur Verfügung: „Anzeigen“ (ohne Datenanzeige), „Jetzt ausführen“ (startet den Job sofort), „Stoppen“ (beendet eine laufende Ausführung), „Planen“ (zur Festlegung eines Ausführungszeitplans) und „Deaktivieren“ (schaltet den Job ab). Wählt ein berechtigter Benutzer „Jetzt ausführen“, startet der Job unmittelbar, und es wird ein neuer Ausführungsdatensatz angelegt.

**Ausführungshistorie**

Wie bei allen bestehenden Batch-Jobs wird zu jeder Ausführung ein Eintrag gespeichert. Er enthält die eindeutige Job-ID, Start- und Endzeit im oben genannten Format, die Dauer der Ausführung, den Status (abgeschlossen, fehlgeschlagen oder gestoppt) sowie die Benutzer-ID desjenigen, der den Job ausgelöst hat.