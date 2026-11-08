# Batch 821 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vereinheitlichte Vertragshistorie im Contract Management**

Für jeden ausgewählten Vertrag wird im Reiter „History" der Contract-Management-Startseite nun eine einzige Tabelle mit dem Namen „Contract History" angezeigt. Zuvor bestand die Historie aus zwei getrennten Bereichen, der VEGA-Historie und der Vertragsstatus-Historie. Die neue Tabelle führt beides zusammen: Sie zeigt alle Statusänderungen eines Vertrags nach seiner Aktivierung, die am Vertrag vorgenommenen Änderungen sowie den letzten Export an VEGA. Die bisherigen VEGA-Historieneinträge sind nicht mehr Bestandteil der Anzeige. Die Anwendungsfälle der Vertragserstellungs-Workflows werden derzeit noch nicht berücksichtigt.

Folgende Änderungen werden in der Tabelle festgehalten: die Umstellung des Zahlungsintervalls von monatlich auf einmalig, die Änderung des Kundennamens bei einer Vertragsübertragung, die Änderung des Zahlers, die Änderung des geplanten Vertragsendes beziehungsweise der geplanten Gesamtlaufleistung (km) bei einer Verlängerung (Langzeit- oder Kurzzeitverlängerung), die Änderung von Fahrzeugdaten wie FRD und Kennzeichen sowie die Änderung von Vertragsdaten wie Vertragsbeginn und Laufleistung bei Vertragsbeginn (km).

Die Tabelle enthält die Spalten „Modified Object", „Reason", „Old Value", „New Value", „Date", „Modified by" und „Comment". Ist für ein Feld kein Wert vorhanden, wird „-" angezeigt. Beim Eintrag „Last export to VEGA" werden als alter und neuer Wert jeweils Datum und Uhrzeit des Exports angegeben. Für Benutzer mit der Rolle Administrator ist dieser Zeitstempel ein Hyperlink. Ein Klick darauf lädt exakt die i155-Datei herunter, die zu diesem Zeitpunkt erzeugt wurde; sie stammt aus den Batch Jobs im Admin-Bereich. Für alle anderen Benutzer wird der Zeitstempel als einfacher Text dargestellt.

Oberhalb der Tabelle erscheint ein Hinweis zur Anzahl der angezeigten Einträge, beispielsweise „Displaying 1 of 10 records". Oben rechts an der Tabelle steht ein Auswahlmenü für die Seitengröße mit den Optionen 10, 20, 30, 40 und 50. Standardmäßig werden 10 Einträge angezeigt, weitere Einträge folgen auf den nächsten Seiten. Am unteren Tabellenrand befindet sich die Seitennavigation; ein Klick auf eine Seitenzahl führt zur jeweiligen Seite. Die Spalten lassen sich wie gewohnt sortieren, standardmäßig stehen die neuesten Änderungen oben.

**Verlängerung nur mit monatlichem Zahlungsintervall**

Bei einer Vertragsverlängerung, sowohl als Kurzzeit- als auch als Langzeitverlängerung, ist als Zahlungsintervall ausschließlich „Monatlich" möglich. Bisher war eine Langzeitverlängerung auch mit einmaliger Zahlung möglich. Das Zahlungsintervall ist nun standardmäßig auf „Monatlich" gesetzt und nicht änderbar. Ein Wechsel von monatlich auf einmalig ist während einer Verlängerung deaktiviert.

**Weitere Anpassungen im Contract Management**

Im Admin-Bereich wurde das doppelte Anzeigen des Contract-Review-Profils im Reiter behoben. Außerdem wurden mehrere Fehler in der Vertragsprüfung (Contract Review) und auf der Seite „Operative Review" behoben, darunter die fehlende Formatierung der Laufleistung, mehrere Fehlermeldungen beim Aufruf des Bereichs sowie die Darstellung von Datumsangaben in zwei unterschiedlichen Formaten. Ebenfalls korrigiert wurde der E-Mail-Versand bei der Übertragung eines Vertrags auf einen CAS-Treffer-Kunden.