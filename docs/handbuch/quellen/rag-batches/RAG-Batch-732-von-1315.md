# Batch 732 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 3 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Import von Schadencodes**

Im Bereich Cost Management können Schadencodes nun in oneSCM importiert werden, sodass sie bei der manuellen Erfassung einer Werkstattrechnung dem jeweiligen Deckungscode zugeordnet und ausgewählt werden können. Die importierten Schadencodes werden zusammen mit ihren Übersetzungen (z. B. DE, EN, FR) gespeichert und stehen für alle Märkte zur Verfügung.

Den Import starten Sie im Admin-Bereich unter „Damage Codes“ über die Schaltfläche „Upload damage codes“. Es öffnet sich ein Popup, in dem Sie eine Datei entweder über die Schaltfläche „Browse“ oder per Drag and Drop von Ihrem Computer auswählen. Zulässig ist ausschließlich das Format .xlsx. Mit „Cancel“ oder dem X schließen Sie das Popup und kehren zur Tabelle der Schadencodes zurück. Die Schaltfläche „Confirm“ ist zunächst deaktiviert und wird erst aktiv, sobald eine Datei ausgewählt wurde. Sie startet den Import, während bis zu dessen Abschluss ein Ladeindikator angezeigt wird.

War der Import erfolgreich, erscheint die Meldung „File <File_name> was successfully imported“. Das Popup wird geschlossen und die importierten Schadencodes werden in der Tabelle angezeigt. Schlägt der Import fehl, erscheint die Meldung „File <File_name> could not be imported.“ mit einer Schaltfläche „Close“. Diese Meldung bleibt sichtbar, bis der Market-Operation-Benutzer sie schließt. Das Popup bleibt geöffnet, sodass Sie eine neue Datei hochladen und den Vorgang wiederholen können.

Die Excel-Datei ist wie folgt aufgebaut: Die Spalte „MSM coverage“ steht für den Deckungscode, „DC+DT“ für den Schadencode, und „dc Description + dt Description“ bilden die Beschreibung des Schadencodes. Zusätzlich ist vorgesehen, zu kennzeichnen, ob ein Code importiert oder manuell angelegt wurde; diese Funktion wird erst später umgesetzt.

Wurden für eine Kombination aus Deckungscode und Division bereits Schadencodes importiert und wird erneut eine Datei für dieselbe Kombination hochgeladen, werden die bisher importierten Schadencodes für diesen Deckungscode gelöscht und durch die neuen ersetzt. Manuell angelegte Schadencodes sind von dieser Löschung ausgenommen.

**Zusätzliche Spalten in der Werkstattrechnungstabelle**

Die Tabelle der Werkstattrechnungen zeigt Market-Operation-Benutzern nun mehr Details. Neu hinzugekommen sind die Spalten „Status“, „oneSCM Invoice Number“, „FI System Transfer Date“, „FI System Processing Number“ und „FI System Invoice Number“. Außerdem wurde die Spalte „Vega Claim Number“ in „Workshop invoice number“ umbenannt.

Die Spalten sind in folgender Reihenfolge angeordnet: Auf „Workshop invoice number“ folgt „Invoice Date“, danach „Status“. Nach „Total Claim Amount“ folgen „oneSCM Invoice Number“, „FI System Transfer Date“, „FI System Processing Number“ und schließlich „FI System Invoice Number“.

**Anhang zur Werkstattrechnung**

Market-Operation-Benutzer können beim Erstellen oder Bearbeiten einer Werkstattrechnung eine Datei als Nachweis hochladen. Der Anhang ist verpflichtend, eine Werkstattrechnung kann also nicht ohne Anhang angelegt werden. Zulässig sind PDF-Dateien, Bilddateien aller Art sowie ZIP-Dateien.

Beim Erstellen einer Werkstattrechnung steht auf der Seite die Schaltfläche „Add Attachment“ zur Verfügung. Darüber wählen Sie eine Datei von Ihrem Computer aus und laden sie in oneSCM hoch. Nach erfolgreichem Hochladen werden der Dateiname und ein x-Symbol angezeigt. Mit dem x löschen Sie den Anhang, woraufhin die Upload-Schaltfläche wieder verfügbar ist. Die Datei kann auch ersetzt werden, indem Sie das Upload-Symbol betätigen. Die hochgeladene Datei wird gespeichert und kann später aufgerufen und angesehen werden.

Im Bearbeitungsmodus lässt sich ausschließlich der Anhang ändern. Dazu löschen Sie die vorhandene Datei über das x und laden eine neue hoch. Nach erfolgreichem Hochladen werden der neue Dateiname und das x angezeigt, und auch diese Datei wird gespeichert.

In der Ansicht der Werkstattrechnung wird der hochgeladene Anhang als Link mit dem Dateinamen dargestellt. Ein Klick auf den Link lädt die Datei herunter.