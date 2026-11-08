# Batch 723 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Cost Management: Neuerungen und Änderungen**

**Import der i156-Datei**

Beim Import der i156-Datei wird nun deren Struktur geprüft, damit keine fehlerhaften Daten in oneSCM gelangen. Die erste Prüfung vergleicht die im Satz vom Typ 01 angegebenen Satzanzahlen mit den tatsächlich in der Datei enthaltenen Zeilen. Der Satz vom Typ 01 enthält die Anzahl der gesendeten Sätze der Typen 10, 20, 50, 60 und 70. Diese Werte werden jeweils mit der Summe der Zeilen des entsprechenden Satztyps abgeglichen. Weichen die Zahlen voneinander ab, wird die Datei nicht importiert und ein Fehler in DataDog protokolliert.

Die zweite Prüfung betrifft die Zeilenlänge: Jede Zeile muss genau 600 Zeichen umfassen. Andernfalls wird die Datei ebenfalls nicht importiert und ein Fehler in DataDog protokolliert. Die dritte Prüfung sucht nach NULL-Zeichen in einer Zeile. Wird ein solches Zeichen gefunden, wird ein Fehler für den betroffenen Schadenfall in DataDog protokolliert und dieser Schadenfall übersprungen.

**Schadencodes bearbeiten**

Benutzer der Market Operation können den Inhalt eines Schadencodes bearbeiten, um ihn aktuell zu halten. Die Bearbeitung ist nur für manuell angelegte Schadencodes möglich. Die Schaltfläche zum Bearbeiten finden Sie in der Spalte „Action“ unter Admin Section → VEGA Codes → Damage Codes. Nach dem Klick öffnet sich ein Assistent mit drei Schritten.

Im ersten Schritt „Damage code“ können Sie die Deckung (Coverage) per Dropdown ändern und den Schadencode damit einer neuen Deckung zuordnen. Außerdem können Sie die Sparte (Division) anpassen. Da jede Zeile der Tabelle für eine Sparte gilt, wird beim Auswählen einer neuen Sparte ein neuer Datensatz mit denselben Angaben für diese Sparte angelegt. Wird eine Sparte abgewählt, wird der zugehörige Datensatz gelöscht. Ferner können Sie die Schadenart (Damage type) ändern. Existiert die neue Kombination aus Sparte, Schadencode und Schadenart bereits, erscheint beim Speichern oder bei der nächsten Anzeige eine entsprechende Fehlermeldung. Zudem lassen sich die Standardbeschreibungen von Schadencode und Schadenart bearbeiten; diese werden für später hinzugefügte Märkte verwendet. Mit „Cancel“ beenden Sie den Bearbeitungsmodus, mit „Next“ gelangen Sie zum nächsten Schritt.

Im zweiten Schritt „Market“ bearbeiten Sie die Märkte, wobei mindestens ein Markt ausgewählt sein muss. Für jeden ausgewählten Markt können Sie die Beschreibung (Übersetzung) anpassen. Hier stehen „Cancel“, „Back“ zum Zurückgehen und Ändern der Werte sowie „Next“ zur Verfügung.

Im dritten Schritt „Overview & Confirmation“ sehen Sie eine Übersicht Ihrer Änderungen. Sie können den Vorgang mit „Cancel“ abbrechen, mit „Back“ zurückgehen und Werte ändern oder die Änderungen mit „Confirm & Save“ speichern.

**Validierung beim Import von Schadencodes**

Der Import von Schadencodes wurde um zusätzliche Prüfregeln erweitert, damit keine fehlerhaften Daten in die Datenbank gelangen. Für den Import muss die in oneSCM bereitgestellte Vorlage verwendet werden. Vor dem Import wird die Kopfzeile der Datei geprüft. Entspricht sie nicht der bereitgestellten Vorlage, wird die Datei ignoriert, dem Benutzer wird eine Meldung angezeigt und eine Warnung in DataDog protokolliert.

Auch die Feldformate werden geprüft. Das Feld Division muss für VAN mit „T/***“ und für PC mit „P/***“ befüllt sein; bei anderen Werten wird die Zeile ignoriert und eine Warnung in DataDog protokolliert. Das Feld Market darf maximal drei Buchstaben enthalten: „ALL“ steht für alle in oneSCM verfügbaren Länder, ansonsten ist ein zweistelliger Alpha-2-Ländercode (zum Beispiel „DE“ oder „RO“) anzugeben, der mit der Marktliste in oneSCM übereinstimmen muss. Beim Coverage Code bzw. Coverage Code Reference wird geprüft, ob der Code in der Coverage-Tabelle existiert; andernfalls wird die Zeile ignoriert und eine Warnung in DataDog protokolliert.

Zusätzlich wird auf Duplikate geprüft, und zwar für dieselbe Kombination aus Division sowie Schadencode und Schadenart (7 Stellen), sowohl innerhalb der Datei als auch gegenüber bereits vorhandenen Schadencodes in der Datenbank. Die bestehende Regel bleibt bestehen: Manuell angelegte Schadencodes werden nicht überschrieben.

Die Importvorlage wurde außerdem um Spalten für Übersetzungen der Beschreibungen von Schadencodes und Schadenarten erweitert. Diese Spalten stehen rechts in der Vorlage und tragen zur Kennzeichnung der Sprache den Alpha-2-Ländercode, zum Beispiel „Damage Code Description DE“ und „Damage Type Description DE“. Der Import erkennt, ob die Datei Übersetzungen für weitere Märkte enthält, und importiert diese in der jeweils passenden Sprache. Enthält die Datei nicht alle Übersetzungen, wird sie ignoriert und eine Warnung in DataDog protokolliert.

**Manuelle Testausführung**

Für den Bereich Cost Management stehen derzeit noch manuelle Testausführungen aus. Sie betreffen folgende Funktionen: das Löschen einer Rechnungsposition bei Werkstattrechnungen, das Bearbeiten einer Rechnungsposition bei Werkstattrechnungen in der Detailansicht, das Hochladen eines Anhangs zu einer Werkstattrechnung, die Vermeidung doppelter Steuercodes sowie die Anzeige der letzten fünf Läufe jedes Batch-Jobs.