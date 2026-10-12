# Batch 189 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Finanzkontrolle: Statusverfolgung für „Old Part Tax – Manual"**

Auf der Seite „Financial Control" zeigt der Reiter „Old Part Tax – Manual" den Status von Rechnungen bislang statisch als „Processed" an. Künftig spiegelt die Seite den aktuellen Stand jeder Rechnung wider, sodass jederzeit nachvollziehbar ist, ob eine Rechnung erstellt, akzeptiert, verarbeitet oder exportiert wurde. Das unterstützt insbesondere Auditprozesse.

Legt ein Benutzer eine manuelle Werkstattrechnung für einen verbundenen oder nicht verbundenen Händler an und erfasst dabei Old-Part-Tax-Werte, erscheint die Rechnung auf der Seite „Financial Control" mit dem Status „Created". Die Rechnung durchläuft wie gewohnt den bestehenden Freigabeprozess, bei dem ein weiterer Mitarbeiter (MO) sie genehmigt. Nach der Genehmigung wechselt der Status auf „Accepted". Wird anschließend der Batch E167 ausgeführt, hängt der weitere Status vom Händlertyp ab. Bei verbundenen (internen) Händlern wechselt der Status auf „Processed"; in diesem Fall werden keine Informationen an FI übermittelt. Bei nicht verbundenen (externen) Händlern wechselt der Status auf „Exported", und die relevanten Informationen werden an FI übermittelt. Jede dieser Statusänderungen wird auf der Seite „Financial Control" angezeigt. Dadurch wird der Lebenszyklus einer Rechnung von der Erstellung bis zum Export genau nachverfolgt und die Datenintegrität sowie Konsistenz der Seite sichergestellt.

**Aufteilung nach Divisionen PC und Van**

Für die Aufteilung der Organisation in die Divisionen PC und Van wurden im Bereich Revenue Management Anpassungen vorgenommen, damit Benutzer beider Divisionen eine passende Anwendung vorfinden. Zuvor kannte die Anwendung keine Rollen für die Divisionen PC oder Van. Der Zugriff auf Daten wird nun je Division per Berechtigung eingeschränkt, ebenso die Ansicht in der Benutzeroberfläche. Dies gilt für alle Rollen. Händler sehen nur Daten, die zur Organisationseinheit des Händlers gehören und zu ihrer divisionsspezifischen Berechtigung passen.

Dafür gibt es zwei neue Rollen. Benutzer mit der Rolle PC greifen nur auf PC-Daten zu und sehen in der Oberfläche nur PC-Optionen. Benutzer mit der Rolle Van greifen nur auf Van-Daten zu und sehen nur Van-Optionen. Sind einem Benutzer beide Rollen zugewiesen, hat er Zugriff auf Daten und Ansichtsoptionen beider Divisionen. Die Zugriffsbeschränkungen wurden für die Rollen Dealer, Dealer+, MO, MPC und HQ Admin in den Bereichen Revenue Management und Cost Management geprüft.

Für die Batch-Jobs ist im Zusammenhang mit der Divisionsaufteilung keine Anpassung vorgesehen. Sie müssen derzeit nicht an die Aufteilung angepasst werden.