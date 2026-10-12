# Batch 275 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Anzeige des Vertragspreises**

Im Bereich „Price information" eines Vertrags wird nun der Gesamtpreis des Vertrags angezeigt. Die Preise des Vertrags (Brutto-, Netto- und Steuerbetrag, je monatlich oder einmalig) werden zum Zeitpunkt der Vertragserstellung berechnet. Market-Operation-Benutzer sehen in diesem Bereich die folgenden Felder: Total Gross Amount (der Gesamtbruttobetrag des Vertrags), Total Net Amount (der Gesamtnettobetrag), Total Tax Amount (der gesamte Steuerbetrag) und VAT Rate (der Mehrwertsteuersatz, zum Beispiel 19 %). Diese Felder sind nicht editierbar. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Revenue Management: Berechnung des Current Account Balance unter Berücksichtigung von Rechnungen mit dem Status „FI Document Created"**

Für einen Vertrag wird der „Current Account Balance" in EUR angezeigt. Der Betrag ist farblich gekennzeichnet: grün bei einem positiven Wert, rot bei einem negativen Wert und grau bei 0. Die Anzeige erfolgt im Format „#.##0,00 EUR" in der rechten Ecke und ist auf jeder Seite des Contract Managements zu sehen. Sie erreichen sie über Contract Management, indem Sie einen bestimmten Vertrag suchen und die Vertragsnummer anklicken.

Bisher ergab sich der Kontostand aus der Summe der (bezahlten) Kundenrechnungen zuzüglich der Summe der (erhaltenen) Subventionen, abzüglich der Summe aller Vertragsforderungen und der Provisionen. Für den deutschen Markt, der als FI-System NACOS verwendet, gilt eine Besonderheit: NACOS meldet nicht zurück, dass eine Rechnung vom Kunden bezahlt wurde, sondern nur, dass sie erzeugt wurde (Status „FI Document Created"). Ohne Anpassung wäre der Kontostand daher stets negativ oder 0. Für Märkte, die NACOS nutzen, berücksichtigt die Formel deshalb auch Rechnungen im Status „FI Document Created". Der Current Account Balance ergibt sich dort aus der Summe der Kundenrechnungen (pünktlich bezahlt, überfällig bezahlt oder „FI Document Created"), abzüglich der Summe aller Vertragsforderungen. Subventionen und Provisionen gehen in diese Berechnung nicht mehr ein. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Batch Job Management: Download von durch einen Job erzeugten Dateien**

Administratoren können die von einem Batch Job erzeugten Dateien herunterladen. Ursprünglich war vorgesehen, mehrere Dateien auszuwählen und mit einer gemeinsamen Schaltfläche herunterzuladen. Da ein Download mehrerer Dateien nicht umgesetzt werden kann, wurden Auswahlkästchen und die einzelne Schaltfläche oben als nicht sinnvoll eingestuft. Stattdessen gibt es nun für jede Datei eine eigene Download-Schaltfläche. Mit einem Klick darauf wird die jeweilige Datei heruntergeladen. Dabei erscheint das Standard-Dialogfenster zur Auswahl des Zielordners, und die Datei wird in den gewählten Ordner geladen. Die Dateien behalten denselben Namen und dasselbe Dateiformat wie im S3-Bucket. Die Gestaltung entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

Die Funktion, aus dem Admin-Bereich für eine ausgewählte Rechnung per Hyperlink zu den zugehörigen Vertrags- oder Kundendetails zu springen, wurde nicht umgesetzt und ist daher nicht Teil dieser Version.