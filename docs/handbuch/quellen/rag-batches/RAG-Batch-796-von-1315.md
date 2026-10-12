# Batch 796 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 32 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsverwaltung: Änderungen und Verbesserungen**

**Verlängerung (Prolongation)**

In der Produktivumgebung steht aktuell ausschließlich die langfristige Verlängerung (Long Term Extension) zur Verfügung. Wählen Sie bei einem aktiven Vertrag im Aktionsmenü die Option „Verlängern“, ist als Verlängerungstyp standardmäßig „Long Term Prolongation“ gesetzt. Das Feld ist schreibgeschützt. Die kurzfristige Verlängerung ist vorübergehend deaktiviert und soll zu einem späteren Zeitpunkt wieder bereitgestellt werden.

Bei der Konfiguration einer Verlängerung legen Sie Laufzeit, Laufleistung und optionale Zusatzdeckungen fest. Anschließend wird eine Übersicht erzeugt und der Vorgang geht zur Unterschrift weiter. Das Dokument, das der Kunde unterschreiben muss, enthält eine Vergleichstabelle mit den aktuellen Werten und den Werten nach der Verlängerung. Sie zeigt die Servicerate ohne Mehrwertsteuer, den Mehrwertsteuerbetrag, die Servicerate inklusive Mehrwertsteuer und den Mehrwertsteuersatz.

Läuft die Gültigkeit der Unterschrift ab, ohne dass der Kunde die Verlängerungsdokumente unterzeichnet hat, bleibt der Vertrag mit den ursprünglichen Konditionen aktiv. Die eingeleitete Verlängerung wird verworfen, sodass jederzeit eine neue langfristige Verlängerung angelegt werden kann, ohne die bestehenden Vertragsbedingungen zu beeinträchtigen.

Wurde bereits eine Verlängerung durchgeführt, berücksichtigt das System für die Preisberechnung nun die Werte der bis zum nächsten Gültigkeitsdatum gestellten Rechnungen. Diese Informationen stammen aus dem Bereich Revenue und umfassen Rechnungen mit dem Status „Exported“ und „Accepted“.

Bei bestehenden optionalen Zusatzdeckungen gilt eine Sonderregel: Hat sich die Preisversion geändert und enthält die neue Preismatrix für eine bereits im Vertrag vorhandene Zusatzdeckung keinen Wert, müsste die Deckung entfernt werden. Das ist nicht zulässig. Daher werden die betroffenen Laufzeit- und/oder Laufleistungswerte im Auswahlmenü nicht angeboten. Stattdessen erscheint ein Hinweis, warum Werte fehlen. Dies gilt sowohl für Fahrzeuge als auch für Produkte.

Zudem wurden mehrere Fehler behoben: Ein interner Serverfehler beim Abschließen einer Verlängerung tritt nicht mehr auf. Der Mehrwertsteuerbetrag im Servicevorschlag nach einer Verlängerung wird korrekt ausgewiesen, und die Verlängerungsdauer wird im Servicevorschlag nicht mehr verändert. In den Preisinformationen während der Verlängerung werden die Codes der optionalen Zusatzdeckungen wieder angezeigt, und deren Preise sind nun konsistent. Im Abschnitt „Vertragsänderungen“ erscheint der Deckungscode nicht mehr gleichzeitig in deutscher und englischer Fassung. Außerdem wurde ein falsch angezeigter Wert in der Verlängerung korrigiert.

**Vertragsstatus und Ablauf**

Läuft ein Vertrag mit aktivem Prüfprofil (Contract Review) ab und beträgt der Zahlungsbetrag nach dieser Prüfung 0, wird der Vertrag direkt auf „Geschlossen“ gesetzt. In der Historie erscheint die Statusfolge „Aktiv“, „Abgelaufen“, „Geschlossen“. Zudem funktioniert die Inanspruchnahme von Leistungen für Verträge mit Kontingentprodukt auch dann, wenn der Vertrag in den Status „Abgelaufen“ wechseln soll. Der Verbrauch von Kontingenten bei Reifenprodukten wird nun in der Schnittstelle I155 registriert.

**Schnittstellen**

In der I155-Datei wurden ein fehlendes Ende-Kennzeichen bzw. ein fehlender abschließender Zeilenumbruch sowie ein falscher Status bei abgelaufenen Verträgen korrigiert. Die Antwort der Schnittstelle getBatchContracts liefert nun zusätzlich FIN und VIN.

**Anzeige und Sprache**

Die Anzahl der Services wird bei Vertragserstellung und -verwaltung nicht mehr als „null“ dargestellt. Die Felder „Kampagnenbetrag“ und „Kampagnenname“ werden in der deutschen Oberfläche korrekt dargestellt. Der Standardgrund (Default Reason) wird bei einem Wechsel der Systemsprache aktualisiert, und Gründe in der Historie beginnen nicht mehr mit einem Großbuchstaben. Außerdem sind Vertragsaktionen in der Vorproduktionsumgebung wieder sichtbar und bearbeitbar.