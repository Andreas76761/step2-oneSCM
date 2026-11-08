# Batch 1141 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation – Neuerungen und Änderungen**

**Preisversionen und Basisdeckungen**
In der Preisversion können Basisdeckungen (Base Coverages) künftig einzeln ausgewählt und jeweils einer Kostenstelle (Cost Unit) zugeordnet werden. Das ist insbesondere für Van-Produkte relevant, bei denen verschiedene Basisdeckungen unterschiedlichen Kostenstellen zugeordnet sind. Bisher wurden Basisdeckungen als Gruppe einer Kostenstelle zugewiesen, und die Preisgestaltung berücksichtigte die Deckungsgruppe als Ganzes. Dadurch gab es auf Ebene der einzelnen Basisdeckung keine Preisinformation.

Im Dialog wählen Sie die Basisdeckungscodes (zum Beispiel P001-MAINTEN) aus einer vordefinierten Liste aus und weisen jedem Code über ein Dropdown-Feld eine Kostenstelle zu, zum Beispiel Mercedes-Benz, Lieferant oder Kunde. In der Preisübersicht gruppiert das System die ausgewählten Deckungen automatisch nach Kostenstelle und zeigt für jede Kostenstellengruppe eine eigene Preismatrix an. So gibt es beispielsweise eine Matrix für alle MB-Positionen und eine weitere für den Lieferanten. Die Zuordnung von Deckung und Kostenstelle wird im Payload an Brabus übermittelt. Bei der Validierung der Preismatrix müssen die Matrizen übereinstimmen. Die Funktion steht Benutzern der MPC für die Bereiche Van und PC zur Verfügung und ist für die Rechnungsstellung (Umsatz) von Bedeutung.

In den Ablauf zum Erstellen und Bearbeiten einer Preisversion wurde außerdem ein zusätzlicher Schritt für Deckungscodes aufgenommen. In Schritt 2 lassen sich immer enthaltene Deckungscodes (Always Included), optionale Deckungscodes und technische Optionen konfigurieren. Die Details einer Preisversion können Sie im letzten Schritt des Erstellungs- bzw. Bearbeitungsablaufs oder auf der Detailseite einsehen. Diese öffnen Sie über die Aktion „Anzeigen“ in der Aktionsspalte oder durch Klick auf den Namen der Preisversion in der Spalte „Versionsname“.

**Felgen- und Wetterprofil für Van und PC**
Für Van und PC kann die MPC nun Preismatrizen sowohl für Reifen mit Felgen als auch für Reifen ohne Felgen bereitstellen, sodass Kunden die für sie beste Option wählen können. Dazu lässt sich der Felgentyp („Rim type“) als Reifenkomponente definieren. Felgentyp und Wetterprofil sind bei der Produkteinrichtung optionale Angaben. Über ein Auswahlmenü „Rim Inclusion“ wählen Sie zwischen „Rim Included“ und „Rim Not Included“. Die angezeigte Preismatrix richtet sich nach dieser Auswahl. Wurde die Angabe gemacht, wird sie im Payload an die Generierung übermittelt.

**Vier-Augen-Freigabe bei der Kampagnenerstellung**
Für die Erstellung von Kampagnen gilt eine Vier-Augen-Freigabe, und zwar in den Bereichen PC und Van. Eine neu erstellte Kampagne erhält den Status „Created“. Dieser Status gilt auch, wenn Sie eine Kampagne bearbeiten. Die Kampagne wird anschließend zur Prüfung (Review) eingereicht. Eine zur Prüfung eingereichte Kampagne kann abgelehnt werden.

**Anzeige kompatibler Produkte**
Bei der Anzeige kompatibler Produkte gibt das System eine passende Fehlermeldung aus, wenn der Kilometerstand des Fahrzeugs das Limit des Produkts überschreitet. Das gilt für gewerbliche wie für private Fahrzeuge. Ebenso erscheint eine Fehlermeldung, wenn das Fahrzeugalter, berechnet auf Basis des FRD, das für das Produkt zulässige Höchstalter überschreitet, ebenfalls für gewerbliche und private Fahrzeuge.