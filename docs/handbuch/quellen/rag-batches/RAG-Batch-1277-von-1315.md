# Batch 1277 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 75 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise Contract Calculation: Fehlerbehebungen und Verbesserungen**

Im Bereich Contract Calculation wurden zahlreiche Fehler behoben und das Verhalten des Systems an mehreren Stellen verbessert. Die folgenden Abschnitte fassen die Änderungen nach Themen zusammen. Fehlerbehebungen, die ausschließlich abgebrochene Vorgänge betreffen, sind hier nicht aufgeführt.

**Produktverwaltung und Produkterstellung**

Der Ablauf zur Produkterstellung wurde an mehreren Stellen überarbeitet. Die Validierung des Industry Codes erfolgt nun bereits in Schritt 1, und die Konfiguration eines Industry Codes führt nicht mehr zu einem Fehler. Auch der Name des Industry Codes wird korrekt aktualisiert. Entwürfe von Produkten lassen sich wieder vollständig abschließen, auch wenn zuletzt Schritt 4 (Definition der Preismatrix) bearbeitet wurde. Zudem ist die Navigation zu Schritt 7 wieder möglich. Der Parameter „Maximum Vehicle Mileage at Contract End“ in der Preismatrix-Definition wurde korrigiert, ebenso die Maßeinheit für die Schrittweite bei den Laufzeitoptionen. Die Reihenfolge im Dropdown „Division“, das zuvor umgekehrt angezeigt wurde, ist nun korrekt. Beim Bearbeiten eines Produkts wird kein unnötiger API-Aufruf mehr ausgelöst.

Beim Veröffentlichen von Produkten wurden mehrere Probleme beseitigt. Die irreführende Fehlermeldung „Authentication forbidden“ erscheint nicht mehr, auch nicht bei Produkten mit Terms & Conditions, die ein Datum in der Zukunft tragen. Ebenso führt die Veröffentlichung eines Produkts, dessen Preisversionsdatum mit dem Datum der Terms & Conditions übereinstimmt, nicht mehr zu einem Fehler. Wenn alle Cluster aus einem Produkt entfernt werden, bleibt das Produkt nicht mehr im Status „Ready“. Außerdem kann die Seite zur Preiszuweisung für ein gelöschtes Produkt nicht mehr aufgerufen werden. Die Fehlermeldung „Product name already used“ wurde korrigiert.

Die Suche und Filterung von Produkten funktionieren zuverlässiger. Der Produktnamen-Filter liefert keine irrelevanten Ergebnisse mehr und unterscheidet nicht mehr zwischen Groß- und Kleinschreibung. Auch die Spaltensortierung nach Produktname berücksichtigt Groß- und Kleinschreibung nicht mehr. Nach dem Blättern durch die Seiten desselben Moduls erscheint bei der Produktsuche keine Fehlermeldung mehr. Die Seite „Manage Products & Prices“ zeigt ihre Daten wieder an. Die Preisinformation zeigt nicht mehr fälschlich „Ab“-Preise an, wenn Produkte bereits konfiguriert wurden. Die Preisinformations-E-Mail enthält für B2C-Kunden nun Bruttopreise statt Nettopreise. Bei der Vertragserstellung stimmen die optionalen Deckungen wieder mit den Produkten überein. Ein Tippfehler im Namen der Optionalen Deckungen wurde korrigiert.

**Blueprints und Coverage Codes**

Beim Zurückgehen über die Zurück-Schaltfläche wird keine Blueprint-Aktualisierungsmeldung mehr ausgelöst. In Schritt 2 eines Blueprints ragen die Tags der Coverage Codes nicht mehr über das weiße Feld hinaus, wenn viele Deckungen ausgewählt sind. Ein Blueprint, zu dem ein veröffentlichtes Produkt existiert, lässt sich nun korrekt behandeln.

Beim Bearbeiten eines Coverage Codes wird der Markt jetzt korrekt gesetzt, wenn die Option „Custom Markets“ gewählt ist. Die Coverage Category ist beim Bearbeiten nicht mehr fälschlich aktiviert. Beim Suchen nach einem Coverage Code erscheint nach dem Blättern durch die Seiten des Moduls keine Fehlermeldung mehr.

**Preisversionen**

Zukünftige Preise können bei kopierten oder geklonten Preisversionen wieder bearbeitet werden. Wird eine Preisversion unter einem bereits vorhandenen Namen dupliziert, lässt sie sich nun korrekt speichern. Das auffällige Verhalten beim Duplizieren von Preisversionen mit Referenz-Clustern wurde behoben. Ebenso tritt beim Klonen einer Preisversion mit Cluster für ein Van-Produkt keine Fehlermeldung mehr auf.

**Kampagnen**

In der Kampagnenverwaltung funktioniert die Suche nach Status wieder. Die Suche nach Kampagnen liefert nicht mehr die Meldung „Failed to read request“. Die Produktauswahl per Radiobutton bleibt nach dem Abbrechen nicht mehr ausgewählt. Das Ändern von Produkten und Fahrzeuggruppen in einer bevorstehenden Kampagne funktioniert wieder. Der Gesamtrabatt von Sticker-Price-Kampagnen wird korrekt berechnet, und die Matrixwerte einer aktiven Sticker-Price-Kampagne sind nicht mehr bearbeitbar. Außerdem wurden eine unerwartete Fehlermeldung sowie eine falsche Beschreibungsmeldung in der Kampagnenverwaltung korrigiert.

**Cluster und Fahrzeuggruppen**

Fahrzeuggruppen, die gelöschten Clustern zugeordnet waren, stehen beim Anlegen eines neuen Clusters wieder zur Verfügung. Im Feld „Cluster Reference“ wird das Cluster, das gerade bearbeitet wird, nicht mehr als Auswahloption angeboten. Das Feld „Cluster Name“ ist in der Ansicht „View“ nicht mehr bearbeitbar. In der Cluster-Übersicht werden nun alle ausgewählten Klassen angezeigt. In der Fahrzeuggruppen-Verwaltung werden die Karten beim Zurücksetzen der Filter ebenfalls zurückgesetzt. Beim Wechsel von Schritt 3 zu Schritt 2 landet man nicht mehr in Schritt 1, und der Zustand wird nicht mehr zurückgesetzt.

**Produkttests**

Beim Testen von Produkten wurden mehrere Fehler behoben: Die Auswahl des FRD ist wieder möglich, und der FRD wird nach dem Klick auf „Go to Products“ nicht mehr fälschlich aktiv. Ein zukünftiges Testdatum funktioniert nun für alle Status. Die Einstellung „Sales Level“ arbeitet korrekt.

**TO-Gruppen**

Es werden nicht mehr alle TO-Gruppen angezeigt, doppelte TO-Gruppen lassen sich nicht mehr anlegen, und die Paginierung funktioniert wieder. Der Titel wird korrekt dargestellt. Die Funktion „Add to Groups“ ist für veröffentlichte Produkte nicht mehr aktiviert.

**Allgemeines und Import**

Die Karten der Startseite sind in anderen Sprachen als Englisch nun korrekt ausgerichtet. Fehler beim CePro-Import, einschließlich des Fehlschlagens des Import-Batch-Jobs auf der INT-Umgebung, wurden behoben.