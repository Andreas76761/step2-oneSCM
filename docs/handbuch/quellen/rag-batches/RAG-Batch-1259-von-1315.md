# Batch 1259 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 18 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kampagnenverwaltung**

In der Kampagnenübersicht steht im Aktionsmenü einer Kampagne, das über die drei Punkte in der Spalte „Actions“ geöffnet wird, nun unabhängig vom Kampagnenstatus und unabhängig vom angemeldeten Benutzer die Aktion „View“ zur Verfügung. Sie erscheint als erste Option in der Liste. Bei Kampagnen mit dem Status „Upcoming“ kann ein MPC-Benutzer den Discount Type nicht mehr ändern. Das Feld ist ausgegraut, sodass sich der Wert nicht mehr zwischen Fixed Amount/Percentage und Sticker Price umstellen lässt.

Der erste Schritt der Kampagnenerstellung wurde überarbeitet, damit Kampagnen einfacher angelegt werden können und das System auf Fehler oder nicht ausgefüllte Pflichtfelder hinweist. Alle Felder haben nun dieselbe Breite, sodass auch die vollständige Bezeichnung samt Pflichtfeldmarkierung „*“ gut lesbar ist. Die External Campaign ID, bisher ein optionaler Wert mit maximal 8 Zeichen ohne weitere Einschränkungen, muss nun innerhalb des definierten Gültigkeitszeitraums (Valid From/To) im jeweiligen Markt eindeutig sein. Überschneidet sich der Zeitraum einer neuen Kampagne mit dem einer bestehenden Kampagne, wird dieselbe External Campaign ID nicht akzeptiert. Beginnt die neue Kampagne erst nach Ende der bestehenden, oder wird eine andere ID verwendet, wird die Eingabe akzeptiert.

In Schritt 2 der Kampagnenerstellung steht für Kampagnen mit Sticker Price nun auch eine Contingent-Tabelle zur Verfügung. Sie unterstützt dieselben Funktionen wie die Tabelle für Laufzeit und Laufleistung, etwa die Anwendung eines allgemeinen Rabatts, Maximalwerte je Zelle und den Wechsel zwischen Cluster und Produkten. Diese Tabelle kann ebenfalls bearbeitet werden. Außerdem gilt für die Preismatrix bei Kampagnen mit dem Discount Type Sticker Price eine Grenze: Ein MPC-Benutzer darf dort nur Werte eingeben, die unter dem monatlichen Wert des Produkts liegen.

**Produktverwaltung und Blueprints**

In der Produktzusammenfassung werden nun die Branchen (Industry) angezeigt, die in Schritt 3 „Sales and Contract Configurations“ ausgewählt wurden. Zusätzlich gibt es einen Tab zum Anlegen von Industry Codes, der vor allem für Testzwecke gedacht ist. Die Funktionen zum Erstellen gehören zum Industry-Overview-Epic.

Entfernt oder ergänzt ein HQ-Admin bei einem Blueprint optionale Coverage-Codes oder Body-Coverage-Codes, erscheint ein Hinweisdialog mit der Überschrift „Removing or Adding Coverages“ und der Frage, ob der Blueprint mit diesen Änderungen an den Coverages aktualisiert werden soll. Der Text weist darauf hin, dass sich das Hinzufügen oder Entfernen von Coverages nur auf Produkte auswirkt, die nach der Aktualisierung des Blueprints erstellt werden, während bereits angelegte Produkte unverändert bleiben. Mit „Cancel“ wird der Dialog geschlossen, ohne den Blueprint zu speichern, mit „Update“ wird der Blueprint gespeichert.

Produktbilder werden nun über die Zusammensetzung aus Host und Bildpfad geladen. Dadurch funktionieren sie auch auf den beiden neuen App-Hosts, die ohne VPN erreichbar sind. Das betrifft Blueprint, Produkt, Vertragsangebot und Vertragsbestätigung. Bei Prozentwerten wurde zudem der Hinweis „All input prices are in EUR“ entfernt.

**Preisversionen, Cluster und Fahrzeuggruppen**

Wird eine Preisversion dupliziert, die einen Basis-Preiscluster und mehrere relative Preiscluster enthält, bleiben die relativen Preiscluster samt ihren Verweisen auf den Basiscluster und dem Preisfaktor erhalten. Früher wurden sie bei der Duplizierung in Basiscluster umgewandelt und verloren den Bezug.

Wenn beim Anlegen eines Clusters ein Cluster-Name eingegeben wird und anschließend eine Fahrzeuggruppe erstellt wird, bleibt der Name nach der Rückkehr zur Cluster-Seite erhalten. Auch die Darstellung der Fahrzeuggruppen wurde verbessert. Die Tabelle in der Ansicht einer Fahrzeuggruppe verhält sich nun wie die Tabelle im Tab „Unassigned“ und ist kein Container mit fester Höhe mehr, sodass nicht gleichzeitig die Seite und die Tabelle scrollen. Der Hover-Effekt auf dem Aktionen-Button der Fahrzeuggruppen-Karte ist nun rund statt eckig. Die Überschriften bei leeren Zuständen und Fehlerzuständen haben statt 24 px nun 20 px Schriftgröße, entsprechend dem Mockup.