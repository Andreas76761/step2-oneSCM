# Batch 311 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 6 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting – Erweiterungen der Data Products**

Das Data Product für Kostenrechnungen (base_sc_cost_invoice) wurde für MBD Vans um zusätzliche Angaben zur Referenz auf die Kennung des externen Systems erweitert. Die neue Spalte heißt workshop_invoice_num_pk und steht in der Tabelle base_sc_cost_invoice zur Verfügung. Für Altsysteme stammt der Wert aus dem Feld „externalid_txt" der Quelle refined_invoice, wo die Information im UDM bereits vorhanden ist. Für oneSCM wird das Feld „externalid_txt", das im UDM bereits existiert, über ein Abhängigkeitsticket an das Team für Kosten- und Erlösermittlung bezogen. Die Daten stehen sowohl aus den Altanwendungen als auch aus oneSCM zur Verfügung.

Im Revenue Data Product (base_sc_revenue_contract) wurden für MBD Vans weitere Details zu Verkaufsprovisionen ergänzt. Dazu wurde die neue Spalte sales_commissn_amt sowohl im UDM als auch im Data Product eingeführt. Der Wert stammt aus oneSCM aus dem Feld contractNetSalesCommission. Die Verkaufsprovision wird nur beim Vertragsverkauf vergeben, nicht bei einer Prolongation, bei der keine neue Provision an den Verkäufer gezahlt wird. Im Data Product ist die Provision über alle Preisversionen hinweg sichtbar: Der beim Vertragsverkauf festgelegte Provisionswert wird bei einer Prolongation für alle Preisversionen übernommen.

Außerdem wurde die Tabelle base_sc_revenue_invoice überarbeitet. Das bestehende Feld invoice_flow_type_cd enthielt bisher die Rechnungsart. Diese Information steht nun im neuen Feld invoice_type_cd, das im UDM und im Data Product angelegt wurde. Im Feld invoice_flow_type_cd wird künftig die tatsächliche Rechnungsflussart angezeigt, die aus oneSCM bezogen wird. Dieses Feld ist nur für oneSCM-Verträge relevant und bleibt für Altsysteme leer. Nach der Umsetzung und dem Neuladen der Daten wurde der bisherige Inhalt von invoice_flow_type_cd in invoice_type_cd überführt. Das Mapping-Dokument wurde entsprechend aktualisiert.

Für Informationen zu Subventionen bei MBD Vans wurde die Tabelle base_sc_revenue_contract um mehrere Spalten ergänzt, jeweils mit entsprechenden UDMs für alle Märkte:

Die Spalte sales_discount_amt enthält alle verkaufsbezogenen Subventionen. Für Altsysteme ist sie die Summe aus „planned_sales_discount" und „planned_subsidy_discount_sales" aus den Inventory Reports. Aus oneSCM wird der Wert „campaignDiscount" über ein Abhängigkeitsticket bezogen.

Die Spalte dealer_discount_amt enthält händlerbezogene Subventionen. Für Altsysteme wird das Feld „planned_dealer_discount" der Inventory Reports verwendet, aus oneSCM der Wert „dealerDiscount".

Die Spalte after_sales_discount_amt enthält Aftersales-Rabatte und gilt nur für Altsysteme. Sie ergibt sich aus der Summe von „planned_after_sales_discount" und „planned_subsidy_discount_after_sales" aus den Inventory Reports. Für oneSCM ist sie nicht relevant.

Die Spalte special_case_discount_amt enthält Sonderfallrabatte und gilt nur für oneSCM. Der Wert stammt aus dem Feld „SpecialCaseDiscount" und wird über ein Abhängigkeitsticket bezogen. Für Altsysteme ist sie nicht relevant.

Die Spalte total_list_price_amt ergibt sich aus dem bereits vorhandenen Nettopreis („contract_net_price_amt") zuzüglich aller genannten Rabatte.

Bei mehreren Preisversionen eines Vertragsverkaufs, etwa bei Prolongation 1 und Prolongation 2, enthält die jeweils neueste Preisversion die aktuellen Rabattwerte. Im Reporting ist daher keine zusätzliche Summierung über mehrere Preisversionen erforderlich.

Für alle Erweiterungen gilt, dass die Daten aktuell, vollständig und konsistent im definierten Format vorliegen und die Dokumentation von Data Product, UDM und Mapping den aktuellen Stand widerspiegelt.

Im Bereich DevOps wurde die Benachrichtigung per E-Mail verbessert. Bisher musste für den Erhalt von E-Mail-Benachrichtigungen zwingend ein Abonnement eingerichtet werden. Dies ist nicht mehr erforderlich: Benachrichtigungen bei Deployments werden an die konfigurierte Verteilerliste (dw_002_SC-Reporting) gesendet.