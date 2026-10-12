# Batch 1239 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Schritt 5: Fahrzeugvoraussetzungen (Vehicle Preconditions)**

Nachdem alle Pflichtangaben aus dem vorherigen Schritt (Schritt 4, Konfiguration 2) vollständig erfasst wurden und die Schaltfläche „Weiter“ aktiv ist, gelangen Sie als MPC-Nutzer beim Anlegen eines Produkts zu Schritt 5, den Fahrzeugvoraussetzungen. Hier legen Sie fest, welche Fahrzeuge dieses Produkt erwerben dürfen. Dazu können Sie Alters- und Laufleistungsgrenzen für unterschiedliche Nutzergruppen definieren und Prüfungen zur Fahrzeugwartung festlegen. So stellen Sie sicher, dass nur Fahrzeuge mit einem bestimmten Alter, einer bestimmten Laufleistung und einer bestimmten Servicehistorie infrage kommen.

**Prüfungen zu Fahrzeugalter und Wartung**

Zunächst stehen Ihnen bis zu drei Kontrollkästchen zur Verfügung. Ob ein Kontrollkästchen angezeigt wird und ob es vorausgewählt ist, hängt von der Vorlage (Blueprint) ab. Ist das Feld dort als sichtbar definiert, erscheint es; ist es dort vorausgewählt, ist das Kontrollkästchen angehakt. Sie können den Wert jeweils ändern. Alle drei Angaben sind optional.

Mit dem Kontrollkästchen „Vehicle age less than <Wert> days“ stellen Sie sicher, dass das Produkt nur an Kunden verkauft wird, deren Fahrzeuge jünger als die angegebene Anzahl an Tagen sind (als Beispiel nennt die Vorlage 90 Tage). Der Wert steht in einem Eingabefeld, das aus der Vorlage vorbelegt ist und von Ihnen geändert werden kann.

Mit dem Kontrollkästchen „The vehicle has not been serviced yet“ legen Sie fest, dass das Produkt nur für Fahrzeuge verkauft wird, die ihren ersten Service noch nicht erreicht haben.

Das Kontrollkästchen „Vehicle maintained according to MB standards“ erscheint nur, wenn die Option zu Fahrzeugen, die ihren ersten Service erreicht haben, angehakt ist. Damit erzwingen Sie, dass das Produkt nur für Fahrzeuge verkauft wird, die nach den MB-Standards gewartet wurden.

**Limits für die drei Nutzertypen**

Für jeden der drei Nutzertypen müssen Sie ein Limit-Set auswählen. Die Reihenfolge lautet: Limits für MPC-Nutzer, Limits für Händler (Dealer) und Limits für Kunden (Customer). Alle drei Angaben sind Pflicht.

Ein neues Limit legen Sie an, indem Sie das Dropdown „Limit Preset“ öffnen und „+Create new limit“ wählen. In einem Pop-in-Fenster vergeben Sie einen Namen und definieren die Grenzwerte. Nach dem Anlegen und Schließen des Fensters wird das neue Limit automatisch für den Nutzertyp vorausgewählt, für den Sie es erstellt haben. Ein einmal benanntes und definiertes Limit können Sie für jeden der drei Nutzertypen und auch für künftige Produkte auswählen.

**Eingabefelder im Limit-Fenster**

Der Name des Presets (Platzhalter „Preset Name“) ist ein Pflichtfeld und muss zwischen 3 und 50 Zeichen lang sein. Sonderzeichen sind erlaubt. Bei einer unzulässigen Länge erscheint die Meldung „Min. 3 and max. 50 characters allowed. Please correct your input and try again“.

Für das Fahrzeugalter bei Vertragsbeginn geben Sie einen Mindest- und einen Höchstwert in Tagen ein (Platzhalter „Min (days)“ und „Max (days)“). Beide Felder sind Pflicht, erlauben ausschließlich Ziffern und eine Länge von 1 bis 3 Stellen. Andernfalls erscheint die Meldung „Min. 1 and max. 3 characters allowed. Please correct your input and try again“. Der Mindestwert darf nicht kleiner sein als die im vorherigen Schritt festgelegte minimale Gesamtlaufzeit in Monaten, der Höchstwert nicht größer als die dort festgelegte maximale Gesamtlaufzeit.

Für die Fahrzeuglaufleistung bei Vertragsbeginn geben Sie ebenfalls einen Mindest- und einen Höchstwert ein, hier in Kilometern (Platzhalter „Min (km)“ und „Max (km)“). Beide Felder sind Pflicht, erlauben ausschließlich Ziffern und eine Länge von 1 bis 7 Stellen. Andernfalls erscheint die Meldung „Min. 1 and max. 7 characters allowed. Please correct your input and try again“. Der Mindestwert darf nicht kleiner sein als die im vorherigen Schritt festgelegte minimale Gesamtlaufleistung, der Höchstwert nicht größer als die dort festgelegte maximale Gesamtlaufleistung.

**Aktionen in diesem Schritt**

Ein definiertes und ausgewähltes Limit-Set wird gespeichert, sodass Ihre Auswahl beim Wechsel zwischen den Schritten nicht verloren geht. Über das Stift-Symbol in der Limit-Liste können Sie ein Limit bearbeiten, wobei Name und alle Werte änderbar sind. Über das Papierkorb-Symbol können Sie ein Limit löschen. Bearbeiten und Löschen sind nur möglich, wenn das Limit bereits angelegt wurde und noch nicht verwendet wird.

Mit „Abbrechen“ werden keine Änderungen gespeichert, und Sie gelangen zurück zur Produktliste. Wurde seit der letzten Änderung mindestens ein Feld ausgefüllt oder geändert, erscheint zuvor ein Bestätigungsfenster. Wählen Sie „Ja“, wird der Assistent geschlossen, die Änderungen werden verworfen und Sie werden zur Produktübersicht weitergeleitet. Wählen Sie „Nein“, schließt sich das Fenster und Sie bleiben im Assistenten. Wurden keine Angaben gemacht oder keine Änderungen vorgenommen, wird der Assistent direkt geschlossen, und es werden keine Daten in der Produktübersicht gespeichert.

Mit „Als Entwurf speichern“ werden alle Änderungen auf dieser Seite sowie aus vorherigen oder folgenden Schritten gespeichert, und Sie gelangen zur Produktliste. Dafür muss mindestens der Produktname ausgefüllt sein. „Zurück“ führt Sie zum vorherigen Schritt und speichert die Änderungen dieser Seite. „Weiter“ führt Sie zum nächsten Schritt und speichert ebenfalls die Änderungen dieser Seite. Die Schaltfläche „Weiter“ wird aktiv, sobald alle Pflichtfelder ausgefüllt sind.

**Gestaltung**

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.