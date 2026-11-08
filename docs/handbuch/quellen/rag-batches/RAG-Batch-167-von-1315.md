# Batch 167 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 17 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

Die Aktualisierung des Rechnungsstatus über die Feedback-API von oneERP (E169, BP36) wurde für Kundenrechnungen der Typen MANU und MPPI geprüft. Voraussetzung ist jeweils, dass die Kundenrechnung im Status „FI Doc Created“ vorliegt. Die Prüfung deckt verschiedene Kombinationen aus Mahnstufe und Ausgleichsdatum (Clearing Date) ab.

Bei Mahnstufe 0 werden vier Fälle unterschieden: Das Ausgleichsdatum ist nicht gesetzt, es liegt vor dem Nettofälligkeitsdatum, es entspricht dem Nettofälligkeitsdatum, oder es liegt nach dem Nettofälligkeitsdatum. Für die Mahnstufen 1 bis 5 wird jeweils der Fall geprüft, dass das Ausgleichsdatum nicht gesetzt ist. Zusätzlich wird für Mahnstufe 1 der Fall geprüft, dass das Ausgleichsdatum gesetzt ist.

Außerdem wurden die internen Kommentare überarbeitet. Das Symbol wurde aktualisiert, und der Kommentarbereich wurde auf eine Breite von 66,66 % vergrößert. Darüber hinaus wird die Anzeigereihenfolge der internen Kommentare sowie das Scroll-Verhalten für verschiedene Rechnungsarten geprüft. Dazu gehören internationale Werkstattrechnungen, Erstattungen (Reimbursement), SIVECO-Rechnungen, Händlerprovisionsrechnungen (Dealer Commission), Händlerrabattrechnungen (Dealer Discount, DD) sowie manuelle Werkstattrechnungen (MANU). Voraussetzung ist jeweils, dass ein Vertrag mit einer Rechnung der entsprechenden Art vorhanden ist.