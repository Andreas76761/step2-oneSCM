# Batch 663 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Download-Funktion für Nacos-Benutzer**

Für Benutzer mit der Rolle Nacos steht in oneSCM eine eigene Download-Funktion zur Verfügung. Sie baut auf der Customer-Export-Datei auf, die als ausgehende Datei in Richtung Nacos erzeugt wird. Nacos-Benutzer können damit alle Customer-Export-Dateien für den deutschen Markt einsehen, die in den letzten 30 Tagen erzeugt wurden.

Im oneSCM-Menü ist für Nacos-Benutzer ausschließlich die Option „Downloads“ verfügbar. Andere Seiten sind für sie nicht zugänglich. Wählt der Benutzer diese Option, gelangt er auf eine neue Seite mit einer Ergebnistabelle. Die Tabelle enthält die folgenden Spalten: „File Name“ mit demselben Namen wie die zugehörige CSV-Datei im S3-Bucket, „Generated On“ mit dem Zeitstempel der Dateierzeugung, „Downloaded On“ sowie „Actions“. Die Spalte „Downloaded On“ bleibt leer, solange die Datei noch nicht heruntergeladen wurde. Andernfalls zeigt sie den Zeitstempel des Downloads an und wird bei jedem weiteren Download auf den letzten Zeitpunkt aktualisiert.

In der Spalte „Actions“ steht die Schaltfläche „Download“. Nach einem Klick darauf öffnet sich der Standarddialog zur Auswahl des Speicherorts. Sobald der Zielordner gewählt ist, wird die Datei dort gespeichert. Jede Datei in der Tabelle kann beliebig oft heruntergeladen werden.

Standardmäßig steht die zuletzt erzeugte Kundenliste an erster Stelle der Tabelle. Die Tabelle lässt sich nach „File Name“, „Generated On“ und „Downloaded On“ sowohl aufsteigend als auch absteigend sortieren. Dateien, die älter als 30 Tage sind, werden automatisch aus der Tabelle entfernt.

Übersteigt die Anzahl der Ergebnisse die maximale Anzahl an Einträgen pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, zwischen denen der Benutzer wechseln kann. Standardmäßig werden maximal 10 Datensätze pro Seite angezeigt. Über ein Dropdown-Menü kann der Benutzer stattdessen 10, 20, 30, 40 oder 50 Datensätze pro Seite auswählen. Der zuletzt gewählte Wert wird nicht gespeichert und nach dem Aktualisieren der Seite auf 10 Datensätze pro Seite zurückgesetzt.

Die Gestaltung der Seite entspricht den Vorgaben der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.