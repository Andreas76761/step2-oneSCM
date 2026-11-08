# Batch 324 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 7 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting: Optimierungen an Infrastruktur und ETL-Workflow**

Die Workflows für die Infrastruktur als Code (IaC) wurden im Rahmen des Reportings weiter optimiert. Der Datadog Forwarder für Glue und Lambda verwendet nun ein Filtermuster, sodass nur noch Logs weitergeleitet werden, die von der Anwendung selbst erzeugt wurden. Das Datadog-Dashboard wurde überarbeitet und zeigt die Metriken von Glue und Lambda verbessert an. Die Ressourcen für DynamoDB und den Datacatalog lassen sich jetzt anlegen, ohne dass sie zuvor zerstört werden müssen. Außerdem werden Logs erzeugt, mit denen sich die Nutzung der Data Products durch Plattformen wie DDX/AQUA und andere Konsumenten analysieren lässt.

Auch die Qualitätssicherung wurde verschärft. Die Continuous-Validation-Pipeline erzwingt die Validierungen nun, statt sie zu überspringen. Für den Terraform-Code werden Qualitätsregeln (Terraform-Format) sowie ein Terraform-Linting durchgesetzt. Der Lambda Layer wird nur noch in einer einzigen Kopie im Glue-Repository gepflegt; der IaC-Workflow verweist darauf, statt eine eigene Kopie zu führen.

Der bestehende ETL-Workflow wurde um weitere Funktionen ergänzt. Die Daten werden zwischen den Quell- und Ziel-Glue-Jobs auf Vollständigkeit geprüft. Alle Lambda-Funktionsnamen erfüllen in sämtlichen Umgebungen die Längenvorgabe von maximal 64 Zeichen. Die Partnertypen sind im Unified Data Model (UDM) für alle Systeme einschließlich oneSCM vereinheitlicht. Zeilenumbruchzeichen (CRLF) in den Daten von Altmärkten werden korrekt behandelt, sodass die betroffenen Datensätze verarbeitet werden und im Data Product vollständig zur Verfügung stehen.

Darüber hinaus wurde ein im Reporting fehlendes Feld, sc_type_vega_cd, nachgetragen.

**Nicht umgesetzte Vorhaben**

Folgende Vorhaben wurden abgebrochen und sind daher nicht Bestandteil des Release: ein Batch, der alle Vertragsdaten-Ereignisse gebündelt versendet, die Umstellung der Feldwerte von „VAN_Car“ auf „VAN“, zusätzliche Base Data Products für MBD Van sowie die Erweiterung der Datenqualitätsregeln im Unified Data Model.