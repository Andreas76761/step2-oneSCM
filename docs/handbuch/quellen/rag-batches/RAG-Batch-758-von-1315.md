# Batch 758 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Verlängerung von Verträgen mit vierteljährlichem, halbjährlichem oder jährlichem Zahlungsintervall**

Das Vertragsmanagement bietet die Verlängerung (Prolongation) von Verträgen bereits für vierteljährliche, halbjährliche und jährliche Zahlungsintervalle an. Bislang unterstützte Revenue jedoch nur monatliche und einmalige Verlängerungen. Mit der neuen Funktion kann Revenue nun auch Verträge verlängern, die ein vierteljährliches, halbjährliches oder jährliches Zahlungsintervall verwenden. Für monatliche und einmalige Verträge bleibt der bisherige Ablauf unverändert bestehen. Bei allen anderen Intervallen verwendet Revenue stets das im Vertrag hinterlegte Zahlungsintervall und ersetzt es nicht durch ein monatliches.

**Wirksamkeitsdatum**

Das Wirksamkeitsdatum der Verlängerung ist immer der Beginn des nächsten gültigen Rechnungszeitraums nach der Verlängerungsanfrage und nach Ablauf der Angebotsgültigkeit. Es wird kein Datum innerhalb des aktuellen Rechnungszeitraums angeboten. Eine Umrechnung verstrichener Monate mit anschließender Rundung findet nicht statt.

Ist die aktuelle Rechnung bereits bezahlt, beginnt das Wirksamkeitsdatum mit dem nächsten Rechnungszeitraum. Hat die aktuelle Rechnung den Status „Geplant“ oder „Exportiert“, bleibt sie unverändert und wird nicht neu verteilt. Reicht die Angebotsgültigkeit über den nächsten Rechnungsbeginn hinaus, verschiebt sich das Wirksamkeitsdatum auf den darauffolgenden gültigen Rechnungszeitraum. Wird beispielsweise ein Angebot am 18. Mai erstellt und ist eine Gültigkeit von 30 Tagen konfiguriert, wird ein Rechnungsdatum innerhalb dieser Frist nicht angeboten, sondern der erste gültige Beginn eines Rechnungszeitraums danach. Bei einem vierteljährlichen Vertrag mit einer Verlängerungsanfrage am 17. April und dem nächsten Rechnungszeitraum ab dem 1. Juli wird entsprechend der 1. Juli als Wirksamkeitsdatum gewählt.

Zur Auswahl stehen alle gültigen Wirksamkeitsdaten vom ersten infrage kommenden Rechnungszeitraum bis zum Ende des verlängerten Vertrags. Ungültige Daten werden nicht angeboten. Wird dennoch ein Datum vorgegeben, das nicht dem Beginn eines gültigen zukünftigen Rechnungszeitraums entspricht oder vor Ablauf der Angebotsgültigkeit liegt, lehnt Revenue es ab und nimmt weder am Zahlungsplan noch an den Rechnungen Änderungen vor.

**Neuverteilung der Beträge**

Neu verteilt werden ausschließlich Rechnungszeiträume, die ab dem Wirksamkeitsdatum beginnen. Der Verlängerungsbetrag und die verbleibenden Rechnungsbeträge werden gemäß der vereinbarten Berechnung auf die neuen zukünftigen Rechnungszeiträume verteilt. Die Beträge und die Berechnungswerte stammen dabei aus dem Vertragsmanagement bzw. vom Produkt. Der erste Rechnungszeitraum wird nicht allein deshalb neu verteilt, weil das Aktivierungsdatum des Vertrags in diesen Zeitraum fällt. Bei vierteljährlichen und jährlichen Plänen bleibt die erste Rechnung dort, wo diese Regel greift, wie ursprünglich erstellt.

**Ergebnis im Zahlungsplan**

Nach erfolgreicher Verlängerung enthält der Zahlungsplan die korrekte verlängerte Vertragslaufzeit und die richtige Anzahl an Rechnungszeiträumen. Die zukünftigen Rechnungsbeträge entsprechen den neu verteilten Werten, und die für die verlängerte Laufzeit erforderlichen zusätzlichen Rechnungen werden angelegt. Bestehende Rechnungsstatus und bereits erzeugte Finanzdokumente bleiben erhalten.

Der verlängerte Vertrag sowie seine aktualisierten Zahlungsplan- und Rechnungsdaten werden beim nächsten anstehenden Export berücksichtigt, und die exportierten Werte entsprechen dem verlängerten Vertrag. In der Vertragsdetail- bzw. Zahlungsplanansicht werden nach einer erfolgreichen Verlängerung die Vertragswerte vor und nach der Verlängerung gegenübergestellt. Sichtbar sind dort die verlängerte Laufzeit, die Anzahl der Rechnungen, die Zeiträume und die Beträge.

**Fehlerfälle**

Sind die Verlängerungsdaten unvollständig oder die übermittelten Rechnungswerte inkonsistent, wird der Zahlungsplan nicht teilweise aktualisiert. Stattdessen wird ein Fehler zur Korrektur erfasst, und bestehende Rechnungsstatus und -beträge bleiben unverändert.