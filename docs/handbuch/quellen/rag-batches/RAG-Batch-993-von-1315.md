# Batch 993 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Bereinigung nicht aktivierter Verträge (DSGVO)**

Bisher konnten in oneSCM Verträge als Angebot angelegt werden, ohne dass sie anschließend aktiviert wurden. Solche Verträge blieben dadurch für unbestimmte Zeit im System. Damit alte und ungenutzte Angebote bereinigt, Kundendaten gelöscht und Vertragsnummern wieder vergeben werden können, gibt es nun eine automatische Bereinigung. Löschbar sind Verträge mit dem Status „Rejected“ oder „Cancelled“. Gründe für eine Löschung sind eine überschrittene Angebotsgültigkeit gemäß Market Config, eine manuelle Ablehnung durch den MO (zum Beispiel wegen Dokumentfehlern, abweichender Preise oder Kilometerangaben) sowie eine Stornierung auf Wunsch des Kunden.

In der Market Config steht dafür das neue numerische Feld „Deletion After“ zur Verfügung. Es legt fest, nach wie vielen Tagen ein Vertrag gelöscht werden kann. Die Löschung erfolgt über den neuen Batch Job „Delete Contracts“, der im Admin-Bereich verfügbar ist. Er lässt sich wie bestehende Batch Jobs aktivieren und deaktivieren und zeigt die Market ID sowie die letzte und die nächste Laufzeit (jeweils in UTC) an. Folgende Aktionen stehen zur Verfügung: „View“ zeigt die letzten fünf Logdateien an, „Run Now“ startet den Job sofort unabhängig vom Scheduler, „Schedule“ ermöglicht die Konfiguration automatischer Läufe, und „Disable“ deaktiviert den Job, sodass er nicht mehr ausgeführt wird. Der Job hält sich an die Scheduler-Einstellungen und führt die Löschungen in den festgelegten Intervallen aus.

Die Logdatei wird im CSV-Format erstellt. Sie enthält das Objekt (Proposal, wenn der Vertrag nie aktiviert wurde, bzw. Contract, wenn er aktiviert war), den Status „Deleted“ und das Vertragsende. Bei einem Proposal wird anstelle des Vertragsendes „-“ angezeigt. Nach der Löschung eines Vertrags werden Kunde und Partner informiert. Die Vertragsnummer kann nicht für ein neues Angebot wiederverwendet werden. Design und Grafiken folgen der Mercedes-Benz Workbench.

**Angebotsgültigkeit**

Für Verträge im Status „Created“ gilt nun eine Angebotsgültigkeit. Als Beispiel ist ein Zeitraum von 100 Tagen vorgesehen. Unterschreibt der Kunde den Vertrag nicht innerhalb dieses Zeitraums ab Erstellung, wird der Vertrag auf „Rejected“ gesetzt. Unterschreibt der Kunde innerhalb der Frist, wechselt der Vertrag auf „Waiting for Activation“. Schlagen Prüfungen fehl und erfolgt innerhalb der Frist kein Aktivierungsversuch, wird der Vertrag ebenfalls auf „Rejected“ gesetzt. Die Dauer der Gültigkeit ist je Markt konfigurierbar, zum Beispiel 100, 33 oder 1000 Tage. Eine Ausnahme bilden die Fälle Build to Order und Build to Stock: Hier bleibt der Status „Created“ gültig, bis FRD und Kennzeichen vorliegen, zuzüglich 30 Tage.

In der Contract Generation, in der Contract Detailed View, im Tab „Contract“, wird das neue Feld „Offer Validity“ angezeigt. Es enthält das Datum, bis zu dem das Angebot gültig ist, im Format TT.MM.JJJJ. In der Contract Management wird dieses Feld nicht angezeigt.

**Kunden-Tab für B2B**

Der Kunden-Tab war bisher auf B2C ausgerichtet, wo eine Person Halter und Zahler sein kann oder Halter und Zahler zwei verschiedene Personen sind. Für B2B wurde die Ansicht angepasst, sodass Händler und MO die relevanten Vertragsinformationen sehen. Dies gilt für Contract Generation und Contract Management. Der Kunden-Tab enthält zwei Unter-Tabs.

Der Unter-Tab „Company“ zeigt Kundentyp (zum Beispiel Commercial), Kundennummer, Kundenname und Vertragsrolle. Außerdem werden die Adresse (Straße, Adresszusatz, Hausnummer, Postleitzahl, Stadt, Land), die Kontaktdaten (Mobilnummer, Festnetznummer, E-Mail-Adresse) sowie VAT Classification, VAT ID und SAP-Debitorennummer angezeigt. Der Unter-Tab „Contact Person“ enthält Vorname, Nachname, Sprache, Rolle, Telefonnummer und E-Mail-Adresse.

**Offer Management: Spalten und erweiterte Filter**

Da die Seite „Offer Management“ nach dem Go-Live sehr viele Datensätze enthalten wird und auch B2B berücksichtigt ist, wurden die Spalten der Tabelle neu angeordnet, damit wichtige Informationen zuerst sichtbar sind. Der Zugang erfolgt über das Modul Contract Generation und dort über „Offer Management“. Die Spalten lauten nun: Contract Number, Product Name, Status, Offer validity, Chassis Number, License Plate, Customer Name, Created On, Created By und Actions. Die neue Spalte „Offer validity“ zeigt das Datum, bis zu dem der Vertrag zur Bestätigung weiterbearbeitet werden kann. Die Spalte „Actions“ unterstützt eine Sortierung der Datensätze.

Unter „More Filters“ war bisher nur der Status auswählbar. Zusätzlich stehen nun folgende Kriterien zur Verfügung: Customer Type als Dropdown mit den Werten „Private“ und „Commercial“, VAT ID, Offer Valid From bis Offer Valid Until als Datumsbereich, Contract Created From bis Contract Created To als Datumsbereich sowie Product Name. Die Filter lassen sich einzeln oder kombiniert verwenden, die Vertragsliste zeigt dann nur die passenden Datensätze an.