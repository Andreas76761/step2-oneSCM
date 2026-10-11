# Batch 209 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Änderungen und Neuerungen**

**Export von Texten in PTXT01-Zeilen (E169)**
Überschreitet ein Text im Export E169 die Länge von 216 Zeichen, wird der Rest automatisch in einer neuen PTXT01-Zeile fortgesetzt. Dabei wird immer das ganze Wort in die nächste Zeile übernommen, ein Wort wird also nie in der Mitte getrennt. Es werden so viele PTXT01-Zeilen erzeugt, wie nötig sind, um den gesamten Text abzubilden. Am Ende jeder PTXT01-Zeile wird nach dem letzten Zeichen ein senkrechter Strich („|") ergänzt.

**Händlerstatus „Affiliate" bzw. „Non-Affiliate" aus der Händlerverwaltung**
Ob ein Händler zum Konzernverbund gehört (Affiliate) oder nicht (Non-Affiliate), bestimmt unter anderem die Rechnungsart (intern oder extern) sowie die Frage, ob eine Rechnung mit oder ohne Mehrwertsteuer erstellt wird. Bisher hat Revenue Management diese Information direkt über die GSSN-Schnittstelle abgefragt. Künftig beziehen die Revenue- und Cost-Services die Händlerdetails stattdessen aus der Händlerverwaltung (Dealership Management). Diese ist die zentrale Quelle für Händlerinformationen, speichert den Affiliate-Status und hält ihn aktuell. Dadurch sinkt die Zahl der Aufrufe an GSSN+, und die Verarbeitung wird schneller. Die Änderung betrifft folgende Bereiche von oneSCM: den Import der i156-Dateien, die manuelle Erstellung von Werkstattrechnungen, Händlerrabatten und Händlerprovisionen, den Export von Rechnungen an oneERP (E167, E169, E174) sowie die Übermittlung von Informationen an NEMESIS.

**Rechnungen für MBLD-Verträge (Passenger Cars)**
Für MBLD-Verträge stellt oneSCM ausschließlich Einzelrechnungen aus; Sammelrechnungen gibt es für diese Verträge nicht. Da MBLD-Verträge am Monatsende abgerechnet werden, wurden eigene Batch-Jobs eingeführt, die unabhängig vom regulären Rechnungsablauf arbeiten. Diese Regelung gilt speziell für den deutschen Markt.

Der neue CFDM-Batch wählt anhand der Kriterien Quellkanal „Leasing" und Division „Passenger Cars" alle infrage kommenden aktiven MBLD-Verträge und deren Rechnungen im Status „PLANNED" aus. Rechnungen von Standardverträgen sind darin nicht enthalten, und der bestehende CFDM-Batch berücksichtigt diese Leasingverträge nicht mehr. Nach erfolgreichem Lauf wechseln die Rechnungen vom Status „PLANNED" auf „ACCEPTED".

Der neue Export-E169-Batch für MBLD-Verträge verarbeitet nach denselben Kriterien alle Rechnungen im Status „ACCEPTED" und überträgt sie an das Finanzsystem. Nach erfolgreichem Lauf wechseln sie auf den Status „EXPORTED". Die Exportdatei richtet sich nach dem Leasingprodukt: Advance (01) wird mit dem Exporttyp LA, Basic (02) mit LB, Classic (03) mit LCL, Compact (04) mit LCO, Excellent (05) mit LE, Compact Plus (15) mit LCP und Tire (06) mit LT exportiert.

In der Benutzeroberfläche wird bei allen MBLD-Verträgen (Quellkanal „Leasing") der Schalter „Collective Invoice" im Bereich „Payment" ausgeblendet.

**Weitere Korrekturen**
Im Bereich der Finanzkontrolle (Financial Control) wurde ein Fehler bei der Rechnungsanzahl der exportierten Zähler bzw. Prüfungen (Exported Counter/Checks) behoben. Außerdem wurde der Pfad für den Download der i156-Dateien aus S3 korrigiert. In der Kundenrechnung konnte unter Safari keine Rechnung angelegt werden; auch dieses Problem wurde behoben.