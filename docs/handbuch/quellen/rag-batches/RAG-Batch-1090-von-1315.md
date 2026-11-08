# Batch 1090 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung: Neuerungen im Überblick**

**Vertragsaktivierung und Kundenstatus**
Ist der Account Note eines Kunden SB, SJ oder SI, kann kein Vertrag mehr erstellt werden, und zwar unabhängig von der gewählten Zahlungsart. Bisher war dies nur bei Zahlungsarten möglich, die nicht der Banküberweisung entsprachen. Die Banküberweisung steht zudem nur noch für Gewerbekundensegmente (Commercial, Commercial Governmental, Commercial Fleet) zur Verfügung, und zwar ausschließlich für die Division VAN. Für die Division PC ist sie nicht mehr verfügbar. Diese Regelung ist eine Zwischenlösung. Langfristig soll die Verfügbarkeit der Zahlungsarten auf Produktebene konfigurierbar werden, abhängig von Kundensegment und Division.

**Verträge für Produkte ohne Bezug zum Erstzulassungsdatum**
Für Produkte, bei denen die Produktkonfigurationslogik auf NOT_FRD_RELATED gesetzt ist, verarbeitet das System die Vertragsdaten nach einer einheitlichen Logik. Dies gilt unabhängig von der Produktkategorie, etwa für Contingent-Produkte, Reifenprodukte oder andere Produkte ohne Bezug zum Erstzulassungsdatum. Das Erstzulassungsdatum wird dabei vollständig ignoriert. Vertragsbeginn und Vertragsverkaufsdatum entsprechen dem Datum der Vertragserstellung. Der bei der Vertragserstellung erfasste Kilometerstand wird als Kilometerstand zum Verkaufsdatum übernommen und gilt zugleich als Kilometerstand bei Vertragsbeginn. Das Vertragsende errechnet sich aus dem Erstellungsdatum zuzüglich der Vertragslaufzeit, abzüglich eines Tages. Die geplante Endlaufleistung ergibt sich aus der jährlichen Laufleistung multipliziert mit der Vertragslaufzeit in Monaten, geteilt durch 12. Der tatsächliche Kilometerstand bei Vertragsende wird wie bisher ermittelt. Für alle anderen Produkte bleibt die bestehende Logik mit Bezug zum Erstzulassungsdatum unverändert.

**Angebotsgültigkeit und Ablehnungsgründe**
Die Angebotsgültigkeit beginnt, sobald der Unterschriftsprozess gestartet wird und der Vertrag den Status „Waiting for Confirmation“ erhält. Sie endet, wenn der Vertragsstatus auf „Confirmed“ wechselt oder wenn die in den Market Settings hinterlegte Anzahl an Tagen für die Angebotsgültigkeit abgelaufen ist. In diesem Fall setzt das System den Vertrag automatisch auf „Rejected“ und erfasst als Ablehnungsgrund „Offer Validity Expired“.

Wird ein Vertrag manuell von einem Benutzer abgelehnt, wird der eingegebene Ablehnungsgrund nun in der Historie im Bereich „Reason“ angezeigt. Bei einer automatischen Ablehnung durch das System werden weiterhin die vordefinierten Standardmeldungen verwendet und angezeigt.

**Anzeige und Reihenfolge in der Oberfläche**
Im Antragsvorschlag werden die unterstützten Identifikatoren in folgender Reihenfolge dargestellt: Order Number, FIN/VIN, Deal Id und Baumuster. Dies gilt auch für das Feld, in dem nach der Erstellung des Vorschlags über das Baumuster eine zusätzliche Kennung erfasst wird.

Die Aktionen im Aktivierungsmodus werden in einer festgelegten Reihenfolge angezeigt. In der Vertragserstellung sind dies zunächst „Activate“ und dann „Reject“. In der Vertragsverwaltung lautet die Reihenfolge: Cancel Contract, Suspend Contract, Reactivate Contract, Prolongate Long Term, Cancel Long Term Prolongation, Prolongate Short Term, Cancel Change Payment Method, Early Terminate Contract, Customer Compensation, Transfer Contract, Cancel Contract Transfer, Change Payer, Cancel Change Payer und Resume Contract.

Im Sonderfall wird der reduzierte Preis auf der Prüfseite nur angezeigt, wenn ein MPC-Rabatt oder ein Händlerrabatt angewendet wurde.

**Dokument-Upload, Unterschriftsprozess und Übersetzungen**
Beim Hochladen von Dokumenten wurde der Hinweistext im Dialog angepasst. Er lautet nun: „Bitte bestätigen Sie, dass Sie das richtige Dokument und den richtigen Dokumenttyp ausgewählt haben.“ Die Schaltfläche heißt nicht mehr „Fortfahren“, sondern „Bestätigen“.

Wird der Unterschriftsprozess gestartet, erscheint auf dem Bildschirm und in der Infomeldung links unten dieselbe Erfolgsmeldung. Sie lautet auf Deutsch: „Unterschriftsprozess für Antrag XX/XX erfolgreich gestartet“. Auf Englisch heißt sie: „Signature process successfully initiated for proposal XX/XX.“

Auf dem Bildschirm zur Wiederaufnahme eines Vertrags wurden widersprüchliche Übersetzungen für den deutschen Markt korrigiert. Statt „verlängern?“ wird nun „wieder aufnehmen?“ angezeigt, und statt „den Lebenslauf“ erscheint „die Wiederaufnahme“.