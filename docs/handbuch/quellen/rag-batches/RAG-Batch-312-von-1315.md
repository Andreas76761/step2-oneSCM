# Batch 312 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting: Neuerungen und Änderungen**

Für das Reporting von MBD Vans steht künftig eine detaillierte Preisinformation zur Verfügung. Bisher stellte das Datenprodukt „SC Base Contract" nur wenige Preisangaben bereit, etwa den monatlichen Nettopreis des Vertrags (contractMonthlyNetPrice) und den gesamten Vertragsnettopreis (contract_net_price). Mit dem neuen Datenprodukt „SC_Price_Details" im partitionierten Iceberg-Format werden die Preisdaten nun deutlich differenzierter bereitgestellt. Für jedes Paar aus Gesamtpreis und Intervallpreis wird dabei ein eigener Datensatz angelegt. Die Daten stammen ausschließlich aus OneSCM; für Legacy-Verträge gibt es keine Änderungen und die Informationen sind dort nicht verfügbar. Die Feldnamen orientieren sich an den aus OneSCM gelieferten Namen, folgen aber den AQUA-Namenskonventionen. Währungswerte werden beispielsweise mit der Endung „_amt" bezeichnet und im AQUA-Format dargestellt, also mit Komma als Dezimaltrennzeichen und zwei Nachkommastellen.

Das Datenprodukt „SC_Price_Details" besteht aus zwei Tabellen. Die Tabelle „SC_Price_Details_Components" enthält folgende Angaben: AQ-Ländercode, ISO-Ländercode, SC-Nummer, Legal Entity Division, FIN, VIN, Vertragsstatus, Preisversionsdatum, Preisversion, Preisversionstyp (zum Beispiel Contract Sales, Prolongation 1 oder Prolongation 2), Preiscluster, Kategorie, Preiskomponente, Komponentencode (sofern für die Preiskomponente vorhanden, beispielsweise der Coverage-Code P001), Gesamtpreis, Intervallpreis und Währung.

Die Tabelle „SC_Price_Details_Per_KM" enthält den AQ-Ländercode, die SC-Nummer, die Legal Entity Division, FIN, VIN, Vertragsstatus, Preisversionsdatum, Preisversion, Preisversionstyp, Preiscluster, Preiskomponente sowie Netto- und Bruttopreis und die Währung.

Die bereitgestellten Daten sollen aktuell, vollständig und konsistent sein und dem definierten Format der Attributliste entsprechen. Die Dokumentation des Datenprodukts, des UDM und des Mappings spiegelt die aktuelle Umsetzung wider.

Auch im Revenue-Datenprodukt gab es eine Anpassung: Das Feld „payment_interval_txt" ist nun zusätzlich in der Vertragstabelle enthalten, da sich die bisherige Darstellung dieses Feldes als missverständlich erwiesen hatte.

Für die Basis-Datenprodukte wurde außerdem eine zweite Ausführung der Jobs eingerichtet, die den Anforderungen von COPRA entspricht. Sie läuft jeweils am Ersten eines Monats um 6:00 Uhr UTC und gilt ausschließlich für Basis-Datenprodukte.

Im Bereich Nemesis wurde der ETL-Flow für die Aufnahme des Marktes Tschechien (CZ) angepasst. Dazu wurden die Konfigurationen der entsprechenden Lambda-Funktion ergänzt, Datenkatalog-Tabellen für CZ in den Datenbanken „sirius_raw" und „sc_db" angelegt, die Lookup-Tabelle für Märkte um CZ für Financials erweitert und der initiale Ladevorgang für den CZ-Markt ausgeführt und getestet. Zudem wurde ein Fehler im Nemesis-Datenprodukt-Job behoben, der bei der Funktion „segregate_market" aufgetreten war.

Für Testzwecke wurde ein anonymisierter Testdatensatz des Costing-Reports für jeden Legacy-Markt erstellt und in die UDM-INT-Umgebung geladen. Dabei wurde mindestens ein Datensatz je benötigter Datei und Markt berücksichtigt; die DE-Daten stammen aus OneSCM Pre-PROD. Anschließend wurde der Job zur Erstellung der Basis-Datenprodukte auf INT gestartet. Der Testdatensatz liegt zur Wiederverwendung auf SharePoint bereit.

Noch offen ist ein End-to-End-Testplan zur Validierung von Delta-Updates in Datenprodukten, der unter anderem die Datenprodukte ISP und SC Financials betrifft.