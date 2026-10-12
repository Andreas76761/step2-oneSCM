# Batch 1116 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation: Neuerungen und Anpassungen**

**Marktspezifische Anpassung von ISP-Codes**

Bisher können Anwender den Wizard-Typ „ISP Codes" nicht anlegen. Künftig soll ein HQ-Anwender im Bereich der Fahrzeugverwaltung (Vehicle Management) über einen dreistufigen Wizard ISP-Codes erstellen können. Das Vorgehen entspricht dem der Vega Codes. Dabei legt der Anwender zunächst den Code an, wobei Upload und Download deaktiviert sind. Anschließend definiert er die Märkte, für die der Code gelten soll, und füllt das HQ-Feld mit der HQ-Empfehlung aus. In einer Übersicht werden vor dem Abschluss alle Angaben zusammengefasst angezeigt. Werden Pflichtangaben wie Code, Marktdefinition oder HQ-Felder nicht vollständig ausgefüllt, lässt sich der Wizard nicht abschließen.

Nach dem Abschluss übermittelt das System die Code-Details und die ausgefüllten HQ-Angaben automatisch und ohne manuellen Eingriff an die Market Settings. Dort sind die HQ-Felder für den richtigen Markt und die richtige Sprache sichtbar. Die HQ-Empfehlungen werden automatisch in die marktspezifischen Attribute vorbelegt, sodass die Daten abgestimmt bleiben. Die einzelnen Märkte ergänzen ihre eigene Übersetzung anschließend in den Market Settings. Die Kommunikation verläuft nur in eine Richtung, vom HQ-Bereich zu den Market Settings, und nicht bidirektional.

Ändert ein Anwender im HQ-Bereich nachträglich Daten, werden diese in die HQ-Felder der Market Settings synchronisiert. Auch die Marktfelder werden aktualisiert, sofern sie nicht zuvor überschrieben wurden. Wird in den Market Settings eine neue Sprache hinzugefügt, bezieht das System die aktuellen Inhalte und füllt sie vor. Ein lokaler Marktanwender kann weder Daten oder Übersetzungen eines anderen Marktsegments oder einer anderen Division einsehen oder ändern, für die ihm die Berechtigung fehlt, noch die ursprünglichen HQ-Vorgaben in den Market Settings verändern oder überschreiben. Damit bleibt die zentrale Steuerung erhalten.

**Listenansicht der Basisdeckungen in der Preisversion**

Bisher sind Basisdeckungen (Base Coverages) als Gruppe einer bestimmten Kostenstelle (Cost Unit) zugeordnet, und die Preisfindung für die Basisdeckung berücksichtigt die Gruppe insgesamt. Dadurch ist auf Ebene einzelner Basisdeckungen keine Preisangabe möglich. Das ist insbesondere bei Van-Produkten mit unterschiedlichen Kostenstellen innerhalb der Basisdeckungen ein Problem und wirkt sich auf die Rechnungserlöse aus.

Die Neuerung richtet sich an MPC-Anwender für PKW und Vans. Sie können nun einzelne Basisdeckungen, beispielsweise P001-MAINTEN, aus einer vordefinierten Liste auswählen. Über ein Dropdown weisen sie jeder ausgewählten Deckung eine bestimmte Kostenstelle zu, etwa Mercedes-Benz, Lieferant oder Kunde. Die Auswahl der Deckungscodes und der Kostenstelle erfolgt im Modal. In der Preisübersicht gruppiert das System die ausgewählten Deckungen automatisch nach der zugewiesenen Kostenstelle und zeigt für jede Kostenstellen-Gruppe eine eigene, konsolidierte Preismatrix an. So gibt es beispielsweise eine Matrix für alle MB-Positionen und eine weitere für Lieferanten-Positionen. Dadurch sind Deckung und Kostenstelle klar getrennt, und die Preismatrix ist übersichtlich. Die Preismatrizen werden validiert und müssen übereinstimmen. Die Daten zu Deckung und Kostenstelle werden im Payload an Brabus übermittelt. Die Umsetzung folgt den UI/UX-Vorgaben.

Für diese Funktion sind Testfälle vorgesehen. Sie decken unter anderem die Zuweisung und Änderung der Kostenstelle, die Pflichtangabe der Kostenstelle, die verfügbaren Kostenstellen, die Gruppierung der Deckungen, das Entfernen einer Deckung, den Umgang mit leeren Gruppen, die Preismatrizen je Kostenstelle sowie den Payload bei einer oder mehreren Kostenstellen ab.

**Anpassung der Leasing-Integration**

Zur Anpassung der Leasing-Integration liegen derzeit keine inhaltlichen Angaben vor.