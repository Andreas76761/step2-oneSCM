# Batch 239 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 8 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Anpassung der Texte im E169-Export je nach Rechnungstyp**

Die Texte im Export der Schnittstelle E169 werden künftig abhängig vom Rechnungstyp angepasst. Bei Kundenrechnungen (reguläre Rechnungen, Export-Typ SG) bleibt der Kopftext (HTXT01) leer, da die frühere Cut-Off-Monat-Logik nicht mehr verwendet wird und der Text damit überflüssig ist. Die notwendigen Vertragsangaben werden stattdessen im Positionstext (PTXT01) des Vertrags aufgeführt. Der Schlusstext (HTXT02) bleibt eine allgemeine Nachricht wie bisher, wird aber fest in der Datei hinterlegt. Das Unterschriftenfeld (HTXT06) bleibt leer. Im bisherigen Verfahren war eine Unterschrift nur bei Gutschriften erforderlich, um gemäß Gutschriftenrichtlinie und Vier-Augen-Prinzip die Freigabe zu belegen. In oneSCM wird der Freigabeprozess im System selbst ausgelöst. Da dort nachvollziehbar ist, wer den Status der Gutschrift geändert hat, ist die Richtlinie weiterhin erfüllt. Der Positionstext enthält zusätzlich die festen Texte „Abrechnung Ihres Vertrages <Produktname>“ und „Zahlungsweise: <Zahlungsweise des Vertrags>“, gefolgt von weiteren Angaben wie Fahrzeugnummer, Abrechnungszeitraum und Umsatzsteuer.

Bei Händlerrabatten (EXTSUB) bleiben Kopftext, Schlusstext und Unterschriftenfeld leer, weil die Beschreibung bereits über die Bezeichnung des in NACOS verwendeten Materials vorhanden ist. Der Positionstext enthält „Dealer Subvention for“ sowie Kunde, Vertragsnummer, Produkt, MB-Auftragsnummer (Auftragsnummer des Fahrzeugs) und Leistungserstellungsdatum.

Bei Händlerprovisionen (EXTCOM) bleibt der Kopftext aus demselben Grund leer. Der Schlusstext bleibt eine allgemeine Nachricht, die fest in der Datei hinterlegt wird. Das Unterschriftenfeld bleibt leer. Der Positionstext enthält Kundenname, Vertragsnummer, MB-Auftragsnummer und Leistungserstellungsdatum.

Für internationale Serviceverträge enthält der Kopftext eine Sammelrechnung für den internationalen SIVECO-Prozess mit Angabe des Rechnungsstellers (MBVD / VEGA-Mandat, wobei die Nummer der VEGA-ID des Marktes entspricht) und des Rechnungszeitraums. Dieser reicht vom Datum des letzten Imports der E169 mit internationalen Rechnungen bis zum Datum des aktuellen Imports. Im Unterschriftenfeld stehen „gez.i.V. Blendow“ und „gez.i.V. Rinke“. Der Positionstext enthält Fahrgestellnummer, Abrechnungszeitraum, Vertragsnummer, Rechnungsnummer der Werkstatt, Belegdatum, Leistungsdatum der Reparatur und Kilometerstand bei der Reparatur. Je Reparatur werden Reparaturbetrieb, Schadenscode-Beschreibung, Gesamtkosten in EUR mit Lohn, Material und Fremdleistung, die Rechnungssumme (Nettobetrag der Position) sowie Umsatzsteuersatz und Nettobetrag ausgewiesen. Bei mehreren Reparaturen werden diese nummeriert aufgeführt, gefolgt von den summierten Gesamtkosten. Die endgültige Festlegung dieser Texte erfolgt in einem separaten Vorgang.

Für die Altteilsteuer wird im Kopftext erläutert, dass im Rahmen der Servicevertragsabwicklung die Altteilsteuer für den Buchungszeitraum abgerechnet wird. Sie ergibt sich aus der zum Leistungszeitraum gültigen Mehrwertsteuer auf 10 % der Differenz (60er Teil) zwischen dem zu verbauenden aufbereiteten Teil (Tauschteil, auch 80er Teil genannt) und dem „alten“ Teil (70er Teil), das an das Logistik-Center verkauft wird. Der Buchungszeitraum reicht vom Datum des letzten Imports der i156 mit Altteilsteuer bis zum Datum des aktuellen Imports. Der Text steht auf Englisch und Deutsch zur Verfügung. Der Positionstext enthält die zugehörige Antragsnummer bzw. Rechnungsnummer der Werkstatt. Auch hier erfolgt die endgültige Festlegung in einem separaten Vorgang.

**Batch-Job-Seite: Aktualisieren- und Zurück-Schaltfläche**

Auf der Batch-Job-Seite gab es bislang weder eine Schaltfläche zum Aktualisieren noch eine Zurück-Schaltfläche. Nun wird nach dem Start eines Batch-Jobs eine Aktualisieren-Schaltfläche angeboten, mit der sich der aktuelle Ausführungsstatus des Batch-Jobs abrufen lässt. Außerdem wurde eine Zurück-Schaltfläche ergänzt: Wird über „Ansehen“ eine Datei zum Download geöffnet, gelangt man damit wieder zur ursprünglichen Batch-Job-Seite.

**Verbesserungen bei Batch-Jobs und Suche**

Bei den Batch-Jobs wurden Indexoperationen ergänzt. Dabei wurde behoben, dass das Filtern nach einer nicht vorhandenen oneSCM-Rechnungsnummer dazu führte, dass alle Shards fehlschlugen. Zudem wurde die Textsuche nach vollständigen und unvollständigen Vertragsnummern korrigiert, bei der das Zeichen „/“ Probleme verursachte.

**Behobener Fehler beim Export-Job**

Ein Fehler, durch den der Job NACOSInvE169EXP fehlschlug, wurde behoben.