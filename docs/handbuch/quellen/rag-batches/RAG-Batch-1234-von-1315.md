# Batch 1234 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Preisversionen – Übersicht und Verwaltung**

Im Bereich Contract Calculation können Sie Preisversionen eines Produkts verwalten: neue Versionen anlegen, bestehende bearbeiten oder duplizieren und zukünftige Versionen löschen. Sie erreichen die Übersicht, indem Sie als MPC-Benutzer auf das Symbol für zugewiesene Preise klicken.

**Aufbau der Übersichtsseite**

Oben auf der Seite wählen Sie in einer Dropdown-Liste mit Einfachauswahl das Produkt aus, dessen Preisversionen Sie sehen möchten. Zur Auswahl stehen Produkte mit dem Status „Created", „Ready", „Published" oder „Deactivated". Vorausgewählt ist das zuletzt gewählte Produkt. Wechseln Sie das Produkt, wird die Preisversionsübersicht für das neu gewählte Produkt angezeigt.

Beim Laden der Seite wird die aktuellste Preisversion des gewählten Produkts mit ihren Clustern angezeigt und vorausgewählt. Sobald mindestens eine Preisversion existiert, ist immer eine Version ausgewählt, standardmäßig die aktive, also „aktuelle" Version. Die Tabelle der Preisversionen enthält die Spalten Version, Startdatum, Ablaufdatum (nur bei abgelaufenen Preisversionen), Anzahl der Cluster und Aktionen. Über die Option „Show expired versions", die standardmäßig nicht aktiviert ist, blenden Sie Preisversionen ein, deren Ablaufdatum in der Vergangenheit liegt. Zusätzlich gibt es einen Bereich für die Clustervorschau sowie die Schaltflächen „Create Price Version" und „Back", mit der Sie zur vorherigen Seite zurückkehren.

Hat eine Preisversion noch keinen Cluster, erscheint im Clusterbereich die Meldung „This Price Version has no cluster". In diesem leeren Zustand wird mittittig die Schaltfläche „New Cluster" angeboten. Sobald der erste Cluster angelegt wurde, wandert diese Schaltfläche nach oben rechts.

**Verfügbare Aktionen**

Welche Aktionen möglich sind, hängt vom Zeitraum der Preisversion ab. Bei abgelaufenen Preisversionen können Sie die Version duplizieren. Bei der aktuell gültigen Version stehen Bearbeiten und Duplizieren zur Verfügung, wobei bei den Clustern nur der Name geändert werden kann. Bei zukünftigen Versionen können Sie duplizieren, löschen und die Cluster bearbeiten.

**Bearbeiten**

Bei abgelaufenen Preisversionen und bei Versionen, die bereits in Kraft sind (das aktuelle Datum liegt nach dem Startdatum), lässt sich nur der Name ändern. Liegt das Startdatum einer Version in der Zukunft, können Sie zusätzlich das Startdatum ändern. Wählbar sind dabei nur Daten, die in der Zukunft liegen, nicht jedoch ein Datum vor dem heutigen Tag. Ändern Sie das Startdatum, wird das Enddatum der aktuell gültigen Preisversion auf einen Tag vor dem neuen Startdatum angepasst.

Das Bearbeitungsfenster schließen Sie entweder mit „Update" oder mit „Cancel". „Update" speichert die neuen Daten, „Cancel" verwirft alle Änderungen. Nach erfolgreicher Bearbeitung erhalten Sie die Erfolgsmeldung „Price Version X" was successfully updated. Wird das Bearbeiten abgebrochen, erscheint die Hinweismeldung „Price Version X" was not updated. Diese Hinweise enthalten eine Schaltfläche „Close" und sind 15 Sekunden sichtbar, sofern Sie sie nicht vorher schließen.

**Löschen**

Löschen können Sie ausschließlich Preisversionen, die in der Zukunft liegen. Vor dem Löschen erscheint eine Sicherheitsabfrage mit dem Text: „Are you sure you want to delete this item? This action cannot be undone, and you will lose the Price Version with all the details associated with it. Please confirm that you would like to proceed with the deletion." Mit „Delete" schließen Sie den Löschvorgang ab, mit „Cancel" brechen Sie ihn ab. Nach erfolgreichem Löschen erhalten Sie die Meldung „Price Version X" was successfully deleted. Beim Abbruch erscheint „Price Version X" was not deleted. Auch diese Hinweise haben eine Schaltfläche „Close" und bleiben 15 Sekunden sichtbar oder bis Sie sie schließen.

Wird eine Preisversion gelöscht, wird das Enddatum der vorherigen Preisversion entfernt, sodass diese kein Enddatum mehr hat. Folgen auf die zu löschende Version weitere Versionen, erscheint ein abweichender Bestätigungsdialog. Darin bestätigen Sie die Löschung und auch, dass die nächste Preisversion das Startdatum der gelöschten Version übernimmt.

**Duplizieren**

Über „Duplicate" können Sie eine Preisversion duplizieren. Es öffnet sich ein Fenster, in dem Sie Name und Startdatum angeben. Der Name ist mit „Copy of <Name der kopierten Preisversion>" vorbelegt. Als Startdatum können nur Daten in der Zukunft gewählt werden; standardmäßig ist ein Datum eine Woche in der Zukunft eingetragen. Beim Duplizieren werden alle enthaltenen Cluster kopiert. Die kopierten Cluster behalten ihren bisherigen Namen, stehen aber in keiner Beziehung und keiner Verknüpfung zu den ursprünglichen Clustern.