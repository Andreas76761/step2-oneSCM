# Batch 370 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation**

Im Bereich Dokumente und Kommunikation wurden mehrere Verbesserungen für Vorlagen und Benachrichtigungen umgesetzt.

Für Privatkunden stehen neue Druckvariablen für die Gesamtbeträge (netto, Umsatzsteuer und brutto) zur Verfügung. Sie werden in die Vorlage „Servicecontractproposal_Private“ aufgenommen und im unterschriebenen Dokument sowie im heruntergeladenen Angebot angezeigt. Voraussetzung ist, dass die Vertragsdaten Angaben zur monatlichen Zahlung enthalten.

In E-Mail-Vorlagen sind Kopfzeile, Fußzeile und Betreff nun Pflichtfelder. Für die Verlängerungs-E-Mail wurden zusätzliche Platzhalter eingeführt, und zwar sowohl für gewerbliche Kunden als auch für Privatkunden. Im Notification-Management stehen dafür folgende Platzhalter zur Verfügung: contractOptionalCoverages, contractOptionalCoveragesProlonged, contractMonthlyNetPrice, extendedNetMonthlyAmount, contractMonthlyVatPrice, extendedVatMonthlyAmount, contractMonthlyGrossPrice, extendedGrossMonthlyAmount sowie VATRate. Sie lassen sich per Drag & Drop in E-Mail-Vorlagen einfügen. In Test-E-Mails werden sie durch Standardwerte ersetzt. Wird eine Langzeitverlängerung erzeugt, werden sie in der E-Mail durch die Werte aus dem Vertrag ersetzt.

Für das Feld „Version of Market“ in der Vorlage für die Datenschutzerklärung gilt nun eine Zeichenbegrenzung. Außerdem wurden Fehlermeldungen für die Vorlagen Vertrag, SEPA und AGB (T&C) ergänzt bzw. angepasst.

Im Reiter „Signing“ wird bei der Vertragserstellung über DSS zusätzlich ein weiteres Vertragsdokument im Entwurfsstatus bereitgestellt.

Im Benachrichtigungsbereich wird geprüft, ob die Statusanzeigen (blauer Punkt) und die Regeln zur Zeitanzeige abhängig vom Lesestatus und vom Alter einer Benachrichtigung korrekt funktionieren. Dies gilt für MPC/MO-Benutzer und für Händler (Dealer). Voraussetzung sind mehrere Benachrichtigungen mit unterschiedlichem Lesestatus und unterschiedlichen Zeitstempeln. Für Händler wird zudem geprüft, dass nur Benachrichtigungen mit Übersichtsseite und ohne gesperrte Fahrzeuge angezeigt werden.

Die geplanten Erweiterungen für Massenverträge (Dokument- und E-Mail-Vorlagen) wurden nicht umgesetzt, da das entsprechende Vorhaben abgebrochen wurde. Sie sind daher nicht Teil des aktuellen Funktionsumfangs.