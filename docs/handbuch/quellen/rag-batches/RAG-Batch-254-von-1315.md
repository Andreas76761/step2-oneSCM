# Batch 254 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 5 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Neuerungen und Korrekturen**

**Erweiterung der Schnittstellen für Ereignisdaten**

Die Schnittstellen zum Austausch von Ereignissen werden aktualisiert, und für jedes Ereignis kommen weitere Felder hinzu. Das betrifft die Ereignisse Kundenstamm, Vertragsstamm, Vertragsertrag und Händlerrechnung.

In allen vier Ereignissen wird der Buchungskreis (CompanyCode) als SAP-Gesellschaftscode aus der Ländercode-Tabelle ermittelt. Dort ist jedem Land der CMS-Ländercode, der Vega-Ländercode und der zugehörige SAP-Gesellschaftscode zugeordnet. So gilt etwa für Deutschland DE01, für Belgien BE01, für Frankreich FR01, für Großbritannien GB01, für Italien IT01, für Polen PL01 und für Spanien ES01. Für die Niederlande lautet der Code 1261, für Österreich 1920, für Portugal 1940, für Dänemark 1295, für Schweden 1271 und für Saudi-Arabien 7002. Die Geschäftsbereiche der ersten Ebene (BusinessAreas1stLevel) werden aus der Sparte (Division) abgeleitet: Die Sparte PC wird zu MERCEDESBENZ CARS, die Sparte VANS zu MERCEDESBENZ VANS.

Im Vertragsstamm-Ereignis gelten zusätzliche Zuordnungsregeln. Die Zahlungsart (PaymentType) wird wie folgt abgebildet: 01 steht für monatliche Zahlung, 02 für Einmalzahlung und 03 für einen gestaffelten Preis (zum Beispiel 100 im ersten Jahr, 150 im zweiten Jahr usw.). Die Kraftstoffart wird eins zu eins übernommen, das Baumuster stammt aus dem Vertrag. Der Kennzeichner für Verlängerung bzw. Verkürzung (ExtentionReductionIndicator) unterscheidet S für kurzfristige Verlängerung, L für langfristige Verlängerung, E für vorzeitige Abrechnung (Verkürzung der Zahlungsdauer) und R für Verkürzung der Vertragslaufzeit. Als Vertragsdauer wird die Laufzeit des Vertrags übermittelt.

Im Vertragsertrag-Ereignis wird der Vertragsstatus (ContractStatus) nach folgenden Regeln abgebildet: 001 Aktiv, 002 Gesperrt/Ausgesetzt, 003 Beendet (Datum), 004 Schlussrechnung gestellt, 005 Übertragen/Aktiv, 006 Übertragen und Schlussrechnung gestellt, 007 Gestohlen, 008 Verlängert/Aktiv, 009 Beendet (Laufleistung) und 010 Storniert. Als letztes Kundenrechnungsdatum (LastCustomerInvoiceDate) wird das letzte Exportdatum der Rechnung aus dem Zahlungsplan ermittelt und als Rechnungsdatum gesendet. Die Zahlungsdauer (PaymentDuration) stammt aus dem Vertrag: Bei einer Einmalzahlung beträgt sie einen Monat, bei monatlicher Zahlung entspricht sie der Anzahl der Rechnungen im Zahlungsplan.

**Anpassung des Zahlungsplans bei kurzfristiger Vertragsverlängerung**

Mitarbeitende der Marktbetreuung (Market Operations) können einen aktiven Vertrag um maximal sechs Monate über das Vertragsende hinaus verlängern. Die Verlängerung selbst erfolgt im Vertragsmanagement. Wird ein Vertrag verlängert, benachrichtigt das Vertragsmanagement das Revenue Management, damit zusätzliche Rechnungen in den Zahlungsplan aufgenommen werden. Die Benachrichtigung enthält die Verlängerungsart (kurzfristig), den Verlängerungszeitraum als Anzahl zusätzlicher Monate, die Zahlungsart (monatlich oder einmalig) sowie den Nettobetrag und den Bruttobetrag pro Intervall, jeweils ohne Umverteilung.

Bei monatlicher Zahlung wird genauso viele Rechnungen angelegt, wie der Verlängerungszeitraum Monate umfasst. Jede Rechnung erhält den Flusstyp „Periodically Payment“, den Dokumenttyp „Invoice“ und den Kundenrechnungstyp „MPPI“ (monatliche bzw. periodische Kundenrechnung). Der Rechnungsstatus lautet „Planned“. Der Rechnungszeitraum beginnt am Vertragsbeginn plus X Monate und endet am Vertragsbeginn plus (X+1) Monate minus einen Tag. Beispiel: Bei einem Vertragsbeginn am 01.02.2023, einem Vertragsende am 31.01.2025 und einer Verlängerung um zwei Monate gilt für die erste zusätzliche Rechnung der Zeitraum vom 01.02.2025 bis 28.02.2025. Als Rechnungsempfänger wird der Name des Vertragszahlers eingetragen, die Währung stammt aus dem Vertrag. Der Nettobetrag entspricht dem vom Vertragsmanagement gelieferten Nettobetrag pro Intervall, der Steuerbetrag wird berechnet, und der Gesamtbetrag entspricht dem Bruttobetrag pro Intervall. Die Felder oneSCM-Rechnungsnummer, Verarbeitungsnummer, Rechnungsdatum, Ist-Laufleistung, Rechnungstext, Übertragungsdatum an das Finanzsystem, FI-System-Rechnungsnummer und Rechnungsreferenz bleiben leer.

Bei Einmalzahlung wird nur eine einzige Rechnung mit denselben Eigenschaften angelegt. Ihr Zeitraum reicht vom Vertragsbeginn plus X Monate bis zum Vertragsbeginn plus (X + Anzahl der zusätzlichen Monate) minus einen Tag. Im obigen Beispiel ergibt das den Zeitraum vom 01.02.2025 bis 31.03.2025. Dieser Fall lässt sich derzeit nicht über die Benutzeroberfläche testen, da im Vertragsmanagement vorerst nur die monatliche Zahlung auswählbar ist.

**Behobene Fehler**

Behoben wurden zwei Probleme: Ein Batch-Job konnte zuvor nicht manuell gestartet werden, und bei der Produktauswahl trat nach der Einführung neuer Felder ein Fehler auf.