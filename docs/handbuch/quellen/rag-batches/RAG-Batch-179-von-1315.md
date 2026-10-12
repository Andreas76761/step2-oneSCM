# Batch 179 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Änderungen im Rechnungsexport und in der Rechnungserstellung**

**Export von MPay-Rechnungen an oneERP**

Der Export von Rechnungen, die mit MPay bezahlt wurden, wurde angepasst. Bisher wurde eine Rechnung auf „Bezahlt" gesetzt, sobald der MPay-Status „Capture" erreicht war und die Rechnung den Status „Exportiert" hatte. Im Export an oneERP fehlte dabei jegliche Information zur Operation-ID. Diese wird für Abstimmungs- und Buchhaltungszwecke benötigt.

MPay liefert bei der Erstellung einer Transaktion zwei Kennungen: die Transaction-ID, die die gesamte Transaktion einschließlich aller späteren Vorgänge wie Erstattungen oder Rückbuchungen eindeutig identifiziert, und die Operation-ID, die den jeweiligen einzelnen Vorgang (Capture, Cancel, Refund oder Chargeback) kennzeichnet. oneSCM speichert nun für jede Transaktion alle zugehörigen Operation-IDs, da je nach Situation eine andere Operation-ID benötigt wird. Eine Transaktion kann dabei mehrere Operation-IDs besitzen, die alle gespeichert werden.

**Neuer Ablauf der Rechnungsstatus-Aktualisierung**

Das FI-System ist das führende System für die Rechnungsstellung. oneSCM ändert den Rechnungsstatus daher nicht mehr auf Basis des MPay-Status. Der Status wird ausschließlich über den üblichen Rückmeldeprozess des FI-Systems aktualisiert, also über die E169-Feedback-Datei und die Schnittstelle BP36 (zum Beispiel „FI-Dokument erstellt", „Bezahlt" bis hin zur Mahnstufe).

Beim Lauf des CFDM-Batchjobs werden alle berechtigten Rechnungen, deren Rechnungszeitraum „von" heute oder früher liegt, auf den Status „Accepted" gesetzt. Ist MPay im jeweiligen Markt aktiviert, wird anschließend eine MPay-Transaktion erstellt. Ist MPay im Markt nicht aktiviert, entfällt die Erstellung der Transaktion.

Der Export an das FI-System (oneERP, SWT oder CoFiCo) berücksichtigt nur Rechnungen mit dem Status „Accepted". Ist MPay im Markt aktiviert, muss zusätzlich der MPay-Status „Captured" vorliegen. Ist MPay nicht aktiviert, wird der MPay-Status ignoriert.

**Erweiterung der E169-Exportdatei**

Der Header der E169-Datei enthält am Ende ein neues Feld „UUID - Payment Transaction" mit 36 Zeichen. Es wird nur bei Rechnungen mit MPay befüllt und enthält die Operation-ID passend zum MPay-Status: bei Capture die Operation-ID des Capture, bei Cancel die des Cancel, bei Refund die des Refund und bei Chargeback die des Chargeback. Wird keine Operation-ID übermittelt, etwa bei Rechnungen ohne MPay, wird das Feld mit 36 Leerzeichen befüllt. Auch die Abläufe für Refund und Chargeback wurden in diesem Zusammenhang überarbeitet.

**Anpassungen bei Affiliate und Non-Affiliate**

Die Kennzeichnung als Affiliate oder Non-Affiliate wird nun aus dem Dealer Management bezogen. Dies betrifft die Rechnungen der Schnittstelle i156, die oneERP-Exporte E174, E169 und E167 sowie die Erstellung von Händlerrabatt-Rechnungen und Werkstattrechnungen. Diese Anpassungen sind im Einsatz.

**Betriebsstättennummer in der E169-Datei**

Die Betriebsstättennummer des Rechnungsstellers bzw. der Werkstatt in der E169-Datei wurde aktualisiert. Für internationale Werkstattrechnungen der Divisionen PC und Van ist dies abgeschlossen. Für Händlerprovisionen der Produkte Compact PC, Compact Van, Complete PC und Complete Van befindet sich die Änderung in der Prüfung. Voraussetzung ist jeweils ein aktiver Vertrag zu einem Produkt, für das eine Händlerprovision durch einen externen Händler anfällt.