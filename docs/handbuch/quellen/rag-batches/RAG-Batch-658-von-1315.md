# Batch 658 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 18 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Partnerverwaltung: Partner anlegen**

Beim Anlegen eines Partners vom Typ „Dealer" über die Partnerverwaltung wurde die Eingabe im Feld „GSSN Outlet Company ID" bisher auf acht Zeichen begrenzt. In der Praxis sind die Company IDs im Referenzsystem Alice jedoch länger. Das Feld ist daher als Zeichenkette mit einer Länge von bis zu 20 Zeichen ausgelegt.

Außerdem wurde die Prüfung der E-Mail-Adresse beim Anlegen eines Partners angepasst. Zuvor akzeptierte das System ausschließlich Adressen mit der Domain „@mercedes-benz.com"; E-Mail-Adressen anderer Domains wurden mit einer Fehlermeldung als ungültig abgelehnt. Vorgesehen ist, dass das System E-Mail-Adressen aller Domains akzeptiert.

**Kundendetails**

Im Dropdown „Sprache" der Kundendetails steht ausschließlich die Auswahl „Englisch" zur Verfügung. Damit wird die Darstellung an die Bereiche „Vertragserstellung" sowie „Dokumente und Kommunikation" angeglichen, da die Vertragsvorlagen in englischer Sprache vorliegen. Hintergrund ist, dass Benachrichtigungen nicht funktionierten, wenn in den Kundendetails eine andere Sprache, etwa Spanisch, eingestellt war.

**Status des Holders bei Servicevertrag**

Wird ein Servicevertrag erzeugt, bei dem Holder und Payer verschiedene Personen sind und beide als neue Kunden angelegt werden, kann der Holder den Status „temporär" oder „aktiv" erhalten. Ein Status „In Bestätigung" ist nicht erforderlich, da die Daten des Holders nicht an das FI-System übermittelt werden. Der Holder ist nicht derjenige, der für den Servicevertrag zahlt.

**Dealer SAP Debitor Number in der Market-Operation-Tabelle**

Die Market-Operation-Tabelle für die Dealer SAP Debitor Number ist Gegenstand umfassender Prüfungen. Diese betreffen folgende Funktionen:

In der Dealership-Tabelle können Einträge auf der Seite ausgewählt werden, wobei die Anzahl der Spalten die in der Oberfläche angezeigte Anzahl nicht überschreitet. Alle Spaltenüberschriften unterstützen die Sortierung, und die Suche funktioniert für den Dealership-Namen und für das GSSN Outlet. Ein neu angelegtes Dealership lässt sich erfolgreich löschen. Wird die SAP-Debitor-Nummer bereits in einer Rechnung verwendet, ist die Löschen-Schaltfläche deaktiviert.

Beim Registrieren eines Dealerships wird für jedes Eingabefeld eine Fehlermeldung angezeigt, sofern die Eingabe ungültig ist, und die Schaltfläche „Erstellen" bleibt in diesem Fall deaktiviert. Die Registrierung kann erfolgreich abgeschlossen oder abgebrochen werden. Beim Bearbeiten eines Dealerships erscheinen bei ungültigen Eingaben in allen Feldern Fehlermeldungen. Der Bearbeitungsdialog lässt sich abbrechen, und Änderungen können erfolgreich gespeichert werden.

Außerdem kann eine Dealer-Tabelle erfolgreich hochgeladen werden. Enthält die hochgeladene Tabelle fehlerhafte Daten, wird eine Fehlermeldung angezeigt.

**Darstellung der Erstellen- und Bearbeiten-Seiten**

Die Fußzeile der Seiten zum Erstellen und Bearbeiten überlagerte zuvor das Menü sowie den Hintergrund von Dialogfenstern. Dieses Darstellungsproblem wurde behoben.