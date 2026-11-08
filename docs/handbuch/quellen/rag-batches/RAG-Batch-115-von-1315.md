# Batch 115 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management**

Bei der Anlage und Bearbeitung von Schadenscodes wurde die Mindestlänge für das Feld „Default Type Description“ angepasst. Bisher musste die Eingabe mindestens fünf Zeichen umfassen, kürzere Werte ließen sich nicht speichern. Dieselbe Einschränkung galt auch für die marktspezifischen Felder „Type Description“. Das führte dazu, dass beispielsweise die englische Bezeichnung „Loose“ (fünf Zeichen) akzeptiert wurde, die deutsche Entsprechung „Lose“ (vier Zeichen) jedoch abgelehnt wurde. Die Mindestlänge beträgt nun zwei Zeichen. Die Änderung gilt sowohl für die Anlage als auch für die Bearbeitung von Schadenscodes und betrifft ebenso alle marktspezifischen Felder „Type Description“, die im Schritt „Market Specificity“ angezeigt werden.

Im Bereich der Batch-Jobs für CoFiCo und SWT wurden zwei Jobs umbenannt, um die Bezeichnung SCOM durch E168 zu ersetzen. Aus „CoFiCoSCOMInvEXP“ wurde „CoFiCoE168InvEXP“, aus „SWTSCOMInvEXP“ wurde „SWTE168InvEXP“.

Außerdem wurden die Exporttypen vereinheitlicht, da diese nur noch fünfstellig sein dürfen. Dafür wurden drei bestehende Exporttypen ersetzt: „MTNEXW“ wurde zu „MTNEW“, „LMTNWT“ wurde zu „LMTWT“ und „LMTNEX“ wurde zu „LMTEW“. Die vollständige Liste der Exporttypen ist in der Dokumentation zur Exporttyp-Zuordnung (Export type mapping) im Confluence des Projekts hinterlegt.

Darüber hinaus wurden weitere Themen im Bereich Revenue Management abgeschlossen. Dazu zählen die erneut aufgetretene Fehlermeldung „Payment Plan missing due to Payment Duration“ sowie ein Korrekturprozess für fälschlicherweise erstellte Rechnungen, die auf ein PTXT-Problem zurückzuführen sind. Nähere Details liegen hierzu nicht vor.

Ein weiterer Punkt betrifft den Export der externen Zahlungsreferenz bei CoFiCo in der H-Zeile. Dieser Punkt hat den Status „BAT Confirmed“, ist also bestätigt, aber noch nicht abgeschlossen. Weitere Informationen sind aktuell nicht verfügbar.