# Batch 1220 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Hinweis zu den Rohdaten:** Das erste Ticket (Verwaltung referenzierter und referenzierender Cluster mit Preisfaktor) hat den Status „Cancelled“. Die beschriebene Funktion wurde also nicht umgesetzt und gehört nicht ins Benutzerhandbuch. Der folgende Text beschreibt daher nur die Anlage benutzerdefinierter Coverage Codes.

**Coverage Codes anlegen**

Coverage Codes sind nicht mehr fest im Blueprint hinterlegt. Benutzer der Rolle HQPM können sie selbst definieren. Über die Schaltfläche „Create Coverage Code“ öffnet sich ein Pop-up, das durch die Anlage in drei Schritten führt. In jedem Schritt lässt sich der Vorgang abbrechen. Ein Klick auf das X löst dabei einen Dialog zum Beenden aus.

**Schritt 1: Coverage Code definieren**

Hier erfassen Sie die Grunddaten. Alle Felder sind Pflichtfelder.

Der Coverage Code besteht aus genau vier Zeichen, erlaubt sind Großbuchstaben und Ziffern. Eingaben werden automatisch in Großbuchstaben umgewandelt. Der Code muss eindeutig sein. Das System prüft dies beim Wechsel zum zweiten Schritt und noch einmal vor dem Speichern. Existiert der Code bereits, erscheint die Meldung „Coverage Code with this name is already existing. Please change it and try again“. Werden die Vorgaben nicht erfüllt, erscheint eine Fehlermeldung.

Die Coverage Reference umfasst mindestens 3 und höchstens 10 Zeichen. Erlaubt sind Großbuchstaben, Ziffern, Unterstriche und Bindestriche. Auch hier wird automatisch in Großbuchstaben umgewandelt, und bei Verstößen erscheint eine Fehlermeldung.

Die Division wählen Sie in einem Dropdown mit Mehrfachauswahl. Zur Verfügung stehen „Passenger Cars“ und „Vans“. Wenn möglich, zeigt das Feld die Anzahl der gewählten Einträge an, etwa „X divisions selected“.

Die Coverage Category wählen Sie einzeln aus. Die Optionen Base, Body und Optional erscheinen in alphabetischer Reihenfolge.

Die Default Short Description muss zwischen 5 und 200 Zeichen lang sein.

Sobald alle Pflichtfelder ausgefüllt sind, können Sie zum nächsten Schritt wechseln.

**Schritt 2: Marktspezifität**

Hier legen Sie fest, in welchen Märkten der Coverage Code bei der Produktanlage verwendet werden kann. Dafür stehen zwei Optionen zur Verfügung.

Beim ersten Aufruf ist die Option „Current and Upcoming Markets“ vorausgewählt. Alle Märkte der Liste sind dann markiert, die Auswahlkästchen lassen sich aber nicht ändern. Rechts werden die zugehörigen Beschreibungsfelder angezeigt. Kommt später ein neuer Markt in oneSCM hinzu, wird er automatisch einbezogen. Die in Schritt 1 gespeicherte Default Short Description wird dann als Kurzbeschreibung vorbelegt. Diese Beschreibung sehen Sie auch, wenn Sie die Seite nach dem Hinzufügen des Marktes erneut bearbeiten, ebenso in anderen Bereichen der Anwendung, in denen diese Information erscheint. Geben Sie selbst eine neue Kurzbeschreibung ein, wird diese gespeichert.

Wählen Sie „Custom Markets“, bleiben zunächst alle Märkte ausgewählt, die Kästchen lassen sich nun aber einzeln an- und abwählen. Wenn Sie Märkte abwählen und auf „Confirm“ klicken, verschwinden die zugehörigen Beschreibungsfelder auf der rechten Seite. Ist kein Markt ausgewählt, bleibt „Confirm“ deaktiviert. Mindestens ein Markt muss also gewählt sein. Wählen Sie einen zuvor abgewählten Markt wieder aus, ohne zwischendurch zum vorherigen oder nächsten Schritt zu wechseln, werden die zuvor gespeicherten Werte wiederhergestellt. Das gilt auch, wenn Sie nicht auf „Confirm“ geklickt haben. Wechseln Sie zurück zu „Current and Upcoming Markets“, werden wieder alle Märkte ausgewählt. Fehlende Kurzbeschreibungen werden durch die Default Short Description ersetzt.

Die Liste der verfügbaren Märkte enthält derzeit nur Deutschland. Mit jedem weiteren von oneSCM unterstützten Markt wird sie erweitert. Das erste Kästchen der Liste dient als „Select All“ bzw. „Deselect All“. Sind alle Einträge ausgewählt, ist das Kästchen markiert und beschriftet mit „Deselect All“. Ein Klick hebt dann alle Auswahlen einschließlich dieses Kästchens auf, und die Beschriftung wechselt zu „Select All“. Sind nur einige Einträge ausgewählt, lautet die Beschriftung „Select All“ und das Kästchen zeigt einen Zwischenzustand („–“). Ein Klick wählt dann alle Einträge aus, und die Beschriftung wechselt zu „Deselect All“.

Nach der Bestätigung erscheint für jeden Markt eine Karte, und zwar pro marktspezifischer Sprache. Für die Schweiz gibt es zum Beispiel Karten für DE, FR und IT. Jede Karte enthält zwei Eingabefelder. Die Short Description ist ein Pflichtfeld mit 5 bis 200 Zeichen. Die Long Description ist optional und umfasst 5 bis 500 Zeichen. Löschen Sie den Inhalt einer Kurzbeschreibung, wird automatisch der Wert der Default Short Description eingesetzt. Wählen Sie einen Markt ab und bestätigen, werden die Karte und die zugehörigen Beschreibungen entfernt und gelöscht.

Eingaben bleiben beim Wechsel zwischen den Optionen erhalten. Sobald mindestens ein Markt ausgewählt und bestätigt wurde, werden Eingaben und Änderungen auch beim Wechsel mit „Back“ oder „Next“ gespeichert. Sind ungültige Daten eingetragen, ist „Next“ deaktiviert. Kehren Sie von einem anderen Schritt zurück, wird das fehlerhafte Feld zurückgesetzt.

Können die Märkte nicht geladen werden, bleiben der Auswahlbereich und die Beschreibungen grau. Zusätzlich erscheint die Meldung „Could not load available markets. Please exit and try again later“.

**Schritt 3: Übersicht und Bestätigung**

Im letzten Schritt sehen Sie alle zuvor konfigurierten Angaben in einer Übersicht. Mit „Back“ gelangen Sie zum vorherigen Schritt. Mit „Confirm“ wird die Konfiguration des Coverage Codes in der Übersichtsliste gespeichert. Anschließend erscheint die Erfolgsmeldung „Coverage Code saved successfully“.