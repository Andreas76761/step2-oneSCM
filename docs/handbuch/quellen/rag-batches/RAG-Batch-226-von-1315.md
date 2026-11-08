# Batch 226 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Neuerungen und Änderungen**

**Zahlungsintervalle: jährlich, halbjährlich und vierteljährlich**

Bisher standen für das Zahlungsintervall eines Vertrags nur die Optionen „Einmalig“ und „Monatlich“ zur Verfügung. Künftig können Kundinnen und Kunden einen Vertrag auch jährlich, halbjährlich oder vierteljährlich bezahlen. Wählt der Kunde eines dieser Intervalle, bildet der Zahlungsplan die gewählte Option ab, und die Rechnungen werden entsprechend erzeugt. Preis und Zahlungsintervall werden vom Vertragsteam (Brabus-Team) geliefert.

Die Rechnungen werden ab dem Vertragsbeginn (FRD) erzeugt. Bei jährlicher Zahlung umfasst eine Rechnung 12 Monate, wobei der Rechnungszeitraum am FRD beginnt und einen Tag vor dem Jahrestag endet (FRD + 1 Jahr − 1 Tag). Bei halbjährlicher Zahlung umfasst eine Rechnung 6 Monate (FRD + 6 Monate − 1 Tag), bei vierteljährlicher Zahlung 3 Monate (FRD + 3 Monate − 1 Tag).

Bei der Erzeugung des Zahlungsplans gilt: Entspricht das Aktivierungsdatum dem FRD, wird der Zahlungsplan nicht neu verteilt. Liegt das Aktivierungsdatum nach dem FRD und ist das Jahr, Halbjahr oder Quartal bereits verstrichen, wird der Preis auf den verbleibenden Zeitraum neu verteilt, und die Rechnungen werden nach den Regeln dieser Neuverteilung erzeugt.

Die Änderungen wirken sich auf die Vertragserstellung (Anzeige der Optionen im Dropdown und des Preises), die Vertragskalkulation, die Erzeugung des Zahlungsplans sowie die Bearbeitung des Zahlungsintervalls aus. Für die Kalkulation gilt: jährlich = 12 × Monatsrate, halbjährlich = 6 × Monatsrate, vierteljährlich = 3 × Monatsrate.

**Zahlungsintervall bearbeiten**

Das Zahlungsintervall lässt sich bearbeiten, wenn es auf Monatlich, Vierteljährlich, Halbjährlich oder Jährlich steht. Es kann von diesen Werten ausschließlich auf „Einmalig“ geändert werden. Der Zahlungsplan wird dabei nach der bereits umgesetzten Regel für den Wechsel von „Monatlich“ auf „Einmalig“ angepasst. Dabei werden zwei Fälle unterschieden.

Wurde noch keine Rechnung des Zahlungsplans an das FI-System gesendet, befinden sich alle Rechnungsanforderungen des Plans im Status „Planned“, „Created“ oder „Accepted“ (manuell erstellte Rechnungen ausgenommen). Die Änderung des Zahlungsintervalls erzeugt dann automatisch einen neuen Zahlungsplan mit nur einer Rechnung im Status „Planned“.

Wurde dagegen mindestens eine Rechnung an das FI-System gesendet, befindet sich mindestens eine Rechnungsanforderung im Status „Exported“, „Paid“ oder in einem späteren Status. In diesem Fall werden alle Rechnungen im Status „Planned“ (manuell erstellte ausgenommen) für den Versand an das FI-System berücksichtigt. Die Einträge des Zahlungsplans bleiben unverändert. Der nächste Lauf des Batch-Jobs zur monatlichen Rechnungserstellung übernimmt alle berücksichtigten Rechnungen im Status „Planned“, da das Zahlungsintervall nun „Einmalig“ lautet.

**Import der NACOS-Rückmeldedatei (E169)**

Der Import der Rückmeldedatei von NACOS wurde angepasst. Bisher wurde der Status anhand der Nummer in der Datei gesetzt: 8888888888 bedeutete Fehler, 9999999999 bedeutete Storniert, und jede andere Nummer führte zum Status „Fi Document Created“.

NACOS sendet die Rückmeldedatei nun täglich. Sie enthält die Rechnungen der letzten sieben Tage, wobei für einen Teil davon die Rückmeldung bereits in oneSCM verarbeitet wurde. Da die Freigabe der Anforderung bei NACOS manuell erfolgt, erscheinen noch nicht freigegebene Rechnungen in der Datei mit der Nummer 8888888888. Für Import und Statusaktualisierung gilt nun:

Hat eine Rechnung den Status „Exported“ und enthält die Datei für die Rechnungsnummer des FI-Systems die Nummer 8888…, wartet die Position noch auf die Fakturierung. Der Status wird nicht geändert, die Rechnung bleibt im Status „Exported“. Enthält die Datei für eine Rechnung im Status „Exported“ eine FI-Belegnummer, wechselt der Status auf „Fi Document Created“. Hat eine Rechnung den Status „Fi Document Created“ und enthält die Datei die Rückmeldung 9999…, wird die Rechnung auf den Status „Storniert“ gesetzt.