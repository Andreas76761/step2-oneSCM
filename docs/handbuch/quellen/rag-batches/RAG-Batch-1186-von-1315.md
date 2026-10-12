# Batch 1186 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Sonderfall-Kennzeichen pro Produkt (Contract Calculation)**

In der Produktkonfiguration lässt sich für jedes Produkt ein Sonderfall-Kennzeichen („Special Case Flag") festlegen. Damit wird gesteuert, für welche Produkte der Vertrag einen Sonderfall-Ablauf anfordern darf. Das Kennzeichen wird als zusätzliche Option auf der Produktkonfigurationsseite angezeigt, als Schalter oder Kontrollkästchen. Es wird bei der Definition von Produkten für Sonderhändler sowie bei der Erstellung eines Vertrags verwendet. Hintergrund ist, dass nur bestimmte Produkte für einen Sonderfall infrage kommen.

Ob das Kennzeichen gesetzt werden kann, hängt von der Kundenart ab, die im Mehrfachauswahlfeld „Kundentyp" gewählt wurde. Anwendbar ist es für die Kundentypen „Commercial Fleet" und „Commercial Governmental". Für „Private", „Commercial" und „Private Governmental" ist es nicht anwendbar. Die Acceptance Criteria der Anforderung nennen als Voraussetzung für die Bearbeitung ausdrücklich „Commercial Fleet". Wählen Sie mehrere Kundentypen aus, lässt sich das Kennzeichen konfigurieren, solange „Commercial Fleet" in der Auswahl enthalten ist. Ist dies nicht der Fall, wird die Eingabemöglichkeit für das Sonderfall-Kennzeichen deaktiviert (ausgegraut) oder ausgeblendet. Entfernen Sie bei einer bereits gespeicherten Konfiguration „Commercial Fleet" aus der Auswahl, setzt das System das Sonderfall-Kennzeichen automatisch auf „Falsch" bzw. „Aus" zurück.

Für die Bearbeitung eines Produkts gelten dieselben Regeln wie für die Felder der zulässigen Rabatte („Allowed Accessible Discounts").

Das Kennzeichen wird im Datenaustausch an den Vertrag übermittelt, die Nutzdaten (Payload) wurden dafür um das „Special Flag" erweitert. Der Vertrag wird darüber informiert, wie diese Daten zu verarbeiten sind. Fordert der Vertrag einen Sonderfall an, wird der Sonderfall-Ablauf ausgelöst, und zwar genau dann, wenn der Parameter „Special Case Flag" auf „true" gesetzt ist. Ist das Kennzeichen auf „false" gesetzt oder fehlt es, führt das System den regulären Ablauf aus. Das gilt auch dann, wenn der Kundentyp „Commercial Fleet" ist.