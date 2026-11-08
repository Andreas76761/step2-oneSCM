# Batch 988 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Branchenerfassung bei der Vertragserstellung für Gewerbekunden**

Bei der Vertragserstellung für Gewerbekunden kann nun die Branche erfasst werden. Die Branche beschreibt die Art des Geschäfts, für das ein Fahrzeug genutzt wird, zum Beispiel Milchtransport oder Krankenwagen. Sie wird auf Produktebene definiert, und die Preise der Produkte richten sich danach. Voraussetzung ist, dass Produkte mit Branchenzuordnung konfiguriert sind. Die Funktion gilt nur für Gewerbekunden und kann grundsätzlich für PKW und Vans genutzt werden; der aktuelle Umfang beschränkt sich auf PKW.

Im Modul Contract Generation wählen Händler- und MO-Benutzer unter „Contract Offering“ zunächst den Kundentyp „Commercial“. Daraufhin erscheint das neue Pflicht-Dropdown-Feld „Industry“ (Branche) mit dem Standardwert „Not Relevant“. Zur Auswahl stehen alle Branchen, die für den jeweiligen Markt gelten. Nach der Auswahl einer Branche wird die Produktliste auf die passenden Produkte begrenzt. Anschließend kann über die Eingabe eines Identifiers die Liste weiter gefiltert werden. Danach wählen Sie ein Produkt aus der Liste aus.

Auf der Seite mit den Produktdetails werden neben den Konfigurationsfeldern (Vertragslaufzeit, Jahreskilometerleistung, Zahlungsintervall) auch das Pflichtfeld „Industry“ angezeigt. Es ist mit der zuvor gewählten Branche vorbelegt. Das Dropdown enthält alle Branchen des Marktes. Branchen, die für das gewählte Produkt gelten, sind auswählbar, die übrigen sind deaktiviert. Die angezeigten Preise berücksichtigen alle getroffenen Auswahlen einschließlich der Branche; die berechneten Werte liefert Stream 1. Wird die Branche auf dieser Seite geändert, werden die Preise entsprechend aktualisiert. Soll eine Branche gewählt werden, die für das Produkt deaktiviert ist, muss zur ersten Seite zurückgekehrt und dort die passende Branche gewählt werden. Es wird dann die Liste der dazu passenden Produkte angezeigt, und der Prozess wird von dort fortgesetzt.

Die gewählte Branche erscheint außerdem auf der Seite „Overview and Confirmation“ im Abschnitt „Product Options“ als neues Feld „Industry“. Im Vertragsdokument wird sie im Produktbereich angezeigt (dies wird von Stream 4 umgesetzt). Im Status „Waiting for Confirmation“ finden Sie das Feld in der Vertragsdetailansicht auf dem Reiter „Contract“ (Umsetzung im Rahmen der Neuanordnung der Felder im Contract Management). Nach der Aktivierung wird die Branche auch in der Vertragsübersicht aktiver Verträge im Contract Management angezeigt.

Bei der Aktivierung des Vertrags wird die Schnittstellendatei i155 erzeugt. Der Branchencode wird dabei im Satz RC05 an den Positionen 266 bis 269 eingetragen. Wurde keine Branche gewählt, werden diese Positionen mit Leerzeichen gefüllt.

**Verarbeitung von Contingent-Produkten**

Händler, MO- und MPC-Benutzer können jetzt Serviceverträge für Contingent-Produkte erstellen und so Kunden ein breiteres Produktangebot machen. Bisher war für diese Produkte kein geplanter Endkilometerstand hinterlegt. Für Contingent-Produkte gilt nun: Der Kilometerstand bei Vertragsbeginn wird wie bei allen anderen Produkten erfasst. Der geplante Kilometerstand bei Vertragsende ist standardmäßig für alle Verträge auf 999.999 km gesetzt. Die Laufzeit entspricht der in der Produktkonfiguration gewählten Vertragslaufzeit.

Der Vertragsbeginn wird wie folgt bestimmt: Im Build-to-Stock-Ablauf und im Build-to-Order-Ablauf ist es das FRD. Liegen Fahrgestellnummer und FRD vor, gilt das Unterschriftsdatum (Verkaufsdatum).

Der geplante Endkilometerstand von 999.999 km wird in der Detailansicht in Contract Generation und Contract Management angezeigt. Er fließt zusammen mit dem Kilometerstand bei Vertragsbeginn in die Erzeugung der i155 ein. Ohne geplanten Endkilometerstand könnte die i155 nicht erzeugt werden.

**Optimierung der Vertragserstellung**

Zusätzlich wurde der Programmcode der Vertragserstellung überarbeitet und verbessert. Für Anwender ergeben sich daraus keine beschriebenen Änderungen in der Bedienung.