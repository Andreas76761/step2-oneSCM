# Batch 1176 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeuggruppen: Filter „Max Total Weight“ im Schritt „Modellcodes zuweisen“**

Im Bereich Product Management Vans unter „Fahrzeuggruppen verwalten“ wurde der Schritt „Modellcodes zuweisen“ überarbeitet. Der Filter, der bisher die Bezeichnung „Tonnage“ trug, heißt nun „Max Total Weight“. Damit soll sein Zweck für die Anwender klarer erkennbar sein. Außerdem zeigt der Filter nicht mehr die bisherigen Kennbuchstaben (A, B, C usw.) an, die aus CePro stammten. Stattdessen werden die genauen Werte des maximalen Gesamtgewichts angezeigt, zum Beispiel 3.000 kg oder 3.500 kg.

Das maximale Gesamtgewicht wird aus dem Baumaster des Modells abgeleitet. Maßgeblich ist die fünfte Stelle der Baumaster-Nummer. Lautet sie 2, beträgt das maximale Gesamtgewicht 3.000 kg. Bei 3 sind es 3.500 kg, bei 4 sind es 4.100 kg und bei 5 sind es 5.000 kg. Diese Ableitung gilt ausschließlich für die Baureihen 907 und 910. Für alle anderen Baureihen wird als maximales Gesamtgewicht „NA“ angezeigt. Die Spalten der Ergebnistabelle und der Filterauswahl sind in einer fest vorgegebenen Reihenfolge angeordnet.

**Getrennte Berechnung des Preises pro Kilometer bei Mehr- und Minderkilometern**

Wenn ein Servicevertrag sein Ende erreicht, wird geprüft, ob das Fahrzeug mehr oder weniger als die vertraglich vereinbarte maximale Laufleistung genutzt hat. Bei Mehrkilometern wird dem Kunden ein berechneter Betrag in Rechnung gestellt. Bei Minderkilometern erhält er eine berechnete Gutschrift, die bei einem späteren Kauf oder einer Vertragsverlängerung eingelöst werden kann. Betrag und Gutschrift hängen von mehreren Parametern ab, unter anderem von der Mehrkilometer-Toleranz, dem im Kundenprofil festgelegten Höchstbetrag, dem Gutschriftswert und dem Preis pro Kilometer.

Bisher wurde der Preis pro Kilometer für beide Fälle nach derselben Formel berechnet, nämlich Nettopreis geteilt durch Laufleistung. Das war ungenau, weil sich die Preisbestandteile bei Mehr- und Minderkilometern unterschiedlich zusammensetzen. Deshalb gibt es nun zwei getrennte Berechnungsmethoden. Stream 1 stellt den Preis pro Kilometer auf Anfrage von Stream 2 bereit.

Bei Mehrkilometern ergibt sich der Preis pro Kilometer aus der Summe von Gesamtgrundpreis, Optionspreis, technischen Optionen, Branchenfaktor und Aufschlag für feste Preisinflation, geteilt durch die gesamte Vertragslaufleistung. Verkaufsprovision, Zahlungsaufschlag, Verwaltungsgebühr, Kampagnenrabatt und Händlerrabatt fließen nicht in die Berechnung ein.

Bei Minderkilometern werden dieselben Preisbestandteile summiert. Davon werden zusätzlich Kampagnenrabatt und Händlerrabatt abgezogen, und das Ergebnis wird durch die gesamte Vertragslaufleistung geteilt. Verkaufsprovision, Zahlungsaufschlag und Verwaltungsgebühr bleiben auch hier unberücksichtigt.

**Anlage von Verträgen mit Fahrzeugidentnummer oder Auftragsnummer**

Es war zuvor nicht möglich, einen Vertrag mit einer Fahrzeugidentnummer (VIN) oder einer Auftragsnummer anzulegen. Dieses Problem wurde behoben.

**Hinweis zu einer geplanten Funktion**

Die Zuordnung des P.En-Codes zu einer Kampagne im Rahmen der VdZ-Integration befindet sich noch in der Abstimmung. Zu Umfang und Verhalten liegen derzeit keine Angaben vor, daher kann diese Funktion hier noch nicht beschrieben werden.