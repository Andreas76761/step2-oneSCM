# Batch 235 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

Die Historie zu Rechnungen wird künftig direkt im jeweiligen Rechnungsdatensatz angezeigt. Die bisherige Option „see History“ in der Spalte „Actions“ entfällt. Das gilt für Rechnungen im Admin-Bereich (alle Rechnungstypen) sowie für die Reiter Customer Invoice, Price Reduction, Dealer Commissions und Workshop Invoice. Jeder Historieneintrag enthält das Änderungsdatum, den Bearbeiter, den alten Wert, den neuen Wert und den Grund der Änderung. Der Rechnungsstatus führt dabei nicht mehr zur History-Tabelle.

Bei der Darstellung von Netto- und Bruttobeträgen wird die Umsatzsteuer nun abhängig vom Rechnungstyp berechnet und in der Oberfläche angezeigt. Grundlage ist die Steuerklassifizierung des Kunden, die bei der Erstellung gewählt wurde. Rechnungen ohne Umsatzsteuer zeigen als Steuerwert „0“ und die Steuerklassifizierung „Exempt“. Bei Kundenrechnungen wird die Umsatzsteuer für die Typen MPPI, MANU, BDCR und FDCR berechnet und angezeigt. Bei Werkstattrechnungen gilt: Aus i156 importierte Werkstattrechnungen (CLAI) und über i156 empfangene internationale Rechnungen (WSIN) sowie manuell erstellte internationale Rechnungen werden ohne Umsatzsteuer, also nur netto, geführt. Bei manuell erstellten Werkstattrechnungen hängt die Steuer vom Werkstatttyp ab: Interne Werkstätten sind steuerbefreit (Betrag 0 EUR), externe Werkstätten unterliegen der Standard-Umsatzsteuer. Bei Preisminderungen benötigt der Typ DD für externe Empfänger Umsatzsteuer, für interne nicht; CAMP und SDAS werden ohne Umsatzsteuer geführt. Bei Händlerprovisionen (SCOM) fällt für externe Empfänger Umsatzsteuer an, für interne nicht.

Bei Ablauf eines Vertrags wird der Zahlungsplan korrigiert, und zwar bei Ablauf nach Zeit, nach Laufleistung und nach Kontingent. In allen drei Fällen wird die Rechnungsstellung bis zur letzten Rechnung des Zahlungsplans fortgeführt, ohne dass eine Rechnung übersprungen wird. Alle diese Rechnungen werden zur Fakturierung an den Kunden an NACOS übermittelt. Bei Ablauf nach Laufleistung kann dies vor dem Ende der regulären Vertragslaufzeit eintreten. Beim Ablauf nach Kontingent sind die Kontingente des Vertrags aufgebraucht, bevor alle Zahlungen erfolgt sind; die Rechnungsstellung wird dann bis zum Ablauf nach Zeit und bis zur Erstellung der letzten Rechnung des Zahlungsplans abgeschlossen.

In den Markteinstellungen werden die Status „Planned“, „Created“ und „Accepted“ aus der Auswahlliste entfernt.

Darüber hinaus wurden Fehler in der Anwendung revenue-management-app auf der Vorproduktionsumgebung behoben, und die Zuordnung (Mapping) von Rechnungen wurde für den Fall geprüft, dass der Status ACCEPTED ist und die oneSCM-Rechnungsnummer leer ist.

Die geplante Fakturierung von Produktoptionen eines Vertrags mit Export an Nacos wurde nicht umgesetzt; das entsprechende Vorhaben wurde abgebrochen und ist daher nicht Teil dieses Release.