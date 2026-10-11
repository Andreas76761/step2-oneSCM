# Batch 170 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 9 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Neuerungen und Korrekturen**

**Zahlungsreferenz und externe Vertrags-ID für VAN-Verträge**
Großkunden mit Fuhrpark möchten häufig ihre interne Zahlungsreferenz auf den von Mercedes-Benz ausgestellten Rechnungen sehen, damit sie diese schneller intern weiterleiten und begleichen können. Dafür stehen bei VAN-bezogenen Verträgen von Gewerbekunden nun die beiden Felder „External Contract ID“ und „Payment Reference“ zur Verfügung. Beide Felder sind optional. Sie können bereits bei der Vertragsanlage befüllt werden, müssen es aber nicht, und eine leere Angabe verhindert die Vertragsanlage nicht. Auch nach der Aktivierung eines Vertrags lassen sich beide Werte noch ergänzen oder ändern. Die Pflege erfolgt durch die Mitarbeitenden der Marktorganisation auf Vertragsebene.

Beim Export von Rechnungen in die Schnittstelle E169 wird die External Contract ID im Feld PTXT01 ausgegeben. Die Zahlungsreferenz wird für nicht-staatliche Kunden ebenfalls im Feld PTXT01 exportiert. Staatliche Kunden sind von dieser Funktion ausgenommen, da für sie die Leitweg-ID zu einem späteren Zeitpunkt umgesetzt wird. Ist kein Wert hinterlegt, bleibt die entsprechende Stelle in PTXT01 leer, ohne dass ein Exportfehler entsteht. Die exportierten Werte entsprechen exakt den Werten, die zum Zeitpunkt des Rechnungsexports im Vertrag gespeichert sind. Wird ein Wert im Vertrag geändert, verwendet bereits der nächste Export den neuen Wert. Für Mercedes-Benz verbessert sich dadurch der Cashflow, und der Mahnaufwand sinkt.

**Weitere Korrekturen und Verbesserungen**
Verträge, die vollständig durch Kampagnen und Händlerrabatte abgedeckt sind, erhalten keinen Zahlungsplan für den Kunden mehr. Das gilt, wenn die Summe aus Kampagnenrabatt, SCOM-Anteil, Sonderfall und Händlerrabatt 100 Prozent des Vertragswerts ergibt.

Außerdem wurde ein Fehler behoben, bei dem für MPC-Benutzer die Meldung „Access denied for method: addInvoiceComment“ erschien. Darüber hinaus wurden Korrekturen an Verträgen im Produktivsystem vorgenommen, und der Wert der External Campaign ID wurde auf Ebene der Rechnungspositionen korrigiert.

Die bestehenden Validierungen der E169-Exportdatei wurden erweitert. Zudem werden Tests durchgeführt, die prüfen, ob die External Campaign ID im Positionstext der Schnittstelle E174 korrekt aktualisiert wird. Dies betrifft das Produkt „Excellent“ bei Kampagnen ohne External Campaign ID sowie das Produkt „Select Plus“ bei Kampagnen mit External Campaign ID. Voraussetzung ist jeweils ein aktiver Vertrag, dessen Kampagnenrabatt-Rechnung den Status „Accepted“ hat.

**Nicht umgesetzt**
Die geplante Unterstützung einer Rechnungsstellung nach Geschäftsjahr für VAN-Kunden wurde nicht umgesetzt und ist daher nicht Bestandteil des Funktionsumfangs.