# Batch 1217 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 49 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Neuerungen und Änderungen**

**Preisgestaltung für Kontingentprodukte**
Anwender mit MPC-Berechtigung können Preise für Produkte pflegen, die als Kontingentprodukte konfiguriert sind, sodass Kunden diese erwerben können. Wird für ein Kontingentprodukt ein Cluster angelegt, erzeugt das System die Preismatrix automatisch anhand der im Produkt konfigurierten Kontingente. Für jede eindeutige Mindest- bzw. Höchstlaufzeit, die bei der Produktanlage definiert wurde, wird eine eigene Laufzeitspalte erstellt. Für jedes im Produkt definierte Kontingent wird eine Zeile angelegt. Eingaben sind nur in den Zellen zwischen der minimalen und der maximalen Laufzeit möglich; alle übrigen Zellen sind ausgegraut.

Alle weiteren Funktionen entsprechen denen anderer Cluster. Dazu gehören das Herunterladen und Hochladen der Preistabelle sowie die Verwendung von Preisfaktoren. Auch die Validierungen der Beträge in den Zellen sind identisch. Ein Beispiel für eine Preistabelle mit drei Kontingenten: zwei Services mit einer Vertragslaufzeit von mindestens 12 bis höchstens 24 Monaten, vier Services mit mindestens 24 bis höchstens 48 Monaten und sechs Services mit mindestens 60 bis höchstens 72 Monaten.

**BIC als Pflichtangabe bei den Zahlungsdetails**
Die BIC ist in den Zahlungsdetails nun eine Pflichtangabe. Der Grund: Die BIC muss übermittelt werden, wenn eine SEPA-ID angelegt wird.

**Anpassungen im Zusammenhang mit VEGA und Märkten**
Der VEGA-Produktcode für den Blueprint „Excellent“ sollte von „P_CPLC“ auf „1P_CPLC“ geändert werden. Außerdem wurde die Marktauswahl für Produkte und Fahrzeuggruppen (Vehicle Groups) vorbereitet; die Anwendung unterstützt die Marktauswahl bei Produkten.

**Speicherung von Einstellungen im Benutzerprofil**
Die Benutzerprofil-Einstellungen werden in mehreren Bereichen geprüft. Der gewählte Markt wird gespeichert. Bei den Blueprints wird die Spaltensortierung gespeichert. Bei den Fahrzeuggruppen werden Produkt und Preisversion gespeichert, während ein gesetzter Suchfilter zurückgesetzt wird, sobald zu einer anderen Seite navigiert wird. Bei Produkten und Kampagnen werden die Spaltensortierung und die Anzahl der Einträge pro Seite gespeichert. Filter bleiben erhalten, außer wenn der Tab oder der Browser geschlossen oder innerhalb des Menüs zu einer anderen Seite gewechselt wird; in diesen Fällen werden sie zurückgesetzt. Für Kampagnen wird dieses Verhalten ebenfalls angestrebt. Für Schadencodes (Damage Codes) befinden sich die Speicherung der Sortierung und der Anzahl der Einträge pro Seite noch in der Prüfung.

**Testabdeckung**
Für weitere Funktionen sind Testfälle angelegt, die sich teilweise noch in der Ausführung befinden. Sie betreffen den Preisclustern-Upload von Preistabellen, die Eindeutigkeit von Preisversionsnamen, die Anlage von Kontingentprodukten (Hauptablauf und Negativszenario), die Blueprint-Übersicht und -Anlage (Sortierung, Bearbeiten, Löschen, Abbrechen, Zurücknavigieren, Auswahl von Coverage Codes) sowie die Anlage, Filterung, Bearbeitung und Löschung von Coverage Codes. Ebenfalls abgedeckt sind die Anlage von Van-Fahrzeuggruppen aus der Fahrzeuggruppen-Übersicht und aus dem Preiscluster, einschließlich Navigation, Eingabevalidierung, Filterung bereits zugewiesener Modelle, Übersichtsseite und Abbruchverhalten.