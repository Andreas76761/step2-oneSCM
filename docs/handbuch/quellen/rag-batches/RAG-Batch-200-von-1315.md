# Batch 200 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Änderungen und Korrekturen**

**Rechnungs- und Verarbeitungsnummern**
Die oneSCM-Rechnungsnummer und die Verarbeitungsnummer werden künftig jedes Jahr zum 1. Januar auf den Anfangswert zurückgesetzt. Beide Nummern sind in oneSCM eindeutig. Es gibt weiterhin nur eine Nummernfolge für die oneSCM-Rechnungsnummer. Rechnungen aus dem Bereich Revenue folgen dem Muster 0YYXXXXXXX, Kosten-Rechnungen dem Muster 1YYXXXXXXX. Dabei steht die erste Ziffer für Revenue (0) bzw. Cost (1), YY für das aktuelle Jahr (24 für 2024, 25 für 2025 usw.) und XXXXXXX für eine fortlaufende Nummer. Wird für die fortlaufende Nummer der Maximalwert 9999999 erreicht, wechselt das Muster auf 2YYXXXXXXX für Revenue bzw. 3YYXXXXXXX für Cost. Beim Jahreswechsel beginnt der Zähler somit wieder von vorn, unabhängig davon, welcher Wert am 31. Dezember zuletzt vergeben wurde.

**Zahlungsreferenz im Export an Finanzsysteme**
Im Kundendatenmodell kann pro Kunde eine Zahlungsreferenz hinterlegt werden, die auf der Rechnung erscheinen soll. Ein Beispiel sind öffentliche Einrichtungen, die eine „Leitweg-ID" zur Zuordnung der Rechnungen angeben. Die Länge der Eingabe ist abhängig vom Finanzsystem begrenzt: Bei oneERP sind maximal 230 Zeichen erlaubt, bei SWT/CoFiCo maximal 90 Zeichen. Beim Export wird dem Wert jeweils das feste Wort „Reference" vorangestellt.

Beim Export von MPPI- und MANU-Rechnungen an oneERP wird die Zahlungsreferenz aus dem Kundendatenmodell abgerufen und in einer eigenen HTXT01-Zeile übertragen, getrennt vom üblichen HTXT01-Text. Beim Export an SWT/CoFiCo wird die Zahlungsreferenz im Header-Satz (Position 66 bis 305) übergeben. Bei MANU-Rechnungen besteht dieses Feld aus der Zahlungsreferenz und dem Kopftext, den der Benutzer bei der manuellen Erstellung eingegeben hat. Wird eine MPPI- oder MANU-Rechnung nach dem Export geöffnet, ist die Zahlungsreferenz im Kopfbereich der Rechnung sichtbar.

**Internationale Werkstattrechnungen (E169)**
Bisher ließ sich in der E169-Exportdatei für internationale Werkstattrechnungen nicht eindeutig erkennen, ob es sich um FIN oder VIN handelt, da das Feld „Fahrgestellnummer" in der Oberfläche beides enthalten kann. Dadurch fehlte die FIN im POS-Satz. Künftig wird bei der Erstellung der Rechnung VeDOC mit der Fahrgestellnummer abgefragt. Die zurückgelieferten Werte für FIN und VIN werden in der internationalen Werkstattrechnung gespeichert.

**Weitere Korrekturen**
Im Admin-Bereich wurde ein Fehler behoben, bei dem im Bereich „Rechnungen" die Meldung „Authentication forbidden" erschien. Ebenso wurde der Fehler „Authentication forbidden" beim Anlegen einer Werkstattrechnung behoben. Ein Problem mit dem Datumsfilter in der Rechnungsübersicht des Admin-Bereichs wurde geschlossen. Außerdem wurde die Datenbereinigung bei den Plausibilitätsprüfungen durchgeführt, bei der fehlerhafte Daten entfernt wurden. Ein weiteres Problem betraf die Exportdatei E174: Sie wurde erfolgreich exportiert, war aber auf der Seite mit den Batch-Job-Details nicht auffindbar. Dies wurde behoben. Zudem wurde in der oneERP-Exportdatei E169 eine fehlende SAP-Debitorennummer adressiert.