# Batch 1226 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kampagne erstellen**

Als MPC-Benutzer können Sie für ein Produkt eine Kampagne anlegen, um ein rabattiertes Produkt anzubieten. Dazu öffnen Sie die Kampagnenübersicht und klicken auf die Schaltfläche „Create Campaign". Daraufhin startet ein Assistent mit drei Schritten: „Campaign Setup", „Discounted Products & Vehicles" und „Campaign Summary".

Im unteren Bereich des Assistenten stehen je nach Schritt unterschiedliche Schaltflächen zur Verfügung. „Cancel" ist immer aktiv. „< Back" gibt es im ersten Schritt nicht, „Next >" im letzten Schritt nicht. „Submit" erscheint nur im letzten Schritt. „Next" ist erst aktiv, wenn alle Pflichtfelder des aktuellen Schritts ausgefüllt sind. Beim Wechsel zum nächsten oder vorherigen Schritt werden die Änderungen der aktuellen Seite gespeichert. Klicken Sie auf „Cancel", erscheint ein Hinweis, dass nicht gespeicherte Änderungen verloren gehen („You have unsaved changes that will be lost. The changes you have made will not be updated and they will be lost. Are you sure you want to proceed?"). Mit „Cancel" im Dialog schließen Sie das Fenster und bleiben auf der aktuellen Seite. Mit „Proceed" kehren Sie zur Kampagnenübersicht zurück, ohne dass Änderungen gespeichert werden.

**Schritt 1: Campaign Setup**

Der erste Schritt trägt den Hinweistext „Define the Campaign". Auf der linken Seite erfassen Sie die folgenden Angaben.

Der Kampagnenname (Platzhalter „Campaign Name") ist ein Pflichtfeld und muss zwischen 3 und 100 Zeichen lang sein. Sonderzeichen sind erlaubt. Wird die Vorgabe nicht eingehalten, erscheint die Meldung „Min. 3 and max. 100 characters allowed. Please correct your input and try again".

Die Gültigkeit der Kampagne legen Sie über zwei Datumsfelder („Valid From" und „Valid To") per Datumsauswahl fest. Beide sind Pflichtfelder. „Valid From" ist der Beginn der Kampagne, wobei Sie ab dem aktuellen Datum zuzüglich eines Tages wählen können. „Valid To" ist das Ende der Kampagne.

Die Karenzzeit („Grace Period (Days)") geben Sie in Tagen an. Das Feld ist ein Pflichtfeld mit dem Standardwert 0 und akzeptiert ein bis zwei Ziffern.

Die Kampagnenbeschreibung („Campaign Description") ist optional und ein Textfeld mit maximal 512 Zeichen.

Beim Rabatttyp („Discount Type") wählen Sie in einem Dropdown genau eine Option, entweder „Percentage" oder „Fixed Amount". Die Auswahl ist verpflichtend.

Wählen Sie „Percentage", erscheinen zwei weitere Felder. Im Feld „Percentage" ist ein Pflichtwert einzugeben, der nur numerische Zeichen enthalten darf. Der Mindestwert beträgt 1 %, der Höchstwert 100,00 %. Es sind maximal 5 Zeichen erlaubt, davon zwei Nachkommastellen (zum Beispiel 98.50 oder 100.00); den Dezimalpunkt gibt der Benutzer selbst ein. Bei Verstößen erscheint „Min. 1 and max. 5 characters allowed. Please correct your input and try again". Das Feld „Maximum Amount" ist optional und besteht aus einer Währungsauswahl („Currency") sowie einem Zahlenwert. Als Währung ist vorerst EUR voreingestellt; später sollen nur Währungen angeboten werden, die in der Länder-/Marktkonfiguration dem jeweiligen Markt zugewiesen sind, wobei die dort als Standard markierte Währung automatisch ausgewählt wird. Der Wert muss mindestens 1 betragen und darf maximal 8 numerische Zeichen haben, davon zwei Nachkommastellen (zum Beispiel 123456.50). Bei Verstößen erscheint „Min. 1 and max. 8 numeric characters allowed. Please correct your input and try again".

Wählen Sie „Fixed Amount", erscheint stattdessen das Feld „Amount". Auch hier ist die Währung per Dropdown wählbar (vorerst EUR, mit derselben späteren Marktlogik). Der Betrag ist ein Pflichtfeld, akzeptiert nur numerische Zeichen, muss mindestens 1 betragen und darf maximal 8 numerische Zeichen mit zwei Nachkommastellen umfassen (zum Beispiel 123456.50). Bei Verstößen erscheint dieselbe Meldung wie beim Maximalbetrag.

Das Kontrollkästchen „Auto apply in dealer sales view" ist im MVP standardmäßig aktiviert. Die Kampagne wird dann automatisch in der Vertragserstellung angewendet, und die dortigen Preise werden standardmäßig mit der Kampagne berechnet.

Auf der rechten Seite steht der Hinweis „Select the Sales Levels where this campaign can be applied". Hier legen Sie fest:

Der Vertriebskanal („Sales Channel") ist ein Dropdown mit Mehrfachauswahl. Zur Auswahl stehen Stationary Retail Sales (stand-alone), Direct Online Sales (stand-alone), Leasing, Finance und Rental. Mindestens ein Kanal muss gewählt werden. Der gewählte Kanal bestimmt, welche Produkte im zweiten Schritt angezeigt werden: Es erscheinen nur Produkte, die mit dem ausgewählten Vertriebskanal konfiguriert sind.

Die Kostenstelle („Cost Center") ist ein Pflichtfeld und muss genau 10 Zeichen enthalten. Bei falscher Zeichenanzahl oder -art erscheint „Cost Center input can only accept 10 alphanumerical characters."

Die Debitorennummer („Debtor Number", zuvor Account Number) ist ein Pflichtfeld, akzeptiert nur Ziffern und muss genau 10 Stellen haben. Bei Verstößen erscheint „Account number input can only accept 10 numerical characters."

Die Provisionskomponente („Provision Component") ist ein Pflichtfeld und verlangt genau 3 alphanumerische Zeichen. Bei Verstößen erscheint „Provision Component input can only accept 3 alphanumeric characters."

Die externe Kampagnen-ID („External Campaign ID") ist optional und darf höchstens 8 Zeichen lang sein.

**Schritt 2: Discounted Products & Prices**

Im zweiten Schritt wählen Sie die Produkte und Cluster, auf die der Rabatt angewendet werden soll. Der Bereich „Define Products and Clusters List" trägt den Titel „Select the Clusters from the published products where you want to apply the discount to". Angezeigt werden nur veröffentlichte Produkte und Cluster der aktuell gültigen Preisversion. Wählen Sie ein Produkt aus, werden in der nächsten Spalte die verfügbaren Cluster aufgelistet. Standardmäßig ist kein Cluster ausgewählt. Sie können mehrere Cluster aus mehreren Produkten auswählen. Cluster, die im gleichen Zeitraum bereits in einer anderen Kampagne für denselben Vertriebskanal verwendet werden, werden hier nicht angezeigt.

Der Bereich „View Products and Clusters list" trägt den Titel „Discounts will apply to following Products and Clusters". Im Ausgangszustand ist er leer. Sobald Sie links Cluster auswählen, werden diese hier angezeigt.

**Schritt 3: Campaign Summary**

Der dritte und letzte Schritt ist die Zusammenfassung. Alle Einstellungen der neuen Kampagne werden schreibgeschützt dargestellt. Der Kopfbereich zeigt den Kampagnennamen (zum Beispiel „Winter Sales") und die Beschreibung, oder „-", falls das optionale Feld nicht ausgefüllt wurde. Der Bereich „Campaign Setup" zeigt die Angaben aus Schritt 1: Karenzzeit, Rabatt (zum Beispiel 20 % bei Prozentrabatt oder 20 EUR bei festem Betrag), den Maximalbetrag (zum Beispiel 100 EUR oder „-"; nur bei Prozentrabatt sichtbar), „Auto apply in dealer sales view" (zum Beispiel „Yes"), Vertriebskanal, Kostenstelle, Kontonummer, Provisionskomponente und externe Kampagnen-ID (oder „-", falls nicht angegeben). Der Bereich „Products and Vehicles" listet die in Schritt 2 gewählten Produkte und Fahrzeuge, etwa Produkt 1 mit C-Class AMG Electric, C-Class AMG Diesel und C-Class non-AMG.

In diesem Schritt ist „Cancel" aktiv, „Back" führt zum vorherigen Schritt, und „Submit" ist aktiv, sobald alle Pflichtfelder gültige Angaben enthalten. Mit „Submit" wird die Kampagne in der Datenbank gespeichert und erscheint ganz oben in der Liste der Kampagnenübersicht.