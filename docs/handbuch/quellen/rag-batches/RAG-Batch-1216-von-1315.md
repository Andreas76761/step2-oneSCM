# Batch 1216 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragsprüfung (Contract Review): Prüfprofile verwalten**

Bisher wird in oneSCM für abgelaufene oder beendete Verträge keine abschließende Endabrechnung durchgeführt, bevor der Status auf „Geschlossen“ gesetzt wird. Mit der Vertragsprüfung steht dafür ein neuer Bereich zur Verfügung. Benutzer mit der Rolle MPC oder MO finden ihn im Admin-Bereich unter „Contract Review Profiles“. Der Zugriff ist auf diese beiden Rollen beschränkt. Dort lassen sich Prüfprofile einsehen, anlegen und bearbeiten, die anschließend in der Produktkonfiguration ausgewählt werden können, um die Logik und die Aktionen der Vertragsprüfung festzulegen. Die Produktdefinition muss dafür eine Möglichkeit bieten, vorhandene Profile auszuwählen.

**Die Übersichtsseite**

Im oberen Bereich der Übersichtsseite stehen Suchfelder zur Verfügung: ein Datum (es werden Profile gefunden, die an diesem Tag angelegt wurden), der Name des Prüfprofils, der Anwendungsbereich (Mehrfachauswahl aus Leasing, Standalone und Finance) sowie die Genehmigungsart (Einzelauswahl aus Automatic, Manual und Threshold). Über „More Filters“ öffnet sich ein Dialog für zusätzliche Filter. Die Suche wird über die Schaltfläche „Search“ ausgelöst, wobei die Suchfelder mit UND verknüpft werden. Über das „X“ wird der eingegebene Suchtext gelöscht, sodass neue Werte eingegeben werden können. Wird nichts Passendes gefunden, erscheint die Meldung „No data to display“.

Darunter wird angezeigt, wie viele Datensätze von der Gesamtzahl dargestellt werden. Die Schaltfläche „Create Review Profile“ führt zur Seite, auf der neue Profile angelegt werden. Pro Seite können 10, 20, 30, 40 oder 50 Einträge angezeigt werden. Die Ergebnisse lassen sich sortieren.

Die Profiltabelle zeigt den Namen des Profils als Hyperlink, der zu einer schreibgeschützten Ansicht der Profilkonfiguration führt. Außerdem werden der Review-Typ, der Anwendungsbereich und die Division angezeigt, für die das Profil gilt. In der Spalte zur Unterkilometer-Regelung (Undermileage) steht entweder „No Compensation“ oder, bei „Compensation on Request“ bzw. „Compensation“, die definierte Toleranz, etwa „Compensation on Request >5%“ oder „Compensation >5 EUR“. Die zugehörige Genehmigung wird als Automatic, Manual oder, bei Threshold, als „Manual above [Wert]“ mit Währung dargestellt. Analog zeigt die Spalte zur Mehrkilometer-Regelung (Overmileage) entweder „No Customer Charge“ oder die Toleranz bei „Customer Charge“, zum Beispiel „Customer Charge >5%“ oder „Customer charge >5 EUR“, samt Genehmigungsart. Weitere Spalten sind das Erstellungsdatum und die Benutzer-ID des Erstellers. Über die Aktionen können Profile bearbeitet oder gelöscht werden.

**Ein neues Prüfprofil anlegen**

Über „Admin-Bereich → Contract Review Profiles → Create Review Profile“ gelangen Sie zur Profileinrichtung. Zunächst werden die Grunddaten erfasst, die alle Pflichtfelder sind: der Profilname als Texteingabe (jeder Name darf nur einmal vergeben werden), der Review-Typ (Auswahl „Final“), der Anwendungsbereich (Standalone, Leasing und Finance, Mehrfachauswahl möglich) und die Division (Passenger Cars; die Anzeige von „Vans“ ist für den Rollout nicht vorgesehen). Zusätzlich können Produkte (Excellent, Advance, Compact) per Mehrfachauswahl zugeordnet werden.

Danach folgen unter „Define Tolerances and Approvals“ zwei getrennte Bereiche für Mehr- und Minderkilometer.

Im Bereich „Define Overmileage“ ist die Auswahl zwischen „No Customer Charge“ und „Customer Charge“ ein Pflichtfeld. Bei „No Customer Charge“ erscheinen keine weiteren Felder. Bei „Customer Charge“ werden Tolerance, Maximum Charge und Approval angezeigt. Tolerance und Maximum Charge sind optional und bieten jeweils die Auswahl „Percentage“ oder „Absolute Amount“. Je nach Auswahl erscheint ein passendes Eingabefeld: Prozentwerte werden numerisch eingegeben und automatisch mit % dargestellt, absolute Beträge numerisch mit bis zu neun Stellen und Tausendertrennzeichen (z. B. 5.000 bzw. 15.000). Bei Approval stehen „Automatic“, „Manual“ und „Threshold“ zur Wahl. Bei „Threshold“ wird zusätzlich ein Schwellenwert mit bis zu neun Stellen und Tausendertrennzeichen eingegeben (z. B. 10.000).

Im Bereich „Define Undermileage“ stehen „No Compensation“, „Compensation on Customer Request“ und „Compensation“ zur Auswahl. Bei „No Compensation“ werden keine weiteren Felder angezeigt. Bei den beiden anderen Optionen erscheinen Tolerance, Maximum Charge und Approval, die genauso funktionieren wie im Bereich Overmileage.

Mit dem „X“ wird die Aktion abgebrochen und Sie kehren zur Seite der Prüfprofile zurück. Mit „Submit“ wird ein neues Prüfprofil ohne zeitliche Begrenzung angelegt, und Sie werden zur Profilübersicht weitergeleitet. Es können mehrere Profile mit unterschiedlichen Konfigurationen angelegt werden, solange ihre Namen eindeutig sind. Wie das Bearbeiten und Löschen von Profilen im Detail funktioniert, ist in den vorliegenden Informationen noch nicht festgelegt.

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem mit dem Kunden abgestimmten UI-Design.

**Hinweis zum dritten Ticket**

Zum Eintrag „Test User profile settings | Damage code – Verify that filtering is saved“ liegen nur die Überschrift und der Status „In Review“ vor. Da keine weiteren Angaben vorhanden sind, habe ich dazu keinen Text für das Benutzerhandbuch formuliert.