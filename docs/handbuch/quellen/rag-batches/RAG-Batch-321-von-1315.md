# Batch 321 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 14 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting – Neuerungen und Verbesserungen**

Im Bereich Reporting wurden mehrere Verbesserungen umgesetzt, die vor allem die Stabilität, die Datenqualität und die Sicherheit der Berichtsdaten betreffen.

**Verarbeitung großer Datenmengen**

Alle Datenflüsse wurden überarbeitet, damit sie auch sehr große Datenmengen zuverlässig verarbeiten. Der Data Capture Service bezieht seine Daten auf zwei Wegen: Stammdaten zu Verträgen, Kunden, Erlösen und Kosten kommen über Kafka-Ereignisse, die Daten für ISP und Nemesis/Financials über S3-Dateien. Bei sehr großen Datenmengen, etwa fünf Millionen Datensätzen im ISP-Fluss, kam es zu Verbindungsabbrüchen. Dasselbe galt für den Reporting-Service, der die Daten seitenweise vom Data Capture Service abruft, daraus eine CSV-Datei für das Reporting in AWS erzeugt und die exportierten Datensätze anschließend per Schnittstellenaufruf als exportiert markiert. Auch diese synchrone Aktualisierung verursachte bei großen Mengen Probleme. Ziel war, dass alle Flüsse in beiden Services Mengen in der Größenordnung von fünf Millionen Datensätzen ohne Störungen verarbeiten können. Dies wurde speziell für die ISP-Verarbeitung sowohl im Data Capture Service als auch im Reporting-Service umgesetzt.

**Datenschutz (DSGVO)**

Wird ein Vertrag aktiviert, erhält der Data Capture Service die Vertrags- und Kundendaten per Kafka-Nachricht. Wechselt der Vertrag in den Status „storniert", wird auch diese Änderung übermittelt. Wurden stornierte Verträge jedoch aufgrund der DSGVO gelöscht, erfuhr das Reporting davon bisher nichts. Damit das Reporting stets mit den Daten in oneSCM übereinstimmt, werden solche Verträge nun auch auf der Reporting-Seite gelöscht.

**Sicherheit**

Die Reporting-Module wurden auf Schwachstellen untersucht, die das Tool Black Duck in den Code-Repositories gemeldet hat. Zunächst wurden die als kritisch und hoch eingestuften Schwachstellen behandelt. Dies schloss auch das Glue-Repository ein.

**Dokumentation**

Die Anwendungsdokumentation für das Reporting wurde erstellt. Sie umfasst Everybook, Playbook sowie die Zuständigkeiten von Owner und Stellvertreter. Zusätzlich wurde die Dokumentation des C4-Diagramms gewünscht.

**Verbesserungen am ISP Data Product**

Die Divisions-Zuordnung für das ISP Data Product wurde anhand einer bereitgestellten Liste aktualisiert. Die Aktualisierung sollte vor dem vollständigen Ladevorgang I131 bereitgestellt werden, damit alle relevanten Modellreihen-Codes berücksichtigt werden. Außerdem wurden Fehler bei den Länderangaben (aq_country_cd) sowie bei Kilometerstand und Kilometerstandsindikator korrigiert. Ein Vorhaben, Busse und Lkw vom ISP Data Product auszuschließen, wurde nicht weiterverfolgt und abgebrochen.

**Weitere Datenkorrekturen**

Für deutsche Verträge, die ohne Rechnungsempfängernummer (invoice_recipnt_number_id) vorlagen, wurde eine Korrektur umgesetzt. Ebenso wurde die zuvor leere Branchenbeschreibung im Data Product „Base Service Contracts" behoben, und der fehlerhafte Inhalt der Produktbranchenbeschreibung für den deutschen Markt wurde korrigiert.

**Branchencodes in den Data Products**

Für allgemeine Auswertungen nach Branchen steht der Inhalt des UDM-Felds product_industry_cd nun in den Basis-Data-Products als neues Feld „product_industry_code_cd" zur Verfügung. Es wurde in die Data Products SC Base Contracts, SC Base Revenue, SC Base Cost und SC Base Van Cost aufgenommen. Für SIRIUS wird der Branchencode über eine Zuordnung anhand der Beschreibung (product_industry_description_txt) mithilfe einer Mapping-Datei ermittelt. Für oneSCM wird die Übernahme des Branchencodes ins UDM umgesetzt. Die Daten stehen sowohl aus den Altanwendungen als auch aus oneSCM aktuell, vollständig und konsistent im definierten Format zur Verfügung. Die Dokumentation der Data Products, des UDM und der Zuordnung entspricht der aktuellen Umsetzung.