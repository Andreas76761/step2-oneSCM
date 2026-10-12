# Batch 1019 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Automatische Kilometerstandsübernahme (Mileage) bei Fahrzeugen von Mercedes me**

Bisher haben Händler, die einen Vertrag für einen Endkunden anlegen, den Kilometerstand im Bereich „Vehicle Input“ von Hand eingetragen, um die passenden Produkte angezeigt zu bekommen. Künftig wird der Kilometerstand automatisch ermittelt. Das Feld „Mileage“ akzeptiert ausschließlich numerische Werte mit bis zu neun Stellen und verwendet ein Tausendertrennzeichen. Verfügbar ist es in den Abläufen „Available Chassis Number“ und „Build to Stock“. Bei „Build to Stock“ ist der Kilometerstand standardmäßig auf „0“ gesetzt.

Sobald der Händler im Bereich „Vehicle Input“ die Fahrgestellnummer eingibt, fragt die Vertragserstellung den Kilometerstand per API bei der Produktverwaltung (Product Management) ab. Liefert die Produktverwaltung einen Wert, wird er im Feld „Mileage“ angezeigt. Bleibt eine Antwort aus, erscheint die Fehlermeldung „Please fill in the Mileage“, und der Händler kann den Wert manuell eintragen. Diese manuelle Eingabe dient auch als Ausweichlösung, falls die Mercedes-me-API nicht erreichbar ist.

Die Vertragserstellung läuft anschließend bis zum Schritt „Customer & Payment“ weiter. Dort starten die automatischen Prüfungen, noch bevor der Vertrag Nummer und Status erhält. Zunächst wird geprüft, ob zur eingegebenen Fahrgestellnummer Werkstattinformationen (über i156) im System vorliegen. Gibt es keine Informationen und wurde der Kilometerstand automatisch übernommen, geht es direkt weiter zu „Overview and Confirmation“. Wurde der Kilometerstand dagegen manuell eingetragen, wird die Prüfung in den „MO Checks“ für Market Operations markiert, und der Ablauf geht ebenfalls weiter zu „Overview and Confirmation“.

Nach der Bestätigung des Vertrags wird dieser auf „Waiting for Activation“ gesetzt. Danach laufen automatische Prüfungen für DSS, die SAP-Debitorennummer, das gültige SEPA-Mandat und den Kilometerstand. Bei Letzterem wird geprüft, ob er in Ordnung ist bzw. von Market Operations gesetzt wurde. Sind alle Prüfungen in Ordnung, wird der Vertrag aktiviert. Fällt eine Prüfung negativ aus, bleibt der Vertrag in „Waiting for Activation“, bis Market Operations eingreift und den Vertrag bearbeitet, aktiviert oder storniert. Wurde ein automatisch ermittelter Kilometerstand manuell verändert, erhält Market Operations in den „MO Checks“ einen Hinweis darauf und kann den Vertrag anschließend aktivieren. Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Auswahl des Ablaufs bei der Vertragserstellung**

Händler benötigen unterschiedliche Möglichkeiten, einen Vertrag anzulegen, damit der Ablauf zum jeweiligen Fall passt. Bisher startete die Schaltfläche „Generate Contract“ auf der Startseite der Vertragserstellung einen Standard-Assistenten, der davon ausging, dass Fahrgestellnummer, FRD und Kilometerstand vorliegen.

Nun enthält der erste Schritt des Assistenten ein Dropdown mit drei Abläufen. Beim Start ist standardmäßig „Available Chassis Number“ ausgewählt. Die Eingabefelder werden erst aktiv, nachdem ein Ablauf gewählt wurde.

Bei „Available Chassis Number“ sind Fahrgestellnummer, FRD und Mileage Pflichtfelder, das Kennzeichen (License Plate) ist optional.

Bei „Not Available Chassis Number – Build to Order“ stehen Baumuster, Division, Model Group und Sales Designation zur Verfügung. Division, Model Group und Sales Designation sind Dropdowns, deren Optionen voneinander abhängen: Die Model Group richtet sich nach der Division, die Sales Designation nach Division und Model Group. Wird das Baumuster eingetragen, werden die übrigen Angaben automatisch vorbelegt. Ist das Baumuster zunächst leer und werden Division, Model Group und Sales Designation ausgefüllt, wird das Baumuster aus der gewählten Konfiguration ergänzt.

Bei „Not available FRD – Build To Stock“ sind Fahrgestellnummer (Pflichtfeld) und Mileage verfügbar, wobei der Kilometerstand standardmäßig auf „0“ gesetzt ist.

Auf Basis der ausgefüllten Felder wird per API eine Anfrage an die Produktverwaltung gestellt, die die passenden Produkte zurückliefert. Sobald alle Pflichtfelder der Produktkonfiguration ausgefüllt sind, wird die Schaltfläche „Next“ aktiviert. Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

**Vertragsbeginn in der Produktkonfiguration**

Händler können das Startdatum des Vertrags nun direkt im Produktkonfigurator festlegen. Das ist hilfreich bei Produkten, die nicht ausschließlich vom FRD abhängen. Nach der Fahrzeugeingabe wird die Vertragskalkulation (Contract Calculation) aufgerufen, die die passenden Produktoptionen liefert. Nach der Auswahl eines Produkts konfiguriert der Benutzer es über Dropdowns für die Laufzeit in Monaten (12, 24, 36, 48 oder 60), die jährliche Fahrleistung in Kilometern und das Zahlungsintervall. Neu hinzu kommt das Pflichtfeld „Contract Starting Date“ als Kalenderfeld.

Das Startdatum kann über den Datumsauswähler gewählt oder per Tastatur eingegeben werden. Ein Datum in der Vergangenheit ist weder über den Datumsauswähler noch per Tastatur zulässig. Wird per Tastatur ein zurückliegendes Datum eingegeben, erscheint die Fehlermeldung „Dates cannot be backdated, please enter a valid date.“. Ist das eingegebene Datum gültig, wird die Schaltfläche „Next“ aktiviert.

Für das Startdatum gilt je nach Produkt: Bei dem Produkt EXCELLENT übernimmt das „Contract Starting Date“ den Wert des FRD und ist schreibgeschützt. Bei allen anderen Produkten stellt es das geplante Startdatum (Planned Start Date) dar. Auch hier entspricht die Oberfläche der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.