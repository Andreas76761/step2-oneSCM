# Batch 217 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Änderungen**

**Online-Verkauf mit MPay (Einmalvertrag)**

Diese Funktion befindet sich noch in Planung (Status: offen). Vorgesehen ist, dass Nutzer in einem Online-Shop einen Servicevertrag erwerben und als Zahlungsart die Kreditkarte mit einer einzigen Transaktion wählen können. Als Zahlungsdienstleister dient MPay, der interne Zahlungsanbieter von Mercedes-Benz. Als erster Markt ist Indien vorgesehen.

Im Rahmen des MVP erzeugt der Online-Shop den Zahlungslink. oneSCM soll den Status der Transaktion erhalten und, sofern die Zahlung erfolgreich war, die erste Rechnung auf den Status „PAID“ setzen. Bei einem Einmalvertrag wird der Vertrag bereits als „PAID“ übermittelt. In diesem Fall wird lediglich eine Rechnung mit der Merchant Reference für die Abrechnung (Settlement) angelegt. Bei monatlicher Zahlung müssen zusätzlich die ASSET-ID und die NTR übermittelt werden; die erste Zahlung ist dabei bereits als „PAID“ gekennzeichnet. Die regulären Prozesse zum Ablauf von Kreditkarten sollen auch in diesem Szenario funktionieren. Außerdem müssen noch Kontext und Abhängigkeiten der API-Verbindung zwischen Online-Shop und oneSCM sowie die Anforderungen an ASSET-ID und NTR ergänzt werden.

**Unterscheidung des Händlerrechnungstyps beim Export (SWT/CoFiCo)**

Bisher wurde für Händlerrabattrechnungen unabhängig vom erstellenden Händler stets der Rechnungstyp „DD“ verwendet. Mit der Umsetzung werden die Rechnungstypen vereinheitlicht, damit keine verwirrenden Mehrfachtypen im System entstehen.

Bei der Erstellung von Händlerrabattrechnungen lautet der Rechnungstyp sowohl für externe als auch für interne Händlerrabatte „Dealer Discount (DD)“. Das gilt ebenso für manuell angelegte Händlerrabatte.

Beim Export an die Finanzsysteme SWT und CoFiCo richtet sich der Rechnungstyp in der Exportdatei danach, ob der Händler zugehörig (affiliated) oder nicht zugehörig ist. Für zugehörige Händler wird „IDD“ übermittelt, für nicht zugehörige Händler „EDD“. Dies gilt auch für manuell erstellte Händlerrabattrechnungen.

Zur Überprüfung wird ein Vertrag als externer Händler mit Händlerrabatt erstellt und aktiviert. Als MO lässt sich anschließend unter Vertrag, Zahlung, Preisreduktion prüfen, dass der Rechnungstyp „DD“ lautet. Wird als Admin auf der Batch-Job-Seite der Export-Batch-Job gestartet, sollte in der Exportdatei „EDD“ erscheinen. Für einen internen Händler läuft der Ablauf identisch, in der Exportdatei wird dann „IDD“ erwartet. Diese Änderung ist abgeschlossen (Status: fertig).

**Sales Campaigns (E174): Logik auf Basis der Division**

Für den Export der Sales-Kampagnen (E174) wurden Anpassungen definiert (Status: geschlossen). Die Werte hängen vom Buchungsschlüssel (Posting Key 40 bzw. 50) und davon ab, ob der Vertrag einen Pkw (PC) oder einen Van betrifft.

Bei der Business Division gilt für Buchungsschlüssel 40: Pkw = 269C, Van = 269V. Für Buchungsschlüssel 50: Pkw = 268C, Van = 268V.

Beim Revenue Area gilt für Buchungsschlüssel 40: Pkw = 269010, Van = 269060. Für Buchungsschlüssel 50 wird der Wert anhand des Produkttyps aus einer hinterlegten Tabelle abgeleitet.

Bei der SD-Standard Division gilt für Buchungsschlüssel 40: Pkw = 01, Van = 03. Für Buchungsschlüssel 50: Pkw = 06, Van = 36.

Das Profit Center wird bei Buchungsschlüssel 40 aus dem Kampagnen-Setup übernommen. Bei Buchungsschlüssel 50 wird es anhand von Produkttyp und Division aus einer Tabelle ermittelt.

Die Provision Component wird bei Buchungsschlüssel 40 ebenfalls aus dem Kampagnen-Setup übernommen und bleibt bei Buchungsschlüssel 50 leer.

Für After-Sales-Kampagnen wird die Provision Component sowohl bei Buchungsschlüssel 40 als auch bei 50 mit dem Wert „/“ gefolgt von Leerzeichen befüllt.