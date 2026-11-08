# Batch 948 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Erweiterung des Baumuster-Ablaufs für den Bereich Van**

Bisher ist die Anwendung ausschließlich auf Pkw ausgelegt. Mit dieser Erweiterung kann sie auch für den Van-Bereich genutzt werden, um die Produktpalette zu erweitern und die Umsatzgenerierung im Sinne der Unternehmensziele zu unterstützen. Die Anpassung betrifft die Vertragserstellung, wenn das Baumuster als Identifikator verwendet wird. Da das Baumuster bei Vans kein eindeutiger Wert ist, werden zusätzliche Kriterien eingeführt und der Ablauf so angepasst, dass die Gruppe der passenden Fahrzeuge bestimmt und die zugehörigen Produkte korrekt ermittelt werden. Die Erweiterung gilt nur für den Van-Bereich und richtet sich an Nutzer mit den Rollen Dealer+ für Van, MPC für Van, MO für Van und Dealer für Van. Für Van-Nutzer sind Baumuster mit 6 bis 8 Stellen zulässig. Die Motorart wird durch D (Diesel), E (Elektro) oder B (Benzin) gekennzeichnet.

**Angebotserstellung für Gewerbe-, Flotten- und Behördenkunden**

Im Ablauf von der Vertragserstellung über das Vertragsangebot wählen Sie zunächst den Kundentyp Gewerbe, Flotte oder Behörde und optional eine Branche. Anschließend geben Sie das Baumuster als Identifikator ein. Auf Basis dieses Werts werden über die Fahrzeugdomäne die verfügbaren Motorarten ermittelt, und ein neues Feld zur Auswahl der Motorart wird aktiviert. Wird nur eine Motorart gefunden, ist ausschließlich diese auswählbar, die übrigen Optionen sind deaktiviert, und die Motorart wird schreibgeschützt angezeigt. Bei mehreren Motorarten steht ein Dropdown zur Verfügung, dessen Optionen der Fahrzeug-Microservice liefert.

Nach der Auswahl werden anhand von Baumuster und Motorart die Fahrzeuggruppen und die verfügbaren Produkte abgerufen. Auf der Übersichtsseite werden links die Marke (Mercedes-Benz), der Bereich (Vans) und die Verkaufsbezeichnung angezeigt, also eine Liste der Fahrzeuggruppen mit dem jeweiligen Fahrzeuggruppennamen. Bei den Produkten erscheint jeweils der niedrigste Preis mit dem Zusatz „Ab“, der aus den verschiedenen Preisclustern ermittelt wird. Da es sich um einen gewerblichen Kundentyp handelt, werden die Nettopreise angezeigt; beim Überfahren mit der Maus erscheinen Bruttopreis und Mehrwertsteuer. Anschließend wählen Sie das Produkt aus und konfigurieren es.

**Die Angebotsansicht**

In der Angebotsansicht wird zunächst der niedrigste Preis aus den Preisclustern als Startpreis angezeigt. Als erstes Feld steht das neue Feld „Vehicle Groups“ zur Verfügung. Wird nur eine Fahrzeuggruppe gefunden, bleibt das Feld schreibgeschützt. Stehen mehrere Gruppen zur Auswahl, werden sie in einem Dropdown angeboten, und die passende muss ausgewählt werden. Nach der Auswahl wird der Startpreis entsprechend angepasst. Bei mehreren Fahrzeuggruppen werden die Felder für Laufzeit und Laufleistung erst nach der Auswahl einer Fahrzeuggruppe aktiviert.

Anschließend wählen Sie Vertragslaufzeit, jährliche Laufleistung und Zahlungsintervall. Danach erfassen Sie einen Identifikator (Fahrgestellnummer, FIN oder Auftragsnummer), den aktuellen Kilometerstand und das Kennzeichen. Ist das Produkt für die Fahrgestell- oder Auftragsnummer in derselben Konfiguration verfügbar, bleibt die Konfiguration aus Laufzeit, Laufleistung und Zahlungsintervall erhalten, und der Preis wird auf den entsprechenden Wert aktualisiert. Ist das Produkt oder die Konfiguration für den eingegebenen Identifikator nicht verfügbar, öffnet sich ein Dialogfenster. Dort können Sie entweder zur Produktauswahl zurückkehren oder einen anderen Identifikator eingeben.

Optional lassen sich ein Händlerrabatt oder Kampagnen sowie optionale Deckungen oder technische Optionen hinzufügen. Wurden Rabatte, Deckungen oder technische Optionen ergänzt, werden die Preise aktualisiert, andernfalls bleiben die angezeigten Preise unverändert. Zum Abschluss erstellen Sie das Angebot.

**Angebotserstellung für Privatkunden**

Die erweiterte Baumuster-Logik gilt auch für Privatkunden. Wie bisher gibt es für diese Verträge kein Feld für die Branche, da dieser Schritt für Privatkunden nicht relevant ist.

**Hinweise zu Gestaltung und Abnahme**

Design und Grafik entsprechen dem Mercedes-Benz Workbench. Die Funktion wurde für Händler anhand von Szenarien geprüft, und zwar für alle Kundentypen. Geprüft wurden die Eingabe von Fahrgestellnummer, FIN oder Auftragsnummer sowie die Eingabe des Baumusters mit einer oder mehreren Motorarten und mit einer oder mehreren Fahrzeuggruppen. Bei Gewerbe-, Flotten- und Behördenkunden wurde außerdem die Angabe der Branche bzw. die Einstellung „Nicht relevant“ getestet.