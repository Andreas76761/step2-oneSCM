# Batch 281 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Sammelrechnungslogik im Revenue Management**

Im Rahmen des Ausgangsdateiexports E169 an das Finanzsystem NACOS werden Rechnungen, die in oneSCM erstellt wurden und sich im Status „Accepted“ befinden, für die Übertragung an NACOS freigegeben. Die Übertragung erfolgt in der Exportdatei E169 mit dem Dateinamen E169EXP_YYYYMMDD_HHmmSS.dat. Dabei kann es Fälle geben, in denen mehrere Rechnungen eines Kunden bzw. Zahlers zu einer virtuellen Sammelrechnung zusammengefasst werden, die anschließend auf Seite des Buchhaltungssystems NACOS verarbeitet wird.

Ist für einen Kunden keine Sammelrechnung vorgesehen, erhält er für jeden in oneSCM erzeugten Erlös eine eigene Rechnung. Hat ein Kunde beispielsweise drei Verträge, für die insgesamt vier Rechnungen erstellt wurden, werden entsprechend vier einzelne Rechnungen übermittelt.

Ist dagegen eine Sammelrechnung auf Kundenebene eingerichtet, werden die Rechnungen eines Kunden über alle seine Verträge hinweg zusammengefasst. Besitzt der Kunde etwa drei Verträge, wobei der erste Vertrag zwei Erlöse, der zweite Vertrag einen Erlös und der dritte Vertrag zwei Erlöse enthält, so werden alle diese Rechnungen als eine einzige Rechnung an NACOS gesendet.

Die Gruppierung richtet sich zusätzlich nach der Kundenrechnungsdefinition (customerInvoiceDefinition). Sind bei demselben Kunden sowohl Erlöse vom Typ MPPI als auch vom Typ MANU vorhanden, werden trotz des identischen Kunden zwei Verarbeitungsnummern gebildet: eine für alle MPPI-Erlöse und eine für alle MANU-Erlöse. Dies gilt auch dann, wenn die Erlöse unterschiedlich auf die Verträge verteilt sind, zum Beispiel wenn der erste Vertrag je einen Erlös MANU und MPPI, der zweite Vertrag einen Erlös MPPI und der dritte Vertrag je einen Erlös MPPI und MANU enthält.

Werden außerdem Belastungen und Gutschriften verarbeitet, wird neben der Kundenrechnungsdefinition auch die Finanzdokumentdefinition (financialDocumentDefinition) berücksichtigt, also die Unterscheidung zwischen Rechnung und Gutschrift. Enthält der dritte Vertrag in diesem Beispiel eine MPPI-Belastung und eine MANU-Gutschrift, entstehen drei Verarbeitungsnummern: eine für alle MPPI-Erlöse, eine für die MANU-Erlöse vom Typ Rechnung und eine für die MANU-Erlöse vom Typ Gutschrift.