# Batch 683 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Datensatz-Aktionen in den Kundendaten**

Auf der Ergebnisseite des Menüs „Kundendaten" enthält die Ergebnistabelle die Spalte „Action". Über die drei Punkte in dieser Spalte stehen Benutzern der Market Operation die Aktionen „Edit" (Bearbeiten) und „Delete" (Löschen) für den jeweiligen Datensatz zur Verfügung.

**Kundendatensatz bearbeiten**

Wählt der Benutzer „Edit", kann er die Felder des Kundendatensatzes ändern. Mit „Update" schließt er die Bearbeitung ab, mit „Cancel" bricht er sie ab. Wurde eine Kundendatendatei bereits an ein anderes System gesendet, lässt sich der Abschnitt mit den Zahlungsdetails nicht mehr ändern. In diesem Fall informiert oneSCM den Benutzer mit der Meldung „Payment details cannot be changed anymore."

Nach einer erfolgreichen Bearbeitung erscheint die Erfolgsmeldung „"Customer Name X" was successfully updated". Diese Benachrichtigung wird 15 Sekunden lang angezeigt und verschwindet dann automatisch. Die Kundendaten sind in drei Hauptabschnitte gegliedert. Wird ein bearbeitetes Attribut eines Abschnitts nicht aktualisiert, erhält der Benutzer eine Meldung, zum Beispiel „Customer section address was not updated. Please try again." Wird die Bearbeitung abgebrochen, erscheint die Fehlermeldung „"Customer Name X" was not updated". Diese Fehlermeldung enthält die Schaltfläche „Close" und bleibt so lange sichtbar, bis der Benutzer sie schließt.

**Kundendatensatz löschen**

Wählt der Benutzer „Delete", erscheint zunächst eine Sicherheitsabfrage: „Are you sure you want to delete this item? This action cannot be undone, and you will lose the Customer Data with all the details associated with it. Please confirm that you would like to proceed with the deletion." Mit „Delete" bestätigt der Benutzer den Vorgang, mit „Cancel" bricht er ihn ab. Nach erfolgreichem Löschen erscheint die Meldung „"Customer Data X" was successfully deleted", die 15 Sekunden sichtbar bleibt und dann verschwindet. Wird das Löschen nicht durchgeführt, erscheint die Fehlermeldung „"Customer Data X" was not deleted". Auch diese enthält die Schaltfläche „Close" und bleibt sichtbar, bis der Benutzer sie schließt.

**Prüfung der Verwendung von Kundendaten**

Es können nur Kundendatensätze per „Soft Delete" gelöscht werden, die weder für einen aktiven Vertrag noch für mit dem Kunden verbundene Fahrzeuge noch für eine unbezahlte Rechnung verwendet werden. „Soft Delete" bedeutet, dass der Datensatz in der Benutzeroberfläche nicht mehr angezeigt wird, aber weiterhin für Berichtszwecke berücksichtigt wird.

Das System prüft, ob ein Kundendatensatz für einen aktiven Vertrag oder eine unbezahlte Rechnung verwendet wird, und zeigt dem Benutzer eine entsprechende Systemmeldung an: „Customer Data can be deleted", wenn der Datensatz nicht verwendet wird, bzw. „Customer Data in use", wenn er verwendet wird. Kann ein Datensatz wegen aktiver Verträge oder unbezahlter Rechnungen nicht gelöscht werden, weist oneSCM den Benutzer darauf hin. Die Schaltfläche „Delete" ist nur für Kunden aktiv, die sich im temporären Status befinden.

**Gestaltung**

Die Oberfläche entspricht der Mercedes-Benz Workbench sowie dem vom Kunden freigegebenen UI-Design und folgt dem OneSCM Style Guide.