# Batch 315 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting: Optimierungen an den Datenprodukten**

Die Datenprodukte des Reportings wurden um mehrere Felder und Regeln erweitert, damit sie die fachlichen Anforderungen besser abbilden. Im Datenprodukt für Umsätze (Revenue) wurde das Feld „source_system_txt“ ergänzt. Gleichzeitig wurde es von der Kundentabelle (base_sc_cust_customer) in die Vertragstabelle (base_sc_cust_contract) verschoben. Der Wert „contingent_usage_pct“ wird nun auf zwei Nachkommastellen gerundet, damit er zu den übrigen numerischen Werten der Anwendung passt. Aus 66,6666666 wird somit 66.67 und aus 100 wird 100.00. Die Angabe „salesman_number_id“ wurde für alle Verträge im Datenprodukt Base ServiceContract entfernt.

Für Verträge aus oneSCM wird zudem das Feld „product_cd“ mit der in oneSCM erzeugten eindeutigen Produkt-ID des Vertrags befüllt, zum Beispiel PRO-28522. Bisher war das Feld „product_code_cd“ für oneSCM-Verträge leer und wird künftig diese Information enthalten. Für Altsysteme liegen die Werte in UDM und Datenprodukt bereits vor. Außerdem wurde im Vertragsmanagement-Service korrigiert, dass der Produkt-Branchenname fälschlich mit der Produktbeschreibung belegt wurde.

**Preisinformationen für MBD-Vans**

Für das Reporting zu MBD-Vans stehen jetzt der Vertragsnettopreis und der Vertragsnettopreis pro Kilometer zur Verfügung. In den UDMs heißen die Felder „contract_net_price“ und „contract_net_price_per_km“. Im Datenprodukt Revenue, Tabelle base_sc_revenue_contract, heißen sie „contract_net_price_amt“ und „contract_net_price_per_km_amt“. Bei den Altsystemen stammt der Vertragsnettopreis aus den Bestandsberichten von ICON und Asset (Feld „CustomerNetPrice2“; Sirius ist nicht betroffen). Der Nettopreis pro Kilometer stammt aus dem DDECost-Bericht von ICON, Asset und Sirius (Feld „realPriceCentPerMile“). Aus oneSCM wird der Nettopreis pro Kilometer nicht geliefert.

**Währungsinformationen**

In allen Datenproduktfeldern mit Währungswerten, bei denen bislang die Angabe der Währungsart fehlte, wird diese nun ergänzt. Die Währungsart wird marktspezifisch bereitgestellt. Das erleichtert die Einordnung der verwendeten Währung sowie Berechnungen und Umrechnungen.

**Schadenspositionen**

Für Schadenspositionen wurde das Feld „time_unit_txt“ in „indicator_hours“ umbenannt. Das gilt für das UDM (<mkt>_refined_damage_position) und für die Datenprodukte base_sc_cost_damage_position sowie base_sc_cost_van_damage_position. Aus oneSCM wird der Wert als Zahl über das Kafka-Topic „cost_reporting“ geliefert. Der Reporting-Service ordnet ihn einer lesbaren Bezeichnung zu: 1 steht für „tenth of hour“ und 2 für „AW“. In den Altsystemen liegt der Wert bereits als Text vor und ist nur für Arbeitsleistungen (damage_position_type_pk = 11) gefüllt.

**Weitere Korrekturen**

Die Lösch-Logik für Umsatz- und Kostendaten wurde korrigiert, und der Transformationsjob für Vertrags-Deltas behandelt Löschfälle jetzt korrekt. Behoben wurden außerdem Sicherheitsbefunde in der Entwicklungsumgebung, ein Deserialisierungsfehler bei einem nicht numerischen Textwert in einem Zahlenfeld sowie ein Problem, bei dem das Feld „annual_vehicle_mileage_txt“ für Altsystem-Verträge nicht für alle Verträge passte.

Die Validierung der Trennung von Batch-Jobs ist noch offen und noch nicht abgeschlossen.