# Batch 1118 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Verkaufslogik (Vertragsstart) in Blueprint und Produkt**

Die Verkaufslogik wurde in Blueprint und Produkt erweitert. Sie dient als Grundlage für Zertifizierte Gebrauchtwagen (CPO) und für Garantieverlängerungen, also Folgeprodukte oder Verlängerungen, die erst nach Ablauf der Herstellergarantie beginnen. Der Vertrag kann damit das Startdatum eines Vertrags berechnen. Die Dauer der Herstellergarantie wird je Markt in den Markteinstellungen hinterlegt. Zwei Felder werden dabei kombiniert, zum Beispiel 24 Monate Herstellerdauer plus 12 Monate Marktdauer ergeben insgesamt 36 Monate. Die Erweiterung unterstützt die korrekte Anwendung der Startdatumslogik für Garantieverlängerungen (Versicherungsprodukt).

Genutzt wird die Funktion von der Zentrale (HQ) bei der Einrichtung des Blueprints sowie von der MPC bei der Anlage eines Garantieverlängerungsprodukts.

Im Blueprint heißt das Feld nun „Sales Logic" mit dem Zusatz „(Contract start date)", damit erkennbar ist, dass es das Startdatum des Vertrags steuert. Es gilt für alle Divisionen und alle Blueprint-Typen. Die bisherigen Auswahlmöglichkeiten „FRD Related" und „FRD Not Related" werden durch drei Werte ersetzt: „FRD", „Sales date" und „Future date". „FRD" entspricht dem bisherigen „FRD Related", wobei der Zusatz „Related" entfällt und die Funktionalität unverändert bleibt. „Sales date" entspricht dem bisherigen „FRD Not Related" und bezieht sich auf das Datum der Angebotserstellung. Auch hier bleibt die Funktionalität unverändert. „Future date" ist neu und steht für ein zukünftiges Datum, etwa das Ende der Garantiedauer oder das geplante Vertragsende des ursprünglichen Produkts. Auf Blueprint-Ebene können mehrere dieser Werte gleichzeitig ausgewählt werden. Das neue Kontrollkästchen „Future date" ist zunächst nicht ausgewählt.

Wird aus einem Blueprint ein Produkt erstellt, werden nur die dort aktivierten Werte übernommen. Im Schritt „Sales and Contract Configurations" des Produkts zeigt das Feld „Sales Logic" ausschließlich diese Werte an. Hier ist nur eine Einfachauswahl möglich, die MPC wählt also genau einen der Werte FRD, Sales date oder Future date. Beim Speichern der Produktkonfiguration wird der gewählte Wert mit den Produktdaten an den Vertrag übermittelt. Die bestehende Verknüpfung der Produktlimits mit der Verkaufslogik bleibt in ihrer Logik erhalten, bezieht sich aber nun auf die neuen Werte.

Bestehende Blueprints und Produkte werden per Migration in der Datenbank angepasst. „FRD Related" wird zu „FRD" und „FRD Not Related" zu „Sales date". Bestehende Produktkonfigurationen und Verträge berechnen das Startdatum dadurch weiterhin genau wie bisher. Nach der Migration zeigt das Feld „Sales Logic" in jedem bereits vorhandenen Blueprint und Produkt einen gültigen umgewandelten Wert an, nie ein leeres Feld oder eine alte Bezeichnung.

**Hinweis zu „Leasing Operator Role and functionalities"**

Für dieses Thema liegen in den Rohdaten nur leere Vorlagentexte vor, also keine inhaltlichen Angaben zu Rolle, Funktionen, Nutzern, Ziel oder Verhalten. Ein Handbuchtext lässt sich daraus nicht formulieren, ohne Inhalte zu erfinden. Sobald das Ticket ausgearbeitet ist, kann der Abschnitt ergänzt werden.