# Batch 1171 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reifenprodukt „Van Unlimited"**

Im Bereich Vertragskalkulation lässt sich ein Reifenprodukt für die Variante „Van Unlimited" anlegen. Es kann entweder als eigenständiges Produkt (Standalone) oder als Option verkauft werden, die an ein bestehendes Servicevertragsprodukt angehängt wird. Bisher gab es lediglich eine eingeschränkte Version des Reifenprodukts mit einer minimalen und einer maximalen Reifenanzahl. Die neue Variante ergänzt diese um ein Produkt mit unbegrenztem Reifenumfang.

**Voraussetzungen**

Damit ein solches Produkt angelegt werden kann, müssen mehrere Dinge vorbereitet sein. Technische Optionen mit Radgrößen müssen vorhanden sein. Außerdem muss ein Blueprint vom Typ „Tire Contract" existieren, der mindestens eine Basis- oder optionale Deckung enthält. Im Blueprint ist die Sales Dependency als Mehrfachauswahl aus „Standalone Product" und „Product Option" festgelegt, der Reifenumfang (Tire Scope) steht auf „Unlimited", und der Reifenlieferant (Tire Supplier) ist als Mehrfachauswahl mit „Mercedes Benz" und „External" hinterlegt.

**Produkt anlegen**

Die Produktanlage verläuft zunächst wie gewohnt. Nach der Auswahl von Division und Blueprint werden die vom Blueprint geerbten Felder angezeigt. Anschließend wechseln Sie wie gewohnt zu Schritt 2 und definieren das Produkt.

In Schritt 2 steht Ihnen das neue Feld „Sales Dependency" zur Verfügung. Sie wählen dort aus der Liste „Standalone Product" und/oder „Product Option" aus. Die Angabe ist verpflichtend, die Auswahl wird aus dem Blueprint geerbt, und als Standardwert ist „Product Option" gesetzt. Das Feld kann nie vollständig abgewählt oder leer gelassen werden.

In Schritt 3 legen Sie die übrigen Details fest, nämlich Verkaufslogik, anwendbare Rabatte, die Branchen, für die Zuschläge gelten, und die Ablaufkriterien. Diese Angaben werden aus dem Blueprint übernommen. Der Abschnitt „Allowed Contract Modifications" wird ausgeblendet, wenn die Sales Dependency ausschließlich auf „Product Option" gesetzt ist. Der Vertriebskanal, für den die Provision gilt, wird wie in der zugehörigen separaten Funktion zur Definition des Vertriebskanals festgelegt.

Schritt 4 bleibt unverändert. In Schritt 5 hängen die angezeigten Felder vom Reifenumfang ab („Limited" oder „Unlimited"). Bei „Limited" bleibt alles wie bisher. Ist der aus dem Blueprint geerbte Reifenumfang „Unlimited", erscheint eine eigene Konfigurationsseite für die unbegrenzte Version. Dort wählen Sie per Mehrfachauswahl die zutreffenden Radgrößen aus, die zuvor in den Technischen Optionen definiert wurden. Die Wetterprofile „Summer", „Summer/Winter" und „All-Season" sind fest hinterlegt und auf Produktebene als Mehrfachauswahl verfügbar. Dafür sind weder Technische Optionen noch ein Abgleich mit der Fahrzeug-ID nötig.

Auf derselben Seite werden die Lieferanteninformationen aus dem Blueprint angezeigt. Wurde im Blueprint „External" als Lieferant hinterlegt, wählen Sie für das konkrete Produkt genau einen externen Lieferanten aus und tragen zwingend eine SAP-Nummer ein. Ist im Blueprint nur Mercedes Benz (intern) hinterlegt, wird „Mercedes Benz" als Lieferant angezeigt und kann nicht geändert werden. Schritt 6 verläuft wie gewohnt. In Schritt 7 zeigt die Übersichtsseite alle neuen Attribute mit den gewählten Werten an, etwa die ausgewählten Radgrößen und den einzelnen Lieferanten. Die Navigation zu den übrigen Standardschritten funktioniert wie bisher.

**Preisversion für das Reifenprodukt (Unlimited)**

Die Einrichtung der Preisversion und das Anlegen von Clustern verlaufen wie gewohnt. Bei der Preisgestaltung der Deckungen gilt: Wurde in der Produktdefinition keine Basisdeckung festgelegt, wird dafür keine Preismatrix angezeigt. Optionale Deckungen bepreisen Sie wie gewohnt.

Neu ist die Ansicht für die Technischen Optionen bei Produkten mit unbegrenztem Reifenumfang. Für jede im Reifenprodukt ausgewählte Radgröße ist eine eigene Preismatrix zu pflegen. Pro Radgröße sind zwei Angaben verpflichtend: der Felgentyp mit den Optionen „Steel rim included" und „No rim" sowie das Wetterprofil mit „Summer", „Summer/Winter" und „All-Season". Beim Wetterprofil wird dem Benutzer ein Infotext angezeigt, der derzeit noch als Platzhalter („SAMPLE TEXT for now") vorgesehen ist. Für jedes Wetterprofil und jede Radgröße kann ein Preis hinterlegt werden, vergleichbar mit Reifentyp und Reifengröße beim Produkt mit begrenztem Umfang.

Für jede Kombination aus Radgröße, Felgentyp und Wetterprofil muss eine vollständige Preismatrix ausgefüllt werden, zum Beispiel auf Basis von Laufzeit und Laufleistung. Ist eine Matrix nicht ausgefüllt, greift das bisherige Systemverhalten bei unvollständiger Preisgestaltung, etwa eine Validierungsmeldung oder die fehlende Möglichkeit zur Aktivierung. Die Matrixdaten können per Upload oder per Copy-and-Paste eingegeben werden.