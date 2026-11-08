# Batch 1270 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation: Neuerungen und Verbesserungen**

**Kampagnen**

Bei der Bearbeitung einer aktiven Kampagne sind auf der ersten Seite nur noch die Felder Kampagnenname, Sales Description (zuvor „Campaign Description"), Internal Description und Kostenstelle änderbar. Alle übrigen Felder, Eingaben und Dropdowns sind deaktiviert, sodass MPC-Benutzer keine Angaben ändern können, die nicht änderbar sein sollen. Neu ist das optionale Textfeld „Internal Description" für interne Zwecke mit maximal 512 Zeichen. Zusätzlich gibt es das Dropdown „Campaign Type" mit den Werten „Sales Campaign" und „After Sales Campaign". Ist eine Kampagne aktiv, wird bei einer Sales Campaign der Wert S_CAMP gemeinsam mit Produkten und Preisen an die Vertragserzeugung übermittelt, bei einer After Sales Campaign der Wert AS_CAMP. Außerdem wurde „Account Number" in „Debtor Number" umbenannt, und „Campaign Description" heißt nun „Sales Description". Als weitere Ergänzungen sind die Provision Component und die External Campaign ID genannt.

Beim Abruf von Kampagnen enthält die Antwort jetzt auch die Angaben zu Vertriebskanälen (SalesChannels) und Clustern (ClusterIds). Die Parameter „startDate" und „endDate" heißen nun „validFrom" und „validTo".

Beim Abbrechen der Bearbeitung einer Kampagne erscheint der Bestätigungsdialog nur noch dann, wenn im geöffneten Element tatsächlich Änderungen vorgenommen wurden.

In der Kampagnenverwaltung und -übersicht wurde das Zahlenformat angepasst. Als Tausendertrennzeichen dient der Punkt, als Dezimaltrennzeichen das Komma. Dies gilt sowohl für die Darstellung in der Übersicht als auch für den Erstellungsprozess. Bei der Eingabe wird das Tausendertrennzeichen automatisch formatiert: Sobald die vierte Ziffer eingegeben wird, erscheint der Punkt nach der ersten Ziffer.

**Preisversionen und Preiscluster**

Im Aktionsmenü einer Preisversion steht nun die Option zum Duplizieren zur Verfügung. Der Name einer Preisversion muss innerhalb eines Produkts eindeutig sein; zuvor konnten für ein Produkt mehrere Preisversionen mit demselben Namen angelegt werden.

Aktuelle Preiscluster lassen sich nun auch ansehen, wenn das Produkt veröffentlicht oder deaktiviert ist. Im Aktionsmenü gibt es dafür die Aktion „Ansehen" (View), die das Cluster mit allen Feldern im Lesemodus öffnet.

Wird die Preismatrix eines Produkts geändert, werden die bestehenden Preiscluster dieses Produkts nun entsprechend berücksichtigt. Zuvor konnte es passieren, dass nach einer Reduzierung der maximalen Gesamtlaufleistung (z. B. von 90.000 auf 70.000 km) der alte Wert in bestehenden Clustern erhalten blieb und im Vertragserzeugungsprozess weiterhin auswählbar war.

**Produktdefinition und Produkterstellung**

In der Preismatrix-Definition wurden Reihenfolge und Titel der Abschnitte angepasst: Der erste Abschnitt heißt „Define Duration Options", der zweite „Define Annual Mileage Options", jeweils mit den zugehörigen Eingabefeldern. Die Validierungen der Preismatrix-Definition im Frontend entsprechen jetzt denen im Backend; die Differenz zwischen Minimal- und Maximalwert muss ein Vielfaches der Schrittweite sein.

In Schritt 3 der Produktdefinition sind die Mehrfachauswahllisten Sales Level, Sales Channel, Possible Discounts und Possible Modifications standardmäßig vorausgewählt. Das spart Marktbenutzern Klicks, da sie meist die Mehrheit der Einträge wählen und nur nicht gewünschte abwählen müssen. Die Komponente wurde überarbeitet, damit die Vorauswahl deutlich erkennbar ist.

Die Auswahl der Sales Levels wirkt sich nun auf die Limits im Schritt „Vehicle Preconditions" (Schritt 5) aus. Bei der Erstellung eines Produkts muss nur für die ausgewählten Sales Levels ein Limit konfiguriert werden; bei Auswahl von Direct-to-Customer ist nur dieses Limit zu definieren. Wird beim Bearbeiten ein Sales Level abgewählt, entfallen das zugehörige Limit und dessen Verknüpfung zum Produkt. Wird ein zusätzliches Sales Level ausgewählt, erscheint das Limit in Schritt 5 und muss konfiguriert werden. Bis dahin ist die Schaltfläche „Speichern" deaktiviert; ein Tooltip weist darauf hin, dass neue Sales Levels ausgewählt wurden und die entsprechenden Limits in Schritt 5 zu konfigurieren sind. Über „Weiter" gelangt man zu Schritt 5, und nach Definition der fehlenden Limits können die Änderungen dort gespeichert werden. Die Einträge der Sales-Level-Auswahl heißen nun „Direct-to-Customer", „Dealerships" und „MPCs/MOCs" (Market Performance Centers/Market Operations Centers).

Beim Bearbeiten eines veröffentlichten Produkts werden alle Felder, die in diesem Status nicht änderbar sind, deaktiviert. Eine Fehlermeldung als Toast erscheint nicht mehr.

**Übersichtsseiten und Suche**

Auf den Übersichtsseiten für Fahrzeuggruppen und Produkte werden die Einträge standardmäßig nach Erstellung bzw. letzter Änderung sortiert, wobei die neuesten zuerst erscheinen. Die Suche nach Verträgen über Kunde oder Zahler wurde technisch verbessert.