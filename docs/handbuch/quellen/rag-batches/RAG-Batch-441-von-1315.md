# Batch 441 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Systeminterne Benachrichtigungen**

Das System versendet automatisch Benachrichtigungen, wenn Aktionen Aufmerksamkeit erfordern. Diese können dann von Benutzern der Marktorganisation (Market Operation) geprüft und bearbeitet werden. Der Benutzer, der die Aktion ausgelöst hat, erhält dazu selbst keine Benachrichtigung. Ziel ist ein direkter Freigabeprozess auf Basis von Benachrichtigungen zwischen den Benutzern. Erweiterte Funktionen wie Zuweisung und das Schließen des Kreislaufs sind für die Zukunft vorgesehen.

**Benachrichtigungen bei manuell erstellten Rechnungen**

Wird manuell eine Rechnung vom Typ MANU erstellt, die sich im Status „Created“ befindet und einen Schwellenwert überschreitet, wird eine Benachrichtigung ausgelöst. Der Schwellenwert ist derzeit mit 100 Euro als Platzhalter festgelegt und muss bei Bedarf vom jeweiligen Markt angepasst werden. Der Benutzer, der die Rechnung manuell erstellt hat, kann sie nicht selbst freigeben.

In der Navigationsleiste sehen Benutzer der Marktorganisation ein Glockensymbol mit der Anzahl der Benachrichtigungen. Die Anzahl wird bis 9 angezeigt; bei mehr als 9 Benachrichtigungen erscheint „9+“. Ein Klick auf das Glockensymbol öffnet auf der rechten Seite das Benachrichtigungscenter. Dort sehen Benutzer, welche Benachrichtigungen sie bearbeiten müssen. Jede Benachrichtigung ist mit der passenden Seite verlinkt, um die Freigabe zu erleichtern. Benachrichtigungen, die eine Aktion erfordern, sind mit einem blauen Punkt markiert. Das Center lässt sich über das X schließen, wodurch man zur vorherigen Seite zurückkehrt. Wurde eine Benachrichtigung bereits durch eine Aktion (Freigabe oder Ablehnung) erledigt, wird sie dort nicht mehr angezeigt.

Ist nur eine Rechnung freizugeben, lautet die Meldung „Please approve invoice #Rechnungsnummer“ mit dem Link „Go to invoices“. Ein Klick darauf öffnet die Seite der betreffenden Rechnung. Dort stehen Symbole zum Ablehnen und Freigeben bereit, die beim Überfahren mit der Maus einen Tooltip anzeigen. Zusätzlich gibt es einen Link zur Vertragsnummer, der zum entsprechenden Vertrag im Vertragsmanagement führt. Über die Zurück-Schaltfläche gelangt man zur vorherigen Seite. Die Benachrichtigung bleibt gültig, solange weder abgelehnt noch freigegeben wurde.

Sind mehrere Rechnungen freizugeben, lautet die Meldung „Please approve multiple invoices“. Sie verlinkt auf die Rechnungsübersicht. Diese ist bereits gefiltert und zeigt nur Rechnungen, die manuell erstellt wurden, im Status „Created“ sind, den Schwellenwert von 100 Euro überschreiten und auf die noch keine Freigabe oder Ablehnung angewendet wurde. Rechnungen, die eine Aktion erfordern, sind mit einem blauen Punkt markiert und bieten in der Übersicht nur die Aktionen „View“, „Edit“ und „History“.

Nach einer Freigabe oder Ablehnung wird die Historie der Rechnung um die ausgeführte Aktion ergänzt. Der blaue Punkt an der Rechnung wird nicht mehr angezeigt, die Benachrichtigung entfällt, und der Zähler am Glockensymbol wird aktualisiert.

**Benachrichtigungen bei Kampagnen mit Karenzzeit (Grace Period)**

Bei der Vertragserstellung kann eine Kampagne mit Karenzzeit ausgewählt werden. Zuvor durchläuft der Benutzer folgende Schritte: Er startet auf der Startseite der Vertragserstellung einen neuen Vertrag und wählt den Ablauf (Available Chassis Number, Build to Stock oder Not Available Chassis Number). Anschließend füllt er alle Pflichtfelder der Fahrzeugdaten aus. Das System fragt die Vertragskalkulation ab und zeigt Fahrzeuginformationen sowie passende Produkte mit Preisen und Beschreibungen an. Der Benutzer wählt ein Produkt und konfiguriert Laufzeit, Jahresfahrleistung und Zahlungsintervall. Danach aktiviert er unter dem Zahlungsintervall den Link für den Händlerrabatt und wählt einen Händlerrabatt aus. Es dürfen keine Marktkampagnen angewendet sein. Das System zeigt alle verfügbaren Kampagnen mit Karenzzeit an, der Benutzer wählt eine aus und gibt in einem Textfeld eine Begründung ein.

Mit dem Absenden der Anfrage über die Schaltfläche „Send Request“ wird das Benachrichtigungscenter ausgelöst und eine Benachrichtigung an den MPC (Market Product Contact) gesendet. Dabei werden folgende Daten übermittelt und gespeichert: Name des Händlers, systemseitig erzeugte Uhrzeit und Datum des Versands, Kampagnenname, Kampagnengültigkeit, Karenzzeit in Tagen, Fahrgestellnummer, Kennzeichen und die vom Händler angegebene Begründung.

Der Händler sieht anschließend die Information: „The request has been submited! The market responsible has been notified about your request and will offer a response.“

Der MPC-Benutzer sieht die Benachrichtigung über das Glockensymbol im Benachrichtigungscenter, das sich rechts öffnet. Die Benachrichtigungen sind jeweils mit der passenden Seite verlinkt. Klickt der MPC auf die Benachrichtigung, öffnet sich ein Pop-up mit allen Details, in dem er die Anfrage freigeben oder ablehnen kann.

Bei einer Freigabe erhält der Händler eine neue Benachrichtigung: „Grace Period Campaign "Name" for Contract "XXXXX" has been approved.“ Bei einer Ablehnung lautet sie: „Grace Period Campaign "Name" for Contract "XXXXX" has not been approved.“ In beiden Fällen wird die Vertragserstellung darüber informiert, ob die Anfrage freigegeben oder abgelehnt wurde. Bei einer Freigabe erhält der Händler zudem aktualisierte Vertragsdetails beziehungsweise einen aktualisierten Zahlungsplan.