# Batch 27 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeuggruppen – Übersicht**

Über den Menüpunkt „Overview" gelangen MPC-Nutzer in ein Untermenü, in dem sich Fahrzeuggruppen für den aktuellen Markt anlegen lassen. Im MVP ist der Standardmarkt DE. Wurde für den Markt noch keine Fahrzeuggruppe erstellt, erscheint die Meldung „No Vehicle Group available", und die Schaltfläche zum Anlegen einer Fahrzeuggruppe steht weiterhin auf der Seite zur Verfügung. Sind in der Datenbank bereits Fahrzeuggruppen für den aktuellen Markt vorhanden, werden diese seitenweise als Karten dargestellt. Tritt beim Abrufen der Daten ein Fehler auf, wird die Meldung „Data cannot be displayed" als Toast-Hinweis angezeigt. Ein Klick auf „Create Group" öffnet eine leere Karte mit dem Titel „Create Vehicle Group", mit der die Erstellung einer neuen Fahrzeuggruppe beginnt. Die Oberfläche folgt der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design. Dass Gruppen pro Markt eindeutig sein müssen, ist für den MVP noch nicht vorgesehen.

**Fahrzeuggruppen – Baumuster suchen: Filterbereich**

Die Ebene „Search Baumuster" öffnet ein Untermenü, in dem MPC-Nutzer Fahrzeuginformationen einsehen und filtern können. Im Ausgangszustand ist kein Filter gesetzt, alle Filterfelder sind leer, und der Ergebnisbereich zeigt keine Treffer an.

Standardmäßig stehen folgende Felder und Filter zur Verfügung: Das Freitextfeld „Search" dient der Suche nach einem bestimmten BM6-Code (exakte Übereinstimmung). Das Feld „Baumuster" akzeptiert maximal sechs Ziffern, zum Beispiel 213211, und keine Sonderzeichen. Existiert das eingegebene Baumuster nicht, erscheint die Fehlermeldung „Please enter a valid Baumuster Number". Hinzu kommen Auswahllisten für Marke/Division (zum Beispiel Mercedes-Benz, PC, MB Vans, Smart), Klasse (zum Beispiel A-, B-, C-, G- oder S-Klasse) und Baureihe (zum Beispiel 202 bis 206).

Über die Schaltfläche „More filters" öffnet sich ein Pop-up mit je einer Mehrfachauswahl für folgende Filter: Motortyp (zum Beispiel Diesel, Electric, Hybrid, Regular fuel), Zylinderzahl (zum Beispiel 4, 6, 8, 12), Getriebe (Manual, Automatic), 4Matic, Hybrid (True, False), Real Performance Car (zum Beispiel AMG- oder Brabus-Motor), Karosserieform (zum Beispiel Coupe, Limousine, Cabriolet), Name, Modelljahr und Zuordnung („Assigned to", zum Beispiel Vehicle Group A Class). Am unteren Rand stehen „Apply" und „Cancel" zur Wahl. Mit „Apply" schließt sich das Pop-up, und jede gewählte Option wird im Filterbereich als eigenes Tag im Format „Filtername: gewählte Option" angezeigt. Jedes Tag besitzt ein „X", mit dem sich die Auswahl wieder entfernen lässt. Mit „Cancel" werden alle Änderungen verworfen.

Änderungen an den Filtern wirken sich nicht automatisch auf die Suchergebnisse aus. Erst die Schaltfläche „Search for Baumuster" zeigt die Ergebnisse passend zur Auswahl an. Die Schaltfläche „Reset" setzt alle Filterauswahlen auf den leeren Ausgangszustand zurück, aktualisiert die Ergebnisse dabei aber nicht. Zusätzlich ist im Bereich eine Schaltfläche zum Erstellen einer Fahrzeuggruppe vorgesehen.

**Ergebnisbereich, Seitenaufteilung und Auswahl**

Die Ergebnisse erscheinen in einer Tabelle mit den Spalten Checkbox, Model type (BM6), Brand / Division, Class, Series, Motor Type, Motor Cylinder, Transmission, 4matic, Hybrid, Real Performance Car, Body Form, Model Year und Name. Ist ein Baumuster bereits einer Gruppe zugeordnet, ist seine Checkbox deaktiviert; ist es nicht zugeordnet, lässt sich die Checkbox verwenden. In der Spalte 4matic wird die zugehörige Fahrzeuggruppe (zum Beispiel „Vehicle Group 1") oder „Unassigned" angezeigt.

Übersteigt die Trefferzahl die maximale Anzahl an Einträgen pro Seite, werden die Ergebnisse auf mehrere Seiten verteilt, und die Nutzer können zwischen den Seiten navigieren. Standardmäßig werden 10 Datensätze pro Seite angezeigt. Über eine Auswahlliste lässt sich dieser Wert auf 10, 20, 30, 40 oder 50 ändern. Der zuletzt gewählte Wert wird nicht gespeichert und nach einem Neuladen der Seite wieder auf 10 zurückgesetzt.

Datensätze lassen sich einzeln auswählen oder gemeinsam über die Checkbox in der Kopfzeile. Diese Auswahl „Select all" bezieht sich nur auf die aktuell sichtbare Seite. MPC-Nutzer können ausschließlich nicht zugeordnete BM6 auswählen.

Auch hier folgt die Gestaltung der Mercedes-Benz Workbench und dem vom Kunden validierten UI-Design. Zu beachten ist, dass bei Nichtverfügbarkeit von CePRO keine Daten angezeigt werden können.