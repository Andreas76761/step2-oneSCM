# Batch 169 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management: Rechnungen als Excel herunterladen**

Auf der Seite „Admin → Invoices" können Benutzer mit der Rolle MO oder Admin die angezeigten Rechnungen in eine Excel-Datei herunterladen, um die Daten offline zu analysieren oder weiterzugeben. Die Download-Schaltfläche ist ausschließlich für diese beiden Rollen sichtbar und nutzbar. Die Datei enthält nur die Rechnungen, die den aktuell in der Oberfläche gesetzten Suchkriterien entsprechen. Sie wird im XLSX-Format bereitgestellt. Spalten, Spaltennamen und Reihenfolge entsprechen der Tabelle in der Oberfläche, und die Spaltenüberschriften erscheinen in der Sprache, die der Benutzer aktuell eingestellt hat.

Die Schaltfläche ist nur aktiv, wenn die Suche mindestens eine Rechnung liefert. Gibt es keine Treffer, ist sie deaktiviert. Beim Überfahren mit der Maus erscheint der Hinweis „No invoices available to download based on current filters." Der Dateiname folgt dem Muster Invoices_YYYYMMDD_HHmmSS.xlsx, zum Beispiel Invoices_20251022_094702.xlsx. Der Download soll bei bis zu 10.000 Datensätzen innerhalb von 5 Sekunden abgeschlossen sein. Ob die Auswirkungen auf die Performance bei mehr als 100.000 Rechnungen einen asynchronen Ablauf erforderlich machen, sollte technisch geprüft werden.

**Revenue Management: Produktlinie „Basic" für die Division Passenger Cars entfällt**

Die Produktlinie „Basic" der Division Passenger Cars wird entfernt. Dafür werden alle Materialnummern mit der Division PASSENGER_CAR und der Produktlinie BASIC mithilfe eines Skripts in allen Umgebungen aus der Datenbank gelöscht. Auch die zugehörigen Einträge im HQ-Konfigurationsmenü unter „Material Numbers Management" sollen gelöscht werden. Dafür ist eine eigene Aufgabe für den Bereich Revenue anzulegen.

Anschließend sind die Stellen zu prüfen und zu testen, an denen diese Materialnummern verwendet werden, etwa bei der Erzeugung der Dateien E174, E167 und E169. Bestehende Tests sind zu kontrollieren und bei Bedarf anzupassen. Werden die Materialnummern bei der Dateierzeugung über die Produktentität der Vertragsdetails einbezogen, kann es sein, dass bei Verträgen mit der Produktlinie BASIC auch die Produktdetails des Vertrags angepasst werden müssen. Die Änderung muss gemeinsam mit den Frontend-Anpassungen der zugehörigen Story ausgeliefert werden.

**VEGA Codes: Schadencode-Liste herunterladen**

Auf der Seite „Product Management → VEGA Codes → Damage Codes" können HQ-Administratoren die angezeigten Schadencodes als Excel-Datei herunterladen, um sie offline zu analysieren oder weiterzugeben. Der Zugriff auf die Funktion ist auf die Rolle HQ Admin beschränkt. Die Datei enthält nur die Schadencodes, die den aktuellen Suchfiltern entsprechen, und wird im XLSX-Format bereitgestellt. Wird nach allen Schadencodes gesucht, enthält die Datei sämtliche Schadencodes, auch wenn die Oberfläche nur 10.000 davon anzeigt.

Aufbau und Reihenfolge der Spalten entsprechen der Importvorlage, da die Datei nach einer Korrektur wieder in oneSCM importiert werden kann. Die Spalten lauten Division, Market, Coverage Code, Coverage Code Reference, Damage Code, Damage Type, Damage Code Description und Damage Type Description. Darauf folgen für jede in oneSCM vorhandene Sprache die Spalten „Damage Code Description" und „Damage Type Description", jeweils ergänzt um den Alpha-2-Ländercode, zum Beispiel „Damage Code Description DE". Es werden also alle verfügbaren Übersetzungen exportiert. Die Übersetzungsspalten können sich dabei von der Vorlage unterscheiden.

Die Schaltfläche ist nur aktiv, wenn die Suche mindestens einen Schadencode findet. Andernfalls ist sie deaktiviert und zeigt beim Überfahren mit der Maus einen Hinweis an, dass auf Basis der aktuellen Filter keine Schadencodes zum Download verfügbar sind. Der Dateiname folgt dem Muster DamageCodes_YYYYMMDD_HHmmSS.xlsx, zum Beispiel DamageCodes_20251023_065701.xlsx. Der Download soll bei bis zu 10.000 Datensätzen innerhalb von 5 Sekunden abgeschlossen sein.