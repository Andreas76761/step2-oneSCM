# Batch 757 von 1315 (aus Auswahl) – Fließtext, Teilschritt

_Automatisch mit Claude generiert – Teilergebnis aus 29 Tickets dieser Auswahl. Wird am Ende aller Batches mit den übrigen Teilschritt-Dateien zu einem Gesamttext zusammengeführt. Bitte redaktionell prüfen._

**Release-Hinweise Contract Management**

**Neuer Reiter „Notes" auf der Vertragsdetailseite**

Auf der Vertragsdetailseite steht nun ein zusätzlicher Reiter für Notizen zur Verfügung. Marktnutzer können damit beim Prüfen, Aktivieren und Verwalten von Verträgen relevante Informationen direkt am jeweiligen Vertrag festhalten, anstatt sie separat dokumentieren zu müssen. Der Reiter ist für alle Benutzerrollen sichtbar, mit Ausnahme von Dealer und Dealer Plus. Notizen können in allen Vertragsstatus von „Waiting for Confirmation" bis einschließlich „Closed" hinzugefügt und bearbeitet werden. Lediglich im Status „Created" steht die Funktion nicht zur Verfügung.

Der Reiter enthält eine Tabelle mit den Spalten „Date" (Zeitstempel), „User ID" (Kennung der Person, die die Notiz angelegt hat), „Comment" (der eigentliche Text) und „Action" (mögliche Aktionen je Eintrag). Standardmäßig sind die Einträge absteigend nach Datum sortiert, also die neueste Notiz zuerst. Über die Spaltenüberschriften lässt sich die Tabelle wie andere Tabellen in oneSCM sortieren.

**Notizen hinzufügen, bearbeiten und löschen**

Über die blaue Schaltfläche „Add Note" öffnet sich ein Fenster zur Eingabe einer neuen Notiz. Der Text unterstützt dieselben Formatierungsoptionen wie die Produktbeschreibung, darunter Absätze, Aufzählungslisten und Hyperlinks. Die Eingabe ist ein Pflichtfeld: Die Schaltfläche „Add" bleibt deaktiviert, solange nicht mindestens 10 Zeichen eingegeben wurden. Eine Notiz darf bis zu 4096 Zeichen lang sein. Mit der weißen Schaltfläche „Cancel" wird das Fenster geschlossen, ohne dass etwas in die Tabelle übernommen wird. Mit der blauen Schaltfläche „Add" wird die Notiz zur Tabelle hinzugefügt.

Als Aktionen stehen pro Eintrag „Bearbeiten" und „Löschen" zur Verfügung. Beide Aktionen kann nur die Person nutzen, die die jeweilige Notiz erstellt hat. Beim Bearbeiten öffnet sich dasselbe Fenster wie beim Anlegen, wobei der aktuelle Text bereits im Eingabefeld angezeigt wird und geändert werden kann. Mit „Cancel" wird der Vorgang abgebrochen, mit „Update" wird der Text des Eintrags aktualisiert. Das ursprüngliche Datum der Notiz bleibt dabei unverändert.

Beim Löschen erscheint zur Sicherheit ein Bestätigungsfenster mit den Schaltflächen „Cancel" und „Confirm". Mit „Cancel" wird das Löschen abgebrochen, mit „Confirm" bestätigt. Die Notiz wird dabei „weich" gelöscht: Sie bleibt in der Datenbank erhalten, wird in der Oberfläche jedoch nicht mehr angezeigt. Hinzugefügte und geänderte Notizen werden in der Vertragshistorie nicht berücksichtigt.

**Anpassung der Statuswerte in der i155-Datei**

Für abgelaufene Verträge wird in der i155-Datei im Satz RC05 (Position 137–139) nun ein Code abgebildet, der sich danach richtet, wie der Vertrag abgelaufen ist. Zuvor wurde bei einem Ablauf stets der Wert 003 ausgegeben. Künftig gilt: Bei Ablauf aufgrund der Laufleistung wird 009 ausgegeben, bei Ablauf aufgrund der Zeit 003 und bei Ablauf aufgrund des Kontingents 013. Die zugehörige Dokumentation wurde entsprechend aktualisiert.

**Weitere Korrekturen im Bereich Contract Management**

Darüber hinaus wurden zahlreiche Fehler behoben. Dies betrifft unter anderem folgende Bereiche: die Verarbeitung ungültiger Nachrichten auf einem Kafka-Topic, die Darstellung von Intervallpreisen nach einer Neuzuordnung sowie die Veränderung von Intervallpreisen aus dem Vertragsverkauf nach einer Verlängerung. Ebenso wurden fehlende Preise des Vertragsverkaufs nach einer Verlängerung bei Verträgen ohne erforderliche Unterschrift korrigiert. Außerdem behoben wurden die fehlende Anzeige abgelaufener Verträge nach Kontingent im Historienbereich, die Aktivierung von Verträgen, bei denen alle MO-Prüfungen erledigt waren, sowie Aktivierungsprobleme aufgrund einer fehlenden oder fehlerhaften USt-IdNr. Weitere Korrekturen betreffen die unterschiedlichen Meldungen bei der MO-Prüfung „SAP Debitor Number", einen nicht erzeugten Lastschriftcode, die Fehlermeldung „FI System Status Not Ok Blocked Central Level" bei mehreren Verträgen sowie die Kafka-Berichterstattung zu Deckungsdaten. Zudem wurden der Download eines Entwurfs des Servicedokuments bei Aktivierung ohne erforderliche Unterschrift, das Abrufen der Verkäuferdaten nach Eingabe der E-Mail-Adresse, die Schaltfläche „Restore" in den Markteinstellungen, ein Fehler im Reiter „Payment" bei Verträgen mit komplexen Reifenprodukten, die nicht verfügbare Liste gelöschter Verträge sowie die Aktivierung von Verträgen mit falschem Preis behoben.