# Batch 210 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Verwaltung von Materialnummern**

Mit dem Wechsel von NACOS zu oneERP benötigt oneSCM mehrere Materialnummern, die für den Rechnungsprozess unverzichtbar sind, da sie die Grundlage für die Erstellung der SD-Orders bilden. Laut Vorgabe von oneERP gibt es pro Produktlinie eigene Materialnummern. Dadurch steigt die Anzahl der Materialnummern, die oneSCM verwalten muss. Fehlen die Materialnummern, laufen alle Datensätze, die an oneERP gesendet werden, in einen Fehler. Die neue Materialnummernverwaltung steht ausschließlich HQ-Admins zur Verfügung, die als neue Rolle eingeführt wird. Sie ermöglicht es, die Materialnummern zu pflegen, wenn eine neue Produktlinie angelegt wird oder oneERP Materialnummern ändert.

**Zugang und Übersicht**

Die Verwaltung finden Sie im HQ-Konfigurationsmenü unter „Material Numbers Management". Der Bereich ist nur für HQ-Admins sichtbar und nur für Märkte verfügbar, in denen oneERP als FI-System eingeführt ist. Für jede Kombination aus Division und Produktlinie werden drei Arten von Materialnummern gepflegt: Invoice (verpflichtend), MOT (optional) und OldPartTax (optional). Einen Sonderfall bildet SIVECO, das der Struktur Division, Produktlinie, Materialnummer nicht folgt. Deshalb enthält die Auswahlliste der Produktlinien zusätzlich den Wert SIVECO.

Sind noch keine Materialnummern vorhanden, erscheint anstelle der Ergebnisse der Text „There are no Material number available". Sind bereits Materialnummern in der Datenbank vorhanden, werden sie beim Öffnen der Seite angezeigt. Die Suchkriterien bleiben erhalten. Angezeigt werden nur gültige Materialnummern, also solche, deren Gültigkeitszeitraum den heutigen Tag einschließt.

Die Ergebnistabelle enthält die Spalten Materialnummer (die heute gültige Nummer), Division, Produktlinie, Materialnummerntyp, Gültigkeit und Aktionen. Hat eine Kombination aus Division und Produktlinie mehrere Gültigkeiten, lässt sich die Zeile aufklappen. In einem Unterbereich werden dann alle Gültigkeiten mit Materialnummer, Gültigkeit, Änderungsdatum, Bearbeiter und Aktionen angezeigt. Die Aktionen „Bearbeiten" und „Löschen" sind nur sichtbar, wenn das Startdatum der Gültigkeit in der Zukunft liegt. Die Materialnummer ist dann noch nicht im Einsatz und darf geändert oder gelöscht werden.

**Materialnummern hinzufügen**

HQ-Admins müssen für alle Kombinationen aus Division und Produktlinie Materialnummern hinterlegen. Ohne Materialnummer funktioniert der E169-Export nicht. Fehlt für eine Rechnung die Invoice-Materialnummer, wird in Datadog ein Fehler angezeigt und die Rechnung nicht exportiert.

Über die Schaltfläche „Add Material Number" legen Sie neue Materialnummern in drei Schritten an. In Schritt 1 wählen Sie Division und Produktlinie aus jeweils einer Dropdown-Liste; beide Angaben sind verpflichtend, und die Produktlinien-Liste enthält auch den Wert SIVECO. In Schritt 2 wählen Sie im verpflichtenden Mehrfachauswahlfeld „Material Number Type" einen oder alle der Werte Customer Invoice, Legal Inspection Tax (MOT) und Old Part Tax. In Schritt 3 wird für jeden gewählten Typ eine Gruppe von Feldern mit einer Beschriftung und drei Pflichtfeldern angezeigt. Das Eingabefeld für die Materialnummer ist erst sichtbar, nachdem Division und Produktlinie gewählt wurden, und erlaubt nur die Zeichen A–Z und 0–9. „Valid From" ist ein Kalenderfeld, das frühestens mit dem morgigen Tag beginnt. „Valid To" ist ebenfalls ein Kalenderfeld und mit dem 31.12.2099 vorbelegt. Beide Datumsangaben müssen dem in den Markteinstellungen gewählten Format entsprechen.

Mit „Cancel" brechen Sie den Vorgang ab und gelangen zurück zur Suchseite. Die Schaltfläche „Create" ist ausgegraut, solange nicht alle Pflichtfelder ausgefüllt sind. Beim Anlegen prüft das System, ob für dieselbe Kombination aus Division und Produktlinie bereits eine Materialnummer existiert. Ist das nicht der Fall, wird die neue Materialnummer gespeichert, Sie werden zur Suchseite weitergeleitet, und die neue Nummer erscheint in der Tabelle.

Überschneidet sich die Gültigkeit mit einer vorhandenen Materialnummer, erscheint ein Popup mit dem Hinweis, dass für dieselbe Kombination bereits Materialnummern mit überlappender Gültigkeit existieren und dass sich die Gültigkeit der bisherigen Nummern ändert, wenn Sie fortfahren. Mit „Cancel" schließen Sie das Popup und kehren mit allen bisherigen Eingaben zur Erstellungsseite zurück. Mit „Proceed" wird das Popup geschlossen, und die Gültigkeit der bestehenden Materialnummern endet einen Tag vor dem Startdatum der neuen Nummer. Ein Beispiel: MAT_Numbers_1 ist vom 01.01.2024 bis 31.12.2099 gültig. Wird MAT_Numbers_2 ab dem 15.01.2025 bis 31.12.2099 angelegt, endet die Gültigkeit von MAT_Numbers_1 am 14.01.2025. Lücken in der Gültigkeit sind zulässig. In diesem Fall funktioniert der E169-Export jedoch nicht, und in Datadog wird ein Fehler angezeigt.

**Bearbeiten und Löschen**

Die Aktion „Bearbeiten" ist nur sichtbar, wenn die Materialnummer erst in der Zukunft gültig wird. Es öffnet sich eine neue Seite, auf der Division und Produktlinie mit den Daten der gewählten Materialnummer vorbelegt sind. Je nach Typ wird der passende Bereich für Kunde, MOT oder Old Part Tax angezeigt. Bearbeitbar sind Materialnummer, „Valid From" und „Valid To". Erfolg und Fehler werden über Toast-Meldungen angezeigt.

Eine Materialnummer kann nur gelöscht werden, wenn sie nicht in Verwendung ist und in der Zukunft liegt. Auch hier erscheinen Toast-Meldungen für Erfolg und Fehler.

**Export nach E169, E167 und E174**

Beim Export wird die Logik zur Ermittlung der Materialnummern in den Dateien E169, E167 und E174 angepasst. Die Materialnummer wird anhand von Division, Produktlinie und Gültigkeit aus der HQ-Materialnummerntabelle ermittelt. Abhängig vom Rechnungstyp wird die passende Materialnummer gewählt; ein Erstattungsfall wird beispielsweise in der E169 mit der Kunden-Materialnummer exportiert. Für SIVECO werden die dafür hinterlegten Materialnummern aus der HQ-Verwaltung verwendet, obwohl SIVECO keine Produktlinie im eigentlichen Sinn ist.

Die Exportdateien werden zudem je Division und Produktlinie erzeugt. Dafür ändert sich die Namenskonvention der Dateien E169, E167 und E174: Die Division wird in den Dateinamen aufgenommen, zum Beispiel E169EXP_20240715_082552_5727_SAP_PC_S_2407.dat oder E169EXP_20240715_082552_5727_SAP_VAN_S_2407.dat.