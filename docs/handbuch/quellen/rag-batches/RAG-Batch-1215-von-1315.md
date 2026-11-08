# Batch 1215 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Preisgestaltung für optionale Deckungen (Produkt-Optionals)**

Bisher konnten Preise ausschließlich für die Basisdeckungen eines Produkts festgelegt werden. Künftig können MPC-Anwender auch für die optionalen Deckungen eines Produkts eigene Preise definieren. Diese Optionen lassen sich damit nach ihrer eigenen Geschäftslogik bepreisen und für jeden Vertrag individuell auswählen und bepreisen.

Beim Anlegen einer Preisversion legen Sie für jede optionale Deckung die Kostenstruktur fest. Diese Angaben bestimmen die Preismatrix und die Art, wie die Werte in den Preis einer Option einfließen. Die optionalen Deckungen werden alphabetisch sortiert aufgelistet. Die Kostenstruktur einer Option öffnen Sie über das zugehörige Akkordeon. Es kann immer nur ein Akkordeon geöffnet sein: Öffnen Sie ein weiteres, wird das bereits geöffnete geschlossen.

Für jede optionale Deckung definieren Sie die Kosten, die Abhängigkeit und die Steuerklassifizierung. Die Kostendefinition ist verpflichtend. Zur Auswahl stehen die Varianten „Gesamtbetrag", „Prozentsatz", „Betrag pro Meile", „Betrag pro Monat" und „Betrag pro Jahr". Der Wert in jeder Zelle gibt an, wie sich die Kosten für den Kunden erhöhen, wenn er die jeweilige Option wählt. Beim Gesamtbetrag wird ein Gesamtwert zur Liste der jeweiligen Produktoption für die gewählte Laufzeit und Laufleistung bzw. das gewählte Kontingent addiert. Beim Prozentsatz wird ein Prozentsatz auf den Listenpreis aufgeschlagen, berechnet aus der vom Kunden gewählten Laufzeit- und Laufleistungs- bzw. Kontingentoption. Beim Betrag pro Meile wird ein Betrag je gefahrener Meile für die gewählte Laufzeit und Laufleistung bzw. das Kontingent berechnet. Beim Betrag pro Monat bzw. pro Jahr wird der jeweilige Betrag zum Listenpreis addiert. Alternativ können Sie die Kostendefinition „Keine Kosten" wählen. Dann sind alle weiteren Felder deaktiviert, die Deckung gilt als vollständig definiert und ist kostenfrei.

Über die Abhängigkeitsdefinition legen Sie in einem Dropdown fest, ob für jede Laufzeit, für Laufleistung, für Laufzeit und Laufleistung, für ein Kontingent oder unabhängig von den Vertragsoptionen unterschiedliche Preise definiert werden können. Die Steuerklassifizierung wird aus einer Liste befüllt, die über die Tax-Management-API (Produkt-Steuerklassifizierung) bereitgestellt wird.

Zulässig sind folgende Kombinationen aus Kostendefinition, Kostenabhängigkeit und Steuerklassifizierung: Betrag pro Monat oder Betrag pro Jahr, jeweils entweder laufzeit- und laufleistungsabhängig oder laufzeit- und laufleistungsunabhängig, mit der Standard-Steuerklassifizierung „Standard". Bei „Keine Kosten" sind Abhängigkeit und Steuerklassifizierung deaktiviert.

Im Prozess der Cluster-Definition gibt es zudem den neuen Reiter „Optionale Deckungen". Die dortige Auswahlliste enthält alle im Produkt konfigurierten optionalen Deckungen, mit Ausnahme derer, für die in der Preisversion „Keine Kosten" gewählt wurde. Die Liste ist alphabetisch sortiert. Je nach Auswahl bei der Kosten- und Abhängigkeitsdefinition in der Preisversion unterscheidet sich die angezeigte Preismatrix.

Sobald die Bepreisung einer Vertragsoption definiert ist, wird sie zur Berechnung des Preises der Produktoptionen verwendet, wenn diese angefragt werden. Der Preisfaktor wirkt sich nicht auf die Preise der optionalen Deckungen aus.

**Berechnung des Preises pro Kilometer**

Nach einer Vertragsgenerierungsanfrage übermittelt die Vertragskalkulation die zu den Anfragekriterien passenden Produkte und Preise. Dieser Preisbereitstellungsvorgang wurde um eine zusätzliche Preiskomponente erweitert: Für jede Produktkonfiguration wird nun auch der Preis pro Kilometer mitgeliefert, damit Kunden beim Abschluss eines Vertrages die Kosten für Mehrkilometer kennen.

Der Preis pro Kilometer wird aus den Gesamtkosten des Vertrages abgeleitet und in den Darstellungen Netto, Mehrwertsteuerbetrag und Gesamtbetrag (brutto) bereitgestellt. Berechnungsgrundlage ist der „Gesamtbasispreis". Er umfasst alle Basispreisbestandteile, also den Basispreis des Produkts zuzüglich der Preise der Optionen. Nicht enthalten sind Provisionen, zahlungsabhängige Aufschläge oder Verwaltungsgebühren sowie sonstige Gebühren. Ebenso nicht enthalten sind Händlerrabatte oder Kampagnen.