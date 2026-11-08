# Batch 722 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 22 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kostenmanagement: Werkstattrechnungen und internationale Rechnungen**

Internationale Werkstattrechnungen lassen sich jetzt direkt im Vertrag erfassen. Dafür wird dieselbe Oberfläche genutzt wie für eine normale Werkstattrechnung. Neu ist der Schalter „International Claims“, der standardmäßig deaktiviert ist. Aktivieren Sie ihn, erscheint ein zusätzliches Dropdown-Feld. Es enthält alle verfügbaren Märkte außer dem aktuellen Markt; die Liste stammt aus dem Dealership Management. Die übrigen Felder entsprechen denen einer normalen Werkstattrechnung.

Eine im Vertrag erfasste internationale Rechnung erhält zunächst den Status „Created“ und muss von einem anderen Benutzer der Market Operation freigegeben werden. Aus dem Status „Accepted“ exportiert ein Batch-Job die Rechnung per E169EXP nach NACOS, mit dem Rechnungstyp WSIN (Workshop Financial Document) und dem Flow-Typ „International Invoice“. Bei der Berechnung des Kontostands werden internationale Rechnungen berücksichtigt: Die Summe aller Vertragsforderungen und der aktuelle Kontostand beziehen sie mit ein. Im Admin-Bereich unter „Invoices“ erscheinen die internationalen Rechnungen zusammen mit allen anderen Rechnungen des Marktes und müssen von der Market Operation freigegeben werden. Sie werden nicht an das FI-System gesendet. Da die Rechnung bei Eingang in oneSCM im FI-System bereits bearbeitet und bezahlt wurde, wird sie auf den Status „Processed“ gesetzt; diese Umsetzung ist laut Ticket-Vermerk einem separaten Ticket vorbehalten. Sobald eine Rechnung den Status „Processed“ erhält, wird ein Cost Event für NEMESIS erzeugt.

Auch die manuelle Erfassung von Werkstattrechnungen wurde verbessert, um die Datenqualität zu erhöhen. Die Partnernummer (Vega ID) bleibt ein Textfeld. Nach Eingabe und Verlassen des Feldes wird beim Dealership Management mit dieser Nummer der Werkstattname samt SAP-Debitorennummer abgefragt. Beide Werte werden in der Rechnung angezeigt und gespeichert und bleiben gesperrt. Das Feld „Workshop Name“ ist standardmäßig deaktiviert und leer. Neu ist das Pflichtfeld „SAP Debtor Number“ (numerisch), das ebenfalls zunächst deaktiviert und leer ist. Liefert das Dealership Management keine SAP-Debitorennummer, wird das Feld editierbar, und die Nummer der Werkstatt muss manuell eingetragen werden. Beim Speichern der Rechnung wird die SAP-Debitorennummer an das Dealership Management übermittelt und dort in der Datenbank abgelegt. Ist der Händler dort noch nicht vorhanden, ruft das Dealership Management GSSN+ auf, speichert die Daten und liefert den Werkstattnamen zurück.

Für die Rechnungsnummern von oneSCM gilt ein neues Schema mit nur einer gemeinsamen Nummernfolge für Cost und Revenue, damit Rückmeldungen eindeutig zugeordnet werden können. Rechnungen aus dem Revenue Management haben das Muster 0YYXXXXXXX, Rechnungen aus dem Cost Management das Muster 1YYXXXXXXX. Dabei steht YY für das aktuelle Jahr (zum Beispiel 24 für 2024) und XXXXXXX für eine fortlaufende Nummer. Wird der Höchstwert 9999999 erreicht, wechselt das Muster auf 2YYXXXXXXX für Revenue und 3YYXXXXXXX für Cost.

Weitere Korrekturen und Verbesserungen im Kostenmanagement betreffen folgende Punkte:

- Bei importierten Werkstattrechnungen fehlte die Fahrgestellnummer.
- Die Batch-Jobs des Kostenmanagements liefen nicht.
- Beim Anlegen einer Rechnungsposition akzeptierten die Betragsfelder sowohl Kommas als auch Punkte.
- Der Gesamtbetrag einer Werkstattrechnung wurde nicht korrekt berechnet.
- Bei aus i156 importierten Rechnungen wird die Schaltfläche zum Hochladen von Anhängen nicht mehr benötigt.
- Für den i156-Import wurde eine Protokollierung ergänzt.
- Beim Versuch eines Market-Operation-Benutzers, eine Gutschrift im Status „Created“ zu akzeptieren, trat ein Fehler auf.
- Der Import der Schadencodes brach mit einem Speicherfehler („Out of memory“) ab.
- Werkstattrechnungen werden nun in Open Search indiziert.
- Die Werkstattrechnungsfunktion wurde an das Muster der früheren Teile-Steuerrechnung angepasst.

Einige geplante Änderungen wurden nicht umgesetzt (Status „Cancelled“): das Entfernen der Bruttobeträge und der Umsatzsteuer-Klassifizierung in der Werkstattrechnung, die Anzeige eines Links zur Vertragsnummer in systeminternen Benachrichtigungen bei Kundenrechnungen sowie die Anzeige von Tags bei der Suche nach Schadencodes.

Manuelle Testausführungen sind noch offen. Sie betreffen die Schadencode-Übersicht, den Import von Schadencodes, das Löschen manuell erstellter Werkstattrechnungen, die Detailansicht einer Werkstattrechnung, das Bearbeiten der Rechnungsposition in der Detailansicht sowie die Vermeidung doppelter Steuercodes.