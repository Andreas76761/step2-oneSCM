# Batch 1205 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kampagnen verwalten: Kampagne mit neuem Rabatttyp „Sticker Price" anlegen**

Als MPC-Benutzer können Sie eine Kampagne anlegen, in der Sie für ein Produkt und dessen Cluster direkt Nettopreise vorgeben. So haben Sie eine genauere und feinere Kontrolle über den Endpreis. Öffnen Sie dazu die Kampagnenübersicht und klicken Sie auf „Create Campaign". Daraufhin startet ein Assistent mit drei Schritten: „Campaign Setup", „Discounted Products & Vehicles" und „Campaign Summary". Im Assistenten steht ein Bereich mit Schaltflächen zur Verfügung, deren Auswahl vom jeweiligen Schritt abhängt. Verfügbar sind „Cancel", „< Back" (im ersten Schritt nicht erforderlich), „Next >" (im letzten Schritt nicht erforderlich) und „Submit" (nur im letzten Schritt).

**Schritt 1: Campaign Setup**

Der erste Schritt entspricht dem bisherigen ersten Schritt der Kampagnenanlage. Der einzige Unterschied ist, dass die Dropdown-Liste für den Rabatttyp um die Option „Sticker Price" erweitert wurde. Sobald alle Pflichtfelder ausgefüllt sind, können Sie zum nächsten Schritt wechseln und dort die Rabatte festlegen. Zu den Pflichtangaben gehören unter anderem der Kampagnenname, der Rabatttyp sowie Start- und Enddatum, die Sie über einen Datumsauswahldialog festlegen. Die Karenzzeit (Grace Period) tragen Sie als numerischen Wert in Tagen ein. Fehlt der Kampagnenname, das Start- bzw. Enddatum oder der Rabatttyp, erscheint eine Validierungsmeldung und Sie können nicht fortfahren.

**Schritt 2: Discounted Products & Prices**

Im zweiten Schritt legen Sie die rabattierten Preise fest. Anders als bei den übrigen Rabattoptionen definieren Sie bei „Sticker Price" nicht den Rabattbetrag, sondern direkt den rabattierten Produktpreis.

Der Bereich trägt den Titel „Select the Product and define the discounted prices for each cluster". Angezeigt werden nur veröffentlichte Produkte und Cluster der aktuell gültigen Preisversion. Wenn Sie ein Produkt auswählen, werden darunter die verfügbaren Cluster aufgelistet. Standardmäßig ist das erste Produkt mit dem ersten Cluster vorausgewählt. Es kann jeweils nur ein Produkt ausgewählt werden. Anschließend können Sie nacheinander jeden Cluster öffnen und dafür rabattierte Preise festlegen. Sobald für einen Cluster mindestens eine Zelle befüllt ist, erscheint neben diesem Cluster ein Häkchen. Wenn Sie auf einen Cluster klicken, öffnet sich rechts die Preismatrix.

Die Preismatrix ist zunächst leer, und Sie tragen dort die rabattierten Preise ein, die für den Cluster gelten sollen. In der ersten Spalte wird die Laufleistung in Kilometern dargestellt (zum Beispiel 0; 5.000; 10.000; 15.000), in der Kopfzeile die Laufzeit in Monaten (zum Beispiel 6; 12; 18; 24). In die Tabelle können nur Ziffern mit bis zu zwei Nachkommastellen eingegeben werden. Es muss mindestens eine Ziffer eingegeben werden, und der kleinste zulässige Wert ist 1. Zulässig sind maximal sieben Ziffern, davon zwei Nachkommastellen (zum Beispiel 49.999,99). Die Preise werden in EUR ohne Mehrwertsteuer erfasst.

In der rechten Ecke der Preismatrix befindet sich ein Symbol. Fahren Sie mit der Maus darüber, erscheint der Tooltip „See original prices and discounted amount". Dann zeigt die Tabelle die Originalpreise des referenzierten Clusters sowie den Rabattwert, der sich aus den von Ihnen festgelegten rabattierten Preisen ergibt. Ist für eine Zelle ein rabattierter Preis definiert, wird der Originalpreis durchgestrichen dargestellt. Andernfalls wird der Originalpreis normal angezeigt.

