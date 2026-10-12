# Batch 322 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting: Erweiterungen und neue Datenprodukte**

Die bestehenden Datenprodukte im Reporting wurden erweitert und angepasst. Im Datenprodukt für Verträge steht nun das Attribut für die jährliche Fahrzeuglaufleistung (annual_vehicle_mileage_num) zur Verfügung. In den Datenprodukten für Kosten und Van-Kosten wurde das Attribut ws_invoice_type_cd in den jeweiligen Rechnungstabellen (base_sc_cost_invoice bzw. base_sc_cost_van_invoice) ergänzt.

Die Anonymisierungsregel für die Felder invoice_recipnt_txt und invoice_recipnt_number_id wurde angepasst. Der Inhalt "anonymous" wird für alle Kunden-Umsatz-Kombinationen ausgegeben, bei denen der Partnertyp (partner_type_txt) nicht "Commercial customer" lautet und der Rechnungsflusstyp (invoice_flow_type_cd) weder "CAMPAIGN_DISCOUNT" noch "EXTERNAL_DEALER_DISCOUNT" ist.

Im Datenprodukt SC Financials wird das Attribut aq_veh_model_series_cd, sofern es nicht aus der Nemesis-Datei vorliegt, aus der Fahrgestellnummer abgeleitet. Ist die FIN gefüllt, werden die ersten drei Stellen nach dem WHC verwendet. Ist die FIN leer, die Chassis Number aber gefüllt und sind die ersten drei Stellen nach dem WHC Ziffern, werden diese herangezogen. In allen anderen Fällen wird NULL geliefert. Das Attribut baureihe wurde in model_series_txt umbenannt. Die Dokumentation des UDM bzw. des Mappings sowie die Beschreibungen der Datenprodukte wurden entsprechend aktualisiert.

**Neues Kunden-Datenprodukt "Base SC Customer"**

Um den Zugriff auf kundenbezogene Daten besser steuern zu können, wurde ein neues Datenprodukt "Base SC Customer" geschaffen. Es basiert auf den vorhandenen Serviceverträgen und stellt Kundendaten, analog zu den anderen Base-Datenprodukten, auf Basis von Markt-Vertrags-Kombinationen bereit. Dafür gibt es zwei Tabellen: eine mit vertragsbezogenen Daten und eine mit Kundendetails. Im UDM wurden die Felder cust_number_mme_id, cust_number_vat_id und cust_mail_txt neu aufgenommen.

Das Datenprodukt enthält aktuelle, vollständige (aktuelle und alle vergangenen Perioden) und konsistente Daten zu allen vorhandenen Serviceverträgen aus oneSCM und den SC-Legacy-Anwendungen, und zwar in einer einzigen Einheit für alle Märkte und Geschäftsbereiche. Es wird wie die übrigen Base-Datenprodukte in einem S3-Bucket und im gleichen Datenformat bereitgestellt. Die Erstellung bzw. Aktualisierung ist mit den Update-Jobs der anderen Base-Datenprodukte abgestimmt. Bei Fehlern oder Teilläufen erfolgt eine Benachrichtigung, eine Fehlerbehandlung verhindert inkonsistente oder fehlende Daten, und nach erfolgreicher Erstellung wird ein Backup angelegt, aus dem das Datenprodukt im Fehlerfall wiederhergestellt werden kann. Die UDM-Dokumentation wurde entsprechend aktualisiert.

**Inkrementelle Aktualisierung**

Bisher führte der ETL-Prozess der Datenprodukte bei jedem Joblauf einen vollständigen Ladevorgang durch. Dieser wurde für die letzte Schicht der Datenproduktbildung und für alle Datenquellen (Legacy und oneSCM) durch Delta-Updates ersetzt, sodass nur noch Änderungen verarbeitet werden. Dies betrifft die Datenprodukte SC Base Contract, SC Base Cost und SC Base Revenue. Für das Kunden-Datenprodukt wird die inkrementelle Umsetzung in einem separaten Epic nachgezogen, da der zugehörige Glue-Job noch nicht erstellt war.

**Getrennte Batch-Jobs**

Der Batch-Scheduler ReportingDataProducts löste bisher alle Datenprodukt-Jobs gemeinsam aus, also die Base-Datenprodukte für Vertrag, Kosten, Van-Kosten und Umsatz sowie ISP und SC Financials. Nun gibt es getrennte Scheduler: Der bestehende Scheduler bedient die Base-Datenprodukte, ISP und SC Financials haben jeweils einen eigenen Scheduler. Die Funktion function_dp_from_udm.py wurde angepasst, damit sie die unterschiedlichen Payloads verarbeitet und das jeweils passende Datenprodukt startet. Der Auto Scheduler kann Base-Datenprodukte, ISP und SC Financials unabhängig voneinander mit eigenen Zeitplänen anstoßen; zunächst gelten für alle denselben Zeitplan.

**Weitere Korrekturen**

Außerdem wurden verschiedene Fehler behoben: Für die DHCPO-Rolle wurde der Zugriff auf Tabellen des Data Catalog eingerichtet. Die Glue-YAML-Dateien für den ISP-Datenproduktjob und den Delta-ISP-Job wurden für die Integrations- und Produktivumgebung angepasst. Ein Problem mit fehlenden Verträgen im oneSCM-Reporting wurde behoben: Erwartet wurden 33 Verträge mit dem Quellsystem oneSCM, im Reporting erschienen jedoch nur 9. Zudem wurden ein Fehler beim Speichern von ISP-Datensätzen sowie ein Problem in der Funktion function_dp_from_udm für ISP korrigiert.

**Noch offen**

Die Validierung des durchgängigen Ablaufs für die Aufnahme einer Coverage-Tabelle mit Coverage- und Contingent-Informationen ist noch nicht abgeschlossen.