# Batch 1203 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 35 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation**

**Produkte testen („Test Product")**

Mit der neuen Testfunktion können Anwenderinnen und Anwender mit der Rolle MPC ein Produkt so prüfen, als wäre es bereits live – mit echten Fahrzeugen und realen Parametern. Das ist vor, während und nach der Veröffentlichung möglich, ebenso bevor eine Preisversion gültig wird. So lässt sich sicherstellen, dass Produkt und Preise korrekt konfiguriert sind. Bisher war ein solcher Test mit Kennungen wie BM, VIN/FIN oder anderen simulierten Parametern nicht möglich.

Die Funktion steht an zwei Stellen zur Verfügung. Im Aktionsmenü gibt es die neue Aktion „Test Product". Sie öffnet eine Seite, die im ersten Schritt dieselben Parameter wie der Ablauf zur Vertragserstellung enthält, ergänzt um die zusätzlichen Angaben für den Test. Zudem gibt es im Menü „Product Management" die neue Seite „Product Testing". Sie entspricht der Seite für das Contract Offering. Nur für MPC-Benutzer werden dort zusätzlich die Felder zur Testeinrichtung angezeigt, und nur sie können die Seite in dieser Form aufrufen. MPC-Benutzer können dieselben Fahrzeugkennungen verwenden wie Händler bei der Vertragserstellung. Ist der Schalter ausgeschaltet, kann das FRD-Datum simuliert ausgewählt werden. Das Ergebnis berücksichtigt alle relevanten Faktoren wie Preise, Gebühren, Services und Kampagnen, die zum gewählten Datum bzw. in der gewählten Preisversion gelten.

Sobald eine Fahrzeugkennung angegeben ist, werden die Fahrzeugdetails angezeigt, außerdem der aktuelle Kilometerstand, sofern in der Datenbank vorhanden. Über ein Status-Dropdown wird festgelegt, welche Produkte in die Testdaten einbezogen werden. Zur Auswahl stehen „Ready", „Published" und „Deactivated". Das Testdatum ist ein Datumsfeld, in dem Termine ab dem heutigen Tag wählbar sind. Damit lassen sich zukünftige Preisversionen simulieren. Bei ausgeschaltetem FRD-Schalter ist das Feld deaktiviert, bis ein FRD-Datum gewählt wurde. Danach kann nur dasselbe oder ein späteres Datum gewählt werden. Das Dropdown „Sales Level" enthält die aktuell verfügbaren Verkaufsebenen und legt fest, welche Art von Benutzer die Anfrage stellt.

Ein Beispiel: Sind die Status „Ready" und „Published" gewählt, ist das Testdatum der 01.01.2025, das aktuelle Datum der 17.04.2024 und das Sales Level „Customer", dann enthält die Suchliste Produkte im Status „Ready" und „Published", die für das Sales Level „Customer" konfiguriert sind. Berücksichtigt werden dabei die Preisversionen, die am 01.01.2025 gültig wären.

Ein Klick auf ein Produkt führt zur Konfigurationsseite der Produktoptionen. Dort werden die verfügbaren Vertragslaufzeiten, Jahreslaufleistungen und Zahlungsintervalle in den jeweiligen Dropdowns angezeigt. Der Reiter „Product" zeigt die Produktbeschreibung und die enthaltenen Leistungen. Im Bereich „Campaign" erscheinen Kampagnen, die im gewählten Zeitraum aktiv wären. Der Bereich „Payment Plan" zeigt den Zahlungsplan passend zu den aktuell gewählten Produktoptionen. Die Schaltfläche „Back" führt zur Produktseite zurück, wobei der vorherige Stand und die Details erhalten bleiben. „Print" öffnet den Druckdialog für Zahlungsplan und Vertrag. „Email" öffnet ein Fenster, über das eine Test-E-Mail an die angegebene Adresse gesendet wird.

**Industry Codes und Branchenpreise**

Für die Bereiche Contract Calculation rund um Industry Codes liegen derzeit offene Testfälle vor. Sie betreffen die Erstellung von Industry Codes, die Übersicht, die Bearbeitung, die Zuordnung zu Produkten sowie die Erstellung von Branchenpreisen. Funktionale Beschreibungen dieser Bereiche liegen in den vorliegenden Informationen nicht vor, daher werden sie hier nicht näher erläutert.