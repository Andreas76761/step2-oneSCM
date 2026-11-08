# Batch 665 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsrolle in der Kundenvorschau**

In der Kundenverwaltung (Customer & Partner Management) wird nun die Rolle eines Kunden innerhalb eines Vertrags angezeigt. Sie finden diese Information, wenn Sie sich die Kundendaten in der Vorschau ansehen. Gehen Sie dazu in der Kundenverwaltung zur Ergebnistabelle, öffnen Sie dort die Vorschau eines Kunden und wechseln Sie in den Bereich „Letzte Servicerverträge“ (Latest service contracts).

Ein Kunde kann innerhalb eines Vertrags unterschiedliche Rollen einnehmen. Diese hängen davon ab, ob für seinen Servicevertrag bzw. seine Serviceverträge ein abweichender Zahler festgelegt wurde. Es gibt drei mögliche Werte: „Holder and Payer“ bedeutet, dass der Kunde seinen eigenen Servicevertrag selbst bezahlt. „Holder“ bedeutet, dass der Kunde Vertragsinhaber ist, den Vertrag aber nicht selbst bezahlt. „Payer“ bedeutet, dass der Kunde den Servicevertrag eines anderen Kunden bezahlt.

**Bestimmung der Rolle**

Die Rolle des Kunden wird bei der Vertragserstellung festgelegt. Hat der Kunde keinen abweichenden Zahler, erhält er die Rolle „Holder and Payer“. Diese Information wird gemeinsam mit den übrigen Vertragsdetails, die im Vorschaubereich angezeigt werden, an die Kundenverwaltung übermittelt.

Gibt es einen abweichenden Zahler, wird der Kunde als Vertragsinhaber zum „Holder“, und der zahlende Kunde erhält die Rolle „Payer“. In beiden Fällen hat der Vertrag den Status „Confirmed“, und die Informationen werden zusammen mit den weiteren Vertragsdetails an die Kundenverwaltung gesendet. Wechselt ein Vertrag vom Status „Waiting for activation“ auf „Active“, erhält die Kundenverwaltung entsprechende Statusaktualisierungen.

**Anfrage an NACOS**

Die Kundenverwaltung sendet eine Anfrage an NACOS, wenn es sich um einen neuen Kunden oder um einen Kunden ohne SAP-Debitorennummer und SEPA-Mandats-ID handelt. Dies geschieht ausschließlich bei Kunden mit der Vertragsrolle „Holder and Payer“ oder „Payer“.

**Weitere Hinweise zur Kundenverwaltung**

Bei der Pflege der Kundendaten in der Vorschau ist eine Aktualisierung nicht möglich, wenn ein Feld leer ist oder ungültige Daten eingegeben wurden. In der Suche und Filterung der Kundenverwaltung können Sie eine einfache Suche nach Name, E-Mail, Telefonnummer, Lastschrift (Direct Debit) und Postleitzahl durchführen; für jedes dieser Felder wird ein Ergebnis angezeigt. Existiert ein gesuchter Kunde nicht, erscheint die Meldung „No Customer found“.