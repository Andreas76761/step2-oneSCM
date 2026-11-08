# Batch 1157 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragskalkulation – Neuerungen und Änderungen**

**Verlängerung von MBLD-Verträgen**
Bei der Verlängerung von MBLD-Verträgen (EDGE) stellt das System nun dieselben Interpolationspreise und dieselbe Laufzeit bereit wie bei der ursprünglichen Kalkulation. Bisher war für diese Verträge nur die Vertragsaktivierung möglich. Die Verlängerung wird manuell vom Market Operations (MO) angestoßen, nachdem es sich mit dem MBLD-Leasing-Team abgestimmt hat. Dazu klickt der MO auf „Prolongate“, sieht die Gesamtlaufleistung (interpolierte Gesamtlaufleistung) in einem Dropdown und kann sie bearbeiten. Die jährliche Laufleistung wird nur angezeigt und kann nicht geändert werden. Zusätzlich sieht der MO den auswählbaren Zeitraum. In der übermittelten Payload werden die Preise gemäß der Interpolation für MBLD gesendet, die Gesamtlaufleistung wird eindeutig definiert, und alle Parameter der Produktkonfiguration, einschließlich der jährlichen Laufleistung, werden mitgesendet.

**Wetterprofil für das Produkt „Reifen Limited“**
Für das Produkt „Reifen Limited“ kann nun ein Wetterprofil definiert werden. In Schritt 6 der Produktanlage und -bearbeitung steht dafür ein Mehrfachauswahl-Dropdown mit den fest hinterlegten Werten „Summer“, „Summer/Winter“ und „All-Season“ zur Verfügung. Ein Tooltip erläutert die Werte. Das Feld darf nicht leer bleiben: Ist kein Wetterprofil ausgewählt, zeigt das System eine Validierungsfehlermeldung und verhindert das Speichern. Die Zuordnung des Produkts zu den gewählten Wetterprofilen wird gespeichert.

Auch in der Preisgestaltung ist das Wetterprofil berücksichtigt: Nutzer können für jede Kombination aus Reifentyp und Wetterprofil einen eigenen Preis anlegen, und die Preisberechnung wendet die Regeln für Produkte mit zugewiesenem Wetterprofil korrekt an. Die konfigurierten Wetterprofile werden in der Payload an die Generation übermittelt, die Payload enthält dafür einen neuen Parameter. Die Generation wählt die passenden Reifen anhand des Wetterprofils aus; technische Optionen sind dafür nicht erforderlich, und es erfolgt kein Abgleich mit der Fahrzeug-ID.

**Weitere Verbesserungen in der Vertragskalkulation**
Die Provision wird auf Basis der Summe aus Grundpreis, Preisen der technischen Optionen und Branchenfaktor berechnet und korrekt im Fahrzeuggesamtpreis sowie im Brutto-Kundenpreis berücksichtigt.

Führende, nachgestellte und mehrfach aufeinanderfolgende Leerzeichen in Texteingabefeldern werden entfernt bzw. zusammengefasst. Dies gilt insbesondere für das Feld „Version Name“.

Für die Fahrzeuggruppen steht ein zusätzlicher Filter für das maximale Gesamtgewicht (Max Total Weight) zur Verfügung. Er funktioniert sowohl beim Anlegen als auch beim Bearbeiten bestehender Fahrzeuggruppen. Das maximale Gesamtgewicht wird für die Baureihen 907 und 910 berechnet und angezeigt; bei allen anderen Baureihen erscheint „NA“. Die Spalten der Ergebnistabelle wurden entsprechend angepasst. Die Filter sind in folgender Reihenfolge angeordnet: Als Hauptfilter dienen Klasse, Baureihe, Motortyp und maximales Gesamtgewicht, als Sekundärfilter Aufbau, Motorleistung und Antriebsformel.