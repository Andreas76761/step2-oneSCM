# Batch 1014 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kulanzkampagne (Grace Period Campaign) in der Vertragserstellung**

Mit der Funktion „Grace Period Campaign" können Händler einen speziellen Kampagnenpreis auch dann an ausgewählte Kunden weitergeben, wenn die Kampagne technisch bereits abgelaufen ist. So lässt sich die Kundenbeziehung gezielt stärken. Voraussetzung ist, dass keine Marktkampagne automatisch angewendet wird.

**Produktauswahl und Kampagnenanfrage**

Zunächst starten Sie die Vertragserstellung über einen der verfügbaren Abläufe und füllen die Pflichtfelder aus. Das System fragt per API die Vertragskalkulation ab und erhält den Basispreis der Produkte (netto und brutto), den Wert der Rabattkampagne (netto und brutto), Kampagnenname, Kampagnenbeschreibung (optional), Kampagnengültigkeit, den Kampagnenzahler (Kostenstelle) sowie die Kulanzfrist der Kampagnen. Anschließend werden die verfügbaren Produkte mit ihren Preisen angezeigt. Sie wählen ein Produkt aus und konfigurieren es.

Unter dem Zahlungsintervall steht neben der Option „Rabatt" der Link „Kampagnenanfrage" zur Verfügung. Die Option „Rabatt" öffnet ein Fenster zur Erfassung des Händlerrabatts. Ein Klick auf „Kampagnenanfrage" öffnet das gleichnamige Fenster. Dort sehen Sie den aktuellen Preis pro Monat und pro Jahr sowie eine Liste der verfügbaren Kulanzkampagnen mit ihren jeweils verbleibenden Gültigkeitstagen. Es kann nur eine Kampagne aus der Liste ausgewählt werden.

Nach der Auswahl werden die Kampagnendetails angezeigt. Der Preis bleibt monatlich und jährlich im Kopfbereich sichtbar. Angezeigt werden außerdem der Kampagnenname (zum Beispiel „Campaign in grace period: Black Friday"), die Anzahl der verbleibenden Tage (zum Beispiel „1 day left") und, sofern vorhanden, die Beschreibung der Kampagne. Zusätzlich ist ein Begründungsfeld als Pflichtfeld auszufüllen. Es ist ein Textfeld mit maximal 200 Zeichen. Über „Abbrechen" schließen Sie das Fenster der Kulanzkampagne. Die Schaltfläche „Anfrage senden" wird erst aktiv, wenn das Begründungsfeld mindestens ein Zeichen enthält.

Nach dem Absenden erscheint die Meldung „Grace Period Campaign has been requested". Zugleich wird eine Benachrichtigung im Global Notification Center zur Freigabe der Kampagne ausgelöst. Außerdem wird erneut die Vertragskalkulation per API abgefragt, um die durch die Kulanzkampagne entstehende Reduzierung zu berechnen. Zurückgegeben werden der Basispreis des Produkts (netto und brutto) und der Wert der Kulanzkampagne (netto und brutto). Der rabattierte Preis ergibt sich aus dem Basispreis abzüglich dieses Werts. Gewährt die Kampagne beispielsweise 10 % Nachlass auf einen Vertrag über 1000 EUR, beträgt der Kampagnenwert 100 EUR und der Preis 900 EUR.

**Darstellung der Preise**

Die Produktkarten zeigen die Werte der Kulanzkampagne nicht an. Wurde ein Händlerrabatt angewendet, wird der alte Preis durchgestrichen und darunter der neue Preis dargestellt. Wurde kein Händlerrabatt angewendet, erscheint nur der ursprüngliche Preis (Basispreis).

**Kunden- und Zahlungsinformationen, Übersicht und Bestätigung**

In Schritt 2 der Vertragserstellung erfassen Sie die Kunden- und Zahlungsinformationen. In Schritt 3, „Übersicht und Bestätigung", werden alle automatisierten Prüfungen ausgelöst und die Vertragsnummer vergeben. Der Vertrag wird mit dem Basispreis beziehungsweise dem Preis inklusive Händlerrabatt (falls zutreffend) erzeugt, jedoch ohne die Werte der Kulanzkampagne, und erhält den Status „Created". In der Übersicht werden der Basispreis und/oder der Preis mit Händlerrabatt angezeigt. Rabatte der Kulanzkampagne werden dort bewusst nicht dargestellt.

Bei der Bestätigung wird DSS gestartet und der Vertrag auf den Status „Confirmed" gesetzt. Wurde der Ablauf „Build to Stock" gewählt, bleibt der Vertrag in diesem Status, bis FRD verfügbar ist. Andernfalls wechselt er in den Status „Waiting for Activation".

**Freigabe durch den Markt und Aktivierung**

Nach der Benachrichtigung im Global Notification Center entscheidet der Markt über die Kampagnenanfrage. Genehmigt der Markt die Anfrage, erhält der Händler über das Global Notification System eine Benachrichtigung mit dem neuen, gültigen Preis. Wird die Anfrage nicht genehmigt, wird der Händler ebenfalls benachrichtigt und darüber informiert, dass die Kulanzkampagne nicht genehmigt wurde.

Der Vertrag wird aktiviert, sobald alle Prüfungen erfolgreich sind, DSS erfasst wurde, die CAS-Prüfung durchgeführt wurde, die SAP-Debitorennummer vergeben ist und die SEPA-Gültigkeit vorliegt. Andernfalls bleibt er im bisherigen Status, bis alle Prüfungen bestanden und die Informationen erfasst sind. Der Vertrag verbleibt maximal 7 Tage im Status „Waiting for Activation", um die Genehmigung oder Ablehnung der Kulanzkampagne abzuwarten. Wird die Anfrage innerhalb von 7 Tagen nach dem Antrag nicht entschieden, wird der Vertrag aktiviert und die Anfrage für die Kulanzkampagne verworfen.

**Nach der Aktivierung**

Sobald der Vertrag aktiv ist, wird i155 erzeugt und der Vertrag in die Ansicht „Vertragsmanagement" verschoben. Zudem erhält das Revenue Management eine Benachrichtigung mit dem Basispreis (netto und brutto), dem Wert der Kampagne (netto und brutto), der Kostenstelle des Marktes, dem Händlerrabattwert (netto und brutto) sowie der SAP-Debitorennummer des Händlers.

**Gestaltung**

Die Oberfläche entspricht dem Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.