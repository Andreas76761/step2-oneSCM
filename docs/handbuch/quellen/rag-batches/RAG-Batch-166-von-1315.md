# Batch 166 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Händlerwechsel: Rechnungen werden automatisch angepasst**

Der Vertragshändler (Contracting Dealer) kann ab sofort ausschließlich direkt im Vertrag geändert werden. Dazu bearbeitet die Market Operation (MO) im Reiter „Contract" das Feld „Salesperson / Contracting Dealer". Die Änderung ist nur während der Kulanzfrist (Grace Period) möglich. Ein Händlerwechsel lässt sich nicht an anderer Stelle anstoßen.

Sobald der Vertragshändler geändert wird, sendet das Contract Management ein Ereignis (Event) an das Revenue and Cost Management. Dort werden die zugehörigen Händlerrabatt- und Händlerprovisionsrechnungen automatisch angepasst. Diese Rechnungen sind immer dem aktuellen Vertragshändler zugeordnet. Bisher konnten sie einzeln korrigiert werden, was zu Problemen im Vertrag führen konnte. Änderungen an diesen Rechnungen sind nur noch innerhalb der Kulanzfrist zulässig.

Was bei einem Händlerwechsel geschieht, hängt vom Status der jeweiligen Rechnung ab. Befindet sich die Händlerrabatt- oder Händlerprovisionsrechnung im Status „Planned", „Accepted" oder „Created", wird sie automatisch storniert. Anschließend wird für den neuen Händler mit denselben Beträgen ein neuer Beleg im Status „Created" angelegt. Bei einem Händlerrabatt ist dies eine Rechnung, bei einer Händlerprovision eine Gutschrift. In der Historie wird der Änderungsgrund festgehalten.

Befindet sich die Rechnung bereits im Status „Exported", „FI Document Created", „Paid" oder in einer Mahnstufe (Dunning Level 1 bis 5), wird sie nicht storniert. Stattdessen erzeugt das System automatisch einen Gegenbeleg (Reverse Document) zur betroffenen Rechnung. Zusätzlich wird für den neuen Händler mit denselben Beträgen ein neuer Beleg im Status „Created" erstellt. Bei einem Händlerrabatt ist dies eine Gutschrift, bei einer Händlerprovision eine Rechnung. Auch hier wird der Änderungsgrund in der Historie vermerkt, jeweils mit Verweis auf die oneSCM-Rechnungsnummer der korrigierten Rechnung.

Aufbau und Typ des Ereignisses, das zwischen Contract Management und Revenue and Cost Management ausgetauscht wird, werden vom Entwicklungsteam festgelegt und verwaltet.