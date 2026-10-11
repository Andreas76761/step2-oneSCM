# Batch 666 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Sammelrechnung auf Kundenebene („Global Collective Invoice")**

Kunden mit mehreren Serviceverträgen können festlegen, wie ihre Rechnungen erstellt werden: eine Rechnung je Vertrag, eine gemeinsame Rechnung für alle Serviceverträge oder eine kombinierte Variante. Diese Präferenz wird über den Schalter „Global Collective Invoice" in der Kundenverwaltung gesteuert. Sie dient dazu, das Sammelrechnungsverhalten an die Verträge des jeweiligen Kunden weiterzugeben. Sie ist nicht als Lösung gedacht, bei der die Einstellung auf Kundenebene regelmäßig für die Rechnungsstellung geprüft werden muss.

**Neuer Kunde in der Vertragserstellung**

Wenn Sie in der Vertragserstellung einen Servicevertrag für einen neuen Kunden anlegen, finden Sie im Assistenten in Schritt 2 „Customer & Payment Information" den Schalter „Global Collective Invoices". Er ist für neue Kunden editierbar und standardmäßig auf „Ja" gesetzt. „Ja" bedeutet, dass Sammelrechnungen auf Kundenebene gelten. „Nein" bedeutet, dass auf Kundenebene keine Sammelrechnungen gelten. Ein Tooltip erläutert die Funktion: „Define if the customer's contracts will be included in the Global Collective Invoices". Der anfangs gewählte Wert gilt für den aktuellen Vertrag und für alle zukünftigen Verträge des Kunden.

In Schritt 3 „Overview & Confirmation" sehen Sie unter „Customer" im Bereich „Preferences" den Schalter „Global Collective Invoices" mit dem zuvor gewählten Status und dem Tooltip. Im Bereich „Payment Information Details" wird das deaktivierte Attribut „Collective Invoices" angezeigt. Es hat den Wert „Included", wenn der Schalter auf „Ja" stand, und „Excluded", wenn er auf „Nein" stand.

**Bestehender Kunde: Änderung in der Kundenverwaltung**

Bei einem bestehenden Kunden ist der Schalter „Global Collective Invoices" in der Kundenverwaltung verfügbar und editierbar, und zwar in der Vorschau der Kundenseite sowie auf der Bearbeitungsseite. Auf der Ansichtsseite wird das Attribut mit den Werten „Ja" oder „Nein" und einem Tooltip angezeigt. Sie können den Schalter von aktiv („Ja") auf inaktiv („Nein") und umgekehrt ändern. Die Änderung wirkt sich ausschließlich auf alle zukünftigen Serviceverträge aus, die nach der Änderung abgeschlossen werden. Ist der Schalter auf „Ja", werden „Collective Invoices" als „Included" geführt, ist er auf „Nein", als „Excluded". Dies können Sie in der Vertragsverwaltung prüfen. Bestehende Verträge bleiben von der Änderung unberührt. Ist für sie eine Anpassung nötig, muss sie auf Vertragsebene erfolgen.

**Bestehender Kunde: neuer Vertrag über die Vertragserstellung**

Wenn Sie in der Vertragserstellung einen neuen Servicevertrag für einen bereits in der Datenbank vorhandenen Kunden anlegen, ist der Schalter „Global Collective Invoices" in Schritt 2 deaktiviert und zeigt die in der Kundenverwaltung hinterlegte Präferenz an. Unter „Payment Information" können Sie für den neuen Vertrag zwischen „Collective Invoices" „Included" oder „Excluded" wählen. Beachten Sie, dass „Global Collective Invoice" bei einem bestehenden Kunden ausschließlich in der Kundenverwaltung bearbeitet werden kann.

**Zusammenspiel von Kunden- und Vertragsebene**

Die Einstellung auf Kundenebene bestimmt automatisch die Voreinstellung aller künftigen Serviceverträge des Kunden. Ist „Global Collective Invoice" aktiv, wird bei diesen Verträgen der Schalter „Collective Invoice" ebenfalls aktiv gesetzt. Ist er inaktiv, wird er bei den Verträgen inaktiv gesetzt. Soll ein Kunde für einen einzelnen Servicevertrag eine abweichende Behandlung der Rechnungen erhalten, wird die Präferenz für diesen Vertrag auf Vertragsebene über „Collective Invoice" festgelegt. Das verändert weder die Einstellung „Global Collective Invoice" auf Kundenebene noch die übrigen Verträge des Kunden.

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.