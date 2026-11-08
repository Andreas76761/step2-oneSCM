# Batch 2 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Mileage Projection**

Wenn für ein Fahrzeug keine aktuellen Kilometerstandsdaten aus MIC verfügbar sind, kann im Vertragsmanagement nun ein theoretischer Kilometerstand berechnet werden. Dadurch bleibt eine plausible Schätzung des Kilometerstands erhalten, ohne dass Vertragsvorgänge blockiert werden. Die Berechnung wird manuell ausgelöst: Auf Vertragsebene befindet sich neben der Schaltfläche zur Synchronisierung mit MIC, oberhalb der Tabelle „Vehicle Mileage", eine neue Schaltfläche für die Projektion. Nach dem Klick fragt der Vertrag beim Vehicle-Microservice die Berechnung an und übergibt alle dafür nötigen Daten. Vehicle Management berechnet die Projektion und liefert das Ergebnis als ganzzahligen Kilometerstand ohne Nachkommastellen zurück. Der Wert wird zusammen mit den übrigen Angaben (geändert von, Datum und Uhrzeit, Quelle) in der Tabelle „Vehicle Mileage History" gespeichert. Die Projektion löst kein Vertragsende aus und dient ausschließlich als Referenzwert.

Die Berechnung basiert auf dem zuletzt bekannten Kilometerstand aus der Historie. Existieren mehrere Einträge mit demselben Datum und ohne Zeitstempel, wird der höchste Kilometerstand verwendet. Zunächst werden die Tage vom Vertragsbeginn bis zum Datum des letzten Kilometerstands ermittelt. Daraus ergibt sich der theoretische Tageskilometerstand, indem der letzte bekannte Kilometerstand durch diese Tage geteilt wird. Anschließend werden die Tage vom Vertragsbeginn bis zum Datum der Projektionsanfrage bestimmt und mit dem theoretischen Tageswert multipliziert. Das Ergebnis wird auf die nächste ganze Zahl gerundet (40,98 wird zu 41). Der maximal zulässige Wert beträgt 9.999.999 (sieben Stellen).

Ein Beispiel: Der Vertrag beginnt am 1. April 2025 mit 0 km. Der letzte Kilometerstand von 12.500 km wurde am 31. Januar 2026 erfasst, die Projektion wird am 10. März 2026 angefragt. Zwischen Vertragsbeginn und letztem Eintrag liegen 305 Tage, der theoretische Tageswert beträgt 12.500 / 305 und damit gerundet 41 km pro Tag. Bis zum Anfragedatum sind es 343 Tage, die Projektion beträgt somit 343 × 41 = 14.063 km.

Liegt für das Fahrzeug keine Kilometerstandshistorie vor, wird keine Berechnung durchgeführt. Stattdessen erscheint die Meldung „Mileage Projection cannot be calculated because no historical mileage exists".

**Fahrzeuggruppen: Automatische Benennung beim Bearbeiten (Pkw und Vans)**

Beim Bearbeiten einer Fahrzeuggruppe unter Product Management > Manage Vehicle Groups erschien der Schalter „System-Generated Vehicle Group Name & Description" bislang in dem Zustand, in dem er bei der Erstellung gesetzt war, und ließ sich nicht umstellen. Dies wurde korrigiert: Der Schalter kann im Bearbeitungsablauf nun aktiviert oder deaktiviert werden, unabhängig davon, ob er bei der Erstellung der Gruppe an- oder ausgeschaltet war. Die Anpassung gilt sowohl für Passenger Cars als auch für Vans.

**Massenanlage von Fahrzeugen: Duplikatserkennung**

Bei der Massenanlage im Vehicle Management wurden FIN und VIN desselben Chassis bisher nicht als Duplikate markiert. Dieses Verhalten wurde behoben.