# Batch 6 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 24 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeugverwaltung (Vehicle Management)**

Bei Fahrzeugen, deren Sonderausstattungsliste (SA-Codes) unterschiedliche Reifengrößen enthält, konnte bisher beim Anlegen eines Reifenvertrags kein Produkt zur Auswahl angezeigt werden. Für diese Fälle gilt nun eine neue Regel: Es wird immer die größere Reifengröße berücksichtigt und an die Vertragsgenerierung übergeben. Dadurch werden die passenden Reifenprodukte wieder angezeigt. Zudem wurde ein Fehler behoben, bei dem im Vertragsgenerierungsprozess eine falsche Reifengröße verwendet wurde.

Bei der Anbindung an CePro werden für Transporter (VANs) nun der Modelltyp in einer neuen Spalte des Fahrzeugtyps „Van“ gespeichert. Die Logik im Mapping berücksichtigt dabei den Status und speichert Transporter mit dem Status „INCLUDED“. Bisher wurden Transporter nur anhand des Baumusters eindeutig gespeichert. Diese Logik wurde angepasst, sodass der Modelltyp zur Unterscheidung herangezogen werden kann. Dabei können weiterhin Duplikate auftreten, die nicht gespeichert werden müssen.

Weitere Fehlerbehebungen betreffen den Upload von ISP-Codes, der wieder funktioniert, sowie das Löschen technischer Optionen, das nun ebenfalls möglich ist. Ein 403-Fehler, der das Anlegen eines Vertrags verhinderte, wurde behoben. Außerdem kann das Fahrzeuginformations-Thema nun auch Fahrzeugdaten ohne Kilometerstand (null-Wert) verarbeiten.

In der Benutzeroberfläche wurden mehrere Bezeichnungen angepasst. Die Seite „K/JX-Codes“ heißt nun auf Englisch „Service Interval“ und auf Deutsch „Wartungsintervall“. Die Schaltfläche „Versicherungsschutz bearbeiten“ lautet jetzt „Coverages bearbeiten“, und die Bezeichnung „Versicherungsdeckung“ in der Verwaltung von Produkten und Preisen wurde in „Coverages“ geändert. Bei den VEGA-Codes (Coverage Codes) wurde die Schreibweise „Sparteen“ zu „Sparten“ korrigiert. Bei der manuellen Erfassung einer Werkstattrechnung zu einem Vertrag wurde die deutsche Bezeichnung „Unterauftragnetteowert“ durch „Nebenkostennettowert“ ersetzt. Zusätzlich wurde die Coverages-Tabelle im Produktbereich optisch an die übrigen Tabellen angeglichen.

Für VEGA-Codes gilt zudem eine Zeichenbegrenzung von maximal 200 Zeichen. Sie betrifft im Administrationsbereich die Felder bei der Anlage von Coverage Codes (Coverage Name und Long Description im zweiten Schritt), Damage Codes (Description) und Industry Codes (Industry Name, nur im zweiten Schritt) sowie den Namen der Fahrzeuggruppe im Fahrzeuggruppen-Ablauf.

Fahrzeuggruppen lassen sich außerdem für zukünftige Preisversionen bearbeiten, auch wenn das zugehörige Produkt den Status „veröffentlicht“ hat. Zuvor musste das Produkt dafür deaktiviert werden, wodurch es nicht mehr verkauft werden konnte.

Noch offen ist die Verbesserung der Fahrzeuggruppenseite: Filter für „Assigned Product“ und „Price Version“ sowie der Suchbegriff im Feld „Vehicle Group Name“ sollen künftig erhalten bleiben, wenn man aus der Detailansicht oder nach dem Anlegen einer neuen Fahrzeuggruppe zur Seite zurückkehrt.