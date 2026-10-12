# Batch 1137 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Calculation**

Im Konfigurationsdialog für Deckungen (Coverages) werden alle Basisdeckungen angezeigt. Mehrere Deckungen lassen sich per Mehrfachauswahl gleichzeitig konfigurieren. Das Feld „Cost Unit" ist standardmäßig mit „Mercedes-Benz" vorbelegt. Wird „Customer" gewählt, wird der Wert korrekt gespeichert. Bei der Auswahl von „Supplier" erscheint ein Dropdown mit Lieferantennamen. Die Lieferantendaten (Name und Kreditorennummer) werden im Payload gespeichert. Außerdem gibt es die Checkbox „Exclude from Vega", die standardmäßig nicht aktiviert ist.

Auch das Layout der Deckungstabelle wurde angepasst: Die Spalte „Action" entfällt, und die Spalte „Supplier Name" wird angezeigt, sofern sie relevant ist. Oberhalb der Tabelle steht das Dropdown „Configure" zur Verfügung.

Die Vertragskalkulation berücksichtigt weitere Szenarien bei der Konfiguration und Fahrzeugprüfung: die Behandlung einer Sonderfallanfrage, die Übermittlung einer korrigierten Liste aus der Contract-Domäne sowie Fahrzeuge mit ungültiger Produktanwendbarkeit. Bei Letzteren werden die Anwendbarkeit des aktuellen Produkts und der Konfiguration, das Vorhandensein eines gültigen FRD (sofern zutreffend) und das Vorliegen von Daten zum tatsächlichen Kilometerstand (Actual Mileage, sofern zutreffend) geprüft. Ebenso wird eine Liste von Fahrzeugen validiert, bei denen alle Datenpunkte (Produkt, FRD, Kilometerstand) korrekt sind.

Für Eingabefelder gelten folgende Vorgaben: Das Feld „Additional Information" ist optional und akzeptiert 0 bis 2000 Zeichen. Der Produktname darf bis zu 50 Zeichen lang sein. Zudem wird geprüft, dass das Mapping korrekt erfolgt, wenn der OTR-Kraftstofftyp mit der Produktzuordnung des Vertrags übereinstimmt.

Bei einer Änderung des Zahlungsintervalls werden Brutto- und Nettobetrag pro Intervall neu berechnet. Das gilt für folgende Wechsel: von einmalig (One Time) auf monatlich und auf vierteljährlich, von monatlich auf einmalig und auf halbjährlich, von jährlich auf monatlich und auf halbjährlich sowie von halbjährlich auf vierteljährlich und auf einmalig.

**Regeln zur Weitergabe von Änderungen aus Markteinstellungen und Produkt**

Diese Regel befindet sich derzeit noch im Status „AQA Testing" und wurde in der INT-Umgebung anhand von Tests überarbeitet. Sie gilt für Änderungen auf Produktebene und in den Markteinstellungen und steht im Zusammenhang mit der Preisversion (Price Version, PV) und der Vier-Augen-Freigabe.

Auf Produktebene lösen folgende Änderungen die Regel aus: optionale Deckungen oder Karosseriedeckungen, Branchencodes, die Preismatrix, die Kostenstelle (Cost Unit) für Basisdeckungen, technische Optionen bei Reifenprodukten sowie Kontingent oder Laufzeit bei Kontingentprodukten. Auf Marktebene sind es Optionen vor oder nach der Aktivierung sowie Inflationswerte.

Bei bestehenden Produkten werden Änderungen nur an Preisversionen im Status „Draft" weitergegeben, und zwar nur, wenn diese aktuell oder zukünftig sind. Bei neu erstellten oder duplizierten Preisversionen werden die neuen Werte im Rahmen der Erstellung übernommen.

Das Verhalten hängt vom PV-Datum und vom Vier-Augen-Status ab. Bei zukünftigen Entwürfen erfolgt die Weitergabe automatisch (Live Propagation), und das System muss den Benutzer mit einem sichtbaren Hinweis darüber informieren, dass aufgrund einer Änderung auf globaler Ebene eine Live-Weitergabe stattgefunden hat. Bei aktuellen Entwürfen ist die Konstellation noch zu bestätigen; es ist zu klären, ob dieser Fall überhaupt möglich ist. Befindet sich eine Kampagne im Status „In Review", werden Weitergabe und Bearbeitung vollständig gesperrt, damit die Vier-Augen-Prüfung auf einem unveränderten Datenstand erfolgt. Kampagnen im Status „Approved" sind unabhängig vom PV-Datum (aktuell, zukünftig oder abgelaufen) sowohl für automatische Weitergabe als auch für direkte Bearbeitung gesperrt. Bei zukünftigen genehmigten Kampagnen wird vor Bearbeitungen ein Hinweis angezeigt.

Sind nach einer Genehmigung Änderungen nötig, muss der Benutzer die Funktion „Duplicate" verwenden, um eine neue bearbeitbare Instanz zu erstellen. Beim Duplizieren einer Kampagne (aktuell, zukünftig oder abgelaufen) holt das System die jeweils neuesten weitergegebenen Werte aus den Markteinstellungen und von der Produktebene und wendet sie auf die neue Instanz an. Bei abgelaufenem PV-Datum findet weder eine Live-Weitergabe noch eine direkte Statusänderung statt; solche Kampagnen bleiben schreibgeschützte historische Datensätze, sofern sie nicht dupliziert werden.