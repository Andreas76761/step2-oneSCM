# Batch 798 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**MO-Prüfungen (MO Checks) im Vertragsmanagement**

Die Ansicht „MO Checks" wurde so neu gestaltet, dass sie sowohl die Vertragserstellung (Contract Generation) als auch das Vertragsmanagement (Contract Management) abdeckt. Das System gibt damit klare und umsetzbare Rückmeldungen zu den Hintergrundprozessen, die durch Aktionen in diesen beiden Bereichen ausgelöst werden. So können MO und MPC Probleme oder Blocker, die den erfolgreichen Abschluss einer Aktion verhindern, effizient erkennen und beheben.

In der Ansicht werden nur Verträge angezeigt, bei denen mindestens eine Prüfung den Status „Pending" oder „Not OK (NOK)" hat. Sobald alle Prüfungen eines Vertrags bereinigt sind, er also keinen dieser beiden Status mehr aufweist, wird er automatisch aus der Liste entfernt.

Im Kopfbereich stehen Suchfelder für Vertragsnummer, Kundenname, Fahrgestellnummer und Kennzeichen sowie eine Schaltfläche „Suchen" zur Verfügung. Über ein „X" lassen sich die Suchkriterien zurücksetzen. Unter „Weitere Filter" kann zusätzlich nach der Domäne gefiltert werden, entweder nach Contract Generation oder nach Contract Management. Die Suche liefert die Verträge, die den eingegebenen Kriterien entsprechen.

Der Tabellenkopf zeigt die Beschriftung „Results" und bietet eine Seitennavigation, in der die Anzahl der Ergebnisse pro Seite angezeigt wird. Außerdem steht die Schaltfläche „Download Report" bereit, mit der ein Bericht auf Grundlage der aktuellen Ansicht erzeugt wird.

Die Vertragsliste enthält folgende Spalten: das Datum, an dem der Vertrag in die MO Checks aufgenommen wurde, die Fahrgestellnummer des Fahrzeugs, das zum Servicevertrag gehört, das Kennzeichen des Fahrzeugs aus dem Vertrag sowie die Vertragsnummer, die als Hyperlink zur Vertragsdetailansicht führt. Die Spalte „Domäne" ordnet einen Vertrag der Contract Generation zu, wenn er den Status „Created", „Waiting for Confirmation", „Confirmed" oder „Waiting for Activation" hat. Er gehört zum Contract Management, wenn sein Status „Active" oder „Suspended" ist. Die Spalte „Status" zeigt den aktuellen Status des Vertrags. In der Standardansicht werden ältere Einträge zuerst angezeigt, und Datensätze aus Contract Generation und Contract Management erscheinen gemeinsam. Die Tabelle kann nach jeder Spalte sortiert werden.

Wird ein Vertrag ausgewählt, öffnet sich rechts ein Vorschaubereich. Er zeigt die Kategorien der durchgeführten Prüfungen sowie den Status und die Gründe für jede einzelne Prüfung.

Beim Klick auf „Download Report" erzeugt das System eine Excel-Datei mit allen Datensätzen, die aktuell in der Tabellenansicht sichtbar sind. Die Datei enthält die Spalten „#", Datum, Fahrgestellnummer, Kennzeichen, Vertragsnummer, Domäne und Status.

Für Gestaltung und Grafik gelten die Vorgaben der Mercedes-Benz Workbench UI/UX.