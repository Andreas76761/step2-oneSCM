# Batch 157 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 30 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Änderungen und Verbesserungen**

Im Bereich Revenue Management wurden mehrere Funktionen rund um den Export von Rechnungen und die Übermittlung von Ereignissen an Nemesis überarbeitet bzw. geprüft.

Für Rechnungen im Nicht-MPay-Ablauf werden Rechnungen der Typen MANU und MPPI, die sich im Status „Accepted“ befinden, exportiert und in der Tabelle angezeigt. Voraussetzung ist, dass eine entsprechende Nicht-MPay-Rechnung im Status „Accepted“ vorhanden ist. Zusätzlich wurde die Benutzeroberfläche der exportierten Dateien für SWTInvExp auf der Seite „Financial Control“ geprüft.

Die Übermittlung von Ereignissen an Nemesis wird über die Einstellung „Allow Nemesis Events to be sent“ gesteuert. Ist diese Einstellung aktiviert, werden Kosten-, Kunden- und Vertragsereignisse an Nemesis gesendet. Ist sie deaktiviert, werden Kosten-, Kunden-, Vertrags- und Umsatzereignisse nicht gesendet. Für Umsatzereignisse gilt bei aktivierter Einstellung zusätzlich eine Steuerung über die Nemesis-Umsatzstatus: Sind alle Nemesis-Umsatzstatus ausgewählt, wird das Umsatzereignis gesendet. Ist nur der Status „Accepted“ relevant, wird das Ereignis ausschließlich für diesen Status gesendet. Sind alle Nemesis-Umsatzstatus abgewählt, wird kein Umsatzereignis gesendet.

Bei Verträgen setzt ein Nemesis-Ereignis den Zahlungstyp abhängig von der Zahlungsweise des Vertrags: „01“ für monatlich, „02“ für einmalig, „04“ für vierteljährlich, „05“ für halbjährlich und „06“ für jährlich.

Darüber hinaus wurden verschiedene Fehler behoben und Anpassungen vorgenommen. Der Fehler beim Aufruf von Rechnungen aus dem Finanzmanagement wurde korrigiert. Beim Bearbeiten einer Rechnungsposition wird nun nicht mehr nur der Schadenscode, sondern der vollständige Titel angezeigt. Außerdem wurde das Problem behoben, dass bei der Ausführung der I155-Batch-Jobs keine neuen Dateien erzeugt wurden. Ein Fehler in den Nemesis-Umsatzereignissen mit fehlerhaften Daten wurde ebenfalls bearbeitet. Für die Rechnungsrückmeldedatei gilt eine aktualisierte Mapping-Regel: Der Zahlbetrag steht in den Positionen 58 bis 73, die Währung in den Positionen 74 bis 76. Damit wurde die Abweichung zwischen SWT- und Cofico-Index in dieser Datei adressiert.

Weiterhin wurde die fehlende Batch-Job-Konfiguration für einzelne Märkte behandelt: der Batch-Job „CFDMBatch“ für die Märkte Indien und Slowakei sowie „SWTInvEXP“ für Indien und „CoFiCoInvEXP“ für die Slowakei. Zudem steht ein Microfrontend für das CFT-Monitoring bereit.