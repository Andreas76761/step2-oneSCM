# Batch 1283 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 10 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Produktverwaltung und Produktpflege (Contract Calculation)**

In der Suche nach Baumustern (Bereich „Fahrzeuggruppen verwalten“) sowie auf der Seite „Produkte und Preise verwalten“ lässt sich über ein Auswahlfeld festlegen, wie viele Einträge pro Seite angezeigt werden. Zuvor zeigte das Feld nach der Auswahl von 20, 30 oder 50 Einträgen weiterhin den Standardwert 10 an, obwohl die Liste die gewählte Anzahl darstellte. Jetzt gibt das Auswahlfeld den tatsächlich gewählten Wert korrekt wieder. Auf der Startseite der Produktverwaltung funktioniert außerdem die Sortierung nach Produktname: Die Spalte lässt sich nun auf- und absteigend sortieren. Die Suche auf der Seite „Produkte und Preise verwalten“ lieferte zuvor nur auf der ersten Seite zuverlässig Ergebnisse. Sie zeigt nun auch dann die Treffer an, wenn man sich auf der zweiten, dritten oder einer weiteren Seite befindet.

Ein veröffentlichtes Produkt lässt sich nun auch dann veröffentlichen, wenn es sich im Status „Deaktiviert“ befindet. Zuvor erschien in diesem Fall eine Fehlermeldung, und das Produkt blieb deaktiviert.

**Anlegen von Limits**

Im Dialog „Limit erstellen“ wurden mehrere Eingaben verbessert. Das Feld für den Namen der Voreinstellung verlangt nun mindestens 3 und höchstens 50 Zeichen. Wird ein zu kurzer Name eingegeben, bleibt die Schaltfläche „Erstellen“ inaktiv, und die Fehlermeldung erscheint direkt unter dem Namensfeld. Die Angaben „Years“ und „Km“ in Klammern beginnen jetzt mit einem Großbuchstaben. Darüber hinaus übernimmt der Dialog die Wertebereiche für Fahrzeugalter und Fahrzeugfahrleistung nun korrekt aus den Minimal- und Maximalwerten, die der Benutzer im Schritt „Konfiguration 2“ für Gesamtfahrleistung und Gesamtlaufzeit festgelegt hat. Änderungen an diesen Werten werden also beim erneuten Öffnen des Dialogs berücksichtigt.

**Assistent zum Anlegen eines Produkts**

Im Ablauf zum Anlegen eines Produkts bleiben Fehlermeldungen zu ungültigen Eingaben jetzt erhalten, wenn man mit „Zurück“ einen Schritt zurückgeht und anschließend mit „Weiter“ wieder zurückkehrt. Dies betrifft insbesondere den Schritt „Konfiguration 2“ und ebenso die Eingaben im Schritt „Basisproduktinformationen“.

Im Schritt „Zahlungsoptionen“ beginnen die Bezeichnungen der Felder nun mit Großbuchstaben, zum Beispiel „One Time“, „One Time Admin Fee“, „One Time Amount“ und „Monthly Admin Fee“. Das Feld „One Time Amount“ erlaubt jetzt Dezimalstellen und nimmt maximal 5 numerische Zeichen entgegen, von denen 2 als Nachkommastellen dienen, zum Beispiel 112.50.

Auch die Benachrichtigungen im Assistenten wurden korrigiert. Beim Speichern als Entwurf erscheint nun eine Meldung über den erfolgreichen Vorgang. Wird im Schritt „Zahlungsoptionen“ als Entwurf gespeichert, bleibt der Benutzer auf diesem Schritt und wird nicht mehr automatisch zur Zusammenfassung weitergeleitet. Beim Erstellen, Aktualisieren und Löschen eines Limits wird jeweils die passende Benachrichtigung angezeigt. Zuvor waren die Meldungen vertauscht, sodass etwa beim Erstellen eines neuen Limits „Aktualisiert“ erschien.