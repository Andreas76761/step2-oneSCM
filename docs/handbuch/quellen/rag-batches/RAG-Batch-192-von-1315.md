# Batch 192 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 12 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Revenue Management – Neuerungen und Korrekturen**

**Freigabe von Gutschriften nach Vertragskündigung**
Wird ein Vertrag innerhalb der Kulanzfrist gekündigt und ist die ursprüngliche Rechnung bereits exportiert, erstellt oneSCM automatisch eine Gutschrift. Als Rechnungsreferenz wird dabei die oneSCM-Rechnungsnummer angegeben. Die Annahme einer solchen Gutschrift ist künftig an Bedingungen geknüpft: Die ursprüngliche Rechnung muss eine „FI System Invoice Number“ erhalten haben, und diese Nummer dient als Rechnungsreferenz der Gutschrift. Wenn die Gutschrift zur Freigabe an den MO-Benutzer gelangt, ist die Schaltfläche „Accept“ nur aktiv, wenn die Rechnungsreferenz befüllt ist und der „FI System Invoice Number“ der ursprünglichen MPPI-Rechnung entspricht. Ist die Rechnungsreferenz leer, bleibt die Schaltfläche deaktiviert, und der MO-Benutzer kann die Gutschrift nicht freigeben. So wird die Gutschrift korrekt mit dem ursprünglichen Vorgang verknüpft, und die Nachvollziehbarkeit in den Finanzdaten bleibt gewährleistet.

**Verarbeitung der oneERP-E169-Rückmeldedatei**
Enthält eine E169-Rückmeldedatei Rechnungen im Status „FI Doc Created“, die auf „Cancelled“ (9999999999) oder „Error“ (8888888888) gesetzt werden, wird bei der Verarbeitung nur der Rechnungsstatus aktualisiert. Die „FI System Invoice Number“ bleibt unverändert. Die Aktualisierung richtet sich nach dem aktuellen Status der Rechnung:

Hat die Rechnung den Status „EXPORTED“, werden bei einer Stornierung Rechnungsdatum und Rechnungsstatus (CANCELLED) aus der Eingangsdatei übernommen. Bei einem Fehler erfolgt keine Aktualisierung. Bei erfolgreicher Buchung werden Rechnungsdatum, FI-Systemnummer, Rechnungsstatus (FI_DOC_CREATED), Nettobetrag und Steuerbetrag übernommen; der Steuerbetrag wurde bisher nicht aktualisiert.

Hat die Rechnung den Status „FI_DOC_CREATED“, wird bei einem Fehler der Status auf ERROR und bei einer Stornierung auf CANCELLED gesetzt. Bei erfolgreicher Buchung ist keine Aktualisierung erforderlich.

Außerdem wurden zwei Fehler behoben: Internationale Werkstattrechnungen werden nun über die Rückmeldedatei verarbeitet. Zudem werden internationale Werkstattrechnungen, die keinem Vertrag zugeordnet sind, vom E169-Batchjob exportiert.

**Verbesserungen für MBLD**
Nach Abstimmung mit dem Vertragsmanagement wird die Bedingung geändert: Statt der Division „Passenger Cars“ gelten nun der Source Channel „Leasing“ und das Source System „MBLD“. Dadurch funktioniert die Funktion für Passenger Cars und VAN gleichermaßen. Diese Änderung befindet sich derzeit noch im BAT-Test und ist dort blockiert.

**Admin-Bereich der Rechnungen: neue Spalte und neuer Filter**
Benutzer mit Zugriff auf den Admin-Bereich der Rechnungen sehen in der Ergebnistabelle die neue Spalte „Workshop Invoice Number“. Zusätzlich steht unter „More filters“ ein gleichnamiger Filter zur Verfügung. Die Auswahl „Invoices“ führt zur Suchseite mit einem Filterbereich und einer Ergebnistabelle. Die Filterfelder im Pop-up sind: OneSCM invoice number, Workshop Invoice Number, FI System invoice number, Document type, Customer Invoice type, Invoice date from, Invoice date to, Invoice recipient name, Chassis number und License plate. Die Funktionen der Schaltflächen „Apply“ und „Cancel“ bleiben unverändert.

Die Ergebnistabelle zeigt folgende Spalten: OneSCM invoice number, Workshop Invoice Number, FI System invoice number, Invoice status, Document type, Customer invoice type, Invoice date, Invoice date from, Invoice date to, Net Amount, Currency, Contract number, Processing number, Collective customer invoice, Invoice recipient number, Invoice recipient name, Chassis number, License plate und Action. Bei Rechnungen, die keine Werkstattrechnungen sind, bleibt die Spalte „Workshop Invoice Number“ leer. Das Design entspricht der Mercedes-Benz Workbench und der vom Kunden validierten UI-Gestaltung.

**Weitere Korrekturen**
Die Händlerfelder werden nun auch dann zurückgesetzt, wenn die „Partner Number – Vega ID“ ungültig ist. In der Übersicht der Materialnummern wird beim Zurücksetzen der Filter keine aufklappbare Zeile mehr angezeigt. Ebenfalls behoben wurde, dass der Download der i156-Datei über den Cross File Transfer nicht funktionierte. Darüber hinaus wurden Probleme mit E169-Batchjobs behandelt, die im Status „Started“ verblieben, sowie die Anzeige aller verfügbaren Materialnummern auf der Übersichtsseite.