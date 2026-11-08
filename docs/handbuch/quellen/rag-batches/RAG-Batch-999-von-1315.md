# Batch 999 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung über das Menü „Contract Generation"**

Das Menü „Contract Generation" in der Kopfzeile bietet Händlern und Mercedes-Benz-Organisationen (Dealer / MO) künftig eine Auswahl an Folgeaktionen. Die bisherige Startseite der Vertragserstellung heißt nun „Offer Management". Sie behält alle bisherigen Funktionen, enthält jedoch keine Schaltfläche „Create Contract" mehr. Darüber hinaus steht eine Ansicht zur Verfügung, in der alle Verträge angezeigt werden, die noch nicht den Status „Aktiv" erreicht haben. Die Vertragserstellung selbst starten Sie über den Menüpunkt „Contract Offering".

**Start mit einem beliebigen Identifier**

Die Auswahl des Produkts ist von der eigentlichen Vertragserstellung entkoppelt. Sie können die Vertragserstellung mit jedem Identifier beginnen, der Ihnen gerade vorliegt, sich alle passenden Produkte anzeigen lassen und dann entscheiden, wie Sie fortfahren. Wählen Sie zunächst im Menü „Contract Generation" die Option „Create Contract". Wählen Sie anschließend im Dropdown den Kundentyp „Private" oder „Commercial". Erst nach dieser Auswahl wird das Eingabefeld für den Identifier freigeschaltet. Zulässig sind Fahrgestellnummer (Chassis Number), Bestellnummer (Order Number, Build to Order), Modellcode (Baumuster) und Deal Id (VdZ).

**Eingabe von Fahrgestellnummer, Bestellnummer oder Deal Id**

Geben Sie eine Fahrgestellnummer, Bestellnummer oder Deal Id ein, werden aus der Vertragskalkulation (Contract Calculation) die passenden Produkte geladen. Sie können diese auswählen, vergleichen und konfigurieren. Mit der Auswahl eines Produkts gelangen Sie in die Produktdetailansicht. Dort ist die Schaltfläche „Create Contract" zunächst deaktiviert. Sie konfigurieren das Produkt über Laufzeit, jährliche Fahrleistung und Zahlungsintervall. Sobald die Konfiguration abgeschlossen ist, wird die Schaltfläche aktiviert. Zugleich werden der Händlerrabatt (Dealer Discount) und, sofern verfügbar, Kampagnenanfragen (Request Campaigns) freigeschaltet. Ein Klick auf „Create Contract" führt Sie in den Ablauf der Vertragserstellung mit den Kunden- und Zahlungsinformationen („Customer & Payment Information").

**Eingabe eines Modellcodes (Baumuster)**

Geben Sie einen Modellcode ein, werden ebenfalls die passenden Produkte aus der Vertragskalkulation angezeigt. Nach der Auswahl eines Produkts gelangen Sie in die Produktdetailansicht, wo unterhalb des Konfigurators die Schaltfläche „Add Identifier" erscheint. Konfigurieren Sie zunächst Laufzeit, jährliche Fahrleistung und Zahlungsintervall; der Händlerrabatt wird freigeschaltet. Mit einem Klick auf „Add Identifier" erscheint ein Eingabefeld, in das Sie einen gültigen Identifier für die Vertragserstellung eintragen. Dies kann eine Fahrgestellnummer, Bestellnummer oder Deal Id sein; die Angabe ist ein Pflichtfeld.

Wird eine Fahrgestellnummer eingegeben, ist die Schaltfläche „Create Contract" zunächst deaktiviert, und die Fahrgestellnummer wird angezeigt. Über einen Schalter legen Sie den Fall fest. Ist er ausgeschaltet, liegt der Regelfall vor: Das Erstzulassungsdatum (FRD) und die Fahrleistung werden, sofern Daten vorhanden sind, schreibgeschützt angezeigt, andernfalls können Sie sie manuell eingeben. Ist er eingeschaltet, liegt der Fall „Build to Stock" vor, bei dem die Fahrleistung mit 0 angesetzt wird. FRD und tatsächliche Fahrleistung sind Pflichtfelder. Der angezeigte Preis wird anhand von Fahrgestellnummer, FRD und Fahrleistung aktualisiert. Bereits angewendete Rabatte werden dabei entfernt. Anschließend können Sie Rabatte und Kampagnenanfragen erneut anwenden. Sobald alle Pflichtfelder des Produkts konfiguriert sind, wird „Create Contract" aktiviert. Der Klick darauf führt Sie unter Berücksichtigung der erfassten Fahrzeugdaten zu „Customer & Payment Information", entweder im Regelfall mit vorhandener Fahrgestellnummer, FRD und Fahrleistung oder als Build to Stock, wenn kein FRD vorliegt.

Wird eine Bestellnummer eingegeben, ist „Create Contract" sofort aktiviert. Die Fahrgestellnummer (falls vorhanden) und das Baumuster werden schreibgeschützt angezeigt. Der Preis wird anhand der Bestellnummer aktualisiert, zuvor angewendete Rabatte werden entfernt, und Rabatte sowie Kampagnenanfragen können erneut angewendet werden. Die Schaltfläche „Create Contract" ist nutzbar, sobald alle Pflichtfelder konfiguriert sind. Danach gelangen Sie in den Ablauf der Vertragserstellung für Build to Order, wiederum mit den Kunden- und Zahlungsinformationen.

Bei Eingabe einer Deal Id gilt dasselbe Vorgehen: „Create Contract" ist aktiviert, Fahrgestellnummer (falls vorhanden) und Baumuster werden schreibgeschützt angezeigt, der Preis wird anhand der Deal Id aktualisiert, und zuvor angewendete Rabatte werden entfernt. Rabatte und Kampagnenanfragen können erneut angewendet werden. Der Klick auf „Create Contract" führt in den Ablauf der Vertragserstellung für die Deal Id (VdZ) mit den Kunden- und Zahlungsinformationen.

**Fehlermeldungen**

Wird ein Identifier nicht als Deal Id, Bestellnummer oder Fahrgestellnummer erkannt, erscheint die Meldung „Your Identifier could not be recognized". Passt ein Identifier zwar, für die Eingabe sind aber keine Produkte verfügbar, erscheint die Meldung „Your Identifier did not return any results". In beiden Fällen, bei nicht erkanntem Format ebenso wie bei erkanntem Format ohne Produkte, wird zusätzlich eine entsprechende Fehlerseite angezeigt.

**Gestaltung**

Die Oberfläche entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.