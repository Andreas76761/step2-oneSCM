# Batch 198 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Neue Validierung der Ausgangsrechnungsdatei für SWT und CoFiCo**

Für die Exportläufe SWTInvExp und CoFiCoInvExp wurde eine neue Validierungsregel eingeführt, die die erzeugte Ausgangsrechnungsdatei prüft, bevor sie im vorgesehenen Pfad im S3-Ordner abgelegt wird. Bislang fand für diese Datei keine Prüfung statt. Die Regel soll Abweichungen zwischen der angegebenen und der tatsächlichen Anzahl an Rechnungspositionen verhindern und so Folgeprobleme im Finanzsystem (FI) vermeiden.

Dabei vergleicht das System die im Kopfsatz der Datei hinterlegten Zähler, nämlich die Gesamtzahl der Rechnungsköpfe und die Gesamtzahl der Rechnungspositionen, mit der tatsächlichen Anzahl in der Datei. Weist der Kopfsatz beispielsweise zwei Rechnungsköpfe und zwei Rechnungspositionen aus, muss die Anzahl der Kopf- und Positionssätze in der Datei damit übereinstimmen.

Stimmen die Zähler nicht überein, wird ein Eintrag mit allen relevanten Details in Datadog protokolliert und der gesamte Vorgang zurückgesetzt. Dabei wird der Status aller Rechnungen der betroffenen Datei automatisch von „Exported“ wieder auf „Accepted“ gesetzt. Außerdem werden die Verarbeitungsnummer und das FI-System-Übertragungsdatum gelöscht, da zunächst die Ursache der Abweichung analysiert werden muss. Dieser Rollback erfolgt, bevor die Datei im S3-Ordner abgelegt wird.

Auf der Batch-Job-Seite gibt es für die beiden Batches außerdem den neuen Status „Validation Error“, der angezeigt wird, wenn die Validierung fehlschlägt. Ist die Ursache behoben und der Export-Batch erneut gestartet, werden die zurückgesetzten Rechnungen erneut an SWT bzw. CoFiCo übermittelt. Dabei werden eine neue Verarbeitungsnummer und ein neues FI-System-Übertragungsdatum erzeugt. Da die Rechnungen wieder den Status „Accepted“ haben, werden sie im regulär nächsten Lauf der Schnittstelle abgerechnet.

**Weitere Änderungen im Bereich Revenue Management**

Zusätzlich wurden eine Weiterleitung für nicht existierende Rechnungen in der Ansicht (Frontend) ergänzt und ein Problem behoben, bei dem der Batch-Job DocumentSignatureStatusJob im Status „Running“ hängen blieb.