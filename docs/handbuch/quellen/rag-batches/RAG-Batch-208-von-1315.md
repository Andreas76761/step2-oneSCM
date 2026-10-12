# Batch 208 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Rechnungsstatus-Rückmeldung aus oneERP (Invoice Feedback API)**

Bisher erhält oneSCM von oneERP keine eigenständige fachliche Rückmeldung zum Status von Rechnungen. Nachdem die FI-Belegnummer übermittelt wurde, kommen keine weiteren Informationen mehr zurück. Mit der neuen Schnittstelle wird eine Verbindung geschaffen, über die oneSCM den Status der Rechnungspositionen aus oneERP abrufen kann. Das ist besonders im Servicevertragsgeschäft wichtig: Dort gibt es je nach Marktgröße viele unterschiedliche Verträge, deren Zahlungsverhalten sich nicht immer leicht überblicken lässt. Das Vertragsmanagementsystem muss daher zeitnah erfahren, wenn ein Vertragskunde mit Zahlungen im Rückstand ist. Nur so können Verträge in Abstimmung mit VEGA, dem Werkstattsystem für die Abwicklung der Leistungen, vorübergehend oder dauerhaft gesperrt werden. Ein Kunde mit mehreren offenen Zahlungen soll keine Leistungen aus dem Vertrag erhalten, ohne dafür angemessen zu zahlen. Bislang werden die Mahnstufen in einem manuellen Abgleich gemeldet und von Hand in oneSCM gepflegt. Das ist bei wenigen Verträgen machbar, bedeutet aber bei täglich wachsender Vertragszahl einen steigenden Aufwand für die Kolleginnen und Kollegen im Fachbereich in Berlin. Die Schnittstelle ersetzt diesen manuellen Ablauf durch einen automatisierten Prozess.

**Funktionsweise der Schnittstelle**

Die Schnittstelle basiert auf Kafka. oneERP sendet Statusänderungen über Kafka-Topics, und zwar als einzelne Ereignisse pro erzeugtem FI-Beleg bzw. pro in oneSCM angelegter Rechnung. oneSCM nimmt nur Ereignisse entgegen, die für oneSCM relevant sind, stellt sie in eine Warteschlange und arbeitet sie nacheinander in seinem eigenen Tempo ab. Die Häufigkeit des Abrufs ist konfigurierbar. Sofern technisch nichts dagegenspricht, ist ein täglicher Import der Rückmeldungen sinnvoll. Wird eine Rechnung in oneERP aktualisiert, wird ein Ereignis gesendet, das oneSCM liest und verarbeitet, um anhand definierter Regeln den Rechnungsstatus zu aktualisieren. Ereignisse ohne Inhalt können vorkommen. Sie enthalten keine relevante Änderung und werden ignoriert bzw. übersprungen.

Der Inhalt eines Ereignisses umfasst die Felder Controller, Company Code, Fiscal Year und Document Number. Die Kombination aus diesen Angaben, insbesondere die Belegnummer als FI-Rechnungsnummer, dient dazu, die zu aktualisierende Rechnung zu identifizieren. Hinzu kommen das Nettofälligkeitsdatum (Net Due Date), das Ausgleichsdatum (Clearing Date), an dem die Rechnung bezahlt wurde, sowie die Mahnstufe (Dunning Level). Ist eine Rechnung nicht bezahlt, steigt die Mahnstufe nach einer marktspezifisch festgelegten Frist, etwa einem Monat. Für den deutschen Markt wird der Vertrag bei Mahnstufe 3 gesperrt.

**Regeln zur Statusaktualisierung**

Abhängig von den Angaben im Ereignis ergeben sich vier Konstellationen:

Ist ein Nettofälligkeitsdatum gesetzt, aber weder ein Ausgleichsdatum noch eine Mahnstufe (Mahnstufe 0), hat das Ereignis keine Auswirkung auf den Rechnungsstatus in oneSCM.

Sind Nettofälligkeitsdatum und Ausgleichsdatum gesetzt und die Mahnstufe ist 0, wird der Status anhand der beiden Daten bestimmt. Liegt das Ausgleichsdatum auf oder vor dem Nettofälligkeitsdatum, erhält die Rechnung den Status „Paid on time“. Liegt es danach, lautet der Status „Paid Overdue“.

Ist ein Nettofälligkeitsdatum gesetzt, aber kein Ausgleichsdatum, und die Mahnstufe liegt zwischen 1 und 5, ist die Rechnung noch unbezahlt und befindet sich in der Mahnung. Der Status entspricht dann der Mahnstufe, also „Dunning level 1“ bis „Dunning level 5“.

Sind Nettofälligkeitsdatum und Ausgleichsdatum gesetzt und die Mahnstufe liegt zwischen 1 und 5, handelt es sich um eine gemahnte Rechnung, die vom Kunden inzwischen bezahlt wurde. In diesem Fall wird der Status auf „Paid Overdue“ gesetzt.

Zusätzlich ist vorgesehen, das Kafka-Ereignis im Hinblick auf Verträge zu prüfen: Befindet sich eine Rechnung in Mahnstufe 3, 4 oder 5, soll der Vertrag gesperrt werden.

**Abnahmekriterien**

oneSCM kann Kafka-Ereignisse von oneERP über die Schnittstelle empfangen, lesen und verarbeiten. Ist das Nettofälligkeitsdatum gesetzt, das Ausgleichsdatum aber nicht, bleibt der Rechnungsstatus unverändert. Sind Nettofälligkeitsdatum und Ausgleichsdatum gesetzt, wird der Status nach der beschriebenen Regel aktualisiert. Ist das Ausgleichsdatum gesetzt und die Mahnstufe größer als 0, wird der Status ebenfalls nach der Regel aktualisiert.

**Weitere Änderungen im Bereich Revenue Management**

Die Beschriftungen der Zwischensummen im Zahlungsplan wurden in der deutschen Oberfläche und im zugehörigen Backend übersetzt. Außerdem wurden falsche Texte auf dem Bildschirm für Schadencodes korrigiert.

Die Seiten zum Anlegen und Bearbeiten von Kundenrechnungen wurden zu einer einzigen Komponente zusammengeführt, wobei alle Funktionen unverändert erhalten bleiben. Dies betrifft das Erstellen und Bearbeiten von Rechnungen der Typen MANU und MDD. Darüber hinaus wurde eine Anpassung der Benutzeroberfläche auf Grundlage eines Change Requests umgesetzt.