# Batch 222 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 25 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Änderungen und Verbesserungen**

**Export von Kundenrechnungen (E169)**

Beim Export von Kundenrechnungen an die E169-Schnittstelle wird der Exporttyp im Kopfsatz sowie der Vertragstyp in der Position nun anhand des Vertragstyps abgeleitet. Verträge der Art CompleteCare bzw. Excellent erhalten den Exporttyp S, Contingent- bzw. Wartungsverträge den Exporttyp SW. Beim Lauf des E169-Jobs wird für jeden Vertragstyp eine eigene Datei erzeugt: Alle Rechnungen vom Typ S stehen in einer Datei, alle Rechnungen vom Typ SW in einer anderen. Der Dateiname enthält dazu den jeweiligen Typ.

Für die Exporttypen S und FEA wird im Rechnungstext (PTXT01) zwischen Produktname und Fahrzeugnummer (FIN) zusätzlich die Vertragsnummer in der Form „Vertrag [Vertragsnummer]“ eingefügt. Außerdem wurde das Leerzeichen zwischen dem Trennzeichen „|“ und dem Wort „Umsatzsteuer“ entfernt. Bei exportierten Händlerrabatt-Rechnungen wird die SAP-Debitorennummer des Zahlungspflichtigen verwendet. Zudem wurde das Verhalten der Batch-Jobs E169 und E174 korrigiert, die nicht wie erwartet arbeiteten. Bei E174 werden die erzeugten Dateien nun auch in der Benutzeroberfläche angezeigt.

**Ereignisse an NEMESIS**

Alle Beträge in den Revenue- und Cost-Events werden nun im von NEMESIS geforderten Format übermittelt. Dazu wird der Betrag aus oneSCM mit 100 multipliziert und die Nachkommastellen werden entfernt. So wird aus 123,4567 der Wert 12345, aus 123,4 der Wert 12340 und aus 1234 der Wert 123400.

Für Verkaufszuschuss-Rechnungen und interne Rechnungen werden Revenue-Events erzeugt. Bei internen Rechnungen wird NEMESIS erst dann ein Ereignis gesendet, wenn die Rechnung den Status „EXPORTED“ erreicht. Die Markteinstellungen werden für diese Rechnungen nicht angewendet.

**Berechnung des Kontostands**

Rechnungen gehen mit positivem, Gutschriften mit negativem Vorzeichen in die Berechnung ein. Der Kontostand ergibt sich aus: Kundenrechnungen plus Preisreduktionen minus Werkstattrechnungen minus Provisionen.

Die bezahlten Kundenrechnungen umfassen Rechnungen in den Status „FI Document Created“, „Paid on Time“ und „Paid Overdue“. Berechnet wird die Summe der Rechnungen der Typen MPPI, MANU, FDCR und BDCR abzüglich der Gutschriften dieser Typen. Werkstattrechnungen werden im Status „Processed“ (aus i156 importiert) bzw. „Exported“ (manuell erstellt) summiert. Die Preisreduktion setzt sich aus Kampagnenrechnungen (Sales: CAMP, Aftersales: SDAS) und internen Händlerrabatt-Rechnungen im Status „Exported“ sowie externen Händlerrabatt-Rechnungen im Status „FI Document Created“ zusammen. Die Provision besteht aus internen Händlerprovisions-Rechnungen im Status „Exported“ und externen Händlerprovisions-Rechnungen im Status „FI Document Created“.

**Rechnungen und Verträge**

Der Positionstext einer Rechnung ist nicht mehr auf 216 Zeichen begrenzt. Die manuelle Erstellung von Werkstatt- und Kundenrechnungen ist bei Verträgen im Status „CLOSED“ oder „CANCELLED“ nicht mehr möglich, da die Schaltfläche „Erstellen“ in diesem Fall nicht verfügbar ist. Korrigiert wurden außerdem falsche Steuer- und Gesamtbeträge bei Monatsverträgen sowie fehlende Schadenscodes bei der manuellen Erstellung einer Werkstattrechnung. Auch das Anlegen eines neuen Schadenscodes funktioniert wieder.

**Weitere Korrekturen in der Oberfläche**

Behoben wurden ein Fehler auf der Seite „Rechnungen“ im Admin-Bereich sowie leere Marktoptionen bei internationalen Werkstattrechnungen. Die Größe der Dropdown-Komponente wurde an die übrigen Komponenten angepasst.

**Zahlungsplan-Vorschau bei 100 % Händlerrabatt**

Der Zahlungsplan eines Vertrags mit 100 % Händlerrabatt enthält die einmalige Händlerzahlung, ohne darauf hinzuweisen, dass es sich nicht um die Kundenrate handelt. Dies kann Vertriebsmitarbeitende und Kunden verwirren. Dieser Punkt ist als erledigt markiert.