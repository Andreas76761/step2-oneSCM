# Material zu 10 Ohne Unterkapitel-Zuordnung

Kapitel 10 Verträge im Alltag verwalten. 12 Abschnitte aus den RAG-Batches, automatisch zugeordnet, redaktionell zu prüfen.

## [Batch 47.4] Lebenszyklus und Export

Ein MDCR durchläuft den üblichen Dokumentenlebenszyklus: Erstellt, Akzeptiert, Exportiert, FI Doc erstellt, anschließend Bezahlt bzw. Mahnstufe. Der Export an das Finanzsystem erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. In der Exportdatei ist der Positionstext befüllt und der Kopftext leer.

## [Batch 57.6] Lebenszyklus und Export

MDCR-Dokumente durchlaufen den üblichen Lebenszyklus: Created → Accepted → Exported → FI Doc Created → Paid/Dunning Level. Es gelten die bestehenden Regeln für Statusübergänge, und die Validierungen des Standardablaufs können nicht umgangen werden. Der Export erfolgt über den Standard-Batchjob E169/CoFiCo/SWT. In der Exportdatei stehen der Kunden-Dokumenttyp „MDCR“, der gewählte Dokumentempfänger mit SAP-Debitorennummer sowie Netto-, Steuer- und Gesamtbetrag und die Steuerklassifizierung gemäß der Standardstruktur. Der Positionstext wird im Positionsdatensatz übertragen, der Kopftext bleibt leer. Es werden dort weder Berechnungstext noch Genesis-Nummer oder andere Werte eingetragen.

## [Batch 355.3] Anzeige im Contract Management

Nach dem Versand erscheint die E-Mail im Contract Management auf dem Reiter „Communication" im Bereich „Emails". Als Dokumentname wird „Early Settlement" angezeigt, in der Spalte „Date" das Versanddatum, zusammen mit dem passenden Status. Als Aktion steht „Re-send" zur Verfügung.

## [Batch 795.4] Fahrzeug und Anzeige

Im Reiter „Fahrzeug“ wurde die Anzeige „Last Known Mileage (Km)/Date“ entfernt. Die Überschrift „Mileage History“ heißt nun „Vehicle Mileage History“. Die Spalte „Date“ wurde in „Mileage Reading Date“ umbenannt, die Spalte „Mileage“ in „Mileage (Km)“. Die Fahrgestellnummer wird korrekt angezeigt. Das Datumsformat des Felds „Planned Contract End Date“ im Verlauf wurde korrigiert, ebenso die falsche Weiterleitung bei der Produktkompatibilitätsprüfung. Deutsche Sonderzeichen werden wieder richtig dargestellt. Die Reiternamen und das Design in Proposal Management und Contract Management wurden angeglichen.

## [Batch 1103.4] Contract Management und Markt-Konfiguration

Im Contract Management heißt das Suchfeld „Search Contract“ (deutsch: Vertrag suchen). Auf der Startseite und in den Ergebnissen wird die „Contract Number“ als „Reference Number“ (Referenznummer) geführt. In der Markt-Konfiguration unter Timer und Erinnerung wurde „Offer Validity (Days)“ in „Proposal Validity (Days)“ (Antragsgültigkeit) umbenannt.

## [Batch 1257.3] Dependency Definition beim Industry Price Factor

Die „Dependency Definition" ist für alle Divisions auf Werte eingeschränkt, die weder von der Laufleistung noch von der Laufzeit abhängen (mileage/duration-independent). Die Werte „mileageDependent" und „durationMileageDependent" stehen nicht mehr zur Verfügung, es bleibt „durationMileageIndependent". Für den Surcharge stehen weiterhin alle drei Werte zur Verfügung: kein Surcharge, Prozentwert oder Betrag.

## [Batch 1216.3] Ein neues Prüfprofil anlegen

Über „Admin-Bereich → Contract Review Profiles → Create Review Profile“ gelangen Sie zur Profileinrichtung. Zunächst werden die Grunddaten erfasst, die alle Pflichtfelder sind: der Profilname als Texteingabe (jeder Name darf nur einmal vergeben werden), der Review-Typ (Auswahl „Final“), der Anwendungsbereich (Standalone, Leasing und Finance, Mehrfachauswahl möglich) und die Division (Passenger Cars; die Anzeige von „Vans“ ist für den Rollout nicht vorgesehen). Zusätzlich können Produkte (Excellent, Advance, Compact) per Mehrfachauswahl zugeordnet werden.

