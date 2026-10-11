# Batch 1007 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Produktvergleich in der Vertragserstellung**

Händler und Mitarbeitende der Market Operations können in der Vertragserstellung Produkte miteinander vergleichen, um Endkunden die Vor- und Nachteile der einzelnen Optionen aufzuzeigen. Dazu starten Sie die Vertragserstellung und geben die Fahrzeugkennung ein. Werden mindestens zwei Produkte angezeigt, ist oberhalb der Produktkarten die Schaltfläche „Compare Product" aktiv. Wird zur eingegebenen Fahrzeugkennung nur ein einziges Produkt zurückgegeben, bleibt die Schaltfläche deaktiviert.

Mit einem Klick auf „Compare Product" starten Sie den Auswahlmodus. Auf jeder Produktkarte erscheint ein Auswahlpunkt, und zusätzlich wird eine Spalte mit den Nummern 1, 2 und 3 eingeblendet. Diese Nummern stehen für die Plätze im Vergleich. Wählen Sie ein erstes Produkt aus, wird Platz 1 markiert, beim zweiten Produkt Platz 2 und so weiter. Es müssen mindestens zwei und dürfen höchstens drei Produkte ausgewählt werden. Mit dem „X" brechen Sie den Vergleichsvorgang ab. Mit dem Haken gelangen Sie zum Vergleichsfenster, sofern mindestens zwei Produkte ausgewählt sind. Klicken Sie während der Auswahl auf ein Produkt, öffnen sich dessen Produktdetails. Kehren Sie anschließend über „Zurück zu den Produkten" oder die Zurück-Funktion des Browsers zurück, wird der Vergleichsmodus nicht fortgesetzt. Der Vorgang muss dann neu gestartet werden.

**Aufbau des Vergleichsfensters**

Das Vergleichsfenster zeigt die gewählten Produkte nebeneinander, pro Produkt eine Spalte. Die erste Zeile enthält die Produktnamen. Sie sind schreibgeschützt und werden dynamisch angezeigt. Wenn vorhanden, wird zusätzlich eine Auszeichnung wie „Excellent" dargestellt; diese Auszeichnungen werden mit der Produktkalkulation in PI5 umgesetzt. Die ersten beiden Zeilen bleiben beim Herunterscrollen immer sichtbar. Die zweite Zeile enthält statische allgemeine Informationen, die dritte je ein Produktbild pro Spalte.

In der Preiszeile ist der Inhalt dynamisch und schreibgeschützt. Standardmäßig wird der Startpreis des jeweiligen Produkts angezeigt, ein Preis pro Spalte. Sobald Vertragslaufzeit, Jahreslaufleistung oder Anzahl der Services sowie das Zahlungsintervall ausgewählt sind, wird der angezeigte Preis gemäß der Preiskonfiguration aktualisiert.

Es folgen die Auswahlzeilen für Vertragslaufzeit, Jahreslaufleistung, Anzahl der Services und Zahlungsintervall. Die Anzahl der Services gilt nur für Contingent-Produkte. Alle vier Zeilen funktionieren nach demselben Prinzip: Jede Zeile bietet pro Produkt ein Dropdown-Menü, das die für dieses Produkt wählbaren Werte anzeigt. Sobald Sie einen Wert erstmalig in einer beliebigen Spalte auswählen, wird derselbe Wert in den übrigen Spalten übernommen, sofern er dort verfügbar ist. Ist er nur bei zwei von drei Produkten verfügbar, zeigen diese beiden den gleichen Wert, und beim dritten Produkt müssen Sie selbst eine der Optionen wählen. Möchten Sie einen Wert ändern, wählen Sie im Dropdown-Menü eine andere Option; diese Änderung wird nicht auf die anderen Spalten übertragen. Verfügt ein verglichenes Produkt über das jeweilige Merkmal nicht, wird „n/a" angezeigt.

Die Beschreibungszeile zeigt dynamisch die Produktbeschreibung, die bei der Produktdefinition hinterlegt wurde. Darauf folgt die Zeile „Coverage" mit statischen Informationen. In den weiteren Zeilen wird pro Zeile eine Leistung aus allen für die Division (Passenger Car) verfügbaren Contingents aufgelistet. Ein zentriert ausgerichteter Haken in der Produktspalte zeigt an, dass das Produkt die Leistung enthält, ein „X", dass sie nicht enthalten ist.

**Aktionen im Vergleichsfenster**

Mit „Select" setzen Sie die Vertragserstellung mit Schritt 2, der Erfassung der Kundendaten, fort. „Back" führt Sie zurück zur Produktauswahl, in der alle Produkte aufgelistet sind. „Print" druckt den Vergleich aus. Über „Send Email" öffnet sich ein neues Fenster, mit dem Sie den Vergleich an einen potenziellen Kunden senden können, entsprechend der Funktion für das unverbindliche Angebot in der Produktauswahl (Drucken / E-Mail-Versand).

Die Oberfläche richtet sich nach der Mercedes-Benz Workbench und entspricht dem vom Kunden freigegebenen UI-Design.