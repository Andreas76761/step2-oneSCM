# Batch 376 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Dokumente: Hinweis zur Zahlungsplan-Vorschau**

Für Angebots- und Bestätigungsdokumente zu Serviceverträgen steht eine neue Druckvariable mit dem Namen %PlanPreviewNote% zur Verfügung. Sie wird im Dokumenten-Template für die Anwendungsfälle Angebot (Proposal) und Bestätigung (Confirmation) für alle Kunden ergänzt. Der Standardwert lautet: „The final Payment Plan will be created once the first registration date is available. Total Price is unaffected but monthly rates could be subject to reallocation."

Der Hinweis erscheint, wenn es sich um einen Vertrag mit Lagerfahrzeug (Built to Order bzw. Built to Stock, wie in der Quelle bezeichnet) oder um einen Servicevertrag mit Bestellnummer handelt und das Erstzulassungsdatum noch nicht verfügbar ist. Der Grund „First Registration Date not yet available" stammt entweder aus der Benutzeroberfläche, wo er als Kontakt-Grund angegeben wird, oder aus dem Backend bei Serviceverträgen für BTO bzw. BTS, bei denen das Erstzulassungsdatum noch aussteht.

Ist dieser Grund gesetzt, wird im Dokument die Zeile mit der Variable %PlanPreviewNote% ausgegeben. Sie steht direkt unter der Tabelle der Plan-Vorschau. Bisher enthielt das Angebotsdokument in diesem Fall lediglich den Hinweis, dass das Erstzulassungsdatum noch nicht verfügbar ist, sowie die Plan-Vorschau. Nun wird zusätzlich erläutert, dass der endgültige Zahlungsplan erst erstellt wird, sobald das Erstzulassungsdatum vorliegt, dass der Gesamtpreis davon unberührt bleibt und dass sich die monatlichen Raten jedoch noch verschieben können.

**Benachrichtigung an den Markenbetreiber (MO) bei abgelehnter Zahlung**

Der Markenbetreiber (MO) wird benachrichtigt, wenn eine Kreditkartenzahlung auch nach drei Versuchen im Abstand von einer Woche abgelehnt wurde. Zusätzlich wird eine E-Mail an die in den Markteinstellungen hinterlegte E-Mail-Adresse gesendet, damit das MO-Team den Vorgang in einem externen System (MS Dynamics) dokumentieren kann.

Die Benachrichtigung im Notification Center wird ausgelöst, wenn alle folgenden Voraussetzungen erfüllt sind: Die Zahlungsart ist Kreditkarte, die Rechnung hat den MPay-Status „refused", der Kunde wurde bereits per E-Mail benachrichtigt, und das System hat die Zahlung dreimal im Abstand von einer Woche erneut versucht.

Sind alle Bedingungen erfüllt, sieht der MO in der Navigationsleiste ein Glockensymbol mit der Anzahl der Benachrichtigungen. Angezeigt werden maximal 9, bei mehr Benachrichtigungen erscheint „9+". Ein Klick auf die Glocke öffnet rechts das Notification Center und zeigt dem MO, welche Benachrichtigungen er bearbeiten muss. Jede Benachrichtigung ist mit der zugehörigen Seite verlinkt, damit der Ablauf einfach und klar bleibt.

Betrifft die abgelehnte Zahlung nur einen Vertrag, erscheint unter „Payment" die Meldung „Contract number has a refused payment." Der Link führt zur Seite Contract Management – Payments – Customer Invoice. Sind mehrere Zahlungen abgelehnt, erscheint unter „Payment" die Meldung „Multiple Contracts have refused payments." Dieser Link führt zum Contract Management.

Führt der MO die Aktion „Retry" aus, wird der Zahlungsverlauf um die durchgeführte Aktion ergänzt. Der blaue Punkt im Contract Management wird danach nicht mehr angezeigt, und die Benachrichtigung erscheint nicht mehr.