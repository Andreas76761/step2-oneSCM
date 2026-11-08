# Material zu 15 Ohne Unterkapitel-Zuordnung

Kapitel 15 HQ-Rolle, Blueprint und zentrale Stammdaten. 3 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 1163.2] Produkte ohne FRD-Bezug

Für Produkte, die nicht FRD-bezogen sind, gelten folgende Berechnungsregeln: Der Preis wird aus der Preismatrix entnommen und durch die gewählte Laufzeit geteilt. Das Vertragsstartdatum entspricht dem Datum, an dem das Produkt gekauft bzw. aktiviert wird. Das Vertragsenddatum ergibt sich aus dem Aktivierungsdatum zuzüglich der gewählten Laufzeit. Voraussetzung ist jeweils, dass das Produkt verfügbar ist.

Zusätzlich stehen im Fahrzeugbereich die Platzhalter „Vehicle Age at Contract End“ und „Vehicle Mileage at Contract End“ zur Verfügung. Die Bezeichnung der Vertragslogik wurde in „Sales Logic (Multi Select)“ geändert. Dabei gibt es eine Dropdown-Option „Sales Logic“ mit den zwei Auswahlmöglichkeiten „FRD Related“ und „FRD Not Related“. Für diese Funktionen müssen Blueprints verfügbar sein.

## [Batch 1195.4] Weitere Anpassungen

Das Ablaufkriterium aller Produkt-Blueprints und Produkte in der Produktionsumgebung wurde auf „Zeit“ umgestellt. Zudem wurden Probleme mit Preisfaktoren in der Vorproduktionsumgebung behoben.

## [Batch 8.6] Admin-Bereich

Im Admin-Bereich der Fahrzeugverwaltung werden die Einträge der Tabelle „Engine Series“ nun aufsteigend nach der Spalte „Engine Series“ sortiert. HQ-Administratoren können so schnell erkennen, welche Einträge vorhanden sind oder fehlen, ohne alle sechs Seiten einzeln öffnen zu müssen.

