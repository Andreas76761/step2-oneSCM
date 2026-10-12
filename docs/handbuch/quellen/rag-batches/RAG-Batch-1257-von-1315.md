# Batch 1257 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Neuerungen und Änderungen**

**Bearbeiten veröffentlichter Produkte**
Wird ein Produkt mit dem Status „Published" bearbeitet, sind die Felder „Tire Size", „Tire Exchange Logic" und „Max Amount Of Tires" ausgegraut und können nicht geändert werden. Zuvor waren diese Felder trotz des Status noch bearbeitbar. Nach einer Änderung in einem dieser Felder wurden die Schaltflächen „Next" und „Back" deaktiviert. Dieses Verhalten wird durch das Ausgrauen der Felder vermieden.

**Technical Options**
Alle angezeigten Gruppen von Technical Options (TO) haben auf der linken Seite eine Checkbox. Mit ihr legen Sie fest, welche technische Option für Ihre Fahrzeuggruppe relevant ist. Nach der Auswahl einer Gruppe definieren Sie diese. Für jede ausgewählte technische Option können Sie die „Cost Definition" und die „Dependency Definition" festlegen. Wenn Sie die Definition einer technischen Option nicht abschließen und zu einer anderen wechseln, erscheint auf der rechten Seite ein Symbol zur Fehlerkennzeichnung.

**Dependency Definition beim Industry Price Factor**
Die „Dependency Definition" ist für alle Divisions auf Werte eingeschränkt, die weder von der Laufleistung noch von der Laufzeit abhängen (mileage/duration-independent). Die Werte „mileageDependent" und „durationMileageDependent" stehen nicht mehr zur Verfügung, es bleibt „durationMileageIndependent". Für den Surcharge stehen weiterhin alle drei Werte zur Verfügung: kein Surcharge, Prozentwert oder Betrag.

**Erweiterte Reifenkonfiguration in der Produktdefinition**
Bei der Anlage eines Produkts unter „Product Management" → „Create Product" mit dem Blueprint „Tire Care" enthält Schritt 5 „Price Matrix Definition" im Bereich „Define Tire Component" neben „Tire Size", „Tire Exchange Logic" und „Max Amount of Tires" nun zwei weitere Elemente.

Das Feld „Min. Amount of Tires" ist ein Textfeld, das wie „Max Amount of Tires" funktioniert. Es akzeptiert nur ganze Zahlen, der kleinstmögliche Wert ist 2. Das Feld „Step for Tire Contingent" ist ein Dropdown-Feld für die Schrittweite des Reifenkontingents. Zunächst steht nur die Option 2 zur Verfügung. Da das Dropdown später um weitere Optionen erweitert werden kann, entspricht es der Schrittweitenkonfiguration bei „Define Duration Options" und „Define Annual Mileage Options".

Für die drei Felder gilt dieselbe Validierungslogik wie bei „Define Duration Options": „Min Amount" muss kleiner als „Max Amount" sein, und beide Werte müssen sich durch den Wert aus „Step for Tire Contingent" teilen lassen.

Die beiden neuen Felder und ihre Werte wirken sich auf weitere Bereiche von oneSCM aus. Sie erscheinen auf der Product Summary Page. In der „Price"-Tabelle der Base Coverage, die das empfohlene Reifenkontingent für das Produkt enthält, dienen die Werte als Eingabevalidierung. Es lassen sich nur Zahlen eingeben, die zwischen „Min Amount" und „Max Amount" liegen (einschließlich dieser Grenzen) und durch die Schrittweite teilbar sind (derzeit immer 2). Bei der Vertragserstellung wird standardmäßig das empfohlene Reifenkontingent aus dieser Tabelle angezeigt. Der Vertrieb kann es innerhalb der definierten Parameter anpassen. Es lassen sich also beispielsweise 6 Reifen auswählen, aber nicht 7, und die Auswahl bleibt auf den Bereich zwischen Minimum und Maximum beschränkt.

**Price Matrix Preview**
In der Vorschau der Price Matrix wurde eine kleine Anpassung vorgenommen: Der linke Pfeil verläuft nun von oben nach unten.

**Mileage History**
Bei der Rechnungserstellung wird zusätzlich geprüft, dass der Kilometerstand nicht größer als 999.999 sein darf. Andernfalls würde die Vertragserstellung blockiert. Außerdem gilt, dass Rechnungen nicht mit einem tatsächlichen Kilometerstand erstellt werden können, der unter dem zuletzt bekannten Kilometerstand liegt.