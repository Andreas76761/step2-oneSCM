# Batch 1002 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Contract Generation: Erweiterte Berechtigungen für die Rolle MPC**

Die Rolle MPC erhält künftig alle Berechtigungen, die bisher der Rolle MO vorbehalten waren. Hintergrund ist, dass in manchen Märkten kein MO existiert und der MPC dessen Aufgaben mitübernimmt. Bisher konnte die Rolle HQ PM Verträge weder einsehen noch anlegen oder aktivieren. Mit der Änderung kann ein MPC Verträge bereits vor der Aktivierung einsehen und Produkte anhand einer bestimmten Kennung durchsuchen. Er kann außerdem neue Verträge erstellen und alle Verträge des ihm zugewiesenen Marktes unabhängig vom Vertragsstatus anzeigen. Verträge im Status „Waiting for Activation" kann er manuell aktivieren oder ablehnen. Zudem hat er Zugriff auf den MO Check.

**Contract Generation: Anpassung der Grace-Period-Kampagne**

Die Bearbeitung von Grace-Period-Anfragen wurde an die täglichen Anwendungsfälle der Märkte angepasst. Bisher wurde die Anfrage für eine Grace-Period-Kampagne gestellt, sobald ein Vertrag den Status CONFIRMED erreichte, und der MPC konnte sie genehmigen, solange sich der Vertrag im Status „Waiting for Activation" befand. Künftig wird die Anfrage bereits an den MPC zur Freigabe gesendet, wenn der Vertrag den Status CREATED erreicht. Der MPC kann die Kampagne genehmigen, solange der Vertrag in einem der Status Created, Confirmed oder Waiting for Activation ist. Ein Vertrag kann nicht manuell auf Aktiv gesetzt werden, solange der MPC die Grace-Period-Anfrage weder genehmigt noch abgelehnt hat.

Für die Genehmigung oder Ablehnung gilt eine Wartezeit von sieben Tagen. Erfolgt innerhalb dieser Frist keine Entscheidung, wird die Anfrage einschließlich des Eintrags im MPC Notification Center gelöscht. Die Vertragsaktivierung wird dann mit den ursprünglich konfigurierten Preisen ohne Grace-Period-Kampagne fortgeführt.

Im ersten Anwendungsfall möchte der Kunde den Vertrag nur abschließen, wenn die Grace-Period-Kampagne genehmigt wird. Der Händler startet die Vertragserstellung und wählt die gewünschte Kampagne aus. Sobald der Vertrag den Status CREATED erreicht, wird die Anfrage an den MPC gesendet, der sie genehmigt oder ablehnt. Anschließend entscheidet der Kunde, ob er mit der Aktivierung fortfahren möchte. Falls nicht, wird der Vertrag nach einer Frist auf Rejected gesetzt; die Dauer dieser Frist (im Ticket mit 30 Tagen angegeben) ist noch nicht abschließend geklärt. Wird die Grace Period genehmigt und befindet sich der Vertrag noch im Status Created, werden die Preise in Übersicht und Bestätigung sowie die Werte im zu unterzeichnenden Vertrag aktualisiert. Danach folgt die Bestätigung durch Auslösen von DSS. Der Vertrag wird erst auf CONFIRMED gesetzt, wenn er unterzeichnet wurde (bei DSS und On-Premise-Fällen). Der übrige Ablauf der Vertragserstellung bleibt unverändert.

Im zweiten Anwendungsfall wartet der Kunde die Entscheidung des MPC nicht ab. Hier bleibt der Ablauf wie bisher, und der MPC kann die Kampagne annehmen oder ablehnen, solange der Vertrag im Status CREATED, CONFIRMED oder Waiting for Activation ist. Die Benutzeroberfläche und das Bedienkonzept ändern sich dadurch nicht.

**Contract Generation: Produkte und Preise pro Kilometer**

Die Contract Generation fragt bei der Contract Calculation Produkte, Preise und Kampagnen ab, die zu den eingegebenen Kriterien passen. Künftig liefert die Produktberechnung zusätzlich den Preis pro Kilometer, der im Vertrag gespeichert wird. Dieser Preis wird in der Benutzeroberfläche nur im Bereich der Vertragsprüfung (Contract Review) angezeigt. Wird die Vertragserstellung gestartet, enthält die Antwort somit die Produkte mit ihren Preisen einschließlich des Preises pro Kilometer.