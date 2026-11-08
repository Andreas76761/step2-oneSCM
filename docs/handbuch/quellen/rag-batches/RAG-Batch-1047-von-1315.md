# Batch 1047 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 31 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation)**

In der Vertragserstellung wurden mehrere Verbesserungen und Prüfungen umgesetzt. Der Vertragsbeginn wird nun auf das Datum der Erstzulassung (FRD) gesetzt; dieses Verhalten wurde im Zusammenspiel mit der Leasing-Integration überprüft. Beim Hinzufügen neuer Dokumente mit Unterschrift steht zusätzlich eine QR-Code-Validierung zur Verfügung. Dafür wurde auch die Schnittstelle zum Hochladen und Weiterverarbeiten von Dokumenten angepasst, sodass sie mit neu unterschriebenen Dokumenten funktioniert.

Ein Schwerpunkt lag auf der Prüfung der Preise pro Kilometer für Minder- und Mehrkilometer. Diese wurden in der Vertragsprüfung (Contract Review) kontrolliert, unter anderem für aktive Verträge, die ablaufen oder aufgrund der Laufleistung beendet werden, sowie nach erfolgter Mehrkilometer-Fahrleistung. Zusätzlich wurden die Preise auf Angebots- und Vertragsebene für verschiedene Produkte und Abläufe verifiziert: für das Produkt „Zeit und Laufleistung“ mit Fahrgestellnummer-Ablauf (PC- und VAN-Bereich), für das Produkt „Zeit und Laufleistung“ mit Baumuster- und Auftragsnummer-Ablauf, für das Reifenprodukt sowie für das Kontingentprodukt mit Auftragsnummer-Ablauf. Die Prüfungen erfolgten über die Vertriebskanäle ONESCM und MBLD.

Für Benutzer mit der Rolle „Dealer +“ wurde das Zusammenspiel von Kampagnen, Produkten und Vertriebsebenen geprüft. Kampagnen, die für Produkte mit der Vertriebsebene Dealership und/oder MO/MPC verfügbar sind, werden angezeigt und können von Dealer+-Benutzern ausgewählt werden. Sind für ein Produkt unterschiedliche Kombinationen aus Laufleistung und Laufzeit für Dealership und MO/MPC hinterlegt, sieht der Dealer+-Benutzer die Kombination für MO/MPC. Liegen Fahrzeugalter und Laufleistungsgrenze über dem Limit des Dealerships, aber innerhalb der MPC/MO-Grenzen, wird das Produkt angezeigt, und der Benutzer kann es auswählen und ein Angebot erstellen. Außerdem können Dealer+-Benutzer sowohl Produkte mit Dealer-Vertriebslogik als auch mit MO/MPC-Vertriebslogik einsehen und auswählen.

Darüber hinaus wurde das Verhalten der MO-Prüfung für Angebote in den Status „Erstellt“, „Wartet auf Bestätigung“, „Bestätigt“ und „Wartet auf Aktivierung“ jeweils für Gewerbe- und Privatkunden verifiziert.

Mehrere Fehler im Zusammenhang mit der Vertragserstellung wurden behoben bzw. abgeschlossen. Dazu zählen Fehlermeldungen bei der Vertragserstellung (unter anderem die Meldung „could not fetch data for contract“), eine fehlende Aktivierung bei Gewerbekunden aus dem Fuhrparkbereich sowie ein Vertrag, bei dem die Fahrgestellnummer manuell aktualisiert werden musste.

**Noch in Bearbeitung**

Bei der Vertragskalkulation wird derzeit geprüft, ob der Kampagnentyp im Auswahldialog für Kampagnen korrekt angezeigt wird. Der Rabatttyp der Kampagne soll dabei den Daten aus dem vorgelagerten Datenstrom entsprechen. Zudem ist ein Punkt offen: Bei den optionalen Leistungen kann für das Fahrzeugmodell EQV derzeit die Ladebordwand ausgewählt werden. Erwartet wird, dass diese Auswahl für den EQV nicht möglich ist, da die optionale Leistung „Ladebordwand“ grundsätzlich nur für Sprinter gilt.