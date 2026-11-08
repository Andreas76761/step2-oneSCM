# Batch 1256 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Preisversionen und Preiscluster**

Beim Duplizieren einer Preisversion bleiben die Beziehungen zwischen den Preisclustern nun erhalten. Enthält eine Preisversion ein Basis-Preiscluster und mehrere relative Preiscluster, die auf dieses Basiscluster verweisen, werden die relativen Preiscluster in der duplizierten Version nicht mehr in Basis-Preiscluster umgewandelt. Sie behalten stattdessen ihren Verweis auf das ursprüngliche Basiscluster, einschließlich des zugehörigen Preisfaktors.

**Bearbeitung von Clustern (Basis, Optional, Technisch)**

Die Cluster „Base", „Optional" und „Technical" können in allen Produktstatus bearbeitet werden, mit Ausnahme des Status „Published". Das gilt auch dann, wenn das Startdatum der Preisversion bereits in der Vergangenheit liegt, solange das Produkt noch nicht veröffentlicht ist. Ist die Preisversion hingegen bereits abgelaufen, kann sie nicht mehr bearbeitet werden.

**Erweiterte Reifenkonfiguration in der Produktdefinition**

Bei der Anlage eines Produkts mit dem Blueprint „Tire Care" wurde die Konfiguration der Reifenkomponente im Schritt „Price Matrix Definition" erweitert. Der Bereich „Define Tire Component" enthielt bisher die Felder „Tire Size", „Tire Exchange Logic" und „Max Amount of Tires". Neu hinzugekommen sind die Felder „Min. Amount of Tires" und „Step for Tire Contingent".

„Min. Amount of Tires" ist ein Textfeld, das sich ähnlich wie „Max Amount of Tires" verhält. Es sind nur ganze Zahlen zulässig, der kleinstmögliche Wert ist 2. „Step for Tire Contingent" ist ein Dropdown-Feld für die Schrittweite des Reifenkontingents. Zunächst steht darin nur die Option 2 zur Verfügung. Da das Feld als Dropdown umgesetzt ist, kann es später um weitere Optionen ergänzt werden. Dies entspricht auch der Konfiguration der Schrittweite bei „Define Duration Options" und „Define Annual Mileage Options".

Für die drei Felder gilt dieselbe Validierungslogik wie bei „Define Duration Options": Der Minimalwert muss kleiner sein als der Maximalwert, und sowohl Minimal- als auch Maximalwert müssen sich durch die Schrittweite teilen lassen.

Die beiden neuen Felder und ihre Werte erscheinen außerdem auf der Produktzusammenfassung. In der Preistabelle der Basisabdeckung, der empfohlenen Reifenkontingenttabelle des Produkts, dienen die Werte für Minimum, Maximum und Schrittweite als Eingabevalidierung. Es können nur Zahlen eingegeben werden, die zwischen dem Minimum und dem Maximum liegen (jeweils einschließlich) und durch die Schrittweite teilbar sind, derzeit also immer durch 2.

Bei der Vertragserstellung wird standardmäßig das empfohlene Reifenkontingent aus dieser Tabelle angezeigt. Der Vertrieb kann das Kontingent innerhalb der definierten Parameter ändern. So lassen sich beispielsweise 6 Reifen auswählen, nicht aber 7, und das Kontingent muss im festgelegten Minimal- und Maximalbereich liegen.