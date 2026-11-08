# Batch 1135 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 23 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation (Contract Calculation)**

Im Bereich der Vertragskalkulation wurden mehrere Funktionen und Prüfungen für die Produkt- und Preisverwaltung bereitgestellt. Die Fahrgestellnummer wird aus dem externen Auftragsnummernsystem (GO und AFAB) übernommen und an den Vertrag übermittelt. Preise werden zudem auch für den Kunden aufgeteilt dargestellt. In der Preisversion zeigen die Übersichts- und die Detailseite die Werte für die Händlerprovision an. Bei der Verlängerung (Prolongation) werden alle Preiskomponenten bereitgestellt.

Die Suche nach Modellcodes unterscheidet zwischen gültigen und ungültigen Eingaben. Gibt ein Benutzer einen gültigen Modellcode für Vans oder für Passenger Cars ein, wird dieser entsprechend verarbeitet. Bei einem ungültigen oder nicht existierenden Modellcode wird dies bei der Suche berücksichtigt.

Für Vans gelten folgende Regeln: Das Feld „Wheel Size“ ist sowohl für LIMITED als auch für UNLIMITED sichtbar. Sobald eine Radgröße ausgewählt wird, werden die Informationen zur Reifengröße angezeigt. Zusätzlich wurden die Preislogik für Vans sowie die an die Generierung übermittelten Daten geprüft.

Bei der Produkterstellung bleibt die Formatierung der Produktbeschreibung erhalten. Das Blueprint-Banner zeigt bei der Erstellung und in der Ansicht keine Felder an, die nicht zum Blueprint gehören. Derselbe Produkt- bzw. Blueprint-Name kann in verschiedenen Divisionen angelegt werden, innerhalb einer einzelnen Division muss der Name dagegen eindeutig sein.

Auch die Zahlungsarten in der Preisversion wurden überarbeitet. Angezeigt werden nur die Zahlungsmethoden, die in den Markteinstellungen aktiviert sind, jeweils für Passenger Cars und Vans mit Vorauszahlung (Pre Payment) und Nachzahlung (Post Payment). Pre Payment und Post Payment sind visuell voneinander unterscheidbar. Mindestens eine Zahlungsmethode muss ausgewählt werden. Sind ausschließlich Post-Payment-Methoden ausgewählt, stehen die Ratenoptionen weiterhin uneingeschränkt zur Verfügung. Sind ausschließlich Pre-Payment-Methoden ausgewählt, gelten Einschränkungen bei den Ratenoptionen.

Hinweis zum Stand: Die Automatisierung von Tests für die Produkterstellung in verschiedenen Vertragsvarianten und deren Anzeige im Vertragsvorschlag ist derzeit pausiert. Die Anforderung, dass bestimmte Sonderzeichen in allen Texteingabefeldern eingeschränkt werden müssen, ist noch offen. Hintergrund ist ein Fehler bei der Vertragserzeugung (Zahlungsdetails) mit dem Attribute Converter.

Für den Import der I131-Dateien aus Vega ist vorgesehen, dass oneSCM die Dateien aus einem neuen Berichtspfad bezieht und den Ländercode aus der Datei ausliest, da Vega eine Datei mit allen Märkten sendet.

Für Kampagnen wurden Weitergabe-Regeln im Zusammenhang mit der Vier-Augen-Freigabe und Änderungen an Produkt bzw. Preisversion beschrieben. Kampagnen, die weitergegebene Änderungen erhalten oder durch Duplizierung entstehen, müssen ihren Freigabe-Workflow zurücksetzen und vor der Aktivierung erneut eine Vier-Augen-Prüfung durchlaufen.