# Batch 990 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Ein aktiver Vertrag pro Fahrgestellnummer**

In oneSCM kann für dieselbe Fahrgestellnummer nur noch ein einziger Vertrag gleichzeitig aktiv sein. Zuvor war es möglich, mehrere Verträge für dieselbe Fahrgestellnummer mit denselben Produkten und Laufzeiten anzulegen und zu aktivieren. Diese Prüfung gilt ausschließlich in der Produktivumgebung. In den Entwicklungs-, Integrations- und Vorproduktionsumgebungen können zu Testzwecken weiterhin mehrere Verträge für dieselbe Fahrgestellnummer angelegt und aktiviert werden. Als Alternative steht Kundinnen und Kunden stets eine individuell zugeschnittene langfristige Verlängerung zur Verfügung.

Solange für eine Fahrgestellnummer weder ein aktiver noch ein ausgesetzter Vertrag existiert, können beliebig viele Verträge angelegt werden. Sobald einer dieser Verträge aktiviert wird, werden alle übrigen Verträge mit dem Status „Created", „Waiting for Confirmation", „Confirmed" oder „Waiting for Activation" auf „Rejected" gesetzt. Für diese Fahrgestellnummer kann dann kein weiterer Vertrag angelegt werden.

Wird ein Vertragsangebot über die Fahrgestellnummer gestartet, prüft das System, ob für diese Nummer bereits ein aktiver oder ausgesetzter Vertrag vorliegt. Ist das der Fall, erscheint eine Fehlerseite mit dem Hinweis, dass keine Produkte angezeigt werden können, weil das Fahrzeug bereits einem aktiven oder ausgesetzten Vertrag zugeordnet ist. Vorgesehen ist zudem ein Link „See Contracts", der zum bestehenden Vertrag führt. Ob er für MO/MPC und gegebenenfalls auch für Händler mit derselben Outlet-ID angeboten wird, war in den Unterlagen noch zu klären. Liegt kein aktiver oder ausgesetzter Vertrag vor, werden Produkte und Konfigurationen geladen und die Vertragserstellung wird fortgesetzt. Befindet sich kein anderer Vertrag in einem der Aktivierungsstatus, wird der Vertrag aktiviert, sofern alle Prüfungen erfolgreich sind. Wurde bereits vorher ein anderer Vertrag aktiviert, werden alle Verträge in der Warteschlange auf „Rejected" gesetzt. In der Historie wird der Grund „Vehicle already assigned to an Active / Suspended Contract" vermerkt, und der Kunde erhält eine E-Mail-Benachrichtigung.

Wird das Angebot über eine Auftragsnummer gestartet, prüft das System, ob dieser bereits eine Fahrgestellnummer zugeordnet ist. Wenn ja, läuft der Vorgang wie bei der Fahrgestellnummer ab. Wenn nein, wird die Vertragserstellung fortgesetzt, und das System wartet, bis der Auftragsnummer eine Fahrgestellnummer zugewiesen wird. Sobald sie vorliegt, wird geprüft, ob dafür ein aktiver oder ausgesetzter Vertrag existiert. Ist das der Fall, wird der Vertrag auf „Rejected" gesetzt, mit demselben Grund in der Historie, und der Kunde erhält eine E-Mail mit einer neuen Vorlage. Andernfalls wird der Vertrag aktiviert.

Für das Baumuster (Model Code) gilt dasselbe Vorgehen wie bei der Auftragsnummer: Ist bereits eine Fahrgestellnummer zugeordnet, gilt der Ablauf der Fahrgestellnummer. Andernfalls wird auf die Zuordnung gewartet und anschließend geprüft, ob ein aktiver oder ausgesetzter Vertrag vorliegt. Dann folgen Ablehnung mit E-Mail oder Aktivierung.

Gestaltung und Grafiken müssen der Mercedes-Benz Workbench entsprechen und dem vom Kunden freigegebenen UI-Design folgen.

**Hinweis zum Upload unterschriebener Serviceverträge**

Die geplante Anpassung der Abläufe zum Hochladen unterschriebener Serviceverträge wurde abgebrochen und ist daher nicht Teil dieser Funktionalität.