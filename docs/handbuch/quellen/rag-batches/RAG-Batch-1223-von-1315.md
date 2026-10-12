# Batch 1223 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation**

Im Bereich der Vertragskalkulation stehen Ihnen mehrere Funktionen für die Verwaltung von Preisen zur Verfügung. Sie können Preiscluster anlegen. Dabei wird auch der Fall berücksichtigt, dass die Anlage nicht erfolgreich verläuft (negatives Szenario). In der Preisversionsübersicht können Sie das Produkt über ein Dropdown-Menü wechseln. Außerdem können Sie dort Preisversionen bearbeiten, duplizieren und löschen sowie abgelaufene Versionen anzeigen lassen.

**Preismatrix mit Preisfaktor**

Bisher ist die Preismatrix immer bearbeitbar. Künftig können Sie als MPC-Benutzer die Preismatrix eines bestehenden Preisclusters als Referenz verwenden und mit einem Preisfaktor versehen, um die vorhandenen Preise um einen bestimmten Faktor zu senken oder zu erhöhen. Hierfür gibt es den neuen Schalter „Relative base price cluster" (RBPC). Standardmäßig ist er ausgeschaltet; alle bestehenden Preismatrizen sind entsprechend auf RBPC = false gesetzt. Solange der Schalter ausgeschaltet ist, ist die Preismatrix bearbeitbar.

Wenn Sie den Schalter aktivieren, erscheinen zwei zusätzliche Formularfelder, die in diesem Fall Pflichtfelder sind. Im Feld „Reference Cluster" wählen Sie per Einfachauswahl den Referenzcluster aus; der Standardwert ist „none". Zur Auswahl stehen alle bestehenden absoluten Basispreiscluster (Schalter ausgeschaltet) der aktuellen Preisversion. Im Feld „Multiplication factor" geben Sie den Multiplikationsfaktor ein. Der Standardwert ist 1, zulässig sind maximal sechs Ziffern, davon eine für den ganzzahligen Teil und fünf für die Nachkommastellen, zum Beispiel 0.12345 oder 1.23456. Über die blaue Schaltfläche „Apply" wird die aktuelle Preismatrix mit den Werten des Referenzclusters befüllt, multipliziert mit dem von Ihnen festgelegten Faktor.

Bei aktiviertem RBPC-Schalter ist die Preismatrix schreibgeschützt. Zusätzlich wird eine Schaltfläche zur Vorschau der referenzierten Preise angezeigt, die nur bei aktiviertem Schalter sichtbar ist. Fahren Sie mit der Maus darüber, erscheint der Tooltip „Reference Prices and Changes". In der Preistabelle werden dann die ursprünglichen Preise des Referenzclusters sowie die anhand des Preisfaktors berechnete Differenz angezeigt. Ist der Schalter aktiv, ist nur die Schaltfläche „Download Template" sichtbar und nutzbar; sie lädt eine Vorlage mit den aktuellen Werten der Tabelle herunter.

Für Referenzcluster gelten folgende Regeln: Beim Bearbeiten eines Clusters wird Ihnen angezeigt, dass Sie einen referenzierten Cluster bearbeiten und welche Cluster auf den aktuellen Cluster verweisen. Beim Speichern werden Sie darüber informiert, dass Sie einen Referenzcluster aktualisieren und welche Cluster sich dadurch ändern. Ein Cluster, der selbst einen anderen Cluster referenziert, kann nicht als Referenz verwendet werden. Ein Cluster, der referenziert wird, kann nicht gelöscht werden. Beim ersten Cluster einer Preisversion wird der Schalter nicht angezeigt, da noch kein Cluster als Referenz zur Verfügung steht.

**Kontingentbasierte Produkte**

Als MPC-Benutzer können Sie kontingentbasierte Produkte anlegen, um ein breiteres Produktportfolio anzubieten und zusätzliches Geschäft zu gewinnen. Dafür gibt es einen neuen Blueprint „Compact" in der Datenbank sowie einen blueprintspezifischen Ablauf zur Produktanlage. Den Compact-Blueprint wählen Sie aus der Division Passenger Car aus. Der erste Unterschied zeigt sich in Schritt 4 bei den Vertragsablaufkriterien: Hier steht ausschließlich die Option „Contingent" zur Verfügung. Als eingeschlossene Deckung ist nur „Maintenance (MAINTEN P001)" vorgesehen.

In Schritt 5, der Definition der Preismatrix, können Sie im leeren Zustand über die Schaltfläche „New Contingent" Kontingente hinzufügen. Ein Kontingent steht für die Anzahl der in einem Vertrag enthaltenen Leistungen. Für jedes Kontingent können Sie eine minimale und eine maximale Vertragslaufzeit in Monaten festlegen, wobei der Abstand zwischen Minimum und Maximum 12 Monate beträgt. „Cancel" schließt das Fenster und fragt, ob Änderungen gespeichert werden sollen; „Add" fügt das Kontingent der Liste hinzu. Hinzugefügte Kontingente werden in der Liste aufsteigend sortiert, auch wenn sie in anderer Reihenfolge angelegt wurden. Jede Kontingentkarte besitzt eine Löschen-Schaltfläche, mit der das jeweilige Kontingent entfernt wird. Die Angabe für das Maximum wird von dem Kontingent übernommen, das den höchsten Wert für die maximale Laufzeit hat.

**Automatisierte Tests**

Elemente, die durch automatisierte Tests erzeugt werden, erscheinen künftig nicht mehr in der Entwicklungsoberfläche (Dev UI).