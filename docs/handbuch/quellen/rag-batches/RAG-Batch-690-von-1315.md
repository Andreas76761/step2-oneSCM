# Batch 690 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 1 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kampagnen-ID in den Finanzdokumenten**

Für Dokumente der Typen Sales Campaign (CAMP) und Special Discount After Sales (SDAS) wird künftig die Kampagne angezeigt, die bei der Vertragserstellung angewendet wurde. Bisher bestand keine Verknüpfung zwischen dieser Kampagne und den genannten Dokumenten. Die neuen Angaben machen nachvollziehbar, ob und aufgrund welcher Kampagne ein Endpreis zustande gekommen ist, und schaffen eine transparente Beziehung zwischen Dokument und gewährtem Rabatt. Sichtbar sind die Informationen für alle Benutzer, die Zugriff auf die Rechnungsansicht und auf die Seite „Financial Documents“ haben.

**Anzeige in den Dokumenten**

Öffnen Sie in der Vertragsverwaltung (Contract Management) einen Vertrag und darin ein CAMP- oder SDAS-Dokument, finden Sie zwei neue Felder. Das Feld „Campaign Name“ steht unmittelbar nach dem Feld „Document Date“ und zeigt den Namen der Kampagne, die bei der Vertragserstellung angewendet wurde. Der Name ist ein Link: Ein Klick darauf führt Sie zur Detailansicht der Kampagne. Direkt nach dem Kampagnennamen folgt das Feld „External Campaign ID“. Beide Felder werden ausschließlich bei CAMP- und SDAS-Rechnungen angezeigt; bei allen anderen Rechnungstypen erscheinen sie nicht.

**Anzeige in der Tabelle „Financial Documents“**

Auf der Seite „Financial Management > Financial Documents“ stehen zwei neue Spalten zur Verfügung: „Campaign Name“ und „External Campaign ID“. Um sie zu sehen, scrollen Sie in der Tabelle nach rechts. Auch hier ist der Kampagnenname ein Link, der Sie zur Kampagnenansicht weiterleitet, und zwar sowohl bei CAMP- als auch bei SDAS-Dokumenten. Die Spalte „External Campaign ID“ zeigt die ID der Kampagne an. Laden Sie die Rechnungen herunter, sind beide Spalten auch in der heruntergeladenen xlsx-Datei enthalten.

**Filtern nach Kampagne**

Beide Angaben stehen außerdem als Filterkriterien bereit. Klicken Sie auf der Seite „Financial Documents“ auf „More Filters“, öffnet sich ein Dialogfenster mit zwei neuen Dropdown-Listen: „Campaign Name“ und „External Campaign ID“. Die Liste „Campaign Name“ enthält die Namen aller verfügbaren Kampagnen, die Liste „External Campaign ID“ deren IDs, jeweils unabhängig vom Status der Kampagne. Wählen Sie mindestens einen Eintrag aus und klicken Sie auf „Apply“, werden alle CAMP- und SDAS-Dokumente angezeigt, auf die die gewählte Kampagne angewendet wurde.

**Hinweis zum Stand der Planung**

Einige Details sind noch nicht abschließend geklärt. Dazu gehören die Fragen, ob die Dropdown-Listen durchsuchbar sein sollen, ob der angezeigte Kampagnenname in den Rechnungen auf eine bestimmte Zeichenzahl begrenzt und bei Überschreitung per Tooltip vollständig dargestellt werden soll, ob die neuen Spalten am Tabellenende stehen sollen und wie mit nachträglich umbenannten oder geänderten Kampagnen umgegangen wird. Die endgültige Darstellung kann sich daher noch ändern.