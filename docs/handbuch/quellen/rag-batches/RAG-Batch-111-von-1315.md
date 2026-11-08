# Batch 111 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Erweiterung des Datenbereitstellungsmodells für Sonderfallrabatte in der Vertragserzeugung**

Im Prozess der Sonderfall-Vertragserzeugung werden Sonderfallrabatte bislang auf Basis einer Kostenstelle bereitgestellt, die in der Folgeverarbeitung in den entsprechenden Sonderfallrabatt After Sales (SCDAS) übersetzt wird. Das bisherige Modell unterstützt ausschließlich After-Sales-Sonderfallrabatte. Um künftige Geschäftsanforderungen abzudecken und mehr Flexibilität zu erreichen, wird das Datenbereitstellungsmodell erweitert.

In der Pflegemaske für Sonderfallrabatte steht künftig das neue Feld „External Campaign ID" zur Verfügung. Damit können Sie für einen Sonderfallrabatt eine externe Kampagnenkennung pflegen. Der erfasste Wert wird in die erzeugte E174-Schnittstellendatei übernommen und steht für die Weiterverarbeitung zur Verfügung. Das Feld ist bereits aus anderen kampagnenbezogenen Prozessen bekannt und folgt denselben technischen und fachlichen Regeln.

Zusätzlich wird ein neues Pflichtauswahlfeld „Discount Type" mit den Werten „Sales" und „After Sales" eingeführt. Die Auswahl legt fest, welche Art von Sonderfallrabatt vorliegt und wie dieser weiterverarbeitet wird. Bei „After Sales" bleibt das bisherige Verhalten unverändert: Die erzeugten Datensätze werden weiterhin als After-Sales-Sonderfallrabatte verarbeitet. Bei „Sales" wird der Sonderfallrabatt als Sales-Sonderfallrabatt behandelt. Hierfür wird ein eigener Rechnungstyp eingeführt und entsprechend den Anforderungen an die Verarbeitung von Sales-Rabatten zugeordnet. Die Daten werden im E174-Format übertragen, das für die Sales-Kampagnenverarbeitung vorgesehen ist. Ergänzend steht das Feld „Debtor number" (Debitorennummer) zur Verfügung, das nach derselben Logik wie in der Kampagnenverarbeitung funktioniert und optional ist.

Um den Pflegeaufwand zu verringern, wird das Feld „Kostenstelle" abhängig vom gewählten Geschäftsbereich automatisch vorbelegt. Für Deutschland gilt beispielsweise: Für Pkw wird die Kostenstelle 27241100 vorbelegt, für Vans die Kostenstelle 27241200. Berechtigte Benutzer können den vorbelegten Wert vor dem Speichern weiterhin manuell anpassen.

Die Erweiterung ermöglicht die Identifikation und Nachverfolgung von Sonderfallrabatten über externe Kampagnen-IDs und unterstützt Sales- und After-Sales-Szenarien in einem einheitlichen Modell. Sie verringert den manuellen Aufwand durch die Vorbelegung der Kostenstelle, stellt die korrekte Übermittlung kampagnenbezogener Informationen über die E174-Schnittstelle an nachgelagerte Systeme sicher und verbessert die Wartbarkeit und Erweiterbarkeit für künftige Anforderungen im Kampagnen- und Rabattmanagement.

**Korrekturen bei Zahlungsreferenz und Kopfzeile von Exporten**

Die Zahlungsreferenz wird nun bei MPPI-Rechnungen in der CoFiCo-/SWT-Datei angezeigt. Außerdem wurde die Kopfzeile der MBLD-E169-Exporte korrigiert.

**Erweiterung der Rechnungstexte für MBLD- und Management-Verträge**

Die Rechnungstexte für MBLD-Verträge wurden erweitert. Im Textfeld HTXT01 wird die Genesis-Nummer 8002 ausgegeben, HTXT02 bleibt leer, und HTXT06 entfällt. Der Text PTXT01 hat den Aufbau „Abrechnung <Produktname> | Vertrag | Fahrzeugnr. | Kennzeichen | Zahlungsweise | Abrechnungszeitraum", zum Beispiel mit der Zahlungsweise „Monatlich" und einem Abrechnungszeitraum von Beginn bis Ende der Periode.

Die Kopfzeile (HEADER) der MBLD-Exporte wird wie folgt korrigiert: Als Satzart steht „HEADER", als Identifikationsnummer der Rechnung die Verarbeitungsnummer und als Art des Geschäftsvorfalls „O". Der Auftragstyp bleibt leer. Als Werks- bzw. Filialnummer des Rechnungsstellers wird 268 angegeben, die Betriebsnummer des Rechnungsstellers bzw. der Werkstatt richtet sich nach der Produktlinie. Als Belegdatum und als Datum der Datenübergabe an SAP wird jeweils das Exportdatum verwendet. Das Feld für den Benutzer, der den Satz bzw. den SAP-Export erstellt hat, bleibt leer. Der Exporttyp ist fünfstellig und folgt der Zuordnung der Exporttypen für den deutschen Markt. Die UUID bleibt für MBLD leer, und als Servicevertragsreferenz wird die Vertragsreferenz eingetragen.

Auch für Management-Verträge wurde der Rechnungstext erweitert. Er beginnt mit der Abrechnung des Vertrages und enthält Vertragsnummer, Fahrzeugnummer und Kennzeichen. Bei Werkstattaufenthalten folgen der Werkstattbesuch mit Name des Händlers, die Werkstattrechnung, das Reparaturdatum sowie Schadencodes mit Beschreibung und Werten. Abschließend werden die Umsatzsteuerbeträge je Steuersatz ausgewiesen, zum Beispiel 19 % und 0 % aus dem jeweiligen Nettobetrag.