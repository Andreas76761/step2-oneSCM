# Batch 1243 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Produktübersicht in der Produktkalkulation**

Über das Hauptmenü der Produktverwaltung erreichen Sie den Menüpunkt „Products & Prices". Wenn Sie ihn auswählen, öffnet sich die Produktübersicht. Dort sehen Sie als MPC-Benutzer alle Produkte Ihres Marktes, und ausschließlich die Produkte Ihres Marktes. Sie können die Produkte einsehen, durchsuchen und verwalten. Beim Aufruf der Seite wird die Produktliste automatisch mit den verfügbaren Einträgen geladen. Standardmäßig werden Produkte in den Status Draft, Created, Ready, Published und Deactivated angezeigt. Gelöschte Produkte sind zunächst ausgeblendet.

**Suche und Filter**

Der obere Bereich der Seite trägt den Titel „Search Products". Er enthält ein Suchfeld mit dem Platzhalter „Product Name". Mit einem X-Symbol im Feld lässt sich der eingegebene Text löschen. Die Suche bezieht sich auf den Produktnamen: Ein Produkt wird gefunden, wenn der Suchbegriff an beliebiger Stelle im Namen vorkommt. Die Suche starten Sie mit der Schaltfläche „Search & Filter". Mit „Reset" setzen Sie alle Suchbegriffe, Filter und das Häkchen für gelöschte Produkte zurück, sodass die Liste wieder ungefiltert angezeigt wird.

Zusätzlich stehen Filter als Mehrfachauswahl-Dropdowns zur Verfügung, deren Inhalte aus dem Blueprint stammen. Verfügbar sind Division (z. B. Passenger Car), Brand (z. B. Mercedes Benz), Blueprint (z. B. Excellent), Assigned Prices (Draft Products – No prices possible, Ready Products – No prices assigned, Prices assigned) sowie Status (Draft, Created, Ready, Published, Deactivated, Deleted). Die Filter bauen aufeinander auf: Eine Auswahl schränkt die Optionen in den nachfolgenden Filtern ein. Wählen Sie beispielsweise Passenger Car, werden im Brand-Filter nur Marken aus diesem Bereich angeboten. Bei der Auswahl in einem Filter werden bereits gesetzte Filter weiterhin berücksichtigt. Über die Schaltfläche „More filters" können weitere Filter ausgewählt und mit „Filter" angewendet werden.

Mit dem Kontrollkästchen „Show deleted products" steuern Sie die Anzeige gelöschter Produkte. Ist es aktiviert, zeigt die Tabelle ausschließlich gelöschte Produkte. Ist es deaktiviert, werden die Produkte in den Status Draft, Created, Ready, Published und Deactivated angezeigt.

**Produktbereich und Tabelle**

Der Bereich darunter trägt den Titel „Overview". Dort wird angezeigt, wie viele Einträge von der Gesamtzahl der Produkte aktuell dargestellt werden („Displaying number_of_items_per_page of number_of_total_products"). Über ein Dropdown wählen Sie die Anzahl der Einträge pro Seite: 10, 20, 30, 40 oder 50. Voreingestellt sind 10. Die Liste wird entsprechend der Auswahl aufgeteilt. Außerdem gibt es eine Schaltfläche „Create". Was nach ihrer Betätigung geschieht, wird in einem anderen Epic beschrieben.

Die Tabelle enthält die Spalten Division, Product Name, Brand, Blueprint, Assigned Price, Validity, Status und Actions. Jede Zeile steht für ein Produkt. Über die Spaltenüberschriften können Sie die Sortierung ändern, etwa von A–Z auf Z–A und zurück. Standardmäßig sind die Produkte alphabetisch nach Division sortiert. Gibt es keine Produkte, die angezeigt werden können, erscheint die Meldung „There are no products to display".

Die Spalte „Assigned Price" zeigt drei mögliche Darstellungen: „N/A" bei Produkten im Status Draft, ein deaktiviertes Preis-Symbol, wenn noch keine Preisversion zugeordnet ist (Status Created), und ein aktiviertes Preis-Symbol, wenn mindestens eine Preisversion zugeordnet ist (Status Ready, Published, Deactivated). Ein Klick auf eines der Symbole führt zur Übersicht der Preisversionen.

Die Spalte „Validity" zeigt je nach Status unterschiedliche Zeiträume. Bei Ready sind es das nächste Start- und Enddatum der Preisgültigkeit, bei Published das aktuelle Start- und Enddatum. Bei Deactivated werden das vergangene Start- und Enddatum angezeigt, oder das nächste Start- und Enddatum, falls bereits eines existiert.

In der Spalte „Actions" öffnet eine Schaltfläche eine Liste der Aktionen, die für den jeweiligen Status des Produkts möglich sind. Die Ergebnisse dieser Aktionen werden in anderen Epics beschrieben.

**Gestaltung**

Die Oberfläche folgt der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.