# Batch 309 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Überwachung und Benachrichtigung im Reporting-Datenfluss**

Im Reporting wurde die Überwachung des Datenflusses erweitert, sodass nun alle relevanten Fälle von nicht verarbeiteten Datensätzen, fehlenden Daten für einzelne Märkte oder Sparten sowie Job-Fehlern abgedeckt sind. Damit ist eine durchgängige Überwachung vom Quellsystem bis ins Reporting möglich. Die Datenprodukte bleiben so mit den Quellanwendungen abgestimmt, und Abweichungen werden zeitnah gemeldet und können weiter untersucht werden.

Wird ein Datensatz, den DCS bereitgestellt hat, im Reporting nicht erfolgreich verarbeitet, oder weicht die Anzahl der gelesenen von der Anzahl der geschriebenen Datensätze ab, wird automatisch eine Benachrichtigung ausgelöst, zum Beispiel per E-Mail. Der Empfängerkreis ist nicht auf das technische Team beschränkt, sodass auch Mitglieder der Fachbereiche einbezogen werden können. Fehlerhafte Datensätze, etwa wenn wesentliche Angaben fehlen, werden von der Verarbeitung ausgeschlossen und gemeldet. Die übrigen Datensätze werden weiterverarbeitet, der Job bricht nicht ab. Die Meldung enthält Informationen dazu, welche Daten betroffen sind, damit sie im Quellsystem geprüft werden können. Das Gleiche gilt, wenn die Daten eines Marktes oder einer Sparte unvollständig sind: Die Verarbeitung für die anderen Märkte und Sparten läuft weiter.

Die Benachrichtigung nennt den Bezug zum Reporting, die Quelle (zum Beispiel Nemesis), den Markt und die Anzahl der unvollständigen Daten, beziehungsweise den Hinweis, dass der gesamte Job fehlgeschlagen ist. Fehlen mehrere Datensätze, werden sie gruppiert und in einer einzigen E-Mail zusammengefasst, nachdem der Reporting-Job abgeschlossen wurde. Ein Beispiel ist die Meldung, dass 23 Verträge aus Nemesis für den Markt BE nicht verarbeitet werden konnten. Bei einem Job-Fehler enthält die Benachrichtigung die Job-Details sowie Quelle und Markt. Zusätzlich wird automatisch ein Incident-Ticket mit allen Angaben erstellt, die zur Identifikation des betroffenen Jobs oder der betroffenen Datensätze und für die Untersuchung nötig sind. Ob ein Incident bei einem Job-Fehler angelegt wird, war in den Unterlagen noch zu klären.

Für diese Benachrichtigung ist kein Abonnement erforderlich. Damit entfällt auch das bisher nötige erneute Abonnieren nach jedem neuen Deployment.

**Weitere Änderungen im Reporting**

Der erstmalige vollständige Ladevorgang der ISP-Daten ist in ein Timeout gelaufen; das Thema wurde bearbeitet und abgeschlossen. Ebenfalls abgeschlossen wurden die Auswertung der AWS-Inspector-Findings vom 6. Februar 2026 sowie die Aktivierung des Reporting-Service-Schedulers für die regelmäßige monatliche Verarbeitung des Datenprodukts Nemesis / Financials. Damit kann die monatliche Verarbeitung getestet werden, die durch eine über den CFT-Fluss in oneSCM DCS eingehende Nemesis-Datei gestartet wird.

Außerdem wurde das Datenprodukt Customer über Lake Formation für AQUA bereitgestellt. Es liegt in der Datenbank sc_dataproduct_db und umfasst die Tabellen base_sc_cust_contract und base_sc_cust_customer.