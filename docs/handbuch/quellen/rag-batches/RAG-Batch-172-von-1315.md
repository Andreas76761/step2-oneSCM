# Batch 172 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 29 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Änderungen und Prüfungen**

Im Bereich Revenue Management wurde die Erstellung manueller Werkstattrechnungen nach Vertragsabschluss geprüft. Betrachtet werden geschlossene Verträge der Bereiche PC und Vans. Dabei wird unterschieden, ob das aktuelle Datum innerhalb oder außerhalb des Zeitraums für die Werkstattrechnungserstellung liegt. Für PC werden beide Fälle abgedeckt, für Vans der Fall innerhalb dieses Zeitraums.

Ein weiterer Schwerpunkt ist der Export von Altteilsteuer (Old Part Tax) und MOT an oneERP über die Schnittstelle E167. Geprüft wird der Export für Werkstattrechnungen und für Werkstattrechnungen in Form von Gutschriften. Berücksichtigt werden jeweils die Varianten ohne Altteilsteuer und MOT, mit Altteilsteuer, mit MOT sowie mit MOT und Altteilsteuer. Voraussetzung ist in allen Fällen ein aktiver Vertrag.

Zusätzlich wird das Verhalten in Abhängigkeit vom Rechnungsstatus bei Verträgen mit Händlerprovision oder Händlerrabatt getestet. Für Verträge mit Händlerprovision sind die Status „Dunning Level 1", „Paid", „FI Document Created", „Accepted" und „Exported" abgedeckt. Für Verträge mit Händlerrabatt wird der Status „Planned" geprüft. Der jeweilige Vertrag mit dem entsprechenden Status muss dafür vorhanden sein.

Für die Anbindung an Nemesis wurden die Zuordnungsregeln überarbeitet. Der Zahlungstyp (PaymentType) wurde um neue Werte für jährliche, halbjährliche und vierteljährliche Zahlung erweitert. Neu hinzugekommen ist das Feld „AmountPerCycle", das den Rechnungsbetrag pro Zyklus angibt, je nachdem, ob monatlich, vierteljährlich oder halbjährlich abgerechnet wird. Das Feld „AmountMonthlyPrice" gibt das monatliche Äquivalent des Gesamtvertragspreises an, um es an andere Vertragsmanagementsysteme anzugleichen. Zudem befinden sich Prüfungen in Review, ob ein Nemesis-Ereignis erzeugt wird, wenn Nemesis in der Marktkonfiguration aktiviert ist, und ob keines erzeugt wird, wenn Nemesis dort nicht aktiviert ist.

Auf Architekturebene stellt Explorers eine neue API bereit, mit der andere Services über Änderungen an Kundendaten informiert werden. Revenue verbindet sich mit dem neuen Kundenereignis, das meldet, wenn sich Name oder SAP-Debitorennummer geändert haben, und übernimmt diese Änderungen.

Mehrere Fehlerbehebungen wurden abgeschlossen. Der Job MBLD_OneERPInvE169EXP funktionierte nicht für andere Rechnungen als MPPI und MANU. Auch ein Fehlschlag des E169-Jobs auf der Entwicklungsumgebung wurde behoben. Die Sortierung in den Vertragsdetails im Reiter „Payment" funktionierte in der Kundenrechnungs- und der Werkstattrechnungstabelle nicht korrekt. Außerdem wurde die fehlerhafte Länge der Position in E174 korrigiert.

Derzeit in Prüfung befindet sich zudem der Test der Wiederholung einer Transaktion über MPay (Retry Transaction). Dafür wird ein Vertrag mit einmaliger Zahlung für einen Kunden mit der Zahlungsart Kreditkarte angelegt und aktiviert.