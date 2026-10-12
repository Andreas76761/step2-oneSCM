# Batch 872 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Lieferantenkosten je Deckung: Speicherung und Übergabe an Revenue**

Wenn Produkte an den Vertrag übergeben werden, enthalten die Daten für jede Deckung auch Angaben zur Kostenstelle (Cost Unit) und zum Lieferanten. Damit Lieferanten, die nicht Mercedes sind, korrekt abgerechnet werden können, erfasst der Vertrag die vom Lieferanten getragenen Kosten, speichert sie und übergibt sie bei der Aktivierung an Revenue. Die Umsetzung erfolgt in drei Phasen. Jede Phase kann verfeinert und ausgeliefert werden, sobald die jeweiligen Produktdaten vorliegen.

**Phase 1: Speichern und Übergeben der Lieferantendaten einer Deckung**

Der Vertrag prüft für jede Deckung die Kostenstelle. Lautet sie MERCEDES_BENZ, ändert sich nichts: Die Deckung wird wie bisher auf Mercedes-Seite behandelt, und es wird weder eine lieferantenspezifische Speicherung noch eine Übergabe ausgelöst. Bisher ist die Kostenstelle in allen Fällen Mercedes Benz.

Lautet die Kostenstelle SUPPLIER, speichert der Vertrag die zugehörigen Deckungs- und Lieferantendaten auf Vertragsebene und übergibt sie bei der Aktivierung an Revenue. Dazu gehören der Deckungscode, die Referenz der Deckung (zum Beispiel "DELIVERY"), die ID des Optional-Coverage-Clusters sowie der Cluster beziehungsweise die Kategorie (zum Beispiel "OPTIONAL"). Ebenfalls gespeichert werden die Kurz- und Langbeschreibungen in den Sprachen Englisch und Deutsch, die Kennzeichen, ob die Deckung aus einem Optional stammt und ob sie von VEGA ausgeschlossen ist, sowie die Kostenstelle selbst. Hinzu kommen die verschachtelte Liste der Optionals (sie kann leer sein) und die technischen Optionen (sie können leer sein). Weiterhin werden der Gesamtpreis der optionalen Deckung mit Netto-, Mehrwertsteuer- und Bruttobetrag, die Lieferanten-ID, die Lieferantenpreise (netto, Mehrwertsteuer, brutto), die Kundenpreise (bei reinen Lieferantendeckungen können sie fehlen) und die Angabe gespeichert, ob die Deckung im Basisprodukt enthalten ist.

Eine Deckung kann mehrere Lieferanten haben. Eine Reifendeckung kann beispielsweise von mehreren Anbietern wie Michelin, Pirelli oder Continental angeboten werden, jeweils mit eigener Lieferanten-ID und eigenem Preis. Der Vertrag speichert alle diese Lieferanten, ohne dass einer verloren geht oder überschrieben wird. Bei der Aktivierung erhält Revenue alle Lieferanten mit ihren Preisen und kann so jeden Lieferanten einzeln abrechnen. Revenue kann dabei stets erkennen, welcher Lieferant beteiligt ist und welche Preise für ihn gelten.

**Phase 2: Kostenaufteilung zwischen Mercedes und Lieferant**

Sobald die Produktdaten die Aufteilung der Kosten zwischen Mercedes und dem Lieferanten enthalten (je Deckung beziehungsweise Komponente), speichert der Vertrag sowohl den Mercedes-Anteil als auch den Lieferantenanteil und nimmt beides in die Übergabe an Revenue bei der Aktivierung auf. Revenue erkennt dadurch für jede Deckung genau, wer welchen Betrag trägt, und kann die Kosten korrekt zwischen der Mercedes-Rechnung und dem Lieferantendokument aufteilen.

**Phase 3: Zahlungsplan des Lieferanten**

Sobald die Produktdaten den Zahlungsplan für den Lieferanten enthalten (Zeitplan, Intervalle und Ratenbeträge), speichert der Vertrag diesen und sendet ihn bei der Aktivierung an Revenue. Revenue kann den Lieferanten damit im richtigen Rhythmus abrechnen, unabhängig vom Zahlungsplan des Kunden.

**Hinweis zu den Preisen**

Die Preise im Vertrag bleiben unverändert, unabhängig davon, wer der Lieferant ist und wie viel Mercedes oder der Lieferant jeweils übernimmt.