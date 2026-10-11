# Batch 733 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

Werkstattrechnungen annehmen oder stornieren

Sobald eine Werkstattrechnung angelegt wird, erhält sie den Status „Created“. Alle Werkstattrechnungen werden im Admin-Bereich unter „Invoices“ angezeigt, wo Benutzer der Rolle Market Operation die neu angelegten Rechnungen einsehen können.

Für Werkstattrechnungen im Status „Created“ stehen die beiden Optionen „Accept“ und „Cancel“ zur Verfügung. Um sich an der Bedienung der Kundenrechnungen zu orientieren, werden diese Optionen bei Werkstattrechnungen nicht im Aktionsmenü angeboten. Stattdessen öffnet der Benutzer die Rechnung über die Ansicht „View“. Dort stehen die Schaltflächen zum Annehmen und zum Stornieren der Rechnung bereit.

Wählt ein Market-Operation-Benutzer die Option „Accept“, erscheint ein Bestätigungs-Popup. Mit „Cancel“ in diesem Popup bleibt der aktuelle Status der Rechnung unverändert und das Popup wird geschlossen. Mit „Confirm“ wird der Status der Rechnung auf „Accepted“ gesetzt und das Popup ebenfalls geschlossen. Wurde die Rechnung erfolgreich angenommen, erscheint die Erfolgsmeldung „Workshop invoice <INVOICE_NUMBER> was successfully accepted“. Lässt sich der Status nicht ändern, wird die Fehlermeldung „An error occurred while accepting workshop invoice <INVOICE_NUMBER>“ angezeigt.

Wählt der Benutzer die Option „Cancel“, erscheint ebenfalls ein Bestätigungs-Popup. Auch hier belässt „Cancel“ den aktuellen Status und schließt das Popup, während „Confirm“ den Status der Rechnung auf „Cancelled“ setzt und das Popup schließt. Bei erfolgreicher Stornierung wird die Meldung „Workshop invoice <INVOICE_NUMBER> was successfully cancelled“ angezeigt. Kann die Rechnung nicht storniert werden, erscheint die Fehlermeldung „An error occurred while cancelling the workshop invoice <INVOICE_NUMBER>“.

Fehlermeldungen verfügen über eine Schaltfläche „Close“ und bleiben so lange auf der Oberfläche sichtbar, bis der Market-Operation-Benutzer sie schließt.

Gestaltung und Grafik entsprechen der Mercedes-Benz Workbench sowie dem vom Kunden freigegebenen UI-Design.