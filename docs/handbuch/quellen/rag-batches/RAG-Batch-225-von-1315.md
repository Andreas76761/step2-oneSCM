# Batch 225 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise Revenue Management**

**Batch-Jobs manuell stoppen**
Im Admin-Bereich unter „Batch jobs“ können MO-Benutzer einen laufenden Batch-Job jetzt manuell stoppen. Das ist hilfreich, wenn ein Job aus technischen Gründen nicht mehr beendet werden kann. Solange ein Job läuft, erscheint in der Spalte „Action“ die Schaltfläche „Stop“, und die Option „Run now“ ist deaktiviert. Ist der Job nicht im Status „Running“, wird die Schaltfläche nicht angezeigt.

Wird ein Job gestoppt, erhält er den Status „Stopped“ (rot dargestellt), und die User-ID wird auf den Namen des Benutzers aktualisiert, der den Job gestoppt hat. Zusätzlich wird in Datadog eine Warnmeldung protokolliert, aus der hervorgeht, wer den Job gestoppt hat.

Beim Stoppen erfolgt ein Rollback: Alle während der Laufzeit geänderten Daten und alle dabei erzeugten Sequenzen werden auf den Stand vor dem Start des Jobs zurückgesetzt. Wird zum Beispiel der CFDMBatch gestoppt, werden alle Rechnungen, die auf „Accepted“ gesetzt wurden, wieder auf „Planned“ oder „Created“ zurückgesetzt. Wurde eine NACOS-/OneERP-Datei erzeugt und wurden Rechnungen als exportiert markiert, wird die Datei gelöscht (auch aus S3). Die Rechnungen erhalten ihren ursprünglichen Zustand zurück (unter anderem Status und FI-Processing-Nummer), und die Sequenz wird auf den Ausgangsstand vor dem Start des Batch-Jobs zurückgesetzt.

**Zahlungsplan: Steuer- und Bruttobetrag aus dem Vertrag**
Die Vertragserzeugung liefert nun neben dem Nettobetrag auch den Steuerbetrag und den Bruttobetrag. Dadurch sind die Beträge bei der Erstellung und der Vorschau eines Zahlungsplans in allen Situationen identisch. Die beiden neuen Eigenschaften „vatAmount“ und „grossAmount“ werden in folgenden Fällen übernommen: bei der Generierung eines Zahlungsplans (z. B. monatlich, einmalig), bei der Generierung eines Entwurfs-Zahlungsplans (API im Revenue-Bereich), bei der Kurzzeitverlängerung und bei der Langzeitverlängerung. Die Werte werden jeweils über die Anfragen der entsprechenden Events bzw. APIs übermittelt.

**NEMESIS: Import funktionaler Fehler**
Der NEMESIS-Import kann nun eine CSV-Datei mit geänderter Struktur verarbeiten. Die Datei enthält die Spalten Company Code, Business Unit, Period, Date of Error Log, Time of Error Log (Format HHmm), Closing Date, FIN, Contract No., Contract Status, Contract Status desc., Contract Start Date, Contract End Date, Start Mileage, Planned Mileage, Product Line, Message No., Type, Reason for error, Error Type, Occurance und First Incidence. Sie wird über den CFT-Flow im Ordner Environment/DE/NEMESIS/Incoming/ bereitgestellt.

Die Zuordnung der Fehler zu einem bestimmten Event erfolgt anhand definierter Mapping-Regeln. Gibt es für eine Fehlernummer mehrere Regeln, wird der Fehler in allen genannten Events erzeugt. Bei Fehler 23 werden beispielsweise Fehler in den Bereichen Contract, Revenue und Cost angelegt.

Die Importregeln wurden zudem überarbeitet: Eine frühere Variante, die sich auf die Spalte „Interface - Subset“ stützte, gilt als überholt. Da dieselbe Fehlernummer mehreren NEMESIS-Events zugeordnet sein kann, ist die Berücksichtigung des Interface-Subsets für die Bestimmung des Event-Typs (Contract, Customer, Revenue, Cost) maßgeblich. Andere Schnittstellentypen (z. B. ISP) werden ignoriert.

**Revenue-Event an NEMESIS**
Die Mapping-Regeln für das Revenue-Event an NEMESIS wurden aktualisiert. Wurde auf einen Vertrag eine 100-%-Aftersales-Kampagne angewendet, werden keine Events (Contract, Revenue, Customer und Cost) an NEMESIS gesendet.

**NACOS: E174 und E169**
Die E174-Schnittstelle wurde gemäß dem NACOS-Feedback angepasst. Als Gruppenname wird der Wert „E174-SC“ übernommen. Die Business Division hat die Länge 4 (Position 75 bis 78) und lautet entweder „268V“ oder „268C“: „268C“ gilt für Pkw, „268V“ für Transporter (Van). Das Feld „Reserve for additional BSSEG Fields“ umfasst 10 Zeichen. Außerdem wurde der fehlerhafte Revenue-Bereich in der Datei E174_AfterSales korrigiert.

Bei E169 wurden die Rechnungstypen geändert: EXTSUB wird zu ESUB und EXTSER zu ESER.

**Weitere Korrekturen**
Das Rechnungsnummernfeld für Werkstattrechnungen (Workshop invoice number) akzeptierte bisher Buchstaben; dies wurde im Frontend korrigiert. In den Admin-Rechnungsfiltern wurde ein neuer Status ergänzt. Behoben wurden außerdem ein Fehler im Batch-Job SAPInvE169EXP, ein Problem, bei dem der Batch-Job E167 im Status „Started“ hängen blieb, sowie ein Problem, bei dem Revenue-Kafka-Nachrichten nicht im erwarteten Format eintrafen.