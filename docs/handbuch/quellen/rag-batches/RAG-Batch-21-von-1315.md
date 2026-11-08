# Batch 21 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeuggruppen verwalten**

In der Fahrzeugverwaltung können Sie auf der Übersichtsseite Fahrzeuggruppen anlegen, bearbeiten und löschen. Jede Fahrzeuggruppe wird als Karte dargestellt. Über die Schaltfläche „Create Vehicle Group“ öffnen Sie die Maske zum Anlegen einer neuen Gruppe. Dort tragen Sie einen Namen („Vehicle group name“) und eine Beschreibung („Vehicle group description“) ein. Die Schaltfläche „Create“ wird aktiv, sobald beide Felder korrekt ausgefüllt sind. Anschließend schließen Sie den Anlegevorgang mit einem Klick darauf ab. Die Größe des Beschreibungsfeldes lässt sich nicht verändern, indem Sie an der unteren rechten Ecke ziehen.

**Eingaben prüfen und Fehlermeldungen**

Beim Anlegen und Bearbeiten einer Fahrzeuggruppe sollen die Eingaben in den Feldern für Name und Beschreibung bereits während der Eingabe geprüft werden. Verstößt eine Eingabe gegen eine Validierungsregel, etwa durch Zahlen oder Sonderzeichen, führende oder nachgestellte Leerzeichen oder einen bereits vergebenen Namen, soll dies sofort erkennbar sein, ohne dass Sie das Feld verlassen oder die Tabulatortaste drücken müssen. Versuchen Sie, eine Fahrzeuggruppe mit einem bereits existierenden Namen anzulegen, wird die Gruppe nicht erstellt. Das System soll Ihnen dann eine verständliche Fehlermeldung anzeigen, aus der die Ursache hervorgeht, und nicht nur eine allgemeine Meldung wie „Unable to save vehicle group“.

**Fahrzeuggruppe bearbeiten und löschen**

Zum Bearbeiten einer vorhandenen Gruppe wählen Sie auf der Karte die Aktion „Edit“. Die Bearbeitungsmaske entspricht der Maske zum Anlegen. Die Schaltfläche zum Speichern der Änderungen bleibt deaktiviert, solange nichts geändert wurde. Sie wird erst aktiv, wenn Sie eine Änderung vorgenommen haben, die den Validierungsregeln entspricht. Verstößt eine Änderung gegen diese Regeln, wird die Schaltfläche wieder deaktiviert. Name und Beschreibung der Karte lassen sich auf diese Weise erfolgreich anpassen. Das Löschen einer Fahrzeuggruppe erfolgt ebenfalls über die Aktionen der Karte.

**Kartenaktionen und Darstellung**

Die Aktionen „Edit“ und „Delete“ erreichen Sie über die Schaltfläche mit den drei Punkten („...“) auf der Fahrzeuggruppen-Karte. Sie sollen vollständig sichtbar oberhalb der jeweiligen Karte erscheinen. Dies gilt auch für die dritte, letzte Karte einer Reihe. Die Schaltflächen sollen zudem über einen erweiterten Klickbereich verfügen, sodass sie nicht nur beim Klick direkt auf den Text reagieren. Ändern Sie die Größe des Browserfensters, während die Maske zum Anlegen oder Bearbeiten geöffnet ist, soll die Seite korrekt dargestellt werden und die Schaltfläche „Cancel“ weiterhin sichtbar bleiben.