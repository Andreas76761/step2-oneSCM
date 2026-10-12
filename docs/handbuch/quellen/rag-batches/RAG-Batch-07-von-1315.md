# Batch 7 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 32 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeugverwaltung (Vehicle Management)**

Der Import von Fahrzeugdaten aus CePrO wurde erweitert: Bisher wurden nur die Baureihen X, V, Citan, Vito, Viano und T übernommen, der Sprinter fehlte, da er in einer eigenen Produktgruppe (Light Transporters (L)) geführt wird, während nur die Produktgruppe V (Transporters Vitoria) importiert wurde. Außerdem wurde die Markenstruktur grundlegend überarbeitet. Die Marken tragen nun die Namen Mercedes-Benz, AMG und Maybach. Unter Mercedes-Benz fallen alle regulären Pkw, unter AMG alle Fahrzeuge der Marken Mercedes-AMG und AMG, unter Maybach alle Fahrzeuge der Marken Mercedes-Maybach und Maybach. Die Überarbeitung wurde als Gesamtpaket veröffentlicht, um die Änderungen für die Produktivumgebung so gering wie möglich zu halten.

**Fahrzeuggruppen und Produkte**

Das Anlegen von Fahrzeuggruppen wurde komfortabler gestaltet. Die Details einer Fahrzeuggruppe sind nun keine Pflichtangaben mehr. Der Name der Fahrzeuggruppe darf bis zu 100 Zeichen lang sein, die Beschreibung ist optional. Dies gilt für Pkw und Vans. In der Übersicht wird der Name bei Bedarf mit Auslassungspunkten gekürzt, der vollständige Name erscheint in einem Tooltip. Die Karten sind nach dem Namen der Fahrzeuggruppe sortiert. Beim Anlegen einer Fahrzeuggruppe wurde zudem behoben, dass einige Felder leere Werte oder einen Strich anzeigten. Im ersten Schritt wird ein Produkt vorausgewählt, sofern es aktuelle oder zukünftige Preisversionen besitzt. Veröffentlichte Produkte, die ausschließlich aktuelle Preisversionen haben, erscheinen dagegen nicht mehr in der Produktauswahl. Bei der Prüfung der Eindeutigkeit des Fahrzeuggruppennamens für Vans wird nun auch die Fahrzeuggruppen-ID berücksichtigt.

**Technische Optionen**

Die Logik der Technischen Optionen bei der Abfrage verfügbarer Produkte wurde angepasst. Die Liste der verfügbaren Technischen Optionen wird für Laufleistung und Laufzeit angezeigt. Abhängig von der Auswahl des Benutzers wird der Wert „included“ als wahr oder falsch zurückgegeben. Beim Anlegen einer Technischen Option mit der Option Reifengröße sollte der Gruppenname künftig nur aus zwei Ziffern bestehen. Das Feld bleibt deaktiviert, bis der Gruppentyp gewählt wurde.

**Vertragserstellung und Fahrzeugdaten**

Bei der Vertragserstellung lieferte die Fahrzeugverwaltung für die letzte Servicelaufleistung (lastServiceMileage) teils den Wert null. Der Hintergrund: Nach Eingabe von FIN/VIN erfolgt ein Aufruf bei VeDoc, und die Laufleistung wurde erst später per Batch-Job ergänzt. Dadurch konnten Verträge entstehen, die die Kriterien der vorvalidierten Laufleistung nicht erfüllten. Als Ziellösung wird bei Verwendung der FIN/VIN parallel zum VeDoc-Aufruf auch DSB angefragt, sodass bei der Produktauswahl aktuelle Service- und Laufleistungsinformationen vorliegen. Der Batch-Job bleibt bestehen. Ebenfalls behoben wurden das Anlegen von Verträgen mit falschen Laufleistungsangaben, die Fehlermeldung bei der Eingabe einer FIN während der Vertragserstellung sowie die fehlende Aktualisierung der Auftragsnummer im Fahrzeug-Tab.

**Oberfläche und Bedienung**

Mehrere Darstellungsfehler wurden korrigiert: Die Filter in der Fahrzeugverwaltung werden nach Klick auf die Reset-Schaltfläche nun zurückgesetzt, die Tabelle der nicht zugeordneten Fahrzeuggruppen funktioniert wieder korrekt, die Seite der Motorbaureihen wird nicht mehr alle 10 Sekunden neu geladen, und in der Pkw-Übersicht der Fahrzeuggruppen werden der Zähler für nicht zugeordnete Fahrzeuge und der Leerzustand korrekt zurückgesetzt. Die deutschen Übersetzungen im Produktmanagement wurden gemäß der Vorlage angepasst, wobei alle Bindestriche aus den deutschen Texten entfernt wurden.

**Administration und Schnittstellen**

Im Admin-Bereich unter VEGA-Codes werden Coverage Codes nun nicht mehr nur für DE im Payload übermittelt. Zudem wurde die Struktur der DSB-URL korrigiert, und im Hintergrund wurden Flyway-Skripte umbenannt sowie ein fehlender Endpunkt ergänzt. Wiederkehrende Warnungen und Fehler der vehicle-management-app in der Produktivumgebung wurden behoben, ebenso das Problem, dass drei von vier Produkten in der Produktivumgebung nicht sichtbar waren.

**Nicht umgesetzte Punkte**

Einige angefragte Änderungen wurden abgebrochen und sind nicht Teil des Releases. Dazu zählen die Verlängerung des CePrO-Importzeitraums von drei auf sechs Monate, die Anpassung des stündlichen Versands der E-Mail zu gesperrten Fahrzeugen, die Entfernung der Langbeschreibung bei Coverage Codes, die direkte Anwendung der Filter unter „Weitere Filter“ sowie die Behebung von Safari-spezifischen Darstellungsproblemen beim Anlegen von Produkten, bei Coverage Codes und beim Laden nicht zugeordneter Pkw. Auch die Analyse des täglichen 404-Fehlerberichts in der Vorproduktionsumgebung wurde nicht weiterverfolgt.