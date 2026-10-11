# Batch 694 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 16 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Kostenmanagement: Neuerungen und Änderungen**

**Inaktive Händler bei manuellen Werkstattrechnungen**
Mit der Einführung inaktiver Händler in der Händlerverwaltung berücksichtigt auch die manuelle Erstellung von Werkstattrechnungen den Status eines Händlers sowie das Datum, seit dem er inaktiv ist. Im Suchfeld „Search Dealer (Name or VEGA ID)“ werden inaktive Händler rot dargestellt. Nutzt man die erweiterte Suche („Advance Search“), wird im Auswahlfenster zu jedem Händler der Status (aktiv oder inaktiv) angezeigt, wobei der Status „Inaktiv“ ebenfalls rot hervorgehoben ist. Wählt ein Benutzer einen inaktiven Händler aus, erscheint die Warnung „Dealer is inactive. Please ensure that is the correct dealer“. Die Erstellung der Rechnung bleibt dennoch möglich; die Verantwortung für die Richtigkeit des Empfängers liegt beim Benutzer. Wurde eine Rechnung mit einem inaktiven Händler erstellt, wird im Bestätigungsdialog des Freigabeschritts zusätzlich die Warnmeldung angezeigt. Dort muss der Benutzer per Kontrollkästchen bestätigen, dass die SAP-Debitorennummer korrekt und im FI-System vorhanden ist. Solange das Kontrollkästchen nicht aktiviert ist, bleibt die Schaltfläche „Confirm“ deaktiviert.

**Schadencodes**
Auf Werkstattrechnungen wird nun die Beschreibung des ausgewählten VEGA-Schadencodes angezeigt. Beim Speichern der Rechnung wird nur die Kennung des Schadencodes sowie die Beschreibung in der Standardsprache des Marktes gespeichert. Bei der Anzeige wird die Beschreibung dynamisch aus den VEGA-Codes abgerufen und in der Sprache des Benutzers dargestellt. Ändert der Benutzer seine Spracheinstellung in der Oberfläche, wird die Beschreibung in der neu gewählten Sprache angezeigt. Ist für die gewählte Sprache keine Übersetzung verfügbar oder existiert der Schadencode nicht mehr, wird auf die auf der Rechnung gespeicherte Beschreibung zurückgegriffen. Ein behobener Fehler betraf die Anzeige der Übersetzungen der Schadencodes beim Wechsel der Benutzersprache.

Außerdem kann ein Schadencode nun gezielt nur für eine bestimmte Division angelegt werden. Beim Anlegen sind die Divisionen weiterhin anhand des Deckungscodes (Coverage Code) vorausgewählt, selbst wenn dort mehrere Divisionen hinterlegt sind. Das Feld „Division“ ist eine Auswahlliste mit den Werten aus dem Deckungscode. Der Benutzer kann eine Division abwählen oder auswählen. Beim Klick auf „Create“ wird der Schadencode nur für die ausgewählte Division angelegt.

**Gutschriften bei manuellen Werkstattrechnungen**
Für manuelle Werkstattrechnungen können keine spontanen Gutschriften mehr erstellt werden. Möglich ist ausschließlich eine Stornierung (Typ Gutschrift) zu einer bestehenden manuellen Werkstattrechnung.

**Marktkonfiguration**
Unter „Market Settings > Market Config > Mpay Config“ wird das Feld „Transaction Type“ nicht mehr angezeigt.

**Weitere Korrekturen und Prüfungen**
Behoben wurden folgende Probleme: Der Lieferantenname wurde in der Tabelle auf dem Reiter „Supplier Financial Document“ nicht angezeigt. Ein CCIN konnte nicht angelegt werden. Auf der Seite „Cross File Transfer“ wurden verschiedene Probleme korrigiert. Auf der Vorproduktionsumgebung führten abgelaufene Zertifikate dazu, dass beim Senden von Nemesis-Ereignissen über „Finance Management > Nemesis > Historical Data Sync“ einzelne Daten nicht übermittelt werden konnten; auch dieses Problem wurde behoben.

Darüber hinaus wurden Prüfungen zu folgenden Themen durchgeführt: Der Rechnungskopftext ist bei manuellen Werkstattrechnungen ein Pflichtfeld. Die Bezeichnung „Comments“ wurde für alle Rechnungstypen in „Internal comments“ umbenannt. Externe SCOM-Rechnungen der Division VAN werden nicht an das FI-System exportiert. Zudem wurde die Anzeige von Originalwert und Umrechnungswert der Laufleistung für verschiedene Laufleistungstypen in einem I156-Claim geprüft.