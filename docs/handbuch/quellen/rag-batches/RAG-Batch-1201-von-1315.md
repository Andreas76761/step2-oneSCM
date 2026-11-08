# Batch 1201 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reifenprodukte in der Vertragskalkulation**

Mit der neuen Produktlinie „Tire" (Reifen) können MPC-Anwender Produkte anlegen, in denen sich reifenrelevante Einstellungen und Preise individuell definieren lassen. Reifenprodukte können so entweder im Bundle oder als eigenständiges Produkt verkauft werden. Im Blueprint steht dafür im Dropdown-Menü der Produktlinie die Option „Tire" zur Verfügung. Das Ablaufkriterium (Expiry Criteria) ist bei diesen Produkten fest auf „Zeit" eingestellt.

**Technische Optionen**

Bei der Anlage einer Technischen Option erscheint nach der Auswahl der Division ein neues Dropdown-Feld „Group Type". Zur Auswahl stehen „General", „Tire Type" und „Tire Size". Der Gruppentyp lässt sich beim Bearbeiten einer Technischen Option nicht mehr ändern; das Feld ist dann deaktiviert. Werden in einer Technischen-Optionen-Gruppe vom Typ Reifen zwei oder mehr Codes hinterlegt, müssen alle diese Codes in der VeDoc-Antwort enthalten sein, damit der für diese Kombination definierte Preis angewendet wird.

**Produktdefinition**

Wird ein Produkt aus einem Blueprint der Produktlinie Reifen erstellt, unterscheidet sich Schritt 5 (zuvor Schritt 4) der Produktdefinition. Hier gibt es den zusätzlichen Abschnitt „Tire Component" mit zwei neuen Mehrfachauswahlfeldern.

Im Feld „Tire Sizes" wählen Sie die Radgrößen von 15 bis 23 Zoll aus. Das Feld ist ein Pflichtfeld, standardmäßig sind alle Größen ausgewählt, und Sie können einzelne abwählen. Mindestens eine Radgröße muss ausgewählt bleiben. Jede hier gewählte Radgröße wird anschließend im Reiter „Technical Options" in Clustern bepreist.

Im Feld „Tire Exchange Logic" legen Sie fest, welche Reifentypen angeboten werden. Ein Info-Tooltip erklärt: „Selected match options will be offered if the tire type was equipped from the factory." Die Option „MO" ist standardmäßig aktiviert und nicht abwählbar. Dadurch ist sichergestellt, dass mindestens MO-Reifen angeboten und bepreist werden können. Ist ausschließlich MO ausgewählt, bietet das System für jeden Reifentyp MO-Reifen an. Alle anderen Optionen sind frei wählbar. Ist eine Option angehakt, nimmt das System den entsprechenden Reifentyp (definiert in den Gruppen der Technischen Optionen) in die Preismatrix auf. Dieser Typ wird zugeordnet, wenn das aus der Vertragserstellung stammende Fahrgestell ab Werk mit diesem Reifentyp ausgestattet war. Ist eine Option nicht angehakt, wird der Reifentyp nicht in die Preismatrix aufgenommen. In diesem Fall ordnet das System bei einer entsprechenden Werksausstattung stattdessen die Preise der MO-Reifen zu.

**Preisversion**

In der Preisversion gibt es einen neuen Bereich zur Definition von Kosten und Abhängigkeiten für Technische Optionen. Bei Produkten, die aus einem Blueprint mit der Produktlinie Reifen erstellt wurden, erscheint eine alphabetisch sortierte Liste der Technischen Optionen vom Typ Reifen, abhängig von den Einstellungen der Tire Exchange Logic in der Produktkonfiguration.

Für jede Gruppe Technischer Optionen definieren Sie die Kosten. Der Wert in jeder Zelle gibt an, wie sich die Kosten für den Kunden erhöhen, wenn er diese Option wählt. Folgende Kostenarten stehen zur Verfügung:

„Total" ist ein Gesamtbetrag, der für die gewählte Laufzeit und Laufleistung bzw. das gewählte Kontingent zur Produktoption addiert wird. „Percentage" ist ein Prozentsatz, der auf den Listenpreis aufgeschlagen wird und sich nach der vom Kunden gewählten Laufzeit und Laufleistung bzw. dem Kontingent richtet; diese Kostenart steht für Technische Optionen vom Typ MO nicht zur Verfügung. „Amount per mile" ist ein Betrag pro gefahrener Meile, „Amount per month" ein Betrag pro Monat und „Amount per year" ein Betrag pro Jahr, jeweils bezogen auf die gewählte Laufzeit und Laufleistung bzw. das Kontingent.

Bei der Abhängigkeitsdefinition ist derzeit nur „Duration and Mileage Independent" verfügbar. Das bedeutet, dass alle Laufzeit- und Laufleistungsoptionen denselben Preis haben.

**Cluster-Definition**

Der Reiter „Included Coverages" (zuvor „Base Coverages") erzeugt die Matrix auf Basis der Produktkonfiguration. Die Werte darin sind kein Endpreis in Euro, sondern die geschätzte Anzahl an Reifen für die gewählte jährliche Laufleistung und Laufzeit. Dieser Wert dient ausschließlich dazu, zusammen mit den Werten aus dem Reiter „Technical Options" den Vertragspreis zu berechnen. Er gibt nicht an, wie viele Reifen der Kunde während der Vertragslaufzeit tauschen kann. Zulässig sind Werte mit zwei Vorkomma- und zwei Nachkommastellen, mindestens 0,01 und höchstens 99,99.

Im Reiter „Technical Options" werden für jede Technische Option vom Typ Reifen, die auch in der Produktkonfiguration ausgewählt wurde, die Technischen Optionen in der Gruppe der Technischen Optionen angezeigt. Dabei erscheinen die Kosten- und die Abhängigkeitsdefinition, wie sie in der Preisversion konfiguriert wurden. Auch hier ist derzeit nur die Abhängigkeitsoption „Duration and Mileage Independent" verfügbar.