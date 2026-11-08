# Batch 238 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 17 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Zahlungsdauer**

Die Zahlungsdauer auf dem Reiter „Payment“ wird nun in allen relevanten Szenarien korrekt aktualisiert. Bei Einmalzahlungsverträgen entspricht sie der Vertragslaufzeit. Beträgt die Laufzeit beispielsweise 24 Monate (12.12.2023 bis 11.12.2025), so wird auch die Zahlungsdauer mit diesem Zeitraum angezeigt. Wird ein Vertrag mit monatlicher Zahlung vorzeitig auf eine Einmalzahlung umgestellt (Early Settlement), bleibt die Zahlungsdauer unverändert und entspricht weiterhin der Vertragslaufzeit.

Bei monatlich bezahlten Verträgen mit Preisumverteilung (Reallocation) weicht die Zahlungsdauer von der Vertragslaufzeit ab. Sie beginnt erst nach Ablauf des Umverteilungszeitraums, also am Startdatum der Rechnungsperiode, und endet mit dem Vertragsende. Bei einer Vertragslaufzeit vom 12.12.2023 bis 11.12.2025 und einer Umverteilung über sechs Monate lautet die Zahlungsdauer somit 12.06.2024 bis 11.12.2025.

Wird bei einem Einmalzahlungsvertrag eine Short-Term-Extension (STE) um „n“ Monate durchgeführt, wird die Zahlungsdauer entsprechend angepasst und entspricht wieder der neuen Vertragslaufzeit. Bei einer Verlängerung um sechs Monate ergibt sich aus 12.12.2023 bis 11.12.2025 beispielsweise der Zeitraum 12.12.2023 bis 11.06.2025 (30 Monate).

Auch bei einer Langzeitverlängerung (Long Term Extension) reicht die Zahlungsdauer vom Vertragsbeginn bis zum Vertragsende zuzüglich der Verlängerung um „n“ Monate. Dies gilt für folgende Konstellationen: monatliche Zahlung bei einem monatlich bezahlten Vertrag, Einmalzahlung bei einem monatlich bezahlten Vertrag, Einmalzahlung bei einem Einmalzahlungsvertrag sowie monatliche Zahlung bei einem Einmalzahlungsvertrag. Wurde bei einem monatlich bezahlten Vertrag eine Umverteilung durchgeführt, gilt das Startdatum der Rechnungsperiode als Beginn der Zahlungsdauer. Dasselbe gilt bei einer Verlängerung mit Einmalzahlung für einen monatlich bezahlten Vertrag, wenn sich die Rechnung zum Zeitpunkt der Verlängerung im Status „Planned“ befindet.

**Rechnungen und Schnittstellen**

Für Rechnungen zu Dealer Discounts (DD) und Kampagnen wird der Zeitraum „Invoice to“ nun vom Vertragsstart bis zum Vertragsende gesetzt. Zuvor war er auf Vertragsstart bis Vertragsstart festgelegt.

Beim Revenue-Event an Nemesis wurden einzelne Attribute angepasst. Das Feld „CustomerInvoiceDate“ übermittelt jetzt das Enddatum der Rechnungsperiode der aktuellen Rechnung. Die Felder „AmountDebitNote“ und „AmountCreditNote“ enthalten kumulierte Beträge: Zum einen die Summe aller Rechnungen vom Typ MANU und COMP des Vertrags, zum anderen die Summe aller entsprechenden Gutschriften.

In der Rechnungssuche zeigt der Status „Created“ nicht mehr zusätzlich Rechnungen im Status „FI Doc Created“ an. Beim E169-Export wurde zudem das Problem behoben, dass für die Fahrzeugidentnummer (VIN bzw. FIN) der Wert NULL ausgegeben wurde.

**Konfiguration und Stammdaten**

Im Configuration Service funktioniert die Änderung der Marktsprache wieder. Zahlenformat und Dezimalstellen aus der Konfiguration der Vertragserstellung werden in der Vorschau des Zahlungsplans nun berücksichtigt. Der MPC PM erhält Zugriff auf die Markt-Konfigurationseinstellungen, und der MPC kann wieder Schadencodes anlegen.

Bei der Pflege von Steuerarten und Steuersätzen wurden Verbesserungen vorgenommen: Eine Steuerart mit bereits vorhandenem Namen kann nicht mehr angelegt werden. Beim Bearbeiten eines Steuersatzes wird das Erzeugen eines doppelten Steuersatzes nicht mehr ohne Fehlermeldung zugelassen. Zudem wurde die Vorbelegung der Steuerart mit „VAT“ im Zusammenhang mit der Nicht-Editierbarkeit des Feldes bearbeitet.

**Benutzeroberfläche**

In den Bereichen Revenue Management und Cost Management, etwa bei Rechnungen, Financial Control und Batch Jobs, wurden die Symbole für Suchen und Zurücksetzen einheitlich durch neue Symbole ersetzt, die einer fachlichen Anforderung entsprechen.