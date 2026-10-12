# Batch 679 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Partnerdaten bearbeiten und löschen**

Auf der Ergebnisseite des Partner Managements können Benutzer der Market Operation einzelne Partnerdatensätze über die drei Punkte in der Spalte „Aktionen“ der jeweiligen Zeile bearbeiten oder löschen. Die Darstellung entspricht dem vom Kunden freigegebenen UI-Design, dem Mercedes-Benz Workbench und dem OneSCM Style Guide.

**Partnerdaten bearbeiten**

Wählt der Benutzer die Aktion „Edit“, lassen sich die Felder des Partnerdatensatzes ändern. Sobald die Änderungen vorgenommen wurden, stehen die Optionen „Update“, „Cancel“ und „Reset“ zur Verfügung.

Mit „Update“ werden die Änderungen übernommen. Dabei prüft das System, ob die geänderten Felder dem definierten Format entsprechen. Die Details zu Datenformaten und Validierungen sind in der Datei „Partnerdata Model_DataFormat_Validations_1.0.xlsx“ beschrieben. Nach erfolgreicher Aktualisierung erscheint eine Erfolgsmeldung mit dem Text „Partner Name X“ was successfully updated. Diese Toast-Benachrichtigung wird 15 Sekunden lang angezeigt und verschwindet dann automatisch. Kann ein bearbeitetes Attribut eines Abschnitts nicht aktualisiert werden, erhält der Benutzer eine Meldung wie „Partner section address was not updated. Please try again.“

Mit „Cancel“ verwirft der Benutzer die Änderungen. Es erscheint eine Fehlermeldung mit dem Text „Partner Name X“ was not updated. Diese Toast-Benachrichtigung enthält eine Schaltfläche „Close“ und bleibt so lange sichtbar, bis der Benutzer sie schließt.

Mit „Reset“ kehrt der Benutzer zum vorherigen Stand zurück, ohne dass Änderungen übernommen werden. Er wird auf die Ergebnisseite weitergeleitet, und der Datensatz bleibt unverändert. Dabei erscheint die Benachrichtigung „Partner Name X“ was not changed, die ebenfalls 15 Sekunden lang sichtbar ist und dann verschwindet.

**Partnerdaten löschen**

Über die Aktion „Delete“ können Benutzer der Market Operation einen Partnerdatensatz per Soft Delete löschen. Zunächst erscheint eine Sicherheitsabfrage: „Are you sure you want to delete this item? This action cannot be undone, and you will lose the Partner Data with all the details associated with it. Please confirm that you would like to proceed with the deletion.“ Mit „Delete“ bestätigt der Benutzer den Vorgang, mit „Cancel“ bricht er ihn ab.

Nach erfolgreichem Löschen erscheint die Erfolgsmeldung „Partner Data X“ was successfully deleted, die 15 Sekunden lang angezeigt wird und dann verschwindet. Wird der Löschvorgang abgebrochen oder nicht durchgeführt, erscheint die Fehlermeldung „Partner Data X“ was not deleted. Diese Benachrichtigung enthält eine Schaltfläche „Close“ und bleibt sichtbar, bis der Benutzer sie schließt.

Gelöscht werden können nur Partnerdatensätze, denen keine Verträge zugeordnet sind. Das System prüft dies und zeigt dem Benutzer bei bestehenden Verknüpfungen die Meldung an: „Partner Data cannot be deleted as it is linked to service contracts [list the SCs here]“. An dieser Stelle werden die betroffenen Service-Verträge aufgelistet.