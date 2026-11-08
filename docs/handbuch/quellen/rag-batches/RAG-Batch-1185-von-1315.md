# Batch 1185 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation**

**Verkaufspriorität für Produkte**
Für Produkte steht nun ein Attribut „Sales priority" zur Verfügung, mit dem Marktanwender die Reihenfolge beeinflussen können, in der Produkte im Verkaufsprozess angezeigt werden. Beim Anlegen eines Produkts gibt es dafür ein neues numerisches Feld, das Werte von 1 bis 99 akzeptiert und nur numerische Eingaben zulässt. Die Beschriftung weist darauf hin, dass niedrigere Zahlen in der Anzeigereihenfolge zuerst erscheinen. Ein Info-Tooltip erläutert: „Enter a number to indicate the position of this product in the Contract Generation flow". Eine Eindeutigkeitsprüfung für die Priorität findet nicht statt, mehrere Produkte können also dieselbe Priorität haben.

In der Produktübersicht wird zusätzlich eine Spalte „Sales priority" angezeigt, die für jedes Produkt den jeweiligen Wert ausweist. Standardmäßig ist die Übersicht aufsteigend nach dieser Spalte sortiert; die Sortierung lässt sich ändern, und der Tooltip zeigt die aktuelle Sortierrichtung (aufsteigend oder absteigend) an. Bei der Übergabe der Produkte an den Verkaufsprozess werden diese nach Priorität geordnet. Fehlt die Priorität oder haben Produkte dieselbe Priorität, werden sie alphabetisch sortiert übermittelt.

**Kampagnendefinition nach Kundentyp**
OneSCM unterscheidet bislang die Kundentypen Privat und Gewerblich, die im Vertragsgenerierungsmodul vor allem zur Berücksichtigung der geltenden Steuersätze gewählt werden. Künftig soll mit „Commercial Fleet" eine dritte Kategorie hinzukommen. Kampagnen waren bisher nicht nach Kundentyp definierbar. Nun können Kampagnen einem oder mehreren Kundentypen zugeordnet werden, sodass die passenden Kampagnentypen in den Verkaufsprozess übergeben werden.

Beim Definieren einer Kampagne im Bereich „Kampagnen verwalten" steht dafür eine Dropdown-Liste mit Mehrfachauswahl zur Verfügung. Die Werte sind fest vorgegeben. Das Feld ist ein Pflichtfeld: Ohne Auswahl mindestens eines Kundentyps kann der Vorgang nicht abgeschlossen werden. Die erforderlichen Informationen werden im Backend an den Vertrag übergeben; dabei werden insbesondere die Kampagne für den Kundentyp und der Preis eindeutig im Payload mitgeschickt. In der Kampagnenübersicht wurde der Filter („Weitere Filter") um den Kundentyp erweitert, sodass die neu definierten Kampagnen dort berücksichtigt werden.

**Weitere Anpassungen**
Für Reifenprodukte wurden die Beschriftung sowie die Nachkommastellen der Laufleistung angepasst. Ein Fehler, durch den Verträge nicht erstellt werden konnten und die Meldung „Unauthorized" erschien, wurde behoben.

Die geplante Erweiterung um die Zahlungsintervalle jährlich, halbjährlich und vierteljährlich für B2B-Kunden wurde nicht umgesetzt und ist daher nicht Bestandteil dieser Version.