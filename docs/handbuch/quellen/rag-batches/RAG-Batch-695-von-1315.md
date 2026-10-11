# Batch 695 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 11 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Cost Management: Neuerungen und Änderungen**

Im Bereich Cost Management wurden mehrere Anpassungen rund um Provisionen, Rechnungen und Werkstattbelege umgesetzt bzw. vorbereitet.

**Provisionen für MBLD-Verträge**

Bisher wurden Händlerprovisionen bei allen Vertragsarten an den Händler gezahlt, der den Vertrag angelegt hat. Für Verträge aus dem Quellsystem bzw. Kanal MBLD gilt nun eine eigene Regel: Die Händlerprovisionsrechnungen (SCOM) werden an den MBLD-Kunden adressiert. Bei allen übrigen Verträgen, die aus einer anderen Quelle stammen, bleibt die im Vertrag als Händlerwerkstatt ausgewählte Werkstatt der Rechnungsempfänger.

In der Konfiguration wird zudem ein MBLD-spezifisches Attribut mit einem Wahrheitswert hinterlegt. Ist es auf „TRUE“ gesetzt, werden die Provisionsrechnungen in die E169-MBLD-Datei exportiert. Andernfalls werden die Rechnungen in den Status „Processed“ gesetzt und nicht an das Finanzsystem (oneERP für DE) exportiert.

Auch die Provisionsbehandlung für Leasingverträge ist als eigenes Thema im Cost Management angelegt. Dazu liegen derzeit noch keine näheren Angaben vor, und der Bearbeitungsstatus ist offen.

**Kein Export von SCOM-Rechnungen für die Division VAN**

Mit den VAN-Kolleginnen und -Kollegen laufen Abstimmungen zur Berechnung der Händlerprovisionen. Da hierzu derzeit keine Einigkeit besteht und die Provisionen aus Sicht von VAN nicht korrekt berechnet werden, sollen sie nicht an das Finanzsystem exportiert werden. Bereits zuvor verhinderte eine Systemfunktion den Export interner SCOM-Rechnungen. Diese Logik wurde nun erweitert: Auch externe SCOM-Rechnungen für externe Händler der Division VAN werden nicht mehr exportiert.

**Manuell erstellte Werkstattrechnungen**

Für manuell erstellte Werkstattrechnungen gelten neue Regeln. Der Rechnungskopftext ist nun ein Pflichtfeld. Daneben wird ein Info-Symbol angezeigt, das beim Überfahren mit der Maus den Hinweis „Please enter meaningful text“ einblendet.

Außerdem ist das Stornieren einer manuell erstellten Werkstattrechnung auf einen Vorgang begrenzt. Dieselbe Rechnung lässt sich also nicht mehrfach stornieren. Wird die dadurch neu erzeugte Rechnung jedoch selbst storniert, kann anschließend eine neue Stornorechnung erstellt werden.

**Qualitätssicherung und Fehlerbehebungen**

Im Rahmen der Prüfung wurden mehrere Szenarien verifiziert: die korrekte Darstellung der Symbole (+ / −) bei generierten Rechnungen, die Optionalität der SAP-Kreditorennummer bei manuellen Werkstattrechnungen sowie die Währungsumrechnung bei OPTI-Rechnungen über den I156-Upload.

Darüber hinaus wurden Meldungen zu folgenden Problemen bearbeitet und geschlossen: Nach einem I156-Datei-Upload wurden weder CLAI noch OPT erzeugt, und die Währungsumrechnung schlug fehl. Eine Meldung zu nicht angezeigten Schadencodes wurde abgebrochen und nicht umgesetzt.