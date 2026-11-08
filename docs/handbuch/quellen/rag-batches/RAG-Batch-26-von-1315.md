# Batch 26 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeuggruppen – Übersicht und Karten**

Über den Menüpunkt „Übersicht" im Bereich Fahrzeuggruppen öffnet sich ein Untermenü. Dort können Sie eine neue Fahrzeuggruppe anlegen und die Karten bereits angelegter Fahrzeuggruppen ansehen. Jede Karte zeigt den Namen der Fahrzeuggruppe, den Hinweis auf die letzte Aktualisierung mit Benutzer-ID und Datum im Format TT.MM.JJJJ sowie die Benutzer-ID der Person, die die Gruppe zuletzt geändert hat, und eine Kurzbeschreibung. Eine Fahrzeuggruppe können Sie entweder neu anlegen oder durch Auswahl einer der aufgelisteten Karten öffnen.

**Bestehende Fahrzeuggruppe öffnen**

Wenn Sie eine Karte auswählen, öffnet sich eine neue Seite mit drei Schaltflächen sowie dem Namen und der Beschreibung der Fahrzeuggruppe. Mit „Zurück" gelangen Sie wieder in die Übersicht der Fahrzeuggruppen.

Über „Gruppe bearbeiten" öffnet sich ein Pop-up, in dem MPC-Benutzer den Namen und die Details der Fahrzeuggruppe ändern können. Mit „Abbrechen" wird das Pop-up geschlossen, und alle bearbeiteten Angaben gehen verloren. Mit „Aktualisieren" werden die Änderungen gespeichert. Nach erfolgreicher Änderung erhalten MPC-Benutzer eine Erfolgsmeldung: „Vehicle Group "X" was successfully updated" bzw. „Vehicle group details was successfully updated", wobei „X" für den Namen der Fahrzeuggruppe steht. Kann die Änderung nicht durchgeführt werden, erscheint eine Fehlermeldung: „Vehicle Group "X" was not updated" bzw. „Vehicle group details was not updated".

Mit „Entfernen" löschen Sie einen oder mehrere ausgewählte Datensätze aus der Fahrzeuggruppe. Zuvor ist eine zweite Bestätigung in einem Pop-up erforderlich. Dort wird darauf hingewiesen, dass die ausgewählten Datensätze durch das Entfernen wieder zur Zuordnung zu einer anderen Fahrzeuggruppe zur Verfügung stehen. Bei erfolgreichem Entfernen erhalten MPC-Benutzer die Meldung „Vehicle Group "X" was successfully updated". Wird der Vorgang abgebrochen, erscheint die Meldung „Vehicle Group X" was not updated". Über „Abbrechen" wird der Entfernen-Vorgang beendet.

**Tabelle mit Fahrzeuginformationen**

Die Tabelle basiert auf den in der Datenbank gespeicherten Baumustern (BM6). Die relevanten Informationen (Position 2 bis 12) werden durch einen Aufruf der CePro-Stammdaten-API angezeigt. Die Tabelle enthält insgesamt zwölf Spalten: BM6, Marke/Division (zum Beispiel Mercedes-Benz), Klasse (zum Beispiel C-Klasse), Baureihe (zum Beispiel 205), Motortyp (Diesel, Elektro oder Benzin), Motorzylinder (4 oder 6), Getriebe (manuell oder automatisch), 4matic, Hybrid (wahr/falsch), Real Performance Car (zum Beispiel AMG- oder Brabus-Motor), Karosserieform (Coupé, Cabriolet oder Limousine) und Name.

**Seitenaufteilung und Auswahl**

Die Ergebnisse werden seitenweise angezeigt. Im Bereich der Seitennavigation können MPC-Benutzer die gewünschte Seite auswählen. Standardmäßig werden 10 Datensätze pro Seite angezeigt. Über ein Auswahlfeld lässt sich die Anzeige auf 20, 30, 40 oder maximal 50 Datensätze pro Seite erweitern. Ab Datensatz 51 steht eine neue Seite zur Verfügung.

Datensätze können einzeln ausgewählt werden, oder Sie nutzen „Alle auswählen". Diese Funktion wählt die Datensätze aus, die auf der aktuellen Seite sichtbar sind (zum Beispiel 10, 20, 30, 40 oder 50).

**Gestaltung**

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Ausblick**

Für die Zeit nach dem MVP ist vorgesehen, ein Änderungsprotokoll für angelegte Fahrzeuggruppen (betroffenes Objekt, aktueller Wert, vorheriger Wert, Änderungsdatum, Benutzer und Grund) einzuführen, die Tabellenspalten nach Wunsch umsortieren zu können sowie die Informationen jeder Spalte auf verschiedene Arten zu sortieren (noch zu klären).