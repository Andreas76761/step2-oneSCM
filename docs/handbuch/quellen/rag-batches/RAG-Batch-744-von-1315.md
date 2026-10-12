# Batch 744 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kostenverwaltung: Startseite und Detailansicht**

Die Startseite der Kostenverwaltung (Cost & Contract Management) bietet einen zentralen Einstieg in die relevanten Finanz- und Fahrzeuginformationen. Sie zeigt eine Liste der im System verfügbaren Verträge und ermöglicht es, gezielt nach Verträgen zu suchen. Damit können Kunden den Kontostand eines ausgewählten Vertrags einsehen, und die Seite bildet die Grundlage für weitere Auswertungen sowie einen Überblick aus buchhalterischer Sicht.

**Suche und Filter**

Die Suche ist über vier Felder möglich: Vertragsnummer, Kundenname, Fahrgestellnummer und Kennzeichen. Wer weitere Suchkriterien verwenden möchte, klickt auf „More Filter“. Es öffnet sich ein Pop-up mit den übrigen Suchkriterien. Diese zusätzlichen Optionen werden erst nach der MVP-Phase festgelegt. Mit der Schaltfläche „Search“ wird die Suche anhand der Eingaben ausgelöst. Alternativ startet die Eingabetaste die Suche, sobald in einem der Suchfelder ein Inhalt steht. Werden mehrere Suchkriterien eingegeben, müssen alle gleichzeitig erfüllt sein (UND-Verknüpfung). Die Suche mit Platzhaltern („*“) ist für die MVP-Phase ausgeschlossen und soll erst später berücksichtigt werden. Die Schaltfläche „Reset“ leert die Suchfelder. Tritt beim Abrufen der Daten ein Fehler auf, erscheint eine Hinweismeldung mit dem Text „No data available“.

**Ergebnisliste**

Standardmäßig werden die ersten zehn der verfügbaren Verträge angezeigt. Über ein Dropdown-Menü („Entries per page“) wählt der Benutzer, wie viele Datensätze gleichzeitig angezeigt werden. Maximal sind 50 Datensätze pro Seite möglich; der 51. Datensatz erscheint auf der zweiten Seite. Die Liste zeigt je Vertrag folgende Felder: Vertragsnummer, Produktname, Fahrgestellnummer, Kundennummer, Kundenname, Erstellungsdatum, Ersteller, Status und Aktion. Die Vertragsnummer ist als Link ausgeführt, über den eine neue Seite mit Informationen zum ausgewählten Vertrag geöffnet wird. Ob weitere Felder, etwa die Kundennummer oder der Kundenname, ebenfalls als Link ausgeführt werden sollen und welche Zielseite dann gelten würde, ist noch offen und wird vom Business Stream 3 geklärt.

**Detailansicht „Price Information“**

Die Seite „Detail View – Price Information“ zeigt detaillierte Informationen zu einer Rechnungsnummer, die zu einem bestimmten Vertrag gehört. Die Daten sind nicht editierbar. Im oberen Bereich befinden sich eine Zurück-Schaltfläche, die zur Übersicht der zu diesem Vertrag gehörenden Rechnungen zurückführt, die Vertragsnummer sowie der aktuelle Kontostand („Current Balance Account“), der aus der Schnittstellendatei i156 stammt.

Im Bereich „Price Information“ werden für die ausgewählte Rechnung folgende Angaben dargestellt, die jeweils aus der Datei i156 übernommen werden: Rechnungsnummer (aus der Claim-Nummer), Händler- bzw. Werkstattname (aus dem VEGA-Händlercode), Reparaturdatum, Datum der Werkstattrechnung, Vega Dealer ID, Kilometerstand der jeweiligen Fahrgestellnummer, Einheit des Kilometerstands sowie der insgesamt akzeptierte Rechnungsbetrag.

**Vega Dealer ID**

Die Vega Dealer ID wird zu einem bestimmten Vertrag und einer Fahrgestellnummer (FIN) in der Detailansicht angezeigt. Quelle ist die Datei i156 (Satzart RC01, Positionen 17 bis 21). Die Datei i156 muss dafür in AWS verfügbar sein, und die Daten müssen jederzeit angezeigt werden können. Beim nächsten Import der i156 werden vorhandene Daten aktualisiert und bei einem erstmaligen Import neue Daten hinzugefügt.

**Zugriff und Hinweise**

Die Detailansicht erreichen Sie, indem Sie die Kostenverwaltung aufrufen und einen bestimmten Vertrag öffnen. Dort wechseln Sie zu den „Payment Details“, wählen die „Workshop Invoice No“ aus und gelangen in die „Detail View“, in der die beschriebenen Werte angezeigt werden.

Bitte beachten Sie, dass die Datei i156 einmal pro Woche erzeugt und verarbeitet wird. Die angezeigten Informationen können daher mindestens eine Woche alt sein. Steht die i156 aus irgendeinem Grund nicht zur Verfügung, werden keine aktualisierten Informationen angezeigt. Zudem dürfen Jobs, die gemeinsame Daten betreffen, nicht gleichzeitig laufen; während des Imports der i156 kann beispielsweise der Job für die i155 nicht gestartet werden.

Die Gestaltung der Oberflächen entspricht der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.