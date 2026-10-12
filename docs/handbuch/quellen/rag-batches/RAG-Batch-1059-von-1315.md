# Batch 1059 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 69 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Vertragserstellung (Contract Generation)**

Die Vertragserstellung führt Sie in einem Assistenten (Wizard) schrittweise durch den Anlageprozess eines Vertrags. Die Navigation im Assistenten funktioniert sowohl mit als auch ohne Aktualisierung der eingegebenen Daten. Bei der Produktauswahl werden die Pflichtfelder geprüft, darunter ungültige Angaben wie ein fehlerhaftes Zulassungsdatum oder eine ungültige Fahrgestellnummer. Die Abbrechen-Funktion steht dort ebenfalls zur Verfügung, auch für bereits gelöschte Daten. Auf der Seite für Kunden- und Zahlungsinformationen werden Pflichtfelder auf Fehler geprüft und die maximal zulässige Eingabelänge validiert. Auch die Funktionen „Abbrechen“ und „Zurück“ sind dort verfügbar. Bei der Kundenprüfung unterscheidet das System zwischen dem Ablauf für Neukunden und dem für Bestandskunden. Auf der Seite „Übersicht & Bestätigung“ werden die Kundendaten validiert. Ein Vertrag kann anschließend erfolgreich erstellt und aktiviert werden.

**Startseite, Übersicht und Angebotsverwaltung**

Auf der Startseite können Sie mit mehreren Filtern gleichzeitig suchen. Die Anzahl der angezeigten Zeilen entspricht der gewählten Anzahl. Wird eine Aktivierung abgebrochen, wird der Status „Abgelehnt“ (Rejected) korrekt dargestellt. Auf der Übersichtsseite lässt sich ein erstellter Vertrag über den Kundennamen finden, sowohl per Klick auf die Suchschaltfläche als auch durch Drücken der Eingabetaste. In der Angebotsverwaltung (Offer Management) kann die Tabelle auf- und absteigend sortiert werden.

**MO-Prüfungen**

Bei den MO-Prüfungen wird auf der Vorschauseite der Status korrekt angezeigt. Die Tabellen lassen sich auf- und absteigend sortieren. Die Anzahl der angezeigten Verträge ist kleiner oder gleich der Anzahl, die zur Anzeige ausgewählt wurde.

**Fehlerbehebungen und Verbesserungen**

Im Zuge der Weiterentwicklung wurden zahlreiche Probleme behoben. Dazu zählen Korrekturen bei der Massenanlage: Wird die Kennungsliste erneut eingefügt, werden Werte nicht mehr falsch zugeordnet und die Pflichtfeldmeldung wird nicht mehr überschrieben. Auch Fahrzeuge, die per Massenanlage (BTS) erstellt wurden, lassen sich nun mit FRD- und Kennzeichenwerten aktualisieren. Die Felder für den tatsächlichen Kilometerstand und das Kennzeichen lassen keine Eingaben über die maximale Zeichenzahl hinaus mehr zu. Benutzer mit der Rolle „Nur Ansicht“ können die Kennung nicht mehr ändern.

Verbessert wurden außerdem die Reifenthemen: Die Auswahl des Reifenlieferanten zeigt nicht mehr fälschlich „Extern“ an, wenn die Reifenkostenstelle Mercedes Benz ist, und bei komplexen Produkten wird kein Platzhalter mehr für den Reifenlieferanten angezeigt. Ein interner Serverfehler bei Verträgen mit komplexer Reifenoption wurde behoben.

Weitere Korrekturen betreffen die Zahlung und Dokumente: Ein Zahlungsplan kann auch dann erstellt werden, wenn der Gesamtnettopreis zuvor nicht gesetzt war. Der Zahlungsplanentwurf wird nach dem Hinzufügen einer Kennung mit älterem FRD neu zugeordnet. Das SEPA-Dokument kann ohne Fehlermeldung heruntergeladen werden. Ein Vertrag mit der Zahlungsart Überweisung lässt sich nicht mehr aktivieren, wenn beim Schuldner die Kontonotiz KB oder ZZ hinterlegt ist. Auf der Seite „Übersicht & Bestätigung“ wird die fehlende Auftragsnummer nun angezeigt, und das Fenster zur Aktualisierung der Fahrgestellnummer erscheint wie vorgesehen.

Auch bei Sonderfällen und Kampagnen gab es Korrekturen: Verträge im Sonderfall werden nicht mehr wegen fehlender Rabatte auf Vertragsebene abgelehnt, die Branche im Sonderfall-Ablauf wird richtig angezeigt, und die Vertragserstellung schlägt bei Kampagnen, die nur für gewerbliche Kunden gelten, nicht mehr mit „Invalid campaign“ fehl. Ein Preisabgleichsfehler bei Kontingentverträgen im Baumuster-Ablauf wurde behoben, ebenso ein Fehler bei der Erstellung von Vertragsvorschlägen (DecodeException).

Bei der Unterschrift wurden die Texte der Optionen für die digitale Unterschrift angepasst. Die Unterschrift kann aus der Angebotsverwaltung erneut ausgelöst werden, und die Unterschrift eines signierten bzw. validierten Vertrags mit Druckdokument kann bestätigt werden. In der Vertragsprüfung ist im Filterbereich der regulären Prüfung nun ein Produkt auswählbar. Zudem wird bei der Produktkonfiguration keine zusätzliche Anfrage mehr ausgelöst, bevor eine Konfiguration erfolgt ist. Die Prüfung der Vorlage für die Produktveröffentlichung funktioniert ebenfalls wieder. Außerdem wurden der nicht funktionierende Hyperlink, die fehlende Zahlungsinformation für Privatkunden auf dem Schweizer Markt sowie die Fehlermeldung „No industries selected“ für gewerbliche staatliche Kunden behoben.

**Noch in Bearbeitung**

Einige Punkte sind noch nicht abgeschlossen. Dazu gehören Zahlungspläne mit Raten über 0,00 EUR bei Produkten mit einer Verkaufslogik ohne FRD-Bezug, ein Reifenoptionspreis, der die Verwaltungsgebühr des komplexen Produkts enthält, sowie ein Fehler bei der Massenanlage, bei dem Kennungen ohne FRD einen Fehler statt einer Validierung auslösen. Das fehlende SCOM-Dokument für MBSK befindet sich in der Prüfung, und ein Authentifizierungsfehler bei der Vertragserstellung ist bereits bestätigt.