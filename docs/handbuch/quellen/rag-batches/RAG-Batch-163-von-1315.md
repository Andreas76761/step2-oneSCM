# Batch 163 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 25 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Prüfungen**

**Darstellung von Werkstattrechnungen im Ansichtsmodus**

Die Ansicht von Werkstattrechnungen (Ansichtsmodus) wurde in der Benutzeroberfläche angepasst. Die Änderungen wurden für mehrere Rechnungsarten validiert: Kundenerstattungsrechnung (Customer Reimbursement Invoice), SIVECO-Rechnung, manuelle Werkstattrechnung und Vega-Claim. Für jede dieser Rechnungsarten wird geprüft, wie sich die Rechnungsposition darstellt, wenn nur ein einzelner Betrag enthalten ist oder wenn alle Beträge enthalten sind.

Bei der SIVECO-Rechnung und bei der manuellen Werkstattrechnung wurden die Fälle „nur Dealer Handling", „nur Sublets", „nur Materials", „nur Labour" sowie „alle Beträge" abgedeckt. Bei der Kundenerstattungsrechnung wurden die Fälle „nur Labour" und „alle Beträge" abgedeckt. Für diese Rechnungsarten gilt als Voraussetzung, dass ein Vertrag im Status „Aktiv" vorhanden ist.

Auch beim Vega-Claim wurden die Fälle „nur Dealer Handling", „nur Sublets", „nur Materials", „nur Labour" und „alle Beträge" geprüft. Als Voraussetzung wird hier eine i156-Datei für einen aktiven Vertrag vorbereitet. Diese Datei enthält jeweils nur den zu prüfenden Betrag und keinen der anderen Beträge (Labour, Materials, Sublets bzw. Dealer Handling). Für den Fall „alle Beträge" enthält die Datei alle vier Betragsarten.

**Batch-Jobs für alle Märkte in einer Ansicht**

Administrator- und MO-Benutzer sehen künftig alle Batch-Jobs aller Märkte in derselben Ansicht. Die Berechtigungen unterscheiden sich dabei nach Rolle: Administratoren können die Jobs ansehen, ausführen, planen und die zugehörigen Dateien herunterladen. MO-Benutzer können lediglich die Batch-Jobs und deren Job-Läufe einsehen.

Gibt es in einem Markt mehrere Batch-Jobs für denselben Zweck, zum Beispiel die CFDM-Batch-Jobs, bleibt der Name in allen Märkten gleich („CFDM Batch"). Die Unterscheidung erfolgt über die Spalte mit der Markt-ID. Diese Funktion wurde für die Märkte Slowakei, Indien und Deutschland geprüft.

**Weitere Prüfungen und Anpassungen**

Geprüft wurde außerdem die Entfernung des NACOS-Batch-Jobs SAPInvE169EXP sowie die erfolgreiche Ausführung des Jobs OneERPInvE169EXP. Ebenfalls verifiziert wurden der Sonderfall bei Case-Flow-Typ und Rechnungstyp.

**NEMESIS**

Die Liste der funktionalen Fehler für NEMESIS wurde aktualisiert. Die Fehler 83, 250 und 225 müssen dabei nicht umgesetzt werden. Der Fehler 247 gehört in den Contract Master und nicht in das Revenue Management.

Ein weiteres Vorhaben sah vor, beim Senden eines Events an NEMESIS den Payload des Events in Datadog zu protokollieren. Dieser Punkt ist geschlossen.