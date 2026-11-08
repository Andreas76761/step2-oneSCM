# Batch 735 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Werkstattrechnungen im Bereich Cost Management**

**Details einer Werkstattrechnung ansehen**

Als Market-Operation-Benutzer können Sie die Details einer Werkstattrechnung einsehen. Klicken Sie dazu auf die Werkstattrechnungsnummer der gewünschten Rechnung. Daraufhin öffnet sich die Detailseite, auf der alle Felder schreibgeschützt sind. Angezeigt werden die oneSCM-Rechnungsnummer, die Verarbeitungsnummer, das Übertragungsdatum an das Finanzsystem, die Rechnungsnummer des Finanzsystems, die Werkstattrechnungsnummer, der Werkstattname, das Rechnungsdatum, der Dokumenttyp, der Werkstattrechnungstyp, der aktuelle Kilometerstand (km), das Reparaturdatum, die Währung, die Partnernummer (VEGA-ID), die Fahrgestellnummer sowie der Nettogesamtbetrag und der Bruttogesamtbetrag. Rechnungs- und Reparaturdatum werden im Format TT.MM.JJJJ dargestellt, zum Beispiel 16.05.2023. Im Bereich der Rechnungspositionen werden die Deckungscodes und Schadencodes wie auf der Erfassungsseite angezeigt, jedoch ohne die Spalte „Aktionen“. Sie sehen somit alle Angaben zur Rechnung sowie die Details der Deckungs- und Schadencodes im Anzeigemodus.

**Statusverlauf einer Werkstattrechnung anzeigen**

Für jede Rechnung können Sie nachvollziehen, wann und durch wen sich der Status geändert hat. Jede Statusänderung wird protokolliert. Der Eintrag enthält das Änderungsdatum als UTC-Zeitstempel im Format TT.MM.JJJJ HH:mm:ss UTC, den Verursacher der Änderung, den alten und den neuen Statuswert sowie den Grund. Wurde die Änderung durch einen Batch-Job ausgelöst, wird dessen Benutzername gespeichert. Geht sie auf eine Benutzeraktion zurück, etwa das Anlegen einer manuellen Rechnung, die Freigabe einer Rechnung oder die Bestätigung von Korrekturen, wird der Benutzername der handelnden Person erfasst. Wurde die Rechnung über einen Zahlungsplan erzeugt, lautet der alte Status „-“. Als Grund wird bei Batch-Änderungen „Automatic Change due to Batch Execution.“ gespeichert. Bei Benutzeraktionen, die eine Begründung erfordern, wird diese hinterlegt; erfordert die Aktion keine Begründung, wird „-“ gespeichert und angezeigt.

Den Verlauf öffnen Sie entweder per Klick auf den Status der Rechnung oder über die Spalte „Aktion“ mit der Option „See History“. Beide Wege öffnen ein Popup mit einer Tabelle und einer Schaltfläche „Back“. Alle Spalten der Tabelle sind sortierbar; standardmäßig wird nach Änderungsdatum sortiert, wobei die neuesten Einträge oben stehen. Das Popup zeigt bis zu zehn Einträge an. Enthält die Tabelle mehr Einträge, wird der Inhalt scrollbar. Mit „Back“ oder dem Schließen-Symbol „X“ schließen Sie das Popup und gelangen zurück zur Kundenrechnungstabelle.

**Manuell erstellte Werkstattrechnung löschen**

Market-Operation-Benutzer können manuell erstellte Werkstattrechnungen löschen. Die Löschoption steht nur für Rechnungen im Status „Created“ zur Verfügung, die manuell durch einen Market-Operation-Benutzer angelegt wurden. Solche Rechnungen erkennen Sie am Werkstattrechnungstyp „Manual Claim“. Für importierte Werkstattrechnungen wird die Löschoption nicht angezeigt.

Wählen Sie die Löschoption, erscheint ein Bestätigungspopup mit dem Titel „Delete“ und der Frage „Are you sure you want to delete this Workshop Invoice?“. Der Hinweistext lautet: „This action cannot be undone and you will lose all the details associated with it. Please confirm that you would like to proceed with the deletion.“ Mit „Cancel“ schließen Sie das Popup und kehren zur Werkstattrechnungstabelle zurück. Mit „Delete“ wird die Rechnung endgültig aus der Datenbank gelöscht und das Popup geschlossen.

Nach erfolgreichem Löschen erscheint die Meldung „Invoice <ONE_INVOICE_NUMBER> was successfully deleted“. Kann die Rechnung nicht gelöscht werden, wird die Fehlermeldung „Invoice <ONE_INVOICE_NUMBER> could not be deleted.“ angezeigt. Diese Fehlermeldung verfügt über eine Schaltfläche „Close“ und bleibt sichtbar, bis Sie sie schließen.

**Rechnungsposition einer Werkstattrechnung löschen**

Sie können einen Schadencode aus einer Werkstattrechnung entfernen, und zwar sowohl beim Erstellen als auch beim Bearbeiten einer Werkstattrechnung. In der Spalte „Actions“ öffnen Sie über die drei Punkte eine Liste, in der die Option „Delete“ verfügbar ist. Nach Auswahl öffnet sich ein Bestätigungspopup mit dem Text: „Are you sure you want to delete this invoice position? This action cannot be undone. Please confirm that you would like to proceed with the deletion.“

Mit „Cancel“ oder dem „X“-Button wird das Popup geschlossen, ohne dass die Position gelöscht wird. Mit „Delete“ wird das Popup geschlossen und die gewählte Rechnungsposition gelöscht. Die Änderung wird in der Tabelle der Rechnungspositionen übernommen: Die Beträge der Deckungscodes werden neu berechnet, und der Schadencode verschwindet aus der Tabelle. Hat ein Deckungscode nur einen einzigen Schadencode und wird dieser gelöscht, wird auch die Zeile des Deckungscodes in der Oberfläche entfernt.

Alle beschriebenen Oberflächen entsprechen der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.