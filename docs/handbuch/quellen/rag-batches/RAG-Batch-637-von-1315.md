# Batch 637 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 20 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Customer & Partner Management**

Bei der Erfassung manueller Werkstattrechnungen im Kostenbereich unterstützt das System nun die Händlerdaten automatisiert. Mitarbeitende der Market Operation geben dafür die Rechnungsdaten ein, darunter Werkstattrechnungsnummer, Rechnungsdatum, Dokumenttyp, Reparaturdatum und Währung. Zusätzlich tragen sie die Partnernummer (Vega-ID) manuell ein. Das Feld für die SAP-Debitorennummer ist neu in der Oberfläche und bleibt ausgegraut, bis eine Antwort aus der Händlerverwaltungstabelle vorliegt. Nach dem Ausfüllen der Felder prüft die Rechnungskomponente (Revenue) in der Händlerverwaltungstabelle des Customer-Management-Bereichs, ob zur Partnernummer bereits ein Eintrag existiert.

Existiert ein Eintrag, werden der Name und die SAP-Debitorennummer an Revenue zurückgemeldet. Existiert noch kein Eintrag, ruft das System die Details aktiver Händlerbetriebe aus GSSN+ ab, legt einen neuen Eintrag in der Tabelle an und übermittelt den Namen an Revenue. Die SAP-Debitorennummer wird anschließend manuell von der Market Operation ergänzt und im System gespeichert. Ist die Vega-ID in GSSN+ nicht vorhanden, wird ein Ereignis an Revenue gesendet und kein neuer Tabelleneintrag erstellt.

Weitere Verbesserungen betreffen die Händlerverwaltung und die Kundenerfassung. Das Sortieren nach SAP-Debitorennummer in der Händlerverwaltung führt nicht mehr zu einem Fehler, und das Anlegen eines noch nicht registrierten Händlers funktioniert wieder. Der Zugriff von Händlern auf die Händlerverwaltung wurde eingeschränkt. Zudem wurde ein Fehler beim Erstellen des Reporting-DTOs behoben.

Im Bereich der systeminternen Benachrichtigungen werden Benachrichtigungen nun gelöscht, wenn alle zugehörigen Rechnungen ausgeglichen sind. Das Stornieren einer Rechnung, die einer Freigabe bedarf, führt nicht mehr zu einem Fehler.

Außerdem steht eine Download-Funktion für NACOs zur Verfügung. In der Kundenerfassung wurde die Fehlermeldung beim Anlegen eines Vertrags mit ungültiger Mercedes-Me-ID überarbeitet, die Zahlungsinformationen werden bei einem neuen Zahler korrekt aktualisiert, und die Hinweise zum Überschreiben von Adressfeldern erscheinen nicht mehr bereits zu Beginn.