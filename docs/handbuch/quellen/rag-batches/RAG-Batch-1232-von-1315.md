# Batch 1232 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Preiscluster in der Contract Calculation**

Im Bereich Preise der Contract Calculation sehen MPC-Anwender zu jeder Preisversion, wie viele Cluster dazu angelegt sind. Außerdem erhalten sie eine Übersicht dieser Cluster mit dem Clusternamen und den verfügbaren Aktionen. Solange noch kein Cluster existiert, zeigt die Übersicht eine zentrierte Schaltfläche „New Cluster“. Sobald das erste Cluster angelegt wurde, erscheint diese Schaltfläche unterhalb der Liste.

**Neues Cluster anlegen**

Über „New Cluster“ gelangen Anwender auf eine neue Seite. Dort tragen sie den Clusternamen ein und wählen aus einer Dropdown-Liste mit Einfachauswahl eine Fahrzeuggruppe. Name und Fahrzeuggruppe sind Pflichtangaben. Außerdem füllen sie die Preistabelle aus. Der Name der Preisversion ist bereits vorausgefüllt, und zwar mit dem Namen der zuvor ausgewählten Preisversion. Die Überschrift der Seite enthält diesen Namen als dynamische Variable.

Die Basis der Preistabelle wird aus den Angaben der Produktkonfiguration erzeugt, also aus dem zweiten Schritt des Produktanlageprozesses. Die Laufleistung wird in Kilometern angegeben (z. B. 0; 5.000; 10.000; 15.000) und steht in der ersten senkrechten Spalte. Die Laufzeit wird in Monaten angegeben (z. B. 6; 12; 18; 24) und verläuft waagerecht. Beide Achsen werden aus den Werten Min, Max und Step erzeugt: Sie beginnen beim Min-Wert, und zu jedem vorherigen Wert wird der Step-Wert addiert, bis der Max-Wert erreicht ist.

Anwender können jeden Schnittpunkt von Laufleistung und Laufzeit mit einem Preis befüllen. Zulässig sind nur numerische Zeichen mit maximal zwei Nachkommastellen. Bei der Erzeugung der Matrix wird zudem der Max-km-Wert berücksichtigt. Ist für eine Zelle das Produkt aus der Laufzeit (Spalte) und der Laufleistung (Zeile) größer als der bei der Produktanlage definierte Max-km-Wert multipliziert mit der minimalen Laufzeit, wird die Zelle ausgegraut. Sie ist dann nicht editierbar, und es können keine Werte eingegeben werden.

Die Schaltfläche „Create“ wird aktiv, sobald mindestens ein Preispunkt befüllt ist. Mit „Create“ schließen Anwender die Anlage ab, mit „Cancel“ brechen sie sie ab. Nach erfolgreicher Anlage erscheint die Erfolgsmeldung „"Cluster X" was successfully created.“, die 15 Sekunden lang sichtbar ist und dann verschwindet. Schlägt die Anlage fehl, erscheint die Fehlermeldung „Something went wrong, and we could not create your Cluster. Please try again.“ Diese Meldung enthält eine Schaltfläche „Close“ und bleibt so lange sichtbar, bis Anwender sie schließen.

**Cluster bearbeiten**

Mit der Aktion „Edit“ können Anwender den Clusternamen ändern, eine andere Fahrzeuggruppe aus der Dropdown-Liste mit Einfachauswahl wählen und die bestehenden Preise in der Tabelle anpassen. Cluster lassen sich nur bei zukünftigen Preisversionen bearbeiten. Bei der aktuellen Preisversion ist das nur möglich, wenn das Produkt den Status „Deactivated“ oder „Ready“ hat. Die Bearbeitung endet entweder mit „Update“ oder mit „Cancel“. Nach erfolgreicher Änderung erscheint die Meldung „"Cluster X" was successfully updated.“, die 15 Sekunden lang sichtbar ist. Wird die Bearbeitung abgebrochen, erscheint die Fehlermeldung „"Cluster X" was not updated.“ Sie enthält eine Schaltfläche „Close“ und bleibt sichtbar, bis Anwender sie schließen.

**Cluster löschen**

Über „Delete“ können Anwender ein Cluster löschen. Die Aktion ist nur für Cluster möglich, die nicht zu einer aktuell aktiven Preisversion gehören. Andernfalls ist sie deaktiviert. Zunächst erscheint eine Sicherheitsabfrage: „Are you sure you want to delete this item? This action cannot be undone, and you will lose the Cluster with all the details associated with it. Please confirm that you would like to proceed with the deletion.“ Mit „Delete“ bestätigen Anwender den Vorgang, mit „Cancel“ brechen sie ihn ab. Nach erfolgreichem Löschen erscheint die Meldung „"Cluster X" was successfully deleted.“, die 15 Sekunden lang sichtbar ist. Schlägt das Löschen fehl, erscheint „"Cluster X" was not deleted.“ Diese Fehlermeldung enthält eine Schaltfläche „Close“ und bleibt sichtbar, bis Anwender sie schließen.

**Cluster duplizieren**

Mit der Schaltfläche „Duplicate“ können Anwender ein Cluster klonen, einschließlich aller zugehörigen Details. Sie gelangen auf eine neue Seite und geben dort den Namen des geklonten Clusters ein. Außerdem wählen sie eine andere Fahrzeuggruppe, die im selben Gültigkeitszeitraum noch keinem Cluster zugeordnet ist. Felder der Preistabelle lassen sich sofort oder später ändern. Der Name der Preisversion ist auch hier bereits mit dem Namen der zuvor gewählten Preisversion vorausgefüllt. Der Vorgang endet mit „Create“ oder „Cancel“. Erfolgs- und Fehlermeldungen entsprechen denen bei der Neuanlage eines Clusters.