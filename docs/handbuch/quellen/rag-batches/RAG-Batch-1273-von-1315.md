# Batch 1273 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 80 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Verbesserungen und Fehlerbehebungen**

In diesem Release wurde die Contract Calculation an zahlreichen Stellen überarbeitet und stabilisiert. Die Änderungen betreffen vor allem die Produktverwaltung, die Preisversionen und Preise, Kampagnen, die Vertragserstellung sowie die Verwaltung von Fahrzeugen und Vorlagen.

**Produktverwaltung und Blueprints**

Bei Produkten mit zugeordneten technischen Optionen und optionalen Deckungen werden die enthaltenen Deckungen nun korrekt bereitgestellt. Beim Abruf eines Produkts ohne FRD-Bezug wird die Verkaufslogik jetzt richtig geliefert. Ein Navigationsfehler, der nach dem Entfernen von Ablaufkriterien und Verkaufsabhängigkeiten auftrat, wurde behoben. Ebenso wurde der Fehler 500 bei Kontingentprodukten beseitigt. Das Dropdown für das Wetterprofil ist bei älteren Reifenprodukten nicht mehr leer, und Van-Produkte werden nun auch bei anderen Motorarten als Diesel korrekt abgerufen. Der Prozentsatz der Händlerprovision wird im Produktmanagement nun gespeichert. Die Funktion „Blueprint bearbeiten“ steht zur Verfügung. Zudem bleibt die Verkaufslogik erhalten, wenn zwischen Schritt 1 und Schritt 2 eines Blueprints gewechselt wird. Die Anlage von Geschäftsbedingungen (T&C) funktioniert jetzt auch für Produkte im Status „Created“.

**Preisversionen und Preise**

Der in einer Preisversion angezeigte Inflationsfaktor stimmt nun mit dem in der Marktkonfiguration definierten Wert überein. Basis-Cluster, die den maximal zulässigen Wert überschreiten, können nicht mehr gespeichert werden. Änderungen an Raten werden beim Bearbeiten gespeichert, und die Händlerprovision wird nach der Bearbeitung von Raten nicht mehr zurückgesetzt. Änderungen an technischen Optionen werden auch für aktive Preisversionen gespeichert. Für technische Optionen mit 0 Prozent wird kein Warnsymbol mehr angezeigt. Die Verkaufsprovision wird nun auch für immer enthaltene Optionen berechnet. Wird die Kostendefinition für Optionen bearbeitet, werden die Werte zurückgesetzt. Beim Duplizieren einer Preisversion wird der Wert der optionalen Fahrzeuggruppe in den Preis-Clustern übernommen. Außerdem wurde der Schritt „Zahlung und Provisionen“ in der Preisversion überarbeitet, der Übergang zu Schritt 3 beim Erstellen und Bearbeiten einer Preisversion funktioniert wieder, und überflüssige Formulierungen bei den Zahlungsintervallen wurden entfernt. Eine Fehlermeldung, die beim Bearbeiten einer Preisversion in deutscher Sprache erschien, tritt nicht mehr auf. In den Preis-Clustern werden Fahrzeuggruppen im Dropdown korrekt dargestellt.

**Verlängerung (Prolongation)**

Bei der Langzeitverlängerung wird nun die jeweils neueste Preisversion verwendet. Immer enthaltene Optionen werden standardmäßig in die Verlängerung übernommen.

**Kampagnen**

Van-Kampagnen werden auf der Übersichtsseite angezeigt. Deaktivierte Kampagnen mit Karenzzeit werden nicht mehr doppelt aufgeführt. Der Hinweis auf ungespeicherte Änderungen erscheint nicht mehr bei jedem Produktwechsel, und die Preistabelle zeigt standardmäßig den Monatspreis an. Für die Übergabe an das Leasing werden alle Kampagnentypen berücksichtigt.

**Vertragserstellung und Sonderfälle**

Die Preise für optionale Deckungen werden bei der Vertragserstellung korrekt dargestellt, und Branchenzuschläge werden berücksichtigt. Die Vertragserstellung im Baumuster-Ablauf kann wieder gestartet werden. Bei Build-to-stock-Fahrzeugen ist der Listenpreis im Sonderfall nicht mehr 0,00, und der Prüfprozess für Sonderfälle ist in den Abläufen Build to stock und Build to order nicht mehr blockiert. Nach der Änderung eines MPC-Rabatts wird der Preis nach der Änderung korrekt berechnet. Bei Kostenstellen, die aus der Browser-Vorschlagsliste übernommen werden, sind Leerzeichen nicht mehr zulässig.

**Fahrzeugverwaltung, Fahrzeuggruppen und Limits**

Die Dropdowns zur Suche nach Baumustercodes werden korrekt angezeigt. Beim Bearbeiten des Namens einer Fahrzeuggruppe tritt der Fehler „isNameUnique“ nicht mehr auf. Bei Fahrzeuglimits ohne FRD-Bezug sind die fehlenden Felder ergänzt. Bei den Vega-Codes ist die Sortierreihenfolge der Divisionen nun einheitlich, und Branchenmärkte werden im Dropdown-Filter übersetzt.

**Vorlagen**

In der Vorlagenverwaltung wird die Sprache der Geschäftsbedingungen nun in der Vorlage vorausgewählt.