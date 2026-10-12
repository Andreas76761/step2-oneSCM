# Batch 1236 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 2 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Produkte veröffentlichen und deaktivieren**

In der Produktkalkulation können Benutzer der Rolle MPC den Status eines Produkts manuell steuern und so festlegen, ob es Kunden angeboten und verkauft werden kann. Beide Aktionen erreichen Sie auf der Produktübersichtsseite. Dort öffnen Sie in der Spalte „Actions“ über die drei Punkte das Menü des jeweiligen Produkts.

Die Option „Publish“ steht für Produkte im Status „Ready“ und „Deactivated“ zur Verfügung. Wenn Sie sie wählen, erscheint ein Bestätigungsdialog mit dem Titel „Publish Product“. Der Dialog fragt, ob Sie das Produkt wirklich veröffentlichen möchten, und weist darauf hin, dass es Benutzern danach beim Anlegen neuer Verträge zur Auswahl steht. Mit „Cancel“ schließen Sie den Dialog und brechen den Vorgang ab. Mit „Publish“ schließen Sie den Dialog und setzen den Status des Produkts auf „Published“. Das Produkt und die darin enthaltenen Preise werden damit in die Liste der Produkte aufgenommen, die für die Vertragserstellung angeboten werden. Nur veröffentlichte Produkte werden in der Anfrage nach Produkten und Preisen an den Vertragserstellungsprozess übermittelt.

Die Option „Deactivate“ ist ausschließlich für Produkte im Status „Published“ verfügbar. Sie nehmen ein Produkt damit manuell aus dem Angebot, sodass Kunden es nicht mehr in der Auswahl für die Vertragserstellung sehen. Auch hier erscheint zunächst ein Bestätigungsdialog, und zwar mit dem Titel „Deactivate Product“. Er weist darauf hin, dass das Produkt für Kunden nicht mehr zum Anlegen neuer Verträge verfügbar ist, und bittet um Bestätigung. Mit „Cancel“ schließen Sie den Dialog und brechen den Vorgang ab. Mit „Deactivate“ schließen Sie den Dialog und setzen den Status auf „Deactivated“. Das Produkt und seine Preise werden anschließend aus der Liste der für die Vertragserstellung angebotenen Produkte entfernt.

Nach beiden Aktionen erhalten Sie eine Rückmeldung als Toast-Nachricht. War die Aktion erfolgreich, erscheint die Meldung „<PRODUKTNAME> was successfully published“ beziehungsweise „<PRODUKTNAME> was successfully deactivated“. Konnte die Aktion nicht durchgeführt werden, wird eine Fehlermeldung angezeigt: „<PRODUKTNAME> could not be published.“ beziehungsweise „<PRODUKTNAME> could not be deactivated.“ Die Fehlermeldung enthält eine Schaltfläche „Close“ und bleibt so lange sichtbar, bis Sie sie selbst schließen.

Die Oberfläche folgt den Vorgaben der Mercedes-Benz Workbench und dem vom Kunden freigegebenen UI-Design.

*Hinweis zur Quelle:* In den Rohdaten ist im Testfall zum Veröffentlichen als Menüpunkt „Assign Pricing“ genannt, während die Beschreibung die Option „Publish“ vorsieht. Ich habe mich an der Beschreibung orientiert; die Benennung sollte vor der Veröffentlichung des Handbuchs geprüft werden.