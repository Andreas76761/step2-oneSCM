# Batch 981 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 4 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Neustrukturierung der Vertragsdetailseite**

Wenn ein Vertrag über die Angebotsverwaltung (Offer Management) oder die Vertragsverwaltung (Contract Management) geöffnet wird, werden Vertrags- und Produktinformationen nicht mehr in getrennten Registerkarten angezeigt. Die Produktdetails sind in die Registerkarte „Contract“ integriert, sodass Händler-, MO- und MPC-Benutzer alle relevanten Informationen an einer zentralen Stelle finden. Die Registerkarte „Product“ entfällt.

Die Registerkarte „Contract“ enthält den Abschnitt „Contract Details“ mit den zugehörigen Feldern. Zusätzlich gibt es den neuen Abschnitt „Coverage Details“. Er listet die enthaltenen und die optionalen Deckungen in einer Tabelle mit den Spalten „Coverage Code“, „Coverage Type“, „Coverage Name“ und „Price (incl. VAT)“ auf. Pro Seite werden 10 Deckungen angezeigt, zusätzlich zeigt die Anzeige „Results“ an, wie viele Einträge es insgesamt gibt (zum Beispiel „2 of 2“ oder „11 of 20“). Bei enthaltenen Deckungen wird kein Preis angezeigt. Bei optionalen Deckungen wird der Preis angezeigt, der bei der Vertragserstellung genannt wurde.

**Änderung der Händlerdaten**

Rollen MO und MPC können einen Vertrag bei der Vertragserstellung einem bestimmten Händler zuordnen, der die Nachbetreuung übernimmt und die zugehörige Provision erhält. Wurde der Vertrag versehentlich dem falschen Händler zugeordnet, kann diese Zuordnung während der Widerrufsfrist (Cooling-off-Periode, also solange eine Stornierung nach Aktivierung noch möglich ist) korrigiert werden. Die Änderung ist ausschließlich für die Rollen MO und MPC möglich. Der Vertrag muss sich im Status „Waiting for Activation“, „Active“ oder „Suspended“ befinden.

Ist der Vertrag noch nicht aktiviert, erfolgt die Änderung in der Angebotsverwaltung. Ist er bereits aktiviert oder ausgesetzt, erfolgt sie in der Vertragsverwaltung. Dort wird der Vertrag ausgewählt und die Registerkarte „Contract“ geöffnet. Die Angaben zum ursprünglich zugeordneten Händler sind bereits vorbefüllt: E-Mail-Adresse, Verkäufer (Sales Person), Händlername (Dealership Name), Stadt (City) und GSSN-ID.

Über das Bearbeitungssymbol wird das Feld für die E-Mail-Adresse editierbar. Es prüft, ob die Eingabe ein gültiges E-Mail-Format hat. Sobald die E-Mail-Adresse eingetragen ist, wird der Name des Verkäufers schreibgeschützt angezeigt. Im Feld „Dealership Name“ erscheint eine Auswahlliste aller Händlerbetriebe, die dieser Benutzerkennung zugeordnet sind. Gibt es nur eine Option, wird sie direkt übernommen, und es ist keine Auswahlliste nötig. Entsprechend zeigt das Feld „City“ eine Auswahlliste aller verfügbaren Städte des gewählten Händlerbetriebs, auch hier wird eine einzelne Option direkt übernommen. Die GSSN+-ID wird schreibgeschützt angezeigt.

Beim Bestätigen wird der Benutzer aufgefordert, einen Grund für die Änderung anzugeben. Mit „Save“ werden die Änderungen gespeichert, mit „Cancel“ wird das Bestätigungsfenster geschlossen, und über das „X“ werden alle Änderungen verworfen. Nach dem Speichern werden die an Revenue übermittelten Informationen zur Provision nach Ablauf der Widerrufsfrist entsprechend angepasst. Ist die Widerrufsfrist abgelaufen, können in der Registerkarte „Dealer“ der Vertragsverwaltung keine Felder mehr bearbeitet werden.

Damit die Inhalte einheitlich gepflegt sind, werden E-Mail-Adresse, Stadt und Händlername auch dann erfasst und angezeigt, wenn der Vertrag direkt von einem Händler erstellt wird.

**Weitere Hinweise**

Die Gestaltung der Oberfläche entspricht den Vorgaben der Mercedes-Benz Workbench sowie dem vom Kunden freigegebenen UI-Design.