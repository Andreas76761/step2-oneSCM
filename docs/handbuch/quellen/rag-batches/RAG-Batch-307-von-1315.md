# Batch 307 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting: Neuerungen und Anpassungen**

**DSGVO-Behandlung für Altverträge (Legacy)**
Bisher war die DSGVO-konforme Löschung für alle Base-Data-Produkte nur für Daten aus oneSCM umgesetzt. Künftig werden auch Altverträge aus Legacy-Systemen berücksichtigt. Verträge, die ein bestimmtes Zeitfenster nach ihrem Vertragsende überschritten haben, werden nicht mehr in das UDM importiert. Maßgeblich ist das tatsächliche Vertragsende (Real End Date). Die Dauer der Frist richtet sich nach dem Markt: Für Deutschland sind es beispielsweise mehr als 10 Jahre nach Vertragsende, für Spanien bei Pkw und Vans 20 Jahre. Die Frist wird jeweils bis zum Jahresende des Vertragsendes gerechnet. Endet ein Vertrag zum Beispiel am 2. Juli 2016, wird er zum 1. Januar 2027 für die DSGVO-Bereinigung relevant.

Die Fristen je Markt und Sparte werden in einer Enum-Tabelle hinterlegt, die beim Import der jeweiligen Marktdaten verwendet wird. Der Wert gilt einheitlich für alle Legacy-Systeme; oneSCM besitzt ein eigenes Regelwerk. Ist ein Markt in dieser Liste nicht gepflegt, werden alle Verträge dieses Marktes importiert. Die Regelung gilt für alle Datenprodukte mit Ausnahme von ISP. Ziel ist, dass Daten von Legacy-Verträgen im Sinne der DSGVO aus dem UDM und allen Datenprodukten ausgeschlossen werden.

**Neues Feld „expiry_criterion“**
Das Datenprodukt „Base Service Contracts Data“ enthält Daten sowohl aus Legacy-Systemen als auch aus oneSCM. Es wird um das Feld „expiry_criterion“ (Ablaufkriterium) erweitert. Bei Legacy-Verträgen wird es anhand des Beendigungsstatus gemäß einer Mapping-Tabelle befüllt. Mögliche Werte sind „contingent“, „time“ sowie „time or mileage“. Für oneSCM-Verträge wird das Feld aus oneSCM bezogen.

**Weitere Felder aus oneSCM**
Zur Erweiterung der bestehenden Datenprodukte wurden zusätzliche Felder aus oneSCM für die Tabelle „base_service_contracts“ vorgesehen: die E-Mail-Adresse des Verkäufers, die User-ID des Verkäufers und das Ablaufkriterium. Verkäufer-E-Mail und Verkäufer-User-ID sind für Legacy-Verträge nicht relevant, die Daten stehen nur für oneSCM-Verträge zur Verfügung. Die User-ID des Verkäufers soll im bereits bestehenden Feld „salesman_number_id“ des Datenprodukts und des UDM bereitgestellt werden. Aus diesem Grund wurde die zuvor angeforderte Entfernung dieses Feldes im Vertrags-Datenprodukt rückgängig gemacht. Das Feld wird künftig die neue Verkäufer-User-ID aus oneSCM enthalten, die mit PI15 erwartet wird.

**Kosten-Datenprodukt im Iceberg-Format**
Bisher waren ASSET-Märkte bei der Erstellung des Kosten-Datenprodukts im Iceberg-Format ausgeschlossen. Da ASSET Schäden künftig mit eindeutiger Kennung liefert, wurde dieser Ausschluss entfernt. ASSET-Märkte werden nun bei der Erstellung berücksichtigt.

**Bereitschaft für Markteinführungen**
oneSCM ist derzeit in Deutschland produktiv. Damit die Reporting-Module bei weiteren Markteinführungen Schritt halten, wurden sie auf neue Märkte vorbereitet, zunächst für die geplanten Einführungen in der Slowakei und in Indien. Dazu wurden das DCS verallgemeinert sowie der Reporting Service und die ETL-Prozesse angepasst. Für jeden neuen Markt stehen das UDM und die Datenprodukte mit den entsprechenden Daten zur Verfügung, und die Infrastruktur unterstützt den Markt.

**Testunterstützung**
Für Testzwecke auf der INT-Umgebung wurden Dateien anonymisiert und den zuständigen Personen bereitgestellt.