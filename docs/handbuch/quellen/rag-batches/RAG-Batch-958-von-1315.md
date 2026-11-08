# Batch 958 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Reifenprodukte über das Baumuster (BM6) konfigurieren**

Wenn Sie ein Angebot mit einem BM6 als Identifier erstellen, liefert das System jetzt alle passenden Reifenprodukte zurück. Zuvor wurde unabhängig vom verwendeten Identifier immer nur genau eine Reifenart mit einer Reifengröße zurückgegeben. Sie können nun ein Reifenprodukt auswählen und in der Produktdetailansicht konfigurieren.

Zusätzlich zu Vertragslaufzeit, Jahreslaufleistung und Zahlungsintervall stehen in der Produktkonfiguration zwei neue Dropdown-Felder zur Verfügung: Reifenart und Reifengröße. Die Werte dafür stammen aus Stream 1. Wählen Sie zuerst eine Reifenart, werden bei der Reifengröße nur die dazu passenden Werte angezeigt. Wählen Sie zuerst eine Reifengröße, werden bei der Reifenart nur die dazu passenden Werte angezeigt. Sobald die Felder konfiguriert sind, wird der Preis aktualisiert. Reifenart und Reifengröße erscheinen anschließend im Feld „Technische Spezifikation“ neben den eingeschlossenen Leistungen („Included Coverages“). Ändern Sie die Auswahl, passt sich der Preis an die neue Konfiguration an. Optionale Felder wie Händlerrabatt, Kampagnen, optionale Leistungen und technische Optionen lassen sich ebenfalls konfigurieren. Ist für das gewählte Produkt keine technische Option verfügbar, wird der Reiter „Technische Optionen“ ausgegraut.

Wird ein Preisangebot per E-Mail versendet oder gedruckt, enthält die Vorlage die ausgewählte Reifenspezifikation, also Reifengröße und Reifenart.

**Fortfahren mit der Vertragserstellung**

Möchten Sie mit der Vertragserstellung fortfahren, müssen Sie eine Fahrgestellnummer oder eine Bestellnummer angeben. Anhand dieser Angabe ruft das System die Fahrzeug- und Produktservices auf und ermittelt das passende Produkt. Dabei sind drei Fälle zu unterscheiden.

Ist für das Produkt eine Konfiguration vorhanden, bleibt die bestehende Konfiguration erhalten und der Preis wird bei Bedarf angepasst. Die Dropdown-Felder für Reifenart und Reifengröße werden entfernt, und die „Technische Spezifikation“ wird mit der Reifenart und der Reifengröße aus den Produktdaten befüllt. Anschließend können Sie mit der Erstellung fortfahren.

Ist zwar das Produkt, aber keine Konfiguration vorhanden, werden die konfigurierbaren Felder (Laufzeit, Laufleistung und Zahlungsintervall) zurückgesetzt, sodass Sie das Produkt neu konfigurieren können. Auch hier werden die Dropdown-Felder für Reifenart und Reifengröße entfernt und die „Technische Spezifikation“ mit den Werten aus den Produktdaten befüllt. Der Preis des Angebots wird aktualisiert, und Sie können mit der Erstellung fortfahren.

Wird kein passendes Produkt gefunden, erscheint die Fehlermeldung „Product Not Found“. Sie können dann zur Produktauswahl zurückkehren oder einen anderen Identifier eingeben.

Beim Wechsel zur Vertragserstellung berücksichtigt das System die Reifenart und Reifengröße, die nach Eingabe der Fahrgestell- oder Bestellnummer aus den Produkt- und Fahrzeugdaten übernommen wurden. Die weitere Vertragserstellung erfolgt wie im bisherigen Prozess.

**Verträge mit elektronischer Signatur abschließen**

Sowohl für private als auch für gewerbliche Verträge lässt sich ein Vertrag mit einer verfügbaren Fahrgestellnummer erstellen, per elektronischer Signatur unterzeichnen und aktivieren. Anschließend können die Bestätigungs-E-Mail und die Aktivierungs-E-Mail geprüft werden. Dieser Ablauf wird durch automatisierte Qualitätssicherungstests abgedeckt.