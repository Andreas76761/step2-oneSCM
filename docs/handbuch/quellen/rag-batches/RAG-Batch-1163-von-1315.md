# Batch 1163 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 25 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation: Kundentypen und Kampagnen**

Bei der Erstellung eines Vertrags wird der Kundentyp berücksichtigt, beispielsweise „Commercial Fleet“. Anhand dieses Kundentyps lässt sich prüfen, welche Kampagne auf den Vertrag angewendet wird. Voraussetzung ist, dass ein Produkt ausgewählt wurde. In der Kampagnenübersicht wird der Kundentyp angezeigt und kann dort kontrolliert werden. Bei der Konfiguration einer Kampagne steht für die Auswahl des Kundentyps eine Dropdown-Liste mit Mehrfachauswahl zur Verfügung. Wenn mehrere Kampagnen in Frage kommen, wird diejenige angewendet, die dem Kunden den höchsten Rabatt gewährt.

**Produkte ohne FRD-Bezug**

Für Produkte, die nicht FRD-bezogen sind, gelten folgende Berechnungsregeln: Der Preis wird aus der Preismatrix entnommen und durch die gewählte Laufzeit geteilt. Das Vertragsstartdatum entspricht dem Datum, an dem das Produkt gekauft bzw. aktiviert wird. Das Vertragsenddatum ergibt sich aus dem Aktivierungsdatum zuzüglich der gewählten Laufzeit. Voraussetzung ist jeweils, dass das Produkt verfügbar ist.

Zusätzlich stehen im Fahrzeugbereich die Platzhalter „Vehicle Age at Contract End“ und „Vehicle Mileage at Contract End“ zur Verfügung. Die Bezeichnung der Vertragslogik wurde in „Sales Logic (Multi Select)“ geändert. Dabei gibt es eine Dropdown-Option „Sales Logic“ mit den zwei Auswahlmöglichkeiten „FRD Related“ und „FRD Not Related“. Für diese Funktionen müssen Blueprints verfügbar sein.

**Darstellung des Sticker Price**

Auf der Seite zur Vertragserstellung wird der Sticker Price nach festen Regeln ausgegeben. Ist die Sticker-Price-Zelle leer, wird der unrabattierte Preis (Undiscounted Price) für die jeweilige Kombination aus Laufzeit und Fahrleistung in der Matrix angezeigt. Ist der Sticker Price höher als der unrabattierte Preis, wird der Sticker Price ausgegeben; die Differenz zwischen unrabattiertem Preis und Sticker Price wird dann ausdrücklich auf 0 gesetzt, da der Rabattwert nicht negativ sein darf. Ist der Sticker Price niedriger als der unrabattierte Preis, wird der Sticker Price ausgegeben, und es erscheint eine Fußnote. Sind Sticker Price und unrabattierter Preis gleich, beträgt die Differenz null, und es wird der unrabattierte Preis ausgegeben.

**Preisanzeige und Nettopreise**

Anwender können über einen Umschalter wählen, ob der Monatspreis oder der Gesamtpreis angezeigt wird. Nettopreise lassen sich manuell eingeben, per Copy-and-paste übernehmen oder über die Excel-Upload- und -Download-Funktion pflegen.

Auf der Seite „Discounted Products & Vehicles“ wurde der Hinweistext angepasst: Statt „All input prices are in EUR/month (without VAT)“ lautet er nun „All input prices are Net Prices in EUR (without VAT)“. Die Funktion „Define over all discount“ steht auf dieser Seite nicht mehr zur Verfügung. Ebenso entfällt die Augensymbol-Funktion zur Anzeige von Originalwert und rabattiertem Preis. Voraussetzung ist, dass das Produkt verfügbar ist.

**Preisversionen in der Kampagnenerstellung**

In Schritt 2 der Kampagnenerstellung kann für jedes Produkt eine Preisversion hinzugefügt werden. Voraussetzung ist, dass das Produkt über eine aktive und eine nächste geplante Preisversion verfügt. Dies gilt für die Rabattarten „Sticker Type“, „Fixed“ und „Percentage“. Für jede Preisversion ist zu prüfen, dass der Name korrekt angezeigt wird und dass Start- und Enddatum richtig und sauber formatiert sind. Wird eine Preisversion gewählt, sind automatisch alle zugehörigen Cluster ausgewählt; diese können bei Bedarf einzeln abgewählt werden. Alle getroffenen Angaben werden in der Kampagnenübersicht dargestellt.

Auch beim Duplizieren einer Kampagne stehen die Preisversionen korrekt zur Verfügung. Beim Bearbeiten einer Kampagne kann die bestehende Preisversion geändert werden.

**Zahlungsintervalle**

Auf der Zahlungsseite werden die Zahlungsintervalle jährlich, halbjährlich und vierteljährlich mit den jeweiligen Preisen angezeigt. Voraussetzung ist ein aktiver Vertrag mit den entsprechenden Zahlungsoptionen.