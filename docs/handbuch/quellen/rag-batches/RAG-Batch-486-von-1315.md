# Batch 486 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**System-interne Benachrichtigungen**

Das System versendet automatisch Benachrichtigungen zu Vorgängen, die eine Bearbeitung erfordern. Diese Benachrichtigungen werden den Benutzern der Market Operation angezeigt, damit sie sie prüfen und verarbeiten können. Der Benutzer, der den Vorgang angelegt hat, erhält dazu keine Benachrichtigung. Ziel ist ein direkter Freigabeprozess auf Basis von Benachrichtigungen zwischen den Benutzern. Erweiterte Funktionen wie Zuweisung und das Schließen des Kreislaufs sind für spätere Ausbaustufen vorgesehen.

**Anwendungsfall: Manuell erstellte Rechnungen oberhalb eines Schwellenwerts**

Eine Benachrichtigung wird ausgelöst, wenn eine Rechnung von einem Market-Operation-Benutzer manuell angelegt wurde (Rechnungstyp MANU), sich im Status „Created“ befindet und einen festgelegten Schwellenwert überschreitet. Derzeit ist ein Platzhalterwert von 100 Euro hinterlegt. Der tatsächliche Wert muss bei Bedarf vom jeweiligen Markt festgelegt werden. Wichtig: Der Benutzer, der die Rechnung manuell angelegt hat, kann diese nicht selbst freigeben.

In der Navigationsleiste sehen Market-Operation-Benutzer ein Glockensymbol mit der Anzahl der offenen Benachrichtigungen. Die Anzahl wird bis 9 angezeigt. Liegt sie darüber, erscheint „9“ mit einem Pluszeichen.

Ein Klick auf das Glockensymbol öffnet auf der rechten Seite das Benachrichtigungscenter. Dort sehen die Benutzer, welche Benachrichtigungen ihre Aufmerksamkeit erfordern. Jede Benachrichtigung ist mit der zugehörigen Seite verlinkt, damit die Freigabe einfach und klar durchgeführt werden kann. Ist nur eine Rechnung freizugeben, lautet die Meldung „Please approve invoice #Rechnungsnummer“ mit dem Link „Go to invoices“, der zur Rechnungsseite führt. Sind mehrere Rechnungen freizugeben, lautet die Meldung „Please approve multiple invoices“ und verweist auf die Rechnungsübersicht. Das Benachrichtigungscenter lässt sich über das X schließen, anschließend kehrt der Benutzer zur vorherigen Ansicht zurück. Benachrichtigungen, die eine Aktion erfordern, sind mit einem blauen Punkt markiert. Hat der Benutzer eine Benachrichtigung nur angesehen, ohne eine Aktion auszuführen, wird sie nicht mehr am Glockensymbol angezeigt. Sie bleibt aber gültig, und der Benutzer kann sie später aufrufen und dann die erforderlichen Aktionen durchführen. Wurde die Benachrichtigung durch eine Aktion (Freigabe oder Ablehnung) erledigt, wird sie dort nicht mehr angezeigt.

Bei genau einer freizugebenden Rechnung öffnet ein Klick auf die Benachrichtigung die entsprechende Rechnungsseite. Dort stehen zusätzlich Symbole zum Ablehnen und Freigeben zur Verfügung. Beim Überfahren mit der Maus wird jeweils ein Tooltip angezeigt. Außerdem gibt es einen Link zur Vertragsnummer, der zur Vertragsseite im Vertragsmanagement führt. Über die Zurück-Schaltfläche gelangt der Benutzer zur vorherigen Seite. Die Benachrichtigung bleibt gültig, solange weder Freigabe noch Ablehnung erfolgt ist.

Bei mehreren freizugebenden Rechnungen führt die Benachrichtigung zur Rechnungsübersicht. Diese ist bereits vorgefiltert und zeigt nur Rechnungen, die manuell erstellt wurden, sich im Status „Created“ befinden, den Schwellenwert von 100 Euro überschreiten und bei denen noch keine Aktion wie Annehmen oder Ablehnen durchgeführt wurde. Rechnungen, die eine Aktion erfordern, sind mit einem blauen Punkt gekennzeichnet. Für eine so markierte Rechnung stehen in der Übersicht nur die Aktionen „View“, „Edit“ und „History“ zur Verfügung. Ein Klick auf eine mit blauem Punkt markierte Benachrichtigung bzw. Rechnung leitet den Benutzer zur Rechnungsseite weiter, auf der er die Rechnung ablehnen oder freigeben kann.

Wird eine Rechnung freigegeben oder abgelehnt, wird die Historie der Rechnung um die durchgeführte Aktion ergänzt. Der blaue Punkt wird nicht mehr angezeigt, die Benachrichtigung entfällt, und der Zähler am Glockensymbol wird aktualisiert.

**Hinweis zum zweiten Anwendungsfall**

Ein weiterer Anwendungsfall, bei dem Kampagnen mit Kulanzzeitraum (Grace Period) bei der Vertragserstellung eine Benachrichtigung an den MPC auslösen sollten, wurde als nicht mehr gültig gekennzeichnet und ist an anderer Stelle abgedeckt. Er ist daher nicht Bestandteil dieser Funktion.