# Batch 1077 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation): Behobene Fehler und Anpassungen**

In der Vertragserstellung wurden mehrere Fehler behoben, die in der Entwicklungsumgebung (DEV) mit dem Browser Edge aufgefallen waren. Ein Fehler betraf den Zahlungsplan: Er wurde zweimal erzeugt, nämlich einmal bei der Aktivierung eines Vertrags und ein zweites Mal bei dessen Reaktivierung nach einer Unterbrechung. Dadurch wurde für einen Vertrag mit zwölf Monaten Laufzeit ein Zahlungsplan über 24 Monate angezeigt, also 24 statt 12 Rechnungen. Außerdem ließen sich bei der Eingabe der Fahrzeugdaten (Fahrgestellnummer, Erstzulassungsdatum und Laufleistung) die Produkte nicht auswählen und konfigurieren, sondern es erschien eine Fehlermeldung. Beim Start einer Vertragserstellung mit einer bestimmten Produktkonfiguration (Laufzeit 30 Monate, Zahlungsintervall „Einmalig“) trat zudem ein Fehler mit dem Status 409 auf.

Weitere Korrekturen betreffen die Anzeige und die Ausgabe von Daten. Auf der Registerkarte „Historie“ der Vertragsübersicht wurde im Feld „Benutzername“ bislang der Kundenname angezeigt, und zwar sowohl in der Vertragserstellung als auch in der Vertragsverwaltung. Nun erscheint dort der Name des Benutzers, der in der Anwendung angemeldet ist. Die Vertragsvorschau als PDF in Schritt 3 des Assistenten wurde im Datenformat an das für die gesamte Anwendung vereinbarte Format angepasst. Als Beispiele gelten das Datum im Format 12.11.2023, die Laufleistung im Format 10.000 km, die Servicevertragslaufzeit im Format „6 Months“ sowie Sprache und Land, etwa Englisch und Deutschland. Ebenfalls behoben wurde, dass die Adressinformationen des Zahlers auf dem Vertrag nicht angezeigt wurden.

Auch der Export wurde korrigiert. Die Funktion, in einem beliebigen Vertrag unter „Documents & Notifications“ ein Dokument zu exportieren, funktionierte nicht. Außerdem schlug der Export der I155-Datei fehl, weil bei der Abfrage von Produktdaten ein Fehler mit dem Status 404 auftrat.

Schließlich wurde die Konfiguration der Laufleistungsoptionen angepasst: Diese können sich nun abhängig von der gewählten Laufzeit unterscheiden.

Eine geplante Änderung in Schritt 3 „Übersicht und Bestätigung“ wurde nicht umgesetzt. Dort sollte das Produktbild angezeigt werden, und zwar ohne Verlinkung auf eine andere Seite. Das zugehörige Ticket wurde abgebrochen.