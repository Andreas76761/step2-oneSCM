# Batch 10 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 13 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Fahrzeugverwaltung (Vehicle Management)**

**Fahrgestellnummer bei auftragsbasierten Verträgen**
Verträge, die auf Basis einer Bestellung erzeugt werden, werden künftig automatisch um die Fahrgestellnummer ergänzt, sobald diese vorliegt. So sind die für den Händler verpflichtenden Vertragsinformationen vollständig. Erstellt die Vertragsgenerierung einen Vertrag anhand einer Bestellnummer und existiert noch keine Fahrgestellnummer, wird der Vertrag später aktualisiert, sobald die Nummer verfügbar ist. In diesem Fall wird in Global Order ein neuer Zeitpunkt für die nächste Prüfung der Fahrgestellnummer festgelegt. Ist die Fahrgestellnummer bereits vorhanden, wenn die Vertragsgenerierung die Bestellnummer übermittelt, wird sie direkt in der Antwort mitgeliefert. Die Prüfung erfolgt zu drei Terminen: zuerst am Enddatum der Produktionsperiode (Periodentyp „Tag“), dann am Übernahmedatum und schließlich am zweiten Enddatum, das in den Bestelldaten angegeben ist.

**Fahrzeuggruppen**
Bei der Anlage von Fahrzeuggruppen wurden mehrere Fehler behoben. Produkte werden beim Erstellen einer Fahrzeuggruppe nun korrekt geladen. Wird die Anlage aus der Cluster-Ansicht angestoßen, bleiben Produkt und Preisversion nicht mehr fälschlich vorausgewählt, und das Erstellen einer Fahrzeuggruppe von der Cluster-Seite aus ist nicht mehr blockiert. Außerdem sind die Werte in den Auswahllisten beim Erstellen einer Fahrzeuggruppe jetzt sortiert: Listen mit Textwerten werden alphabetisch, Listen mit Zahlenwerten aufsteigend von niedrig nach hoch angezeigt.

**Kampagnen**
Für Kampagnen steht eine neue Funktion zum Duplizieren zur Verfügung.

**Schadencodes anlegen (Cost Management)**
Benutzer mit der Rolle Market Operation oder Admin können Schadencodes anlegen, damit diese einem Coverage Code zugeordnet werden können. Die Funktion befindet sich im Admin-Bereich unter „VEGA Codes“ auf dem Reiter „Damage codes“ über die Schaltfläche „Create Damage code“. Sie öffnet einen Assistenten mit drei Schritten. Die Oberfläche folgt der vom Kunden freigegebenen UI-Gestaltung und den Vorgaben der Mercedes-Benz Workbench.

Im ersten Schritt, „Define Damage Code“, wählen Sie einen Coverage Code aus einer Dropdown-Liste mit Einfachauswahl aus. Die Liste basiert auf den Coverage Codes des Coverage-Reiters (Feld Coverage Reference). Die Division (Passenger Cars oder Vans) ist ein schreibgeschütztes Feld und wird anhand des Coverage Codes bestimmt. oneSCM ist dabei das führende System für die Beziehung zwischen Division und Coverage Code. Für jede Kombination aus Division, Damage Code und Damage Type wird eine eigene Zeile in der Tabelle angelegt. Der Damage Code ist ein Pflichtfeld mit genau fünf Zeichen (erlaubt sind 0–9 und A–Z), der Damage Type ein Pflichtfeld mit genau zwei Zeichen (ebenfalls 0–9 und A–Z). Bei ungültigen Eingaben werden Fehlermeldungen angezeigt. Sobald alle Pflichtfelder ausgefüllt sind, wird die Schaltfläche „Weiter“ aktiv.

Im zweiten Schritt, „Market Specificity“, legen Sie fest, in welchen Märkten der Schadencode verfügbar ist. Aktuell steht nur Deutschland zur Auswahl; die Liste wird erweitert, sobald oneSCM weitere Märkte unterstützt. Mit „Select All Markets“ werden alle verfügbaren Märkte ausgewählt. Damit die Schaltfläche „Confirm“ aktiv wird, muss mindestens ein Markt ausgewählt sein. Nach der Bestätigung erscheint auf der rechten Seite für jeden Markt eine Karte mit zwei Pflichtfeldern: Code Description und Type Description. Beide müssen zwischen 5 und 100 Zeichen lang sein, wobei alle Zeichen einschließlich sprachspezifischer Sonderzeichen erlaubt sind. Wird die Auswahl eines Marktes aufgehoben und bestätigt, wird die zugehörige Karte samt Beschreibungen entfernt und gelöscht.

Der dritte Schritt, „Overview & Confirmation“, zeigt eine Übersicht der erfassten Daten. Über das „X“ öffnet sich ein Dialog zum Beenden des Vorgangs, sodass Sie die Anlage abbrechen können. Mit „Zurück“ gelangen Sie zum vorherigen Schritt. Mit „Confirm“ im letzten Schritt wird die Konfiguration in der Übersichtsliste gespeichert.

**Benutzerprofil und Marktauswahl**
Im Admin-Bereich der Fahrzeugverwaltung wird die Einstellung zur Anzahl der Einträge pro Seite im Benutzerprofil gespeichert. Zudem unterstützt die Anwendung die Marktauswahl für Produkte und Fahrzeuggruppen.