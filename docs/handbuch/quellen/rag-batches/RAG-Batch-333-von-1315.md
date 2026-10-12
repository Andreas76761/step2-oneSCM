# Batch 333 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 49 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reporting: Verbesserungen am ETL-Workflow**

Der bestehende ETL-Workflow wurde weiterentwickelt, um außergewöhnliche Szenarien besser zu behandeln und aussagekräftigere Informationen zu Jobläufen und Fehlern bereitzustellen. Dazu gehört, dass die laufenden Jobs überwacht und ihre Laufparameter, etwa die DPU-Einstellungen, optimiert werden, um Fehler wegen Überschreitung der maximalen DPU-Nutzung zu vermeiden. Zusammengehörige Jobs eines Laufzyklus zur Erstellung von Datenprodukten lassen sich über eine Trace-ID durchgängig nachverfolgen. Jeder Fehler wird mit einer eigenen Protokollmeldung samt Fehlergrund erfasst. Bei Fehlern in Glue- und Lambda-Jobs werden Fehler- bzw. Warnmeldungen zusammen mit einem Stack-Trace protokolliert, und die bereits vorhandenen Protokollmeldungen wurden auf Korrektheit geprüft. Außerdem werden Logs erstellt, mit denen sich die Nutzung der Datenprodukte durch Plattformen wie DDX/AQUA und andere Konsumenten analysieren lässt. Zusätzlich wurde die Lambda-Funktion für ECS-Statusänderungen verbessert.

**ISP-Codes in der Fahrzeugverwaltung**

Neu eingeführt wurde die Verwaltung von ISP-Codes. Anwender können eine Vorlage herunterladen, die ähnlich aufgebaut ist wie die Vorlage für die Preismatrix. Die ausgefüllte Vorlage wird anschließend wieder hochgeladen und befüllt die ISP-Code-Tabelle. Bei jedem Upload werden sämtliche vorhandenen Daten der Tabelle ersetzt; der Upload erfolgt marktspezifisch. Die hinterlegten ISP-Codes können seitenweise abgerufen werden, standardmäßig aufsteigend nach der Baureihe (SERIES) sortiert. Die Tabelle wird, ähnlich wie bei den Motorbaureihen, über das Feld „Series“ mit dem Fahrzeugtyp verknüpft (viele-zu-viele).

Ergänzend wird in der Fahrzeuginformation hinterlegt, ob für ein Fahrzeug ein ISP-Code vorhanden ist (ja/nein). Grundlage ist die Vega-Datei i131, die über S3 bereitgestellt wird; ein Trigger informiert das System über einen neuen Upload. Der Import erfolgt zunächst nur für Deutschland (Ländercode „20.000“). Die Zuordnung erfolgt über die FIN. Die Datei i131 wird einmal wöchentlich sonntags um 22 Uhr deutscher Zeit erzeugt und soll danach importiert werden.

**Auswirkungen auf Fahrzeuggruppen und verfügbare Produkte**

Die Filterkriterien und die Sortierung von Fahrzeuggruppen berücksichtigen nun den ISP-Code, der mit dem Fahrzeugtyp verknüpft ist (wahr oder falsch). Wird beim Anlegen eines Clusters eine Fahrzeuggruppe mit ISP-Code-Filter gewählt, werden zusätzliche Informationen aus der ISP-Tabelle angezeigt. Dies gilt auch für alle Fahrzeuggruppen im Auswahlmenü der noch nicht zugeordneten Gruppen.

Bei den verfügbaren Produkten zeigt die Fahrzeugverwaltung zusätzlich an, ob ISP enthalten ist. Für eine über den Vertrag übermittelte VIN/FIN lauten die Aussagen „Fahrzeug hat“ (ISP-Code in den Fahrzeuginformationen vorhanden), „hat nicht“ (weder in den Fahrzeuginformationen noch in der neuen ISP-Tabelle) oder „ISP-Enthalten-Sein ist nicht genau bestimmbar“ (nicht in den Fahrzeuginformationen, aber in der ISP-Code-Tabelle gefunden). Für Bestellnummer, Baumuster oder Deal-ID sind nur „hat nicht“ und „nicht genau bestimmbar“ vorgesehen; diese Zuordnung ist noch in Umsetzung.

**Vertragskalkulation: Preise und Hinweise**

In der Preisansicht werden Cluster mit einem Warnhinweis gekennzeichnet, wenn sie optionale Deckungen enthalten, für die kein Preis konfiguriert ist. Warnsymbole erscheinen an allen betroffenen Clustern, im Reiter „Optionale Deckungen“ sowie an den jeweils betroffenen Deckungen; ein Warnhinweis-Dialog ergänzt dies. Die Bearbeitung von Preisen wurde für Kostendefinition, Abhängigkeitsdefinition und TA-Klassifizierung erweitert. Bearbeitbar sind nur zukünftige Preise, vergangene und aktuelle Preise sind gesperrt. Außerdem wurde die Schnittstelle zur Vertragsverlängerung um optionale Deckungscodes erweitert.

**Hinweis zum Stand**

Nicht umgesetzt wurden unter anderem eine Schnittstelle zur Preisberechnung pro Kilometer, eine detailliertere Preisberechnung (Basispreis, Gebühren, Händlerprovision, optionale Preise) sowie die Bearbeitung von Deckungscodes aus dem Preismodell. Die Anbindung von OTR befindet sich noch im Backlog.