Wenn Sie für einen Cluster rabattierte Preise festgelegt haben und dann einen anderen Cluster desselben Produkts auswählen, werden die Änderungen gespeichert. Wählen Sie dagegen ein anderes Produkt mit einem anderen Cluster, erscheint ein Hinweisfenster mit dem Text: „Your changes will be lost. The changes you have made will not be updated and they will be lost. Are you sure you want to proceed?" Mit „Proceed" schließen Sie das Hinweisfenster und die Bearbeitungsansicht, und alle Änderungen werden verworfen. Mit „Cancel" schließen Sie nur das Hinweisfenster, und die Bearbeitungsansicht bleibt geöffnet.

Die Schaltfläche „Next" wird erst aktiv, wenn für mindestens ein Produkt und einen Cluster ein rabattierter Preis definiert ist. Andernfalls können Sie nicht zum nächsten Schritt wechseln.

**Schritt 3: Campaign Summary**

Der letzte Schritt der Kampagnenanlage ist die Zusammenfassung. Hier sehen Sie alle Einstellungen der neuen Kampagne ausschließlich lesend.

Im Kopfbereich werden der Kampagnenname (zum Beispiel „Winter Sales") und die Beschreibung der Kampagne angezeigt. Wurde das optionale Beschreibungsfeld nicht befüllt, erscheint stattdessen ein „-". Der Bereich „Campaign Setup" zeigt alle Angaben aus Schritt 1: die Karenzzeit (Grace Period, ≥ 0), die interne Beschreibung (oder „-", falls nicht befüllt), den Vertriebskanal (zum Beispiel „Stationary Retail Sales (stand-alone)"), die Kostenstelle (zum Beispiel 20-000000), die Kontonummer (zum Beispiel 1234567890), die Provisionskomponente (zum Beispiel 123) sowie die externe Kampagnen-ID (zum Beispiel N380, oder „-", falls nicht befüllt).

Im Bereich „Products and Vehicles" werden alle Produkte mit den in Schritt 2 ausgewählten Clustern angezeigt, und zwar jene, für die ein rabattierter Preis definiert wurde. Für jeden Cluster wird zusätzlich der durchschnittlich gewährte Rabatt pro Monat berechnet und angezeigt (zum Beispiel „C-Class AMG Electric Average Discount: 34,00 EUR/month").

**Schaltflächen und Navigation**

In der Zusammenfassung ist „Cancel" immer aktiv. Klicken Sie darauf, erscheint die Meldung: „You have unsaved changes that will be lost. The changes you have made will not be updated and they will be lost. Are you sure you want to proceed?" Mit „Cancel" im Hinweisfenster schließen Sie das Fenster und bleiben auf der aktuellen Seite. Mit „Proceed" gelangen Sie zurück zur Kampagnenübersicht. Die Schaltfläche „Back" führt Sie zum vorherigen Schritt und speichert die auf dieser Seite vorgenommenen Änderungen. „Submit" ist aktiv, sobald alle Pflichtfelder gültige Angaben enthalten. Mit „Submit" wird die Kampagne in der Datenbank gespeichert und oben in der Liste der Kampagnenübersicht angezeigt.

Allgemein gilt für die Navigation im Assistenten: „Cancel" ist stets aktiv. „Next" wird erst aktiv, wenn alle Pflichtfelder ausgefüllt sind, und führt zum nächsten Schritt, wobei die Änderungen der aktuellen Seite gespeichert werden. „Back" führt zum vorherigen Schritt und speichert ebenfalls die Änderungen der aktuellen Seite. „Cancel" schließt den Kampagnenassistenten, ohne Änderungen zu speichern, und leitet Sie zur Kampagnenübersicht weiter.