Danach folgen unter „Define Tolerances and Approvals“ zwei getrennte Bereiche für Mehr- und Minderkilometer.

Im Bereich „Define Overmileage“ ist die Auswahl zwischen „No Customer Charge“ und „Customer Charge“ ein Pflichtfeld. Bei „No Customer Charge“ erscheinen keine weiteren Felder. Bei „Customer Charge“ werden Tolerance, Maximum Charge und Approval angezeigt. Tolerance und Maximum Charge sind optional und bieten jeweils die Auswahl „Percentage“ oder „Absolute Amount“. Je nach Auswahl erscheint ein passendes Eingabefeld: Prozentwerte werden numerisch eingegeben und automatisch mit % dargestellt, absolute Beträge numerisch mit bis zu neun Stellen und Tausendertrennzeichen (z. B. 5.000 bzw. 15.000). Bei Approval stehen „Automatic“, „Manual“ und „Threshold“ zur Wahl. Bei „Threshold“ wird zusätzlich ein Schwellenwert mit bis zu neun Stellen und Tausendertrennzeichen eingegeben (z. B. 10.000).

Im Bereich „Define Undermileage“ stehen „No Compensation“, „Compensation on Customer Request“ und „Compensation“ zur Auswahl. Bei „No Compensation“ werden keine weiteren Felder angezeigt. Bei den beiden anderen Optionen erscheinen Tolerance, Maximum Charge und Approval, die genauso funktionieren wie im Bereich Overmileage.

Mit dem „X“ wird die Aktion abgebrochen und Sie kehren zur Seite der Prüfprofile zurück. Mit „Submit“ wird ein neues Prüfprofil ohne zeitliche Begrenzung angelegt, und Sie werden zur Profilübersicht weitergeleitet. Es können mehrere Profile mit unterschiedlichen Konfigurationen angelegt werden, solange ihre Namen eindeutig sind. Wie das Bearbeiten und Löschen von Profilen im Detail funktioniert, ist in den vorliegenden Informationen noch nicht festgelegt.

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem mit dem Kunden abgestimmten UI-Design.

## [Batch 156.5] Schäden und Ansprüche

Die neue Oberflächenlösung für abgelehnte Schäden bzw. Ansprüche wurde für kontingentbasierte und laufleistungsbasierte Verträge geprüft, jeweils für den Fall, dass nur ein einzelner Schadencode abgelehnt wird, und für den Fall, dass der gesamte Anspruch abgelehnt wird. Voraussetzung ist ein aktiver Vertrag des jeweiligen Typs und eine erzeugte I155-Datei. Zudem wurde ein Fehler behoben, durch den manuell angelegte Schadencodes beim Import überschrieben wurden.

## [Batch 830.4] Speichern und „Open Setup“

Über das „X“ wird der Verlängerungsprozess abgebrochen. Die zuletzt gespeicherte Konfiguration des MO-Benutzers bleibt dabei im Nachtrag (Addendum) erhalten. Besteht eine gespeicherte Konfiguration, wird unter „Status“ › „Prolongate“ eine „1“ angezeigt. Wird der Prozess später erneut gestartet, erscheint oben in Schritt 1 die Schaltfläche „Open Setup“. Ein Klick darauf lädt die zuletzt gespeicherte Konfiguration in Schritt 1, und der Benutzer kann das bestehende Setup neu konfigurieren.

## [Batch 842.3] Entfernte Funktion

Der Bereich „Contract Management" im Admin-Bereich wurde samt der Funktion „Generate i155" vollständig entfernt. Die Erzeugung der i155 steuern Sie nun ausschließlich über den Bereich „Batch Job".

## [Batch 899.6] Produkte mit Ablauf nach Nutzung bzw. Anzahl der Services

Hier gilt dieselbe Struktur wie zuvor beschrieben. Der einzige Unterschied: In der Produktkonfiguration ersetzt die Auswahlliste „Anzahl der Services“ die jährliche Laufleistung. Sie zeigt die für das Produkt wählbaren Werte. Alle übrigen Felder und Funktionen sind identisch.

## [Batch 901.2] Hinweis zu weiteren Inhalten

Das Thema „Get Real Vehicle Mileage (MIC Part 1)“ wurde abgebrochen. Die vorliegenden Angaben enthalten keine Inhalte, die für das Benutzerhandbuch relevant wären, weshalb dazu kein Text formuliert wurde.

