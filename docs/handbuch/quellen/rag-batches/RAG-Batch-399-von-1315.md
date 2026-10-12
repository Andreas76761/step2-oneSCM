# Batch 399 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 17 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente und Kommunikation**

Im Bereich Dokumente und Kommunikation wurden die Dokumentaktionen bei der Vertragserstellung überarbeitet und geprüft. Benutzer können einen Servicevertrag ersetzen, indem sie einen neuen hochladen. Das System füllt dabei den Dokumenttyp „Service Contract“ sowie die Dokumentnummer automatisch aus und stößt die Prüfungen der Unterschrift und der Vertragsnummer erneut an. Benutzer der Rollen MO und Dealer sehen bei Dokumenten vom Typ „Service Contract“ ausschließlich die Aktionen „Ersetzen“ und „Herunterladen“. Bei allen anderen Dokumenttypen stehen ihnen ausschließlich „Ersetzen“, „Herunterladen“ und „Löschen“ zur Verfügung. Wird beim Erstellen eines Vertrags eine fehlerhafte Unterschrift erkannt, zeigt das System dem MO-Benutzer in den MO-Prüfungen die Unterschrift als „NOT OK“ an.

Weitere Funktionen sind vorgesehen, aber noch nicht abschließend geprüft. Ein Vertragsvorlagen-Template lässt sich nur veröffentlichen, wenn MB-Unterschriften vorhanden sind. Sind keine Markt-Unterschriften hinterlegt, kann der Benutzer die Vorlage nicht veröffentlichen. Zudem gibt es den neuen Unterschriftstyp „1 Customer“. Benutzer können eine Vertragsvorlage erstellen, bei der ausschließlich dieser Unterschriftstyp ausgewählt ist. Die Unterschrift erscheint sowohl in der Vorschau der Vertragsvorlage als auch bei der Erstellung eines Vertrags.

Außerdem wird eine E-Mail-Benachrichtigung für den Fall eingeführt, dass ein Vertrag den Status „Cancelled“ erhält. Im Bereich der Stammdaten-Templates können Benutzer eine E-Mail-Vorlage für die Stornierung erstellen und entweder als Entwurf speichern oder veröffentlichen. Dabei stehen neue Platzhalter zur Verfügung. Wenn ein Vertrag auf Kundenwunsch storniert wird, wird die E-Mail versendet, und die enthaltenen Angaben sollen korrekt sein.

**Überarbeitung der Benutzeroberfläche**

Die Filter wurden vereinheitlicht, damit die Bedienung in allen Hauptbereichen konsistent ist. In den Bereichen Kundenverwaltung sowie Template-Verwaltung (Dokumente und Benachrichtigungen) zeigen die Schaltflächen neben den Filtern keine Textbeschriftung mehr. Die Beschriftung erscheint stattdessen als Tooltip, sobald man mit der Maus darüberfährt. Die Schaltflächen sind an den Filtern ausgerichtet.

Auch die Tabellen wurden angepasst. In der Vertragsverwaltung, auf den Reitern „Dokumente“ und „Benachrichtigungen“ unter „Kommunikation“, werden Dokumentname und Zeitangaben nicht mehr als blaue Links dargestellt, da sie nicht zu einer anderen Seite führen. Sie erscheinen jetzt in der Textfarbe #333333. Gibt es in der Benachrichtigungstabelle ein Zwischenablage-Symbol, bleibt es das einzige blau dargestellte Element. Die Tabellen passen nun vollständig in den grauen Bereich.

In der Template-Verwaltung (Reiter „Dokumente“ und „Benachrichtigungen“) sind die Template-Namen als Hyperlinks gekennzeichnet, da sie anklickbar sind. Die Status-Chips haben neue Farben. Der Chip „Draft“ hat den Hintergrund #F4F4F4 und die Textfarbe #767676. Der Chip „Published“ hat den Hintergrund #E9F6EA und die Textfarbe #198025.

Zusätzlich wurde ein Fehler behoben, durch den Benutzer Templates (E-Mail, Vertrag, AGB und SEPA) nicht aktualisieren konnten.