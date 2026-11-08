# Batch 457 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Systeminterne Benachrichtigungen (Notification Center)**

Das System versendet automatisch Benachrichtigungen zu Vorgängen, die Aufmerksamkeit erfordern. Diese können von Benutzern der Market Operation geprüft und bearbeitet werden. Der Benutzer, der den Vorgang ausgelöst hat, erhält dazu keine Benachrichtigung. Ziel ist ein direkter Freigabeprozess, der über Benachrichtigungen zwischen den Benutzern abläuft.

**Anzeige und Bedienung des Benachrichtigungscenters**

In der Navigationsleiste zeigt ein Glockensymbol die Anzahl der offenen Benachrichtigungen an. Die Anzeige steigt bis 9. Bei mehr als neun Benachrichtigungen erscheint „9+". Ein Klick auf das Glockensymbol öffnet auf der rechten Seite das Benachrichtigungscenter. Dort sehen Sie, welche Benachrichtigungen Ihre Bearbeitung erfordern. Jede Benachrichtigung ist mit der zugehörigen Seite verlinkt, damit die Freigabe einfach und klar erfolgen kann. Benachrichtigungen, die eine Aktion erfordern, sind mit einem blauen Punkt gekennzeichnet. Über das X schließen Sie das Benachrichtigungscenter und kehren zur vorherigen Ansicht zurück. Wurde eine Benachrichtigung bereits durch eine Aktion erledigt, etwa durch Genehmigen oder Ablehnen, wird sie dort nicht mehr angezeigt. Benachrichtigungen bleiben bestehen, bis die zugehörige Aktion durchgeführt wurde.

**Anwendungsfall 1: Manuell erstellte Rechnungen oberhalb eines Schwellenwerts**

Eine Benachrichtigung wird ausgelöst, wenn Benutzer der Market Operation eine Rechnung manuell erstellen (Rechnungstyp MANU), die sich im Status „Created" befindet und einen Schwellenwert überschreitet. Als Schwellenwert ist derzeit 100 Euro hinterlegt. Das ist ein Platzhalterwert, den der jeweilige Markt bei Bedarf festlegen muss. Der Benutzer, der die Rechnung manuell erstellt hat, kann seine eigene Rechnung nicht genehmigen.

Ist nur eine Rechnung zu genehmigen, lautet die Meldung „Please approve invoice #Rechnungsnummer" mit dem Link „Go to invoices". Der Link führt direkt zur jeweiligen Rechnungsseite. Dort stehen Ihnen Symbole zum Ablehnen und Genehmigen zur Verfügung. Beim Überfahren mit der Maus wird jeweils ein Tooltip angezeigt. Zusätzlich gibt es auf dieser Seite einen Link zur Vertragsnummer, der zur entsprechenden Vertragsseite im Vertragsmanagement führt. Über die Zurück-Schaltfläche gelangen Sie zur vorherigen Seite. Die Benachrichtigung bleibt gültig, solange weder genehmigt noch abgelehnt wurde.

Sind mehrere Rechnungen zu genehmigen, lautet die Meldung „Please approve multiple invoices". Sie ist mit der Rechnungsübersicht verlinkt. Diese Seite ist bereits vorgefiltert und zeigt nur Rechnungen, die manuell erstellt wurden, sich im Status „Created" befinden, den Schwellenwert überschreiten und bei denen noch keine Aktion wie Genehmigen oder Ablehnen durchgeführt wurde. Rechnungen, die eine Aktion erfordern, sind mit einem blauen Punkt markiert. Für sie stehen in der Übersicht nur die Aktionen „View", „Edit" und „History" zur Verfügung.

Nach dem Genehmigen oder Ablehnen wird die Historie der Rechnung um die durchgeführte Aktion ergänzt. Der blaue Punkt wird nicht mehr angezeigt, die Benachrichtigung entfällt und der Zähler am Glockensymbol wird aktualisiert.

**Anwendungsfall 2: Kampagne mit Karenzzeit (Grace Period) bei der Vertragserstellung**

Dieser Ablauf betrifft Kampagnen, die sich noch in der Karenzzeit befinden und beim Verkauf eines Servicevertrags in der Vertragserstellung angeboten werden. Der Händler startet in der Vertragserstellung einen neuen Vertrag und wählt den gewünschten Ablauf (Available Chassis Number, Build to Stock oder Not Available Chassis Number). Anschließend gibt er die Fahrzeugdaten ein und füllt alle Pflichtfelder aus. Die Fahrzeuginformationen und passende Produkte werden aus der Vertragskalkulation abgefragt und samt Preisen und Beschreibung angezeigt. Der Händler wählt ein Produkt und konfiguriert es (Laufzeit, Jahreslaufleistung, Zahlungsintervall). Danach aktiviert er den Link für den Händlerrabatt und wählt einen Rabatt aus. Sind keine Marktkampagnen angewendet, werden alle verfügbaren Kampagnen mit Karenzzeit angezeigt. Der Händler wählt eine solche Kampagne aus, gibt in einem Textfeld eine Begründung ein und sendet die Anfrage ab.

Mit dem Absenden wird das Benachrichtigungscenter ausgelöst und eine Benachrichtigung an den MPC gesendet. Dabei werden folgende Daten übermittelt und gespeichert: Name des Händlers, Datum und Uhrzeit des Versands (systemgeneriert), Kampagnenname, Gültigkeit der Kampagne, Karenzzeit in Tagen, Fahrgestellnummer, Kennzeichen und die Begründung aus der Anfrage. Der Händler erhält die Info-Meldung, dass die Anfrage übermittelt wurde und die zuständige Stelle des Marktes informiert ist und antworten wird.

Der MPC sieht die Benachrichtigung nach einem Klick auf das Glockensymbol im Benachrichtigungscenter. Beim Klick auf die Benachrichtigung öffnet sich ein Popup mit allen Details, in dem der MPC die Anfrage genehmigen oder ablehnen kann. Wird die Anfrage genehmigt, erhält der Händler eine neue Benachrichtigung, dass die Kampagne mit Karenzzeit für den jeweiligen Vertrag genehmigt wurde. Wird sie abgelehnt, erhält er eine Benachrichtigung, dass die Kampagne nicht genehmigt wurde. In beiden Fällen wird die Vertragserstellung über die Genehmigung oder Ablehnung informiert.