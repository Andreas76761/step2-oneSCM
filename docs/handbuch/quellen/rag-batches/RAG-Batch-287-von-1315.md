# Batch 287 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Rechnung löschen im Revenue Management**

Benutzer der Marktorganisation (Market Operation) können im Bereich Revenue Management manuell erstellte Erlöse bzw. Rechnungen löschen. Voraussetzung ist, dass sich die Rechnung im Status „Created“ oder „Approved“ befindet und von einem Benutzer der Marktorganisation erstellt wurde. Dafür muss der Benutzer Zugriff auf den Bereich der Kundenrechnungen (Customer Invoice) haben.

Die Löschfunktion steht im Aktionsmenü der Kundenrechnungstabelle zur Verfügung. Wählt der Benutzer die Option zum Löschen aus, erscheint ein Bestätigungs-Popup mit dem Titel „Delete Invoice“. Das Popup stellt die Frage „Are you sure you want to delete this Invoice?“ und weist darauf hin, dass die Aktion nicht rückgängig gemacht werden kann und alle zugehörigen Details verloren gehen. Der Benutzer wird gebeten, das Vorhaben ausdrücklich zu bestätigen.

Im Popup stehen zwei Aktionen zur Auswahl. Mit „Cancel“ wird das Popup geschlossen, und der Benutzer gelangt zurück zur Kundenrechnungstabelle. Mit „Delete“ wird die Rechnung endgültig aus der Datenbank gelöscht und das Popup geschlossen.

Das Ergebnis des Löschvorgangs wird über eine Toast-Meldung angezeigt. Wurde die Rechnung erfolgreich gelöscht, erscheint die Meldung „Invoice <INVOICE_NUMBER> was successfully deleted“. Kann die Rechnung nicht gelöscht werden, wird die Fehlermeldung „Invoice <INVOICE_NUMBER> could not be deleted.“ angezeigt. Diese Fehlermeldung enthält eine Schaltfläche „Close“ und bleibt so lange sichtbar, bis der Benutzer sie selbst schließt.

Die Gestaltung der Oberfläche folgt der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design. Zu Revisionszwecken wird jede Löschaktion protokolliert.